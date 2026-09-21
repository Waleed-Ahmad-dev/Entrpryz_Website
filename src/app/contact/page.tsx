"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, PhoneCall, Send, CheckCircle2 } from "lucide-react";
import { CONTACT_CONTENT } from "@/lib/content";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    service: "Digital Transformation",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="border-b border-surface-border bg-background py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <Image
            src="/images/bg-hero-tech.jpg"
            alt=""
            fill
            className="object-cover object-center opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          <div className="inline-flex items-center gap-2 border border-brand-orange/40 bg-surface-card px-4 py-1.5 text-xs uppercase tracking-wider font-semibold text-brand-orange">
            <PhoneCall className="h-4 w-4" />
            <span>Direct Engagement</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-text-primary uppercase leading-tight max-w-4xl mx-auto">
            {CONTACT_CONTENT.headline}
          </h1>
          <p className="text-base sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {CONTACT_CONTENT.body}
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Emails */}
          <div className="lg:col-span-5 space-y-8">
            <div className="border border-surface-border bg-surface-card p-8 space-y-6">
              <h2 className="text-xs uppercase tracking-wider font-bold text-brand-orange">
                Direct Contact Points
              </h2>

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
                Technology. Simplified.
              </p>
              <p className="text-xs text-text-secondary mt-2">
                Entrpryz operates across Pakistan and UAE, delivering multi-country enterprise technology programs.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="border border-surface-border bg-surface-card p-8 sm:p-10 space-y-6">
              <h2 className="text-xl font-display font-bold text-text-primary uppercase">
                Send Us A Message
              </h2>

              {submitted ? (
                <div className="border border-brand-orange bg-background p-8 text-center space-y-4">
                  <CheckCircle2 className="h-12 w-12 text-brand-orange mx-auto" />
                  <h3 className="text-xl font-bold text-text-primary">
                    Thank You For Reaching Out
                  </h3>
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
                        className="w-full bg-background border border-surface-border px-4 py-3 text-sm text-text-primary focus:border-brand-orange focus:outline-none"
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
                        className="w-full bg-background border border-surface-border px-4 py-3 text-sm text-text-primary focus:border-brand-orange focus:outline-none"
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
                        className="w-full bg-background border border-surface-border px-4 py-3 text-sm text-text-primary focus:border-brand-orange focus:outline-none"
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
                        className="w-full bg-background border border-surface-border px-4 py-3 text-sm text-text-primary focus:border-brand-orange focus:outline-none"
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
                      className="w-full bg-background border border-surface-border px-4 py-3 text-sm text-text-primary focus:border-brand-orange focus:outline-none"
                      placeholder="Briefly describe your business requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-brand-orange px-8 py-4 text-xs font-semibold uppercase tracking-widest text-background hover:bg-brand-amber transition-all shadow-lg active:scale-95"
                  >
                    <span>Submit Consultation Request</span>
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
