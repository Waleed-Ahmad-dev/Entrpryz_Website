import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronRight, ShieldCheck, Zap } from "lucide-react";
import { HERO_CONTENT } from "@/lib/content";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center border-b border-surface-border bg-background bg-grid-pattern py-20 lg:py-32">
      {/* Background glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial-gradient pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-surface-border bg-surface-card px-4 py-1.5 text-xs uppercase tracking-label font-medium text-brand-amber mb-8 shadow-sm">
          <ShieldCheck className="h-4 w-4 text-brand-orange" />
          <span>25+ Years Enterprise Technology Leadership</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-h1 text-text-primary uppercase max-w-4xl mx-auto leading-tight">
          Technology. <span className="text-brand-orange">Simplified.</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg sm:text-xl lg:text-2xl font-semibold tracking-h2 text-brand-amber max-w-3xl mx-auto">
          {HERO_CONTENT.subheadline}
        </p>

        {/* Body Copy */}
        <p className="mt-6 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          {HERO_CONTENT.body}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-orange px-8 py-4 text-sm font-semibold uppercase tracking-cta text-background transition-all hover:bg-brand-amber hover:shadow-lg hover:shadow-brand-orange/20 active:scale-95"
          >
            <span>{HERO_CONTENT.ctaPrimary}</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-surface-border bg-surface-card px-8 py-4 text-sm font-medium tracking-cta text-text-primary transition-all hover:border-brand-orange hover:text-brand-orange active:scale-95"
          >
            <span>{HERO_CONTENT.ctaSecondary}</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Hero Visual Banner Card */}
        <div className="mt-16 relative rounded-none border border-surface-border bg-surface-card p-2 shadow-2xl max-w-5xl mx-auto overflow-hidden">
          <div className="relative aspect-[21/9] w-full bg-surface-dark overflow-hidden">
            <Image
              src="/images/hero-tech-bg.jpg"
              alt="Entrpryz Technology Infrastructure"
              fill
              className="object-cover opacity-60 mix-blend-luminosity hover:opacity-75 transition-opacity duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left border-t border-surface-border/50 pt-4 bg-background/80 backdrop-blur-sm p-4">
              <div>
                <p className="text-xs uppercase tracking-label font-semibold text-brand-orange">
                  Enterprise Grade Execution
                </p>
                <p className="text-sm font-medium text-text-primary">
                  ERP • Cloud • AI • Custom Software Architecture
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-secondary font-mono">
                <span>PK / UAE Operations</span>
                <span>•</span>
                <span>65+ ERP Programs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
