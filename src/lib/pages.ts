import type { Metadata } from "next";
import type { PageContent, PageKey } from "./content-schema";
import { SITE_CONTENT } from "./site-content";
import { SITE_URL } from "./site";

/** Public route for each editable page in `content/site.json`. */
export const PAGE_PATHS: Record<PageKey, string> = {
  homePage: "/",
  aboutPage: "/about",
  servicesPage: "/services",
  aiAgentsPage: "/services/ai-agents",
  sapHealthCheckPage: "/services/sap-business-one-health-check",
  misAssessmentPage: "/services/mis-assessment-development-roadmap",
  portfolioPage: "/portfolio",
  contactPage: "/contact",
  privacyPage: "/privacy-policy",
};

/** Short names for breadcrumbs. */
export const PAGE_LABELS: Record<PageKey, string> = {
  homePage: "Home",
  aboutPage: "About",
  servicesPage: "Services",
  aiAgentsPage: "AI Agents",
  sapHealthCheckPage: "SAP Business One Health Check",
  misAssessmentPage: "MIS Assessment & Development Roadmap",
  portfolioPage: "Portfolio",
  contactPage: "Contact",
  privacyPage: "Privacy Policy",
};

/** Pages that describe a single service (children of /services). */
export const SERVICE_PAGES: PageKey[] = ["aiAgentsPage", "sapHealthCheckPage", "misAssessmentPage"];

export function getPage(key: PageKey): PageContent {
  return SITE_CONTENT[key];
}

/** Rendered by app/opengraph-image.tsx at build time. */
const SHARE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${SITE_CONTENT.site.name} — ${SITE_CONTENT.site.tagline}`,
  type: "image/png",
};

export function pageMetadata(key: PageKey): Metadata {
  const { seo } = getPage(key);
  const path = PAGE_PATHS[key];
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: path },
    // Page-level openGraph replaces the root one, so repeat type/site name here.
    // The share image comes from app/opengraph-image.tsx for every page.
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_CONTENT.site.name,
      title: seo.title,
      description: seo.description,
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      images: [SHARE_IMAGE],
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: [SHARE_IMAGE.url] },
  };
}
