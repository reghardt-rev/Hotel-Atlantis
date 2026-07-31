# Hotel Atlantis

Marketing website for Hotel Atlantis. Static, multilingual, edited through a Git‑backed CMS, with the Mews booking engine and Google Tag Manager.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | [Astro](https://astro.build) 7 |
| Styling | Tailwind CSS v4 |
| Content / CMS | [Keystatic](https://keystatic.com) (GitHub storage mode) |
| Languages | English (default, no prefix) + Dutch (`/nl/…`) |
| Booking | Mews Booking Engine (Distributor) |
| Analytics | Google Tag Manager → GA4 (you manage GTM/GA4) |
| Hosting | Cloudflare (Workers + static assets) |

## Requirements

- Node.js ≥ 22.12 (developed on Node 24)
- npm

## Getting started

```sh
npm install
npm run dev        # http://localhost:4321  (admin at /keystatic)
```

`npm run dev` uses the **Node** adapter so the Keystatic admin runs locally; `npm run build` uses the **Cloudflare** adapter. This switch is automatic (see `astro.config.mjs`).

| Command | Action |
| --- | --- |
| `npm run dev` | Dev server + local Keystatic admin |
| `npm run build` | Production build to `./dist` (Cloudflare) |

The Astro CLI supervises the dev server in the background: `astro dev status`, `astro dev logs`, `astro dev stop`.

## Editing content (Keystatic)

Open **`/keystatic`**.

- **In development** the CMS uses **local storage**: your edits write directly to the files under `src/content/` and you commit them yourself. No GitHub App needed.
- **In production** it uses **GitHub storage** (repo `reghardt-rev/Hotel-Atlantis`): staff sign in with GitHub and edits are committed to the repo automatically, which triggers a rebuild.

The switch is `import.meta.env.DEV` in `keystatic.config.ts`.

### One‑time GitHub-mode setup (for the deployed admin)

1. Deploy the site (below).
2. Visit `https://your-domain/keystatic` and follow **“Connect to GitHub.”** Keystatic walks you through creating a GitHub App for the repo.
3. It gives you three values — add them as environment variables on the host (see `.env.example`):
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`.

> **Transferring the repo later:** change `repo: 'reghardt-rev/Hotel-Atlantis'` in `keystatic.config.ts`, and update the GitHub App’s callback URL only if the domain changes.

### Content model

Each type is a pair of collections (one per language), grouped by language in the admin sidebar:

- **Rooms**, **Offers**, **Dining**, **News**, **Pages**, **Gallery**
- **Site settings** (singleton): site name, tagline, contact details, social links, the **Mews configuration ID**, and the **GTM container ID**.

Pages currently built: Home, Rooms (list + detail), Offers. Dining / News / Pages / Gallery collections exist and hold content; their public pages are the natural next step (follow the Rooms pattern in `src/sections/`).

## Internationalization

- Default locale `en` (served at `/…`), second locale `nl` (served at `/nl/…`). Configured in `astro.config.mjs`.
- UI strings and the `localePath()` helper live in `src/lib/i18n.ts`.
- Routes mirror per locale: e.g. `src/pages/rooms/index.astro` (en) and `src/pages/nl/rooms/index.astro` (nl) both render the shared view in `src/sections/`.

## Booking (Mews)

The **`<BookNow />`** component (`src/components/BookNow.astro`) loads the Mews Distributor and opens the booking engine. The configuration ID comes from **Site settings → Mews configuration ID** (currently `4808678c-…f64c7f`), with the same value as a fallback in the component.

> The button attempts to open the Mews widget programmatically; if Mews’ API differs, the Distributor still renders its own launcher. Confirm the exact open trigger against your Mews account and adjust the small script in `BookNow.astro` if needed.

## Analytics (GTM / GA4)

Set the **GTM container ID** in **Site settings** (or `PUBLIC_GTM_ID` in `.env`). When present, the GTM snippet is injected in `src/layouts/Layout.astro`; when blank, nothing is added. GA4 is configured inside GTM by you.

**Cendyn** metasearch marketing rides on your GTM/GA4 setup; the site needs nothing bespoke for it.

## Deploying to Cloudflare

The build targets **Cloudflare Workers with static assets** (`@astrojs/cloudflare`). `wrangler.jsonc` already sets `nodejs_compat`, required by Keystatic.

**Option A — connect the repo (recommended):** in the Cloudflare dashboard, create a Workers/Pages project from `reghardt-rev/Hotel-Atlantis`, framework preset **Astro**, build command `npm run build`. Add the `KEYSTATIC_GITHUB_*`, `KEYSTATIC_SECRET`, and (optionally) `PUBLIC_GTM_ID` environment variables.

**Option B — manual:** `npm run build && npx wrangler deploy`.

Before launch, set the real domain in `site:` in `astro.config.mjs`.

## Project structure

```
keystatic.config.ts        CMS schema (collections, singleton, storage mode)
astro.config.mjs           Astro config, i18n, adapter switch (node dev / cloudflare build)
wrangler.jsonc             Cloudflare config (nodejs_compat)
src/
  content/                 Content files written by Keystatic (rooms/, offers/, settings/…)
  lib/
    i18n.ts                Locales, UI strings, localePath()
    content.ts             Keystatic reader helpers + Markdoc → HTML
  layouts/Layout.astro     HTML shell, GTM, header/footer
  components/              BookNow, Header, Footer, RoomCard, OfferCard
  sections/                Locale‑agnostic page views (Home, Rooms, RoomDetail, Offers)
  pages/                   Thin routes: en at root, nl under /nl
public/images/             Uploaded images (Keystatic writes here)
```

## Notes

- `npm install` reports npm advisories in the Keystatic/React dependency tree. `npm audit fix --force` can introduce breaking changes, so review before running it.
- There is no typecheck in the build. Run `npx astro check` (installs `@astrojs/check` + `typescript`) to catch type errors such as mismatched Keystatic field names.
