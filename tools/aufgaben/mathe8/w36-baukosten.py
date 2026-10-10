#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 36 / KW 22 (LB 6): Baukosten - Wohnfläche,
Materialbedarf, umbauter Raum, Fassungsvermögen. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=36, slug='baukosten', thema='Baukosten und Materialbedarf', lb='LB 6',
        blurb='Bodenbelag mit Verschnitt, Wände streichen, Fliesen, umbauter Raum, Behälter, Garten',
        comment='All prices are plausible examples. Blocks: floor and walls (1-6, 20), volumes on the building site (7-10, 15-16, 19), containers (11-12), garden and roof (13-14, 17), energy saving (18).')

# ------------------------------------------------------ Boden und Wände ----
Q.q(r'Ein Zimmer ist 4,5 m lang und 3,8 m breit. Wie groß ist seine Bodenfläche?',
    [r'17,1 m²', r'16,6 m²', r'8,3 m²', r'171 m²'],
    [r'$A = 4{,}5 \cdot 3{,}8 = 17{,}1$ m²',
     r'16,6 wäre der Umfang in Metern.'])

Q.q(r'Für 17,1 m² Laminat rechnet man 10 % Verschnitt dazu. Ein Paket enthält 2,13 m². Wie viele Pakete braucht man?',
    [r'9', r'8', r'10', r'18'],
    [r'Mit Verschnitt: $17{,}1 \cdot 1{,}1 = 18{,}81$ m²',
     r'$18{,}81 : 2{,}13 \approx 8{,}8$ Pakete',
     r'Angebrochene Pakete gibt es nicht: also 9 Pakete.'])

Q.q(r'Ein Paket Laminat kostet 24,90 €. Was kosten 9 Pakete?',
    [r'224,10 €', r'199,20 €', r'249,00 €', r'33,90 €'],
    [r'$9 \cdot 24{,}90 = 224{,}10$ €'])

Q.q(r'Eine Wand ist 4,5 m breit und 2,5 m hoch, darin ein Fenster mit 1,2 m × 1,4 m. Wie groß ist die zu streichende Fläche?',
    [r'9,57 m²', r'11,25 m²', r'12,93 m²', r'8,25 m²'],
    [r'Wand: $4{,}5 \cdot 2{,}5 = 11{,}25$ m²',
     r'Fenster: $1{,}2 \cdot 1{,}4 = 1{,}68$ m²',
     r'$11{,}25 - 1{,}68 = 9{,}57$ m²'])

Q.q(r'40 m² Wandfläche sollen zweimal gestrichen werden. 1 Liter Farbe reicht für 6 m². Wie viele 5-Liter-Eimer braucht man?',
    [r'3', r'2', r'14', r'1'],
    [r'Zwei Anstriche: $2 \cdot 40 = 80$ m²',
     r'$80 : 6 \approx 13{,}3$ Liter',
     r'$13{,}3 : 5 \approx 2{,}7$, also 3 Eimer.'])

Q.q(r'Ein Boden von 6 m² wird mit quadratischen Fliesen von 20 cm Kantenlänge belegt. Wie viele Fliesen braucht man (ohne Verschnitt)?',
    [r'150', r'30', r'300', r'1500'],
    [r'Eine Fliese: $0{,}2 \cdot 0{,}2 = 0{,}04$ m²',
     r'$6 : 0{,}04 = 150$'])

# ---------------------------------------------------------- Volumen am Bau ----
Q.q(r'Ein Boden von 30 m² bekommt 5 cm Estrich. Wie viel Estrich braucht man?',
    [r'1,5 m³', r'150 m³', r'15 m³', r'0,15 m³'],
    [r'5 cm = 0,05 m',
     r'$30 \cdot 0{,}05 = 1{,}5$ m³'])

Q.q(r'Ein Haus ist (ohne Dach) 10 m lang, 8 m breit und 6 m hoch. Wie groß ist dieser umbaute Raum?',
    [r'480 m³', r'48 m³', r'240 m³', r'24 m³'],
    [r'Quader: $V = 10 \cdot 8 \cdot 6 = 480$ m³'])

Q.q(r'Das Satteldach ist ein Prisma mit dreieckiger Giebelfläche: Grundseite 8 m, Höhe 3 m, Länge 10 m. Wie groß ist sein Rauminhalt?',
    [r'120 m³', r'240 m³', r'80 m³', r'40 m³'],
    [r'Giebeldreieck: $\dfrac{8 \cdot 3}{2} = 12$ m²',
     r'$V = 12 \cdot 10 = 120$ m³'])

Q.q(r'Ein Bauunternehmen rechnet mit 450 € pro m³ umbauten Raums. Was kostet ein Haus mit 480 m³?',
    [r'216 000 €', r'21 600 €', r'930 €', r'2 160 000 €'],
    [r'$480 \cdot 450 = 216\,000$ €'])

# ------------------------------------------------------------- Behälter ----
Q.q(r'Eine Regentonne ist ein Zylinder mit 0,8 m Durchmesser und 1 m Höhe. Wie viele Liter fasst sie (gerundet)?',
    [r'503 l', r'2011 l', r'251 l', r'50 l'],
    [r'$V = \pi \cdot 0{,}4^2 \cdot 1 \approx 0{,}503$ m³',
     r'1 m³ = 1000 l, also etwa 503 l.'])

Q.q(r'Ein Pool ist 4 m lang, 3 m breit und wird 1,2 m hoch gefüllt. Wasser kostet 4,70 € pro m³. Was kostet die Füllung?',
    [r'67,68 €', r'14,40 €', r'56,40 €', r'676,80 €'],
    [r'$V = 4 \cdot 3 \cdot 1{,}2 = 14{,}4$ m³',
     r'$14{,}4 \cdot 4{,}70 = 67{,}68$ €'])

# ------------------------------------------------------------ Garten, Dach ----
Q.q(r'Ein Grundstück ist 25 m lang und 18 m breit. Es wird ringsum eingezäunt, nur ein 3 m breites Tor bleibt frei. Der Zaun kostet 35 € pro Meter. Was kostet er?',
    [r'2905 €', r'3010 €', r'15 750 €', r'1505 €'],
    [r'Umfang: $2 \cdot (25 + 18) = 86$ m',
     r'Ohne Tor: $86 - 3 = 83$ m',
     r'$83 \cdot 35 = 2905$ €'])

Q.q(r'Auf dem Grundstück (25 m × 18 m) steht ein Haus mit 80 m² Grundfläche, der Rest wird Rasen. Man sät 25 g Samen pro m². Wie viel Samen braucht man?',
    [r'9,25 kg', r'11,25 kg', r'2,25 kg', r'925 g'],
    [r'Rasenfläche: $450 - 80 = 370$ m²',
     r'$370 \cdot 25 = 9250$ g = 9,25 kg'])

Q.q(r'Ein Gartenweg ist 15 m lang und 1,2 m breit und bekommt 10 cm Kies. Wie viel Kies braucht man?',
    [r'1,8 m³', r'18 m³', r'180 m³', r'0,18 m³'],
    [r'10 cm = 0,1 m',
     r'$15 \cdot 1{,}2 \cdot 0{,}1 = 1{,}8$ m³'])

Q.q(r'Ein Streifenfundament ist 36 m lang, 0,3 m breit und 0,8 m tief. Wie viel Beton braucht man?',
    [r'8,64 m³', r'864 m³', r'10,8 m³', r'37,1 m³'],
    [r'$36 \cdot 0{,}3 \cdot 0{,}8 = 8{,}64$ m³'])

Q.q(r'Ein Satteldach besteht aus zwei Rechtecken mit je 10 m × 5 m. Man rechnet 12 Dachziegel pro m². Wie viele Ziegel braucht man?',
    [r'1200', r'600', r'120', r'2400'],
    [r'Dachfläche: $2 \cdot 10 \cdot 5 = 100$ m²',
     r'$100 \cdot 12 = 1200$ Ziegel'])

Q.q(r'Eine Wärmedämmung für 8000 € senkt die Heizkosten von 1600 € im Jahr um 25 %. Nach wie vielen Jahren hat sie sich bezahlt gemacht?',
    [r'nach 20 Jahren', r'nach 5 Jahren', r'nach 25 Jahren', r'nach 2 Jahren'],
    [r'Ersparnis pro Jahr: $1600 \cdot 0{,}25 = 400$ €',
     r'$8000 : 400 = 20$ Jahre; danach spart die Dämmung Geld und CO₂.'])

Q.q(r'Ein Sandkasten ist 2 m lang, 1,5 m breit und wird 30 cm hoch mit Sand gefüllt. 1 m³ Sand wiegt 1,5 t. Wie schwer ist der Sand?',
    [r'1,35 t', r'0,9 t', r'135 t', r'4,5 t'],
    [r'$V = 2 \cdot 1{,}5 \cdot 0{,}3 = 0{,}9$ m³',
     r'$0{,}9 \cdot 1{,}5 = 1{,}35$ t'])

Q.q(r'Eine Tapetenrolle ist 10,05 m lang und 0,53 m breit. Die Wand ist 2,5 m hoch und 4,5 m breit. Wie viele Rollen braucht man (ohne Musteransatz)?',
    [r'3', r'2', r'5', r'9'],
    [r'Bahnen pro Rolle: $10{,}05 : 2{,}5 \approx 4{,}02$, also 4 ganze Bahnen.',
     r'Bahnen für die Wand: $4{,}5 : 0{,}53 \approx 8{,}5$, also 9 Bahnen.',
     r'$9 : 4 = 2{,}25$, also 3 Rollen.'])


def check():
    from fractions import Fraction as F
    from math import pi, ceil
    assert F('4.5') * F('3.8') == F('17.1') and 2 * (F('4.5') + F('3.8')) == F('16.6')
    need = F('17.1') * F('1.1')
    assert need == F('18.81') and ceil(need / F('2.13')) == 9
    assert 9 * F('24.9') == F('224.1')
    assert F('4.5') * F('2.5') - F('1.2') * F('1.4') == F('9.57')
    assert ceil(F(80, 6) / 5) == 3
    assert 6 / F('0.04') == 150
    assert 30 * F('0.05') == F('1.5') and 10 * 8 * 6 == 480 and F(8 * 3, 2) * 10 == 120
    assert 480 * 450 == 216000
    assert round(pi * 0.4 ** 2 * 1000) == 503
    assert 4 * 3 * F('1.2') == F('14.4') and F('14.4') * F('4.7') == F('67.68')
    assert (2 * (25 + 18) - 3) * 35 == 2905
    assert (25 * 18 - 80) * 25 == 9250
    assert 15 * F('1.2') * F('0.1') == F('1.8') and 36 * F('0.3') * F('0.8') == F('8.64')
    assert 2 * 10 * 5 * 12 == 1200
    assert 8000 / (1600 * F('0.25')) == 20
    assert 2 * F('1.5') * F('0.3') * F('1.5') == F('1.35')
    assert int(F('10.05') / F('2.5')) == 4 and ceil(F('4.5') / F('0.53')) == 9 and ceil(F(9, 4)) == 3


Q.verify(check)
Q.save()
