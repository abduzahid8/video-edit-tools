from pathlib import Path
import json,urllib.request
from PIL import Image,ImageFilter
import numpy as np,cv2
p=Path('public/assets/ford-archive');sources=json.load(open(p/'sources.json'))
for k in ['gq-95','gq-97']:
 u=sources[k].replace('w_1800','w_3000');data=urllib.request.urlopen(u,timeout=25).read();(p/(k+'-large.jpg')).write_bytes(data);sources[k+'-large']=u
for name,k,panel in [('gucci-beige','gq-95',0),('gucci-velvet','gq-97',1)]:
 im=Image.open(p/(k+'-large.jpg')).convert('RGB');w,h=im.size;im=im.crop((round(w*panel/3)+10,0,round(w*(panel+1)/3)-10,h));im.save(p/(name+'.jpg'),quality=95)
 a=np.array(im);n,lab=cv2.connectedComponents((np.min(a,axis=2)>238).astype('uint8'));edge=np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]]));edge=edge[edge!=0];alpha=np.where(np.isin(lab,edge),0,255).astype('uint8');out=im.convert('RGBA');out.putalpha(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(.3)));out.save(p/(name+'.png'));print(name,im.size)
(p/'sources.json').write_text(json.dumps(sources,indent=2))
