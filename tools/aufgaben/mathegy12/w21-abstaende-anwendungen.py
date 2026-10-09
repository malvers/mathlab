#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 21 (LB 7): Abstände und Winkel in
Anwendungen - Pyramide, Dach und Schornstein, Schatten, Seil am Mast, Raum, Kugel, Drohnen.
Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12, vec
import numpy as np
import math

Q = gy12(nr=21, slug='abstaende-anwendungen', thema='Abstände und Winkel in Anwendungen', lb='LB 7',
         blurb='Pyramide, Dach, Schatten, Seil am Mast und Kugel mit Vektoren',
         comment='Blocks: Pyramide ABCDS (1-8), Flug und Schatten (9, 10), Dach und Schornstein (11-13), Raum und Mast (14, 15, 17, 18), Kugel, Tetraeder, Drohnen (16, 19, 20). Taschenrechner erlaubt.')

PYR = r'Die Pyramide hat die Grundfläche $A(0 \mid 0 \mid 0)$, $B(6 \mid 0 \mid 0)$, $C(6 \mid 6 \mid 0)$, $D(0 \mid 6 \mid 0)$ und die Spitze $S(3 \mid 3 \mid 4)$. '
DACH = r'Eine Dachfläche liegt in der Ebene $3y + 4z = 24$ (Einheit m, $z$ nach oben). '

Q.q(PYR + r'Wie hoch ist sie?',
    [r'$4$', r'$5$', r'$\sqrt{34}$', r'$3$'],
    [r'Die Grundfläche liegt in $z = 0$.',
     r'Die Höhe ist der Abstand der Spitze von dieser Ebene: $4$.'])

Q.q(PYR + r'Wie lang ist die Seitenkante $AS$?',
    [r'$\sqrt{34} \approx 5{,}83$', r'$5$', r'$\sqrt{18} \approx 4{,}24$', r'$10$'],
    [r'$\vec{AS} = (3;\ 3;\ 4)$.',
     r'$\sqrt{9 + 9 + 16} = \sqrt{34}$.'])

Q.q(PYR + r'Welches Volumen hat sie?',
    [r'$48$', r'$144$', r'$72$', r'$24$'],
    [r'$V = \tfrac13 \cdot G \cdot h = \tfrac13 \cdot 36 \cdot 4$.',
     r'$= 48$.'])

Q.q(PYR + r'Wie lang ist die Höhe der Seitenfläche $ABS$, gemessen vom Mittelpunkt von $AB$ bis $S$?',
    [r'$5$', r'$4$', r'$\sqrt{34}$', r'$\sqrt{41}$'],
    [r'Mittelpunkt $M_{AB}(3 \mid 0 \mid 0)$, $\vec{MS} = (0;\ 3;\ 4)$.',
     r'$|\vec{MS}| = 5$.'])

Q.q(PYR + r'Wie groß ist ihre Mantelfläche?',
    [r'$60$', r'$96$', r'$48$', r'$30$'],
    [r'Vier gleiche Dreiecke mit der Grundseite $6$ und der Höhe $5$.',
     r'$4 \cdot \tfrac12 \cdot 6 \cdot 5 = 60$. Mit der Grundfläche wären es $96$.'])

Q.q(PYR + r'Welchen Winkel bildet eine Seitenfläche mit der Grundfläche?',
    [r'$\approx 53{,}1^\circ$', r'$\approx 43{,}3^\circ$', r'$\approx 36{,}9^\circ$', r'$45^\circ$'],
    [r'Im Querschnitt durch $M_{AB}$ und $S$: Höhe $4$ über der halben Seite $3$.',
     r'$\tan\varphi = \tfrac43$, $\varphi \approx 53{,}1^\circ$.'])

Q.q(PYR + r'Welchen Winkel bildet die Seitenkante $AS$ mit der Grundfläche?',
    [r'$\approx 43{,}3^\circ$', r'$\approx 53{,}1^\circ$', r'$\approx 46{,}7^\circ$', r'$\approx 36{,}9^\circ$'],
    [r'$\sin\varphi = \dfrac{|(3;\ 3;\ 4) \cdot (0;\ 0;\ 1)|}{\sqrt{34}} = \dfrac{4}{\sqrt{34}}$.',
     r'$\varphi \approx 43{,}3^\circ$: flacher als die Seitenfläche, weil die Kante länger ist.'])

Q.q(PYR + r'Die Seitenfläche $BCS$ liegt in $4x + 3z = 24$. Wie weit ist $A$ von ihr entfernt?',
    [r'$4{,}8$', r'$24$', r'$6$', r'$4$'],
    [r'$\dfrac{|4 \cdot 0 + 3 \cdot 0 - 24|}{\sqrt{16 + 9}}$.',
     r'$= \tfrac{24}{5} = 4{,}8$.'])

Q.q(r'Ein Flugzeug steigt nach dem Start in Richtung $' + vec(3, 4, r'1{,}25') + r'$. Unter welchem Winkel steigt es?',
    [r'$\approx 14{,}0^\circ$', r'$\approx 76{,}0^\circ$', r'$\approx 22{,}6^\circ$', r'$\approx 1{,}25^\circ$'],
    [r'Waagerechter Anteil $\sqrt{9 + 16} = 5$, senkrechter $1{,}25$.',
     r'$\tan\varphi = \tfrac{1{,}25}{5} = 0{,}25$, $\varphi \approx 14{,}0^\circ$.'])

Q.q(r'Sonnenlicht fällt in Richtung $' + vec(1, 1, -2) + r'$. Wie lang ist der Schatten eines $4$ m hohen senkrechten Mastes, der im Ursprung steht, auf dem Boden $z = 0$?',
    [r'$2\sqrt2 \approx 2{,}83$ m', r'$2$ m', r'$4$ m', r'$\sqrt6 \approx 2{,}45$ m'],
    [r'Lichtstrahl durch die Mastspitze: $\vec x = (0;\ 0;\ 4) + t (1;\ 1;\ -2)$, Boden bei $t = 2$: $(2 \mid 2 \mid 0)$.',
     r'Schattenlänge $|(2;\ 2;\ 0)| = 2\sqrt2$.'])

Q.q(DACH + r'Wie stark ist das Dach geneigt?',
    [r'$\approx 36{,}9^\circ$', r'$\approx 53{,}1^\circ$', r'$45^\circ$', r'$30^\circ$'],
    [r'$\cos\varphi = \dfrac{|(0;\ 3;\ 4) \cdot (0;\ 0;\ 1)|}{5} = \tfrac45$.',
     r'$\varphi \approx 36{,}9^\circ$.'])

Q.q(DACH + r'Wie weit ist die Schornsteinspitze $(2 \mid 1 \mid 8)$ von der Dachfläche entfernt?',
    [r'$2{,}2$ m', r'$11$ m', r'$2$ m', r'$8$ m'],
    [r'$\dfrac{|3 \cdot 1 + 4 \cdot 8 - 24|}{5} = \dfrac{11}{5}$.',
     r'$= 2{,}2$ m.'])

Q.q(DACH + r'Wie hoch liegt das Dach über dem Bodenpunkt $(0 \mid 4 \mid 0)$?',
    [r'$3$ m', r'$4$ m', r'$6$ m', r'$1{,}5$ m'],
    [r'$3 \cdot 4 + 4z = 24$.',
     r'$z = 3$.'])

Q.q(r'Ein Raum ist $5$ m lang, $4$ m breit und $3$ m hoch. Wie lang darf eine gerade Stange höchstens sein, damit sie hineinpasst?',
    [r'$\sqrt{50} \approx 7{,}07$ m', r'$12$ m', r'$\sqrt{41} \approx 6{,}40$ m', r'$5$ m'],
    [r'Die längste Strecke im Quader ist die Raumdiagonale.',
     r'$\sqrt{25 + 16 + 9} = \sqrt{50}$. $\sqrt{41}$ ist nur die Bodendiagonale.'])

Q.q(r'In demselben Raum hängt eine Lampe in der Mitte der Decke bei $(2{,}5 \mid 2 \mid 3)$. Wie weit ist sie von der Bodenecke $(0 \mid 0 \mid 0)$ entfernt?',
    [r'$\approx 4{,}39$ m', r'$\approx 3{,}54$ m', r'$7{,}5$ m', r'$\approx 3{,}20$ m'],
    [r'$\sqrt{2{,}5^2 + 2^2 + 3^2} = \sqrt{19{,}25}$.',
     r'$\approx 4{,}39$ m.'])

Q.q(r'Berührt die Kugel mit dem Mittelpunkt $M(1 \mid 1 \mid 1)$ und dem Radius $1$ die Ebene $2x + y + 2z = 8$?',
    [r'Ja, der Abstand von $M$ zur Ebene ist genau $1$.', r'Nein, die Ebene schneidet die Kugel.', r'Nein, die Ebene liegt weit außerhalb.', r'Ja, weil $M$ in der Ebene liegt.'],
    [r'$\dfrac{|2 + 1 + 2 - 8|}{3} = 1$.',
     r'Abstand gleich Radius: Die Ebene ist Tangentialebene.'])

Q.q(r'Ein $30$ m hoher Mast steht im Ursprung. Ein Spannseil führt von der Spitze zum Bodenpunkt $(20 \mid 15 \mid 0)$. Wie lang ist es?',
    [r'$\approx 39{,}1$ m', r'$25$ m', r'$65$ m', r'$\approx 33{,}5$ m'],
    [r'$\sqrt{20^2 + 15^2 + 30^2} = \sqrt{1525}$.',
     r'$\approx 39{,}1$ m.'])

Q.q(r'Welchen Winkel bildet das Seil aus Aufgabe 17 mit dem Boden?',
    [r'$\approx 50{,}2^\circ$', r'$\approx 39{,}8^\circ$', r'$\approx 56{,}3^\circ$', r'$\approx 36{,}9^\circ$'],
    [r'Waagerechter Abstand $\sqrt{400 + 225} = 25$ m, Höhe $30$ m.',
     r'$\tan\varphi = \tfrac{30}{25}$, $\varphi \approx 50{,}2^\circ$.'])

Q.q(r'Eine Pyramide hat die Grundfläche $(3 \mid 0 \mid 0)$, $(0 \mid 3 \mid 0)$, $(0 \mid 0 \mid 3)$ und die Spitze im Ursprung. Die Grundfläche ist $\tfrac92\sqrt3$ groß. Welches Volumen hat sie?',
    [r'$4{,}5$', r'$9$', r'$13{,}5$', r'$27$'],
    [r'Höhe $=$ Abstand von $O$ zu $x + y + z = 3$ $= \tfrac{3}{\sqrt3} = \sqrt3$.',
     r'$V = \tfrac13 \cdot \tfrac92\sqrt3 \cdot \sqrt3 = 4{,}5$. Kontrolle: $\tfrac16 \cdot 3 \cdot 3 \cdot 3$.'])

Q.q(r'Zwei Drohnen schweben bei $(0 \mid 0 \mid 50)$ und $(40 \mid 30 \mid 50)$ (in m). Wie weit sind sie voneinander entfernt?',
    [r'$50$ m', r'$70$ m', r'$\approx 76{,}8$ m', r'$100$ m'],
    [r'Gleiche Höhe: Nur die waagerechte Verschiebung $(40;\ 30;\ 0)$ zählt.',
     r'$\sqrt{1600 + 900} = 50$ m.'])


def check():
    a = lambda *c: np.array(c, dtype=float)
    A, B, C, S = a(0, 0, 0), a(6, 0, 0), a(6, 6, 0), a(3, 3, 4)
    assert abs(np.linalg.norm(S - A) - 5.83) < 0.005 and 36 * 4 / 3 == 48
    M = (A + B) / 2
    assert np.linalg.norm(S - M) == 5 and 4 * 0.5 * 6 * 5 == 60
    assert abs(math.degrees(math.atan(4 / 3)) - 53.1) < 0.05 and abs(math.degrees(math.asin(4 / math.sqrt(34))) - 43.3) < 0.05
    n = np.cross(C - B, S - B)
    assert (n / 6 == a(4, 0, 3)).all() and n @ B / 6 == 24 and 24 / 5 == 4.8
    assert abs(math.degrees(math.atan(1.25 / 5)) - 14.0) < 0.05
    P = a(0, 0, 4) + 2 * a(1, 1, -2)
    assert P[2] == 0 and abs(np.linalg.norm(P) - 2.83) < 0.005
    assert abs(math.degrees(math.acos(4 / 5)) - 36.9) < 0.05 and abs(3 * 1 + 4 * 8 - 24) / 5 == 2.2 and (24 - 12) / 4 == 3
    assert abs(math.sqrt(50) - 7.07) < 0.005 and abs(math.sqrt(19.25) - 4.39) < 0.005
    assert abs(2 + 1 + 2 - 8) / 3 == 1
    assert abs(math.sqrt(1525) - 39.1) < 0.05 and abs(math.degrees(math.atan(30 / 25)) - 50.2) < 0.05
    G = np.linalg.norm(np.cross(a(-3, 3, 0), a(-3, 0, 3))) / 2
    assert abs(G - 4.5 * math.sqrt(3)) < 1e-12 and abs(G * math.sqrt(3) / 3 - 4.5) < 1e-12
    assert np.linalg.norm(a(40, 30, 0)) == 50


Q.verify(check)
Q.save()
