"""Original photo RGB with reviewed silhouette guides; no generated imagery."""
from pathlib import Path
from PIL import Image,ImageFilter
import numpy as np,cv2,shutil
p=Path('public/assets/capsule-elegant')
# Coordinates on a 400px-wide preview of each source photograph.
polys={
'cream-0':[(170,20),(207,11),(253,19),(278,47),(281,80),(270,116),(265,150),(273,166),(319,192),(345,221),(365,270),(376,327),(375,378),(369,422),(339,443),(305,462),(307,512),(300,600),(99,600),(101,552),(94,585),(80,578),(70,553),(73,525),(85,499),(94,454),(104,393),(112,334),(120,273),(125,237),(135,214),(164,200),(182,185),(186,174),(170,168),(166,148),(168,132),(158,103),(164,77),(164,47)],
'grey-3':[(177,18),(206,23),(223,37),(226,56),(217,79),(213,95),(231,105),(250,119),(263,142),(268,178),(266,212),(270,253),(267,286),(266,323),(253,332),(246,326),(245,365),(239,413),(234,470),(234,518),(247,535),(252,551),(246,561),(225,562),(203,556),(192,547),(190,530),(194,512),(194,477),(195,430),(193,393),(194,350),(190,320),(186,330),(179,388),(176,448),(170,501),(167,537),(170,549),(165,570),(147,581),(130,579),(125,572),(126,555),(136,535),(140,515),(138,479),(138,426),(135,371),(134,316),(132,310),(132,320),(124,317),(111,301),(119,286),(114,265),(112,229),(113,192),(118,151),(126,119),(146,104),(165,96),(169,84),(162,73),(168,57),(168,38)],
'navy-0':[(164,20),(191,14),(220,20),(236,36),(243,56),(240,83),(234,115),(235,135),(259,153),(290,166),(310,182),(321,211),(340,260),(352,305),(354,343),(346,361),(315,374),(303,384),(309,441),(311,480),(300,480),(296,536),(132,536),(130,494),(132,445),(141,393),(128,410),(117,438),(98,445),(86,435),(77,417),(79,403),(89,389),(99,351),(108,316),(112,283),(115,239),(120,204),(127,192),(152,178),(173,162),(174,145),(165,127),(159,103),(151,84),(150,56)]}
for n,pts in polys.items():
 im=Image.open(p/(n+'.jpg')).convert('RGB');im.thumbnail((1200,1800));a=np.array(im);h,w=a.shape[:2];poly=(np.array(pts)*w/400).astype('int32')
 rough=np.zeros((h,w),np.uint8);cv2.fillPoly(rough,[poly],255)
 inner=cv2.erode(rough,np.ones((45,45),np.uint8));outer=cv2.dilate(rough,np.ones((21,21),np.uint8))
 mask=np.zeros((h,w),np.uint8);mask[outer>0]=2;mask[rough>0]=3;mask[inner>0]=1
 cv2.grabCut(a,mask,None,np.zeros((1,65)),np.zeros((1,65)),3,cv2.GC_INIT_WITH_MASK)
 alpha=Image.fromarray(np.where((mask==1)|(mask==3),255,0).astype('uint8')).filter(ImageFilter.GaussianBlur(.55))
 out=im.convert('RGBA');out.putalpha(alpha);out=out.crop(alpha.getbbox());out.save(p/(n+'-cut.png'));print(n,out.size)
# Real wardrobe details, cropped from supplied official photography.
im=Image.open(p/'navy-2.jpg');im.crop((360,950,1160,2110)).save(p/'dark-trousers.jpg',quality=95)
im=Image.open('public/assets/smart-casual-shopping/pini-trousers.jpg');im.crop((0,0,im.width,int(im.height*.84))).save(p/'light-trousers.jpg',quality=95)
shutil.copyfile('public/assets/smart-casual-shopping/loafers-detail.jpg',p/'loafers.jpg')
shutil.copyfile('public/assets/capsule-editorial/paper.jpg',p/'paper.jpg')
