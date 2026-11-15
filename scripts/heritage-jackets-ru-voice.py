"""Offline Russian narration; no network, API keys or paid voice generation."""
from pathlib import Path
import subprocess,json
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/assets/heritage-jackets/voice-ru'
DELIVERY=ROOT/'renders/aiwardrobe-heritage-jackets/russian-v1'
rows=[
 (0.3,4.35,'Нравится такой стиль? Запомните эти пять брендов.','Нравится такой стиль? Запомните эти пять брендов.'),
 (4.7,8.35,'Barbour. Британский характер и вощёный хлопок.','Барбур. Британский характер и вощёный хлопок.'),
 (8.7,12.35,'Valstar. Мягкий силуэт и фактура замши.','Вальстар. Мягкий силуэт и фактура замши.'),
 (12.7,16.35,'Todd Snyder. Современный взгляд на классику.','Тодд Снайдер. Современный взгляд на классику.'),
 (16.7,20.35,'Buck Mason. Американский стиль. Простота и фактуры.','Бак Мэйсон. Американский стиль. Простота и фактуры.'),
 (20.52,24.35,'Rocky Mountain Featherbed. Вестерн и многослойность.','Рокки Маунтин Фезербед. Вестерн и многослойность.'),
 (24.8,28.8,'Пять подходов к стилю. Найдите среди них свой.','Пять подходов к стилю. Найдите среди них свой.'),
 (29.35,36.25,'Перенесите вдохновение в AIWardrobe. Откройте демо и найдите свой следующий образ.','Перенесите вдохновение в Эй Ай Уордроуб. Откройте демо и найдите свой следующий образ.'),
 (36.85,39.85,'Попробуйте AIWardrobe. Соберите свой образ.','Попробуйте Эй Ай Уордроуб. Соберите свой образ.'),
]
OUT.mkdir(exist_ok=True);DELIVERY.mkdir(exist_ok=True)
manifest=[]
for i,(start,end,script,spoken) in enumerate(rows,1):
 a=OUT/f'{i:02}.aiff';raw=OUT/f'{i:02}-raw.wav';final=OUT/f'{i:02}.wav'
 subprocess.run(['say','-v','Milena','-r','180','-o',str(a),spoken],check=True)
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(a),'-af','silenceremove=start_periods=1:start_threshold=-48dB,areverse,silenceremove=start_periods=1:start_threshold=-48dB,areverse',str(raw)],check=True)
 duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(raw)]))
 tempo=max(1,duration/(end-start-.06))
 if tempo>1.22:raise ValueError(f'Phrase {i} too long: {duration:.2f}s; rewrite rather than rush')
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(raw),'-af',f'atempo={tempo:.5f},highpass=f=80,loudnorm=I=-17:TP=-2:LRA=7','-ar','48000',str(final)],check=True)
 actual=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(final)]))
 manifest.append({'index':i,'start':start,'slotEnd':end,'duration':actual,'tempo':tempo,'script':script,'spoken':spoken,'file':str(final.relative_to(ROOT))})
 print(i,round(actual,2),round(tempo,3),script,flush=True)
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
(DELIVERY/'Voiceover-RU.md').write_text('# Текст озвучки — AIWardrobe\n\n40 секунд. Спокойно, уверенно, без рекламного нажима. Имена брендов в записи произносятся по-русски.\n\n'+'\n\n'.join(f'**{start:g}–{end:g} с**  \n{text}' for start,end,text,_ in rows)+'\n')
(DELIVERY/'Voiceover-RU.txt').write_text('\n\n'.join(text for _,_,text,_ in rows)+'\n')
