"""Refine supplied catalogue photos using deterministic OpenCV masks and real-pixel crops."""
from pathlib import Path
from PIL import Image,ImageFilter,ImageDraw
import cv2,numpy as np
p=Path('public/assets/boots-editorial');out=p/'refined'
for source,name in [('ronning-0.jpg','ronning'),('phix-0.jpg','phix'),('terra-0.png','terra'),('ronning-4.jpg','ronning-pair'),('phix-1.jpg','phix-pair')]:
 im=Image.open(p/source).convert('RGB');a=np.array(im);h,w=a.shape[:2];g=cv2.cvtColor(a,cv2.COLOR_RGB2GRAY)
 mask=np.full((h,w),cv2.GC_PR_BGD,np.uint8)
 mask[g<160]=cv2.GC_PR_FGD
 mask[g<65]=cv2.GC_FGD
 mask[:int(h*.1)]=cv2.GC_BGD;mask[-int(h*.04):]=cv2.GC_BGD
 mask[:,:int(w*.02)]=cv2.GC_BGD;mask[:,-int(w*.02):]=cv2.GC_BGD
 cv2.setRNGSeed(26)
 cv2.grabCut(a,mask,None,np.zeros((1,65)),np.zeros((1,65)),5,cv2.GC_INIT_WITH_MASK)
 m=np.where((mask==1)|(mask==3),255,0).astype('uint8')
 # Remove detached floor shadows and small background fragments.
 n,l,st,_=cv2.connectedComponentsWithStats(m)
 areas=st[1:,cv2.CC_STAT_AREA];keep=[i+1 for i,v in enumerate(areas) if v>areas.max()*.035]
 m=np.where(np.isin(l,keep),255,0).astype('uint8')
 # Very thin shadow regions are excluded without eroding leather highlights.
 m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
 # Restore enclosed leather highlights; preserve the open arch beneath each boot.
 contours,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
 cv2.drawContours(m,contours,-1,255,-1)
 # Source-coordinate boundaries exclude real studio-floor shadows under the sole.
 boundaries={
 'ronning':[(0,0),(620,0),(620,550),(567,557),(555,568),(520,580),(470,590),(400,595),(325,595),(275,589),(236,575),(210,566),(210,592),(50,592),(0,565)],
 'phix':[(0,0),(620,0),(620,640),(580,645),(550,659),(500,674),(420,688),(345,694),(310,691),(275,679),(235,654),(203,632),(176,615),(176,690),(78,690),(52,568),(0,568)],
 'phix-pair':[(0,0),(620,0),(620,625),(595,631),(550,645),(525,650),(525,657),(495,665),(430,674),(350,680),(272,680),(220,670),(187,656),(185,666),(85,665),(0,635)],
 }
 if name in boundaries:
  poly=np.array([(round(x*w/620),round(y*w/620)) for x,y in boundaries[name]],np.int32)
  bound=np.zeros_like(m);cv2.fillPoly(bound,[poly],255);m=cv2.bitwise_and(m,bound)
 if name=='phix':
  heel=np.array([(round(x*w/620),round(y*w/620)) for x,y in [(164,606),(176,612),(176,686),(163,686)]],np.int32);cv2.fillPoly(m,[heel],255)
 alpha=Image.fromarray(m).filter(ImageFilter.GaussianBlur(.5));o=im.convert('RGBA');o.putalpha(alpha);bbox=alpha.getbbox();o=o.crop(bbox)
 canvas=Image.new('RGBA',(o.width+32,o.height+32));canvas.alpha_composite(o,(16,16));canvas.save(out/(name+'.png'))
 print(name,bbox)
# Purpose-built crops preserve catalogue RGB and avoid repeated browser zooms.
for source,name,box in [
 ('ronning-5.jpg','zip',(260,220,1150,1250)),
 ('ronning-0.jpg','stitch',(250,650,1020,1300)),
 ('phix-0.jpg','heel',(75,1030,560,1390)),
 ('phix-0.jpg','toe',(600,1050,1180,1390)),
 ('terra-0.png','leather',(590,750,1300,1300)),
]:
 im=Image.open(p/source).convert('RGB');im.crop(box).save(out/(name+'.jpg'),quality=96)
