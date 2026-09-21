import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Quote, UserCheck } from "lucide-react";
import { FOUNDER_CONTENT } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";

export function FounderSpotlightSection() {
  return (
    <SectionContainer darkSurface={true} backgroundImage="/images/bg-team.jpg">
      <div className="space-y-16">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 border border-brand-orange/40 bg-background px-3.5 py-1 text-xs uppercase tracking-wider font-semibold text-brand-orange">
            <UserCheck className="h-3.5 w-3.5" />
            <span>Executive Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-text-primary uppercase">
            Meet the Founder
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Portrait & Bio Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative border border-surface-border bg-background p-3 shadow-xl">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-dark">
                <Image
                  src="/images/javed-qureshi.jpg"
                  alt="Javed Ahmad Qureshi"
                  fill
                  className="object-cover object-top filter grayscale contrast-110 hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>

            <div className="border border-surface-border bg-background p-6 space-y-3">
              <h3 className="text-2xl font-display font-bold text-text-primary">
                {FOUNDER_CONTENT.name}
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-orange">
                {FOUNDER_CONTENT.role}
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-brand-orange px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-background hover:bg-brand-amber transition-colors"
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
            <div className="border border-surface-border bg-background p-6 space-y-2 relative">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-orange" />
              <div className="flex items-center gap-2 text-brand-orange font-semibold text-xs uppercase tracking-wider">
                <Quote className="h-4 w-4" />
                <span>Founding Philosophy</span>
              </div>
              <p className="text-base sm:text-lg font-display font-semibold text-text-primary italic">
                &ldquo;His philosophy is simple:{" "}
                <span className="text-brand-orange">
                  {FOUNDER_CONTENT.philosophy}
                </span>{" "}
                That philosophy is the foundation of Entrpryz.&rdquo;
              </p>
            </div>

            {/* Core Competencies */}
            <div className="space-y-4 pt-4 border-t border-surface-border">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-brand-amber">
                Core Executive Competencies
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FOUNDER_CONTENT.competencies.map((comp, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-text-secondary">
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
