# Sending Links to Companies

The site personalises itself at runtime via a `?to=` URL query param. One deploy, unlimited targets — no rebuild needed per company.

---

## How it works

When someone visits `https://yoursite.com?to=Stripe`, a small inline script reads the param and updates:

- The `<h1>` headline: **Dear Stripe,**
- The typewriter animation: types "Stripe" after the placeholder gag
- The browser tab title: **Dear Stripe — Afton Gauntlett**

Without `?to=`, the page redirects to a 404 — this is intentional. The site only makes sense as a personalised link, so an unaddressed visit gets a friendly error page with a contact link instead of a generic version.

---

## Building a link

```
https://yoursite.com?to=CompanyName
```

| Company | Link |
|---------|------|
| Stripe | `https://yoursite.com?to=Stripe` |
| Vercel | `https://yoursite.com?to=Vercel` |
| Booz Allen | `https://yoursite.com?to=Booz+Allen` |
| U.S. Digital Service | `https://yoursite.com?to=U.S.+Digital+Service` |

**Rules:**
- Use `+` or `%20` for spaces: `?to=Booz+Allen`
- Capitalise intentionally — the name is used as-is: `?to=stripe` shows "stripe"
- Avoid `&`, `#`, and `=` in the name — they'll break the param. Almost no company name needs them.

---

## Tracking who clicks (optional)

The `?to=` param alone gives no click data. Options, from least to most effort:

### Option 1: Link shortener (recommended)

Create one short link per company. The shortener logs every click.

1. Go to [short.io](https://short.io) or [Bitly](https://bitly.com) (both have free tiers).
2. Create a new link for each company:
   - Destination: `https://yoursite.com?to=Stripe`
   - Short link: something like `short.io/afton-stripe`
3. Send the short link. The service shows you who clicked, when, and how many times.

### Option 2: UTM params

Add a `&utm_source=` alongside `?to=` and pipe it into a free analytics tool (Plausible, Fathom, etc.):

```
https://yoursite.com?to=Stripe&utm_source=stripe&utm_medium=application
```

### Option 3: No tracking

Send the raw `?to=` link directly. You won't know if they clicked, but you also don't need any third-party service.

---

## Suggested workflow per application

1. Build the link: `https://yoursite.com?to=CompanyName`
2. Test it in an incognito window — confirm the headline and tab title update correctly
3. (Optional) Wrap it in a short link for click tracking
4. Send it

---

## What happens without `?to=`

Visiting the base URL without a param (e.g. someone forwarded your link and stripped the query string) shows a 404 page with the cat animation and a mailto link back to you. That's by design — the page isn't meant to be read cold.

If you ever want to restore a fallback instead of a hard redirect, update the inline script in `src/components/sections/Hero.astro` (remove the `window.location.replace('/404')` branch) and set a default name in `src/config/site.ts`:

```ts
export const COMPANY = {
  targetName: 'your team',   // ← change this
};
```

Then rebuild and redeploy. The `?to=` param always overrides this value at runtime.
