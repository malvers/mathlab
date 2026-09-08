#!/usr/bin/env python3
"""Abitur-Training BGY - Stochastik im Leistungskurs (Pflichtaufgabe 3).

    python3 tools/aufgaben/abi/stochastik_lk.py

The LK staircase of the Saxon originals: a three stage experiment with a tree diagram,
the way back from the effect to its cause (Bayes, without the name), a binomial sigma
window - and a significance test that also asks for the error of the second kind.
Context, numbers, wording and figures are our own.
"""
import os
import sys
from math import comb, log, sqrt

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402

# Aufgabe 1: Endkontrolle, three tests in a row, each with its own failure rate
P_M, P_D, P_F = 0.96, 0.95, 0.90
TAGESSTUECK = 2500
# Aufgabe 2: two suppliers of the battery cells
Q1, Q2 = 0.70, 0.30            # shares of the two suppliers
A1 = 0.02                      # scrap rate of supplier 1
A_GES = 0.032                  # scrap rate of the whole delivery
N2, P2 = 40, 0.30              # sample for the binomial part
# Aufgabe 3: significance test on the capacity promise
NT, P0, P_WAHR, ALPHA, BEOB = 200, 0.85, 0.80, 0.05, 163


def binom(n, p, k):
    return comb(n, k) * p ** k * (1 - p) ** (n - k)


def cdf(n, p, k):
    return sum(binom(n, p, i) for i in range(k + 1))


def ablehnung(n, p, alpha):
    """Largest k with P(X <= k) <= alpha - the left sided rejection region {0,...,k}."""
    k, total = -1, 0.0
    while True:
        nxt = total + binom(n, p, k + 1)
        if nxt > alpha:
            return k, total
        k, total = k + 1, nxt


# the eight paths of the tree, in the order the figure draws them (top to bottom)
PFADE = []
for m in (1, 0):
    for d in (1, 0):
        for f in (1, 0):
            lab = "%s %s %s" % ("M" if m else "M̄", "D" if d else "D̄",
                                "F" if f else "F̄")
            val = ((P_M if m else 1 - P_M) * (P_D if d else 1 - P_D)
                   * (P_F if f else 1 - P_F))
            PFADE.append((lab, val))

P_ALLE = P_M * P_D * P_F
P_GENAU_EIN = ((1 - P_M) * P_D * P_F + P_M * (1 - P_D) * P_F + P_M * P_D * (1 - P_F))
P_MIND_EIN = 1 - P_ALLE

A2 = (A_GES - Q1 * A1) / Q2                      # scrap rate of supplier 2
P_Z1_OK = Q1 * (1 - A1) / (1 - A_GES)            # supplier 1 given a sound cell
P_Z2_DEFEKT = Q2 * A2 / A_GES                    # supplier 2 given a defective cell
MU2, SD2 = N2 * P2, sqrt(N2 * P2 * (1 - P2))
SIG_LO, SIG_HI = 11, 13                          # integers inside mu +- sigma/2
P_SIGMA = sum(binom(N2, P2, k) for k in range(SIG_LO, SIG_HI + 1))
N_MIN = log(0.01) / log(1 - A_GES)

K_MAX, ALPHA_REAL = ablehnung(NT, P0, ALPHA)
BETA = 1 - cdf(NT, P_WAHR, K_MAX)


# ----------------------------------------------------------------- figures ---
# Pixel layout of the tree - one place for both versions of the figure.
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
        d.branch(ROOT, q, S.num(P_M if i == 0 else 1 - P_M, 2))
        d.node(q[0], q[1], "M" if i == 0 else "M̄", "above" if i == 0 else "below")
    for i, q in enumerate(LVL2):
        d.branch(LVL1[i // 2], q, S.num(P_D if i % 2 == 0 else 1 - P_D, 2))
        d.node(q[0], q[1], "D" if i % 2 == 0 else "D̄",
               "above" if i % 2 == 0 else "below")
    for i, q in enumerate(LVL3):
        d.branch(LVL2[i // 2], q, S.num(P_F if i % 2 == 0 else 1 - P_F, 1))
        lab, val = PFADE[i]
        d.node(q[0], q[1], lab, "right")
        if mit_pfaden:
            d.text(q[0] + 64, q[1] + 5, "→  " + S.num(val, 4), 11.5, S.MUTED, "start")
    d.text(TREE_W / 2.0, TREE_H - 12,
           "M: Maß in Ordnung   ·   D: dicht   ·   F: Funktion in Ordnung",
           11.5, S.MUTED)
    return d.svg("Baumdiagramm der drei Pruefungen mit ihren Wahrscheinlichkeiten")


def fig_binomial():
    probs = [binom(N2, P2, k) for k in range(25)]
    p = S.Plot((-0.9, 24.6), (0, 0.165), w=560, h=320, pad=(64, 20, 24, 42))
    p.axes(2, 0.03, xlabel="k", ylabel="P(X = k)", ydec=2)
    p.bars(probs, 0, S.ORANGE, highlight=tuple(range(SIG_LO, SIG_HI + 1)), hi_fill=S.GREEN)
    # the half sigma window around the expected value - brace on top, the pointer to the
    # expected value comes in from the right, where the bars are already low
    p.line(p.X(MU2), p.Y(0), p.X(MU2), p.Y(0.148), S.RED, 1.3, dash="4 3")
    p.brace(MU2 - SD2 / 2, MU2 + SD2 / 2, 0.152, "eine halbe Standardabweichung", S.MUTED)
    p.text(p.X(17.6), p.Y(0.104), "Erwartungswert 12", 11.5, S.RED, "start", halo=S.PAPER)
    p.arrow(p.X(17.4), p.Y(0.101), p.X(MU2) + 5, p.Y(0.082), S.RED, 1.1)
    return p.svg("Balkendiagramm der Binomialverteilung fuer n gleich 40 und p gleich 0,3")


def fig_fehler():
    """Both distributions in one frame: under H0 and under the assumed true p.

    Drawn as step outlines instead of two sets of bars - the two filled areas then sit
    left and right of the cut and never cover each other.
    """
    lo, hi = 141, 189
    p = S.Plot((lo - 0.6, hi + 0.6), (0, 0.10), w=560, h=340, pad=(58, 22, 26, 52))
    p.axes(5, 0, xlabel="k", yticks=False, ylabel="", origin=None)
    # Plot.axes puts the value axis at X(0) - far off canvas for a k window around 165,
    # so it is drawn here at the left edge of the frame instead
    xa = p.X(p.x0)
    p.arrow(xa, p.Y(0), xa, p.Y(0.10), S.INK, 1.3)
    p.text(xa - 2, p.Y(0.10) - 8, "P(X = k)", 13, S.INK, "start", italic=True)
    for i in range(1, 5):          # the tick at 0,10 would sit in the arrow head
        v = 0.02 * i
        p.line(xa - 3.5, p.Y(v), xa + 3.5, p.Y(v), S.INK, 1.1)
        p.text(xa - 7, p.Y(v) + 4, S.num(v, 2), 11.5, S.MUTED, "end")

    def stufen(prob, a, b):
        """Step outline of a discrete distribution, in world units."""
        pts = []
        for k in range(a, b + 1):
            v = prob(k)
            pts += [(k - 0.5, v), (k + 0.5, v)]
        return pts

    def flaeche(pts, fill, opacity):
        poly = [p.P(u, v) for u, v in pts]
        poly = [p.P(pts[0][0], 0)] + poly + [p.P(pts[-1][0], 0)]
        p.poly(poly, stroke="none", fill=fill, opacity=opacity)

    h0 = lambda k: binom(NT, P0, k)                                  # noqa: E731
    h1 = lambda k: binom(NT, P_WAHR, k)                              # noqa: E731
    flaeche(stufen(h0, lo, K_MAX), S.RED, 0.45)
    flaeche(stufen(h1, K_MAX + 1, hi), S.GREEN, 0.35)
    p.poly([p.P(u, v) for u, v in stufen(h1, lo, hi)], stroke=S.GREEN, width=1.8, close=False)
    p.poly([p.P(u, v) for u, v in stufen(h0, lo, hi)], stroke=S.ORANGE, width=1.8, close=False)

    # the cut between rejection and acceptance, named below the axis
    cut = K_MAX + 0.5
    p.line(p.X(cut), p.Y(0.092), p.X(cut), p.Y(0) + 22, S.INK, 1.4)
    p.text(p.X(cut) - 8, p.Y(0) + 40, "Ablehnungsbereich", 11.5, S.RED, "end")
    p.text(p.X(cut) + 8, p.Y(0) + 40, "Annahmebereich", 11.5, S.BODY, "start")
    # the sample result
    p.line(p.X(BEOB), p.Y(0), p.X(BEOB), p.Y(0.079), S.INK, 1.1, dash="3 3")
    p.text(p.X(BEOB) + 6, p.Y(0.083), "beobachtet: 163", 11.5, S.INK, "start", halo=S.PAPER)

    # legend, top left - both curves are flat out there. The lines stay short on purpose:
    # the fourth row would otherwise run into the rising green curve.
    for i, (col, txt) in enumerate(((S.ORANGE, "unter H0: p = 0,85"),
                                    (S.GREEN, "in Wahrheit: p = 0,80"),
                                    (S.RED, "Fehler 1. Art"),
                                    (S.GREEN, "Fehler 2. Art"))):
        y = p.Y(0.096 - 0.0105 * i)
        if i < 2:
            p.line(p.X(lo + 1.6), y - 4, p.X(lo + 3.6), y - 4, col, 2.4)
        else:
            p.rect(p.X(lo + 1.6), y - 8, p.X(lo + 3.6) - p.X(lo + 1.6), 8,
                   fill=col, opacity=0.45 if i == 2 else 0.35)
        p.text(p.X(lo + 4.3), y, txt, 11, S.BODY, "start")
    return p.svg("Zwei Binomialverteilungen uebereinander mit markiertem Ablehnungsbereich")


# ------------------------------------------------------------------- sheet ---
s = Sheet("abitur-bgy-stochastik-lk", "Stochastik — Leistungskurs",
          kind="Abitur-Training",
          suffix="",
          klasse="Berufliches Gymnasium",
          sub="Berufliches Gymnasium · Pflichtaufgabe 3 · Leistungskurs · "
              "drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Abitur-Training Mathematik BGY, Stochastik im Leistungskurs: "
               "mehrstufiges Zufallsexperiment, Rückschluss auf die Ursache, "
               "Sigma-Umgebung und Signifikanztest mit beiden Fehlerarten.",
          plan=("../svp/mathe/abitur.html", "Zur Übersicht"))

s.task(
    "Endkontrolle in der Leuchtenfertigung", 1,
    r"Ein Betrieb fertigt Akku-Handleuchten. Jede Leuchte durchläuft nacheinander drei "
    r"Prüfungen: die Maßprüfung (Ereignis $M$: Maß in Ordnung), die Dichtheitsprüfung "
    r"(Ereignis $D$) und die Funktionsprüfung (Ereignis $F$). Erfahrungsgemäß werden "
    r"$4\ \%$ der Leuchten bei der Maßprüfung, $5\ \%$ bei der Dichtheitsprüfung und "
    r"$10\ \%$ bei der Funktionsprüfung beanstandet. Die drei Prüfungen sind voneinander "
    r"unabhängig; jede Leuchte durchläuft alle drei.",
    [
        r"Berechnen Sie die Wahrscheinlichkeit dafür, dass eine zufällig ausgewählte "
        r"Leuchte alle drei Prüfungen besteht.",
        r"Bestimmen Sie die Wahrscheinlichkeit dafür, dass eine Leuchte bei **genau einer** "
        r"der drei Prüfungen beanstandet wird.",
        r"Berechnen Sie die Wahrscheinlichkeit dafür, dass eine Leuchte **mindestens eine** "
        r"Beanstandung erhält.",
        r"Täglich werden $2500$ Leuchten gefertigt. Geben Sie an, wie viele davon im Mittel "
        r"einwandfrei sind und wie viele mindestens eine Beanstandung erhalten.",
    ],
    [
        r"Ein Pfad im Baumdiagramm wird durchmultipliziert (Pfadmultiplikationsregel): "
        r"$P(M \cap D \cap F) = 0{,}96 \cdot 0{,}95 \cdot 0{,}90 = 0{,}8208$, "
        r"also rund $82{,}1\ \%$.",
        r"Genau eine Beanstandung heißt: genau einer der drei Faktoren ist der "
        r"Fehleranteil. Die drei Pfade werden addiert (Pfadadditionsregel): "
        r"$0{,}04 \cdot 0{,}95 \cdot 0{,}90 + 0{,}96 \cdot 0{,}05 \cdot 0{,}90 + "
        r"0{,}96 \cdot 0{,}95 \cdot 0{,}10 = 0{,}0342 + 0{,}0432 + 0{,}0912 = 0{,}1686$, "
        r"also rund $16{,}9\ \%$.",
        r"Über das Gegenereignis „keine Beanstandung“: "
        r"$P(\text{mindestens eine}) = 1 - 0{,}8208 = 0{,}1792$, also rund $17{,}9\ \%$. "
        r"Der Unterschied zu b) sind die Leuchten mit zwei oder drei Beanstandungen: "
        r"$0{,}1792 - 0{,}1686 = 0{,}0106$.",
        r"Erwartungswerte bei $2500$ Leuchten: "
        r"$2500 \cdot 0{,}8208 = 2052$ einwandfreie Leuchten und "
        r"$2500 \cdot 0{,}1792 = 448$ Leuchten mit mindestens einer Beanstandung. "
        r"Zusammen sind das wieder $2500$.",
    ],
    falle=r"„Genau eine Beanstandung“ und „mindestens eine Beanstandung“ sind zwei "
          r"verschiedene Ereignisse. Für „mindestens“ lohnt fast immer das Gegenereignis, "
          r"für „genau“ muss man die Pfade wirklich einzeln aufschreiben und addieren.",
    figs=[(fig_baum(False),
           "Das Baumdiagramm der drei Prüfungen. An jedem Ast steht die Wahrscheinlichkeit "
           "für den nächsten Schritt.")],
    solfigs=[(fig_baum(True),
              "Derselbe Baum mit allen acht Pfadwahrscheinlichkeiten. Ihre Summe ist 1 — "
              "eine gute Probe für die Rechnung.")],
)

s.task(
    "Woher stammt die Zelle?", 2,
    r"Die Akkuzellen für die Leuchten kommen von zwei Zulieferern: $70\ \%$ der Zellen "
    r"liefert Zulieferer 1 (Ereignis $Z_1$), $30\ \%$ Zulieferer 2 (Ereignis $Z_2$). "
    r"Von den Zellen des ersten Zulieferers sind $2\ \%$ schadhaft (Ereignis $S$). "
    r"Insgesamt sind $3{,}2\ \%$ aller gelieferten Zellen schadhaft.",
    [
        r"Bestimmen Sie den Anteil der schadhaften Zellen bei Zulieferer 2.",
        r"Eine zufällig entnommene Zelle ist **nicht** schadhaft. Berechnen Sie die "
        r"Wahrscheinlichkeit dafür, dass sie von Zulieferer 1 stammt.",
        r"Aus einer großen Lieferung werden $40$ Zellen zufällig entnommen; die "
        r"Zufallsgröße $X$ zählt die Zellen von Zulieferer 2. Bestimmen Sie die "
        r"Wahrscheinlichkeit dafür, dass $X$ um höchstens eine halbe Standardabweichung "
        r"vom Erwartungswert abweicht.",
        r"Ermitteln Sie, wie viele Zellen mindestens geprüft werden müssen, damit mit "
        r"einer Wahrscheinlichkeit von mindestens $99\ \%$ wenigstens eine schadhafte "
        r"Zelle darunter ist.",
    ],
    [
        r"Der Gesamtanteil setzt sich aus beiden Zulieferern zusammen: "
        r"$P(S) = P(Z_1) \cdot P_{Z_1}(S) + P(Z_2) \cdot P_{Z_2}(S)$, also "
        r"$0{,}032 = 0{,}70 \cdot 0{,}02 + 0{,}30 \cdot x = 0{,}014 + 0{,}30x$. "
        r"Daraus folgt $0{,}30x = 0{,}018$ und $x = 0{,}06$: bei Zulieferer 2 sind "
        r"**$6\ \%$** der Zellen schadhaft, dreimal so viele wie bei Zulieferer 1.",
        r"Gesucht ist die bedingte Wahrscheinlichkeit $P_{\overline{S}}(Z_1)$. Es ist "
        r"$P(Z_1 \cap \overline{S}) = 0{,}70 \cdot 0{,}98 = 0{,}686$ und "
        r"$P(\overline{S}) = 1 - 0{,}032 = 0{,}968$, also "
        r"$P_{\overline{S}}(Z_1) = \dfrac{0{,}686}{0{,}968} \approx 0{,}7087$, "
        r"rund $70{,}9\ \%$. Eine einwandfreie Zelle stammt also etwas häufiger von "
        r"Zulieferer 1, als es dessen Lieferanteil von $70\ \%$ erwarten lässt.",
        r"Weil die Lieferung groß ist, darf $X$ als binomialverteilt mit $n = 40$ und "
        r"$p = 0{,}30$ angesehen werden: $E(X) = 12$ und "
        r"$\sigma = \sqrt{40 \cdot 0{,}30 \cdot 0{,}70} = \sqrt{8{,}4} \approx 2{,}898$. "
        r"Eine halbe Standardabweichung sind $1{,}449$, gesucht ist also "
        r"$P(10{,}55 \leq X \leq 13{,}45) = P(11 \leq X \leq 13) = "
        r"P(X{=}11) + P(X{=}12) + P(X{=}13) \approx 0{,}3945$, rund $39{,}5\ \%$.",
        r"Jede Zelle ist unabhängig von den anderen mit $p = 0{,}032$ schadhaft. Gesucht "
        r"ist das kleinste $n$ mit $1 - 0{,}968^{\,n} \geq 0{,}99$, also "
        r"$0{,}968^{\,n} \leq 0{,}01$. Logarithmieren liefert "
        r"$n \geq \dfrac{\ln 0{,}01}{\ln 0{,}968} \approx 141{,}6$, also müssen "
        r"**142 Zellen** geprüft werden. Zur Probe: $1 - 0{,}968^{141} \approx 0{,}9898$ "
        r"reicht noch nicht, $1 - 0{,}968^{142} \approx 0{,}9901$ reicht.",
    ],
    falle=r"In b) wird die Frage umgedreht: gegeben ist die Wirkung (Zelle in Ordnung), "
          r"gesucht ist die Ursache (Zulieferer). $P_{\overline{S}}(Z_1) \approx 0{,}709$ "
          r"und $P_{Z_1}(\overline{S}) = 0{,}98$ sind völlig verschiedene Zahlen. Zum "
          r"Vergleich: eine **schadhafte** Zelle stammt mit "
          r"$\dfrac{0{,}018}{0{,}032} = 0{,}5625$ von Zulieferer 2, obwohl er nur "
          r"$30\ \%$ liefert.",
    figs=[(fig_binomial(),
           "Die Verteilung von X für n gleich 40 und p gleich 0,3. Grün markiert sind die "
           "Werte innerhalb einer halben Standardabweichung um den Erwartungswert.")],
)

s.task(
    "Hält der Akku, was die Werbung verspricht?", 3,
    r"Der Betrieb wirbt damit, dass **mindestens $85\ \%$** der Akkus nach $500$ "
    r"Ladezyklen noch mindestens $80\ \%$ ihrer Anfangskapazität haben. Ein Prüflabor "
    r"testet $200$ zufällig ausgewählte Akkus; $163$ davon erfüllen die Bedingung. Die "
    r"Werbeaussage soll mit einem Signifikanztest auf dem Signifikanzniveau "
    r"$\alpha = 5\ \%$ überprüft werden. Die Zufallsgröße $X$ zählt die Akkus in der "
    r"Stichprobe, die die Bedingung erfüllen.",
    [
        r"Geben Sie Null- und Gegenhypothese an, begründen Sie die Testrichtung und "
        r"berechnen Sie Erwartungswert und Standardabweichung von $X$ unter $H_0$.",
        r"Bestimmen Sie den Ablehnungsbereich der Nullhypothese und geben Sie die "
        r"tatsächliche Wahrscheinlichkeit für einen Fehler 1. Art an.",
        r"Entscheiden Sie anhand der Stichprobe und formulieren Sie eine Empfehlung für "
        r"das Prüflabor.",
        r"Nehmen Sie an, in Wahrheit erfüllen nur $80\ \%$ der Akkus die Bedingung. "
        r"Berechnen Sie die Wahrscheinlichkeit für einen Fehler 2. Art und deuten Sie das "
        r"Ergebnis.",
    ],
    [
        r"$H_0$: $p \geq 0{,}85$ (die Werbeaussage stimmt), $H_1$: $p < 0{,}85$. "
        r"Zweifel entstehen nur bei **zu wenigen** haltbaren Akkus, deshalb wird "
        r"linksseitig getestet. Gerechnet wird mit dem Randwert $p = 0{,}85$: $X$ ist "
        r"binomialverteilt mit $n = 200$ und $p = 0{,}85$, also $E(X) = 170$ und "
        r"$\sigma = \sqrt{200 \cdot 0{,}85 \cdot 0{,}15} = \sqrt{25{,}5} \approx 5{,}05$.",
        r"Gesucht ist das größte $k$ mit $P(X \leq k) \leq 0{,}05$. Es ist "
        r"$P(X \leq 161) \approx 0{,}0498$ und $P(X \leq 162) \approx 0{,}0720$. Also ist "
        r"$\overline{A} = \{0;\,1;\,\dots;\,161\}$ der Ablehnungsbereich und "
        r"$A = \{162;\,\dots;\,200\}$ der Annahmebereich. Die tatsächliche "
        r"Wahrscheinlichkeit für einen Fehler 1. Art ist $0{,}0498$, also rund "
        r"$4{,}98\ \%$ — knapp unter dem Niveau von $5\ \%$.",
        r"Der beobachtete Wert $163$ liegt im Annahmebereich. $H_0$ wird **nicht** "
        r"verworfen: Die Stichprobe widerspricht der Werbeaussage auf dem Niveau von "
        r"$5\ \%$ nicht, obwohl der Stichprobenanteil mit "
        r"$\frac{163}{200} = 0{,}815$ unter $0{,}85$ liegt. Empfehlung: Die Aussage darf "
        r"stehen bleiben, ein Beweis für sie ist das Ergebnis aber nicht — für eine "
        r"belastbare Aussage müsste das Labor mehr Akkus prüfen.",
        r"Fehler 2. Art heißt: $H_0$ wird beibehalten, obwohl sie falsch ist. Bei "
        r"$p = 0{,}80$ ist $E(X) = 160$ und $\sigma = \sqrt{32} \approx 5{,}66$; gesucht "
        r"ist die Wahrscheinlichkeit, dass die Stichprobe trotzdem im Annahmebereich "
        r"landet: $\beta = P(X \geq 162 \mid p = 0{,}80) = "
        r"1 - P(X \leq 161 \mid p = 0{,}80) \approx 0{,}4019$, also rund "
        r"$40{,}2\ \%$. In gut zwei von fünf Fällen bliebe eine Verschlechterung auf "
        r"$80\ \%$ also unentdeckt — der Test ist bei $n = 200$ wenig trennscharf.",
    ],
    falle=r"„$H_0$ nicht verworfen“ heißt nicht „$H_0$ bewiesen“. Der Fehler 2. Art wird "
          r"unter der **angenommenen wahren** Wahrscheinlichkeit gerechnet, hier "
          r"$p = 0{,}80$, und über den **Annahme**bereich — nicht über den "
          r"Ablehnungsbereich und nicht mit $p = 0{,}85$.",
    solfigs=[(fig_fehler(),
              "Beide Verteilungen in einem Bild. Links vom Schnitt bei 161,5 liegt der "
              "Ablehnungsbereich: die rote Fläche unter der Kurve für p gleich 0,85 ist "
              "der Fehler 1. Art. Rechts davon liegt der Annahmebereich: die grüne Fläche "
              "unter der Kurve für p gleich 0,80 ist der Fehler 2. Art.")],
)


def check():
    # --- Aufgabe 1: tree, path rules, expected counts
    assert abs(P_ALLE - 0.8208) < 1e-12
    assert abs((1 - P_M) * P_D * P_F - 0.0342) < 1e-12
    assert abs(P_M * (1 - P_D) * P_F - 0.0432) < 1e-12
    assert abs(P_M * P_D * (1 - P_F) - 0.0912) < 1e-12
    assert abs(P_GENAU_EIN - 0.1686) < 1e-12
    assert abs(P_MIND_EIN - 0.1792) < 1e-12
    assert abs(P_MIND_EIN - P_GENAU_EIN - 0.0106) < 1e-12
    assert abs(round(P_ALLE * 100, 1) - 82.1) < 1e-9
    assert abs(round(P_GENAU_EIN * 100, 1) - 16.9) < 1e-9
    assert abs(round(P_MIND_EIN * 100, 1) - 17.9) < 1e-9
    assert TAGESSTUECK * P_ALLE == 2052 and abs(TAGESSTUECK * P_MIND_EIN - 448) < 1e-9
    assert 2052 + 448 == TAGESSTUECK
    # the eight paths of the figure: complete, and the first one is the all-good path
    assert len(PFADE) == 8 and abs(sum(v for _, v in PFADE) - 1) < 1e-12
    assert abs(PFADE[0][1] - P_ALLE) < 1e-12 and PFADE[0][0] == "M D F"
    assert S.num(PFADE[-1][1], 4) == "0,0002"

    # --- Aufgabe 2: back to the cause, sigma window, minimum sample size
    assert abs(Q1 * A1 - 0.014) < 1e-12
    assert abs(A2 - 0.06) < 1e-12 and abs(Q2 * A2 - 0.018) < 1e-12
    assert abs(Q1 * A1 + Q2 * A2 - A_GES) < 1e-12
    assert abs(Q1 * (1 - A1) - 0.686) < 1e-12 and abs(1 - A_GES - 0.968) < 1e-12
    assert abs(P_Z1_OK - 0.7087) < 0.00005
    assert abs(round(P_Z1_OK * 100, 1) - 70.9) < 1e-9
    assert abs(P_Z2_DEFEKT - 0.5625) < 1e-12
    assert MU2 == 12 and abs(SD2 ** 2 - 8.4) < 1e-12 and abs(SD2 - 2.898) < 0.0005
    assert abs(SD2 / 2 - 1.449) < 0.0005
    assert abs(MU2 - SD2 / 2 - 10.55) < 0.005 and abs(MU2 + SD2 / 2 - 13.45) < 0.005
    # the integers inside the half sigma window are exactly 11, 12 and 13
    assert [k for k in range(N2 + 1) if MU2 - SD2 / 2 <= k <= MU2 + SD2 / 2] == [11, 12, 13]
    assert abs(P_SIGMA - 0.3945) < 0.00005
    assert abs(round(P_SIGMA * 100, 1) - 39.5) < 1e-9
    assert abs(N_MIN - 141.6) < 0.005
    assert 1 - (1 - A_GES) ** 142 >= 0.99 > 1 - (1 - A_GES) ** 141
    assert abs(1 - (1 - A_GES) ** 141 - 0.9898) < 0.00005
    assert abs(1 - (1 - A_GES) ** 142 - 0.9901) < 0.00005

    # --- Aufgabe 3: rejection region and both kinds of error
    assert NT * P0 == 170 and abs(NT * P0 * (1 - P0) - 25.5) < 1e-12
    assert abs(sqrt(NT * P0 * (1 - P0)) - 5.05) < 0.005
    assert K_MAX == 161, K_MAX
    assert abs(cdf(NT, P0, 161) - 0.0498) < 0.00005
    assert abs(cdf(NT, P0, 162) - 0.0720) < 0.00005
    assert cdf(NT, P0, K_MAX) <= ALPHA < cdf(NT, P0, K_MAX + 1)
    assert abs(ALPHA_REAL - cdf(NT, P0, K_MAX)) < 1e-12
    assert abs(round(ALPHA_REAL * 100, 2) - 4.98) < 1e-9
    assert BEOB > K_MAX, "der beobachtete Wert muss im Annahmebereich liegen"
    assert abs(BEOB / NT - 0.815) < 1e-12
    assert NT * P_WAHR == 160 and abs(NT * P_WAHR * (1 - P_WAHR) - 32) < 1e-12
    assert abs(sqrt(32) - 5.66) < 0.005
    assert abs(BETA - 0.4019) < 0.00005
    assert abs(round(BETA * 100, 1) - 40.2) < 1e-9
    assert abs(BETA - sum(binom(NT, P_WAHR, k) for k in range(K_MAX + 1, NT + 1))) < 1e-12


s.verify(check)
s.save()
