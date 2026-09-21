import { HOW_WE_WORK } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { AnimateInView } from "@/components/ui/animate-in-view";
import { Workflow } from "lucide-react";

export function WorkflowStepsSection() {
  return (
    <SectionContainer darkSurface={true}>
      <div className="space-y-16">
        <div className="max-w-3xl space-y-4">
          <AnimateInView direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/40 bg-background px-3.5 py-1 text-xs uppercase tracking-label font-mono font-semibold text-brand-orange">
              <Workflow className="h-3.5 w-3.5" />
              <span>Structured Delivery Methodology</span>
            </div>
          </AnimateInView>

          <AnimateInView direction="up" delay={0.2}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-h2 text-text-primary uppercase leading-tight">
              {HOW_WE_WORK.headline}
            </h2>
          </AnimateInView>
        </div>

        {/* Process Blueprint Rail */}
        <div className="relative">
          {/* Top connecting line for desktop */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-surface-border z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
            {HOW_WE_WORK.steps.map((step, idx) => (
              <AnimateInView key={step.number} direction="up" delay={0.1 * (idx + 1)}>
                <div className="doppelrand-card rounded-2xl p-6 space-y-4 relative group h-full flex flex-col justify-between overflow-hidden">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="h-8 w-8 rounded-full bg-brand-orange/20 border border-brand-orange text-brand-orange font-mono font-bold text-xs flex items-center justify-center">
                        {step.number}
                      </span>
                      <span className="text-xs font-mono text-text-secondary uppercase">
                        PHASE 0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-xl font-display font-bold text-text-primary uppercase group-hover:text-brand-orange transition-colors">
                      {step.title}
                    </h3>

                    <p className="text-xs text-text-secondary leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Subtle index watermark */}
                  <div className="text-6xl font-display font-black text-surface-border/20 absolute -bottom-3 -right-2 pointer-events-none select-none">
                    {step.number}
                  </div>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
