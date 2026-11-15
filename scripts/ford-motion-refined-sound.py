import wave,numpy as np
from scipy.signal import butter,sosfilt
sr=48000;mix=np.zeros((34*sr,2));r=np.random.default_rng(710)
old=[0,3.2,7.6,12,14.2,20,24.5,30,37,40]
new=[0,2.8,6.5,10.2,11.8,16.6,20.3,25,31.5,34]
def retime(at):return float(np.interp(at,old,new))
def add(at,a,pan=0):
 i=int(at*sr);n=min(len(a),len(mix)-i);mix[i:i+n]+=a[:n,None]*np.array([1-pan*.3,1+pan*.3])
def click(at):
 at=retime(at)
 t=np.arange(int(.08*sr))/sr;n=sosfilt(butter(2,[1200,9000],fs=sr,btype='bandpass',output='sos'),r.normal(size=len(t)));add(at,n*np.exp(-t*90)*.14)
def sweep(at,pan=0):
 at=retime(at)
 t=np.arange(int(.32*sr))/sr;n=sosfilt(butter(2,[400,5500],fs=sr,btype='bandpass',output='sos'),r.normal(size=len(t)));add(at,n*np.sin(np.pi*t/.32)**2*.075,pan)
for at in [0,1.25,3.2,3.65,4.65,7.6,8.25,9,12,14.2,15.85,17.45,20,24.5,26.1,27.7,32.4,34.6]:click(at)
for at,pan in [(0,0),(2.55,-1),(3.2,1),(7.05,-1),(7.6,1),(8.25,0),(12,0),(13.7,-1),(14.2,1),(20,0),(24.5,-1),(26.1,-1),(27.7,-1),(30,0),(37,0)]:sweep(at,pan)
t=np.arange(int(.15*sr))/sr;add(retime(34.6),np.sin(2*np.pi*1000*t)*np.exp(-t*30)*.035)
with wave.open('public/assets/ford-archive/motion-refined.wav','wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((np.clip(mix,-.95,.95)*32767).astype('<i2').tobytes())
