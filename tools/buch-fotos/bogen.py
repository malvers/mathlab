# tools/buch-fotos/bogen.py - overview of all thumbnails in a folder: sheet.py <dir> <out.png>
import json, glob, os, sys
from PIL import Image, ImageDraw, ImageFont
d, out = sys.argv[1], sys.argv[2]
f = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 13)
tiles = []
for j in sorted(glob.glob(d + '/*.json')):
    for r in json.load(open(j)):
        if r.get('file') and os.path.exists(r['file']): tiles.append(r)
TW, TH, cols = 220, 160, 7
rows = (len(tiles) + cols - 1) // cols
C = Image.new('RGB', (cols * (TW + 6), rows * (TH + 34)), '#222'); dr = ImageDraw.Draw(C)
for k, r in enumerate(tiles):
    im = Image.open(r['file']).convert('RGB'); im.thumbnail((TW, TH))
    x = (k % cols) * (TW + 6); y = (k // cols) * (TH + 34)
    C.paste(im, (x, y)); dr.text((x, y + TH + 2), os.path.basename(r['file'])[:-4] + f" {r['w']}x{r['h']}", fill='#fff', font=f)
    dr.text((x, y + TH + 17), r['license'][:28], fill='#f5c242', font=f)
C.save(out); print(len(tiles), C.size)
