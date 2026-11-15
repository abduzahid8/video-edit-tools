"""Prepare real photographic opening crops; local segmentation only."""
from pathlib import Path
from PIL import Image
import requests,json,subprocess
p=Path('public/assets/heritage-jackets')
items=json.loads(Path('renders/research/heritage-jackets/candidates.json').read_text())
u=next(x['url'] for x in items if x['name']=='barbour-0')
r=requests.get(u,timeout=40);r.raise_for_status();(p/'barbour-portrait.jpg').write_bytes(r.content)
subprocess.run(['swift','scripts/editorial-masks.swift',str(p/'barbour-portrait.jpg')],check=True)
for n in ['barbour-portrait','valstar-detail']:
 im=Image.open(p/f'{n}.png').convert('RGBA');im=im.crop(im.getchannel('A').getbbox());im.save(p/f'{n}-hero.png');print(n,im.size)
f=p/'sources.json';a=json.loads(f.read_text())
if not any(x['file']=='barbour-portrait.jpg' for x in a):a.append({'file':'barbour-portrait.jpg','url':u,'page':'https://www.barbour.com/us/mens/mens-jackets/mens-waxed-jackets','kind':'real male model photograph; opening crop and person mask'})
f.write_text(json.dumps(a,indent=2))
