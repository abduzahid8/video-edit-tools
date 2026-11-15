#!/usr/bin/env python3
"""Cut a plain studio background out of a photo.

Usage: python3 scripts/cutout.py <in> <out.png> [--tol N] [--local N] [--fill N] [--drop N] [--feather N]

Removes background pixels connected to the image border using a flood fill
seeded at the four corners. `--tol` is the seed tolerance; `--local` switches
to region-growing (each pixel compared to its removed neighbour) which follows
slow gradients and detached white blobs without eroding high-contrast areas.
`--fill N` re-fills enclosed transparent holes up to N px (faces/collars the
flood ate); `--drop N` deletes opaque fragments smaller than N px (confetti,
floor debris). Feathering softens the alpha edge.
"""
from __future__ import annotations

import sys
from collections import deque

from PIL import Image, ImageFilter


def cutout(
    src: str,
    dst: str,
    tol: int = 26,
    feather: int = 1,
    local: int = 0,
    fill: int = 0,
    drop: int = 0,
    island: bool = False,
    restore: list[tuple[int, int, int, int]] | None = None,
) -> None:
    """Border-seeded background removal.

    tol  = global tolerance vs. the corner-average seed colour (seeding only).
    local = region-growing tolerance: when > 0, a pixel joins the background if
    it is within `local` of the *already-removed neighbour*, so slow gradients
    and detached white blobs are consumed without eroding high-contrast
    features (faces) that a large global tolerance would eat.
    restore = list of (x0, y0, x1, y1) pixel rects forced back to opaque —
    for regions whose colour matches the backdrop (a neck lit like the
    background) that no tolerance can separate.
    """
    im = Image.open(src).convert("RGB")
    w, h = im.size
    px = im.load()

    # Seed colour = average of the four corner patches.
    corners = [(2, 2), (w - 3, 2), (2, h - 3), (w - 3, h - 3)]
    seeds = [px[x, y] for x, y in corners]
    sr = sum(c[0] for c in seeds) // 4
    sg = sum(c[1] for c in seeds) // 4
    sb = sum(c[2] for c in seeds) // 4

    alpha = bytearray([255]) * (w * h)
    seen = bytearray(w * h)
    queue: deque[tuple[int, int]] = deque()

    def matches_seed(x: int, y: int) -> bool:
        r, g, b = px[x, y]
        for cr, cg, cb in seeds:
            if abs(r - cr) <= tol and abs(g - cg) <= tol and abs(b - cb) <= tol:
                return True
        return False

    # Global anchor bound for local growing: pixels must stay within `tol`
    # of the *average* corner colour (not any single corner — the darker
    # corner of a gradient backdrop also matches skin tones), so smooth
    # shading inside a figure cannot be walked through.
    def within_global(x: int, y: int) -> bool:
        r, g, b = px[x, y]
        return abs(r - sr) <= tol and abs(g - sg) <= tol and abs(b - sb) <= tol

    for x in range(w):
        for y in (0, h - 1):
            if not seen[y * w + x] and matches_seed(x, y):
                seen[y * w + x] = 1
                queue.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not seen[y * w + x] and matches_seed(x, y):
                seen[y * w + x] = 1
                queue.append((x, y))

    while queue:
        x, y = queue.popleft()
        alpha[y * w + x] = 0
        pr, pg, pb = px[x, y]
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
                if local > 0:
                    nr, ng, nb = px[nx, ny]
                    ok = (
                        abs(nr - pr) <= local
                        and abs(ng - pg) <= local
                        and abs(nb - pb) <= local
                        and within_global(nx, ny)
                    )
                else:
                    ok = matches_seed(nx, ny)
                if ok:
                    seen[ny * w + nx] = 1
                    queue.append((nx, ny))

    # Optional cleanup -----------------------------------------------------
    if drop > 0:
        # Drop small opaque fragments (confetti, floor debris) while keeping
        # every figure, however many disconnected components there are.
        comp = [0] * (w * h)
        cid = 0
        dropped = 0
        for start in range(w * h):
            if alpha[start] and not comp[start]:
                cid += 1
                stack = [start]
                comp[start] = cid
                cells: list[int] = []
                while stack:
                    idx = stack.pop()
                    cells.append(idx)
                    x, y = idx % w, idx // w
                    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                        if 0 <= nx < w and 0 <= ny < h:
                            nidx = ny * w + nx
                            if alpha[nidx] and not comp[nidx]:
                                comp[nidx] = cid
                                stack.append(nidx)
                if len(cells) < drop:
                    for idx in cells:
                        alpha[idx] = 0
                    dropped += 1
        print(f"  dropped {dropped} of {cid} opaque components smaller than {drop} px")

    if fill > 0:
        # Fill enclosed transparent holes (faces, collars eaten by the flood).
        # Only holes not reaching the image border are touched.
        seen_h = bytearray(w * h)
        queue_h: deque[tuple[int, int]] = deque()
        for x in range(w):
            for y in (0, h - 1):
                if not alpha[y * w + x] and not seen_h[y * w + x]:
                    seen_h[y * w + x] = 1
                    queue_h.append((x, y))
        for y in range(h):
            for x in (0, w - 1):
                if not alpha[y * w + x] and not seen_h[y * w + x]:
                    seen_h[y * w + x] = 1
                    queue_h.append((x, y))
        while queue_h:
            x, y = queue_h.popleft()
            seen_h[y * w + x] = 1
            for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if 0 <= nx < w and 0 <= ny < h and not seen_h[ny * w + nx]:
                    if not alpha[ny * w + nx]:
                        seen_h[ny * w + nx] = 1
                        queue_h.append((nx, ny))
        # Every transparent pixel not reached from the border is a hole.
        filled = 0
        for idx in range(w * h):
            if not alpha[idx] and not seen_h[idx]:
                # BFS to size and fill
                stack = [idx]
                seen_h[idx] = 1
                cells = []
                while stack:
                    i2 = stack.pop()
                    cells.append(i2)
                    x, y = i2 % w, i2 // w
                    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                        if 0 <= nx < w and 0 <= ny < h:
                            nidx = ny * w + nx
                            if not alpha[nidx] and not seen_h[nidx]:
                                seen_h[nidx] = 1
                                stack.append(nidx)
                if len(cells) <= fill:
                    for i2 in cells:
                        alpha[i2] = 255
                    filled += len(cells)
        if filled:
            print(f"  filled {filled} px of enclosed holes")

    if restore:
        for x0, y0, x1, y1 in restore:
            for y in range(max(0, y0), min(h, y1)):
                for x in range(max(0, x0), min(w, x1)):
                    alpha[y * w + x] = 255
        print(f"  restored {len(restore)} rect(s) to opaque")

    out = im.convert("RGBA")
    out.putalpha(Image.frombytes("L", (w, h), bytes(alpha)))
    if feather > 0:
        out.putalpha(out.getchannel("A").filter(ImageFilter.GaussianBlur(feather)))

    # Trim fully transparent margins so the figure can be anchored precisely.
    bbox = out.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    if bbox:
        out = out.crop(bbox)
        print(f"  trim bbox {bbox}")
    out.save(dst)
    removed = sum(1 for a in alpha if a == 0)
    print(f"{dst} {out.size} removed={removed * 100 // (w * h)}%")


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    tol = 26
    feather = 1
    local = 0
    if "--tol" in sys.argv:
        tol = int(sys.argv[sys.argv.index("--tol") + 1])
    if "--feather" in sys.argv:
        feather = int(sys.argv[sys.argv.index("--feather") + 1])
    if "--local" in sys.argv:
        local = int(sys.argv[sys.argv.index("--local") + 1])
    if "--fill" in sys.argv:
        fill = int(sys.argv[sys.argv.index("--fill") + 1])
    drop = 0
    if "--drop" in sys.argv:
        drop = int(sys.argv[sys.argv.index("--drop") + 1])
    restore: list[tuple[int, int, int, int]] = []
    if "--restore" in sys.argv:
        for part in sys.argv[sys.argv.index("--restore") + 1].split():
            x0, y0, x1, y1 = (int(v) for v in part.split(","))
            restore.append((x0, y0, x1, y1))
    if len(args) < 2:
        print(__doc__)
        return 1
    cutout(args[0], args[1], tol, feather, local, fill, drop, restore=restore)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
