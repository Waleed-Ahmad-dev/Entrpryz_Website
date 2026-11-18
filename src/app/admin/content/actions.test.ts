import { beforeEach, describe, expect, it, vi } from "vitest";
import { siteContentFixture } from "@/test/fixtures";

// The action's own job: check the session, validate input, and translate results.
// The publish rules (dates, conflicts, retries, upload checks) are tested in
// src/lib/content-publish.test.ts; here publishContent and the blob upload are mocked.
vi.mock("@/lib/admin-auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/admin-auth")>();
  return { ...actual, requireAdmin: vi.fn() };
});
vi.mock("@/lib/content-publish", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/content-publish")>();
  return { ...actual, publishContent: vi.fn() };
});
vi.mock("@/lib/github-store", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/github-store")>();
  return { ...actual, createBlob: vi.fn() };
});

const { requireAdmin, UnauthorizedError } = await import("@/lib/admin-auth");
const { publishContent } = await import("@/lib/content-publish");
const github = await import("@/lib/github-store");
const { saveContent, uploadImage } = await import("./actions");

const sha = (c: string) => c.repeat(40);
const BASE = sha("a");

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-11-18T12:00:00Z"));
  vi.mocked(requireAdmin).mockResolvedValue({ sub: "admin", iat: 0, exp: 0 });
  vi.mocked(publishContent).mockImplementation(async ({ content }) => ({
    ok: true,
    committed: true,
    sha: sha("b"),
    content,
  }));
});

describe("saveContent", () => {
  it("refuses unauthenticated callers without publishing", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(new UnauthorizedError());
    expect(await saveContent({ content: siteContentFixture(), sha: BASE })).toEqual({
      ok: false,
      reason: "unauthorized",
    });
    expect(publishContent).not.toHaveBeenCalled();
  });

  it.each([undefined, "", "abc", "A".repeat(40), 123])("treats a malformed base version %j as a conflict", async (base) => {
    expect(await saveContent({ content: siteContentFixture(), sha: base })).toEqual({ ok: false, reason: "conflict" });
    expect(publishContent).not.toHaveBeenCalled();
  });

  it("rejects invalid content with field-level issues", async () => {
    const content = siteContentFixture();
    content.navigation.cta.href = "javascript:alert(1)";
    const result = await saveContent({ content, sha: BASE });
    expect(result).toMatchObject({ ok: false, reason: "invalid" });
    expect(result.ok === false && result.issues?.map((i) => i.path)).toContain("navigation.cta.href");
    expect(publishContent).not.toHaveBeenCalled();
  });

  it("rejects content larger than the size cap before validating it", async () => {
    const content = { ...siteContentFixture(), padding: "x".repeat(600 * 1024) };
    expect(await saveContent({ content, sha: BASE })).toMatchObject({ ok: false, reason: "invalid" });
  });

  it.each([
    ["not a list", "x"],
    ["too many", Array.from({ length: 21 }, () => ({ path: "/images/uploads/a.png", blobSha: sha("c") }))],
    ["a malformed entry", [{ path: "/images/uploads/a.png" }]],
    ["a bad blob id", [{ path: "/images/uploads/a.png", blobSha: "../x" }]],
  ])("rejects an upload list that is %s", async (_case, uploads) => {
    expect(await saveContent({ content: siteContentFixture(), sha: BASE, uploads })).toMatchObject({
      ok: false,
      reason: "invalid",
    });
    expect(publishContent).not.toHaveBeenCalled();
  });

  it("publishes the parsed content with today's date and the admin in the message", async () => {
    const content = siteContentFixture();
    content.site.tagline = `  ${content.site.tagline}  `;
    const uploads = [{ path: "/images/uploads/0123456789abcdef01234567.png", blobSha: sha("c") }];
    const result = await saveContent({ content, sha: BASE, uploads });

    const [options] = vi.mocked(publishContent).mock.calls[0];
    expect(options).toMatchObject({ baseSha: BASE, uploads, today: "2026-11-18" });
    expect(options.message).toContain("(admin)");
    expect(options.content.site.tagline).toBe(siteContentFixture().site.tagline); // parsed: trimmed
    // The editor gets back exactly what was committed.
    expect(result).toEqual({ ok: true, committed: true, sha: sha("b"), content: options.content });
  });

  it.each([
    ["conflict", { ok: false, reason: "conflict" }],
    ["busy", { ok: false, reason: "busy" }],
    ["invalid_upload", { ok: false, reason: "invalid", issues: [{ path: "", message: expect.any(String) }] }],
    ["repo_invalid", { ok: false, reason: "failed" }],
  ] as const)("maps a %s publish result", async (reason, expected) => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(publishContent).mockResolvedValue({ ok: false, reason });
    expect(await saveContent({ content: siteContentFixture(), sha: BASE })).toEqual(expected);
  });

  it("reports 'unconfigured' when GitHub settings are missing", async () => {
    vi.mocked(publishContent).mockRejectedValue(new github.GitHubConfigError("missing"));
    expect(await saveContent({ content: siteContentFixture(), sha: BASE })).toEqual({
      ok: false,
      reason: "unconfigured",
    });
  });

  it("reports other errors as failures without details", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(publishContent).mockRejectedValue(new github.GitHubRequestError("GitHub tree creation failed (500)."));
    expect(await saveContent({ content: siteContentFixture(), sha: BASE })).toEqual({ ok: false, reason: "failed" });
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
    vi.mocked(github.createBlob).mockResolvedValue(sha("d"));
  });

  it("refuses unauthenticated callers", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(new UnauthorizedError());
    expect(await uploadImage(form(PNG))).toMatchObject({ ok: false });
    expect(github.createBlob).not.toHaveBeenCalled();
  });

  it.each([
    ["png", PNG],
    ["jpg", JPG],
    ["webp", WEBP],
  ])("stores a %s as a blob under a content-hash name, ignoring the uploaded filename", async (ext, bytes) => {
    const result = await uploadImage(form(bytes as Buffer, "../../evil name.svg", "image/svg+xml"));
    expect(result).toEqual({
      ok: true,
      path: expect.stringMatching(new RegExp(`^/images/uploads/[a-f0-9]{24}\\.${ext}$`)),
      blobSha: sha("d"),
    });
    expect(vi.mocked(github.createBlob).mock.calls[0][0].equals(bytes as Buffer)).toBe(true);
  });

  it("detects the format from the bytes, not the declared MIME type", async () => {
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
    expect(await uploadImage(form(svg, "logo.png", "image/png"))).toMatchObject({ ok: false });
    expect(github.createBlob).not.toHaveBeenCalled();
  });

  it("rejects empty and oversized files", async () => {
    expect(await uploadImage(form(Buffer.alloc(0)))).toMatchObject({ ok: false });
    const big = Buffer.concat([PNG, Buffer.alloc(4 * 1024 * 1024)]);
    expect(await uploadImage(form(big))).toMatchObject({ ok: false });
    expect(github.createBlob).not.toHaveBeenCalled();
  });

  it("reports upload failures without details", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(github.createBlob).mockRejectedValue(new github.GitHubRequestError("GitHub blob upload failed (500)."));
    expect(await uploadImage(form(PNG))).toEqual({ ok: false, error: "Upload failed. Please try again." });
  });
});
