import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock only the Next.js request context (headers, cookies, redirect).
// Credential checks, throttling and session signing run for real.
const requestHeaders = new Map<string, string>();
const cookieJar = { set: vi.fn(), delete: vi.fn() };

// Next.js 16 request APIs are async-only, so the mocks return promises too.
vi.mock("next/headers", () => ({
  headers: async () => ({ get: (name: string) => requestHeaders.get(name.toLowerCase()) ?? null }),
  cookies: async () => cookieJar,
}));

class RedirectSignal extends Error {
  constructor(readonly url: string) {
    super(`redirect:${url}`);
  }
}
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new RedirectSignal(url);
  },
}));

const LOCKED = /too many failed attempts/i;

// actions.ts keeps throttle counters in module state, so each test loads a fresh copy.
async function loadActions() {
  vi.resetModules();
  return import("./actions");
}

function credentials(username: string, password: string) {
  const form = new FormData();
  form.set("username", username);
  form.set("password", password);
  return form;
}

function fromIp(ip: string) {
  requestHeaders.set("x-real-ip", ip);
}

/** Runs the login action; resolves to the returned state, or the redirect target on success. */
async function attempt(login: Awaited<ReturnType<typeof loadActions>>["login"], form: FormData) {
  try {
    return await login({ error: null }, form);
  } catch (err) {
    if (err instanceof RedirectSignal) return { redirectedTo: err.url };
    throw err;
  }
}

describe("admin login", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-17T10:00:00Z"));
    vi.stubEnv("ADMIN_USERNAME", "admin");
    vi.stubEnv("ADMIN_PASSWORD", "correct horse battery staple");
    vi.stubEnv("ADMIN_SESSION_SECRET", "s".repeat(48));
    vi.stubEnv("ADMIN_TOTP_SECRET", "");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
    requestHeaders.clear();
    fromIp("203.0.113.10");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /** Failed logins wait 500 ms on purpose; advance fake time instead of sleeping. */
  async function fail(login: Awaited<ReturnType<typeof loadActions>>["login"], form: FormData) {
    const pending = attempt(login, form);
    await vi.advanceTimersByTimeAsync(500);
    return pending;
  }

  it("signs in with the right credentials and sets a hardened session cookie", async () => {
    const { login } = await loadActions();
    expect(await attempt(login, credentials("admin", "correct horse battery staple"))).toEqual({
      redirectedTo: "/admin",
    });
    expect(cookieJar.set).toHaveBeenCalledWith(
      "entrpryz_admin_session",
      expect.stringMatching(/^[\w-]+\.[\w-]+$/),
      expect.objectContaining({ httpOnly: true, sameSite: "strict", path: "/" })
    );
  });

  it("issues a cookie that the session verifier accepts", async () => {
    const { login } = await loadActions();
    await attempt(login, credentials("admin", "correct horse battery staple"));
    const { verifySessionToken } = await import("@/lib/admin-session");
    const token = cookieJar.set.mock.calls[0][1] as string;
    expect(await verifySessionToken(token)).toMatchObject({ sub: "admin" });
  });

  it.each([
    ["wrong password", "admin", "wrong"],
    ["wrong username", "root", "correct horse battery staple"],
  ])("rejects a %s with one generic message and no cookie", async (_case, user, pass) => {
    const { login } = await loadActions();
    expect(await fail(login, credentials(user, pass))).toEqual({ error: "Invalid sign-in details." });
    expect(cookieJar.set).not.toHaveBeenCalled();
  });

  it("rejects missing and over-long fields without checking credentials", async () => {
    const { login } = await loadActions();
    expect(await attempt(login, credentials("", "x"))).toEqual({ error: "Enter your username and password." });
    expect(await attempt(login, credentials("admin", "x".repeat(257)))).toEqual({
      error: "Enter your username and password.",
    });
  });

  it("refuses to sign in when the admin account is not configured", async () => {
    vi.stubEnv("ADMIN_PASSWORD", "");
    const { login } = await loadActions();
    expect(await attempt(login, credentials("admin", ""))).toMatchObject({ error: expect.any(String) });
    expect(await attempt(login, credentials("admin", "anything"))).toEqual({ error: "Admin login is not configured." });
  });

  it("refuses to issue a session when the signing secret is too weak", async () => {
    vi.stubEnv("ADMIN_SESSION_SECRET", "short");
    const { login } = await loadActions();
    expect(await attempt(login, credentials("admin", "correct horse battery staple"))).toEqual({
      error: "Admin login is not configured.",
    });
    expect(cookieJar.set).not.toHaveBeenCalled();
  });

  it("locks an IP out after 5 failures, even for the right password, and only that IP", async () => {
    const { login } = await loadActions();
    for (let i = 0; i < 5; i++) await fail(login, credentials("admin", "wrong"));
    expect(await attempt(login, credentials("admin", "correct horse battery staple"))).toMatchObject({
      error: expect.stringMatching(LOCKED),
    });
    fromIp("198.51.100.7");
    expect(await attempt(login, credentials("admin", "correct horse battery staple"))).toEqual({
      redirectedTo: "/admin",
    });
  });

  it("lifts the lockout after 15 minutes", async () => {
    const { login } = await loadActions();
    for (let i = 0; i < 5; i++) await fail(login, credentials("admin", "wrong"));
    vi.advanceTimersByTime(15 * 60 * 1000 + 1);
    expect(await attempt(login, credentials("admin", "correct horse battery staple"))).toEqual({
      redirectedTo: "/admin",
    });
  });

  it("requires a valid authenticator code when 2FA is on", async () => {
    vi.stubEnv("ADMIN_TOTP_SECRET", "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ");
    vi.setSystemTime(59_000); // RFC 6238 vector: code 287082
    const { login } = await loadActions();

    const noCode = credentials("admin", "correct horse battery staple");
    expect(await fail(login, noCode)).toEqual({ error: "Invalid sign-in details." });

    const withCode = credentials("admin", "correct horse battery staple");
    withCode.set("code", "287082");
    expect(await attempt(login, withCode)).toEqual({ redirectedTo: "/admin" });

    // The same code cannot be replayed (within this server instance; see audit finding #4).
    expect(await fail(login, withCode)).toEqual({ error: "Invalid sign-in details." });
  });

  // Audit finding #2: failures from other IPs used to trip a site-wide cap that
  // also blocked the real admin.
  it("does not let failures from other IPs lock out the admin", async () => {
    const { login } = await loadActions();
    for (let i = 0; i < 20; i++) {
      fromIp(`192.0.2.${i + 1}`);
      await fail(login, credentials("admin", "guess"));
    }
    fromIp("203.0.113.10");
    expect(await attempt(login, credentials("admin", "correct horse battery staple"))).toEqual({
      redirectedTo: "/admin",
    });
  });
});

describe("admin login with Turnstile enabled", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubEnv("ADMIN_USERNAME", "admin");
    vi.stubEnv("ADMIN_PASSWORD", "correct horse battery staple");
    vi.stubEnv("ADMIN_SESSION_SECRET", "s".repeat(48));
    vi.stubEnv("ADMIN_TOTP_SECRET", "");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret-key");
    vi.stubGlobal("fetch", fetchMock);
    // Cloudflare accepts only the token "human".
    fetchMock.mockImplementation(async (_url, init) =>
      Response.json({ success: (init!.body as URLSearchParams).get("response") === "human" })
    );
    requestHeaders.clear();
    fromIp("203.0.113.10");
  });

  function withToken(form: FormData, token: string) {
    form.set("cf-turnstile-response", token);
    return form;
  }

  it("rejects a sign-in that fails the bot check", async () => {
    const { login } = await loadActions();
    expect(await attempt(login, credentials("admin", "correct horse battery staple"))).toEqual({
      error: "Please complete the security check.",
    });
    expect(cookieJar.set).not.toHaveBeenCalled();
  });

  // Audit finding #2: bot-check failures used to count toward the lockout, so
  // anyone could lock the admin out without ever passing Turnstile.
  it("does not count bot-check failures toward the lockout, even from the admin's IP", async () => {
    const { login } = await loadActions();
    for (let i = 0; i < 25; i++) {
      await attempt(login, withToken(credentials("admin", "guess"), "bot"));
    }
    expect(
      await attempt(login, withToken(credentials("admin", "correct horse battery staple"), "human"))
    ).toEqual({ redirectedTo: "/admin" });
  });
});

describe("admin logout", () => {
  it("clears the session cookie and returns to the login page", async () => {
    const { logout } = await loadActions();
    await expect(logout()).rejects.toThrow("redirect:/admin/login");
    expect(cookieJar.delete).toHaveBeenCalledWith("entrpryz_admin_session");
  });
});
