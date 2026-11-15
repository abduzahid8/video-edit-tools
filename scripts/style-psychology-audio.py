"""Offline guide voices and a deterministic original score. No paid APIs or music downloads."""
from pathlib import Path
import subprocess,json,wave,math
from array import array
from random import Random
root=Path(__file__).resolve().parents[1];out=root/'public/assets/style-psychology'
delivery=root/'renders/aiwardrobe-style-psychology';delivery.mkdir(exist_ok=True)
lines={
'en':[
'Dressing well can change more than how you look. Notice how you feel.',
'Your clothes send a signal to the room, and to yourself.',
'Psychologists call it enclothed cognition. Clothing can influence how we feel.',
'Start with the fit. A natural shoulder. Enough room to move.',
'Choose a considered palette. Let texture add character.',
'Keep the details that feel like you. Make dressing a small daily ritual.',
'Dress for the day ahead. Turn inspiration into your own wardrobe.',
'With A I Wardrobe, start with what you own. Choose your occasion.',
'Explore a suggested outfit. Then plan your look in the calendar.',
'See it in action. Try the A I Wardrobe demo. Dress with intention.',
],
'ru':[
'Хороший образ меняет не только внешний вид. Заметьте, как вы себя чувствуете.',
'Одежда посылает сигнал окружающим. И вам самому.',
'Одежда может влиять на самоощущение. Психологи изучают этот эффект.',
'Начните с посадки. Естественная линия плеч. Свобода движений.',
'Выберите спокойную палитру. Пусть фактура добавит характер.',
'Сохраните свои любимые детали. Сделайте выбор одежды небольшим ритуалом.',
'Подумайте о дне впереди. Превратите вдохновение в свой гардероб.',
'В Эй Ай Уордроуб начните со своих вещей. Выберите повод.',
'Посмотрите предложенный комплект. Запланируйте образ в календаре.',
'Попробуйте демо Эй Ай Уордроуб. Найдите свой образ. Одевайтесь осознанно.',
]}
all_manifest={}
for lang,voice in [('en','Daniel'),('ru','Milena')]:
 p=out/f'voice-{lang}';p.mkdir(exist_ok=True)
 rows=[]
 for i,line in enumerate(lines[lang]):
  start=round(.16+i*4.8,2);end=round((i+1)*4.8-.15,2)
  aiff=p/f'{i+1:02}.aiff';raw=p/f'{i+1:02}-raw.wav';wav=p/f'{i+1:02}.wav'
  subprocess.run(['say','-v',voice,'-r','184' if lang=='en' else '183','-o',str(aiff),line],check=True)
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(aiff),'-af','silenceremove=start_periods=1:start_threshold=-48dB,areverse,silenceremove=start_periods=1:start_threshold=-48dB,areverse',str(raw)],check=True)
  duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(raw)]))
  tempo=max(1,duration/(end-start-.08))
  if tempo>1.23:raise ValueError(f'{lang} {i+1} needs rewrite: {duration:.2f}s, tempo {tempo:.2f}')
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(raw),'-af',f'atempo={tempo:.6f},highpass=f=75,loudnorm=I=-17:TP=-2:LRA=7,afade=t=in:d=0.012,afade=t=out:st={max(0,duration/tempo-.04):.4f}:d=0.04','-ar','48000','-ac','1',str(wav)],check=True)
  actual=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(wav)]))
  if actual>end-start+.02:raise ValueError('Voice exceeds timing slot')
  rows.append(dict(index=i+1,start=start,end=end,duration=actual,tempo=tempo,text=line,file=wav.name,voice=voice))
  aiff.unlink();raw.unlink();print(lang,i+1,round(actual,2),round(tempo,3),flush=True)
 (p/'manifest.json').write_text(json.dumps(rows,indent=2,ensure_ascii=False));all_manifest[lang]=rows
 display=[s.replace('A I Wardrobe','AIWardrobe').replace('Эй Ай Уордроуб','AIWardrobe') for s in lines[lang]]
 (delivery/f'Voiceover-{lang.upper()}.txt').write_text('\n\n'.join(display)+'\n')
 (delivery/f'Voiceover-{lang.upper()}-timed.md').write_text(f'# AIWardrobe — {lang.upper()} voiceover\n\n48 seconds. Calm, assured, conversational. Allow pauses at each visual change.\n\n'+'\n\n'.join(f'**{r["start"]:.2f}–{r["end"]:.2f}**  \n{line}' for r,line in zip(rows,display))+'\n\nPronunciation: AIWardrobe = “A I Wardrobe” / «Эй Ай Уордроуб».\n')
 def stamp(sec):
  ms=round(sec*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
 (delivery/f'Voiceover-{lang.upper()}.srt').write_text('\n\n'.join(f'{r["index"]}\n{stamp(r["start"])} --> {stamp(r["start"]+r["duration"])}\n{line}' for r,line in zip(rows,display))+'\n')
(out/'voice-manifest.json').write_text(json.dumps(all_manifest,indent=2,ensure_ascii=False))
# 100 BPM: one meaningful visual change every four beats (2.4 s).
sr=48000;duration=48;buf=array('f',[0])*round(sr*duration);rng=Random(401)
for i in range(len(buf)):
 s=i/sr;fade=max(0,min(1,s/.6,(duration-s)/1.2))
 chord=[(110,164.81,220),(130.81,196,261.63),(146.83,220,293.66),(98,146.83,196)][int(s/9.6)%4]
 buf[i]=fade*sum(.007/(j+1)*math.sin(2*math.pi*f*s) for j,f in enumerate(chord))
for beat in range(80):
 start=round(beat*.6*sr);freq=[220,329.63,261.63,293.66,196,329.63,261.63,392][beat%8]
 for j in range(round(.66*sr)):
  if start+j>=len(buf):break
  s=j/sr;env=math.exp(-s*7.5)*(1-math.exp(-s*160))
  buf[start+j]+=env*(.05*math.sin(2*math.pi*freq*s)+.012*math.sin(2*math.pi*freq*2.003*s))
 if beat%4==0:
  low=0
  for j in range(round(.09*sr)):
   if start+j>=len(buf):break
   u=j/(.09*sr);low=.72*low+.28*rng.uniform(-1,1);buf[start+j]+=.055*low*math.sin(math.pi*u)**2
for i in range(len(buf)):buf[i]*=max(0,min(1,i/sr/.5,(duration-i/sr)/1.2))
with wave.open(str(out/'score.wav'),'wb') as w:
 w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr)
 w.writeframes(array('h',[max(-32768,min(32767,round(v*32767))) for v in buf]).tobytes())
print('Original score complete',flush=True)
