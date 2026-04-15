import { describe, expect, it } from 'vitest';
import { DEFAULT_THEME, isThemeName, resolveTheme } from './theme';

describe('theme utilities', () => {
  it('recognizes known theme names', () => {
    expect(isThemeName('sprout')).toBe(true);
    expect(isThemeName('ocean')).toBe(true);
    expect(isThemeName('earth')).toBe(true);
  });

  it('rejects unknown theme names', () => {
    expect(isThemeName('purple')).toBe(false);
    expect(isThemeName('')).toBe(false);
  });

  it('falls back to default theme for invalid values', () => {
    expect(resolveTheme('sprout')).toBe('sprout');
    expect(resolveTheme('invalid')).toBe(DEFAULT_THEME);
    expect(resolveTheme(null)).toBe(DEFAULT_THEME);
  });
});
