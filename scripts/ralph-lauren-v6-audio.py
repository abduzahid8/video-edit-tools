"""Generate deterministic local narration, score timing, and paper cues."""
from array import array
from pathlib import Path
from random import Random
import json
import math
import subprocess
import tempfile
import wave

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/assets/ralph-lauren-editorial"
OUT.mkdir(parents=True, exist_ok=True)

CUES = [
    (0.12, 2.27, "What makes Ralph Lauren unmistakable?"),
    (2.68, 2.77, "It began in 1967 with bold ties."),
    (5.78, 2.00, "One piece. A bigger world."),
    (8.08, 4.02, "The Polo shirt brought that vision into everyday life."),
    (12.48, 3.69, "Prep, tailoring, and the open air came together."),
    (16.48, 4.65, "Double RL looked west: denim, workwear, lived-in texture."),
    (21.48, 4.65, "Purple Label brought a sharper, more formal point of view."),
    (26.48, 2.87, "Different clothes. One unmistakable vision."),
    (29.68, 2.13, "A world you could wear."),
]

def run(args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL)

with tempfile.TemporaryDirectory() as tmp:
    clips = []
    for index, (start, window, line) in enumerate(CUES):
        aiff = Path(tmp) / f"voice-{index}.aiff"
        wav = Path(tmp) / f"voice-{index}.wav"
        run(["say", "-v", "Daniel", "-r", "174", "-o", str(aiff), line])
        duration = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(aiff)], text=True))
        tempo = max(1.0, duration / window)
        spoken = min(duration / tempo, window)
        run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(aiff), "-af", f"atempo={tempo:.5f},aresample=48000,afade=t=in:st=0:d=0.04,afade=t=out:st={spoken-.10:.3f}:d=0.10", "-ac", "1", str(wav)])
        clips.append((wav, round(start * 1000)))
        print(f"{start:05.2f}s  {spoken:04.2f}s  {line}")
    command = ["ffmpeg", "-y", "-loglevel", "error"]
    for wav, _ in clips:
        command += ["-i", str(wav)]
    filters = [f"[{i}:a]adelay={delay}|{delay}[v{i}]" for i, (_, delay) in enumerate(clips)]
    filters.append("".join(f"[v{i}]" for i in range(len(clips))) + f"amix=inputs={len(clips)}:duration=longest:normalize=0,apad=whole_dur=32,atrim=duration=32[out]")
    run(command + ["-filter_complex", ";".join(filters), "-map", "[out]", "-c:a", "pcm_s16le", str(OUT / "narration-v6.wav")])

run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(ROOT / "public/assets/new-example-wardrobe/score-48.wav"), "-af", "atempo=1.5,afade=t=out:st=29:d=3", "-t", "32", "-c:a", "pcm_s16le", str(OUT / "score-v6.wav")])

sample_rate = 48000
samples = array('f', [0.0]) * (sample_rate * 32)
rng = Random(20261110)
events = [2.6, 5.7, 8.0, 9.86, 12.4, 14.54, 16.4, 18.5, 21.4, 23.08, 24.78, 26.4, 29.6]
for event in events:
    start = int(event * sample_rate)
    length = int(.17 * sample_rate)
    low = 0.0
    for i in range(length):
        u = i / length
        low = low * .72 + rng.uniform(-1, 1) * .28
        envelope = math.sin(math.pi * u) ** 2
        samples[start + i] += low * envelope * .17
    for i in range(int(.018 * sample_rate)):
        if start + i < len(samples):
            samples[start + i] += math.sin(2 * math.pi * 176 * i / sample_rate) * math.exp(-i / (sample_rate * .0035)) * .025

with wave.open(str(OUT / "foley-v6.wav"), 'wb') as output:
    output.setnchannels(1)
    output.setsampwidth(2)
    output.setframerate(sample_rate)
    output.writeframes(array('h', (max(-32768, min(32767, int(value * 32767))) for value in samples)).tobytes())

(OUT / "voice-cues-v6.json").write_text(json.dumps([{"from": start, "window": window, "text": line} for start, window, line in CUES], indent=2) + "\n")
