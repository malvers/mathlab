#!/usr/bin/env python3
"""
Extract handwritten formulas from Formeln.jpg using manually defined boxes,
convert to black-bg / lime-green (#adff2f) PNGs sized 1000x1000.
"""
from PIL import Image
import numpy as np, os

SRC  = os.path.join(os.path.dirname(__file__), 'Formeln.jpg')
OUT  = os.path.join(os.path.dirname(__file__), '../HTML/morpheus/presets')
SIZE = 1000
LIME = (173, 255, 47)
PAD  = 30    # extra padding around each box before scaling
THRESH = 160 # grayscale threshold: darker = ink

os.makedirs(OUT, exist_ok=True)

BOXES = [
    {"index": 0,  "x": 305,  "y": 186,  "w": 579,  "h": 206},
    {"index": 1,  "x": 444,  "y": 420,  "w": 191,  "h": 277},
    {"index": 2,  "x": 290,  "y": 658,  "w": 968,  "h": 307},
    {"index": 3,  "x": 287,  "y": 996,  "w": 714,  "h": 177},
    {"index": 4,  "x": 322,  "y": 1174, "w": 725,  "h": 244},
    {"index": 5,  "x": 274,  "y": 1480, "w": 798,  "h": 346},
    {"index": 6,  "x": 335,  "y": 1861, "w": 696,  "h": 271},
    {"index": 7,  "x": 263,  "y": 2189, "w": 787,  "h": 267},
    {"index": 8,  "x": 309,  "y": 2475, "w": 615,  "h": 347},
    {"index": 9,  "x": 312,  "y": 2834, "w": 704,  "h": 230},
    {"index": 10, "x": 311,  "y": 3068, "w": 899,  "h": 232},
    {"index": 11, "x": 305,  "y": 3305, "w": 658,  "h": 247},
    {"index": 12, "x": 336,  "y": 3567, "w": 1253, "h": 289},
]

img = Image.open(SRC).convert('L')
arr = np.array(img)
IH, IW = arr.shape

for b in BOXES:
    i   = b['index']
    x0  = max(0, b['x'] - PAD)
    y0  = max(0, b['y'] - PAD)
    x1  = min(IW, b['x'] + b['w'] + PAD)
    y1  = min(IH, b['y'] + b['h'] + PAD)

    crop = arr[y0:y1, x0:x1]
    mask = crop < THRESH          # True = ink pixel

    ch, cw = crop.shape
    out_arr = np.zeros((ch, cw, 4), dtype=np.uint8)
    out_arr[..., 3] = 0           # fully transparent background
    out_arr[mask, 0] = LIME[0]
    out_arr[mask, 1] = LIME[1]
    out_arr[mask, 2] = LIME[2]
    out_arr[mask, 3] = 255

    crop_img = Image.fromarray(out_arr, 'RGBA')

    # Scale to fit inside 1000x1000 with 60px margin
    MARGIN = 60
    max_w = SIZE - 2 * MARGIN
    max_h = SIZE - 2 * MARGIN
    scale = min(max_w / cw, max_h / ch)
    nw, nh = int(cw * scale), int(ch * scale)
    crop_img = crop_img.resize((nw, nh), Image.LANCZOS)

    # Centre on black 1000x1000 canvas
    canvas = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 255))
    ox = (SIZE - nw) // 2
    oy = (SIZE - nh) // 2
    canvas.paste(crop_img, (ox, oy), crop_img)

    # Convert to RGB (draw-canvas doesn't need alpha)
    final = canvas.convert('RGB')
    fname = os.path.join(OUT, f'formula-{i}.png')
    final.save(fname)
    print(f"formula-{i}.png  crop={cw}×{ch}  scaled={nw}×{nh}  at ({ox},{oy})")

print(f"\nDone — {len(BOXES)} PNGs in {OUT}")
