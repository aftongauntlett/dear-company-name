# PRD-09: About Me Section

**Phase:** 2
Status: Not Started
Completed:

---

## Goal

Add a personal origin story section to the page — who Afton is, how she got into development, and what she does outside of work. Hiring managers almost always open interviews and video asks with "tell me about yourself." This section pre-answers that cleanly and makes the site feel human before and alongside the professional evidence.

---

## Placement

Between **HowIChooseStack** and **RecentWork**. The section order becomes:

```
Hero → HowIStart → HowIChooseStack → About → RecentWork → TeamLevels → LookingFor
```

This placement works because:
- The first two sections establish *how* Afton thinks and works — this section then adds *who* she is before the evidence starts
- By RecentWork the reader has a full picture of the person, not just the engineer
- It avoids front-loading personal content before professional credibility is established

Alternating background: section gets `--tone-surface` (HowIChooseStack uses `--tone-bg`, RecentWork uses `--tone-surface` — adjust RecentWork to `--tone-bg` to restore alternation).

---

## Scope

- Create `src/components/sections/About.astro`
- Add `<About />` to `src/pages/index.astro` in the correct order
- Update RecentWork background token if needed to preserve alternating rhythm
- No new components required — use existing layout primitives and prose patterns

---

## Out of Scope

- No headshot or photo (keep it text-first for now)
- No timeline or visual career progression chart
- No social embed or external content

---

## Content Spec

Three subsections, flowing as natural prose — no subheadings needed, just paragraphs that breathe.

### 1. Origin story

How Afton got into development. Not a résumé summary — the actual path. The goal, the pivot, the first real thing that clicked. Keep it specific and honest; avoid "I've always been passionate about technology."

Suggested beats:
- What she was doing before or alongside getting into dev
- What drew her into it specifically (not generic "problem solving")
- The moment or project where it became real

*This content needs to come from Afton — do not fabricate a backstory. Placeholder copy below.*

> Placeholder: "I came to development sideways — [fill in actual origin]. The first time [specific thing happened] I knew this was the right direction."

### 2. How it became a career

Brief — one paragraph. Covers the arc from early work to Booz Allen, what changed when she became a lead, and what that trajectory taught her about the kind of work she wants to do next.

*Placeholder:*
> "I went from [early role/context] to leading a team at Booz Allen within a year. What changed wasn't the skills — it was learning that the work I cared most about was the part that affected other people: the design, the review culture, the demos that landed contracts."

### 3. Outside of work

Hobbies, interests, how she thinks about non-work time. Specific is better than vague. "I play video games" is less interesting than "I built a game for js13k — 13kb limit, no dependencies, and it had to run in a browser." The hobbies section can pull double-duty: it humanises AND signals things (side projects, community involvement, creative interests) that matter to the right teams.

*Placeholder:*
> "Outside of work [fill in actual hobbies/interests]."

---

## Layout

Single-column, left-aligned, max-width constrained (same as prose sections). The section should feel like reading a short letter, not a profile card.

- Section heading: "A bit about me" or "Who I am outside the résumé" (final copy TBD with Afton)
- No cards, no grid, no icons
- Same prose type scale as other body-text sections: `clamp(1rem, 1.2vw, 1.15rem)`
- Left border accent on the prose block — same as `lookingfor-body` treatment — to visually tie it to the "voice" sections

---

## Acceptance Criteria

- [ ] Section renders between HowIChooseStack and RecentWork
- [ ] Background alternates correctly with adjacent sections
- [ ] Section is reachable via keyboard, has correct heading hierarchy (h2)
- [ ] Body text matches font size of all other prose sections
- [ ] No hardcoded colors — uses design tokens only
- [ ] `npm run typecheck`, `npm run lint`, `npm run test` all pass
