#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 28 / KW 14: mixed preparation for Klassenarbeit 3
(LB 4, first part: Vielecke). Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os7

Q = os7(nr=28, slug='ka3', thema='Klassenarbeit 3: Vielecke', lb='KA 3',
        blurb='gemischte Aufgaben zu Vierecken und Vielecken zur Vorbereitung auf die Klassenarbeit',
        comment='Blocks: properties (1-3), angles (4-6, 16-17), constructing (7-8), areas and perimeter (9-15, 18-20).')

Q.q(r'Welche Eigenschaft hat jedes Parallelogramm?',
    [r'Gegenüberliegende Seiten sind parallel und gleich lang.', r'Die Diagonalen sind gleich lang.',
     r'Alle Winkel sind 90°.', r'Alle Seiten sind gleich lang.'],
    [r'Zwei Paare paralleler Seiten.',
     r'Gegenüberliegende Seiten und Winkel sind gleich.',
     r'Gleich lange Diagonalen hat nur das Rechteck.'])

Q.q(r'Welche Aussage stimmt?',
    [r'Jedes Quadrat ist eine Raute.', r'Jede Raute ist ein Quadrat.', r'Jedes Trapez ist ein Parallelogramm.',
     r'Jedes Drachenviereck ist ein Rechteck.'],
    [r'Eine Raute hat vier gleich lange Seiten.',
     r'Das Quadrat hat das auch – und zusätzlich rechte Winkel.',
     r'Also ist jedes Quadrat eine Raute, aber nicht umgekehrt.'])

Q.q(r'Wie viele Symmetrieachsen hat eine Raute, die kein Quadrat ist?',
    [r'2', r'4', r'1', r'0'],
    [r'Die Diagonalen einer Raute sind Symmetrieachsen.',
     r'Durch die Seitenmitten gibt es keine (das gilt nur beim Quadrat).',
     r'Also 2.'])

Q.q(r'Im Parallelogramm ist $\alpha = 55°$. Wie groß ist $\beta$?',
    [r'125°', r'55°', r'35°', r'145°'],
    [r'Benachbarte Winkel ergänzen sich zu 180°.',
     r'$180° - 55°$',
     r'$= 125°$'])

Q.q(r'Im Trapez ABCD ist $\overline{AB} \parallel \overline{CD}$ und $\alpha = 72°$. Wie groß ist $\delta$?',
    [r'108°', r'72°', r'18°', r'118°'],
    [r'$\alpha$ und $\delta$ liegen am selben Schenkel zwischen den Parallelen.',
     r'Sie ergänzen sich zu 180°.',
     r'$\delta = 108°$'])

Q.q(r'Ein Drachenviereck hat zwei gleich große Winkel von je 110° und einen Winkel von 80°. Wie groß ist der vierte Winkel?',
    [r'60°', r'80°', r'70°', r'110°'],
    [r'Winkelsumme im Viereck: 360°.',
     r'$110° + 110° + 80° = 300°$',
     r'$360° - 300° = 60°$'])

Q.q(r'Wie viele Stücke braucht man, um ein Parallelogramm eindeutig zu konstruieren?',
    [r'3', r'2', r'4', r'5'],
    [r'Zum Beispiel zwei Seiten und den Winkel dazwischen.',
     r'Die anderen Seiten und Winkel folgen aus den Parallelen.',
     r'Also 3 Stücke.'])

Q.q(r'Lässt sich ein Parallelogramm mit $a = 4$ cm, $b = 3$ cm und der Diagonalen $e = 8$ cm konstruieren?',
    [r'Nein, denn $4 + 3 < 8$.', r'Ja, genau eines.', r'Ja, zwei verschiedene.', r'Ja, ein Rechteck.'],
    [r'$a$, $b$ und $e$ bilden ein Dreieck.',
     r'Dreiecksungleichung: $4 + 3 = 7$ müsste größer als 8 sein.',
     r'Das Dreieck gibt es nicht, also auch kein Parallelogramm.'])

Q.q(r'Ein Parallelogramm hat die Grundseite 7,5 cm und die Höhe 6 cm. Wie groß ist sein Flächeninhalt?',
    [r'45 cm²', r'22,5 cm²', r'27 cm²', r'13,5 cm²'],
    [r'$A = g \cdot h$',
     r'$= 7{,}5 \cdot 6$',
     r'$= 45$ cm²'])

Q.q(r'Ein Trapez hat $a = 11$ cm, $c = 7$ cm und $h = 5$ cm. Wie groß ist sein Flächeninhalt?',
    [r'45 cm²', r'90 cm²', r'23 cm²', r'385 cm²'],
    [r'$A = \dfrac{(a + c) \cdot h}{2}$',
     r'$= \dfrac{18 \cdot 5}{2}$',
     r'$= 45$ cm²'])

Q.q(r'Ein Drachenviereck hat die Diagonalen 9 cm und 8 cm. Wie groß ist sein Flächeninhalt?',
    [r'36 cm²', r'72 cm²', r'17 cm²', r'34 cm²'],
    [r'$A = \dfrac{e \cdot f}{2}$',
     r'$= \dfrac{9 \cdot 8}{2}$',
     r'$= 36$ cm²'])

Q.q(r'Ein Parallelogramm hat den Flächeninhalt 56 cm² und die Grundseite 8 cm. Wie groß ist die Höhe?',
    [r'7 cm', r'48 cm', r'14 cm', r'6 cm'],
    [r'$56 = 8 \cdot h$',
     r'$h = 56 : 8$',
     r'$h = 7$ cm'])

Q.q(r'Ein Trapez hat den Flächeninhalt 60 cm², $a = 14$ cm und $h = 5$ cm. Wie lang ist $c$?',
    [r'10 cm', r'12 cm', r'24 cm', r'4 cm'],
    [r'$60 = \dfrac{(14 + c) \cdot 5}{2}$, also $120 = (14 + c) \cdot 5$',
     r'$14 + c = 24$',
     r'$c = 10$ cm'])

Q.q(r'Eine Raute hat die Seitenlänge 4,5 cm. Wie groß ist ihr Umfang?',
    [r'18 cm', r'9 cm', r'20,25 cm', r'13,5 cm'],
    [r'Vier gleich lange Seiten.',
     r'$4 \cdot 4{,}5$',
     r'$= 18$ cm'])

Q.q(r'Ein Fünfeck besteht aus einem Rechteck (8 cm × 5 cm) und einem aufgesetzten Dreieck (Grundseite 8 cm, Höhe 3 cm). Wie groß ist es?',
    [r'52 cm²', r'64 cm²', r'40 cm²', r'46 cm²'],
    [r'Rechteck: $8 \cdot 5 = 40$ cm²',
     r'Dreieck: $8 \cdot 3 : 2 = 12$ cm²',
     r'Zusammen 52 cm².'])

Q.q(r'Wie groß ist die Innenwinkelsumme eines Siebenecks?',
    [r'900°', r'720°', r'1260°', r'1080°'],
    [r'Ein Siebeneck zerfällt von einer Ecke aus in $7 - 2 = 5$ Dreiecke.',
     r'$5 \cdot 180°$',
     r'$= 900°$'])

Q.q(r'Wie groß ist jeder Innenwinkel eines regelmäßigen Achtecks?',
    [r'135°', r'120°', r'145°', r'108°'],
    [r'Winkelsumme: $(8 - 2) \cdot 180° = 1080°$',
     r'Acht gleiche Winkel: $1080° : 8$',
     r'$= 135°$'])

Q.q(r'Ein Grundstück ist ein Trapez mit den parallelen Seiten 50 m und 30 m und dem Abstand 20 m. Wie groß ist es?',
    [r'800 m²', r'1600 m²', r'1000 m²', r'30 000 m²'],
    [r'$A = \dfrac{(50 + 30) \cdot 20}{2}$',
     r'$= \dfrac{1600}{2}$',
     r'$= 800$ m²'])

Q.q(r'Welche beiden Figuren sind inhaltsgleich?',
    [r'Dreieck mit $g = 10$ cm, $h = 6$ cm und Parallelogramm mit $g = 5$ cm, $h = 6$ cm',
     r'Dreieck mit $g = 10$ cm, $h = 6$ cm und Parallelogramm mit $g = 10$ cm, $h = 6$ cm',
     r'Quadrat mit 5 cm und Rechteck mit 5 cm × 4 cm',
     r'Raute mit $e = 6$ cm, $f = 4$ cm und Quadrat mit 4 cm'],
    [r'Dreieck: $10 \cdot 6 : 2 = 30$ cm², Parallelogramm $5 \cdot 6 = 30$ cm².',
     r'Die anderen Paare: 30 und 60, 25 und 20, 12 und 16.',
     r'Inhaltsgleich: gleicher Flächeninhalt bei verschiedener Form.'])

Q.q(r'Ein Satteldach hat zwei gleiche trapezförmige Dachflächen mit 10 m und 4 m langen parallelen Seiten und 6 m Höhe. Wie groß ist das ganze Dach?',
    [r'84 m²', r'42 m²', r'168 m²', r'120 m²'],
    [r'Eine Dachfläche: $\dfrac{(10 + 4) \cdot 6}{2} = 42$ m²',
     r'Zwei Dachflächen: $2 \cdot 42$',
     r'$= 84$ m²'])


def check():
    assert 180 - 55 == 125 and 180 - 72 == 108 and 360 - 110 - 110 - 80 == 60 and 4 + 3 < 8
    assert D('7.5') * 6 == 45 and F((11 + 7) * 5, 2) == 45 and F(9 * 8, 2) == 36 and F(56, 8) == 7
    assert F(2 * 60, 5) - 14 == 10 and 4 * D('4.5') == 18 and 8 * 5 + F(8 * 3, 2) == 52
    assert (7 - 2) * 180 == 900 and F((8 - 2) * 180, 8) == 135 and F((50 + 30) * 20, 2) == 800
    assert F(10 * 6, 2) == 5 * 6 == 30 and 10 * 6 == 60 and (25, 20) != (20, 25) and (F(6 * 4, 2), 16) == (12, 16)
    assert 2 * F((10 + 4) * 6, 2) == 84


Q.verify(check)
Q.save()
