"use server";

import { createHash } from "node:crypto";
import { requireAdmin, UnauthorizedError } from "@/lib/admin-auth";
import { MAX_CONTENT_BYTES, siteContentSchema, type SiteContent } from "@/lib/content-schema";
import { MAX_UPLOADS_PER_PUBLISH, publishContent, type PendingUpload } from "@/lib/content-publish";
import { GitHubConfigError, createBlob } from "@/lib/github-store";
import { sniffImageFormat } from "@/lib/image-format";

export type SaveResult =
  | {
      ok: true;
      /** Version token of the published content (pass it back on the next publish). */
      sha: string;
      /** Exactly what was committed: normalized, with the server's `updated` dates. */
      content: SiteContent;
      /** False when the content already matched the repo, so nothing was committed. */
      committed: boolean;
    }
  | {
      ok: false;
      reason: "unauthorized" | "invalid" | "conflict" | "unconfigured" | "busy" | "failed";
      issues?: { path: string; message: string }[];
    };

const SHA_RE = /^[a-f0-9]{40}$/;

function parseUploads(value: unknown): PendingUpload[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > MAX_UPLOADS_PER_PUBLISH) return null;
  const uploads: PendingUpload[] = [];
  for (const item of value) {
    const { path, blobSha } = (item ?? {}) as Record<string, unknown>;
    if (typeof path !== "string" || typeof blobSha !== "string" || path.length > 200 || !SHA_RE.test(blobSha)) {
      return null;
    }
    uploads.push({ path, blobSha });
  }
  return uploads;
}

export async function saveContent(input: { content: unknown; sha: unknown; uploads?: unknown }): Promise<SaveResult> {
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
  const uploads = parseUploads(input.uploads);
  if (!uploads) return { ok: false, reason: "invalid", issues: [{ path: "", message: "Invalid image list." }] };

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

  const safeUser = username.replace(/[^A-Za-z0-9._-]/g, "").slice(0, 40);
  try {
    const result = await publishContent({
      content: parsed.data,
      baseSha: input.sha,
      uploads,
      message: `content: update site content via admin panel (${safeUser})`,
      today: new Date().toISOString().slice(0, 10),
    });
    if (result.ok) return result;
    switch (result.reason) {
      case "conflict":
        return { ok: false, reason: "conflict" };
      case "busy":
        return { ok: false, reason: "busy" };
      case "invalid_upload":
        return {
          ok: false,
          reason: "invalid",
          issues: [{ path: "", message: "An uploaded image couldn't be verified. Upload it again." }],
        };
      case "repo_invalid":
        console.error("[admin] content/site.json on GitHub fails validation; publishing refused.");
        return { ok: false, reason: "failed" };
    }
  } catch (err) {
    if (err instanceof GitHubConfigError) return { ok: false, reason: "unconfigured" };
    console.error("[admin] content publish failed:", err instanceof Error ? err.message : "unknown");
    return { ok: false, reason: "failed" };
  }
}

export type UploadResult = { ok: true; path: string; blobSha: string } | { ok: false; error: string };

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

/**
 * Stores an image in GitHub as a blob. Nothing is committed or deployed: the image
 * is committed together with the content when the editor publishes (and only if the
 * content still uses it). Unpublished blobs are garbage-collected by GitHub.
 */
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

  try {
    return { ok: true, path: `/images/uploads/${name}`, blobSha: await createBlob(bytes) };
  } catch (err) {
    if (err instanceof GitHubConfigError) return { ok: false, error: "Uploads aren't configured (GitHub settings missing)." };
    console.error("[admin] image upload failed:", err instanceof Error ? err.message : "unknown");
    return { ok: false, error: "Upload failed. Please try again." };
  }
}
