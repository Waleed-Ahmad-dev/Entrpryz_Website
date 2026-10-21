import rawContent from "../../content/site.json";
import type { SiteContent } from "./content-schema";

/**
 * Typed view of `content/site.json`. Validation runs server-side
 * (`assertValidSiteContent` in the root layout, and on every admin save), so
 * client components can import copy without bundling the schema library.
 */
export const SITE_CONTENT = rawContent as unknown as SiteContent;
