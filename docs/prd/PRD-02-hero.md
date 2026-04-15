# PRD-02: Hero Section + Typewriter Effect

## Goal

Build the first section a hiring manager sees. It needs to land the personality immediately — confident, a little knowing, not trying too hard. The typewriter effect is the centerpiece: it types the company name into the headline after a brief pause where the brackets are literally visible, making the mail-merge joke land.

## Scope

- Create `src/components/sections/Hero.astro`.
- Create a typewriter animation using vanilla JS + CSS (no animation libraries).
- Wire `COMPANY.targetName` from `src/config/site.ts` into the typewriter target.
- Add the Hero to `src/pages/index.astro`.
- Respect `prefers-reduced-motion` — reduce/skip the animation for users who have it set.

## Out of Scope

- No CTA button wiring (placeholder text only, per PRD-01 decisions).
- No scroll-triggered animations — those come in PRD-05 polish if at all.

---

## Visual Spec

### Layout

Full-viewport-height section (`min-height: 100dvh`), vertically centered content. Max content width consistent with site container token. Section `id="top"`.

### Headline Sequence

The headline is an `<h1>`. The full final read state is:

> Dear [Company Name],

The sequence:
1. Page loads. Headline shows: `Dear [],` — brackets visible, comma present, content inside empty.
2. After ~600ms pause, the typewriter starts typing the company name between the brackets.
3. On completion, the brackets are removed (or fade out), leaving: `Dear Company Name,`

**Accessibility note:** The `<h1>` must contain the plain, final text for screen readers at all times — the typewriter effect is a `[aria-hidden="true"]` visual layer. The real H1 text should be present in the DOM and visible to assistive tech from the start, even if visually hidden during the animation.

Implementation approach:
- The H1 renders the full text server-side (SSR/static): `Dear {COMPANY.targetName},`
- A `<span aria-hidden="true">` visual overlay handles the animation, positioned over the H1.
- When JS is not available, the plain H1 shows cleanly.

### Subheadline

Below the H1, a `<p>` subhead:

> I built this instead of recording a video. I think you'll agree it was the right call.

Font: body font, larger than body text but clearly secondary to the H1. Muted text color (`--tone-text-muted`).

### CTA Area

Below the subhead, a small cluster:

- Primary `Button` (solid): "Let's talk" — `href="#"` placeholder, links to `mailto:${APPLICANT.email}` once email is filled in.
- Ghost `Button` or plain link: "See my work ↓" — `href="#work"` anchor.

Use `src/components/ui/Button.astro` for both — do not create new button markup.

### Scroll hint (optional but polished)

A small animated "↓" or chevron at the bottom of the hero viewport, fading out once the user scrolls. Low priority — skip if it adds complexity to the sprint. Implement only if it's clean to add.

---

## Typewriter Implementation Notes

- The target string is `COMPANY.targetName`, injected into a `data-typewriter-target` attribute on the animated span at build time.
- Typing speed: ~60–80ms per character.
- Initial delay: 600ms before typing begins.
- No blinking caret is required, but a caret character (`|`) that disappears on completion is acceptable.
- The bracket pair (`[` and `]`) should be styled slightly differently (muted/dimmer) to telegraph the mail-merge joke before typing starts.
- On `prefers-reduced-motion: reduce`: skip the typing animation entirely, show the completed headline immediately.

---

## File: `src/components/sections/Hero.astro`

### Props

None — reads directly from `src/config/site.ts` imports. (APPLICANT, COMPANY)

### Structure (simplified)

```astro
<section id="top" class="hero" aria-label="Introduction">
  <div class="container">
    <!-- Accessible, always-present H1 (screen reader source of truth) -->
    <h1 class="hero-headline">
      Dear {COMPANY.targetName},
    </h1>

    <!-- Visual typewriter overlay (aria-hidden) -->
    <p class="hero-headline hero-typewriter" aria-hidden="true">
      Dear [<span
        class="typewriter-target"
        data-target={COMPANY.targetName}
      ></span>],
    </p>

    <p class="hero-subhead">
      I built this instead of recording a video.
      I think you'll agree it was the right call.
    </p>

    <div class="hero-cta">
      <Button href={`mailto:${APPLICANT.email}`}>Let's talk</Button>
      <Button href="#work" variant="ghost">See my work ↓</Button>
    </div>
  </div>
</section>
```

The `.hero-headline` (real H1) is visually hidden while the typewriter overlay is present, then shown after animation completes (or immediately if `prefers-reduced-motion`).

---

## CSS Notes

- Hero uses `display: flex; align-items: center; justify-content: center;` or equivalent grid for centering.
- `h1` font size: use the existing `h1` clamp from `global.css` — no override needed.
- Typewriter overlay: `position: absolute; top: 0; left: 0;` over the H1 element via relative wrapper.
- The bracket characters `[` `]` get a separate color (`--tone-text-muted` or 50% opacity of `--tone-text`).
- CTA cluster: `display: flex; gap: var(--space-4); flex-wrap: wrap;` — no new spacing tokens.

---

## Acceptance Criteria

- [ ] Headline types out `COMPANY.targetName` character by character on load.
- [ ] Brackets are visible before typing begins, removed/hidden after.
- [ ] Screen reader gets the full, final headline text immediately (not character-by-character updates via live region).
- [ ] `prefers-reduced-motion` skips animation, shows final headline immediately.
- [ ] No JS = headline renders as plain `Dear [Company Name],` (acceptable fallback).
- [ ] Both CTA buttons are keyboard reachable and have visible focus styles.
- [ ] Hero section spans full viewport height, content vertically centered.
- [ ] `npm run typecheck` passes (no `any` types in the inline script).
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `npm run precommit:check` passes before committing.
