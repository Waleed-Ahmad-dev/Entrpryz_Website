import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { CONTACT_CONTENT } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-background text-text-secondary relative overflow-hidden">
      {/* Subtle tech background image layer */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/images/bg-circuit.jpg"
          alt=""
          fill
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-5">
            <Link href="/" className="inline-block">
              <div className="relative h-10 w-44">
                <Image
                  src="/images/logo-transparent.png"
                  alt="Entrpryz — Technology. Simplified."
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-text-secondary max-w-md leading-relaxed">
              ERP Strategy &bull; Software Engineering &bull; Systems Advisory
            </p>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-orange">
              {CONTACT_CONTENT.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 lg:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-brand-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-orange transition-colors">
                  About Entrpryz &amp; Leadership
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-brand-orange transition-colors">
                  Services &amp; Solutions
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

          {/* Direct Email Contacts */}
          <div className="space-y-3 lg:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
              Direct Executive Contact
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-orange shrink-0" />
                <span className="text-text-secondary">General:</span>
                <a
                  href={`mailto:${CONTACT_CONTENT.contacts.general}`}
                  className="text-text-primary hover:text-brand-orange transition-colors font-medium"
                >
                  {CONTACT_CONTENT.contacts.general}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-orange shrink-0" />
                <span className="text-text-secondary">Javed A. Qureshi (Founder):</span>
                <a
                  href={`mailto:${CONTACT_CONTENT.contacts.javed}`}
                  className="text-text-primary hover:text-brand-orange transition-colors font-medium"
                >
                  {CONTACT_CONTENT.contacts.javed}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-orange shrink-0" />
                <span className="text-text-secondary">Waleed Ahmad (Co-Founder):</span>
                <a
                  href={`mailto:${CONTACT_CONTENT.contacts.waleed}`}
                  className="text-text-primary hover:text-brand-orange transition-colors font-medium"
                >
                  {CONTACT_CONTENT.contacts.waleed}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between border-t border-surface-border pt-6 sm:flex-row text-xs text-text-secondary">
          <p>© 2026 Entrpryz. All rights reserved.</p>
          <div className="mt-4 flex items-center gap-6 sm:mt-0">
            <span>Pakistan &amp; UAE Operations</span>
            <span>&bull;</span>
            <span className="text-brand-orange">Technology. Simplified.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
