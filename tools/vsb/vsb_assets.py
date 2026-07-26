# Derived assets from the master: web gold PNG, wood preview, milling SVG,
# viewer heightmap data, master copy into the data folder.
import os
S = os.environ.get('VSB_TMP', '/tmp/vsb-pipeline')
MASTER = os.environ.get('VSB_MASTER', '/Users/malvers/IdeaProjects/forloop/HTML/vsb-siegel-150mm-edit.svg')
OUT = os.environ.get('VSB_OUT', os.path.expanduser('~/Desktop/vsb-seal-data'))
HTML = os.environ.get('VSB_HTML', '/Users/malvers/IdeaProjects/forloop/HTML')
import re, math, base64, shutil
import numpy as np

# master copy
shutil.copyfile(MASTER, OUT + '/vsb-siegel-master.svg')

# shaded wood preview + viewer heightmap from the fresh heightfield
H = np.fromfile(S + '/vsb_h16.raw', dtype='<u2').reshape(2000, 2000).astype(np.float32) / 65535.0 * 8.0
Hs = H.reshape(1000, 2, 1000, 2).mean(axis=(1, 3))
gx, gy = np.gradient(Hs, 104.0 / 1000)
az, el = math.radians(315), math.radians(40)
L = np.array([math.cos(el) * math.sin(az), -math.cos(el) * math.cos(az), math.sin(el)])
inv = 1.0 / np.sqrt(gx * gx + gy * gy + 1)
ndl = np.clip((-gy * L[0] - gx * L[1] + L[2]) * inv, 0, 1)
base = np.array([222, 184, 135], np.float32)
img = (base[None, None, :] * (.30 + .70 * ndl[:, :, None])).astype(np.uint8)
img[Hs < 2] = (24, 24, 26)
img.tofile(S + '/wood.raw')
os.system(f'ffmpeg -y -v error -f rawvideo -pix_fmt rgb24 -s 1000x1000 -i {S}/wood.raw {S}/vsb-vorschau-holz.png')

Hv = (H / 8.0 * 255).astype(np.uint8)
idx = (np.linspace(0, 1999, 1040)).astype(int)
np.stack([Hv[idx][:, idx]] * 3, -1).astype(np.uint8).tofile(S + '/hv.raw')
os.system(f'ffmpeg -y -v error -f rawvideo -pix_fmt rgb24 -s 1040x1040 -i {S}/hv.raw {S}/hv.png')
b64 = base64.b64encode(open(S + '/hv.png', 'rb').read()).decode()
js = ('window.VSB_HM="data:image/png;base64,' + b64 + '";\n'
      'window.VSB_HM_META={frame_mm:104,hmax_mm:8,field_mm:6,skirt_mm:1};\n')
open(HTML + '/vsb-holz-daten.js', 'w').write(js)

# web gold asset from the tree mask (tree + tree ring, gradient baked, alpha)
mk = np.fromfile(S + '/ygg592_master.gray', dtype=np.uint8).reshape(592, 592) < 128
mm2 = mk.astype(np.float32)
soft = sum(np.roll(np.roll(mm2, a, 0), b, 1) for a in (-1, 0, 1) for b in (-1, 0, 1)) / 9.0
alpha = np.clip(soft * 255, 0, 255).astype(np.uint8)
N = 640; OFF = 24
rgba = np.zeros((N, N, 4), np.uint8)
yy, xx = np.mgrid[0:592, 0:592]
t = np.clip(0.75 * (yy / 591.0) + 0.25 * (xx / 591.0), 0, 1)
stops = [(0.0, (243, 220, 139)), (0.5, (212, 175, 55)), (1.0, (154, 122, 36))]
col = np.zeros((592, 592, 3), np.float32)
for i in range(len(stops) - 1):
    t0, c0 = stops[i]; t1, c1 = stops[i + 1]
    w = np.clip((t - t0) / (t1 - t0), 0, 1)
    seg = (t >= t0) & (t <= t1) if i == 0 else (t > t0) & (t <= t1)
    for c in range(3):
        col[:, :, c] = np.where(seg, c0[c] + (c1[c] - c0[c]) * w, col[:, :, c])
rgba[OFF:OFF + 592, OFF:OFF + 592, :3] = col.astype(np.uint8)
rgba[OFF:OFF + 592, OFF:OFF + 592, 3] = alpha
rgba.tofile(S + '/gold.raw')
os.system(f'ffmpeg -y -v error -f rawvideo -pix_fmt rgba -s {N}x{N} -i {S}/gold.raw {HTML}/tracker/vsb-yggdrasil-gold.png')
print('assets done')
