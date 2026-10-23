import { Mail, MapPin, MessageCircle } from "lucide-react";
import type { BlockOf } from "@/lib/content-schema";
import { SITE_CONTENT } from "@/lib/site-content";
import { ContactForm } from "@/components/contact/contact-form";
import { SectionBackground } from "@/components/ui/section-background";
import { Eyebrow } from "./section-parts";

export function ContactBlock({ block }: { block: BlockOf<"contact"> }) {
  const { email, form } = SITE_CONTENT.contact;
  const hasWhatsApp = !!SITE_CONTENT.site.whatsapp.number;

  return (
    <section className="border-b border-surface-border bg-background py-16 md:py-24 relative overflow-hidden">
      <SectionBackground glowStrength="medium" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="max-w-3xl space-y-5">
          {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-text-primary uppercase leading-tight">
            {block.heading}
          </h1>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">{block.body}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-surface-border bg-surface-card p-8 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xs uppercase tracking-wider font-bold text-brand-orange">{block.emailLabel}</h2>
                <a href={`mailto:${email}`} className="text-lg font-bold text-text-primary hover:text-brand-orange transition-colors inline-flex items-center gap-2 break-all">
                  <Mail className="h-4 w-4 text-brand-orange shrink-0" />
                  <span>{email}</span>
                </a>
              </div>
              <div className="space-y-1 border-t border-surface-border pt-6">
                <h2 className="text-xs uppercase tracking-wider font-bold text-brand-orange">{block.locationLabel}</h2>
                <p className="text-sm text-text-primary inline-flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                  <span>{block.location}</span>
                </p>
              </div>
              {block.note && hasWhatsApp && (
                <p className="text-xs text-text-secondary inline-flex items-start gap-2 border-t border-surface-border pt-6">
                  <MessageCircle className="h-4 w-4 text-brand-orange shrink-0" />
                  <span>{block.note}</span>
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 border border-surface-border bg-surface-card p-8 sm:p-10 space-y-6">
            <h2 className="text-xl font-display font-bold text-text-primary uppercase">{block.formHeading}</h2>
            <ContactForm copy={form} />
          </div>
        </div>
      </div>
    </section>
  );
}
