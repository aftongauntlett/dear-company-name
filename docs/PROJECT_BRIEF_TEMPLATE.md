# Project Brief Template (Agent Input)

Copy this file into your new client repo as `PROJECT_BRIEF.md` and fill it in before prompting an agent.

The more complete this is, the fewer clarification loops you will get.

## 1) Client Snapshot (Required)

- Company/organization name:
- Primary contact:
- Industry or domain:
- One-sentence mission:
- Primary audience:

## 2) Success Criteria (Required)

- Top 3 outcomes this website must achieve:
1.
2.
3.
- Launch deadline:
- Must-have on day one:
- Can wait until phase two:

## 3) Site Type and Scope (Required)

- Project mode: `content-first` | `mixed` | `app-first`
- Expected route count:
- Planned pages/routes list:
1.
2.
3.

## 4) Content Inputs (Required)

- Brand voice notes:
- Existing copy/docs links:
- Required sections per page:
- Required CTAs:
- Assets available now (logo, photos, icons):
- Assets still missing:

## 5) Visual Direction (Required)

- Visual adjectives (3-6 words):
- Sites you like (with links):
- Sites you dislike (with links):
- Color or typography constraints:
- Accessibility constraints beyond baseline:

## 6) Feature Checklist (Required)

Mark each as `none`, `basic`, or `advanced`.

- Auth/login:
- Ecommerce/cart/checkout:
- Scheduling/calendars:
- Contact forms/email:
- CMS/content editing:
- Search/filtering:
- Analytics/reporting:

## 7) Data and Integrations (If Applicable)

- Primary data source (CMS/DB/API):
- Third-party services required:
1.
2.
3.
- Webhooks needed:
- External API limits/constraints:

## 8) Operations and Ownership (Required)

- Hosting target:
- Domain and DNS owner:
- Service account ownership (client-owned preferred):
- Free-tier constraints to account for:
- Keepalive needed for DB/Redis/service suspension: `yes` | `no`
- Backup and recovery expectations:

## 9) Compliance and Risk (If Applicable)

- Legal pages required:
- Privacy/security requirements:
- Regional constraints (GDPR/CCPA/etc.):
- Data retention requirements:

## 10) Agent Execution Settings (Required)

- Preferred build strategy: `fast draft` | `balanced` | `high rigor`
- How many rounds expected:
- Should agent prioritize speed or polish first:
- Allowed to add dependencies: `yes` | `no` (or list allowed deps)
- Anything the agent must avoid:

## 11) Definition of Done (Required)

- What must be true at handoff:
1.
2.
3.
- Required docs to update:
- Required checks to pass (`npm run validate`, `npm run precommit:check`):

## 12) Prompt Block for Agent (Optional, Recommended)

Paste this after filling the template:

"Use PROJECT_BRIEF.md as source of truth. Build the first production-ready draft for this client. Follow README.md, docs/STANDARDS.md, docs/WCAG_2.2_CHECKLIST.md, and relevant feature playbooks. Reuse existing components and keep styles tokenized. Run npm run validate and npm run precommit:check. Summarize what was implemented, changed files, validation results, and any remaining decisions."
