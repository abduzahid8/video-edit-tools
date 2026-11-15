from pathlib import Path
import wave,numpy as np
from scipy.signal import butter,sosfilt
sr=48000;mix=np.zeros((32*sr,2));rng=np.random.default_rng(705)
def add(at,a,pan=0):
 i=int(at*sr);n=min(len(a),len(mix)-i);mix[i:i+n]+=a[:n,None]*np.array([1-pan*.3,1+pan*.3])
def click(at):
 t=np.arange(int(.1*sr))/sr;n=sosfilt(butter(2,[1100,8500],fs=sr,btype='bandpass',output='sos'),rng.normal(size=len(t)))
 add(at,n*np.exp(-t*85)*.2+np.sin(2*np.pi*125*t)*np.exp(-t*70)*.08)
def sweep(at,pan=0):
 t=np.arange(int(.28*sr))/sr;n=sosfilt(butter(2,[400,7000],fs=sr,btype='bandpass',output='sos'),rng.normal(size=len(t)))
 add(at,n*np.sin(np.pi*t/.28)**2*.09,pan)
def impact(at):
 t=np.arange(int(.28*sr))/sr;add(at,np.sin(2*np.pi*(70*t+3*t*np.exp(-t*30)))*np.exp(-t*20)*np.minimum(t*250,1)*.22)
for at in [0,.2,.4,1.25,5.6,9.8,14,15.1,16.4,18.2,19.55,20.9,24.9,27.1]:click(at)
for at,pan in [(.6,-1),(.7,1),(1.3,0),(3.2,0),(6.05,-.5),(10,1),(11,0),(15.1,-1),(16.4,1),(22.5,0),(29.5,0)]:sweep(at,pan)
for at in [0,3.2,22.5,29.5]:impact(at)
t=np.arange(int(.2*sr))/sr;add(27.1,np.sin(2*np.pi*1100*t)*np.exp(-t*25)*.04)
with wave.open('public/assets/tom-ford/motion.wav','wb') as w:
 w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(mix,-.95,.95)*32767).astype('<i2').tobytes())
