#!/usr/bin/env python3
"""Abitur-Training BGY - Analytische Geometrie, Leistungskurs.

    python3 tools/aufgaben/abi/geometrie_lk.py

The LK step up from tools/aufgaben/abi/geometrie.py: another body (a hip-roofed house
instead of the mono-pitch shed), a plane cutting a space diagonal, the surface-to-volume
ratio of two designs, and a pencil of planes through the ridge line. Wording, numbers
and figures are our own.
"""
import os
import sys
from fractions import Fraction as Fr
from math import acos, asin, degrees, sqrt

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from textaufgaben import Sheet                                     # noqa: E402
import svgfig as S                                                 # noqa: E402

# The body: a house with a hip roof (Walmdach). 1 LE = 1 m.
# x = depth (6 m), y = length (10 m), z = height. A is the origin, B on the x-axis,
# D on the y-axis, E on the z-axis - that keeps the figure readable.
A, B, C, D = (0, 0, 0), (6, 0, 0), (6, 10, 0), (0, 10, 0)
E, F, G, H = (0, 0, 4), (6, 0, 4), (6, 10, 4), (0, 10, 4)
P, Q = (3, 3, 6), (3, 7, 6)                 # ridge
SP = (Fr(2), Fr(10, 3), Fr(4, 3))           # where the plane BDE cuts the diagonal AG

# The projection of Solid is screen_x = ox + s*(y + kx*x), screen_y = oy - s*(z + ky*x).
# Checked numerically over all vertex pairs (and S): with the default skew the closest
# pair of image points, E and P, is 2.06 world units apart - nothing collides. The eaves
# height of 4 m also keeps the front eaves edge FG a full 1.3 units above the ground
# line through A and D, which 3 m did not (0.3 units, unreadable).
SKEW = (-0.35, -0.45)


def sub(p, q):
    return tuple(a - b for a, b in zip(p, q))


def dot(p, q):
    return sum(a * b for a, b in zip(p, q))


def cross(p, q):
    return (p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0])


def norm(p):
    return sqrt(dot(p, p))


# ----------------------------------------------------------------- figures ---
def _house(sd, faces=True, color=S.INK, width=1.5):
    """Edges of the house. Only A is hidden, so its three edges plus the eaves edge EH
    (both adjacent faces point away from the viewer) are dashed."""
    if faces:
        sd.shade([F, G, Q, P], S.ORANGE, 0.34)          # large roof face
        sd.shade([E, F, P], S.ORANGE, 0.22)             # hip triangle
        sd.shade([H, G, Q], S.ORANGE, 0.22)             # hip triangle, far side
        sd.shade([B, C, G, F], S.GREEN, 0.16)           # wall towards the viewer
        sd.shade([D, C, G, H], S.RED, 0.10)             # wall on the right
    sd.edges([(B, C), (C, D), (B, F), (C, G), (D, H), (E, F), (F, G), (G, H),
              (E, P), (F, P), (G, Q), (H, Q), (P, Q)], color=color, width=width)
    sd.edges([(A, B), (A, D), (A, E), (E, H)], dash="5 4",
             color=S.MUTED if color == S.INK else color)


def fig_haus():
    sd = S.Solid(w=610, h=400, scale=38, ox=145, oy=252, skew=SKEW)
    sd.axes(lx=7.0, ly=11.5, lz=6.0)
    _house(sd)
    for p, lab, pos in ((A, "A", "above-left"), (B, "B", "left"),
                        (C, "C", "below-right"), (D, "D", "below-right"),
                        (E, "E", "left"), (F, "F", "left"), (G, "G", "below-right"),
                        (H, "H", "right"), (P, "P", "above-left"), (Q, "Q", "above-right")):
        sd.vertex(p, lab, pos)
    sd.label3((3, 5, 6), "First", 0, -20, 12, S.MUTED)
    return sd.svg("Schraegbild des Wohnhauses mit Walmdach und den Eckpunkten A bis H "
                  "sowie P und Q")


def fig_diagonale():
    sd = S.Solid(w=610, h=400, scale=38, ox=145, oy=252, skew=SKEW)
    sd.axes(lx=7.0, ly=11.5, lz=6.0)
    sd.shade([B, D, E], S.GREEN, 0.30)
    _house(sd, faces=False, color=S.MUTED, width=1.1)
    sd.poly([sd.P(p) for p in (B, D, E)], stroke=S.GREEN, width=1.6, fill="none")
    sd.edge(A, G, S.RED, 2.0)
    for p, lab, pos in ((A, "A", "above-left"), (B, "B", "left"),
                        (D, "D", "below-right"), (E, "E", "left"), (G, "G", "right")):
        sd.vertex(p, lab, pos)
    sd.vertex(tuple(float(v) for v in SP), "S", "above", color=S.RED, size=3.4)
    sd.label3((3, 3.5, 0.6), "Ebene BDE", 0, 0, 11.5, S.GREEN)
    return sd.svg("Die Ebene durch B, D und E schneidet die Raumdiagonale von A nach G "
                  "im Punkt S")


def fig_schar():
    """Cut perpendicular to the ridge: every plane of the family shows up as a line
    through the single ridge point, and the one plane it misses as the dashed vertical.
    Equal scale on both axes, so the roof pitch is not distorted."""
    p = S.Plot((-1.5, 9.5), (-1.5, 9.5), w=500, h=486, pad=(36, 24, 16, 30))
    p.grid(1, 1)
    p.axes(1, 1, xlabel="x", ylabel="z")
    outline = [(0, 0), (6, 0), (6, 4), (3, 6), (0, 4)]
    p.raw('<path d="M %s Z" fill="%s" opacity="0.18"/>'
          % (" L ".join("%s %s" % (S.fmt(p.X(u)), S.fmt(p.Y(v))) for u, v in outline),
             S.ORANGE))
    p.poly([p.P(u, v) for u, v in outline], stroke=S.ORANGE, width=1.8, fill="none")
    # E_t: t*x + z = 3t + 6, i.e. z = 6 - t*(x - 3). Every line is cut off at z = 0.2
    # and z = 9.0, so no label ever lands on the axis or on a tick number.
    def zof(u, t):
        return 6 - float(t) * (u - 3)

    for t, col, wid in ((-2, S.MUTED, 1.2), (Fr(-2, 3), S.RED, 1.9), (0, S.MUTED, 1.2),
                        (Fr(2, 3), S.RED, 1.9), (2, S.MUTED, 1.2)):
        if t == 0:
            xs = (-1.2, 9.2)
        else:
            xs = sorted(max(-1.2, min(9.2, 3 + (6 - zz) / float(t))) for zz in (0.2, 9.0))
        p.seg((xs[0], zof(xs[0], t)), (xs[1], zof(xs[1], t)), col, wid)
    p.text(p.X(4.5) + 9, p.Y(9.0) + 4, "t = -2", 11.5, S.MUTED, "start", halo=S.PAPER)
    p.text(p.X(1.5) - 9, p.Y(9.0) + 4, "t = 2", 11.5, S.MUTED, "end", halo=S.PAPER)
    p.text(p.X(7.5) + 9, p.Y(9.0) + 4, "t = -2/3", 11.5, S.RED, "start", halo=S.PAPER)
    # below the line, not above: going left the line rises, so it stays clear of the text
    p.text(p.X(9.2), p.Y(zof(9.2, Fr(2, 3))) + 16, "t = 2/3", 11.5, S.RED, "end",
           halo=S.PAPER)
    p.text(p.X(9.2), p.Y(6) - 9, "t = 0", 11.5, S.MUTED, "end", halo=S.PAPER)
    p.seg((3, 0), (3, 9.0), S.GREEN, 1.6, dash="5 4")
    p.text(p.X(3) + 7, p.Y(9.0) + 4, "x = 3", 11.5, S.GREEN, "start", halo=S.PAPER)
    p.circle(p.X(3), p.Y(6), 4.2, S.RED)
    # six lines meet in the ridge point; the widest free wedge is the one between the
    # horizontal E_0 and the roof line E_2/3, so the label sits there with a leader
    p.line(p.X(3) - 16, p.Y(6) - 6, p.X(3) - 58, p.Y(6) - 19, S.MUTED, 1.0)
    p.text(p.X(3) - 78, p.Y(6) - 22, "First", 11.5, S.INK, halo=S.PAPER)
    return p.svg("Schnitt senkrecht zur Firstlinie: die Ebenen der Schar erscheinen als "
                 "Geraden durch den Firstpunkt")


def fig_av():
    """The two designs in cross-section, same scale on both axes - why the hip roof wins."""
    p = S.Plot((-1.0, 17.4), (-3.2, 7.6), w=560, h=336, pad=(16, 16, 14, 12))
    p.seg((-0.6, 0), (17.0, 0), S.MUTED, 1.2)
    haus = [(0, 0), (6, 0), (6, 4), (3, 6), (0, 4)]
    flach = [(10.4, 0), (16.4, 0), (16.4, 4.8), (10.4, 4.8)]
    for pts, col in ((haus, S.ORANGE), (flach, S.MUTED)):
        p.raw('<path d="M %s Z" fill="%s" opacity="0.20"/>'
              % (" L ".join("%s %s" % (S.fmt(p.X(u)), S.fmt(p.Y(v))) for u, v in pts), col))
        p.poly([p.P(u, v) for u, v in pts], stroke=col, width=1.8, fill="none")
    for x0, lines in ((3.0, ["Walmdachhaus", "V = 288 m³, A ≈ 260,1 m²",
                             "A : V ≈ 0,90 pro Meter"]),
                      (13.4, ["Flachdachbau, h = 4,8 m", "V = 288 m³, A = 273,6 m²",
                              "A : V = 0,95 pro Meter"])):
        for i, line in enumerate(lines):
            p.text(p.X(x0), p.Y(-0.85 - 0.85 * i), line, 12 if i == 0 else 11.5,
                   S.INK if i == 0 else S.BODY)
    p.brace(0, 6, 6.8, "6 m", S.MUTED)
    p.brace(10.4, 16.4, 6.8, "6 m", S.MUTED)
    return p.svg("Beide Bauformen im Querschnitt, gleicher Massstab")


# ------------------------------------------------------------------- sheet ---
s = Sheet("abitur-bgy-geometrie-lk", "Analytische Geometrie — Leistungskurs",
          kind="Abitur-Training",
          suffix="",
          klasse="Berufliches Gymnasium",
          sub="Berufliches Gymnasium · Leistungskurs · Pflichtaufgabe · "
              "drei Aufgaben, Anforderungsbereiche I bis III",
          desc="Abitur-Training Mathematik BGY Leistungskurs, Analytische Geometrie: "
               "Walmdachhaus im Koordinatensystem, Teilungsverhältnis einer Raumdiagonale, "
               "A/V-Verhältnis und Ebenenschar, mit Lösungen und Abbildungen.",
          plan=("../svp/mathe/abitur.html", "Zur Übersicht"))

KOERPER = (r"Ein Wohnhaus mit Walmdach wird modellhaft durch den Körper mit den Eckpunkten "
           r"$A(0 \mid 0 \mid 0)$, $B(6 \mid 0 \mid 0)$, $C(6 \mid 10 \mid 0)$, "
           r"$D(0 \mid 10 \mid 0)$, $E(0 \mid 0 \mid 4)$, $F(6 \mid 0 \mid 4)$, "
           r"$G(6 \mid 10 \mid 4)$ und $H$ beschrieben. Das Rechteck $ABCD$ ist die "
           r"Grundfläche, das Rechteck $EFGH$ die Traufebene. Die Firstlinie verbindet "
           r"$P(3 \mid 3 \mid 6)$ mit $Q(3 \mid 7 \mid 6)$. Die $x$-$y$-Ebene ist der "
           r"waagerechte Baugrund, eine Längeneinheit entspricht einem Meter.")

s.task(
    "Das Wohnhaus mit Walmdach", 1,
    KOERPER,
    [
        r"Ergänzen Sie die Koordinaten des fehlenden Eckpunktes $H$ und geben Sie die "
        r"Länge der Firstlinie $\overline{PQ}$ an.",
        r"Weisen Sie rechnerisch nach, dass die Wandfläche $BCGF$ ein Rechteck ist, und "
        r"berechnen Sie ihren Flächeninhalt.",
        r"Weisen Sie nach, dass die Dachfläche $FGQP$ ein gleichschenkliges Trapez, aber "
        r"kein Parallelogramm ist.",
        r"Berechnen Sie mithilfe des Kreuzprodukts den Flächeninhalt der Dachfläche "
        r"$FGQP$ und den des Walmdreiecks $EFP$. Geben Sie damit die gesamte Dachfläche an.",
    ],
    [
        r"$H$ liegt senkrecht über $D$ auf Traufhöhe. Aus "
        r"$\overrightarrow{DH} = \overrightarrow{AE} = \begin{pmatrix}0\\0\\4\end{pmatrix}$ "
        r"folgt $H(0 \mid 10 \mid 4)$. Für die Firstlinie ist "
        r"$\overrightarrow{PQ} = \begin{pmatrix}0\\4\\0\end{pmatrix}$, also "
        r"$\overline{PQ} = 4$ m.",
        r"$\overrightarrow{BC} = \begin{pmatrix}0\\10\\0\end{pmatrix}$ und "
        r"$\overrightarrow{FG} = \begin{pmatrix}0\\10\\0\end{pmatrix}$ sind gleich, "
        r"$BCGF$ ist also ein **Parallelogramm**. Mit "
        r"$\overrightarrow{BF} = \begin{pmatrix}0\\0\\4\end{pmatrix}$ ist "
        r"$\overrightarrow{BC} \circ \overrightarrow{BF} = 0 + 0 + 0 = 0$, benachbarte "
        r"Seiten stehen also senkrecht aufeinander. Ein Parallelogramm mit einem rechten "
        r"Winkel ist ein **Rechteck**; sein Flächeninhalt beträgt "
        r"$10 \cdot 4 = 40$ m².",
        r"Es ist $\overrightarrow{FG} = \begin{pmatrix}0\\10\\0\end{pmatrix}$ und "
        r"$\overrightarrow{PQ} = \begin{pmatrix}0\\4\\0\end{pmatrix} = 0{,}4 \cdot "
        r"\overrightarrow{FG}$: die beiden Seiten sind **parallel**, aber verschieden "
        r"lang — ein Trapez und kein Parallelogramm. Für die Schenkel gilt "
        r"$\overrightarrow{FP} = \begin{pmatrix}-3\\3\\2\end{pmatrix}$ und "
        r"$\overrightarrow{GQ} = \begin{pmatrix}-3\\-3\\2\end{pmatrix}$ mit "
        r"$\left|\overrightarrow{FP}\right| = \left|\overrightarrow{GQ}\right| = "
        r"\sqrt{9+9+4} = \sqrt{22}$. Das Trapez ist also **gleichschenklig**.",
        r"Zerlegung in die Dreiecke $FGQ$ und $FQP$ mit "
        r"$\overrightarrow{FQ} = \begin{pmatrix}-3\\7\\2\end{pmatrix}$: "
        r"$\overrightarrow{FG} \times \overrightarrow{FQ} = "
        r"\begin{pmatrix}20\\0\\30\end{pmatrix}$ und "
        r"$\overrightarrow{FQ} \times \overrightarrow{FP} = "
        r"\begin{pmatrix}8\\0\\12\end{pmatrix}$, also "
        r"$A_{FGQP} = \tfrac12\sqrt{1300} + \tfrac12\sqrt{208} = 5\sqrt{13} + 2\sqrt{13} "
        r"= 7\sqrt{13} \approx 25{,}2$ m². Für das Walmdreieck ist "
        r"$\overrightarrow{EF} \times \overrightarrow{EP} = "
        r"\begin{pmatrix}0\\-12\\18\end{pmatrix}$ und damit "
        r"$A_{EFP} = \tfrac12\sqrt{468} = 3\sqrt{13} \approx 10{,}8$ m². Beide Formen "
        r"kommen doppelt vor: $A_{\text{Dach}} = 2 \cdot 7\sqrt{13} + 2 \cdot 3\sqrt{13} "
        r"= 20\sqrt{13} \approx 72{,}1$ m².",
    ],
    falle=r"Die Höhe des Trapezes ist **nicht** die Schenkellänge $\sqrt{22} \approx "
          r"4{,}69$. Senkrecht zur Firstlinie gemessen ist die Dachbreite nur "
          r"$\sqrt{13} \approx 3{,}61$ — wer mit $\sqrt{22}$ rechnet, erhält "
          r"$32{,}8$ m² statt $25{,}2$ m² und macht das Dach um fast ein Drittel zu groß.",
    figs=[(fig_haus(),
           "Das Wohnhaus im Koordinatensystem. Nur die Ecke A liegt verdeckt; ihre Kanten "
           "und die verdeckte Traufkante sind gestrichelt.")],
)

s.task(
    "Ebene, Raumdiagonale und Kompaktheit", 2,
    r"Betrachtet wird weiterhin das Wohnhaus aus Aufgabe 1. Die Punkte $B$, $D$ und $E$ "
    r"legen eine Ebene $\sigma$ fest, die in der Ecke bei $A$ ein Stück des Baukörpers "
    r"abschneidet. Die Strecke von $A$ nach $G$ ist die Raumdiagonale des quaderförmigen "
    r"Wohnteils $ABCDEFGH$.",
    [
        r"Weisen Sie nach, dass $\sigma: 10x + 6y + 15z = 60$ eine Gleichung der Ebene "
        r"durch $B$, $D$ und $E$ ist.",
        r"Berechnen Sie die Größe des Winkels, unter dem die Raumdiagonale "
        r"$\overline{AG}$ die Ebene $\sigma$ schneidet.",
        r"Die Ebene $\sigma$ schneidet die Raumdiagonale $\overline{AG}$ im Punkt $S$. "
        r"Bestimmen Sie die Koordinaten von $S$ und das Verhältnis, in dem $S$ die "
        r"Strecke $\overline{AG}$ teilt.",
        r"Berechnen Sie das Volumen des Wohnhauses und vergleichen Sie sein Verhältnis "
        r"von Oberfläche zu Volumen mit dem eines Flachdachbaus gleicher Grundfläche und "
        r"gleichen Volumens. Zur Oberfläche zählen Bodenplatte, Wände und Dachflächen.",
    ],
    [
        r"Mit $\overrightarrow{BD} = \begin{pmatrix}-6\\10\\0\end{pmatrix}$ und "
        r"$\overrightarrow{BE} = \begin{pmatrix}-6\\0\\4\end{pmatrix}$ ist "
        r"$\vec{n} = \overrightarrow{BD} \times \overrightarrow{BE} = "
        r"\begin{pmatrix}40\\24\\60\end{pmatrix}$, gekürzt "
        r"$\begin{pmatrix}10\\6\\15\end{pmatrix}$ — das sind die Koeffizienten der "
        r"Gleichung. Einsetzen der drei Punkte: $B$: $10 \cdot 6 = 60$, $D$: "
        r"$6 \cdot 10 = 60$, $E$: $15 \cdot 4 = 60$. Alle drei erfüllen die Gleichung, "
        r"und da sie nicht auf einer Geraden liegen, ist $\sigma$ genau diese Ebene.",
        r"Die Gerade durch $A$ und $G$ hat den Richtungsvektor "
        r"$\vec{u} = \overrightarrow{AG} = \begin{pmatrix}6\\10\\4\end{pmatrix}$ mit "
        r"$\left|\vec{u}\right| = \sqrt{36+100+16} = \sqrt{152} = 2\sqrt{38}$; weiter "
        r"ist $\left|\vec{n}\right| = \sqrt{100+36+225} = \sqrt{361} = 19$ und "
        r"$\vec{n} \circ \vec{u} = 60 + 60 + 60 = 180$. Für den Schnittwinkel zwischen "
        r"Gerade und Ebene gilt "
        r"$\sin \alpha = \dfrac{\left|\vec{n} \circ \vec{u}\right|}"
        r"{\left|\vec{n}\right| \cdot \left|\vec{u}\right|} = "
        r"\dfrac{180}{19 \cdot 2\sqrt{38}} = \dfrac{90}{19\sqrt{38}} \approx 0{,}7684$, "
        r"also $\alpha \approx 50{,}2^\circ$.",
        r"Die Gerade $AG$ lautet $\vec{x} = t \cdot \begin{pmatrix}6\\10\\4\end{pmatrix}$. "
        r"Einsetzen in $\sigma$: $60t + 60t + 60t = 180t = 60$, also $t = \tfrac13$ und "
        r"$S\left(2 \mid \tfrac{10}{3} \mid \tfrac43\right)$. Wegen $t = \tfrac13$ ist "
        r"$\overline{AS} : \overline{SG} = \tfrac13 : \tfrac23$, das Teilungsverhältnis "
        r"ist also **$1 : 2$**. Elegant sieht man das so: Da $ABCDEFGH$ ein Quader mit "
        r"$A$ im Ursprung ist, gilt $\overrightarrow{OG} = \overrightarrow{OB} + "
        r"\overrightarrow{OD} + \overrightarrow{OE}$, und $S$ mit "
        r"$\overrightarrow{OS} = \tfrac13\left(\overrightarrow{OB} + \overrightarrow{OD} "
        r"+ \overrightarrow{OE}\right)$ ist gerade der Schwerpunkt des Dreiecks $BDE$.",
        r"Der Wohnteil ist ein Quader: $V_1 = 6 \cdot 10 \cdot 4 = 240$ m³. Das Walmdach "
        r"zerfällt in ein Prisma über der Firstlänge $4$ — Querschnitt ist ein Dreieck "
        r"mit Grundseite $6$ und Höhe $2$, also $6$ m² — und zwei Pyramiden mit der "
        r"Grundfläche $6 \cdot 3 = 18$ und der Höhe $2$: "
        r"$V_2 = 6 \cdot 4 + 2 \cdot \tfrac13 \cdot 18 \cdot 2 = 24 + 24 = 48$ m³. "
        r"Zusammen $V = 288$ m³. Zur Oberfläche tragen bei: Bodenplatte $60$ m², Wände "
        r"$2 \cdot (6+10) \cdot 4 = 128$ m² und Dach $20\sqrt{13} \approx 72{,}1$ m² — "
        r"zusammen $A \approx 260{,}1$ m², also "
        r"$\dfrac{A}{V} \approx 0{,}90\ \text{m}^{-1}$. Der Flachdachbau hat die Höhe "
        r"$h = \dfrac{288}{60} = 4{,}8$ m und damit "
        r"$A = 2 \cdot 60 + 32 \cdot 4{,}8 = 273{,}6$ m², also "
        r"$\dfrac{A}{V} = 0{,}95\ \text{m}^{-1}$. Obwohl das geneigte Dach zusätzliche "
        r"Fläche kostet, ist das Walmdachhaus die **kompaktere** Bauform: es braucht "
        r"rund $5\ \%$ weniger Hüllfläche je Kubikmeter.",
    ],
    falle=r"Beim Winkel zwischen Gerade und Ebene steht der **Sinus**, nicht der Kosinus. "
          r"Wer $\cos\alpha = 0{,}7684$ setzt, erhält $39{,}8^\circ$ — das ist der Winkel "
          r"zwischen Gerade und **Normale**. Beide ergänzen sich zu $90^\circ$.",
    figs=[(fig_diagonale(),
           "Die Ebene durch B, D und E schneidet die Ecke bei A ab. Der Schnittpunkt S "
           "liegt auf der roten Raumdiagonale von A nach G.")],
    solfigs=[(fig_av(),
              "Zu d): Beide Bauformen im Querschnitt. Der Flachdachbau muss für dasselbe "
              "Volumen 0,8 m höhere Wände bekommen — das kostet mehr Hüllfläche, als das "
              "geneigte Dach kostet.")],
)

s.task(
    "Die Ebenenschar am First", 3,
    r"Die Firstlinie liegt auf der Geraden $g$ durch $P(3 \mid 3 \mid 6)$ und "
    r"$Q(3 \mid 7 \mid 6)$. Für jede reelle Zahl $t$ ist durch "
    r"$E_t: t \cdot x + z = 3t + 6$ eine Ebene gegeben.",
    [
        r"Weisen Sie nach, dass die Gerade $g$ in **jeder** Ebene $E_t$ liegt.",
        r"Geben Sie an, welche Eckpunkte des Hauses in der Ebene $E_{2/3}$ liegen, und "
        r"deuten Sie das Ergebnis geometrisch.",
        r"Berechnen Sie den Schnittwinkel der beiden Dachebenen $E_{-2/3}$ und "
        r"$E_{2/3}$ und geben Sie an, wie groß der Öffnungswinkel des Daches am First ist.",
        r"Beurteilen Sie die Aussage: „Jede Ebene, die die Firstgerade $g$ enthält, lässt "
        r"sich in der Form $E_t$ schreiben.“",
    ],
    [
        r"Eine Gleichung von $g$ ist $\vec{x} = \begin{pmatrix}3\\3\\6\end{pmatrix} + "
        r"r \cdot \begin{pmatrix}0\\1\\0\end{pmatrix}$, $r \in \mathbb{R}$; ein "
        r"beliebiger Punkt von $g$ hat also die Koordinaten $(3 \mid 3+r \mid 6)$. "
        r"Einsetzen in $E_t$ liefert $t \cdot 3 + 6 = 3t + 6$ — eine wahre Aussage, und "
        r"zwar **unabhängig von $r$ und von $t$**. Der Grund: In der Gleichung von $E_t$ "
        r"kommt $y$ nicht vor, und auf $g$ sind $x = 3$ und $z = 6$ konstant. Damit liegt "
        r"$g$ in jeder Ebene der Schar.",
        r"$E_{2/3}: \tfrac23 x + z = 8$, mit $3$ multipliziert $2x + 3z = 24$. Einsetzen: "
        r"$F(6 \mid 0 \mid 4)$: $12 + 12 = 24$, $G(6 \mid 10 \mid 4)$: $24$, "
        r"$P$: $6 + 18 = 24$, $Q$: $24$ — diese vier liegen in der Ebene. Für die übrigen "
        r"Punkte kommt heraus: $A$ und $D$: $0$; $B$, $C$, $E$ und $H$: $12$. Die vier "
        r"Punkte $F$, $G$, $Q$, $P$ sind genau die Ecken der großen Dachfläche aus "
        r"Aufgabe 1: $E_{2/3}$ ist die **Ebene dieser Dachfläche**. Entsprechend gehört "
        r"$t = -\tfrac23$ zur gegenüberliegenden Dachfläche $EHQP$.",
        r"Aus $E_{-2/3}: -2x + 3z = 12$ und $E_{2/3}: 2x + 3z = 24$ liest man die "
        r"Normalenvektoren $\vec{n_1} = \begin{pmatrix}-2\\0\\3\end{pmatrix}$ und "
        r"$\vec{n_2} = \begin{pmatrix}2\\0\\3\end{pmatrix}$ ab. Es folgt "
        r"$\cos \varphi = \dfrac{\left|\vec{n_1} \circ \vec{n_2}\right|}"
        r"{\left|\vec{n_1}\right| \cdot \left|\vec{n_2}\right|} = "
        r"\dfrac{\left|-4+9\right|}{\sqrt{13} \cdot \sqrt{13}} = \dfrac{5}{13} \approx "
        r"0{,}3846$, also $\varphi \approx 67{,}4^\circ$. Der Öffnungswinkel des Daches "
        r"am First ist der Nebenwinkel dazu: $180^\circ - 67{,}4^\circ \approx "
        r"112{,}6^\circ$.",
        r"Die Aussage ist **falsch**. Gegenbeispiel ist die Ebene $x = 3$: wegen "
        r"$x_P = x_Q = 3$ enthält sie die ganze Gerade $g$. In jeder Gleichung "
        r"$t \cdot x + z = 3t + 6$ hat $z$ jedoch den Koeffizienten $1$, und auch nach "
        r"Multiplikation mit einem $\lambda \neq 0$ bleibt dieser Koeffizient von null "
        r"verschieden — in $x = 3$ kommt $z$ überhaupt nicht vor. Die Schar erfasst also "
        r"alle Ebenen durch $g$ **bis auf diese eine**; für $t \to \pm\infty$ nähern sich "
        r"die Ebenen $E_t$ ihr nur an. Richtig wäre: Jede Ebene durch $g$, die nicht "
        r"senkrecht zur $x$-$y$-Ebene steht, gehört zur Schar.",
    ],
    falle=r"Der Schnittwinkel zweier Ebenen ist stets der **spitze** Winkel, hier "
          r"$67{,}4^\circ$. Wer ihn als Dachöffnung angibt, verwechselt ihn mit seinem "
          r"Nebenwinkel $112{,}6^\circ$ — ein First mit $67^\circ$ gehörte zu einem "
          r"deutlich steileren Dach als dem gezeichneten.",
    figs=[(fig_schar(),
           "Schnitt senkrecht zur Firstlinie. Jede Ebene der Schar erscheint als Gerade "
           "durch den Firstpunkt; die gestrichelte Senkrechte gehört zu keinem t.")],
)


def check():
    # --- task 1 -------------------------------------------------------------
    assert sub(H, D) == sub(E, A) == (0, 0, 4), "H liegt nicht ueber D"
    assert sub(Q, P) == (0, 4, 0) and norm(sub(Q, P)) == 4
    BC, FG, BF = sub(C, B), sub(G, F), sub(F, B)
    assert BC == FG == (0, 10, 0) and BF == (0, 0, 4)
    assert dot(BC, BF) == 0, "BCGF hat keinen rechten Winkel"
    assert norm(BC) * norm(BF) == 40
    PQ, FP, GQ = sub(Q, P), sub(P, F), sub(Q, G)
    assert PQ == (0, 4, 0)
    assert [Fr(a) for a in PQ] == [Fr(2, 5) * a for a in FG], "PQ ist nicht 0,4*FG"
    assert norm(PQ) != norm(FG), "sonst waere es ein Parallelogramm"
    assert FP == (-3, 3, 2) and GQ == (-3, -3, 2)
    assert dot(FP, FP) == dot(GQ, GQ) == 22, "nicht gleichschenklig"
    FQ = sub(Q, F)
    assert FQ == (-3, 7, 2)
    c1, c2 = cross(FG, FQ), cross(FQ, FP)
    assert c1 == (20, 0, 30) and c2 == (8, 0, 12)
    assert dot(c1, c1) == 1300 and dot(c2, c2) == 208
    a_trapez = (norm(c1) + norm(c2)) / 2.0
    assert abs(a_trapez - 7 * sqrt(13)) < 1e-9
    assert abs(a_trapez - 25.2389) < 1e-3
    assert abs(a_trapez - (10 + 4) / 2.0 * sqrt(13)) < 1e-9, "Trapezformel widerspricht"
    c3 = cross(sub(F, E), sub(P, E))
    assert c3 == (0, -12, 18) and dot(c3, c3) == 468
    a_walm = norm(c3) / 2.0
    assert abs(a_walm - 3 * sqrt(13)) < 1e-9 and abs(a_walm - 10.8167) < 1e-3
    a_dach = 2 * a_trapez + 2 * a_walm
    assert abs(a_dach - 20 * sqrt(13)) < 1e-9 and abs(a_dach - 72.111) < 1e-3
    assert abs(sqrt(22) - 4.690) < 5e-4 and abs(sqrt(13) - 3.606) < 5e-4
    assert abs((10 + 4) / 2.0 * sqrt(22) - 32.83) < 5e-3, "Fallen-Zahl stimmt nicht"

    # --- task 2 -------------------------------------------------------------
    BD, BE = sub(D, B), sub(E, B)
    assert BD == (-6, 10, 0) and BE == (-6, 0, 4)
    n4 = cross(BD, BE)
    assert n4 == (40, 24, 60)
    n = tuple(v // 4 for v in n4)
    assert n == (10, 6, 15)
    for p in (B, D, E):
        assert dot(n, p) == 60, "Punkt liegt nicht in sigma"
    u = sub(G, A)
    assert u == (6, 10, 4)
    assert dot(u, u) == 152 and dot(n, n) == 361 and norm(n) == 19 and dot(n, u) == 180
    sin_a = abs(dot(n, u)) / (norm(n) * norm(u))
    assert abs(sin_a - 90 / (19 * sqrt(38))) < 1e-12 and abs(sin_a - 0.7684) < 5e-5
    alpha = degrees(asin(sin_a))
    assert abs(alpha - 50.2) < 0.05 and abs(90 - alpha - 39.8) < 0.05
    t = Fr(60, 180)
    assert t == Fr(1, 3)
    assert tuple(t * v for v in u) == SP, "S stimmt nicht"
    assert dot(n, [float(v) for v in SP]) == 60
    assert tuple(a + b + c for a, b, c in zip(B, D, E)) == G, "G ist nicht B+D+E"
    assert tuple(Fr(1, 3) * (a + b + c) for a, b, c in zip(B, D, E)) == SP, "kein Schwerpunkt"
    v_quader = 6 * 10 * 4
    v_dach = 6 * 4 + 2 * Fr(1, 3) * 18 * 2
    assert v_quader == 240 and v_dach == 48
    vol = v_quader + v_dach
    assert vol == 288
    # independent check of the roof volume: integrate the cross-section (6-3s)(10-3s)
    n_steps = 200000
    approx = sum((6 - 3 * (i + 0.5) * 2.0 / n_steps) * (10 - 3 * (i + 0.5) * 2.0 / n_steps)
                 for i in range(n_steps)) * 2.0 / n_steps
    assert abs(approx - 48) < 1e-6, approx
    assert 2 * (6 + 10) * 4 == 128
    a_haus = 60 + 128 + a_dach
    assert abs(a_haus - 260.111) < 1e-3
    assert abs(a_haus / vol - 0.9032) < 5e-5
    h_flach = Fr(288, 60)
    assert h_flach == Fr(24, 5) and float(h_flach) == 4.8
    assert h_flach - 4 == Fr(4, 5), "0,8 m hoehere Waende"
    a_flach = 2 * 60 + 2 * (6 + 10) * float(h_flach)
    assert abs(a_flach - 273.6) < 1e-9
    assert abs(a_flach / vol - 0.95) < 1e-9
    assert a_haus < a_flach, "das Walmdachhaus muesste kompakter sein"
    assert abs((a_flach - a_haus) / a_haus * 100 - 5.19) < 0.02, "rund 5 Prozent"

    # --- task 3 -------------------------------------------------------------
    for tt in (Fr(-7, 2), Fr(-2, 3), Fr(0), Fr(2, 3), Fr(5)):
        for r in (Fr(-3), Fr(0), Fr(4)):
            pt = (Fr(3), Fr(3) + r, Fr(6))                   # a point of g
            assert tt * pt[0] + pt[2] == 3 * tt + 6, "g liegt nicht in E_t"
    named = dict(A=A, B=B, C=C, D=D, E=E, F=F, G=G, H=H, P=P, Q=Q)
    e23 = {k: Fr(2, 3) * p[0] + p[2] - 8 for k, p in named.items()}
    assert {k for k, v in e23.items() if v == 0} == {"F", "G", "P", "Q"}, e23
    assert [2 * p[0] + 3 * p[2] for p in (A, D)] == [0, 0]
    assert [2 * p[0] + 3 * p[2] for p in (B, C, E, H)] == [12, 12, 12, 12]
    assert [2 * p[0] + 3 * p[2] for p in (F, G, P, Q)] == [24, 24, 24, 24]
    for p in (E, H, P, Q):
        assert -2 * p[0] + 3 * p[2] == 12, "E_{-2/3} traegt nicht die zweite Dachflaeche"
    n1, n2 = (-2, 0, 3), (2, 0, 3)
    assert dot(n1, n2) == 5 and dot(n1, n1) == dot(n2, n2) == 13
    cosphi = abs(dot(n1, n2)) / (norm(n1) * norm(n2))
    assert abs(cosphi - 5 / 13.0) < 1e-12 and abs(cosphi - 0.3846) < 5e-5
    phi = degrees(acos(cosphi))
    assert abs(phi - 67.4) < 0.05 and abs(180 - phi - 112.6) < 0.05
    # the plane x = 3 carries g but has no z-term, so it belongs to no t
    assert all(p[0] == 3 for p in (P, Q))
    for tt in (Fr(-100), Fr(-1), Fr(0), Fr(1), Fr(1000)):
        assert tt * 0 + 1 != 0, "der Koeffizient von z ist nie null"
    # roof pitch, for the Falle: a ridge angle of 67 degrees would be far steeper
    assert degrees(acos(3 / sqrt(13))) < 34, "Dachneigung unter 34 Grad"


s.verify(check)
s.save()
