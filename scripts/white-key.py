#!/usr/bin/env python3
"""Soft white-key for studio product crops.

Unlike a hard threshold, alpha follows colour distance from white, so cream
knitwear stays opaque while paper-white and soft shadows fall away. Keeps the
catalogue cutout usable over warm editorial paper without a blend mode.
"""
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path("public/assets/knives-out/products")
FILES = [
    "knit-lux.png", "knit-budget.png",
    "coat-lux.png", "coat-budget.png",
    "trousers-lux.png", "trousers-budget.png",
    "loafers-lux.png", "loafers-budget.png",
    "sunglasses-lux.png", "sunglasses-budget.png",
]

for name in FILES:
    im = Image.open(ROOT / name).convert("RGB")
    rgb = np.asarray(im, dtype=np.float32)
    dist = np.sqrt(np.sum((255.0 - rgb) ** 2, axis=2))
    # 0 at paper white, 1 once the pixel is clearly product; soft shoulder
    # keeps anti-aliased edges and light contact shadows.
    alpha = np.clip((dist - 2.5) / 18.0, 0.0, 1.0) ** 0.85
    alpha = (alpha * 255).astype(np.uint8)
    out = Image.fromarray(np.dstack([rgb.astype(np.uint8), alpha]), "RGBA")
    bbox = out.getchannel("A").point(lambda a: 255 if a > 6 else 0).getbbox()
    if bbox:
        out = out.crop(bbox)
    dst = ROOT / name.replace(".png", "-cut.png")
    out.save(dst)
    print(dst.name, out.size)
