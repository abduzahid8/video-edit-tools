#!/usr/bin/env python3
"""De-fringe the Knives Out product cutouts deterministically.

The white-key extractions keep a soft, near-white studio backdrop as
semi-transparent pixels. On pale paper that reads as a faint box around each
product. This script removes the backdrop by flood-filling the light,
border-connected region (never crossing the solid product), un-premultiplies
the white matte along the remaining edge and writes a clean copy next to the
originals. Originals are left untouched.
"""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation, gaussian_filter, label

SRC = Path("public/assets/knives-out/products")
OUT = SRC / "clean"
OUT.mkdir(parents=True, exist_ok=True)


def clean(path: Path) -> None:
    im = Image.open(path).convert("RGBA")
    arr = np.asarray(im).astype(np.float64)
    rgb = arr[..., :3]
    alpha = arr[..., 3] / 255.0

    # Sample the studio backdrop from fully transparent border pixels.
    border = np.zeros(alpha.shape, dtype=bool)
    border[:24] = border[-24:] = True
    border[:, :24] = border[:, -24:] = True
    sample = rgb[border & (alpha < 0.05)]
    bg = np.median(sample, axis=0) if len(sample) else np.array([245.0, 245.0, 245.0])

    # Light, low-alpha pixels close to the backdrop colour.
    near = (np.abs(rgb - bg).max(axis=2) < 22.0) & (alpha < 0.85)

    # Flood from the frame edge through that mask. Whatever connects is
    # backdrop; pockets enclosed by the product stay.
    lab, n = label(near, structure=np.ones((3, 3), dtype=int))
    edge_ids = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
    edge_ids.discard(0)
    backdrop = np.isin(lab, list(edge_ids))

    # Do not eat into the solid product; grow the keep region a touch.
    solid = alpha > 0.5
    mask = binary_dilation(solid, iterations=1)
    new_alpha = np.where(backdrop & ~mask, 0.0, alpha)

    # A last sweep for pale neutral haloes the flood fill cannot reach (they
    # sit inside the product's bounding box). Solid pixels are untouched.
    light_neutral = (rgb.min(axis=2) > 195.0) & (
        (rgb.max(axis=2) - rgb.min(axis=2)) < 30.0
    )
    new_alpha = np.where((new_alpha < 0.85) & light_neutral, 0.0, new_alpha)

    # Un-premultiply the white matte on what remains.
    a = np.clip(new_alpha, 1e-3, 1.0)[..., None]
    obj = np.clip((rgb - 255.0 * (1.0 - a)) / a, 0.0, 255.0)

    soft = gaussian_filter((new_alpha > 0.35).astype(np.float64), 0.9)
    soft = np.clip((soft - 0.10) / 0.6, 0.0, 1.0)
    soft = np.where(new_alpha >= 0.9, 1.0, soft)

    edge = np.median(obj[alpha > 0.7], axis=0) if (alpha > 0.7).any() else bg
    obj = np.where(soft[..., None] < 0.02, edge, obj)

    out = np.dstack([obj, soft * 255.0]).astype(np.uint8)
    Image.fromarray(out, "RGBA").save(OUT / path.name)


count = 0
for p in sorted(SRC.glob("*-cut.png")):
    clean(p)
    count += 1
print(f"cleaned {count} cutouts -> {OUT}")
