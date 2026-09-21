import { CERTIFICATIONS } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { GraduationCap } from "lucide-react";

export function CertificationsGridSection() {
  return (
    <SectionContainer darkSurface={false}>
      <div className="space-y-16">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 border border-brand-orange/40 bg-surface-card px-3.5 py-1 text-xs uppercase tracking-wider font-semibold text-brand-orange">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Credentials &amp; Training</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-text-primary uppercase">
            Certifications &amp; Training
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CERTIFICATIONS.map((cert, idx) => (
            <div
              key={idx}
              className="border border-surface-border bg-surface-card p-6 space-y-2 hover:border-brand-orange transition-colors"
            >
              <h3 className="text-sm font-display font-bold text-brand-orange uppercase tracking-wider">
                {cert.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {cert.items}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
