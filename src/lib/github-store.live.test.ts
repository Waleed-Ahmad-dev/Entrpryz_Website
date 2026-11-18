/**
 * Live check of the GitHub client against the real GitHub API.
 *
 *   npm run test:github
 *
 * Needs GITHUB_TOKEN and GITHUB_REPO (and optionally GITHUB_BRANCH) in your
 * shell, .env.local or .env: the same values the admin panel uses.
 *
 * It commits nothing. Every write below is one GitHub must reject (stale version,
 * missing version, nonexistent branch), and each sends the file's current bytes,
 * so even an unexpected acceptance would leave content/site.json unchanged.
 */
import { randomBytes } from "node:crypto";
import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  CONTENT_PATH,
  GitHubConflictError,
  GitHubRequestError,
  isGitHubConfigured,
  readRepoFile,
  repoFileExists,
  writeRepoFile,
  type RepoFile,
} from "./github-store";

const MESSAGE = "test: live GitHub error check (must be rejected; never committed)";

let current: RepoFile;
let currentBytes: Buffer;

beforeAll(async () => {
  if (!isGitHubConfigured()) {
    throw new Error(
      "Set GITHUB_TOKEN and GITHUB_REPO (as for the admin panel) in .env.local or your shell, then rerun `npm run test:github`."
    );
  }
  current = await readRepoFile(CONTENT_PATH);
  currentBytes = Buffer.from(current.text, "utf8");
});

/** Runs a write and returns the error it was rejected with (fails the test if it was accepted). */
async function rejection(write: () => Promise<unknown>): Promise<unknown> {
  vi.spyOn(console, "error").mockImplementation(() => {});
  try {
    await write();
  } catch (err) {
    return err;
  }
  throw new Error("GitHub accepted a write that should have been rejected (content was unchanged).");
}

describe("GitHub client against the real API", () => {
  it("reads content/site.json from the configured branch", () => {
    expect(current.sha).toMatch(/^[a-f0-9]{40}$/);
    expect(() => JSON.parse(current.text)).not.toThrow();
  });

  it("checks whether a file exists", async () => {
    expect(await repoFileExists(CONTENT_PATH)).toBe(true);
    expect(await repoFileExists(`public/images/uploads/${"0".repeat(24)}.png`)).toBe(false);
  });

  it("reports a stale version (someone else published) as a conflict", async () => {
    const staleSha = "0".repeat(40);
    expect(await rejection(() => writeRepoFile(CONTENT_PATH, currentBytes, MESSAGE, staleSha))).toBeInstanceOf(
      GitHubConflictError
    );
  });

  it("reports a write without a version to an existing file as a conflict", async () => {
    expect(await rejection(() => writeRepoFile(CONTENT_PATH, currentBytes, MESSAGE))).toBeInstanceOf(
      GitHubConflictError
    );
  });

  it("reports a write to a branch that doesn't exist as a failure, not a conflict", async () => {
    vi.stubEnv("GITHUB_BRANCH", `remediation-check-missing-${randomBytes(6).toString("hex")}`);
    const err = await rejection(() => writeRepoFile(CONTENT_PATH, currentBytes, MESSAGE, current.sha));
    expect(err).toBeInstanceOf(GitHubRequestError);
    expect(err).not.toBeInstanceOf(GitHubConflictError);
  });

  it("reports a read from a branch that doesn't exist as a failure", async () => {
    vi.stubEnv("GITHUB_BRANCH", `remediation-check-missing-${randomBytes(6).toString("hex")}`);
    await expect(readRepoFile(CONTENT_PATH)).rejects.toBeInstanceOf(GitHubRequestError);
  });

  it("left content/site.json unchanged", async () => {
    expect((await readRepoFile(CONTENT_PATH)).sha).toBe(current.sha);
  });
});
