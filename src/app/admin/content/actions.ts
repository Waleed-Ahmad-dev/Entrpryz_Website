"use server";

import { createHash } from "node:crypto";
import { requireAdmin, UnauthorizedError } from "@/lib/admin-auth";
import { MAX_CONTENT_BYTES, PAGE_KEYS, siteContentSchema, type SiteContent } from "@/lib/content-schema";
import {
  CONTENT_PATH,
  GitHubConfigError,
  GitHubConflictError,
  readRepoFile,
  repoFileExists,
  writeRepoFile,
} from "@/lib/github-store";
import { sniffImageFormat } from "@/lib/image-format";

export type SaveResult =
  | { ok: true; sha: string }
  | {
      ok: false;
      reason: "unauthorized" | "invalid" | "conflict" | "unconfigured" | "failed";
      issues?: { path: string; message: string }[];
    };

const SHA_RE = /^[a-f0-9]{40}$/;

/** Compare each page without its `updated` stamp; set today's date where it changed. */
function stampUpdatedPages(previous: Partial<SiteContent>, next: SiteContent) {
  const today = new Date().toISOString().slice(0, 10);
  const strip = (page: unknown) => {
    if (!page || typeof page !== "object") return "";
    const { seo, ...rest } = page as { seo?: Record<string, unknown> };
    // JSON.stringify drops undefined values, so this compares everything except the stamp.
    return JSON.stringify({ ...rest, seo: { ...seo, updated: undefined } });
  };
  for (const key of PAGE_KEYS) {
    if (strip(previous[key]) !== strip(next[key])) next[key].seo.updated = today;
    else if (!next[key].seo.updated && previous[key]?.seo?.updated) next[key].seo.updated = previous[key]!.seo.updated;
  }
}

export async function saveContent(input: { content: unknown; sha: unknown }): Promise<SaveResult> {
  let username: string;
  try {
    username = (await requireAdmin()).sub;
  } catch (err) {
    if (err instanceof UnauthorizedError) return { ok: false, reason: "unauthorized" };
    throw err;
  }

  if (typeof input?.sha !== "string" || !SHA_RE.test(input.sha)) {
    return { ok: false, reason: "conflict" };
  }

  // Cheap size guard before the full schema walk.
  let serialized: string;
  try {
    serialized = JSON.stringify(input.content);
  } catch {
    return { ok: false, reason: "invalid" };
  }
  if (!serialized || Buffer.byteLength(serialized) > MAX_CONTENT_BYTES) {
    return { ok: false, reason: "invalid", issues: [{ path: "", message: "Content is too large." }] };
  }

  const parsed = siteContentSchema.safeParse(input.content);
  if (!parsed.success) {
    return {
      ok: false,
      reason: "invalid",
      issues: parsed.error.issues.slice(0, 50).map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    };
  }

  // Stamp today's date on pages whose content changed (sitemap lastmod).
  const next = parsed.data;
  try {
    const current = await readRepoFile(CONTENT_PATH);
    if (current.sha !== input.sha) return { ok: false, reason: "conflict" };
    stampUpdatedPages(JSON.parse(current.text) as Partial<SiteContent>, next);
  } catch (err) {
    if (err instanceof GitHubConfigError) return { ok: false, reason: "unconfigured" };
    console.error("[admin] content read before save failed:", err instanceof Error ? err.message : "unknown");
    return { ok: false, reason: "failed" };
  }

  // Store the *parsed* value: trimmed, normalized, unknown keys impossible.
  const body = Buffer.from(JSON.stringify(next, null, 2) + "\n", "utf8");
  const safeUser = username.replace(/[^A-Za-z0-9._-]/g, "").slice(0, 40);

  try {
    const { sha } = await writeRepoFile(
      CONTENT_PATH,
      body,
      `content: update site content via admin panel (${safeUser})`,
      input.sha
    );
    return { ok: true, sha };
  } catch (err) {
    if (err instanceof GitHubConflictError) return { ok: false, reason: "conflict" };
    if (err instanceof GitHubConfigError) return { ok: false, reason: "unconfigured" };
    console.error("[admin] content save failed:", err instanceof Error ? err.message : "unknown");
    return { ok: false, reason: "failed" };
  }
}

export type UploadResult = { ok: true; path: string } | { ok: false; error: string };

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof UnauthorizedError) return { ok: false, error: "Your session expired. Sign in again." };
    throw err;
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choose an image to upload." };
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, error: "Image must be 4 MB or smaller." };

  const bytes = Buffer.from(await file.arrayBuffer());
  // The format comes from the file bytes; the browser-supplied MIME type is never trusted.
  const ext = sniffImageFormat(bytes);
  if (!ext) return { ok: false, error: "Only JPG, PNG or WebP images are allowed." };

  // Content-addressed name: no user-controlled filename ever reaches the repo.
  const name = `${createHash("sha256").update(bytes).digest("hex").slice(0, 24)}.${ext}`;
  const repoPath = `public/images/uploads/${name}`;

  try {
    if (!(await repoFileExists(repoPath))) {
      await writeRepoFile(repoPath, bytes, `content: upload image ${name} via admin panel`);
    }
    return { ok: true, path: `/images/uploads/${name}` };
  } catch (err) {
    // Another upload of the same image won the race. The name is the content
    // hash, so the file in the repo is byte-for-byte this image.
    if (err instanceof GitHubConflictError) return { ok: true, path: `/images/uploads/${name}` };
    if (err instanceof GitHubConfigError) return { ok: false, error: "Uploads aren't configured (GitHub settings missing)." };
    console.error("[admin] image upload failed:", err instanceof Error ? err.message : "unknown");
    return { ok: false, error: "Upload failed. Please try again." };
  }
}
