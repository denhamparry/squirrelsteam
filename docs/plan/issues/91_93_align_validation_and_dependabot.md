---
status: In Progress
issues:
  - 91
  - 93
issue_urls:
  - https://github.com/denhamparry/squirrelsteam/issues/91
  - https://github.com/denhamparry/squirrelsteam/issues/93
branch: denhamparry.co.uk/docs/gh-issue-091
deploy: no
---

# Plan: Align validation guidance and Dependabot updates

## Problem

The repository's contributor and review instructions require TDD and greater
than 80 percent coverage even though this Astro site has no test script,
framework, or coverage tooling. These unenforceable checks obscure the real CI
requirements: Astro checking, the production build, the production dependency
audit, and pre-commit hooks.

Separately, Dependabot remains able to propose TypeScript 7 even though
`@astrojs/check@0.9.10` accepts only TypeScript 5 or 6. Branch protection stops
such a pull request from merging, but a scoped ignore is needed to prevent the
same predictably failing major update while allowing TypeScript 6 minor and
patch updates.

## Acceptance criteria

### Issue #91

- [x] No repository instruction asserts an unmeasurable coverage threshold.
- [x] `.claude/commands/review.md` describes the checks this project runs.
- [x] TDD references are removed because no test setup backs them.
- [x] A hidden-inclusive search of `.claude/` and `docs/setup.md` finds no stale
      coverage or TDD instruction.
- [x] `npm run check`, `npm run build`, and pre-commit hooks pass.

### Issue #93

- [x] `.github/dependabot.yml` ignores TypeScript major-version updates and
      explains the `@astrojs/check` peer constraint.
- [x] TypeScript minor and patch updates remain eligible.
- [x] No open Dependabot pull request currently proposes TypeScript 7.
- [x] The ignore comment states when the rule can be removed.

## Implementation steps

1. Replace the test-coverage section in `.claude/commands/review.md` with the
   repository's actual validation commands.
2. Remove the unsupported `.claude/commands/tdd-check.md` command and all of
   its references from the setup wizard.
3. Replace stale coverage and TDD setup guidance in `docs/setup.md` with the
   checks enforced by CI and pre-commit.
4. Add a TypeScript semver-major ignore under only the npm Dependabot entry,
   retaining minor and patch updates and documenting the removal condition.
5. Validate the complete changed files, repository build, dependency audit,
   search invariants, and exact staged path set.
6. After the single PR exists, independently map both live issues to the
   fetched PR diff and validation evidence.

## Files expected to change

- `.github/dependabot.yml`
- `.claude/commands/review.md`
- `.claude/commands/setup-repo.md`
- `.claude/commands/tdd-check.md` (delete)
- `docs/setup.md`
- `docs/plan/issues/91_93_align_validation_and_dependabot.md`

`package.json`, `package-lock.json`, application source, CI and deployment
workflows, and live repository settings are expected to remain unchanged.

## Validation

- Record failure-shaped baselines: the stale hidden-instruction search returns
  the coverage and TDD requirements, and the npm Dependabot entry has no ignore
  rule for TypeScript.
- Confirm live npm metadata still reports the `@astrojs/check@0.9.10`
  TypeScript peer range as `^5.0.0 || ^6.0.0`.
- Require `rg -n -i --hidden --glob '!.git/**' 'coverage|tdd' .claude
  docs/setup.md` to return no matches after implementation.
- Assert the Dependabot rule names only `typescript` and only
  `version-update:semver-major`; confirm `package.json` retains TypeScript 6.
- Query open pull requests and require no Dependabot TypeScript 7 proposal.
- Run `npm ci`, `npm run check`, `npm run build`, and
  `npm audit --omit=dev`.
- Parse every executable Bash or shell fence in each changed Markdown file with
  `bash -n`; run ShellCheck where a complete fence represents a directly
  executable script rather than a setup transcript or template.
- Run `git diff --check` and repository pre-commit hooks against the exact
  staged path set.

## Risks and open questions

- Dependabot's major-only ignore must not become a blanket TypeScript ignore;
  the exact `update-types` value preserves minor and patch proposals.
- The ignore is temporary. It should be removed when the installed
  `@astrojs/check` release widens its TypeScript peer range to include v7.
- Removing TDD language does not add or reject future tests. Adding a test
  framework for `src/lib/fixtures.ts` remains explicitly outside this change.
- The user explicitly requested one PR for both issues. The documentation and
  Dependabot changes share the root goal of making repository automation and
  instructions describe enforceable reality.
- No follow-up issues or deployment were requested; the workflow stops with one
  open PR closing both issues.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Review command requires tests-first development and greater than 80 percent coverage | Implement in this PR | Replace the section with the four real project checks |
| Whole `tdd-check` command asserts unsupported workflow | Implement in this PR | Delete the command file |
| Setup wizard advertises `tdd-check` and tests-first next steps | Implement in this PR | Remove the command and replace next steps with project validation |
| Setup guide contains coverage thresholds, reporting, metrics, and TDD | Implement in this PR | Replace with check, build, audit, and pre-commit guidance |
| Choose no-framework option rather than adding Vitest | Implement in this PR | Documentation-only correction; package and CI files unchanged |
| Future tests for fixture-generation logic | Intentionally out of scope | No test dependencies, scripts, or source changes |
| PR #87 and issues #82/#78 provenance | Validate without a change | Existing removal and CI configuration establish the precedent |
| Hidden-inclusive coverage/TDD search | Validate in this PR | Final search returns no stale matches |
| Project commands and hooks pass | Validate in this PR | npm and exact-staged pre-commit results |
| Dependabot npm entry lacks a TypeScript ignore | Implement in this PR | Scoped major-only ignore entry |
| Explain the `@astrojs/check` constraint | Implement in this PR | Adjacent comment names the v5/v6 peer range |
| Preserve TypeScript minor and patch proposals | Validate without a package change | Only `version-update:semver-major` is ignored |
| Remove the ignore after TypeScript 7 becomes compatible | Implement in this PR | Adjacent comment records the removal condition |
| No open TypeScript 7 Dependabot PR | Validate live without a repository change | Open-PR query returns no matching proposal |
| Previous TypeScript 7 failure from PR #83 | Validate without reproduction on the branch | Live peer metadata plus issue/PR #92 provenance |
| Branch protection from issues #88 and #89 | Validate without a change | Existing required CI prevents incompatible updates from merging |
| Application, package, CI, deploy, and live-setting changes | Intentionally out of scope | Changed-file gate excludes those paths |

## Research validation

**Overall assessment:** Approved after one review iteration.

- Both issues were freshly fetched on 2026-08-13 and remain open. The combined
  traceability table accounts for their contexts, affected paths, suggested
  choices, criteria, references, operator condition, and explicit alternative.
- `package.json` has no test script and the repository has no Vitest, Jest, or
  Playwright configuration. Option 1 from issue #91 is therefore the smallest
  correction and follows the removal precedent from issue #82.
- A hidden-inclusive baseline search found all stale coverage/TDD claims only
  in the four paths named by issue #91. The real CI workflow runs `npm ci`,
  `npm run check`, `npm run build`, and `npm audit --omit=dev`; the repository
  also requires pre-commit before commits.
- Live npm registry metadata confirms `@astrojs/check@0.9.10` peer-requires
  TypeScript `^5.0.0 || ^6.0.0`, while `package.json` intentionally retains
  `typescript` `^6.0.3`.
- The npm Dependabot entry has no existing ignore rules. The proposed
  `dependency-name: "typescript"` plus only
  `version-update:semver-major` is narrow enough to keep v6 minor and patch
  updates eligible.
- The open-PR query returned no pull requests, so no existing TypeScript 7
  Dependabot PR needs separate disposition before this configuration change.
- The expected changes are documentation and repository automation metadata.
  Validation covers the original stale-state searches, exact rule shape,
  success paths, negative scope, complete executable fences, and staged hooks.

## Implementation validation

- Phase 3.5 found exactly the six planned paths, including the command deletion
  and new plan. `package.json`, the lockfile, source, workflows, deployment
  files, and live settings are unchanged.
- The hidden-inclusive baseline returned every stale requirement named by issue
  #91. After implementation, the same search over `.claude/` and
  `docs/setup.md` returns no coverage or TDD match.
- `.claude/commands/review.md` now names `npm run check`, `npm run build`, the
  production audit, and changed-file pre-commit hooks. The setup wizard and
  setup guide no longer advertise the removed command or unsupported workflow.
- The Dependabot YAML parses successfully. Its sole npm ignore names
  `typescript` and only `version-update:semver-major`; `package.json` remains at
  TypeScript `^6.0.3` with no test script.
- GitHub's current Dependabot options reference confirms that a major-only
  ignore leaves minor and patch version updates eligible and does not suppress
  security updates. The live open-PR query found no Dependabot TypeScript 7 PR.
- `npm ci` installed 267 packages and reported zero vulnerabilities. It emitted
  an environment-level npm allow-scripts advisory for `esbuild` and `fsevents`,
  but no install failure or tracked-file change.
- `npm run check` passed across 19 files with zero errors, warnings, or hints.
- `npm run build` passed and generated six pages plus `fixtures.ics`.
- `npm audit --omit=dev` and `git diff --check` passed.
- Complete-file executable-fence validation covered zero fences in
  `.claude/commands/review.md`, one in `.claude/commands/setup-repo.md`, three
  in `docs/setup.md`, and zero in this plan. All passed `bash -n`; the two files
  with executable fences also passed ShellCheck without findings.
- Repository pre-commit hooks passed against the exact six-file staged set,
  including the deletion and newly tracked plan.

## Branch review

**Classification:** Code-relevant repository automation metadata and
behavior-changing contributor/agent instructions.

**Review iteration 1:** Approved with no blocking finding.

- Both live issues were re-fetched on 2026-08-13 and remain open. Their full
  contexts, affected paths, suggested alternatives, criteria, references, and
  scope boundaries remain represented in Issue traceability.
- `differential-review` and `supply-chain-risk-auditor` are unavailable in this
  Codex session. The manual fallback inspected the complete diff and affected
  files, dependency-update scope, package peer constraint, CI install/check
  chain, command discoverability, executable fences, and negative file scope.
- The analogous stale-instruction sweep covered all of `.claude/` plus the full
  setup guide. No unsupported coverage or TDD instruction survives there; the
  deleted command has no remaining reference in those live instruction paths.
- The analogous dependency-policy sweep covered every ecosystem and ignore
  entry in `.github/dependabot.yml`. The new rule is confined to the npm root,
  matches only TypeScript, and ignores only semantic-major version updates.
  GitHub Actions updates and all other npm dependency updates remain unchanged.
- Supply-chain behavior is intentionally narrow: current GitHub documentation
  supports the exact `version-update:semver-major` value, while the manifest
  and lockfile retain the known-compatible TypeScript release. Security updates
  remain outside the version-update ignore.
- Failure, success, and no-op evidence pass: the base instructions and missing
  ignore reproduce the drift; corrected searches and build validation pass;
  and package, source, CI, deployment, and live settings remain unchanged.
- A future test framework for `src/lib/fixtures.ts` remains a non-blocking
  follow-up idea from issue #91 rather than an expansion of this combined PR.

## Post-PR verification

Pending.
