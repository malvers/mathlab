#!/usr/bin/env python3
"""Abitur-Training BGY - Ganzrationale Funktionenscharen.

    python3 tools/aufgaben/abi/schar.py

The Saxon exams like a family of curves whose extrema wander along a locus. The other
sheets already carry the e-function family (analysis_lk.py) and the single cubic
(analysis.py), so this one stays polynomial throughout: f_t(x) = x^3 - 3 t^2 x with
t > 0. Wording, numbers and every figure are our own - no original is reproduced.

Family facts used everywhere below:
    zeros        x = 0 and x = +- sqrt(3) t
    maximum      H_t(-t | 2 t^3)          minimum  T_t(t | -2 t^3)
    inflection   W(0 | 0), the same point for every t - and the only common point
    locus        y = -2 x^3 carries both the maxima (x < 0) and the minima (x > 0)
    area         A(t) = 9/2 * t^4 between the graph and the x-axis
"""
import os
import sys
from fractions import Fraction
from math import sqrt

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# --------------------------------------------------------------- functions ---
def f(x, t):
    return x ** 3 - 3 * t ** 2 * x


def df(x, t):
    return 3 * x ** 2 - 3 * t ** 2


def ddf(x, t):
    return 6 * x


def stamm(x, t):
    """Antiderivative F_t(x) = x^4/4 - 3 t^2 x^2 / 2."""
    return x ** 4 / 4.0 - 1.5 * t ** 2 * x ** 2


def locus(x):
    """Ortskurve of both extrema."""
    return -2 * x ** 3


def area(t):
    """Total area enclosed between G_t and the x-axis."""
    return 4.5 * t ** 4


SCHAR = (1.0, 1.5, 2.0)                     # the three curves drawn in every figure
COLS = (S.RED, S.GREEN, S.INK)
ROOT3 = sqrt(3.0)


# ------------------------------------------------------------------ helper ---
def legend(p, rows, x1, x2, ys, size=12):
    """Small legend inside the plot: a colour swatch plus a label per row.

    svgfig has no legend, so it is assembled here from seg() and text(); the halo keeps
    the label readable where a grid line passes behind it."""
    for (color, label, dash), y in zip(rows, ys):
        if dash == "dot":                       # a marker entry, not a line entry
            p.circle(p.X((x1 + x2) / 2.0), p.Y(y), 4.2, color)
        else:
            p.seg((x1, y), (x2, y), color, 2.4, dash=dash)
        p.text(p.X(x2) + 8, p.Y(y) + 4, label, size, S.BODY, "start", halo=S.PAPER)


def xlabels(p, values, dec=0, halo=()):
    """Repaint the x tick labels on top of the curves.

    Plot.axes() draws its labels before the data, so a branch running just under the
    axis strikes them through - here f_1 passes (-2 | -2), exactly where the label sits.
    The halo is given only to the labels that really need it; on a shaded area it would
    otherwise punch a white hole into the fill."""
    for u in values:
        p.text(p.X(u), p.Y(0) + 16, S.num(u, dec), 11.5, S.MUTED, "middle",
               halo=S.PAPER if u in halo else None)


def side_by_side(pa, pb, label, gap=26):
    """Two plots in one figure - svgfig has no multi-panel canvas, so both are nested
    as inner <svg> elements. Same world limits and same pixel size in both panels, so
    the two areas may honestly be compared by eye."""
    a = pa.svg().replace("<svg ", '<svg x="0" y="0" ', 1)
    b = pb.svg().replace("<svg ", '<svg x="%s" y="0" ' % S.fmt(pa.w + gap), 1)
    w, h = pa.w + gap + pb.w, max(pa.h, pb.h)
    rule = ('<line x1="%s" y1="18" x2="%s" y2="%s" stroke="%s" stroke-width="1"/>'
            % (S.fmt(pa.w + gap / 2.0), S.fmt(pa.w + gap / 2.0), S.fmt(h - 18), "#DCE4F0"))
    return ('<svg viewBox="0 0 %d %d" width="%d" height="%d"'
            ' preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"'
            ' role="img" aria-label="%s">%s%s%s</svg>'
            % (w, h, w, h, S.esc(label), rule, a, b))


def schar_plot(width=2.1, colors=COLS):
    """The frame that all three family figures share."""
    # The legend lives below y = -20 on the right: no curve of the family reaches
    # there (their minimum is -2t^3 = -16), so the window is stretched downwards.
    p = S.Plot((-3.9, 3.9), (-32, 26), w=560, h=460, pad=(46, 24, 20, 34))
    p.grid(1, 5)
    p.axes(1, 5, xlabel="x", ylabel="y")
    for t, col in zip(SCHAR, colors):
        p.curve(lambda x, t=t: f(x, t), -3.85, 3.85, col, width, n=420)
    xlabels(p, (-3, -2, -1, 1, 2, 3), halo=(-3, -2, -1, 1, 2, 3))
    return p


# ----------------------------------------------------------------- figures ---
def fig_schar():
    """Aufgabe 1: three members of the family with their extrema."""
    p = schar_plot()
    for t, col in zip(SCHAR, COLS):
        p.point(-t, f(-t, t), None, color=col, size=3.6)
        p.point(t, f(t, t), None, color=col, size=3.6)
    legend(p, [(S.RED, "t = 1", None), (S.GREEN, "t = 1,5", None), (S.INK, "t = 2", None)],
           1.15, 1.75, (-22, -26, -30))
    return p.svg("Drei Kurven der Schar; je groesser t, desto weiter aussen und desto "
                 "hoeher liegen Hochpunkt und Tiefpunkt")


def fig_extrempunkte():
    """Aufgabe 2: the same curves, thin, with every extremum marked - no locus yet."""
    p = schar_plot(width=1.5, colors=(S.MUTED, S.MUTED, S.MUTED))
    for t in SCHAR:
        p.point(-t, f(-t, t), None, color=S.RED, size=4.0)
        p.point(t, f(t, t), None, color=S.GREEN, size=4.0)
    legend(p, [(S.RED, "Hochpunkte", "dot"), (S.GREEN, "Tiefpunkte", "dot")],
           1.15, 1.75, (-23, -27.5))
    return p.svg("Dieselben drei Kurven, blass gezeichnet, mit den drei Hochpunkten links "
                 "und den drei Tiefpunkten rechts")


def fig_ortskurve():
    """Solution figure: the locus y = -2x^3 runs through all six extrema."""
    p = schar_plot(width=1.4, colors=(S.MUTED, S.MUTED, S.MUTED))
    # stop just outside the outermost extremum: further out the locus would dive
    # straight through the legend in the lower right corner
    p.curve(locus, -2.10, 2.10, S.ORANGE, 2.6, dash="8 5", n=200)
    for t in SCHAR:
        p.point(-t, f(-t, t), None, color=S.RED, size=4.0)
        p.point(t, f(t, t), None, color=S.GREEN, size=4.0)
    legend(p, [(S.ORANGE, "Ortskurve  y = -2x³", "8 5"),
               (S.RED, "Hochpunkte", "dot"), (S.GREEN, "Tiefpunkte", "dot")],
           1.15, 1.75, (-22, -26, -30))
    return p.svg("Durch alle sechs Extrempunkte laeuft eine gestrichelte Kurve, der Graph "
                 "von y gleich minus zwei x hoch drei")


def panel(t, note):
    """One area panel - identical world window and pixel size for every t."""
    p = S.Plot((-4.3, 4.3), (-21, 21), w=300, h=310, pad=(34, 14, 26, 26))
    p.grid(1, 5)
    p.axes(2, 10, xlabel="x", ylabel="y")
    r = ROOT3 * t
    p.area(lambda x: f(x, t), -r, 0, S.GREEN, 0.34)
    p.area(lambda x: f(x, t), 0, r, S.RED, 0.30)
    p.curve(lambda x: f(x, t), -4.25, 4.25, S.INK, 2.0, n=340)
    ticks = (-4, -2, 2, 4)
    xlabels(p, ticks, halo=tuple(u for u in ticks if abs(f(u, t)) < 4))
    p.text(p.X(-4.05), p.Y(18.4), note, 13, S.INK, "start", halo=S.PAPER)
    return p


def fig_flaechen():
    """Aufgabe 3: the enclosed area for t = 1 and t = 2, drawn at one and the same scale."""
    a = panel(1.0, "t = 1")
    b = panel(2.0, "t = 2")
    return side_by_side(a, b,
                        "Links die schmale, flache Flaeche fuer t gleich eins, rechts die "
                        "deutlich breitere und tiefere fuer t gleich zwei - beide Bilder "
                        "im selben Massstab")


def fig_wachstum():
    """Solution figure: A(t) is a quartic - doubling t is nowhere near doubling A."""
    p = S.Plot((-0.22, 2.55), (-13, 106), w=520, h=340, pad=(52, 26, 22, 34))
    p.grid(0.5, 10)
    p.axes(0.5, 20, xlabel="t", ylabel="A", xdec=1)
    p.seg((0, 0), (2.5, 4.5 * 2.5), S.MUTED, 1.6, dash="5 4")
    p.curve(area, 0, 2.5, S.RED, 2.4, n=200)
    p.seg((2, 0), (2, 72), S.MUTED, 1.0, dash="3 3", clip=True)
    p.point(1, 4.5, None, color=S.GREEN, size=4.0)
    p.point(2, 72, None, color=S.RED, size=4.4)
    p.point(2, 9, None, color=S.MUTED, size=3.6)
    p.text(p.X(2) - 12, p.Y(72) + 5, "A = 72", 12.5, S.INK, "end", halo=S.PAPER)
    p.text(p.X(1) - 10, p.Y(4.5) - 10, "A = 4,5", 12.5, S.INK, "end", halo=S.PAPER)
    p.text(p.X(2.5), p.Y(11.25) + 21, "doppelt wären nur 9", 12, S.MUTED, "end",
           halo=S.PAPER)
    p.text(p.X(0.05), p.Y(97), "A wird sechzehnmal so groß, nicht doppelt so groß:",
           12.5, S.BODY, "start", halo=S.PAPER)
    p.text(p.X(0.05), p.Y(88), "die Breite verdoppelt, die Tiefe verachtfacht sich", 12.5,
           S.BODY, "start", halo=S.PAPER)
    return p.svg("Der Graph von A ist eine steil steigende Kurve vierten Grades; die "
                 "gestrichelte Gerade der Verdopplung bleibt weit darunter")


# ------------------------------------------------------------------- sheet ---
s = Sheet("abitur-bgy-schar", "Ganzrationale Funktionenscharen",
          kind="Abitur-Training",
          suffix="",
          klasse="Berufliches Gymnasium",
          sub="Berufliches Gymnasium · Analysis · Grund- und Leistungskurs · "
              "drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Abitur-Training Mathematik BGY: ganzrationale Funktionenschar mit "
               "Nullstellen, Extrem- und Wendepunkten in Abhängigkeit vom Parameter, "
               "Ortskurve der Extrempunkte und Flächeninhalt als Funktion des Parameters, "
               "mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/abitur.html", "Zur Übersicht"))

s.task(
    "Eine Schar, die mit t auseinanderläuft", 1,
    r"Für jedes $t > 0$ ist die in $\mathbb{R}$ definierte Funktion $f_t$ mit "
    r"$f_t(x) = x^3 - 3 \cdot t^2 \cdot x$ gegeben; ihren Graphen bezeichnen wir mit "
    r"$G_t$. Die Abbildung zeigt die Graphen zu $t = 1$, zu $t = 1{,}5$ und zu $t = 2$.",
    [
        r"Berechnen Sie die Nullstellen von $f_t$ in Abhängigkeit von $t$.",
        r"Weisen Sie nach, dass jeder Graph $G_t$ punktsymmetrisch zum Koordinatenursprung "
        r"ist.",
        r"Bestimmen Sie in Abhängigkeit von $t$ die Koordinaten des Hochpunktes $H_t$ und "
        r"des Tiefpunktes $T_t$.",
        r"Zeigen Sie, dass jeder Graph genau einen Wendepunkt besitzt, und geben Sie das "
        r"Intervall an, in dem $f_t$ monoton fallend ist.",
    ],
    [
        r"Ausklammern statt Formel: $f_t(x) = x \cdot \left(x^2 - 3 \cdot t^2\right)$. Ein "
        r"Produkt ist genau dann null, wenn ein Faktor null ist. Der erste Faktor liefert "
        r"$x_1 = 0$, der zweite $x^2 = 3 \cdot t^2$ und damit "
        r"$x_{2,3} = \pm\sqrt{3 \cdot t^2} = \pm\sqrt{3} \cdot t$; die Wurzel darf hier "
        r"ohne Betrag gezogen werden, weil $t$ nach Voraussetzung positiv ist. Jede "
        r"Scharkurve hat also **drei einfache Nullstellen**, und die beiden äußeren wandern "
        r"proportional zu $t$ nach außen. Für $t = 2$ sind das etwa "
        r"$\pm 3{,}46$ sowie die Null.",
        r"In $f_t$ kommen nur **ungerade** Potenzen von $x$ vor. Also ist "
        r"$f_t(-x) = (-x)^3 - 3 \cdot t^2 \cdot (-x) = -x^3 + 3 \cdot t^2 \cdot x = "
        r"-f_t(x)$ für jedes $x$ und jedes $t$. Genau das ist die Bedingung für "
        r"Punktsymmetrie zum Ursprung: Zu jedem Punkt $(x \mid y)$ des Graphen gehört auch "
        r"$(-x \mid -y)$ dazu.",
        r"Es ist $f_t'(x) = 3 \cdot x^2 - 3 \cdot t^2 = 3 \cdot (x - t) \cdot (x + t)$, "
        r"also $f_t'(x) = 0$ genau für $x = -t$ und $x = t$. Die zweite Ableitung ist "
        r"$f_t''(x) = 6 \cdot x$. Wegen $t > 0$ gilt $f_t''(-t) = -6 \cdot t < 0$ und "
        r"$f_t''(t) = 6 \cdot t > 0$. Die Funktionswerte sind "
        r"$f_t(-t) = -t^3 + 3 \cdot t^3 = 2 \cdot t^3$ und ebenso "
        r"$f_t(t) = -2 \cdot t^3$. Damit ist "
        r"$H_t\left(-t \mid 2 \cdot t^3\right)$ der **Hochpunkt** und "
        r"$T_t\left(t \mid -2 \cdot t^3\right)$ der **Tiefpunkt**.",
        r"Aus $f_t''(x) = 6 \cdot x = 0$ folgt allein $x = 0$; eine lineare Funktion hat "
        r"höchstens eine Nullstelle, mehr Kandidaten gibt es also nicht. Dort wechselt "
        r"$f_t''$ das Vorzeichen von minus nach plus, denn $f_t'''(x) = 6 \neq 0$. Jeder "
        r"Graph besitzt somit genau einen Wendepunkt, und zwar "
        r"$W(0 \mid 0)$ — **für jedes $t$ denselben**. Zwischen den beiden Extremstellen "
        r"ist $f_t'(x) < 0$, folglich fällt $f_t$ monoton im Intervall "
        r"$-t \leq x \leq t$.",
    ],
    falle=r"Beim Ableiten ist $t$ eine **feste Zahl** und $x$ die Variable: Der Term "
          r"$3 \cdot t^2 \cdot x$ hat die Ableitung $3 \cdot t^2$, nicht $6 \cdot t$. Und "
          r"wer nur die gezeichnete Kurve zu $t = 2$ untersucht, hat über die Schar nichts "
          r"gezeigt — verlangt sind Aussagen, die für **jedes** $t > 0$ gelten.",
    figs=[(fig_schar(),
           "Die drei Scharkurven zu t = 1 (rot), t = 1,5 (grün) und t = 2 (dunkelblau) mit "
           "ihren Extrempunkten. Alle drei laufen durch den Ursprung.")],
)

s.task(
    "Wohin die Gipfel wandern", 2,
    r"Weiterhin sei $f_t(x) = x^3 - 3 \cdot t^2 \cdot x$ mit $t > 0$. Die Abbildung zeigt "
    r"die drei Scharkurven blass gezeichnet, dazu alle sechs Extrempunkte. Man erkennt, "
    r"dass diese Punkte nicht beliebig verstreut liegen.",
    [
        r"Bestimmen Sie eine Gleichung der Ortskurve, auf der alle Hochpunkte $H_t$ und "
        r"alle Tiefpunkte $T_t$ liegen, und geben Sie an, welche Teile dieser Kurve dabei "
        r"durchlaufen werden.",
        r"Weisen Sie nach, dass alle Graphen der Schar genau einen Punkt gemeinsam haben.",
        r"Bestimmen Sie denjenigen Wert von $t$, für den $G_t$ an der Stelle $x_0 = 1$ eine "
        r"Tangente mit dem Anstieg $-9$ besitzt, und geben Sie eine Gleichung dieser "
        r"Tangente an.",
        r"Zeigen Sie, dass die Gerade durch $H_t$ und $T_t$ für jedes $t$ durch den "
        r"Ursprung verläuft, und vergleichen Sie ihren Anstieg mit dem Anstieg der "
        r"Wendetangente.",
    ],
    [
        r"Der Hochpunkt hat die Koordinaten $x = -t$ und $y = 2 \cdot t^3$. Aus der ersten "
        r"Gleichung folgt $t = -x$; eingesetzt in die zweite ergibt das "
        r"$y = 2 \cdot (-x)^3 = -2 \cdot x^3$. Für den Tiefpunkt ist $x = t$, also $t = x$ "
        r"und damit $y = -2 \cdot x^3$ — dieselbe Gleichung. Alle sechs Punkte der "
        r"Abbildung und überhaupt alle Extrempunkte der Schar liegen also auf der Kurve mit "
        r"der Gleichung $y = -2 \cdot x^3$. Weil $t$ alle positiven Zahlen durchläuft, "
        r"liefern die **Hochpunkte** genau den Ast mit $x < 0$ und die **Tiefpunkte** genau "
        r"den Ast mit $x > 0$; der Ursprung selbst gehört nicht dazu, denn $t = 0$ ist "
        r"ausgeschlossen.",
        r"Ein gemeinsamer Punkt muss für zwei verschiedene Parameter $t_1 \neq t_2$ "
        r"denselben Funktionswert haben. Aus $f_{t_1}(x) = f_{t_2}(x)$ folgt "
        r"$x^3 - 3 \cdot t_1^2 \cdot x = x^3 - 3 \cdot t_2^2 \cdot x$, nach Kürzen von "
        r"$x^3$ also $3 \cdot x \cdot \left(t_2^2 - t_1^2\right) = 0$. Da beide Parameter "
        r"positiv und verschieden sind, ist $t_2^2 - t_1^2 \neq 0$, und es bleibt nur "
        r"$x = 0$. Wegen $f_t(0) = 0$ für jedes $t$ ist der Koordinatenursprung "
        r"$O(0 \mid 0)$ tatsächlich gemeinsamer Punkt — und zwar der **einzige**. Nach "
        r"Aufgabe 1 ist er zugleich der gemeinsame Wendepunkt aller Scharkurven.",
        r"Der Anstieg an der Stelle $x_0 = 1$ ist "
        r"$f_t'(1) = 3 \cdot 1^2 - 3 \cdot t^2 = 3 - 3 \cdot t^2$. Die Forderung "
        r"$3 - 3 \cdot t^2 = -9$ führt auf $t^2 = 4$, wegen $t > 0$ also auf "
        r"$\mathbf{t = 2}$. Der Berührpunkt ist $f_2(1) = 1 - 12 = -11$, also "
        r"$P(1 \mid -11)$. Mit der Punkt-Anstiegs-Form folgt "
        r"$y = -9 \cdot (x - 1) - 11$ und ausmultipliziert "
        r"$y = -9 \cdot x - 2$.",
        r"Die beiden Extrempunkte sind $H_t(-t \mid 2 t^3)$ und $T_t(t \mid -2 t^3)$; ihr "
        r"Mittelpunkt ist $\left(\frac{-t + t}{2} \mid \frac{2 t^3 - 2 t^3}{2}\right) = "
        r"(0 \mid 0)$, also liegt der Ursprung auf der Verbindungsgeraden. Deren Anstieg "
        r"ist $m = \frac{-2 t^3 - 2 t^3}{t - (-t)} = \frac{-4 t^3}{2 t} = -2 \cdot t^2$, "
        r"die Gerade hat somit die Gleichung $y = -2 \cdot t^2 \cdot x$. Die Wendetangente "
        r"berührt im Ursprung und hat den Anstieg $f_t'(0) = -3 \cdot t^2$, also die "
        r"Gleichung $y = -3 \cdot t^2 \cdot x$. Beide Geraden gehen durch den Ursprung, "
        r"aber die Wendetangente ist steiler: Das Verhältnis der Anstiege beträgt "
        r"$\frac{-2 t^2}{-3 t^2} = \frac{2}{3}$ — **unabhängig von $t$**.",
    ],
    falle=r"Eine Ortskurve entsteht durch **Eliminieren des Parameters**, nicht durch "
          r"Verbinden der drei gezeichneten Punkte. Und $y = -2 \cdot x^3$ gehört nicht "
          r"selbst zur Schar: Es gibt kein $t$ mit $f_t(x) = -2 \cdot x^3$, die Ortskurve "
          r"ist eine Kurve über der Schar, keine Kurve in ihr.",
    figs=[(fig_extrempunkte(),
           "Die drei Scharkurven blass, dazu die drei Hochpunkte (rot) und die drei "
           "Tiefpunkte (grün).")],
    solfigs=[(fig_ortskurve(),
              "Zu a): Alle sechs Extrempunkte liegen auf der gestrichelt gezeichneten "
              "Ortskurve y = −2x³. Links wird der Ast mit negativem x von den Hochpunkten "
              "durchlaufen, rechts der Ast mit positivem x von den Tiefpunkten.")],
)

s.task(
    "Die Fläche wächst schneller als gedacht", 3,
    r"Für jedes $t > 0$ schließt der Graph $G_t$ von $f_t$ mit $f_t(x) = x^3 - "
    r"3 \cdot t^2 \cdot x$ zusammen mit der $x$-Achse zwei Flächenstücke ein: eines "
    r"links, eines rechts vom Ursprung. Ihr Gesamtinhalt wird mit $A(t)$ bezeichnet und in "
    r"Flächeneinheiten (FE) angegeben. Die Abbildung zeigt beide Flächenstücke für "
    r"$t = 1$ und für $t = 2$ im gleichen Maßstab.",
    [
        r"Geben Sie die Integrationsgrenzen an und begründen Sie, dass die beiden "
        r"Flächenstücke inhaltsgleich sind.",
        r"Berechnen Sie $A(t)$ in Abhängigkeit von $t$.",
        r"Bestimmen Sie denjenigen Wert von $t$, für den $A(t) = 72$ FE gilt.",
        r"Beurteilen Sie die Aussage: „Verdoppelt man $t$, so verdoppelt sich der "
        r"Flächeninhalt.“",
    ],
    [
        r"Die Nullstellen aus Aufgabe 1 sind $-\sqrt{3} \cdot t$, dann $0$ und schließlich "
        r"$\sqrt{3} \cdot t$; sie sind die Grenzen der beiden Flächenstücke. Zwischen "
        r"$-\sqrt{3} \cdot t$ und $0$ verläuft der Graph oberhalb der Achse — etwa ist "
        r"$f_t(-t) = 2 \cdot t^3 > 0$ —, zwischen $0$ und $\sqrt{3} \cdot t$ unterhalb, "
        r"denn $f_t(t) = -2 \cdot t^3 < 0$. Nach Aufgabe 1 ist $G_t$ punktsymmetrisch zum "
        r"Ursprung; die Punktspiegelung an $O$ bildet das linke Flächenstück genau auf das "
        r"rechte ab. Beide sind deshalb **inhaltsgleich**, und es genügt, eines zu "
        r"berechnen und zu verdoppeln.",
        r"Eine Stammfunktion ist $F_t(x) = \frac{1}{4} \cdot x^4 - \frac{3}{2} \cdot t^2 "
        r"\cdot x^2$. Für das rechte Stück braucht man die Zwischenwerte "
        r"$\left(\sqrt{3} \cdot t\right)^2 = 3 \cdot t^2$ und "
        r"$\left(\sqrt{3} \cdot t\right)^4 = 9 \cdot t^4$. Damit ist "
        r"$F_t\!\left(\sqrt{3} \cdot t\right) = \frac{9}{4} \cdot t^4 - \frac{3}{2} \cdot "
        r"t^2 \cdot 3 \cdot t^2 = \frac{9}{4} \cdot t^4 - \frac{9}{2} \cdot t^4 = "
        r"-\frac{9}{4} \cdot t^4$, und wegen $F_t(0) = 0$ folgt "
        r"$\int_{0}^{\sqrt{3} t} f_t(x)\,dx = -\frac{9}{4} \cdot t^4$. Der Betrag davon ist "
        r"der Inhalt eines Stückes, und mit dem Faktor $2$ aus Teil a) ergibt sich "
        r"$A(t) = 2 \cdot \frac{9}{4} \cdot t^4 = \frac{9}{2} \cdot t^4 = "
        r"4{,}5 \cdot t^4$.",
        r"Aus $\frac{9}{2} \cdot t^4 = 72$ folgt $t^4 = 16$ und damit "
        r"$t = \pm 2$. Wegen $t > 0$ bleibt nur $\mathbf{t = 2}$. Probe: "
        r"$A(2) = 4{,}5 \cdot 16 = 72$. Das ist gerade die Kurve zu $t = 2$ aus den "
        r"Abbildungen; ihre Nullstellen liegen bei $0$ und bei rund $\pm 3{,}46$.",
        r"Die Aussage ist **falsch**. Setzt man $2 \cdot t$ ein, so ist "
        r"$A(2 \cdot t) = \frac{9}{2} \cdot (2 t)^4 = \frac{9}{2} \cdot 16 \cdot t^4 = "
        r"16 \cdot A(t)$: Der Inhalt wird **sechzehnmal** so groß, nicht doppelt so groß. "
        r"Das Zahlenbeispiel bestätigt es, denn $A(1) = 4{,}5$ und $A(2) = 72$, und "
        r"$72 = 16 \cdot 4{,}5$. Anschaulich liegt es daran, dass sich beim Verdoppeln von "
        r"$t$ **zwei** Größen ändern: Die Nullstellen $\pm\sqrt{3} \cdot t$ rücken doppelt "
        r"so weit auseinander, die Extremwerte $\pm 2 \cdot t^3$ werden aber achtmal so "
        r"groß. Doppelte Breite mal achtfache Höhe ergibt den Faktor "
        r"$2 \cdot 8 = 16$. Verdoppeln würde sich der Inhalt erst, wenn man "
        r"$t$ mit $\sqrt[4]{2} \approx 1{,}19$ multipliziert.",
    ],
    falle=r"Wer in einem Zug von $-\sqrt{3} \cdot t$ bis $\sqrt{3} \cdot t$ integriert, "
          r"erhält wegen der Punktsymmetrie den Wert $0$ — die beiden Flächenstücke heben "
          r"einander im Integral auf. Ein Flächeninhalt entsteht erst, wenn an jeder "
          r"Nullstelle **geteilt** und der Betrag genommen wird.",
    figs=[(fig_flaechen(),
           "Beide Flächenstücke für t = 1 (links) und t = 2 (rechts), gezeichnet im "
           "gleichen Koordinatenfenster. Der doppelte Parameter liefert erkennbar weit "
           "mehr als die doppelte Fläche.")],
    solfigs=[(fig_wachstum(),
              "Zu d): Der Graph von A ist eine Kurve vierten Grades. Bei t = 2 liegt sie "
              "bei 72, während doppeltes Wachstum (gestrichelt) nur 9 ergäbe.")],
)


# ------------------------------------------------------------------ checks ---
def simpson(fn, a, b, n=4000):
    """Numeric integral - the counter-check for every area computed with fractions."""
    h = (b - a) / float(n)
    total = fn(a) + fn(b)
    for i in range(1, n):
        total += (4 if i % 2 else 2) * fn(a + i * h)
    return total * h / 3.0


def loop_exact(t):
    """Exact area of one loop as a fraction: |F_t(sqrt(3) t) - F_t(0)|.

    sqrt(3) never appears itself - only its even powers do, and those are rational:
    (sqrt(3) t)^2 = 3 t^2 and (sqrt(3) t)^4 = 9 t^4."""
    t = Fraction(t)
    x2, x4 = 3 * t ** 2, 9 * t ** 4
    val = x4 / 4 - Fraction(3, 2) * t ** 2 * x2
    assert val < 0                                       # the right loop lies below
    return -val


def check():
    """Every number in the solutions, recomputed - the family for many values of t."""
    ts = (Fraction(1, 2), Fraction(3, 4), Fraction(1), Fraction(5, 4), Fraction(3, 2),
          Fraction(2), Fraction(5, 2), Fraction(3))
    for tf in ts:
        t = float(tf)
        # --- Aufgabe 1a: Nullstellen ---------------------------------------
        assert abs(f(0.0, t)) < 1e-12
        for z in (ROOT3 * t, -ROOT3 * t):
            assert abs(f(z, t)) < 1e-9
        assert abs((ROOT3 * t) ** 2 - 3 * t ** 2) < 1e-9
        assert abs((ROOT3 * t) ** 4 - 9 * t ** 4) < 1e-9
        # no further zeros: f_t = x (x^2 - 3 t^2) has exactly these three
        roots = sorted([-ROOT3 * t, 0.0, ROOT3 * t])
        for k in range(-400, 401):
            x = k * (4.0 * t) / 400.0
            if all(abs(x - r) > 1e-3 * t for r in roots):
                assert abs(f(x, t)) > 1e-9
        # --- Aufgabe 1b: Punktsymmetrie ------------------------------------
        for k in range(-60, 61):
            x = k / 10.0
            assert abs(f(-x, t) + f(x, t)) < 1e-9
        # --- Aufgabe 1c/d: Ableitungen, Extrema, Wendepunkt -----------------
        for k in range(-60, 61):
            x = k / 10.0
            num = (f(x + 1e-6, t) - f(x - 1e-6, t)) / 2e-6
            assert abs(df(x, t) - num) < 1e-4
            num2 = (df(x + 1e-6, t) - df(x - 1e-6, t)) / 2e-6
            assert abs(ddf(x, t) - num2) < 1e-4
            assert abs(df(x, t) - 3 * (x - t) * (x + t)) < 1e-9
        assert abs(df(-t, t)) < 1e-12 and abs(df(t, t)) < 1e-12
        assert abs(ddf(-t, t) + 6 * t) < 1e-12 and ddf(-t, t) < 0        # Hochpunkt
        assert abs(ddf(t, t) - 6 * t) < 1e-12 and ddf(t, t) > 0          # Tiefpunkt
        assert abs(f(-t, t) - 2 * t ** 3) < 1e-9
        assert abs(f(t, t) + 2 * t ** 3) < 1e-9
        assert all(f(-t, t) >= f(k * t / 100.0, t) - 1e-9
                   for k in range(-300, 1))                              # local maximum
        assert all(f(t, t) <= f(k * t / 100.0, t) + 1e-9
                   for k in range(0, 301))                               # local minimum
        assert abs(ddf(0.0, t)) < 1e-12
        assert ddf(-0.1, t) < 0 < ddf(0.1, t)                            # sign change
        assert abs(f(0.0, t)) < 1e-12                                    # W(0 | 0)
        assert all(df(k * t / 100.0, t) < 0 for k in range(-99, 100))    # falling on (-t, t)
        assert df(-1.01 * t, t) > 0 and df(1.01 * t, t) > 0
        # --- Aufgabe 2a: Ortskurve -----------------------------------------
        assert abs(locus(-t) - f(-t, t)) < 1e-9                          # H_t on y = -2x^3
        assert abs(locus(t) - f(t, t)) < 1e-9                            # T_t on y = -2x^3
        assert locus(-t) > 0 > locus(t)
        # the locus is no member of the family: it differs from every f_s somewhere
        for sf in ts:
            assert abs(locus(1.0) - f(1.0, float(sf))) > 1e-9 or \
                   abs(locus(2.0) - f(2.0, float(sf))) > 1e-9
        # --- Aufgabe 2d: Gerade durch H und T ------------------------------
        m = (f(t, t) - f(-t, t)) / (2 * t)
        assert abs(m + 2 * t ** 2) < 1e-9                                # slope -2 t^2
        assert abs(f(-t, t) + f(t, t)) < 1e-9                            # midpoint is O
        assert abs(df(0.0, t) + 3 * t ** 2) < 1e-12                      # Wendetangente
        assert abs(m / df(0.0, t) - 2.0 / 3.0) < 1e-12                   # ratio 2 : 3
        assert abs(df(0.0, t)) > abs(m)                                  # tangent is steeper
        # --- Aufgabe 3: Flaeche --------------------------------------------
        exact = loop_exact(tf)                                           # Fraction, one loop
        assert exact == Fraction(9, 4) * tf ** 4
        total = 2 * exact
        assert total == Fraction(9, 2) * tf ** 4
        assert abs(float(total) - area(t)) < 1e-9
        r = ROOT3 * t
        left = simpson(lambda x: f(x, t), -r, 0.0)                       # above the axis
        right = simpson(lambda x: f(x, t), 0.0, r)                       # below the axis
        assert left > 0 > right
        assert abs(left + right) < 1e-6 * max(1.0, t ** 4)               # they cancel out
        assert abs(left - float(exact)) < 1e-6 * max(1.0, t ** 4)
        assert abs(-right - float(exact)) < 1e-6 * max(1.0, t ** 4)
        assert abs(simpson(lambda x: abs(f(x, t)), -r, r) - float(total)) < 1e-4 * max(1.0, t ** 4)
        assert abs(stamm(r, t) + 2.25 * t ** 4) < 1e-6 * max(1.0, t ** 4)
        assert abs(stamm(0.0, t)) < 1e-12
        # --- Aufgabe 3d: scaling law ---------------------------------------
        assert Fraction(9, 2) * (2 * tf) ** 4 == 16 * total
        assert loop_exact(2 * tf) == 16 * exact

    # --- the concrete numbers that appear in the prose ----------------------
    assert abs(ROOT3 * 2 - 3.4641) < 0.0005                              # +- 3,46 for t = 2
    assert abs(f(1.0, 2.0) + 11) < 1e-12                                 # Beruehrpunkt
    assert abs(df(1.0, 2.0) + 9) < 1e-12                                 # slope -9
    assert abs(3 - 3 * 2.0 ** 2 + 9) < 1e-12                             # 3 - 3t^2 = -9
    for x in (-2.0, -0.5, 0.0, 1.0, 3.0):                                # tangent y = -9x - 2
        assert abs((-9 * (x - 1) - 11) - (-9 * x - 2)) < 1e-12
    assert abs(area(1.0) - 4.5) < 1e-12
    assert abs(area(2.0) - 72.0) < 1e-12
    assert area(2.0) == 16 * area(1.0)
    assert Fraction(9, 2) * Fraction(2) ** 4 == 72                       # t = 2 solves A = 72
    assert abs((2.0 ** 0.25) - 1.1892) < 0.0005                          # doubling needs 2^(1/4)
    assert abs(area(2.0 ** 0.25) - 2 * area(1.0)) < 1e-9
    assert abs(2 * 8 - 16) < 1e-12                                       # width x height
    # only the origin is shared by two different members
    for t1, t2 in ((1.0, 1.5), (1.0, 2.0), (1.5, 2.0), (0.5, 3.0)):
        assert abs(f(0.0, t1) - f(0.0, t2)) < 1e-12
        assert all(abs(f(k / 20.0, t1) - f(k / 20.0, t2)) > 1e-9
                   for k in range(-80, 81) if k != 0)
    # the three drawn curves really pass through the marked points
    for t in SCHAR:
        assert abs(f(-t, t) - 2 * t ** 3) < 1e-9 and abs(f(t, t) + 2 * t ** 3) < 1e-9
        assert abs(locus(-t) - f(-t, t)) < 1e-9 and abs(locus(t) - f(t, t)) < 1e-9
        assert abs(f(-t, t)) <= 16.0 + 1e-9                              # fits into the frame
        assert ROOT3 * t < 3.85


s.verify(check)
s.save()
