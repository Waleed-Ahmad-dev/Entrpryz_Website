import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Award } from "lucide-react";
import { BEHIND_ENTRPRYZ } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";

export function BehindEntrpryzSection() {
  return (
    <SectionContainer darkSurface={true}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Founder Photograph Column */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="relative w-full max-w-sm aspect-[4/5] border-2 border-surface-border bg-background p-2 shadow-xl group">
            <div className="relative h-full w-full overflow-hidden bg-surface-dark">
              <Image
                src="/images/javed-qureshi.jpg"
                alt="Javed Ahmad Qureshi - Founder & CIO of Entrpryz"
                fill
                className="object-cover object-top grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block bg-brand-orange text-background px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-label">
                  Founder &amp; Lead Architect
                </span>
                <p className="mt-1 text-base font-bold text-text-primary">
                  Javed Ahmad Qureshi
                </p>
                <p className="text-xs text-text-secondary">
                  CIO &amp; ERP Strategy Leader
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Text & Stat Row Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-label font-semibold text-brand-orange">
            <Award className="h-4 w-4" />
            <span>Proven Enterprise Leadership</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-h2 text-text-primary uppercase">
            {BEHIND_ENTRPRYZ.headline}
          </h2>

          <p className="text-lg font-semibold text-brand-amber">
            {BEHIND_ENTRPRYZ.subheadline}
          </p>

          {/* Stat Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4 border-t border-b border-surface-border py-6">
            {BEHIND_ENTRPRYZ.stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-2xl sm:text-3xl font-bold text-brand-orange tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-brand-orange bg-brand-orange/10 px-6 py-3 text-xs font-semibold uppercase tracking-cta text-brand-orange transition-all hover:bg-brand-orange hover:text-background"
            >
              <span>{BEHIND_ENTRPRYZ.cta}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
