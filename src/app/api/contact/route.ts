import { NextResponse, type NextRequest } from "next/server";
import nodemailer, { type Transporter } from "nodemailer";
import { validateContact } from "@/lib/contact-validation";
import { verifyTurnstile } from "@/lib/turnstile";
import type { ContactFormData } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_RECIPIENT = "connect@entrpryz.com";
const MAX_BODY_BYTES = 16 * 1024;
const MIN_FILL_MS = 3000; // bots submit instantly
const RATE_LIMIT = { windowMs: 10 * 60 * 1000, max: 5 };

// Best-effort per-instance limiter. Serverless instances don't share memory,
// so this blunts bursts rather than guaranteeing a global cap.
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT.max;
}

function clientIp(req: NextRequest): string {
  return req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/** Reject cross-site posts: Origin must match the host serving this route. */
function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === (req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  } catch {
    return false;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT) || 465;
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: SMTP_SECURE ? SMTP_SECURE === "true" : port === 465,
    requireTLS: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { minVersion: "TLSv1.2" },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return transporter;
}

function buildEmail(data: ContactFormData) {
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Organization", data.organization || "—"],
    ["Area of interest", data.service],
  ];
  const text = [...rows.map(([k, v]) => `${k}: ${v}`), "", data.message].join("\n");
  const html = `
    <table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
      ${rows.map(([k, v]) => `<tr><td style="font-weight:bold;vertical-align:top">${k}</td><td>${escapeHtml(v)}</td></tr>`).join("")}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(data.message)}</p>`;
  return { subject: `Website inquiry — ${data.service} — ${data.name}`, text, html };
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "unsupported_media_type" }, { status: 415 });
  }
  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  // Honeypot / timing trap: pretend success so bots don't adapt.
  const startedAt = Number(body.startedAt);
  if (body.website || !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  if (!(await verifyTurnstile(body.turnstileToken, ip))) {
    return NextResponse.json({ error: "verification" }, { status: 403 });
  }

  const result = validateContact(body);
  if (!result.ok) {
    return NextResponse.json({ error: "invalid", fields: result.errors }, { status: 400 });
  }

  const mailer = getTransporter();
  if (!mailer) {
    console.error("[contact] SMTP is not configured (SMTP_HOST / SMTP_USER / SMTP_PASS).");
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const { subject, text, html } = buildEmail(result.data);
  try {
    await mailer.sendMail({
      // Send as the authenticated mailbox so SPF/DKIM/DMARC pass; reply goes to the visitor.
      from: { name: "Entrpryz Website", address: process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER! },
      to: process.env.CONTACT_TO_EMAIL || DEFAULT_RECIPIENT,
      replyTo: { name: result.data.name, address: result.data.email },
      subject,
      text,
      html,
    });
  } catch (err) {
    // Log the SMTP failure class (e.g. ETIMEDOUT, EAUTH, ECONNECTION) — never credentials.
    const code = (err as { code?: string; responseCode?: number })?.code ?? "unknown";
    const responseCode = (err as { responseCode?: number })?.responseCode;
    console.error(
      `[contact] Failed to send email (code=${code}${responseCode ? `, smtp=${responseCode}` : ""}, host=${process.env.SMTP_HOST}):`,
      err instanceof Error ? err.message : "unknown error"
    );
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
