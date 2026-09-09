#!/usr/bin/env python3
"""Abitur-Training BGY - Analysis im Leistungskurs (Pflichtaufgabe 1).

    python3 tools/aufgaben/abi/analysis_lk.py

The LK types of the Saxon originals 2022-2025 that the Grundkurs sheet does not carry:
a family of curves with the locus of its maxima, a trigonometric function whose area over
one full period follows from point symmetry instead of an antiderivative, and two
processes compared through their difference and through their derivatives. Context,
numbers, wording and every figure are our own - the originals are not reproduced.
"""
import os
import sys
from math import cos, e, exp, log, pi, sin

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# --------------------------------------------------------------- functions ---
# Aufgabe 1: family f_a(x) = x * e^(1 - a x), a > 0.
#   zero at x = 0, maximum at H_a(1/a | 1/a), inflection at W_a(2/a | 2/(a e))
def fa(x, a):
    return x * exp(1 - a * x)


def dfa(x, a):
    return exp(1 - a * x) * (1 - a * x)


def ddfa(x, a):
    return a * exp(1 - a * x) * (a * x - 2)


SCHAR = (0.5, 1.0, 2.0)                     # the three curves drawn in the figures

# Aufgabe 2: w(x) = -A * sin(x / B) + A, smallest period 2 pi B = 4 pi
AW, BW = 3.0, 2.0
PER = 2 * pi * BW                           # 4 pi


def w(x):
    return -AW * sin(x / BW) + AW


def dw(x):
    return -(AW / BW) * cos(x / BW)


def ddw(x):
    return (AW / BW ** 2) * sin(x / BW)


# Aufgabe 3: two bacterial cultures, same start, different decay constants
N0, KA, KB = 400.0, 0.2, 0.4
TSTERN = log(2) / KA                        # 5 ln 2, largest difference


def na(t):
    return N0 * exp(-KA * t)


def nb(t):
    return N0 * exp(-KB * t)


def dna(t):
    return -KA * N0 * exp(-KA * t)


def dnb(t):
    return -KB * N0 * exp(-KB * t)


def gap(t):
    return na(t) - nb(t)


# ------------------------------------------------------------------ helper ---
def legend(p, rows, x1, x2, ys, size=12):
    """Small legend inside the plot: one colour swatch plus a label per row.

    svgfig has no legend, so it is built here from seg() and text(); the halo keeps the
    label readable where a grid line runs behind it."""
    for (color, label, dash), y in zip(rows, ys):
        p.seg((x1, y), (x2, y), color, 2.4, dash=dash)
        p.text(p.X(x2) + 8, p.Y(y) + 4, label, size, S.BODY, "start", halo=S.PAPER)


def gapmark(p, u, v1, v2, color=S.INK):
    """Vertical measure at world x = u with a short cap at each end."""
    p.seg((u, v1), (u, v2), color, 2.0)
    for v in (v1, v2):
        p.line(p.X(u) - 5, p.Y(v), p.X(u) + 5, p.Y(v), color, 1.6)


# ----------------------------------------------------------------- figures ---
def fig_schar():
    """Three members of the family - the peaks wander, the shape stays."""
    p = S.Plot((-0.6, 5.4), (-0.45, 3.0), w=540, h=360, pad=(46, 26, 20, 34))
    p.grid(0.5, 0.5)
    p.axes(1, 1, xlabel="x", ylabel="y")
    for a, col in zip(SCHAR, (S.RED, S.GREEN, S.BODY)):
        p.curve(lambda x, a=a: fa(x, a), -0.2, 5.35, col, 2.2)
    for a, col in zip(SCHAR, (S.RED, S.GREEN, S.BODY)):
        p.point(1.0 / a, 1.0 / a, None, color=col, size=3.4)
    legend(p, [(S.RED, "a = 0,5", None), (S.GREEN, "a = 1", None), (S.BODY, "a = 2", None)],
           3.0, 3.45, (2.85, 2.55, 2.25))
    return p.svg("Drei Kurven der Schar mit ihren Hochpunkten, die Gipfel wandern mit "
                 "wachsendem a nach links und nach unten")


def fig_ortskurven():
    """Solution figure: both loci - the maxima on y = x, the inflections on y = x/e."""
    p = S.Plot((-0.6, 5.4), (-0.45, 3.0), w=540, h=360, pad=(46, 26, 20, 34))
    p.grid(0.5, 0.5)
    p.axes(1, 1, xlabel="x", ylabel="y")
    p.seg((0, 0), (2.6, 2.6), S.ORANGE, 2.2, dash="7 4")
    p.seg((0, 0), (5.35, 5.35 / e), S.MUTED, 1.8, dash="4 4")
    for a in SCHAR:
        p.curve(lambda x, a=a: fa(x, a), -0.2, 5.35, S.BODY, 1.5)
    for a in SCHAR:
        p.point(1.0 / a, 1.0 / a, None, color=S.RED, size=3.6)
        p.point(2.0 / a, 2.0 / (a * e), None, color=S.GREEN, size=3.6)
    legend(p, [(S.ORANGE, "Hochpunkte: y = x", "7 4"),
               (S.MUTED, "Wendepunkte: y = 0,37 x", "4 4")],
           3.0, 3.45, (2.85, 2.55))
    return p.svg("Dieselben drei Kurven mit den Hochpunkten auf der Winkelhalbierenden "
                 "und den Wendepunkten auf einer flacheren Geraden durch den Ursprung")


def fig_welle():
    """One full period, with the two pieces that the symmetry swaps."""
    p = S.Plot((-1.2, 14.6), (-1.2, 7.4), w=560, h=340, pad=(46, 24, 24, 34))
    p.grid(1, 1)
    p.axes(2, 1, xlabel="x", ylabel="y")
    p.area_between(lambda x: AW, w, 0, 2 * pi, S.RED, 0.20)
    p.area_between(w, lambda x: AW, 2 * pi, PER, S.GREEN, 0.32)
    p.seg((-1.2, AW), (14.6, AW), S.MUTED, 1.4, dash="6 4")
    p.seg((PER, 0), (PER, 6.6), S.MUTED, 1.0, dash="3 3")
    p.curve(w, -1.15, 14.55, S.INK, 2.3)
    p.point(pi, 0, "T", "above-left")
    p.point(3 * pi, 6, "H", "above", color=S.RED)
    p.point(2 * pi, AW, "W", "above-left", color=S.GREEN)
    p.brace(0, PER, 6.95, "eine volle Periode", S.MUTED)
    p.text(p.X(pi), p.Y(1.45), "fehlt", 12.5, S.BODY, "middle", halo=S.PAPER)
    p.text(p.X(3 * pi), p.Y(4.6), "kommt dazu", 12.5, S.BODY, "middle", halo=S.PAPER)
    p.text(p.X(14.0), p.Y(3) - 9, "Mittellinie y = 3", 12, S.MUTED, "end", halo=S.PAPER)
    return p.svg("Der Graph der Wellenfunktion ueber einer vollen Periode, links fehlt "
                 "ein Stueck unter der Mittellinie, rechts kommt ein gleich grosses "
                 "Stueck darueber hinzu")


def fig_rechteck():
    """Solution figure: the area equals the rectangle over the full period."""
    p = S.Plot((-1.2, 14.6), (-1.2, 7.4), w=560, h=340, pad=(46, 24, 24, 34))
    p.grid(1, 1)
    p.axes(2, 1, xlabel="x", ylabel="y")
    p.area(w, 0, PER, S.ORANGE, 0.30)
    p.area_between(lambda x: AW, w, 0, 2 * pi, S.RED, 0.22)
    p.area_between(w, lambda x: AW, 2 * pi, PER, S.GREEN, 0.34)
    p.seg((0, AW), (PER, AW), S.INK, 1.5, dash="6 4")
    p.seg((PER, 0), (PER, AW), S.INK, 1.5, dash="6 4")
    p.curve(w, -1.15, 14.55, S.INK, 2.3)
    p.arrow(p.X(pi), p.Y(1.5), p.X(3 * pi), p.Y(4.5), S.RED, 1.6)
    p.point(2 * pi, AW, "W", "above-left", color=S.GREEN)
    p.text(p.X(0.35), p.Y(6.5), "Rechteck: 12,57 mal 3 = 37,7", 12.5, S.INK, "start",
           halo=S.PAPER)
    p.text(p.X(2 * pi) + 10, p.Y(3) + 24, "Drehung um 180 Grad um W", 12, S.RED, "start",
           halo=S.PAPER)
    return p.svg("Dieselbe Flaeche, dazu das Rechteck der Breite einer Periode und der "
                 "Hoehe drei; ein Pfeil durch den Wendepunkt zeigt die Drehung, die das "
                 "fehlende Stueck auf das hinzukommende abbildet")


def fig_kulturen():
    """Both cultures in one system, the largest gap marked where the solution puts it."""
    p = S.Plot((-1.0, 14.0), (-45, 500), w=540, h=350, pad=(52, 26, 22, 34))
    p.grid(1, 50)
    p.axes(2, 100, xlabel="t", ylabel="N")
    p.curve(na, 0, 13.9, S.RED, 2.3)
    p.curve(nb, 0, 13.9, S.GREEN, 2.3)
    gapmark(p, TSTERN, nb(TSTERN), na(TSTERN))
    p.seg((TSTERN, 0), (TSTERN, nb(TSTERN)), S.MUTED, 1.0, dash="3 3")
    p.point(0, N0, None, color=S.INK, size=3.4)
    p.text(p.X(TSTERN) + 12, p.Y(255), "größter Unterschied: 100", 12, S.INK, "start",
           halo=S.PAPER)
    legend(p, [(S.RED, "Kultur A", None), (S.GREEN, "Kultur B", None)],
           8.6, 9.6, (460, 415))
    p.text(p.X(13.9), p.Y(345), "t in Stunden, N in Millionen", 12, S.MUTED, "end")
    return p.svg("Beide Zerfallskurven starten bei vierhundert Millionen; nach gut drei "
                 "Stunden ist der senkrechte Abstand zwischen ihnen am groessten")


def fig_raten():
    """Solution figure: the two rate graphs cross exactly at the largest gap."""
    # x stops at 7,8: further right the flat green branch would run into the tick labels
    p = S.Plot((-0.8, 7.8), (-175, 60), w=540, h=330, pad=(56, 26, 22, 34))
    p.grid(1, 25)
    p.axes(2, 50, xlabel="t", ylabel="N'")
    p.seg((TSTERN, -175), (TSTERN, 0), S.MUTED, 1.0, dash="3 3")
    p.curve(dna, 0, 7.7, S.RED, 2.3)
    p.curve(dnb, 0, 7.7, S.GREEN, 2.3)
    p.point(TSTERN, dna(TSTERN), None, color=S.INK, size=3.6)
    p.arrow(p.X(4.0) - 10, p.Y(-118), p.X(TSTERN) + 8, p.Y(-46), S.MUTED, 1.3)
    p.text(p.X(4.0), p.Y(-120), "hier sind beide Raten gleich:", 12, S.BODY, "start",
           halo=S.PAPER)
    p.text(p.X(4.0), p.Y(-142), "je 40 Millionen pro Stunde", 12, S.BODY, "start",
           halo=S.PAPER)
    legend(p, [(S.RED, "Rate der Kultur A", None), (S.GREEN, "Rate der Kultur B", None)],
           4.6, 5.2, (50, 22))
    return p.svg("Die Graphen der beiden Aenderungsraten liegen unter der t-Achse und "
                 "schneiden einander nach gut drei Stunden bei minus vierzig")


# ------------------------------------------------------------------- sheet ---
s = Sheet("abitur-bgy-analysis-lk", "Analysis — Leistungskurs",
          kind="Abitur-Training",
          suffix="",
          klasse="Berufliches Gymnasium",
          sub="Berufliches Gymnasium · Pflichtaufgabe 1 · Leistungskurs · "
              "drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Abitur-Training Mathematik BGY Leistungskurs, Analysis: Funktionenschar "
               "mit Ortskurve der Hochpunkte, trigonometrische Funktion mit "
               "Symmetrieargument statt Integral und zwei Bakterienkulturen im Vergleich, "
               "mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/abitur.html", "Zur Übersicht"))

s.task(
    "Eine Schar mit wandernden Gipfeln", 1,
    r"Für jedes $a > 0$ ist die in $\mathbb{R}$ definierte Funktion $f_a$ mit "
    r"$f_a(x) = x \cdot e^{1 - a \cdot x}$ gegeben. Die Abbildung zeigt die Graphen der "
    r"drei Scharkurven zu $a = 0{,}5$, $a = 1$ und $a = 2$.",
    [
        r"Berechnen Sie die Nullstellen von $f_a$ und untersuchen Sie das Verhalten von "
        r"$f_a$ für $x \to \infty$.",
        r"Bestimmen Sie in Abhängigkeit von $a$ die Koordinaten des Hochpunktes $H_a$ und "
        r"weisen Sie nach, dass dort tatsächlich ein Maximum vorliegt.",
        r"Zeigen Sie, dass alle Hochpunkte $H_a$ auf der Geraden mit der Gleichung "
        r"$y = x$ liegen, und geben Sie an, welcher Teil dieser Geraden dabei "
        r"durchlaufen wird.",
        r"Bestimmen Sie in Abhängigkeit von $a$ die Koordinaten des Wendepunktes $W_a$ und "
        r"zeigen Sie, dass auch alle Wendepunkte auf einer Geraden durch den Ursprung "
        r"liegen.",
    ],
    [
        r"Ein Produkt ist genau dann null, wenn ein Faktor null ist. Der Faktor "
        r"$e^{1 - a \cdot x}$ ist für jedes $x$ **positiv**, also bleibt nur $x = 0$: "
        r"Jede Kurve der Schar geht durch den Ursprung, und zwar nur dort durch die "
        r"$x$-Achse. Für das Grenzverhalten schreibt man "
        r"$f_a(x) = \dfrac{x}{e^{a \cdot x - 1}}$. Der Nenner wächst für $a > 0$ "
        r"schneller als jede Potenz von $x$, also gilt $f_a(x) \to 0$ für "
        r"$x \to \infty$. Wegen $f_a(x) > 0$ für $x > 0$ nähert sich der Graph der "
        r"$x$-Achse von oben.",
        r"Mit der Produktregel ist "
        r"$f_a'(x) = 1 \cdot e^{1 - a x} + x \cdot (-a) \cdot e^{1 - a x} = "
        r"e^{1 - a x} \cdot (1 - a \cdot x)$. Wieder ist der e-Term nie null, also "
        r"$f_a'(x) = 0$ genau für $x = \dfrac{1}{a}$. Nochmaliges Ableiten liefert "
        r"$f_a''(x) = a \cdot e^{1 - a x} \cdot (a \cdot x - 2)$, und an der Stelle "
        r"$\dfrac{1}{a}$ ist $f_a''\!\left(\dfrac{1}{a}\right) = a \cdot e^{0} \cdot "
        r"(1 - 2) = -a < 0$, denn $a$ ist positiv. Dort liegt also ein Maximum mit dem "
        r"Wert $f_a\!\left(\dfrac{1}{a}\right) = \dfrac{1}{a} \cdot e^{1 - 1} = "
        r"\dfrac{1}{a}$, kurz $H_a\!\left(\dfrac{1}{a} \mid \dfrac{1}{a}\right)$.",
        r"Der Hochpunkt hat die Koordinaten $x_H = \dfrac{1}{a}$ und "
        r"$y_H = \dfrac{1}{a}$; beide Koordinaten stimmen für jedes $a$ überein, also "
        r"erfüllt jeder Hochpunkt die Gleichung $y = x$. Durchlaufen wird dabei nicht "
        r"die ganze Gerade: Weil $a$ alle positiven Zahlen durchläuft, nimmt "
        r"$\dfrac{1}{a}$ ebenfalls **jeden positiven Wert genau einmal** an. Die "
        r"Ortskurve ist damit die Halbgerade $y = x$ mit $x > 0$, der Ursprung selbst "
        r"gehört nicht dazu.",
        r"Aus $f_a''(x) = a \cdot e^{1 - a x} \cdot (a \cdot x - 2) = 0$ folgt wegen "
        r"$a > 0$ und $e^{1 - a x} > 0$ die einzige Lösung $x = \dfrac{2}{a}$. Der "
        r"Faktor $a \cdot x - 2$ wechselt dort das Vorzeichen von minus nach plus, also "
        r"liegt ein Wendepunkt vor. Sein Funktionswert ist "
        r"$f_a\!\left(\dfrac{2}{a}\right) = \dfrac{2}{a} \cdot e^{-1} = "
        r"\dfrac{2}{a \cdot e}$, also "
        r"$W_a\!\left(\dfrac{2}{a} \mid \dfrac{2}{a \cdot e}\right)$. Setzt man "
        r"$x = \dfrac{2}{a}$, so ist $y = \dfrac{2}{a \cdot e} = \dfrac{x}{e}$: Alle "
        r"Wendepunkte liegen auf der Ursprungsgeraden $y = \dfrac{1}{e} \cdot x$ mit dem "
        r"Anstieg $\dfrac{1}{e} \approx 0{,}368$.",
    ],
    falle=r"Beim Ableiten ist $a$ eine **feste Zahl**, abgeleitet wird nach $x$ — "
          r"$e^{1 - a x}$ liefert also den Faktor $-a$, nicht $-x$. Und wer nur eine "
          r"einzelne Kurve untersucht, etwa die zu $a = 1$, hat über die Schar nichts "
          r"gezeigt: Gefragt sind Aussagen, die für **jedes** $a > 0$ gelten.",
    figs=[(fig_schar(),
           "Drei Kurven der Schar. Je größer a, desto weiter links und desto niedriger "
           "liegt der Gipfel.")],
    solfigs=[(fig_ortskurven(),
              "Zu c) und d): Die Hochpunkte (rot) liegen auf der Winkelhalbierenden "
              "y = x, die Wendepunkte (grün) auf der flacheren Ursprungsgeraden mit dem "
              "Anstieg 0,368.")],
)

s.task(
    "Eine volle Periode, ohne zu integrieren", 2,
    r"Gegeben ist die in $\mathbb{R}$ definierte Funktion $w$ mit "
    r"$w(x) = -3 \cdot \sin\!\left(\frac{x}{2}\right) + 3$. Die Abbildung zeigt ihren "
    r"Graphen; die waagerechte Gerade mit der Gleichung $y = 3$ heißt im Folgenden "
    r"Mittellinie.",
    [
        r"Begründen Sie, dass $w$ die kleinste Periode $p = 4\pi$ besitzt, und geben Sie "
        r"den Wertebereich von $w$ an.",
        r"Bestimmen Sie die Koordinaten des Hoch- und des Tiefpunktes des Graphen von $w$ "
        r"im Intervall $0 \leq x \leq 4\pi$.",
        r"Bestimmen Sie die Koordinaten der Wendepunkte in diesem Intervall und weisen "
        r"Sie nach, dass der Graph punktsymmetrisch zum Wendepunkt $W(2\pi \mid 3)$ ist.",
        r"Der Graph von $w$ schließt über einer vollen Periode mit der $x$-Achse eine "
        r"Fläche ein. Bestimmen Sie deren Inhalt **ohne Integralrechnung** und begründen "
        r"Sie Ihren Weg.",
    ],
    [
        r"Die Sinusfunktion wiederholt sich, sobald ihr Argument um $2\pi$ wächst. Hier "
        r"ist das Argument $\frac{x}{2}$, es wächst also nur halb so schnell wie $x$: "
        r"$w(x + 4\pi) = -3 \cdot \sin\!\left(\frac{x}{2} + 2\pi\right) + 3 = w(x)$. "
        r"Kleiner kann die Periode nicht sein, denn den Wert $0$ nimmt $w$ nur an, wenn "
        r"$\sin\!\left(\frac{x}{2}\right) = 1$ ist, und das passiert nur an den Stellen "
        r"$x = \pi + 4 k \pi$ — je Periode also genau einmal. Aus "
        r"$-1 \leq \sin\!\left(\frac{x}{2}\right) \leq 1$ folgt außerdem "
        r"$-3 \leq -3 \cdot \sin\!\left(\frac{x}{2}\right) \leq 3$, der Wertebereich ist "
        r"$0 \leq w(x) \leq 6$.",
        r"Mit der Kettenregel ist "
        r"$w'(x) = -3 \cdot \cos\!\left(\frac{x}{2}\right) \cdot \frac{1}{2} = "
        r"-\frac{3}{2} \cdot \cos\!\left(\frac{x}{2}\right)$. Der Kosinus ist null für "
        r"$\frac{x}{2} = \frac{\pi}{2} + k\pi$, also für $x = \pi + 2k\pi$; im "
        r"Intervall sind das $x = \pi$ und $x = 3\pi$. Mit "
        r"$w''(x) = \frac{3}{4} \cdot \sin\!\left(\frac{x}{2}\right)$ ist "
        r"$w''(\pi) = \frac{3}{4} > 0$ und $w''(3\pi) = -\frac{3}{4} < 0$. Also "
        r"**Tiefpunkt** $T(\pi \mid 0)$ und **Hochpunkt** $H(3\pi \mid 6)$.",
        r"$w''(x) = 0$ verlangt $\sin\!\left(\frac{x}{2}\right) = 0$, also "
        r"$\frac{x}{2} = k\pi$ und damit $x = 2k\pi$; im Intervall sind das $x = 0$, "
        r"$x = 2\pi$ und $x = 4\pi$. An jeder dieser Stellen wechselt $w''$ das "
        r"Vorzeichen, und der Funktionswert ist jeweils $3$: die Wendepunkte "
        r"$(0 \mid 3)$, $W(2\pi \mid 3)$ und $(4\pi \mid 3)$. Für die Punktsymmetrie zu "
        r"$W$ rechnet man mit beliebigem $u$: "
        r"$w(2\pi - u) = -3 \cdot \sin\!\left(\pi - \frac{u}{2}\right) + 3 = "
        r"-3 \cdot \sin\!\left(\frac{u}{2}\right) + 3$ und "
        r"$w(2\pi + u) = -3 \cdot \sin\!\left(\pi + \frac{u}{2}\right) + 3 = "
        r"3 \cdot \sin\!\left(\frac{u}{2}\right) + 3$. Die Summe ist "
        r"$w(2\pi - u) + w(2\pi + u) = 6 = 2 \cdot 3$ — genau die Bedingung dafür, dass "
        r"$W$ Symmetriezentrum des Graphen ist.",
        r"Wegen $w(x) \geq 0$ liegt der Graph nirgends unter der $x$-Achse; der "
        r"Flächeninhalt über einer Periode ist deshalb der Inhalt des Streifens zwischen "
        r"Graph und Achse. Vergleicht man diesen Streifen mit dem **Rechteck** über "
        r"$[0;\,4\pi]$ mit der Höhe $3$, so fehlt links das Stück zwischen Graph und "
        r"Mittellinie, rechts kommt ein Stück oberhalb der Mittellinie hinzu. Die "
        r"Punktspiegelung an $W$ aus Teil c) bildet das linke Stück genau auf das rechte "
        r"ab, beide sind also inhaltsgleich: Was fehlt, wird ersetzt. Damit ist "
        r"$A = 4\pi \cdot 3 = 12\pi \approx 37{,}7$ FE. Der Mittelwert der "
        r"Funktionswerte über einer Periode ist entsprechend "
        r"$\frac{12\pi}{4\pi} = 3$ — die Höhe der Mittellinie.",
    ],
    falle=r"Die kleinste Periode von $\sin\!\left(\frac{x}{b}\right)$ ist "
          r"$2\pi \cdot b$, **nicht** $\frac{2\pi}{b}$: Das Argument wächst langsamer "
          r"als $x$, die Welle wird also breiter statt schmaler. Wer hier mit $\pi$ statt "
          r"$4\pi$ rechnet, halbiert in d) die Fläche gleich mit.",
    figs=[(fig_welle(),
           "Der Graph von w über einer vollen Periode. Links fehlt gegenüber dem "
           "Rechteck der Höhe 3 ein Stück, rechts kommt eines dazu.")],
    solfigs=[(fig_rechteck(),
              "Zu d): Die Drehung um 180 Grad um den Wendepunkt W bildet das fehlende "
              "Stück auf das hinzukommende ab. Der gesuchte Inhalt ist deshalb genau der "
              "Rechteckinhalt 12,57 mal 3, also rund 37,7 Flächeneinheiten.")],
)

s.task(
    "Zwei Kulturen, ein Vorsprung", 3,
    r"In einem Labor werden zwei gleich große Bakterienkulturen mit zwei verschiedenen "
    r"Wirkstoffen behandelt. Zu Beginn enthält jede Kultur $400$ Millionen Bakterien. Für "
    r"$t \geq 0$ beschreiben $N_A(t) = 400 \cdot e^{-0{,}2 \cdot t}$ und "
    r"$N_B(t) = 400 \cdot e^{-0{,}4 \cdot t}$ die Anzahl der Bakterien in Millionen; dabei "
    r"ist $t$ die seit dem Behandlungsbeginn vergangene Zeit in Stunden.",
    [
        r"Berechnen Sie, um wie viele Millionen Bakterien sich die beiden Kulturen zwei "
        r"Stunden nach Behandlungsbeginn unterscheiden.",
        r"Bestimmen Sie den Zeitpunkt, zu dem der Unterschied zwischen beiden Kulturen am "
        r"größten ist, sowie diesen größten Unterschied. Weisen Sie nach, dass dort "
        r"wirklich ein Maximum vorliegt.",
        r"Die Graphen der beiden Ableitungsfunktionen $N_A'$ und $N_B'$ schneiden einander "
        r"genau an dieser Stelle. Deuten Sie diesen Schnittpunkt im Sachzusammenhang.",
        r"Beurteilen Sie die Aussage: „Zwölf Stunden nach Behandlungsbeginn ist in beiden "
        r"Kulturen ohnehin fast nichts mehr übrig — welcher Wirkstoff verwendet wurde, "
        r"spielt dann keine Rolle mehr.“",
    ],
    [
        r"$N_A(2) = 400 \cdot e^{-0{,}4} \approx 268{,}1$ und "
        r"$N_B(2) = 400 \cdot e^{-0{,}8} \approx 179{,}7$. Die Differenz beträgt "
        r"$d(2) = N_A(2) - N_B(2) \approx 88{,}4$, nach zwei Stunden also rund "
        r"**88 Millionen** Bakterien Unterschied.",
        r"Betrachtet wird die Differenzfunktion "
        r"$d(t) = 400 \cdot \left(e^{-0{,}2 t} - e^{-0{,}4 t}\right)$ mit "
        r"$d'(t) = 400 \cdot \left(-0{,}2 \cdot e^{-0{,}2 t} + 0{,}4 \cdot "
        r"e^{-0{,}4 t}\right)$. Aus $d'(t) = 0$ folgt "
        r"$0{,}4 \cdot e^{-0{,}4 t} = 0{,}2 \cdot e^{-0{,}2 t}$; Division durch "
        r"$0{,}2 \cdot e^{-0{,}4 t}$ ergibt $2 = e^{0{,}2 t}$ und damit "
        r"$t^{*} = \dfrac{\ln 2}{0{,}2} = 5 \cdot \ln 2 \approx 3{,}47$, also etwa "
        r"**3 Stunden und 28 Minuten**. Wegen $e^{-0{,}2 t^{*}} = \dfrac{1}{2}$ und "
        r"$e^{-0{,}4 t^{*}} = \dfrac{1}{4}$ ist "
        r"$d''(t^{*}) = 400 \cdot \left(0{,}04 \cdot \dfrac{1}{2} - 0{,}16 \cdot "
        r"\dfrac{1}{4}\right) = -8 < 0$: ein Maximum. Der größte Unterschied beträgt "
        r"$d(t^{*}) = 400 \cdot \left(\dfrac{1}{2} - \dfrac{1}{4}\right) = "
        r"\mathbf{100}$ Millionen — Kultur A enthält dann $200$, Kultur B $100$ "
        r"Millionen Bakterien.",
        r"Es ist $d'(t) = N_A'(t) - N_B'(t)$, und $d'(t^{*}) = 0$ bedeutet gerade "
        r"$N_A'(t^{*}) = N_B'(t^{*})$ — das ist der Schnittpunkt der beiden "
        r"Ableitungsgraphen. Dort schrumpfen **beide Kulturen gleich schnell**: "
        r"$N_A'(t^{*}) = -80 \cdot \dfrac{1}{2} = -40$ und "
        r"$N_B'(t^{*}) = -160 \cdot \dfrac{1}{4} = -40$, also je $40$ Millionen "
        r"Bakterien pro Stunde. Vorher fällt $N_B$ schneller, der Abstand wächst; "
        r"nachher fällt $N_A$ schneller, der Abstand schrumpft wieder. Der Schnittpunkt "
        r"der Ableitungsgraphen markiert also genau den Umschlagpunkt.",
        r"Die Aussage ist **nicht haltbar**. Zwar sind die absoluten Zahlen klein "
        r"geworden — $N_A(12) = 400 \cdot e^{-2{,}4} \approx 36{,}3$ und "
        r"$N_B(12) = 400 \cdot e^{-4{,}8} \approx 3{,}3$ Millionen —, doch der "
        r"Unterschied beträgt immer noch rund $33$ Millionen Bakterien, und relativ "
        r"gesehen enthält Kultur A das $e^{2{,}4} \approx 11$-fache von Kultur B. Für die "
        r"Behandlung zählt, wann eine Kultur unter eine vorgegebene Schranke fällt: Bis "
        r"auf $4$ Millionen, also $1\ \%$ des Anfangswertes, braucht Wirkstoff B "
        r"$t = \dfrac{\ln 100}{0{,}4} \approx 11{,}5$ Stunden, Wirkstoff A dagegen "
        r"$t = \dfrac{\ln 100}{0{,}2} \approx 23{,}0$ Stunden — doppelt so lange. Im "
        r"Modell wird ohnehin keine Kultur je vollständig leer, denn "
        r"$e^{-k \cdot t} > 0$ für jedes $t$.",
    ],
    falle=r"„Der Unterschied ist am größten“ heißt nicht „hier fällt eine Kurve am "
          r"steilsten“. Gesucht ist das Maximum der Differenz, also $d'(t) = 0$ und damit "
          r"$N_A'(t) = N_B'(t)$: Der Abstand wächst genau so lange, wie Kultur B "
          r"schneller schrumpft als Kultur A.",
    figs=[(fig_kulturen(),
           "Beide Kulturen starten bei 400 Millionen. Die senkrechte Strecke markiert "
           "den größten Abstand nach rund 3,5 Stunden.")],
    solfigs=[(fig_raten(),
              "Zu b) und c): Die Graphen der beiden Änderungsraten schneiden einander bei "
              "t = 3,47 im Wert −40. Vorher liegt die Rate von B tiefer, nachher die von "
              "A — genau dazwischen ist der Abstand der Kulturen am größten.")],
)


# ------------------------------------------------------------------ checks ---
def simpson(fn, a, b, n=4000):
    """Numeric integral - only used as a counter-check for the symmetry argument."""
    h = (b - a) / float(n)
    total = fn(a) + fn(b)
    for i in range(1, n):
        total += (4 if i % 2 else 2) * fn(a + i * h)
    return total * h / 3.0


def check():
    """Every number in the solutions, recomputed - the family for several values of a."""
    # --- Aufgabe 1: Funktionenschar ----------------------------------------
    for a in (0.25, 0.5, 0.8, 1.0, 1.5, 2.0, 3.0):
        assert abs(fa(0.0, a)) < 1e-12                       # only zero, for every a
        assert all(fa(k / 10.0, a) > 0 for k in range(1, 200))
        assert all(fa(-k / 10.0, a) < 0 for k in range(1, 30))
        for k in range(-20, 120):                            # derivative, symbolic form
            x = k / 10.0
            num = (fa(x + 1e-6, a) - fa(x - 1e-6, a)) / 2e-6
            assert abs(dfa(x, a) - num) < 1e-5
            num2 = (dfa(x + 1e-6, a) - dfa(x - 1e-6, a)) / 2e-6
            assert abs(ddfa(x, a) - num2) < 1e-5
        xh = 1.0 / a
        assert abs(dfa(xh, a)) < 1e-12                       # stationary
        assert abs(ddfa(xh, a) + a) < 1e-12                  # f''(1/a) = -a < 0
        assert abs(fa(xh, a) - 1.0 / a) < 1e-12              # H_a(1/a | 1/a)
        assert abs(fa(xh, a) - xh) < 1e-12                   # Ortskurve y = x
        assert xh > 0
        assert all(fa(k / 40.0, a) <= fa(xh, a) + 1e-12 for k in range(0, 400))
        assert dfa(xh - 0.1, a) > 0 > dfa(xh + 0.1, a)       # sign change of f'
        xw = 2.0 / a
        assert abs(ddfa(xw, a)) < 1e-12
        assert ddfa(xw - 0.1, a) < 0 < ddfa(xw + 0.1, a)     # inflection, sign change
        assert abs(fa(xw, a) - 2.0 / (a * e)) < 1e-12
        assert abs(fa(xw, a) - xw / e) < 1e-12               # Ortskurve y = x/e
        assert fa(200.0 / a, a) < 1e-60                      # x -> infinity
        assert fa(50.0 / a, a) < fa(20.0 / a, a) < fa(xh, a)
    assert abs(1 / e - 0.368) < 0.0005
    for a, hx, hy in ((0.5, 2.0, 2.0), (1.0, 1.0, 1.0), (2.0, 0.5, 0.5)):   # the figure
        assert abs(fa(hx, a) - hy) < 1e-12 and abs(dfa(hx, a)) < 1e-12
    assert abs(fa(4.0, 0.5) - 2.0 / (0.5 * e)) < 1e-12       # W of the flattest curve

    # --- Aufgabe 2: trigonometrische Funktion ------------------------------
    assert abs(PER - 4 * pi) < 1e-12
    for k in range(-40, 160):                                # periodicity
        x = k / 10.0
        assert abs(w(x + PER) - w(x)) < 1e-12
        num = (w(x + 1e-6) - w(x - 1e-6)) / 2e-6
        assert abs(dw(x) - num) < 1e-5
        num2 = (dw(x + 1e-6) - dw(x - 1e-6)) / 2e-6
        assert abs(ddw(x) - num2) < 1e-5
    for frac in (2, 3, 4, 6):                                # no smaller period
        sh = PER / frac
        assert any(abs(w(k / 10.0 + sh) - w(k / 10.0)) > 1e-6 for k in range(0, 130))
    assert any(abs(w(k / 10.0 + pi) - w(k / 10.0)) > 1 for k in range(0, 130))  # the trap
    assert all(-1e-12 <= w(k / 100.0) <= 6 + 1e-12 for k in range(0, 1300))     # range
    assert abs(w(pi)) < 1e-12 and abs(w(3 * pi) - 6) < 1e-12
    assert abs(dw(pi)) < 1e-12 and ddw(pi) > 0               # Tiefpunkt T(pi | 0)
    assert abs(dw(3 * pi)) < 1e-12 and ddw(3 * pi) < 0       # Hochpunkt H(3 pi | 6)
    assert abs(ddw(pi) - 0.75) < 1e-12 and abs(ddw(3 * pi) + 0.75) < 1e-12
    for xv in (0.0, 2 * pi, 4 * pi):                         # Wendepunkte
        assert abs(ddw(xv)) < 1e-12 and abs(w(xv) - 3) < 1e-12
        assert ddw(xv - 0.2) * ddw(xv + 0.2) < 0
    for u in (0.0, 0.7, 1.9, pi, 4.4, 2 * pi):               # point symmetry about W
        assert abs(w(2 * pi - u) + w(2 * pi + u) - 6) < 1e-12
    assert all(w(k / 100.0) <= 3 + 1e-12 for k in range(0, 629))        # left piece below
    assert all(w(k / 100.0) >= 3 - 1e-12 for k in range(629, 1257))     # right piece above
    flaeche = simpson(w, 0.0, PER)
    assert abs(flaeche - 12 * pi) < 1e-6                     # area equals the rectangle
    assert abs(12 * pi - 37.699) < 0.001
    assert abs(PER * 3 - 12 * pi) < 1e-12
    assert abs(flaeche / PER - 3) < 1e-9                     # mean value = midline
    fehlt = simpson(lambda x: 3 - w(x), 0.0, 2 * pi)
    dazu = simpson(lambda x: w(x) - 3, 2 * pi, PER)
    assert abs(fehlt - dazu) < 1e-6 and fehlt > 1            # the two pieces are equal

    # --- Aufgabe 3: zwei Bakterienkulturen ---------------------------------
    assert abs(na(0) - 400) < 1e-12 and abs(nb(0) - 400) < 1e-12
    assert abs(na(2) - 268.13) < 0.01 and abs(nb(2) - 179.73) < 0.01
    assert abs(gap(2) - 88.4) < 0.05
    assert abs(TSTERN - 5 * log(2)) < 1e-12
    assert abs(TSTERN - 3.4657) < 0.0005
    assert abs((TSTERN - 3) * 60 - 27.9) < 0.1               # 3 hours and 28 minutes
    assert abs(exp(-KA * TSTERN) - 0.5) < 1e-12
    assert abs(exp(-KB * TSTERN) - 0.25) < 1e-12
    dgap = lambda t: N0 * (-KA * exp(-KA * t) + KB * exp(-KB * t))
    ddgap = lambda t: N0 * (KA ** 2 * exp(-KA * t) - KB ** 2 * exp(-KB * t))
    for k in range(0, 140):                                  # d' is the derivative of d
        t = k / 10.0
        assert abs(dgap(t) - (gap(t + 1e-6) - gap(t - 1e-6)) / 2e-6) < 1e-5
        assert abs(dgap(t) - (dna(t) - dnb(t))) < 1e-12
    assert abs(dgap(TSTERN)) < 1e-12
    assert abs(ddgap(TSTERN) + 8) < 1e-9                     # d''(t*) = -8 < 0
    assert dgap(TSTERN - 0.2) > 0 > dgap(TSTERN + 0.2)
    assert abs(gap(TSTERN) - 100) < 1e-12
    assert abs(na(TSTERN) - 200) < 1e-12 and abs(nb(TSTERN) - 100) < 1e-12
    assert all(gap(k / 20.0) <= 100 + 1e-12 for k in range(0, 600))
    assert abs(dna(TSTERN) + 40) < 1e-12 and abs(dnb(TSTERN) + 40) < 1e-12
    assert all(dnb(k / 50.0) < dna(k / 50.0) for k in range(0, 173))     # B falls faster
    assert all(dnb(k / 50.0) > dna(k / 50.0) for k in range(174, 500))   # then A does
    assert abs(na(12) - 36.29) < 0.01 and abs(nb(12) - 3.29) < 0.01
    assert abs(gap(12) - 33.0) < 0.05
    assert abs(na(12) / nb(12) - exp(2.4)) < 1e-9 and abs(exp(2.4) - 11.02) < 0.01
    assert abs(log(100) / KB - 11.51) < 0.01                 # 1 % of the start value
    assert abs(log(100) / KA - 23.03) < 0.01
    assert abs(na(log(100) / KA) - 4) < 1e-9 and abs(nb(log(100) / KB) - 4) < 1e-9
    assert abs(log(100) / KA - 2 * log(100) / KB) < 1e-12    # twice as long
    assert na(1000) > 0 and nb(1000) > 0                     # never exactly empty


s.verify(check)
s.save()
