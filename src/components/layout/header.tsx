"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full pt-3 pb-2 px-4 transition-all duration-300 pointer-events-none">
      <div
        className={`mx-auto max-w-6xl pointer-events-auto rounded-full border transition-all duration-500 ${
          scrolled
            ? "border-brand-orange/30 bg-background/85 backdrop-blur-xl shadow-2xl py-2 px-5 shadow-black/80"
            : "border-surface-border/80 bg-surface-card/60 backdrop-blur-md py-2.5 px-6"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-8 w-32 sm:h-9 sm:w-40 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/logo-transparent.png"
                alt="Entrpryz - Technology. Simplified."
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Floating Pill Nav Links */}
          <nav className="hidden md:flex items-center gap-1 rounded-full bg-background/60 border border-surface-border/60 p-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-1.5 text-xs font-semibold uppercase tracking-nav transition-all duration-300 rounded-full ${
                    isActive
                      ? "text-background bg-brand-orange font-bold shadow-md shadow-brand-orange/30"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Call to Action - Button-in-Button Trailing Icon */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-2.5 rounded-full bg-brand-orange pl-5 pr-2 py-1.5 text-xs font-bold uppercase tracking-cta text-background transition-all duration-300 hover:bg-brand-amber hover:shadow-lg hover:shadow-brand-orange/20 active:scale-95"
            >
              <span>Talk to Us</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background/20 text-background transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-full p-2 text-text-primary bg-surface-card border border-surface-border hover:border-brand-orange transition-colors"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Toggle navigation menu</span>
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-brand-orange" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Fullscreen Glass Modal Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 top-[70px] z-40 bg-background/95 backdrop-blur-2xl px-6 py-8 md:hidden pointer-events-auto border-t border-surface-border flex flex-col justify-between"
          >
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-label font-bold text-brand-orange">
                <Sparkles className="h-4 w-4" />
                <span>Navigation Directory</span>
              </div>

              <div className="space-y-3">
                {NAV_LINKS.map((link, idx) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between py-3 border-b border-surface-border text-lg font-display uppercase tracking-wider font-bold ${
                          isActive
                            ? "text-brand-orange pl-2 border-brand-orange"
                            : "text-text-primary hover:text-brand-orange"
                        }`}
                      >
                        <span>{link.name}</span>
                        <span className="text-xs font-mono text-text-secondary">
                          0{idx + 1}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-surface-border">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-4 text-xs font-bold uppercase tracking-cta text-background shadow-lg shadow-brand-orange/20"
              >
                <span>Talk to Us</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <p className="text-center text-[10px] uppercase tracking-widest font-mono text-text-secondary">
                Entrpryz — Technology. Simplified.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
