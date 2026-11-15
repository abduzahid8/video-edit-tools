"""Prepare the NEW Premium V2 assets; never sources fashion from the project archive.
Run from the project root. Uses curl, macOS Vision, Pillow, NumPy and SciPy.
See renders/aiwardrobe-premium-v2/Sources-and-rights.md for license scope.
"""
from pathlib import Path
import subprocess, concurrent.futures
from PIL import Image
import numpy as np
from scipy import ndimage

base=Path('public/assets/premium-v2'); dest=base/'selected';dest.mkdir(parents=True,exist_ok=True)
items=[('tailoring',10679218),('tailoring-detail',10679231),('knit',22134821),('evening',19933209)]
def fetch(v):
 name,ident=v
 subprocess.run(['curl','--max-time','60','--retry','2','-fLsS',f'https://images.pexels.com/photos/{ident}/pexels-photo-{ident}.jpeg?auto=compress&cs=tinysrgb&w=2400','-o',str(dest/f'{name}.jpg')],check=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:list(ex.map(fetch,items))
subprocess.run(['curl','--max-time','60','--retry','2','-fLsS','https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&w=2000&q=90','-o',str(dest/'dark-trousers.jpg')],check=True)
subprocess.run(['swift','scripts/editorial-masks.swift',*[str(dest/f'{n}.jpg') for n in ['tailoring','knit','evening']]],check=True)
for n in ['tailoring','knit','evening']:
 im=Image.open(dest/f'{n}.png').convert('RGBA');a=np.array(im.getchannel('A'));lab,_=ndimage.label(a>110)
 counts=np.bincount(lab.ravel());counts[0]=0;keep=ndimage.binary_dilation(lab==counts.argmax(),iterations=2);a[~keep]=0
 a=ndimage.grey_erosion(a,size=(3,3));im.putalpha(Image.fromarray(a));im=im.crop(im.getchannel('A').getbbox());im.thumbnail((1600,2400));im.save(dest/f'{n}-cutout.png')
rects=[('piece-knit','knit',(.35,.48,.67,.68)),('piece-blazer','tailoring-detail',(.11,.58,.53,.87)),('piece-white','knit',(.19,.66,.52,.92)),('piece-dark','dark-trousers',(.34,.53,.66,.83))]
for out,src,box in rects:
 im=Image.open(dest/f'{src}.jpg');w,h=im.size;im.crop(tuple(int(v*[w,h,w,h][i]) for i,v in enumerate(box))).save(dest/f'{out}.jpg',quality=96)
rng=np.random.default_rng(42);paper=np.clip(np.array([242,238,229])+rng.normal(0,1.5,(700,700,1)),0,255).astype('uint8');Image.fromarray(paper).save(base/'paper.jpg',quality=94)
print('Prepared newly sourced photography, derivative masks/crops and original paper.')
