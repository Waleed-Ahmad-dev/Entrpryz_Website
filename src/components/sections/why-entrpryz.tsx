import { WHY_ENTRPRYZ } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { ShieldCheck, Target, Lightbulb, Scale, Users } from "lucide-react";

const ICONS = [
  <ShieldCheck key="shield" className="h-6 w-6 text-brand-orange" />,
  <Target key="target" className="h-6 w-6 text-brand-orange" />,
  <Lightbulb key="bulb" className="h-6 w-6 text-brand-orange" />,
  <Scale key="scale" className="h-6 w-6 text-brand-orange" />,
  <Users key="users" className="h-6 w-6 text-brand-orange" />,
];

export function WhyEntrpryzSection() {
  return (
    <SectionContainer darkSurface={false}>
      <div className="space-y-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-label font-semibold text-brand-orange">
            The Entrpryz Differentiator
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-h2 text-text-primary uppercase">
            {WHY_ENTRPRYZ.headline}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_ENTRPRYZ.reasons.map((reason, idx) => (
            <div
              key={idx}
              className="border border-surface-border bg-surface-card p-8 space-y-4 hover:border-brand-orange transition-all duration-300 group"
            >
              <div className="p-3 w-fit bg-background border border-surface-border group-hover:border-brand-orange transition-colors">
                {ICONS[idx]}
              </div>
              <h3 className="text-xl font-bold text-text-primary uppercase group-hover:text-brand-orange transition-colors">
                {reason.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
