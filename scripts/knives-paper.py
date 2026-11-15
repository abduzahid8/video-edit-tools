#!/usr/bin/env python3
"""Deterministic off-white editorial paper texture for the Knives Out study.

No stock textures, no AI generation. Low-frequency mottling, fine fibre grain,
a few faint fold creases and dust specks, and a barely-there edge vignette.
"""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

W, H = 1080, 1920
rng = np.random.default_rng(1947)

# Warm off-white base.
base = np.array([244.0, 239.0, 229.0], dtype=np.float32)
img = np.ones((H, W, 3), dtype=np.float32) * base

# Broad paper mottling: smooth low-frequency noise, then a finer layer.
def smooth_noise(h: int, w: int, sigma: float) -> np.ndarray:
    n = rng.normal(0, 1, (h, w)).astype(np.float32)
    return gaussian_filter(n, sigma=sigma, mode="reflect")

broad = smooth_noise(54, 30, 9)
broad = np.array(Image.fromarray(broad).resize((W, H), Image.BICUBIC), dtype=np.float32)
broad /= max(1e-5, np.abs(broad).max())
img += broad[..., None] * np.array([4.0, 3.8, 3.4], dtype=np.float32)

mid = smooth_noise(H // 4, W // 4, 5)
mid = np.array(Image.fromarray(mid).resize((W, H), Image.BICUBIC), dtype=np.float32)
mid /= max(1e-5, np.abs(mid).max())
img += mid[..., None] * np.array([2.0, 1.9, 1.7], dtype=np.float32)

# Fine grain, slightly stronger in the red channel like real paper.
grain = rng.normal(0, 1, (H, W)).astype(np.float32)
img += grain[..., None] * np.array([1.35, 1.2, 1.05], dtype=np.float32)

# Horizontal fibres.
fibre = np.zeros((H, W), dtype=np.float32)
for _ in range(900):
    y = int(rng.integers(0, H))
    x = int(rng.integers(0, W))
    length = int(rng.integers(8, 70))
    alpha = float(rng.uniform(0.25, 1.0))
    yy = np.clip(y + rng.integers(-1, 2, length), 0, H - 1)
    xx = np.clip(np.arange(x, x + length), 0, W - 1)
    fibre[yy, xx] += alpha
fibre = gaussian_filter(fibre, sigma=0.45, mode="reflect")
img += fibre[..., None] * np.array([1.0, 0.9, 0.75], dtype=np.float32)

# Faint fold creases: two horizontals and one vertical, with soft light/dark edges.
yy = np.arange(H, dtype=np.float32)
xx = np.arange(W, dtype=np.float32)
crease = np.zeros((H, W), dtype=np.float32)
for cy, strength in ((610, 1.0), (1290, 0.8)):
    d = (yy - cy)[:, None]
    crease += (np.exp(-(d + 1.4) ** 2 / 5.0) * 0.9 - np.exp(-(d - 1.4) ** 2 / 5.0) * 0.9) * strength
for cx, strength in ((538, 0.55),):
    d = (xx - cx)[None, :]
    crease += (np.exp(-(d + 1.8) ** 2 / 8.0) * 0.55 - np.exp(-(d - 1.8) ** 2 / 8.0) * 0.55) * strength
img += crease[..., None] * np.array([2.6, 2.4, 2.1], dtype=np.float32)

# Dust specks.
for _ in range(130):
    x = int(rng.integers(0, W))
    y = int(rng.integers(0, H))
    r = int(rng.integers(0, 2))
    tone = float(rng.uniform(0.35, 0.8))
    img[max(0, y - r):y + r + 1, max(0, x - r):x + r + 1] -= tone

# Barely-there vignette so the paper feels photographed, not flat.
gy, gx = np.mgrid[0:H, 0:W]
nx = (gx - W / 2) / (W / 2)
ny = (gy - H / 2) / (H / 2)
vignette = np.clip(np.sqrt(nx * nx * 0.55 + ny * ny * 0.45), 0, 1) ** 2.2
img -= vignette[..., None] * np.array([5.0, 4.7, 4.1], dtype=np.float32)

img = np.clip(img, 0, 255).astype(np.uint8)
out = Path("public/assets/knives-out/paper-grain.jpg")
out.parent.mkdir(parents=True, exist_ok=True)
Image.fromarray(img, "RGB").save(out, quality=94, subsampling=1)
print(out, W, H)
