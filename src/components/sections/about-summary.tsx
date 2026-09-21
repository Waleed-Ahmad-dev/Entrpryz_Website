import Link from "next/link";
import { ArrowUpRight, Cpu, Code2, Server } from "lucide-react";
import { ABOUT_ENTRPRYZ } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";

const CORE_ICONS = [
  <Cpu key="cpu" className="h-7 w-7 text-brand-orange" />,
  <Code2 key="code" className="h-7 w-7 text-brand-orange" />,
  <Server key="server" className="h-7 w-7 text-brand-orange" />,
];

export function AboutSummarySection() {
  return (
    <SectionContainer darkSurface={true}>
      <div className="space-y-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-label font-semibold text-brand-orange">
            Enterprise Thinking • Practical Execution
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-h2 text-text-primary uppercase">
            {ABOUT_ENTRPRYZ.headline}
          </h2>
          <div className="space-y-4 text-text-secondary text-base sm:text-lg leading-relaxed pt-2">
            <p>{ABOUT_ENTRPRYZ.p1}</p>
            <p>{ABOUT_ENTRPRYZ.p2}</p>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm uppercase tracking-label font-semibold text-brand-amber">
            {ABOUT_ENTRPRYZ.coreAreasIntro}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ABOUT_ENTRPRYZ.coreAreas.map((area, idx) => (
              <div
                key={idx}
                className="border border-surface-border bg-background p-8 space-y-4 hover:border-brand-orange transition-all duration-300 group"
              >
                <div className="p-3 w-fit bg-surface-card border border-surface-border group-hover:border-brand-orange transition-colors">
                  {CORE_ICONS[idx]}
                </div>
                <h4 className="text-xl font-bold text-text-primary group-hover:text-brand-orange transition-colors">
                  {area.title}
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {area.description}
                </p>
                <div className="pt-2">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-cta text-brand-orange hover:text-brand-amber"
                  >
                    <span>Explore Scope</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
