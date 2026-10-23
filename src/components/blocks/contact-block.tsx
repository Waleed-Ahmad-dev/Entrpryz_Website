import { Mail, MapPin, MessageCircle } from "lucide-react";
import type { BlockOf } from "@/lib/content-schema";
import { SITE_CONTENT } from "@/lib/site-content";
import { ContactForm } from "@/components/contact/contact-form";
import { SectionBackground } from "@/components/ui/section-background";
import { Eyebrow } from "./section-parts";

function InfoRow({ icon: Icon, label, children }: { icon: typeof Mail; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange ring-1 ring-inset ring-brand-orange/20" aria-hidden="true">
        <Icon className="h-5 w-5" />
      </span>
      <div className="space-y-1 min-w-0">
        <h2 className="text-sm text-text-secondary">{label}</h2>
        {children}
      </div>
    </div>
  );
}

export function ContactBlock({ block }: { block: BlockOf<"contact"> }) {
  const { email, form } = SITE_CONTENT.contact;
  const hasWhatsApp = !!SITE_CONTENT.site.whatsapp.number;

  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-24 md:pt-24">
      <SectionBackground glowStrength="medium" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="max-w-3xl space-y-6">
          {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-text-primary leading-[1.08]">
            {block.heading}
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary leading-relaxed">{block.body}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-surface-border card-surface p-7 sm:p-8 space-y-7">
              <InfoRow icon={Mail} label={block.emailLabel}>
                <a href={`mailto:${email}`} className="text-lg font-semibold text-text-primary hover:text-brand-orange transition-colors break-all">
                  {email}
                </a>
              </InfoRow>
              <InfoRow icon={MapPin} label={block.locationLabel}>
                <p className="text-base text-text-primary">{block.location}</p>
              </InfoRow>
              {block.note && hasWhatsApp && (
                <InfoRow icon={MessageCircle} label="WhatsApp">
                  <p className="text-sm text-text-secondary">{block.note}</p>
                </InfoRow>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-brand-orange/40 via-surface-border/50 to-surface-border/20" aria-hidden="true" />
            <div className="relative rounded-2xl bg-surface-card p-7 sm:p-10 space-y-6 shadow-lift">
              <h2 className="text-2xl font-display font-semibold tracking-tight text-text-primary">{block.formHeading}</h2>
              <ContactForm copy={form} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
