import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * RFC 6238 time-based one-time passwords (the 6-digit codes from Google
 * Authenticator, 1Password, Authy, ...). SHA-1, 30-second steps, 6 digits,
 * accepting one step of clock drift either side.
 */
const STEP_SECONDS = 30;
const DIGITS = 6;
const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Decode(input: string): Buffer {
  const clean = input.replace(/[\s=-]/g, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of clean) {
    const idx = BASE32.indexOf(ch);
    if (idx === -1) throw new Error("Invalid base32 secret");
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

function hotp(key: Buffer, counter: number): string {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac("sha1", key).update(msg).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const code = (digest.readUInt32BE(offset) & 0x7fffffff) % 10 ** DIGITS;
  return code.toString().padStart(DIGITS, "0");
}

export function totpEnabled(): boolean {
  return !!process.env.ADMIN_TOTP_SECRET;
}

// Reject a code that was already used in this instance (replay within its window).
let lastUsedCounter = -1;

/**
 * Returns the matched time step (pass it to markTotpUsed once the whole login
 * succeeds), 0 when 2FA is off, or null when the code is wrong or reused.
 */
export function checkTotp(code: unknown, now = Date.now()): number | null {
  const secret = process.env.ADMIN_TOTP_SECRET;
  if (!secret) return 0;
  if (typeof code !== "string" || !/^\d{6}$/.test(code.trim())) return null;
  let key: Buffer;
  try {
    key = base32Decode(secret);
  } catch {
    return null;
  }
  if (key.length < 10) return null;

  const counter = Math.floor(now / 1000 / STEP_SECONDS);
  const given = Buffer.from(code.trim());
  for (const c of [counter - 1, counter, counter + 1]) {
    const expected = Buffer.from(hotp(key, c));
    if (timingSafeEqual(expected, given) && c > lastUsedCounter) return c;
  }
  return null;
}

export function markTotpUsed(counter: number) {
  if (counter > lastUsedCounter) lastUsedCounter = counter;
}
