---
status: Complete
issue: 165
issue_url: https://github.com/denhamparry/squirrelsteam/issues/165
branch: denhamparry.co.uk/fix/gh-issue-165
deploy: no
---

# Plan: Ignore non-tab fragments on the Fixtures page

## Problem and outcome

The enhanced Fixtures tabs currently interpret every fragment other than
`#results` as Upcoming. Following the global skip link to `#main` therefore
changes a selected Results tab to Upcoming and moves keyboard focus to the
Upcoming tab. Restrict tab synchronization to recognized tab fragments,
preserve native handling for the skip link and unknown fragments, and restore
the useful no-JavaScript `#results` destination without regressing the
sticky-header geometry introduced by PR #164.

Issue #165 was fetched on 2026-09-14. It is open, assigned to `denhamparry`,
labelled `bug` and `website`, and has no comments. Its referenced tab fixes from
issues #160–#162 are present in current `main` commit `88a94eb`.

## Acceptance criteria

- [ ] Activating Skip to content on `/fixtures/` keeps Upcoming selected and
      does not move focus to either tab.
- [ ] Activating Skip to content on `/fixtures/#results` keeps Results selected
      and does not move focus to either tab.
- [ ] Initial and same-page `#results` navigation still select and focus the
      Results tab while keeping the tablist and Results heading below the
      sticky header.
- [ ] The recognized `#upcoming` fragment selects and focuses Upcoming; unknown
      fragments do not alter the current tab or focus.
- [ ] Tab clicks, ArrowLeft/ArrowRight, Home/End, and the home-page Results link
      retain their existing selection, URL, and focus behavior.
- [ ] Without JavaScript, `/fixtures/#results` lands at the Results section
      below the sticky header while both panels remain readable and the tablist
      remains hidden.
- [ ] Neither JavaScript mode causes horizontal scrolling at 400px.
- [ ] Astro check/build, production audit, generated-output checks, browser
      assertions, normalized calendar comparison, diff checks, and exact staged
      pre-commit hooks pass.

## Implementation

1. Restore `#results` to the Results panel, update its tab relationship, and
   give panel fragment targets the same sticky-header scroll clearance.
2. Parse only `#results` and `#upcoming` as tab destinations; return no tab for
   `#main`, an empty fragment, or unknown fragments.
3. Keep Upcoming as the empty-fragment initial default. For recognized initial
   and hash-change navigation, select and focus the requested tab and scroll
   the tabs wrapper into the established offset position.
4. Leave click URL replacement and keyboard tab navigation unchanged.

## Files expected to change

- `src/pages/fixtures.astro`
- `docs/plan/issues/165_ignore_non_tab_hashes.md`

No layout, home link, fixture data, result formatter, calendar, dependency,
workflow, global style, or deployment change is expected.

## Validation

- Preserve the corrected baseline Chromium failure at 400×800: `/fixtures/`
  keeps Upcoming but focuses its tab after Skip to content; `/fixtures/#results`
  changes Results to Upcoming and focuses that tab. Record the earlier immediate
  hash assertion as a harness race rather than product evidence.
- Build and inspect generated Fixtures HTML: the tablist remains statically
  hidden, both panels remain statically visible, the Results tab controls the
  `results` panel, and the wrapper is no longer the fragment target.
- Serve the production build and use cached Playwright Chromium at 400×800.
  Exercise both skip-link starting states, initial and same-page recognized
  fragments, an unknown fragment, both clicks, ArrowLeft/ArrowRight, Home/End,
  the home-page Results link, focus state, header-relative geometry, and
  document width.
- Repeat `/fixtures/#results` with JavaScript disabled: require hidden controls,
  both panels visible, the Results heading within the viewport below the header,
  Upcoming above the viewport, and no horizontal overflow.
- Compare the normalized generated `fixtures.ics` SHA-256 with the retained
  `origin/main` artifact.
- Run `npm run check`, `npm run build`, `npm audit --omit=dev`, `git diff
  --check`, exact path-scope assertions, and pre-commit against the staged set.

## Risks and decisions

- Restoring the panel's `results` ID gives native no-JavaScript navigation a
  meaningful destination. Enhanced navigation explicitly scrolls the wrapper,
  retaining the visible tablist and heading geometry from PR #164.
- `#upcoming` already identifies the Upcoming panel, so treating it as a
  recognized tab fragment makes hash handling symmetric without changing the
  empty-fragment URL emitted by the Upcoming button.
- The `hashchange` listener must return before selection, focus, or scrolling
  for `#main` and unknown fragments. This lets the browser perform native
  fragment navigation and prevents the reported focus theft.
- The existing load-boundary focus scheduling remains necessary because native
  initial fragment scrolling can otherwise supersede the selected-tab focus.
- No follow-up issue, deploy, merge, or manual issue closure is authorized.

## Issue traceability

| Source item | Timing / prerequisite | Evidence target |
| --- | --- | --- |
| Skip link on default view keeps selection and no tab focus | Pre-merge / Chromium | Selected Upcoming; active element is not a tab |
| Skip link on Results view keeps selection and no tab focus | Pre-merge / Chromium | Selected Results; active element is not a tab |
| Deep link and tab interactions retain #164 behavior | Pre-merge / Chromium | Initial/hash/click/key/home-link suite and geometry |
| No-JS `#results` behavior | Pre-merge / Chromium without JS | Native Results landing below sticky header |
| No 400px horizontal overflow | Pre-merge / Chromium, both modes | Scroll width bounded to viewport |
| `fixtures.astro` named path | Pre-merge / source and diff | Sole implementation file |
| `BaseLayout.astro` skip link | Pre-merge / browser | Existing `#main` target exercised unchanged |
| Home-page Results link | Pre-merge / browser | Existing `/fixtures/#results` link exercised unchanged |
| Check, build, hooks | Pre-merge / dependencies | Repository quality gates |
| Deploy, merge, manual issue closure | N/A / authorization | Intentionally out of scope |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue, affected source, referenced PR #164, grouped plan for issues
  #160–#162, skip-link layout, and home deep link agree on one root cause: the
  hash parser has no representation for a non-tab fragment.
- The corrected cached-Chromium probe reproduced both reported paths at the
  exact target-base commit. The first probe read state before the asynchronous
  `hashchange` handler settled and is retained only as a harness limitation.
- Returning `null` for unrelated fragments is the smallest behavior change.
  Guarding before `selectTab()` is essential because that function deliberately
  falls back to the first tab for invalid names.
- Moving `#results` back to its semantic panel fixes the issue's no-JavaScript
  regression. Explicit enhanced scrolling to the wrapper preserves the reason
  PR #164 moved the target, while panel scroll margin protects native geometry.
- Cached Playwright Chromium revision 1234 and its executable are available;
  Astro preview readiness and teardown are part of the runtime validation.
- The repository contains no other tab/hash controller requiring a parallel
  change. No unresolved prerequisite, affected path, or operator choice remains.

## Implementation validation

- `npm ci` installed 261 packages, found zero vulnerabilities, and emitted only
  the existing allow-scripts advisory for `esbuild` and `fsevents`.
- Baseline `npm run check`, `npm run build`, and production audit passed. The
  corrected 400×800 browser probe exited 1 on both intended regressions:
  `/fixtures/` focused Upcoming after the skip link, while
  `/fixtures/#results` also changed Results to Upcoming. An earlier immediate
  assertion raced the asynchronous handler and is not treated as product
  evidence.
- The final cached-Chromium suite passed both skip-link starting states,
  initial and same-page Results navigation, `#upcoming`, an unknown fragment,
  both clicks, ArrowLeft/ArrowRight, Home/End, and the home-page Results link.
  Selected-tab focus and header-relative tablist/heading geometry passed, with
  no 400px horizontal overflow.
- The first no-JavaScript probe checked geometry after only 150ms and exited 1.
  Diagnostics showed Chromium reapplied the native fragment after late
  font/layout settling. A bounded 1.5-second rerun passed: the Results heading
  was 180px below the 68px header, Upcoming was above the viewport, the tablist
  computed to `display: none`, and there was no overflow.
- Generated HTML keeps two statically visible panels and a statically hidden
  tablist, places `id="results"` on the Results panel, points its tab's
  `aria-controls` there, and leaves the wrapper without that ID.
- `npm run check` passed 20 files with zero diagnostics; `npm run build`
  generated all six pages and `fixtures.ics`; `npm audit --omit=dev` found zero
  vulnerabilities; and `git diff --check` passed.
- The normalized baseline and corrected calendar SHA-256 values both equal
  `3ecbbe18f69fcf7d40895008e158b81c8aa927ec8fbc576c8e033c7fcb0ec80a`.
- The first exact staged pre-commit pass normalized the plan's end-of-file
  newline; every other applicable hook passed. The corrected exact-path rerun
  then passed every configured hook without modifying either file.

## Branch review

**Classification:** Low-risk client-side fragment, focus, and progressive
enhancement fix. No dependency, fixture data, calendar, build, workflow,
authorization, or deployment surface changed.

- The complete target-base diff matches the two planned paths and changes only
  fragment ownership, sticky offset coverage, and recognized-hash handling.
- The non-tab guard occurs before the existing fallback-capable `selectTab()`,
  so `#main` and unknown fragments cannot change selection, focus, or scroll.
- Click URL replacement and keyboard navigation remain unchanged and passed
  runtime checks. Static and enhanced modes retain their respective content
  and control visibility contracts.
- A repository-wide analogous-pattern sweep found no second hash-driven tab
  controller. The shared skip link and home link were tested through their real
  pages and need no source changes.
- Review result: no blocking findings and no non-blocking follow-up ideas.
