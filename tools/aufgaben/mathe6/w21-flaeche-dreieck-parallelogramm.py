#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 21 / KW 4 (LB 3): area of parallelograms and triangles by
cutting and completing, base and matching height. Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os6
from osfig import vieleck

Q = os6(nr=21, slug='flaeche-dreieck-parallelogramm', thema='Flächeninhalt von Dreieck und Parallelogramm', lb='LB 3',
        blurb='Grundseite und Höhe, Zerlegen und Ergänzen, A = g · h und A = g · h : 2',
        comment='Blocks: figures (1-2, 10), formulas and reasons (3-5, 13-15, 19), computing (6-9, 11-12, 16-18, 20).')

PARA = [(0, 0), (6, 0), (8, 4), (2, 4)]
TRI = [(0, 0), (8, 0), (3, 5)]
STUMPF = [(0, 0), (4, 0), (7, 3)]

# ------------------------------------------------------------------ figures ----
Q.q(r'Wie groß ist der Flächeninhalt des Parallelogramms?',
    [r'24 cm²', r'20 cm²', r'48 cm²', r'12 cm²'],
    [r'Flächeninhalt Parallelogramm: Grundseite mal zugehörige Höhe.',
     r'$A = g \cdot h = 6 \text{ cm} \cdot 4 \text{ cm}$',
     r'$A = 24 \text{ cm}^2$'],
    fig=vieleck(PARA, names=['A', 'B', 'C', 'D'], sides=[(0, 'g = 6 cm')], extra=[((2, 4), (2, 0), 'h = 4 cm')]),
    figcap=r'Parallelogramm ABCD mit Höhe h')

Q.q(r'Wie groß ist der Flächeninhalt des Dreiecks?',
    [r'20 cm²', r'40 cm²', r'13 cm²', r'26 cm²'],
    [r'Ein Dreieck ist ein halbes Parallelogramm.',
     r'$A = g \cdot h : 2 = 8 \text{ cm} \cdot 5 \text{ cm} : 2$',
     r'$A = 20 \text{ cm}^2$'],
    fig=vieleck(TRI, names=['A', 'B', 'C'], sides=[(0, 'g = 8 cm')], extra=[((3, 5), (3, 0), 'h = 5 cm')]),
    figcap=r'Dreieck ABC mit Höhe h')

Q.q(r'Wie groß ist der Flächeninhalt des stumpfwinkligen Dreiecks?',
    [r'6 cm²', r'12 cm²', r'10,5 cm²', r'21 cm²'],
    [r'Die Höhe auf $g = \overline{AB}$ liegt außerhalb: Man verlängert die Grundseite.',
     r'Sie ist trotzdem der Abstand von $C$ zur Geraden $AB$: $h = 3$ cm.',
     r'$A = 4 \text{ cm} \cdot 3 \text{ cm} : 2 = 6 \text{ cm}^2$'],
    fig=vieleck(STUMPF, names=['A', 'B', 'C'], sides=[(0, 'g = 4 cm')],
                extra=[((4, 0), (7, 0), ''), ((7, 3), (7, 0), 'h = 3 cm')]),
    figcap=r'Dreieck ABC, die Höhe liegt außerhalb')

# ------------------------------------------------------- formulas and reasons ----
Q.q(r'Mit welcher Formel berechnet man den Flächeninhalt eines Parallelogramms?',
    [r'$A = g \cdot h$', r'$A = g \cdot h : 2$', r'$A = 2 \cdot g + 2 \cdot h$', r'$A = a \cdot b$ mit den beiden Seiten'],
    [r'Man schneidet an einer Seite ein Dreieck ab und setzt es an der anderen Seite an.',
     r'So entsteht ein Rechteck mit der Länge $g$ und der Breite $h$.',
     r'Also $A = g \cdot h$.'])

Q.q(r'Warum hat ein Parallelogramm denselben Flächeninhalt wie ein Rechteck mit derselben Grundseite und Höhe?',
    [r'Man kann ein Dreieck abschneiden und auf der anderen Seite wieder ansetzen.', r'Weil alle Vierecke gleich groß sind.',
     r'Weil seine Seiten gleich lang sind wie die des Rechtecks.', r'Weil es auch vier rechte Winkel hat.'],
    [r'Zerlegen und neu zusammensetzen ändert den Flächeninhalt nicht.',
     r'Aus dem Parallelogramm wird so ein Rechteck.',
     r'Dessen Seiten sind genau $g$ und $h$.'])

Q.q(r'Warum steht in der Dreiecksformel „: 2“?',
    [r'Zwei gleiche Dreiecke ergeben zusammen ein Parallelogramm.', r'Weil ein Dreieck zwei Höhen hat.',
     r'Weil man die Grundseite halbieren muss, um die Höhe zu finden.', r'Weil drei Seiten durch zwei geteilt werden.'],
    [r'Dreht man eine Kopie des Dreiecks und legt sie an, entsteht ein Parallelogramm.',
     r'Dessen Flächeninhalt ist $g \cdot h$.',
     r'Das Dreieck ist die Hälfte davon: $A = g \cdot h : 2$.'])

Q.q(r'Welche Strecke ist die Höhe zur Grundseite $g$?',
    [r'die Strecke von der gegenüberliegenden Ecke senkrecht auf $g$ (oder ihre Verlängerung)',
     r'die schräge Nachbarseite von $g$', r'die längste Seite der Figur', r'die Strecke von der Mitte von $g$ zur Ecke'],
    [r'Die Höhe misst den Abstand zur Grundseite.',
     r'Abstände misst man immer senkrecht.',
     r'Sie kann auch außerhalb der Figur liegen.'])

Q.q(r'Bei einem Dreieck wird die Grundseite verdoppelt, die Höhe bleibt gleich. Was passiert mit dem Flächeninhalt?',
    [r'Er verdoppelt sich.', r'Er vervierfacht sich.', r'Er bleibt gleich.', r'Er halbiert sich.'],
    [r'$A = g \cdot h : 2$',
     r'Mit $2g$: $A = 2 \cdot g \cdot h : 2$',
     r'Das ist doppelt so viel wie vorher.'])

Q.q(r'Bei einem Parallelogramm werden Grundseite und Höhe verdoppelt. Was passiert mit dem Flächeninhalt?',
    [r'Er vervierfacht sich.', r'Er verdoppelt sich.', r'Er bleibt gleich.', r'Er wird achtmal so groß.'],
    [r'$A = 2g \cdot 2h$',
     r'$= 4 \cdot g \cdot h$',
     r'Viermal so groß.'])

Q.q(r'Tom rechnet bei einem Parallelogramm mit den Seiten 6 cm und 5 cm: $A = 6 \cdot 5 = 30$ cm². Was ist falsch?',
    [r'Er hat die schräge Seite statt der Höhe genommen.', r'Nichts, das stimmt.',
     r'Er hätte noch durch 2 teilen müssen.', r'Er hätte die Seiten addieren müssen.'],
    [r'Die Formel braucht die Höhe, also den senkrechten Abstand.',
     r'Die schräge Seite ist länger als die Höhe.',
     r'Der wahre Flächeninhalt ist kleiner als 30 cm².'])

# ---------------------------------------------------------------- computing ----
Q.q(r'Ein Parallelogramm hat die Grundseite 7,5 cm und die Höhe 4 cm. Wie groß ist sein Flächeninhalt?',
    [r'30 cm²', r'23 cm²', r'15 cm²', r'11,5 cm²'],
    [r'$A = g \cdot h$',
     r'$= 7{,}5 \cdot 4$',
     r'$= 30$ cm²'])

Q.q(r'Ein Dreieck hat die Grundseite 12 m und die Höhe 7 m. Wie groß ist sein Flächeninhalt?',
    [r'42 m²', r'84 m²', r'19 m²', r'38 m²'],
    [r'$A = g \cdot h : 2$',
     r'$= 12 \cdot 7 : 2$',
     r'$= 42$ m²'])

Q.q(r'Ein Parallelogramm hat den Flächeninhalt 36 cm² und die Grundseite 9 cm. Wie hoch ist es?',
    [r'4 cm', r'8 cm', r'27 cm', r'324 cm'],
    [r'$A = g \cdot h$, also $36 = 9 \cdot h$',
     r'$h = 36 : 9$',
     r'$h = 4$ cm'])

Q.q(r'Ein Dreieck hat den Flächeninhalt 24 cm² und die Grundseite 8 cm. Wie lang ist die Höhe?',
    [r'6 cm', r'3 cm', r'12 cm', r'16 cm'],
    [r'$24 = 8 \cdot h : 2$',
     r'Das Doppelte: $48 = 8 \cdot h$',
     r'$h = 48 : 8 = 6$ cm'])

Q.q(r'Ein rechtwinkliges Dreieck hat die beiden kurzen Seiten (am rechten Winkel) 6 cm und 8 cm. Wie groß ist sein Flächeninhalt?',
    [r'24 cm²', r'48 cm²', r'14 cm²', r'28 cm²'],
    [r'Beim rechten Winkel ist die eine kurze Seite die Höhe zur anderen.',
     r'$A = 6 \cdot 8 : 2$',
     r'$= 24$ cm² – ein halbes Rechteck.'])

Q.q(r'Ein Parallelogramm hat die Grundseite 5 cm und die Höhe 30 mm. Wie groß ist sein Flächeninhalt?',
    [r'15 cm²', r'150 cm²', r'1,5 cm²', r'35 cm²'],
    [r'Erst die Einheiten angleichen: 30 mm = 3 cm.',
     r'$A = 5 \cdot 3$',
     r'$= 15$ cm²'])

Q.q(r'Ein dreieckiges Segel ist 3 m breit (Grundseite) und 4,5 m hoch. Wie viel Stoff braucht man?',
    [r'6,75 m²', r'13,5 m²', r'7,5 m²', r'15 m²'],
    [r'$A = 3 \cdot 4{,}5 : 2$',
     r'$= 13{,}5 : 2$',
     r'$= 6{,}75$ m²'])

Q.q(r'Welche Figur hat denselben Flächeninhalt wie ein Rechteck mit 6 cm Länge und 4 cm Breite?',
    [r'ein Dreieck mit $g = 12$ cm und $h = 4$ cm', r'ein Dreieck mit $g = 6$ cm und $h = 4$ cm',
     r'ein Parallelogramm mit $g = 4$ cm und $h = 4$ cm', r'ein Dreieck mit $g = 6$ cm und $h = 6$ cm'],
    [r'Rechteck: $6 \cdot 4 = 24$ cm²',
     r'Dreieck mit $g = 12$, $h = 4$: $12 \cdot 4 : 2 = 24$ cm²',
     r'Die anderen: 12 cm², 16 cm² und 18 cm².'])

Q.q(r'Ein Dreieck hat die Ecken $A(1 \mid 1)$, $B(7 \mid 1)$ und $C(4 \mid 5)$, 1 Einheit = 1 cm. Wie groß ist der Flächeninhalt?',
    [r'12 cm²', r'24 cm²', r'15 cm²', r'10 cm²'],
    [r'$A$ und $B$ liegen auf derselben Höhe: $g = 7 - 1 = 6$ cm.',
     r'$C$ liegt $5 - 1 = 4$ cm darüber: $h = 4$ cm.',
     r'$A = 6 \cdot 4 : 2 = 12$ cm²'])

Q.q(r'Ein Grundstück hat die Form eines Parallelogramms mit der Grundseite 40 m und der Höhe 25 m. Wie groß ist es?',
    [r'1000 m²', r'130 m²', r'500 m²', r'65 m²'],
    [r'$A = g \cdot h$',
     r'$= 40 \cdot 25$',
     r'$= 1000$ m², also 10 Ar.'])


def check():
    assert 6 * 4 == 24 and PARA[3][1] == 4 and PARA[1][0] - PARA[0][0] == 6
    assert F(8 * 5, 2) == 20 and TRI[2][1] == 5
    assert F(4 * 3, 2) == 6 and STUMPF[2][1] == 3
    assert D('7.5') * 4 == 30
    assert F(12 * 7, 2) == 42
    assert F(36, 9) == 4
    assert F(2 * 24, 8) == 6
    assert F(6 * 8, 2) == 24
    assert 5 * 3 == 15
    assert D(3) * D('4.5') / 2 == D('6.75')
    assert 6 * 4 == F(12 * 4, 2) and F(6 * 4, 2) == 12 and 4 * 4 == 16 and F(6 * 6, 2) == 18
    assert F((7 - 1) * (5 - 1), 2) == 12
    assert 40 * 25 == 1000


Q.verify(check)
Q.save()
