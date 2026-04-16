# PRD-02: Hero Section + Typewriter Effect

Status: Complete
Completed: 2026-04-15 8:00pm

## Goal

Build the first section a hiring manager sees. It needs to land the personality immediately — confident, a little knowing, not trying too hard. The typewriter effect is the centerpiece: it types a placeholder company name first, then backspaces and replaces it with the real target, making the mail-merge joke land in real time.

## Scope

- Create `src/components/sections/Hero.astro`.
- Create a typewriter animation using vanilla JS + CSS (no animation libraries).
- Wire `COMPANY.targetName` from `src/config/site.ts` into the typewriter target.
- Add the Hero to `src/pages/index.astro`.
- Respect `prefers-reduced-motion` — show the resolved headline statically, no animation.

## Out of Scope

- No scroll-triggered animations — those come in PRD-05 polish if at all.

---

## Visual Spec

### Layout

Two-column grid: image placeholder left, text content right. Full-viewport-height section (`min-height: 100dvh`), vertically centered. Max content width consistent with site container token. Section `id="top"`. Collapses to single column on mobile (image stacks above text).

### Headline Sequence

The headline is an `<h1>`. Brackets are always present and always styled muted (`--tone-text-muted`) to telegraph the mail-merge joke.

The animation sequence:
1. Page loads. Headline shows: `Dear [],` — brackets visible, content inside empty.
2. After ~500ms pause, typewriter types the hardcoded placeholder: `Dear [Your Company],`
3. Holds for ~1400ms.
4. Backspaces the placeholder text, leaving: `Dear [],`
5. Brief 200ms pause, then types `COMPANY.targetName`: `Dear [Prentus],`
6. Blinking caret (`|`) remains after completion.

The placeholder (`Your Company`) is hardcoded in the component — **not** derived from `COMPANY.targetName` — so the gag always works regardless of what `targetName` is set to.

**Accessibility:** The real `<h1>` (`Dear {COMPANY.targetName},`) is always in the DOM. The animated overlay is `aria-hidden="true"`. Screen readers see the final resolved text from page load.

**No-JS fallback:** Plain `<h1>` renders cleanly. Overlay is `display: none` without the `.js` class.

**`prefers-reduced-motion`:** CSS hides the overlay and shows the real H1 statically. No JS animation runs. This is the correct behavior — without the animation the overlay would show `Dear [],` which is broken, so skipping to the final resolved state is the right call.

### Subheadline

> I built this instead of recording a video. I think you'll agree it was the right call.

Body font, larger than body text, muted color (`--tone-text-muted`).

### CTA Area

- Primary `Button` (solid): "Let's talk" → `mailto:${APPLICANT.email}`
- Secondary `Button` (outline): "See my work ↓" → `#work`

Both use `src/components/ui/Button.astro`. No one-off button markup.

### Scroll hint

CSS-only animated `↓` anchored to the bottom of the viewport. `aria-hidden`, bounce animation disabled under `prefers-reduced-motion`.

---

## Typewriter Implementation Notes

- `data-placeholder` on the animated span holds the hardcoded joke string (`Your Company`).
- `data-target` holds `COMPANY.targetName` (injected at build time).
- Typing speed: 70ms/char. Erase speed: 45ms/char (slightly faster feels natural).
- Initial delay: 500ms. Pause on placeholder: 1400ms. Gap before re-typing: 200ms.
- Blinking caret is a CSS `::after` pseudo-element — no font character, solid `2px` block rendered in `--tone-primary`.

---

## File: `src/components/sections/Hero.astro`

### Props

None — reads directly from `src/config/site.ts` imports (`APPLICANT`, `COMPANY`).

### Structure (simplified)

```astro
<section id="top" class="hero" aria-label="Introduction">
  <div class="container hero-container">

    <!-- Left: image placeholder -->
    <div class="hero-image-col" aria-hidden="true">
      <div class="hero-image-placeholder">
        <span class="hero-image-initials">AG</span>
      </div>
    </div>

    <!-- Right: text content -->
    <div class="hero-content">
      <!-- Accessible H1 — screen reader source of truth -->
      <h1 class="hero-headline">Dear {COMPANY.targetName},</h1>

      <!-- Visual typewriter overlay (aria-hidden) -->
      <p class="hero-headline hero-typewriter" aria-hidden="true">
        Dear <span class="hero-bracket">[</span><span
          class="typewriter-target"
          data-target={COMPANY.targetName}
          data-placeholder="Your Company"></span><span class="hero-bracket">]</span>,
      </p>

      <p class="hero-subhead">
        I built this instead of recording a video. I think you'll agree it was the right call.
      </p>

      <div class="hero-cta">
        <Button href={`mailto:${APPLICANT.email}`}>Let's talk</Button>
        <Button href="#work" variant="outline">See my work ↓</Button>
      </div>
    </div>

  </div>
  <div class="hero-scroll-hint" aria-hidden="true">↓</div>
</section>
```

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
