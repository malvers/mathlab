#!/usr/bin/env python3
"""The figure of the deck mathe11-pq-herleitung (Herleitung der pq-Formel) - drawn with svgfig, inline SVG.

    python3 tools/pptx/mathe11_pq_herleitung_svg.py      # prints the <svg> markup

Doc, 10.11.2026: "Mach bitte ein Deck zur Herleitung", "Nach der ppt" - his slides 43-52 in Mathe Fördern 9.pptx
(OneDrive Schule 25_26/.../FÖRDERN JG 9). His slide 14 proves the first binomial formula with a square; here the
same square completes x^2 + px: a square of side x, two strips x times p/2, and the corner (p/2)^2 that is
missing. Returns (svg, labels) like ai_svg.py: shapes as SVG in the picture box (816 x 330 design pixels), every
word and formula as an HTML label (centre x, centre y, width, text[, css]) the deck editor can change.
Colours: the given square neutral, the strips green, the added corner orange (Doc's palette).
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aufgaben"))
import svgfig as S   # noqa: E402

W, H = 816, 330
X, P2 = 150, 60          # side x and half of p in pixels - only the proportions matter
TOP = 62                 # upper edge of both squares
LEFT, RIGHT = 74, 526    # left edge of the "before" and the "after" picture

BIG = "font-size:22px;color:#0E244E"
MID = "font-size:18px;color:#0E244E"
SMALL = "font-size:16px;color:#2C3C60"


def pieces(c, x0, corner):
    """Square x^2, the two strips (p/2)x, and the corner: dashed and empty before, orange after."""
    c.rect(x0, TOP, X, X, fill=S.INK, opacity=0.08)
    c.rect(x0 + X, TOP, P2, X, fill=S.GREEN, opacity=0.28)
    c.rect(x0, TOP + X, X, P2, fill=S.GREEN, opacity=0.28)
    if corner:
        c.rect(x0 + X, TOP + X, P2, P2, fill=S.ORANGE, opacity=0.75)
    for rx, ry, rw, rh in ((x0, TOP, X, X), (x0 + X, TOP, P2, X), (x0, TOP + X, X, P2)):
        c.rect(rx, ry, rw, rh, stroke=S.INK, width=2)
    if corner:
        c.rect(x0 + X, TOP + X, P2, P2, stroke=S.INK, width=2)
        c.rect(x0, TOP, X + P2, X + P2, stroke=S.INK, width=3.2)
    else:
        c.rect(x0 + X, TOP + X, P2, P2, stroke=S.MUTED, width=1.6)
        c.line(x0 + X, TOP + X + P2, x0 + X + P2, TOP + X + P2, S.MUTED, 1.6, dash="5 5")
        c.line(x0 + X + P2, TOP + X, x0 + X + P2, TOP + X + P2, S.MUTED, 1.6, dash="5 5")


def inside(x0):
    """The labels inside one picture: x^2 and the two strips."""
    return [
        (x0 + X / 2, TOP + X / 2, 80, "$x^2$", BIG),
        (x0 + X + P2 / 2, TOP + X / 2, 60, "$\\frac{p}{2}\\,x$", MID),
        (x0 + X / 2, TOP + X + P2 / 2, 80, "$\\frac{p}{2}\\,x$", MID),
    ]


def sides(x0):
    """Side lengths along the top and down the left of one picture."""
    return [
        (x0 + X / 2, TOP - 20, 40, "$x$", SMALL),
        (x0 + X + P2 / 2, TOP - 22, 40, "$\\frac{p}{2}$", SMALL),
        (x0 - 18, TOP + X / 2, 30, "$x$", SMALL),
        (x0 - 18, TOP + X + P2 / 2, 30, "$\\frac{p}{2}$", SMALL),
    ]


def ergaenzung():
    """Slide 'Die fehlende Ecke': x^2 + px as an L of square and two strips, plus (p/2)^2 gives (x + p/2)^2."""
    c = S.Canvas(W, H)
    pieces(c, LEFT, corner=False)
    pieces(c, RIGHT, corner=True)
    # the step between the two pictures
    ax1, ax2, ay = LEFT + X + P2 + 40, RIGHT - 44, TOP + (X + P2) / 2
    c.arrow(ax1, ay, ax2, ay, color=S.ORANGE, width=3)
    # every picture stays inside the box
    assert RIGHT + X + P2 < W - 20 and TOP + X + P2 + 46 < H
    labels = inside(LEFT) + sides(LEFT) + inside(RIGHT) + sides(RIGHT)
    labels += [
        (LEFT + X + P2 / 2, TOP + X + P2 / 2, 40, "?", "font-size:22px;color:#6E7E9F"),
        (RIGHT + X + P2 / 2, TOP + X + P2 / 2, 60, "$\\left(\\frac{p}{2}\\right)^2$", "font-size:15px;color:#0E244E"),
        ((ax1 + ax2) / 2, ay - 30, 150, "$+\\left(\\frac{p}{2}\\right)^2$", MID),
        ((ax1 + ax2) / 2, ay + 28, 150, "die fehlende Ecke", SMALL),
        (LEFT + (X + P2) / 2, TOP + X + P2 + 30, 200, "$x^2 + px$", MID),
        (RIGHT + (X + P2) / 2, TOP + X + P2 + 32, 220, "$\\left(x + \\frac{p}{2}\\right)^2$", MID),
    ]
    return c.svg(), labels


if __name__ == "__main__":
    print(ergaenzung()[0])
