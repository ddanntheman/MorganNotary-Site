# CMS Setup (Sveltia CMS)

The site ships with **Sveltia CMS** — a free, git-backed headless CMS.
Editors log in with GitHub, edit content in a WYSIWYG admin UI, and
every save becomes a commit on `main`, which triggers Vercel to
redeploy automatically.

- **Admin URL:** https://morgannotary.com/admin
- **Config:** [`public/admin/config.yml`](../public/admin/config.yml)
- **Shell:** [`public/admin/index.html`](../public/admin/index.html)
- **OAuth proxy:** [`api/auth.ts`](../api/auth.ts) +
  [`api/callback.ts`](../api/callback.ts) — Vercel Edge functions in
  this same project. No Cloudflare Worker, no Netlify dependency.

---

## First-time setup (Drew, ~10 minutes)

The CMS needs three things wired up once:

1. A GitHub OAuth App (so editors can log in with GitHub)
2. Two env vars on Vercel (so the OAuth proxy works)
3. Morgan invited as a collaborator on the repo

### 1. Create the GitHub OAuth App

1. Go to https://github.com/settings/developers → **OAuth Apps** →
   **New OAuth App**
2. Fill in:
   - **Application name:** `Morgan Notary CMS`
   - **Homepage URL:** `https://morgannotary.com`
   - **Authorization callback URL:**
     `https://morgannotary.com/api/callback`
   - **Application description:** (optional) `Sveltia CMS auth proxy`
3. Click **Register application**
4. On the next screen:
   - Copy the **Client ID** (shown in plain text)
   - Click **Generate a new client secret** — copy the secret
     **immediately**, you won't see it again
5. Keep that tab open; you need both values in step 2.

### 2. Add the two secrets to Vercel

1. Go to your Vercel project →
   **Settings → Environment Variables**
2. Add two variables, **Production** (and Preview if you want the
   preview URLs to auth too):
   - Name: `GITHUB_CLIENT_ID` — value: the Client ID from step 1
   - Name: `GITHUB_CLIENT_SECRET` — value: the client secret from
     step 1
3. Save
4. Trigger a redeploy (Deployments → `…` on the latest → **Redeploy**)
   so the new env vars take effect.

### 3. Add Morgan as a collaborator

1. https://github.com/ddanntheman/MorganNotary-Site/settings/access
2. **Add people** → type her GitHub username (`morgan779`) → **Add**
3. She gets an email invite, clicks accept

On personal repos there's no permission dropdown — collaborators
automatically get **Write** access, which is exactly what the CMS
needs.

---

## Editorial workflow (how Morgan uses it)

1. Open https://morgannotary.com/admin
2. Click **Login with GitHub**
3. First time: GitHub asks her to authorize the `Morgan Notary CMS`
   OAuth app. She clicks **Authorize**. (One-time.)
4. She lands in the CMS with collection tabs: **Site pages**,
   **Services**, **Service areas**, **FAQ items**, **Testimonials**,
   **Blog posts**
5. Click an entry to edit, or **New** to create one
6. Edit the fields — the body editor is rich-text (WYSIWYG) with
   bold, italic, headings, links, lists, and image uploads
7. Click **Save draft** → **Publish → Publish now**
8. Sveltia opens a PR on the repo. Drew reviews, merges to `main`,
   Vercel redeploys (~60 seconds).

The config is set to **editorial workflow** — every save opens a
PR instead of pushing straight to `main`. To let her publish without
review later, flip `publish_mode: editorial_workflow` to
`publish_mode: simple` in `public/admin/config.yml`.

---

## What's editable vs. what isn't

**Editable via CMS:**
- Every page's H1, subhead, SEO title/description, body, CTAs
- All services (pricing rows, process steps, pull quote, consumer/B2B
  copy) — including the new POA service
- All 30 service areas (hero, FAQ, neighborhoods, ZIPs)
- All FAQ items (questions, answers, topics, featured-on-home flag)
- All testimonials (composite-vs-consent flag included)
- All blog posts
- Media uploads to `public/images/`

**Intentionally locked (engineering only):**
- Design tokens (colors, fonts, spacing) in `src/styles/global.css`
- Astro components, layouts, routing
- The NAP single-source-of-truth (`src/lib/nap.ts`) — phone, email,
  hours, service-area radius
- Icon whitelist in `astro.config.mjs`
- Build config, CI, dependencies
- OAuth proxy (`api/auth.ts`, `api/callback.ts`)

This split keeps UPL-compliance, NAP consistency, and the design
system guardrails enforced by code review, not editor discipline.

---

## Troubleshooting

### "Not Found" on login
You're hitting the old config that pointed at Netlify's OAuth.
Make sure `public/admin/config.yml` has:
```yaml
backend:
  name: github
  repo: ddanntheman/MorganNotary-Site
  branch: main
  base_url: https://morgannotary.com
  auth_endpoint: api/auth
```
And confirm the Vercel env vars (`GITHUB_CLIENT_ID`,
`GITHUB_CLIENT_SECRET`) are set on the Production environment.

### "Missing GITHUB_CLIENT_ID env var"
The OAuth proxy can't read its secrets. Add both env vars in Vercel
**Settings → Environment Variables**, then redeploy.

### "OAuth state mismatch"
The state cookie expired (10 min TTL) or was blocked. Close the
popup and try again. If a browser is blocking third-party cookies
aggressively, try logging in from the same-origin tab.

### "GitHub token exchange failed"
Usually means the Client Secret on Vercel doesn't match the one
GitHub thinks it has. Regenerate the secret on the GitHub OAuth App
page, update the `GITHUB_CLIENT_SECRET` env var on Vercel, redeploy.

### Edits don't show up on the live site
Look for an open PR at
https://github.com/ddanntheman/MorganNotary-Site/pulls — editorial
workflow means Morgan's saves wait for Drew to merge. Merging
triggers the Vercel redeploy.

### CMS UI won't load
Hard-refresh (Ctrl+Shift+R). Sveltia loads from unpkg.com; if unpkg
is down, try again in a few minutes.

---

## Local preview while editing

```bash
pnpm install
pnpm dev
```

Open http://localhost:4321, pull her PR branch, refresh to preview
her edits against the live design.
