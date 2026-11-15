"""Prepare selected frames and a moving tailoring detail from the four supplied clips."""
import subprocess
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'public/assets/wardrobe-models'
ASSETS.mkdir(exist_ok=True)
SOURCES = {i: Path.home() / 'Downloads' / f'test{i}.mp4' for i in range(1, 5)}


def frame(clip, seconds):
    png = subprocess.check_output([
        'ffmpeg', '-v', 'error', '-ss', str(seconds), '-i', str(SOURCES[clip]),
        '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-',
    ])
    return cv2.imdecode(np.frombuffer(png, np.uint8), cv2.IMREAD_COLOR)


def caption_mask(clip, times, bounds):
    """Find the stationary white glyphs against the changing shot backgrounds."""
    x, y, width, height = bounds
    samples = [cv2.cvtColor(frame(clip, sec), cv2.COLOR_BGR2GRAY) for sec in times]
    median = np.median(samples, axis=0).astype(np.uint8)[y:y+height, x:x+width]
    blur = cv2.GaussianBlur(median, (0, 0), 2.0)
    glyphs = ((median > 155) & (median.astype(float) - blur > 13)).astype(np.uint8)
    count, labels, stats, _ = cv2.connectedComponentsWithStats(glyphs)
    glyphs = np.isin(labels, [i for i in range(1, count) if stats[i, cv2.CC_STAT_AREA] >= 5]).astype(np.uint8)
    mask = np.zeros(samples[0].shape, np.uint8)
    mask[y:y+height, x:x+width] = cv2.dilate(glyphs * 255, np.ones((6, 6), np.uint8))
    return mask


masks = {
    1: caption_mask(1, [.25,.8,1.3,2.42,2.94,3.4,3.83], (188, 624, 345, 32)),
    2: caption_mask(2, np.arange(.12, 5, .27), (258, 469, 238, 39)),
    3: caption_mask(3, np.arange(.4, 9.5, .42), (258, 622, 205, 37)),
    4: caption_mask(4, np.arange(.3, 9.4, .42), (278, 622, 166, 36)),
}

# All positions are in source seconds.
shots = {
    'archive-dark': (1, .25), 'archive-pinstripe': (1, .8), 'archive-soft': (1, 2.94),
    'shirt': (3, .42), 'blazer': (3, 3.34), 'coat': (3, 7.38), 'knit': (3, 8.62),
    'vest': (3, 9.23), 'blue': (4, 1.14), 'black': (4, 3.43), 'overcoat': (4, 5.5),
}
for name, (clip, seconds) in shots.items():
    image = cv2.inpaint(frame(clip, seconds), masks[clip], 3, cv2.INPAINT_TELEA)
    cv2.imwrite(str(ASSETS / f'{name}.jpg'), image, [cv2.IMWRITE_JPEG_QUALITY, 95])

for name, seconds, (x0,y0,x1,y1) in [
    ('denim-detail', .65, (50, 25, 665, 438)),
    ('watch-detail', 4.32, (12, 248, 506, 588)),
    ('leather-detail', 1.25, (0, 20, 716, 456)),
]:
    detail = cv2.inpaint(frame(2, seconds), masks[2], 3, cv2.INPAINT_TELEA)[y0:y1, x0:x1]
    cv2.imwrite(str(ASSETS / f'{name}.jpg'), detail, [cv2.IMWRITE_JPEG_QUALITY, 95])

figures = ['archive-soft', 'black', 'vest', 'blue']
subprocess.run(['swift', str(ROOT / 'scripts/editorial-masks.swift'), *[
    str(ASSETS / f'{name}.jpg') for name in figures
]], check=True)
for name in figures:
    path = ASSETS / f'{name}.png'
    with Image.open(path) as image:
        rgba = np.array(image.convert('RGBA'))
    alpha = rgba[:, :, 3].copy()
    count, labels, stats, _ = cv2.connectedComponentsWithStats((alpha > 100).astype(np.uint8))
    largest = 1 + np.argmax(stats[1:count, cv2.CC_STAT_AREA])
    allowed = cv2.dilate((labels == largest).astype(np.uint8), np.ones((3, 3), np.uint8))
    rgba[:, :, 3] = alpha * allowed
    result = Image.fromarray(rgba)
    result.crop(result.getchannel('A').getbbox()).save(path)

subprocess.run([
    'ffmpeg', '-y', '-v', 'error', '-ss', '4.48', '-i', str(SOURCES[1]), '-t', '4.95',
    '-an', '-vf', 'crop=600:410:60:74', '-c:v', 'libx264', '-crf', '16', '-movflags', '+faststart',
    str(ASSETS / 'tie-motion.mp4'),
], check=True)
