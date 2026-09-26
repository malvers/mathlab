#!/usr/bin/env python3
"""BLF-Training Gymnasium Klasse 10 - Koerper und Flaechen (Teil B, mit MMS).

    python3 tools/aufgaben/blf/koerper.py

Composite areas and solids come up in every BLF, usually inside the long context task:
a cross-section made of a rectangle and a semicircle (2024/25), a cylinder from a
rotating rectangle (2022/23), the arc between two gondolas (2023/24). Klasse 10 adds
pyramids and cones with trigonometry (Lernbereich 3). Wording, numbers and every
figure are our own.
"""
import math
import os
import sys
from math import acos, ceil, degrees, pi, sqrt

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# ------------------------------------------------- Aufgabe 1: Gewaechshaus ----
GB, GH, GL, ROLL = 4.0, 3.2, 12.0, 50.0        # width, total height, length, m^2 per roll
GR = GB / 2
WALL = GH - GR
QUER = GB * WALL + pi * GR ** 2 / 2
VOL = QUER * GL
MANTEL = (2 * WALL + pi * GR) * GL
FOLIE = MANTEL + 2 * QUER

# ---------------------------------------------------- Aufgabe 2: Glasdach -----
PA_, PS_ = 6.0, 7.0                             # base edge, lateral edge
HALF_DIAG = PA_ * sqrt(2) / 2
PH = sqrt(PS_ ** 2 - HALF_DIAG ** 2)
PV = PA_ ** 2 * PH / 3
HS = sqrt(PS_ ** 2 - (PA_ / 2) ** 2)            # height of a side triangle
GLAS = 4 * PA_ * HS / 2
TIP = degrees(acos((2 * PS_ ** 2 - PA_ ** 2) / (2 * PS_ ** 2)))
EDGE = degrees(acos(HALF_DIAG / PS_))

# ---------------------------------------------------- Aufgabe 3: Eiswaffel -----
KR, KH = 3.0, 12.0                              # cone radius and depth, ball radius = KR
V_KEGEL = pi * KR ** 2 * KH / 3
V_KUGEL = 4 * pi * KR ** 3 / 3
H_HALF = (V_KUGEL / 2 * 3 * (KH / KR) ** 2 / pi) ** (1 / 3)
SLANT = sqrt(KR ** 2 + KH ** 2)
M_WAFFEL = pi * KR * SLANT


# ----------------------------------------------------------------- figures ---
def fig_haus():
    sc = 52.0
    ox, oy = 110, 250
    c = S.Canvas(440, 290)
    x0, x1 = ox, ox + GB * sc
    yw = oy - WALL * sc
    cx = (x0 + x1) / 2.0
    d = ("M %s %s L %s %s A %s %s 0 0 1 %s %s L %s %s Z"
         % (S.fmt(x0), S.fmt(oy), S.fmt(x0), S.fmt(yw), S.fmt(GR * sc), S.fmt(GR * sc),
            S.fmt(x1), S.fmt(yw), S.fmt(x1), S.fmt(oy)))
    c.path(d, stroke="none", fill=S.GREEN, opacity=0.18)
    c.path(d, stroke=S.INK, width=1.8)
    c.line(x0, yw, x1, yw, S.MUTED, 1, dash="4 3")
    c.line(40, oy, 400, oy, S.INK, 1.2)
    # measures: width below, total height right
    c.arrow(x0, oy + 18, x1, oy + 18, S.MUTED, 1.1)
    c.arrow(x1, oy + 18, x0, oy + 18, S.MUTED, 1.1)
    c.text(cx, oy + 34, "4,00 m", 12.5, S.BODY)
    c.arrow(x1 + 26, oy, x1 + 26, oy - GH * sc, S.MUTED, 1.1)
    c.arrow(x1 + 26, oy - GH * sc, x1 + 26, oy, S.MUTED, 1.1)
    c.text(x1 + 34, oy - GH * sc / 2.0 + 4, "3,20 m", 12.5, S.BODY, "start")
    c.text(x0 - 10, (oy + yw) / 2.0 + 4, "Seitenwand", 11.5, S.MUTED, "end")
    return c.svg("Querschnitt des Gewaechshauses: Rechteck mit aufgesetztem Halbkreis, "
                 "4 m breit und insgesamt 3,20 m hoch")


def fig_pyramide():
    a, h = PA_, PH
    # front edge AB runs along y, so it lies flat on the page and the face ABS faces the
    # reader; x points towards the reader (lower left in the cabinet projection)
    A, B, C, D = (a, 0, 0), (a, a, 0), (0, a, 0), (0, 0, 0)
    M, Sp = (a / 2, a / 2, 0), (a / 2, a / 2, h)
    E = (a, a / 2, 0)                                  # midpoint of AB
    sd = S.Solid(w=440, h=320, scale=30, ox=150, oy=205)
    sd.shade([A, B, Sp], S.ORANGE, 0.30)
    sd.shade([B, C, Sp], S.ORANGE, 0.16)
    sd.edges([(A, B), (B, C), (A, Sp), (B, Sp), (C, Sp)])
    sd.edges([(A, D), (D, C), (D, Sp)], color=S.MUTED, dash="5 4")
    sd.edge(M, Sp, S.RED, 1.5, dash="4 3")
    sd.edge(E, Sp, S.GREEN, 1.5, dash="4 3")
    for p, lab, pos in ((A, "A", "left"), (B, "B", "right"), (C, "C", "right"),
                        (D, "D", "above-left"), (Sp, "S", "above")):
        sd.vertex(p, lab, pos)
    sd.vertex(M, "M", "right", color=S.MUTED, size=2.4)
    sd.label3(E, "6 m", 0, 20, 12.5, S.BODY)
    sd.label3(((B[0] + Sp[0]) / 2, (B[1] + Sp[1]) / 2, h / 2), "7 m", 12, 4, 12.5,
              S.BODY, anchor="start")
    sd.label3((a / 2, a / 2, h * 0.62), "h", -7, 4, 14, S.RED, anchor="end", italic=True)
    return sd.svg("Schraegbild der quadratischen Pyramide ABCDS mit Grundkante 6 m und "
                  "Seitenkante 7 m; rot die Hoehe h, gruen die Hoehe einer Seitenflaeche")


def fig_waffel():
    c = S.Canvas(300, 400)
    sc = 20.0
    cx, top = 150, 132
    tip = top + KH * sc
    r = KR * sc
    assert tip + 6 < c.h and top - 1.75 * r > 0      # tip and ball stay on the canvas
    c.poly([(cx - r, top), (cx + r, top), (cx, tip)], stroke="none", fill=S.ORANGE,
           opacity=0.45)
    c.poly([(cx - r, top), (cx, tip), (cx + r, top)], stroke=S.INK, width=1.6, close=False)
    c.raw('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="none" stroke="%s" '
          'stroke-width="1.3"/>' % (cx, top, r, r * 0.22, S.INK))
    c.raw('<circle cx="%s" cy="%s" r="%s" fill="%s" opacity="0.5"/>'
          % (cx, top - r * 0.75, r, "#E8A0B4"))
    c.raw('<circle cx="%s" cy="%s" r="%s" fill="none" stroke="%s" stroke-width="1.4"/>'
          % (cx, top - r * 0.75, r, S.INK))
    c.arrow(cx + r + 22, top, cx + r + 22, tip, S.MUTED, 1.1)
    c.arrow(cx + r + 22, tip, cx + r + 22, top, S.MUTED, 1.1)
    c.text(cx + r + 30, (top + tip) / 2.0, "12 cm", 12.5, S.BODY, "start")
    c.arrow(cx - r, top + r * 0.22 + 14, cx + r, top + r * 0.22 + 14, S.MUTED, 1.0)
    c.arrow(cx + r, top + r * 0.22 + 14, cx - r, top + r * 0.22 + 14, S.MUTED, 1.0)
    c.text(cx, top + r * 0.22 + 30, "6 cm", 12.5, S.BODY, halo=S.PAPER)
    return c.svg("Eiswaffel als Kegel mit 6 cm Durchmesser und 12 cm Tiefe, darauf eine "
                 "Eiskugel mit 6 cm Durchmesser")


# ------------------------------------------------------------------- sheet ---
s = Sheet("blf-gy-koerper", "Körper und Flächen",
          kind="BLF-Training",
          suffix="",
          klasse="Gymnasium · Klasse 10",
          sub="Gymnasium · Klasse 10 · Besondere Leistungsfeststellung Mathematik · Teil B, "
              "mit MMS und Formelsammlung · drei Aufgaben, Anforderungsbereiche I bis III",
          desc="BLF-Training Mathematik Gymnasium Klasse 10: zusammengesetzte Flächen und "
               "Körper, eine Pyramide mit Trigonometrie, Kegel und Kugel an einer "
               "Eiswaffel, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/blf.html", "Zur Übersicht"))

s.task(
    "Das Gewächshaus", 1,
    r"Ein $12$ m langes Gewächshaus hat als Querschnitt ein Rechteck mit aufgesetztem "
    r"Halbkreis. Es ist $4{,}00$ m breit und insgesamt $3{,}20$ m hoch (siehe Abbildung). "
    r"Seitenwände, Dach und die beiden Stirnseiten sind mit Folie bespannt.",
    [
        r"Begründen Sie, dass jede Seitenwand $1{,}20$ m hoch ist.",
        r"Berechnen Sie den Flächeninhalt des Querschnitts.",
        r"Berechnen Sie das Volumen der Luft im Gewächshaus.",
        r"Die Folie wird in Rollen zu je $50\ \mathrm{m}^2$ verkauft. Ermitteln Sie, wie "
        r"viele Rollen mindestens gekauft werden müssen.",
    ],
    [
        r"Der Halbkreis sitzt auf der ganzen Breite, sein Radius ist also "
        r"$r = \frac{4{,}00}{2} = 2{,}00$ m. Von der Gesamthöhe bleiben für die Wand "
        r"$3{,}20 - 2{,}00 = 1{,}20$ m.",

        r"Rechteck plus Halbkreis: $A = 4{,}00 \cdot 1{,}20 + \frac{1}{2} \pi \cdot 2^2 = "
        r"4{,}8 + 2\pi \approx 11{,}08\ \mathrm{m}^2$.",

        r"Das Gewächshaus ist ein Prisma mit diesem Querschnitt: "
        r"$V = A \cdot 12 \approx 133\ \mathrm{m}^3$.",

        r"Seitenwände und Dach zusammen: $(2 \cdot 1{,}20 + \pi \cdot 2) \cdot 12 \approx "
        r"104{,}2\ \mathrm{m}^2$ (der halbe Kreisumfang ist $\pi r$). Dazu zwei "
        r"Stirnseiten: $2 \cdot 11{,}08 \approx 22{,}2\ \mathrm{m}^2$. Insgesamt etwa "
        r"$126{,}4\ \mathrm{m}^2$, das sind $2{,}5$ Rollen. Es müssen also **drei Rollen** "
        r"gekauft werden.",
    ],
    falle=r"Beim Dach zählt der **halbe** Kreisumfang $\pi r$, nicht $2\pi r$. Und das "
          r"Ergebnis $2{,}5$ Rollen muss aufgerundet werden: Halbe Rollen gibt es nicht zu "
          r"kaufen.",
    figs=[(fig_haus(), "Der Querschnitt des Gewächshauses.")],
)

s.task(
    "Das Glasdach", 2,
    r"Ein Innenhof wird von einem Glasdach in Form einer geraden quadratischen Pyramide "
    r"überdeckt. Die Grundkante ist $6$ m lang, jede Seitenkante $7$ m (siehe Abbildung, "
    r"nicht maßstäblich). Glas sind nur die vier Seitenflächen.",
    [
        r"Berechnen Sie die Höhe $h$ der Pyramide.",
        r"Berechnen Sie das Volumen des überdachten Raums oberhalb der Grundfläche.",
        r"Berechnen Sie die Größe des Winkels an der Spitze einer Seitenfläche.",
        r"Berechnen Sie den Inhalt der Glasfläche.",
    ],
    [
        r"Der Fußpunkt $M$ der Höhe liegt in der Mitte der Grundfläche, eine halbe "
        r"Diagonale ist $\frac{6\sqrt{2}}{2} = 3\sqrt{2} \approx 4{,}24$ m. Im Dreieck "
        r"$AMS$: $h = \sqrt{7^2 - (3\sqrt{2})^2} = \sqrt{49 - 18} = \sqrt{31} \approx "
        r"5{,}57$ m.",

        r"$V = \frac{1}{3} \cdot 6^2 \cdot \sqrt{31} = 12\sqrt{31} \approx 66{,}8\ "
        r"\mathrm{m}^3$.",

        r"Kosinussatz im gleichschenkligen Dreieck $ABS$: $\cos\varphi = "
        r"\frac{7^2 + 7^2 - 6^2}{2 \cdot 7 \cdot 7} = \frac{62}{98}$, also "
        r"$\varphi \approx 50{,}8°$.",

        r"Die Höhe einer Seitenfläche (grün) ist $h_s = \sqrt{7^2 - 3^2} = \sqrt{40} "
        r"\approx 6{,}32$ m. Vier Dreiecke: $A = 4 \cdot \frac{1}{2} \cdot 6 \cdot "
        r"\sqrt{40} = 12\sqrt{40} \approx 75{,}9\ \mathrm{m}^2$ Glas.",
    ],
    falle=r"In a) ist die halbe **Diagonale** gefragt, nicht die halbe Grundkante. Mit "
          r"$3$ m statt $4{,}24$ m erhält man $\sqrt{40}$, und das ist die Höhe einer "
          r"Seitenfläche aus d), nicht die der Pyramide.",
    figs=[(fig_pyramide(), "Das Glasdach als Pyramide. Rot: die Höhe h, grün: die Höhe "
                           "einer Seitenfläche.")],
)

s.task(
    "Schmilzt das Eis über?", 3,
    r"Eine Eiswaffel hat die Form eines Kegels: innen $6$ cm Durchmesser am Rand und "
    r"$12$ cm tief. Darauf sitzt eine Eiskugel mit ebenfalls $6$ cm Durchmesser. Die "
    r"Dicke der Waffel wird vernachlässigt.",
    [
        r"Berechnen Sie das Volumen der Eiskugel und das Innenvolumen der Waffel.",
        r"Die Kugel schmilzt vollständig in die Waffel. Untersuchen Sie, ob die Waffel "
        r"überläuft.",
        r"Ermitteln Sie, wie hoch (von der Spitze aus gemessen) das geschmolzene Eis in "
        r"der Waffel steht, wenn erst die Hälfte der Kugel geschmolzen ist.",
        r"Berechnen Sie, wie viel Waffelteig für die Mantelfläche der Waffel mindestens "
        r"nötig ist.",
    ],
    [
        r"Kugel: $V = \frac{4}{3}\pi \cdot 3^3 = 36\pi \approx 113{,}1\ \mathrm{cm}^3$. "
        r"Kegel: $V = \frac{1}{3}\pi \cdot 3^2 \cdot 12 = 36\pi \approx 113{,}1\ "
        r"\mathrm{cm}^3$.",

        r"Beide Volumina sind genau gleich, $36\pi\ \mathrm{cm}^3$. Die Waffel wird also "
        r"randvoll, läuft aber (im Modell) nicht über. In Wirklichkeit enthält Eis Luft, "
        r"geschmolzen braucht es sogar etwas weniger Platz.",

        r"Das Eis füllt einen kleineren Kegel mit derselben Form: Radius und Höhe stehen "
        r"immer im Verhältnis $3 : 12$, also $r = \frac{x}{4}$ bei der Füllhöhe $x$. "
        r"$\frac{1}{3}\pi \left(\frac{x}{4}\right)^2 x = 18\pi$ ergibt "
        r"$x^3 = 864$ und $x \approx 9{,}52$ cm. Das halbe Volumen steht also nicht auf "
        r"halber Höhe, sondern schon bei rund vier Fünfteln der Tiefe.",

        r"Mantellinie $s = \sqrt{3^2 + 12^2} = \sqrt{153} \approx 12{,}37$ cm. "
        r"Mantelfläche $M = \pi r s = \pi \cdot 3 \cdot \sqrt{153} \approx 116{,}6\ "
        r"\mathrm{cm}^2$.",
    ],
    falle=r"Bei c) liegt die Vermutung „halbes Volumen, halbe Höhe“ nahe, doch der Kegel "
          r"ist unten schmal. Wird die Füllhöhe halbiert, schrumpft das Volumen auf ein "
          r"Achtel, denn alle drei Maße werden halbiert.",
    figs=[(fig_waffel(), "Eiswaffel und Eiskugel (nicht maßstäblich).")],
)


def check():
    """Every number in the solutions, recomputed."""
    # --- Aufgabe 1 -----------------------------------------------------------------
    assert GR == 2 and abs(WALL - 1.2) < 1e-12
    assert abs(QUER - (4.8 + 2 * pi)) < 1e-12 and round(QUER, 2) == 11.08
    assert round(VOL) == 133
    assert round(MANTEL, 1) == 104.2 and round(2 * QUER, 1) == 22.2
    assert round(FOLIE, 1) == 126.4 and round(FOLIE / ROLL, 1) == 2.5
    assert ceil(FOLIE / ROLL) == 3
    # --- Aufgabe 2 -----------------------------------------------------------------
    assert abs(HALF_DIAG - 3 * sqrt(2)) < 1e-12 and round(HALF_DIAG, 2) == 4.24
    assert abs(PH - sqrt(31)) < 1e-12 and round(PH, 2) == 5.57
    assert abs(PV - 12 * sqrt(31)) < 1e-9 and round(PV, 1) == 66.8
    assert abs((2 * 49 - 36) / 98 - 62 / 98) < 1e-12 and round(TIP, 1) == 50.8
    assert abs(HS - sqrt(40)) < 1e-12 and round(HS, 2) == 6.32
    assert abs(GLAS - 12 * sqrt(40)) < 1e-9 and round(GLAS, 1) == 75.9
    # Kontrolle der Seitenhoehe ueber die Pyramidenhoehe: h_s^2 = h^2 + (a/2)^2
    assert abs(HS ** 2 - (PH ** 2 + 9)) < 1e-9
    # der Spitzenwinkel ueber die Seitenhoehe: tan(phi/2) = 3 / h_s
    assert abs(2 * math.degrees(math.atan(3 / HS)) - TIP) < 1e-9
    # --- Aufgabe 3 -----------------------------------------------------------------
    assert abs(V_KEGEL - 36 * pi) < 1e-9 and abs(V_KUGEL - 36 * pi) < 1e-9
    assert round(36 * pi, 1) == 113.1
    assert abs(pi * (H_HALF / 4) ** 2 * H_HALF / 3 - 18 * pi) < 1e-9
    assert abs(H_HALF ** 3 - 864) < 1e-9 and round(H_HALF, 2) == 9.52
    assert abs(H_HALF / KH - 0.79) < 0.01                      # rund vier Fuenftel
    assert abs(pi * (6 / 4) ** 2 * 6 / 3 - V_KEGEL / 8) < 1e-9  # halbe Hoehe: ein Achtel
    assert abs(SLANT - sqrt(153)) < 1e-12 and round(SLANT, 2) == 12.37
    assert round(M_WAFFEL, 1) == 116.6


s.verify(check)
s.save()
