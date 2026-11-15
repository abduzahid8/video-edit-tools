from pathlib import Path
from PIL import Image,ImageFilter
import cv2,numpy as np
p=Path('public/assets/boots-selection-v2')
for n in ['chelsea','wyatt','viberg']:
 im=Image.open(p/(n+'.jpg')).convert('RGB');a=np.array(im);g=cv2.cvtColor(a,cv2.COLOR_RGB2GRAY);sat=a.max(2).astype(int)-a.min(2).astype(int)
 m=np.where((g<145)|(sat>35),255,0).astype('uint8')
 num,l,st,_=cv2.connectedComponentsWithStats(m);k=1+st[1:,cv2.CC_STAT_AREA].argmax();m=np.where(l==k,255,0).astype('uint8');cs,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE);cv2.drawContours(m,cs,-1,255,-1)
 m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((3,3),np.uint8));alpha=Image.fromarray(m).filter(ImageFilter.GaussianBlur(.45));bbox=alpha.getbbox();out=im.convert('RGBA');out.putalpha(alpha);out=out.crop(bbox);canvas=Image.new('RGBA',(out.width+24,out.height+24));canvas.alpha_composite(out,(12,12));canvas.save(p/(n+'-cut.png'))
 x0,y0,x1,y1=bbox;w=x1-x0;h=y1-y0
 boxes={'surface':(x0+.18*w,y0+.15*h,x0+.8*w,y0+.7*h),'heel':(x0,y0+.58*h,x0+.4*w,y1),'toe':(x0+.55*w,y0+.55*h,x1,y1)}
 for label,box in boxes.items():im.crop(tuple(map(int,box))).save(p/(n+'-'+label+'.jpg'),quality=95)
 print(n,im.size,bbox)
