import Link from "next/link";
import { ArrowUpRight, Mail, PhoneCall } from "lucide-react";
import { CONTACT_CONTENT } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { AnimateInView } from "@/components/ui/animate-in-view";

export function ContactCTASection() {
  return (
    <SectionContainer darkSurface={false} borderBottom={false}>
      <AnimateInView direction="up" delay={0.1}>
        <div className="doppelrand-card rounded-3xl p-8 sm:p-14 md:p-16 relative overflow-hidden text-center max-w-5xl mx-auto shadow-2xl">
          {/* Top thick orange bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-orange via-brand-amber to-brand-orange" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/40 bg-background px-4 py-1.5 text-xs uppercase tracking-label font-mono font-semibold text-brand-orange">
              <span className="h-2 w-2 rounded-full bg-brand-orange animate-pulse" />
              <span>Direct Executive Engagement</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-display font-extrabold tracking-h2 text-text-primary uppercase leading-tight">
              {CONTACT_CONTENT.headline}
            </h2>

            <p className="text-base sm:text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
              {CONTACT_CONTENT.body}
            </p>

            <p className="text-xs font-mono uppercase tracking-widest font-bold text-brand-amber">
              {CONTACT_CONTENT.tagline}
            </p>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-orange px-8 py-4 text-xs font-bold uppercase tracking-cta text-background hover:bg-brand-amber transition-all shadow-xl shadow-brand-orange/20 active:scale-95"
              >
                <span>{CONTACT_CONTENT.cta}</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background/20 text-background transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <a
                href={`mailto:${CONTACT_CONTENT.contacts.general}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-surface-border bg-background px-8 py-4 text-xs font-semibold uppercase tracking-cta text-text-primary hover:border-brand-orange hover:text-brand-orange transition-all"
              >
                <Mail className="h-4 w-4 text-brand-orange" />
                <span>{CONTACT_CONTENT.contacts.general}</span>
              </a>
            </div>
          </div>
        </div>
      </AnimateInView>
    </SectionContainer>
  );
}
