import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { PAGE_PATHS, getPage } from "@/lib/pages";
import type { PageKey } from "@/lib/content-schema";

export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.entries(PAGE_PATHS) as [PageKey, string][]).map(([key, path]) => {
    const updated = getPage(key).seo.updated;
    return {
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      // Real per-page date, stamped when the page's content is published.
      ...(updated ? { lastModified: updated } : {}),
    };
  });
}
