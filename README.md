# Morgan Danner, Notary LLC — morgannotary.com

Production Astro 5 site for Morgan Danner's boutique mobile-notary business in
Richmond, Virginia. Built to a fixed spec — see `docs/runbook.md` for the
post-launch operational playbook and `docs/strategy.md` for the requirements
summary.

## Stack

- **Framework:** Astro 5.x (static output, zero-JS by default)
- **Content:** MDX via Astro Content Collections, validated with Zod
- **Styling:** Tailwind v4 (CSS-first, `@theme` tokens) + a small, semantic
  component layer in `src/styles/global.css`
- **Interactivity:** Targeted React islands (the contact form). No SPA.
- **Forms:** Formspree (honeypot + Zod client-side validation, optional
  Cloudflare Turnstile)
- **Booking:** Square Appointments embed (lazy-loaded)
- **Analytics:** Plausible (cookieless). GA4 optional with consent.
- **Hosting:** Vercel (static, global edge, free tier)

## Quick start

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

Other scripts:

```bash
pnpm build         # production build to ./dist
pnpm preview       # preview the built site
pnpm lint          # biome check
pnpm typecheck     # astro check
pnpm validate:all  # nap + upl + typecheck
```

## Environment

Copy `.env.example` to `.env` and fill in the public values. Every public
variable must be prefixed `PUBLIC_` so Astro inlines it at build time.

Required for deploy:

- `PUBLIC_SITE_URL` — canonical origin (e.g. `https://morgannotary.com`)
- `PUBLIC_FORMSPREE_CLIENT_ID` — Formspree form for client bookings
- `PUBLIC_FORMSPREE_PARTNER_ID` — Formspree form for partner inquiries
- `PUBLIC_SQUARE_APPT_URL` — Square Appointments embed URL
- `PUBLIC_PLAUSIBLE_DOMAIN` — e.g. `morgannotary.com`

## Project shape

```
src/
├── components/           # Astro + React components
│   ├── forms/            # ContactForm (React island, Zod validated)
│   ├── layout/           # Header, Footer
│   ├── sections/         # Hero, ServicesGrid, PricingTable, CtaStrip, etc.
│   ├── seo/              # BaseHead, JsonLd
│   └── ui/               # Primitives (Button, Pill, Card, PullQuote…)
├── content/              # MDX-first content, Zod-validated
├── layouts/              # BaseLayout
├── lib/                  # nap, services, areas, seo, schema helpers
├── pages/                # Route files (static, zero-JS by default)
└── styles/global.css     # Tailwind v4 tokens + component layer
scripts/
├── validate-nap.mjs      # prevents NAP drift
└── check-upl.mjs         # prevents UPL copy leaks (Va. Code § 54.1-3900)
```

## What must stay true before merging

1. `pnpm typecheck` is clean.
2. `pnpm validate:all` is clean (UPL + NAP + types).
3. `pnpm build` succeeds locally.
4. All 16 public pages resolve and appear in `/sitemap-index.xml`.
5. Pricing matches the Virginia statutory cap of $10 per notarial act.
6. No testimonials contain real-client PII without written consent.
7. No "explain / interpret / advise" copy (UPL).
