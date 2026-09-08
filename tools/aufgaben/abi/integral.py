#!/usr/bin/env python3
"""Abitur-Training BGY - Integralrechnung (Flaechen und Mittelwerte).

    python3 tools/aufgaben/abi/integral.py

Task types follow the Sachsen originals 2022-2025 (area between graph and x-axis with a
sign change, area between two graphs plus a line that splits it in a given ratio, a rate
in context whose integral is the stock). Wording, numbers and every figure are our own -
the originals are not reproduced.
"""
import os
import sys
from fractions import Fraction

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# --------------------------------------------------------------- functions ---
def f1(x):
    """Task 1: x(x-2)(x+1), zeros at -1, 0 and 2."""
    return x ** 3 - x ** 2 - 2 * x


def f2(x):
    """Task 2: downward parabola, meets the line at x = 1 and x = 4."""
    return -x ** 2 + 6 * x - 5


def g2(x):
    return x - 1


def h2(x):
    """The dividing line through P(1|0) with slope 5/2."""
    return 2.5 * (x - 1)


def rate(t):
    """Task 3: PV power in kW, t hours after 6 o'clock."""
    return 3 * t - 0.25 * t ** 2


# ----------------------------------------------------------------- figures ---
def fig_flaechen():
    pl = S.Plot((-1.8, 2.9), (-2.7, 1.6), w=520, h=340)
    pl.grid(1, 1)
    pl.axes(1, 1, xlabel="x", ylabel="y", origin=None)
    pl.area(f1, -1, 0, S.GREEN, 0.45)
    pl.area(f1, 0, 2, S.ORANGE, 0.60)
    pl.curve(f1, -1.6, 2.5, S.RED, 2.2)
    for u in (-1, 0, 2):
        pl.point(u, 0, None, color=S.INK, size=3.2)
    pl.text(pl.X(-0.55), pl.Y(0.16), "A1", 13.5, S.INK, "middle", italic=True, halo=S.PAPER)
    pl.text(pl.X(1.15), pl.Y(-1.15), "A2", 13.5, S.INK, "middle", italic=True, halo=S.PAPER)
    return pl.svg("Graph von f mit dem Flaechenstueck A1 ueber der x-Achse und dem "
                  "Flaechenstueck A2 darunter")


def fig_linse():
    pl = S.Plot((-0.9, 5.7), (-1.9, 5.3), w=520, h=340)
    pl.grid(1, 1)
    pl.axes(1, 1, xlabel="x", ylabel="y", origin=None, skip_y=(0, -1))
    pl.area_between(f2, g2, 1, 4, S.ORANGE, 0.50)
    pl.curve(f2, -0.5, 5.6, S.RED, 2.2)
    pl.curve(g2, -0.8, 5.6, S.INK, 1.7)
    pl.point(1, 0, "P", "above-left", color=S.GREEN)
    pl.point(4, 3, "Q", "below-right", color=S.GREEN)
    pl.text(pl.X(4.65), pl.Y(2.4), "f", 15, S.RED, "start", italic=True, halo=S.PAPER)
    pl.text(pl.X(5.05), pl.Y(4.45), "g", 15, S.INK, "start", italic=True, halo=S.PAPER)
    return pl.svg("Parabel und Gerade schliessen zwischen den Schnittpunkten P und Q "
                  "eine Flaeche ein")


def fig_halbierung():
    pl = S.Plot((-0.9, 5.7), (-1.9, 5.3), w=520, h=320)
    pl.grid(1, 1)
    pl.axes(1, 1, xlabel="x", ylabel="y", origin=None, skip_y=(0, -1))
    pl.area_between(f2, g2, 1, 2.5, S.ORANGE, 0.55)
    pl.area_between(f2, g2, 2.5, 4, S.GREEN, 0.40)
    pl.curve(f2, -0.5, 5.6, S.RED, 2.2)
    pl.curve(g2, -0.8, 5.6, S.INK, 1.7)
    pl.seg((2.5, g2(2.5)), (2.5, f2(2.5)), S.INK, 1.5, dash="4 3")
    pl.text(pl.X(2.5), pl.Y(4.55), "x = 2,5", 12.5, S.INK, "middle", halo=S.PAPER)
    pl.text(pl.X(1.8), pl.Y(1.62), "2,25", 12, S.INK, "middle", halo=S.PAPER)
    pl.text(pl.X(3.2), pl.Y(2.95), "2,25", 12, S.INK, "middle", halo=S.PAPER)
    return pl.svg("Die Parallele zur y-Achse durch x gleich 2,5 zerlegt die Flaeche in "
                  "zwei gleich grosse Teile")


def fig_teilung():
    pl = S.Plot((-0.9, 5.7), (-1.9, 5.3), w=520, h=320)
    pl.grid(1, 1)
    pl.axes(1, 1, xlabel="x", ylabel="y", origin=None, skip_y=(0, -1))
    pl.area_between(f2, h2, 1, 2.5, S.RED, 0.30)
    pl.area_between(h2, g2, 1, 2.5, S.ORANGE, 0.50)
    pl.area_between(f2, g2, 2.5, 4, S.ORANGE, 0.50)
    pl.curve(f2, -0.5, 5.6, S.RED, 2.2)
    pl.curve(g2, -0.8, 5.6, S.INK, 1.7)
    pl.seg((1, 0), (2.95, h2(2.95)), S.GREEN, 2.0, clip=True)
    pl.point(1, 0, "P", "above-left", color=S.GREEN)
    pl.point(2.5, 3.75, "R", "above-left", color=S.GREEN)
    pl.text(pl.X(3.1), pl.Y(4.9), "h", 15, S.GREEN, "start", italic=True, halo=S.PAPER)
    pl.text(pl.X(1.86), pl.Y(2.33), "1", 12, S.INK, "middle", halo=S.PAPER)
    pl.text(pl.X(3.15), pl.Y(2.85), "7", 13.5, S.INK, "middle", halo=S.PAPER)
    return pl.svg("Die Gerade h durch P zerlegt die Flaeche in ein kleines Stueck bei P "
                  "und ein siebenmal so grosses Reststueck")


def fig_leistung():
    pl = S.Plot((-1.0, 13.6), (-1.4, 10.6), w=520, h=330, pad=(46, 22, 20, 34))
    pl.grid(1, 2)
    pl.axes(2, 2, xlabel="t", ylabel="p", origin=None)
    pl.area(rate, 0, 12, S.ORANGE, 0.40)
    pl.curve(rate, 0, 12, S.RED, 2.3)
    pl.dashto(6, 9)
    pl.point(6, 9, None, color=S.RED)
    pl.text(pl.X(13.4), pl.Y(9.9), "p in kW, t in Stunden nach 6 Uhr", 12, S.MUTED, "end")
    return pl.svg("Leistungsgraph der Anlage von 0 bis 12 Stunden, die Flaeche darunter "
                  "ist die erzeugte Energie")


def fig_ueberschuss():
    pl = S.Plot((-1.0, 13.6), (-1.4, 10.6), w=520, h=330, pad=(46, 22, 20, 34))
    pl.grid(1, 2)
    pl.axes(2, 2, xlabel="t", ylabel="p", origin=None)
    pl.area(rate, 0, 12, S.ORANGE, 0.22)
    pl.area_between(rate, lambda t: 5.0, 2, 10, S.GREEN, 0.50)
    pl.curve(rate, 0, 12, S.RED, 2.3)
    pl.seg((-1.0, 5), (13.6, 5), S.INK, 1.5, dash="6 4")
    pl.point(2, 5, None, color=S.INK, size=3.2)
    pl.point(10, 5, None, color=S.INK, size=3.2)
    pl.text(pl.X(13.4), pl.Y(5.45), "Verbrauch 5 kW", 12, S.INK, "end", halo=S.PAPER)
    pl.text(pl.X(6), pl.Y(6.7), "Überschuss", 13, S.INK, "middle", halo=S.PAPER)
    return pl.svg("Zwischen zwei und zehn Stunden liegt der Leistungsgraph ueber der "
                  "Verbrauchslinie von fuenf Kilowatt")


# ------------------------------------------------------------------- sheet ---
s = Sheet("abitur-bgy-integral", "Integralrechnung — Flächen und Mittelwerte",
          kind="Abitur-Training",
          suffix="",
          klasse="Berufliches Gymnasium",
          sub="Berufliches Gymnasium · Pflichtaufgabe 1 · Grund- und Leistungskurs · "
              "drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Abitur-Training Mathematik BGY, Integralrechnung: Fläche zwischen Graph "
               "und x-Achse, Fläche zwischen zwei Graphen mit Teilungsverhältnis und eine "
               "Zuflussrate im Sachkontext, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/abitur.html", "Zur Übersicht"))

s.task(
    "Was das Integral verschweigt", 1,
    r"Gegeben ist die in $\mathbb{R}$ definierte Funktion $f$ mit "
    r"$f(x) = x^3 - x^2 - 2 \cdot x$. Der Graph von $f$ schließt mit der $x$-Achse zwei "
    r"Flächenstücke vollständig ein: das Stück $A_1$ über der Achse und das Stück $A_2$ "
    r"darunter (siehe Abbildung).",
    [
        r"Berechnen Sie die Nullstellen von $f$.",
        r"Geben Sie eine Stammfunktion $F$ von $f$ an und berechnen Sie den Inhalt des "
        r"Flächenstücks $A_1$.",
        r"Berechnen Sie den Inhalt des Flächenstücks $A_2$ und den gesamten Inhalt der "
        r"beiden eingeschlossenen Flächenstücke.",
        r"Berechnen Sie $\int_{-1}^{2} f(x)\,dx$ und den Mittelwert der Funktionswerte von "
        r"$f$ über dem Intervall $[-1;\,2]$. Erklären Sie, warum das Integral hier nicht "
        r"der Flächeninhalt ist.",
    ],
    [
        r"Ausklammern statt Formel: $f(x) = x \cdot (x^2 - x - 2) = x \cdot (x-2) \cdot (x+1)$. "
        r"Ein Produkt ist genau dann null, wenn ein Faktor null ist, also "
        r"$x_1 = -1$, $x_2 = 0$ und $x_3 = 2$. Alle drei Nullstellen sind **einfach**, der "
        r"Graph wechselt dort jeweils das Vorzeichen.",
        r"$F(x) = \dfrac{1}{4} x^4 - \dfrac{1}{3} x^3 - x^2$, denn $F'(x) = x^3 - x^2 - 2x$. "
        r"Über der Achse liegt das Stück zwischen $x = -1$ und $x = 0$: "
        r"$A_1 = \int_{-1}^{0} f(x)\,dx = F(0) - F(-1) = 0 - \left(\dfrac{1}{4} + "
        r"\dfrac{1}{3} - 1\right) = \dfrac{5}{12} \approx 0{,}42$ FE.",
        r"Zwischen $x = 0$ und $x = 2$ ist $f(x) \leq 0$, das Integral wird dort negativ: "
        r"$\int_{0}^{2} f(x)\,dx = F(2) - F(0) = \left(4 - \dfrac{8}{3} - 4\right) - 0 = "
        r"-\dfrac{8}{3}$. Der Flächeninhalt ist der Betrag davon, also "
        r"$A_2 = \dfrac{8}{3} \approx 2{,}67$ FE. Zusammen ergibt sich "
        r"$A_1 + A_2 = \dfrac{5}{12} + \dfrac{32}{12} = \dfrac{37}{12} \approx 3{,}08$ FE.",
        r"$\int_{-1}^{2} f(x)\,dx = F(2) - F(-1) = -\dfrac{8}{3} + \dfrac{5}{12} = "
        r"-\dfrac{9}{4} = -2{,}25$. Der Mittelwert der Funktionswerte ist "
        r"$\bar{f} = \dfrac{1}{2 - (-1)} \int_{-1}^{2} f(x)\,dx = \dfrac{1}{3} \cdot "
        r"\left(-\dfrac{9}{4}\right) = -\dfrac{3}{4}$. Das Integral zählt Flächenstücke "
        r"unter der Achse **negativ**: Es liefert $A_1 - A_2 = \dfrac{5}{12} - "
        r"\dfrac{8}{3} = -\dfrac{9}{4}$ und damit gerade nicht $A_1 + A_2$. Für den "
        r"Flächeninhalt muss man an jeder Nullstelle mit Vorzeichenwechsel trennen und "
        r"die Beträge der Teilintegrale addieren.",
    ],
    falle=r"Der Betrag steht **außen um jedes Teilintegral**, nicht um das Gesamtintegral: "
          r"$\left|\int_{-1}^{0} f\right| + \left|\int_{0}^{2} f\right| = \dfrac{37}{12}$, "
          r"aber $\left|\int_{-1}^{2} f\right| = \dfrac{9}{4}$. Wer die Nullstellen "
          r"überspringt, verrechnet sich hier um mehr als $0{,}8$ Flächeneinheiten.",
    figs=[(fig_flaechen(),
           "Der Graph von f schließt mit der x-Achse zwei Flächenstücke ein: A1 über der "
           "Achse (grün), A2 darunter (orange).")],
)

s.task(
    "Die Linse zwischen Parabel und Gerade", 2,
    r"Gegeben sind die in $\mathbb{R}$ definierten Funktionen $f$ mit "
    r"$f(x) = -x^2 + 6 \cdot x - 5$ und $g$ mit $g(x) = x - 1$. Ihre Graphen schließen "
    r"eine Fläche vollständig ein (siehe Abbildung).",
    [
        r"Berechnen Sie die Schnittstellen der beiden Graphen und geben Sie die "
        r"Schnittpunkte $P$ und $Q$ an.",
        r"Berechnen Sie den Inhalt $A$ der eingeschlossenen Fläche sowie den mittleren "
        r"senkrechten Abstand der beiden Graphen über dem Intervall $[1;\,4]$.",
        r"Zeigen Sie, dass die Parallele zur $y$-Achse mit der Gleichung $x = 2{,}5$ die "
        r"eingeschlossene Fläche halbiert.",
        r"Die Gerade $h$ verläuft durch den Punkt $P$ und hat den Anstieg $m$ mit "
        r"$1 < m < 4$. Bestimmen Sie $m$ so, dass $h$ die eingeschlossene Fläche im "
        r"Verhältnis $1 : 7$ teilt.",
    ],
    [
        r"Gleichsetzen: $-x^2 + 6x - 5 = x - 1$, also $x^2 - 5x + 4 = 0$ und damit "
        r"$(x-1) \cdot (x-4) = 0$. Die Schnittstellen sind $x = 1$ und $x = 4$. Mit "
        r"$g(1) = 0$ und $g(4) = 3$ folgt $P(1 \mid 0)$ und $Q(4 \mid 3)$.",
        r"Zwischen den Schnittstellen verläuft der Graph von $f$ oberhalb des Graphen von "
        r"$g$, die Differenzfunktion ist $d(x) = f(x) - g(x) = -x^2 + 5 \cdot x - 4$. Damit "
        r"$A = \int_1^4 d(x)\,dx = \left[-\dfrac{1}{3}x^3 + \dfrac{5}{2}x^2 - 4x\right]_1^4 "
        r"= \dfrac{8}{3} - \left(-\dfrac{11}{6}\right) = \dfrac{9}{2} = 4{,}5$ FE. Der "
        r"mittlere senkrechte Abstand ist $\bar{d} = \dfrac{1}{4-1} \cdot \dfrac{9}{2} = "
        r"\dfrac{3}{2} = 1{,}5$.",
        r"$\int_1^{2{,}5} d(x)\,dx = \left[-\dfrac{1}{3}x^3 + \dfrac{5}{2}x^2 - "
        r"4x\right]_1^{2{,}5} = \dfrac{5}{12} - \left(-\dfrac{11}{6}\right) = \dfrac{9}{4}$, "
        r"und das ist genau $\dfrac{1}{2} \cdot \dfrac{9}{2}$. Beide Teile sind also gleich "
        r"groß. Das ist kein Zufall: $d$ ist eine nach unten geöffnete Parabel mit den "
        r"Nullstellen $1$ und $4$, ihr Scheitel liegt bei $x = \dfrac{1+4}{2} = 2{,}5$. Der "
        r"Graph von $d$ ist symmetrisch zu dieser Geraden, und damit auch die Fläche.",
        r"Es ist $h(x) = m \cdot (x-1)$. Wegen $f(x) = -(x-1) \cdot (x-5)$ gilt "
        r"$f(x) - h(x) = (x-1) \cdot (5 - m - x)$, die zweite Schnittstelle von $h$ mit der "
        r"Parabel ist also $x = 5 - m$. Mit der Streifenbreite $c = (5-m) - 1 = 4 - m$ "
        r"und der Substitution $u = x - 1$ ergibt sich "
        r"$\int_1^{5-m} (x-1)(5-m-x)\,dx = \int_0^{c} u \cdot (c-u)\,du = \dfrac{c^3}{6}$. "
        r"Das kleinere Stück soll $\dfrac{1}{8}$ der Gesamtfläche sein: "
        r"$\dfrac{c^3}{6} = \dfrac{1}{8} \cdot \dfrac{9}{2} = \dfrac{9}{16}$, also "
        r"$c^3 = \dfrac{27}{8}$ und $c = \dfrac{3}{2}$. Damit ist "
        r"$m = 4 - \dfrac{3}{2} = 2{,}5$ und $h(x) = 2{,}5 \cdot x - 2{,}5$; die Gerade "
        r"trifft die Parabel in $R(2{,}5 \mid 3{,}75)$. Die Teilflächen sind "
        r"$\dfrac{9}{16}$ und $\dfrac{63}{16}$, ihr Verhältnis ist $1 : 7$.",
    ],
    falle=r"Der Inhalt zwischen zwei Graphen ist **immer** $\int (\text{oben} - "
          r"\text{unten})\,dx$ — ob die Graphen dabei über oder unter der $x$-Achse "
          r"liegen, spielt keine Rolle: Verschiebt man beide um denselben Betrag nach "
          r"oben, hebt sich die Verschiebung in der Differenz weg. Wer stattdessen zwei "
          r"Einzelflächen zur $x$-Achse ausrechnet und voneinander abzieht, bekommt "
          r"spätestens beim nächsten Vorzeichenwechsel Unsinn.",
    figs=[(fig_linse(),
           "Die Graphen von f und g schließen zwischen P(1|0) und Q(4|3) eine Fläche ein.")],
    solfigs=[(fig_halbierung(),
              "Zu c): Die Parallele zur y-Achse durch x = 2,5 geht durch den Scheitel der "
              "Differenzparabel — beide Teile haben den Inhalt 2,25 FE."),
             (fig_teilung(),
              "Zu d): Die Gerade h durch P mit dem Anstieg 2,5 trifft die Parabel in "
              "R(2,5 | 3,75). Das obere Stück ist 0,5625 FE groß, der Rest 3,9375 FE — "
              "das Verhältnis 1 : 7.")],
)

s.task(
    "Was die Anlage am Tag liefert", 3,
    r"Eine Photovoltaikanlage liefert an einem wolkenlosen Sommertag die Leistung $p$ mit "
    r"$p(t) = 3 \cdot t - 0{,}25 \cdot t^2$ für $0 \leq t \leq 12$. Dabei ist $t$ die Zeit "
    r"in Stunden nach $6$ Uhr und $p(t)$ die Leistung in Kilowatt (kW). Der Inhalt der "
    r"Fläche zwischen dem Graphen und der $t$-Achse gibt die in diesem Zeitraum erzeugte "
    r"Energie in Kilowattstunden (kWh) an.",
    [
        r"Berechnen Sie, wie viel Energie die Anlage an diesem Tag insgesamt erzeugt, und "
        r"geben Sie die mittlere Leistung über die zwölf Stunden an.",
        r"Bestimmen Sie den Zeitpunkt, zu dem die Hälfte der Tagesenergie erzeugt ist.",
        r"Der Haushalt verbraucht durchgehend $5$ kW. Bestimmen Sie den Zeitraum, in dem "
        r"die Anlage mehr liefert, als verbraucht wird, und berechnen Sie die in diesem "
        r"Zeitraum anfallende Überschussenergie.",
        r"Beurteilen Sie die Aussage: „Ein Speicher mit einer Kapazität von 20 kWh genügt, "
        r"um den gesamten Überschuss dieses Tages aufzunehmen.“",
    ],
    [
        r"$\int_0^{12} \left(3t - 0{,}25 \cdot t^2\right) dt = \left[1{,}5 \cdot t^2 - "
        r"\dfrac{t^3}{12}\right]_0^{12} = 216 - 144 = 72$. Die Anlage erzeugt an diesem Tag "
        r"**72 kWh**. Die mittlere Leistung ist $\bar{p} = \dfrac{1}{12} \cdot 72 = 6$ kW — "
        r"deutlich weniger als die größte Leistung $p(6) = 9$ kW.",
        r"Gesucht ist $t$ mit $1{,}5 \cdot t^2 - \dfrac{t^3}{12} = 36$, also "
        r"$t^3 - 18 \cdot t^2 + 432 = 0$. Die Lösung $t = 6$ erkennt man durch Probieren; "
        r"Abspalten des Linearfaktors ergibt $(t-6) \cdot (t^2 - 12t - 72) = 0$ mit den "
        r"weiteren Lösungen $t = 6 \pm 6\sqrt{3}$, die beide außerhalb von $[0;\,12]$ "
        r"liegen. Nach **6 Stunden**, also um **12 Uhr**, ist die Hälfte erzeugt. Das "
        r"passt zur Symmetrie: Wegen $p(6-u) = p(6+u) = 9 - 0{,}25 \cdot u^2$ ist der Graph "
        r"symmetrisch zur Geraden $t = 6$.",
        r"$3t - 0{,}25 \cdot t^2 = 5$ führt auf $t^2 - 12 \cdot t + 20 = 0$, also "
        r"$(t-2) \cdot (t-10) = 0$. Zwischen $t = 2$ und $t = 10$ — das entspricht **8 Uhr "
        r"bis 16 Uhr** — liegt der Graph über der Verbrauchslinie. Der Überschuss ist "
        r"$\int_2^{10} \left(3t - 0{,}25 \cdot t^2 - 5\right) dt = \left[1{,}5 \cdot t^2 - "
        r"\dfrac{t^3}{12} - 5t\right]_2^{10} = \dfrac{50}{3} - \left(-\dfrac{14}{3}\right) "
        r"= \dfrac{64}{3} \approx 21{,}3$ kWh.",
        r"Die Aussage ist **falsch**. Der Überschuss beträgt $\dfrac{64}{3} \approx 21{,}3$ "
        r"kWh, rund $1{,}3$ kWh mehr, als der Speicher fasst. An einem einzelnen "
        r"Funktionswert ist das nicht abzulesen: Die größte Überschussleistung ist "
        r"$p(6) - 5 = 4$ kW, und $4 \cdot 8 = 32$ kWh ist nur eine grobe obere Schranke — "
        r"an den Rändern des Zeitraums ist der Überschuss null. Erst das Integral über den "
        r"gesamten Zeitraum liefert die tatsächlich gespeicherte Menge.",
    ],
    falle=r"Kilowatt sind keine Kilowattstunden. $p(6) = 9$ ist eine **Leistung** und sagt "
          r"nur, wie schnell in diesem Augenblick Energie erzeugt wird. Die Menge steckt "
          r"in der Fläche unter dem Graphen — deshalb hilft bei d) kein Funktionswert, "
          r"sondern nur das Integral.",
    figs=[(fig_leistung(),
           "Die Leistung der Anlage über den Tag. Der Inhalt der orangen Fläche ist die "
           "erzeugte Energie.")],
    solfigs=[(fig_ueberschuss(),
              "Zu c) und d): Zwischen t = 2 und t = 10 liegt der Graph über der "
              "Verbrauchslinie von 5 kW. Die grüne Fläche ist der Überschuss von rund "
              "21,3 kWh.")],
)


# ------------------------------------------------------------------ checks ---
def poly_int(coeffs, a, b):
    """Exact definite integral of a polynomial {power: coefficient}, as a Fraction."""
    a, b = Fraction(a), Fraction(b)
    total = Fraction(0)
    for k, c in coeffs.items():
        total += Fraction(c) * (b ** (k + 1) - a ** (k + 1)) / (k + 1)
    return total


def simpson(fn, a, b, n=2000):
    """Numeric counter-check - exact for polynomials up to degree three."""
    h = (b - a) / float(n)
    total = fn(a) + fn(b)
    for i in range(1, n):
        total += (4 if i % 2 else 2) * fn(a + i * h)
    return total * h / 3.0


P1 = {3: 1, 2: -1, 1: -2}                                    # f
D2 = {2: -1, 1: 5, 0: -4}                                    # f - g
FH = {2: -1, 1: Fraction(7, 2), 0: Fraction(-5, 2)}          # f - h, h(x) = 2,5(x-1)
P3 = {1: 3, 2: Fraction(-1, 4)}                              # p
P3V = {1: 3, 2: Fraction(-1, 4), 0: -5}                      # p - 5


def check():
    """Every number in the solutions, recomputed - exact and numerically."""
    # --- Aufgabe 1 ---------------------------------------------------------
    assert f1(-1) == 0 and f1(0) == 0 and f1(2) == 0
    for k in range(-30, 31):                                  # factorisation
        x = k / 10.0
        assert abs(f1(x) - x * (x - 2) * (x + 1)) < 1e-12
    assert [k for k in range(-6, 7) if f1(k) == 0] == [-1, 0, 2]
    assert all(f1(k / 10.0) > 0 for k in range(-9, 0))        # A1 above the axis
    assert all(f1(k / 10.0) < 0 for k in range(1, 20))        # A2 below the axis
    a1 = poly_int(P1, -1, 0)
    a2 = -poly_int(P1, 0, 2)
    assert a1 == Fraction(5, 12) and a2 == Fraction(8, 3)
    assert a1 + a2 == Fraction(37, 12)
    assert abs(float(a1) - 0.42) < 0.005 and abs(float(a2) - 2.67) < 0.005
    assert abs(float(a1 + a2) - 3.08) < 0.005
    ges = poly_int(P1, -1, 2)
    assert ges == Fraction(-9, 4) == a1 - a2
    assert ges / 3 == Fraction(-3, 4)                         # Mittelwert
    assert abs(simpson(f1, -1.0, 0.0) - float(a1)) < 1e-9
    assert abs(simpson(f1, 0.0, 2.0) + float(a2)) < 1e-9
    assert abs(simpson(f1, -1.0, 2.0) - float(ges)) < 1e-9
    F1 = lambda x: Fraction(1, 4) * x ** 4 - Fraction(1, 3) * x ** 3 - x ** 2
    assert F1(0) - F1(-1) == a1 and F1(2) - F1(0) == -a2 and F1(2) - F1(-1) == ges
    assert float(a1 + a2) - float(-ges) > 0.8                 # the trap costs > 0,8 FE

    # --- Aufgabe 2 ---------------------------------------------------------
    assert f2(1) == g2(1) == 0 and f2(4) == g2(4) == 3
    for k in range(-20, 61):                                  # d(x) = -(x-1)(x-4)
        x = k / 10.0
        assert abs((f2(x) - g2(x)) - (-(x - 1) * (x - 4))) < 1e-12
    assert all(f2(k / 10.0) > g2(k / 10.0) for k in range(11, 40))
    A = poly_int(D2, 1, 4)
    assert A == Fraction(9, 2)
    assert abs(simpson(lambda x: f2(x) - g2(x), 1.0, 4.0) - 4.5) < 1e-9
    assert A / 3 == Fraction(3, 2)                            # mittlerer Abstand
    PHI = lambda x: -Fraction(1, 3) * x ** 3 + Fraction(5, 2) * x ** 2 - 4 * x
    assert PHI(4) == Fraction(8, 3) and PHI(1) == Fraction(-11, 6)
    assert PHI(4) - PHI(1) == A
    half = poly_int(D2, 1, Fraction(5, 2))
    assert half == Fraction(9, 4) == A / 2
    assert PHI(Fraction(5, 2)) == Fraction(5, 12)
    assert Fraction(5, 2) == -Fraction(5) / (2 * Fraction(-1))   # Scheitel von d
    # h(x) = 2,5(x-1): second intersection at x = 5 - m
    assert abs(h2(2.5) - 3.75) < 1e-12 and abs(f2(2.5) - 3.75) < 1e-12
    for k in range(-20, 61):
        x = k / 10.0
        assert abs((f2(x) - h2(x)) - (x - 1) * (2.5 - x)) < 1e-12
    assert all(h2(k / 10.0) >= g2(k / 10.0) for k in range(10, 26))   # h above g on [1;2,5]
    assert all(f2(k / 10.0) >= h2(k / 10.0) for k in range(10, 26))   # and below f
    oben = poly_int(FH, 1, Fraction(5, 2))
    assert oben == Fraction(9, 16)
    assert A - oben == Fraction(63, 16)
    assert 7 * oben == A - oben                               # ratio 1 : 7
    assert oben == A / 8
    assert abs(float(oben) - 0.5625) < 1e-12
    assert abs(float(A - oben) - 3.9375) < 1e-12
    assert abs(simpson(lambda x: f2(x) - h2(x), 1.0, 2.5) - 0.5625) < 1e-9
    c = Fraction(3, 2)                                        # c^3/6 = 9/16
    assert c ** 3 / 6 == Fraction(9, 16) and 4 - c == Fraction(5, 2)

    # --- Aufgabe 3 ---------------------------------------------------------
    tag = poly_int(P3, 0, 12)
    assert tag == 72 and abs(simpson(rate, 0.0, 12.0) - 72.0) < 1e-9
    assert tag / 12 == 6                                      # mittlere Leistung
    assert rate(6) == 9 and all(rate(k / 10.0) <= 9 + 1e-12 for k in range(0, 121))
    assert poly_int(P3, 0, 6) == 36 == tag / 2
    kub = lambda t: t ** 3 - 18 * t ** 2 + 432                # 1,5t^2 - t^3/12 = 36
    assert kub(6) == 0
    for k in range(-40, 200):                                 # factorisation
        t = k / 10.0
        assert abs(kub(t) - (t - 6) * (t * t - 12 * t - 72)) < 1e-9
    r1, r2 = 6 - 6 * 3 ** 0.5, 6 + 6 * 3 ** 0.5
    assert abs(kub(r1)) < 1e-9 and abs(kub(r2)) < 1e-9
    assert r1 < 0 and r2 > 12                                 # both outside [0;12]
    prev = Fraction(0)                                        # energy grows strictly, so
    for k in range(1, 121):                                   # 36 kWh is reached once only
        now = poly_int(P3, 0, Fraction(k, 10))
        assert now > prev
        assert (now == 36) == (k == 60)
        prev = now
    assert rate(2) == 5 and rate(10) == 5
    for k in range(-20, 141):                                 # p - 5 = -0,25(t-2)(t-10)
        t = k / 10.0
        assert abs((rate(t) - 5) + 0.25 * (t - 2) * (t - 10)) < 1e-12
    ueber = poly_int(P3V, 2, 10)
    assert ueber == Fraction(64, 3)
    assert abs(simpson(lambda t: rate(t) - 5, 2.0, 10.0) - float(ueber)) < 1e-9
    assert abs(float(ueber) - 21.33) < 0.01
    assert float(ueber) > 20 and abs(float(ueber) - 20 - 1.33) < 0.01
    assert rate(6) - 5 == 4 and 4 * 8 == 32                   # crude upper bound
    PP = lambda t: Fraction(3, 2) * Fraction(t) ** 2 - Fraction(t) ** 3 / 12
    assert PP(12) == 72 and PP(6) == 36
    assert PP(10) - 50 == Fraction(50, 3) and PP(2) - 10 == Fraction(-14, 3)
    for u in (0, 1, 2, 3.5, 6):                               # symmetry of p
        assert abs(rate(6 - u) - rate(6 + u)) < 1e-12
        assert abs(rate(6 + u) - (9 - 0.25 * u * u)) < 1e-12


s.verify(check)
s.save()
