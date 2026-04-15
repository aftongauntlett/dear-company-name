# Copilot Workspace Instructions

Always treat this repository as a reusable Astro project template.

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

1. PROJECT_BRIEF.md (if present)
2. README.md
3. docs/STANDARDS.md
4. docs/WCAG_2.2_CHECKLIST.md
5. docs/DEVELOPER_HANDOFF.md
6. docs/AUTH_SUPABASE_PLAYBOOK.md
7. docs/ECOMMERCE_PLAYBOOK.md
8. docs/SCHEDULING_CALENDARS_PLAYBOOK.md
9. docs/FREE_TIER_OPS_KEEPALIVE.md
10. docs/DYNAMIC_SCOPE_DECISION_GUIDE.md
11. docs/PROJECT_BRIEF_TEMPLATE.md

## Contact Stack Notes

When implementing contact forms or email delivery, follow docs/DEVELOPER_HANDOFF.md exactly, including env names and anti-abuse controls.

## Starter Endpoint Notes

- Health heartbeat endpoint: `src/pages/api/health.json.ts`
- Auth status endpoint skeleton: `src/pages/api/auth/status.json.ts`
