#!/usr/bin/env python3
"""Abitur-Training BGY - Stochastik (Pflichtaufgabe 3).

    python3 tools/aufgaben/abi/stochastik.py

The staircase the originals climb every year: Vierfeldertafel, bedingte Wahrscheinlichkeit
und Unabhängigkeit, Binomialverteilung, Hypothesentest. Wording, numbers and figures are
our own.
"""
import os
import sys
from math import comb, log, sqrt

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402

# Aufgabe 1: Schulfest
P_S, P_G, P_SG = 0.60, 0.45, 0.30
# Aufgabe 2: Losbude
N, P = 12, 0.25
# Aufgabe 3: Signifikanztest
NT, P0, ALPHA, BEOB = 200, 0.25, 0.05, 38


def binom(n, p, k):
    return comb(n, k) * p ** k * (1 - p) ** (n - k)


def cdf(n, p, k):
    return sum(binom(n, p, i) for i in range(k + 1))


def ablehnung(n, p, alpha):
    """Largest k with P(X <= k) <= alpha - the left-sided rejection region {0,...,k}."""
    k, total = -1, 0.0
    while True:
        nxt = total + binom(n, p, k + 1)
        if nxt > alpha:
            return k, total
        k, total = k + 1, nxt


K_MAX, ALPHA_REAL = ablehnung(NT, P0, ALPHA)


# ----------------------------------------------------------------- figures ---
def fig_vierfelder():
    d = S.Diagram(470, 200)
    cells = [["", "G", "Ḡ", "Σ"],
             ["S", "0,30", "", ""],
             ["S̄", "", "", ""],
             ["Σ", "0,45", "", "1"]]
    d.table(24, 20, 4, 4, 105, 40, cells)
    d.text(235, 190, "G: isst am Grillstand   ·   S: Schülerin oder Schüler",
           11.5, S.MUTED)
    return d.svg("Unvollstaendige Vierfeldertafel mit den Ereignissen S und G")


def fig_vierfelder_voll():
    d = S.Diagram(470, 200)
    cells = [["", "G", "Ḡ", "Σ"],
             ["S", "0,30", "0,30", "0,60"],
             ["S̄", "0,15", "0,25", "0,40"],
             ["Σ", "0,45", "0,55", "1"]]
    d.table(24, 20, 4, 4, 105, 40, cells)
    return d.svg("Vollstaendig ausgefuellte Vierfeldertafel")


def fig_baum():
    d = S.Diagram(500, 250)
    root = (60, 130)
    lvl1 = {"S": (230, 66), "Sq": (230, 194)}
    lvl2 = {"SG": (400, 26), "SGq": (400, 106), "SqG": (400, 154), "SqGq": (400, 234)}
    d.node(*root, None)
    d.branch(root, lvl1["S"], "0,60")
    d.branch(root, lvl1["Sq"], "0,40")
    d.node(lvl1["S"][0], lvl1["S"][1], "S", "above")
    d.node(lvl1["Sq"][0], lvl1["Sq"][1], "S̄", "below")
    d.branch(lvl1["S"], lvl2["SG"], "0,50")
    d.branch(lvl1["S"], lvl2["SGq"], "0,50")
    d.branch(lvl1["Sq"], lvl2["SqG"], "0,375")
    d.branch(lvl1["Sq"], lvl2["SqGq"], "0,625")
    for key, lab, val in (("SG", "G", "0,30"), ("SGq", "Ḡ", "0,30"),
                          ("SqG", "G", "0,15"), ("SqGq", "Ḡ", "0,25")):
        x, y = lvl2[key]
        d.node(x, y, lab, "right")
        d.text(x + 46, y + 5, "→  " + val, 12, S.MUTED, "start")
    return d.svg("Baumdiagramm mit den vier Pfaden und ihren Wahrscheinlichkeiten")


def fig_binomial():
    probs = [binom(N, P, k) for k in range(N + 1)]
    p = S.Plot((-0.9, 12.6), (0, 0.32), w=520, h=310, pad=(52, 20, 22, 40))
    p.axes(1, 0.05, xlabel="k", ylabel="P(X = k)", ydec=2)
    p.bars(probs, 0, S.ORANGE, highlight=(2, 3, 4), hi_fill=S.GREEN)
    # the one-sigma window around the expected value - the two labels sit on different
    # heights, otherwise they collide above the tallest bar
    mu, sd = N * P, sqrt(N * P * (1 - P))
    p.line(p.X(mu), p.Y(0), p.X(mu), p.Y(0.30), S.RED, 1.3, dash="4 3")
    p.brace(mu - sd, mu + sd, 0.285, "eine Standardabweichung", S.MUTED)
    p.text(p.X(6.4), p.Y(0.245), "Erwartungswert 3", 11.5, S.RED, "start", halo=S.PAPER)
    p.arrow(p.X(6.3), p.Y(0.242), p.X(mu) + 4, p.Y(0.215), S.RED, 1.1)
    return p.svg("Balkendiagramm der Binomialverteilung fuer n gleich 12 und p gleich 0,25")


def fig_test():
    probs = [binom(NT, P0, k) for k in range(30, 72)]
    p = S.Plot((29.2, 71.8), (0, 0.075), w=540, h=300, pad=(56, 20, 22, 40))
    p.axes(5, 0.02, xlabel="k", ylabel="P(X = k)", ydec=2, skip_x=(30,))
    p.bars(probs, 30, S.ORANGE, width=0.78,
           highlight=tuple(range(30, K_MAX + 1)), hi_fill=S.RED)
    p.line(p.X(50), p.Y(0), p.X(50), p.Y(0.069), S.MUTED, 1.2, dash="4 3")
    p.text(p.X(50) + 6, p.Y(0.069) + 4, "Erwartungswert 50", 11.5, S.MUTED, "start",
           halo=S.PAPER)
    p.line(p.X(K_MAX + 0.5), p.Y(0), p.X(K_MAX + 0.5), p.Y(0.055), S.RED, 1.4)
    p.text(p.X(K_MAX + 0.5) - 6, p.Y(0.057), "Ablehnungsbereich", 12, S.RED, "end",
           halo=S.PAPER)
    p.point(BEOB, 0.0125, "beobachtet: 38", "above", color=S.GREEN, size=4.2)
    return p.svg("Balkendiagramm der Binomialverteilung fuer n gleich 200 mit markiertem "
                 "Ablehnungsbereich")


# ------------------------------------------------------------------- sheet ---
s = Sheet("abitur-bgy-stochastik", "Stochastik",
          kind="Abitur-Training",
          suffix="",
          klasse="Berufliches Gymnasium",
          sub="Berufliches Gymnasium · Pflichtaufgabe 3 · Grund- und Leistungskurs · "
              "drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Abitur-Training Mathematik BGY, Stochastik: Vierfeldertafel, "
               "Binomialverteilung und Signifikanztest, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/abitur.html", "Zur Übersicht"))

s.task(
    "Grillstand auf dem Schulfest", 1,
    r"Auf dem Schulfest eines Beruflichen Gymnasiums sind $60\ \%$ der Besucher "
    r"Schülerinnen und Schüler (Ereignis $S$). $45\ \%$ aller Besucher essen am Grillstand "
    r"(Ereignis $G$). $30\ \%$ aller Besucher sind Schülerinnen oder Schüler **und** essen "
    r"am Grillstand. Ein Besucher wird zufällig ausgewählt.",
    [
        r"Übernehmen Sie die Vierfeldertafel und vervollständigen Sie sie.",
        r"Bestimmen Sie die Wahrscheinlichkeit dafür, dass eine zufällig ausgewählte "
        r"Schülerin oder ein zufällig ausgewählter Schüler am Grillstand isst.",
        r"Untersuchen Sie, ob die Ereignisse $S$ und $G$ stochastisch unabhängig sind.",
        r"Beschreiben Sie im Sachzusammenhang ein Ereignis, dessen Wahrscheinlichkeit "
        r"$0{,}15$ beträgt.",
    ],
    [
        r"Zeilen- und Spaltensummen füllen die Tafel: "
        r"$P(S \cap \overline{G}) = 0{,}60 - 0{,}30 = 0{,}30$, "
        r"$P(\overline{S} \cap G) = 0{,}45 - 0{,}30 = 0{,}15$, "
        r"$P(\overline{S} \cap \overline{G}) = 1 - 0{,}60 - 0{,}45 + 0{,}30 = 0{,}25$, "
        r"$P(\overline{S}) = 0{,}40$ und $P(\overline{G}) = 0{,}55$.",
        r"Gefragt ist die bedingte Wahrscheinlichkeit "
        r"$P_S(G) = \dfrac{P(S \cap G)}{P(S)} = \dfrac{0{,}30}{0{,}60} = 0{,}5$, "
        r"also $50\ \%$.",
        r"Bei Unabhängigkeit müsste $P(S) \cdot P(G) = P(S \cap G)$ gelten. Es ist aber "
        r"$0{,}60 \cdot 0{,}45 = 0{,}27 \neq 0{,}30$. Die Ereignisse sind also "
        r"**abhängig** — Schülerinnen und Schüler gehen etwas häufiger an den Grillstand "
        r"als der Durchschnitt.",
        r"$P(\overline{S} \cap G) = 0{,}15$: „Der ausgewählte Besucher ist **keine** "
        r"Schülerin und kein Schüler und isst am Grillstand.“",
    ],
    falle=r"$P_S(G) = 0{,}5$ und $P(S \cap G) = 0{,}30$ sind zwei verschiedene Dinge. Beim "
          r"ersten ist die Grundmenge nur noch die Schülerschaft, beim zweiten sind es alle "
          r"Besucher.",
    figs=[(fig_vierfelder(), "Die unvollständige Vierfeldertafel zum Sachverhalt.")],
    solfigs=[(fig_vierfelder_voll(), "Die vollständige Tafel zu a)."),
             (fig_baum(), "Derselbe Sachverhalt als Baumdiagramm — die "
                          "Pfadwahrscheinlichkeiten rechts sind genau die vier Felder.")],
)

s.task(
    "Die Losbude", 2,
    r"An einer Losbude gewinnt jedes Los unabhängig von den anderen mit der "
    r"Wahrscheinlichkeit $p = 0{,}25$. Eine Klasse zieht $12$ Lose. Die Zufallsgröße $X$ "
    r"beschreibt die Anzahl der Gewinne.",
    [
        r"Geben Sie den Erwartungswert und die Standardabweichung von $X$ an.",
        r"Berechnen Sie die Wahrscheinlichkeit für genau drei Gewinne und die "
        r"Wahrscheinlichkeit für mindestens einen Gewinn.",
        r"Bestimmen Sie die Wahrscheinlichkeit dafür, dass die Anzahl der Gewinne "
        r"höchstens eine Standardabweichung vom Erwartungswert abweicht.",
        r"Ermitteln Sie, wie viele Lose mindestens gezogen werden müssen, damit mit einer "
        r"Wahrscheinlichkeit von mindestens $99\ \%$ wenigstens ein Gewinn dabei ist.",
    ],
    [
        r"$X$ ist binomialverteilt mit $n = 12$ und $p = 0{,}25$. "
        r"$E(X) = n \cdot p = 3$ und "
        r"$\sigma = \sqrt{n \cdot p \cdot (1-p)} = \sqrt{12 \cdot 0{,}25 \cdot 0{,}75} "
        r"= \sqrt{2{,}25} = 1{,}5$.",
        r"$P(X = 3) = \binom{12}{3} \cdot 0{,}25^3 \cdot 0{,}75^9 = "
        r"220 \cdot 0{,}25^3 \cdot 0{,}75^9 \approx 0{,}258$. "
        r"Für mindestens einen Gewinn über das Gegenereignis: "
        r"$P(X \geq 1) = 1 - P(X = 0) = 1 - 0{,}75^{12} \approx 0{,}968$.",
        r"Eine Standardabweichung um den Erwartungswert heißt "
        r"$3 - 1{,}5 \leq X \leq 3 + 1{,}5$, also $1{,}5 \leq X \leq 4{,}5$. Da $X$ nur "
        r"ganze Zahlen annimmt, ist das $P(2 \leq X \leq 4) = "
        r"P(X = 2) + P(X = 3) + P(X = 4) \approx 0{,}684$.",
        r"Gesucht ist das kleinste $n$ mit $1 - 0{,}75^{\,n} \geq 0{,}99$, also "
        r"$0{,}75^{\,n} \leq 0{,}01$. Logarithmieren: "
        r"$n \geq \dfrac{\ln 0{,}01}{\ln 0{,}75} \approx 16{,}01$. Da $n$ ganzzahlig ist, "
        r"werden **17 Lose** gebraucht.",
    ],
    falle=r"Beim Logarithmieren dreht sich das Ungleichheitszeichen um, weil "
          r"$\ln 0{,}75$ negativ ist. Und $16{,}01$ wird **aufgerundet** — $16$ Lose "
          r"reichen noch nicht ganz.",
    figs=[(fig_binomial(),
           "Die Verteilung von X. Grün markiert sind die Werte innerhalb einer "
           "Standardabweichung um den Erwartungswert.")],
)

s.task(
    "Lohnt sich die Bude noch?", 3,
    r"Der Veranstalter wirbt damit, dass mindestens jedes vierte Los gewinnt. Am Ende des "
    r"Tages werden $200$ zufällig ausgewählte verkaufte Lose überprüft; darunter sind "
    r"$38$ Gewinne. Die Behauptung soll mit einem linksseitigen Signifikanztest auf dem "
    r"Signifikanzniveau $\alpha = 5\ \%$ überprüft werden.",
    [
        r"Geben Sie die Nullhypothese an und begründen Sie, warum linksseitig getestet wird.",
        r"Bestimmen Sie den Ablehnungsbereich der Nullhypothese.",
        r"Treffen Sie eine Entscheidung und formulieren Sie eine Empfehlung für den "
        r"Veranstalter.",
        r"Geben Sie die tatsächliche Wahrscheinlichkeit für einen Fehler 1. Art an und "
        r"beschreiben Sie den Fehler 2. Art im Sachzusammenhang.",
    ],
    [
        r"$H_0$: $p \geq 0{,}25$ („mindestens jedes vierte Los gewinnt“), "
        r"$H_1$: $p < 0{,}25$. Zweifel entstehen nur bei **zu wenigen** Gewinnen, deshalb "
        r"liegt der Ablehnungsbereich links. Unter $H_0$ wird mit dem Randwert "
        r"$p = 0{,}25$ gerechnet: $X$ ist binomialverteilt mit $n = 200$ und $p = 0{,}25$, "
        r"$E(X) = 50$ und $\sigma = \sqrt{200 \cdot 0{,}25 \cdot 0{,}75} \approx 6{,}12$.",
        r"Gesucht ist das größte $k$ mit $P(X \leq k) \leq 0{,}05$. Aus der Tabelle "
        r"beziehungsweise mit dem Rechner: $P(X \leq 39) \approx 0{,}0405$ und "
        r"$P(X \leq 40) \approx 0{,}0579$. Also ist "
        r"$\overline{A} = \{0;\,1;\,\dots;\,39\}$ der Ablehnungsbereich, "
        r"$A = \{40;\,\dots;\,200\}$ der Annahmebereich.",
        r"Der beobachtete Wert $38$ liegt im Ablehnungsbereich. $H_0$ wird also verworfen: "
        r"Auf dem Niveau von $5\ \%$ spricht die Stichprobe dagegen, dass mindestens jedes "
        r"vierte Los gewinnt. Empfehlung: Der Veranstalter sollte die Werbeaussage "
        r"zurücknehmen oder den Anteil der Gewinnlose erhöhen.",
        r"Der Fehler 1. Art ist die Wahrscheinlichkeit, $H_0$ zu verwerfen, obwohl sie "
        r"stimmt: $P(X \leq 39 \mid p = 0{,}25) \approx 0{,}0405$, also rund $4{,}1\ \%$ — "
        r"weniger als die zugelassenen $5\ \%$, weil $X$ nur ganze Werte annimmt. "
        r"Der Fehler 2. Art wäre: Der Anteil der Gewinnlose liegt tatsächlich unter "
        r"$25\ \%$, die Stichprobe ergibt aber $40$ oder mehr Gewinne — die Werbeaussage "
        r"bliebe unbeanstandet, obwohl sie falsch ist.",
    ],
    falle=r"Das Signifikanzniveau wird **nicht** ausgeschöpft. $5\ \%$ ist eine Schranke, "
          r"die tatsächliche Irrtumswahrscheinlichkeit ist der Wert an der Grenze des "
          r"Ablehnungsbereichs — hier $4{,}1\ \%$. Wer $k = 40$ nimmt, überschreitet mit "
          r"$5{,}8\ \%$ das Niveau.",
    figs=[(fig_test(),
           "Die Verteilung unter der Nullhypothese. Rot der Ablehnungsbereich, grün der "
           "beobachtete Wert 38.")],
)


def check():
    # Vierfeldertafel
    assert abs((P_S - P_SG) - 0.30) < 1e-12
    assert abs((P_G - P_SG) - 0.15) < 1e-12
    assert abs((1 - P_S - P_G + P_SG) - 0.25) < 1e-12
    assert abs(P_SG / P_S - 0.5) < 1e-12
    assert abs(P_S * P_G - 0.27) < 1e-12 and abs(P_S * P_G - P_SG) > 1e-9
    # Baumdiagramm: die Pfade muessen die Felder der Tafel treffen
    assert abs(P_S * 0.5 - P_SG) < 1e-12
    assert abs((1 - P_S) * 0.375 - (P_G - P_SG)) < 1e-12
    assert abs((1 - P_S) * 0.625 - (1 - P_S - P_G + P_SG)) < 1e-12
    # Losbude
    assert N * P == 3 and abs(sqrt(N * P * (1 - P)) - 1.5) < 1e-12
    assert comb(12, 3) == 220
    assert abs(binom(N, P, 3) - 0.258) < 0.0005
    assert abs(1 - binom(N, P, 0) - 0.968) < 0.0005
    assert abs(sum(binom(N, P, k) for k in (2, 3, 4)) - 0.684) < 0.0005
    n_min = log(0.01) / log(0.75)
    assert abs(n_min - 16.01) < 0.005 and 1 - 0.75 ** 17 >= 0.99 > 1 - 0.75 ** 16
    # Test
    assert NT * P0 == 50 and abs(sqrt(NT * P0 * 0.75) - 6.12) < 0.005
    assert K_MAX == 39, K_MAX
    assert abs(cdf(NT, P0, 39) - 0.0405) < 0.0001
    assert abs(cdf(NT, P0, 40) - 0.0579) < 0.0001
    assert cdf(NT, P0, 39) <= ALPHA < cdf(NT, P0, 40)
    assert abs(ALPHA_REAL - cdf(NT, P0, 39)) < 1e-12
    assert BEOB <= K_MAX, "der beobachtete Wert muss im Ablehnungsbereich liegen"


s.verify(check)
s.save()
