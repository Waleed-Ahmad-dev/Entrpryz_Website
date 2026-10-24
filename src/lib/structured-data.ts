import type { BlockOf, PageKey } from "./content-schema";
import { SITE_CONTENT } from "./site-content";
import { PAGE_LABELS, PAGE_PATHS, SERVICE_PAGES, getPage } from "./pages";
import { SITE_URL } from "./site";

/**
 * schema.org JSON-LD built from content/site.json, so it always matches the
 * visible page. The Organization/WebSite graph is emitted once per page from
 * the root layout; page-specific entities reference it by @id.
 */

type Json = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const absolute = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

function profiles(): BlockOf<"profile">[] {
  return getPage("aboutPage").blocks.filter((b): b is BlockOf<"profile"> => b.type === "profile");
}

function personId(name: string) {
  return `${SITE_URL}/about#${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function siteGraph(): Json {
  const { site, contact, images, homePage } = SITE_CONTENT;
  const sameAs = site.social.map((s) => s.url);
  const founders = profiles().map((p) => ({ "@id": personId(p.name) }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: site.name,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: absolute(images.logoSquare) },
        image: absolute("/opengraph-image"),
        slogan: site.tagline,
        description: homePage.seo.description,
        email: contact.email,
        areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
        ...(site.foundingDate ? { foundingDate: site.foundingDate } : {}),
        ...(founders.length ? { founder: founders } : {}),
        ...(sameAs.length ? { sameAs } : {}),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: contact.email,
          url: absolute(PAGE_PATHS.contactPage),
          areaServed: site.areaServed,
        },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: site.name,
        description: homePage.seo.description,
        publisher: { "@id": ORG_ID },
        inLanguage: "en",
      },
    ],
  };
}

export function pageGraph(key: PageKey): Json | null {
  const page = getPage(key);
  const path = PAGE_PATHS[key];
  const url = absolute(path);
  const nodes: Json[] = [];

  // WebPage, linked to the site and organization.
  nodes.push({
    "@type": key === "aboutPage" ? "AboutPage" : key === "contactPage" ? "ContactPage" : "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: page.seo.title,
    description: page.seo.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    ...(key !== "homePage" ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
  });

  // Breadcrumbs for inner pages: Home › (Services ›) Page.
  if (key !== "homePage") {
    const trail: { name: string; url: string }[] = [{ name: "Home", url: SITE_URL }];
    if (SERVICE_PAGES.includes(key)) trail.push({ name: PAGE_LABELS.servicesPage, url: absolute(PAGE_PATHS.servicesPage) });
    trail.push({ name: PAGE_LABELS[key], url });
    nodes.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: t.url })),
    });
  }

  // Service pages describe one service offered by the organization.
  if (SERVICE_PAGES.includes(key)) {
    const hero = page.blocks.find((b): b is BlockOf<"hero"> => b.type === "hero");
    nodes.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: hero?.heading ?? PAGE_LABELS[key],
      description: hero?.body ?? page.seo.description,
      url,
      provider: { "@id": ORG_ID },
      areaServed: SITE_CONTENT.site.areaServed,
    });
  }

  // The services overview lists the three practice areas as services.
  if (key === "servicesPage") {
    for (const block of page.blocks) {
      if (block.type === "checklist" && block.id && block.eyebrow) {
        nodes.push({
          "@type": "Service",
          "@id": `${url}#${block.id}`,
          name: block.eyebrow,
          description: block.intro ?? block.heading,
          url: `${url}#${block.id}`,
          provider: { "@id": ORG_ID },
          areaServed: SITE_CONTENT.site.areaServed,
        });
      }
    }
  }

  // About: the founders as people.
  if (key === "aboutPage") {
    for (const p of profiles()) {
      nodes.push({
        "@type": "Person",
        "@id": personId(p.name),
        name: p.name,
        ...(p.eyebrow ? { jobTitle: p.eyebrow } : {}),
        description: p.paragraphs[0],
        ...(p.image ? { image: absolute(p.image) } : {}),
        worksFor: { "@id": ORG_ID },
        url: p.id ? `${url}#${p.id}` : url,
      });
    }
  }

  // FAQs as machine-readable question/answer pairs.
  const faqs = page.blocks.filter((b): b is BlockOf<"faq"> => b.type === "faq").flatMap((b) => b.items);
  if (faqs.length) {
    nodes.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqs.map((qa) => ({
        "@type": "Question",
        name: qa.question,
        acceptedAnswer: { "@type": "Answer", text: qa.answer },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": nodes };
}

/** Serialize for a <script type="application/ld+json">; "<" is escaped so content can't close the tag. */
export function serializeJsonLd(data: Json): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
