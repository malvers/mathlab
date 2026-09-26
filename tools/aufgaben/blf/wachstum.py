#!/usr/bin/env python3
"""BLF-Training Gymnasium Klasse 10 - Wachstum und periodische Vorgaenge (Teil B, mit MMS).

    python3 tools/aufgaben/blf/wachstum.py

Lernbereich 1 of Klasse 10 (exponential growth, the sine function as a model) and the
logarithm from Lernbereich 4. The BLF had a runner on a staircase with bounded growth
(2022/23), a drone flying a sine curve and a Ferris wheel (2023/24). Wording, numbers
and every figure are our own.
"""
import math
import os
import sys
from math import cos, exp, log, pi

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# ------------------------------------------------ Aufgabe 1: der Algenteppich --
A0, QA = 4.0, 1.35                              # m^2 at the start, factor per week


def alge(t):
    return A0 * QA ** t


T_100 = log(100 / A0) / log(QA)
T_DOUBLE = log(2) / log(QA)

# ----------------------------------------------------- Aufgabe 2: Riesenrad ----
AXIS, R_RAD, T_TURN, GONDELN = 20.0, 18.0, 12.0, 24


def hoehe(t):
    """Height of a gondola that starts at the bottom, t in minutes."""
    return AXIS - R_RAD * cos(2 * pi * t / T_TURN)


# ------------------------------------------------------- Aufgabe 3: der Tee ----
ROOM, DIFF0, KT = 20.0, 70.0, 0.08


def tee(t):
    return ROOM + DIFF0 * exp(-KT * t)


T_60 = log(DIFF0 / 40.0) / KT
T_HALF = log(2) / KT


# ----------------------------------------------------------------- figures ---
def fig_rad():
    c = S.Canvas(300, 300)
    cx, cy, r = 150, 132, 108
    c.line(cx - 60, 286, cx, cy, S.INK, 2)
    c.line(cx + 60, 286, cx, cy, S.INK, 2)
    c.line(20, 286, 280, 286, S.INK, 1.6)
    c.raw('<circle cx="%d" cy="%d" r="%d" fill="none" stroke="%s" stroke-width="2"/>'
          % (cx, cy, r, S.INK))
    for i in range(GONDELN):
        a = 2 * pi * i / GONDELN
        x, y = cx + r * math.sin(a), cy + r * math.cos(a)
        c.line(cx, cy, x, y, S.MUTED, 0.7)
        c.circle(x, y, 4.2 if i else 5.4, S.RED if i == 0 else S.ORANGE, S.INK, 0.8)
    c.circle(cx, cy, 4, S.INK, S.INK, 0)
    # right of the right-hand support, with a short leader to the red gondola
    c.line(cx + 6, cy + r + 4, cx + 58, cy + r + 16, S.RED, 0.9)
    c.text(cx + 62, cy + r + 20, "Einstieg", 11.5, S.RED, "start")
    return c.svg("Riesenrad mit 24 Gondeln; die rote Gondel steht unten am Einstieg")


def fig_hoehe():
    p = S.Plot((-0.6, 13.4), (-3, 42), w=500, h=290, pad=(44, 50, 18, 34))
    p.grid(1, 5)
    p.axes(1, 10, xlabel="t in min", ylabel="h in m", defer_labels=True)
    p.line(p.X(0), p.Y(29), p.X(13.4), p.Y(29), S.GREEN, 1.2, dash="5 4")
    p.curve(hoehe, 0, 13.2, S.RED, 2.2)
    p.draw_labels()
    p.text(p.X(13.3), p.Y(29) - 6, "29 m", 11.5, S.GREEN, "end", halo=S.PAPER)
    return p.svg("Graph der Hoehe einer Gondel ueber der Zeit, eine Kosinuskurve zwischen "
                 "2 m und 38 m mit der Periode 12 Minuten, dazu die Linie in 29 m Hoehe")


def fig_tee():
    p = S.Plot((-1, 31), (0, 100), w=500, h=290, pad=(44, 50, 18, 34))
    p.grid(5, 10)
    p.axes(5, 20, xlabel="t in min", ylabel="T in °C", defer_labels=True)
    p.line(p.X(-1), p.Y(ROOM), p.X(31), p.Y(ROOM), S.MUTED, 1.2, dash="5 4")
    p.curve(tee, 0, 31, S.RED, 2.2)
    p.draw_labels()
    p.text(p.X(30.5), p.Y(ROOM) - 6, "Raumtemperatur", 11.5, S.MUTED, "end", halo=S.PAPER)
    return p.svg("Abkuehlkurve des Tees von 90 Grad Celsius auf die Raumtemperatur von "
                 "20 Grad Celsius zu")


# ------------------------------------------------------------------- sheet ---
s = Sheet("blf-gy-wachstum", "Wachstum und periodische Vorgänge",
          kind="BLF-Training",
          suffix="",
          klasse="Gymnasium · Klasse 10",
          sub="Gymnasium · Klasse 10 · Besondere Leistungsfeststellung Mathematik · Teil B, "
              "mit MMS und Formelsammlung · drei Aufgaben, Anforderungsbereiche I bis III",
          desc="BLF-Training Mathematik Gymnasium Klasse 10: exponentielles Wachstum mit "
               "Logarithmus, ein Riesenrad als periodischer Vorgang und abkühlender Tee als "
               "begrenzte Abnahme, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/blf.html", "Zur Übersicht"))

s.task(
    "Der Algenteppich", 1,
    r"Auf einem Teich wächst ein Algenteppich. Seine Fläche wird näherungsweise durch "
    r"$A(t) = 4 \cdot 1{,}35^{t}$ beschrieben, $t$ in Wochen nach Beobachtungsbeginn, "
    r"$A(t)$ in Quadratmetern.",
    [
        r"Geben Sie die Fläche zu Beobachtungsbeginn und das wöchentliche Wachstum in "
        r"Prozent an.",
        r"Berechnen Sie die Fläche nach sechs Wochen.",
        r"Berechnen Sie, nach wie vielen Wochen der Teppich $100\ \mathrm{m}^2$ bedeckt.",
        r"Berechnen Sie die Verdopplungszeit und zeigen Sie, dass sie nicht von der "
        r"Anfangsfläche abhängt.",
    ],
    [
        r"$A(0) = 4$: Zu Beginn sind es $4\ \mathrm{m}^2$. Der Faktor $1{,}35$ bedeutet ein "
        r"Wachstum um $35\ \%$ pro Woche.",

        r"$A(6) = 4 \cdot 1{,}35^6 \approx 4 \cdot 6{,}05 \approx 24{,}2\ \mathrm{m}^2$.",

        r"$4 \cdot 1{,}35^t = 100$ ergibt $1{,}35^t = 25$, also "
        r"$t = \log_{1{,}35} 25 = \frac{\lg 25}{\lg 1{,}35} \approx 10{,}7$. "
        r"Im Laufe der elften Woche sind $100\ \mathrm{m}^2$ bedeckt.",

        r"Aus $A_0 \cdot 1{,}35^{t} = 2 \cdot A_0$ kürzt sich $A_0$ heraus: "
        r"$1{,}35^{t} = 2$, also $t = \frac{\lg 2}{\lg 1{,}35} \approx 2{,}3$ Wochen. "
        r"Die Anfangsfläche kommt in der Gleichung nicht mehr vor, deshalb ist die "
        r"Verdopplungszeit für jeden Startwert dieselbe.",
    ],
    falle=r"$35\ \%$ Wachstum heißt Faktor $1{,}35$, nicht $0{,}35$. Und beim Logarithmus "
          r"gehört der Faktor $4$ vorher auf die andere Seite: $\lg(4 \cdot 1{,}35^t)$ ist "
          r"nicht $t \cdot \lg 5{,}4$.",
)

s.task(
    "Das Riesenrad", 2,
    r"Ein Riesenrad hat einen Durchmesser von $36$ m, seine Achse liegt $20$ m über dem "
    r"Boden. Für eine Umdrehung braucht es $12$ Minuten. Eine Gondel startet ganz unten "
    r"am Einstieg. Ihre Höhe über dem Boden wird durch "
    r"$h(t) = 20 - 18 \cdot \cos\left(\frac{\pi}{6} \cdot t\right)$ beschrieben, "
    r"$t$ in Minuten, $h(t)$ in Metern.",
    [
        r"Geben Sie die kleinste und die größte Höhe der Gondel sowie die kleinste Periode "
        r"von $h$ an.",
        r"Berechnen Sie die Höhe der Gondel zwei Minuten nach dem Start.",
        r"Ermitteln Sie, wie lange sich die Gondel während einer Umdrehung höher als "
        r"$29$ m über dem Boden befindet.",
        r"Am Rad sind $24$ Gondeln in gleichen Abständen befestigt. Berechnen Sie die Länge "
        r"des Kreisbogens zwischen zwei benachbarten Gondeln und die Zeit, bis nach einer "
        r"Gondel die nächste den Einstieg erreicht.",
    ],
    [
        r"Der Kosinus liegt zwischen $-1$ und $1$: kleinste Höhe $20 - 18 = 2$ m (am "
        r"Einstieg), größte $20 + 18 = 38$ m. Die Periode ist "
        r"$p = \frac{2\pi}{\pi/6} = 12$ Minuten, eine Umdrehung.",

        r"$h(2) = 20 - 18 \cdot \cos\frac{\pi}{3} = 20 - 18 \cdot 0{,}5 = 11$ m.",

        r"$20 - 18 \cos\left(\frac{\pi}{6}t\right) = 29$ ergibt "
        r"$\cos\left(\frac{\pi}{6}t\right) = -\frac{1}{2}$ mit den Lösungen $t = 4$ und "
        r"$t = 8$ in der ersten Umdrehung. Dazwischen liegt die Gondel höher: "
        r"$8 - 4 = 4$ Minuten, also ein Drittel der Fahrt.",

        r"Umfang $u = \pi \cdot 36 \approx 113{,}1$ m, geteilt durch $24$: "
        r"$b = \frac{36\pi}{24} = 1{,}5\pi \approx 4{,}71$ m. Für eine Umdrehung braucht "
        r"das Rad $12$ Minuten, für ein Vierundzwanzigstel davon "
        r"$\frac{12}{24} = 0{,}5$ Minuten, also $30$ Sekunden.",
    ],
    falle=r"Bei c) liefert der Rechner für $\cos x = -\frac{1}{2}$ nur einen Wert. Den "
          r"zweiten findet man über die Symmetrie der Kurve zur Stelle $t = 6$ (ganz oben): "
          r"$6 - 2 = 4$ und $6 + 2 = 8$. Der Graph zeigt es sofort.",
    figs=[(fig_rad(),
           "Das Riesenrad mit 24 Gondeln. Die rote Gondel startet am Einstieg.")],
    solfigs=[(fig_hoehe(),
              "Zu c): Oberhalb der grünen Linie ist die Gondel höher als 29 m, von der "
              "vierten bis zur achten Minute.")],
)

s.task(
    "Der Tee kühlt ab", 3,
    r"Frisch aufgebrühter Tee kühlt in einem Raum ab. Seine Temperatur wird durch "
    r"$T(t) = 20 + 70 \cdot e^{-0{,}08 \cdot t}$ beschrieben, $t$ in Minuten, $T(t)$ in "
    r"Grad Celsius.",
    [
        r"Geben Sie die Anfangstemperatur an und deuten Sie die Zahl $20$ im "
        r"Sachzusammenhang.",
        r"Der Tee ist trinkbar, sobald er höchstens $60\ °\mathrm{C}$ warm ist. Berechnen "
        r"Sie, wie lange man warten muss.",
        r"Berechnen Sie die mittlere Abkühlung pro Minute in den ersten fünf Minuten und "
        r"in den fünf Minuten danach. Deuten Sie den Unterschied.",
        r"Zeigen Sie, dass sich der Unterschied zwischen Tee- und Raumtemperatur in "
        r"gleichen Zeitabständen immer um denselben Prozentsatz verringert, und geben Sie "
        r"diesen Prozentsatz pro Minute an.",
    ],
    [
        r"$T(0) = 20 + 70 = 90\ °\mathrm{C}$. Für große $t$ geht $e^{-0{,}08t}$ gegen $0$ "
        r"und $T(t)$ gegen $20$: Das ist die **Raumtemperatur**, auf die der Tee zuläuft, "
        r"ohne sie je ganz zu erreichen.",

        r"$20 + 70 e^{-0{,}08t} = 60$ ergibt $e^{-0{,}08t} = \frac{4}{7}$, also "
        r"$t = \frac{\ln\frac{7}{4}}{0{,}08} \approx 7{,}0$. Nach etwa sieben Minuten ist "
        r"der Tee trinkbar.",

        r"$T(5) \approx 66{,}9\ °\mathrm{C}$ und $T(10) \approx 51{,}5\ °\mathrm{C}$. "
        r"In den ersten fünf Minuten: $\frac{90 - 66{,}9}{5} \approx 4{,}6$ Grad pro "
        r"Minute; danach: $\frac{66{,}9 - 51{,}5}{5} \approx 3{,}1$ Grad pro Minute. Der "
        r"Tee kühlt am Anfang schneller ab, weil der Unterschied zur Umgebung dann am "
        r"größten ist. Die Abnahme ist also nicht linear.",

        r"Der Unterschied ist $T(t) - 20 = 70 \cdot e^{-0{,}08t} = 70 \cdot "
        r"\left(e^{-0{,}08}\right)^t$. In jeder Minute wird er mit demselben Faktor "
        r"$e^{-0{,}08} \approx 0{,}923$ multipliziert, er sinkt also jede Minute um etwa "
        r"$7{,}7\ \%$. Nach rund $8{,}7$ Minuten ist er jeweils halbiert.",
    ],
    falle=r"Exponentiell sinkt hier nicht die Temperatur selbst, sondern ihr **Abstand zur "
          r"Raumtemperatur**. Wer $T(t)$ direkt mit einem Faktor pro Minute beschreibt, "
          r"landet irgendwann bei $0\ °\mathrm{C}$, und das passiert mit Tee in einem "
          r"warmen Zimmer nicht.",
    figs=[(fig_tee(), "Die Abkühlkurve und die Raumtemperatur (gestrichelt).")],
)


def check():
    """Every number in the solutions, recomputed."""
    # --- Aufgabe 1 -----------------------------------------------------------------
    assert alge(0) == 4 and round((QA - 1) * 100) == 35
    assert round(QA ** 6, 2) == 6.05 and round(alge(6), 1) == 24.2
    assert abs(alge(T_100) - 100) < 1e-9 and round(T_100, 1) == 10.7
    assert 10 < T_100 < 11                                     # in der elften Woche
    assert abs(log(25, 10) / log(QA, 10) - T_100) < 1e-12
    assert round(T_DOUBLE, 1) == 2.3
    for a0 in (1.0, 4.0, 17.5):
        assert abs(a0 * QA ** T_DOUBLE - 2 * a0) < 1e-9
    assert abs(log(4 * QA ** 3) - 3 * log(4 * QA)) > 0.5       # die Falle
    # --- Aufgabe 2 -----------------------------------------------------------------
    ts = [k / 100 for k in range(0, 1201)]
    hs = [hoehe(t) for t in ts]
    assert abs(min(hs) - 2) < 1e-9 and abs(max(hs) - 38) < 1e-9
    assert abs(hoehe(0) - 2) < 1e-12 and abs(hoehe(6) - 38) < 1e-12
    assert abs(2 * pi / (pi / 6) - T_TURN) < 1e-12
    assert abs(hoehe(2) - 11) < 1e-12
    assert abs(hoehe(4) - 29) < 1e-9 and abs(hoehe(8) - 29) < 1e-9
    above = sum(1 for t, hh in zip(ts, hs) if hh > 29) / 100
    assert abs(above - 4) < 0.02 and abs(4 / 12 - 1 / 3) < 1e-12
    assert round(pi * 36, 1) == 113.1
    assert abs(36 * pi / 24 - 1.5 * pi) < 1e-12 and round(1.5 * pi, 2) == 4.71
    assert T_TURN / GONDELN == 0.5
    assert AXIS + R_RAD == 38 and AXIS - R_RAD == 2           # oben und unten
    # --- Aufgabe 3 -----------------------------------------------------------------
    assert tee(0) == 90 and abs(tee(500) - 20) < 1e-12
    assert abs(tee(T_60) - 60) < 1e-9 and round(T_60, 1) == 7.0
    t5, t10 = tee(5), tee(10)
    assert round(t5, 1) == 66.9 and round(t10, 1) == 51.5
    assert round((90 - t5) / 5, 1) == 4.6 and round((t5 - t10) / 5, 1) == 3.1
    f = exp(-KT)
    assert round(f, 3) == 0.923 and round((1 - f) * 100, 1) == 7.7
    for t in (0.0, 3.0, 11.5):
        assert abs((tee(t + 1) - ROOM) / (tee(t) - ROOM) - f) < 1e-12
    assert round(T_HALF, 1) == 8.7


s.verify(check)
s.save()
