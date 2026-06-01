# Rhiwbina Squirrels U12 — Team Website

The official website for the **Rhiwbina Squirrels** — the Under 12s (#1415) age
group of [Rhiwbina R.F.C.](https://www.rhiwbinarfc.co.uk/) It's a place for
players and parents to keep up with the season: fixtures, training, news and an
open calendar you can subscribe to.

🌐 **Live site:** [squirrels.team](https://squirrels.team)

## Tech stack

- **[Astro](https://astro.build/)** — static site generator (fast, content-first)
- Plain CSS with design tokens (no framework)
- Hosted on **GitHub Pages** via GitHub Actions (see issue #3)

## Local development

Requires **Node.js 22+**.

```bash
npm install        # install dependencies
npm run dev        # start the dev server at http://localhost:4321
npm run build      # build the static site into dist/
npm run preview    # preview the production build locally
npm run check      # type-check Astro components
```

## Project structure

```text
src/
  components/   Reusable UI (Header, Footer, Card, PageHeader)
  layouts/      BaseLayout (shared <head>, header, footer)
  pages/        One file per route (index, fixtures, training, about, fundraising)
  content/      fixtures/ — one markdown file per fixture (content collection)
  lib/          ics.ts (RFC 5545 generator), fixtures.ts (queries/formatting)
  styles/       global.css — design tokens & base styles
public/         Static assets served as-is (favicon, CNAME)
examples/       Source material from the team (flyers, logo)
```

The `/fixtures.ics` feed is **generated at build time** by
`src/pages/fixtures.ics.ts` from the fixtures content collection — it is not a
static file in `public/`.

## Adding a fixture

Fixtures are markdown files in `src/content/fixtures/`. Add one file per event
and rebuild — the Fixtures page and the subscribe-able `/fixtures.ics` feed both
update automatically.

```markdown
---
title: vs Llandaff North
type: match # match | training | tour | social | fundraiser
start: 2026-09-13T10:30:00+01:00 # ISO date-time (with offset) or date-only
end: 2026-09-13T12:00:00+01:00 # optional
opponent: Llandaff North # optional
home: true # optional (true = home, false = away)
location: Caedelyn Park, CF14 6EJ # optional
# allDay: true # set for whole-day events (use date-only, omit times)
# rrule: FREQ=WEEKLY;BYDAY=TU;UNTIL=20260825T180000Z # optional recurrence
# draft: true # hide from the site and the feed
---

Optional notes about the fixture.
```

Notes:

- **Times** use an explicit offset (`+01:00` in BST, `Z`/`+00:00` in GMT); the
  feed stores everything in UTC, so `19:00+01:00` becomes `18:00Z`.
- **All-day events:** set `allDay: true` and use date-only `start`/`end`. The
  `end` is the **last day (inclusive)** — the feed emits the calendar-correct
  exclusive end automatically (a 1–4 May tour ends `2027-05-04`).
- Set `draft: true` to keep an entry out of the site and the feed while you work
  on it.

## Deployment

Pushes to `main` build and deploy to GitHub Pages automatically via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The
`squirrels.team` custom domain is claimed by [`public/CNAME`](public/CNAME).

See [`docs/hosting.md`](docs/hosting.md) for the full runbook: enabling Pages,
the exact Cloudflare DNS records, the SumUp redirect cutover, and enforcing
HTTPS.

## Contributing

This is a small volunteer-run project. See [`docs/setup.md`](docs/setup.md) for
contributor notes. Open an issue or PR — work is tracked against the issues
listed in the [project epic (#10)](https://github.com/denhamparry/squirrelsteam/issues/10).
