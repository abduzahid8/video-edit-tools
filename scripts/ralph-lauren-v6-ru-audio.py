"""Generate the Russian narration for the 32-second Ralph Lauren v6 cut."""
from pathlib import Path
import json
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/assets/ralph-lauren-editorial'
CUES = [
    (0.12, 2.27, 'Что делает Ральфа Лорена узнаваемым?'),
    (2.68, 2.77, 'В шестьдесят седьмом всё началось с ярких галстуков.'),
    (5.78, 2.00, 'Одна вещь. И целый мир.'),
    (8.08, 4.02, 'Рубашка поло сделала этот стиль повседневным.'),
    (12.48, 3.69, 'Преппи, точный крой и свобода сошлись вместе.'),
    (16.48, 4.65, 'Дабл Эр Эл обратился к Западу: деним, рабочая одежда, фактуры с характером.'),
    (21.48, 4.65, 'Пёрпл Лейбл добавила точный крой и более строгую элегантность.'),
    (26.48, 2.87, 'Разные вещи. Один узнаваемый взгляд на стиль.'),
    (29.68, 2.13, 'Мир, который можно носить.'),
]

def run(args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL)

with tempfile.TemporaryDirectory(prefix='ralph-ru-') as temp:
    clips = []
    for index, (start, window, line) in enumerate(CUES):
        aiff = Path(temp) / f'line-{index}.aiff'
        wav = Path(temp) / f'line-{index}.wav'
        run(['say', '-v', 'Milena', '-r', '183', '-o', str(aiff), line])
        duration = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', str(aiff)], text=True))
        tempo = max(1.0, duration / window)
        spoken = min(duration / tempo, window)
        run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(aiff), '-af', f'atempo={tempo:.5f},aresample=48000,highpass=f=85,afade=t=in:st=0:d=0.04,afade=t=out:st={spoken-.10:.3f}:d=0.10', '-ac', '1', '-c:a', 'pcm_s16le', str(wav)])
        clips.append((wav, round(start * 1000)))
        print(f'{start:05.2f}s  {spoken:04.2f}s  speed {tempo:.2f}  {line}')
    command = ['ffmpeg', '-y', '-loglevel', 'error']
    for wav, _ in clips:
        command += ['-i', str(wav)]
    parts = [f'[{i}:a]adelay={delay}|{delay}[v{i}]' for i, (_, delay) in enumerate(clips)]
    parts.append(''.join(f'[v{i}]' for i in range(len(clips))) + f'amix=inputs={len(clips)}:duration=longest:normalize=0,apad=whole_dur=32,atrim=duration=32[out]')
    run(command + ['-filter_complex', ';'.join(parts), '-map', '[out]', '-c:a', 'pcm_s16le', str(OUT / 'narration-v6-ru.wav')])

(OUT / 'voice-cues-v6-ru.json').write_text(json.dumps([{'from': start, 'window': window, 'text': line} for start, window, line in CUES], ensure_ascii=False, indent=2) + '\n')
