import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { CONTACT_AREAS } from "@/lib/contact-validation";

// Only the SMTP transport is mocked; origin checks, parsing, the bot traps,
// validation and rate limiting run for real.
const { sendMail, createTransport } = vi.hoisted(() => {
  const sendMail = vi.fn();
  return { sendMail, createTransport: vi.fn(() => ({ sendMail })) };
});
vi.mock("nodemailer", () => ({ default: { createTransport } }));

const SITE = "https://www.entrpryz.com";

// route.ts caches the transporter and rate-limit counters in module state.
async function loadRoute() {
  vi.resetModules();
  return import("./route");
}

function inquiry(overrides: Record<string, unknown> = {}) {
  return {
    name: "Jane Doe",
    email: "jane@example.com",
    organization: "Acme",
    service: CONTACT_AREAS[0],
    message: "We need help with our ERP rollout.",
    website: "",
    startedAt: Date.now() - 10_000,
    ...overrides,
  };
}

function post(
  body: unknown,
  { origin = SITE, ip = "203.0.113.10", contentType = "application/json", raw = false } = {}
) {
  const headers = new Headers({ host: "www.entrpryz.com", "x-real-ip": ip, "content-type": contentType });
  if (origin) headers.set("origin", origin);
  return new NextRequest(`${SITE}/api/contact`, {
    method: "POST",
    headers,
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.stubEnv("SMTP_HOST", "smtp.example.com");
    vi.stubEnv("SMTP_USER", "mailer@entrpryz.com");
    vi.stubEnv("SMTP_PASS", "secret");
    vi.stubEnv("CONTACT_TO_EMAIL", "inbox@entrpryz.com");
    vi.stubEnv("CONTACT_FROM_EMAIL", "");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
    sendMail.mockResolvedValue({ messageId: "1" });
  });

  it("sends a valid inquiry with the visitor as Reply-To", async () => {
    const { POST } = await loadRoute();
    const res = await POST(post(inquiry()));
    expect(res.status).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail.mock.calls[0][0]).toMatchObject({
      from: { address: "mailer@entrpryz.com" },
      to: "inbox@entrpryz.com",
      replyTo: { name: "Jane Doe", address: "jane@example.com" },
    });
  });

  it("escapes HTML in the email body", async () => {
    const { POST } = await loadRoute();
    await POST(post(inquiry({ name: "<img src=x onerror=alert(1)>", message: "<script>alert(1)</script> hello" })));
    const { html } = sendMail.mock.calls[0][0];
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
  });

  it.each([
    ["missing", null],
    ["from another site", "https://evil.example"],
    ["malformed", "not a url"],
  ])("rejects a request whose Origin is %s", async (_case, origin) => {
    const { POST } = await loadRoute();
    expect((await POST(post(inquiry(), { origin: origin as string }))).status).toBe(403);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("rejects non-JSON bodies", async () => {
    const { POST } = await loadRoute();
    expect((await POST(post(inquiry(), { contentType: "text/plain" }))).status).toBe(415);
  });

  it("rejects malformed JSON", async () => {
    const { POST } = await loadRoute();
    expect((await POST(post("{not json", { raw: true }))).status).toBe(400);
  });

  it("rejects bodies over 16 KB", async () => {
    const { POST } = await loadRoute();
    expect((await POST(post(inquiry({ message: "x".repeat(17 * 1024) })))).status).toBe(413);
  });

  // Known bug (audit finding #13, fixed in remediation step 1.2): a JSON `null` body
  // throws a TypeError and returns a 500. Flip to `it` when the fix lands.
  it.fails("rejects a JSON null body with 400", async () => {
    const { POST } = await loadRoute();
    expect((await POST(post(null))).status).toBe(400);
  });

  it("returns field errors for invalid input without sending", async () => {
    const { POST } = await loadRoute();
    const res = await POST(post(inquiry({ email: "nope", service: "Not an option" })));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: "invalid", fields: { email: expect.any(String), service: expect.any(String) } });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it.each([
    ["the honeypot is filled", { website: "https://spam.example" }],
    ["the form was submitted too fast", { startedAt: Date.now() }],
    ["the fill timestamp is missing", { startedAt: undefined }],
  ])("pretends success but sends nothing when %s", async (_case, overrides) => {
    const { POST } = await loadRoute();
    const res = await POST(post(inquiry(overrides)));
    expect(res.status).toBe(200);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("rate-limits an IP after 5 requests in 10 minutes", async () => {
    const { POST } = await loadRoute();
    for (let i = 0; i < 5; i++) expect((await POST(post(inquiry()))).status).toBe(200);
    expect((await POST(post(inquiry()))).status).toBe(429);
    expect((await POST(post(inquiry(), { ip: "198.51.100.7" }))).status).toBe(200);
  });

  it("returns 503 when SMTP is not configured", async () => {
    vi.stubEnv("SMTP_PASS", "");
    const { POST } = await loadRoute();
    expect((await POST(post(inquiry()))).status).toBe(503);
  });

  it("returns 502 without leaking details when the mail server fails", async () => {
    sendMail.mockRejectedValue(Object.assign(new Error("auth failed for secret"), { code: "EAUTH" }));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { POST } = await loadRoute();
    const res = await POST(post(inquiry()));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "failed" });
  });
});
