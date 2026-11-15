"""Create local English narration and an original deterministic editorial score."""
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
    (0.12, 1.81, "What makes Ralph Lauren unmistakable?"),
    (2.08, 3.08, "It began with a tie in 1967."),
    (5.48, 1.06, "Then, a world."),
    (6.78, 3.04, "The Polo shirt brought that world into daily life."),
    (10.08, 3.10, "Prep and the country house joined the story."),
    (13.48, 4.62, "Double RL looked west, to denim and workwear."),
    (18.58, 3.10, "Purple Label refined the suit."),
    (21.98, 1.48, "Formalwear, made effortless."),
    (23.68, 1.57, "Different clothes. One vision."),
    (25.48, 2.37, "A world you could wear."),
]

def run(args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL)

with tempfile.TemporaryDirectory() as tmp:
    clips = []
    for index, (start, window, line) in enumerate(CUES):
        aiff = Path(tmp) / f"line-{index}.aiff"
        wav = Path(tmp) / f"line-{index}.wav"
        run(["say", "-v", "Daniel", "-r", "180", "-o", str(aiff), line])
        duration = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(aiff)], text=True))
        tempo = max(1.0, duration / window)
        spoken = min(duration / tempo, window)
        run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(aiff), "-af", f"atempo={tempo:.5f},aresample=48000,afade=t=in:st=0:d=0.04,afade=t=out:st={spoken-.10:.3f}:d=0.10", "-ac", "1", str(wav)])
        clips.append((wav, round(start * 1000)))
        print(f"{start:05.2f}s  {spoken:04.2f}s  {line}")
    args = ["ffmpeg", "-y", "-loglevel", "error"]
    for wav, _ in clips:
        args += ["-i", str(wav)]
    filters = [f"[{i}:a]adelay={delay}|{delay}[v{i}]" for i, (_, delay) in enumerate(clips)]
    filters.append("".join(f"[v{i}]" for i in range(len(clips))) + f"amix=inputs={len(clips)}:duration=longest:normalize=0,apad=whole_dur=28.2,atrim=duration=28.2[out]")
    run(args + ["-filter_complex", ";".join(filters), "-map", "[out]", "-c:a", "pcm_s16le", str(OUT / "narration-v7.wav")])

cuts = [0, 2, 3.8, 5.4, 6.7, 8.3, 10, 11.7, 13.4, 15, 16.8, 18.5, 20.2, 21.9, 23.6, 25.4]
sample_rate = 48000
length = round(28.2 * sample_rate)
score = array('f', [0.0]) * length
rng = Random(20261110)

def chord(t):
    if t < 5.4: return (110.0, 164.8, 220.0)
    if t < 10: return (130.8, 196.0, 261.6)
    if t < 13.4: return (146.8, 220.0, 293.7)
    if t < 18.5: return (110.0, 164.8, 220.0)
    if t < 23.6: return (130.8, 196.0, 261.6)
    return (110.0, 164.8, 220.0)

for i in range(length):
    t = i / sample_rate
    a, c, e = chord(t)
    breath = .72 + .28 * math.sin(2 * math.pi * .17 * t)
    fade = min(1, t / .7, (28.2 - t) / 1.1)
    score[i] = fade * breath * (.018 * math.sin(2 * math.pi * a * t) + .012 * math.sin(2 * math.pi * c * t) + .008 * math.sin(2 * math.pi * e * t))

for index, cut in enumerate(cuts):
    start = round(cut * sample_rate)
    fundamental = (220, 261.6, 293.7, 329.6)[index % 4]
    for j in range(int(.64 * sample_rate)):
        if start + j >= length: break
        t = j / sample_rate
        pluck = math.exp(-t * 7.5) * (.11 * math.sin(2 * math.pi * fundamental * t) + .035 * math.sin(2 * math.pi * fundamental * 2.01 * t))
        score[start + j] += pluck
    low = 0.0
    for j in range(int(.15 * sample_rate)):
        if start + j >= length: break
        u = j / (.15 * sample_rate)
        low = .76 * low + .24 * rng.uniform(-1, 1)
        score[start + j] += low * math.sin(math.pi * u) ** 2 * .15

with wave.open(str(OUT / "score-v7.wav"), 'wb') as output:
    output.setnchannels(1)
    output.setsampwidth(2)
    output.setframerate(sample_rate)
    output.writeframes(array('h', (max(-32768, min(32767, int(x * 32767))) for x in score)).tobytes())

(OUT / "voice-cues-v7.json").write_text(json.dumps([{"from": start, "window": window, "text": line} for start, window, line in CUES], indent=2) + "\n")
