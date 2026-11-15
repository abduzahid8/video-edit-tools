"""Offline system narration and deterministic original sound. No API/music downloads."""
from pathlib import Path
import subprocess, json, wave, math
from array import array
from random import Random
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/assets/four-freedoms'
OUT.mkdir(exist_ok=True)
CUES=[
(.18,4.55,'What does modern luxury look like? Four stories. One considered life.'),
(4.98,14.18,'Ralph Lauren brought Polo culture to Tokyo. Archives, collectors, and vintage pieces. A world that lives beyond the shirt.'),
(14.58,23.78,"Audemars Piguet reimagines Royal Oak geometry as jewellery. For a man's wardrobe, take the principle: one signature detail, worn with confidence."),
(24.18,33.38,'American Express opens a Centurion Lounge at Schiphol. The style lesson for the journey? Soft tailoring, a good coat, and room to move.'),
(33.78,42.98,'Equinox brings performance luxury to Amaala on the Red Sea. Think recovery, balance, and an easier pace. Dress with the same intention.'),
(43.38,47.80,'Four different worlds. One question: how do you make them your own?'),
(48.18,57.35,'Start with A I Wardrobe. Choose the occasion and your style. Explore a suggested outfit, then plan the look in your calendar.'),
(57.72,60.40,'Try the demo. Find your next look.'),
]
manifest=[]
for i,(start,end,line) in enumerate(CUES,1):
 raw=OUT/f'voice-{i:02}-raw.aiff';wav=OUT/f'voice-{i:02}.wav'
 subprocess.run(['say','-v','Daniel','-r','172','-o',str(raw),line],check=True)
 duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(raw)]))
 tempo=max(1,duration/(end-start-.04))
 if tempo>1.22: raise RuntimeError(f'Phrase {i} needs rewrite, tempo {tempo}')
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(raw),'-af',f'atempo={tempo:.6f},highpass=f=75,loudnorm=I=-17:TP=-2:LRA=7,afade=t=in:d=0.015','-ar','48000','-ac','1',str(wav)],check=True)
 actual=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(wav)]))
 manifest.append(dict(start=start,end=end,duration=actual,tempo=tempo,text=line,file=wav.name))
 print(i,round(actual,2),round(tempo,3),flush=True)
 raw.unlink()
(OUT/'voice-manifest.json').write_text(json.dumps(manifest,indent=2))
# 100 BPM: four beats = 2.4 seconds. Minimal felt-like plucks, bass and paper ticks.
sr=48000;duration=60.6;buf=array('f',[0])*round(sr*duration);rng=Random(17)
for i in range(len(buf)):
 t=i/sr;fade=max(0,min(1,t/.8,(duration-t)/1.3))
 chord=[(110,164.81,220),(130.81,196,261.63),(146.83,220,293.66),(98,146.83,196)][int(t/9.6)%4]
 buf[i]=fade*sum(.009/(j+1)*math.sin(2*math.pi*f*t) for j,f in enumerate(chord))
for beat in range(101):
 start=round(beat*.6*sr);freq=[220,329.63,261.63,293.66,196,329.63,261.63,392][beat%8]
 for j in range(round(.7*sr)):
  if start+j>=len(buf):break
  t=j/sr;env=math.exp(-t*7.2)*(1-math.exp(-t*140))
  buf[start+j]+=env*(.047*math.sin(2*math.pi*freq*t)+.014*math.sin(2*math.pi*freq*2.003*t))
 if beat%4==0:
  low=0
  for j in range(round(.11*sr)):
   if start+j>=len(buf):break
   u=j/(.11*sr);low=.72*low+.28*rng.uniform(-1,1)
   buf[start+j]+=.09*low*math.sin(math.pi*u)**2
for i in range(len(buf)):
 buf[i]*=max(0,min(1,i/sr/.7,(duration-i/sr)/1.3))
with wave.open(str(OUT/'score.wav'),'wb') as w:
 w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr)
 w.writeframes(array('h',[max(-32768,min(32767,round(v*32767))) for v in buf]).tobytes())
print('score.wav',duration,flush=True)
