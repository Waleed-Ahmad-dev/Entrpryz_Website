import { PortfolioTier } from "@/types";

export const PORTFOLIO_HEADER = {
  headline:
    "25 Years of Delivery. 39+ Organizations. Three Continents' Worth of Lessons.",
  subheadline:
    "Every recommendation Entrpryz makes is grounded in work we've actually delivered — not theory. Below is the real track record behind the company: engagements delivered directly as Entrpryz, and the enterprise programs our founder built and led before Entrpryz existed.",
};

export const PORTFOLIO_TIERS: PortfolioTier[] = [
  {
    id: "tier-1",
    title: "TIER 1 — ENTRPRYZ CLIENT ENGAGEMENTS",
    subtitle:
      "Delivered directly by Entrpryz / by Javed as an independent consultant, now under the Entrpryz brand.",
    featured: [
      {
        client: "Digital Arts (Pvt) Ltd.",
        location: "Multan",
        website: "digitalarts.com.pk",
        status: "Current Engagement — Commencing December 2026",
        description:
          "End-to-end ERP and CRM implementation as part of a full digital transformation program — Entrpryz's flagship engagement under the company's own name.",
        image: "/images/portfolio-erp-utility.jpg",
      },
      {
        client: "Yuasa Investments",
        location: "Uganda",
        description:
          "Designed and built Yuasa's first-ever online car inventory management and sales operations system — bringing a fully manual dealership operation into a real-time, digital sales and inventory platform.",
        image: "/images/portfolio-yuasa.jpg",
      },
      {
        client: "Telecom Foundation",
        location: "Islamabad",
        website: "telecomfoundation.org.pk",
        description:
          "Engaged as Program Manager for ERP implementation and technology governance, bringing structured program discipline to a nationally recognized organization's ERP rollout.",
        image: "/images/services-digital-transformation.jpg",
      },
    ],
    additional: [
      {
        client: "Madni Ghee Mills (Pvt) Ltd., Faisalabad",
        scope: "Complete MIS including manufacturing management",
        industry: "Manufacturing / Process",
        platform: "Custom MIS",
      },
      {
        client: "Al-Farid Fabrics (Pvt) Ltd., Faisalabad",
        scope: "Complete trading management software",
        industry: "Textile / Trading",
        platform: "Custom Software",
      },
      {
        client: "United Dairy Farms (Pvt) Ltd. (PakPure Desi Ghee)",
        scope: "Complete MIS including production management",
        industry: "FMCG / Agriculture",
        platform: "Custom MIS",
      },
      {
        client: "GMSA Pakistan (gmsa.com.pk)",
        scope: "Complete trading management software",
        industry: "Trading & Distribution",
        platform: "Custom Software",
      },
      {
        client: "Al-Aziz Packages and Printing Ltd., Faisalabad (alazizgroup.com)",
        scope:
          "Accounting, Inventory, Supply Chain & Production management software",
        industry: "Packaging & Manufacturing",
        platform: "Custom ERP / MIS",
      },
      {
        client: "Multiple small businesses, Faisalabad",
        scope:
          "Standard hire-purchase/leasing management software for installment-based sales",
        industry: "Retail / Finance",
        platform: "Custom Leasing System",
      },
      {
        client: "Gaba Traders",
        scope:
          "Trading management software including materials import, inventory & sales",
        industry: "Import / Trading",
        platform: "Custom Trading MIS",
      },
      {
        client: "AKY Trading, Yarn Market Faisalabad",
        scope: "Specialized yarn-market operations software",
        industry: "Textiles / Commodity",
        platform: "Custom Operations System",
      },
    ],
  },
  {
    id: "tier-2",
    title: "TIER 2 — ENTERPRISE TRACK RECORD: KEYSTONE CONSULTING (2018–2022)",
    subtitle:
      "Delivered by Javed as Vice President, Mid-Market Cloud Services, Keystone Consulting (Pvt.) Ltd. — prior to founding Entrpryz.",
    featured: [
      {
        client: "Continental Plastic Industries (Pvt) Ltd.",
        location: "Lahore",
        website: "continentalplastic.com",
        description:
          "Full-scope NetSuite deployment covering Financials, Inventory, Sales, Purchase, and Advanced Manufacturing — one of the most complete implementations in the portfolio.",
        image: "/images/portfolio-netsuite-mfg.jpg",
      },
      {
        client: "Askari Life Insurance Co. Ltd.",
        location: "Karachi",
        website: "askarilife.com",
        description:
          "NetSuite Financials integrated directly with a bespoke .NET-based insurance operations system, replacing manual reconciliation with real-time financial data flow between platforms.",
        image: "/images/services-software-dev.jpg",
      },
      {
        client: "NETSOL Technologies Pakistan",
        location: "Lahore",
        website: "netsolpk.com",
        description:
          "NetSuite OneWorld with Advanced Financials, Advanced Revenue Management, and multiple external system integrations — delivered for one of Pakistan's most established technology companies.",
        image: "/images/services-it-infrastructure.jpg",
      },
    ],
    additional: [
      {
        client: "Vertex Chemicals, Faisalabad",
        scope: "NetSuite CRM, Financials base",
        industry: "Chemicals",
        platform: "Oracle NetSuite",
      },
      {
        client: "Empire Properties, Karachi",
        scope: "NetSuite Financials base",
        industry: "Real Estate",
        platform: "Oracle NetSuite",
      },
      {
        client: "Hoora Pharma (Pvt) Ltd., Karachi (hoorapharma.com)",
        scope: "NetSuite for medical equipment import/trading",
        industry: "Pharmaceutical / Medical",
        platform: "Oracle NetSuite",
      },
      {
        client: "Darson Industries (Pvt) Ltd. (darson-industries.com)",
        scope:
          "NetSuite Advanced Manufacturing (WO/Assembly + WIP & Routing)",
        industry: "Manufacturing",
        platform: "Oracle NetSuite",
      },
      {
        client: "Dar ul Sakoon (non-profit)",
        scope: "NetSuite implementation",
        industry: "Non-Profit",
        platform: "Oracle NetSuite",
      },
      {
        client: "OLX Pakistan, Lahore",
        scope: "NetSuite Financials",
        industry: "E-Commerce / Tech",
        platform: "Oracle NetSuite",
      },
      {
        client: "ELMED Instruments (Pvt) Ltd., Sialkot (elmedinst.com)",
        scope: "NetSuite Financials base, manufacturing",
        industry: "Surgical / Manufacturing",
        platform: "Oracle NetSuite",
      },
      {
        client: "Nizam Sons (Pvt) Ltd., Sialkot (nizamsons.com)",
        scope: "NetSuite — all modules, Advanced Manufacturing",
        industry: "Apparel & Manufacturing",
        platform: "Oracle NetSuite",
      },
      {
        client: "Global Industry Suppliers (Pvt) Ltd., Islamabad",
        scope: "NetSuite Financials base",
        industry: "Industrial Supply",
        platform: "Oracle NetSuite",
      },
    ],
  },
  {
    id: "tier-3",
    title:
      "TIER 3 — ENTERPRISE TRACK RECORD: CROWE HUSSAIN CHAUDHURY & CO. (2014–2018)",
    subtitle:
      "Delivered by Javed as Senior Manager (ERP), Crowe Hussain Chaudhury & Co. — prior to founding Entrpryz.",
    featured: [
      {
        client: "Focus & Rulz Pharmaceuticals (Pvt) Ltd.",
        location: "Islamabad",
        website: "focusandrulz.com",
        description:
          "SAP Business One implementation — set the fastest recorded SAP B1 implementation time in Pakistan.",
        image: "/images/services-digital-transformation.jpg",
      },
      {
        client: "Murree Brewery Company Limited",
        location: "Islamabad",
        description:
          "Led the Post-Implementation Review across the company's Microsoft/Oracle ERP environment, diagnosing performance and governance gaps and delivering an executive remediation roadmap.",
        image: "/images/product-journey.jpg",
      },
      {
        client: "Crestex — The Crescent Textile Mills Ltd.",
        location: "Faisalabad",
        description:
          "Led a full Post-Implementation Review of the client's Oracle EBS environment, resolving critical workflow misalignments for one of Pakistan's largest textile groups.",
        image: "/images/portfolio-netsuite-mfg.jpg",
      },
    ],
    additional: [
      {
        client: "Ops Food & Beverages, Islamabad",
        scope: "Post-Implementation Review, Microsoft/Oracle platform",
        industry: "Food & Beverage",
        platform: "Microsoft / Oracle",
      },
      {
        client: "Khatoon Soap Ind., Gujranwala",
        scope: "SAP B1 implementation with custom HR/Payroll add-on",
        industry: "FMCG",
        platform: "SAP Business One",
      },
      {
        client: "Sublime Wireless, Lahore",
        scope: "SAP B1 implementation",
        industry: "Telecom / Tech",
        platform: "SAP Business One",
      },
      {
        client: "Stallion Pharmaceutical, Lahore",
        scope: "SAP B1 implementation",
        industry: "Pharmaceutical",
        platform: "SAP Business One",
      },
      {
        client: "Wimmits Pharmaceutical, Lahore",
        scope: "SAP B1 implementation",
        industry: "Pharmaceutical",
        platform: "SAP Business One",
      },
      {
        client: "Selmore Pharmaceuticals Limited (selmorepharma.com)",
        scope: "SAP B1 implementation",
        industry: "Pharmaceutical",
        platform: "SAP Business One",
      },
      {
        client: "Limelight (Maypole Pvt. Ltd.) (limelight.pk)",
        scope: "SAP B1 implementation",
        industry: "Retail / Apparel",
        platform: "SAP Business One",
      },
      {
        client: "MauSummery, Lahore (mausummery.com)",
        scope: "SAP B1 implementation",
        industry: "Retail / Apparel",
        platform: "SAP Business One",
      },
      {
        client: "Shibli Electronics Limited, Islamabad (shibli.com)",
        scope: "SAP B1 implementation",
        industry: "Electronics",
        platform: "SAP Business One",
      },
      {
        client: "Al Hafiz Crystoplast (Pvt) Ltd., Islamabad (ahcp-pet.com)",
        scope: "SAP B1 implementation",
        industry: "Packaging & Plastics",
        platform: "SAP Business One",
      },
      {
        client: "Fuelers (Pvt) Ltd., Lahore",
        scope: "SAP B1 implementation",
        industry: "Energy / Distribution",
        platform: "SAP Business One",
      },
      {
        client: "Mohsin Match Factory Pvt Ltd., Peshawar (azizgrp.com)",
        scope: "SAP B1 implementation",
        industry: "Manufacturing",
        platform: "SAP Business One",
      },
      {
        client: "Toyota Garden Motors, Lahore",
        scope: "SAP B1 implementation",
        industry: "Automotive",
        platform: "SAP Business One",
      },
    ],
  },
];

export const PORTFOLIO_ACHIEVEMENTS = [
  "Pioneered Oracle NetSuite in Pakistan — recruited as Keystone's founding NetSuite hire, built and trained the country's first NetSuite delivery practice",
  "15+ NetSuite deployments, each supporting up to 100+ users, ~$225K–$900K in aggregate first-year subscription value",
  "50+ SAP Business One implementations, including Pakistan's fastest recorded SAP B1 go-live",
  "~PKR 600 million combined program value across national utility ERP and billing modernization work",
  "First-ever online inventory/sales platform delivered for an international client (Yuasa Investments, Uganda)",
];

export const PORTFOLIO_CTA = {
  headline: "Want to See What This Looks Like for Your Business?",
  buttonText: "Talk to Us →",
  buttonHref: "/contact",
};
