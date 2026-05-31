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

Requires **Node.js 20+**.

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
  styles/       global.css — design tokens & base styles
public/         Static assets served as-is (favicon, CNAME, fixtures.ics)
examples/       Source material from the team (flyers, pre-season PDF, logo)
```

## Adding a fixture

Fixtures will be stored as data files in the repo and built into a
subscribe-able `fixtures.ics` calendar feed. See issue #4 for the data model and
workflow. (Until that lands, the fixtures page is a styled placeholder.)

## Deployment

Pushes to `main` build and deploy to GitHub Pages automatically. The
`squirrels.team` custom domain and DNS cutover are tracked in issue #3.

## Contributing

This is a small volunteer-run project. See [`docs/setup.md`](docs/setup.md) for
contributor notes. Open an issue or PR — work is tracked against the issues
listed in the [project epic (#10)](https://github.com/denhamparry/squirrelsteam/issues/10).
