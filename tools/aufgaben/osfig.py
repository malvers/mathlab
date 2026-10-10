#!/usr/bin/env python3
"""Small figures for the Oberschule sheets (tools/aufgaben/mathe6, mathe7, ...), built on
svgfig.Canvas so they share the palette and fonts of every other sheet.

    from osfig import zahlenstrahl
    fig = zahlenstrahl(0, 2, 4, [(F(7, 4), '?')])
"""
from fractions import Fraction
from svgfig import Canvas, Plot, Solid, INK, MUTED, RED, BODY, ORANGE, GREEN, PAPER


def zahlenstrahl(lo, hi, n, marks=(), labels=None, w=380, label='Zahlenstrahl'):
    """Number line from lo to hi (integers) with n parts per unit.
    marks = [(value, text)]: red dots with their text above; labels = the integers that get
    a number below (default: all of them)."""
    pad = 22
    unit = (w - 2 * pad) / float(hi - lo)
    h = 84
    y = 46
    X = lambda v: pad + (float(Fraction(v)) - lo) * unit
    c = Canvas(w, h)
    c.arrow(pad - 10, y, w - 8, y, INK, 1.4)
    for k in range((hi - lo) * n + 1):
        v = lo + Fraction(k, n)
        big = v.denominator == 1
        c.line(X(v), y - (9 if big else 5), X(v), y + (9 if big else 5), INK if big else MUTED,
               1.5 if big else 1.0)
        if big and (labels is None or int(v) in labels):
            c.text(X(v), y + 30, str(int(v)).replace('-', '−'), 17, BODY)
    for v, text in marks:
        c.circle(X(v), y, 5, RED)
        if text:
            c.text(X(v), y - 16, text, 17, RED, weight='600')
    svg = c.svg(label)
    assert "'" not in svg
    return svg


def pfeildiagramm(left, right, pairs, titles=('', ''), w=360, label='Pfeildarstellung'):
    """Arrow diagram of an assignment: two ovals with the elements of `left` and `right`,
    pairs = [(i, j)] draws an arrow from left[i] to right[j]."""
    rows = max(len(left), len(right))
    gap = 38
    top = 46 if any(titles) else 26
    h = top + rows * gap + 14
    xl, xr = w * 0.24, w * 0.76
    c = Canvas(w, h)
    for x, items, title in ((xl, left, titles[0]), (xr, right, titles[1])):
        oh = rows * gap / 2.0 + 10
        cy = top + rows * gap / 2.0 - 4
        c.raw('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="#EEF2F8" stroke="%s" stroke-width="1.2"/>'
              % (x, cy, w * 0.15, oh, MUTED))
        if title:
            c.text(x, 18, title, 14, BODY, weight='600')
    ly = lambda items, k: top + (rows - len(items)) * gap / 2.0 + k * gap + 10
    for k, s in enumerate(left):
        c.text(xl, ly(left, k) + 5, s, 15, INK)
    for k, s in enumerate(right):
        c.text(xr, ly(right, k) + 5, s, 15, INK)
    for i, j in pairs:
        y1, y2 = ly(left, i), ly(right, j)
        c.arrow(xl + w * 0.09, y1, xr - w * 0.135, y2, RED, 1.5)
    svg = c.svg(label)
    assert "'" not in svg
    return svg


def graph(pts, xlim, ylim, xstep, ystep, xlabel='x', ylabel='y', join=True, dots=True,
          w=380, h=280, label='Graph einer Zuordnung'):
    """A graph in the first quadrant on a grid: pts = [(x, y)] as dots, joined by a
    line when join=True (continuous quantities) and left as dots for counted ones.
    The axes sit on the lower left corner of the window, so a time axis may start at 6 Uhr."""
    p = Plot(xlim, ylim, w=w, h=h, pad=(44, 40, 30, 34))
    p.grid(xstep, ystep)
    x0, y0 = xlim[0], ylim[0]
    p.arrow(p.X(x0), p.Y(y0), p.X(xlim[1]) + 12, p.Y(y0), INK, 1.3)
    p.arrow(p.X(x0), p.Y(y0), p.X(x0), p.Y(ylim[1]) - 12, INK, 1.3)
    p.text(p.X(xlim[1]) + 10, p.Y(y0) - 9, xlabel, 13, INK, 'middle')
    p.text(p.X(x0), p.Y(ylim[1]) - 17, ylabel, 13, INK, 'middle')
    if join:
        p.path('M ' + ' L '.join('%.1f %.1f' % p.P(x, y) for x, y in pts), stroke=RED, width=2.2)
    if dots:
        for x, y in pts:
            p.point(x, y)
    fmtn = lambda v: ('%g' % v).replace('.', ',')
    k = 0
    while x0 + k * xstep <= xlim[1] + 1e-9:
        u = x0 + k * xstep
        p.line(p.X(u), p.Y(y0) - 3.5, p.X(u), p.Y(y0) + 3.5, INK, 1.1)
        p.text(p.X(u), p.Y(y0) + 18, fmtn(u), 12.5, BODY, 'middle', halo=PAPER)
        k += 1
    k = 1
    while y0 + k * ystep <= ylim[1] + 1e-9:
        v = y0 + k * ystep
        p.line(p.X(x0) - 3.5, p.Y(v), p.X(x0) + 3.5, p.Y(v), INK, 1.1)
        p.text(p.X(x0) - 7, p.Y(v) + 4.5, fmtn(v), 12.5, BODY, 'end', halo=PAPER)
        k += 1
    svg = p.svg(label)
    assert "'" not in svg
    return svg


# ------------------------------------------------------------- geometry ----
import math as _m


def _arc_label(c, cx, cy, r, a0, a1, text, color, lr=15):
    """Angle arc from direction a0 to a1 (degrees, counter-clockwise, y up) with its text."""
    if a1 < a0:
        a1 += 360
    c.arc(cx, cy, r, a0, a1, color, 1.5)
    if text:
        mid = _m.radians((a0 + a1) / 2.0)
        c.text(cx + (r + lr) * _m.cos(mid), cy - (r + lr) * _m.sin(mid) + 5, text, 15, color,
               weight='600', halo=PAPER)


def _cross(c, cx, cy, a, labels, r, color=RED):
    """Four angles at a crossing of a horizontal line and a line at a degrees:
    0 = upper right, 1 = upper left, 2 = lower left, 3 = lower right."""
    bounds = [(0, a), (a, 180), (180, 180 + a), (180 + a, 360)]
    for k, text in labels.items():
        a0, a1 = bounds[k]
        _arc_label(c, cx, cy, r, a0, a1, text, color)


def geradenkreuz(a, labels, w=320, h=220, label='Zwei sich schneidende Geraden'):
    """Two lines crossing at the centre, one horizontal, one at a degrees.
    labels = {position: text}, positions as in _cross."""
    c = Canvas(w, h)
    cx, cy, L = w / 2.0, h / 2.0, min(w, h) * 0.62
    t = _m.radians(a)
    c.line(cx - L, cy, cx + L, cy, INK, 1.8)
    c.line(cx - L * 0.8 * _m.cos(t), cy + L * 0.8 * _m.sin(t), cx + L * 0.8 * _m.cos(t), cy - L * 0.8 * _m.sin(t), INK, 1.8)
    _cross(c, cx, cy, a, labels, 26)
    c.circle(cx, cy, 3.4, INK)
    svg = c.svg(label)
    assert "'" not in svg
    return svg


def parallelen(a, top, bottom, w=340, h=250, names=('g', 'h'), label='Zwei Parallelen und eine schneidende Gerade'):
    """Parallels g (top) and h (bottom), cut by a line at a degrees.
    top / bottom = {position: text} for the four angles at each crossing (see _cross)."""
    c = Canvas(w, h)
    y1, y2 = h * 0.32, h * 0.72
    t = _m.radians(a)
    dx = (y2 - y1) / _m.tan(t)
    x1 = w / 2.0 + dx / 2.0
    x2 = w / 2.0 - dx / 2.0
    for y, n in ((y1, names[0]), (y2, names[1])):
        c.line(18, y, w - 18, y, INK, 1.8)
        c.text(w - 12, y - 8, n, 15, INK, 'end', italic=True)
    ext = (h * 0.22) / _m.sin(t)
    c.line(x2 - ext * _m.cos(t), y2 + ext * _m.sin(t), x1 + ext * _m.cos(t), y1 - ext * _m.sin(t), INK, 1.8)
    _cross(c, x1, y1, a, top, 24)
    _cross(c, x2, y2, a, bottom, 24, GREEN)
    svg = c.svg(label)
    assert "'" not in svg
    return svg


def vieleck(pts, w=340, h=240, names=None, sides=(), angles=(), right=(), extra=(), fill='#FDF3D6',
            label='Vieleck'):
    """A polygon given counter-clockwise in units with y up, fitted into w x h.
    names = vertex letters; sides = [(i, text)] for the side from vertex i to i+1;
    angles = [(i, text)] arcs inside at vertex i; right = [i] right-angle squares;
    extra = [((x1, y1), (x2, y2), text)] dashed helper segments such as heights."""
    xs = [p[0] for p in pts] + [q[k][0] for q in extra for k in (0, 1)]
    ys = [p[1] for p in pts] + [q[k][1] for q in extra for k in (0, 1)]
    n = len(pts)
    gx = sum(p[0] for p in pts) / float(n)
    gy = sum(p[1] for p in pts) / float(n)
    # labels of helper segments sit to their right; near the right border leave room for them
    pad, pad_l, pad_r = 34, 34, 34
    span = float(max(xs) - min(xs) or 1)
    for (p, q, text) in extra:
        if text and (p[0] + q[0]) / 2.0 > max(xs) - 0.3 * span:
            pad_r = max(pad_r, 18 + 8 * len(text))
    for i, text in sides:
        a, b = pts[i], pts[(i + 1) % n]
        nx = (b[1] - a[1]) / (_m.hypot(b[0] - a[0], b[1] - a[1]) or 1)
        if nx < -0.5:
            pad_l = max(pad_l, 14 + 8 * len(text))
        elif nx > 0.5:
            pad_r = max(pad_r, 14 + 8 * len(text))
    s = min((w - pad_l - pad_r) / float(max(xs) - min(xs) or 1), (h - 2 * pad) / float(max(ys) - min(ys) or 1))
    ox = pad_l + (w - pad_l - pad_r - s * (max(xs) - min(xs))) / 2.0 - s * min(xs)
    oy = (h + s * (max(ys) - min(ys))) / 2.0 + s * min(ys)
    P = lambda p: (ox + s * p[0], oy - s * p[1])
    c = Canvas(w, h)
    c.poly([P(p) for p in pts], stroke=INK, width=1.8, fill=fill)
    for (p, q, text) in extra:
        c.line(P(p)[0], P(p)[1], P(q)[0], P(q)[1], MUTED, 1.4, dash='5 4')
        if text:
            if abs(p[1] - q[1]) < 1e-9:
                # horizontal: above the line, three quarters along, clear of a crossing in the middle
                mx, my = P((p[0] + 0.75 * (q[0] - p[0]), p[1]))
                c.text(mx, my - 8, text, 15, MUTED, 'middle', italic=len(text) == 1, halo=PAPER)
            else:
                mx, my = P(((p[0] + q[0]) / 2.0, (p[1] + q[1]) / 2.0))
                c.text(mx + 9, my + 5, text, 15, MUTED, 'start', italic=len(text) == 1, halo=PAPER)
    for i, text in sides:
        a, b = pts[i], pts[(i + 1) % n]
        dx, dy = b[0] - a[0], b[1] - a[1]
        ln = _m.hypot(dx, dy)
        nx, ny = dy / ln, -dx / ln
        mx, my = P(((a[0] + b[0]) / 2.0, (a[1] + b[1]) / 2.0))
        anchor = 'start' if nx > 0.5 else 'end' if nx < -0.5 else 'middle'
        dist = 8 if anchor != 'middle' else 14
        c.text(mx + dist * nx, my - dist * ny + 5 + (4 if ny < -0.5 else 0), text, 15, INK, anchor,
               italic=len(text) == 1, halo=PAPER)
    deg = lambda u, v: _m.degrees(_m.atan2(v[1] - u[1], v[0] - u[0]))
    for i, text in angles:
        prv, cur, nxt = pts[i - 1], pts[i], pts[(i + 1) % n]
        x, y = P(cur)
        _arc_label(c, x, y, 22, deg(cur, nxt), deg(cur, prv), text, RED, lr=14)
    for i in right:
        prv, cur, nxt = pts[i - 1], pts[i], pts[(i + 1) % n]
        x, y = P(cur)
        u = [(nxt[0] - cur[0]), -(nxt[1] - cur[1])]
        v = [(prv[0] - cur[0]), -(prv[1] - cur[1])]
        lu, lv = _m.hypot(*u), _m.hypot(*v)
        u = [10 * k / lu for k in u]
        v = [10 * k / lv for k in v]
        c.poly([(x + u[0], y + u[1]), (x + u[0] + v[0], y + u[1] + v[1]), (x + v[0], y + v[1])],
               stroke=RED, width=1.3, close=False)
        c.circle(x + (u[0] + v[0]) / 2.0, y + (u[1] + v[1]) / 2.0, 1.4, RED, RED, 0)
    if names:
        for k, (p, nm) in enumerate(zip(pts, names)):
            dx, dy = p[0] - gx, p[1] - gy
            ln = _m.hypot(dx, dy) or 1
            x, y = P(p)
            c.text(x + 15 * dx / ln, y - 15 * dy / ln + 5, nm, 16, INK, 'middle', weight='600')
    svg = c.svg(label)
    assert "'" not in svg
    return svg


# --------------------------------------------------------------- solids ----
def _solid(points, w, h, padx=52, pady=30):
    """A svgfig.Solid whose scale and origin fit all 3-D points into w x h, with room
    for edge labels left and right."""
    probe = Solid(w, h, scale=1, ox=0, oy=0)
    xy = [probe.P(q) for q in points]
    xs, ys = [a for a, _ in xy], [b for _, b in xy]
    sc = min((w - 2 * padx) / (max(xs) - min(xs)), (h - 2 * pady) / (max(ys) - min(ys)))
    ox = (w - sc * (max(xs) + min(xs))) / 2.0
    oy = (h - sc * (max(ys) + min(ys))) / 2.0
    return Solid(w, h, scale=sc, ox=ox, oy=oy)


def koerper(V, faces, labels=(), w=340, h=240, label='Körper', extra=()):
    """Convex solid from vertices V (x towards the viewer, y right, z up) and faces (lists of
    vertex indices). A face is visible when its outward normal points towards the viewer;
    edges of visible faces are solid, all others dashed. labels = [(point, text, dx, dy, anchor)];
    extra = [(p, q)] thin dashed helper segments such as a height."""
    f = _solid(V, w, h)
    d = (1.0, -f.kx, -f.ky)  # direction that the oblique projection maps to a point
    cen = [sum(v[k] for v in V) / float(len(V)) for k in range(3)]
    vis = []
    for fc in faces:
        p0, p1, p2 = V[fc[0]], V[fc[1]], V[fc[2]]
        u = [p1[k] - p0[k] for k in range(3)]
        v = [p2[k] - p0[k] for k in range(3)]
        n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
        fcen = [sum(V[i][k] for i in fc) / float(len(fc)) for k in range(3)]
        if sum(n[k] * (fcen[k] - cen[k]) for k in range(3)) < 0:
            n = [-x for x in n]
        vis.append(sum(n[k] * d[k] for k in range(3)) > 1e-9)
    shades = [0.42, 0.30, 0.18, 0.24, 0.36]
    for k, (fc, on) in enumerate(zip(faces, vis)):
        if on:
            f.shade([V[i] for i in fc], opacity=shades[k % len(shades)])
    edges = {}
    for fc, on in zip(faces, vis):
        for i, j in zip(fc, fc[1:] + fc[:1]):
            key = (min(i, j), max(i, j))
            edges[key] = edges.get(key, False) or on
    for (i, j), on in edges.items():
        if not on:
            f.edge(V[i], V[j], MUTED, 1.2, '4 3')
    for p, q in extra:
        f.edge(p, q, MUTED, 1.2, '3 3')
    for (i, j), on in edges.items():
        if on:
            f.edge(V[i], V[j], INK, 1.6)
    for pt, text, dx, dy, anchor in labels:
        f.label3(pt, text, dx, dy, 15, INK, anchor)
    svg = f.svg(label)
    assert "'" not in svg
    return svg


def prisma(base, L, labels=(), extra=(), w=340, h=240, label='Prisma'):
    """Right prism: base polygon [(y, z)] in true shape at the front (x = L), extruded back
    to x = 0. Returns the SVG; labels / extra as in koerper."""
    n = len(base)
    V = [(L, y, z) for y, z in base] + [(0, y, z) for y, z in base]
    faces = [list(range(n)), list(range(n, 2 * n))]
    faces += [[i, (i + 1) % n, n + (i + 1) % n, n + i] for i in range(n)]
    return koerper(V, faces, labels, w, h, label, extra)


def quader(l, b, hh, labels=None, w=340, h=240, label='Quader'):
    """Cuboid: length l to the right, depth b towards the viewer, height hh.
    labels = (text for l, text for b, text for hh) at the front edges, or None."""
    lab = []
    if labels:
        tl, tb, th = labels
        if tl:
            lab.append(((b, l / 2.0, 0), tl, 0, 19, 'middle'))
        if tb:
            lab.append(((b / 2.0, l, 0), tb, 12, 14, 'start'))
        if th:
            lab.append(((b, 0, hh / 2.0), th, -9, 5, 'end'))
    return prisma([(0, 0), (l, 0), (l, hh), (0, hh)], b, lab, (), w, h, label)


def wuerfelbau(cubes, w=320, h=240, label='Körper aus Würfeln'):
    """Unit cubes at integer cells (x towards the viewer, y to the right, z up), drawn
    back to front with their three visible faces."""
    pts = [(x + i, y + j, z + k) for x, y, z in cubes for i in (0, 1) for j in (0, 1) for k in (0, 1)]
    f = _solid(pts, w, h)
    for x, y, z in sorted(cubes):
        X, Y, Z = x + 1, y + 1, z + 1
        f.face([(X, y, z), (X, Y, z), (X, Y, Z), (X, y, Z)], fill='#F8DA8A', opacity=1, width=1.3)
        f.face([(x, y, Z), (X, y, Z), (X, Y, Z), (x, Y, Z)], fill='#FCEFC7', opacity=1, width=1.3)
        f.face([(x, Y, z), (X, Y, z), (X, Y, Z), (x, Y, Z)], fill='#E9B949', opacity=1, width=1.3)
    svg = f.svg(label)
    assert "'" not in svg
    return svg


def netz(cells, unit=46, marks=None, label='Körpernetz'):
    """Net of squares on a grid: cells = [(col, row)], row 0 on top; marks = {cell: text}."""
    cols = max(c for c, _ in cells) + 1
    rows = max(r for _, r in cells) + 1
    c = Canvas(cols * unit + 24, rows * unit + 24)
    for col, row in cells:
        c.rect(12 + col * unit, 12 + row * unit, unit, unit, fill='#FDF3D6', stroke=INK, width=1.5)
        if marks and (col, row) in marks:
            c.text(12 + (col + 0.5) * unit, 12 + (row + 0.5) * unit + 6, marks[(col, row)], 17, RED, weight='600')
    svg = c.svg(label)
    assert "'" not in svg
    return svg


def dachprisma(g, hd, L, labels=None, w=340, h=240, label='Dreiecksprisma'):
    """Triangular prism like a roof: the triangle (base g, height hd) at the front in true
    shape, length L towards the back. labels = (text for g, text for hd, text for L)."""
    lab, extra = [], []
    if labels:
        tg, th, tL = labels
        if tg:
            lab.append(((L, g / 2.0, 0), tg, 0, 19, 'middle'))
        if th:
            extra.append(((L, g / 2.0, 0), (L, g / 2.0, hd)))
            lab.append(((L, g / 2.0, hd / 3.0), th, 6, 5, 'start'))
        if tL:
            lab.append(((L / 2.0, g, 0), tL, 12, 14, 'start'))
    return prisma([(0, 0), (g, 0), (g / 2.0, hd)], L, lab, extra, w, h, label)


BLUE = '#2E6BC6'


def gluecksrad(sectors, w=260, label='Glücksrad'):
    """Wheel of fortune: sectors = [(text, fill)] of equal size, clockwise from 12 o'clock,
    with a pointer on top."""
    c = Canvas(w, w + 16)
    cx, cy, r = w / 2.0, w / 2.0 + 14, w / 2.0 - 16
    k = 360.0 / len(sectors)
    for i, (text, fill) in enumerate(sectors):
        c.sector(cx, cy, r, i * k, (i + 1) * k, fill=fill, opacity=0.85, stroke=PAPER, width=2,
                 label=text, lcolor=INK, lsize=16, lr=0.68)
    c.raw('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="%s" stroke-width="1.6"/>' % (cx, cy, r, INK))
    c.circle(cx, cy, 5, INK, PAPER, 1.4)
    c.poly([(cx - 9, 4), (cx + 9, 4), (cx, 22)], stroke=INK, width=1.2, fill=INK)
    svg = c.svg(label)
    assert "'" not in svg
    return svg


TANGRAM = [  # the seven tans in a 4 x 4 square, counter-clockwise
    ('großes Dreieck', [(0, 4), (2, 2), (4, 4)]),
    ('großes Dreieck', [(0, 0), (2, 2), (0, 4)]),
    ('mittleres Dreieck', [(2, 0), (4, 0), (4, 2)]),
    ('kleines Dreieck', [(4, 2), (4, 4), (3, 3)]),
    ('Quadrat', [(2, 2), (3, 1), (4, 2), (3, 3)]),
    ('kleines Dreieck', [(1, 1), (3, 1), (2, 2)]),
    ('Parallelogramm', [(0, 0), (2, 0), (3, 1), (1, 1)]),
]


def tangram(w=240, numbers=True, label='Tangram'):
    """The classic tangram square with its seven pieces, optionally numbered 1 to 7."""
    fills = ['#F5C242', '#E9B949', '#799E31', '#B02418', '#2E6BC6', '#C97B2A', '#8E6BBF']
    s = (w - 20) / 4.0
    c = Canvas(w, w)
    P = lambda p: (10 + s * p[0], w - 10 - s * p[1])
    for k, (_, pts) in enumerate(TANGRAM):
        c.poly([P(p) for p in pts], stroke=PAPER, width=2.4, fill=fills[k], opacity=0.9)
        if numbers:
            cx = sum(p[0] for p in pts) / float(len(pts))
            cy = sum(p[1] for p in pts) / float(len(pts))
            x, y = P((cx, cy))
            c.text(x, y + 6, str(k + 1), 17, PAPER, weight='700')
    svg = c.svg(label)
    assert "'" not in svg
    return svg


PIE = ['#F5C242', '#2E6BC6', '#799E31', '#B02418', '#8E6BBF', '#C97B2A']


def kreisdiagramm(parts, w=360, label='Kreisdiagramm'):
    """Pie chart: parts = [(name, percent)], clockwise from 12 o'clock; the percent sits in
    the sector, the names in a legend on the right."""
    h = 220
    c = Canvas(w, h)
    cx, cy, r = 105, h / 2.0, 92
    a = 0.0
    for k, (name, pct) in enumerate(parts):
        d = 3.6 * float(pct)
        c.sector(cx, cy, r, a, a + d, fill=PIE[k % len(PIE)], opacity=0.9, stroke=PAPER, width=2,
                 label=('%g %%' % pct).replace('.', ','), lcolor=INK, lsize=13.5, lr=0.66)
        a += d
    c.legend(222, cy - 9 * len(parts) + 9, [(name, PIE[k % len(PIE)], 'fill') for k, (name, _) in enumerate(parts)],
             size=13.5, gap=22, box=False)
    svg = c.svg(label)
    assert "'" not in svg
    return svg


def saeulen(labels, values, ystep, ymax=None, xlabel='', ylabel='', w=360, h=250, label='Säulendiagramm',
            ymin=0):
    """Bar chart with one bar per label; values are drawn to scale on a grid with ystep.
    ymin > 0 cuts the axis (to show how such a chart misleads)."""
    ymax = ymax or (max(values) // ystep + 1) * ystep
    pl, pr, pt, pb = 40, 14, 26, 40
    c = Canvas(w, h)
    Y = lambda v: h - pb - (h - pt - pb) * float(v - ymin) / (ymax - ymin)
    slot = (w - pl - pr) / float(len(values))
    k = 0
    while ymin + k * ystep <= ymax + 1e-9:
        v = ymin + k * ystep
        c.line(pl, Y(v), w - pr, Y(v), '#DCE4F0', 1)
        c.text(pl - 7, Y(v) + 4.5, ('%g' % v).replace('.', ','), 12.5, BODY, 'end')
        k += 1
    for i, (lab, v) in enumerate(zip(labels, values)):
        x = pl + slot * (i + 0.18)
        c.rect(x, Y(v), slot * 0.64, Y(ymin) - Y(v), fill=ORANGE, stroke=INK, width=1)
        c.text(pl + slot * (i + 0.5), h - pb + 18, str(lab), 13.5, INK)
    c.line(pl, Y(ymin), w - pr, Y(ymin), INK, 1.4)
    c.line(pl, Y(ymin), pl, pt - 6, INK, 1.4)
    if ylabel:
        c.text(pl, pt - 12, ylabel, 12.5, INK, 'middle')
    if xlabel:
        c.text((pl + w - pr) / 2.0, h - 6, xlabel, 12.5, INK)
    svg = c.svg(label)
    assert "'" not in svg
    return svg


def koordinaten(points, lim=5, w=320, polygon=None, label='Koordinatensystem'):
    """Square coordinate system from -lim to lim with axes through the origin; points =
    [(x, y, name)] drawn red with their name; polygon = list of (x, y) joined in order."""
    p = Plot((-lim - 0.6, lim + 0.6), (-lim - 0.6, lim + 0.6), w=w, h=w, pad=(14, 14, 14, 14))
    p.grid(1, 1)
    o = p.P(0, 0)
    p.arrow(p.X(-lim - 0.5), o[1], p.X(lim + 0.5), o[1], INK, 1.3)
    p.arrow(o[0], p.Y(-lim - 0.5), o[0], p.Y(lim + 0.5), INK, 1.3)
    p.text(p.X(lim + 0.45), o[1] - 7, 'x', 14, INK, 'end', italic=True)
    p.text(o[0] + 7, p.Y(lim + 0.35), 'y', 14, INK, 'start', italic=True)
    for k in range(-lim, lim + 1):
        if k:
            p.line(p.X(k), o[1] - 3, p.X(k), o[1] + 3, INK, 1)
            p.line(o[0] - 3, p.Y(k), o[0] + 3, p.Y(k), INK, 1)
            if k % 2 == 0 or lim <= 5:
                p.text(p.X(k), o[1] + 15, str(k).replace('-', '−'), 11.5, BODY, halo=PAPER)
                p.text(o[0] - 5, p.Y(k) + 4, str(k).replace('-', '−'), 11.5, BODY, 'end', halo=PAPER)
    if polygon:
        p.poly([p.P(x, y) for x, y in polygon], stroke=GREEN, width=1.8, fill='#799E31', opacity=0.25)
    for x, y, name in points:
        p.circle(p.X(x), p.Y(y), 4.4, RED)
        if name:
            p.text(p.X(x) + 8, p.Y(y) - 7, name, 15, RED, 'start', weight='600', halo=PAPER)
    svg = p.svg(label)
    assert "'" not in svg
    return svg


def parkett_sechseck(w=320, h=220, r=26, mark=True, label='Parkett aus regelmäßigen Sechsecken'):
    """Honeycomb tiling of regular hexagons (pointy top) clipped to w x h; mark=True puts a
    red dot on one vertex where three hexagons meet."""
    c = Canvas(w, h)
    c.defs.append('<clipPath id="%s-hc"><rect x="0" y="0" width="%d" height="%d" rx="8"/></clipPath>' % (c.uid, w, h))
    c.raw('<g clip-path="url(#%s-hc)">' % c.uid)
    dx, dy = r * 3 ** 0.5, r * 1.5
    fills = ['#FDF3D6', '#F8DA8A', '#FCEFC7']
    row = 0
    y = 0.0
    while y < h + r:
        x0 = (dx / 2.0) if row % 2 else 0.0
        col = 0
        x = x0 - dx
        while x < w + dx:
            pts = [(x + r * _m.cos(_m.radians(90 + 60 * k)), y + r * _m.sin(_m.radians(90 + 60 * k))) for k in range(6)]
            c.poly(pts, stroke=INK, width=1.3, fill=fills[(row + 2 * col) % 3])
            x += dx
            col += 1
        y += dy
        row += 1
    c.raw('</g>')
    if mark:
        # a vertex shared by three hexagons: lower vertex of the hexagon at (dx, 0) shifted down a row
        vx, vy = dx * 3, dy * 2 + r
        c.circle(vx - dx / 2.0, vy - r / 2.0, 5, RED)
    svg = c.svg(label)
    assert "'" not in svg
    return svg
