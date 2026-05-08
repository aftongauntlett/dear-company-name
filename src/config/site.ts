export const APPLICANT = {
  name: 'Afton Gauntlett',
  title: 'Senior Frontend Developer',
  email: 'hello@aftongauntlett.com',
  phone: '(571) 249-1952' as string,
  website: 'https://www.aftongauntlett.com/',
  github: 'https://github.com/aftongauntlett',
  linkedin: 'https://www.linkedin.com/in/afton-gauntlett/',
  resume: 'https://aftongauntlett.github.io/resume/',
} as const;

export const SITE_URL = 'https://hire.aftongauntlett.com' as const;

export const COMPANY = {
  // Build-time placeholder — never shown. Visits without ?to= redirect to /404.
  // The actual company name is set at runtime via ?to=CompanyName in the URL.
  targetName: 'your team',
} as const;

export const THEMES = ['sprout', 'ocean', 'earth', 'dark'] as const;
export type ThemeName = (typeof THEMES)[number];
