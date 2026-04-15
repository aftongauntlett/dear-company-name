import { THEMES, type ThemeName } from '../config/site';

export const DEFAULT_THEME: ThemeName = 'sprout';

export function isThemeName(value: string): value is ThemeName {
  return THEMES.includes(value as ThemeName);
}

export function resolveTheme(value: string | null | undefined): ThemeName {
  if (!value) {
    return DEFAULT_THEME;
  }

  return isThemeName(value) ? value : DEFAULT_THEME;
}
