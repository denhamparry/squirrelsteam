---
status: Complete
issue: 99
issue_url: https://github.com/denhamparry/squirrelsteam/issues/99
branch: denhamparry.co.uk/docs/gh-issue-099
deploy: no
---

# Plan: Align contributor validation guidance

## Problem

`CONTRIBUTING.md` and the pull request template still require test-driven
development, automated tests, and greater than 80 percent coverage even though
this Astro site has no `test` script, test framework, or coverage tooling. The
same contributor guide also contains generic setup placeholders instead of the
repository's actual Node, npm, development, validation, and pre-commit
commands. These instructions contradict the validation enforced by CI and
continue the documentation drift removed from agent-facing files by issue #91.

## Acceptance criteria

- [x] A hidden-inclusive repository search outside historical plans finds no
      TDD or coverage instruction that is untrue of this repository.
- [x] `CONTRIBUTING.md` documents the validation commands this project actually
      runs and has no unfilled template placeholder in its setup command
      fences.
- [x] `.github/PULL_REQUEST_TEMPLATE.md` asks authors to report and certify the
      real project validation rather than a TDD or unavailable test workflow.
- [x] Pre-commit hooks pass on the exact changed-file set.

## Implementation steps

1. Replace the TDD- and test-focused pull-request steps in `CONTRIBUTING.md`
   with the repository's actual check, build, production-audit, and pre-commit
   workflow.
2. Replace generic Development Setup placeholders with the real Node.js 22,
   npm install, local-development, validation, and pre-commit commands.
3. Rename and rewrite the contributor validation requirements so they describe
   current checks without implying that an automated test framework exists.
4. Replace the PR template's TDD, test, and example-test checklist items with
   the same reproducible project validation commands and a concise validation
   evidence section.
5. Validate the full changed Markdown files, the repository build, the
   instruction-search invariant, and the exact staged path set.
6. After the PR exists, independently map the live issue to the fetched PR diff
   and fresh validation evidence.

## Files expected to change

- `CONTRIBUTING.md`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `docs/plan/issues/99_align_contributing_validation.md`

Package manifests, source code, workflows, deployment configuration, and live
repository settings are expected to remain unchanged.

## Validation

- Reproduce the original failure with `npm test` and require the baseline to
  report the missing `test` script without changing repository state.
- Run the issue's exact hidden-inclusive search:
  `rg -n -i --hidden --glob '!.git/**' --glob '!docs/plan/**' 'coverage|tdd' .`.
  Require no untrue instruction; classify any opaque lockfile-integrity match
  as non-instruction data rather than editing generated dependency metadata.
- Search both contributor-facing files for the removed test assertions and the
  generic setup placeholders, requiring no match.
- Inspect every Bash or shell fence in each changed Markdown file and validate
  its complete contents with `bash -n`; run ShellCheck on executable command
  fences where the transcript form permits it.
- Run `npm ci`, `npm run check`, `npm run build`, and
  `npm audit --omit=dev`.
- Run `git diff --check` and repository pre-commit hooks against the exact
  staged path set.

## Risks and open questions

- Removing unsupported test claims must not weaken the checks that CI actually
  enforces; all four current validation steps remain explicit.
- Clone/setup examples must use repository-specific commands without pretending
  that every contributor has write access to the upstream repository.
- Adding a test framework for fixture parsing or calendar generation remains a
  separate design choice and is intentionally outside this documentation fix.
- No follow-up issues or deployment were requested. The workflow stops with one
  open PR closing issue #99.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Contributor PR step requires tests before implementation | Implement in this PR | Replace with real project validation steps |
| Testing Requirements makes TDD mandatory | Implement in this PR | Rewrite as current Validation Requirements |
| Contributor guide requires greater than 80 percent coverage | Implement in this PR | Remove unsupported threshold |
| PR checklist asks authors to certify a TDD workflow | Implement in this PR | Replace with project check/build/audit/hook items |
| Other test-focused PR checklist and example items imply a configured suite | Implement in this PR | Align checklist and evidence prompt with available commands |
| Setup fences contain generic prerequisite, install, test, and local-command placeholders | Implement in this PR | Replace with Node.js 22 and real clone/install/dev/validation commands |
| Repository has no `test` script or framework | Validate without a package change | Failure-shaped `npm test` baseline and manifest/config search |
| Use `npm run check`, `npm run build`, `npm audit --omit=dev`, and pre-commit | Implement and validate in this PR | Both contributor files name commands; commands pass locally |
| Hidden-inclusive TDD/coverage search | Validate in this PR | No untrue instruction outside historical plans |
| Pre-commit hooks pass on changed files | Validate in this PR | Exact staged-set hook run |
| Reintroduce test guidance if a framework is added later | Intentionally out of scope | No dependency, script, source, or CI change |
| PR #98 and issues #91/#93/#82 provenance | Validate without a change | Live records confirm the earlier scope and correction precedent |
| Package, application, CI, deploy, and live-setting changes | Intentionally out of scope | Changed-file gate excludes those paths |

## Research validation

**Overall assessment:** Approved after one review iteration.

- Issue #99 was freshly fetched on 2026-08-19 and remains open. Its context,
  affected paths, reproduction, suggested corrections, acceptance criteria,
  references, conditional future-test note, and scope boundaries are all
  represented in Issue traceability.
- The failure is reproducible without repository mutation: `npm test` exits 1
  with `Missing script: "test"`. `package.json` defines no test script, and a
  hidden file/config sweep finds no Vitest, Jest, Playwright, or other test
  setup.
- The CI workflow on `main` uses Node.js 22 and runs `npm ci`,
  `npm run check`, `npm run build`, and `npm audit --omit=dev`. Repository
  guidance also requires `pre-commit run --all-files`; these are therefore the
  concrete contributor checks to document.
- The analogous stale-instruction sweep covered all hidden and visible files
  outside historical plans. Unsupported requirements occur only in
  `CONTRIBUTING.md` and `.github/PULL_REQUEST_TEMPLATE.md`, exactly matching the
  issue. The issue's broad case-insensitive search also matches an opaque
  `package-lock.json` integrity value; that is dependency metadata, not an
  instruction, and must not be edited.
- The two contributor files have been unchanged since the initial template
  commit. Replacing their generic scaffold text is preferable to expanding the
  change into package, source, CI, deploy, or repository-setting work.
- The expected three-file documentation scope is sufficient. Validation covers
  the original failure, corrected instruction search, concrete success paths,
  complete changed-file shell fences, and negative scope.

## Implementation validation

Phase 3.5 found exactly the three planned paths. Package manifests, application
source, workflows, deploy configuration, and live repository settings remain
unchanged.

- The failure-shaped baseline passed as expected: `npm test` exited 1 and
  reported `Missing script: "test"`; the command did not change repository
  state.
- The exact hidden-inclusive `coverage|tdd` search now returns only one opaque
  `package-lock.json` integrity value. No live instruction outside historical
  plans contains an unsupported TDD or coverage statement.
- A focused search of both contributor-facing files returns no generic setup
  placeholder, unavailable test command, TDD/coverage claim, unit/integration
  test requirement, or example test item.
- `CONTRIBUTING.md` now names Node.js 22, `npm install`, `npm run dev`, all three
  CI checks, and the repository pre-commit command. The PR template uses the
  same validation contract and asks for reproducible command/results evidence.
- Complete-file executable-fence validation covered three Bash fences in
  `CONTRIBUTING.md` and zero in the PR template or plan. Every fence passed
  `bash -n` and ShellCheck without placeholder normalization.
- `npm ci` installed 267 packages and reported zero vulnerabilities. It emitted
  an environment-level npm allow-scripts advisory for `esbuild` and `fsevents`
  but no install failure or tracked-file change.
- `npm run check` passed across 19 files with zero errors, warnings, or hints.
- `npm run build` passed and generated six pages plus `fixtures.ics`.
- `npm audit --omit=dev` and `git diff --check` passed.
- All repository pre-commit hooks passed against the exact three-path staged
  set, including the newly tracked plan.

## Branch review

**Classification:** Code-relevant behavior-changing contributor and pull-request
instructions containing executable project commands.

**Review iteration 1:** Approved with no blocking finding.

- The live issue was re-fetched on 2026-08-19 and remains open and unchanged.
  Its complete context, affected paths, suggested corrections, criteria,
  references, future-test condition, and explicit scope remain represented in
  Issue traceability.
- `differential-review` and matching Trail of Bits review skills are unavailable
  in this Codex session. The concrete manual fallback inspected the complete
  diff and changed files, actual package scripts and CI chain, all executable
  fences, setup and validation consistency, shell safety, issue templates,
  referenced contributor resources, and negative file scope.
- The analogous stale-policy sweep covered all hidden and visible repository
  files outside historical plans. Only the generated lockfile-integrity false
  positive remains; no instruction asserts TDD, coverage, `npm test`, or an
  unavailable unit/integration test suite.
- Failure, success, and no-op evidence pass: base-branch `npm test` fails because
  the script is missing; the corrected instruction searches and project checks
  pass; and package, source, CI, deployment, and live settings are unchanged.
- One pre-existing, non-blocking contributor-navigation issue is intentionally
  deferred to the PR body's Follow-up ideas: `CONTRIBUTING.md` links to a
  missing `CODE_OF_CONDUCT.md` and disabled Discussions, while
  `.github/ISSUE_TEMPLATE/config.yml` retains a placeholder Discussions URL.
  Fixing those policies is outside issue #99's validation-instruction scope.

## Post-PR verification

**Implementation head reviewed:**
`493fd7eeeeceae497af28829f03992ffdb4cc1e2`

**Outcome:** Passed independently with no new blocking or non-blocking finding.
The contributor-navigation cleanup remains the single existing follow-up idea
in the PR body.

The local commit, fetched remote branch, and GitHub PR #109 head matched before
the independent review. The plan-only evidence update created after this review
is inspected separately, and the final reviewed PR SHA is stored in the mutable
PR body to avoid a tracked-file/SHA loop.

| Criterion or issue statement | Independent evidence | Result |
| --- | --- | --- |
| No untrue TDD or coverage instruction remains | Fresh issue-command search returned only opaque lockfile integrity metadata | Pass |
| Contributor guide names real validation | Fetched-head content names check, build, production audit, and pre-commit | Pass |
| Development Setup has no generic placeholder | Focused full-file search found no named or analogous setup placeholder | Pass |
| Installation and local commands are real | Fetched-head fences contain `npm install`, hook installation, validation, and `npm run dev` | Pass |
| PR template does not certify TDD | Fresh fetched diff and full-file search found no TDD or unavailable test-suite item | Pass |
| Other test-focused PR items match reality | Template checklist and evidence section use the four project validation commands | Pass |
| Original failure remains understood | Fresh `npm test` run failed only because the manifest has no `test` script | Pass |
| Corrected project behavior succeeds | Fresh npm install, Astro check/build, and production audit all passed | Pass |
| Changed executable fences remain safe | All three Bash fences passed fresh `bash -n` and ShellCheck runs | Pass |
| Pre-commit acceptance criterion passes | All repository hooks passed against the three changed paths | Pass |
| Scope matches the issue | GitHub reports exactly the two contributor files and the plan; code, packages, CI, and deploy are unchanged | Pass |
| Related precedent is valid | PR #98 is merged and issues #91, #93, and #82 are closed | Pass |
| Future test framework remains conditional | No test dependency, script, framework, source, or CI change was introduced | Pass |
| Closing linkage is configured | GitHub resolves the stored `Closes #99` line to issue #99 | Pass |
| Hosted repository checks pass | Assignment and `Check, build, and audit` both passed on the reviewed head | Pass |
| Non-blocking complete-file finding is routed | Missing conduct file and disabled/placeholder Discussions references appear only in Follow-up ideas | Pass |
