import "server-only";
import { createHash } from "node:crypto";
import { PAGE_KEYS, siteContentSchema, type SiteContent } from "./content-schema";
import {
  CONTENT_PATH,
  GitHubBranchMovedError,
  commitFiles,
  createBlob,
  getBranchHead,
  readBlob,
  readRepoFile,
  type CommitFile,
} from "./github-store";
import { sniffImageFormat } from "./image-format";

/**
 * Publishing site content: one commit with content/site.json plus the images it
 * newly references, made on top of the branch's current head.
 *
 * Conflicts are detected per file: publishing fails only if content/site.json
 * changed since the editor loaded it. Unrelated commits (e.g. a code push) don't
 * block a publish; it is simply re-based onto the new head.
 */

export const MAX_UPLOADS_PER_PUBLISH = 20;
const MAX_ATTEMPTS = 3;
const UPLOAD_SRC_RE = /^\/images\/uploads\/([a-f0-9]{24})\.(jpg|png|webp)$/;

/** An image uploaded in this editing session: stored as a blob, not yet committed. */
export interface PendingUpload {
  /** Public path, e.g. /images/uploads/<hash>.png */
  path: string;
  blobSha: string;
}

export type PublishResult =
  | { ok: true; committed: boolean; sha: string; content: SiteContent }
  | { ok: false; reason: "conflict" | "invalid_upload" | "repo_invalid" | "busy" };

/** Serialized exactly as committed (2-space JSON, trailing newline). */
export function serializeContent(content: SiteContent): string {
  return `${JSON.stringify(content, null, 2)}\n`;
}

/** A page without its `updated` stamp, for comparing content. */
function withoutStamp(page: SiteContent[(typeof PAGE_KEYS)[number]]): string {
  return JSON.stringify({ ...page, seo: { ...page.seo, updated: undefined } });
}

/**
 * Sets each page's `seo.updated` (the sitemap lastmod). The repo is the only source:
 * a page whose content changed gets `today`; every other page keeps exactly the
 * date in the repo, whatever the editor sent. Both inputs must be schema-parsed so
 * key order can't make an unchanged page look changed.
 */
export function applyUpdatedStamps(previous: SiteContent, next: SiteContent, today: string): SiteContent {
  const result = structuredClone(next);
  for (const key of PAGE_KEYS) {
    const prior = previous[key].seo.updated;
    if (withoutStamp(previous[key]) !== withoutStamp(next[key])) result[key].seo.updated = today;
    else if (prior) result[key].seo.updated = prior;
    else delete result[key].seo.updated;
  }
  return result;
}

/** Every uploaded image path (/images/uploads/...) referenced anywhere in the content. */
export function referencedUploads(content: SiteContent): Set<string> {
  const found = new Set<string>();
  const walk = (value: unknown) => {
    if (typeof value === "string") {
      if (UPLOAD_SRC_RE.test(value)) found.add(value);
    } else if (Array.isArray(value)) {
      value.forEach(walk);
    } else if (value && typeof value === "object") {
      Object.values(value).forEach(walk);
    }
  };
  walk(content);
  return found;
}

/**
 * Checks that a pending upload's blob really is the image its name says: the right
 * format, and the content hash in the file name matches the bytes. The name is
 * derived from the bytes at upload time, so any mismatch means the request was
 * tampered with.
 */
async function verifyUpload(upload: PendingUpload): Promise<boolean> {
  const match = UPLOAD_SRC_RE.exec(upload.path);
  if (!match || !/^[a-f0-9]{40}$/.test(upload.blobSha)) return false;
  const [, hash, ext] = match;
  const bytes = await readBlob(upload.blobSha);
  return (
    sniffImageFormat(bytes) === ext && createHash("sha256").update(bytes).digest("hex").slice(0, 24) === hash
  );
}

export async function publishContent(options: {
  content: SiteContent;
  /** Blob id of content/site.json when the editor loaded it. */
  baseSha: string;
  uploads: PendingUpload[];
  message: string;
  today: string;
}): Promise<PublishResult> {
  // Only uploads the content actually uses are committed; the rest are dropped.
  const used = referencedUploads(options.content);
  const uploads = [...new Map(options.uploads.filter((u) => used.has(u.path)).map((u) => [u.path, u])).values()];
  for (const upload of uploads) {
    if (!(await verifyUpload(upload))) return { ok: false, reason: "invalid_upload" };
  }

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const head = await getBranchHead();
    const file = await readRepoFile(CONTENT_PATH, head);
    if (file.sha !== options.baseSha) return { ok: false, reason: "conflict" };

    let previous: SiteContent;
    try {
      const parsed = siteContentSchema.safeParse(JSON.parse(file.text));
      if (!parsed.success) return { ok: false, reason: "repo_invalid" };
      previous = parsed.data;
    } catch {
      return { ok: false, reason: "repo_invalid" };
    }

    const next = applyUpdatedStamps(previous, options.content, options.today);
    const text = serializeContent(next);
    // Unchanged content also means no new image is referenced: nothing to commit.
    if (text === file.text) return { ok: true, committed: false, sha: file.sha, content: next };

    const contentSha = await createBlob(Buffer.from(text, "utf8"));
    const files: CommitFile[] = [
      { path: CONTENT_PATH, blobSha: contentSha },
      ...uploads.map((u) => ({ path: `public${u.path}`, blobSha: u.blobSha })),
    ];
    try {
      await commitFiles(head, files, options.message);
      return { ok: true, committed: true, sha: contentSha, content: next };
    } catch (err) {
      // Someone committed between reading the head and moving the branch:
      // re-read and try again (a content change will then surface as a conflict).
      if (err instanceof GitHubBranchMovedError) continue;
      throw err;
    }
  }
  return { ok: false, reason: "busy" };
}
