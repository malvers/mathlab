#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 30 / KW 16 (LB 4): first look at right prisms - volume as
base times height via the cutting principle, lateral surface and surface.
Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os6
from osfig import dachprisma, prisma

Q = os6(nr=30, slug='prismen', thema='Gerade Prismen', lb='LB 4',
        blurb='Grundfläche, Volumen V = G · h, Mantel und Oberfläche',
        comment='Blocks: figures (1-3, 15), ideas (4, 9-10, 14, 16, 19-20), computing (5-8, 11-13, 17-18).')

fig_dach = dachprisma(4, 3, 6, ('4 cm', '3 cm', '6 cm'))
cap_dach = r'Dreiecksprisma: vorne die Grundfläche, 6 cm tief'
HAUS = [(0, 0), (4, 0), (4, 2), (2, 4), (0, 2)]

# ------------------------------------------------------------------ figures ----
Q.q(r'Wie groß ist die dreieckige Grundfläche des Prismas?',
    [r'6 cm²', r'12 cm²', r'7 cm²', r'24 cm²'],
    [r'Die Grundfläche ist ein Dreieck mit $g = 4$ cm und $h = 3$ cm.',
     r'$G = 4 \cdot 3 : 2$',
     r'$G = 6$ cm²'],
    fig=fig_dach, figcap=cap_dach)

Q.q(r'Wie groß ist das Volumen des Prismas?',
    [r'36 cm³', r'72 cm³', r'13 cm³', r'18 cm³'],
    [r'Volumen Prisma: Grundfläche mal Höhe des Prismas.',
     r'$G = 6$ cm², die Höhe des Prismas (die Tiefe) ist 6 cm.',
     r'$V = 6 \cdot 6 = 36$ cm³'],
    fig=fig_dach, figcap=cap_dach)

Q.q(r'Ein Quader mit 4 cm × 3 cm × 6 cm wird schräg in zwei gleiche Dreiecksprismen zersägt. Wie groß ist das Volumen eines Prismas?',
    [r'36 cm³', r'72 cm³', r'24 cm³', r'18 cm³'],
    [r'Der Quader hat $4 \cdot 3 \cdot 6 = 72$ cm³.',
     r'Er wird in zwei gleiche Hälften geteilt.',
     r'$72 : 2 = 36$ cm³ – das passt zu $V = G \cdot h$ mit $G = 4 \cdot 3 : 2$.'])

Q.q(r'Das Prisma hat ein „Haus“ als Grundfläche: ein Rechteck 4 cm × 2 cm mit einem Dach von 2 cm Höhe. Das Prisma ist 5 cm tief. Wie groß ist sein Volumen?',
    [r'60 cm³', r'40 cm³', r'80 cm³', r'30 cm³'],
    [r'Grundfläche zerlegen: Rechteck $4 \cdot 2 = 8$ cm², Dreieck $4 \cdot 2 : 2 = 4$ cm².',
     r'$G = 12$ cm²',
     r'$V = 12 \cdot 5 = 60$ cm³'],
    fig=prisma(HAUS, 5, label='Prisma mit fünfeckiger Grundfläche'), figcap=r'Prisma mit Haus-Grundfläche')

# --------------------------------------------------------------------- ideas ----
Q.q(r'Mit welcher Formel berechnet man das Volumen eines geraden Prismas?',
    [r'$V = G \cdot h$', r'$V = G + h$', r'$V = G \cdot h : 2$', r'$V = a \cdot a \cdot a$'],
    [r'Man stapelt Schichten der Grundfläche $G$ übereinander.',
     r'Jeder Zentimeter Höhe bringt $G$ Kubikzentimeter.',
     r'Also $V = G \cdot h$ – wie beim Quader $V = (a \cdot b) \cdot c$.'])

Q.q(r'Was bildet den Mantel eines geraden Prismas?',
    [r'alle Seitenflächen zusammen; abgewickelt ein Rechteck', r'nur die Grundfläche', r'Grund- und Deckfläche',
     r'die längste Kante'],
    [r'Die Seitenflächen stehen senkrecht auf der Grundfläche.',
     r'Wickelt man sie ab, entsteht ein Rechteck.',
     r'Es ist so lang wie der Umfang der Grundfläche und so hoch wie das Prisma.'])

Q.q(r'Welche Eigenschaft hat jedes gerade Prisma?',
    [r'Grund- und Deckfläche sind deckungsgleich und parallel.', r'Es hat eine Spitze.',
     r'Alle Flächen sind Dreiecke.', r'Es hat genau 6 Kanten.'],
    [r'Ein Prisma entsteht, wenn man ein Vieleck gerade nach oben verschiebt.',
     r'Unten und oben liegt dieselbe Figur.',
     r'Die Seitenflächen sind Rechtecke.'])

Q.q(r'Ist ein Quader ein Prisma?',
    [r'Ja, mit einem Rechteck als Grundfläche.', r'Nein, Prismen haben immer Dreiecke.',
     r'Nein, ein Quader hat keine Grundfläche.', r'Nur, wenn er ein Würfel ist.'],
    [r'Grund- und Deckfläche des Quaders sind gleiche Rechtecke.',
     r'Die Seitenflächen sind Rechtecke.',
     r'Also ist jeder Quader ein Prisma.'])

Q.q(r'Die Höhe eines Prismas wird verdoppelt, die Grundfläche bleibt gleich. Was passiert mit dem Volumen?',
    [r'Es verdoppelt sich.', r'Es vervierfacht sich.', r'Es bleibt gleich.', r'Es halbiert sich.'],
    [r'$V = G \cdot h$',
     r'Mit $2h$: $V = G \cdot 2h = 2 \cdot G \cdot h$',
     r'Doppelt so groß.'])

Q.q(r'Wie viele Flächen hat ein Prisma mit einem Sechseck als Grundfläche?',
    [r'8', r'6', r'12', r'7'],
    [r'Grund- und Deckfläche: 2.',
     r'Für jede Sechseckseite eine Seitenfläche: 6.',
     r'$2 + 6 = 8$ Flächen.'])

Q.q(r'Ein Prisma mit einem Parallelogramm als Grundfläche wird durch Zerlegen in einen Quader verwandelt. Was bleibt gleich?',
    [r'Grundfläche, Höhe und Volumen', r'nur die Kantenlängen', r'die Oberfläche', r'gar nichts'],
    [r'Vom Parallelogramm schneidet man ein Dreiecksprisma ab und setzt es auf der anderen Seite an.',
     r'Es entsteht ein Quader mit derselben Grundfläche und Höhe.',
     r'Das Volumen bleibt beim Zerlegen gleich – das Zerlegungsprinzip.'])

# ---------------------------------------------------------------- computing ----
Q.q(r'Ein Prisma hat eine Grundfläche von 12 cm² und ist 5 cm hoch. Wie groß ist sein Volumen?',
    [r'60 cm³', r'17 cm³', r'30 cm³', r'120 cm³'],
    [r'$V = G \cdot h$',
     r'$= 12 \cdot 5$',
     r'$= 60$ cm³'])

Q.q(r'Ein Prisma hat ein Trapez als Grundfläche ($a = 6$ cm, $c = 4$ cm, Trapezhöhe 3 cm) und ist 10 cm hoch. Wie groß ist sein Volumen?',
    [r'150 cm³', r'300 cm³', r'720 cm³', r'130 cm³'],
    [r'Grundfläche: $(6 + 4) \cdot 3 : 2 = 15$ cm²',
     r'$V = G \cdot h = 15 \cdot 10$',
     r'$V = 150$ cm³'])

Q.q(r'Ein Dreiecksprisma hat ein rechtwinkliges Dreieck mit den Seiten 3 cm, 4 cm und 5 cm als Grundfläche und ist 10 cm hoch. Wie groß ist der Mantel?',
    [r'120 cm²', r'60 cm²', r'132 cm²', r'200 cm²'],
    [r'Der Mantel ist ein Rechteck: Umfang der Grundfläche mal Höhe.',
     r'Umfang: $3 + 4 + 5 = 12$ cm',
     r'$M = 12 \cdot 10 = 120$ cm²'])

Q.q(r'Dasselbe Prisma (rechtwinkliges Dreieck 3 cm, 4 cm, 5 cm; Höhe 10 cm): Wie groß ist seine Oberfläche?',
    [r'132 cm²', r'120 cm²', r'126 cm²', r'144 cm²'],
    [r'Grundfläche: $3 \cdot 4 : 2 = 6$ cm² (die Seiten am rechten Winkel)',
     r'$O = 2 \cdot G + M = 2 \cdot 6 + 120$',
     r'$O = 132$ cm²'])

Q.q(r'Ein Zelt hat die Form eines Dreiecksprismas: Eingang 2 m breit und 1,5 m hoch, 3 m lang. Wie viel Luft ist darin?',
    [r'4,5 m³', r'9 m³', r'6,5 m³', r'3 m³'],
    [r'Grundfläche ist das Eingangsdreieck: $2 \cdot 1{,}5 : 2 = 1{,}5$ m².',
     r'$V = 1{,}5 \cdot 3$',
     r'$V = 4{,}5$ m³'])

Q.q(r'Ein Dachboden hat einen dreieckigen Querschnitt: 8 m breit, 3 m hoch. Das Haus ist 10 m lang. Wie groß ist der Dachraum?',
    [r'120 m³', r'240 m³', r'21 m³', r'80 m³'],
    [r'Querschnitt: $8 \cdot 3 : 2 = 12$ m²',
     r'$V = 12 \cdot 10$',
     r'$V = 120$ m³'])

Q.q(r'Ein Prisma hat das Volumen 90 cm³ und die Grundfläche 15 cm². Wie hoch ist es?',
    [r'6 cm', r'75 cm', r'105 cm', r'1350 cm'],
    [r'$V = G \cdot h$, also $90 = 15 \cdot h$',
     r'$h = 90 : 15$',
     r'$h = 6$ cm'])

Q.q(r'Ein Graben ist 100 m lang und hat einen trapezförmigen Querschnitt: oben 4 m, unten 2 m breit, 1,5 m tief. Wie viel Erde wurde ausgehoben?',
    [r'450 m³', r'900 m³', r'600 m³', r'150 m³'],
    [r'Querschnitt: $(4 + 2) \cdot 1{,}5 : 2 = 4{,}5$ m²',
     r'$V = 4{,}5 \cdot 100$',
     r'$V = 450$ m³'])

Q.q(r'Eine prismaförmige Vase hat eine Grundfläche von 50 cm² und ist 40 cm hoch. Wie viele Liter Wasser passen hinein?',
    [r'2 Liter', r'20 Liter', r'0,2 Liter', r'90 Liter'],
    [r'$V = 50 \cdot 40 = 2000$ cm³',
     r'1000 cm³ = 1 Liter',
     r'2000 cm³ = 2 Liter'])


def check():
    G = F(4 * 3, 2)
    assert G == 6 and G * 6 == 36 and F(4 * 3 * 6, 2) == 36
    poly = HAUS
    area = F(abs(sum(poly[i][0] * poly[i - 1][1] - poly[i - 1][0] * poly[i][1] for i in range(len(poly)))), 2)
    assert area == 12 == 4 * 2 + F(4 * 2, 2) and area * 5 == 60
    assert 2 + 6 == 8
    assert 12 * 5 == 60
    assert F((6 + 4) * 3, 2) * 10 == 150
    assert (3 + 4 + 5) * 10 == 120 and 2 * F(3 * 4, 2) + 120 == 132 and 3 ** 2 + 4 ** 2 == 5 ** 2
    assert 2 * D('1.5') / 2 * 3 == D('4.5')
    assert F(8 * 3, 2) * 10 == 120
    assert F(90, 15) == 6
    assert (4 + 2) * D('1.5') / 2 * 100 == 450
    assert 50 * 40 == 2000


Q.verify(check)
Q.save()
