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
    id: 'source',
    label: 'dear-company-name',
    description: 'The full source of this site.',
    owner: 'aftongauntlett',
    repo: 'dear-company-name',
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
  },
];

/**
 * Files worth calling out specifically.
 * Rendered as annotation cards below the code explorer in HowIWork.astro,
 * and highlighted (accent color + star) in the file tree.
 */
export const HIGHLIGHTED_FILES: Array<{ path: string; note: string }> = [
  {
    path: 'src/styles/global.css',
    note: 'Every color, size, shadow, and radius lives here as a CSS custom property. Switching themes is one attribute change on <code>&lt;html&gt;</code> — no JavaScript ever touches a color value.',
  },
  {
    path: 'src/utils/github.ts',
    note: 'The entire explorer was assembled at compile time. GitHub API during astro build, Shiki highlighting baked in, zero network calls at runtime. The test file next to it specifies exactly what the filtering and language-detection guarantees.',
  },
  {
    path: 'src/components/layout/ThemePicker.astro',
    note: 'About 50 lines, no framework, no dependencies. Persists to <code>localStorage</code>, sets a data attribute on the root element, and everything downstream reacts through CSS custom properties.',
  },
  {
    path: 'src/components/sections/HowIWork.astro',
    note: 'This section. <code>content-visibility: hidden</code> defers paint until the section enters the viewport, then <code>requestIdleCallback</code> detects when the browser is actually idle — so the Lottie plays for the real duration of browser work, not a fake timer.',
  },
];
