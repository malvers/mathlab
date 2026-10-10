#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 3 / KW 36 (LB 1): Pythagoras in Figuren -
Diagonalen, Höhen, Abstände im Koordinatensystem. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=3, slug='pythagoras-figuren', thema='Pythagoras in Figuren', lb='LB 1',
        blurb='Diagonalen in Rechteck und Quadrat, Höhen in Dreiecken, Abstände von Punkten',
        comment='Blocks: rectangles and squares (1-3, 13-14, 19), triangles (4-7, 17-18), distances in coordinates (8-10, 20), rhombus, trapezoid, circle (11-12, 15-16).')

# ----------------------------------------------------- Rechteck, Quadrat ----
Q.q(r'Ein Rechteck ist 8 cm lang und 6 cm breit. Wie lang ist seine Diagonale?',
    [r'10 cm', r'14 cm', r'7 cm', r'48 cm'],
    [r'Die Diagonale teilt das Rechteck in zwei rechtwinklige Dreiecke.',
     r'$d = \sqrt{64 + 36} = \sqrt{100} = 10$ cm'])

Q.q(r'Ein Quadrat hat die Seitenlänge 5 cm. Wie lang ist seine Diagonale (gerundet)?',
    [r'7,07 cm', r'10 cm', r'5 cm', r'25 cm'],
    [r'$d = \sqrt{25 + 25} = \sqrt{50}$',
     r'$d \approx 7{,}07$ cm'])

Q.q(r'Welche Formel gibt die Diagonale $d$ eines Quadrats mit der Seite $a$ an?',
    [r'$d = a \cdot \sqrt{2}$', r'$d = 2a$', r'$d = a^2$', r'$d = \dfrac{a}{2}$'],
    [r'$d^2 = a^2 + a^2 = 2a^2$',
     r'$d = \sqrt{2a^2} = a \cdot \sqrt{2}$'])

# ------------------------------------------------------------- Dreiecke ----
Q.q(r'Ein gleichseitiges Dreieck hat die Seitenlänge 6 cm. Wie lang ist seine Höhe (gerundet)?',
    [r'5,20 cm', r'6 cm', r'3 cm', r'6,71 cm'],
    [r'Die Höhe halbiert die Grundseite: rechtwinkliges Dreieck mit Hypotenuse 6 und Kathete 3.',
     r'$h = \sqrt{36 - 9} = \sqrt{27} \approx 5{,}20$ cm'])

Q.q(r'Welche Formel gilt für die Höhe eines gleichseitigen Dreiecks mit der Seite $a$?',
    [r'$h = \dfrac{a}{2} \cdot \sqrt{3}$', r'$h = a \cdot \sqrt{2}$', r'$h = \dfrac{a}{2}$', r'$h = a^2 - \dfrac{a^2}{4}$'],
    [r'$h^2 = a^2 - \left(\dfrac{a}{2}\right)^2 = \dfrac{3}{4}a^2$',
     r'$h = \dfrac{a}{2} \cdot \sqrt{3}$'])

Q.q(r'Ein gleichschenkliges Dreieck hat die Basis 10 cm und Schenkel von 13 cm. Wie lang ist die Höhe auf die Basis?',
    [r'12 cm', r'8 cm', r'16,4 cm', r'11 cm'],
    [r'Die Höhe halbiert die Basis: 5 cm.',
     r'$h = \sqrt{169 - 25} = \sqrt{144} = 12$ cm'])

Q.q(r'Wie groß ist der Flächeninhalt des gleichschenkligen Dreiecks aus der vorigen Aufgabe (Basis 10 cm, Höhe 12 cm)?',
    [r'60 cm²', r'120 cm²', r'65 cm²', r'36 cm²'],
    [r'$A = \dfrac{g \cdot h}{2} = \dfrac{10 \cdot 12}{2} = 60$ cm²'])

# ---------------------------------------------------- Koordinatensystem ----
Q.q(r'Wie weit sind $P(1 \mid 2)$ und $Q(4 \mid 6)$ voneinander entfernt (Einheit cm)?',
    [r'5 cm', r'7 cm', r'25 cm', r'3 cm'],
    [r'Unterschiede: in $x$ 3, in $y$ 4.',
     r'$d = \sqrt{3^2 + 4^2} = 5$ cm'])

Q.q(r'Wie weit sind $P(-2 \mid 1)$ und $Q(3 \mid -11)$ voneinander entfernt?',
    [r'13', r'17', r'11', r'169'],
    [r'Unterschiede: $3 - (-2) = 5$ und $-11 - 1 = -12$.',
     r'$d = \sqrt{25 + 144} = \sqrt{169} = 13$'])

Q.q(r'Wie weit ist der Punkt $P(6 \mid 8)$ vom Ursprung entfernt?',
    [r'10', r'14', r'100', r'7'],
    [r'$d = \sqrt{36 + 64} = 10$'])

# ------------------------------------------------ Raute, Trapez, Kreis ----
Q.q(r'Eine Raute hat die Diagonalen 6 cm und 8 cm. Wie lang ist eine Seite?',
    [r'5 cm', r'10 cm', r'7 cm', r'14 cm'],
    [r'Die Diagonalen einer Raute halbieren sich und stehen senkrecht.',
     r'Halbe Diagonalen: 3 cm und 4 cm, also $a = \sqrt{9 + 16} = 5$ cm.'])

Q.q(r'Ein gleichschenkliges Trapez hat die Grundseiten 10 cm und 4 cm und Schenkel von 5 cm. Wie hoch ist es?',
    [r'4 cm', r'3 cm', r'5 cm', r'6 cm'],
    [r'Überstand auf jeder Seite: $(10 - 4) : 2 = 3$ cm.',
     r'$h = \sqrt{25 - 9} = \sqrt{16} = 4$ cm'])

Q.q(r'Ein Rechteck hat die Diagonale 13 cm und eine Seite von 5 cm. Wie groß ist sein Flächeninhalt?',
    [r'60 cm²', r'65 cm²', r'30 cm²', r'144 cm²'],
    [r'Andere Seite: $\sqrt{169 - 25} = 12$ cm',
     r'$A = 5 \cdot 12 = 60$ cm²'])

Q.q(r'Ein Quadrat hat die Diagonale 10 cm. Wie groß ist sein Flächeninhalt?',
    [r'50 cm²', r'100 cm²', r'25 cm²', r'70,7 cm²'],
    [r'$d^2 = 2a^2$, also $a^2 = \dfrac{100}{2} = 50$.',
     r'$A = a^2 = 50$ cm²'])

Q.q(r'Ein Kreis hat den Radius 5 cm. Eine Sehne ist 3 cm vom Mittelpunkt entfernt. Wie lang ist die Sehne?',
    [r'8 cm', r'4 cm', r'10 cm', r'5,8 cm'],
    [r'Radius, Abstand und halbe Sehne bilden ein rechtwinkliges Dreieck.',
     r'Halbe Sehne: $\sqrt{25 - 9} = 4$ cm, ganze Sehne 8 cm.'])

Q.q(r'Eine Raute hat die Diagonalen 10 cm und 24 cm. Wie groß ist ihr Umfang?',
    [r'52 cm', r'68 cm', r'26 cm', r'34 cm'],
    [r'Halbe Diagonalen: 5 cm und 12 cm, Seite $\sqrt{25 + 144} = 13$ cm.',
     r'$u = 4 \cdot 13 = 52$ cm'])

Q.q(r'Wie groß ist der Flächeninhalt eines gleichseitigen Dreiecks mit 4 cm Seitenlänge (gerundet)?',
    [r'6,93 cm²', r'8 cm²', r'16 cm²', r'13,86 cm²'],
    [r'$h = \sqrt{16 - 4} = \sqrt{12} \approx 3{,}464$ cm',
     r'$A = \dfrac{4 \cdot 3{,}464}{2} \approx 6{,}93$ cm²'])

Q.q(r'Ein rechtwinkliges Dreieck hat die Seiten 3 cm, 4 cm und 5 cm. Wie lang ist die Höhe auf die Hypotenuse?',
    [r'2,4 cm', r'3,5 cm', r'2 cm', r'1,2 cm'],
    [r'Flächeninhalt über die Katheten: $\dfrac{3 \cdot 4}{2} = 6$ cm².',
     r'Auch $A = \dfrac{5 \cdot h}{2}$, also $h = \dfrac{12}{5} = 2{,}4$ cm.'])

Q.q(r'Ein Quadrat mit 4 cm Seitenlänge liegt so in einem Kreis, dass alle Ecken auf dem Kreis liegen. Wie groß ist der Radius (gerundet)?',
    [r'2,83 cm', r'2 cm', r'4 cm', r'5,66 cm'],
    [r'Die Diagonale ist ein Durchmesser: $d = 4\sqrt{2} \approx 5{,}66$ cm.',
     r'$r = d : 2 \approx 2{,}83$ cm'])

Q.q(r'Wie lang ist die Strecke vom Ursprung zum Punkt $(5 \mid 12)$?',
    [r'13', r'17', r'7', r'60'],
    [r'$\sqrt{25 + 144} = \sqrt{169} = 13$'])


def check():
    from math import sqrt, isclose, dist
    assert sqrt(64 + 36) == 10 and round(sqrt(50), 2) == 7.07
    assert round(sqrt(27), 2) == 5.20 and isclose(sqrt(27), 3 * sqrt(3))
    assert sqrt(169 - 25) == 12 and 10 * 12 / 2 == 60
    assert dist((1, 2), (4, 6)) == 5 and dist((-2, 1), (3, -11)) == 13 and dist((0, 0), (6, 8)) == 10
    assert sqrt(9 + 16) == 5 and sqrt(25 - 9) == 4
    assert 5 * sqrt(169 - 25) == 60 and 100 / 2 == 50
    assert 2 * sqrt(25 - 9) == 8 and 4 * sqrt(25 + 144) == 52
    assert round(4 * sqrt(12) / 2, 2) == 6.93
    assert 3 * 4 / 5 == 2.4
    assert round(4 * sqrt(2) / 2, 2) == 2.83 and dist((0, 0), (5, 12)) == 13


Q.verify(check)
Q.save()
