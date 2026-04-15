export interface SupabasePublicConfig {
  url: string;
  anonKey: string;
}

export interface AuthEnv {
  PUBLIC_SUPABASE_URL?: string;
  PUBLIC_SUPABASE_ANON_KEY?: string;
}

function hasValue(value: string | undefined): value is string {
  return Boolean(value && value.trim().length > 0);
}

export function getSupabasePublicConfig(env: AuthEnv): SupabasePublicConfig | null {
  if (!hasValue(env.PUBLIC_SUPABASE_URL) || !hasValue(env.PUBLIC_SUPABASE_ANON_KEY)) {
    return null;
  }

  return {
    url: env.PUBLIC_SUPABASE_URL,
    anonKey: env.PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function isAuthEnabled(env: AuthEnv): boolean {
  return getSupabasePublicConfig(env) !== null;
}

export function sanitizePostAuthRedirect(input: string | null | undefined, fallback = '/'): string {
  if (!input) {
    return fallback;
  }

  // Only allow internal absolute paths to avoid open redirect issues.
  if (input.startsWith('/') && !input.startsWith('//')) {
    return input;
  }

  return fallback;
}
