"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { SectionBackground } from "@/components/ui/section-background";
import { ButtonLink } from "@/components/ui/button";
import { useActiveSection } from "@/hooks/use-active-section";

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Contact", href: "#contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeSection = useActiveSection(
    NAV_LINKS.map((link) => link.href.slice(1)),
    "#home"
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-background/95 backdrop-blur-md overflow-hidden">
      {/* Abstract backdrop behind nav */}
      <SectionBackground />
      <div className="relative z-10 mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-9 w-36 sm:h-10 sm:w-44">
            <Image
              src="/images/logo-transparent.png"
              alt="Entrpryz — Technology. Simplified."
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Executive Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-widest font-semibold transition-colors duration-200 py-1 ${
                  isActive
                    ? "text-brand-orange border-b-2 border-brand-orange"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Primary Executive Call to Action */}
        <div className="hidden md:flex items-center gap-4">
          <ButtonLink href="#contact" size="md">
            <span>Talk to Us</span>
            <ArrowUpRight className="h-4 w-4" />
          </ButtonLink>
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center p-2.5 text-text-secondary border border-surface-border hover:border-brand-orange hover:text-text-primary"
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-brand-orange" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-surface-border bg-surface-card px-6 pt-4 pb-8 md:hidden">
          <div className="space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base font-bold uppercase tracking-wider ${
                  activeSection === link.href
                    ? "text-brand-orange border-l-2 border-brand-orange pl-3"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4">
              <ButtonLink
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                size="lg"
                fullWidth
              >
                <span>Talk to Us</span>
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
