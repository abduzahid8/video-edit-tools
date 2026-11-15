"""Generate local English narration and retime an existing project score."""
from pathlib import Path
import json
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/assets/ralph-lauren-editorial"
OUT.mkdir(parents=True, exist_ok=True)

CUES = [
    (0.28, 4.45, "What makes Ralph Lauren instantly recognizable?"),
    (5.25, 4.55, "It began in 1967, with wide, expressive ties."),
    (10.18, 3.60, "But the idea was always bigger than one piece."),
    (14.22, 6.45, "In 1972, the Polo shirt brought that vision into everyday life."),
    (21.25, 5.48, "Soon, a wardrobe could suggest a campus, a country house, or the city."),
    (27.26, 6.40, "Double RL, launched in 1993, drew on the American West."),
    (34.25, 6.40, "Purple Label arrived in 1995, with a more formal vision of menswear."),
    (41.24, 5.52, "Different worlds. One unmistakable point of view."),
    (47.18, 4.55, "Ralph Lauren made style feel like a life you could enter."),
]

def run(args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL)

with tempfile.TemporaryDirectory() as tmp:
    delayed = []
    for index, (start, available, line) in enumerate(CUES):
        aiff = Path(tmp) / f"line-{index}.aiff"
        wav = Path(tmp) / f"line-{index}.wav"
        run(["say", "-v", "Daniel", "-r", "162", "-o", str(aiff), line])
        duration = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(aiff)], text=True))
        tempo = max(1.0, duration / available)
        run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(aiff), "-af", f"atempo={tempo:.5f},aresample=48000,afade=t=in:st=0:d=0.08,afade=t=out:st={min(duration/tempo, available)-0.12:.3f}:d=0.12", "-ac", "1", str(wav)])
        delayed.append((wav, round(start * 1000)))
        print(f"{start:05.2f}s  {duration/tempo:04.2f}s  {line}")
    args = ["ffmpeg", "-y", "-loglevel", "error"]
    for wav, _ in delayed:
        args += ["-i", str(wav)]
    parts = [f"[{i}:a]adelay={delay}|{delay}[v{i}]" for i, (_, delay) in enumerate(delayed)]
    parts.append("".join(f"[v{i}]" for i in range(len(delayed))) + f"amix=inputs={len(delayed)}:duration=longest:normalize=0,apad=whole_dur=52,atrim=duration=52[out]")
    run(args + ["-filter_complex", ";".join(parts), "-map", "[out]", "-c:a", "pcm_s16le", str(OUT / "narration.wav")])

run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(ROOT / "public/assets/new-example-wardrobe/score-48.wav"), "-af", "atempo=0.9230769,afade=t=out:st=49:d=3", "-t", "52", "-c:a", "pcm_s16le", str(OUT / "score.wav")])
(OUT / "voice-cues.json").write_text(json.dumps([{"from": start, "window": available, "text": line} for start, available, line in CUES], indent=2) + "\n")
