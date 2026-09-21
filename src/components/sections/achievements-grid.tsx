import { NOTABLE_ACHIEVEMENTS } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { Trophy } from "lucide-react";

export function AchievementsGridSection() {
  return (
    <SectionContainer darkSurface={true} backgroundImage="/images/bg-security.jpg">
      <div className="space-y-16">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 border border-brand-orange/40 bg-background px-3.5 py-1 text-xs uppercase tracking-wider font-semibold text-brand-orange">
            <Trophy className="h-3.5 w-3.5" />
            <span>Track Record Milestones</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-text-primary uppercase">
            Notable Achievements
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NOTABLE_ACHIEVEMENTS.map((ach, idx) => (
            <div
              key={idx}
              className="border border-surface-border bg-background p-6 space-y-3 flex flex-col justify-between hover:border-brand-orange transition-colors group"
            >
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-brand-orange">
                  0{idx + 1}.
                </span>
                <p className="text-xs sm:text-sm text-text-primary font-medium leading-relaxed">
                  {ach}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
