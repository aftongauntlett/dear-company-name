# dear-company-name

My personal application microsite — a single-page scrolling site I send to companies instead of a Loom video. More about me at [aftongauntlett.com](https://www.aftongauntlett.com/).

Built with Astro. Fully static, no backend, no CMS.

## Targeting a Company

The company name is set at runtime via `?to=CompanyName` in the URL. No rebuild needed to target a new company.

The fallback in `src/config/site.ts` defaults to `'your team'` and is never shown in production.

## Local Setup

```sh
npm install
npm run dev
npm run hooks:install
```

## Checks

```sh
npm run typecheck
npm run lint
npm run test
npm run build
npm run validate
```

A pre-commit hook runs `npm run precommit:check` (typecheck + lint + tests) on every commit. Reinstall after cloning with `npm run hooks:install`.

## Structure

```text
src/
  components/
    layout/    # Navbar, Footer, ThemePicker
    sections/  # Page sections (Hero, HowIWork, etc.)
    ui/        # Reusable primitives (Button, Card, Icon, etc.)
  config/      # site.ts, codeViews.ts
  layouts/     # BaseLayout
  styles/      # global.css — all design tokens
  utils/       # github.ts + theme.ts
docs/          # Brief, standards, PRDs, WCAG checklist
```

## Code Explorer

The site fetches this repo's source at build time via the GitHub API and renders it with Shiki — no network calls at runtime.

Optional: set `GITHUB_TOKEN` in your build environment to avoid the unauthenticated rate limit (60 req/hr).
