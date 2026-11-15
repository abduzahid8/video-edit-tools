"""Original short Foley cues aligned to the editorial v3 cut. No voice or song."""
import numpy as np,wave
sr=48000;duration=30;rng=np.random.default_rng(3415);mix=np.zeros((int(sr*duration),2))
def add(at,a,pan=0):
 at=float(np.interp(at,[0,3,9.5,16,22.5,26,30.5,34.5],[0,2.4,7.1,11.8,16.5,18,27,30]));i=int(at*sr);n=min(len(a),len(mix)-i)
 if n>0:mix[i:i+n]+=a[:n,None]*np.array([1-pan*.3,1+pan*.3])[None,:]
def swipe(at,pan=0):
 t=np.arange(int(sr*.3))/sr;a=rng.normal(size=len(t));a=np.convolve(a,np.ones(15)/15,'same')*np.sin(np.pi*t/.3)**2*.14;add(at,a,pan)
def click(at):
 t=np.arange(int(sr*.065))/sr;add(at,np.diff(rng.normal(size=len(t)),prepend=0)*np.exp(-t*95)*.026)
def land(at):
 t=np.arange(int(sr*.18))/sr;add(at,np.sin(2*np.pi*(65*t+15*t*np.exp(-t*25)))*np.exp(-t*32)*np.minimum(1,t*160)*.12)
for i,x in enumerate([.08,.26,.44,1.75,3,5.15,7,8.15,9.5,11,12.1,13.7,14.6,16,17.1,18.5,20.85,22.5,24.1,26,30.5]):swipe(x,(-1)**i*.6)
for x in [.8,3.7,10.4,16.7,26.6,31.2]:land(x)
for x in [2.25,5.9,6.5,7.1,7.25,7.4,12.4,13.9,19.1,19.8,20,20.2,23.1,23.4,24,31.1,31.8]:click(x)
click(27.5);click(29.5);swipe(29.8);land(28.5)
mix=np.tanh(mix*1.4)*.8
with wave.open('public/assets/boots-selection-v2/editorial-motion-short-flow.wav','wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((mix*32767).astype('<i2').tobytes())
