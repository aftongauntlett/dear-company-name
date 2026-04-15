# Developer Handoff and Contact Stack Setup

This guide is the standard spin-up and handoff flow for simple static Astro apps using free-tier services:

- Resend for email delivery
- Upstash Redis for rate limiting
- Cloudflare Turnstile for bot checks
- Vercel for hosting and project environment management

Use this doc as both:

1. Your implementation checklist
2. Your client handoff runbook

Service limits and plan terms change over time. Always confirm current free-tier limits in each dashboard.

For inactivity prevention and scheduled heartbeats on free tiers, see `docs/FREE_TIER_OPS_KEEPALIVE.md`.
Template baseline heartbeat endpoint: `src/pages/api/health.json.ts`.
Template baseline scheduler workflow: `.github/workflows/heartbeat.yml` with `HEARTBEAT_URL` secret.

## Recommended Spin-Up Order

1. Set up Vercel project and production domain routing first.
2. Configure Resend sending domain and API key.
3. Configure Upstash Redis for rate limiting.
4. Configure Cloudflare Turnstile keys.
5. Add environment variables and run deployment checks.

## Architecture

1. User submits a contact form.
2. Turnstile token is verified server-side.
3. Request is rate-limited via Upstash Redis.
4. If checks pass, server route sends email through Resend.

## Ownership Strategy (Read First)

Best practice is client-owned accounts from day one.

1. Client creates accounts (or organization/team spaces).
2. Client invites you with admin/developer access.
3. You configure and deploy.
4. You remove your own elevated access at handoff.

If you must bootstrap in your own accounts, see the handoff section later in this doc.

## Prerequisites

- Domain name ready for production
- Vercel account/team
- Resend account
- Cloudflare account (required for Turnstile, separate from Vercel)
- Upstash Redis account (usually via Vercel integration)

## Step 1: Set Up Vercel Project and Domain

1. In Vercel, create a new project from your repository.
2. Confirm framework preset is Astro.
3. Set production branch (usually `main`).
4. Deploy once to verify base project is healthy.
5. Add your production domain in Vercel project settings.
6. Point DNS records from your DNS host to Vercel and verify domain status.

Notes:

- You can manage project env vars directly in Vercel dashboard.
- If domain DNS is not managed in Vercel, keep DNS at registrar or Cloudflare and point records to Vercel.

## Step 2: Configure Resend

1. In Resend dashboard, create/choose a workspace.
2. Add and verify a sending domain (recommended: subdomain like `mail.example.org`).
3. Add all DNS records Resend provides at your DNS provider.
4. Wait until domain status is verified in Resend.
5. Create an API key scoped for this project.

Recommended sender setup:

- `CONTACT_FROM_EMAIL` should use the verified sending domain.
- Example: `hello@mail.example.org`

## Step 3: Configure Upstash Redis (Rate Limiting)

Recommended path: Vercel Marketplace integration.

1. In Vercel project, open `Storage`.
2. Create/connect Upstash Redis database.
3. Select nearest region to your users.
4. Confirm Vercel injects Redis env vars into the project.

Expected env vars:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

If vars are not auto-injected, copy values from Upstash dashboard into Vercel env vars manually.

## Step 4: Configure Cloudflare Turnstile

Turnstile cannot be created from Vercel. You need a Cloudflare account.

1. In Cloudflare dashboard, open `Turnstile`.
2. Create a new widget/site for your domain.
3. Add production domain and local dev hostnames (`localhost` as needed).
4. Copy the site key (public).
5. Copy the secret key (server-only).

Expected env vars:

- `PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

## Step 5: Configure Environment Variables

Set these in Vercel Project Settings -> Environment Variables.

Required:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`
- `PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

Optional (recommended for production):

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Local development:

1. Copy `.env.example` to `.env` locally.
2. Use real keys where possible.
3. You can use Cloudflare Turnstile test keys for local testing.

## Env Var Reference

| Variable | Scope | Description |
| --- | --- | --- |
| `RESEND_API_KEY` | Server | API key from Resend dashboard |
| `CONTACT_FROM_EMAIL` | Server | Sender email on verified Resend domain |
| `CONTACT_TO_EMAIL` | Server | Recipient inbox for contact submissions |
| `UPSTASH_REDIS_REST_URL` | Server | Upstash REST endpoint for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Server | Upstash REST auth token |
| `PUBLIC_TURNSTILE_SITE_KEY` | Public | Client-side Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Server | Server-side Turnstile secret for token verification |

## Production DNS Notes

Common split setup:

- Hosting on Vercel
- DNS at Cloudflare or registrar
- Email sending domain verified in Resend

Checklist:

1. Vercel project domain is added and verified.
2. DNS A/CNAME records point traffic to Vercel.
3. Resend DNS records are added for email domain/subdomain.
4. Turnstile widget allowed domains match production and preview domains.

## Anti-Abuse Baseline (Required)

1. Verify Turnstile token on server for each form submit.
2. Rate-limit by client IP + route key using Upstash.
3. Return generic errors (do not leak whether Turnstile or rate-limit failed).
4. Add a short timeout and basic server-side input validation.
5. Keep all secrets server-side only.

## Deployment Checklist

1. `npm run validate`
2. Confirm all env vars exist in Vercel for the target environment.
3. Trigger deploy.
4. Test contact form on live URL.
5. Confirm Turnstile challenge works.
6. Confirm rate limiting triggers after repeated rapid submissions.
7. Confirm emails arrive at `CONTACT_TO_EMAIL`.

## Client Handoff Runbook

### Preferred: Client-Owned from Start

1. Client creates Vercel team and project ownership.
2. Client creates Resend workspace.
3. Client creates Cloudflare account and Turnstile widget.
4. Client creates Upstash database (or via Vercel Storage in client team).
5. Client invites you temporarily.
6. At handoff, remove your access.

### If You Bootstrapped in Your Own Accounts

1. Transfer Vercel project to client-owned team.
2. Rotate Resend API key after transfer.
3. Rotate Turnstile secret key after transfer.
4. Rotate Upstash token after transfer.
5. Reconfirm env vars in client-owned Vercel project.
6. Ensure billing/contact email in each service is client-owned.
7. Remove your elevated roles.

Important:

- Turnstile is tied to Cloudflare account ownership. If created under your account, best handoff is often to recreate widget under client account and rotate keys.
- If Upstash transfer is not available in your account context, create a new DB in client-owned context and rotate env vars.

## Handoff Package Template

Provide this to client at project close:

1. Service inventory: Vercel project name and team.
2. Service inventory: Resend workspace and verified sending domain.
3. Service inventory: Cloudflare Turnstile site/widget name.
4. Service inventory: Upstash database name and region.
5. Domain/DNS records currently in use.
6. Environment variable key names (never send secret values in plain email).
7. Access matrix (who currently has admin access).
8. Post-handoff action: rotate secrets.
9. Post-handoff action: remove contractor access.
10. Post-handoff action: confirm recovery email and MFA on all services.

## Troubleshooting

Resend domain not verified:

1. Re-check DNS records exactly as shown in Resend.
2. Confirm records were added to the authoritative DNS provider.
3. Wait for propagation and refresh status in Resend dashboard.

Turnstile failing in production:

1. Confirm allowed domains include exact hostnames in use.
2. Confirm `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are matching pair.
3. Confirm secret verification happens server-side.

Rate limiting not working:

1. Confirm Redis env vars exist in production env.
2. Confirm Redis REST URL/token pair are from same database.
3. Confirm key strategy uses stable client identifier and route scope.

---

Keep this document updated whenever env var names, provider choices, or contact route behavior changes.
