# Plan: Hide recurring training from Fixtures page (issue #37)

**Issue:** #37 - Remove recurring pre-season training from Fixtures page
**Status:** Implemented

## Problem

The fixtures collection includes both one-off events and recurring training
entries. `src/content/fixtures/preseason-training.md` is a recurring
`training` fixture with an `rrule`, and `src/pages/fixtures.astro` currently
renders all upcoming and past fixtures from the shared fixture helpers. That
makes the weekly training cadence appear alongside games and one-off events on
the Fixtures page.

The recurring training entry must remain in the content collection and in the
generated `/fixtures.ics` feed so calendar subscribers continue to receive the
weekly training entries.

## Acceptance Criteria

- [x] `Pre-season training` no longer appears on `/fixtures/`.
- [x] `Pre-season training` still appears in `/fixtures.ics` with its recurrence
      rule.
- [x] One-off training entries remain visible on `/fixtures/` when they do not
      have an `rrule`.
- [x] Match fixtures, tours, fundraisers, social events, and other one-off
      events remain visible and chronological.
- [x] Build/check validation passes.

## Implementation Steps

1. Add a page-local predicate in `src/pages/fixtures.astro` that excludes only
   fixtures where `data.type === "training"` and `data.rrule` is present.
2. Apply that predicate to the upcoming and past lists rendered by the Fixtures
   page.
3. Leave `src/lib/fixtures.ts`, `src/pages/fixtures.ics.ts`, and fixture content
   files unchanged so calendar generation still sees the recurring entry.
4. Build the site and inspect generated output:
   - `/fixtures/` HTML should not contain `Pre-season training`.
   - `dist/fixtures.ics` should still contain `SUMMARY:Pre-season training` and
     the `RRULE`.
   - One-off `ION fitness session` should still appear in `/fixtures/`.

## Files Expected To Change

- `docs/plan/issues/37_hide_recurring_training_from_fixtures_page.md`
- `src/pages/fixtures.astro`

## Validation

- `npm run check` - passes with 0 errors, warnings, or hints.
- `npm run build` - passes and emits `/fixtures/` plus `/fixtures.ics`.
- `rg "Pre-season training" dist/fixtures/index.html` - no match; recurring
  training is hidden from the page.
- `rg "ION fitness session" dist/fixtures/index.html` - match; one-off training
  remains visible.
- `rg "SUMMARY:Pre-season training|RRULE:FREQ=WEEKLY;BYDAY=TU;UNTIL=20260906T180000Z" dist/fixtures.ics`
  - both matches present; recurring training remains in the calendar feed.

## Risks And Open Questions

- Filtering in shared fixture helpers would affect the home page and possibly
  other consumers, so keep the behavior scoped to the Fixtures page.
- A future recurring non-training event should remain visible unless the product
  requirement changes; this plan excludes only recurring training entries.
