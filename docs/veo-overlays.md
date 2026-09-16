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

Veo does not accept SVG uploads; the SVG files here remain editable sources
and the PNG files are the upload artifacts.

The adjacent SVGs are the editable sources. Keep each SVG beside its PNG so
the relative image links continue to resolve. The cover's useful content stays
inside the central 1200x300 working safe zone (x=120..1320, y=30..330), which
protects the identity and sponsor row from likely edge crops. The crest retains
the approved squirrel mark's approximately 70% square footprint so it remains
recognizable at 64px.

### Clubhouse artwork sources

The club identity links `veo-upper-right-mark.svg`, an existing white-on-dark
derivative of `squirrel-mark.svg`. The cover links these existing dark-surface
variants in alphabetical, non-ranking order:

1. `../sponsors/cornerstone-finance-group-light.svg`
2. `../sponsors/dc-plastering-light.png`
3. `../sponsors/hollybush-properties-light.png`
4. `../sponsors/imperial-light.png`
5. `../sponsors/on-the-river-light.png`

Each sponsor has the same 220x112 slot. The linked artwork is fitted optically
inside that fixed area because its aspect ratios range from a wide wordmark to
a near-square badge. Equal slots, one row, and alphabetical order deliberately
avoid suggesting tiers. Do not add prices, kit placements, private contact
details, or other fundraising copy to these profile images.

### Clubhouse export recipe

The PNGs were exported with ImageMagick 7.1.2-31. For the crest, create an
opaque 1024x1024 `#1a1a1a` canvas and composite
`veo-upper-right-mark.png` over it at its native 1024x1024 size.

For the cover, create an opaque 1440x360 `#1a1a1a` canvas. Composite the club
mark into a 144x144 box at +120+30, then draw `RHIWBINA SQUIRRELS U12` in
Arial Bold at 44px from +280+113 and `OUR SPONSORS` in Arial Bold at 17px from
+120+195. Draw identical rounded `#232323` sponsor slots at y=205, width=220,
height=112, radius=12, with x positions 120, 360, 600, 840, and 1080.

Trim transparent margins from each unchanged `-light` input, resize it to fit
inside the stated box without changing its aspect ratio, and centre it there:

| Sponsor | Fit box | Box position |
| --- | --- | --- |
| Cornerstone Finance Group | 204x78 | +128+222 |
| D&C Plastering | 204x68 | +368+227 |
| Hollybush Properties Ltd | 180x96 | +620+213 |
| Imperial | 190x74 | +855+224 |
| On the River | 100x104 | +1140+209 |

Render the Cornerstone SVG on a transparent canvas at 384 DPI before trimming.
Read the other four raster inputs at their native resolution.

The local ImageMagick SVG delegate omits linked images, so compose the PNG
directly from the linked inputs rather than rasterizing `veo-cover.svg`. Use
`/System/Library/Fonts/Supplemental/Arial Bold.ttf` for a pixel-identical local
export. Finish both PNGs with alpha disabled and metadata stripped. Check the
crest at 64px on light and dark surfaces and the complete cover at 390px wide
before committing regenerated outputs.

The cover is a snapshot of the current sponsor list in
`src/data/sponsors.ts`. Whenever that list changes because a sponsor is added,
removed, renamed, reordered, or receives replacement artwork, update the five
linked groups and equal-slot layout, regenerate both cover formats, repeat the
small-size check, and re-upload the new PNG to Veo Clubhouse. That later upload
requires an authorized operator and is not performed by this repository
workflow.

## Lower Banner sponsor candidate

`src/assets/sponsors/veo-lower-banner.png` targets Veo Live's **Lower Banner**
overlay slot. It is a provisional 2400x300 PNG (8:1) with transparent gutters.
The adjacent `veo-lower-banner.svg` is the layered, editable source: each
sponsor has a named group, an equal 456x252 tile, and a linked source image that
can be replaced without rebuilding the layout.

This is a candidate, not an upload-ready production asset. Do not upload or
activate it until the operator checks below are complete; issue #177 owns that
gate. Issue #178 owns the separate 1:1 Upper Right Image.

The sponsor artwork itself is settled: #170 is closed, and the maintainer
accepted the current variants as an interim set. #181 tracks replacing the
On the River and Hollybush Properties variants with sponsor-approved artwork,
at which point this banner should be regenerated from the recipe below.

### Artwork decision

The banner uses the supplied artwork without recolouring or inversion. Imperial,
Hollybush Properties, and Cornerstone Finance Group retain their dark-on-light
artwork on white tiles. D&C Plastering and On the River retain their supplied
light-on-dark artwork on dark tiles. Transparent outer margins and 12px gutters
allow Veo's PNG-alpha behaviour to be observed without exposing any logo
directly to changing footage.

All five sponsors receive the same tile area and appear in the issue-specified
order: Imperial, Hollybush Properties, D&C Plastering, Cornerstone Finance
Group, and On the River. Their artwork is sized optically within each tile;
equal pixel height would make the horizontal and square lockups look unequal.
Extra club or “Our sponsors” copy is deliberately omitted to preserve space.

### Source provenance

The normalized inputs were copied from PR #176 at implementation head
`f33737332e91f9fb4f86d12076773339d56c8b84`. That PR records the maintainer as
the supplier and the local receipt time. The source hashes used here are:

| Source | SHA-256 |
| --- | --- |
| `source/imperial.svg` | `2ff453d4ed46b6f36f014eb549281453c416738050490251285f83b8eddee122` |
| `source/hollybush-properties.png` | `a179bdf3366902e33d5d128151b49a1ffcfec8a5463d68d6719120786685b7b2` |
| `source/dc-plastering.png` | `656d54f3363108be86037faa4e2dada6ffa667a5c3d00bdd0711ca1dae09835d` |
| `source/cornerstone-finance-group.svg` | `dbb648fb4b26ddf0eb9b2daacf8331e597da75eeaaf562b8cc10911e06892695` |
| `source/on-the-river.jpeg` | `68cae0144f1b9ba12618397d119606ba79aa7319f3f0194cf80bf71082c29540` |

Imperial's repository hash includes the one terminal LF added by the repository
hook and documented on PR #176. The underlying artwork is otherwise unchanged.

### Export recipe

The export was produced with ImageMagick 7.1.2-31. Start with a transparent
2400x300 canvas and draw five rounded 456x252 tiles at x positions 36, 504, 972,
1440, and 1908, with y=24 and radius=16. The first, second, and fourth tiles are
white; D&C uses `#1a1a1a`; On the River uses `#1a191a`.

Crop and resize each unchanged source according to this table, then composite
it at the stated position:

| Sponsor | Source crop | Output size | Position |
| --- | --- | --- | --- |
| Imperial | `960x332+96+12` after a 384-DPI SVG render | 420x145 | +54+77 |
| Hollybush Properties | `1331x675+130+80` | 420x213 | +522+44 |
| D&C Plastering | `1092x176+233+402` | 420x68 | +990+116 |
| Cornerstone Finance Group | `2878x738+124+228` after transparent SVG render | 420x108 | +1458+96 |
| On the River | `839x942+217+126` | 190x214 | +2041+43 |

The layered SVG mirrors the same groups, crops, sizes, and positions. Its images
are linked rather than embedded, so keep it beside the `source/` directory.
This local ImageMagick SVG delegate omits linked images; use a browser or vector
editor to inspect the SVG, or repeat the direct composition above for the PNG.

## Veo findings and operator checks

Veo's current help article recommends clear, high-resolution PNGs and says the
feature requires an active Veo Live add-on. A Clubhouse Admin creates and
activates an overlay package; an Admin or Editor can toggle Lower Banner in the
Producer Panel. Enabled overlays appear during the livestream and in its
on-demand version, according to [Veo's image overlays guide](https://support.veo.com/hc/en-us/articles/17712585052177-How-to-add-and-manage-image-overlays-in-Veo-Live).

The article's current [upload-dialog image](https://support.veo.com/hc/article_attachments/27916729882897)
states `.jpg` or `.png`, 8:1, and a 10MB maximum for Lower Banner, but gives no
pixel dimensions.

Before final upload, the authorized Clubhouse operator must record these
results on issue #177 so issue #178 can reuse them:

1. Confirm the account has an active Veo Live add-on and the Overlay tab is
   available to the intended Admin/Editor.
2. Ask Veo Support or inspect authenticated product guidance for recommended
   Lower Banner pixels; confirm 2400x300 or regenerate at the advised 8:1 size.
3. Upload the candidate to a test package.
   Activate it on an authorized test livestream and confirm footage is visible
   through the outer margin and every 12px gutter rather than flattened.
4. Capture the actual location and rendered size in the viewer, then check all
   five logos at normal playback scale in bright sun and under floodlights.
5. Toggle Lower Banner off and on from Producer mode, then verify the enabled
   banner is also present in the on-demand version of that livestream.

Until those observations exist, the repository artifact is locally validated
but operational acceptance remains pending.
