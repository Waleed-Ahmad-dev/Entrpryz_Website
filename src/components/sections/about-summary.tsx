import Link from "next/link";
import { ArrowUpRight, Cpu, Code2, Server } from "lucide-react";
import { ABOUT_ENTRPRYZ } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";

const CORE_ICONS = [
  <Cpu key="cpu" className="h-6 w-6 text-brand-orange" />,
  <Code2 key="code" className="h-6 w-6 text-brand-orange" />,
  <Server key="server" className="h-6 w-6 text-brand-orange" />,
];

export function AboutSummarySection() {
  return (
    <SectionContainer darkSurface={true}>
      <div className="space-y-16">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-brand-orange border border-brand-orange/40 bg-background px-3 py-1 inline-block">
            Business-First Thinking &bull; Practical Execution
          </span>

          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-text-primary uppercase leading-tight">
            {ABOUT_ENTRPRYZ.headline}
          </h2>

          <div className="space-y-4 text-text-secondary text-base sm:text-lg leading-relaxed pt-2">
            <p>{ABOUT_ENTRPRYZ.p1}</p>
            <p>{ABOUT_ENTRPRYZ.p2}</p>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-amber">
            {ABOUT_ENTRPRYZ.coreAreasIntro}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ABOUT_ENTRPRYZ.coreAreas.map((area, idx) => (
              <div
                key={idx}
                className="border border-surface-border bg-background p-8 space-y-6 flex flex-col justify-between hover:border-brand-orange transition-colors group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-surface-card border border-surface-border group-hover:border-brand-orange transition-colors">
                      {CORE_ICONS[idx]}
                    </div>
                    <span className="text-xs font-mono font-bold text-text-secondary">
                      0{idx + 1}
                    </span>
                  </div>

                  <h4 className="text-xl font-display font-bold text-text-primary group-hover:text-brand-orange transition-colors">
                    {area.title}
                  </h4>

                  <p className="text-sm text-text-secondary leading-relaxed">
                    {area.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-surface-border">
                  <Link
                    href="#services"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange hover:text-brand-amber transition-colors"
                  >
                    <span>Explore Scope</span>
                    <ArrowUpRight className="h-4 w-4" />
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
