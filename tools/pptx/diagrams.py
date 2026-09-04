#!/usr/bin/env python3
"""Own diagrams for the Informatik deck - same palette as the slide design."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw, ImageFont
from design_lib import ORANGE, RED, GREEN

NAVY = (14, 36, 78)
BODY = (44, 60, 96)
MUTED = (110, 126, 159)
WHITE = (255, 255, 255)
def hexrgb(h): return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
ORA, RD, GRN = hexrgb(ORANGE), hexrgb(RED), hexrgb(GREEN)

F = "/Users/malvers/Library/Fonts/"
def font(name, size): return ImageFont.truetype(F + name, size)


def box(d, xy, fill=WHITE, outline=NAVY, w=3, r=18):
    d.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=w)


def centered(d, text, cx, cy, fnt, fill=NAVY):
    l, t, r, b = d.textbbox((0, 0), text, font=fnt)
    d.text((cx - (r - l) / 2 - l, cy - (b - t) / 2 - t), text, font=fnt, fill=fill)


def arrow(d, p1, p2, color=NAVY, w=5, head=22):
    import math
    d.line([p1, p2], fill=color, width=w)
    ang = math.atan2(p2[1] - p1[1], p2[0] - p1[0])
    for s in (0.4, -0.4):
        d.line([p2, (p2[0] - head * math.cos(ang - s), p2[1] - head * math.sin(ang - s))],
               fill=color, width=w)


def loop_diagram(path, W=1180, H=900):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f_head = font("Orbitron-Bold.ttf", 30)
    f_txt = font("Raleway-Medium.ttf", 27)
    f_small = font("Raleway-Regular.ttf", 24)

    bw, bh = 470, 190
    pos = {"du": (40, 40), "sig": (W - bw - 40, 40),
           "mod": (W - bw - 40, H - bh - 60), "emp": (40, H - bh - 60)}
    nodes = [
        ("du",  "DU SCHAUST",  "Video, Reel, Kurzvideo", ORA),
        ("sig", "SIGNALE",     "Verweildauer · Like · Skip", RD),
        ("mod", "MODELL",      "schätzt: bleibst du dran?", GRN),
        ("emp", "EMPFEHLUNG",  "das nächste Video", NAVY),
    ]
    for key, head, sub, col in nodes:
        x, y = pos[key]
        box(d, (x, y, x + bw, y + bh))
        d.rounded_rectangle((x, y, x + 14, y + bh), radius=7, fill=col)
        centered(d, head, x + bw / 2 + 7, y + 62, f_head, NAVY)
        centered(d, sub, x + bw / 2 + 7, y + 122, f_small, BODY)

    a = 26
    arrow(d, (pos["du"][0] + bw + a, pos["du"][1] + bh / 2), (pos["sig"][0] - a, pos["sig"][1] + bh / 2))
    arrow(d, (pos["sig"][0] + bw / 2, pos["sig"][1] + bh + a), (pos["mod"][0] + bw / 2, pos["mod"][1] - a))
    arrow(d, (pos["mod"][0] - a, pos["mod"][1] + bh / 2), (pos["emp"][0] + bw + a, pos["emp"][1] + bh / 2))
    arrow(d, (pos["emp"][0] + bw / 2, pos["emp"][1] - a), (pos["du"][0] + bw / 2, pos["du"][1] + bh + a))
    centered(d, "jede Reaktion ist Trainingsmaterial", W / 2, H / 2 - 16, f_txt, MUTED)
    centered(d, "der Kreis dreht sich bei jedem Wisch", W / 2, H / 2 + 24, f_small, MUTED)
    img.save(path)
    return path


def tracking_diagram(path, W=1420, H=690):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f_head = font("Orbitron-Bold.ttf", 27)
    f_txt = font("Raleway-Medium.ttf", 25)
    f_small = font("Raleway-Regular.ttf", 22)

    bw, bh, y = 380, 210, 90
    cols = [(40, "SEITE A", "Sport-Blog", "du liest über Laufschuhe", ORA),
            ((W - bw) / 2, "TRACKER", "fremdes Skript auf der Seite", "setzt eine ID auf dein Gerät", RD),
            (W - bw - 40, "SEITE B", "Nachrichtenportal", "zeigt dir Laufschuh-Werbung", GRN)]
    for x, head, sub, sub2, col in cols:
        box(d, (x, y, x + bw, y + bh))
        d.rounded_rectangle((x, y, x + 14, y + bh), radius=7, fill=col)
        centered(d, head, x + bw / 2 + 7, y + 52, f_head, NAVY)
        centered(d, sub, x + bw / 2 + 7, y + 108, f_txt, NAVY)
        centered(d, sub2, x + bw / 2 + 7, y + 156, f_small, MUTED)
    for i in range(2):
        x1 = cols[i][0] + bw + 22
        x2 = cols[i + 1][0] - 22
        arrow(d, (x1, y + bh / 2), (x2, y + bh / 2))

    py = y + bh + 150
    box(d, ((W - 560) / 2, py, (W + 560) / 2, py + 150), fill=(244, 247, 252))
    centered(d, "PROFIL", W / 2, py + 46, f_head, NAVY)
    centered(d, "Interessen · Geräte · Orte · Zeiten", W / 2, py + 100, f_txt, BODY)
    for x, _, _, _, _ in cols:
        d.line([(x + bw / 2, y + bh + 14), (x + bw / 2, py - 60)], fill=MUTED, width=3)
        d.line([(x + bw / 2, py - 60), (W / 2, py - 60)], fill=MUTED, width=3)
    arrow(d, (W / 2, py - 60), (W / 2, py - 14), MUTED, 3)
    centered(d, "Kein Login nötig — Wiedererkennung reicht.", W / 2, py + 186, f_small, MUTED)
    img.save(path)
    return path


if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(os.path.join(here, "img"), exist_ok=True)
    print(loop_diagram(os.path.join(here, "img", "loop.png")))
    print(tracking_diagram(os.path.join(here, "img", "tracking.png")))
