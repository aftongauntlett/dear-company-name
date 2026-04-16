# PRD-04: Recent Work Section

Status: In Progress
Completed: 2026-04-15 11:30pm (I paused to watch an episode of Twin Peaks!)

## Goal

Four project highlight cards that show range: nonprofit rebuild, community tooling, game jam constraints, and the template itself. Cards use placeholder image slots so real screenshots can be dropped in later without touching markup.

## Scope

- Create `src/components/sections/RecentWork.astro`
- Extend `src/components/ui/Card.astro` if the image slot needs adding — or wrap it in a new `ProjectCard.astro` if the existing Card API can't accommodate an image block without breaking other uses.
- Add the section to `src/pages/index.astro` after the stack section.
- Four projects, defined as data inside the component (no external CMS, no separate data file unless that's cleaner).

## Out of Scope

- Real screenshots (placeholder only).
- Live deployment links being verified (placeholder links are fine).
- Any animation or hover video preview.

---

## Section: Recent Work (`id="work"`)

### Heading

`<h2>` — "Recent work"

### Intro (optional single line)

"A mix of real constraints, real clients, and real fun."

---

## Project Data

### 1. Ghostbusters Virginia

| Field | Value |
|-------|-------|
| **Title** | Ghostbusters Virginia |
| **Eyebrow** | Nonprofit rebuild |
| **Tech** | Astro · Keystatic CMS · Vercel |
| **Description** | Full rebuild of a fan-run nonprofit's site. Static-first, editor-friendly content management via Keystatic (Git-backed CMS), deployed to Vercel. |
| **Link** | Placeholder — add live URL |
| **Image** | Placeholder slot |

### 2. no-wb.org

| Field | Value |
|-------|-------|
| **Title** | no-wb.org |
| **Eyebrow** | Community tool |
| **Tech** | Astro · Tailwind · TypeScript · Vercel |
| **Description** | A no-whiteboard hiring dashboard. Surfaces companies that skip the whiteboard interview. Built for developers who'd rather prove their skills by building things. |
| **Link** | https://no-wb.org |
| **Repo** | https://github.com/aftongauntlett/no-whiteboard-jobs-dashboard |
| **Image** | Placeholder slot |

### 3. Orbital Order (JS13k)

| Field | Value |
|-------|-------|
| **Title** | Orbital Order |
| **Eyebrow** | Constraint-driven game dev |
| **Tech** | Vanilla JS · Canvas 2D · Web Audio API · 13KB limit |
| **Description** | A physics puzzle game where you guide electrons into atomic orbitals. Built for the JS13k competition — the entire submission, HTML, JS, and assets, must fit in 13 kilobytes. No frameworks. No libraries. 8.2KB zipped. |
| **Link** | https://orbital-order.aftongauntlett.com/ |
| **Repo** | https://github.com/aftongauntlett/js13k-demo |
| **Image** | Placeholder slot |

### 4. This Template

| Field | Value |
|-------|-------|
| **Title** | Astro Mission-First Template |
| **Eyebrow** | Open source template |
| **Tech** | Astro · TypeScript · Vitest · CSS tokens |
| **Description** | The template this very site is built on. Reusable Astro starter for accessible, maintainable, mission-driven sites — with built-in agent rules, WCAG 2.2 baseline, and commit-time quality checks. |
| **Link** | Placeholder — add GitHub repo URL |
| **Image** | Placeholder slot |

---

## Component Decision: `Card.astro` vs `ProjectCard.astro`

### Check first

Read the current `Card.astro` API (`title`, `eyebrow`, `href`, `class`, slot for body). It does not currently support an image area.

### Decision rule

- If adding an `image` prop + image block to `Card.astro` doesn't break any existing usage: extend `Card.astro`.
- If it would require restructuring the existing card layout in a way that risks breaking the template demo: create `src/components/ui/ProjectCard.astro` as a standalone component with `Card.astro`'s pattern as a model.

Prefer extending `Card.astro` if the change is additive and backward-compatible.

### ProjectCard props (if new component)

```ts
interface Props {
  title: string;
  eyebrow?: string;
  href?: string;
  tech: string[];       // array of tech tag strings
  imageSrc?: string;    // optional — renders placeholder if absent
  imageAlt?: string;
  class?: string;
}
```

---

## Image Placeholder Spec

When `imageSrc` is not provided (placeholder state):

- Render a `<div class="project-card-image project-card-image--placeholder">` block.
- Visually: a solid `--tone-surface-strong` rectangle with a centered muted label: "Screenshot coming soon".
- Aspect ratio: approximately 16:9.
- Include `role="img"` and `aria-label="Project screenshot placeholder"` for accessibility.

When `imageSrc` is provided:

- Render `<img src={imageSrc} alt={imageAlt ?? ''} class="project-card-image" loading="lazy" decoding="async" />`.
- No `width`/`height` hardcoded — use CSS aspect-ratio instead.

---

## Tech Tag Spec

Each card shows the tech stack as a row of small pill tags below the description:

- Render as `<ul aria-label="Technologies used">` with `<li>` items.
- Style: small text, `--tone-surface-strong` background, `--tone-border` border, `--radius-pill` border-radius.
- No links — these are decorative labels.

---

## Grid Layout

- CSS Grid: `repeat(auto-fill, minmax(280px, 1fr))` — 2-up on medium screens, 1-up on mobile.
- `gap: var(--space-6)`.
- Cards equal height within each row (Grid handles this natively).

---

## Acceptance Criteria

- [ ] Four project cards render in the `#work` section.
- [ ] Each card shows: title, eyebrow, description, tech tags, and placeholder image.
- [ ] Placeholder image region is accessible (role + aria-label).
- [ ] Tech tags are a semantic list (not `<div>` soup).
- [ ] Card hover/focus state is consistent with existing `Card.astro` treatment.
- [ ] Card title links (`href`) have descriptive link text (title is sufficient here).
- [ ] All external `href` placeholders are `#` — no broken 404 links.
- [ ] Grid collapses to single column on mobile.
- [ ] No hard-coded colors — all use theme tokens.
- [ ] Navbar anchor `#work` scrolls to this section.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `npm run precommit:check` passes before committing.
