import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Quote } from "lucide-react";
import { FOUNDER_CONTENT } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";

export function FounderSpotlightSection() {
  return (
    <SectionContainer darkSurface={true}>
      <div className="space-y-12">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-label font-semibold text-brand-orange">
            Leadership &amp; Expertise
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-h2 text-text-primary uppercase">
            Meet the Founder
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Portrait & Bio Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[4/5] w-full border-2 border-surface-border bg-background p-2 shadow-2xl">
              <div className="relative h-full w-full overflow-hidden bg-surface-dark">
                <Image
                  src="/images/javed-qureshi.jpg"
                  alt="Javed Ahmad Qureshi"
                  fill
                  className="object-cover object-top grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>

            <div className="border border-surface-border bg-background p-6 space-y-3">
              <h3 className="text-2xl font-bold text-text-primary">
                {FOUNDER_CONTENT.name}
              </h3>
              <p className="text-xs font-semibold text-brand-orange uppercase tracking-label">
                {FOUNDER_CONTENT.role}
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-brand-orange bg-brand-orange px-5 py-2.5 text-xs font-semibold uppercase tracking-cta text-background hover:bg-brand-amber transition-colors"
                >
                  <span>{FOUNDER_CONTENT.cta}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Detailed Biography Right Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4 text-base sm:text-lg text-text-secondary leading-relaxed">
              <p>{FOUNDER_CONTENT.p1}</p>
              <p>{FOUNDER_CONTENT.p2}</p>
              <p>{FOUNDER_CONTENT.p3}</p>
            </div>

            {/* Philosophy Box */}
            <div className="border-l-4 border-brand-orange bg-background p-6 space-y-2">
              <div className="flex items-center gap-2 text-brand-orange font-semibold text-xs uppercase tracking-label">
                <Quote className="h-4 w-4" />
                <span>Founding Philosophy</span>
              </div>
              <p className="text-base sm:text-lg font-medium text-text-primary italic">
                &ldquo;His philosophy is simple:{" "}
                <span className="text-brand-orange">
                  {FOUNDER_CONTENT.philosophy}
                </span>{" "}
                That philosophy is the foundation of Entrpryz.&rdquo;
              </p>
            </div>

            {/* Core Competencies */}
            <div className="space-y-4 pt-4 border-t border-surface-border">
              <h4 className="text-xs font-bold uppercase tracking-label text-brand-amber">
                Core Competencies
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FOUNDER_CONTENT.competencies.map((comp, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
