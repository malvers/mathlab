#!/usr/bin/env python3
"""The Babylonian deck's figures as SVG - drawn with svgfig, embedded inline in the deck.

    python3 tools/pptx/babylon_svg.py ziffern      # prints the <svg> markup

Rule 23 (CLAUDE.md): a drawn diagram is inline SVG plus HTML labels, never a PNG on a slide.
Canvas is the picture box of a content slide, 816 x 330 design pixels (deck.css .pic).

The twin of maya_svg.py, and deliberately built the same way: keil_digit() is to this file what
digit() is to that one, so a lab can drive both from one interface.
"""
import math
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "aufgaben"))
import svgfig as S

W, H = 816, 330


def label(c, x, y, markup, size=14, color=S.INK, family=S.SANS, weight=None, anchor="middle"):
    c.raw('<text x="%s" y="%s" font-family="%s" font-size="%s" fill="%s" text-anchor="%s"'
          ' dominant-baseline="central"%s>%s</text>'
          % (S.fmt(x), S.fmt(y), family, size, color, anchor,
             ' font-weight="%s"' % weight if weight else "", markup))


# ------------------------------------------------------------- cuneiform ---
# Two signs only: a vertical wedge worth one, a corner wedge worth ten. Both are pressed
# into clay with the same stylus - that is why they look like wedges and not like strokes.
def wedge(c, x, y, h=26.0, color=S.INK):
    """The vertical wedge = 1. A narrow triangle with a tail, pointing down."""
    w = h * 0.34
    c.poly([(x - w / 2, y), (x + w / 2, y), (x, y + h * 0.62)], stroke=color, width=1.2,
           fill=color, close=True)
    c.line(x, y + h * 0.55, x, y + h, color=color, width=max(1.4, h * 0.055))


def corner(c, x, y, h=26.0, color=S.INK):
    """The corner wedge = 10. Pressed at an angle, it opens to the left."""
    w = h * 0.62
    c.poly([(x + w / 2, y), (x - w / 2, y + h * 0.34), (x + w / 2, y + h * 0.68)],
           stroke=color, width=1.2, fill=color, close=True)


def digit_size(n, h=26.0):
    """Width and height one Babylonian digit 1..59 needs - tens block left, ones block right.
    Same arithmetic as keil_digit, so a digit centred on this width really sits in the middle."""
    tens, ones = n // 10, n % 10
    w = (min(tens, 3) * h * 0.72 + 8) if tens else 0.0
    w += ((ones + 2) // 3) * h * 0.46 if ones else 0.0
    rows = max((tens + 2) // 3 if tens else 0, min(ones, 3))
    return w, max(rows, 1) * h * 0.80 + h * 0.06


def keil_digit(c, x, top, n, h=26.0, color=S.INK, ones_color=None):
    """One Babylonian digit 1..59 with its top left corner at (x, top). Returns its width.

    Tens as corner wedges (up to five, in two rows of three), ones as vertical wedges
    (up to nine, in three columns of three) - the way the scribes grouped them."""
    tens, ones = n // 10, n % 10
    cx = x
    if tens:
        cw, rh = h * 0.72, h * 0.80
        for i in range(tens):
            col, row = i % 3, i // 3
            corner(c, cx + col * cw, top + row * rh, h * 0.86, color)
        cx += min(tens, 3) * cw + 8
    if ones:
        cw, rh = h * 0.46, h * 0.80
        for i in range(ones):
            col, row = i // 3, i % 3
            wedge(c, cx + col * cw + cw / 2, top + row * rh, h * 0.86, ones_color or color)
        cx += ((ones + 2) // 3) * cw
    return cx - x


def zeichen():
    """The two signs on their own - a wedge is one, a corner is ten. That is the whole alphabet."""
    c = S.Canvas(W, H)
    labels = []
    for cx, name, val, color, draw in ((250, "Senkrechter Keil", "1", S.RED, wedge),
                                       (566, "Winkelhaken", "10", S.INK, corner)):
        c.rect(cx - 130, 30, 260, 180, fill="#F4F7FC", stroke=color, width=2.6, rx=14)
        draw(c, cx, 62, 76, color)
        label(c, cx, 178, "= %s" % val, 30, color=color, weight="600")
        labels.append((cx, 238, 260, name, "font-size:18px;font-weight:600;color:%s" % S.INK))
    labels.append((W / 2, 288, W - 60, "Beide werden mit **demselben Griffel** in weichen Ton "
                                       "gedrückt — einmal gerade, einmal schräg.",
                   "font-size:15px;color:%s" % S.BODY))
    return c.svg("Die zwei Zeichen der Keilschrift: senkrechter Keil = 1, Winkelhaken = 10"), labels


def ziffern():
    """The digits 1 to 59 - the Babylonians built each one from tens and ones, decimally."""
    c = S.Canvas(W, H)
    labels = []
    # six rows of digits leave no room for a number underneath, so it stands at the
    # start of its cell - the digit keeps the rest of the width to itself
    cols, cw, ch, h, nw = 10, 79.0, 53.0, 13.0, 25.0
    x0 = (W - cols * cw) / 2
    for n in range(1, 60):
        col, row = (n - 1) % cols, (n - 1) // cols
        x, top = x0 + col * cw, 12 + row * ch
        w = digit_size(n, h)[0]
        keil_digit(c, x + nw + (cw - nw - w) / 2, top, n, h=h, color=S.INK, ones_color=S.RED)
        labels.append((x + nw / 2 + 2, top + 15, nw + 6, str(n),
                       "font-size:10.5px;font-weight:600;color:%s" % S.MUTED))
    for row in range(1, 6):
        c.line(x0 + 4, 6 + row * ch, x0 + cols * cw - 4, 6 + row * ch,
               color="#EDF1F7", width=1)
    return c.svg("Die 59 Ziffern des babylonischen Systems, aus Keil und Winkelhaken gebaut"), labels


def keine_null():
    """The hole in the system: without a zero, 1 and 60 look the same."""
    c = S.Canvas(W, H)
    labels = []
    for k, (n, txt) in enumerate(((1, "$1$"), (60, "$1 \\cdot 60 = 60$"),
                                  (3600, "$1 \\cdot 60^2 = 3600$"))):
        cx = 170 + k * 240
        c.rect(cx - 90, 54, 180, 120, fill="#F4F7FC", stroke=S.ORANGE, width=2.4, rx=12)
        keil_digit(c, cx - 8, 86, 1, h=44, color=S.INK)
        labels.append((cx, 200, 220, txt, "font-size:18px;color:%s" % S.BODY))
    labels.append((W / 2, 30, W - 60, "**Dasselbe Zeichen** — drei verschiedene Zahlen",
                   "font-size:17px;font-weight:600;color:%s" % S.RED))
    labels.append((W / 2, 250, W - 60, "Die Babylonier hatten **keine Null**. Welche Stelle "
                                       "gemeint war, musste aus dem Zusammenhang kommen.",
                   "font-size:16px;color:%s" % S.BODY))
    labels.append((W / 2, 296, W - 60, "Erst viel später setzten sie ein **Trennzeichen** für "
                                       "eine leere Stelle — und auch das nie am Ende einer Zahl.",
                   "font-size:15px;color:%s" % S.MUTED))
    return c.svg("Ohne Null bleibt die Zahl mehrdeutig"), labels


def teiler():
    """Why sixty: it is small and still splits many ways. The divisors drawn as pairs."""
    c = S.Canvas(W, H)
    labels = []
    paare = [(1, 60), (2, 30), (3, 20), (4, 15), (5, 12), (6, 10)]
    bw, gap = 112.0, 14.0
    x0 = (W - (len(paare) * bw + (len(paare) - 1) * gap)) / 2
    for i, (a, b) in enumerate(paare):
        x = x0 + i * (bw + gap)
        c.rect(x, 74, bw, 96, fill="#F4F7FC", stroke=S.GREEN, width=2.2, rx=10)
        labels.append((x + bw / 2, 106, bw - 8, "$%d \\cdot %d$" % (a, b),
                       "font-size:19px;font-weight:600;color:%s" % S.INK))
        labels.append((x + bw / 2, 142, bw - 8, "$= 60$", "font-size:16px;color:%s" % S.MUTED))
    labels.append((W / 2, 40, W - 60, "$60 = 2^2 \\cdot 3 \\cdot 5$ — **zwölf Teiler**: "
                                      "1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60",
                   "font-size:17px;color:%s" % S.INK))
    labels.append((W / 2, 212, W - 60, "Ein Drittel, ein Viertel, ein Fünftel, ein Sechstel — "
                                       "alles geht **ohne Rest** auf.",
                   "font-size:16px;color:%s" % S.BODY))
    labels.append((W / 2, 258, W - 60, "Zum Vergleich: **10** hat nur vier Teiler (1, 2, 5, 10), "
                                       "**12** hat sechs, **100** hat neun.",
                   "font-size:15px;color:%s" % S.MUTED))
    labels.append((W / 2, 300, W - 60, "Darum teilen wir Kreis, Stunde und Minute bis heute "
                                       "**babylonisch**.", "font-size:15px;color:%s" % S.GREEN))
    return c.svg("Die Teilerpaare der 60"), labels


def teilervergleich():
    """60 against its neighbours: the same twelve divisors, but 60 is by far the smallest."""
    c = S.Canvas(W, H)
    labels = []
    zahlen = [(60, 12), (72, 12), (84, 12), (90, 12), (96, 12), (108, 12), (120, 16)]
    bw = 96.0
    x0 = (W - len(zahlen) * bw) / 2
    hmax = 118.0
    for i, (n, t) in enumerate(zahlen):
        x = x0 + i * bw + 8
        h = hmax * t / 16.0
        color = S.RED if n == 60 else ("#C8D2E2" if n != 120 else S.GREEN)
        c.rect(x, 210 - h, bw - 16, h, fill=color, rx=6, opacity=1 if n in (60, 120) else 0.9)
        labels.append((x + (bw - 16) / 2, 200 - h - 14, bw, str(t),
                       "font-size:17px;font-weight:600;color:%s" % S.INK))
        labels.append((x + (bw - 16) / 2, 230, bw, str(n),
                       "font-size:16px;font-weight:600;color:%s"
                       % (S.RED if n == 60 else S.MUTED)))
    c.line(x0, 210, x0 + len(zahlen) * bw, 210, color=S.INK, width=1.8)
    labels.append((W / 2, 34, W - 60, "Wie viele Teiler hat die Zahl?",
                   "font-size:17px;font-weight:600;color:%s" % S.INK))
    labels.append((W / 2, 272, W - 60, "**60 ist die kleinste** Zahl mit zwölf Teilern. "
                                       "120 hat mehr — aber man muss doppelt so weit zählen.",
                   "font-size:16px;color:%s" % S.BODY))
    labels.append((W / 2, 304, W - 60, "Klein **und** teilbar: das ist der ganze Trick.",
                   "font-size:15px;color:%s" % S.MUTED))
    return c.svg("Teileranzahl von 60 bis 120 im Vergleich"), labels


def kreis():
    """Six times sixty is three hundred and sixty - where the degree comes from."""
    c = S.Canvas(W, H)
    labels = []
    cx, cy, r = 268.0, 158.0, 116.0

    def pt(a, f=1.0):
        """A point on the circle - same convention as svgfig.sector: 0 is twelve o'clock."""
        rad = math.radians(a - 90)
        return cx + r * f * math.cos(rad), cy + r * f * math.sin(rad)

    for i in range(6):
        c.sector(cx, cy, r, i * 60, (i + 1) * 60,
                 fill=S.ORANGE if i % 2 == 0 else S.GREEN, opacity=0.45, stroke="none", width=0)
    c.raw('<circle cx="%s" cy="%s" r="%s" fill="none" stroke="%s" stroke-width="2.4"/>'
          % (S.fmt(cx), S.fmt(cy), S.fmt(r), S.INK))
    for i in range(6):
        x, y = pt(i * 60)
        c.line(cx, cy, x, y, color=S.INK, width=1.8)
        lx, ly = pt(i * 60 + 30, 0.66)
        labels.append((lx, ly, 74, "$60°$", "font-size:16px;font-weight:600;color:%s" % S.INK))
    labels.append((600, 88, 330, "**Sechs gleichseitige Dreiecke** passen genau in den Kreis",
                   "font-size:16px;color:%s" % S.BODY))
    labels.append((600, 150, 330, "$6 \\cdot 60° = 360°$",
                   "font-size:26px;font-weight:600;color:%s" % S.RED))
    labels.append((600, 214, 330, "Der Radius lässt sich sechsmal auf dem Kreisrand abtragen — "
                                  "das konnte man mit einer Schnur nachmessen.",
                   "font-size:14px;color:%s" % S.MUTED))
    return c.svg("Sechs mal sechzig Grad ergeben den vollen Kreis"), labels


def stellen60():
    """The places of the sexagesimal system, with the example from the deck."""
    c = S.Canvas(W, H)
    labels = []
    zif = [10, 11, 22]
    werte = [3600, 60, 1]
    cw, ch = 176.0, 108.0
    x0 = (W - 3 * cw) / 2
    gesamt = 0
    for i, (z, w) in enumerate(zip(zif, werte)):
        x = x0 + i * cw
        c.rect(x + 6, 58, cw - 16, ch, fill="#F4F7FC", stroke=S.INK, width=2.4, rx=12)
        dw = digit_size(z, 26)[0]
        keil_digit(c, x + 6 + (cw - 16 - dw) / 2, 82, z, h=26, color=S.INK, ones_color=S.RED)
        labels.append((x + cw / 2, 40, cw - 10, ["$60^2 = 3600$", "$60^1 = 60$", "$60^0 = 1$"][i],
                       "font-size:16px;font-weight:600;color:%s" % S.MUTED))
        labels.append((x + cw / 2, 186, cw - 10, "$%d \\cdot %s$" % (z, "{:,}".format(w).replace(",", "\\,")),
                       "font-size:18px;color:%s" % S.BODY))
        labels.append((x + cw / 2, 218, cw - 10, "$= %s$" % "{:,}".format(z * w).replace(",", "\\,"),
                       "font-size:18px;font-weight:600;color:%s" % S.INK))
        gesamt += z * w
    c.line(x0 + 20, 240, x0 + 3 * cw - 26, 240, color=S.INK, width=2)
    labels.append((W / 2, 268, 420, "$%s$" % "{:,}".format(gesamt).replace(",", "\\,"),
                   "font-size:27px;font-weight:600;color:%s" % S.RED))
    labels.append((W / 2, 308, W - 60, "Jede Stelle ist **sechzigmal** so viel wert wie ihre "
                                       "rechte Nachbarin.", "font-size:14px;color:%s" % S.MUTED))
    return c.svg("Die Zahl 36682 im babylonischen Stellenwertsystem"), labels


def klein_beispiel():
    """The small example first: one sixty and one ten make seventy."""
    c = S.Canvas(W, H)
    labels = []
    c.rect(132, 66, 126, 122, fill="#F4F7FC", stroke=S.RED, width=2.4, rx=12)
    c.rect(272, 66, 126, 122, fill="#F4F7FC", stroke=S.INK, width=2.4, rx=12)
    keil_digit(c, 186, 96, 1, h=58, color=S.INK)
    keil_digit(c, 318, 96, 10, h=58, color=S.INK)
    labels.append((195, 44, 150, "**60er-Stelle**", "font-size:14px;font-weight:600;color:%s" % S.RED))
    labels.append((335, 44, 150, "Einer-Stelle", "font-size:14px;font-weight:600;color:%s" % S.INK))
    labels.append((195, 212, 150, "$1 \\cdot 60$", "font-size:18px;color:%s" % S.BODY))
    labels.append((335, 212, 150, "$1 \\cdot 10$", "font-size:18px;color:%s" % S.BODY))
    labels.append((560, 126, 320, "$1 \\cdot 60 + 1 \\cdot 10 = 70$",
                   "font-size:24px;font-weight:600;color:%s" % S.INK))
    labels.append((560, 180, 340, "Der linke Keil steht in der **60er-Stelle**, der Winkelhaken "
                                  "in der **Einer-Stelle**.", "font-size:15px;color:%s" % S.BODY))
    labels.append((W / 2, 286, W - 60, "Vorsicht: **innerhalb** einer Ziffer wird zehnerweise "
                                       "gezählt, **zwischen** den Stellen sechzigerweise.",
                   "font-size:15px;color:%s" % S.MUTED))
    return c.svg("Ein kleines Beispiel: 1 mal 60 plus 10 ergibt 70"), labels


def zweistromland():
    """Where it happened - Euphrates and Tigris as they really run (Natural Earth, ne_karte.py),
    with the cities the deck names. Doc, 23.09.2026: "wir brauchen Karten von ... Zweistromland"."""
    import ne_karte as N
    c, P = N.zeichne("zweistromland", hervor=("Iraq",), karte_h=284, pad=4)
    labels = []
    labels += N.legende(c, P, "ul", [
        ("**Das Zweistromland**", 15, "font-size:15px;font-weight:600;color:%s" % S.INK),
        ("Sumer und Babylonien", 12, "font-size:12px;color:%s" % S.BODY),
        ("— heute Irak", 12, "font-size:12px;color:%s" % S.BODY)])
    stellen = {"Babylon": (-46, 2), "Ur": (-30, 16), "Uruk": (34, 2), "Assur": (-34, -6),
               "Bagdad": (36, -8), "Basra": (32, 10)}
    for name, lon, lat, art in N.REGIONEN["zweistromland"]["orte"]:
        x, y = N.ort(c, P, lon, lat, art)
        dx, dy = stellen[name]
        labels.append((x + dx, y + dy, 120, name,
                       "font-size:12.5px;font-weight:600;color:%s"
                       % (S.RED if art == "ruine" else S.INK)))
    for lon, lat, name, dx, dy in ((41.4, 34.2, "Euphrat", -10, 16), (43.4, 36.6, "Tigris", 18, -8)):
        x, y = P(lon, lat)
        labels.append((x + dx, y + dy, 110, name, "font-size:13px;font-weight:600;color:#3C6FA8"))
    labels.append((588, 258, 150, "Persischer Golf", "font-size:11.5px;color:#5B8FC9"))
    labels.append((W / 2, 302, W - 40, "Hier wurde vor rund **5000 Jahren** die Keilschrift "
                                       "erfunden — und mit ihr das Rechnen zur Basis 60.",
                   "font-size:14.5px;color:%s" % S.BODY))
    labels.append((W / 2, 322, 400, "Karte: Natural Earth · public domain",
                   "font-size:10.5px;color:%s" % S.MUTED))
    return c.svg("Das Zweistromland zwischen Euphrat und Tigris"), labels


def dezimal_beispiel():
    """Our own system first, so the comparison later has something to stand on."""
    c = S.Canvas(W, H)
    labels = []
    cw, ch = 150.0, 96.0
    x0 = (W - 3 * cw) / 2
    for i, (z, w, p) in enumerate(((3, 100, "$10^2$"), (2, 10, "$10^1$"), (7, 1, "$10^0$"))):
        x = x0 + i * cw
        c.rect(x + 8, 56, cw - 20, ch, fill="#F4F7FC", stroke=S.INK, width=2.4, rx=12)
        label(c, x + cw / 2, 56 + ch / 2, str(z), 46, color=S.RED, weight="600")
        labels.append((x + cw / 2, 176, cw - 10, p, "font-size:17px;color:%s" % S.MUTED))
        labels.append((x + cw / 2, 212, cw - 10, "$%d \\cdot %d = %d$" % (z, w, z * w),
                       "font-size:17px;color:%s" % S.BODY))
    labels.append((W / 2, 26, W - 60, "Zehn Ziffern: **0 1 2 3 4 5 6 7 8 9**",
                   "font-size:17px;font-weight:600;color:%s" % S.INK))
    labels.append((W / 2, 258, W - 60, "$327 = 300 + 20 + 7$",
                   "font-size:24px;font-weight:600;color:%s" % S.INK))
    labels.append((W / 2, 306, W - 60, "Genau so ist das babylonische System gebaut — "
                                       "nur mit **60** statt 10.", "font-size:16px;color:%s" % S.BODY))
    return c.svg("Die Zahl 327 im Zehnersystem"), labels


def erbe():
    """What is still babylonian in our own day."""
    c = S.Canvas(W, H)
    labels = []
    posten = [("Kreis", "$360°$", "$6 \\cdot 60$"), ("Stunde", "$60$ min", "$60^1$"),
              ("Minute", "$60$ s", "$60^1$"), ("Jahr", "$12$ Monate", "Teiler von 60"),
              ("Tag", "$24$ Stunden", "$2 \\cdot 12$")]
    bw, gap = 136.0, 16.0
    x0 = (W - (len(posten) * bw + (len(posten) - 1) * gap)) / 2
    for i, (was, wert, warum) in enumerate(posten):
        x = x0 + i * (bw + gap)
        c.rect(x, 62, bw, 150, fill="#F4F7FC", stroke=S.ORANGE, width=2.4, rx=12)
        labels.append((x + bw / 2, 92, bw - 10, "**%s**" % was,
                       "font-size:16px;font-weight:600;color:%s" % S.INK))
        labels.append((x + bw / 2, 136, bw - 10, wert,
                       "font-size:21px;font-weight:600;color:%s" % S.RED))
        labels.append((x + bw / 2, 182, bw - 10, warum, "font-size:13px;color:%s" % S.MUTED))
    labels.append((W / 2, 32, W - 60, "Was wir bis heute babylonisch zählen",
                   "font-size:18px;font-weight:600;color:%s" % S.INK))
    labels.append((W / 2, 250, W - 60, "Jedes Mal, wenn du auf die Uhr siehst, rechnest du zur "
                                       "**Basis 60** — seit fünftausend Jahren.",
                   "font-size:16px;color:%s" % S.BODY))
    labels.append((W / 2, 296, W - 60, "Das Jahr hatte 360 Tage, die fünf übrigen zählten "
                                       "**zwischen** den Jahren.", "font-size:14px;color:%s" % S.MUTED))
    return c.svg("Das babylonische Erbe in unserem Alltag"), labels


FIGURES = {"zeichen": zeichen, "ziffern": ziffern, "keine_null": keine_null, "teiler": teiler,
           "teilervergleich": teilervergleich, "kreis": kreis, "stellen60": stellen60,
           "klein_beispiel": klein_beispiel, "zweistromland": zweistromland,
           "dezimal_beispiel": dezimal_beispiel, "erbe": erbe}

if __name__ == "__main__":
    svg, labels = FIGURES[sys.argv[1]]()
    print(svg)
    for lab in labels:
        print("<!-- label %g %g %g: %s -->" % (lab[0], lab[1], lab[2], lab[3]))
