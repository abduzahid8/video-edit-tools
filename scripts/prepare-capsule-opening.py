from PIL import Image
from pathlib import Path
p=Path('public/assets/capsule-elegant')
for name,path,fraction in [
 ('hook-grey',p/'grey-3-cut.png',.60),
 ('hook-navy',p/'navy-0-cut.png',1),
 ('hook-tailored',Path('public/assets/smart-casual-shopping/suit-pattern-cut.png'),1)]:
 im=Image.open(path).convert('RGBA');im=im.crop((0,0,im.width,int(im.height*fraction)))
 h=1200;w=round(im.width*h/im.height);im=im.resize((w,h),Image.Resampling.LANCZOS)
 out=Image.new('RGBA',(760,1264));out.alpha_composite(im,((760-w)//2,64));out.save(p/(name+'.png'))
 # Flatten the real photographed cutout onto a white editorial mat.
 # Identical geometry makes the mat-to-cutout reveal register exactly.
 rgb=Image.new('RGB',(760,1264),'white');rgb.paste(im,((760-w)//2,64),im.getchannel('A'));rgb.save(p/(name+'.jpg'),quality=96)
