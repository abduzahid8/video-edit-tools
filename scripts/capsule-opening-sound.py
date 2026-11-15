"""Replace only the opening Foley; retain the approved soundtrack after 2.8s."""
from pathlib import Path
import wave,numpy as np
from scipy.signal import butter,sosfilt
p=Path('public/assets/capsule-elegant')
with wave.open(str(p/'paper-motion.wav'),'rb') as w:
 sr=w.getframerate();mix=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').reshape(-1,2).astype(float)/32768
mix[:int(2.8*sr)]=0;rng=np.random.default_rng(260707)
def add(at,a,pan=0):
 i=int(at*sr);n=min(len(a),len(mix)-i);mix[i:i+n]+=a[:n,None]*np.array([1-pan*.3,1+pan*.3])
def shutter(at):
 t=np.arange(int(.085*sr))/sr;n=rng.normal(size=len(t));n=sosfilt(butter(2,[900,9000],fs=sr,btype='bandpass',output='sos'),n)
 add(at,n*np.exp(-t*90)*.13+np.sin(2*np.pi*145*t)*np.exp(-t*85)*.06)
def sweep(at,pan):
 t=np.arange(int(.32*sr))/sr;n=rng.normal(size=len(t));n=sosfilt(butter(2,[350,6500],fs=sr,btype='bandpass',output='sos'),n);add(at,n*np.sin(np.pi*t/.32)**2*.095,pan)
for at in [.005,.22,.44]:shutter(at)
for at,pan in [(.66,-.8),(.76,.8),(1.05,-.3),(1.21,.3)]:sweep(at,pan)
t=np.arange(int(.24*sr))/sr;add(1.34,np.sin(2*np.pi*(65*t+18*t*np.exp(-t*28)))*np.exp(-t*25)*np.minimum(1,t*180)*.16)
shutter(1.55)
with wave.open(str(p/'opening-motion.wav'),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(mix,-.98,.98)*32767).astype('<i2').tobytes())
