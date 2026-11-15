"""Real sourced archive photographs only. No synthesized visual assets."""
from pathlib import Path
import csv,json,shutil,subprocess,urllib.request
from PIL import Image
root=Path(__file__).resolve().parents[1]
out=root/'public/assets/style-psychology';out.mkdir(exist_ok=True)
rows={r['id']:r for r in csv.DictReader(open('/Users/v.zahid/Downloads/teaste_research/sources.csv'))}
selected={'003':'pinstripe','004':'linen','007':'tweed','010':'standing','068':'coast','071':'steps','126':'portrait','077':'navy'}
manifest=[]
for id,name in selected.items():
 r=rows[id]; cached=next((root/'teaste/90s_archive').glob(id+'-*'))
 shutil.copy2(cached,out/f'{name}.jpg')
 manifest.append(dict(file=f'{name}.jpg',title=r['title'],image_url=r['image_url'],source_url=r['source_url'],origin=str(cached),kind='real male archive photograph, supplied internet-sourced collection'))
 print(name,Image.open(out/f'{name}.jpg').size,flush=True)
(out/'sources.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False))
subprocess.run(['swift',str(root/'scripts/editorial-masks.swift'),*[str(out/f'{n}.jpg') for n in ['pinstripe','linen','standing','coast','portrait']]],check=True)
for name in ['pinstripe','linen','standing','coast','portrait']:
 im=Image.open(out/f'{name}.png').convert('RGBA');box=im.getchannel('A').getbbox();im=im.crop(box);im.save(out/f'{name}-cut.png')
print('Photographic cutouts prepared; original pixels preserved.',flush=True)
