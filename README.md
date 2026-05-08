# dear-company-name

An interactive job application microsite that replaces the Loom video ask.
Built with Astro. Each visit is personalized to a company via the URL (`/for/CompanyName`), with a live code explorer that pulls the repo itself at build time so hiring managers can browse the source as part of the experience.

- Live: [hire.aftongauntlett.com](https://hire.aftongauntlett.com/for/Github)
- Personal site: [aftongauntlett.com](https://www.aftongauntlett.com/)
- Stack: Astro + TypeScript (fully static, no backend, no CMS)

## Personalized Per Company

Use one deployed build and change the target company at runtime.

- Preferred link format: `/for/CompanyName`
- Legacy format still works: `?to=CompanyName`
- Example: `https://hire.aftongauntlett.com/for/Github`

In production, visits without a company target redirect to `/404`.

## Run Locally

Requires Node `>=22.12.0`.

```sh
npm install
npm run hooks:install
npm run dev
```

## Quality Checks

```sh
npm run validate
npm run precommit:check
```

`precommit:check` includes typecheck, lint, tests, and knip.

## Code Explorer (How I Work)

- Fetches repo files at build time via GitHub API
- Renders syntax-highlighted code with Astro's built-in `Code` component
- Ships as static output (no runtime fetches for code files)