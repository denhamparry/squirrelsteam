---
status: Complete
issue: 175
issue_url: https://github.com/denhamparry/squirrelsteam/issues/175
branch: denhamparry.co.uk/feat/gh-issue-175
deploy: no
---

# Plan: Add the site sitemap and crawler discovery file

## Problem and outcome

The static site publishes six indexable HTML routes but no sitemap or
`robots.txt`, leaving the newly indexable fundraising page harder for crawlers
to discover. Add Astro's official sitemap integration, expose the generated
sitemap index through `robots.txt`, and keep sitemap eligibility synchronized
with the layout's `noindex` behavior.

Issue #175 and its empty discussion were fetched at 2026-09-16T09:33:23Z.
The linked #173 implementation is merged and the current six HTML routes emit
no `noindex` metadata. Astro's official sitemap documentation for v3.7.4 says
the integration emits `sitemap-index.xml` plus numbered sitemap files, accepts
a URL `filter`, and cannot inspect a page's source metadata. A shared local SEO
predicate is therefore required if future `noindex` routes are to remain
mechanically aligned with the sitemap filter.

## Implementation

1. Add the compatible `@astrojs/sitemap` production dependency and configure
   it in `astro.config.mjs` using the existing `site` URL.
2. Add a small shared SEO module containing the explicit `noindex` route list
   and sitemap inclusion predicate. Keep `/fixtures.ics` explicitly excluded
   even though current sitemap releases only enumerate HTML page routes.
3. Make `BaseLayout.astro` derive `noindex` from the shared route list so a
   route cannot advertise conflicting crawler instructions through the two
   outputs.
4. Add `public/robots.txt` with an unrestricted crawler policy and the absolute
   sitemap-index URL.

## Files expected to change

- `astro.config.mjs`
- `package.json`
- `package-lock.json`
- `public/robots.txt`
- `src/lib/seo.ts`
- `src/layouts/BaseLayout.astro`
- `docs/plan/issues/175_add_sitemap_and_robots.md`

No page content, navigation, calendar-feed behavior, deployment workflow,
external submission to a search engine, deploy, or issue closure is in scope.

## Validation

- Before implementation, run `npm ci` and `npm run build`, then prove the
  original failure shape: neither sitemap output nor `dist/robots.txt` exists.
- Run `npm run check` and `npm run build`; require zero exit status from each.
- Parse `dist/sitemap-index.xml` and its numbered sitemap with Node: require the
  six expected absolute `https://squirrels.team` page URLs exactly once, no
  relative or foreign-host URLs, and no `/fixtures.ics` entry.
- Compare built HTML `noindex` metadata with sitemap URLs. Temporarily add
  `/about/` to the shared exclusion list, build, prove the page gains
  `noindex` while disappearing from the sitemap, then restore the final empty
  list and rebuild. This failure/success probe must not be committed.
- Require `dist/robots.txt` to match the crawler policy and absolute
  `https://squirrels.team/sitemap-index.xml` reference.
- Run `npm audit --omit=dev`, `git diff --check`, and the complete staged
  `pre-commit run --all-files` workflow. No local service is required; `npm ci`
  is the only validation prerequisite.

## Risks and decisions

- The sitemap integration cannot infer `<meta name="robots">` values from
  rendered HTML. Centralizing the route decision avoids maintaining two
  independent lists while retaining the existing reusable `noindex`
  capability.
- The current noindex route list is deliberately empty after #173. The
  temporary `/about/` probe demonstrates that the non-empty path works without
  publishing an artificial excluded page.
- `fixtures.ics` is a non-HTML endpoint and current integration behavior omits
  endpoints before the filter runs. Keeping the explicit exclusion documents
  and defends the repository-level intent if upstream route collection changes.
- Generated `dist/` output remains untracked. Deployment continues through the
  existing GitHub Pages workflow after a user-managed merge.

## Research validation

Approved after one review iteration. The repository has exactly six `.astro`
page routes, one non-HTML endpoint, no current `noindex` call site, and no
existing sitemap or crawler-discovery implementation to synchronize. A clean
`npm ci` supplied the documented build prerequisite, and the baseline build
reproduced the issue: it generated all six pages plus `fixtures.ics` but none of
`sitemap-index.xml`, `sitemap-0.xml`, or `robots.txt`. The official integration
documentation and source confirm that current releases enumerate HTML pages
and apply `filter` to full absolute URLs, while page metadata is unavailable to
the integration. The planned shared predicate and temporary non-empty probe
cover that boundary without adding a production-only test page.

## Implementation validation

- The baseline `npm run build` generated six pages plus `fixtures.ics` and
  proved that all three requested SEO artifacts were absent before the change.
- A clean final `npm ci` installed 267 packages from the lockfile and reported
  zero vulnerabilities. `npm run check` passed 23 files with zero errors,
  warnings, or hints, and `npm run build` generated all six pages plus
  `fixtures.ics`, `sitemap-index.xml`, and `sitemap-0.xml`.
- The generated sitemap index points only at the numbered sitemap. The numbered
  sitemap contains exactly the six expected absolute `https://squirrels.team`
  page URLs, each once, and omits `fixtures.ics`.
- `public/robots.txt` and `dist/robots.txt` are byte-identical and identify the
  absolute sitemap-index URL. The final six generated pages contain no
  `noindex` metadata, matching the final sitemap set.
- The temporary `/about/` probe built successfully: the page emitted
  `noindex, follow`, disappeared from the sitemap, and left the other five
  routes indexable. The temporary list entry was then removed and the final
  build restored the six-page sitemap.
- The first final inline Node sitemap assertion exited 1 because the harness
  over-escaped the closing-tag regex. The surrounding shell lacked fail-fast
  handling and returned 0 after later checks; this was a harness/setup failure,
  not product evidence. A corrected `set -e` rerun inspected every nested exit
  status and passed all sitemap, robots, noindex, and `git diff --check`
  assertions.
- `npm audit --omit=dev`, `git diff --check`, and all nine hooks in the complete
  staged `pre-commit run --all-files` workflow pass.

## Branch review

**Classification:** Code-relevant, low-risk build/SEO integration and one
production dependency. No runtime server, authorization, workflow, deploy, or
external-state behavior changes.

- The expected and actual path sets are identical: the integration and lock
  files, shared SEO helper, layout consumer, robots file, and this plan.
- `differential-review` and `supply-chain-risk-auditor` are unavailable in this
  session. The manual fallback inspected the complete diff, all six layout
  callers, every noindex/sitemap occurrence, generated outputs, dependency
  metadata, lock integrity, Node compatibility, and the official integration
  documentation/source.
- `@astrojs/sitemap` 3.7.4 is the official MIT-licensed package from the Astro
  repository. It adds no install lifecycle script; its `sitemap` dependency's
  Node floor is below the repository and CI Node 22 floor; the lockfile carries
  registry integrity hashes; and the production audit reports no advisories.
- The negative probe proves the shared predicate rejects the plausible wrong
  state where a page emits `noindex` but remains advertised. The final sweep
  found no other layout, sitemap, crawler-policy, or non-page-route mechanism
  requiring synchronization.
- The changed Markdown file contains no executable shell fences. Review found
  no blocking issue and no non-blocking follow-up idea.

## Issue traceability

| Issue item | Disposition | Timing / owner / prerequisite | Evidence target |
| --- | --- | --- | --- |
| Build emits sitemap index and numbered sitemap | Implement in this PR | Pre-merge / Codex / installed dependencies | Both generated XML files exist and parse |
| Every indexable route appears exactly once as an absolute site URL | Implement and validate | Pre-merge / Codex / successful build | Exact six-route set and count assertion |
| Exclude `/fixtures.ics` | Implement and validate | Pre-merge / Codex / successful build | Explicit filter plus absence assertion |
| Exclude every route rendered with `noindex` | Implement through shared predicate | Pre-merge / Codex / temporary non-empty probe | `/about/` negative probe aligns HTML and sitemap, then is restored |
| Add `public/robots.txt` pointing at the sitemap | Implement in this PR | Pre-merge / Codex | Source and copied build artifact match expected content |
| Build, Astro check, and hooks pass | Validate in this PR | Pre-merge / Codex / `npm ci` | Commands exit zero on final staged content |
| #174 review origin and #173 linked context | Validated without further change | Pre-merge / merged repository state | Fundraising is one of the six indexable routes |
| Search-console submission or live crawl observation | Intentionally out of scope | Post-merge / site operator | Not required by #175 and no external mutation authorized |
| Merge, deploy, issue closure, or worktree cleanup | Intentionally out of scope | User/operator | No such operation performed |
