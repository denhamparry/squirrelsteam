---
status: Complete
issue: 144
issue_url: https://github.com/denhamparry/squirrelsteam/issues/144
branch: denhamparry.co.uk/fix/gh-issue-144
deploy: no
---

# Plan: Confirm the Caerdydd away venue

## Problem and evidence

The 27 September 2026 fixture has no location, so its card and calendar event
omit the venue. Issue #144 was fetched on 2026-09-22; it is open with no comments.
The supplied screenshot shows the meet at Clwb Rygbi Cymry Caerdydd, Fairleigh
Court, Pontcanna. The club's [match listing](https://www.clwbrygbi.com/teams/194310/match-centre/0-6447407)
names the ground Caeau Pontcanna Fields and gives CF11 9HY. Its
[September fixture list](https://www.clwbrygbi.com/matches/2026/9) also uses
that ground name for a 27 September youth match. The club's general contact
postcode refers to the changing rooms and is not used for the playing fields.

## Implementation and validation

1. Add `location: Caeau Pontcanna Fields, CF11 9HY` to the named fixture's
   frontmatter; leave every existing field and the empty body unchanged.
2. Run `npm run check` and `npm run build`. A local `npm ci` is needed because
   the new worktree has no `node_modules`; the build owns `dist/` generation.
3. Inspect the complete generated card and unfolded VEVENT for the exact venue,
   and compare the source against `origin/main` to prove no other field changed.
4. Run `git diff --check` and pre-commit on the staged handoff. No server,
   service, deploy, or cleanup is needed.

Expected changed files: this plan and
`src/content/fixtures/clwb-rygbi-caerdydd-away-2026-09-27.md`.

## Traceability

| Issue item | Timing / owner | Evidence and disposition | Result |
| --- | --- | --- | --- |
| Confirmed frontmatter location | Pre-merge / Codex | Screenshot and club listing; added the ground and postcode | Pass |
| Fixtures card venue line | Pre-merge / Codex | Built target card contains the exact venue line | Pass |
| Matching VEVENT `LOCATION` | Pre-merge / Codex | Built target event has escaped `LOCATION:Caeau Pontcanna Fields\\, CF11 9HY` | Pass |
| `npm run check` and `npm run build` | Pre-merge / Codex | Both commands succeeded after `npm ci` | Pass |
| Venue facts in frontmatter, not body (#97/#101) | Pre-merge / Codex | Source diff has only the new frontmatter line | Pass |
| Preserve title, date, time, and other fields | Pre-merge / Codex | Source equals `origin/main` plus the venue line; screenshot's meet/start details did not change time | Pass |
| No shared renderer or calendar changes | Pre-merge / Codex | Existing optional `location` paths emitted both outputs | Pass |

## Research review

Approved after one review: the content schema accepts `location`, the shared
FixtureItem renders it, and the calendar generator emits escaped `LOCATION`.
The analogous fixture sweep found no other Caerdydd source record to update.
The main risk is confusing the changing-room postcode CF11 9LB with the match
ground's CF11 9HY; the club's ground-specific listing resolves that distinction.

## Handoff evidence

On 2026-09-22, `npm ci`, `npm run check`, and `npm run build` passed. A focused
assertion checked the exact source-only addition, complete generated fixture
card, and unfolded VEVENT with preserved all-day dates. `git diff --check`
passed. The live issue was re-fetched after implementation and had no new
comments or changed requirements. Branch review classified both changed files
as non-code content; Trail of Bits code review skills were therefore skipped.
