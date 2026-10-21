"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
} from "@/lib/admin-session";

export interface LoginState {
  error: string | null;
}

const MAX_FAILURES = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const MAX_FIELD_LENGTH = 256;

// Best-effort per-instance throttle; serverless instances don't share memory.
const failures = new Map<string, { count: number; first: number }>();

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

function recordFailure(ip: string) {
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
  if (isLockedOut(ip)) {
    return { error: "Too many failed attempts. Try again in 15 minutes." };
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
  if (!(userOk && passOk)) {
    recordFailure(ip);
    await new Promise((r) => setTimeout(r, 500));
    return { error: "Invalid username or password." };
  }

  const token = await createSessionToken(expectedUser);
  if (!token) {
    console.error("[admin] ADMIN_SESSION_SECRET is missing or shorter than 32 characters.");
    return { error: "Admin login is not configured." };
  }

  failures.delete(ip);
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
