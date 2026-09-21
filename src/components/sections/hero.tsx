import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronRight, Shield } from "lucide-react";
import { HERO_CONTENT } from "@/lib/content";

export function HeroSection() {
  return (
    <section className="border-b border-surface-border bg-background py-16 md:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Hero Layout: Massive Headline & Executive Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Display Headline & Summary */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 border border-brand-orange/40 bg-surface-card px-3.5 py-1 text-xs uppercase tracking-wider font-semibold text-brand-orange">
              <Shield className="h-3.5 w-3.5" />
              <span>25+ Years Enterprise Technology Leadership</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-text-primary uppercase leading-[0.95]">
              Technology.
              <br />
              <span className="text-brand-orange">Simplified.</span>
            </h1>

            <p className="text-base sm:text-xl font-semibold text-brand-amber max-w-2xl leading-snug">
              {HERO_CONTENT.subheadline}
            </p>

            <p className="text-sm sm:text-base text-text-secondary max-w-2xl leading-relaxed">
              {HERO_CONTENT.body}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-brand-orange px-8 py-4 text-xs font-bold uppercase tracking-widest text-background transition-colors hover:bg-brand-amber active:scale-95"
              >
                <span>{HERO_CONTENT.ctaPrimary}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 border border-surface-border bg-surface-card px-8 py-4 text-xs font-semibold uppercase tracking-widest text-text-primary transition-colors hover:border-brand-orange hover:text-brand-orange active:scale-95"
              >
                <span>{HERO_CONTENT.ctaSecondary}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Key Operational Metric Cards */}
          <div className="lg:col-span-4 border border-surface-border bg-surface-card p-6 space-y-6">
            <div className="border-b border-surface-border pb-3 flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-wider font-bold text-text-primary">
                Leadership Track Record
              </h3>
              <span className="text-[10px] font-mono text-brand-orange uppercase">
                Direct Oversight
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-3xl font-display font-bold text-brand-orange">25+</p>
                <p className="text-xs uppercase font-medium text-text-secondary">Years Experience</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-display font-bold text-text-primary">65+</p>
                <p className="text-xs uppercase font-medium text-text-secondary">ERP Programs Led</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-display font-bold text-text-primary">150+</p>
                <p className="text-xs uppercase font-medium text-text-secondary">Users Supported</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-display font-bold text-brand-amber">PK/UAE</p>
                <p className="text-xs uppercase font-medium text-text-secondary">Multi-Country</p>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-border text-xs text-text-secondary">
              <p className="font-medium text-text-primary">Oracle NetSuite &bull; SAP Business One &bull; Custom Apps</p>
            </div>
          </div>
        </div>

        {/* Clean Executive Visual Frame */}
        <div className="border border-surface-border bg-surface-card p-3 overflow-hidden">
          <div className="relative aspect-[21/9] w-full bg-surface-dark overflow-hidden">
            <Image
              src="/images/hero-tech-bg.jpg"
              alt="Enterprise Technology Architecture"
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-background/90 backdrop-blur-md p-4 border border-surface-border">
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-brand-orange">
                  Enterprise Systems &amp; Technical Governance
                </p>
                <p className="text-xs text-text-secondary font-medium">
                  ERP Rollouts &bull; Software Engineering &bull; IT Modernization
                </p>
              </div>
              <p className="text-xs font-mono text-text-secondary">
                PAKISTAN &bull; UAE
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
