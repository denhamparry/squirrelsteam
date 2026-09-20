# QR code assets

The four PNGs in `src/assets/logo/` are print assets for the public club site
and the player area. They contain no player information.

| Asset | Encoded URL | Colours |
| --- | --- | --- |
| `qr-squirrels-team-black-on-white.png` | `https://squirrels.team/` | `#1a1a1a` on white |
| `qr-squirrels-team-white-on-black.png` | `https://squirrels.team/` | White on `#1a1a1a` |
| `qr-player-squirrels-team-black-on-white.png` | `https://player.squirrels.team/` | `#1a1a1a` on white |
| `qr-player-squirrels-team-white-on-black.png` | `https://player.squirrels.team/` | White on `#1a1a1a` |

Use the black-on-white variant for general printing: it is the broadest
scanner-compatible form. The inverted files are approved brand alternatives,
but older scanner applications may not recognise light-on-dark QR codes.

## Composition

Each code uses error-correction level H, a four-module quiet zone, and an
approximately 1200-pixel-square code. Its centre has the approved
`veo-crest.png` at 22% of the code width, clipped to rounded corners and set
on a rounded pad in the background colour. An Archivo Bold caption below the
code gives the complete URL, including `https://` and the trailing slash. The
longer player URL determines the shared caption size.

## Regenerate and verify

The generator uses `qrcode[pil]`, `Pillow`, `opencv-python-headless`, and
NumPy (provided by OpenCV). [uv](https://docs.astral.sh/uv/) installs the
pinned dependencies declared in the script:

```text
uv run scripts/qr-codes.py
git status --short src/assets/logo
```

It downloads Archivo Bold only when `--font` is omitted. The Google Fonts URL
and SHA-256 (`bed60488c2f5c0b24e01d931760b6f3e9a82619dcd081ed9bff643d9f4fd9e3d`)
are pinned in the script; any supplied `--font` file is checked against the
same digest. Archivo is licensed under the [SIL Open Font License 1.1](https://github.com/google/fonts/blob/main/ofl/archivo/OFL.txt).

Before writing a file, the generator requires OpenCV to decode every QR code
at 1x, 0.5x, and 0.25x. Black-on-white codes must decode directly. The inverted
codes must decode after the generator reverses their colours, because OpenCV's
detector does not reliably read them as-is.

Before sending any version to print, scan all four generated files with an
iPhone camera and an Android camera and record the results in the pull request.
Use black on white where every scanner must work.
