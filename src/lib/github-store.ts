import "server-only";

/**
 * Minimal GitHub Contents API client used by the admin panel to read and
 * commit site content. Each commit triggers a Vercel redeploy.
 *
 * The token must be a fine-grained PAT scoped to this one repository with
 * "Contents: Read and write" only. It never leaves the server, and this
 * module refuses to touch any path outside an explicit allowlist.
 */

export const CONTENT_PATH = "content/site.json";
const UPLOAD_PATH_RE = /^public\/images\/uploads\/[a-f0-9]{24}\.(?:jpg|png|webp)$/;
const REPO_RE = /^[A-Za-z0-9-]{1,39}\/[A-Za-z0-9._-]{1,100}$/;
const BRANCH_RE = /^[A-Za-z0-9._/-]{1,100}$/;
const API = "https://api.github.com";
const TIMEOUT_MS = 15_000;

export class GitHubConfigError extends Error {}
export class GitHubConflictError extends Error {}
export class GitHubRequestError extends Error {}

interface Config {
  token: string;
  repo: string;
  branch: string;
}

function getConfig(): Config {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo) throw new GitHubConfigError("GITHUB_TOKEN / GITHUB_REPO are not set.");
  if (!REPO_RE.test(repo)) throw new GitHubConfigError("GITHUB_REPO must look like owner/name.");
  if (!BRANCH_RE.test(branch) || branch.includes("..")) {
    throw new GitHubConfigError("GITHUB_BRANCH is invalid.");
  }
  return { token, repo, branch };
}

export function isGitHubConfigured(): boolean {
  try {
    getConfig();
    return true;
  } catch {
    return false;
  }
}

function assertAllowedPath(path: string) {
  if (path !== CONTENT_PATH && !UPLOAD_PATH_RE.test(path)) {
    throw new GitHubRequestError("Refusing to access a path outside the allowlist.");
  }
}

async function github(config: Config, path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${API}/repos/${config.repo}/contents/${path}`, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "entrpryz-admin",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });
}

export interface RepoFile {
  sha: string;
  text: string;
}

export async function readRepoFile(path: string): Promise<RepoFile> {
  assertAllowedPath(path);
  const config = getConfig();
  const res = await github(config, `${path}?ref=${encodeURIComponent(config.branch)}`);
  if (!res.ok) {
    // Status only — never echo the response, which could include request details.
    throw new GitHubRequestError(`GitHub read failed (${res.status}).`);
  }
  const body = (await res.json()) as { sha?: unknown; content?: unknown; encoding?: unknown };
  if (typeof body.sha !== "string" || typeof body.content !== "string" || body.encoding !== "base64") {
    throw new GitHubRequestError("Unexpected GitHub response.");
  }
  return { sha: body.sha, text: Buffer.from(body.content, "base64").toString("utf8") };
}

/**
 * Create or update a file in one commit. Pass the `sha` you read to update:
 * GitHub rejects the write if someone else changed the file meanwhile.
 */
export async function writeRepoFile(
  path: string,
  content: Buffer,
  message: string,
  sha?: string
): Promise<{ sha: string; commitSha: string }> {
  assertAllowedPath(path);
  const config = getConfig();
  const res = await github(config, path, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: content.toString("base64"),
      branch: config.branch,
      ...(sha ? { sha } : {}),
      committer: { name: "Entrpryz Admin", email: "admin@users.noreply.entrpryz.com" },
    }),
  });
  if (res.status === 409 || (res.status === 422 && sha)) {
    throw new GitHubConflictError("The file changed since it was loaded.");
  }
  if (!res.ok) throw new GitHubRequestError(`GitHub write failed (${res.status}).`);
  const body = (await res.json()) as { content?: { sha?: string }; commit?: { sha?: string } };
  return { sha: body.content?.sha ?? "", commitSha: body.commit?.sha ?? "" };
}

/** True if the file already exists (used to skip re-uploading identical images). */
export async function repoFileExists(path: string): Promise<boolean> {
  assertAllowedPath(path);
  const config = getConfig();
  const res = await github(config, `${path}?ref=${encodeURIComponent(config.branch)}`, {
    method: "HEAD",
  });
  if (res.status === 404) return false;
  if (res.ok) return true;
  throw new GitHubRequestError(`GitHub lookup failed (${res.status}).`);
}
