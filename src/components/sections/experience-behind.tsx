import { EXPERIENCE_BEHIND } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { CheckCircle2 } from "lucide-react";

export function ExperienceBehindSection() {
  return (
    <SectionContainer darkSurface={false} backgroundImage="/images/bg-analytics.jpg">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-brand-orange">
            Proven Foundation
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-text-primary uppercase leading-tight">
            {EXPERIENCE_BEHIND.headline}
          </h2>
        </div>

        {/* Narrative Box */}
        <div className="border border-surface-border bg-surface-card p-8 sm:p-10 space-y-6 relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-orange" />
          
          <p className="text-xl sm:text-2xl font-display font-semibold text-text-primary leading-snug">
            &ldquo;{EXPERIENCE_BEHIND.p1}&rdquo;
          </p>

          <div className="space-y-4 text-sm sm:text-base text-text-secondary leading-relaxed pt-4 border-t border-surface-border">
            <p>{EXPERIENCE_BEHIND.p2}</p>
            <p>{EXPERIENCE_BEHIND.p3}</p>
          </div>
        </div>

        {/* Key Metric Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {EXPERIENCE_BEHIND.stats.map((stat, idx) => (
            <div
              key={idx}
              className="border border-surface-border bg-surface-card p-6 space-y-1 text-center"
            >
              <p className="text-3xl sm:text-4xl font-display font-bold text-brand-orange tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Principle Banner */}
        <div className="border border-brand-orange/40 bg-surface-card p-5 text-center">
          <p className="text-base sm:text-lg font-display font-bold text-text-primary uppercase tracking-wider flex items-center justify-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0" />
            <span>{EXPERIENCE_BEHIND.footer}</span>
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}
