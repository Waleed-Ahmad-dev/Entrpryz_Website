import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-session";

const LOGIN_PATH = "/admin/login";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value);

  let res: NextResponse;
  if (pathname === LOGIN_PATH) {
    // Already signed in: skip the login form.
    res = session ? NextResponse.redirect(new URL("/admin", req.url)) : NextResponse.next();
  } else if (!session) {
    res = NextResponse.redirect(new URL(LOGIN_PATH, req.url));
    if (req.cookies.has(ADMIN_COOKIE)) res.cookies.delete(ADMIN_COOKIE);
  } else {
    res = NextResponse.next();
  }

  // Admin pages must never be cached or indexed. Framing is already blocked
  // site-wide (X-Frame-Options and CSP frame-ancestors in next.config.mjs).
  res.headers.set("Cache-Control", "no-store, max-age=0");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Referrer-Policy", "same-origin");
  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
