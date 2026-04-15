# Dynamic Scope Decision Guide

Use this before kickoff when a client asks for "more dynamic" behavior.

Goal: choose the right template early so delivery stays fast and predictable.

## Recommended Approach

1. Keep this Astro template for content-first sites and moderate interactivity.
2. Use a separate app template when the project is mostly authenticated app behavior.

## Stay on This Astro Template When

- Most pages are public content pages.
- Dynamic features are limited to forms, basic dashboards, or light account pages.
- You can keep most pages static and only add a few API endpoints.
- SEO and content performance are primary goals.

## Move to an App Template When

- Most routes require user login.
- The project has heavy client-side state across many screens.
- You need complex role/permission logic throughout the app.
- You need real-time collaboration, live data syncing, or app-like navigation everywhere.

## Quick Decision Rule

1. List all planned routes.
2. Mark each route as `content`, `mixed`, or `app`.
3. If more than one-third are `app` routes, start from your app template.
4. If one-third or less are `app` routes, this Astro template is usually a better fit.

## Cost and Maintenance Rule

- Choose the simplest architecture that can survive the next 12 months of expected feature growth.
- If expected growth includes frequent product-style iteration, use the app template from day one.

## Scope Shift Trigger During Build

If any 2 of the following become true mid-project, consider moving to the app template:

1. Multiple protected sections are added after kickoff.
2. Shared authenticated state spans many routes.
3. Team asks for real-time or near-real-time interactions.
4. Authorization rules become difficult to reason about in page-level logic.

## Handoff Note

Document your decision in kickoff notes so the client understands why the architecture was chosen.
