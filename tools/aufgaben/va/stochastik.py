#!/usr/bin/env python3
"""Vergleichsarbeit-Training BGY Klasse 11 (Sachsen) - mehrstufige Zufallsexperimente
(Teil B, mit MMS).

    python3 tools/aufgaben/va/stochastik.py

Stochastics in Teil B of the Vergleichsarbeit 2022 to 2025 is always a multi-stage
experiment: three draws without replacement (all the same, exactly one) and three
independent trials with a fixed probability (all three, exactly one, at least one).
Lehrplan BGY Klasse 11, Lernbereich 1 adds the four-field table. Wording, numbers and
every figure are our own.
"""
import os
import sys
from fractions import Fraction as Fr
from itertools import permutations, product
from math import hypot

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# ---------------------------------------------------- Aufgabe 1: Losbude -------
P_GEWINN = Fr(1, 5)                          # "Jedes fuenfte Los gewinnt"

# ------------------------------------------------ Aufgabe 2: Gluehweintassen ---
TASSEN = {"Frauenkirche": 6, "Schwibbogen": 4, "Pyramide": 2}
N_TASSEN = sum(TASSEN.values())              # 12

# ------------------------------------------------------ Aufgabe 3: Mensa -------
N_UMFRAGE, N_M, N_MZ, N_Z = 400, 240, 180, 244
TAFEL = {("M", "Z"): N_MZ, ("M", "nZ"): N_M - N_MZ,
         ("nM", "Z"): N_Z - N_MZ, ("nM", "nZ"): N_UMFRAGE - N_M - (N_Z - N_MZ)}


# ----------------------------------------------------------------- figures ---
def _label_at(p, q, hw, hh, gap=5):
    """Centre for a branch label: off the middle of the branch along its normal, on the
    upper-left side of a rising branch and the lower-left side of a falling one, far
    enough that a box of half width hw and half height hh keeps clear of the line."""
    (x1, y1), (x2, y2) = p, q
    d = hypot(x2 - x1, y2 - y1) or 1.0
    ux, uy = (x2 - x1) / d, (y2 - y1) / d
    nx, ny = (uy, -ux) if uy < 0 else (-uy, ux)
    off = gap + abs(nx) * hw + abs(ny) * hh
    return ((x1 + x2) / 2.0 + nx * off, (y1 + y2) / 2.0 + ny * off)


def fig_baum3(branch, leaf, letters, label, hi=lambda path: False, size=13):
    """Three-stage tree with two outcomes per stage, all eight paths.

    branch(prefix, outcome) gives the text on a branch, leaf(path) the path probability
    at its end - both built from the same functions the check uses, so figure and
    solution cannot disagree. Branches of the paths with hi(path) true are drawn red,
    and so are their path probabilities."""
    W, step, top = 484, 35, 8      # narrow, so it stays legible on a 390 px phone
    d = S.Diagram(W, top + 8 * step + 8)
    xs = [16, 122, 228, 334]
    pos = {}
    for k in range(8):
        path = "".join(letters[(k >> (2 - i)) & 1] for i in range(3))
        pos[path] = (xs[3], top + step / 2.0 + step * k)
    for lvl in (2, 1, 0):
        for k in range(2 ** lvl):
            pre = "".join(letters[(k >> (lvl - 1 - i)) & 1] for i in range(lvl))
            pos[pre] = (xs[lvl], sum(pos[pre + c][1] for c in letters) / 2.0)
    red = set()
    for path in pos:
        if len(path) == 3 and hi(path):
            red.update(path[:i] for i in range(1, 4))
    for pre, (x, y) in sorted(pos.items(), key=lambda kv: len(kv[0])):
        if len(pre) == 3:
            continue
        for c in letters:
            q = pos[pre + c]
            on = (pre + c) in red
            dist = hypot(q[0] - x, q[1] - y)
            ux, uy = (q[0] - x) / dist, (q[1] - y) / dist
            d.line(x + ux * 6, y + uy * 6, q[0] - ux * 6, q[1] - uy * 6,
                   S.RED if on else S.MUTED, 2.0 if on else 1.2)
            text = branch(pre, c)
            cx, cy = _label_at((x, y), q, len(text) * size * 0.27, size * 0.42)
            d.text(cx, cy + size * 0.35, text, size, S.RED if on else S.BODY, tex=True)
    d.node(*pos[""], color=S.MUTED)
    for pre, (x, y) in pos.items():
        if 0 < len(pre) < 3:
            d.node(x, y, None, color=S.INK)
    d.text(xs[1] + 2, pos[letters[0]][1] - 11, letters[0], 13, S.INK, italic=True,
           halo=S.PAPER)
    d.text(xs[1] + 2, pos[letters[1]][1] + 21, letters[1], 13, S.INK, italic=True,
           halo=S.PAPER)
    for path, (x, y) in pos.items():
        if len(path) != 3:
            continue
        on = hi(path)
        d.node(x, y, None, color=S.RED if on else S.INK)
        d.text(x + 12, y + 5, " ".join(path), 13, S.INK, "start", italic=True)
        d.text(W - 8, y + 5, leaf(path), size, S.RED if on else S.BODY, "end", tex=True)
    return d.svg(label)


def _overline(d, x, y, ch, size=15, color=S.INK, bar=False):
    """A capital in italic serif, with a bar over it for the complementary event."""
    d.text(x, y, ch, size, color, italic=True)
    if bar:
        d.line(x - size * 0.32 + 1.5, y - size * 0.86, x + size * 0.32 + 1.5,
               y - size * 0.86, color, 1.2, cap="butt")


def fig_tafel(full=False):
    """Four-field table of the survey. Task: the four given numbers. Solution: all nine,
    the computed ones in red."""
    cw, ch = [96, 92, 92, 92], 36
    x0, y0 = 14, 10
    d = S.Diagram(x0 * 2 + sum(cw), y0 * 2 + 4 * ch)
    rows, cols = ["", "M", "nM", "ges"], ["", "Z", "nZ", "ges"]
    xs = [x0 + sum(cw[:i]) for i in range(5)]
    tot = {("M", "ges"): N_M, ("nM", "ges"): N_UMFRAGE - N_M, ("ges", "Z"): N_Z,
           ("ges", "nZ"): N_UMFRAGE - N_Z, ("ges", "ges"): N_UMFRAGE}
    given = {("M", "Z"), ("M", "ges"), ("ges", "Z"), ("ges", "ges")}
    for r in range(4):
        for c in range(4):
            head = r == 0 or c == 0
            d.rect(xs[c], y0 + r * ch, cw[c], ch, fill="#EEF2F8" if head else S.PAPER,
                   stroke=S.INK, width=1.0)
    mid = lambda c: (xs[c] + xs[c + 1]) / 2.0
    for c in (1, 2):
        _overline(d, mid(c), y0 + ch / 2.0 + 5, "Z", bar=(cols[c] == "nZ"))
    for r in (1, 2):
        _overline(d, mid(0), y0 + r * ch + ch / 2.0 + 5, "M", bar=(rows[r] == "nM"))
    d.text(mid(3), y0 + ch / 2.0 + 5, "gesamt", 13, S.INK)
    d.text(mid(0), y0 + 3 * ch + ch / 2.0 + 5, "gesamt", 13, S.INK)
    for r in (1, 2, 3):
        for c in (1, 2, 3):
            key = (rows[r], cols[c])
            val = TAFEL.get(key, tot.get(key))
            if key in given or full:
                d.text(mid(c), y0 + r * ch + ch / 2.0 + 5, str(val), 15,
                       S.BODY if key in given else S.RED, tex=True)
    return d.svg("Vierfeldertafel mit den Merkmalen M (isst regelmaessig in der Mensa) und "
                 "Z (ist zufrieden)" + ("; vollstaendig: 180, 60, 240; 64, 96, 160; "
                                        "244, 156, 400" if full else
                                        "; gegeben sind 180, 240, 244 und 400"))


def p_los(prefix, outcome):
    return P_GEWINN if outcome == "G" else 1 - P_GEWINN


def p_tasse(prefix, outcome):
    """(count, total) for one draw, F = Frauenkirche, A = anderes Motiv - kept as a pair,
    because the tree shows the fractions unreduced: the falling totals 12, 11, 10 are
    the whole point of drawing without replacement."""
    f_left = TASSEN["Frauenkirche"] - prefix.count("F")
    left = N_TASSEN - len(prefix)
    return (f_left, left) if outcome == "F" else (left - f_left, left)


def path_prob(prob, path):
    pr = Fr(1)
    for i in range(len(path)):
        v = prob(path[:i], path[i])
        pr *= Fr(*v) if isinstance(v, tuple) else v
    return pr


def fixed(fr, places):
    """Fixed-point text with a decimal point - the figure swaps it for a comma."""
    return ("%." + str(places) + "f") % float(fr)


def fig_lose():
    return fig_baum3(lambda pre, c: fixed(p_los(pre, c), 1).replace(".", ","),
                     lambda path: fixed(path_prob(p_los, path), 3).replace(".", ","),
                     "GN",
                     "Baumdiagramm fuer drei Lose mit G fuer Gewinn (0,2) und N fuer Niete "
                     "(0,8); die drei Pfade mit genau einem Gewinn sind rot",
                     hi=lambda path: path.count("G") == 1)


def tassen_zaehler(path):
    """Numerator of a path probability over 12 * 11 * 10 = 1320, unreduced."""
    z = 1
    for i in range(3):
        z *= p_tasse(path[:i], path[i])[0]
    return z


def fig_tassen():
    return fig_baum3(lambda pre, c: "%d/%d" % p_tasse(pre, c),
                     lambda path: "%d/1320" % tassen_zaehler(path),
                     "FA",
                     "Baumdiagramm fuer drei Tassen ohne Zuruecklegen, F fuer Frauenkirche, "
                     "A fuer ein anderes Motiv; die drei Pfade mit genau einem F sind rot",
                     hi=lambda path: path.count("F") == 1)


# ------------------------------------------------------------------- sheet ---
s = Sheet("va-bgy11-stochastik", "Mehrstufige Zufallsexperimente",
          kind="Vergleichsarbeit-Training",
          suffix="",
          klasse="Berufliches Gymnasium · Klasse 11",
          sub="Berufliches Gymnasium · Klasse 11 · Vergleichsarbeit Mathematik · Teil B, mit "
              "MMS und Formelsammlung · drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Vergleichsarbeit-Training Mathematik Berufliches Gymnasium Klasse 11, Teil B: "
               "drei Lose an der Losbude des Striezelmarkts, Glühweintassen ohne Zurücklegen "
               "mit Baumdiagramm und eine Mensa-Umfrage in der Vierfeldertafel, mit Lösungen "
               "und Abbildungen.",
          plan=("../svp/mathe/vergleichsarbeit.html", "Zur Übersicht"))

s.task(
    "Drei Lose an der Losbude", 1,
    r"Eine Losbude auf dem Dresdner Striezelmarkt wirbt mit dem Spruch „Jedes fünfte Los "
    r"gewinnt!“. In der Lostrommel liegen so viele Lose, dass für jedes gezogene Los mit "
    r"der Gewinnwahrscheinlichkeit $0{,}2$ gerechnet werden kann, unabhängig von den "
    r"anderen Losen. Tom kauft drei Lose.",
    [
        r"Berechnen Sie die Wahrscheinlichkeit dafür, dass alle drei Lose Nieten sind.",
        r"Berechnen Sie die Wahrscheinlichkeit dafür, dass Tom mindestens einen Gewinn hat.",
        r"Berechnen Sie die Wahrscheinlichkeit dafür, dass Tom genau einen Gewinn hat.",
        r"Toms Schwester meint: „Wenn ich fünf Lose kaufe, gewinne ich sicher, denn "
        r"$5 \cdot 0{,}2 = 1$.“ Beurteilen Sie diese Aussage.",
    ],
    [
        r"Bei jedem Los ist eine Niete mit $0{,}8$ wahrscheinlich. Nach der Pfadregel ist "
        r"$P = 0{,}8^3 = 0{,}512$, also gut $51\ \%$.",

        r"„Mindestens ein Gewinn“ ist das Gegenereignis von „drei Nieten“: "
        r"$P = 1 - 0{,}8^3 = 1 - 0{,}512 = 0{,}488$.",

        r"Es gibt drei Pfade mit genau einem Gewinn (G N N, N G N und N N G), jeder mit der "
        r"Wahrscheinlichkeit $0{,}2 \cdot 0{,}8^2 = 0{,}128$. Also "
        r"$P = 3 \cdot 0{,}2 \cdot 0{,}8^2 = 0{,}384$.",

        r"Die Aussage ist falsch. Auch bei fünf Losen können alle fünf Nieten sein, und zwar "
        r"mit der Wahrscheinlichkeit $0{,}8^5 \approx 0{,}328$. Mindestens ein Gewinn hat "
        r"also nur die Wahrscheinlichkeit $1 - 0{,}8^5 \approx 0{,}672$, rund zwei Drittel. "
        r"Das Produkt $5 \cdot 0{,}2 = 1$ gibt an, wie viele Gewinne man bei fünf Losen "
        r"**im Mittel** erwarten kann, und ist keine Garantie.",
    ],
    falle=r"Bei b) ist $3 \cdot 0{,}2 = 0{,}6$ **falsch**: Beim Addieren werden die Pfade mit "
          r"zwei oder drei Gewinnen mehrfach gezählt. Das Gegenereignis „keinmal Gewinn“ ist "
          r"der kürzeste Weg.",
    solfigs=[(fig_lose(), "Zu a) bis c): Das Baumdiagramm mit allen acht Pfaden, rechts die "
                          "Pfadwahrscheinlichkeiten. Rot sind die drei Pfade mit genau einem "
                          "Gewinn.")],
)

s.task(
    "Glühweintassen ohne Zurücklegen", 2,
    r"An einem Glühweinstand auf dem Striezelmarkt stehen in einer Kiste noch $12$ Tassen: "
    r"$6$ mit dem Motiv Frauenkirche, $4$ mit einem Schwibbogen und $2$ mit einer Pyramide. "
    r"Eine Mitarbeiterin nimmt nacheinander zufällig drei Tassen heraus, ohne eine davon "
    r"zurückzustellen.",
    [
        r"Berechnen Sie die Wahrscheinlichkeit dafür, dass alle drei Tassen das Motiv "
        r"Frauenkirche zeigen.",
        r"Berechnen Sie die Wahrscheinlichkeit dafür, dass alle drei Tassen dasselbe Motiv "
        r"zeigen.",
        r"Berechnen Sie die Wahrscheinlichkeit dafür, dass genau eine der drei Tassen das "
        r"Motiv Frauenkirche zeigt.",
        r"Berechnen Sie die Wahrscheinlichkeit dafür, dass alle drei Motive vertreten sind.",
    ],
    [
        r"$P = \frac{6}{12} \cdot \frac{5}{11} \cdot \frac{4}{10} = \frac{120}{1320} = "
        r"\frac{1}{11} \approx 0{,}091$. Nach jeder Frauenkirchen-Tasse gibt es eine solche "
        r"Tasse und eine Tasse insgesamt weniger.",

        r"Drei Frauenkirchen wie in a), drei Schwibbögen mit "
        r"$\frac{4}{12} \cdot \frac{3}{11} \cdot \frac{2}{10} = \frac{24}{1320}$. Drei "
        r"Pyramiden sind unmöglich, weil nur zwei in der Kiste stehen. Zusammen: "
        r"$P = \frac{120 + 24}{1320} = \frac{144}{1320} = \frac{6}{55} \approx 0{,}109$.",

        r"Mit $F$ für Frauenkirche und $A$ für ein anderes Motiv gibt es drei Pfade mit "
        r"genau einem $F$ (siehe Baumdiagramm). Jeder hat die Wahrscheinlichkeit "
        r"$\frac{180}{1320}$, zum Beispiel $FAA$ mit "
        r"$\frac{6}{12} \cdot \frac{6}{11} \cdot \frac{5}{10}$. Also "
        r"$P = 3 \cdot \frac{180}{1320} = \frac{540}{1320} = \frac{9}{22} \approx 0{,}409$.",

        r"Ein Pfad mit drei verschiedenen Motiven, etwa Frauenkirche, Schwibbogen, Pyramide, "
        r"hat die Wahrscheinlichkeit $\frac{6}{12} \cdot \frac{4}{11} \cdot \frac{2}{10} = "
        r"\frac{48}{1320}$. Die drei Motive können in $3 \cdot 2 \cdot 1 = 6$ Reihenfolgen "
        r"kommen, und jede Reihenfolge hat dieselben Faktoren im Zähler und im Nenner: "
        r"$P = 6 \cdot \frac{48}{1320} = \frac{288}{1320} = \frac{12}{55} \approx 0{,}218$.",
    ],
    falle=r"Ohne Zurücklegen ändern sich Zähler **und** Nenner von Zug zu Zug. Wer bei a) mit "
          r"Zurücklegen rechnet, erhält $\left(\frac{1}{2}\right)^3 = 0{,}125$ statt "
          r"$0{,}091$. Bei c) und d) fehlt am häufigsten der Faktor für die Reihenfolgen, "
          r"$3$ beziehungsweise $6$.",
    solfigs=[(fig_tassen(), "Zu c): F steht für Frauenkirche, A für ein anderes Motiv. "
                            "Die Brüche sind ungekürzt, damit man die Nenner 12, 11 und 10 "
                            "sieht. Rot sind die drei Pfade mit genau einem F.")],
)

s.task(
    "Die Mensa-Umfrage", 3,
    r"An einer Schule wurden $400$ Schülerinnen und Schüler zur Mensa befragt. Das "
    r"Merkmal $M$ bedeutet „isst regelmäßig in der Mensa“, das Merkmal $Z$ „ist mit dem "
    r"Essen zufrieden“. $240$ der Befragten essen regelmäßig in der Mensa, von diesen "
    r"sind $180$ zufrieden. Insgesamt sind $244$ der Befragten zufrieden.",
    [
        r"Vervollständigen Sie die Vierfeldertafel.",
        r"Aus den Befragten wird eine Person zufällig ausgewählt. Berechnen Sie die "
        r"Wahrscheinlichkeit dafür, dass sie regelmäßig in der Mensa isst oder zufrieden "
        r"ist.",
        r"Geben Sie die Bedeutung der Terme $\frac{180}{240}$ und $\frac{180}{244}$ im "
        r"Sachzusammenhang an. Die Schülervertretung schreibt: „$75\ \%$ der Zufriedenen "
        r"essen regelmäßig in der Mensa.“ Beurteilen Sie diese Aussage.",
        r"Für ein Interview werden drei der $400$ Befragten zufällig ausgewählt. Berechnen "
        r"Sie die Wahrscheinlichkeit dafür, dass alle drei unzufrieden sind, und begründen "
        r"Sie, dass man hier näherungsweise auch mit $0{,}39^3$ rechnen darf.",
    ],
    [
        r"Zeile $M$: $240 - 180 = 60$ Unzufriedene. Spalte $Z$: $244 - 180 = 64$ Zufriedene, "
        r"die nicht regelmäßig in der Mensa essen. Zeile $\overline{M}$: "
        r"$400 - 240 = 160$, davon $160 - 64 = 96$ unzufrieden. Spalte $\overline{Z}$: "
        r"$400 - 244 = 156$; Probe: $60 + 96 = 156$.",

        r"Zu „$M$ oder $Z$“ gehören alle außer den $96$ Personen, die weder regelmäßig in "
        r"der Mensa essen noch zufrieden sind: $P = \frac{400 - 96}{400} = \frac{304}{400} = "
        r"0{,}76$. Zweiter Weg: $\frac{240 + 244 - 180}{400} = 0{,}76$; die $180$ Personen "
        r"mit beiden Merkmalen würden sonst doppelt gezählt.",

        r"$\frac{180}{240} = 0{,}75$ ist der Anteil der Zufriedenen **unter denen, die "
        r"regelmäßig in der Mensa essen**. $\frac{180}{244} \approx 0{,}738$ ist der Anteil "
        r"der regelmäßigen Mensa-Esser **unter den Zufriedenen**. Die Aussage der "
        r"Schülervertretung verwechselt die Bezugsgruppen. Richtig wäre: „$75\ \%$ der "
        r"regelmäßigen Mensa-Esser sind zufrieden“ oder „etwa $74\ \%$ der Zufriedenen "
        r"essen regelmäßig in der Mensa“.",

        r"Unzufrieden sind $156$ Personen. Ohne Zurücklegen: "
        r"$P = \frac{156}{400} \cdot \frac{155}{399} \cdot \frac{154}{398} \approx "
        r"0{,}0586$. Mit dem festen Anteil $\frac{156}{400} = 0{,}39$ bei jeder Auswahl "
        r"ergäbe sich $0{,}39^3 \approx 0{,}0593$. Drei Personen sind gegenüber $400$ so "
        r"wenige, dass sich der Anteil von Zug zu Zug kaum ändert "
        r"($\frac{155}{399} \approx 0{,}388$ und $\frac{154}{398} \approx 0{,}387$); die "
        r"Näherung weicht nur um etwa $0{,}0007$ ab.",
    ],
    falle=r"Bei c) entscheidet, **worauf** sich der Anteil bezieht: Im Nenner steht die "
          r"Gruppe, unter der gezählt wird. $\frac{180}{240}$ und $\frac{180}{244}$ haben "
          r"denselben Zähler, aber verschiedene Bezugsgruppen.",
    figs=[(fig_tafel(), "Die Vierfeldertafel mit den gegebenen Werten. M: isst regelmäßig "
                        "in der Mensa, Z: ist mit dem Essen zufrieden; der Strich darüber "
                        "steht für das Gegenteil.")],
    solfigs=[(fig_tafel(full=True), "Zu a): Die vollständige Vierfeldertafel, die "
                                    "berechneten Werte rot.")],
)


def check():
    """Every number in the solutions, recomputed - exact with Fractions."""
    # --- Aufgabe 1 -------------------------------------------------------------------
    p, q = P_GEWINN, 1 - P_GEWINN
    assert q == Fr(4, 5)
    pfade = {"".join(w): path_prob(p_los, "".join(w)) for w in product("GN", repeat=3)}
    assert sum(pfade.values()) == 1
    nieten = pfade["NNN"]
    assert nieten == q ** 3 == Fr(512, 1000) and fixed(nieten, 3) == "0.512"
    mind = sum(v for k, v in pfade.items() if "G" in k)
    assert mind == 1 - q ** 3 == Fr(488, 1000)
    genau = sum(v for k, v in pfade.items() if k.count("G") == 1)
    assert [k for k in pfade if k.count("G") == 1] == ["GNN", "NGN", "NNG"]
    assert p * q ** 2 == Fr(128, 1000) and genau == 3 * p * q ** 2 == Fr(384, 1000)
    # the leaf labels of the figure
    assert sorted(fixed(v, 3) for v in pfade.values()) == \
        ["0.008", "0.032", "0.032", "0.032", "0.128", "0.128", "0.128", "0.512"]
    assert all(Fr(fixed(v, 3)) == v for v in pfade.values())   # three places are exact
    fuenf = [path_prob(p_los, "".join(w)) for w in product("GN", repeat=5) if "G" not in w]
    assert fuenf == [q ** 5] and round(float(q ** 5), 3) == 0.328
    assert round(float(1 - q ** 5), 3) == 0.672 and 5 * p == 1
    assert 3 * p == Fr(6, 10) != mind                          # die Falle
    # --- Aufgabe 2 -------------------------------------------------------------------
    kiste = [m for m, n in TASSEN.items() for _ in range(n)]
    assert N_TASSEN == 12 and len(kiste) == 12
    zuege = list(permutations(range(12), 3))
    assert len(zuege) == 12 * 11 * 10 == 1320
    count = lambda pred: Fr(sum(1 for z in zuege if pred([kiste[i] for i in z])), 1320)
    fff = count(lambda w: w == ["Frauenkirche"] * 3)
    assert fff == Fr(6 * 5 * 4, 1320) == Fr(120, 1320) == Fr(1, 11)
    assert round(float(fff), 3) == 0.091
    assert count(lambda w: w == ["Schwibbogen"] * 3) == Fr(4 * 3 * 2, 1320) == Fr(24, 1320)
    assert count(lambda w: w == ["Pyramide"] * 3) == 0
    gleich = count(lambda w: len(set(w)) == 1)
    assert gleich == Fr(144, 1320) == Fr(6, 55) and round(float(gleich), 3) == 0.109
    eine_f = count(lambda w: w.count("Frauenkirche") == 1)
    assert eine_f == Fr(540, 1320) == Fr(9, 22) and round(float(eine_f), 3) == 0.409
    assert 6 * 6 * 5 == 180 and 3 * 180 == 540
    # the tree: three paths with one F, 180/1320 each, all eight add up to 1320
    zaehler = {"".join(w): tassen_zaehler("".join(w)) for w in product("FA", repeat=3)}
    assert sum(zaehler.values()) == 1320
    assert [zaehler[k] for k in ("FAA", "AFA", "AAF")] == [180, 180, 180]
    assert zaehler["FFF"] == 120
    for k, z in zaehler.items():
        assert path_prob(p_tasse, k) == Fr(z, 1320)
        assert count(lambda w, k=k: all((m == "Frauenkirche") == (c == "F")
                                        for m, c in zip(w, k))) == Fr(z, 1320)
    alle = count(lambda w: len(set(w)) == 3)
    assert 6 * 4 * 2 == 48 and 6 * 48 == 288
    assert alle == Fr(288, 1320) == Fr(12, 55) and round(float(alle), 3) == 0.218
    assert Fr(1, 2) ** 3 == Fr(125, 1000)                      # die Falle, mit Zuruecklegen
    # --- Aufgabe 3 -------------------------------------------------------------------
    assert TAFEL == {("M", "Z"): 180, ("M", "nZ"): 60, ("nM", "Z"): 64, ("nM", "nZ"): 96}
    assert sum(TAFEL.values()) == N_UMFRAGE
    assert TAFEL["M", "Z"] + TAFEL["M", "nZ"] == N_M == 240
    assert TAFEL["M", "Z"] + TAFEL["nM", "Z"] == N_Z == 244
    assert N_UMFRAGE - N_M == 160 and 160 - 64 == 96
    nz = TAFEL["M", "nZ"] + TAFEL["nM", "nZ"]
    assert nz == N_UMFRAGE - N_Z == 156
    oder = Fr(N_UMFRAGE - TAFEL["nM", "nZ"], N_UMFRAGE)
    assert oder == Fr(304, 400) == Fr(76, 100) == Fr(N_M + N_Z - N_MZ, N_UMFRAGE)
    assert Fr(180, 240) == Fr(3, 4) and round(180 / 244, 3) == 0.738
    assert round(180 / 244 * 100) == 74
    assert Fr(156, 400) == Fr(39, 100)
    exakt = Fr(156, 400) * Fr(155, 399) * Fr(154, 398)
    assert round(float(exakt), 4) == 0.0586 and round(0.39 ** 3, 4) == 0.0593
    assert round(155 / 399, 3) == 0.388 and round(154 / 398, 3) == 0.387
    assert round(0.39 ** 3 - float(exakt), 4) == 0.0007


s.verify(check)
s.save()
