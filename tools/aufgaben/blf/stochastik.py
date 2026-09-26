#!/usr/bin/env python3
"""BLF-Training Gymnasium Klasse 10 - Daten und Zufall (Teil B, mit MMS).

    python3 tools/aufgaben/blf/stochastik.py

Stochastics in the BLF is short but every year: a pie chart and a term to interpret
(2022/23), drawing without replacement (UNO cards, 2022/23), relative frequencies that
cannot be right (2023/24), a Gluecksrad in Teil A (every year). Klasse 10 adds random
variables, expected value, spread and fair games (Lernbereich 2). Wording, numbers and
every figure are our own.
"""
import os
import sys
from fractions import Fraction as Fr
from itertools import permutations, product
from math import sqrt

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# ------------------------------------------------------ Aufgabe 1: Umfrage -----
WEG = [("Fahrrad", 14, 12, S.GREEN), ("Bus", 7, 25, S.ORANGE),
       ("zu Fuß", 5, 10, S.BODY), ("Auto", 2, 15, S.RED)]   # name, count, minutes, colour
N_KLASSE = sum(n for _, n, _, _ in WEG)
LENA = [Fr(50, 100), Fr(35, 100), Fr(18, 100), Fr(7, 100)]

# ---------------------------------------------------- Aufgabe 2: der Beutel ----
ROT, BLAU = 5, 3

# ------------------------------------------------------ Aufgabe 3: Wuerfel -----
EINSATZ, PASCH_PAY, SIEBEN_PAY = 1, 4, 2
PAIRS = list(product(range(1, 7), repeat=2))


# ----------------------------------------------------------------- figures ---
def fig_kreis():
    c = S.Canvas(470, 280)
    cx, cy, r = 130, 140, 108
    a = 0.0
    for name, n, _, col in WEG:
        ang = 360.0 * n / N_KLASSE
        c.sector(cx, cy, r, a, a + ang, fill=col, label=None, opacity=0.8)
        a += ang
    c.circle(cx, cy, r, "none", S.INK, 1.4)
    c.legend(268, 100, [("%s: %d von %d · %s°" % (name, n, N_KLASSE,
                                                  S.num(360.0 * n / N_KLASSE, 1)),
                         col, "fill") for name, n, _, col in WEG])
    return c.svg("Kreisdiagramm der Schulwege: Fahrrad 180 Grad, Bus 90 Grad, zu Fuss "
                 "etwa 64 Grad, Auto etwa 26 Grad")


def fig_baum():
    d = S.Diagram(520, 250)
    root = (40, 125)
    r1, b1 = (190, 65), (190, 185)
    leaves = [((360, 30), r1, "4/7", "rot, rot"), ((360, 100), r1, "3/7", "rot, blau"),
              ((360, 150), b1, "5/7", "blau, rot"), ((360, 220), b1, "2/7", "blau, blau")]
    d.node(*root, color=S.MUTED)
    d.branch(root, r1, "5/8", tex=True)
    d.branch(root, b1, "3/8", tex=True)
    d.node(r1[0], r1[1], "r", "above", color=S.RED)
    d.node(b1[0], b1[1], "b", "below", color=S.BODY)
    for leaf, parent, p, name in leaves:
        d.branch(parent, leaf, p, tex=True)
        d.node(leaf[0], leaf[1], None, color=S.RED if name.endswith("rot") else S.BODY)
        d.text(leaf[0] + 12, leaf[1] + 4, name, 12.5, S.INK, "start")
    return d.svg("Baumdiagramm fuer zweimaliges Ziehen ohne Zuruecklegen aus fuenf roten "
                 "und drei blauen Kugeln")


def fig_wuerfel():
    d = S.Diagram(330, 330)
    x0, y0, cw = 20, 20, 42
    cells = [["+"] + [str(j) for j in range(1, 7)]]
    for i in range(1, 7):
        cells.append([str(i)] + [str(i + j) for j in range(1, 7)])
    for i in range(1, 7):                       # colour first, grid and numbers on top
        for j in range(1, 7):
            col = S.ORANGE if i == j else (S.GREEN if i + j == 7 else None)
            if col:
                d.rect(x0 + j * cw, y0 + i * cw, cw, cw, fill=col, opacity=0.45)
    for r in range(7):
        for cc in range(7):
            head = r == 0 or cc == 0
            d.rect(x0 + cc * cw, y0 + r * cw, cw, cw,
                   fill="#EEF2F8" if head else "none", stroke=S.INK, width=1.0)
            d.text(x0 + cc * cw + cw / 2.0, y0 + r * cw + cw / 2.0, cells[r][cc], 13,
                   S.INK if head else S.BODY, baseline="middle", italic=head and cc + r == 0)
    return d.svg("Tabelle aller 36 Ergebnisse zweier Wuerfel mit den Augensummen; die "
                 "sechs Paschs sind orange, die sechs Summen 7 gruen markiert")


# ------------------------------------------------------------------- sheet ---
s = Sheet("blf-gy-stochastik", "Daten und Zufall",
          kind="BLF-Training",
          suffix="",
          klasse="Gymnasium · Klasse 10",
          sub="Gymnasium · Klasse 10 · Besondere Leistungsfeststellung Mathematik · Teil B, "
              "mit MMS und Formelsammlung · drei Aufgaben, Anforderungsbereiche I bis III",
          desc="BLF-Training Mathematik Gymnasium Klasse 10: Kreisdiagramm und relative "
               "Häufigkeiten, Ziehen ohne Zurücklegen mit Zufallsgröße und Erwartungswert, "
               "ein Würfelspiel auf Fairness geprüft, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/blf.html", "Zur Übersicht"))

s.task(
    "Wie kommst du zur Schule?", 1,
    r"In einer Klasse mit $28$ Schülerinnen und Schülern wurde gefragt, wie sie "
    r"normalerweise zur Schule kommen: $14$ mit dem Fahrrad, $7$ mit dem Bus, $5$ zu Fuß "
    r"und $2$ mit dem Auto.",
    [
        r"Geben Sie die relativen Häufigkeiten der vier Antworten an.",
        r"Die Ergebnisse sollen in einem Kreisdiagramm dargestellt werden. Berechnen Sie "
        r"die Größen der vier Mittelpunktswinkel.",
        r"Lena hat die relativen Häufigkeiten gerundet als $0{,}50$; $0{,}35$; $0{,}18$ und "
        r"$0{,}07$ angegeben. Begründen Sie, dass mindestens einer ihrer Werte falsch ist.",
        r"Mit dem Fahrrad brauchen die Befragten im Mittel $12$ Minuten, mit dem Bus $25$, "
        r"zu Fuß $10$ und mit dem Auto $15$ Minuten. Geben Sie die Bedeutung des Terms "
        r"$\frac{1}{28} \cdot (14 \cdot 12 + 7 \cdot 25 + 5 \cdot 10 + 2 \cdot 15)$ im "
        r"Sachzusammenhang an und berechnen Sie seinen Wert.",
    ],
    [
        r"Fahrrad $\frac{14}{28} = \frac{1}{2} = 50\ \%$, Bus $\frac{7}{28} = \frac{1}{4} = "
        r"25\ \%$, zu Fuß $\frac{5}{28} \approx 17{,}9\ \%$, Auto $\frac{2}{28} = "
        r"\frac{1}{14} \approx 7{,}1\ \%$.",

        r"Jeder Anteil mal $360°$: Fahrrad $180°$, Bus $90°$, zu Fuß "
        r"$\frac{5}{28} \cdot 360° \approx 64{,}3°$, Auto $\frac{2}{28} \cdot 360° \approx "
        r"25{,}7°$. Probe: zusammen $360°$.",

        r"Die relativen Häufigkeiten aller möglichen Antworten müssen zusammen $1$ ergeben. "
        r"Lenas Werte ergeben $0{,}50 + 0{,}35 + 0{,}18 + 0{,}07 = 1{,}10$. Das Runden "
        r"erklärt das nicht: Vier auf zwei Stellen gerundete Werte weichen zusammen um "
        r"weniger als $4 \cdot 0{,}005 = 0{,}02$ von $1$ ab. Der Fehler steckt beim Bus: "
        r"$\frac{7}{28} = 0{,}25$ und nicht $0{,}35$.",

        r"Der Term ist das **arithmetische Mittel** der Schulwegzeiten der ganzen Klasse: "
        r"Jede Gruppenzeit wird mit der Anzahl der Personen gewichtet und durch alle $28$ "
        r"geteilt. $\frac{168 + 175 + 50 + 30}{28} = \frac{423}{28} \approx 15{,}1$ Minuten.",
    ],
    falle=r"Bei d) ist $\frac{12 + 25 + 10 + 15}{4} = 15{,}5$ **nicht** dasselbe: Dieses "
          r"ungewichtete Mittel tut so, als säßen im Auto genauso viele wie auf dem "
          r"Fahrrad.",
    solfigs=[(fig_kreis(), "Zu b): Das Kreisdiagramm.")],
)

s.task(
    "Ziehen ohne Zurücklegen", 2,
    r"In einem Beutel liegen fünf rote und drei blaue Kugeln. Es werden nacheinander zwei "
    r"Kugeln gezogen, **ohne** die erste zurückzulegen.",
    [
        r"Berechnen Sie die Wahrscheinlichkeit dafür, dass beide Kugeln rot sind.",
        r"Berechnen Sie die Wahrscheinlichkeit dafür, dass die beiden Kugeln verschiedene "
        r"Farben haben.",
        r"Die Zufallsgröße $X$ gibt die Anzahl der gezogenen roten Kugeln an. Geben Sie "
        r"die Wahrscheinlichkeitsverteilung von $X$ an und berechnen Sie den "
        r"Erwartungswert.",
        r"Begründen Sie ohne Rechnung, dass „zweimal rot“ **mit** Zurücklegen "
        r"wahrscheinlicher ist als ohne, und bestätigen Sie es rechnerisch.",
    ],
    [
        r"Erster Zug rot mit $\frac{5}{8}$; danach sind noch vier rote unter sieben Kugeln: "
        r"$P = \frac{5}{8} \cdot \frac{4}{7} = \frac{20}{56} = \frac{5}{14} \approx 0{,}357$.",

        r"Zwei Pfade, rot–blau und blau–rot: "
        r"$P = \frac{5}{8} \cdot \frac{3}{7} + \frac{3}{8} \cdot \frac{5}{7} = "
        r"\frac{30}{56} = \frac{15}{28} \approx 0{,}536$.",

        r"$P(X = 0) = \frac{3}{8} \cdot \frac{2}{7} = \frac{3}{28}$, "
        r"$P(X = 1) = \frac{15}{28}$, $P(X = 2) = \frac{10}{28}$. Probe: "
        r"$\frac{3 + 15 + 10}{28} = 1$. Erwartungswert: "
        r"$E(X) = 0 \cdot \frac{3}{28} + 1 \cdot \frac{15}{28} + 2 \cdot \frac{10}{28} = "
        r"\frac{35}{28} = 1{,}25$.",

        r"Ohne Zurücklegen fehlt beim zweiten Zug eine rote Kugel, der Anteil der roten "
        r"sinkt von $\frac{5}{8}$ auf $\frac{4}{7}$. Mit Zurücklegen bleibt er bei "
        r"$\frac{5}{8}$. Rechnung: $\left(\frac{5}{8}\right)^2 = \frac{25}{64} \approx "
        r"0{,}391 > 0{,}357$.",
    ],
    falle=r"Der Erwartungswert ist in beiden Fällen gleich, nämlich $2 \cdot \frac{5}{8} = "
          r"1{,}25$. Das Zurücklegen ändert die **Verteilung**, nicht den Mittelwert.",
    figs=[(fig_baum(), "Das Baumdiagramm: oben rote, unten blaue Kugel.")],
)

s.task(
    "Ist das Würfelspiel fair?", 3,
    r"Auf einem Schulfest wird mit zwei Würfeln gespielt. Der Einsatz beträgt $1$ €. Bei "
    r"einem Pasch (zwei gleiche Augenzahlen) werden $4$ € ausgezahlt, bei der Augensumme "
    r"$7$ werden $2$ € ausgezahlt, sonst nichts. Ein Spiel heißt fair, wenn der "
    r"Erwartungswert des Gewinns null ist.",
    [
        r"Berechnen Sie die Wahrscheinlichkeiten für einen Pasch und für die Augensumme $7$.",
        r"Die Zufallsgröße $G$ gibt den Gewinn eines Spielers an (Auszahlung minus "
        r"Einsatz). Geben Sie die Verteilung von $G$ an und untersuchen Sie, ob das Spiel "
        r"fair ist.",
        r"Berechnen Sie die Standardabweichung von $G$.",
        r"Die Klasse möchte im Mittel $0{,}20$ € pro Spiel einnehmen. Nur die Auszahlung "
        r"für einen Pasch soll geändert werden. Berechnen Sie die neue Auszahlung.",
    ],
    [
        r"Von den $36$ gleich wahrscheinlichen Ergebnissen sind $6$ Paschs und $6$ haben "
        r"die Summe $7$ (siehe Tabelle): je $\frac{6}{36} = \frac{1}{6}$. Beide Ereignisse "
        r"schließen sich aus, denn ein Pasch hat immer eine gerade Summe.",

        r"$G$ nimmt die Werte $3$ € (Pasch), $1$ € (Summe $7$) und $-1$ € (sonst) an, mit "
        r"den Wahrscheinlichkeiten $\frac{1}{6}$, $\frac{1}{6}$ und $\frac{2}{3}$. "
        r"$E(G) = 3 \cdot \frac{1}{6} + 1 \cdot \frac{1}{6} - 1 \cdot \frac{2}{3} = "
        r"\frac{3 + 1 - 4}{6} = 0$. Das Spiel ist fair.",

        r"$V(G) = (3 - 0)^2 \cdot \frac{1}{6} + (1 - 0)^2 \cdot \frac{1}{6} + (-1 - 0)^2 "
        r"\cdot \frac{2}{3} = \frac{9 + 1 + 4}{6} = \frac{7}{3}$, also "
        r"$\sigma = \sqrt{\frac{7}{3}} \approx 1{,}53$ €. Einzelne Spiele weichen also "
        r"deutlich vom Mittelwert null ab, obwohl das Spiel fair ist.",

        r"Die mittlere Auszahlung muss $1 - 0{,}20 = 0{,}80$ € betragen: "
        r"$x \cdot \frac{1}{6} + 2 \cdot \frac{1}{6} = 0{,}80$ ergibt $x + 2 = 4{,}80$, "
        r"also $x = 2{,}80$ €. Probe: $E(G) = \frac{1{,}80 + 1 - 4}{6} = -0{,}20$ € für "
        r"den Spieler.",
    ],
    falle=r"Gewinn und Auszahlung sind nicht dasselbe. Wer bei b) mit den Auszahlungen "
          r"$4$ und $2$ rechnet und den Einsatz vergisst, erhält $E = 1$ und hält das "
          r"Spiel für ein Geschenk an die Spieler.",
    figs=[(fig_wuerfel(), "Alle 36 Ergebnisse zweier Würfel mit ihrer Augensumme. Orange: "
                          "Pasch, grün: Summe 7.")],
)


def check():
    """Every number in the solutions, recomputed - exact with Fractions."""
    # --- Aufgabe 1 -----------------------------------------------------------------
    assert N_KLASSE == 28
    rel = [Fr(n, N_KLASSE) for _, n, _, _ in WEG]
    assert rel[:2] == [Fr(1, 2), Fr(1, 4)] and rel[3] == Fr(1, 14)
    assert round(float(rel[2]) * 100, 1) == 17.9 and round(float(rel[3]) * 100, 1) == 7.1
    angles = [r * 360 for r in rel]
    assert angles[0] == 180 and angles[1] == 90
    assert round(float(angles[2]), 1) == 64.3 and round(float(angles[3]), 1) == 25.7
    assert sum(angles) == 360
    assert sum(LENA) == Fr(110, 100) and abs(sum(LENA) - 1) > 4 * Fr(5, 1000)
    assert [round(float(r), 2) for r in rel] == [0.5, 0.25, 0.18, 0.07]
    assert [float(v) for v in LENA] != [0.5, 0.25, 0.18, 0.07]          # nur der Bus
    assert round(float(rel[2]), 2) == 0.18 and round(float(rel[0]), 2) == 0.5
    assert round(float(rel[1]), 2) == 0.25 and round(float(rel[3]), 2) == 0.07
    total = sum(n * m for _, n, m, _ in WEG)
    assert [n * m for _, n, m, _ in WEG] == [168, 175, 50, 30] and total == 423
    assert round(total / 28, 1) == 15.1
    assert Fr(12 + 25 + 10 + 15, 4) == Fr(31, 2)
    # --- Aufgabe 2 -----------------------------------------------------------------
    kugeln = ["r"] * ROT + ["b"] * BLAU
    zuege = list(permutations(range(8), 2))
    count = lambda pred: Fr(sum(1 for i, j in zuege if pred(kugeln[i], kugeln[j])),
                            len(zuege))
    rr = count(lambda a, b: a == b == "r")
    assert rr == Fr(5, 8) * Fr(4, 7) == Fr(5, 14) and round(float(rr), 3) == 0.357
    diff = count(lambda a, b: a != b)
    assert diff == Fr(15, 28) and round(float(diff), 3) == 0.536
    px = {k: count(lambda a, b, k=k: (a == "r") + (b == "r") == k) for k in (0, 1, 2)}
    assert px == {0: Fr(3, 28), 1: Fr(15, 28), 2: Fr(10, 28)}
    ex = sum(k * p for k, p in px.items())
    assert ex == Fr(5, 4) == 2 * Fr(5, 8)
    assert Fr(5, 8) ** 2 == Fr(25, 64) and round(25 / 64, 3) == 0.391 and Fr(25, 64) > rr
    # --- Aufgabe 3 -----------------------------------------------------------------
    pasch = Fr(sum(1 for a, b in PAIRS if a == b), 36)
    sieben = Fr(sum(1 for a, b in PAIRS if a + b == 7), 36)
    assert pasch == sieben == Fr(1, 6)
    assert not any(a == b and a + b == 7 for a, b in PAIRS)
    gain = {}
    for a, b in PAIRS:
        g = (PASCH_PAY if a == b else SIEBEN_PAY if a + b == 7 else 0) - EINSATZ
        gain[g] = gain.get(g, 0) + Fr(1, 36)
    assert gain == {3: Fr(1, 6), 1: Fr(1, 6), -1: Fr(2, 3)}
    eg = sum(g * p for g, p in gain.items())
    assert eg == 0
    var = sum((g - eg) ** 2 * p for g, p in gain.items())
    assert var == Fr(7, 3) and round(sqrt(7 / 3), 2) == 1.53
    x = (Fr(80, 100) - SIEBEN_PAY * sieben) / pasch
    assert x == Fr(28, 10)
    assert x * pasch + SIEBEN_PAY * sieben - EINSATZ == Fr(-20, 100)
    assert (x - 1) * Fr(1, 6) + 1 * Fr(1, 6) - Fr(2, 3) == Fr(-1, 5)
    assert PASCH_PAY * pasch + SIEBEN_PAY * sieben == 1          # die Falle: E = 1


s.verify(check)
s.save()
