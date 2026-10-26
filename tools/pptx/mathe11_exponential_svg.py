#!/usr/bin/env python3
"""The figures of the deck mathe11-exponential (Exponentielles Wachstum) - drawn with svgfig, inline SVG.

    python3 tools/pptx/mathe11_exponential_svg.py              # lists the figures
    python3 tools/pptx/mathe11_exponential_svg.py halbwertszeit  # prints one <svg>

Doc, 26.10.2026: "kannst du hier bitte Bilder reinmachen? Das ist immer so trocken, wenn es nur Text gibt ...
Vielleicht auch ein paar Grafiken". Same way as mathe11_funktionen_svg.py: this file only DRAWS, the SVGs go
straight into the existing slides of HTML/decks/mathe11-exponential.html (the deck HTML is the source). Most
figures sit in the .below box under the bullets (class has-below), about 816 x 180 design pixels; "wer_gewinnt"
fills the picture box of a slide of its own (816 x 330) and comes in on clicks. The figures carry maths only -
formulas, numbers, axis names - and no words, so nothing in them needs the deck editor.
Colours: ink for the curve the slide is about, red for what the slide asks for (the 50 mg, the overtaking),
orange arrows with a red factor for "times the same factor", green and muted for the curve it is compared with.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aufgaben"))
import svgfig as S
from mathe11_funktionen_svg import H, formula, plot, dot


def factor_arrows(p, pts, label, dy=0):
    """Orange arrows from point to point with the factor in red beside each - the "·2" of the table figure in
    mathe11-funktionen. dy lifts the arrows off the curve (a falling curve lies under its chords anyway)."""
    for (u, v), (u2, v2) in zip(pts, pts[1:]):
        p.arrow(p.X(u) + 6, p.Y(v) - 4 + dy, p.X(u2) - 7, p.Y(v2) + 4 + dy, S.ORANGE, 1.8)
        mx, my = (p.X(u) + p.X(u2)) / 2, (p.Y(v) + p.Y(v2)) / 2 + dy
        rising = v2 > v
        formula(p, mx + (-10 if rising else 10), my - 6, label, 14, S.RED, anchor="end" if rising else "start")


def group(c, g, draw):
    """Everything draw() emits as one click group - not there before its click (deck.css .step.kommt)."""
    mark = len(c.body)
    draw()
    inner = "".join(c.body[mark:])
    del c.body[mark:]
    c.raw('<g class="step kommt" data-g="%d">%s</g>' % (g, inner))


# ------------------------------------------------------------------ figures ---
def funktionsgleichung():
    """Slide 'Die Funktionsgleichung': f(x) = 100 * 2^x - the start value on the y-axis, then times 2 per step."""
    p = plot((-1.6, 3.7), (0, 900), 470, ystep=400, gstep=(1, 200), pad=(44, 22, 12, 24))
    p.curve(lambda x: 100 * 2 ** x, -1.6, 3.7, S.INK, 2.2)
    pts = [(0, 100), (1, 200), (2, 400), (3, 800)]
    factor_arrows(p, pts, "·2", dy=-8)
    p.dashto(3, 800)
    for u, v in pts[1:]:
        dot(p, u, v, S.INK)
    dot(p, 0, 100, S.RED)
    formula(p, p.X(0) - 9, p.Y(100) - 12, "a = 100", 15, S.RED, anchor="end")   # above: the curve runs below it
    formula(p, p.X(-0.85), p.Y(640), "f(x) = 100 · 2^x", 16)
    p.draw_labels()
    return p.svg("Der Graph von f von x gleich 100 mal 2 hoch x: er schneidet die y-Achse beim Startwert 100, "
                 "jeder Schritt nach rechts verdoppelt den Wert bis 800 bei x gleich 3")


def zinsvergleich():
    """Slide 'Zinseszins gegen feste Zinsen': 1000 * 1.07^t against 1000 + 70t over 20 years, the gap at t = 10."""
    p = plot((0, 21.5), (0, 4200), 560, xstep=5, ystep=1000, gstep=(5, 500), pad=(46, 26, 12, 24), xlabel="t",
             ylabel="K")
    p.curve(lambda t: 1000 + 70 * t, 0, 21.5, S.GREEN, 2.2)
    p.curve(lambda t: 1000 * 1.07 ** t, 0, 21.5, S.INK, 2.4)
    p.seg((10, 0), (10, 1967), S.MUTED, 1, dash="3 3")
    dot(p, 10, 1700, S.GREEN)
    dot(p, 10, 1967, S.RED)
    formula(p, p.X(10) - 9, p.Y(1967) - 8, "1967", 14, S.RED, anchor="end")
    formula(p, p.X(10) + 9, p.Y(1700) + 17, "1700", 14, S.GREEN, anchor="start")
    formula(p, p.X(14.2), p.Y(3500), "K = 1000 · 1,07^t", 15, anchor="end")
    formula(p, p.X(18.6), p.Y(2300) + 24, "K = 1000 + 70t", 15, S.GREEN)
    p.draw_labels()
    return p.svg("Zwanzig Jahre Guthaben: die Zinseszins-Kurve 1000 mal 1,07 hoch t biegt nach oben ab, die Gerade "
                 "1000 plus 70 t bleibt gerade; nach 10 Jahren 1967 gegen 1700 Euro")


def faktor_unter_eins():
    """Slide 'Wenn der Faktor kleiner als eins ist': (1/2)^x and 2^x mirror each other, neither ever meets y = 0."""
    p = plot((-3.4, 3.4), (0, 8.8), 420, ystep=2, gstep=(1, 1), pad=(34, 22, 12, 24))
    p.curve(lambda x: 2 ** x, -3.4, 3.4, S.MUTED, 1.8)
    p.curve(lambda x: 0.5 ** x, -3.4, 3.4, S.INK, 2.4)
    dot(p, 0, 1, S.INK)
    formula(p, p.X(-1.75), p.Y(6.6), "y = (½)^x", 16, anchor="start")
    formula(p, p.X(1.65), p.Y(6.6), "y = 2^x", 15, S.MUTED, anchor="end")
    p.draw_labels()
    return p.svg("Die Graphen von ein halb hoch x und 2 hoch x: Spiegelbilder an der y-Achse, beide gehen durch "
                 "den Punkt 0 und 1 und kommen der x-Achse beliebig nahe, ohne sie zu erreichen")


def halbwertszeit():
    """Slide 'Halbwertszeit: der Faktor ein Halb': 400 mg, half-life 5 days - 200, 100, 50 after 5, 10, 15 days."""
    p = plot((0, 21.5), (0, 460), 560, xstep=5, ystep=100, pad=(40, 26, 12, 24), xlabel="t", ylabel="m")
    p.curve(lambda t: 400 * 0.5 ** (t / 5), 0, 21.5, S.INK, 2.4)
    pts = [(0, 400), (5, 200), (10, 100), (15, 50)]
    factor_arrows(p, pts, "·½", dy=-10)
    for u, v in pts[1:]:
        p.dashto(u, v)
    for u, v in pts[:-1]:
        dot(p, u, v, S.INK)
    dot(p, 15, 50, S.RED)
    formula(p, p.X(15) + 10, p.Y(50) - 10, "50", 15, S.RED, anchor="start")
    formula(p, p.X(20.8), p.Y(380), "m(t) = 400 · (½)^{t/5}", 16, anchor="end")
    p.draw_labels()
    return p.svg("Abnahme von 400 Milligramm mit der Halbwertszeit 5 Tage: nach 5, 10 und 15 Tagen 200, 100 und "
                 "50 Milligramm, jeder Schritt mal ein halb")


def wer_gewinnt():
    """New slide 'Wer gewinnt?' after 'Auf lange Sicht': 100x and x^2 first, then 2^x, then where it overtakes.
    Fills the whole picture box (816 x 330); the three parts come in on clicks 0, 1, 2."""
    p = S.Plot((0, 12.6), (0, 2600), w=816, h=330, pad=(64, 40, 16, 30))
    p.grid(1, 500)
    p.axes(1, 500, defer_labels=True)
    xc = 9.96   # 2^x = 100x (bisection: 9.9600)

    def slow():
        p.curve(lambda x: 100 * x, 0, 12.6, S.GREEN, 2.6)
        p.curve(lambda x: x * x, 0, 12.6, S.ORANGE, 2.6)
        formula(p, p.X(5.6), p.Y(560) - 18, "y = 100x", 17, S.GREEN, anchor="end")
        formula(p, p.X(11.6), p.Y(135) - 24, "y = x^2", 17, "#B8860B")   # dark gold - the light orange is no text

    def fast():
        p.curve(lambda x: 2 ** x, 0, 12.6, S.RED, 2.8)
        formula(p, p.X(10.45), p.Y(2150), "y = 2^x", 17, S.RED, anchor="end")   # well clear of the curve: it ran into the x

    def overtake():
        p.seg((xc, 0), (xc, 100 * xc), S.MUTED, 1.2, dash="4 4")
        dot(p, xc, 100 * xc, S.RED, 5.5)
        formula(p, p.X(xc) - 12, p.Y(100 * xc) - 12, "x ≈ 10", 17, S.RED, anchor="end")

    group(p, 0, slow)
    group(p, 1, fast)
    group(p, 2, overtake)
    p.draw_labels()
    return p.svg("Die Gerade y gleich 100 x, die Parabel y gleich x Quadrat und die Kurve y gleich 2 hoch x: "
                 "2 hoch x überholt 100 x kurz vor x gleich 10 und lässt beide weit hinter sich")


def schachbrett():
    """Slide 'Die Sage vom Schachbrett': the first eight fields 1, 2, 4, ... 128, each times 2, then field 64."""
    c = S.Canvas(816, 132)
    s, x0, y0 = 60, 30, 46
    for i in range(8):
        x = x0 + i * s
        c.rect(x, y0, s, s, fill="#DCE4F0" if i % 2 else S.PAPER)
        formula(c, x + s / 2, y0 + s / 2 + 6, str(2 ** i), 18, halo=False)
        if i:
            px = x - s / 2   # an arc from the middle of the field before to the middle of this one
            c.raw('<path d="M %s %s Q %s %s %s %s" fill="none" stroke="%s" stroke-width="1.8" marker-end="url(#%s)"/>'
                  % (S.fmt(px + 8), y0 - 4, S.fmt(px + s / 2), y0 - 24, S.fmt(px + s - 8), y0 - 4,
                     S.ORANGE, c.arrowhead(S.ORANGE)))
            formula(c, px + s / 2, y0 - 22, "·2", 14, S.RED)
    c.rect(x0, y0, 8 * s, s, stroke=S.INK, width=1.4)
    formula(c, x0 + 8 * s + 34, y0 + s / 2 + 6, "…", 24, S.MUTED, halo=False)
    xl = x0 + 8 * s + 68
    c.rect(xl, y0, s, s, fill="#DCE4F0", stroke=S.RED, width=2.2)
    formula(c, xl + s / 2, y0 + s / 2 + 6, "2^{63}", 18, S.RED, halo=False)
    formula(c, xl + s + 14, y0 + s / 2 + 6, "≈ 9,2 · 10^{18}", 18, S.RED, anchor="start", halo=False)
    return c.svg("Die ersten acht Felder tragen 1, 2, 4, 8, 16, 32, 64 und 128 Körner, jedes Mal mal 2; "
                 "das letzte Feld trägt 2 hoch 63, rund 9,2 mal 10 hoch 18 Körner")


# slide title in the deck -> figure ("wer_gewinnt" is a slide of its own after 'Auf lange Sicht')
FIGURES = {
    "Die Funktionsgleichung": funktionsgleichung,
    "Zinseszins gegen feste Zinsen": zinsvergleich,
    "Wenn der Faktor kleiner als eins ist": faktor_unter_eins,
    "Halbwertszeit: der Faktor ein Halb": halbwertszeit,
    "Wer gewinnt?": wer_gewinnt,
    "Die Sage vom Schachbrett": schachbrett,
}

if __name__ == "__main__":
    names = {f.__name__: f for f in FIGURES.values()}
    if len(sys.argv) > 1:
        print(names[sys.argv[1]]())
    else:
        for t, f in FIGURES.items():
            print("%-40s %s" % (t, f.__name__))
