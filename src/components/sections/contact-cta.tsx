import Link from "next/link";
import { ArrowUpRight, Mail, PhoneCall } from "lucide-react";
import { CONTACT_CONTENT } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";

export function ContactCTASection() {
  return (
    <SectionContainer darkSurface={false} borderBottom={false}>
      <div className="border border-brand-orange bg-surface-card p-8 sm:p-12 md:p-16 relative overflow-hidden text-center max-w-5xl mx-auto shadow-2xl">
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 border border-brand-orange/40 bg-background px-4 py-1.5 text-xs uppercase tracking-label font-semibold text-brand-orange">
            <PhoneCall className="h-3.5 w-3.5" />
            <span>Start A Conversation</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-h2 text-text-primary uppercase leading-tight">
            {CONTACT_CONTENT.headline}
          </h2>

          <p className="text-base sm:text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {CONTACT_CONTENT.body}
          </p>

          <p className="text-sm uppercase tracking-label font-bold text-brand-amber">
            {CONTACT_CONTENT.tagline}
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-brand-orange px-8 py-4 text-xs font-semibold uppercase tracking-cta text-background hover:bg-brand-amber transition-all shadow-lg active:scale-95"
            >
              <span>{CONTACT_CONTENT.cta}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href={`mailto:${CONTACT_CONTENT.contacts.general}`}
              className="inline-flex items-center justify-center gap-2 border border-surface-border bg-background px-8 py-4 text-xs font-semibold uppercase tracking-cta text-text-primary hover:border-brand-orange hover:text-brand-orange transition-all"
            >
              <Mail className="h-4 w-4 text-brand-orange" />
              <span>{CONTACT_CONTENT.contacts.general}</span>
            </a>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
