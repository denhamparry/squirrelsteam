---
status: Complete
issue: 280
issue_url: https://github.com/denhamparry/squirrelsteam/issues/280
branch: denhamparry.co.uk/fix/gh-issue-280
deploy: no
---

# Plan: Resolve the St Peters away friendly result

## Source and decision

Issue #280 was fetched on 2026-11-01. It has no comments. The linked
[issue #273](https://github.com/denhamparry/squirrelsteam/issues/273) confirms
scores for Llandaff away on 18 October and St Peters **home** on 1 November;
neither is evidence for the 28 August St Peters **away** friendly. The
[PR #274 review](https://github.com/denhamparry/squirrelsteam/pull/274#issuecomment-6561213794)
identifies this as the sole earlier match without a result. In this Codex
conversation on 2026-11-01, the owner confirmed that Rhiwbina beat St Peters
27–15 in the 28 August friendly and asked this issue-fix workflow to continue.
That supplies `us: 27` and `them: 15`; no tries or conversion breakdown was
given. Do not infer those details from another match.

## Implementation

1. Record only the confirmed `us` and `them` totals in the fixture's existing
   `result` schema; omit unconfirmed optional breakdown fields.
2. Validate the result and complete review and PR handoff.

Expected files: this plan and the
`src/content/fixtures/st-peters-away-2026-08-28.md` fixture.

## Validation and traceability

The repository's `npm run check` and `npm run build` are self-contained after
`npm ci`; the build writes `dist/`. Pre-commit checks the staged files. CI runs
the same check/build path and a production audit for every PR to `main`.

| Issue item | Timing and owner | Evidence and current result |
| --- | --- | --- |
| Owner-confirmed result or decision not to publish | Pre-merge; owner | Confirmed 27–15 in this conversation on 2026-11-01 |
| Correct `us`/`them` score; optional breakdown only if given | Pre-merge; implementer | Exact fixture diff: 27 for Rhiwbina, 15 for St Peters; no breakdown supplied |
| `npm run check` has zero errors and `npm run build` passes | Pre-merge; implementer | Both pass; check reports 25 files, zero diagnostics |
| The St Peters card and ICS DESCRIPTION show the result | Pre-merge; implementer | Generated Results card and unfolded 28 August VEVENT show St Peters 15 – 27 Rhiwbina Squirrels |
| Results tab derives from scored match data | Pre-merge; implementer | `getResults()` and generated Results card show one away result; no renderer change |
| Other match results and unrelated pages | Pre-merge; implementer | Focused diff contains only this fixture and plan; St Peters home remains 27–7 |
| Linked #273/#274 provenance | Pre-merge; implementer | Their scores are different fixtures; no score inference |

The baseline build omitted its score from the fixture card and St Peters away
ICS event. The corrected build moves the fixture into Results, where one card
shows a win, the 27–15 away score, and the unchanged 5–7 pm date/time. The
matching ICS event keeps its UID and time and adds that result to DESCRIPTION.
The distinct St Peters home result remains 27–7. The first generated-output
assertion incorrectly expected both Past and Results cards; the page deliberately
excludes scored fixtures from Past. A corrected Results-only assertion passed,
including ICS line unfolding and a negative check against the unchanged home
result. `git diff --check` passed.

## Branch review

The change is content-only: one schema-supported score and this plan. Fresh
issue review found no new comments. A sweep of every fixture result and the
St Peters home/away pair found no adjacent missing result in scope. The shared
formatter presents an away fixture in home-team-first order, so the displayed
score is St Peters 15 – 27 Rhiwbina Squirrels. The pre-season flag keeps this
result out of the competitive season record. No executable shell fence changed.
The full diff and generated card/event were reviewed; no blocking or
non-blocking finding remains. The final staged pre-commit result is recorded
in the PR body.

## Risk and boundary

The score is external, owner-owned information. The owner supplied it directly
for this issue. No deployment or live-site operation is in scope. The PR
remains open for user review and merge.
