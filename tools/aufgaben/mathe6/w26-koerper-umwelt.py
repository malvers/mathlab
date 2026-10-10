#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 26 / KW 11 (LB 4): solids in the environment - cube, cuboid,
prism, pyramid, cylinder, cone, sphere; vertices, edges, faces, mental geometry.
Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from itertools import product
from quiz import os6
from osfig import quader, wuerfelbau

Q = os6(nr=26, slug='koerper-umwelt', thema='Körper in der Umwelt', lb='LB 4',
        blurb='Ecken, Kanten und Flächen, Körper erkennen, Kopfgeometrie',
        comment='Blocks: counting (1-4, 11-13, 20), recognising solids (5-10, 17-18), mental geometry (14-16, 19).')

BAU = [(0, 0, 0), (0, 1, 0), (0, 2, 0), (1, 0, 0), (1, 1, 0), (1, 2, 0), (0, 0, 1), (0, 1, 1)]

# ----------------------------------------------------------------- counting ----
Q.q(r'Wie viele Kanten hat ein Würfel?',
    [r'12', r'8', r'6', r'24'],
    [r'Oben 4 Kanten, unten 4 Kanten.',
     r'Dazu 4 senkrechte Kanten.',
     r'$4 + 4 + 4 = 12$ Kanten (8 sind die Ecken, 6 die Flächen).'])

Q.q(r'Wie viele Flächen hat ein Quader?',
    [r'6', r'4', r'8', r'12'],
    [r'Oben und unten: 2 Flächen.',
     r'Vorne und hinten, links und rechts: 4 Flächen.',
     r'Zusammen 6 Rechtecke.'])

Q.q(r'Wie viele Kanten hat ein Dreiecksprisma (wie ein Dachstück)?',
    [r'9', r'6', r'5', r'12'],
    [r'Vorne ein Dreieck: 3 Kanten, hinten ein Dreieck: 3 Kanten.',
     r'Dazu 3 Kanten, die vorne und hinten verbinden.',
     r'$3 + 3 + 3 = 9$ Kanten.'])

Q.q(r'Wie viele Ecken hat eine Pyramide mit quadratischer Grundfläche?',
    [r'5', r'4', r'8', r'6'],
    [r'Die Grundfläche hat 4 Ecken.',
     r'Dazu kommt die Spitze.',
     r'$4 + 1 = 5$ Ecken.'])

Q.q(r'Wie viele andere Kanten des Quaders sind genauso lang wie die 5-cm-Kante?',
    [r'3', r'1', r'4', r'11'],
    [r'Ein Quader hat 12 Kanten in drei Gruppen zu je 4.',
     r'Die 4 Kanten einer Gruppe sind parallel und gleich lang.',
     r'Neben der markierten 5-cm-Kante gibt es also noch 3 weitere.'],
    fig=quader(5, 3, 2, ('5 cm', '3 cm', '2 cm')), figcap=r'Quader im Schrägbild')

Q.q(r'Wie viele Kanten treffen sich in einer Ecke eines Würfels?',
    [r'3', r'2', r'4', r'6'],
    [r'An jeder Ecke stoßen drei Flächen zusammen.',
     r'Zwischen je zwei davon liegt eine Kante.',
     r'Also treffen sich 3 Kanten: nach rechts, nach hinten, nach oben.'])

Q.q(r'Ein Prisma hat ein Fünfeck als Grundfläche. Wie viele Kanten hat es?',
    [r'15', r'10', r'7', r'12'],
    [r'Grundfläche: 5 Kanten, Deckfläche: 5 Kanten.',
     r'Dazu 5 Kanten von unten nach oben.',
     r'$5 + 5 + 5 = 15$. Probe: Ecken + Flächen − Kanten = $10 + 7 - 15 = 2$ (Eulers Polyedersatz).'])

Q.q(r'Wie viele Paare paralleler Flächen hat ein Quader?',
    [r'3', r'6', r'2', r'4'],
    [r'Oben und unten sind parallel.',
     r'Vorne und hinten sind parallel, links und rechts auch.',
     r'Das sind 3 Paare.'])

# ------------------------------------------------------ recognising solids ----
Q.q(r'Welcher Körper hat zwei Kreise als Grund- und Deckfläche und eine gekrümmte Mantelfläche?',
    [r'Zylinder', r'Kegel', r'Kugel', r'Prisma'],
    [r'Der Kegel hat nur eine Kreisfläche und eine Spitze.',
     r'Die Kugel hat gar keine ebene Fläche.',
     r'Zwei Kreise und ein gekrümmter Mantel: Zylinder.'])

Q.q(r'Welcher Körper hat eine Kreisfläche, eine gekrümmte Fläche und eine Spitze?',
    [r'Kegel', r'Zylinder', r'Pyramide', r'Kugel'],
    [r'Die Pyramide hat ebene Dreiecke als Seitenflächen.',
     r'Der Zylinder hat keine Spitze.',
     r'Das ist ein Kegel – wie eine Eistüte.'])

Q.q(r'Welcher Körper hat keine Ecken und keine Kanten?',
    [r'Kugel', r'Zylinder', r'Kegel', r'Würfel'],
    [r'Zylinder und Kegel haben gekrümmte Kanten am Kreisrand.',
     r'Der Würfel hat 8 Ecken und 12 Kanten.',
     r'Nur die Kugel hat weder Ecken noch Kanten.'])

Q.q(r'Eine Konservendose hat die Form eines …',
    [r'Zylinders', r'Kegels', r'Quaders', r'Prismas mit Dreiecksgrundfläche'],
    [r'Boden und Deckel sind Kreise.',
     r'Die Wand dazwischen ist gekrümmt.',
     r'Also ein Zylinder.'])

Q.q(r'Eine Schokoladenverpackung hat vorne und hinten ein Dreieck und dazwischen drei Rechtecke. Welche Form hat sie?',
    [r'Dreiecksprisma', r'Pyramide', r'Quader', r'Kegel'],
    [r'Zwei gleiche, parallele Dreiecke als Grund- und Deckfläche.',
     r'Rechtecke als Seitenflächen.',
     r'Das ist ein Prisma mit Dreiecksgrundfläche.'])

Q.q(r'Ein spitzes Turmdach hat einen quadratischen Grundriss und vier dreieckige Dachflächen. Welche Form hat es?',
    [r'Pyramide', r'Kegel', r'Prisma', r'Würfel'],
    [r'Quadrat unten, vier Dreiecke treffen sich oben in einer Spitze.',
     r'Ein Kegel hätte einen Kreis als Grundfläche.',
     r'Das ist eine quadratische Pyramide.'])

Q.q(r'Welcher Körper kann rollen und hat trotzdem Kanten?',
    [r'Zylinder', r'Kugel', r'Würfel', r'Pyramide'],
    [r'Die Kugel rollt, hat aber keine Kanten.',
     r'Würfel und Pyramide rollen nicht.',
     r'Der Zylinder rollt auf seinem Mantel und hat zwei Kreiskanten.'])

Q.q(r'Welcher Körper hat genau eine Ecke?',
    [r'Kegel', r'Zylinder', r'Pyramide', r'Kugel'],
    [r'Die Spitze des Kegels ist seine einzige Ecke.',
     r'Die Pyramide hat mehrere Ecken, Zylinder und Kugel keine.',
     r'Also der Kegel.'])

# --------------------------------------------------------- mental geometry ----
Q.q(r'Bei einem Spielwürfel ergeben gegenüberliegende Augenzahlen zusammen 7. Oben liegt die 2. Welche Zahl liegt unten?',
    [r'5', r'4', r'6', r'1'],
    [r'Oben und unten liegen sich gegenüber.',
     r'$2 + \square = 7$',
     r'Unten liegt die 5.'])

Q.q(r'Ein großer Würfel aus 27 kleinen Würfeln (3 × 3 × 3) wird außen rot angemalt. Wie viele kleine Würfel haben genau drei rote Flächen?',
    [r'8', r'12', r'6', r'1'],
    [r'Drei Flächen sind nur an den Ecken des großen Würfels außen.',
     r'Ein Würfel hat 8 Ecken.',
     r'Also 8 kleine Würfel. (12 an den Kanten haben zwei, 6 in den Flächenmitten eine rote Fläche.)'])

Q.q(r'Derselbe angemalte 3 × 3 × 3-Würfel: Wie viele kleine Würfel haben gar keine rote Fläche?',
    [r'1', r'0', r'6', r'8'],
    [r'Ohne Farbe bleibt nur, was ganz innen liegt.',
     r'Innen ist ein Würfel aus $1 \cdot 1 \cdot 1$ kleinen Würfeln.',
     r'Probe: $8 + 12 + 6 + 1 = 27$.'])

Q.q(r'Aus wie vielen gleich großen Würfeln besteht der Körper? (Es gibt keine Hohlräume.)',
    [r'8', r'6', r'7', r'9'],
    [r'Unten liegen zwei Reihen zu je 3 Würfeln: 6.',
     r'Oben liegen hinten 2 Würfel.',
     r'Zusammen 8 Würfel.'],
    fig=wuerfelbau(BAU), figcap=r'Körper aus Würfeln')


def check():
    cube_v = list(product((0, 1), repeat=3))
    cube_e = [(a, b) for a in cube_v for b in cube_v if a < b and sum(x != y for x, y in zip(a, b)) == 1]
    assert len(cube_v) == 8 and len(cube_e) == 12
    assert 3 + 3 + 3 == 9 and 4 + 1 == 5
    assert sum(1 for e in cube_e if (0, 0, 0) in e) == 3
    assert 5 * 3 == 15 and 10 + 7 - 15 == 2 and 6 + 5 - 9 == 2 and 5 + 5 - 8 == 2 and 8 + 6 - 12 == 2
    assert 7 - 2 == 5
    cells = list(product(range(3), repeat=3))
    outer = lambda c: sum(1 for k in c if k in (0, 2))
    assert sum(1 for c in cells if outer(c) == 3) == 8 and sum(1 for c in cells if outer(c) == 2) == 12
    assert sum(1 for c in cells if outer(c) == 1) == 6 and sum(1 for c in cells if outer(c) == 0) == 1
    assert len(BAU) == 8 and len(set(BAU)) == 8


Q.verify(check)
Q.save()
