# WCAG 2.2 Checklist

Use this checklist before shipping each project.

## Per-Page Accessibility

- Page has one H1 and meaningful heading hierarchy.
- Landmarks exist: header, nav, main, footer.
- Skip link is present and functional.
- All interactive elements are reachable by keyboard.
- Focus indicator is visible and not removed.
- Form controls have associated labels.
- Error feedback is programmatically associated with fields.
- Link text is descriptive out of context.
- Images include alt text when informative, empty alt when decorative.
- Motion and animation respect reduced-motion preferences where applicable.

## Contrast and Readability

- Normal text contrast is at least 4.5:1.
- Large text contrast is at least 3:1.
- Interface controls and focus indicators are at least 3:1.
- Body copy line length and spacing are readable on mobile and desktop.

## Interaction and States

- Hover-only interactions have keyboard equivalents.
- No keyboard traps.
- Touch targets are sufficiently large and spaced.
- State changes are announced or perceivable.

## Validation and Testing

- Run: npm run typecheck
- Run: npm run lint
- Run: npm run test
- Run: npm run build
- Manual keyboard pass on desktop.
- Manual screen-reader spot check for critical pages.
