import { Calendar, MapPin, Briefcase } from "lucide-react";
import { CAREER_TIMELINE } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";

export function CareerTimelineSection() {
  return (
    <SectionContainer darkSurface={false}>
      <div className="space-y-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 border border-brand-orange/40 bg-surface-card px-3.5 py-1 rounded-sm text-xs uppercase tracking-wider font-semibold text-brand-orange">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Career Track Record</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-text-primary uppercase leading-tight">
            Experience &amp; Project Portfolio
          </h2>

          <p className="text-base sm:text-lg text-text-secondary">
            A 25-year track record across ERP leadership, systems optimization, and enterprise technology.
          </p>
        </div>

        <div className="space-y-4">
          {CAREER_TIMELINE.map((item, idx) => (
            <div
              key={idx}
              className="border border-surface-border bg-surface-card p-6 md:p-8 hover:border-brand-orange transition-colors group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-display font-bold text-text-primary group-hover:text-brand-orange transition-colors">
                    {item.company}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-amber mt-1">
                    {item.role}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-text-secondary shrink-0">
                  <span className="flex items-center gap-1.5 bg-background border border-surface-border px-3 py-1">
                    <Calendar className="h-3.5 w-3.5 text-brand-orange" />
                    {item.period}
                  </span>
                  <span className="flex items-center gap-1.5 bg-background border border-surface-border px-3 py-1">
                    <MapPin className="h-3.5 w-3.5 text-brand-orange" />
                    {item.location}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm sm:text-base text-text-secondary leading-relaxed">
                {item.overview}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
