import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Award, ShieldCheck, Terminal } from "lucide-react";
import { BEHIND_ENTRPRYZ } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { AnimateInView } from "@/components/ui/animate-in-view";

export function BehindEntrpryzSection() {
  return (
    <SectionContainer darkSurface={true}>
      <div className="space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Founder Photograph Column */}
          <div className="lg:col-span-4 flex justify-center">
            <AnimateInView direction="right" delay={0.1}>
              <div className="relative w-full max-w-sm rounded-2xl border-2 border-surface-border bg-background p-2.5 shadow-2xl group hover:border-brand-orange transition-colors duration-500">
                <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-surface-dark scanline-overlay">
                  <Image
                    src="/images/javed-qureshi.jpg"
                    alt="Javed Ahmad Qureshi - Founder & CIO of Entrpryz"
                    fill
                    className="object-cover object-top grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="bg-background/90 backdrop-blur-md px-2.5 py-1 border border-surface-border text-[9px] font-mono font-bold uppercase tracking-widest text-brand-orange">
                      [ FOUNDER ]
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-md p-3 border border-surface-border rounded-lg">
                    <span className="inline-block bg-brand-orange text-background px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest font-mono">
                      FOUNDER &amp; LEAD ARCHITECT
                    </span>
                    <p className="mt-1 text-base font-display font-bold text-text-primary">
                      Javed Ahmad Qureshi
                    </p>
                    <p className="text-[11px] font-mono text-text-secondary">
                      CIO &amp; Digital Transformation Leader
                    </p>
                  </div>
                </div>
              </div>
            </AnimateInView>
          </div>

          {/* Text & Stat Row Column */}
          <div className="lg:col-span-8 space-y-6">
            <AnimateInView direction="up" delay={0.1}>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/40 bg-background px-3.5 py-1 text-xs uppercase tracking-label font-mono font-semibold text-brand-orange">
                <Award className="h-3.5 w-3.5" />
                <span>Proven Enterprise Leadership</span>
              </div>
            </AnimateInView>

            <AnimateInView direction="up" delay={0.2}>
              <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-h2 text-text-primary uppercase leading-tight">
                {BEHIND_ENTRPRYZ.headline}
              </h2>
            </AnimateInView>

            <AnimateInView direction="up" delay={0.3}>
              <p className="text-lg font-semibold text-brand-amber border-l-2 border-brand-orange pl-4 py-1">
                {BEHIND_ENTRPRYZ.subheadline}
              </p>
            </AnimateInView>

            <AnimateInView direction="up" delay={0.4}>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                Entrpryz brings direct access to senior executive experience — eliminating layers of corporate complexity to deliver enterprise-grade strategy and implementation directly to your leadership team.
              </p>
            </AnimateInView>

            <AnimateInView direction="up" delay={0.5}>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2.5 rounded-full border border-brand-orange bg-brand-orange/10 px-6 py-3 text-xs font-bold uppercase tracking-cta text-brand-orange transition-all duration-300 hover:bg-brand-orange hover:text-background active:scale-95"
                >
                  <span>{BEHIND_ENTRPRYZ.cta}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </AnimateInView>
          </div>
        </div>

        {/* Horizontal Telemetry Stat Row Strip */}
        <AnimateInView direction="up" delay={0.4}>
          <div className="doppelrand-card rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-surface-border">
              {BEHIND_ENTRPRYZ.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`space-y-1 ${idx > 0 ? "pt-4 sm:pt-0 sm:pl-6" : ""}`}
                >
                  <p className="text-3xl sm:text-4xl font-display font-extrabold text-brand-orange tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-[11px] font-mono uppercase font-semibold text-text-secondary tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AnimateInView>
      </div>
    </SectionContainer>
  );
}
