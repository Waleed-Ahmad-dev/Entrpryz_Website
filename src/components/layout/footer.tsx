import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Mail } from "lucide-react";
import { CONTACT_CONTENT } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative border-t border-surface-border bg-background text-text-secondary overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-60" />

      {/* Massive Background Typography Watermark */}
      <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 text-[14vw] font-display font-black text-surface-border/15 select-none pointer-events-none tracking-tighter uppercase whitespace-nowrap z-0">
        ENTRPRYZ
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-5">
            <Link href="/" className="inline-block group">
              <div className="relative h-10 w-44 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/logo-transparent.png"
                  alt="Entrpryz Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-text-secondary max-w-md leading-relaxed">
              Digital Transformation &bull; Software Development &bull; Technology &amp; IT Services
            </p>
            <p className="text-xs font-mono uppercase tracking-widest text-brand-orange font-bold">
              {CONTACT_CONTENT.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 lg:col-span-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-text-primary">
              [ DIRECTORY ]
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-brand-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-orange transition-colors">
                  About &amp; Leadership
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-orange transition-colors">
                  Services (What We Do)
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-brand-orange transition-colors">
                  Track Record &amp; Portfolio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-orange transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Direct Emails */}
          <div className="space-y-3 lg:col-span-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-text-primary">
              [ DIRECT CONTACT ]
            </h4>
            <ul className="space-y-2.5 text-xs font-mono">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-brand-orange shrink-0" />
                <span className="text-text-secondary">General:</span>
                <a
                  href={`mailto:${CONTACT_CONTENT.contacts.general}`}
                  className="text-text-primary hover:text-brand-orange transition-colors font-semibold"
                >
                  {CONTACT_CONTENT.contacts.general}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-brand-orange shrink-0" />
                <span className="text-text-secondary">Javed A. Qureshi:</span>
                <a
                  href={`mailto:${CONTACT_CONTENT.contacts.javed}`}
                  className="text-text-primary hover:text-brand-orange transition-colors font-semibold"
                >
                  {CONTACT_CONTENT.contacts.javed}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-brand-orange shrink-0" />
                <span className="text-text-secondary">Waleed Ahmad:</span>
                <a
                  href={`mailto:${CONTACT_CONTENT.contacts.waleed}`}
                  className="text-text-primary hover:text-brand-orange transition-colors font-semibold"
                >
                  {CONTACT_CONTENT.contacts.waleed}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between border-t border-surface-border pt-6 sm:flex-row text-[11px] font-mono text-text-secondary">
          <p>© 2026 Entrpryz. All rights reserved.</p>
          <div className="mt-4 flex items-center gap-6 sm:mt-0">
            <span>PK / UAE Operations</span>
            <span>&bull;</span>
            <span className="text-brand-orange">Technology. Simplified.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
