#!/usr/bin/env python3
"""Vergleichsarbeit-Training BGY Klasse 11 - Pruefungssimulation Teil B.

    python3 tools/aufgaben/va/simulation.py

Not a collection of topics but one whole Teil B in the cut of 2022-2025: B1 one function
(8 BE), B2 a solid and a short stochastics item (7 BE), B3 one long Saxon context task
through several areas (15 BE) - 30 BE in the time left after Teil A is collected. The
AFB marker of the sheet layout only keeps that order. Task types follow the originals;
wording, numbers and every figure are our own.
"""
import math
import os
import re
import sys
from fractions import Fraction as Fr
from itertools import permutations
from math import asin, ceil, cos, degrees, floor, pi, radians, sin, sqrt

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# ============================================================ Aufgabe B1 ====
def f(x):
    return -Fr(1, 2) * x * x + 2 * x + 6        # = -1/2 (x - 2)^2 + 8, zeros -2 and 6


def g(x):
    return -x + 6


N_TOUCH = Fr(21, 2)                              # h(x) = -x + 10,5 touches in B(3 | 7,5)


def h(x):
    return -x + N_TOUCH


# ============================================================ Aufgabe B2 ====
KD, KH, KT = 1.4, 9.0, 1.0                      # candle: diameter, body, tip in cm
KR = KD / 2
V_BODY = pi * KR ** 2 * KH
V_TIP = pi * KR ** 2 * KT / 3
V_CANDLE = V_BODY + V_TIP
BLOCK = (25, 12, 8)
V_BLOCK = BLOCK[0] * BLOCK[1] * BLOCK[2]
LOSS = Fr(5, 100)
V_USE = V_BLOCK * (1 - LOSS)
N_ENGEL, N_BERG = 6, 4
N_FIG = N_ENGEL + N_BERG
P_EE = Fr(N_ENGEL, N_FIG) * Fr(N_ENGEL - 1, N_FIG - 1)
P_BB = Fr(N_BERG, N_FIG) * Fr(N_BERG - 1, N_FIG - 1)
P_SAME = P_EE + P_BB
P_DIFF = 2 * Fr(N_ENGEL, N_FIG) * Fr(N_BERG, N_FIG - 1)

# ============================================================ Aufgabe B3 ====
PRICE = (12, 9, 5)                              # Erwachsene, ermaessigt, Kinder in Euro
GROUPS = ((2, 1, 2), (1, 3, 0), (4, 0, 5))
TOTALS = tuple(sum(a * p for a, p in zip(row, PRICE)) for row in GROUPS)   # 43, 39, 73
PA, PB, PC = Fr(-1, 8), Fr(1), Fr(0)            # arch p(x) = -1/8 x^2 + x


def p(x):
    return PA * x * x + PB * x + PC


BOAT_W, BOAT_H = Fr(3), Fr(8, 5)                # boat 3 m wide, 1,6 m high
W_MAX = 2 * sqrt(3.2)
L1, L2, TURN = 260.0, 190.0, 48.0               # boat trip: two legs and the turn at T
T_IN = 180 - TURN
BA = sqrt(L1 ** 2 + L2 ** 2 - 2 * L1 * L2 * cos(radians(T_IN)))
SIN_B = L2 * sin(radians(T_IN)) / BA
ANG_B = degrees(asin(SIN_B))
BA_WRONG = sqrt(L1 ** 2 + L2 ** 2 - 2 * L1 * L2 * cos(radians(TURN)))

# grade scale of the whole VA (45 BE): lowest BE for the grades 1 to 6
SCALE = ((1, 39, 45), (2, 32, 38), (3, 25, 31), (4, 18, 24), (5, 9, 17), (6, 0, 8))


# ----------------------------------------------------------------- figures ---
def fig_parabel():
    pl = S.Plot((-2.8, 8.4), (-1.6, 11.6), w=440, h=420, pad=(36, 22, 18, 30))
    pl.grid(1, 1)
    pl.axes(1, 1, skip_y=(0, 6), defer_labels=True)       # 6 would sit under the P label
    pl.curve(lambda x: float(f(x)), -2.6, 7.6, S.RED, 2.2)
    pl.curve(lambda x: float(g(x)), -1.6, 8.3, S.BODY, 1.6, dash="6 4")
    pl.curve(lambda x: float(h(x)), -0.9, 8.3, S.GREEN, 1.9)
    pl.draw_labels()
    pl.point(0, 6, "P", "left", color=S.INK)
    pl.point(6, 0, "Q", "above-right", color=S.INK)
    pl.point(3, 7.5, "B", "above-right", color=S.GREEN)
    pl.text(pl.X(-1.65), pl.Y(2.2), "f", 15, S.RED, "end", italic=True, halo=S.PAPER)
    pl.text(pl.X(-1.6) - 6, pl.Y(7.6) + 5, "g", 15, S.BODY, "end", italic=True, halo=S.PAPER)
    pl.text(pl.X(7.4), pl.Y(3.1) - 8, "h", 15, S.GREEN, "start", italic=True, halo=S.PAPER)
    return pl.svg("Die Parabel f mit der Geraden g durch P(0|6) und Q(6|0) und der "
                  "parallelen Geraden h, die die Parabel in B(3|7,5) beruehrt")


def fig_kerze():
    c = S.Canvas(250, 300)
    sc = 22.0
    cx, bot = 104, 262
    r = KR * sc
    top = bot - KH * sc
    apex = top - KT * sc
    ry = 4.0
    c.rect(cx - r, top, 2 * r, bot - top, fill=S.ORANGE, opacity=0.45)
    c.raw('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s" opacity="0.45"/>'
          % (cx, S.fmt(bot), S.fmt(r), ry, S.ORANGE))
    c.poly([(cx - r, top), (cx + r, top), (cx, apex)], stroke="none", fill=S.ORANGE,
           opacity=0.7)
    c.line(cx - r, top, cx - r, bot, S.INK, 1.5)
    c.line(cx + r, top, cx + r, bot, S.INK, 1.5)
    c.raw('<path d="M %s %s A %s %s 0 0 0 %s %s" fill="none" stroke="%s" '
          'stroke-width="1.5"/>' % (S.fmt(cx - r), S.fmt(bot), S.fmt(r), ry, S.fmt(cx + r),
                                    S.fmt(bot), S.INK))
    c.raw('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="none" stroke="%s" '
          'stroke-width="1.1" stroke-dasharray="3 3"/>' % (cx, S.fmt(top), S.fmt(r), ry,
                                                         S.MUTED))
    c.poly([(cx - r, top), (cx, apex), (cx + r, top)], stroke=S.INK, width=1.5, close=False)
    c.line(cx, apex, cx, apex - 9, S.INK, 1.6)                       # wick
    mx = cx + r + 24
    c.arrow(mx, bot, mx, top, S.MUTED, 1.1)
    c.arrow(mx, top, mx, bot, S.MUTED, 1.1)
    c.text(mx + 8, (top + bot) / 2.0 + 4, "9 cm", 12.5, S.BODY, "start")
    c.line(cx + r + 4, top, mx + 6, top, S.MUTED, 0.9, dash="2 2")
    c.line(cx + 4, apex, mx + 6, apex, S.MUTED, 0.9, dash="2 2")
    c.arrow(mx, top, mx, apex, S.MUTED, 1.0)
    c.arrow(mx, apex, mx, top, S.MUTED, 1.0)
    c.text(mx + 8, (top + apex) / 2.0 + 4, "1 cm", 12.5, S.BODY, "start")
    c.arrow(cx - r, bot + 20, cx + r, bot + 20, S.MUTED, 1.0)
    c.arrow(cx + r, bot + 20, cx - r, bot + 20, S.MUTED, 1.0)
    c.text(cx - r - 8, bot + 24, "1,4 cm", 12.5, S.BODY, "end")
    return c.svg("Kerze: Zylinder mit 1,4 cm Durchmesser und 9 cm Hoehe, darauf eine "
                 "kegelfoermige Spitze von 1 cm Hoehe")


def fig_baum():
    d = S.Diagram(540, 250)
    root = (36, 125)
    e1, b1 = (180, 65), (180, 185)
    leaves = [((326, 30), e1, "5/9", "Engel, Engel", "30/90"),
              ((326, 100), e1, "4/9", "Engel, Bergmann", "24/90"),
              ((326, 150), b1, "6/9", "Bergmann, Engel", "24/90"),
              ((326, 220), b1, "3/9", "Bergmann, Bergmann", "12/90")]
    d.node(*root, color=S.MUTED)
    d.branch(root, e1, "6/10", tex=True)
    d.branch(root, b1, "4/10", tex=True)
    d.node(e1[0], e1[1], "E", "above", color=S.ORANGE)
    d.node(b1[0], b1[1], "B", "below", color=S.BODY)
    for leaf, parent, pr, name, prod in leaves:
        d.branch(parent, leaf, pr, tex=True)
        d.node(leaf[0], leaf[1], None, color=S.ORANGE if name.endswith("Engel") else S.BODY)
        d.text(leaf[0] + 12, leaf[1] + 4, name, 12.5, S.INK, "start")
        d.text(532, leaf[1] + 4, prod, 13, S.BODY, "end", tex=True)
    return d.svg("Baumdiagramm fuer zweimaliges Ziehen ohne Zuruecklegen aus sechs Engeln "
                 "und vier Bergmaennern mit den Pfadwahrscheinlichkeiten")


def bruecke_plot():
    pl = S.Plot((-1.2, 9.4), (-0.8, 2.9), w=440, h=184, pad=(36, 18, 16, 30))
    pl.rect(pl.X(-1.2), pl.Y(0), pl.X(9.4) - pl.X(-1.2), pl.Y(-0.8) - pl.Y(0),
            fill="#9CC3E6", opacity=0.45)
    pl.grid(1, 1)
    return pl


def fig_bruecke(solution=False):
    pl = bruecke_plot()
    # the arch as a band, filled between p and a slightly higher copy
    pl.area_between(lambda x: float(p(x)) + 0.28, lambda x: float(p(x)), -0.2, 8.2,
                    fill=S.MUTED, opacity=0.35)
    if solution:
        x0, x1 = 4 - float(BOAT_W) / 2, 4 + float(BOAT_W) / 2
        pl.rect(pl.X(x0), pl.Y(float(BOAT_H)), pl.X(x1) - pl.X(x0),
                pl.Y(0) - pl.Y(float(BOAT_H)), fill=S.ORANGE, stroke=S.INK, width=1.2,
                opacity=0.75)
        pl.seg((4 - W_MAX / 2, 1.6), (4 + W_MAX / 2, 1.6), S.GREEN, 1.6, dash="5 3")
    pl.axes(1, 1, defer_labels=True)
    pl.curve(lambda x: float(p(x)), 0, 8, S.RED, 2.2)
    pl.draw_labels()
    if solution:
        pl.point(4 - W_MAX / 2, 1.6, None, color=S.GREEN, size=3)
        pl.point(4 + W_MAX / 2, 1.6, None, color=S.GREEN, size=3)
        pl.text(pl.X(4), pl.Y(0.75), "Boot", 12, S.INK, halo=S.PAPER)
        pl.text(pl.X(6.25), pl.Y(1.95), "3,58 m bei 1,6 m Höhe", 11.5, S.GREEN, "start",
                halo=S.PAPER)
        return pl.svg("Der Brueckenbogen mit dem 3 m breiten und 1,6 m hohen Boot in der "
                      "Mitte; gestrichelt die groesste moegliche Breite von 3,58 m")
    pl.point(0, 0, "P₁", "above-left", color=S.INK)
    pl.point(8, 0, "P₂", "above-right", color=S.INK)
    pl.point(2, 1.5, "P₃", "above-left", color=S.INK)
    return pl.svg("Der parabelfoermige Brueckenbogen ueber dem Wasser mit den Punkten "
                  "P1(0|0), P2(8|0) und P3(2|1,5)")


TEICH_SC = 0.85                                  # px per metre


def teich_points():
    B = (42.0, 186.0)
    T = (B[0] + L1 * TEICH_SC, B[1])
    A = (T[0] + L2 * TEICH_SC * cos(radians(TURN)), T[1] - L2 * TEICH_SC * sin(radians(TURN)))
    return B, T, A


def fig_teich():
    B, T, A = teich_points()
    c = S.Canvas(440, 236)
    c.raw('<ellipse cx="225" cy="128" rx="214" ry="104" fill="#9CC3E6" opacity="0.35"/>')
    c.rect(A[0] + 12, A[1] - 16, 48, 32, fill=S.MUTED, opacity=0.35, stroke=S.INK, width=1)
    c.text(A[0] + 36, A[1] - 22, "Schloss", 11.5, S.INK, halo=S.PAPER)
    c.line(B[0], B[1], T[0], T[1], S.INK, 1.7)
    c.line(T[0], T[1], A[0], A[1], S.INK, 1.7)
    c.line(T[0], T[1], T[0] + 86, T[1], S.MUTED, 1.2, dash="4 3")
    c.line(B[0], B[1], A[0], A[1], S.RED, 1.5, dash="6 4")
    c.arc(T[0], T[1], 36, 0, TURN, S.GREEN, 1.5, label="48°", lr=1.5)
    for pt, lab, dx, dy, anchor in ((B, "B  Bootsverleih", -4, 22, "start"),
                                    (T, "T  Boje", 0, 22, "middle"),
                                    (A, "A", -10, -4, "end")):
        c.circle(pt[0], pt[1], 3.4, S.INK)
        c.text(pt[0] + dx, pt[1] + dy, lab, 12.5, S.INK, anchor, halo=S.PAPER)
    c.text((B[0] + T[0]) / 2.0 + 30, B[1] - 8, "260 m", 12.5, S.BODY, halo=S.PAPER)
    c.text((T[0] + A[0]) / 2.0 - 12, (T[1] + A[1]) / 2.0 - 2, "190 m", 12.5, S.BODY, "end",
           halo=S.PAPER)
    c.text((B[0] + A[0]) / 2.0 - 4, (B[1] + A[1]) / 2.0 - 10, "?", 15, S.RED, halo=S.PAPER)
    return c.svg("Skizze des Schlossteichs: vom Bootsverleih B 260 m zur Boje T, dort eine "
                 "Richtungsaenderung um 48 Grad, dann 190 m zur Anlegestelle A am Schloss; "
                 "gestrichelt der direkte Weg von B nach A")


# ------------------------------------------------------------------- sheet ---
s = Sheet("va-bgy11-simulation", "Prüfungssimulation Teil B",
          kind="Vergleichsarbeit-Training",
          suffix="",
          klasse="Berufliches Gymnasium · Klasse 11",
          sub="Berufliches Gymnasium · Klasse 11 · Vergleichsarbeit Mathematik · Teil B · "
              "mit MMS und Formelsammlung · drei Pflichtaufgaben, 8 + 7 + 15 "
              "Bewertungseinheiten",
          desc="Vergleichsarbeit-Training Mathematik BGY Klasse 11: vollständige Simulation "
               "von Teil B mit einer Parabel und zwei Geraden, Kerzen und Figuren einer "
               "Weihnachtspyramide und einer langen Sachaufgabe am Schloss Moritzburg mit "
               "Gleichungssystem, Parabel und Trigonometrie, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/vergleichsarbeit.html", "Zur Übersicht"))

s.task(
    "Parabel und Gerade", 1,
    r"**Aufgabe B1 · Funktion (8 BE).** Alle drei Aufgaben sind zu bearbeiten. Teil B "
    r"beginnt, sobald Teil A nach 25 Minuten eingesammelt ist; für beide Teile zusammen "
    r"stehen 90 Minuten zur Verfügung. Zugelassen sind das MMS, die Formelsammlung und "
    r"Zeichengeräte. — Gegeben ist die in $\mathbb{R}$ definierte Funktion $f$ mit "
    r"$f(x) = -\frac{1}{2}x^2 + 2x + 6$.",
    [
        r"Geben Sie die Koordinaten des Scheitelpunkts des Graphen von $f$ an und "
        r"berechnen Sie die Nullstellen von $f$. (3 BE)",
        r"Die Gerade $g$ verläuft durch den Schnittpunkt $P$ des Graphen von $f$ mit der "
        r"$y$-Achse und durch seinen Schnittpunkt $Q$ mit der positiven $x$-Achse. Ermitteln "
        r"Sie eine Gleichung von $g$ und weisen Sie nach, dass $g$ und der Graph von $f$ "
        r"außer $P$ und $Q$ keine gemeinsamen Punkte haben. (2 BE)",
        r"Eine zu $g$ parallele Gerade $h$ hat mit dem Graphen von $f$ genau einen "
        r"gemeinsamen Punkt $B$. Ermitteln Sie eine Gleichung von $h$ und die Koordinaten "
        r"von $B$. (3 BE)",
    ],
    [
        r"Quadratische Ergänzung: $f(x) = -\frac{1}{2}(x^2 - 4x) + 6 = "
        r"-\frac{1}{2}(x - 2)^2 + 8$, der Scheitelpunkt ist $S(2 \mid 8)$. Nullstellen: "
        r"$-\frac{1}{2}x^2 + 2x + 6 = 0$ wird nach Multiplikation mit $-2$ zu "
        r"$x^2 - 4x - 12 = 0$, also $x = 2 \pm \sqrt{4 + 12} = 2 \pm 4$. Die Nullstellen "
        r"sind $x_1 = -2$ und $x_2 = 6$.",

        r"$P(0 \mid 6)$ und $Q(6 \mid 0)$ ergeben den Anstieg $m = \frac{0 - 6}{6 - 0} = -1$ "
        r"und damit $g(x) = -x + 6$. Gleichsetzen: $-\frac{1}{2}x^2 + 2x + 6 = -x + 6$, "
        r"also $-\frac{1}{2}x^2 + 3x = 0$ und $x \cdot \left(3 - \frac{1}{2}x\right) = 0$. "
        r"Die einzigen Lösungen $x = 0$ und $x = 6$ gehören zu $P$ und $Q$.",

        r"Ansatz $h(x) = -x + n$. Gleichsetzen und mit $-2$ multiplizieren: "
        r"$x^2 - 6x + 2n - 12 = 0$. Genau eine Lösung gibt es, wenn die Diskriminante null "
        r"ist: $9 - (2n - 12) = 0$, also $n = 10{,}5$. Dann ist $x = 3$ die einzige Lösung "
        r"mit $f(3) = -4{,}5 + 6 + 6 = 7{,}5$. Ergebnis: $h(x) = -x + 10{,}5$ und "
        r"$B(3 \mid 7{,}5)$. Zweiter Weg: Bei einer Parabel liegt der Berührpunkt einer "
        r"Parallelen zur Sehne $\overline{PQ}$ genau über der Mitte von $0$ und $6$, also "
        r"bei $x = 3$; aus $7{,}5 = -3 + n$ folgt wieder $n = 10{,}5$.",
    ],
    falle=r"Beim Multiplizieren mit $-2$ ändern **alle** Glieder ihr Vorzeichen, auch die "
          r"Konstante: Aus $6 - n$ wird $2n - 12$. In c) ist $B$ kein Schnittpunkt wie in "
          r"b), sondern ein Berührpunkt: Die Diskriminante muss null sein, nicht positiv.",
    solfigs=[(fig_parabel(), "Die Parabel f, die Gerade g durch P und Q und die parallele "
                             "Gerade h, die f in B berührt.")],
)

s.task(
    "Die Weihnachtspyramide", 2,
    r"**Aufgabe B2 · Körper und Zufall (7 BE).** Eine Werkstatt im Erzgebirge stellt "
    r"Weihnachtspyramiden her. Die Kerzen dafür gießt sie selbst: Jede Kerze besteht aus "
    r"einem Zylinder mit $1{,}4$ cm Durchmesser und $9$ cm Höhe und einer aufgesetzten "
    r"kegelförmigen Spitze von $1$ cm Höhe (siehe Abbildung).",
    [
        r"Das Wachs wird in quaderförmigen Blöcken mit den Maßen "
        r"$25\ \mathrm{cm} \times 12\ \mathrm{cm} \times 8\ \mathrm{cm}$ geliefert. Beim "
        r"Gießen gehen $5\ \%$ des Wachses verloren. Ermitteln Sie, wie viele Kerzen aus "
        r"einem Block höchstens gegossen werden können. (3 BE)",
        r"In einer Kiste liegen $10$ geschnitzte Figuren für die Pyramide, $6$ Engel und "
        r"$4$ Bergmänner. Für die oberste Etage werden zufällig zwei Figuren nacheinander "
        r"ohne Zurücklegen entnommen. Berechnen Sie die Wahrscheinlichkeit dafür, dass "
        r"zwei Engel entnommen werden, und die Wahrscheinlichkeit dafür, dass mindestens "
        r"ein Bergmann dabei ist. (2 BE)",
        r"Ein Kind behauptet: „Zwei gleiche Figuren sind wahrscheinlicher als zwei "
        r"verschiedene.“ Beurteilen Sie diese Aussage. (2 BE)",
    ],
    [
        r"Volumen einer Kerze: $V = \pi \cdot 0{,}7^2 \cdot 9 + \frac{1}{3} \cdot \pi \cdot "
        r"0{,}7^2 \cdot 1 \approx 13{,}85 + 0{,}51 \approx 14{,}37\ \mathrm{cm}^3$. Ein "
        r"Wachsblock hat $25 \cdot 12 \cdot 8 = 2400\ \mathrm{cm}^3$, davon sind $95\ \%$ "
        r"nutzbar, also $2280\ \mathrm{cm}^3$. Wegen $\frac{2280}{14{,}37} \approx 158{,}7$ "
        r"können höchstens **158 Kerzen** gegossen werden.",

        r"Zwei Engel: $P = \frac{6}{10} \cdot \frac{5}{9} = \frac{30}{90} = \frac{1}{3} "
        r"\approx 0{,}333$. „Mindestens ein Bergmann“ ist das Gegenereignis dazu: "
        r"$P = 1 - \frac{1}{3} = \frac{2}{3} \approx 0{,}667$.",

        r"Zwei gleiche: $\frac{30}{90} + \frac{4}{10} \cdot \frac{3}{9} = \frac{30}{90} + "
        r"\frac{12}{90} = \frac{7}{15} \approx 0{,}467$. Zwei verschiedene: "
        r"$2 \cdot \frac{6}{10} \cdot \frac{4}{9} = \frac{48}{90} = \frac{8}{15} \approx "
        r"0{,}533$. Die Aussage ist falsch, zwei verschiedene Figuren sind etwas "
        r"wahrscheinlicher.",
    ],
    falle=r"Ohne Zurücklegen ändert sich der zweite Bruch: Nach einem Engel liegen nur noch "
          r"$9$ Figuren in der Kiste, davon $5$ Engel. Mit Zurücklegen käme für zwei Engel "
          r"$0{,}6 \cdot 0{,}6 = 0{,}36$ heraus, und die Aussage in c) wäre mit "
          r"$0{,}36 + 0{,}16 = 0{,}52$ für zwei gleiche Figuren sogar richtig.",
    figs=[(fig_kerze(), "Eine Kerze: Zylinder mit kegelförmiger Spitze.")],
    solfigs=[(fig_baum(), "Zu b) und c): das Baumdiagramm mit den vier Pfaden.")],
)

s.task(
    "Ein Tag in Moritzburg", 3,
    r"**Aufgabe B3 (15 BE).** Eine Schulklasse besucht Schloss Moritzburg, das auf einer "
    r"Insel im Schlossteich liegt.",
    [
        r"Für eine Schlossführung zahlen drei Gruppen: $2$ Erwachsene, $1$ ermäßigte Person "
        r"und $2$ Kinder zusammen $43$ €, $1$ Erwachsener und $3$ ermäßigte Personen "
        r"zusammen $39$ € sowie $4$ Erwachsene und $5$ Kinder zusammen $73$ €. Ermitteln "
        r"Sie mithilfe eines linearen Gleichungssystems die drei Eintrittspreise. (3 BE)",
        r"Eine Fußgängerbrücke am Schlossteich hat einen parabelförmigen Bogen "
        r"(Abbildung 1). In einem Koordinatensystem mit der Wasseroberfläche als $x$-Achse "
        r"(eine Einheit entspricht $1$ m) beginnt der Bogen in $P_1(0 \mid 0)$, endet in "
        r"$P_2(8 \mid 0)$ und verläuft durch $P_3(2 \mid 1{,}5)$. Ermitteln Sie mithilfe "
        r"eines linearen Gleichungssystems eine Gleichung der Parabel und geben Sie die "
        r"größte Höhe des Bogens über dem Wasser an. (4 BE)",
        r"Ein Ausflugsboot mit Sonnendach ist $3$ m breit und bis zur Oberkante des Daches "
        r"$1{,}6$ m hoch. Prüfen Sie, ob es mittig unter dem Bogen hindurchfahren kann, und "
        r"ermitteln Sie, wie breit ein $1{,}6$ m hohes Boot höchstens sein darf. (4 BE)",
        r"Ein Ruderboot fährt vom Bootsverleih $B$ geradlinig $260$ m bis zu einer Boje "
        r"$T$, ändert dort seine Fahrtrichtung um $48°$ und fährt weitere $190$ m "
        r"geradlinig bis zur Anlegestelle $A$ am Schloss (Abbildung 2). Berechnen Sie die "
        r"Länge des direkten Weges von $B$ nach $A$ und die Größe des Winkels "
        r"$\angle TBA$. (4 BE)",
    ],
    [
        r"Mit $e$, $r$ und $k$ für die Preise in Euro: $2e + r + 2k = 43$, $e + 3r = 39$ und "
        r"$4e + 5k = 73$, in Matrixform "
        r"$\begin{pmatrix}2 & 1 & 2\\1 & 3 & 0\\4 & 0 & 5\end{pmatrix} \cdot "
        r"\begin{pmatrix}e\\r\\k\end{pmatrix} = \begin{pmatrix}43\\39\\73\end{pmatrix}$. Das "
        r"MMS liefert $e = 12$, $r = 9$ und $k = 5$: Erwachsene zahlen $12$ €, ermäßigte "
        r"Personen $9$ € und Kinder $5$ €. Probe mit der ersten Gruppe: "
        r"$24 + 9 + 10 = 43$.",

        r"Ansatz $p(x) = ax^2 + bx + c$. Aus $P_1$ folgt $c = 0$, aus $P_2$ und $P_3$ "
        r"folgen $64a + 8b = 0$ und $4a + 2b = 1{,}5$. Die erste Gleichung ergibt "
        r"$b = -8a$, eingesetzt $4a - 16a = 1{,}5$, also $a = -0{,}125$ und $b = 1$. Damit "
        r"ist $p(x) = -0{,}125x^2 + x$. Der Scheitel liegt aus Symmetriegründen in der Mitte "
        r"bei $x = 4$: $p(4) = -2 + 4 = 2$. Der Bogen ist höchstens $2$ m hoch.",

        r"Mittig heißt: Das Boot reicht von $x = 2{,}5$ bis $x = 5{,}5$. Dort ist "
        r"$p(2{,}5) = p(5{,}5) \approx 1{,}72$ m, mehr als $1{,}6$ m: Das Boot passt mit "
        r"knapp $12$ cm Luft hindurch. Größte Breite: $p(x) = 1{,}6$ ergibt nach "
        r"Multiplikation mit $-8$ die Gleichung $x^2 - 8x + 12{,}8 = 0$ mit "
        r"$x = 4 \pm \sqrt{3{,}2}$, also $x_1 \approx 2{,}21$ und $x_2 \approx 5{,}79$. Ein "
        r"$1{,}6$ m hohes Boot darf höchstens $2\sqrt{3{,}2} \approx 3{,}58$ m breit sein.",

        r"Im Dreieck $BTA$ ist der Winkel bei $T$ nicht $48°$, sondern dessen Nebenwinkel "
        r"$180° - 48° = 132°$. Kosinussatz: $\overline{BA}^2 = 260^2 + 190^2 - 2 \cdot 260 "
        r"\cdot 190 \cdot \cos 132° \approx 169\,810$, also $\overline{BA} \approx 412$ m. "
        r"Sinussatz: $\sin\angle TBA = \frac{190 \cdot \sin 132°}{412{,}1} \approx 0{,}343$, "
        r"also $\angle TBA \approx 20{,}0°$. Der Winkel ist sicher spitz, weil er der "
        r"kürzesten Seite gegenüberliegt.",
    ],
    falle=r"Bei d) ist $48°$ die **Richtungsänderung**, nicht der Winkel im Dreieck. Wer "
          r"mit $48°$ rechnet, erhält $\overline{BA} \approx 194$ m, weniger als die erste "
          r"Teilstrecke, obwohl sich das Boot nach der Boje weiter von $B$ entfernt. — "
          r"**Auswertung:** Teil B hat 30 BE, mit Teil A (15 BE) sind es 45 BE. "
          r"Notenskala: ab 39 BE Note 1, 32 bis 38 BE Note 2, 25 bis 31 BE Note 3, 18 bis "
          r"24 BE Note 4, 9 bis 17 BE Note 5, bis 8 BE Note 6. Für mangelhafte Form können "
          r"bis zu 2 BE abgezogen werden.",
    figs=[(fig_bruecke(), "Abbildung 1: der Brückenbogen über dem Wasser (Einheit 1 m)."),
          (fig_teich(), "Abbildung 2: die Bootsfahrt auf dem Schlossteich "
                        "(nicht maßstäblich).")],
    solfigs=[(fig_bruecke(solution=True), "Zu c): Das Boot passt in der Mitte hindurch; "
                                          "grün die größte Breite bei 1,6 m Höhe.")],
)


# ------------------------------------------------------------------ verify ---
def be(task):
    """Sum of the Bewertungseinheiten written into the parts of one task."""
    return sum(int(m) for m in re.findall(r"\((\d+) BE\)", " ".join(task["parts"])))


def solve3(m, v):
    """Cramer's rule with fractions - the LGS of B3 a) solved exactly."""
    def det(a):
        return (a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1])
                - a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0])
                + a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0]))
    d = det(m)
    assert d != 0
    out = []
    for j in range(3):
        mj = [[v[i] if k == j else m[i][k] for k in range(3)] for i in range(3)]
        out.append(Fr(det(mj), d))
    return out


def check():
    """Every number in the solutions, recomputed."""
    # --- Bewertungseinheiten: 8 + 7 + 15 = 30, read back from the printed parts
    per_task = [be(t) for t in s.tasks]
    assert per_task == [8, 7, 15] and sum(per_task) == 30, per_task
    for t, total in zip(s.tasks, per_task):
        assert "(%d BE)" % total in t["intro"], t["title"]
    # Notenskala: 0 to 45 BE covered without gap or overlap, Teil A + Teil B = 45
    assert 15 + 30 == 45
    covered = sorted(b for _, lo, hi in SCALE for b in range(lo, hi + 1))
    assert covered == list(range(46))
    for (_, lo, hi), (_, lo2, hi2) in zip(SCALE, SCALE[1:]):
        assert lo2 < lo and hi2 == lo - 1

    # --- B1 ----------------------------------------------------------------------
    for x in range(-5, 10):
        assert f(x) == -Fr(1, 2) * (x - 2) ** 2 + 8
        assert -2 * f(x) == x * x - 4 * x - 12
    assert f(2) == 8 and all(f(Fr(k, 4)) <= 8 for k in range(-20, 40))
    assert 2 - sqrt(4 + 12) == -2 and 2 + sqrt(4 + 12) == 6
    assert f(-2) == 0 and f(6) == 0 and f(0) == 6
    assert Fr(0 - 6, 6 - 0) == -1 and g(0) == 6 and g(6) == 0
    for x in range(-5, 10):
        assert f(x) - g(x) == -Fr(1, 2) * x * x + 3 * x == x * (3 - Fr(1, 2) * x)
    assert [x for x in range(-20, 21) if f(x) == g(x)] == [0, 6]
    # tangent: x^2 - 6x + 2n - 12 = 0 has a double root exactly for n = 10,5
    for x in range(-5, 10):
        assert -2 * (f(x) - h(x)) == x * x - 6 * x + 2 * N_TOUCH - 12
    assert 9 - (2 * N_TOUCH - 12) == 0 and N_TOUCH == Fr(21, 2)
    assert f(3) == Fr(15, 2) == h(3) and -Fr(9, 2) + 6 + 6 == Fr(15, 2)
    assert all(f(Fr(k, 10)) < h(Fr(k, 10)) for k in range(-50, 100) if k != 30)
    assert Fr(0 + 6, 2) == 3 and Fr(15, 2) + 3 == N_TOUCH          # zweiter Weg

    # --- B2 ----------------------------------------------------------------------
    assert round(V_BODY, 2) == 13.85 and round(V_TIP, 2) == 0.51
    assert round(V_CANDLE, 2) == 14.37
    assert V_BLOCK == 2400 and V_USE == 2280
    assert round(float(V_USE) / V_CANDLE, 1) == 158.7 and round(2280 / 14.37, 1) == 158.7
    assert floor(float(V_USE) / V_CANDLE) == 158 and floor(2280 / 14.37) == 158
    assert P_EE == Fr(30, 90) == Fr(1, 3) and round(float(P_EE), 3) == 0.333
    assert 1 - P_EE == Fr(2, 3) and round(float(1 - P_EE), 3) == 0.667
    assert P_BB == Fr(12, 90) and P_SAME == Fr(42, 90) == Fr(7, 15)
    assert round(float(P_SAME), 3) == 0.467
    assert P_DIFF == Fr(48, 90) == Fr(8, 15) and round(float(P_DIFF), 3) == 0.533
    assert P_SAME + P_DIFF == 1 and P_DIFF > P_SAME
    # Kontrolle durch Abzaehlen aller geordneten Zuege
    kiste = ["E"] * N_ENGEL + ["B"] * N_BERG
    zuege = list(permutations(range(N_FIG), 2))
    assert Fr(sum(1 for i, j in zuege if kiste[i] == kiste[j] == "E"), len(zuege)) == P_EE
    assert Fr(sum(1 for i, j in zuege if kiste[i] == kiste[j]), len(zuege)) == P_SAME
    # die Falle: mit Zuruecklegen
    q = Fr(N_ENGEL, N_FIG)
    assert q * q == Fr(36, 100) and (1 - q) ** 2 == Fr(16, 100)
    assert q * q + (1 - q) ** 2 == Fr(52, 100) > Fr(1, 2)

    # --- B3 ----------------------------------------------------------------------
    assert TOTALS == (43, 39, 73)
    assert solve3([list(r) for r in GROUPS], list(TOTALS)) == [12, 9, 5]
    assert 2 * 12 == 24 and 24 + 9 + 10 == 43
    assert p(0) == 0 and p(8) == 0 and p(Fr(2)) == Fr(3, 2)
    assert 64 * PA + 8 * PB == 0 and 4 * PA + 2 * PB == Fr(3, 2) and PB == -8 * PA
    assert PA == Fr(-125, 1000) and PB == 1 and PC == 0
    assert p(4) == 2 and -2 + 4 == 2 and all(p(Fr(k, 10)) <= 2 for k in range(0, 81))
    assert p(Fr(5, 2)) == p(Fr(11, 2)) == Fr(171875, 100000)
    assert round(float(p(Fr(5, 2))), 2) == 1.72 and p(Fr(5, 2)) > BOAT_H
    assert round(float(p(Fr(5, 2)) - BOAT_H) * 100) == 12          # knapp 12 cm
    assert float(p(Fr(5, 2)) - BOAT_H) < 0.12
    for x in range(-3, 12):
        assert -8 * (p(x) - BOAT_H) == x * x - 8 * x + Fr(64, 5)
    x1, x2 = 4 - sqrt(3.2), 4 + sqrt(3.2)
    assert abs(float(p(x1)) - 1.6) < 1e-12 and abs(float(p(x2)) - 1.6) < 1e-12
    assert round(x1, 2) == 2.21 and round(x2, 2) == 5.79
    assert abs(x2 - x1 - W_MAX) < 1e-12 and round(W_MAX, 2) == 3.58
    assert T_IN == 132
    assert round(BA ** 2) == 169810 and round(BA) == 412 and round(BA, 1) == 412.1
    assert round(L2 * sin(radians(T_IN)) / 412.1, 3) == 0.343 and round(SIN_B, 3) == 0.343
    assert round(ANG_B, 1) == 20.0
    assert L2 < L1 < BA                                               # kuerzeste Seite
    # Kontrolle des Winkels ueber den Kosinussatz
    cos_b = (L1 ** 2 + BA ** 2 - L2 ** 2) / (2 * L1 * BA)
    assert abs(degrees(math.acos(cos_b)) - ANG_B) < 1e-9
    assert round(BA_WRONG) == 194 and BA_WRONG < L1                 # die Falle

    # --- figures agree with the numbers ---------------------------------------
    B, T, A = teich_points()
    assert abs(math.hypot(T[0] - B[0], T[1] - B[1]) - L1 * TEICH_SC) < 1e-9
    assert abs(math.hypot(A[0] - T[0], A[1] - T[1]) - L2 * TEICH_SC) < 1e-9
    assert abs(math.hypot(A[0] - B[0], A[1] - B[1]) - BA * TEICH_SC) < 1e-9
    assert all(15 < pt[0] < 425 and 60 < pt[1] < 215 for pt in (B, T, A))
    assert ceil(W_MAX) == 4


s.verify(check)
s.save()
