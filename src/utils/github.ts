import type { CodeView } from '../config/codeViews';

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
  content: string; // decoded UTF-8 source text
  highlightedHtml: string; // Shiki-rendered HTML, safe to set as innerHTML
  language: string; // detected language for the filename
}

/** A fully resolved view ready for the CodeExplorer component. */
export interface ResolvedView {
  view: CodeView;
  files: ResolvedFile[];
  tree: GitTreeEntry[];
}

const GITHUB_API = 'https://api.github.com';

function getHeaders(token?: string): Record<string, string> {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
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
  token?: string,
): Promise<GitTreeEntry[]> {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${ref}?recursive=1`;
  const res = await fetch(url, { headers: getHeaders(token) });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(
        `GitHub tree not found: ${owner}/${repo}@${ref}. Check that the repo and ref exist.`,
      );
    }
    if (res.status === 403 || res.status === 429) {
      throw new Error(
        `GitHub API rate limit hit fetching tree for ${owner}/${repo}. Set the GITHUB_TOKEN env var to increase the limit.`,
      );
    }
    throw new Error(
      `GitHub API error ${res.status} fetching tree for ${owner}/${repo}@${ref}`,
    );
  }

  const data = (await res.json()) as { tree: GitTreeEntry[] };
  return data.tree.filter((entry) => entry.type === 'blob');
}

/**
 * Fetch the content of a single file.
 * Decodes from base64. Returns null if the file is binary or too large (>1MB).
 */
export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string,
  ref: string,
  token?: string,
): Promise<string | null> {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(ref)}`;
  const res = await fetch(url, { headers: getHeaders(token) });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(
        `File not found: ${owner}/${repo}/${path}@${ref}`,
      );
    }
    if (res.status === 403 || res.status === 429) {
      throw new Error(
        `GitHub API rate limit hit fetching ${path}. Set the GITHUB_TOKEN env var.`,
      );
    }
    throw new Error(
      `GitHub API error ${res.status} fetching ${owner}/${repo}/${path}@${ref}`,
    );
  }

  const data = (await res.json()) as {
    content?: string;
    encoding?: string;
    size?: number;
  };

  // Return null for files > 1MB
  if (data.size !== undefined && data.size > 1_000_000) {
    return null;
  }

  if (!data.content || data.encoding !== 'base64') {
    return null;
  }

  try {
    // Buffer is available in Node.js ≥ 22 (required by package.json engines field)
    const decoded = Buffer.from(
      data.content.replace(/\n/g, ''),
      'base64',
    ).toString('utf-8');

    // Null bytes indicate a binary file
    if (decoded.includes('\0')) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

/**
 * Filter tree entries to only those matching the whitelist.
 * A path matches if it equals a whitelist entry exactly,
 * or if it starts with a whitelist entry that ends with '/'.
 */
export function filterTreeByWhitelist(
  entries: GitTreeEntry[],
  include: string[],
): GitTreeEntry[] {
  return entries.filter((entry) =>
    include.some((pattern) => {
      if (pattern === '/') return true;
      if (pattern.endsWith('/')) return entry.path.startsWith(pattern);
      return entry.path === pattern;
    }),
  );
}

const EXTENSION_LANGUAGE_MAP: Record<string, string> = {
  ts: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  jsx: 'jsx',
  mjs: 'javascript',
  cjs: 'javascript',
  astro: 'astro',
  css: 'css',
  scss: 'scss',
  less: 'less',
  html: 'html',
  md: 'markdown',
  mdx: 'mdx',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  toml: 'toml',
  sql: 'sql',
  sh: 'bash',
  bash: 'bash',
  zsh: 'bash',
  rs: 'rust',
  py: 'python',
  rb: 'ruby',
  go: 'go',
  java: 'java',
  swift: 'swift',
  kt: 'kotlin',
  graphql: 'graphql',
  gql: 'graphql',
};

const SPECIAL_FILENAMES: Record<string, string> = {
  Dockerfile: 'dockerfile',
  Makefile: 'makefile',
};

/**
 * Detect a Shiki-compatible language name from a file's extension.
 * Returns 'text' for unknown extensions.
 */
export function detectLanguage(path: string): string {
  const filename = path.split('/').pop() ?? '';

  // Handle special filenames without extensions
  if (filename in SPECIAL_FILENAMES) {
    return SPECIAL_FILENAMES[filename];
  }

  // Handle dotfiles like .env, .env.example, .gitignore
  if (filename.startsWith('.') && !filename.slice(1).includes('.')) {
    return 'bash';
  }

  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return 'text';

  const ext = filename.slice(lastDot + 1).toLowerCase();
  return EXTENSION_LANGUAGE_MAP[ext] ?? 'text';
}
