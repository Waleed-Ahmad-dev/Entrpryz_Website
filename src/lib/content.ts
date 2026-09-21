import {
  ServiceItem,
  ProcessStep,
  ValueProp,
  TimelineExperience,
  CertificationGroup,
} from "@/types";

export const SITE_TAGLINE = "Technology. Simplified.";

export const HERO_CONTENT = {
  headline: "Technology. Simplified.",
  subheadline:
    "25+ Years of Technology & Digital Transformation Experience — Now Focused on Your Business.",
  body: "Entrpryz helps businesses modernize their technology, improve operations, and build practical digital solutions — with experienced leadership behind every engagement.",
  ctaPrimary: "Talk to Us",
  ctaSecondary: "Explore Our Services",
};

export const BEHIND_ENTRPRYZ = {
  headline: "25+ Years of Experience Behind Entrpryz",
  subheadline:
    "Led by Javed Ahmad Qureshi — CIO, Digital Transformation Leader & ERP Strategist",
  stats: [
    { value: "25+ Years", label: "Total Experience" },
    { value: "65+", label: "ERP Programs Led" },
    { value: "Up to 40", label: "Team Size Managed" },
    { value: "150+", label: "IT Users Supported" },
    { value: "PK / UAE", label: "Multi-Country Ops" },
  ],
  cta: "Connect With Javed →",
};

export const EXPERIENCE_BEHIND = {
  headline: "Built on Experience. Focused on What Works.",
  p1: "Technology is easy to sell. Knowing what technology a business actually needs is much harder.",
  p2: "Entrpryz brings together technology expertise, business understanding, and more than 25 years of professional experience across ERP, digital transformation, software, IT leadership, and business systems.",
  p3: "At the center of this experience is Javed Ahmad Qureshi, a global IT executive who has built and delivered 65+ ERP programs across retail, manufacturing, pharmaceuticals, financial services, insurance, utilities, and non-profit sectors — including mission-critical billing modernization for national electricity utilities.",
  stats: [
    { value: "25+ Years", label: "Professional Experience" },
    { value: "18+ Years", label: "Digital Transformation & ERP" },
    { value: "14+ Years", label: "IT Leadership" },
    { value: "10+ Years", label: "Project & Program Management" },
  ],
  footer: "Business first. Technology second. Results always.",
};

export const ABOUT_ENTRPRYZ = {
  headline: "A Technology Company With Enterprise Thinking.",
  p1: "Entrpryz was created with a simple objective: make good technology more practical and accessible for businesses.",
  p2: "We help organizations understand their technology challenges, select the right solutions, implement them properly, and continuously improve their digital capabilities.",
  coreAreasIntro: "Our work spans three core areas:",
  coreAreas: [
    {
      title: "Digital Transformation",
      description:
        "ERP, CRM, automation, integration, business applications, and technology modernization.",
    },
    {
      title: "Software Development",
      description:
        "Custom applications, SaaS, mobile and web solutions, APIs, and AI-enabled business applications.",
    },
    {
      title: "Technology & IT Services",
      description:
        "Infrastructure, cloud, cybersecurity, systems, and ongoing technology support.",
    },
  ],
};

export const SERVICES: ServiceItem[] = [
  {
    id: "digital-transformation",
    title: "Digital Transformation",
    subtitle: "Transform the way your business operates.",
    items: [
      "ERP Implementation & Optimization",
      "CRM & Customer Experience",
      "Business Process Automation",
      "System Integration",
      "Cloud Solutions",
      "Business Intelligence & Reporting",
      "Digital Transformation Strategy",
      "Technology Assessment & Roadmaps",
    ],
    ctaText: "Discuss Your Transformation →",
    ctaHref: "/contact",
    image: "/images/services-digital-transformation.jpg",
  },
  {
    id: "software-development",
    title: "Software Development",
    subtitle: "Turn business requirements into working technology.",
    items: [
      "Custom Business Applications",
      "Web Applications",
      "Mobile Applications",
      "SaaS Solutions",
      "Business Portals",
      "APIs & Integrations",
      "Workflow Automation",
      "AI-Enabled Applications",
    ],
    ctaText: "Build Your Solution →",
    ctaHref: "/contact",
    image: "/images/services-software-dev.jpg",
  },
  {
    id: "technology-it-services",
    title: "Technology & IT Services",
    subtitle: "Build a reliable technology foundation.",
    items: [
      "IT Infrastructure",
      "Cloud & Server Solutions",
      "Network Solutions",
      "Cybersecurity",
      "Backup & Business Continuity",
      "Technology Reviews",
      "Systems Support & Maintenance",
    ],
    ctaText: "Talk to Us →",
    ctaHref: "/contact",
    image: "/images/services-it-infrastructure.jpg",
  },
];

export const HOW_WE_WORK = {
  headline: "We Don't Start With a Product. We Start With Your Problem.",
  steps: [
    {
      number: "01",
      title: "Understand",
      description:
        "We listen to the business before recommending technology.",
    },
    {
      number: "02",
      title: "Analyze",
      description:
        "We examine processes, systems, challenges, and opportunities.",
    },
    {
      number: "03",
      title: "Design",
      description:
        "We develop a practical solution aligned with your business and budget.",
    },
    {
      number: "04",
      title: "Implement",
      description: "We configure, develop, integrate, and deploy.",
    },
    {
      number: "05",
      title: "Improve",
      description:
        "We stay focused on adoption, performance, and continuous improvement.",
    },
  ] as ProcessStep[],
};

export const WHY_ENTRPRYZ = {
  headline: "Senior Experience Without Enterprise Complexity.",
  reasons: [
    {
      title: "Experience",
      description:
        "Decades of exposure to ERP, IT leadership, digital transformation, software, and business processes.",
    },
    {
      title: "Business Understanding",
      description:
        "We understand that technology is an enabler, not the objective.",
    },
    {
      title: "Practical Solutions",
      description:
        "We focus on solutions that people can actually use and businesses can actually afford.",
    },
    {
      title: "Technology Agnostic",
      description:
        "We recommend technology based on your requirements, not on what we happen to sell.",
    },
    {
      title: "Long-Term Partnership",
      description:
        "Our objective is to build lasting relationships rather than simply complete projects.",
    },
  ] as ValueProp[],
};

export const FOUNDER_CONTENT = {
  name: "Javed Ahmad Qureshi",
  role: "Founder | Chief Information Officer | Digital Transformation & ERP Strategy Leader",
  p1: "Global IT executive with 25+ years of experience across digital transformation, ERP-driven optimization, and enterprise innovation — including 18+ years in ERP/digital transformation and 14+ years in IT leadership (CIO, VP, Senior Manager).",
  p2: "Currently CIO at a leading real estate development and hospitality group, leading a cross-border Enterprise Technology function across Pakistan and UAE. Over his career, he has built and delivered 65+ ERP programs spanning retail, manufacturing, pharmaceuticals, financial services, insurance, utilities, and non-profit sectors — including mission-critical billing modernization for national electricity utilities.",
  p3: "Known for aligning technology investment with commercial outcomes — governance, cybersecurity, and cloud strategy that hold up to audit and board scrutiny, not technology for its own sake.",
  competencies: [
    "Digital Transformation Leadership",
    "Enterprise IT Strategy & Governance",
    "ERP, CRM & HCM Integration",
    "AI-Driven Business Optimization & GenAI Strategy",
    "Cybersecurity & Risk Management",
    "Cloud Strategy & Shared Services Optimization",
    "P&L-Aligned IT Budgeting",
    "Post-Implementation Reviews & ERP Turnarounds",
    "Cross-Border & Multicultural Team Leadership",
    "Project & Program Leadership (Agile & Hybrid)",
  ],
  philosophy:
    "technology should make business simpler, faster, and better — not more complicated.",
  cta: "Connect With Javed →",
};

export const CAREER_TIMELINE: TimelineExperience[] = [
  {
    company: "Premier Choice International",
    location: "Pakistan/UAE",
    role: "Chief Information Officer",
    period: "2024–Present",
    overview:
      "Leading a cross-border Enterprise Technology department of 8–10 staff, owning an ~$80,000+ annual IT budget and supporting 150+ IT users across ~200 employees in Pakistan and Dubai.",
    highlights: [
      "Driving enterprise-wide digital transformation across ERP, CRM, and HCM platforms",
      "Launched AI-driven customer engagement and integrated CRM for personalized, omnichannel experience across a real-estate development and hospitality portfolio",
      "Spearheading cloud-first and AI-enabled initiatives across Finance, Engineering, Planning, Procurement, HR, and Customer Engagement",
      "Established IT governance frameworks and scalable shared services unifying operations across two countries; strengthened cybersecurity resilience and compliance posture",
      "Stood up a formal Enterprise Technology Office (ETO) and authored a multi-year Enterprise Technology Vision spanning ERP expansion, customer experience platforms, data & analytics, AI adoption, integration, and cybersecurity",
      "Delivered NetSuite Procure-to-Pay enhancements (BOQ-driven budget control, contract & procurement management, vendor payment controls) and is leading a 7-workstream Order-to-Cash redesign",
      "Directed CRM (Bitrix24) rollout across Pakistan and UAE and led end-to-end HCM (FlowHCM) implementation",
    ],
  },
  {
    company: "Independent ERP & Digital Transformation Consultant",
    location: "Islamabad",
    role: "Independent Consultant",
    period: "2022–2024",
    overview:
      "Led ERP implementation programs and post-implementation reviews (PIR) for clients across manufacturing and public-sector environments.",
    highlights: [
      "ERP Governance & PIR (Microsoft & Oracle Ecosystems), Feb–Mar 2024 — Audited custom-built ERP applications, diagnosed performance bottlenecks and data-integrity gaps, delivered an executive remediation roadmap to maximize system ROI and align with corporate governance standards.",
      "Oracle EBS Turnaround & PIR, Oct–Nov 2023 (Textile Manufacturing) — Identified critical workflow misalignments within Oracle EBS, engineered gap-closure strategies, and established scalable IT governance protocols to stabilize operations.",
    ],
  },
  {
    company: "Keystone Consulting (Pvt.) Limited",
    location: "Pakistan",
    role: "Vice President, Mid-Market Cloud Services",
    period: "2018–2022",
    overview:
      "Recruited as Keystone's founding NetSuite hire and Oracle Partner Enablement-trained, establishing Pakistan's first Oracle NetSuite practice; hired and trained a 10–15 person delivery team that went on to complete 15+ full-cycle implementations supporting up to 100+ users per deployment, with an estimated $225K–$900K in aggregate first-year subscription value across the portfolio.",
    highlights: [
      "Pharmaceutical Distribution (2020–2022) — Directed a supply chain and financial transformation on Oracle NetSuite, integrating custom Payroll and Asset Maintenance SuiteApps.",
      "Utility Sector — Electricity Distribution (2021–2022) — Steered core financials and procurement plus a bespoke e-Tendering solution digitizing public procurement and audit compliance.",
      "Life Insurance (2018–2022) — Architected a direct integration between NetSuite Financials and a bespoke .NET-based legacy insurance system, replacing manual reconciliation with real-time financial reconciliation.",
      "Industrial Manufacturing (2018–2022) — Migrated a client off in-house custom software onto NetSuite (>$50K annual subscription) despite change-management resistance; deployed scanner-based shop-floor terminals for real-time production tracking plus Work Order/Assembly, WIP & Routing, and custom SuiteApps for Core HR and Asset Maintenance.",
      "Industrial Distribution — Supply Chain (2019–2022) — Delivered high-volume procurement and advanced inventory management with real-time order-to-cash visibility.",
      "Surgical Equipment Manufacturing (2021–2022) — Aligned financial and supply chain configuration to regulatory quality standards.",
      "Non-Profit Sector (2020–2021) — Configured Grants and Donations Management with fund-accounting compliance and stakeholder reporting.",
      "Plastic Packaging — NetSuite OneWorld (2019–2020) & Chemical Manufacturing (2019) — Delivered multi-entity financials, advanced inventory, and CRM consolidation.",
      "Directed the technical development team architecting and launching custom SuiteApps for NetSuite Cloud ERP, overseeing technical governance and security standards for native cloud integrations.",
    ],
  },
  {
    company: "Crowe Hussain Chaudhury & Co.",
    location: "Pakistan",
    role: "Senior Manager (ERP)",
    period: "2014–2018",
    overview:
      "Directed SAP Business One implementations and custom add-on development for 50+ enterprises spanning multiple industries and cities; led mission-critical ERP and billing transformation programs for national electricity distribution companies with a combined program value of approximately PKR 600 million.",
    highlights: [
      "IESCO — ERP Program (2015–2018) — Built the program from inception as the strategic conduit between government stakeholders and technical teams: authored the RFP, led vendor evaluation and selection, onboarded the implementation partner, and managed the SAP S/4HANA delivery for regulatory compliance.",
      "IESCO — Data Center Build-Out — Separately scoped and delivered an in-house data center program, including RFP authorship, vendor onboarding, and execution/deliverable validation.",
      "PESCO — USAID-Funded ERP & Billing Modernization (2014–2015) — Engaged as Project Manager on behalf of the donor-funded program, managing the implementation partner and ensuring delivery quality across large-scale data migration and financial-transparency objectives.",
      "SAP Business One Add-On Architecture (2014–2018) — Governed end-to-end custom add-on development, translating client requirements into scalable technical architectures.",
    ],
  },
  {
    company: "Shaigan Pharma & Al-Aziz Packages",
    location: "Pakistan",
    role: "ERP/IT Leadership Roles",
    period: "2006–2014",
    overview:
      "Spearheaded core manufacturing and pharmaceutical ERP transformations.",
    highlights: [
      "Al-Aziz Packages (Packaging Manufacturing) — Designed and built a custom CPQ (configure-price-quote) tool for complex corrugated and rotogravure packaging pricing, replacing manual estimation with a systematic process; later migrated the business onto SAP Business One.",
      "Shaigan Pharma — Migrated SAP Business One from v2007 to v8.2 fully in-house without an external implementation partner; directed development of a Distribution Management System capturing secondary sales data, and a Performance Management System tracking doctors, hospitals, and institutions as sales/marketing targets.",
    ],
  },
];

export const NOTABLE_ACHIEVEMENTS = [
  "Pioneered Oracle NetSuite in Pakistan — recruited as Keystone's founding NetSuite hire, Oracle Partner Enablement-trained, then built and trained the 10–15 person delivery team behind Pakistan's first Oracle NetSuite practice.",
  "Oracle NetSuite — led 15+ end-to-end deployments across retail, manufacturing, pharma, financial services, insurance, and non-profit sectors, each supporting up to 100+ users, representing an estimated $225K–$900K in aggregate first-year subscription value.",
  "SAP Business One — designed and delivered tailored ERP solutions for 50+ enterprises, improving scalability, reporting accuracy, and process automation.",
  "Utility Sector Program Ownership — built the IESCO ERP program from inception through delivery plus a separate in-house data center build-out; managed the implementation partner on the USAID-funded PESCO program — combined program value ~PKR 600 million.",
  "Self-Delivered ERP Migration — migrated Shaigan Pharma's SAP Business One from v2007 to v8.2 fully in-house, avoiding external implementation-partner cost.",
  "Post-Implementation Reviews — recurring engagements recovering ROI and correcting governance gaps on stalled or under-performing ERP programs.",
];

export const CERTIFICATIONS: CertificationGroup[] = [
  {
    title: "Generative AI & Digital Strategy",
    items:
      "LinkedIn: Integrating GenAI into Business Strategy, GenAI for Business Leaders (2025); Google Cloud Skills Boost: Introduction to Generative AI (2025); PMI: GenAI Overview for Project Managers (2024)",
  },
  {
    title: "ERP & Cloud Platforms",
    items:
      "Microsoft: Dynamics 365 Solution Architect & Power Platform (2024); Odoo Enterprise & Studio (2023); NetSuite Partner Enablement Program (2018); SAP Business One (2009/2013)",
  },
  {
    title: "Agile & Project Leadership",
    items:
      "IBM: Project Management, Agile Explorer (2025); PMP Training, PMI (2015)",
  },
  {
    title: "Cybersecurity & Governance",
    items:
      "ISC² Candidate (2024–2025); CISA Training (2012); ISACA Training (2013)",
  },
  {
    title: "Data & Analytics",
    items: "CBAP Training (2014); Tableau, Simplilearn (2024)",
  },
  {
    title: "Leadership",
    items:
      "Total Quality Management & Leadership, NPO, Government of Pakistan (2010)",
  },
  {
    title: "Education",
    items:
      "MBA (MIS), University of Management & Technology, Lahore, 1999 | B.Com, Hailey College of Commerce, University of the Punjab, Lahore, 1996",
  },
];

export const PRODUCT_JOURNEY = {
  headline: "From Solving Problems to Building Products.",
  p1: "Our client work exposes us to real business problems every day. Some problems deserve a customized solution. Others can be solved better through a simple, affordable software product.",
  p2: "Entrpryz is building its own technology products around that idea:",
  motto: "Solve real problems. Build simple solutions. Make them accessible.",
  status: "Our products are currently under development.",
  cta: "Explore Our Products →",
};

export const TEAM = [
  {
    name: "Javed Ahmad Qureshi",
    role: "Founder | Chief Information Officer, Digital Transformation & ERP Strategy Leader",
  },
  {
    name: "Waleed Ahmad",
    role: "Co-Founder | Product Engineering & Technical Delivery",
  },
];

export const CONTACT_CONTENT = {
  headline: "Let's Build Something That Works.",
  body: "Whether you need to modernize your ERP, improve your business processes, integrate systems, automate operations, build a custom application — or simply understand where technology can create value for your business — start with a conversation.",
  tagline: "Entrpryz — Technology. Simplified.",
  cta: "Talk to Us →",
  contacts: {
    general: "connect@entrpryz.com",
    javed: "javed@entrpryz.com",
    waleed: "waleed@entrpryz.com",
  },
};
