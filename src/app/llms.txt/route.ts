import { SITE_CONTENT } from "@/lib/site-content";
import { PAGE_LABELS, PAGE_PATHS, getPage } from "@/lib/pages";
import { SITE_URL } from "@/lib/site";
import type { PageKey } from "@/lib/content-schema";

export const dynamic = "force-static";

/** llms.txt (https://llmstxt.org): a plain-text map of the site for AI assistants, built from content. */
export function GET() {
  const { site, homePage, contact } = SITE_CONTENT;
  const lines = [
    `# ${site.name}`,
    "",
    `> ${homePage.seo.description}`,
    "",
    `${site.name} (${site.tagline}) is not affiliated with similarly named companies. Contact: ${contact.email}.`,
    "",
    "## Pages",
    "",
    ...(Object.entries(PAGE_PATHS) as [PageKey, string][]).map(([key, path]) => {
      const { seo } = getPage(key);
      return `- [${PAGE_LABELS[key]}](${SITE_URL}${path === "/" ? "" : path}): ${seo.description}`;
    }),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
