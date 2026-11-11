#!/usr/bin/env python3
"""Vergleichsarbeit-Training BGY Klasse 11 (Sachsen) - Teil A, ohne Hilfsmittel (Satz 1).

    python3 tools/aufgaben/va/teila.py

Teil A of the Sachsen Vergleichsarbeit Mathematik, Berufliches Gymnasium Klasse 11:
25 minutes, 15 BE, no calculator and no formula book. Six Ankreuzaufgaben (A1 to A6,
five options each), then two short tasks. The sheet layout allows at most four parts
per task, so the six items sit two by two in three parts. Task types follow the
originals 2022 to 2025 (percent, roots and powers, units, regular polygon, parabola in
vertex form, dice; a line and its parallel, an incomplete tree without replacement and
a term to interpret); wording, numbers and every figure are our own.
"""
import os
import sys
from fractions import Fraction as Fr
from itertools import permutations, product
from math import sqrt, hypot

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# Two Ankreuz items share one part (the sheet allows four parts per task); an em
# space on both sides survives HTML whitespace collapsing and keeps them apart.
SEP = "\u2003‖\u2003"

# ------------------------------------------------- Aufgabe 2: zwei Geraden -----
GP, GQ = (-2, 1), (2, 3)                   # two points of g
N_H = (4, 0)                               # h runs through N, parallel to g
M_G = Fr(GQ[1] - GP[1], GQ[0] - GP[0])     # 1/2


def g(x):
    return M_G * x + 2


def h(x):
    return M_G * x - 2


RA, RB, RC, RD = (-4, 0), (0, 2), (4, 0), (0, -2)   # the rhombus on the axes

# ---------------------------------------------------- Aufgabe 3: Tombola -------
LOSE, GEWINNE = 10, 4                      # what is in the drum before Lena draws
P1G = Fr(GEWINNE, LOSE)                    # 2/5
PGG = Fr(GEWINNE - 1, LOSE - 1)            # 1/3  after a win
PNG = Fr(GEWINNE, LOSE - 1)                # 4/9  after a blank


# ----------------------------------------------------------------- figures ---
def fig_gerade(full=False):
    """Task: only g with P and Q. Solution: h, the rhombus and its corners as well."""
    p = S.Plot((-5.4, 5.6), (-3.4, 4.4), w=520, h=377, pad=(40, 22, 18, 34))
    assert abs(p.sx - p.sy) < 0.5           # same scale on both axes, the rhombus stays true
    p.grid(1, 1)
    p.axes(1, 1, defer_labels=True)
    if full:
        p.poly([p.P(*RA), p.P(*RB), p.P(*RC), p.P(*RD)], stroke="none", width=0,
               fill=S.ORANGE, opacity=0.35)
        p.poly([p.P(*RA), p.P(*RB), p.P(*RC), p.P(*RD)], stroke=S.INK, width=1.2,
               dash="4 3")
        p.curve(lambda x: 0.5 * x - 2, -5.4, 5.6, S.GREEN, 2.1)
    p.curve(lambda x: 0.5 * x + 2, -5.4, 5.6, S.RED, 2.1)
    p.draw_labels()
    p.point(*GP, label="P", pos="above-left", color=S.INK)
    p.point(*GQ, label="Q", pos="above-left", color=S.INK)
    p.text(p.X(4.3), p.Y(3.55), "g", 15, S.RED, "start", italic=True, halo=S.PAPER)
    if full:
        p.text(p.X(4.75), p.Y(0.62), "h", 15, S.GREEN, "start", italic=True, halo=S.PAPER)
        p.point(*RA, label="A", pos="above-left", color=S.INK)
        p.point(*RB, label="B", pos="above-left", color=S.INK)
        p.point(*RC, label="C", pos="below-right", color=S.INK)
        p.point(*RD, label="D", pos="below-right", color=S.INK)
        return p.svg("Die Geraden g und h, parallel, mit der Raute A(-4|0), B(0|2), C(4|0), "
                     "D(0|-2) zwischen ihnen und den Achsen")
    return p.svg("Koordinatensystem mit der steigenden Geraden g durch P(-2|1) und Q(2|3)")


def _label_at(p, q, size, hw, hh, gap=6):
    """Centre for a branch label: off the middle of the branch along its normal, on the
    upper-left side of a rising branch and the lower-left side of a falling one, far
    enough that a box of half width hw and half height hh keeps clear of the line."""
    (x1, y1), (x2, y2) = p, q
    d = hypot(x2 - x1, y2 - y1) or 1.0
    ux, uy = (x2 - x1) / d, (y2 - y1) / d
    nx, ny = (uy, -ux) if uy < 0 else (-uy, ux)
    off = gap + abs(nx) * hw + abs(ny) * hh
    return ((x1 + x2) / 2.0 + nx * off, (y1 + y2) / 2.0 + ny * off)


def fig_baum(full=False):
    """Two draws without replacement. Task: three branches blank (dashed slots).
    Solution: all six, the added ones in red, and the four path probabilities."""
    d = S.Diagram(520, 262)
    root, g1, n1 = (36, 131), (186, 70), (186, 192)
    leaves = {"GG": (350, 34), "GN": (350, 106), "NG": (350, 156), "NN": (350, 228)}
    br = [(root, g1, P1G, True), (root, n1, 1 - P1G, False),
          (g1, leaves["GG"], PGG, True), (g1, leaves["GN"], 1 - PGG, False),
          (n1, leaves["NG"], PNG, True), (n1, leaves["NN"], 1 - PNG, False)]
    size = 14
    for a, b, pr, given in br:
        dist = hypot(b[0] - a[0], b[1] - a[1])
        ux, uy = (b[0] - a[0]) / dist, (b[1] - a[1]) / dist
        d.line(a[0] + ux * 6, a[1] + uy * 6, b[0] - ux * 6, b[1] - uy * 6, S.MUTED, 1.3)
        cx, cy = _label_at(a, b, size, 12, 15)
        if given or full:
            d.frac(cx, cy, pr.numerator, pr.denominator, size,
                   S.BODY if given else S.RED)
        else:
            d.poly([(cx - 13, cy - 17), (cx + 13, cy - 17), (cx + 13, cy + 17),
                    (cx - 13, cy + 17)], stroke=S.MUTED, width=1, dash="3 2")
    d.node(*root, color=S.MUTED)
    d.node(g1[0], g1[1], None, color=S.GREEN)
    d.node(n1[0], n1[1], None, color=S.BODY)
    d.text(g1[0] + 2, g1[1] - 12, "G", 14, S.INK, italic=True, halo=S.PAPER)
    d.text(n1[0] + 2, n1[1] + 24, "N", 14, S.INK, italic=True, halo=S.PAPER)
    path = {"GG": PGG * P1G, "GN": (1 - PGG) * P1G, "NG": PNG * (1 - P1G),
            "NN": (1 - PNG) * (1 - P1G)}
    for key, (x, y) in leaves.items():
        d.node(x, y, None, color=S.GREEN if key[1] == "G" else S.BODY)
        d.text(x + 14, y + 5, "%s, %s" % (key[0], key[1]), 14, S.INK, "start", italic=True)
        if full:
            pr = path[key]
            d.text(x + 64, y + 5, "P =", 13, S.MUTED, "start")
            d.frac(x + 98, y, pr.numerator, pr.denominator, 13, S.INK, "start")
    return d.svg("Baumdiagramm fuer zweimaliges Ziehen ohne Zuruecklegen, G fuer Gewinn, "
                 "N fuer Niete" + ("; alle Wahrscheinlichkeiten eingetragen" if full else
                                   "; gegeben sind 2/5 fuer G, danach 1/3 fuer G nach G "
                                   "und 4/9 fuer G nach N, die anderen drei fehlen"))


# ------------------------------------------------------------------- sheet ---
s = Sheet("va-bgy11-teila", "Teil A — ohne Hilfsmittel (Satz 1)",
          kind="Vergleichsarbeit-Training",
          suffix="",
          klasse="Berufliches Gymnasium · Klasse 11",
          sub="Berufliches Gymnasium · Klasse 11 · Vergleichsarbeit Mathematik · Teil A · "
              "25 Minuten, nur Zeichengeräte · drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Vergleichsarbeit-Training Mathematik Berufliches Gymnasium Klasse 11, Teil A "
               "ohne Hilfsmittel: sechs Ankreuzaufgaben zu Prozent, Wurzeln, Einheiten, "
               "Vieleck, Parabel und Würfel, zwei parallele Geraden mit einer Raute und eine "
               "Tombola mit unvollständigem Baumdiagramm, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/vergleichsarbeit.html", "Zur Übersicht"))

s.task(
    "Sechsmal ankreuzen", 1,
    r"Diese Aufgabe entspricht den Ankreuzaufgaben A1 bis A6 der Vergleichsarbeit; jede "
    r"Teilaufgabe enthält zwei davon. Bei jeder ist genau **eine** der fünf Antworten "
    r"richtig. Notieren Sie nur den Buchstaben. Taschenrechner und Formelsammlung sind "
    r"nicht zugelassen.",
    [
        r"**A1** Beim Fahrradcheck an der Schule hatten im letzten Jahr $40$ Räder Mängel, "
        r"in diesem Jahr nur noch $30$. Um wie viel Prozent ist die Zahl der Räder mit "
        r"Mängeln gesunken? • (A) $10\ \%$ • (B) $25\ \%$ • (C) $30\ \%$ • "
        r"(D) $33\frac{1}{3}\ \%$ • (E) $75\ \%$" + SEP +
        r"**A2** Der Term $\sqrt{8} \cdot \sqrt{2} + 4^{-1}$ hat den Wert: • (A) $3{,}75$ • "
        r"(B) $\sqrt{10} - 4$ • (C) $0$ • (D) $16{,}25$ • (E) $4{,}25$",

        r"**A3** Ein würfelförmiger Behälter fasst genau $125$ Liter. Seine Kantenlänge "
        r"beträgt: • (A) $5\ \mathrm{cm}$ • (B) $12{,}5\ \mathrm{cm}$ • "
        r"(C) $50\ \mathrm{cm}$ • (D) $1{,}25\ \mathrm{m}$ • (E) $5\ \mathrm{m}$" + SEP +
        r"**A4** Jeder Innenwinkel eines regelmäßigen Achtecks ist: • (A) $135°$ • "
        r"(B) $45°$ • (C) $120°$ • (D) $144°$ • (E) $1080°$",

        r"**A5** Für die in $\mathbb{R}$ definierte Funktion $f$ mit $f(x) = -(x - 2)^2 + 3$ "
        r"gilt: • (A) Der Graph ist nach oben geöffnet. • (B) $S(-2 \mid 3)$ ist der "
        r"Scheitelpunkt. • (C) Der Punkt $(0 \mid 3)$ liegt auf dem Graphen. • (D) $f$ hat "
        r"keine Nullstelle. • (E) $S(2 \mid 3)$ ist der Scheitelpunkt." + SEP +
        r"**A6** Ein Würfel wird dreimal geworfen. Die Wahrscheinlichkeit dafür, dass "
        r"dabei **keine** Sechs fällt, beträgt: • (A) $\frac{1}{216}$ • "
        r"(B) $\frac{1}{2}$ • (C) $\frac{91}{216}$ • (D) $\frac{125}{216}$ • "
        r"(E) $\frac{5}{6}$",
    ],
    [
        r"**A1:** Richtig ist **(B)**. Die Abnahme beträgt $10$ Räder, bezogen auf den "
        r"alten Wert: $\frac{10}{40} = \frac{1}{4} = 25\ \%$. (D) bezieht die Abnahme auf "
        r"den neuen Wert, $\frac{10}{30} = 33\frac{1}{3}\ \%$, und (E) ist der neue Wert in "
        r"Prozent des alten, $\frac{30}{40} = 75\ \%$. "
        "\u2003" r"**A2:** Richtig ist **(E)**. $\sqrt{8} \cdot \sqrt{2} = \sqrt{16} = 4$ und "
        r"$4^{-1} = \frac{1}{4}$, zusammen $4{,}25$. (A) entsteht mit "
        r"$4^{-1} = -\frac{1}{4}$, (C) mit $4^{-1} = -4$, (D) ohne die Wurzel aus $16$, "
        r"und (B) addiert die Radikanden und rechnet ebenfalls $4^{-1} = -4$.",

        r"**A3:** Richtig ist **(C)**. $125\ \ell = 125\ \mathrm{dm}^3$, und wegen "
        r"$5^3 = 125$ ist die Kante $5\ \mathrm{dm} = 50\ \mathrm{cm}$ lang. Ein Würfel mit "
        r"$5\ \mathrm{cm}$ Kante (A) fasst nur $125\ \mathrm{cm}^3 = 0{,}125\ \ell$, einer mit "
        r"$5\ \mathrm{m}$ Kante (E) ganze $125\ \mathrm{m}^3$. (B) und (D) teilen nur durch "
        r"$10$ beziehungsweise $100$, statt die dritte Wurzel zu ziehen. "
        "\u2003" r"**A4:** Richtig ist **(A)**. Die Innenwinkelsumme eines $n$-Ecks ist "
        r"$(n - 2) \cdot 180°$, beim Achteck $6 \cdot 180° = 1080°$ (E). Auf acht gleiche "
        r"Winkel verteilt sind das $1080° : 8 = 135°$. (B) ist der Mittelpunktswinkel "
        r"$360° : 8$, (C) gehört zum Sechseck und (D) zum Zehneck.",

        r"**A5:** Richtig ist **(E)**. Aus der Scheitelpunktform $f(x) = a(x - d)^2 + e$ "
        r"liest man $S(d \mid e) = S(2 \mid 3)$ ab; (B) hat das Vorzeichen von $d$ falsch. "
        r"Wegen $a = -1 < 0$ ist die Parabel nach unten geöffnet (A). Es ist "
        r"$f(0) = -4 + 3 = -1$, der Graph schneidet die $y$-Achse also in "
        r"$(0 \mid -1)$ und nicht in $(0 \mid 3)$ (C). Der "
        r"Scheitel liegt über der $x$-Achse und die Parabel ist nach unten geöffnet, "
        r"deshalb hat $f$ zwei Nullstellen (D). "
        "\u2003" r"**A6:** Richtig ist **(D)**. Bei jedem Wurf hat „keine Sechs“ die "
        r"Wahrscheinlichkeit $\frac{5}{6}$, nach der Pfadregel also "
        r"$\left(\frac{5}{6}\right)^3 = \frac{125}{216}$. (C) ist die Wahrscheinlichkeit des "
        r"Gegenereignisses „mindestens eine Sechs“, (A) die für drei Sechsen, (B) kommt aus "
        r"dem falschen Ansatz $1 - 3 \cdot \frac{1}{6}$, und (E) gilt nur für einen Wurf.",
    ],
    falle=r"Bei A1 entscheidet der Grundwert: Eine Veränderung in Prozent bezieht sich "
          r"immer auf den **alten** Wert. Wer durch $30$ teilt, landet bei (D). Und bei A2 "
          r"gilt zwar $\sqrt{a} \cdot \sqrt{b} = \sqrt{a \cdot b}$, aber "
          r"$\sqrt{a} + \sqrt{b}$ ist nicht $\sqrt{a + b}$.",
)

s.task(
    "Zwei parallele Geraden und eine Raute", 2,
    r"Die Abbildung zeigt den Graphen der linearen Funktion $g$, der durch die Punkte "
    r"$P(-2 \mid 1)$ und $Q(2 \mid 3)$ verläuft. Die Aufgabe ist ohne Taschenrechner zu "
    r"lösen; Wurzeln dürfen im Ergebnis stehen bleiben.",
    [
        r"Geben Sie eine Gleichung der Funktion $g$ an und berechnen Sie ihre Nullstelle.",
        r"Die Gerade $h$ verläuft parallel zu $g$ durch den Punkt $N(4 \mid 0)$. Geben Sie "
        r"eine Gleichung von $h$ an.",
        r"Die vier Schnittpunkte der beiden Geraden mit den Koordinatenachsen sind die "
        r"Eckpunkte eines Vierecks. Berechnen Sie seinen Flächeninhalt.",
        r"Begründen Sie, dass dieses Viereck eine Raute, aber kein Quadrat ist.",
    ],
    [
        r"Anstieg: $m = \frac{3 - 1}{2 - (-2)} = \frac{2}{4} = \frac{1}{2}$. Einsetzen von "
        r"$Q$ in $y = \frac{1}{2}x + n$: $3 = 1 + n$, also $n = 2$ und "
        r"$g(x) = \frac{1}{2}x + 2$. Probe mit $P$: $\frac{1}{2} \cdot (-2) + 2 = 1$. "
        r"Nullstelle: $\frac{1}{2}x + 2 = 0$ ergibt $x = -4$.",

        r"Parallele Geraden haben denselben Anstieg, also $h(x) = \frac{1}{2}x + n$. Mit "
        r"$N$: $0 = \frac{1}{2} \cdot 4 + n$, also $n = -2$ und $h(x) = \frac{1}{2}x - 2$.",

        r"Die Ecken sind $A(-4 \mid 0)$ und $B(0 \mid 2)$ auf $g$ sowie $C(4 \mid 0)$ und "
        r"$D(0 \mid -2)$ auf $h$. Die Diagonalen $\overline{AC}$ und $\overline{BD}$ liegen "
        r"auf den Achsen, stehen also senkrecht aufeinander, und sind $8$ und $4$ lang. "
        r"Flächeninhalt: $\frac{1}{2} \cdot 8 \cdot 4 = 16$ Flächeneinheiten. Kontrolle: "
        r"Die Achsen zerlegen das Viereck in vier rechtwinklige Dreiecke mit den Katheten "
        r"$4$ und $2$, jedes mit dem Flächeninhalt $\frac{1}{2} \cdot 4 \cdot 2 = 4$.",

        r"Alle vier Seiten sind Hypotenusen solcher Dreiecke mit den Katheten $4$ und $2$, "
        r"also gleich lang: $\sqrt{4^2 + 2^2} = \sqrt{20} = 2\sqrt{5}$. Ein Viereck mit vier "
        r"gleich langen Seiten ist eine Raute. Ein Quadrat ist es nicht, denn seine "
        r"Diagonalen sind verschieden lang. Man sieht es auch an den Anstiegen: "
        r"$\overline{AB}$ steigt mit $\frac{1}{2}$, $\overline{BC}$ fällt mit "
        r"$-\frac{1}{2}$, und das Produkt $-\frac{1}{4}$ ist nicht $-1$. Die Seiten stehen "
        r"also nicht senkrecht aufeinander.",
    ],
    falle=r"Bei c) ist der Flächeninhalt **nicht** $8 \cdot 4 = 32$: Das wäre das Rechteck, "
          r"das die Raute umschließt. Die Raute füllt genau die Hälfte davon aus.",
    figs=[(fig_gerade(), "Der Graph von g mit den Punkten P und Q.")],
    solfigs=[(fig_gerade(full=True),
              "Zu b) bis d): Die Parallele h und die Raute ABCD zwischen den beiden Geraden. "
              "Ihre Diagonalen liegen auf den Achsen.")],
)

s.task(
    "Die Lostrommel der Schulfest-Tombola", 3,
    r"Bei der Tombola des Schulfests liegen in einer Lostrommel nur noch Gewinnlose ($G$) "
    r"und Nieten ($N$). Lena zieht nacheinander zwei Lose; ein gezogenes Los wird nicht "
    r"zurückgelegt. Das unvollständige Baumdiagramm beschreibt diesen Zufallsversuch.",
    [
        r"Ergänzen Sie die drei fehlenden Wahrscheinlichkeiten im Baumdiagramm.",
        r"Begründen Sie, dass vor Lenas Ziehung genau $10$ Lose in der Trommel lagen, davon "
        r"$4$ Gewinnlose.",
        r"Berechnen Sie die Wahrscheinlichkeit dafür, dass Lena mindestens ein Gewinnlos "
        r"zieht.",
        r"Geben Sie ein Ereignis an, dessen Wahrscheinlichkeit mit dem Term "
        r"$1 - \frac{2}{5} \cdot \frac{1}{3}$ berechnet werden kann, und geben Sie den Wert "
        r"des Terms an.",
    ],
    [
        r"An jedem Verzweigungspunkt ergänzen sich die Wahrscheinlichkeiten zu $1$. Erste "
        r"Stufe: Niete mit $1 - \frac{2}{5} = \frac{3}{5}$. Nach einem Gewinnlos: Niete mit "
        r"$1 - \frac{1}{3} = \frac{2}{3}$. Nach einer Niete: Niete mit "
        r"$1 - \frac{4}{9} = \frac{5}{9}$.",

        r"Es seien $n$ Lose mit $k$ Gewinnlosen in der Trommel. Beim zweiten Zug sind noch "
        r"$n - 1$ Lose übrig; nach einer Niete sind noch alle $k$ Gewinnlose dabei, nach "
        r"einem Gewinnlos nur noch $k - 1$. Also gilt $\frac{k}{n - 1} = \frac{4}{9}$ und "
        r"$\frac{k - 1}{n - 1} = \frac{1}{3} = \frac{3}{9}$. Die Differenz der beiden Brüche "
        r"ist $\frac{1}{n - 1} = \frac{1}{9}$, also $n - 1 = 9$ und $n = 10$. Damit ist "
        r"$k = \frac{4}{9} \cdot 9 = 4$. Probe mit der ersten Stufe: "
        r"$\frac{4}{10} = \frac{2}{5}$.",

        r"Über das Gegenereignis „zwei Nieten“: "
        r"$P = 1 - \frac{3}{5} \cdot \frac{5}{9} = 1 - \frac{1}{3} = \frac{2}{3}$. Zweiter "
        r"Weg über die drei Pfade mit Gewinn: $\frac{2}{5} \cdot \frac{1}{3} + "
        r"\frac{2}{5} \cdot \frac{2}{3} + \frac{3}{5} \cdot \frac{4}{9} = \frac{2}{15} + "
        r"\frac{4}{15} + \frac{4}{15} = \frac{10}{15} = \frac{2}{3}$.",

        r"$\frac{2}{5} \cdot \frac{1}{3}$ ist die Wahrscheinlichkeit des Pfades „Gewinnlos, "
        r"Gewinnlos“. Der Term gehört also zum Gegenereignis: **„Lena zieht höchstens ein "
        r"Gewinnlos“**, gleichbedeutend mit „Lena zieht mindestens eine Niete“. Wert: "
        r"$1 - \frac{2}{15} = \frac{13}{15}$.",
    ],
    falle=r"Bei d) ist „genau ein Gewinnlos“ falsch: Das hat nur die Wahrscheinlichkeit "
          r"$\frac{4}{15} + \frac{4}{15} = \frac{8}{15}$, denn zum Ereignis gehört auch der "
          r"Pfad „Niete, Niete“. Und bei b) reicht die erste Stufe allein nicht: "
          r"$\frac{2}{5}$ passt auch zu $6$ von $15$ oder $8$ von $20$ Losen. Erst die "
          r"zweite Stufe legt die Anzahl fest.",
    figs=[(fig_baum(), "Das unvollständige Baumdiagramm: G steht für Gewinnlos, N für "
                       "Niete. Die gestrichelten Felder sind zu ergänzen.")],
    solfigs=[(fig_baum(full=True), "Zu a) und c): Das vollständige Baumdiagramm, die "
                                   "ergänzten Werte rot, rechts die Pfadwahrscheinlichkeiten.")],
)


def check():
    """Every number in the solutions, recomputed - exact with Fractions."""
    # --- A1 Prozent ------------------------------------------------------------------
    alt, neu = 40, 30
    assert Fr(alt - neu, alt) == Fr(1, 4)                      # (B) 25 %
    assert Fr(alt - neu, neu) == Fr(100, 3) / 100              # (D) 33 1/3 %
    assert Fr(neu, alt) == Fr(75, 100)                         # (E) 75 %
    assert alt - neu == 10 and neu == 30                       # (A), (C) die blossen Zahlen
    # --- A2 Wurzeln und Potenzen -----------------------------------------------------
    assert 8 * 2 == 16 == 4 ** 2 and abs(sqrt(8) * sqrt(2) - 4) < 1e-12
    wert = 4 + Fr(1, 4)
    assert wert == Fr(425, 100)                                # (E)
    assert 4 - Fr(1, 4) == Fr(375, 100)                        # (A) 4^-1 = -1/4
    assert 4 + (-4) == 0                                       # (C) 4^-1 = -4
    assert 16 + Fr(1, 4) == Fr(1625, 100)                      # (D) ohne Wurzel
    assert abs((sqrt(10) - 4) - float(wert)) > 1               # (B) Radikanden addiert
    # --- A3 Einheiten ----------------------------------------------------------------
    assert 5 ** 3 == 125                                       # 125 l = 125 dm^3, Kante 5 dm
    assert 5 * 10 == 50                                        # 5 dm = 50 cm  (C)
    assert Fr(5 ** 3, 1000) == Fr(125, 1000)                   # (A) 125 cm^3 = 0,125 l
    assert 5 ** 3 == 125                                       # (E) 125 m^3
    assert Fr(125, 10) == Fr(25, 2) and Fr(125, 100) == Fr(5, 4)   # (B) 12,5 cm  (D) 1,25 m
    assert Fr(25, 2) ** 3 != 125000 and 125 ** 3 != 125000     # 125 l = 125 000 cm^3
    assert 50 ** 3 == 125000                                   # nur 50 cm passt
    # --- A4 Achteck ------------------------------------------------------------------
    assert (8 - 2) * 180 == 1080 and Fr(1080, 8) == 135
    assert Fr(360, 8) == 45
    assert Fr((6 - 2) * 180, 6) == 120 and Fr((10 - 2) * 180, 10) == 144
    # --- A5 Parabel ------------------------------------------------------------------
    f = lambda x: -(x - 2) ** 2 + 3
    xs = [Fr(k, 10) for k in range(-50, 91)]
    top = max(xs, key=f)
    assert top == 2 and f(top) == 3                            # (E) S(2|3)
    assert f(Fr(-2)) == -13                                    # (B) S(-2|3) liegt nicht drauf
    assert f(Fr(10)) < f(Fr(2))                                # (A) nach unten geoeffnet
    assert f(Fr(0)) == -1 != 3                                 # (C)
    z1, z2 = 2 - sqrt(3), 2 + sqrt(3)                          # (D) zwei Nullstellen
    assert abs(-(z1 - 2) ** 2 + 3) < 1e-12 and abs(-(z2 - 2) ** 2 + 3) < 1e-12
    # --- A6 Wuerfel ------------------------------------------------------------------
    wuerfe = list(product(range(1, 7), repeat=3))
    keine = Fr(sum(1 for w in wuerfe if 6 not in w), len(wuerfe))
    assert keine == Fr(125, 216) == Fr(5, 6) ** 3              # (D)
    assert 1 - keine == Fr(91, 216)                            # (C)
    assert Fr(sum(1 for w in wuerfe if w == (6, 6, 6)), 216) == Fr(1, 216)   # (A)
    assert 1 - 3 * Fr(1, 6) == Fr(1, 2)                        # (B)
    assert len({keine, Fr(1, 216), Fr(1, 2), Fr(91, 216), Fr(5, 6)}) == 5
    # --- Aufgabe 2 -------------------------------------------------------------------
    assert M_G == Fr(1, 2)
    assert g(Fr(GP[0])) == GP[1] and g(Fr(GQ[0])) == GQ[1]
    assert g(Fr(-4)) == 0                                      # Nullstelle -4
    assert h(Fr(N_H[0])) == N_H[1] and h(Fr(0)) == -2
    assert RA == (-4, 0) and g(Fr(RA[0])) == 0 and g(Fr(0)) == RB[1]
    assert RC == N_H and h(Fr(0)) == RD[1]
    quad = [RA, RB, RC, RD]
    shoelace = Fr(abs(sum(quad[i][0] * quad[(i + 1) % 4][1] - quad[(i + 1) % 4][0] * quad[i][1]
                          for i in range(4))), 2)
    assert shoelace == 16
    assert Fr(1, 2) * (RC[0] - RA[0]) * (RB[1] - RD[1]) == 16  # Diagonalen 8 und 4
    assert RC[0] - RA[0] == 8 and RB[1] - RD[1] == 4
    assert 4 * Fr(1, 2) * 4 * 2 == 16                          # vier Dreiecke je 4
    sides = [(quad[i][0] - quad[(i + 1) % 4][0]) ** 2 + (quad[i][1] - quad[(i + 1) % 4][1]) ** 2
             for i in range(4)]
    assert sides == [20, 20, 20, 20] and 4 ** 2 + 2 ** 2 == 20 == 2 ** 2 * 5
    m_ab = Fr(RB[1] - RA[1], RB[0] - RA[0])
    m_bc = Fr(RC[1] - RB[1], RC[0] - RB[0])
    assert m_ab == Fr(1, 2) and m_bc == Fr(-1, 2) and m_ab * m_bc == Fr(-1, 4) != -1
    assert 8 * 4 == 32 and 32 / 2 == 16                        # die Falle
    # --- Aufgabe 3 -------------------------------------------------------------------
    assert P1G == Fr(2, 5) and PGG == Fr(1, 3) and PNG == Fr(4, 9)
    assert 1 - P1G == Fr(3, 5) and 1 - PGG == Fr(2, 3) and 1 - PNG == Fr(5, 9)
    # b) only n = 10, k = 4 fits all three given numbers
    fits = [(n, k) for n in range(2, 200) for k in range(1, n)
            if Fr(k, n) == Fr(2, 5) and Fr(k - 1, n - 1) == Fr(1, 3) and Fr(k, n - 1) == Fr(4, 9)]
    assert fits == [(10, 4)]
    assert Fr(4, 9) - Fr(1, 3) == Fr(1, 9)
    # the first stage alone fits many drums (the falle)
    assert [(n, k) for n in (10, 15, 20) for k in range(n) if Fr(k, n) == Fr(2, 5)] == \
        [(10, 4), (15, 6), (20, 8)]
    assert Fr(5, 14) != Fr(1, 3)                               # 6 von 15: zweite Stufe passt nicht
    # c), d) by counting all ordered pairs of lots
    lose = ["G"] * GEWINNE + ["N"] * (LOSE - GEWINNE)
    paare = list(permutations(range(LOSE), 2))
    count = lambda pred: Fr(sum(1 for i, j in paare if pred(lose[i] + lose[j])), len(paare))
    assert count(lambda w: w == "NN") == Fr(3, 5) * Fr(5, 9) == Fr(1, 3)
    mind = count(lambda w: "G" in w)
    assert mind == 1 - Fr(1, 3) == Fr(2, 3)
    assert Fr(2, 5) * Fr(1, 3) == Fr(2, 15) and Fr(2, 5) * Fr(2, 3) == Fr(4, 15)
    assert Fr(3, 5) * Fr(4, 9) == Fr(4, 15)
    assert Fr(2, 15) + Fr(4, 15) + Fr(4, 15) == Fr(10, 15) == mind
    term = 1 - Fr(2, 5) * Fr(1, 3)
    assert term == Fr(13, 15) == count(lambda w: w.count("G") <= 1) == count(lambda w: "N" in w)
    genau = count(lambda w: w.count("G") == 1)
    assert genau == Fr(8, 15) != term                          # die Falle


s.verify(check)
s.save()
