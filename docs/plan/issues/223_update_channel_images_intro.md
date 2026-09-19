---
status: Complete
issue: 223
issue_url: https://github.com/denhamparry/squirrelsteam/issues/223
branch: denhamparry.co.uk/docs/gh-issue-223
deploy: no
---

# Plan: Make the Channel images intro cover every image

## Problem and outcome

The "Channel images" intro in `docs/youtube.md` was written when the section
held only the profile picture and watermark. It says "Neither image contains
visible text, sponsor artwork, player imagery, or personal information." The
section now also covers the banner (#202) and seven playlist thumbnails
(#221 and #226). Those have text, and the banner has sponsor logos, so the intro is
wrong for them.

It also says every image uses the `#1a1a1a` background. The watermark is on a
transparent canvas.

## Implementation

Rewrite only the intro paragraph under `## Channel images`:

- All the images reuse the approved white squirrel artwork.
- Profile picture, banner, and thumbnails use the opaque `#1a1a1a` background;
  the watermark is transparent.
- Profile picture and watermark: the squirrel only, no text.
- Banner: the "Rhiwbina Squirrels #1415" wordmark, the primary and secondary
  tier labels, and the current sponsors' logos.
- Playlist thumbnails: `#1415` and the playlist name, no sponsor artwork.
- Shared rule: no player imagery or personal information on any image.

Facts were checked against the repository: the banner SVG's
`aria-label="Rhiwbina Squirrels #1415"` and tier groups, the "Playlist sources
and composition" subsection, and the watermark's transparent 150x150 canvas.

## Files Modified

- `docs/youtube.md`
- `docs/plan/issues/223_update_channel_images_intro.md`

## Testing

- `pre-commit run --all-files` (markdownlint, whitespace, gitleaks).
- Re-read the intro against each subsection.

## Review Summary

**Overall Assessment:** Approved (author re-verification, not an independent
review).

- Every claim in the new intro maps to a subsection or committed file.
- The thumbnail count isn't stated, so adding a playlist won't make the intro
  stale again.
- Docs-only change; no build or site impact.
