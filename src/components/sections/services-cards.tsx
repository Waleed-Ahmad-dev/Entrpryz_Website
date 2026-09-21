import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { SERVICES } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";

export function ServicesCardsSection() {
  return (
    <SectionContainer darkSurface={false}>
      <div className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-label font-semibold text-brand-orange">
            Comprehensive Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-h2 text-text-primary uppercase">
            What We Do
          </h2>
          <p className="text-base sm:text-lg text-text-secondary">
            End-to-end technology solutions built on enterprise experience and real-world business outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="border border-surface-border bg-surface-card flex flex-col justify-between overflow-hidden group hover:border-brand-orange transition-all duration-300"
            >
              {/* Image Banner */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-dark">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent" />
              </div>

              {/* Body Content */}
              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-text-primary uppercase group-hover:text-brand-orange transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm font-semibold text-brand-amber">
                    {service.subtitle}
                  </p>
                  
                  <ul className="mt-6 space-y-2.5 pt-4 border-t border-surface-border">
                    {service.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-text-secondary">
                        <Check className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-surface-border">
                  <Link
                    href={service.ctaHref}
                    className="inline-flex w-full items-center justify-center gap-2 border border-brand-orange bg-brand-orange/10 px-5 py-3 text-xs font-semibold uppercase tracking-cta text-brand-orange transition-all hover:bg-brand-orange hover:text-background"
                  >
                    <span>{service.ctaText}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
