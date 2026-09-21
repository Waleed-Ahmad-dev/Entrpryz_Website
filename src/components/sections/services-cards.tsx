import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Cpu, Code2, Server } from "lucide-react";
import { SERVICES } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";

const SERVICE_ICONS = [
  <Cpu key="cpu" className="h-6 w-6 text-brand-orange" />,
  <Code2 key="code" className="h-6 w-6 text-brand-orange" />,
  <Server key="server" className="h-6 w-6 text-brand-orange" />,
];

export function ServicesCardsSection() {
  return (
    <SectionContainer darkSurface={false}>
      <div className="space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-brand-orange border border-brand-orange/40 bg-surface-card px-3.5 py-1 inline-block">
            Core Capabilities
          </span>

          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-text-primary uppercase">
            What We Do
          </h2>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            Targeted technology advisory and engineering built on 25+ years of enterprise execution.
          </p>
        </div>

        {/* Structured 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, idx) => (
            <div
              key={service.id}
              className="border border-surface-border bg-surface-card flex flex-col justify-between overflow-hidden hover:border-brand-orange transition-colors group"
            >
              <div>
                {/* Image Banner */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-dark border-b border-surface-border">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 p-2.5 bg-background border border-surface-border">
                    {SERVICE_ICONS[idx]}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-8 space-y-4">
                  <div>
                    <h3 className="text-xl font-display font-bold text-text-primary uppercase group-hover:text-brand-orange transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-amber mt-1">
                      {service.subtitle}
                    </p>
                  </div>

                  <ul className="space-y-2.5 pt-4 border-t border-surface-border">
                    {service.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-text-secondary"
                      >
                        <Check className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0">
                <Link
                  href={service.ctaHref}
                  className="inline-flex w-full items-center justify-center gap-2 border border-brand-orange bg-brand-orange/10 px-5 py-3 text-xs font-bold uppercase tracking-wider text-brand-orange transition-colors hover:bg-brand-orange hover:text-background"
                >
                  <span>{service.ctaText}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
