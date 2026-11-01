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
  Tuesdays 20:00–21:00 GMT, `UNTIL=20270323T200000Z`.
- `src/pages/training.astro`: list only current or upcoming training (via
  `getUpcomingFixtures`), remove both pre-season cards, change the eyebrow to
  "Season 26/27".
- `src/pages/about.astro`: take the training venue from current or upcoming
  training only.
- `CLAUDE.md`: update the training key fact.

## Known limitation

`src/lib/ics.ts` writes a UTC `DTSTART` with no `TZID`, so a weekly RRULE that
crosses a DST change moves by an hour in subscribers' calendars. The recurrence
therefore stops at the last Tuesday before BST starts (23 Mar 2027). A follow-up
should add `TZID=Europe/London` support, then extend the recurrence.

## Validation

- `npm run check` and `npm run build` pass.
- The built `/training/` page shows The Barn only, with no pre-season cards.
- `/fixtures.ics` contains the new weekly RRULE.
