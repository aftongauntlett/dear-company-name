# Auth and Supabase Playbook

Use this when a project needs login, user accounts, protected dashboards, or user-specific data.

This template is static-first. Add auth only when there is a real requirement for identity.

## When to Add Auth

- Client needs a member area, admin panel, or per-user content.
- Client needs secure CRUD with user ownership.
- Client needs social login or magic link sign-in.

## Recommended Default for Small Projects

- Provider: Supabase Auth
- Database: Supabase Postgres
- Rules: Row Level Security (RLS) on every non-public table
- Session model: cookie-based session, validated server-side for protected operations

Template starter files:

- `src/utils/auth.ts` (env checks + safe redirect helper)
- `src/pages/api/auth/status.json.ts` (auth config status endpoint)

## Decision Guide

1. Marketing-only site with contact form: no auth.
2. Client-only docs/resources: auth with email magic links.
3. Community/member portal: auth with profile tables and RLS.
4. Team workflows/admin roles: add role-based access controls and audit fields.

## Setup Checklist

1. Create a Supabase project in a client-owned account.
2. Enable only needed auth providers.
3. Configure Auth URL settings for production and preview URLs.
4. Create schema and tables with RLS enabled.
5. Add explicit policies for every table.
6. Add environment variables.
7. Add login/logout/account routes and protected route checks.
8. Add tests for auth guards and permission checks.

## Environment Variables

Use these names consistently in Astro projects.

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; avoid unless truly needed)

Never expose `SUPABASE_SERVICE_ROLE_KEY` to client code.

## Data and Policy Baseline

1. Enable RLS on all non-public tables.
2. Deny by default, then add explicit allow policies.
3. Store ownership columns (`user_id`) and enforce ownership in policies.
4. Add `created_at` and `updated_at` timestamps for auditability.
5. Avoid storing secrets or sensitive data in browser-readable tables.

## Astro Integration Notes

- Keep public pages static.
- Add server endpoints only for protected operations.
- Do not trust client role checks for authorization.
- Validate session and permissions server-side before data mutations.

## Handoff Checklist

1. Client owns Supabase project and billing.
2. MFA enabled for owner/admin accounts.
3. Auth providers documented (enabled, disabled, callback URLs).
4. Environment variable key names documented.
5. RLS policies exported and reviewed.
6. Contractor access removed or downgraded at handoff.

## Common Pitfalls

- Building UI role checks without server authorization checks.
- Leaving tables with RLS disabled.
- Reusing service role key in front-end code.
- Forgetting to add preview URL callbacks for staging deployments.
