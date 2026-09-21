import Image from "next/image";
import { ExternalLink, Layers } from "lucide-react";
import { PORTFOLIO_TIERS } from "@/lib/portfolio-data";
import { EngagementFilterGrid } from "./engagement-filter-grid";
import { SectionBackground } from "@/components/ui/section-background";

export function Tier3CroweSection() {
  const tier = PORTFOLIO_TIERS[2];

  return (
    <div className="border border-surface-border bg-background/85 backdrop-blur-md p-6 sm:p-10 md:p-12 relative overflow-hidden">
      <SectionBackground />
      <div className="relative z-10 space-y-12">
      {/* Tier Flag Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 bg-surface-border border border-brand-orange/50 px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider text-brand-amber">
          <Layers className="h-3.5 w-3.5 text-brand-orange" />
          <span>Tier 3 — Enterprise Executive Track Record</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-text-primary uppercase">
          {tier.title}
        </h2>
        <p className="text-base text-text-secondary font-medium italic border-l-2 border-brand-orange/60 pl-4">
          {tier.subtitle}
        </p>
      </div>

      {/* Featured Case Studies */}
      <div className="space-y-6">
        <h3 className="text-xs uppercase tracking-wider font-bold text-text-primary border-b border-surface-border pb-2">
          Featured SAP Business One &amp; Post-Implementation Reviews
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tier.featured.map((item, idx) => (
            <div
              key={idx}
              className="border border-surface-border bg-background p-6 space-y-4 flex flex-col justify-between hover:border-brand-orange transition-colors group"
            >
              {item.image && (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-dark border border-surface-border">
                  <Image
                    src={item.image}
                    alt={item.client}
                    fill
                    className="object-cover opacity-75 group-hover:opacity-95 transition-opacity"
                  />
                </div>
              )}

              <div className="space-y-3 flex-1">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-display font-bold text-text-primary group-hover:text-brand-orange transition-colors">
                      {item.client}
                    </h4>
                    {item.location && (
                      <span className="text-xs font-mono text-brand-orange bg-surface-card px-2 py-0.5 border border-surface-border">
                        {item.location}
                      </span>
                    )}
                  </div>
                  {item.website && (
                    <a
                      href={`https://${item.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-brand-amber hover:underline font-mono"
                    >
                      <span>{item.website}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                <p className="text-xs text-text-secondary leading-relaxed pt-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Crowe SAP B1 Engagements */}
      <div className="space-y-6 pt-6 border-t border-surface-border">
        <h3 className="text-xs uppercase tracking-wider font-bold text-text-primary">
          Additional SAP Business One &amp; Advisory Engagements (50+ Deployments)
        </h3>
        <EngagementFilterGrid engagements={tier.additional} defaultPlatformFilter="SAP Business One" />
      </div>
      </div>
    </div>
  );
}
