"""Original 32s editorial score. No downloaded recordings or samples.
A new composition synthesized locally; delivered under CC0-1.0.
"""
import numpy as np, wave
from pathlib import Path
SR=48000; duration=32; out=np.zeros((SR*duration,2),dtype=np.float64)
rng=np.random.default_rng(4216)
def note(start, midi, length, amp, pan=0):
 n=int(length*SR);t=np.arange(n)/SR;hz=440*2**((midi-69)/12)
 # Warm struck-string/piano hybrid: inharmonic overtones, soft hammer transient.
 env=(1-np.exp(-t*130))*np.exp(-t/(length*.27))
 sig=sum((1/(k*k))*np.sin(2*np.pi*hz*k*(1+.00012*k*k)*t)*np.exp(-t*k*.28) for k in range(1,7))
 sig=amp*env*sig
 i=int(start*SR)
 for delay,gain in [(0,1),(.21,.18),(.43,.11),(.79,.065)]:
  a=i+int(delay*SR);b=min(len(out),a+n)
  if b>a:
   out[a:b,0]+=sig[:b-a]*gain*np.sqrt((1-pan)/2)
   out[a:b,1]+=sig[:b-a]*gain*np.sqrt((1+pan)/2)
# D minor / Bb maj9 / F maj9 / C(add9); restrained 90bpm chamber pulse.
chords=[[50,57,62,65,69],[46,53,58,62,65],[41,53,57,60,64],[48,55,60,62,67]]
for bar in range(12):
 start=bar*8/3
 chord=chords[bar%4]
 note(start,chord[0]-12,2.6,.18,-.1)
 for j in range(8):
  note(start+j/3,chord[1+j%4],1.25,.055 if j%2 else .075,(j%3-1)*.35)
 for j in range(4):
  st=start+j*2/3;n=int(.18*SR);t=np.arange(n)/SR
  sig=.045*np.sin(2*np.pi*(48*t+35*(1-np.exp(-t*28))/28))*np.exp(-t*28)
  i=int(st*SR);out[i:i+n]+=sig[:,None]
# Soft original paper/brushed-percussion accents at authored edits.
for st in [0,.6,1.2,3,5.5,8,12,16,20,23,26,28.4]:
 n=int(.32*SR);t=np.arange(n)/SR
 z=rng.normal(0,1,n);z=np.convolve(z,np.ones(14)/14,mode='same')
 z*=.07*np.sin(np.pi*t/.32)**2*np.exp(-t*8)
 i=int(st*SR);out[i:i+n]+=z[:,None]*[.8,1]
# Resolve before the final hold.
for m in [38,50,57,62,65]:note(29.35,m,2.65,.09)
fade=np.minimum(np.arange(len(out))/2400,1)*np.minimum((len(out)-np.arange(len(out)))/(SR*1.1),1)
out*=fade[:,None];out=np.tanh(out*1.3)
out*=.83/max(np.max(abs(out)),.01)
p=Path('public/assets/premium-v2/score.wav')
with wave.open(str(p),'wb') as f:
 f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes((out*32767).astype('<i2').tobytes())
print(p)
