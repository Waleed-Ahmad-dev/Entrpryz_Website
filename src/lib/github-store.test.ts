import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CONTENT_PATH,
  GitHubConfigError,
  GitHubConflictError,
  GitHubRequestError,
  isGitHubConfigured,
  readRepoFile,
  repoFileExists,
  writeRepoFile,
} from "./github-store";

const fetchMock = vi.fn<typeof fetch>();
const UPLOAD = "public/images/uploads/0123456789abcdef01234567.png";

function json(status: number, body: unknown = {}) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("GITHUB_TOKEN", "github_pat_test");
  vi.stubEnv("GITHUB_REPO", "Waleed-Ahmad-dev/Entrpryz_Website");
  vi.stubEnv("GITHUB_BRANCH", "");
});

describe("configuration", () => {
  it("is configured with a token and an owner/name repo", () => {
    expect(isGitHubConfigured()).toBe(true);
  });

  it.each([
    ["no token", { GITHUB_TOKEN: "" }],
    ["no repo", { GITHUB_REPO: "" }],
    ["a repo with a path", { GITHUB_REPO: "owner/name/../other" }],
    ["a repo URL", { GITHUB_REPO: "https://github.com/owner/name" }],
    ["a branch with ..", { GITHUB_BRANCH: "main/../x" }],
    ["a branch with spaces", { GITHUB_BRANCH: "my branch" }],
  ])("is not configured with %s", async (_case, env) => {
    for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
    expect(isGitHubConfigured()).toBe(false);
    await expect(readRepoFile(CONTENT_PATH)).rejects.toBeInstanceOf(GitHubConfigError);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("path allowlist", () => {
  it.each([
    "package.json",
    "src/app/layout.tsx",
    ".github/workflows/ci.yml",
    "content/../package.json",
    "public/images/uploads/evil.svg",
    "public/images/uploads/0123456789abcdef01234567.png/../../../x",
    "public/images/logo.png",
  ])("refuses to touch %s", async (path) => {
    await expect(readRepoFile(path)).rejects.toBeInstanceOf(GitHubRequestError);
    await expect(writeRepoFile(path, Buffer.from("x"), "msg")).rejects.toBeInstanceOf(GitHubRequestError);
    await expect(repoFileExists(path)).rejects.toBeInstanceOf(GitHubRequestError);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("readRepoFile", () => {
  it("reads and decodes the file from the configured branch", async () => {
    fetchMock.mockResolvedValue(
      json(200, { sha: "abc", encoding: "base64", content: Buffer.from('{"a":"é"}').toString("base64") })
    );
    expect(await readRepoFile(CONTENT_PATH)).toEqual({ sha: "abc", text: '{"a":"é"}' });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      "https://api.github.com/repos/Waleed-Ahmad-dev/Entrpryz_Website/contents/content/site.json?ref=main"
    );
    expect(new Headers(init!.headers).get("authorization")).toBe("Bearer github_pat_test");
  });

  it("uses GITHUB_BRANCH when set", async () => {
    vi.stubEnv("GITHUB_BRANCH", "cms-test");
    fetchMock.mockResolvedValue(json(200, { sha: "abc", encoding: "base64", content: "" }));
    await readRepoFile(CONTENT_PATH);
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\?ref=cms-test$/);
  });

  it("reports only the status on failure, never the response body", async () => {
    fetchMock.mockResolvedValue(json(401, { message: "Bad credentials github_pat_test" }));
    await expect(readRepoFile(CONTENT_PATH)).rejects.toThrow(/^GitHub read failed \(401\)\.$/);
  });

  it("rejects an unexpected response shape (e.g. a file too large for inline content)", async () => {
    fetchMock.mockResolvedValue(json(200, { sha: "abc", encoding: "none", content: "" }));
    await expect(readRepoFile(CONTENT_PATH)).rejects.toThrow("Unexpected GitHub response.");
  });
});

describe("writeRepoFile", () => {
  it("commits base64 content to the branch with the expected sha", async () => {
    fetchMock.mockResolvedValue(json(200, { content: { sha: "new" }, commit: { sha: "commit" } }));
    expect(await writeRepoFile(CONTENT_PATH, Buffer.from("hello"), "content: update", "old")).toEqual({
      sha: "new",
      commitSha: "commit",
    });
    const [, init] = fetchMock.mock.calls[0];
    expect(init!.method).toBe("PUT");
    expect(JSON.parse(String(init!.body))).toMatchObject({
      message: "content: update",
      content: Buffer.from("hello").toString("base64"),
      branch: "main",
      sha: "old",
    });
  });

  it("creates a new upload without a sha", async () => {
    fetchMock.mockResolvedValue(json(201, { content: { sha: "new" }, commit: { sha: "commit" } }));
    await writeRepoFile(UPLOAD, Buffer.from([1, 2, 3]), "upload");
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]!.body))).not.toHaveProperty("sha");
  });

  it("maps HTTP 409 (sha no longer current) to a conflict", async () => {
    fetchMock.mockResolvedValue(json(409, { message: "content/site.json does not match abc" }));
    await expect(writeRepoFile(CONTENT_PATH, Buffer.from("x"), "m", "old")).rejects.toBeInstanceOf(
      GitHubConflictError
    );
  });

  it("maps a 422 about the sha to a conflict", async () => {
    fetchMock.mockResolvedValue(json(422, { message: 'Invalid request.\n\n"sha" wasn\'t supplied.' }));
    await expect(writeRepoFile(UPLOAD, Buffer.from("x"), "m")).rejects.toBeInstanceOf(GitHubConflictError);
  });

  // Audit finding #20: every 422 used to be reported as "changed elsewhere, reload".
  it("reports other 422 validation errors as failures and logs GitHub's reason server-side", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockResolvedValue(
      json(422, { message: "Validation Failed", errors: [{ message: "No commit found for the ref cms-test" }] })
    );
    const write = writeRepoFile(CONTENT_PATH, Buffer.from("x"), "m", "old");
    await expect(write).rejects.toBeInstanceOf(GitHubRequestError);
    await expect(write).rejects.toThrow(/^GitHub write failed \(422\)\.$/);
    expect(log).toHaveBeenCalledWith(expect.stringContaining("No commit found for the ref cms-test"));
  });

  it("still fails cleanly when a 422 has no readable body", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockResolvedValue(new Response("<html>", { status: 422 }));
    await expect(writeRepoFile(CONTENT_PATH, Buffer.from("x"), "m", "old")).rejects.toBeInstanceOf(
      GitHubRequestError
    );
  });

  it("reports other failures as request errors", async () => {
    fetchMock.mockResolvedValue(json(500));
    await expect(writeRepoFile(CONTENT_PATH, Buffer.from("x"), "m", "old")).rejects.toThrow(
      /^GitHub write failed \(500\)\.$/
    );
  });
});

describe("repoFileExists", () => {
  it.each([
    [200, true],
    [404, false],
  ])("returns %s → %s", async (status, expected) => {
    fetchMock.mockResolvedValue(new Response(null, { status }));
    expect(await repoFileExists(UPLOAD)).toBe(expected);
    expect(fetchMock.mock.calls[0][1]!.method).toBe("HEAD");
  });

  it("throws on other statuses instead of guessing", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 403 }));
    await expect(repoFileExists(UPLOAD)).rejects.toBeInstanceOf(GitHubRequestError);
  });
});
