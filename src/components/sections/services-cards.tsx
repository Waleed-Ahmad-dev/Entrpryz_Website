import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Cpu, Code2, Server } from "lucide-react";
import { SERVICES } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { AnimateInView } from "@/components/ui/animate-in-view";

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
          <AnimateInView direction="up" delay={0.1}>
            <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-brand-orange border border-brand-orange/40 bg-surface-card px-4 py-1.5 rounded-full inline-block">
              [ COMPREHENSIVE CAPABILITIES ]
            </span>
          </AnimateInView>

          <AnimateInView direction="up" delay={0.2}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-h2 text-text-primary uppercase">
              What We Do
            </h2>
          </AnimateInView>

          <AnimateInView direction="up" delay={0.3}>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              End-to-end technology solutions built on enterprise experience and real-world business outcomes.
            </p>
          </AnimateInView>
        </div>

        {/* Asymmetric Bento Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {SERVICES.map((service, idx) => {
            const isLarge = idx === 0; // First service takes 8 columns in a 12-col grid
            return (
              <div
                key={service.id}
                className={isLarge ? "lg:col-span-8" : "lg:col-span-4"}
              >
                <AnimateInView direction="up" delay={0.1 * (idx + 1)} className="h-full">
                  <div className="doppelrand-card rounded-2xl overflow-hidden h-full flex flex-col justify-between group relative">
                    {/* Background Watermark Number */}
                    <div className="absolute top-4 right-6 text-7xl font-display font-extrabold text-surface-border/40 pointer-events-none select-none">
                      0{idx + 1}
                    </div>

                    {/* Image Banner */}
                    <div className="relative aspect-[21/9] w-full overflow-hidden bg-surface-dark scanline-overlay">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover opacity-65 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <div className="p-2.5 rounded-lg bg-background/90 backdrop-blur-md border border-surface-border">
                          {SERVICE_ICONS[idx]}
                        </div>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-2xl font-display font-bold text-text-primary uppercase group-hover:text-brand-orange transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-amber font-mono">
                          {service.subtitle}
                        </p>

                        <div className="pt-4 border-t border-surface-border">
                          <ul className={`grid gap-2.5 ${isLarge ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
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

                      <div className="pt-4 border-t border-surface-border">
                        <Link
                          href={service.ctaHref}
                          className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-full border border-brand-orange/60 bg-brand-orange/10 px-5 py-3 text-xs font-bold uppercase tracking-cta text-brand-orange transition-all duration-300 hover:bg-brand-orange hover:text-background"
                        >
                          <span>{service.ctaText}</span>
                          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </AnimateInView>
              </div>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
}
