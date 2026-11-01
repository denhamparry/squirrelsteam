---
status: Complete
issue: 277
issue_url: https://github.com/denhamparry/squirrelsteam/issues/277
branch: denhamparry.co.uk/feat/gh-issue-277
deploy: no
---

# Plan: Link the team YouTube channel in the footer

## Problem and outcome

The owner closed #27 (the music playlist) and asked for the team YouTube channel
to be linked instead. Add a `▶️ YouTube` footer link to the public channel URL,
next to `🎵 DJ`. Videos stay private and shared with approved accounts, as set
out in `docs/youtube.md`, so only the public channel page is linked.

## Files modified

- `src/components/Footer.astro`
- `docs/plan/issues/277_link_youtube_channel_footer.md`

## Validation

- `npm run check` and `npm run build` pass.
- Every built page's footer links to the channel URL.
