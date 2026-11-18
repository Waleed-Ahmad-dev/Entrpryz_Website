import "server-only";

/**
 * Minimal GitHub client used by the admin panel to read site content and publish
 * it as **one commit** (content plus any new images), via the Git Data API.
 *
 * - Uploading an image only creates a git *blob*. A blob is not part of any commit,
 *   so it triggers no deploy; GitHub garbage-collects it if it is never published.
 * - Publishing builds a tree on top of the branch head, commits it, and moves the
 *   branch with a fast-forward-only update, so nothing is ever overwritten.
 *
 * The token must be a fine-grained PAT scoped to this one repository with
 * "Contents: Read and write" only. It never leaves the server, and this module
 * refuses to read or commit any path outside an explicit allowlist.
 */

export const CONTENT_PATH = "content/site.json";
export const UPLOAD_PATH_RE = /^public\/images\/uploads\/[a-f0-9]{24}\.(?:jpg|png|webp)$/;
const SHA_RE = /^[a-f0-9]{40}$/;
const REPO_RE = /^[A-Za-z0-9-]{1,39}\/[A-Za-z0-9._-]{1,100}$/;
const BRANCH_RE = /^[A-Za-z0-9._/-]{1,100}$/;
const API = "https://api.github.com";
const TIMEOUT_MS = 15_000;
const COMMITTER = { name: "Entrpryz Admin", email: "admin@users.noreply.entrpryz.com" };

export class GitHubConfigError extends Error {}
export class GitHubRequestError extends Error {}
/** The branch moved between reading its head and updating it (someone else committed). */
export class GitHubBranchMovedError extends Error {}

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

function assertSha(sha: string) {
  if (!SHA_RE.test(sha)) throw new GitHubRequestError("Invalid object id.");
}

/** `refs/heads/<branch>` with each segment encoded (branch names may contain "/"). */
function branchRef(config: Config): string {
  return `heads/${config.branch.split("/").map(encodeURIComponent).join("/")}`;
}

async function github(config: Config, endpoint: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${API}/repos/${config.repo}/${endpoint}`, {
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

/** Parses a successful JSON response, or throws a status-only error (bodies may echo request details). */
async function expectJson<T>(res: Response, action: string): Promise<T> {
  if (!res.ok) throw new GitHubRequestError(`GitHub ${action} failed (${res.status}).`);
  return (await res.json()) as T;
}

/** GitHub's error `message` (plus validation details), trimmed for server logs. */
async function githubErrorMessage(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: unknown; errors?: unknown };
    const parts = [typeof body.message === "string" ? body.message : ""];
    if (Array.isArray(body.errors)) {
      for (const e of body.errors) {
        const detail = (e as { message?: unknown })?.message;
        if (typeof detail === "string") parts.push(detail);
      }
    }
    return parts.filter(Boolean).join(" | ").replace(/\s+/g, " ").slice(0, 300);
  } catch {
    return "";
  }
}

// ---------- reading ----------

export interface RepoFile {
  /** Git blob id of the file: changes whenever its content changes. */
  sha: string;
  text: string;
}

/** Reads a file from the configured branch, or from a specific commit when `ref` is given. */
export async function readRepoFile(path: string, ref?: string): Promise<RepoFile> {
  assertAllowedPath(path);
  if (ref !== undefined) assertSha(ref);
  const config = getConfig();
  const res = await github(config, `contents/${path}?ref=${encodeURIComponent(ref ?? config.branch)}`);
  const body = await expectJson<{ sha?: unknown; content?: unknown; encoding?: unknown }>(res, "read");
  if (typeof body.sha !== "string" || typeof body.content !== "string" || body.encoding !== "base64") {
    throw new GitHubRequestError("Unexpected GitHub response.");
  }
  return { sha: body.sha, text: Buffer.from(body.content, "base64").toString("utf8") };
}

/** The commit the branch currently points at. */
export async function getBranchHead(): Promise<string> {
  const config = getConfig();
  const body = await expectJson<{ object?: { sha?: unknown } }>(
    await github(config, `git/ref/${branchRef(config)}`),
    "branch lookup"
  );
  const sha = body.object?.sha;
  if (typeof sha !== "string" || !SHA_RE.test(sha)) throw new GitHubRequestError("Unexpected GitHub response.");
  return sha;
}

/** Bytes of a blob (used to verify an uploaded image before it is committed). */
export async function readBlob(sha: string): Promise<Buffer> {
  assertSha(sha);
  const config = getConfig();
  const body = await expectJson<{ content?: unknown; encoding?: unknown }>(
    await github(config, `git/blobs/${sha}`),
    "blob read"
  );
  if (typeof body.content !== "string" || body.encoding !== "base64") {
    throw new GitHubRequestError("Unexpected GitHub response.");
  }
  return Buffer.from(body.content, "base64");
}

// ---------- writing ----------

/** Stores bytes as a git blob. Not part of any commit, so nothing is deployed. */
export async function createBlob(content: Buffer): Promise<string> {
  const config = getConfig();
  const body = await expectJson<{ sha?: unknown }>(
    await github(config, "git/blobs", {
      method: "POST",
      body: JSON.stringify({ content: content.toString("base64"), encoding: "base64" }),
    }),
    "blob upload"
  );
  if (typeof body.sha !== "string" || !SHA_RE.test(body.sha)) throw new GitHubRequestError("Unexpected GitHub response.");
  return body.sha;
}

export interface CommitFile {
  path: string;
  blobSha: string;
}

/**
 * Commits `files` on top of `parentSha` and moves the branch to the new commit.
 * The branch update is fast-forward only: if anyone committed since `parentSha`,
 * GitHub refuses it and this throws GitHubBranchMovedError (nothing is lost; the
 * caller re-reads the head and decides whether to retry).
 */
export async function commitFiles(parentSha: string, files: CommitFile[], message: string): Promise<string> {
  assertSha(parentSha);
  if (files.length === 0) throw new GitHubRequestError("Nothing to commit.");
  for (const file of files) {
    assertAllowedPath(file.path);
    assertSha(file.blobSha);
  }
  const config = getConfig();

  const parent = await expectJson<{ tree?: { sha?: unknown } }>(
    await github(config, `git/commits/${parentSha}`),
    "commit lookup"
  );
  const baseTree = parent.tree?.sha;
  if (typeof baseTree !== "string") throw new GitHubRequestError("Unexpected GitHub response.");

  const tree = await expectJson<{ sha?: unknown }>(
    await github(config, "git/trees", {
      method: "POST",
      body: JSON.stringify({
        base_tree: baseTree,
        tree: files.map((f) => ({ path: f.path, mode: "100644", type: "blob", sha: f.blobSha })),
      }),
    }),
    "tree creation"
  );

  const commit = await expectJson<{ sha?: unknown }>(
    await github(config, "git/commits", {
      method: "POST",
      body: JSON.stringify({ message, tree: tree.sha, parents: [parentSha], author: COMMITTER, committer: COMMITTER }),
    }),
    "commit creation"
  );
  if (typeof commit.sha !== "string" || !SHA_RE.test(commit.sha)) throw new GitHubRequestError("Unexpected GitHub response.");

  const res = await github(config, `git/refs/${branchRef(config)}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: false }),
  });
  if (res.status === 422) {
    const reason = await githubErrorMessage(res);
    if (/fast[\s-]?forward/i.test(reason)) throw new GitHubBranchMovedError("The branch moved.");
    // GitHub's message is logged server-side for diagnosis; it is never returned to the client.
    console.error(`[github] branch update rejected (422): ${reason}`);
  }
  await expectJson(res, "branch update");
  return commit.sha;
}
