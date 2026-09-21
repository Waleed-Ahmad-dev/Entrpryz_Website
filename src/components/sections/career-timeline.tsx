import Link from "next/link";
import { ArrowUpRight, Calendar, MapPin, Briefcase } from "lucide-react";
import { CAREER_TIMELINE } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";

export function CareerTimelineSection() {
  return (
    <SectionContainer darkSurface={false}>
      <div className="space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-surface-border pb-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 border border-brand-orange/40 bg-surface-card px-3.5 py-1 text-xs uppercase tracking-wider font-semibold text-brand-orange">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Executive Career Track Record</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-text-primary uppercase leading-tight">
              Experience &amp; Project Portfolio
            </h2>

            <p className="text-base sm:text-lg text-text-secondary">
              A 25-year track record across ERP leadership, systems optimization, and enterprise technology governance.
            </p>
          </div>

          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 bg-brand-orange px-6 py-3 text-xs font-bold uppercase tracking-widest text-background hover:bg-brand-amber transition-colors shrink-0"
          >
            <span>View Full Portfolio Page</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Timeline Stack */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-8 before:w-0.5 before:bg-surface-border">
          {CAREER_TIMELINE.map((item, idx) => (
            <div key={idx} className="relative pl-10 md:pl-16 space-y-4 group">
              {/* Timeline Marker */}
              <div className="absolute left-2 md:left-6 top-6 h-4 w-4 border-2 border-brand-orange bg-background group-hover:bg-brand-orange transition-colors" />

              <div className="border border-surface-border bg-surface-card p-6 md:p-8 space-y-6 hover:border-brand-orange transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-surface-border pb-4">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-text-primary group-hover:text-brand-orange transition-colors">
                      {item.company}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-amber">
                      {item.role}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-text-secondary">
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

                <p className="text-xs sm:text-sm font-medium text-text-primary leading-relaxed">
                  {item.overview}
                </p>

                <ul className="space-y-2 pt-2 border-t border-surface-border">
                  {item.highlights.map((h, hIdx) => (
                    <li
                      key={hIdx}
                      className="text-xs sm:text-sm text-text-secondary pl-4 relative before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:bg-brand-orange"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
