import { describe, expect, it, vi } from "vitest";

// SITE_URL is read once at module load, so each case loads a fresh module.
async function siteUrlWith(value: string | undefined) {
  vi.resetModules();
  if (value === undefined) vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
  else vi.stubEnv("NEXT_PUBLIC_SITE_URL", value);
  return (await import("./site")).SITE_URL;
}

describe("SITE_URL", () => {
  it.each([undefined, "", "   "])("falls back to the canonical origin when unset or blank (%j)", async (value) => {
    expect(await siteUrlWith(value)).toBe("https://www.entrpryz.com");
  });

  it("uses the configured origin without trailing slashes", async () => {
    expect(await siteUrlWith("http://localhost:3000//")).toBe("http://localhost:3000");
  });
});
