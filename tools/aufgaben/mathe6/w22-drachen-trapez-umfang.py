#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 22 / KW 5 (LB 3): area of kites and trapezoids by cutting
and completing, perimeter of polygons. Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os6
from osfig import vieleck

Q = os6(nr=22, slug='drachen-trapez-umfang', thema='Drachenviereck, Trapez und Umfang', lb='LB 3',
        blurb='A = e · f : 2, A = (a + c) · h : 2, Umfang von Vielecken',
        comment='Blocks: figures and formulas (1-5, 13-14, 17), computing areas (6-8, 12, 15-16), perimeter (9-11, 18-20).')

TRAPEZ = [(0, 0), (8, 0), (6, 3), (2, 3)]
DRACHEN = [(0, 0), (2, 1.5), (0, 6), (-2, 1.5)]

# ------------------------------------------------------ figures and formulas ----
Q.q(r'Wie groß ist der Flächeninhalt des Trapezes?',
    [r'18 cm²', r'36 cm²', r'24 cm²', r'15 cm²'],
    [r'Trapez: $A = (a + c) \cdot h : 2$',
     r'$(8 + 4) \cdot 3 : 2 = 12 \cdot 3 : 2$',
     r'$A = 18$ cm²'],
    fig=vieleck(TRAPEZ, names=['A', 'B', 'C', 'D'], sides=[(0, 'a = 8 cm'), (2, 'c = 4 cm')],
                extra=[((2, 3), (2, 0), 'h = 3 cm')]),
    figcap=r'Trapez ABCD, a ist parallel zu c')

Q.q(r'Die Diagonalen des Drachenvierecks sind $e = 6$ cm und $f = 4$ cm lang. Wie groß ist sein Flächeninhalt?',
    [r'12 cm²', r'24 cm²', r'10 cm²', r'20 cm²'],
    [r'Drachenviereck: $A = e \cdot f : 2$',
     r'$6 \cdot 4 : 2$',
     r'$A = 12$ cm²'],
    fig=vieleck(DRACHEN, names=['A', 'B', 'C', 'D'], extra=[((0, 0), (0, 6), 'e'), ((-2, 1.5), (2, 1.5), 'f')]),
    figcap=r'Drachenviereck ABCD mit den Diagonalen e und f')

Q.q(r'Mit welcher Formel berechnet man den Flächeninhalt eines Trapezes mit den parallelen Seiten $a$ und $c$ und der Höhe $h$?',
    [r'$A = (a + c) \cdot h : 2$', r'$A = a \cdot c \cdot h$', r'$A = (a + c) \cdot h$', r'$A = a \cdot h : 2$'],
    [r'Zwei gleiche Trapeze, eines davon gedreht, ergeben ein Parallelogramm.',
     r'Dessen Grundseite ist $a + c$, die Höhe bleibt $h$.',
     r'Das Trapez ist die Hälfte: $A = (a + c) \cdot h : 2$.'])

Q.q(r'Mit welcher Formel berechnet man den Flächeninhalt eines Drachenvierecks mit den Diagonalen $e$ und $f$?',
    [r'$A = e \cdot f : 2$', r'$A = e \cdot f$', r'$A = (e + f) : 2$', r'$A = 2 \cdot e \cdot f$'],
    [r'Die Diagonalen stehen senkrecht aufeinander.',
     r'Das Drachenviereck passt in ein Rechteck mit den Seiten $e$ und $f$.',
     r'Es füllt genau die Hälfte davon: $A = e \cdot f : 2$.'])

Q.q(r'Warum füllt ein Drachenviereck genau die Hälfte des Rechtecks mit den Seiten $e$ und $f$?',
    [r'Die Diagonalen teilen das Rechteck in vier Teile, jedes halb vom Drachen bedeckt.', r'Weil der Drachen vier Ecken hat.',
     r'Weil $e$ und $f$ gleich lang sind.', r'Das stimmt nicht, er füllt ein Viertel.'],
    [r'Die Diagonalen zerlegen das Rechteck in vier kleine Rechtecke.',
     r'Jedes davon wird von einer Seite des Drachens halbiert.',
     r'Also bedeckt der Drachen genau die Hälfte.'])

Q.q(r'Was ist ein Trapez?',
    [r'ein Viereck mit mindestens einem Paar paralleler Seiten', r'ein Viereck mit vier gleich langen Seiten',
     r'ein Viereck mit zwei Paaren gleich langer Nachbarseiten', r'ein Dreieck mit abgeschnittener Spitze und fünf Ecken'],
    [r'Beim Trapez liegen zwei Seiten parallel: $a$ und $c$.',
     r'Die beiden anderen Seiten heißen Schenkel.',
     r'Auch Parallelogramme und Rechtecke sind deshalb besondere Trapeze.'])

Q.q(r'Welche Eigenschaft hat jedes Drachenviereck?',
    [r'Seine Diagonalen stehen senkrecht aufeinander.', r'Alle vier Seiten sind gleich lang.',
     r'Gegenüberliegende Seiten sind parallel.', r'Alle Winkel sind gleich groß.'],
    [r'Ein Drachenviereck hat zwei Paare gleich langer Nachbarseiten.',
     r'Eine Diagonale ist seine Symmetrieachse.',
     r'Die beiden Diagonalen stehen senkrecht aufeinander.'])

Q.q(r'Ein Trapez mit $a = 10$ cm, $c = 4$ cm und $h = 4$ cm wird in ein Rechteck und zwei gleiche Dreiecke zerlegt. Welche Rechnung stimmt?',
    [r'$4 \cdot 4 + 2 \cdot (3 \cdot 4 : 2) = 28$ cm²', r'$10 \cdot 4 = 40$ cm²',
     r'$4 \cdot 4 = 16$ cm², die Dreiecke zählen nicht mit', r'$10 \cdot 4 \cdot 4 = 160$ cm²'],
    [r'Das Rechteck in der Mitte: $c \cdot h = 4 \cdot 4 = 16$ cm².',
     r'Für die zwei Dreiecke bleiben je $(10 - 4) : 2 = 3$ cm Grundseite: je $3 \cdot 4 : 2 = 6$ cm².',
     r'Zusammen 28 cm² – genau wie $(10 + 4) \cdot 4 : 2$.'])

# --------------------------------------------------------- computing areas ----
Q.q(r'Ein Trapez hat $a = 10$ cm, $c = 6$ cm und $h = 4$ cm. Wie groß ist sein Flächeninhalt?',
    [r'32 cm²', r'64 cm²', r'240 cm²', r'20 cm²'],
    [r'$(a + c) \cdot h : 2$',
     r'$= 16 \cdot 4 : 2$',
     r'$= 32$ cm²'])

Q.q(r'Ein Drachenviereck hat die Diagonalen 9 cm und 5 cm. Wie groß ist sein Flächeninhalt?',
    [r'22,5 cm²', r'45 cm²', r'14 cm²', r'7 cm²'],
    [r'$A = e \cdot f : 2$',
     r'$= 9 \cdot 5 : 2 = 45 : 2$',
     r'$= 22{,}5$ cm²'])

Q.q(r'Eine Raute ist ein besonderes Drachenviereck. Ihre Diagonalen sind 8 cm und 6 cm lang. Wie groß ist ihr Flächeninhalt?',
    [r'24 cm²', r'48 cm²', r'14 cm²', r'28 cm²'],
    [r'Die Formel für das Drachenviereck gilt auch für die Raute.',
     r'$8 \cdot 6 : 2$',
     r'$= 24$ cm²'])

Q.q(r'Ein Trapez hat den Flächeninhalt 30 cm², $a = 7$ cm und $c = 5$ cm. Wie lang ist die Höhe?',
    [r'5 cm', r'2,5 cm', r'10 cm', r'6 cm'],
    [r'$30 = (7 + 5) \cdot h : 2 = 12 \cdot h : 2 = 6 \cdot h$',
     r'$h = 30 : 6$',
     r'$h = 5$ cm'])

Q.q(r'Ein Deich hat einen trapezförmigen Querschnitt: unten 20 m, oben 6 m breit und 5 m hoch. Wie groß ist die Querschnittsfläche?',
    [r'65 m²', r'130 m²', r'31 m²', r'600 m²'],
    [r'$A = (20 + 6) \cdot 5 : 2$',
     r'$= 26 \cdot 5 : 2 = 130 : 2$',
     r'$= 65$ m²'])

Q.q(r'Für einen Drachen werden zwei Holzstäbe von 80 cm und 50 cm über Kreuz gebunden und mit Papier bespannt. Wie viel Papier braucht man mindestens?',
    [r'2000 cm²', r'4000 cm²', r'130 cm²', r'260 cm²'],
    [r'Die Stäbe sind die Diagonalen: $e = 80$ cm, $f = 50$ cm.',
     r'$A = 80 \cdot 50 : 2$',
     r'$= 2000$ cm², also 0,2 m².'])

# ---------------------------------------------------------------- perimeter ----
Q.q(r'Ein Trapez hat die Seiten 8 cm, 5 cm, 4 cm und 5 cm. Wie groß ist sein Umfang?',
    [r'22 cm', r'18 cm', r'160 cm', r'17 cm'],
    [r'Der Umfang ist die Länge aller Seiten zusammen.',
     r'$8 + 5 + 4 + 5$',
     r'$= 22$ cm'])

Q.q(r'Ein Drachenviereck hat zwei Seiten von 4 cm und zwei Seiten von 7 cm. Wie groß ist sein Umfang?',
    [r'22 cm', r'11 cm', r'28 cm', r'14 cm'],
    [r'Je zwei Nachbarseiten sind gleich lang.',
     r'$2 \cdot 4 + 2 \cdot 7$',
     r'$= 8 + 14 = 22$ cm'])

Q.q(r'Ein Parallelogramm hat die Seiten 6 cm und 4 cm. Wie groß ist sein Umfang?',
    [r'20 cm', r'24 cm', r'10 cm', r'12 cm'],
    [r'Gegenüberliegende Seiten sind gleich lang.',
     r'$2 \cdot 6 + 2 \cdot 4$',
     r'$= 20$ cm'])

Q.q(r'Ein Quadrat hat den Umfang 36 cm. Wie lang ist eine Seite?',
    [r'9 cm', r'6 cm', r'18 cm', r'12 cm'],
    [r'Vier gleich lange Seiten ergeben 36 cm.',
     r'$36 : 4$',
     r'$= 9$ cm'])

Q.q(r'Ein Garten hat die Form eines Trapezes mit den Seiten 12 m, 8 m, 9 m und 7 m. Wie viel Zaun braucht man rundherum?',
    [r'36 m', r'72 m', r'28 m', r'48 m'],
    [r'Der Zaun läuft einmal um den Garten: Umfang.',
     r'$12 + 8 + 9 + 7$',
     r'$= 36$ m'])


Q.q(r'Eine Raute hat eine Seitenlänge von 5 cm. Wie groß ist ihr Umfang?',
    [r'20 cm', r'25 cm', r'10 cm', r'15 cm'],
    [r'Bei einer Raute sind alle vier Seiten gleich lang.',
     r'$4 \cdot 5$',
     r'$= 20$ cm (25 cm² wäre der Flächeninhalt eines Quadrats mit 5 cm Seite).'])

def check():
    assert F((8 + 4) * 3, 2) == 18 and TRAPEZ[1][0] == 8 and TRAPEZ[2][0] - TRAPEZ[3][0] == 4 and TRAPEZ[2][1] == 3
    assert F(6 * 4, 2) == 12 and DRACHEN[2][1] - DRACHEN[0][1] == 6 and DRACHEN[1][0] - DRACHEN[3][0] == 4
    assert 4 * 4 + 2 * F(3 * 4, 2) == 28 == F((10 + 4) * 4, 2) and (10 - 4) / 2 == 3
    assert F((10 + 6) * 4, 2) == 32
    assert F(9 * 5, 2) == F('22.5')
    assert F(8 * 6, 2) == 24
    assert F(2 * 30, 7 + 5) == 5
    assert F((20 + 6) * 5, 2) == 65
    assert F(80 * 50, 2) == 2000 and F(2000, 10000) == F('0.2')
    assert 8 + 5 + 4 + 5 == 22
    assert 2 * 4 + 2 * 7 == 22
    assert 2 * 6 + 2 * 4 == 20
    assert 36 / 4 == 9 and 4 * 5 == 20
    assert 12 + 8 + 9 + 7 == 36


Q.verify(check)
Q.save()
