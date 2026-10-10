#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 25 / KW 10: mixed preparation for Klassenarbeit 3
(LB 3 Geometrie in der Ebene). Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os6
from osfig import geradenkreuz, parallelen, vieleck

Q = os6(nr=25, slug='ka3', thema='Klassenarbeit 3: Geometrie in der Ebene', lb='KA 3',
        blurb='gemischte Aufgaben zu LB 3 zur Vorbereitung auf die Klassenarbeit',
        comment='Blocks: angles at lines (1-2, 18-19), triangles (3-8), areas (9-13, 15-16), perimeter and problems (14, 17, 20).')

L = [(0, 0), (10, 0), (10, 4), (6, 4), (6, 7), (0, 7)]

Q.q(r'Wie groß ist der Winkel $\alpha$?',
    [r'138°', r'42°', r'48°', r'318°'],
    [r'$\alpha$ ist Nebenwinkel des 42°-Winkels.',
     r'Nebenwinkel ergänzen sich zu 180°.',
     r'$\alpha = 180° - 42° = 138°$'],
    fig=geradenkreuz(42, {0: '42°', 1: 'α'}), figcap=r'Zwei Geraden schneiden sich.')

Q.q(r'$g$ und $h$ sind parallel. Wie groß ist $\beta$?',
    [r'55°', r'125°', r'35°', r'110°'],
    [r'An $g$ ist der Scheitelwinkel des 55°-Winkels (links unten) auch 55° groß.',
     r'$\beta$ ist dessen Stufenwinkel an $h$.',
     r'$\beta = 55°$'],
    fig=parallelen(55, {0: '55°'}, {2: 'β'}), figcap=r'g ist parallel zu h.')

Q.q(r'In einem Dreieck ist $\alpha = 35°$ und $\beta = 105°$. Wie groß ist $\gamma$?',
    [r'40°', r'50°', r'140°', r'30°'],
    [r'$\alpha + \beta = 140°$',
     r'$\gamma = 180° - 140°$',
     r'$\gamma = 40°$'])

Q.q(r'Ein gleichschenkliges Dreieck hat Basiswinkel von 52°. Wie groß ist der Winkel an der Spitze?',
    [r'76°', r'128°', r'52°', r'38°'],
    [r'Beide Basiswinkel: $2 \cdot 52° = 104°$',
     r'$180° - 104°$',
     r'$= 76°$'])

Q.q(r'Ein Dreieck hat die Winkel 25°, 65° und 90°. Wie heißt es nach seinen Winkeln?',
    [r'rechtwinklig', r'spitzwinklig', r'stumpfwinklig', r'gleichseitig'],
    [r'Der größte Winkel entscheidet.',
     r'Er ist genau 90°.',
     r'Das Dreieck ist rechtwinklig.'])

Q.q(r'Lässt sich aus Seiten mit 6 cm, 7 cm und 14 cm ein Dreieck bauen?',
    [r'Nein, $6 + 7$ ist kleiner als 14.', r'Ja, immer.', r'Ja, ein stumpfwinkliges.', r'Nein, weil 14 gerade ist.'],
    [r'Die zwei kürzeren Seiten müssen zusammen länger sein als die längste.',
     r'$6 + 7 = 13 < 14$',
     r'Kein Dreieck.'])

Q.q(r'Gegeben sind $a = 5$ cm, $c = 7$ cm und der Winkel $\beta = 60°$ zwischen ihnen. Welcher Kongruenzsatz passt?',
    [r'sws', r'wsw', r'sss', r'SsW'],
    [r'$\beta$ liegt bei $B$, dort treffen sich $a$ und $c$.',
     r'Der Winkel liegt zwischen den beiden Seiten.',
     r'Seite – Winkel – Seite: sws.'])

Q.q(r'In einem Dreieck ist $c$ die längste Seite. Welcher Winkel ist am größten?',
    [r'$\gamma$', r'$\alpha$', r'$\beta$', r'Man kann es nicht sagen.'],
    [r'Der längeren Seite liegt der größere Winkel gegenüber.',
     r'Der Seite $c$ liegt der Winkel $\gamma$ gegenüber.',
     r'Also ist $\gamma$ am größten.'])

Q.q(r'Ein Parallelogramm hat die Grundseite 9 cm und die Höhe 5 cm. Wie groß ist sein Flächeninhalt?',
    [r'45 cm²', r'22,5 cm²', r'28 cm²', r'14 cm²'],
    [r'$A = g \cdot h$',
     r'$= 9 \cdot 5$',
     r'$= 45$ cm²'])

Q.q(r'Ein Dreieck hat die Grundseite 10 cm und die Höhe 7 cm. Wie groß ist sein Flächeninhalt?',
    [r'35 cm²', r'70 cm²', r'17 cm²', r'34 cm²'],
    [r'$A = g \cdot h : 2$',
     r'$= 10 \cdot 7 : 2$',
     r'$= 35$ cm²'])

Q.q(r'Ein Trapez hat die parallelen Seiten 12 cm und 8 cm und die Höhe 5 cm. Wie groß ist sein Flächeninhalt?',
    [r'50 cm²', r'100 cm²', r'25 cm²', r'480 cm²'],
    [r'$A = (a + c) \cdot h : 2$',
     r'$= 20 \cdot 5 : 2$',
     r'$= 50$ cm²'])

Q.q(r'Ein Drachenviereck hat die Diagonalen 10 cm und 7 cm. Wie groß ist sein Flächeninhalt?',
    [r'35 cm²', r'70 cm²', r'17 cm²', r'34 cm²'],
    [r'$A = e \cdot f : 2$',
     r'$= 10 \cdot 7 : 2$',
     r'$= 35$ cm²'])

Q.q(r'Ein Dreieck hat den Flächeninhalt 27 cm² und die Höhe 6 cm. Wie lang ist die zugehörige Grundseite?',
    [r'9 cm', r'4,5 cm', r'162 cm', r'21 cm'],
    [r'$27 = g \cdot 6 : 2 = g \cdot 3$',
     r'$g = 27 : 3$',
     r'$g = 9$ cm'])

Q.q(r'Ein Parallelogramm hat die Seiten 7,5 cm und 4,5 cm. Wie groß ist sein Umfang?',
    [r'24 cm', r'12 cm', r'33,75 cm', r'19,5 cm'],
    [r'Gegenüberliegende Seiten sind gleich lang.',
     r'$2 \cdot 7{,}5 + 2 \cdot 4{,}5 = 15 + 9$',
     r'$= 24$ cm'])

Q.q(r'Wie groß ist der Flächeninhalt der Figur?',
    [r'58 m²', r'70 m²', r'52 m²', r'40 m²'],
    [r'Zerlegen: unten $10 \cdot 4 = 40$ m²',
     r'Oben links: $6 \cdot (7 - 4) = 6 \cdot 3 = 18$ m²',
     r'Zusammen 58 m². (Ergänzen: $10 \cdot 7 - 4 \cdot 3 = 70 - 12 = 58$.)'],
    fig=vieleck(L, sides=[(0, '10 m'), (1, '4 m'), (4, '6 m'), (5, '7 m')], label='zusammengesetzte Fläche'),
    figcap=r'Grundriss (Maße in Metern)')

Q.q(r'Eine Wand ist 5 m breit und 2,6 m hoch, darin ist eine Tür mit 0,9 m × 2 m. Wie viel Wand wird tapeziert?',
    [r'11,2 m²', r'13 m²', r'14,8 m²', r'10,2 m²'],
    [r'Wand: $5 \cdot 2{,}6 = 13$ m²',
     r'Tür: $0{,}9 \cdot 2 = 1{,}8$ m²',
     r'$13 - 1{,}8 = 11{,}2$ m²'])

Q.q(r'Ein Viereck hat die Winkel 80°, 95° und 110°. Wie groß ist der vierte Winkel?',
    [r'75°', r'95°', r'105°', r'65°'],
    [r'Die Winkelsumme im Viereck ist 360° (zwei Dreiecke).',
     r'$80° + 95° + 110° = 285°$',
     r'$360° - 285° = 75°$'])

Q.q(r'Wie heißen zwei Winkel, die an geschnittenen Parallelen zwischen den Parallelen auf verschiedenen Seiten der schneidenden Geraden liegen?',
    [r'Wechselwinkel', r'Stufenwinkel', r'Scheitelwinkel', r'Nebenwinkel'],
    [r'Sie liegen innen, zwischen $g$ und $h$.',
     r'Sie wechseln die Seite der schneidenden Geraden: Z-Form.',
     r'Das sind Wechselwinkel, sie sind gleich groß.'])

Q.q(r'Ein Winkel ist genauso groß wie sein Nebenwinkel. Wie groß ist er?',
    [r'90°', r'180°', r'45°', r'60°'],
    [r'Zusammen sind beide 180°.',
     r'Zwei gleiche Teile: $180° : 2$',
     r'$= 90°$ – die Geraden stehen senkrecht.'])

Q.q(r'Ein rechteckiges Beet ist doppelt so lang wie breit und hat den Flächeninhalt 50 m². Wie groß ist sein Umfang?',
    [r'30 m', r'15 m', r'25 m', r'20 m'],
    [r'Systematisch probieren: Breite 4 m ergibt $4 \cdot 8 = 32$, Breite 5 m ergibt $5 \cdot 10 = 50$. Passt!',
     r'Das Beet ist 5 m breit und 10 m lang.',
     r'Umfang: $2 \cdot 10 + 2 \cdot 5 = 30$ m'])


def check():
    assert 180 - 42 == 138
    assert 180 - 35 - 105 == 40
    assert 180 - 2 * 52 == 76
    assert 6 + 7 < 14
    assert 9 * 5 == 45 and F(10 * 7, 2) == 35 and F((12 + 8) * 5, 2) == 50 and F(10 * 7, 2) == 35
    assert F(2 * 27, 6) == 9
    assert 2 * D('7.5') + 2 * D('4.5') == 24
    area = abs(sum(L[i][0] * L[i - 1][1] - L[i - 1][0] * L[i][1] for i in range(len(L)))) / 2
    assert area == 58 == 10 * 4 + 6 * 3 == 10 * 7 - 4 * 3
    assert 5 * D('2.6') - D('0.9') * 2 == D('11.2')
    assert 360 - (80 + 95 + 110) == 75
    assert 180 / 2 == 90
    assert [b for b in range(1, 20) if b * 2 * b == 50] == [5] and 2 * 10 + 2 * 5 == 30


Q.verify(check)
Q.save()
