type HealthServiceState = 'configured' | 'not-configured';

export interface HealthPayload {
  status: 'ok';
  generatedAt: string;
  services: {
    resend: HealthServiceState;
    upstashRedis: HealthServiceState;
    turnstile: HealthServiceState;
    supabase: HealthServiceState;
  };
}

export interface HealthEnv {
  RESEND_API_KEY?: string;
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
  TURNSTILE_SECRET_KEY?: string;
  PUBLIC_SUPABASE_URL?: string;
  PUBLIC_SUPABASE_ANON_KEY?: string;
}

function isConfigured(value: string | undefined): HealthServiceState {
  return value && value.trim().length > 0 ? 'configured' : 'not-configured';
}

export function buildHealthPayload(env: HealthEnv, generatedAt = new Date().toISOString()): HealthPayload {
  const redisConfigured =
    isConfigured(env.UPSTASH_REDIS_REST_URL) === 'configured' &&
    isConfigured(env.UPSTASH_REDIS_REST_TOKEN) === 'configured';
  const supabaseConfigured =
    isConfigured(env.PUBLIC_SUPABASE_URL) === 'configured' &&
    isConfigured(env.PUBLIC_SUPABASE_ANON_KEY) === 'configured';

  return {
    status: 'ok',
    generatedAt,
    services: {
      resend: isConfigured(env.RESEND_API_KEY),
      upstashRedis: redisConfigured ? 'configured' : 'not-configured',
      turnstile: isConfigured(env.TURNSTILE_SECRET_KEY),
      supabase: supabaseConfigured ? 'configured' : 'not-configured',
    },
  };
}
