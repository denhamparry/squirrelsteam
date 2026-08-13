---
status: Complete
issue: 82
issue_url: https://github.com/denhamparry/squirrelsteam/issues/82
branch: denhamparry.co.uk/fix/gh-issue-082
deploy: no
---

# Plan: Remove inert Claude review configuration

## Problem

The repository carries a 78-line Claude PR-review policy that no workflow or
installed integration consumes. It misleadingly presents automated review,
TDD, and greater-than-80-percent coverage as active project enforcement. Two
setup documents also instruct users to create, customize, verify, and install
that nonexistent automation.

## Acceptance criteria

- [ ] `.github/claude-code-review.yml` is consumed by a real workflow or
      removed.
- [ ] If removed, setup documentation no longer instructs contributors or the
      setup wizard to create, configure, verify, or install it.
- [ ] A hidden-inclusive repository sweep finds no remaining inert automated
      Claude-review configuration or setup instruction.

## Implementation steps

1. Follow the issue's smaller removal option and delete the unconsumed
   `.github/claude-code-review.yml` file.
2. Remove the GitHub-integration checklist, config example, CI automation item,
   and obsolete `/install-github-app` quick-reference entry from `docs/setup.md`.
3. Remove the missed config-customization and GitHub-app installation steps
   from the hidden `.claude/commands/setup-repo.md` wizard, renumber its
   remaining steps, and update its completion summary.
4. Preserve the repository's local `/review` and `/tdd-check` commands and
   general human/manual review guidance; they are executable on demand and are
   not claims of automated PR coverage.
5. Run hidden-inclusive absence checks, full changed-file Markdown shell-fence
   validation, repository regression checks, and exact staged hooks.

## Files expected to change

- `.github/claude-code-review.yml` (deleted)
- `.claude/commands/setup-repo.md`
- `docs/setup.md`
- `docs/plan/issues/82_remove_inert_claude_review_config.md`

No GitHub Actions workflow, local manual review command, application source,
dependency, fixture, test policy, or deployment file is expected to change.

## Validation

- Failure-shaped baseline: assert the default branch contains the review YAML,
  has no `.github/workflows/claude.yml` or other consumer, and contains setup
  instructions in both visible and hidden Markdown.
- Delete the file and use a hidden/unignored-inclusive sweep to assert no
  `claude-code-review`, `/install-github-app`, or automated Claude PR-review
  setup instruction remains outside historical issue plans.
- Enumerate every complete `bash` or `sh` fence in both changed shell-bearing
  Markdown files and run `bash -n` on each complete block, classifying comments
  and placeholder arguments without executing commands.
- Run `npm ci`, `npm run check`, and `npm run build` as repository regression
  checks.
- Run `git diff --check` and repository pre-commit hooks against the exact
  staged file set, including the deletion.

## Risks and open questions

- Removing the file does not uninstall a GitHub App. Live repository evidence
  shows no workflow consumer, and the issue states no automated review runs;
  external organization-level integrations remain outside repository scope.
- Broad TDD/coverage language also exists in contributor and local command
  templates. The removal option does not require rewriting those independent
  policies, so they remain intentionally out of scope.
- Historical completed plans may mention the issue/config for provenance. The
  acceptance sweep distinguishes historical evidence from live configuration
  or setup instructions.
- If automated Claude reviews are wanted later, they should return as a
  separately reviewed workflow/integration with project-accurate expectations.
- No deployment is requested. The workflow stops with an open PR.

## Issue traceability

| Issue item | Disposition | Evidence target |
| --- | --- | --- |
| Review YAML is not consumed by any workflow | Validate then remove | Default-branch consumer sweep and deletion |
| Header claims automated reviews are configured | Remove in this PR | Deleted complete file |
| TDD and greater-than-80-percent assertions are inaccurate in this config | Remove with the inert config | Deleted prompt; no replacement policy claim |
| Commented `paths` template is inert scaffolding | Remove with the complete file | Deleted complete file |
| `docs/setup.md` instructs creating it | Implement in this PR | Removed visible checklist/example |
| Hidden setup wizard also configures and verifies it | Implement discovered required scope | Removed hidden steps and summary claims |
| Choose activate or remove | Choose issue-recommended option 2 | No new workflow or integration |
| Hidden-inclusive sweep finds no inert review config | Validate in this PR | `rg -uuu`/filesystem search excluding historical plans |
| Local manual `/review` and `/tdd-check` commands | Intentionally out of scope | Preserved because they remain directly invocable |
| General contributor TDD/coverage policy | Intentionally out of scope | No edit to `CONTRIBUTING.md` or PR template |
| PR #81 and issue #77 provenance | Validate without a change | Merged template-cleanup precedent |
| Issue #78 relationship | Validate without coupling | Separate open PR #85 handles real CI |
| Application, dependency, workflow, deployment changes | Intentionally out of scope | Changed-file gate |

## Research validation

**Overall assessment:** Approved after one review iteration with one required
scope correction from the hidden-inclusive sweep.

- The live issue was fetched on 2026-08-13 and every context statement,
  affected path, alternative, conditional requirement, acceptance criterion,
  reference, and scope boundary is represented above.
- PR #81 is merged and its cleanup precedent is present on `origin/main`.
- The default branch contains `.github/claude-code-review.yml` but no
  `.github/workflows/claude.yml`, `@claude` trigger, or workflow reference to
  the file. The policy is therefore repository-inert.
- The initial visible-only claim that `docs/setup.md` was the sole reference
  was incomplete. A filesystem and ignored/hidden-inclusive sweep also found
  `.claude/commands/setup-repo.md` customizing, verifying, and installing the
  same automation. Omitting it would fail the explicit hidden-inclusive
  criterion, so the plan adds that required documentation path.
- The same sweep distinguished local on-demand review/TDD commands and general
  contributor policy from automated GitHub review configuration. Removing
  those working/manual surfaces would expand the issue into unrelated project-
  policy cleanup.
- Deletion plus targeted instruction cleanup is smaller and safer than adding
  an external AI workflow, new token permissions, comment triggers, or project-
  inaccurate enforcement. Validation covers the live inert baseline, visible
  and hidden absence, changed shell-bearing documentation, site regressions,
  and negative scope.

## Implementation validation

- Phase 3.5 found exactly the four planned paths: deleted review config, hidden
  setup wizard, visible setup checklist, and this plan. GitHub Actions, local
  review/TDD commands, contributor policy, application source, dependencies,
  fixtures, and deployment configuration are unchanged.
- Failure-shaped baseline assertions confirmed the default branch contains the
  review YAML, no workflow named or referenced a Claude consumer, and both
  visible and hidden setup documents instructed users to configure it.
- The updated hidden/unignored-inclusive sweep excludes only Git internals,
  dependencies, generated output, binary examples, and historical issue plans.
  It found no live `claude-code-review`, `/install-github-app`, automated Claude
  PR-review setup, or automatic-review claim.
- Complete-file shell-fence validation enumerated one Bash fence in
  `.claude/commands/setup-repo.md` and one in `docs/setup.md`; all two passed
  `bash -n` without execution or placeholder rewriting.
- `npm ci` installed 269 packages and reported zero vulnerabilities.
- `npm run check` passed across 19 files with zero errors, warnings, or hints.
- `npm run build` passed and generated six pages plus `fixtures.ics`.
- `git diff --check` passed.

## Branch review

**Classification:** Code-relevant behavior-changing agent command plus setup
documentation and removal of inert GitHub metadata.

**Review iteration 1:** Approved with no blocking or non-blocking finding.

- The live issue was re-fetched on 2026-08-13 and remains open and unchanged.
  Every context statement, affected path, alternative, conditional criterion,
  reference, and scope boundary remains represented in Issue traceability.
- `differential-review` and relevant specialist skills are unavailable in this
  Codex session. The concrete manual fallback inspected the complete diff and
  files, all hidden and visible references, every GitHub workflow, command-step
  numbering and summary consistency, local manual review commands, contributor
  policy boundaries, and every executable shell fence in each changed file.
- Removal is internally complete: the config is gone, setup-repo proceeds from
  pre-commit to custom commands without a numbering gap, and its completion
  summary no longer claims GitHub review automation. The visible setup guide no
  longer offers the app/config/CI automation or quick-reference command.
- No workflow trigger, permission, token, secret, action, dependency, package
  script, application behavior, or deploy path was added. Removing inert data
  cannot disable a repository workflow because no workflow references it.
- The hidden-inclusive analogous sweep found historical mentions only in this
  issue plan. Local `/review` and `/tdd-check` files are explicitly invoked
  commands rather than automated GitHub configuration and remain intentionally
  unchanged.
- Failure, success, and negative/no-op evidence pass: the baseline has a dead
  file and two instruction owners; the branch has none; shell-bearing docs
  remain syntactically valid; site behavior is unchanged.

## Post-PR verification

**Implementation head reviewed:**
`80323bb1f2bb84e54f12fe284d20abfd8eeed3c4`

**Outcome:** Passed independently with no new blocking or non-blocking finding.
The known false-green hosted check remains tracked by issue #78 and open PR #85.

The local commit, fetched remote branch, and GitHub PR head matched before the
review. This plan-only evidence update is inspected separately after push, and
the final reviewed PR SHA is stored in the mutable PR body to avoid a tracked-
file/SHA loop.

| Criterion or issue statement | Independent evidence | Result |
| --- | --- | --- |
| Inert config is removed or activated | Fresh fetched-head object lookup confirmed `.github/claude-code-review.yml` is absent | Pass |
| No GitHub workflow consumer is silently disabled | Complete workflow review found no Claude workflow or config reference on the base or branch | Pass |
| Visible setup no longer creates the config | Fresh `docs/setup.md` inspection and hidden-inclusive search found no config/app/automation instruction | Pass |
| Hidden setup wizard no longer creates or verifies it | Fresh `.claude/commands/setup-repo.md` inspection found no review-config or app step | Pass |
| Wizard remains structurally coherent | Remaining steps are consecutively numbered 1 through 6; completion summary and next steps match them | Pass |
| Hidden-inclusive repository sweep is complete | `rg -uuu` plus filesystem enumeration found matching text only in this historical issue plan | Pass |
| Local on-demand review commands remain | `/review` and `/tdd-check` command files and references are unchanged | Pass |
| Changed shell-bearing documentation stays valid | Fresh complete-file extraction found two Bash fences and both passed `bash -n` | Pass |
| Repository behavior remains compatible | Fresh `npm ci`, check, build, and diff checks passed | Pass |
| PR scope matches the issue | GitHub reports exactly the four planned paths, including the deletion and discovered hidden owner | Pass |
| Closing linkage is configured | GitHub resolves the stored `Closes #82` line to issue #82 | Pass |
| Hosted checks pass | Assignment and the current default-branch placeholder check passed; issue #78/PR #85 replaces the inadequate check | Pass with tracked limitation |
| Deployment remains out of scope | Plan has `deploy: no`; no workflow or live environment changed | Pass |
