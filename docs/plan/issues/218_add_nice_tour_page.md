---
status: Complete
issue: 218
issue_url: https://github.com/denhamparry/squirrelsteam/issues/218
branch: denhamparry.co.uk/feat/gh-issue-218
deploy: no
---

# Plan: Add the Nice 2027 tour page

## Problem and outcome

The site and calendar expose only a generic South of France tour line. Add a
mobile-first Tour page with the confirmed Nice destination, inclusions, price,
corrected cumulative payment deadlines, private-payment guidance, and calendar
link. Keep the fixture as the single owner of dates and destination wherever it
is consumed, preserve its filename-derived calendar UID, and connect the page
from site navigation, Training, and Fundraising.

Issue #218 and its empty discussion were fetched on 2026-09-17; the live issue
was last updated at 2026-09-17T08:52:38Z. The issue supplies corrected public
facts from the flyer. The flyer image and all account or payment-reference data
remain private and will not be inspected, copied, or published.

## Implementation

1. Add `tour.astro` using `BaseLayout`, `PageHeader`, and `Card`. Select the
   published tour with `getTourFixtures()`, render its date through
   `formatWhen()`, and render its structured location.
2. Present £300 per person, the five included items, the three cumulative
   payment deadlines, private payment guidance, and a `/fixtures/` calendar
   link without publishing the flyer or banking data.
3. Update the existing tour fixture's title and location to Nice without
   renaming the file or changing its all-day inclusive date range.
4. Add Tour to header and footer navigation, link the Training tour line to the
   new page, and link Fundraising's `tour cost` wording to it.
5. Update the repository key fact to the confirmed destination, dates, and
   price.

## Files expected to change

- `docs/plan/issues/218_add_nice_tour_page.md`
- `src/pages/tour.astro` (new)
- `src/content/fixtures/tour-south-of-france.md`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/pages/training.astro`
- `src/pages/fundraising.astro`
- `CLAUDE.md`

Adding calendar payment reminders, publishing the flyer, exposing payment
credentials or reference formats, renaming the fixture, deployment, and merge
are out of scope.

## Validation

- Run `npm ci`, `npm run check`, and `npm run build` using the repository's
  existing Node.js 22+ entry points; no local service or generated-input
  prerequisite is required.
- Inspect `dist/tour/index.html` for the fixture-derived date and destination,
  £300 price, five inclusions, corrected cumulative deadlines, private-payment
  guidance, and `/fixtures/` link.
- Inspect generated Training and Fundraising pages plus every built HTML page
  for the intended `/tour/` cross-links and header/footer navigation.
- Inspect `dist/fixtures.ics` for the unchanged UID and dates plus the updated
  escaped summary and location.
- Search `src` and `dist` case-insensitively for `sort code`, account number,
  and account name; require no match. Manually confirm the payment-reference
  wording contains no format or value. Require no `5 April 2026` text and no
  newly published flyer asset.
- Validate the page's responsive structure statically: fluid containers/cards,
  wrapping lists and navigation, no fixed content width, and no horizontal
  overflow declaration. Record the absence of an installed browser if a live
  390px viewport check is unavailable rather than claiming a visual pass.
- Run `npm audit --omit=dev`, `git diff --check`, and all pre-commit hooks on the
  exact staged handoff. Pull-request CI is unfiltered and should schedule its
  check/build/audit job after publication.

## Risks and decisions

- Selecting the first start-sorted published tour is appropriate while the
  collection contains one tour. Reusing the shared selector and formatter
  prevents date-copy drift across Tour, Training, Fixtures, and the feed.
- The fixture file must retain `tour-south-of-france.md`; its basename is the
  subscribed calendar UID and renaming it would create a second event.
- Payment deadlines are page content, not fixture dates, and deliberately stay
  out of the calendar feed.
- The issue is authoritative for the corrected public facts. No sensitive
  source artifact needs to be opened to implement or verify them.

## Implementation validation

- Phase 3.5 found exactly the eight planned paths: the new page and plan plus
  the six existing content, component, page, and guidance files. No asset,
  dependency, workflow, schema, fixture helper, or calendar generator changed.
- `npm ci` installed the locked dependency tree and reported zero
  vulnerabilities. `npm run check` passed across 24 files with zero errors,
  warnings, or hints. `npm run build` generated seven pages, the sitemap, and
  `fixtures.ics` successfully.
- The built Tour page contains the fixture-derived inclusive date range and
  Nice location, £300 price, all five inclusions, all three cumulative payment
  deadlines, private-payment guidance, and the fixtures/calendar action.
- Training renders the linked `Tour — Nice, France` fixture and shared date
  range. Fundraising links the exact `tour cost` words. Every generated HTML
  page contains Tour in both global navigation regions, and the sitemap lists
  `/tour/`.
- The calendar retains `tour-south-of-france@squirrels.team`, its 1 May start
  and exclusive 5 May end, and now emits the escaped Nice summary and location.
- Source and output scans found no sort code, account number, account name,
  payment-reference format/value, `5 April 2026`, or changed flyer/public asset.
- A 390x844 headless Chromium check measured `scrollWidth === clientWidth` at
  390px with the mobile menu closed and open. Visual inspection showed the full
  page, lists, payment plan, action, sponsors, and footer without clipping.
  Desktop-header checks at 961, 1024, and 1280px found no overflow or brand/nav
  collision; the narrowest desktop gap remained 24px.
- The first built-output assertion command exited 1 because its harness assumed
  `<a>` and `<strong>` would be adjacent without Astro's scoped attributes.
  Inspection classified this as a harness assertion failure; corrected
  semantic fragment assertions passed against the same successful build.
- Complete-file extraction of the `CLAUDE.md` bash fence passed `bash -n`. The
  first ShellCheck attempt exited 1 with harness-only SC2148 because the
  extracted fixture lacked a shebang; the bounded temporary workspace was
  removed, and a shebang-normalized rerun passed both `bash -n` and ShellCheck.
- `npm audit --omit=dev` reported zero vulnerabilities and `git diff --check`
  passed.

## Branch review

**Classification:** code-relevant Astro page rendering, global navigation, and
compiled fixture content; standard, low operational risk.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

The live issue was re-fetched on 2026-09-17 and remains open with no comments or
requirement changes. The repository has no `docs/pre-pr-branch-review.md`, and
the named differential and Trail of Bits review skills are unavailable in this
session. The concrete manual fallback reviewed the complete diff, shared layout
and card contracts, every tour selector/consumer, fixture schema and UID path,
all generated pages, the ICS event, sitemap, responsive menu states, desktop
header boundary, and privacy/scope searches. The Tour page fails its build
clearly if its required published fixture or location disappears, while dates
continue to use the shared formatter. No follow-up idea remains.

## Issue traceability

| Requirement | Timing / owner / prerequisite | Evidence | Current result |
| --- | --- | --- | --- |
| Add Tour page with required shared components and five sections/actions | Pre-merge / Codex | Source and built HTML assertions | Passed |
| Derive tour dates with `getTourFixtures()` and `formatWhen()` | Pre-merge / Codex / fixture exists | Source review and rendered date | Passed |
| Publish £300 price, five inclusions, and corrected cumulative deadlines | Pre-merge / Codex | Built Tour page assertions | Passed |
| Keep banking, account, reference, and flyer data private | Pre-merge / Codex | Source/dist secret-term and asset searches | Passed |
| Update fixture title/location while preserving filename, type, dates, and all-day status | Pre-merge / Codex | Diff plus ICS assertions | Passed |
| Add header/footer Tour navigation on every page | Pre-merge / Codex | Source and all-page HTML assertions | Passed |
| Link Training tour line and Fundraising `tour cost` to `/tour/` | Pre-merge / Codex | Generated page assertions | Passed |
| Update `CLAUDE.md` tour key fact exactly | Pre-merge / Codex | Diff assertion | Passed |
| Pass check/build and avoid phone-width horizontal overflow | Pre-merge / Codex | Commands and browser inspection | Passed |
| Add payment deadlines to calendar | Out of scope | ICS review | Not performed |
| Publish flyer, deploy, or merge | User-managed / prohibited in this run | Exact diff and open PR handoff | Not performed |

## Plan review

**Overall assessment:** Approved after one review iteration.

The existing `getTourFixtures()` and `formatWhen()` path already owns published
tour selection and inclusive all-day date formatting. `BaseLayout` provides the
site-wide Header and Footer, so changing those two components reaches every
built page. `Card` and the global container/list styles are fluid and establish
the requested mobile-first page without a new fixed-width layout. The consumer
sweep covered every current `Tour`, `tour cost`, fixture selector, header item,
and footer link occurrence. Validation distinguishes safe wording about asking
for a payment reference from prohibited account details or reference values,
and no source-artifact access or external runtime assumption is required.
