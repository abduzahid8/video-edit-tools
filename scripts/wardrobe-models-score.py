"""Make a quiet original score and paper accents for the model wardrobe cut."""
from pathlib import Path
import wave

import numpy as np

RATE = 48000
DURATION = 36.4
mix = np.zeros((round(DURATION * RATE), 2))
rng = np.random.default_rng(1080)


def add(at, signal, pan=0):
    start = round(at * RATE)
    count = min(len(signal), len(mix) - start)
    mix[start:start + count] += signal[:count, None] * [1 - pan, 1 + pan]


# A soft bass and sparse electric-piano-like tones under the visual-only middle.
for beat, at in enumerate(np.arange(4.66, 24, .6)):
    root = [98, 87.31, 110, 73.42][(beat // 8) % 4]
    time = np.arange(round(1.1 * RATE)) / RATE
    envelope = (1 - np.exp(-time * 52)) * np.exp(-time * 3.3)
    if beat % 2 == 0:
        add(at, .075 * envelope * np.sin(2 * np.pi * root * time))
    if beat % 4 in (1, 3):
        pitch = root * (3 if beat % 4 == 1 else 4)
        note = np.sin(2 * np.pi * pitch * time) + .18 * np.sin(4 * np.pi * pitch * time)
        add(at, .027 * envelope * note, .18 if beat % 4 == 1 else -.18)

clock = np.arange(len(mix)) / RATE
mix *= np.clip((24.2 - clock) / .9, 0, 1)[:, None]

for at in [0.53, 1.07, 1.63, 4.7, 7.85, 10.2, 14.6, 17.35, 20.4, 21.6, 22.8, 24, 26.8, 28.65, 32.2, 33.45]:
    time = np.arange(round(.22 * RATE)) / RATE
    noise = np.diff(rng.normal(size=len(time)), prepend=0)
    add(at, .021 * noise * (1 - np.exp(-time * 120)) * np.exp(-time * 28), .13)

output = Path(__file__).resolve().parents[1] / 'public/assets/wardrobe-models/score.wav'
with wave.open(str(output), 'wb') as wav:
    wav.setparams((2, 2, RATE, 0, 'NONE', 'not compressed'))
    wav.writeframes((mix * 32767).astype('<i2').tobytes())
