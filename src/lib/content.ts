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
    "25+ years of hands-on ERP, software and IT experience — put to work on your business.",
  body: "We help businesses fix, build and modernize the systems they run on — no jargon, no overhead, no handoffs.",
  ctaPrimary: "Talk to Us",
  ctaSecondary: "Explore Our Services",
};

export const BEHIND_ENTRPRYZ = {
  headline: "25+ Years of Real-World Technology Experience",
  subheadline:
    "Led by Javed Ahmad Qureshi — 25+ years building and fixing the systems businesses run on.",
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
  headline: "Built on Field Experience. Focused on Commercial Value.",
  p1: "Technology is easy to sell. Knowing what systems a business actually needs is much harder.",
  p2: "Entrpryz combines deep technical skill, business operational knowledge, and 25+ years of hands-on leadership across ERP implementation, custom software engineering, and enterprise IT governance.",
  p3: "At the core of Entrpryz is Javed Ahmad Qureshi, an executive who has led 65+ ERP programs across manufacturing, pharmaceuticals, retail, insurance, utilities, and non-profits — including national power grid billing modernization.",
  stats: [
    { value: "25+ Years", label: "Professional Experience" },
    { value: "18+ Years", label: "ERP & Systems Strategy" },
    { value: "14+ Years", label: "IT Leadership (CIO/VP)" },
    { value: "10+ Years", label: "Program Governance" },
  ],
  footer: "Business requirements first. Technology second. Measureable execution always.",
};

export const ABOUT_ENTRPRYZ = {
  headline: "Technology That Works the Way Your Business Actually Runs.",
  p1: "Entrpryz was founded on one idea: technology should make business simpler, not more complicated. We help businesses fix, build and modernize the systems they run on — without the jargon or the overhead.",
  p2: "We start from how your business actually works — then select the right platforms, roll them out properly, and make sure your team actually uses them.",
  coreAreasIntro: "Our practice covers three core disciplines:",
  coreAreas: [
    {
      title: "ERP & Systems Optimization",
      description:
        "NetSuite, SAP Business One, custom ERP audits, CRM deployment, process automation, and system integrations.",
    },
    {
      title: "Software Engineering",
      description:
        "Custom enterprise web apps, SaaS platforms, portals, APIs, workflow automation engines, and data pipelines.",
    },
    {
      title: "Technology & IT Advisory",
      description:
        "Infrastructure assessment, cloud migrations, cybersecurity governance, IT audit remediation, and system maintenance.",
    },
  ],
};

export const SERVICES: ServiceItem[] = [
  {
    id: "digital-transformation",
    title: "Digital Transformation",
    subtitle:
      "ERP & Systems Optimization, CRM & Sales Operations, Process Automation, BI & Reporting",
    items: [
      "ERP Implementation & Optimization",
      "CRM & Sales Operations Platforms",
      "Business Process Automation",
      "System Integration & Middleware",
      "Cloud ERP Migrations (NetSuite / SAP)",
      "Business Intelligence & Reporting",
      "Systems Audit & Technology Strategy",
      "Post-Implementation Reviews (PIR)",
    ],
    ctaText: "Discuss Your Systems Strategy →",
    ctaHref: "/contact",
    image: "/images/services-digital-transformation.jpg",
  },
  {
    id: "software-development",
    title: "Software Development",
    subtitle:
      "Custom Enterprise Applications, Web & Cloud Apps, SaaS Products, APIs & Workflow Tools",
    items: [
      "Custom Enterprise Applications",
      "Web & Cloud Applications",
      "Mobile Operations Apps",
      "SaaS Product Engineering",
      "Customer & Supplier Portals",
      "APIs & System Connectors",
      "Workflow Automation Tools",
      "AI-Assisted Operations Apps",
    ],
    ctaText: "Build Your Application →",
    ctaHref: "/contact",
    image: "/images/services-software-dev.jpg",
  },
  {
    id: "technology-it-services",
    title: "Technology & IT Services",
    subtitle:
      "Infrastructure, Cloud & Security, Data & Network, Systems Maintenance & Support",
    items: [
      "Enterprise IT Infrastructure",
      "Cloud & Server Governance",
      "Network Architecture & Security",
      "Cybersecurity Audit & Risk Control",
      "Disaster Recovery & Continuity",
      "Vendor & Budget Evaluations",
      "Ongoing Systems Maintenance",
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
        "We start with your business, your goals, and where things are actually breaking down — not a product pitch.",
    },
    {
      number: "02",
      title: "Analyze",
      description:
        "We look at your data, your systems, and your day-to-day workflow to find where the real opportunity is.",
    },
    {
      number: "03",
      title: "Design",
      description:
        "We design a solution that fits your business and your budget — not the most complicated option available.",
    },
    {
      number: "04",
      title: "Implement",
      description:
        "We build, integrate, test and roll it out — and make sure your team actually adopts it.",
    },
    {
      number: "05",
      title: "Evolve",
      description:
        "We keep improving the system as your business grows, instead of walking away at go-live.",
    },
  ] as ProcessStep[],
};

export const WHY_ENTRPRYZ = {
  headline: "Why Businesses Work With Entrpryz.",
  reasons: [
    {
      title: "Decades of Field Experience",
      description:
        "25+ years directly running enterprise ERP rollouts, IT departments, and complex technical projects.",
    },
    {
      title: "Commercial & Business First",
      description:
        "We view technology as a tool for financial accuracy, speed, and margin improvement — not as an end in itself.",
    },
    {
      title: "Practical & Usable Solutions",
      description:
        "We deploy software that operational teams actually adopt and management can reliably trust.",
    },
    {
      title: "Technology Agnostic",
      description:
        "We recommend software solutions based purely on your operating requirements, not vendor sales kickbacks.",
    },
    {
      title: "Direct, No-Nonsense Delivery",
      description:
        "You deal directly with the people doing the work, from first conversation to go-live.",
    },
  ] as ValueProp[],
};

export const FOUNDER_CONTENT = {
  name: "Javed Ahmad Qureshi",
  role: "Founder, Entrpryz",
  p1: "25+ years of hands-on experience across enterprise systems, ERP delivery, and IT leadership — including 18+ years leading ERP programs and 14+ years in senior technology roles (CIO, Vice President, Senior Manager).",
  p2: "Currently serving as CIO for a real estate development and hospitality group across Pakistan and the UAE. Over his career, he has directed 65+ ERP implementations across manufacturing, pharmaceuticals, retail, insurance, utilities, and non-profits — including major power utility billing modernizations.",
  p3: "Known for keeping IT spending tightly aligned with business and audit needs — building the cloud, security controls, and ERP workflows that hold up under real management and external audit scrutiny.",
  competencies: [
    "Enterprise IT Strategy & Governance",
    "Oracle NetSuite & SAP B1 Architecture",
    "ERP, CRM & HCM Systems Integration",
    "AI-Assisted Operations & Data Strategy",
    "Cybersecurity & Regulatory Audit Risk",
    "Cloud Strategy & Shared Services",
    "P&L-Aligned IT Budgeting & Cost Control",
    "Post-Implementation Reviews (PIR) & ERP Turnarounds",
    "Cross-Border Technology Team Management",
    "Program Leadership & RFP Ownership",
  ],
  philosophy:
    "technology should make business simpler, faster, and better — not more complicated.",
  cta: "Connect With Javed →",
};

export const CAREER_TIMELINE: TimelineExperience[] = [
  {
    company: "Premier Choice International",
    location: "Pakistan / UAE",
    role: "Chief Information Officer",
    period: "2024–Present",
    overview:
      "Directing a cross-border Enterprise Technology department of 8–10 engineers and specialists, owning an ~$80,000+ annual IT operational budget and supporting 150+ IT users across ~200 employees in Pakistan and Dubai.",
    highlights: [
      "Architecting enterprise-wide technology modernization across ERP, CRM, and HCM systems",
      "Deployed integrated CRM and automated customer engagement channels across real-estate and hospitality portfolios",
      "Executing cloud-first and analytics initiatives across Finance, Engineering, Procurement, and Operations",
      "Established multi-country IT governance frameworks and unified shared services; upgraded cybersecurity compliance posture",
      "Created the Enterprise Technology Office (ETO) and multi-year technology roadmap covering ERP expansion and data analytics",
      "Delivered NetSuite Procure-to-Pay budget controls, contract management, and vendor payment verification workflows",
      "Directed regional Bitrix24 CRM deployment and completed end-to-end FlowHCM implementation",
    ],
  },
  {
    company: "Independent ERP & Technology Advisory",
    location: "Islamabad",
    role: "Independent Principal Consultant",
    period: "2022–2024",
    overview:
      "Led ERP turnaround projects, systems audits, and post-implementation reviews for mid-market industrial and public sector clients.",
    highlights: [
      "ERP Governance & PIR (Microsoft & Oracle Platforms), 2024 — Audited custom ERP software, eliminated database integrity gaps, and delivered an executive remediation roadmap to recover ROI.",
      "Oracle EBS Turnaround & Audit, 2023 (Textile Manufacturing) — Resolved operational bottlenecks in Oracle EBS, engineered workflow corrections, and stabilized production tracking.",
    ],
  },
  {
    company: "Keystone Consulting (Pvt.) Limited",
    location: "Pakistan",
    role: "Vice President, Mid-Market Cloud Services",
    period: "2018–2022",
    overview:
      "Recruited as Keystone's founding NetSuite lead, building Pakistan's first Oracle NetSuite practice from scratch. Hired and trained a 10–15 person delivery team that executed 15+ full-cycle implementations for clients of varying scale.",
    highlights: [
      "Pharmaceutical Distribution — Directed Oracle NetSuite supply chain and financial rollout with custom SuiteApps.",
      "Electricity Utility Sector — Steered NetSuite financials, procurement, and an e-Tendering platform for audit compliance.",
      "Life Insurance — Built real-time integration between NetSuite Financials and custom .NET policy engine, eliminating manual data entry.",
      "Industrial Manufacturing — Migrated legacy software to NetSuite with shop-floor barcode tracking and assembly WIP routing.",
      "Industrial Distribution — Deployed high-volume procurement and real-time inventory management.",
      "Surgical Equipment Manufacturing — Configured financial and supply chain workflows to meet international quality standards.",
      "Non-Profit Sector — Configured Grants and Fund Management accounting with donor reporting compliance.",
      "Plastic Packaging & Chemical Manufacturing — Deployed NetSuite OneWorld multi-entity consolidation.",
      "Directed technical team building custom SuiteApps on NetSuite Cloud ERP platform.",
    ],
  },
  {
    company: "Crowe Hussain Chaudhury & Co.",
    location: "Pakistan",
    role: "Senior Manager (ERP Advisory)",
    period: "2014–2018",
    overview:
      "Directed SAP Business One implementations and custom add-on engineering for 50+ enterprises. Managed major utility ERP programs with combined project value of ~PKR 600 Million.",
    highlights: [
      "IESCO ERP Program — Managed SAP S/4HANA program from inception: authored RFP, led vendor selection, and oversaw delivery compliance.",
      "IESCO Data Center — Scoped and managed turnkey data center build-out and acceptance testing.",
      "PESCO USAID Modernization — Served as PM for donor-funded power utility ERP and billing modernization program.",
      "SAP B1 Add-On Architecture — Architected custom industry add-ons and led delivery teams.",
    ],
  },
  {
    company: "Shaigan Pharma & Al-Aziz Packages",
    location: "Pakistan",
    role: "ERP & IT Leadership Roles",
    period: "2006–2014",
    overview:
      "Led in-house ERP deployments and software engineering across pharmaceutical and packaging manufacturing.",
    highlights: [
      "Al-Aziz Packages — Built custom CPQ estimation software for packaging pricing, later migrating operations onto SAP Business One.",
      "Shaigan Pharma — Migrated SAP Business One from v2007 to v8.2 completely in-house without external implementation partner costs; built custom Distribution and Sales DMS.",
    ],
  },
];

export const NOTABLE_ACHIEVEMENTS = [
  "Pioneered Oracle NetSuite Practice in Pakistan — recruited as founding NetSuite lead, built and trained the country's first 10-15 person NetSuite delivery team.",
  "15+ NetSuite Enterprise Rollouts — led end-to-end implementations supporting deployments of varying scale across manufacturing, pharma, insurance, and retail.",
  "50+ SAP Business One Implementations — designed and delivered custom ERP solutions across 50+ enterprises, including Pakistan's fastest recorded SAP B1 go-live.",
  "~PKR 600M Utility ERP Governance — authored RFPs and governed national utility ERP rollout (IESCO) and USAID billing modernization (PESCO).",
  "In-House SAP B1 Upgrade — successfully migrated Shaigan Pharma's SAP system fully in-house without external vendor fees.",
  "ERP Turnaround & Recovery — recurring advisory engagements recovering stalled ERP programs and fixing data integrity gaps.",
];

export const CERTIFICATIONS: CertificationGroup[] = [
  {
    title: "AI & Digital Strategy",
    items:
      "LinkedIn: Integrating GenAI into Business Strategy (2025); Google Cloud Skills Boost: Introduction to Generative AI (2025); PMI: GenAI for Project Leaders (2024)",
  },
  {
    title: "ERP & Enterprise Platforms",
    items:
      "Microsoft: Dynamics 365 Solution Architect & Power Platform (2024); Odoo Enterprise & Studio (2023); NetSuite Partner Enablement (2018); SAP Business One (2009/2013)",
  },
  {
    title: "Project Leadership",
    items:
      "IBM: Project Management & Agile Explorer (2025); PMP Training, PMI (2015)",
  },
  {
    title: "Cybersecurity & Audit",
    items:
      "ISC² Candidate (2024–2025); CISA Training (2012); ISACA Training (2013)",
  },
  {
    title: "Data & Analytics",
    items: "CBAP Training (2014); Tableau, Simplilearn (2024)",
  },
  {
    title: "Leadership & Education",
    items:
      "Total Quality Management, NPO Govt of Pakistan (2010); MBA (MIS), UMT Lahore (1999); B.Com, Hailey College of Commerce (1996)",
  },
];

export const PRODUCT_JOURNEY = {
  headline: "From Solving Client Problems to Building Software Products.",
  p1: "Our advisory work puts us on the front lines of operational problems every day. When we spot recurring gaps across businesses, we build focused, lightweight software products to solve them.",
  p2: "Entrpryz product principles are straightforward:",
  motto: "Solve real operational problems. Build clean software. Keep it accessible.",
  status: "Software products currently in active development.",
  cta: "Talk to Us →",
};

export const TEAM = [
  {
    name: "Javed Ahmad Qureshi",
    role: "Founder | Chief Information Officer",
  },
  {
    name: "Waleed Ahmad",
    role: "Co-Founder | Product Engineering & Technical Delivery",
  },
];

export const CONTACT_CONTENT = {
  headline: "Let's Talk About Your Systems.",
  body: "New ERP rollout, a stalled implementation, custom business software, or system security — start with a direct conversation with the people who'll actually do the work.",
  tagline: "Entrpryz — Technology. Simplified.",
  cta: "Schedule A Call →",
  contacts: {
    general: "connect@entrpryz.com",
    javed: "javed@entrpryz.com",
    waleed: "waleed@entrpryz.com",
  },
};
