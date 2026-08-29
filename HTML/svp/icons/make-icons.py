# Extract the macOS app icons and drop their white squircle plate:
# flood fill light, unsaturated pixels starting from the (transparent) border,
# so the white letter inside the logo survives — it is enclosed by colour.
import subprocess, sys, colorsys
from collections import deque
from PIL import Image

SRC = [("Microsoft PowerPoint", "Powerpoint_macOS", "ppt"),
       ("Microsoft Word", "Word_macOS", "doc"),
       ("Microsoft Excel", "Excel_macOS", "xls"),
       ("Adobe Acrobat Reader", "ACR_App", "pdf")]

def light(p):
    # anything colourless — the plate AND its grey drop shadow. The logos
    # themselves are saturated, their white letters sit enclosed inside them.
    r, g, b, a = p
    if a < 40: return True
    mx, mn = max(r, g, b), min(r, g, b)
    sat = 0 if mx == 0 else (mx - mn) / mx
    return sat < 0.18

for app, icns, out in SRC:
    tmp = "/tmp/%s_raw.png" % out
    subprocess.run(["sips", "-s", "format", "png", "-Z", "128",
                    "/Applications/%s.app/Contents/Resources/%s.icns" % (app, icns),
                    "--out", tmp], check=True, capture_output=True)
    im = Image.open(tmp).convert("RGBA")
    w, h = im.size
    px = im.load()
    seen = [[False] * h for _ in range(w)]
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if not seen[x][y] and light(px[x, y]): seen[x][y] = True; q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not seen[x][y] and light(px[x, y]): seen[x][y] = True; q.append((x, y))
    while q:
        x, y = q.popleft()
        px[x, y] = (px[x, y][0], px[x, y][1], px[x, y][2], 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not seen[nx][ny] and light(px[nx, ny]):
                seen[nx][ny] = True; q.append((nx, ny))
    # two cleanup passes against the anti-aliased grey halo the fill leaves behind
    for _ in range(2):
        kill = []
        for x in range(w):
            for y in range(h):
                r, g, b, a = px[x, y]
                if a == 0 or a > 250: continue
                mx, mn = max(r, g, b), min(r, g, b)
                sat = 0 if mx == 0 else (mx - mn) / mx
                if sat < 0.22:
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] == 0:
                            kill.append((x, y)); break
        for x, y in kill: px[x, y] = (px[x, y][0], px[x, y][1], px[x, y][2], 0)
    im.save("icons/%s.png" % out)
    bbox = im.getbbox()
    print(out, "bbox", bbox, "ink %dx%d" % (bbox[2] - bbox[0], bbox[3] - bbox[1]))
