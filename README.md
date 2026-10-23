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
  app/               root layout, (site) pages, admin, api, robots/sitemap, icons, globals.css
    api/contact/     POST endpoint: validates inquiries and emails them over SMTP
  components/
    layout/          header (scroll-spy nav), footer, section-container
    blocks/          one component per content block type + page renderer
    contact/         contact form
    admin/           admin shell and content editor
    ui/              button (cva), section-background
  lib/
    content-schema.ts content/site.json schema (validated at build and on save)
    pages.ts         page routes + per-page SEO metadata
    site.ts          URL + meta constants (overridable via NEXT_PUBLIC_SITE_URL)
    utils.ts         cn()
  services/          submitInquiry (client side of the contact form)
  types/             shared interfaces
docs/
  content/           source-of-truth copy briefs (v3 content, portfolio page)
  branding/          raw brand source files (git-ignored)
```

## Content

All editorial copy, images, links, SEO titles and portfolio data live in `content/site.json`, never in JSX. Edit it from the admin panel (`/admin/content`) or by hand. The schema in `src/lib/content-schema.ts` is enforced at build time, so invalid content fails the build instead of shipping. Source briefs are preserved in `docs/content/`.

Deploy domain is `https://entrpryz.com` by default; override via `NEXT_PUBLIC_SITE_URL`.

## Pages

`/` · `/about` · `/services` · `/services/ai-agents` · `/services/sap-business-one-health-check` · `/services/mis-assessment-development-roadmap` · `/portfolio` · `/contact` · `/privacy-policy`

Each page is a list of content blocks in `content/site.json` (rendered by `src/components/blocks/`); routes live in `src/app/(site)/` and map to content keys in `src/lib/pages.ts`. Copy follows the CEO-approved content in `docs/content/website-content-2026-10-approved.md`.

## Contact form

The form posts to `/api/contact`, which validates input (shared rules in `src/lib/contact-validation.ts`), applies a same-origin check, honeypot, fill-time check and per-IP rate limit, then sends the inquiry via SMTP (`nodemailer`) with the visitor as `Reply-To`.

Configure SMTP in Vercel environment variables — see `.env.example`. For local testing copy it to `.env.local`. Inquiries go to `CONTACT_TO_EMAIL` (default `connect@entrpryz.com`).

## Admin panel

`/admin` is protected by a username/password login (`/admin/login`). Credentials come from `ADMIN_USERNAME` / `ADMIN_PASSWORD`, and sessions are signed with `ADMIN_SESSION_SECRET` (8-hour, httpOnly, SameSite=Strict cookie). `src/middleware.ts` guards every `/admin` route and the page re-checks the session server-side. Failed logins are throttled per IP.

Set all three variables in Vercel (see `.env.example`); locally they live in the git-ignored `.env`.

### Content editor

`/admin/content` lists every piece of site content by section, with full-text search, a field-type filter (text, paragraphs, images, links, emails), a "changed only" view, and "View on site" links to each section.

Publishing commits `content/site.json` to GitHub, and Vercel redeploys (live in ~1–2 minutes). Uploaded images (JPG/PNG/WebP, max 4 MB, checked by file signature) are committed to `public/images/uploads/` under a content-hash filename. Saves are validated server-side against the schema and rejected if the file changed since it was loaded.

Requires `GITHUB_TOKEN` (fine-grained, this repo only, Contents read/write), `GITHUB_REPO` (`owner/name`) and optionally `GITHUB_BRANCH`. Without them the editor is read-only.
