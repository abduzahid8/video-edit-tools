"""Prepare supplied internet archive photos and brief non-musical hook effects."""
from pathlib import Path
import csv, json, shutil, subprocess, wave, math, random
from array import array
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/assets/creating-wardrobe'
DELIVERY=ROOT/'renders/creating-wardrobe'
OUT.mkdir(parents=True,exist_ok=True)
rows={r['id']:r for r in csv.DictReader(open('/Users/v.zahid/Downloads/teaste_research/sources.csv'))}
selected={
 '068':'coast','126':'portrait','004':'linen','073':'shirt',
 '008':'trousers','071':'knit','003':'jacket','010':'foundation',
 '011':'walk','074':'fit','077':'navy','125':'cream',
 '006':'tweed','007':'signature','002':'trench','205':'leather',
 '076':'evening','204':'tailoring','203':'duo',
}
cuts={'coast','portrait','linen','trousers','jacket','foundation','walk','trench','leather','evening'}
manifest=[]
for id,name in selected.items():
 src=next((ROOT/'teaste/90s_archive').glob(id+'-*'))
 im=Image.open(src).convert('RGB')
 im.thumbnail((1800,2400))
 im.save(OUT/f'{name}.jpg',quality=94)
 r=rows[id]
 manifest.append(dict(id=id,name=name,file=f'{name}.jpg',title=r['title'],
  source_url=r['source_url'],image_url=r['image_url'],origin=str(src),
  note='Supplied internet-sourced archive photo; source title is inherited, not independently authenticated. Original photograph pixels, no image generation.'))
subprocess.run(['swift',str(ROOT/'scripts/editorial-masks.swift'),*[str(OUT/f'{n}.jpg') for n in sorted(cuts)]],check=True)
for name in cuts:
 im=Image.open(OUT/f'{name}.png').convert('RGBA')
 box=im.getchannel('A').getbbox()
 if box: im=im.crop(box)
 im.thumbnail((1400,2000))
 im.save(OUT/f'{name}-cut.png')
 (OUT/f'{name}.png').unlink()
(OUT/'sources.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False))
shutil.copy2(OUT/'sources.json',DELIVERY/'Photo-sources.json')
(DELIVERY/'Photo-sources.md').write_text('# Photo provenance\n\nAll photos come from the user-supplied, internet-sourced `teaste/90s_archive` collection. No generative imagery. Source captions are inherited archive labels, not authenticated dates or photographer credits.\n\n'+ '\n'.join(f'- **{m["name"]}** — [{m["title"]}]({m["source_url"]}) · [original image]({m["image_url"]})' for m in manifest)+'\n')
# Short broadband air/shutter transients only. No tonal notes or music bed.
sr=48000; duration=48; audio=array('f',[0])*int(sr*duration); rng=random.Random(20261115)
for at,length,amp in [(0,.30,.20),(.12,.055,.10),(7.2,.07,.045),(33.6,.17,.08)]:
 low=0
 for j in range(int(length*sr)):
  low=.68*low+.32*rng.uniform(-1,1)
  env=math.sin(math.pi*j/(length*sr))**2
  audio[int(at*sr)+j]+=low*env*amp
with wave.open(str(OUT/'hooks.wav'),'wb') as w:
 w.setnchannels(1); w.setsampwidth(2);w.setframerate(sr)
 w.writeframes(array('h',[int(max(-1,min(1,a))*32767) for a in audio]).tobytes())
print('Prepared',len(manifest),'real photographs and',len(cuts),'non-generative photo cutouts.')
