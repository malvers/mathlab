import os
S = os.environ.get('VSB_TMP', '/tmp/vsb-pipeline')
os.makedirs(S, exist_ok=True)
MASTER = os.environ.get('VSB_MASTER', '/Users/malvers/IdeaProjects/forloop/HTML/vsb-siegel-150mm-edit.svg')
OUT = os.environ.get('VSB_OUT', os.path.expanduser('~/Desktop/vsb-seal-data'))
os.makedirs(OUT, exist_ok=True)
HTML = os.environ.get('VSB_HTML', '/Users/malvers/IdeaProjects/forloop/HTML')
# VSB seal pipeline — SINGLE SOURCE OF TRUTH: the master SVG (Doc's edit).
# Everything here derives from it: B/W print files, wood heightfield, masks,
# ring radii for the stitch generator, web gold asset.
import numpy as np, re, os, math, struct, zlib, sys

svg = open(MASTER).read()

# ---------------- parse ----------------
def parse_beziers(pid):
    m = re.search(r'id="%s"[^>]*d="([^"]*)"' % pid, svg)
    if not m: return []
    d = m.group(1); loops = []; cur = None
    for c in re.finditer(r'([MCZ])([-\d. ]*)', d):
        nm = [float(x) for x in c.group(2).split()] if c.group(2).strip() else []
        if c.group(1) == 'M':
            if cur and len(cur) > 2: loops.append(cur)
            cur = [(nm[0], nm[1])]
        elif c.group(1) == 'C':
            x0, y0 = cur[-1]
            c1 = (nm[0], nm[1]); c2 = (nm[2], nm[3]); p3 = (nm[4], nm[5])
            L = (math.hypot(p3[0]-x0, p3[1]-y0) + math.hypot(c1[0]-x0, c1[1]-y0)
                 + math.hypot(c2[0]-p3[0], c2[1]-p3[1]))
            n = max(3, int(L / 0.04))
            for k in range(1, n+1):
                t = k/n; mt = 1-t
                cur.append((mt**3*x0 + 3*mt*mt*t*c1[0] + 3*mt*t*t*c2[0] + t**3*p3[0],
                            mt**3*y0 + 3*mt*mt*t*c1[1] + 3*mt*t*t*c2[1] + t**3*p3[1]))
        elif c.group(1) == 'Z':
            if cur and len(cur) > 2: loops.append(cur)
            cur = None
    if cur and len(cur) > 2: loops.append(cur)
    return loops

def parse_ring_radii(pid):
    # ring paths are arc pairs: radius = first number after 'A'
    m = re.search(r'id="%s"[^>]*d="([^"]*)"' % pid, svg)
    if not m: return None
    rr = [float(x) for x in re.findall(r'A\s*([\d.]+)', m.group(1))]
    return (max(rr), min(rr)) if rr else None

LET = parse_beziers('lettering')
TREE = parse_beziers('tree')
RINGS = [parse_ring_radii('ring-outer'), parse_ring_radii('ring-inner'), parse_ring_radii('tree-ring')]
RINGS = [r for r in RINGS if r]
C = 75.0
print('master: lettering %d loops, tree %d loops, rings %s' % (len(LET), len(TREE), RINGS))

# ---------------- rasterizer (even-odd, analytic rings) ----------------
def render(N, x0mm, y0mm, span, loops_list, rings, ss=2):
    N2 = N * ss
    canvas = np.zeros((N2, N2), bool)
    k = N2 / span
    for ro, ri in rings:
        pro, pri = ro*k, ri*k
        cx = (C-x0mm)*k; cy = (C-y0mm)*k
        for y in range(N2):
            d2 = (y+0.5-cy)**2
            if d2 > pro*pro: continue
            h1 = math.sqrt(pro*pro - d2)
            if d2 < pri*pri:
                h0 = math.sqrt(pri*pri - d2)
                canvas[y, max(0, int(cx-h1)):int(cx-h0)+1] = True
                canvas[y, max(0, int(cx+h0)):min(N2, int(cx+h1)+1)] = True
            else:
                canvas[y, max(0, int(cx-h1)):min(N2, int(cx+h1)+1)] = True
    rowsx = {}
    for loops in loops_list:
        for lp in loops:
            P = [((x-x0mm)*k, (y-y0mm)*k) for x, y in lp]
            n = len(P)
            for i in range(n):
                x1, y1 = P[i]; x2, y2 = P[(i+1) % n]
                if y1 == y2: continue
                ya, yb = (y1, y2) if y1 < y2 else (y2, y1)
                for yy in range(max(0, int(math.ceil(ya-0.5))), min(N2-1, int(math.floor(yb+0.5)))+1):
                    yc = yy + 0.5
                    if (y1 <= yc < y2) or (y2 <= yc < y1):
                        rowsx.setdefault(yy, []).append(x1 + (yc-y1)/(y2-y1)*(x2-x1))
    for yy, xs in rowsx.items():
        xs.sort()
        for j in range(0, len(xs)-1, 2):
            xa = max(0, int(math.ceil(xs[j]-0.5))); xb = min(N2-1, int(math.floor(xs[j+1]-0.5)))
            if xb >= xa: canvas[yy, xa:xb+1] ^= True
    return canvas.reshape(N, ss, N, ss).mean(axis=(1, 3))

# ---------------- 1) B/W print files, 1200 dpi ----------------
N = 7370
sub = render(N, -3.0, -3.0, 156.0, [LET, TREE], RINGS)
img = np.where(sub >= 0.5, 0, 255).astype(np.uint8)
img.tofile(S+'/p_master.raw')
os.system(f'ffmpeg -y -v error -f rawvideo -pix_fmt gray -s {N}x{N} -i {S}/p_master.raw {S}/p_master.png')
d = open(S+'/p_master.png', 'rb').read()
phys = struct.pack('>IIB', 47244, 47244, 1)
chunk = struct.pack('>I', 9) + b'pHYs' + phys + struct.pack('>I', zlib.crc32(b'pHYs'+phys) & 0xffffffff)
open(OUT+'/vsb-sw-150mm.png', 'wb').write(d[:33] + chunk + d[33:])
print('1) B/W 1200dpi done')

# ---------------- 2) tree mask for the stitch pipeline ----------------
msk = render(592, 36.0, 36.0, 78.0, [TREE], [RINGS[2]])
np.where(msk >= 0.5, 0, 255).astype(np.uint8).tofile(S+'/ygg592_master.gray')
print('2) tree mask done, %.1f%% coverage' % (100*(msk >= 0.5).mean()))

# ---------------- 3) wood heightfield straight from the master raster ----------------
# 2000px over 104mm frame (100mm seal + 2mm margin). Motif 8mm, disc field 6mm, skirt 1mm.
NW = 2000
full = render(NW, -2.0*1.5, -2.0*1.5, 104.0*1.5, [LET, TREE], RINGS)   # master coords, frame=156mm eq
motif = full >= 0.5
yy, xx = np.mgrid[0:NW, 0:NW]
mm_pp = 104.0 / NW
r = np.hypot((xx+0.5)*mm_pp - 52.0, (yy+0.5)*mm_pp - 52.0)
disc = r <= 50.0
H = np.where(motif & disc, 8.0, np.where(disc, 6.0, 1.0))
(H / 8.0 * 65535).astype('<u2').tofile(S+'/vsb_h16.raw')
os.system(f'ffmpeg -y -v error -f rawvideo -pix_fmt gray16le -s {NW}x{NW} -i {S}/vsb_h16.raw {S}/vsb-heightmap-16bit.png')
print('3) wood heightfield done')

# ---------------- 4) ring radii for the stitch generator ----------------
open(S+'/ring_radii.txt', 'w').write(repr(RINGS))
print('4) ring radii:', RINGS)
