---
status: Complete
---

# Issue #268: move Tuesday training to The Barn and retire the pre-season cards

## Problem

In-season Tuesday training is now 8–9pm at The Barn (CF11 8DZ), and has been
since 27 October 2026. The Training page only listed the finished pre-season
sessions at Caedelyn Park, and the About page still named Caedelyn Park as the
training venue. The "Pre-season focus" and "What else is coming up" cards were
out of date.

## Changes

- `src/content/fixtures/in-season-training.md`: new recurring training fixture,
  Tuesdays 20:00–21:00, `UNTIL=20270427T190000Z` (last session 27 Apr 2027,
  the Tuesday before the Nice tour, as the owner confirmed).
- `src/pages/training.astro`: list only current or upcoming training (via
  `getUpcomingFixtures`), remove both pre-season cards, change the eyebrow to
  "Season 26/27".
- `src/pages/about.astro`: take the training venue from current or upcoming
  training only.
- `CLAUDE.md`: update the training key fact.

## Dependency

`src/lib/ics.ts` used to write a UTC `DTSTART` with no `TZID`, so this series
would show an hour late after 28 Mar 2027. PR #276 (#275) adds TZID output. It
must merge before 28 Mar 2027.

## Validation

- `npm run check` and `npm run build` pass.
- The built `/training/` page shows The Barn only, with no pre-season cards.
- `/fixtures.ics` contains the new weekly RRULE.
