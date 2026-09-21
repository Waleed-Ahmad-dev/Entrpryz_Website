import { WHY_ENTRPRYZ } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { AnimateInView } from "@/components/ui/animate-in-view";
import { ShieldCheck } from "lucide-react";

const TAGS = ["[ EXP ]", "[ BIZ ]", "[ PRA ]", "[ AGN ]", "[ LTP ]"];

export function WhyEntrpryzSection() {
  return (
    <SectionContainer darkSurface={false}>
      <div className="space-y-16">
        <div className="max-w-3xl space-y-4">
          <AnimateInView direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/40 bg-surface-card px-3.5 py-1 text-xs uppercase tracking-label font-mono font-semibold text-brand-orange">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>The Entrpryz Differentiator</span>
            </div>
          </AnimateInView>

          <AnimateInView direction="up" delay={0.2}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-h2 text-text-primary uppercase leading-tight">
              {WHY_ENTRPRYZ.headline}
            </h2>
          </AnimateInView>
        </div>

        {/* Dossier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_ENTRPRYZ.reasons.map((reason, idx) => (
            <AnimateInView key={idx} direction="up" delay={0.1 * (idx + 1)}>
              <div className="doppelrand-card rounded-2xl p-8 space-y-4 h-full flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-surface-border pb-3">
                    <span className="text-xs font-mono font-bold text-brand-orange">
                      {TAGS[idx]}
                    </span>
                    <span className="text-xs font-mono text-text-secondary">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-2xl font-display font-bold text-text-primary uppercase group-hover:text-brand-orange transition-colors">
                    {reason.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </AnimateInView>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
