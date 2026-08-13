---
status: Reviewed (Approved)
issues:
  - 88
  - 89
issue_urls:
  - https://github.com/denhamparry/squirrelsteam/issues/88
  - https://github.com/denhamparry/squirrelsteam/issues/89
branch: denhamparry.co.uk/fix/gh-issue-088
deploy: no
---

# Plan: Pin the deploy workflow and protect main

## Problem

The Pages deployment workflow runs three third-party actions through mutable
major-version tags despite holding `pages: write` and `id-token: write`. At the
same time, `main` has no branch protection, so the real CI job introduced by
issue #78 is advisory and broken or unreviewed commits can reach production.

The failure scenario is now concrete rather than hypothetical: Dependabot pull
request #83 upgraded TypeScript beyond `@astrojs/check`'s peer range and merged
without protection. Both the CI and deploy runs on the two newest `main`
commits fail during `npm ci`. The shared fix must restore a passable required
check before making that check mandatory.

## Acceptance criteria

### Issue #88

- [x] All three `uses:` references in `.github/workflows/deploy.yml` are pinned
      to 40-character commit SHAs with version comments.
- [x] Each SHA matches the release currently selected by the corresponding
      mutable major tag.
- [x] No GitHub workflow contains a `uses:` reference to a mutable `vN` tag.
- [ ] The pinned deployment workflow completes successfully.

### Issue #89

- [x] The `main` branch-protection endpoint returns a protection object.
- [x] `Check, build, and audit` is the sole required status check and branches
      must be current before merge.
- [x] A pull request is required, including for administrators, and direct
      pushes, force pushes, and branch deletion are blocked.
- [x] A pull request with a failing required CI check cannot merge through the
      normal flow.
- [x] The exact restorable settings are recorded in `docs/setup.md`.

### Required supporting repair

- [x] Restore TypeScript to the newest release accepted by
      `@astrojs/check@0.9.10` so `npm ci` and the newly required CI check pass.

## Implementation steps

1. Replace the three deployment action tags with the exact commits currently
   selected by `v7`, `v6`, and `v5`, retaining resolved release versions in
   trailing comments.
2. Change TypeScript from incompatible v7.0.2 to compatible v6.0.3 and refresh
   the lockfile without changing unrelated packages.
3. Add a repository-specific branch-protection section to `docs/setup.md` with
   the exact API payload and read-back command.
4. Apply that payload to `main`: strict required CI, pull-request-only changes,
   administrator enforcement, and force-push/deletion denial.
5. Validate the workflow pins, dependency compatibility, site checks, exact
   protection response, complete Markdown shell fences, and staged hooks.
6. After the PR exists, independently compare both live issues with the diff,
   operator setting, hosted CI result, and closing linkage.

## Files expected to change

- `.github/workflows/deploy.yml`
- `package.json`
- `package-lock.json`
- `docs/setup.md`
- `docs/plan/issues/88_89_harden_deploy_and_main.md`

The `main` branch-protection setting is an intentional live repository change.
No application source, fixture, CI workflow, Dependabot configuration, Pages
environment, custom domain, or deployed site content is expected to change.

## Validation

- Failure-shaped baselines: confirm the base deployment workflow has three
  mutable action tags; branch protection returns HTTP 404; and `npm ci` fails
  because TypeScript v7 is outside `@astrojs/check`'s declared peer range.
- Resolve each major tag and release tag through the upstream GitHub API,
  require commit objects, and compare them with the complete pinned workflow.
- Require `rg -n "uses: .*@v[0-9]" .github/workflows/` to return no matches and
  assert every external `uses:` reference contains a 40-character SHA.
- Run `npm ci`, `npm run check`, `npm run build`, and `npm audit --omit=dev`.
- Parse the branch-protection response and assert strict required status checks,
  exactly `Check, build, and audit`, pull-request enforcement for admins, and
  disabled force pushes and deletions.
- Validate every Bash or shell fence in the complete changed `docs/setup.md`
  with `bash -n` without executing it.
- Run `git diff --check` and repository pre-commit hooks against the exact
  staged path set.
- Verify hosted `Check, build, and audit` passes on the PR. The protected
  required-check response supplies deterministic evidence that a failed or
  missing result blocks normal merge.
- Post-merge operator check: confirm the automatic Pages run succeeds on the
  merged pinned workflow. No manual deployment is authorized by this plan.

## Risks and open questions

- Branch protection is an immediate repository-level change. Requiring pull
  requests with zero approving reviews blocks direct pushes without making a
  sole-maintainer repository impossible to merge; required CI and up-to-date
  branches still gate every merge.
- `enforce_admins: true` is necessary so the repository owner does not bypass
  the same direct-push and required-check rules.
- TypeScript v6.0.3 is the newest stable release within
  `@astrojs/check@0.9.10`'s declared `^5.0.0 || ^6.0.0` peer range. This is a
  minimal repair of the current default-branch failure, not a general
  dependency update.
- A deployment run executes only from `main` pushes or manual dispatch. The
  skill does not authorize deploying from the open PR, so the hosted deployment
  criterion remains a post-merge operator check; local build and workflow
  validation cover the pre-merge path.
- No separate follow-up issues or deployment are requested. The workflow stops
  with one open PR closing both issues.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| `deploy.yml` uses three mutable major tags | Implement in this PR | Three full-SHA references with release comments |
| Deployment token can publish Pages and mint OIDC | Validate without expanding permissions | Complete workflow permission and trigger review |
| Pin checkout, Astro, and deploy actions | Implement in this PR | Upstream tag-to-commit assertions |
| Dependabot keeps pinned GitHub Actions current | Validate without a change | Existing `.github/dependabot.yml` ecosystem entry |
| No workflow retains `@vN` | Validate in this PR | Hidden workflow-wide negative search |
| Pinned deployment succeeds | Post-merge operator action | Automatic deploy run for merged `main` commit |
| `main` currently has no protection | Implement as live repository setting | Protection endpoint changes from 404 to exact object |
| Require `Check, build, and audit` | Implement as live repository setting | Strict required-status-check response |
| Block direct pushes | Implement as live repository setting | Required pull request plus admin enforcement |
| Block force pushes and deletion | Implement as live repository setting | Both response fields are disabled |
| A failing CI PR cannot merge normally | Validate protection semantics | Required-check and pull-request rules plus hosted PR check |
| Do not require `Assign PR to denhamparry` | Implement by omission | Required contexts contain only the CI job |
| Only require checks that run on every PR | Validate without a workflow change | `ci.yml` has an unconditional `pull_request` trigger for `main` |
| Record settings for restoration | Implement in this PR | Exact payload and verification in `docs/setup.md` |
| Dependabot failure scenario | Repair required prerequisite | TypeScript v6.0.3 manifest/lockfile and passing `npm ci` |
| PRs #85 and issues #77/#78 provenance | Validate without a change | Existing CI and Dependabot configuration |
| Application or deployed-content changes | Intentionally out of scope | Changed-file gate excludes `src/`, fixtures, and public assets |
| Manual deployment | Intentionally out of scope | `deploy: no`; automatic post-merge run only |

## Research validation

**Overall assessment:** Approved after one review iteration with one required
scope correction for the already-broken default branch.

- Both live issues were fetched on 2026-08-13 and remain open. Every context
  statement, affected path, failure scenario, recommendation, criterion,
  reference, operator action, and scope boundary is represented above.
- The branch-protection endpoint returned HTTP 404, and no ruleset or open pull
  request currently supplies an alternative enforcement path.
- Upstream refs resolve directly to commit objects. `actions/checkout` `v7` and
  `v7.0.1` both resolve to
  `3d3c42e5aac5ba805825da76410c181273ba90b1`; `withastro/action` `v6` and
  `v6.1.2` both resolve to
  `e84f40bd8d2caa9e768ec82ad30dd81f0b280853`; and
  `actions/deploy-pages` `v5` and `v5.0.0` both resolve to
  `cd2ce8fcbc39b97be8ca5fce6e763baed58fa128`.
- The analogous workflow sweep covered every file under `.github/workflows`.
  The three deploy references are the only remaining mutable action tags; the
  two CI actions are already pinned, and the auto-assignment workflow uses
  direct `curl` commands rather than an external action.
- The two newest CI and deployment runs on `main` fail at `npm ci` after PR #83
  changed TypeScript to v7.0.2. Live npm metadata confirms
  `@astrojs/check@0.9.10` accepts TypeScript v5 or v6, and v6.0.3 is the newest
  compatible v6 release. Without the supporting downgrade, making CI required
  would knowingly leave this PR and subsequent work blocked.
- The protection payload is deliberately minimal: strict CI, a required pull
  request with zero approvals, administrator enforcement, and explicit denial
  of force pushes and deletion. It does not require the conditional assignment
  automation, reviews the sole maintainer cannot self-supply, signed commits,
  linear history, or unrelated conversation policies.
- Validation covers the three observed failures, corrected workflow and package
  paths, negative/no-op workflow scope, live setting response, hosted PR CI,
  and the unavoidable post-merge deployment check.

## Implementation validation

- Phase 3.5 found exactly the five planned repository paths. No application
  source, fixture, CI workflow, Dependabot setting, environment, or deployed
  content changed.
- The failure baselines are recorded from fresh evidence: the base workflow had
  three mutable tags, the protection endpoint returned 404, and the two newest
  `main` CI and deploy runs failed at `npm ci` because TypeScript v7.0.2 did not
  satisfy `@astrojs/check@0.9.10`.
- All five external action references across all workflows are now pinned to
  40-character SHAs, and the workflow-wide mutable-tag search returns no match.
  Upstream GitHub API checks matched each deploy pin to both its major tag and
  exact release tag; all three commits have verified upstream signatures.
- The first live protection request was rejected without changing the setting
  because GitHub's current schema makes legacy `contexts` and app-bound
  `checks` mutually exclusive. The documented payload was corrected to the
  stronger app-bound form and then applied successfully.
- REST and GraphQL read-back checks pass: `main` requires the GitHub Actions
  `Check, build, and audit` context from app ID 15368, strict/up-to-date status,
  pull requests with zero approvals, and administrator enforcement. Force
  pushes and deletion are disabled. GraphQL independently reports
  `requiresApprovingReviews`, `requiresStatusChecks`, and
  `requiresStrictStatusChecks` as true.
- The complete changed `docs/setup.md` contains three Bash fences. Each passed
  an independent `bash -n` parse without execution or placeholder rewriting;
  the documented JSON payload itself produced the verified live setting.
- `npm ci` installed 267 packages and reported zero vulnerabilities.
  `npm ls` resolved both the root and Astro peer to TypeScript v6.0.3.
- `npm run check` passed across 19 files with zero errors, warnings, or hints.
- `npm run build` passed and generated six pages plus `fixtures.ics`.
- `npm audit --omit=dev` and `git diff --check` passed.
- Repository pre-commit hooks passed against the exact five-file staged set,
  including YAML syntax, Markdown lint, gitleaks, and file-quality checks.

## Branch review

**Classification:** Code-relevant GitHub Actions, repository-enforcement, and
supply-chain configuration with a supporting dependency repair.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- Both live issues were re-fetched on 2026-08-13 and remain open and unchanged.
  Every issue statement remains represented in Issue traceability.
- `differential-review`, `agentic-actions-auditor`, and
  `supply-chain-risk-auditor` are unavailable in this Codex session. The manual
  fallback inspected the complete diff and files, all workflow triggers and
  permissions, checkout semantics, action ownership and commit verification,
  token scopes, branch and manual-dispatch behavior, required-check ownership,
  administrator bypass behavior, direct/force-push and deletion controls,
  package peer constraints, lockfile delta, and complete documentation command.
- Pinning preserves the exact commits selected by the former tags, so it changes
  provenance mutability without changing checkout, Astro build, artifact, or
  deployment behavior. The write/OIDC permissions remain scoped to the deploy
  workflow, which still runs only on `main` pushes or explicit dispatch.
- The analogous workflow sweep covered all three workflow files. The CI's two
  external actions were already immutable; the assignment workflow has no
  external action; and no mutable `uses:` reference remains.
- The required status check is bound to GitHub Actions app ID 15368, runs
  unconditionally for pull requests to `main`, and is the only required
  context. The conditional assignment convenience check is correctly omitted.
- Requiring a pull request with zero approvals is internally consistent for a
  sole maintainer: GraphQL confirms the pull-request rule itself is active,
  while CI, strict branch currency, and administrator enforcement provide the
  merge gate without requiring an impossible self-approval.
- The dependency delta changes only TypeScript v7.0.2 to v6.0.3 and removes
  v7-specific optional platform packages. The result satisfies Astro's peer
  range, installs reproducibly, and passes check, build, and audit validation.
- Failure, success, and negative/no-op evidence pass: the unprotected broken
  base state is captured; install and all repository checks are corrected;
  missing or failing required CI cannot merge normally; unrelated workflows,
  application content, Pages settings, and deployed output remain unchanged.

## Post-PR verification

Pending.
