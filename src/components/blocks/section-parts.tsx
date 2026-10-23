import { cn } from "@/lib/utils";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 border border-brand-orange/40 bg-surface-card px-3.5 py-1 rounded-sm text-xs uppercase tracking-wider font-semibold text-brand-orange",
        className
      )}
    >
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
    <div className="max-w-3xl space-y-4">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {heading && (
        <Heading className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-text-primary uppercase leading-tight">
          {heading}
        </Heading>
      )}
      {intro && <p className="text-base sm:text-lg text-text-secondary leading-relaxed">{intro}</p>}
    </div>
  );
}

/** Internal links stay in-app; anything else opens safely in a new tab. */
export function isExternal(href: string): boolean {
  return /^https:\/\//.test(href);
}

export function externalProps(href: string) {
  return isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
