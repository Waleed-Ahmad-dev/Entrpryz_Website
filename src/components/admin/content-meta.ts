import { ICON_NAMES } from "@/lib/icon-names";

/**
 * Presentation metadata for the content editor: section names, where each
 * section appears on the live site, and how each field should be edited.
 * Purely cosmetic — validation lives in `src/lib/content-schema.ts`.
 */

export type Path = (string | number)[];
export type FieldKind = "text" | "longtext" | "image" | "link" | "email" | "choice";

export interface SectionMeta {
  key: string;
  label: string;
  group: string;
  /** Public path where this content appears. */
  href: string;
}

export const SECTIONS: SectionMeta[] = [
  { key: "site", label: "Site-wide Details", group: "Global", href: "/" },
  { key: "navigation", label: "Header Menu", group: "Global", href: "/" },
  { key: "images", label: "Logos & Images", group: "Global", href: "/" },
  { key: "contact", label: "Email & Contact Form", group: "Global", href: "/contact" },
  { key: "homePage", label: "Home", group: "Pages", href: "/" },
  { key: "aboutPage", label: "About", group: "Pages", href: "/about" },
  { key: "servicesPage", label: "Services", group: "Pages", href: "/services" },
  { key: "aiAgentsPage", label: "AI Agents", group: "Service Pages", href: "/services/ai-agents" },
  { key: "sapHealthCheckPage", label: "SAP B1 Health Check", group: "Service Pages", href: "/services/sap-business-one-health-check" },
  { key: "misAssessmentPage", label: "MIS Assessment", group: "Service Pages", href: "/services/mis-assessment-development-roadmap" },
  { key: "portfolioPage", label: "Portfolio", group: "Pages", href: "/portfolio" },
  { key: "contactPage", label: "Contact", group: "Pages", href: "/contact" },
  { key: "privacyPage", label: "Privacy Policy", group: "Pages", href: "/privacy-policy" },
];

export const SECTION_BY_KEY = Object.fromEntries(SECTIONS.map((s) => [s.key, s]));

const BLOCK_LABELS: Record<string, string> = {
  hero: "Page Header",
  stats: "Stats",
  cards: "Cards",
  steps: "Steps",
  checklist: "List",
  faq: "FAQ",
  cta: "Call to Action",
  profile: "Profile",
  text: "Text",
  tags: "Tags",
  group: "Portfolio Group",
  prose: "Policy Section",
  contact: "Contact Details",
};

/** Optional text fields each block type supports, shown even when currently empty. */
const BLOCK_FIELDS: Record<string, string[]> = {
  hero: ["eyebrow", "heading", "body", "image"],
  cards: ["id", "eyebrow", "heading", "intro"],
  steps: ["id", "eyebrow", "heading", "intro"],
  checklist: ["id", "eyebrow", "heading", "intro"],
  faq: ["id", "eyebrow", "heading", "intro"],
  cta: ["heading", "body"],
  profile: ["id", "eyebrow", "name", "quote", "image"],
  text: ["id", "eyebrow", "heading", "intro"],
  tags: ["id", "eyebrow", "heading", "intro"],
  group: ["id", "eyebrow", "heading", "intro"],
  prose: ["id", "eyebrow", "heading", "intro"],
  contact: ["eyebrow", "heading", "body", "emailLabel", "locationLabel", "location", "note", "formHeading"],
};

const LABELS: Record<string, string> = {
  seo: "Search Engine (SEO)",
  blocks: "Page Sections",
  eyebrow: "Small Label Above Heading",
  intro: "Intro Text",
  id: "Anchor ID (for #links)",
  href: "Link",
  cta: "Header Button",
  links: "Buttons",
  buttons: "Buttons",
  button: "Button",
  meta: "Details",
  aside: "Side Panel",
  paragraphs: "Paragraphs",
  bullets: "Bullet Points",
  logo: "Logo (transparent)",
  logoSquare: "Logo (square, for sharing)",
  heroBackground: "Home Header Image",
  founderPhoto: "Founder Photo",
  footerServices: "Footer Service Links",
  whatsapp: "WhatsApp Button",
  number: "WhatsApp Number",
  message: "Pre-filled Message",
  social: "Social Links",
  areas: "Area of Interest Options",
  privacyNote: "Privacy Note",
};

export function fieldLabel(key: string | number): string {
  if (typeof key === "number") return `#${key + 1}`;
  if (LABELS[key]) return LABELS[key];
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());
}

const LONG_KEYS = new Set([
  "body", "description", "intro", "answer", "text", "quote", "privacyNote", "successBody", "location",
]);

export const CHOICES: Record<string, string[]> = {
  kind: ["paragraph", "bullet"],
  platform: ["linkedin", "facebook", "instagram", "x", "youtube"],
  icon: [...ICON_NAMES],
};

export function fieldKind(path: Path, value: string): FieldKind {
  const key = path[path.length - 1];
  const parent = path[path.length - 2];
  if (typeof key === "string" && CHOICES[key]) return "choice";
  if (path[0] === "images" || key === "image") return "image";
  if (key === "href" || key === "url") return "link";
  if (key === "email") return "email";
  if (parent === "paragraphs") return "longtext";
  if ((typeof key === "string" && LONG_KEYS.has(key)) || value.length > 140) return "longtext";
  return "text";
}

/** Fields that can't be edited: the block type defines the layout. */
export function isReadOnly(path: Path): boolean {
  return path[path.length - 1] === "type";
}

/** True for a page's list of sections — its layout is fixed; content inside is editable. */
export function isBlockList(path: Path): boolean {
  return path.length === 2 && path[1] === "blocks";
}

/** Shape for a new item in a list that may be empty, keyed by the list's name. */
const NEW_ITEM_KEYS: Record<string, string[]> = {
  meta: ["title", "detail"],
  links: ["label", "href"],
  buttons: ["label", "href"],
  social: ["platform", "url"],
  footerServices: ["label", "href"],
};

export function newItemTemplate(arrayPath: Path): Record<string, string> | "" {
  const keys = NEW_ITEM_KEYS[String(arrayPath[arrayPath.length - 1])];
  return keys ? Object.fromEntries(keys.map((k) => [k, ""])) : "";
}

/** Extra keys an object may have even when the current value omits them (optional fields). */
export function templateKeys(arrayPath: Path, item?: unknown): string[] | null {
  if (!item || typeof item !== "object") return null;
  if (arrayPath[arrayPath.length - 1] === "blocks") {
    return BLOCK_FIELDS[String((item as Record<string, unknown>).type)] ?? null;
  }
  // Cards (they have bullets) can always take an icon, image or badge.
  if ("bullets" in item) return ["icon", "image", "badge"];
  return null;
}

/** Optional in the schema — shown, but may be left blank. */
export const OPTIONAL_KEYS = new Set([
  "eyebrow", "intro", "id", "badge", "detail", "location", "image", "quote", "note", "number", "message", "icon",
]);

/** Short title for an array item, taken from its most descriptive field. */
export function itemTitle(item: unknown, index: number): string {
  if (typeof item === "string") return item || `Item ${index + 1}`;
  if (item && typeof item === "object") {
    const o = item as Record<string, unknown>;
    const pick = ["heading", "title", "name", "question", "label", "value", "eyebrow", "text"]
      .map((k) => o[k])
      .find((v): v is string => typeof v === "string" && v.length > 0);
    if (typeof o.type === "string" && BLOCK_LABELS[o.type]) {
      return `${BLOCK_LABELS[o.type]}${pick ? ` — ${pick}` : ""}`;
    }
    if (pick) return pick.length > 80 ? `${pick.slice(0, 77)}…` : pick;
  }
  return `Item ${index + 1}`;
}

/** Live-site link for a field: its page, plus the section's #anchor when it has one. */
export function siteHref(doc: Record<string, unknown>, path: Path): string {
  const section = SECTION_BY_KEY[String(path[0])];
  if (!section) return "/";
  if (path[1] === "blocks" && typeof path[2] === "number") {
    const blocks = (doc[String(path[0])] as { blocks?: { id?: string }[] })?.blocks;
    const id = blocks?.[path[2]]?.id;
    if (id) return `${section.href}#${id}`;
  }
  return section.href;
}

export function pathKey(path: Path): string {
  return path.join(".");
}
