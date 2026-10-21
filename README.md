# Entrpryz — Technology. Simplified.

Official website for [Entrpryz](https://entrpryz.com) — ERP, software development, and IT services backed by 25+ years of real-world technology experience.

## Stack

- **Next.js 14** (App Router, static prerendering)
- **TypeScript** (strict)
- **Tailwind CSS** (CSS-variable tokens in `globals.css` — single source of truth)
- **lucide-react** icons, **class-variance-authority** UI variants

## Commands

```bash
npm install          # install dependencies
npm run dev          # start dev server on localhost:3000
npm run typecheck    # tsc --noEmit
npm run build        # production build
npm run start        # serve the production build
```

## Structure

```
src/
  app/               layout + one-pager (`page.tsx`), robots/sitemap, icons, globals.css
    api/contact/     POST endpoint: validates inquiries and emails them over SMTP
  components/
    layout/          header (scroll-spy nav), footer, section-container
    sections/        one section per page block (hero … contact-section)
    portfolio/       portfolio-overview + engagement-filter-grid (client filter)
    ui/              button (cva), section-background
  hooks/             use-active-section (IntersectionObserver)
  lib/
    content.ts       editorial copy source
    portfolio-data.ts track-record / engagements source
    site.ts          URL + meta constants (overridable via NEXT_PUBLIC_SITE_URL)
    utils.ts         cn()
  services/          submitInquiry (client side of the contact form)
  types/             shared interfaces
docs/
  content/           source-of-truth copy briefs (v3 content, portfolio page)
  branding/          raw brand source files (git-ignored)
```

## Content

All editorial copy lives in `src/lib/` (content.ts, portfolio-data.ts), never in JSX. Update copy there and components render it. Source briefs are preserved in `docs/content/`.

Deploy domain is `https://entrpryz.com` by default; override via `NEXT_PUBLIC_SITE_URL`.

## One-pager anchors

`#home` · `#about` · `#services` · `#portfolio` · `#contact` — matches the header nav and the scroll-spy observer.

## Contact form

The form posts to `/api/contact`, which validates input (shared rules in `src/lib/contact-validation.ts`), applies a same-origin check, honeypot, fill-time check and per-IP rate limit, then sends the inquiry via SMTP (`nodemailer`) with the visitor as `Reply-To`.

Configure SMTP in Vercel environment variables — see `.env.example`. For local testing copy it to `.env.local`. Inquiries go to `CONTACT_TO_EMAIL` (default `entrpryz.digital@gmail.com`).
