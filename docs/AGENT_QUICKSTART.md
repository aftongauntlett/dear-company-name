# Agent Quickstart

If you are an AI coding agent working in this repository, read these files in order:

1. PROJECT_BRIEF.md (if present)
2. docs/PROJECT_BRIEF_TEMPLATE.md
3. docs/DYNAMIC_SCOPE_DECISION_GUIDE.md
4. README.md
5. docs/STANDARDS.md
6. docs/WCAG_2.2_CHECKLIST.md
7. docs/DEVELOPER_HANDOFF.md
8. .env.example

When applicable to project scope, also read:


## Project Intent

1. Confirm the mission, audience, and core pages from PROJECT_BRIEF.md when available.

Default build style:

- Static-first Astro sites
- Token-based CSS themes
- Reusable components
- Accessibility-first UI

Optional advanced integrations:

- Resend email delivery
- Cloudflare Turnstile
- Upstash Redis rate limiting
- Server/API routes for auth or data workflows

Template starter artifacts already included:

- Health endpoint: `src/pages/api/health.json.ts`
- Auth skeleton endpoint: `src/pages/api/auth/status.json.ts`
- Health utility: `src/utils/health.ts`
- Auth utility: `src/utils/auth.ts`
- Daily heartbeat workflow: `.github/workflows/heartbeat.yml` (uses `HEARTBEAT_URL` secret)

## Required Workflow for Agents

1. Confirm the mission, audience, and core pages.
2. Reuse existing components before creating new ones.
3. For form selects, use `src/components/ui/StyledDropdown.astro` instead of ad-hoc/native-styled dropdown implementations.
4. For actions and surfaces, use `src/components/ui/Button.astro` and `src/components/ui/Card.astro` before creating one-off variants.
5. If icons are needed and no icon primitive exists, create a reusable icon component first, then use it everywhere.
6. Keep styles tokenized and theme-aware.
7. Maintain semantic HTML and keyboard accessibility.
8. Add tests for new logic.
9. Run full validation before finishing:
   - npm run validate
10. Ensure commit-time checks pass:
   - npm run precommit:check

## Default Deliverables

- Updated page content and components
- Updated docs for setup or architecture changes
- Passing checks (typecheck, lint, tests, build)
