"""Deterministic studio-background removal. Original photographed pixels only."""
from pathlib import Path
from PIL import Image,ImageFilter
import numpy as np,cv2
p=Path('public/assets/capsule-editorial')
for name in ['jacket-1']:
 im=Image.open(p/(name+'.jpg')).convert('RGB'); im.thumbnail((1000,1400));a=np.array(im);h,w=a.shape[:2]
 mask=np.full((h,w),cv2.GC_PR_BGD,np.uint8)
 # Border colour candidates define the studio backdrop; GrabCut refines edges.
 bg=np.median(np.concatenate([a[:15].reshape(-1,3),a[:,:15].reshape(-1,3),a[:,-15:].reshape(-1,3)]),axis=0)
 d=np.linalg.norm(a.astype(float)-bg,axis=2)
 mask[d>35]=cv2.GC_PR_FGD;mask[d>85]=cv2.GC_FGD
 mask[:8]=0;mask[:,:8]=0;mask[:,-8:]=0
 cv2.grabCut(a,mask,None,np.zeros((1,65)),np.zeros((1,65)),3,cv2.GC_INIT_WITH_MASK)
 alpha=np.where((mask==1)|(mask==3),255,0).astype('uint8')
 n,l,st,_=cv2.connectedComponentsWithStats(alpha);k=1+st[1:,cv2.CC_STAT_AREA].argmax();alpha=np.where(l==k,255,0).astype('uint8')
 cs,_=cv2.findContours(alpha,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE);cv2.drawContours(alpha,cs,-1,255,-1)
 alpha=Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(.5));out=im.convert('RGBA');out.putalpha(alpha);out=out.crop(alpha.getbbox());out.save(p/(name+'-cut.png'));print(name,out.size)
# Reuse an original, deterministic texture from the same project; neutralise its warmth.
a=np.array(Image.open('public/assets/knives-out/paper-grain.jpg').convert('RGB')).astype(float)
a += np.array([-7,-2,6]);Image.fromarray(np.clip(a,0,255).astype('uint8')).save(p/'paper.jpg',quality=94)
from PIL import Image,ImageFilter
import cv2,numpy as np
from pathlib import Path
p=Path('public/assets/capsule-editorial')
polys={
'cream-1':[(779,51),(837,65),(871,111),(883,162),(873,203),(853,244),(844,295),(850,327),(900,353),(962,398),(984,455),(998,525),(991,606),(1007,659),(997,733),(975,815),(962,843),(941,909),(936,979),(922,1026),(883,1056),(865,1135),(831,1270),(798,1403),(768,1505),(753,1585),(775,1621),(794,1674),(784,1701),(746,1713),(695,1700),(665,1673),(661,1647),(678,1605),(679,1550),(696,1501),(707,1393),(717,1285),(716,1160),(716,1015),(691,1119),(663,1271),(637,1390),(608,1514),(606,1617),(598,1675),(569,1702),(488,1718),(438,1704),(435,1684),(474,1648),(491,1599),(491,1547),(505,1485),(511,1360),(513,1245),(522,1100),(533,978),(534,852),(510,806),(490,756),(473,720),(461,676),(454,627),(455,584),(469,544),(484,473),(507,400),(544,355),(595,332),(659,317),(705,304),(708,262),(700,230),(690,188),(687,145),(705,99),(744,66)],
'zip-1':[(667,55),(713,65),(746,93),(758,137),(752,172),(740,205),(723,250),(713,283),(748,312),(813,343),(848,369),(869,412),(881,450),(910,487),(907,535),(891,599),(877,663),(861,710),(847,740),(839,790),(825,821),(824,904),(829,1020),(838,1149),(844,1273),(849,1433),(860,1514),(866,1580),(890,1626),(930,1659),(933,1680),(910,1695),(846,1699),(797,1680),(765,1651),(754,1614),(749,1587),(728,1493),(716,1378),(704,1244),(687,1114),(679,1011),(678,950),(667,1078),(657,1228),(659,1379),(679,1489),(687,1586),(682,1616),(664,1654),(611,1680),(560,1687),(537,1678),(541,1653),(566,1619),(588,1585),(588,1519),(574,1395),(558,1253),(539,1118),(528,1018),(515,1038),(491,1010),(473,960),(463,922),(453,869),(442,817),(438,766),(442,722),(431,673),(438,595),(440,536),(451,459),(473,388),(513,352),(556,328),(583,312),(588,284),(579,250),(574,208),(570,160),(579,112),(611,74)]}
for name,points in polys.items():
 im=Image.open(p/(name+'.jpg')).convert('RGB');im.thumbnail((1000,1400));a=np.array(im);h,w=a.shape[:2];poly=np.array(points,dtype=float);poly*=w/1400;poly=poly.astype('int32')
 rough=np.zeros((h,w),np.uint8);cv2.fillPoly(rough,[poly],255)
 inner=cv2.erode(rough,np.ones((13,13),np.uint8));outer=cv2.dilate(rough,np.ones((19,19),np.uint8))
 mask=np.zeros((h,w),np.uint8);mask[outer>0]=2;mask[rough>0]=3;mask[inner>0]=1
 cv2.grabCut(a,mask,None,np.zeros((1,65)),np.zeros((1,65)),3,cv2.GC_INIT_WITH_MASK)
 alpha=Image.fromarray(np.where((mask==1)|(mask==3),255,0).astype('uint8')).filter(ImageFilter.GaussianBlur(.5))
 out=im.convert('RGBA');out.putalpha(alpha);out=out.crop(alpha.getbbox());out.save(p/(name+'-cut.png'));print(name,out.size)
