#!/usr/bin/env python3
"""Struktogramm (Nassi-Shneiderman) and Programmablaufplan drawings for the decks.

Both live here so every LB-2 deck draws the same shapes. Struktogramme lay
themselves out from a nested block list; PAPs get hand-placed nodes, because a
flowchart with a loop-back never survives auto-layout (same rule as er_diagrams).
Canvases are ~1600 px wide and land at ~816 pt on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageDraw
from diagrams import font, hexrgb, NAVY, BODY, MUTED, WHITE
from design_lib import ORANGE, RED, GREEN

ORA, RD, GRN = hexrgb(ORANGE), hexrgb(RED), hexrgb(GREEN)
TINT_O = (251, 235, 191)
TINT_R = (242, 207, 203)
TINT_G = (221, 232, 198)
TINT_B = (230, 236, 248)

F_TXT = lambda s=26: font("Raleway-Medium.ttf", s)
F_BOLD = lambda s=26: font("Raleway-SemiBold.ttf", s)
F_HEAD = lambda s=26: font("Orbitron-Bold.ttf", s)
PAD = 16


# ------------------------------------------------------------------ helpers ---
def wrap(d, text, fnt, w):
    """Greedy word wrap to width w (px). Returns list of lines."""
    words, lines, cur = text.split(), [], ""
    for word in words:
        trial = (cur + " " + word).strip()
        if d.textlength(trial, font=fnt) <= w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def _text_block(d, text, cx, cy, fnt, w, fill=NAVY):
    lines = wrap(d, text, fnt, w)
    lh = fnt.size * 1.3
    y = cy - lh * len(lines) / 2
    for line in lines:
        tw = d.textlength(line, font=fnt)
        d.text((cx - tw / 2, y), line, font=fnt, fill=fill)
        y += lh
    return lh * len(lines)


def _lines_h(d, text, fnt, w):
    return len(wrap(d, text, fnt, w)) * fnt.size * 1.3


# ------------------------------------------------------------ Struktogramm ---
# block forms:
#   ("do",    text)                       - one statement box
#   ("call",  text)                       - call of a subprogram (double side bars)
#   ("if",    cond, [then...], [else...]) - two-way decision, labels ja/nein
#   ("while", cond, [body...])            - head-controlled loop (frame left+top)
#   ("until", cond, [body...])            - foot-controlled loop (frame left+bottom)
#   ("for",   text, [body...])            - counting loop, drawn like while
MINH = 64
BAR = 34          # width of the loop frame bar


def _sg_height(d, blocks, w, fnt):
    h = 0
    for b in blocks:
        kind = b[0]
        if kind in ("do", "call"):
            h += max(MINH, _lines_h(d, b[1], fnt, w - 2 * PAD) + 2 * PAD)
        elif kind == "if":
            head = max(78, _lines_h(d, b[1], fnt, w - 2 * PAD) + 46)
            h += head + max(_sg_height(d, b[2], w / 2, fnt), _sg_height(d, b[3], w / 2, fnt))
        else:
            head = max(46, _lines_h(d, b[1], fnt, w - 2 * PAD) + 18)
            h += head + _sg_height(d, b[2], w - BAR, fnt)
    return h


def _sg_draw(d, blocks, x, y, w, fnt, colors):
    for b in blocks:
        kind = b[0]
        if kind in ("do", "call"):
            h = max(MINH, _lines_h(d, b[1], fnt, w - 2 * PAD) + 2 * PAD)
            d.rectangle([x, y, x + w, y + h], fill=WHITE, outline=NAVY, width=3)
            if kind == "call":                    # DIN 66261: Unterprogramm-Aufruf
                d.line([(x + 14, y), (x + 14, y + h)], fill=NAVY, width=3)
                d.line([(x + w - 14, y), (x + w - 14, y + h)], fill=NAVY, width=3)
            _text_block(d, b[1], x + w / 2, y + h / 2, fnt, w - 2 * PAD - 28)
            y += h
        elif kind == "if":
            head = max(78, _lines_h(d, b[1], fnt, w - 2 * PAD) + 46)
            hb = max(_sg_height(d, b[2], w / 2, fnt), _sg_height(d, b[3], w / 2, fnt))
            d.rectangle([x, y, x + w, y + head], fill=colors["if"], outline=NAVY, width=3)
            d.line([(x, y), (x + w / 2, y + head)], fill=NAVY, width=3)
            d.line([(x + w, y), (x + w / 2, y + head)], fill=NAVY, width=3)
            _text_block(d, b[1], x + w / 2, y + head * 0.32, F_BOLD(fnt.size), w * 0.62)
            f_small = F_TXT(fnt.size - 4)
            d.text((x + 12, y + head - f_small.size - 10), "ja", font=f_small, fill=BODY)
            nw = d.textlength("nein", font=f_small)
            d.text((x + w - nw - 12, y + head - f_small.size - 10), "nein", font=f_small, fill=BODY)
            y += head
            for i, branch in enumerate((b[2], b[3])):
                bx = x + i * w / 2
                d.rectangle([bx, y, bx + w / 2, y + hb], fill=WHITE, outline=NAVY, width=3)
                _sg_draw(d, branch, bx, y, w / 2, fnt, colors)
            y += hb
        else:
            head = max(46, _lines_h(d, b[1], fnt, w - 2 * PAD) + 18)
            hb = _sg_height(d, b[2], w - BAR, fnt)
            col = colors["loop"]
            if kind == "until":
                d.rectangle([x, y, x + w, y + hb + head], fill=col, outline=NAVY, width=3)
                _sg_draw(d, b[2], x + BAR, y, w - BAR, fnt, colors)
                _text_block(d, b[1], x + BAR + (w - BAR) / 2, y + hb + head / 2,
                            F_BOLD(fnt.size), w - BAR - 2 * PAD)
            else:
                d.rectangle([x, y, x + w, y + head + hb], fill=col, outline=NAVY, width=3)
                _text_block(d, b[1], x + w / 2, y + head / 2, F_BOLD(fnt.size), w - 2 * PAD)
                _sg_draw(d, b[2], x + BAR, y + head, w - BAR, fnt, colors)
            y += head + hb
    return y


def struktogramm(path, blocks, W=900, size=26, title=None, caption=None, pad=8):
    """Draw a Nassi-Shneiderman diagram; height follows the content."""
    probe = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    fnt = F_TXT(size)
    colors = {"if": TINT_O, "loop": TINT_B}
    inner = W - 2 * pad
    h = _sg_height(probe, blocks, inner, fnt)
    top = pad + (size * 1.5 + 14 if title else 0)
    H = int(top + h + pad + (size * 1.4 + 10 if caption else 0))
    img = Image.new("RGBA", (int(W), H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if title:
        d.text((pad, pad), title, font=F_HEAD(size), fill=NAVY)
    _sg_draw(d, blocks, pad, top, inner, fnt, colors)
    if caption:
        d.text((pad, top + h + 10), caption, font=F_TXT(size - 4), fill=MUTED)
    img.save(path)
    return path


# --------------------------------------------------------------------- PAP ---
# nodes: {key: {"pos": (cx, cy), "kind": ..., "text": ..., "w":, "h":, "color":}}
#   kinds: start, end (stadium) - proc (rectangle) - io (parallelogram)
#          dec (diamond) - con (small circle connector)
# edges: [(from, to, label, [waypoints...])] - waypoints are absolute (x, y)
KIND_FILL = {"start": TINT_G, "end": TINT_G, "proc": WHITE, "io": TINT_B,
             "dec": TINT_O, "con": WHITE}


def _node_edge(n, tx, ty):
    """Point where a line towards (tx, ty) leaves the node border."""
    cx, cy = n["pos"]
    w, h = n["w"], n["h"]
    dx, dy = tx - cx, ty - cy
    if n["kind"] == "dec":
        if dx == 0 and dy == 0:
            return cx, cy
        s = 1.0 / (abs(dx) / (w / 2) + abs(dy) / (h / 2))
        return cx + dx * s, cy + dy * s
    if dx == 0 and dy == 0:
        return cx, cy
    sx = (w / 2) / abs(dx) if dx else float("inf")
    sy = (h / 2) / abs(dy) if dy else float("inf")
    s = min(sx, sy)
    return cx + dx * s, cy + dy * s


def _poly_arrow(d, pts, color=NAVY, w=4, head=20):
    import math
    d.line(pts, fill=color, width=w, joint="curve")
    (x1, y1), (x2, y2) = pts[-2], pts[-1]
    ang = math.atan2(y2 - y1, x2 - x1)
    for s in (0.45, -0.45):
        d.line([(x2, y2), (x2 - head * math.cos(ang - s), y2 - head * math.sin(ang - s))],
               fill=color, width=w)


def pap(path, W, H, nodes, edges, notes=(), size=26):
    img = Image.new("RGBA", (int(W), int(H)), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    fnt, f_lab = F_TXT(size), F_TXT(size - 4)
    for key, n in nodes.items():
        n.setdefault("kind", "proc")
        n.setdefault("w", 320)
        n.setdefault("h", 92 if n["kind"] != "dec" else 150)

    # edges first, so the shapes sit on top of the line ends
    for src, dst, label, *rest in edges:
        way = rest[0] if rest else []
        a, b = nodes[src], nodes[dst]
        first = way[0] if way else b["pos"]
        last = way[-1] if way else a["pos"]
        p1 = _node_edge(a, *first)
        p2 = _node_edge(b, *last)
        pts = [p1] + list(way) + [p2]
        _poly_arrow(d, pts, color=BODY)
        if label:
            # put it on the longest segment, so a poly-line labels itself sensibly
            seg = max(zip(pts, pts[1:]), key=lambda ab: (ab[0][0] - ab[1][0]) ** 2
                      + (ab[0][1] - ab[1][1]) ** 2)
            mx, my = (seg[0][0] + seg[1][0]) / 2, (seg[0][1] + seg[1][1]) / 2
            tw = d.textlength(label, font=f_lab)
            d.rectangle([mx - tw / 2 - 6, my - f_lab.size * 0.75,
                         mx + tw / 2 + 6, my + f_lab.size * 0.75], fill=WHITE)
            d.text((mx - tw / 2, my - f_lab.size * 0.6), label, font=f_lab, fill=BODY)

    for key, n in nodes.items():
        cx, cy = n["pos"]
        w, h, kind = n["w"], n["h"], n["kind"]
        l, t, r, b = cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2
        fill = n.get("color", KIND_FILL[kind])
        if kind in ("start", "end"):
            d.rounded_rectangle([l, t, r, b], radius=h / 2, fill=fill, outline=NAVY, width=3)
        elif kind == "dec":
            d.polygon([(cx, t), (r, cy), (cx, b), (l, cy)], fill=fill, outline=NAVY)
            d.line([(cx, t), (r, cy), (cx, b), (l, cy), (cx, t)], fill=NAVY, width=3)
        elif kind == "io":
            sk = h * 0.34
            d.polygon([(l + sk, t), (r, t), (r - sk, b), (l, b)], fill=fill, outline=NAVY)
            d.line([(l + sk, t), (r, t), (r - sk, b), (l, b), (l + sk, t)], fill=NAVY, width=3)
        elif kind == "con":
            d.ellipse([l, t, r, b], fill=fill, outline=NAVY, width=3)
        else:
            d.rectangle([l, t, r, b], fill=fill, outline=NAVY, width=3)
        inner = w - 30 if kind != "dec" else w * 0.72
        _text_block(d, n["text"], cx, cy, fnt, inner)

    for text, (x, y) in notes:
        d.text((x, y), text, font=F_TXT(size - 4), fill=MUTED)
    img.save(path)
    return path


# ----------------------------------------------------------------- GRAFCET ---
def grafcet(path, steps, W=1000, size=26, loop_back=True, caption=None):
    """steps: [(nr, action_or_None, transition_condition), ...] top to bottom.
    Step 0 is drawn as the initial step (double square). The chain loops back
    from the last transition to the first step when loop_back is set."""
    S = 92                      # step square
    GAP = 96                    # step bottom to next step top
    cx = 300
    top = 40
    H = int(top + len(steps) * (S + GAP) + 40 + (size * 1.6 if caption else 0))
    img = Image.new("RGBA", (int(W), H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f_nr, f_txt, f_cond = F_HEAD(size), F_TXT(size), F_TXT(size - 2)
    ys = []
    for i, (nr, action, cond) in enumerate(steps):
        y = top + i * (S + GAP)
        ys.append(y)
        d.rectangle([cx - S / 2, y, cx + S / 2, y + S], fill=TINT_B, outline=NAVY, width=3)
        if i == 0:
            d.rectangle([cx - S / 2 + 9, y + 9, cx + S / 2 - 9, y + S - 9], outline=NAVY, width=3)
        _text_block(d, str(nr), cx, y + S / 2, f_nr, S)
        if action:
            ax, aw = cx + S / 2 + 46, 470
            ah = max(64, _lines_h(d, action, f_txt, aw - 24) + 26)
            d.line([(cx + S / 2, y + S / 2), (ax, y + S / 2)], fill=BODY, width=3)
            d.rectangle([ax, y + S / 2 - ah / 2, ax + aw, y + S / 2 + ah / 2],
                        fill=WHITE, outline=NAVY, width=3)
            _text_block(d, action, ax + aw / 2, y + S / 2, f_txt, aw - 24)
        # transition below the step
        ty = y + S + GAP / 2
        d.line([(cx, y + S), (cx, y + S + GAP)], fill=BODY, width=3)
        d.line([(cx - 46, ty), (cx + 46, ty)], fill=NAVY, width=5)
        d.text((cx + 60, ty - f_cond.size * 0.7), cond, font=f_cond, fill=BODY)
    if loop_back:
        y0, y1 = ys[0], ys[-1] + S + GAP
        lx = cx - 210
        d.line([(cx, y1), (lx, y1), (lx, y0 + S / 2), (cx - S / 2, y0 + S / 2)],
               fill=BODY, width=3, joint="curve")
        _poly_arrow(d, [(lx, y0 + S / 2), (cx - S / 2, y0 + S / 2)], color=BODY)
    if caption:
        d.text((20, H - size * 1.5), caption, font=F_TXT(size - 4), fill=MUTED)
    img.save(path)
    return path


# ------------------------------------------------------------- box model ---
def box_model(path, W=1180, H=560, size=26):
    """The CSS box model as four nested frames - margin, border, padding, content."""
    img = Image.new("RGBA", (int(W), int(H)), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f, f_small = F_BOLD(size), F_TXT(size - 3)
    layers = [("margin", TINT_B, 0), ("border", TINT_O, 78), ("padding", TINT_G, 156)]
    for name, col, inset in layers:
        d.rectangle([20 + inset, 20 + inset, W - 20 - inset, H - 20 - inset],
                    fill=col, outline=NAVY, width=3)
        d.text((34 + inset, 32 + inset), name, font=f_small, fill=BODY)
    d.rectangle([20 + 234, 20 + 234, W - 20 - 234, H - 20 - 234],
                fill=WHITE, outline=NAVY, width=3)
    _text_block(d, "content", W / 2, H / 2, f, 300)
    img.save(path)
    return path
