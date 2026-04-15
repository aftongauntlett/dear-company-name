export const SITE = {
  name: 'Community Web Template',
  shortName: 'Template',
  description: 'A reusable Astro starter for accessible, maintainable, mission-driven websites.',
  nav: [
    { href: '#services', label: 'Services' },
    { href: '#standards', label: 'Standards' },
    { href: '#themes', label: 'Themes' },
    { href: '#kickoff', label: 'Kickoff' },
  ],
  footerLinks: [
    { href: '/#services', label: 'Services' },
    { href: '/#standards', label: 'Standards' },
    { href: '/#themes', label: 'Themes' },
    { href: '/#kickoff', label: 'Kickoff' },
  ],
  contactEmail: 'hello@example.org',
  yearStarted: 2026,
} as const;

export const THEMES = ['sprout', 'ocean', 'earth'] as const;
export type ThemeName = (typeof THEMES)[number];
