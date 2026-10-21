import { SITE_CONTENT } from "./site-content";
import type { PortfolioTier } from "@/types";

/** Track-record copy; source of truth is `content/site.json` (edited from /admin). */
export const PORTFOLIO_HEADER = SITE_CONTENT.portfolio.header;
export const PORTFOLIO_TIERS: PortfolioTier[] = SITE_CONTENT.portfolio.tiers;
export const PORTFOLIO_ACHIEVEMENTS = SITE_CONTENT.portfolio.achievements;
export const PORTFOLIO_CTA = SITE_CONTENT.portfolio.cta;
