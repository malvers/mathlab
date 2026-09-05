#!/usr/bin/env python3
"""UML class diagrams for the OOP decks - class boxes, inheritance, association.

Boxes are placed by hand (top-left corner) like the ER diagrams; auto-layout of a
class tree looks tidy in theory and crooked on a slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw
from diagrams import font, hexrgb, NAVY, BODY, MUTED, WHITE
from design_lib import ORANGE, RED, GREEN

ORA, RD, GRN = hexrgb(ORANGE), hexrgb(RED), hexrgb(GREEN)
NAVY_FILL = (230, 236, 248)

F_NAME = lambda s=27: font("Orbitron-Bold.ttf", s)
F_ROW = lambda s=25: font("Raleway-Medium.ttf", s)
F_LAB = lambda s=23: font("Raleway-Regular.ttf", s)

ROW_H = 44
HEAD_H = 70
PADX = 22


def _box_size(c, d):
    n = len(c.get("attrs", [])) + len(c.get("methods", []))
    return c.get("w", 380), HEAD_H + n * ROW_H + 26


def _draw_class(d, c):
    x, y = c["pos"]
    w, h = _box_size(c, d)
    col = c.get("color", NAVY)
    d.rectangle([x, y, x + w, y + h], fill=WHITE, outline=NAVY, width=3)
    d.rectangle([x, y, x + w, y + HEAD_H], fill=col, outline=NAVY, width=3)
    f = F_NAME()
    tw = d.textlength(c["name"], font=f)
    d.text((x + w / 2 - tw / 2, y + HEAD_H / 2 - f.size * 0.62), c["name"], font=f, fill=WHITE)
    yy = y + HEAD_H + 12
    f_row = F_ROW()
    for a in c.get("attrs", []):
        d.text((x + PADX, yy), a, font=f_row, fill=NAVY)
        yy += ROW_H
    if c.get("attrs") and c.get("methods"):
        d.line([(x, yy - 8), (x + w, yy - 8)], fill=NAVY, width=3)
        yy += 6
    for m in c.get("methods", []):
        d.text((x + PADX, yy), m, font=f_row, fill=BODY)
        yy += ROW_H
    return x, y, w, h


def _edge_point(rect, tx, ty):
    x, y, w, h = rect
    cx, cy = x + w / 2, y + h / 2
    dx, dy = tx - cx, ty - cy
    if dx == 0 and dy == 0:
        return cx, cy
    sx = (w / 2) / abs(dx) if dx else float("inf")
    sy = (h / 2) / abs(dy) if dy else float("inf")
    s = min(sx, sy)
    return cx + dx * s, cy + dy * s


def _triangle(d, tip, frm, size=26):
    import math
    ang = math.atan2(tip[1] - frm[1], tip[0] - frm[0])
    p1 = (tip[0] - size * math.cos(ang - 0.42), tip[1] - size * math.sin(ang - 0.42))
    p2 = (tip[0] - size * math.cos(ang + 0.42), tip[1] - size * math.sin(ang + 0.42))
    d.polygon([tip, p1, p2], fill=WHITE, outline=NAVY)
    d.line([tip, p1, p2, tip], fill=NAVY, width=3)
    return ((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2)


def uml_diagram(path, classes, edges=(), W=1600, H=900, caption=None, notes=()):
    """classes: {key: {"pos": (x, y) top-left, "name":, "attrs": [], "methods": [],
                       "w":, "color":}}
    edges: [(child, parent, kind, label)] - kind "inherit" (hollow triangle at the
    parent) or "assoc" (plain line with an optional label)."""
    img = Image.new("RGBA", (int(W), int(H)), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    rects = {}
    for key, c in classes.items():
        w, h = _box_size(c, d)
        rects[key] = (c["pos"][0], c["pos"][1], w, h)
    f_lab = F_LAB()
    for child, parent, *rest in edges:
        kind = rest[0] if rest else "inherit"
        label = rest[1] if len(rest) > 1 else ""
        rc, rp = rects[child], rects[parent]
        cc = (rc[0] + rc[2] / 2, rc[1] + rc[3] / 2)
        cp = (rp[0] + rp[2] / 2, rp[1] + rp[3] / 2)
        p1 = _edge_point(rc, *cp)
        p2 = _edge_point(rp, *cc)
        if kind == "inherit":
            base = _triangle(d, p2, p1)
            d.line([p1, base], fill=NAVY, width=3)
        else:
            d.line([p1, p2], fill=BODY, width=3)
        if label:
            mx, my = (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2
            tw = d.textlength(label, font=f_lab)
            d.rectangle([mx - tw / 2 - 8, my - f_lab.size * 0.8,
                         mx + tw / 2 + 8, my + f_lab.size * 0.8], fill=WHITE)
            d.text((mx - tw / 2, my - f_lab.size * 0.6), label, font=f_lab, fill=BODY)
    for key, c in classes.items():
        _draw_class(d, c)
    for text, (x, y) in notes:
        d.text((x, y), text, font=F_LAB(), fill=MUTED)
    if caption:
        tw = d.textlength(caption, font=f_lab)
        d.text((W / 2 - tw / 2, H - f_lab.size * 1.6), caption, font=f_lab, fill=MUTED)
    img.save(path)
    return path
