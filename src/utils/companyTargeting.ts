const COMPANY_STORAGE_KEY = 'dear-to';
const COMPANY_PATH_PREFIX = '/for/';

const TITLE_META_SELECTORS = [
  'meta[property="og:title"]',
  'meta[name="twitter:title"]',
  'meta[name="title"]',
] as const;

interface CompanyWindowLike {
  location: {
    pathname: string;
    search: string;
    hostname: string;
    replace: (url: string) => void;
  };
  history: {
    replaceState: (data: unknown, unused: string, url?: string | URL | null) => void;
  };
  sessionStorage: {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
  };
}

interface ResolveCompanyNameInput {
  pathname: string;
  search: string;
  storedCompany: string | null;
  hostname: string;
}

interface ApplyCompanyToDomInput {
  document: Document;
  companyName: string;
  applicantName: string;
}

interface InitializeCompanyTargetingInput {
  window: CompanyWindowLike;
  document: Document;
  applicantName: string;
}

function normalizeCompanyName(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function toCompanyPathSegment(companyName: string): string {
  const normalized = normalizeCompanyName(companyName);
  const withUnderscores = normalized.replace(/ /g, '_');

  return encodeURIComponent(withUnderscores)
    .replace(/%2B/gi, '+')
    .replace(/%2D/gi, '-')
    .replace(/%5F/gi, '_')
    .replace(/%2E/gi, '.');
}

export function fromCompanyPathSegment(pathSegment: string): string | null {
  if (!pathSegment) {
    return null;
  }

  try {
    const decoded = decodeURIComponent(pathSegment);
    const normalized = normalizeCompanyName(decoded.replace(/_/g, ' '));
    return normalized.length > 0 ? normalized : null;
  } catch {
    return null;
  }
}

export function getCompanyFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/for\/(.+)$/);
  if (!match) {
    return null;
  }

  return fromCompanyPathSegment(match[1]);
}

function getCompanyFromQuery(search: string): string | null {
  const params = new URLSearchParams(search);
  const rawCompany = params.get('to');

  if (!rawCompany) {
    return null;
  }

  const normalized = normalizeCompanyName(rawCompany);
  return normalized.length > 0 ? normalized : null;
}

export function resolveCompanyName(input: ResolveCompanyNameInput): string | null {
  const fromQuery = getCompanyFromQuery(input.search);
  if (fromQuery) {
    return fromQuery;
  }

  const fromPath = getCompanyFromPath(input.pathname);
  if (fromPath) {
    return fromPath;
  }

  if (input.storedCompany) {
    const fromStorage = normalizeCompanyName(input.storedCompany);
    if (fromStorage.length > 0) {
      return fromStorage;
    }
  }

  if (input.hostname === 'localhost' || input.hostname === '127.0.0.1') {
    return 'Local Dev';
  }

  return null;
}

function buildCompanyPageTitle(companyName: string, applicantName: string): string {
  return `Dear ${companyName} — ${applicantName}`;
}

export function applyCompanyToDom(input: ApplyCompanyToDomInput): void {
  const { document, companyName, applicantName } = input;

  const headline = document.querySelector('.hero-headline');
  if (headline) {
    headline.textContent = `Dear ${companyName},`;
  }

  const typewriter = document.querySelector('[data-target]');
  if (typewriter) {
    typewriter.setAttribute('data-target', companyName);
  }

  const titleText = buildCompanyPageTitle(companyName, applicantName);
  document.title = titleText;

  TITLE_META_SELECTORS.forEach((selector) => {
    const tag = document.querySelector(selector);
    if (tag) {
      tag.setAttribute('content', titleText);
    }
  });
}

export function initializeCompanyTargeting(input: InitializeCompanyTargetingInput): string | null {
  const { window, document, applicantName } = input;

  const companyName = resolveCompanyName({
    pathname: window.location.pathname,
    search: window.location.search,
    storedCompany: window.sessionStorage.getItem(COMPANY_STORAGE_KEY),
    hostname: window.location.hostname,
  });

  if (!companyName) {
    window.location.replace('/404');
    return null;
  }

  window.sessionStorage.setItem(COMPANY_STORAGE_KEY, companyName);

  const canonicalPath = `${COMPANY_PATH_PREFIX}${toCompanyPathSegment(companyName)}`;
  if (window.location.pathname !== canonicalPath || window.location.search.length > 0) {
    window.history.replaceState(null, '', canonicalPath);
  }

  applyCompanyToDom({ document, companyName, applicantName });
  return companyName;
}