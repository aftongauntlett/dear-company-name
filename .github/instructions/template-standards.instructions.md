---
description: 'Use when building or editing Astro pages, components, styles, docs, and config in this template repo'
applyTo: 'src/**/*.astro,src/**/*.ts,src/**/*.css,README.md,docs/**/*.md,.env.example,package.json'
---

Follow these standards when generating or editing code:

- If `docs/PROJECT_BRIEF.md` exists, treat it as the primary source of project scope and priorities.

- Accessibility first: semantic HTML, keyboard support, visible focus, ARIA only when needed.
- Meet WCAG 2.2 AA baseline.
- Use design tokens and theme variables. Avoid hard-coded component colors.
- Prefer reusable components over one-off markup.
- For select controls, use `src/components/ui/StyledDropdown.astro` instead of ad-hoc dropdown markup.
- For button-like actions, prefer `src/components/ui/Button.astro` before creating new button patterns.
- For card surfaces, prefer `src/components/ui/Card.astro` before creating new card patterns.
- If icons are needed and no shared icon primitive exists, create one reusable icon component first and reuse it.
- Keep page structure consistent across sections/pages: shared container widths, spacing tokens, gap scale, typography patterns, and heading hierarchy (single H1, then H2/H3).
- Keep interaction styling consistent across pages: reuse existing hover/focus/active patterns via shared components and tokens.
- For template/demo pages, keep buttons non-navigational unless a real destination is explicitly requested.
- Keep TypeScript strict and avoid any.
- Add tests for new logic modules.
- Update docs when behavior or setup changes.
- Keep commit-time checks passing with `npm run precommit:check`.

Before completion, run full validation:

- npm run validate
- npm run precommit:check
