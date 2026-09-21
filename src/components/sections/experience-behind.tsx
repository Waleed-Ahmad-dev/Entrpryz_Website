import { EXPERIENCE_BEHIND } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { CheckCircle2 } from "lucide-react";

export function ExperienceBehindSection() {
  return (
    <SectionContainer darkSurface={false}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-label font-semibold text-brand-orange">
            Proven Foundation
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-h2 text-text-primary uppercase">
            {EXPERIENCE_BEHIND.headline}
          </h2>
        </div>

        <div className="space-y-6 text-base sm:text-lg text-text-secondary leading-relaxed border-l-2 border-brand-orange pl-6 my-8">
          <p className="font-semibold text-text-primary text-xl">
            {EXPERIENCE_BEHIND.p1}
          </p>
          <p>{EXPERIENCE_BEHIND.p2}</p>
          <p>{EXPERIENCE_BEHIND.p3}</p>
        </div>

        {/* 4 Grid Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          {EXPERIENCE_BEHIND.stats.map((stat, idx) => (
            <div
              key={idx}
              className="border border-surface-border bg-surface-card p-5 space-y-2 text-center"
            >
              <p className="text-3xl sm:text-4xl font-bold text-brand-orange font-sans">
                {stat.value}
              </p>
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Highlight Footer Statement */}
        <div className="mt-8 border border-brand-orange/40 bg-surface-card p-6 text-center shadow-lg">
          <p className="text-lg font-medium text-text-primary uppercase tracking-wider flex items-center justify-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-brand-orange" />
            <span>{EXPERIENCE_BEHIND.footer}</span>
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}
