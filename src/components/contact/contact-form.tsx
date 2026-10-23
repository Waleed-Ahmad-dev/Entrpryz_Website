"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitInquiry } from "@/services/contact";
import { FIELD_LIMITS } from "@/lib/contact-validation";
import type { ContactFormData } from "@/types";
import type { SiteContent } from "@/lib/content-schema";

type FormCopy = SiteContent["contact"]["form"];

const inputClass =
  "w-full bg-surface-card border border-surface-border px-4 py-3 text-sm rounded-md text-text-primary focus:border-brand-orange focus:outline-none aria-[invalid=true]:border-brand-orange";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-text-secondary";

/** Links the words "Privacy Policy" inside the editable consent note. */
function PrivacyNote({ text }: { text: string }) {
  const parts = text.split(/(Privacy Policy)/);
  return (
    <p className="text-xs text-text-secondary leading-relaxed">
      {parts.map((part, i) =>
        part === "Privacy Policy" ? (
          <Link key={i} href="/privacy-policy" className="text-brand-orange underline underline-offset-2 hover:text-brand-amber">
            {part}
          </Link>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </p>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-xs text-brand-orange">
      {message}
    </p>
  );
}

export function ContactForm({ copy }: { copy: FormCopy }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(Date.now());
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    organization: "",
    service: copy.areas[0],
    message: "",
  });

  const set = (field: keyof ContactFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData((d) => ({ ...d, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});
    const result = await submitInquiry(formData, { website: honeypot, startedAt: startedAt.current });
    if (result.ok) {
      setSubmitted(true);
    } else if (result.reason === "invalid") {
      setFieldErrors(result.fields ?? {});
      setSubmitError("Please check the highlighted fields and try again.");
    } else if (result.reason === "rate_limited") {
      setSubmitError("Too many messages sent from your connection. Please wait a few minutes or email us directly.");
    } else {
      setSubmitError("Something went wrong sending your message. Please email us directly or try again.");
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div role="status" className="border border-brand-orange bg-surface-card p-8 text-center space-y-4">
        <CheckCircle2 className="h-12 w-12 text-brand-orange mx-auto" />
        <h3 className="text-xl font-bold text-text-primary">{copy.successHeading}</h3>
        <p className="text-sm text-text-secondary">{copy.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6" noValidate>
      {/* Honeypot: hidden from people, filled by bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="contact-name" className={labelClass}>
            {copy.nameLabel} *
          </label>
          <input id="contact-name" name="name" type="text" required autoComplete="name" maxLength={FIELD_LIMITS.name}
            aria-invalid={!!fieldErrors.name} value={formData.name} onChange={set("name")} className={inputClass} />
          <FieldError message={fieldErrors.name} />
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-email" className={labelClass}>
            {copy.emailLabel} *
          </label>
          <input id="contact-email" name="email" type="email" required autoComplete="email" maxLength={FIELD_LIMITS.email}
            aria-invalid={!!fieldErrors.email} value={formData.email} onChange={set("email")} className={inputClass} />
          <FieldError message={fieldErrors.email} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="contact-organization" className={labelClass}>
            {copy.companyLabel}
          </label>
          <input id="contact-organization" name="organization" type="text" autoComplete="organization"
            maxLength={FIELD_LIMITS.organization} aria-invalid={!!fieldErrors.organization}
            value={formData.organization} onChange={set("organization")} className={inputClass} />
          <FieldError message={fieldErrors.organization} />
        </div>
        <div className="space-y-2">
          <label htmlFor="contact-service" className={labelClass}>
            {copy.areaLabel}
          </label>
          <select id="contact-service" name="service" value={formData.service} onChange={set("service")} className={inputClass}>
            {copy.areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.service} />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className={labelClass}>
          {copy.messageLabel} *
        </label>
        <textarea id="contact-message" name="message" required rows={5} maxLength={FIELD_LIMITS.message}
          aria-invalid={!!fieldErrors.message} value={formData.message} onChange={set("message")} className={inputClass} />
        <FieldError message={fieldErrors.message} />
      </div>

      {submitError && (
        <p className="border border-brand-orange/40 bg-surface-card px-4 py-3 text-xs text-brand-orange">{submitError}</p>
      )}

      <PrivacyNote text={copy.privacyNote} />

      <Button type="submit" size="lg" fullWidth className="shadow-md" disabled={submitting}>
        <span>{submitting ? "Sending..." : copy.submitLabel}</span>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
