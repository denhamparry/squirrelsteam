---
status: Complete
issue: 132
issue_url: https://github.com/denhamparry/squirrelsteam/issues/132
branch: denhamparry.co.uk/docs/gh-issue-132
deploy: no
---

# Plan: Document the fixture result field

## Problem

The contributor-facing fixture example predates the structured match-result
schema merged in PR #131. It does not show contributors how to record scores or
breakdowns, identify the match-only restriction, or explain where results
appear.

The live issue snapshot was fetched on 2026-09-06 at 13:42 Europe/London. At
that time, issue #132 was open, last updated at `2026-09-06T12:38:25Z`, and had
no comments.

## Acceptance criteria

- [x] The README fixture example shows required `us`/`them` scores and optional
      complete `tries`/`conversions` breakdowns.
- [x] README notes say results are valid only for `type: match`, scores are
      non-negative integers, and both sides are required in each breakdown.
- [x] README notes explain that the score appears on the Fixtures page and in
      the calendar description, with named teams ordered by `home`.
- [x] The documented result shape validates against the current collection
      schema.
- [x] Markdown and the README's complete Bash fence pass validation.

## Implementation steps

1. Add the issue-proposed commented result block beside the other optional
   fixture fields in the README example.
2. Add one concise Results note covering schema restrictions, output surfaces,
   and home/away team ordering.
3. Validate the complete README, materialise the documented shape as a
   temporary fixture for Astro content validation, and run repository gates.

## Files expected to change

- `README.md`
- `docs/plan/issues/132_document_fixture_result.md`

No schema, source, fixture, dependency, workflow, generated output, deployment,
or other documentation file is expected to change.

## Validation

- Baseline failure: require that `origin/main` has no `result` field in the
  README fixture example and no Results note, while the source schema does.
- Compare the documented keys and restrictions with `src/content.config.ts` and
  the merged PR #131 behavior.
- Temporarily materialise the documented example with the result block enabled,
  run `npm run check`, and remove the probe before final validation.
- Extract the complete README `bash` fence and run `bash -n`; it contains no
  placeholders. Classify the remaining fences as inert `text` and fixture-data
  `markdown` examples.
- Run `npm ci`, `npm run check`, `npm run build`, `npm audit --omit=dev`,
  `git diff --check`, and repository pre-commit against the exact staged paths.

## Risks and decisions

- The result block stays commented because it is optional; uncommenting the
  block is the contributor action for a completed match.
- The note states exact current behavior rather than promising display of the
  tries/conversions breakdown, which remains stored data but is not rendered.
- Named-team ordering is documented only for explicit `home: true` or
  `home: false`, avoiding an unsupported claim for fixtures without that flag.
- This is a documentation-only change with no deploy, runtime, network,
  authorization, or destructive-operation risk.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Document `result`, `us`, and `them` | Implement in this PR | Exact README example assertion |
| Document optional tries/conversions | Implement in this PR | Commented complete breakdown objects |
| State match-only restriction | Implement in this PR | Results note and schema comparison |
| State non-negative integer scores | Implement in this PR | Example comment and Results note |
| State both sides required in breakdowns | Implement in this PR | Example comments and Results note |
| Describe Fixtures page result output | Implement in this PR | Results note |
| Describe calendar description output | Implement in this PR | Results note |
| Describe ordering by `home` | Implement in this PR | Explicit true/false ordering text |
| Suggested commented block | Implement in this PR | README diff |
| `README.md:50-77` | Implement in this PR | Exact changed-file and line-content checks |
| Current source schema | Validate without changing it | Schema comparison and temporary content probe |
| Markdown pre-commit hooks | Validate in this PR | Recorded hook results |
| PR #131 and issue #130 | Documented provenance | Live merged/closed reference state |
| Source, generated output, deploy, merge, issue closure | Intentionally out of scope | Exact changed-file gate and open PR |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The freshly fetched issue has no comments or conflicting requirement. Every
  acceptance criterion, suggested line, affected path, reference, and explicit
  scope boundary has one disposition in Issue traceability.
- Baseline inspection reproduced the documentation gap: `origin/main` contains
  no README `result` block or Results note, while the merged schema defines the
  exact required and optional fields plus the match-only refinement.
- Source inspection confirmed the output claims. `FixtureItem` renders a result
  independently of notes, `ics.ts` appends it to `DESCRIPTION`, and the shared
  formatter puts the Squirrels first for `home: true` and the opponent first for
  `home: false` when an opponent is named.
- The plan avoids documenting breakdown display because tries and conversions
  are stored but not rendered. It also avoids implying named ordering for an
  omitted `home` or `opponent` field.
- The README contains one executable Bash fence, which passed complete-fence
  `bash -n` validation before the edit. Its `text` project tree is inert, while
  the `markdown` fixture fence will be checked as data by materialising the
  documented result shape through Astro content validation.
- PR #131 is merged at `5a37160` and issue #130 is closed, so the README update
  is based on the current default-branch implementation rather than an
  unmerged assumption. No unresolved blocker remains.

## Implementation validation

- Phase 3.5 found exactly the two planned paths: `README.md` and this plan. No
  schema, source, fixture, dependency, workflow, generated output, deployment,
  or unrelated documentation file changed.
- `npm ci` installed the 261-package locked tree and reported zero
  vulnerabilities. Its existing environment-level allow-scripts advisory for
  `esbuild` and `fsevents` did not change any tracked dependency file.
- A temporary draft fixture materialised every documented field with the result
  block uncommented. `npm run check` accepted its 28–7 scores and complete 4–1
  tries/conversions, then the probe was removed before clean validation.
- A clean `npm run check` passed across 19 files with zero diagnostics,
  `npm run build` generated six pages plus `fixtures.ics`, and
  `npm audit --omit=dev` reported zero vulnerabilities.
- Exact assertions matched the README result block to the schema's score,
  breakdown, and match-only constraints, and matched the Results note to the
  component, formatter, and ICS behavior.
- The first prose assertion treated a Markdown source line break as semantic
  whitespace and failed on the calendar-description sentence. The corrected
  whitespace-normalising assertion passed without an implementation change.
- The complete README Bash fence passed `bash -n`; it has no placeholders. The
  remaining fences are one inert `text` tree and one fixture-data `markdown`
  example. `git diff --check` also passed.

## Branch review

**Classification:** Non-code README guidance and plan documentation.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- The live issue was re-fetched on 2026-09-06, remains open, has no comments,
  and is unchanged from the source snapshot. Every item remains dispositioned
  in Issue traceability.
- Trail of Bits review skills were skipped because no code-relevant file
  changed. The manual review inspected the complete README and plan diff, the
  merged collection schema, result formatter, fixture-card rendering, and ICS
  description construction.
- The optional commented block is directly usable when uncommented, documents
  the required and optional nesting without implying breakdown display, and
  stays adjacent to `home`, whose value controls named-team ordering.
- The Results note states the match-only rule, integer/non-negative constraint,
  complete-breakdown requirement, both output destinations, and exact ordering
  for explicit true/false home flags. It makes no unsupported claim for omitted
  opponent or home data.
- Complete-file fence validation, temporary schema validation, clean project
  gates, and exact scope checks pass. Phase 4.5 produced no follow-up idea, so
  no follow-up issue or PR-body section is needed.
