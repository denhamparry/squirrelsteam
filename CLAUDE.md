# Project: Rhiwbina Squirrels U12 Website

## Purpose

The website for the **Rhiwbina Squirrels** — the Under 12s (#1415) age group of
Rhiwbina R.F.C. It's where players and parents find fixtures, training info,
team news and a subscribe-able fixtures calendar. Live at **squirrels.team**.

## Tech stack

- **Astro** static site generator
- Plain CSS with design tokens in `src/styles/global.css` (no CSS framework)
- **GitHub Pages** hosting via GitHub Actions
- Custom domain `squirrels.team` (DNS moving Namecheap → Cloudflare, issue #3)

## Commands

```bash
npm install      # install dependencies
npm run dev      # dev server (http://localhost:4321)
npm run build    # build to dist/
npm run preview  # preview production build
npm run check    # Astro type-check
```

## Conventions

- **Content model:** fixtures live as repo data files → built into `fixtures.ics`
  (issue #4). Pages are `src/pages/*.astro`.
- **Branding:** black & white, white squirrel logo. Donate target is
  `https://shop.squirrels.team` (SumUp). Contact email `contact@squirrels.team`.
- **Mobile-first** — most visitors are parents on phones.
- **Commits:** conventional commits (`feat:`, `fix:`, `docs:`, `chore:` …).
- **Branches:** `<username>/<type>/gh-issue-<NNN>`; PR per change; run pre-commit
  before committing.

## Key facts (source: `examples/`)

- Training: Caedelyn Park (CF14 6EJ), Tuesdays 7–8pm
- 26/27 season starts Sunday 6 September 2026
- Tour: South of France, 1–4 May 2027
- Sponsorship tiers: Platinum £1,000 · Black £500 · White £250
- Bank details (tour flyer): **keep private**, do not publish on the site

## Work tracking

All work is tracked in GitHub issues under the epic **#10**. See `docs/setup.md`
for contributor notes.
