export const APPLICANT = {
  name: 'Afton Gauntlett',
  title: 'Senior Frontend Developer',
  email: 'hello@aftongauntlett.com',
  website: 'https://www.aftongauntlett.com/',
  github: 'https://github.com/aftongauntlett',
  linkedin: 'https://www.linkedin.com/in/afton-gauntlett/',
  resume: 'https://aftongauntlett.github.io/resume/',
} as const;

export const COMPANY = {
  // ← Change this one value to target a new company
  targetName: 'Prentus',
} as const;

export const THEMES = ['sprout', 'ocean', 'earth', 'dark'] as const;
export type ThemeName = (typeof THEMES)[number];
