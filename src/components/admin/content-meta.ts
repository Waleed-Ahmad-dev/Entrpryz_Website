/**
 * Presentation metadata for the content editor: section names, where each
 * section appears on the live site, and how each field should be edited.
 * Purely cosmetic — validation lives in `src/lib/content-schema.ts`.
 */

export type Path = (string | number)[];
export type FieldKind = "text" | "longtext" | "image" | "link" | "email";

export interface SectionMeta {
  key: string;
  label: string;
  group: string;
  /** Anchor on the public page where this content renders. */
  anchor: string;
}

export const SECTIONS: SectionMeta[] = [
  { key: "site", label: "SEO & Site Info", group: "Global", anchor: "" },
  { key: "images", label: "Site Images", group: "Global", anchor: "#home" },
  { key: "navigation", label: "Navigation Menu", group: "Global", anchor: "#home" },
  { key: "hero", label: "Hero", group: "Home", anchor: "#home" },
  { key: "behindEntrpryz", label: "Behind Entrpryz (Stats)", group: "About", anchor: "#behind-entrpryz" },
  { key: "about", label: "About Entrpryz", group: "About", anchor: "#about-entrpryz" },
  { key: "founder", label: "Founder Spotlight", group: "About", anchor: "#founder" },
  { key: "certifications", label: "Certifications", group: "About", anchor: "#certifications" },
  { key: "services", label: "Services", group: "Services", anchor: "#services-list" },
  { key: "howWeWork", label: "How We Work", group: "Services", anchor: "#how-we-work" },
  { key: "whyEntrpryz", label: "Why Entrpryz", group: "Services", anchor: "#why-entrpryz" },
  { key: "productJourney", label: "Product Journey", group: "Services", anchor: "#product-journey" },
  { key: "careerTimeline", label: "Career Timeline", group: "Portfolio", anchor: "#career" },
  { key: "portfolio", label: "Portfolio & Projects", group: "Portfolio", anchor: "#track-record" },
  { key: "contact", label: "Contact", group: "Contact", anchor: "#contact" },
];

export const SECTION_BY_KEY = Object.fromEntries(SECTIONS.map((s) => [s.key, s]));

const LABELS: Record<string, string> = {
  p1: "Paragraph 1",
  p2: "Paragraph 2",
  p3: "Paragraph 3",
  cta: "Button Text",
  ctaText: "Button Text",
  ctaHref: "Button Link",
  ctaPrimary: "Primary Button",
  ctaSecondary: "Secondary Button",
  buttonText: "Button Text",
  buttonHref: "Button Link",
  subheadline: "Sub-headline",
  coreAreasIntro: "Core Areas Intro",
  coreAreas: "Core Areas",
  id: "ID (URL slug)",
  logo: "Logo (transparent)",
  logoSquare: "Logo (square, for sharing)",
  heroBackground: "Hero Background",
  founderPhoto: "Founder Photo",
  productJourney: "Product Journey Image",
  general: "General Inquiries Email",
  javed: "Javed's Email",
  waleed: "Waleed's Email",
  items: "Items",
  featured: "Featured Projects",
  additional: "Additional Engagements",
};

export function fieldLabel(key: string | number): string {
  if (typeof key === "number") return `#${key + 1}`;
  if (LABELS[key]) return LABELS[key];
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

const LONG_KEYS = new Set([
  "p1", "p2", "p3", "body", "description", "overview", "subheadline", "subtitle", "scope", "philosophy", "motto",
]);

export function fieldKind(path: Path, value: string): FieldKind {
  const key = path[path.length - 1];
  if (path[0] === "images" || key === "image") return "image";
  if (key === "ctaHref" || key === "buttonHref") return "link";
  if (path[0] === "contact" && path[1] === "contacts") return "email";
  if ((typeof key === "string" && LONG_KEYS.has(key)) || value.length > 140) return "longtext";
  if (path[0] === "certifications" && key === "items") return "longtext";
  return "text";
}

/** Keys an array item may have even when the current value omits them (optional fields). */
const ITEM_TEMPLATES: { match: (p: Path) => boolean; keys: string[] }[] = [
  {
    match: (p) => p[0] === "portfolio" && p[1] === "tiers" && p[3] === "featured",
    keys: ["client", "location", "website", "status", "description", "image"],
  },
  {
    match: (p) => p[0] === "portfolio" && p[1] === "tiers" && p[3] === "additional",
    keys: ["client", "scope", "industry", "platform"],
  },
];

export function templateKeys(arrayPath: Path): string[] | null {
  return ITEM_TEMPLATES.find((t) => t.match(arrayPath))?.keys ?? null;
}

/** Fields that are optional in the schema — shown, but may be left blank. */
export const OPTIONAL_KEYS = new Set(["location", "website", "status", "image", "industry", "platform"]);

/** Short title for an array item, taken from its most descriptive field. */
export function itemTitle(item: unknown, index: number): string {
  if (typeof item === "string") return item || `Item ${index + 1}`;
  if (item && typeof item === "object") {
    const o = item as Record<string, unknown>;
    for (const k of ["title", "client", "company", "name", "label", "value"]) {
      if (typeof o[k] === "string" && o[k]) return o[k] as string;
    }
  }
  return `Item ${index + 1}`;
}

export function pathKey(path: Path): string {
  return path.join(".");
}
