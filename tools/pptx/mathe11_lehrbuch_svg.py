#!/usr/bin/env python3
"""The Lehrbuch deck's figures as SVG - drawn with svgfig, embedded inline in the deck.

    python3 tools/pptx/mathe11_lehrbuch_svg.py usage      # prints the <svg> markup

Same pattern as ai_svg.py: each figure returns (svg, labels) - shapes as SVG, sharp on any beamer, the words
as HTML labels laid over it (<p class="fl">, editable with E). The canvas is the picture box of a content
slide, 816 x 330 design pixels; the labels use the same coordinates.
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aufgaben"))
import svgfig as S

W, H = 816, 330
TINTE = "#193482"          # deck.css --formel
LAMBDA = "#F5C242"         # Doc's palette: lambda orange, upsilon red, phi green
YPSILON = "#B02418"
TRACK = "#E3E8F2"

# click groups as figure_label() takes them
KOMMT = lambda g: {"g": g, "kommt": True}


def _bar(c, cid, x, y, w, h, parts):
    """A rounded usage bar: grey track, coloured parts (fraction, colour) laid square inside the round clip."""
    c.defs.append('<clipPath id="%s"><rect x="%s" y="%s" width="%s" height="%s" rx="%s"/></clipPath>'
                  % (cid, S.fmt(x), S.fmt(y), S.fmt(w), S.fmt(h), S.fmt(h / 2)))
    c.rect(x, y, w, h, fill=TRACK, rx=h / 2)
    c.raw('<g clip-path="url(#%s)">' % cid)
    left = x
    for frac, color in parts:
        c.rect(left, y, w * frac, h, fill=color)
        left += w * frac
    c.raw('</g>')


def usage():
    """Weekly limit before and after the whole book: 37 % -> 39 %, the 2 % in lambda orange."""
    c = S.Canvas(W, H)
    labels = []
    x0, bw, bh = 170, 530, 28
    y1, y2 = 70, 175
    x37 = x0 + bw * 0.37
    labels.append((435, 22, 320, "Wochenlimit (7 Tage)", "font-size:14px;letter-spacing:1px"))

    _bar(c, c.uid + "-bar1", x0, y1 - bh / 2, bw, bh, [(0.37, TINTE)])
    labels.append((85, y1, 150, "**vorher** · 08:36", "font-size:17px;color:#0E244E;text-align:right"))
    labels.append((752, y1, 80, "37 %", "font-size:22px;color:#0E244E"))

    c.raw('<g class="step kommt" data-g="0">')
    _bar(c, c.uid + "-bar2", x0, y2 - bh / 2, bw, bh, [(0.37, TINTE), (0.02, LAMBDA)])
    c.line(x37, y1 - bh / 2 - 8, x37, y2 + bh / 2 + 8, color=S.MUTED, width=1.4, dash="5 5")
    c.raw('</g>')
    labels.append((85, y2, 150, "**nachher** · 10:04", "font-size:17px;color:#0E244E;text-align:right", KOMMT(0)))
    labels.append((752, y2, 80, "39 %", "font-size:22px;color:#0E244E", KOMMT(0)))

    xs = x37 + bw * 0.01
    c.raw('<g class="step kommt" data-g="1">')
    c.arrow(xs, y2 + bh / 2 + 6, xs, 252, color=YPSILON, width=2.4)
    c.raw('</g>')
    labels.append((xs, 282, 460, "**+2 %** = das ganze Lehrbuch",
                   "font-size:24px;--fg:var(--red);color:var(--red)", KOMMT(1)))
    return c.svg("Wochenlimit vorher 37 Prozent, nachher 39 Prozent"), labels


def rechnung():
    """The cost as a growing calculation, one line out of the one above, the operation behind its line:
    107 EUR a month | : 4,33 -> per week | * 2 % -> 0,49 EUR, framed in lambda orange."""
    c = S.Canvas(W, H)
    labels = []
    ya, yb, yc = 55, 155, 262
    amount = lambda y, t, size=34, css="", g=None: labels.append(
        (300, y, 260, t, "font-size:%dpx;color:%s;text-align:right%s" % (size, TINTE, css), g))
    unit = lambda y, t, size=19, css="", g=None: labels.append(
        (548, y, 150, t, "font-size:%dpx;text-align:left%s" % (size, css), g))
    op = lambda y, t, g: labels.append(
        (712, y, 200, t, "font-size:24px;text-align:left", g))

    amount(ya, "$107$ €")
    unit(ya, "im Monat")
    op(ya, "$\\mid\\; :\\, 4{,}33$", KOMMT(0))
    labels.append((712, ya + 30, 200, "52 Wochen : 12 Monate", "font-size:12px;text-align:left", KOMMT(0)))

    amount(yb, "$\\approx 24{,}71$ €", g=KOMMT(1))
    unit(yb, "pro Woche", g=KOMMT(1))
    op(yb, "$\\mid\\; \\cdot\\, 2\\,\\%$", KOMMT(2))
    labels.append((712, yb + 30, 200, "Anteil am Wochenlimit", "font-size:12px;text-align:left", KOMMT(2)))

    c.raw('<g class="step kommt" data-g="3">')
    c.rect(224, yc - 44, 234, 88, fill=LAMBDA, rx=18, opacity=0.22)
    c.rect(232, yc - 37, 218, 74, fill="#FFFFFF", stroke=LAMBDA, width=4, rx=13)
    c.raw('</g>')
    amount(yc, "$\\approx 0{,}49$ €", 40, ";font-weight:700;--fg:var(--red);color:var(--red)", KOMMT(3))
    unit(yc, "**das ganze Buch**", 20, ";color:#0E244E", KOMMT(3))
    return c.svg("107 Euro im Monat durch 4,33 gleich 24,71 Euro pro Woche, davon 2 Prozent gleich 0,49 Euro"), labels


FIGURES = {"usage": usage, "rechnung": rechnung}


def svg(name):
    return FIGURES[name]()


if __name__ == "__main__":
    print(svg(sys.argv[1] if len(sys.argv) > 1 else "usage")[0])
