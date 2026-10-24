import "server-only";

/**
 * Cloudflare Turnstile verification. Turnstile is on when both keys are set:
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY (rendered in the browser) and
 * TURNSTILE_SECRET_KEY (server only). With neither set, checks are skipped.
 */
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function turnstileEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !!process.env.TURNSTILE_SECRET_KEY;
}

export async function verifyTurnstile(token: unknown, ip?: string): Promise<boolean> {
  if (!turnstileEnabled()) return true;
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) return false;

  const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token });
  if (ip && ip !== "unknown") body.set("remoteip", ip);
  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // Fail closed: if Cloudflare can't be reached, don't accept the request.
    return false;
  }
}
