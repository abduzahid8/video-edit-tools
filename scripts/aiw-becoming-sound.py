#!/usr/bin/env python3
"""Original deterministic score for the "Dress for who you're becoming" editorial.

Paper foley on every scene boundary, soft felt plucks on figure and headline
entrances, bubble pops in the closet beat, a stamp thock plus search-caret
ticks and a price thock in the Abu Dhabi moment, chip papers in the staples
grid, a sparse low register under the dark question, an app swap tick, and a
closing chord. No song, speech or downloaded audio.
"""
import numpy as np
import wave
from scipy.signal import butter, sosfilt

SR = 48000
DURATION = 41.0
rng = np.random.default_rng(813)
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


# — structure (beat starts follow becomingTimeline) —
DURATION = 36.0
SECTION_STARTS = [0.0, 4.2, 7.1, 9.5, 11.8, 14.2, 15.9, 18.6, 21.8, 24.2, 27.8, 32.2]
for i, at in enumerate(SECTION_STARTS):
    paper(at + .01, (-1) ** i * .6, .85)
    sub(at + .02, 55 if i % 2 == 0 else 62)

# hook: one pluck per figure entrance, then the headline pair
pluck(0.06, 110, .85, -.3)     # A2 — "today" slides in
pluck(0.36, 130.8, .8, .3)     # C3 — "becoming" split lands
paper(1.0, .5, .5, .2)         # seam close
pluck(1.37, 220, 1.0)          # A3 headline
pluck(1.51, 164.8, .85)
tick(1.37, .9)
for i in range(2):
    tick(1.12 + i * .12, .55)  # figure labels

# closet: plate paper, caption tick
paper(4.36, -.5, .75, .24)
tick(5.35, .6)

# bubbles: three pops
for i in range(3):
    tick(7.3 + i * .46, .62)
tick(8.98, .7)                 # autopilot line

# october: typewriter label, plate paper
for i in range(6):
    tick(9.66 + i * .06, .45)
paper(9.84, -.4, .7, .24)

# street: plate, leader point
paper(11.96, .5, .7, .24)
tick(12.78, .8)

# search: caret ticks
for i in range(5):
    tick(14.34 + i * .1, .5)

# card: lands, price stamp
paper(16.02, .4, .7, .22)
thock(17.37, 1.1)
tick(17.52, .7)

# staples: headline, chips
pluck(18.72, 130.8, .8, -.25)
pluck(19.35, 98, .7, .25)
for i in range(3):
    paper(19.82 + i * .13, (-1) ** i * .5, .5, .16)

# worn: paper, sub
paper(21.96, -.5, .75, .24)
sub(22.87, 62, .9)

# question: sparse, low — the film holds its breath
sub(24.24, 49, 1.1)            # low B
pluck(24.82, 82.4, .8)         # E2
pluck(25.42, 110, .7, .2)      # A2 — "becoming?"
tick(26.37, .6)
pluck(26.77, 98, .6, -.2)      # G2 — "remember?"

# direction: app, swap, wordmark
pluck(28.0, 130.8, .75, .3)
tick(29.92, .75)               # swap to the curated look
tick(31.17, .8)                # wordmark

# close: chord
pluck(32.55, 110, 1.0)
pluck(32.87, 164.8, .9)
pluck(33.55, 220, 1.0)
sub(32.55, 55, 1.2)
tick(33.55, .9)

# warm sustained bed (two detuned lows, slow tremolo) keeps the film plush
t = np.arange(int(DURATION * SR)) / SR
trem = .82 + .18 * np.sin(2 * np.pi * .23 * t)
bed = (np.sin(2 * np.pi * 55 * t) + .7 * np.sin(2 * np.pi * 55.4 * t)
       + .5 * np.sin(2 * np.pi * 82.4 * t)) * trem
fade_in = np.clip(t / 1.4, 0, 1)
fade_out = np.clip((DURATION - t) / 1.1, 0, 1)
# duck the bed under the dark question section and the final whoosh
duck = (np.clip(1 - (np.abs(t - 26.0) < 3.0) * .5, 0, 1)
        * np.clip(1 - (np.abs(t - 35.2) < .8) * .55, 0, 1))
add(0, bed * .035 * fade_in * fade_out * duck)

mix[:] = np.tanh(mix * 1.5) * .88
mix[-int(.5 * SR):] *= np.linspace(1, 0, int(.5 * SR))[:, None]
# peak-normalise to -1.5 dBFS so the film sits near -18 LUFS integrated
peak = float(np.max(np.abs(mix)))
if peak > 0:
    mix[:] *= (10 ** (-1.5 / 20)) / peak

out = 'public/assets/aiw-becoming/score.wav'
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('wrote', out)
