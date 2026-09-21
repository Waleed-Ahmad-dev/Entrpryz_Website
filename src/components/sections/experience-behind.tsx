import { EXPERIENCE_BEHIND } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { AnimateInView } from "@/components/ui/animate-in-view";

export function ExperienceBehindSection() {
  return (
    <SectionContainer darkSurface={false}>
      <div className="max-w-5xl mx-auto space-y-12">
        <AnimateInView direction="up" delay={0.1}>
          <div className="text-center space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-brand-orange border border-brand-orange/40 bg-surface-card px-4 py-1.5 rounded-full inline-block">
              [ PROVEN FOUNDATION ]
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-h2 text-text-primary uppercase leading-tight">
              {EXPERIENCE_BEHIND.headline}
            </h2>
          </div>
        </AnimateInView>

        {/* Narrative Block with High-Contrast Highlight */}
        <AnimateInView direction="up" delay={0.2}>
          <div className="doppelrand-card rounded-2xl p-8 sm:p-10 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-brand-orange" />
            
            <p className="text-xl sm:text-2xl font-display font-semibold text-text-primary leading-snug">
              &ldquo;{EXPERIENCE_BEHIND.p1}&rdquo;
            </p>

            <div className="space-y-4 text-sm sm:text-base text-text-secondary leading-relaxed pt-2 border-t border-surface-border">
              <p>{EXPERIENCE_BEHIND.p2}</p>
              <p>{EXPERIENCE_BEHIND.p3}</p>
            </div>
          </div>
        </AnimateInView>

        {/* 4 Grid Stats */}
        <AnimateInView direction="up" delay={0.3}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {EXPERIENCE_BEHIND.stats.map((stat, idx) => (
              <div
                key={idx}
                className="doppelrand-card rounded-xl p-6 space-y-2 text-center group hover:border-brand-orange transition-all duration-300"
              >
                <p className="text-3xl sm:text-4xl font-display font-extrabold text-brand-orange tracking-tight group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </p>
                <p className="text-[11px] font-mono font-semibold text-text-secondary uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </AnimateInView>

        {/* Highlight Banner */}
        <AnimateInView direction="up" delay={0.4}>
          <div className="rounded-xl border border-brand-orange/50 bg-brand-orange/10 p-5 text-center shadow-lg">
            <p className="text-base sm:text-lg font-display font-bold text-text-primary uppercase tracking-wider flex items-center justify-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0" />
              <span>{EXPERIENCE_BEHIND.footer}</span>
            </p>
          </div>
        </AnimateInView>
      </div>
    </SectionContainer>
  );
}
