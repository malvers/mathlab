#!/usr/bin/env python3
"""Two-stage tree diagrams for dice games, drawn with svgfig (never SVG by hand).

    from baum import zweistufig
    svg = zweistufig([1, 1, 1, 4, 4, 7], [3, 3, 3, 3, 5, 5], 'Rot', 'Blau')

Each die is a list of its six faces. Branch probabilities, path probabilities and the
winner of every path are computed here from the faces - the same numbers the sheet
checks - so a figure can never disagree with its solution.
"""
import os
import sys
from fractions import Fraction as F

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import svgfig as S  # noqa: E402


def faces(die):
    """Distinct values of a die with their probability, smallest first."""
    return [(v, F(die.count(v), len(die))) for v in sorted(set(die))]


def fr(x):
    return str(x.numerator) if x.denominator == 1 else '%d/%d' % (x.numerator, x.denominator)


def _ast(d, p, q, label, size=14):
    """Branch with its probability as a stacked fraction - above a rising or level
    branch, below a falling one, nudged left so it keeps clear of the line. A level
    branch between two others gets its label near its end, where the rising branch
    above it has already moved away (else the two labels sit on top of each other)."""
    (x1, y1), (x2, y2) = p, q
    d.line(x1, y1, x2, y2, S.MUTED, 1.3)
    t = 0.8 if abs(y2 - y1) < 0.5 else 0.5
    mx, my = x1 + (x2 - x1) * t, y1 + (y2 - y1) * t
    half = size * 0.86 if '/' in label else size * 0.4
    off = 7 + half
    d.texlabel(mx - 7, my + (-off if y2 <= y1 + 0.5 else off), label, size, S.BODY)


def _knoten(d, x, y, value, color=S.INK):
    d.rect(x - 14, y - 12, 28, 24, fill=S.PAPER, stroke=color, width=1.6, rx=5)
    d.text(x, y + 5, str(value), 15, S.INK, tex=True)


def zweistufig(a, b, name_a, name_b, col_a=S.RED, col_b=S.INK, step=None, hide=None,
               winner=True, label=None):
    """Tree for "first a, then b, the larger number wins".

    hide: index of a leaf whose path probability shows "?" (for a question).
    winner=False leaves out the winner column (same die twice, no game)."""
    fa, fb = faces(a), faces(b)
    rows = len(fa) * len(fb)
    step = step or (52 if len(fb) >= 3 else 44)     # three branches per node need more air
    top = 30
    W, H = 530, top + rows * step + 6
    d = S.Diagram(W, H)
    x0, x1, x2, xt, xw = 14, 120, 240, 262, 466
    ly = lambda k: top + step / 2.0 + step * k
    root = (x0, top + rows * step / 2.0)
    d.text(x1, 16, name_a, 13, S.MUTED, weight=600)
    d.text(x2, 16, name_b, 13, S.MUTED, weight=600)
    if winner:
        d.text(xw - 13, 16, 'gewinnt', 13, S.MUTED, anchor='start', weight=600)
    d.circle(root[0], root[1], 3.4, S.MUTED, S.PAPER, 1.3)
    k = 0
    for va, pa in fa:
        y1 = (ly(k) + ly(k + len(fb) - 1)) / 2.0
        _ast(d, (root[0] + 4, root[1]), (x1 - 15, y1), fr(pa))
        _knoten(d, x1, y1, va, col_a)
        for vb, pb in fb:
            y2 = ly(k)
            _ast(d, (x1 + 15, y1), (x2 - 15, y2), fr(pb))
            _knoten(d, x2, y2, vb, col_b)
            p = '?' if hide == k else fr(pa * pb)
            d.text(xt, y2 + 5, '(%s | %s):  %s · %s = %s' % (va, vb, fr(pa), fr(pb), p),
                   15, S.BODY, anchor='start', tex=True)
            if winner:
                who, col = ((name_a, col_a) if va > vb else (name_b, col_b) if vb > va
                            else ('unentschieden', S.MUTED))
                if va != vb:
                    d.circle(xw - 9, y2, 4.2, col, S.PAPER, 1)
                d.text(xw, y2 + 5, who, 14, S.BODY if va != vb else S.MUTED, anchor='start',
                       weight=700 if va != vb else None)
            k += 1
    return d.svg(label or 'Baumdiagramm: erst %s, dann %s' % (name_a, name_b))


def spiel(a, b):
    """P(a wins), P(b wins), P(tie) when first a, then b is thrown - by the path rule."""
    pa = sum(p * q for va, p in faces(a) for vb, q in faces(b) if va > vb)
    pb = sum(p * q for va, p in faces(a) for vb, q in faces(b) if vb > va)
    pt = sum(p * q for va, p in faces(a) for vb, q in faces(b) if va == vb)
    assert pa + pb + pt == 1
    return pa, pb, pt


def paare(a, b):
    """The same game counted over the 36 equally likely face pairs."""
    return (sum(x > y for x in a for y in b), sum(y > x for x in a for y in b),
            sum(x == y for x in a for y in b))
