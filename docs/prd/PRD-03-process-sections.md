# PRD-03: Process Sections — "How I Start" + "How I Choose a Stack"

Status: Complete
Completed: 2026-04-15 9:30pm

## Goal

Two back-to-back sections that show how Afton thinks before writing a single line of code. These should feel opinionated and specific — not generic developer buzzwords. They're the "I know what I'm doing" sections.

## Scope

- Create `src/components/sections/HowIStart.astro`
- Create `src/components/sections/HowIChooseStack.astro`
- Add both sections to `src/pages/index.astro` in order, after the Hero.
- Reuse `src/components/ui/Card.astro` for any card-style content items.
- No new primitives needed.

## Out of Scope

- No external links yet (stack links are nice-to-have, skip if complex).
- No animation — keep sections static and clean.

---

## Section: How I Start (`id="start"`)

### Heading

`<h2>` — "Before I write a line of code"

### Intro paragraph (optional, keep it short)

Something like: "My onboarding checklist runs before the first commit — in a new repo or joining an existing team."

### Content

A two-subsection layout — **Solo setup** and **Team setup** — using either:
- Two-column grid (desktop) / stacked (mobile), or
- A single list where team items are visually differentiated (e.g. a small "team" badge/eyebrow).

Use `Card.astro` for each item block if they have titles and body text.

**Solo / every project items:**

| Item | Detail |
|------|--------|
| Lint | ESLint configured. Hard blocks on push, not just warnings. |
| Typecheck | TypeScript strict mode. Catch it before shipping it. |
| Agent rules | Reusable components, theme tokens, accessibility, keyboard nav. Defined in copilot instructions so AI doesn't freestyle. |

**Team projects (additional):**

| Item | Detail |
|------|--------|
| Prettier | Consistent code format. Not about style opinions — about eliminating noisy format-diff PRs in review. |
| Husky pre-commit | Runs format + lint on commit. Everyone codes however they want; the hook cleans it before it hits the branch. |

### Visual treatment

- Eyebrow labels: "Every project" and "Team projects" above each group.
- Use `Card.astro` `eyebrow` prop for those labels.
- Icons are optional — only include if the existing template has an icon primitive. If not, skip icons and let the card titles carry the weight.

---

## Section: How I Choose a Stack (`id="stack"`)

### Heading

`<h2>` — "How I choose a tech stack"

### Intro paragraph

Short, opinionated. Something like: "Fast to ship, easy to hand off, boring where boring is correct."

### Content

Not a grid — a short narrative list with enough texture to feel like a real opinion, not a LinkedIn skills list.

Render as a `<ul>` or as a series of styled items (not Card.astro — these are inline concept/opinion pairs, not cards):

| Principle | Copy |
|-----------|------|
| Static first | If the content doesn't need the server, don't use one. Astro is my default — it ships zero JS unless I ask it to. |
| Reach for the platform | Native `<dialog>`, CSS scroll-snap, `IntersectionObserver`. If the browser can do it, I don't add a dependency. |
| Add a framework when the UI earns it | React or Preact when the interaction complexity justifies the bundle cost. Not by default. |
| Data fetching with TanStack Query | When state needs to be shared, cached, or synced across components. It turns "who calls this API" from a team debate into a non-issue. |
| Design tokens over component libraries | I can work in any system, but I'd rather own the tokens than fight a third-party theme. |

### Visual treatment

- `<dl>` (definition list) structure works well here: `<dt>` for the principle name, `<dd>` for the copy. Style it with generous spacing.
- Or: a styled `<ul>` with a left-border accent on each item using `--tone-primary`.
- No cards — this should feel like a paragraph that breathes, not a grid.

---

## Shared Section Styling Notes

- Both sections use the same `section` padding pattern: `padding-block: var(--space-16)` (matching existing template scale).
- Both use the same max-width container class as the rest of the page.
- Alternating section backgrounds are handled automatically via `.page-main > section:nth-of-type` in `global.css` (PRD-09). Do **not** set `background-color` on individual section components — the global rule owns that.
- Headings are `<h2>` — consistent with single H1 in hero.
- No `<h4>` or deeper nesting in these sections.

---

## Acceptance Criteria

- [ ] Two sections render in correct order after the Hero: `#start`, then `#stack`.
- [ ] Navbar anchor links `#start` and `#stack` scroll to the correct sections.
- [ ] `Card.astro` is used for the "How I Start" items (no one-off card markup).
- [ ] "How I Choose a Stack" uses semantic list markup (`<dl>` or `<ul>`), not cards.
- [ ] No hard-coded colors — all colors use CSS custom properties from the dark theme tokens.
- [ ] Heading hierarchy is correct: one H1 on the page (hero), these are H2s.
- [ ] Both sections are keyboard navigable (no interactive elements except any links, which have visible focus).
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `npm run precommit:check` passes before committing.
