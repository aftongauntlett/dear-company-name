# Copilot Workspace Instructions

This is a personal application microsite for Afton Gauntlett — a static Astro site with no backend services, no forms, no auth, and no CMS. See docs/PROJECT_BRIEF.md for full scope.

## Required Standards

- Enforce WCAG 2.2 AA baseline for all UI.
- Keep full keyboard navigation and visible focus styles.
- Use semantic HTML first, ARIA only when needed.
- Use design tokens and theme variables; avoid hard-coded component colors.
- Prefer reusable components and clear APIs.
- Keep code readable and maintainable.
- Keep page structure consistent across sections/pages: shared container spacing, gap scale, typography rhythm, and heading hierarchy.

## Component Reuse Policy

Before creating any new UI primitive, check and reuse existing components in `src/components/ui/` and `src/components/layout/`.

- Use `src/components/ui/StyledDropdown.astro` for themed select controls. Do not create ad-hoc custom dropdowns.
- Keep the native `<select>` as the data source for styled dropdowns (progressive enhancement only).
- Use `src/components/ui/Button.astro` for button-like actions/links before creating one-off button markup.
- Use `src/components/ui/Card.astro` for card surfaces before creating new one-off card patterns.
- If an icon primitive is needed and no reusable icon component exists, create one reusable icon component first, then consume it.
- Prefer extending existing component APIs over duplicating similar components.

## Required Validation Before Completion

Run and pass:

1. npm run typecheck
2. npm run lint
3. npm run test
4. npm run build
5. npm run precommit:check

## Required Docs To Read First

1. docs/PROJECT_BRIEF.md
2. docs/STANDARDS.md
3. docs/WCAG_2.2_CHECKLIST.md
4. docs/prd/ (current PRDs)
