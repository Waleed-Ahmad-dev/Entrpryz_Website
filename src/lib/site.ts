import { SITE_CONTENT } from "./site-content";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://entrpryz.com";
export const SITE_NAME = SITE_CONTENT.site.name;
export const SITE_TITLE = SITE_CONTENT.homePage.seo.title;
export const SITE_DESCRIPTION = SITE_CONTENT.homePage.seo.description;
