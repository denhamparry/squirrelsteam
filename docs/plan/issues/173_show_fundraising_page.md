---
status: Complete
issue: 173
issue_url: https://github.com/denhamparry/squirrelsteam/issues/173
pr: 174
pr_url: https://github.com/denhamparry/squirrelsteam/pull/174
branch: denhamparry.co.uk/feat/gh-issue-173
deploy: no
---

# Plan: Show the fundraising page

## Problem and outcome

Make `/fundraising/` reachable from the header and footer and indexable without
letting the sixth desktop navigation item compress or wrap the site brand at
tablet and narrow-window widths. Reuse the existing mobile menu through the
range where the full navigation cannot fit cleanly.

The issue and its empty discussion were fetched at 2026-09-15T15:41:00Z. The
PR feedback snapshot was stable at head `e1c1ec85269e75a4441fac10b1ed01d7127813c1`
and base `b7f6b31c46e21bb1dc732c4ea97af40b950bee90`. The material feedback is the
[issue-verification comment](https://github.com/denhamparry/squirrelsteam/pull/174#issuecomment-5683018942),
which requires the header to avoid overflow or brand wrapping from 769px
through 900px and requests viewport checks through 1280px. There are no
submitted reviews, inline comments, or review threads.

## Implementation

1. Keep the existing header, footer, and `noindex` removals already published on
   PR #174.
2. Raise the existing mobile-menu media query from `48rem` to `60rem`, covering
   the reported tablet and narrow-desktop range without adding a second layout.
3. Validate collapsed, expanded, and desktop navigation behavior with Chromium
   at 769, 800, 820, 871, 900, and 1280px on `/fundraising/`, plus a non-
   fundraising page.

## Files expected to change

- `src/components/Header.astro`
- `docs/plan/issues/173_show_fundraising_page.md`

The branch also retains the already-reviewed issue implementation in
`src/components/Footer.astro` and `src/pages/fundraising.astro`. No dependency,
global-style, layout, workflow, generated-artifact, or deployment change is
expected.

## Validation

- Chromium production-preview matrix at 769, 800, 820, 871, 900, and 1280px:
  no horizontal scroll; one-line brand; Donate within the viewport; hamburger
  and all seven menu destinations through 60rem; desktop navigation above
  60rem; correct `aria-current` on `/fundraising/`.
- Repeat horizontal-scroll and active-link checks on `/about/` at 820px.
- Inspect generated HTML for two `/fundraising/` links per page and no
  `noindex` output.
- Run `npm run check`, `npm run build`, `npm audit --omit=dev`, `git diff
  --check`, and exact staged `pre-commit run --all-files`.

## Risks and decisions

- `60rem` is deliberately above the reviewer's estimated clean-fit boundary
  and maps directly to the existing mobile interaction, avoiding wrapping and
  label changes.
- At exactly 60rem the collapsed menu applies; above it, the desktop row has
  materially more space than the observed failure range.
- The browser probe blocks Google Fonts to remove network timing from the
  harness. This exercises the documented fallback stacks, which are a stricter
  fit for the observed 769-820px brand wrapping; the production font requests
  remain unchanged.
- No merge, issue closure, deploy, SSH, force-push, worktree cleanup, or
  reviewer-thread resolution is authorized.

## Issue and feedback traceability

| Source item | Disposition | Timing / prerequisite | Evidence target |
| --- | --- | --- | --- |
| Remove fundraising `noindex` | Implemented on published head | Pre-merge / build | No `noindex` in generated HTML |
| Add header and footer links | Implemented on published head | Pre-merge / build and browser | Two links per built page; link available in both nav modes |
| Active header state | Implemented on published head | Pre-merge / browser | `/fundraising/` is current; `/about/` remains current on that page |
| Mobile menu contains six links plus Donate | Implemented and revalidated | Pre-merge / browser | Seven destinations after opening the menu |
| Sixth item must not break the header | Blocking feedback; implemented in this correction | Pre-merge / browser | No overflow, one-line brand, bounded Donate at requested widths |
| Check, build, audit, and hooks | Implemented and revalidated | Pre-merge / local dependencies | All repository gates exit zero |
| Missing issue plan | Actionable non-blocking; implemented in this correction | Pre-merge / repository diff | This plan accompanies the behavior fix |
| Sitemap | Non-blocking follow-up | Separate issue | Tracked by #175; intentionally out of scope |
| Unused `noindex` layout capability | Validated without change | Pre-merge / source review | Retained as a reasonable reusable layout option |
| Upstream twin | Not applicable | Repository documentation | No upstream mapping is documented |
| Merge, deploy, closure, cleanup | Intentionally out of scope | User/operator | No such operation performed |

## Implementation validation

- The first baseline Chromium command used `networkidle` and timed out without
  returning assertions because of the external font requests; this was a
  harness/setup failure, not product evidence.
- The bounded baseline rerun blocked external font requests and exited 1 as
  intended: at 769, 800, and 820px the brand occupied two lines, and the
  hamburger remained hidden at every requested width through 900px.
- After changing the media query, the production-preview Chromium matrix passed
  at 769, 800, 820, 871, 900, 960, 961, and 1280px. Every page had bounded
  document width and a one-line brand; the collapsed range exposed seven menu
  destinations and kept Donate inside the viewport; 961px and 1280px used the
  desktop row. `/fundraising/` and the 820px `/about/` cross-check exposed the
  correct active link.
- `npm run build` generated all six pages and `fixtures.ics`; the generated
  HTML check found two fundraising links on each page and no `noindex` metadata.
- `npm run check` passed 20 files with zero diagnostics, `npm audit --omit=dev`
  found zero vulnerabilities, and `git diff --check` passed.

## Branch review

**Classification:** Low-risk responsive CSS correction on a code-relevant
branch. No dependency, script, workflow, authorization, external-state, or
deployment behavior changed.

- The complete target-base and working-tree diff maps to the three original
  issue files plus the planned breakpoint correction and this plan. No expected
  implementation path is missing and no unrelated path is present.
- The reported behavior was reproduced before the change and the same browser
  assertions pass after it, including both sides of the exact breakpoint.
- The repository contains one navigation toggle/media-query implementation, so
  no analogous header controller requires synchronization. Other media queries
  are page-specific and intentionally different.
- `differential-review` is unavailable in this session; the manual fallback
  inspected the complete diff, affected generated pages, responsive boundary,
  navigation state, active-link behavior, and site-wide caller through
  `BaseLayout.astro`.
- Review result: no blocking findings and no additional follow-up ideas.
