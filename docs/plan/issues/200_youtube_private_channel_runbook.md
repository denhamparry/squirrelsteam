---
status: Complete
issue: 200
issue_url: https://github.com/denhamparry/squirrelsteam/issues/200
branch: denhamparry.co.uk/docs/gh-issue-200
deploy: no
---

# Plan: Document restricted YouTube viewing

## Problem and outcome

Extend `docs/youtube.md` into the operator runbook for
[@RhiwbinaSquirrels1415](https://www.youtube.com/@RhiwbinaSquirrels1415).
Match, training, and highlight videos must use YouTube's Private visibility and
be shared only with the approved Google accounts recorded by team admins. The
runbook must also make the safeguarding, administrator-access, and Veo live
stream boundaries explicit without storing any family account, player, or
consent data in Git.

Issue #200 and its empty discussion were fetched at
2026-09-16T15:36:13+01:00. The profile, watermark, and banner work from related
issues #201 and #202 is already on `main`, so its detailed `Channel images`
section must remain intact. The repository documentation is sufficient to
close #200; every YouTube Studio, Google account, consent, and Veo action is an
explicitly non-blocking operator task after merge.

## Implementation

1. Add the current channel name, handle, canonical channel URL, approved
   public profile fields, and draft channel description.
2. Document Private plus Share privately as the access model, including its
   per-video nature, exact-account sign-in requirement, lack of comments and
   public discovery, and why paid memberships and Unlisted visibility fail the
   requirement.
3. Add procedures for maintaining the approved-account list outside the
   repository, checking the recipient limit in Studio, adding an account to
   every applicable video, and removing access from every previously shared
   video.
4. Add pre-upload safeguarding and consent gates plus a per-video checklist
   for visibility, sharing, audience, neutral metadata, and post-save checks.
5. Document the Veo Cam 2/3 and Live add-on prerequisites, current rugby
   support caveat, YouTube enablement, exact-event binding with a unique stream
   key, a private test with an invited signed-in account, adult presence,
   disabled chat, and a fail-closed local-recording fallback if invited live
   viewing is not demonstrated.
6. Document club-controlled ownership, two-step verification, least-privilege
   Studio permissions, and an operator setup checklist that is not required to
   merge or close the issue.
7. Preserve the complete channel-image contracts, recipes, and validation
   guidance already present below the new runbook.

## Files expected to change

- `docs/youtube.md`
- `docs/plan/issues/200_youtube_private_channel_runbook.md`

The website, YouTube channel, Google accounts, Veo configuration, approved
account list, consent records, images, deployment, merge, and issue closure are
out of scope.

## Validation

- Validate that all eight repository deliverables have explicit headings or
  procedures and that all operational claims link to official YouTube or Veo
  guidance.
- Require the channel identity values, both URLs, Private access model,
  per-video sharing rule, external-record rule, removal procedure, upload
  checklist, private-live test, consent gate, permissions model, and existing
  Channel images section.
- Confirm that the recipient figure is described as a legacy published limit
  that must be checked in the current Studio UI, with a stop-and-escalate rule
  if the approved list exceeds the displayed limit.
- Run the same content validator against the `origin/main` version and require
  that incomplete baseline to fail before accepting the changed document.
- Search the complete changed documentation for email addresses and require
  that the only address is `contact@squirrels.team`; inspect the diff for any
  player name, family data, consent record, secret, or credential.
- Run `npm ci`, `npm run check`, `npm run build`, `npm audit --omit=dev`,
  `git diff --check`, targeted pre-commit hooks, and the final staged
  `pre-commit run --all-files` gate.

## Risks and evidence provenance

- **Documented:** YouTube Help defines Private and Unlisted visibility,
  per-video private sharing, channel permissions, made-for-kids decisions,
  safeguarding practices, and paid membership eligibility. Veo documents the
  supported cameras, add-on, YouTube enablement, and app workflow.
- **Observed:** `docs/youtube.md` contains the merged image guidance but none of
  the restricted-viewing runbook. The issue snapshot records the current
  channel identity and empty public profile fields as of 2026-09-16.
- **Operator-dependent:** the current main privacy article does not publish a
  numeric recipient limit, while an older official YouTube migration article
  says 50. Studio's displayed limit controls, and the operator must stop rather
  than omit approved families if the list exceeds it.
- **Operator-dependent:** YouTube documents Private live visibility but does
  not clearly promise that Veo live streams support the same invited-account
  flow as uploaded private videos. Veo also lists live streaming as officially
  supported for football but not rugby. A successful exact-event, unique-key
  private test is a prerequisite; failure means no live match or training
  stream.
- **Authorization boundary:** this change supplies instructions only. It does
  not sign in, change permissions, invite accounts, upload content, start a
  stream, or handle safeguarding records.
- **Privacy boundary:** account lists, consent records, and player details stay
  outside the repository. The runbook contains only the approved public team
  contact address and neutral example metadata.

## Implementation validation

- A content validator required the channel identity, access model, per-video
  sharing, external-record rule, add/remove procedures, upload checklist, Veo
  test and fail-closed fallback, consent gate, admin permissions, non-blocking
  operator checklist, and Channel images section. It rejected the
  `origin/main` document before passing the changed document.
- The existing Channel images section is byte-for-byte identical to
  `origin/main`. The change adds no executable shell fence.
- The approved-contact scan found exactly one unique address:
  `contact@squirrels.team`. Complete-diff review found no family address,
  player name, consent record, credential, token, or stream key.
- All added YouTube and Veo references were checked against their current
  official pages. The Veo help site rejects command-line requests, but its
  current indexed guides supplied the camera, Live add-on, stream-key, and
  rugby-support details used by the runbook.
- Targeted pre-commit initially rejected the draft description's bare URL.
  After marking it as an autolink, all targeted hooks passed.
- The failure-path check, content assertions, privacy checks, Markdown lint,
  secret scan, `git diff --check`, and independent authorization/privacy
  re-review passed.
- `npm ci` installed 267 locked packages and reported zero vulnerabilities;
  `npm run check` passed 23 files with zero diagnostics; `npm run build` built
  all six pages; and `npm audit --omit=dev` reported zero vulnerabilities.

## Branch review

**Classification:** authorization/privacy-sensitive documentation because the
runbook controls access to recordings of minors. No application behavior or
production system was changed. The review covered the full diff and existing
YouTube image documentation, plus the related channel-access, safeguarding,
permissions, live-stream, and external-record boundaries.

The root review found no privacy data or unauthorized external action. The
mandatory independent reviewer found one blocking issue: the original live
steps did not prove that the Private Studio event was the event started by
Veo. The correction now uses Veo's documented manual stream-key path, binds a
key unused by another current or upcoming event, starts on an empty pitch or
consenting adults, and verifies the exact active event, Private visibility,
recipient list, invited access, and denied uninvited access before players
enter frame. Every later stream repeats that binding and check. The reviewer
confirmed the blocking issue was resolved and suggested clarifying that a
scheduled event's default key might be reusable; that clarification was also
applied. No blocking or non-blocking finding remains.

The analogous-pattern sweep covered existing YouTube image guidance, the
repository's consent position from #9, all references to YouTube and Veo, and
the established public contact address. The image section remains unchanged,
and no competing access runbook or private record exists in the repository.

## Issue traceability

| Issue item | Disposition | Timing / owner / prerequisite | Evidence target | Current result |
| --- | --- | --- | --- | --- |
| Channel name, handle, and both URLs | Implement in this PR | Pre-merge / Codex | Identity section | Passed |
| Access model, limits, memberships and Unlisted rationale | Implement in this PR | Pre-merge / Codex | Access section and official links | Passed |
| Add/remove accounts; list outside Git | Implement in this PR | Pre-merge / Codex | Account procedure | Passed |
| Per-video upload checklist | Implement in this PR | Pre-merge / Codex | Checklist review | Passed |
| Private Veo live procedure and test | Implement conservatively | Pre-merge / Codex; post-merge test / admin | Fail-closed live section | Passed; live test deferred |
| Safeguarding and consent prerequisites | Implement in this PR | Pre-merge / Codex | Safeguarding section | Passed |
| Studio permissions and no shared password | Implement in this PR | Pre-merge / Codex | Admin section | Passed |
| Existing Channel images section | Preserve in this PR | Pre-merge / Codex | Complete-file diff | Passed; byte-identical |
| Account and consent records remain outside repo | Validate in this PR | Pre-merge / Codex | Content/privacy audit | Passed |
| Studio setup and operator checklist | Intentionally deferred, non-blocking | Post-merge / channel admins | Live systems | Not performed |
| Repository quality gates | Validate in this PR | Pre-merge / Codex/GitHub | Local and PR checks | Local gates passed; PR checks pending |
