import { describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import {
  applyCompanyToDom,
  fromCompanyPathSegment,
  getCompanyFromPath,
  initializeCompanyTargeting,
  resolveCompanyName,
  toCompanyPathSegment,
} from './companyTargeting';

describe('company targeting URL helpers', () => {
  it('encodes spaces as underscores while preserving plus and hyphen', () => {
    expect(toCompanyPathSegment('Booz Allen')).toBe('Booz_Allen');
    expect(toCompanyPathSegment('Coca-Cola')).toBe('Coca-Cola');
    expect(toCompanyPathSegment('R+D')).toBe('R+D');
    expect(toCompanyPathSegment('U.S. Digital Service')).toBe('U.S._Digital_Service');
  });

  it('decodes path segments back to display names', () => {
    expect(fromCompanyPathSegment('Booz_Allen')).toBe('Booz Allen');
    expect(fromCompanyPathSegment('Coca-Cola')).toBe('Coca-Cola');
    expect(fromCompanyPathSegment('R%2BD')).toBe('R+D');
    expect(fromCompanyPathSegment('')).toBeNull();
    expect(fromCompanyPathSegment('%E0%A4%A')).toBeNull();
  });

  it('extracts company from /for/ path', () => {
    expect(getCompanyFromPath('/for/Booz_Allen')).toBe('Booz Allen');
    expect(getCompanyFromPath('/for/Coca-Cola')).toBe('Coca-Cola');
    expect(getCompanyFromPath('/')).toBeNull();
  });

  it('resolves company using query, then path, then storage, with localhost fallback', () => {
    expect(resolveCompanyName({
      pathname: '/for/Path_Company',
      search: '?to=Query%20Company',
      storedCompany: 'Stored Company',
      hostname: 'hire.aftongauntlett.com',
    })).toBe('Query Company');

    expect(resolveCompanyName({
      pathname: '/for/Path_Company',
      search: '',
      storedCompany: 'Stored Company',
      hostname: 'hire.aftongauntlett.com',
    })).toBe('Path Company');

    expect(resolveCompanyName({
      pathname: '/',
      search: '',
      storedCompany: 'Stored Company',
      hostname: 'hire.aftongauntlett.com',
    })).toBe('Stored Company');

    expect(resolveCompanyName({
      pathname: '/',
      search: '',
      storedCompany: null,
      hostname: 'localhost',
    })).toBe('Local Dev');
  });
});

describe('company targeting DOM behavior', () => {
  it('updates headline, typewriter target, title, and social title meta tags', () => {
    const dom = new JSDOM(`<!doctype html><html><head>
      <title>Old Title</title>
      <meta property="og:title" content="Old" />
      <meta name="twitter:title" content="Old" />
      <meta name="title" content="Old" />
    </head><body>
      <h1 class="hero-headline">Dear your team,</h1>
      <span data-target="your team"></span>
    </body></html>`);

    applyCompanyToDom({
      document: dom.window.document,
      companyName: 'Coca-Cola',
      applicantName: 'Afton Gauntlett',
    });

    expect(dom.window.document.querySelector('.hero-headline')?.textContent).toBe('Dear Coca-Cola,');
    expect(dom.window.document.querySelector('[data-target]')?.getAttribute('data-target')).toBe('Coca-Cola');
    expect(dom.window.document.title).toBe('Dear Coca-Cola — Afton Gauntlett');
    expect(dom.window.document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe('Dear Coca-Cola — Afton Gauntlett');
    expect(dom.window.document.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe('Dear Coca-Cola — Afton Gauntlett');
    expect(dom.window.document.querySelector('meta[name="title"]')?.getAttribute('content')).toBe('Dear Coca-Cola — Afton Gauntlett');
  });

  it('initializes runtime targeting, canonicalizes URL, and stores company', () => {
    const dom = new JSDOM(`<!doctype html><html><head>
      <meta property="og:title" content="Old" />
      <meta name="twitter:title" content="Old" />
      <meta name="title" content="Old" />
      <title>Old Title</title>
    </head><body>
      <h1 class="hero-headline">Dear your team,</h1>
      <span data-target="your team"></span>
    </body></html>`);

    const store = new Map<string, string>();
    const replaceState = vi.fn();
    const replace = vi.fn();

    const company = initializeCompanyTargeting({
      window: {
        location: {
          pathname: '/',
          search: '?to=Booz%20Allen',
          hostname: 'hire.aftongauntlett.com',
          replace,
        },
        history: { replaceState },
        sessionStorage: {
          getItem: (key) => store.get(key) ?? null,
          setItem: (key, value) => {
            store.set(key, value);
          },
        },
      },
      document: dom.window.document,
      applicantName: 'Afton Gauntlett',
    });

    expect(company).toBe('Booz Allen');
    expect(store.get('dear-to')).toBe('Booz Allen');
    expect(replaceState).toHaveBeenCalledWith(null, '', '/for/Booz_Allen');
    expect(replace).not.toHaveBeenCalled();
    expect(dom.window.document.title).toBe('Dear Booz Allen — Afton Gauntlett');
  });

  it('redirects to /404 when no company value is available in production', () => {
    const dom = new JSDOM('<!doctype html><html><head><title>Old</title></head><body></body></html>');
    const replace = vi.fn();

    const company = initializeCompanyTargeting({
      window: {
        location: {
          pathname: '/',
          search: '',
          hostname: 'hire.aftongauntlett.com',
          replace,
        },
        history: { replaceState: vi.fn() },
        sessionStorage: {
          getItem: () => null,
          setItem: vi.fn(),
        },
      },
      document: dom.window.document,
      applicantName: 'Afton Gauntlett',
    });

    expect(company).toBeNull();
    expect(replace).toHaveBeenCalledWith('/404');
  });
});
