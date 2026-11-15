#!/usr/bin/env python3
"""Download a curated collection of entrepreneurs' public-license photos from Wikimedia Commons.
Run: python3 download_photos.py
No third-party Python modules required.
"""
from pathlib import Path
from urllib import request, parse, error
import json, csv, re, html, time, zipfile, shutil
from concurrent.futures import ThreadPoolExecutor, as_completed

MANIFEST = [('Mark_Zuckerberg', 'Mark Zuckerberg, World Economic Forum 2009 Annual Meeting.jpg', 'Davos 2009'), ('Mark_Zuckerberg', 'Mark Zuckerberg at the 37th G8 Summit in Deauville 037.jpg', 'G8 2011 formal'), ('Mark_Zuckerberg', 'Mark Zuckerberg at the 37th G8 Summit in Deauville 018 v1.jpg', 'G8 2011 formal vertical'), ('Mark_Zuckerberg', 'Mark Zuckerberg, founder Facebook, and Jet Li, famous martial arts star.jpg', 'Davos 2009 with Jet Li'), ('Mark_Zuckerberg', 'Mark zuckerberg at dld (3230633021).jpg', 'DLD 2009'), ('Mark_Zuckerberg', 'Jimmy Wales and Mark Zuckerberg face to face.jpg', 'Davos 2009 with Jimmy Wales'), ('Mark_Zuckerberg', 'Mark Zuckerberg - 3481555455.jpg', '2009'), ('Mark_Zuckerberg', 'Mark Zuckerberg at the e-G8 conference in Paris (5795147933).jpg', 'Paris 2011'), ('Mark_Zuckerberg', 'Mark Zuckerberg at the 37th G8 Summit in Deauville 018 square.jpg', 'G8 2011 second angle'), ('Bill_Gates', 'Bill Gates, WEF 2009 Davos.jpg', 'Davos 2009'), ('Bill_Gates', 'Bill Gates - World Economic Forum Annual Meeting Davos 2008.jpg', 'Davos 2008 vertical'), ('Bill_Gates', 'Bill Gates - World Economic Forum Annual Meeting Davos 2008 number2.jpg', 'Davos 2008 angle 2'), ('Bill_Gates', 'Bill Gates - World Economic Forum Annual Meeting Davos 2008 number3.jpg', 'Davos 2008 angle 3'), ('Bill_Gates', 'Bill Gates - World Economic Forum Annual Meeting New York 2002.jpg', 'New York 2002'), ('Steve_Jobs', 'Steve Jobs January 1984.jpg', 'Macintosh 1984'), ('Jeff_Bezos', 'Jeff Bezos at Amazon Spheres Grand Opening in Seattle - 2018 (39074799225).jpg', 'Amazon Spheres 2018'), ('Jeff_Bezos', 'Jeff Bezos at Amazon Spheres Grand Opening in Seattle - 2018 (39262177384).jpg', 'Amazon Spheres second angle'), ('Jeff_Bezos', 'Jeff Bezos at Amazon Spheres Grand Opening in Seattle - 2018 (39972652661).jpg', 'Amazon Spheres third angle'), ('Richard_Branson', 'Sir Richard Branson - Gulltaggen 2010 (4573384007).jpg', 'Gulltaggen 2010 vertical'), ('Richard_Branson', 'Richard Branson (6019821104).jpg', 'Formal event'), ('Richard_Branson', 'GovBillRichardson&RichardBranson 2010.jpg', '2010 official event'), ('Sam_Altman', 'Prime Minister of Bharat, Shri Narendra Damodardas Modi with OpenAI CEO, Mr. Sam Altman.jpg', '2026 formal meeting'), ('Sam_Altman', 'Sam Altman speaking at TED.jpg', 'TED 2025'), ('Sam_Altman', 'Sam Altman TechCrunch SF 2019 Day 2 Oct 3 (cropped).jpg', 'TechCrunch 2019'), ('Larry_Page', 'Larry Page, Martin Rees, and Simon Quellen Field-9Aug2008.jpg', '2008 event'), ('Larry_Page', 'Google Larry Page.JPG', '2008 standing'), ('Eric_Schmidt', 'Eric Schmidt at the 37th G8 Summit in Deauville 037.jpg', 'G8 2011')]
BASE = Path.home() / 'Downloads' / 'Founder_Photos_Collection'
DEST = BASE / 'Photos'
HEADERS = {'User-Agent':'FounderPhotoCollection/1.0 (personal use; Wikimedia Commons API; Python urllib)', 'Accept':'application/json, image/jpeg, image/png, image/webp, */*'}

def query_commons(title):
    url='https://commons.wikimedia.org/w/api.php?' + parse.urlencode({
        'action':'query','format':'json','prop':'imageinfo','iiprop':'url|size|extmetadata',
        'titles':'File:'+title,'redirects':'1','formatversion':'2'})
    req=request.Request(url, headers=HEADERS)
    with request.urlopen(req,timeout=30) as r:
        obj=json.load(r)
    pages=obj.get('query',{}).get('pages',[])
    if not pages or 'imageinfo' not in pages[0]:
        raise ValueError('File not found on Commons: '+title)
    return pages[0]['imageinfo'][0]

def cleanup(s):
    return re.sub(r'[^\w.\-]+','_',s,flags=re.UNICODE).strip('_')[:120]

def metadata_text(obj, key):
    return re.sub(r'<[^>]*>','',html.unescape(obj.get(key,{}).get('value',''))).strip()

def fetch_file(url, path):
    req=request.Request(url,headers={**HEADERS, 'Accept':'image/*,*/*;q=0.8'})
    tmp=path.with_suffix(path.suffix+'.part')
    with request.urlopen(req,timeout=60) as r, open(tmp,'wb') as fout:
        ct=r.headers.get('Content-Type','')
        if ct and not (ct.startswith('image/') or ct.startswith('application/octet-stream')):
            raise ValueError('Non-image response: '+ct)
        size=0
        while True:
            block=r.read(1<<18)
            if not block:break
            size+=len(block)
            if size>35000000:raise ValueError('Image exceeds 35 MB')
            fout.write(block)
    if tmp.stat().st_size<1000:
        tmp.unlink(missing_ok=True)
        raise ValueError('Image empty or unexpectedly small')
    tmp.replace(path)

def download_one(number, person, title, note):
    folder=DEST/person
    folder.mkdir(parents=True,exist_ok=True)
    try:
        info=query_commons(title)
        link=info['url']
        ext=Path(parse.urlsplit(link).path).suffix.lower()
        if ext not in ['.jpg','.jpeg','.png','.webp']:
            raise ValueError('Not supported image type: '+ext)
        name=f'{number:02d}_{cleanup(note)}{ext}'
        path=folder/name
        if not path.exists():
            fetch_file(link,path)
        extmeta=info.get('extmetadata',{})
        record={'person':person.replace('_',' '),'title':title,'note':note,
                'file':str(path.relative_to(BASE)),'source':'https://commons.wikimedia.org/wiki/File:'+parse.quote(title.replace(' ','_')),
                'original_url':link,'width':info.get('width',''),'height':info.get('height',''),
                'author':metadata_text(extmeta,'Artist'),'license':metadata_text(extmeta,'LicenseShortName'),
                'license_url':metadata_text(extmeta,'LicenseUrl'), 'status':'OK'}
        return record
    except Exception as e:
        return {'person':person.replace('_',' '),'title':title,'note':note,'status':'FAILED: '+str(e)}

def main():
    BASE.mkdir(parents=True,exist_ok=True)
    DEST.mkdir(parents=True,exist_ok=True)
    print('Downloading founder photos to:', BASE)
    print('Photos requested:',len(MANIFEST),'— use of each image subject to its source license and publicity rights.')
    results=[]
    with ThreadPoolExecutor(max_workers=3) as pool:
        future_map={pool.submit(download_one,i,*item):i for i,item in enumerate(MANIFEST,1)}
        for f in as_completed(future_map):
            result=f.result()
            results.append(result)
            print(('[OK] ' if result['status']=='OK' else '[SKIPPED] ')+result['person']+' — '+result['note']+' — '+result['status'])
    results.sort(key=lambda x:(x['person'],x['note']))
    (BASE/'results.json').write_text(json.dumps(results,indent=2,ensure_ascii=False),encoding='utf8')
    with (BASE/'SOURCES_AND_LICENSES.csv').open('w',newline='',encoding='utf8') as fh:
        w=csv.DictWriter(fh,fieldnames=['person','title','note','file','source','original_url','width','height','author','license','license_url','status'],extrasaction='ignore')
        w.writeheader();w.writerows(results)
    successful=[r for r in results if r['status']=='OK']
    cards='\n'.join('<article><img loading="lazy" src="'+html.escape(r['file'],quote=True)+'"><h3>'+html.escape(r['person'])+'</h3><p>'+html.escape(r['note'])+'</p><small>'+html.escape(r['license'])+'</small><p><a href="'+html.escape(r['source'],quote=True)+'">Source / license</a></p></article>' for r in successful)
    page="""<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Founder Photo Collection</title><style>body{font:16px system-ui;background:#101216;color:#f0f1f4;padding:30px}h1{font-size:28px}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px}article{background:#242731;border-radius:12px;padding:12px}img{width:100%;height:270px;object-fit:contain;background:#14161a}a{color:#9fbfff}small{opacity:.75}</style><h1>Founder Photo Collection</h1><p>Source and license information is in SOURCES_AND_LICENSES.csv. Person and body framing vary; review images individually.</p><main>"""+cards+'</main></html>'
    (BASE/'gallery.html').write_text(page,encoding='utf8')
    zip_path=BASE/'Founder_Photos.zip'
    with zipfile.ZipFile(zip_path,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        for p in sorted(DEST.rglob('*')):
            if p.is_file():z.write(p,p.relative_to(BASE))
        for name in ['SOURCES_AND_LICENSES.csv','gallery.html','results.json']:
            z.write(BASE/name,name)
    print('\nFinished:',len(successful),'of',len(MANIFEST),'photos saved.')
    print('ZIP:',zip_path)
    print('Gallery:',BASE/'gallery.html')
    if len(successful)<len(MANIFEST):
        print('Some originals may be temporarily unavailable or blocked. Check results.json for failures.')
    if not successful: print('No images were downloaded. Check your Internet connection and try again.')

if __name__=='__main__':main()
