#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Test und Fehlersuche: 1, 2, 4, 8, 16 ... 31 - the circle-division puzzle.

Doc, 18.09.2026: made from Doc's own "1 2 4 8 16 30.pptx" (Math AG / GTA, OneDrive INFO OS 09). Its
slides show Mathologer stills, Poonen's paper and Wikipedia pictures - not ours, and the decks are
public, so every figure here is drawn fresh with tools/aufgaben/svgfig.py and the sources are named.

HTML only: the figures are SVG (HTML/decks/img/kreisteilung-*.svg), which the .pptx backend cannot place.

    python3 tools/pptx/html_deck.py --prefix info9- build_kreisteilung_info9.py
"""
import math
import os
import sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "..", "aufgaben"))
from slides import Deck, py
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN
import svgfig as S

IMG = os.path.normpath(os.path.join(HERE, "..", "..", "HTML", "decks", "img"))
TAU = 2 * math.pi


# ----------------------------------------------------------------- geometry ---
def arrangement(angles):
    """The disc cut by every chord between points at `angles` (radians, 0 = right, clockwise on
    screen). A planar graph of arc and chord pieces whose faces are found by walking half-edges -
    the same method as HTML/kreisteilung.html, so a figure counts exactly what the lab counts,
    three chords through one point included."""
    n = len(angles)
    ang = [a % TAU for a in angles]
    V = [(math.cos(a), math.sin(a)) for a in ang]
    chords = [(i, j, [(i, 0.0), (j, 1.0)]) for i in range(n) for j in range(i + 1, n)]

    def find_or_add(x, y):
        # crossings closer than 1e-9 are ONE point - that is how three chords meet in the middle
        for k in range(n, len(V)):
            if math.hypot(V[k][0] - x, V[k][1] - y) < 1e-9:
                return k
        V.append((x, y))
        return len(V) - 1

    for a in range(len(chords)):
        i, j, on_a = chords[a]
        (x1, y1), (x2, y2) = V[i], V[j]
        dx1, dy1 = x2 - x1, y2 - y1
        for b in range(a + 1, len(chords)):
            k, l, on_b = chords[b]
            if len({i, j, k, l}) < 4:
                continue
            (x3, y3), (x4, y4) = V[k], V[l]
            dx2, dy2 = x4 - x3, y4 - y3
            den = dx1 * dy2 - dy1 * dx2
            if abs(den) < 1e-14:
                continue
            t = ((x3 - x1) * dy2 - (y3 - y1) * dx2) / den
            u = ((x3 - x1) * dy1 - (y3 - y1) * dx1) / den
            if not (1e-12 < t < 1 - 1e-12 and 1e-12 < u < 1 - 1e-12):
                continue
            v = find_or_add(x1 + t * dx1, y1 + t * dy1)
            on_a.append((v, t))
            on_b.append((v, u))

    order = sorted(range(n), key=lambda i: ang[i])
    edges = [(order[k], order[(k + 1) % n], True) for k in range(n)] if n >= 2 else []
    for _, _, on in chords:
        on.sort(key=lambda p: p[1])
        edges += [(p, q, False) for (p, _), (q, _) in zip(on, on[1:]) if p != q]

    darts = []                                     # 2m = u->v, 2m+1 = v->u
    for u, v, arc in edges:
        darts += [(u, v, arc, True), (v, u, arc, False)]

    def direction(d):
        u, v, arc, fwd = d
        if arc:                                    # tangent of the circle, in walking direction
            th = ang[u]
            return math.atan2(math.cos(th), -math.sin(th)) if fwd else math.atan2(-math.cos(th), math.sin(th))
        return math.atan2(V[v][1] - V[u][1], V[v][0] - V[u][0])

    around = [[] for _ in V]
    for k, d in enumerate(darts):
        around[d[0]].append(k)
    pos = {}
    for lst in around:
        lst.sort(key=lambda k: direction(darts[k]))
        pos.update((k, idx) for idx, k in enumerate(lst))

    def next_in_face(k):
        t = k ^ 1
        lst = around[darts[t][0]]
        return lst[(pos[t] + 1) % len(lst)]

    seen, faces = set(), []
    for k in range(len(darts)):
        if k in seen:
            continue
        face, d = [], k
        while True:
            seen.add(d)
            face.append(d)
            d = next_in_face(d)
            if d == k:
                break
        faces.append(face)

    arr = dict(n=n, ang=ang, V=V, darts=darts, chords=[(i, j) for i, j, _ in chords])
    polys = [sampled(arr, f) for f in faces]
    outer = max(range(len(faces)), key=lambda i: abs(shoelace(polys[i])[0])) if faces else -1
    arr["faces"] = [(f, p) for i, (f, p) in enumerate(zip(faces, polys)) if i != outer]
    arr["cuts"] = len(V) - n
    through = {}
    for c, (_, _, on) in enumerate(chords):
        for v, _ in on:
            if v >= n:
                through.setdefault(v, set()).add(c)
    arr["through"] = {v: len(s) for v, s in through.items()}
    return arr


def sweep(arr, u, v, fwd):
    """Angle walked along the circle from point u to point v."""
    a = arr["ang"]
    m = ((a[v] - a[u]) if fwd else (a[u] - a[v])) % TAU or TAU
    return m if fwd else -m


def sampled(arr, face):
    """A face as a polygon in unit coordinates, arcs sampled every 3.75 degrees."""
    pts = []
    for k in face:
        u, v, arc, fwd = arr["darts"][k]
        if arc:
            a0, sw = arr["ang"][u], sweep(arr, u, v, fwd)
            steps = max(2, math.ceil(abs(sw) / (math.pi / 48)))
            pts += [(math.cos(a0 + sw * s / steps), math.sin(a0 + sw * s / steps)) for s in range(steps)]
        else:
            pts.append(arr["V"][u])
    return pts


def shoelace(p):
    """Signed area and centroid of a polygon."""
    a = cx = cy = 0.0
    for (x0, y0), (x1, y1) in zip(p, p[1:] + p[:1]):
        c = x0 * y1 - x1 * y0
        a += c
        cx += (x0 + x1) * c
        cy += (y0 + y1) * c
    a /= 2.0
    return a, (cx / (6 * a), cy / (6 * a)) if a else (0.0, 0.0)


def regions(arr):
    return 1 if arr["n"] <= 1 else len(arr["faces"])


def regular(n, turn=0.0):
    """n points evenly spaced, the first one at the top."""
    return [-math.pi / 2 + TAU * i / n + turn for i in range(n)]


# ------------------------------------------------------------------ drawing ---
def hue(p):
    """Pastel by direction from the centre - neighbouring regions stay apart, like in the lab."""
    h = (math.degrees(math.atan2(p[1], p[0])) + 360) % 360
    r = min(1.0, math.hypot(*p))
    return "hsl(%d, %d%%, %d%%)" % (h, 52 + 26 * r, 88 - 10 * r)


def face_d(arr, face, cx, cy, R):
    """SVG path of one face: straight chord pieces, true arcs along the circle."""
    X = lambda p: S.fmt(cx + R * p[0])
    Y = lambda p: S.fmt(cy + R * p[1])
    V, out = arr["V"], []
    for m, k in enumerate(face):
        u, v, arc, fwd = arr["darts"][k]
        if m == 0:
            out.append("M %s %s" % (X(V[u]), Y(V[u])))
        if arc:
            sw = sweep(arr, u, v, fwd)
            out.append("A %s %s 0 %d %d %s %s" % (S.fmt(R), S.fmt(R), abs(sw) > math.pi, fwd, X(V[v]), Y(V[v])))
        else:
            out.append("L %s %s" % (X(V[v]), Y(V[v])))
    return " ".join(out) + " Z"


def numbered(arr):
    """Faces in reading order for the numbers: the caps along the rim clockwise from the top,
    then ring by ring inwards."""
    def key(item):
        face, poly = item
        _, (mx, my) = shoelace(poly)
        rim = any(arr["darts"][k][2] for k in face)
        return (0 if rim else 1, -round(math.hypot(mx, my), 1), (math.atan2(my, mx) + math.pi / 2) % TAU)
    return sorted(arr["faces"], key=key)


def draw(c, arr, cx, cy, R, numbers=False, cuts=True, mark=None, chord_w=1.1):
    """Circle, coloured regions, chords, crossings and points. mark: a face to outline in red."""
    V = arr["V"]
    if arr["n"] <= 1:
        c.raw('<circle cx="%s" cy="%s" r="%s" fill="%s"/>' % (S.fmt(cx), S.fmt(cy), S.fmt(R), hue((0.0, 0.0))))
    for face, poly in arr["faces"]:
        c.path(face_d(arr, face, cx, cy, R), stroke="none", width=0, fill=hue(shoelace(poly)[1]))
    if mark is not None:
        c.path(face_d(arr, mark, cx, cy, R), stroke=S.RED, width=2.2, fill=S.ORANGE)
    c.raw('<circle cx="%s" cy="%s" r="%s" fill="none" stroke="%s" stroke-width="1.8"/>'
          % (S.fmt(cx), S.fmt(cy), S.fmt(R), S.INK))
    for i, j in arr["chords"]:
        c.line(cx + R * V[i][0], cy + R * V[i][1], cx + R * V[j][0], cy + R * V[j][1], S.INK, chord_w, opacity=0.7)
    if cuts:
        for v in range(arr["n"], len(V)):
            big = arr["through"][v] >= 3
            c.circle(cx + R * V[v][0], cy + R * V[v][1], 4.6 if big else 2.1,
                     fill=S.ORANGE if big else S.INK, stroke=S.INK if big else "none", width=1.2 if big else 0)
    if numbers:
        for no, (face, poly) in enumerate(numbered(arr), 1):
            a, (mx, my) = shoelace(poly)
            size = max(7.5, min(14.0, math.sqrt(abs(a)) * R * 0.42))
            c.text(cx + R * mx, cy + R * my, str(no), size, S.INK, baseline="central", tex=True)
    for i in range(arr["n"]):
        c.circle(cx + R * V[i][0], cy + R * V[i][1], 5.2, fill=S.RED, stroke=S.PAPER, width=1.6)


def write(name, canvas, label):
    with open(os.path.join(IMG, "kreisteilung-%s.svg" % name), "w", encoding="utf-8") as f:
        f.write(canvas.svg(label))
    return "img/kreisteilung-%s.svg" % name


# ------------------------------------------------------------------ figures ---
# the free hexagon: point 1 pushed 16 degrees along the circle - far enough that the new
# triangle in the middle is big enough to see and to number
FREE6 = regular(6)
FREE6[1] += math.radians(16)
SYM, FREE = arrangement(regular(6)), arrangement(FREE6)
assert regions(SYM) == 30 and regions(FREE) == 31, (regions(SYM), regions(FREE))
for n, want in enumerate([1, 2, 4, 8, 16], 1):
    assert regions(arrangement(regular(n))) == want


def middle_triangle(arr):
    """The small face the three long diagonals close off once they miss each other."""
    def meet(p, q, r, s):
        V = arr["V"]
        (x1, y1), (x2, y2), (x3, y3), (x4, y4) = V[p], V[q], V[r], V[s]
        den = (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3)
        t = ((x3 - x1) * (y4 - y3) - (y3 - y1) * (x4 - x3)) / den
        return x1 + t * (x2 - x1), y1 + t * (y2 - y1)
    pts = [meet(0, 3, 1, 4), meet(1, 4, 2, 5), meet(2, 5, 0, 3)]
    gx, gy = sum(p[0] for p in pts) / 3, sum(p[1] for p in pts) / 3
    return min(arr["faces"], key=lambda fp: math.hypot(shoelace(fp[1])[1][0] - gx, shoelace(fp[1])[1][1] - gy))[0]


# 1, 2, 4, 8, 16, ? - one circle per n
row = S.Canvas(816, 300)
for k, n in enumerate(range(1, 7)):
    x = 68 + k * 136
    row.text(x, 34, "$n = %d$" % n, 16, S.MUTED, tex=True)
    draw(row, arrangement(regular(n)), x, 130, 56, cuts=False, chord_w=1.0)
    row.text(x, 250, "?" if n == 6 else str([1, 2, 4, 8, 16][k]), 40, S.RED if n == 6 else S.INK, tex=True)
FIG_ROW = write("folge", row, "Kreise mit 1 bis 6 Punkten: 1, 2, 4, 8, 16 Flächen und ein Fragezeichen")

# the regular hexagon, every region numbered: 30
sym = S.Canvas(816, 330)
draw(sym, SYM, 300, 165, 158, numbers=True)
sym.line(308, 165, 520, 118, S.MUTED, 1.2, dash="4 4")
sym.text(530, 112, "3 Sehnen durch", 17, S.INK, anchor="start")
sym.text(530, 134, "einen Punkt", 17, S.INK, anchor="start")
sym.text(530, 214, "30", 64, S.RED, anchor="start", tex=True)
sym.text(532, 246, "Flächen", 17, S.MUTED, anchor="start")
FIG_SYM = write("sechseck-30", sym, "Regelmäßiges Sechseck mit allen Sehnen, die 30 Flächen durchnummeriert")

# one point pushed a little: 31 - the new triangle is small, so a magnifier shows it
def magnifier(c, arr, face, cx, cy, R, ix, iy, ir, zoom):
    """A round inset at (ix, iy) showing the figure around `face` `zoom` times larger, with a
    ring around the spot in the main figure and two lines joining the ring to the inset."""
    _, (gx, gy) = shoelace(sampled(arr, face))
    sx, sy, sr = cx + R * gx, cy + R * gy, ir / zoom
    clip = c.uid + "-lupe"
    c.defs.append('<clipPath id="%s"><circle cx="%s" cy="%s" r="%s"/></clipPath>' % (clip, S.fmt(ix), S.fmt(iy), S.fmt(ir)))
    inner = S.Canvas(c.w, c.h)
    draw(inner, arr, ix - R * zoom * gx, iy - R * zoom * gy, R * zoom, mark=face, chord_w=2.0)
    c.defs += [dd for dd in inner.defs if dd not in c.defs]
    c.raw('<circle cx="%s" cy="%s" r="%s" fill="%s"/>' % (S.fmt(ix), S.fmt(iy), S.fmt(ir), S.PAPER))
    c.raw('<g clip-path="url(#%s)">%s</g>' % (clip, "".join(inner.body)))
    for k in (-1, 1):   # the two tangents shared by both rings
        a = math.atan2(iy - sy, ix - sx) + k * math.acos((sr - ir) / math.hypot(ix - sx, iy - sy))
        c.line(sx + sr * math.cos(a), sy + sr * math.sin(a), ix + ir * math.cos(a), iy + ir * math.sin(a),
               S.MUTED, 1.1, dash="4 4")
    for x, y, r in ((sx, sy, sr), (ix, iy, ir)):
        c.raw('<circle cx="%s" cy="%s" r="%s" fill="none" stroke="%s" stroke-width="1.8"/>'
              % (S.fmt(x), S.fmt(y), S.fmt(r), S.INK))


free = S.Canvas(816, 330)
TRI = middle_triangle(FREE)
draw(free, FREE, 200, 165, 158, numbers=True, mark=TRI)
magnifier(free, FREE, TRI, 200, 165, 158, 548, 150, 118, 7)
free.text(548, 305, "die Lupe: das neue Dreieck", 17, S.INK)
free.text(700, 176, "31", 64, S.GREEN, anchor="start", tex=True)
free.text(702, 208, "Flächen", 17, S.MUTED, anchor="start")
FIG_FREE = write("sechseck-31", free, "Sechseck mit einem verschobenen Punkt, 31 Flächen, eine Lupe zeigt das neue Dreieck in der Mitte")


# four points make exactly one crossing
def four(c, cx, cy, R, angles, pick, mark=False):
    arr = arrangement(angles)
    V = arr["V"]
    for i, j in arr["chords"]:
        c.line(cx + R * V[i][0], cy + R * V[i][1], cx + R * V[j][0], cy + R * V[j][1], S.MUTED, 1.0,
               opacity=0.45)
    if mark:                              # the free hexagon's middle triangle, filled like on the 31 slide
        c.path(face_d(arr, middle_triangle(arr), cx, cy, R), stroke=S.RED, width=1.4, fill=S.ORANGE)
    c.raw('<circle cx="%s" cy="%s" r="%s" fill="none" stroke="%s" stroke-width="1.8"/>'
          % (S.fmt(cx), S.fmt(cy), S.fmt(R), S.INK))
    a, b, p, q = sorted(pick, key=lambda i: arr["ang"][i])
    ring = [a, b, p, q]
    for s, t in zip(ring, ring[1:] + ring[:1]):
        c.line(cx + R * V[s][0], cy + R * V[s][1], cx + R * V[t][0], cy + R * V[t][1], S.INK, 1.4, dash="5 4")
    for s, t in ((a, p), (b, q)):
        c.line(cx + R * V[s][0], cy + R * V[s][1], cx + R * V[t][0], cy + R * V[t][1], S.RED, 2.6)
    (x1, y1), (x2, y2), (x3, y3), (x4, y4) = V[a], V[p], V[b], V[q]
    den = (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3)
    t = ((x3 - x1) * (y4 - y3) - (y3 - y1) * (x4 - x3)) / den
    c.circle(cx + R * (x1 + t * (x2 - x1)), cy + R * (y1 + t * (y2 - y1)), 6, fill=S.ORANGE, stroke=S.INK, width=1.4)
    for i in range(len(angles)):
        on = i in pick
        c.circle(cx + R * V[i][0], cy + R * V[i][1], 6.4 if on else 4.4,
                 fill=S.RED if on else S.MUTED, stroke=S.PAPER, width=1.6)


vier = S.Canvas(816, 330)
four(vier, 208, 150, 118, [math.radians(d) for d in (-80, 10, 120, 200)], {0, 1, 2, 3})
# the six points are the free hexagon of the 31 slide - an almost regular one looked like a slip of the pen (Doc,
# 18.09.2026: "sieht unregelmäßig aus"). The red chords are two of its long diagonals: their crossing is a corner
# of the middle triangle, whose three corners belong to three different sets of four points.
four(vier, 608, 150, 118, FREE6, {0, 1, 3, 4}, mark=True)
vier.text(208, 305, "4 Punkte: genau 1 Kreuzung", 17, S.INK)
vier.text(608, 305, "irgendwelche 4 von 6 Punkten: wieder 1", 17, S.INK)
FIG_VIER = write("vier-punkte", vier, "Vier Punkte bilden ein Viereck, seine zwei Diagonalen kreuzen sich genau einmal")


# ------------------------------------------------------------------- tables ---
def comb(n, k):
    return math.comb(n, k) if n >= k else 0


def verdoppeln(n):
    return 2 ** (n - 1)


def flaechen(n):
    return 1 + comb(n, 2) + comb(n, 4)


assert [flaechen(n) for n in range(1, 11)] == [1, 2, 4, 8, 16, 31, 57, 99, 163, 256]

# ------------------------------------------------------------------- slides ---
d = Deck("kreisteilung.pptx")

d.title("Informatik — Klasse 9", "1, 2, 4, 8, 16 … ?",
        "Warum fünf bestandene Tests noch nichts beweisen")
d.summary("Titel: 1, 2, 4, 8, 16 ... ? Das Kreisteilungsproblem - warum fünf bestandene Tests noch nichts beweisen")
d.say("Hallo, ich bin Solita. Heute geht es um ein Rätsel mit Punkten auf einem Kreis. Es sieht ganz einfach aus — aber es hat eine Falle. Am Ende wisst ihr, warum fünf bestandene Tests noch nichts beweisen.")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Das Rätsel", "Punkte auf einem Kreis, alle miteinander verbunden")
d.summary("Kapitel 1: Das Rätsel - Punkte auf einem Kreis, alle miteinander verbunden")
d.say("Kapitel eins: Das Rätsel. Punkte auf einem Kreis, alle miteinander verbunden.")

d.bullets("Die Spielregel", [
    ("Setzt **n Punkte** auf einen Kreis", 0),
    ("Verbindet **jeden Punkt mit jedem** — diese Strecken heißen **Sehnen**", 0),
    ("Die Sehnen zerschneiden die Kreisscheibe in **Flächen**", 0),
    ("Frage: **Wie viele Flächen** sind es bei n Punkten?", 0),
    ("Ein Tipp: Nummeriert die Flächen beim Zählen, sonst zählt ihr doppelt", 0),
])
d.summary("Spielregel: n Punkte auf einen Kreis, jeden mit jedem durch Sehnen verbinden, dann die Flächen zählen, in die die Kreisscheibe zerfällt")
d.say("Zuerst die Spielregel.",
      "Ihr setzt n Punkte auf einen Kreis.",
      "Dann verbindet ihr jeden Punkt mit jedem. Diese Verbindungsstrecken heißen Sehnen.",
      "Die Sehnen zerschneiden die Kreisscheibe in lauter Flächen.",
      "Und die Frage lautet: Wie viele Flächen sind es bei n Punkten?",
      "Ein Tipp: Nummeriert die Flächen beim Zählen. Sonst zählt ihr eine doppelt oder vergesst eine.")

d.picture("Die ersten fünf Fälle", FIG_ROW)
d.summary("Bild: n = 1 bis 5 Punkte ergeben 1, 2, 4, 8, 16 Flächen; bei n = 6 steht ein Fragezeichen")
d.say("Hier sind die ersten fünf Fälle. Ein Punkt: noch keine Sehne, also eine Fläche. Zwei Punkte: eine Sehne, zwei Flächen. Drei Punkte: vier Flächen. Vier Punkte: acht. Und fünf Punkte: sechzehn Flächen. Bei sechs Punkten steht noch ein Fragezeichen.")

d.bullets("Was kommt als Nächstes?", [
    ("1, 2, 4, 8, 16 — jedes Mal **verdoppelt**", 0),
    ("Also kommt als Nächstes **32** … oder?", 0),
    ("Überlegt kurz, bevor ihr weiterklickt: Würdet ihr darauf wetten?", 0),
    ("Kleiner Hinweis: Es ist **nicht** 32", 0),
])
d.summary("Die Vermutung liegt nahe: immer verdoppeln, also 32 bei 6 Punkten. Hinweis: Es ist nicht 32")
d.say("Was kommt als Nächstes?",
      "Eins, zwei, vier, acht, sechzehn — jedes Mal hat sich die Zahl verdoppelt.",
      "Also kommt als Nächstes zweiunddreißig … oder?",
      "Überlegt kurz: Würdet ihr darauf wetten? Sagt eure Zahl, bevor es weitergeht.",
      "Ein kleiner Hinweis: Es ist nicht zweiunddreißig. Ich warte hier — klickt weiter, wenn ihr so weit seid.",
      hold=True)   # the class bets first, the counting comes on a click

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Nachgezählt", "Sechs Punkte, zwei Ergebnisse")
d.summary("Kapitel 2: Nachgezählt - sechs Punkte, zwei Ergebnisse")
d.say("Kapitel zwei: Nachgezählt. Sechs Punkte — und zwei verschiedene Ergebnisse.")

d.picture("Regelmäßiges Sechseck: 30 Flächen", FIG_SYM)
d.summary("Regelmäßiges Sechseck: 15 Sehnen, die drei langen Diagonalen treffen sich alle im Mittelpunkt, nummeriert kommt man auf 30 Flächen - nicht 32, nicht einmal 31")
d.say("Hier liegen sechs Punkte als regelmäßiges Sechseck, mit allen fünfzehn Sehnen. Die Flächen sind nummeriert — und man kommt auf dreißig. Nicht zweiunddreißig, nicht einmal einunddreißig. Schaut in die Mitte: Dort laufen drei Sehnen durch einen einzigen Punkt.")

d.picture("Ein Punkt ein Stück verschoben: 31 Flächen", FIG_FREE)
d.summary("Einen Punkt ein Stück verschoben: die drei langen Diagonalen treffen sich nicht mehr in einem Punkt, in der Mitte entsteht ein kleines neues Dreieck, jetzt sind es 31 Flächen")
d.say("Jetzt verschieben wir einen einzigen Punkt ein kleines Stück. Die drei langen Diagonalen treffen sich nicht mehr in einem Punkt. In der Mitte entsteht ein winziges neues Dreieck — die Lupe zeigt es. Und damit sind es einunddreißig Flächen.")

d.bullets("Was ist da passiert?", [
    ("Im regelmäßigen Sechseck laufen **drei Sehnen durch einen Punkt**", 0),
    ("Verschiebt man einen Punkt, kreuzen sie sich **an drei Stellen** — dazwischen entsteht ein Dreieck", 0),
    ("Das Dreieck ist die **31.** Fläche", 0),
    ("Mehr geht nicht: 31 ist das **Maximum** — und 32 wird es nie", 0),
    ("Die Punkte liegen dann in **allgemeiner Lage**: nie drei Sehnen durch einen Punkt", 0),
])
d.summary("Im regelmäßigen Sechseck gehen drei Sehnen durch einen Punkt; verschoben kreuzen sie sich an drei Stellen und bilden ein Dreieck = 31. Fläche. 31 ist das Maximum (allgemeine Lage: nie drei Sehnen durch einen Punkt), 32 wird es nie")
d.say("Was ist da passiert?",
      "Im regelmäßigen Sechseck laufen drei Sehnen durch einen einzigen Punkt.",
      "Verschiebt man einen Punkt, kreuzen sich diese drei Sehnen an drei verschiedenen Stellen. Dazwischen entsteht ein kleines Dreieck.",
      "Dieses Dreieck ist die einunddreißigste Fläche.",
      "Mehr geht nicht: Einunddreißig ist das Maximum. Zweiunddreißig wird es nie.",
      "Wenn nie drei Sehnen durch einen Punkt laufen, sagt man: Die Punkte liegen in allgemeiner Lage.")

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Warum 31?", "Zählen, ohne zu zählen")
d.summary("Kapitel 3: Warum 31? Zählen, ohne zu zählen")
d.say("Kapitel drei: Warum einunddreißig? Wir zählen, ohne zu zählen.")

d.bullets("Jede Fläche hat einen Grund", [
    ("Der leere Kreis ist **1** Fläche", 0),
    ("Zieht man eine Sehne, schneidet sie jede Fläche auf ihrem Weg in zwei", 0),
    ("Jede Sehne bringt **1** neue Fläche — und **1 mehr für jede Kreuzung**, durch die sie läuft", 0),
    ("Zusammen: **Flächen = 1 + Sehnen + Kreuzungen**", 0),
    ("Bei 6 Punkten: 1 + 15 + 15 = **31**", 0),
])
d.summary("Zählregel: Flächen = 1 + Sehnen + Kreuzungen, denn jede Sehne bringt 1 neue Fläche und 1 mehr pro Kreuzung. Bei 6 Punkten: 1 + 15 + 15 = 31")
d.say("Jede Fläche hat einen Grund. Schauen wir, woher die Flächen kommen.",
      "Der leere Kreis ist eine Fläche.",
      "Zieht man eine Sehne, schneidet sie jede Fläche, durch die sie läuft, in zwei Teile.",
      "Also bringt jede Sehne eine neue Fläche — und eine mehr für jede Kreuzung, durch die sie läuft.",
      "Zusammen heißt das: Flächen gleich eins plus Sehnen plus Kreuzungen.",
      "Bei sechs Punkten: eins plus fünfzehn plus fünfzehn — das sind einunddreißig.")

d.picture("Jede Kreuzung gehört zu genau vier Punkten", FIG_VIER)
d.summary("Bild: 4 Punkte bilden ein Viereck, seine zwei Diagonalen kreuzen sich genau einmal; aus 6 Punkten gibt jede Wahl von 4 Punkten genau eine Kreuzung, also 15 Kreuzungen")
d.say("Und woher kommen die fünfzehn Kreuzungen? Links seht ihr: Vier Punkte auf dem Kreis bilden ein Viereck, und seine zwei Diagonalen kreuzen sich genau einmal. Rechts nehmen wir irgendwelche vier von sechs Punkten — wieder genau eine Kreuzung. Das kleine orange Dreieck in der Mitte zeigt es: Seine drei Ecken sind drei Kreuzungen, und sie gehören zu drei verschiedenen Vierergruppen. Aus sechs Punkten kann man fünfzehn Vierergruppen auswählen — also gibt es fünfzehn Kreuzungen.")

rows = [["n", "Sehnen (Paare)", "Kreuzungen (Vierergruppen)", "Flächen = 1 + Sehnen + Kreuzungen"]]
rows += [[str(n), str(comb(n, 2)), str(comb(n, 4)), str(flaechen(n))] for n in range(1, 9)]
d.table_top("Nachgerechnet", rows, [90, 190, 250, 286], [
    ("Sehnen = Paare von Punkten, Kreuzungen = Vierergruppen von Punkten", 0),
    ("In Mathe schreibt man dafür $\\binom{n}{2}$ und $\\binom{n}{4}$ — gesprochen „n über 2“ und „n über 4“", 0),
], font_size=12, bold_cols=(0, 3), marks={6: TINT_ORANGE}, align=["c", "c", "c", "c"])
d.summary("Tabelle n, Sehnen, Kreuzungen, Flächen: n=1: 0, 0, 1; n=2: 1, 0, 2; n=3: 3, 0, 4; n=4: 6, 1, 8; n=5: 10, 5, 16; n=6: 15, 15, 31; n=7: 21, 35, 57; n=8: 28, 70, 99. Sehnen = Paare = n über 2, Kreuzungen = Vierergruppen = n über 4")
d.say("Hier ist alles nachgerechnet, von einem bis acht Punkten. Bei sechs Punkten: fünfzehn Sehnen, fünfzehn Kreuzungen, einunddreißig Flächen.",
      "Sehnen sind Paare von Punkten. Kreuzungen sind Vierergruppen von Punkten.",
      "In Mathe schreibt man dafür n über zwei und n über vier. Das zählt, wie viele Paare und wie viele Vierergruppen es gibt.")

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Und was hat das mit Informatik zu tun?", "Testen heißt: den Fehler suchen")
d.summary("Kapitel 4: Und was hat das mit Informatik zu tun? Testen heißt: den Fehler suchen")
d.say("Kapitel vier: Und was hat das mit Informatik zu tun? Testen heißt: den Fehler suchen.")

py(d, "Zwei Programme, fünf gleiche Antworten", [
    "def verdoppeln(n):",
    "    return 2 ** (n - 1)",
    "",
    "def flaechen(n):",
    "    sehnen = n * (n - 1) // 2",
    "    kreuzungen = n * (n - 1) * (n - 2) * (n - 3) // 24",
    "    return 1 + sehnen + kreuzungen",
    "",
    "for n in range(1, 9):",
    "    a, b = verdoppeln(n), flaechen(n)",
    "    print(n, a, b, \"ok\" if a == b else \"FEHLER\")",
])
d.summary("Python-Code: verdoppeln(n) = 2 hoch (n-1); flaechen(n) = 1 + n(n-1)/2 + n(n-1)(n-2)(n-3)/24; Schleife n = 1 bis 8 vergleicht beide und druckt ok oder FEHLER")
d.say("Hier sind zwei kleine Programme. Das erste, verdoppeln, rechnet zwei hoch n minus eins — das ist die Vermutung: immer verdoppeln. Das zweite, Flächen, rechnet mit unserer Regel: eins plus Sehnen plus Kreuzungen. Die Schleife unten vergleicht beide für n von eins bis acht und schreibt jedes Mal okay oder Fehler.")

rows = [["n", "verdoppeln(n)", "flaechen(n)", "Test"]]
marks = {}
for n in range(1, 9):
    a, b = verdoppeln(n), flaechen(n)
    rows.append([str(n), str(a), str(b), "ok" if a == b else "FEHLER"])
    marks[(n, 3)] = TINT_GREEN if a == b else TINT_RED
d.table_top("Die Ausgabe", rows, [120, 232, 232, 232], [
    ("Fünf Tests **grün** — und trotzdem ist „verdoppeln“ **falsch**", 0),
], font_size=12, bold_cols=(0,), mono_cols=(1, 2, 3), marks=marks, align=["c", "c", "c", "c"])
d.summary("Ausgabe: n = 1 bis 5 ok (1, 2, 4, 8, 16 bei beiden), ab n = 6 FEHLER: 32 statt 31, 64 statt 57, 128 statt 99. Fünf grüne Tests, trotzdem ist verdoppeln falsch")
d.say("Und das kommt heraus. Bei einem bis fünf Punkten liefern beide Programme dieselben Zahlen: eins, zwei, vier, acht, sechzehn. Fünfmal okay. Ab sechs Punkten aber: Fehler. Zweiunddreißig statt einunddreißig, vierundsechzig statt siebenundfünfzig, hundertachtundzwanzig statt neunundneunzig.",
      "Fünf Tests grün — und trotzdem ist verdoppeln falsch.")

d.bullets("Was lernen wir fürs Testen?", [
    ("Ein Programm, das **fünf Tests besteht**, kann beim sechsten trotzdem falsch sein", 0),
    ("„Testen kann die Anwesenheit von Fehlern zeigen, aber nie ihre Abwesenheit.“ — Edsger Dijkstra", 0),
    ("Gute Tests suchen **Grenzfälle** und **Sonderfälle** — hier: größere n und symmetrische Punkte", 0),
    ("Und wer sicher sein will, braucht eine **Begründung** — wie die Zählregel von eben", 0),
])
d.summary("Lehre fürs Testen: fünf bestandene Tests beweisen nichts; Dijkstra: Testen zeigt die Anwesenheit von Fehlern, nie ihre Abwesenheit; gute Tests suchen Grenzfälle und Sonderfälle; Sicherheit gibt nur eine Begründung")
d.say("Was lernen wir daraus fürs Testen?",
      "Ein Programm, das fünf Tests besteht, kann beim sechsten trotzdem falsch sein.",
      "Der Informatiker Edsger Deikstra hat es so gesagt: Testen kann die Anwesenheit von Fehlern zeigen, aber nie ihre Abwesenheit.",
      "Gute Tests suchen deshalb Grenzfälle und Sonderfälle. Hier wären das größere n — und symmetrische Punkte wie das regelmäßige Sechseck.",
      "Und wer wirklich sicher sein will, braucht eine Begründung — so wie unsere Zählregel von eben.")   # Dijkstra, spelled as said

d.bullets("Wie zählt das Labor die Flächen?", [
    ("Die Punkte sind **Winkel** auf dem Kreis, die Sehnen **Strecken** dazwischen", 0),
    ("Für je zwei Sehnen rechnet es den **Schnittpunkt** aus", 0),
    ("Gleiche Punkte werden zusammengelegt — aber Kommazahlen sind nie ganz genau:", 0),
    ("in Python ergibt 0.1 + 0.2 nicht 0.3, sondern 0.30000000000000004", 1),
    ("„gleich“ heißt deshalb: **näher als ein Milliardstel**", 1),
    ("Dann läuft es um **jede Fläche einmal herum** und zählt — so stimmt auch die 30", 0),
])
d.summary("So zählt das Labor: Punkte als Winkel, Sehnen als Strecken, Schnittpunkte je zweier Sehnen ausrechnen, gleiche Punkte zusammenlegen (Kommazahlen ungenau: 0.1 + 0.2 = 0.30000000000000004, gleich heißt näher als ein Milliardstel), dann um jede Fläche herumlaufen und zählen - so stimmt auch die 30")
d.say("Wie zählt eigentlich das Labor die Flächen?",
      "Die Punkte sind Winkel auf dem Kreis, und die Sehnen sind Strecken zwischen ihnen.",
      "Für je zwei Sehnen rechnet es den Schnittpunkt aus.",
      "Gleiche Punkte werden zusammengelegt. Aber Vorsicht: Kommazahlen sind im Computer nie ganz genau. Null Komma eins plus null Komma zwei ergibt nicht null Komma drei, sondern null Komma drei, dann ganz viele Nullen und am Ende eine Vier. Deshalb heißt gleich hier: näher als ein Milliardstel.",
      "Dann läuft das Programm um jede Fläche einmal herum und zählt. So stimmt auch die Dreißig beim regelmäßigen Sechseck.")

d.lab("Selbst ausprobieren", "kreisteilung.html",
      note="„Regelmäßig“ ergibt bei 6 Punkten 30. Zieht einen Punkt ein Stück — die Zahl springt auf 31.")
d.summary("Labor Kreisteilung: n Punkte auf dem Kreis, regelmäßig oder in allgemeiner Lage, Punkte mit der Maus verschieben; das Zählwerk zeigt Sehnen, Schnittpunkte, Flächen und das Maximum")
d.say("Jetzt seid ihr dran. Im Labor ergibt das regelmäßige Sechseck dreißig Flächen. Zieht einen Punkt ein kleines Stück zur Seite — und die Zahl springt auf einunddreißig. Probiert es aus und klickt weiter, wenn ihr fertig seid.",
      hold=True)   # time to try the lab

d.merksatz("Ein Muster, das fünfmal stimmt, ist noch kein Beweis. "
           "Tests finden Fehler — dass keine mehr da sind, zeigen sie nie.")
d.summary("Merksatz: Ein Muster, das fünfmal stimmt, ist noch kein Beweis. Tests finden Fehler - dass keine mehr da sind, zeigen sie nie")
d.say("Merkt euch: Ein Muster, das fünfmal stimmt, ist noch kein Beweis. Tests finden Fehler — dass keine mehr da sind, zeigen sie nie.")

d.bullets("Fun Facts", [
    ("Das Rätsel heißt **Mosers Kreisproblem** — nach dem Mathematiker Leo Moser", 0),
    ("Die Folge 1, 2, 4, 8, 16, 31, 57, 99 steckt im **Pascalschen Dreieck**: die Summe der ersten fünf Zahlen jeder Zeile", 0),
    ("Für **regelmäßige** n-Ecke fanden Bjorn Poonen und Michael Rubinstein erst **1998** eine Formel — mit Sonderfällen bis n teilbar durch 210", 0),
    ("Ein anderer Anfang 1, 2, 4, 8, 16: immer die **Quersumme** dazuzählen — dann geht es mit 23, 28, 38, 49 weiter", 0),
    ("Auf YouTube erklärt es der **Mathologer**: „The hardest ‚What comes next?‘“", 0),
])
d.summary("Fun Facts: Mosers Kreisproblem nach Leo Moser; 1, 2, 4, 8, 16, 31, 57, 99 = Summe der ersten fünf Zahlen jeder Zeile im Pascalschen Dreieck; Formel für regelmäßige n-Ecke erst 1998 von Poonen und Rubinstein, mit Sonderfällen bis n teilbar durch 210; Quersummen-Folge 1, 2, 4, 8, 16, 23, 28, 38, 49; Mathologer-Video The hardest What comes next")
d.say("Zum Schluss noch ein paar spannende Fakten.",
      "Das Rätsel heißt Mosers Kreisproblem — nach dem Mathematiker Leo Moser.",
      "Die Folge eins, zwei, vier, acht, sechzehn, einunddreißig, siebenundfünfzig, neunundneunzig steckt im Pascalschen Dreieck: Es ist die Summe der ersten fünf Zahlen jeder Zeile.",
      "Für regelmäßige Vielecke haben Björn Punen und Michael Rubinstein erst neunzehnhundertachtundneunzig eine Formel gefunden — mit vielen Sonderfällen.",
      "Ein anderer Anfang mit eins, zwei, vier, acht, sechzehn: Man zählt immer die Quersumme dazu. Dann geht es mit dreiundzwanzig, achtundzwanzig, achtunddreißig und neunundvierzig weiter.",
      "Und auf YouTube erklärt es der Kanal Mäthologer — auf Englisch, mit wunderschönen Bildern.")   # Poonen, Mathologer: spelled as said

d.bullets("Eure Aufgabe", [
    ("Zeichnet einen Kreis mit **5 Punkten**, verbindet alle und zählt nach: 16?", 0),
    ("Jetzt **6 Punkte, unregelmäßig** verteilt — nummeriert die Flächen, bis ihr bei 31 seid", 0),
    ("Und 6 Punkte als **regelmäßiges Sechseck**: Wo fehlt die 31. Fläche?", 0),
    ("Programmiert `flaechen(n)` und `verdoppeln(n)` bis n = 10 — ab welchem n ist der Unterschied größer als 100?", 0),
])
d.summary("Aufgabe: 1. Kreis mit 5 Punkten zählen (16); 2. 6 unregelmäßige Punkte nummerieren bis 31; 3. regelmäßiges Sechseck: wo fehlt die 31. Fläche; 4. flaechen(n) und verdoppeln(n) bis n = 10 programmieren, ab welchem n ist der Unterschied größer als 100")
d.say("Und jetzt eure Aufgabe.",
      "Erstens: Zeichnet einen Kreis mit fünf Punkten, verbindet alle und zählt nach. Kommt ihr auf sechzehn?",
      "Zweitens: Jetzt sechs Punkte, unregelmäßig verteilt. Nummeriert die Flächen, bis ihr bei einunddreißig seid.",
      "Drittens: Sechs Punkte als regelmäßiges Sechseck. Wo fehlt die einunddreißigste Fläche?",
      "Viertens: Programmiert Flächen und verdoppeln bis n gleich zehn. Ab welchem n ist der Unterschied größer als hundert? Wenn ihr fertig seid, geht es zur Lösung.",
      hold=True)   # the solution comes only on a click

d.bullets("Lösung zu Aufgabe 4", [
    ("Unterschiede: n = 6 → 1, n = 7 → 7, n = 8 → 29, n = 9 → 93, n = 10 → **256**", 0),
    ("Ab **n = 10** ist der Unterschied größer als 100: 512 gegen 256", 0),
    ("Die 256 kommt also doch — nur bei 10 Punkten statt bei 9", 0),
])
d.summary("Lösung Aufgabe 4: Unterschied verdoppeln minus flaechen: n=6: 1, n=7: 7, n=8: 29, n=9: 93, n=10: 256; ab n = 10 größer als 100 (512 gegen 256)")
d.say("Hier ist die Lösung zu Aufgabe vier.",
      "Die Unterschiede: Bei sechs Punkten ist es eins, bei sieben sieben, bei acht neunundzwanzig, bei neun dreiundneunzig — und bei zehn Punkten zweihundertsechsundfünfzig.",
      "Ab zehn Punkten ist der Unterschied also größer als hundert: fünfhundertzwölf gegen zweihundertsechsundfünfzig.",
      "Die zweihundertsechsundfünfzig kommt also doch noch vor — nur bei zehn Punkten statt bei neun.")

d.save()
