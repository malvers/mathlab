#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 35 / KW 21: mixed preparation for Klassenarbeit 4
(LB 4, second part: Prismen). Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os7

Q = os7(nr=35, slug='ka4', thema='Klassenarbeit 4: Prismen', lb='KA 4',
        blurb='gemischte Aufgaben zu Prismen zur Vorbereitung auf die Klassenarbeit',
        comment='Blocks: representing (1-5), volume and surface (6-11, 19-20), mass and density (12-14), composite and packaging (15-18).')

surf = lambda a, b, c: 2 * (a * b + a * c + b * c)

Q.q(r'Wie viele Flächen hat ein Dreiecksprisma?',
    [r'5', r'3', r'6', r'9'],
    [r'2 Dreiecke als Grund- und Deckfläche.',
     r'3 Rechtecke als Seitenflächen.',
     r'Zusammen 5 Flächen.'])

Q.q(r'Wie viele Kanten hat ein Prisma mit einem Fünfeck als Grundfläche?',
    [r'15', r'10', r'5', r'7'],
    [r'5 Kanten unten, 5 Kanten oben.',
     r'5 Kanten dazwischen.',
     r'Zusammen 15.'])

Q.q(r'Ein Dreiecksprisma steht auf seiner dreieckigen Grundfläche. Wie sieht sein Grundriss aus?',
    [r'wie ein Dreieck', r'wie ein Rechteck', r'wie ein Quadrat', r'wie ein Trapez'],
    [r'Der Grundriss ist die Ansicht von oben.',
     r'Von oben sieht man die Deckfläche.',
     r'Sie ist ein Dreieck, deckungsgleich mit der Grundfläche.'])

Q.q(r'Aus welchen Flächen besteht das Netz eines Quaders?',
    [r'aus 6 Rechtecken, je zwei gleich', r'aus 4 Rechtecken und 2 Dreiecken', r'aus 6 Dreiecken', r'aus 5 Rechtecken'],
    [r'Ein Quader hat 6 Flächen.',
     r'Gegenüberliegende Flächen sind gleich groß.',
     r'Also 3 Paare gleicher Rechtecke.'])

Q.q(r'Ein Quader ist 6 cm tief. Wie lang werden die Tiefenkanten im Schrägbild gezeichnet?',
    [r'3 cm', r'6 cm', r'12 cm', r'2 cm'],
    [r'Tiefenkanten werden unter 45° gezeichnet.',
     r'Sie werden auf die Hälfte verkürzt.',
     r'$6 : 2 = 3$ cm'])

Q.q(r'Ein Dreiecksprisma hat ein Dreieck mit $g = 5$ cm und $h = 4$ cm als Grundfläche und ist 10 cm hoch. Wie groß ist sein Volumen?',
    [r'100 cm³', r'200 cm³', r'19 cm³', r'50 cm³'],
    [r'$G = 5 \cdot 4 : 2 = 10$ cm²',
     r'$V = G \cdot h = 10 \cdot 10$',
     r'$V = 100$ cm³'])

Q.q(r'Ein Prisma hat ein Trapez als Grundfläche ($a = 6$ cm, $c = 4$ cm, Trapezhöhe 5 cm) und ist 8 cm hoch. Wie groß ist sein Volumen?',
    [r'200 cm³', r'400 cm³', r'960 cm³', r'25 cm³'],
    [r'$G = (6 + 4) \cdot 5 : 2 = 25$ cm²',
     r'$V = 25 \cdot 8$',
     r'$V = 200$ cm³'])

Q.q(r'Die Grundfläche eines Prismas hat den Umfang 20 cm, das Prisma ist 7 cm hoch. Wie groß ist der Mantel?',
    [r'140 cm²', r'27 cm²', r'70 cm²', r'280 cm²'],
    [r'Der Mantel ist abgewickelt ein Rechteck.',
     r'$M = u \cdot h = 20 \cdot 7$',
     r'$= 140$ cm²'])

Q.q(r'Ein Prisma hat die Grundfläche 15 cm² und den Mantel 140 cm². Wie groß ist die Oberfläche?',
    [r'170 cm²', r'155 cm²', r'2100 cm²', r'310 cm²'],
    [r'$O = 2 \cdot G + M$',
     r'$= 30 + 140$',
     r'$= 170$ cm²'])

Q.q(r'Wie groß ist die Oberfläche eines Quaders mit 6 cm × 5 cm × 4 cm?',
    [r'148 cm²', r'120 cm²', r'74 cm²', r'150 cm²'],
    [r'$2 \cdot (6 \cdot 5 + 6 \cdot 4 + 5 \cdot 4)$',
     r'$= 2 \cdot (30 + 24 + 20) = 2 \cdot 74$',
     r'$= 148$ cm²'])

Q.q(r'Ein Prisma hat das Volumen 360 cm³ und die Grundfläche 45 cm². Wie hoch ist es?',
    [r'8 cm', r'315 cm', r'16 cm', r'6 cm'],
    [r'$360 = 45 \cdot h$',
     r'$h = 360 : 45$',
     r'$h = 8$ cm'])

Q.q(r'Ein Werkstück aus Stahl (7,8 g/cm³) hat das Volumen 50 cm³. Wie schwer ist es?',
    [r'390 g', r'57,8 g', r'6,4 g', r'39 g'],
    [r'$m = \rho \cdot V$',
     r'$= 7{,}8 \cdot 50$',
     r'$= 390$ g'])

Q.q(r'Ein Holzbalken ist 2 m lang, 10 cm breit und 10 cm hoch. Das Holz hat die Dichte 0,6 g/cm³. Wie schwer ist er?',
    [r'12 kg', r'1,2 kg', r'120 kg', r'20 kg'],
    [r'Volumen: $200 \cdot 10 \cdot 10 = 20\,000$ cm³',
     r'$m = 0{,}6 \cdot 20\,000 = 12\,000$ g',
     r'= 12 kg'])

Q.q(r'Ein Metallstück wiegt 540 g und hat das Volumen 200 cm³. Wie groß ist seine Dichte?',
    [r'2,7 g/cm³', r'0,37 g/cm³', r'27 g/cm³', r'108 g/cm³'],
    [r'$\rho = \dfrac{m}{V}$',
     r'$= 540 : 200$',
     r'$= 2{,}7$ g/cm³ (wie Aluminium)'])

Q.q(r'Ein Becken ist 2 m lang, 1,5 m breit und 0,8 m tief. Wie viele Liter Wasser passen hinein?',
    [r'2400 Liter', r'240 Liter', r'24 000 Liter', r'4,3 Liter'],
    [r'$V = 2 \cdot 1{,}5 \cdot 0{,}8 = 2{,}4$ m³',
     r'1 m³ = 1000 Liter',
     r'2,4 m³ = 2400 Liter'])

Q.q(r'Ein Modellhaus besteht aus einem Quader (8 cm × 5 cm × 4 cm) und einem Dachprisma (Dreieck 5 cm breit und 2 cm hoch, 8 cm lang). Wie groß ist sein Volumen?',
    [r'200 cm³', r'160 cm³', r'240 cm³', r'180 cm³'],
    [r'Quader: $8 \cdot 5 \cdot 4 = 160$ cm³',
     r'Dach: $G = 5 \cdot 2 : 2 = 5$ cm², $V = 5 \cdot 8 = 40$ cm³',
     r'Zusammen 200 cm³.'])

Q.q(r'Durch einen Würfel mit 10 cm Kantenlänge wird ein durchgehendes quadratisches Loch (2 cm × 2 cm) gebohrt. Wie groß ist das Restvolumen?',
    [r'960 cm³', r'996 cm³', r'800 cm³', r'40 cm³'],
    [r'Würfel: $10 \cdot 10 \cdot 10 = 1000$ cm³',
     r'Loch: $2 \cdot 2 \cdot 10 = 40$ cm³',
     r'$1000 - 40 = 960$ cm³'])

Q.q(r'Welche Schachtel für 1000 cm³ braucht am wenigsten Pappe?',
    [r'10 cm × 10 cm × 10 cm', r'20 cm × 10 cm × 5 cm', r'50 cm × 5 cm × 4 cm', r'25 cm × 20 cm × 2 cm'],
    [r'Oberflächen: 600 cm², 700 cm², 940 cm², 1180 cm².',
     r'Alle fassen 1000 cm³.',
     r'Der Würfel braucht am wenigsten Material.'])

Q.q(r'Die Höhe eines Prismas wird verdoppelt, die Grundfläche bleibt gleich. Was passiert mit dem Volumen?',
    [r'Es verdoppelt sich.', r'Es vervierfacht sich.', r'Es bleibt gleich.', r'Es halbiert sich.'],
    [r'$V = G \cdot h$',
     r'Mit $2h$: $V = 2 \cdot G \cdot h$',
     r'Doppelt so groß.'])

Q.q(r'Ein Würfel hat das Volumen 125 cm³. Wie groß ist seine Oberfläche?',
    [r'150 cm²', r'125 cm²', r'25 cm²', r'750 cm²'],
    [r'Kantenlänge: $5 \cdot 5 \cdot 5 = 125$, also 5 cm.',
     r'Eine Fläche: $5 \cdot 5 = 25$ cm²',
     r'$O = 6 \cdot 25 = 150$ cm²'])


def check():
    assert 2 + 3 == 5 and 3 * 5 == 15 and 6 / 2 == 3
    assert F(5 * 4, 2) * 10 == 100 and F((6 + 4) * 5, 2) * 8 == 200 and 20 * 7 == 140 and 2 * 15 + 140 == 170
    assert surf(6, 5, 4) == 148 and F(360, 45) == 8
    assert D('7.8') * 50 == 390 and D('0.6') * 200 * 10 * 10 == 12000 and D(540) / 200 == D('2.7')
    assert 2 * D('1.5') * D('0.8') * 1000 == 2400
    assert 8 * 5 * 4 + F(5 * 2, 2) * 8 == 200 and 1000 - 2 * 2 * 10 == 960
    boxes = [(10, 10, 10), (20, 10, 5), (50, 5, 4), (25, 20, 2)]
    assert all(a * b * c == 1000 for a, b, c in boxes) and [surf(*b) for b in boxes] == [600, 700, 940, 1180]
    assert 5 ** 3 == 125 and surf(5, 5, 5) == 150


Q.verify(check)
Q.save()
