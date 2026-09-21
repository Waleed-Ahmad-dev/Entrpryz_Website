import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronRight, ShieldCheck, Sparkles, Cpu, Layers, BarChart3 } from "lucide-react";
import { HERO_CONTENT } from "@/lib/content";
import { AnimateInView } from "@/components/ui/animate-in-view";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center border-b border-surface-border bg-background bg-grid-pattern py-12 lg:py-20 overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial-gradient pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10 space-y-16">
        {/* Top Hero Grid: Headline Left, Telemetry & Stats Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          {/* Left Headline Column */}
          <div className="lg:col-span-8 space-y-6">
            <AnimateInView direction="up" delay={0.1}>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/40 bg-surface-card/80 backdrop-blur-md px-4 py-1.5 text-[11px] uppercase tracking-label font-mono font-semibold text-brand-amber">
                <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
                <span>25+ Years Enterprise Technology Leadership</span>
              </div>
            </AnimateInView>

            <AnimateInView direction="up" delay={0.2}>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-extrabold tracking-h1 text-text-primary uppercase leading-[0.92]">
                Technology.
                <br />
                <span className="text-brand-orange relative inline-block">
                  Simplified.
                  <span className="absolute left-0 -bottom-2 w-full h-1 bg-gradient-to-r from-brand-orange via-brand-amber to-transparent rounded-full" />
                </span>
              </h1>
            </AnimateInView>

            <AnimateInView direction="up" delay={0.3}>
              <p className="text-lg sm:text-xl font-medium text-brand-amber max-w-2xl leading-snug pt-2">
                {HERO_CONTENT.subheadline}
              </p>
            </AnimateInView>

            <AnimateInView direction="up" delay={0.4}>
              <p className="text-sm sm:text-base text-text-secondary max-w-2xl leading-relaxed">
                {HERO_CONTENT.body}
              </p>
            </AnimateInView>

            {/* CTAs */}
            <AnimateInView direction="up" delay={0.5}>
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-brand-orange px-8 py-4 text-xs font-bold uppercase tracking-cta text-background transition-all duration-300 hover:bg-brand-amber hover:shadow-xl hover:shadow-brand-orange/20 active:scale-95"
                >
                  <span>{HERO_CONTENT.ctaPrimary}</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background/20 text-background transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>

                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-surface-border bg-surface-card px-8 py-4 text-xs font-semibold uppercase tracking-cta text-text-primary transition-all duration-300 hover:border-brand-orange hover:text-brand-orange active:scale-95"
                >
                  <span>{HERO_CONTENT.ctaSecondary}</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </AnimateInView>
          </div>

          {/* Right Column: Telemetry Stat Tiles */}
          <div className="lg:col-span-4 space-y-4">
            <AnimateInView direction="left" delay={0.3}>
              <div className="doppelrand-card p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-surface-border pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-orange font-bold flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5" />
                    SYSTEM METRICS
                  </span>
                  <span className="h-2 w-2 rounded-full bg-brand-orange animate-pulse" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-3xl font-display font-bold text-brand-orange">25+</p>
                    <p className="text-[10px] uppercase font-mono text-text-secondary">Years Exp.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-display font-bold text-text-primary">65+</p>
                    <p className="text-[10px] uppercase font-mono text-text-secondary">ERP Programs</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-display font-bold text-text-primary">150+</p>
                    <p className="text-[10px] uppercase font-mono text-text-secondary">Users Lead</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-display font-bold text-brand-amber">PK/UAE</p>
                    <p className="text-[10px] uppercase font-mono text-text-secondary">Operations</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-surface-border text-[11px] font-mono text-text-secondary flex items-center justify-between">
                  <span>CIO LEADERSHIP</span>
                  <span className="text-brand-orange">ORACLE &bull; SAP &bull; CLOUD</span>
                </div>
              </div>
            </AnimateInView>
          </div>
        </div>

        {/* Asymmetric Hero Bento Showcase Grid */}
        <AnimateInView direction="up" delay={0.6}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Bento Card 1: Main Tech Visual (Col 7) */}
            <div className="md:col-span-7 relative group rounded-2xl overflow-hidden border border-surface-border bg-surface-card p-2">
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-surface-dark scanline-overlay">
                <Image
                  src="/images/hero-tech-bg.jpg"
                  alt="Enterprise Architecture"
                  fill
                  className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className="bg-background/90 backdrop-blur-md border border-surface-border px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-brand-orange">
                    [ ENTERPRISE LANDSCAPE ]
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-background/85 backdrop-blur-md p-3.5 border border-surface-border rounded-lg">
                  <div>
                    <p className="text-xs font-bold text-text-primary uppercase tracking-wide">
                      Digital Transformation Architecture
                    </p>
                    <p className="text-[11px] text-text-secondary font-mono">
                      ERP &bull; Custom Software &bull; Governance
                    </p>
                  </div>
                  <BarChart3 className="h-5 w-5 text-brand-orange" />
                </div>
              </div>
            </div>

            {/* Bento Card 2: Enterprise Deployments (Col 5) */}
            <div className="md:col-span-5 relative group rounded-2xl overflow-hidden border border-surface-border bg-surface-card p-2 flex flex-col justify-between">
              <div className="relative aspect-[16/9] md:aspect-auto md:h-full w-full rounded-xl overflow-hidden bg-surface-dark">
                <Image
                  src="/images/portfolio-netsuite-mfg.jpg"
                  alt="NetSuite Deployment"
                  fill
                  className="object-cover opacity-65 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className="bg-background/90 backdrop-blur-md border border-surface-border px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-brand-amber">
                    [ 15+ NETSUITE &amp; 50+ SAP B1 ]
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-background/85 backdrop-blur-md p-3.5 border border-surface-border rounded-lg space-y-1">
                  <p className="text-xs font-bold text-text-primary uppercase tracking-wide">
                    Multi-Industry Track Record
                  </p>
                  <p className="text-[11px] text-text-secondary font-mono">
                    Manufacturing &bull; Pharma &bull; Utilities &bull; Retail
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimateInView>
      </div>
    </section>
  );
}
