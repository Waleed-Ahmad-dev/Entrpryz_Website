/**
 * Live check of the GitHub client and publish flow against the real GitHub API.
 *
 *   npm run test:github
 *
 * Needs GITHUB_TOKEN and GITHUB_REPO (and optionally GITHUB_BRANCH) in your
 * shell, .env.local or .env: the same values the admin panel uses.
 *
 * It commits nothing and never moves the branch. It reads, stores one blob that
 * already exists (the current content/site.json, so nothing new is created), and
 * runs publishes that must end without a commit: one with a stale version (a
 * conflict) and one with unchanged content (a no-op). The last check confirms the
 * branch head didn't move.
 */
import { randomBytes } from "node:crypto";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { siteContentSchema, type SiteContent } from "./content-schema";
import { publishContent } from "./content-publish";
import {
  CONTENT_PATH,
  GitHubRequestError,
  createBlob,
  getBranchHead,
  isGitHubConfigured,
  readBlob,
  readRepoFile,
  type RepoFile,
} from "./github-store";

let head: string;
let current: RepoFile;
let content: SiteContent;

beforeAll(async () => {
  if (!isGitHubConfigured()) {
    throw new Error(
      "Set GITHUB_TOKEN and GITHUB_REPO (as for the admin panel) in .env.local or your shell, then rerun `npm run test:github`."
    );
  }
  head = await getBranchHead();
  current = await readRepoFile(CONTENT_PATH, head);
  content = siteContentSchema.parse(JSON.parse(current.text));
});

function publish(baseSha: string) {
  return publishContent({
    content,
    baseSha,
    uploads: [],
    message: "test: live check (must not be committed)",
    today: new Date().toISOString().slice(0, 10),
  });
}

describe("GitHub publishing against the real API", () => {
  it("reads the branch head and content/site.json at that commit", () => {
    expect(head).toMatch(/^[a-f0-9]{40}$/);
    expect(current.sha).toMatch(/^[a-f0-9]{40}$/);
  });

  it("stores blobs content-addressed: the current file's bytes give the current file's id", async () => {
    // Same bytes, same git object, so this creates nothing new in the repo.
    expect(await createBlob(Buffer.from(current.text, "utf8"))).toBe(current.sha);
  });

  it("reads a blob's bytes back", async () => {
    expect((await readBlob(current.sha)).toString("utf8")).toBe(current.text);
  });

  it("reports a stale version (someone else published) as a conflict, without committing", async () => {
    expect(await publish("0".repeat(40))).toEqual({ ok: false, reason: "conflict" });
  });

  it("does not commit when the content is unchanged", async () => {
    const result = await publish(current.sha);
    // A repo file formatted differently from the schema output would be re-saved;
    // the content in this repo is written by the admin panel, so it should match.
    expect(result).toMatchObject({ ok: true, committed: false, sha: current.sha });
  });

  it("reports a branch that doesn't exist as a failure", async () => {
    vi.stubEnv("GITHUB_BRANCH", `remediation-check-missing-${randomBytes(6).toString("hex")}`);
    await expect(getBranchHead()).rejects.toBeInstanceOf(GitHubRequestError);
  });

  it("left the branch where it was", async () => {
    expect(await getBranchHead()).toBe(head);
  });
});
