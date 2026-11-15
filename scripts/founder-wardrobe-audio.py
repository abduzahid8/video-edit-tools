"""Offline English editorial narration and quiet deterministic paper Foley."""
from pathlib import Path
import re,json,subprocess,wave
import numpy as np
from scipy.signal import butter,sosfilt
root=Path(__file__).resolve().parents[1];p=root/'public/assets/founder-wardrobe';out=p/'voice';out.mkdir(exist_ok=True)
ts=(root/'src/video/timeline.ts').read_text();block=ts.split('export const founderWardrobeVoice = [',1)[1].split('] as const;',1)[0]
cues=[{'from':float(a),'seconds':float(b),'text':c} for a,b,c in re.findall(r"\{from: ([\d.]+), seconds: ([\d.]+), text: '([^']+)'\}",block)]
sr=48000;duration=42;voice=np.zeros(sr*duration);fx=np.zeros((sr*duration,2));rng=np.random.default_rng(8814);manifest=[]
def write(path,a):
 with wave.open(str(path),'wb') as w:
  w.setnchannels(1 if a.ndim==1 else a.shape[1]);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(a,-.96,.96)*32767).astype('<i2').tobytes())
for i,cue in enumerate(cues):
 src=out/f'{i+1:02}.aiff';subprocess.run(['say','-v','Daniel','-r','174','-o',str(src),cue['text']],check=True)
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(src),'-ac','1','-ar',str(sr),'-f','f32le','-']);a=np.frombuffer(raw,dtype='<f4').astype(float);active=np.flatnonzero(abs(a)>.003)
 if len(active):a=a[max(0,active[0]-int(.025*sr)):min(len(a),active[-1]+int(.07*sr))]
 speed=max(1,len(a)/sr/cue['seconds'])
 if speed>1:
  tmp=out/f'{i+1:02}-original.wav';write(tmp,a)
  raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(tmp),'-af',f'atempo={speed:.8f}','-f','f32le','-']);a=np.frombuffer(raw,dtype='<f4').astype(float)
 a=a[:round(cue['seconds']*sr)];a*=.78/max(abs(a).max(),.01);fade=min(480,len(a)//4);a[:fade]*=np.linspace(0,1,fade);a[-fade:]*=np.linspace(1,0,fade)
 at=round(cue['from']*sr);voice[at:at+len(a)]+=a;write(out/f'{i+1:02}.wav',a)
 manifest.append({**cue,'actualSeconds':round(len(a)/sr,3),'timeCompression':round(speed,3),'voice':'macOS Daniel; offline synthetic narration, not a founder voice'})
 print(i+1,round(len(a)/sr,2),round(speed,2),flush=True)
def add(at,a,pan=0):
 pos=round(at*sr);n=min(len(a),len(fx)-pos)
 if n>0:fx[pos:pos+n]+=a[:n,None]*np.array([1-pan*.25,1+pan*.25])
for at in [0,.46,.94,3.4,6.3,10.6,13.5,17.8,20.6,25,27.8,32.2,36,40]:
 tt=np.arange(round(.055*sr))/sr;n=sosfilt(butter(2,[1300,8500],btype='bandpass',fs=sr,output='sos'),rng.normal(size=len(tt)));add(at,n*np.exp(-tt*105)*.04)
for at in [2.95,10.15,17.35,24.6,27.4,31.8,35.6,39.6]:
 tt=np.arange(round(.4*sr))/sr;n=sosfilt(butter(2,[350,4000],btype='bandpass',fs=sr,output='sos'),rng.normal(size=len(tt)));add(at,n*np.sin(np.pi*tt/.4)**2*.035)
write(p/'narration.wav',voice);write(p/'paper-foley.wav',fx)
(p/'voice-manifest.json').write_text(json.dumps(manifest,indent=2))
assert len(cues)==8, 'Missing authored voice cues'
