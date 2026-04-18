# PRD-06: Page Copy

Status: Complete
Completed: 2026-04-16 2:00am

## Status

| Section | Status | Notes |
|---|---|---|
| Hero | ✅ Built | Matches spec |
| How I Start | ✅ Built | Group 2 has a third card ("Git hygiene") not in this PRD |
| How I Choose a Stack | ✅ Built | Last two principles diverged — see note below |
| Recent Work | ✅ Built | Descriptions condensed; copy intent preserved |
| Things I've Leveled Up Teams On | ✅ Built | Card 4 updated — see note below |
| What I'm Looking For | ✅ Built | Matches spec |
| A Note on the Video Ask | ✅ Built | Whiteboard paragraph added — see note below |

---

## Purpose

This PRD contains the final (or near-final) copy for every section of the site. Implementing agents should use this as the source of truth for all text content. Do not derive copy from the raw reference files in `docs/content/` — those are source material; this PRD is the distillation.

## Reference Files (for additional context only)

- `docs/content/gbva.md` — GBVA workflow + technical decisions
- `docs/content/npc-finder.md` — NPC Finder workflow + security architecture
- `docs/content/prettyprettyprettygood.md` — PPG workflow + design philosophy
- `docs/content/resumeData.json` — Full work history and project list

---

## Section: Hero (`id="top"`) ✅

### H1 (typewriter target)

```
Dear [Company Name],
```

Brackets shown briefly before typing begins. Final rendered state (post-animation):

```
Dear Your Company,
```

### Subheadline

> I built this instead of recording a video. I think you'll agree it was the right call.

### CTA buttons

- Primary: **Let's talk** → `mailto:hello@aftongauntlett.com`
- Ghost: **See my work ↓** → `#work`

---

## Section: How I Start (`id="start"`) ✅

> **Divergence note:** The built component added a third card to the "Team projects" group: **Git hygiene** — *"Atomic commits, useful messages, rebase on main before the PR. I review MRs with actual feedback and don't panic at a merge conflict."* The "Agent rules" card body was also slightly condensed. Both changes are intentional improvements.

### H2

> Before I write a line of code

### Intro paragraph

> My setup checklist runs before the first commit — whether I'm starting something new or joining an existing codebase.

### Card group 1 — eyebrow: "Every project"

**Lint**
Hard blocks, not warnings. If it can be caught statically, it gets caught before it ships.

**Typecheck**
TypeScript strict mode throughout. I'd rather fight the compiler for ten minutes than debug a runtime null at 11pm.

**Agent rules**
Reusable components, theme tokens, accessibility, keyboard nav — defined in Copilot instructions so AI assistance stays inside the guardrails instead of freestyling new patterns.

### Card group 2 — eyebrow: "Team projects"

**Prettier + ESLint**
Consistent formatting is about eliminating noisy format-diff PRs in code review so the actual logic gets the attention.

**Husky pre-commit hooks**
Everyone codes however they want. The hook cleans it before it hits the branch. No config policing, no "can you just run prettier" comments in review.

---

## Section: How I Choose a Stack (`id="stack"`) ✅

> **Divergence note:** The last two principles in this PRD ("TanStack Query for data fetching" and "Design tokens over component libraries") were replaced in the built component with:
> - **Accessibility is a constraint, not a checklist** — WCAG 2.2 AA, keyboard nav, focus styles, reduced motion, screen reader testing at the design stage.
> - **I can work both sides of the API** — Supabase, RLS, OAuth, writing endpoints, TanStack Query for frontend caching.
>
> The built version is better. The copy below is retained for reference but does **not** reflect what's on the page.

### H2

> How I choose a tech stack

### Intro paragraph

> Fast to ship, easy to hand off, boring where boring is correct.

### Definition list items

**Static first**
If the content doesn't need a server, I don't use one. Astro is my default — it ships zero JavaScript unless I ask it to. Fast page loads, zero cold starts, no attack surface from a running process.

**Reach for the platform**
Native `<dialog>`, CSS scroll-snap, `IntersectionObserver`. If the browser can do it, I don't reach for a dependency. Less to update, less to audit, less to explain to the next developer.

**Add a framework when the UI earns it**
React when the interaction complexity justifies the bundle cost — not by default. I've shipped Astro with React islands for exactly two interactive pieces while everything else stayed zero-JS. That was the right call.

**TanStack Query for data fetching**
Caching, background refetching, optimistic updates — without the `useEffect`/`useState` sprawl. Turns "who owns this API call" from a team debate into a non-issue. I've introduced it to more than one codebase and never once regretted it.

**Design tokens over component libraries**
I can work in any system, but I'd rather own the tokens than fight a third-party theme. Every color, spacing unit, and shadow should trace back to a single source of truth — so when something feels off, you can fix it in one place.

---

## Section: Recent Work (`id="work"`) ✅

> **Note:** Card descriptions were condensed in the built component. Copy intent and all key technical details are preserved. The PRD copy below remains useful reference if descriptions need to be restored to full length.

### H2

> Recent work

### Intro line

> A range of real constraints, real clients, and one that's just for fun.

---

### Card 1: Ghostbusters Virginia

**Eyebrow:** Nonprofit rebuild
**Title:** Ghostbusters Virginia
**Tech tags:** Astro · TypeScript · React Islands · Markdoc · Vercel
**Links:** [Live site](https://gbva-site.vercel.app/) · [GitHub](https://github.com/ghostbustersvirginia/ghostbustersva)

**Description:**
Full rebuild of a fan-run nonprofit's community site — replacing a legacy WordPress setup with a static Astro architecture. Event calendar with countdowns, photo gallery, a five-step appearance request wizard with conditional branching and sessionStorage-backed state, a PKE-meter SVG donation gauge with all geometry computed server-side at build time, and an LED scrollbar published as its own npm package. React islands only where genuine interactivity was needed; everything else is zero-JS.

Accessibility was factored in from the start — focus trapping in the lightbox, `aria-describedby` wired to inline error messages, keyboard navigation throughout the form stepper. Built in collaboration with one other developer; I made the final architecture calls and reviewed all PRs.

---

### Card 2: NPC Finder

**Eyebrow:** Personal project · In development
**Title:** NPC Finder
**Tech tags:** React 19 · TypeScript · TanStack Query · Supabase · Framer Motion · Vercel
**Links:** [Live site](https://npcfinder.com/) · [GitHub](https://github.com/aftongauntlett/npcfinder)

**Description:**
An invite-only social utility for a small trusted group — somewhere between a private media tracker and a shared home base. Kanban boards, recipe tracker, job tracker, customizable profiles with a nostalgic early-web quality.

The security foundation is PostgreSQL Row Level Security — every table enforces data isolation at the database layer, not in application code. On top of that: role-based access, security-definer functions with pinned search paths, rate limiting baked into the database schema, and edge functions for any write operation that needs elevated access. The scrape-url function has explicit SSRF protection. HSTS, CSP, and frame-ancestors on the frontend.

It's iterative and honest about what I didn't know at the start — the migrations folder tells that story better than I can.

---

### Card 3: No Whiteboard Jobs Dashboard

**Eyebrow:** Side project
**Title:** no-wb.org
**Tech tags:** Astro · TypeScript · Tailwind CSS · Vercel
**Links:** [Live site](https://no-wb.org/) · [GitHub](https://github.com/aftongauntlett/no-whiteboard-jobs-dashboard)

**Description:**
A frontend dashboard built on the Hiring Without Whiteboards open dataset — turning a large markdown list into a fast, searchable web experience. Full-text search, multi-filtering, card and list view modes, pagination, dark/light themes, mobile-first navigation. Scoped problem, fast execution, shipped and used.

---

### Card 4: Orbital Order — JS13k Entry

**Eyebrow:** Constraint-driven game dev
**Title:** Orbital Order
**Tech tags:** JavaScript · Canvas 2D · Web Audio API · 13kb limit
**Links:** [Play game](https://orbital-order.aftongauntlett.com/) · [GitHub](https://github.com/aftongauntlett/js13k-demo)

**Description:**
Annual game jam where the entire submission — HTML, JS, CSS, assets — must fit in 13 kilobytes. No frameworks, no libraries, no exceptions. This one is a physics-based puzzle where you guide electrons into atomic orbitals using electromagnetic attraction and repulsion. Pure platform APIs, tight mechanics, and creative compression. I enter because the constraints are genuinely fun and because shipping something in 13kb keeps you honest about what code actually needs to exist.

---

## Section: Things I've Leveled Up Teams On (`id="teams"`) ✅

### H2

> Things I've leveled up teams on

### Card 1

**Eyebrow:** Booz Allen Hamilton
**Title:** Figma workflow and design process
**Body:**
Helped the team move from ad-hoc design handoff to a shared Figma component library used by both designers and developers. Working from the same source of truth meant fewer implementation surprises and faster iteration — prototypes became the thing we showed clients, not wireframes we hoped someone would interpret correctly. We won contracts over competing bids partly because the prototypes were that good.

---

### Card 2

**Eyebrow:** Booz Allen Hamilton
**Title:** Angular-to-React migration
**Body:**
Led the full migration of a core government platform from Angular and Node to React with TypeScript. The goal wasn't just a syntax change — it was restructuring component and state logic so the codebase was legible to the whole team, not just whoever wrote a given piece. Introduced functional components, shared ESLint and Prettier config, Husky hooks, and wrote the onboarding documentation that made the new patterns stick.

---

### Card 3

**Eyebrow:** Multiple teams
**Title:** TanStack Query for data fetching
**Body:**
Introduced TanStack Query to replace scattered `useEffect`/`useState` API patterns on more than one codebase. The first benefit is obvious — caching, background refetch, optimistic updates. The second benefit is less obvious until you've lived it: junior developers get a clear, consistent mental model for async data instead of reinventing fetch logic in every component. It changes the quality conversation in code review.

---

### Card 4

**Eyebrow:** Booz Allen Hamilton
**Title:** Promoted to lead within a year
**Body:**
Within twelve months of joining, I was promoted to lead, received three internal awards, and was selected by the department to attend AWS re:Invent in Las Vegas. The promotion and the recognition were a direct response to the Figma workflow and Angular migration work — evidence that the changes actually changed how the team operated.

---

## Section: What I'm Looking For (`id="looking-for"`) ✅

### H2

> What I'm looking for

### Body (prose — no bullet list)

> Async-friendly teams that trust engineers to manage their own time. A design bar that people actually care about — not just "it works on mobile." Work that has a point to it, even if that point is just making a useful thing really well.
>
> Fast-moving without being chaotic: opinionated enough to make decisions, humble enough to revisit them. I want to work somewhere that treats accessibility and code quality as defaults, not debt to pay down later.

---

## Section: A Note on the Video Ask (`id="video-note"` or no anchor — closing section) ✅

### H2

> About the video ask

### Body

> I don't perform well talking to myself on camera. I perform well in actual conversations.
>
> If you want to see how I think, let's get on a call and I'll walk you through anything here live. I'll bring the same preparation I brought to building this, and you'll get a much better read on whether we'd work well together than a screen recording would.
>
> The same goes for live whiteboard and algorithmic interviews. I don't have a CS degree, and if someone is watching me code under pressure I'd probably spell my name wrong — genuinely not my best side. Take-home exercises or async work samples give a much more accurate picture of how I actually work.

### CTA button

**Label:** Let's get on a call
**href:** `mailto:hello@aftongauntlett.com`

### Sign-off

*— Afton Gauntlett, Senior Frontend Developer*

---

## Copy Notes for Implementors

- All section H2s should be consistent in tone — confident and dry, not corporate.
- The `prettyprettyprettygood.md` line about "renting space from a platform that owns their presence" is good copy but doesn't have a home in these sections — it belongs on the PPG project itself. Don't force it here.
- All external project links open in `target="_blank" rel="noopener noreferrer"`.
- Tech tags on project cards are visual labels only — no links needed.
- The `no-wb.org` and `Orbital Order` GitHub repo links should be confirmed live before the site is sent to a target company.
