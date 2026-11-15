"""Fetch the documented photographs used by the Ralph Lauren editorial."""
from pathlib import Path
from urllib.request import Request, urlopen
from PIL import Image
import json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/assets/ralph-lauren-editorial"
OUT.mkdir(parents=True, exist_ok=True)

SOURCES = {
    "01-early-portrait.png": ("https://media.vanityfair.com/photos/542065e01019a3955fea5cd8/master/w_1024%2Cc_limit/image.png", "Vanity Fair, early Ralph Lauren portrait"),
    "02-ties.jpg": ("https://img2.rtve.es/im/5421898/?w=900", "RTVE, archival Polo tie showcase"),
    "03-boutique.png": ("https://media.vanityfair.com/photos/542065e11019a3955fea5cdc/master/w_600%2Ch_720%2Cc_limit/image.png", "Vanity Fair, early boutique photograph"),
    "04-polo-blue.jpg": ("https://images.squarespace-cdn.com/content/v1/53c44cbde4b056f82568d1bb/1633555606897-JVWJZ1Q6VAW1SMH41FUU/Florian2.jpg", "Braden Studio, Polo Ralph Lauren Dedicated campaign"),
    "05-horse.jpg": ("https://i.mdel.net/i/db/2025/3/2483415/2483415-800w.jpg", "models.com, Ralph Lauren Spring 2025 campaign"),
    "06-collegiate.jpg": ("https://i.mdel.net/i/db/2025/5/2520383/2520383-800w.jpg", "models.com, Polo Ralph Lauren Spring 2025"),
    "07-fall-coat.jpg": ("https://i.mdel.net/i/db/2025/9/2609398/2609398-800w.jpg", "models.com, Polo Ralph Lauren Fall 2025"),
    "08-western-truck.jpg": ("https://mensfolio-my-production.s3.ap-southeast-1.amazonaws.com/2025/12/05162634/J001531_S2_001_00577_R_CMYK-min-2000x1334.jpg", "Men's Folio Malaysia, Ralph Lauren Fall 2025 campaign"),
    "09-rrl-tweed.jpg": ("https://i.mdel.net/i/db/2021/9/1573243/1573243-800w.jpg", "models.com, Double RL Fall 2021"),
    "10-rrl-denim.jpg": ("https://i.mdel.net/i/db/2025/8/2590395/2590395-800w.jpg", "models.com, Double RL Fall 2025 catalog"),
    "11-purple-suit.jpg": ("https://cdn.tag-walk.com/view_nw/look34-12d56fe6.jpg", "Tagwalk, Purple Label Fall/Winter 2025 look 34"),
    "12-purple-riviera.webp": ("https://cdn.prod.website-files.com/62ee0bbe0c783a903ecc0ddb/6674cc653ef26cd92cdbf44f_FLAUNT_17.webp", "Flaunt, Purple Label Spring 2025 presentation"),
    "13-purple-waistcoat.jpg": ("https://cdn.tag-walk.com/view_nw/look36-131dae94.jpg", "Tagwalk, Purple Label Fall/Winter 2025 look 36"),
    "14-purple-pair.jpg": ("https://i.mdel.net/i/db/2025/3/2491437/2491437-800w.jpg", "models.com, Purple Label Spring 2025 campaign"),
}

manifest = {}
for name, (url, credit) in SOURCES.items():
    path = OUT / name
    if not path.exists():
        request = Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urlopen(request, timeout=30) as response:
            path.write_bytes(response.read())
    with Image.open(path) as image:
        image.verify()
    with Image.open(path) as image:
        size = list(image.size)
    manifest[name] = {"url": url, "credit": credit, "pixels": size}
    print(name, size)

(OUT / "sources.json").write_text(json.dumps(manifest, indent=2) + "\n")
