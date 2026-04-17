# PRD-05: Closing Sections + Full Validation

Status: Complete
Completed: 2026-04-16 1:00am

## Goal

Three final sections that close the pitch — leveling up teams, what Afton is looking for, and a disarmingly honest note about the video ask. Then full validation pass before the site is considered done.

## Scope

- Create `src/components/sections/TeamLevels.astro`
- Create `src/components/sections/LookingFor.astro`
- Create `src/components/sections/VideoNote.astro`
- Add all three to `src/pages/index.astro` in order after Recent Work.
- Run `npm run validate` and verify all checks pass clean.
- Update `src/config/site.ts` Navbar anchor links to include `#teams` and `#looking-for` (if not already added in PRD-01).

## Out of Scope

- No new component primitives needed — these are prose-forward sections.
- No animations unless they're trivial (no scroll-reveal libraries).
- No contact form (CTA links only).

---

## Section: Things I've Leveled Up Teams On (`id="teams"`)

### Heading

`<h2>` — "Things I've leveled up teams on"

### Intro (optional)

Skip or keep very short. The list carries itself.

### Content

A short list of team-improvement stories — each one has a title, a brief context line, and the improvement. Render as a styled list or a group of small `Card.astro` blocks.

**Items:**

---

**Figma licenses and design process**
*Context: Booz Allen*
Helped the team understand Figma licensing tiers and introduced a shared component library workflow — so designers and developers were working from the same source of truth instead of exporting one-offs.

---

**Functional component migration**
*Context: Legacy React codebases*
Led migration from class components to functional components with hooks. Not just a syntax change — reorganized state logic so it was readable and testable by the whole team, not just whoever wrote it.

---

**TanStack Query for data fetching**
*Context: Junior dev teams*
Introduced TanStack Query (React Query) to replace ad-hoc `useEffect`/`useState` API patterns. Reduced boilerplate, improved cache behavior, and gave junior devs a clear mental model for async data. "Who calls this API" stopped being a team debate.

---

**State management (with a note)**
*Context: Self-aware aside*
I've shipped real products with thoughtful state management. I'd just rather not be asked to whiteboard it cold — my brain has DROP DATABASE preinstalled under pressure. I really hope this website is pulling its weight right now.

---

### Visual treatment

- The "State management" item's aside should be visually distinguished — maybe italic text or a slightly smaller font size within the card body. Not a tooltip — just a tone shift.
- Use `Card.astro` with `eyebrow` set to the context (e.g., "Booz Allen", "Legacy React codebases", etc.).
- Two-column grid on desktop, one-column on mobile (same grid pattern as Recent Work, `minmax(280px, 1fr)`).

---

## Section: What I'm Looking For (`id="looking-for"`)

### Heading

`<h2>` — "What I'm looking for"

### Content

Short paragraph form — not a bullet list. These are values, not requirements.

> Async-friendly teams that trust engineers to manage their own time. A design bar that people actually care about — not just "it works on mobile." Work that has a point to it, even if that point is just making a useful thing really well. Fast-moving without being chaotic: opinionated enough to make decisions, humble enough to revisit them.

Feel free to adjust the copy slightly for rhythm — but keep the four values intact: **async**, **design quality**, **meaningful work**, **structured velocity**.

### Visual treatment

- No cards — this should feel like a letter paragraph, not a feature list.
- Centered or left-aligned (consistent with rest of page).
- Slightly larger body text than standard body size — maybe `1.125rem` or `1.2rem`.
- A subtle left-border or decorative rule to give it visual weight without being a blockquote.

---

## Section: A Note on the Video Ask (`id="video-note"`)

### Heading

`<h2>` or `<h3>` (if placed within a closing `<section>` that already has context) — "About the video ask"

Use `<h2>` if this is a standalone section. Use `<h3>` only if it's part of a combined closing block with the Looking For section — but don't combine unless it feels right visually.

### Content

> I don't perform well talking to myself on camera. I perform well in actual conversations.
>
> If you want to see how I think, let's get on a call and I'll walk you through anything here live. I'll bring the same preparation I brought to building this, and you'll get a much better read on whether we'd work well together than a screen recording would give you.

The CTA here should feel like the natural close of a letter:

- A `Button` (solid): "Let's get on a call" — `href={mailto:${APPLICANT.email}}` (placeholder until email is set).
- Attribution below: *— Afton Gauntlett, Senior Frontend Developer* — styled like a letter sign-off (`em` or `cite` element, smaller font, muted color).

### Visual treatment

- This section can have a slightly different background to signal "we're at the end" — use `--tone-surface` instead of `--tone-bg`, or a subtle top border.
- Not visually dramatic — the copy is doing the work.
- The CTA button should have generous margin above it, not crammed against the last line of text.

---

## Full-Page Cleanup (in this PR or a dedicated commit)

Before marking this chunk complete, verify:

1. **`index.astro` section order:**
   - `<Hero />` (`#top`)
   - `<HowIStart />` (`#start`)
   - `<HowIChooseStack />` (`#stack`)
   - `<RecentWork />` (`#work`)
   - `<TeamLevels />` (`#teams`)
   - `<LookingFor />` (`#looking-for`)
   - `<VideoNote />` (no anchor needed, acts as footer-level close)

2. **Spacing rhythm:** Confirm that `padding-block: var(--space-16)` is consistent across all sections. Adjust any outliers.

3. **Heading hierarchy audit:**
   - One `<h1>` in Hero.
   - All section headings are `<h2>`.
   - Card titles within sections are `<h3>` (Card.astro already uses `<h3>`).
   - No `<h4>` or deeper unless clearly justified.

4. **Focus order audit:** Tab through the entire page. Every interactive element should be reachable in logical order.

5. **Reduced motion check:** `@media (prefers-reduced-motion: reduce)` suppresses the typewriter animation. Verify manually.

6. **Color contrast spot check:** Against the dark theme tokens, verify body text, muted text, and primary-colored elements all meet 4.5:1 (or 3:1 for large text/UI components).

---

## Validation Gate (Required Before Committing)

Run all of the following and confirm clean output:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run precommit:check
```

Do not commit until all pass.

---

## Acceptance Criteria

- [ ] All three sections render in correct order after Recent Work.
- [ ] Navbar anchors `#teams` and `#looking-for` scroll to correct sections.
- [ ] State management card aside is visually distinct (italic or smaller) without breaking `Card.astro` structure.
- [ ] "What I'm Looking For" is prose form, not a bullet list.
- [ ] Video Note section has a functional `Button` CTA (placeholder `mailto:` is fine).
- [ ] Letter sign-off uses semantic `<em>` or `<cite>`, styled appropriately.
- [ ] Full section order audit complete (see above).
- [ ] Heading hierarchy is clean (one H1, H2 sections, H3 cards).
- [ ] Tab order is logical through the full page.
- [ ] `npm run validate` passes clean.
- [ ] `npm run precommit:check` passes clean.
- [ ] Site looks correct under the `dark` theme in a browser.
