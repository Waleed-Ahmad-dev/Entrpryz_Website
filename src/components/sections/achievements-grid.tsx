import { NOTABLE_ACHIEVEMENTS } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { Trophy } from "lucide-react";

export function AchievementsGridSection() {
  return (
    <SectionContainer darkSurface={true}>
      <div className="space-y-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-label font-semibold text-brand-orange">
            <Trophy className="h-4 w-4" />
            <span>Track Record Milestones</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-h2 text-text-primary uppercase">
            Notable Achievements
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NOTABLE_ACHIEVEMENTS.map((ach, idx) => (
            <div
              key={idx}
              className="border border-surface-border bg-background p-6 space-y-3 relative group hover:border-brand-orange transition-all duration-300"
            >
              <div className="text-xs font-mono font-bold text-brand-orange">
                0{idx + 1}
              </div>
              <p className="text-sm text-text-primary font-medium leading-relaxed">
                {ach}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
