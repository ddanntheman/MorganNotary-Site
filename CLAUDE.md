# Claude / LLM contributor guide

Mirrors `AGENTS.md` for any Claude-family or similar LLM operator. The most
important rules:

1. **UPL compliance** — never add copy that says a notary will "explain,"
   "interpret," or "advise" on legal documents. Virginia § 54.1-3900.
2. **NAP single source of truth** — use `@lib/nap`. Never hardcode phone,
   email, or address.
3. **Pricing** — every line in pricing tables must be auditable against the
   Virginia $10-per-act statutory cap.
4. **Testimonials** — composite until clients opt in with written consent.
5. **Zero-JS by default** — do not promote pages to client islands unless a
   feature truly requires interactivity.

See `AGENTS.md` for the full contributor guide, `docs/runbook.md` for the
operational playbook, and `docs/strategy.md` for the launch contract.
