import { WebsiteNavSection } from "@/types";
import { SITE_CONTENT } from "./site-content";

/**
 * Single source of truth for the one-pager navigation. `href` values are
 * `#id` anchors that must match the section ids rendered in `src/app/(site)/page.tsx`;
 * labels are editable in `content/site.json`, anchors are fixed by the schema.
 */
export const NAV_LINKS: WebsiteNavSection[] = SITE_CONTENT.navigation;

export const NAV_ANCHOR_IDS = NAV_LINKS.map((link) => link.href.slice(1));
