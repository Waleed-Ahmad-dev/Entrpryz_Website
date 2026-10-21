"use client";

import React, { useRef, useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { CONTACT_CONTENT } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { Button } from "@/components/ui/button";
import { submitInquiry } from "@/services/contact";
import { FIELD_LIMITS, SERVICE_OPTIONS } from "@/lib/contact-validation";
import type { ContactFormData } from "@/types";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(Date.now());
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    organization: "",
    service: "Digital Transformation",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});
    const result = await submitInquiry(formData, {
      website: honeypot,
      startedAt: startedAt.current,
    });
    if (result.ok) {
      setSubmitted(true);
    } else if (result.reason === "invalid") {
      setFieldErrors(result.fields ?? {});
      setSubmitError("Please check the highlighted fields and try again.");
    } else if (result.reason === "rate_limited") {
      setSubmitError(
        "Too many messages sent from your connection. Please wait a few minutes or email us directly."
      );
    } else {
      setSubmitError(
        "Something went wrong sending your message. Please email us directly or try again."
      );
    }
    setSubmitting(false);
  };

  return (
    <SectionContainer darkSurface={true}>
      <div className="space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-text-primary uppercase leading-tight">
            {CONTACT_CONTENT.headline}
          </h2>
          <p className="text-base sm:text-lg text-text-secondary">
            {CONTACT_CONTENT.body}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Emails */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-surface-border bg-background p-8 space-y-6">
              <h3 className="text-xs uppercase tracking-wider font-bold text-brand-orange">
                Direct Contact Points
              </h3>

              <div className="space-y-6">
                <div className="border-b border-surface-border pb-4 space-y-1">
                  <p className="text-xs font-mono text-text-secondary">General Inquiries:</p>
                  <a
                    href={`mailto:${CONTACT_CONTENT.contacts.general}`}
                    className="text-lg font-bold text-text-primary hover:text-brand-orange transition-colors flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4 text-brand-orange" />
                    <span>{CONTACT_CONTENT.contacts.general}</span>
                  </a>
                </div>

                <div className="border-b border-surface-border pb-4 space-y-1">
                  <p className="text-xs font-mono text-text-secondary">
                    Javed Ahmad Qureshi (Founder):
                  </p>
                  <a
                    href={`mailto:${CONTACT_CONTENT.contacts.javed}`}
                    className="text-lg font-bold text-text-primary hover:text-brand-orange transition-colors flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4 text-brand-orange" />
                    <span>{CONTACT_CONTENT.contacts.javed}</span>
                  </a>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-mono text-text-secondary">
                    Waleed Ahmad (Co-Founder):
                  </p>
                  <a
                    href={`mailto:${CONTACT_CONTENT.contacts.waleed}`}
                    className="text-lg font-bold text-text-primary hover:text-brand-orange transition-colors flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4 text-brand-orange" />
                    <span>{CONTACT_CONTENT.contacts.waleed}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="border border-brand-orange/40 bg-background p-6">
              <p className="text-xs font-mono text-brand-orange uppercase tracking-wider font-semibold">
                {CONTACT_CONTENT.tagline}
              </p>
              <p className="text-xs text-text-secondary mt-2">
                Entrpryz operates across Pakistan and UAE, delivering multi-country enterprise technology programs.
              </p>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="border border-surface-border bg-background p-8 sm:p-10 space-y-6">
              <h3 className="text-xl font-display font-bold text-text-primary uppercase">
                Send Us A Message
              </h3>

              {submitted ? (
                <div className="border border-brand-orange bg-surface-card p-8 text-center space-y-4">
                  <CheckCircle2 className="h-12 w-12 text-brand-orange mx-auto" />
                  <h4 className="text-xl font-bold text-text-primary">
                    Thank You For Reaching Out
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Your message has been received. One of our lead consultants will get back to you promptly.
                  </p>
                </div>
              ) : (
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
                      <label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        maxLength={FIELD_LIMITS.name}
                        aria-invalid={!!fieldErrors.name}
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-surface-card border border-surface-border px-4 py-3 text-sm rounded-md text-text-primary focus:border-brand-orange focus:outline-none aria-[invalid=true]:border-brand-orange"
                        placeholder="John Doe"
                      />
                      <FieldError message={fieldErrors.name} />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        maxLength={FIELD_LIMITS.email}
                        aria-invalid={!!fieldErrors.email}
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-surface-card border border-surface-border px-4 py-3 text-sm rounded-md text-text-primary focus:border-brand-orange focus:outline-none aria-[invalid=true]:border-brand-orange"
                        placeholder="john@company.com"
                      />
                      <FieldError message={fieldErrors.email} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="contact-organization" className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Organization / Company
                      </label>
                      <input
                        id="contact-organization"
                        name="organization"
                        type="text"
                        autoComplete="organization"
                        maxLength={FIELD_LIMITS.organization}
                        aria-invalid={!!fieldErrors.organization}
                        value={formData.organization}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: e.target.value,
                          })
                        }
                        className="w-full bg-surface-card border border-surface-border px-4 py-3 text-sm rounded-md text-text-primary focus:border-brand-orange focus:outline-none aria-[invalid=true]:border-brand-orange"
                        placeholder="Company Name"
                      />
                      <FieldError message={fieldErrors.organization} />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contact-service" className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Area of Interest
                      </label>
                      <select
                        id="contact-service"
                        name="service"
                        value={formData.service}
                        onChange={(e) =>
                          setFormData({ ...formData, service: e.target.value })
                        }
                        className="w-full bg-surface-card border border-surface-border px-4 py-3 text-sm rounded-md text-text-primary focus:border-brand-orange focus:outline-none"
                      >
                        {SERVICE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <FieldError message={fieldErrors.service} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Message / Project Details *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      maxLength={FIELD_LIMITS.message}
                      aria-invalid={!!fieldErrors.message}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full bg-surface-card border border-surface-border px-4 py-3 text-sm rounded-md text-text-primary focus:border-brand-orange focus:outline-none aria-[invalid=true]:border-brand-orange"
                      placeholder="Briefly describe your business requirements..."
                    />
                    <FieldError message={fieldErrors.message} />
                  </div>

                  {submitError && (
                    <p className="border border-brand-orange/40 bg-surface-card px-4 py-3 text-xs text-brand-orange">
                      {submitError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    className="shadow-md"
                    disabled={submitting}
                  >
                    <span>
                      {submitting ? "Sending..." : "Submit Consultation Request"}
                    </span>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
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
