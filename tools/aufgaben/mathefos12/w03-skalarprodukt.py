#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 3 (LB 1): Skalarprodukt - in Koordinaten und über
den Winkel, Winkel zwischen Vektoren, Orthogonalität, Anwendungen mit Kräften
und Winkeln in Körpern. Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec
from svgfig import Solid, INK, MUTED

Q = fos12(nr=3, slug='skalarprodukt', thema='Skalarprodukt', lb='LB 1',
          blurb='Skalarprodukt, Winkel zwischen Vektoren, Orthogonalität',
          comment='Blocks: Skalarprodukt berechnen (1-5), Winkel (6-10), Orthogonalität (11-15), Kräfte und Körper (16-20). Alles ohne CAS.')


# ------------------------------------------------------------- figures ----
def quader_fig():
    """Cuboid A(0|0|0) ... G(4|3|2) with the space diagonal AG and the edge AB."""
    f = Solid(w=360, h=340, scale=36, ox=140, oy=240)
    A, B, C, D = (0, 0, 0), (4, 0, 0), (4, 3, 0), (0, 3, 0)
    E, F_, G, H = (0, 0, 2), (4, 0, 2), (4, 3, 2), (0, 3, 2)
    f.shade([B, C, G, F_])
    f.shade([E, F_, G, H], opacity=0.12)
    f.edges([(B, C), (C, D), (B, F_), (C, G), (D, H), (E, F_), (F_, G), (G, H), (H, E)])
    f.edges([(A, B), (A, D), (A, E)], color=MUTED, width=1.2, dash='4 3')
    f.arrow3(A, G)
    f.arrow3(A, B)
    f.label3((2, 1.5, 1), 'AG', dx=-4, dy=-10, italic=True)
    f.label3((2, 0, 0), 'AB', dx=-16, dy=8, italic=True)
    for p, lab, pos in ((A, 'A', 'left'), (B, 'B', 'below-left'), (C, 'C', 'below-right'),
                        (D, 'D', 'right'), (E, 'E', 'above-left'), (F_, 'F', 'left'),
                        (G, 'G', 'right'), (H, 'H', 'above-right')):
        f.vertex(p, lab, pos)
    svg = f.svg('Quader mit Raumdiagonale AG')
    assert "'" not in svg
    return svg


def pyramide_fig():
    """Square pyramid ABCD with apex S; edge AS and base edge AB highlighted."""
    f = Solid(w=360, h=340, scale=36, ox=140, oy=240)
    A, B, C, D, S = (0, 0, 0), (4, 0, 0), (4, 4, 0), (0, 4, 0), (2, 2, 4)
    f.shade([B, C, S])
    f.shade([C, D, S], opacity=0.12)
    f.edges([(B, C), (C, D), (B, S), (C, S), (D, S)])
    f.edges([(A, B), (A, D), (A, S)], color=MUTED, width=1.2, dash='4 3')
    f.arrow3(A, S)
    f.arrow3(A, B)
    f.label3((1, 1, 2), 'AS', dx=-14, dy=0, italic=True)
    f.label3((2, 0, 0), 'AB', dx=-16, dy=8, italic=True)
    for p, lab, pos in ((A, 'A', 'left'), (B, 'B', 'below-left'), (C, 'C', 'below-right'),
                        (D, 'D', 'right'), (S, 'S', 'above')):
        f.vertex(p, lab, pos)
    svg = f.svg('Quadratische Pyramide ABCDS')
    assert "'" not in svg
    return svg


# ------------------------------------------------- Skalarprodukt berechnen ----
Q.q(r'Berechne das Skalarprodukt $\vec a \cdot \vec b$ für $\vec a = ' + vec(1, 2, 3) + r'$ und $\vec b = ' + vec(4, -1, 2) + '$.',
    [r'$8$', r'$12$', r'$' + vec(4, -2, 6) + '$', r'$2$'],
    [r'Skalarprodukt in Koordinaten: $\vec a \cdot \vec b = a_1 b_1 + a_2 b_2 + a_3 b_3$',
     r'$1 \cdot 4 + 2 \cdot (-1) + 3 \cdot 2 = 4 - 2 + 6 = 8$',
     r'Falle: das Ergebnis ist eine Zahl, kein Vektor - und $2 \cdot (-1)$ ist $-2$, nicht $+2$.'])

Q.q(r'Berechne $' + vec(2, 0, -3) + r' \cdot ' + vec(5, 4, 1) + '$.',
    [r'$7$', r'$13$', r'$-7$', r'$17$'],
    [r'$2 \cdot 5 + 0 \cdot 4 + (-3) \cdot 1 = 10 + 0 - 3$',
     r'$= 7$',
     r'Der Summand mit der $0$ fällt weg; das Minus von $-3$ bleibt erhalten.'])

Q.q(r'Berechne $' + vec(r'0{,}5', 2, 4) + r' \cdot ' + vec(6, -1, r'0{,}5') + '$.',
    [r'$3$', r'$7$', r'$1$', r'$' + vec(3, -2, 2) + '$'],
    [r'$0{,}5 \cdot 6 + 2 \cdot (-1) + 4 \cdot 0{,}5 = 3 - 2 + 2$',
     r'$= 3$',
     r'Erst alle drei Produkte bilden, dann erst addieren - wer nach $3 - 2$ aufhört, bekommt $1$.'])

Q.q(r'Berechne $\vec a \cdot \vec a$ für $\vec a = ' + vec(2, -1, 2) + '$.',
    [r'$9$', r'$3$', r'$' + vec(4, 1, 4) + '$', r'$0$'],
    [r'$\vec a \cdot \vec a = 2^2 + (-1)^2 + 2^2 = 4 + 1 + 4 = 9$',
     r'Allgemein gilt $\vec a \cdot \vec a = |\vec a|^2$ - hier ist $|\vec a| = 3$ und $3^2 = 9$.',
     r'$3$ wäre der Betrag, nicht das Skalarprodukt.'])

Q.q(r'Zwei Vektoren haben die Beträge $|\vec a| = 3$ und $|\vec b| = 4$ und schließen den Winkel $\varphi = 60^\circ$ ein. Berechne $\vec a \cdot \vec b$.',
    [r'$6$', r'$12$', r'$\approx 10{,}39$', r'$0$'],
    [r'Skalarprodukt über den Winkel: $\vec a \cdot \vec b = |\vec a| \cdot |\vec b| \cdot \cos\varphi$',
     r'$= 3 \cdot 4 \cdot \cos 60^\circ = 12 \cdot 0{,}5 = 6$',
     r'Falle: $12$ vergisst den Kosinus, $10{,}39$ nimmt den Sinus.'])

# ---------------------------------------------------------------- Winkel ----
Q.q(r'Welchen Winkel schließen $\vec a = ' + vec(1, 0, 0) + r'$ und $\vec b = ' + vec(1, 1, 0) + '$ ein?',
    [r'$45^\circ$', r'$60^\circ$', r'$30^\circ$', r'$90^\circ$'],
    [r'$\cos\varphi = \dfrac{\vec a \cdot \vec b}{|\vec a| \cdot |\vec b|} = \dfrac{1}{1 \cdot \sqrt{2}} \approx 0{,}707$',
     r'$\varphi = \cos^{-1}(0{,}707) = 45^\circ$',
     r'Anschaulich: $\vec b$ ist die Diagonale eines Quadrats in der $x$-$y$-Ebene, $\vec a$ eine Seite.'])

Q.q(r'Berechne den Winkel zwischen $\vec a = ' + vec(2, 2, 1) + r'$ und $\vec b = ' + vec(1, 2, 2) + '$.',
    [r'$\varphi \approx 27{,}3^\circ$', r'$\varphi \approx 62{,}7^\circ$', r'$\varphi \approx 152{,}7^\circ$', r'$\varphi \approx 84{,}3^\circ$'],
    [r'$\vec a \cdot \vec b = 2 + 4 + 2 = 8$, $|\vec a| = \sqrt{4 + 4 + 1} = 3$, $|\vec b| = \sqrt{1 + 4 + 4} = 3$',
     r'$\cos\varphi = \dfrac{8}{3 \cdot 3} = \dfrac{8}{9} \approx 0{,}889$, also $\varphi = \cos^{-1}\!\left(\dfrac{8}{9}\right) \approx 27{,}3^\circ$',
     r'Fallen: $\sin^{-1}$ statt $\cos^{-1}$ ($62{,}7^\circ$), Wurzel vergessen ($\cos\varphi = \frac{8}{81}$, also $84{,}3^\circ$).'])

Q.q(r'Welchen Winkel schließen $\vec a = ' + vec(2, -1, 2) + r'$ und $\vec b = ' + vec(-4, 2, -4) + '$ ein?',
    [r'$180^\circ$', r'$0^\circ$', r'$90^\circ$', r'$60^\circ$'],
    [r'$\vec a \cdot \vec b = -8 - 2 - 8 = -18$, $|\vec a| = 3$, $|\vec b| = 6$',
     r'$\cos\varphi = \dfrac{-18}{3 \cdot 6} = -1$, also $\varphi = 180^\circ$',
     r'Kein Wunder: $\vec b = -2\,\vec a$, die Vektoren sind antiparallel.'])

Q.q(r'Im Dreieck $ABC$ mit $A(0|0|0)$, $B(2|2|1)$ und $C(0|3|4)$: Wie groß ist der Innenwinkel $\alpha$ bei $A$?',
    [r'$\alpha \approx 48{,}2^\circ$', r'$\alpha \approx 41{,}8^\circ$', r'$\alpha \approx 131{,}8^\circ$', r'$\alpha \approx 87{,}5^\circ$'],
    [r'Beide Vektoren müssen in $A$ beginnen: $\overrightarrow{AB} = ' + vec(2, 2, 1) + r'$, $\overrightarrow{AC} = ' + vec(0, 3, 4) + '$',
     r'$\overrightarrow{AB} \cdot \overrightarrow{AC} = 0 + 6 + 4 = 10$, $|\overrightarrow{AB}| = 3$, $|\overrightarrow{AC}| = 5$',
     r'$\cos\alpha = \dfrac{10}{15} = \dfrac{2}{3}$, also $\alpha \approx 48{,}2^\circ$'])

Q.q(r'In einem Würfel: Welchen Winkel bildet die Raumdiagonale $' + vec(1, 1, 1) + r'$ mit der Kante $' + vec(1, 0, 0) + '$?',
    [r'$\approx 54{,}7^\circ$', r'$45^\circ$', r'$\approx 35{,}3^\circ$', r'$60^\circ$'],
    [r'$\cos\varphi = \dfrac{1 \cdot 1 + 1 \cdot 0 + 1 \cdot 0}{\sqrt{3} \cdot 1} = \dfrac{1}{\sqrt{3}} \approx 0{,}577$',
     r'$\varphi = \cos^{-1}(0{,}577) \approx 54{,}7^\circ$',
     r'$45^\circ$ gilt nur für die Flächendiagonale; $35{,}3^\circ$ ist der Winkel zwischen Raum- und Flächendiagonale.'])

# -------------------------------------------------------- Orthogonalität ----
Q.q(r'Welcher Vektor steht senkrecht auf $\vec a = ' + vec(2, -1, 3) + '$?',
    [r'$' + vec(1, 2, 0) + '$', r'$' + vec(1, 1, 1) + '$', r'$' + vec(3, 1, -2) + '$', r'$' + vec(-2, 1, -3) + '$'],
    [r'Orthogonalitätstest: $\vec a \cdot \vec b = 0$',
     r'$' + vec(2, -1, 3) + r' \cdot ' + vec(1, 2, 0) + r' = 2 - 2 + 0 = 0$ - passt.',
     r'Die anderen: $4$, $-1$ und $-14$ - alle ungleich $0$.'])

Q.q(r'Für welchen Wert von $k$ stehen $\vec a = ' + vec('k', 2, -1) + r'$ und $\vec b = ' + vec(3, 1, 4) + '$ senkrecht aufeinander?',
    [r'$k = \dfrac{2}{3}$', r'$k = -\dfrac{2}{3}$', r'$k = 2$', r'$k = -2$'],
    [r'Ansatz: $\vec a \cdot \vec b = 3k + 2 \cdot 1 + (-1) \cdot 4 = 3k - 2 = 0$',
     r'$3k = 2$, also $k = \dfrac{2}{3}$',
     r'Probe: $3 \cdot \frac{2}{3} + 2 - 4 = 2 + 2 - 4 = 0$'])

Q.q(r'Für zwei Vektoren $\vec a \neq \vec 0$ und $\vec b \neq \vec 0$ gilt $\vec a \cdot \vec b = 0$. Was folgt daraus?',
    [r'$\vec a$ und $\vec b$ sind orthogonal, sie schließen einen Winkel von $90^\circ$ ein.',
     r'$\vec a$ und $\vec b$ sind parallel.',
     r'$\vec a$ und $\vec b$ haben denselben Betrag.',
     r'Einer der beiden Vektoren muss doch der Nullvektor sein.'],
    [r'$\vec a \cdot \vec b = |\vec a| \cdot |\vec b| \cdot \cos\varphi$ - die Beträge sind ungleich $0$, also muss $\cos\varphi = 0$ sein.',
     r'$\cos\varphi = 0$ bedeutet $\varphi = 90^\circ$: die Vektoren stehen senkrecht aufeinander.',
     r'Deshalb ist $\vec a \cdot \vec b = 0$ der Orthogonalitätstest.'])

Q.q(r'Ohne den Winkel auszurechnen: Welche Art von Winkel schließen $\vec a = ' + vec(1, 2, 3) + r'$ und $\vec b = ' + vec(-2, 1, -1) + '$ ein?',
    [r'einen stumpfen Winkel (zwischen $90^\circ$ und $180^\circ$)', r'einen spitzen Winkel (zwischen $0^\circ$ und $90^\circ$)', r'genau $90^\circ$', r'genau $180^\circ$'],
    [r'$\vec a \cdot \vec b = -2 + 2 - 3 = -3 < 0$',
     r'Das Vorzeichen des Skalarprodukts ist das Vorzeichen von $\cos\varphi$: negativ heißt $\varphi > 90^\circ$.',
     r'$180^\circ$ wäre es nur, wenn $\vec b$ ein negatives Vielfaches von $\vec a$ wäre - ist es nicht.'])

Q.q(r'Gegeben ist das Dreieck $ABC$ mit $A(2|1|0)$, $B(3|4|1)$ und $C(1|3|1)$. In welchem Eckpunkt hat es einen rechten Winkel?',
    [r'bei $C$', r'bei $A$', r'bei $B$', r'Es hat keinen rechten Winkel.'],
    [r'$\overrightarrow{CA} = ' + vec(1, -2, -1) + r'$, $\overrightarrow{CB} = ' + vec(2, 1, 0) + r'$, Skalarprodukt: $2 - 2 + 0 = 0$',
     r'Also ist der Winkel bei $C$ ein rechter.',
     r'Zur Kontrolle: bei $A$ ergibt $\overrightarrow{AB} \cdot \overrightarrow{AC} = 6$, bei $B$ ergibt $\overrightarrow{BA} \cdot \overrightarrow{BC} = 5$.'])

# ------------------------------------------------------ Kräfte und Körper ----
Q.q(r'Die Kraft $\vec F = ' + vec(3, 4, 0) + r'\,\mathrm{N}$ verschiebt einen Körper um $\vec s = ' + vec(2, 0, 0) + r'\,\mathrm{m}$. Welche Arbeit $W = \vec F \cdot \vec s$ wird verrichtet?',
    [r'$W = 6\,\mathrm{J}$', r'$W = 10\,\mathrm{J}$', r'$W = 14\,\mathrm{J}$', r'$W = 0\,\mathrm{J}$'],
    [r'$W = \vec F \cdot \vec s = 3 \cdot 2 + 4 \cdot 0 + 0 \cdot 0 = 6\,\mathrm{J}$',
     r'Nur der Kraftanteil in Wegrichtung zählt ($3\,\mathrm{N}$); der Anteil $4\,\mathrm{N}$ quer zum Weg leistet keine Arbeit.',
     r'$|\vec F| \cdot |\vec s| = 5 \cdot 2 = 10$ wäre nur richtig, wenn Kraft und Weg dieselbe Richtung hätten.'])

Q.q(r'Das Parallelogramm $ABCD$ wird von $\overrightarrow{AB} = ' + vec(2, 1, 2) + r'$ und $\overrightarrow{AD} = ' + vec(1, -2, 0) + '$ aufgespannt. Was für ein Viereck ist es?',
    [r'ein Rechteck, aber kein Quadrat', r'ein Quadrat', r'eine Raute, aber kein Rechteck', r'ein Parallelogramm ohne rechten Winkel'],
    [r'$\overrightarrow{AB} \cdot \overrightarrow{AD} = 2 - 2 + 0 = 0$, also ist der Winkel bei $A$ ein rechter: Rechteck.',
     r'$|\overrightarrow{AB}| = \sqrt{4 + 1 + 4} = 3$, $|\overrightarrow{AD}| = \sqrt{1 + 4 + 0} = \sqrt{5}$ - verschieden lang, also kein Quadrat.',
     r'Rechteck: rechte Winkel. Raute: gleich lange Seiten. Quadrat: beides.'])

Q.q(r'Ein Quader hat die Ecken $A(0|0|0)$, $B(4|0|0)$, $D(0|3|0)$ und $E(0|0|2)$. Welchen Winkel bildet die Raumdiagonale $\overline{AG}$ mit der Kante $\overline{AB}$?',
    [r'$\approx 42{,}0^\circ$', r'$\approx 36{,}9^\circ$', r'$\approx 48{,}0^\circ$', r'$\approx 53{,}1^\circ$'],
    [r'$G(4|3|2)$, also $\overrightarrow{AG} = ' + vec(4, 3, 2) + r'$ und $\overrightarrow{AB} = ' + vec(4, 0, 0) + '$',
     r'$\cos\varphi = \dfrac{16 + 0 + 0}{\sqrt{29} \cdot 4} = \dfrac{4}{\sqrt{29}} \approx 0{,}743$, also $\varphi \approx 42{,}0^\circ$',
     r'$36{,}9^\circ$ wäre der Winkel der Flächendiagonale $\overline{AC}$ mit $\overline{AB}$ - in der Grundfläche, nicht im Raum.'],
    fig=quader_fig(), figcap=r'Quader mit Raumdiagonale $\overline{AG}$ und Kante $\overline{AB}$')

Q.q(r'Eine quadratische Pyramide hat die Grundfläche $A(0|0|0)$, $B(4|0|0)$, $C(4|4|0)$, $D(0|4|0)$ und die Spitze $S(2|2|4)$. Unter welchem Winkel trifft die Kante $\overline{AS}$ auf die Grundkante $\overline{AB}$?',
    [r'$\approx 65{,}9^\circ$', r'$\approx 24{,}1^\circ$', r'$\approx 54{,}7^\circ$', r'$45^\circ$'],
    [r'$\overrightarrow{AS} = ' + vec(2, 2, 4) + r'$, $\overrightarrow{AB} = ' + vec(4, 0, 0) + '$',
     r'$\overrightarrow{AS} \cdot \overrightarrow{AB} = 8$, $|\overrightarrow{AS}| = \sqrt{4 + 4 + 16} = \sqrt{24}$, $|\overrightarrow{AB}| = 4$',
     r'$\cos\varphi = \dfrac{8}{\sqrt{24} \cdot 4} = \dfrac{2}{\sqrt{24}} \approx 0{,}408$, also $\varphi \approx 65{,}9^\circ$'],
    fig=pyramide_fig(), figcap=r'Quadratische Pyramide mit Kante $\overline{AS}$ und Grundkante $\overline{AB}$')

Q.q(r'Von zwei Vektoren ist bekannt: $|\vec a| = 3$, $|\vec b| = 4$ und $\vec a \cdot \vec b = 6$. Berechne $|\vec a + \vec b|$.',
    [r'$\sqrt{37} \approx 6{,}08$', r'$7$', r'$5$', r'$\sqrt{31} \approx 5{,}57$'],
    [r'$|\vec a + \vec b|^2 = (\vec a + \vec b) \cdot (\vec a + \vec b) = \vec a \cdot \vec a + 2\,\vec a \cdot \vec b + \vec b \cdot \vec b$',
     r'$= 9 + 2 \cdot 6 + 16 = 37$, also $|\vec a + \vec b| = \sqrt{37} \approx 6{,}08$',
     r'$7$ wäre nur richtig, wenn die Vektoren gleichgerichtet wären; $5$ nur, wenn sie senkrecht stünden.'])


def check():
    from fractions import Fraction as F
    from math import sqrt, acos, asin, cos, sin, radians, degrees, isqrt
    dot = lambda a, b: sum(x * y for x, y in zip(a, b))
    n2 = lambda a: dot(a, a)
    ang = lambda a, b: degrees(acos(dot(a, b) / sqrt(n2(a) * n2(b))))
    near = lambda x, y, tol=0.05: abs(x - y) < tol
    # 1-5: Skalarprodukt berechnen
    assert dot((1, 2, 3), (4, -1, 2)) == 8 and 4 + 2 + 6 == 12 and (1 * 4, 2 * -1, 3 * 2) == (4, -2, 6) and 4 - 2 == 2
    assert dot((2, 0, -3), (5, 4, 1)) == 7 and 10 + 0 + 3 == 13 and 10 + 4 + 3 == 17
    assert dot((F(1, 2), 2, 4), (6, -1, F(1, 2))) == 3 and 3 + 2 + 2 == 7 and 3 - 2 == 1 and (F(1, 2) * 6, 2 * -1, 4 * F(1, 2)) == (3, -2, 2)
    assert n2((2, -1, 2)) == 9 and isqrt(9) == 3 and (2 * 2, -1 * -1, 2 * 2) == (4, 1, 4)
    assert near(3 * 4 * cos(radians(60)), 6, 1e-9) and near(3 * 4 * sin(radians(60)), 10.39, 0.005)
    # 6-10: Winkel
    assert dot((1, 0, 0), (1, 1, 0)) == 1 and n2((1, 1, 0)) == 2 and near(1 / sqrt(2), 0.707, 0.0005) and near(ang((1, 0, 0), (1, 1, 0)), 45, 1e-9)
    assert dot((2, 2, 1), (1, 2, 2)) == 8 and isqrt(n2((2, 2, 1))) == 3 and isqrt(n2((1, 2, 2))) == 3
    assert near(8 / 9, 0.889, 0.0005) and near(ang((2, 2, 1), (1, 2, 2)), 27.3) and near(degrees(asin(8 / 9)), 62.7)
    assert near(180 - ang((2, 2, 1), (1, 2, 2)), 152.7) and near(degrees(acos(8 / 81)), 84.3)
    assert dot((2, -1, 2), (-4, 2, -4)) == -18 and isqrt(n2((2, -1, 2))) == 3 and isqrt(n2((-4, 2, -4))) == 6
    assert F(-18, 18) == -1 and near(ang((2, -1, 2), (-4, 2, -4)), 180, 1e-6) and (-4, 2, -4) == tuple(-2 * x for x in (2, -1, 2))
    assert (2 - 0, 2 - 0, 1 - 0) == (2, 2, 1) and (0, 3, 4) == (0 - 0, 3 - 0, 4 - 0)
    assert dot((2, 2, 1), (0, 3, 4)) == 10 and isqrt(n2((2, 2, 1))) == 3 and isqrt(n2((0, 3, 4))) == 5 and F(10, 15) == F(2, 3)
    assert near(ang((2, 2, 1), (0, 3, 4)), 48.2) and near(degrees(asin(2 / 3)), 41.8) and near(180 - ang((2, 2, 1), (0, 3, 4)), 131.8) and near(degrees(acos(10 / 225)), 87.5)
    assert dot((1, 1, 1), (1, 0, 0)) == 1 and n2((1, 1, 1)) == 3 and near(1 / sqrt(3), 0.577, 0.0005)
    assert near(ang((1, 1, 1), (1, 0, 0)), 54.7) and near(ang((1, 1, 0), (1, 0, 0)), 45, 1e-9) and near(ang((1, 1, 1), (1, 1, 0)), 35.3)
    # 11-15: Orthogonalität
    a = (2, -1, 3)
    assert dot(a, (1, 2, 0)) == 0 and dot(a, (1, 1, 1)) == 4 and dot(a, (3, 1, -2)) == -1 and dot(a, (-2, 1, -3)) == -14
    k = F(2, 3)
    assert dot((k, 2, -1), (3, 1, 4)) == 0 and 3 * k - 2 == 0
    for bad in (-k, 2, -2):
        assert dot((bad, 2, -1), (3, 1, 4)) != 0
    assert near(cos(radians(90)), 0, 1e-12)
    assert dot((1, 2, 3), (-2, 1, -1)) == -3 and dot((1, 2, 3), (-2, 1, -1)) < 0
    assert ang((1, 2, 3), (-2, 1, -1)) > 90 and ang((1, 2, 3), (-2, 1, -1)) < 180
    A, B, C = (2, 1, 0), (3, 4, 1), (1, 3, 1)
    sub = lambda p, q: tuple(x - y for x, y in zip(p, q))
    assert sub(A, C) == (1, -2, -1) and sub(B, C) == (2, 1, 0)
    assert dot(sub(A, C), sub(B, C)) == 0 and dot(sub(B, A), sub(C, A)) == 6 and dot(sub(A, B), sub(C, B)) == 5
    # 16-20: Kräfte und Körper
    assert dot((3, 4, 0), (2, 0, 0)) == 6 and isqrt(n2((3, 4, 0))) * isqrt(n2((2, 0, 0))) == 10 and 3 * 2 + 4 * 2 == 14
    assert dot((2, 1, 2), (1, -2, 0)) == 0 and isqrt(n2((2, 1, 2))) == 3 and n2((1, -2, 0)) == 5 and 3 * 3 != 5
    G = (4, 3, 2)
    assert dot(G, (4, 0, 0)) == 16 and n2(G) == 29 and near(4 / sqrt(29), 0.743, 0.0005)
    assert near(ang(G, (4, 0, 0)), 42.0) and near(ang((4, 3, 0), (4, 0, 0)), 36.9) and near(90 - ang(G, (4, 0, 0)), 48.0) and near(90 - ang((4, 3, 0), (4, 0, 0)), 53.1)
    S = (2, 2, 4)
    assert dot(S, (4, 0, 0)) == 8 and n2(S) == 24 and near(2 / sqrt(24), 0.408, 0.0005)
    assert near(ang(S, (4, 0, 0)), 65.9) and near(90 - ang(S, (4, 0, 0)), 24.1)
    assert 9 + 2 * 6 + 16 == 37 and near(sqrt(37), 6.08, 0.005) and 9 + 6 + 16 == 31 and 9 + 16 == 25 and isqrt(25) == 5 and 3 + 4 == 7 and near(sqrt(31), 5.57, 0.005)
    # an example pair with |a|=3, |b|=4, a.b=6 really exists: a=(3,0,0), b=(2, sqrt(12), 0)
    b = (2, sqrt(12), 0)
    assert near(sqrt(n2(b)), 4, 1e-9) and near(dot((3, 0, 0), b), 6, 1e-9) and near(sqrt(n2((5, sqrt(12), 0))), sqrt(37), 1e-9)


Q.verify(check)
Q.save()
