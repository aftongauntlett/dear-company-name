# Sending Links to Companies

The site personalises itself at runtime via the URL. One deploy, unlimited targets — no rebuild needed per company.

---

## How it works

When someone visits `https://hire.aftongauntlett.com/for/Github`, a small runtime script reads the company name and updates:

- The `<h1>` headline: **Dear Github,**
- The typewriter animation: types "Github" after the placeholder gag
- The browser tab title: **Dear Github — Afton Gauntlett**

The script then immediately normalises the URL to `/for/CompanyName` via `history.replaceState` — so the recipient's address bar always shows the canonical shareable form regardless of how they arrived (whether via `/for/` path or a legacy `?to=` link).

Without a recognisable name in the URL, the page redirects to a 404 — this is intentional. The site only makes sense as a personalised link, so an unaddressed visit gets a friendly error page with a contact link instead of a generic version.

---

## Building a link

```
https://hire.aftongauntlett.com/for/CompanyName
```

| Company | Link |
|---------|------|
| Github | `https://hire.aftongauntlett.com/for/Github` |
| Vercel | `https://hire.aftongauntlett.com/for/Vercel` |
| Booz Allen | `https://hire.aftongauntlett.com/for/Booz_Allen` |
| U.S. Digital Service | `https://hire.aftongauntlett.com/for/U.S._Digital_Service` |
| Coca-Cola | `https://hire.aftongauntlett.com/for/Coca-Cola` |
| R+D | `https://hire.aftongauntlett.com/for/R+D` |

**Rules:**
- Use an underscore for spaces: `/for/Booz_Allen` displays as "Booz Allen"
- Hyphen and plus are preserved as-is: `/for/Coca-Cola` and `/for/R+D`
- Capitalise intentionally — the name is used as-is: `/for/github` shows "github"
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
  - Destination: `https://hire.aftongauntlett.com/for/Github`
  - Short link: something like `dub.co/afton-github`
3. Send the short link. The service shows you who clicked, when, and how many times.

### Option 2: UTM params

Add a `?utm_source=` to the `/for/` path and pipe it into a free analytics tool (Plausible, Fathom, etc.):

```
https://hire.aftongauntlett.com/for/Github?utm_source=github&utm_medium=application
```

### Option 3: No tracking

Send the raw `/for/` link directly. You won't know if they clicked, but you also don't need any third-party service.

---

## Suggested workflow per application

1. Build the link: `https://hire.aftongauntlett.com/for/Company_Name`
2. Test it in an incognito window — confirm the headline and tab title update correctly, and that the URL stays as `/for/CompanyName` (shareable/copyable)
3. (Optional) Wrap it in a short link for click tracking
4. Send it

---

## What happens without a company name

Visiting the base URL without a `/for/` path or `?to=` param (e.g. someone forwarded your link and the name was stripped) shows a 404 page with the cat animation and a mailto link back to you. That's by design — the page isn't meant to be read cold.

If you ever want to restore a fallback instead of a hard redirect, update the runtime script in `src/components/sections/Hero.astro` (adjust the `initializeCompanyTargeting(...)` redirect behavior) and set a default name in `src/config/site.ts`:

```ts
export const COMPANY = {
  targetName: 'your team',   // ← change this
};
```

Then rebuild and redeploy. The `/for/` path and `?to=` param always override this value at runtime.
