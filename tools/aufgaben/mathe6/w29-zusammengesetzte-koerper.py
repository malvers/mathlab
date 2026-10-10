#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 29 / KW 15 (LB 4): volume and surface of cuboids and of
solids made of cuboids - filling, cutting, completing, units and size estimates.
Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from decimal import Decimal as D
from quiz import os6
from osfig import quader, wuerfelbau

Q = os6(nr=29, slug='zusammengesetzte-koerper', thema='Zusammengesetzte Körper', lb='LB 4',
        blurb='Volumen und Oberfläche, Ausfüllen, Zerlegen, Ergänzen, Größenvorstellungen',
        comment='Blocks: cuboid (1-2, 13-16, 20), cube buildings (3, 12, 18), composite (4-5), units and estimates (6-11, 17, 19).')

BAU = [(0, 0, 0), (0, 1, 0), (0, 2, 0), (1, 0, 0), (1, 1, 0), (1, 2, 0), (0, 0, 1), (0, 1, 1)]
STUFEN = [(0, 0, 0), (0, 1, 0), (0, 2, 0), (0, 0, 1), (0, 1, 1), (0, 0, 2)]
fig_q = quader(5, 3, 2, ('5 cm', '3 cm', '2 cm'))


def vol(l, b, h):
    return l * b * h


def surf(l, b, h):
    return 2 * (l * b + l * h + b * h)


# ------------------------------------------------------------------- cuboid ----
Q.q(r'Wie groß ist das Volumen des Quaders?',
    [r'30 cm³', r'10 cm³', r'62 cm³', r'31 cm³'],
    [r'Volumen Quader: Länge mal Breite mal Höhe.',
     r'$V = 5 \cdot 3 \cdot 2$',
     r'$V = 30$ cm³ – es passen 30 Zentimeterwürfel hinein.'],
    fig=fig_q, figcap=r'Quader im Schrägbild')

Q.q(r'Wie groß ist der Oberflächeninhalt des Quaders?',
    [r'62 cm²', r'31 cm²', r'30 cm²', r'40 cm²'],
    [r'Je zwei gleiche Flächen: $5 \cdot 3 = 15$, $5 \cdot 2 = 10$, $3 \cdot 2 = 6$.',
     r'$O = 2 \cdot (15 + 10 + 6)$',
     r'$O = 62$ cm²'],
    fig=fig_q, figcap=r'Quader im Schrägbild')

Q.q(r'Wie viele Zentimeterwürfel passen genau in eine Schachtel mit 4 cm × 3 cm × 2 cm?',
    [r'24', r'9', r'12', r'52'],
    [r'Eine Schicht am Boden: $4 \cdot 3 = 12$ Würfel.',
     r'Es passen 2 Schichten übereinander.',
     r'$12 \cdot 2 = 24$ Würfel, also 24 cm³.'])

Q.q(r'Ein Würfel hat die Kantenlänge 3 cm. Wie groß ist seine Oberfläche?',
    [r'54 cm²', r'27 cm²', r'36 cm²', r'9 cm²'],
    [r'Eine Fläche: $3 \cdot 3 = 9$ cm²',
     r'Ein Würfel hat 6 gleiche Flächen.',
     r'$6 \cdot 9 = 54$ cm²'])

Q.q(r'Ein Quader hat das Volumen 60 cm³, ist 5 cm lang und 4 cm breit. Wie hoch ist er?',
    [r'3 cm', r'12 cm', r'51 cm', r'2 cm'],
    [r'Grundfläche: $5 \cdot 4 = 20$ cm²',
     r'$V = 20 \cdot h = 60$',
     r'$h = 60 : 20 = 3$ cm'])

Q.q(r'Alle Kanten eines Quaders werden verdoppelt. Was passiert mit dem Volumen?',
    [r'Es wird achtmal so groß.', r'Es verdoppelt sich.', r'Es wird viermal so groß.', r'Es wird sechsmal so groß.'],
    [r'$V = 2l \cdot 2b \cdot 2h$',
     r'$= 2 \cdot 2 \cdot 2 \cdot l \cdot b \cdot h$',
     r'Also achtmal so groß: In den großen Quader passen 8 kleine.'])

Q.q(r'Ein Geschenk (30 cm × 20 cm × 10 cm) soll ganz in Papier eingepackt werden. Wie viel Papier braucht man mindestens?',
    [r'2200 cm²', r'6000 cm²', r'1100 cm²', r'60 cm²'],
    [r'Gesucht ist die Oberfläche.',
     r'$2 \cdot (30 \cdot 20 + 30 \cdot 10 + 20 \cdot 10) = 2 \cdot (600 + 300 + 200)$',
     r'$= 2200$ cm² – dazu noch etwas zum Überlappen.'])

Q.q(r'Für ein Kantenmodell eines Quaders mit 5 cm × 3 cm × 2 cm wird Draht gebraucht. Wie viel Draht ist das?',
    [r'40 cm', r'10 cm', r'30 cm', r'20 cm'],
    [r'Ein Quader hat je 4 Kanten mit 5 cm, 3 cm und 2 cm.',
     r'$4 \cdot (5 + 3 + 2)$',
     r'$= 40$ cm'])

# -------------------------------------------------------- cube buildings ----
Q.q(r'Jeder Würfel ist 1 cm³ groß. Welches Volumen hat der Körper?',
    [r'8 cm³', r'6 cm³', r'5 cm³', r'12 cm³'],
    [r'Unten: 2 Reihen zu je 3 Würfeln = 6.',
     r'Oben hinten: 2 Würfel.',
     r'$6 + 2 = 8$ Würfel, also 8 cm³.'],
    fig=wuerfelbau(BAU), figcap=r'Körper aus Würfeln')

Q.q(r'Zwei Würfel mit 2 cm Kantenlänge werden zu einem Quader zusammengeklebt. Wie groß ist seine Oberfläche?',
    [r'40 cm²', r'48 cm²', r'24 cm²', r'32 cm²'],
    [r'Jeder Würfel hat $6 \cdot 4 = 24$ cm² Oberfläche, zusammen 48 cm².',
     r'Die beiden Klebeflächen liegen innen: $2 \cdot 4 = 8$ cm² fallen weg.',
     r'$48 - 8 = 40$ cm². Probe mit dem Quader 4 × 2 × 2: $2 \cdot (8 + 8 + 4) = 40$.'])

Q.q(r'Die Treppe besteht aus Würfeln mit 2 cm Kantenlänge. Wie groß ist ihr Volumen?',
    [r'48 cm³', r'6 cm³', r'24 cm³', r'12 cm³'],
    [r'Es sind $3 + 2 + 1 = 6$ Würfel.',
     r'Ein Würfel: $2 \cdot 2 \cdot 2 = 8$ cm³',
     r'$6 \cdot 8 = 48$ cm³'],
    fig=wuerfelbau(STUFEN, label='Treppe aus Würfeln'), figcap=r'Treppe aus 6 gleichen Würfeln')

# ---------------------------------------------------------------- composite ----
Q.q(r'Ein Treppenpodest besteht aus zwei Quadern: 60 cm × 30 cm × 20 cm und 60 cm × 30 cm × 40 cm. Wie groß ist sein Volumen?',
    [r'108 dm³', r'72 dm³', r'36 dm³', r'1080 dm³'],
    [r'Zerlegen: $60 \cdot 30 \cdot 20 = 36\,000$ cm³ und $60 \cdot 30 \cdot 40 = 72\,000$ cm³.',
     r'Zusammen $108\,000$ cm³.',
     r'1000 cm³ = 1 dm³, also 108 dm³.'])

Q.q(r'Aus einem Holzklotz (10 cm × 8 cm × 5 cm) wird ein Quader mit 4 cm × 8 cm × 2 cm herausgesägt. Wie groß ist das Volumen des Rests?',
    [r'336 cm³', r'400 cm³', r'64 cm³', r'464 cm³'],
    [r'Ergänzen und abziehen: ganzer Klotz $10 \cdot 8 \cdot 5 = 400$ cm³.',
     r'Herausgesägt: $4 \cdot 8 \cdot 2 = 64$ cm³.',
     r'$400 - 64 = 336$ cm³'])

# ------------------------------------------------------- units and estimates ----
Q.q(r'Wie viele Liter sind 1 m³?',
    [r'1000', r'100', r'10', r'1 000 000'],
    [r'1 Liter ist 1 dm³.',
     r'1 m sind 10 dm, also $1 \text{ m}^3 = 10 \cdot 10 \cdot 10 \text{ dm}^3$.',
     r'$= 1000$ dm³ = 1000 Liter.'])

Q.q(r'Ein Aquarium ist 80 cm lang, 40 cm breit und 50 cm hoch. Wie viele Liter passen hinein?',
    [r'160 Liter', r'1600 Liter', r'16 Liter', r'170 Liter'],
    [r'In Dezimetern: 8 dm, 4 dm und 5 dm.',
     r'$8 \cdot 4 \cdot 5 = 160$ dm³',
     r'160 dm³ = 160 Liter.'])

Q.q(r'Ein Klassenzimmer ist 8 m lang, 7 m breit und 3 m hoch. Wie viel Luft ist darin?',
    [r'168 m³', r'56 m³', r'18 m³', r'1680 m³'],
    [r'$V = 8 \cdot 7 \cdot 3$',
     r'$= 168$ m³',
     r'Das sind 168 000 Liter Luft.'])

Q.q(r'Welches Volumen hat ungefähr ein Schuhkarton (etwa 33 cm × 20 cm × 12 cm)?',
    [r'etwa 8 Liter', r'etwa 80 Liter', r'etwa 0,8 Liter', r'etwa 800 Liter'],
    [r'Überschlag: $33 \cdot 20 \cdot 12 \approx 8000$ cm³',
     r'1000 cm³ sind 1 Liter.',
     r'Also etwa 8 Liter.'])

Q.q(r'Ein Schiffscontainer ist innen etwa 6 m lang, 2,4 m breit und 2,5 m hoch. Wie groß ist sein Volumen?',
    [r'36 m³', r'10,9 m³', r'3,6 m³', r'360 m³'],
    [r'$6 \cdot 2{,}4 = 14{,}4$',
     r'$14{,}4 \cdot 2{,}5 = 36$',
     r'Etwa 36 m³.'])

Q.q(r'Ein Planschbecken ist 5 m lang, 3 m breit und 1,2 m tief. Wie viele Liter Wasser passen hinein?',
    [r'18 000 Liter', r'1800 Liter', r'18 Liter', r'180 000 Liter'],
    [r'$V = 5 \cdot 3 \cdot 1{,}2 = 18$ m³',
     r'1 m³ = 1000 Liter.',
     r'18 m³ = 18 000 Liter.'])

Q.q(r'Wie viele cm³ sind 2,5 Liter?',
    [r'2500', r'250', r'25', r'25 000'],
    [r'1 Liter = 1 dm³ = 1000 cm³.',
     r'$2{,}5 \cdot 1000$',
     r'$= 2500$ cm³'])


def check():
    assert vol(5, 3, 2) == 30 and surf(5, 3, 2) == 62
    assert vol(4, 3, 2) == 24
    assert surf(3, 3, 3) == 54
    assert 60 / (5 * 4) == 3
    assert vol(2, 2, 2) == 8 * vol(1, 1, 1)
    assert surf(30, 20, 10) == 2200
    assert 4 * (5 + 3 + 2) == 40
    assert len(BAU) == 8
    assert 2 * surf(2, 2, 2) - 2 * 4 == 40 == surf(4, 2, 2)
    assert len(STUFEN) == 6 and 6 * vol(2, 2, 2) == 48
    assert vol(60, 30, 20) + vol(60, 30, 40) == 108000
    assert vol(10, 8, 5) - vol(4, 8, 2) == 336
    assert 10 ** 3 == 1000
    assert vol(8, 4, 5) == 160
    assert vol(8, 7, 3) == 168
    assert abs(vol(33, 20, 12) - 8000) < 100
    assert 6 * D('2.4') * D('2.5') == 36
    assert 5 * 3 * D('1.2') == 18
    assert D('2.5') * 1000 == 2500


Q.verify(check)
Q.save()
