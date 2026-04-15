import type { APIRoute } from 'astro';
import { buildHealthPayload } from '../../utils/health';

export const GET: APIRoute = () => {
  const payload = buildHealthPayload(import.meta.env);

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
};
