#!/usr/bin/env python3
"""BLF-Training Gymnasium Klasse 10 - Pruefungssimulation Teil B.

    python3 tools/aufgaben/blf/simulation.py

Not a collection of topics but one whole Teil B in the cut of 2023/24 and 2024/25:
Aufgabe 1 functions (10 BE), Aufgabe 2 a triangle and a short stochastics item (6 BE),
Aufgabe 3 one long context task through several areas (14 BE) - 30 BE in the time
left after Teil A is collected. The AFB marker of the sheet layout only keeps that
order. Task types are rebuilt freely; wording, numbers and every figure are our own.
"""
import math
import os
import sys
from fractions import Fraction as Fr
from math import atan, cos, degrees, log, radians, sin, sqrt

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# ============================================================ Aufgabe 1 ====
def f(x):
    return x * x - 6 * x + 5                   # = (x - 3)^2 - 4, zeros 1 and 5


def h(x):
    return -(x - 4) ** 2 + 1                   # meets f at x = 2 and x = 5


def line_ab(x):
    return x - 5


# ============================================================ Aufgabe 2 ====
DA, DB, DG = 40.0, 55.0, 72.0                  # a, b in m, gamma in degrees
DC = sqrt(DA ** 2 + DB ** 2 - 2 * DA * DB * cos(radians(DG)))
DAREA = 0.5 * DA * DB * sin(radians(DG))
URNE_R, URNE_W = 3, 2

# ============================================================ Aufgabe 3 ====
GAESTE, KINDER, JAHRES = 240000, Fr(35, 100), Fr(20, 100)
RH, RL, RMAX = 6.5, 14.0, 30.0                 # slide: height, run, max angle
R_LEN = sqrt(RH ** 2 + RL ** 2)
R_ANG = degrees(atan(RH / RL))
B_LEN, B_WID, B_T1, B_T2, PUMPE = 25.0, 12.0, 1.0, 3.0, 40.0
B_VOL = (B_T1 + B_T2) / 2 * B_LEN * B_WID
C0, CQ, CMIN = 0.6, 0.85, 0.3
C_TIME = log(CMIN / C0) / log(CQ)


# ----------------------------------------------------------------- figures ---
def fig_parabeln():
    p = S.Plot((-0.8, 7.2), (-5.2, 6.2), w=420, h=380, pad=(36, 22, 18, 30))
    p.grid(1, 1)
    p.axes(1, 1, defer_labels=True)
    p.curve(f, -0.6, 6.9, S.RED, 2.1)
    p.curve(h, 0.9, 7.1, S.GREEN, 2.1)
    p.curve(line_ab, -0.4, 7.2, S.BODY, 1.6, dash="6 4")
    p.draw_labels()
    p.point(2, -3, "A", "left", color=S.INK)
    p.point(5, 0, "B", "above-right", color=S.INK)
    p.point(3, -4, None, color=S.RED, size=3)
    p.text(p.X(6.55), p.Y(5.3), "f", 15, S.RED, "start", italic=True, halo=S.PAPER)
    p.text(p.X(6.6), p.Y(-3.6), "h", 15, S.GREEN, "start", italic=True, halo=S.PAPER)
    return p.svg("Die Parabeln f und h schneiden sich in A(2|-3) und B(5|0); gestrichelt "
                 "die Gerade durch A und B")


def fig_grundstueck():
    sc = 3.4
    A = (40, 210)
    B = (A[0] + DC * sc, 210)
    # C from A with angle alpha, found through the cosine rule
    alpha = math.acos((DB ** 2 + DC ** 2 - DA ** 2) / (2 * DB * DC))
    C = (A[0] + DB * cos(alpha) * sc, A[1] - DB * sin(alpha) * sc)
    c = S.Canvas(300, 250)
    c.raw('<path d="M %s %s L %s %s L %s %s Z" fill="%s" opacity="0.2"/>'
          % (S.fmt(A[0]), S.fmt(A[1]), S.fmt(B[0]), S.fmt(B[1]), S.fmt(C[0]), S.fmt(C[1]),
             S.GREEN))
    c.poly([A, B, C], stroke=S.INK, width=1.7)
    for p, lab, dx, dy in ((A, "A", -10, 8), (B, "B", 10, 8), (C, "C", 0, -10)):
        c.text(p[0] + dx, p[1] + dy, lab, 14, S.INK, italic=True)
    c.text((B[0] + C[0]) / 2.0 + 10, (B[1] + C[1]) / 2.0, "40 m", 12.5, S.BODY, "start",
           halo=S.PAPER)
    c.text((A[0] + C[0]) / 2.0 - 10, (A[1] + C[1]) / 2.0, "55 m", 12.5, S.BODY, "end",
           halo=S.PAPER)
    a_ca = degrees(math.atan2(-(A[1] - C[1]), A[0] - C[0]))
    a_cb = degrees(math.atan2(-(B[1] - C[1]), B[0] - C[0]))
    c.arc(C[0], C[1], 26, a_cb, a_ca, S.GREEN, 1.5, label="72°", lr=1.75)
    return c.svg("Dreieckiges Grundstueck ABC mit den Seiten 40 m und 55 m, die bei C "
                 "einen Winkel von 72 Grad einschliessen")


def fig_bad():
    rut = S.Canvas(300, 190)
    x0, y0, sc = 62, 160, 14.0
    rut.line(10, y0, 290, y0, S.INK, 1.4)
    top = (x0, y0 - RH * sc)
    end = (x0 + RL * sc, y0)
    rut.line(top[0], top[1], end[0], end[1], S.RED, 3)
    rut.line(top[0], top[1], top[0], y0, S.MUTED, 1.1, dash="4 3")
    rut.text(top[0] - 6, (top[1] + y0) / 2.0 + 4, "6,5 m", 12, S.BODY, "end")
    rut.text((top[0] + end[0]) / 2.0, y0 + 18, "14 m", 12, S.BODY)
    rut.arc(end[0], end[1], 40, 180 - R_ANG, 180, S.GREEN, 1.4, label="α", lr=1.35)
    assert end[0] < rut.w - 10                  # the slide ends inside the panel
    bec = S.Canvas(300, 190)
    bx, by, bs = 25, 40, 10.0
    tl, tr = (bx, by), (bx + B_LEN * bs, by)
    br, bl = (bx + B_LEN * bs, by + B_T2 * bs * 3), (bx, by + B_T1 * bs * 3)
    bec.poly([tl, tr, br, bl], stroke="none", fill="#9CC3E6", opacity=0.55)
    bec.poly([tl, tr, br, bl], stroke=S.INK, width=1.6)
    bec.text(bx + B_LEN * bs / 2.0, by - 8, "25 m", 12, S.BODY)
    bec.text(bx - 5, (tl[1] + bl[1]) / 2.0 + 4, "1 m", 12, S.BODY, "end")
    bec.text(br[0] + 5, (tr[1] + br[1]) / 2.0 + 4, "3 m", 12, S.BODY, "start")
    bec.text(bx + B_LEN * bs / 2.0, br[1] + 22, "Breite 12 m", 11.5, S.MUTED)
    return S.panel([rut, bec], captions=["Abbildung 1: die Rutsche (Seitenansicht)",
                                         "Abbildung 2: Längsschnitt des Beckens"],
                   label="Links die gerade Rutsche mit 6,5 m Hoehe und 14 m Laenge am Boden, "
                         "rechts der trapezfoermige Laengsschnitt des Beckens, 1 m bis "
                         "3 m tief")


# ------------------------------------------------------------------- sheet ---
s = Sheet("blf-gy-simulation", "Prüfungssimulation Teil B",
          kind="BLF-Training",
          suffix="",
          klasse="Gymnasium · Klasse 10",
          sub="Gymnasium · Klasse 10 · Besondere Leistungsfeststellung Mathematik · Teil B · "
              "drei Aufgaben, 10 + 6 + 14 Bewertungseinheiten",
          desc="BLF-Training Mathematik Gymnasium Klasse 10: vollständige Simulation von "
               "Teil B mit Funktionen, Trigonometrie und Stochastik und einer langen "
               "Sachaufgabe, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/blf.html", "Zur Übersicht"))

s.task(
    "Zwei Parabeln", 1,
    r"**Aufgabe 1 · Funktionen (10 BE).** Alle drei Aufgaben sind zu bearbeiten. Teil B "
    r"beginnt, sobald Teil A nach 25 Minuten eingesammelt ist; für beide Teile zusammen "
    r"stehen 90 Minuten zur Verfügung. Zugelassen sind das MMS, die Tabellen- und "
    r"Formelsammlung und Zeichengeräte. — Gegeben ist die in $\mathbb{R}$ definierte "
    r"Funktion $f$ mit $f(x) = x^2 - 6x + 5$.",
    [
        r"Geben Sie die Nullstellen von $f$ und die Koordinaten des Schnittpunkts des "
        r"Graphen mit der $y$-Achse an. (2 BE)",
        r"Ermitteln Sie den Wertebereich von $f$. (2 BE)",
        r"Die Graphen von $f$ und der in $\mathbb{R}$ definierten Funktion $h$ mit "
        r"$h(x) = -(x - 4)^2 + 1$ schneiden sich in den Punkten $A$ und $B$. Ermitteln Sie "
        r"eine Gleichung der linearen Funktion, deren Graph durch $A$ und $B$ verläuft. "
        r"(4 BE)",
        r"Geben Sie den Wert von $c$ an, für den die Gleichung $x^2 - 6x + 5 = c$ genau "
        r"eine Lösung hat, und begründen Sie Ihre Angabe. (2 BE)",
    ],
    [
        r"$x^2 - 6x + 5 = (x - 1)(x - 5)$: Nullstellen $x_1 = 1$ und $x_2 = 5$. "
        r"Schnittpunkt mit der $y$-Achse $(0 \mid 5)$.",

        r"$f(x) = (x - 3)^2 - 4$, der Scheitelpunkt ist $S(3 \mid -4)$, die Parabel nach "
        r"oben geöffnet: $W_f = \{y \mid y \in \mathbb{R};\ y \geq -4\}$.",

        r"Gleichsetzen: $x^2 - 6x + 5 = -x^2 + 8x - 15$ ergibt $2x^2 - 14x + 20 = 0$, also "
        r"$x^2 - 7x + 10 = 0$ mit $x = 2$ und $x = 5$. Dazu $f(2) = -3$ und $f(5) = 0$: "
        r"$A(2 \mid -3)$, $B(5 \mid 0)$. Anstieg $m = \frac{0 - (-3)}{5 - 2} = 1$, mit $B$: "
        r"$0 = 5 + n$, $n = -5$. Die Gerade ist $y = x - 5$.",

        r"$c = -4$. Die Lösungen sind die Stellen, an denen der Graph von $f$ die "
        r"waagerechte Gerade $y = c$ trifft. Genau ein gemeinsamer Punkt entsteht nur im "
        r"Scheitelpunkt, dessen $y$-Wert $-4$ ist. Rechnerisch: $(x - 3)^2 = c + 4$ hat "
        r"genau eine Lösung, wenn $c + 4 = 0$ ist.",
    ],
    falle=r"Bei c) nicht die Gleichung von $h$ falsch ausmultiplizieren: "
          r"$-(x - 4)^2 + 1 = -(x^2 - 8x + 16) + 1 = -x^2 + 8x - 15$. Das Minuszeichen vor "
          r"der Klammer gilt für **alle drei** Summanden.",
    solfigs=[(fig_parabeln(), "Die beiden Parabeln und die Gerade durch A und B.")],
)

s.task(
    "Grundstück und Urne", 2,
    r"**Aufgabe 2 (6 BE).** Die beiden Teilaufgaben sind unabhängig voneinander. — Ein "
    r"dreieckiges Grundstück $ABC$ hat die Seiten $\overline{BC} = 40$ m und "
    r"$\overline{AC} = 55$ m, die bei $C$ einen Winkel von $72°$ einschließen (siehe "
    r"Abbildung, nicht maßstäblich).",
    [
        r"Berechnen Sie die Länge der dritten Seite und den Flächeninhalt des Grundstücks. "
        r"(4 BE)",
        r"In einer Urne liegen drei rote und zwei weiße Kugeln. Es werden zwei Kugeln ohne "
        r"Zurücklegen gezogen. Berechnen Sie die Wahrscheinlichkeit dafür, dass mindestens "
        r"eine weiße Kugel dabei ist. (2 BE)",
    ],
    [
        r"Kosinussatz: $c^2 = 40^2 + 55^2 - 2 \cdot 40 \cdot 55 \cdot \cos 72° \approx "
        r"3265{,}3$, also $\overline{AB} \approx 57{,}1$ m. Flächeninhalt: "
        r"$A = \frac{1}{2} \cdot 40 \cdot 55 \cdot \sin 72° \approx 1046\ \mathrm{m}^2$.",

        r"Gegenereignis „zweimal rot“: $\frac{3}{5} \cdot \frac{2}{4} = \frac{3}{10}$. "
        r"Also $P = 1 - \frac{3}{10} = \frac{7}{10} = 0{,}7$.",
    ],
    falle=r"Bei a) liegt der gegebene Winkel **zwischen** den beiden gegebenen Seiten, "
          r"deshalb ist der Kosinussatz der direkte Weg. Der Sinussatz braucht ein Paar "
          r"aus Seite und gegenüberliegendem Winkel, und das fehlt hier.",
    figs=[(fig_grundstueck(), "Das Grundstück (nicht maßstäblich).")],
)

s.task(
    "Im Freizeitbad", 3,
    r"**Aufgabe 3 (14 BE).** Ein Freizeitbad plant die nächste Saison.",
    [
        r"Im vergangenen Jahr kamen $240\,000$ Gäste, $35\ \%$ davon waren Kinder. Von "
        r"den Kindern hatten $20\ \%$ eine Jahreskarte. Ermitteln Sie den prozentualen "
        r"Anteil der Kinder mit Jahreskarte an allen Gästen und ihre Anzahl. (2 BE)",
        r"Eine gerade Rutsche beginnt $6{,}5$ m über dem Boden und endet $14$ m "
        r"(waagerecht gemessen) vom Startturm entfernt am Boden (Abbildung 1). Berechnen "
        r"Sie die Länge der Rutsche und ihren Neigungswinkel $\alpha$. Die Vorschrift "
        r"erlaubt höchstens $30°$. Prüfen Sie, ob die Rutsche sie einhält. (4 BE)",
        r"Das Becken ist $25$ m lang und $12$ m breit. Der Boden fällt gleichmäßig von "
        r"$1$ m auf $3$ m Tiefe ab (Abbildung 2). Berechnen Sie das Wasservolumen des "
        r"vollen Beckens und die Zeit, die eine Pumpe mit $40\ \mathrm{m}^3$ pro Stunde "
        r"zum Füllen braucht. (4 BE)",
        r"Der Chlorgehalt des Wassers wird durch $C(t) = 0{,}6 \cdot 0{,}85^{t}$ "
        r"beschrieben ($t$ in Stunden, $C$ in Milligramm pro Liter). Deuten Sie die Zahl "
        r"$0{,}85$ im Sachzusammenhang. Unter $0{,}3$ mg pro Liter muss nachdosiert "
        r"werden. Berechnen Sie, nach welcher Zeit das nötig ist. (4 BE)",
    ],
    [
        r"$0{,}35 \cdot 0{,}20 = 0{,}07$: $7\ \%$ aller Gäste, das sind "
        r"$0{,}07 \cdot 240\,000 = 16\,800$ Kinder mit Jahreskarte.",

        r"Länge: $\sqrt{6{,}5^2 + 14^2} = \sqrt{238{,}25} \approx 15{,}4$ m. Winkel: "
        r"$\tan\alpha = \frac{6{,}5}{14}$, $\alpha \approx 24{,}9°$. Das ist weniger als "
        r"$30°$, die Rutsche hält die Vorschrift ein.",

        r"Der Längsschnitt ist ein Trapez mit dem Inhalt "
        r"$\frac{1 + 3}{2} \cdot 25 = 50\ \mathrm{m}^2$. Mal Breite: "
        r"$V = 50 \cdot 12 = 600\ \mathrm{m}^3$. Füllzeit: $\frac{600}{40} = 15$ Stunden.",

        r"Der Faktor $0{,}85$ bedeutet: Der Chlorgehalt nimmt jede Stunde um $15\ \%$ ab. "
        r"$0{,}6 \cdot 0{,}85^t = 0{,}3$ ergibt $0{,}85^t = 0{,}5$ und "
        r"$t = \frac{\lg 0{,}5}{\lg 0{,}85} \approx 4{,}3$. Nach gut vier Stunden muss "
        r"nachdosiert werden.",
    ],
    falle=r"Bei a) werden Anteile vom Anteil **multipliziert**, nicht addiert: $35\ \%$ "
          r"plus $20\ \%$ wären $55\ \%$ und damit mehr als die Hälfte aller Gäste. Bei c) "
          r"ist die mittlere Tiefe $2$ m, weil der Boden gleichmäßig abfällt; bei einem "
          r"gekrümmten Boden ginge das so nicht.",
    figs=[(fig_bad(), None)],
)


def check():
    """Every number in the solutions, recomputed."""
    # --- Aufgabe 1 -----------------------------------------------------------------
    assert f(1) == 0 and f(5) == 0 and f(0) == 5
    assert all(f(x) == (x - 3) ** 2 - 4 == (x - 1) * (x - 5) for x in range(-4, 10))
    assert all(f(Fr(k, 8)) >= -4 for k in range(-40, 80)) and f(3) == -4
    assert all(h(x) == -x * x + 8 * x - 15 for x in range(-4, 10))
    assert all(f(x) - h(x) == 2 * (x * x - 7 * x + 10) for x in range(-4, 10))
    assert f(2) == h(2) == -3 and f(5) == h(5) == 0
    assert Fr(0 - (-3), 5 - 2) == 1 and line_ab(2) == -3 and line_ab(5) == 0
    for c in (Fr(-4), Fr(-3), Fr(-5)):                         # (x - 3)^2 = c + 4
        n = 0 if c + 4 < 0 else (1 if c + 4 == 0 else 2)
        assert (n == 1) == (c == -4)
    # --- Aufgabe 2 -----------------------------------------------------------------
    assert round(DC ** 2, 1) == 3265.3 and round(DC, 1) == 57.1
    assert round(DAREA) == 1046
    p_rr = Fr(URNE_R, 5) * Fr(URNE_R - 1, 4)
    assert p_rr == Fr(3, 10) and 1 - p_rr == Fr(7, 10)
    # Kontrolle durch Abzaehlen aller geordneten Zuege
    from itertools import permutations
    urne = ["r"] * URNE_R + ["w"] * URNE_W
    zuege = list(permutations(range(5), 2))
    assert Fr(sum(1 for i, j in zuege if "w" in (urne[i], urne[j])), len(zuege)) == Fr(7, 10)
    # --- Aufgabe 3 -----------------------------------------------------------------
    anteil = KINDER * JAHRES
    assert anteil == Fr(7, 100) and anteil * GAESTE == 16800
    assert KINDER + JAHRES == Fr(55, 100)                      # die Falle
    assert abs(R_LEN ** 2 - 238.25) < 1e-9 and round(R_LEN, 1) == 15.4
    assert round(R_ANG, 1) == 24.9 and R_ANG < RMAX
    assert (B_T1 + B_T2) / 2 * B_LEN == 50 and B_VOL == 600 and B_VOL / PUMPE == 15
    assert abs(C0 * CQ ** C_TIME - CMIN) < 1e-12 and round(C_TIME, 1) == 4.3
    assert round((1 - CQ) * 100) == 15
    # BE read back from the printed parts: 10 + 6 + 14 = 30, matching each intro
    import re
    per_task = [sum(int(m) for p in t["parts"] for m in re.findall(r"\((\d+) BE\)", p))
                for t in s.tasks]
    assert per_task == [10, 6, 14] and sum(per_task) == 30
    for t, be in zip(s.tasks, per_task):
        assert "(%d BE)" % be in t["intro"]


s.verify(check)
s.save()
