import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  detectLanguage,
  fetchFileContent,
  fetchRepoTree,
  filterTreeByWhitelist,
  type GitTreeEntry,
} from './github';

// ---------------------------------------------------------------------------
// filterTreeByWhitelist
// ---------------------------------------------------------------------------

describe('filterTreeByWhitelist', () => {
  const entries: GitTreeEntry[] = [
    { path: 'src/utils/links.ts', type: 'blob', sha: 'abc' },
    { path: 'src/utils/deriveEventStatus.ts', type: 'blob', sha: 'def' },
    { path: 'src/components/AppearanceForm/index.tsx', type: 'blob', sha: 'ghi' },
    { path: 'src/components/AppearanceForm/Step1.tsx', type: 'blob', sha: 'jkl' },
    { path: 'src/pages/index.astro', type: 'blob', sha: 'mno' },
    { path: 'README.md', type: 'blob', sha: 'pqr' },
    { path: 'package.json', type: 'blob', sha: 'stu' },
  ];

  it('matches exact file paths', () => {
    const result = filterTreeByWhitelist(entries, ['src/utils/links.ts']);
    expect(result).toHaveLength(1);
    expect(result[0].path).toBe('src/utils/links.ts');
  });

  it('matches directory prefix (entries under the dir)', () => {
    const result = filterTreeByWhitelist(entries, ['src/components/AppearanceForm/']);
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.path)).toEqual([
      'src/components/AppearanceForm/index.tsx',
      'src/components/AppearanceForm/Step1.tsx',
    ]);
  });

  it('does not match a path that only starts with a non-slash-terminated prefix', () => {
    // 'src/utils/links' should NOT match 'src/utils/links.ts'
    const result = filterTreeByWhitelist(entries, ['src/utils/links']);
    expect(result).toHaveLength(0);
  });

  it('combines exact paths and directory prefixes', () => {
    const result = filterTreeByWhitelist(entries, [
      'src/utils/links.ts',
      'src/components/AppearanceForm/',
    ]);
    expect(result).toHaveLength(3);
  });

  it('matches single-slash wildcard (all entries)', () => {
    const result = filterTreeByWhitelist(entries, ['/']);
    expect(result).toHaveLength(entries.length);
  });

  it('returns empty array when nothing matches', () => {
    const result = filterTreeByWhitelist(entries, ['nonexistent/path.ts']);
    expect(result).toHaveLength(0);
  });

  it('returns empty array when entries is empty', () => {
    const result = filterTreeByWhitelist([], ['src/utils/']);
    expect(result).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// detectLanguage
// ---------------------------------------------------------------------------

describe('detectLanguage', () => {
  it('detects TypeScript', () => expect(detectLanguage('src/utils/auth.ts')).toBe('typescript'));
  it('detects TSX', () => expect(detectLanguage('src/components/App.tsx')).toBe('tsx'));
  it('detects JavaScript', () => expect(detectLanguage('scripts/build.js')).toBe('javascript'));
  it('detects JSX', () => expect(detectLanguage('src/App.jsx')).toBe('jsx'));
  it('detects MJS as javascript', () => expect(detectLanguage('astro.config.mjs')).toBe('javascript'));
  it('detects Astro', () => expect(detectLanguage('src/pages/index.astro')).toBe('astro'));
  it('detects CSS', () => expect(detectLanguage('src/styles/global.css')).toBe('css'));
  it('detects Markdown', () => expect(detectLanguage('README.md')).toBe('markdown'));
  it('detects JSON', () => expect(detectLanguage('package.json')).toBe('json'));
  it('detects YAML (.yml)', () => expect(detectLanguage('.github/workflows/ci.yml')).toBe('yaml'));
  it('detects YAML (.yaml)', () => expect(detectLanguage('config.yaml')).toBe('yaml'));
  it('detects SQL', () => expect(detectLanguage('supabase/migrations/001_init.sql')).toBe('sql'));
  it('detects bash (.sh)', () => expect(detectLanguage('scripts/deploy.sh')).toBe('bash'));
  it('detects Dockerfile', () => expect(detectLanguage('path/to/Dockerfile')).toBe('dockerfile'));
  it('detects Makefile', () => expect(detectLanguage('Makefile')).toBe('makefile'));
  it('returns text for unknown extension', () => expect(detectLanguage('file.xyz')).toBe('text'));
  it('returns text for files with no extension', () => expect(detectLanguage('CODEOWNERS')).toBe('text'));
  it('detects dotfile as bash', () => expect(detectLanguage('.gitignore')).toBe('bash'));
  it('handles deeply nested paths', () => {
    expect(detectLanguage('a/b/c/d/e/deeply.nested.file.ts')).toBe('typescript');
  });
});

// ---------------------------------------------------------------------------
// fetchRepoTree (with fetch mocked)
// ---------------------------------------------------------------------------

describe('fetchRepoTree', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns blobs only from a successful tree response', async () => {
    const mockTree = [
      { path: 'src/index.ts', type: 'blob', sha: 'aaa', size: 100 },
      { path: 'src/', type: 'tree', sha: 'bbb' },
      { path: 'README.md', type: 'blob', sha: 'ccc', size: 50 },
    ];

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ tree: mockTree }), { status: 200 }),
    );

    const result = await fetchRepoTree('owner', 'repo', 'main');
    expect(result).toHaveLength(2);
    expect(result.every((e) => e.type === 'blob')).toBe(true);
  });

  it('passes Authorization header when token is provided', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ tree: [] }), { status: 200 }),
    );

    await fetchRepoTree('owner', 'repo', 'main', 'my-token');

    const [, init] = vi.mocked(fetch).mock.calls[0];
    const headers = (init as RequestInit).headers as Record<string, string>;
    expect(headers['Authorization']).toBe('Bearer my-token');
  });

  it('omits Authorization header when no token is provided', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ tree: [] }), { status: 200 }),
    );

    await fetchRepoTree('owner', 'repo', 'main');

    const [, init] = vi.mocked(fetch).mock.calls[0];
    const headers = (init as RequestInit).headers as Record<string, string>;
    expect(headers['Authorization']).toBeUndefined();
  });

  it('throws a descriptive error on 404', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('Not Found', { status: 404 }));

    await expect(fetchRepoTree('owner', 'bad-repo', 'main')).rejects.toThrow(
      /tree not found.*owner\/bad-repo@main/i,
    );
  });

  it('throws a rate-limit error on 403', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('Forbidden', { status: 403 }));

    await expect(fetchRepoTree('owner', 'repo', 'main')).rejects.toThrow(
      /rate limit/i,
    );
  });

  it('throws a rate-limit error on 429', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response('Too Many Requests', { status: 429 }),
    );

    await expect(fetchRepoTree('owner', 'repo', 'main')).rejects.toThrow(
      /rate limit/i,
    );
  });

  it('throws a generic error for other non-200 status codes', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response('Server Error', { status: 500 }),
    );

    await expect(fetchRepoTree('owner', 'repo', 'main')).rejects.toThrow(
      /500/,
    );
  });
});

// ---------------------------------------------------------------------------
// fetchFileContent (with fetch mocked)
// ---------------------------------------------------------------------------

describe('fetchFileContent', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function base64(str: string): string {
    return Buffer.from(str).toString('base64');
  }

  it('decodes base64 content and returns UTF-8 string', async () => {
    const rawContent = 'export const x = 1;\n';
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          content: base64(rawContent),
          encoding: 'base64',
          size: rawContent.length,
        }),
        { status: 200 },
      ),
    );

    const result = await fetchFileContent('owner', 'repo', 'src/x.ts', 'main');
    expect(result).toBe(rawContent);
  });

  it('returns null for files larger than 1MB', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          content: base64('hello'),
          encoding: 'base64',
          size: 2_000_000,
        }),
        { status: 200 },
      ),
    );

    const result = await fetchFileContent('owner', 'repo', 'big.bin', 'main');
    expect(result).toBeNull();
  });

  it('returns null when encoding is not base64', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({ content: 'hello', encoding: 'utf-8', size: 5 }),
        { status: 200 },
      ),
    );

    const result = await fetchFileContent('owner', 'repo', 'file.txt', 'main');
    expect(result).toBeNull();
  });

  it('returns null when content contains null bytes (binary file)', async () => {
    // Create a buffer with a null byte
    const binaryBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00]);
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          content: binaryBuffer.toString('base64'),
          encoding: 'base64',
          size: binaryBuffer.length,
        }),
        { status: 200 },
      ),
    );

    const result = await fetchFileContent('owner', 'repo', 'img.png', 'main');
    expect(result).toBeNull();
  });

  it('throws a descriptive error on 404', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('Not Found', { status: 404 }));

    await expect(
      fetchFileContent('owner', 'repo', 'missing.ts', 'main'),
    ).rejects.toThrow(/not found/i);
  });

  it('throws a rate-limit error on 429', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response('Too Many Requests', { status: 429 }),
    );

    await expect(
      fetchFileContent('owner', 'repo', 'file.ts', 'main'),
    ).rejects.toThrow(/rate limit/i);
  });

  it('encodes the path correctly in the URL (handles spaces and special chars)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({ content: base64('hello'), encoding: 'base64', size: 5 }),
        { status: 200 },
      ),
    );

    await fetchFileContent('owner', 'repo', 'path/to/my file.ts', 'main');

    const [url] = vi.mocked(fetch).mock.calls[0];
    expect(url as string).toContain('path%2Fto%2Fmy%20file.ts');
  });
});
