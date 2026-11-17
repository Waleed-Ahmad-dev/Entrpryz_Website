import { beforeEach, describe, expect, it, vi } from "vitest";
import { turnstileEnabled, verifyTurnstile } from "./turnstile";

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");
  vi.stubEnv("TURNSTILE_SECRET_KEY", "secret-key");
});

describe("verifyTurnstile", () => {
  it("is skipped (passes) only when both keys are unset", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    expect(turnstileEnabled()).toBe(false);
    expect(await verifyTurnstile(undefined)).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the secret, token and client IP to Cloudflare", async () => {
    fetchMock.mockResolvedValue(Response.json({ success: true }));
    expect(await verifyTurnstile("token", "203.0.113.10")).toBe(true);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
    expect(Object.fromEntries(init!.body as URLSearchParams)).toEqual({
      secret: "secret-key",
      response: "token",
      remoteip: "203.0.113.10",
    });
  });

  it("omits an unknown client IP", async () => {
    fetchMock.mockResolvedValue(Response.json({ success: true }));
    await verifyTurnstile("token", "unknown");
    expect((fetchMock.mock.calls[0][1]!.body as URLSearchParams).has("remoteip")).toBe(false);
  });

  it.each([undefined, null, "", 42, "x".repeat(2049)])("rejects token %j without calling Cloudflare", async (token) => {
    expect(await verifyTurnstile(token)).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ["Cloudflare says no", () => Response.json({ success: false })],
    ["an HTTP error", () => new Response("oops", { status: 500 })],
    ["a non-boolean success", () => Response.json({ success: "true" })],
  ])("fails closed on %s", async (_case, response) => {
    fetchMock.mockResolvedValue(response());
    expect(await verifyTurnstile("token")).toBe(false);
  });

  it("fails closed when Cloudflare is unreachable", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));
    expect(await verifyTurnstile("token")).toBe(false);
  });
});
