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

After merge, a channel admin uploads the profile PNG under **Picture** and the
watermark PNG under **Video watermark**, then checks the channel in YouTube's
light and dark themes and on a phone. This operator action does not block the
repository change or issue closure.
