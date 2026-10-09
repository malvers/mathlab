#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 23 / KW 8 (LB 3): the spatial Cartesian coordinate system -
points, coordinate planes, distances, solids. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=23, slug='raum-koordinaten', thema='Das räumliche Koordinatensystem', lb='LB 3',
         blurb='Punkte im Raum, Koordinatenebenen, Abstände, Körper',
         comment='Blocks: points and planes (1-7), reflections (8-9), distances (10-14), solids (15-20).')

# -------------------------------------------------------- points and planes ----
Q.q(r'Welche $y$-Koordinate hat der Punkt $P(2 \mid 3 \mid 4)$?',
    [r'3', r'2', r'4', r'9'],
    [r'Reihenfolge der Koordinaten: $x$, $y$, $z$.'])

Q.q(r'Welcher Punkt liegt auf der $x$-Achse?',
    [r'$(5 \mid 0 \mid 0)$', r'$(0 \mid 5 \mid 0)$', r'$(5 \mid 5 \mid 0)$', r'$(0 \mid 0 \mid 5)$'],
    [r'Auf der $x$-Achse sind $y$ und $z$ null.'])

Q.q(r'Welche Punkte liegen in der $xy$-Ebene?',
    [r'Alle Punkte mit $z = 0$', r'Alle Punkte mit $x = y$', r'Alle Punkte mit $x = 0$', r'Alle Punkte mit $y = 0$'],
    [r'Die $xy$-Ebene ist der „Boden“ des Koordinatensystems.',
     r'Dort ist die Höhe $z$ null.'])

Q.q(r'Welcher Punkt liegt in der $yz$-Ebene?',
    [r'$(0 \mid -2 \mid 5)$', r'$(-2 \mid 0 \mid 5)$', r'$(5 \mid -2 \mid 0)$', r'$(1 \mid 1 \mid 1)$'],
    [r'In der $yz$-Ebene ist $x = 0$.'])

Q.q(r'Was beschreibt die Menge aller Punkte mit $x = 3$?',
    [r'Eine Ebene parallel zur $yz$-Ebene', r'Eine Gerade parallel zur $x$-Achse', r'Einen Punkt', r'Die $x$-Achse'],
    [r'$y$ und $z$ sind frei wählbar: zwei Freiheitsgrade, also eine Ebene.',
     r'Sie hat überall den Abstand 3 von der $yz$-Ebene.'])

Q.q(r'Wie hoch liegt der Punkt $(1 \mid 1 \mid 5)$ über der $xy$-Ebene?',
    [r'5', r'1', r'7', r'$\sqrt{27}$'],
    [r'Die Höhe über der $xy$-Ebene ist die $z$-Koordinate.'])

Q.q(r'In wie viele Bereiche (Oktanten) teilen die drei Koordinatenebenen den Raum?',
    [r'8', r'4', r'6', r'3'],
    [r'Jede Koordinate kann positiv oder negativ sein: $2 \cdot 2 \cdot 2 = 8$.'])

# ------------------------------------------------------------- reflections ----
Q.q(r'Spiegle $P(1 \mid 2 \mid 3)$ an der $xy$-Ebene.',
    [r'$P^{\prime}(1 \mid 2 \mid -3)$', r'$P^{\prime}(-1 \mid -2 \mid 3)$', r'$P^{\prime}(-1 \mid -2 \mid -3)$', r'$P^{\prime}(2 \mid 1 \mid 3)$'],
    [r'Bei der Spiegelung an der $xy$-Ebene ändert nur $z$ das Vorzeichen.'])

Q.q(r'Spiegle $P(1 \mid 2 \mid 3)$ am Ursprung.',
    [r'$P^{\prime}(-1 \mid -2 \mid -3)$', r'$P^{\prime}(1 \mid 2 \mid -3)$', r'$P^{\prime}(3 \mid 2 \mid 1)$', r'$P^{\prime}(0 \mid 0 \mid 0)$'],
    [r'Punktspiegelung am Ursprung: Alle drei Koordinaten wechseln das Vorzeichen.'])

# ---------------------------------------------------------------- distances ----
Q.q(r'Wie weit ist $P(2 \mid 3 \mid 6)$ vom Ursprung entfernt?',
    [r'7', r'11', r'49', r'$\sqrt{11}$'],
    [r'Räumlicher Pythagoras: $\sqrt{2^2 + 3^2 + 6^2} = \sqrt{49}$'])

Q.q(r'Wie lang ist die Strecke zwischen $A(1 \mid 2 \mid 3)$ und $B(4 \mid 6 \mid 3)$?',
    [r'5', r'7', r'25', r'$\sqrt{7}$'],
    [r'Differenzen: 3, 4, 0.',
     r'$\sqrt{9 + 16 + 0} = 5$'])

Q.q(r'Bestimme den Mittelpunkt der Strecke $AB$ mit $A(2 \mid 0 \mid 4)$ und $B(6 \mid 2 \mid 0)$.',
    [r'$M(4 \mid 1 \mid 2)$', r'$M(8 \mid 2 \mid 4)$', r'$M(2 \mid 1 \mid -2)$', r'$M(4 \mid 2 \mid 2)$'],
    [r'Koordinatenweise das arithmetische Mittel.',
     r'$\left(\dfrac{2 + 6}{2} \mid \dfrac{0 + 2}{2} \mid \dfrac{4 + 0}{2}\right)$'])

Q.q(r'Wie weit ist $P(3 \mid 4 \mid 12)$ von der $z$-Achse entfernt?',
    [r'5', r'13', r'12', r'7'],
    [r'Der nächste Punkt auf der $z$-Achse ist $(0 \mid 0 \mid 12)$.',
     r'Abstand: $\sqrt{3^2 + 4^2} = 5$; die Höhe spielt keine Rolle.'])

Q.q(r'Wie weit ist $Q(0 \mid 0 \mid -3)$ vom Ursprung entfernt?',
    [r'3', r'−3', r'0', r'9'],
    [r'Abstände sind nie negativ: $\sqrt{0 + 0 + 9} = 3$.'])

# ------------------------------------------------------------------- solids ----
Q.q(r'Ein Würfel mit Kantenlänge 4 hat eine Ecke im Ursprung und liegt im Oktanten mit nur positiven Koordinaten. Welche Ecke liegt dem Ursprung gegenüber?',
    [r'$(4 \mid 4 \mid 4)$', r'$(4 \mid 0 \mid 4)$', r'$(0 \mid 4 \mid 4)$', r'$(2 \mid 2 \mid 2)$'],
    [r'Die gegenüberliegende Ecke ist in alle drei Richtungen um 4 verschoben.'])

Q.q(r'Wie lang ist die Raumdiagonale eines Quaders mit den Kanten 3, 4 und 5?',
    [r'$5\sqrt{2}$', r'12', r'$\sqrt{12}$', r'50'],
    [r'$\sqrt{3^2 + 4^2 + 5^2} = \sqrt{50}$',
     r'$\sqrt{50} = \sqrt{25 \cdot 2} = 5\sqrt{2} \approx 7{,}07$'])

Q.q(r'Ein Quader hat die gegenüberliegenden Ecken $(0 \mid 0 \mid 0)$ und $(2 \mid 3 \mid 4)$, die Kanten parallel zu den Achsen. Wie groß ist sein Volumen?',
    [r'24', r'9', r'29', r'$\sqrt{29}$'],
    [r'Kantenlängen 2, 3 und 4.',
     r'$V = 2 \cdot 3 \cdot 4 = 24$'])

Q.q(r'Eine quadratische Pyramide hat die Grundfläche mit den Ecken $(\pm 2 \mid \pm 2 \mid 0)$ und die Höhe 6. Wo liegt die Spitze?',
    [r'$(0 \mid 0 \mid 6)$', r'$(2 \mid 2 \mid 6)$', r'$(0 \mid 6 \mid 0)$', r'$(6 \mid 6 \mid 6)$'],
    [r'Bei einer geraden Pyramide liegt die Spitze über dem Mittelpunkt der Grundfläche.',
     r'Mittelpunkt $(0 \mid 0 \mid 0)$, also Spitze $(0 \mid 0 \mid 6)$.'])

Q.q(r'Wie lang ist eine Seitenkante dieser Pyramide, z. B. von $(2 \mid 2 \mid 0)$ zur Spitze $(0 \mid 0 \mid 6)$?',
    [r'$2\sqrt{11}$', r'6', r'$\sqrt{40}$', r'8'],
    [r'$\sqrt{2^2 + 2^2 + 6^2} = \sqrt{44}$',
     r'$\sqrt{44} = 2\sqrt{11} \approx 6{,}63$'])

Q.q(r'Welchen Rauminhalt hat diese Pyramide (Grundfläche 4 mal 4, Höhe 6)?',
    [r'32', r'96', r'48', r'16'],
    [r'$V = \dfrac{1}{3} \cdot G \cdot h = \dfrac{1}{3} \cdot 16 \cdot 6$',
     r'$V = 32$'])


def check():
    import sympy as sp
    dist = lambda p, q: sp.sqrt(sum((a - b) ** 2 for a, b in zip(p, q)))
    assert dist((2, 3, 6), (0, 0, 0)) == 7
    assert dist((1, 2, 3), (4, 6, 3)) == 5
    assert tuple(sp.Rational(a + b, 2) for a, b in zip((2, 0, 4), (6, 2, 0))) == (4, 1, 2)
    assert dist((3, 4, 12), (0, 0, 12)) == 5 and dist((0, 0, -3), (0, 0, 0)) == 3
    assert dist((0, 0, 0), (3, 4, 5)) == 5 * sp.sqrt(2)
    assert 2 * 3 * 4 == 24
    assert dist((2, 2, 0), (0, 0, 6)) == 2 * sp.sqrt(11)
    assert sp.Rational(1, 3) * 16 * 6 == 32


Q.verify(check)
Q.save()
