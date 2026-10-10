#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 23 / KW 8 (LB 4): quadrilaterals in the
environment - properties of parallelogram, rhombus, kite, trapezoid, the house of
quadrilaterals, diagonals, symmetry axes, angles. Plan: HTML/svp/mathe/mathe7.html."""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os7
from osfig import vieleck

Q = os7(nr=23, slug='vierecke', thema='Vierecke in der Umwelt', lb='LB 4',
        blurb='Parallelogramm, Raute, Drachenviereck, Trapez, Haus der Vierecke, Diagonalen und Winkel',
        comment='Blocks: properties (1-4, 7-8), house of quadrilaterals (5-6), symmetry (11-13), angles (9-10, 18-19), real objects (14-17, 20).')

r = math.radians
PARA = [(0, 0), (5, 0), (5 + 3 * math.cos(r(70)), 3 * math.sin(r(70))), (3 * math.cos(r(70)), 3 * math.sin(r(70)))]
TRAP = [(0, 0), (6, 0), (6 - 3.5 * math.cos(r(65)) * 0.6, 3.5 * math.sin(r(65))), (3.5 * math.cos(r(65)), 3.5 * math.sin(r(65)))]


def angle_at(P, i):
    a, b, c = P[i - 1], P[i], P[(i + 1) % len(P)]
    u, v = (a[0] - b[0], a[1] - b[1]), (c[0] - b[0], c[1] - b[1])
    return math.degrees(math.acos((u[0] * v[0] + u[1] * v[1]) / (math.hypot(*u) * math.hypot(*v))))


# ------------------------------------------------------------------- properties ----
Q.q(r'Welche Eigenschaft hat jedes Parallelogramm?',
    [r'Gegenüberliegende Seiten sind parallel und gleich lang.', r'Alle Seiten sind gleich lang.',
     r'Alle Winkel sind rechte Winkel.', r'Die Diagonalen stehen immer senkrecht aufeinander.'],
    [r'Der Name sagt es: zwei Paare paralleler Seiten.',
     r'Die parallelen Seiten sind auch gleich lang.',
     r'Gleich lange Seiten oder rechte Winkel gibt es nur bei Raute oder Rechteck.'])

Q.q(r'Was zeichnet eine Raute aus?',
    [r'Alle vier Seiten sind gleich lang.', r'Alle Winkel sind 90°.', r'Nur zwei Seiten sind parallel.', r'Sie hat genau eine Symmetrieachse.'],
    [r'Eine Raute ist ein Parallelogramm mit vier gleich langen Seiten.',
     r'Ihre Winkel müssen keine rechten sein.',
     r'Ihre Diagonalen stehen senkrecht aufeinander.'])

Q.q(r'Welche Eigenschaft hat jedes Drachenviereck?',
    [r'Es hat zwei Paare gleich langer Nachbarseiten.', r'Gegenüberliegende Seiten sind parallel.',
     r'Alle Seiten sind gleich lang.', r'Es hat vier rechte Winkel.'],
    [r'Beim Drachen sind je zwei benachbarte Seiten gleich lang.',
     r'Eine Diagonale ist Symmetrieachse.',
     r'Die Diagonalen stehen senkrecht aufeinander.'])

Q.q(r'Was ist ein Trapez?',
    [r'ein Viereck mit mindestens einem Paar paralleler Seiten', r'ein Viereck mit vier gleich langen Seiten',
     r'ein Viereck ohne parallele Seiten', r'ein Dreieck mit einer zusätzlichen Ecke'],
    [r'Die parallelen Seiten heißen Grundseiten, die anderen Schenkel.',
     r'Sind die Schenkel gleich lang, heißt es gleichschenklig.',
     r'Jedes Parallelogramm ist auch ein Trapez.'])

Q.q(r'Welche Aussage über die Diagonalen eines Rechtecks stimmt?',
    [r'Sie sind gleich lang und halbieren sich.', r'Sie stehen immer senkrecht aufeinander.',
     r'Sie sind verschieden lang.', r'Es hat keine Diagonalen.'],
    [r'Die Diagonalen verbinden gegenüberliegende Ecken.',
     r'Beim Rechteck sind beide gleich lang und schneiden sich in ihrer Mitte.',
     r'Senkrecht stehen sie nur beim Quadrat.'])

Q.q(r'Welche Aussage über die Diagonalen einer Raute stimmt?',
    [r'Sie stehen senkrecht aufeinander und halbieren sich.', r'Sie sind immer gleich lang.',
     r'Sie schneiden sich nicht.', r'Sie sind parallel.'],
    [r'Die Raute ist ein Parallelogramm: Die Diagonalen halbieren sich.',
     r'Sie ist auch ein Drachen: Die Diagonalen stehen senkrecht.',
     r'Gleich lang sind sie nur beim Quadrat.'])

# --------------------------------------------------------- house of quadrilaterals ----
Q.q(r'Welche Aussage ist FALSCH?',
    [r'Jedes Rechteck ist ein Quadrat.', r'Jedes Quadrat ist ein Rechteck.', r'Jedes Quadrat ist eine Raute.',
     r'Jedes Rechteck ist ein Parallelogramm.'],
    [r'Ein Quadrat hat vier rechte Winkel und vier gleiche Seiten.',
     r'Ein Rechteck hat vier rechte Winkel, aber nicht unbedingt gleiche Seiten.',
     r'Ein Rechteck 5 cm × 2 cm ist kein Quadrat.'])

Q.q(r'Jede Raute ist auch ein …',
    [r'Parallelogramm', r'Rechteck', r'Quadrat', r'Dreieck'],
    [r'Bei der Raute sind gegenüberliegende Seiten parallel.',
     r'Also ist sie ein besonderes Parallelogramm.',
     r'Rechte Winkel hat sie nicht unbedingt.'])

# ----------------------------------------------------------------------- symmetry ----
Q.q(r'Wie viele Symmetrieachsen hat ein Rechteck, das kein Quadrat ist?',
    [r'2', r'4', r'1', r'0'],
    [r'Eine Achse geht waagerecht durch die Mitte, eine senkrecht.',
     r'Die Diagonalen sind keine Symmetrieachsen.',
     r'Also 2.'])

Q.q(r'Wie viele Symmetrieachsen hat ein Quadrat?',
    [r'4', r'2', r'1', r'8'],
    [r'Zwei Achsen durch die Seitenmitten.',
     r'Zwei weitere Achsen auf den Diagonalen.',
     r'Zusammen 4.'])

Q.q(r'Wie viele Symmetrieachsen hat ein Drachenviereck, das keine Raute ist?',
    [r'1', r'2', r'0', r'4'],
    [r'Die Diagonale durch die beiden Ecken zwischen gleich langen Seiten ist Symmetrieachse.',
     r'Die andere Diagonale nicht.',
     r'Also 1.'])

# ----------------------------------------------------------------------- angles ----
Q.q(r'Im Parallelogramm ist $\alpha = 70°$. Wie groß ist $\beta$?',
    [r'110°', r'70°', r'20°', r'290°'],
    [r'Benachbarte Winkel im Parallelogramm ergänzen sich zu 180°.',
     r'Sie sind Nachbarwinkel an zwei Parallelen.',
     r'$\beta = 180° - 70° = 110°$'],
    fig=vieleck(PARA, names=['A', 'B', 'C', 'D'], angles=[(0, '70°'), (1, 'β')], label='Parallelogramm'),
    figcap=r'Parallelogramm ABCD')

Q.q(r'Im Parallelogramm ist $\alpha = 70°$. Wie groß ist der gegenüberliegende Winkel $\gamma$?',
    [r'70°', r'110°', r'140°', r'20°'],
    [r'Gegenüberliegende Winkel im Parallelogramm sind gleich groß.',
     r'$\gamma$ liegt $\alpha$ gegenüber.',
     r'$\gamma = 70°$. Probe: $70° + 110° + 70° + 110° = 360°$.'])

Q.q(r'Im Trapez sind die Seiten $\overline{AB}$ und $\overline{CD}$ parallel, $\alpha = 65°$. Wie groß ist $\delta$?',
    [r'115°', r'65°', r'25°', r'125°'],
    [r'$\alpha$ und $\delta$ liegen am Schenkel $\overline{AD}$ zwischen den Parallelen.',
     r'Solche Winkel ergänzen sich zu 180°.',
     r'$\delta = 180° - 65° = 115°$'],
    fig=vieleck(TRAP, names=['A', 'B', 'C', 'D'], angles=[(0, '65°'), (3, 'δ')], label='Trapez'),
    figcap=r'Trapez ABCD mit AB parallel zu CD')

Q.q(r'Ein Drachenviereck hat an der Spitze 60° und gegenüber 100°. Die beiden anderen Winkel sind gleich groß. Wie groß ist jeder?',
    [r'100°', r'110°', r'60°', r'200°'],
    [r'Die Winkelsumme im Viereck ist 360°.',
     r'$360° - 60° - 100° = 200°$',
     r'Für zwei gleiche Winkel: $200° : 2 = 100°$'])

# ----------------------------------------------------------------- real objects ----
Q.q(r'Der Querschnitt eines Deiches ist unten breit und oben schmal, oben und unten verlaufen parallel. Welches Viereck ist das?',
    [r'Trapez', r'Raute', r'Drachenviereck', r'Quadrat'],
    [r'Ein Paar paralleler Seiten: Krone und Fuß des Deiches.',
     r'Die schrägen Seiten sind nicht parallel.',
     r'Das ist ein Trapez.'])

Q.q(r'Bei einem Treppengeländer bilden zwei senkrechte Stäbe mit Handlauf und Treppenkante ein schräges Viereck mit parallelen Gegenseiten. Welches?',
    [r'Parallelogramm', r'Trapez ohne parallele Seiten', r'Drachenviereck', r'Rechteck'],
    [r'Die Stäbe sind zueinander parallel.',
     r'Handlauf und Treppenkante laufen ebenfalls parallel.',
     r'Zwei Paare paralleler Seiten ohne rechte Winkel: Parallelogramm.'])

Q.q(r'Ein Papierdrachen zum Steigenlassen hat meist die Form eines …',
    [r'Drachenvierecks', r'Rechtecks', r'Trapezes', r'Parallelogramms'],
    [r'Oben zwei kurze gleiche Seiten, unten zwei lange gleiche Seiten.',
     r'Zwei Paare gleich langer Nachbarseiten.',
     r'Daher kommt der Name Drachenviereck.'])

Q.q(r'Das Verkehrszeichen „Vorfahrtstraße“ ist ein auf die Spitze gestelltes Viereck mit vier gleich langen Seiten und vier rechten Winkeln. Welches?',
    [r'Quadrat', r'Raute ohne rechte Winkel', r'Drachenviereck', r'Trapez'],
    [r'Vier gleiche Seiten und vier rechte Winkel.',
     r'Das ist ein Quadrat – nur gedreht.',
     r'Die Lage ändert nichts an der Form.'])

Q.q(r'Welches Viereck ist abgebildet?',
    [r'Parallelogramm', r'Rechteck', r'Raute', r'Drachenviereck'],
    [r'Gegenüberliegende Seiten sind parallel.',
     r'Die Nachbarseiten sind verschieden lang, die Winkel nicht 90°.',
     r'Also ein Parallelogramm (weder Raute noch Rechteck).'],
    fig=vieleck(PARA, names=['A', 'B', 'C', 'D'], label='Parallelogramm'), figcap=r'Ein Viereck')


def check():
    assert abs(angle_at(PARA, 0) - 70) < 1e-9 and abs(angle_at(PARA, 1) - 110) < 1e-9 and abs(angle_at(PARA, 2) - 70) < 1e-9
    assert abs(TRAP[2][1] - TRAP[3][1]) < 1e-12 and abs(angle_at(TRAP, 0) - 65) < 1e-9 and abs(angle_at(TRAP, 3) - 115) < 1e-9
    assert 360 - 60 - 100 == 200 and 200 / 2 == 100
    assert 70 + 110 + 70 + 110 == 360


Q.verify(check)
Q.save()
