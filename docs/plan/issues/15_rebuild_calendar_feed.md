# Plan: Rebuild calendar feed (#4) + examples resize — issue #15

- **Status:** Complete
- **Issue:** #15 (rebuilds #4 calendar feed, redoes #9 examples resize)
- **Branch:** `denhamparry.co.uk/feat/gh-issue-015`
- **Merge style:** `gh pr merge --rebase` (repo only allows rebase merges)

## Review outcome (Phase 2)

Approved with required changes (all incorporated below):

1. **Guard `Astro.site` / `context.site`** — type is `URL | undefined` under
   strict TS. Fall back to `https://squirrels.team` in both the endpoint and
   `SubscribeButtons.astro`.
2. **Use `entry.id`, never `entry.slug`** — `.slug` was removed with the content
   layer; referencing it fails `astro check`.
3. **`encodeURIComponent`** the embedded feed URL in Google/Outlook subscribe
   links.
4. **UTC-only date math** — use `getUTC*` / epoch + 86400000 for the all-day
   exclusive `DTEND`; never `getDate()`/`setDate()` (BST would shift the date).
5. **Realistic fold test** — assert no content line exceeds 75 octets _and_ no
   multibyte char is split, not a naive length check.
6. Set the glob loader `base` to the fixtures dir so ids are clean
   (`tour-south-of-france`).

## Goal

Deliver a subscribe-able fixtures calendar for squirrels.team:

1. Fixtures modelled as a typed Astro content collection.
2. A build-time endpoint that generates a valid RFC 5545 `/fixtures.ics` feed.
3. Apple / Google / Outlook subscribe buttons + copy-link on the Fixtures page.
4. Commit the already-resized reference imagery to `examples/` (PDF **dropped**
   per maintainer decision — its dates live in fixtures + CLAUDE.md).

## Decisions

- **All-day end dates are inclusive in frontmatter; the generator emits the
  RFC-required exclusive `DTEND` (last day + 1).** Most author-friendly for the
  volunteer parents maintaining the site. Documented in README.
  - Tour: `start: 2027-05-01`, `end: 2027-05-04` → generated `DTEND;VALUE=DATE:20270505`.
- **Drafts are excluded from the feed and the page** (`draft: true` hides an
  entry everywhere).
- **PDF dropped** (user decision 2026-06-01). Hook limit stays `--maxkb=1000`.
  The tour flyer (576K) + logo PNGs (47–62K) are already under the limit.
- **No new dependencies** — `ics.ts` is hand-written RFC 5545.

## Files to create

| File | Purpose |
| --- | --- |
| `src/content.config.ts` | `fixtures` collection: `glob` loader + Zod schema |
| `src/lib/ics.ts` | dependency-free RFC 5545 generator (CRLF, 75-octet folding, UTC, escaping, RRULE, exclusive all-day DTEND) |
| `src/lib/fixtures.ts` | `getFixtures` / `getUpcomingFixtures` / `getPastFixtures`, `typeLabel`, `formatWhen` (Europe/London) |
| `src/pages/fixtures.ics.ts` | `APIRoute` GET → `text/calendar` |
| `src/components/SubscribeButtons.astro` | webcal / Google / Outlook / copy-link, URLs built from `Astro.site` |
| `src/content/fixtures/preseason-training.md` | seed (recurring, timed) |
| `src/content/fixtures/ion-fitness.md` | seed (all-day) |
| `src/content/fixtures/season-2627-start.md` | seed (all-day) |
| `src/content/fixtures/tour-south-of-france.md` | seed (all-day, multi-day) |

## Files to modify

| File | Change |
| --- | --- |
| `src/pages/fixtures.astro` | replace placeholder: subscribe card + phone instructions, upcoming list, collapsible past section |
| `README.md` | rewrite "Adding a fixture"; `/fixtures.ics` is generated, not a static file |
| `examples/2026 Squirrels Tour Flyers.png` | commit resized flyer (576K) |
| `examples/Rhiwbina 1415/{1..5}.png` | commit logo PNGs |

## Schema (`src/content.config.ts`)

```text
title: string
type: enum(match | training | tour | social | fundraiser)
start: z.coerce.date()
end: z.coerce.date().optional()
allDay: z.boolean().default(false)
location: string().optional()
opponent: string().optional()
home: z.boolean().optional()
rrule: string().optional()
draft: z.boolean().default(false)
```

## ICS generator contract

- Lines joined with **CRLF**; each content line folded at **75 octets** (UTF-8
  byte-aware) with `CRLF + space` continuation.
- Timed events: `DTSTART:YYYYMMDDTHHMMSSZ` (UTC). 7pm BST → `180000Z`.
- All-day: `DTSTART;VALUE=DATE:YYYYMMDD`, `DTEND;VALUE=DATE:` = (end||start)+1 day
  (exclusive), using UTC date components.
- `DTSTAMP` = build time (UTC). `UID` = `<entry-id>@squirrels.team`.
- Text fields escaped (`\ ; , \n`). Optional `RRULE`, `LOCATION`, `DESCRIPTION`.
- `VCALENDAR` wrapper: `VERSION:2.0`, `PRODID`, `CALSCALE:GREGORIAN`,
  `METHOD:PUBLISH`, `X-WR-CALNAME`, `X-WR-TIMEZONE:Europe/London`.

## Seed entries

1. **preseason-training** — `match`? no → `training`; start `2026-06-02T19:00:00+01:00`,
   end `…20:00:00+01:00`, location `Caedelyn Park, CF14 6EJ`,
   `rrule: FREQ=WEEKLY;BYDAY=TU;UNTIL=20260825T180000Z`.
2. **ion-fitness** — `training`, `2026-07-04`, allDay.
3. **season-2627-start** — `match`, `2026-09-06`, allDay (season opener; opponent/home omitted, rendered defensively).
4. **tour-south-of-france** — `tour`, start `2027-05-01`, end `2027-05-04`, allDay.

## Testing strategy

- `npm run build` succeeds; `npm run check` passes (strict TS).
- Inspect `dist/fixtures.ics`:
  - contains 4 `VEVENT`s (drafts excluded).
  - preseason `DTSTART:20260602T180000Z` (BST→UTC correct) + `RRULE` present.
  - tour `DTEND;VALUE=DATE:20270505` (exclusive).
  - CRLF line endings; no line > 75 octets.
- `examples/` committed without the PDF; `check-added-large-files` passes.

## Acceptance criteria (from issue)

- [ ] Content collection + schema
- [ ] RFC 5545 generator (CRLF, folding, UTC, exclusive all-day DTEND, escaping, RRULE, namespaced UID)
- [ ] fixtures lib helpers + Europe/London formatting
- [ ] `/fixtures.ics` endpoint
- [ ] SubscribeButtons (webcal/Google/Outlook/copy) from `Astro.site`
- [ ] Fixtures page rebuilt
- [ ] Seed entries
- [ ] README "Adding a fixture" updated
- [ ] `npm run build` + `npm run check` pass; ICS verified
- [ ] examples imagery committed (PDF dropped)
