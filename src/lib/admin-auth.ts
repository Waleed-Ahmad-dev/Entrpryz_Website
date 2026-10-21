import "server-only";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken, type AdminSession } from "./admin-session";

/**
 * Server actions are public POST endpoints: middleware does not protect them
 * when invoked directly, so every admin action must call this first.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  return verifySessionToken(cookies().get(ADMIN_COOKIE)?.value);
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new UnauthorizedError();
  return session;
}
