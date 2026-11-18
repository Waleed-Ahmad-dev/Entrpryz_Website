import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CONTENT_PATH,
  GitHubBranchMovedError,
  GitHubConfigError,
  GitHubRequestError,
  commitFiles,
  createBlob,
  getBranchHead,
  isGitHubConfigured,
  readBlob,
  readRepoFile,
} from "./github-store";

const fetchMock = vi.fn<typeof fetch>();
const REPO = "https://api.github.com/repos/Waleed-Ahmad-dev/Entrpryz_Website";
const UPLOAD = "public/images/uploads/0123456789abcdef01234567.png";
const sha = (c: string) => c.repeat(40);

function json(status: number, body: unknown = {}) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

/** Responds per "METHOD path" (path relative to the repo API root). */
function route(handlers: Record<string, () => Response>) {
  fetchMock.mockImplementation(async (url, init) => {
    const key = `${init?.method ?? "GET"} ${String(url).slice(REPO.length + 1)}`;
    const handler = handlers[key];
    if (!handler) throw new Error(`unexpected request: ${key}`);
    return handler();
  });
}

const calls = () =>
  fetchMock.mock.calls.map(([url, init]) => `${init?.method ?? "GET"} ${String(url).slice(REPO.length + 1)}`);
const bodyOf = (i: number) => JSON.parse(String(fetchMock.mock.calls[i][1]!.body));

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
    await expect(getBranchHead()).rejects.toBeInstanceOf(GitHubConfigError);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("path and id allowlists", () => {
  it.each([
    "package.json",
    "src/app/layout.tsx",
    ".github/workflows/ci.yml",
    "content/../package.json",
    "public/images/uploads/evil.svg",
    "public/images/uploads/0123456789abcdef01234567.png/../../../x",
    "public/images/logo.png",
  ])("refuses to read or commit %s", async (path) => {
    await expect(readRepoFile(path)).rejects.toBeInstanceOf(GitHubRequestError);
    await expect(commitFiles(sha("a"), [{ path, blobSha: sha("b") }], "m")).rejects.toBeInstanceOf(
      GitHubRequestError
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(["main", "../x", "A".repeat(40), "a".repeat(39)])("refuses the object id %j", async (id) => {
    await expect(readBlob(id)).rejects.toBeInstanceOf(GitHubRequestError);
    await expect(readRepoFile(CONTENT_PATH, id)).rejects.toBeInstanceOf(GitHubRequestError);
    await expect(commitFiles(id, [{ path: CONTENT_PATH, blobSha: sha("b") }], "m")).rejects.toBeInstanceOf(
      GitHubRequestError
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("reading", () => {
  it("reads and decodes a file from the configured branch with the token", async () => {
    fetchMock.mockResolvedValue(
      json(200, { sha: "abc", encoding: "base64", content: Buffer.from('{"a":"é"}').toString("base64") })
    );
    expect(await readRepoFile(CONTENT_PATH)).toEqual({ sha: "abc", text: '{"a":"é"}' });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${REPO}/contents/content/site.json?ref=main`);
    expect(new Headers(init!.headers).get("authorization")).toBe("Bearer github_pat_test");
  });

  it("reads a file at a specific commit", async () => {
    fetchMock.mockResolvedValue(json(200, { sha: "abc", encoding: "base64", content: "" }));
    await readRepoFile(CONTENT_PATH, sha("c"));
    expect(calls()).toEqual([`GET contents/content/site.json?ref=${sha("c")}`]);
  });

  it("looks up the branch head, encoding each segment of a nested branch name", async () => {
    vi.stubEnv("GITHUB_BRANCH", "cms/test-1");
    fetchMock.mockResolvedValue(json(200, { object: { sha: sha("d") } }));
    expect(await getBranchHead()).toBe(sha("d"));
    expect(calls()).toEqual(["GET git/ref/heads/cms/test-1"]);
  });

  it("reads blob bytes", async () => {
    fetchMock.mockResolvedValue(json(200, { encoding: "base64", content: "AQID\n" }));
    expect([...(await readBlob(sha("e")))]).toEqual([1, 2, 3]);
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

describe("createBlob", () => {
  it("stores base64 content and returns the blob id, without committing anything", async () => {
    fetchMock.mockResolvedValue(json(201, { sha: sha("f") }));
    expect(await createBlob(Buffer.from("hello"))).toBe(sha("f"));
    expect(calls()).toEqual(["POST git/blobs"]);
    expect(bodyOf(0)).toEqual({ content: Buffer.from("hello").toString("base64"), encoding: "base64" });
  });
});

describe("commitFiles", () => {
  const files = [
    { path: CONTENT_PATH, blobSha: sha("1") },
    { path: UPLOAD, blobSha: sha("2") },
  ];

  function happyPath(patch: () => Response = () => json(200, { object: { sha: sha("9") } })) {
    route({
      [`GET git/commits/${sha("a")}`]: () => json(200, { tree: { sha: sha("b") } }),
      "POST git/trees": () => json(201, { sha: sha("c") }),
      "POST git/commits": () => json(201, { sha: sha("9") }),
      "PATCH git/refs/heads/main": patch,
    });
  }

  it("builds one commit on the parent and fast-forwards the branch to it", async () => {
    happyPath();
    expect(await commitFiles(sha("a"), files, "content: update")).toBe(sha("9"));
    expect(calls()).toEqual([
      `GET git/commits/${sha("a")}`,
      "POST git/trees",
      "POST git/commits",
      "PATCH git/refs/heads/main",
    ]);
    expect(bodyOf(1)).toEqual({
      base_tree: sha("b"),
      tree: [
        { path: CONTENT_PATH, mode: "100644", type: "blob", sha: sha("1") },
        { path: UPLOAD, mode: "100644", type: "blob", sha: sha("2") },
      ],
    });
    expect(bodyOf(2)).toMatchObject({ message: "content: update", tree: sha("c"), parents: [sha("a")] });
    expect(bodyOf(3)).toEqual({ sha: sha("9"), force: false });
  });

  it("reports a branch that moved meanwhile (non-fast-forward) distinctly", async () => {
    happyPath(() => json(422, { message: "Update is not a fast forward" }));
    await expect(commitFiles(sha("a"), files, "m")).rejects.toBeInstanceOf(GitHubBranchMovedError);
  });

  it("reports other branch-update rejections as failures and logs GitHub's reason server-side", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    happyPath(() => json(422, { message: "Reference cannot be updated", errors: [{ message: "protected branch" }] }));
    const commit = commitFiles(sha("a"), files, "m");
    await expect(commit).rejects.toBeInstanceOf(GitHubRequestError);
    await expect(commit).rejects.not.toBeInstanceOf(GitHubBranchMovedError);
    expect(log).toHaveBeenCalledWith(expect.stringContaining("protected branch"));
  });

  it("refuses to make an empty commit", async () => {
    await expect(commitFiles(sha("a"), [], "m")).rejects.toThrow("Nothing to commit.");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("stops before touching the branch if an earlier step fails", async () => {
    route({
      [`GET git/commits/${sha("a")}`]: () => json(200, { tree: { sha: sha("b") } }),
      "POST git/trees": () => json(500),
    });
    await expect(commitFiles(sha("a"), files, "m")).rejects.toThrow(/^GitHub tree creation failed \(500\)\.$/);
    expect(calls()).not.toContain("PATCH git/refs/heads/main");
  });
});
