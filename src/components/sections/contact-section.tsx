"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { CONTACT_CONTENT } from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";
import { Button } from "@/components/ui/button";
import { submitInquiry } from "@/services/contact";
import type { ContactFormData } from "@/types";

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    organization: "",
    service: "Digital Transformation",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitInquiry(formData);
    if (result.ok) setSubmitted(true);
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-surface-card border border-surface-border px-4 py-3 text-sm rounded-md text-text-primary focus:border-brand-orange focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-surface-card border border-surface-border px-4 py-3 text-sm rounded-md text-text-primary focus:border-brand-orange focus:outline-none"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Organization / Company
                      </label>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: e.target.value,
                          })
                        }
                        className="w-full bg-surface-card border border-surface-border px-4 py-3 text-sm rounded-md text-text-primary focus:border-brand-orange focus:outline-none"
                        placeholder="Company Name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                        Area of Interest
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) =>
                          setFormData({ ...formData, service: e.target.value })
                        }
                        className="w-full bg-surface-card border border-surface-border px-4 py-3 text-sm rounded-md text-text-primary focus:border-brand-orange focus:outline-none"
                      >
                        <option value="Digital Transformation">
                          Digital Transformation (ERP/CRM)
                        </option>
                        <option value="Software Development">
                          Software Development &amp; Custom Apps
                        </option>
                        <option value="Technology & IT Services">
                          Technology &amp; IT Services / Infra
                        </option>
                        <option value="ERP Turnaround / PIR">
                          ERP Post-Implementation Review / Turnaround
                        </option>
                        <option value="General Consultation">
                          General Technology Consultation
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      Message / Project Details *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full bg-surface-card border border-surface-border px-4 py-3 text-sm rounded-md text-text-primary focus:border-brand-orange focus:outline-none"
                      placeholder="Briefly describe your business requirements..."
                    />
                  </div>

                  <Button type="submit" size="lg" fullWidth className="shadow-md">
                    <span>Submit Consultation Request</span>
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
