import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Award } from "lucide-react";
import { BEHIND_ENTRPRYZ } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";

export function BehindEntrpryzSection() {
  return (
    <SectionContainer darkSurface={true}>
      <div className="space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Founder Photograph Column */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-full max-w-sm border border-surface-border bg-background p-3 shadow-md">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-dark">
                <Image
                  src="/images/javed-qureshi.jpg"
                  alt="Javed Ahmad Qureshi - Founder & CIO of Entrpryz"
                  fill
                  className="object-cover object-top filter grayscale contrast-110 hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 bg-background/95 p-3 border border-surface-border">
                  <span className="inline-block bg-brand-orange text-background px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    FOUNDER &amp; CIO
                  </span>
                  <p className="mt-1 text-base font-bold text-text-primary">
                    Javed Ahmad Qureshi
                  </p>
                  <p className="text-xs text-text-secondary">
                    Founder, Entrpryz
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 border border-brand-orange/40 bg-background px-3.5 py-1 rounded-sm text-xs uppercase tracking-wider font-semibold text-brand-orange">
              <Award className="h-3.5 w-3.5" />
              <span>Who We Are</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-text-primary uppercase leading-tight">
              {BEHIND_ENTRPRYZ.headline}
            </h2>

            <p className="text-lg font-semibold text-brand-amber border-l-2 border-brand-orange pl-4 py-1">
              {BEHIND_ENTRPRYZ.subheadline}
            </p>

            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              When you work with Entrpryz, you work directly with the people who understand your business and build the solution — no account layers, no handoffs, no jargon.
            </p>

            <div className="pt-2">
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 border border-brand-orange bg-brand-orange/10 px-6 py-3 rounded-md text-xs font-bold uppercase tracking-widest text-brand-orange transition-colors hover:bg-brand-orange hover:text-background"
              >
                <span>{BEHIND_ENTRPRYZ.cta}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Executive Stat Strip */}
        <div className="border border-surface-border bg-surface-card p-6 md:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-surface-border">
            {BEHIND_ENTRPRYZ.stats.map((stat, idx) => (
              <div
                key={idx}
                className={`space-y-1 ${idx > 0 ? "pt-4 sm:pt-0 sm:pl-6" : ""}`}
              >
                <p className="text-3xl sm:text-4xl font-display font-bold text-brand-orange tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs uppercase font-semibold text-text-secondary tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
