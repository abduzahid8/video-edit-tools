#!/usr/bin/env python3
"""Original 30s score for the Knives Out collage cut.

Same palette as the 51s study — felt piano, low modal pad, page-turn brushes
and room tone — recomposed around the shorter hard-cut timeline. Synthesised
deterministically with numpy/scipy; no downloaded music or samples.
"""
from pathlib import Path

import numpy as np
from scipy.signal import fftconvolve

SR = 48000
DURATION = 30.0
N = int(SR * DURATION)
rng = np.random.default_rng(1953)

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
        (1.0, 1.00, 2.8),
        (2.0, 0.42, 3.9),
        (3.0, 0.20, 5.4),
        (4.0, 0.10, 7.2),
        (5.0, 0.055, 9.4),
        (6.0, 0.030, 12.0),
    ]
    for mult, amp, decay in partials:
        tone += amp * np.sin(phase * mult + rng.uniform(0, 6.28)) * np.exp(-t * decay)
    hammer_n = min(n, int(0.055 * SR))
    hammer = rng.normal(0, 1, hammer_n)
    hammer = np.convolve(hammer, np.ones(18) / 18, "same")
    hammer *= np.exp(-np.arange(hammer_n) / SR * 90) * 0.10
    tone[:hammer_n] += hammer
    attack = np.minimum(t / 0.012, 1.0)
    body = tone * attack
    return body * velocity


def pad_chord(freqs: list[float], seconds: float, gain: float) -> np.ndarray:
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros(n, dtype=np.float64)
    for i, freq in enumerate(freqs):
        for detune in (-0.0016, 0.0016):
            f = freq * (1 + detune)
            ph = 2 * np.pi * f * t + rng.uniform(0, 6.28)
            out += (
                np.sin(ph)
                + 0.20 * np.sin(2 * ph + 0.4)
                + 0.07 * np.sin(3 * ph + 1.2)
            ) * (0.9 if i == 0 else 0.72)
    out /= len(freqs) * 2
    attack = np.minimum(t / 2.2, 1.0) ** 1.5
    release = np.minimum((seconds - t) / 2.6, 1.0) ** 1.2
    return out * attack * release * gain


def brush(seconds: float = 0.9, gain: float = 0.05) -> np.ndarray:
    """Page-turn / paper brush: band-limited noise with a soft arch."""
    n = int(seconds * SR)
    noise = rng.normal(0, 1, n)
    smooth = np.convolve(noise, np.ones(9) / 9, "same")
    fine = noise - smooth
    env = np.sin(np.pi * np.arange(n) / n) ** 2.4
    return fine * env * gain


def low_thump(freq: float = 55.0, seconds: float = 1.4, gain: float = 0.09) -> np.ndarray:
    n = int(seconds * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * freq * t) * np.exp(-t * 4.5) * gain


# ── Modal pad ────────────────────────────────────────────────────────────────
chords = [
    (0.0, 8.0, [73.42, 110.00, 146.83, 174.61]),       # Dm add9
    (7.0, 8.0, [58.27, 87.31, 116.54, 146.83]),        # Bb maj7
    (13.5, 7.5, [87.31, 130.81, 174.61, 220.00]),      # F maj7
    (20.0, 7.0, [65.41, 98.00, 130.81, 164.81]),       # C add9
    (26.0, 4.0, [73.42, 110.00, 146.83, 174.61, 220.0]),  # Dm add9 close
]
for at, seconds, freqs in chords:
    add(pad_chord(freqs, seconds, 0.052), at, 0.0)

# ── Felt piano motif ────────────────────────────────────────────────────────
D4, F4, A4, C5, D5, E4, G4, Bb3, F3, A3, C4 = (
    293.66, 349.23, 440.00, 523.25, 587.33,
    329.63, 392.00, 233.08, 174.61, 220.00, 261.63,
)
# (time, note, duration, velocity, pan)
notes = [
    (0.55, D4, 3.0, 0.48, -0.28),
    (1.45, A4, 2.8, 0.32, 0.22),
    (2.70, F4, 2.8, 0.38, -0.12),
    (4.10, C5, 3.0, 0.28, 0.32),
    (5.55, A4, 2.8, 0.40, -0.18),
    (7.00, Bb3, 3.2, 0.44, -0.30),
    (8.35, F4, 2.8, 0.30, 0.18),
    (9.75, D4, 3.0, 0.38, -0.10),
    (11.15, A4, 2.8, 0.27, 0.26),
    (12.60, C5, 3.0, 0.35, -0.20),
    (14.00, A3, 3.2, 0.40, -0.26),
    (15.50, C4, 2.8, 0.28, 0.12),
    (16.85, F4, 3.0, 0.36, -0.06),
    (18.35, A4, 2.8, 0.25, 0.30),
    (19.85, G4, 3.0, 0.34, -0.22),
    (21.30, E4, 2.8, 0.27, 0.16),
    (22.75, C5, 3.0, 0.38, -0.14),
    (24.20, G4, 2.8, 0.25, 0.24),
    (25.60, D5, 3.2, 0.36, -0.28),
    (27.05, Bb3, 3.0, 0.38, 0.18),
    (28.25, F4, 2.4, 0.28, -0.10),
    (29.10, D4, 1.6, 0.34, 0.0),
]
for at, freq, seconds, vel, pan in notes:
    add(felt_note(freq, seconds, vel), at, pan)

# ── Page turns at hard cuts + low anchors ───────────────────────────────────
scene_changes = [4.0, 7.0, 10.2, 13.4, 16.6, 19.8, 23.0, 27.0]
for i, at in enumerate(scene_changes):
    add(brush(0.8, 0.032), at - 0.28, -0.35 if i % 2 else 0.35)
    add(low_thump(52.0 if i % 2 else 58.0, 1.3, 0.045), at - 0.04, 0.0)

# Delicate high harmonics on the product reveals and "Try" swaps.
glints = [
    (7.10, 880.0), (8.60, 1046.5),
    (10.30, 1046.5), (11.80, 880.0),
    (13.50, 880.0), (15.00, 1174.7),
    (16.70, 1046.5), (18.20, 880.0),
    (19.90, 1174.7), (21.40, 1046.5),
    (23.10, 880.0), (27.10, 1046.5),
]
for at, freq in glints:
    t = np.arange(int(1.6 * SR)) / SR
    glint = (
        np.sin(2 * np.pi * freq * t)
        + 0.35 * np.sin(2 * np.pi * freq * 1.5 * t)
    ) * np.exp(-t * 3.6) * 0.012
    add(glint, at, 0.4 if int(at) % 2 else -0.4)

# ── Room tone ───────────────────────────────────────────────────────────────
room = rng.normal(0, 1, N)
room = np.convolve(room, np.ones(48) / 48, "same")
room *= 0.0024
mix[:, 0] += room
mix[:, 1] += np.roll(room, 311) * 0.92

# ── Reverb ──────────────────────────────────────────────────────────────────
ir_n = int(2.2 * SR)
ir_t = np.arange(ir_n) / SR
ir = rng.normal(0, 1, (ir_n, 2))
ir *= np.exp(-ir_t * 2.7)[:, None]
ir[:, 0] = np.convolve(ir[:, 0], np.ones(5) / 5, "same")
ir[:, 1] = np.convolve(ir[:, 1], np.ones(5) / 5, "same")
ir /= np.sqrt(np.sum(ir**2, axis=0, keepdims=True)) + 1e-9
wet = np.stack(
    [
        fftconvolve(mix[:, 0], ir[:, 0])[:N],
        fftconvolve(mix[:, 1], ir[:, 1])[:N],
    ],
    axis=1,
)
mix = mix * 0.82 + wet * 0.28

# ── Fades, gentle bus glue, normalise ───────────────────────────────────────
fade_in = np.minimum(np.arange(N) / SR / 1.2, 1.0)
fade_out = np.minimum((N - 1 - np.arange(N)) / SR / 2.2, 1.0)
mix *= (fade_in * fade_out)[:, None]
mix = np.tanh(mix * 1.25) * 0.82
peak = np.abs(mix).max()
mix *= 0.72 / max(peak, 1e-9)

out = Path("public/assets/knives-out/knives-score-30.wav")
out.parent.mkdir(parents=True, exist_ok=True)
import wave

with wave.open(str(out), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print(out, f"{DURATION:.1f}s", f"peak {peak:.3f}")
