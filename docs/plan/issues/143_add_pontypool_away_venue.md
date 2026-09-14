---
status: Complete
issue: 143
issue_url: https://github.com/denhamparry/squirrelsteam/issues/143
branch: denhamparry.co.uk/fix/gh-issue-143
deploy: no
---

# Plan: Add the confirmed Pontypool Utd away venue

## Problem and outcome

The 20 September 2026 away match against Pontypool Utd has a confirmed
11:00 am–12:00 pm time but no venue, so its Fixtures card shows no venue line
and its calendar event has no `LOCATION`. The user has confirmed the venue as
Pontypool United Rugby Football Club, Memorial Ground, Pontypool NP4 6HL. The
fixture should carry that venue in frontmatter so parents see it on the site and
in subscribed calendars before the match.

## Acceptance criteria

- [x] `src/content/fixtures/pontypool-utd-away-2026-09-20.md` has
      `location: Pontypool United Rugby Football Club, Memorial Ground, Pontypool NP4 6HL`.
- [x] The fixture's card on the Fixtures page shows the venue line.
- [x] The fixture's VEVENT in `dist/fixtures.ics` has
      `LOCATION:Pontypool United Rugby Football Club\, Memorial Ground\, Pontypool NP4 6HL`
      once its wrapped lines are joined.
- [x] `npm run check` and `npm run build` pass.

## Implementation

1. Add the confirmed `location` directly after `home: false`, matching the field
   order used by the home fixtures.
2. Build and check the generated card and VEVENT.

Files changed:

- `src/content/fixtures/pontypool-utd-away-2026-09-20.md`
- `docs/plan/issues/143_add_pontypool_away_venue.md`

No schema, component, calendar generator, other fixture, dependency, workflow,
or deployment file changes.

## Risks and decisions

- The venue is the user's confirmation on 2026-09-14, recorded on issue #143.
- The value contains commas. `src/lib/ics.ts` already escapes them as `\,` and
  wraps lines at 75 octets, so no shared code change is needed.
- The start, end, title, and opponent are unchanged. The other 10 upcoming away
  venues are tracked separately in #144–#153.

## Validation

- `npm ci` installed from the lockfile.
- `npm run check`: 19 files, 0 errors, warnings, or hints.
- `npm run build`: 6 pages plus `fixtures.ics`.
- `npm audit --omit=dev`: 0 vulnerabilities.
- Generated calendar: after joining wrapped lines, the Pontypool VEVENT has
  exactly one `LOCATION` with the escaped value above. Its `DTSTART`, `DTEND`,
  `SUMMARY`, and `DESCRIPTION` are unchanged, and no line in the feed exceeds 75
  octets.
- Generated Fixtures page: the card reads
  `Sun, 20 Sept 2026, 11:00 am–12:00 pm Pontypool United Rugby Football Club, Memorial Ground, Pontypool NP4 6HL`.
- `git diff --check` is clean, and the fixture diff is exactly one added line.
