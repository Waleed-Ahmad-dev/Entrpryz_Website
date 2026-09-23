import { WebsiteNavSection } from "@/types";

/**
 * Single source of truth for the one-pager navigation. `href` values are
 * `#id` anchors that must match the section ids rendered in `src/app/page.tsx`.
 */
export const NAV_LINKS: WebsiteNavSection[] = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Contact", href: "#contact" },
];

export const NAV_ANCHOR_IDS = NAV_LINKS.map((link) => link.href.slice(1));