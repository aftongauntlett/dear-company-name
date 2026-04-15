import type { APIRoute } from 'astro';
import { isAuthEnabled } from '../../../utils/auth';

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      authEnabled: isAuthEnabled(import.meta.env),
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    },
  );
};
