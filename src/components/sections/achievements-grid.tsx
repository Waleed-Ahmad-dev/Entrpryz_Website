import { NOTABLE_ACHIEVEMENTS } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { Trophy } from "lucide-react";
import { AnimateInView } from "@/components/ui/animate-in-view";

export function AchievementsGridSection() {
  return (
    <SectionContainer darkSurface={true}>
      <div className="space-y-16">
        <div className="max-w-3xl space-y-4">
          <AnimateInView direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/40 bg-background px-3.5 py-1 text-xs uppercase tracking-label font-mono font-semibold text-brand-orange">
              <Trophy className="h-3.5 w-3.5" />
              <span>Track Record Milestones</span>
            </div>
          </AnimateInView>

          <AnimateInView direction="up" delay={0.2}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-h2 text-text-primary uppercase">
              Notable Achievements
            </h2>
          </AnimateInView>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NOTABLE_ACHIEVEMENTS.map((ach, idx) => (
            <AnimateInView key={idx} direction="up" delay={0.1 * (idx + 1)}>
              <div className="doppelrand-card rounded-2xl p-6 space-y-4 h-full flex flex-col justify-between group">
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-brand-orange bg-background border border-surface-border px-2.5 py-1 rounded-md inline-block">
                    [ 0{idx + 1} ]
                  </span>
                  <p className="text-xs sm:text-sm text-text-primary font-medium leading-relaxed pt-2">
                    {ach}
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
