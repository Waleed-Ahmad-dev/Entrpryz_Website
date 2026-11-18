import { describe, expect, it } from "vitest";
import { allowedOrigins, isAllowedOrigin } from "./allowed-origins";

// SITE_URL defaults to https://www.entrpryz.com when NEXT_PUBLIC_SITE_URL is unset.
const PROD = { NODE_ENV: "production" } as NodeJS.ProcessEnv;

describe("isAllowedOrigin", () => {
  it.each(["https://www.entrpryz.com", "https://entrpryz.com"])("allows the site origin %s", (origin) => {
    expect(isAllowedOrigin(origin, PROD)).toBe(true);
  });

  it.each([
    ["no Origin header", null],
    ["the opaque 'null' origin", "null"],
    ["another site", "https://evil.example"],
    ["a look-alike subdomain", "https://www.entrpryz.com.evil.example"],
    ["plain http", "http://www.entrpryz.com"],
    ["another port", "https://www.entrpryz.com:8443"],
    ["a path", "https://www.entrpryz.com/contact"],
    ["a trailing slash", "https://www.entrpryz.com/"],
    ["userinfo", "https://user@www.entrpryz.com"],
    ["localhost in production", "http://localhost:3000"],
    ["garbage", "not a url"],
  ])("rejects %s", (_case, origin) => {
    expect(isAllowedOrigin(origin as string | null, PROD)).toBe(false);
  });

  it("allows this Vercel deployment's own URLs", () => {
    const env = {
      ...PROD,
      VERCEL_URL: "entrpryz-abc123.vercel.app",
      VERCEL_BRANCH_URL: "entrpryz-git-feature.vercel.app",
    } as NodeJS.ProcessEnv;
    expect(isAllowedOrigin("https://entrpryz-abc123.vercel.app", env)).toBe(true);
    expect(isAllowedOrigin("https://entrpryz-git-feature.vercel.app", env)).toBe(true);
    expect(isAllowedOrigin("https://someone-else.vercel.app", env)).toBe(false);
  });

  it("allows localhost on any port only in development", () => {
    const dev = { NODE_ENV: "development" } as NodeJS.ProcessEnv;
    expect(isAllowedOrigin("http://localhost:3000", dev)).toBe(true);
    expect(isAllowedOrigin("http://127.0.0.1:4000", dev)).toBe(true);
    expect(isAllowedOrigin("https://evil.example", dev)).toBe(false);
  });
});

describe("allowedOrigins", () => {
  it("is built from configuration only", () => {
    expect([...allowedOrigins(PROD)].sort()).toEqual(["https://entrpryz.com", "https://www.entrpryz.com"]);
  });
});
