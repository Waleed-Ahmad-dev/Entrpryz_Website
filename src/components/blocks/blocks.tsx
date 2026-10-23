import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, MapPin, Plus, Quote } from "lucide-react";
import type { BlockOf } from "@/lib/content-schema";
import { SectionContainer } from "@/components/layout/section-container";
import { SectionBackground } from "@/components/ui/section-background";
import { ButtonLink } from "@/components/ui/button";
import { IconTile } from "@/components/ui/content-icon";
import { cn } from "@/lib/utils";
import { Eyebrow, SectionHeading, TextLink, externalProps, initials } from "./section-parts";

type Surface = { dark: boolean };

function CheckDot({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange",
        className
      )}
      aria-hidden="true"
    >
      <Check className="h-3 w-3" strokeWidth={3} />
    </span>
  );
}

// ---------- hero ----------

export function HeroBlock({ block }: { block: BlockOf<"hero"> }) {
  // "Technology. Simplified." → second sentence in the brand gradient.
  const sentences = block.heading.match(/[^.!?]+[.!?]+/g);
  const twoPart = sentences && sentences.length === 2 && block.heading.length <= 40;
  const large = block.heading.length <= 40;

  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-20 md:pt-24 md:pb-28">
      <SectionBackground glowStrength="medium" />
      {block.image && (
        <div className="absolute inset-y-0 right-0 w-full lg:w-[62%] pointer-events-none" aria-hidden="true">
          <Image
            src={block.image}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 62vw"
            className="object-cover opacity-[0.22] [mask-image:linear-gradient(to_left,black_30%,transparent_95%)] lg:opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      )}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className={cn("space-y-7", block.aside ? "lg:col-span-7" : "lg:col-span-9")}>
            {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
            <h1
              className={cn(
                "font-display font-bold tracking-tight text-text-primary",
                large ? "text-5xl sm:text-6xl lg:text-7xl leading-[1.02]" : "text-4xl sm:text-5xl lg:text-6xl leading-[1.08]"
              )}
            >
              {twoPart ? (
                <>
                  {sentences[0].trim()} <span className="text-gradient">{sentences[1].trim()}</span>
                </>
              ) : (
                block.heading
              )}
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl leading-relaxed">{block.body}</p>
            {block.buttons.length > 0 && (
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {block.buttons.map((b, i) => (
                  <ButtonLink
                    key={b.href + i}
                    href={b.href}
                    size="lg"
                    variant={i === 0 ? "primary" : "outline"}
                    {...externalProps(b.href)}
                  >
                    <span>{b.label}</span>
                    {i === 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </ButtonLink>
                ))}
              </div>
            )}
          </div>

          {block.aside && (
            <aside className="lg:col-span-5 relative">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-brand-orange/40 via-surface-border/40 to-transparent" aria-hidden="true" />
              <div className="relative rounded-2xl bg-surface-card/90 backdrop-blur-md p-6 sm:p-7 shadow-lift">
                {block.aside.heading && (
                  <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange mb-5">
                    {block.aside.heading}
                  </h2>
                )}
                <dl className="divide-y divide-surface-border/70">
                  {block.aside.items.map((item) => (
                    <div key={item.title} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                      <CheckDot className="mt-0.5" />
                      <div className="space-y-0.5">
                        <dt className="text-sm font-semibold text-text-primary">{item.title}</dt>
                        {item.detail && <dd className="text-sm text-text-secondary">{item.detail}</dd>}
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------- stats ----------

export function StatsBlock({ block, dark }: { block: BlockOf<"stats"> } & Surface) {
  return (
    <SectionContainer darkSurface={dark} className="py-14 md:py-16">
      <dl className="reveal grid grid-cols-2 lg:grid-cols-4 rounded-2xl border border-surface-border card-surface overflow-hidden">
        {block.items.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              "flex flex-col-reverse justify-start gap-2 p-6 sm:p-8",
              i % 2 === 1 && "border-l border-surface-border",
              i >= 2 && "border-t lg:border-t-0 border-surface-border",
              i === 2 && "lg:border-l"
            )}
          >
            <dt className="text-sm text-text-secondary">{s.label}</dt>
            <dd
              className={cn(
                "font-display font-bold tracking-tight text-gradient leading-tight",
                s.value.length > 8 ? "text-2xl sm:text-3xl lg:text-[2rem]" : "text-3xl sm:text-4xl lg:text-5xl"
              )}
            >
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </SectionContainer>
  );
}

// ---------- cards ----------

function FeaturedCard({ card }: { card: BlockOf<"cards">["items"][number] }) {
  return (
    <article
      id={card.id}
      className="reveal relative overflow-hidden rounded-3xl border border-brand-orange/30 bg-gradient-to-br from-brand-orange/[0.14] via-surface-card to-surface-card p-8 sm:p-12"
    >
      <div className="glow-orb absolute -right-24 -top-24 h-80 w-80 opacity-70" aria-hidden="true" />
      <div className="relative flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
        <div className="space-y-4 flex-1">
          {card.badge && (
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-3 py-1 text-xs font-semibold text-background">
              <span className="h-1.5 w-1.5 rounded-full bg-background/70 animate-pulse" aria-hidden="true" />
              {card.badge}
            </span>
          )}
          <h3 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-text-primary">{card.title}</h3>
          {card.description && <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">{card.description}</p>}
        </div>
        {card.links.length > 0 && (
          <div className="flex flex-wrap gap-3 shrink-0">
            {card.links.map((l, i) => (
              <ButtonLink key={l.href + i} href={l.href} size="lg" variant={i === 0 ? "primary" : "outline"} {...externalProps(l.href)}>
                <span>{l.label}</span>
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export function CardsBlock({ block, dark }: { block: BlockOf<"cards"> } & Surface) {
  const count = block.items.length;
  if (count === 1 && !block.heading) {
    return (
      <SectionContainer id={block.id} darkSurface={dark} className="py-14 md:py-20">
        <FeaturedCard card={block.items[0]} />
      </SectionContainer>
    );
  }
  const cols = count === 2 || count === 4 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <SectionContainer id={block.id} darkSurface={dark}>
      <div className="space-y-14">
        <SectionHeading eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
        <div className={cn("grid grid-cols-1 gap-6", cols)}>
          {block.items.map((card) => (
            <article
              key={card.title}
              id={card.id}
              className={cn(
                "reveal group relative flex flex-col gap-5 rounded-2xl border card-surface p-6 sm:p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lift",
                card.badge ? "border-brand-orange/40" : "border-surface-border hover:border-brand-orange/40"
              )}
            >
              {card.image && (
                <div className="relative -mx-2 -mt-2 sm:-mx-3 sm:-mt-3 aspect-[16/9] overflow-hidden rounded-xl bg-surface-dark">
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent" />
                </div>
              )}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  {card.icon && <IconTile name={card.icon} />}
                  {card.badge && (
                    <span className="rounded-full bg-brand-orange/15 px-2.5 py-0.5 text-xs font-semibold text-brand-orange">
                      {card.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-display font-semibold tracking-tight text-text-primary">{card.title}</h3>
                {card.description && <p className="text-[15px] text-text-secondary leading-relaxed">{card.description}</p>}
              </div>

              {card.bullets.length > 0 && (
                <ul className="space-y-2.5">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-text-primary">
                      <CheckDot className="mt-px" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {card.meta.length > 0 && (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {card.meta.map((m) => (
                    <div key={m.title} className="rounded-xl bg-background/60 border border-surface-border px-4 py-3">
                      <dt className="text-xs text-text-secondary">{m.title}</dt>
                      {m.detail && <dd className="text-sm font-semibold text-text-primary">{m.detail}</dd>}
                    </div>
                  ))}
                </dl>
              )}

              {card.links.length > 0 && (
                <div className="mt-auto pt-1 flex flex-wrap gap-x-6 gap-y-2">
                  {card.links.map((l, i) => (
                    <TextLink key={l.href + i} href={l.href}>
                      {l.label}
                    </TextLink>
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
      <div className="space-y-14">
        <SectionHeading eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
        <ol className={cn("relative grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10", cols)}>
          {/* Connector line behind the step numbers on wide screens */}
          <div
            className="hidden lg:block absolute top-6 left-6 right-6 h-px bg-gradient-to-r from-brand-orange/60 via-surface-border to-surface-border/0"
            aria-hidden="true"
          />
          {block.items.map((step, i) => (
            <li key={step.title} className="reveal relative space-y-4">
              <span className="relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-brand-orange/40 bg-background font-display text-lg font-bold text-brand-orange shadow-[0_0_0_6px_rgb(var(--background))]">
                {i + 1}
              </span>
              <h3 className="text-lg font-display font-semibold text-text-primary">{step.title}</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">{step.description}</p>
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
    <SectionContainer id={block.id} darkSurface={dark}>
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
        {titled ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {block.items.map((item) => (
              <li
                key={item.description}
                className="reveal flex flex-col gap-4 rounded-2xl border border-surface-border card-surface p-6 transition duration-300 hover:border-brand-orange/40"
              >
                {item.icon ? <IconTile name={item.icon} /> : <CheckDot className="h-7 w-7" />}
                <div className="space-y-1.5">
                  {item.title && <h3 className="text-base font-display font-semibold text-text-primary">{item.title}</h3>}
                  <p className="text-[15px] text-text-secondary leading-relaxed">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {block.items.map((item) => (
              <li key={item.description} className="reveal flex items-start gap-3.5 border-b border-surface-border/70 py-4">
                {item.icon ? <IconTile name={item.icon} size="sm" /> : <CheckDot className="mt-0.5" />}
                <span className="text-base text-text-primary leading-relaxed">{item.description}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SectionContainer>
  );
}

// ---------- faq ----------

export function FaqBlock({ block, dark }: { block: BlockOf<"faq"> } & Surface) {
  return (
    <SectionContainer id={block.id} darkSurface={dark}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
        </div>
        <div className="lg:col-span-8 space-y-3">
          {block.items.map((qa) => (
            <details
              key={qa.question}
              className="reveal group rounded-2xl border border-surface-border bg-surface-card/50 px-5 sm:px-6 transition-colors open:border-brand-orange/40 open:bg-surface-card"
            >
              <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <h3 className="text-base sm:text-lg font-semibold text-text-primary">{qa.question}</h3>
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-surface-border text-brand-orange transition group-open:rotate-45 group-open:border-brand-orange/50 group-open:bg-brand-orange/10">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </span>
              </summary>
              <p className="pb-6 -mt-1 text-[15px] text-text-secondary leading-relaxed max-w-3xl">{qa.answer}</p>
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
    <section className="relative bg-background py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal relative overflow-hidden rounded-3xl border border-brand-orange/25 bg-gradient-to-br from-brand-orange/20 via-surface-card to-surface-card px-6 py-14 sm:px-12 md:py-20 text-center">
          <div className="absolute inset-0 abstract-grid opacity-60" aria-hidden="true" />
          <div className="glow-orb absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-96" aria-hidden="true" />
          <div className="relative mx-auto max-w-3xl space-y-6">
            <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-text-primary leading-[1.1]">
              {block.heading}
            </h2>
            {block.body && <p className="text-lg text-text-secondary">{block.body}</p>}
            <div className="pt-2">
              <ButtonLink href={block.button.href} size="lg" {...externalProps(block.button.href)}>
                <span>{block.button.label}</span>
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- profile ----------

export function ProfileBlock({ block, dark }: { block: BlockOf<"profile"> } & Surface) {
  return (
    <SectionContainer id={block.id} darkSurface={dark}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-4">
          {block.image ? (
            <div className="reveal relative mx-auto max-w-sm">
              <div className="absolute -inset-3 rounded-[2rem] border border-brand-orange/25 rotate-2" aria-hidden="true" />
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand-orange/20 to-transparent blur-2xl" aria-hidden="true" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-surface-border bg-surface-dark">
                <Image src={block.image} alt={block.name} fill className="object-cover" sizes="(max-width: 1024px) 384px, 400px" />
              </div>
            </div>
          ) : (
            <div className="reveal flex items-center justify-center rounded-3xl border border-surface-border card-surface aspect-[4/3] max-w-sm mx-auto">
              <span
                className="inline-flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-brand-amber to-brand-hover font-display text-4xl font-bold text-background shadow-glow"
                aria-hidden="true"
              >
                {initials(block.name)}
              </span>
            </div>
          )}
        </div>
        <div className="lg:col-span-8 space-y-6">
          <SectionHeading eyebrow={block.eyebrow} heading={block.name} />
          <div className="space-y-4">
            {block.paragraphs.map((p) => (
              <p key={p} className="text-lg text-text-secondary leading-relaxed">
                {p}
              </p>
            ))}
          </div>
          {block.quote && (
            <figure className="reveal relative rounded-2xl border border-brand-orange/25 bg-brand-orange/[0.06] p-6 sm:p-8">
              <Quote className="absolute -top-4 left-6 h-8 w-8 rounded-full bg-background p-1.5 text-brand-orange" aria-hidden="true" />
              <blockquote className="text-xl sm:text-2xl font-display font-semibold leading-snug text-text-primary">
                {block.quote}
              </blockquote>
            </figure>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}

// ---------- text ----------

export function TextBlock({ block, dark }: { block: BlockOf<"text"> } & Surface) {
  const isNote = !block.heading && !block.eyebrow && !block.aside && !block.button;
  if (isNote) {
    return (
      <SectionContainer id={block.id} darkSurface={dark} className="py-12 md:py-14">
        <div className="mx-auto max-w-4xl rounded-2xl border border-surface-border bg-surface-card/50 p-6 text-center">
          {block.paragraphs.map((p) => (
            <p key={p} className="text-sm text-text-secondary leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </SectionContainer>
    );
  }
  return (
    <SectionContainer id={block.id} darkSurface={dark} className={!block.aside && !block.button ? "py-14 md:py-16" : undefined}>
      <div className={cn("grid grid-cols-1 gap-12 items-center", block.aside && "lg:grid-cols-12")}>
        <div className={cn("space-y-6", block.aside ? "lg:col-span-7" : "max-w-4xl")}>
          <SectionHeading eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
          {block.paragraphs.map((p) => (
            <p key={p} className="text-lg text-text-secondary leading-relaxed">
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
          <aside className="reveal lg:col-span-5 rounded-2xl border border-surface-border card-surface p-6 sm:p-7">
            {block.aside.heading && (
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange mb-4">{block.aside.heading}</h3>
            )}
            <ul className="space-y-3">
              {block.aside.items.map((item) => (
                <li key={item.title} className="flex items-center gap-3.5">
                  {item.detail ? (
                    <span
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-amber to-brand-hover font-display text-sm font-bold text-background"
                      aria-hidden="true"
                    >
                      {initials(item.title)}
                    </span>
                  ) : (
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-raised text-brand-orange" aria-hidden="true">
                      <MapPin className="h-4 w-4" />
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                    {item.detail && <p className="text-sm text-text-secondary">{item.detail}</p>}
                  </div>
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
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange shrink-0 md:w-48">{block.eyebrow}</h2>
        )}
        <ul className="flex flex-wrap gap-2">
          {block.items.map((tag) => (
            <li key={tag.label}>
              {tag.href ? (
                <Link
                  href={tag.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-surface-card px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-brand-orange/50 hover:text-brand-orange"
                  {...externalProps(tag.href)}
                >
                  {tag.label}
                  {tag.href.startsWith("#") && <ArrowDown className="h-3.5 w-3.5 text-brand-orange" aria-hidden="true" />}
                </Link>
              ) : (
                <span className="inline-block rounded-full border border-surface-border/80 bg-surface-card/50 px-3.5 py-1.5 text-sm text-text-secondary">
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
    <SectionContainer id={block.id} darkSurface={dark}>
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <SectionHeading eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
          <span className="shrink-0 self-start sm:self-end rounded-full border border-surface-border bg-surface-card px-3 py-1 text-xs font-medium text-text-secondary">
            {block.items.length} {block.items.length === 1 ? "engagement" : "engagements"}
          </span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {block.items.map((item) => (
            <li
              key={item.name}
              className="reveal group relative overflow-hidden rounded-2xl border border-surface-border card-surface p-6 space-y-3 transition duration-300 hover:border-brand-orange/40"
            >
              <span
                className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-brand-orange to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
              <h3 className="text-base font-display font-semibold text-text-primary">{item.name}</h3>
              <p className="text-[15px] text-text-secondary leading-relaxed">{item.description}</p>
              {item.location && (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-xs font-medium text-brand-orange">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {item.location}
                </span>
              )}
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
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-7 space-y-4 border-b border-surface-border/60">
        {block.heading && (
          <h2 className="text-2xl font-display font-semibold tracking-tight text-text-primary">{block.heading}</h2>
        )}
        {parts.map((part, i) =>
          part.kind === "bullets" ? (
            <ul key={i} className="space-y-2.5">
              {part.items.map((t) => (
                <li key={t} className="flex items-start gap-3 text-base text-text-secondary leading-relaxed">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p key={i} className="text-base text-text-secondary leading-relaxed">
              {part.items[0]}
            </p>
          )
        )}
      </div>
    </section>
  );
}
