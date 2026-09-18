# /// script
# requires-python = ">=3.11"
# dependencies = ["fonttools==4.60.1", "uharfbuzz==0.51.1"]
# ///
"""Generate the YouTube playlist thumbnails in src/assets/logo/.

Writes youtube-playlist-<slug>.svg and .png for every row in PLAYLISTS.
The SVGs link veo-upper-right-mark.svg and contain Archivo outlines, so they
do not depend on installed fonts. The PNGs are exported with the pinned
ImageMagick + librsvg renderer. See "Playlist thumbnails" in docs/youtube.md.

Usage (from the repository root):
    uv run scripts/youtube-playlist-thumbnails.py --font 'Archivo[wdth,wght].ttf'
"""

import argparse
import hashlib
import re
import subprocess
import sys
from pathlib import Path

import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

# One row per playlist: (playlist name, file slug). Add a row for a new
# playlist, then rerun. The widest name sets the shared type size.
PLAYLISTS = [
    ("Games U11", "games-u11"),
    ("Games U12", "games-u12"),
    ("Cup U12", "cup-u12"),
    ("Training U12", "training-u12"),
    ("Training U11", "training-u11"),
    ("Tour U10", "tour-u10"),
    ("Tour U11", "tour-u11"),
]
PREFIX = "#1415"

FONT_SHA256 = "0e094a7d3c7c4c25cf1310c4b30014f1dae9332220b1c2c88f4fa996f0b05053"
MAGICK_VERSION = "ImageMagick 7.1.2-31 "
RSVG_ROW = re.compile(
    r"^\s*RSVG\*\s+rw\+\s+Librsvg SVG renderer \(RSVG 2\.62\.3\)$", re.M
)

WIDTH, HEIGHT = 1280, 720
BACKGROUND = "#1a1a1a"
MARGIN = 64
# Visible (alpha) bounds of veo-upper-right-mark.png on its 1024 canvas.
MARK_CANVAS, MARK_LEFT, MARK_TOP, MARK_W, MARK_H = 1024, 207, 125, 672, 707
MARK_BOX = 580  # rendered size of the square mark canvas
MARK_VISIBLE_LEFT = 88
TEXT_GAP = 56  # between the visible mark and the text column
PREFIX_SCALE = 0.56  # "#1415" size relative to the playlist name
LINE_GAP = 0.3  # gap between the two cap heights, relative to the name size

LOGO_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "logo"


def num(value):
    text = f"{value:.2f}".rstrip("0").rstrip(".")
    return "0" if text == "-0" else text


class Face:
    def __init__(self, blob, weight):
        self.face = hb.Face(blob)
        self.font = hb.Font(self.face)
        self.font.set_variations({"wdth": 100, "wght": weight})
        self.upem = self.face.upem

    def shape(self, text):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(self.font, buf, {"kern": True, "liga": False})
        x = 0
        for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
            yield info.codepoint, x + pos.x_offset, pos.y_offset
            x += pos.x_advance

    def draw(self, text, pen, size, x, baseline):
        scale = size / self.upem
        for gid, gx, gy in self.shape(text):
            transform = (scale, 0, 0, -scale, x + gx * scale, baseline - gy * scale)
            self.font.draw_glyph_with_pen(gid, TransformPen(pen, transform))

    def bounds(self, text, size):
        pen = BoundsPen(None)
        self.draw(text, pen, size, 0, 0)
        return pen.bounds  # (xmin, ymin, xmax, ymax) in SVG coordinates

    def path(self, text, size, x, baseline):
        pen = SVGPathPen(None, ntos=num)
        self.draw(text, pen, size, x, baseline)
        return pen.getCommands()

    def cap_height(self, size):
        _, top, _, bottom = self.bounds("H", size)
        return bottom - top


def layout(name_face, prefix_face):
    scale = MARK_BOX / MARK_CANVAS
    mark_x = round(MARK_VISIBLE_LEFT - MARK_LEFT * scale)
    mark_y = round(HEIGHT / 2 - (MARK_TOP + MARK_H / 2) * scale)
    text_x = MARK_VISIBLE_LEFT + round(MARK_W * scale) + TEXT_GAP

    # Largest whole-pixel size where every name ends inside the right margin.
    column = WIDTH - MARGIN - text_x
    widest = max(name_face.bounds(name, 1000)[2] for name, _ in PLAYLISTS)
    name_size = int(column * 1000 / widest)
    prefix_size = round(name_size * PREFIX_SCALE)

    prefix_cap = prefix_face.cap_height(prefix_size)
    name_cap = name_face.cap_height(name_size)
    gap = name_size * LINE_GAP
    top = HEIGHT / 2 - (prefix_cap + gap + name_cap) / 2
    prefix_baseline = round(top + prefix_cap)
    name_baseline = round(top + prefix_cap + gap + name_cap)
    return {
        "mark": (mark_x, mark_y),
        "text_x": text_x,
        "name_size": name_size,
        "prefix_size": prefix_size,
        "prefix_baseline": prefix_baseline,
        "name_baseline": name_baseline,
    }


def svg(name, geo, name_face, prefix_face, font_note):
    mark_x, mark_y = geo["mark"]
    x = geo["text_x"]
    prefix_d = prefix_face.path(PREFIX, geo["prefix_size"], x, geo["prefix_baseline"])
    name_d = name_face.path(name, geo["name_size"], x, geo["name_baseline"])
    label = f"{PREFIX} {name}"
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}" role="img" aria-labelledby="title desc">
  <title id="title">Rhiwbina Squirrels {label} YouTube playlist thumbnail</title>
  <desc id="desc">White squirrel club mark on a solid dark background beside the label {label}.</desc>
  <metadata>Generated by scripts/youtube-playlist-thumbnails.py; edit the script, not this file. Canvas {WIDTH}x{HEIGHT}. Background {BACKGROUND}. Linked club mark: veo-upper-right-mark.svg. {font_note}</metadata>
  <rect id="background" width="{WIDTH}" height="{HEIGHT}" fill="{BACKGROUND}"/>
  <g id="squirrel-mark" aria-label="Rhiwbina Squirrels mark">
    <image href="veo-upper-right-mark.svg" x="{mark_x}" y="{mark_y}" width="{MARK_BOX}" height="{MARK_BOX}" preserveAspectRatio="xMidYMid meet"/>
  </g>
  <g id="label" fill="#ffffff" aria-label="{label}">
    <path id="label-prefix" aria-label="{PREFIX}" d="{prefix_d}"/>
    <path id="label-playlist" aria-label="{name}" d="{name_d}"/>
  </g>
</svg>
"""


def check_renderer():
    version = subprocess.run(
        ["magick", "-version"], check=True, capture_output=True, text=True
    ).stdout
    formats = subprocess.run(
        ["magick", "-list", "format"], check=True, capture_output=True, text=True
    ).stdout
    if not version.startswith(f"Version: {MAGICK_VERSION}") or not RSVG_ROW.search(
        formats
    ):
        sys.exit("error: need ImageMagick 7.1.2-31 with the librsvg 2.62.3 delegate")


def export_png(svg_text, geo, png_path):
    # librsvg does not reliably place the relative <image> link through
    # ImageMagick, so render everything else, then composite the mark PNG.
    without_mark = re.sub(r"\s*<image [^>]*/>", "", svg_text)
    mark_x, mark_y = geo["mark"]
    subprocess.run(
        [
            "magick",
            "-background", BACKGROUND, "rsvg:-", "-alpha", "off",
            "(", str(LOGO_DIR / "veo-upper-right-mark.png"),
            "-filter", "Lanczos", "-resize", f"{MARK_BOX}x{MARK_BOX}", ")",
            "-gravity", "northwest", "-geometry", f"{mark_x:+d}{mark_y:+d}",
            "-composite",
            "-alpha", "off", "-depth", "8", "-define", "png:color-type=2",
            "-strip", str(png_path),
        ],
        input=without_mark.encode(),
        check=True,
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--font", required=True, type=Path, help="Archivo[wdth,wght].ttf")
    args = parser.parse_args()

    font_bytes = args.font.read_bytes()
    if hashlib.sha256(font_bytes).hexdigest() != FONT_SHA256:
        sys.exit(f"error: {args.font} is not Archivo[wdth,wght].ttf {FONT_SHA256}")
    check_renderer()

    blob = hb.Blob(font_bytes)
    name_face, prefix_face = Face(blob, 800), Face(blob, 700)
    geo = layout(name_face, prefix_face)
    font_note = (
        f"Text outlined from Archivo at width 100, weight 700 for {PREFIX} and 800 "
        f"for the playlist name ({geo['name_size']}px), using Google Fonts "
        f"Archivo[wdth,wght].ttf SHA-256 {FONT_SHA256}."
    )

    for name, slug in PLAYLISTS:
        svg_text = svg(name, geo, name_face, prefix_face, font_note)
        svg_path = LOGO_DIR / f"youtube-playlist-{slug}.svg"
        svg_path.write_text(svg_text)
        export_png(svg_text, geo, svg_path.with_suffix(".png"))
        print(f"wrote {svg_path.relative_to(LOGO_DIR.parents[2])} and .png")
    print(f"geometry: {geo}")


if __name__ == "__main__":
    main()
