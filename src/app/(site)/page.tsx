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
    <>
      {/* Hero */}
      <div id="home">
        <HeroSection />
      </div>

      {/* About */}
      <div id="about" className="scroll-mt-20">
        <div id="behind-entrpryz" className="scroll-mt-20">
          <BehindEntrpryzSection />
        </div>
        <div id="about-entrpryz" className="scroll-mt-20">
          <AboutSummarySection />
        </div>
        <FounderSpotlightSection />
        <div id="certifications" className="scroll-mt-20">
          <CertificationsGridSection />
        </div>
      </div>

      {/* Services */}
      <div id="services" className="scroll-mt-20">
        <div id="services-list" className="scroll-mt-20">
          <ServicesCardsSection />
        </div>
        <div id="how-we-work" className="scroll-mt-20">
          <WorkflowStepsSection />
        </div>
        <div id="why-entrpryz" className="scroll-mt-20">
          <WhyEntrpryzSection />
        </div>
        <div id="product-journey" className="scroll-mt-20">
          <ProductJourneySection />
        </div>
      </div>

      {/* Portfolio */}
      <div id="portfolio" className="scroll-mt-20">
        <div id="career" className="scroll-mt-20">
          <CareerTimelineSection />
        </div>
        <div id="track-record" className="scroll-mt-20">
          <PortfolioOverviewSection />
        </div>
      </div>

      {/* Contact */}
      <div id="contact" className="scroll-mt-20">
        <ContactSection />
      </div>
    </>
  );
}
