import { SITE_CONTENT } from "./site-content";
import type {
  ServiceItem,
  ProcessStep,
  ValueProp,
  TimelineExperience,
  CertificationGroup,
} from "@/types";

/**
 * Editorial copy. The source of truth is `content/site.json`, edited from
 * /admin; these named exports keep components decoupled from its shape.
 */
export const SITE_IMAGES = SITE_CONTENT.images;
export const HERO_CONTENT = SITE_CONTENT.hero;
export const BEHIND_ENTRPRYZ = SITE_CONTENT.behindEntrpryz;
export const ABOUT_ENTRPRYZ = SITE_CONTENT.about;
export const SERVICES: ServiceItem[] = SITE_CONTENT.services;
export const HOW_WE_WORK = {
  ...SITE_CONTENT.howWeWork,
  steps: SITE_CONTENT.howWeWork.steps as ProcessStep[],
};
export const WHY_ENTRPRYZ = {
  ...SITE_CONTENT.whyEntrpryz,
  reasons: SITE_CONTENT.whyEntrpryz.reasons as ValueProp[],
};
export const FOUNDER_CONTENT = SITE_CONTENT.founder;
export const CAREER_TIMELINE: TimelineExperience[] = SITE_CONTENT.careerTimeline;
export const CERTIFICATIONS: CertificationGroup[] = SITE_CONTENT.certifications;
export const PRODUCT_JOURNEY = SITE_CONTENT.productJourney;
export const CONTACT_CONTENT = SITE_CONTENT.contact;
