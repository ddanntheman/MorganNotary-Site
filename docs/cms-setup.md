# CMS Setup (Sveltia CMS)

The site now ships with **Sveltia CMS** — a free, git-backed headless
CMS. Editors log in with GitHub, edit content in a WYSIWYG admin UI,
and every save becomes a commit on `main`, which triggers Vercel to
redeploy automatically.

- **Admin URL:** https://morgannotary.com/admin
- **Config:** [`public/admin/config.yml`](../public/admin/config.yml)
- **Shell:** [`public/admin/index.html`](../public/admin/index.html)

## One-time setup (Drew)

### 1. Add your wife as a GitHub collaborator

1. Go to https://github.com/ddanntheman/MorganNotary-Site/settings/access
2. Click **Add people**
3. Enter her GitHub username (or email, if she already has an account)
4. Give her **Write** access (not Admin — Write is enough for the CMS
   to commit and open PRs)
5. She'll get an email invite — she accepts it once.

If she doesn't have a GitHub account yet, send her to
https://github.com/signup. Free account, 30 seconds.

### 2. Make sure the repo is public OR give GitHub OAuth permission

Sveltia CMS authenticates via GitHub OAuth using a built-in hosted
service. If the repo is **public**, it works out of the box. If the
repo is **private**, the first time she logs in she'll be asked to
authorize the Sveltia CMS OAuth app on her account. She clicks
"Authorize" once and it remembers her.

### 3. Done.

Next push to `main` deploys `/admin` to production. She can then go to
https://morgannotary.com/admin and log in.

## Editorial workflow (how your wife uses it)

1. Open https://morgannotary.com/admin
2. Click **Login with GitHub**, authorize once
3. Pick a collection: **Site pages**, **Services**, **Service areas**,
   **FAQ items**, **Testimonials**, or **Blog posts**
4. Click an entry to edit, or **New** to create one
5. Edit the fields (title, subhead, body, SEO, etc.) — the body editor
   is rich-text (WYSIWYG) with bold, italic, headings, links, lists,
   and image uploads
6. Click **Save draft** → **Publish → Publish now** when ready
7. Sveltia opens a PR on the repo. Drew reviews, merges to `main`,
   Vercel redeploys (~60 seconds)

The config is set to **editorial workflow** — every save opens a PR
instead of pushing straight to `main`. That way Drew can review
changes before they go live. If he wants her to publish without
review later, we change `publish_mode: editorial_workflow` to
`publish_mode: simple` in `public/admin/config.yml`.

## What's editable vs. what isn't

**Editable via CMS:**
- Every page's H1, subhead, SEO title/description, body, CTAs
- All 5 services (+ the new POA service): pricing rows, process steps,
  pull quote, consumer/B2B copy
- All 30 service areas: neighborhoods, FAQ, ZIP codes, hero copy
- All FAQ items (questions, answers, topics, featured-on-home flag)
- All testimonials (composite-vs-consent flag included)
- All blog posts

**Intentionally locked (engineering only):**
- Design tokens (colors, fonts, spacing) in `src/styles/global.css`
- Astro components, layouts, routing
- The NAP single-source-of-truth (`src/lib/nap.ts`) — phone, email,
  hours, service area radius
- Icon whitelist in `astro.config.mjs`
- Build config, CI, dependencies

This split keeps the UPL-compliance, NAP consistency, and design
system guardrails in place while giving editors full control of copy.

## Uploading photos

The CMS has a **Media library** — drag-and-drop images into any body
field or use the dedicated media manager. Files go to
`public/images/` and are served from `/images/...`. 3 MB suggested
max per image; resize to ~1600px wide before uploading for best
performance.

## If something breaks

- **Can't log in:** Confirm the GitHub invite was accepted and the
  account has Write access.
- **Edits don't show up:** Look for an open PR at
  https://github.com/ddanntheman/MorganNotary-Site/pulls — editorial
  workflow means changes wait for Drew to merge.
- **CMS UI won't load:** Hard-refresh (Ctrl+Shift+R). Sveltia loads
  from unpkg.com; if unpkg is down, try again in a few minutes.
- **Validation error on save:** The Zod content schema in
  `src/content/config.ts` is the source of truth. The CMS config
  mirrors it. If a field fails validation, the error message will
  show which field and what's wrong.

## Local preview while editing

If Drew wants to preview her edits locally before the Vercel
redeploy:

```bash
pnpm install
pnpm dev
```

Open http://localhost:4321, pull her PR branch, and refresh.
