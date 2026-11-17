import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SiteContent } from "@/lib/content-schema";
import { siteContentFixture } from "@/test/fixtures";

// Only the boundaries are mocked: the session check and the GitHub HTTP client.
// Schema validation and the date-stamping logic run for real.
vi.mock("@/lib/admin-auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/admin-auth")>();
  return { ...actual, requireAdmin: vi.fn() };
});
vi.mock("@/lib/github-store", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/github-store")>();
  return { ...actual, readRepoFile: vi.fn(), writeRepoFile: vi.fn(), repoFileExists: vi.fn() };
});

const { requireAdmin, UnauthorizedError } = await import("@/lib/admin-auth");
const github = await import("@/lib/github-store");
const { saveContent, uploadImage } = await import("./actions");

const REPO_SHA = "a".repeat(40);
const NEW_SHA = "b".repeat(40);
const TODAY = "2026-11-17";

function repoHas(content: SiteContent, sha = REPO_SHA) {
  vi.mocked(github.readRepoFile).mockResolvedValue({ sha, text: JSON.stringify(content, null, 2) });
}

/** The content object that was committed in the (single) write call. */
function committed(): SiteContent {
  expect(github.writeRepoFile).toHaveBeenCalledTimes(1);
  const [, body] = vi.mocked(github.writeRepoFile).mock.calls[0];
  return JSON.parse(body.toString("utf8"));
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(`${TODAY}T12:00:00Z`));
  vi.mocked(requireAdmin).mockResolvedValue({ sub: "admin", iat: 0, exp: 0 });
  vi.mocked(github.writeRepoFile).mockResolvedValue({ sha: NEW_SHA, commitSha: "c".repeat(40) });
});

describe("saveContent", () => {
  it("refuses unauthenticated callers without touching GitHub", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(new UnauthorizedError());
    expect(await saveContent({ content: siteContentFixture(), sha: REPO_SHA })).toEqual({
      ok: false,
      reason: "unauthorized",
    });
    expect(github.readRepoFile).not.toHaveBeenCalled();
    expect(github.writeRepoFile).not.toHaveBeenCalled();
  });

  it.each([undefined, "", "abc", "A".repeat(40), 123])("treats a malformed base sha %j as a conflict", async (sha) => {
    expect(await saveContent({ content: siteContentFixture(), sha })).toEqual({ ok: false, reason: "conflict" });
    expect(github.writeRepoFile).not.toHaveBeenCalled();
  });

  it("rejects invalid content with field-level issues", async () => {
    const content = siteContentFixture();
    content.navigation.cta.href = "javascript:alert(1)";
    const result = await saveContent({ content, sha: REPO_SHA });
    expect(result).toMatchObject({ ok: false, reason: "invalid" });
    expect(result.ok === false && result.issues?.map((i) => i.path)).toContain("navigation.cta.href");
    expect(github.writeRepoFile).not.toHaveBeenCalled();
  });

  it("rejects content larger than the size cap before validating it", async () => {
    const content = { ...siteContentFixture(), padding: "x".repeat(600 * 1024) };
    expect(await saveContent({ content, sha: REPO_SHA })).toMatchObject({ ok: false, reason: "invalid" });
  });

  it("reports a conflict when the file changed since the editor loaded it", async () => {
    repoHas(siteContentFixture(), "d".repeat(40));
    expect(await saveContent({ content: siteContentFixture(), sha: REPO_SHA })).toEqual({
      ok: false,
      reason: "conflict",
    });
    expect(github.writeRepoFile).not.toHaveBeenCalled();
  });

  it("reports a conflict when GitHub rejects the write", async () => {
    repoHas(siteContentFixture());
    vi.mocked(github.writeRepoFile).mockRejectedValue(new github.GitHubConflictError("changed"));
    expect(await saveContent({ content: siteContentFixture(), sha: REPO_SHA })).toEqual({
      ok: false,
      reason: "conflict",
    });
  });

  it("reports 'unconfigured' when GitHub settings are missing", async () => {
    vi.mocked(github.readRepoFile).mockRejectedValue(new github.GitHubConfigError("missing"));
    expect(await saveContent({ content: siteContentFixture(), sha: REPO_SHA })).toEqual({
      ok: false,
      reason: "unconfigured",
    });
  });

  it("commits against the loaded sha and returns the new one", async () => {
    repoHas(siteContentFixture());
    const content = siteContentFixture();
    content.homePage.seo.title = "A new home page title";
    expect(await saveContent({ content, sha: REPO_SHA })).toEqual({ ok: true, sha: NEW_SHA });
    const [path, , message, baseSha] = vi.mocked(github.writeRepoFile).mock.calls[0];
    expect(path).toBe("content/site.json");
    expect(baseSha).toBe(REPO_SHA);
    expect(message).toContain("(admin)");
  });

  it("stores the parsed value (trimmed, blanks removed), not the raw input", async () => {
    repoHas(siteContentFixture());
    const content = siteContentFixture();
    content.site.tagline = `  ${content.site.tagline}  `;
    content.site.whatsapp.message = "";
    await saveContent({ content, sha: REPO_SHA });
    const saved = committed();
    expect(saved.site.tagline).toBe(siteContentFixture().site.tagline);
    expect(saved.site.whatsapp).not.toHaveProperty("message");
  });

  it("stamps today's date only on pages whose content changed", async () => {
    repoHas(siteContentFixture());
    const content = siteContentFixture();
    content.homePage.seo.title = "A new home page title";
    await saveContent({ content, sha: REPO_SHA });
    const saved = committed();
    expect(saved.homePage.seo.updated).toBe(TODAY);
    expect(saved.aboutPage.seo.updated).toBe(siteContentFixture().aboutPage.seo.updated);
  });

  it("keeps the repo's date when the editor cleared it on an unchanged page", async () => {
    repoHas(siteContentFixture());
    const content = siteContentFixture();
    delete content.aboutPage.seo.updated;
    await saveContent({ content, sha: REPO_SHA });
    expect(committed().aboutPage.seo.updated).toBe(siteContentFixture().aboutPage.seo.updated);
  });

  // Known bug (audit finding #6, fixed in remediation step 3.1): the server trusts a
  // stale `updated` stamp sent by the editor for unchanged pages, so a second publish in
  // one session moves sitemap dates backwards. Flip to `it` when the fix lands.
  it.fails("keeps the repo's date when the editor sends an older one for an unchanged page", async () => {
    const repo = siteContentFixture();
    repo.aboutPage.seo.updated = TODAY; // stamped by an earlier publish in this session
    repoHas(repo);
    const content = siteContentFixture(); // editor still holds the pre-publish date
    content.homePage.seo.title = "A second edit, on another page";
    await saveContent({ content, sha: REPO_SHA });
    expect(committed().aboutPage.seo.updated).toBe(TODAY);
  });
});

describe("uploadImage", () => {
  const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
  const JPG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]);
  const WEBP = Buffer.concat([Buffer.from("RIFF"), Buffer.alloc(4), Buffer.from("WEBPVP8 ")]);

  function form(bytes: Buffer, name = "photo.png", type = "image/png") {
    const data = new FormData();
    data.append("file", new File([new Uint8Array(bytes)], name, { type }));
    return data;
  }

  beforeEach(() => {
    vi.mocked(github.repoFileExists).mockResolvedValue(false);
  });

  it("refuses unauthenticated callers", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(new UnauthorizedError());
    expect(await uploadImage(form(PNG))).toMatchObject({ ok: false });
    expect(github.writeRepoFile).not.toHaveBeenCalled();
  });

  it.each([
    ["png", PNG],
    ["jpg", JPG],
    ["webp", WEBP],
  ])("stores a %s under a content-hash name, ignoring the uploaded filename", async (ext, bytes) => {
    const result = await uploadImage(form(bytes as Buffer, "../../evil name.svg", "image/svg+xml"));
    expect(result).toEqual({ ok: true, path: expect.stringMatching(new RegExp(`^/images/uploads/[a-f0-9]{24}\\.${ext}$`)) });
    const [repoPath] = vi.mocked(github.writeRepoFile).mock.calls[0];
    expect(`/${repoPath}`).toBe(`/public${(result as { path: string }).path}`);
  });

  it("detects the format from the bytes, not the declared MIME type", async () => {
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
    expect(await uploadImage(form(svg, "logo.png", "image/png"))).toMatchObject({ ok: false });
    expect(github.writeRepoFile).not.toHaveBeenCalled();
  });

  it("rejects empty and oversized files", async () => {
    expect(await uploadImage(form(Buffer.alloc(0)))).toMatchObject({ ok: false });
    const big = Buffer.concat([PNG, Buffer.alloc(4 * 1024 * 1024)]);
    expect(await uploadImage(form(big))).toMatchObject({ ok: false });
    expect(github.writeRepoFile).not.toHaveBeenCalled();
  });

  it("does not commit an image that is already in the repo", async () => {
    vi.mocked(github.repoFileExists).mockResolvedValue(true);
    expect(await uploadImage(form(PNG))).toMatchObject({ ok: true });
    expect(github.writeRepoFile).not.toHaveBeenCalled();
  });
});
