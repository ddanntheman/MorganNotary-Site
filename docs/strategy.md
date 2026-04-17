# Strategy + requirements

This site was built against an extensive requirements specification covering
design system, SEO, content architecture, UPL compliance, and launch-gate
KPIs. Original docs live next to this file as `REQUIREMENTS.html` and
`BRAND-GUIDE.html`.

The key commitments encoded in this codebase:

- **16 indexable pages** at launch (home, about, pricing, contact, FAQ,
  peoples-rate, 5 services, 7 service areas, blog index, 3 legal, 404).
- **Lighthouse ≥95** across Performance, Accessibility, Best Practices, SEO.
- **LCP < 1.8s** on 4G throttle, **CLS < 0.05**, **<20KB JS per page** before
  third-party scripts, **<400KB total weight** excluding fonts.
- **WCAG 2.2 AA** — 0 violations (axe-core + manual review).
- **Cookieless analytics** (Plausible). GA4 optional and behind a
  VCDPA-compliant consent banner if ever enabled.
- **UPL safety** — no "explain / interpret / advise" copy; enforced in CI.
- **NAP singular** — `src/lib/nap.ts` is the only source.
- **Pricing auditable** against the Virginia $10 statutory cap per notarial
  act (§ 47.1-19).

Non-goals (by contract):

- No custom booking engine (Square Appointments embed only).
- No user accounts or auth.
- No live-chat widget.
- No blog comments.
- No newsletter capture (stubbed only).
- No A/B testing framework.
- No multi-language / i18n.
- No CRM integration.
- No mobile app.
- No custom illustrations outside the brand system.

See `runbook.md` for deployment + operations.
