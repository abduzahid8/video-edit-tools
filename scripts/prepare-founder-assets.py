"""Clean local foreground masks and make real photographic detail crops."""
from pathlib import Path
import cv2
import numpy as np
p=Path(__file__).resolve().parents[1]/'public/assets/color-editorial/founders'
for n in ['jobs','jobs-full','durov','huang','huang-stage']:
 im=cv2.imread(str(p/f'{n}.png'),-1)
 if im is None: continue
 mask=(im[:,:,3]>170).astype('uint8')
 count,labels,stats,_=cv2.connectedComponentsWithStats(mask)
 mask=(labels==(1+np.argmax(stats[1:,4]))).astype('uint8')*255
 mask=cv2.morphologyEx(mask,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
 im[:,:,3]=cv2.GaussianBlur(mask,(3,3),.6)
 yy,xx=np.where(mask>10)
 out=im[max(0,yy.min()-2):yy.max()+3,max(0,xx.min()-2):xx.max()+3]
 if n == 'jobs-full':
        blue,green,red=cv2.split(out[:,:,:3])
        spill=(red.astype(float)>green*1.6)&(red.astype(float)>blue*1.6)&(red>70)
        out[spill,3]=0
    cv2.imwrite(str(p/f'{n}-isolated.png'),out)
 print(n, out.shape)
# Detail crops contain only pixels from the actual photograph.
im=cv2.imread(str(p/'huang-stage.jpg'));h,w=im.shape[:2]
cv2.imwrite(str(p/'leather-detail.jpg'),im[int(h*.40):int(h*.98),int(w*.18):int(w*.69)])
im=cv2.imread(str(p/'jobs-full.jpg'));h,w=im.shape[:2]
cv2.imwrite(str(p/'denim-detail.jpg'),im[int(h*.46):int(h*.88),int(w*.22):int(w*.76)])
im=cv2.imread(str(p/'durov.jpg'));h,w=im.shape[:2]
cv2.imwrite(str(p/'layer-detail.jpg'),im[int(h*.44):int(h*.92),int(w*.25):int(w*.92)])

from PIL import Image
Image.open(p/'jobs-isolated.png').crop((0,0,940,1054)).save(p/'jobs-portrait-isolated.png')
im=Image.open(p/'huang.jpg');w,h=im.size
im.crop((int(w*.42),int(h*.36),int(w*.95),int(h*.86))).save(p/'leather-detail.jpg')
