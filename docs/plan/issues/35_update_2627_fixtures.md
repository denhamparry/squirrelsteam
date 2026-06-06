# Plan: Update 26/27 fixtures calendar and events page (issue #35)

**Status:** Reviewed (Approved)
**Issue:** #35 - Update 26/27 fixtures calendar and events page from spreadsheet dates
**Type:** content (fix)
**Branch:** co/fix/gh-issue-035

## Background

The Fixtures page and generated `/fixtures.ics` calendar feed both read from the
`fixtures` content collection in `src/content/fixtures/*.md`.

Issue #35 provides a spreadsheet screenshot with dated 26/27 game rows. Rows
where the Opposition column is blank or says `Blank` must be skipped. Event
names must use:

```text
#1415 Gameday: {Opposition} ({Location})
```

The current `src/content/fixtures/season-2627-start.md` entry is a generic
match placeholder dated 2026-09-06. Because the spreadsheet gives a real first
game on 2026-09-05, the placeholder should be removed to avoid an extra event
not present in the source data.

## Acceptance Criteria

- [ ] All non-blank opposition rows from issue #35 appear on the fixtures page.
- [ ] The generated `.ics` feed includes the same events with the same dates and
      names.
- [ ] Rows with `Blank` opposition are not added.
- [ ] Event ordering remains chronological.
- [ ] Existing training, tour, and other non-match events remain intact.

## Implementation Steps

1. Add one all-day `match` content entry per non-blank spreadsheet row.
2. Use exact issue event titles, date-only `start` values, and `allDay: true`.
3. Set `home: true` for home rows, `home: false` for away rows, and omit `home`
   for the tournament row with `TBC`.
4. Preserve the Whitchurch note in the markdown body: `Query them having a team`.
5. Remove the generic `season-2627-start.md` placeholder.
6. Avoid rendering empty note containers for fixtures that intentionally have no
   markdown body.

## Files Expected To Change

- `docs/plan/issues/35_update_2627_fixtures.md`
- `src/components/FixtureItem.astro`
- `src/content/fixtures/llandaff-north-away-2026-09-05.md`
- `src/content/fixtures/tournament-2026-09-13.md`
- `src/content/fixtures/clwb-rygbi-caerdydd-away-2026-09-27.md`
- `src/content/fixtures/cowbridge-home-2026-10-11.md`
- `src/content/fixtures/llandaff-away-2026-10-18.md`
- `src/content/fixtures/st-peters-home-2026-11-01.md`
- `src/content/fixtures/caerau-away-2026-11-08.md`
- `src/content/fixtures/rumney-home-2026-11-15.md`
- `src/content/fixtures/old-penarthians-home-2026-11-22.md`
- `src/content/fixtures/old-illts-away-2027-01-10.md`
- `src/content/fixtures/pentyrch-away-2027-01-17.md`
- `src/content/fixtures/st-albans-away-2027-01-24.md`
- `src/content/fixtures/pontyclun-home-2027-01-31.md`
- `src/content/fixtures/whitchurch-away-2027-02-14.md`
- `src/content/fixtures/llanharan-away-2027-02-28.md`
- `src/content/fixtures/penarth-home-2027-03-14.md`
- `src/content/fixtures/cricc-away-2027-03-21.md`
- `src/content/fixtures/llanishen-home-2027-04-04.md`
- `src/content/fixtures/fairwater-away-2027-04-18.md`
- `src/content/fixtures/season-2627-start.md` (deleted)

## Validation Steps

- Run `npm run check`.
- Run `npm run build`.
- Inspect `dist/fixtures.ics` to confirm the new event summaries and dates are
  present and the deleted placeholder is absent.

## Risks / Open Questions

- No kickoff times were provided, so all new match events are all-day entries.
- `location` in the screenshot means home/away status, not a venue address.
  Titles and `home` chips carry this information; venue addresses can be added
  later if supplied.

## Review Summary

**Overall Assessment:** Approved.

- The planned content-only changes match the repo model: one markdown fixture
  updates both the page and calendar feed. The small component guard is scoped
  to preventing empty note markup from the new bodyless entries.
- Deleting the generic season-start placeholder avoids a duplicate non-source
  match event.
- Validation covers content schema, Astro rendering, and generated calendar
  output.
