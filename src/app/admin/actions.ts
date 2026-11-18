"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
} from "@/lib/admin-session";
import { checkTotp, markTotpUsed } from "@/lib/totp";
import { LoginThrottle } from "@/lib/login-throttle";
import { verifyTurnstile } from "@/lib/turnstile";

export interface LoginState {
  error: string | null;
}

const MAX_FIELD_LENGTH = 256;
const LOCKOUT_MINUTES = 15;

// Per-IP lockout after 5 failed sign-ins in 15 minutes. Site-wide failures only
// raise an alert (see LoginThrottle). Best-effort per instance until the counters
// move to shared storage; Turnstile and the TOTP second factor sit on top.
const throttle = new LoginThrottle({
  maxFailures: 5,
  windowMs: LOCKOUT_MINUTES * 60 * 1000,
  alertThreshold: 20,
  maxTrackedKeys: 5000,
});

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/** Constant-time string compare (hash first so lengths always match). */
function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const ip = await clientIp();
  if (throttle.isLockedOut(ip)) {
    return { error: `Too many failed attempts. Try again in ${LOCKOUT_MINUTES} minutes.` };
  }

  // A request that fails the bot check never reaches the credential check, so it
  // doesn't count as a failed sign-in; otherwise bots could spend the budget.
  if (!(await verifyTurnstile(formData.get("cf-turnstile-response"), ip))) {
    return { error: "Please complete the security check." };
  }

  const username = formData.get("username");
  const password = formData.get("password");
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username ||
    !password ||
    username.length > MAX_FIELD_LENGTH ||
    password.length > MAX_FIELD_LENGTH
  ) {
    return { error: "Enter your username and password." };
  }

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) {
    console.error("[admin] ADMIN_USERNAME / ADMIN_PASSWORD are not configured.");
    return { error: "Admin login is not configured." };
  }

  // Evaluate both so timing doesn't reveal which one was wrong.
  const userOk = safeEqual(username, expectedUser);
  const passOk = safeEqual(password, expectedPass);
  // Check the one-time code even when the password is wrong, so timing reveals nothing.
  const totpStep = checkTotp(formData.get("code"));
  if (!(userOk && passOk && totpStep !== null)) {
    throttle.recordFailure(ip);
    await new Promise((r) => setTimeout(r, 500));
    return { error: "Invalid sign-in details." };
  }

  const token = await createSessionToken(expectedUser);
  if (!token) {
    console.error("[admin] ADMIN_SESSION_SECRET is missing or shorter than 32 characters.");
    return { error: "Admin login is not configured." };
  }

  throttle.reset(ip);
  markTotpUsed(totpStep);
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
