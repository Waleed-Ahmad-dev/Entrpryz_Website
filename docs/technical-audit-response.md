# Technical audit — response and status (October 2026)

Response to the Entrpryz.com technical audit of 24 October 2026. Each item lists what changed in the code (all in Git history), or what still needs a person to act.

## Priority fixes

| # | Item | Status |
|---|---|---|
| 1 | One canonical host | **Done.** `www.entrpryz.com` everywhere: canonicals, og:url, sitemap, robots.txt Sitemap line, schema. The apex already 308-redirects (permanent) to www, and http 308-redirects to https. If `NEXT_PUBLIC_SITE_URL` is set in Vercel, it must be `https://www.entrpryz.com` or be removed. |
| 2 | Share image and social tags | **Done.** A 1200×630 share card is generated at build (`/opengraph-image`). Every page sends og:image (with size, alt and type), og:type, og:site_name, og:locale and `twitter:card=summary_large_image`. |
| 3 | Analytics and Search Console | **Code done; needs two actions.** Cookieless Vercel Web Analytics is wired in: same-origin, so the CSP is unchanged and no cookie banner is needed. **Turn it on:** Vercel → Project → Analytics → Enable. **Verify ownership:** use a DNS TXT record, or set `GOOGLE_SITE_VERIFICATION` / `BING_SITE_VERIFICATION` in Vercel, then submit `https://www.entrpryz.com/sitemap.xml`. The Privacy Policy now discloses the visit statistics (see `docs/content/privacy-policy-changes.md`). |
| 4 | Cloudflare Turnstile | **Code done; needs keys.** On the contact form and the admin login. It switches on when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are set in Vercel; the CSP then allows `challenges.cloudflare.com` and nothing else. Verification fails closed. When enabled, restore the approved Cloudflare bullet in the Privacy Policy. |
| 5 | Admin login hardening | **Done.** See "Admin security" below. The second factor needs `ADMIN_TOTP_SECRET` set (generate with `npm run admin:totp -- <username>`). |
| 6 | Structured data | **Done.** Organization (both founders, contactPoint, areaServed, sameAs, optional foundingDate), WebSite, WebPage/AboutPage/ContactPage, BreadcrumbList on inner pages, Service on the three service pages and for the three practice areas, Person ×2 on About, FAQPage wherever FAQs appear. **sameAs stays empty until the social profile URLs are entered** in the admin (Site-wide Details → Social Links); the founding date is there too. |
| 7 | Lighter admin page | **Done.** The editor renders one section at a time; search still covers everything. The initial page went from ~1.7 MB / 1,066 fields to ~100 KB / 17 fields. |
| 8 | Preview/confirm before publish; rollback | **Done.** "Review & Publish" lists every changed field (old → new) and asks for confirmation. **Rollback:** every publish is one Git commit by "Entrpryz Admin". To undo one, run `git revert <commit>` and push (or use GitHub's revert), and Vercel redeploys the previous content in 1–2 minutes. Vercel → Deployments → *Instant Rollback* also restores the previous build immediately. |
| 9 | Skip link, footer headings, targets | **Done.** Skip link on every page, footer titles no longer headings, footer links at least 28 px tall, smallest text 12 px. |
| 10 | Service area wording | **Decision needed (Javed).** The visible text is editable in the admin (Site-wide Details → Location; contact page; home stat), and the schema's area list is too (Site-wide Details → Service Area). Today the footer says "Pakistan, UAE and the Global market" while the contact page and schema say "Pakistan and the UAE". Pick one and it can be aligned in minutes. |
| 11 | `cids`, `frontend_lang`, `_ga` cookies | **Not set by this site.** The only cookie this app sets is the admin session cookie (host-only on www, HttpOnly). `cids`/`frontend_lang` are Odoo website cookies and `_ga` is Google Analytics. They are most likely left over from an earlier site on the domain (WordPress with Site Kit sets `_ga`; Odoo sets `cids` and `frontend_lang`), and they stay in a browser until they expire. No current DNS record points a subdomain at an Odoo instance. To confirm: clear entrpryz.com site data, browse the site, and check that they don't come back. |
| 12 | Admin field labels and landmarks | **Done.** Every editor field has a label or aria-label (0 unlabelled), plus a main landmark and a skip link. |
| 13 | Branded 404 and favicon | **Done.** On-brand 404 page (still HTTP 404, noindex) and a multi-size `/favicon.ico`. |
| 14 | Sitemap lastmod, meta keywords | **Done.** Each page's lastmod is the date its content last changed, stamped automatically on publish. Meta keywords removed. |

## Other findings

- **Contact and Privacy descriptions:** lengthened to 143 and 153 characters.
- **Portfolio:** the Yuasa 2026 website audit is now labelled as a separate engagement. Group counts include multiples ("(4)"), so SAP Business One shows 13.
- **security.txt:** added at `/.well-known/security.txt` (expires October 2027; renew yearly).
- **llms.txt:** added, generated from site content, with a line separating Entrpryz from similarly named companies.
- **Colour contrast:** all text/background pairs in the theme pass WCAG AA. The lowest is 4.8:1 (muted labels); body text is 18:1, secondary text 9:1, orange on dark 7.5:1.
- **TLS:** certificate valid until 19 January 2027 (auto-renewed by Vercel).
- **Not changed, on purpose:**
  - **HSTS `includeSubDomains`/`preload`:** this would force HTTPS on every subdomain, including cPanel, webmail and FTP. It's hard to undo once preloaded. Revisit only after confirming every subdomain serves valid HTTPS.
  - **CSP nonces instead of `'unsafe-inline'`:** this would make every page server-rendered on each request instead of served from the CDN. The CSP already allows scripts only from this origin, and all user-editable text is escaped.

## Admin security (the items the audit did not test)

| Question | Answer |
|---|---|
| Login throttling / lockout | 5 failed attempts per IP → 15-minute lockout, plus a site-wide cap of 20 failures per 15 minutes. Each failure waits 0.5 s. Counters live in server memory, so they reset when Vercel starts a new instance. That's why Turnstile and the second factor sit on top. For a hard limit, add a Vercel Firewall rate-limit rule on `POST /admin/login`. |
| Second factor | Optional TOTP (authenticator app, RFC 6238, tested against the RFC vectors). It's on when `ADMIN_TOTP_SECRET` is set. Codes can't be reused. |
| CAPTCHA | Cloudflare Turnstile on the login form when its keys are set (see #4). |
| Password reset | None by design: there is one admin account, defined by `ADMIN_USERNAME`/`ADMIN_PASSWORD` in Vercel. To change it, update the variable and redeploy. |
| Session lifetime | 8 hours, then sign in again. Rotating `ADMIN_SESSION_SECRET` signs everyone out immediately. |
| Cookie flags | `entrpryz_admin_session`: HttpOnly, Secure (production), SameSite=Strict, Path=/, host-only. Its value is HMAC-SHA256 signed; forged or expired cookies are rejected and deleted. |
| CSRF on publish | Publish and upload are Next.js server actions. Next.js rejects requests whose Origin doesn't match the host, and the session cookie is SameSite=Strict. Every action re-checks the session on the server, independent of the middleware. |
| Admin CSP and headers | The admin gets the same CSP and security headers as the public site, plus `X-Frame-Options: DENY`, `noindex` and `Cache-Control: no-store`. |
| Two editors publishing at once | Each publish carries the file version it was based on. If someone else published in between, GitHub rejects the write and the editor says "Content was changed elsewhere… reload". Nothing is overwritten. |
| Validation | Every publish is re-validated on the server against a strict schema: length limits, unknown fields rejected, links limited to site paths/https/mailto, images limited to `/images/*.jpg/png/webp`. Invalid content also fails the build, so the live site keeps its last good version. |
| Image uploads | 4 MB maximum. The format is detected from the file bytes (JPG/PNG/WebP only; SVG refused). Files are stored under a content-hash name, so no uploaded filename reaches the repo. |
| If GitHub is down | The editor opens read-only with a warning, using the deployed content, and publishing is disabled. Nothing is lost; try again later. |
| If Vercel is down or a build fails | The commit is in GitHub, but the live site keeps serving the previous deployment until a build succeeds. A failed build never replaces the live site. |
| Audit trail | Git history: who published (from the admin username), when, and the exact diff. |
| GitHub token scope | Fine-grained, this repository only, Contents read/write. The code can only write `content/site.json` and new files under `public/images/uploads/`. |
