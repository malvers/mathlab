#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 21 / KW 4 (LB 3): Volumen und Masse von
Kreis- und Hohlzylindern. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=21, slug='zylinder-volumen', thema='Volumen und Masse von Zylindern', lb='LB 3',
        blurb='V = π · r² · h, Hohlzylinder, Liter, Masse mit der Dichte, Höhe und Radius berechnen',
        comment='Values with the calculator key for pi, rounded at the end. Blocks: volume (1-4, 7, 9, 18), units and capacity (3, 8, 10, 12-15, 20), mass (5, 11, 16, 19), solving for h and r (6, 17).')

# ---------------------------------------------------------------- Volumen ----
Q.q(r'Ein Zylinder hat den Radius 3 cm und die Höhe 10 cm. Wie groß ist sein Volumen (gerundet)?',
    [r'282,7 cm³', r'94,2 cm³', r'188,5 cm³', r'848,2 cm³'],
    [r'$V = \pi r^2 \cdot h = \pi \cdot 9 \cdot 10$',
     r'$V = 90\pi \approx 282{,}7$ cm³'])

Q.q(r'Ein Zylinder hat den Durchmesser 8 cm und die Höhe 15 cm. Wie groß ist sein Volumen (gerundet)?',
    [r'754,0 cm³', r'3015,9 cm³', r'377,0 cm³', r'188,5 cm³'],
    [r'Radius: 4 cm',
     r'$V = \pi \cdot 16 \cdot 15 = 240\pi \approx 754{,}0$ cm³',
     r'3015,9 cm³ erhält man, wenn man den Durchmesser quadriert.'])

Q.q(r'Ein Fass hat innen 60 cm Durchmesser und ist 90 cm hoch. Wie viele Liter passen hinein (gerundet)?',
    [r'254,5 l', r'1017,9 l', r'25,4 l', r'169,6 l'],
    [r'$V = \pi \cdot 30^2 \cdot 90 = 81\,000\pi \approx 254\,469$ cm³',
     r'1 l = 1000 cm³, also etwa 254,5 l.'])

Q.q(r'Ein Hohlzylinder hat den Außenradius 5 cm, den Innenradius 4 cm und die Höhe 20 cm. Wie groß ist sein Volumen (gerundet)?',
    [r'565,5 cm³', r'62,8 cm³', r'1570,8 cm³', r'2576,1 cm³'],
    [r'Grundfläche ist ein Kreisring: $\pi \cdot (25 - 16) = 9\pi$',
     r'$V = 9\pi \cdot 20 = 180\pi \approx 565{,}5$ cm³'])

Q.q(r'Eine Eisenstange hat 2 cm Durchmesser und ist 1 m lang. Eisen hat die Dichte 7,8 g/cm³. Wie schwer ist die Stange (gerundet)?',
    [r'2,45 kg', r'9,80 kg', r'0,31 kg', r'24,5 kg'],
    [r'$V = \pi \cdot 1^2 \cdot 100 = 100\pi \approx 314{,}16$ cm³',
     r'$m = 7{,}8 \cdot 314{,}16 \approx 2450$ g',
     r'Also etwa 2,45 kg.'])

Q.q(r'Ein Zylinder mit dem Radius 5 cm soll 1000 cm³ fassen. Wie hoch muss er sein (gerundet)?',
    [r'12,7 cm', r'40 cm', r'6,4 cm', r'31,8 cm'],
    [r'$V = \pi r^2 h$, also $h = \dfrac{V}{\pi r^2}$',
     r'$h = \dfrac{1000}{25\pi} \approx 12{,}7$ cm'])

Q.q(r'Bei einem Zylinder wird der Radius verdoppelt, die Höhe bleibt gleich. Wie ändert sich das Volumen?',
    [r'Es wird 4-mal so groß.', r'Es wird doppelt so groß.', r'Es wird 8-mal so groß.', r'Es bleibt gleich.'],
    [r'Der Radius steht im Quadrat: $\pi \cdot (2r)^2 \cdot h = 4 \cdot \pi r^2 h$.'])

Q.q(r'Eine Regentonne hat 70 cm Durchmesser und ist 1 m hoch. Wie viel Wasser fasst sie ungefähr?',
    [r'etwa 385 l', r'etwa 1539 l', r'etwa 220 l', r'etwa 38 l'],
    [r'$V = \pi \cdot 35^2 \cdot 100 \approx 384\,845$ cm³',
     r'Das sind etwa 385 Liter.'])

Q.q(r'Warum gilt für den Zylinder dieselbe Volumenformel wie für das Prisma?',
    [r'Bei beiden ist das Volumen Grundfläche mal Höhe: $V = A_G \cdot h$.',
     r'Ein Zylinder ist ein Würfel.',
     r'Beide haben eckige Grundflächen.',
     r'Das gilt nicht, der Zylinder hat eine ganz andere Formel.'],
    [r'Man kann sich den Zylinder aus vielen dünnen Kreisscheiben gestapelt denken.',
     r'Also $V = A_G \cdot h = \pi r^2 \cdot h$.'])

Q.q(r'Ein zylinderförmiges Glas hat innen 3,5 cm Radius und ist 10 cm hoch. Passt eine Flasche mit 0,33 l hinein?',
    [r'Ja, das Glas fasst etwa 385 ml.', r'Nein, das Glas fasst nur etwa 110 ml.',
     r'Nein, das Glas fasst nur etwa 220 ml.', r'Ja, das Glas fasst etwa 1,1 l.'],
    [r'$V = \pi \cdot 3{,}5^2 \cdot 10 = 122{,}5\pi \approx 384{,}8$ cm³',
     r'1 cm³ = 1 ml, also etwa 385 ml; 0,33 l = 330 ml passen hinein.'])

Q.q(r'Ein Kupferrohr ist 2 m lang, außen 2,2 cm und innen 2 cm dick. Kupfer hat die Dichte 8,9 g/cm³. Wie schwer ist das Rohr (gerundet)?',
    [r'1,17 kg', r'6,77 kg', r'0,13 kg', r'5,59 kg'],
    [r'Radien: 1,1 cm und 1 cm. $V = \pi \cdot (1{,}21 - 1) \cdot 200 = 42\pi \approx 131{,}9$ cm³',
     r'$m = 8{,}9 \cdot 131{,}9 \approx 1174$ g, also etwa 1,17 kg.',
     r'6,77 kg wäre ein volles Kupferrohr mit 2,2 cm Durchmesser.'])

Q.q(r'In ein zylinderförmiges Gefäß mit 6 cm Innenradius wird 1 Liter Wasser gefüllt. Wie hoch steht das Wasser (gerundet)?',
    [r'8,8 cm', r'27,8 cm', r'4,4 cm', r'53,1 cm'],
    [r'1 l = 1000 cm³',
     r'$h = \dfrac{1000}{\pi \cdot 36} \approx 8{,}8$ cm'])

Q.q(r'Welche Umrechnung ist richtig?',
    [r'1 dm³ = 1 l und 1 m³ = 1000 l', r'1 cm³ = 1 l und 1 m³ = 100 l',
     r'1 dm³ = 10 l und 1 m³ = 1000 l', r'1 m³ = 100 dm³'],
    [r'1 Liter ist ein Würfel mit 10 cm Kantenlänge: 1 dm³ = 1000 cm³.',
     r'1 m³ = 1000 dm³ = 1000 l'])

Q.q(r'Ein runder Pool hat 3,6 m Durchmesser, das Wasser steht 0,9 m hoch. Wie viel Wasser ist darin (gerundet)?',
    [r'9,16 m³', r'36,64 m³', r'10,18 m³', r'2,92 m³'],
    [r'$V = \pi \cdot 1{,}8^2 \cdot 0{,}9 = 2{,}916\pi$',
     r'$V \approx 9{,}16$ m³, also etwa 9160 Liter.'])

Q.q(r'Der Pool aus der vorigen Aufgabe (etwa 9160 l) wird mit einem Gartenschlauch gefüllt, der 15 l pro Minute liefert. Wie lange dauert das ungefähr?',
    [r'etwa 10,2 Stunden', r'etwa 610 Stunden', r'etwa 1,6 Stunden', r'etwa 37 Stunden'],
    [r'$9160 : 15 \approx 611$ Minuten',
     r'$611 : 60 \approx 10{,}2$ Stunden'])

Q.q(r'Ein Baumstamm ist 5 m lang und hat 40 cm Durchmesser. Holz hat hier die Dichte 0,7 t/m³. Wie schwer ist der Stamm ungefähr?',
    [r'etwa 440 kg', r'etwa 1760 kg', r'etwa 4,4 t', r'etwa 63 kg'],
    [r'In Metern: $r = 0{,}2$ m, $V = \pi \cdot 0{,}04 \cdot 5 = 0{,}2\pi \approx 0{,}628$ m³',
     r'$m = 0{,}7 \cdot 0{,}628 \approx 0{,}44$ t, also etwa 440 kg.'])

Q.q(r'Ein 10 cm hoher Zylinder soll 500 cm³ fassen. Welchen Radius braucht er (gerundet)?',
    [r'4,0 cm', r'15,9 cm', r'8,0 cm', r'2,5 cm'],
    [r'$r^2 = \dfrac{V}{\pi h} = \dfrac{500}{10\pi} \approx 15{,}92$',
     r'$r = \sqrt{15{,}92} \approx 4{,}0$ cm'])

Q.q(r'Ein Würfel hat 10 cm Kantenlänge. Ein Zylinder passt genau hinein ($r = 5$ cm, $h = 10$ cm). Wie viel Prozent des Würfelvolumens füllt der Zylinder (gerundet)?',
    [r'78,5 %', r'31,4 %', r'50 %', r'87,5 %'],
    [r'Würfel: 1000 cm³, Zylinder: $\pi \cdot 25 \cdot 10 = 250\pi \approx 785{,}4$ cm³',
     r'Anteil: $785{,}4 : 1000 \approx 78{,}5$ %, das ist $\dfrac{\pi}{4}$.'])

Q.q(r'Ein Messingzylinder hat 2 cm Radius und ist 5 cm hoch. Messing hat die Dichte 8,5 g/cm³. Wie schwer ist er (gerundet)?',
    [r'534 g', r'63 g', r'267 g', r'1068 g'],
    [r'$V = \pi \cdot 4 \cdot 5 = 20\pi \approx 62{,}83$ cm³',
     r'$m = 8{,}5 \cdot 62{,}83 \approx 534$ g'])

Q.q(r'Ein Wasserrohr ist 10 m lang und hat innen 2 cm Durchmesser. Wie viel Wasser steht darin (gerundet)?',
    [r'etwa 3,1 l', r'etwa 12,6 l', r'etwa 0,3 l', r'etwa 31,4 l'],
    [r'$r = 1$ cm, $h = 1000$ cm',
     r'$V = \pi \cdot 1 \cdot 1000 \approx 3142$ cm³, also etwa 3,1 l.'])


def check():
    from math import pi, sqrt
    r1 = lambda v: round(v, 1)
    assert r1(90 * pi) == 282.7
    assert r1(240 * pi) == 754.0 and r1(pi * 64 * 15) == 3015.9
    assert r1(pi * 900 * 90 / 1000) == 254.5
    assert r1(180 * pi) == 565.5
    assert round(7.8 * 100 * pi / 1000, 2) == 2.45
    assert r1(1000 / (25 * pi)) == 12.7
    assert round(pi * 35 ** 2 * 100 / 1000) == 385
    assert r1(122.5 * pi) == 384.8 and 122.5 * pi > 330
    v = pi * (1.1 ** 2 - 1) * 200
    assert r1(v) == 131.9 and round(8.9 * v / 1000, 2) == 1.17 and round(8.9 * pi * 1.21 * 200 / 1000, 2) == 6.77
    assert r1(1000 / (36 * pi)) == 8.8
    assert round(pi * 1.8 ** 2 * 0.9, 2) == 9.16
    assert round(9160 / 15 / 60, 1) == 10.2
    assert round(0.7 * pi * 0.2 ** 2 * 5 * 1000, -1) == 440
    assert r1(sqrt(500 / (10 * pi))) == 4.0
    assert r1(250 * pi / 10) == 78.5
    assert round(8.5 * 20 * pi) == 534
    assert r1(pi * 1000 / 1000) == 3.1


Q.verify(check)
Q.save()
