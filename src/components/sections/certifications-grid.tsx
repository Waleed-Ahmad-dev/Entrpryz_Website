import { CERTIFICATIONS } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { GraduationCap } from "lucide-react";

export function CertificationsGridSection() {
  return (
    <SectionContainer darkSurface={false}>
      <div className="space-y-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-label font-semibold text-brand-orange">
            <GraduationCap className="h-4 w-4" />
            <span>Verified Knowledge &amp; Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-h2 text-text-primary uppercase">
            Certifications &amp; Professional Training
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CERTIFICATIONS.map((cert, idx) => (
            <div
              key={idx}
              className="border border-surface-border bg-surface-card p-6 space-y-2 hover:border-brand-orange transition-all duration-300"
            >
              <h3 className="text-base font-bold text-brand-orange uppercase tracking-wider">
                {cert.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {cert.items}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
