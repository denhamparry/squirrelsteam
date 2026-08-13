---
status: In Progress
issue: 78
issue_url: https://github.com/denhamparry/squirrelsteam/issues/78
branch: denhamparry.co.uk/fix/gh-issue-078
deploy: no
---

# Plan: Replace the CI placeholder

## Problem

The pull-request CI workflow reports success after only printing a template
message. It does not install the locked dependencies, type-check the Astro site,
build the production output, or audit production dependencies, so a broken or
vulnerable change can retain an all-green check rollup.

## Acceptance criteria

- [ ] Pull requests targeting `main` run `npm ci`, `npm run check`, and
      `npm run build`.
- [ ] CI runs a production dependency audit with deliberately documented
      blocking or advisory behavior.
- [ ] The `CI Placeholder` job and all commented template jobs are removed.
- [ ] A failing production build makes the CI job fail.

## Implementation steps

1. Replace the template body of `.github/workflows/ci.yml` with one least-
   privilege validation job for pushes and pull requests targeting `main`.
2. Check out the exact triggering revision and install Node 22 with npm caching,
   using immutable commit pins for the official checkout and setup actions.
3. Run the lockfile install, Astro check, production build, and production-only
   audit as separate named steps.
4. Keep the audit blocking. The repository currently has zero production
   vulnerabilities, and a production advisory should prevent an unreviewed
   vulnerable resolution from merging; the workflow comment records that
   deliberate policy.
5. Validate the complete workflow shape, simulate a failing build command,
   run repository checks and hooks, and confirm the hosted PR job succeeds.

## Files expected to change

- `.github/workflows/ci.yml`
- `docs/plan/issues/78_replace_ci_placeholder.md`

No application source, fixture content, dependency manifest, lockfile,
deployment workflow, or branch-protection setting is expected to change.

## Validation

- Failure-shaped baseline: parse `origin/main:.github/workflows/ci.yml` and
  assert its only live job is `placeholder`, with no npm validation command.
- Parse the updated complete workflow and assert the `pull_request` target,
  read-only contents permission, exact job steps, Node 22 configuration, npm
  cache dependency path, and absence of placeholder/template content.
- Verify both action pins resolve to the documented official release commits.
- Run `npm ci`, `npm run check`, `npm run build`, and
  `npm audit --omit=dev` from the branch.
- Run a temporary-package failure probe whose `build` script exits nonzero and
  confirm the same `npm run build` command returns nonzero without a
  `continue-on-error` escape hatch.
- Run `git diff --check` and repository pre-commit hooks against the exact
  staged file set.
- After the PR exists, verify the new hosted CI job runs successfully and the
  obsolete `CI Placeholder` check is absent.
- Post-merge operator action: replace the old required status check with the
  new CI job in `main` branch protection if branch protection is configured.

## Risks and open questions

- A new production advisory will block unrelated pull requests until the
  lockfile is repaired. That is intentional because the audit omits
  development-only packages and protects deployable dependencies.
- npm caching is performance-only; `npm ci` remains the reproducibility gate
  and continues to install strictly from `package-lock.json`.
- The workflow uses only `contents: read` and does not expose write permissions,
  secrets, deployment credentials, or `pull_request_target` execution.
- Branch protection is repository administration outside the reviewable file
  change. The workflow can create the new check, but making it required remains
  a post-merge operator action.
- No deployment is requested. The workflow stops with an open PR.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Placeholder is the only live CI job | Implement in this PR | Before/after complete-workflow assertions |
| Commented lint, test, and build templates remain | Implement in this PR | Complete-file negative search |
| Run `npm ci` on pull requests to `main` | Implement in this PR | Trigger and named install step |
| Run `npm run check` | Implement in this PR | Named type-check step and hosted log |
| Run `npm run build` | Implement in this PR | Named build step and hosted log |
| Run `npm audit --omit=dev` | Implement in this PR | Blocking audit step and policy comment |
| Choose audit blocking versus advisory deliberately | Implement blocking behavior | No `continue-on-error`; documented rationale |
| A broken build fails CI | Validate failure-shaped behavior | Nonzero temporary build probe plus default Actions step semantics |
| Replace `CI Placeholder` required check | Post-merge operator action | Branch-protection settings after merge |
| PR #76 and issue #74 provenance | Validate without a change | Existing lockfile repair and manual validation context |
| Application or dependency changes | Intentionally out of scope | `src/`, `package.json`, and lockfile remain unchanged |
| Deployment | Intentionally out of scope | `deploy: no`; deploy workflow remains unchanged |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue was fetched on 2026-08-13 and every context statement,
  affected path, failure scenario, recommendation, acceptance criterion,
  reference, operator action, and scope boundary is represented above.
- The failure-shaped baseline confirmed that the default-branch workflow has
  exactly one live job named `placeholder`, and the complete active workflow
  contains no npm install, check, build, or audit command.
- The repository documents Node 22+ and uses Node 22 for the existing Pages
  build, so CI will use the same supported runtime rather than introduce a
  second version policy.
- GitHub's live release metadata on 2026-08-13 identifies
  `actions/checkout` v7.0.1 at
  `3d3c42e5aac5ba805825da76410c181273ba90b1` and `actions/setup-node`
  v7.0.0 at `820762786026740c76f36085b0efc47a31fe5020`. Full commit pins avoid
  mutable tag resolution while comments preserve Dependabot readability.
- npm 11 documents `--audit-level` as the threshold controlling a nonzero
  audit exit. The default production-only audit is intentionally blocking;
  the current lockfile reports zero production vulnerabilities.
- The analogous workflow sweep covered every file under `.github/workflows`.
  `deploy.yml` builds only after pushes to `main` or manual dispatch, and
  `auto-assign-prs.yml` performs assignment only; neither supplies pull-request
  check/build/audit coverage or should be expanded into this focused fix.
- The planned permissions, trigger, checkout, cache, and shell model avoid
  write tokens, fork-secret dependencies, untrusted expression interpolation,
  and deployment side effects. Validation covers the original false-green
  state, corrected success path, build-failure path, and negative scope checks.

## Implementation validation

- Phase 3.5 found exactly the two planned paths: `.github/workflows/ci.yml`
  and this plan. `package.json`, `package-lock.json`, application source,
  fixture content, deployment configuration, and repository settings are
  unchanged.
- The default-branch failure baseline has exactly one live job,
  `placeholder`, and no install, check, audit, or active build command.
- Complete-file workflow assertions passed for the `main` pull-request target,
  read-only contents permission, single validation job, Node 22 setup, npm
  cache ownership, exact command sequence, blocking audit, and removal of all
  placeholder/template content.
- Live GitHub API resolution matched both immutable official action pins to
  their documented v7.0.1 and v7.0.0 release commits.
- A temporary isolated package whose `build` script exits 23 caused
  `npm run build` to return nonzero. The workflow has no job- or step-level
  `continue-on-error`, so the same failure stops the hosted job.
- `npm ci` installed 269 packages and reported zero vulnerabilities.
- `npm run check` passed across 19 files with zero errors, warnings, or hints.
- `npm run build` passed and generated all six static pages plus the calendar
  feed.
- `npm audit --omit=dev` passed with zero production vulnerabilities.
- `git diff --check` passed.

## Branch review

**Classification:** Code-relevant GitHub Actions and supply-chain configuration.

**Review iteration 1:** Approved with no blocking finding and one non-blocking
follow-up idea.

- The live issue was re-fetched on 2026-08-13 and remains open and unchanged.
  Every issue statement remains represented in Issue traceability.
- `differential-review`, `agentic-actions-auditor`, and
  `supply-chain-risk-auditor` are unavailable in this Codex session. The manual
  fallback inspected the complete diff and all workflow files, package scripts,
  action releases and pins, event triggers, checkout revision semantics, token
  scopes, fork behavior, expression and shell handling, cache ownership,
  dependency install behavior, audit exit behavior, and deploy separation.
- Pull requests execute the submitted head revision with only `contents: read`.
  The job does not use `pull_request_target`, repository secrets, write tokens,
  user-controlled expressions in shell commands, deployment permissions, or
  mutable action tags.
- Both external actions are official GitHub actions pinned to full release
  commit SHAs. `setup-node` caches npm's download cache only; `npm ci` still
  rejects manifest/lockfile disagreement and creates the dependency tree from
  the committed lockfile.
- The four direct commands all use package scripts or npm behavior already
  documented and exercised locally. Build and audit failures remain blocking
  under default shell and Actions semantics.
- The analogous workflow sweep found no second pull-request validation job.
  `deploy.yml` runs only on default-branch pushes or manual dispatch, while
  `auto-assign-prs.yml` does not check out or execute pull-request code.
- Failure, success, and negative/no-op evidence pass: the old workflow is
  false-green; the new workflow validates a clean branch; a nonzero build
  propagates; placeholder text, write permissions, secrets, and deployment
  behavior are absent.
- The changed plan contains no executable Bash or shell fence, so complete-file
  shell-fence validation is not applicable.
- Non-blocking follow-up idea: the unchanged Pages deployment workflow still
  uses mutable major-version action tags. Pinning its checkout, Astro, and
  deploy actions to immutable commits would apply the same supply-chain policy
  consistently, but is outside issue #78's pull-request CI scope.
