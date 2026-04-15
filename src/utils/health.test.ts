import { describe, expect, it } from 'vitest';
import { buildHealthPayload } from './health';

describe('health payload', () => {
  it('reports configured services when required env vars are present', () => {
    const payload = buildHealthPayload(
      {
        RESEND_API_KEY: 'resend-key',
        UPSTASH_REDIS_REST_URL: 'https://redis.example',
        UPSTASH_REDIS_REST_TOKEN: 'token',
        TURNSTILE_SECRET_KEY: 'secret',
        PUBLIC_SUPABASE_URL: 'https://supabase.example',
        PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
      },
      '2026-01-01T00:00:00.000Z',
    );

    expect(payload.status).toBe('ok');
    expect(payload.generatedAt).toBe('2026-01-01T00:00:00.000Z');
    expect(payload.services).toEqual({
      resend: 'configured',
      upstashRedis: 'configured',
      turnstile: 'configured',
      supabase: 'configured',
    });
  });

  it('reports not-configured when env vars are missing', () => {
    const payload = buildHealthPayload({});

    expect(payload.services).toEqual({
      resend: 'not-configured',
      upstashRedis: 'not-configured',
      turnstile: 'not-configured',
      supabase: 'not-configured',
    });
  });
});
