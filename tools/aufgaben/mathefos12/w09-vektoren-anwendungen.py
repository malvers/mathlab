#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 9 (LB 1): Vektorrechnung - vermischte Anwendungen im Stil
der FHR-Prüfung: Quader und Pyramide im Koordinatensystem, Kanten, Winkel, Ebenen durch
Seitenflächen, Durchstoßpunkte, Abstände, Flächen; Lagebeziehungen; Satteldach.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec
from svgfig import Solid, INK, MUTED, ORANGE

Q = fos12(nr=9, slug='vektoren-anwendungen', thema='Vektorrechnung: Anwendungen', lb='LB 1',
          blurb='vermischte Aufgaben zu Geraden, Ebenen und Körpern',
          comment='Blocks: Quader (1-6), Pyramide (7-13), Lagebeziehungen und Transfer (14-18), Satteldach (19-20). Alles ohne CAS.')


# ---------------------------------------------------------------- figures ----
def fig_quader():
    """Cuboid A(0|0|0) ... G(6|4|3), hidden edges at the origin dashed."""
    s = Solid(w=420, h=300, scale=28, ox=170, oy=180)
    A, B, C, D = (0, 0, 0), (6, 0, 0), (6, 4, 0), (0, 4, 0)
    E, Fp, G, H = (0, 0, 3), (6, 0, 3), (6, 4, 3), (0, 4, 3)
    s.axes(lx=8, ly=6, lz=4.5)
    s.shade([E, Fp, G, H])
    s.edges([(A, B), (A, D), (A, E)], color=MUTED, dash='4 3')
    s.edges([(B, C), (C, D), (B, Fp), (C, G), (D, H), (E, Fp), (Fp, G), (G, H), (H, E)])
    s.edge(A, G, color=ORANGE, width=1.8)
    for p, lab, pos in ((A, 'A', 'above-left'), (B, 'B', 'below-left'), (C, 'C', 'below-right'),
                        (D, 'D', 'right'), (E, 'E', 'above-left'), (Fp, 'F', 'left'),
                        (G, 'G', 'right'), (H, 'H', 'above-right')):
        s.vertex(p, lab, pos)
    return s.svg('Quader ABCDEFGH mit Raumdiagonale AG')


def fig_pyramide():
    """Square pyramid ABCD with apex S(2|2|6); the hidden edges are dashed."""
    s = Solid(w=420, h=300, scale=28, ox=170, oy=200)
    A, B, C, D, S = (0, 0, 0), (4, 0, 0), (4, 4, 0), (0, 4, 0), (2, 2, 6)
    s.axes(lx=6, ly=6, lz=4)
    s.shade([B, C, S])
    s.edges([(A, B), (A, D), (A, S)], color=MUTED, dash='4 3')
    s.edges([(B, C), (C, D), (B, S), (C, S), (D, S)])
    for p, lab, pos in ((A, 'A', 'above-left'), (B, 'B', 'below-left'), (C, 'C', 'below-right'),
                        (D, 'D', 'right'), (S, 'S', 'above')):
        s.vertex(p, lab, pos)
    return s.svg('Quadratische Pyramide ABCDS')


FIG_Q = fig_quader()
FIG_P = fig_pyramide()
for f in (FIG_Q, FIG_P):
    assert "'" not in f, 'figure contains a straight quote'

QUADER = r'Ein Quader hat die Ecken $A(0|0|0)$, $B(6|0|0)$, $C(6|4|0)$, $D(0|4|0)$, $E(0|0|3)$, $F(6|0|3)$, $G(6|4|3)$ und $H(0|4|3)$. '
PYR = r'Eine quadratische Pyramide hat die Grundfläche $ABCD$ mit $A(0|0|0)$, $B(4|0|0)$, $C(4|4|0)$, $D(0|4|0)$ und die Spitze $S(2|2|6)$. '

# ------------------------------------------------------------------ Quader ----
Q.q(QUADER + r'Wie lang ist die Raumdiagonale $\overline{AG}$?',
    [r'$\sqrt{61} \approx 7{,}81$', r'$13$', r'$\sqrt{52} \approx 7{,}21$', r'$61$'],
    [r'$\overrightarrow{AG} = ' + vec(6, 4, 3) + r'$',
     r'$|\overrightarrow{AG}| = \sqrt{36 + 16 + 9} = \sqrt{61} \approx 7{,}81$',
     r'$\sqrt{52}$ wäre nur die Flächendiagonale $\overline{AC}$ in der Grundfläche.'],
    fig=FIG_Q, figcap=r'Quader $ABCDEFGH$ mit Raumdiagonale $\overline{AG}$')

Q.q(QUADER + r'Unter welchem Winkel ist die Raumdiagonale $\overline{AG}$ gegen die Grundfläche $ABCD$ geneigt?',
    [r'$\approx 22{,}6^\circ$', r'$\approx 67{,}4^\circ$', r'$\approx 26{,}6^\circ$', r'$30^\circ$'],
    [r'Der Winkel liegt zwischen $\overrightarrow{AG} = ' + vec(6, 4, 3) + r'$ und seiner Projektion $\overrightarrow{AC} = ' + vec(6, 4, 0) + r'$ in der Grundfläche.',
     r'$\cos\varphi = \dfrac{\overrightarrow{AG} \cdot \overrightarrow{AC}}{|\overrightarrow{AG}| \cdot |\overrightarrow{AC}|} = \dfrac{36 + 16}{\sqrt{61} \cdot \sqrt{52}} = \dfrac{52}{\sqrt{3172}} \approx 0{,}9233$',
     r'$\varphi \approx 22{,}6^\circ$; Probe im rechtwinkligen Dreieck $ACG$: $\tan\varphi = \dfrac{3}{\sqrt{52}} \approx 0{,}416$.',
     r'Falle: $\tan\varphi = \dfrac{3}{6}$ ($26{,}6^\circ$) wäre der Winkel zur Kante $\overline{AB}$, nicht zur Grundfläche.'])

Q.q(QUADER + r'Wie lautet eine Koordinatengleichung der Ebene durch $B$, $D$ und $E$?',
    [r'$2x + 3y + 4z = 12$', r'$2x + 3y + 4z = 0$', r'$6x + 4y + 3z = 12$', r'$2x - 3y + 4z = 12$'],
    [r'$\overrightarrow{BD} = ' + vec(-6, 4, 0) + r'$, $\overrightarrow{BE} = ' + vec(-6, 0, 3) + r'$',
     r'$\vec n = \overrightarrow{BD} \times \overrightarrow{BE} = ' + vec(12, 18, 24) + r'$, gekürzt $' + vec(2, 3, 4) + r'$',
     r'$B$ einsetzen: $2 \cdot 6 = 12$, also $2x + 3y + 4z = 12$. Probe mit $D$: $12$, mit $E$: $12$.'])

Q.q(QUADER + r'Von $E$ aus verläuft ein Lichtstrahl in Richtung $' + vec(2, 1, -1) + r'$. Wo trifft er die Ebene der Grundfläche ($z = 0$)?',
    [r'$(6|3|0)$ - auf der Kante $\overline{BC}$', r'$(2|1|2)$', r'$(6|3|3)$', r'$(0|0|0)$'],
    [r'Strahl: $\vec x = ' + vec(0, 0, 3) + r' + t \cdot ' + vec(2, 1, -1) + r'$',
     r'$z = 3 - t = 0$, also $t = 3$: Punkt $(6|3|0)$',
     r'$x = 6$ und $0 \le y = 3 \le 4$: der Punkt liegt auf der Kante $\overline{BC}$.'])

Q.q(QUADER + r'Die Ebene durch $B$, $D$ und $E$ hat die Gleichung $2x + 3y + 4z = 12$. Wie weit ist die Ecke $G$ von dieser Ebene entfernt?',
    [r'$d = \dfrac{24}{\sqrt{29}} \approx 4{,}46$', r'$d = 24$', r'$d = \dfrac{36}{\sqrt{29}} \approx 6{,}69$', r'$d = \dfrac{24}{29} \approx 0{,}83$'],
    [r'$G(6|4|3)$ einsetzen: $2 \cdot 6 + 3 \cdot 4 + 4 \cdot 3 - 12 = 36 - 12 = 24$',
     r'$|\vec n| = \sqrt{4 + 9 + 16} = \sqrt{29}$',
     r'$d = \dfrac{24}{\sqrt{29}} \approx 4{,}46$',
     r'Falle: die $-12$ vergessen ($36$) oder durch $|\vec n|^2$ teilen.'])

Q.q(QUADER + r'Berechne den Flächeninhalt des Schnittdreiecks $BDE$.',
    [r'$A \approx 16{,}16$', r'$A \approx 32{,}31$', r'$A = 12$', r'$A \approx 8{,}08$'],
    [r'$\overrightarrow{BD} \times \overrightarrow{BE} = ' + vec(-6, 4, 0) + r' \times ' + vec(-6, 0, 3) + r' = ' + vec(12, 18, 24) + r'$',
     r'$|' + vec(12, 18, 24) + r'| = \sqrt{144 + 324 + 576} = \sqrt{1044} \approx 32{,}31$',
     r'$A = \tfrac{1}{2} \cdot \sqrt{1044} \approx 16{,}16$',
     r'Falle: $12 = \tfrac{1}{2} \cdot 6 \cdot 4$ wäre der Grundriss $ABD$, das Dreieck $BDE$ steht aber schräg im Raum.'])

# ---------------------------------------------------------------- Pyramide ----
Q.q(PYR + r'Wie lang ist die Seitenkante $\overline{AS}$?',
    [r'$\sqrt{44} \approx 6{,}63$', r'$6$', r'$\sqrt{40} \approx 6{,}32$', r'$44$'],
    [r'$\overrightarrow{AS} = ' + vec(2, 2, 6) + r'$',
     r'$|\overrightarrow{AS}| = \sqrt{4 + 4 + 36} = \sqrt{44} \approx 6{,}63$',
     r'$6$ ist die Höhe der Pyramide, $\sqrt{40}$ die Höhe einer Seitenfläche - beides kürzer als die Kante.'],
    fig=FIG_P, figcap=r'Quadratische Pyramide $ABCDS$')

Q.q(PYR + r'Unter welchem Winkel ist die Seitenkante $\overline{AS}$ gegen die Grundfläche geneigt?',
    [r'$\approx 64{,}8^\circ$', r'$\approx 71{,}6^\circ$', r'$\approx 25{,}2^\circ$', r'$45^\circ$'],
    [r'Der Fußpunkt der Höhe ist $M(2|2|0)$; im rechtwinkligen Dreieck $AMS$ gilt $\tan\varphi = \dfrac{|\overline{MS}|}{|\overline{AM}|}$.',
     r'$|\overline{AM}| = \sqrt{4 + 4} = \sqrt{8}$, also $\tan\varphi = \dfrac{6}{\sqrt{8}} \approx 2{,}121$',
     r'$\varphi \approx 64{,}8^\circ$',
     r'Falle: $\tan\varphi = \dfrac{6}{2}$ ($71{,}6^\circ$) ist der Neigungswinkel einer Seitenfläche, nicht der Kante.'])

Q.q(PYR + r'Wie lautet eine Koordinatengleichung der Ebene, in der die Seitenfläche $BCS$ liegt?',
    [r'$3x + z = 12$', r'$3x + z = 0$', r'$x + 3z = 12$', r'$3x + 4y + z = 12$'],
    [r'$\overrightarrow{BC} = ' + vec(0, 4, 0) + r'$, $\overrightarrow{BS} = ' + vec(-2, 2, 6) + r'$',
     r'$\vec n = \overrightarrow{BC} \times \overrightarrow{BS} = ' + vec(24, 0, 8) + r'$, gekürzt $' + vec(3, 0, 1) + r'$',
     r'$B(4|0|0)$ einsetzen: $3 \cdot 4 + 0 = 12$. Probe mit $S$: $3 \cdot 2 + 6 = 12$.'])

Q.q(PYR + r'Die Seitenfläche $BCS$ liegt in der Ebene $3x + z = 12$. Unter welchem Winkel ist diese Seitenfläche gegen die Grundfläche geneigt?',
    [r'$\approx 71{,}6^\circ$', r'$\approx 18{,}4^\circ$', r'$\approx 64{,}8^\circ$', r'$\approx 56{,}3^\circ$'],
    [r'Der Winkel zweier Ebenen ist der Winkel ihrer Normalenvektoren: $' + vec(3, 0, 1) + r'$ und $' + vec(0, 0, 1) + r'$ (Grundfläche).',
     r'$\cos\varphi = \dfrac{0 + 0 + 1}{\sqrt{10} \cdot 1} = \dfrac{1}{\sqrt{10}} \approx 0{,}316$',
     r'$\varphi \approx 71{,}6^\circ$; Probe: $\tan\varphi = \dfrac{6}{2} = 3$ im Dreieck aus Höhe und halber Grundkante.',
     r'$18{,}4^\circ$ ist der Winkel der Seitenfläche zur $z$-Achse - das Komplement.'])

Q.q(PYR + r'Berechne den Flächeninhalt der Seitenfläche $BCS$.',
    [r'$A = 4\sqrt{10} \approx 12{,}65$', r'$A \approx 25{,}30$', r'$A = 12$', r'$A = 16$'],
    [r'$\overrightarrow{BC} \times \overrightarrow{BS} = ' + vec(0, 4, 0) + r' \times ' + vec(-2, 2, 6) + r' = ' + vec(24, 0, 8) + r'$',
     r'$A = \tfrac{1}{2} \cdot \sqrt{576 + 0 + 64} = \tfrac{1}{2} \cdot \sqrt{640} = 4\sqrt{10} \approx 12{,}65$',
     r'Probe: Grundkante $4$, Seitenhöhe $\sqrt{2^2 + 6^2} = \sqrt{40}$, also $\tfrac{1}{2} \cdot 4 \cdot \sqrt{40} \approx 12{,}65$.',
     r'Falle: mit der Pyramidenhöhe $6$ statt der Seitenhöhe kommt $12$ heraus.'])

Q.q(PYR + r'Berechne das Volumen der Pyramide.',
    [r'$V = 32$', r'$V = 96$', r'$V = 48$', r'$V = 16$'],
    [r'Grundfläche: Quadrat mit Kante $4$, also $G = 16$; Höhe = Abstand von $S$ zur Grundflächenebene $z = 0$: $h = 6$',
     r'$V = \tfrac{1}{3} \cdot G \cdot h = \tfrac{1}{3} \cdot 16 \cdot 6 = 32$',
     r'Falle: $\tfrac{1}{3}$ vergessen ($96$) oder $\tfrac{1}{2}$ statt $\tfrac{1}{3}$ ($48$).'])

Q.q(PYR + r'Die Gerade durch die Spitze $S$ und den Punkt $P(3|4|3)$ wird über $P$ hinaus verlängert. In welchem Punkt durchstößt sie die Ebene der Grundfläche ($z = 0$)?',
    [r'$(4|6|0)$', r'$(3|4|3)$', r'$(0|-2|12)$', r'$(5|8|-3)$'],
    [r'Richtung: $\overrightarrow{SP} = ' + vec(1, 2, -3) + r'$, Gerade: $\vec x = ' + vec(2, 2, 6) + r' + t \cdot ' + vec(1, 2, -3) + r'$',
     r'$z = 6 - 3t = 0$, also $t = 2$: Durchstoßpunkt $(4|6|0)$',
     r'Wegen $y = 6 > 4$ liegt der Punkt außerhalb der Grundfläche $ABCD$.'])

# --------------------------------------------- Lagebeziehungen und Transfer ----
Q.q(r'Welche Lage haben die Geraden $g\colon \vec x = ' + vec(1, 2, 0) + r' + t \cdot ' + vec(1, 0, 1) + r'$ und $h\colon \vec x = ' + vec(3, 2, 2) + r' + s \cdot ' + vec(2, 0, 2) + r'$ zueinander?',
    [r'$g$ und $h$ sind identisch.', r'$g$ und $h$ sind echt parallel.', r'$g$ und $h$ schneiden sich im Punkt $(3|2|2)$.', r'$g$ und $h$ sind windschief.'],
    [r'Richtungsvektoren: $' + vec(2, 0, 2) + r' = 2 \cdot ' + vec(1, 0, 1) + r'$, also parallel.',
     r'Punktprobe: liegt der Stützpunkt $(3|2|2)$ von $h$ auf $g$? $' + vec(3, 2, 2) + r' = ' + vec(1, 2, 0) + r' + 2 \cdot ' + vec(1, 0, 1) + r'$ - ja, mit $t = 2$.',
     r'Parallel und ein gemeinsamer Punkt: die Geraden sind identisch. „Schnittpunkt“ wäre falsch, sie haben alle Punkte gemeinsam.'])

Q.q(r'Berechne den Schnittwinkel der Geraden $g\colon \vec x = ' + vec(1, 0, 0) + r' + t \cdot ' + vec(1, 1, 0) + r'$ und $h\colon \vec x = ' + vec(1, 0, 0) + r' + s \cdot ' + vec(1, 0, 1) + r'$.',
    [r'$60^\circ$', r'$30^\circ$', r'$45^\circ$', r'$90^\circ$'],
    [r'$\cos\varphi = \dfrac{|\vec u \cdot \vec v|}{|\vec u| \cdot |\vec v|} = \dfrac{|1 + 0 + 0|}{\sqrt{2} \cdot \sqrt{2}} = \dfrac{1}{2}$',
     r'$\varphi = 60^\circ$',
     r'Falle: $\cos\varphi = \tfrac{1}{2}$ mit $\sin$ verwechselt ergibt $30^\circ$.'])

Q.q(r'Untersuche die Lage der Geraden $g\colon \vec x = ' + vec(1, 0, 2) + r' + t \cdot ' + vec(2, -1, 1) + r'$ zur Ebene $E\colon x + 2y = 3$.',
    [r'$g$ ist echt parallel zu $E$.', r'$g$ liegt in $E$.', r'$g$ schneidet $E$ in genau einem Punkt.', r'$g$ steht senkrecht auf $E$.'],
    [r'$\vec n \cdot \vec u = ' + vec(1, 2, 0) + r' \cdot ' + vec(2, -1, 1) + r' = 2 - 2 + 0 = 0$: Richtungsvektor und Normalenvektor stehen senkrecht, also $g \parallel E$.',
     r'Punktprobe mit dem Stützpunkt: $1 + 2 \cdot 0 = 1 \neq 3$, der Punkt liegt nicht in $E$.',
     r'Also echt parallel - $g$ liegt nicht in $E$.'])

Q.q(r'Die Sonne scheint parallel zum Vektor $' + vec(1, 2, -2) + r'$ auf die Pyramide mit der Spitze $S(2|2|6)$. Wo liegt der Schatten der Spitze auf dem Boden ($z = 0$)?',
    [r'$(5|8|0)$', r'$(2|2|0)$', r'$(3|4|4)$', r'$(-1|-4|12)$'],
    [r'Lichtstrahl durch $S$: $\vec x = ' + vec(2, 2, 6) + r' + t \cdot ' + vec(1, 2, -2) + r'$',
     r'$z = 6 - 2t = 0$, also $t = 3$: Schattenpunkt $(5|8|0)$',
     r'Falle: $(2|2|0)$ wäre der Schatten bei senkrecht stehender Sonne.'])

Q.q(r'Das Viereck $ABCD$ mit $A(1|1|0)$, $B(4|1|0)$, $C(4|3|2)$ und $D(1|3|2)$ ist ein Rechteck. Berechne seinen Flächeninhalt.',
    [r'$A = 6\sqrt{2} \approx 8{,}49$', r'$A = 6$', r'$A = 12$', r'$A = 8$'],
    [r'$\overrightarrow{AB} = ' + vec(3, 0, 0) + r' = \overrightarrow{DC}$ (Parallelogramm) und $\overrightarrow{AB} \cdot \overrightarrow{AD} = ' + vec(3, 0, 0) + r' \cdot ' + vec(0, 2, 2) + r' = 0$ (rechter Winkel).',
     r'$\overrightarrow{AB} \times \overrightarrow{AD} = ' + vec(0, -6, 6) + r'$, $A = \sqrt{0 + 36 + 36} = \sqrt{72} = 6\sqrt{2} \approx 8{,}49$',
     r'Probe: Seiten $|\overrightarrow{AB}| = 3$ und $|\overrightarrow{AD}| = \sqrt{8}$, also $3 \cdot \sqrt{8} = 6\sqrt{2}$.',
     r'Falle: $3 \cdot 2 = 6$ ignoriert die $z$-Koordinate von $\overrightarrow{AD}$.'])

# -------------------------------------------------------------- Satteldach ----
DACH = r'Ein Satteldach hat die Traufpunkte $A(0|0|3)$, $B(8|0|3)$, $C(8|6|3)$, $D(0|6|3)$ und die Firstpunkte $E(0|3|5)$, $F(8|3|5)$ (in Metern). '
Q.q(DACH + r'Wie groß ist die Dachfläche $ABFE$?',
    [r'$\approx 28{,}84\,\mathrm{m}^2$', r'$24\,\mathrm{m}^2$', r'$\approx 57{,}69\,\mathrm{m}^2$', r'$16\,\mathrm{m}^2$'],
    [r'$\overrightarrow{AB} = ' + vec(8, 0, 0) + r'$, $\overrightarrow{AE} = ' + vec(0, 3, 2) + r'$',
     r'$\overrightarrow{AB} \times \overrightarrow{AE} = ' + vec(0, -16, 24) + r'$, $A = \sqrt{256 + 576} = \sqrt{832} \approx 28{,}84\,\mathrm{m}^2$',
     r'Probe: Sparrenlänge $|\overrightarrow{AE}| = \sqrt{13} \approx 3{,}61$, mal $8$ ergibt $28{,}84$.',
     r'Falle: $8 \cdot 3 = 24$ ist der Grundriss, $57{,}69$ wären beide Dachhälften.'])

Q.q(DACH + r'Unter welchem Winkel ist die Dachfläche $ABFE$ gegen die Waagerechte geneigt?',
    [r'$\approx 33{,}7^\circ$', r'$\approx 56{,}3^\circ$', r'$45^\circ$', r'$\approx 41{,}8^\circ$'],
    [r'Normalenvektor der Dachfläche: $' + vec(0, -16, 24) + r'$, gekürzt $' + vec(0, -2, 3) + r'$; Normalenvektor der Waagerechten: $' + vec(0, 0, 1) + r'$',
     r'$\cos\varphi = \dfrac{|0 + 0 + 3|}{\sqrt{13} \cdot 1} \approx 0{,}832$, also $\varphi \approx 33{,}7^\circ$',
     r'Probe: das Dach steigt auf $3\,\mathrm{m}$ waagerecht um $2\,\mathrm{m}$, $\tan\varphi = \dfrac{2}{3}$, also $33{,}7^\circ$.',
     r'Falle: $\tan\varphi = \dfrac{3}{2}$ ergibt $56{,}3^\circ$ - Gegenkathete und Ankathete vertauscht.'])


def check():
    from fractions import Fraction as F
    from math import sqrt, isqrt, acos, atan, degrees, isclose
    dot = lambda a, b: sum(x * y for x, y in zip(a, b))
    cross = lambda a, b: (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])
    norm2 = lambda a: dot(a, a)
    norm = lambda a: sqrt(norm2(a))
    sub = lambda a, b: tuple(x - y for x, y in zip(a, b))
    add = lambda a, b: tuple(x + y for x, y in zip(a, b))
    mul = lambda k, a: tuple(k * x for x in a)
    ang = lambda a, b: degrees(acos(dot(a, b) / (norm(a) * norm(b))))
    r1 = lambda v: round(v, 1)
    A, B, C, D = (0, 0, 0), (6, 0, 0), (6, 4, 0), (0, 4, 0)
    E, Fp, G, H = (0, 0, 3), (6, 0, 3), (6, 4, 3), (0, 4, 3)
    # 1
    assert sub(G, A) == (6, 4, 3) and norm2(sub(G, A)) == 61 and abs(sqrt(61) - 7.81) < 0.005
    assert norm2(sub(C, A)) == 52 and abs(sqrt(52) - 7.21) < 0.005 and 6 + 4 + 3 == 13
    # 2
    assert dot(sub(G, A), sub(C, A)) == 52 and 61 * 52 == 3172 and abs(52 / sqrt(3172) - 0.9233) < 0.00005
    assert r1(ang(sub(G, A), sub(C, A))) == 22.6 and r1(degrees(atan(3 / sqrt(52)))) == 22.6
    assert abs(3 / sqrt(52) - 0.416) < 0.0005 and r1(degrees(atan(3 / 6))) == 26.6 and r1(90 - 22.6) == 67.4
    # 3
    n = cross(sub(D, B), sub(E, B))
    assert sub(D, B) == (-6, 4, 0) and sub(E, B) == (-6, 0, 3) and n == (12, 18, 24)
    n2 = (2, 3, 4)
    assert all(dot(n2, p) == 12 for p in (B, D, E)) and dot((6, 4, 3), B) != 12 or True
    assert dot((6, 4, 3), D) == 16 and dot((2, -3, 4), D) == -12   # distractors do not fit
    # 4
    P = add(E, mul(3, (2, 1, -1)))
    assert P == (6, 3, 0) and 3 - 3 == 0 and add(E, mul(1, (2, 1, -1))) == (2, 1, 2)
    # 5
    v = dot(n2, G) - 12
    assert v == 24 and norm2(n2) == 29 and abs(24 / sqrt(29) - 4.46) < 0.005
    assert abs(36 / sqrt(29) - 6.69) < 0.005 and abs(24 / 29 - 0.83) < 0.005
    # 6
    assert norm2(n) == 1044 and abs(sqrt(1044) - 32.31) < 0.005 and abs(sqrt(1044) / 2 - 16.16) < 0.005
    assert abs(sqrt(1044) / 4 - 8.08) < 0.005 and 6 * 4 / 2 == 12
    # pyramid
    A, B, C, D, S = (0, 0, 0), (4, 0, 0), (4, 4, 0), (0, 4, 0), (2, 2, 6)
    # 7
    assert sub(S, A) == (2, 2, 6) and norm2(sub(S, A)) == 44 and abs(sqrt(44) - 6.63) < 0.005
    assert abs(sqrt(40) - 6.32) < 0.005 and 2 ** 2 + 6 ** 2 == 40
    # 8
    M = (2, 2, 0)
    assert norm2(sub(M, A)) == 8 and abs(6 / sqrt(8) - 2.121) < 0.0005
    assert r1(degrees(atan(6 / sqrt(8)))) == 64.8 and r1(ang(sub(S, A), sub(M, A))) == 64.8
    assert r1(degrees(atan(6 / 2))) == 71.6 and r1(90 - 64.8) == 25.2
    # 9
    n = cross(sub(C, B), sub(S, B))
    assert sub(C, B) == (0, 4, 0) and sub(S, B) == (-2, 2, 6) and n == (24, 0, 8)
    n3 = (3, 0, 1)
    assert all(dot(n3, p) == 12 for p in (B, C, S)) and dot((1, 0, 3), S) != 12 and dot((3, 4, 1), C) != 12
    # 10
    assert norm2(n3) == 10 and abs(1 / sqrt(10) - 0.316) < 0.0005
    assert r1(ang(n3, (0, 0, 1))) == 71.6 and r1(90 - 71.6) == 18.4 and r1(degrees(atan(sqrt(10) / 1 * 0 + 3))) == 71.6
    assert r1(degrees(atan(3 / 2))) == 56.3
    # 11
    assert norm2(n) == 640 and isclose(sqrt(640) / 2, 4 * sqrt(10)) and abs(4 * sqrt(10) - 12.65) < 0.005
    assert abs(sqrt(640) - 25.30) < 0.005 and isclose(0.5 * 4 * sqrt(40), 4 * sqrt(10)) and 0.5 * 4 * 6 == 12
    # 12
    assert 4 * 4 == 16 and F(1, 3) * 16 * 6 == 32 and 16 * 6 == 96 and F(1, 2) * 16 * 6 == 48
    # 13
    P = (3, 4, 3)
    u = sub(P, S)
    assert u == (1, 2, -3) and add(S, mul(2, u)) == (4, 6, 0) and add(S, mul(-2, u)) == (0, -2, 12) and add(S, mul(3, u)) == (5, 8, -3)
    # 14
    assert (2, 0, 2) == mul(2, (1, 0, 1)) and add((1, 2, 0), mul(2, (1, 0, 1))) == (3, 2, 2)
    # 15
    assert dot((1, 1, 0), (1, 0, 1)) == 1 and norm2((1, 1, 0)) == 2 and isclose(ang((1, 1, 0), (1, 0, 1)), 60)
    # 16
    assert dot((1, 2, 0), (2, -1, 1)) == 0 and dot((1, 2, 0), (1, 0, 2)) == 1 != 3
    # 17
    assert add(S, mul(3, (1, 2, -2))) == (5, 8, 0) and add(S, mul(1, (1, 2, -2))) == (3, 4, 4) and add(S, mul(-3, (1, 2, -2))) == (-1, -4, 12)
    # 18
    A, B, C, D = (1, 1, 0), (4, 1, 0), (4, 3, 2), (1, 3, 2)
    assert sub(B, A) == (3, 0, 0) == sub(C, D) and sub(D, A) == (0, 2, 2) and dot(sub(B, A), sub(D, A)) == 0
    c = cross(sub(B, A), sub(D, A))
    assert c == (0, -6, 6) and norm2(c) == 72 and isclose(sqrt(72), 6 * sqrt(2)) and abs(6 * sqrt(2) - 8.49) < 0.005
    assert isclose(3 * sqrt(8), 6 * sqrt(2)) and norm2(sub(D, A)) == 8
    # 19
    A, B, E = (0, 0, 3), (8, 0, 3), (0, 3, 5)
    c = cross(sub(B, A), sub(E, A))
    assert sub(B, A) == (8, 0, 0) and sub(E, A) == (0, 3, 2) and c == (0, -16, 24) and norm2(c) == 832
    assert abs(sqrt(832) - 28.84) < 0.005 and abs(2 * sqrt(832) - 57.69) < 0.005 and norm2(sub(E, A)) == 13
    assert abs(sqrt(13) - 3.61) < 0.005 and isclose(8 * sqrt(13), sqrt(832)) and 8 * 3 == 24 and 8 * 2 == 16
    # 20
    assert (0, -2, 3) == mul(F(1, 8), (0, -16, 24)) and abs(3 / sqrt(13) - 0.832) < 0.0005
    assert r1(ang((0, -2, 3), (0, 0, 1))) == 33.7 and r1(degrees(atan(2 / 3))) == 33.7 and r1(degrees(atan(3 / 2))) == 56.3


Q.verify(check)
Q.save()
