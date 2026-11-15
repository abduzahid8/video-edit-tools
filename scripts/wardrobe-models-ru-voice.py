"""Record the timed Russian script using the local macOS voice."""
import re
import subprocess
import tempfile
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / 'renders/scripts/wardrobe-models-ru-voiceover.md'
OUTPUT = ROOT / 'public/assets/wardrobe-models/narration-ru.wav'
RATE = 48000


def seconds(value):
    minutes, remainder = value.split(':')
    return int(minutes) * 60 + float(remainder)


track = bytearray()
with tempfile.TemporaryDirectory(prefix='wardrobe-voice-ru-') as temp:
    clip = Path(temp) / 'voice.aiff'
    for start, stop, text in re.findall(r'\| (\d\d:\d\d\.\d\d)–(\d\d:\d\d\.\d\d) \| (.*?) \|', SCRIPT.read_text()):
        at, end = seconds(start), seconds(stop)
        speed = 173
        subprocess.run(['say', '-v', 'Milena', '-r', str(speed), '-o', str(clip), text], check=True)
        duration = float(subprocess.check_output([
            'ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(clip),
        ]))
        tempo = max(1, duration / (end - at - .04))
        pcm = subprocess.check_output([
            'ffmpeg', '-v', 'error', '-i', str(clip), '-af',
            f'atempo={tempo:.5f},highpass=f=85,loudnorm=I=-17:TP=-2:LRA=6',
            '-ar', str(RATE), '-ac', '1', '-f', 's16le', '-',
        ])
        first = round(at * RATE) * 2
        available = round(end * RATE) * 2 - first
        if first < len(track) or len(pcm) > available:
            raise ValueError(f'Voice exceeds its slot at {start}: {text}')
        track.extend(bytes(first - len(track)))
        track.extend(pcm)
        print(f'{start} | {len(pcm) / 2 / RATE:.2f}s | {text}')
        clip.unlink()
with wave.open(str(OUTPUT), 'wb') as wav:
    wav.setparams((1, 2, RATE, 0, 'NONE', 'not compressed'))
    wav.writeframes(track)
