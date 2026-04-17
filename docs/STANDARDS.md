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

## Font Loading

- Load Google Fonts via async `<link>` tags in `BaseLayout.astro`, never via `@import` in CSS. `@import` is render-blocking.
- Include a `<noscript>` fallback for no-JS environments.
- Do not add `@import` in `global.css` — fonts are handled in the layout.

## Images

- Every `<img>` must have explicit `width` and `height` attributes that match the element's rendered dimensions. This allows the browser to reserve layout space before the image loads, preventing Cumulative Layout Shift (CLS).
- Use `loading="eager"` only for above-the-fold LCP images. All other images use `loading="lazy"`.
- Use `decoding="async"` on all non-critical images.
- Prefer `.webp` format. Consider `.avif` for further savings on large images.
- Do not use fluid typography (`clamp()` with a `vw` middle value) for body or description text. Use a fixed `rem` value. Fluid sizing is appropriate for display headings (`h1`–`h3`) where large visual scale changes across breakpoints are intentional.

## Semantic HTML

- A `<div>` that is a direct child of a `<dl>` may only contain `<dt>` and `<dd>` elements — no other elements (including icon SVGs or wrapper divs). To include decorative icons alongside a term, place the icon inside the `<dt>` with `aria-hidden="true"`.
- Use `<ul>/<li>` for unordered lists of items that are not term-definition pairs. Reserve `<dl>` for genuine term-definition or term-description relationships.

## Scroll-triggered Animations

- Always gate CSS transitions on `@media (prefers-reduced-motion: no-preference)`. Users who opt out see content immediately.
- Use `rootMargin: '0px 0px -10% 0px'` on the `IntersectionObserver` — do not use bare `threshold: 0`, which fires on the first pixel and looks like a snap.
- Use `--fade-delay` as a CSS custom property for stagger timing. Apply it via `nth-child` on card grids rather than hardcoding per-element delays in markup.
- CSS `opacity` transitions do not delay Lighthouse LCP. Fading via `opacity` is safe for above-the-fold elements.

## Done Definition

A change is done only when all are true:

1. Accessibility checks completed for affected UI.
2. Typecheck passes.
3. Lint passes.
4. Tests added/updated and passing.
5. Production build passes.
6. README and docs updated if behavior changed.
7. Pre-commit checks pass (`npm run precommit:check`).
