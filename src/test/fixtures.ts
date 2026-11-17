import rawContent from "../../content/site.json";
import type { SiteContent } from "@/lib/content-schema";

/** A fresh, mutable copy of the committed `content/site.json` for each test. */
export function siteContentFixture(): SiteContent {
  return structuredClone(rawContent) as unknown as SiteContent;
}
