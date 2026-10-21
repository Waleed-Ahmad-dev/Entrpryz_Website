"use server";

import { requireAdmin, UnauthorizedError } from "@/lib/admin-auth";
import { MAX_CONTENT_BYTES, siteContentSchema } from "@/lib/content-schema";
import {
  CONTENT_PATH,
  GitHubConfigError,
  GitHubConflictError,
  writeRepoFile,
} from "@/lib/github-store";

export type SaveResult =
  | { ok: true; sha: string }
  | {
      ok: false;
      reason: "unauthorized" | "invalid" | "conflict" | "unconfigured" | "failed";
      issues?: { path: string; message: string }[];
    };

const SHA_RE = /^[a-f0-9]{40}$/;

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

  // Store the *parsed* value: trimmed, normalized, unknown keys impossible.
  const body = Buffer.from(JSON.stringify(parsed.data, null, 2) + "\n", "utf8");
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
