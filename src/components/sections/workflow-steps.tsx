import { HOW_WE_WORK } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { Workflow } from "lucide-react";

export function WorkflowStepsSection() {
  return (
    <SectionContainer darkSurface={true}>
      <div className="space-y-16">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 border border-brand-orange/40 bg-background px-3.5 py-1 rounded-sm text-xs uppercase tracking-wider font-semibold text-brand-orange">
            <Workflow className="h-3.5 w-3.5" />
            <span>Structured Engagement Methodology</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-text-primary uppercase leading-tight">
            {HOW_WE_WORK.headline}
          </h2>
        </div>

        {/* 5-Step Process Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {HOW_WE_WORK.steps.map((step) => (
            <div
              key={step.number}
              className="border border-surface-border bg-background p-6 space-y-4 relative flex flex-col justify-between hover:border-brand-orange transition-colors group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-surface-border pb-3">
                  <span className="text-2xl font-display font-bold text-brand-orange font-mono">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-mono text-text-secondary uppercase">
                    PHASE {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-display font-bold text-text-primary uppercase group-hover:text-brand-orange transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
