# Entrpryz — Technology. Simplified.

Official website for [Entrpryz](https://entrpryz.com) — ERP, software development, and IT services backed by 25+ years of real-world technology experience.

## Stack

- **Next.js 16** (App Router, static prerendering, Turbopack) on **React 19**, **Zod 4** for content validation
- **TypeScript** (strict)
- **Tailwind CSS** (CSS-variable tokens in `globals.css` — single source of truth)
- **lucide-react** icons, **class-variance-authority** UI variants

## Commands

```bash
npm install          # install dependencies
npm run dev          # start dev server on localhost:3000
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint (Next.js core-web-vitals + TypeScript rules)
npm test             # unit tests (offline; run in CI)
npm run test:github  # live check of the GitHub client (see below)
npm run build        # production build
npm run start        # serve the production build
```

## Tests

`npm test` runs the unit tests (Vitest). They are offline and fast, and CI runs them on every push and pull request.

`npm run test:github` checks the CMS's GitHub client against the real GitHub API: reading `content/site.json`, and that GitHub's rejections are classified correctly (someone else published, a write without a version, a missing branch). It **commits nothing**: every write it sends must be rejected, and each one carries the file's current bytes. It needs the admin panel's `GITHUB_TOKEN` and `GITHUB_REPO` (optionally `GITHUB_BRANCH`) in your shell or `.env.local`. Run it by hand after changing `src/lib/github-store.ts` or the token; it never runs in CI.

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

Canonical origin is `https://www.entrpryz.com` (the apex 308-redirects to www); override via `NEXT_PUBLIC_SITE_URL`.

## Icons and share image

The browser-tab icon (`/icon`, 512×512) and the iOS home-screen icon (`/apple-icon`, 180×180) are generated at build time from the CMS's **square logo** (`images.logoSquare`, `src/app/icon.tsx` / `apple-icon.tsx`). The share card (`/opengraph-image`) uses the main logo. Both logos must be PNG or JPG: the renderer can't draw WebP, so the content schema rejects WebP for them and the build fails if a file's real format is wrong. `src/app/favicon.ico` is a fixed file (the .ico format can't be generated); regenerate it by hand if the logo changes.

## Pages

`/` · `/about` · `/services` · `/services/ai-agents` · `/services/sap-business-one-health-check` · `/services/mis-assessment-development-roadmap` · `/portfolio` · `/contact` · `/privacy-policy`

Each page is a list of content blocks in `content/site.json` (rendered by `src/components/blocks/`); routes live in `src/app/(site)/` and map to content keys in `src/lib/pages.ts`. Copy follows the CEO-approved content in `docs/content/website-content-2026-10-approved.md`.

## Contact form

The form posts to `/api/contact`, which validates input (shared rules in `src/lib/contact-validation.ts`), accepts only requests whose `Origin` is the site's own (`NEXT_PUBLIC_SITE_URL`, its www/apex twin, or this Vercel deployment's URLs; any localhost port under `next dev`), caps the body at 16 KB, and applies a honeypot, fill-time check and per-IP rate limit, then sends the inquiry via SMTP (`nodemailer`) with the visitor as `Reply-To`.

Configure SMTP in Vercel environment variables — see `.env.example`. For local testing copy it to `.env.local`. To test the form against a local production build (`next start`), also set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`, or the origin check will reject it. Inquiries go to `CONTACT_TO_EMAIL` (default `connect@entrpryz.com`).

## Admin panel

`/admin` is protected by a username/password login (`/admin/login`). Credentials come from `ADMIN_USERNAME` / `ADMIN_PASSWORD`, and sessions are signed with `ADMIN_SESSION_SECRET` (8-hour, httpOnly, SameSite=Strict cookie). `src/proxy.ts` guards every `/admin` route and the page re-checks the session server-side. Failed logins are throttled per IP.

Set all three variables in Vercel (see `.env.example`); locally they live in the git-ignored `.env`.

### Content editor

`/admin/content` lists every piece of site content by section, with full-text search, a field-type filter (text, paragraphs, images, links, emails), a "changed only" view, and "View on site" links to each section.

Publishing makes **one Git commit** containing `content/site.json` and any images it newly uses, and Vercel redeploys (live in ~1–2 minutes). Uploading an image (JPG/PNG/WebP, max 4 MB, checked by file signature) only stores it in GitHub as an unattached blob under a content-hash name: nothing is committed or deployed until you publish, images you upload but don't end up using are never committed, and at publish time each image is re-checked against its name. Saves are validated server-side against the schema. Each page's "last updated" date (the sitemap `lastmod`) is set by the server: today for pages whose content changed, the repo's date for the rest; after publishing, the editor shows exactly what was committed. A publish is rejected only if `content/site.json` itself changed since it was loaded; unrelated commits (e.g. a code push) don't block it.

Requires `GITHUB_TOKEN` (fine-grained, this repo only, Contents read/write), `GITHUB_REPO` (`owner/name`) and optionally `GITHUB_BRANCH`. Without them the editor is read-only.

### Publishing safety and rollback

"Review & Publish" shows every changed field before anything is committed. Each publish is one Git commit by "Entrpryz Admin". To undo one, run `git revert <commit>` and push (or use Vercel → Deployments → Instant Rollback for an immediate switch back). Admin security details and the October 2026 audit status are in `docs/technical-audit-response.md`.

Optional admin protections (set in Vercel): `ADMIN_TOTP_SECRET` for a second factor (`npm run admin:totp -- <username>` generates one), and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` for Cloudflare Turnstile on the login and contact forms.
