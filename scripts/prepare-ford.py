from PIL import Image,ImageOps
from pathlib import Path
p=Path('public/assets/tom-ford')
a=Image.open(p/'portrait.jpg')
a.crop((110,0,580,1500)).save(p/'tuxedo.jpg',quality=95)
a=Image.open(p/'london.jpg');a.crop((1270,580,2180,3240)).save(p/'silhouette.jpg',quality=95)
a=Image.open(p/'venice.jpg');a.crop((70,620,925,1470)).save(p/'collar.jpg',quality=95)
a=Image.open('public/assets/capsule-elegant/navy-0.jpg');a.save(p/'velvet.jpg',quality=95)
