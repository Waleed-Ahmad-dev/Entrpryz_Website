import Link from "next/link";
import { ArrowUpRight, Briefcase, Calendar, MapPin } from "lucide-react";
import { CAREER_TIMELINE } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";

export function CareerTimelineSection() {
  return (
    <SectionContainer darkSurface={false}>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-surface-border pb-8">
          <div className="space-y-4 max-w-3xl">
            <span className="text-xs uppercase tracking-label font-semibold text-brand-orange">
              Executive Career Leadership
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-h2 text-text-primary uppercase">
              Experience &amp; Project Portfolio
            </h2>
            <p className="text-base sm:text-lg text-text-secondary">
              A 25-year track record across ERP leadership, digital transformation, and enterprise technology governance.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 border border-brand-orange bg-brand-orange px-6 py-3 text-xs font-semibold uppercase tracking-cta text-background hover:bg-brand-amber transition-colors shrink-0"
          >
            <span>View Full Portfolio Page →</span>
          </Link>
        </div>

        {/* Timeline Stack */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-8 before:w-0.5 before:bg-surface-border">
          {CAREER_TIMELINE.map((item, idx) => (
            <div
              key={idx}
              className="relative pl-10 md:pl-16 space-y-4 group"
            >
              {/* Timeline Marker */}
              <div className="absolute left-2 md:left-6 top-1.5 h-4 w-4 rounded-full border-2 border-brand-orange bg-background group-hover:bg-brand-orange transition-colors" />

              <div className="border border-surface-border bg-surface-card p-6 md:p-8 space-y-4 hover:border-brand-orange transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-surface-border pb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-text-primary group-hover:text-brand-orange transition-colors">
                      {item.company}
                    </h3>
                    <p className="text-sm font-semibold text-brand-amber">
                      {item.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-brand-orange" />
                      {item.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-brand-orange" />
                      {item.location}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-medium text-text-primary leading-relaxed">
                  {item.overview}
                </p>

                <ul className="space-y-2 pt-2">
                  {item.highlights.map((h, hIdx) => (
                    <li
                      key={hIdx}
                      className="text-xs md:text-sm text-text-secondary pl-4 relative before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:bg-brand-orange"
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
