---
name: building-the-site
description: Rules for building and maintaining the Morgan Danner Notary website.
---

# Building the site

When you are asked to add, modify, or extend anything on the Morgan Danner
Notary site, follow these rules strictly. They encode requirements from the
original launch spec.

## 1. UPL compliance is non-negotiable

Virginia Code § 54.1-3900 prohibits non-attorney notaries from explaining,
interpreting, or advising on legal documents. Never write copy like:

- "I'll explain your loan documents."
- "We can interpret what this means."
- "I'll advise you on..."

Acceptable phrasing patterns:

- "I'll direct you through each page and show you where to sign."
- "I'll point out the signature and notarial blocks."
- "If you need the document explained, call your attorney or lender — I'll
  pause the signing while you get clarity."

The `scripts/check-upl.mjs` CI gate will catch obvious violations.

## 2. NAP (Name / Address / Phone) has one source

`src/lib/nap.ts` is the only place phone/email/address/hours may live.
Everything else imports from `@lib/nap`. The `scripts/validate-nap.mjs` CI
gate catches raw phone numbers in components and pages.

## 3. Pricing must be Virginia-legal

Every notarial-act price must be auditable against the $10-per-act statutory
cap. Package prices (travel, printing, witness coordination) layer on top and
must be described in plain English so an auditor can match each component.

## 4. Content is MDX; types are Zod

All content lives in `src/content/<collection>/*.mdx`. Every collection has
a Zod schema in `src/content/config.ts`. Add new fields there before you
try to use them in MDX frontmatter.

## 5. Zero-JS by default

Astro renders HTML by default. Interactive islands (`client:load`,
`client:idle`) are reserved for genuinely interactive features. The only
island today is the contact form. Don't promote pages to islands on a whim.

## 6. Design tokens in `src/styles/global.css`

Use `@theme` tokens and the small component layer (`btn`, `card`, `pill`,
`eyebrow`, etc.). Avoid arbitrary Tailwind values (`w-[437px]` etc.).

## 7. Ship small, ship fast

- Branch per change, PR early, let Vercel build a preview, iterate.
- `pnpm validate:all` must pass before committing.
- `pnpm build` must succeed before merging.
