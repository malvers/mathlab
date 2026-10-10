#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 30 / KW 16 (LB 4): surface area and volume of
right prisms - base area, lateral surface, O = 2G + M, V = G * h, units, dependencies.
Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os7
from osfig import dachprisma

Q = os7(nr=30, slug='prismen-berechnen', thema='Oberfläche und Volumen von Prismen', lb='LB 4',
        blurb='Grundfläche, Mantel, O = 2G + M, V = G · h, Einheiten, Abhängigkeiten',
        comment='Blocks: volume (1-2, 6-8, 10, 18-19), surface (3-5, 16, 20), units (9, 17), dependencies (11-12), word problems (13-15).')

V = lambda G, h: D(str(G)) * D(str(h))

# ------------------------------------------------------------------------- volume ----
Q.q(r'Wie groß ist das Volumen des Dreiecksprismas?',
    [r'108 cm³', r'216 cm³', r'54 cm³', r'19 cm³'],
    [r'Grundfläche: $G = 6 \cdot 4 : 2 = 12$ cm²',
     r'$V = G \cdot h = 12 \cdot 9$',
     r'$V = 108$ cm³'],
    fig=dachprisma(6, 4, 9, ('6 cm', '4 cm', '9 cm')), figcap=r'Dreiecksprisma, 9 cm tief')

Q.q(r'Ein Prisma hat ein Trapez als Grundfläche ($a = 8$ cm, $c = 4$ cm, Trapezhöhe 3 cm) und ist 10 cm hoch. Wie groß ist sein Volumen?',
    [r'180 cm³', r'360 cm³', r'960 cm³', r'120 cm³'],
    [r'$G = (8 + 4) \cdot 3 : 2 = 18$ cm²',
     r'$V = 18 \cdot 10$',
     r'$V = 180$ cm³'])

Q.q(r'Wie groß ist das Volumen eines Würfels mit 4 cm Kantenlänge?',
    [r'64 cm³', r'16 cm³', r'96 cm³', r'48 cm³'],
    [r'Ein Würfel ist ein Prisma mit quadratischer Grundfläche.',
     r'$G = 4 \cdot 4 = 16$ cm², $h = 4$ cm',
     r'$V = 16 \cdot 4 = 64$ cm³'])

Q.q(r'Ein Prisma hat das Volumen 150 cm³ und die Grundfläche 25 cm². Wie hoch ist es?',
    [r'6 cm', r'125 cm', r'3750 cm', r'5 cm'],
    [r'$V = G \cdot h$, also $150 = 25 \cdot h$',
     r'$h = 150 : 25$',
     r'$h = 6$ cm'])

Q.q(r'Ein Prisma ist 8 cm hoch und hat das Volumen 240 cm³. Wie groß ist seine Grundfläche?',
    [r'30 cm²', r'1920 cm²', r'32 cm²', r'232 cm²'],
    [r'$240 = G \cdot 8$',
     r'$G = 240 : 8$',
     r'$G = 30$ cm²'])

Q.q(r'Ein Prisma hat ein Parallelogramm mit $g = 5$ cm und $h_g = 3$ cm als Grundfläche und ist 7 cm hoch. Wie groß ist sein Volumen?',
    [r'105 cm³', r'52,5 cm³', r'15 cm³', r'35 cm³'],
    [r'$G = 5 \cdot 3 = 15$ cm²',
     r'$V = 15 \cdot 7$',
     r'$V = 105$ cm³'])

Q.q(r'Ein Prisma mit sechseckiger Grundfläche hat $G = 26$ cm² und die Höhe 10 cm. Wie groß ist sein Volumen?',
    [r'260 cm³', r'36 cm³', r'156 cm³', r'2600 cm³'],
    [r'Die Formel gilt für jedes gerade Prisma.',
     r'$V = 26 \cdot 10$',
     r'$V = 260$ cm³'])

Q.q(r'Welcher Körper hat das größere Volumen: ein Quader mit 4 cm × 3 cm × 5 cm oder ein Prisma mit $G = 10$ cm² und $h = 7$ cm?',
    [r'das Prisma (70 cm³ statt 60 cm³)', r'der Quader (60 cm³ statt 50 cm³)', r'Beide sind gleich groß.', r'Das kann man nicht vergleichen.'],
    [r'Quader: $4 \cdot 3 \cdot 5 = 60$ cm³',
     r'Prisma: $10 \cdot 7 = 70$ cm³',
     r'Das Prisma ist größer.'])

# ------------------------------------------------------------------------ surface ----
Q.q(r'Die Grundfläche eines Prismas hat den Umfang 18 cm, das Prisma ist 5 cm hoch. Wie groß ist der Mantel?',
    [r'90 cm²', r'23 cm²', r'45 cm²', r'180 cm²'],
    [r'Der Mantel ist abgewickelt ein Rechteck.',
     r'Breite = Umfang der Grundfläche, Höhe = Höhe des Prismas.',
     r'$M = 18 \cdot 5 = 90$ cm²'])

Q.q(r'Ein Prisma hat die Grundfläche 12 cm² und den Mantel 90 cm². Wie groß ist seine Oberfläche?',
    [r'114 cm²', r'102 cm²', r'1080 cm²', r'204 cm²'],
    [r'$O = 2 \cdot G + M$ (Grund- und Deckfläche plus Mantel).',
     r'$= 2 \cdot 12 + 90$',
     r'$= 114$ cm²'])

Q.q(r'Wie groß ist die Oberfläche eines Quaders mit 5 cm × 4 cm × 3 cm?',
    [r'94 cm²', r'60 cm²', r'47 cm²', r'120 cm²'],
    [r'$2 \cdot (5 \cdot 4 + 5 \cdot 3 + 4 \cdot 3)$',
     r'$= 2 \cdot (20 + 15 + 12) = 2 \cdot 47$',
     r'$= 94$ cm²'])

Q.q(r'Ein Prisma hat ein rechtwinkliges Dreieck mit 6 cm, 8 cm und 10 cm als Grundfläche und ist 12 cm hoch. Wie groß ist seine Oberfläche?',
    [r'336 cm²', r'288 cm²', r'312 cm²', r'576 cm²'],
    [r'$G = 6 \cdot 8 : 2 = 24$ cm²',
     r'$M = (6 + 8 + 10) \cdot 12 = 288$ cm²',
     r'$O = 2 \cdot 24 + 288 = 336$ cm²'])

Q.q(r'Ein Prisma mit einem regelmäßigen Sechseck (Seite 2 cm) als Grundfläche ist 9 cm hoch. Wie groß ist der Mantel?',
    [r'108 cm²', r'18 cm²', r'54 cm²', r'216 cm²'],
    [r'Umfang der Grundfläche: $6 \cdot 2 = 12$ cm',
     r'$M = 12 \cdot 9$',
     r'$= 108$ cm²'])

# -------------------------------------------------------------------------- units ----
Q.q(r'Ein Prisma hat das Volumen 2,5 dm³. Wie viele Liter passen hinein?',
    [r'2,5 Liter', r'25 Liter', r'250 Liter', r'0,25 Liter'],
    [r'1 dm³ = 1 Liter',
     r'Also 2,5 dm³ = 2,5 Liter.',
     r'Das sind 2500 cm³.'])

Q.q(r'Wie viele Liter sind 1 m³?',
    [r'1000', r'100', r'10', r'1 000 000'],
    [r'1 m = 10 dm',
     r'$1 \text{ m}^3 = 10 \cdot 10 \cdot 10 \text{ dm}^3 = 1000 \text{ dm}^3$',
     r'= 1000 Liter'])

# ------------------------------------------------------------------- dependencies ----
Q.q(r'Die Höhe eines Prismas wird verdreifacht, die Grundfläche bleibt gleich. Was passiert mit dem Volumen?',
    [r'Es verdreifacht sich.', r'Es verneunfacht sich.', r'Es bleibt gleich.', r'Es wird um 3 cm³ größer.'],
    [r'$V = G \cdot h$',
     r'Mit $3h$: $V = 3 \cdot G \cdot h$',
     r'Höhe → Volumen ist direkt proportional.'])

Q.q(r'Bei einem quadratischen Prisma werden die Grundkanten verdoppelt, die Höhe bleibt. Was passiert mit dem Volumen?',
    [r'Es vervierfacht sich.', r'Es verdoppelt sich.', r'Es verachtfacht sich.', r'Es bleibt gleich.'],
    [r'Die Grundfläche $a \cdot a$ wird zu $2a \cdot 2a = 4 \cdot a \cdot a$.',
     r'Die Grundfläche vervierfacht sich.',
     r'Bei gleicher Höhe vervierfacht sich auch das Volumen.'])

# ------------------------------------------------------------------- word problems ----
Q.q(r'Ein Schwimmbecken ist 25 m lang und 10 m breit. Es ist vorne 1 m und hinten 2 m tief, der Boden ist gleichmäßig schräg. Wie viel Wasser passt hinein?',
    [r'375 m³', r'750 m³', r'500 m³', r'250 m³'],
    [r'Die Seitenansicht ist ein Trapez: $G = (1 + 2) \cdot 25 : 2 = 37{,}5$ m².',
     r'Das Becken ist ein Prisma mit der Höhe (Breite) 10 m.',
     r'$V = 37{,}5 \cdot 10 = 375$ m³, also 375 000 Liter.'])

Q.q(r'Eine dreieckige Schokoladenpackung ist 20 cm lang, das Dreieck hat $g = 3$ cm und $h = 2{,}6$ cm. Wie groß ist ihr Volumen?',
    [r'78 cm³', r'156 cm³', r'52 cm³', r'7,8 cm³'],
    [r'$G = 3 \cdot 2{,}6 : 2 = 3{,}9$ cm²',
     r'$V = 3{,}9 \cdot 20$',
     r'$V = 78$ cm³'])

Q.q(r'Eine 5 m lange Dachrinne hat einen trapezförmigen Querschnitt: oben 12 cm, unten 8 cm, 6 cm tief. Wie viele Liter fasst sie?',
    [r'30 Liter', r'3 Liter', r'300 Liter', r'60 Liter'],
    [r'$G = (12 + 8) \cdot 6 : 2 = 60$ cm²',
     r'$V = 60 \cdot 500 = 30\,000$ cm³ (5 m = 500 cm)',
     r'30 000 cm³ = 30 Liter'])


def check():
    assert V(F(6 * 4, 2), 9) == 108 and V(F((8 + 4) * 3, 2), 10) == 180 and V(16, 4) == 64
    assert D(150) / 25 == 6 and D(240) / 8 == 30 and V(15, 7) == 105 and V(26, 10) == 260 and 4 * 3 * 5 == 60 < V(10, 7)
    assert 18 * 5 == 90 and 2 * 12 + 90 == 114 and 2 * (20 + 15 + 12) == 94
    assert 2 * F(6 * 8, 2) + (6 + 8 + 10) * 12 == 336 and 6 ** 2 + 8 ** 2 == 10 ** 2 and 6 * 2 * 9 == 108
    assert D('2.5') * 1000 == 2500 and 10 ** 3 == 1000
    assert V(D(1 + 2) * 25 / 2, 10) == 375 and V(D(3) * D('2.6') / 2, 20) == 78 and V(F((12 + 8) * 6, 2), 500) == 30000


Q.verify(check)
Q.save()
