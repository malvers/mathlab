#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 20 (LB 7): Abstand Punkt-Punkt und
Punkt-Ebene, Hessesche Normalform, Lotfußpunkt, parallele Ebenen.
Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12, vec
import numpy as np
import math

Q = gy12(nr=20, slug='abstand-punkt-ebene', thema='Abstand Punkt–Punkt und Punkt–Ebene', lb='LB 7',
         blurb='Abstände zwischen Punkten, Hessesche Normalform, Lotfußpunkt',
         comment='Blocks: Punkt und Punkt (1, 2, 14, 15, 20), Abstandsformel und HNF (3-7, 11, 18), Lotfußpunkt (8, 9), Seiten und Parameter (12, 13, 19), parallele Ebenen und Körper (10, 16, 17). Ohne Hilfsmittel.')

Q.q(r'Wie weit sind $A(1 \mid 2 \mid 3)$ und $B(3 \mid 4 \mid 4)$ voneinander entfernt?',
    [r'$3$', r'$9$', r'$5$', r'$\sqrt5$'],
    [r'$\vec{AB} = (2;\ 2;\ 1)$.',
     r'$|\vec{AB}| = \sqrt{4 + 4 + 1} = 3$.'])

Q.q(r'Wie weit ist $P(2 \mid 3 \mid 6)$ vom Ursprung entfernt?',
    [r'$7$', r'$11$', r'$49$', r'$\sqrt{11}$'],
    [r'$\sqrt{4 + 9 + 36} = \sqrt{49}$.',
     r'$= 7$.'])

Q.q(r'Mit welcher Formel berechnet man den Abstand des Punktes $P$ von der Ebene $E\colon \vec n \cdot \vec x = d$?',
    [r'$\dfrac{|\vec n \cdot \vec p - d|}{|\vec n|}$', r'$|\vec n \cdot \vec p - d|$', r'$\dfrac{\vec n \cdot \vec p}{d}$', r'$|\vec p - \vec n|$'],
    [r'Man setzt $P$ in die Hessesche Normalform ein.',
     r'Ohne die Division durch $|\vec n|$ stimmt das Ergebnis nur für Normalenvektoren der Länge $1$.'])

Q.q(r'Wie weit ist der Ursprung von der Ebene $2x + y + 2z = 6$ entfernt?',
    [r'$2$', r'$6$', r'$3$', r'$1{,}2$'],
    [r'$|\vec n| = 3$.',
     r'$d = \tfrac{|0 - 6|}{3} = 2$.'])

Q.q(r'Wie weit ist $P(1 \mid 1 \mid 1)$ von der Ebene $2x - y + 2z = 9$ entfernt?',
    [r'$2$', r'$6$', r'$3$', r'$\tfrac{4}{3}$'],
    [r'Einsetzen: $2 - 1 + 2 - 9 = -6$.',
     r'$d = \tfrac{|-6|}{3} = 2$.'])

Q.q(r'Wie weit ist $P(3 \mid 4 \mid 5)$ von der Ebene $z = 0$ entfernt?',
    [r'$5$', r'$\sqrt{50}$', r'$3$', r'$4$'],
    [r'Der Abstand von der $x$-$y$-Ebene ist der Betrag der $z$-Koordinate.',
     r'$d = 5$.'])

Q.q(r'Wie weit ist $P(1 \mid 2 \mid 3)$ von der Ebene $x + y + z = 0$ entfernt?',
    [r'$2\sqrt3 \approx 3{,}46$', r'$6$', r'$2$', r'$\sqrt{14}$'],
    [r'$\dfrac{|1 + 2 + 3|}{\sqrt3} = \dfrac{6}{\sqrt3}$.',
     r'$= 2\sqrt3$.'])

Q.q(r'Welcher Punkt der Ebene $2x + y + 2z = 9$ liegt dem Ursprung am nächsten?',
    [r'$(2 \mid 1 \mid 2)$', r'$(4{,}5 \mid 0 \mid 0)$', r'$(1 \mid 1 \mid 1)$', r'$(0 \mid 9 \mid 0)$'],
    [r'Lotgerade $\vec x = t \cdot (2;\ 1;\ 2)$ in $E$ einsetzen: $9t = 9$, $t = 1$.',
     r'Lotfußpunkt $F(2 \mid 1 \mid 2)$, Abstand $|\vec{OF}| = 3$.'])

Q.q(r'Welcher ist der Lotfußpunkt von $P(3 \mid 4 \mid 5)$ auf der Ebene $z = 0$?',
    [r'$(3 \mid 4 \mid 0)$', r'$(0 \mid 0 \mid 5)$', r'$(0 \mid 0 \mid 0)$', r'$(3 \mid 4 \mid -5)$'],
    [r'Die Lotgerade läuft senkrecht nach unten, nur $z$ ändert sich.',
     r'$F(3 \mid 4 \mid 0)$. $(3 \mid 4 \mid -5)$ wäre der Spiegelpunkt.'])

Q.q(r'Wie weit sind die parallelen Ebenen $2x + y + 2z = 3$ und $2x + y + 2z = 12$ voneinander entfernt?',
    [r'$3$', r'$9$', r'$1$', r'$5$'],
    [r'Gleicher Normalenvektor, Betrag $3$.',
     r'$d = \tfrac{|12 - 3|}{3} = 3$.'])

Q.q(r'Wie lautet die Hessesche Normalform der Ebene $2x + y + 2z = 6$?',
    [r'$\tfrac13 (2x + y + 2z - 6) = 0$', r'$\tfrac16 (2x + y + 2z) = 1$', r'$\tfrac15 (2x + y + 2z - 6) = 0$', r'$2x + y + 2z - 6 = 1$'],
    [r'Durch den Betrag des Normalenvektors teilen, $\sqrt{4 + 1 + 4} = 3$.',
     r'Setzt man einen Punkt links ein, erhält man seinen Abstand mit Vorzeichen.'])

Q.q(r'Liegen $O(0 \mid 0 \mid 0)$ und $Q(3 \mid 3 \mid 3)$ auf derselben Seite der Ebene $2x + y + 2z = 6$?',
    [r'Nein, die Vorzeichen in der Hesseschen Normalform sind verschieden.', r'Ja, beide haben den Abstand $2$.', r'Ja, beide liegen über der Ebene.', r'Das lässt sich ohne Zeichnung nicht entscheiden.'],
    [r'$O$: $\tfrac13 (0 - 6) = -2$; $Q$: $\tfrac13 (6 + 3 + 6 - 6) = 3$.',
     r'Verschiedene Vorzeichen, also verschiedene Seiten: Die Strecke $OQ$ durchstößt $E$.'])

Q.q(r'Welche Punkte der $z$-Achse haben von $E\colon 2x + y + 2z = 6$ den Abstand $3$?',
    [r'$(0 \mid 0 \mid 7{,}5)$ und $(0 \mid 0 \mid -1{,}5)$', r'nur $(0 \mid 0 \mid 7{,}5)$', r'$(0 \mid 0 \mid 3)$ und $(0 \mid 0 \mid -3)$', r'$(0 \mid 0 \mid 4{,}5)$'],
    [r'$\tfrac{|2z - 6|}{3} = 3$, also $2z - 6 = 9$ oder $2z - 6 = -9$.',
     r'$z = 7{,}5$ oder $z = -1{,}5$: je ein Punkt auf jeder Seite.'])

Q.q(r'Wie weit sind $P(1 \mid 2 \mid -1)$ und $Q(4 \mid 6 \mid -1)$ voneinander entfernt?',
    [r'$5$', r'$7$', r'$25$', r'$\sqrt7$'],
    [r'$\vec{PQ} = (3;\ 4;\ 0)$.',
     r'$\sqrt{9 + 16} = 5$.'])

Q.q(r'Welcher Punkt der $x$-Achse ist von $A(1 \mid 1 \mid 0)$ und $B(3 \mid -1 \mid 2)$ gleich weit entfernt?',
    [r'$(3 \mid 0 \mid 0)$', r'$(2 \mid 0 \mid 0)$', r'$(1 \mid 0 \mid 0)$', r'$(4 \mid 0 \mid 0)$'],
    [r'$(x - 1)^2 + 1 = (x - 3)^2 + 1 + 4$, also $-2x + 2 = -6x + 14$.',
     r'$x = 3$. Probe: beide Abstände $\sqrt5$.'])

Q.q(r'Ein Tetraeder hat die Grundfläche durch $(1 \mid 0 \mid 0)$, $(0 \mid 1 \mid 0)$, $(0 \mid 0 \mid 1)$ und die Spitze $O$. Wie hoch ist es?',
    [r'$\tfrac{1}{\sqrt3} \approx 0{,}58$', r'$1$', r'$\sqrt3 \approx 1{,}73$', r'$\tfrac13$'],
    [r'Grundfläche in $E\colon x + y + z = 1$.',
     r'Höhe $=$ Abstand von $O$ zu $E$ $= \tfrac{1}{\sqrt3}$.'])

Q.q(r'Eine Kugel mit dem Mittelpunkt $M(1 \mid 2 \mid 3)$ berührt die Ebene $z = 0$. Wie groß ist ihr Radius?',
    [r'$3$', r'$\sqrt{14}$', r'$1$', r'$6$'],
    [r'Berühren heißt: Der Radius ist der Abstand des Mittelpunkts von der Ebene.',
     r'$r = 3$.'])

Q.q(r'Wie weit ist $P(2 \mid 2 \mid 2)$ von der Ebene $x + 2y + 2z = 1$ entfernt?',
    [r'$3$', r'$9$', r'$\tfrac{10}{3}$', r'$1$'],
    [r'Einsetzen: $2 + 4 + 4 - 1 = 9$, $|\vec n| = 3$.',
     r'$d = 3$.'])

Q.q(r'Für welche $d$ hat die Ebene $2x - y + 2z = d$ vom Ursprung den Abstand $2$?',
    [r'$d = 6$ oder $d = -6$', r'nur $d = 6$', r'$d = 2$', r'$d = \pm 2$'],
    [r'$\tfrac{|d|}{3} = 2$.',
     r'$|d| = 6$: zwei parallele Ebenen, je eine auf jeder Seite.'])

Q.q(r'Welche Punkte der Geraden $\vec x = t \cdot ' + vec(1, 2, 2) + r'$ haben vom Ursprung den Abstand $3$?',
    [r'$(1 \mid 2 \mid 2)$ und $(-1 \mid -2 \mid -2)$', r'nur $(1 \mid 2 \mid 2)$', r'$(3 \mid 6 \mid 6)$', r'$(1 \mid 1 \mid 1)$'],
    [r'$|t| \cdot 3 = 3$, also $t = \pm 1$.',
     r'Zwei Punkte, symmetrisch zum Ursprung.'])


def check():
    a = lambda *c: np.array(c, dtype=float)
    dist = lambda P, n, d: abs(n @ P - d) / np.linalg.norm(n)
    assert np.linalg.norm(a(3, 4, 4) - a(1, 2, 3)) == 3 and np.linalg.norm(a(2, 3, 6)) == 7
    n = a(2, 1, 2)
    assert dist(a(0, 0, 0), n, 6) == 2 and dist(a(1, 1, 1), a(2, -1, 2), 9) == 2 and dist(a(3, 4, 5), a(0, 0, 1), 0) == 5
    assert abs(dist(a(1, 2, 3), a(1, 1, 1), 0) - 2 * math.sqrt(3)) < 1e-12
    F = 1 * n
    assert n @ F == 9 and np.linalg.norm(F) == 3
    assert abs(12 - 3) / 3 == 3 and (n @ a(0, 0, 0) - 6) / 3 == -2 and (n @ a(3, 3, 3) - 6) / 3 == 3
    assert all(dist(a(0, 0, z), n, 6) == 3 for z in (7.5, -1.5))
    assert np.linalg.norm(a(4, 6, -1) - a(1, 2, -1)) == 5
    X = a(3, 0, 0)
    assert abs(np.linalg.norm(X - a(1, 1, 0)) - np.linalg.norm(X - a(3, -1, 2))) < 1e-12
    assert abs(dist(a(0, 0, 0), a(1, 1, 1), 1) - 1 / math.sqrt(3)) < 1e-12
    assert dist(a(2, 2, 2), a(1, 2, 2), 1) == 3 and all(dist(a(0, 0, 0), a(2, -1, 2), d) == 2 for d in (6, -6))
    assert np.linalg.norm(a(1, 2, 2)) == 3


Q.verify(check)
Q.save()
