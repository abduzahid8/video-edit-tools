"""Offline Russian narration plus non-musical sound hook. No paid APIs or keys."""
from pathlib import Path
import json,re,subprocess,wave
import numpy as np
root=Path(__file__).resolve().parents[1];public=root/'public/assets/color-editorial';out=public/'voice';out.mkdir(exist_ok=True)
timeline=(root/'src/video/timeline.ts').read_text()
cues=json.loads(re.search(r'export const founderVoiceCues = (\[.*?\]) as const;',timeline,re.S).group(1))
block=re.search(r'export const colorEditorialTimeline = \{(.*?)\n\};',timeline,re.S).group(1)
duration=float(re.search(r'duration:(\d+)',block).group(1));sr=48000;voice=np.zeros(int(sr*duration));manifest=[]
def write(path,data):
 data=np.clip(data,-.98,.98)
 with wave.open(str(path),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((data*32767).astype('<i2').tobytes())
for i,cue in enumerate(cues):
 src=out/f'cue-{i+1:02}.aiff';dst=out/f'cue-{i+1:02}.wav'
 subprocess.run(['say','-v','Milena','-r','185','-o',str(src),cue['text']],check=True)
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(src),'-ac','1','-ar',str(sr),'-f','f32le','-'])
 a=np.frombuffer(raw,dtype='<f4').astype(np.float64);active=np.where(np.abs(a)>.004)[0]
 if len(active):a=a[max(0,active[0]-int(.025*sr)):min(len(a),active[-1]+int(.04*sr))]
 original=len(a)/sr;speed=max(1,original/cue['seconds'])
 if speed>1.015:
  write(dst,a)
  raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(dst),'-af',f'atempo={speed:.6f}','-ac','1','-ar',str(sr),'-f','f32le','-'])
  a=np.frombuffer(raw,dtype='<f4').astype(np.float64)
 a=a[:int(cue['seconds']*sr)];peak=np.max(np.abs(a));a*=.72/max(peak,.01)
 fade=min(int(.012*sr),len(a)//4);a[:fade]*=np.linspace(0,1,fade);a[-fade:]*=np.linspace(1,0,fade)
 write(dst,a);at=int(cue['from']*sr);voice[at:at+len(a)]+=a
 manifest.append({**cue,'voice':'macOS Milena','actualDuration':round(len(a)/sr,3),'timeCompression':round(speed,3)})
 print(i+1,round(len(a)/sr,2),'speed',round(speed,2),cue['text'],flush=True)
write(public/'founder-voiceover-ru.wav',voice)
(public/'voiceover-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
# A brief air sweep and shutter-like transient, followed by occasional edit accents.
# No melody, bass line, backing track or continuous rhythmic beat.
rng=np.random.default_rng(311);fx=np.zeros_like(voice)
def add(at,a):
 pos=int(at*sr);n=min(len(a),len(fx)-pos)
 if n>0:fx[pos:pos+n]+=a[:n]
t=np.arange(int(.45*sr))/sr;noise=rng.normal(0,1,len(t));noise=np.convolve(noise,np.ones(13)/13,'same');add(0,noise*np.sin(np.pi*np.arange(len(t))/len(t))**2*.27)
t=np.arange(int(.20*sr))/sr;add(.12,np.sin(2*np.pi*(62*t+18*(1-np.exp(-t*32))/32))*np.exp(-t*28)*.22)
for at in [0.035,.18]+[float(v) for v in re.findall(r'from:([\d.]+),seconds:',block) if float(v)>0]:
 t=np.arange(int(.045*sr))/sr;n=rng.normal(0,1,len(t));n=np.diff(n,prepend=0);add(at,n*np.exp(-t*110)*(.032 if at<.3 else .013))
# Reduce the sound effects under speech, preserving intelligibility.
for cue in manifest:
 a=int(cue['from']*sr);z=int((cue['from']+cue['actualDuration'])*sr);fx[a:z]*=.45
write(public/'founder-audio-hook.wav',fx)
