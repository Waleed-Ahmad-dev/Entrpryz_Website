import { beforeEach, describe, expect, it, vi } from "vitest";

// RFC 6238 appendix B test secret: ASCII "12345678901234567890", base32-encoded.
const RFC_SECRET = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";

// RFC 6238 SHA-1 vectors, truncated to the 6 digits this app uses.
const VECTORS = [
  { seconds: 59, code: "287082" },
  { seconds: 1111111109, code: "081804" },
  { seconds: 1234567890, code: "005924" },
  { seconds: 2000000000, code: "279037" },
];

const STEP_MS = 30_000;

// totp.ts keeps the last used step in module state, so each test gets a fresh module.
async function loadTotp() {
  vi.resetModules();
  return import("./totp");
}

describe("checkTotp", () => {
  beforeEach(() => {
    vi.stubEnv("ADMIN_TOTP_SECRET", RFC_SECRET);
  });

  it.each(VECTORS)("matches the RFC 6238 vector at T=$seconds", async ({ seconds, code }) => {
    const { checkTotp } = await loadTotp();
    expect(checkTotp(code, seconds * 1000)).toBe(Math.floor(seconds / 30));
  });

  it("accepts one step of clock drift either side and nothing beyond", async () => {
    const { checkTotp } = await loadTotp();
    const { seconds, code } = VECTORS[1];
    const at = seconds * 1000;
    expect(checkTotp(code, at - STEP_MS)).not.toBeNull();
    expect(checkTotp(code, at + STEP_MS)).not.toBeNull();
    expect(checkTotp(code, at - 2 * STEP_MS)).toBeNull();
    expect(checkTotp(code, at + 2 * STEP_MS)).toBeNull();
  });

  it("rejects a code once its step has been used", async () => {
    const { checkTotp, markTotpUsed } = await loadTotp();
    const { seconds, code } = VECTORS[1];
    const step = checkTotp(code, seconds * 1000);
    expect(step).not.toBeNull();
    markTotpUsed(step!);
    expect(checkTotp(code, seconds * 1000)).toBeNull();
  });

  it("still accepts a later code after an earlier one was used", async () => {
    const { checkTotp, markTotpUsed } = await loadTotp();
    markTotpUsed(checkTotp(VECTORS[1].code, VECTORS[1].seconds * 1000)!);
    expect(checkTotp(VECTORS[2].code, VECTORS[2].seconds * 1000)).not.toBeNull();
  });

  it.each([undefined, null, 123456, "", "12345", "1234567", "12a456", "287 082"])(
    "rejects malformed input %j",
    async (input) => {
      const { checkTotp } = await loadTotp();
      expect(checkTotp(input, 59_000)).toBeNull();
    }
  );

  it("accepts surrounding whitespace on a valid code", async () => {
    const { checkTotp } = await loadTotp();
    expect(checkTotp(" 287082 ", 59_000)).toBe(1);
  });

  it("rejects every code when the secret is not valid base32", async () => {
    vi.stubEnv("ADMIN_TOTP_SECRET", "not-base32-1!");
    const { checkTotp } = await loadTotp();
    expect(checkTotp("287082", 59_000)).toBeNull();
  });

  it("rejects every code when the secret is shorter than 80 bits", async () => {
    vi.stubEnv("ADMIN_TOTP_SECRET", "GEZDGNBV"); // 5 bytes
    const { checkTotp } = await loadTotp();
    expect(checkTotp("287082", 59_000)).toBeNull();
  });

  it("returns 0 (no second factor) when 2FA is not configured", async () => {
    vi.stubEnv("ADMIN_TOTP_SECRET", "");
    const { checkTotp, totpEnabled } = await loadTotp();
    expect(totpEnabled()).toBe(false);
    expect(checkTotp(undefined)).toBe(0);
  });
});
