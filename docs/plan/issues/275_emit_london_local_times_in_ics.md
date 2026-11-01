---
status: Complete
issue: 275
issue_url: https://github.com/denhamparry/squirrelsteam/issues/275
branch: denhamparry.co.uk/fix/gh-issue-275
deploy: no
---

# Plan: Emit Europe/London local times in the calendar feed

## Problem

`src/lib/ics.ts` wrote timed `DTSTART`/`DTEND` values as UTC stamps. A
recurring event repeats its `DTSTART` wall-clock time in that zone, so a weekly
8pm GMT session would appear at 9pm after BST starts. `X-WR-TIMEZONE` is a
non-standard hint and does not correct this.

## Changes

- `src/lib/ics.ts`: timed events now use
  `DTSTART;TZID=Europe/London:<local>` (and the same for `DTEND`), with the
  local time from `Intl.DateTimeFormat`. The calendar includes a Europe/London
  `VTIMEZONE` (BST last Sunday of March, GMT last Sunday of October). All-day
  events and RRULE `UNTIL` (UTC, as RFC 5545 requires) are unchanged.

## Validation

- `npm run check`: 0 errors. `npm run build`: passes.
- Parsed with Python `icalendar`: all 30 events resolve to the same UTC
  instants as the feed built from `main`.
- A temporary weekly Tuesday 20:00 probe from 27 Oct 2026 to 20 Apr 2027,
  expanded with `recurring-ical-events`, gave all 26 occurrences at 20:00
  Europe/London across the 28 Mar 2027 change. The probe was not committed.

## Follow-up

Once this merges, the in-season training RRULE (PR #269) can run past 23 Mar
2027.
