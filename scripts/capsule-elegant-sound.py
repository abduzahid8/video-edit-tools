"""Original deterministic paper Foley. No song, speech or downloaded audio."""
import numpy as np,wave
from scipy.signal import butter,sosfilt
sr=48000;duration=33;rng=np.random.default_rng(2606);mix=np.zeros((int(sr*duration),2))
def add(at,a,pan=0):
 at=float(np.interp(at,[0,3.5,6,9.5,15,19.5,26,28.5,35.5,38.5],[0,2.8,4.8,7.6,12,15.8,21.5,23.5,30.5,33]));i=int(at*sr);n=min(len(a),len(mix)-i)
 if i>=0 and n>0:mix[i:i+n]+=a[:n,None]*np.array([1-pan*.3,1+pan*.3])
def paper(at,pan=0,strength=1):
 t=np.arange(int(.36*sr))/sr;n=rng.normal(size=len(t));n=sosfilt(butter(2,[500,7000],fs=sr,btype='bandpass',output='sos'),n)
 a=n*np.sin(np.pi*t/.36)**2*.08*strength;add(at,a,pan)
def tap(at,strength=1):
 t=np.arange(int(.075*sr))/sr;n=rng.normal(size=len(t));a=n*np.exp(-t*110)*.04*strength+np.sin(2*np.pi*120*t)*np.exp(-t*70)*.08*strength;add(at,a)
def land(at):
 t=np.arange(int(.22*sr))/sr;a=np.sin(2*np.pi*(60*t+20*t*np.exp(-t*30)))*np.exp(-t*28)*np.minimum(1,t*200)*.15;add(at,a)
for i,at in enumerate([0,.45,.8,3.15,3.8,5.7,6.1,6.25,6.4,7.1,7.25,7.4,9.2,9.75,10.1,10.45,10.8,11.15,11.5,14.55,15.1,15.4,17.25,19.4,21.3,23.45,26,26.2,28.5,30.9,33.1,35.5]):paper(at,(-1)**i*.7,.65 if 9.5<at<12 else 1)
for at in [.25,3.7,6.6,10.8,15.9,20.15,22.3,24.5,29,31.35,33.5,36.2,36.8]:tap(at)
for at in [.08,7.75,19.65,35.75]:land(at)
# Tiny paired tactile clicks establish an audio hook immediately.
tap(.03,1.25);tap(.16,.8)
mix=np.tanh(mix*1.6)*.86
mix[-int(.25*sr):]*=np.linspace(1,0,int(.25*sr))[:,None]
with wave.open('public/assets/capsule-elegant/paper-motion.wav','wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((mix*32767).astype('<i2').tobytes())
