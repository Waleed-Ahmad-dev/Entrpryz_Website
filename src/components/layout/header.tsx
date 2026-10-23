"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SITE_CONTENT } from "@/lib/site-content";

const { links, cta } = SITE_CONTENT.navigation;

function isActive(pathname: string, href: string): boolean {
  const path = href.split("#")[0];
  return path !== "/" && (pathname === path || pathname.startsWith(`${path}/`));
}

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close the drawer after navigating.
  useEffect(() => setMobileMenuOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="relative z-10 mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label={`${SITE_CONTENT.site.name} home`}>
          <div className="relative h-9 w-36 sm:h-10 sm:w-44">
            <Image
              src={SITE_CONTENT.images.logo}
              alt={`${SITE_CONTENT.site.name} — ${SITE_CONTENT.site.tagline}`}
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-surface-card/60 p-1 md:flex">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  active ? "bg-brand-orange/15 text-brand-orange" : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ButtonLink href={cta.href} size="md">
            <span>{cta.label}</span>
            <ArrowUpRight className="h-4 w-4" />
          </ButtonLink>
        </div>

        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-full p-2.5 text-text-secondary border border-surface-border hover:border-brand-orange/60 hover:text-text-primary"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open main menu"}</span>
            {mobileMenuOpen ? <X className="h-6 w-6 text-brand-orange" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav id="mobile-menu" aria-label="Main" className="relative z-10 border-t border-white/[0.06] bg-background/95 px-4 pt-4 pb-6 md:hidden">
          <div className="space-y-1">
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-xl px-4 py-3 text-base font-semibold ${
                    active ? "bg-brand-orange/15 text-brand-orange" : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4">
              <ButtonLink href={cta.href} size="lg" fullWidth>
                <span>{cta.label}</span>
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
