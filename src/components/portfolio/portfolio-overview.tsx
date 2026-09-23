import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Award, ArrowUpRight } from "lucide-react";
import {
  PORTFOLIO_TIERS,
  PORTFOLIO_ACHIEVEMENTS,
  PORTFOLIO_CTA,
} from "@/lib/portfolio-data";
import { SectionContainer } from "@/components/layout/section-container";

export function PortfolioOverviewSection() {
  return (
    <SectionContainer darkSurface={false}>
      <div className="space-y-20">
        <div className="space-y-4 max-w-3xl">
          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-text-primary uppercase leading-tight">
            25 Years of Delivery. 40+ Organizations.
          </h2>
          <p className="text-base sm:text-lg text-text-secondary">
            Every recommendation Entrpryz makes is grounded in work we have actually delivered — not theory. Below is the real track record behind the company.
          </p>
        </div>

        {/* Tier Sections */}
        {PORTFOLIO_TIERS.map((tier) => (
          <div key={tier.id} className="space-y-8">
            <div className="space-y-3 border-b border-surface-border pb-4">
              <h3 className="text-xl sm:text-2xl font-display font-bold text-text-primary uppercase">
                {tier.title}
              </h3>
              <p className="text-sm text-brand-amber italic border-l-2 border-brand-orange pl-4">
                {tier.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tier.featured.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-surface-border bg-surface-card p-6 space-y-4 flex flex-col justify-between hover:border-brand-orange transition-colors group"
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
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-lg font-display font-bold text-text-primary group-hover:text-brand-orange transition-colors">
                        {item.client}
                      </h4>
                      {item.location && (
                        <span className="text-[10px] font-mono text-brand-orange bg-background px-2 py-0.5 border border-surface-border shrink-0">
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

                    {item.status && (
                      <div className="inline-block border border-brand-orange/40 text-brand-orange px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
                        {item.status}
                      </div>
                    )}

                    <p className="text-xs text-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Achievements Strip */}
        <div className="border border-surface-border bg-surface-card p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-surface-border pb-4">
            <Award className="h-5 w-5 text-brand-orange" />
            <h3 className="text-xs uppercase tracking-wider font-bold text-text-primary">
              Key Achievements
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PORTFOLIO_ACHIEVEMENTS.map((achievement, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs text-text-secondary"
              >
                <span className="text-brand-orange font-bold shrink-0 mt-0.5">
                  &bull;
                </span>
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <p className="text-lg sm:text-xl font-display font-bold text-text-primary uppercase">
            {PORTFOLIO_CTA.headline}
          </p>
          <Link
            href={PORTFOLIO_CTA.buttonHref}
            className="inline-flex items-center gap-2 bg-brand-orange px-8 py-4 rounded-md text-xs font-bold uppercase tracking-widest text-background hover:bg-brand-amber transition-colors active:scale-95"
          >
            <span>{PORTFOLIO_CTA.buttonText}</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </SectionContainer>
  );
}
