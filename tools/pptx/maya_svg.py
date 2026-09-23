#!/usr/bin/env python3
"""The Maya deck's figures as SVG - drawn with svgfig, embedded inline in the deck.

    python3 tools/pptx/maya_svg.py ziffern      # prints the <svg> markup

Rule 23 (CLAUDE.md): a drawn diagram is inline SVG plus HTML labels, never a PNG on a
slide. The shapes, bars and dots are SVG (sharp on any beamer), the words are <p class="fl">
laid over them, which the deck editor changes like any bullet line.
The canvas is the picture box of a content slide, 816 x 330 design pixels (deck.css .pic);
the labels use the same coordinates, so the SVG has to fill that box exactly.
"""
import math
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aufgaben"))
import svgfig as S

W, H = 816, 330


def label(c, x, y, markup, size=14, color=S.INK, family=S.SANS, weight=None, anchor="middle"):
    """A centred label whose content is ready markup."""
    c.raw('<text x="%s" y="%s" font-family="%s" font-size="%s" fill="%s" text-anchor="%s"'
          ' dominant-baseline="central"%s>%s</text>'
          % (S.fmt(x), S.fmt(y), family, size, color, anchor,
             ' font-weight="%s"' % weight if weight else "", markup))


# ------------------------------------------------------------------ digits ---
# A Maya digit is written from the bottom up: every bar counts five, every dot one,
# and a shell stands for zero. Four dots and three bars is as far as one place goes (19).
BAR_H = 9.0      # thickness of a bar
ROW_GAP = 6.0    # air between two rows of a digit


def _shell(c, cx, cy, w, color):
    """The zero: a scallop shell - ribs fanning out of the hinge, a scalloped rim.

    From forloop-49, who rendered four variants and kept the one that still reads at 30 px;
    HTML/maya.html (the Maya reckoning board) draws the same shape, so lab and deck match."""
    h = w * 0.64
    R = h * 0.92
    hx, hy = cx, cy + h * 0.44           # the hinge sits below the centre
    spread = 0.44                         # half opening, in units of pi
    a0, a1 = -math.pi / 2 - math.pi * spread, -math.pi / 2 + math.pi * spread
    kx = (w / 2) / (R * math.sin(math.pi * spread))
    P = lambda a, r: (hx + kx * R * r * math.cos(a), hy + R * r * math.sin(a))
    lobes = 6
    x0, y0 = P(a0, 0.9)
    d = ["M %s %s" % (S.fmt(x0), S.fmt(y0))]
    for i in range(lobes):
        mx, my = P(a0 + (a1 - a0) * (i + 0.5) / lobes, 1.10)
        ex, ey = P(a0 + (a1 - a0) * (i + 1) / lobes, 0.9)
        d.append("Q %s %s %s %s" % (S.fmt(mx), S.fmt(my), S.fmt(ex), S.fmt(ey)))
    d.append("Q %s %s %s %s" % (S.fmt(hx + w * 0.10), S.fmt(hy + h * 0.10), S.fmt(hx), S.fmt(hy)))
    d.append("Q %s %s %s %s" % (S.fmt(hx - w * 0.10), S.fmt(hy + h * 0.10), S.fmt(x0), S.fmt(y0)))
    d.append("Z")
    c.raw('<path d="%s" fill="%s" fill-opacity="0.10" stroke="%s" stroke-width="2.2"'
          ' stroke-linejoin="round"/>' % (" ".join(d), color, color))
    for i in range(1, lobes):
        a = a0 + (a1 - a0) * i / lobes
        sx, sy = P(a, 0.16)
        ex, ey = P(a, 0.86)
        c.line(sx, sy, ex, ey, color=color, width=1.4)


def digit_height(n):
    """Height a digit needs - so a row of digits can be aligned on a common baseline."""
    if n == 0:
        return 26.0
    rows = n // 5 + (1 if n % 5 else 0)
    return rows * BAR_H + (rows - 1) * ROW_GAP + (6.0 if n % 5 else 0.0)


def digit(c, cx, top, n, w=52, color=S.INK, dot=None):
    """One Maya digit 0..19, its top edge at `top`, centred on cx. Returns its height."""
    if n == 0:
        _shell(c, cx, top + 15, w * 0.82, color)
        return 26.0
    bars, dots = n // 5, n % 5
    y = top
    if dots:
        # the dots sit in one row above the bars, evenly spread over the bar's width
        r = 5.6
        step = w / 5.0
        x0 = cx - step * (dots - 1) / 2
        for i in range(dots):
            c.circle(x0 + i * step, y + r, r, fill=dot or color, stroke="none", width=0)
        y += 2 * r + ROW_GAP
    for i in range(bars):
        c.rect(cx - w / 2, y, w, BAR_H, fill=color, rx=2)
        y += BAR_H + ROW_GAP
    return y - ROW_GAP - top


def ziffern():
    """All twenty digits of the Maya system, 0 to 19 - dots, bars and the shell."""
    c = S.Canvas(W, H)
    labels = []
    cols, cw = 10, 78.0
    x0 = (W - cols * cw) / 2 + cw / 2
    for n in range(20):
        col, row = n % cols, n // cols
        cx = x0 + col * cw
        base = 34 + row * 152          # top edge of the row's digit box
        # every digit of a row hangs from a common bottom line, as it is written on a stela
        h = digit_height(n)
        digit(c, cx, base + 84 - h, n, w=50, color=S.INK, dot=S.RED)
        labels.append((cx, base + 100, cw - 6, str(n),
                       "font-size:15px;font-weight:600;color:%s" % S.MUTED))
    c.line(40, 128, W - 40, 128, color="#DCE4F0", width=1.2)
    return c.svg("Die zwanzig Ziffern der Maya: Punkt = 1, Strich = 5, Muschel = 0"), labels


def punkt_strich_muschel():
    """The three signs on their own - the alphabet of the system, one slide before the table."""
    c = S.Canvas(W, H)
    labels = []
    boxes = [(160, "Punkt", "1", S.RED), (408, "Strich", "5", S.INK), (656, "Muschel", "0", S.GREEN)]
    for cx, name, val, color in boxes:
        c.rect(cx - 108, 34, 216, 190, fill="#F4F7FC", stroke=color, width=2.6, rx=14)
        if name == "Punkt":
            c.circle(cx, 108, 17, fill=color, stroke="none", width=0)
        elif name == "Strich":
            c.rect(cx - 62, 98, 124, 20, fill=color, rx=4)
        else:
            _shell(c, cx, 108, 120, color)
        label(c, cx, 180, "= %s" % val, 30, color=color, weight="600")
        labels.append((cx, 250, 210, name, "font-size:19px;font-weight:600;color:%s" % S.INK))
    labels.append((W / 2, 300, W, "Mehr Zeichen braucht es nicht — jede der zwanzig Ziffern "
                                  "wird daraus zusammengesetzt.",
                   "font-size:15px;color:%s" % S.BODY))
    return c.svg("Die drei Zeichen des Maya-Systems: Punkt, Strich und Muschel"), labels


# ------------------------------------------------------- place value tables ---
def _stellen(c, werte, ziffern_, x0, top, cw, ch, color=S.INK, fill="#F4F7FC"):
    """A row of place value boxes, highest place on the left - the way we write."""
    for i, (w, z) in enumerate(zip(werte, ziffern_)):
        x = x0 + i * cw
        c.rect(x, top, cw - 10, ch, fill=fill, stroke=color, width=2.2, rx=10)
        if z is not None:
            label(c, x + (cw - 10) / 2, top + ch / 2, str(z), 44, color=S.RED, weight="600")
    return [x0 + i * cw + (cw - 10) / 2 for i in range(len(werte))]


def stellen10():
    """Our own place value system: 6207 over the powers of ten."""
    c = S.Canvas(W, H)
    labels = []
    cw, ch = 132.0, 96.0
    x0 = (W - 4 * cw) / 2
    cx = _stellen(c, [1000, 100, 10, 1], [6, 2, 0, 7], x0, 66, cw, ch)
    names = ["Tausender", "Hunderter", "Zehner", "Einer"]
    for i, (x, n) in enumerate(zip(cx, names)):
        labels.append((x, 42, cw - 6, n, "font-size:15px;font-weight:600;color:%s" % S.INK))
        labels.append((x, 188, cw - 6, ["$10^3$", "$10^2$", "$10^1$", "$10^0$"][i],
                       "font-size:20px;color:%s" % S.BODY))
        labels.append((x, 222, cw - 6, ["1.000", "100", "10", "1"][i],
                       "font-size:17px;font-weight:600;color:%s" % S.MUTED))
    c.arrow(x0 + 4 * cw - 10, 258, x0 + 6, 258, color=S.ORANGE, width=2.6)
    labels.append((W / 2, 288, 520, "Jede Stelle ist zehnmal so viel wert wie ihre rechte Nachbarin",
                   "font-size:15px;color:%s" % S.BODY))
    return c.svg("Die Zahl 6207 im Stellenwertsystem zur Basis 10"), labels


def stellen20():
    """The pure base 20 system: the same four digits, but every place is worth twenty times more."""
    c = S.Canvas(W, H)
    labels = []
    cw, ch = 132.0, 96.0
    x0 = (W - 4 * cw) / 2
    cx = _stellen(c, [8000, 400, 20, 1], [6, 2, 0, 7], x0, 66, cw, ch, color=S.GREEN)
    names = ["Achttausender", "Vierhunderter", "Zwanziger", "Einer"]
    for i, (x, n) in enumerate(zip(cx, names)):
        labels.append((x, 42, cw - 6, n, "font-size:14px;font-weight:600;color:%s" % S.INK))
        labels.append((x, 188, cw - 6, ["$20^3$", "$20^2$", "$20^1$", "$20^0$"][i],
                       "font-size:20px;color:%s" % S.BODY))
        labels.append((x, 222, cw - 6, ["8.000", "400", "20", "1"][i],
                       "font-size:17px;font-weight:600;color:%s" % S.MUTED))
    c.arrow(x0 + 4 * cw - 10, 258, x0 + 6, 258, color=S.ORANGE, width=2.6)
    labels.append((W / 2, 288, 620, "Dieselben Ziffern, ein ganz anderer Wert: "
                                    "$6207_{20} = 48\\,807$",
                   "font-size:16px;color:%s" % S.BODY))
    return c.svg("Die Ziffernfolge 6207 im reinen Stellenwertsystem zur Basis 20"), labels


def stellen_maya():
    """What the Maya really did: the third place is 360, not 400 - the calendar bends the system."""
    c = S.Canvas(W, H)
    labels = []
    cw, ch = 132.0, 92.0
    x0 = (W - 4 * cw) / 2
    cx = _stellen(c, [7200, 360, 20, 1], [6, 2, 0, 7], x0, 74, cw, ch, color=S.RED)
    for i, x in enumerate(cx):
        labels.append((x, 196, cw - 6, ["7.200", "360", "20", "1"][i],
                       "font-size:21px;font-weight:600;color:%s" % S.INK))
    # the broken step is what this slide is about, so it is marked
    c.rect(x0 - 8, 58, 2 * cw + 6, ch + 34, fill="none", stroke=S.ORANGE,
           width=2.6, rx=12, opacity=0.95)
    labels.append((x0 + cw - 5, 38, 520, "hier bricht das System: 7200 und 360 statt 8000 und 400",
                   "font-size:15px;font-weight:600;color:%s" % S.ORANGE))
    labels.append((W / 2, 238, W - 80, "Ein Maya-Jahr hatte **18 Monate zu 20 Tagen = 360 Tage**. "
                                       "Damit die dritte Stelle das Jahr trifft, zählt sie 360 — "
                                       "nicht $20^2 = 400$.", "font-size:15px;color:%s" % S.BODY))
    labels.append((W / 2, 300, 700, "$6207_{Maya} = 6 \\cdot 7200 + 2 \\cdot 360 + 0 \\cdot 20 + "
                                    "7 = 43\\,927$", "font-size:18px;color:%s" % S.INK))
    return c.svg("Die echten Maya-Stellenwerte: 1, 20, 360, 7200"), labels


def maya_zahl(stellen=(6, 2, 0, 7), werte=("7.200", "360", "20", "1"), titel=None):
    """A number written the Maya way: one digit per place, the highest at the top.
    They wrote their places above one another, not side by side."""
    c = S.Canvas(W, H)
    labels = []
    n = len(stellen)
    ch = 62.0
    x_glyph, x_wert, x_rech = 300.0, 470.0, 620.0
    top0 = 24.0
    gesamt = 0
    for i, (z, w) in enumerate(zip(stellen, werte)):
        top = top0 + i * ch
        c.rect(x_glyph - 78, top - 4, 156, ch - 8, fill="#F4F7FC", stroke="#DCE4F0", width=1.4, rx=8)
        h = digit_height(z)
        digit(c, x_glyph, top + (ch - 8 - h) / 2 - 2, z, w=48, color=S.INK, dot=S.RED)
        labels.append((x_wert, top + ch / 2 - 4, 150, "$%s \\cdot %s$" % (z, w.replace(".", "\\,")),
                       "font-size:19px;color:%s" % S.BODY))
        wert = int(w.replace(".", "")) * z
        gesamt += wert
        labels.append((x_rech, top + ch / 2 - 4, 150, "$= %s$" % ("{:,}".format(wert).replace(",", "\\,")),
                       "font-size:19px;font-weight:600;color:%s" % S.INK))
    y = top0 + n * ch + 4
    c.line(x_rech - 70, y, x_rech + 70, y, color=S.INK, width=2)
    labels.append((x_rech, y + 26, 220, "$%s$" % "{:,}".format(gesamt).replace(",", "\\,"),
                   "font-size:26px;font-weight:600;color:%s" % S.RED))
    labels.append((150, 44, 220, "höchste Stelle **oben**",
                   "font-size:14px;font-weight:600;color:%s" % S.MUTED))
    c.arrow(150, 70, 150, y - 26, color=S.MUTED, width=2)
    labels.append((150, y - 4, 220, "Einer **unten**", "font-size:14px;font-weight:600;color:%s" % S.MUTED))
    return c.svg(titel or "Die Zahl in Maya-Schreibweise, von oben nach unten"), labels


def aufgabe(zahl=5432, loesung=False):
    """The exercise: write 5432 the Maya way. Same picture twice - empty, then filled."""
    werte = [7200, 360, 20, 1]
    rest = zahl
    zif = []
    for w in werte:
        zif.append(rest // w)
        rest %= w
    c = S.Canvas(W, H)
    labels = []
    ch = 64.0
    x_glyph, x_rech = 300.0, 600.0
    top0 = 22.0
    for i, (z, w) in enumerate(zip(zif, werte)):
        top = top0 + i * ch
        c.rect(x_glyph - 80, top - 4, 160, ch - 10, fill=S.PAPER,
               stroke=S.GREEN if loesung else "#DCE4F0", width=2.2, rx=8)
        if loesung:
            h = digit_height(z)
            digit(c, x_glyph, top + (ch - 10 - h) / 2 - 2, z, w=48, color=S.INK, dot=S.RED)
        labels.append((x_glyph - 150, top + ch / 2 - 5, 120, "$%s$" % "{:,}".format(w).replace(",", "\\,"),
                       "font-size:20px;font-weight:600;color:%s" % S.MUTED))
        if loesung:
            labels.append((x_rech, top + ch / 2 - 5, 260,
                           "$%s \\cdot %s = %s$" % (z, "{:,}".format(w).replace(",", "\\,"),
                                                    "{:,}".format(z * w).replace(",", "\\,")),
                           "font-size:18px;color:%s" % S.BODY))
    if loesung:
        y = top0 + 4 * ch + 2
        c.line(x_rech - 80, y, x_rech + 80, y, color=S.INK, width=2)
        labels.append((x_rech, y + 24, 240, "$= %s$" % "{:,}".format(zahl).replace(",", "\\,"),
                       "font-size:24px;font-weight:600;color:%s" % S.RED))
    else:
        labels.append((W / 2, 300, W - 80, "Wie viele Siebentausendzweihunderter, "
                                           "Dreihundertsechziger, Zwanziger und Einer stecken in "
                                           "$%d$?" % zahl, "font-size:15px;color:%s" % S.BODY))
    return c.svg("Die Zahl %d im Zahlensystem der Maya" % zahl), labels


# ---------------------------------------------------------------- potencies ---
def potenzen():
    """Why is x to the power of zero one? Walk the ladder downwards - each step divides."""
    c = S.Canvas(W, H)
    labels = []
    for k, (basis, color) in enumerate(((3, S.INK), (9, S.GREEN))):
        x0 = 70 + k * 400
        labels.append((x0 + 150, 32, 300, "Basis $%d$" % basis,
                       "font-size:18px;font-weight:600;color:%s" % color))
        for i, e in enumerate((4, 3, 2, 1, 0)):
            y = 72 + i * 46
            labels.append((x0 + 60, y, 130, "$%d^%d$" % (basis, e),
                           "font-size:20px;color:%s" % S.BODY))
            labels.append((x0 + 190, y, 160, "$= %s$" % "{:,}".format(basis ** e).replace(",", "\\,"),
                           "font-size:20px;font-weight:600;color:%s"
                           % (S.RED if e == 0 else S.INK)))
            if i:
                c.arrow(x0 + 276, y - 46 + 12, x0 + 276, y - 12, color=color, width=1.8)
                labels.append((x0 + 316, y - 23, 110, "$: %d$" % basis,
                               "font-size:15px;font-weight:600;color:%s" % color))
        c.rect(x0 - 4, 72 + 4 * 46 - 20, 264, 40, fill="none", stroke=S.RED, width=2.2, rx=8)
    labels.append((W / 2, 302, W - 60, "Eine Stufe tiefer heißt **durch die Basis teilen** — "
                                       "darum ist jede Zahl hoch null gleich **1**.",
                   "font-size:16px;color:%s" % S.BODY))
    return c.svg("Warum jede Zahl hoch null gleich eins ist"), labels


# ---------------------------------------------------------------------- map ---
def karte():
    """Where the Maya lived - the real coastline from Natural Earth (ne_karte.py), with the
    Maya heartland drawn over it. Doc, 23.09.2026: "wir brauchen Karten von Mexico"."""
    import ne_karte as N
    c, P = N.zeichne("mesoamerika", hervor=("Mexico", "Guatemala", "Belize", "Honduras",
                                            "El Salvador", "Nicaragua"), karte_h=284, pad=4)
    labels = []
    pts = [P(lon, lat) for lon, lat in N.REGIONEN["mesoamerika"]["gebiet"]]
    c.poly(pts, stroke=S.RED, width=2.6, fill=S.ORANGE, opacity=0.42)
    # the legend sits on a light plate inside the map, otherwise the coastline runs through it
    labels += N.legende(c, P, "ul", [
        ("**Das Maya-Gebiet**", 15, "font-size:15px;font-weight:600;color:%s" % S.RED),
        ("Südmexiko, Guatemala, Belize,", 12, "font-size:12px;color:%s" % S.BODY),
        ("Honduras, El Salvador", 12, "font-size:12px;color:%s" % S.BODY)])
    stellen = {"Chichén Itzá": (4, -18), "Tikal": (32, 6), "Palenque": (-42, 0),
               "Copán": (-32, 14), "Mexiko-Stadt": (2, 18)}
    for name, lon, lat, art in N.REGIONEN["mesoamerika"]["orte"]:
        x, y = N.ort(c, P, lon, lat, art)
        dx, dy = stellen[name]
        labels.append((x + dx, y + dy, 132, name,
                       "font-size:12.5px;font-weight:600;color:%s"
                       % (S.RED if art == "ruine" else S.INK)))
    labels.append((470, 42, 150, "Golf von Mexiko", "font-size:11.5px;color:#5B8FC9"))
    labels.append((W / 2, 302, W - 40, "Etwa so groß wie Deutschland und Frankreich zusammen — "
                                       "ohne Rad, ohne Zugtiere, ohne Metallwerkzeug.",
                   "font-size:14.5px;color:%s" % S.BODY))
    labels.append((W / 2, 322, 400, "Karte: Natural Earth · public domain",
                   "font-size:10.5px;color:%s" % S.MUTED))
    return c.svg("Das Siedlungsgebiet der Maya in Mittelamerika"), labels


def zeitstrahl():
    """When the Maya lived - and where our own history sits on the same line."""
    c = S.Canvas(W, H)
    labels = []
    x0, x1, y = 70.0, W - 70.0, 168.0
    a, b = -2000, 2000        # the span the line covers
    def X(j):
        return x0 + (j - a) / (b - a) * (x1 - x0)
    c.line(x0, y, x1, y, color=S.INK, width=2.4)
    c.arrow(x1 - 30, y, x1 + 6, y, color=S.INK, width=2.4)
    # the Maya epochs as a band above the line
    epochen = [(-2000, 250, "Präklassik", S.MUTED), (250, 900, "Klassik", S.RED),
               (900, 1697, "Postklassik", S.GREEN)]
    for von, bis, name, color in epochen:
        c.rect(X(von), y - 46, X(bis) - X(von), 34, fill=color, opacity=0.28, rx=6)
        c.rect(X(von), y - 46, X(bis) - X(von), 34, fill="none", stroke=color, width=1.8, rx=6)
        labels.append(((X(von) + X(bis)) / 2, y - 29, X(bis) - X(von) - 6, name,
                       "font-size:14px;font-weight:600;color:%s" % S.INK))
    for j, txt in ((-2000, "2000 v. Chr."), (0, "Chr. Geburt"), (1000, "1000"), (2000, "heute")):
        c.line(X(j), y - 7, X(j), y + 7, color=S.INK, width=1.8)
        labels.append((X(j), y + 26, 150, txt, "font-size:13px;color:%s" % S.MUTED))
    # two marks below, so the span gets a feel
    for j, txt, color, drop in ((800, "Blütezeit der Städte", S.RED, 58),
                                (1521, "Spanier erobern Mexiko", S.INK, 104)):
        c.circle(X(j), y, 5.5, fill=color, stroke=S.PAPER, width=1.8)
        c.line(X(j), y + 10, X(j), y + drop, color=color, width=1.4, dash="4 4")
        labels.append((X(j), y + drop + 16, 200, txt,
                       "font-size:14px;font-weight:600;color:%s" % color))
    labels.append((W / 2, 46, W - 60, "Die Maya haben die Null **Jahrhunderte vor Europa** "
                                      "benutzt — sie kam erst um 1200 über die Araber zu uns.",
                   "font-size:15px;color:%s" % S.BODY))
    return c.svg("Zeitstrahl: die Epochen der Maya-Zivilisation"), labels


FIGURES = {"ziffern": ziffern, "punkt_strich_muschel": punkt_strich_muschel,
           "stellen10": stellen10, "stellen20": stellen20, "stellen_maya": stellen_maya,
           "maya_zahl": maya_zahl, "aufgabe": aufgabe, "potenzen": potenzen,
           "karte": karte, "zeitstrahl": zeitstrahl}

if __name__ == "__main__":
    svg, labels = FIGURES[sys.argv[1]]()
    print(svg)
    for lab in labels:
        print("<!-- label %g %g %g: %s -->" % (lab[0], lab[1], lab[2], lab[3]))
