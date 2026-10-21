import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-session";

const LOGIN_PATH = "/admin/login";

export async function middleware(req: NextRequest) {
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

  // Admin pages must never be cached, framed or indexed.
  res.headers.set("Cache-Control", "no-store, max-age=0");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Referrer-Policy", "same-origin");
  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
