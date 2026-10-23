import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";
import { SITE_CONTENT } from "@/lib/site-content";
import { SectionBackground } from "@/components/ui/section-background";
import { PLATFORM_LABELS, SocialIcon } from "./social-icon";

const linkClass = "hover:text-brand-orange transition-colors";

export function Footer() {
  const { site, navigation, contact, images } = SITE_CONTENT;
  const pages = [...navigation.links, { name: "Contact", href: "/contact" }];
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-border bg-background text-text-secondary relative overflow-hidden">
      <SectionBackground />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <Link href="/" className="inline-block" aria-label={`${site.name} home`}>
              <div className="relative h-10 w-44">
                <Image src={images.logo} alt={`${site.name} — ${site.tagline}`} fill className="object-contain object-left" />
              </div>
            </Link>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-orange">
              {site.name}. {site.tagline}
            </p>
            {site.social.length > 0 && (
              <ul className="flex items-center gap-3 pt-2">
                {site.social.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${site.name} on ${PLATFORM_LABELS[s.platform]}`}
                      className="inline-flex h-9 w-9 items-center justify-center border border-surface-border text-text-secondary hover:border-brand-orange hover:text-brand-orange transition-colors"
                    >
                      <SocialIcon platform={s.platform} className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Services" className="space-y-3 lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Services</h2>
            <ul className="space-y-2 text-xs font-medium">
              {site.footerServices.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className={linkClass}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Pages" className="space-y-3 lg:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Pages</h2>
            <ul className="space-y-2 text-xs font-medium">
              {pages.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className={linkClass}>
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3 lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-primary">Contact</h2>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-orange shrink-0" />
                <a href={`mailto:${contact.email}`} className="text-text-primary hover:text-brand-orange transition-colors font-medium break-all">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-brand-orange shrink-0" />
                <span>{site.location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-surface-border pt-6 sm:flex-row text-xs">
          <p>
            © {year} {site.copyright}
          </p>
          <Link href="/privacy-policy" className={linkClass}>
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
