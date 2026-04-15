import { describe, expect, it } from 'vitest';
import { getSupabasePublicConfig, isAuthEnabled, sanitizePostAuthRedirect } from './auth';

describe('auth utilities', () => {
  it('returns null when supabase public env is incomplete', () => {
    expect(getSupabasePublicConfig({})).toBeNull();
    expect(getSupabasePublicConfig({ PUBLIC_SUPABASE_URL: 'https://example.supabase.co' })).toBeNull();
  });

  it('returns config when supabase public env is complete', () => {
    const result = getSupabasePublicConfig({
      PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      PUBLIC_SUPABASE_ANON_KEY: 'anon',
    });

    expect(result).toEqual({
      url: 'https://example.supabase.co',
      anonKey: 'anon',
    });
    expect(isAuthEnabled({
      PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      PUBLIC_SUPABASE_ANON_KEY: 'anon',
    })).toBe(true);
  });

  it('keeps post-auth redirects internal-only', () => {
    expect(sanitizePostAuthRedirect('/dashboard')).toBe('/dashboard');
    expect(sanitizePostAuthRedirect('https://evil.example')).toBe('/');
    expect(sanitizePostAuthRedirect('//evil.example')).toBe('/');
    expect(sanitizePostAuthRedirect(undefined, '/account')).toBe('/account');
  });
});
