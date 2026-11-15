#!/usr/bin/env python3
"""Build a labeled contact sheet from a directory of images.

Usage: python3 scripts/contact-sheet.py <in-dir> <out.jpg> [cols] [cell]
Each cell shows the image letterboxed on dark grey with its filename label.
"""
import os
import sys

from PIL import Image, ImageDraw

def main() -> int:
    if len(sys.argv) < 3:
        print(__doc__)
        return 1
    in_dir, out = sys.argv[1], sys.argv[2]
    cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
    cell = int(sys.argv[4]) if len(sys.argv) > 4 else 300

    files = sorted(
        f for f in os.listdir(in_dir)
        if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))
    )
    if not files:
        print("no images")
        return 1
    rows = (len(files) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * cell, rows * cell), (35, 35, 35))
    draw = ImageDraw.Draw(sheet)
    for i, name in enumerate(files):
        try:
            im = Image.open(os.path.join(in_dir, name)).convert("RGB")
        except Exception:  # noqa: BLE001 - skip unreadable files
            continue
        im.thumbnail((cell - 8, cell - 32))
        x, y = (i % cols) * cell, (i // cols) * cell
        sheet.paste(im, (x + (cell - im.width) // 2, y + 4))
        draw.text((x + 6, y + cell - 24), name[:36], fill=(255, 220, 110))
    sheet.save(out, quality=88)
    print(f"{out} {sheet.size} {len(files)} images")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
