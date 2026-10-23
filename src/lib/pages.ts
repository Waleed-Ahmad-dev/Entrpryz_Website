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

export function getPage(key: PageKey): PageContent {
  return SITE_CONTENT[key];
}

export function pageMetadata(key: PageKey): Metadata {
  const { seo } = getPage(key);
  const path = PAGE_PATHS[key];
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: path },
    openGraph: { title: seo.title, description: seo.description, url: `${SITE_URL}${path === "/" ? "" : path}` },
    twitter: { title: seo.title, description: seo.description },
  };
}
