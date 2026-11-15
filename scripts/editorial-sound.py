"""Deterministic original minimal editorial rhythm, no downloaded music."""
import numpy as np,wave
from pathlib import Path
sr=48000;duration=32
mix=np.zeros((sr*duration,2),np.float64);rng=np.random.default_rng(91)
def add(at,s,pan=0):
 i=int(at*sr);n=min(len(s),len(mix)-i)
 if n<=0:return
 mix[i:i+n,0]+=s[:n]*(1-pan*.3);mix[i:i+n,1]+=s[:n]*(1+pan*.3)
for beat in range(64):
 at=beat*.5
 t=np.arange(int(.3*sr))/sr
 kick=np.sin(2*np.pi*(48*t+11*(1-np.exp(-t*32))/32))*np.exp(-t*19)*.18
 add(at,kick)
 if beat%2:
  t=np.arange(int(.14*sr))/sr;n=rng.normal(0,1,len(t));n=np.diff(n,prepend=0)
  add(at,n*np.exp(-t*48)*.026)
 for shift in [.25]:
  t=np.arange(int(.07*sr))/sr;n=rng.normal(0,1,len(t));n=np.diff(n,prepend=0)
  add(at+shift,n*np.exp(-t*90)*.008,(-1)**beat)
 # restrained plucked notes, D minor colour
 if beat%2==0:
  freq=[146.83,174.61,220,196][(beat//4)%4];t=np.arange(int(.9*sr))/sr
  note=(np.sin(2*np.pi*freq*t)+.2*np.sin(2*np.pi*2*freq*t))*np.exp(-t*7)*np.minimum(t*80,1)*.055
  add(at,note,(-1)**beat*.5);add(at+.19,note*.17,-.5)
for at in [3,5.5,9,12.5,15,17.5,23,27.5]:
 t=np.arange(int(.2*sr))/sr;n=rng.normal(0,1,len(t));n=np.convolve(n,np.ones(25)/25,'same')
 env=np.sin(np.pi*np.arange(len(t))/len(t))**2
 add(max(0,at-.12),n*env*.12)
fade=np.minimum(np.arange(len(mix))/sr/.08,1)*np.minimum((len(mix)-1-np.arange(len(mix)))/sr/.65,1)
mix*=fade[:,None];mix=np.tanh(mix*1.8)*.75
p=Path('public/assets/color-editorial/editorial-original.wav')
with wave.open(str(p),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((mix*32767).astype('<i2').tobytes())
