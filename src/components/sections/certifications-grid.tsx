import { CERTIFICATIONS } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { GraduationCap } from "lucide-react";
import { AnimateInView } from "@/components/ui/animate-in-view";

export function CertificationsGridSection() {
  return (
    <SectionContainer darkSurface={false}>
      <div className="space-y-16">
        <div className="max-w-3xl space-y-4">
          <AnimateInView direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/40 bg-surface-card px-3.5 py-1 text-xs uppercase tracking-label font-mono font-semibold text-brand-orange">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Verified Knowledge &amp; Credentials</span>
            </div>
          </AnimateInView>

          <AnimateInView direction="up" delay={0.2}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-h2 text-text-primary uppercase">
              Certifications &amp; Training
            </h2>
          </AnimateInView>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CERTIFICATIONS.map((cert, idx) => (
            <AnimateInView key={idx} direction="up" delay={0.1 * (idx + 1)}>
              <div className="doppelrand-card rounded-2xl p-6 space-y-3 h-full">
                <h3 className="text-sm font-display font-bold text-brand-orange uppercase tracking-wider">
                  {cert.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed font-mono">
                  {cert.items}
                </p>
              </div>
            </AnimateInView>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
