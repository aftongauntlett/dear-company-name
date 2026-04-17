# Accessibility Checklist

Target: WCAG 2.2 AA. This checklist is scoped to what this project actually does — a static single-page Astro app with runtime company name injection, scroll animations, a code explorer, and a theme picker. No forms, no auth, no backend.

## Page Structure

- One `<h1>` on the page; sections use `<h2>`; sub-headings use `<h3>` only under the current `<h2>`.
- Landmarks present: `<header>`, `<nav aria-label="Primary">`, `<main id="main-content">`, `<footer>`.
- Skip link (`.skip-link`) is the first focusable element and jumps to `#main-content`.

## Keyboard Navigation

- Theme picker button is reachable and operable by keyboard.
- StyledDropdown (code explorer view switcher) is operable by keyboard — native `<select>` is the data source.
- FileTree keyboard navigation works: `ArrowDown`/`ArrowUp` move between items, `ArrowRight`/`ArrowLeft` expand/collapse folders, `Enter`/`Space` select a file.
- No keyboard traps anywhere on the page.
- All `<a>` and `<button>` elements have descriptive accessible names (not icon-only without a label).

## Focus Indicators

- `:focus-visible` outline is visible and not overridden on any interactive element.
- Focus indicator contrast is at least 3:1 against adjacent colors.

## Typewriter / Company Name Pattern

- The `<h1 class="hero-headline">` is always present and readable by assistive tech — it is never `aria-hidden`.
- The visual typewriter overlay (`<p class="hero-typewriter" aria-hidden="true">`) is always hidden from the accessibility tree.
- If no `?to=` param and no sessionStorage value, the page redirects to `/404` rather than showing a broken or empty headline.
- The company name is set via `.textContent` (never `.innerHTML`) — safe from XSS.

## Animations and Motion

- All scroll-triggered fade-up transitions are inside `@media (prefers-reduced-motion: no-preference)` — users who prefer reduced motion see content immediately.
- The hero uses a two-step stagger: image column at `--fade-delay: 0`, text/CTA at `--fade-delay: 1`. Both use `fade-up`.
- The Lottie player (404 page) has `aria-hidden="true"` — it is decorative and not announced.
- Hover animations on cards/rows are also gated on `prefers-reduced-motion`.

## Color and Contrast

- All text meets 4.5:1 contrast on its background (normal size) or 3:1 (large/bold text ≥ 18pt / 14pt bold).
- Interactive controls and focus rings meet 3:1 against adjacent colors.
- Contrast is verified across all themes (light, dark, and any extra themes) — design tokens must satisfy contrast in every theme.

## Images

- Every `<img>` has an `alt` attribute — descriptive for informative images, empty (`alt=""`) for decorative ones.
- Every `<img>` has explicit `width` and `height` attributes matching its rendered size (prevents CLS).
- LCP image (hero headshot) uses `loading="eager"`; all others use `loading="lazy"` and `decoding="async"`.

## Code Explorer (CodePane / FileTree)

- FileTree uses `role="tree"` and `role="treeitem"` with correct `aria-expanded` state on folders.
- CodePane syntax highlighting is not the only way to distinguish code tokens — readable without color.
- Code blocks have a visible label or context describing what they show.

## Performance (affects perceived accessibility)

- Fonts loaded via async `<link>` tags — no render-blocking `@import` (see STANDARDS.md).
- No Cumulative Layout Shift from images or fonts.
- Lighthouse Accessibility score is 95 or above; Performance score is 90 or above.

## Pre-Ship Validation

```
npm run typecheck
npm run lint
npm run test
npm run build
```

- Manual keyboard pass: tab through entire page, verify focus order and all interactive elements.
- Screen reader spot check: hero reads company name correctly; FileTree navigation is announced; theme picker label is read.
