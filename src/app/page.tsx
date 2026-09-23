import { HeroSection } from "@/components/sections/hero";
import { BehindEntrpryzSection } from "@/components/sections/behind-entrpryz";
import { AboutSummarySection } from "@/components/sections/about-summary";
import { FounderSpotlightSection } from "@/components/sections/founder-spotlight";
import { CertificationsGridSection } from "@/components/sections/certifications-grid";
import { ServicesCardsSection } from "@/components/sections/services-cards";
import { WorkflowStepsSection } from "@/components/sections/workflow-steps";
import { WhyEntrpryzSection } from "@/components/sections/why-entrpryz";
import { ProductJourneySection } from "@/components/sections/product-journey";
import { CareerTimelineSection } from "@/components/sections/career-timeline";
import { PortfolioOverviewSection } from "@/components/portfolio/portfolio-overview";
import { ContactSection } from "@/components/sections/contact-section";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <div id="home">
        <HeroSection />
      </div>

      {/* About */}
      <div id="about">
        <BehindEntrpryzSection />
        <AboutSummarySection />
        <FounderSpotlightSection />
        <CertificationsGridSection />
      </div>

      {/* Services */}
      <div id="services">
        <ServicesCardsSection />
        <WorkflowStepsSection />
        <WhyEntrpryzSection />
        <ProductJourneySection />
      </div>

      {/* Portfolio */}
      <div id="portfolio">
        <CareerTimelineSection />
        <PortfolioOverviewSection />
      </div>

      {/* Contact */}
      <div id="contact">
        <ContactSection />
      </div>
    </main>
  );
}
