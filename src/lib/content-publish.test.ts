import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SiteContent } from "./content-schema";
import { siteContentFixture } from "@/test/fixtures";

// Only the GitHub client is mocked; the error classes stay real.
vi.mock("./github-store", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./github-store")>();
  return {
    ...actual,
    getBranchHead: vi.fn(),
    readRepoFile: vi.fn(),
    createBlob: vi.fn(),
    readBlob: vi.fn(),
    commitFiles: vi.fn(),
  };
});

const github = await import("./github-store");
const { applyUpdatedStamps, publishContent, referencedUploads, serializeContent } = await import("./content-publish");

const TODAY = "2026-11-18";
const sha = (c: string) => c.repeat(40);
const FILE_SHA = sha("f");
const HEAD = sha("1");

/** The fixture content as stored in the repo (schema-normalized, 2-space JSON). */
function repoText(content: SiteContent = siteContentFixture()) {
  return serializeContent(content);
}

function repoHas(content: SiteContent = siteContentFixture(), fileSha = FILE_SHA) {
  vi.mocked(github.getBranchHead).mockResolvedValue(HEAD);
  vi.mocked(github.readRepoFile).mockResolvedValue({ sha: fileSha, text: repoText(content) });
}

/** A real PNG fixture and its content-addressed upload path. */
const PNG = readFileSync(path.join(__dirname, "../test/fixtures/images/logo.png"));
const PNG_PATH = `/images/uploads/${createHash("sha256").update(PNG).digest("hex").slice(0, 24)}.png`;

function edited(mutate: (c: SiteContent) => void = () => {}) {
  const content = siteContentFixture();
  mutate(content);
  return content;
}

function publish(content: SiteContent, uploads: { path: string; blobSha: string }[] = []) {
  return publishContent({ content, baseSha: FILE_SHA, uploads, message: "content: test", today: TODAY });
}

beforeEach(() => {
  vi.mocked(github.createBlob).mockImplementation(async (bytes) => createHash("sha1").update(bytes).digest("hex"));
  vi.mocked(github.commitFiles).mockResolvedValue(sha("9"));
});

describe("applyUpdatedStamps", () => {
  it("stamps today on changed pages and keeps the repo's date on the others", () => {
    const previous = siteContentFixture();
    const next = edited((c) => (c.homePage.seo.title = "New title"));
    const result = applyUpdatedStamps(previous, next, TODAY);
    expect(result.homePage.seo.updated).toBe(TODAY);
    expect(result.aboutPage.seo.updated).toBe(previous.aboutPage.seo.updated);
  });

  it("ignores whatever date the editor sent for an unchanged page", () => {
    const previous = edited((c) => (c.aboutPage.seo.updated = "2026-11-17"));
    const next = edited((c) => (c.aboutPage.seo.updated = "2001-01-01"));
    expect(applyUpdatedStamps(previous, next, TODAY).aboutPage.seo.updated).toBe("2026-11-17");
  });

  it("removes a date the editor added to a page that never had one", () => {
    const previous = edited((c) => delete c.aboutPage.seo.updated);
    const next = edited((c) => (c.aboutPage.seo.updated = "2001-01-01"));
    expect(applyUpdatedStamps(previous, next, TODAY).aboutPage.seo).not.toHaveProperty("updated");
  });

  it("does not modify its inputs", () => {
    const next = edited((c) => (c.homePage.seo.title = "New title"));
    const before = JSON.stringify(next);
    applyUpdatedStamps(siteContentFixture(), next, TODAY);
    expect(JSON.stringify(next)).toBe(before);
  });
});

describe("serializeContent", () => {
  // If the committed file weren't in the publisher's exact format, the first
  // publish would also reformat the whole file and bury the real edit in noise.
  it("reproduces the committed content/site.json byte for byte", async () => {
    const { siteContentSchema } = await import("./content-schema");
    const committed = readFileSync(path.join(__dirname, "../../content/site.json"), "utf8");
    expect(serializeContent(siteContentSchema.parse(JSON.parse(committed)))).toBe(committed);
  });
});

describe("referencedUploads", () => {
  it("finds upload paths anywhere in the content, and nothing else", () => {
    const content = edited((c) => {
      c.images.logo = "/images/uploads/aaaaaaaaaaaaaaaaaaaaaaaa.png";
      const hero = c.homePage.blocks.find((b) => b.type === "hero");
      if (hero?.type === "hero") hero.image = "/images/uploads/bbbbbbbbbbbbbbbbbbbbbbbb.webp";
    });
    expect([...referencedUploads(content)].sort()).toEqual([
      "/images/uploads/aaaaaaaaaaaaaaaaaaaaaaaa.png",
      "/images/uploads/bbbbbbbbbbbbbbbbbbbbbbbb.webp",
    ]);
  });
});

describe("publishContent", () => {
  it("commits the stamped content on top of the current head and returns it", async () => {
    repoHas();
    const result = await publish(edited((c) => (c.homePage.seo.title = "New title")));
    expect(result).toMatchObject({ ok: true, committed: true });
    if (!result.ok) return;
    expect(result.content.homePage.seo.updated).toBe(TODAY);

    const [parent, files, message] = vi.mocked(github.commitFiles).mock.calls[0];
    expect(parent).toBe(HEAD);
    expect(message).toBe("content: test");
    expect(files).toEqual([{ path: "content/site.json", blobSha: result.sha }]);
    // The returned version token is the blob of exactly the committed text.
    expect(vi.mocked(github.createBlob).mock.calls[0][0].toString("utf8")).toBe(serializeContent(result.content));
  });

  // Audit finding #6: a second publish in one session used to write the editor's
  // stale dates back for pages the first publish had stamped.
  it("keeps the repo's newer date when the editor still holds an older one", async () => {
    repoHas(edited((c) => (c.aboutPage.seo.updated = TODAY))); // stamped by an earlier publish
    const result = await publish(edited((c) => (c.homePage.seo.title = "A second edit, on another page")));
    expect(result.ok && result.content.aboutPage.seo.updated).toBe(TODAY);
  });

  it("reports a conflict, without writing, when site.json changed since the editor loaded it", async () => {
    repoHas(siteContentFixture(), sha("e"));
    expect(await publish(edited((c) => (c.homePage.seo.title = "New title")))).toEqual({
      ok: false,
      reason: "conflict",
    });
    expect(github.createBlob).not.toHaveBeenCalled();
    expect(github.commitFiles).not.toHaveBeenCalled();
  });

  it("reads site.json at the head it builds on, not at the moving branch name", async () => {
    repoHas();
    await publish(edited((c) => (c.homePage.seo.title = "New title")));
    expect(github.readRepoFile).toHaveBeenCalledWith("content/site.json", HEAD);
  });

  it("does not commit when nothing changed", async () => {
    repoHas();
    expect(await publish(siteContentFixture())).toMatchObject({ ok: true, committed: false, sha: FILE_SHA });
    expect(github.commitFiles).not.toHaveBeenCalled();
  });

  it("retries on top of the new head when an unrelated commit lands meanwhile", async () => {
    repoHas();
    vi.mocked(github.getBranchHead).mockResolvedValueOnce(HEAD).mockResolvedValueOnce(sha("2"));
    vi.mocked(github.commitFiles)
      .mockRejectedValueOnce(new github.GitHubBranchMovedError("moved"))
      .mockResolvedValueOnce(sha("9"));
    expect(await publish(edited((c) => (c.homePage.seo.title = "New title")))).toMatchObject({ ok: true });
    expect(vi.mocked(github.commitFiles).mock.calls.map(([parent]) => parent)).toEqual([HEAD, sha("2")]);
  });

  it("turns into a conflict if the commit that landed meanwhile changed site.json", async () => {
    repoHas();
    vi.mocked(github.readRepoFile)
      .mockResolvedValueOnce({ sha: FILE_SHA, text: repoText() })
      .mockResolvedValueOnce({ sha: sha("e"), text: repoText() });
    vi.mocked(github.commitFiles).mockRejectedValueOnce(new github.GitHubBranchMovedError("moved"));
    expect(await publish(edited((c) => (c.homePage.seo.title = "New title")))).toEqual({
      ok: false,
      reason: "conflict",
    });
  });

  it("gives up after repeated races instead of looping", async () => {
    repoHas();
    vi.mocked(github.commitFiles).mockRejectedValue(new github.GitHubBranchMovedError("moved"));
    expect(await publish(edited((c) => (c.homePage.seo.title = "New title")))).toEqual({ ok: false, reason: "busy" });
    expect(github.commitFiles).toHaveBeenCalledTimes(3);
  });

  it("refuses to build on a repo file that fails validation", async () => {
    vi.mocked(github.getBranchHead).mockResolvedValue(HEAD);
    vi.mocked(github.readRepoFile).mockResolvedValue({ sha: FILE_SHA, text: '{"site": {}}' });
    expect(await publish(siteContentFixture())).toEqual({ ok: false, reason: "repo_invalid" });
  });

  describe("uploaded images", () => {
    const withLogo = (src: string) => edited((c) => (c.images.logo = src));

    it("commits a referenced upload in the same commit as the content", async () => {
      repoHas();
      vi.mocked(github.readBlob).mockResolvedValue(PNG);
      const result = await publish(withLogo(PNG_PATH), [{ path: PNG_PATH, blobSha: sha("b") }]);
      expect(result).toMatchObject({ ok: true, committed: true });
      expect(vi.mocked(github.commitFiles).mock.calls[0][1]).toEqual([
        { path: "content/site.json", blobSha: expect.any(String) },
        { path: `public${PNG_PATH}`, blobSha: sha("b") },
      ]);
    });

    it("drops uploads the content no longer uses", async () => {
      repoHas();
      await publish(edited((c) => (c.homePage.seo.title = "New title")), [{ path: PNG_PATH, blobSha: sha("b") }]);
      expect(github.readBlob).not.toHaveBeenCalled();
      expect(vi.mocked(github.commitFiles).mock.calls[0][1]).toHaveLength(1);
    });

    it.each([
      ["the bytes don't match the name's hash", () => Buffer.concat([PNG, Buffer.from([0])])],
      ["the blob isn't the named format", () => Buffer.from("<svg></svg>")],
    ])("rejects an upload whose blob was swapped (%s)", async (_case, bytes) => {
      repoHas();
      vi.mocked(github.readBlob).mockResolvedValue(bytes());
      expect(await publish(withLogo(PNG_PATH), [{ path: PNG_PATH, blobSha: sha("b") }])).toEqual({
        ok: false,
        reason: "invalid_upload",
      });
      expect(github.commitFiles).not.toHaveBeenCalled();
    });

    it("rejects an upload with a malformed blob id without fetching it", async () => {
      repoHas();
      expect(await publish(withLogo(PNG_PATH), [{ path: PNG_PATH, blobSha: "../etc" }])).toEqual({
        ok: false,
        reason: "invalid_upload",
      });
      expect(github.readBlob).not.toHaveBeenCalled();
    });
  });
});
