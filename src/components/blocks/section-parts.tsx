import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-brand-orange/25 bg-brand-orange/[0.07] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-orange",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" aria-hidden="true" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  heading,
  intro,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  heading?: string;
  intro?: string;
  as?: "h1" | "h2";
}) {
  if (!eyebrow && !heading && !intro) return null;
  return (
    <div className="reveal max-w-3xl space-y-5">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {heading && (
        <Heading className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-bold tracking-tight text-text-primary leading-[1.1]">
          {heading}
        </Heading>
      )}
      {intro && <p className="text-lg text-text-secondary leading-relaxed">{intro}</p>}
    </div>
  );
}

/** Quiet inline link with an arrow that nudges on hover. */
export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:text-brand-amber"
      {...externalProps(href)}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" aria-hidden="true" />
    </Link>
  );
}

/** "Javed Ahmad Qureshi" → "JQ". */
export function initials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** Internal links stay in-app; anything else opens safely in a new tab. */
export function isExternal(href: string): boolean {
  return /^https:\/\//.test(href);
}

export function externalProps(href: string) {
  return isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
