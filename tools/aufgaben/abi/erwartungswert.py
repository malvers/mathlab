#!/usr/bin/env python3
"""Abitur-Training BGY - Zufallsgroessen, Erwartungswert und faire Spiele.

    python3 tools/aufgaben/abi/erwartungswert.py

The part of the Saxon stochastics staircase that comes before the binomial distribution:
drawing without replacement, the distribution of a random variable in a table, expected
value and standard deviation, a fair game - and the term that has to be read back into
the situation. Binomial distribution and significance test live on the other sheets.
Context, numbers, wording and figures are our own.
"""
import itertools
import math
import os
import random
import re
import sys
from fractions import Fraction
from math import sqrt

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402

# --- Aufgabe 1: the container, four red and six blue balls, three draws ---------
ROT, BLAU = 4, 6
ZUEGE = 3
DAZU = 11                       # red balls added in part d)
ZIEL = Fraction(1, 2)           # target probability for two red ones in two draws

# --- Aufgabe 2: the wheel of fortune. (name, angle in degrees, payout, colour) --
EINSATZ = 2
SEKTOREN = [("rot", 45, 8, S.RED),
            ("gelb", 135, 2, S.ORANGE),
            ("blau", 180, 0, S.BODY)]
SPIELE_TAG = 400
ZIEL_TAG = 250

# --- Aufgabe 3: the redesigned wheel the organiser proposes --------------------
SEKTOREN_NEU = [("rot", 30, 12, S.RED),
                ("gelb", 135, 2, S.ORANGE),
                ("blau", 195, 0, S.BODY)]


# ------------------------------------------------------------ Aufgabe 1: urn ---
def rest(prefix):
    """Balls left in the container after the draws in prefix ('R' red, 'B' blue)."""
    return ROT - prefix.count("R"), BLAU - prefix.count("B")


def zug(prefix, farbe):
    """Numerator and denominator of the next draw - kept unreduced, that is how the
    fractions are written along the branches of the tree."""
    r, b = rest(prefix)
    return (r if farbe == "R" else b), r + b


def zug_p(prefix, farbe):
    z, n = zug(prefix, farbe)
    return Fraction(z, n)


def pfad_p(pfad):
    p = Fraction(1)
    for i, c in enumerate(pfad):
        p *= zug_p(pfad[:i], c)
    return p


PFADE = ["".join(t) for t in itertools.product("RB", repeat=ZUEGE)]
PROBS = {k: sum((pfad_p(p) for p in PFADE if p.count("R") == k), Fraction(0))
         for k in range(ZUEGE + 1)}
EX = sum(k * PROBS[k] for k in PROBS)
EX2 = sum(k * k * PROBS[k] for k in PROBS)
VAR = EX2 - EX * EX
SD = sqrt(float(VAR))
P_ZWEITE_ROT = (Fraction(ROT, ROT + BLAU) * Fraction(ROT - 1, ROT + BLAU - 1)
                + Fraction(BLAU, ROT + BLAU) * Fraction(ROT, ROT + BLAU - 1))


# --------------------------------------------------------- Aufgabe 2: wheel ---
def wahrsch(sekt):
    return [(name, Fraction(ang, 360), pay) for name, ang, pay, _ in sekt]


def auszahlung(sekt):
    """Expected payout of one turn, exact."""
    return sum((p * pay for _, p, pay in wahrsch(sekt)), Fraction(0))


P_SEKT = {name: p for name, p, _ in wahrsch(SEKTOREN)}
E_AUS = auszahlung(SEKTOREN)                     # 7/4 Euro
E_G = E_AUS - EINSATZ                            # -1/4 Euro
FAIR_EINSATZ = E_AUS                             # 7/4 Euro
FAIR_HAUPT = (Fraction(EINSATZ) - Fraction(3, 8) * 2) / Fraction(1, 8)   # 10 Euro
TAGESGEWINN = SPIELE_TAG * (-E_G)                # 100 Euro
SPIELE_ZIEL = ZIEL_TAG / (-E_G)                  # 1000 Spiele
E_AUS_NEU = auszahlung(SEKTOREN_NEU)
E_G_NEU = E_AUS_NEU - EINSATZ

# the three terms of Aufgabe 3 a)
T1 = 1 - Fraction(1, 2) ** 4
T2 = 2 * Fraction(1, 8) * Fraction(3, 8)
T3 = Fraction(1, 2) ** 3 * Fraction(1, 8)


# ----------------------------------------------------------------- figures ---
TREE_W, TREE_H = 610, 404
ROOT = (46, 200)
LVL1 = [(196, 108), (196, 292)]
LVL2 = [(330, 62), (330, 154), (330, 246), (330, 338)]
LVL3 = [(462, 36), (462, 88), (462, 128), (462, 180),
        (462, 220), (462, 272), (462, 312), (462, 364)]


def fig_baum(mit_pfaden):
    """Three stage tree. mit_pfaden adds the eight path probabilities on the right."""
    d = S.Diagram(TREE_W, TREE_H)
    d.node(ROOT[0], ROOT[1], None)
    for i, q in enumerate(LVL1):
        f = "R" if i == 0 else "B"
        d.branch(ROOT, q, "%d/%d" % zug("", f))
        d.node(q[0], q[1], f, "above" if i == 0 else "below")
    for i, q in enumerate(LVL2):
        pfad = PFADE[i * 2][:2]
        d.branch(LVL1[i // 2], q, "%d/%d" % zug(pfad[0], pfad[1]))
        d.node(q[0], q[1], pfad[1], "above" if i % 2 == 0 else "below")
    for i, q in enumerate(LVL3):
        pfad = PFADE[i]
        d.branch(LVL2[i // 2], q, "%d/%d" % zug(pfad[:2], pfad[2]))
        d.node(q[0], q[1], " ".join(pfad), "right")
        if mit_pfaden:
            d.text(q[0] + 68, q[1] + 5, "→  " + str(pfad_p(pfad)), 11.5, S.MUTED, "start")
    d.text(TREE_W / 2.0, TREE_H - 10,
           "R: rote Kugel   ·   B: blaue Kugel   ·   an den Ästen steht die "
           "Wahrscheinlichkeit für den nächsten Zug", 11.5, S.MUTED)
    return d.svg("Baumdiagramm der drei Zuege ohne Zuruecklegen mit acht Pfaden")


def fig_verteilung():
    p = S.Plot((-0.95, 3.95), (0, 0.66), w=470, h=300, pad=(58, 24, 24, 42))
    p.bars([float(PROBS[k]) for k in range(4)], 0, S.ORANGE, width=0.54)
    # The value axis is drawn at the left edge of the frame: Plot.axes always puts it at
    # x = 0, and the bar for k = 0 would stand right on top of its numbers.
    xa, ya = p.X(p.x0), p.Y(0)
    p.arrow(xa, ya, xa, p.Y(0.66), S.INK, 1.3)
    p.arrow(xa, ya, p.X(p.x1), ya, S.INK, 1.3)
    p.text(xa - 2, p.Y(0.66) - 9, "P(X = k)", 13, S.INK, "start", italic=True)
    p.text(p.X(p.x1) + 2, ya + 16, "k", 14, S.INK, "start", italic=True)
    for i in range(1, 6):
        v = 0.1 * i
        p.line(xa - 3.5, p.Y(v), xa + 3.5, p.Y(v), S.INK, 1.1)
        p.text(xa - 7, p.Y(v) + 4, S.num(v, 1), 11.5, S.MUTED, "end")
    for k in range(4):
        p.line(p.X(k), ya - 3.5, p.X(k), ya + 3.5, S.INK, 1.1)
        p.text(p.X(k), ya + 17, str(k), 11.5, S.MUTED)
        p.text(p.X(k), p.Y(float(PROBS[k])) - 8, str(PROBS[k]), 11.5, S.BODY,
               halo=S.PAPER)
    p.line(p.X(float(EX)), ya, p.X(float(EX)), p.Y(0.56), S.RED, 1.3, dash="4 3")
    p.brace(float(EX) - SD, float(EX) + SD, 0.60, "eine Standardabweichung", S.MUTED)
    p.text(p.X(2.45), p.Y(0.44), "Erwartungswert 1,2", 11.5, S.RED, "start", halo=S.PAPER)
    p.arrow(p.X(2.4), p.Y(0.437), p.X(float(EX)) + 5, p.Y(0.38), S.RED, 1.1)
    return p.svg("Stabdiagramm der Verteilung von X mit Erwartungswert und "
                 "Standardabweichung")


def fig_tabelle():
    d = S.Diagram(500, 116)
    cells = [["Gewinn g", "6", "0", "−2"],
             ["P(G = g)", "1/8", "3/8", "1/2"]]
    d.table(16, 14, 4, 2, 116, 38, cells)
    d.text(250, 106, "Gewinn in Euro, also Auszahlung vermindert um den Einsatz",
           11.5, S.MUTED)
    return d.svg("Wahrscheinlichkeitsverteilung des Gewinns G als Tabelle")


def rad(sekt):
    """The wheel as a Canvas, so two of them can go into one panel."""
    c = S.Canvas(470, 300)
    cx, cy, r = 128, 148, 106
    a = 0.0
    for name, ang, pay, col in sekt:
        # a narrow sector gets its label further out, otherwise it does not fit between
        # the two radii
        c.sector(cx, cy, r, a, a + ang, fill=col, label="%d €" % pay,
                 lr=0.62 if ang >= 60 else 0.78)
        a += ang
    c.circle(cx, cy, r, "none", S.INK, 1.5)
    # the pointer at twelve o'clock - angle 0 of Canvas.sector
    c.poly([(cx - 9, cy - r - 17), (cx + 9, cy - r - 17), (cx, cy - r + 7)],
           stroke=S.INK, width=1.2, fill=S.INK)
    c.legend(250, 112, [("%s: %d Grad · %s" % (name, ang,
                                               ("%d Euro" % pay) if pay else "nichts"),
                         col, "fill") for name, ang, pay, col in sekt])
    c.text(cx, cy + r + 32, "Einsatz: 2 Euro je Spiel", 12, S.MUTED)
    return c


SEKTOR_PFAD = re.compile(r'<path d="M ([\d.]+) ([\d.]+) L ([\d.]+) ([\d.]+) A ([\d.]+) '
                         r'[\d.]+ 0 (\d) 1 ([\d.]+) ([\d.]+) Z"')


def winkel_aus_svg(svg):
    """Read the sectors back out of the finished SVG and measure their angles.

    The figure has to carry the probabilities, not just claim them: this recomputes
    every angle from the coordinates that really end up in the file."""
    out = []
    for m in SEKTOR_PFAD.finditer(svg):
        cx, cy, x0, y0, _, large, x1, y1 = (float(v) for v in m.groups())
        a0, a1 = (round(math.degrees(math.atan2(x - cx, cy - y)) % 360, 6)
                  for x, y in ((x0, y0), (x1, y1)))
        span = (a1 - a0) % 360 or 360.0
        assert (span > 180) == bool(large), "large-arc flag does not fit the sector"
        out.append(span)
    return out


def fig_rad():
    return rad(SEKTOREN).svg("Gluecksrad mit rotem, gelbem und blauem Sektor")


def fig_raeder():
    return S.panel([rad(SEKTOREN), rad(SEKTOREN_NEU)],
                   captions=["bisher: roter Sektor 45 Grad, Auszahlung 8 Euro",
                             "Vorschlag: roter Sektor 30 Grad, Auszahlung 12 Euro"],
                   label="Das bisherige und das vorgeschlagene Gluecksrad nebeneinander")


def serie(seed, n):
    """One simulated run of the game: the running average of the player's gain.

    Deterministic through the seed, so the figure never changes between two builds."""
    rng = random.Random(seed)
    tot, out = 0.0, []
    for i in range(1, n + 1):
        u = rng.random()
        tot += 6 if u < 0.125 else (0 if u < 0.5 else -2)
        out.append(tot / i)
    return out


# two runs picked for the picture: one starts lucky and comes down from above, the other
# starts unlucky - and both end up at the expected value
SERIE_A, SERIE_B = serie(267, 400), serie(81, 400)


START = 6                       # the first few averages jump between -2 and +6


def fig_konvergenz():
    p = S.Plot((0, 420), (-1.3, 0.9), w=545, h=300, pad=(56, 24, 22, 40))
    p.axes(100, 0.4, xlabel="n", ylabel="Euro", ydec=1, defer_labels=True)
    p.line(p.X(0), p.Y(float(E_G)), p.X(420), p.Y(float(E_G)), S.RED, 1.4, dash="5 3")
    for pts, col in ((SERIE_A, S.GREEN), (SERIE_B, S.ORANGE)):
        poly = [p.P(i + 1, v) for i, v in enumerate(pts) if i + 1 >= START]
        p.clipped(lambda q=poly, c=col: p.poly(q, stroke=c, width=1.5, close=False))
    p.legend(p.X(140), p.Y(0.84),
             [("Spielserie 1", S.GREEN, "line"), ("Spielserie 2", S.ORANGE, "line"),
              ("Erwartungswert −0,25 Euro", S.RED, "dash")])
    p.draw_labels()
    return p.svg("Durchschnittlicher Gewinn je Spiel in Abhaengigkeit von der Spielanzahl")


# ------------------------------------------------------------------- sheet ---
s = Sheet("abitur-bgy-erwartungswert", "Zufallsgrößen, Erwartungswert und faire Spiele",
          kind="Abitur-Training",
          suffix="",
          klasse="Berufliches Gymnasium",
          sub="Berufliches Gymnasium · Stochastik ohne Binomialverteilung · Grund- und "
              "Leistungskurs · drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Abitur-Training Mathematik BGY: Ziehen ohne Zurücklegen, "
               "Wahrscheinlichkeitsverteilung, Erwartungswert und Standardabweichung, "
               "faires Glücksspiel und das Deuten von Termen, mit Lösungen und "
               "Abbildungen.",
          plan=("../svp/mathe/abitur.html", "Zur Übersicht"))

s.task(
    "Drei Kugeln aus dem Behälter", 1,
    r"In einem undurchsichtigen Behälter liegen zehn gleich große Kugeln: **vier rote** "
    r"und **sechs blaue**. Es werden nacheinander drei Kugeln zufällig **ohne "
    r"Zurücklegen** gezogen. Die Zufallsgröße $X$ gibt die Anzahl der gezogenen roten "
    r"Kugeln an.",
    [
        r"Stellen Sie die Wahrscheinlichkeitsverteilung von $X$ in einer Tabelle dar und "
        r"weisen Sie nach, dass sich die Wahrscheinlichkeiten zu $1$ ergänzen.",
        r"Berechnen Sie den Erwartungswert und die Standardabweichung von $X$ und deuten "
        r"Sie den Erwartungswert im Sachzusammenhang.",
        r"Bestimmen Sie die Wahrscheinlichkeit dafür, dass die **zweite** gezogene Kugel "
        r"rot ist.",
        r"In den Behälter werden zusätzlich rote Kugeln gelegt. Ermitteln Sie, wie viele "
        r"es sein müssen, damit beim Ziehen von zwei Kugeln ohne Zurücklegen mit der "
        r"Wahrscheinlichkeit $0{,}5$ beide Kugeln rot sind.",
    ],
    [
        r"Jeder Pfad wird durchmultipliziert, Pfade zum selben Wert von $X$ werden "
        r"addiert. Kein Treffer: "
        r"$P(X = 0) = \frac{6}{10} \cdot \frac{5}{9} \cdot \frac{4}{8} = \frac{1}{6}$. "
        r"Genau ein Treffer — drei Pfade mit denselben Faktoren in anderer Reihenfolge, "
        r"jeder mit $\frac{1}{6}$: $P(X = 1) = 3 \cdot \frac{1}{6} = \frac{1}{2}$. "
        r"Ebenso $P(X = 2) = 3 \cdot \frac{4}{10} \cdot \frac{3}{9} \cdot \frac{6}{8} "
        r"= \frac{3}{10}$ und "
        r"$P(X = 3) = \frac{4}{10} \cdot \frac{3}{9} \cdot \frac{2}{8} = \frac{1}{30}$. "
        r"Die Tabelle lautet also: zu $k = 0;\,1;\,2;\,3$ gehören der Reihe nach "
        r"$\frac{1}{6}$, $\frac{1}{2}$, $\frac{3}{10}$ und $\frac{1}{30}$. Probe: "
        r"$\frac{5}{30} + \frac{15}{30} + \frac{9}{30} + \frac{1}{30} = 1$.",

        r"Erwartungswert: "
        r"$E(X) = 0 \cdot \frac{1}{6} + 1 \cdot \frac{1}{2} + 2 \cdot \frac{3}{10} "
        r"+ 3 \cdot \frac{1}{30} = \frac{6}{5} = 1{,}2$. Für die Streuung zuerst "
        r"$E(X^2) = 1 \cdot \frac{1}{2} + 4 \cdot \frac{3}{10} + 9 \cdot \frac{1}{30} "
        r"= 2$, damit "
        r"$\operatorname{Var}(X) = E(X^2) - \big(E(X)\big)^2 = 2 - 1{,}44 = 0{,}56$ "
        r"und $\sigma = \sqrt{0{,}56} \approx 0{,}75$. Deutung: Wiederholt man das "
        r"Ziehen sehr oft, so sind unter drei Kugeln **im Mittel $1{,}2$ rote** — das "
        r"passt zum Anteil von $40\ \%$ roten Kugeln im Behälter. Ein einzelner Versuch "
        r"liefert diesen Wert nie, er liegt zwischen den möglichen Ergebnissen $1$ und $2$.",

        r"Die zweite Kugel ist rot, wenn die erste rot war (Pfad $\text{rot--rot}$) oder "
        r"wenn die erste blau war (Pfad $\text{blau--rot}$): "
        r"$P = \frac{4}{10} \cdot \frac{3}{9} + \frac{6}{10} \cdot \frac{4}{9} "
        r"= \frac{12}{90} + \frac{24}{90} = \frac{2}{5} = 0{,}4$. Das ist genau die "
        r"Wahrscheinlichkeit für „rot“ beim **ersten** Zug. Solange man über den ersten "
        r"Zug nichts weiß, ändert die Reihenfolge nichts — anders sieht es erst aus, wenn "
        r"das Ergebnis des ersten Zuges bekannt ist.",

        r"Kommen $x$ rote Kugeln dazu, so liegen $4 + x$ rote unter $10 + x$ Kugeln. "
        r"Gefordert ist "
        r"$\frac{4+x}{10+x} \cdot \frac{3+x}{9+x} = \frac{1}{2}$, also "
        r"$2 \cdot (4+x)(3+x) = (10+x)(9+x)$ und ausmultipliziert "
        r"$2x^2 + 14x + 24 = x^2 + 19x + 90$. Das ergibt die quadratische Gleichung "
        r"$x^2 - 5x - 66 = 0$ mit "
        r"$x_{1,2} = \frac{5 \pm \sqrt{25 + 264}}{2} = \frac{5 \pm 17}{2}$, also "
        r"$x_1 = 11$ und $x_2 = -6$. Negative Kugelzahlen gibt es nicht, es müssen also "
        r"**11 rote Kugeln** hinzugelegt werden. Probe: Im Behälter liegen dann $15$ rote "
        r"und $6$ blaue Kugeln, und "
        r"$\frac{15}{21} \cdot \frac{14}{20} = \frac{210}{420} = 0{,}5$.",
    ],
    falle=r"Ohne Zurücklegen ist $X$ **nicht** binomialverteilt. Der Erwartungswert "
          r"stimmt hier zwar zufällig mit $n \cdot p = 3 \cdot 0{,}4 = 1{,}2$ überein, "
          r"die Streuung aber nicht: Mit Zurücklegen wäre "
          r"$\operatorname{Var}(X) = 3 \cdot 0{,}4 \cdot 0{,}6 = 0{,}72$, hier sind es "
          r"nur $0{,}56$. Wer eine Kugel herausnimmt, verkleinert den Vorrat — die "
          r"Ergebnisse liegen dichter beisammen.",
    figs=[(fig_baum(False),
           "Das Baumdiagramm der drei Züge. An jedem Ast steht, wie viele Kugeln der "
           "betreffenden Farbe noch im Behälter liegen und wie viele insgesamt.")],
    solfigs=[(fig_baum(True),
              "Derselbe Baum mit den acht Pfadwahrscheinlichkeiten. Ihre Summe ist 1 — "
              "eine gute Probe für die Rechnung in a)."),
             (fig_verteilung(),
              "Zu b): Die Verteilung von X. Der Erwartungswert 1,2 liegt nicht beim "
              "höchsten Stab, sondern im Schwerpunkt aller vier Stäbe.")],
)

s.task(
    "Das Glücksrad beim Vereinsfest", 2,
    r"Beim Sommerfest eines Sportvereins steht ein Glücksrad. Der rote Sektor hat den "
    r"Mittelpunktswinkel $45^\circ$, der gelbe Sektor $135^\circ$, der übrige Teil des "
    r"Rades ist blau. Wer mitspielt, zahlt einen **Einsatz "
    r"von $2{,}00$ €** und dreht das Rad einmal. Bleibt es im roten Sektor stehen, werden "
    r"$8{,}00$ € ausgezahlt, im gelben Sektor $2{,}00$ €, im blauen Sektor nichts. Die "
    r"Zufallsgröße $G$ beschreibt den **Gewinn eines Spielers** in Euro, also die "
    r"Auszahlung vermindert um den Einsatz.",
    [
        r"Geben Sie die Wahrscheinlichkeiten der drei Sektoren an und stellen Sie die "
        r"Wahrscheinlichkeitsverteilung von $G$ auf.",
        r"Berechnen Sie $E(G)$ und begründen Sie damit, dass das Spiel nicht fair ist.",
        r"Bestimmen Sie den Einsatz, bei dem das Spiel fair wäre. Ermitteln Sie außerdem, "
        r"wie hoch die Auszahlung im roten Sektor sein müsste, damit das Spiel bei einem "
        r"Einsatz von $2{,}00$ € fair ist.",
        r"An einem Festtag wird das Rad $400$-mal gedreht. Berechnen Sie den zu "
        r"erwartenden Gewinn des Veranstalters und ermitteln Sie, wie oft gedreht werden "
        r"müsste, damit er im Mittel mindestens $250$ € einnimmt.",
    ],
    [
        r"Der blaue Sektor füllt den Rest des Vollkreises, misst also "
        r"$360^\circ - 45^\circ - 135^\circ = 180^\circ$. Jede Wahrscheinlichkeit ist der "
        r"Anteil des Sektors am Vollkreis: "
        r"$P(\text{rot}) = \frac{45^\circ}{360^\circ} = \frac{1}{8}$, "
        r"$P(\text{gelb}) = \frac{135^\circ}{360^\circ} = \frac{3}{8}$ und "
        r"$P(\text{blau}) = \frac{180^\circ}{360^\circ} = \frac{1}{2}$; zusammen $1$. "
        r"Vom Einsatz $2{,}00$ € bleibt: bei Rot $8 - 2 = 6$, bei Gelb $2 - 2 = 0$, bei "
        r"Blau $0 - 2 = -2$. Also nimmt $G$ die Werte $6$, $0$ und $-2$ an, mit den "
        r"Wahrscheinlichkeiten $\frac{1}{8}$, $\frac{3}{8}$ und $\frac{1}{2}$.",

        r"$E(G) = 6 \cdot \frac{1}{8} + 0 \cdot \frac{3}{8} + (-2) \cdot \frac{1}{2} "
        r"= 0{,}75 - 1 = -0{,}25$. Fair heißt $E(G) = 0$ — der Einsatz entspricht dann "
        r"genau der erwarteten Auszahlung. Hier ist $E(G) = -0{,}25 \neq 0$: Jeder "
        r"Spieler verliert auf lange Sicht **im Mittel $25$ Cent je Spiel**. Das Spiel "
        r"ist also **nicht fair**, sondern zugunsten des Veranstalters angelegt.",

        r"Die erwartete Auszahlung hängt nicht vom Einsatz ab: "
        r"$8 \cdot \frac{1}{8} + 2 \cdot \frac{3}{8} + 0 \cdot \frac{1}{2} = 1 + 0{,}75 "
        r"= 1{,}75$. Ein faires Spiel verlangt genau diesen Einsatz, also **$1{,}75$ €**. "
        r"Soll dagegen der Einsatz bei $2{,}00$ € bleiben, muss die Auszahlung $a$ im "
        r"roten Sektor die Gleichung "
        r"$\frac{1}{8} \cdot a + \frac{3}{8} \cdot 2 = 2$ erfüllen. Daraus folgt "
        r"$\frac{1}{8} \cdot a = 1{,}25$ und $a = 10$, der Hauptgewinn müsste also auf "
        r"**$10{,}00$ €** steigen.",

        r"Was der Spieler im Mittel verliert, gewinnt der Veranstalter: $0{,}25$ € je "
        r"Drehung. Bei $400$ Drehungen sind das "
        r"$400 \cdot 0{,}25 = 100$, also **$100$ €**. Für mindestens $250$ € muss "
        r"$n \cdot 0{,}25 \geq 250$ gelten, also $n \geq 1000$: Das Rad müsste "
        r"**mindestens $1000$-mal** gedreht werden. Das ist ein Erwartungswert und keine "
        r"Garantie — an einem einzelnen Tag kann die Einnahme deutlich darüber oder "
        r"darunter liegen.",
    ],
    falle=r"**Auszahlung** und **Gewinn** sind zwei verschiedene Zufallsgrößen. Wer den "
          r"Einsatz vergisst, rechnet mit $E = 1{,}75$ und hält das Spiel für "
          r"vorteilhaft. Und „fair“ heißt nicht „jeder gewinnt gleich oft“, sondern "
          r"genau: der Erwartungswert des Gewinns ist $0$.",
    figs=[(fig_rad(),
           "Das Glücksrad. Die Flächenanteile der Sektoren sind die "
           "Wahrscheinlichkeiten, in den Sektoren steht die jeweilige Auszahlung.")],
    solfigs=[(fig_tabelle(),
              "Zu a): Die Wahrscheinlichkeitsverteilung des Gewinns G in Tabellenform.")],
)

s.task(
    "Drei Terme und ein Versprechen", 3,
    r"Am Glücksrad aus Aufgabe 2 wird mehrfach hintereinander gespielt; die einzelnen "
    r"Spiele beeinflussen sich nicht. Es bleibt bei "
    r"$P(\text{rot}) = \frac{1}{8}$, $P(\text{gelb}) = \frac{3}{8}$ und "
    r"$P(\text{blau}) = \frac{1}{2}$, bei einem Einsatz von $2{,}00$ € und bei "
    r"$E(G) = -0{,}25$ € je Spiel.",
    [
        r"Formulieren Sie zu jedem der folgenden Terme ein passendes Ereignis im "
        r"Sachzusammenhang und geben Sie seinen Wert an: "
        r"**(1)** $1 - \left(\frac{1}{2}\right)^{4}$ • "
        r"**(2)** $2 \cdot \frac{1}{8} \cdot \frac{3}{8}$ • "
        r"**(3)** $\left(\frac{1}{2}\right)^{3} \cdot \frac{1}{8}$",
        r"Ein Besucher behauptet: „Wer nur oft genug spielt, gewinnt am Ende ganz "
        r"sicher.“ Beurteilen Sie diese Aussage mithilfe des Gesetzes der großen Zahlen.",
        r"Der Veranstalter schlägt vor, die Auszahlung im roten Sektor von $8{,}00$ € auf "
        r"$12{,}00$ € zu erhöhen und dafür den roten Sektor von $45^\circ$ auf "
        r"$30^\circ$ zu verkleinern; der gelbe Sektor bleibt unverändert, der blaue wird "
        r"entsprechend größer. Beurteilen Sie, ob das Spiel dadurch für die Spieler "
        r"günstiger wird.",
    ],
    [
        r"**(1)** Das Gegenereignis zu „viermal hintereinander blau“: In **vier Spielen "
        r"gibt es mindestens einmal eine Auszahlung**, das Rad bleibt also mindestens "
        r"einmal nicht im blauen Sektor stehen. Wert: "
        r"$1 - \frac{1}{16} = \frac{15}{16} = 0{,}9375$. "
        r"**(2)** In **zwei Spielen fällt genau einmal rot und einmal gelb**; der Faktor "
        r"$2$ steht für die beiden möglichen Reihenfolgen rot–gelb und gelb–rot. Wert: "
        r"$\frac{3}{32} \approx 0{,}094$. "
        r"**(3)** In den **ersten drei Spielen fällt jedes Mal blau, im vierten Spiel "
        r"rot**: Der erste Hauptgewinn kommt genau im vierten Spiel. Wert: "
        r"$\frac{1}{64} \approx 0{,}016$.",

        r"Die Aussage ist **falsch**, weil sie zwei Dinge verwechselt. Richtig ist: Die "
        r"Wahrscheinlichkeit, irgendwann **mindestens einmal** den Hauptgewinn zu "
        r"treffen, ist $1 - \left(\frac{7}{8}\right)^{n}$ und nähert sich für große $n$ "
        r"dem Wert $1$. Über die **Bilanz** sagt das nichts. Nach dem Gesetz der großen "
        r"Zahlen nähert sich der durchschnittliche Gewinn je Spiel mit wachsender "
        r"Spielzahl dem Erwartungswert $E(G) = -0{,}25$ € an; der Gesamtgewinn nach $n$ "
        r"Spielen liegt also bei etwa $n \cdot (-0{,}25)$ € und wandert immer weiter ins "
        r"Minus. Wer $1000$-mal spielt, verliert im Mittel $250$ €. Je länger gespielt "
        r"wird, desto **sicherer** ist der Verlust — nicht der Gewinn.",

        r"Zu vergleichen sind die Erwartungswerte. Neu ist "
        r"$P(\text{rot}) = \frac{30^\circ}{360^\circ} = \frac{1}{12}$, der gelbe Sektor "
        r"behält $\frac{3}{8}$, der blaue wächst auf "
        r"$\frac{195^\circ}{360^\circ} = \frac{13}{24}$; zusammen ergibt das wieder $1$. "
        r"Die erwartete Auszahlung beträgt "
        r"$\frac{1}{12} \cdot 12 + \frac{3}{8} \cdot 2 = 1 + 0{,}75 = 1{,}75$, also "
        r"genau so viel wie vorher, und damit ist auch $E(G) = 1{,}75 - 2 = -0{,}25$ € "
        r"**unverändert**. Das Spiel wird für die Spieler **nicht günstiger**: Der "
        r"größere Hauptgewinn wird durch den kleineren Sektor genau aufgewogen. Es "
        r"ändert sich nur die Streuung — Hauptgewinne werden seltener, fallen dafür "
        r"höher aus.",
    ],
    falle=r"Ein größerer Hauptgewinn allein sagt nichts aus; entscheidend ist das Produkt "
          r"aus Wahrscheinlichkeit und Auszahlung. Und das Gesetz der großen Zahlen "
          r"macht eine Aussage über den **Durchschnitt vieler Spiele**, nicht über das "
          r"einzelne Spiel: Es gibt keine „ausgleichende Kraft“, die nach vielen "
          r"Nieten einen Treffer nachliefert — jede Drehung startet bei denselben "
          r"Wahrscheinlichkeiten.",
    figs=[(fig_konvergenz(),
           "Zu b): Zwei simulierte Spielserien. Der durchschnittliche Gewinn je Spiel "
           "schwankt anfangs stark und legt sich mit wachsender Spielzahl an den "
           "Erwartungswert −0,25 Euro. Die Darstellung ist schematisch.")],
    solfigs=[(fig_raeder(),
              "Zu c): Beide Räder nebeneinander. Der rote Sektor schrumpft von einem "
              "Achtel auf ein Zwölftel des Kreises, die Auszahlung steigt von 8 auf 12 "
              "Euro — das Produkt aus beidem bleibt gleich.")],
)


def check():
    # --- Aufgabe 1: the distribution, exactly, and both ways to the variance
    assert sum(PROBS.values()) == 1, PROBS
    assert PROBS[0] == Fraction(1, 6) and PROBS[1] == Fraction(1, 2)
    assert PROBS[2] == Fraction(3, 10) and PROBS[3] == Fraction(1, 30)
    # the three paths with exactly one red ball all carry the same probability
    assert {pfad_p(p) for p in PFADE if p.count("R") == 1} == {Fraction(1, 6)}
    assert {pfad_p(p) for p in PFADE if p.count("R") == 2} == {Fraction(1, 10)}
    assert pfad_p("BBB") == Fraction(1, 6) and pfad_p("RRR") == Fraction(1, 30)
    assert len(PFADE) == 8 and sum(pfad_p(p) for p in PFADE) == 1
    assert EX == Fraction(6, 5) and float(EX) == 1.2
    assert EX2 == 2 and VAR == Fraction(14, 25) and float(VAR) == 0.56
    # variance over the definition as well - same number, other route
    assert sum((k - EX) ** 2 * PROBS[k] for k in PROBS) == VAR
    assert abs(SD - 0.75) < 0.005
    # the expected value happens to equal n*p, the variance does not
    n_p = ZUEGE * Fraction(ROT, ROT + BLAU)
    assert EX == n_p == Fraction(6, 5)
    binom_var = ZUEGE * Fraction(ROT, ROT + BLAU) * Fraction(BLAU, ROT + BLAU)
    assert binom_var == Fraction(18, 25) and float(binom_var) == 0.72
    assert VAR == binom_var * Fraction(ROT + BLAU - ZUEGE, ROT + BLAU - 1)
    # b) the second ball is red with the same probability as the first one
    assert P_ZWEITE_ROT == Fraction(2, 5) == Fraction(ROT, ROT + BLAU)
    # d) the quadratic equation and its two roots
    assert DAZU ** 2 - 5 * DAZU - 66 == 0 and (-6) ** 2 - 5 * (-6) - 66 == 0
    assert 25 + 264 == 289 and sqrt(289) == 17.0
    r2, n2 = ROT + DAZU, ROT + BLAU + DAZU
    assert (r2, n2) == (15, 21)
    assert Fraction(r2, n2) * Fraction(r2 - 1, n2 - 1) == ZIEL == Fraction(1, 2)
    # no smaller number of extra balls reaches one half
    assert all(Fraction(ROT + x, ROT + BLAU + x) * Fraction(ROT + x - 1, BLAU + ROT + x - 1)
               < ZIEL for x in range(DAZU))

    # --- Aufgabe 2: the wheel. The figure's angles ARE the probabilities.
    assert sum(ang for _, ang, _, _ in SEKTOREN) == 360
    assert sum(ang for _, ang, _, _ in SEKTOREN_NEU) == 360
    assert P_SEKT == {"rot": Fraction(1, 8), "gelb": Fraction(3, 8),
                      "blau": Fraction(1, 2)}
    assert sum(P_SEKT.values()) == 1
    for sekt in (SEKTOREN, SEKTOREN_NEU):
        assert sum((Fraction(ang, 360) for _, ang, _, _ in sekt), Fraction(0)) == 1
        # the angles measured in the finished drawing must be the probabilities
        gemessen = winkel_aus_svg(rad(sekt).svg())
        # tolerance 0,01 degrees: the SVG keeps two decimals per coordinate
        assert len(gemessen) == len(sekt), gemessen
        assert abs(sum(gemessen) - 360) < 0.01, gemessen
        for (_, ang, _, _), g in zip(sekt, gemessen):
            assert abs(g - ang) < 0.01, (ang, g)
            assert abs(g / 360.0 - float(Fraction(ang, 360))) < 0.0001
    assert Fraction(SEKTOREN_NEU[0][1], 360) == Fraction(1, 12)
    assert Fraction(SEKTOREN_NEU[2][1], 360) == Fraction(13, 24)
    assert E_AUS == Fraction(7, 4) and float(E_AUS) == 1.75
    assert E_G == Fraction(-1, 4) and float(E_G) == -0.25
    # expected gain straight from the distribution of G, as the solution writes it
    assert (6 * Fraction(1, 8) + 0 * Fraction(3, 8) + (-2) * Fraction(1, 2)) == E_G
    assert FAIR_EINSATZ == Fraction(7, 4)
    assert FAIR_HAUPT == 10
    assert Fraction(1, 8) * FAIR_HAUPT + Fraction(3, 8) * 2 == EINSATZ
    assert TAGESGEWINN == 100 and SPIELE_ZIEL == 1000
    assert SPIELE_TAG * (-E_G) == 100 and 1000 * (-E_G) == ZIEL_TAG

    # --- Aufgabe 3: the three terms and the redesigned wheel
    assert T1 == Fraction(15, 16) and float(T1) == 0.9375
    assert T2 == Fraction(3, 32) and abs(float(T2) - 0.094) < 0.0005
    assert T3 == Fraction(1, 64) and abs(float(T3) - 0.016) < 0.0005
    assert T1 == 1 - (1 - P_SEKT["blau"]) ** 0 * P_SEKT["blau"] ** 4
    assert T2 == 2 * P_SEKT["rot"] * P_SEKT["gelb"]
    assert T3 == P_SEKT["blau"] ** 3 * P_SEKT["rot"]
    # the new wheel looks better and is exactly as bad
    assert E_AUS_NEU == E_AUS and E_G_NEU == E_G
    assert Fraction(1, 12) * 12 == Fraction(1, 8) * 8 == 1
    assert 1000 * float(-E_G) == 250

    # --- the convergence figure: deterministic and really settling at E(G)
    assert len(SERIE_A) == len(SERIE_B) == 400
    for reihe in (SERIE_A, SERIE_B):
        assert abs(reihe[-1] - float(E_G)) < 0.1, reihe[-1]
        assert all(abs(v - float(E_G)) < 0.1 for v in reihe[200:])
        assert all(-2.0 <= v <= 6.0 for v in reihe)
    # the figure really shows the two sides: one run above, one below at the start
    assert max(SERIE_A[START - 1:]) > 0.5 > max(SERIE_B[START - 1:])


s.verify(check)
s.save()
