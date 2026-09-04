#!/usr/bin/env python3
"""Scene 10 card: the 2016 mockup (left) and today's window (right) on the lab's dark blue,
2560x1440, then looped into card10.mp4 for the given seconds.
Usage: card10.py <today.png> <seconds> <outdir>"""
import subprocess, sys
from PIL import Image, ImageDraw, ImageFont
today, secs, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
MOCK = '/Users/malvers/PRIVAT MRA/Backup Pinkerfind/Semantic Mac Finder.png'
W, H = 2560, 1440
bg = Image.new('RGB', (W, H), (8, 20, 40))            # --ground of the drehbuch pages
d = ImageDraw.Draw(bg)
def font(size, name='Orbitron'):
    for f in ['/Users/malvers/Library/Fonts/Orbitron-Bold.ttf', '/Users/malvers/Library/Fonts/Orbitron-Regular.ttf',
              '/Library/Fonts/Orbitron-Bold.ttf', '/System/Library/Fonts/Supplemental/Arial Bold.ttf']:
        try: return ImageFont.truetype(f, size)
        except Exception: pass
    return ImageFont.load_default()
def place(path, x, y, w, label):
    im = Image.open(path).convert('RGB')
    h = int(im.height * w / im.width)
    im = im.resize((w, h), Image.LANCZOS)
    # a soft frame
    d.rectangle([x - 6, y - 6, x + w + 6, y + h + 6], outline=(28, 53, 101), width=3)
    bg.paste(im, (x, y))
    d.text((x, y - 70), label, fill=(230, 238, 250), font=font(44))
    return h
gap, m = 80, 100
w = (W - 2 * m - gap) // 2
# both pictures centred in the band below the title, each at its own height
def height(path):
    im = Image.open(path); return int(im.height * w / im.width)
band_top, band_bot = 240, H - 80
for path, x, label in [(MOCK, m, '2016 — Entwurf'), (today, m + w + gap, '2026 — Pinker-Finder')]:
    h = height(path); y = band_top + 70 + (band_bot - band_top - 70 - h) // 2
    place(path, x, y, w, label)
d.text((m, 110), 'Zehn Jahre, ein Reiter', fill=(245, 194, 66), font=font(72))
png = f'{out}/card10.png'; bg.save(png)
subprocess.run(['ffmpeg', '-nostdin', '-y', '-v', 'error', '-loop', '1', '-i', png, '-t', f'{secs:.2f}',
                '-r', '25', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', f'{out}/card10.mp4'], check=True)
print('card10', png, f'{secs:.1f}s')
