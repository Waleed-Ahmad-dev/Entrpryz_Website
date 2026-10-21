import { SITE_CONTENT } from "./site-content";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://entrpryz.com";
export const SITE_NAME = "Entrpryz";
export const SITE_TITLE = SITE_CONTENT.site.title;
export const SITE_DESCRIPTION = SITE_CONTENT.site.description;