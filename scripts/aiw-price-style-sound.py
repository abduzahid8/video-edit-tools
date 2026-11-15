#!/usr/bin/env python3
"""Original deterministic score for the "Price doesn't create style" editorial.

Paper foley on every section boundary, a sparse felt-pluck motif on the hook
entrances, a quiet runway pulse under the three looks, stamp thocks on every
price reveal and two whooshes for the paper wipes. No song, speech or
downloaded audio.
"""
import numpy as np
import wave
from scipy.signal import butter, sosfilt

SR = 48000
DURATION = 33.0
rng = np.random.default_rng(711)
mix = np.zeros((int(SR * DURATION), 2))


def add(at: float, a: np.ndarray, pan: float = 0.0) -> None:
    at = max(0.0, float(at))
    i = int(at * SR)
    n = min(len(a), len(mix) - i)
    if i < 0 or n <= 0:
        return
    mix[i:i + n] += a[:n, None] * np.array([1 - pan * .35, 1 + pan * .35])


def env(t: np.ndarray, attack: float, release: float) -> np.ndarray:
    e = np.minimum(1, t / max(attack, 1e-4)) * np.exp(-t / release)
    return e


def paper(at: float, pan: float = 0.0, strength: float = 1.0, dur: float = .34) -> None:
    t = np.arange(int(dur * SR)) / SR
    n = rng.normal(size=len(t))
    n = sosfilt(butter(2, [500, 7200], fs=SR, btype='bandpass', output='sos'), n)
    add(at, n * np.sin(np.pi * t / dur) ** 2 * .085 * strength, pan)


def whoosh(at: float, dur: float = .5, strength: float = 1.0) -> None:
    t = np.arange(int(dur * SR)) / SR
    n = rng.normal(size=len(t))
    sweep = sosfilt(butter(2, [300, 4200], fs=SR, btype='bandpass', output='sos'), n)
    center = 900 + 2600 * (t / dur)
    # approximate a rising brightness by crossfading two filtered copies
    n2 = sosfilt(butter(2, [900, 9000], fs=SR, btype='bandpass', output='sos'), n)
    k = (t / dur) ** 1.6
    a = (sweep * (1 - k) + n2 * k) * env(t, .16, .30) * .12 * strength
    add(at, a)


def pluck(at: float, freq: float, strength: float = 1.0, pan: float = 0.0) -> None:
    t = np.arange(int(1.7 * SR)) / SR
    a = (np.sin(2 * np.pi * freq * t)
         + .38 * np.sin(2 * np.pi * freq * 2 * t)
         + .16 * np.sin(2 * np.pi * freq * 3.01 * t))
    a *= env(t, .006, .34) * .16 * strength
    a = sosfilt(butter(2, [90, 2400], fs=SR, btype='bandpass', output='sos'), a)
    add(at, a, pan)


def sub(at: float, freq: float = 55, strength: float = 1.0) -> None:
    t = np.arange(int(.8 * SR)) / SR
    a = np.sin(2 * np.pi * freq * t) * env(t, .01, .22) * .14 * strength
    add(at, a)


def tick(at: float, strength: float = 1.0) -> None:
    t = np.arange(int(.05 * SR)) / SR
    n = rng.normal(size=len(t))
    a = (n * np.exp(-t * 210) * .05 + np.sin(2 * np.pi * 1150 * t) * np.exp(-t * 260) * .05) * strength
    add(at, a)


def thock(at: float, strength: float = 1.0) -> None:
    t = np.arange(int(.16 * SR)) / SR
    a = (np.sin(2 * np.pi * (150 * t + 40 * t * np.exp(-t * 40))) * np.exp(-t * 42) * .2
         + rng.normal(size=len(t)) * np.exp(-t * 180) * .05) * strength
    add(at, a)


# — structure —
SECTION_STARTS = [0.0, 3.0, 8.0, 12.0, 16.0, 20.0, 26.0]
for i, at in enumerate(SECTION_STARTS):
    paper(at + .01, (-1) ** i * .6, .9)
    sub(at + .02, 55 if i % 2 == 0 else 62)

# hook: one pluck per model entrance, then the headline chord
pluck(0.02, 110, .9, -.3)     # A2 — tailoring crop
whoosh(0.55, .42, .8)         # masked slide
pluck(0.57, 130.8, .8, .3)    # C3 — knit slide
whoosh(0.95, .46, .9)         # paper split
pluck(0.97, 164.8, .85, -.2)  # E3 — tux split
paper(1.45, .5, .6, .2)       # seam close
pluck(1.55, 220, 1.0)         # A3 headline
pluck(1.62, 110, .7)
tick(1.55, .9)
for i in range(3):
    tick(1.18 + i * .1, .55)  # price chips

# problem: tags pop, strike, wipe
for i in range(5):
    tick(3.32 + i * .14, .6)
tick(4.4, .8)                 # strike through the impulse tag
paper(4.8, -.4, .7, .22)
whoosh(5.1, .5, 1.0)
for i in range(6):
    tick(5.24 + i * .13, .5)
pluck(5.42, 110, .85)

# looks: pulse + stamps
for beat in np.arange(8.0, 25.9, .6):
    fade = min(1, (beat - 8) / 1.2) * min(1, (25.9 - beat) / 1.2)
    if 26.0 > beat >= 8.0:
        tick(beat, .34 * fade)
pluck(8.04, 130.8, .8, -.25)
thock(10.62, 1.0)
pluck(12.04, 164.8, .8, .25)
thock(14.62, 1.0)
paper(16.06, .5, .8, .24)
pluck(16.3, 110, .75)
thock(18.66, 1.0)
tick(18.2, .8)                # cursor click

# matrix: rules draw, counter, outfits
paper(20.02, .3, .8)
for i in range(3):
    tick(20.32 + i * .15, .6)
for i in range(6):
    paper(20.85 + i * .12, (-1) ** i * .5, .45, .16)
thock(22.95, 1.0)
thock(24.35, 1.15)
tick(24.55, .8)
pluck(24.45, 220, .8)

# app + close
paper(26.02, -.4, .85)
pluck(26.12, 130.8, .7, .3)
tick(28.0, .7)                # app swap
whoosh(30.2, .55, 1.1)
paper(30.24, .5, .95, .3)
pluck(30.52, 110, 1.0)
pluck(30.84, 164.8, .9)
pluck(31.42, 220, 1.0)
sub(30.52, 55, 1.2)
tick(31.42, .9)

# warm sustained bed (two detuned lows, slow tremolo) keeps the film plush
t = np.arange(int(DURATION * SR)) / SR
trem = .82 + .18 * np.sin(2 * np.pi * .23 * t)
bed = (np.sin(2 * np.pi * 55 * t) + .7 * np.sin(2 * np.pi * 55.4 * t)
       + .5 * np.sin(2 * np.pi * 82.4 * t)) * trem
fade_in = np.clip(t / 1.4, 0, 1)
fade_out = np.clip((DURATION - t) / 1.1, 0, 1)
duck = np.clip(1 - (np.abs(t - 30.2) < .8) * .55, 0, 1)
add(0, bed * .035 * fade_in * fade_out * duck)

mix[:] = np.tanh(mix * 1.5) * .88
mix[-int(.5 * SR):] *= np.linspace(1, 0, int(.5 * SR))[:, None]

out = 'public/assets/aiw-price-style/score.wav'
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('wrote', out)
