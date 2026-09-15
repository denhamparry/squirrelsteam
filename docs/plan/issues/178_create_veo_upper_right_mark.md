---
status: Complete
outcome: implementation complete / operational validation pending
deploy: no
---

# Plan: Create Veo upper-right club mark (#178)

- **Issue:** [#178](https://github.com/denhamparry/squirrelsteam/issues/178)
- **Snapshot:** fetched 2026-09-15T17:22:36Z; body SHA-256
  `d3e958fa9fe061d633467c64a11fd0c7a11022135b8ff444ef4bbe6b18e3070a`;
  no comments
- **Base:** `origin/main` at
  `a2abfde59550b7c71bce659a599d21f548abd718`

## Problem and outcome

Veo Live's Upper Right Image slot needs a square club mark, but both repository
marks inherit `currentColor` and neither has a square canvas. Produce a
repository-owned 1024x1024 PNG candidate using the recommended squirrel mark,
with explicit white fill, deliberate clear space, and an optically centred
placement. Commit a square SVG source that records the slot and can regenerate
the PNG without changing the original website mark.

The export is implementation-complete when its file contract and local contrast
checks pass. Real-stream alpha, placement, entitlement, and bright/floodlit
legibility remain operational acceptance owned by the Clubhouse operator and
shared with #177.

## Design and implementation

1. Measure the source silhouette rather than merely centring its 1416x1487
   viewBox. Fit it to a 760px nominal height on a 1024px canvas, then offset it
   so the rendered alpha centroid, rather than the source bounding box, lands at
   the square centre.
2. Create `veo-upper-right-mark.svg` beside the brand sources. Copy the source
   path unchanged, replace inherited `currentColor` with explicit `#ffffff`,
   identify the Veo Upper Right Image slot in metadata, and retain transparent
   clear space. A subtle dark keyline is allowed only if a local pale-background
   contrast comparison demonstrates a need.
3. Render the adjacent PNG as RGBA at exactly 1024x1024. Record the source hash,
   geometry, keyline decision, and ImageMagick command in this plan so another
   size can be generated deterministically.
4. Inspect the full-size export, a small broadcast-scale render, and composites
   over synthetic bright and floodlit pitch backgrounds. Treat these as local
   design evidence only, never as Veo or real-footage acceptance.

### Export recipe

The source alpha centroid is deliberately centred by fitting the 1487-unit
source height to 760px (`scale = 0.511096167`) and exposing the equivalent
square viewBox `-354.4 -192.6 2003.5 2003.5`. This produces alpha bounds
672x707+207+125 after the selected keyline, while the unequal edge clear space
preserves the silhouette's optical rather than bounding-box centre.

The pale-background comparison showed the plain white mark losing its edge in
synthetic glare. The source therefore uses a black, 45%-opacity, 16-source-unit
keyline (about 8.2px at 1024px and under 1px at the 96px inspection scale).
Regenerate the adjacent export with ImageMagick 7.1.2-31:

```text
magick -background none src/assets/logo/veo-upper-right-mark.svg -alpha on -define png:color-type=6 PNG32:src/assets/logo/veo-upper-right-mark.png
```

## Files expected to change

- `docs/plan/issues/178_create_veo_upper_right_mark.md`
- `src/assets/logo/veo-upper-right-mark.svg`
- `src/assets/logo/veo-upper-right-mark.png`

No website component, favicon, sponsor banner, Veo account, or livestream is
changed.

## Validation

- Parse the SVG with `xmllint`; assert a 1024x1024 square canvas, explicit
  `#ffffff` fill, no `currentColor`, the expected slot metadata, and source path
  fidelity against `squirrel-mark.svg`.
- Inspect PNG metadata with ImageMagick/file; assert 1024x1024, 1:1, RGBA,
  transparent and opaque samples, non-empty centred artwork, and size below
  both Veo's 10MB limit and the repository hook's 1000KB limit.
- Recalculate the alpha centroid and edge bounds to demonstrate deliberate
  optical centring and clear space; independently render the SVG and compare it
  with the committed PNG.
- Visually inspect full-size, small-scale, bright-pitch, and floodlit-pitch
  previews. Keep real-footage and Veo ingest results pending.
- Run `git diff --check`, `npm ci`, `npm run check`, `npm run build`,
  `npm audit --omit=dev`, and the final staged `pre-commit run --all-files`.
- Re-fetch the live issue before branch review and again for post-PR
  verification; compare the actual changed paths with this plan.

## Risks and decisions

- **Observed:** the source SVG hash is
  `cbdb5c601778934f3c3dfaba0a9504bc28db05fc6e8bf9f8e6ffa0aa5f6ceb1f`;
  its 1416x1487 canvas has rendered alpha bounds 1296x1367+60+60 and alpha
  centroid (647.356, 809.121) under ImageMagick 7.1.2-31.
- **Documented:** issue #178 states `.jpg`/`.png`, 1:1, and 10MB for Upper
  Right Image. It recommends the squirrel, explicit white fill, 1024x1024,
  optical centring, and carrying shared Veo findings from #177.
- **Documented dependency:** #177 and its open
  [PR #179](https://github.com/denhamparry/squirrelsteam/pull/179) retain alpha,
  pixel-size, placement, and plan-entitlement checks for an authorized real
  stream. PR #179 was observed at
  `64b8bacaf825f88676b118dc293e5c8879e6d363` on 2026-09-15.
- **Inferred:** 1024x1024 is a conservative working size, not published Veo
  pixel guidance. The operator must regenerate if authenticated guidance or
  Veo Support specifies another square size.
- A thin keyline can protect white artwork over glare but may add visual weight.
  Use the smallest locally effective treatment and keep the source editable.
- This workflow does not authorize a Veo upload, package activation, test
  stream, or deployment.

## Issue traceability

| Issue item | Disposition | Timing / owner / prerequisite | Evidence or current result |
| --- | --- | --- | --- |
| Square PNG under 10MB with chosen mark | Implement in this PR | Pre-merge / Codex / repository source | Exact file metadata and visual inspection |
| Explicit baked fill, no `currentColor` | Implement in this PR | Pre-merge / Codex | SVG structure and raster colour checks |
| Optical centre and deliberate clear space | Implement and validate locally | Pre-merge / Codex / measured source alpha | Centroid and edge-bound assertions |
| Legible over real bright and floodlit pitch footage | External/operator pending | External / stream operator / representative livestreams | Real live and on-demand viewer captures |
| Transparency confirmed on a real stream | External/operator pending | External / Clubhouse Admin / #177 authorized alpha test | Carry the recorded #177 ingest result, then spot-check this asset |
| Export committed with Veo slot recorded | Implement in this PR | Pre-merge / Codex | Adjacent PNG/SVG and SVG metadata |
| Source/export recipe noted | Implement in this plan | Pre-merge / Codex | Exact geometry, hash, tool version, and render command |
| Prefer squirrel over club lockup | Implement recommendation | Pre-merge / Codex | U12/site/favicon identity and small-size silhouette |
| Add shadow/outline only if needed | Validate conditionally | Pre-merge / Codex / pale-background comparison | Record the selected treatment and comparison result |
| Produce dark-on-light version if Veo flattens alpha | Intentionally deferred conditional | External / maintainer / #177 alpha result | Create only if real ingest flattens transparent PNG to white |
| Confirm pixel dimensions, position, scale, toggle behaviour, and entitlement | External/operator pending | External / Clubhouse Admin or Veo Support / #177 shared investigation | Authorized product guidance and real-stream observations |
| Sponsor Lower Banner | Intentionally out of scope | Issue #177 | No sponsor asset or banner change |
| Website/favicons and broader team assets | Validated without change | Issues #9 and #10 | Existing source remains untouched; no website consumer changes |

## Research validation

Approved after one review. The plan keeps the standalone asset independent of
open PR #179, avoids duplicating #177's live-product investigation, binds the
derivative to the exact source mark, distinguishes local contrast mocks from
required real-stream evidence, and makes the deferred requirements control the
non-closing PR relationship.

## Implementation review

Implementation completed and reviewed on 2026-09-15. The live issue was
re-fetched after implementation with the same body hash and still had no
comments. PR #179 remained open at its captured dependency SHA.

- The planned and actual path sets contain the same three files; the website
  source mark and all consumers remain unchanged.
- The SVG parses as XML, records the Upper Right Image slot, uses explicit
  `#ffffff` fill, contains no `currentColor`, and preserves the original path
  data exactly.
- The PNG is 1024x1024 RGBA, 98,176 bytes, has alpha range 0..1, bounds
  672x707+207+125, and alpha centroid (511.847, 511.730). Its SHA-256 is
  `f6a2394f9e641ef86740bf31d6fd1e0db33659fc6d620f3dd7d4a34bdbc34e55`.
- Full-size and 96px renders were inspected. Synthetic bright and floodlit
  1920x1080 composites at a 180px mark size demonstrated why the subtle
  keyline is retained and kept the silhouette distinct. These mocks are local
  design evidence, not the issue's required real-footage or Veo-ingest proof.
- An independent regeneration matched the committed PNG with zero differing
  pixels. The same comparison rejected the unadapted source with 1,613,150
  differing pixels, proving the check detects a plausible wrong export.
- `npm ci`, `npm run check`, `npm run build`, `npm audit --omit=dev`, and
  `git diff --check` passed. Astro checked 20 files without diagnostics, built
  six static pages, and npm reported zero vulnerabilities.
- Trail of Bits review skills were skipped because the branch changes only a
  plan and inert image/vector assets. Manual review covered issue traceability,
  source fidelity, file contract, centring, contrast, regeneration, dependency
  status, related paths, and authorization boundaries; no follow-up ideas were
  found.

Two local harness/setup problems were corrected and are not product failures.
The first preview command put ImageMagick's `+append` operator before its input
images and exited 1; the corrected order rendered the comparison. The first
regeneration wrapper lacked fail-fast behavior, so its output was discarded;
the rerun explicitly captured both compare statuses and required the exact
render to pass and the wrong source to fail.
