# Connecting Cendyn (CRM) — reservation & spend data

Goal: when a guest books, see **when they booked / stayed** and **what they paid** in Cendyn.

Important: the marketing website is **not** where booking and payment data lives — that's **Mews** (your booking engine / PMS). So this is done in two parts.

## Part 1 — Mews → Cendyn (the real data pipe) · *config, not website code*

Cendyn CRM and Mews have a **native two-way integration** via the Mews Marketplace / Mews Open API. It automatically syncs **guest profiles, reservations, and spending data** (exactly "when they booked" + "amount paid") into Cendyn — authoritative and complete, unlike anything a website can capture.

To enable it:

1. In **Mews** → **Marketplace**, find **Cendyn** (Digital Marketing Platform / CRM) and connect it. https://www.mews.com/en/products/marketplace/cendyn
2. Authorise the integration (Mews will issue the API access Cendyn needs).
3. In **Cendyn**, follow *CRM → integrate hotel data* to map the Mews feed. https://help.cendyn.com/hc/en-us/articles/21916199139739
4. Reservations, stay dates, and spend then flow into each guest's Cendyn record automatically.

This is a hotel-systems task (Mews + Cendyn admin), not a code change. If you don't have Marketplace access, your Mews account manager or Cendyn onboarding can switch it on.

## Part 2 — Website → GTM booking events (attribution) · *done in code*

The site now passes your **GTM container id** into the Mews booking widget, so a completed booking fires a purchase event **with its value** into Google Tag Manager. From GTM you route it to:

- **GA4** (revenue / conversion reporting — you manage GTM), and
- **Cendyn's metasearch / digital-marketing** tags, if you add them in GTM (for ad attribution).

### To activate

1. Set your **GTM container id** in Keystatic → **Site settings → Google Tag Manager container ID** (or `PUBLIC_GTM_ID` in `.env`). That single value now:
   - loads GTM on the site (`Layout.astro`), and
   - is handed to the Mews Distributor (`meta[name="mews-gtm"]` → `BookNow.astro`), enabling its booking tracking.
2. In GTM, confirm the Mews booking event appears in the data layer, then wire your GA4 purchase tag and any Cendyn tag to it.

### What was changed in the code

- `BookNow.astro` now initialises `Mews.Distributor({ configurationIds, openElements: '.distributor', gtmContainerId })` (previously `Mews.D([id])`) — same click-to-open behaviour, plus GTM tracking when an id is present.
- `Layout.astro` renders `meta[name="mews-gtm"]` with the GTM id.

### Caveats

- Client-side tracking is for **marketing/analytics**, not a system of record: events can be blocked by consent tools/ad-blockers and don't carry the full guest profile. Treat **Part 1 (Mews → Cendyn)** as the source of truth for reservations and spend.
- Respect cookie/consent: GTM/GA4 and the Mews tracking should fire within your consent setup.
