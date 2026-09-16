# YouTube

## Channel identity

The team channel is public even when every video is private. Keep its public
profile limited to these approved fields:

| Field | Value |
| --- | --- |
| Name | `Rhiwbina Squirrels #1415` |
| Handle | `@RhiwbinaSquirrels1415` |
| Handle URL | `https://www.youtube.com/@RhiwbinaSquirrels1415` |
| Channel URL | `https://www.youtube.com/channel/UCcLOeW_zsRG_uY2Rk9bkb-g` |
| Links | `https://squirrels.team` and `https://www.instagram.com/rhiwbinarfc1415/` |
| Contact | `contact@squirrels.team` |

Do not put an approved-account list, consent status, player detail, private
schedule, credential, or stream information on the channel page.

Suggested public description:

> The YouTube channel for Rhiwbina Squirrels #1415, the 2014/15 age group of
> Rhiwbina R.F.C. in Cardiff. Match and training videos are private and shared
> only with players' families approved by the team. Fixtures, training and
> news: <https://squirrels.team>

## Restricted-viewing model

Upload every match, training session, and highlight with **Private** visibility,
then use **Share privately** for the team's approved Google accounts. YouTube's
[visibility guidance](https://support.google.com/youtube/answer/157177) says a
private video is visible only to its owner and chosen recipients, does not
appear on the channel's Videos tab or in search, and has no comments. A viewer
must sign in to the exact account that was invited.

Private sharing is configured separately on every video; there is no
channel-wide approved-account list. It is the closest YouTube access model to
the team's requirement, but it does not make the public channel profile
private.

Do not substitute either of these access models:

- **Unlisted:** anyone with the link can watch and reshare it without signing
  in, so it does not restrict viewing to approved accounts.
- **Members-only:** this is paid fan access for eligible channels in the
  [YouTube Partner Programme](https://support.google.com/youtube/answer/13429240),
  not an allowlist of family accounts. It would add payment and eligibility
  requirements without meeting the access rule.

### Recipient limit

Older official YouTube
[migration guidance](https://support.google.com/youtube/answer/9230970) states
that a private video can be shared with up to 50 email addresses. The current
visibility article does not publish a number, so **confirm the limit shown in
YouTube Studio before collecting or using the list**. Studio's current limit
controls.

Count the approved accounts before the first upload. If the count is above the
limit displayed by Studio, stop and take options to the maintainer. Do not omit
a family, switch to Unlisted, or use a paid membership as a workaround.

## Private records outside the repository

Team admins maintain the approved Google-account list and written consent
records in the club's authorised record system, outside this repository. Never
put either record in Git, an issue, a pull request, a video title, or a video
description. A non-Gmail address can be used only when the family confirms it
is the address of the Google account they will use to sign in.

The external operational record should let an authorised admin determine which
account is approved, which videos it has been invited to, and whether the
required consent and welfare approval are current. Do not copy that record
into this runbook.

### Add an approved account

1. Confirm outside the repository that the account and all required consents
   are approved, and that adding it will stay within Studio's displayed limit.
2. In YouTube Studio on a computer, open **Content**, select an applicable
   video, open **Visibility**, then choose **Share privately**.
3. Add the exact approved Google-account address, save the video, and repeat
   for every existing video the account is allowed to watch. YouTube's
   [channel-permissions guidance](https://support.google.com/youtube/answer/9481328)
   notes that private-video sharing is not available in the Studio mobile app.
4. Ask the recipient to test while signed in to that exact account. Record the
   completed invitations only in the external operational record.

There is no one-time channel invitation that grants access to all current and
future private videos.

### Remove or replace an approved account

1. Identify every video shared with the account from the external operational
   record and from Studio; do not assume changing the external list revokes
   YouTube access.
2. Open **Visibility** then **Share privately** on every identified video,
   remove the account, and save each change.
3. If an approved replacement account is supplied, add it separately to every
   applicable video and verify it as described above.
4. Update the external record and have a second authorised admin check that no
   old invitation remains.

## Safeguarding and consent gate

No video may be uploaded or streamed until all of these conditions are met:

- Written parental or guardian consent covers filming and private sharing for
  every player who may appear, and the club welfare or safeguarding officer
  has approved the approach. YouTube's
  [child-safety best practices](https://support.google.com/youtube/answer/9229229)
  also require consent from a minor's parent or legal guardian.
- A player without current consent will not appear. If they cannot reliably be
  kept out of shot, do not publish or stream the recording.
- The title, description, thumbnail, spoken introduction, and other metadata
  contain no player's name, age, date of birth, school, contact detail, or
  other personal information. Use neutral metadata such as
  `vs Opponent RFC - 2026-09-20`.
- The administrator has made an accurate audience decision using YouTube's
  [made-for-kids FAQ](https://support.google.com/youtube/answer/9684541). Do not
  use the setting as a substitute for consent or private sharing.

Consent and welfare records are sensitive operational records and must remain
outside the repository.

## Per-video upload checklist

Complete this checklist for every recording; upload defaults are only a safety
net and do not replace the check.

- [ ] All players who may appear pass the safeguarding and consent gate.
- [ ] The title and description are neutral and contain no personal details.
- [ ] Visibility is **Private** before the upload or processing completes.
- [ ] The audience setting is accurate for this video.
- [ ] Comments are off. Private videos do not support comments, but keep the
      explicit setting off in case visibility is changed accidentally later.
- [ ] **Share privately** contains the complete current approved list, uses the
      exact Google-account addresses, and stays within Studio's displayed
      limit.
- [ ] After saving, reopen Visibility and verify **Private** plus the recipient
      list; test playback with an invited account that is not a channel admin.
- [ ] Update only the external operational record. Do not paste recipients or
      consent evidence into the repository.

## Veo private live streaming

Veo's
[YouTube live-streaming guide](https://support.veo.com/hc/en-us/articles/26783279685265-How-to-livestream-to-YouTube-with-your-Veo-Cam)
requires a Veo Cam 2 or Cam 3, the Veo Live add-on, and a YouTube channel with
live streaming enabled. Initial YouTube enablement can take up to 24 hours, so
complete it before the test day. Veo's current
[sport-capability guide](https://support.veo.com/hc/en-us/articles/30159089390865-Veo-capabilities-by-sport-features-and-differences-explained)
lists live streaming as officially supported for football but not rugby. Do not
assume that this rugby team's account or camera will offer a supported live
workflow; confirm the current capability with Veo before relying on it.

YouTube documents Private as a
[live-stream visibility](https://support.google.com/youtube/answer/9854503), but
its help does not clearly guarantee that a Veo-created live event supports the
same invited-account flow as an uploaded private video. Treat live access as
unverified until this end-to-end test passes. The test must bind Veo to the
exact event whose privacy was checked; a separately scheduled Private event
does not prove that an event created automatically by Veo is also Private.

1. Complete the safeguarding and consent gate for the private test. Use an
   empty pitch or consenting adults rather than players for the first test.
2. Enable live streaming in YouTube Studio. In Veo's Streaming Destinations,
   add YouTube with **Use stream key** and enable **Request stream key when
   starting live stream**. Do not use the connected-account shortcut for a
   player stream unless a later test proves exactly which event it creates and
   confirms that event before players enter frame.
3. In YouTube Studio, schedule one uniquely titled test event with **Private**
   visibility and attempt to share it privately with a separate approved test
   account. Create or select a stream key that is not assigned to any other
   current or upcoming event, bind it to this event, and copy it using an
   approved secret-handling method. Never put a stream key in Git, an issue, a
   message, or the external account list.
4. Point the camera at an empty pitch or consenting adults. In the Veo Cam App,
   choose **Go Live**, enter neutral details, select YouTube, and paste the
   unique key for that exact test event when prompted.
5. Before any player enters frame, identify the active event in Studio and
   verify that it is the uniquely titled event, its visibility is Private, and
   its recipient list is correct. Confirm that the invited account can watch
   only when signed in to that exact account, while a signed-out browser and a
   different account cannot watch.
6. End the test and confirm the archived recording remains Private with the
   intended recipient list. Rotate or discard the event-specific stream key.

If Studio does not offer invited sharing for the live event, or any access
check fails, **do not live-stream matches or training**. Record locally with
Veo, upload the finished recording as Private, apply Share privately, and take
alternative options to the maintainer. Unlisted is not an acceptable fallback.

For every later live stream, repeat the same unique-event and unique-key
binding, keep players out of frame until the exact active event passes the
privacy checks, repeat the per-video checklist, disable live chat, and keep a
coach or official visibly present. YouTube's
[child-safety policy](https://support.google.com/youtube/answer/2801999) warns
that streams featuring minors under 16 without a visibly present adult may be
removed or have live chat disabled.

## Channel administration

The channel must belong to a club-controlled Google account protected by
two-step verification. Never share its password. Invite each administrator
through **YouTube Studio > Settings > Permissions**, following YouTube's
[channel-permissions guidance](https://support.google.com/youtube/answer/9481328).

Keep at least two authorised people able to manage the channel, so access does
not depend on one person. Apply least privilege: use Editor for routine uploads
where possible, and reserve Owner or Manager access for people who must manage
permissions or the channel. Review permissions when responsibilities change
and remove access promptly when an administrator leaves the role.

## Operator setup checklist

These actions happen in Google, YouTube Studio, the club's records, or Veo.
They are deliberately **not required to merge this documentation or close
issue #200**.

- [ ] Confirm club-controlled ownership, two-step verification, at least two
      authorised administrators, and no shared password.
- [ ] Invite administrators with least-privilege Studio permissions.
- [ ] Decide and configure the channel or per-video audience default after
      reviewing the made-for-kids guidance.
- [ ] Set upload defaults to Private, comments off, and category Sports.
- [ ] Add the approved public description, links, and contact from the Channel
      identity section.
- [ ] Upload and visually check the profile picture, watermark, and banner from
      the Channel images section.
- [ ] Collect and count approved accounts outside the repository; compare the
      count with Studio's current recipient limit.
- [ ] Record written consent and welfare approval outside the repository before
      the first player recording.
- [ ] Enable YouTube live streaming, allow for activation time, and pass the
      private Veo test before any match or training live stream.

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
