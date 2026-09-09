#!/usr/bin/env python3
"""Abitur-Training BGY - Pruefungssimulation Teil B (Grundkurs).

    python3 tools/aufgaben/abi/simulation.py

Not a collection of topics but one whole exam: the three compulsory tasks of Teil B in
the Sachsen Grundkurs cut - Analysis (25 BE), Analytische Geometrie (15 BE), Stochastik
(15 BE). The AFB marker of the sheet layout is used here only to keep that order.
Task types are rebuilt freely; wording, numbers and every figure are our own.
"""
import math
import os
import re
import sys
from fractions import Fraction as Fr
from math import comb, degrees, acos, asin, sqrt

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# =========================================================== Aufgabe 1: f ====
# f(x) = x^3 - 3x^2 - 9x + 11 - zeros 1 and 1 +- 2*sqrt(3), H(-1|16), T(3|-16),
# one inflection point W(1|0); the graph is point symmetric to W.
def f(x):
    return x ** 3 - 3 * x ** 2 - 9 * x + 11


def df(x):
    return 3 * x ** 2 - 6 * x - 9


def ddf(x):
    return 6 * x - 6


def F(x):
    """Antiderivative of f."""
    return x ** 4 / 4.0 - x ** 3 - 4.5 * x ** 2 + 11 * x


ZERO_L = 1 - 2 * sqrt(3)
ZERO_R = 1 + 2 * sqrt(3)

# ================================================= Aufgabe 2: die Pyramide ====
# Square base in the x-y plane, apex above its centre. 1 LE = 1 m.
PA, PB, PC, PD = (0, 0, 0), (8, 0, 0), (8, 8, 0), (0, 8, 0)
PS = (4, 4, 6)
PM = (4, 4, 0)
NORM = (3, 0, 2)                     # normal of the plane through B, C and S


def sub(p, q):
    return tuple(a - b for a, b in zip(p, q))


def dot(p, q):
    return sum(a * b for a, b in zip(p, q))


def cross(p, q):
    return (p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0])


def norm(p):
    return sqrt(dot(p, p))


# ================================================ Aufgabe 3: der Versandhandel ==
P_E = Fr(3, 5)          # Bestellung ueber die App
P_R = Fr(1, 4)          # Bestellung wird zurueckgeschickt
P_ER = Fr(9, 50)        # beides
N_BIN, P_BIN = 20, Fr(1, 4)


def binom(n, p, k):
    return comb(n, k) * p ** k * (1 - p) ** (n - k)


def cdf(n, p, k):
    return sum(binom(n, p, i) for i in range(k + 1))


P5 = binom(N_BIN, P_BIN, 5)
P_MAX3 = cdf(N_BIN, P_BIN, 3)
P_MIN2 = 1 - binom(N_BIN, P_BIN, 0) - binom(N_BIN, P_BIN, 1)


# ----------------------------------------------------------------- helpers ---
def _arc(cv, vx, vy, u, w, r, color=S.RED, width=1.5, n=28):
    """Angle marker: an arc around the screen point (vx, vy) between two screen
    directions u and w. svgfig has no arc primitive, so it is sampled here."""
    a0, a1 = math.atan2(u[1], u[0]), math.atan2(w[1], w[0])
    while a1 - a0 > math.pi:
        a1 -= 2 * math.pi
    while a0 - a1 > math.pi:
        a1 += 2 * math.pi
    pts = [(vx + r * math.cos(a0 + (a1 - a0) * i / float(n)),
            vy + r * math.sin(a0 + (a1 - a0) * i / float(n))) for i in range(n + 1)]
    cv.poly(pts, stroke=color, width=width, fill="none", close=False)


def _bar(p, k, v, fill, width=0.62):
    """One bar of a bar chart, drawn on top of Plot.bars to recolour single columns."""
    left, right = p.X(k - width / 2.0), p.X(k + width / 2.0)
    p.rect(left, p.Y(v), right - left, p.Y(0) - p.Y(v), fill=fill, stroke=S.PAPER, width=0.8)


# ----------------------------------------------------- figures: Aufgabe 1 ---
def fig_graph():
    p = S.Plot((-3.7, 5.7), (-27, 27), w=540, h=360, pad=(48, 24, 20, 34))
    p.grid(1, 4)
    p.axes(1, 8, xlabel="x", ylabel="y")
    p.curve(f, -3.2, 5.2, S.RED, 2.2)
    p.dashto(-1, 16)
    p.dashto(3, -16)
    p.point(ZERO_L, 0, None, color=S.MUTED, size=2.8)
    p.point(ZERO_R, 0, None, color=S.MUTED, size=2.8)
    p.point(-1, 16, "H", "above")
    p.point(3, -16, "T", "below")
    p.point(1, 0, "W", "above-right", color=S.GREEN)
    return p.svg("Graph der Funktion f mit Hochpunkt, Wendepunkt und Tiefpunkt")


def fig_symmetrie():
    p = S.Plot((-3.7, 5.7), (-27, 27), w=520, h=350, pad=(48, 24, 22, 34))
    p.grid(1, 4)
    p.axes(1, 8, xlabel="x", ylabel="y")
    p.curve(f, -3.2, 5.2, S.RED, 2.2)
    p.seg((-1, 16), (3, -16), S.MUTED, 1.2, dash="5 4")
    p.tangent(f, df, 1, 1.15, S.GREEN, 1.9)
    p.point(-1, 16, "H", "above")
    p.point(3, -16, "T", "below")
    p.point(1, 0, "W", "above-right", color=S.GREEN)
    # own labels last and with a halo - Plot.axes puts its ticks down before the data
    p.text(p.X(2.2), p.Y(22), "Wendetangente y = −12x + 12", 12, S.GREEN, "middle",
           halo=S.PAPER)
    p.text(p.X(5.5), p.Y(-24), "H, W und T auf einer Geraden", 11.5, S.MUTED, "end",
           halo=S.PAPER)
    return p.svg("Graph von f mit der Wendetangente und der Verbindungsstrecke von Hoch- "
                 "und Tiefpunkt durch den Wendepunkt")


def fig_flaeche():
    p = S.Plot((-0.7, 2.9), (-16, 16), w=470, h=310, pad=(48, 22, 18, 34))
    p.grid(0.5, 4)
    # the axes go on top of the two filled areas, otherwise the tick labels below the
    # x-axis disappear under the red one
    p.area(f, 0, 1, S.GREEN, 0.38)
    p.area(f, 1, 2, S.RED, 0.30)
    p.curve(f, -0.5, 2.6, S.RED, 2.1)
    p.axes(1, 4, xlabel="x", ylabel="y", skip_y=(0, 12))
    p.point(1, 0, None, color=S.GREEN, size=3.2)
    p.text(p.X(0.45), p.Y(3.4), "A1", 13.5, S.INK, halo=S.PAPER)
    p.text(p.X(1.5), p.Y(-3.4), "A2", 13.5, S.INK, halo=S.PAPER)
    return p.svg("Die beiden Flaechenstuecke zwischen dem Graphen und der x-Achse ueber "
                 "dem Intervall von 0 bis 2")


# ----------------------------------------------------- figures: Aufgabe 2 ---
def fig_pyramide():
    sd = S.Solid(w=540, h=400, scale=30, ox=175, oy=246)
    sd.axes(lx=9.0, ly=9.6, lz=7.2)
    sd.shade([PB, PC, PS], S.ORANGE, 0.36)              # Dachflaeche BCS
    sd.shade([PC, PD, PS], S.GREEN, 0.16)
    sd.edges([(PB, PC), (PC, PD), (PB, PS), (PC, PS), (PD, PS)])
    sd.edges([(PA, PB), (PA, PD), (PA, PS)], dash="5 4", color=S.MUTED)
    for q, lab, pos in ((PA, "A", "above-left"), (PB, "B", "below-left"),
                        (PC, "C", "below-right"), (PD, "D", "above-right"),
                        (PS, "S", "above")):
        sd.vertex(q, lab, pos)
    sd.vertex(PM, "M", "below-right", color=S.MUTED, size=2.6)
    sd.label3((20 / 3.0, 4, 2), "Dachfläche BCS", 0, 0, 12, S.MUTED)
    return sd.svg("Schraegbild der Pyramide ABCDS mit der Spitze S ueber dem Mittelpunkt "
                  "der quadratischen Grundflaeche")


def fig_aufriss():
    # scales are made equal (36 px per metre) so the marked angle is the true angle
    p = S.Plot((-1.2, 9.6), (-1.4, 7.6), w=453, h=376, pad=(44, 20, 18, 34))
    p.grid(1, 1)
    p.axes(2, 2, xlabel="x", ylabel="z")
    tri = [p.P(0, 0), p.P(8, 0), p.P(4, 6)]
    p.poly(tri, stroke="none", width=0, fill=S.ORANGE, opacity=0.3)
    p.poly(tri, stroke=S.RED, width=2.0, fill="none")
    p.seg((4, 0), (4, 6), S.MUTED, 1.3, dash="4 3")
    v = p.P(8, 0)
    _arc(p, v[0], v[1], (p.P(0, 0)[0] - v[0], p.P(0, 0)[1] - v[1]),
         (p.P(4, 6)[0] - v[0], p.P(4, 6)[1] - v[1]), 46, S.RED, 1.6)
    p.text(p.X(6.0), p.Y(0.62), "56,3°", 12.5, S.RED, "middle", halo=S.PAPER)
    p.brace(4, 8, -0.62, "4 m", S.MUTED, up=False)
    p.text(p.X(3.75), p.Y(3.0), "6 m", 12, S.MUTED, "end", halo=S.PAPER)
    p.text(p.X(4.0), p.Y(7.1), "Schnitt in der Ebene y = 4", 12, S.MUTED, "middle",
           halo=S.PAPER)
    return p.svg("Aufriss: senkrechter Schnitt durch die Pyramide mit dem Neigungswinkel "
                 "der Dachflaeche")


# ----------------------------------------------------- figures: Aufgabe 3 ---
def fig_tafel():
    d = S.Diagram(470, 194)
    cells = [["", "R", "R̄", "Σ"],
             ["E", "0,18", "", ""],
             ["Ē", "", "", ""],
             ["Σ", "0,25", "", "1"]]
    d.table(24, 20, 4, 4, 105, 40, cells)
    return d.svg("Unvollstaendige Vierfeldertafel mit den Ereignissen E und R")


def fig_tafel_voll():
    d = S.Diagram(470, 194)
    cells = [["", "R", "R̄", "Σ"],
             ["E", "0,18", "0,42", "0,60"],
             ["Ē", "0,07", "0,33", "0,40"],
             ["Σ", "0,25", "0,75", "1"]]
    d.table(24, 20, 4, 4, 105, 40, cells)
    return d.svg("Vollstaendig ausgefuellte Vierfeldertafel")


def fig_binomial():
    probs = [float(binom(N_BIN, P_BIN, k)) for k in range(13)]
    p = S.Plot((-0.9, 12.8), (0, 0.24), w=520, h=320, pad=(58, 20, 22, 40))
    p.bars(probs, 0, S.ORANGE)
    for k in range(4):
        _bar(p, k, probs[k], S.GREEN)
    _bar(p, 5, probs[5], S.RED)
    # axes on top of the bars: their white outlines would otherwise nibble the x-axis
    p.axes(1, 0.04, xlabel="k", ylabel="P(X = k)", ydec=2)
    p.text(p.X(0.25), p.Y(0.185), "höchstens 3:  0,225", 12, S.GREEN, "start", halo=S.PAPER)
    p.arrow(p.X(1.75), p.Y(0.178), p.X(2.25), p.Y(0.071), S.GREEN, 1.1)
    p.text(p.X(6.1), p.Y(0.213), "genau 5:  0,202", 12, S.RED, "start", halo=S.PAPER)
    p.arrow(p.X(6.0), p.Y(0.209), p.X(5.4), p.Y(0.206), S.RED, 1.1)
    return p.svg("Balkendiagramm der Binomialverteilung fuer n gleich 20 und p gleich 0,25")


# ------------------------------------------------------------------- sheet ---
s = Sheet("abitur-bgy-simulation", "Prüfungssimulation Teil B",
          kind="Abitur-Training",
          suffix="",
          klasse="Berufliches Gymnasium",
          sub="Berufliches Gymnasium · Grundkurs · Teil B der schriftlichen Abiturprüfung · "
              "drei Pflichtaufgaben, 25 + 15 + 15 Bewertungseinheiten",
          desc="Abitur-Training Mathematik BGY: vollständige Prüfungssimulation für Teil B "
               "mit Analysis, Analytischer Geometrie und Stochastik, mit Lösungen und "
               "Abbildungen.",
          plan=("../svp/mathe/abitur.html", "Zur Übersicht"))

s.task(
    "Vom Graphen zum Speicherbecken", 1,
    r"**Pflichtaufgabe 1 · Analysis (25 BE).** Alle drei Aufgaben dieses Teils sind zu "
    r"bearbeiten. Die Gesamtarbeitszeit beträgt 255 Minuten einschließlich Teil A; "
    r"zugelassene Hilfsmittel sind eine Formelsammlung, Zeichengeräte und ein "
    r"grafikfähiger Taschenrechner. — Gegeben ist die in $\mathbb{R}$ definierte Funktion "
    r"$f$ mit $f(x) = x^3 - 3 \cdot x^2 - 9 \cdot x + 11$. Die Abbildung zeigt den Graphen "
    r"von $f$.",
    [
        r"Berechnen Sie die Nullstellen von $f$ sowie die Koordinaten des Hoch- und des "
        r"Tiefpunktes. (7 BE)",
        r"Weisen Sie nach, dass der Graph von $f$ genau einen Wendepunkt besitzt, und "
        r"bestimmen Sie eine Gleichung der Tangente an den Graphen in diesem Punkt. (6 BE)",
        r"Der Graph von $f$ und die $x$-Achse begrenzen über dem Intervall "
        r"$0 \leq x \leq 2$ zwei Flächenstücke. Berechnen Sie den Inhalt der gesamten "
        r"Fläche. (5 BE)",
        r"Für $0 \leq t \leq 4$ beschreibt $f(t)$ die momentane Änderungsrate der "
        r"Wassermenge in einem Regenwasserspeicher in Kubikmetern je Stunde; dabei ist $t$ "
        r"die Zeit in Stunden nach Beginn der Messung. Zu Beginn enthält der Speicher "
        r"$30$ Kubikmeter. Bestimmen Sie den Zeitpunkt, zu dem sich die größte Wassermenge "
        r"im Speicher befindet, sowie diese Wassermenge, und geben Sie an, wann die "
        r"Wassermenge am schnellsten abnimmt. (7 BE)",
    ],
    [
        r"Wegen $f(1) = 1 - 3 - 9 + 11 = 0$ ist $x = 1$ eine Nullstelle. Die "
        r"Polynomdivision ergibt "
        r"$\left(x^3 - 3x^2 - 9x + 11\right) : (x - 1) = x^2 - 2x - 11$, und aus "
        r"$x^2 - 2x - 11 = 0$ folgt $x = 1 \pm \sqrt{12}$. Die Nullstellen sind also "
        r"$x_1 = 1 - 2\sqrt{3} \approx -2{,}46$, $x_2 = 1$ und "
        r"$x_3 = 1 + 2\sqrt{3} \approx 4{,}46$. Weiter ist "
        r"$f'(x) = 3x^2 - 6x - 9 = 3 \cdot (x + 1) \cdot (x - 3)$, also $x = -1$ oder "
        r"$x = 3$. Mit $f''(x) = 6x - 6$ ist $f''(-1) = -12 < 0$ und $f''(3) = 12 > 0$. "
        r"Damit **Hochpunkt** $H(-1 \mid 16)$ und **Tiefpunkt** $T(3 \mid -16)$.",
        r"$f''(x) = 6x - 6 = 0$ liefert genau die Stelle $x = 1$; eine lineare Funktion hat "
        r"höchstens eine Nullstelle, also kommt keine weitere Stelle in Frage. Wegen "
        r"$f'''(x) = 6 \neq 0$ wechselt $f''$ dort das Vorzeichen, es liegt ein Wendepunkt "
        r"vor: $W(1 \mid 0)$. Der Anstieg der Wendetangente ist "
        r"$f'(1) = 3 - 6 - 9 = -12$, damit $y = -12 \cdot (x - 1)$, also $y = -12x + 12$. "
        r"Nebenbei: Mit $x = 1 + u$ wird $f(1 + u) = u^3 - 12u$, eine ungerade Funktion — "
        r"der Graph ist punktsymmetrisch zu $W$.",
        r"Eine Stammfunktion ist "
        r"$F(x) = \frac{1}{4}x^4 - x^3 - \frac{9}{2}x^2 + 11x$. Über $0 \leq x \leq 1$ "
        r"verläuft der Graph oberhalb der $x$-Achse: "
        r"$\int_0^1 f(x)\,\mathrm{d}x = F(1) - F(0) = 5{,}75$. Über $1 \leq x \leq 2$ "
        r"verläuft er unterhalb: "
        r"$\int_1^2 f(x)\,\mathrm{d}x = F(2) - F(1) = 0 - 5{,}75 = -5{,}75$. Für den "
        r"Flächeninhalt werden die Beträge addiert: "
        r"$A = 5{,}75 + 5{,}75 = 11{,}5$ Flächeneinheiten.",
        r"Solange $f(t) > 0$ ist, wächst die Wassermenge; ab $t = 1$ ist $f(t) < 0$, sie "
        r"nimmt also ab. Die größte Wassermenge liegt somit nach **einer Stunde** vor, und "
        r"zwar $30 + \int_0^1 f(t)\,\mathrm{d}t = 30 + 5{,}75 = 35{,}75$ Kubikmeter. Am "
        r"schnellsten nimmt die Menge dort ab, wo die Änderungsrate am kleinsten ist, also "
        r"im Tiefpunkt von $f$: nach **3 Stunden** mit $16$ Kubikmetern je Stunde. Zur "
        r"Einordnung: $\int_0^4 f(t)\,\mathrm{d}t = F(4) - F(0) = -28$, nach vier Stunden "
        r"sind also noch $2$ Kubikmeter im Speicher.",
    ],
    falle=r"In Teil c) ist die **Fläche** gefragt, nicht das Integral. Wegen der "
          r"Punktsymmetrie zum Wendepunkt ist $\int_0^2 f(x)\,\mathrm{d}x = 0$ — wer nur "
          r"einmal durchintegriert, erhält null und damit eine Fläche, die es nicht gibt.",
    figs=[(fig_graph(), "Der Graph von f zwischen x = −3,2 und x = 5,2.")],
    solfigs=[(fig_symmetrie(),
              "Zu b): die Wendetangente mit dem Anstieg −12. Hoch- und Tiefpunkt liegen "
              "spiegelbildlich zum Wendepunkt W(1 | 0)."),
             (fig_flaeche(),
              "Zu c): beide Flächenstücke haben den Inhalt 5,75, liegen aber auf "
              "verschiedenen Seiten der x-Achse. Ihre Integrale heben sich auf, ihre "
              "Flächeninhalte nicht.")],
)

s.task(
    "Das Zeltdach des Musikpavillons", 2,
    r"**Pflichtaufgabe 2 · Analytische Geometrie (15 BE).** Das Zeltdach eines "
    r"Musikpavillons wird modellhaft durch die Pyramide $ABCDS$ mit "
    r"$A(0 \mid 0 \mid 0)$, $B(8 \mid 0 \mid 0)$, $C(8 \mid 8 \mid 0)$, "
    r"$D(0 \mid 8 \mid 0)$ und der Spitze $S(4 \mid 4 \mid 6)$ beschrieben. Das Quadrat "
    r"$ABCD$ liegt in der waagerechten $x$-$y$-Ebene. Eine Längeneinheit entspricht "
    r"einem Meter.",
    [
        r"Berechnen Sie die Länge der Seitenkante $\overline{AS}$ und weisen Sie nach, "
        r"dass alle vier Seitenkanten gleich lang sind. (4 BE)",
        r"Weisen Sie nach, dass $\varepsilon: 3x + 2z = 24$ eine Gleichung der Ebene durch "
        r"die Punkte $B$, $C$ und $S$ ist. (4 BE)",
        r"Berechnen Sie die Größe des Winkels, unter dem die Dachfläche $BCS$ gegen die "
        r"waagerechte Ebene geneigt ist. (4 BE)",
        r"Berechnen Sie den Abstand des Mittelpunktes $M(4 \mid 4 \mid 0)$ der "
        r"Grundfläche von der Ebene $\varepsilon$. (3 BE)",
    ],
    [
        r"$\overrightarrow{AS} = \begin{pmatrix}4\\4\\6\end{pmatrix}$, also "
        r"$\left|\overrightarrow{AS}\right| = \sqrt{4^2 + 4^2 + 6^2} = \sqrt{68} = "
        r"2\sqrt{17} \approx 8{,}25$ m. Für die übrigen Seitenkanten gilt "
        r"$\overrightarrow{BS} = \begin{pmatrix}-4\\4\\6\end{pmatrix}$, "
        r"$\overrightarrow{CS} = \begin{pmatrix}-4\\-4\\6\end{pmatrix}$ und "
        r"$\overrightarrow{DS} = \begin{pmatrix}4\\-4\\6\end{pmatrix}$. In die Länge gehen "
        r"nur die Quadrate der Koordinaten ein, und die sind jedes Mal $16$, $16$ und $36$ "
        r"— alle vier Kanten sind $\sqrt{68}$ m lang, die Pyramide ist also gerade.",
        r"Die Ebene wird von $\overrightarrow{BC} = \begin{pmatrix}0\\8\\0\end{pmatrix}$ "
        r"und $\overrightarrow{BS} = \begin{pmatrix}-4\\4\\6\end{pmatrix}$ aufgespannt. "
        r"Ein Normalenvektor ist "
        r"$\vec{n} = \overrightarrow{BC} \times \overrightarrow{BS} = "
        r"\begin{pmatrix}48\\0\\32\end{pmatrix}$, gekürzt "
        r"$\begin{pmatrix}3\\0\\2\end{pmatrix}$ — das sind genau die Koeffizienten der "
        r"angegebenen Gleichung. Einsetzen der drei Punkte: "
        r"$B: 3 \cdot 8 + 2 \cdot 0 = 24$, $C: 3 \cdot 8 + 2 \cdot 0 = 24$ und "
        r"$S: 3 \cdot 4 + 2 \cdot 6 = 24$. Alle drei erfüllen die Gleichung, also "
        r"beschreibt sie die Ebene durch $B$, $C$ und $S$.",
        r"Die waagerechte Ebene hat den Normalenvektor "
        r"$\begin{pmatrix}0\\0\\1\end{pmatrix}$. Für den Schnittwinkel zweier Ebenen gilt "
        r"$\cos\alpha = \frac{\left|\vec{n_1} \circ \vec{n_2}\right|}"
        r"{\left|\vec{n_1}\right| \cdot \left|\vec{n_2}\right|} = "
        r"\frac{2}{\sqrt{13}} \approx 0{,}5547$, also $\alpha \approx 56{,}3^\circ$. Der "
        r"Aufriss zeigt dasselbe: Die Dachfläche steigt auf $4$ m waagerechter Strecke um "
        r"$6$ m, und aus $\tan\alpha = 1{,}5$ folgt derselbe Winkel.",
        r"Die Ebene in Hesse'scher Normalenform, mit "
        r"$\left|\vec{n}\right| = \sqrt{3^2 + 0^2 + 2^2} = \sqrt{13}$: "
        r"$d = \frac{\left|3 \cdot 4 + 2 \cdot 0 - 24\right|}{\sqrt{13}} = "
        r"\frac{12}{\sqrt{13}} \approx 3{,}33$ m. Der Punkt $M$ liegt also gut drei Meter "
        r"unterhalb der Dachfläche — deutlich weniger als die Höhe $6$ m der Pyramide, "
        r"denn gemessen wird senkrecht zum Dach.",
    ],
    falle=r"Der Neigungswinkel der **Fläche** ist nicht der Neigungswinkel der **Kante**. "
          r"Für die Seitenkante $\overline{BS}$ gilt "
          r"$\sin\beta = \frac{6}{\sqrt{68}} \approx 0{,}728$, also "
          r"$\beta \approx 46{,}7^\circ$. Wer in Teil c) mit einer Seitenkante statt mit "
          r"dem Normalenvektor rechnet, liegt fast zehn Grad daneben.",
    figs=[(fig_pyramide(),
           "Die Pyramide im Koordinatensystem; die verdeckten Kanten sind gestrichelt. "
           "Orange die Dachfläche BCS.")],
    solfigs=[(fig_aufriss(),
              "Zu c): der senkrechte Schnitt durch die Pyramide in der Ebene y = 4. Die "
              "Zeichnung ist längentreu, der eingezeichnete Winkel ist der gesuchte.")],
)

s.task(
    "Retouren im Versandhandel", 3,
    r"**Pflichtaufgabe 3 · Stochastik (15 BE).** Ein Versandhändler für Sportbekleidung "
    r"wertet seine Bestellungen aus. $60\,\%$ aller Bestellungen werden über die App "
    r"aufgegeben (Ereignis $E$), $25\,\%$ aller Bestellungen werden zurückgeschickt "
    r"(Ereignis $R$). Auf $18\,\%$ aller Bestellungen trifft beides zu.",
    [
        r"Übertragen Sie die Vierfeldertafel in Ihre Arbeit und vervollständigen Sie sie. "
        r"Berechnen Sie anschließend die Wahrscheinlichkeit dafür, dass eine über die App "
        r"aufgegebene Bestellung zurückgeschickt wird. (4 BE)",
        r"Untersuchen Sie, ob die Ereignisse $E$ und $R$ stochastisch unabhängig sind. "
        r"(3 BE)",
        r"Aus dem gesamten Bestellaufkommen werden zufällig $20$ Bestellungen ausgewählt. "
        r"Berechnen Sie die Wahrscheinlichkeit dafür, dass genau $5$ von ihnen "
        r"zurückgeschickt werden, sowie die Wahrscheinlichkeit dafür, dass es höchstens "
        r"$3$ sind. (4 BE)",
        r"Formulieren Sie ein Ereignis, dessen Wahrscheinlichkeit sich mit dem Term "
        r"$1 - 0{,}75^{20} - 20 \cdot 0{,}25 \cdot 0{,}75^{19}$ berechnen lässt, und geben "
        r"Sie den Wert dieses Terms an. (4 BE)",
    ],
    [
        r"Aus $P(E) = 0{,}6$ und $P(E \cap R) = 0{,}18$ folgt "
        r"$P(E \cap \overline{R}) = 0{,}42$; aus $P(R) = 0{,}25$ folgt "
        r"$P(\overline{E} \cap R) = 0{,}07$, und schließlich ist "
        r"$P(\overline{E} \cap \overline{R}) = 0{,}33$ sowie "
        r"$P(\overline{E}) = 0{,}4$ und $P(\overline{R}) = 0{,}75$. Gefragt ist die "
        r"bedingte Wahrscheinlichkeit "
        r"$P_E(R) = \frac{P(E \cap R)}{P(E)} = \frac{0{,}18}{0{,}6} = 0{,}3$: Von den "
        r"App-Bestellungen gehen $30\,\%$ zurück.",
        r"Unabhängigkeit hieße $P(E \cap R) = P(E) \cdot P(R)$. Hier ist "
        r"$P(E) \cdot P(R) = 0{,}6 \cdot 0{,}25 = 0{,}15$, tatsächlich aber "
        r"$P(E \cap R) = 0{,}18$. Wegen $0{,}18 \neq 0{,}15$ sind die Ereignisse "
        r"**nicht unabhängig** — über die App wird häufiger zurückgeschickt als im "
        r"Durchschnitt ($30\,\%$ statt $25\,\%$).",
        r"Die Anzahl $X$ der zurückgeschickten Bestellungen ist binomialverteilt mit "
        r"$n = 20$ und $p = 0{,}25$. Damit ist "
        r"$P(X = 5) = \binom{20}{5} \cdot 0{,}25^5 \cdot 0{,}75^{15} \approx 0{,}202$ und "
        r"$P(X \leq 3) = \sum_{k=0}^{3} \binom{20}{k} \cdot 0{,}25^k \cdot 0{,}75^{20-k} "
        r"\approx 0{,}225$.",
        r"Der Term hat die Bauart $1 - P(X = 0) - P(X = 1)$, denn "
        r"$0{,}75^{20} = P(X = 0)$ und "
        r"$20 \cdot 0{,}25 \cdot 0{,}75^{19} = P(X = 1)$. Er beschreibt also das Ereignis "
        r"**„Mindestens zwei der 20 ausgewählten Bestellungen werden "
        r"zurückgeschickt.“** Sein Wert ist "
        r"$1 - 0{,}0032 - 0{,}0211 \approx 0{,}976$.",
    ],
    falle=r"Die $18\,\%$ sind **nicht** die Antwort auf Teil a). Sie beziehen sich auf "
          r"**alle** Bestellungen; gefragt ist aber nur nach den App-Bestellungen. Deshalb "
          r"wird durch $P(E) = 0{,}6$ geteilt und nicht durch $1$.",
    figs=[(fig_tafel(),
           "Die Vierfeldertafel mit den drei gegebenen Werten. E steht für „über die App "
           "bestellt“, R für „zurückgeschickt“.")],
    solfigs=[(fig_tafel_voll(), "Zu a): die vollständig ausgefüllte Vierfeldertafel."),
             (fig_binomial(),
              "Zu c): die Binomialverteilung für n = 20 und p = 0,25. Grün die vier "
              "Balken für höchstens 3 Retouren, rot der Balken für genau 5.")],
)


# ------------------------------------------------------------------ verify ---
def be(task):
    """Sum of the Bewertungseinheiten written into the parts of one task."""
    return sum(int(m) for m in re.findall(r"\((\d+) BE\)", " ".join(task["parts"])))


def check():
    """Every number in the solutions, recomputed."""
    # --- Bewertungseinheiten: 25 + 15 + 15, and the totals named in the intros
    assert be(s.tasks[0]) == 25, be(s.tasks[0])
    assert be(s.tasks[1]) == 15, be(s.tasks[1])
    assert be(s.tasks[2]) == 15, be(s.tasks[2])
    for t, total in zip(s.tasks, (25, 15, 15)):
        assert "(%d BE)" % total in t["intro"], t["title"]
    assert sum(be(t) for t in s.tasks) == 55

    # --- Aufgabe 1 ------------------------------------------------------------
    assert f(1) == 0
    # Polynomdivision: (x^3-3x^2-9x+11) : (x-1) = x^2-2x-11
    for x in (-3, -1, 0, 2, 4, 7):
        assert abs(f(x) - (x - 1) * (x ** 2 - 2 * x - 11)) < 1e-12
    for z in (ZERO_L, ZERO_R):
        assert abs(f(z)) < 1e-9
    assert abs(ZERO_L - (-2.4641)) < 1e-4 and abs(ZERO_R - 4.4641) < 1e-4
    assert df(-1) == 0 and df(3) == 0
    for x in (-4, -2, 0, 2, 4, 5):                     # f' = 3(x+1)(x-3)
        assert df(x) == 3 * (x + 1) * (x - 3)
    assert f(-1) == 16 and ddf(-1) == -12 < 0
    assert f(3) == -16 and ddf(3) == 12 > 0
    assert ddf(1) == 0 and f(1) == 0                   # Wendepunkt W(1|0)
    assert ddf(0.9) < 0 < ddf(1.1)                     # Vorzeichenwechsel
    assert df(1) == -12                                # Anstieg der Wendetangente
    for x in (-2.0, 0.0, 0.5, 2.0, 4.5):               # f(1+u) = u^3 - 12u
        assert abs(f(1 + x) - (x ** 3 - 12 * x)) < 1e-9
    assert abs(F(1) - F(0) - 5.75) < 1e-12
    assert abs(F(2) - F(1) + 5.75) < 1e-12
    assert abs(F(2) - F(0)) < 1e-12                    # das Integral ueber [0;2] ist null
    assert abs((F(1) - F(0)) + abs(F(2) - F(1)) - 11.5) < 1e-12
    assert all(f(k / 100.0) > 0 for k in range(0, 100))        # f > 0 auf (0;1)
    assert all(f(k / 100.0) < 0 for k in range(101, 400))      # f < 0 auf (1;4)
    assert abs(30 + (F(1) - F(0)) - 35.75) < 1e-12
    assert min(f(k / 100.0) for k in range(0, 401)) == f(3.0) == -16
    assert abs(F(4) - F(0) + 28) < 1e-12 and abs(30 + F(4) - F(0) - 2) < 1e-12

    # --- Aufgabe 2 ------------------------------------------------------------
    for q in (PA, PB, PC, PD):
        assert abs(norm(sub(PS, q)) - sqrt(68)) < 1e-12
    assert abs(sqrt(68) - 2 * sqrt(17)) < 1e-12 and abs(sqrt(68) - 8.2462) < 1e-4
    BC, BS = sub(PC, PB), sub(PS, PB)
    assert BC == (0, 8, 0) and BS == (-4, 4, 6)
    assert cross(BC, BS) == (48, 0, 32)
    assert cross(BC, BS) == tuple(16 * c for c in NORM)      # gekuerzter Normalenvektor
    for q in (PB, PC, PS):                             # every point fulfils 3x + 2z = 24
        assert dot(NORM, q) == 24
    assert abs(norm(NORM) - sqrt(13)) < 1e-12
    alpha = degrees(acos(abs(dot(NORM, (0, 0, 1))) / (norm(NORM) * 1)))
    assert abs(alpha - 56.31) < 0.01
    assert abs(2 / sqrt(13) - 0.5547) < 1e-4
    assert abs(degrees(math.atan(1.5)) - alpha) < 1e-9          # Aufriss: 6 auf 4
    dist = abs(dot(NORM, PM) - 24) / norm(NORM)
    assert abs(dist - 12 / sqrt(13)) < 1e-12 and abs(dist - 3.33) < 0.005
    beta = degrees(asin(6 / norm(BS)))                          # Kantenneigung, die Falle
    assert abs(beta - 46.69) < 0.01 and abs(6 / sqrt(68) - 0.728) < 5e-4
    assert alpha - beta > 9.6

    # --- Aufgabe 3 ------------------------------------------------------------
    assert P_E == Fr(3, 5) and P_R == Fr(1, 4) and P_ER == Fr(9, 50)
    assert P_E - P_ER == Fr(21, 50) == Fr(42, 100)              # E und nicht R
    assert P_R - P_ER == Fr(7, 100)                             # nicht E und R
    assert 1 - P_E - P_R + P_ER == Fr(33, 100)                  # weder noch
    assert 1 - P_E == Fr(2, 5) and 1 - P_R == Fr(3, 4)
    assert (P_E - P_ER) + (P_R - P_ER) + P_ER + (1 - P_E - P_R + P_ER) == 1
    assert P_ER / P_E == Fr(3, 10)
    assert P_E * P_R == Fr(3, 20) and P_E * P_R != P_ER         # also abhaengig
    assert abs(float(P5) - 0.2023) < 5e-5
    assert abs(float(P_MAX3) - 0.2252) < 5e-5
    assert binom(N_BIN, P_BIN, 0) == Fr(3, 4) ** 20
    assert binom(N_BIN, P_BIN, 1) == 20 * Fr(1, 4) * Fr(3, 4) ** 19
    assert abs(float(binom(N_BIN, P_BIN, 0)) - 0.0032) < 5e-5
    assert abs(float(binom(N_BIN, P_BIN, 1)) - 0.0211) < 5e-5
    assert abs(float(P_MIN2) - 0.9757) < 5e-5
    assert abs(float(P_MIN2) - 0.976) < 5e-4
    assert P_MIN2 == 1 - sum(binom(N_BIN, P_BIN, k) for k in (0, 1))

    # --- figures agree with the numbers ---------------------------------------
    pts = {"A": PA, "B": PB, "C": PC, "D": PD, "S": PS, "M": PM}
    sd = S.Solid(w=540, h=400, scale=30, ox=175, oy=246)
    screen = {k: sd.P(v) for k, v in pts.items()}
    keys = sorted(screen)
    worst = min(math.hypot(screen[a][0] - screen[b][0], screen[a][1] - screen[b][1])
                for i, a in enumerate(keys) for b in keys[i + 1:])
    assert worst > 40, "two vertices collide in the oblique projection: %.1f px" % worst
    for x, y in screen.values():                       # everything inside the canvas
        assert 10 < x < 530 and 10 < y < 390, (x, y)


s.verify(check)
s.save()
