#!/usr/bin/env python3
"""The figures of the deck mathe11-potenzen (Potenzen) - drawn with svgfig, inline SVG.

    python3 tools/pptx/mathe11_potenzen_svg.py      # prints the <svg> markup

Doc, 13.11.2026: his Potenzen.pptx (OneDrive IBB/UNTERRICHT/MATH BGY 11) rebuilt as a deck. Two of its pictures
are drawn here instead: slide 11 "Die Potenz" (a big a^x, Basis and Exponent pointed at) and the GeoGebra
screenshot of slide 35 (f(x) = 2^x, read off at x = 2,5). Returns (svg, labels) like ai_svg.py: shapes as SVG in
the picture box (816 x 330 design pixels), every word and formula as an HTML label (centre x, centre y, width,
text[, css[, click]]) the deck editor can change. Colours: the exponent green as on Doc's slides.
"""
import math
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aufgaben"))
import svgfig as S   # noqa: E402

W, H = 816, 330
INK = "color:#0E244E"


def potenz():
    """Slide 'Die Potenz': a^x large in the middle, 'Basis' and 'Exponent' with an arrow each, 'a hoch x' below."""
    c = S.Canvas(W, H)
    c.arrow(292, 214, 338, 200, color=S.MUTED, width=1.6)      # Basis -> a
    c.arrow(532, 94, 464, 124, color=S.MUTED, width=1.6)       # Exponent -> x
    labels = [
        (408, 168, 240, "$a^{\\textcolor{#799E31}{x}}$", "font-size:118px;" + INK),
        (240, 216, 110, "Basis", "font-size:26px;" + INK, {"g": 0, "kommt": True}),
        (612, 90, 150, "Exponent", "font-size:26px;color:#799E31", {"g": 1, "kommt": True}),
        (408, 304, 260, "„$a$ hoch $\\textcolor{#799E31}{x}$“", "font-size:26px;" + INK, {"g": 2, "kommt": True}),
    ]
    return c.svg(), labels


def zwei_hoch_x():
    """Slide 'Der Graph von f(x) = 2^x': the curve right, the three values read off left, each on its own click."""
    p = S.Plot((-1, 3.4), (0, 9), w=W, h=H, pad=(470, 24, 12, 24))
    p.grid(1, 1)
    p.axes(1, 1, defer_labels=True)
    p.clipped(lambda: p.curve(lambda x: 2 ** x, -1, 3.4, color=S.GREEN, width=2.4))
    r = math.sqrt(32)
    assert abs(2 ** 2.5 - r) < 1e-12 and abs(r - 5.657) < 5e-4
    p.dashto(2, 4)
    p.dashto(3, 8)
    p.dashto(2.5, r, color=S.RED)
    p.point(2, 4, color=S.INK)
    p.point(3, 8, color=S.INK)
    p.point(2.5, r, color=S.RED)
    p.draw_labels()
    big = "font-size:24px;" + INK
    labels = [
        (250, p.Y(8), 300, "$2^3 = 8$", big, {"g": 1, "kommt": True}),
        (250, p.Y(4), 300, "$2^2 = 4$", big, {"g": 0, "kommt": True}),
        (250, p.Y(r), 340, "$2^{\\textcolor{#B02418}{2{,}5}} = \\sqrt{32} \\approx 5{,}657$", big,
         {"g": 2, "kommt": True}),
        (250, 300, 380, "Die Kurve hat keine Lücken: Jeder Exponent hat seinen Wert.",
         "font-size:18px;color:#2C3C60", {"g": 3, "kommt": True}),
        (p.X(1.7), p.Y(1.1), 90, "$f(x) = 2^x$", "font-size:15px;color:#799E31"),
    ]
    return p.svg(), labels


if __name__ == "__main__":
    for fn in (potenz, zwei_hoch_x):
        print(fn()[0])
