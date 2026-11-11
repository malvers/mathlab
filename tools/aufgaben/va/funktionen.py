#!/usr/bin/env python3
"""Vergleichsarbeit-Training BGY Klasse 11 (Sachsen) - Funktionen (Teil B, mit MMS).

    python3 tools/aufgaben/va/funktionen.py

Task B1 of the Vergleichsarbeit is always ONE function: a downward parabola with its
range, the triangle under it and a line with its perpendicular, or a cubic power
function cut by a line. Task B3 puts a parabola into a real cross-section. This sheet
trains exactly those moves. Wording, numbers and every figure are our own.
"""
import math
import os
import sys
from fractions import Fraction as Fr
from math import sqrt

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402


# ------------------------------------------------- Aufgabe 1: Parabel, Dreieck --
def f1(x):
    return -Fr(1, 2) * (x - 1) ** 2 + 8         # exact for ints and Fractions


N1, N2, S1 = (-3, 0), (5, 0), (1, 8)
M_G, N_G = Fr(-2), Fr(10)                       # g through S and N2
M_H, N_H = Fr(1, 2), Fr(3, 2)                   # h through N1, perpendicular to g
FOOT = ((N_H - N_G) / (M_G - M_H), None)        # g and h meet here (figure only)
FOOT = (FOOT[0], M_G * FOOT[0] + N_G)


# ------------------------------------------- Aufgabe 2: Potenzfunktion, Gerade --
def f2(x):
    return Fr(1, 2) * (x + 1) ** 3 - 4


def g2(x):
    return 2 * x - 2


CUTS = [(-3, -8), (-1, -4), (1, 0)]
N_PAR = 2                                        # the parallel y = 2x + 2


def roots(fn, a=-30.0, b=30.0, n=60000):
    """Real roots of a continuous function by sign change and bisection."""
    out = []
    xs = [a + (b - a) * i / n for i in range(n + 1)]
    for u, v in zip(xs, xs[1:]):
        fu, fv = fn(u), fn(v)
        if fu == 0:
            out.append(u)
        elif fu * fv < 0:
            lo, hi = u, v
            for _ in range(80):
                mid = (lo + hi) / 2
                if fn(lo) * fn(mid) <= 0:
                    hi = mid
                else:
                    lo = mid
            out.append((lo + hi) / 2)
    return out


def par_cut(n):
    """Common points of the graph of f and the line y = 2x + n."""
    return roots(lambda x: 0.5 * (x + 1) ** 3 - 4 - 2 * x - n)


X_PAR = par_cut(N_PAR)[0]


# ------------------------------------------------- Aufgabe 3: der Brueckenbogen --
def bogen(x):
    return -Fr(1, 48) * x * x + 12


def bogen15(x):
    return -Fr(5, 192) * x * x + 15


HW = Fr(3, 2)                                    # flood: 1.5 m above normal
SHIP_W, SHIP_H = 10, Fr(19, 2)                   # 10 m wide, 9.5 m above the water
X_EDGE = sqrt(48)                                # b(x) - 1.5 = 9.5 at |x| = sqrt(48)


# ----------------------------------------------------------------- figures ---
def eqplot(xlim, ylim, w, pad):
    """A Plot with the same scale on both axes - a right angle has to look like one."""
    pl, pr, pt, pb = pad
    sx = (w - pl - pr) / float(xlim[1] - xlim[0])
    h = int(round(sx * (ylim[1] - ylim[0]))) + pt + pb
    return S.Plot(xlim, ylim, w=w, h=h, pad=pad)


def fig_dreieck():
    p = eqplot((-4.6, 6.6), (-1.6, 9.6), w=430, pad=(34, 22, 16, 28))
    p.grid(1, 1)
    p.axes(1, 1, defer_labels=True)
    p.poly([p.P(*N1), p.P(*N2), p.P(*S1)], stroke="none", fill=S.ORANGE, opacity=0.38)
    p.curve(lambda x: float(f1(x)), -3.5, 5.5, S.RED, 2.2)
    p.seg((0.2, float(M_G) * 0.2 + float(N_G)), (5.8, float(M_G) * 5.8 + float(N_G)),
          S.GREEN, 1.8, clip=True)
    p.seg((-4.6, float(M_H) * -4.6 + float(N_H)), (6.6, float(M_H) * 6.6 + float(N_H)),
          S.INK, 1.5, dash="6 4", clip=True)
    # right angle at the foot point: one unit vector along g (towards S), one along h
    fx, fy = float(FOOT[0]), float(FOOT[1])
    a = (-1 / sqrt(5), 2 / sqrt(5))
    b = (-2 / sqrt(5), -1 / sqrt(5))
    q = 0.42
    p.poly([p.P(fx + q * a[0], fy + q * a[1]),
            p.P(fx + q * (a[0] + b[0]), fy + q * (a[1] + b[1])),
            p.P(fx + q * b[0], fy + q * b[1])], S.INK, 1.1, close=False)
    p.draw_labels()
    p.point(*S1, "S", "above-right", color=S.RED)
    p.point(*N1, "N₁", "above-left", color=S.RED)
    p.point(*N2, "N₂", "above-right", color=S.RED)
    p.text(p.X(-2.6), p.Y(4.4), "f", 15, S.RED, "end", italic=True, halo=S.PAPER)
    p.text(p.X(5.75), p.Y(-1.0), "g", 15, S.GREEN, "start", italic=True, halo=S.PAPER)
    p.text(p.X(6.4), p.Y(4.35), "h", 15, S.INK, "end", italic=True, halo=S.PAPER)
    p.text(p.X(1), p.Y(4.8), "A = 32", 13, S.INK, tex=True, halo=S.PAPER)
    return p.svg("Die nach unten geoeffnete Parabel f mit dem Scheitel S(1|8) und den "
                 "Nullstellen -3 und 5, das Dreieck aus den drei Punkten, die Gerade g durch "
                 "S und N2 und die dazu senkrechte Gerade h durch N1")


def fig_potenz(sol=False):
    p = S.Plot((-4.6, 3.6), (-10.6, 7.6), w=420, h=410, pad=(34, 22, 16, 28))
    p.grid(1, 1)
    p.axes(1, 2, defer_labels=True)
    p.curve(lambda x: float(f2(x)), -4.6, 3.6, S.RED, 2.2)
    p.curve(g2, -4.6, 3.6, S.GREEN, 2.0)
    if sol:
        p.curve(lambda x: 2 * x + N_PAR, -4.6, 3.6, S.INK, 1.5, dash="6 4")
    p.draw_labels()
    p.text(p.X(1.62), p.Y(6.6), "f", 15, S.RED, "end", italic=True, halo=S.PAPER)
    p.text(p.X(3.3), p.Y(3.3), "g", 15, S.GREEN, "start", italic=True, halo=S.PAPER)
    if sol:
        for (x, y), name, pos in zip(CUTS, ("A", "B", "C"),
                                     ("right", "below-right", "below-right")):
            p.point(x, y, name, pos, color=S.INK, size=3.4)
        p.point(X_PAR, 2 * X_PAR + N_PAR, None, color=S.INK, size=3.4)
        p.text(p.X(-2.35), p.Y(-1.95), "p", 15, S.INK, "end", italic=True, halo=S.PAPER)
    return p.svg("Der Graph der Potenzfunktion f, eine verschobene kubische Kurve, und die "
                 "steigende Gerade g, die ihn dreimal schneidet"
                 + (", dazu die Parallele p mit nur einem gemeinsamen Punkt" if sol else ""))


def _bruecke_base(p, x0, x1, y0, water=0.0):
    """Water below the given level, drawn first so everything else sits on top."""
    p.rect(p.X(x0), p.Y(water), p.X(x1) - p.X(x0), p.Y(y0) - p.Y(water),
           fill="#C9D6EA", opacity=0.55)


def fig_bruecke():
    p = eqplot((-27, 27), (-4.4, 17.0), w=560, pad=(30, 26, 14, 30))
    _bruecke_base(p, -27, 27, -4.4)
    p.grid(3, 3)
    p.axes(6, 3, defer_labels=True, skip_y=(0, 12))
    for u in (-18, -12, -6, 6, 12, 18):
        p.line(p.X(u), p.Y(float(bogen(u))), p.X(u), p.Y(12), S.INK, 1.6, cap="butt")
    p.line(p.X(-27), p.Y(12) - 2.2, p.X(27), p.Y(12) - 2.2, S.INK, 4.4, cap="butt")
    p.curve(lambda x: float(bogen(x)), -24, 24, S.RED, 2.6)
    for u in (-24, 24):
        p.rect(p.X(u) - 5, p.Y(0) - 1, 10, 6, fill=S.INK)
    p.draw_labels()
    p.text(p.X(-26.6), p.Y(12) - 9, "Fahrbahn", 11.5, S.INK, "start", halo=S.PAPER)
    p.text(p.X(26.6), p.Y(-3.7), "Wasser", 11.5, S.BODY, "end")
    p.text(p.X(-15.5), p.Y(7.2), "b", 15, S.RED, "end", italic=True, halo=S.PAPER)
    return p.svg("Ein parabelfoermiger Brueckenbogen mit 48 m Spannweite und 12 m Hoehe, "
                 "darauf die waagerechte Fahrbahn, dazwischen sechs senkrechte Stuetzen")


def fig_schiff():
    p = S.Plot((-13.5, 13.5), (-0.9, 13.4), w=500, h=300, pad=(34, 24, 14, 30))
    _bruecke_base(p, -13.5, 13.5, -0.9, water=float(HW))
    p.grid(1, 1)
    p.axes(2, 2, defer_labels=True, skip_y=(0, 12))
    p.line(p.X(-13.5), p.Y(0), p.X(13.5), p.Y(0), S.MUTED, 1.1, dash="4 3")
    p.rect(p.X(-5), p.Y(11), p.X(5) - p.X(-5), p.Y(float(HW)) - p.Y(11),
           fill=S.GREEN, stroke=S.GREEN, width=1.4, opacity=0.35)
    p.line(p.X(-13.5), p.Y(11), p.X(13.5), p.Y(11), S.GREEN, 1.2, dash="6 4")
    for u in (-X_EDGE, X_EDGE):
        p.line(p.X(u), p.Y(11), p.X(u), p.Y(float(HW)), S.GREEN, 1.1, dash="2 3")
    p.line(p.X(-13.5), p.Y(12) - 2.2, p.X(13.5), p.Y(12) - 2.2, S.INK, 4.4, cap="butt")
    p.curve(lambda x: float(bogen(x)), -13.5, 13.5, S.RED, 2.4)
    p.draw_labels()
    p.text(p.X(2.5), p.Y(7.4), "Schiff", 12, S.INK, halo=S.PAPER)
    p.text(p.X(2.5), p.Y(7.4) + 16, "10 m breit", 11, S.BODY, halo=S.PAPER)
    p.text(p.X(2.5), p.Y(7.4) + 31, "9,5 m hoch", 11, S.BODY, halo=S.PAPER)
    p.text(p.X(13.2), p.Y(float(HW)) + 14, "Hochwasser", 11.5, S.BODY, "end")
    p.text(p.X(-13.2), p.Y(11) - 6, "Oberkante 11 m", 11, S.GREEN, "start", halo=S.PAPER)
    p.text(p.X(X_EDGE) + 4, p.Y(3.2), "x ≈ 6,93", 11, S.GREEN, "start", halo=S.PAPER)
    p.text(p.X(-X_EDGE) - 4, p.Y(3.2), "x ≈ −6,93", 11, S.GREEN, "end", halo=S.PAPER)
    return p.svg("Ausschnitt unter dem Bogen bei Hochwasser: das 10 m breite Schiff ragt bis "
                 "11 m ueber den normalen Pegel, der Bogen liegt dort nur zwischen x = -6,93 "
                 "und x = 6,93 hoeher")


def fig_hoeher():
    p = eqplot((-27, 27), (-1.2, 21.6), w=560, pad=(34, 26, 14, 30))
    p.grid(3, 3)
    # all three apexes sit on the y-axis, so its numbers go to the left frame instead
    p.axes(6, 3, defer_labels=True, yticks=False)
    for v in range(3, 22, 3):
        p.text(p.X(-27) - 5, p.Y(v) + 4, str(v), 11.5, S.MUTED, "end")
    p.curve(lambda x: float(bogen(x)) + 3, -24, 24, S.MUTED, 1.6, dash="6 4")
    p.curve(lambda x: float(bogen15(x)), -24, 24, S.GREEN, 2.4)
    p.curve(lambda x: float(bogen(x)), -24, 24, S.RED, 2.4)
    p.draw_labels()
    p.legend(p.X(-26.2) + 7, p.Y(20.4), [("Bogen b, 12 m", S.RED, "line"),
                                     ("neuer Bogen, 15 m", S.GREEN, "line"),
                                     ("„überall 3 m höher“", S.MUTED, "dash")])
    return p.svg("Der alte Bogen, der neue Bogen mit 15 m Scheitelhoehe und die um 3 m "
                 "verschobene Kurve, die an den Fusspunkten in der Luft endet")


# ------------------------------------------------------------------- sheet ---
s = Sheet("va-bgy11-funktionen", "Funktionen",
          kind="Vergleichsarbeit-Training",
          suffix="",
          klasse="Berufliches Gymnasium · Klasse 11",
          sub="Berufliches Gymnasium · Klasse 11 · Vergleichsarbeit Mathematik · Teil B · "
              "mit MMS und Formelsammlung · drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Vergleichsarbeit-Training Mathematik, Berufliches Gymnasium Klasse 11: "
               "Parabel mit Dreieck und senkrechter Gerade, Potenzfunktion und Gerade, "
               "ein Brückenbogen als Parabel, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/vergleichsarbeit.html", "Zur Übersicht"))

s.task(
    "Parabel, Dreieck und Senkrechte", 1,
    r"Gegeben ist die in $\mathbb{R}$ definierte Funktion $f$ mit "
    r"$f(x) = -0{,}5 \cdot (x - 1)^2 + 8$.",
    [
        r"Geben Sie die Koordinaten des Scheitelpunkts $S$ und den Wertebereich von $f$ an.",
        r"Berechnen Sie die beiden Nullstellen von $f$ und geben Sie die Koordinaten des "
        r"Schnittpunkts des Graphen mit der $y$-Achse an.",
        r"Die Schnittpunkte $N_1$ und $N_2$ des Graphen mit der $x$-Achse bilden zusammen "
        r"mit $S$ ein Dreieck. Berechnen Sie seinen Flächeninhalt.",
        r"Die Gerade $g$ verläuft durch $S$ und den rechten Schnittpunkt $N_2$. Ermitteln "
        r"Sie eine Gleichung von $g$ und eine Gleichung der Geraden $h$, die durch den "
        r"linken Schnittpunkt $N_1$ verläuft und senkrecht auf $g$ steht.",
    ],
    [
        r"An der Scheitelpunktform abgelesen: $S(1 \mid 8)$. Der Faktor $-0{,}5$ ist "
        r"negativ, die Parabel ist also nach unten geöffnet und $8$ ist der größte "
        r"Funktionswert: $W_f = \{y \mid y \in \mathbb{R};\ y \leq 8\}$.",

        r"$-0{,}5 \cdot (x - 1)^2 + 8 = 0$ ergibt $(x - 1)^2 = 16$, also $x - 1 = \pm 4$. "
        r"Die Nullstellen sind $x_1 = -3$ und $x_2 = 5$. Wegen "
        r"$f(0) = -0{,}5 + 8 = 7{,}5$ schneidet der Graph die $y$-Achse in "
        r"$S_y(0 \mid 7{,}5)$.",

        r"$N_1(-3 \mid 0)$ und $N_2(5 \mid 0)$ liegen $8$ LE auseinander, das ist die "
        r"Grundseite. Die Höhe ist der Abstand von $S$ zur $x$-Achse, also $8$ LE. "
        r"$A = \frac{1}{2} \cdot 8 \cdot 8 = 32$ FE.",

        r"Steigung von $g$: $m = \frac{0 - 8}{5 - 1} = -2$. Aus $0 = -2 \cdot 5 + n$ folgt "
        r"$n = 10$, also $g(x) = -2x + 10$. Für die Senkrechte gilt "
        r"$m_h = -\frac{1}{m} = \frac{1}{2}$. Aus $0 = \frac{1}{2} \cdot (-3) + n$ folgt "
        r"$n = 1{,}5$, also $h(x) = 0{,}5x + 1{,}5$. Probe: $(-2) \cdot 0{,}5 = -1$. "
        r"Die beiden Geraden schneiden sich in $F(3{,}4 \mid 3{,}2)$.",
    ],
    falle=r"Wegen des Minuszeichens vor $0{,}5$ ist der Wertebereich $y \leq 8$, nicht "
          r"$y \geq 8$. Und $(x - 1)$ verschiebt den Scheitel nach **rechts** zu $x = 1$. "
          r"Bei der Senkrechten wird die Steigung umgekehrt **und** mit $-1$ "
          r"multipliziert: aus $-2$ wird $\frac{1}{2}$, nicht $2$.",
    solfigs=[(fig_dreieck(),
              "Die Parabel f, das Dreieck aus N₁, N₂ und S (orange), die Gerade g und die "
              "dazu senkrechte Gerade h (gestrichelt).")],
)

s.task(
    "Potenzfunktion und Gerade", 2,
    r"Gegeben sind die in $\mathbb{R}$ definierten Funktionen $f$ mit "
    r"$f(x) = 0{,}5 \cdot (x + 1)^3 - 4$ und $g$ mit $g(x) = 2x - 2$. Die Abbildung zeigt "
    r"ihre Graphen.",
    [
        r"Geben Sie den Wertebereich von $f$ an und berechnen Sie die Nullstelle von $f$.",
        r"Prüfen Sie rechnerisch, ob die Punkte $P(-3 \mid -8)$ und $Q(2 \mid 9)$ auf dem "
        r"Graphen von $f$ liegen.",
        r"Ermitteln Sie die Koordinaten aller gemeinsamen Punkte der Graphen von $f$ und "
        r"$g$. Zeigen Sie, dass einer dieser Punkte genau in der Mitte zwischen den beiden "
        r"anderen liegt, und berechnen Sie den Abstand der beiden äußeren Punkte.",
        r"Geben Sie eine Gleichung einer zu $g$ parallelen Geraden an, die mit dem Graphen "
        r"von $f$ genau einen gemeinsamen Punkt hat. Begründen Sie Ihre Wahl.",
    ],
    [
        r"Der Graph entsteht aus dem von $y = x^3$ durch Stauchen mit $0{,}5$ und "
        r"Verschieben um $1$ nach links und $4$ nach unten. Eine Potenzfunktion dritten "
        r"Grades nimmt jeden reellen Wert an, daran ändert das Verschieben nichts: "
        r"$W_f = \mathbb{R}$. Nullstelle: $0{,}5 \cdot (x + 1)^3 = 4$ ergibt "
        r"$(x + 1)^3 = 8$, also $x + 1 = 2$ und $x_0 = 1$.",

        r"$f(-3) = 0{,}5 \cdot (-2)^3 - 4 = -4 - 4 = -8$, also liegt $P$ auf dem Graphen. "
        r"$f(2) = 0{,}5 \cdot 3^3 - 4 = 13{,}5 - 4 = 9{,}5 \neq 9$, also liegt $Q$ nicht "
        r"auf dem Graphen, sondern $0{,}5$ darunter.",

        r"Gleichsetzen: $0{,}5 \cdot (x + 1)^3 - 4 = 2x - 2$. Das MMS liefert "
        r"$x_1 = -3$, $x_2 = -1$ und $x_3 = 1$. Ohne Rechner: $2x - 2 + 4 = 2 \cdot (x + 1)$, "
        r"also $0{,}5 \cdot (x + 1)^3 = 2 \cdot (x + 1)$ und damit "
        r"$0{,}5 \cdot (x + 1) \cdot \left((x + 1)^2 - 4\right) = 0$. Die gemeinsamen "
        r"Punkte sind $A(-3 \mid -8)$, $B(-1 \mid -4)$ und $C(1 \mid 0)$. Der Mittelpunkt "
        r"von $A$ und $C$ ist $\left(\frac{-3 + 1}{2} \mid \frac{-8 + 0}{2}\right)$, also "
        r"$(-1 \mid -4) = B$. Abstand: "
        r"$\overline{AC} = \sqrt{4^2 + 8^2} = \sqrt{80} \approx 8{,}94$ LE.",

        r"Parallele Geraden haben die Steigung $2$, also $p(x) = 2x + n$. Für $n = -2$ ist "
        r"es $g$ selbst mit drei gemeinsamen Punkten. Verschiebt man die Gerade weit genug "
        r"nach oben, trifft sie nur noch den rechten, steilen Teil des Graphen, zum "
        r"Beispiel $p(x) = 2x + 2$: Für $0{,}5 \cdot (x + 1)^3 - 4 = 2x + 2$ findet das MMS "
        r"nur die Lösung $x \approx 1{,}65$, der einzige gemeinsame Punkt ist etwa "
        r"$(1{,}65 \mid 5{,}30)$. Am Graphen im MMS sieht man: Genau einen gemeinsamen Punkt "
        r"gibt es für $n > -0{,}46$ und für $n < -3{,}54$.",
    ],
    falle=r"Bei d) reicht eine Gerade knapp neben $g$ nicht: $y = 2x - 1$ schneidet den "
          r"Graphen noch dreimal. Eine Gleichung dritten Grades hat höchstens drei "
          r"Lösungen, wie viele es wirklich sind, zeigt erst der Graph im MMS.",
    figs=[(fig_potenz(), "Der Graph von f (rot) und die Gerade g (grün).")],
    solfigs=[(fig_potenz(sol=True),
              "Die drei gemeinsamen Punkte A, B, C und die Parallele p mit nur einem "
              "gemeinsamen Punkt (gestrichelt).")],
)

s.task(
    "Der Brückenbogen", 3,
    r"Eine Straßenbrücke überspannt einen Fluss mit einem parabelförmigen Bogen. Seine "
    r"beiden Fußpunkte liegen auf Höhe des normalen Wasserspiegels $48$ m voneinander "
    r"entfernt, sein höchster Punkt liegt $12$ m über dem Wasser. Die waagerechte Fahrbahn "
    r"liegt auf dem Scheitel auf und wird zusätzlich von senkrechten Stützen getragen. Im "
    r"Koordinatensystem liegt der Ursprung auf dem Wasserspiegel genau unter dem Scheitel, "
    r"$1$ LE entspricht $1$ m.",
    [
        r"Zeigen Sie, dass der Bogen durch $b(x) = -\frac{1}{48}x^2 + 12$ mit "
        r"$-24 \leq x \leq 24$ beschrieben wird.",
        r"Zwischen Bogen und Fahrbahn stehen Stützen bei $x = \pm 6$, $x = \pm 12$ und "
        r"$x = \pm 18$. Berechnen Sie die Gesamtlänge aller sechs Stützen.",
        r"Bei Hochwasser liegt der Wasserspiegel $1{,}5$ m über dem normalen Pegel. Ein "
        r"Ausflugsschiff ist $10$ m breit und ragt $9{,}5$ m aus dem Wasser; sein "
        r"Querschnitt über Wasser ist vereinfacht ein Rechteck. Beurteilen Sie, ob es bei "
        r"diesem Hochwasser unter dem Bogen hindurchfahren kann, und ermitteln Sie, wie weit "
        r"seine Mitte dabei höchstens von der Flussmitte abweichen darf.",
        r"Für größere Schiffe soll der Bogen bei gleichen Fußpunkten auf $15$ m Scheitelhöhe "
        r"angehoben werden. Ein Planer sagt: „Dann liegt jeder Punkt des Bogens $3$ m "
        r"höher.“ Beurteilen Sie die Aussage und geben Sie an, um wie viel Prozent der neue "
        r"Bogen an jeder Stelle höher liegt.",
    ],
    [
        r"Der Scheitel liegt auf der $y$-Achse bei $S(0 \mid 12)$, also gilt der Ansatz "
        r"$b(x) = a \cdot x^2 + 12$. Der rechte Fußpunkt ist $(24 \mid 0)$: "
        r"$0 = a \cdot 576 + 12$ ergibt $a = -\frac{12}{576} = -\frac{1}{48}$. Wegen der "
        r"Symmetrie liegt auch der linke Fußpunkt $(-24 \mid 0)$ auf dem Bogen.",

        r"Eine Stütze an der Stelle $x$ reicht vom Bogen bis zur Fahrbahn in $12$ m Höhe, "
        r"ist also $12 - b(x) = \frac{x^2}{48}$ lang: bei $\pm 6$ sind das "
        r"$\frac{36}{48} = 0{,}75$ m, bei $\pm 12$ sind es $3$ m und bei $\pm 18$ sind es "
        r"$6{,}75$ m. Zusammen: $2 \cdot (0{,}75 + 3 + 6{,}75) = 21$ m.",

        r"Fährt das Schiff genau in der Mitte, liegen seine Bordwände bei $x = \pm 5$. Dort "
        r"liegt der Bogen $b(5) = -\frac{25}{48} + 12 \approx 11{,}48$ m über dem normalen "
        r"Pegel, bei Hochwasser also nur $11{,}48 - 1{,}5 = 9{,}98$ m über dem Wasser. Das "
        r"Schiff passt durch, aber mit nur etwa $0{,}48$ m Luft. Die Bordwand muss dort "
        r"bleiben, wo $b(x) - 1{,}5 \geq 9{,}5$ ist, also $b(x) \geq 11$: "
        r"$\frac{x^2}{48} \leq 1$ ergibt $|x| \leq \sqrt{48} \approx 6{,}93$. Die "
        r"Schiffsmitte darf höchstens $6{,}93 - 5 \approx 1{,}93$ m von der Flussmitte "
        r"abweichen. Die Durchfahrt ist möglich, verlangt bei Strömung und Wind aber sehr "
        r"genaues Steuern.",

        r"Neuer Bogen: $\tilde{b}(x) = a' \cdot x^2 + 15$ mit $\tilde{b}(24) = 0$, also "
        r"$a' = -\frac{15}{576} = -\frac{5}{192}$. An den Fußpunkten bleibt die Höhe $0$, "
        r"dort wird der Bogen gar nicht höher: Die Aussage ist **falsch**. Es gilt "
        r"$b(x) = 12 \cdot \left(1 - \frac{x^2}{576}\right)$ und "
        r"$\tilde{b}(x) = 15 \cdot \left(1 - \frac{x^2}{576}\right) = 1{,}25 \cdot b(x)$. "
        r"Jeder Punkt liegt $25\ \%$ höher; die vollen $3$ m gibt es nur am Scheitel. Bei "
        r"$x = 12$ zum Beispiel steigt der Bogen von $9$ m auf $11{,}25$ m, also nur um "
        r"$2{,}25$ m.",
    ],
    falle=r"Bei c) zählt die Höhe über dem **Hochwasser**, nicht über dem normalen Pegel. "
          r"Und gemessen wird an der Bordwand bei $x = \pm 5$, nicht in der Mitte: Dort ist "
          r"der Bogen am höchsten, an der Bordwand wird es eng.",
    figs=[(fig_bruecke(),
           "Der Brückenbogen b (rot) mit Fahrbahn und Stützen, Maße in Metern.")],
    solfigs=[(fig_schiff(),
              "Zu c): Bei Hochwasser reicht das Schiff bis 11 m über den normalen Pegel. "
              "Höher liegt der Bogen nur zwischen den grünen Linien."),
             (fig_hoeher(),
              "Zu d): Der neue Bogen (grün) liegt überall 25 % höher. Die um 3 m "
              "verschobene Kurve würde an den Fußpunkten in der Luft enden.")],
)


def check():
    """Every number in the solutions, recomputed - exact where a Fraction can do it."""
    # --- Aufgabe 1 -----------------------------------------------------------------
    assert f1(1) == 8 and all(f1(Fr(k, 10)) <= 8 for k in range(-80, 100))
    assert f1(-3) == 0 and f1(5) == 0 and f1(0) == Fr(15, 2)
    assert (5 - 1) ** 2 == 16 and (-3 - 1) ** 2 == 16
    base, height = N2[0] - N1[0], S1[1]
    assert base == 8 and height == 8 and Fr(1, 2) * base * height == 32
    assert Fr(0 - 8, 5 - 1) == M_G == -2
    assert M_G * 5 + N_G == 0 and M_G * 1 + N_G == 8
    assert M_H == -1 / M_G and M_G * M_H == -1
    assert M_H * (-3) + N_H == 0 and N_H == Fr(3, 2)
    assert FOOT == (Fr(17, 5), Fr(16, 5))                    # F(3,4 | 3,2)
    assert M_H * FOOT[0] + N_H == FOOT[1]
    # the area once more, via the foot point: half base SN2 times height N1F
    sn2 = sqrt((5 - 1) ** 2 + 8 ** 2)
    n1f = sqrt(float(FOOT[0] + 3) ** 2 + float(FOOT[1]) ** 2)
    assert abs(0.5 * sn2 * n1f - 32) < 1e-9
    # --- Aufgabe 2 -----------------------------------------------------------------
    assert f2(1) == 0 and Fr(2) ** 3 == 8
    assert all(f2(Fr(k, 10)) < f2(Fr(k + 1, 10)) for k in range(-60, 60))  # streng steigend
    assert f2(-3) == -8 and f2(2) == Fr(19, 2) and f2(2) - 9 == Fr(1, 2)
    for x, y in CUTS:
        assert f2(x) == g2(x) == y
    for x in range(-6, 7):
        assert f2(x) - g2(x) == Fr(1, 2) * (x + 1) * ((x + 1) ** 2 - 4)
    assert len(roots(lambda x: float(f2(x)) - g2(x))) == 3
    (ax, ay), (bx, by), (cx, cy) = CUTS
    assert (Fr(ax + cx, 2), Fr(ay + cy, 2)) == (bx, by)
    assert (cx - ax) ** 2 + (cy - ay) ** 2 == 80 and round(sqrt(80), 2) == 8.94
    assert len(par_cut(N_PAR)) == 1
    assert round(X_PAR, 2) == 1.65 and round(2 * X_PAR + N_PAR, 2) == 5.30
    crit = 8 / (3 * sqrt(3))                                 # where the parallel touches
    assert round(-2 + crit, 2) == -0.46 and round(-2 - crit, 2) == -3.54
    for n, k in ((-0.4, 1), (-0.5, 3), (-3.5, 3), (-3.6, 1), (5, 1), (-9, 1), (-2, 3)):
        assert len(par_cut(n)) == k, (n, par_cut(n))
    assert len(par_cut(-1)) == 3                             # die Falle
    # --- Aufgabe 3 -----------------------------------------------------------------
    assert bogen(24) == 0 and bogen(-24) == 0 and bogen(0) == 12
    assert Fr(-12, 576) == Fr(-1, 48) and 24 ** 2 == 576
    lengths = [12 - bogen(u) for u in (6, 12, 18)]
    assert lengths == [Fr(3, 4), 3, Fr(27, 4)] and Fr(36, 48) == Fr(3, 4)
    assert all(12 - bogen(u) == Fr(u * u, 48) for u in range(-24, 25))
    assert 2 * sum(lengths) == 21
    b5 = bogen(5)
    assert b5 == 12 - Fr(25, 48) and round(float(b5), 2) == 11.48
    assert round(float(b5 - HW), 2) == 9.98
    assert round(float(b5 - HW - SHIP_H), 2) == 0.48
    assert HW + SHIP_H == 11
    assert abs(float(bogen(X_EDGE)) - 11) < 1e-12 and round(X_EDGE, 2) == 6.93
    assert round(X_EDGE - SHIP_W / 2, 2) == 1.93
    assert Fr(-15, 576) == Fr(-5, 192) and bogen15(24) == 0 and bogen15(0) == 15
    for u in range(-24, 25):
        assert bogen15(u) == Fr(5, 4) * bogen(u)
        assert bogen(u) == 12 * (1 - Fr(u * u, 576))
    assert bogen(12) == 9 and bogen15(12) == Fr(45, 4) and bogen15(12) - bogen(12) == Fr(9, 4)
    assert (Fr(5, 4) - 1) * 100 == 25 and bogen15(0) - bogen(0) == 3


s.verify(check)
s.save()
