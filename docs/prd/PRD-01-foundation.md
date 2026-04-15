# PRD-01: Foundation — Dark Theme, Site Config, and Nav

## Goal

Establish the configuration layer, dark theme tokens, and navigation structure that every subsequent section depends on. This is the first commit. Nothing visible to a hiring manager lives here — it's the scaffolding that makes everything else possible.

## Scope

- Update `src/config/site.ts` with `APPLICANT` and `COMPANY` config objects.
- Add a `dark` theme variant to `src/styles/global.css` alongside the existing light themes.
- Update `src/components/layout/Navbar.astro` to:
  - Use `APPLICANT` and `COMPANY` config for its title/brand.
  - Replace template nav links with section anchor links for the microsite.
- Update `src/components/layout/Footer.astro` to reflect Afton's name and copyright.
- Update `src/layouts/BaseLayout.astro` to default to `dark` theme via `data-theme="dark"` on `<html>`.
- Update `src/pages/index.astro` to use the new layout and config (strip template demo content, replace with a single `<main>` placeholder so the page at least loads under the new theme).

## Out of Scope

- No section content yet (that's PRD-02 through PRD-05).
- No animations yet.
- No new components beyond what's needed for config/nav.

---

## Config Spec — `src/config/site.ts`

Replace the existing `SITE` constant. The file should export:

```ts
export const APPLICANT = {
  name: 'Afton Gauntlett',
  title: 'Senior Frontend Developer',
  email: 'hello@aftongauntlett.com',
  website: 'https://www.aftongauntlett.com/',
  github: 'https://github.com/aftongauntlett',
  linkedin: 'https://www.linkedin.com/in/afton-gauntlett/',
  resume: 'https://aftongauntlett.github.io/resume/',
} as const;

export const COMPANY = {
  targetName: 'Your Company',   // ← THE ONE LINE TO CHANGE PER JOB TARGET
} as const;
```

- Remove `SITE`, `THEMES`, and `ThemeName` exports that are template-only.
- Keep file in `src/config/site.ts`.

---

## Dark Theme Token Spec — `src/styles/global.css`

Add a `:root[data-theme='dark']` block alongside the existing theme blocks. The dark palette should:

- Use a near-black background (`#0d1117` range), not pure black.
- Use off-white text (not pure white — `#e6edf3` range).
- Use a cool blue-tinted accent for `--tone-primary` (approx `#58a6ff` / GitHub-dark style) for contrast.
- Use muted gray for borders and surface layers.
- Follow the exact same token names as existing themes — no new custom properties.

Required tokens to define in the `dark` block:
`--tone-bg`, `--tone-bg-accent`, `--tone-surface`, `--tone-surface-strong`, `--tone-text`, `--tone-text-muted`, `--tone-border`, `--tone-primary`, `--tone-primary-hover`, `--tone-primary-contrast`, `--tone-ring`.

Do not change the `:root` / sprout default. The `dark` theme must be explicitly set via `data-theme="dark"`.

---

## Navbar Spec

The Navbar should render:

- **Brand/logo area (left):** Afton's name from `APPLICANT.name` — no external link, plain text or a `#top` anchor.
- **Nav links (right):** Anchor links to each section by ID:
  - `#start` → "How I Start"
  - `#stack` → "Tech Stack"
  - `#work` → "Recent Work"
  - `#teams` → "What I've Done"
  - `#looking-for` → "Looking For"
- Keep existing responsive behavior and keyboard nav patterns — do not redesign the component structure.
- Keep `ThemePicker` if it currently lives inside the Navbar (so dark theme is selectable by the visitor).

---

## Footer Spec

- Replace template link groups with minimal content:
  - Left or center: © {current year} Afton Gauntlett
  - Right (optional): small icon links to GitHub and LinkedIn using placeholders from `APPLICANT` config.
- Do not add a full footer nav — this is a microsite, not a multi-page site.

---

## index.astro Spec

Replace the template demo content with a minimal stub that just confirms the dark theme loads:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { APPLICANT, COMPANY } from '../config/site';
---
<BaseLayout title={`Dear ${COMPANY.targetName} — ${APPLICANT.name}`}>
  <!-- Sections will be added in PRD-02 through PRD-05 -->
</BaseLayout>
```

The `<html>` element in `BaseLayout.astro` should read `data-theme="dark"` by default to activate the dark palette.

---

## Acceptance Criteria

- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run test` passes (no new logic, but existing tests must not break).
- [ ] `npm run build` passes.
- [ ] Dark theme loads on page load without flicker (no theme-transition FOUC).
- [ ] Nav links are all keyboard reachable and visible-focus styled.
- [ ] `COMPANY.targetName = 'Acme'` → page `<title>` reads "Dear Acme — Afton Gauntlett".
- [ ] ThemePicker still functions and `dark` appears as a selectable option.
- [ ] `npm run precommit:check` passes clean before committing.
