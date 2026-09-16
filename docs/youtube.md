# YouTube

## Channel images

The channel images for
[@RhiwbinaSquirrels1415](https://www.youtube.com/@RhiwbinaSquirrels1415)
reuse the approved white squirrel artwork on the club's `#1a1a1a` background.
Neither image contains visible text, sponsor artwork, player imagery, or
personal information.

### Upload contracts

The maintainer's YouTube Studio screenshots from 2026-09-16 and YouTube's
[channel-branding guidance](https://support.google.com/youtube/answer/10456525)
give these requirements:

| Slot | Repository artifact | Accepted upload and limits | Display |
| --- | --- | --- | --- |
| Picture | `src/assets/logo/youtube-profile.png` | PNG or non-animated GIF; at least 98x98 and no more than 4 MB | Circular crop beside videos and comments, on the channel page, and in search |
| Video watermark | `src/assets/logo/youtube-watermark.png` | PNG, non-animated GIF, BMP, or JPEG; at least 150x150, square, and under 1 MB | Right-hand player corner in landscape view on computers and mobile devices |

The Studio screenshot's 4 MB PNG/GIF profile rule is stricter than the help
page's 15 MB JPG/GIF/BMP/PNG guidance, so the repository follows the Studio
rule. The help page currently specifies a minimum of 150x150 for the watermark;
the exact 150x150 export meets that requirement. A watermark can appear for the
last 15 seconds, from a custom start time, or for the entire video. It appears
in landscape view on computers and mobile devices, is not clickable on mobile,
and is unavailable on videos set as made for kids.

### Sources and composition

`youtube-profile.svg` uses an 800x800 `#1a1a1a` rectangle and links
`veo-upper-right-mark.svg` at the full canvas size. This is the established
`veo-crest.svg` composition at the YouTube export size. The mark remains within
the circle inscribed in the square, so YouTube's circular crop removes only
background.

`youtube-watermark.svg` links the same mark on a transparent 150x150 canvas.
The source already contains the approved white fill, 45%-black keyline, optical
centring, and clear space used for the Veo Live upper-right image. At 150px its
non-transparent bounds are 103x108 at +28+16, leaving transparent margin on
every side.

The SVG files are editable linked sources rather than upload artifacts. Keep
them beside the source artwork so the relative links resolve. The PNG files are
the images to upload.

### Deterministic export recipe

The committed PNGs were exported with ImageMagick 7.1.2-31. The local SVG
delegate is not used because linked images are not rendered reliably. Instead,
resize the existing approved raster compositions directly:

```text
magick src/assets/logo/veo-crest.png \
  -filter Lanczos -resize 800x800 -alpha off -depth 8 \
  -define png:color-type=2 -strip \
  src/assets/logo/youtube-profile.png

magick src/assets/logo/veo-upper-right-mark.png \
  -filter Lanczos -resize 150x150 -depth 8 \
  -define png:color-type=6 -strip \
  src/assets/logo/youtube-watermark.png
```

The inputs used for this export have these SHA-256 values:

| Input | SHA-256 |
| --- | --- |
| `veo-crest.png` | `7723e7756cd60f6506eb26bd064e39d73d42a1233e301d0b49e44af75d076d88` |
| `veo-upper-right-mark.png` | `f6a2394f9e641ef86740bf31d6fd1e0db33659fc6d620f3dd7d4a34bdbc34e55` |

### Small-size and contrast checks

The profile's non-background bounds are 526x555 at +161+96 on its 800x800
canvas, with zero non-background pixels outside the inscribed circle. Before
upload, apply a circular crop and inspect it at both 98px and 40px on white
`#ffffff` and YouTube-dark `#0f0f0f` page backgrounds. The dark disc, white
squirrel, and silhouette must remain distinct in all four previews.

Inspect the watermark at its native 150px size over both a bright frame, such
as sunlit grass or pale sky, and a dark frame, such as a floodlit night pitch.
The transparent margin must remain visible on all four sides, and the white
mark plus dark keyline must remain recognizable. Synthetic frames are suitable
for repository validation; they are not substitutes for the post-upload check.

### Channel banner

YouTube uses one channel banner across TV, desktop, and mobile, cropping it
differently for each surface. Its minimum upload size is 2048x1152 at 16:9,
with a 1235x338 safe area for text and logos. The recommended TV size is
2560x1440, and files must be 6 MB or smaller without extra shadows, borders, or
frames. At the recommended size, the proportional safe area is 1544x422,
centred at x=508..2052 and y=509..931.

`youtube-banner.svg` is the editable source and `youtube-banner.png` is the
upload artifact. Both use an opaque `#1a1a1a` canvas. All visible artwork sits
inside the centred safe area; the rest of the canvas is background only. The
SVG links the approved `veo-upper-right-mark.svg` squirrel and every sponsor's
`-light` variant rather than embedding or redrawing them. The wordmark and tier
labels are Archivo outlines, so the committed SVG does not require a locally
installed font.

The outlines were generated from Google Fonts'
[`Archivo[wdth,wght].ttf`](https://github.com/google/fonts/blob/main/ofl/archivo/Archivo%5Bwdth%2Cwght%5D.ttf)
at width 100, weight 800 for the wordmark, and weight 700 for the labels. The
font file used had SHA-256
`0e094a7d3c7c4c25cf1310c4b30014f1dae9332220b1c2c88f4fa996f0b05053`.

#### Banner geometry

Coordinates below use the 2560x1440 canvas. Sponsor order and tiers come from
`src/data/sponsors.ts`, not this table; the table records only the current
render geometry.

| Group or mark | Slot or bounds (x, y, width, height) | Linked source |
| --- | --- | --- |
| Safe area | 508, 509, 1544, 422 | YouTube banner guidance |
| Squirrel mark | 559, 525, 250, 250 | `veo-upper-right-mark.svg` |
| Primary sponsor slots (four) | 880/1167/1454/1741, 579, 270, 158 | `sponsors.ts` primary `logoLight` values |
| Cornerstone Finance Group | 892, 625, 246, 63 | `cornerstone-finance-group-light.svg` |
| Hollybush Properties Ltd | 1204, 603, 196, 101 | `hollybush-properties-light.png` |
| Imperial | 1474, 616, 230, 79 | `imperial-light.png` |
| On the River | 1817, 588, 112, 126 | `on-the-river-light.png` |
| Secondary sponsor slots (two) | 880/1114, 808, 210, 96 | `sponsors.ts` secondary `logoLight` values |
| D&C Plastering | 892, 841, 186, 30 | `dc-plastering-light.png` |
| EST Group | 1167, 823, 104, 54 | `est-group-light.png` |

The 270x158 primary slots are larger than the 210x96 secondary slots. Optical
sizing keeps the smallest primary mark larger by visible area than either
secondary mark while respecting each logo's aspect ratio.

#### Deterministic banner export

The committed PNG was exported with ImageMagick 7.1.2-31. Its SVG delegate
does not reliably place relative image links, so the recipe removes only the
seven `<image>` elements from the piped text/background rendering pass, then
composites those same linked files explicitly at their recorded geometry.

Run this from the repository root:

```text
cd src/assets/logo
sed '/<image /d' youtube-banner.svg | magick \
  -background '#1a1a1a' svg:- -alpha off \
  \( veo-upper-right-mark.png -filter Lanczos -resize 250x250 \
    -background none -gravity center -extent 250x250 \) \
    -gravity northwest -geometry +559+525 -composite \
  \( ../sponsors/cornerstone-finance-group-light.svg -background none \
    -filter Lanczos -resize 246x63 -gravity center -extent 246x63 \) \
    -gravity northwest -geometry +892+625 -composite \
  \( ../sponsors/hollybush-properties-light.png -filter Lanczos \
    -resize 196x101 -background none -gravity center -extent 196x101 \) \
    -gravity northwest -geometry +1204+603 -composite \
  \( ../sponsors/imperial-light.png -filter Lanczos -resize 230x79 \
    -background none -gravity center -extent 230x79 \) \
    -gravity northwest -geometry +1474+616 -composite \
  \( ../sponsors/on-the-river-light.png -filter Lanczos -resize 112x126 \
    -background none -gravity center -extent 112x126 \) \
    -gravity northwest -geometry +1817+588 -composite \
  \( ../sponsors/dc-plastering-light.png -filter Lanczos -resize 186x30 \
    -background none -gravity center -extent 186x30 \) \
    -gravity northwest -geometry +892+841 -composite \
  \( ../sponsors/est-group-light.png -filter Lanczos -resize 104x54 \
    -background none -gravity center -extent 104x54 \) \
    -gravity northwest -geometry +1167+823 -composite \
  -alpha off -depth 8 -define png:color-type=2 -strip youtube-banner.png
```

Crop x=508, y=509, width=1544, height=422 and scale it to 390px wide before
upload. The wordmark and both labels must read, all primary marks must be
recognisable, and both secondary marks must remain distinguishable. Also
inspect a centred 2560x423 desktop band and the full TV canvas; neither may clip
content. The current non-background bounds are 1396x341 at +533+536.

Whenever the sponsor list, order, or tiers in `src/data/sponsors.ts` change,
regenerate and re-upload `youtube-banner.png`. The same sponsor change must
also regenerate the `veo-lower-banner` and `veo-cover` assets named beside the
sponsor source of truth.

After merge, a channel admin uploads the profile PNG under **Picture**, the
watermark PNG under **Video watermark**, and the banner PNG under **Banner
image**. Check the profile in YouTube's light and dark themes, the watermark in
video playback, and the banner on desktop, a phone, and a TV when available.
These operator actions do not block the repository changes or issue closure.
