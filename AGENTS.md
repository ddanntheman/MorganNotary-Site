# Agent / contributor guide

This is the canonical "how to contribute" doc for future Devin sessions and
human collaborators.

## Golden rules

1. **No UPL copy.** A notary who is not a licensed attorney may not explain
   legal documents or give legal advice in Virginia (§ 54.1-3900). Never add
   language like "I'll explain," "interpret," or "advise on" legal terms.
   `scripts/check-upl.mjs` enforces this.
2. **NAP is singular.** Name, address, and phone live in `src/lib/nap.ts`.
   Never hardcode them anywhere else. `scripts/validate-nap.mjs` enforces this.
3. **Pricing ceilings.** Every notarial-act price is auditable against
   Virginia's statutory cap of $10 per act (§ 47.1-19).
4. **No real-client testimonials without written consent.** Composite
   testimonials are marked `isComposite: true`.
5. **Zero-JS by default.** Astro is static-first; React islands are
   intentional exceptions (contact form only, today).

## How to add a page

1. Add an MDX file under the appropriate `src/content/<collection>/` folder.
2. Satisfy the Zod schema in `src/content/config.ts`.
3. If the page renders via a dynamic route (`[slug].astro`), you're done.
4. Run `pnpm validate:all && pnpm build` before committing.

## How to add a service area

1. Create `src/content/areas/<slug>-va.mdx` mirroring an existing entry.
2. Add the slug, coordinates, and drive time to `src/lib/areas.ts`.
3. Add at least two `areaSpecificFaq` entries authored from local knowledge.

## How to add a new service

1. Create `src/content/services/<slug>.mdx`.
2. Add the slug, icon (Lucide name), and metadata to `src/lib/services.ts`.

## Commands

- `pnpm dev` — local development
- `pnpm build` — static production build
- `pnpm preview` — serve the built site locally
- `pnpm typecheck` — Astro + TS strict checking
- `pnpm lint` — Biome
- `pnpm validate:all` — NAP + UPL + types

## Branch + PR conventions

- Feature branches: `devin/<timestamp>-<slug>` or `feature/<slug>`.
- One PR per logical change. Keep diffs small.
- PR must pass CI (lint + typecheck + validate + build) before merge.

## When in doubt

Read `docs/runbook.md` first, then `docs/strategy.md`.
