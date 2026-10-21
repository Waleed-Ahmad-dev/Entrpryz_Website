/**
 * Admin session tokens: `base64url(payload).base64url(HMAC-SHA256)`.
 *
 * Uses Web Crypto only, so the same code runs in middleware (Edge) and in
 * server components / actions (Node). Signed with ADMIN_SESSION_SECRET —
 * rotating that secret signs everyone out.
 */

export const ADMIN_COOKIE = "entrpryz_admin_session";
export const SESSION_TTL_SECONDS = 8 * 60 * 60;

export interface AdminSession {
  sub: string;
  iat: number;
  exp: number;
}

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function getSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  // Refuse weak secrets rather than issue forgeable sessions.
  return secret && secret.length >= 32 ? secret : null;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(username: string): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSession = { sub: username, iat: now, exp: now + SESSION_TTL_SECONDS };
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(body));
  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token: string | undefined): Promise<AdminSession | null> {
  const secret = getSecret();
  if (!secret || !token) return null;
  const [body, signature, extra] = token.split(".");
  if (!body || !signature || extra !== undefined) return null;
  try {
    // crypto.subtle.verify compares in constant time.
    const valid = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(secret),
      fromBase64Url(signature),
      encoder.encode(body)
    );
    if (!valid) return null;
    const session = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as AdminSession;
    if (typeof session.sub !== "string" || typeof session.exp !== "number") return null;
    if (session.exp <= Math.floor(Date.now() / 1000)) return null;
    // Sessions die if the admin username is changed.
    if (session.sub !== process.env.ADMIN_USERNAME) return null;
    return session;
  } catch {
    return null;
  }
}
