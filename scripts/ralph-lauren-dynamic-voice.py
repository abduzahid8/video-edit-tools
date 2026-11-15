"""Locally synthesize the tighter 36-second Ralph Lauren narration."""
from pathlib import Path
import json
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/assets/ralph-lauren-editorial"

CUES = [
    (0.14, 2.75, "What makes Ralph Lauren unmistakable?"),
    (3.25, 3.55, "It began in 1967, with expressive ties."),
    (7.14, 2.35, "One piece. A much bigger world."),
    (9.76, 4.25, "In 1972, the Polo shirt brought that vision into everyday life."),
    (14.26, 3.70, "Prep, tailoring, and the outdoors shared one point of view."),
    (18.26, 4.95, "Double RL looked west: denim, workwear, lived-in texture."),
    (23.56, 4.95, "Purple Label arrived in 1995, sharpening the tailoring and the sense of occasion."),
    (28.86, 3.55, "Different moods. The same vision."),
    (32.76, 3.00, "Ralph Lauren made a world you could wear."),
]

def run(args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL)

with tempfile.TemporaryDirectory() as tmp:
    clips = []
    for index, (start, window, line) in enumerate(CUES):
        aiff = Path(tmp) / f"line-{index}.aiff"
        wav = Path(tmp) / f"line-{index}.wav"
        run(["say", "-v", "Daniel", "-r", "178", "-o", str(aiff), line])
        duration = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(aiff)], text=True))
        tempo = max(1.0, duration / window)
        spoken = min(duration / tempo, window)
        run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(aiff), "-af", f"atempo={tempo:.5f},aresample=48000,afade=t=in:st=0:d=0.05,afade=t=out:st={spoken-0.10:.3f}:d=0.10", "-ac", "1", str(wav)])
        clips.append((wav, round(start * 1000)))
        print(f"{start:05.2f}s  {spoken:04.2f}s  {line}")
    args = ["ffmpeg", "-y", "-loglevel", "error"]
    for wav, _ in clips:
        args += ["-i", str(wav)]
    parts = [f"[{i}:a]adelay={delay}|{delay}[v{i}]" for i, (_, delay) in enumerate(clips)]
    parts.append("".join(f"[v{i}]" for i in range(len(clips))) + f"amix=inputs={len(clips)}:duration=longest:normalize=0,apad=whole_dur=36,atrim=duration=36[out]")
    run(args + ["-filter_complex", ";".join(parts), "-map", "[out]", "-c:a", "pcm_s16le", str(OUT / "narration-dynamic.wav")])

run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(ROOT / "public/assets/new-example-wardrobe/score-48.wav"), "-af", "atempo=1.333333,afade=t=out:st=33:d=3", "-t", "36", "-c:a", "pcm_s16le", str(OUT / "score-dynamic.wav")])
(OUT / "voice-cues-dynamic.json").write_text(json.dumps([{"from": start, "window": window, "text": line} for start, window, line in CUES], indent=2) + "\n")
