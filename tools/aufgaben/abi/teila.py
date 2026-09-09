#!/usr/bin/env python3
"""Abitur-Training BGY - Teil A, ohne Hilfsmittel.

    python3 tools/aufgaben/abi/teila.py

Teil A of the Sachsen BGY exam: 85 to 95 minutes, no calculator and no formula book,
only ruler and set square. Every item has to fall out in the head or in three lines.
Task types follow the originals 2022-2025 (Ankreuzaufgaben, seit 2024/25 mit fuenf
kleinen Graphen zur Auswahl); wording, numbers and every figure are our own.
"""
import os
import sys
from fractions import Fraction as Fr
from math import exp

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# ------------------------------------------------------- Aufgabe 1: Funktionen --
def d_a(x):
    """Correct derivative of x * e^(-2x)."""
    return exp(-2 * x) * (1 - 2 * x)


# the five wrong options of part a), in the order they are printed
OPT_A = {
    "A": lambda x: -2 * exp(-2 * x),
    "B": d_a,
    "C": lambda x: exp(-2 * x) * (1 + 2 * x),
    "D": lambda x: -2 * x * exp(-2 * x),
    "E": lambda x: exp(-2 * x) * (x - 2),
}


def h_b(x):
    """Integrand of part b) - odd, therefore the integral over [-2, 2] vanishes."""
    return x ** 3 - 4 * x


def H_b(x):
    """Antiderivative of h_b, exact for Fraction input."""
    return x ** 4 / 4 - 2 * x ** 2


# the five candidate graphs of part c); g5 belongs to the given term
def g1(x):
    return (x + 1) * (x - 2)                       # Parabel, falscher Grad


def g2(x):
    return (x + 1) ** 2 * (x - 2) ** 2             # Grad 4, nie negativ


def g3(x):
    return -(x + 1) ** 2 * (x - 2)                 # an der x-Achse gespiegelt


def g4(x):
    return (x + 1) * (x - 2) ** 2                  # Beruehrpunkt an der falschen Stelle


def g5(x):
    return (x + 1) ** 2 * (x - 2)                  # richtig


def f_d(x):
    """Part d): the root function whose domain and range are asked for."""
    return 4 - (2 * x - 6) ** 0.5


# -------------------------------------------------------- Aufgabe 2: Rechnen ---
def para_f(x):
    return x * x


def para_g(x):
    return 2 * x - x * x


# The pyramid of task 2. Coordinates only serve the figure and the check - the sheet
# itself works with the edge vectors a, b and c.
PA, PB, PC, PD = (0, 0, 0), (4, 0, 0), (4, 4, 0), (0, 4, 0)
PS, PM = (2, 2, 6), (2, 2, 0)
EBENE = (2, -1, 2, 6)                              # 2x1 - x2 + 2x3 = 6


# ------------------------------------------------------ Aufgabe 3: Schluessel --
NK, KP = 5, 2                                      # fuenf Schluessel, zwei passen


def p_versuche(k):
    """P(X = k) for drawing without replacement until the first hit, exact."""
    p = Fr(1)
    for i in range(k - 1):                         # i-th draw is a miss
        p *= Fr(NK - KP - i, NK - i)
    return p * Fr(KP, NK - (k - 1))


PROBS = {k: p_versuche(k) for k in range(1, NK - KP + 2)}
EX = sum(k * p for k, p in PROBS.items())


# ----------------------------------------------------------------- figures ---
def _mini(cv, ox, oy, w, h, fn, idx, xr=(-2.2, 2.7), yr=(-6.0, 6.0)):
    """One small coordinate system inside a shared canvas.

    svgfig has no multi-panel Plot, so the five pictures are built here from the
    primitives: frame, axes through the world origin, integer ticks, clipped curve.
    """
    x0, x1 = xr
    y0, y1 = yr
    sx, sy = w / float(x1 - x0), h / float(y1 - y0)
    X = lambda u: ox + (u - x0) * sx
    Y = lambda v: oy + h - (v - y0) * sy
    cv.rect(ox, oy, w, h, fill=S.PAPER, stroke="#C9D4E6", width=1, rx=3)
    cv.line(ox + 2, Y(0), ox + w - 2, Y(0), S.MUTED, 1.1, cap="butt")
    cv.line(X(0), oy + 2, X(0), oy + h - 2, S.MUTED, 1.1, cap="butt")
    for u in (-2, -1, 1, 2):                       # ticks, only the useful ones labelled
        cv.line(X(u), Y(0) - 3, X(u), Y(0) + 3, S.MUTED, 1)
    for v in (-4, -2, 2, 4):
        cv.line(X(0) - 3, Y(v), X(0) + 3, Y(v), S.MUTED, 1)
    # the curve, clipped to this panel - a steep branch leaves through the frame
    cid = "%s-m%d" % (cv.uid, idx)
    cv.defs.append('<clipPath id="%s"><rect x="%s" y="%s" width="%s" height="%s"/></clipPath>'
                   % (cid, S.fmt(ox + 1), S.fmt(oy + 1), S.fmt(w - 2), S.fmt(h - 2)))
    pts = []
    for i in range(241):
        u = x0 + (x1 - x0) * i / 240.0
        v = fn(u)
        if y0 - 4 * (y1 - y0) < v < y1 + 4 * (y1 - y0):
            pts.append((X(u), Y(v)))
    cv.raw('<g clip-path="url(#%s)">' % cid)
    cv.poly(pts, stroke=S.RED, width=2.0, fill="none", close=False)
    cv.raw("</g>")
    # the tick labels go on top of the curve - a steep branch crosses the axis right
    # where they sit, and only their halo keeps the minus sign readable
    for u in (-1, 1, 2):
        cv.text(X(u), Y(0) + 14, S.num(u), 9.5, S.MUTED, halo=S.PAPER)
    cv.text(ox + w / 2.0, oy + h + 19, "Bild %d" % idx, 12.5, S.INK, weight="700")


def fig_bilder():
    pw, ph, gap, left, top = 106, 150, 10, 6, 6
    cv = S.Canvas(2 * left + 5 * pw + 4 * gap, top + ph + 30)
    for i, fn in enumerate((g1, g2, g3, g4, g5), start=1):
        _mini(cv, left + (i - 1) * (pw + gap), top, pw, ph, fn, i)
    return cv.svg("Fuenf kleine Koordinatensysteme mit je einem Funktionsgraphen, "
                  "beschriftet mit Bild 1 bis Bild 5")


def fig_pyramide():
    sd = S.Solid(w=500, h=344, scale=34, ox=180, oy=240)
    sd.shade([PA, PB, PC, PD], S.GREEN, 0.14)
    sd.shade([PA, PB, PS], S.ORANGE, 0.26)
    sd.shade([PB, PC, PS], S.RED, 0.12)
    sd.edges([(PA, PB), (PB, PC), (PA, PS), (PB, PS), (PC, PS)])
    sd.edges([(PA, PD), (PD, PC), (PD, PS)], color=S.MUTED, dash="5 4")
    sd.edges([(PA, PC), (PB, PD)], color=S.MUTED, width=1.0, dash="2 4")
    sd.edge(PM, PS, S.MUTED, 1.0, dash="2 4")
    sd.arrow3(PA, PB, S.GREEN, 2.0)
    sd.arrow3(PA, PD, S.GREEN, 2.0)
    sd.arrow3(PA, PS, S.GREEN, 2.0)
    for p, lab, pos in ((PA, "A", "above-left"), (PB, "B", "below-left"),
                        (PC, "C", "below-right"), (PD, "D", "right"),
                        (PS, "S", "above")):
        sd.vertex(p, lab, pos)
    sd.vertex(PM, "M", "right", color=S.MUTED, size=2.6)
    sd.label3((2, 0, 0), "a", 9, 19, 14, S.GREEN, italic=True)
    sd.label3((0, 2, 0), "b", 0, -9, 14, S.GREEN, italic=True)
    sd.label3((1, 1, 3), "c", 15, 2, 14, S.GREEN, italic=True)
    return sd.svg("Schraegbild der quadratischen Pyramide ABCDS mit den Kantenvektoren "
                  "a, b und c und dem Mittelpunkt M der Grundflaeche")


def fig_parabeln():
    p = S.Plot((-0.35, 1.78), (-0.32, 1.78), w=430, h=330, pad=(44, 22, 18, 34))
    p.grid(0.5, 0.5)
    # origin=None: the label O would sit right under the intersection point (0|0)
    p.axes(0.5, 0.5, xlabel="x", ylabel="y", xdec=1, ydec=1, origin=None)
    p.area_between(para_g, para_f, 0, 1, S.ORANGE, 0.40)
    p.curve(para_f, -0.32, 1.31, S.RED, 2.1)
    p.curve(para_g, -0.16, 1.60, S.GREEN, 2.1)
    p.point(0, 0, None, color=S.INK, size=3.4)
    p.point(1, 1, None, color=S.INK, size=3.4)
    p.text(p.X(1.31) + 7, p.Y(1.68), "f", 14, S.RED, "start", italic=True, halo=S.PAPER)
    p.text(p.X(1.60) + 7, p.Y(0.70), "g", 14, S.GREEN, "start", italic=True, halo=S.PAPER)
    p.text(p.X(0.5), p.Y(0.44), "A", 15, S.INK, italic=True, halo=S.PAPER)
    return p.svg("Die Graphen der beiden Parabeln und die von ihnen eingeschlossene "
                 "Flaeche im ersten Quadranten")


def fig_baum():
    d = S.Diagram(612, 302)
    root = (46, 60)
    up = {1: (166, 26), 2: (286, 84), 3: (406, 142), 4: (506, 200)}
    down = {1: (166, 118), 2: (286, 176), 3: (406, 234)}
    d.node(root[0], root[1], None, color=S.MUTED)
    d.branch(root, up[1], "2/5")
    d.branch(root, down[1], "3/5")
    d.branch(down[1], up[2], "2/4")
    d.branch(down[1], down[2], "2/4")
    d.branch(down[2], up[3], "2/3")
    d.branch(down[2], down[3], "1/3")
    d.branch(down[3], up[4], "1")
    for k in (1, 2, 3):
        d.node(down[k][0], down[k][1], None, color=S.MUTED)
    for k, txt in ((1, "0,4"), (2, "0,3"), (3, "0,2"), (4, "0,1")):
        x, y = up[k]
        d.node(x, y, None, color=S.GREEN)
        # two lines - SVG collapses runs of spaces, so "X = 1   0,4" would read as one word
        d.text(x + 11, y + 1, "X = %d" % k, 12.5, S.INK, "start", halo=S.PAPER)
        d.text(x + 11, y + 16, "P = " + txt, 11.5, S.MUTED, "start", halo=S.PAPER)
    d.text(306, 292, "nach oben: der Schlüssel passt   ·   nach unten: er passt nicht",
           11.5, S.MUTED)
    return d.svg("Baumdiagramm zum Probieren ohne Zuruecklegen mit den vier moeglichen "
                 "Pfaden und ihren Wahrscheinlichkeiten")


def fig_verteilung():
    p = S.Plot((-0.5, 4.9), (0, 0.47), w=440, h=268, pad=(48, 20, 20, 36))
    p.axes(1, 0.1, xlabel="k", ylabel="P(X = k)", ydec=1)
    p.bars([float(PROBS[k]) for k in (1, 2, 3, 4)], 1, S.ORANGE, width=0.52)
    p.line(p.X(float(EX)), p.Y(0), p.X(float(EX)), p.Y(0.43), S.RED, 1.3, dash="4 3")
    p.text(p.X(float(EX)) + 9, p.Y(0.43) + 4, "Erwartungswert 2", 11.5, S.RED, "start",
           halo=S.PAPER)
    return p.svg("Stabdiagramm der Verteilung von X mit der eingezeichneten Lage des "
                 "Erwartungswertes")


# ------------------------------------------------------------------- sheet ---
s = Sheet("abitur-bgy-teila", "Teil A — ohne Hilfsmittel",
          kind="Abitur-Training",
          suffix="",
          klasse="Berufliches Gymnasium",
          sub="Berufliches Gymnasium · Teil A · Grund- und Leistungskurs · "
              "85 bis 95 Minuten, nur Lineal und Geodreieck · "
              "drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Abitur-Training Mathematik BGY, Teil A ohne Hilfsmittel: "
               "Ankreuzaufgaben mit Graphenzuordnung, kurze Aufgaben aus Analysis und "
               "analytischer Geometrie sowie Ziehen ohne Zurücklegen, mit Lösungen "
               "und Abbildungen.",
          plan=("../svp/mathe/abitur.html", "Zur Übersicht"))

s.task(
    "Fünfmal ankreuzen", 1,
    r"Bei jeder Teilaufgabe ist genau **eine** der fünf Antworten richtig. Notieren Sie "
    r"nur den Buchstaben; ein Lösungsweg wird nicht verlangt. Es sind keine Hilfsmittel "
    r"zugelassen. Die Abbildung mit den fünf Bildern gehört zu Teilaufgabe c).",
    [
        r"Gegeben ist die in $\mathbb{R}$ definierte Funktion $f$ mit "
        r"$f(x) = x \cdot e^{-2 \cdot x}$. Geben Sie $f'(x)$ an. • "
        r"(A) $-2 \cdot e^{-2x}$ • (B) $e^{-2x} \cdot (1 - 2x)$ • "
        r"(C) $e^{-2x} \cdot (1 + 2x)$ • (D) $-2x \cdot e^{-2x}$ • "
        r"(E) $e^{-2x} \cdot (x - 2)$",

        r"Geben Sie den Wert von $\displaystyle\int_{-2}^{2} \left(x^3 - 4 \cdot x\right)\,dx$ "
        r"an. • (A) $-8$ • (B) $-4$ • (C) $0$ • (D) $4$ • (E) $8$",

        r"Gegeben ist die Funktion $f$ mit $f(x) = (x + 1)^2 \cdot (x - 2)$. Geben Sie an, "
        r"welches der fünf Bilder den Graphen von $f$ zeigt. • (A) Bild 1 • (B) Bild 2 • "
        r"(C) Bild 3 • (D) Bild 4 • (E) Bild 5",

        r"Gegeben ist die Funktion $f$ mit $f(x) = 4 - \sqrt{2 \cdot x - 6}$. Geben Sie "
        r"den größtmöglichen Definitionsbereich $D$ und den zugehörigen Wertebereich $W$ "
        r"an. • (A) $D = [3;\infty)$ und $W = (-\infty;4]$ • "
        r"(B) $D = [3;\infty)$ und $W = [4;\infty)$ • "
        r"(C) $D = (-\infty;3]$ und $W = (-\infty;4]$ • "
        r"(D) $D = [6;\infty)$ und $W = (-\infty;4]$ • "
        r"(E) $D = \mathbb{R}$ und $W = \mathbb{R}$",
    ],
    [
        r"Richtig ist **(B)**. Produktregel mit dem inneren Faktor $-2$: "
        r"$f'(x) = 1 \cdot e^{-2x} + x \cdot (-2) \cdot e^{-2x} = e^{-2x} \cdot (1 - 2x)$. "
        r"In (A) fehlt der erste Summand, in (C) ist das Vorzeichen der inneren Ableitung "
        r"falsch, (D) ist das Produkt der beiden Einzelableitungen — die Produktregel "
        r"lautet aber nicht so — und (E) entsteht, wenn man den Faktor $x$ ableitet und "
        r"gleichzeitig die $-2$ in die Klammer schreibt. Probe: $f'(0) = 1$, und nur (B) "
        r"liefert an der Stelle $0$ den Wert $1$.",

        r"Richtig ist **(C)**. Der Integrand ist **punktsymmetrisch** zum Ursprung, denn "
        r"$(-x)^3 - 4 \cdot (-x) = -\left(x^3 - 4x\right)$. Über das symmetrische Intervall "
        r"$[-2;2]$ heben sich die beiden Anteile auf, das Integral ist $0$. Nachrechnen "
        r"bestätigt es: mit $F(x) = \frac{1}{4}x^4 - 2x^2$ ist "
        r"$F(2) - F(-2) = -4 - (-4) = 0$. Die Ablenkungen sind der Reihe nach: $-4$ ist nur "
        r"das halbe Integral $\int_{0}^{2}$, $-8$ dessen Verdopplung, $4$ sein Betrag und "
        r"$8$ der **Flächeninhalt** zwischen Graph und $x$-Achse — der ist hier tatsächlich "
        r"$8$, gefragt war aber das Integral.",

        r"Richtig ist **(E)**, also Bild 5. Aus der Produktform liest man ab: doppelte "
        r"Nullstelle bei $x = -1$ (der Graph **berührt** dort die Achse), einfache "
        r"Nullstelle bei $x = 2$ (der Graph **schneidet**), Grad $3$ mit positivem "
        r"Leitkoeffizienten, also von links unten nach rechts oben. Bild 1 zeigt eine "
        r"Parabel, hat also den falschen Grad; Bild 2 ist nirgends negativ und berührt an "
        r"beiden Stellen, das passt zu $(x+1)^2 (x-2)^2$; Bild 3 ist an der $x$-Achse "
        r"gespiegelt und gehört zu $-(x+1)^2 (x-2)$; in Bild 4 sind Berührpunkt und "
        r"Schnittpunkt vertauscht, das ist $(x+1)(x-2)^2$.",

        r"Richtig ist **(A)**. Die Wurzel verlangt $2x - 6 \geq 0$, also $x \geq 3$ und "
        r"damit $D = [3;\infty)$. Der Radikand durchläuft dabei alle Werte ab $0$, die "
        r"Wurzel also alle Werte ab $0$; von $4$ abgezogen ergibt das alle Werte "
        r"**höchstens** $4$, mit dem Maximum $f(3) = 4$. Also $W = (-\infty;4]$. In (B) ist "
        r"das Minuszeichen vor der Wurzel übersehen, in (C) das Ungleichheitszeichen "
        r"gedreht, in (D) wurde $2x - 6 \geq 0$ zu $x \geq 6$ statt $x \geq 3$ vereinfacht, "
        r"und (E) ignoriert die Wurzel ganz.",
    ],
    falle=r"Bei b) ist **Integral** nicht dasselbe wie **Flächeninhalt**. Der Graph liegt "
          r"links der Null oberhalb und rechts davon unterhalb der $x$-Achse; die beiden "
          r"Beiträge $+4$ und $-4$ löschen sich im Integral aus, während der Flächeninhalt "
          r"$8$ beträgt.",
    figs=[(fig_bilder(),
           "Zu c): Fünf Graphen zur Auswahl, alle im selben Ausschnitt von etwa −2 bis 2,7 "
           "waagerecht und −6 bis 6 senkrecht.")],
)

s.task(
    "Kurz gerechnet: Fläche, Ebene, Pyramide", 2,
    r"Die vier Teilaufgaben sind unabhängig voneinander und ohne Hilfsmittel zu lösen. "
    r"Die Abbildung zeigt eine gerade quadratische Pyramide $ABCDS$ mit der Grundfläche "
    r"$ABCD$ und der Spitze $S$; $M$ ist der Mittelpunkt der Grundfläche. Für die "
    r"Kantenvektoren wird $\vec{a} = \overrightarrow{AB}$, $\vec{b} = \overrightarrow{AD}$ "
    r"und $\vec{c} = \overrightarrow{AS}$ gesetzt.",
    [
        r"Berechnen Sie den Inhalt der Fläche, die die Graphen von $f$ mit $f(x) = x^2$ "
        r"und $g$ mit $g(x) = 2 \cdot x - x^2$ im ersten Quadranten einschließen.",

        r"Gegeben ist die Ebene $E$ mit der Gleichung "
        r"$2 \cdot x_1 - x_2 + 2 \cdot x_3 = 6$. Untersuchen Sie, ob die Punkte "
        r"$P(1 \mid -2 \mid 1)$ und $Q(2 \mid 0 \mid 2)$ in $E$ liegen, und geben Sie den "
        r"Abstand des Koordinatenursprungs von $E$ an.",

        r"Drücken Sie die Vektoren $\overrightarrow{AC}$, $\overrightarrow{BS}$ und "
        r"$\overrightarrow{MS}$ durch $\vec{a}$, $\vec{b}$ und $\vec{c}$ aus.",

        r"Die Grundkante der Pyramide ist $4$ cm lang, ihre Höhe beträgt $6$ cm. Geben Sie "
        r"das Volumen der Pyramide an.",
    ],
    [
        r"Schnittstellen aus $x^2 = 2x - x^2$, also $2x^2 - 2x = 0$ und damit "
        r"$2x \cdot (x - 1) = 0$: die Graphen treffen sich bei $x = 0$ und $x = 1$. "
        r"Dazwischen liegt $g$ oben, denn $g\left(\frac{1}{2}\right) = \frac{3}{4} > "
        r"\frac{1}{4} = f\left(\frac{1}{2}\right)$. Damit ist "
        r"$A = \int_{0}^{1} \left(2x - 2x^2\right)\,dx = "
        r"\left[x^2 - \frac{2}{3}x^3\right]_{0}^{1} = 1 - \frac{2}{3} = \frac{1}{3}$. "
        r"Der gesuchte Flächeninhalt beträgt also **ein Drittel** einer Flächeneinheit.",

        r"Punktprobe für $P$: $2 \cdot 1 - (-2) + 2 \cdot 1 = 2 + 2 + 2 = 6$ — die Gleichung "
        r"ist erfüllt, $P$ liegt in $E$. Für $Q$: "
        r"$2 \cdot 2 - 0 + 2 \cdot 2 = 8 \neq 6$, also liegt $Q$ **nicht** in $E$. "
        r"Der Normalenvektor $\vec{n} = (2 \mid -1 \mid 2)$ hat die Länge "
        r"$\sqrt{4 + 1 + 4} = 3$, weshalb sich die Hesse-Form ohne Rechner ergibt: "
        r"$d(O;E) = \dfrac{\left|2 \cdot 0 - 0 + 2 \cdot 0 - 6\right|}{3} = "
        r"\dfrac{6}{3} = 2$.",

        r"$\overrightarrow{AC} = \overrightarrow{AB} + \overrightarrow{BC} = "
        r"\vec{a} + \vec{b}$, weil $\overrightarrow{BC} = \overrightarrow{AD} = \vec{b}$ "
        r"ist. Weiter gilt "
        r"$\overrightarrow{BS} = \overrightarrow{BA} + \overrightarrow{AS} = "
        r"\vec{c} - \vec{a}$. Der Mittelpunkt der Grundfläche liegt auf der Diagonalen: "
        r"$\overrightarrow{AM} = \frac{1}{2} \cdot \left(\vec{a} + \vec{b}\right)$, und "
        r"damit ist $\overrightarrow{MS} = \overrightarrow{AS} - \overrightarrow{AM} = "
        r"\vec{c} - \frac{1}{2} \cdot \vec{a} - \frac{1}{2} \cdot \vec{b}$.",

        r"Die Grundfläche ist ein Quadrat mit $G = 4^2 = 16$. Mit "
        r"$V = \frac{1}{3} \cdot G \cdot h$ folgt "
        r"$V = \frac{1}{3} \cdot 16 \cdot 6 = 16 \cdot 2 = 32$. Das Volumen beträgt also "
        r"**32 Kubikzentimeter**.",
    ],
    falle=r"Bei a) zählt **obere minus untere** Funktion. Wer "
          r"$\int_{0}^{1} \left(x^2 - (2x - x^2)\right)\,dx$ rechnet, erhält "
          r"$-\frac{1}{3}$ — ein Flächeninhalt ist aber nie negativ. Und bei b) muss durch "
          r"die **Länge** des Normalenvektors geteilt werden, nicht durch die $6$ auf der "
          r"rechten Seite.",
    figs=[(fig_pyramide(),
           "Zu c): Die Pyramide im Schrägbild. Grün eingezeichnet sind die drei "
           "Kantenvektoren a, b und c; gestrichelt die verdeckten Kanten, die Diagonalen "
           "der Grundfläche und die Höhe MS.")],
    solfigs=[(fig_parabeln(),
              "Zu a): Zwischen 0 und 1 verläuft der Graph von g über dem von f. Die orange "
              "Fläche A hat den Inhalt ein Drittel.")],
)

s.task(
    "Der passende Schlüssel", 3,
    r"In einer Schublade liegen fünf gleich aussehende Schlüssel; genau zwei davon passen "
    r"zur Kellertür. Es wird zufällig ein Schlüssel nach dem anderen **ohne Zurücklegen** "
    r"probiert, bis die Tür aufgeht. Die Zufallsgröße $X$ gibt die Anzahl der dafür "
    r"benötigten Versuche an.",
    [
        r"Bestimmen Sie $P(X = 1)$ und $P(X = 2)$.",
        r"Geben Sie die Wahrscheinlichkeitsverteilung von $X$ vollständig an. Begründen "
        r"Sie dabei, warum $X$ höchstens den Wert $4$ annehmen kann.",
        r"Berechnen Sie den Erwartungswert von $X$ und deuten Sie ihn im "
        r"Sachzusammenhang.",
        r"Beurteilen Sie die folgende Aussage: „Zwei von fünf Schlüsseln passen, die "
        r"Trefferwahrscheinlichkeit ist also $0{,}4$. Im Mittel braucht man deshalb "
        r"$\frac{1}{0{,}4} = 2{,}5$ Versuche.“",
    ],
    [
        r"Beim ersten Griff sind noch alle fünf Schlüssel in der Schublade, also "
        r"$P(X = 1) = \frac{2}{5} = 0{,}4$. Für genau zwei Versuche muss der erste "
        r"Schlüssel nicht passen und der zweite passen. Nach dem ersten Fehlversuch liegen "
        r"nur noch vier Schlüssel da, von denen weiterhin zwei passen: "
        r"$P(X = 2) = \frac{3}{5} \cdot \frac{2}{4} = \frac{3}{10} = 0{,}3$.",

        r"Dieselbe Pfadregel liefert "
        r"$P(X = 3) = \frac{3}{5} \cdot \frac{2}{4} \cdot \frac{2}{3} = \frac{1}{5} = 0{,}2$ "
        r"und $P(X = 4) = \frac{3}{5} \cdot \frac{2}{4} \cdot \frac{1}{3} \cdot 1 = "
        r"\frac{1}{10} = 0{,}1$. Mehr als $4$ ist unmöglich, denn es gibt nur **drei** "
        r"nicht passende Schlüssel: nach drei Fehlversuchen liegen nur noch die beiden "
        r"passenden in der Schublade, der vierte Versuch gelingt also sicher — der letzte "
        r"Faktor ist deshalb $\frac{2}{2} = 1$. Probe: "
        r"$0{,}4 + 0{,}3 + 0{,}2 + 0{,}1 = 1$.",

        r"$E(X) = 1 \cdot 0{,}4 + 2 \cdot 0{,}3 + 3 \cdot 0{,}2 + 4 \cdot 0{,}1 = "
        r"0{,}4 + 0{,}6 + 0{,}6 + 0{,}4 = 2$. Wer das Probieren sehr oft wiederholt, "
        r"braucht **im Durchschnitt zwei Versuche**, bis die Tür aufgeht. Der Wert ist "
        r"kein Einzelergebnis: $X = 2$ tritt nur in $30\ \%$ der Fälle ein.",

        r"Die Aussage ist **falsch**. Der Wert $\frac{1}{p} = 2{,}5$ gehört zum Ziehen "
        r"**mit** Zurücklegen, wo die Trefferwahrscheinlichkeit bei jedem Versuch $0{,}4$ "
        r"bleibt. Hier wird ohne Zurücklegen probiert: Ein aussortierter Schlüssel kommt "
        r"nicht zurück, und die Chance steigt von $\frac{2}{5}$ über $\frac{2}{4}$ und "
        r"$\frac{2}{3}$ bis auf $1$. Deshalb ist der Erwartungswert mit $2$ **kleiner** "
        r"als $2{,}5$. Allgemein gilt beim Probieren ohne Zurücklegen "
        r"$E(X) = \frac{n+1}{k+1}$, hier also $\frac{5+1}{2+1} = 2$.",
    ],
    falle=r"Ohne Zurücklegen ändern sich die Wahrscheinlichkeiten von Zug zu Zug — der "
          r"Nenner schrumpft, der Zähler bleibt bei $2$, solange kein Treffer dabei war. "
          r"Wer mit einer festen Trefferwahrscheinlichkeit $0{,}4$ weiterrechnet, "
          r"behandelt das Zufallsexperiment wie ein Ziehen mit Zurücklegen und bekommt "
          r"systematisch zu große Werte.",
    figs=[(fig_baum(),
           "Baumdiagramm: Nach jedem Fehlversuch geht es einen Ast tiefer, und die "
           "Trefferchance steigt. Rechts stehen die vier Pfadwahrscheinlichkeiten.")],
    solfigs=[(fig_verteilung(),
              "Zu c): Die Verteilung von X. Der Erwartungswert 2 liegt nicht beim höchsten "
              "Stab, sondern im Schwerpunkt der vier Stäbe.")],
)


def check():
    """Every number in the solutions, recomputed - exact where a Fraction can do it."""
    # --- Aufgabe 1 a) Ableitung ------------------------------------------------
    for x in (-1.0, -0.3, 0.0, 0.5, 1.7):
        num = (( (x + 1e-6) * exp(-2 * (x + 1e-6)) - (x - 1e-6) * exp(-2 * (x - 1e-6)) )
               / 2e-6)
        assert abs(d_a(x) - num) < 1e-5, x
    assert abs(d_a(0) - 1) < 1e-12                       # Probe aus der Loesung
    for key, fn in OPT_A.items():                        # nur (B) trifft ueberall
        same = all(abs(fn(x) - d_a(x)) < 1e-9 for x in (-0.7, 0.0, 0.4, 1.3))
        assert same == (key == "B"), key
    assert abs(OPT_A["A"](0) + 2) < 1e-12                # (A) liefert -2 statt 1
    assert abs(OPT_A["D"](0)) < 1e-12                    # (D) liefert 0 statt 1
    assert abs(OPT_A["E"](0) + 2) < 1e-12                # (E) liefert -2 statt 1
    assert abs(OPT_A["C"](0) - 1) < 1e-12                # (C) stimmt nur zufaellig bei 0
    assert abs(OPT_A["C"](1) - d_a(1)) > 0.1             # aber nicht bei 1

    # --- Aufgabe 1 b) Integral -------------------------------------------------
    for t in (Fr(1, 7), Fr(3, 2), Fr(2), Fr(-5, 3)):     # der Integrand ist ungerade
        assert h_b(-t) == -h_b(t)
    assert H_b(Fr(2)) - H_b(Fr(-2)) == 0                 # (C) - richtig
    halb = H_b(Fr(2)) - H_b(Fr(0))
    assert halb == -4                                    # (B) - nur das halbe Integral
    assert 2 * halb == -8                                # (A)
    assert abs(halb) == 4                                # (D)
    assert 2 * abs(halb) == 8                            # (E) - der Flaecheninhalt
    for wrong in (-8, -4, 4, 8):                         # keine andere Option ist null
        assert wrong != 0
    # der Flaecheninhalt ist wirklich 8: h_b ist auf (-2,0) positiv, auf (0,2) negativ
    assert h_b(-1.0) > 0 > h_b(1.0)
    assert (H_b(Fr(0)) - H_b(Fr(-2))) == 4

    # --- Aufgabe 1 c) Graphenzuordnung -----------------------------------------
    eps = Fr(1, 1000)
    assert g5(Fr(-1)) == 0 and g5(Fr(2)) == 0
    assert g5(Fr(-1) - eps) < 0 and g5(Fr(-1) + eps) < 0  # Beruehrpunkt bei -1
    assert g5(Fr(2) - eps) < 0 < g5(Fr(2) + eps)          # Schnittpunkt bei 2
    for xs in (Fr(-3), Fr(-2), Fr(0), Fr(1), Fr(3)):      # nur Bild 5 passt zum Term
        target = (xs + 1) ** 2 * (xs - 2)
        assert g5(xs) == target
    for other in (g1, g2, g3, g4):
        assert any(other(xs) != (xs + 1) ** 2 * (xs - 2)
                   for xs in (Fr(-2), Fr(0), Fr(1), Fr(3)))
    assert g1(Fr(-1)) == 0 and g1(Fr(2)) == 0 and g1(Fr(0)) == -2   # Parabel, Grad 2
    assert g1(Fr(-1) - eps) > 0 > g1(Fr(-1) + eps)                  # schneidet bei -1
    assert all(g2(Fr(t, 4)) >= 0 for t in range(-12, 13))           # Bild 2 nie negativ
    assert g2(Fr(-1)) == 0 and g2(Fr(2)) == 0
    for xs in (Fr(-2), Fr(0), Fr(1), Fr(3)):
        assert g3(xs) == -g5(xs)                                    # Bild 3 gespiegelt
    assert g4(Fr(2)) == 0 and g4(Fr(2) - eps) > 0 and g4(Fr(2) + eps) > 0  # Beruehrung bei 2
    assert g4(Fr(-1)) == 0 and g4(Fr(-1) - eps) < 0 < g4(Fr(-1) + eps)     # Schnitt bei -1
    assert g4(Fr(0)) == 4 and g1(Fr(0)) == -2 and g3(Fr(1)) == 4

    # --- Aufgabe 1 d) Definitions- und Wertebereich ----------------------------
    assert 2 * 3 - 6 == 0 and 2 * Fr(29, 10) - 6 < 0      # Rand bei 3, davor negativ
    assert abs(f_d(3) - 4) < 1e-12                        # Maximum 4 wird angenommen
    assert all(f_d(x) <= 4 + 1e-12 for x in (3, 3.5, 5, 11, 100))
    assert f_d(5) == 2                                    # 4 - sqrt(4)
    for y in (4, 2, 0, -6, -100):                         # jeder Wert <= 4 wird erreicht
        x = 3 + (4 - y) ** 2 / 2.0
        assert x >= 3 and abs(f_d(x) - y) < 1e-9
    assert 2 * 6 - 6 == 6 != 0                            # (D): 6 ist nicht der Rand

    # --- Aufgabe 2 a) Flaeche zwischen den Parabeln ----------------------------
    for xs in (Fr(0), Fr(1)):
        assert para_f(xs) == para_g(xs)                   # Schnittstellen
    assert para_f(Fr(1, 2)) == Fr(1, 4) and para_g(Fr(1, 2)) == Fr(3, 4)
    F = lambda x: x ** 2 - Fr(2, 3) * x ** 3              # Stammfunktion von 2x - 2x^2
    assert F(Fr(1)) - F(Fr(0)) == Fr(1, 3)
    assert 2 * Fr(1) ** 2 - 2 * Fr(1) == 0                # 2x^2 - 2x = 0 bei x = 1

    # --- Aufgabe 2 b) Ebene ----------------------------------------------------
    n1, n2, n3, rhs = EBENE
    assert n1 * 1 + n2 * (-2) + n3 * 1 == rhs             # P liegt in E
    assert n1 * 2 + n2 * 0 + n3 * 2 == 8 != rhs           # Q liegt nicht in E
    assert n1 ** 2 + n2 ** 2 + n3 ** 2 == 9               # |n| = 3, exakt
    assert Fr(abs(0 - rhs), 3) == 2                       # Abstand des Ursprungs

    # --- Aufgabe 2 c) Vektoren an der Pyramide ---------------------------------
    def sub(p, q):
        return tuple(a - b for a, b in zip(p, q))

    for A, B, D, Sp in (((0, 0, 0), (4, 0, 0), (0, 4, 0), (2, 2, 6)),
                        ((1, -2, 3), (4, 1, 3), (-2, 1, 3), (2, 1, 9))):
        C = tuple(B[i] + D[i] - A[i] for i in range(3))   # Parallelogramm-Grundflaeche
        M = tuple(Fr(A[i] + C[i], 2) for i in range(3))
        a, b, cvec = sub(B, A), sub(D, A), sub(Sp, A)
        assert sub(C, A) == tuple(a[i] + b[i] for i in range(3))
        assert sub(Sp, B) == tuple(cvec[i] - a[i] for i in range(3))
        assert tuple(Fr(v) for v in sub(Sp, M)) == \
            tuple(cvec[i] - Fr(a[i], 2) - Fr(b[i], 2) for i in range(3))
    assert PC == tuple(PB[i] + PD[i] - PA[i] for i in range(3))
    assert PM == tuple((PA[i] + PC[i]) // 2 for i in range(3))

    # --- Aufgabe 2 d) Volumen --------------------------------------------------
    assert 4 ** 2 == 16 and Fr(1, 3) * 16 * 6 == 32

    # --- Aufgabe 3: Ziehen ohne Zuruecklegen -----------------------------------
    assert sorted(PROBS) == [1, 2, 3, 4]
    assert PROBS[1] == Fr(2, 5) == Fr(4, 10)
    assert PROBS[2] == Fr(3, 5) * Fr(2, 4) == Fr(3, 10)
    assert PROBS[3] == Fr(3, 5) * Fr(2, 4) * Fr(2, 3) == Fr(1, 5)
    assert PROBS[4] == Fr(3, 5) * Fr(2, 4) * Fr(1, 3) * Fr(2, 2) == Fr(1, 10)
    assert sum(PROBS.values()) == 1
    assert EX == 2 == Fr(NK + 1, KP + 1)                  # (n+1)/(k+1)
    assert PROBS[1] + PROBS[2] == Fr(7, 10)
    assert Fr(1, 1) / Fr(2, 5) == Fr(5, 2)                # 2,5 gilt MIT Zuruecklegen
    assert EX < Fr(5, 2)
    # der Erwartungswert liegt nicht beim wahrscheinlichsten Wert
    assert max(PROBS, key=lambda k: PROBS[k]) == 1 != EX
    # Kontrollrechnung ueber alle Anordnungen der fuenf Schluessel
    from itertools import permutations
    keys = (1, 1, 0, 0, 0)                                # 1 = passt
    total, hits = 0, 0
    for perm in set(permutations(keys)):
        anz = next(i + 1 for i, v in enumerate(perm) if v == 1)
        total += 1
        hits += anz
    assert total == 10 and Fr(hits, total) == EX


s.verify(check)
s.save()
