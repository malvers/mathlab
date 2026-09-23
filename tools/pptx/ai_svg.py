#!/usr/bin/env python3
"""The KI-Begriffe deck's figures as SVG - drawn with svgfig, embedded inline in the deck.

    python3 tools/pptx/ai_svg.py neuron      # prints the <svg> markup

Doc, 23.09.2026: "kannst Du solche Bilder bitte immer im HTML malen? Das sieht pixlig aus und ich
kann nicht editieren" - so no more PNG for a drawn diagram. Each figure returns (svg, labels): the
shapes, arrows and maths as SVG (sharp on any beamer), the words as HTML labels laid over it -
<p class="fl"> in the deck file, which the deck editor (E) changes like any bullet line ("HTML
besser?" - for editing, yes). ai_diagrams.py keeps the PNG twins for the .pptx only.
The canvas is the picture box of a content slide, 816 x 330 design pixels (deck.css .pic); the
labels are placed in the same coordinates, so the SVG must fill that box exactly.
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aufgaben"))
import svgfig as S

W, H = 816, 330
SYM = "Helvetica Neue, Arial, sans-serif"   # Raleway has no Sigma - the glyph would fall back per browser anyway


def sub(base, idx):
    """x with a real subscript - a tspan, not a Unicode digit Raleway may lack."""
    return '%s<tspan baseline-shift="-22%%" font-size="72%%">%s</tspan>' % (base, idx)   # "sub" drops Raleway too far


def label(c, x, y, markup, size=14, color=S.INK, family=S.SANS, weight=None):
    """A centred label whose content is ready markup (subscripts)."""
    c.raw('<text x="%s" y="%s" font-family="%s" font-size="%s" fill="%s" text-anchor="middle"'
          ' dominant-baseline="central"%s>%s</text>'
          % (S.fmt(x), S.fmt(y), family, size, color,
             ' font-weight="%s"' % weight if weight else "", markup))


def neuron():
    """One artificial neuron: inputs, weights, sum, activation, output. Returns (svg, labels),
    a label being (centre x, centre y, width, text)."""
    c = S.Canvas(W, H)
    labels = []
    cx, cy, r = 430, 150, 88
    ins = [("Helligkeit", 52), ("Kantenanteil", 150), ("Rundung", 248)]
    for i, (name, y) in enumerate(ins, 1):
        c.circle(62, y, 26, fill="#F4F7FC", stroke=S.INK, width=2.4)
        label(c, 62, y, sub("x", i), 16)
        labels.append((62, y + 46, 120, name))
        # the arrow carries its weight in a small box at its middle
        x1, y1 = 94, y
        x2, y2 = cx - r - 10, cy + (y - cy) * 0.3
        c.arrow(x1, y1, x2, y2, color=S.ORANGE, width=2.6)
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        c.rect(mx - 22, my - 15, 44, 30, fill=S.PAPER, stroke=S.ORANGE, width=2, rx=6)
        label(c, mx, my, sub("w", i), 14)
    # the neuron itself
    c.circle(cx, cy, r, fill=S.PAPER, stroke=S.INK, width=3)
    label(c, cx, cy - 34, "Σ", 46, family=SYM)
    label(c, cx, cy + 12, " + ".join(sub("x", i) + sub("w", i) for i in (1, 2, 3)) + " + b", 13, color=S.BODY)
    c.line(cx - 66, cy + 32, cx + 66, cy + 32, color=S.MUTED, width=1.2)
    labels.append((cx, cy + 52, 140, "Aktivierung"))
    # output
    c.arrow(cx + r + 10, cy, 696, cy, color=S.GREEN, width=2.6)
    c.circle(740, cy, 32, fill="#F4F7FC", stroke=S.GREEN, width=3)
    label(c, 740, cy, "y", 18)
    labels.append((740, cy + 54, 120, "Ausgabe"))
    labels.append((W / 2, 312, W, "Jeder Eingang wird mit seinem Gewicht multipliziert, alles wird addiert — "
                                  "und die Aktivierung entscheidet, was hinten herauskommt."))
    return c.svg("Ein künstliches Neuron: drei Eingänge mit Gewichten, Summe, Aktivierung, Ausgabe"), labels


FIGURES = {"neuron": neuron}

if __name__ == "__main__":
    svg, labels = FIGURES[sys.argv[1]]()
    print(svg)
    for x, y, w, text in labels:
        print("<!-- label %g %g %g: %s -->" % (x, y, w, text))
