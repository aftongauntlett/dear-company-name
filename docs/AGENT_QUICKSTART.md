# Agent Quickstart

If you are an AI coding agent working in this repository, read these files in order:

1. docs/PROJECT_BRIEF.md
2. docs/STANDARDS.md
3. docs/WCAG_2.2_CHECKLIST.md
4. docs/prd/ (read all current PRDs before implementing)

## Project Intent

This is a fully static personal application microsite for Afton Gauntlett — no backend, no forms, no auth, no CMS. See docs/PROJECT_BRIEF.md for full scope.

Build style:

- Static Astro site
- Token-based CSS themes (dark theme as default)
- Reusable components
- Accessibility-first UI

## Required Workflow for Agents

1. Confirm the mission, audience, and core pages.
2. Reuse existing components before creating new ones.
3. For form selects, use `src/components/ui/StyledDropdown.astro` instead of ad-hoc/native-styled dropdown implementations.
4. For actions and surfaces, use `src/components/ui/Button.astro` and `src/components/ui/Card.astro` before creating one-off variants.
5. If icons are needed and no icon primitive exists, create a reusable icon component first, then use it everywhere.
6. Keep styles tokenized and theme-aware.
7. Maintain semantic HTML and keyboard accessibility.
8. Add tests for new logic.
9. Run full validation before finishing:
   - npm run validate
10. Ensure commit-time checks pass:
   - npm run precommit:check

## Default Deliverables

- Updated page content and components
- Updated docs for setup or architecture changes
- Passing checks (typecheck, lint, tests, build)
