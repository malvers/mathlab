#!/usr/bin/env python3
"""ER diagrams (Chen notation) and table schemas drawn with Pillow in the deck palette.

Canvases are about 1600 px wide and land at 816 pt on the slide, so 26 px of
text become 13 pt. Positions are given by hand per diagram - reliable beats clever.
"""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw
from diagrams import box, centered, arrow, font, hexrgb, NAVY, BODY, MUTED, WHITE
from design_lib import ORANGE, RED, GREEN

ORA, RD, GRN = hexrgb(ORANGE), hexrgb(RED), hexrgb(GREEN)
TINT = (244, 247, 252)

F_ENT = lambda: font("Orbitron-Bold.ttf", 26)
F_ATTR = lambda: font("Raleway-Medium.ttf", 24)
F_REL = lambda: font("Raleway-SemiBold.ttf", 24)
F_CARD = lambda: font("Orbitron-Bold.ttf", 26)
F_NOTE = lambda: font("Raleway-Regular.ttf", 24)


def _edge_point(cx, cy, w, h, tx, ty):
    """Point on the rectangle border (center cx,cy, size w,h) towards (tx,ty)."""
    dx, dy = tx - cx, ty - cy
    if dx == 0 and dy == 0:
        return cx, cy
    sx = (w / 2) / abs(dx) if dx else float("inf")
    sy = (h / 2) / abs(dy) if dy else float("inf")
    s = min(sx, sy)
    return cx + dx * s, cy + dy * s


def _ellipse_edge(cx, cy, rx, ry, tx, ty):
    ang = math.atan2((ty - cy) / ry, (tx - cx) / rx)
    return cx + rx * math.cos(ang), cy + ry * math.sin(ang)


def er_diagram(path, W, H, entities, relations, notes=()):
    """entities: {name: {"pos": (x, y), "attrs": [(label, is_key, (dx, dy)), ...],
                         "color": rgb}}   - attrs sit at center + (dx, dy)
    relations: [{"name": str, "pos": (x, y), "ends": [(entity, card), ...],
                 "attrs": [(label, (dx, dy)), ...]}]
    notes: [(text, (x, y))] muted captions."""
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f_ent, f_attr, f_rel, f_card, f_note = F_ENT(), F_ATTR(), F_REL(), F_CARD(), F_NOTE()
    EH = 90
    RW, RH = 230, 110
    AX, AY = 96, 34
    # entity boxes grow with their label so long names never spill out
    ew = {n: max(250, d.textlength(n.upper(), font=f_ent) + 70) for n in entities}

    # lines first (under the shapes)
    for rel in relations:
        rx, ry = rel["pos"]
        for ent, card in rel["ends"]:
            ex, ey = entities[ent]["pos"]
            p1 = _edge_point(ex, ey, ew[ent], EH, rx, ry)
            p2 = _edge_point(rx, ry, RW, RH, ex, ey)
            d.line([p1, p2], fill=NAVY, width=4)
            if card:
                # cardinality: 28 px along the line from the entity, 30 px above it
                L = math.hypot(p2[0] - p1[0], p2[1] - p1[1]) or 1
                ux, uy = (p2[0] - p1[0]) / L, (p2[1] - p1[1]) / L
                cx, cy = p1[0] + ux * 28, p1[1] + uy * 28
                nx, ny = -uy, ux
                if ny > 0:
                    nx, ny = -nx, -ny
                centered(d, card, cx + 30 * nx, cy + 30 * ny, f_card, RD)
        for label, (dx, dy) in rel.get("attrs", []):
            ax, ay = rx + dx, ry + dy
            p1 = _ellipse_edge(ax, ay, AX, AY, rx, ry)
            p2 = _edge_point(rx, ry, RW, RH, ax, ay)
            d.line([p1, p2], fill=MUTED, width=3)
    for name, e in entities.items():
        ex, ey = e["pos"]
        for label, is_key, (dx, dy) in e.get("attrs", []):
            ax, ay = ex + dx, ey + dy
            p1 = _ellipse_edge(ax, ay, AX, AY, ex, ey)
            p2 = _edge_point(ex, ey, ew[name], EH, ax, ay)
            d.line([p1, p2], fill=MUTED, width=3)

    # attributes
    for name, e in entities.items():
        ex, ey = e["pos"]
        for label, is_key, (dx, dy) in e.get("attrs", []):
            ax, ay = ex + dx, ey + dy
            d.ellipse((ax - AX, ay - AY, ax + AX, ay + AY), fill=WHITE, outline=NAVY, width=3)
            centered(d, label, ax, ay, f_attr, NAVY)
            if is_key:
                l, t, r, b = d.textbbox((0, 0), label, font=f_attr)
                d.line([(ax - (r - l) / 2, ay + 18), (ax + (r - l) / 2, ay + 18)], fill=NAVY, width=3)
    for rel in relations:
        rx, ry = rel["pos"]
        for label, (dx, dy) in rel.get("attrs", []):
            ax, ay = rx + dx, ry + dy
            d.ellipse((ax - AX, ay - AY, ax + AX, ay + AY), fill=WHITE, outline=MUTED, width=3)
            centered(d, label, ax, ay, f_attr, BODY)

    # entities and relations
    for name, e in entities.items():
        ex, ey = e["pos"]
        col = e.get("color", ORA)
        EW = ew[name]
        box(d, (ex - EW / 2, ey - EH / 2, ex + EW / 2, ey + EH / 2), r=8)
        d.rectangle((ex - EW / 2, ey - EH / 2, ex - EW / 2 + 14, ey + EH / 2), fill=col)
        centered(d, name.upper(), ex + 7, ey, f_ent, NAVY)
    for rel in relations:
        rx, ry = rel["pos"]
        pts = [(rx, ry - RH / 2), (rx + RW / 2, ry), (rx, ry + RH / 2), (rx - RW / 2, ry)]
        d.polygon(pts, fill=TINT, outline=NAVY)
        d.line(pts + [pts[0]], fill=NAVY, width=3, joint="curve")
        centered(d, rel["name"], rx, ry, f_rel, NAVY)
    for text, (x, y) in notes:
        centered(d, text, x, y, f_note, MUTED)
    img.save(path)
    return path


def schema_diagram(path, tables, Wd=1600, Hd=420, caption=None, bw=300, bh=None):
    """tables: [(head, [(attr, "PK"|"FK"|""), ...], rgb)] drawn left to right with
    arrows in between - the 'split up' picture of a model."""
    img = Image.new("RGBA", (Wd, Hd), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f_head = font("Orbitron-Bold.ttf", 28)
    f_txt = font("Raleway-Medium.ttf", 26)
    f_tag = font("Orbitron-Bold.ttf", 18)
    f_small = font("Raleway-Regular.ttf", 24)
    n = len(tables)
    bh = bh or (100 + 52 * max(len(t[1]) for t in tables) + 10)
    y = 30
    gap = (Wd - 80 - n * bw) / max(n - 1, 1)
    xs = [40 + i * (bw + gap) for i in range(n)]
    for x, (head, attrs, col) in zip(xs, tables):
        box(d, (x, y, x + bw, y + bh))
        d.rounded_rectangle((x, y, x + bw, y + 64), radius=18, fill=col)
        d.rectangle((x, y + 40, x + bw, y + 64), fill=col)
        centered(d, head, x + bw / 2, y + 32, f_head, WHITE)
        for i, (name, tag) in enumerate(attrs):
            yy = y + 100 + i * 52
            d.text((x + 28, yy - 16), name, font=f_txt, fill=NAVY)
            if tag:
                tc = ORA if tag == "PK" else RD
                d.rounded_rectangle((x + bw - 84, yy - 16, x + bw - 24, yy + 16), radius=8, fill=tc)
                centered(d, tag, x + bw - 54, yy, f_tag, WHITE)
    a = 22
    for i in range(n - 1):
        arrow(d, (xs[i] + bw + a, y + bh / 2), (xs[i + 1] - a, y + bh / 2), MUTED, 4)
    if caption:
        centered(d, caption, Wd / 2, Hd - 40, f_small, MUTED)
    img.save(path)
    return path


def table_picture(path, head, attrs, color=ORA, bw=300):
    """A single table box (same look as schema_diagram) for rule slides."""
    bh = 100 + 52 * len(attrs) + 10
    return schema_diagram(path, [(head, attrs, color)], Wd=bw + 80, Hd=bh + 60, bw=bw, bh=bh)
