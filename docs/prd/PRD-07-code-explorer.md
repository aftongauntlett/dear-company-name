# PRD-07: GitHub Repository File Explorer

**Phase:** 2 (after PRD-06 complete)

Status: Complete
Completed: 2026-04-16, updated 2026-04-17

---

## What Was Built

The code explorer is embedded in the home page as the `#how-i-work` section. It fetches this repo's source tree at build time via the GitHub API, highlights it using Astro's built-in `<Code />` component, and ships as fully static HTML — zero network calls at runtime.

A curated subset of files is exposed (no env.d.ts, 404 page, or other low-signal files). Four specific files are starred and annotated as highlights. A "View on GitHub" button below the explorer links to the full repo for anyone who wants to dig deeper.

---

## Files

| File | Role |
|------|------|
| `src/config/codeViews.ts` | Whitelist of exposed paths + `HIGHLIGHTED_FILES` annotation cards |
| `src/utils/github.ts` | Build-time fetch helpers (tree, file content, language detection) |
| `src/utils/github.test.ts` | 40 unit tests for `github.ts` |
| `src/components/sections/HowIWork.astro` | Section owner — fetches data, owns lazy-load logic |
| `src/components/sections/CodeExplorer.astro` | Layout shell for tree + pane |
| `src/components/ui/FileTree.astro` | Keyboard-navigable file tree |
| `src/components/ui/CodePane.astro` | Syntax-highlighted file content pane |

---

## Data Flow

1. `HowIWork.astro` frontmatter runs at `astro build`.
2. Calls `fetchRepoTree` → `filterTreeByWhitelist` → `fetchFileContent` per filtered file.
3. Each file is stored as `{ path, content, language }` — no pre-rendered HTML.
4. `CodePane.astro` renders each file using Astro's `<Code />` component at build time.
5. All file articles are in the DOM at load; JS toggles visibility on tree selection.

---

## Syntax Highlighting

Uses Astro's built-in `<Code />` component from `astro:components`.

```astro
import { Code } from 'astro:components';
import type { CodeLanguage } from 'astro';

<Code
  code={file.content}
  lang={file.language as CodeLanguage}
  themes={{ light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' }}
  wrap={false}
/>
```

- `github-light-high-contrast` / `github-dark-high-contrast` chosen for WCAG AA contrast compliance.
- No separate `shiki` devDependency — Astro bundles its own copy.
- The dual-theme CSS variable swap is handled by a single selector in `global.css`:

```css
:root[data-theme='dark'] .shiki,
:root[data-theme='dark'] .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  font-style: var(--shiki-dark-font-style);
  font-weight: var(--shiki-dark-font-weight);
  text-decoration: var(--shiki-dark-text-decoration);
}
```

---

## Lazy Loading

The explorer is heavy HTML. `content-visibility: hidden` defers browser paint until the section enters the viewport. On intersection:

1. `content-visibility` flips to `visible` — browser begins layout and paint.
2. A CSS spinner appears only if rendering hasn't finished within 300ms (the threshold at which users perceive a delay).
3. `requestIdleCallback` fires when the browser is truly idle — spinner fades, explorer fades in.

Fast loads: spinner never appears. Slow loads: spinner shows for the real duration of browser work.

---

## Highlighted Files

Defined in `HIGHLIGHTED_FILES` in `src/config/codeViews.ts`. Each entry has a `path` and a `note`. They appear as annotation cards above the explorer and as starred (`★`) items with accent color in the file tree.

Current highlights:
- `src/styles/global.css` — design token system
- `src/utils/github.ts` — build-time fetch + language detection
- `src/components/layout/ThemePicker.astro` — zero-JS theme switching
- `src/components/sections/HowIWork.astro` — this section's lazy-load pattern

---

## File Whitelist

Configured in `codeViews.ts`:

```ts
include: [
  'src/components/',
  'src/config/',
  'src/layouts/',
  'src/pages/index.astro',
  'src/styles/',
  'src/utils/',
  'astro.config.mjs',
  'package.json',
],
defaultFile: 'src/styles/global.css',
```

Intentionally excluded: `src/env.d.ts` (Astro boilerplate), `src/pages/404.astro` (not a signal of engineering skill), `README.md` (the GitHub button covers it).

---

## GitHub Token

`GITHUB_TOKEN` is an optional build-time env var. When set, it raises the GitHub API rate limit from 60 to 5000 req/hr. It is never serialized into built output. Set in the Vercel environment, not committed to the repo.

---

## What the Original Spec Proposed (not built)

The original PRD described a standalone `/code` page with tabs switching between 3–6 repos. During implementation this was dropped:

- **No `/code` page** — the explorer lives at `#how-i-work` on the home page.
- **One repo only** — showing other projects alongside this one diluted the point. The site *is* the evidence.
- **No view-switcher sidebar** — with one repo the tabs were meaningless.
- **Lottie removed from index** — the cat animation was originally the slow-load placeholder. It was replaced with a CSS spinner to eliminate the DotLottie WASM from the critical path and improve Lighthouse performance. The cat still lives on the 404 page.
