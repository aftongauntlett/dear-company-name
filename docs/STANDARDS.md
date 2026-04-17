# Template Standards

This repository is a reusable Astro template for mission-driven organizations and community projects.

## Non-Negotiable Requirements

- WCAG 2.2 AA baseline on every page.
- Full keyboard navigation for all interactive controls.
- Semantic HTML landmarks and structure.
- ARIA attributes only when semantic HTML is not enough.
- Visible focus states and sufficient color contrast.
- Design tokens for color, spacing, type, and sizing. No hard-coded component colors.
- Reusable components over copy-paste sections.
- Strict checks before completion: typecheck, lint, tests, build.
- Commit-time checks pass locally via `npm run precommit:check`.

## Implementation Principles

- Prefer static-first architecture; add server routes only when necessary.
- Keep component APIs small and predictable.
- Keep CSS tokenized and theme-aware.
- Keep business logic in utility modules with tests.

## Page Structure Consistency

- Keep a consistent page scaffold across all pages and sections: container width, section spacing, and gap scale should follow shared tokens and existing layout classes.
- Maintain consistent typography usage: shared heading/body styles, text rhythm, and component text patterns should match existing sections.
- Maintain consistent interaction styles: hover, focus-visible, and active states should reuse existing component behavior and tokenized styles.
- Heading order must stay consistent: one H1 per page, section-level H2s, and H3s only as subheadings under the current H2 context.
- Do not mix unrelated one-off layout systems between pages; if the project expands from single-page to multi-page, preserve the same spacing, structure, and component language.
- Template/demo buttons should be non-navigational by default; only add real button/link destinations when intentionally requested for production behavior.

## Done Definition

A change is done only when all are true:

1. Accessibility checks completed for affected UI.
2. Typecheck passes.
3. Lint passes.
4. Tests added/updated and passing.
5. Production build passes.
6. README and docs updated if behavior changed.
7. Pre-commit checks pass (`npm run precommit:check`).
