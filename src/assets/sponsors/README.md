# Sponsor artwork

This directory contains transparent light and dark variants for the club's six
sponsors. A `-light` asset is intended for a dark surface; a `-dark` asset is
intended for a light surface. Normalized copies of the supplied files are
retained in `source/` so that the derivation can be audited or repeated.

## Provenance

The site maintainer supplied the original local files from their
`Downloads/Sponsors` directory and authorized local-tool derivation on
2026-09-15. On the maintainer's instruction, the EST Group source was instead
downloaded from the sponsor's website on 2026-09-16. The variants in this
directory are maintainer-authorized local derivatives; they are not represented
as separate sponsor-approved brand-pack files.

| Sponsor | Source or supplied filename | Repository source | Receipt or retrieval time | Source SHA-256 |
| --- | --- | --- | --- | --- |
| Imperial | `Front.svg` | `source/imperial.svg` | 2026-09-15 15:51:12 +0100 | `d1ca2db28a543c5ba2ef0bb107268466bcf879e3f3614b321ce230e48996c44c` |
| Hollybush Properties | `Back_Above Numbering.png` | `source/hollybush-properties.png` | 2026-09-15 15:51:17 +0100 | `a179bdf3366902e33d5d128151b49a1ffcfec8a5463d68d6719120786685b7b2` |
| D&C Plastering | `Right Sleeve.png` | `source/dc-plastering.png` | 2026-09-15 15:51:09 +0100 | `656d54f3363108be86037faa4e2dada6ffa667a5c3d00bdd0711ca1dae09835d` |
| EST Group | [`logo.png`](https://est-group.co.uk/wp-content/themes/spindogs//images/logo.png) | `source/est-group.png` | 2026-09-16T11:39:55Z | `c732d3d55bba136e2325426e3ea1184a9cec92b65f132f7c45dd2ca8bb87cb6d` |
| Cornerstone Finance Group | `Cornerstone Group 2.svg` | `source/cornerstone-finance-group.svg` | 2026-09-15 15:51:19 +0100 | `dbb648fb4b26ddf0eb9b2daacf8331e597da75eeaaf562b8cc10911e06892695` |
| On the River | `On the River updated.jpeg` | `source/on-the-river.jpeg` | 2026-09-15 15:51:14 +0100 | `68cae0144f1b9ba12618397d119606ba79aa7319f3f0194cf80bf71082c29540` |

The repository's end-of-file hook added one terminal LF byte to the supplied
Imperial SVG. Its normalized repository SHA-256 is
`2ff453d4ed46b6f36f014eb549281453c416738050490251285f83b8eddee122`;
the artwork and XML content are otherwise unchanged. Every other repository
source file matches its recorded source hash byte for byte.

## Local derivation

The raster derivations used ImageMagick 7.1.2-31. SVG inputs were rendered with
librsvg 2.62.3; before rerendering one, run the exact delegate pre-flight in the
[Veo Clubhouse export recipe](../../../docs/veo-overlays.md#clubhouse-export-recipe).
Simple SVG fill/viewBox edits supplied the remaining vector changes. No
generative image tool was used.

- Imperial was rendered from `rsvg:source/imperial.svg` at 384 DPI (4x its
  supplied dimensions), trimmed, and stored as PNG. The source retains live text
  declared as `Avenir-Medium`/`Avenir`, which librsvg resolves through the
  installed font environment; the exact font file used for the committed
  variants was not recorded. Regeneration therefore requires matching font
  availability and a pixel comparison of both regenerated Imperial PNGs against
  `imperial-dark.png` and `imperial-light.png`. Any non-zero difference blocks
  replacement until the font and render provenance is resolved. The committed
  PNGs remove that live-font dependency for downstream consumers. Their purple
  marks and gold crest remain unchanged; only the neutral wordmark and live-text
  fill become white in the light variant.
- Hollybush's white matte was converted to a smooth alpha channel using colour
  distance from white, then trimmed. The light variant uses the same alpha
  silhouette filled white.
- D&C was cropped to `1092x176+233+402`. High-saturation blue is retained in
  both variants; pixels below 25% HSL saturation are white in the light variant
  and 15% HSL lightness in the dark variant.
- EST Group was trimmed from 260x136 to 260x134. The dark variant keeps the
  published charcoal wordmark and green square unchanged. In the light variant,
  pixels below 25% HSL saturation become white while the `#84bf41` square and
  the original antialiased alpha channel are retained.
- Cornerstone remains outlined SVG. Both variants use the tight
  `124 228 2878 738` viewBox; the light variant changes only the dominant
  `rgb(88,89,91)` wordmark fill to white and preserves the coloured cube.
- On the River uses the supplied JPEG's luminance, levelled from 12% to 85%, as
  a shared antialiased alpha silhouette. The two variants fill that silhouette
  with white and `#252a2d` respectively.

Do not overwrite the files in `source/` with derived artwork. If a sponsor
provides a newer official brand pack, preserve it as a new source and update
this record before regenerating the variants.
