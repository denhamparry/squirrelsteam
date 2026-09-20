# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "opencv-python-headless==4.12.0.88",
#   "Pillow==11.3.0",
#   "qrcode[pil]==8.2",
# ]
# ///
"""Generate the club QR-code assets in src/assets/logo/.

Run from the repository root with `uv run scripts/qr-codes.py`. The tracked
Archivo Bold font is used by default; every font source is SHA-256 checked.
"""

import argparse
import hashlib
import sys
from dataclasses import dataclass
from io import BytesIO
from pathlib import Path

import cv2
import numpy as np
import qrcode
from PIL import Image, ImageDraw, ImageFont
from qrcode.constants import ERROR_CORRECT_H

INK = (0x1A, 0x1A, 0x1A)
WHITE = (255, 255, 255)
CODE_TARGET_PX = 1200
BORDER_MODULES = 4
SCALES = (1.0, 0.5, 0.25)
FONT_SHA256 = "bed60488c2f5c0b24e01d931760b6f3e9a82619dcd081ed9bff643d9f4fd9e3d"
ROOT = Path(__file__).resolve().parent.parent
CREST = ROOT / "src/assets/logo/veo-crest.png"
DEFAULT_OUTPUT_DIR = ROOT / "src/assets/logo"
DEFAULT_FONT = Path(__file__).resolve().parent / "assets/archivo/Archivo-Bold.ttf"


@dataclass(frozen=True)
class Asset:
    filename: str
    url: str
    foreground: tuple[int, int, int]
    background: tuple[int, int, int]

    @property
    def is_inverted(self):
        return self.background != WHITE


ASSETS = (
    Asset("qr-squirrels-team-black-on-white.png", "https://squirrels.team/", INK, WHITE),
    Asset("qr-squirrels-team-white-on-black.png", "https://squirrels.team/", WHITE, INK),
    Asset(
        "qr-player-squirrels-team-black-on-white.png",
        "https://player.squirrels.team/",
        INK,
        WHITE,
    ),
    Asset(
        "qr-player-squirrels-team-white-on-black.png",
        "https://player.squirrels.team/",
        WHITE,
        INK,
    ),
)
LABELS = tuple(dict.fromkeys(asset.url for asset in ASSETS))


def font_bytes(path):
    """Read a verified Archivo Bold font from the requested or tracked path."""
    source = path or DEFAULT_FONT
    data = source.read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    if digest != FONT_SHA256:
        sys.exit(f"error: Archivo Bold from {source} has SHA-256 {digest}, expected {FONT_SHA256}")
    return data


def qr_image(asset):
    """Make an H-correction QR image with an exact four-module quiet zone."""
    probe = qrcode.QRCode(error_correction=ERROR_CORRECT_H, border=BORDER_MODULES, box_size=1)
    probe.add_data(asset.url)
    probe.make(fit=True)
    modules = probe.modules_count + 2 * BORDER_MODULES
    box_size = CODE_TARGET_PX // modules
    qr = qrcode.QRCode(
        version=probe.version,
        error_correction=ERROR_CORRECT_H,
        border=BORDER_MODULES,
        box_size=box_size,
    )
    qr.add_data(asset.url)
    qr.make(fit=False)
    return qr.make_image(fill_color=asset.foreground, back_color=asset.background).convert("RGB"), qr.version


def font_for(font_data):
    """Use one caption size that fits the longest label within every output."""
    narrowest_code = min(qr_image(asset)[0].width for asset in ASSETS)
    font_size = int(round(narrowest_code * 0.12) * 0.42)
    while font_size:
        font = ImageFont.truetype(BytesIO(font_data), font_size)
        if max(font.getlength(label) for label in LABELS) <= narrowest_code * 0.86:
            return font
        font_size -= 1
    raise RuntimeError("could not fit QR captions")


def compose(asset, font):
    code, version = qr_image(asset)
    code_width = code.width
    logo_size = round(code_width * 0.22)
    padding = round(logo_size * 0.12)
    tile_size = logo_size + 2 * padding
    tile_left = (code_width - tile_size) // 2
    radius = tile_size // 5

    code_draw = ImageDraw.Draw(code)
    code_draw.rounded_rectangle(
        (tile_left, tile_left, tile_left + tile_size - 1, tile_left + tile_size - 1),
        radius=radius,
        fill=asset.background,
    )
    crest = Image.open(CREST).convert("RGBA").resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    crest_mask = Image.new("L", (logo_size, logo_size), 0)
    ImageDraw.Draw(crest_mask).rounded_rectangle(
        (0, 0, logo_size - 1, logo_size - 1), radius=logo_size // 6, fill=255
    )
    code.paste(crest, (tile_left + padding, tile_left + padding), crest_mask)

    caption_height = round(code_width * 0.12)
    canvas = Image.new("RGB", (code_width, code_width + caption_height), asset.background)
    canvas.paste(code, (0, 0))
    ImageDraw.Draw(canvas).text(
        (code_width / 2, code_width + caption_height / 2),
        asset.url,
        fill=asset.foreground,
        font=font,
        anchor="mm",
    )
    return canvas, version, font.size


def decoded_value(image):
    pixels = cv2.cvtColor(np.asarray(image), cv2.COLOR_RGB2BGR)
    values = []
    for scale in SCALES:
        resized = cv2.resize(pixels, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
        direct, _, _ = cv2.QRCodeDetector().detectAndDecode(resized)
        inverted, _, _ = cv2.QRCodeDetector().detectAndDecode(255 - resized)
        values.append((scale, direct, inverted))
    return values


def verify(asset, image):
    """Reject output unless each scale decodes in its intended polarity."""
    results = decoded_value(image)
    if asset.is_inverted:
        ok = all(inverted == asset.url for _, _, inverted in results)
    else:
        ok = all(direct == asset.url for _, direct, _ in results)
    summary = ", ".join(
        f"{scale:g}x direct={'yes' if direct == asset.url else 'no'} "
        f"inverted={'yes' if inverted == asset.url else 'no'}"
        for scale, direct, inverted in results
    )
    if not ok:
        raise RuntimeError(f"decode failed for {asset.filename}: {summary}")
    return summary


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument(
        "--font",
        type=Path,
        help="verified Archivo Bold TTF; omit to use the tracked font",
    )
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    args = parser.parse_args()

    if not CREST.is_file():
        sys.exit(f"error: required crest is missing: {CREST}")
    args.output_dir.mkdir(parents=True, exist_ok=True)
    font_data = font_bytes(args.font)
    caption_font = font_for(font_data)
    rendered = []
    for asset in ASSETS:
        image, version, font_size = compose(asset, caption_font)
        summary = verify(asset, image)
        rendered.append((asset, image, version, font_size, summary))

    for asset, image, version, font_size, summary in rendered:
        output = args.output_dir / asset.filename
        image.save(output, format="PNG", optimize=True)
        print(f"{output}: QR v{version}, {image.width}x{image.height}, Archivo Bold {font_size}px; {summary}")


if __name__ == "__main__":
    main()
