import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SESSION_TTL_SECONDS, createSessionToken, verifySessionToken } from "./admin-session";

const SECRET = "x".repeat(48);

function toBase64Url(text: string): string {
  return Buffer.from(text, "utf8").toString("base64url");
}

describe("admin session tokens", () => {
  beforeEach(() => {
    vi.stubEnv("ADMIN_SESSION_SECRET", SECRET);
    vi.stubEnv("ADMIN_USERNAME", "admin");
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-17T10:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("verifies a token it created", async () => {
    const token = await createSessionToken("admin");
    const session = await verifySessionToken(token!);
    expect(session).toMatchObject({ sub: "admin" });
    expect(session!.exp - session!.iat).toBe(SESSION_TTL_SECONDS);
  });

  it("rejects a missing or empty token", async () => {
    expect(await verifySessionToken(undefined)).toBeNull();
    expect(await verifySessionToken("")).toBeNull();
  });

  it("rejects a payload that was changed after signing", async () => {
    const token = (await createSessionToken("admin"))!;
    const [, signature] = token.split(".");
    const forgedBody = toBase64Url(JSON.stringify({ sub: "admin", iat: 0, exp: 9_999_999_999 }));
    expect(await verifySessionToken(`${forgedBody}.${signature}`)).toBeNull();
  });

  it("rejects a signature taken from a different payload", async () => {
    const tokenA = (await createSessionToken("admin"))!;
    vi.advanceTimersByTime(1000);
    const tokenB = (await createSessionToken("admin"))!;
    const [bodyA] = tokenA.split(".");
    const [, signatureB] = tokenB.split(".");
    expect(await verifySessionToken(`${bodyA}.${signatureB}`)).toBeNull();
  });

  it("rejects a token signed with another secret", async () => {
    const token = await createSessionToken("admin");
    vi.stubEnv("ADMIN_SESSION_SECRET", "y".repeat(48));
    expect(await verifySessionToken(token!)).toBeNull();
  });

  it("rejects tokens with extra or missing segments", async () => {
    const token = (await createSessionToken("admin"))!;
    expect(await verifySessionToken(`${token}.extra`)).toBeNull();
    expect(await verifySessionToken(token.split(".")[0])).toBeNull();
    expect(await verifySessionToken("not-base64!.also-not!")).toBeNull();
  });

  it("rejects an expired token", async () => {
    const token = await createSessionToken("admin");
    vi.advanceTimersByTime(SESSION_TTL_SECONDS * 1000);
    expect(await verifySessionToken(token!)).toBeNull();
  });

  it("rejects a token once the admin username changes", async () => {
    const token = await createSessionToken("admin");
    vi.stubEnv("ADMIN_USERNAME", "new-admin");
    expect(await verifySessionToken(token!)).toBeNull();
  });

  it("refuses to issue or accept tokens when the secret is shorter than 32 characters", async () => {
    const token = await createSessionToken("admin");
    vi.stubEnv("ADMIN_SESSION_SECRET", "short-secret");
    expect(await createSessionToken("admin")).toBeNull();
    expect(await verifySessionToken(token!)).toBeNull();
  });
});
