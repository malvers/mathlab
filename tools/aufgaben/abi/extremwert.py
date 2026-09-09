#!/usr/bin/env python3
"""Abitur-Training BGY - Extremwertaufgaben (Optimieren mit Nebenbedingung).

    python3 tools/aufgaben/abi/extremwert.py

Task types follow the Sachsen originals: a rectangle inscribed under a curve, a
container of given volume with minimal surface, and an optimisation in context whose
plausible-sounding claim turns out to be wrong. Wording, numbers and every figure are
our own - the originals are not reproduced.
"""
import math
import os
import sys
from math import sqrt

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# --------------------------------------------------------------- functions ---
# Aufgabe 1: rectangle under the parabola f(x) = 9 - x^2, symmetric about the y-axis
def f(x):
    return 9.0 - x ** 2


def A(u):
    """Area of the rectangle with the corners (+-u | 0) and (+-u | f(u))."""
    return 2.0 * u * f(u)


def dA(u):
    return 18.0 - 6.0 * u ** 2


def ddA(u):
    return -12.0 * u


U = sqrt(3.0)                 # optimal half width
HOCH = f(U)                   # height of the largest rectangle, exactly 6
AMAX = A(U)                   # 12 * sqrt(3)
UVGL = 2.5                    # the dashed comparison rectangle
AVGL = A(UVGL)                # 13,75

# Aufgabe 2: open box with a square base, V = 4000 cm^3
VOL = 4000.0


def hoehe(a):
    return VOL / a ** 2


def O(a):
    """Surface of the open box: base plus four walls, with h already substituted."""
    return a ** 2 + 4.0 * VOL / a


def dO(a):
    return 2.0 * a - 4.0 * VOL / a ** 2


def ddO(a):
    return 2.0 + 8.0 * VOL / a ** 3


AOPT = 20.0                   # a^3 = 2V = 8000
HOPT = hoehe(AOPT)            # 10
OMIN = O(AOPT)                # 1200

# Aufgabe 3: cable from V along the shore to S, then through the lake to P
LAND, SEE, ABST, UFER = 30.0, 50.0, 40.0, 100.0


def k_land(x):
    """Cost of the cable running along the shore, falls with x."""
    return LAND * (UFER - x)


def k_see(x):
    """Cost of the cable through the lake, rises with x."""
    return SEE * sqrt(x ** 2 + ABST ** 2)


def K(x):
    return k_land(x) + k_see(x)


def dK(x):
    return -LAND + SEE * x / sqrt(x ** 2 + ABST ** 2)


def ddK(x):
    return SEE * ABST ** 2 / (x ** 2 + ABST ** 2) ** 1.5


XOPT = 30.0
KMIN = K(XOPT)                # 4600
XGLEICH = (-112.5 + sqrt(112.5 ** 2 + 4 * 3125.0)) / 2.0   # equal cost shares
KGLEICH = K(XGLEICH)


# ------------------------------------------------------------------ helper ---
def wrect(p, u0, u1, v0, v1, fill="none", opacity=None, stroke=None, width=1.5, dash=None):
    """Axis-parallel rectangle given in world coordinates - Plot.rect works in pixels."""
    p.rect(p.X(u0), p.Y(v1), p.X(u1) - p.X(u0), p.Y(v0) - p.Y(v1), fill=fill, opacity=opacity)
    if stroke:
        p.poly([p.P(u0, v0), p.P(u1, v0), p.P(u1, v1), p.P(u0, v1)],
               stroke=stroke, width=width, fill="none", dash=dash)


def min_screen_gap(sd, pts):
    """Smallest distance between two of the projected points - a cabinet projection
    can drop two corners onto nearly the same spot, and the figure then lies."""
    scr = [sd.P(p) for p in pts]
    return min(math.hypot(a[0] - b[0], a[1] - b[1])
               for i, a in enumerate(scr) for b in scr[i + 1:])


# ----------------------------------------------------------------- figures ---
def fig_rechteck():
    """The parabola with the best rectangle and a clearly worse one, dashed."""
    p = S.Plot((-4.0, 4.0), (-2.6, 10.6), w=520, h=350, pad=(44, 24, 20, 34))
    p.grid(1, 2)
    wrect(p, -UVGL, UVGL, 0, f(UVGL), fill=S.MUTED, opacity=0.13,
          stroke=S.MUTED, width=1.5, dash="6 4")
    wrect(p, -U, U, 0, HOCH, fill=S.ORANGE, opacity=0.32, stroke=S.INK, width=2.0)
    # axes after the rectangles - otherwise the tick labels vanish under the fill.
    # The tick at y = 6 falls exactly on the top edge of the rectangle and gets its own
    # halo below, so it stays readable.
    p.axes(1, 2, xlabel="x", ylabel="y", skip_y=(0, 6))
    p.curve(f, -3.35, 3.35, S.RED, 2.3)
    p.point(U, HOCH, None, color=S.RED, size=3.6)
    p.point(-U, HOCH, None, color=S.RED, size=3.6)
    p.brace(-U, U, 6.9, "Breite 3,46", S.INK)
    # labels last, so they sit on top of grid, rectangle and curve
    p.line(p.X(U), p.Y(0), p.X(U), p.Y(-1.35), S.MUTED, 1, dash="3 3")
    p.line(p.X(UVGL), p.Y(1.5), p.X(2.72), p.Y(1.5), S.MUTED, 1, dash="3 3")
    p.text(p.X(2.78), p.Y(1.5) + 4, "A = 13,75", 12, S.MUTED, "start", halo=S.PAPER)
    p.line(p.X(0) - 3.5, p.Y(6), p.X(0) + 3.5, p.Y(6), S.INK, 1.1)
    p.text(p.X(0) - 7, p.Y(6) + 4, "6", 11.5, S.MUTED, "end", halo=S.PAPER)
    p.text(p.X(0.85), p.Y(5.3), "Höhe 6", 12.5, S.BODY, halo=S.PAPER)
    p.text(p.X(0.85), p.Y(3.6), "A = 20,8", 14, S.INK, halo=S.PAPER)
    p.text(p.X(1.7), p.Y(-1.85), "optimal ist u = 1,73", 12, S.BODY, "middle", halo=S.PAPER)
    return p.svg("Parabel mit dem groessten einbeschriebenen Rechteck und einem "
                 "gestrichelten Vergleichsrechteck")


def fig_flaeche():
    """The target function A(u) with its maximum - and the comparison rectangle on it."""
    p = S.Plot((-0.45, 3.5), (-3.2, 25.0), w=480, h=300, pad=(46, 26, 20, 34))
    p.grid(0.5, 5)
    p.axes(1, 5, xlabel="u", ylabel="A")
    p.curve(A, 0, 3.06, S.RED, 2.3)
    p.dashto(U, AMAX)
    p.point(UVGL, AVGL, None, color=S.MUTED, size=3.2)
    p.point(U, AMAX, "Maximum", "above", color=S.RED)
    p.text(p.X(UVGL) + 9, p.Y(AVGL) + 5, "u = 2,5", 12, S.MUTED, "start", halo=S.PAPER)
    p.text(p.X(0.55), p.Y(21.4), "A = 20,78", 11.5, S.MUTED, "start", halo=S.PAPER)
    p.text(p.X(0.12), p.Y(23.6), "nur 0 < u < 3 ist sinnvoll", 11.5, S.BODY, "start",
           halo=S.PAPER)
    return p.svg("Graph der Flaechenfunktion A mit dem Maximum bei u gleich 1,73")


def fig_schachtel():
    """Oblique view of the open box with its three measurements."""
    a, h = 2.0, 1.0                              # 1 unit = 10 cm
    # steeper than the default skew on purpose: with (-0.35, -0.45) the near rim would
    # sit above the far bottom edge and the open box would read as a closed one
    sd = S.Solid(w=470, h=320, scale=88, ox=185, oy=150, skew=(-0.42, -0.72))
    A0, B0, C0, D0 = (0, 0, 0), (a, 0, 0), (a, a, 0), (0, a, 0)
    A1, B1, C1, D1 = (0, 0, h), (a, 0, h), (a, a, h), (0, a, h)
    corners = [A0, B0, C0, D0, A1, B1, C1, D1]
    assert min_screen_gap(sd, corners) > 40, min_screen_gap(sd, corners)
    sd.shade([A0, B0, C0, D0], S.ORANGE, 0.34)               # floor, seen through the rim
    # the two bottom edges that run behind the near walls are drawn first and then
    # painted over - that is the whole hidden-line removal this body needs
    sd.edges([(A0, B0), (A0, D0)])
    for face, tint in (([B0, C0, C1, B1], 0.13), ([D0, C0, C1, D1], 0.20)):
        sd.shade(face, S.PAPER, 1.0)                         # opaque: the wall covers
        sd.shade(face, S.GREEN, tint)                        # what lies behind it
    sd.edges([(B0, C0), (C0, D0), (A0, A1), (B0, B1), (C0, C1), (D0, D1)])
    sd.edges([(A1, B1), (B1, C1), (C1, D1), (D1, A1)], width=2.0)      # the open rim
    sd.label3((a, a / 2.0, 0), "a", 0, 22, 14, S.INK, italic=True)
    sd.label3((a / 2.0, 0, h), "a", -21, -8, 14, S.INK, "end", italic=True)
    sd.label3((a, 0, h / 2.0), "h", -14, 5, 14, S.INK, "end", italic=True)
    sd.label3((a / 2.0, a / 2.0, h), "oben offen", 0, 4, 12, S.MUTED)
    return sd.svg("Schraegbild des oben offenen Behaelters mit quadratischer Grundflaeche")


def fig_oberflaeche():
    """The surface as a function of the base edge, with base and walls drawn apart."""
    p = S.Plot((0, 46), (0, 2900), w=520, h=330, pad=(54, 26, 20, 36))
    p.grid(5, 500)
    p.axes(5, 500, xlabel="a", ylabel="O")
    p.curve(lambda a: a ** 2, 6, 45, S.GREEN, 1.6, dash="6 4")
    p.curve(lambda a: 4 * VOL / a, 6, 45, S.MUTED, 1.6, dash="6 4")
    p.curve(O, 6, 45, S.RED, 2.4)
    p.dashto(AOPT, OMIN)
    p.point(AOPT, OMIN, "Minimum", "above-right", color=S.RED)
    p.text(p.X(40.2), p.Y(1380) + 4, "Boden", 12, S.GREEN, "start", halo=S.PAPER)
    p.text(p.X(37), p.Y(215), "Wände", 12, S.MUTED, "middle", halo=S.PAPER)
    p.text(p.X(8.4), p.Y(1500), "Summe", 12, S.RED, "start", halo=S.PAPER)
    p.text(p.X(45), p.Y(2760), "a in cm, O in Quadratzentimetern", 11.5, S.BODY, "end",
           halo=S.PAPER)
    return p.svg("Graph der Oberflaechenfunktion mit dem Minimum bei a gleich 20")


def fig_kabel():
    """The scene: shore, lake, the two cable sections and the free point S."""
    p = S.Plot((-12, 120), (-30, 58), w=560, h=330, pad=(16, 16, 14, 16))
    wrect(p, -12, 120, 0, 58, fill="#DCE4F0", opacity=0.85)          # lake
    wrect(p, -12, 120, -30, 0, fill=S.GREEN, opacity=0.10)           # shore side
    p.seg((-12, 0), (120, 0), S.INK, 2.0)
    p.text(p.X(112), p.Y(46), "See", 13, S.MUTED, "end")
    p.text(p.X(112), p.Y(-26), "Ufer", 13, S.MUTED, "end")
    p.seg((0, 0), (70, 0), S.GREEN, 5.0)
    p.seg((70, 0), (100, 40), S.RED, 3.6)
    p.seg((100, 0), (100, 40), S.MUTED, 1.2, dash="4 3")
    p.point(0, 0, "V", "below-left", color=S.INK)
    p.point(70, 0, "S", "below", color=S.INK)
    p.point(100, 0, "F", "below-right", color=S.MUTED, size=3.0)
    p.point(100, 40, "P", "above-right", color=S.RED)
    p.brace(70, 100, -9, "x", S.INK)
    p.brace(0, 100, -22, "100 m", S.MUTED)
    p.text(p.X(103), p.Y(20) + 5, "40 m", 12, S.MUTED, "start", halo="#DCE4F0")
    p.text(p.X(35), p.Y(4.5), "Landkabel, 30 Euro je Meter", 12, S.GREEN, "middle",
           halo="#DCE4F0")
    p.text(p.X(80), p.Y(34), "Seekabel,", 12, S.RED, "end", halo="#DCE4F0")
    p.text(p.X(80), p.Y(27), "50 Euro je Meter", 12, S.RED, "end", halo="#DCE4F0")
    return p.svg("Lageskizze mit Verteilerkasten V, Uebergangspunkt S, Fusspunkt F und "
                 "Plattform P")


def fig_kosten():
    """Both cost shares and their sum - the minimum of the sum is not where they meet."""
    p = S.Plot((-7, 112), (-500, 6300), w=540, h=350, pad=(58, 26, 20, 36))
    p.grid(10, 500)
    p.axes(20, 1000, xlabel="x", ylabel="Kosten")
    p.curve(k_land, 0, 100, S.GREEN, 2.1)
    p.curve(k_see, 0, 100, S.MUTED, 2.1)
    p.curve(K, 0, 100, S.RED, 2.6)
    p.line(p.X(XOPT), p.Y(-500), p.X(XOPT), p.Y(KMIN), S.INK, 1.1, dash="4 3")
    p.point(XOPT, k_land(XOPT), None, color=S.GREEN, size=3.4)
    p.point(XOPT, k_see(XOPT), None, color=S.MUTED, size=3.4)
    p.point(XOPT, KMIN, "Minimum", "above", color=S.RED)
    p.text(p.X(68), p.Y(1400), "Landkabel", 12, S.GREEN, "middle", halo=S.PAPER)
    p.text(p.X(72), p.Y(3300), "Seekabel", 12, S.MUTED, "start", halo=S.PAPER)
    p.text(p.X(62), p.Y(5300), "Gesamtkosten", 12, S.RED, "start", halo=S.PAPER)
    p.text(p.X(XOPT) - 10, p.Y(k_see(XOPT)) - 8, "2500", 11.5, S.BODY, "end",
           halo=S.PAPER)
    p.text(p.X(XOPT) - 10, p.Y(k_land(XOPT)) + 20, "2100", 11.5, S.BODY, "end",
           halo=S.PAPER)
    p.text(p.X(6), p.Y(5850) + 4, "x in Metern, Kosten in Euro", 11.5, S.BODY, "start",
           halo=S.PAPER)
    return p.svg("Land- und Seekabelkosten und ihre Summe, mit dem Minimum bei x gleich 30")


# ------------------------------------------------------------------- sheet ---
s = Sheet("abitur-bgy-extremwert", "Extremwertaufgaben — Optimieren mit Nebenbedingung",
          kind="Abitur-Training",
          suffix="",
          klasse="Berufliches Gymnasium",
          sub="Berufliches Gymnasium · Pflichtaufgabe 1 · Grund- und Leistungskurs · "
              "drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Abitur-Training Mathematik BGY, Extremwertaufgaben: Rechteck unter einer "
               "Parabel, Behälter mit kleinster Oberfläche und eine Kostenoptimierung im "
               "Sachkontext, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/abitur.html", "Zur Übersicht"))

s.task(
    "Das größte Rechteck unter der Parabel", 1,
    r"Gegeben ist die in $\mathbb{R}$ definierte Funktion $f$ mit $f(x) = 9 - x^2$. "
    r"Unter dem Graphen von $f$ liegt ein achsenparalleles Rechteck: Eine Seite liegt auf "
    r"der $x$-Achse, die beiden oberen Ecken liegen auf dem Graphen. Wegen der Symmetrie "
    r"hat es die Ecken $(-u \mid 0)$, $(u \mid 0)$, $(u \mid f(u))$ und $(-u \mid f(u))$. "
    r"Gesucht ist das Rechteck mit dem größten Flächeninhalt.",
    [
        r"Berechnen Sie die Nullstellen von $f$ und begründen Sie, dass für $u$ nur Werte "
        r"mit $0 < u < 3$ in Frage kommen.",
        r"Zeigen Sie, dass für den Flächeninhalt $A(u) = 18 \cdot u - 2 \cdot u^3$ gilt.",
        r"Bestimmen Sie die Stelle $u$, an der $A$ den größten Wert annimmt, und weisen "
        r"Sie nach, dass dort tatsächlich ein Maximum vorliegt.",
        r"Geben Sie Breite, Höhe und Flächeninhalt des größten Rechtecks an und "
        r"vergleichen Sie mit dem gestrichelten Rechteck der Abbildung, für das "
        r"$u = 2{,}5$ gilt.",
    ],
    [
        r"Aus $9 - x^2 = 0$ folgt $x^2 = 9$, also $x_1 = -3$ und $x_2 = 3$. Nur zwischen "
        r"diesen beiden Stellen verläuft der Graph oberhalb der $x$-Achse. Für $u = 0$ "
        r"fällt das Rechteck zu einer Strecke zusammen, für $u \geq 3$ ist "
        r"$f(u) \leq 0$ und es entsteht kein Rechteck über der Achse. Sinnvoll ist also "
        r"**$0 < u < 3$**.",
        r"Die obere rechte Ecke ist $(u \mid f(u))$, die obere linke $(-u \mid f(u))$. Das "
        r"Rechteck ist damit $2 \cdot u$ breit und $f(u) = 9 - u^2$ hoch. Für den "
        r"Flächeninhalt folgt "
        r"$A(u) = 2 \cdot u \cdot \left(9 - u^2\right) = 18 \cdot u - 2 \cdot u^3$.",
        r"$A'(u) = 18 - 6 \cdot u^2 = 0$ liefert $u^2 = 3$, also "
        r"$u = \sqrt{3} \approx 1{,}73$; die zweite Lösung $-\sqrt{3}$ liegt nicht im "
        r"Definitionsbereich. Mit $A''(u) = -12 \cdot u$ ist "
        r"$A''\left(\sqrt{3}\right) = -12 \cdot \sqrt{3} < 0$, dort liegt also ein "
        r"**Maximum**. Wegen $A(0) = 0$ und $A(3) = 0$ ist es zugleich das absolute "
        r"Maximum im Intervall.",
        r"Breite $2 \cdot \sqrt{3} \approx 3{,}46$, Höhe "
        r"$f\left(\sqrt{3}\right) = 9 - 3 = 6$ und damit "
        r"$A\left(\sqrt{3}\right) = 12 \cdot \sqrt{3} \approx 20{,}78$. Das gestrichelte "
        r"Rechteck ist mit der Breite $5$ zwar deutlich breiter, aber nur "
        r"$9 - 6{,}25 = 2{,}75$ hoch; sein Flächeninhalt beträgt "
        r"$5 \cdot 2{,}75 = 13{,}75$ — rund ein Drittel weniger. Mehr Breite bringt hier "
        r"also nicht mehr Fläche.",
    ],
    falle=r"Gesucht ist das Maximum von $A$, nicht das von $f$. Wer $f'(x) = 0$ setzt, "
          r"findet den Scheitel $(0 \mid 9)$ — die höchste Stelle der Kurve. Das "
          r"zugehörige Rechteck hätte die Breite null und den Flächeninhalt null.",
    figs=[(fig_rechteck(),
           "Das größte Rechteck (orange) mit u = 1,73 und der Höhe 6. Gestrichelt ein "
           "breiteres, aber flacheres Rechteck mit deutlich kleinerem Flächeninhalt.")],
    solfigs=[(fig_flaeche(),
              "Zu c): Der Flächeninhalt in Abhängigkeit von u. Das Maximum liegt bei "
              "u = 1,73 mit A = 20,78; das Vergleichsrechteck (grauer Punkt) kommt nur "
              "auf 13,75.")],
)

s.task(
    "Der Behälter mit dem geringsten Materialverbrauch", 2,
    r"Ein oben offener Behälter mit quadratischer Grundfläche soll genau $4$ Liter, also "
    r"$4000$ Kubikzentimeter, fassen. Die Grundkante misst $a$ Zentimeter, die Höhe $h$ "
    r"Zentimeter. Für die Herstellung soll möglichst wenig Blech verbraucht werden, die "
    r"Oberfläche des Behälters also möglichst klein sein. Die Dicke des Blechs bleibt "
    r"unberücksichtigt.",
    [
        r"Stellen Sie die Nebenbedingung auf und zeigen Sie, dass für die Oberfläche "
        r"$O(a) = a^2 + \dfrac{16000}{a}$ mit $a > 0$ gilt.",
        r"Berechnen Sie die Maße des Behälters mit der kleinsten Oberfläche und weisen "
        r"Sie nach, dass dort ein Minimum vorliegt.",
        r"Begründen Sie, dass es sich um das absolute Minimum handelt, und vergleichen "
        r"Sie mit einem würfelähnlichen Behälter, bei dem $a = h$ gilt.",
        r"Zeigen Sie, dass die Höhe im Optimum stets halb so groß ist wie die Grundkante "
        r"— unabhängig vom vorgegebenen Volumen $V$.",
    ],
    [
        r"Nebenbedingung ist das vorgegebene Volumen: $V = a^2 \cdot h = 4000$, also "
        r"$h = \dfrac{4000}{a^2}$. Weil der Behälter oben offen ist, besteht die "
        r"Oberfläche aus dem Boden und vier Seitenwänden: $O = a^2 + 4 \cdot a \cdot h$. "
        r"Einsetzen der Nebenbedingung liefert "
        r"$O(a) = a^2 + 4 \cdot a \cdot \dfrac{4000}{a^2} = a^2 + \dfrac{16000}{a}$. "
        r"Weil $a$ eine Länge ist und im Nenner steht, gilt $a > 0$.",
        r"$O'(a) = 2 \cdot a - \dfrac{16000}{a^2} = 0$ führt auf "
        r"$2 \cdot a^3 = 16000$, also $a^3 = 8000$ und $a = 20$. Mit "
        r"$O''(a) = 2 + \dfrac{32000}{a^3}$ ist $O''(20) = 2 + 4 = 6 > 0$, dort liegt "
        r"also ein **Minimum**. Aus der Nebenbedingung folgt "
        r"$h = \dfrac{4000}{400} = 10$. Der günstigste Behälter misst also "
        r"**$20$ cm mal $20$ cm in der Grundfläche bei $10$ cm Höhe**; seine Oberfläche "
        r"beträgt $O(20) = 400 + 800 = 1200$, also $1200$ Quadratzentimeter.",
        r"Der Definitionsbereich $a > 0$ ist offen, ein Randminimum kann es daher nicht "
        r"geben: Für $a \to 0$ wächst $\dfrac{16000}{a}$ über alle Grenzen, für "
        r"$a \to \infty$ wächst $a^2$ über alle Grenzen. Da $O$ dort stetig ist und mit "
        r"$a = 20$ genau eine Stelle mit waagerechter Tangente besitzt, ist "
        r"$O(20) = 1200$ das **absolute Minimum**. Zum Vergleich: Aus $a = h$ folgt "
        r"$a^3 = 4000$, also $a \approx 15{,}87$ und "
        r"$O = a^2 + 4 \cdot a^2 = 5 \cdot a^2 \approx 1260$ — der würfelähnliche "
        r"Behälter braucht rund $5\,\%$ mehr Blech.",
        r"Allgemein ist $h = \dfrac{V}{a^2}$ und damit "
        r"$O(a) = a^2 + \dfrac{4 \cdot V}{a}$. Aus "
        r"$O'(a) = 2 \cdot a - \dfrac{4 \cdot V}{a^2} = 0$ folgt $2 \cdot a^3 = 4 \cdot V$, "
        r"also $a^3 = 2 \cdot V$ beziehungsweise $V = \dfrac{a^3}{2}$. Eingesetzt: "
        r"$h = \dfrac{V}{a^2} = \dfrac{a^3}{2 \cdot a^2} = \dfrac{a}{2}$. Im Optimum ist "
        r"die **Höhe also immer halb so groß wie die Grundkante**, gleichgültig wie groß "
        r"$V$ ist. Nebenbei folgt daraus $4 \cdot a \cdot h = 2 \cdot a^2$: Die vier "
        r"Wände brauchen zusammen stets doppelt so viel Blech wie der Boden.",
    ],
    falle=r"Die Nebenbedingung muss **vor** dem Ableiten eingesetzt werden. Wer "
          r"$O = a^2 + 4 \cdot a \cdot h$ nach $a$ ableitet und $h$ dabei wie eine "
          r"Konstante behandelt, erhält $2 \cdot a + 4 \cdot h = 0$ und damit die "
          r"negative Kantenlänge $a = -2 \cdot h$. Die Höhe hängt eben von $a$ ab.",
    figs=[(fig_schachtel(),
           "Der oben offene Behälter mit quadratischer Grundfläche: Grundkante a, "
           "Höhe h. Es sind fünf Flächen zu berechnen, nicht sechs.")],
    solfigs=[(fig_oberflaeche(),
              "Zu b): Die Oberfläche in Abhängigkeit von a. Der Boden (grün gestrichelt) "
              "wächst, die Wände (grau gestrichelt) fallen; die Summe hat bei a = 20 cm "
              "ihr Minimum von 1200 Quadratzentimetern.")],
)

s.task(
    "Das Kabel zur Messplattform", 3,
    r"Von einem Verteilerkasten $V$ am geraden Ufer eines Sees soll die Messplattform $P$ "
    r"mit Strom versorgt werden. $P$ liegt $40$ m vom Ufer entfernt; ihr Fußpunkt $F$ am "
    r"Ufer ist $100$ m von $V$ entfernt. Das Kabel wird vom Verteilerkasten am Ufer "
    r"entlang bis zu einem Punkt $S$ und von dort geradlinig durch den See zu $P$ "
    r"verlegt. Ein Meter Landkabel kostet $30$ €, ein Meter Seekabel $50$ €. Mit $x$ wird "
    r"der Abstand zwischen $S$ und $F$ in Metern bezeichnet.",
    [
        r"Zeigen Sie, dass die Gesamtkosten durch "
        r"$K(x) = 3000 - 30 \cdot x + 50 \cdot \sqrt{x^2 + 1600}$ beschrieben werden, und "
        r"geben Sie den sinnvollen Definitionsbereich an.",
        r"Bestimmen Sie die kostengünstigste Lage von $S$ und die zugehörigen Kosten. "
        r"Weisen Sie nach, dass es sich um das absolute Minimum handelt.",
        r"Berechnen Sie die Mehrkosten der beiden naheliegenden Varianten: Kabel am Ufer "
        r"bis $F$ und dann senkrecht hinaus, sowie Kabel auf kürzestem Weg direkt von $V$ "
        r"nach $P$.",
        r"Beurteilen Sie die Aussage: „Beim kostengünstigsten Verlauf sind die Kosten für "
        r"das Landkabel und die Kosten für das Seekabel gleich groß.“",
    ],
    [
        r"Das Landkabel reicht von $V$ bis $S$, ist also $100 - x$ Meter lang und kostet "
        r"$30 \cdot (100 - x) = 3000 - 30 \cdot x$ Euro. Das Seekabel verläuft von $S$ "
        r"nach $P$; das Dreieck $SFP$ ist bei $F$ rechtwinklig, nach dem Satz des "
        r"Pythagoras ist das Seekabel also $\sqrt{x^2 + 40^2} = \sqrt{x^2 + 1600}$ Meter "
        r"lang und kostet $50 \cdot \sqrt{x^2 + 1600}$ Euro. Die Summe ergibt "
        r"$K(x) = 3000 - 30 \cdot x + 50 \cdot \sqrt{x^2 + 1600}$. Der Punkt $S$ liegt "
        r"zwischen $V$ und $F$, sinnvoll ist also $0 \leq x \leq 100$.",
        r"Mit der Kettenregel ist "
        r"$K'(x) = -30 + \dfrac{50 \cdot x}{\sqrt{x^2 + 1600}}$. Aus $K'(x) = 0$ folgt "
        r"$50 \cdot x = 30 \cdot \sqrt{x^2 + 1600}$, also nach Kürzen "
        r"$5 \cdot x = 3 \cdot \sqrt{x^2 + 1600}$ und quadriert "
        r"$25 \cdot x^2 = 9 \cdot x^2 + 14400$. Damit ist $16 \cdot x^2 = 14400$, "
        r"$x^2 = 900$ und $x = 30$; die negative Lösung entfällt. Wegen "
        r"$\sqrt{900 + 1600} = 50$ ist "
        r"$K(30) = 30 \cdot 70 + 50 \cdot 50 = 2100 + 2500 = 4600$. Nachweis: "
        r"$K''(x) = 80000 \cdot \left(x^2 + 1600\right)^{-\frac{3}{2}} > 0$ für alle $x$, "
        r"der Graph von $K$ ist also überall linksgekrümmt und die einzige Stelle mit "
        r"$K'(x) = 0$ ist das absolute Minimum. Die Randwerte bestätigen das: "
        r"$K(0) = 5000$ und $K(100) \approx 5385{,}16$. Das Kabel wird also **$70$ m am "
        r"Ufer entlang** geführt und dann $50$ m durch den See; die Kosten betragen "
        r"**$4600$ €**.",
        r"Variante „bis $F$ und dann senkrecht hinaus“ bedeutet $x = 0$: "
        r"$K(0) = 3000 + 50 \cdot 40 = 5000$ Euro, also **$400$ € mehr**. Variante "
        r"„kürzester Weg“ bedeutet $x = 100$, das Kabel liegt dann vollständig im See: "
        r"$K(100) = 50 \cdot \sqrt{10000 + 1600} = 50 \cdot \sqrt{11600} \approx 5385{,}16$ "
        r"Euro, also rund **$785$ € mehr**. Der kürzeste Weg ist hier der teuerste — "
        r"entscheidend ist nicht die Länge, sondern der Preis je Meter.",
        r"Die Aussage ist **falsch**. Im Optimum kostet das Landkabel "
        r"$30 \cdot 70 = 2100$ € und das Seekabel $50 \cdot 50 = 2500$ €; die beiden "
        r"Anteile unterscheiden sich um $400$ €. Gleich groß werden sie erst, wenn "
        r"$3000 - 30 \cdot x = 50 \cdot \sqrt{x^2 + 1600}$ gilt, also bei "
        r"$x \approx 23{,}05$ — dort betragen die Gesamtkosten rund $4616{,}80$ € und "
        r"damit knapp $17$ € **mehr** als im Optimum. Was im Optimum übereinstimmt, sind "
        r"nicht die Kosten, sondern ihre Änderungsraten: Aus $K'(30) = 0$ folgt, dass ein "
        r"weiterer Meter am Ufer genau $30$ € spart und derselbe Meter im See genau "
        r"$30$ € zusätzlich kostet. Solange die Ersparnis größer ist als der Zuwachs, "
        r"lohnt sich das Verschieben von $S$; im Gleichgewicht stehen also die "
        r"**Grenzkosten**, nicht die Beträge.",
    ],
    falle=r"Die Wurzel wird mit der Kettenregel abgeleitet und nicht gliedweise "
          r"vereinfacht: $\sqrt{x^2 + 1600}$ ist **nicht** $x + 40$. Wer so rechnet, "
          r"erhält die lineare Funktion $5000 + 20 \cdot x$ ohne inneres Minimum und "
          r"landet zwangsläufig am Rand.",
    figs=[(fig_kabel(),
           "Lageskizze: Vom Verteilerkasten V läuft das Kabel am Ufer bis S und von dort "
           "durch den See zur Plattform P. Gesucht ist die Lage von S.")],
    solfigs=[(fig_kosten(),
              "Zu d): Die beiden Anteile laufen gegeneinander. Ihre Summe wird bei "
              "x = 30 m am kleinsten — dort kostet das Landkabel 2100 Euro und das "
              "Seekabel 2500 Euro, die Anteile sind also gerade nicht gleich groß.")],
)


# ------------------------------------------------------------------ verify ---
def worse_around(fn, x, better, span=8.0, steps=40):
    """A candidate is only an optimum if the function really is worse on both sides -
    checked numerically, not just by setting the derivative to zero."""
    for i in range(1, steps + 1):
        d = span * i / float(steps)
        for y in (x - d, x + d):
            assert better(fn(x), fn(y)), (x, y, fn(x), fn(y))


def check():
    """Every number in the solutions, recomputed."""
    # ---- Aufgabe 1: rectangle under f(x) = 9 - x^2
    assert f(-3) == 0 and f(3) == 0
    assert abs(A(1.234) - (18 * 1.234 - 2 * 1.234 ** 3)) < 1e-12       # A(u) = 18u - 2u^3
    assert abs(U ** 2 - 3) < 1e-12 and abs(U - 1.7321) < 1e-4
    assert abs(dA(U)) < 1e-12 and ddA(U) < 0
    assert abs(ddA(U) + 12 * sqrt(3)) < 1e-12
    assert HOCH == 6 and abs(2 * U - 3.4641) < 1e-4
    assert abs(AMAX - 12 * sqrt(3)) < 1e-12 and abs(AMAX - 20.7846) < 1e-4
    assert A(0) == 0 and abs(A(3)) < 1e-12
    worse_around(A, U, lambda a, b: a > b, span=1.7)                    # really a maximum
    assert all(A(t / 100.0) < AMAX for t in range(1, 300) if abs(t / 100.0 - U) > 1e-9)
    assert f(UVGL) == 2.75 and AVGL == 13.75 and 2 * UVGL == 5
    assert abs(AVGL / AMAX - 0.6616) < 0.001                           # rund ein Drittel weniger

    # ---- Aufgabe 2: open box, V = 4000 cm^3
    assert VOL == 4000 and 4 * VOL == 16000
    for a in (7.0, 13.5, 20.0, 31.0):                                  # O with h substituted
        assert abs(O(a) - (a ** 2 + 4 * a * hoehe(a))) < 1e-9
    assert AOPT ** 3 == 8000 and abs(2 * AOPT ** 3 - 16000) < 1e-9
    assert abs(dO(AOPT)) < 1e-12 and ddO(AOPT) > 0
    assert abs(ddO(AOPT) - 6) < 1e-12 and abs(8 * VOL / AOPT ** 3 - 4) < 1e-12
    assert HOPT == 10 and OMIN == 1200 and AOPT ** 2 == 400 and 4 * AOPT * HOPT == 800
    worse_around(O, AOPT, lambda a, b: a < b, span=14.0)                # really a minimum
    assert all(O(t / 10.0) > OMIN for t in range(5, 800) if abs(t / 10.0 - AOPT) > 1e-9)
    assert O(0.01) > 1e6 and O(1e6) > 1e6                               # Randverhalten
    wa = VOL ** (1.0 / 3.0)                                             # Wuerfel: a = h
    assert abs(wa - 15.874) < 0.001 and abs(hoehe(wa) - wa) < 1e-9
    assert abs(O(wa) - 5 * wa ** 2) < 1e-9 and abs(O(wa) - 1259.92) < 0.01
    assert abs(O(wa) / OMIN - 1.05) < 0.001                             # rund 5 % mehr
    for v in (500.0, 4000.0, 91125.0):                                  # h = a/2 fuer jedes V
        a = (2 * v) ** (1.0 / 3.0)
        assert abs(2 * a - 4 * v / a ** 2) < 1e-6                       # O'(a) = 0
        assert abs(v / a ** 2 - a / 2.0) < 1e-9
        assert abs(4 * a * (v / a ** 2) - 2 * a ** 2) < 1e-6            # Waende = 2 mal Boden
    for h in (1.0, 7.5, 40.0):                    # die Falle: 2a + 4h = 0 gibt a = -2h < 0
        a = -2.0 * h
        assert abs(2 * a + 4 * h) < 1e-12 and a < 0

    # ---- Aufgabe 3: cable to the platform
    assert k_land(0) == 3000 and abs(K(0) - 5000) < 1e-12
    assert abs(K(45.0) - (3000 - 30 * 45 + 50 * sqrt(45 ** 2 + 1600))) < 1e-12
    assert 25 * XOPT ** 2 == 9 * XOPT ** 2 + 14400 and 16 * XOPT ** 2 == 14400
    assert sqrt(XOPT ** 2 + 1600) == 50 and UFER - XOPT == 70
    assert abs(dK(XOPT)) < 1e-12 and ddK(XOPT) > 0
    assert abs(ddK(XOPT) - 0.64) < 1e-12                                # 80000 / 125000
    assert k_land(XOPT) == 2100 and k_see(XOPT) == 2500 and KMIN == 4600
    assert k_see(XOPT) - k_land(XOPT) == 400
    worse_around(K, XOPT, lambda a, b: a < b, span=29.0)                 # really a minimum
    assert all(K(t / 10.0) > KMIN for t in range(0, 1001) if abs(t / 10.0 - XOPT) > 1e-9)
    assert all(ddK(t) > 0 for t in range(0, 101))                        # ueberall linksgekruemmt
    assert abs(K(0) - KMIN - 400) < 1e-12
    assert abs(sqrt(11600) - 107.7033) < 1e-4
    assert abs(K(100) - 50 * sqrt(11600)) < 1e-12 and abs(K(100) - 5385.16) < 0.01
    assert abs(K(100) - KMIN - 785.16) < 0.01                            # rund 785 Euro mehr
    assert abs(XGLEICH - 23.05) < 0.01                                   # gleiche Anteile
    assert abs(k_land(XGLEICH) - k_see(XGLEICH)) < 1e-9
    assert abs(KGLEICH - 4616.78) < 0.02 and abs(KGLEICH - KMIN - 16.78) < 0.02
    assert KGLEICH > KMIN
    assert abs(-30 + 50 * XOPT / sqrt(XOPT ** 2 + 1600)) < 1e-12         # Grenzkosten gleich
    assert abs(3000 - 30 * 5 + 50 * (5 + 40) - (5000 + 20 * 5)) < 1e-12  # die Wurzel-Falle


s.verify(check)
s.save()
