import { SITE_URL } from "@/lib/site";

/**
 * Origins allowed to POST to this site's API routes (CSRF / cross-site spam
 * protection). The list comes from configuration, never from request headers
 * such as Host or X-Forwarded-Host, which a client or proxy can set.
 *
 * - The canonical site origin (NEXT_PUBLIC_SITE_URL) and its www/apex twin
 * - This Vercel deployment's own URLs (preview and branch deployments)
 * - Any localhost port during `next dev`
 */
export function allowedOrigins(env: NodeJS.ProcessEnv = process.env): Set<string> {
  const origins = new Set<string>();
  const add = (url: string | undefined) => {
    if (!url) return;
    try {
      origins.add(new URL(url).origin);
    } catch {
      // Ignore malformed configuration rather than allowing anything.
    }
  };

  const site = new URL(SITE_URL);
  add(site.origin);
  const twin = site.hostname.startsWith("www.") ? site.hostname.slice(4) : `www.${site.hostname}`;
  add(`${site.protocol}//${twin}${site.port ? `:${site.port}` : ""}`);

  for (const host of [env.VERCEL_URL, env.VERCEL_BRANCH_URL, env.VERCEL_PROJECT_PRODUCTION_URL]) {
    if (host) add(`https://${host}`);
  }
  return origins;
}

export function isAllowedOrigin(origin: string | null, env: NodeJS.ProcessEnv = process.env): boolean {
  if (!origin) return false;
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  if (env.NODE_ENV === "development" && (url.hostname === "localhost" || url.hostname === "127.0.0.1")) {
    return url.protocol === "http:" || url.protocol === "https:";
  }
  // A well-formed Origin header is exactly scheme://host[:port]. Anything else
  // (a path, trailing slash, userinfo, different case) is rejected, not normalized.
  return url.origin === origin && allowedOrigins(env).has(origin);
}
