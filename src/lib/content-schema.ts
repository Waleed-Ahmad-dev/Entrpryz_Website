import { z } from "zod";
import { ICON_NAMES } from "./icon-names";

/**
 * Schema for `content/site.json` — the single source of editable site copy.
 *
 * Each page is a list of typed content blocks. Every save from /admin is
 * re-validated against this on the server, and the build validates it too,
 * so malformed or malicious content fails closed. Objects are `.strict()`:
 * unknown keys are rejected, not silently stored.
 */

// Control characters other than newline/tab; React escapes the rest on render.
const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

const text = (max = 200) =>
  z
    .string()
    .trim()
    .min(1, "Required")
    .max(max, `Must be ${max} characters or fewer`)
    .refine((v) => !CONTROL_CHARS.test(v), "Contains invalid characters");

/** Treat "" (or an object whose fields are all blank) from the editor as "not set". */
function isBlank(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  if (typeof v === "string") return v.trim() === "";
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") return Object.values(v as Record<string, unknown>).every(isBlank);
  return false;
}

const optional = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (isBlank(v) ? undefined : v), schema.optional());

const list = <T extends z.ZodTypeAny>(item: T, max = 50) => z.array(item).max(max, `At most ${max} items`);

/** Only images served from /public/images — no remote URLs, no SVG, no traversal. */
export const IMAGE_PATH_RE = /^\/images\/(?:uploads\/)?[a-z0-9][a-z0-9_-]*\.(?:jpe?g|png|webp)$/;
const imagePath = z.string().regex(IMAGE_PATH_RE, "Must be an image under /images (jpg, png or webp)");

/** Site paths (with optional #anchor), https URLs or mailto — never javascript:/data:. */
const href = z
  .string()
  .trim()
  .max(500)
  .refine((v) => {
    if (/^#[a-z][a-z0-9-]*$/.test(v)) return true;
    if (/^\/(?!\/)[a-z0-9/_\-.]*(?:#[a-z][a-z0-9-]*)?$/.test(v)) return true;
    if (/^mailto:[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i.test(v)) return true;
    return isHttpsUrl(v);
  }, "Use /page, /page#section, https://… or mailto:");

function isHttpsUrl(v: string): boolean {
  try {
    const url = new URL(v);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

const icon = optional(z.enum(ICON_NAMES));

const httpsUrl = z.string().trim().max(500).refine(isHttpsUrl, "Must be a full https:// link");
const email = z.string().trim().toLowerCase().max(254).email("Must be a valid email address");
const anchorId = z
  .string()
  .regex(/^[a-z][a-z0-9-]*$/, "Lowercase letters, numbers and dashes only")
  .max(60);

// ---------- shared pieces ----------

const button = z.object({ label: text(60), href }).strict();
const detailItem = z.object({ title: text(120), detail: optional(text(300)) }).strict();
const aside = z.object({ heading: optional(text(80)), items: list(detailItem, 12) }).strict();

const sectionIntro = {
  id: optional(anchorId),
  eyebrow: optional(text(60)),
  heading: optional(text(200)),
  intro: optional(text(800)),
};

// ---------- blocks ----------

const heroBlock = z
  .object({
    type: z.literal("hero"),
    eyebrow: optional(text(80)),
    heading: text(160),
    body: text(800),
    buttons: list(button, 3),
    aside: optional(aside),
    image: optional(imagePath),
  })
  .strict();

const statsBlock = z
  .object({
    type: z.literal("stats"),
    items: list(z.object({ value: text(30), label: text(60) }).strict(), 8),
  })
  .strict();

const cardsBlock = z
  .object({
    type: z.literal("cards"),
    ...sectionIntro,
    items: list(
      z
        .object({
          id: optional(anchorId),
          icon,
          image: optional(imagePath),
          badge: optional(text(40)),
          title: text(120),
          description: optional(text(800)),
          bullets: list(text(200), 12),
          meta: list(detailItem, 6),
          links: list(button, 3),
        })
        .strict(),
      12
    ),
  })
  .strict();

const stepsBlock = z
  .object({
    type: z.literal("steps"),
    ...sectionIntro,
    heading: text(200),
    items: list(z.object({ title: text(80), description: text(400) }).strict(), 8),
  })
  .strict();

const checklistBlock = z
  .object({
    type: z.literal("checklist"),
    ...sectionIntro,
    link: optional(button),
    items: list(z.object({ icon, title: optional(text(120)), description: text(600) }).strict(), 30),
  })
  .strict();

const faqBlock = z
  .object({
    type: z.literal("faq"),
    ...sectionIntro,
    heading: text(200),
    items: list(z.object({ question: text(200), answer: text(1500) }).strict(), 20),
  })
  .strict();

const ctaBlock = z
  .object({
    type: z.literal("cta"),
    heading: text(160),
    body: optional(text(400)),
    button,
  })
  .strict();

const profileBlock = z
  .object({
    type: z.literal("profile"),
    id: optional(anchorId),
    eyebrow: optional(text(60)),
    name: text(80),
    paragraphs: list(text(1500), 8),
    quote: optional(text(300)),
    image: optional(imagePath),
  })
  .strict();

const textBlock = z
  .object({
    type: z.literal("text"),
    ...sectionIntro,
    paragraphs: list(text(1500), 10),
    button: optional(button),
    aside: optional(aside),
  })
  .strict();

const tagsBlock = z
  .object({
    type: z.literal("tags"),
    ...sectionIntro,
    items: list(z.object({ label: text(60), href: optional(href) }).strict(), 30),
  })
  .strict();

const groupBlock = z
  .object({
    type: z.literal("group"),
    ...sectionIntro,
    heading: text(160),
    items: list(
      z
        .object({
          name: text(160),
          location: optional(text(80)),
          description: text(800),
        })
        .strict(),
      40
    ),
  })
  .strict();

const proseBlock = z
  .object({
    type: z.literal("prose"),
    ...sectionIntro,
    body: list(
      z.object({ kind: z.enum(["paragraph", "bullet"]), text: text(2000) }).strict(),
      40
    ),
  })
  .strict();

const contactBlock = z
  .object({
    type: z.literal("contact"),
    eyebrow: optional(text(60)),
    heading: text(160),
    body: text(600),
    emailLabel: text(40),
    locationLabel: text(40),
    location: text(200),
    note: optional(text(300)),
    formHeading: text(80),
  })
  .strict();

export const blockSchema = z.discriminatedUnion("type", [
  heroBlock,
  statsBlock,
  cardsBlock,
  stepsBlock,
  checklistBlock,
  faqBlock,
  ctaBlock,
  profileBlock,
  textBlock,
  tagsBlock,
  groupBlock,
  proseBlock,
  contactBlock,
]);

const pageSchema = z
  .object({
    seo: z.object({ title: text(70), description: text(200) }).strict(),
    blocks: list(blockSchema, 40),
  })
  .strict();

export const PAGE_KEYS = [
  "homePage",
  "aboutPage",
  "servicesPage",
  "aiAgentsPage",
  "sapHealthCheckPage",
  "misAssessmentPage",
  "portfolioPage",
  "contactPage",
  "privacyPage",
] as const;
export type PageKey = (typeof PAGE_KEYS)[number];

const SOCIAL_PLATFORMS = ["linkedin", "facebook", "instagram", "x", "youtube"] as const;

export const siteContentSchema = z
  .object({
    site: z
      .object({
        name: text(40),
        tagline: text(80),
        location: text(200),
        footerServices: list(button, 8),
        copyright: text(120),
        // Used in structured data (schema.org areaServed); keep in line with the visible wording.
        areaServed: list(text(60), 10).min(1, "Add at least one area"),
        // Optional, e.g. 2024 or 2024-03-01.
        foundingDate: optional(z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, "Use YYYY or YYYY-MM-DD")),
        whatsapp: z
          .object({
            // Digits only, international format without "+" (e.g. 923001234567). Blank hides the button.
            number: optional(z.string().regex(/^[1-9]\d{7,14}$/, "Digits only, with country code, e.g. 923001234567")),
            message: optional(text(200)),
          })
          .strict(),
        social: list(
          z.object({ platform: z.enum(SOCIAL_PLATFORMS), url: httpsUrl }).strict(),
          8
        ),
      })
      .strict(),
    images: z
      .object({
        logo: imagePath,
        logoSquare: imagePath,
        heroBackground: imagePath,
        founderPhoto: imagePath,
      })
      .strict(),
    navigation: z
      .object({
        links: list(z.object({ name: text(30), href }).strict(), 8),
        cta: button,
      })
      .strict(),
    contact: z
      .object({
        email,
        form: z
          .object({
            nameLabel: text(40),
            emailLabel: text(40),
            companyLabel: text(40),
            areaLabel: text(40),
            messageLabel: text(40),
            areas: list(text(80), 12).min(1, "Add at least one option"),
            submitLabel: text(40),
            privacyNote: text(300),
            successHeading: text(80),
            successBody: text(300),
          })
          .strict(),
      })
      .strict(),
    ...Object.fromEntries(PAGE_KEYS.map((k) => [k, pageSchema])) as Record<PageKey, typeof pageSchema>,
  })
  .strict();

export type SiteContent = z.infer<typeof siteContentSchema>;
export type Block = z.infer<typeof blockSchema>;
export type BlockOf<T extends Block["type"]> = Extract<Block, { type: T }>;
export type PageContent = z.infer<typeof pageSchema>;

/** Hard cap on the serialized document, checked before parsing. */
export const MAX_CONTENT_BYTES = 512 * 1024;

/** Throws (failing the build) if the bundled content is invalid. Server-only. */
export function assertValidSiteContent(content: unknown): void {
  const result = siteContentSchema.safeParse(content);
  if (!result.success) {
    const issues = result.error.issues
      .slice(0, 10)
      .map((i) => `  ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`content/site.json is invalid:\n${issues}`);
  }
}
