# Sending Links to Companies

The site personalises itself at runtime via the URL. One deploy, unlimited targets — no rebuild needed per company.

---

## How it works

When someone visits `https://yoursite.com/for/Stripe`, a small inline script reads the company name and updates:

- The `<h1>` headline: **Dear Stripe,**
- The typewriter animation: types "Stripe" after the placeholder gag
- The browser tab title: **Dear Stripe — Afton Gauntlett**

The script then immediately replaces the URL with `/` via `history.replaceState` — so the recipient's address bar shows a clean URL with no query params or path hints.

Without a recognisable name in the URL, the page redirects to a 404 — this is intentional. The site only makes sense as a personalised link, so an unaddressed visit gets a friendly error page with a contact link instead of a generic version.

---

## Building a link

```
https://yoursite.com/for/CompanyName
```

| Company | Link |
|---------|------|
| Stripe | `https://yoursite.com/for/Stripe` |
| Vercel | `https://yoursite.com/for/Vercel` |
| Booz Allen | `https://yoursite.com/for/Booz%20Allen` |
| U.S. Digital Service | `https://yoursite.com/for/U.S.%20Digital%20Service` |

**Rules:**
- Use `%20` for spaces: `/for/Booz%20Allen`
- Capitalise intentionally — the name is used as-is: `/for/stripe` shows "stripe"
- Avoid `#` and `/` in the name — they'll break the path. Almost no company name needs them.

### Legacy `?to=` format

The original `?to=CompanyName` query-string format still works and will not be removed — links already sent will continue to function. The `/for/` path is preferred for new links since it reads more naturally and doesn't hint at the personalisation mechanism in the URL.

---

## Tracking who clicks (optional)

Neither URL format alone gives click data. Options, from least to most effort:

### Option 1: Link shortener (recommended)

Create one short link per company. The shortener logs every click.

1. Go to [dub.co](https://dub.co) (open source, free tier, analytics built in) or [Bitly](https://bitly.com).
2. Create a new link for each company:
   - Destination: `https://yoursite.com/for/Stripe`
   - Short link: something like `dub.co/afton-stripe`
3. Send the short link. The service shows you who clicked, when, and how many times.

### Option 2: UTM params

Add a `?utm_source=` to the `/for/` path and pipe it into a free analytics tool (Plausible, Fathom, etc.):

```
https://yoursite.com/for/Stripe?utm_source=stripe&utm_medium=application
```

### Option 3: No tracking

Send the raw `/for/` link directly. You won't know if they clicked, but you also don't need any third-party service.

---

## Suggested workflow per application

1. Build the link: `https://yoursite.com/for/CompanyName`
2. Test it in an incognito window — confirm the headline and tab title update correctly, and that the URL cleans to `/` after load
3. (Optional) Wrap it in a short link for click tracking
4. Send it

---

## What happens without a company name

Visiting the base URL without a `/for/` path or `?to=` param (e.g. someone forwarded your link and the name was stripped) shows a 404 page with the cat animation and a mailto link back to you. That's by design — the page isn't meant to be read cold.

If you ever want to restore a fallback instead of a hard redirect, update the inline script in `src/components/sections/Hero.astro` (remove the `window.location.replace('/404')` branch) and set a default name in `src/config/site.ts`:

```ts
export const COMPANY = {
  targetName: 'your team',   // ← change this
};
```

Then rebuild and redeploy. The `/for/` path and `?to=` param always override this value at runtime.
