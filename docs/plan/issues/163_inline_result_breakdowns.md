---
status: Complete
issue: 163
issue_url: https://github.com/denhamparry/squirrelsteam/issues/163
branch: denhamparry.co.uk/feat/gh-issue-163
deploy: no
---

# Plan: Show scoring breakdowns beside each team's score

## Problem and outcome

Result cards currently split tries and conversions into separate lines, while
the calendar omits those details entirely. Build each team's recorded tries
and conversions into the shared `formatResult()` score string so the Fixtures
page, home-page Latest result, and calendar feed all display the same compact,
home/away-ordered result. Remove the redundant breakdown API and component
markup without changing the W/D/L outcome chip.

Issue #163 was fetched on 2026-09-14. It is open, assigned to `denhamparry`,
labelled `enhancement`, `website`, and `calendar`, and has no comments. The
related opponent work from #158 is present in current `main` commit `bc387b0`.

## Acceptance criteria

- [x] The Llandaff North result is exactly
      `Llandaff North 7 (1 try, 1 conversion) – 28 Rhiwbina Squirrels (4 tries, 4 conversions)`.
- [x] The Ynysowen result is exactly
      `Rhiwbina Squirrels 17 (3 tries, 1 conversion) – 7 Ynysowen (1 try, 1 conversion)`
      on both the Results tab and home-page Latest result card.
- [x] Calendar `Result:` lines use those same strings and retain RFC 5545
      folding at no more than 75 octets per physical line.
- [x] Result cards contain no separate Tries or Conversions definition list.
- [x] Singular/plural wording is correct for zero, one, and multiple values;
      tries-only, conversions-only, and no-breakdown results are correct.
- [x] The unnamed-opponent fallback retains W/D/L prefixes and uses inline
      breakdowns when present without changing its no-breakdown form.
- [x] The longer result lines wrap without horizontal page scrolling at a
      400px viewport on both the Fixtures and home pages.
- [x] README Results guidance documents the inline format.
- [x] Astro check/build, production audit, focused assertions, browser checks,
      diff checks, and exact staged pre-commit hooks pass.

## Implementation

1. Extend `formatResult()` with small helpers that format each team's score and
   only its recorded breakdown values, including correct singular/plural nouns.
2. Preserve named home/away ordering and the exact unnamed no-breakdown
   fallback; add spaced score separation only when an unnamed inline breakdown
   is present.
3. Remove `formatResultBreakdown`, `ResultBreakdownLine`, their re-exports, and
   the component's separate definition-list markup and styles.
4. Update the README Results note with the inline breakdown behavior.

## Files expected to change

- `src/lib/results.ts`
- `src/lib/fixtures.ts`
- `src/components/FixtureItem.astro`
- `README.md`
- `docs/plan/issues/163_inline_result_breakdowns.md`

No fixture data, schema, page, calendar generator, dependency, workflow,
global style, or deployment file is expected to change.

## Validation

- Preserve the failure-shaped baseline: the exact Llandaff inline expectation
  exits 1 because `formatResult()` returns only the score while
  `formatResultBreakdown()` returns two separate lines. Baseline check, build,
  and production audit otherwise pass.
- Exercise the pure formatter with exact Llandaff and Ynysowen data plus named
  and unnamed fixtures covering zero/one/many grammar, tries only, conversions
  only, neither breakdown, W/D/L prefixes, non-match data, and missing results.
- Build and assert exact result text in both generated pages, retained outcome
  chips, absence of breakdown markup/labels, and no remaining imports, exports,
  types, styles, or calls for the removed API.
- Unfold the generated calendar and require the exact two `Result:` strings.
  Check every raw content line is at most 75 UTF-8 octets and require each long
  description to use a valid space-prefixed continuation line.
- Compare all normalized VEVENTs with the retained `origin/main` baseline.
  Require only the Llandaff North and Ynysowen `DESCRIPTION` properties to
  change, with every other calendar property byte-stable after `DTSTAMP`
  normalization.
- Build, start Astro preview on a bounded local port, verify readiness, and use
  cached Playwright Chromium at 400x800. Require exact visible strings and
  `scrollWidth <= clientWidth` on `/fixtures/#results` and `/` before stopping
  the preview process.
- Run `npm run check`, `npm run build`, `npm audit --omit=dev`, `git diff
  --check`, exact path-scope assertions, and pre-commit against the staged set.

## Risks and decisions

- Breakdown values belong beside their corresponding team's points, so the
  helper formats each side before applying home/away ordering. Formatting a
  second score pair independently would recreate the current split structure.
- A breakdown includes only recorded categories. The schema already requires
  both teams whenever tries or conversions are present, so no partial-side
  fallback or schema change is needed.
- Named score lines already contain spaces around the en dash. The legacy
  unnamed no-breakdown result uses `17–7`; preserve that exact form while using
  readable spaces when brackets make the line longer.
- The existing calendar line-folding implementation is unchanged. Raw-octet
  and unfolded-content assertions verify the longer shared string through the
  real generator.
- Natural paragraph wrapping should satisfy mobile layout without new CSS;
  runtime width assertions will determine whether a scoped wrapping rule is
  actually needed.
- No follow-up issue, deploy, merge, or manual issue closure is authorized.

## Issue traceability

| Source item | Timing / prerequisite | Disposition and evidence target | Result |
| --- | --- | --- | --- |
| Exact Llandaff away string | Pre-merge / formatter and build | Pure helper, Results HTML, and unfolded ICS | Passed |
| Exact Ynysowen home string | Pre-merge / formatter and build | Results HTML, home HTML, and unfolded ICS | Passed |
| Same string in all three consumers | Pre-merge / shared helper | Inspect callers and compare generated output | Passed |
| Calendar folding remains at 75 octets | Pre-merge / build | Raw UTF-8 line-length and continuation checks | Passed |
| Remove separate breakdown lines | Pre-merge / component | Source sweep and generated HTML assertions | Passed |
| Zero/one/many grammar | Pre-merge / pure helper | Focused formatter matrix | Passed |
| Tries-only and conversions-only | Pre-merge / pure helper | Focused formatter matrix | Passed |
| No-breakdown result remains unchanged | Pre-merge / pure helper | Named and unnamed negative cases | Passed |
| Unnamed result retains W/D/L prefix | Pre-merge / pure helper | Breakdown and no-breakdown outcome cases | Passed |
| W/D/L chip remains | Pre-merge / component and build | Preserve `resultOutcome`; inspect generated cards | Passed |
| No 400px horizontal scrolling | Pre-merge / preview and Chromium | Fixtures and home viewport geometry | Passed |
| README documents inline format | Pre-merge / documentation | Update and inspect Results note | Passed |
| `results.ts` named path | Pre-merge / implementation | Extend single shared formatter | Passed |
| `FixtureItem.astro` markup/styles | Pre-merge / implementation | Remove redundant list and retain score/chip | Passed |
| `ics.ts` calendar caller | Pre-merge / generated validation | Reuse unchanged `formatResult()` call | Passed |
| `fixtures.ts` re-exports | Pre-merge / implementation | Remove obsolete API/type exports | Passed |
| Related #130 and #156 data | Pre-merge / unchanged fixtures | Exercise exact recorded results without data edits | Passed |
| Related #159 presentation | Pre-merge / component and pages | Replace its separate lines, preserve tab/card behavior | Passed |
| Related #158 opponents | Pre-merge / current main | Validate named ordering; no opponent edits | Passed |
| Check, build, audit, diff, hooks | Pre-merge / dependencies | Run repository quality gates | Passed |
| Deploy, merge, manual issue closure | N/A / authorization | Intentionally out of scope | Not applicable |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue has no comments or unresolved operator choice. Its exact
  examples, grammar cases, unnamed fallback, three display surfaces, calendar
  folding requirement, mobile constraint, proposed removals, affected paths,
  and four related issues are each dispositioned above.
- Current `main` contains #158's opponent metadata, so all named result examples
  have the prerequisite required for home/away team ordering. Only Llandaff
  North and Ynysowen currently contain results, making them the complete
  generated-output impact set.
- The failure-shaped formatter probe exited 1 for the intended reason: the
  score omitted breakdowns while the separate helper returned Tries and
  Conversions lines. Baseline check, build, and production audit passed, and
  the calendar artifact was retained for differential comparison.
- `FixtureItem` is the only caller of `formatResultBreakdown`; `fixtures.ts` is
  its only re-export surface. Both result pages use the same component, and
  `ics.ts` already consumes `formatResult`, so consolidation does not require a
  page, calendar-generator, fixture-data, or schema change.
- The formatter matrix covers every specified content branch plus non-match and
  missing-result no-op paths. The calendar checks cover unfolded semantics and
  the independent raw UTF-8 octet limit, guarding both content and RFC folding.
- Cached Playwright Chromium revision 1234 and its executable are available.
  Astro preview owns the built site prerequisite; readiness and teardown are
  included before accepting 400px runtime geometry evidence.
- The design keeps breakdown grammar and per-side ownership in one pure helper,
  preserves legacy strings when no breakdown exists, and introduces no broad
  abstraction or unrelated change. No unresolved plan gap remains.

## Implementation validation

- `npm ci` installed 261 packages and found zero vulnerabilities. It emitted
  the existing environment-level allow-scripts advisory for `esbuild` and
  `fsevents` without an install failure or tracked-file change.
- The failure-shaped baseline formatter assertion exited 1 because Llandaff's
  breakdown remained separate. Baseline check/build/audit passed, and the
  baseline ICS SHA-256 was
  `b9d18f52fa9ac55f1c3b54f1f37b942e1501df88e263f54ec6b2f5467cef4621`.
- Twelve focused formatter cases passed exact Llandaff and Ynysowen strings;
  zero/one/many grammar; tries-only, conversions-only, and neither; named and
  unnamed ordering; W/D/L prefixes; and non-match/missing-result no-op paths.
- `npm run check` passed across 20 files with zero errors, warnings, or hints.
  `npm run build` generated all six pages and `fixtures.ics`, while `npm audit
  --omit=dev` found zero production vulnerabilities.
- Generated HTML contains each exact result in its required page, keeps two
  Results-tab Win chips and one Latest-result Win chip, and contains no
  breakdown definition-list markup.
- All 30 unfolded VEVENTs were compared after `DTSTAMP` normalization. Only
  the two result descriptions changed; all other properties remained stable.
  Both descriptions folded, and every physical ICS line is at most 75 UTF-8
  octets. The corrected ICS SHA-256 is
  `775af9342fc478395a956bc31450923c895a2adb6e297c96fe88b901fe1f89d0`.
- Cached Chromium revision 1234 at 400x800 showed the exact long result strings
  wrapping on both `/fixtures/#results` and `/`; document scroll width equalled
  the 400px viewport. The preview server was stopped successfully.
- README's one complete executable Bash fence passed `bash -n`; the changed
  plan contains no executable shell fence.
- The first exact-scope script trimmed Git's leading porcelain status column
  and falsely reported `EADME.md`. This was a harness/setup failure. The
  NUL-delimited rerun passed all five planned paths, as did `git diff --check`.
- Every configured pre-commit hook passed against the exact staged five-file
  handoff without modifying it.

## Branch review

**Classification:** Code-relevant pure formatting and shared component output;
no dependency, schema, build, workflow, authorization, or deploy surface.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- The live issue was re-fetched unchanged and remains open with no comments.
  Every acceptance criterion, proposal branch, affected path, removal, and
  related issue remains represented in traceability.
- The repository has no `docs/pre-pr-branch-review.md`. The named
  `differential-review` and property-based Trail of Bits skills are unavailable
  in this session, so the manual fallback inspected the complete target-base
  diff, all formatter branches and callers, schema guarantees, both result
  fixtures, generated pages, full calendar diff, line folding, and mobile
  runtime geometry.
- The analogous sweep found `FixtureItem` was the only breakdown consumer and
  `fixtures.ts` its only re-export. No obsolete runtime reference, markup, or
  style remains; mentions in this plan intentionally document the baseline.
- Exact issue strings pass through the same helper used by both cards and the
  calendar. No-breakdown strings, outcome calculation/chips, fixture data,
  page selection, and unrelated VEVENT properties remain stable.
- Failure, success, and negative/no-op paths all have evidence, including the
  original split output, corrected consumer output, optional categories,
  grammar boundaries, missing data, RFC folding, and 400px overflow.
- Phase 4.5 produced no follow-up idea; no additional issue is needed.
