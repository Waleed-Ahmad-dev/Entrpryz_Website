import { HOW_WE_WORK } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";

export function WorkflowStepsSection() {
  return (
    <SectionContainer darkSurface={true}>
      <div className="space-y-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-label font-semibold text-brand-orange">
            Structured Delivery Methodology
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-h2 text-text-primary uppercase leading-tight">
            {HOW_WE_WORK.headline}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {HOW_WE_WORK.steps.map((step) => (
            <div
              key={step.number}
              className="border border-surface-border bg-background p-6 space-y-4 relative group hover:border-brand-orange transition-all duration-300"
            >
              <div className="text-4xl font-bold text-brand-orange tracking-tight font-sans">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-text-primary uppercase group-hover:text-brand-orange transition-colors">
                {step.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
