import wave,numpy as np
from scipy.signal import butter,sosfilt
sr=48000;mix=np.zeros((38*sr,2));r=np.random.default_rng(710)
def add(at,a,pan=0):
 i=int(at*sr);n=min(len(a),len(mix)-i);mix[i:i+n]+=a[:n,None]*np.array([1-pan*.3,1+pan*.3])
def click(at):
 t=np.arange(int(.08*sr))/sr;n=sosfilt(butter(2,[1200,9000],fs=sr,btype='bandpass',output='sos'),r.normal(size=len(t)));add(at,n*np.exp(-t*90)*.14)
def sweep(at,pan=0):
 t=np.arange(int(.32*sr))/sr;n=sosfilt(butter(2,[400,5500],fs=sr,btype='bandpass',output='sos'),r.normal(size=len(t)));add(at,n*np.sin(np.pi*t/.32)**2*.075,pan)
for at in [.0,.13,.26,3,3.18,3.32,7.25,7.65,8.05,11,12.3,15,17.3,17.6,20,24,24.13,24.26,30.4,32.6]:click(at)
for at,pan in [(0,0),(2.55,-1),(3,1),(4.3,-1),(5.8,-.5),(7,1),(11,0),(12.3,1),(15,0),(16.7,-1),(20,1),(24,0),(28,0),(35,0)]:sweep(at,pan)
t=np.arange(int(.15*sr))/sr;add(32.6,np.sin(2*np.pi*1000*t)*np.exp(-t*30)*.035)
with wave.open('public/assets/ford-story/paper-motion.wav','wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(mix,-.95,.95)*32767).astype('<i2').tobytes())
