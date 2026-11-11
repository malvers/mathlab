#!/usr/bin/env python3
"""Vergleichsarbeit-Training BGY Klasse 11 (Sachsen) - Teil A, ohne Hilfsmittel (Satz 2).

    python3 tools/aufgaben/va/teila2.py

Second set for Teil A of the Sachsen Vergleichsarbeit Mathematik, Berufliches Gymnasium
Klasse 11: six other Ankreuzaufgaben (base value in percent, a fraction term, a solution
set, Pythagorean triples, a sine function, two cards without replacement), the
exponential function 2^x with its mirror image and a rewritten exponent, and f(x) = k/x
tied to a rectangle whose sides change while its area stays. Two Ankreuz items share
one part, because the sheet layout allows at most four parts per task. Wording,
numbers and every figure are our own.
"""
import math
import os
import sys
from fractions import Fraction as Fr
from itertools import permutations
from math import pi

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402

# Two Ankreuz items share one part (the sheet allows four parts per task); an em
# space on both sides survives HTML whitespace collapsing and keeps them apart.
SEP = " ‖ "

# ------------------------------------------------ Aufgabe 2: 2^x und Verwandte ---
def f_exp(x):
    return 2.0 ** x


def g_exp(x):
    return 2.0 ** (-x)                       # f mirrored at the y-axis


def h_exp(x):
    return 2.0 ** (x + 2)                    # = 4 * 2^x


SCHNITT = (-1, 2)                            # g and h meet here

# ------------------------------------------------- Aufgabe 3: die Hyperbel -----
HP = (3, 4)                                  # P on the graph of k/x
K = HP[0] * HP[1]                            # 12
RA, RB = 3, 4                                # the rectangle of part c)
DA, DB = 1, 2                                # a shorter by 1, b longer by 2


def f_hyp(x):
    return K / x


# ----------------------------------------------------------------- figures ---
def fig_exp(full=False):
    """Task: f alone on a grid, room to sketch. Solution: g and h as well."""
    p = S.Plot((-3.6, 3.6), (-0.8, 8.8), w=440, h=392, pad=(40, 22, 18, 34))
    p.grid(1, 1)
    p.axes(1, 1, defer_labels=True)
    if full:
        p.curve(g_exp, -3.6, 3.6, S.GREEN, 2.1)
        p.curve(h_exp, -3.6, 3.6, S.INK, 2.1, dash="7 4")
    p.curve(f_exp, -3.6, 3.6, S.RED, 2.3)
    p.draw_labels()
    p.text(p.X(3.05), p.Y(6.3), "f", 15, S.RED, "start", italic=True, halo=S.PAPER)
    if full:
        p.text(p.X(-3.05), p.Y(6.3), "g", 15, S.GREEN, "end", italic=True, halo=S.PAPER)
        p.text(p.X(0.62), p.Y(7.3), "h", 15, S.INK, "end", italic=True, halo=S.PAPER)
        p.point(*SCHNITT, label="S", pos="above-left", color=S.INK)
        p.point(0, 4, color=S.INK)
        p.point(0, 1, color=S.RED)
        return p.svg("Die Graphen von f mit f(x) = 2 hoch x, von g mit g(x) = 2 hoch minus x "
                     "und von h mit h(x) = 2 hoch (x + 2); g und h schneiden sich in S(-1|2)")
    p.point(0, 1, color=S.RED)
    p.point(3, 8, color=S.RED)
    return p.svg("Der Graph von f mit f(x) = 2 hoch x durch (0|1) und (3|8) in einem "
                 "Koordinatensystem mit Gitter")


def fig_hyp(full=False):
    """Task: the grid with P only, for the sketch. Solution: the hyperbola and the two
    rectangles of part c), both with their far corner on the graph."""
    p = S.Plot((-0.7, 8.7), (-0.9, 12.9), w=470, h=440, pad=(40, 22, 18, 34))
    p.grid(1, 1)
    p.axes(1, 2, defer_labels=True)
    if full:
        a2, b2 = RA - DA, RB + DB
        p.poly([p.P(0, 0), p.P(RA, 0), p.P(RA, RB), p.P(0, RB)], stroke="none", width=0,
               fill=S.ORANGE, opacity=0.4)
        p.raw('<rect x="%s" y="%s" width="%s" height="%s" fill="%s" opacity="0.16"/>'
              % (S.fmt(p.X(0)), S.fmt(p.Y(b2)), S.fmt(p.X(a2) - p.X(0)),
                 S.fmt(p.Y(0) - p.Y(b2)), S.GREEN))
        p.poly([p.P(0, 0), p.P(a2, 0), p.P(a2, b2), p.P(0, b2)], stroke=S.GREEN, width=1.8)
        p.poly([p.P(0, 0), p.P(RA, 0), p.P(RA, RB), p.P(0, RB)], stroke=S.INK, width=1.3,
               dash="4 3")
        p.curve(f_hyp, 0.9, 8.7, S.RED, 2.3)
    p.draw_labels()
    p.point(*HP, label="P", pos="above-right", color=S.INK)
    if full:
        p.point(RA - DA, RB + DB, label="R", pos="above-right", color=S.INK)
        p.text(p.X(6.4), p.Y(2.6), "f", 15, S.RED, "start", italic=True, halo=S.PAPER)
        return p.svg("Die Hyperbel f(x) = 12/x mit P(3|4) und R(2|6); das Rechteck 3 mal 4 "
                     "orange, das Rechteck 2 mal 6 gruen, beide mit dem Flaecheninhalt 12")
    return p.svg("Leeres Koordinatensystem mit Gitter und dem Punkt P(3|4)")


# ------------------------------------------------------------------- sheet ---
s = Sheet("va-bgy11-teila2", "Teil A — ohne Hilfsmittel (Satz 2)",
          kind="Vergleichsarbeit-Training",
          suffix="",
          klasse="Berufliches Gymnasium · Klasse 11",
          sub="Berufliches Gymnasium · Klasse 11 · Vergleichsarbeit Mathematik · Teil A · "
              "25 Minuten, nur Zeichengeräte · drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Vergleichsarbeit-Training Mathematik Berufliches Gymnasium Klasse 11, Teil A "
               "ohne Hilfsmittel: sechs Ankreuzaufgaben zu Grundwert, Bruchterm, "
               "Lösungsmenge, Pythagoras, Sinusfunktion und Spielkarten, die "
               "Exponentialfunktion 2 hoch x mit Spiegelung und Umformung und Rechtecke unter "
               "einer Hyperbel, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/vergleichsarbeit.html", "Zur Übersicht"))

s.task(
    "Noch sechsmal ankreuzen", 1,
    r"Diese Aufgabe entspricht den Ankreuzaufgaben A1 bis A6 der Vergleichsarbeit; jede "
    r"Teilaufgabe enthält zwei davon. Bei jeder ist genau **eine** der fünf Antworten "
    r"richtig. Notieren Sie nur den Buchstaben. Taschenrechner und Formelsammlung sind "
    r"nicht zugelassen.",
    [
        r"**A1** Bei einer Mensa-Umfrage gaben $30\ \%$ der Befragten an, jeden Tag in der "
        r"Mensa zu essen. Das waren $48$ Personen. Wie viele Personen wurden befragt? • "
        r"(A) $78$ • (B) $144$ • (C) $160$ • (D) $1600$ • (E) $14{,}4$" + SEP +
        r"**A2** Für $x \neq -3$ ist der Term $\frac{x^2 - 9}{x + 3}$ äquivalent zu: • "
        r"(A) $x + 3$ • (B) $x^2 - 3$ • (C) $-3$ • (D) $x - 3$ • (E) $x - 9$",

        r"**A3** Welche Gleichung hat die Lösungsmenge $L = \{-2;\ 2\}$? • "
        r"(A) $x^2 + 4 = 0$ • (B) $(x - 2)^2 = 0$ • (C) $x^3 = 8$ • (D) $x^2 = 2x$ • "
        r"(E) $2x^2 = 8$" + SEP +
        r"**A4** Welches Zahlentripel kann **nicht** die Seitenlängen eines rechtwinkligen "
        r"Dreiecks angeben? • (A) $5;\ 12;\ 13$ • (B) $8;\ 15;\ 16$ • (C) $6;\ 8;\ 10$ • "
        r"(D) $9;\ 12;\ 15$ • (E) $7;\ 24;\ 25$",

        r"**A5** Für die in $\mathbb{R}$ definierte Funktion $f$ mit "
        r"$f(x) = 3 \cdot \sin(2x)$ ist genau eine Aussage **falsch**. Welche? • "
        r"(A) Der Wertebereich ist $-3 \leq y \leq 3$. • (B) Die kleinste Periode ist "
        r"$\pi$. • (C) Es gilt $f\left(\frac{\pi}{2}\right) = 3$. • (D) Der Graph ist "
        r"punktsymmetrisch zum Koordinatenursprung. • (E) $x = \pi$ ist eine Nullstelle "
        r"von $f$." + SEP +
        r"**A6** Aus einem Skatblatt mit $32$ Karten, darunter vier Asse, werden "
        r"nacheinander zwei Karten ohne Zurücklegen gezogen. Die Wahrscheinlichkeit für "
        r"zwei Asse beträgt: • (A) $\frac{3}{248}$ • (B) $\frac{1}{64}$ • "
        r"(C) $\frac{1}{8}$ • (D) $\frac{3}{256}$ • (E) $\frac{1}{4}$",
    ],
    [
        r"**A1:** Richtig ist **(C)**. $30\ \%$ sind $48$ Personen, also $10\ \%$ genau "
        r"$16$ Personen und $100\ \%$ genau $160$ Personen. (E) rechnet $30\ \%$ von $48$, "
        r"(B) ist $3 \cdot 48$, (D) teilt durch $0{,}03$ statt durch $0{,}3$, und (A) "
        r"addiert $48 + 30$. "
        " " r"**A2:** Richtig ist **(D)**. Der Zähler ist die dritte binomische Formel: "
        r"$x^2 - 9 = (x + 3)(x - 3)$, und der Faktor $x + 3$ kürzt sich heraus. Probe mit "
        r"$x = 2$: $\frac{4 - 9}{2 + 3} = -1 = 2 - 3$, die anderen vier ergeben $5$, $1$, "
        r"$-3$ und $-7$. (A) behält den falschen Faktor, und "
        r"(B), (C) und (E) entstehen, wenn man einzelne Summanden „kürzt“, etwa "
        r"$\frac{-9}{3} = -3$. Aus Summen darf man nicht kürzen.",

        r"**A3:** Richtig ist **(E)**. $2x^2 = 8$ ergibt $x^2 = 4$, also $x = -2$ oder "
        r"$x = 2$. (A) hat keine Lösung, weil $x^2 + 4$ nie kleiner als $4$ ist. (B) und (C) "
        r"haben nur die Lösung $2$, denn $(-2)^3 = -8$. (D) hat die Lösungen $0$ und $2$. "
        " " r"**A4:** Richtig ist **(B)**. Ein rechtwinkliges Dreieck gibt es genau dann, "
        r"wenn die Quadrate der beiden kleineren Zahlen zusammen das Quadrat der größten "
        r"ergeben. $8^2 + 15^2 = 64 + 225 = 289 = 17^2$, aber $16^2 = 256$. Die anderen "
        r"gehen auf: $25 + 144 = 169$, $36 + 64 = 100$, $81 + 144 = 225$ und "
        r"$49 + 576 = 625$.",

        r"**A5:** Falsch ist **(C)**. Es ist $f\left(\frac{\pi}{2}\right) = 3 \cdot \sin\pi "
        r"= 0$; den Wert $3$ erreicht $f$ schon bei $x = \frac{\pi}{4}$. (A) $\sin$ liegt "
        r"zwischen $-1$ und $1$, mal $3$ ergibt das $-3$ bis $3$. (B) Die Periode ist "
        r"$\frac{2\pi}{2} = \pi$. (D) $f(-x) = 3 \cdot \sin(-2x) = -f(x)$. "
        r"(E) $3 \cdot \sin(2\pi) = 0$. "
        " " r"**A6:** Richtig ist **(A)**. Die erste Karte ist ein Ass mit "
        r"$\frac{4}{32} = \frac{1}{8}$; danach sind noch drei Asse unter $31$ Karten: "
        r"$\frac{1}{8} \cdot \frac{3}{31} = \frac{3}{248}$. (B) $= \left(\frac{1}{8}\right)^2$ "
        r"gilt mit Zurücklegen, (D) vergisst, dass beim zweiten Zug nur noch $31$ Karten da "
        r"sind, (C) ist nur der erste Zug, und (E) addiert $\frac{1}{8} + \frac{1}{8}$.",
    ],
    falle=r"Bei A1 ist $30\ \%$ der Prozentsatz, $48$ der Prozentwert und die Zahl der "
          r"Befragten der gesuchte Grundwert: $G = \frac{W}{p} = \frac{48}{0{,}3} = 160$. "
          r"Bei A5 hilft eine Probe an einer markanten Stelle mehr als jede Regel.",
)

s.task(
    "Die Exponentialfunktion zur Basis 2", 2,
    r"Gegeben ist die in $\mathbb{R}$ definierte Funktion $f$ mit $f(x) = 2^x$. Die "
    r"Abbildung zeigt ihren Graphen. Die Aufgabe ist ohne Taschenrechner zu lösen.",
    [
        r"Geben Sie die Funktionswerte $f(-2)$ und $f(3)$ an und bestimmen Sie die Stelle, "
        r"an der $f$ den Wert $64$ annimmt.",
        r"Der Graph der Funktion $g$ entsteht durch Spiegelung des Graphen von $f$ an der "
        r"$y$-Achse. Geben Sie eine Gleichung von $g$ an und zeigen Sie, dass der Punkt "
        r"$R(-3 \mid 8)$ auf dem Graphen von $g$ liegt.",
        r"Gegeben ist außerdem die Funktion $h$ mit $h(x) = 2^{x + 2}$. Zeigen Sie, dass "
        r"$h(x) = 4 \cdot 2^x$ gilt, und beschreiben Sie zwei Möglichkeiten, wie der Graph "
        r"von $h$ aus dem Graphen von $f$ hervorgeht.",
        r"Skizzieren Sie die Graphen von $g$ und $h$ in die Abbildung und berechnen Sie die "
        r"Koordinaten ihres Schnittpunkts.",
    ],
    [
        r"$f(-2) = 2^{-2} = \frac{1}{4}$ und $f(3) = 2^3 = 8$. Wegen $64 = 2^6$ nimmt $f$ "
        r"den Wert $64$ an der Stelle $x = 6$ an.",

        r"Spiegeln an der $y$-Achse heißt, $x$ durch $-x$ zu ersetzen: "
        r"$g(x) = 2^{-x} = \left(\frac{1}{2}\right)^x$. Probe: $g(-3) = 2^{3} = 8$, also "
        r"liegt $R$ auf dem Graphen von $g$. $R$ ist das Spiegelbild des Punktes "
        r"$(3 \mid 8)$ auf dem Graphen von $f$.",

        r"Nach dem Potenzgesetz $a^{m + n} = a^m \cdot a^n$ ist "
        r"$2^{x + 2} = 2^x \cdot 2^2 = 4 \cdot 2^x$. Der Graph von $h$ entsteht deshalb aus "
        r"dem von $f$ entweder durch eine **Verschiebung um $2$ nach links** oder durch "
        r"eine **Streckung mit dem Faktor $4$ in $y$-Richtung**. Beides liefert dieselbe "
        r"Kurve, zum Beispiel ist $h(0) = 4 = f(2)$.",

        r"Der Graph von $g$ fällt und geht durch $(-2 \mid 4)$, $(0 \mid 1)$ und "
        r"$\left(1 \mid \frac{1}{2}\right)$; der Graph von $h$ steigt und geht durch "
        r"$(-2 \mid 1)$, $(0 \mid 4)$ und $(1 \mid 8)$. Schnittpunkt: $2^{-x} = 2^{x + 2}$ "
        r"gilt genau dann, wenn die Exponenten gleich sind, also $-x = x + 2$ und $x = -1$. "
        r"Dann ist $y = 2^{1} = 2$, der Schnittpunkt ist $S(-1 \mid 2)$.",
    ],
    falle=r"Bei c) ist $2^{x + 2}$ **nicht** dasselbe wie $2^x + 2$; das wäre eine "
          r"Verschiebung um $2$ nach oben. Und das Plus im Exponenten verschiebt nach "
          r"**links**, nicht nach rechts, genau wie beim Scheitelpunkt von $(x + 2)^2$.",
    figs=[(fig_exp(), "Der Graph der Funktion f, mit Gitter für die Skizze.")],
    solfigs=[(fig_exp(full=True), "Zu d): f rot, g grün, h gestrichelt. g und h schneiden "
                                  "sich in S(−1 | 2), h schneidet die y-Achse bei 4.")],
)

s.task(
    "Rechtecke unter einer Hyperbel", 3,
    r"Für $x > 0$ ist die Funktion $f$ mit $f(x) = \frac{k}{x}$ und einer Konstanten "
    r"$k > 0$ gegeben. Ihr Graph verläuft durch den Punkt $P(3 \mid 4)$. Die Aufgabe ist "
    r"ohne Taschenrechner zu lösen.",
    [
        r"Bestimmen Sie $k$ und skizzieren Sie den Graphen von $f$ für $1 \leq x \leq 8$ in "
        r"die Abbildung.",
        r"Zu jedem Punkt $Q(u \mid f(u))$ des Graphen gehört das Rechteck mit den Ecken "
        r"$O(0 \mid 0)$, $(u \mid 0)$, $Q$ und $(0 \mid f(u))$. Zeigen Sie, dass alle diese "
        r"Rechtecke denselben Flächeninhalt haben.",
        r"Ein Rechteck mit den Seiten $a$ und $b$ hat den Flächeninhalt $12\ \mathrm{cm}^2$. "
        r"Verkürzt man die Seite $a$ um $1$ cm und verlängert die Seite $b$ um $2$ cm, so "
        r"bleibt der Flächeninhalt gleich. Berechnen Sie $a$ und $b$.",
        r"Erläutern Sie, wie man die Lösung von c) am Graphen von $f$ ablesen kann, und "
        r"begründen Sie, dass es nur ein solches Rechteck gibt.",
    ],
    [
        r"$4 = \frac{k}{3}$ ergibt $k = 12$, also $f(x) = \frac{12}{x}$. Für die Skizze "
        r"genügen einige Punkte: $(1 \mid 12)$, $(2 \mid 6)$, $(3 \mid 4)$, $(4 \mid 3)$, "
        r"$(6 \mid 2)$ und $(8 \mid 1{,}5)$. Der Graph fällt und nähert sich beiden Achsen, "
        r"ohne sie zu erreichen.",

        r"Das Rechteck hat die Seitenlängen $u$ und $f(u) = \frac{12}{u}$, also den "
        r"Flächeninhalt $u \cdot \frac{12}{u} = 12$, unabhängig von $u$. Genau das bedeutet "
        r"$f(x) = \frac{k}{x}$: Das Produkt der beiden Koordinaten ist für alle Punkte des "
        r"Graphen gleich $k$.",

        r"Aus $a \cdot b = 12$ und $(a - 1)(b + 2) = 12$ folgt durch Ausmultiplizieren "
        r"$ab + 2a - b - 2 = ab$, also $b = 2a - 2$. Eingesetzt: $a(2a - 2) = 12$, also "
        r"$a^2 - a - 6 = 0$ und $(a - 3)(a + 2) = 0$. Da $a$ eine Länge ist, gilt "
        r"$a = 3$ cm und damit $b = 4$ cm. Probe: Das neue Rechteck hat "
        r"$2\ \mathrm{cm} \cdot 6\ \mathrm{cm} = 12\ \mathrm{cm}^2$.",

        r"Nach b) gehört jedes Rechteck mit $12\ \mathrm{cm}^2$ zu einem Punkt $(a \mid b)$ "
        r"auf dem Graphen. Gesucht ist ein Punkt, von dem aus man $1$ nach links und $2$ "
        r"nach oben geht und wieder auf dem Graphen landet. Das ist $P(3 \mid 4)$, denn "
        r"$f(2) = 6 = 4 + 2$; der zweite Punkt ist $R(2 \mid 6)$. Nur ein solches Rechteck "
        r"gibt es, weil die quadratische Gleichung aus c) nur die positive Lösung $a = 3$ "
        r"hat. Am Graphen sieht man es auch: Der Zuwachs "
        r"$f(a - 1) - f(a) = \frac{12}{a(a - 1)}$ auf einer Einheit nach links wird mit "
        r"wachsendem $a$ immer kleiner und ist deshalb nur einmal genau $2$.",
    ],
    falle=r"Bei c) führt der Ansatz $(a - 1)(b + 2) = ab$ allein noch nicht zum Ziel; erst "
          r"zusammen mit $ab = 12$ hat man zwei Gleichungen für die zwei Unbekannten. Und "
          r"die zweite Lösung $a = -2$ muss ausdrücklich verworfen werden.",
    figs=[(fig_hyp(), "Koordinatensystem für die Skizze, mit dem Punkt P.")],
    solfigs=[(fig_hyp(full=True), "Zu a), c) und d): Der Graph von f. Das Rechteck mit P "
                                  "ist orange, das veränderte Rechteck mit R grün; beide "
                                  "haben den Flächeninhalt 12.")],
)


def check():
    """Every number in the solutions, recomputed - exact where a Fraction can do it."""
    # --- A1 Grundwert -----------------------------------------------------------------
    grund = Fr(48) / Fr(30, 100)
    assert grund == 160 and Fr(48, 3) == 16                    # (C), 10 % = 16
    assert Fr(30, 100) * 48 == Fr(144, 10)                     # (E) 14,4
    assert 3 * 48 == 144 and 48 + 30 == 78                     # (B), (A)
    assert Fr(48) / Fr(3, 100) == 1600                         # (D)
    # --- A2 Bruchterm -----------------------------------------------------------------
    for x in [Fr(k, 3) for k in range(-20, 21) if k != -9]:
        term = (x * x - 9) / (x + 3)
        assert term == x - 3                                    # (D)
        assert (x + 3) * (x - 3) == x * x - 9
    x = Fr(2)
    assert (x * x - 9) / (x + 3) == -1 == x - 3                # Probe mit x = 2
    wrong = (lambda x: x + 3, lambda x: x * x - 3, lambda x: Fr(-3), lambda x: x - 9)
    assert [w(x) for w in wrong] == [5, 1, -3, -7]             # (A), (B), (C), (E) fallen durch
    assert all(w(Fr(1)) != -2 for w in wrong[2:]) and wrong[1](Fr(1)) == -2   # x = 1 taugt nicht
    assert Fr(-9, 3) == -3
    # --- A3 Loesungsmenge -------------------------------------------------------------
    eqs = {"A": lambda x: x * x + 4 == 0, "B": lambda x: (x - 2) ** 2 == 0,
           "C": lambda x: x ** 3 == 8, "D": lambda x: x * x == 2 * x,
           "E": lambda x: 2 * x * x == 8}
    grid = [Fr(k, 4) for k in range(-40, 41)]
    sols = {k: {x for x in grid if e(x)} for k, e in eqs.items()}
    assert sols == {"A": set(), "B": {2}, "C": {2}, "D": {0, 2}, "E": {-2, 2}}
    # no roots off the grid: (A) x^2 + 4 >= 4, (B) square, (C) x^3 - 8 = (x - 2)(x^2 + 2x + 4)
    # with discriminant 4 - 16 < 0, (D) x(x - 2), (E) 2(x - 2)(x + 2)
    assert 2 ** 2 - 4 * 4 < 0 and (-2) ** 3 == -8
    # --- A4 Pythagoras ----------------------------------------------------------------
    tripel = {"A": (5, 12, 13), "B": (8, 15, 16), "C": (6, 8, 10), "D": (9, 12, 15),
              "E": (7, 24, 25)}
    for k, (a, b, c) in tripel.items():
        assert (a * a + b * b == c * c) == (k != "B"), k
    assert 64 + 225 == 289 == 17 ** 2 and 16 ** 2 == 256
    assert [a * a + b * b for k, (a, b, c) in tripel.items() if k != "B"] == [169, 100, 225, 625]
    assert (25, 144, 36, 64, 81, 144, 49, 576) == (5 ** 2, 12 ** 2, 6 ** 2, 8 ** 2, 9 ** 2,
                                                    12 ** 2, 7 ** 2, 24 ** 2)
    # --- A5 Sinus ---------------------------------------------------------------------
    f = lambda x: 3 * math.sin(2 * x)
    ys = [f(k * pi / 1800) for k in range(3601)]
    assert abs(min(ys) + 3) < 1e-9 and abs(max(ys) - 3) < 1e-9           # (A) richtig
    assert all(abs(f(x + pi) - f(x)) < 1e-9 for x in (0.3, 1.1, 2.0))     # (B) Periode pi
    assert abs(f(0.3 + pi / 2) - f(0.3)) > 0.5                            # pi/2 ist keine
    assert abs(f(pi / 2)) < 1e-12 and abs(f(pi / 4) - 3) < 1e-12          # (C) falsch
    assert all(abs(f(-x) + f(x)) < 1e-12 for x in (0.2, 0.9, 1.7))        # (D) richtig
    assert abs(f(pi)) < 1e-12                                             # (E) richtig
    # --- A6 Skat ----------------------------------------------------------------------
    karten = ["A"] * 4 + ["x"] * 28
    zuege = list(permutations(range(32), 2))
    p2 = Fr(sum(1 for i, j in zuege if karten[i] == karten[j] == "A"), len(zuege))
    assert p2 == Fr(4, 32) * Fr(3, 31) == Fr(3, 248)           # (A)
    assert Fr(4, 32) == Fr(1, 8)
    assert Fr(1, 8) ** 2 == Fr(1, 64)                          # (B) mit Zuruecklegen
    assert Fr(1, 8) * Fr(3, 32) == Fr(3, 256)                  # (D) 32 statt 31
    assert Fr(1, 8) + Fr(1, 8) == Fr(1, 4)                     # (E)
    assert len({p2, Fr(1, 64), Fr(1, 8), Fr(3, 256), Fr(1, 4)}) == 5
    # --- Aufgabe 2 --------------------------------------------------------------------
    assert Fr(2) ** -2 == Fr(1, 4) and 2 ** 3 == 8 and 2 ** 6 == 64
    assert g_exp(-3) == 8 and f_exp(3) == 8                    # R und sein Spiegelbild
    assert all(abs(g_exp(x) - 0.5 ** x) < 1e-12 for x in (-2.5, 0.3, 3.1))
    for x in (-3.0, -1.5, 0.0, 0.7, 2.0):
        assert abs(h_exp(x) - 4 * f_exp(x)) < 1e-12            # Streckung mit 4
        assert abs(h_exp(x) - f_exp(x + 2)) < 1e-12            # Verschiebung um 2 nach links
    assert h_exp(0) == 4 == f_exp(2)
    assert h_exp(1) != f_exp(1) + 2                            # die Falle: 8, nicht 4
    assert [g_exp(x) for x in (-2, 0, 1)] == [4, 1, 0.5]
    assert [h_exp(x) for x in (-2, 0, 1)] == [1, 4, 8]
    xs = Fr(-2, 2)                                             # -x = x + 2
    assert -xs == xs + 2 and xs == SCHNITT[0]
    assert g_exp(SCHNITT[0]) == h_exp(SCHNITT[0]) == SCHNITT[1] == 2
    # --- Aufgabe 3 --------------------------------------------------------------------
    assert K == 12 and Fr(K, HP[0]) == HP[1]
    assert [Fr(K, x) for x in (1, 2, 3, 4, 6, 8)] == [12, 6, 4, 3, 2, Fr(3, 2)]
    for u in (Fr(1, 3), Fr(5, 2), Fr(7)):
        assert u * Fr(K) / u == K                              # b) Flaeche immer 12
    # c) solve exactly: b = 2a - 2 from (a - 1)(b + 2) = ab, then a(2a - 2) = 12
    for a in [Fr(k, 4) for k in range(-40, 41) if k != 0]:
        b = Fr(K) / a
        same = (a - DA) * (b + DB) == a * b
        assert same == (a in (3, -2)), a
        assert same == (b == 2 * a - 2)
    assert all(a * a - a - 6 == (a - 3) * (a + 2) for a in range(-5, 6))
    assert (RA, RB) == (3, 4) and RA * RB == K
    assert (RA - DA) * (RB + DB) == 2 * 6 == K
    # d) R(2|6) lies on the graph; the gain 12/(a(a-1)) falls, so it hits 2 only once
    assert Fr(K, RA - DA) == RB + DB == 6
    gain = lambda a: Fr(K, a - 1) - Fr(K, a)
    assert all(gain(a) == Fr(12, a * (a - 1)) for a in (Fr(3, 2), Fr(3), Fr(9, 2)))
    pts = [Fr(k, 10) for k in range(11, 120)]
    assert all(gain(pts[i + 1]) < gain(pts[i]) for i in range(len(pts) - 1))
    assert [a for a in pts if gain(a) == 2] == [3]


s.verify(check)
s.save()
