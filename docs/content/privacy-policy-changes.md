# Privacy Policy — changes for sign-off

The CEO-approved Privacy Policy (website content document, October 2026) was written for a WordPress build that used Google Analytics (Site Kit), a cookie consent notice and Cloudflare Turnstile. The live site does not use any of these, so publishing the text unchanged would describe processing that does not happen.

The wording and structure are kept. Only the sentences below were changed, to match how the site actually works:

- Hosting: Vercel.
- Contact form: delivered by Gmail; spam is blocked by the site's own checks.
- WhatsApp: a floating button.
- Analytics and tracking: none.
- Cookies: no tracking cookies; one strictly necessary cookie, for admin sign-in only.

**Please confirm or amend each change.** If analytics or Turnstile are added later, restore the original wording for those parts.

| Section | Approved wording | Published wording | Why |
|---|---|---|---|
| SEO description | "…including cookies, analytics and the contact form." | "…including the contact form and server logs." | No analytics or tracking cookies. |
| What we collect: automatic info | "…our hosting servers record technical information… With your consent, Google Analytics also collects information about how visitors use the site." | "…our hosting provider's servers record technical information… We do not use analytics or advertising tools." | No Google Analytics. |
| How we use it | Bullet: "To understand how the website is used, so that we can improve it (only with your consent)." | Removed | Depended on analytics. |
| Legal basis | "…we rely on your consent for analytics cookies, on our legitimate interest…" | "…we rely on our legitimate interest…" | No analytics cookies to consent to. |
| Cookies and analytics (heading) | "Cookies and analytics" | "Cookies" | No analytics. |
| Cookies, paragraph 1 | Consent notice: accept or decline analytics cookies; clear site data to change choice. | "This website does not use analytics, advertising or tracking cookies, so there is no cookie notice to accept or decline." | No consent notice needed. |
| Cookies, paragraph 2 | Google Analytics via Site Kit; `_ga` cookies; choice stored as `entrpryz_consent`. | Removed | None of these are set. |
| Cookies, paragraph 3 | "…cookies… needed for it to work and stay secure, for example for the contact form and, if you sign in as an administrator, for logging in." | "The only cookie the website sets is one that is strictly necessary for administrators to sign in. Visitors who do not sign in receive no cookies from us." | The contact form sets no cookie. |
| Sharing: hosting | "Our web hosting provider, which stores the website and its logs." | "Vercel, our web hosting provider, which stores and serves the website and keeps its server logs." | Names the actual host. |
| Sharing: Cloudflare | "Cloudflare, which protects the website… Turnstile spam check…" | Removed | Cloudflare/Turnstile not used; spam checks run on our own server. |
| Sharing: Google Analytics | "Google, for Google Analytics (with your consent)." | Removed | No analytics. |
| Sharing: email | "Our email provider, which delivers the messages…" | "Google (Gmail), our email provider, which delivers the messages…" | Names the actual provider. |
| Retention | "…Analytics data is kept according to the retention settings in our Google Analytics account." | Sentence removed | No analytics data. |

Not added: the cookie notice ("We use cookies to see how the site is used…"). It only applies when analytics cookies are used.

## Update — October 2026 (technical audit)

Cookieless **Vercel Web Analytics** was added (audit item 3). The policy now says so:

| Section | Before | Now |
|---|---|---|
| SEO description | "…including the contact form and server logs." | "…including the contact form, server logs, visit statistics and your rights." |
| What we collect: automatic info | "We do not use analytics or advertising tools." | "We also use Vercel Web Analytics to count page visits. It does not use cookies or store information that identifies you, and we do not use advertising tools." |
| How we use it | — | Restored bullet: "To understand how the website is used, so that we can improve it." (no consent wording: nothing is stored on the visitor's device) |
| Cookies, paragraph 1 | "…does not use analytics, advertising or tracking cookies…" | "…does not use advertising or tracking cookies, and its visit statistics work without cookies…" |
| Sharing: hosting | "Vercel… keeps its server logs." | "Vercel… keeps its server logs and provides our cookieless visit statistics." |

If Cloudflare Turnstile is switched on for the contact form (audit item 4), restore the approved Cloudflare bullet under "Who we share information with".
