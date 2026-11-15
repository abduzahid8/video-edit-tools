from PIL import Image,ImageFilter
from pathlib import Path
import cv2,numpy as np
p=Path('public/assets/ford-story')
specs={
'ford-seated':('public/assets/ford-story/cfda.jpg',[(0,305),(28,270),(52,220),(66,185),(111,171),(157,150),(172,142),(170,114),(166,88),(172,54),(185,28),(210,18),(236,21),(258,37),(273,64),(269,97),(261,123),(255,149),(279,170),(310,186),(321,214),(342,251),(377,283),(400,304),(400,524),(0,524)]),
'ford-close':('public/assets/tom-ford/venice.jpg',[(0,326),(61,301),(85,270),(104,260),(112,221),(114,190),(109,165),(113,126),(118,86),(138,51),(172,30),(211,15),(258,13),(298,28),(325,56),(340,93),(338,134),(330,179),(317,223),(308,264),(290,306),(266,332),(276,354),(306,387),(320,425),(323,477),(333,532),(332,600),(0,600)]),
'ford-tux':('public/assets/tom-ford/portrait.jpg',[(152,4),(176,8),(191,21),(193,50),(190,70),(184,82),(199,92),(213,104),(210,121),(201,165),(201,205),(201,254),(200,299),(198,340),(195,390),(193,430),(189,474),(185,527),(185,551),(197,567),(205,589),(195,597),(177,596),(170,583),(156,594),(136,591),(133,577),(132,552),(132,520),(127,475),(126,425),(126,378),(128,347),(121,339),(110,345),(96,345),(82,334),(79,318),(65,318),(64,288),(61,244),(61,202),(62,158),(74,116),(89,105),(125,89),(140,79),(141,62),(139,48),(141,22)])}
for name,(f,pts) in specs.items():
 im=Image.open(f).convert('RGB');im.thumbnail((1400,2100));a=np.array(im);h,w=a.shape[:2];poly=(np.array(pts)*w/400).astype('int32');rough=np.zeros((h,w),np.uint8);cv2.fillPoly(rough,[poly],255)
 mask=np.zeros((h,w),np.uint8);outer=cv2.dilate(rough,np.ones((13,13),np.uint8));inner=cv2.erode(rough,np.ones((55,55),np.uint8));mask[outer>0]=2;mask[rough>0]=3;mask[inner>0]=1
 if name=='ford-tux':
  yy=np.arange(h)[:,None];mask[(rough>0)&(yy<85*w/400)]=1
 cv2.grabCut(a,mask,None,np.zeros((1,65)),np.zeros((1,65)),4,cv2.GC_INIT_WITH_MASK)
 valid=((mask==1)|(mask==3))&(rough>0)
 if name=='ford-tux':
  rgb=a.astype(float);green=(rgb[:,:,1]-rgb[:,:,0]>20)&(rgb[:,:,1]-rgb[:,:,2]>15)&(rgb[:,:,1]>60);red=(rgb[:,:,0]-rgb[:,:,1]>20)&(rgb[:,:,0]-rgb[:,:,2]>20)&(np.arange(h)[:,None]>350*w/400);valid &= ~(green|red)
 alpha=Image.fromarray(np.where(valid,255,0).astype('uint8')).filter(ImageFilter.GaussianBlur(.5));out=im.convert('RGBA');out.putalpha(alpha);out=out.crop(alpha.getbbox());out.save(p/(name+'.png'));print(name,out.size)
