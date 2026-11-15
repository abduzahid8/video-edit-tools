"""Synthesize four original, deterministic beds for the 30-second editorial cuts."""
from pathlib import Path
import wave

import numpy as np

SAMPLE_RATE = 48000
DURATION = 30
DIRECTIONS = [
    (120, (110, 130.81, 164.81, 146.83), 0.25, 0.60),
    (96, (98, 116.54, 146.83, 130.81), 0.13, 0.85),
    (112, (130.81, 155.56, 196, 174.61), 0.21, 0.40),
    (72, (146.83, 174.61, 220, 196), 0.05, 1.30),
]


def write_bed(direction, bpm, pitches, percussion, sustain, output):
    mix = np.zeros((SAMPLE_RATE * DURATION, 2))
    rng = np.random.default_rng(direction)

    def add(at, signal, pan):
        start = round(at * SAMPLE_RATE)
        count = min(len(signal), len(mix) - start)
        mix[start:start + count] += signal[:count, None] * [1 - pan, 1 + pan]

    tick_time = np.arange(SAMPLE_RATE // 12) / SAMPLE_RATE
    note_time = np.arange(round(SAMPLE_RATE * sustain * 2)) / SAMPLE_RATE
    beat_seconds = 60 / bpm
    for beat, at in enumerate(np.arange(0, DURATION, beat_seconds)):
        tone = pitches[(beat // 4) % len(pitches)]
        if beat % 2 == 0:
            fundamental = np.sin(2 * np.pi * tone * note_time)
            overtone = np.sin(4 * np.pi * tone * note_time)
            attack = np.minimum(note_time * 45, 1)
            decay = np.exp(-note_time * 3 / sustain)
            add(at, (fundamental + 0.15 * overtone) * attack * decay * 0.17, 0.12)
        pulse = np.sin(2 * np.pi * 57 * tick_time) * np.exp(-tick_time * 50)
        texture = np.diff(rng.normal(size=len(tick_time)), prepend=0) * np.exp(-tick_time * 85)
        add(at, percussion * (pulse * 0.38 + texture * 0.035), 0)

    clock = np.arange(len(mix)) / SAMPLE_RATE
    mix *= (np.minimum(clock / 0.18, 1) * np.minimum((DURATION - clock) / 1.1, 1))[:, None]
    with wave.open(str(output), "wb") as wav:
        wav.setparams((2, 2, SAMPLE_RATE, 0, "NONE", "not compressed"))
        wav.writeframes((mix * 32767).astype("<i2").tobytes())


if __name__ == "__main__":
    output_dir = Path(__file__).resolve().parents[1] / "AIWardrobe_12_Fashion_Videos/assets/music"
    output_dir.mkdir(parents=True, exist_ok=True)
    for index, settings in enumerate(DIRECTIONS, start=1):
        write_bed(index, *settings, output_dir / f"direction-{index}.wav")
