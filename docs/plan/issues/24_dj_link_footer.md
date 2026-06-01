# Plan: Add 🎵 DJ link to footer (issue #24)

**Status:** Reviewed (Approved)
**Issue:** #24 — Add dj.squirrels.team link and a subscribe-able tour/event playlist
**Type:** content (fix)
**Branch:** denhamparry.co.uk/fix/gh-issue-024

## Scope decision (from /workflow-issue-fix clarification)

Issue #24 has two parts:

1. Add a link to **`dj.squirrels.team`** (the song-request app).
2. Surface a **subscribe-able playlist** link (Spotify/Apple Music) to follow
   the curated set.

During the workflow the maintainer confirmed:

- **Footer label:** `🎵 DJ`.
- **Subscribe playlist is deferred.** The curated playlist (76 deduped tracks,
  see issue comment) is not yet published to a streaming service, so there is no
  public URL to wire up. Shipping a placeholder/dead link to the live site was
  explicitly rejected. The subscribe link becomes a **follow-up issue** once a
  public playlist URL exists.

So this PR ships **only** the `dj.squirrels.team` link. Part 2 is tracked as a
follow-up.

## Background (verified during research)

- `dj.squirrels.team` resolves and serves a live "DJ Requests" app (page title
  `DJ Requests`) — confirmed via DNS + HTTPS fetch. The link target is valid.
- `src/components/Footer.astro` already has a footer nav with plain links:
  Fixtures / Training / About / Donate. The DJ link slots in here as a
  secondary/fun link, matching the issue's suggested placement.
- The primary `Header.astro` nav is intentionally minimal (Home / Fixtures /
  Training / About + Donate button). The DJ link is secondary, so it belongs in
  the footer, **not** the header.
- No existing `dj`/`playlist`/`spotify`/`apple music` references anywhere in the
  repo (rg search, no matches).

## Fix

1. **`src/components/Footer.astro`** — add a `🎵 DJ` link to the footer nav
   pointing to `https://dj.squirrels.team`.

   - Follow the existing pattern: a plain `<a>` inside `.site-footer__nav`,
     consistent with the external `Donate` link (same tab, no `target="_blank"`
     — matches the existing `Donate` → `shop.squirrels.team` link).
   - Hoist the URL into a `const djUrl = "https://dj.squirrels.team"` in the
     component frontmatter, mirroring the existing `donateUrl` convention.
   - Placement: after `Donate`, as the trailing fun/secondary link.

   ```astro
   <a href={djUrl}>🎵 DJ</a>
   ```

No new components, styles, or dependencies — the link inherits existing
`.site-footer__nav a` styling (white text, underline on hover) which already
satisfies the black & white branding.

## Files Modified

- `src/components/Footer.astro`
- `docs/plan/issues/24_dj_link_footer.md` (this plan)

## Testing Strategy

- `npm run build` succeeds (static content change, no behavioural risk).
- `npm run check` passes (Astro type-check).
- Manual: footer renders a `🎵 DJ` link; clicking it navigates to
  `https://dj.squirrels.team`. Mobile-first — the footer nav already wraps
  (`flex-wrap: wrap`), so the extra link reflows cleanly on phones.

## Acceptance Criteria

- [ ] `🎵 DJ` link appears in the footer nav, alongside Fixtures / Training /
      About / Donate.
- [ ] Link points to `https://dj.squirrels.team`.
- [ ] Black & white branding preserved (no new colours; inherits existing nav
      link styling).
- [ ] Footer reflows cleanly on mobile.
- [ ] `npm run build` and `npm run check` pass.

## Follow-up (out of scope for this PR)

- **Subscribe-able playlist link.** Once the 76-track curated list (issue #24
  comment) is published as a public playlist (Spotify recommended for free-tier
  playback; Apple Music a natural fit given the data is already mapped to Apple
  Music Track IDs), add a "Tour playlist" subscribe link next to `🎵 DJ`. Track
  as a new issue under epic #10.

## Risks / Notes

- Single-line, low-risk content change. No tests exist in the repo (static
  Astro site); build + type-check are the gates.
- External link uses the same-tab convention as the existing `Donate` link for
  consistency.

## Review Summary

**Overall Assessment:** Approved.

- Footer placement and the `donateUrl`-style const are consistent with the
  existing `Footer.astro` pattern — verified against the file.
- Link target `https://dj.squirrels.team` verified live (DNS + HTTPS, "DJ
  Requests" app).
- Scope deferral of the subscribe playlist is an explicit maintainer decision
  to avoid shipping a dead link; tracked as a follow-up. No 1:1 issue:PR
  concern — the PR closes the actionable part of #24 and the follow-up is filed
  separately.
- No required changes. Ready for implementation.
