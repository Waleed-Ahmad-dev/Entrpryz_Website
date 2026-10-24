"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Turnstile, turnstileEnabled, type TurnstileHandle } from "@/components/ui/turnstile";
import { submitInquiry } from "@/services/contact";
import { FIELD_LIMITS } from "@/lib/contact-validation";
import type { ContactFormData } from "@/types";
import type { SiteContent } from "@/lib/content-schema";

type FormCopy = SiteContent["contact"]["form"];

const inputClass =
  "w-full rounded-xl border border-surface-border bg-background/70 px-4 py-3 text-[15px] text-text-primary placeholder:text-text-secondary/60 transition-colors focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 aria-[invalid=true]:border-brand-orange";
const labelClass = "text-sm font-medium text-text-primary";

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
  const turnstile = useRef<TurnstileHandle>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
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
    if (turnstileEnabled && !turnstileToken) {
      setSubmitError("Please complete the security check below.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});
    const result = await submitInquiry(formData, {
      website: honeypot,
      startedAt: startedAt.current,
      turnstileToken: turnstileToken || undefined,
    });
    if (!result.ok) turnstile.current?.reset();
    if (result.ok) {
      setSubmitted(true);
    } else if (result.reason === "invalid") {
      setFieldErrors(result.fields ?? {});
      setSubmitError("Please check the highlighted fields and try again.");
    } else if (result.reason === "verification") {
      setSubmitError("The security check didn't go through. Please try it again.");
    } else if (result.reason === "rate_limited") {
      setSubmitError("Too many messages sent from your connection. Please wait a few minutes or email us directly.");
    } else {
      setSubmitError("Something went wrong sending your message. Please email us directly or try again.");
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div role="status" className="rounded-2xl border border-brand-orange/40 bg-brand-orange/[0.06] p-8 text-center space-y-4">
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
        <p className="rounded-xl border border-brand-orange/40 bg-brand-orange/[0.06] px-4 py-3 text-sm text-brand-orange">{submitError}</p>
      )}

      <Turnstile ref={turnstile} onToken={setTurnstileToken} action="contact" />

      <PrivacyNote text={copy.privacyNote} />

      <Button type="submit" size="lg" fullWidth disabled={submitting}>
        <span>{submitting ? "Sending..." : copy.submitLabel}</span>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
