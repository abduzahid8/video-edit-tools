"""Remove only border-connected white studio backdrop. Original portrait RGB retained."""
from PIL import Image,ImageFilter
import numpy as np,cv2
p='public/assets/ford-models/'
im=Image.open(p+'ford-airmail.jpg').convert('RGB');a=np.array(im)
white=np.min(a,axis=2)>240
n,lab=cv2.connectedComponents(white.astype('uint8'))
edge=np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]]));edge=edge[edge!=0]
alpha=np.where(np.isin(lab,edge),0,255).astype('uint8');out=im.convert('RGBA');out.putalpha(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(.35)));out.save(p+'ford-airmail-cut.png')
