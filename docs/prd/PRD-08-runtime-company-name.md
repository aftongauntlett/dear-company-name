# PRD-08: Runtime Company Name via Query Param

**Phase:** 2

Status: Complete 
Completed: 2026-04-17 2:00am 

---

## Goal

Replace the build-time `COMPANY.targetName` constant with a runtime URL query param (`?to=CompanyName`) so the same deployed URL can be personalised per recipient — no rebuild required per company.

This lets Afton send `https://yoursite.com?to=Stripe` to one company and `https://yoursite.com?to=Vercel` to another, with each link showing the correct company name in the headline, typewriter animation, and page title.

---

## How It Works

The site is fully statically built. There is no server to read query params before rendering. The solution is:

1. The build still outputs a static page with a fallback company name (e.g. `"your team"`)
2. A small client-side script reads `?to=` from `window.location.search` on page load
3. It replaces the visible company name in the DOM before the first paint (or as early as possible)
4. The `<title>` is also updated via `document.title`
5. The typewriter animation reads from the now-updated DOM value, not the build-time value

The page degrades gracefully: without `?to=`, it shows the fallback text and still makes complete sense.

---

## Scope

- Update `src/config/site.ts`: change `COMPANY.targetName` to a fallback string (e.g. `"your team"`)
- Update `src/components/sections/Hero.astro`:
  - The static `<h1>` renders with the fallback: `Dear your team,`
  - The `data-target` attribute on the typewriter span uses the fallback
  - A new inline `<script>` reads `?to=` and patches both the visible `<h1>` text node and `data-target` before the animation runs
- Update `src/pages/index.astro`: page `<title>` defaults to fallback; client script also patches `document.title`
- Update `src/layouts/BaseLayout.astro` if `<title>` is set there rather than in index
- No other sections currently reference `COMPANY.targetName` — confirm this before closing

### Files to change
- `src/config/site.ts` — update `targetName` fallback value
- `src/components/sections/Hero.astro` — add param-reading script, patch DOM and `data-target`
- `src/pages/index.astro` — confirm title source; patch `document.title` in script if needed

---

## Out of Scope

- No server-side rendering
- No analytics or tracking of per-link opens (that's a separate concern)
- No URL encoding of spaces (instruct Afton to use `+` or `%20` in links, e.g. `?to=Booz+Allen`)
- No persistence (no localStorage — each visit reads the param fresh)

---

## Implementation Detail: Hero Script

The typewriter animation reads `data-target` off the span element. The patch script must run **before** the animation initialises. The safest approach is an inline `<script>` tag placed immediately after the `<h1>` block — it runs synchronously before the rest of the DOM is parsed, so the animation script (which fires on `DOMContentLoaded` or equivalent) always sees the patched value.

```js
// Inline script in Hero.astro — runs synchronously before animation init
(function () {
  const params = new URLSearchParams(window.location.search);
  const company = params.get('to');
  if (!company) return;

  // Patch the visible h1 text
  const headline = document.querySelector('.hero-headline');
  if (headline) headline.textContent = `Dear ${company},`;

  // Patch the typewriter data-target so animation types the right name
  const typewriter = document.querySelector('[data-target]');
  if (typewriter) typewriter.setAttribute('data-target', company);

  // Patch the page title
  document.title = `Dear ${company} — Afton Gauntlett`;
})();
```

**Why inline and not deferred:** A deferred or module script runs after parsing, which means the animation could initialise before the patch runs and type the fallback name. Inline runs synchronously.

**XSS note:** The company name from `?to=` is inserted via `.textContent` (not `.innerHTML`), which is safe — no HTML injection possible. `document.title` assignment is also safe.

---

## Fallback Behaviour

| Scenario | What the reader sees |
|---|---|
| `yoursite.com` (no param) | "Dear your team," |
| `yoursite.com?to=Stripe` | "Dear Stripe," |
| `yoursite.com?to=Booz+Allen` | "Dear Booz Allen," |
| `yoursite.com?to=<script>` | "Dear &lt;script&gt;," (textContent escapes it) |

---

## Vercel Setup

**Nothing needs to change in Vercel.** The site is already deployed as a static build. Vercel serves the same `index.html` for every request to `/`. The query param is handled entirely in the browser — Vercel never sees it.

### Steps to confirm it works after deploying

1. Deploy the updated build as normal (`git push` → Vercel auto-deploys)
2. Visit `https://yoursite.com?to=TestCompany` in a browser
3. Confirm the `<h1>` reads "Dear TestCompany," and the typewriter types it
4. Confirm `document.title` in DevTools reads "Dear TestCompany — Afton Gauntlett"
5. Visit `https://yoursite.com` (no param) — confirm fallback text displays

---

## How to Share Links

### Format
```
https://yoursite.com?to=CompanyName
```

### Rules
- **Single word:** `?to=Stripe` — works as-is
- **Multiple words:** Use `+` or `%20` for spaces: `?to=Booz+Allen` or `?to=Booz%20Allen`
- **Avoid special characters** in company names (`&`, `#`, `=`) — they'll break the param. In practice, almost no company name contains these.
- **Case is preserved** — `?to=stripe` shows "stripe", so capitalise intentionally: `?to=Stripe`

### Tracking opens (optional, not in scope)

The query param approach means you can't tell who clicked your link unless you add tracking. Some lightweight options (out of scope here, for future consideration):
- **Bit.ly / short.io** — create one short link per company, each pointing to `?to=CompanyName`. The shortlink service tracks clicks.
- **UTM params** — add `&utm_source=Stripe` alongside `?to=Stripe` and read it in a free analytics tool like Plausible or Fathom.

### One-link-per-company discipline

Even though the same URL can serve everyone, you still want to **send a unique link per company** so you can track engagement. The cleanest approach is a link shortener:

| Company | Long URL | Short Link |
|---|---|---|
| Stripe | `yoursite.com?to=Stripe` | `short.io/afton-stripe` |
| Vercel | `yoursite.com?to=Vercel` | `short.io/afton-vercel` |

This way you know which company clicked, when, and how many times — without any backend.

---

## Acceptance Criteria

- [x] `?to=Stripe` → headline reads "Dear Stripe," and typewriter types "Stripe"
- [x] `?to=Booz+Allen` → headline reads "Dear Booz Allen,"
- [x] No `?to=` param → headline reads "Dear your team," (or chosen fallback)
- [x] `document.title` updates to match the param value
- [x] No flash of wrong company name before animation starts
- [x] XSS: `?to=<img src=x onerror=alert(1)>` renders as literal text, no script executes
- [x] `npm run typecheck`, `npm run lint`, `npm run test` all pass
- [x] Verified working on Vercel production deploy (not just local)
