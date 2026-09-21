import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Cpu, Code2, Server } from "lucide-react";
import { SERVICES, HOW_WE_WORK } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { SectionBackground } from "@/components/ui/section-background";

export const metadata = {
  title: "Services & Capabilities — Entrpryz",
  description:
    "ERP & Systems Advisory, Software Engineering, and IT Infrastructure & Security services for enterprises.",
};

const SERVICE_ICONS = [
  <Cpu key="cpu" className="h-8 w-8 text-brand-orange" />,
  <Code2 key="code" className="h-8 w-8 text-brand-orange" />,
  <Server key="server" className="h-8 w-8 text-brand-orange" />,
];

const SERVICE_BACKGROUNDS = [
  "/images/bg-analytics.jpg",
  "/images/bg-code.jpg",
  "/images/bg-server.jpg",
];

export default function ServicesPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="border-b border-surface-border bg-background py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image
            src="/images/bg-hero-tech.jpg"
            alt=""
            fill
            className="object-cover object-center opacity-45"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/55 to-background" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          <span className="text-xs uppercase tracking-wider font-semibold text-brand-orange border border-brand-orange/40 bg-surface-card px-4 py-1.5 inline-block">
            Core Capabilities
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-text-primary uppercase leading-tight max-w-4xl mx-auto">
            What We Do
          </h1>
          <p className="text-base sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Senior-level enterprise expertise delivered with strict focus on your operating model, financial controls, and system reliability.
          </p>
        </div>
      </section>

      {/* Detailed Services Sections */}
      <div className="space-y-20">
        {SERVICES.map((service, idx) => (
          <div key={service.id} id={service.id} className="relative overflow-hidden">
            <SectionBackground src={SERVICE_BACKGROUNDS[idx % SERVICE_BACKGROUNDS.length]} />
            <div className={`relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border border-surface-border p-8 sm:p-12 ${
              idx % 2 === 1 ? "bg-surface-card/90" : "bg-background/90"
            }`}>
            <div className={`lg:col-span-7 space-y-6 ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
              <div className="p-3 w-fit bg-surface-card border border-surface-border">
                {SERVICE_ICONS[idx]}
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold text-text-primary uppercase">
                  {service.title}
                </h2>
                <p className="text-lg font-semibold text-brand-amber">
                  {service.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-surface-border">
                {service.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href={service.ctaHref}
                  className="inline-flex items-center gap-2 bg-brand-orange px-6 py-3 text-xs font-bold uppercase tracking-widest text-background hover:bg-brand-amber transition-colors"
                >
                  <span>{service.ctaText}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className={`lg:col-span-5 ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
              <div className="relative aspect-[4/3] w-full border border-surface-border bg-surface-dark overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover opacity-70 hover:opacity-90 transition-opacity"
                />
              </div>
            </div>
          </div>
          </div>
        ))}
      </div>

      {/* Delivery Process */}
      <SectionContainer darkSurface={true} backgroundImage="/images/bg-workspace.jpg">
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-brand-orange border border-brand-orange/40 bg-background px-3.5 py-1 inline-block">
              Engagement Methodology
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-text-primary uppercase">
              {HOW_WE_WORK.headline}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {HOW_WE_WORK.steps.map((step) => (
              <div
                key={step.number}
                className="border border-surface-border bg-background p-6 space-y-3"
              >
                <span className="text-3xl font-display font-bold text-brand-orange">
                  {step.number}
                </span>
                <h3 className="text-base font-display font-bold text-text-primary uppercase">
                  {step.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}