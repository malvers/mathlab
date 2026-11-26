#!/usr/bin/env python3
"""The figures of the deck mathe11-loesungsmengen (Keine, eine, unendlich viele) - drawn with svgfig, inline SVG.

    python3 tools/pptx/mathe11_loesungsmengen_svg.py                     # lists the figures
    python3 tools/pptx/mathe11_loesungsmengen_svg.py zahlbereiche        # prints the whole <section> of the slide

Doc, 23.11.2026: "Mache in der Stack bitte vorne noch eine Folie rein mit Zahlensystem ... mit Beispielen und so
weiter. Bis zu den irrationalen Zahlen." - the number sets N, Z, Q, R as nested boxes, after the slides 46-50 of
material/rahn/Gebrochene Zahlen.pptx (same examples). This file only DRAWS; the section goes once into
HTML/decks/mathe11-loesungsmengen.html, and from then on the deck HTML is the source (rule 23: shapes as SVG, every
word and number as <p class="fl"> over it, so the deck editor can change them).
Clicks build the sets from the inside out: N, then Z adds the negatives, Q the fractions, R the irrationals.
0 belongs to N (DIN 5473, as in the book mathe11).
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aufgaben"))
import svgfig as S
from html_deck import figure_label, markup

W, H = 816, 330

# Doc, 23.11.2026: "die große Box kann noch weiter runter. Da gibt es da oben ein bisschen mehr Luft." - this slide's
# picture box sits PIC_DOWN px lower than deck.css .pic (top 146px); the i-frame above keeps its place on the slide
PIC_DOWN = 18

# (symbol, name, what it adds, examples, colour, fill opacity, box x0) - outermost first, so inner boxes lie on top
SETS = [
    (r"\mathbb{R}", "reelle Zahlen", "+ die irrationalen",
     [r"\sqrt{2} = 1{,}414\ldots", r"\sqrt{3} = 1{,}732\ldots", r"\pi = 3{,}14159\ldots", r"e = 2{,}71828\ldots"],
     S.RED, 0.05, 4),
    (r"\mathbb{Q}", "rationale Zahlen", "+ die Brüche",
     [(r"1{,}\overline{3}", r"{}= \tfrac{4}{3}"), r"\tfrac{3}{7}", (r"4{,}275", r"{}= \tfrac{171}{40}"), r"-\tfrac{1}{2}"],
     S.INK, 0.05, 214),
    (r"\mathbb{Z}", "ganze Zahlen", "+ die negativen",
     [r"-1", r"-5", r"-78", r"-677"],
     S.ORANGE, 0.16, 414),
    (r"\mathbb{N}", "natürliche Zahlen", "zum Zählen",
     [r"0", r"2", r"17", r"106"],
     S.GREEN, 0.16, 606),
]
RIGHT = [812, 800, 788, 776]     # right edge of each box
TOP = [4, 14, 24, 34]            # top edge; the bottom mirrors it


def zahlbereiche():
    """(svg, labels): four nested boxes, each set's symbol, name and examples in the strip it adds.
    Doc, 23.11.2026: "bau die bitte systematisch auf. Ich will die unterwegs fragen, mehr Beispiele zu geben" - per
    set one click for the box with symbol and name, one for the grey "what it adds" (no numbers in it: "da stehen ja
    immer noch natürliche Zahlen in Grau"), then one click per example, N first, R last. An example given as
    (decimal, fraction) gets its fraction on a click of its own right after it ("bei den rationalen Zahlen auf Klick
    hinter den Kommazahlen noch den jeweiligen Bruch") - the two halves meet at the strip's middle, so the "="
    stands in the column and nothing moves when the fraction comes."""
    c = S.Canvas(W, H)
    labels, pops = [], []
    n = len(SETS)
    # click numbers from the inside out: N, Z, Q, R
    first, g = {}, 0
    for i in reversed(range(n)):
        first[i] = g
        g += 2 + sum(2 if isinstance(e, tuple) else 1 for e in SETS[i][3])
    big = lambda e: "font-size:%dpx;color:%s" % (24 if "frac" in e else 21, S.INK)   # a fraction at 21px is tiny
    for i, (sym, name, adds, ex, col, op, x0) in enumerate(SETS):
        g = first[i]
        x1, y0 = RIGHT[i], TOP[i]
        c.raw('<g class="step kommt" data-g="%d">' % g)
        c.rect(x0, y0, x1 - x0, H - 2 * y0, fill=col, opacity=op, rx=22)
        c.rect(x0, y0, x1 - x0, H - 2 * y0, stroke=col, width=2.4, rx=22)
        c.raw('</g>')
        strip_r = SETS[i + 1][6] if i + 1 < n else x1   # the strip ends where the next box starts
        cx, w = (x0 + strip_r) / 2, strip_r - x0 - 16
        kommt = lambda gg: {"g": gg, "kommt": True}
        labels += [
            (cx, 66, w, "$%s$" % sym, "font-size:38px;color:%s" % S.INK, kommt(g)),
            (cx, 104, w, name, "font-size:18px;font-weight:600;color:%s" % S.INK, kommt(g)),
            (cx, 130, w, adds, "font-size:15px;color:%s" % S.MUTED, kommt(g + 1)),
        ]
        g += 2
        for j, e in enumerate(ex):
            y = 164 + 37 * j
            if isinstance(e, tuple):
                dec, frac = e
                labels += [(cx - w / 4 - 2, y, w / 2, "$%s$" % dec, big(dec) + ";text-align:right", kommt(g)),
                           (cx + w / 4 + 2, y, w / 2, "$%s$" % frac, big(frac) + ";text-align:left", kommt(g + 1))]
                if dec in POPS:   # the ? right of the fraction, its middle level with the fraction bar
                    pops.append((cx + POPS[dec][2], y + POP_DY, g + 1, dec))
                g += 2
            else:
                labels.append((cx, y, w, "$%s$" % e, big(e), kommt(g)))
                g += 1
    # the very last click: the imaginary numbers, outside R - a dashed frame above the boxes, next to the title
    # (Doc, 23.11.2026: "oben drüber nochmal extra die imaginären Zahlen ... Wurzel minus 1 ist i, aber dass die
    # sozusagen außen vor liegen. Erscheinen lassen als letzte.") - .pic does not clip, so it may sit at y < 0
    # "ohne gestrichelte Linie und linksbündig" (Doc): a plain frame, flush with the left edge of the R box
    # "mittig zwischen den orange-grünen Linien und der roten Box" (Doc): rules end at y 109, the R box starts at
    # 167 (slide px, measured) - the frame (34 px high with padding) is centred on 138, i.e. y -33 in this box
    labels.append((224, -33, 440, r"außerhalb von $\mathbb{R}$: die imaginären Zahlen, $i = \sqrt{-1}$",
                   "font-size:16px;color:%s;border:2px solid %s;border-radius:12px;padding:3px 10px;white-space:nowrap;"
                   "text-align:left;width:auto;background:rgba(255,255,255,.55)" % (S.INK, S.MUTED),
                   {"g": max(l[5]["g"] for l in labels) + 1, "kommt": True}))
    return c.svg(label="Zahlbereiche N, Z, Q, R ineinander"), labels, pops


def zahlbereiche_section():
    svg, labels, pops = zahlbereiche()
    # a small ? beside a fraction opens a box with the way there (deck.js [data-pop], deck.css .pop-mark / .pop -
    # the same as in ai-wasserzeichen); it comes with the fraction's click
    marks = "".join('<p class="fl pop-mark step kommt" data-g="%d" data-pop="%s" style="left:%gpx;top:%gpx;width:14px;'
                    'height:14px;font-size:8px">?</p>' % (g, POPS[dec][0], x, y - 7) for x, y, g, dec in pops)
    boxes = "".join('<div class="pop" id="%s" style="--pop-w:600px;--pop-scale:.9" hidden><button class="pop-x" '
                    'aria-label="Schließen">×</button>%s</div>' % POPS[dec][:2] for _, _, _, dec in pops)
    return ('<section class="slide content"><h3>%s</h3><div class="rules"></div><div class="pic" style="top:%dpx">'
            '%s%s%s</div><p class="foot">Nicht verzagen, Doc Alvers fragen!</p><p class="pageno"></p>%s</section>'
            % (markup("Die Zahlbereiche"), 146 + PIC_DOWN, svg, "".join(figure_label(l) for l in labels), marks,
               boxes))


def _t(x, css=None):
    return '<span class="tex" data-tex="%s"%s></span>' % (x, ' style="%s"' % css if css else "")


# Doc, 23.11.2026: "an die 4,275 bitte ein kleines Fragezeichen, wie wir das auch im Watermark haben, wo nochmal
# erklärt wird, wie man aus der Dezimalzahl zu dem Bruch kommt", then "da auch ein Fragezeichen" for 1,3 periodic,
# "die Fragezeichen bitte Y auf Höhe Mitte des Bruchstrichs". Entry: decimal -> (pop id, box html, x of the ? from
# the strip's middle); POP_DY: the fraction bar's level relative to the row's centre (measured headless in Chrome)
POP_DY = 3.4
POPS = {
    r"1{,}\overline{3}": ("pop-periode",
                         '<h4>Periodische Kommazahl zum Bruch</h4>'
                         '<p style="margin:0">Der Strich über der ' + _t("3") + ' heißt: Die ' + _t("3")
                         + ' wiederholt sich ohne Ende, ' + _t(r"1{,}\overline{3} = 1{,}333\ldots") + '</p>'
                         '<ul class="pop-list">'
                         '<li style="margin-top:11px">Zuerst nur der Teil nach dem Komma: ' + _t(r"x = 0{,}333\ldots") + '</li>'
                         '<li style="margin-top:11px">Mal ' + _t("10") + ', das Komma rückt eine Stelle nach rechts: '
                         + _t(r"10x = 3{,}333\ldots") + '</li>'
                         # Doc: "Abziehen ... noch nicht so ganz klar. Vielleicht noch einen Schritt dazwischen" -
                         # so the subtraction is written out below each other, as on paper
                         '<li style="margin-top:11px">Untereinander schreiben und abziehen. Hinter dem Komma steht oben und unten <b>dasselbe</b>, '
                         'die Dreien heben sich auf:<br>'
                         + _t(r"\begin{array}{rcl} 10x & = & 3{,}333\ldots \\[5pt] -\;\;x & = & 0{,}333\ldots"
                              r" \\[4pt] \hline \rule{0pt}{15pt} 9x & = & 3{,}000\ldots = 3 \end{array}",
                              "display:inline-block;margin:10px 0 4px") + '</li>'
                         '<li style="margin-top:11px">Durch ' + _t("9") + ': ' + _t(r"x = \dfrac{3}{9} = \dfrac{1}{3}") + '</li>'
                         '<li style="margin-top:11px">Dazu die ' + _t("1") + ' vor dem Komma: '
                         + _t(r"1{,}\overline{3} = 1 + \dfrac{1}{3} = \dfrac{4}{3}") + '</li>'
                         '<li style="margin-top:11px"><b>Probe</b>: ' + _t(r"4 : 3 = 1{,}333\ldots") + '</li></ul>', 62),
    r"4{,}275": ("pop-dezbruch",
                 '<h4>Von der Kommazahl zum Bruch</h4>'
                 '<p style="margin:0">Jede Stelle nach dem Komma hat ihren Stellenwert: <b>Zehntel</b>, '
                 '<b>Hundertstel</b>, <b>Tausendstel</b>.</p><ul class="pop-list">'
                 '<li>' + _t(r"4{,}275") + ' hat <b>drei</b> Stellen nach dem Komma, also Tausendstel: '
                 + _t(r"4{,}275 = \dfrac{4275}{1000}") + '</li>'
                 '<li><b>Kürzen</b>: Zähler und Nenner durch ' + _t("25") + ' teilen (der größte gemeinsame Teiler): '
                 + _t(r"\dfrac{4275}{1000} = \dfrac{171}{40}") + '</li>'
                 '<li><b>Probe</b>: ' + _t(r"171 : 40 = 4{,}275") + '</li></ul>', 82),
}


# ----------------------------------------------------------------- Kapitel 03: geometrisch deuten ---
# Doc, 23.11.2026: "bei geometrischer Deutung bitte auch die Geometrie mit dazu malen." Every case of the deck as a
# picture: two equations = two lines (cross, parallel, on top of each other), three equations with three unknowns =
# three planes (room corner, prism, pages of a book), and a cube for skew lines. Each panel comes on its own click.
PW, PH, GAP = 256, 246, 24          # one panel of a three-panel figure in the 816 x 330 picture box


def _step(c, g):
    """Wrap everything drawn on canvas c so far into one click group (deck.css .step.kommt)."""
    c.body.insert(0, '<g class="step kommt" data-g="%d">' % g)
    c.body.append('</g>')


def _plot(xlim, ylim, w, h, pad):
    p = S.Plot(xlim, ylim, w, h, pad)
    p.grid()
    p.axes(1, 1, origin=None, defer_labels=True)
    return p


def _fill_box(svg, h=PH):
    """panel() makes the svg as tall as the panels; the picture box is 330 high, and the labels only line up when
    the svg fills it exactly - so the free strip under the panels (where the captions go) becomes part of it."""
    a = 'viewBox="0 0 816 %d" width="816" height="%d"' % (h, h)
    assert a in svg
    return svg.replace(a, 'viewBox="0 0 816 330" width="816" height="330"')


def _captions(i, head, text, g, ys=(272, 302), why=None):
    """Words under panel i: what the picture shows (bold), what it means - and, if given, a third line `why`
    (the planes: what all three share in line 2, the number of solutions in line 3)."""
    cx = i * (PW + GAP) + PW / 2
    k = {"g": g, "kommt": True}
    out = [(cx, ys[0], PW, head, "font-size:18px;font-weight:600;color:%s" % S.INK, k),
           (cx, ys[1], PW + GAP, text, "font-size:15px;color:%s" % S.INK, k)]
    if why:
        out.append((cx, 2 * ys[1] - ys[0], PW + GAP, why, "font-size:15px;font-weight:600;color:%s" % S.INK, k))
    return out


def zwei_geraden():
    """(svg, labels): two equations with two unknowns as two lines - one point, parallel, the same line."""
    pad = (26, 12, 12, 20)
    lim = (-1, 6)
    cases = [
        # (line I, line II as (a, b, c) for a*x + b*y = c, dash II, point, labels I/II centred at plot positions)
        ((1, 1, 5), (0, 1, 2), None, (3, 2),
         [("x + y = 5", 1.9, 5.5), ("y = 2", 4.6, 2.6)]),
        ((1, 1, 2), (1, 1, 5), None, None,
         [("x + y = 2", 2.0, 1.1), ("x + y = 5", 4.4, 2.6)]),
        ((1, -2, 1), (-2, 4, -2), "7 6", None,
         [("x - 2y = 1", 2.0, 3.4), ("-2x + 4y = -2", 2.4, 2.6)]),
    ]
    heads = [("schneiden sich", r"genau eine Lösung: $L = \{(3 \mid 2)\}$"),
             ("parallel", r"keine Lösung: $L = \{\}$"),
             ("liegen aufeinander", "unendlich viele Lösungen")]
    canv, labels = [], []
    for i, (l1, l2, dash, pt, eqs) in enumerate(cases):
        p = _plot(lim, lim, PW, PH, pad)
        for (a, b, c), col, wd, ds in ((l1, S.GREEN, 3.2, None), (l2, S.INK, 2.0, dash)):
            if b == 0:
                pts = ((c / a, lim[0]), (c / a, lim[1]))
            else:
                pts = ((lim[0], (c - a * lim[0]) / b), (lim[1], (c - a * lim[1]) / b))
            p.seg(pts[0], pts[1], col, wd, ds, clip=True)
        if pt:
            p.circle(p.X(pt[0]), p.Y(pt[1]), 5.5, S.RED)
        p.draw_labels()
        _step(p, i)
        canv.append(p)
        dx = i * (PW + GAP)
        k = {"g": i, "kommt": True}
        for j, (eq, u, v) in enumerate(eqs):
            col = S.GREEN if j == 0 else S.INK
            labels.append((dx + p.X(u), p.Y(v), 150, "$%s$" % eq,
                           "font-size:15px;color:%s;text-shadow:0 0 3px #fff,0 0 3px #fff" % col, k))
        labels += _captions(i, heads[i][0], heads[i][1], i)
    return _fill_box(S.panel(canv, gap=GAP, label="Zwei Geraden: schneiden sich, parallel, aufeinander")), labels


def _plane_strip(s, p1, p2, x0, x1, col):
    """A plane through the segment p1-p2 of the (y, z) cross section, drawn from depth x0 to x1."""
    (y1, z1), (y2, z2) = p1, p2
    s.face([(x0, y1, z1), (x0, y2, z2), (x1, y2, z2), (x1, y1, z1)], fill=col, opacity=0.30, stroke=col, width=1.6)


def drei_ebenen():
    """(svg, labels): three planes - a room corner (one point), a prism (none), pages of a book (a line)."""
    import math
    canv = []
    # room corner: floor and two walls, the corner is the one common point
    a = S.Solid(PW, PH, scale=52, ox=PW * 0.36, oy=PH * 0.70, skew=(-0.42, -0.36))
    q = 2.6
    a.face([(0, 0, 0), (q, 0, 0), (q, q, 0), (0, q, 0)], fill=S.GREEN, opacity=0.30, stroke=S.GREEN, width=1.6)
    a.face([(0, 0, 0), (0, q, 0), (0, q, q), (0, 0, q)], fill=S.INK, opacity=0.16, stroke=S.INK, width=1.6)
    a.face([(0, 0, 0), (q, 0, 0), (q, 0, q), (0, 0, q)], fill=S.ORANGE, opacity=0.35, stroke=S.ORANGE, width=1.6)
    o = a.P((0, 0, 0))
    a.circle(o[0], o[1], 6, S.RED)
    _step(a, 0)
    canv.append(a)
    # prism: three planes cut each other in three parallel lines, but no point lies on all three
    b = S.Solid(PW, PH, scale=44, ox=PW * 0.36, oy=PH * 0.70, skew=(-0.42, -0.36))
    A, B, C = (0.0, 0.0), (3.0, 0.0), (1.5, 2.6)
    def ext(p, q, e=0.45):
        d = math.hypot(q[0] - p[0], q[1] - p[1])
        u = ((q[0] - p[0]) / d, (q[1] - p[1]) / d)
        return (p[0] - e * u[0], p[1] - e * u[1]), (q[0] + e * u[0], q[1] + e * u[1])
    for (p1, p2), col in ((ext(A, B), S.GREEN), (ext(A, C), S.INK), (ext(B, C), S.ORANGE)):
        _plane_strip(b, p1, p2, 0, 2.2, col)
    for y, z in (A, B, C):
        b.edge((0, y, z), (2.2, y, z), S.INK, 2.2)
    _step(b, 1)
    canv.append(b)
    # pages of a book: three planes through one common line (the spine, red)
    c = S.Solid(PW, PH, scale=50, ox=PW * 0.50, oy=PH * 0.50, skew=(-0.42, -0.36))
    r = 1.7
    for ang, col in ((10, S.GREEN), (70, S.INK), (130, S.ORANGE)):
        t = math.radians(ang)
        d = (r * math.cos(t), r * math.sin(t))
        _plane_strip(c, (-d[0], -d[1]), d, -1.3, 1.5, col)
    c.edge((-1.7, 0, 0), (1.9, 0, 0), S.RED, 4)
    _step(c, 2)
    canv.append(c)
    # Doc, 23.11.2026: "da gibt es doch 3 Schnittlinien. Wieso keine Lösung?" and "kein Punkt ... beim rechten
    # Beispiel ... ist es ja auch kein Punkt, sondern eben eine Linie" - so every panel says what ALL THREE planes
    # share (a point, nothing, a line), and the count of solutions comes in a line of its own
    ys = (262, 289)
    labels = (_captions(0, "Zimmerecke", "alle drei haben einen Punkt gemeinsam", 0, ys, why="genau eine Lösung")
              + _captions(1, "Dreiecksprisma", "je zwei schneiden sich, alle drei nie", 1, ys, why="keine Lösung")
              + _captions(2, "Buchseiten", "alle drei haben eine Gerade gemeinsam", 2, ys,
                          why="unendlich viele Lösungen"))
    return _fill_box(S.panel(canv, gap=GAP, label="Drei Ebenen: Zimmerecke, Dreiecksprisma, Buchseiten")), labels


def gerade_x_plus_y():
    """svg for the .below box: the solutions of x + y = 4 as points (click 0), then the whole line (click 1)."""
    s = 30
    lim = (-0.6, 5.4)
    pad = (24, 12, 10, 20)
    w = int(pad[0] + pad[1] + (lim[1] - lim[0]) * s)
    h = int(pad[2] + pad[3] + (lim[1] - lim[0]) * s)
    p = _plot(lim, lim, w, h, pad)
    p.draw_labels()
    p.raw('<g class="step kommt" data-g="1">')
    p.seg((lim[0], 4 - lim[0]), (lim[1], 4 - lim[1]), S.GREEN, 3, clip=True)
    p.text(p.X(3.0), p.Y(4.2), "x + y = 4", 15, S.GREEN, "start", italic=True, halo=S.PAPER)
    p.raw('</g><g class="step kommt" data-g="0">')
    for (u, v, lab, pos) in ((0, 4, "(0 | 4)", "right"), (1, 3, "(1 | 3)", "right"), (2.5, 1.5, "(2,5 | 1,5)", "right")):
        p.point(u, v, lab, pos, S.RED, 5)
    p.raw('</g>')
    return p.svg(label="Die Lösungen von x + y = 4 bilden eine Gerade")


def windschief_wuerfel():
    """svg for the .below box: a cube with two skew edges - red and green never meet and are not parallel."""
    q = 2
    c = S.Solid(250, 185, scale=48, ox=100, oy=135, skew=(-0.42, -0.36))
    V = [(x, y, z) for x in (0, q) for y in (0, q) for z in (0, q)]
    hidden = (0, 0, 0)
    for a in V:
        for b in V:
            if a < b and sum(1 for i in range(3) if a[i] != b[i]) == 1:
                c.edge(a, b, S.MUTED, 1.4, "4 4" if hidden in (a, b) else None)
    c.raw('<g class="step kommt" data-g="1">')
    c.edge((q, -0.6, 0), (q, q + 0.6, 0), S.RED, 3.4)
    c.edge((-0.7, 0, q), (q + 0.7, 0, q), S.GREEN, 3.4)
    c.raw('</g>')
    return c.svg(label="Würfel mit zwei windschiefen Kanten")


def drei_faelle_klein():
    """svg for the .below box of the Fahrplan slide: the three cases of the deck as three small pictures - two
    parallel lines (none), two crossing lines (one), two lines on top of each other (infinitely many) - each with
    its L underneath. Doc, 23.11.2026: "Auf der Fahrplanfolie könnte unten noch irgendwie ein Bild sein. Das sieht
    so textlastig aus." Maths only (L in the formula font), no words - so nothing in it needs the deck editor."""
    lim = (-0.6, 5.6)
    cases = [
        (((1, 1, 2), (1, 1, 4.5)), None, "L = { }"),
        (((1, 1, 5), (0, 1, 2)), (3, 2), "L = {(3 | 2)}"),
        (((1, -2, 1), (-2, 4, -2)), None, "L = {(1 + 2t | t)}"),
    ]
    canv = []
    for (l1, l2), pt, cap in cases:
        p = S.Plot(lim, lim, 170, 150, (14, 10, 6, 36))
        p.axes(xticks=False, yticks=False, origin=None)
        for (a, b, c), col, wd, ds in ((l1, S.GREEN, 3.0, None), (l2, S.INK, 2.0, "7 6" if l2 == (-2, 4, -2) else None)):
            if b == 0:
                q = ((c / a, lim[0]), (c / a, lim[1]))
            else:
                q = ((lim[0], (c - a * lim[0]) / b), (lim[1], (c - a * lim[1]) / b))
            p.seg(q[0], q[1], col, wd, ds, clip=True)
        if pt:
            p.circle(p.X(pt[0]), p.Y(pt[1]), 5, S.RED)
        p.text(85, 144, cap, 17, S.INK, italic=True)
        canv.append(p)
    return S.panel(canv, gap=70, label="Keine, eine, unendlich viele Lösungen als Geraden")


def figure_section(title, fig):
    svg, labels = fig()
    return ('<section class="slide content"><h3>%s</h3><div class="rules"></div><div class="pic">%s%s</div>'
            '<p class="foot">Nicht verzagen, Doc Alvers fragen!</p><p class="pageno"></p></section>'
            % (markup(title), svg, "".join(figure_label(l) for l in labels)))


FIGURES = {"Die Zahlbereiche (N, Z, Q, R)": zahlbereiche_section,
           "Zwei Geraden": lambda: figure_section("Zwei Gleichungen, zwei Geraden", zwei_geraden),
           "Drei Ebenen": lambda: figure_section("Drei Ebenen im Raum", drei_ebenen),
           "x + y = 4 (below)": gerade_x_plus_y, "Windschief (below)": windschief_wuerfel}

if __name__ == "__main__":
    names = {"zahlbereiche": zahlbereiche_section, "zwei_geraden": FIGURES["Zwei Geraden"],
             "drei_ebenen": FIGURES["Drei Ebenen"], "gerade": gerade_x_plus_y, "windschief": windschief_wuerfel,
             "drei_faelle": drei_faelle_klein}
    if len(sys.argv) > 1:
        print(names[sys.argv[1]]())
    else:
        for n in names:
            print(n)
