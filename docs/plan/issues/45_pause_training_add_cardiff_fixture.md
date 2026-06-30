# Plan: Start Tuesday training in August & add Cardiff Arms Park fixture (#45)

**Status:** In Progress

## Issue

[#45](https://github.com/denhamparry/squirrelsteam/issues/45) — remove Tuesday
night training until August 2026, and add a fixture at Cardiff Arms Park,
Cardiff, on Sun 6 Dec 2026 12:30pm.

**Maintainer clarification:** there have been **no Tuesday training sessions for
the 26/27 season prior to August**. So this is not a mid-season break — Tuesday
training simply **starts at the start of August 2026 (Tue 4 Aug 2026)**. No
two-block / EXDATE split is needed; just shift the existing recurrence start.

## Approach

### 1. Shift Tuesday training to start 4 Aug 2026

`src/content/fixtures/preseason-training.md` currently starts the weekly
recurrence on 2 June 2026. Move the `start`/`end` to **Tue 4 Aug 2026** (the
first Tuesday in August), keeping the existing weekly `rrule` and its `UNTIL`
(season start, 6 Sep 2026). This recurring `training` entry is hidden from the
Fixtures page (filter in `src/pages/fixtures.astro`) but still emitted to
`fixtures.ics`, so shifting the start removes all June/July occurrences from the
calendar feed automatically.

### 2. Update Training page copy

`src/pages/training.astro`:

- "Pre-season starts **Tuesday 2 June 2026**" → "**Tuesday 4 August 2026**".
- "Pre-season focus" timeline currently lists June / July & August focus areas
  that imply training before August. Collapse to **August** (skills,
  conditioning, new rules) and **September** (season starts) so the page no
  longer implies pre-August Tuesday sessions.

### 3. Add Cardiff Arms Park fixture

New `src/content/fixtures/cardiff-arms-park-2026-12-06.md`:

- `type: match`, timed `start: 2026-12-06T12:30:00+00:00` (December = GMT), so
  the 12:30pm kick-off displays (existing matches are all-day; this one has a
  specified time).
- `location: Cardiff Arms Park, Cardiff`.
- Opponent / home-or-away unknown → omitted for now (both optional in the
  schema), to be added when confirmed.

## Files Modified

- `src/content/fixtures/preseason-training.md`
- `src/pages/training.astro`
- `src/content/fixtures/cardiff-arms-park-2026-12-06.md` (new)

## Verification

- `npm run check` (Astro type-check) passes.
- `npm run build` succeeds.
- Built `fixtures.ics`: no training VEVENT occurrences before 4 Aug 2026; first
  Tuesday training is 4 Aug 2026; Cardiff Arms Park VEVENT present for
  2026-12-06 12:30.
- Fixtures page lists the Cardiff Arms Park match; recurring training stays
  hidden from the page.
