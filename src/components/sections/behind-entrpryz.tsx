import { ArrowUpRight, Award } from "lucide-react";
import { BEHIND_ENTRPRYZ } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { ButtonLink } from "@/components/ui/button";

export function BehindEntrpryzSection() {
  return (
    <SectionContainer darkSurface={true}>
      <div className="space-y-16">
        <div className="max-w-4xl space-y-6">
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
            When you work with Entrpryz, you work directly with the people who
            understand your business and build the solution — no account
            layers, no handoffs, no jargon.
          </p>

          <div className="pt-2">
            <ButtonLink href="#founder" variant="brandOutline" size="md">
              <span>{BEHIND_ENTRPRYZ.cta}</span>
              <ArrowUpRight className="h-4 w-4" />
            </ButtonLink>
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