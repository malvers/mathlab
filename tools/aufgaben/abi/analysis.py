#!/usr/bin/env python3
"""Abitur-Training BGY - Analysis (Pflichtaufgabe 1).

    python3 tools/aufgaben/abi/analysis.py

Task types follow the Sachsen originals 2022-2025 (ganzrationale Funktion 3. Grades,
Tangentenpaare, e-Funktion im Sachkontext). Wording, numbers and every figure are our
own - the originals are not reproduced.
"""
import os
import sys
from math import exp

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# --------------------------------------------------------------- functions ---
def f(x):
    return x ** 3 - 6 * x ** 2 + 9 * x


def df(x):
    return 3 * x ** 2 - 12 * x + 9


def ddf(x):
    return 6 * x - 12


def c(t):
    return 40 * t * exp(-0.5 * t)


def dc(t):
    return 40 * exp(-0.5 * t) * (1 - 0.5 * t)


# ----------------------------------------------------------------- figures ---
def fig_kurve():
    p = S.Plot((-0.7, 4.6), (-1.6, 5.6), w=520, h=330)
    p.grid(1, 1)
    p.axes(1, 1, xlabel="x", ylabel="y")
    p.curve(f, -0.55, 4.35, S.RED, 2.2)
    p.dashto(1, f(1))
    p.dashto(2, f(2))
    p.point(1, f(1), "H", "above")
    p.point(2, f(2), "W", "above-right", color=S.GREEN)
    p.point(3, f(3), "T", "below-right")
    return p.svg("Graph der Funktion f mit Hochpunkt, Wendepunkt und Tiefpunkt")


def fig_tangenten():
    p = S.Plot((-1.1, 5.1), (-3.8, 9.5), w=520, h=350)
    p.grid(1, 2)
    p.axes(1, 2, xlabel="x", ylabel="y", origin=None, skip_y=(0, -2))
    p.curve(f, -0.6, 4.5, S.RED, 2.2)
    p.tangent(f, df, 0, 1.0, S.GREEN, 1.9)
    p.tangent(f, df, 4, 1.0, S.GREEN, 1.9)
    p.line(p.X(2), p.Y(-2.6), p.X(2), p.Y(f(2)), S.MUTED, 1, dash="3 3")
    p.brace(0, 4, -2.6, "Mitte bei x = 2", S.MUTED)
    p.point(0, f(0), "P", "above-left", color=S.GREEN)
    p.point(4, f(4), "Q", "below-right", color=S.GREEN)
    p.point(2, f(2), "W", "above-right", color=S.ORANGE)
    return p.svg("Graph von f mit zwei parallelen Tangenten in x gleich 0 und x gleich 4")


def fig_ableitung():
    p = S.Plot((-0.9, 4.9), (-4.5, 10.5), w=460, h=280)
    p.grid(1, 2)
    p.axes(1, 2, xlabel="x", ylabel="y")
    p.curve(df, -0.55, 4.55, S.GREEN, 2.1)
    p.line(p.X(2), p.Y(-4.5), p.X(2), p.Y(10.5), S.MUTED, 1.1, dash="4 3")
    p.seg((-0.9, 9), (4.9, 9), S.ORANGE, 1.5, dash="5 3")
    p.point(0, 9, None, color=S.ORANGE)
    p.point(4, 9, None, color=S.ORANGE)
    p.point(2, -3, "Minimum", "below", color=S.RED)
    p.text(p.X(2) + 6, p.Y(10.2), "Symmetrieachse x = 2", 12, S.MUTED, "start")
    return p.svg("Graph der Ableitungsfunktion, eine nach oben geoeffnete Parabel mit Scheitel bei x gleich 2")


def fig_koffein():
    p = S.Plot((-0.6, 8.6), (-4, 34), w=520, h=330, pad=(46, 22, 20, 34))
    p.grid(1, 5)
    p.axes(1, 5, xlabel="t", ylabel="c(t)")
    p.curve(c, 0, 8.5, S.RED, 2.2)
    p.tangent(c, dc, 4, 1.5, S.GREEN, 1.8)
    p.dashto(2, c(2))
    p.point(2, c(2), "H", "above")
    p.point(4, c(4), "W", "above-right", color=S.GREEN)
    p.text(p.X(8.5), p.Y(31), "t in Stunden, c in mg/l", 12, S.MUTED, "end")
    return p.svg("Graph der Koffeinkonzentration mit Hochpunkt bei zwei Stunden und Wendepunkt bei vier Stunden")


def fig_flaeche():
    p = S.Plot((-0.6, 8.6), (-4, 34), w=460, h=270, pad=(46, 22, 18, 32))
    p.axes(1, 10, xlabel="t", ylabel="c(t)")
    p.area(c, 0, 8, S.ORANGE, 0.35)
    p.curve(c, 0, 8.5, S.RED, 2.0)
    p.text(p.X(3.2), p.Y(9), "A", 15, S.INK, "middle", italic=True)
    return p.svg("Flaeche zwischen dem Graphen und der t-Achse von 0 bis 8")


# ------------------------------------------------------------------- sheet ---
s = Sheet("abitur-bgy-analysis", "Analysis",
          kind="Abitur-Training",
          suffix="",
          klasse="Berufliches Gymnasium",
          sub="Berufliches Gymnasium · Pflichtaufgabe 1 · Grund- und Leistungskurs · "
              "drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Abitur-Training Mathematik BGY, Analysis: ganzrationale Funktion, "
               "Tangentenpaare und e-Funktion im Sachkontext, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/abitur.html", "Zur Übersicht"))

s.task(
    "Der Buckel im Graphen", 1,
    r"Gegeben ist die in $\mathbb{R}$ definierte Funktion $f$ mit "
    r"$f(x) = x^3 - 6 \cdot x^2 + 9 \cdot x$. Die Abbildung zeigt den Graphen von $f$.",
    [
        r"Berechnen Sie die Nullstellen von $f$.",
        r"Bestimmen Sie die Koordinaten des Hochpunktes und des Tiefpunktes.",
        r"Weisen Sie nach, dass der Graph genau einen Wendepunkt besitzt, und geben Sie "
        r"dessen Koordinaten an.",
        r"Geben Sie das Intervall an, in dem $f$ monoton fallend ist.",
    ],
    [
        r"Ausklammern statt Formel: $f(x) = x \cdot (x^2 - 6x + 9) = x \cdot (x-3)^2$. "
        r"Also $x_1 = 0$ und $x_2 = 3$, wobei $x_2$ eine **doppelte** Nullstelle ist — der "
        r"Graph berührt dort die $x$-Achse.",
        r"$f'(x) = 3x^2 - 12x + 9 = 3 \cdot (x-1) \cdot (x-3)$, also $x = 1$ oder $x = 3$. "
        r"Mit $f''(x) = 6x - 12$ ist $f''(1) = -6 < 0$ und $f''(3) = 6 > 0$. "
        r"Damit **Hochpunkt** $H(1 \mid 4)$ und **Tiefpunkt** $T(3 \mid 0)$.",
        r"$f''(x) = 6x - 12 = 0$ liefert genau die Stelle $x = 2$; wegen $f'''(x) = 6 \neq 0$ "
        r"liegt dort ein Vorzeichenwechsel von $f''$ vor. Eine lineare Funktion hat höchstens "
        r"eine Nullstelle, also gibt es keinen weiteren Wendepunkt: $W(2 \mid 2)$.",
        r"Zwischen den beiden Extremstellen ist $f'(x) < 0$, also fällt $f$ monoton für "
        r"$1 \leq x \leq 3$.",
    ],
    falle=r"Bei $x = 3$ liegen Nullstelle und Tiefpunkt aufeinander. Das ist kein Zufall, "
          r"sondern der Grund für die doppelte Nullstelle: Der Graph berührt die Achse, "
          r"statt sie zu schneiden.",
    figs=[(fig_kurve(), "Der Graph von f im Bereich von −0,5 bis 4,3.")],
)

s.task(
    "Zwei Tangenten, ein Anstieg", 2,
    r"An den Graphen von $f$ mit $f(x) = x^3 - 6 \cdot x^2 + 9 \cdot x$ lassen sich Paare "
    r"von Tangenten legen, die parallel zueinander verlaufen. Die Abbildung zeigt ein "
    r"solches Paar mit den Berührpunkten $P$ und $Q$.",
    [
        r"Zeigen Sie, dass die Tangenten in $x_1 = 0$ und $x_2 = 4$ parallel verlaufen, "
        r"und geben Sie ihren Anstieg an.",
        r"Bestimmen Sie eine Gleichung der Tangente im Punkt $P$.",
        r"Begründen Sie mithilfe von $f'$, dass für jedes solche Paar von Berührstellen "
        r"$\dfrac{x_1 + x_2}{2} = 2$ gilt.",
        r"Beurteilen Sie die Aussage: „Zu jedem Anstieg $m$ gibt es genau zwei parallele "
        r"Tangenten an den Graphen von $f$.“",
    ],
    [
        r"$f'(x) = 3x^2 - 12x + 9$, damit $f'(0) = 9$ und $f'(4) = 48 - 48 + 9 = 9$. "
        r"Gleicher Anstieg bedeutet parallele Tangenten, der Anstieg ist $m = 9$.",
        r"$f(0) = 0$, der Berührpunkt ist $P(0 \mid 0)$. Mit $m = 9$ und dem Punkt $(0 \mid 0)$ "
        r"folgt $y = 9 \cdot x$.",
        r"Zwei Berührstellen mit demselben Anstieg $m$ sind die Lösungen von "
        r"$3x^2 - 12x + 9 = m$, also von $x^2 - 4x + \dfrac{9-m}{3} = 0$. Nach dem Satz von "
        r"Vieta ist $x_1 + x_2 = 4$ und damit der Mittelwert $2$ — unabhängig von $m$. "
        r"Das ist genau die Wendestelle: Der Graph von $f'$ ist eine Parabel mit dem "
        r"Scheitel bei $x = 2$, und jede waagerechte Gerade schneidet sie symmetrisch dazu.",
        r"Die Aussage ist **falsch**. Aus $x^2 - 4x + \dfrac{9-m}{3} = 0$ folgt "
        r"$x_{1,2} = 2 \pm \sqrt{1 + \dfrac{m}{3}}$. Zwei verschiedene Berührstellen gibt es "
        r"nur für $m > -3$; für $m = -3$ fallen beide in der Wendestelle $x = 2$ zusammen, "
        r"für $m < -3$ gibt es gar keine. $m = -3$ ist der kleinstmögliche Anstieg.",
    ],
    falle=r"Der Nachweis in Teil c) verlangt keine Zahlenrechnung. Wer die Berührstellen "
          r"für ein festes $m$ ausrechnet, hat nur ein Beispiel gezeigt — gefragt ist die "
          r"Begründung für **alle** Paare.",
    figs=[(fig_tangenten(), "Zwei parallele Tangenten mit dem Anstieg 9.")],
    solfigs=[(fig_ableitung(),
              "Zu c): Der Graph von f′ ist eine Parabel mit dem Scheitel bei x = 2. "
              "Jede waagerechte Gerade trifft sie in zwei Punkten, die spiegelbildlich "
              "zu dieser Achse liegen.")],
)

s.task(
    "Koffein im Blut", 3,
    r"Nach dem Trinken eines Energydrinks lässt sich die Koffeinkonzentration im Blut für "
    r"$0 \leq t \leq 8$ modellhaft durch die Funktion $c$ mit "
    r"$c(t) = 40 \cdot t \cdot e^{-0{,}5 \cdot t}$ beschreiben. Dabei ist $t$ die seit dem "
    r"Trinken vergangene Zeit in Stunden und $c(t)$ die Konzentration in Milligramm je Liter.",
    [
        r"Geben Sie die Konzentration eine Stunde nach dem Trinken an.",
        r"Bestimmen Sie den Zeitpunkt, zu dem die Konzentration am größten ist, und den "
        r"zugehörigen Wert.",
        r"Bestimmen Sie den Zeitpunkt, zu dem die Konzentration am stärksten abnimmt, "
        r"und geben Sie diese Abnahme an.",
        r"Beurteilen Sie die Aussage: „Nach acht Stunden ist das Koffein vollständig "
        r"abgebaut.“",
    ],
    [
        r"$c(1) = 40 \cdot e^{-0{,}5} \approx 24{,}3$. Eine Stunde nach dem Trinken liegt die "
        r"Konzentration bei etwa $24{,}3$ mg/l.",
        r"Mit der Produktregel ist "
        r"$c'(t) = 40 \cdot e^{-0{,}5t} \cdot \left(1 - 0{,}5 \cdot t\right)$. "
        r"Der Faktor $e^{-0{,}5t}$ ist nie null, also $c'(t) = 0$ genau für $t = 2$. Davor ist "
        r"$c' > 0$, danach $c' < 0$ — ein Maximum. $c(2) = 80 \cdot e^{-1} \approx 29{,}4$: "
        r"nach **2 Stunden** rund $29{,}4$ mg/l.",
        r"Am stärksten abnehmend heißt: $c'$ hat ein Minimum, gesucht ist die Wendestelle. "
        r"$c''(t) = 40 \cdot e^{-0{,}5t} \cdot \left(0{,}25 \cdot t - 1\right) = 0$ für "
        r"$t = 4$, mit Vorzeichenwechsel. Dort ist "
        r"$c'(4) = -40 \cdot e^{-2} \approx -5{,}4$. Nach **4 Stunden** sinkt die "
        r"Konzentration am schnellsten, um etwa $5{,}4$ mg/l je Stunde.",
        r"Die Aussage ist **falsch**. Es ist $c(8) = 320 \cdot e^{-4} \approx 5{,}9$ mg/l, "
        r"also noch deutlich mehr als nichts. Grundsätzlicher: $e^{-0{,}5t} > 0$ für jedes $t$, "
        r"also wird $c(t)$ für $t > 0$ **nie** null — im Modell ist das Koffein zu keinem "
        r"Zeitpunkt vollständig abgebaut, es nähert sich der Wert nur der Null an.",
    ],
    falle=r"„Am stärksten abnehmend“ ist nicht der Tiefpunkt von $c$, sondern der "
          r"Wendepunkt. Gefragt ist das Minimum der Änderungsrate $c'$, also $c'' = 0$.",
    figs=[(fig_koffein(),
           "Der Modellgraph mit dem Hochpunkt H nach 2 Stunden und dem Wendepunkt W nach "
           "4 Stunden; im Wendepunkt ist die Tangente eingezeichnet.")],
    solfigs=[(fig_flaeche(),
              "Zur Einordnung: Die Fläche unter dem Graphen von 0 bis 8 beträgt rund "
              "145 mg·h/l — die Gesamtbelastung über den Beobachtungszeitraum.")],
)


def check():
    """Every number in the solutions, recomputed."""
    assert f(0) == 0 and f(3) == 0
    assert [x for x in range(-5, 8) if f(x) == 0] == [0, 3]
    assert df(1) == 0 and df(3) == 0
    assert f(1) == 4 and ddf(1) < 0
    assert f(3) == 0 and ddf(3) > 0
    assert ddf(2) == 0 and f(2) == 2
    assert df(0) == 9 and df(4) == 9
    assert all(df(x / 10.0) < 0 for x in range(11, 30))          # streng fallend auf (1,3)
    for m in (-2, 0, 5, 9, 20):                                   # Vieta: x1 + x2 = 4
        x1 = 2 - (1 + m / 3.0) ** 0.5
        x2 = 2 + (1 + m / 3.0) ** 0.5
        assert abs(x1 + x2 - 4) < 1e-12
        assert abs(df(x1) - m) < 1e-9 and abs(df(x2) - m) < 1e-9
    assert abs(df(2) - (-3)) < 1e-12                              # kleinstmoeglicher Anstieg
    assert abs(c(1) - 24.26) < 0.01
    assert abs(dc(2)) < 1e-12 and abs(c(2) - 29.43) < 0.01
    assert abs(dc(4) + 5.413) < 0.001 and abs(c(4) - 21.65) < 0.01
    assert abs(c(8) - 5.86) < 0.01
    ddc = lambda t: 40 * exp(-0.5 * t) * (0.25 * t - 1)
    assert abs(ddc(4)) < 1e-12 and ddc(3.9) < 0 < ddc(4.1)
    # Flaeche unter c von 0 bis 8, Stammfunktion -80(t+2)e^{-0,5t}
    A = lambda t: -80 * (t + 2) * exp(-0.5 * t)
    assert abs((A(8) - A(0)) - 145.35) < 0.02


s.verify(check)
s.save()
