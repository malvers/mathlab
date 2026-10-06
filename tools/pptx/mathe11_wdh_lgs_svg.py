#!/usr/bin/env python3
"""The figures of the deck mathe11-wdh-gleichungssysteme (Wiederholung Gleichungssysteme, KW 41) - drawn with
svgfig, inline SVG.

    python3 tools/pptx/mathe11_wdh_lgs_svg.py              # lists the figures
    python3 tools/pptx/mathe11_wdh_lgs_svg.py zeichnen1    # prints one <svg>

Doc, 06.10.2026: "Die PowerPoint, die wir heute eingehangen haben, bau die mal bitte in unserem Stil. Als HTML
nach." Drawn the way of mathe11_linear_svg.py, whose helpers it borrows: each figure goes into the .below box under
the bullets of its slide (about 816 x 180 design pixels) and carries maths only - formulas, coordinates, axis
names, no words. Every figure draws the slide's own numbers. Colours: ink for equation I, green for equation II,
red for the solution (the crossing) and for what fails.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mathe11_funktionen_svg import S, H, formula, plot, dot, check, cross, side   # noqa: E402


def zwei_geraden(f, g, xlim, ylim, w, sol, lf, lg, pf, pg, sol_pos=(8, -8), sol_anchor="start", ystep=1,
                 skip_y=(0, -1)):
    """Two lines f (ink) and g (green), their crossing `sol` as a red dot with its coordinates.
    pf/pg: where the two equations are written (x, y in world units)."""
    p = plot(xlim, ylim, w, ystep=ystep, skip_y=skip_y)
    p.curve(f, xlim[0], xlim[1], S.INK, 2.4)
    p.curve(g, xlim[0], xlim[1], S.GREEN, 2.4)
    formula(p, p.X(pf[0]), p.Y(pf[1]), lf, 14, S.INK, anchor="start")
    formula(p, p.X(pg[0]), p.Y(pg[1]), lg, 14, S.GREEN, anchor="start")
    if sol:
        dot(p, sol[0], sol[1], S.RED, 5)
        formula(p, p.X(sol[0]) + sol_pos[0], p.Y(sol[1]) + sol_pos[1],
                "P(%s \\mid %s)" % (sol[0], sol[1]), 15, S.RED, anchor=sol_anchor)
    p.draw_labels()
    return p


# ------------------------------------------------------------------ figures ---
def lgs():
    """Slide 'Zahlenpaare als Lösung': y = -x + 5 and y = 2x - 1 cross in P(2 | 3)."""
    return zwei_geraden(lambda x: -x + 5, lambda x: 2 * x - 1, (-1, 6), (-2, 6.5), 440, (2, 3),
                        "y = -x + 5", "y = 2x - 1", (4.1, 1.6), (3.5, 4.4), sol_pos=(-10, -30), sol_anchor="end",
                        ystep=2)


def zeichnen1():
    """Slide 'Ein Beispiel': x + y = 3 and 2x + y = 4, after the step to y: P(1 | 2)."""
    return zwei_geraden(lambda x: -x + 3, lambda x: -2 * x + 4, (-2, 5), (-4, 6.5), 440, (1, 2),
                        "y = -x + 3", "y = -2x + 4", (3.2, 0.9), (1.45, -3.5), ystep=2)


def zeichnen2():
    """Slide 'Jetzt ihr: zeichnerisch': -x + 1 = y and y = 2x - 8 - both lines, the crossing left to read off."""
    return zwei_geraden(lambda x: -x + 1, lambda x: 2 * x - 8, (-2, 6), (-9, 4), 440, None,
                        "y = -x + 1", "y = 2x - 8", (-1.9, -3.4), (2.2, -6.4), ystep=2, skip_y=(0,))


def dreieck():
    """Slide 'Die Dreiecksungleichungen': a triangle that closes (a + b > c) and one that cannot (a + b < c)."""
    c = S.Canvas(560, H)
    # left: closes
    A, B, C = (30, 150), (240, 150), (170, 40)
    c.poly([A, B, C], S.INK, 2.2)
    formula(c, (A[0] + B[0]) / 2, 172, "c", 17)
    formula(c, (A[0] + C[0]) / 2 - 12, (A[1] + C[1]) / 2 - 2, "b", 17)
    formula(c, (B[0] + C[0]) / 2 + 12, (B[1] + C[1]) / 2 - 2, "a", 17)
    formula(c, 135, 108, "a + b > c", 15, S.GREEN)
    check(c, 230, 50)
    # right: the two short sides do not reach each other
    A, B = (310, 150), (540, 150)
    c.line(A[0], A[1], B[0], B[1], S.INK, 2.2)
    c.line(A[0], A[1], 370, 92, S.RED, 2.2)
    c.line(B[0], B[1], 470, 98, S.RED, 2.2)
    formula(c, (A[0] + B[0]) / 2, 172, "c", 17)
    formula(c, 330, 112, "b", 17, S.RED)
    formula(c, 520, 116, "a", 17, S.RED)
    formula(c, 425, 60, "a + b < c", 15, S.RED)
    cross(c, 420, 96)
    return c.svg()


def umfang():
    """Slide 'Gleichschenkliges Dreieck, Umfang 8': base x, legs y, y = -x/2 + 4 - a triangle only while x < 4
    (green); from x = 4 on the legs no longer meet (red), e.g. x = 5, y = 1,5."""
    t = S.Canvas(220, H)
    A, B, C = (20, 140), (200, 140), (110, 30)
    t.poly([A, B, C], S.INK, 2.2)
    t.line(A[0], A[1], B[0], B[1], S.RED, 2.6)
    formula(t, 110, 164, "x", 17, S.RED)
    formula(t, 52, 84, "y", 17)
    formula(t, 168, 84, "y", 17)
    formula(t, 110, 112, "u = 2y + x", 14)
    p = plot((-0.5, 8.8), (-0.6, 4.8), 520, ystep=1, skip_y=(0,))
    p.curve(lambda x: -x / 2 + 4, 0, 4, S.GREEN, 2.6)
    p.curve(lambda x: -x / 2 + 4, 4, 8, S.RED, 2.6)
    p.dashto(5, 1.5)
    dot(p, 5, 1.5, S.RED, 4.2)
    dot(p, 4, 2, S.INK, 4.2)
    formula(p, p.X(0.4), p.Y(4.25), "y = -x/2 + 4", 15, anchor="start")
    formula(p, p.X(5.2), p.Y(1.5) - 8, "(5 \\mid 1,5)", 14, S.RED, anchor="start")
    formula(p, p.X(4.1), p.Y(2) - 9, "(4 \\mid 2)", 14, anchor="start")
    p.draw_labels()
    return side(t, p, gap=50)


FIGURES = {
    "lgs": (lgs, "Zahlenpaare als Lösung"),
    "zeichnen1": (zeichnen1, "Zeichnerisch: ein Beispiel"),
    "zeichnen2": (zeichnen2, "Zeichnerisch: Jetzt ihr"),
    "dreieck": (dreieck, "Die Dreiecksungleichungen"),
    "umfang": (umfang, "Gleichschenkliges Dreieck mit festem Umfang"),
}


def svg(name):
    out = FIGURES[name][0]()
    return out if isinstance(out, str) else out.svg()


if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(svg(sys.argv[1]))
    else:
        for k, (f, h) in FIGURES.items():
            print("%-10s %s" % (k, h))
