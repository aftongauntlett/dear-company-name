# Free-Tier Operations and Keepalive Playbook

Use this when project services pause or expire after inactivity on free plans.

Always verify current provider terms before enabling automated keepalive traffic.

## Goal

- Keep critical services responsive for low-traffic sites.
- Avoid surprise deactivation after inactivity windows.
- Stay within provider terms and free-tier limits.

## Services Commonly Affected

- Free Postgres providers with inactivity suspension
- Redis free tiers with inactivity limits
- Serverless functions with cold-start behavior

## Recommended Strategy

1. Add a lightweight health endpoint in the deployed app.
2. Schedule one daily heartbeat from a reliable scheduler.
3. Log heartbeat success/failure.
4. Alert on repeated failures.

Template default endpoint:

- `GET /api/health.json`

## Scheduler Options

1. GitHub Actions scheduled workflow
2. Vercel Cron (if the project already uses Vercel cron)
3. Upstash QStash or another managed scheduler

## Example: GitHub Actions Heartbeat

Template includes a starter workflow at `.github/workflows/heartbeat.yml`.
It runs daily and requests a health URL if `HEARTBEAT_URL` secret is set.

If you want to customize it, use this baseline:

```yaml
name: Daily Heartbeat

on:
  schedule:
    - cron: '17 9 * * *'
  workflow_dispatch:

jobs:
  heartbeat:
    runs-on: ubuntu-latest
    steps:
      - name: Ping health endpoint
        run: |
          curl --fail --show-error --silent "${{ secrets.HEARTBEAT_URL }}" > /dev/null
```

Use a secret named `HEARTBEAT_URL`, for example `https://your-site.org/api/health.json`.

## Health Endpoint Guidance

1. Keep response fast and simple (`200 OK`).
2. Optionally include minimal checks for DB/Redis reachability.
3. Do not expose secrets or internal topology in response body.
4. Apply lightweight rate limiting if endpoint is public.

## Verify Endpoint

1. Run `npm run dev`.
2. Request `http://localhost:4321/api/health.json`.
3. Confirm response is `200` with JSON payload.

## Operational Guardrails

1. One request per day is usually enough.
2. Keep heartbeat behavior documented in handoff docs.
3. If provider forbids synthetic keepalive, disable it.
4. Prefer upgrading plan over brittle workarounds for production-critical sites.

## Handoff Checklist

1. Scheduler owner account is client-owned.
2. Heartbeat URL and schedule are documented.
3. Secrets are stored in client-owned environment.
4. Alert destination is a client-owned inbox/channel.
5. Contractor access removed at project close.
