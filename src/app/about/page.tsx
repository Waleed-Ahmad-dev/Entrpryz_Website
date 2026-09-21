import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ShieldCheck, Users, Quote, GraduationCap } from "lucide-react";
import {
  ABOUT_ENTRPRYZ,
  EXPERIENCE_BEHIND,
  FOUNDER_CONTENT,
  CERTIFICATIONS,
  TEAM,
} from "@/lib/content";
import { SectionContainer } from "@/components/layout/section-container";

export const metadata = {
  title: "About Entrpryz & Leadership",
  description:
    "25+ Years of Experience Behind Entrpryz — Led by Javed Ahmad Qureshi.",
};

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="border-b border-surface-border bg-background bg-grid-pattern py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs uppercase tracking-label font-semibold text-brand-orange border border-brand-orange/40 bg-surface-card px-4 py-1.5 inline-block">
            About Entrpryz
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-h1 text-text-primary uppercase leading-tight max-w-4xl">
            {ABOUT_ENTRPRYZ.headline}
          </h1>
          <p className="text-base sm:text-xl text-text-secondary max-w-3xl leading-relaxed border-l-2 border-brand-orange pl-6 py-1">
            {ABOUT_ENTRPRYZ.p1} {ABOUT_ENTRPRYZ.p2}
          </p>
        </div>
      </section>

      {/* Founder Profile */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border border-surface-border bg-surface-card p-8 sm:p-12 space-y-12">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-label font-semibold text-brand-orange">
              Executive Leadership
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-h2 text-text-primary uppercase">
              Meet the Founder
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Founder Image & Contact Box */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative aspect-[4/5] w-full border-2 border-surface-border bg-background p-2 shadow-xl">
                <Image
                  src="/images/javed-qureshi.jpg"
                  alt="Javed Ahmad Qureshi"
                  fill
                  className="object-cover object-top grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                />
              </div>

              <div className="border border-surface-border bg-background p-6 space-y-3">
                <h3 className="text-2xl font-bold text-text-primary">
                  {FOUNDER_CONTENT.name}
                </h3>
                <p className="text-xs font-semibold text-brand-orange uppercase tracking-label">
                  {FOUNDER_CONTENT.role}
                </p>
                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-brand-orange px-5 py-2.5 text-xs font-semibold uppercase tracking-cta text-background hover:bg-brand-amber transition-colors"
                  >
                    <span>{FOUNDER_CONTENT.cta}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Narrative & Competencies */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4 text-base sm:text-lg text-text-secondary leading-relaxed">
                <p>{FOUNDER_CONTENT.p1}</p>
                <p>{FOUNDER_CONTENT.p2}</p>
                <p>{FOUNDER_CONTENT.p3}</p>
              </div>

              <div className="border-l-4 border-brand-orange bg-background p-6 space-y-2">
                <div className="flex items-center gap-2 text-brand-orange font-semibold text-xs uppercase tracking-label">
                  <Quote className="h-4 w-4" />
                  <span>Founding Philosophy</span>
                </div>
                <p className="text-base sm:text-lg font-medium text-text-primary italic">
                  &ldquo;His philosophy is simple:{" "}
                  <span className="text-brand-orange">
                    {FOUNDER_CONTENT.philosophy}
                  </span>{" "}
                  That philosophy is the foundation of Entrpryz.&rdquo;
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-surface-border">
                <h4 className="text-xs font-bold uppercase tracking-label text-brand-amber">
                  Core Competencies
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FOUNDER_CONTENT.competencies.map((comp, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-text-secondary">
                      <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications & Training */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-label font-semibold text-brand-orange">
            <GraduationCap className="h-4 w-4" />
            <span>Credentials</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-h2 text-text-primary uppercase">
            Certifications &amp; Professional Training
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CERTIFICATIONS.map((cert, idx) => (
            <div
              key={idx}
              className="border border-surface-border bg-surface-card p-6 space-y-2"
            >
              <h3 className="text-sm font-bold text-brand-orange uppercase">
                {cert.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {cert.items}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-label font-semibold text-brand-orange">
            <Users className="h-4 w-4" />
            <span>Leadership Team</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-h2 text-text-primary uppercase">
            The Team Behind Entrpryz
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {TEAM.map((member, idx) => (
            <div
              key={idx}
              className="border border-surface-border bg-surface-card p-8 space-y-3"
            >
              <h3 className="text-xl font-bold text-text-primary">
                {member.name}
              </h3>
              <p className="text-xs font-semibold text-brand-orange uppercase tracking-label">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
