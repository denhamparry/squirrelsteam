---
status: In Progress
issue: 77
issue_url: https://github.com/denhamparry/squirrelsteam/issues/77
branch: denhamparry.co.uk/fix/gh-issue-077
deploy: no
---

# Plan: Enable npm updates in Dependabot

## Problem

The repository has an npm manifest and lockfile, but its Dependabot
configuration enables only GitHub Actions updates. The npm block and several
ecosystem blocks inherited from the repository template are commented out, so
dependency version drift is not checked automatically and the configuration
does not accurately describe the ecosystems this project uses.

## Acceptance criteria

- [ ] `.github/dependabot.yml` enables the `npm` ecosystem for `/` on a weekly
      schedule.
- [ ] Unused commented-out ecosystem templates are removed.
- [ ] After the change lands, Dependabot raises at least one npm pull request
      or reports that the npm ecosystem is up to date.

## Implementation steps

1. Remove the template guidance and commented `pip`, `gomod`, and `docker`
   examples from `.github/dependabot.yml`.
2. Enable the existing npm update block for the repository root with a weekly
   schedule and an open pull request limit of 10, alongside the existing
   GitHub Actions block.
3. Parse and assert the complete configuration shape, confirm it maps to the
   repository's only package manifest and lockfile, and run repository checks.
4. Record the post-merge Dependabot activity check as an operator action; it
   cannot execute against an unmerged branch configuration.

## Files expected to change

- `.github/dependabot.yml`
- `docs/plan/issues/77_enable_npm_dependabot.md`

No package manifest, lockfile, workflow, application source, or deployment file
is expected to change.

## Validation

- Failure-shaped baseline: parse `origin/main:.github/dependabot.yml` and
  confirm its only active ecosystem is `github-actions`, despite the root
  `package.json` and `package-lock.json`.
- Parse the updated YAML and assert `version: 2`, exactly two unique update
  entries (`github-actions` and `npm`), root directory `/`, weekly intervals,
  and open pull request limits of 10.
- Confirm no commented template ecosystem or uncommenting instruction remains.
- Confirm the repository has one npm manifest and lockfile at `/` and no live
  Python, Go, or Docker dependency definition requiring another ecosystem.
- Run `npm ci`, `npm run check`, and `npm run build` as regression checks.
- Run `git diff --check`.
- Run repository pre-commit hooks against the exact staged file set.
- Post-merge operator check: inspect Dependabot update activity and confirm an
  npm update job reports success/up-to-date or creates at least one npm PR.

## Risks and open questions

- The first npm update run may open several PRs. The configured limit of 10 is
  intentional and matches the existing GitHub Actions policy.
- GitHub evaluates `.github/dependabot.yml` only from the default branch, so
  live Dependabot activity is a post-merge acceptance check rather than a
  pre-merge validation gate.
- The existing auto-assignment workflow applies to opened pull requests and is
  expected to assign bot-created PRs; it does not need a change here.
- No private registry or credential configuration is required because the
  current lockfile uses the public npm registry.
- No deployment is requested. The workflow stops with an open PR.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| npm updates are currently commented out while GitHub Actions updates are active | Implement in this PR | Before/after parsed ecosystem assertions |
| Future npm dependency drift and advisories otherwise rely on ad-hoc manual audits | Implement the automation fix | Active root npm update block |
| Enable `npm` for `/` | Implement in this PR | Parsed `package-ecosystem` and `directory` values |
| Run npm updates weekly | Implement in this PR | Parsed `schedule.interval` value |
| Keep `open-pull-requests-limit: 10` | Implement the suggested configuration | Parsed integer value |
| Remove unused commented `pip`, `gomod`, and `docker` templates | Implement in this PR | Complete-file search and minimal config diff |
| Expect an initial burst of update PRs | Validate as an understood operational effect | Limit remains 10; first-run outcome is checked after merge |
| Existing `auto-assign-prs.yml` handles bot pull requests | Validate without a change | Workflow trigger and assignment step inspection |
| Dependabot raises an npm PR or reports up to date | Post-merge operator action | Default-branch Dependabot update activity after merge |
| PR #76 and issue #74 provenance | Validate without a change | Merged PR and closed issue establish the manually discovered advisory context |
| GHSA-2v37-7h3g-55p8 reference | Validate without a change | GitHub-reviewed advisory and completed issue #74 repair |
| Package or application changes | Intentionally out of scope | `package.json`, `package-lock.json`, and `src/` remain unchanged |
| Python, Go, and Docker update automation | Not applicable | No matching live dependency definition exists in the repository |
| Deployment | Intentionally out of scope | `deploy: no` and open-PR handoff |

## Research validation

**Overall assessment:** Approved after one review iteration.

- The live issue was fetched on 2026-08-13 and every context statement,
  affected path, failure detail, suggested configuration, acceptance criterion,
  reference, operational action, and explicit scope boundary is represented in
  Issue traceability.
- The failure-shaped baseline passed: parsing
  `origin/main:.github/dependabot.yml` found `version: 2` but only one active
  update ecosystem, `github-actions`, while the repository root contains both
  `package.json` and `package-lock.json`.
- Current GitHub Dependabot documentation confirms that each monitored package
  manager needs a `package-ecosystem` entry, `npm` is the correct YAML value,
  `directory: "/"` targets the root manifest, `weekly` is a supported required
  interval, and `open-pull-requests-limit` accepts the intended integer value.
- The analogous ecosystem/configuration sweep covered all hidden and visible
  repository paths. It found one Dependabot configuration, one root npm
  manifest/lockfile pair, and no Python, Go, Docker, alternate npm-root, or
  second Dependabot configuration requiring current scope or a follow-up.
- The suggested edit is the smallest complete fix: enable the already drafted
  npm block and remove inert template comments without modifying dependency
  versions, workflow behavior, application code, or deployment configuration.
- The existing `pull_request_target: opened` auto-assignment workflow always
  runs its assignment step and requests review when the PR author is not
  `denhamparry`, which includes bot-created Dependabot PRs. No workflow change
  is required.
- Validation covers the original inactive state, the corrected exact config
  shape, the unused-ecosystem negative path, npm project ownership, repository
  regression gates, and the unavoidable post-merge activity check. GitHub only
  evaluates the default-branch configuration, so the last acceptance criterion
  cannot safely be simulated on this branch.

## Implementation validation

- Phase 3.5 found exactly the two planned paths:
  `.github/dependabot.yml` and this plan. No package, lockfile, workflow,
  application source, or deployment path changed.
- The failure-shaped baseline parsed the default-branch configuration and
  found only `github-actions` active while root npm definition files exist.
- The updated complete file parses as Dependabot version 2 with exactly two
  unique ecosystems in order: `github-actions` and `npm`. Both use root
  directory `/`, a weekly interval, and an open pull request limit of 10.
- The complete-file negative assertion found no uncommenting instruction or
  `pip`, `gomod`, or `docker` ecosystem template remaining.
- The repository ecosystem sweep found one root `package.json` and
  `package-lock.json`, with no alternative package-manager root or unused
  ecosystem definition.
- `npm ci` installed 269 packages and completed with zero vulnerabilities.
- `npm run check` passed across 19 files with zero errors, warnings, or hints.
- `npm run build` passed and generated all six static pages plus the calendar
  feed.
- `git diff --check` passed.
- Repository pre-commit hooks passed against the exact two-file staged set,
  including YAML syntax, Markdown lint, and gitleaks.

## Branch review

**Classification:** Code-relevant supply-chain automation configuration because
the change enables GitHub to open dependency-update pull requests for the npm
manifest and lockfile.

**Review iteration 1:** Approved with no blocking finding and one already
tracked non-blocking follow-up.

- The live issue was re-fetched on 2026-08-13 and remains open and unchanged.
  Every context statement, affected path, failure detail, recommendation,
  acceptance criterion, reference, operator action, and scope boundary remains
  covered by Issue traceability.
- Phase 3.5 found exactly the two planned paths. Package definitions, lockfile,
  application source, GitHub workflows, and deployment configuration are
  unchanged.
- `differential-review` and `supply-chain-risk-auditor` are unavailable in this
  Codex session. The concrete manual fallback inspected the complete diff and
  files, strict parsed config shape, current GitHub option requirements,
  package-manager ownership, analogous ecosystem definitions, public-registry
  boundary, PR-triggered workflow chain, workflow permissions, deployment
  trigger, and post-merge operator behavior.
- The enabled block is limited to GitHub's supported `npm` ecosystem at the
  root manifest location, runs weekly, and caps version-update pull requests at
  10. It adds no registry credential, executable code, ignore rule, alternate
  target branch, or elevated workflow permission.
- New Dependabot pull requests will trigger the existing auto-assignment
  workflow. That workflow does not check out or execute PR content; its token
  permissions are limited to issue and pull-request writes. The deploy workflow
  runs only on pushes to `main` or manual dispatch, not on a Dependabot PR.
- The final analogous-pattern sweep again found one Dependabot config and one
  root npm manifest/lockfile pair, with no Python, Go, Docker, or alternate npm
  root requiring current scope or another follow-up.
- Failure, success, and negative/control evidence all pass: the baseline has
  only GitHub Actions active; the updated exact object adds npm; unused template
  ecosystems are absent; package, lockfile, workflow, and source files remain
  unchanged.
- The changed Markdown plan contains no Bash or shell fence, so executable
  fence validation is not applicable.
- Non-blocking follow-up: pull requests currently receive only the placeholder
  CI check, so automated npm update PRs will not run check, build, or audit
  validation. Existing issue #78 already tracks replacing that placeholder;
  no new follow-up issue is needed.

## Post-PR verification

Pending.
