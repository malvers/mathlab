#!/usr/bin/env python3
"""The figures of the deck mathe11-unendliche-summe (1/2 + 1/4 + 1/8 + ... = 1, three proofs) - drawn with svgfig,
inline SVG, the words and fractions as HTML labels over it.

    python3 tools/pptx/mathe11_unendliche_summe_svg.py           # lists the figures
    python3 tools/pptx/mathe11_unendliche_summe_svg.py quadrat   # prints one <svg>

Doc, 06.10.2026 (a picture of three proofs, signed Einstein, Gauss and Ramanujan): "mach hierzu ein Deck mit den
Beweisen bitte". Both figures fill the picture box of a content slide, 816 x 330 (deck.css .pic); the labels use the
same coordinates. Each returns (svg, labels); a label is (centre x, centre y, width, text, css, click group or None) -
html_deck.figure_label. A part with a click group is faint and grey until its click (deck.css .step.ghost).
Colours: ink for the line and the outlines, orange, green and red - Doc's palette - for the pieces.
"""
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aufgaben"))
import svgfig as S

W, H = 816, 330
SOURCE_TOP = 338                      # a source under the canvas, just above the footer (ziegen_svg.py)
TEXT_CSS = "font-size:16px;text-align:left;color:#2C3C60"
SUM_CSS = "font-size:21px;text-align:left;color:#0E244E"


def lab(x, top, w, text, css="", g=None):
    """A label by its left edge and top (as one lays out text), turned into figure_label's centre - with the same
    line height figure_label takes off again."""
    m = re.search(r"font-size:\s*([\d.]+)px", css)
    line = float(m.group(1)) * 1.28 if m else 16.0
    return (x + w / 2, top + line / 2, w, text, css, g)


def ghost(c, g):
    c.raw('<g class="step ghost" data-g="%d">' % g)


def zenon():
    """Zeno's dichotomy on the number line from 0 to 1: the half, then half of the rest, and so on - one jump per
    click; the partial sums under the line."""
    c = S.Canvas(W, H)
    y0, x0, length = 196, 60, 696

    def X(s):
        return x0 + length * s

    words = [lab(0, 0, W, "Zenons Gedanke: Wer ans Ziel will, muss erst die Hälfte des Weges schaffen – dann die "
                          "Hälfte vom Rest, dann wieder die Hälfte vom Rest, und so weiter. Kommt man je an?",
                 "font-size:15px;line-height:1.3;color:#2C3C60")]
    c.line(X(0) - 14, y0, X(1) + 14, y0, S.INK, 2)
    for s in (0, 1):
        c.line(X(s), y0 - 9, X(s), y0 + 9, S.INK, 2.4)
        words.append(lab(X(s) - 15, y0 + 14, 30, "$%d$" % s, "font-size:18px;color:#0E244E"))
    marker = c.arrowhead(S.INK)
    labels = {1: (r"\frac{1}{2}", 20), 2: (r"\frac{1}{4}", 17), 3: (r"\frac{1}{8}", 15), 4: (r"\frac{1}{16}", 13)}
    sums = {1: r"\frac{1}{2}", 2: r"\frac{3}{4}", 3: r"\frac{7}{8}", 4: r"\frac{15}{16}"}
    for k in range(1, 9):
        g = None if k == 1 else min(k - 2, 2)       # jump 1 stands; 2 and 3 one click each; 4 to 8 together
        if g is not None and k in (2, 3, 4):
            ghost(c, g)
        a, b = 1 - 2.0 ** -(k - 1), 1 - 2.0 ** -k
        h = min(0.36 * length * 2.0 ** -k + 4, 100)
        xa, xb = X(a), X(b)
        c.raw('<path d="M %s %s Q %s %s %s %s" fill="none" stroke="%s" stroke-width="%s"%s/>'
              % (S.fmt(xa), y0, S.fmt((xa + xb) / 2), S.fmt(y0 - 2 * h), S.fmt(xb), y0, S.INK,
                 2 if k <= 4 else 1.2, ' marker-end="url(#%s)"' % marker if k <= 4 else ""))
        if k <= 4:
            c.line(xb, y0 - 6, xb, y0 + 6, S.INK, 1.6)
            tex, size = labels[k]
            words.append(lab((xa + xb) / 2 - 22, y0 - h - 12 - size * 1.6, 44, r"$\textcolor{#B02418}{%s}$" % tex,
                             "font-size:%gpx" % size, g))
            words.append(lab(xb - 20, y0 + 14, 40, r"$\textcolor{#6E7E9F}{%s}$" % sums[k], "font-size:13px", g))
        if g is not None and k in (2, 3, 8):
            c.raw("</g>")
    words.append(lab(X(1) - 30, y0 - 46, 34, r"$\textcolor{#B02418}{\ldots}$", "font-size:18px", 2))
    words.append(lab(0, 262, W, "Nach $n$ Etappen fehlt noch $\\frac{1}{2^n}$ – der Rest wird beliebig klein:"
                                " $\\frac{1}{2}+\\frac{1}{4}+\\frac{1}{8}+\\ldots=1$",
                     "font-size:17px;color:#0E244E", 3))
    words.append(lab(0, SOURCE_TOP, W, "Zenon von Elea, um 450 v. Chr. – überliefert von Aristoteles, Physik VI 9, "
                                       "239b (Stanford Encyclopedia of Philosophy: Zeno’s Paradoxes)",
                     "font-size:10px"))
    return c.svg("Zahlenstrahl von 0 bis 1: Sprünge der Länge ein Halb, ein Viertel, ein Achtel und so weiter "
                 "kommen der 1 beliebig nahe"), words


def quadrat():
    """The proof without words: a square of area 1, its top half, half of the rest, half of that rest ... - the
    pieces of the picture, one per click, the words beside it."""
    c = S.Canvas(W, H)
    side, x, y = 304, 36, 13
    c.rect(x, y, side, side, fill="#F4F7FC")
    rem = [x, y, float(side), float(side)]
    colours = (S.ORANGE, S.GREEN, S.RED)
    texts = {1: (r"\frac{1}{2}", 28), 2: (r"\frac{1}{4}", 24), 3: (r"\frac{1}{8}", 18), 4: (r"\frac{1}{16}", 13),
             5: (r"\frac{1}{32}", 9.5)}
    words = []
    for k in range(1, 11):
        g = min(k - 1, 3)                           # pieces 1, 2, 3 one click each, 4 to 10 together
        if k <= 4:
            ghost(c, g)
        px, py, w, h = rem
        if abs(w - h) < 1e-9:                       # a square: its top half
            piece, rem = (px, py, w, h / 2), [px, py + h / 2, w, h / 2]
        else:                                       # a lying rectangle: its left half
            piece, rem = (px, py, w / 2, h), [px + w / 2, py, w / 2, h]
        c.rect(*piece, fill=colours[(k - 1) % 3], opacity=0.34)
        c.rect(*piece, stroke=S.INK, width=1.3 if k <= 5 else 0.8)
        if k in texts:
            tex, size = texts[k]
            cx, cy = piece[0] + piece[2] / 2, piece[1] + piece[3] / 2
            words.append((cx, cy, max(piece[2], 30), "$%s$" % tex, "font-size:%gpx;color:#0E244E" % size, g))
        if k in (1, 2, 3, 10):
            c.raw("</g>")
    c.rect(x, y, side, side, stroke=S.INK, width=2.2)
    col, cw = 392, 410
    words += [
        lab(col, 22, cw, "Ein Quadrat mit der Seitenlänge $1$ hat die Fläche $1$.", TEXT_CSS),
        lab(col, 74, cw, "Die Hälfte davon: $\\frac{1}{2}$", TEXT_CSS, 0),
        lab(col, 116, cw, "Vom Rest wieder die Hälfte: $\\frac{1}{4}$", TEXT_CSS, 1),
        lab(col, 158, cw, "Vom Rest wieder die Hälfte: $\\frac{1}{8}$", TEXT_CSS, 2),
        lab(col, 200, cw, "Und so weiter – der Rest ist immer so groß wie das letzte Stück und wird beliebig klein.",
            TEXT_CSS, 3),
        lab(col, 270, cw, "$\\frac{1}{2}+\\frac{1}{4}+\\frac{1}{8}+\\frac{1}{16}+\\ldots=1$", SUM_CSS, 4),
    ]
    return c.svg("Ein Quadrat der Fläche 1, zerlegt in die Hälfte, ein Viertel, ein Achtel und so weiter"), words


def term(x, y, tex, size=21, g=None, w=90, align="center"):
    """One formula of a written calculation, centred on (x, y) - each term its own label, so the columns line up."""
    css = "font-size:%gpx;color:#0E244E" % size + (";text-align:%s" % align if align != "center" else "")
    return (x, y, w, "$%s$" % tex, css, g)


def strike(x, y, tex, size=21, g=None, w=90):
    """A red stroke through the term at (x, y): the same term again as an invisible phantom with KaTeX's cancel over
    it, so the stroke sits exactly on the term whatever the font makes of it."""
    return term(x, y, r"\textcolor{#B02418}{\cancel{\phantom{%s}}}" % tex, size, g, w)


def teleskop():
    """Proof 1 as on the board (Doc, 06.10.2026, over the first version "wie kommt man auf 1 minus 1/2 plus 1/2?"):
    every summand as a difference, one row each, written under each other - then the rows added, the minus of one
    row struck out with the plus of the next, one click each; 1 and -1/2^n are left."""
    c = S.Canvas(W, H)
    LHS, EQ, MIN, SUB = 64, 116, 172, 258
    rows = ((30, r"\frac{1}{2}", "1", r"-\frac{1}{2}"),
            (82, r"\frac{1}{4}", r"\frac{1}{2}", r"-\frac{1}{4}"),
            (134, r"\frac{1}{8}", r"\frac{1}{4}", r"-\frac{1}{8}"),
            (176, r"\vdots", r"\vdots", r"\vdots"),
            (222, r"\frac{1}{2^n}", r"\frac{1}{2^{n-1}}", r"-\frac{1}{2^n}"))
    words = []
    for y, lhs, a, b in rows:
        words += [term(LHS, y, lhs), term(MIN, y, a), term(SUB, y, b)]
        if lhs != r"\vdots":
            words.append(term(EQ, y, "=", w=30))
    # click 0: add all rows - the plus, the line, the sum on the left
    ghost(c, 0)
    c.line(14, 252, 312, 252, S.INK, 1.6)
    c.raw("</g>")
    words += [term(20, 222, "+", w=24, g=0), term(LHS, 290, "S_n", g=0)]
    # clicks 1 and 2: the pairs that cancel, a dashed line from the minus of one row to the plus of the next
    pairs = (((SUB, 30, r"-\frac{1}{2}"), (MIN, 82, r"\frac{1}{2}"), 1),
             ((SUB, 82, r"-\frac{1}{4}"), (MIN, 134, r"\frac{1}{4}"), 2),
             ((SUB, 134, r"-\frac{1}{8}"), (MIN, 176, None), 2),
             ((SUB, 176, None), (MIN, 222, r"\frac{1}{2^{n-1}}"), 2))
    for (x1, y1, t1), (x2, y2, t2), g in pairs:
        ghost(c, g)
        c.line(x1 - 18, y1 + 12, x2 + 18, y2 - 12, S.RED, 1.4, dash="4 4")
        c.raw("</g>")
        words += [strike(x, y, t, g=g) for x, y, t in ((x1, y1, t1), (x2, y2, t2)) if t]
    # click 3: what is left - the 1 at the top and -1/2^n at the bottom, and the result
    ghost(c, 3)
    c.raw('<ellipse cx="%s" cy="%s" rx="17" ry="17" fill="none" stroke="%s" stroke-width="2"/>' % (MIN, 30, S.GREEN))
    c.raw('<ellipse cx="%s" cy="%s" rx="30" ry="24" fill="none" stroke="%s" stroke-width="2"/>' % (SUB, 222, S.GREEN))
    c.raw("</g>")
    words += [term(EQ, 290, "=", w=30, g=3), term(MIN, 290, "1", g=3), term(SUB, 290, r"-\frac{1}{2^n}", g=3)]
    col, cw = 372, 430
    words += [
        lab(col, 4, cw, "Jede Zeile von eben, untereinander geschrieben: links der Summand, rechts dasselbe als "
                        "Differenz.", TEXT_CSS),
        lab(col, 62, cw, "Alle Zeilen addieren – links kommt die Summe heraus: $S_n$", TEXT_CSS, 0),
        lab(col, 108, cw, "Rechts ergeben $-\\frac{1}{2}$ aus Zeile 1 und $+\\frac{1}{2}$ aus Zeile 2 zusammen $0$.",
            TEXT_CSS, 1),
        lab(col, 166, cw, "Genauso $\\frac{1}{4}$, $\\frac{1}{8}$ und so weiter: Jeder Bruch steht einmal mit Minus "
                          "und eine Zeile tiefer mit Plus.", TEXT_CSS, 2),
        lab(col, 254, cw, "Übrig bleiben nur die $1$ ganz oben und $-\\frac{1}{2^n}$ ganz unten: "
                          "$S_n=1-\\frac{1}{2^n}$", TEXT_CSS, 3),
    ]
    return c.svg("Teleskopsumme: jeder Summand als Differenz, die Zeilen untereinander addiert, fast alles hebt sich "
                 "weg"), words


def verdoppeln():
    """Proof 2 as written subtraction: 2S_n over S_n, equal terms in one column - they cancel, 1 and 1/2^n are left."""
    c = S.Canvas(W, H)
    EQ = 134
    col = {"T1": 172, "P1": 204, "T2": 236, "P2": 268, "T3": 300, "P3": 332, "T4": 366, "P4": 400, "T5": 446,
           "P5": 494, "T6": 530}
    lhs = lambda y, tex, g=None: (66, y, 100, "$%s$" % tex, "font-size:21px;color:#0E244E;text-align:right", g)
    top = (("T1", "1"), ("P1", "+"), ("T2", r"\frac{1}{2}"), ("P2", "+"), ("T3", r"\frac{1}{4}"), ("P3", "+"),
           ("T4", r"\ldots"), ("P4", "+"), ("T5", r"\frac{1}{2^{n-1}}"))
    bottom = (("T2", r"\frac{1}{2}"), ("P2", "+"), ("T3", r"\frac{1}{4}"), ("P3", "+"), ("T4", r"\ldots"),
              ("P4", "+"), ("T5", r"\frac{1}{2^{n-1}}"), ("P5", "+"), ("T6", r"\frac{1}{2^n}"))
    words = [lhs(30, "2S_n"), term(EQ, 30, "=", w=30), lhs(88, "S_n"), term(EQ, 88, "=", w=30)]
    words += [term(col[k], 30, t, w=60) for k, t in top] + [term(col[k], 88, t, w=60) for k, t in bottom]
    # click 0: subtract - the minus, the line, and the terms that stand over each other struck out
    ghost(c, 0)
    c.line(14, 120, 560, 120, S.INK, 1.6)
    c.raw("</g>")
    words.append(term(64, 88, "-", w=24, g=0))
    for k, t in (("T2", r"\frac{1}{2}"), ("T3", r"\frac{1}{4}"), ("T4", r"\ldots"), ("T5", r"\frac{1}{2^{n-1}}")):
        words += [strike(col[k], 30, t, g=0, w=60), strike(col[k], 88, t, g=0, w=60)]
    # click 1: what is left
    words += [lhs(152, "2S_n-S_n", 1), term(EQ, 152, "=", w=30, g=1), term(col["T1"], 152, "1", w=60, g=1),
              term(col["P5"], 152, "-", w=30, g=1), term(col["T6"], 152, r"\frac{1}{2^n}", w=60, g=1)]
    words += [
        lab(40, 186, 740, "Oben steht $2S_n$: jeder Summand verdoppelt – aus $\\frac{1}{2}$ wird $1$, aus "
                          "$\\frac{1}{4}$ wird $\\frac{1}{2}$ und so weiter. Alles rückt eine Stelle nach vorn.",
            TEXT_CSS),
        lab(40, 250, 740, "Unten von oben abziehen: Was übereinander steht, ist gleich und hebt sich auf.", TEXT_CSS, 0),
        lab(40, 288, 740, "Übrig bleiben die $1$ vorn und $\\frac{1}{2^n}$ hinten: $S_n=1-\\frac{1}{2^n}$ – wie beim "
                          "Teleskop.", TEXT_CSS, 1),
    ]
    return c.svg("Die Summe mal 2 über der Summe, abgezogen: gleiche Summanden heben sich auf"), words


LB_FS = 19                                   # the Leibniz slides' formula size - six brackets fit in one row
LB_DY = 9                                    # a term as tall as a fraction stands this much below its label's middle
LB_PH = r"\vphantom{\dfrac{1}{2}}"           # every term as tall as a fraction: one baseline for the whole row
LB_FARBEN = ("#FFC000", "#BDD7EE", "#C5E0B4", "#F8CBAD", "#ADB9CA", "#B4A7D6")   # the six colours of Doc's slides
LB_GRAU = "#7a8294"                          # what is done to a line, grey as in vorrechnen ("| ·2")
# where the row "S = 1 + 3 + 6 + ..." stands - the same on the pyramid and both Leibniz slides, so it does not jump from
# one slide to the next (Doc, 06.10.2026: "die springt von 16 auf 17"): its left edge, its middle, the "∞" column
LB_X0, LB_R1, LB_RECHTS = 230, 18, 650
LB_TINTE_DY = 1.7                            # a row of fractions: the ink's middle below the row's middle (measured)
# the terms' widths at 19 px, measured in the deck (KaTeX ink + air): 1/n, 1/nn, "+", "=", S/2, ..., a bracket pair
LB_B = {"f1": 22, "f2": 32, "op": 24, "gl": 30, "S": 18, "S2": 24, "dots": 32, "paar": 96, "z1": 14, "z2": 26}


def lb_reihe(x, y, teile, hoch=True):
    """One row of a calculation, term by term from x, its middle (the fraction bars) on y: teile = [(tex, width,
    clicks)], clicks a dict for html_deck.figure_label ({"g": .., "kommt": True, "bis": ..}) or None. Returns the
    labels and each term's left edge."""
    words, kanten = [], []
    for tex, w, k in teile:
        kanten.append(x)
        # "=", "+", "-" alone: KaTeX spaces a sign only toward a neighbour it sees - the phantom on the left - so the sign
        # sat off-centre in its slot ("S  =1"); an empty group on each side gives it its air on both
        if tex in ("=", "+", "-"):
            tex = "{}%s{}" % tex
        css = "font-size:%dpx;color:#0E244E" % LB_FS
        words.append((x + w / 2, y - (LB_DY if hoch else 0), w, "$%s%s$" % (LB_PH if hoch else "", tex), css, k))
        x += w
    return words, kanten


def lb_g(c, g=None, bis=None):
    """An svg group that comes with click g (not there before) and/or goes once group `bis` is on."""
    c.raw('<g%s%s%s>' % (' class="step kommt"' if g is not None else "", ' data-g="%d"' % g if g is not None else "",
                          ' data-bis="%d"' % bis if bis is not None else ""))


def leibniz(z=1, ende=True):
    """Doc's slides 110 and 111 (Gebrochene Zahlen.pptx, 2025: "A Highlight - Die Summe der Kehrwerte der
    Dreieckszahlen"), rebuilt click for click (Doc, 06.10.2026: "genauso wie sie da sind", "natürlich animierend"):
    S = z/1 + z/3 + z/6 + ..., halved term by term, each half written as a difference in its own colour - and
    (ende, slide 110) the brackets gone, a red frame with "= 0" on each pair that cancels, the pair fading into "+ 0",
    the rest covered, S/2 = z/1.
    z = 2 is slide 111, the same with every term doubled - S/2 = 2, so S = 4 (Doc's 111 stopped at the line without
    brackets; its end as on 110, Doc, 06.10.2026: "dass die Summe wieder 2 ist ... mit hinschreiben" - it is S/2 that is
    2 again, S is 4, as on his slide 112). Doc's 111 has 1/4 in its third bracket - written 2/4."""
    c = S.Canvas(W, H)
    B = LB_B
    fr = lambda a, b: r"\dfrac{%d}{%d}" % (a, b)
    fb = lambda n: B["f1"] if n < 10 else B["f2"]
    kl = lambda g: {"g": g, "kommt": True}
    words = []
    # rows 4 and 5 as far apart as rows 3 and 4: about 12 px between their boxes (Doc, 06.10.2026: "Guck dir bitte den
    # Abstand der anderen an und das hier ist nach oben hin zu eng")
    R1, R2, R3, R4, R5 = LB_R1, 72, 134, 204, 286
    X0, RECHTS = LB_X0, LB_RECHTS            # rows 1-3 start right of the arrow; the "∞" and "?" column
    # row 1, standing: the triangular numbers themselves - their sum grows beyond every bound
    teile = [("S", B["S"], None), ("=", B["gl"], None)]
    for i, n in enumerate((1, 3, 6, 10, 15, 21)):
        teile += ([("+", B["op"], None)] if i else []) + [(str(n), B["z1"] if n < 10 else B["z2"], None)]
    w, _ = lb_reihe(X0, R1, teile + [("+", B["op"], None), (r"\ldots", B["dots"], None)], hoch=False)
    words += w + [(RECHTS, R1, 30, r"$\infty$", "font-size:%dpx;color:#0E244E" % LB_FS, None)]
    # row 2: their reciprocals (times z), term by term as on Doc's slide - 1/15 and 1/21 come together
    nenner = (1, 3, 6, 10, 15, 21)
    teile = [("S", B["S"], kl(0)), ("=", B["gl"], kl(1))]
    for i, n in enumerate(nenner):
        g = 2 + min(i, 4)
        teile += ([("+", B["op"], kl(g))] if i else []) + [(fr(z, n), fb(n), kl(g))]
    w, _ = lb_reihe(X0, R2, teile + [("+", B["op"], kl(7)), (r"\cdots", B["dots"], kl(7))])
    words += w + [(RECHTS, R2, 30, "$?$", "font-size:%dpx;color:#0E244E" % LB_FS, kl(8))]
    # click 9: halve - the red arrow from row 2 to row 3
    lb_g(c, 9)
    pfeil = c.arrowhead(S.RED)
    c.raw('<path d="M %s %s C %s %s %s %s %s %s" fill="none" stroke="%s" stroke-width="1.8" marker-end="url(#%s)"/>'
          % (X0 - 6, R2 - 6, X0 - 52, R2 + 8, X0 - 52, R3 - 8, X0 - 8, R3 + 4, S.RED, pfeil))
    c.raw("</g>")
    words.append((X0 - 66, (R2 + R3) / 2, 40, r"$\textcolor{#B02418}{:2}$", "font-size:%dpx" % (LB_FS - 2), kl(9)))
    # row 3: S/2, term by term; the colours come later, each with its bracket in row 4
    nenner2 = (2, 6, 12, 20, 30, 42)
    teile = [(r"\dfrac{S}{2}", B["S2"], kl(10)), ("=", B["gl"], kl(11))]
    for i, n in enumerate(nenner2):
        g = 12 + min(i, 4)
        teile += ([("+", B["op"], kl(g))] if i else []) + [(fr(z, n), fb(n), kl(g))]
    w3, kanten3 = lb_reihe(X0, R3, teile + [("+", B["op"], kl(17)), (r"\cdots", B["dots"], kl(17))])
    words += w3
    terme3 = [(kanten3[2 + 2 * i], fb(n)) for i, n in enumerate(nenner2)]
    # row 4: every half as a difference, in the colour of its half above - one click each
    teile = [(r"\dfrac{S}{2}", B["S2"], kl(18)), ("=", B["gl"], kl(18))]
    for i in range(6):
        teile += ([("+", B["op"], kl(19 + i))] if i else []) + \
                 [(r"\left(\!%s-%s\!\right)" % (fr(z, i + 1), fr(z, i + 2)), B["paar"], kl(19 + i))]
    w4, kanten4 = lb_reihe(16, R4, teile + [(r"\cdots", B["dots"], kl(24))])
    words += w4
    # the coloured boxes: behind the half in row 3 and behind its bracket - on the ink's middle, measured in the deck
    # (Doc, 06.10.2026: "alle ein Stück zu hoch. Und ein Stück zu weit links"): a fraction's ink lies 1.7 px below its
    # row's middle, a bracket pair's 5.9 px below and 1.8 px right of its slot's middle, 78 x 55 px
    for i in range(6):
        lb_g(c, 19 + i)
        x3, b3 = terme3[i]
        c.rect(x3, R3 - 28 + LB_TINTE_DY, b3, 56, fill=LB_FARBEN[i], rx=3)
        c.rect(kanten4[2 + 2 * i] + B["paar"] / 2 + 1.8 - 45, R4 + 5.9 - 33.5, 90, 67, fill=LB_FARBEN[i], rx=3)
        c.raw("</g>")
    # row 5: the brackets gone - every fraction once with minus and right after with plus
    # with ende (slide 110), per pair two clicks (Doc, 06.10.2026: "unter die Box ... ist gleich null", "minus ein halb,
    # plus ein halb ausfaden und da einfach schreiben plus null"): 26 + 2j the red frame and "= 0" under it, 27 + 2j the
    # pair fades out and "+ 0" fades in where it stood; DECKEL takes the rest away, then "| ·2" and the whole sum
    DECKEL = 36
    paar = (lambda j: dict(kl(25), bis=27 + 2 * j, sanft=True)) if ende else (lambda j: kl(25))
    teile = [(r"\dfrac{S}{2}", B["S2"], kl(25)), ("=", B["gl"], kl(25)), (fr(z, 1), B["f1"], kl(25))]
    for j, n in enumerate(range(2, 7)):
        teile += [("-", B["op"], paar(j)), (fr(z, n), B["f1"], paar(j)), ("+", B["op"], paar(j)), (fr(z, n), B["f1"], paar(j))]
    w5, kanten5 = lb_reihe(16, R5, teile + [(r"\cdots", B["dots"], dict(kl(25), bis=DECKEL) if ende else kl(25))])
    words += w5
    if ende:
        for j in range(5):
            g = 26 + 2 * j
            links, rechts = kanten5[3 + 4 * j], kanten5[6 + 4 * j] + B["f1"]
            mitte = (links + rechts) / 2
            lb_g(c, g, g + 1)
            c.rect(links + 2, R5 - 28 + LB_TINTE_DY, rechts - links - 2, 56, stroke=S.RED, width=2.4, rx=3)
            c.raw("</g>")
            words.append((mitte, R5 + 40, 60, r"$\textcolor{#B02418}{=0}$", "font-size:%dpx" % (LB_FS - 2), dict(kl(g), bis=g + 1)))
            words.append((mitte, R5 - LB_DY, 60, r"$%s+\textcolor{#B02418}{0}$" % LB_PH, "font-size:%dpx;color:#0E244E" % LB_FS,
                          dict(kl(g + 1), bis=DECKEL, sanft=True)))
        lb_g(c, DECKEL)
        c.raw("</g>")                        # this click shows nothing - it takes the rest away (data-bis above)
        # then what is left, times 2; then the result on its own (Doc, 06.10.2026: "einen Zwischenschritt ..., wo dann
        # steht am Ende S ist gleich zwei. Und dann erst die helle Box"); then the whole sum in its frame - further
        # right, its line thinner and its light fill letting the picture behind through ("ziemlich dicht geklatscht")
        words.append((kanten5[3] + 30, R5 - LB_DY, 60, r"$%s\textcolor{%s}{\vert\;\cdot 2}$" % (LB_PH, LB_GRAU),
                      "font-size:%dpx" % LB_FS, kl(DECKEL + 1)))
        # one formula, its own spacing - with the arrow that it follows (Doc: "noch ein Pfeil ... der dahin deutet")
        words += lb_reihe(kanten5[3] + 80, R5, [(r"\Rightarrow\;S=%d" % (2 * z), 100, kl(DECKEL + 2))])[0]
        teile = []
        for i, n in enumerate(nenner):
            teile += ([("+", B["op"], kl(DECKEL + 3))] if i else []) + [(fr(z, n), fb(n), kl(DECKEL + 3))]
        teile += [("+", B["op"], kl(DECKEL + 3)), (r"\cdots", B["dots"], kl(DECKEL + 3)), ("=", B["gl"], kl(DECKEL + 3)),
                  ("%d" % (2 * z), B["z1"], kl(DECKEL + 3))]
        breite = sum(t[1] for t in teile)
        x0 = 784 - breite
        lb_g(c, DECKEL + 3)
        c.raw('<rect x="%s" y="%s" width="%s" height="64" rx="4" fill="#DCE8F6" fill-opacity="0.35" stroke="%s" '
              'stroke-width="1"/>' % (S.fmt(x0 - 16), S.fmt(R5 - 32 + LB_TINTE_DY), S.fmt(breite + 32), S.INK))
        c.raw("</g>")
        words += lb_reihe(x0, R5, teile)[0]
    if ende and z == 1:
        # 10 px lower than the other slides' sources, clear of the "= 0" (Doc, 06.10.2026: "sonst sieht es so geklatscht aus")
        words.append((W / 2, SOURCE_TOP + 10, W, "Die Aufgabe stellte Christiaan Huygens 1672 in Paris dem jungen Leibniz – "
                                            "er fand 2 (Wikipedia: List of sums of reciprocals)", "font-size:10px", None))
    return c.svg("Die Summe der Kehrwerte der Dreieckszahlen, halbiert, jede Hälfte als Differenz, fast alles hebt sich "
                 "weg"), words


def dreieckszahlen():
    """Doc's slide 109 (Gebrochene Zahlen.pptx) before the Leibniz slides (Doc, 06.10.2026: "diese eine Folie ... mit den
    Dreieckszahlen, mit dieser Pyramide ... sonst weiß ja keiner, was Dreieckszahlen sind"), click for click as there:
    the sum term by term, the pyramid of dots row by row, then each row's count, then "∞"."""
    c = S.Canvas(W, H)
    B = LB_B
    kl = lambda g: {"g": g, "kommt": True}
    zahlen = (1, 3, 6, 10, 15, 21)
    teile = [("S", B["S"], kl(0)), ("=", B["gl"], kl(1))]
    for i, n in enumerate(zahlen):
        g = 2 + min(i, 4)                    # 15 and 21 come together, as on Doc's slide
        teile += ([("+", B["op"], kl(g))] if i else []) + [(str(n), B["z1"] if n < 10 else B["z2"], kl(g))]
    teile += [("+", B["op"], kl(7)), (r"\ldots", B["dots"], kl(7))]
    words = lb_reihe(LB_X0, LB_R1, teile, hoch=False)[0]
    words.append((LB_RECHTS, LB_R1, 30, r"$\infty$", "font-size:%dpx;color:#0E244E" % LB_FS, kl(20)))
    # the pyramid: row r has r dots - a row per click; then the count of dots up to that row, a click each
    MX, DX, Y0, DY, R = 380, 37, 96, 37, 15
    for r in range(1, 7):
        y = Y0 + (r - 1) * DY
        lb_g(c, 7 + r)
        for i in range(r):
            c.circle(MX + (i - (r - 1) / 2) * DX, y, R, S.INK, S.INK, 0)
        c.raw("</g>")
        words.append((MX + (r - 1) / 2 * DX + R + 30, y, 40, "$%d$" % zahlen[r - 1],
                      "font-size:%dpx;color:#0E244E;text-align:left" % (LB_FS - 1), kl(13 + r)))
    return c.svg("Die Dreieckszahlen: 1, 3, 6, 10, 15, 21 Punkte, als Dreieck gelegt"), words


def uebung():
    """A practice before the claim (Doc, 06.10.2026: "eine Folie, wo genau diese Bruchrechendinger geübt werden ... was
    ist ein Viertel plus ein Halb ... dass man das nochmal kurz übt"): six sums the board of partial sums needs, the task
    standing, then with a click the fraction brought to the other's denominator - it and its old form in one colour,
    the summands' colours of the board (1/2 yellow, 1/4 blue), over it very small "erweitern mit 2" (Doc, 06.10.2026:
    "da drüber ganz klein erweitern mit zwei") - then with a click the result."""
    c = S.Canvas(W, H)
    B = LB_B
    fr = lambda a, b: r"\dfrac{%d}{%d}" % (a, b)
    kl = lambda g: {"g": g, "kommt": True}
    F, f1, f2 = LB_FARBEN, B["f1"], B["f2"]
    words = []
    # (left, sign, right), the left and right expanded, the result, the side that is expanded (0, 1), its colour, the
    # factor it is expanded by
    aufgaben = (
        ((fr(1, 4), f1), "+", (fr(1, 2), f1), (fr(1, 4), f1), (fr(2, 4), f1), (fr(3, 4), f1), 1, F[0], 2),
        ((fr(1, 2), f1), "+", (fr(1, 8), f1), (fr(4, 8), f1), (fr(1, 8), f1), (fr(5, 8), f1), 0, F[0], 4),
        ((fr(3, 4), f1), "+", (fr(1, 8), f1), (fr(6, 8), f1), (fr(1, 8), f1), (fr(7, 8), f1), 0, F[5], 2),
        ((fr(1, 4), f1), "+", (fr(1, 8), f1), (fr(2, 8), f1), (fr(1, 8), f1), (fr(3, 8), f1), 0, F[1], 2),
        ((fr(7, 8), f1), "+", (fr(1, 16), f2), (fr(14, 16), f2), (fr(1, 16), f2), (fr(15, 16), f2), 0, F[4], 2),
        (("1", B["z1"]), "-", (fr(1, 8), f1), (fr(8, 8), f1), (fr(1, 8), f1), (fr(7, 8), f1), 0, F[5], 8),
    )
    for k, (l, op, r, l2, r2, erg, seite, farbe, faktor) in enumerate(aufgaben):
        spalte, zeile = divmod(k, 3)
        EQ, y, g = (180, 560)[spalte], (55, 160, 265)[zeile], 2 * k
        # the task stands, its "=" in one column; then the expanded sum, then the result
        teile = [(l[0], l[1], None), (op, B["op"], None), (r[0], r[1], None)]
        w1, k1 = lb_reihe(EQ - sum(t[1] for t in teile), y, teile + [("=", B["gl"], None)])
        teile = [(l2[0], l2[1], kl(g)), (op, B["op"], kl(g)), (r2[0], r2[1], kl(g)),
                 ("=", B["gl"], kl(g + 1)), (erg[0], erg[1], kl(g + 1))]
        w2, k2 = lb_reihe(EQ + B["gl"], y, teile)
        words += w1 + w2
        # small, dark blue, clear above its box (Doc, 06.10.2026: "ein bisschen kleiner, ein bisschen höher und dunkelblau")
        words.append((k2[2 * seite] + (l2, r2)[seite][1] / 2, y - 38, 90, "erweitern mit %d" % faktor,
                      "font-size:9.5px;color:#0E244E", kl(g)))
        lb_g(c, g)
        for x, b in ((k1[2 * seite], (l, r)[seite][1]), (k2[2 * seite], (l2, r2)[seite][1])):
            c.rect(x, y - 25 + LB_TINTE_DY, b, 50, fill=farbe, rx=3)
        c.raw("</g>")
    return c.svg("Übung: Brüche addieren - erst auf den gleichen Nenner"), words


def teleskop_box():
    """The live sum of the Teleskop board as html_deck's frame dict: slide coordinates (the picture box starts at 72,
    146), 90 px high around the row "S = ..." (R3 = 240 of teleskop_tafel); its sum 4 px in, so it starts where the
    row's "1" stood - right after "S =" (16 + 18 + 30 = 64), room to grow to the right; with click 27 (teleskop_tafel's
    DECKEL + 1), when the pairs are gone and the "1" goes."""
    # 1.5 px higher than the row's ink middle: its fraction bars then lie exactly on the board's "=" (measured in the deck)
    return dict(src="unendliche-summe-live.html", x=72 + 60, y=146 + 240 + LB_TINTE_DY - 45 - 1.5, w=756, h=90, g=27,
                title="Die Summe läuft gegen 1 - klicken")


def verdoppeln_box():
    """The live "S_10 = 1 - 1/1024 = 0,999023" of the Beweis 2 board (unendliche-summe-live.html?modus=formel) as
    html_deck's frame dict: its S right above the S_4 of the board's last row (b2_s4_mitte; its first slot is 34 wide,
    the sum 4 px into the frame); 90 px high around row R3 = 184 of verdoppeln_tafel (the row 2S_4 = 1 + ...), on the
    row's ink middle - its "=" on that row's "=" (measured); room to 816; with click 12, with the arrow from S_4."""
    links = b2_s4_mitte() - 17 - 4
    return dict(src="unendliche-summe-live.html?modus=formel", x=72 + links, y=146 + 184 + LB_TINTE_DY - 45, w=816 - links,
                h=90, g=12, title="Teilsummen: S10, S11, ... - klicken")


def teilsummen():
    """Bullets 3 and 4 of "Die Behauptung" as a board (Doc, 06.10.2026: "S1 = 1/2, S2 = 3/4 - warum S3 = 7/8? Wo kommt
    die Teilsumme her? ... die wollen das ja gerade lernen"): row k is S_k, the first k summands - the old ones at once,
    the new one with its own click; then all on one denominator, each piece in its summand's colour; the result; then a
    bar from 0 to 1 in the same colours, the gap to 1 red - always as big as the last summand. Last S_10: its gap can no
    longer be seen. In rows 2 and 3 the expanding stands as a step of its own, its factor red in numerator and
    denominator (Doc, 06.10.2026: "wie kommst du ... auf 2/4? ... der Schritt fehlt und das sind so die Details, wo die
    Kids total stolpern") - each row is one calculation, written on; only the results stand in one column. The bars
    small and on the right, room for the calculation (Doc: "ein bisschen kleiner ... nach rechts")."""
    c = S.Canvas(W, H)
    B = LB_B
    fr = lambda a, b: r"\dfrac{%d}{%d}" % (a, b)
    nb = lambda n: B["f1"] if n < 10 else (B["f2"] if n < 100 else 52)    # 1/1024: four digits
    kl = lambda g: {"g": g, "kommt": True}
    words = []
    erw = lambda f: r"\textcolor{#B02418}{\cdot %d}" % f   # the factor a fraction is expanded by
    X0, SK = 16, 30                              # "S_k" and its slot
    B_ERW = 50                                   # an expanded fraction, 1·4 over 2·4
    EC = 532                                     # the results' "=": right of row 3, the longest calculation
    RX = EC + B["gl"] + 26                       # the results, centred under each other (Doc: "Zentralalignierung")
    BX, BW, BH = 642, 112, 14                    # the bar from 0 to 1
    LUECKE = BX + BW + 46                        # the gap's fraction - well right of its bar (Doc: "ein deutliches Stück")
    ROT_HELL = "#F6D5D1"
    ZEILEN, R10, PUNKTE = (28, 88, 148, 208), 300, 245

    def kasten(x, w, y, g, farbe):
        lb_g(c, g)
        c.rect(x, y - 25 + LB_TINTE_DY, w, 50, fill=LB_FARBEN[farbe], rx=3)
        c.raw("</g>")

    def balken(y, k, n, g, rest=None):
        """The bar for S_k: the summands 1/2 .. 1/2^k in their colours, then (rest) the further summands up to 1/n in
        grey, the gap 1/n red - with its fraction."""
        lb_g(c, g)
        top, x = y - BH / 2 + LB_TINTE_DY, BX
        for i in range(1, k + 1):
            c.rect(x, top, BW / 2 ** i, BH, fill=LB_FARBEN[i - 1], stroke="#FFFFFF", width=1)
            x += BW / 2 ** i
        if rest:
            c.rect(x, top, BX + BW - BW / n - x, BH, fill="#D9DEE8", stroke="#FFFFFF", width=1)
        c.rect(BX, top, BW, BH, stroke=S.INK, width=1.2)
        c.rect(BX + BW - BW / n, top, BW / n, BH, fill=ROT_HELL, stroke=S.RED, width=1.4)
        c.raw("</g>")
        words.extend(lb_reihe(LUECKE - nb(n) / 2, y, [(r"\textcolor{#B02418}{%s}" % fr(1, n), nb(n), kl(g))])[0])

    g = 0
    for k, y in enumerate(ZEILEN, 1):
        n = 2 ** k
        # column A: S_k = the summands of the row above, at once; then the new one
        teile = [("S_{%d}" % k, SK, kl(g)), ("=", B["gl"], kl(g))]
        for i in range(1, k + 1):
            neu = g + 1 if k > 1 and i == k else g
            teile += ([("+", B["op"], kl(neu))] if i > 1 else []) + [(fr(1, 2 ** i), nb(2 ** i), kl(neu))]
        wa, ka = lb_reihe(X0, y, teile)
        words += wa
        g += 2 if k > 1 else 1
        x = ka[-1] + nb(n)                       # the calculation writes on from here
        if k in (2, 3):
            # expanded: numerator and denominator times the same factor, in red - each piece in its colour, and its
            # summand in column A with it
            teile, breiten = [("=", B["gl"], kl(g))], []
            for i in range(1, k + 1):
                f = 2 ** (k - i)
                tex = fr(1, 2 ** i) if f == 1 else r"\dfrac{1%s}{%d%s}" % (erw(f), 2 ** i, erw(f))
                breiten.append(nb(n) if f == 1 else B_ERW)
                teile += ([("+", B["op"], kl(g))] if i > 1 else []) + [(tex, breiten[-1], kl(g))]
            we, ke = lb_reihe(x, y, teile)
            words += we
            for i in range(1, k + 1):
                kasten(ka[2 * i], nb(2 ** i), y, g, i - 1)
                kasten(ke[2 * i - 1], breiten[i - 1], y, g, i - 1)
            x = ke[-1] + breiten[-1]
            g += 1
        if k > 1:
            # every summand on the denominator 2^k, in its colour (row 4: its summand in column A with it)
            teile = [("=", B["gl"], kl(g))]
            for i in range(1, k + 1):
                teile += ([("+", B["op"], kl(g))] if i > 1 else []) + [(fr(2 ** (k - i), n), nb(n), kl(g))]
            wb, kb = lb_reihe(x, y, teile)
            words += wb
            for i in range(1, k + 1):
                if k == 4:
                    kasten(ka[2 * i], nb(2 ** i), y, g, i - 1)
                kasten(kb[2 * i - 1], nb(n), y, g, i - 1)
            g += 1
        # column C: the result
        words += lb_reihe(EC, y, [("=", B["gl"], kl(g))])[0] + lb_reihe(RX - nb(n) / 2, y, [(fr(n - 1, n), nb(n), kl(g))])[0]
        if k == 1:
            # what the blue column is, over it - the twin of "fehlt bis 1" (Doc, 06.10.2026: "über die blauen schreiben wir
            # drüber ... bis n")
            # 2 px higher than "fehlt bis 1": the formula n sits its line lower (measured in the deck)
            words.append((RX, y - 43, 90, "Summe bis $n$", "font-size:13px;color:#0E244E", kl(g)))
        g += 1
        if k == 1:
            kasten(ka[2], nb(2), y, g, 0)           # S_1 has no column B - its colour comes with its bar
            for x, t in ((BX, "0"), (BX + BW, "1")):
                words.append((x, y - 21, 20, "$%s$" % t, "font-size:14px;color:%s" % S.MUTED, kl(g)))
            # what the red column means, over it (Doc, 06.10.2026: "die roten ist was noch zur Eins fehlt ... müsste man
            # auch mal irgendwie vernünftig drüber schreiben")
            words.append((LUECKE, y - 41, 80, "fehlt bis 1", "font-size:13px;color:#B02418", kl(g)))
        balken(y, k, n, g)
        g += 1
    # and much further: S_10 - the gap is still there, but no longer to be seen
    for x in (X0 + SK / 2, RX, LUECKE):
        words.append((x, PUNKTE, 30, r"$\vdots$", "font-size:%dpx;color:#0E244E" % LB_FS, kl(g)))
    teile = [("S_{10}", SK, kl(g)), ("=", B["gl"], kl(g)), (fr(1, 2), B["f1"], kl(g)), ("+", B["op"], kl(g)),
             (fr(1, 4), B["f1"], kl(g)), ("+", B["op"], kl(g)), (r"\cdots", B["dots"], kl(g)), ("+", B["op"], kl(g)),
             (fr(1, 1024), 52, kl(g))]
    wa, ka = lb_reihe(X0, R10, teile)
    words += wa
    for farbe, i in ((0, 2), (1, 4)):
        kasten(ka[i], B["f1"], R10, g, farbe)
    words += lb_reihe(EC, R10, [("=", B["gl"], kl(g + 1))])[0] + lb_reihe(RX - 26, R10, [(fr(1023, 1024), 52, kl(g + 1))])[0]
    balken(R10, 4, 1024, g + 2, rest=True)
    return c.svg("Die Teilsummen: ein Halb, drei Viertel, sieben Achtel, fünfzehn Sechzehntel - bis zur 1 fehlt immer "
                 "der letzte Summand"), words


def teleskop_vorbereitung():
    """Before the board, as Doc's slide 108 ("Vorbereitung - Übung: Berechne und kürze"): the differences the proof is
    made of, one per row - the left side stands, the class works it out. With a click the step between (Doc, 06.10.2026:
    "immer einen Zwischenschritt mitschreiben"): the left one expanded to the right one's denominator, both in one colour
    - the summands' colours of the board; "erweitern mit 2" once over that column, the factor is 2 in every row (as
    "Summe bis n" over the board's column); with a click the result. Every sign in a
    column of its own, the minus signs under each other as the equals signs ("richtig schön ordentlich"), each fraction
    centred in its column."""
    c = S.Canvas(W, H)
    B = LB_B
    fr = lambda a, b: r"\dfrac{%d}{%d}" % (a, b)
    fb = lambda n: B["f1"] if n < 10 else B["f2"]
    kl = lambda g: {"g": g, "kommt": True}
    F = LB_FARBEN
    words = []
    # the columns: task, "=", the step between, "=", result - a fraction's column, a minus sign's, an equals sign's
    SL, SO, SG = 32, 40, 52
    spalten, x = [], (W - 5 * SL - 2 * SO - 2 * SG) / 2
    for w in (SL, SO, SL, SG, SL, SO, SL, SG, SL):
        spalten.append(x + w / 2)
        x += w
    def setze(i, y, tex, w, klick):
        words.extend(lb_reihe(spalten[i] - w / 2, y, [(tex, w, klick)])[0])
    # rows 68 apart, the boxes 54 high - a fraction's box as tall as on the boards (Doc, 06.10.2026: "beim Bruch sind die
    # zu flach"), the last one still inside the picture (the svg cuts at 330)
    words.append((spalten[4], -12, 140, "erweitern mit 2", "font-size:13px;color:#0E244E", kl(0)))
    for k, (n, farbe) in enumerate(((1, F[5]), (2, F[0]), (4, F[1]), (8, F[2]), (16, F[3]))):
        y, g, m = 29 + 68 * k, 2 * k, 2 * n
        links, lb = ("1", B["z1"]) if n == 1 else (fr(1, n), fb(n))
        setze(0, y, links, lb, None)
        setze(1, y, "-", SO, None)
        setze(2, y, fr(1, m), fb(m), None)
        setze(3, y, "=", SG, None)
        setze(4, y, fr(2, m), fb(m), kl(g))
        setze(5, y, "-", SO, kl(g))
        setze(6, y, fr(1, m), fb(m), kl(g))
        setze(7, y, "=", SG, kl(g + 1))
        setze(8, y, fr(1, m), fb(m), kl(g + 1))
        lb_g(c, g)
        for i, w in ((0, lb), (4, fb(m))):
            c.rect(spalten[i] - w / 2, y - 27 + LB_TINTE_DY, w, 54, fill=farbe, rx=3)
        c.raw("</g>")
    return c.svg("Vorbereitung: 1 minus ein Halb, ein Halb minus ein Viertel und so weiter"), words


def teleskop_tafel():
    """Proof 1 in Doc's way (Doc, 06.10.2026, after his Leibniz slides: "wenn du das ... so Schritt für Schritt beibringen
    willst, ist das so, wie ich es da mal gemacht habe, besser" - "bauen wir den ersten Beweis, Teleskop"): one board that
    grows. S = 1/2 + 1/4 + ... term by term, "?"; every term as its double minus itself, each in its colour together
    with its term above; the brackets gone, a red frame and "= 0" on each pair that cancels, the pair fading into "+ 0";
    the last minus, -1/32, cancelled too by the next bracket's plus, then the dots; S = 1 is left, then the whole sum in
    its box on that row."""
    c = S.Canvas(W, H)
    B = LB_B
    fr = lambda a, b: r"\dfrac{%d}{%d}" % (a, b)
    fb = lambda n: B["f1"] if n < 10 else B["f2"]
    kl = lambda g: {"g": g, "kommt": True}
    words = []
    R1, R2, R3 = 40, 132, 240                    # three rows - the box stands on the last (no row 4 any more)
    X0 = 16                                      # all rows begin with "S =" in one column
    nenner = (2, 4, 8, 16, 32)
    # row 1: the sum, term by term, and the question
    teile = [("S", B["S"], kl(0)), ("=", B["gl"], kl(1))]
    for i, n in enumerate(nenner):
        teile += ([("+", B["op"], kl(2 + i))] if i else []) + [(fr(1, n), fb(n), kl(2 + i))]
    w1, k1 = lb_reihe(X0, R1, teile + [("+", B["op"], kl(7)), (r"\cdots", B["dots"], kl(7))])
    words += w1 + [(k1[-1] + B["dots"] + 40, R1 - LB_DY, 30, "$%s?$" % LB_PH, "font-size:%dpx" % LB_FS, kl(8))]
    terme1 = [(k1[2 + 2 * i], fb(n)) for i, n in enumerate(nenner)]
    # row 2: every term is its double minus itself - one bracket per click, in the colour of its term above
    paare = [("1", 2)] + [(fr(1, n // 2), n) for n in nenner[1:]]
    breiten = [96, 96, 96, 106, 116]
    teile = [("S", B["S"], kl(9)), ("=", B["gl"], kl(9))]
    for i, ((a, n), b) in enumerate(zip(paare, breiten)):
        teile += ([("+", B["op"], kl(10 + i))] if i else []) + \
                 [(r"\left(\!%s-%s\!\right)" % (a, fr(1, n)), b, kl(10 + i))]
    w2, k2 = lb_reihe(X0, R2, teile + [(r"\cdots", B["dots"], kl(14))])
    words += w2
    for i, b in enumerate(breiten):
        lb_g(c, 10 + i)
        x1, b1 = terme1[i]
        c.rect(x1, R1 - 28 + LB_TINTE_DY, b1, 56, fill=LB_FARBEN[i], rx=3)
        mitte = k2[2 + 2 * i] + b / 2 + 1.8
        c.rect(mitte - (b - 6) / 2, R2 + 5.9 - 33.5, b - 6, 67, fill=LB_FARBEN[i], rx=3)
        c.raw("</g>")
    # row 3: the brackets gone - every fraction once with minus and right after with plus; the last minus, -1/32, gets its
    # plus too from the next bracket (1/32 - 1/64), so it becomes 0 as well, and only then the dots (Doc, 06.10.2026: "das
    # Minus 1/32 dann doch noch ausführen, sodass dann eben da auch 0 steht. Und dann danach Punkt, Punkt, Punkt")
    DECKEL = 26
    paar = lambda j: dict(kl(15), bis=17 + 2 * j, sanft=True)
    # its "1" makes way for the live sum when that comes (Doc, 07.10.2026: "nimm vorne hinter dem S die 1 weg, rück das
    # Ganze tatsächlich an das S ran") - the row then reads S = 1/2 + 1/4 + ... = 1
    teile = [("S", B["S"], kl(15)), ("=", B["gl"], kl(15)), ("1", B["z1"], dict(kl(15), bis=DECKEL + 1, sanft=True))]
    for j, n in enumerate(nenner):
        teile += [("-", B["op"], paar(j)), (fr(1, n), fb(n), paar(j)), ("+", B["op"], paar(j)), (fr(1, n), fb(n), paar(j))]
    w3, k3 = lb_reihe(X0, R3, teile + [(r"\cdots", B["dots"], dict(kl(15), bis=DECKEL))])
    words += w3
    for j, n in enumerate(nenner):
        g = 16 + 2 * j
        links, rechts = k3[3 + 4 * j], k3[6 + 4 * j] + fb(n)
        mitte = (links + rechts) / 2
        lb_g(c, g, g + 1)
        c.rect(links + 2, R3 - 28 + LB_TINTE_DY, rechts - links - 2, 56, stroke=S.RED, width=2.4, rx=3)
        c.raw("</g>")
        words.append((mitte, R3 + 40, 60, r"$\textcolor{#B02418}{=0}$", "font-size:%dpx" % (LB_FS - 2), dict(kl(g), bis=g + 1)))
        words.append((mitte, R3 - LB_DY, 60, r"$%s+\textcolor{#B02418}{0}$" % LB_PH, "font-size:%dpx" % LB_FS,
                      dict(kl(g + 1), bis=DECKEL, sanft=True)))
    lb_g(c, DECKEL)
    c.raw("</g>")                                # this click shows nothing - it takes the rest away (data-bis above)
    # the whole sum in its box, on the row "S = 1" - as on the Leibniz boards (Doc, 07.10.2026: "irgendwie stört mich das,
    # dass die Box so da unten steht. Mach die bitte echt wie bei Leibniz auf die Zeile von S ist gleich 1"), and alive:
    # HTML/unendliche-summe-live.html in a frame (Doc, the same morning: "Bau uns ein Widget, was genauso aussieht ...
    # weiter links ... genau auf der Seite, da läuft, wenn man es klickt") - teleskop_box() places it, with click DECKEL + 1
    lb_g(c, DECKEL + 1)
    c.raw("</g>")
    return c.svg("Teleskop: jeder Summand als Differenz, die Klammern weg, je zwei heben sich auf, übrig bleibt 1"), words


# a fraction's colour by its VALUE, the same on every board: 1/2 yellow, 1/4 blue, 1/8 green, 1/16 orange, 1/32 grey-blue,
# 1 lavender - the Teilsummen board, the Teleskop board and the Übung use them so
WERT_FARBE = {1: LB_FARBEN[5], 2: LB_FARBEN[0], 4: LB_FARBEN[1], 8: LB_FARBEN[2], 16: LB_FARBEN[3], 32: LB_FARBEN[4]}


def _pfeil_mal2(c, words, x, y1, y2, text=r"\cdot 2"):
    """The red bent arrow at the left margin from one row to the next with what is done ("·2"), as on the Leibniz
    boards (":2")."""
    pfeil = c.arrowhead(S.RED)
    c.raw('<path d="M %s %s C %s %s %s %s %s %s" fill="none" stroke="%s" stroke-width="1.8" marker-end="url(#%s)"/>'
          % (x, y1 + 4, x - 46, y1 + 16, x - 46, y2 - 16, x - 2, y2 - 4, S.RED, pfeil))
    return (x - 58, (y1 + y2) / 2, 40, r"$\textcolor{#B02418}{%s}$" % text, "font-size:%dpx" % (LB_FS - 2))


# Beweis 2's columns - the board and its live S_n both reckon with them. The whole calculation as far left as it goes,
# the columns as close as the "2 ·" allows (Doc, 07.10.2026: "nimm bitte die S4 und so alle weiter nach links", "S4 und
# S21 untereinander, gegebenenfalls alles noch ein Stück nach links")
B2_EQ, B2_TS, B2_OS, B2_T0 = 94, 44, 36, 124     # the "=" column; a term's column, a sign's column, the first column
B2_SCHLUSS = 34                                  # the last row's "=> S_4 = ..." begins this far right of the 4th column
PFEIL_MITTE = 43.3                               # its arrow's middle: halfway between the ink of 1/16 and of S_4


def b2_s4_mitte():
    """x of the middle of "S_4" in Beweis 2's last row "=> S_4 = 1 - 1/16 = 15/16"."""
    tc4 = B2_T0 + 4 * (B2_TS + B2_OS) + B2_TS / 2
    return tc4 + B2_SCHLUSS + 36 + 14


def verdoppeln_tafel():
    """Proof 2 as a board in Doc's way (Doc, 06.10.2026, on the old slide with 2S_n over S_n: "verstehe ich ehrlich gesagt
    überhaupt nicht" - "du kennst jetzt den Stil, mach alle Beweise so"): concrete, with S_4 = 1/2 + 1/4 + 1/8 + 1/16 -
    the sum of the Teilsummen board. Doubled term by term (the step between: 2·1/2 + 2·1/4 + ...), then the doubled
    sum written over the sum so that equal terms stand in one column - every term in the colour of its value -, a red
    frame round each pair that cancels and its 0 below; left are 1 and -1/16: S_4 = 1 - 1/16 = 15/16, as on the
    Teilsummen board. Then the same with S_10 and the whole sum in its box."""
    c = S.Canvas(W, H)
    B = LB_B
    fr = lambda a, b: r"\dfrac{%d}{%d}" % (a, b)
    fb = lambda n: B["f1"] if n < 10 else B["f2"]
    kl = lambda g: {"g": g, "kommt": True}
    fs = "font-size:%dpx;color:#0E244E" % LB_FS
    words = []
    # the rows further apart, the one with the grey arrows too (Doc, 07.10.2026: "die Y-Abstände müssen größer")
    R1, R2, R3, R4, R5, LINIE = 24, 98, 184, 250, 316, 284
    EQ, TS, OS, T0 = B2_EQ, B2_TS, B2_OS, B2_T0  # the "=" column; a term's column, a sign's column, the first column
    tc = [T0 + k * (TS + OS) + TS / 2 for k in range(5)]
    oc = [T0 + k * (TS + OS) - OS / 2 for k in range(5)]

    def setze(x, y, tex, w, klick):
        words.extend(lb_reihe(x - w / 2, y, [(tex, w, klick)])[0])

    def links(y, tex, w, klick):
        setze(EQ - w / 2, y, tex, w, klick)
        setze(EQ + B["gl"] / 2, y, "=", B["gl"], klick)

    def kasten(x, y, w, n, g):
        lb_g(c, g)
        c.rect(x - w / 2, y - 25 + LB_TINTE_DY, w, 50, fill=WERT_FARBE[n], rx=3)
        c.raw("</g>")

    def summe(y, spalten, g, boxen=True):
        """S_4's terms 1/2 .. 1/16 in the given columns, "+" between, each in the colour of its value."""
        for i, (k, n) in enumerate(zip(spalten, (2, 4, 8, 16))):
            if i:
                setze(oc[k], y, "+", OS, kl(g))
            setze(tc[k], y, fr(1, n), fb(n), kl(g))
            if boxen:
                kasten(tc[k], y, fb(n), n, g)

    # click 0: the sum; 1: times 2 - the red arrow; 2: each term doubled
    links(R1, "S_4", 28, kl(0))
    summe(R1, (1, 2, 3, 4), 0)
    lb_g(c, 1)
    w = _pfeil_mal2(c, words, EQ - 40, R1, R2)
    c.raw("</g>")
    words.append(w + (kl(1),))
    links(R2, "2S_4", 38, kl(2))
    # each fraction right under its fraction in the row above, the "2 ·" in front of it (Doc, 07.10.2026: "die Brüche
    # sollen bitte untereinander stehen"); the "+" in the middle of the gap left between two
    ZWEI = 28                                    # "2·" with its spaces, measured at 19 px
    for i, (k, n) in enumerate(zip((1, 2, 3, 4), (2, 4, 8, 16))):
        rechts = tc[k] - fb(n) / 2 - 1           # where "2·" ends
        if i:
            links_frei = tc[k - 1] + fb(n // 2) / 2
            setze((links_frei + rechts - ZWEI) / 2, R2, "+", OS, kl(2))
        words.append((rechts - 20, R2 - LB_DY, 40, r"$%s2\cdot{}$" % LB_PH, "font-size:%dpx;color:#0E244E;text-align:right"
                      % LB_FS, kl(2)))
        setze(tc[k], R2, fr(1, n), fb(n), kl(2))
    # click 3: what that is - every term one column to the front (thin grey arrows), each in the colour of its value
    links(R3, "2S_4", 38, kl(3))
    for i, (k, n) in enumerate(zip((0, 1, 2, 3), (1, 2, 4, 8))):
        if i:
            setze(oc[k], R3, "+", OS, kl(3))
        setze(tc[k], R3, "1" if n == 1 else fr(1, n), B["z1"] if n == 1 else fb(n), kl(3))
        kasten(tc[k], R3, B["z1"] + 6 if n == 1 else fb(n), n, 3)
    lb_g(c, 3)
    spitze = c.arrowhead(LB_GRAU)
    for k in range(1, 5):
        c.raw('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="1.2" marker-end="url(#%s)"/>'
              % (S.fmt(tc[k] - 14), R2 + 31, S.fmt(tc[k - 1] + 4), R3 - 32, LB_GRAU, spitze))
        # from under the middle of "2 · 1/n", clear of its denominator, to just above its box below - not touching
        # either (Doc, 07.10.2026: "die Pfeile passen noch nicht so")
    c.raw("</g>")
    # click 4: the sum once more under it, to be taken away - the minus at the margin, the line
    setze(EQ - 66, R4, "-", 24, kl(4))
    links(R4, "S_4", 28, kl(4))
    summe(R4, (1, 2, 3, 4), 4)
    lb_g(c, 4)
    c.line(36, LINIE, tc[4] + 30, LINIE, S.INK, 1.6)
    c.raw("</g>")
    # click 5: what is left in front; 6-8: a red frame round each pair that cancels, its 0 below; 9: what is left behind
    links(R5, "2S_4-S_4", 88, kl(5))
    setze(tc[0], R5, "1", B["z1"], kl(5))
    for j in (1, 2, 3):
        g = 5 + j
        lb_g(c, g)
        c.rect(tc[j] - 21, R3 - 27 + LB_TINTE_DY, 42, R4 - R3 + 54, stroke=S.RED, width=2.4, rx=3)
        c.raw("</g>")
        setze(oc[j], R5, "+", OS, kl(g))
        setze(tc[j], R5, r"\textcolor{#B02418}{0}", B["z1"], kl(g))
    setze(oc[4], R5, "-", OS, kl(9))
    setze(tc[4], R5, fr(1, 16), fb(16), kl(9))
    # 10: so S_4 is 1 minus the last summand; 11: the value - the Teilsummen board's 15/16
    # a plain arrow with one shaft, in the middle between the 1/16 before it and S_4 (Doc, 07.10.2026: "ein Pfeil mit nur
    # einem Schaft. Und in die Mitte zwischen 1/16 und S4") - S_4 keeps its place under the live S_n
    words.extend(lb_reihe(tc[4] + PFEIL_MITTE - 18, R5, [(r"\rightarrow", 36, kl(10))])[0])
    words.extend(lb_reihe(tc[4] + B2_SCHLUSS + 36, R5, [("S_4", 28, kl(10)), ("=", B["gl"], kl(10)),
                                                        ("1", B["z1"], kl(10)), ("-", B["op"], kl(10)), (fr(1, 16), fb(16), kl(10)),
                                                        ("=", B["gl"], kl(11)), (fr(15, 16), fb(16), kl(11))])[0])
    # 12: the same with ten summands - top right; 13: the whole sum in its box
    # 12: the same with more summands - S_10 = 1 - 1/1024 alive on the row of 2S_4 (verdoppeln_box: a click counts on
    # to S_21), a red arrow from the S_4 of the last row up to it; no "genauso" over it (Doc, 07.10.2026: "das Wort
    # genauso oben drüber weg. Und dann ... ein Pfeil vom S4 unten hoch zu S21 ... und das S21 aber weiter runter")
    # S_4 and the live S_10 ... S_21 stand under each other (Doc: "S4 und S21 untereinander"): the arrow goes straight up
    lb_g(c, 12)
    spitze_r = c.arrowhead(S.RED)
    x_s4 = b2_s4_mitte()
    c.raw('<path d="M %s %s L %s %s" fill="none" stroke="%s" stroke-width="1.8" marker-end="url(#%s)"/>'
          % (S.fmt(x_s4), R5 - 27, S.fmt(x_s4), R3 + 29, S.RED, spitze_r))
    c.raw("</g>")
    # (the box with the whole sum is gone: the live S_n says it - Doc, 07.10.2026: "brauchen wir dann die Box drunter
    # noch? ... Ich glaube nicht")
    return c.svg("Verdoppeln: S4 mal 2, darunter S4 abgezogen, gleiche Summanden heben sich auf, übrig bleiben 1 und "
                 "minus ein Sechzehntel"), words


def falle_tafel():
    """The trap as a board (Doc, 06.10.2026: "mach alle Beweise so"): the same trick, done fast without stopping - with
    T = 1 + 2 + 4 + 8 + ... - "gives" T = -1, a red "?"; then the partial sums beside it, 1, 3, 7, 15, ..., 1023 - they
    grow beyond every bound, T is no number at all, the -1 struck out. The bound: why proof 2 counts S_4, S_10 first."""
    c = S.Canvas(W, H)
    B = LB_B
    kl = lambda g: {"g": g, "kommt": True}
    words = []
    R1, R2, R3, R4, R5, LINIE = 26, 84, 140, 200, 262, 172
    EQ, TS, OS, T0 = 112, 30, 26, 142
    tc = [T0 + k * (TS + OS) + TS / 2 for k in range(6)]
    oc = [T0 + k * (TS + OS) - OS / 2 for k in range(6)]
    z = lambda v: B["z1"] if v < 10 else B["z2"]

    def setze(x, y, tex, w, klick):
        words.extend(lb_reihe(x - w / 2, y, [(tex, w, klick)], hoch=False)[0])

    def links(y, tex, w, klick):
        setze(EQ - w / 2, y, tex, w, klick)
        setze(EQ + B["gl"] / 2, y, "=", B["gl"], klick)

    def reihe(y, werte, spalte0, g):
        for i, v in enumerate(werte):
            if i:
                setze(oc[spalte0 + i], y, "+", OS, kl(g))
            setze(tc[spalte0 + i], y, r"\cdots" if v is None else str(v), B["dots"] if v is None else z(v), kl(g))

    links(R1, "T", 20, kl(0))
    reihe(R1, (1, 2, 4, 8, None), 0, 0)
    lb_g(c, 1)
    w = _pfeil_mal2(c, words, EQ - 30, R1, R2)
    c.raw("</g>")
    words.append(w + (kl(1),))
    links(R2, "2T", 30, kl(2))
    reihe(R2, (2, 4, 8, 16, None), 1, 2)
    setze(EQ - 54, R3, "-", 24, kl(3))
    links(R3, "T", 20, kl(3))
    reihe(R3, (1, 2, 4, 8, 16, None), 0, 3)
    lb_g(c, 3)
    c.line(30, LINIE, tc[5] + 24, LINIE, S.INK, 1.6)
    c.raw("</g>")
    links(R4, "2T-T", 84, kl(4))
    setze(tc[0], R4, "-1", 30, kl(4))
    for j in (1, 2, 3, 4):
        g = 4 + j
        lb_g(c, g)
        c.rect(tc[j] - 15, R2 - 19, 30, R3 - R2 + 38, stroke=S.RED, width=2.4, rx=3)   # the "+" between keeps its air
        c.raw("</g>")
        setze(oc[j], R4, "+", OS, kl(g))
        setze(tc[j], R4, r"\textcolor{#B02418}{0}", B["z1"], kl(g))
    setze(oc[5], R4, "+", OS, kl(9))
    setze(tc[5], R4, r"\cdots", B["dots"], kl(9))
    # 10: so T would be -1 - lauter positive Zahlen ... the red question
    words.extend(lb_reihe(EQ - 30, R5, [(r"\Rightarrow", 36, kl(10)), ("T", 20, kl(10)), ("=", B["gl"], kl(10)),
                                        ("-1", 30, kl(10))], hoch=False)[0])
    words.append((EQ + 110, R5, 30, r"$\textcolor{#B02418}{?}$", "font-size:%dpx" % (LB_FS + 9), kl(10)))
    # 11-15: the partial sums beside it, as on the Teilsummen board - the results in one column
    X, EC = 496, 716
    RX = EC + B["gl"] + 22
    words.append((RX, -12, 110, "Summe bis $n$", "font-size:13px;color:#0E244E", kl(11)))
    werte = (1, 2, 4, 8)
    for k, y in enumerate((22, 70, 118, 166), 1):
        g = 10 + k
        teile = [("T_{%d}" % k, 26, kl(g)), ("=", B["gl"], kl(g))]
        for i, v in enumerate(werte[:k]):
            teile += ([("+", 26, kl(g))] if i else []) + [(str(v), 18, kl(g))]
        words.extend(lb_reihe(X, y, teile, hoch=False)[0])
        setze(EC + B["gl"] / 2, y, "=", B["gl"], kl(g))
        setze(RX, y, str(2 ** k - 1), z(2 ** k - 1), kl(g))
    setze(X + 13, 202, r"\vdots", 30, kl(15))
    setze(RX, 202, r"\vdots", 30, kl(15))
    setze(X + 13, 240, "T_{10}", 34, kl(15))
    setze(EC + B["gl"] / 2, 240, "=", B["gl"], kl(15))
    setze(RX, 240, "1023", 44, kl(15))
    # 16: they grow beyond every bound - T is no number, the -1 is wrong
    setze(RX - 6, 290, r"\textcolor{#B02418}{\to\infty}", 80, kl(16))
    lb_g(c, 16)
    c.line(EQ + 6, R5 + 14, EQ + 96, R5 - 14, S.RED, 2.6)
    c.raw("</g>")
    return c.svg("Die Falle: derselbe Trick mit 1 + 2 + 4 + 8 + ... ergibt scheinbar minus 1, die Teilsummen wachsen "
                 "aber über jede Grenze"), words


def quadrat_tafel():
    """Proof 3, the square, in Doc's way (06.10.2026: "mach alle Beweise so"): the pieces in the colours of their values
    - as on all boards -, the red outlined rest that is still missing, as big as the last piece; beside it the partial
    sums with "Summe bis n" and "fehlt bis 1", row by row as the pieces come, down to 1/32 as in the square (Doc: "wenn
    du dort bis 1/32 gehst, würde ich das in der Rechnung rechts auch machen" - the square further left, the columns
    further right); then the rest in tiny pieces and the whole sum in its box. Each fraction sits in the middle of its
    piece: its bar on the piece's middle (Doc: "die müssen in die Mitte der jeweiligen Rechtecke")."""
    c = S.Canvas(W, H)
    B = LB_B
    fr = lambda a, b: r"\dfrac{%d}{%d}" % (a, b)
    fb = lambda n: B["f1"] if n < 10 else B["f2"]
    kl = lambda g: {"g": g, "kommt": True}
    words = []
    side, x, y = 300, 6, 15
    c.rect(x, y, side, side, fill="#FFFFFF", opacity=0.55)
    rest = [x, y, float(side), float(side)]
    groesse = {2: 28, 4: 24, 8: 20, 16: 15, 32: 9}
    BALKEN = 0.655                               # a fraction's bar lies this many times its type size below its label's
                                                 # middle (measured in the deck: 18.5 px at 28 px ... 5.6 px at 9 px)
    ZEILEN = (24, 78, 132, 186, 240)
    X, EC = 334, 566
    RX, LX = EC + B["gl"] + 22, 770
    words.append((RX, -12, 110, "Summe bis $n$", "font-size:13px;color:#0E244E", kl(1)))
    words.append((LX, -12, 90, "fehlt bis 1", "font-size:13px;color:#B02418", kl(1)))
    for k in range(1, 11):
        n = 2 ** k
        g = 2 * (k - 1) if k <= 5 else 10        # pieces 1-5 a click each (its row the click after), 6-10 together
        px, py, w, h = rest
        if abs(w - h) < 1e-9:                    # a square: its top half
            stueck, rest = (px, py, w, h / 2), [px, py + h / 2, w, h / 2]
        else:                                    # a lying rectangle: its left half
            stueck, rest = (px, py, w / 2, h), [px + w / 2, py, w / 2, h]
        lb_g(c, g)
        c.rect(*stueck, fill=WERT_FARBE.get(n, "#D9DEE8"))
        c.rect(*stueck, stroke=S.INK, width=1.3 if k <= 5 else 0.7)
        c.raw("</g>")
        if n in groesse:
            cx, cy = stueck[0] + stueck[2] / 2, stueck[1] + stueck[3] / 2
            words.append((cx, cy - BALKEN * groesse[n], max(stueck[2], 30), "$%s$" % fr(1, n),
                          "font-size:%gpx;color:#0E244E" % groesse[n], kl(g)))
        if k <= 5:
            # what is still missing: the rest, red outlined, gone with the next piece
            lb_g(c, g, g + 2)
            c.rect(*rest, stroke=S.RED, width=2.2)
            c.raw("</g>")
            # the row: the summands so far = the partial sum, and what is missing
            yy = ZEILEN[k - 1]
            teile = []
            for i in range(1, k + 1):
                teile += ([("+", B["op"], kl(g + 1))] if i > 1 else []) + [(fr(1, 2 ** i), fb(2 ** i), kl(g + 1))]
            wr, kr = lb_reihe(X, yy, teile)
            words += wr
            lb_g(c, g + 1)                       # each summand in the colour of its piece
            for i in range(1, k + 1):
                c.rect(kr[2 * i - 2], yy - 25 + LB_TINTE_DY, fb(2 ** i), 50, fill=WERT_FARBE[2 ** i], rx=3)
            c.raw("</g>")
            words += lb_reihe(EC, yy, [("=", B["gl"], kl(g + 1))])[0]
            words += lb_reihe(RX - fb(n) / 2, yy, [(fr(n - 1, n), fb(n), kl(g + 1))])[0]
            words += lb_reihe(LX - fb(n) / 2, yy, [(r"\textcolor{#B02418}{%s}" % fr(1, n), fb(n), kl(g + 1))])[0]
    c.rect(x, y, side, side, stroke=S.INK, width=2.2)
    for xx in (RX, LX):
        words.append((xx, 296, 30, r"$\vdots$", "font-size:%dpx;color:#0E244E" % LB_FS, kl(10)))
    # 11: the whole sum in its box, under the summands
    teile = []
    for i, n in enumerate((2, 4, 8)):
        teile += ([("+", B["op"], kl(11))] if i else []) + [(fr(1, n), fb(n), kl(11))]
    teile += [("+", B["op"], kl(11)), (r"\cdots", B["dots"], kl(11)), ("=", B["gl"], kl(11)), ("1", B["z1"], kl(11))]
    breite = sum(t[1] for t in teile)
    x0 = X + 10
    lb_g(c, 11)
    c.raw('<rect x="%s" y="%s" width="%s" height="56" rx="4" fill="#DCE8F6" fill-opacity="0.35" stroke="%s" '
          'stroke-width="1"/>' % (S.fmt(x0 - 14), S.fmt(300 - 28 + LB_TINTE_DY), S.fmt(breite + 28), S.INK))
    c.raw("</g>")
    words += lb_reihe(x0, 300, teile)[0]
    return c.svg("Ein Quadrat der Fläche 1: die Hälfte, ein Viertel, ein Achtel und so weiter, der rot umrandete Rest "
                 "so groß wie das letzte Stück"), words


FIGURES = {"zenon": zenon, "quadrat": quadrat, "teleskop": teleskop, "verdoppeln": verdoppeln, "leibniz": leibniz,
           "dreieckszahlen": dreieckszahlen, "teleskop_vorbereitung": teleskop_vorbereitung,
           "teleskop_tafel": teleskop_tafel, "teilsummen": teilsummen, "uebung": uebung,
           "leibniz2": lambda: leibniz(2, ende=False), "verdoppeln_tafel": verdoppeln_tafel, "falle_tafel": falle_tafel,
           "quadrat_tafel": quadrat_tafel}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("\n".join(FIGURES))
    else:
        print(FIGURES[sys.argv[1]]()[0])
