"""Download only selected real male brand photographs; create local person masks."""
from pathlib import Path
import requests,json,subprocess
from PIL import Image
p=Path('public/assets/heritage-jackets');research=Path('renders/research/heritage-jackets')
all_items={x['name']:x for x in json.loads((research/'candidates.json').read_text())}
selected={'barbour':'barbour-1','barbour-detail':'barbour-4','valstar':'valstar-0','valstar-detail':'valstar-1','todd':'todd-archive','buck':'buck-0','buck-detail':'buck-2','rocky':'rocky-1','rocky-bw':'rocky-4'}
manifest=[]
for name,key in selected.items():
 row=all_items[key];u=row['url'];data=requests.get(u,timeout=50);data.raise_for_status();f=p/f'{name}.jpg';f.write_bytes(data.content)
 im=Image.open(f).convert('RGB');im.thumbnail((2400,2800));im.save(f,quality=95)
 manifest.append({'file':f.name,'url':u,'page':{'barbour':'https://www.barbour.com/us/mens/mens-jackets/mens-waxed-jackets','valstar':'https://valstarmilano.com/en-us/collections/valstarino','todd':'https://hypebeast.com/2025/2/todd-snyder-fw25-fall-winter-collection-new-york-fashion-week','buck':'https://www.buckmason.com/blogs/journal/leather-suede-outerwear-guide','rocky':'https://www.buckmason.com/blogs/journal/rocky-mountain-featherbed-x-buck-mason'}[name.split('-')[0]],'kind':'real male fashion photograph; third-party copyright retained'})
(p/'sources.json').write_text(json.dumps(manifest,indent=2))
subprocess.run(['swift','scripts/editorial-masks.swift',*[str(p/f'{n}.jpg') for n in ['barbour','valstar','todd','rocky']]],check=True)
for n in ['barbour','valstar','todd','rocky']:
 im=Image.open(p/f'{n}.png').convert('RGBA');im=im.crop(im.getchannel('A').getbbox());im.save(p/f'{n}-cut.png')
(p/'CREDITS.md').write_text('# Photography sources\n\nAll selected images are real photographs of men downloaded from the listed brand/CDN sources. Crops, color grading and local person segmentation are derivatives of those photographs, not generated imagery. Source URLs and provenance are in sources.json. Brand/editorial copyrights remain with their owners; advertising reuse clearance is not supplied by downloading.\n\nAIWardrobe demo: supplied project recording assets/aiwardrobe/demo-full.mp4.\nNarration: offline macOS Daniel. Sound: deterministic local synthesis. No downloaded music.\n')
