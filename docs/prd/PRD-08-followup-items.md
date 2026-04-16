# PRD-08: Follow-Up Items (Post PRD-06)

**Phase:** 2 (companion to PRD-07)
**Status:** Draft
**Context:** PRD-01 through PRD-06 are complete. This file captures implementation tasks that depend on Phase 2 work (primarily PRD-07) and any small data/copy corrections to completed components.

---

## 1. ProjectCard sandbox buttons (depends on PRD-07)

Once PRD-07 is implemented and `sandboxHref` / `sandboxLabel` props exist on `ProjectCard.astro`, add the following to `src/components/sections/RecentWork.astro`:

| Card | `sandboxHref` value |
|------|---------------------|
| Ghostbusters Virginia | `/code?view=gbva` |
| NPC Finder | `/code?view=npcfinder` |
| no-wb.org | `/code?view=no-wb` |
| Orbital Order | `/code?view=js13k` |
| This template (if card exists) | `/code?view=template-prd` |

Do not add these props until the `/code` page and `sandboxHref` prop are both shipped — a button that links to a 404 is worse than no button.

---

## 2. PRD-04 data — already correct in implementation

`RecentWork.astro` was verified post-completion and already has:
- All repo URLs confirmed and correct
- All live URLs confirmed and correct
- Tech stacks correct
- Orbital Order title (not "JS13k Game Entries")

No edits needed. This item is noted only to close the loop on PRD-04 doc updates made during PRD-07 planning.

---

## Acceptance Criteria

- [ ] All four `sandboxHref` props added to `RecentWork.astro` after PRD-07 ships.
- [ ] Each sandbox button navigates to the correct `/code?view=` tab.
- [ ] No sandbox button present until `/code` page is live (guard against broken links).
