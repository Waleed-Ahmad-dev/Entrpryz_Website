import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Plus, Quote } from "lucide-react";
import type { BlockOf } from "@/lib/content-schema";
import { SectionContainer } from "@/components/layout/section-container";
import { SectionBackground } from "@/components/ui/section-background";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eyebrow, SectionHeading, externalProps } from "./section-parts";

type Surface = { dark: boolean };

// ---------- hero ----------

export function HeroBlock({ block }: { block: BlockOf<"hero"> }) {
  // "Technology. Simplified." → second sentence in brand orange.
  const sentences = block.heading.match(/[^.!?]+[.!?]+/g);
  const twoPart = sentences && sentences.length === 2 && block.heading.length <= 40;
  const large = block.heading.length <= 40;

  return (
    <section className="border-b border-surface-border bg-background py-16 md:py-24 relative overflow-hidden">
      <SectionBackground glowStrength="medium" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className={cn("space-y-6", block.aside ? "lg:col-span-8" : "lg:col-span-10")}>
            {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
            <h1
              className={cn(
                "font-display font-extrabold tracking-tight text-text-primary uppercase",
                large ? "text-4xl sm:text-6xl lg:text-7xl leading-[0.95]" : "text-3xl sm:text-5xl leading-tight"
              )}
            >
              {twoPart ? (
                <>
                  {sentences[0].trim()}
                  <br />
                  <span className="text-brand-orange">{sentences[1].trim()}</span>
                </>
              ) : (
                block.heading
              )}
            </h1>
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">{block.body}</p>
            {block.buttons.length > 0 && (
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {block.buttons.map((b, i) => (
                  <ButtonLink key={b.href + i} href={b.href} size="lg" variant={i === 0 ? "primary" : "outline"} {...externalProps(b.href)}>
                    <span>{b.label}</span>
                    {i === 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </ButtonLink>
                ))}
              </div>
            )}
          </div>

          {block.aside && (
            <aside className="lg:col-span-4 border border-surface-border bg-surface-card p-6 space-y-5">
              {block.aside.heading && (
                <h2 className="border-b border-surface-border pb-3 text-xs uppercase tracking-wider font-bold text-text-primary">
                  {block.aside.heading}
                </h2>
              )}
              <dl className="space-y-4">
                {block.aside.items.map((item) => (
                  <div key={item.title} className="space-y-0.5">
                    <dt className="text-sm font-bold text-text-primary">{item.title}</dt>
                    {item.detail && <dd className="text-xs text-text-secondary">{item.detail}</dd>}
                  </div>
                ))}
              </dl>
            </aside>
          )}
        </div>

        {block.image && (
          <div className="border border-surface-border bg-surface-card p-3 overflow-hidden">
            <div className="relative aspect-[21/9] w-full bg-surface-dark overflow-hidden">
              <Image src={block.image} alt="" fill className="object-cover opacity-60" priority sizes="(max-width: 1280px) 100vw, 1280px" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- stats ----------

export function StatsBlock({ block, dark }: { block: BlockOf<"stats"> } & Surface) {
  return (
    <SectionContainer darkSurface={dark} className="py-12 md:py-16">
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {block.items.map((s, i) => (
          <div key={s.label} className="border border-surface-border bg-background p-6 space-y-2">
            <dd className={cn("text-3xl sm:text-4xl font-display font-bold", i === 0 ? "text-brand-orange" : "text-text-primary")}>
              {s.value}
            </dd>
            <dt className="text-xs uppercase tracking-wider font-medium text-text-secondary">{s.label}</dt>
          </div>
        ))}
      </dl>
    </SectionContainer>
  );
}

// ---------- cards ----------

export function CardsBlock({ block, dark }: { block: BlockOf<"cards"> } & Surface) {
  const count = block.items.length;
  const cols = count === 1 ? "grid-cols-1" : count === 2 || count === 4 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <SectionContainer id={block.id} darkSurface={dark} className="scroll-mt-24">
      <div className="space-y-12">
        <SectionHeading eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
        <div className={cn("grid grid-cols-1 gap-6", cols)}>
          {block.items.map((card) => (
            <article
              key={card.title}
              id={card.id}
              className={cn(
                "border bg-background p-6 sm:p-8 flex flex-col gap-5 scroll-mt-24 transition-colors",
                card.badge ? "border-brand-orange/60" : "border-surface-border hover:border-brand-orange"
              )}
            >
              <div className="space-y-3">
                {card.badge && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-brand-orange text-background px-2 py-0.5">
                    {card.badge}
                  </span>
                )}
                <h3 className="text-xl font-display font-bold text-text-primary uppercase">{card.title}</h3>
                {card.description && <p className="text-sm text-text-secondary leading-relaxed">{card.description}</p>}
              </div>

              {card.bullets.length > 0 && (
                <ul className="space-y-2">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-text-primary">
                      <Check className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {card.meta.length > 0 && (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-surface-border pt-4">
                  {card.meta.map((m) => (
                    <div key={m.title}>
                      <dt className="text-[10px] uppercase tracking-widest font-semibold text-text-secondary">{m.title}</dt>
                      {m.detail && <dd className="text-sm font-medium text-text-primary">{m.detail}</dd>}
                    </div>
                  ))}
                </dl>
              )}

              {card.links.length > 0 && (
                <div className="mt-auto pt-2 flex flex-wrap gap-3">
                  {card.links.map((l, i) => (
                    <ButtonLink key={l.href + i} href={l.href} variant="brandOutline" size="sm" {...externalProps(l.href)}>
                      <span>{l.label}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </ButtonLink>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}

// ---------- steps ----------

export function StepsBlock({ block, dark }: { block: BlockOf<"steps"> } & Surface) {
  const cols = block.items.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4";
  return (
    <SectionContainer id={block.id} darkSurface={dark}>
      <div className="space-y-12">
        <SectionHeading eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
        <ol className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", cols)}>
          {block.items.map((step, i) => (
            <li key={step.title} className="border border-surface-border bg-background p-6 space-y-3 hover:border-brand-orange transition-colors">
              <span className="block text-2xl font-display font-bold text-brand-orange font-mono border-b border-surface-border pb-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-display font-bold text-text-primary uppercase">{step.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </SectionContainer>
  );
}

// ---------- checklist ----------

export function ChecklistBlock({ block, dark }: { block: BlockOf<"checklist"> } & Surface) {
  const titled = block.items.some((i) => i.title);
  return (
    <SectionContainer id={block.id} darkSurface={dark} className="scroll-mt-24">
      <div className="space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <SectionHeading eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
          {block.link && (
            <ButtonLink href={block.link.href} variant="outline" size="md" className="shrink-0 self-start lg:self-end" {...externalProps(block.link.href)}>
              <span>{block.link.label}</span>
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          )}
        </div>
        <ul className={cn("grid grid-cols-1 gap-4", titled ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2")}>
          {block.items.map((item) => (
            <li key={item.description} className="flex items-start gap-3 border border-surface-border bg-background p-5">
              <Check className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
              <div className="space-y-1">
                {item.title && <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">{item.title}</h3>}
                <p className={cn("text-sm leading-relaxed", item.title ? "text-text-secondary" : "text-text-primary")}>
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SectionContainer>
  );
}

// ---------- faq ----------

export function FaqBlock({ block, dark }: { block: BlockOf<"faq"> } & Surface) {
  return (
    <SectionContainer id={block.id} darkSurface={dark}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
        </div>
        <div className="lg:col-span-8 divide-y divide-surface-border border-y border-surface-border">
          {block.items.map((qa) => (
            <details key={qa.question} className="group py-5">
              <summary className="flex items-start justify-between gap-4 cursor-pointer list-none">
                <h3 className="text-base font-bold text-text-primary">{qa.question}</h3>
                <Plus className="h-5 w-5 text-brand-orange shrink-0 transition-transform group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="pt-3 text-sm text-text-secondary leading-relaxed">{qa.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}

// ---------- cta ----------

export function CtaBlock({ block }: { block: BlockOf<"cta"> }) {
  return (
    <section className="border-b border-surface-border bg-background py-16 md:py-20 relative overflow-hidden">
      <SectionBackground glowStrength="medium" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-text-primary uppercase leading-tight">
          {block.heading}
        </h2>
        {block.body && <p className="text-base sm:text-lg text-text-secondary">{block.body}</p>}
        <ButtonLink href={block.button.href} size="lg" {...externalProps(block.button.href)}>
          <span>{block.button.label}</span>
          <ArrowUpRight className="h-4 w-4" />
        </ButtonLink>
      </div>
    </section>
  );
}

// ---------- profile ----------

export function ProfileBlock({ block, dark }: { block: BlockOf<"profile"> } & Surface) {
  return (
    <SectionContainer id={block.id} darkSurface={dark} className="scroll-mt-24">
      <div className={cn("grid grid-cols-1 gap-12 items-start", block.image && "lg:grid-cols-12")}>
        {block.image && (
          <div className="lg:col-span-4 border border-surface-border bg-surface-card p-3">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-dark">
              <Image src={block.image} alt={block.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 400px" />
            </div>
          </div>
        )}
        <div className={cn("space-y-6", block.image ? "lg:col-span-8" : "max-w-4xl")}>
          <SectionHeading eyebrow={block.eyebrow} heading={block.name} />
          <div className="space-y-4">
            {block.paragraphs.map((p) => (
              <p key={p} className="text-base text-text-secondary leading-relaxed">
                {p}
              </p>
            ))}
          </div>
          {block.quote && (
            <blockquote className="border-l-2 border-brand-orange pl-5 flex gap-3">
              <Quote className="h-5 w-5 text-brand-orange shrink-0" aria-hidden="true" />
              <p className="text-lg font-semibold text-brand-amber leading-snug">{block.quote}</p>
            </blockquote>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}

// ---------- text ----------

export function TextBlock({ block, dark }: { block: BlockOf<"text"> } & Surface) {
  const headingOnly = !block.aside && !block.button;
  return (
    <SectionContainer id={block.id} darkSurface={dark} className={headingOnly && !block.heading ? "py-10 md:py-12" : undefined}>
      <div className={cn("grid grid-cols-1 gap-12", block.aside && "lg:grid-cols-12")}>
        <div className={cn("space-y-6", block.aside ? "lg:col-span-7" : "max-w-4xl")}>
          <SectionHeading eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
          {block.paragraphs.map((p) => (
            <p key={p} className={cn("leading-relaxed", block.heading ? "text-base text-text-secondary" : "text-sm text-text-secondary")}>
              {p}
            </p>
          ))}
          {block.button && (
            <ButtonLink href={block.button.href} variant="outline" size="md" {...externalProps(block.button.href)}>
              <span>{block.button.label}</span>
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          )}
        </div>
        {block.aside && (
          <aside className="lg:col-span-5 border border-surface-border bg-background p-6 space-y-4">
            {block.aside.heading && (
              <h3 className="text-xs uppercase tracking-wider font-bold text-brand-orange">{block.aside.heading}</h3>
            )}
            <ul className="divide-y divide-surface-border">
              {block.aside.items.map((item) => (
                <li key={item.title} className="py-3 flex items-baseline justify-between gap-4">
                  <span className="text-sm font-semibold text-text-primary">{item.title}</span>
                  {item.detail && <span className="text-xs font-mono uppercase text-text-secondary">{item.detail}</span>}
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </SectionContainer>
  );
}

// ---------- tags ----------

export function TagsBlock({ block, dark }: { block: BlockOf<"tags"> } & Surface) {
  return (
    <SectionContainer id={block.id} darkSurface={dark} className="py-10 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {block.eyebrow && (
          <h2 className="text-xs uppercase tracking-widest font-bold text-brand-orange shrink-0 md:w-48">{block.eyebrow}</h2>
        )}
        <ul className="flex flex-wrap gap-2">
          {block.items.map((tag) => (
            <li key={tag.label}>
              {tag.href ? (
                <Link
                  href={tag.href}
                  className="inline-block border border-surface-border bg-background px-3 py-1.5 text-xs font-semibold text-text-primary hover:border-brand-orange hover:text-brand-orange transition-colors"
                  {...externalProps(tag.href)}
                >
                  {tag.label}
                </Link>
              ) : (
                <span className="inline-block border border-surface-border bg-background px-3 py-1.5 text-xs text-text-secondary">
                  {tag.label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </SectionContainer>
  );
}

// ---------- group (portfolio) ----------

export function GroupBlock({ block, dark }: { block: BlockOf<"group"> } & Surface) {
  return (
    <SectionContainer id={block.id} darkSurface={dark} className="scroll-mt-24">
      <div className="space-y-8">
        <SectionHeading eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {block.items.map((item) => (
            <li key={item.name} className="border border-surface-border bg-background p-5 space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-bold text-text-primary">{item.name}</h3>
                {item.location && (
                  <span className="text-[10px] font-mono uppercase text-brand-orange shrink-0">{item.location}</span>
                )}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </SectionContainer>
  );
}

// ---------- prose (legal text) ----------

export function ProseBlock({ block }: { block: BlockOf<"prose"> }) {
  // Group consecutive bullets into one list.
  const parts: { kind: "paragraph" | "bullets"; items: string[] }[] = [];
  for (const piece of block.body) {
    const last = parts[parts.length - 1];
    if (piece.kind === "bullet" && last?.kind === "bullets") last.items.push(piece.text);
    else parts.push({ kind: piece.kind === "bullet" ? "bullets" : "paragraph", items: [piece.text] });
  }
  return (
    <section id={block.id} className="bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        {block.heading && (
          <h2 className="text-xl font-display font-bold text-text-primary uppercase tracking-tight">{block.heading}</h2>
        )}
        {parts.map((part, i) =>
          part.kind === "bullets" ? (
            <ul key={i} className="list-disc pl-5 space-y-2 text-sm text-text-secondary leading-relaxed marker:text-brand-orange">
              {part.items.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ) : (
            <p key={i} className="text-sm text-text-secondary leading-relaxed">
              {part.items[0]}
            </p>
          )
        )}
      </div>
    </section>
  );
}
