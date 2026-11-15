"""Write bilingual recording scripts and an original deterministic sound bed."""
from pathlib import Path
import json, math, wave
from array import array
from random import Random

root = Path(__file__).resolve().parents[1]
out = root / 'renders/aiwardrobe-taste-over-price'
assets = root / 'public/assets/taste-over-price'
out.mkdir(exist_ok=True)
lines = {
 'en': [
  "An expensive wardrobe doesn't guarantee good style. Taste shows in the details.",
  "Start with the fit. A clean shoulder. A jacket that sits right.",
  "Then consider proportion. Where the jacket ends. How the trousers fall.",
  "Keep your colours considered. Let texture give a simple outfit character.",
  "The real skill is combining pieces. Start with the clothes you already own.",
  "That's where AIWardrobe comes in. Your wardrobe. Your occasion.",
  "Explore an outfit suggestion. See how the pieces work together.",
  "Try the AIWardrobe demo. Build your next look. Make it yours.",
 ],
 'ru': [
  "Дорогой гардероб ещё не означает хороший стиль. Вкус проявляется в деталях.",
  "Начните с посадки. Чёткая линия плеч. Пиджак, который хорошо сидит.",
  "Затем — пропорции. Где заканчивается пиджак. Как ложатся брюки.",
  "Выберите спокойную палитру. Пусть фактура добавит простому образу характер.",
  "Секрет — в сочетаниях. Начните с вещей, которые у вас уже есть.",
  "В этом поможет AIWardrobe. Ваш гардероб. Ваш повод.",
  "Посмотрите предложенный образ. Оцените, как вещи сочетаются друг с другом.",
  "Попробуйте демо AIWardrobe. Соберите новый образ. Найдите свой стиль.",
 ]
}

def stamp(sec):
 ms=round(sec*1000)
 return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'

for lang,copy in lines.items():
 (out/f'Voiceover-{lang.upper()}.txt').write_text('\n\n'.join(copy)+'\n')
 (out/f'Voiceover-{lang.upper()}-timed.md').write_text(
  '# AIWardrobe — Taste over price / '+lang.upper()+'\n\n'
  '38.4 seconds. Narration is not recorded in the MP4. Calm, clear, assured delivery. '
  'Start each block at its cue and finish before the next. Leave the last 0.4 seconds to breathe.\n\n'
  '| In | Out | Voiceover |\n|---|---|---|\n'+
  '\n'.join(f'| {i*4.8+.15:.2f} | {(i+1)*4.8-.15:.2f} | {line} |' for i,line in enumerate(copy))+
  '\n\nAIWardrobe pronunciation: “A I Wardrobe” / «Эй Ай Уордроуб». '
  'Timing is an intended read, not forced alignment to recorded speech.\n')
 (out/f'Voiceover-{lang.upper()}.srt').write_text('\n\n'.join(
  f'{i+1}\n{stamp(i*4.8+.15)} --> {stamp((i+1)*4.8-.15)}\n{line}' for i,line in enumerate(copy))+'\n')

(out/'Voiceover-bilingual.md').write_text('# AIWardrobe — Voiceover scripts\n\n'
 '38.4-second English and Russian edits. The videos contain an original instrumental sound bed; narration is ready to record. '
 'Read calmly, approximately 150 words per minute in English. Brand pronunciation: “A I Wardrobe” / «Эй Ай Уордроуб».\n\n'+
 '\n\n'.join('## '+('English' if lang=='en' else 'Русский')+'\n\n'+'\n\n'.join(copy) for lang,copy in lines.items()))

# A restrained 100 BPM Rhodes-like arpeggio with soft bass and paper ticks.
# Procedural synthesis only: no downloaded music, samples, or paid APIs.
sr=48000; duration=38.4; buf=array('f',[0])*round(sr*duration); rng=Random(115)
chords=[(146.83,220,261.63,329.63),(130.81,196,246.94,293.66),(110,164.81,220,261.63),(98,146.83,196,246.94)]
for beat in range(64):
 at=beat*.6; chord=chords[(beat//16)%4];freq=chord[beat%4]
 for j in range(round(1.25*sr)):
  idx=round(at*sr)+j
  if idx>=len(buf):break
  sec=j/sr;env=(1-math.exp(-sec*95))*math.exp(-sec*4)
  buf[idx]+=env*(.075*math.sin(2*math.pi*freq*sec)+.019*math.sin(2*math.pi*freq*2.004*sec)+.006*math.sin(2*math.pi*freq*3*sec))
 if beat%4==0:
  for j in range(round(.6*sr)):
   idx=round(at*sr)+j
   if idx>=len(buf):break
   sec=j/sr;buf[idx]+=.065*math.sin(2*math.pi*(chord[0]/2)*sec)*(1-math.exp(-sec*90))*math.exp(-sec*6)
  low=0
  for j in range(round(.08*sr)):
   idx=round(at*sr)+j
   if idx>=len(buf):break
   low=.75*low+.25*rng.uniform(-1,1)
   buf[idx]+=.065*low*math.sin(math.pi*j/(.08*sr))**2
pcm=array('h')
for i,v in enumerate(buf):
 sec=i/sr;fade=max(0,min(1,sec/.25,(duration-sec)/.9))
 pcm.append(max(-32768,min(32767,round(v*fade*32767))))
with wave.open(str(assets/'score.wav'),'wb') as w:
 w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes(pcm.tobytes())

(out/'shot-audit.json').write_text(json.dumps({'duration':duration,'fps':30,'shot_seconds':2.4,'max_unchanged_shot_seconds':2.4,
 'shots':[{'index':i+1,'start':round(i*2.4,1),'end':round((i+1)*2.4,1)} for i in range(16)],
 'note':'Every boundary introduces a new photograph, crop, layout, or real demo state. Drifting a still is not counted as new information.'},indent=2))
print('Bilingual scripts, timing audit and original score written.')
