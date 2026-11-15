"""Russian localization: offline narration; retain the existing score and picture timing."""
from pathlib import Path
import subprocess,json
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/assets/four-freedoms/voice-ru'
DELIVERY=ROOT/'renders/aiwardrobe-four-stories/russian'
OUT.mkdir(parents=True,exist_ok=True);DELIVERY.mkdir(parents=True,exist_ok=True)
rows=[
(.18,4.55,'Как выглядит современная роскошь? Четыре истории об осознанной жизни.'),
(4.98,14.18,'Ralph Lauren привёз культуру Polo в Токио: архивы, коллекционеры и винтаж. Целый мир, который выходит далеко за пределы одежды.'),
(14.58,23.78,'Audemars Piguet превращает геометрию Royal Oak в украшения. В мужском стиле работает тот же принцип: одна выразительная деталь.'),
(24.18,33.38,'American Express открывает зал Centurion в аэропорту Схипхол. А для путешествия выбираем мягкий крой, хорошее пальто и свободу движений.'),
(33.78,42.98,'Equinox привносит философию восстановления на курорт Амаала у Красного моря. Баланс, отдых и спокойный ритм. В одежде — та же лёгкость.'),
(43.38,47.80,'Четыре разных мира. Как сделать их частью своего стиля?'),
(48.18,57.35,'Начните с AIWardrobe. Выберите повод и свой стиль. Посмотрите предложенный комплект и запланируйте образ в календаре.'),
(57.72,60.40,'Откройте демо. Найдите свой образ.'),
]
pronunciation={'Ralph Lauren':'Ральф Лорен','Polo':'Поло','Audemars Piguet':'Одемар Пиге','Royal Oak':'Ройал Оук','American Express':'Американ Экспресс','Centurion':'Сентурион','Equinox':'Иквинокс','AIWardrobe':'Эй Ай Уордроуб'}
manifest=[]
for i,(start,end,line) in enumerate(rows,1):
 spoken=line
 for source,target in pronunciation.items():spoken=spoken.replace(source,target)
 aiff=OUT/f'{i:02}.aiff';raw=OUT/f'{i:02}-raw.wav';wav=OUT/f'{i:02}.wav'
 subprocess.run(['say','-v','Milena','-r','180','-o',str(aiff),spoken],check=True)
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(aiff),'-af','silenceremove=start_periods=1:start_threshold=-48dB,areverse,silenceremove=start_periods=1:start_threshold=-48dB,areverse',str(raw)],check=True)
 duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(raw)]))
 tempo=max(1,duration/(end-start-.10))
 if tempo>1.22: raise ValueError(f'Phrase {i} too long: {duration:.3f}s, tempo {tempo:.3f}. Rewrite.')
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(raw),'-af',f'atempo={tempo:.6f},highpass=f=75,loudnorm=I=-17:TP=-2:LRA=7,afade=t=in:d=0.015','-ar','48000','-ac','1',str(wav)],check=True)
 actual=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(wav)]))
 manifest.append(dict(index=i,start=start,end=end,duration=actual,tempo=tempo,text=line,spoken=spoken,file=wav.name))
 aiff.unlink();raw.unlink();print(i,round(actual,2),round(tempo,3),flush=True)
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False))
(DELIVERY/'Voiceover-RU.md').write_text('# AIWardrobe — русский текст озвучки\n\n60,6 секунды · 1080×1920 · 30 кадров/с. Подача спокойная и уверенная.\n\n'+'\n\n'.join(f'**{a:g}–{b:g} с**  \n{line}' for a,b,line in rows)+'\n\nПроизношение AIWardrobe: «Эй Ай Уордроуб».\n')
(DELIVERY/'Voiceover-RU.txt').write_text('\n\n'.join(line for _,_,line in rows)+'\n')
