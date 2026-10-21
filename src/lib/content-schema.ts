import { z } from "zod";

/**
 * Schema for `content/site.json` — the single source of editable site copy.
 *
 * Every save from /admin is re-validated against this on the server, and the
 * public build parses it too, so malformed or malicious content fails closed.
 * Objects are `.strict()`: unknown keys are rejected, not silently stored.
 */

// Strip control characters other than newline/tab; React escapes the rest on render.
const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

const text = (max = 200) =>
  z
    .string()
    .trim()
    .min(1, "Required")
    .max(max, `Must be ${max} characters or fewer`)
    .refine((v) => !CONTROL_CHARS.test(v), "Contains invalid characters");

const optionalText = (max = 200) =>
  blankAsUndefined(
    z
      .string()
      .trim()
      .max(max, `Must be ${max} characters or fewer`)
      .refine((v) => !CONTROL_CHARS.test(v), "Contains invalid characters")
  );

/** Treat "" from an emptied input as "not set". */
const blankAsUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), schema.optional());

const list = <T extends z.ZodTypeAny>(item: T, max = 50) =>
  z.array(item).max(max, `At most ${max} items`);

/** Only images served from /public/images — no remote URLs, no SVG, no traversal. */
export const IMAGE_PATH_RE = /^\/images\/(?:uploads\/)?[a-z0-9][a-z0-9_-]*\.(?:jpe?g|png|webp)$/;
const imagePath = z.string().regex(IMAGE_PATH_RE, "Must be an image under /images (jpg, png or webp)");

/** On-page anchors, site-relative paths, https URLs or mailto — never javascript:/data:. */
const href = z
  .string()
  .trim()
  .max(500)
  .refine((v) => {
    if (/^#[a-z][a-z0-9-]*$/.test(v)) return true;
    if (/^\/(?!\/)[A-Za-z0-9/_\-.#?=&]*$/.test(v)) return true;
    if (/^mailto:[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i.test(v)) return true;
    try {
      const url = new URL(v);
      return url.protocol === "https:" && !url.username && !url.password;
    } catch {
      return false;
    }
  }, "Use #section, /path, https://… or mailto:");

const email = z.string().trim().toLowerCase().max(254).email("Must be a valid email address");

const domain = blankAsUndefined(
  z
    .string()
    .trim()
    .max(253)
    .regex(/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i, "Must be a domain like example.com")
);

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and dashes only").max(60);

const NAV_ANCHORS = ["#home", "#about", "#services", "#portfolio", "#contact"] as const;

const titled = z.object({ title: text(120), description: text(600) }).strict();

export const siteContentSchema = z
  .object({
    site: z.object({ title: text(120), description: text(300) }).strict(),
    images: z
      .object({
        logo: imagePath,
        logoSquare: imagePath,
        heroBackground: imagePath,
        founderPhoto: imagePath,
        productJourney: imagePath,
      })
      .strict(),
    navigation: list(z.object({ name: text(30), href: z.enum(NAV_ANCHORS) }).strict(), 10),
    hero: z
      .object({
        headline: text(120),
        subheadline: text(300),
        body: text(600),
        ctaPrimary: text(40),
        ctaSecondary: text(40),
      })
      .strict(),
    behindEntrpryz: z
      .object({
        headline: text(160),
        subheadline: text(300),
        stats: list(z.object({ value: text(30), label: text(60) }).strict(), 12),
        cta: text(60),
      })
      .strict(),
    about: z
      .object({
        headline: text(160),
        p1: text(1200),
        p2: text(1200),
        coreAreasIntro: text(200),
        coreAreas: list(titled, 12),
      })
      .strict(),
    services: list(
      z
        .object({
          id: slug,
          title: text(80),
          subtitle: text(300),
          items: list(text(120), 20),
          ctaText: text(60),
          ctaHref: href,
          image: imagePath,
        })
        .strict(),
      12
    ),
    howWeWork: z
      .object({
        headline: text(160),
        steps: list(
          z.object({ number: text(4), title: text(60), description: text(600) }).strict(),
          12
        ),
      })
      .strict(),
    whyEntrpryz: z.object({ headline: text(160), reasons: list(titled, 12) }).strict(),
    founder: z
      .object({
        name: text(80),
        role: text(120),
        p1: text(1200),
        p2: text(1200),
        p3: text(1200),
        competencies: list(text(120), 30),
        philosophy: text(300),
        cta: text(60),
      })
      .strict(),
    careerTimeline: list(
      z
        .object({
          company: text(120),
          location: text(80),
          role: text(120),
          period: text(40),
          overview: text(1200),
        })
        .strict(),
      30
    ),
    certifications: list(z.object({ title: text(80), items: text(1200) }).strict(), 20),
    productJourney: z
      .object({
        headline: text(160),
        p1: text(1200),
        p2: text(300),
        motto: text(300),
        status: text(200),
        cta: text(60),
      })
      .strict(),
    contact: z
      .object({
        headline: text(160),
        body: text(600),
        tagline: text(120),
        cta: text(60),
        contacts: z.object({ general: email, javed: email, waleed: email }).strict(),
      })
      .strict(),
    portfolio: z
      .object({
        header: z.object({ headline: text(200), subheadline: text(1200) }).strict(),
        tiers: list(
          z
            .object({
              id: slug,
              title: text(120),
              subtitle: text(400),
              featured: list(
                z
                  .object({
                    client: text(120),
                    location: optionalText(80),
                    website: domain,
                    status: optionalText(120),
                    description: text(1200),
                    image: blankAsUndefined(imagePath),
                  })
                  .strict(),
                20
              ),
              additional: list(
                z
                  .object({
                    client: text(200),
                    scope: text(400),
                    industry: optionalText(80),
                    platform: optionalText(80),
                  })
                  .strict(),
                100
              ),
            })
            .strict(),
          10
        ),
        achievements: list(text(400), 20),
        cta: z.object({ headline: text(200), buttonText: text(60), buttonHref: href }).strict(),
      })
      .strict(),
  })
  .strict();

export type SiteContent = z.infer<typeof siteContentSchema>;

/** Hard cap on the serialized document, checked before parsing. */
export const MAX_CONTENT_BYTES = 256 * 1024;

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
