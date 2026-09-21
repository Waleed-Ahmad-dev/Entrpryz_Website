import { WHY_ENTRPRYZ } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { ShieldCheck } from "lucide-react";

export function WhyEntrpryzSection() {
  return (
    <SectionContainer darkSurface={false}>
      <div className="space-y-16">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 border border-brand-orange/40 bg-surface-card px-3.5 py-1 rounded-sm text-xs uppercase tracking-wider font-semibold text-brand-orange">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>The Entrpryz Advantage</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-text-primary uppercase leading-tight">
            {WHY_ENTRPRYZ.headline}
          </h2>
        </div>

        {/* Executive Value Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_ENTRPRYZ.reasons.map((reason, idx) => (
            <div
              key={idx}
              className="border border-surface-border bg-surface-card p-8 space-y-4 flex flex-col justify-between hover:border-brand-orange transition-colors group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-surface-border pb-3">
                  <span className="text-xs font-mono font-bold text-brand-orange">
                    0{idx + 1}
                  </span>
                  <span className="text-xs font-mono text-text-secondary">
                    ADVISORY PRINCIPLE
                  </span>
                </div>

                <h3 className="text-xl font-display font-bold text-text-primary uppercase group-hover:text-brand-orange transition-colors">
                  {reason.title}
                </h3>

                <p className="text-sm text-text-secondary leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
