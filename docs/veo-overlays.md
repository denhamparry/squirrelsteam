# Veo overlay assets

## Clubhouse profile images

`src/assets/logo/veo-crest.png` and `src/assets/logo/veo-cover.png` target the
Veo Clubhouse **Crest** and **Cover image** slots. The crest is an opaque
1024x1024 PNG; the cover is an opaque 1440x360 PNG. Both are below Veo's 2.5 MB
limit and use the site's `#1a1a1a` dark background.

| Slot | Required? | Accepted upload formats | Maximum | Veo size guidance |
| --- | --- | --- | --- | --- |
| Crest | Yes | JPG, GIF, or PNG | 2.5 MB | No pixel size given; upload box is square |
| Cover | No | JPG, GIF, or PNG | 2.5 MB | Recommended 1440x360 (4:1) |

Veo does not accept SVG uploads; the adjacent SVG files remain editable sources
and the PNG files are the upload artifacts. Keep each SVG beside its PNG so the
relative image links continue to resolve.

The cover's useful content stays inside the central 1200x300 working safe zone
(x=120..1320, y=30..330). Its sponsor groups start at x=316, and the lower row
is confined to x=832..1204, leaving the left and lower-left areas clear for
Veo's crest and team-name overlay. The crest retains the approved squirrel
mark's approximately 70% square footprint so it remains recognizable at 64px.

### Clubhouse artwork sources

The crest links `veo-upper-right-mark.svg`, an existing white-on-dark
derivative of `squirrel-mark.svg`.

The Veo team identity is `Rhiwbina Squirrels 1415`: `1415` identifies the
2014/2015 birth-year cohort and remains stable as the players move from U12 to
U13, U14, and later age grades. Do not repeat that identity in the cover image:
Veo renders the crest and team name over the lower-left of the cover itself.

The cover links these existing dark-surface variants, primary sponsors first
and alphabetical within each tier:

1. Primary — `../sponsors/cornerstone-finance-group-light.svg`
2. Primary — `../sponsors/hollybush-properties-light.png`
3. Primary — `../sponsors/imperial-light.png`
4. Primary — `../sponsors/on-the-river-light.png`
5. Secondary — `../sponsors/dc-plastering-light.png`
6. Secondary — `../sponsors/est-group-light.png`

The four primary sponsors occupy 218x136 slots in an upper row. The two
secondary sponsors occupy smaller 180x104 slots in a right-side lower row. A
larger tier break and the size difference communicate the grouping without
putting text into the artwork. Text labels are intentionally omitted because
they are unreadable when the complete cover is reduced to its 390px-wide app
preview; the website displays retain accessible tier headings.

Do not add prices, package names, kit placements, private contact details, or
other fundraising copy to these profile images.

A live Clubhouse render inspected on 2026-09-16 showed that Veo places its own
crest near the left edge and the team name across the lower-left. The cover
therefore leaves those areas empty. This prevents Veo's UI from covering a
sponsor and avoids duplicating the team identity.

### Clubhouse export recipe

The PNGs were exported with ImageMagick 7.1.2-31. For the crest, create an
opaque 1024x1024 `#1a1a1a` canvas and composite
`veo-upper-right-mark.png` over it at its native 1024x1024 size.

For the cover, create an opaque 1440x360 `#1a1a1a` canvas. Do not add a club
mark, team name, or tier label: Veo supplies the first two, while tier labels
would be unreadable at the required small preview size.

Draw rounded `#232323` slots with a 12px radius at these positions:

- Primary: 218x136 at y=32 and x=316, 546, 776, and 1006.
- Secondary: 180x104 at y=184 and x=832 and 1024.

Trim transparent margins from each unchanged `-light` input, resize it to fit
inside the stated box without changing its aspect ratio, centre it on a
transparent canvas of that box size, and composite it at the box position:

| Tier | Sponsor | Fit box | Box position |
| --- | --- | --- | --- |
| Primary | Cornerstone Finance Group | 204x90 | +323+55 |
| Primary | Hollybush Properties Ltd | 190x112 | +560+44 |
| Primary | Imperial | 196x90 | +787+55 |
| Primary | On the River | 116x116 | +1057+42 |
| Secondary | D&C Plastering | 164x50 | +840+211 |
| Secondary | EST Group | 150x78 | +1039+197 |

Render the Cornerstone SVG on a transparent canvas at 384 DPI before trimming.
Read the other five raster inputs at their native resolution. Explicitly set a
transparent background before each `-extent`; ImageMagick otherwise creates a
white fit canvas that hides white artwork. Finish the cover with alpha disabled
and metadata stripped.

The local ImageMagick SVG delegate omits linked images, so compose the PNG
directly from the linked inputs rather than rasterizing `veo-cover.svg`. Neither
the cover nor crest export contains text or needs a font. Check the crest at
64px on light and dark surfaces and the complete cover at 390px wide before
committing regenerated outputs.

The cover is a snapshot of the current sponsor grouping in
`src/data/sponsors.ts`. Whenever that list or its tiers change, update the six
linked groups and tiered slot layout, regenerate both cover formats, repeat the
small-size check, and re-upload the new PNG to Veo Clubhouse. That upload
requires an authorized operator and is not performed by this repository
workflow.

## Lower Banner sponsor candidate

`src/assets/sponsors/veo-lower-banner.png` targets Veo Live's **Lower Banner**
overlay slot. It is a provisional 2400x300 PNG (8:1) with transparent gutters.
The adjacent `veo-lower-banner.svg` is the layered, editable source, with one
named group per sponsor nested inside its primary or secondary tier group.

This is a candidate, not an upload-ready production asset. Do not upload or
activate it until the operator checks below are complete; issue #177 owns that
gate. Issue #178 owns the separate 1:1 Upper Right Image.

The sponsor artwork itself is settled: #170 is closed, and the maintainer
accepted the current variants as an interim set. #181 tracks replacing the On
the River and Hollybush Properties variants with sponsor-approved artwork, at
which point this banner should be regenerated from the recipe below.

### Artwork decision

The banner preserves each mark's native polarity. Cornerstone Finance Group,
Hollybush Properties, Imperial, and EST Group use dark-on-light artwork on
white tiles. On the River and D&C Plastering use light-on-dark artwork on dark
tiles. Transparent outer margins and 12px intra-tier gutters allow Veo's
PNG-alpha behaviour to be observed without exposing a logo directly to
changing footage.

The primary group comes first in alphabetical order and uses four 456x252
tiles. A 36px tier break leads to the alphabetical secondary group in two
smaller 210x180 tiles. Artwork is sized optically within each tile because the
aspect ratios range from wide wordmarks to a near-square badge. Tier labels are
intentionally omitted: text that fits this 8:1 strip is not readable at normal
playback size and would reduce the available logo area. The size and spacing
change still make the two groups visually distinct.

### Source provenance

The five original normalized inputs were copied from PR #176 at implementation
head `f33737332e91f9fb4f86d12076773339d56c8b84`. PR #176 records the maintainer
as their supplier and the local receipt time. EST Group was downloaded from the
sponsor's website on the maintainer's instruction, as recorded in
`src/assets/sponsors/README.md`.

| Source | SHA-256 |
| --- | --- |
| `source/cornerstone-finance-group.svg` | `dbb648fb4b26ddf0eb9b2daacf8331e597da75eeaaf562b8cc10911e06892695` |
| `source/hollybush-properties.png` | `a179bdf3366902e33d5d128151b49a1ffcfec8a5463d68d6719120786685b7b2` |
| `source/imperial.svg` | `2ff453d4ed46b6f36f014eb549281453c416738050490251285f83b8eddee122` |
| `source/on-the-river.jpeg` | `68cae0144f1b9ba12618397d119606ba79aa7319f3f0194cf80bf71082c29540` |
| `source/dc-plastering.png` | `656d54f3363108be86037faa4e2dada6ffa667a5c3d00bdd0711ca1dae09835d` |
| `source/est-group.png` | `c732d3d55bba136e2325426e3ea1184a9cec92b65f132f7c45dd2ca8bb87cb6d` |

Imperial's repository hash includes the one terminal LF added by the repository
hook and documented on PR #176. The underlying artwork is otherwise unchanged.
The banner links the trimmed `est-group-dark.png` derivative documented beside
the source; it preserves the published charcoal and green colours.

### Export recipe

Start with a transparent 2400x300 canvas and draw the following rounded tiles
with a 16px radius:

- Primary: 456x252 at y=24 and x=36, 504, 972, and 1440.
- Secondary: 210x180 at y=60 and x=1932 and 2154.

Use `#fff` for Cornerstone, Hollybush, Imperial, and EST; use `#1a191a`
for On the River and `#1a1a1a` for D&C Plastering.

Crop and resize each unchanged input according to this table, then composite it
at the stated position:

| Tier | Sponsor | Source crop | Output size | Position |
| --- | --- | --- | --- | --- |
| Primary | Cornerstone Finance Group | `2878x738+124+228` after transparent SVG render | 420x108 | +54+96 |
| Primary | Hollybush Properties Ltd | `1331x675+130+80` | 420x213 | +522+44 |
| Primary | Imperial | `240x83+24+3` after transparent SVG render | 420x145 | +990+77 |
| Primary | On the River | `839x942+217+126` | 190x214 | +1573+43 |
| Secondary | D&C Plastering | `1092x176+233+402` | 186x30 | +1944+135 |
| Secondary | EST Group | Trimmed dark variant | 174x90 | +2172+105 |

The layered SVG mirrors these groups, crops, sizes, and positions. Its images
are linked rather than embedded, so keep it beside the `source/` directory.
The local ImageMagick SVG delegate omits linked images; use a browser or vector
editor to inspect the SVG, or repeat the direct composition above for the PNG.
Finish the PNG as RGBA with metadata stripped.

## Veo findings and operator checks

Veo's current help article recommends clear, high-resolution PNGs and says the
feature requires an active Veo Live add-on. A Clubhouse Admin creates and
activates an overlay package; an Admin or Editor can toggle Lower Banner in the
Producer Panel. Enabled overlays appear during the livestream and in its
on-demand version, according to [Veo's image overlays guide](https://support.veo.com/hc/en-us/articles/17712585052177-How-to-add-and-manage-image-overlays-in-Veo-Live).

The article's current [upload-dialog image](https://support.veo.com/hc/article_attachments/27916729882897)
states `.jpg` or `.png`, 8:1, and a 10MB maximum for Lower Banner, but gives no
pixel dimensions.

After this change merges, an authorized Clubhouse admin should:

1. Upload the new `veo-lower-banner.png` to the Veo Live Lower Banner and check
   all six logos at normal playback scale on a real stream.
2. Confirm transparent outer margins and gutters still reveal footage, and
   verify the banner in bright sun, under floodlights, and in the on-demand
   recording.
3. Upload the new `veo-cover.png` to the Clubhouse Cover and check in the Veo
   Live phone app that every sponsor remains visible beside Veo's crest and
   team-name overlay.
4. Confirm the account still has the required Veo Live add-on and that an
   Admin or Editor can toggle the Lower Banner as expected.

These are operational checks, not repository implementation blockers.
