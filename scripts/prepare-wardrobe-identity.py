"""Derive clean photographic assets from the user-supplied wardrobe reference.
No generated images: still crops use only original source pixels, before its burned captions.
"""
from pathlib import Path
import subprocess,json
p=Path('public/assets/wardrobe-identity');p.mkdir(exist_ok=True)
source=p/'source.mp4'
shots={'portrait':25,'side':5.6,'stage':7.5,'interview':9.7,'jet':21.8,'shopping':23.6,'closet':38.5,'closet-front':39.8,'signature':45.1,'decision':59.6}
for name,time in shots.items():
 subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-ss',str(time),'-i',str(source),'-vf','crop=720:800:0:0','-frames:v','1',str(p/(name+'.jpg'))],check=True)
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(source),'-vf','crop=720:800:0:0','-an','-c:v','libx264','-crf','18','-preset','fast',str(p/'clean-footage.mp4')],check=True)
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(source),'-vn','-c:a','pcm_s16le',str(p/'original-audio.wav')],check=True)
(p/'sources.json').write_text(json.dumps({'source':'/Users/v.zahid/Downloads/theme_about_wardrobe.mp4','stillsSeconds':shots,'crop':'720:800:0:0; removes burned captions below y=800','audio':'Original source narration and embedded sound, unchanged timing'},indent=2))
# Local foreground masks use the existing project's Apple Vision helper.
subprocess.run(['swift','scripts/editorial-masks.swift',*[str(p/(name+'.jpg')) for name in ['portrait','stage','signature','side']]],check=True)
from PIL import Image,ImageFilter
for name in ['portrait','stage','signature','side']:
 im=Image.open(p/(name+'.png')).convert('RGBA')
 alpha=im.getchannel('A').filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(.45))
 im.putalpha(alpha)
 box=alpha.point(lambda value:255 if value>12 else 0).getbbox()
 im.crop(box).save(p/(name+'.png'))
metadata=json.loads((p/'sources.json').read_text())
metadata['masks']='Local Apple Vision person segmentation; alpha eroded 3px, softened 0.45px and trimmed'
(p/'sources.json').write_text(json.dumps(metadata,indent=2))
