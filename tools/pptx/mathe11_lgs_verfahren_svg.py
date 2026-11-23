#!/usr/bin/env python3
"""The figures of the deck mathe11-lgs-verfahren (Die vier Lösungsverfahren) - drawn with svgfig, inline SVG.

    python3 tools/pptx/mathe11_lgs_verfahren_svg.py                  # lists the figures
    python3 tools/pptx/mathe11_lgs_verfahren_svg.py zeichnerisch     # prints the whole <section> of the slide

Doc, 23.11.2026: "auf jeden Fall die 4 Verfahren, zeichnerisch, gleichsetzen, addieren und einsetzen. Mit Beispielen
und Grafiken dazu." - every method shows what its solution means in the picture: the two equations as two lines,
the solution as their crossing point S (line I green, line II dark blue, S red, equal scale on both axes).
This file only DRAWS; each section went once into HTML/decks/mathe11-lgs-verfahren.html, and from then on the deck
HTML is the source (rule 23: shapes as SVG, every word and number as <p class="fl"> over it, so the deck editor can
change them). The figure slides put the words in a column on the left and the coordinate system on the right; a
part of the picture and its words come on the same click (<g class="step kommt" data-g="N">).
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aufgaben"))
import svgfig as S
from html_deck import figure_label, markup

W, H = 816, 330                     # the picture box of a content slide
ORANGE_DARK = "#D4960F"             # the darker orange of deck.css (.c1 on a light ground) - S.ORANGE is too pale here
TEXT = "var(--formel)"              # the blue of the bullets, so the words read like the slide's other lines
I_, II_ = "<c2><f3>I</f3></c2>", "<c2><f3>II</f3></c2>"   # the red Times numerals of the deck's bullets


# ------------------------------------------------------------------------------------------------- helpers ---
def _g(c, g):
    """Open a click group on canvas c (close it with _end)."""
    c.raw('<g class="step kommt" data-g="%d">' % g)


def _end(c):
    c.raw('</g>')


def _plot(xlim, ylim, h=H, pad=(26, 18, 18, 22), xstep=1, ystep=1, ticks=True, skip_x=(0,)):
    """A coordinate system h pixels high with the SAME scale on both axes (sx == sy): its width follows from the
    x range. Grid every unit (for reading off), tick numbers every xstep / ystep, numbers drawn last (_done)."""
    pl, pr, pt, pb = pad
    s = (h - pt - pb) / float(ylim[1] - ylim[0])
    inner = (xlim[1] - xlim[0]) * s
    w = int(math.ceil(pl + pr + inner))
    pr += w - (pl + pr + inner)          # the rounding goes into the right pad, so sx stays == sy
    p = S.Plot(xlim, ylim, w, h, (pl, pr, pt, pb))
    p.grid()
    p.axes(xstep, ystep, origin=None, defer_labels=True, xticks=ticks, yticks=ticks, skip_x=skip_x)
    assert abs(p.sx - p.sy) < 1e-9
    return p


def _gerade(p, a, b, c, col, width=3.0, dash=None):
    """The line a*x + b*y = c across the whole window, clipped to it."""
    if b == 0:
        p.seg((c / a, p.y0), (c / a, p.y1), col, width, dash, clip=True)
    else:
        p.seg((p.x0, (c - a * p.x0) / b), (p.x1, (c - a * p.x1) / b), col, width, dash, clip=True)


def _dot(p, u, v, col=S.RED, r=6.0):
    p.circle(p.X(u), p.Y(v), r, col)


def _right(p, label):
    """The plot at the right edge of the 816 x 330 box, the free room left of it for the words.
    Returns (svg, dx) - dx is the plot's left edge, for labels at plot positions: dx + p.X(u)."""
    spacer = S.Canvas(W - p.w, H)
    return S.panel([spacer, p], gap=0, label=label), W - p.w


def _t(x, y, w, text, size=18, color=TEXT, g=None, weight=None, align="left", extra=""):
    """One line of words in the box: left edge x (or centre x with align="center"), middle y, one line only.
    --fg makes the formulas take the same colour (deck.css: .slide .tex uses var(--fg, var(--formel)))."""
    css = "font-size:%gpx;color:%s;--fg:%s;text-align:%s;white-space:nowrap" % (size, color, color, align)
    if weight:
        css += ";font-weight:%s" % weight
    css += extra
    k = {"g": g, "kommt": True} if g is not None else None
    return (x + w / 2.0 if align == "left" else x, y, w, text, css, k)


def _at(dx, p, u, v, text, color, g=None, size=16, w=160, ox=0, oy=0, align="center"):
    """A label at the plot position (u, v), shifted by (ox, oy) pixels, with a white halo over grid and lines."""
    return _t(dx + p.X(u) + ox, p.Y(v) + oy, w, text, size, color, g, align=align,
              extra=";text-shadow:0 0 3px #fff,0 0 3px #fff,0 0 3px #fff")


# ---------------------------------------------------------------------------------------- Fahrplan (below) ---
def fahrplan_klein():
    """svg for the .below box of the Fahrplan slide: the system of chapter 1 as two lines with their crossing point -
    the goal of all four methods. Maths only (S in the formula font), no words - nothing in it needs the editor."""
    p = S.Plot((-0.8, 4.8), (-1.2, 5.6), 200, 176, (14, 12, 18, 12))
    p.grid(color="#E3E9F3")
    p.axes(xticks=False, yticks=False, origin=None)
    _gerade(p, 1, 1, 5, S.GREEN, 3.0)
    _gerade(p, 2, -1, 1, S.INK, 2.4)
    _dot(p, 2, 3, S.RED, 5.5)
    p.text(p.X(2) + 10, p.Y(3) + 5, "S(2 | 3)", 16, S.INK, "start", tex=True, halo=S.PAPER)
    return p.svg(label="Zwei Geraden mit ihrem Schnittpunkt S(2 | 3)")


# ------------------------------------------------------------------------------- Kapitel 01: das Ziel ---
def ziel():
    """(svg, labels): y = -x + 5 and y = 2x - 1 - every equation a line, (4 | 1) only on line I, (2 | 3) on both."""
    p = _plot((-1, 5.6), (-1.4, 5.8))
    _g(p, 0); _gerade(p, 1, 1, 5, S.GREEN, 3.2); _end(p)
    _g(p, 1); _gerade(p, 2, -1, 1, S.INK, 2.6); _end(p)
    _g(p, 2); _dot(p, 4, 1, S.INK, 5.5); _end(p)
    _g(p, 3); _dot(p, 2, 3); _end(p)
    p.draw_labels()
    svg, dx = _right(p, "Die Geraden y = -x + 5 und y = 2x - 1 schneiden sich in S(2 | 3)")
    tw = dx - 24
    labels = [
        _t(0, 30, tw, "Jede Gleichung ist eine **Gerade**:", 19, weight=None),
        _t(0, 84, tw, "%s: alle Paare mit $y = -x + 5$" % I_, 18, g=0),
        _t(0, 124, tw, "%s: alle Paare mit $y = 2x - 1$" % II_, 18, g=1),
        _t(0, 178, tw, "$(4 \\mid 1)$ liegt nur auf %s: passt nicht in %s" % (I_, II_), 18, g=2),
        _t(0, 218, tw, "$(2 \\mid 3)$ liegt auf **beiden**: der Schnittpunkt", 18, g=3),
        _t(0, 280, tw, "$L = \\{(2 \\mid 3)\\}$", 24, g=4),
        _at(dx, p, 3.9, 1.1, "$y = -x + 5$", S.GREEN, 0, align="left", w=130, ox=8, oy=-30),
        _at(dx, p, 3.05, 5.2, "$y = 2x - 1$", S.INK, 1, align="left", w=130, ox=10),
        _at(dx, p, 4, 1, "$(4 \\mid 1)$", S.INK, 2, align="left", w=90, ox=10, oy=8),
        _at(dx, p, 2, 3, "$S(2 \\mid 3)$", S.RED, 3, align="left", w=110, ox=12, oy=10),
    ]
    return svg, labels


# ------------------------------------------------------------------------------- Kapitel 02: zeichnerisch ---
def zeichnerisch():
    """(svg, labels): x + y = 3 and 2x + y = 4, step by step - each line through two easy points, S read off."""
    p = _plot((-1, 4.6), (-1, 5.6))
    _g(p, 1); _gerade(p, 1, 1, 3, S.GREEN, 3.2); _dot(p, 0, 3, S.GREEN, 5); _dot(p, 3, 0, S.GREEN, 5); _end(p)
    _g(p, 2); _gerade(p, 2, 1, 4, S.INK, 2.6); _dot(p, 0, 4, S.INK, 5); _dot(p, 2, 0, S.INK, 5); _end(p)
    _g(p, 3); p.dashto(1, 2); _dot(p, 1, 2); _end(p)
    p.draw_labels()
    svg, dx = _right(p, "Zeichnerisch: x + y = 3 und 2x + y = 4 schneiden sich in S(1 | 2)")
    tw = dx - 24
    labels = [
        _t(0, 18, tw, "%s: $x + y = 3$" % I_, 19),
        _t(0, 50, tw, "%s: $2x + y = 4$" % II_, 19),
        _t(0, 98, tw, "1. Nach $y$ umformen: $y = -x + 3$ und $y = -2x + 4$", 17, g=0),
        _t(0, 134, tw, "2. Gerade %s durch $(0 \\mid 3)$ und $(3 \\mid 0)$" % I_, 17, g=1),
        _t(0, 170, tw, "3. Gerade %s durch $(0 \\mid 4)$ und $(2 \\mid 0)$" % II_, 17, g=2),
        _t(0, 206, tw, "4. Schnittpunkt ablesen: $S(1 \\mid 2)$", 17, g=3),
        _t(0, 242, tw, "5. Probe: $1 + 2 = 3$ ✓ und $2 \\cdot 1 + 2 = 4$ ✓", 17, g=4),
        _t(0, 294, tw, "$L = \\{(1 \\mid 2)\\}$", 24, g=5),
        _at(dx, p, 3.15, 0.55, "$y = -x + 3$", S.GREEN, 1, align="left", w=120, ox=-6),
        _at(dx, p, -0.95, 5.05, "$y = -2x + 4$", S.INK, 2, align="left", w=130, ox=60),
        _at(dx, p, 1, 2, "$S(1 \\mid 2)$", S.RED, 3, align="left", w=110, ox=12, oy=-12),
    ]
    return svg, labels


def zeichnerisch_jetzt():
    """(svg, labels): the class's turn - -x + 1 = y and y = 2x - 8; the empty grid stays, the lines come on the first
    click, S on the second, then the Probe and L."""
    p = _plot((-1, 5.6), (-4.6, 2.6))
    _g(p, 0); _gerade(p, 1, 1, 1, S.GREEN, 3.2); _gerade(p, 2, -1, 8, S.INK, 2.6); _end(p)
    _g(p, 1); p.dashto(3, -2); _dot(p, 3, -2); _end(p)
    p.draw_labels()
    svg, dx = _right(p, "Jetzt ihr: -x + 1 = y und y = 2x - 8 schneiden sich in S(3 | -2)")
    tw = dx - 24
    labels = [
        _t(0, 30, tw, "Löst zeichnerisch und macht die Probe:", 19),
        _t(24, 74, tw, "%s: $-x + 1 = y$" % I_, 19),
        _t(24, 110, tw, "%s: $y = 2x - 8$" % II_, 19),
        _t(0, 170, tw, "Schnittpunkt: $S(3 \\mid -2)$", 18, g=1),
        _t(0, 210, tw, "Probe: $-3 + 1 = -2$ ✓ und $2 \\cdot 3 - 8 = -2$ ✓", 18, g=2),
        _t(0, 272, tw, "$L = \\{(3 \\mid -2)\\}$", 24, g=3),
        _at(dx, p, 0, 2.2, "$y = -x + 1$", S.GREEN, 0, align="left", w=120, ox=12),
        _at(dx, p, 4.45, 0.9, "$y = 2x - 8$", S.INK, 0, align="left", w=120, ox=-128),
        _at(dx, p, 3, -2, "$S(3 \\mid -2)$", S.RED, 1, align="left", w=110, ox=-122, oy=16),
    ]
    return svg, labels


# ---------------------------------------------------------------------------- Kapitel 03: gleichsetzen ---
def gleichsetzen():
    """(svg, labels): y = 4x - 1 and y = -x + 1 - gleichsetzen asks where both lines have the same height y;
    S(0,4 | 0,6) lies between the grid lines, so reading it off would be guesswork."""
    p = _plot((-1.2, 2.3), (-1.6, 2.9))
    _g(p, 0); _gerade(p, 4, -1, 1, S.GREEN, 3.2); _gerade(p, 1, 1, 1, S.INK, 2.6); _end(p)
    _g(p, 1); p.seg((0.4, 0), (0.4, 0.6), ORANGE_DARK, 2.6, "6 5"); _end(p)
    _g(p, 2); p.seg((0, 0.6), (0.4, 0.6), S.MUTED, 1.2, "3 3"); _dot(p, 0.4, 0.6); _end(p)
    p.draw_labels()
    svg, dx = _right(p, "Gleichsetzen: y = 4x - 1 und y = -x + 1 schneiden sich in S(0,4 | 0,6)")
    tw = dx - 24
    labels = [
        _t(0, 26, tw, "Beide Gleichungen beginnen mit $y = \\ldots$", 19),
        _t(0, 80, tw, "Gleichsetzen fragt: bei welchem $x$ sind", 18, g=1),
        _t(0, 108, tw, "beide $y$ gleich? $4x - 1 = -x + 1$", 18, g=1),
        _t(0, 160, tw, "Bei $x = 0{,}4$ haben beide $y = 0{,}6$", 18, g=2),
        _t(0, 200, tw, "Ablesen wäre hier ungenau, Rechnen ist **exakt**", 18, g=3),
        _t(0, 268, tw, "$L = \\{(0{,}4 \\mid 0{,}6)\\}$", 24, g=3),
        _at(dx, p, 0.92, 2.6, "$y = 4x - 1$", S.GREEN, 0, align="left", w=120, ox=10),
        _at(dx, p, -1.15, 2.05, "$y = -x + 1$", S.INK, 0, align="left", w=120, ox=4, oy=-18),
        _at(dx, p, 0.4, 0, "$x = 0{,}4$", ORANGE_DARK, 1, align="left", w=90, ox=6, oy=40),
        _at(dx, p, 0.4, 0.6, "$S(0{,}4 \\mid 0{,}6)$", S.RED, 2, align="left", w=140, ox=12, oy=-6),
    ]
    return svg, labels


# ----------------------------------------------------------------------------- Kapitel 04: einsetzen ---
def einsetzen():
    """(svg, labels): 4x + 3y = 18 and y = 2x - 4 - einsetzen tries the points of line II in equation I,
    all at once; three of them by hand: (1 | -2) and (2 | 0) miss, (3 | 2) hits."""
    p = _plot((-0.6, 5.6), (-2.7, 6.7), xstep=1, ystep=2)
    _g(p, 0); _gerade(p, 4, 3, 18, S.GREEN, 3.2); _gerade(p, 2, -1, 4, S.INK, 2.6); _end(p)
    _g(p, 2); _dot(p, 1, -2, S.MUTED, 5.5); _end(p)
    _g(p, 3); _dot(p, 2, 0, S.MUTED, 5.5); _end(p)
    _g(p, 4); _dot(p, 3, 2); _end(p)
    p.draw_labels()
    svg, dx = _right(p, "Einsetzen: 4x + 3y = 18 und y = 2x - 4 schneiden sich in S(3 | 2)")
    tw = dx - 24
    labels = [
        _t(0, 24, tw, "Auf Gerade %s gilt immer $y = 2x - 4$" % II_, 19, g=0),
        _t(0, 70, tw, "Einsetzen prüft ihre Punkte in %s: $4x + 3y = 18$?" % I_, 18, g=1),
        _t(24, 112, tw, "$(1 \\mid -2)$: $4 \\cdot 1 + 3 \\cdot (-2) = -2$ <c2>✗</c2>", 18, g=2),
        _t(24, 150, tw, "$(2 \\mid 0)$: $4 \\cdot 2 + 3 \\cdot 0 = 8$ <c2>✗</c2>", 18, g=3),
        _t(24, 188, tw, "$(3 \\mid 2)$: $4 \\cdot 3 + 3 \\cdot 2 = 18$ ✓", 18, g=4),
        _t(0, 234, tw, "$4x + 3(2x - 4) = 18$ prüft alle auf einmal", 18, g=5),
        _t(0, 292, tw, "$L = \\{(3 \\mid 2)\\}$", 24, g=5),
        _at(dx, p, 0.15, 5.8, "<f3>I</f3>", S.GREEN, 0, align="left", w=30, ox=6, size=20),
        _at(dx, p, 4.6, 5.2, "<f3>II</f3>", S.INK, 0, align="left", w=40, ox=-36, size=20),
        _at(dx, p, 1, -2, "$(1 \\mid -2)$", S.MUTED, 2, align="left", w=90, ox=10, oy=6),
        _at(dx, p, 2, 0, "$(2 \\mid 0)$", S.MUTED, 3, align="left", w=62, ox=-66, oy=-14),
        _at(dx, p, 3, 2, "$S(3 \\mid 2)$", S.RED, 4, align="left", w=100, ox=12, oy=6),
    ]
    return svg, labels


# ----------------------------------------------------------------------------- Kapitel 05: addieren ---
def addieren():
    """(svg, labels): 7x + 2y = 40 and 4x - 2y = 4 - their sum 11x = 44 is a line too: x = 4, upright through S."""
    p = _plot((-0.8, 7.2), (-1.2, 9.4), xstep=2, ystep=2, skip_x=(0, 4))
    _g(p, 0); _gerade(p, 7, 2, 40, S.GREEN, 3.2); _gerade(p, 4, -2, 4, S.INK, 2.6); _end(p)
    _g(p, 1); _gerade(p, 1, 0, 4, ORANGE_DARK, 2.8, "7 6"); _end(p)
    _g(p, 3); _dot(p, 4, 6); _end(p)
    p.draw_labels()
    svg, dx = _right(p, "Addieren: 7x + 2y = 40 und 4x - 2y = 4, ihre Summe x = 4 geht durch S(4 | 6)")
    tw = dx - 24
    labels = [
        _t(0, 22, tw, "%s: $7x + 2y = 40$" % I_, 19, g=0),
        _t(0, 56, tw, "%s: $4x - 2y = 4$" % II_, 19, g=0),
        _t(0, 112, tw, "%s $+$ %s: $11x = 44$, das $y$ fällt weg" % (I_, II_), 18, g=1),
        _t(0, 152, tw, "Auch das ist eine Gerade: $x = 4$, senkrecht", 18, g=2),
        _t(0, 192, tw, "Sie geht durch den Schnittpunkt $S(4 \\mid 6)$", 18, g=3),
        _t(0, 250, tw, "$L = \\{(4 \\mid 6)\\}$", 24, g=3),
        _at(dx, p, 3.29, 8.5, "<f3>I</f3>", S.GREEN, 0, align="left", w=30, ox=-26, size=20),
        _at(dx, p, 5.25, 8.5, "<f3>II</f3>", S.INK, 0, align="left", w=40, ox=10, size=20),
        _at(dx, p, 4, 0, "$x = 4$", ORANGE_DARK, 1, w=70, oy=17),
        _at(dx, p, 4, 6, "$S(4 \\mid 6)$", S.RED, 3, align="left", w=100, ox=12, oy=-14),
    ]
    return svg, labels


# ------------------------------------------------------------------- Kapitel 06: welches Verfahren wann ---
CARDS = [
    # (name, I, II, method, why, L)
    ("A", "y = 3x - 2", "y = -x + 6", "gleichsetzen", "beide beginnen mit $y = \\ldots$",
     "L = \\{(2 \\mid 4)\\}"),
    ("B", "x = 2y", "3x + y = 14", "einsetzen", "$x$ steht schon allein",
     "L = \\{(4 \\mid 2)\\}"),
    ("C", "3x + 2y = 12", "5x - 2y = 4", "addieren", "$+2y$ und $-2y$ heben sich auf",
     "L = \\{(2 \\mid 3)\\}"),
]
CW, CGAP = 256, 24


def welches_verfahren():
    """(svg, labels): three systems as three cards - look first, then name the method (one click per card),
    the solutions on the last click. Doc, 23.11.2026 (another deck): explain by example, not abstractly."""
    c = S.Canvas(W, H)
    for i in range(3):
        x = i * (CW + CGAP)
        c.rect(x, 2, CW, H - 4, fill=S.PAPER, opacity=0.55, rx=16)
        c.rect(x, 2, CW, H - 4, stroke="#C9D3E3", width=1.4, rx=16)
    labels = []
    for i, (name, e1, e2, how, why, sol) in enumerate(CARDS):
        cx = i * (CW + CGAP) + CW / 2.0
        labels += [
            _t(cx, 36, CW - 20, "System %s" % name, 20, S.INK, weight=600, align="center"),
            _t(cx, 88, CW - 20, "%s: $%s$" % (I_, e1), 19, align="center"),
            _t(cx, 124, CW - 20, "%s: $%s$" % (II_, e2), 19, align="center"),
            _t(cx, 186, CW - 20, "**%s**" % how, 22, S.RED, g=i, align="center"),
            _t(cx, 220, CW - 16, why, 15, g=i, align="center"),
            _t(cx, 286, CW - 20, "$%s$" % sol, 20, g=3, align="center"),
        ]
    return c.svg(label="Drei Gleichungssysteme: gleichsetzen, einsetzen, addieren"), labels


# --------------------------------------------------------------------- Kapitel 08: Dreiecksungleichung ---
STAB = 34          # pixels per cm, the same in all three panels


def drei_staebe():
    """(svg, labels): three sets of sticks - 3, 4, 5 cm make a triangle; 2, 3, 6 cm do not reach each other even
    laid flat; 2, 3, 5 cm only lie flat on the base. One click per panel."""
    c = S.Canvas(W, H)
    base_y = 196
    cases = [((3, 4, 5), "ok"), ((2, 3, 6), "kurz"), ((2, 3, 5), "platt")]
    labels = []
    for i, ((a, b, cc), kind) in enumerate(cases):
        x0 = i * (CW + CGAP) + (CW - cc * STAB) / 2.0      # base centred in its panel
        x1 = x0 + cc * STAB
        _g(c, i)
        c.line(x0, base_y, x1, base_y, S.INK, 3.4)
        if kind == "ok":
            # apex: distance b from the left end, a from the right end
            ux = (b * b - a * a + cc * cc) / (2.0 * cc)
            uy = math.sqrt(b * b - ux * ux)
            ax, ay = x0 + ux * STAB, base_y - uy * STAB
            c.line(x0, base_y, ax, ay, ORANGE_DARK, 3.4)
            c.line(x1, base_y, ax, ay, S.GREEN, 3.4)
            for px, py in ((x0, base_y), (x1, base_y), (ax, ay)):
                c.circle(px, py, 4, S.INK)
            labels += [
                _t((x0 + ax) / 2.0 - 16, (base_y + ay) / 2.0 - 8, 40, "$%d$" % b, 20, ORANGE_DARK, i, align="center"),
                _t((x1 + ax) / 2.0 + 16, (base_y + ay) / 2.0 - 8, 40, "$%d$" % a, 20, S.GREEN, i, align="center"),
            ]
        else:
            # both sticks swing up from the ends (dashed arcs), shown laid flat along the base
            for (px, r, col, sgn) in ((x0, b, ORANGE_DARK, 1), (x1, a, S.GREEN, -1)):
                R = r * STAB
                c.path("M %s %s A %s %s 0 0 %d %s %s" % (S.fmt(px + sgn * R), S.fmt(base_y), S.fmt(R), S.fmt(R),
                                                          0 if sgn > 0 else 1, S.fmt(px), S.fmt(base_y - R)),
                       stroke=col, width=1.3, dash="4 4")
                c.line(px, base_y - 7, px + sgn * R, base_y - 7, col, 4.2)
            for px in (x0, x1):
                c.circle(px, base_y, 4, S.INK)
            if kind == "kurz":
                gx0, gx1 = x0 + b * STAB, x1 - a * STAB
                c.line(gx0, base_y - 7, gx1, base_y - 7, S.RED, 2.2, "2 3")
                labels.append(_t((gx0 + gx1) / 2.0, base_y - 26, 80, "Lücke", 14, S.RED, i, align="center"))
            labels += [
                _t(x0 + b * STAB / 2.0, base_y - 24, 40, "$%d$" % b, 20, ORANGE_DARK, i, align="center"),
                _t(x1 - a * STAB / 2.0, base_y - 24, 40, "$%d$" % a, 20, S.GREEN, i, align="center"),
            ]
        _end(c)
        cx = i * (CW + CGAP) + CW / 2.0
        verdict = {"ok": ("$%d + %d = %d > %d$" % (a, b, a + b, cc), "ein Dreieck ✓", S.GREEN),
                   "kurz": ("$%d + %d = %d < %d$" % (a, b, a + b, cc), "sie erreichen sich nicht ✗", S.RED),
                   "platt": ("$%d + %d = %d = %d$" % (a, b, a + b, cc), "es bleibt platt ✗", S.RED)}[kind]
        labels += [
            _t(cx, 30, CW, "Stäbe $%d$, $%d$ und $%d$ cm" % (a, b, cc), 18, S.INK, i, weight=600, align="center"),
            _t(cx, base_y + 22, 60, "$%d$" % cc, 20, S.INK, i, align="center"),
            _t(cx, 262, CW, verdict[0], 20, g=i, align="center"),
            _t(cx, 296, CW, verdict[1], 18, verdict[2], i, weight=600, align="center"),
        ]
    return c.svg(label="Drei Stäbe: 3, 4, 5 ergibt ein Dreieck, 2, 3, 6 und 2, 3, 5 nicht"), labels


def _schenkel(c, x0, base_y, base, leg, scale, col_ok):
    """An isosceles triangle with the given base and legs (in cm) - or, if the legs are too short, the two legs
    laid flat from both ends with the gap between them in red. Returns True if it closes."""
    x1 = x0 + base * scale
    c.line(x0, base_y, x1, base_y, S.INK, 3.0)
    if 2 * leg > base:
        h = math.sqrt(leg * leg - (base / 2.0) ** 2) * scale
        ax = (x0 + x1) / 2.0
        c.line(x0, base_y, ax, base_y - h, col_ok, 3.0)
        c.line(x1, base_y, ax, base_y - h, col_ok, 3.0)
        return True
    c.line(x0, base_y - 7, x0 + leg * scale, base_y - 7, S.RED, 3.6)
    c.line(x1, base_y - 7, x1 - leg * scale, base_y - 7, S.RED, 3.6)
    c.line(x0 + leg * scale, base_y - 7, x1 - leg * scale, base_y - 7, S.RED, 1.6, "2 3")
    return False


def umfang():
    """(svg, labels): the isosceles triangle with perimeter 8 - x + 2y = 8 is a line, but only its part x < 4 makes
    triangles: x = 2 gives legs 3 (a triangle), x = 5 gives legs 1,5 (they do not reach each other)."""
    p = _plot((-0.6, 8.8), (-0.8, 4.9), pad=(26, 22, 18, 22))
    _g(p, 0); p.seg((0, 4), (8, 0), S.MUTED, 2.6); _end(p)
    _g(p, 1); _dot(p, 2, 3, S.GREEN, 6); _end(p)
    _g(p, 2); _dot(p, 5, 1.5, S.RED, 6); _end(p)
    _g(p, 3)
    p.seg((0, 4), (4, 2), S.GREEN, 4.2)
    p.seg((4, 2), (8, 0), S.RED, 4.2)
    p.seg((4, 0), (4, 2), S.MUTED, 1.2, "3 3")
    _dot(p, 2, 3, S.GREEN, 6); _dot(p, 5, 1.5, S.RED, 6)
    _end(p)
    p.draw_labels()
    # left of the plot: the two triangles of the two clicks, the same scale for both
    left = S.Canvas(W - p.w, H)
    sc = 26
    _g(left, 1); _schenkel(left, 40, 128, 2, 3, sc, S.GREEN); _end(left)
    _g(left, 2); _schenkel(left, 40, 262, 5, 1.5, sc, S.GREEN); _end(left)
    svg = S.panel([left, p], gap=0, label="Umfang 8: x + 2y = 8, ein Dreieck nur für x < 4")
    dx = W - p.w
    labels = [
        _t(4, 26, dx - 8, "Basis $x$, Schenkel $y$: $x + 2y = 8$", 18, S.INK, 0, weight=600),
        _t(112, 98, 150, "$x = 2$, $y = 3$", 17, g=1),
        _t(112, 124, 150, "$3 + 3 > 2$ ✓", 17, S.GREEN, 1, weight=600),
        _t(40, 236, 220, "$x = 5$, $y = 1{,}5$", 17, g=2),
        _t(40, 290, 220, "$1{,}5 + 1{,}5 < 5$ ✗", 17, S.RED, 2, weight=600),
        _at(dx, p, 0.25, 4.45, "$y = 4 - 0{,}5x$", S.INK, 0, align="left", w=150),
        _at(dx, p, 2, 3, "$(2 \\mid 3)$", S.GREEN, 1, align="left", w=80, ox=10, oy=-14),
        _at(dx, p, 5, 1.5, "$(5 \\mid 1{,}5)$", S.RED, 2, align="left", w=110, ox=10, oy=-14),
        _at(dx, p, 1.7, 1.1, "Dreieck für $x < 4$", S.GREEN, 3, align="left", w=170, size=17),
        _at(dx, p, 5.4, 3.3, "kein Dreieck für $x \\ge 4$", S.RED, 3, align="left", w=210, size=17),
    ]
    return svg, labels


# ------------------------------------------------------------------------------------------------ sections ---
def figure_section(title, fig):
    svg, labels = fig()
    return ('<section class="slide content"><h3>%s</h3><div class="rules"></div><div class="pic">%s%s</div>'
            '<p class="foot">Nicht verzagen, Doc Alvers fragen!</p><p class="pageno"></p></section>'
            % (markup(title), svg, "".join(figure_label(l) for l in labels)))


FIGURES = {
    "fahrplan": fahrplan_klein,
    "ziel": lambda: figure_section("Die Lösung im Bild", ziel),
    "zeichnerisch": lambda: figure_section("Beispiel: zeichnerisch", zeichnerisch),
    "zeichnerisch_jetzt": lambda: figure_section("Jetzt ihr: zeichnerisch", zeichnerisch_jetzt),
    "gleichsetzen": lambda: figure_section("Gleichsetzen im Bild", gleichsetzen),
    "einsetzen": lambda: figure_section("Einsetzen im Bild", einsetzen),
    "addieren": lambda: figure_section("Addieren im Bild", addieren),
    "welches": lambda: figure_section("Welches Verfahren passt?", welches_verfahren),
    "staebe": lambda: figure_section("Drei Stäbe, ein Dreieck?", drei_staebe),
    "umfang": lambda: figure_section("Umfang 8 im Bild", umfang),
}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(FIGURES[sys.argv[1]]())
    else:
        for n in FIGURES:
            print(n)
