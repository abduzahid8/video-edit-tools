"""Prepare real archival photographs and local person masks for the founder revision."""
from pathlib import Path
from PIL import Image,ImageFilter
import shutil,subprocess,json
root=Path(__file__).resolve().parents[1];p=root/'public/assets/founder-wardrobe';p.mkdir(exist_ok=True)
def crop(name,out,box):
 im=Image.open(p/name).convert('RGB');w,h=im.size
 im=im.crop(tuple(round(v*(w if i%2==0 else h)) for i,v in enumerate(box)))
 im.thumbnail((1800,1800));im.save(p/out,quality=95)
def copy(src,out):shutil.copyfile(root/src,p/out)
copy('public/assets/color-editorial/founders/jobs.jpg','jobs-secondary.jpg')
copy('public/assets/color-editorial/founders/jobs-full-isolated.png','jobs-cut.png')
copy('public/assets/color-editorial/founders/huang-stage.jpg','huang-secondary.jpg')
copy('public/assets/color-editorial/founders/huang-isolated.png','huang-cut.png')
copy('public/assets/founder-wardrobe/jobs-original.jpg','jobs-photo.jpg')
crop('zuckerberg-25140171161.jpg','zuckerberg-photo.jpg',(.34,.18,1,1))
crop('zuckerberg-24602698004.jpg','zuckerberg-back.jpg',(.2,.1,.7,1))
copy('public/assets/founder-wardrobe/huang-original.jpg','huang-photo.jpg')
subprocess.run(['swift',str(root/'scripts/editorial-masks.swift'),str(p/'zuckerberg-back.jpg')],check=True,cwd=root)
im=Image.open(p/'zuckerberg-back.png').convert('RGBA');a=im.getchannel('A').filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.4));im.putalpha(a);im.crop(a.point(lambda x:255 if x>12 else 0).getbbox()).save(p/'zuckerberg-cut.png')
for name in ['jobs','huang']:
 im=Image.open(p/f'{name}-cut.png').convert('RGBA');a=im.getchannel('A');box=a.point(lambda x:255 if x>15 else 0).getbbox();im.crop(box).save(p/f'{name}-cut.png')
# Detail crops contain only the photographed clothing, without invented garments.
im=Image.open(p/'jobs-original.jpg');w,h=im.size;im.crop((int(w*.39),int(h*.38),int(w*.78),int(h*.8))).save(p/'jobs-detail.jpg',quality=95)
im=Image.open(p/'zuckerberg-back.jpg');w,h=im.size;im.crop((int(w*.23),int(h*.38),int(w*.75),int(h*.78))).save(p/'zuckerberg-detail.jpg',quality=95)
im=Image.open(p/'huang-original.jpg');w,h=im.size;im.crop((int(w*.42),int(h*.36),int(w*.95),int(h*.84))).save(p/'huang-detail.jpg',quality=95)
print('Prepared real founder photography and detail crops.')
