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


def ecke_zahlen():
    """Slide 'Die fehlende Ecke', second version (Doc, 10.11.2026: "die fehlende Ecke so richtig verstehe ich es noch
    nie"): x^2 + 6x built up in four pictures, one per click - the square and the strip 6x, the strip cut in half, one
    half moved under the square (same area), and the corner 3 * 3 = 9 that closes the square (x + 3)^2.
    Panel 1 is there from the start, panels 2-4 and the general line come with clicks 0-3 (deck.css .step.kommt)."""
    c = S.Canvas(W, H)
    X, U = 100, 30                       # side x and 3 units in pixels
    TOP, LAB, GAP = 70, 22, 42           # upper edge, room for the left labels, gap with the arrow
    p1 = 10 + LAB
    p2 = p1 + X + 2 * U + GAP + LAB
    p3 = p2 + X + 2 * U + GAP + LAB
    p4 = p3 + X + U + GAP + LAB
    assert p4 + X + U <= W - 8
    labels = []

    def lab(x, y, w, text, css=MID, g=None):
        labels.append((x, y, w, text, css, {"g": g, "kommt": True} if g is not None else None))

    def box(x, y, w, h, fill, opacity):
        c.rect(x, y, w, h, fill=fill, opacity=opacity)
        c.rect(x, y, w, h, stroke=S.INK, width=2)

    def group(g):
        c.raw('<g class="step kommt" data-g="%d">' % g)

    def arrow(x_end, g):
        group(g)
        c.arrow(x_end - LAB - GAP + 8, TOP + X / 2, x_end - LAB - 8, TOP + X / 2, color=S.ORANGE, width=2.6)
        c.raw('</g>')

    cap = TOP + X + U + 30               # one line for all captions
    # 1: the square and the whole strip 6x
    box(p1, TOP, X, X, S.INK, 0.08)
    box(p1 + X, TOP, 2 * U, X, S.GREEN, 0.28)
    lab(p1 + X / 2, TOP + X / 2, 60, "$x^2$", BIG)
    lab(p1 + X + U, TOP + X / 2, 50, "$6x$")
    lab(p1 + X / 2, TOP - 18, 30, "$x$", SMALL)
    lab(p1 + X + U, TOP - 18, 30, "$6$", SMALL)
    lab(p1 - 12, TOP + X / 2, 24, "$x$", SMALL)
    lab(p1 + X / 2 + U, cap, 160, "$x^2 + 6x$")
    # 2: the strip cut in half
    arrow(p2, 0)
    group(0)
    box(p2, TOP, X, X, S.INK, 0.08)
    box(p2 + X, TOP, U, X, S.GREEN, 0.28)
    box(p2 + X + U, TOP, U, X, S.GREEN, 0.28)
    c.raw('</g>')
    lab(p2 + X / 2, TOP + X / 2, 60, "$x^2$", BIG, 0)
    lab(p2 + X + U / 2, TOP + X / 2, 30, "$3x$", SMALL, 0)
    lab(p2 + X + 1.5 * U, TOP + X / 2, 30, "$3x$", SMALL, 0)
    lab(p2 + X / 2, TOP - 18, 30, "$x$", SMALL, 0)
    lab(p2 + X + U / 2, TOP - 18, 30, "$3$", SMALL, 0)
    lab(p2 + X + 1.5 * U, TOP - 18, 30, "$3$", SMALL, 0)
    lab(p2 - 12, TOP + X / 2, 24, "$x$", SMALL, 0)
    lab(p2 + X / 2 + U, cap, 160, "$6x$ halbieren", MID, 0)
    # 3: one half under the square - the area stays the same, the corner is empty
    arrow(p3, 1)
    group(1)
    box(p3, TOP, X, X, S.INK, 0.08)
    box(p3 + X, TOP, U, X, S.GREEN, 0.28)
    box(p3, TOP + X, X, U, S.GREEN, 0.28)
    c.rect(p3 + X, TOP + X, U, U, stroke=S.MUTED, width=1.6)
    c.raw('</g>')
    lab(p3 + X / 2, TOP + X / 2, 60, "$x^2$", BIG, 1)
    lab(p3 + X + U / 2, TOP + X / 2, 30, "$3x$", SMALL, 1)
    lab(p3 + X / 2, TOP + X + U / 2, 40, "$3x$", SMALL, 1)
    lab(p3 + X + U / 2, TOP + X + U / 2, 30, "?", "font-size:18px;color:#6E7E9F", 1)
    lab(p3 + X / 2, TOP - 18, 30, "$x$", SMALL, 1)
    lab(p3 + X + U / 2, TOP - 18, 30, "$3$", SMALL, 1)
    lab(p3 - 12, TOP + X / 2, 24, "$x$", SMALL, 1)
    lab(p3 - 12, TOP + X + U / 2, 24, "$3$", SMALL, 1)
    lab(p3 + (X + U) / 2, cap, 160, "Hälfte nach unten", MID, 1)
    # 4: the corner 3 * 3 = 9 closes the square of side x + 3
    arrow(p4, 2)
    group(2)
    box(p4, TOP, X, X, S.INK, 0.08)
    box(p4 + X, TOP, U, X, S.GREEN, 0.28)
    box(p4, TOP + X, X, U, S.GREEN, 0.28)
    box(p4 + X, TOP + X, U, U, S.ORANGE, 0.85)
    c.rect(p4, TOP, X + U, X + U, stroke=S.INK, width=3.2)
    c.raw('</g>')
    lab(p4 + X / 2, TOP + X / 2, 60, "$x^2$", BIG, 2)
    lab(p4 + X + U / 2, TOP + X / 2, 30, "$3x$", SMALL, 2)
    lab(p4 + X / 2, TOP + X + U / 2, 40, "$3x$", SMALL, 2)
    lab(p4 + X + U / 2, TOP + X + U / 2, 30, "$9$", SMALL, 2)
    lab(p4 + (X + U) / 2, TOP - 18, 80, "$x + 3$", SMALL, 2)
    lab(p4 + (X + U) / 2, cap, 150, "Ecke: $3 \\cdot 3 = 9$", MID, 2)
    # the sum of it, then the general case
    lab(W / 2, cap + 56, W, "$x^2 + 6x + 9 = (x + 3)^2$ — und allgemein fehlt bei $x^2 + px$ die Ecke "
        "$\\left(\\frac{p}{2}\\right)^2$", "font-size:17px;color:#0E244E", 3)
    assert cap + 56 + 14 < H
    return c.svg(), labels


if __name__ == "__main__":
    print(ergaenzung()[0])
