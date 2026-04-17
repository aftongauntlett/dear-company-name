# dear-company-name

A personal application microsite for [Afton Gauntlett](https://www.aftongauntlett.com/) — a single-page scrolling site she sends to companies she's applying to.

Built with Astro. Fully static. No backend, no forms, no auth.

## Targeting a Company

The company name is set at runtime via the `?to=CompanyName` query parameter in the URL. No rebuild needed to target a new company — just change the link.

The build-time fallback (`COMPANY.targetName` in `src/config/site.ts`) defaults to `'your team'` and is never shown in production.

## Local Quick Start

```sh
npm install
npm run dev
npm run hooks:install
```

## Validation

```sh
npm run typecheck
npm run lint
npm run test
npm run build
npm run validate
```

## Commit Guardrails

A pre-commit hook runs `npm run precommit:check` (typecheck + lint + tests) on every commit.

To reinstall after cloning: `npm run hooks:install`

## Project Structure

```text
.
├── docs/              # Project brief, standards, PRDs, WCAG checklist
├── src/
│   ├── components/
│   │   ├── layout/    # Navbar, Footer, ThemePicker
│   │   ├── sections/  # Page sections (Hero, HowIWork, etc.)
│   │   └── ui/        # Reusable primitives (Button, Card, Icon, etc.)
│   ├── config/        # site.ts (APPLICANT + COMPANY), codeViews.ts
│   ├── layouts/       # BaseLayout
│   ├── pages/         # index.astro, 404.astro
│   ├── styles/        # global.css — all design tokens
│   └── utils/         # github.ts + theme.ts with tests
├── .env.example
└── package.json
```

## Code Explorer

The HowIWork section embeds a live code explorer that fetches this repo's source at build time via the GitHub API and renders it with Shiki. No network calls at runtime.

Optional: set `GITHUB_TOKEN` in your build environment to avoid hitting the unauthenticated rate limit (60 req/hr).

## Reference Docs

- docs/PROJECT_BRIEF.md
- docs/STANDARDS.md
- docs/WCAG_2.2_CHECKLIST.md
- docs/AGENT_QUICKSTART.md
