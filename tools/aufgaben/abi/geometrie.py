#!/usr/bin/env python3
"""Abitur-Training BGY - Analytische Geometrie (Wahlpflicht 1, Pflichtaufgabe 2).

    python3 tools/aufgaben/abi/geometrie.py

Follows the pattern of the Sachsen originals: one body from the real world, laid into
a coordinate system, with a shadow cast by a direction vector at the end. Wording,
numbers and figures are our own.
"""
import os
import sys
from fractions import Fraction as Fr
from math import acos, degrees, sqrt

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402

# The body: a garden shed with a mono-pitch roof. 1 LE = 1 m.
A, B, C, D = (0, 0, 0), (6, 0, 0), (6, 4, 0), (0, 4, 0)
E, F, G, H = (0, 0, 3), (6, 0, 3), (6, 4, 2), (0, 4, 2)
SUN = (2, 1, -3)


def sub(p, q):
    return tuple(a - b for a, b in zip(p, q))


def dot(p, q):
    return sum(a * b for a, b in zip(p, q))


def cross(p, q):
    return (p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0])


def norm(p):
    return sqrt(dot(p, p))


def shadow(p):
    """Where the ray through p in direction SUN meets the ground z = 0."""
    t = Fr(p[2], -SUN[2])
    return tuple(Fr(p[i]) + t * SUN[i] for i in range(3))


# ----------------------------------------------------------------- figures ---
def _shed(sd, faces=True):
    if faces:
        sd.shade([E, F, G, H], S.ORANGE, 0.34)          # roof
        sd.shade([A, B, F, E], S.GREEN, 0.16)           # front wall
        sd.shade([B, C, G, F], S.RED, 0.10)             # right wall
    sd.edges([(A, B), (B, C), (B, F), (C, G), (F, G), (E, F), (G, H), (H, E), (A, E)])
    sd.edges([(A, D), (D, C), (D, H)], dash="5 4", color=S.MUTED)


def fig_koerper():
    sd = S.Solid(w=540, h=372, scale=46, ox=215, oy=196)
    sd.axes(lx=7.0, ly=6.0, lz=3.7)
    _shed(sd)
    for p, lab, pos in ((A, "A", "above-left"), (B, "B", "below-left"), (C, "C", "below-right"),
                        (D, "D", "right"), (E, "E", "above-left"), (F, "F", "left"),
                        (G, "G", "below-right"), (H, "H", "right")):
        sd.vertex(p, lab, pos)
    sd.label3((3, 2, 2.6), "Dach", 0, 0, 12, S.MUTED)
    return sd.svg("Schraegbild des Geraetehauses mit den Eckpunkten A bis H")


def fig_schatten():
    sd = S.Solid(w=540, h=390, scale=42, ox=205, oy=196)
    sd.axes(lx=7.0, ly=7.6, lz=3.8)
    Es, Fs, Gs, Hs = (tuple(float(v) for v in shadow(p)) for p in (E, F, G, H))
    sd.shade([Es, Fs, Gs, Hs], S.MUTED, 0.28)
    sd.poly([sd.P(p) for p in (Es, Fs, Gs, Hs)], stroke=S.MUTED, width=1.2, fill="none",
            dash="4 3")
    _shed(sd, faces=False)
    sd.shade([E, F, G, H], S.ORANGE, 0.34)
    for p, q in ((E, Es), (F, Fs), (G, Gs), (H, Hs)):
        sd.arrow3(p, q, S.GREEN, 1.4, dash="3 3")
    for p, lab, pos in ((E, "E", "above-left"), (F, "F", "left"),
                        (G, "G", "above-right"), (H, "H", "right")):
        sd.vertex(p, lab, pos)
    for p, lab in ((Es, "E'"), (Fs, "F'"), (Gs, "G'"), (Hs, "H'")):
        sd.vertex(p, lab, "below", color=S.MUTED, size=2.6)
    sd.label3((3, 2.6, -0.1), "Schatten", 0, 16, 12, S.MUTED)
    return sd.svg("Das Dach und sein Schatten auf dem Untergrund, verbunden durch die Sonnenstrahlen")


def fig_aufsicht():
    """Plan view: the roof seen from above against its shadow - same scale, no perspective."""
    p = S.Plot((-0.8, 9.2), (-0.9, 5.6), w=470, h=280, pad=(38, 22, 18, 32))
    p.grid(1, 1)
    p.axes(1, 1, xlabel="y", ylabel="x", origin="O")
    # plan view: horizontal = y, vertical = x (the ground plane seen from above)
    roof = [(0, 0), (0, 6), (4, 6), (4, 0)]
    Es, Fs, Gs, Hs = (tuple(float(v) for v in shadow(q)) for q in (E, F, G, H))
    sh = [(Es[1], Es[0]), (Fs[1], Fs[0]), (Gs[1], Gs[0]), (Hs[1], Hs[0])]
    p.poly([p.P(u, v) for u, v in sh], stroke=S.MUTED, width=1.4, fill=S.MUTED, dash="4 3")
    p.raw('<path d="M %s Z" fill="%s" opacity="0.34"/>'
          % (" L ".join("%s %s" % (S.fmt(p.X(u)), S.fmt(p.Y(v))) for u, v in roof), S.ORANGE))
    p.poly([p.P(u, v) for u, v in roof], stroke=S.RED, width=1.6, fill="none")
    p.text(p.X(2), p.Y(3), "Dach von oben", 12, S.INK, halo=S.PAPER)
    p.text(p.X(2.6), p.Y(0.6), "Schatten", 12, S.MUTED, halo=S.PAPER)
    return p.svg("Aufsicht: die Grundrissflaeche des Daches und die Flaeche seines Schattens")


# ------------------------------------------------------------------- sheet ---
s = Sheet("abitur-bgy-geometrie", "Analytische Geometrie",
          kind="Abitur-Training",
          suffix="",
          klasse="Berufliches Gymnasium",
          sub="Berufliches Gymnasium · Wahlpflicht 1 · Pflichtaufgabe 2 · "
              "drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Abitur-Training Mathematik BGY, Analytische Geometrie: Körper im "
               "Koordinatensystem, Ebene, Neigungswinkel und Schattenwurf, mit Lösungen "
               "und Abbildungen.",
          plan=("../svp/mathe/abitur.html", "Zur Übersicht"))

KOERPER = (r"Ein Gerätehaus mit Pultdach wird modellhaft durch den Körper $ABCDEFGH$ mit "
           r"$A(0 \mid 0 \mid 0)$, $B(6 \mid 0 \mid 0)$, $C(6 \mid 4 \mid 0)$, "
           r"$D(0 \mid 4 \mid 0)$, $E(0 \mid 0 \mid 3)$, $F(6 \mid 0 \mid 3)$, "
           r"$G(6 \mid 4 \mid 2)$ und $H(0 \mid 4 \mid 2)$ beschrieben. Das Viereck $EFGH$ "
           r"ist die Dachfläche, die $x$-$y$-Ebene der waagerechte Untergrund. "
           r"Eine Längeneinheit entspricht einem Meter.")

s.task(
    "Das Gerätehaus", 1,
    KOERPER,
    [
        r"Geben Sie die Längen der Kanten $\overline{AB}$ und $\overline{AE}$ an.",
        r"Weisen Sie rechnerisch nach, dass die Dachfläche $EFGH$ ein Rechteck ist.",
        r"Berechnen Sie den Flächeninhalt der Dachfläche.",
        r"Bestimmen Sie das Volumen des Gerätehauses.",
    ],
    [
        r"$\overline{AB}$ verläuft parallel zur $x$-Achse: $\overline{AB} = 6$ m. "
        r"$\overline{AE}$ verläuft parallel zur $z$-Achse: $\overline{AE} = 3$ m.",
        r"$\overrightarrow{EF} = \begin{pmatrix}6\\0\\0\end{pmatrix}$, "
        r"$\overrightarrow{HG} = \begin{pmatrix}6\\0\\0\end{pmatrix}$ — die Vektoren sind "
        r"gleich, also ist $EFGH$ ein **Parallelogramm**. Mit "
        r"$\overrightarrow{EH} = \begin{pmatrix}0\\4\\-1\end{pmatrix}$ ist "
        r"$\overrightarrow{EF} \circ \overrightarrow{EH} = 0 + 0 + 0 = 0$, die benachbarten "
        r"Seiten stehen also senkrecht aufeinander. Ein Parallelogramm mit einem rechten "
        r"Winkel ist ein **Rechteck**.",
        r"Die Seitenlängen sind $\left|\overrightarrow{EF}\right| = 6$ und "
        r"$\left|\overrightarrow{EH}\right| = \sqrt{0^2 + 4^2 + (-1)^2} = \sqrt{17}$. "
        r"Damit $A_{\text{Dach}} = 6 \cdot \sqrt{17} \approx 24{,}7$ m².",
        r"Jeder Schnitt senkrecht zur $x$-Achse ist dasselbe Trapez mit den parallelen "
        r"Seiten $3$ (vorn) und $2$ (hinten) und der Höhe $4$: "
        r"$A_{\text{Trapez}} = \dfrac{3+2}{2} \cdot 4 = 10$. "
        r"Der Körper ist ein Prisma der Länge $6$, also "
        r"$V = 10 \cdot 6 = 60$ m³.",
    ],
    falle=r"Die Dachfläche ist **nicht** $6 \cdot 4 = 24$. Das Dach ist geneigt, seine "
          r"Breite ist die Strecke von $E$ nach $H$ — also $\sqrt{17} \approx 4{,}12$ und "
          r"nicht $4$.",
    figs=[(fig_koerper(),
           "Das Gerätehaus im Koordinatensystem. Die verdeckten Kanten sind gestrichelt.")],
)

s.task(
    "Ebene und Neigung", 2,
    r"Betrachtet wird weiterhin das Gerätehaus aus Aufgabe 1. Die Dachfläche $EFGH$ liegt "
    r"in einer Ebene $\varepsilon$.",
    [
        r"Geben Sie eine Gleichung der Geraden an, auf der die Kante $\overline{EH}$ liegt.",
        r"Weisen Sie nach, dass $\varepsilon: y + 4 \cdot z = 12$ eine Gleichung dieser "
        r"Ebene ist.",
        r"Berechnen Sie die Größe des Winkels, unter dem das Dach gegen den waagerechten "
        r"Untergrund geneigt ist.",
        r"Berechnen Sie den Abstand des Punktes $C$ von der Ebene $\varepsilon$.",
    ],
    [
        r"Mit dem Stützvektor $\overrightarrow{OE}$ und dem Richtungsvektor "
        r"$\overrightarrow{EH}$: "
        r"$g: \vec{x} = \begin{pmatrix}0\\0\\3\end{pmatrix} + r \cdot "
        r"\begin{pmatrix}0\\4\\-1\end{pmatrix}$, $r \in \mathbb{R}$.",
        r"Ein Normalenvektor ist "
        r"$\vec{n} = \overrightarrow{EF} \times \overrightarrow{EH} = "
        r"\begin{pmatrix}0\\6\\24\end{pmatrix}$, gekürzt "
        r"$\begin{pmatrix}0\\1\\4\end{pmatrix}$ — das sind die Koeffizienten der Gleichung. "
        r"Einsetzen aller vier Eckpunkte: $E: 0 + 12 = 12$, $F: 0 + 12 = 12$, "
        r"$G: 4 + 8 = 12$, $H: 4 + 8 = 12$. Alle vier erfüllen die Gleichung.",
        r"Der Untergrund hat den Normalenvektor "
        r"$\begin{pmatrix}0\\0\\1\end{pmatrix}$. Für den Schnittwinkel zweier Ebenen gilt "
        r"$\cos \alpha = \dfrac{\left|\vec{n_1} \circ \vec{n_2}\right|}"
        r"{\left|\vec{n_1}\right| \cdot \left|\vec{n_2}\right|} "
        r"= \dfrac{4}{\sqrt{17}} \approx 0{,}970$, also "
        r"$\alpha \approx 14{,}0^\circ$.",
        r"Hesse'sche Normalenform: $d = \dfrac{\left|4 + 4 \cdot 0 - 12\right|}{\sqrt{17}} "
        r"= \dfrac{8}{\sqrt{17}} \approx 1{,}94$ m.",
    ],
    falle=r"In Teil d) ist der **senkrechte** Abstand gefragt, nicht die Höhe der Wand. "
          r"Senkrecht über $C$ liegt $G$ in $2$ m Höhe — der Abstand zur geneigten Ebene "
          r"ist mit $1{,}94$ m kleiner. Wer $2$ hinschreibt, hat die Neigung vergessen.",
)

s.task(
    "Schatten am Nachmittag", 3,
    r"Am Nachmittag fällt das Sonnenlicht in Richtung des Vektors "
    r"$\vec{s} = \begin{pmatrix}2\\1\\-3\end{pmatrix}$ auf das Gerätehaus. Das Dach $EFGH$ "
    r"wirft dabei einen Schatten $E'F'G'H'$ auf den waagerechten Untergrund.",
    [
        r"Berechnen Sie die Koordinaten des Schattenpunktes $F'$ von $F(6 \mid 0 \mid 3)$.",
        r"Die weiteren Schattenpunkte sind $E'(2 \mid 1 \mid 0)$, "
        r"$G'\left(\tfrac{22}{3} \mid \tfrac{14}{3} \mid 0\right)$ und "
        r"$H'\left(\tfrac{4}{3} \mid \tfrac{14}{3} \mid 0\right)$. Weisen Sie nach, dass "
        r"$E'F'G'H'$ ein Parallelogramm ist.",
        r"Berechnen Sie den Flächeninhalt des Schattens.",
        r"Beurteilen Sie die Aussage: „Der Schatten eines Daches ist stets größer als das "
        r"Dach selbst.“",
    ],
    [
        r"Der Lichtstrahl durch $F$ ist "
        r"$\vec{x} = \begin{pmatrix}6\\0\\3\end{pmatrix} + t \cdot "
        r"\begin{pmatrix}2\\1\\-3\end{pmatrix}$. Auf dem Untergrund ist $z = 0$: "
        r"$3 - 3t = 0$, also $t = 1$. Einsetzen liefert "
        r"$F'(8 \mid 1 \mid 0)$.",
        r"$\overrightarrow{E'F'} = \begin{pmatrix}6\\0\\0\end{pmatrix}$ und "
        r"$\overrightarrow{H'G'} = \begin{pmatrix}\tfrac{22}{3} - \tfrac{4}{3}\\0\\0"
        r"\end{pmatrix} = \begin{pmatrix}6\\0\\0\end{pmatrix}$. Zwei gegenüberliegende "
        r"Seiten sind parallel und gleich lang, also ist $E'F'G'H'$ ein Parallelogramm.",
        r"Mit $\overrightarrow{E'H'} = \begin{pmatrix}-\tfrac{2}{3}\\ \tfrac{11}{3}\\0"
        r"\end{pmatrix}$ ist "
        r"$A = \left|\overrightarrow{E'F'} \times \overrightarrow{E'H'}\right| = "
        r"\left|\begin{pmatrix}0\\0\\22\end{pmatrix}\right| = 22$. "
        r"Der Schatten ist $22$ m² groß.",
        r"Die Aussage ist **falsch**. Hier ist der Schatten mit $22$ m² **kleiner** als die "
        r"Dachfläche mit $6\sqrt{17} \approx 24{,}7$ m². Der Grund: Die Sonne steht so, dass "
        r"das Dach schräg getroffen wird — projiziert wird nur der Anteil senkrecht zur "
        r"Strahlrichtung. Erst wenn die Strahlen fast parallel zur Dachfläche einfallen, "
        r"wird der Schatten sehr groß.",
    ],
    falle=r"$\vec{s}$ zeigt **von der Sonne weg**, also nach unten ($z$-Komponente negativ). "
          r"Wer $\vec{s}$ als Richtung zur Sonne liest, rechnet mit $t < 0$ und landet hinter "
          r"dem Haus.",
    figs=[(fig_schatten(),
           "Die vier Sonnenstrahlen durch die Dachecken und der Schatten, den sie auf dem "
           "Untergrund erzeugen.")],
    solfigs=[(fig_aufsicht(),
              "Zu d): Aufsicht auf den Untergrund. Der Schatten (grau) ist gegenüber dem "
              "Grundriss des Daches (orange) verschoben und geschert — sein Flächeninhalt "
              "muss deshalb nicht größer sein.")],
)


def check():
    assert norm(sub(B, A)) == 6 and norm(sub(E, A)) == 3
    EF, EH, HG = sub(F, E), sub(H, E), sub(G, H)
    assert EF == HG, "EFGH ist kein Parallelogramm"
    assert dot(EF, EH) == 0, "kein rechter Winkel"
    assert abs(norm(EF) * norm(EH) - 6 * sqrt(17)) < 1e-12
    assert abs(6 * sqrt(17) - 24.7386) < 1e-3
    assert (3 + 2) / 2.0 * 4 * 6 == 60
    n = cross(EF, EH)
    assert n == (0, 6, 24)
    for p in (E, F, G, H):                       # every roof corner lies in the plane
        assert dot((0, 1, 4), p) == 12
    alpha = degrees(acos(abs(dot((0, 1, 4), (0, 0, 1))) / (norm((0, 1, 4)) * 1)))
    assert abs(alpha - 14.04) < 0.01
    dist = abs(dot((0, 1, 4), C) - 12) / norm((0, 1, 4))
    assert abs(dist - 8 / sqrt(17)) < 1e-12 and abs(dist - 1.94) < 0.005
    Es, Fs, Gs, Hs = (shadow(p) for p in (E, F, G, H))
    assert Fs == (Fr(8), Fr(1), Fr(0)), Fs
    assert Es == (Fr(2), Fr(1), Fr(0)) and Gs == (Fr(22, 3), Fr(14, 3), Fr(0))
    assert Hs == (Fr(4, 3), Fr(14, 3), Fr(0))
    assert sub(Fs, Es) == sub(Gs, Hs) == (Fr(6), Fr(0), Fr(0))
    area = norm(tuple(float(v) for v in cross(sub(Fs, Es), sub(Hs, Es))))
    assert abs(area - 22) < 1e-9
    assert area < 6 * sqrt(17), "der Schatten muesste hier kleiner sein als das Dach"


s.verify(check)
s.save()
