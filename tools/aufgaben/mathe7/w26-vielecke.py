#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 26 / KW 11 (LB 4): area and perimeter of
polygons by cutting into triangles and quadrilaterals or completing, figures of equal
area (tangram), regular polygons and angle sums. Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os7
from osfig import vieleck

Q = os7(nr=26, slug='vielecke', thema='Vielecke', lb='LB 4',
        blurb='Zerlegen und Ergänzen, inhaltsgleiche Figuren, regelmäßige Vielecke, Winkelsumme',
        comment='Blocks: composite areas (1-2, 7, 10, 15, 18), equal area (8-9, 20), regular polygons and angles (3-6, 11-14, 16-17, 19).')

HAUS = [(0, 0), (6, 0), (6, 4), (3, 6), (0, 4)]
ECKE = [(0, 0), (8, 0), (8, 3), (5, 6), (0, 6)]


def area(p):
    return F(abs(sum(p[i][0] * p[i - 1][1] - p[i - 1][0] * p[i][1] for i in range(len(p)))), 2)


angle_sum = lambda n: (n - 2) * 180

# ------------------------------------------------------------------ composite areas ----
Q.q(r'Wie groß ist der Flächeninhalt des Fünfecks?',
    [r'30 cm²', r'24 cm²', r'36 cm²', r'42 cm²'],
    [r'Zerlegen: Rechteck $6 \cdot 4 = 24$ cm²',
     r'Dreieck oben: Grundseite 6 cm, Höhe $6 - 4 = 2$ cm: $6 \cdot 2 : 2 = 6$ cm²',
     r'Zusammen 30 cm².'],
    fig=vieleck(HAUS, sides=[(0, '6 cm'), (1, '4 cm')], extra=[((3, 6), (3, 4), '2 cm'), ((0, 4), (6, 4), '')],
                label='Fünfeck wie ein Haus'),
    figcap=r'Fünfeck, das aussieht wie ein Haus')

Q.q(r'Wie groß ist der Flächeninhalt des Fünfecks?',
    [r'43,5 cm²', r'48 cm²', r'39 cm²', r'45 cm²'],
    [r'Ergänzen zum Rechteck: $8 \cdot 6 = 48$ cm².',
     r'Es fehlt oben rechts ein rechtwinkliges Dreieck mit 3 cm und 3 cm: $3 \cdot 3 : 2 = 4{,}5$ cm².',
     r'$48 - 4{,}5 = 43{,}5$ cm²'],
    fig=vieleck(ECKE, sides=[(0, '8 cm'), (1, '3 cm'), (4, '6 cm')], extra=[((5, 6), (8, 6), '3 cm'), ((8, 6), (8, 3), '')],
                label='Fünfeck mit abgeschnittener Ecke'),
    figcap=r'Fünfeck: Rechteck mit abgeschnittener Ecke')

Q.q(r'Ein Viereck wird durch die Diagonale $e = 10$ cm in zwei Dreiecke geteilt. Ihre Höhen auf $e$ sind 3 cm und 4 cm. Wie groß ist das Viereck?',
    [r'35 cm²', r'70 cm²', r'120 cm²', r'17,5 cm²'],
    [r'Dreieck 1: $10 \cdot 3 : 2 = 15$ cm²',
     r'Dreieck 2: $10 \cdot 4 : 2 = 20$ cm²',
     r'Zusammen 35 cm².'])

Q.q(r'Ein Grundstück besteht aus einem Rechteck (30 m × 20 m) und einem angesetzten Dreieck (Grundseite 30 m, Höhe 10 m). Wie groß ist es?',
    [r'750 m²', r'900 m²', r'600 m²', r'1200 m²'],
    [r'Rechteck: $30 \cdot 20 = 600$ m²',
     r'Dreieck: $30 \cdot 10 : 2 = 150$ m²',
     r'Zusammen 750 m².'])

Q.q(r'Von einem Quadrat mit 10 cm Seitenlänge werden an allen vier Ecken rechtwinklige Dreiecke mit 3 cm und 3 cm abgeschnitten. Es entsteht ein Achteck. Wie groß ist es?',
    [r'82 cm²', r'64 cm²', r'91 cm²', r'76 cm²'],
    [r'Quadrat: $10 \cdot 10 = 100$ cm²',
     r'Ein Eckdreieck: $3 \cdot 3 : 2 = 4{,}5$ cm², vier davon: 18 cm².',
     r'$100 - 18 = 82$ cm²'])

Q.q(r'Ein Viereck hat die Ecken $A(0 \mid 0)$, $B(6 \mid 0)$, $C(6 \mid 4)$ und $D(2 \mid 4)$, 1 Einheit = 1 cm. Wie groß ist es?',
    [r'20 cm²', r'24 cm²', r'16 cm²', r'12 cm²'],
    [r'$\overline{AB}$ und $\overline{DC}$ sind parallel: ein Trapez mit $a = 6$, $c = 4$, $h = 4$.',
     r'$A = (6 + 4) \cdot 4 : 2$',
     r'$= 20$ cm² (oder Rechteck 24 cm² minus Dreieck 4 cm²).'])

# --------------------------------------------------------------------- equal area ----
Q.q(r'Wann heißen zwei Figuren inhaltsgleich?',
    [r'wenn sie den gleichen Flächeninhalt haben', r'wenn sie deckungsgleich sind', r'wenn sie den gleichen Umfang haben',
     r'wenn sie gleich viele Ecken haben'],
    [r'Inhaltsgleich: gleich großer Flächeninhalt.',
     r'Die Form darf ganz verschieden sein.',
     r'Deckungsgleich ist mehr: gleiche Form und Größe.'])

Q.q(r'Aus den sieben Teilen eines Tangrams legt man ein Quadrat und danach eine Katze. Was gilt?',
    [r'Quadrat und Katze sind inhaltsgleich.', r'Die Katze ist größer.', r'Die Katze ist kleiner.', r'Sie haben denselben Umfang.'],
    [r'Beide bestehen aus denselben sieben Teilen.',
     r'Beim Umlegen ändert sich der Flächeninhalt nicht.',
     r'Der Umfang kann sich aber ändern.'])

Q.q(r'Das Tangram-Quadrat ist 64 cm² groß. Wie groß ist eine daraus gelegte Tangram-Figur?',
    [r'64 cm²', r'32 cm²', r'128 cm²', r'8 cm²'],
    [r'Man benutzt alle sieben Teile.',
     r'Sie überlappen sich nicht.',
     r'Also wieder 64 cm².'])

# ------------------------------------------------------ regular polygons and angles ----
Q.q(r'Was ist ein regelmäßiges Vieleck?',
    [r'ein Vieleck mit gleich langen Seiten und gleich großen Winkeln', r'ein Vieleck mit nur rechten Winkeln',
     r'jedes Vieleck mit mehr als vier Ecken', r'ein Vieleck mit genau einer Symmetrieachse'],
    [r'Alle Seiten sind gleich lang.',
     r'Alle Innenwinkel sind gleich groß.',
     r'Beispiele: gleichseitiges Dreieck, Quadrat, regelmäßiges Sechseck.'])

Q.q(r'Ein regelmäßiges Sechseck lässt sich in 6 gleiche gleichseitige Dreiecke zerlegen. Jedes ist 4 cm² groß. Wie groß ist das Sechseck?',
    [r'24 cm²', r'10 cm²', r'12 cm²', r'36 cm²'],
    [r'Die Dreiecke treffen sich in der Mitte des Sechsecks.',
     r'$6 \cdot 4$',
     r'$= 24$ cm²'])

Q.q(r'Wie groß ist die Innenwinkelsumme eines Fünfecks?',
    [r'540°', r'360°', r'450°', r'900°'],
    [r'Von einer Ecke aus zerlegen die Diagonalen das Fünfeck in 3 Dreiecke.',
     r'$3 \cdot 180°$',
     r'$= 540°$'])

Q.q(r'Wie groß ist die Innenwinkelsumme eines Sechsecks?',
    [r'720°', r'540°', r'1080°', r'600°'],
    [r'Von einer Ecke aus: 4 Dreiecke.',
     r'$4 \cdot 180°$',
     r'$= 720°$'])

Q.q(r'Wie groß ist jeder Innenwinkel eines regelmäßigen Sechsecks?',
    [r'120°', r'60°', r'135°', r'108°'],
    [r'Winkelsumme: 720°.',
     r'Sechs gleiche Winkel: $720° : 6$',
     r'$= 120°$'])

Q.q(r'Ein Vieleck hat die Innenwinkelsumme 1080°. Wie viele Ecken hat es?',
    [r'8', r'6', r'10', r'7'],
    [r'$1080° : 180° = 6$ Dreiecke.',
     r'Ein $n$-Eck zerfällt in $n - 2$ Dreiecke.',
     r'$n - 2 = 6$, also $n = 8$: ein Achteck.'])

Q.q(r'Von einer Ecke eines Fünfecks aus werden alle Diagonalen gezeichnet. In wie viele Dreiecke wird es zerlegt?',
    [r'3', r'5', r'2', r'4'],
    [r'Von einer Ecke gehen 2 Diagonalen aus (nicht zu den Nachbarn).',
     r'Sie teilen das Fünfeck in 3 Dreiecke.',
     r'Allgemein: $n$-Eck → $n - 2$ Dreiecke.'])

Q.q(r'Ein regelmäßiges Achteck hat die Seitenlänge 2,5 cm. Wie groß ist sein Umfang?',
    [r'20 cm', r'10 cm', r'25 cm', r'18 cm'],
    [r'Acht gleich lange Seiten.',
     r'$8 \cdot 2{,}5$',
     r'$= 20$ cm'])

Q.q(r'Ein Gartenteich hat die Form eines regelmäßigen Sechsecks mit 1,5 m Seitenlänge. Wie lang wird die Einfassung?',
    [r'9 m', r'7,5 m', r'6 m', r'12 m'],
    [r'Die Einfassung ist der Umfang.',
     r'$6 \cdot 1{,}5$',
     r'$= 9$ m'])

Q.q(r'Ein regelmäßiges Fünfeck hat den Umfang 35 cm. Wie lang ist eine Seite?',
    [r'7 cm', r'5 cm', r'175 cm', r'30 cm'],
    [r'Fünf gleich lange Seiten.',
     r'$35 : 5$',
     r'$= 7$ cm'])


Q.q(r'Wie viele Diagonalen hat ein Fünfeck insgesamt?',
    [r'5', r'2', r'10', r'3'],
    [r'Von jeder der 5 Ecken gehen 2 Diagonalen aus: $5 \cdot 2 = 10$.',
     r'So ist jede Diagonale doppelt gezählt (von beiden Enden).',
     r'$10 : 2 = 5$ Diagonalen – sie bilden einen Stern.'])

def check():
    assert area(HAUS) == 30 == 6 * 4 + F(6 * 2, 2) and area(ECKE) == F(87, 2) == 48 - F(9, 2)
    assert F(10 * 3, 2) + F(10 * 4, 2) == 35 and 30 * 20 + F(30 * 10, 2) == 750 and 100 - 4 * F(9, 2) == 82
    assert area([(0, 0), (6, 0), (6, 4), (2, 4)]) == 20
    assert 6 * 4 == 24 and angle_sum(5) == 540 and angle_sum(6) == 720 and F(angle_sum(6), 6) == 120
    assert [n for n in range(3, 20) if angle_sum(n) == 1080] == [8] and 5 - 2 == 3
    assert 5 * (5 - 3) // 2 == 5
    assert 8 * D('2.5') == 20 and 6 * D('1.5') == 9 and 35 / 5 == 7


Q.verify(check)
Q.save()
