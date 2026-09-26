#!/usr/bin/env python3
"""BLF-Training Gymnasium Klasse 10 - Funktionen (Teil B, mit MMS).

    python3 tools/aufgaben/blf/funktionen.py

Aufgabe 1 of Teil B is a function every year: a shifted parabola (2023/24), a power
function with a pole and a parameter pair a, b to read off (2024/25), a graph to read
and a perpendicular line (2022/23). This sheet trains those three moves and a
parabola as a model of a real curve. Wording, numbers and every figure are our own.
"""
import math
import os
import sys
from fractions import Fraction as Fr
from math import sqrt

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# ----------------------------------------------------- Aufgabe 1: Parabel -----
def f1(x):
    return x * x - 2 * x - 3                  # = (x - 1)^2 - 4


def g1(x):
    return (x + 2) ** 2 - 2                   # 3 nach links, 2 nach oben


# ---------------------------------------------- Aufgabe 2: Potenzfunktion -----
def f2(x):
    return 1 / (x - 2) ** 2 + 1


def g2(x):
    return -6 * x + 20


# the three common points: x - 2 = t with 6t^3 - 7t^2 + 1 = 0, t = 1, 1/2, -1/3
T_ROOTS = (Fr(1), Fr(1, 2), Fr(-1, 3))
PTS2 = [(2 + t, 1 / t ** 2 + 1) for t in T_ROOTS]


# -------------------------------------------------- Aufgabe 3: Springbrunnen --
def h(x):
    return -0.4 * x * x + 2 * x + 0.5


def k(x):
    return -0.25 * x * x + 2 * x + 0.5


H_REACH = (5 + sqrt(30)) / 2                  # h(x) = 0, positive root
K_REACH = 4 + sqrt(18)                        # k(x) = 0, positive root


# ----------------------------------------------------------------- figures ---
def fig_parabeln():
    p = S.Plot((-5.4, 4.6), (-5.2, 6.2), w=440, h=380, pad=(36, 22, 18, 30))
    p.grid(1, 1)
    p.axes(1, 1, defer_labels=True)
    p.curve(f1, -2.2, 4.2, S.RED, 2.1)
    p.curve(g1, -5.3, 1.2, S.GREEN, 2.1, dash="7 4")
    p.draw_labels()
    p.point(1, -4, "S", "below", color=S.RED)
    p.point(-2, -2, "S'", "below", color=S.GREEN)
    p.point(-1, 0, None, color=S.INK, size=3)
    p.point(3, 0, None, color=S.INK, size=3)
    p.point(0, -3, None, color=S.INK, size=3)
    p.text(p.X(3.55), p.Y(5.2), "f", 15, S.RED, "start", italic=True, halo=S.PAPER)
    p.text(p.X(-4.95), p.Y(4.6), "g", 15, S.GREEN, "start", italic=True, halo=S.PAPER)
    return p.svg("Die Parabel f mit dem Scheitel S(1|-4) und die um 3 nach links und 2 nach "
                 "oben verschobene Parabel g mit dem Scheitel S'(-2|-2)")


def fig_pol():
    p = S.Plot((-1.6, 5.6), (-0.8, 11.5), w=440, h=400, pad=(36, 22, 18, 30))
    p.grid(1, 1)
    p.axes(1, 2, defer_labels=True)
    p.line(p.X(2), p.Y(-0.8), p.X(2), p.Y(11.5), S.MUTED, 1.2, dash="5 4")
    p.line(p.X(-1.6), p.Y(1), p.X(5.6), p.Y(1), S.MUTED, 1.2, dash="5 4")
    p.curve(f2, -1.6, 1.97, S.RED, 2.1, n=400)
    p.curve(f2, 2.03, 5.6, S.RED, 2.1, n=400)
    p.curve(g2, 1.2, 3.55, S.GREEN, 2.0)
    p.draw_labels()
    for x, y in PTS2:
        p.point(float(x), float(y), None, color=S.INK, size=3.4)
    p.text(p.X(4.7), p.Y(2.0) - 6, "f", 15, S.RED, "start", italic=True, halo=S.PAPER)
    p.text(p.X(3.3), p.Y(0.6), "g", 15, S.GREEN, "start", italic=True, halo=S.PAPER)
    p.text(p.X(2) + 5, p.Y(11.1), "x = 2", 11.5, S.MUTED, "start", halo=S.PAPER)
    p.text(p.X(-1.5), p.Y(1) - 6, "y = 1", 11.5, S.MUTED, "start", halo=S.PAPER)
    return p.svg("Der Graph der Funktion f mit der Polstelle 2 und der waagerechten "
                 "Asymptote y = 1, dazu die fallende Gerade g, die ihn dreimal schneidet")


def fig_brunnen(both=False):
    p = S.Plot((-0.6, 9.0), (-0.5, 5.2), w=540, h=300, pad=(40, 50, 18, 34))
    p.grid(1, 1)
    p.axes(1, 1, xlabel="x in m", ylabel="h in m", defer_labels=True)
    p.line(p.X(-0.1), p.Y(0), p.X(-0.1), p.Y(0.5), S.INK, 5, cap="butt")   # the nozzle
    p.curve(h, 0, H_REACH, S.RED, 2.2)
    if both:
        p.curve(k, 0, K_REACH, S.GREEN, 2.2, dash="7 4")
        p.point(4, 4.5, None, color=S.GREEN, size=3.2)
    p.point(2.5, 3, None, color=S.RED, size=3.2)
    p.draw_labels()
    p.text(p.X(1.3), p.Y(3.25), "h", 15, S.RED, "end", italic=True, halo=S.PAPER)
    if both:
        p.text(p.X(6.6), p.Y(3.6), "k", 15, S.GREEN, "start", italic=True, halo=S.PAPER)
    return p.svg("Wasserstrahl eines Springbrunnens als Parabelbogen, der in 0,5 m Hoehe "
                 "an der Duese beginnt" + (", dazu der weitere Strahl k" if both else ""))


# ------------------------------------------------------------------- sheet ---
s = Sheet("blf-gy-funktionen", "Funktionen",
          kind="BLF-Training",
          suffix="",
          klasse="Gymnasium · Klasse 10",
          sub="Gymnasium · Klasse 10 · Besondere Leistungsfeststellung Mathematik · Teil B, "
              "mit MMS und Formelsammlung · drei Aufgaben, Anforderungsbereiche I bis III",
          desc="BLF-Training Mathematik Gymnasium Klasse 10: quadratische Funktionen, "
               "Potenzfunktion mit Polstelle und Parametern, eine Parabel als Modell eines "
               "Springbrunnens, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/blf.html", "Zur Übersicht"))

s.task(
    "Die verschobene Normalparabel", 1,
    r"Gegeben ist die in $\mathbb{R}$ definierte Funktion $f$ mit "
    r"$f(x) = x^2 - 2x - 3$.",
    [
        r"Geben Sie die Nullstellen von $f$ und die Koordinaten des Schnittpunkts des "
        r"Graphen mit der $y$-Achse an.",
        r"Ermitteln Sie die Koordinaten des Scheitelpunkts und den Wertebereich von $f$.",
        r"Der Graph von $f$ wird um $3$ Einheiten nach links und um $2$ Einheiten nach oben "
        r"verschoben. Geben Sie eine Gleichung der so entstehenden Funktion $g$ an.",
        r"Geben Sie das größte Intervall an, in dem $f$ monoton fallend ist.",
    ],
    [
        r"$x^2 - 2x - 3 = 0$ mit der $p$-$q$-Formel: $x = 1 \pm \sqrt{1 + 3} = 1 \pm 2$, "
        r"also $x_1 = -1$ und $x_2 = 3$. Probe über die Faktorzerlegung: "
        r"$(x + 1)(x - 3) = x^2 - 2x - 3$. Der Schnittpunkt mit der $y$-Achse ist "
        r"$S_y(0 \mid -3)$.",

        r"Quadratisch ergänzen: $x^2 - 2x - 3 = (x - 1)^2 - 1 - 3 = (x - 1)^2 - 4$. "
        r"Scheitelpunkt $S(1 \mid -4)$. Die Parabel ist nach oben geöffnet, also ist "
        r"$W_f = \{y \mid y \in \mathbb{R};\ y \geq -4\}$. Der Scheitel liegt auch genau "
        r"in der Mitte zwischen den Nullstellen $-1$ und $3$.",

        r"Verschieben nach links heißt: $x$ durch $x + 3$ ersetzen; nach oben: $2$ addieren. "
        r"$g(x) = (x + 3 - 1)^2 - 4 + 2 = (x + 2)^2 - 2$, ausmultipliziert "
        r"$g(x) = x^2 + 4x + 2$. Der Scheitel wandert von $(1 \mid -4)$ nach "
        r"$(-2 \mid -2)$.",

        r"Links vom Scheitel fällt die nach oben geöffnete Parabel: $f$ ist monoton fallend "
        r"für $x \leq 1$, also im Intervall $(-\infty;\,1]$.",
    ],
    falle=r"Bei c) verschiebt $x + 3$ den Graphen nach **links**, nicht nach rechts. Wer "
          r"unsicher ist, prüft am Scheitel: $g(-2)$ muss $f(1) + 2 = -2$ sein.",
    solfigs=[(fig_parabeln(),
              "Die Parabel f (rot) mit ihrem Scheitel S und die verschobene Parabel g "
              "(grün, gestrichelt) mit dem Scheitel S'.")],
)

s.task(
    "Potenzfunktion mit Polstelle", 2,
    r"Gegeben ist die Funktion $f$ mit $f(x) = \dfrac{1}{(x - 2)^2} + 1$ in ihrem "
    r"größtmöglichen Definitionsbereich. Die Abbildung zeigt ihren Graphen und die "
    r"Gerade $g$ mit $g(x) = -6x + 20$.",
    [
        r"Geben Sie die Polstelle und den Wertebereich von $f$ an.",
        r"Bestimmen Sie alle Argumente von $f$, deren Funktionswert $5$ beträgt.",
        r"Ermitteln Sie die Koordinaten aller gemeinsamen Punkte der Graphen von $f$ und "
        r"$g$. Berechnen Sie den Abstand der beiden gemeinsamen Punkte, die rechts von der "
        r"Polstelle liegen.",
        r"Die Funktion $h$ mit $h(x) = \dfrac{1}{(x - a)^2} + b$ hat den Definitionsbereich "
        r"$D_h = \{x \mid x \in \mathbb{R};\ x \neq -3\}$ und den Wertebereich "
        r"$W_h = \{y \mid y \in \mathbb{R};\ y > -2\}$. Geben Sie $a$ und $b$ an.",
    ],
    [
        r"Der Nenner wird bei $x = 2$ null: Polstelle $x_p = 2$. Der Bruch "
        r"$\frac{1}{(x - 2)^2}$ ist immer positiv und nimmt jeden positiven Wert an, aber "
        r"nie $0$. Also $W_f = \{y \mid y \in \mathbb{R};\ y > 1\}$.",

        r"$\frac{1}{(x - 2)^2} + 1 = 5$ ergibt $(x - 2)^2 = \frac{1}{4}$, also "
        r"$x - 2 = \pm\frac{1}{2}$. Die Argumente sind $x_1 = \frac{3}{2}$ und "
        r"$x_2 = \frac{5}{2}$, symmetrisch zur Polstelle.",

        r"Mit dem MMS: $\frac{1}{(x - 2)^2} + 1 = -6x + 20$ hat die Lösungen "
        r"$x = \frac{5}{3}$, $x = \frac{5}{2}$ und $x = 3$. Die Punkte sind "
        r"$\left(\frac{5}{3} \mid 10\right)$, $\left(\frac{5}{2} \mid 5\right)$ und "
        r"$(3 \mid 2)$. Rechts von $x = 2$ liegen die beiden letzten, ihr Abstand ist "
        r"$d = \sqrt{\left(3 - \frac{5}{2}\right)^2 + (2 - 5)^2} = \sqrt{\frac{1}{4} + 9} = "
        r"\frac{\sqrt{37}}{2} \approx 3{,}04$.",

        r"Die Definitionslücke liegt dort, wo der Nenner null ist, also bei $x = a$: "
        r"$a = -3$. Die waagerechte Asymptote liegt bei $y = b$, und der Wertebereich "
        r"beginnt knapp darüber: $b = -2$. Also $h(x) = \frac{1}{(x + 3)^2} - 2$.",
    ],
    falle=r"Bei d) wird aus $x \neq -3$ im Term $(x + 3)$, das heißt $a = -3$ und nicht "
          r"$a = 3$. Die Gleichung in c) führt ohne Rechner auf "
          r"$6t^3 - 7t^2 + 1 = 0$ mit $t = x - 2$; deshalb ist hier das MMS gefragt.",
    figs=[(fig_pol(),
           "Der Graph von f mit den beiden Asymptoten x = 2 und y = 1 (gestrichelt) und "
           "die Gerade g.")],
)

s.task(
    "Der Springbrunnen", 3,
    r"Der Wasserstrahl eines Springbrunnens verläuft näherungsweise entlang des Graphen "
    r"der Funktion $h$ mit $h(x) = -0{,}4x^2 + 2x + 0{,}5$ mit $x \geq 0$. Dabei ist $x$ "
    r"der waagerechte Abstand von der Düse und $h(x)$ die Höhe über dem Boden, beide in "
    r"Metern.",
    [
        r"Berechnen Sie die größte Höhe des Wasserstrahls und in welchem waagerechten "
        r"Abstand von der Düse sie erreicht wird.",
        r"Berechnen Sie, in welchem Abstand von der Düse der Strahl auf dem Boden auftrifft.",
        r"Ermitteln Sie den Bereich, in dem der Strahl höher als $2$ m ist, und geben Sie "
        r"dessen Breite an.",
        r"Deuten Sie die Zahl $0{,}5$ im Funktionsterm im Sachzusammenhang. Bei höherem "
        r"Wasserdruck wird der Strahl durch $k(x) = -0{,}25x^2 + 2x + 0{,}5$ beschrieben. "
        r"Berechnen Sie, um wie viel Meter weiter der Strahl dann reicht.",
    ],
    [
        r"Scheitel über quadratische Ergänzung: $h(x) = -0{,}4 \cdot (x^2 - 5x) + 0{,}5 = "
        r"-0{,}4 \cdot (x - 2{,}5)^2 + 2{,}5 + 0{,}5$. Der Scheitel ist $(2{,}5 \mid 3)$: "
        r"Der Strahl ist in $2{,}5$ m Abstand am höchsten, nämlich $3$ m hoch.",

        r"$-0{,}4x^2 + 2x + 0{,}5 = 0$ ist gleichbedeutend mit $x^2 - 5x - 1{,}25 = 0$. "
        r"$x = 2{,}5 \pm \sqrt{6{,}25 + 1{,}25} = 2{,}5 \pm \sqrt{7{,}5}$. Nur die positive "
        r"Lösung passt: $x \approx 5{,}24$. Der Strahl trifft etwa $5{,}2$ m von der Düse "
        r"entfernt auf.",

        r"$-0{,}4x^2 + 2x + 0{,}5 = 2$ ergibt $x^2 - 5x + 3{,}75 = 0$ mit "
        r"$x = 2{,}5 \pm \sqrt{2{,}5}$, also $x_1 \approx 0{,}92$ und $x_2 \approx 4{,}08$. "
        r"Zwischen etwa $0{,}9$ m und $4{,}1$ m ist der Strahl höher als $2$ m; der "
        r"Bereich ist $2\sqrt{2{,}5} = \sqrt{10} \approx 3{,}16$ m breit.",

        r"$h(0) = 0{,}5$: Die Düse sitzt $0{,}5$ m über dem Boden, dort beginnt der Strahl. "
        r"Für $k$: $-0{,}25x^2 + 2x + 0{,}5 = 0$, also $x^2 - 8x - 2 = 0$ und "
        r"$x = 4 + \sqrt{18} \approx 8{,}24$. Der neue Strahl reicht "
        r"$8{,}24 - 5{,}24 \approx 3{,}0$ m weiter.",
    ],
    falle=r"Bei b) liefert die Gleichung auch eine negative Lösung. Sie liegt „hinter“ der "
          r"Düse und gehört nicht zum Modell, denn $h$ ist nur für $x \geq 0$ definiert. "
          r"Solche Lösungen müssen in der Antwort ausdrücklich verworfen werden.",
    figs=[(fig_brunnen(), "Der Wasserstrahl h. Der dunkle Balken links ist die Düse.")],
    solfigs=[(fig_brunnen(both=True),
              "Zu d): Bei höherem Druck steigt der Strahl auf 4,5 m und reicht rund 3 m "
              "weiter.")],
)


def check():
    """Every number in the solutions, recomputed - exact where a Fraction can do it."""
    # --- Aufgabe 1 -----------------------------------------------------------------
    assert f1(-1) == 0 and f1(3) == 0 and f1(0) == -3
    for x in range(-5, 6):
        assert f1(x) == (x - 1) ** 2 - 4 == (x + 1) * (x - 3)
        assert g1(x) == f1(x + 3) + 2 == x * x + 4 * x + 2
    assert f1(1) == -4 and all(f1(Fr(x, 7)) >= -4 for x in range(-50, 50))
    assert (-1 + 3) / 2 == 1                                   # Mitte der Nullstellen
    assert g1(-2) == -2 == f1(1) + 2
    assert all(f1(Fr(x, 4)) > f1(Fr(x + 1, 4)) for x in range(-20, 4))    # fallend bis 1
    assert all(f1(Fr(x, 4)) < f1(Fr(x + 1, 4)) for x in range(4, 20))     # steigend ab 1
    # --- Aufgabe 2 -----------------------------------------------------------------
    f2x = lambda x: 1 / (x - 2) ** 2 + 1                       # exakt fuer Fractions
    assert f2x(Fr(3, 2)) == 5 and f2x(Fr(5, 2)) == 5
    for t in T_ROOTS:
        assert 6 * t ** 3 - 7 * t ** 2 + 1 == 0
        x = 2 + t
        assert f2x(x) == -6 * x + 20
    assert [p for p in PTS2] == [(3, 2), (Fr(5, 2), 5), (Fr(5, 3), 10)]
    right = [p for p in PTS2 if p[0] > 2]
    assert len(right) == 2
    d2 = (right[0][0] - right[1][0]) ** 2 + (right[0][1] - right[1][1]) ** 2
    assert d2 == Fr(37, 4) and round(sqrt(37) / 2, 2) == 3.04
    # der kubische Term hat keine weiteren Nullstellen: Grad 3, drei gefunden
    assert len(set(T_ROOTS)) == 3
    assert all(f2x(Fr(k, 10)) > 1 for k in range(-30, 80) if k != 20)
    hx = lambda x: 1 / (x + 3) ** 2 - 2
    assert all(hx(Fr(k, 10)) > -2 for k in range(-80, 50) if k != -30)
    # --- Aufgabe 3 -----------------------------------------------------------------
    assert abs(h(2.5) - 3) < 1e-12
    assert all(h(x / 100) <= 3 + 1e-12 for x in range(0, 600))
    for x in (0.0, 1.3, 4.0):
        assert abs(h(x) - (-0.4 * (x - 2.5) ** 2 + 3)) < 1e-12
    assert abs(h(H_REACH)) < 1e-12 and abs(H_REACH - (2.5 + sqrt(7.5))) < 1e-12
    assert round(H_REACH, 2) == 5.24 and 2.5 - sqrt(7.5) < 0
    x1, x2 = 2.5 - sqrt(2.5), 2.5 + sqrt(2.5)
    assert abs(h(x1) - 2) < 1e-12 and abs(h(x2) - 2) < 1e-12
    assert round(x1, 2) == 0.92 and round(x2, 2) == 4.08
    assert abs((x2 - x1) - sqrt(10)) < 1e-12 and round(sqrt(10), 2) == 3.16
    assert h(0) == 0.5
    assert abs(k(K_REACH)) < 1e-12 and round(K_REACH, 2) == 8.24
    assert abs(k(4) - 4.5) < 1e-12
    assert round(K_REACH - H_REACH, 1) == 3.0


s.verify(check)
s.save()
