"""Original deterministic felt-key score and paper cues, no downloaded audio."""
import numpy as np,wave
from scipy.signal import butter,sosfilt
from pathlib import Path
sr=48000;duration=40;rng=np.random.default_rng(1176);mix=np.zeros((sr*duration,2))
def add(at,a,pan=0):
 i=int(at*sr);n=min(len(a),len(mix)-i)
 if n>0:mix[i:i+n]+=a[:n,None]*np.array([1-pan*.25,1+pan*.25])
def key(at,f,amp=.1):
 t=np.arange(int(sr*2.8))/sr
 a=(np.sin(2*np.pi*f*t)+.22*np.sin(4*np.pi*f*t)+.07*np.sin(6*np.pi*f*t))*np.minimum(t/.008,1)*np.exp(-t/1.0)*amp
 add(at,a,(-1 if int(at*2)%2 else 1)*.5)
 add(at+.21,a*.15,.4)
# Sparse minor-ninth harmony, low and unobtrusive under speech.
chords=[[146.83,220,261.63,329.63],[130.81,196,246.94,293.66],[110,164.81,220,261.63],[130.81,196,246.94,293.66]]
for i,at in enumerate(np.arange(.25,39,1.5)):
 c=chords[(i//4)%4];key(float(at),c[i%4],.075);key(float(at)+.08,c[0]/2,.045)
for at in [4.5,8.5,12.5,16.5,20.5,24.5,29,32.5,36.5]:
 t=np.arange(int(sr*.32))/sr;n=sosfilt(butter(2,[900,6000],fs=sr,btype='bandpass',output='sos'),rng.normal(size=len(t)))
 add(at,n*np.sin(np.pi*t/.32)**2*.035)
for f in [146.83,220,261.63,329.63]:key(36.6,f,.045)
t=np.arange(len(mix))/sr;mix*=np.minimum(t/.4,1)[:,None]*np.clip((40-t)/1.3,0,1)[:,None]
mix=np.tanh(mix)*.75
p=Path('public/assets/heritage-jackets/score.wav')
with wave.open(str(p),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((mix*32767).astype('<i2').tobytes())
print(p)
