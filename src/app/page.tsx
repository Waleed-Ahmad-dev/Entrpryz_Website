import { HeroSection } from "@/components/sections/hero";
import { BehindEntrpryzSection } from "@/components/sections/behind-entrpryz";
import { ExperienceBehindSection } from "@/components/sections/experience-behind";
import { AboutSummarySection } from "@/components/sections/about-summary";
import { ServicesCardsSection } from "@/components/sections/services-cards";
import { WorkflowStepsSection } from "@/components/sections/workflow-steps";
import { WhyEntrpryzSection } from "@/components/sections/why-entrpryz";
import { FounderSpotlightSection } from "@/components/sections/founder-spotlight";
import { CareerTimelineSection } from "@/components/sections/career-timeline";
import { AchievementsGridSection } from "@/components/sections/achievements-grid";
import { CertificationsGridSection } from "@/components/sections/certifications-grid";
import { ProductJourneySection } from "@/components/sections/product-journey";
import { ContactCTASection } from "@/components/sections/contact-cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BehindEntrpryzSection />
      <ExperienceBehindSection />
      <AboutSummarySection />
      <ServicesCardsSection />
      <WorkflowStepsSection />
      <WhyEntrpryzSection />
      <FounderSpotlightSection />
      <CareerTimelineSection />
      <AchievementsGridSection />
      <CertificationsGridSection />
      <ProductJourneySection />
      <ContactCTASection />
    </>
  );
}
