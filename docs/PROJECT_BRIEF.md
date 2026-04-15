# Project Brief

## Client Snapshot

- **Name:** Afton Gauntlett
- **Project type:** Personal application microsite (job application)
- **Industry:** Frontend development
- **Mission:** Replace a Loom video submission with a polished, personality-forward personal microsite Afton can target at specific companies.
- **Primary audience:** Hiring managers and engineering leads at companies Afton is applying to.

## Success Criteria

1. A hiring manager can quickly understand Afton's skills, process, and personality from a single scroll.
2. The target company name is controlled by one constant (`COMPANY.targetName` in `src/config/site.ts`) — swapping targets means changing one value.
3. All sections pass WCAG 2.2 AA, typecheck, lint, tests, and production build.

- **Launch deadline:** As needed — site rebuilds per job target.
- **Must-have on day one:** Hero with typewriter, all 6 content sections, dark theme, full keyboard nav.
- **Phase two:** Real project screenshots, custom domain per target, possible PDF export.

## Scope

- **Project mode:** content-first
- **Planned pages/routes:**
  1. `/` — single scrolling page, all sections
  2. `/api/health.json` — existing keepalive endpoint (no changes)

## Feature Levels

- Auth/login: none
- Ecommerce/cart/checkout: none
- Scheduling/calendars: none
- Contact forms/email: none (CTA links only — no form submission)
- CMS/content editing: none

## Architecture Decisions

- **Dark theme:** Add a `dark` theme variant to the existing CSS token system alongside the existing light themes. Keep the ThemePicker component so the dark theme is selectable.
- **Company name source:** A `COMPANY` config object in `src/config/site.ts` — `targetName` is the one field to change per job target.
- **Typewriter effect:** Pure CSS + minimal vanilla JS (no animation library). Uses `COMPANY.targetName` at runtime — works even with static build.
- **Nav treatment:** Keep the template Navbar and Footer, but update nav links to single-page anchor links for each section.
- **Project images (Recent Work):** Placeholder image slots — real screenshots to be swapped in later.
- **CTA links:** Placeholder values in `site.ts` — to be filled in before sending.

## Operations

- **Hosting target:** Vercel (static export) — TBD
- **Domain and DNS owner:** TBD
- **Service account ownership:** Afton Gauntlett
- **Free-tier keepalive needed:** No (static site, no server-side services)

## Done Definition

1. All six content sections render correctly under the `dark` theme.
2. `COMPANY.targetName` in `site.ts` is the single source of truth for the company name throughout the page.
3. `npm run validate` and `npm run precommit:check` pass clean.
