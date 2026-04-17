# PRD-07: GitHub Repository File Explorer

**Phase:** 2 (after PRD-06 complete)

Status: Complete (pivoted — see implementation notes below)
Completed: 2026-04-16 7:00pm

---

## ⚠️ Implementation Divergence

This PRD was written with a `/code` standalone page showing multiple repos. The actual implementation pivoted significantly during development. See the **Pivot Notes** section at the bottom for the full rationale. The rest of this document describes the original spec; the implementation notes describe what was actually built.

---

## Original Assessment (preserved for context)

This feature belongs in this project. The entire site exists to replace a Loom video — to show how Afton thinks, not just what she's shipped. PRD-02 through PRD-05 establish the *claims*: "I think carefully before writing code, I choose stacks deliberately, I've built these things." The file explorer is the *evidence*: here is the actual code, here is why this part is worth reading, here is what intentional decision-making looks like in a real codebase.

The technical approach is appropriate. All fetching happens at build time, Shiki is already part of Astro's compile pipeline, and no new architectural patterns are introduced. The WCAG and token requirements are identical to every other section.

---

## Original Goal (preserved for context)

Create a `/code` page that gives hiring managers a curated, guided window into real codebases. Not a GitHub clone — a small number of intentionally selected views, each labeled with what it is and why it's worth looking at. The experience should feel like someone handed you a well-annotated code review, not a repo dump.

---

## Scope

- Create `src/config/codeViews.ts` — configuration for all curated views across repos.
- Create `src/utils/github.ts` — build-time GitHub API utility functions (tree fetch + file content fetch).
- Create `src/utils/github.test.ts` — unit tests for the utility functions.
- Create `src/pages/code.astro` — the `/code` page, fetching all view data at build time. Reads the `?view=` query param at build time is not applicable (static); handle param client-side on mount to activate the matching tab.
- Create `src/components/sections/CodeExplorer.astro` — the full explorer section (tree + content pane).
- Create `src/components/ui/FileTree.astro` — the navigable file tree.
- Create `src/components/ui/CodePane.astro` — the syntax-highlighted file content pane.
- Add a `/code` nav link to `src/components/layout/Navbar.astro`.
- Add `sandboxHref` and `sandboxLabel` optional props to `src/components/ui/ProjectCard.astro` — renders a "Code walkthrough" button in the card's links row when present.
- Document the `GITHUB_TOKEN` env var in `.env.example`.

## Out of Scope

- No runtime API calls — zero. All data fetched at build time only.
- No file editing or write operations of any kind.
- No search within file contents.
- No diff/blame/history views.
- No support for private repos (public repos only via the unauthenticated GitHub API, with optional token for rate limit headroom).
- No directory downloads or copy-all actions.
- No infinite tree depth — whitelist config controls what's visible; implementations do not crawl beyond the configured scope.

---

## New Page: `/code`

The PROJECT_BRIEF lists `/` as the only planned page. This PRD adds `/code` as a second page. This is the correct call: a file tree + code panel layout needs horizontal breathing room a narrow scrolling section cannot provide. It also gives the feature a stable, shareable URL hiring managers can bookmark or return to.

Add a `Code` nav link in `Navbar.astro` pointing to `/code`. Keep it last in the nav order — after the anchor links for page sections — so it reads as "there's more depth if you want it," not as a primary navigation destination.

---

## Integration with Recent Work (PRD-04)

The `ProjectCard` component (`src/components/ui/ProjectCard.astro`) should gain an optional `sandboxHref` prop. When present, it renders a third button alongside the existing GitHub and Live Site buttons — labelled **"Code walkthrough"** — linking to `/code?view={id}`. The `/code` page reads the `view` query param on load and activates the matching view in the tab selector; if the param is absent or unrecognised, the first view is selected instead.

**Why this beats a modal:** The `/code` page was deliberately given a full-width layout because a file tree + code pane needs horizontal breathing room. An inline modal or drawer would require duplicating that layout. A link to `/code?view={id}` gets the context right for free.

**`sandboxHref` on `ProjectCard`:**

```ts
interface Props {
  // ... existing props
  sandboxHref?: string;   // e.g. '/code?view=gbva' — omit if no walkthrough view exists for this project
  sandboxLabel?: string;  // defaults to 'Code walkthrough'
}
```

- Button variant: `outline`, size `sm` (same as the existing GitHub button).
- Position: first in the links row, before the GitHub and Live Site buttons — it's the deepest engagement action, so it earns prime position.
- Only render the button when `sandboxHref` is provided. Projects without a confirmed walkthrough view omit it entirely.

### Per-project walkthrough feasibility

| Project | `CODE_VIEWS` id | Repo | Status |
|---------|-----------------|------|--------|
| Ghostbusters Virginia | `gbva` | `ghostbustersvirginia/ghostbustersva` | ✅ Ready to configure |
| prettyprettyprettygood | `prettyprettyprettygood` | `aftongauntlett/prettyprettyprettygood` | ✅ Ready to configure |
| This template | `template-prd` | `aftongauntlett/dear-company-name` | ✅ Already in config stub |
| NPC Finder | `npcfinder` | `aftongauntlett/npcfinder` | ✅ Confirmed public — not in PRD-04 project cards, but a strong standalone view on `/code` |
| JS13k / Orbital Order | `js13k` | `aftongauntlett/js13k-demo` | ✅ Single repo confirmed — 5 source files total, the constraint story is very readable |
| no-wb.org | `no-wb` | `aftongauntlett/no-whiteboard-jobs-dashboard` | ✅ Confirmed — Astro + Tailwind, data merge model is the highlight |

### Suggested highlight paths per ready project

These are starting points — the implementing agent should read the per-project write-ups in `docs/content/` and adjust.

**`gbva` — Ghostbusters Virginia**

Suggested `include` paths:
- `src/utils/links.ts` — URL safety validators wired into Zod content schema (defense-in-depth at the data layer)
- `src/utils/deriveEventStatus.ts` — timezone-aware event status logic using `Intl` API
- `src/components/AppearanceForm/` — five-step wizard with conditional step skipping, session storage persistence, and copy-as-constants pattern

**`prettyprettyprettygood` — prettyprettyprettygood.org**

Suggested `include` paths:
- `src/styles/tokens.css` (or equivalent) — every visual value as a custom property; nothing hardcoded
- `src/pages/api/contact.ts` (or equivalent) — honeypot + timestamp + Turnstile + rate-limit layered spam defense
- `src/pages/api/rate-limit.ts` (if separate) — SHA-256 hashed email keys in Upstash Redis

**`template-prd` — this template (already in stub)**

Suggested `include` paths (already set):
- `docs/prd/` — shows planning discipline before code is written

Consider expanding to also include:
- `src/config/site.ts` — single source of truth for applicant/company config
- `src/styles/global.css` — token-driven design system

**`npcfinder` — NPC Finder (confirmed public)**

Suggested `include` paths:
- `supabase/migrations/` — schema evolution story; early decisions hardened over time as the threat model was understood better. The migration history is itself the argument.
- `supabase/functions/` — edge functions with identity verification and SSRF protection on the scrape-url endpoint
- `supabase/MIGRATIONS-README.md` — documents the migration workflow; context for a hiring manager reading the SQL

Note: NPC Finder is not a PRD-04 project card (it's invite-only context). It lives as a standalone view on `/code` with no corresponding `sandboxHref` button on the project grid.

---

**`no-wb` — no-wb.org (no-whiteboard-jobs-dashboard)**

Suggested `include` paths:
- `src/data/` — three-file data model: `companies.json` (upstream mirror), `companies.local.json` (local-only additions), `companies.ts` (build-time merge with `source`/`overrideReason`/`overrideDate` traceability metadata). This is a clean example of respecting upstream, separating concerns, and making data provenance explicit.
- `src/utils/` — client-side TypeScript for search/filter/sort/view state

**`js13k` — Orbital Order (js13k-demo)**

Suggested `include` paths:
- `src/` — the entire source: only 5 files (`GameGolfed.js`, `components/ElectronGolfed.js`, `components/TutorialGolfed.js`, `systems/OrbitalSystemGolfed.js`, `systems/AudioSystemGolfed.js`). The constraint-driven architecture is visible at a glance — every class, every system justified by byte cost.
- `package.json` — the custom Terser build pipeline with property mangling and 3-pass compression
- `README.md` — the self-documented constraints + lessons learned section is itself worth reading

---

## Configuration: `src/config/codeViews.ts`

This file is the single source of truth for what gets shown. An implementing agent changes only this file to curate views — no template markup changes required.

```ts
export interface CodeView {
  /** Unique identifier — used as the tab/selector key and as the `?view=` query param value. */
  id: string;

  /** Display label shown in the view selector. */
  label: string;

  /**
   * One or two sentences explaining what this view shows and why it's
   * interesting. Rendered as visible UI copy above the explorer.
   */
  description: string;

  /** GitHub repo owner (username or org). */
  owner: string;

  /** GitHub repo name. */
  repo: string;

  /**
   * Branch or tag to fetch. Defaults to 'main' if omitted.
   * Will be resolved to a commit SHA at build time.
   */
  ref?: string;

  /**
   * Whitelist of paths to expose. Supports:
   * - Exact file paths:   'src/config/site.ts'
   * - Directory prefixes: 'docs/prd/'   (includes all files under this path)
   * - Single slash:       '/'           (exposes the entire tree — use sparingly)
   *
   * Paths are matched against the full tree returned by the GitHub API.
   * Files outside the whitelist are filtered out before any content is fetched.
   */
  include: string[];

  /**
   * The file to open by default when this view is activated.
   * Must be an exact path matching one of the resolved files in the tree.
   * When omitted, the explorer opens the first file alphabetically.
   *
   * Use this when the alphabetical first file is not the right entry point
   * — e.g. when a README should frame the code before the source is read.
   */
  defaultFile?: string;
}

export const CODE_VIEWS: CodeView[] = [
  {
    id: 'template-prd',
    label: 'How I plan: the PRDs behind this site',
    description:
      'Every feature on this site started as a PRD in the docs/prd/ folder — scope, spec, acceptance criteria, and the reasoning behind each decision. This is what planning looks like before a line of code gets written.',
    owner: 'aftongauntlett',
    repo: 'dear-company-name',
    include: ['docs/prd/', 'src/config/site.ts'],
  },
  {
    id: 'gbva',
    label: 'GBVA: defense-in-depth at the data layer',
    description:
      'URL validators wired directly into Zod content schemas, timezone-aware event status using Intl, and a five-step form wizard with conditional branching and session storage recovery. Every decision earned its weight.',
    owner: 'ghostbustersvirginia',
    repo: 'ghostbustersva',
    // Confirm exact paths against the actual repo tree before implementing.
    include: [
      'src/utils/links.ts',
      'src/utils/deriveEventStatus.ts',
      'src/components/AppearanceForm/',
    ],
  },
  {
    id: 'prettyprettyprettygood',
    label: 'prettyprettyprettygood: layered spam defense and CSS tokens',
    description:
      'A contact form defended in layers — honeypot, submission timing, Turnstile, and rate limits keyed to SHA-256 hashed email addresses. Plus a token system where nothing is hardcoded and the hero animation pulls its palette from CSS custom properties.',
    owner: 'aftongauntlett',
    repo: 'prettyprettyprettygood',
    // Confirm exact paths against the actual repo tree before implementing.
    include: [
      'src/styles/',
      'src/pages/api/',
    ],
  },
  {
    id: 'no-wb',
    label: 'no-wb.org: upstream data, local curation, explicit provenance',
    description:
      'Three-file data model: upstream mirror, local-only additions, and a build-time merge that tags every record with source and override metadata. Respecting upstream while making local changes traceable.',
    owner: 'aftongauntlett',
    repo: 'no-whiteboard-jobs-dashboard',
    include: [
      'src/data/',
      'src/utils/',
    ],
  },
  {
    id: 'js13k',
    label: 'Orbital Order: 13KB limit, zero dependencies',
    description:
      'Five source files, no libraries, everything under 13KB zipped. Procedural audio from Web Audio API, Canvas 2D rendering, a custom Terser build pipeline. Constraints as design tool.',
    owner: 'aftongauntlett',
    repo: 'js13k-demo',
    include: [
      'src/',
      'package.json',
      'README.md',
    ],
    // README opens first so the constraint rationale frames the single-letter class names
    // before the source code is read. The terseness is intentional — this makes that clear.
    defaultFile: 'README.md',
  },
  {
    id: 'npcfinder',
    label: 'NPC Finder: RLS, migrations, and honest iterating',
    description:
      'Row Level Security as the actual data isolation guarantee — not application-layer filtering. A migrations folder that tells the story of a threat model being understood over time, not designed perfectly upfront.',
    owner: 'aftongauntlett',
    repo: 'npcfinder',
    include: [
      'supabase/migrations/',
      'supabase/functions/',
      'supabase/MIGRATIONS-README.md',
    ],
    // Open the README first — it explains the migration workflow and why the history matters
    // before the SQL files are read.
    defaultFile: 'supabase/MIGRATIONS-README.md',
  },
  // Total: 6 views. That's at the upper edge of the "three to five" guidance — trim to 4–5 if
  // the page feels like a portfolio dump. Recommended cuts if needed: drop `npcfinder`
  // (no project card link) or `no-wb` (most self-contained story).
];
```

**Design notes:**
- Keep the view count small. Three to five curated views is the right range. More than five starts to read as a portfolio dump rather than a guided tour.
- Every `description` field should answer "why does a hiring manager care about this?" before "what is this?"
- The `include` whitelist is the editorial control. It is intentional that you cannot accidentally expose more than you mean to.
- The `id` value is used as the `?view=` query param. Keep it lowercase, hyphenated, stable — changing it breaks links from project cards.

---

## Build-Time Data Fetching: `src/utils/github.ts`

All API calls happen at build time inside `src/pages/code.astro`'s frontmatter. No API calls are made at runtime. No client-side fetch.

### Rate Limits

The GitHub Trees and Contents APIs allow **60 unauthenticated requests per hour** per IP. A production Vercel build shares this quota with other build steps. To be safe on rate limits:

- Document a `GITHUB_TOKEN` env var in `.env.example` (optional, unauthenticated works for small view counts).
- When `GITHUB_TOKEN` is present in the build environment, include it as a Bearer token. When absent, omit the Authorization header entirely — do not throw.
- Each `CodeView` requires one Trees API call + one Contents API call per whitelisted file. Keep file counts per view low (documents up to ~20 files per view as a soft ceiling in config comments).

### API Endpoints

```
// Fetch full recursive tree for a repo ref
GET https://api.github.com/repos/{owner}/{repo}/git/trees/{ref}?recursive=1

// Fetch individual file content (returns base64-encoded content)
GET https://api.github.com/repos/{owner}/{repo}/contents/{path}?ref={ref}
```

### Utility Function Signatures

```ts
/** Fetched tree entry from the GitHub Git Trees API. */
export interface GitTreeEntry {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
}

/** A fully resolved file node with its decoded content and highlighted HTML. */
export interface ResolvedFile {
  path: string;
  content: string;        // decoded UTF-8 source text
  highlightedHtml: string; // Shiki-rendered HTML, safe to set as innerHTML
  language: string;       // detected language for the filename
}

/**
 * Fetch the full recursive tree for a repo at a given ref.
 * Returns only blob entries (files), not tree entries (directories).
 * Throws on non-200 responses.
 */
export async function fetchRepoTree(
  owner: string,
  repo: string,
  ref: string,
  token?: string
): Promise<GitTreeEntry[]>

/**
 * Fetch the content of a single file.
 * Decodes from base64. Returns null if the file is binary or too large (>1MB).
 */
export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string,
  ref: string,
  token?: string
): Promise<string | null>

/**
 * Filter tree entries to only those matching the whitelist.
 * A path matches if it equals a whitelist entry exactly,
 * or if it starts with a whitelist entry that ends with '/'.
 */
export function filterTreeByWhitelist(
  entries: GitTreeEntry[],
  include: string[]
): GitTreeEntry[]

/**
 * Detect a Shiki-compatible language name from a file's extension.
 * Returns 'text' for unknown extensions.
 */
export function detectLanguage(path: string): string
```

### Error Handling

The `fetchRepoTree` and `fetchFileContent` functions should throw descriptive errors on non-200 API responses. These errors fail the build — which is the correct behavior. A misconfigured view should not silently produce an empty page.

Errors to handle explicitly:
- `404` on tree fetch: repo or ref not found — include the owner/repo/ref in the error message.
- `403` or `429` on any fetch: rate limit hit — include a message suggesting `GITHUB_TOKEN` env var.
- File content returns a non-UTF-8 or binary blob: return `null` from `fetchFileContent`, skip rendering that file in the tree (render a "(binary file)" placeholder in the tree label).

---

## Syntax Highlighting: Shiki

Astro ships with Shiki as its built-in highlighter for code blocks in MDX and content collections. Use Shiki's Node API directly in the build-time utility to highlight file contents.

```ts
import { getHighlighter } from 'shiki';

// Initialize once per build, not once per file.
const highlighter = await getHighlighter({
  theme: 'github-dark',    // matches the dark theme palette
  langs: [/* list of needed languages, resolved from detectLanguage results */],
});

const highlightedHtml = highlighter.codeToHtml(content, { lang });
```

- Use `github-dark` as the default theme. It visually aligns with the site's dark palette without needing a custom theme.
- Initialize the highlighter once in `code.astro`'s frontmatter and pass the instance through; do not re-initialize per file.
- If a language is not supported by Shiki, fall back to `'text'` — do not throw.
- (See Notes below - This has been refactored)

---

## Page: `src/pages/code.astro`

### Frontmatter responsibilities

1. Read `CODE_VIEWS` from `src/config/codeViews.ts`.
2. Read `GITHUB_TOKEN` from `import.meta.env.GITHUB_TOKEN` (undefined if not set).
3. Initialize the Shiki highlighter.
4. For each `CodeView`, in parallel:
   a. Fetch the full repo tree for the configured ref.
   b. Filter the tree against the view's `include` whitelist.
   c. Fetch file contents for all filtered blob entries.
   d. Highlight each file's content.
   e. Build a `ResolvedView` object: `{ view: CodeView, files: ResolvedFile[], tree: GitTreeEntry[] }`.
5. Pass the resolved views to the component layer as props.

Parallelizing steps 4a–4d per view (via `Promise.all`) is correct. Fetching all files within a view in parallel is also correct, subject to rate limit notes above.

### Page structure

```astro
---
// ... build-time data fetching (see above)
import BaseLayout from '../layouts/BaseLayout.astro';
import CodeExplorer from '../components/sections/CodeExplorer.astro';
import { APPLICANT, COMPANY } from '../config/site';
---
<BaseLayout title={`How I Work — ${APPLICANT.name}`}>
  <main id="main-content">
    <div class="container">
      <header class="code-page-header">
        <h1>How I work, in code</h1>
        <p class="code-page-intro">
          A few curated windows into real codebases — what I want you to see,
          and why it's worth looking at.
        </p>
      </header>
      <CodeExplorer views={resolvedViews} />
    </div>
  </main>
</BaseLayout>
```

- `<h1>` is "How I work, in code" — one H1, consistent with site convention.
- The `<main>` landmark gets `id="main-content"` for the skip link target.

---

## Component: `CodeExplorer.astro`

The top-level section component. Manages view selection and passes the active view to `FileTree` and `CodePane`.

### Props

```ts
interface Props {
  views: ResolvedView[];   // from build-time fetch
}
```

### Responsibilities

- Render a view selector UI (tabs or a styled button group) for switching between curated views.
- Render the selected view's `description` as visible copy above the explorer pane.
- Apply ARIA `tablist` / `tab` / `tabpanel` pattern for the view selector (see ARIA spec below).
- Pass the active view's file tree to `FileTree`.
- Pass the initially selected file's content to `CodePane` as the default. Selection priority: (1) the view's `defaultFile` if set and found in the resolved file list; (2) otherwise the first file alphabetically.
- Coordinate selection state between `FileTree` and `CodePane` via vanilla JS (no framework).

### View selector

Tabs styled with `--tone-primary` active indicator. Keyboard: left/right arrow keys switch tabs per ARIA tab pattern. Each tab is a `<button role="tab">`.

On page load, read `window.location.search` for a `view` param. If it matches a known view `id`, activate that tab. If absent or unrecognised, activate the first tab. This makes links from `ProjectCard` (`/code?view=gbva`) work without server-side routing.

### Layout

Two-pane grid on `≥ 768px`:
```
[ View tabs spanning full width ]
[ Description spanning full width ]
[ FileTree | CodePane            ]
  ~240px     1fr
```

On `< 768px`: file tree collapses into a disclosure (`<details><summary>`) above the code pane. The selected filename is shown as the `<summary>` label. This avoids a separate mobile layout implementation while keeping the tree accessible.

---

## Component: `FileTree.astro`

A keyboard-navigable file tree rendered from the filtered `GitTreeEntry[]`.

### Props

```ts
interface Props {
  entries: GitTreeEntry[];
  selectedPath: string;
}
```

### Rendering

Build a nested structure from the flat `entries` array before rendering: group entries by their directory path prefix, then render nested `<ul>` lists.

```
role="tree"
  role="treeitem" (directory)
    aria-expanded="true|false"
    role="group" (children when expanded)
      role="treeitem" (file)
        aria-selected="true|false"
```

- Directory items: expand/collapse on Enter or Space. `aria-expanded` reflects state.
- File items: activate on Enter or click. `aria-selected="true"` on the currently viewed file.
- Arrow keys: Down/Up move focus between visible items (standard ARIA tree pattern). Right expands a collapsed directory; Left collapses an expanded one or moves focus to parent.
- Visible focus indicator: `outline: 2px solid var(--tone-primary)` with `outline-offset: 2px`.

### Visual treatment

- Directories: show a `▶` / `▼` indicator (pure CSS via `::before`, reflecting `aria-expanded`).
- Files: indented under their directory. File extension determines a small colored dot or icon if an icon primitive exists; otherwise plain text.
- Active file: `background: var(--tone-surface-strong)`, left-border accent: `border-left: 2px solid var(--tone-primary)`.
- Font: monospace (use `--font-mono` if defined in tokens, otherwise `ui-monospace, SFMono-Regular, monospace`).
- Font size: slightly smaller than body text — `0.875rem`.

### Custom events

`FileTree` dispatches a custom DOM event `file-selected` with `detail: { path: string }` when a file item is activated. `CodeExplorer` listens for this and updates `CodePane` content without a page reload or full component re-render.

```ts
// Dispatched from FileTree JS
element.dispatchEvent(new CustomEvent('file-selected', {
  detail: { path },
  bubbles: true,
}));
```

---

## Component: `CodePane.astro`

Displays the syntax-highlighted content for the currently selected file.

### Props

```ts
interface Props {
  file: ResolvedFile | null;
}
```

### Rendering

- `<article>` wrapper with `aria-label` set to the filename (e.g. `aria-label="src/config/site.ts"`).
- A small filename header bar above the code: shows the relative file path, styled like an editor tab. This is `<header>` inside the `<article>`.
- Shiki's `highlightedHtml` is set via `set:html` directive (Astro's `innerHTML` equivalent). This is safe because the content is generated at build time from a known, trusted source — the GitHub API response for a public repo owned by the same person who configured the whitelist.
- Wrap the Shiki output in a `<div class="code-scroll-container">` with `overflow: auto` and `tab-size: 2`. This allows horizontal scroll on long lines without breaking the page layout.
- A "Copy" button in the filename header bar: copies the raw `content` (not the highlighted HTML) to the clipboard via `navigator.clipboard.writeText`. Announces success via a visually-observable text change ("Copied!" → reset after 2s). Does not use `aria-live` for this — a brief visual change is sufficient for a non-critical action.
- Line numbers are rendered by Shiki if configured; keep them enabled by default.

### Empty / null state

When `file` is null (no file selected, or the initial load before a selection), render an empty state with centered muted text: "Select a file to view its contents." with `role="status"` so screen readers announce the initial state.

---

## ARIA Summary

| Pattern | Implementation |
|---------|----------------|
| View selector | `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls` |
| File tree | `role="tree"`, `role="treeitem"`, `role="group"`, `aria-expanded`, `aria-selected` |
| Code pane | `<article>` with `aria-label` = filename |
| Copy button | `aria-label="Copy file contents"`, visual "Copied!" feedback |
| Mobile tree | Native `<details>/<summary>` — no ARIA override needed |

Full keyboard map:

| Key | Effect |
|-----|--------|
| Tab | Move focus between: view tabs → file tree → code pane → copy button |
| ←/→ (on tabs) | Switch active view |
| ↑/↓ (in tree) | Move focus between visible tree items |
| → (on collapsed dir) | Expand directory |
| ← (on expanded dir) | Collapse directory; ← on file moves focus to parent directory |
| Enter / Space (on file) | Open file in code pane |
| Enter / Space (on dir) | Toggle expand/collapse |

---

## Env Var: `GITHUB_TOKEN`

Document in `.env.example`:

```sh
# Optional — increases GitHub API rate limit from 60 to 5000 requests/hour at build time.
# Generate at https://github.com/settings/tokens/new (no scopes required for public repos).
# GITHUB_TOKEN=
```

Read in `github.ts` via `import.meta.env.GITHUB_TOKEN`. When present, add to all API requests:

```ts
headers: {
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(token && { 'Authorization': `Bearer ${token}` }),
}
```

**Security note:** `GITHUB_TOKEN` is a build-time env var only. It is never serialized into the built output, never exposed to the browser, and never committed to the repo. The `.env.example` entry is a comment — the actual value lives in the deployment environment (Vercel env vars).

---

## Navbar Update

Add a `/code` link to `Navbar.astro`:

- Label: "How I work"
- `href="/code"`
- Position: after the anchor links for page sections, before any external links.
- On the `/code` page itself, this link should carry `aria-current="page"`. The Navbar component currently uses anchor links (`#section`) for the main page. A simple path-match check in the Navbar's frontmatter (`Astro.url.pathname === '/code'`) handles this.

---

## Acceptance Criteria

- [ ] `/code` page builds and renders without runtime errors.
- [ ] All file tree data is fetched at build time — no client-side fetch to GitHub.
- [ ] Config in `codeViews.ts` controls exactly what repos and paths are exposed — no undocumented access.
- [ ] `GITHUB_TOKEN` env var is documented in `.env.example` and used when present (not required).
- [ ] View selector tabs are keyboard navigable (←/→ arrows, tab/shift-tab).
- [ ] File tree is keyboard navigable (↑/↓ to move, ←/→ to expand/collapse, Enter to open).
- [ ] Active file has `aria-selected="true"` on its tree item.
- [ ] Code pane `<article>` has `aria-label` set to the active filename.
- [ ] Copy button copies raw source text, not HTML.
- [ ] Mobile layout: file tree is accessible via `<details>/<summary>` collapse.
- [ ] On `prefers-reduced-motion`: no transitions or entrance animations.
- [ ] All colors use CSS custom properties — no hard-coded values.
- [ ] Font in file tree and code pane matches a monospace stack (`--font-mono` or fallback).
- [ ] `GITHUB_TOKEN` is never serialized into the built HTML output.
- [ ] A misconfigured or unreachable repo ref fails the build with a descriptive error.
- [ ] Navigating to `/code?view=gbva` (or any valid view id) activates the correct tab on load.
- [ ] Navigating to `/code?view=unknown` or `/code` with no param activates the first tab without error.
- [ ] `ProjectCard` renders a "Code walkthrough" button when `sandboxHref` is provided; button is absent when prop is omitted.
- [ ] "Code walkthrough" button links to the correct `/code?view={id}` URL for each project.
- [ ] NPC Finder has no `sandboxHref` on a project card (it's not a PRD-04 card); its view is accessible via `/code` directly.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run test` passes (github.ts utility functions have unit tests).
- [ ] `npm run build` passes.
- [ ] `npm run precommit:check` passes before committing.

---

## Pivot Notes — What Was Actually Built

The original spec called for a standalone `/code` page with 3–6 views across multiple repos (this site, NPC Finder, Orbital Order, GBVA, no-wb, prettyprettyprettygood). During implementation, the design pivoted significantly. Here is what actually shipped and why.

### What changed

**No `/code` page.** The standalone route was removed. `src/pages/code.astro` was deleted. The code explorer is now embedded in the home page as the `#how-i-work` section.

**One repo, this one.** The multi-repo concept was dropped entirely. Showing other projects alongside this one diluted the point — the site *is* the evidence. The explorer now shows the full `src/` tree of `dear-company-name` only.

**No view-switcher sidebar.** The tablist sidebar (which switched between curated views) was removed. With one repo the tabs were meaningless. The tree now shows the entire project, and the user browses freely.

**Highlighted files instead of curated views.** The "curated view" editorial layer is replaced by a `HIGHLIGHTED_FILES` array in `src/config/codeViews.ts`. These are 4 specific files worth calling out. They appear in the file tree with a `★` badge and accent color, and as annotation cards *above* the explorer so users know what to look for before they start browsing.

**Lazy loading as the featured pattern.** The explorer is heavy HTML. Rather than pre-rendering with a visible loading state, it uses `content-visibility: hidden` to defer browser paint until the section enters the viewport, then `requestIdleCallback` to detect when rendering is truly done before fading in. A Lottie animation (`black-rainbow-cat.lottie`) appears only if render takes longer than 300ms — the threshold at which users first perceive a delay. The lazy loading pattern itself became one of the highlighted files.

**Lottie animation added.** `@lottiefiles/dotlottie-web` was installed. `src/components/ui/LottiePlayer.astro` was created. The animation is theme-aware via a `MutationObserver` on `document.documentElement`.

### Files as-built

| File | Status | Notes |
|------|--------|-------|
| `src/config/codeViews.ts` | Modified | One view (`source`), plus new `HIGHLIGHTED_FILES` export |
| `src/utils/github.ts` | Created as specced | Build-time fetch + filter + language detection |
| `src/utils/github.test.ts` | Created as specced | 40 unit tests |
| `src/components/sections/CodeExplorer.astro` | Created, then simplified | No tablist; single `view` prop + `highlighted` prop |
| `src/components/ui/FileTree.astro` | Created as specced | Added `highlighted` prop — starred files styled with accent color |
| `src/components/ui/CodePane.astro` | Created as specced | |
| `src/components/ui/LottiePlayer.astro` | New — not in original spec | Canvas-based dotlottie player, theme-aware |
| `src/components/sections/HowIWork.astro` | New — not in original spec | Replaces `RecentWork.astro` on home page; owns the lazy-loading logic |
| `src/pages/code.astro` | Deleted | Route removed entirely |
| `src/components/sections/RecentWork.astro` | Deleted | Was removed from `index.astro`; file deleted as dead code |

### Navbar

`/code` link removed. `#work` anchor replaced with `#how-i-work`. The explorer is now a native section of the home page, not a separate destination.

> **⚠️ Implementation correction (2026-04-16):** The original spec quoted the Shiki v0/v1 `getHighlighter` API, which does not exist in Shiki 4.x (the version vendored by Astro 6.x). The initial implementation used `createHighlighter`, which does exist but creates a **new isolated instance** on every call. During development this produced two bugs:
>
> 1. **Syntax highlighting showed as plain unstyled text.** The call was using `themes: { light, dark }` with `defaultColor: false`, which makes Shiki emit only CSS custom property references (`--shiki-light`, `--shiki-dark`) per token span. When those vars aren't resolved — e.g. because the `.shiki` selector rule wasn't matching correctly — every token renders colorless. The fix: drop `defaultColor: false`, which makes Shiki bake light-theme colors in as direct `color:` values (the 4.x default). The dark theme override is a single CSS selector in global.css.
>
> 2. **"20 instances have been created" warning during dev.** Astro's HMR re-runs component frontmatter on each file save. `createHighlighter` is not deprecated or broken — it just creates a new isolated instance, which leaks on every hot reload. `getSingletonHighlighter` is the correct API here because it returns the same cached instance on every call within the same Node process.
>
> **Correct pattern for Shiki 4.x in Astro:**
>
> ```ts
> import { getSingletonHighlighter } from 'shiki';
>
> // Returns the same cached instance on every call within the same Node process.
> // Safe to call in component frontmatter — no instance leak on HMR.
> const highlighter = await getSingletonHighlighter({
>   themes: ['github-light', 'github-dark'],
>   langs: allLanguages,
> });
>
> // No defaultColor override — light colors baked in, dark swapped via CSS.
> const html = highlighter.codeToHtml(content, {
>   lang,
>   themes: { light: 'github-light', dark: 'github-dark' },
> });
> ```
>
> The intent of "initialize once, don't re-initialize per file" was right. The mechanism was wrong — `getSingletonHighlighter` handles the singleton guarantee internally, so no manual "pass the instance through" plumbing is needed.
>
> Also note: `shiki` was originally a transitive dep (pulled in by Astro). It has since been pinned explicitly in `package.json` (`"shiki": "^4.0.2"`) to prevent silent drift if Astro's internal dep ever changes.