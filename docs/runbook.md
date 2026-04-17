# Operational runbook — morgannotary.com

Short, practical playbook for running the site after launch.

## 1. Domain + DNS

1. Purchase / transfer `morgannotary.com`.
2. Add the domain to Vercel → Project → Domains.
3. Accept Vercel's auto-generated DNS records (A / CNAME).
4. Confirm HTTPS resolves and redirects `www → apex`.

## 2. Vercel

- **Framework preset:** Astro
- **Build command:** `pnpm build`
- **Output directory:** `dist`
- **Node version:** 22.x

Environment variables (Production + Preview):

| Key                           | Value                           |
| ----------------------------- | ------------------------------- |
| `PUBLIC_SITE_URL`             | `https://morgannotary.com`      |
| `PUBLIC_FORMSPREE_CLIENT_ID`  | Formspree form ID               |
| `PUBLIC_FORMSPREE_PARTNER_ID` | Formspree form ID               |
| `PUBLIC_SQUARE_APPT_URL`      | Square Appointments booking URL |
| `PUBLIC_PLAUSIBLE_DOMAIN`     | `morgannotary.com`              |

## 3. Formspree

1. Create two free forms: "Client bookings" and "Partner inquiries".
2. Turn on Cloudflare Turnstile; set `PUBLIC_TURNSTILE_SITE_KEY`.
3. Route submissions to `morgan@morgannotary.com`.

## 4. Square Appointments

1. Set up a free Square Appointments account.
2. Add each service with the same price as the Pricing page (don't drift).
3. Publish the booking URL and set it as `PUBLIC_SQUARE_APPT_URL`.

## 5. Google Business Profile / local SEO

1. Claim `Morgan Danner, Notary LLC` on Google Business Profile.
2. Category: `Notary Public`. Service areas: the seven served cities.
3. Use the exact NAP from `src/lib/nap.ts`.
4. Create one Post per service referencing the corresponding page.

## 6. Search Console + analytics

1. Add `morgannotary.com` to Google Search Console (DNS verification).
2. Submit `https://morgannotary.com/sitemap-index.xml`.
3. Add to Bing Webmaster Tools with the same sitemap.
4. Verify Plausible is receiving pageviews.

## 7. Ongoing

- Review FAQ items quarterly.
- New blog post every 4–6 weeks.
- Rotate real testimonials in once three clients have opted in with
  written consent; update the `isComposite` flag.
- Run `pnpm validate:all` before any merge.

## 8. Incident recovery

- **Site down?** Re-deploy the last known-good commit from the Vercel dashboard.
- **Form broken?** Check Formspree quota; confirm form IDs in Vercel env.
- **Booking URL broken?** Confirm Square URL; update env.
- **Phone changed?** Update `src/lib/nap.ts`, push, update GBP in parallel.
