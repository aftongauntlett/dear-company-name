# PRD-10: Cats or Dogs? — Interactive Poll with Supabase Backend

**Phase:** 3

Status: Not Started

---

## Goal

Add a small, fun "Cats or Dogs?" poll to the homepage. It has three purposes: it's a personality beat for visitors who read the page; it demonstrates real full-stack thinking (schema design, RLS, fingerprinting, edge functions) in a project that's otherwise purely static; and it produces code interesting enough to feature in the Code Explorer.

---

## Scope

- New Supabase schema: `votes` table, aggregate function, RLS policies
- New Vercel Edge Function: `api/vote.ts` (POST) — handles deduplication and returns updated counts
- New Vercel Edge Function: `api/votes.ts` (GET) — returns current summary for returning visitors
- New section component: `src/components/sections/PollCatsOrDogs.astro`
- New GitHub Actions workflow: `.github/workflows/supabase-keepalive.yml`
- Update `src/pages/index.astro`: import and insert `<PollCatsOrDogs />` between `<About />` and `<TeamLevels />`
- Update `src/config/codeViews.ts`: add poll files to whitelist and highlighted files
- Update `.env.example`: add `SUPABASE_URL` and `SUPABASE_ANON_KEY` (values blank)
- Install `@supabase/supabase-js` as a dependency

## Out of Scope

- No user accounts or auth
- No vote history or per-user breakdown
- No admin dashboard
- No social sharing
- No rate limiting beyond the `voter_hash` unique constraint
- No real-time subscriptions (a one-time fetch after voting is sufficient)
- No Vercel cron (GitHub Actions covers the keep-alive requirement with no added Vercel config)

---

## Data Architecture

### Schema

One table, one aggregate function. No views exposed to `anon` directly — the function is the only read surface.

```sql
-- supabase/migrations/001_create_votes.sql

create table public.votes (
  id          uuid        primary key default gen_random_uuid(),
  choice      text        not null check (choice in ('cats', 'dogs')),
  voter_hash  text        not null unique,
  created_at  timestamptz not null default now()
);

-- Aggregate function: the only thing anon can read.
-- SECURITY DEFINER means it runs as postgres (owner), not as the calling role.
-- This lets anon get totals without ever having SELECT on the raw table.
create function public.get_vote_summary()
  returns table (cats bigint, dogs bigint, total bigint)
  language sql
  security definer
as $$
  select
    count(*) filter (where choice = 'cats') as cats,
    count(*) filter (where choice = 'dogs') as dogs,
    count(*)                                as total
  from public.votes;
$$;

grant execute on function public.get_vote_summary() to anon;
```

`voter_hash` is an HMAC-SHA256 of the requester's IP address and User-Agent string, keyed with a secret salt (`VOTE_SALT`). No raw IP is ever stored. The hash cannot be reversed. Collisions are theoretically possible (two different people on the same IP with the same UA) but practically negligible at personal-microsite scale.

### RLS Policies

```sql
alter table public.votes enable row level security;

-- anon may insert. The unique constraint on voter_hash is the dedup guard.
create policy "anon can insert votes"
  on public.votes
  for insert
  to anon
  with check (true);

-- No SELECT policy for anon on the raw table.
-- All reads go through get_vote_summary() instead.
```

This means:
- Calling `supabase.from('votes').select()` with the anon key returns 0 rows — the table is opaque to the public.
- The only way anon reads data is via `supabase.rpc('get_vote_summary')`.
- The service role key (used server-side in the edge function) bypasses RLS and can do everything — it is never exposed to the client.

---

## Duplicate Vote Prevention

**Approach: localStorage flag (UX layer) + server-side HMAC fingerprint (data layer)**

| Layer | Mechanism | Prevents | Circumvented by |
|---|---|---|---|
| UX | `localStorage.setItem('dcn_poll_voted', choice)` | Repeat interactions for normal returning visitors | Clearing localStorage / private browsing |
| Data | `voter_hash UNIQUE` constraint on server-computed hash | Database-level duplicate rows | VPN change + UA spoof (deliberate effort only) |

**Why this combination:**
- Pure localStorage means anyone can stuff the database by calling `POST /api/vote` directly, bypassing the UI entirely. The database would have no protection.
- Pure IP-based deduplication has UX problems: shared NAT (an office building's entire floor sharing one IP), VPNs, and mobile carrier NAT all cause false positives — real people blocked from voting.
- Together: localStorage gives instant, zero-flicker feedback for the 99% of visitors who aren't trying to game a poll on a job application site; the database constraint provides actual data integrity.

**Tradeoff accepted:** A determined person can vote twice with a VPN + private window. This is an informal fun poll, not a referendum. The point is the architecture, not the tamper-proofing.

**localStorage key:** `dcn_poll_voted` (namespaced to avoid collisions with other sites in development).

---

## API Routes

Two Vercel Edge Functions in `api/`:

| Route | Method | Description |
|---|---|---|
| `/api/vote` | POST | Submit a vote; returns updated summary or conflict |
| `/api/votes` | GET | Returns current summary without submitting a vote |

### `api/vote.ts` — POST handler

```ts
import { createClient } from '@supabase/supabase-js';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  const { choice } = await req.json();

  if (choice !== 'cats' && choice !== 'dogs') {
    return new Response(JSON.stringify({ error: 'invalid_choice' }), { status: 400 });
  }

  // Compute voter fingerprint server-side — never touches the client
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const ua = req.headers.get('user-agent') ?? '';
  const salt = process.env.VOTE_SALT!;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(salt),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(ip + ua));
  const voterHash = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY! // service key: bypasses RLS, server-side only
  );

  const { error } = await supabase
    .from('votes')
    .insert({ choice, voter_hash: voterHash });

  // Postgres error code 23505 = unique_violation (voter_hash already exists)
  if (error?.code === '23505') {
    return new Response(JSON.stringify({ error: 'already_voted' }), { status: 409 });
  }
  if (error) {
    return new Response(JSON.stringify({ error: 'db_error' }), { status: 500 });
  }

  const { data } = await supabase.rpc('get_vote_summary');
  return new Response(JSON.stringify(data?.[0] ?? { cats: 0, dogs: 0, total: 0 }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

The edge runtime is intentional: `crypto.subtle` (Web Crypto API) is native there, no polyfill needed. Node.js runtime also works but edge is faster and cleaner for this use case.

### `api/votes.ts` — GET handler

```ts
import { createClient } from '@supabase/supabase-js';

export const config = { runtime: 'edge' };

export default async function handler(): Promise<Response> {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY! // anon key is sufficient for the summary function
  );

  const { data, error } = await supabase.rpc('get_vote_summary');

  if (error) {
    return new Response(JSON.stringify({ error: 'db_error' }), { status: 500 });
  }

  return new Response(JSON.stringify(data?.[0] ?? { cats: 0, dogs: 0, total: 0 }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

---

## UI Placement

**New section: `#poll` — inserted between `<About />` and `<TeamLevels />`**

Positioned early so most visitors see it before they're in "read mode." It reads as a personality beat — light and fast — not a product feature. The section is intentionally minimal: one question, two buttons, one result bar.

---

## Section Spec — `src/components/sections/PollCatsOrDogs.astro`

### States

1. **Unvoted** (default, no `dcn_poll_voted` in localStorage): Question headline + two vote buttons. No results visible.
2. **Voted** (post-click or returning visitor with localStorage set): Confirmation line ("You voted for cats.") + animated split-bar results.
3. **Error** (network or DB failure): Inline error message — "Couldn't record your vote. Try again?" — with retry. No broken layout.

### Layout

- Single-column, centered
- `fade-up` entrance animation (same class used by all other sections)
- `padding-block: var(--space-16)` consistent with adjacent sections
- `id="poll"`
- Visually-hidden `<h2 class="sr-only">Cats or Dogs?</h2>` for screen reader landmark navigation — the visible question is a `<p>` styled large, since it's phrasing, not a document heading

### Vote Buttons

Use existing `Button.astro` component. Both buttons are disabled while the request is in-flight and remain disabled after voting. No spinner needed — disabling the buttons and transitioning to the result bar is sufficient feedback.

### Results Visualization — Split Bar

A single horizontal bar divided into two colored segments, CSS-only.

```html
<div class="poll-bar" role="img" aria-label="Poll results: Cats 62%, Dogs 38%">
  <div class="poll-bar__cats" style="width: 62%"></div>
  <div class="poll-bar__dogs" style="width: 38%"></div>
</div>
```

- Cats segment: left-aligned, accent color (e.g. `var(--tone-primary)`)
- Dogs segment: right-aligned, muted secondary color
- `transition: width 600ms ease` on both segments so the bar fills in on reveal
- Labels above each side: "🐱 Cats — 62%" and "🐶 Dogs — 38%"
- Zero-votes edge case: show 50/50 split with a "Be the first to vote!" note

### Accessibility

- `role="img"` + `aria-label` on the results bar (a bar chart with no interactive elements is an image semantically)
- `aria-live="polite"` region wrapping the results area — state change announced to screen readers when results appear
- Vote buttons have visible focus styles (inherited from `Button.astro`)
- Both buttons have descriptive `aria-label` values if icon-only: not needed here since they're labelled text

### Client Script

Inline `<script>` tag in the component (no framework, consistent with the rest of the site):

```js
(function () {
  const STORAGE_KEY = 'dcn_poll_voted';
  const existing = localStorage.getItem(STORAGE_KEY);

  if (existing) {
    // Returning voter: load current results without submitting
    fetch('/api/votes')
      .then(r => r.json())
      .then(data => showResults(existing, data))
      .catch(() => {/* degrade silently — just don't show results */});
    return;
  }

  document.querySelectorAll('[data-vote]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const choice = btn.dataset.vote;
      setButtonsDisabled(true);

      try {
        const res = await fetch('/api/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ choice }),
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem(STORAGE_KEY, choice);
          showResults(choice, data);
        } else if (res.status === 409) {
          // Server says already voted (localStorage was cleared) — load current results
          const data = await fetch('/api/votes').then(r => r.json());
          showResults(choice, data);
        } else {
          showError();
          setButtonsDisabled(false);
        }
      } catch {
        showError();
        setButtonsDisabled(false);
      }
    });
  });

  function setButtonsDisabled(disabled) {
    document.querySelectorAll('[data-vote]').forEach(b => (b.disabled = disabled));
  }

  function showResults(voted, data) {
    const total = data.total || 0;
    const catsPercent = total > 0 ? Math.round((data.cats / total) * 100) : 50;
    const dogsPercent = 100 - catsPercent;
    // Update DOM: hide buttons, show confirmation + bar
  }

  function showError() {
    // Show inline error with retry button
  }
})();
```

---

## Supabase Free Tier Keep-Alive

The Supabase free plan pauses projects after 7 consecutive days of inactivity. A paused project returns errors on all API calls — the poll breaks silently for visitors, and the database must be manually unpaused via the Supabase dashboard.

**Recommendation: GitHub Actions scheduled workflow**

A cron job that fires every 5 days makes a lightweight `POST` to `get_vote_summary()`. This keeps the project active within the 7-day window with a 2-day buffer.

**Why GitHub Actions over Vercel cron:**
- GitHub Actions is free for public repos — no Vercel Pro plan required
- Visible in the repo (shows up in the Actions tab — good for the "demonstrating full-stack thinking" goal)
- No additional Vercel config or billing concern
- `workflow_dispatch` allows manual trigger for testing

**File:** `.github/workflows/supabase-keepalive.yml`

```yaml
name: Supabase Keep-Alive

on:
  schedule:
    - cron: '0 9 */5 * *'   # Every 5 days at 09:00 UTC
  workflow_dispatch:          # Manual trigger for testing

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase vote summary
        run: |
          curl -sf \
            -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json" \
            -X POST \
            -d '{}' \
            "${{ secrets.SUPABASE_URL }}/rest/v1/rpc/get_vote_summary"
```

`SUPABASE_URL` and `SUPABASE_ANON_KEY` must be added as GitHub Actions repository secrets. The anon key is sufficient — `get_vote_summary()` is the only call made.

**Important:** If the Supabase project is already paused when this runs, the cron itself does not unpause it — only the dashboard can do that. The workflow will fail (curl returns non-zero), which at least makes the problem visible in the Actions tab.

---

## Code Explorer Integration

Add the following to `HIGHLIGHTED_FILES` in `src/config/codeViews.ts`:

```ts
{
  path: 'supabase/migrations/001_create_votes.sql',
  note: 'Schema for the poll: a SECURITY DEFINER aggregate function lets anon read vote totals without ever having SELECT on the raw table — anon can insert, never peek.',
},
{
  path: 'api/vote.ts',
  note: 'Vote handler: HMAC-SHA256 fingerprint built from IP + User-Agent, keyed with a secret salt. Duplicate detection is a 23505 unique_violation from Postgres — no application-level lookup needed.',
},
{
  path: 'src/components/sections/PollCatsOrDogs.astro',
  note: 'Two-layer dedup: localStorage for instant UX feedback, server-side hash for real data integrity. The 409 branch handles the case where localStorage was cleared but the vote already exists.',
},
```

Also add the following paths to the `include` array of the `source` code view:

```ts
'supabase/migrations/',
'api/',
```

---

## Environment Variables

| Variable | Where stored | Purpose |
|---|---|---|
| `SUPABASE_URL` | Vercel env + `.env.local` + GitHub Actions secret | Supabase project URL |
| `SUPABASE_ANON_KEY` | Vercel env + `.env.local` + GitHub Actions secret | Public read key — safe for client bundle (GET summary only) |
| `SUPABASE_SERVICE_KEY` | Vercel env only — never in `.env.local`, never committed | Service role key for INSERT — bypasses RLS, server-side only |
| `VOTE_SALT` | Vercel env only — never in `.env.local`, never committed | Secret salt for HMAC voter hash — rotate if leaked |

Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `.env.example` with blank values. Do not add `SUPABASE_SERVICE_KEY` or `VOTE_SALT` to `.env.example` — their absence from the file is the signal that they must be provisioned out-of-band.

---

## Files Created / Modified

| File | Change |
|---|---|
| `supabase/migrations/001_create_votes.sql` | New — schema, RLS, aggregate function |
| `api/vote.ts` | New — POST vote handler (Vercel Edge Function) |
| `api/votes.ts` | New — GET summary handler (Vercel Edge Function) |
| `src/components/sections/PollCatsOrDogs.astro` | New — poll section component |
| `src/pages/index.astro` | Modified — import + insert `<PollCatsOrDogs />` between `<About />` and `<TeamLevels />` |
| `src/config/codeViews.ts` | Modified — add poll files to whitelist and highlights |
| `.env.example` | Modified — add `SUPABASE_URL`, `SUPABASE_ANON_KEY` |
| `.github/workflows/supabase-keepalive.yml` | New — cron keep-alive for Supabase free tier |
| `package.json` | Modified — add `@supabase/supabase-js` dependency |

---

## Setup Steps (Pre-Development)

These must be done manually before any code is written:

1. Create a free Supabase project at [supabase.com](https://supabase.com).
2. Run `supabase/migrations/001_create_votes.sql` in the Supabase SQL editor.
3. Copy the Project URL and `anon` key from Project Settings → API.
4. Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, and `VOTE_SALT` in Vercel environment variables and in a local `.env.local` (gitignored).
5. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` as GitHub Actions repository secrets for the keep-alive workflow.
