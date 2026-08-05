---
status: Complete
issue: 62
issue_url: https://github.com/denhamparry/squirrelsteam/issues/62
branch: denhamparry.co.uk/feat/gh-issue-062
---

# Plan: Add August Sunday training sessions

## Problem

Rhiwbina Squirrels train at Caedelyn Park on four additional Sundays in
August 2026. The existing branch adds the recurring calendar content and the
Training-page copy, but the Fixtures page deliberately hides every recurring
training entry. As a result, the generated feed contains the Sunday event while
the rendered Fixtures page does not satisfy issue #62.

The solution must expose this exceptional Sunday series on the Fixtures page
without restoring the ordinary Tuesday recurrence that issue #37 intentionally
removed from that page.

## Acceptance criteria

- [x] The calendar feed represents Sunday training on 9, 16, 23, and 30 August
      2026 from 10:30 to 11:30 Europe/London at Caedelyn Park, CF14 6EJ.
- [x] The Fixtures page lists the Sunday series with the existing human-readable
      recurrence summary.
- [x] The Training page mentions the August Sunday sessions.
- [x] The existing Tuesday fixture source and its generated recurrence remain
      unchanged and hidden from the Fixtures page.
- [x] Type-check, production build, generated-output assertions, and repository
      pre-commit hooks pass.

## Implementation steps

1. Preserve the existing Sunday fixture content and verify its DTSTART, DTEND,
   location, weekly Sunday RRULE, and inclusive final occurrence.
2. Add an optional fixture-schema override that lets a recurring training entry
   opt into Fixtures-page rendering while preserving the established default
   behavior for existing content.
3. Set that override only on the August Sunday fixture.
4. Update the page-local fixture predicate to honor the explicit override and
   otherwise retain issue #37's recurring-training exclusion.
5. Preserve the existing Training-page addition and leave
   `preseason-training.md` untouched.
6. Build and inspect the feed and HTML for the positive Sunday evidence and
   negative Tuesday-page evidence.

## Files expected to change

- `docs/plan/issues/62_add_august_sunday_training.md`
- `src/content.config.ts`
- `src/content/fixtures/august-sunday-training.md`
- `src/pages/fixtures.astro`
- `src/pages/training.astro`

`src/content/fixtures/preseason-training.md` is explicitly expected to remain
unchanged.

## Validation

- Failure-shaped baseline: build the existing PR head and confirm the Sunday
  VEVENT is present in `dist/fixtures.ics` but `August Sunday training` is absent
  from `dist/fixtures/index.html`.
- Run `npm run check`.
- Run `npm run build`.
- Inspect `dist/fixtures.ics` for the Sunday DTSTART/DTEND, location, title, and
  `FREQ=WEEKLY;BYDAY=SU;UNTIL=20260830T093000Z`; enumerate the rule to confirm
  exactly 9, 16, 23, and 30 August and no 2 August occurrence.
- Inspect `dist/fixtures/index.html` for `August Sunday training`, the 10:30 to
  11:30 time, Caedelyn Park, and `Weekly on Sundays, until 30 Aug 2026`.
- Confirm `Pre-season training` remains absent from the Fixtures HTML while its
  Tuesday RRULE remains present and unchanged in the feed.
- Confirm the built Training page contains the August Sunday copy.
- Compare the Tuesday fixture blob with `origin/main`.
- Run `git diff --check` and the repository pre-commit hooks against the exact
  staged file set before committing.

## Implementation validation

- `npm run check` passed with 0 errors, warnings, or hints.
- `npm run build` passed and generated all six pages plus `fixtures.ics`.
- A Node assertion parsed the Sunday VEVENT, checked DTSTART/DTEND/location and
  RRULE, enumerated exactly 9, 16, 23, and 30 August, excluded 2 August, and
  converted the UTC times to 10:30-11:30 Europe/London.
- Generated Fixtures HTML contains `August Sunday training`, the time and
  venue, and `Weekly on Sundays, until 30 Aug 2026`.
- Generated Fixtures HTML excludes `Pre-season training`; the feed retains its
  Tuesday title and RRULE.
- Generated Training HTML contains the August Sunday slot.
- The Tuesday fixture source matches `origin/main` byte-for-byte.
- `git diff --check` and all repository pre-commit hooks passed on the staged
  change set.

## Risks and open questions

- Replacing the current filter globally would regress issue #37 by showing the
  Tuesday recurrence again. The override must be opt-in and page-local.
- The RRULE `UNTIL` value is UTC. For an August 10:30 BST start, the final
  occurrence is represented as 09:30Z.
- The shared fixture component already owns recurrence display and should not
  change; this keeps the implementation limited to content selection.
- No deploy is requested. The workflow stops with an open PR.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Sunday 10:30-11:30 at Caedelyn Park | Implemented in this PR | Sunday fixture source and generated feed/page |
| Weekly Sunday recurrence from 9 through 30 August | Implemented in this PR | DTSTART plus RRULE enumeration |
| Exclude Sunday 2 August | Validated without a separate change | DTSTART is 9 August and enumeration has no earlier occurrence |
| Add the fixture under `src/content/fixtures/` | Implemented in this PR | `august-sunday-training.md` |
| Fixtures feed contains all four sessions | Implemented in this PR | Generated VEVENT and recurrence validation |
| Fixtures page lists the series and summary | Implemented in this PR | Explicit page-display override and built HTML |
| Training page mentions Sundays | Implemented in this PR | Built Training-page assertion |
| Tuesday sessions continue unchanged | Validated without a change | Source blob comparison and feed/page assertions |
| Leave `preseason-training.md` untouched | Intentionally out of scope | No branch diff for that path |
| Deployment | Intentionally out of scope | No deploy option or plan metadata |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue was re-fetched on 2026-08-05 and every scope and acceptance
  statement is represented in Issue traceability.
- Failure-shaped validation reproduced the branch defect: the generated feed
  contains the Sunday DTSTART, DTEND, title, and RRULE, while the generated
  Fixtures page has no Sunday-training entry.
- Issue #37 and its implementation establish that recurring training is hidden
  by default. A schema-backed optional override is the narrowest way to satisfy
  the explicit issue #62 exception without title matching or restoring Tuesday
  training to the page.
- The analogous-pattern sweep covered the content schema, all uses of `rrule`,
  the page-local filter, the shared recurrence renderer, and the calendar
  generator. Only the page selection predicate needs behavioral adjustment;
  shared rendering and feed generation already support the Sunday record.
- The existing Tuesday fixture matches `origin/main` byte-for-byte and requires
  no edit.
- The validation plan covers the original failure, corrected success path,
  legacy Tuesday behavior, exact Sunday recurrence dates, and build/type gates.

## Branch review

**Classification:** Code-relevant Astro/TypeScript schema, page-selection, and
fixture-content changes.

**Review iteration 1:** Approved with no blocking findings.

- The live issue was re-fetched on 2026-08-05 and the implementation still
  matches every traceability item.
- Phase 3.5 found exactly the five planned paths. The explicitly excluded
  Tuesday fixture has no diff against `origin/main`.
- `differential-review` and the named Trail of Bits specialist skills are not
  available in this Codex session. The concrete manual fallback inspected the
  complete diff, fixture schema, every `rrule` consumer, both recurring
  training records, page predicate, recurrence renderer, calendar generator,
  and generated output.
- The optional override is read only by the Fixtures page. It cannot affect the
  feed, recurrence calculation, shared card rendering, or fixtures that omit
  the field. The only opted-in record is August Sunday training.
- Failure, success, and legacy/no-op paths passed: the original PR head omitted
  Sunday training from the page; the updated build displays it; Tuesday remains
  hidden from the page and unchanged in the feed and source.
- Exact recurrence enumeration produced only 9, 16, 23, and 30 August 2026 and
  verified 10:30-11:30 Europe/London.
- `npm run check` and `npm run build` pass. Generated HTML contains the title,
  time, venue, and human-readable recurrence summary.
- The in-app browser backend was unavailable after setup and discovery, so the
  review used generated HTML and scoped CSS inspection rather than claiming a
  rendered screenshot check.
- Changed Markdown files contain no Bash or shell fences, so complete-file
  executable-fence validation is not applicable.
- `npm audit --omit=dev` reports zero production vulnerabilities. The five
  development-tool findings reported by `npm ci` are pre-existing and outside
  this issue's unchanged dependency scope.

## Follow-up ideas

- Non-blocking: update the Astro language-server development dependency chain
  separately to clear the existing development-tool audit findings.

## Post-PR verification

**Implementation head reviewed:**
`ca4fd8ba0a8a39fdd970c45472fb3f571c0f4a2c`

**Outcome:** Passed independently with no blocking or new non-blocking finding.
The existing development-dependency audit item remains the only follow-up.

| Criterion or issue statement | Independent evidence | Result |
| --- | --- | --- |
| Sunday training uses the requested type, time, and venue | Parsed the source record and generated VEVENT for `type: training`, 10:30-11:30 Europe/London, and Caedelyn Park, CF14 6EJ | Pass |
| Weekly recurrence begins 9 August and ends 30 August | Re-enumerated the RRULE as 9, 16, 23, and 30 August 2026 | Pass |
| Sunday 2 August is excluded | Confirmed DTSTART is 9 August and the enumerated occurrence set has no 2 August entry | Pass |
| Calendar feed contains the complete Sunday series | Fresh build contains one Sunday VEVENT with the expected DTSTART, DTEND, location, and RRULE | Pass |
| Fixtures page lists Sunday training with readable recurrence | Fresh generated HTML contains the Sunday title, time, venue, and `Weekly on Sundays, until 30 Aug 2026` | Pass |
| Training page mentions the August Sunday sessions | Fresh generated Training HTML contains the August Sunday slot and time | Pass |
| Tuesday sessions are unaffected | Tuesday source matches `origin/main`; its feed title/RRULE remain present while the Fixtures page still hides it | Pass |
| Explicit display exception is narrowly scoped | Repository sweep found exactly one `showOnFixturesPage: true` record and preserved the fallback filter | Pass |
| Type, build, and production audit gates pass | Re-ran `npm run check`, `npm run build`, and `npm audit --omit=dev` from the remote PR head | Pass |
| Required GitHub check passes | `CI Placeholder` passed for PR #63 at the reviewed implementation head | Pass |

The analogous-path sweep rechecked the schema, both recurring training records,
all recurrence consumers, the page filter, the shared recurrence renderer, and
calendar generation. The local head, remote branch head, and GitHub PR head all
matched the reviewed implementation SHA before this evidence was recorded.
