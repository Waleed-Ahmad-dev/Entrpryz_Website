export interface CaseStudy {
  client: string;
  location?: string;
  website?: string;
  status?: string;
  description: string;
  image?: string;
}

export interface TableEngagement {
  client: string;
  scope: string;
  industry?: string;
  platform?: string;
}

export interface PortfolioTier {
  id: string;
  title: string;
  subtitle: string;
  featured: CaseStudy[];
  additional: TableEngagement[];
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  items: string[];
  ctaText: string;
  ctaHref: string;
  image: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface ValueProp {
  title: string;
  description: string;
}

export interface TimelineExperience {
  company: string;
  role: string;
  period: string;
  location: string;
  overview: string;
}

export interface WebsiteNavSection {
  name: string;
  href: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  organization: string;
  service: string;
  message: string;
}

export interface CertificationGroup {
  title: string;
  items: string;
}
