"""Deterministic edge cleanup of masks made from real photographs."""
from pathlib import Path
import cv2,numpy as np
p=Path(__file__).resolve().parents[1]/'public/assets/color-editorial/founders/elegant'
for name in ['jobs','durov','huang-portrait']:
 im=cv2.imread(str(p/f'{name}-isolated.png'),-1);h,w=im.shape[:2];a=im[:,:,3]
 if name=='jobs':
  blue,g,r=cv2.split(im[:,:,:3]);dist=cv2.distanceTransform((a>100).astype('uint8'),cv2.DIST_L2,5)
  red=(r.astype(float)>g*1.8)&(r.astype(float)>blue*1.4)&(r>80)&(dist<45)
  a[red]=0
 if name=='durov':
  yy,xx=np.indices((h,w));bright=np.max(im[:,:,:3],axis=2)
  a[((xx>230)&(yy>250)&(bright>80))|((xx>250)&(yy>180)&(bright>65))|((xx<60)&(yy<200))]=0
 if name=='huang-portrait':
  allowed=np.zeros_like(a);cv2.fillPoly(allowed,[np.array([(0,0),(410,0),(460,80),(450,160),(450,300),(485,350),(600,420),(w,h),(0,h)])],255)
  a=cv2.bitwise_and(a,allowed)
 count,labels,stats,_=cv2.connectedComponentsWithStats((a>100).astype('uint8'));mask=(labels==(1+np.argmax(stats[1:,4]))).astype('uint8')*255
 mask=cv2.morphologyEx(mask,cv2.MORPH_OPEN,np.ones((3,3),np.uint8));im[:,:,3]=cv2.GaussianBlur(mask,(3,3),.6)
 cv2.imwrite(str(p/f'{name}-clean.png'),im)
