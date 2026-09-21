import Link from "next/link";
import { ArrowUpRight, Cpu, Code2, Server, Terminal } from "lucide-react";
import { ABOUT_ENTRPRYZ } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { AnimateInView } from "@/components/ui/animate-in-view";

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
          <AnimateInView direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/40 bg-background px-3.5 py-1 text-xs uppercase tracking-label font-mono font-semibold text-brand-orange">
              <Terminal className="h-3.5 w-3.5" />
              <span>Enterprise Thinking &bull; Practical Execution</span>
            </div>
          </AnimateInView>

          <AnimateInView direction="up" delay={0.2}>
            <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-h2 text-text-primary uppercase leading-tight">
              {ABOUT_ENTRPRYZ.headline}
            </h2>
          </AnimateInView>

          <AnimateInView direction="up" delay={0.3}>
            <div className="space-y-4 text-text-secondary text-base sm:text-lg leading-relaxed pt-2">
              <p>{ABOUT_ENTRPRYZ.p1}</p>
              <p>{ABOUT_ENTRPRYZ.p2}</p>
            </div>
          </AnimateInView>
        </div>

        <div className="space-y-8">
          <AnimateInView direction="up" delay={0.1}>
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-amber flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
              {ABOUT_ENTRPRYZ.coreAreasIntro}
            </h3>
          </AnimateInView>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ABOUT_ENTRPRYZ.coreAreas.map((area, idx) => (
              <AnimateInView key={idx} direction="up" delay={0.1 * (idx + 1)}>
                <div className="doppelrand-card rounded-2xl p-8 space-y-6 flex flex-col justify-between h-full group">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3.5 rounded-xl bg-background border border-surface-border group-hover:border-brand-orange transition-colors">
                        {CORE_ICONS[idx]}
                      </div>
                      <span className="text-xs font-mono font-bold text-text-secondary">
                        0{idx + 1}
                      </span>
                    </div>

                    <h4 className="text-2xl font-display font-bold text-text-primary group-hover:text-brand-orange transition-colors">
                      {area.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {area.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-surface-border">
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-cta text-brand-orange hover:text-brand-amber transition-colors group-hover:translate-x-1 duration-300"
                    >
                      <span>Explore Scope</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
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
