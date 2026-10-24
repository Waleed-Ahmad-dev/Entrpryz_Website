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
import { verifyTurnstile } from "@/lib/turnstile";

export interface LoginState {
  error: string | null;
}

const MAX_FAILURES = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const MAX_FIELD_LENGTH = 256;

// Site-wide cap so attempts spread over many IPs are throttled too.
const MAX_GLOBAL_FAILURES = 20;

// Best-effort per-instance throttle; serverless instances don't share memory,
// so pair this with Turnstile and the TOTP second factor (both below).
const failures = new Map<string, { count: number; first: number }>();
let globalFailures = { count: 0, first: Date.now() };

function clientIp(): string {
  const h = headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function isLockedOut(ip: string): boolean {
  const entry = failures.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.first > LOCKOUT_MS) {
    failures.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

function globallyLocked(): boolean {
  if (Date.now() - globalFailures.first > LOCKOUT_MS) globalFailures = { count: 0, first: Date.now() };
  return globalFailures.count >= MAX_GLOBAL_FAILURES;
}

function recordFailure(ip: string) {
  if (Date.now() - globalFailures.first > LOCKOUT_MS) globalFailures = { count: 0, first: Date.now() };
  globalFailures.count += 1;
  if (failures.size > 5000) failures.clear();
  const entry = failures.get(ip);
  if (!entry || Date.now() - entry.first > LOCKOUT_MS) {
    failures.set(ip, { count: 1, first: Date.now() });
  } else {
    entry.count += 1;
  }
}

/** Constant-time string compare (hash first so lengths always match). */
function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const ip = clientIp();
  if (isLockedOut(ip) || globallyLocked()) {
    return { error: "Too many failed attempts. Try again in 15 minutes." };
  }

  if (!(await verifyTurnstile(formData.get("cf-turnstile-response"), ip))) {
    recordFailure(ip);
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
    recordFailure(ip);
    await new Promise((r) => setTimeout(r, 500));
    return { error: "Invalid sign-in details." };
  }

  const token = await createSessionToken(expectedUser);
  if (!token) {
    console.error("[admin] ADMIN_SESSION_SECRET is missing or shorter than 32 characters.");
    return { error: "Admin login is not configured." };
  }

  failures.delete(ip);
  markTotpUsed(totpStep);
  cookies().set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  redirect("/admin");
}

export async function logout() {
  cookies().delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
