#!/usr/bin/env python3
"""Original 51s score for the Knives Out wardrobe study.

Felt-piano motif, low modal pad, page-turn brushes and room tone. Composed and
synthesised deterministically with numpy/scipy; no downloaded music or samples.
"""
from pathlib import Path

import numpy as np
from scipy.signal import fftconvolve

SR = 48000
DURATION = 51.0
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
    # Slight detune drift makes the tone breathe without sounding synthetic.
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
    # Felt hammer: a very short low-passed noise thump.
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
        # Two slightly detuned voices per note for a soft choral width.
        for detune in (-0.0016, 0.0016):
            f = freq * (1 + detune)
            ph = 2 * np.pi * f * t + rng.uniform(0, 6.28)
            out += (
                np.sin(ph)
                + 0.20 * np.sin(2 * ph + 0.4)
                + 0.07 * np.sin(3 * ph + 1.2)
            ) * (0.9 if i == 0 else 0.72)
    out /= len(freqs) * 2
    # Slow swell and release.
    attack = np.minimum(t / 2.6, 1.0) ** 1.5
    release = np.minimum((seconds - t) / 3.2, 1.0) ** 1.2
    return out * attack * release * gain


def brush(seconds: float = 0.9, gain: float = 0.05) -> np.ndarray:
    """Page-turn / paper brush: band-limited noise with a soft arch."""
    n = int(seconds * SR)
    noise = rng.normal(0, 1, n)
    # Cheap band-pass by differencing smoothed copies.
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
    (0.0, 9.0, [73.42, 110.00, 146.83, 174.61]),       # Dm add9
    (8.5, 9.0, [58.27, 87.31, 116.54, 146.83]),        # Bb maj7
    (16.0, 9.0, [87.31, 130.81, 174.61, 220.00]),      # F maj7
    (23.5, 9.0, [65.41, 98.00, 130.81, 164.81]),       # C add9
    (31.0, 9.0, [98.00, 146.83, 196.00, 233.08]),      # Gm7
    (38.5, 9.0, [110.00, 146.83, 164.81, 220.00]),     # A7sus4
    (46.0, 5.0, [73.42, 110.00, 146.83, 174.61, 220.0]),  # Dm add9 close
]
for at, seconds, freqs in chords:
    add(pad_chord(freqs, seconds, 0.050), at, 0.0)

# ── Felt piano motif ────────────────────────────────────────────────────────
D4, F4, A4, C5, D5, E4, G4, Bb3, F3, A3, C4 = (
    293.66, 349.23, 440.00, 523.25, 587.33,
    329.63, 392.00, 233.08, 174.61, 220.00, 261.63,
)
# (time, note, duration, velocity, pan)
notes = [
    (0.55, D4, 3.2, 0.50, -0.28),
    (1.35, A4, 3.0, 0.34, 0.22),
    (2.45, F4, 3.2, 0.40, -0.12),
    (4.05, C5, 3.4, 0.30, 0.32),
    (5.65, A4, 3.4, 0.44, -0.18),
    (6.90, F4, 3.0, 0.26, 0.12),
    (8.55, Bb3, 3.8, 0.46, -0.30),
    (9.75, F4, 3.4, 0.33, 0.18),
    (11.15, D4, 3.6, 0.40, -0.10),
    (12.75, A4, 3.2, 0.28, 0.26),
    (14.55, C5, 3.6, 0.38, -0.20),
    (16.45, A3, 3.8, 0.44, -0.26),
    (17.75, C4, 3.2, 0.30, 0.12),
    (19.15, F4, 3.6, 0.38, -0.06),
    (20.75, A4, 3.4, 0.26, 0.30),
    (22.55, G4, 3.4, 0.36, -0.22),
    (24.05, E4, 3.0, 0.28, 0.16),
    (25.55, C5, 3.6, 0.42, -0.14),
    (27.15, G4, 3.2, 0.26, 0.24),
    (28.65, D5, 3.6, 0.38, -0.28),
    (30.10, Bb3, 3.8, 0.40, 0.18),
    (31.55, F4, 3.4, 0.30, -0.10),
    (33.15, D4, 3.6, 0.36, 0.22),
    (34.85, A4, 3.6, 0.42, -0.24),
    (36.35, F4, 3.2, 0.28, 0.14),
    (38.05, E4, 3.4, 0.36, -0.18),
    (39.55, A4, 3.6, 0.32, 0.26),
    (41.15, C5, 3.6, 0.40, -0.22),
    (42.75, A4, 3.2, 0.28, 0.16),
    (44.35, D5, 3.8, 0.36, -0.12),
    (46.15, A4, 4.2, 0.42, 0.20),
    (47.65, F4, 4.0, 0.30, -0.16),
    (49.05, D4, 2.4, 0.38, 0.0),
]
for at, freq, seconds, vel, pan in notes:
    add(felt_note(freq, seconds, vel), at, pan)

# ── Page turns at scene changes + low anchors ───────────────────────────────
scene_changes = [5.5, 10.0, 16.0, 22.0, 28.0, 34.0, 40.0, 46.0]
for i, at in enumerate(scene_changes):
    add(brush(0.85, 0.030), at - 0.30, -0.35 if i % 2 else 0.35)
    add(low_thump(52.0 if i % 2 else 58.0, 1.5, 0.045), at - 0.05, 0.0)

# A few delicate high harmonics as "glints" on the product reveals.
for at, freq in [(10.9, 880.0), (16.9, 1046.5), (22.9, 880.0), (28.9, 1174.7), (34.9, 1046.5)]:
    t = np.arange(int(1.8 * SR)) / SR
    glint = (
        np.sin(2 * np.pi * freq * t)
        + 0.35 * np.sin(2 * np.pi * freq * 1.5 * t)
    ) * np.exp(-t * 3.4) * 0.014
    add(glint, at, 0.4 if int(at) % 2 else -0.4)

# ── Room tone ───────────────────────────────────────────────────────────────
room = rng.normal(0, 1, N)
room = np.convolve(room, np.ones(48) / 48, "same")
room *= 0.0025
mix[:, 0] += room
mix[:, 1] += np.roll(room, 311) * 0.92

# ── Reverb ──────────────────────────────────────────────────────────────────
ir_n = int(2.4 * SR)
ir_t = np.arange(ir_n) / SR
ir = rng.normal(0, 1, (ir_n, 2))
ir *= np.exp(-ir_t * 2.6)[:, None]
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
fade_in = np.minimum(np.arange(N) / SR / 1.4, 1.0)
fade_out = np.minimum((N - 1 - np.arange(N)) / SR / 2.4, 1.0)
mix *= (fade_in * fade_out)[:, None]
mix = np.tanh(mix * 1.25) * 0.82
peak = np.abs(mix).max()
mix *= 0.72 / max(peak, 1e-9)

out = Path("public/assets/knives-out/knives-score.wav")
out.parent.mkdir(parents=True, exist_ok=True)
import wave

with wave.open(str(out), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print(out, f"{DURATION:.1f}s", f"peak {peak:.3f}")
