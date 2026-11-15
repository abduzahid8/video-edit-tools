"""Original deterministic editorial Foley accents; no music or voice."""
import numpy as np,wave
from pathlib import Path
sr=48000;dur=39;rng=np.random.default_rng(2603);mix=np.zeros((dur*sr,2))
def add(at,a,pan=0):
 i=int(at*sr);n=min(len(a),len(mix)-i)
 if n>0:
  mix[i:i+n,0]+=a[:n]*(1-pan*.35);mix[i:i+n,1]+=a[:n]*(1+pan*.35)
def sweep(at,pan=0):
 t=np.arange(int(sr*.36))/sr;n=rng.normal(size=len(t));n=np.convolve(n,np.ones(19)/19,'same');env=np.sin(np.pi*t/.36)**2;add(at,n*env*.15,pan)
def tick(at,pan=0):
 t=np.arange(int(sr*.075))/sr;n=rng.normal(size=len(t));a=np.diff(n,prepend=0)*np.exp(-t*100)*.025;add(at,a,pan)
def thud(at):
 t=np.arange(int(sr*.18))/sr;a=np.sin(2*np.pi*(65*t+28*t*np.exp(-t*25)))*np.exp(-t*30)*np.minimum(t*150,1)*.11;add(at,a)
for i,at in enumerate([.12,.4,.7,2.55,4.45,7.15,11.95,14.6,19.45,22.2,26.95,30.45,34.95]):sweep(at,(-1)**i*.6)
for start in [4.5,12,19.5]:
 thud(start+.8)
 for at in [start+1.7,start+3.5,start+4.2,start+5.15]:tick(at,(-1)**int(at)*.4)
for at in [3.1,3.35,27.4,28.4,29.4,35.5,36.1]:tick(at)
thud(.3);thud(35.7)
mix=np.tanh(mix*1.4)*.85
p=Path('public/assets/boots-editorial/motion-accents.wav')
with wave.open(str(p),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((mix*32767).astype('<i2').tobytes())
