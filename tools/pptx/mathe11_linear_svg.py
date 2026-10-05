#!/usr/bin/env python3
"""The figures of the deck mathe11-linear (Lineare Funktionen, KW 41) - drawn with svgfig, inline SVG.

    python3 tools/pptx/mathe11_linear_svg.py              # lists the figures
    python3 tools/pptx/mathe11_linear_svg.py anstieg      # prints one <svg>

Doc, 05.10.2026: "Bitte mach in das Deck Mathe 11 minus linear noch Abbildung rein. Da ist praktisch überhaupt keine
Abbildung drin. Sehr wichtig". Done the way of mathe11_funktionen_svg.py, whose helpers it borrows: this file only
DRAWS, the SVGs go straight into the existing slides of HTML/decks/mathe11-linear.html (the deck HTML is the source,
the build script was only initial), each in the .below box under the four bullets of its slide (class has-below),
about 816 x 180 design pixels. The figures carry maths only - formulas, coordinates, axis names - no words.
Every figure draws the slide's own numbers. Colours: ink for the lines, orange for the slope triangle, red for what
the slide asks for (the slope, the intercept, the zero, the crossing), green for what checks out.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mathe11_funktionen_svg import S, H, formula, plot, dot, check, cross, side   # noqa: E402


def steps(p, x0, y0, dx, dy, lx=None, ly=None, color=S.ORANGE, size=14):
    """A slope triangle from (x0 | y0): dx to the right, then dy up (down when negative), its legs labelled."""
    p.seg((x0, y0), (x0 + dx, y0), color, 2.4)
    p.seg((x0 + dx, y0), (x0 + dx, y0 + dy), color, 2.4)
    if lx:
        formula(p, p.X(x0 + dx / 2), p.Y(y0) + (17 if dy > 0 else -8), lx, size)
    if ly:
        formula(p, p.X(x0 + dx) + 8, p.Y(y0 + dy / 2) + 5, ly, size, anchor="start")


# ------------------------------------------------------------------ figures ---
def anstieg():
    """Slide 'Den Anstieg aus zwei Punkten': P(1|5), Q(4|14), the triangle 3 across and 9 up; m = 3 as one step."""
    a = plot((-0.6, 5.4), (-1, 16), 380, ystep=4, skip_y=(0,))
    a.curve(lambda x: 3 * x + 2, -0.6, 5.4, S.INK)
    steps(a, 1, 5, 3, 9, "3", "9")
    dot(a, 1, 5, S.INK)
    dot(a, 4, 14, S.INK)
    formula(a, a.X(1) + 4, a.Y(5) + 19, "P(1 \\mid 5)", 14, anchor="start")
    formula(a, a.X(4) - 8, a.Y(14) - 4, "Q(4 \\mid 14)", 14, anchor="end")
    formula(a, a.X(4.6), a.Y(2.6), "m = 9 : 3 = 3", 15, S.RED)
    a.draw_labels()
    b = plot((-0.5, 3.5), (-1, 10), 300, ystep=3, skip_y=(0,))
    b.curve(lambda x: 3 * x, -0.33, 3.4, S.INK)
    for k in range(3):
        steps(b, k, 3 * k, 1, 3, "1" if k == 1 else None, "3" if k == 1 else None)
    formula(b, b.X(2.9), b.Y(1.4), "y = 3x")
    b.draw_labels()
    return side(a, b, gap=60)


def negativ():
    """Slide 'Negativer und gebrochener Anstieg': m = -1/2 as two across, one down; same m, other n: parallel."""
    a = plot((-1, 6), (-1.5, 3.5), 340, ystep=1)
    a.curve(lambda x: -x / 2 + 2, -1, 6, S.INK)
    steps(a, 1, 1.5, 2, -1, "2", "1")
    formula(a, a.X(4.4), a.Y(2.6), "m = -1/2", 15, S.RED)
    formula(a, a.X(0.3), a.Y(-1.25), "y = -x/2 + 2", 14, anchor="start")
    a.draw_labels()
    b = plot((-2.5, 2.5), (-4, 6), 340, ystep=2, yticks=False)
    for n, col in ((3, S.INK), (0, S.MUTED), (-2, S.INK)):
        b.curve(lambda x, n=n: 2 * x + n, -2.5, 2.5, col)
        dot(b, 0, n, S.RED)
    formula(b, b.X(-0.25), b.Y(3) - 4, "n = 3", 13, S.RED, anchor="end")
    formula(b, b.X(0.25), b.Y(-2) + 16, "n = -2", 13, S.RED, anchor="start")
    formula(b, b.X(1.9), b.Y(-2.6), "m = 2", 15, anchor="start")
    b.draw_labels()
    return side(a, b, gap=60)


def startwert():
    """Slide 'Der Achsenabschnitt ist der Startwert': K(x) = 45x + 80 - 80 € at x = 0, 45 € more every hour."""
    p = plot((-0.4, 5.4), (-20, 360), 560, xstep=1, ystep=80, ylabel="K", pad=(44, 26, 14, 24))
    p.curve(lambda x: 45 * x + 80, 0, 5.4, S.INK)
    steps(p, 2, 170, 1, 45, "1", "45")
    dot(p, 0, 80)
    formula(p, p.X(0) + 12, p.Y(80) + 18, "n = 80", 14, S.RED, anchor="start")
    formula(p, p.X(4.3), p.Y(150), "K(x) = 45x + 80", 15, anchor="start")
    p.draw_labels()
    return p.svg("Die Gerade K(x) = 45x + 80 beginnt bei 80 auf der K-Achse und steigt je Stunde um 45")


def punkt():
    """Slide 'Die Gleichung aus Anstieg und einem Punkt': y = -2x + 7 through P(3|1), n = 7; y = 4 through two points."""
    a = plot((-1, 5), (-2, 9), 340, ystep=2)
    a.curve(lambda x: -2 * x + 7, -1, 5, S.INK)
    dot(a, 3, 1, S.INK)
    formula(a, a.X(3) + 9, a.Y(1) - 7, "P(3 \\mid 1)", 14, anchor="start")
    dot(a, 0, 7)
    formula(a, a.X(0) + 10, a.Y(7) - 9, "n = 7", 14, S.RED, anchor="start")
    formula(a, a.X(4.9), a.Y(6.2), "y = -2x + 7", 15, anchor="end")
    a.draw_labels()
    b = plot((-1, 6), (-1, 6), 340, ystep=1)
    b.seg((-1, 4), (6, 4), S.INK, 2.1)
    dot(b, 1, 4, S.INK)
    dot(b, 5, 4, S.INK)
    formula(b, b.X(1), b.Y(4) - 10, "(1 \\mid 4)", 14)
    formula(b, b.X(5), b.Y(4) - 10, "(5 \\mid 4)", 14)
    formula(b, b.X(3), b.Y(2.2), "m = 0", 15, S.RED)
    b.draw_labels()
    return side(a, b, gap=60)


def tarif():
    """Slide 'Vom Text zur Funktionsgleichung': K(t) = 5 + 0.1t, 25 € at 200 minutes; dashed: the base fee forgotten."""
    p = plot((-10, 270), (-3, 32), 560, xstep=50, ystep=5, ylabel="K", xlabel="t", pad=(40, 26, 14, 24))
    p.curve(lambda t: 0.1 * t, 0, 270, S.MUTED, 1.6, dash="6 5")
    p.curve(lambda t: 5 + 0.1 * t, 0, 270, S.INK)
    p.dashto(200, 25)
    dot(p, 200, 25)
    formula(p, p.X(200) - 10, p.Y(25) - 8, "(200 \\mid 25)", 14, S.RED, anchor="end")
    dot(p, 0, 5, S.INK)
    formula(p, p.X(15), p.Y(27), "K(t) = 5 + 0,1t", 15, anchor="start")
    formula(p, p.X(262), p.Y(21.5), "0,1t", 14, S.MUTED, anchor="start")
    p.draw_labels()
    return p.svg("K(t) = 5 + 0,1 t: bei 200 Minuten 25 Euro; gestrichelt dieselbe Gerade ohne Grundgebühr")


def fallend():
    """Slide 'Fallende Modelle und die Nullstelle': h(t) = 80 - 3t, 50 cm after 10 days, empty at t = 26.7."""
    p = plot((-1.5, 31), (-8, 92), 560, xstep=5, ystep=20, ylabel="h", xlabel="t", pad=(40, 26, 14, 24))
    z = 80 / 3.0
    p.curve(lambda t: 80 - 3 * t, 0, z, S.INK)
    p.dashto(10, 50)
    dot(p, 10, 50, S.INK)
    formula(p, p.X(10) + 9, p.Y(50) - 7, "(10 \\mid 50)", 14, anchor="start")
    dot(p, z, 0)
    formula(p, p.X(z), p.Y(0) - 12, "t ≈ 26,7", 14, S.RED)
    formula(p, p.X(16), p.Y(70), "h(t) = 80 - 3t", 15, anchor="start")
    p.draw_labels()
    return p.svg("h(t) = 80 − 3t fällt von 80 cm; nach 10 Tagen 50 cm, bei t ≈ 26,7 ist der Behälter leer")


def tarife():
    """Slide 'Zwei Tarife vergleichen': A = 5 + 0.1t and B = 10 + 0.05t cross at t = 100 (15 €)."""
    p = plot((-8, 215), (-2.5, 27), 560, xstep=50, ystep=5, ylabel="K", xlabel="t", pad=(40, 26, 14, 24))
    p.curve(lambda t: 5 + 0.1 * t, 0, 215, S.INK)
    p.curve(lambda t: 10 + 0.05 * t, 0, 215, S.MUTED)
    p.dashto(100, 15)
    dot(p, 100, 15)
    formula(p, p.X(100) - 4, p.Y(15) - 12, "(100 \\mid 15)", 14, S.RED, anchor="end")
    formula(p, p.X(205), p.Y(25.5) + 14, "A", 16, anchor="start")
    formula(p, p.X(205), p.Y(20.25) + 16, "B", 16, S.MUTED, anchor="start")
    p.draw_labels()
    return p.svg("Tarif A = 5 + 0,1 t und Tarif B = 10 + 0,05 t schneiden sich bei 100 Minuten und 15 Euro")


def fahrenheit():
    """Slide 'Umrechnen ist auch nur eine Gerade': F = 1.8C + 32 - 32 °F at 0 °C, 68 °F at 20 °C."""
    p = plot((-22, 42), (-10, 112), 560, xstep=10, ystep=20, xlabel="C", ylabel="F", pad=(40, 26, 14, 24))
    p.curve(lambda c: 1.8 * c + 32, -22, 42, S.INK)
    p.dashto(20, 68)
    dot(p, 20, 68, S.INK)
    formula(p, p.X(20) - 9, p.Y(68) - 7, "(20 \\mid 68)", 14, anchor="end")
    dot(p, 0, 32)
    formula(p, p.X(0) + 10, p.Y(32) + 17, "n = 32", 14, S.RED, anchor="start")
    formula(p, p.X(30), p.Y(65), "F = 1,8C + 32", 15, anchor="start")
    p.draw_labels()
    return p.svg("F = 1,8 C + 32: bei 0 Grad Celsius 32 Fahrenheit, bei 20 Grad Celsius 68 Fahrenheit")


def interpolieren():
    """Slide 'Zwischenwerte schätzen': between (0|10) and (10|30) the line gives 18 at x = 4."""
    p = plot((-0.8, 11.5), (-3, 36), 560, xstep=2, ystep=10, pad=(40, 26, 14, 24))
    p.seg((0, 10), (10, 30), S.INK, 2.1)
    p.dashto(4, 18)
    dot(p, 0, 10, S.INK)
    dot(p, 10, 30, S.INK)
    formula(p, p.X(0) + 10, p.Y(10) + 17, "(0 \\mid 10)", 14, anchor="start")
    formula(p, p.X(10) - 9, p.Y(30) - 6, "(10 \\mid 30)", 14, anchor="end")
    dot(p, 4, 18)
    formula(p, p.X(4) - 9, p.Y(18) - 7, "(4 \\mid 18)", 14, S.RED, anchor="end")
    p.draw_labels()
    return p.svg("Zwischen den Messpunkten (0 | 10) und (10 | 30) liefert die Gerade bei x = 4 den Wert 18")


def tabelle():
    """Slide 'Lineares Wachstum in der Tabelle': 2, 5, 8, 11 - plus 3 each time, on a line; 2, 4, 8, 16 - times 2."""
    def reihe(werte, op, f, col):
        p = plot((-0.5, 3.8), (-1.5, 18), 340, ystep=4, pad=(34, 22, 14, 24))
        p.curve(f, -0.3, 3.6, col, 1.6, dash="6 5")
        pts = list(enumerate(werte))
        for (u, v), (u2, v2) in zip(pts, pts[1:]):
            p.arrow(p.X(u) + 6, p.Y(v) - 4, p.X(u2) - 7, p.Y(v2) + 6, S.ORANGE, 1.8)
            formula(p, (p.X(u) + p.X(u2)) / 2 - 10, (p.Y(v) + p.Y(v2)) / 2 - 3, op, 14, S.RED, anchor="end")
        for u, v in pts:
            dot(p, u, v, S.INK)
        p.draw_labels()
        return p
    a = reihe([2, 5, 8, 11], "+3", lambda x: 3 * x + 2, S.MUTED)
    b = reihe([2, 4, 8, 16], "·2", lambda x: 2 * 2 ** x, S.MUTED)
    return side(a, b, gap=60)


def punktprobe():
    """Slide 'Punktprobe und der Sonderfall Senkrechte': (5|20) lies on y = 4x; x = 3 has endless y - no function."""
    a = plot((-1, 6.5), (-3, 24), 340, ystep=5)
    a.curve(lambda x: 4 * x, -0.75, 6.5, S.INK)
    a.dashto(5, 20)
    dot(a, 5, 20, S.GREEN)
    formula(a, a.X(5) - 9, a.Y(20) - 6, "(5 \\mid 20)", 14, anchor="end")
    check(a, a.X(6.0), a.Y(14))
    formula(a, a.X(2.6), a.Y(15.5), "y = 4x", 15, anchor="end")
    a.draw_labels()
    b = plot((-1, 6), (-2, 5), 340, ystep=1)
    b.seg((3, -2), (3, 5), S.RED, 2.1)
    for v in (-1, 1, 2.5, 4):
        dot(b, 3, v)
    formula(b, b.X(3) + 10, b.Y(4.4), "x = 3", 15, S.RED, anchor="start")
    cross(b, b.X(5.2), b.Y(3.9))
    b.draw_labels()
    return side(a, b, gap=60)


# slide index in the deck (0 = greeting) -> figure; the heading checks it is still the slide meant
FIGURES = {
    8: (anstieg, "Den Anstieg aus zwei Punkten"),
    9: (negativ, "Negativer und gebrochener Anstieg"),
    10: (startwert, "Der Achsenabschnitt ist der Startwert"),
    11: (punkt, "Die Gleichung aus Anstieg und einem Punkt"),
    14: (tarif, "Vom Text zur Funktionsgleichung"),
    15: (fallend, "Fallende Modelle und die Nullstelle"),
    16: (tarife, "Zwei Tarife vergleichen"),
    17: (fahrenheit, "Umrechnen ist auch nur eine Gerade"),
    18: (interpolieren, "Zwischenwerte schätzen"),
    21: (tabelle, "Lineares Wachstum in der Tabelle"),
    23: (punktprobe, "Punktprobe und der Sonderfall Senkrechte"),
}

if __name__ == "__main__":
    names = {f.__name__: f for f, _ in FIGURES.values()}
    if len(sys.argv) > 1:
        print(names[sys.argv[1]]())
    else:
        for i, (f, h) in FIGURES.items():
            print("%2d  %-14s %s" % (i, f.__name__, h))
