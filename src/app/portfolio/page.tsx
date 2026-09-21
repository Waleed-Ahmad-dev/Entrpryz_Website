import Link from "next/link";
import { ArrowUpRight, Award, ShieldCheck } from "lucide-react";
import { PORTFOLIO_HEADER, PORTFOLIO_ACHIEVEMENTS, PORTFOLIO_CTA } from "@/lib/portfolio-data";
import { SectionContainer } from "@/components/layout/section-container";
import { Tier1EntrpryzSection } from "@/components/portfolio/tier1-entrpryz";
import { Tier2KeystoneSection } from "@/components/portfolio/tier2-keystone";
import { Tier3CroweSection } from "@/components/portfolio/tier3-crowe";

export const metadata = {
  title: "Track Record & Portfolio — Entrpryz",
  description:
    "25 Years of Delivery. 39+ Organizations. Three Continents' Worth of Lessons.",
};

export default function PortfolioPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Portfolio Header */}
      <section className="border-b border-surface-border bg-background bg-grid-pattern py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 border border-brand-orange/40 bg-surface-card px-4 py-1.5 text-xs uppercase tracking-label font-semibold text-brand-orange">
            <Award className="h-4 w-4" />
            <span>Proven Enterprise Track Record</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-h1 text-text-primary uppercase leading-tight max-w-4xl">
            {PORTFOLIO_HEADER.headline}
          </h1>

          <p className="text-base sm:text-lg text-text-secondary max-w-3xl leading-relaxed border-l-2 border-brand-orange pl-6 py-1">
            {PORTFOLIO_HEADER.subheadline}
          </p>
        </div>
      </section>

      {/* 3-Tier Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        <Tier1EntrpryzSection />
        <Tier2KeystoneSection />
        <Tier3CroweSection />

        {/* Portfolio Notable Achievements Band */}
        <div className="border border-brand-orange bg-surface-card p-8 sm:p-12 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-label font-bold text-brand-orange">
            <ShieldCheck className="h-4 w-4" />
            <span>Notable Track Record Milestones</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PORTFOLIO_ACHIEVEMENTS.map((ach, idx) => (
              <div
                key={idx}
                className="border border-surface-border bg-background p-4 space-y-1 text-xs sm:text-sm text-text-primary font-medium"
              >
                <span className="text-brand-orange font-mono font-bold mr-2">
                  0{idx + 1}.
                </span>
                {ach}
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Page CTA */}
        <div className="border border-surface-border bg-background p-8 sm:p-12 text-center space-y-6 max-w-3xl mx-auto shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-h2 text-text-primary uppercase">
            {PORTFOLIO_CTA.headline}
          </h2>
          <div>
            <Link
              href={PORTFOLIO_CTA.buttonHref}
              className="inline-flex items-center gap-2 bg-brand-orange px-8 py-4 text-xs font-semibold uppercase tracking-cta text-background hover:bg-brand-amber transition-all shadow-lg active:scale-95"
            >
              <span>{PORTFOLIO_CTA.buttonText}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
