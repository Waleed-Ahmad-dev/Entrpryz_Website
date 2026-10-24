// Generates an ADMIN_TOTP_SECRET and the otpauth:// link for an authenticator app.
// Usage: npm run admin:totp -- <username>
// Prints to your terminal only. Put the secret in Vercel; scan the link (or type
// the secret) in Google Authenticator, 1Password, Authy, etc.
import { randomBytes } from "node:crypto";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const bytes = randomBytes(20);
let bits = 0;
let value = 0;
let secret = "";
for (const b of bytes) {
  value = (value << 8) | b;
  bits += 8;
  while (bits >= 5) {
    secret += alphabet[(value >>> (bits - 5)) & 31];
    bits -= 5;
  }
}
if (bits > 0) secret += alphabet[(value << (5 - bits)) & 31];

const user = process.argv[2] || "admin";
const label = encodeURIComponent(`Entrpryz Admin:${user}`);
console.log(`ADMIN_TOTP_SECRET=${secret}`);
console.log(`otpauth://totp/${label}?secret=${secret}&issuer=Entrpryz%20Admin&algorithm=SHA1&digits=6&period=30`);
