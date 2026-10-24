import { SITE_CONTENT } from "./site-content";

/**
 * Canonical origin. entrpryz.com 308-redirects to www.entrpryz.com on Vercel,
 * so canonicals, og:url, the sitemap, robots.txt and schema all use www.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.entrpryz.com").replace(/\/+$/, "");
export const SITE_NAME = SITE_CONTENT.site.name;
export const SITE_TITLE = SITE_CONTENT.homePage.seo.title;
export const SITE_DESCRIPTION = SITE_CONTENT.homePage.seo.description;
