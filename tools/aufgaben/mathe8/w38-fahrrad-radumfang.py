#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 38 / KW 24 (Wahlpflichtbereich 1 Das Fahrrad):
Kenndaten, Zoll, Reifengröße, Radumfang, Weg und Zeit. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=38, slug='fahrrad-radumfang', thema='Das Fahrrad: Kenndaten und Radumfang', lb='WB 1',
        blurb='Zoll und Zentimeter, Reifenbezeichnung, Radumfang, Umdrehungen, Tempo, Kosten pro Kilometer',
        comment='Blocks: inch and tyre sizes (1-2, 7-8, 12, 14), wheel circumference and revolutions (3-6, 11, 15-16), frame size (9-10), speed, costs and CO2 (13, 17-20). 1 inch = 2.54 cm; tyre code after the ETRTO standard.')

# --------------------------------------------------------------- Zoll ----
Q.q(r'Ein Zoll sind 2,54 cm. Wie viel Zentimeter sind 28 Zoll?',
    [r'71,12 cm', r'11,02 cm', r'30,54 cm', r'7,11 cm'],
    [r'$28 \cdot 2{,}54 = 71{,}12$ cm'])

Q.q(r'Wie viel Zentimeter sind 26 Zoll?',
    [r'66,04 cm', r'10,24 cm', r'28,54 cm', r'62,6 cm'],
    [r'$26 \cdot 2{,}54 = 66{,}04$ cm'])

# ---------------------------------------------------------- Radumfang ----
Q.q(r'Ein Rad hat 71,12 cm Durchmesser (28 Zoll). Wie groß ist sein Umfang (gerundet)?',
    [r'223,4 cm', r'111,7 cm', r'446,9 cm', r'142,2 cm'],
    [r'$u = \pi \cdot d = \pi \cdot 71{,}12$',
     r'$u \approx 223{,}4$ cm'])

Q.q(r'Welchen Weg legt ein Fahrrad bei einer Umdrehung des Rades zurück?',
    [r'den Radumfang', r'den Raddurchmesser', r'den Radius', r'die Hälfte des Umfangs'],
    [r'Beim Rollen ohne Rutschen wird der ganze Umfang einmal auf der Straße abgewickelt.'])

Q.q(r'Das Rad mit etwa 2,234 m Umfang dreht sich 1000-mal. Wie weit ist das Fahrrad gefahren (gerundet)?',
    [r'2,23 km', r'22,3 km', r'223 m', r'0,71 km'],
    [r'$1000 \cdot 2{,}234 = 2234$ m',
     r'2234 m $\approx 2{,}23$ km'])

Q.q(r'Ein 26-Zoll-Rad (66,04 cm Durchmesser) fährt 1 km. Wie viele Umdrehungen macht es ungefähr?',
    [r'etwa 482', r'etwa 1514', r'etwa 207', r'etwa 4820'],
    [r'Umfang: $\pi \cdot 66{,}04 \approx 207{,}5$ cm $\approx 2{,}075$ m',
     r'$1000 : 2{,}075 \approx 482$'])

Q.q(r'Auf einem Reifen steht „37-622“. Was bedeuten die Zahlen?',
    [r'37 mm Reifenbreite und 622 mm Felgendurchmesser', r'37 cm Breite und 622 cm Umfang',
     r'37 Zoll und 622 Gramm', r'37 bar und 622 kg Traglast'],
    [r'Die Angabe folgt der europäischen Norm (ETRTO): erst die Reifenbreite, dann der Durchmesser der Felge, jeweils in Millimetern.'])

Q.q(r'Ein Reifen 37-622 sitzt auf einer Felge mit 622 mm Durchmesser und ist etwa 37 mm hoch. Wie groß ist der Raddurchmesser ungefähr?',
    [r'696 mm', r'659 mm', r'622 mm', r'733 mm'],
    [r'Der Reifen liegt oben und unten auf der Felge: zweimal 37 mm.',
     r'$622 + 2 \cdot 37 = 696$ mm'])

# ---------------------------------------------------------- Rahmenhöhe ----
Q.q(r'Eine verbreitete Faustregel für Trekkingräder lautet: Rahmenhöhe = Schrittlänge mal 0,66. Welche Rahmenhöhe passt bei 80 cm Schrittlänge?',
    [r'etwa 53 cm', r'etwa 66 cm', r'etwa 121 cm', r'etwa 80 cm'],
    [r'$80 \cdot 0{,}66 = 52{,}8$ cm',
     r'Also etwa 53 cm.'])

Q.q(r'Die Rahmenhöhe wird oft auch in Zoll angegeben. Wie viel Zoll sind 53 cm (gerundet)?',
    [r'etwa 21 Zoll', r'etwa 135 Zoll', r'etwa 26 Zoll', r'etwa 18 Zoll'],
    [r'$53 : 2{,}54 \approx 20{,}9$',
     r'Also etwa 21 Zoll.'])

Q.q(r'Ein Fahrradtacho ist auf 2100 mm Radumfang eingestellt, das Rad hat aber 2200 mm. Tatsächlich werden 44 km gefahren. Was zeigt der Tacho an?',
    [r'42 km', r'46 km', r'44 km', r'40 km'],
    [r'Der Tacho zählt Umdrehungen: $44\,000 : 2{,}2 = 20\,000$.',
     r'Er rechnet mit 2,1 m: $20\,000 \cdot 2{,}1 = 42\,000$ m = 42 km, also zu wenig.'])

Q.q(r'Ein Mountainbike-Reifen ist 2,1 Zoll breit. Wie viel Zentimeter sind das (gerundet)?',
    [r'5,3 cm', r'0,8 cm', r'4,6 cm', r'21 cm'],
    [r'$2{,}1 \cdot 2{,}54 \approx 5{,}33$ cm'])

Q.q(r'Ein E-Bike wiegt 25 kg, ein Rennrad 8 kg. Um wie viel Prozent ist das E-Bike schwerer?',
    [r'um 212,5 %', r'um 68 %', r'um 17 %', r'um 312,5 %'],
    [r'Unterschied: $25 - 8 = 17$ kg',
     r'Bezogen auf das Rennrad: $17 : 8 = 2{,}125 = 212{,}5$ %'])

Q.q(r'Ein Reifen soll mit 4 bar aufgepumpt werden, die Pumpe zeigt psi an (1 bar entspricht etwa 14,5 psi). Welcher Wert ist richtig?',
    [r'etwa 58 psi', r'etwa 3,6 psi', r'etwa 18,5 psi', r'etwa 0,28 psi'],
    [r'$4 \cdot 14{,}5 = 58$ psi'])

Q.q(r'Ein 20-Zoll-Rad hat 50,8 cm Durchmesser. Wie groß ist sein Umfang (gerundet)?',
    [r'159,6 cm', r'79,8 cm', r'101,6 cm', r'2026,8 cm'],
    [r'$u = \pi \cdot 50{,}8 \approx 159{,}6$ cm'])

Q.q(r'Der Schulweg ist 3,5 km lang. Wie oft dreht sich ein Rad mit 2,234 m Umfang dabei ungefähr?',
    [r'etwa 1567-mal', r'etwa 7819-mal', r'etwa 157-mal', r'etwa 638-mal'],
    [r'3,5 km = 3500 m',
     r'$3500 : 2{,}234 \approx 1567$'])

# ------------------------------------------------- Tempo, Kosten, Umwelt ----
Q.q(r'Eine Radtour von 18 km dauert 50 Minuten. Wie groß ist die Durchschnittsgeschwindigkeit?',
    [r'21,6 km/h', r'0,36 km/h', r'18 km/h', r'36 km/h'],
    [r'50 min $= \dfrac{50}{60}$ h',
     r'$v = 18 : \dfrac{5}{6} = 18 \cdot \dfrac{6}{5} = 21{,}6$ km/h'])

Q.q(r'Wie lange braucht man für 12 km bei 16 km/h?',
    [r'45 Minuten', r'75 Minuten', r'1 Stunde 20 Minuten', r'4 Minuten'],
    [r'$t = \dfrac{12}{16} = 0{,}75$ h',
     r'0,75 h = 45 Minuten'])

Q.q(r'Ein Fahrrad kostet 900 € und hält 5 Jahre. Pro Jahr fährt man 2000 km und zahlt 80 € für die Wartung. Was kostet ein Kilometer?',
    [r'0,13 €', r'0,09 €', r'0,45 €', r'1,30 €'],
    [r'Gesamtkosten: $900 + 5 \cdot 80 = 1300$ €',
     r'Gesamtstrecke: $5 \cdot 2000 = 10\,000$ km',
     r'$1300 : 10\,000 = 0{,}13$ € pro km'])

Q.q(r'Ein Auto stößt etwa 150 g CO₂ pro km aus. Wer an 200 Tagen den Schulweg von 8 km hin und zurück mit dem Rad fährt, spart wie viel CO₂?',
    [r'480 kg', r'240 kg', r'48 kg', r'4,8 t'],
    [r'Strecke: $2 \cdot 8 \cdot 200 = 3200$ km',
     r'$3200 \cdot 150 = 480\,000$ g = 480 kg'])


def check():
    from fractions import Fraction as F
    from math import pi
    assert 28 * F('2.54') == F('71.12') and 26 * F('2.54') == F('66.04')
    assert round(pi * 71.12, 1) == 223.4 and round(1000 * 2.234 / 1000, 2) == 2.23
    assert round(1000 / (pi * 0.6604)) == 482
    assert 622 + 2 * 37 == 696
    assert 80 * F('0.66') == F('52.8') and round(53 / 2.54, 1) == 20.9
    assert F(44000, F('2.2')) * F('2.1') == 42000
    assert round(2.1 * 2.54, 2) == 5.33
    assert F(25 - 8, 8) == F('2.125')
    assert 4 * F('14.5') == 58
    assert round(pi * 50.8, 1) == 159.6 and round(3500 / 2.234) == 1567
    assert 18 / F(50, 60) == F('21.6') and F(12, 16) * 60 == 45
    assert F(900 + 5 * 80, 5 * 2000) == F('0.13')
    assert 2 * 8 * 200 * 150 == 480000


Q.verify(check)
Q.save()
