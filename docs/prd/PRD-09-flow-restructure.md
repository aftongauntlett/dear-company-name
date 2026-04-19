# PRD-09: Page Flow Restructure + About Section

**Status:** Complete
**Completed:** 2026-04-19

---

## Problem

Feedback from external reviewers: the page leads with three dense technical-process sections (setup checklist, tech stack, AI workflow) before giving the reader any reason to care about the person. The most compelling content — the Booz Allen impact story and the values/personality copy — is buried at the end where skimmers won't reach it.

The page reads as a reference doc rather than a pitch. The fix is two things: reorder what already exists, and add one short human-first "About" section as a bridge from the Hero into the rest of the page.

---

## Goals

1. Reorder sections so the narrative hook and personality land before the technical depth.
2. Add a short, jargon-free "About" section between Hero and TeamLevels — the entry point for anyone who wants context before they commit to reading further.
3. Update the Navbar to reflect the new section order.

---

## Out of Scope

- No copy changes to existing sections.
- No new component primitives — the About section uses existing layout patterns (container, prose, `fade-up`).
- No design changes to any existing section.

---

## New Section Order

| # | Section | id | Change |
|---|---|---|---|
| 1 | Hero | `#top` | No change |
| 2 | **About** *(new)* | `#about` | **New** |
| 3 | TeamLevels | `#teams` | Moved up from position 6 |
| 4 | LookingFor | `#looking-for` | Moved up from position 7 |
| 5 | HowIWork | `#how-i-work` | Moved down from position 5 (no change in relative position to stack/ai/start) |
| 6 | HowIChooseStack | `#stack` | Moved down |
| 7 | HowIUseAI | `#ai` | Moved down |
| 8 | HowIStart | `#start` | Moved to end |

**Rationale for ordering:**
- About → gives quick human context right after the Hero.
- TeamLevels → first proof-point: real job, real impact, real award. Earns trust before anything technical.
- LookingFor → values and personality; answers "would I want to work with this person?" while the reader is still warm.
- HowIWork / stack / AI / start → technical depth for readers who are already interested and want to dig in.

---

## New Section: About (`id="about"`)

### File

`src/components/sections/About.astro`

### Layout

- Single-column prose block, centered, max-width narrower than the full container (around `60ch`–`65ch` for readability).
- No heading (or an optional visually-hidden `<h2>` for landmark nav — see accessibility note below).
- One short paragraph. No bullet points, no icons, no cards. Just copy.
- `fade-up` entrance animation (same class as other sections).
- `padding-block` consistent with adjacent sections (`var(--space-16)`).
- Section `id="about"`.

### Accessibility

- The section should have `aria-label="About Afton"` or a visually hidden `<h2 class="sr-only">About</h2>` so screen reader landmark nav has a label.
- No ARIA needed beyond that.

### Copy

**Single paragraph — who I am:**
> I'm a frontend engineer with six years of experience, no CS degree, and a background that goes through nursing, paralegal work, and a photo lab before landing in tech. I started with a bootcamp in 2020 and spent four years at Booz Allen Hamilton before going independent. I think like a designer and build like an engineer.

---

## Changes to Existing Files

### `src/pages/index.astro`

Update import order and render order to match the new section sequence:

```astro
import About from '../components/sections/About.astro';
import TeamLevels from '../components/sections/TeamLevels.astro';
import LookingFor from '../components/sections/LookingFor.astro';
import HowIWork from '../components/sections/HowIWork.astro';
import HowIChooseStack from '../components/sections/HowIChooseStack.astro';
import HowIUseAI from '../components/sections/HowIUseAI.astro';
import HowIStart from '../components/sections/HowIStart.astro';
```

Render order:
```astro
<Hero />
<About />
<TeamLevels />
<LookingFor />
<HowIWork />
<HowIChooseStack />
<HowIUseAI />
<HowIStart />
```

### `src/components/layout/Navbar.astro`

Update the `nav` array to reflect the new order and include the new About anchor:

```ts
const nav = [
  { href: '#about',       label: 'About' },
  { href: '#teams',       label: 'Impact' },
  { href: '#looking-for', label: 'Looking For' },
  { href: '#how-i-work',  label: 'My Work' },
  { href: '#stack',       label: 'Stack' },
  { href: '#ai',          label: 'AI' },
  { href: '#start',       label: 'Setup' },
];
```

---

## Acceptance Criteria

- [x] `About.astro` created with the section spec above.
- [x] About section renders between Hero and TeamLevels on scroll.
- [x] Navbar order matches the new section order (labels shortened to reduce crowding).
- [x] `#about` anchor in the nav scrolls to the About section.
- [x] No existing section content or styles changed.
- [x] Section backgrounds alternate automatically via `.page-main > section:nth-of-type` in `global.css`. Individual section components do not set their own `background-color`.
- [x] `npm run typecheck` passes.
- [x] `npm run lint` passes.
- [x] `npm run test` passes.
- [x] `npm run build` passes.
