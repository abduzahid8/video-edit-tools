#!/usr/bin/env python3
"""30s score for the layering study (example3-style white cutout cut).

Sparser and whiter than the knives-out paper scores: felt piano becomes
near-elliptic, the pad sits an octave higher and thinner, and each echo-text
reveal gets a tiny mechanical "print" tick instead of a paper brush.
Synthesised deterministically with numpy/scipy; no downloads or samples.

Usage: python3 scripts/layering-score.py
Writes public/assets/layering-editorial/layering-score.wav
"""
from pathlib import Path

import numpy as np
from scipy.signal import fftconvolve

SR = 48000
DURATION = 30.0
N = int(SR * DURATION)
rng = np.random.default_rng(7151)

mix = np.zeros((N, 2), dtype=np.float64)


def add(signal: np.ndarray, at: float, pan: float = 0.0, gain: float = 1.0) -> None:
    start = int(at * SR)
    if start >= N:
        return
    sig = signal[: N - start] * gain
    left = np.sqrt(0.5 * (1.0 - pan))
    right = np.sqrt(0.5 * (1.0 + pan))
    mix[start : start + len(sig), 0] += sig * left
    mix[start : start + len(sig), 1] += sig * right


def felt_note(freq: float, seconds: float, velocity: float) -> np.ndarray:
    """Soft felt piano: inharmonic partials, fast felt thump, long decay."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    drift = 1.0 + 0.00035 * np.sin(2 * np.pi * 0.17 * t + rng.uniform(0, 6.28))
    phase = 2 * np.pi * freq * np.cumsum(drift) / SR
    tone = np.zeros(n, dtype=np.float64)
    partials = [
        (1.0, 1.00, 2.6),
        (2.0, 0.38, 3.8),
        (3.0, 0.16, 5.2),
        (4.0, 0.08, 7.0),
        (5.0, 0.045, 9.2),
    ]
    for mult, amp, decay in partials:
        tone += amp * np.sin(phase * mult + rng.uniform(0, 6.28)) * np.exp(-t * decay)
    hammer_n = min(n, int(0.05 * SR))
    hammer = rng.normal(0, 1, hammer_n)
    hammer = np.convolve(hammer, np.ones(20) / 20, "same")
    hammer *= np.exp(-np.arange(hammer_n) / SR * 95) * 0.08
    tone[:hammer_n] += hammer
    attack = np.minimum(t / 0.014, 1.0)
    return tone * attack * velocity


def pad_chord(freqs: list[float], seconds: float, gain: float) -> np.ndarray:
    """Thin airy pad — one octave up, few partials, slow swell."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros(n, dtype=np.float64)
    for i, freq in enumerate(freqs):
        for detune in (-0.0012, 0.0012):
            f = freq * (1 + detune)
            ph = 2 * np.pi * f * t + rng.uniform(0, 6.28)
            out += (np.sin(ph) + 0.12 * np.sin(2 * ph + 0.5)) * (
                0.9 if i == 0 else 0.6
            )
    out /= len(freqs) * 2
    attack = np.minimum(t / 2.8, 1.0) ** 1.6
    release = np.minimum((seconds - t) / 3.0, 1.0) ** 1.2
    return out * attack * release * gain


def print_tick(gain: float = 0.05) -> np.ndarray:
    """Tiny mechanical print tick for the echo-text reveals."""
    n = int(0.07 * SR)
    t = np.arange(n) / SR
    click = rng.normal(0, 1, n)
    click = np.convolve(click, np.ones(6) / 6, "same")
    body = np.sin(2 * np.pi * 2100 * t) * np.exp(-t * 160)
    env = np.exp(-t * 90)
    return (click * 0.5 + body) * env * gain


def low_thump(freq: float = 52.0, seconds: float = 1.6, gain: float = 0.07) -> np.ndarray:
    n = int(seconds * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * freq * t) * np.exp(-t * 4.2) * gain


# ── arrangement ──────────────────────────────────────────────────────────────
# Scene grid mirrors src/video/timeline.ts → layeringTimeline.
scene_changes = [4.2, 7.2, 8.9, 13.5, 15.2, 20.6, 22.3, 26.0]

# Spacious opening chord under the cover, breathing again for the outro.
for at, chord, gain in [
    (0.2, [110.0, 164.81, 220.0, 329.63], 0.05),      # A minor add — cover
    (8.9, [98.0, 146.83, 196.0, 293.66], 0.045),      # D — weight demo
    (15.2, [87.31, 130.81, 174.61, 261.63], 0.042),   # F — build-up
    (26.0, [110.0, 164.81, 220.0, 329.63], 0.05),     # resolve — effortless
]:
    add(pad_chord(chord, 4.4, gain), at, pan=0.0)

# Felt melody — sparse, mostly off the beat, one phrase per chapter.
melody = [
    (0.55, 440.00, 0.10),   # A4  cover
    (1.35, 523.25, 0.09),   # C5
    (2.30, 392.00, 0.085),  # G4
    (3.10, 329.63, 0.075),  # E4
    (9.10, 293.66, 0.08),   # D4  weight
    (10.40, 349.23, 0.075),  # F4
    (11.60, 440.00, 0.08),  # A4
    (15.60, 349.23, 0.075),  # F4  build
    (17.10, 392.00, 0.07),  # G4
    (18.60, 523.25, 0.075),  # C5
    (22.60, 440.00, 0.08),  # A4  v-shape
    (24.20, 392.00, 0.07),  # G4
    (26.60, 523.25, 0.09),  # C5  effortless
    (27.60, 440.00, 0.085),  # A4
    (28.60, 329.63, 0.07),  # E4
]
for at, freq, vel in melody:
    pan = float(rng.uniform(-0.25, 0.25))
    add(felt_note(freq, 2.6, vel), at, pan=pan)

# Print ticks on every echo-text / rule-card reveal.
tick_times = [
    0.40, 0.52, 0.64,          # cover title words
    4.60, 4.72,                # not so much
    7.50, 7.62, 7.74,          # rule 1
    9.40,                      # thin
    12.30,                     # thick
    13.80, 13.92, 14.04,       # rule 2
    15.60, 17.40,              # build captions
    20.90, 21.02, 21.14,       # rule 3
    26.30, 26.42,              # effortless
]
for i, at in enumerate(tick_times):
    add(print_tick(0.045 if i % 3 else 0.06), at, pan=float(rng.uniform(-0.3, 0.3)))

# Low anchors + a soft swell into each scene change.
for at in scene_changes:
    add(low_thump(gain=0.05), at - 0.06)

# Room tone + gentle bus reverb (same recipe as the knives scores).
room = rng.normal(0, 1, N) * 0.0022
room = np.convolve(room, np.ones(9) / 9, "same")
mix[:, 0] += room
mix[:, 1] += np.roll(room, 941)

impulse_n = int(1.7 * SR)
imp_t = np.arange(impulse_n) / SR
impulse = rng.normal(0, 1, impulse_n) * np.exp(-imp_t * 3.4) * 0.14
wet = fftconvolve(mix, impulse[:, None], mode="same") * 0.5
mix = mix * 0.82 + wet

# Fades + soft clip glue + normalise.
fade_in = np.minimum(np.arange(N) / (1.2 * SR), 1.0)
fade_out = np.minimum((N - np.arange(N)) / (1.8 * SR), 1.0)
mix *= (fade_in * fade_out)[:, None]
mix = np.tanh(mix * 1.15) * 0.72
peak = np.abs(mix).max()
if peak > 0:
    mix = mix / peak * 0.72

out = Path("public/assets/layering-editorial")
out.mkdir(parents=True, exist_ok=True)
import wave

with wave.open(str(out / "layering-score.wav"), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print(f"wrote {out / 'layering-score.wav'} ({DURATION}s)")
