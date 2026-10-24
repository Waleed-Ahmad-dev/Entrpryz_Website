import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";
import { SectionBackground } from "@/components/ui/section-background";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/blocks/section-parts";
import { SITE_CONTENT } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const links = SITE_CONTENT.navigation.links;
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <section className="relative overflow-hidden bg-background py-24 md:py-32">
          <SectionBackground glowStrength="medium" />
          <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center space-y-7">
            <Eyebrow className="mx-auto">Error 404</Eyebrow>
            <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-text-primary">
              This page doesn&apos;t <span className="text-gradient">exist.</span>
            </h1>
            <p className="text-lg text-text-secondary">
              The link may be old or mistyped. Here are the places most people are looking for.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
              <ButtonLink href="/" size="lg">
                <span>Back to home</span>
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href={SITE_CONTENT.navigation.cta.href} size="lg" variant="outline">
                <span>{SITE_CONTENT.navigation.cta.label}</span>
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
            </div>
            <nav aria-label="Popular pages" className="pt-4">
              <ul className="flex flex-wrap justify-center gap-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="inline-flex min-h-[40px] items-center rounded-full border border-surface-border bg-surface-card px-4 text-sm font-medium text-text-primary hover:border-brand-orange/50 hover:text-brand-orange"
                    >
                      {l.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
