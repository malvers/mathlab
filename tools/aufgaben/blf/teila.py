#!/usr/bin/env python3
"""BLF-Training Gymnasium Klasse 10 - Teil A, ohne Hilfsmittel (Satz 1).

    python3 tools/aufgaben/blf/teila.py

Teil A of the Sachsen Besondere Leistungsfeststellung: 25 minutes, 15 BE, no calculator
and no formula book, only drawing tools. Six Ankreuzaufgaben with five options each,
then two short tasks. Task types follow the originals 2022/23 to 2024/25 (units,
percentages, powers, properties of functions, a line and the triangle it cuts off,
a Gluecksrad); wording, numbers and every figure are our own.
"""
import os
import sys
from fractions import Fraction as Fr
from math import pi, sqrt

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# ------------------------------------------------------ Aufgabe 2: die Gerade --
GP, GQ = (-2, 5), (4, 2)                   # two points of g


def g(x):
    return Fr(-1, 2) * x + 4


G_ZERO, G_YINT = 8, 4                      # g cuts the axes at (8|0) and (0|4)

# ---------------------------------------------------- Aufgabe 3: Gluecksrad ----
RAD = [("rot", 180, S.RED), ("blau", 120, S.BODY), ("gelb", 60, S.ORANGE)]
P = {name: Fr(ang, 360) for name, ang, _ in RAD}


# ----------------------------------------------------------------- figures ---
def fig_gerade():
    p = S.Plot((-3.2, 9.4), (-1.2, 6.4), w=520, h=330, pad=(40, 22, 18, 34))
    p.grid(1, 1)
    p.axes(1, 1, defer_labels=True)
    tri = [p.P(0, 0), p.P(G_ZERO, 0), p.P(0, G_YINT)]
    p.poly(tri, stroke="none", width=0, fill=S.ORANGE, opacity=0.35)
    p.curve(lambda x: -0.5 * x + 4, -3.2, 9.4, S.RED, 2.1)
    p.draw_labels()
    p.point(*GP, label="P", pos="above-right", color=S.INK)
    p.point(*GQ, label="Q", pos="above-right", color=S.INK)
    p.text(p.X(6.2), p.Y(1.45), "g", 15, S.RED, "start", italic=True, halo=S.PAPER)
    return p.svg("Koordinatensystem mit der fallenden Geraden g durch P und Q; die Gerade "
                 "schliesst mit den beiden Achsen ein Dreieck ein")


def fig_kegel():
    """The cone that the triangle sweeps out around the y-axis, in a simple sketch."""
    c = S.Canvas(420, 250)
    cx, base, rx, ry, top = 210, 200, 150, 30, 60
    c.raw('<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="%s" opacity="0.25"/>'
          % (cx, base, rx, ry, S.ORANGE))
    # front half of the base solid, back half dashed
    c.path("M %d %d A %d %d 0 0 0 %d %d" % (cx - rx, base, rx, ry, cx + rx, base),
           stroke=S.INK, width=1.5)
    c.path("M %d %d A %d %d 0 0 1 %d %d" % (cx - rx, base, rx, ry, cx + rx, base),
           stroke=S.MUTED, width=1.2, dash="5 4")
    c.line(cx - rx, base, cx, top, S.INK, 1.5)
    c.line(cx + rx, base, cx, top, S.INK, 1.5)
    c.line(cx, base, cx, top, S.MUTED, 1.2, dash="4 3")
    c.line(cx, base, cx + rx, base, S.RED, 1.8)
    c.arrow(cx, base + 34, cx, top - 34, S.INK, 1.2)
    c.text(cx + 8, top - 30, "y", 14, S.INK, "start", italic=True)
    c.text(cx + rx / 2.0, base - 8, "r = 8", 13, S.RED, halo=S.PAPER)
    c.text(cx - 8, (base + top) / 2.0 + 4, "h = 4", 13, S.INK, "end", halo=S.PAPER)
    return c.svg("Kegel mit Radius 8 und Hoehe 4, der entsteht, wenn das Dreieck um die "
                 "y-Achse rotiert")


def fig_rad():
    c = S.Canvas(470, 280)
    cx, cy, r = 128, 146, 106
    a = 0.0
    for name, ang, col in RAD:
        c.sector(cx, cy, r, a, a + ang, fill=col, label=name, lcolor=S.INK, lsize=13)
        a += ang
    c.circle(cx, cy, r, "none", S.INK, 1.5)
    c.poly([(cx - 9, cy - r - 17), (cx + 9, cy - r - 17), (cx, cy - r + 7)],
           stroke=S.INK, width=1.2, fill=S.INK)
    c.legend(262, 112, [("%s: %d Grad" % (name, ang), col, "fill") for name, ang, col in RAD])
    return c.svg("Gluecksrad mit einem roten Sektor von 180 Grad, einem blauen von 120 Grad "
                 "und einem gelben von 60 Grad")


# ------------------------------------------------------------------- sheet ---
s = Sheet("blf-gy-teila", "Teil A — ohne Hilfsmittel (Satz 1)",
          kind="BLF-Training",
          suffix="",
          klasse="Gymnasium · Klasse 10",
          sub="Gymnasium · Klasse 10 · Besondere Leistungsfeststellung Mathematik · Teil A · "
              "25 Minuten, nur Zeichengeräte · drei Aufgaben, Anforderungsbereiche I bis III",
          desc="BLF-Training Mathematik Gymnasium Klasse 10, Teil A ohne Hilfsmittel: "
               "Ankreuzaufgaben zu Potenzen, Einheiten, Prozent und Funktionen, eine Gerade "
               "mit Rotationskörper und ein Glücksrad, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/blf.html", "Zur Übersicht"))

s.task(
    "Viermal ankreuzen", 1,
    r"Bei jeder Teilaufgabe ist genau **eine** der fünf Antworten richtig. Notieren Sie "
    r"nur den Buchstaben; ein Lösungsweg wird nicht verlangt. Taschenrechner und "
    r"Formelsammlung sind nicht zugelassen.",
    [
        r"Der Term $\dfrac{a^{5} \cdot a^{-2}}{a^{4}}$ mit $a \neq 0$ ist äquivalent zu: • "
        r"(A) $a^{3}$ • (B) $\frac{1}{a}$ • (C) $a$ • (D) $a^{-14}$ • (E) $\frac{1}{a^{3}}$",

        r"Ein Volumen von $0{,}35\ \mathrm{m}^3$ sind: • (A) $35\ \mathrm{dm}^3$ • "
        r"(B) $3500\ \mathrm{cm}^3$ • (C) $350\ \ell$ • (D) $35\ \mathrm{hl}$ • "
        r"(E) $0{,}35\ \ell$",

        r"Ein Preis wird zuerst um $10\ \%$ erhöht und danach um $10\ \%$ gesenkt. "
        r"Verglichen mit dem ursprünglichen Preis gilt dann: • (A) Er ist gleich geblieben. • "
        r"(B) Er ist um $1\ \%$ gesunken. • (C) Er ist um $1\ \%$ gestiegen. • "
        r"(D) Er ist um $0{,}1\ \%$ gesunken. • (E) Er ist um $10\ \%$ gesunken.",

        r"Welche in $\mathbb{R}$ definierte Funktion $f$ hat einen Graphen, der die "
        r"$y$-Achse im Punkt $(0 \mid 3)$ schneidet und im gesamten Definitionsbereich "
        r"monoton fallend ist? • (A) $f(x) = 3x$ • (B) $f(x) = -x + 3$ • "
        r"(C) $f(x) = x^2 + 3$ • (D) $f(x) = 3 \cdot 2^{x}$ • (E) $f(x) = -3x$",
    ],
    [
        r"Richtig ist **(B)**. Im Zähler werden die Exponenten addiert: "
        r"$a^{5} \cdot a^{-2} = a^{3}$. Beim Dividieren wird subtrahiert: "
        r"$a^{3} : a^{4} = a^{-1} = \frac{1}{a}$. (A) ist nur der Zähler, (D) entsteht, "
        r"wenn man $5 \cdot (-2)$ rechnet statt $5 + (-2)$, und (C) und (E) haben das "
        r"Vorzeichen beziehungsweise die Größe des Exponenten verloren. "
        r"Probe mit $a = 2$: $\frac{32 \cdot \frac{1}{4}}{16} = \frac{8}{16} = \frac{1}{2}$.",

        r"Richtig ist **(C)**. Ein Kubikmeter hat $1000$ Kubikdezimeter, und ein "
        r"Kubikdezimeter ist ein Liter. Also $0{,}35\ \mathrm{m}^3 = 350\ \mathrm{dm}^3 = "
        r"350\ \ell$. (A) rechnet mit dem Faktor $100$ wie bei Flächen, (B) ist nur "
        r"$3{,}5\ \ell$, (D) sind $3500\ \ell$ und (E) ist tausendmal zu klein. "
        r"Mit Hektolitern wäre $3{,}5\ \mathrm{hl}$ richtig gewesen.",

        r"Richtig ist **(B)**. Beide Änderungen sind Faktoren: "
        r"$1{,}1 \cdot 0{,}9 = 0{,}99$. Der Endpreis ist $99\ \%$ des Anfangspreises, also "
        r"um $1\ \%$ niedriger. Die $10\ \%$ Abschlag beziehen sich auf den **erhöhten** "
        r"Preis und sind deshalb mehr als der Aufschlag. Beispiel: "
        r"100 € → 110 € → 99 €.",

        r"Richtig ist **(B)**. Der Graph von $f(x) = -x + 3$ ist eine Gerade mit dem "
        r"Anstieg $-1$ (fallend) und dem $y$-Achsenabschnitt $3$. (D) schneidet die "
        r"$y$-Achse zwar auch bei $3$, denn $3 \cdot 2^{0} = 3$, ist aber monoton steigend. "
        r"(C) hat bei $(0 \mid 3)$ seinen Scheitel und fällt nur für $x < 0$. (A) und (E) "
        r"gehen durch den Ursprung.",
    ],
    falle=r"Bei c) ist die Versuchung groß, $+10\ \%$ und $-10\ \%$ zu null zu addieren. "
          r"Prozentsätze beziehen sich aber immer auf den jeweils aktuellen Grundwert, "
          r"deshalb werden sie als **Faktoren** multipliziert, nicht addiert.",
)

s.task(
    "Eine Gerade und ihr Kegel", 2,
    r"Die Abbildung zeigt den Graphen der linearen Funktion $g$, der durch die Punkte "
    r"$P(-2 \mid 5)$ und $Q(4 \mid 2)$ verläuft. Die Aufgabe ist ohne Taschenrechner zu "
    r"lösen; Wurzeln und $\pi$ dürfen im Ergebnis stehen bleiben.",
    [
        r"Geben Sie eine Gleichung der Funktion $g$ an.",
        r"Berechnen Sie die Stelle, an der $g$ den Funktionswert $-46$ annimmt.",
        r"Der Graph von $g$ und die beiden Koordinatenachsen begrenzen ein Dreieck. "
        r"Berechnen Sie die Länge der Seite dieses Dreiecks, die auf dem Graphen von $g$ "
        r"liegt.",
        r"Das Dreieck rotiert um die $y$-Achse. Begründen Sie ohne Taschenrechner, dass das "
        r"Volumen des entstehenden Körpers größer als $250$ Volumeneinheiten ist.",
    ],
    [
        r"Anstieg aus den beiden Punkten: $m = \frac{2 - 5}{4 - (-2)} = \frac{-3}{6} = "
        r"-\frac{1}{2}$. Einsetzen von $Q$ in $y = -\frac{1}{2}x + n$: "
        r"$2 = -2 + n$, also $n = 4$. Damit ist $g(x) = -\frac{1}{2}x + 4$. "
        r"Probe mit $P$: $-\frac{1}{2} \cdot (-2) + 4 = 1 + 4 = 5$.",

        r"$-\frac{1}{2}x + 4 = -46$ ergibt $-\frac{1}{2}x = -50$ und damit $x = 100$. "
        r"An der Stelle $100$ hat $g$ den Funktionswert $-46$.",

        r"Die Gerade schneidet die $y$-Achse bei $(0 \mid 4)$, die $x$-Achse dort, wo "
        r"$-\frac{1}{2}x + 4 = 0$ ist, also bei $(8 \mid 0)$. Die gesuchte Seite ist die "
        r"Hypotenuse des rechtwinkligen Dreiecks mit den Katheten $8$ und $4$: "
        r"$\sqrt{8^2 + 4^2} = \sqrt{80} = \sqrt{16 \cdot 5} = 4\sqrt{5}$. "
        r"Wegen $\sqrt{5} \approx 2{,}24$ sind das etwa $9$ Längeneinheiten.",

        r"Bei der Drehung um die $y$-Achse entsteht ein **Kegel** mit dem Radius $r = 8$ "
        r"(Abschnitt auf der $x$-Achse) und der Höhe $h = 4$. "
        r"$V = \frac{1}{3}\pi r^2 h = \frac{1}{3} \cdot \pi \cdot 64 \cdot 4 = "
        r"\frac{256}{3}\pi$. Wegen $\pi > 3$ gilt $V > \frac{256}{3} \cdot 3 = 256 > 250$. "
        r"Das Volumen ist also größer als $250$ Volumeneinheiten.",
    ],
    falle=r"Bei d) kommt es auf die Drehachse an. Um die $y$-Achse wird die $8$ zum "
          r"Radius; um die $x$-Achse wäre es umgekehrt, Radius $4$ und Höhe $8$, mit nur "
          r"$\frac{128}{3}\pi$. Und für die Begründung genügt die grobe Abschätzung "
          r"$\pi > 3$, gerechnet werden muss $\pi$ gar nicht.",
    figs=[(fig_gerade(),
           "Der Graph von g mit den Punkten P und Q. Das Dreieck zwischen g und den "
           "Achsen ist orange hinterlegt.")],
    solfigs=[(fig_kegel(),
              "Zu d): Die Kathete auf der x-Achse wird zum Radius, die auf der y-Achse zur "
              "Höhe des Kegels.")],
)

s.task(
    "Das Glücksrad mit drei Farben", 3,
    r"Ein Glücksrad besteht aus drei Sektoren: Der rote hat einen Mittelpunktswinkel von "
    r"$180°$, der blaue von $120°$ und der gelbe von $60°$. Ein Zufallsversuch besteht aus "
    r"dem Drehen des Rades und dem Feststellen der Farbe, auf die der Zeiger zeigt.",
    [
        r"Begründen Sie, dass das einmalige Drehen kein Laplace-Versuch ist.",
        r"Das Rad wird zweimal gedreht. Berechnen Sie die Wahrscheinlichkeit dafür, dass "
        r"beide Male dieselbe Farbe erscheint.",
        r"Das Rad wird dreimal gedreht. Berechnen Sie die Wahrscheinlichkeit dafür, dass "
        r"mindestens einmal Gelb erscheint.",
        r"Das Rad wird dreimal gedreht. Geben Sie ein Ereignis an, dessen Wahrscheinlichkeit "
        r"mit dem Term $3 \cdot \frac{1}{3} \cdot \left(\frac{2}{3}\right)^{2}$ berechnet "
        r"werden kann.",
    ],
    [
        r"Bei einem Laplace-Versuch sind alle Ergebnisse gleich wahrscheinlich. Hier sind "
        r"die Sektoren verschieden groß: $P(\text{rot}) = \frac{180}{360} = \frac{1}{2}$, "
        r"$P(\text{blau}) = \frac{120}{360} = \frac{1}{3}$ und "
        r"$P(\text{gelb}) = \frac{60}{360} = \frac{1}{6}$. Die drei Farben sind also nicht "
        r"gleich wahrscheinlich.",

        r"Dreimal ein Pfad mit zwei gleichen Farben: "
        r"$P = \left(\frac{1}{2}\right)^2 + \left(\frac{1}{3}\right)^2 + "
        r"\left(\frac{1}{6}\right)^2 = \frac{9}{36} + \frac{4}{36} + \frac{1}{36} = "
        r"\frac{14}{36} = \frac{7}{18}$. Das sind knapp $39\ \%$.",

        r"Über das Gegenereignis „keinmal Gelb“: "
        r"$P = 1 - \left(\frac{5}{6}\right)^3 = 1 - \frac{125}{216} = \frac{91}{216}$. "
        r"Das sind etwa $42\ \%$. Ohne Rechner genügt der Bruch.",

        r"$\frac{1}{3}$ ist die Wahrscheinlichkeit für Blau, $\frac{2}{3}$ die für "
        r"„nicht Blau“. Ein Pfad mit einmal Blau und zweimal etwas anderem hat die "
        r"Wahrscheinlichkeit $\frac{1}{3} \cdot \left(\frac{2}{3}\right)^2$, und es gibt "
        r"drei solche Pfade, je nachdem, bei welcher Drehung Blau kommt. Das Ereignis heißt "
        r"also: **„Bei drei Drehungen erscheint genau einmal Blau.“**",
    ],
    falle=r"Bei c) hilft das Gegenereignis. Wer „mindestens einmal“ direkt rechnet, muss "
          r"die Fälle einmal, zweimal und dreimal Gelb einzeln addieren und vergisst leicht "
          r"einen Pfad. Und bei d) gehört der Faktor $3$ zu „genau einmal“, nicht zu "
          r"„mindestens einmal“.",
    figs=[(fig_rad(), "Das Glücksrad. Der Zeiger steht oben fest, das Rad dreht sich.")],
)


def check():
    """Every number in the solutions, recomputed - exact where a Fraction can do it."""
    # --- Aufgabe 1 a) Potenzen ---------------------------------------------------
    for a in (Fr(2), Fr(3), Fr(-5, 7)):
        term = a ** 5 * a ** -2 / a ** 4
        assert term == 1 / a                                   # (B)
        assert term != a ** 3 and term != a and term != a ** -14 and term != a ** -3
    assert Fr(32) * Fr(1, 4) / 16 == Fr(1, 2)                  # Probe mit a = 2
    assert 5 * (-2) - 4 == -14                                 # (D) multipliziert
    # --- Aufgabe 1 b) Einheiten --------------------------------------------------
    liter = Fr(35, 100) * 1000                                 # 1 m^3 = 1000 dm^3 = 1000 l
    assert liter == 350                                        # (C)
    assert Fr(35, 100) * 100 == 35                             # (A) Faktor 100
    assert Fr(3500, 1000) == Fr(35, 10) != liter               # (B) 3500 cm^3 = 3,5 l
    assert 35 * 100 == 3500 != liter                           # (D) 35 hl = 3500 l
    assert Fr(35, 100) * 1000 == liter and Fr(35, 100) != liter  # (E)
    assert Fr(35, 10) * 100 == liter                           # 3,5 hl waere richtig
    # --- Aufgabe 1 c) Prozent ----------------------------------------------------
    assert Fr(11, 10) * Fr(9, 10) == Fr(99, 100)
    assert 100 * Fr(11, 10) == 110 and 110 * Fr(9, 10) == 99
    # --- Aufgabe 1 d) Funktionen -------------------------------------------------
    opts = {"A": lambda x: 3 * x, "B": lambda x: -x + 3, "C": lambda x: x * x + 3,
            "D": lambda x: 3 * Fr(2) ** x, "E": lambda x: -3 * x}
    xs = [Fr(k, 2) for k in range(-8, 9)]
    for key, fn in opts.items():
        through = fn(0) == 3
        falling = all(fn(xs[i + 1]) < fn(xs[i]) for i in range(len(xs) - 1))
        assert (through and falling) == (key == "B"), key
    assert opts["D"](0) == 3 and opts["C"](0) == 3              # die zwei Fallen
    # --- Aufgabe 2 ---------------------------------------------------------------
    assert Fr(GQ[1] - GP[1], GQ[0] - GP[0]) == Fr(-1, 2)
    assert g(Fr(GP[0])) == GP[1] and g(Fr(GQ[0])) == GQ[1]
    assert g(Fr(100)) == -46
    assert g(Fr(G_ZERO)) == 0 and g(Fr(0)) == G_YINT
    assert G_ZERO ** 2 + G_YINT ** 2 == 80 == 16 * 5
    assert abs(4 * sqrt(5) - 8.944) < 1e-3 and round(4 * sqrt(5)) == 9
    v = Fr(1, 3) * G_ZERO ** 2 * G_YINT                        # V / pi
    assert v == Fr(256, 3)
    assert v * 3 == 256 > 250 and v * pi > 250
    assert Fr(1, 3) * G_YINT ** 2 * G_ZERO == Fr(128, 3)       # um die x-Achse
    # --- Aufgabe 3 ---------------------------------------------------------------
    assert sum(ang for _, ang, _ in RAD) == 360
    assert P["rot"] == Fr(1, 2) and P["blau"] == Fr(1, 3) and P["gelb"] == Fr(1, 6)
    same = sum(p ** 2 for p in P.values())
    assert same == Fr(14, 36) == Fr(7, 18)
    assert 0.38 < float(same) < 0.39                           # knapp 39 %
    # dieselbe Zahl durch Abzaehlen aller 36 gleich wahrscheinlichen Sechstel-Paare
    sechstel = ["rot"] * 3 + ["blau"] * 2 + ["gelb"]
    assert Fr(sum(a == b for a in sechstel for b in sechstel), 36) == same
    mind = 1 - (1 - P["gelb"]) ** 3
    assert mind == Fr(91, 216) and 0.42 < float(mind) < 0.43
    genau_blau = sum(Fr(1) for a in sechstel for b in sechstel for c in sechstel
                     if [a, b, c].count("blau") == 1) / 216
    assert genau_blau == 3 * Fr(1, 3) * Fr(2, 3) ** 2 == Fr(4, 9)
    mind_blau = 1 - Fr(2, 3) ** 3
    assert mind_blau != genau_blau                             # die Falle aus d)


s.verify(check)
s.save()
