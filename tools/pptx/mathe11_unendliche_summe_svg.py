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
    made of, one per row - the left side stands, the class works it out, the result comes with a click."""
    c = S.Canvas(W, H)
    B = LB_B
    fr = lambda a, b: r"\dfrac{%d}{%d}" % (a, b)
    fb = lambda n: B["f1"] if n < 10 else B["f2"]
    kl = lambda g: {"g": g, "kommt": True}
    words, EQ = [], 400                          # the "=" column
    zeilen = (("1", B["z1"], 2), (fr(1, 2), B["f1"], 4), (fr(1, 4), B["f1"], 8), (fr(1, 8), B["f1"], 16),
              (fr(1, 16), B["f2"], 32))
    for k, (links, lb, n) in enumerate(zeilen):
        y = 38 + k * 62
        teile = [(links, lb, None), ("-", B["op"], None), (fr(1, n), fb(n), None)]
        x0 = EQ - sum(t[1] for t in teile)
        words += lb_reihe(x0, y, teile + [("=", B["gl"], None)])[0]
        words += lb_reihe(EQ + B["gl"], y, [(fr(1, n), fb(n), kl(k))])[0]
    return c.svg("Vorbereitung: 1 minus ein Halb, ein Halb minus ein Viertel und so weiter"), words


def teleskop_tafel():
    """Proof 1 in Doc's way (Doc, 06.10.2026, after his Leibniz slides: "wenn du das ... so Schritt für Schritt beibringen
    willst, ist das so, wie ich es da mal gemacht habe, besser" - "bauen wir den ersten Beweis, Teleskop"): one board that
    grows. S = 1/2 + 1/4 + ... term by term, "?"; every term as its double minus itself, each in its colour together
    with its term above; the brackets gone, a red frame and "= 0" on each pair that cancels, the pair fading into "+ 0";
    the rest "-> 0"; S = 1 is left, then the whole sum in its box."""
    c = S.Canvas(W, H)
    B = LB_B
    fr = lambda a, b: r"\dfrac{%d}{%d}" % (a, b)
    fb = lambda n: B["f1"] if n < 10 else B["f2"]
    kl = lambda g: {"g": g, "kommt": True}
    words = []
    R1, R2, R3, R4 = 40, 118, 206, 288
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
    # row 3: the brackets gone - every fraction once with minus and right after with plus
    DECKEL = 25
    paar = lambda j: dict(kl(15), bis=17 + 2 * j, sanft=True)
    teile = [("S", B["S"], kl(15)), ("=", B["gl"], kl(15)), ("1", B["z1"], kl(15))]
    for j, n in enumerate(nenner[:4]):
        teile += [("-", B["op"], paar(j)), (fr(1, n), fb(n), paar(j)), ("+", B["op"], paar(j)), (fr(1, n), fb(n), paar(j))]
    rest = dict(kl(15), bis=DECKEL)
    w3, k3 = lb_reihe(X0, R3, teile + [("-", B["op"], rest), (fr(1, 32), B["f2"], dict(rest)), (r"\cdots", B["dots"], dict(rest))])
    words += w3
    for j, n in enumerate(nenner[:4]):
        g = 16 + 2 * j
        links, rechts = k3[3 + 4 * j], k3[6 + 4 * j] + fb(n)
        mitte = (links + rechts) / 2
        lb_g(c, g, g + 1)
        c.rect(links + 2, R3 - 28 + LB_TINTE_DY, rechts - links - 2, 56, stroke=S.RED, width=2.4, rx=3)
        c.raw("</g>")
        words.append((mitte, R3 + 40, 60, r"$\textcolor{#B02418}{=0}$", "font-size:%dpx" % (LB_FS - 2), dict(kl(g), bis=g + 1)))
        words.append((mitte, R3 - LB_DY, 60, r"$%s+\textcolor{#B02418}{0}$" % LB_PH, "font-size:%dpx" % LB_FS,
                      dict(kl(g + 1), bis=DECKEL, sanft=True)))
    # what is left at the end gets smaller and smaller: "-> 0"
    links, rechts = k3[-3], k3[-1] + B["dots"]
    words.append(((links + rechts) / 2, R3 + 40, rechts - links, r"$\textcolor{#B02418}{\to 0}$", "font-size:%dpx" % (LB_FS - 2),
                  dict(kl(24), bis=DECKEL)))
    lb_g(c, DECKEL)
    c.raw("</g>")                                # this click shows nothing - it takes the rest away (data-bis above)
    # row 4: the whole sum in its box, in the middle
    teile = []
    for i, n in enumerate(nenner):
        teile += ([("+", B["op"], kl(DECKEL + 1))] if i else []) + [(fr(1, n), fb(n), kl(DECKEL + 1))]
    teile += [("+", B["op"], kl(DECKEL + 1)), (r"\cdots", B["dots"], kl(DECKEL + 1)), ("=", B["gl"], kl(DECKEL + 1)),
              ("1", B["z1"], kl(DECKEL + 1))]
    breite = sum(t[1] for t in teile)
    x0 = (W - breite) / 2
    lb_g(c, DECKEL + 1)
    c.raw('<rect x="%s" y="%s" width="%s" height="64" rx="4" fill="#DCE8F6" fill-opacity="0.35" stroke="%s" '
          'stroke-width="1"/>' % (S.fmt(x0 - 16), S.fmt(R4 - 32 + LB_TINTE_DY), S.fmt(breite + 32), S.INK))
    c.raw("</g>")
    words += lb_reihe(x0, R4, teile)[0]
    return c.svg("Teleskop: jeder Summand als Differenz, die Klammern weg, je zwei heben sich auf, übrig bleibt 1"), words


FIGURES = {"zenon": zenon, "quadrat": quadrat, "teleskop": teleskop, "verdoppeln": verdoppeln, "leibniz": leibniz,
           "dreieckszahlen": dreieckszahlen, "teleskop_vorbereitung": teleskop_vorbereitung,
           "teleskop_tafel": teleskop_tafel, "teilsummen": teilsummen, "uebung": uebung,
           "leibniz2": lambda: leibniz(2, ende=False)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("\n".join(FIGURES))
    else:
        print(FIGURES[sys.argv[1]]()[0])
