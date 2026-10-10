#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 16 / KW 51: mixed preparation for Klassenarbeit 2
(LB 2 Zuordnungen und Dreisatz). Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os6
from osfig import pfeildiagramm, graph

Q = os6(nr=16, slug='ka2', thema='Klassenarbeit 2: Zuordnungen und Dreisatz', lb='KA 2',
        blurb='gemischte Aufgaben zu LB 2 zur Vorbereitung auf die Klassenarbeit',
        comment='Blocks: kinds of assignments (1-3), graphs (4-5, 20), tables and equations (6-9), rule of three (10-13, 16-19), not proportional and accuracy (14-15).')

EIN, EINEIN, MEHR = r'eindeutig, aber nicht eineindeutig', r'eineindeutig', r'mehrdeutig'
DIR, IND, NICHT = r'direkt proportional', r'indirekt proportional', r'nicht proportional'
AKKU = [(0, 100), (2, 80), (4, 60), (6, 40), (8, 20)]
fig_akku = graph(AKKU, (0, 10), (0, 100), 1, 10, 'h', '%', dots=False, label='Akkuladung')
cap_akku = r'Ladung eines Tablet-Akkus (Zeit in Stunden → Ladung in Prozent)'

Q.q(r'Welche Art von Zuordnung ist „Person in der Schule → ihre Klassenlehrkraft“?',
    [EIN, EINEIN, MEHR, r'gar keine Zuordnung'],
    [r'Jede Person hat genau eine Klassenlehrkraft: eindeutig.',
     r'Eine Klassenlehrkraft gehört aber zu vielen Personen der Klasse.',
     r'Also nicht eineindeutig.'])

Q.q(r'Welche Art von Zuordnung ist „natürliche Zahl → ihre Vielfachen“?',
    [MEHR, EIN, EINEIN, r'gar keine Zuordnung'],
    [r'Die 3 hat die Vielfachen 3, 6, 9, 12 …',
     r'Einer Zahl werden viele Zahlen zugeordnet.',
     r'Also mehrdeutig.'])

Q.q(r'Welche Art von Zuordnung zeigt die Pfeildarstellung?',
    [EINEIN, EIN, MEHR, r'gar keine Zuordnung'],
    [r'Von jedem Element links geht genau ein Pfeil aus.',
     r'Bei jedem Element rechts kommt genau ein Pfeil an.',
     r'Also eineindeutig.'],
    fig=pfeildiagramm(['Mia', 'Ole', 'Eda'], ['Platz 1', 'Platz 2', 'Platz 3'], [(0, 1), (1, 2), (2, 0)],
                      titles=('Person', 'Sitzplatz')),
    figcap=r'Person → Sitzplatz')

Q.q(r'Nach wie vielen Stunden ist der Akku halb voll?',
    [r'nach 5 Stunden', r'nach 4 Stunden', r'nach 6 Stunden', r'nach 2 Stunden'],
    [r'Halb voll heißt: 50 % Ladung.',
     r'Auf der Hochachse 50 suchen, waagerecht bis zum Graphen, dann nach unten.',
     r'Die Ladung sinkt um 10 % pro Stunde: $100 - 5 \cdot 10 = 50$, also nach 5 Stunden.'],
    fig=fig_akku, figcap=cap_akku)

Q.q(r'Um wie viel Prozent sinkt die Ladung in jeder Stunde?',
    [r'um 10 %', r'um 20 %', r'um 5 %', r'um 80 %'],
    [r'In 2 Stunden sinkt die Ladung von 100 % auf 80 %.',
     r'Das sind 20 % in 2 Stunden.',
     r'Also 10 % pro Stunde.'],
    fig=fig_akku, figcap=cap_akku)

Q.q(r'Eine Tabelle: $x$ = 3, 6, 9 und $y$ = 4, 8, 12. Welche Art von Zuordnung liegt vor?',
    [DIR, IND, NICHT, r'gar keine Zuordnung'],
    [r'Quotienten: $4 : 3$, $8 : 6$, $12 : 9$ – alle gleich $\dfrac{4}{3}$.',
     r'Doppeltes $x$, doppeltes $y$.',
     r'Also direkt proportional.'])

Q.q(r'Eine Tabelle: $x$ = 2, 4, 5 und $y$ = 10, 5, 4. Welche Art von Zuordnung liegt vor?',
    [IND, DIR, NICHT, r'gar keine Zuordnung'],
    [r'Produkte: $2 \cdot 10 = 20$, $4 \cdot 5 = 20$, $5 \cdot 4 = 20$',
     r'Produktgleich.',
     r'Also indirekt proportional.'])

Q.q(r'Berechne für $y = 3 \cdot x$ den $y$-Wert zu $x = 2{,}5$.',
    [r'7,5', r'5,5', r'6', r'0,83'],
    [r'Einsetzen: $y = 3 \cdot 2{,}5$',
     r'$= 7{,}5$',
     r'Der Punkt heißt $(2{,}5 \mid 7{,}5)$.'])

Q.q(r'Welcher Punkt liegt auf dem Graphen von $y = 1{,}5 \cdot x$?',
    [r'$(4 \mid 6)$', r'$(6 \mid 4)$', r'$(4 \mid 5{,}5)$', r'$(1{,}5 \mid 1)$'],
    [r'Für $x = 4$: $y = 1{,}5 \cdot 4 = 6$.',
     r'Also liegt $(4 \mid 6)$ darauf.',
     r'Für $(6 \mid 4)$ müsste $y = 9$ sein.'])

Q.q(r'8 m Stoff kosten 36 €. Was kosten 5 m?',
    [r'22,50 €', r'20,00 €', r'57,60 €', r'4,50 €'],
    [r'8 m → 36 €',
     r'1 m → $36 : 8 = 4{,}50$ €',
     r'5 m → $5 \cdot 4{,}50 = 22{,}50$ €'])

Q.q(r'6 gleiche Rohre füllen einen Tank in 10 Stunden. Wie lange dauert es mit 4 Rohren?',
    [r'15 Stunden', r'6,7 Stunden', r'12 Stunden', r'8 Stunden'],
    [r'Weniger Rohre, mehr Zeit: indirekt.',
     r'1 Rohr → $6 \cdot 10 = 60$ Stunden',
     r'4 Rohre → $60 : 4 = 15$ Stunden'])

Q.q(r'2,5 kg Äpfel kosten 4,00 €. Was kosten 4 kg?',
    [r'6,40 €', r'6,50 €', r'10,00 €', r'5,60 €'],
    [r'1 kg → $4{,}00 : 2{,}5 = 1{,}60$ €',
     r'4 kg → $4 \cdot 1{,}60$',
     r'$= 6{,}40$ €'])

Q.q(r'Ein Gewinn wird gerecht verteilt: Bei 9 Personen bekommt jede 40 €. Wie viel bekommt jede bei 12 Personen?',
    [r'30 €', r'53,33 €', r'36 €', r'43 €'],
    [r'Der Gewinn ist $9 \cdot 40 = 360$ €.',
     r'Mehr Personen, weniger für jede.',
     r'$360 : 12 = 30$ €'])

Q.q(r'Im Parkhaus kostet die erste Stunde 2 €, jede weitere Stunde 1 €. Was kosten 4 Stunden?',
    [r'5 €', r'8 €', r'4 €', r'6 €'],
    [r'Erste Stunde: 2 €',
     r'Drei weitere Stunden: $3 \cdot 1 = 3$ €',
     r'Zusammen 5 € – nicht proportional, darum kein Dreisatz.'])

Q.q(r'3 Freunde teilen 10 € gerecht. Was ist sinnvoll?',
    [r'Jeder bekommt 3,33 €, 1 Cent bleibt übrig.', r'Jeder bekommt 3,3333 €.',
     r'Jeder bekommt 3,34 €.', r'Jeder bekommt 3 €.'],
    [r'$10 : 3 = 3{,}333\ldots$',
     r'Auf Cent abrunden: 3,33 €, zusammen 9,99 €.',
     r'Mit 3,34 € bräuchte man 10,02 €.'])

Q.q(r'Für 12 Waffeln braucht man 3 Eier. Wie viele Eier braucht man für 20 Waffeln?',
    [r'5', r'4', r'6', r'11'],
    [r'12 Waffeln → 3 Eier',
     r'4 Waffeln → 1 Ei',
     r'20 Waffeln → $20 : 4 = 5$ Eier'])

Q.q(r'Ein Läufer schafft gleichmäßig 12 km in einer Stunde. Wie weit kommt er in 25 Minuten?',
    [r'5 km', r'3 km', r'4,8 km', r'6 km'],
    [r'60 min → 12 km',
     r'5 min → 1 km',
     r'25 min → 5 km'])

Q.q(r'Eine Zuordnung ist direkt proportional. Zu 4 gehört 10. Was gehört zu 10?',
    [r'25', r'16', r'4', r'40'],
    [r'Faktor: $10 : 4 = 2{,}5$',
     r'$10 \cdot 2{,}5 = 25$',
     r'Probe: $25 : 10 = 2{,}5$.'])

Q.q(r'Eine Zuordnung ist indirekt proportional. Zu 4 gehört 15. Was gehört zu 6?',
    [r'10', r'22,5', r'17', r'13'],
    [r'Das Produkt ist $4 \cdot 15 = 60$.',
     r'$60 : 6 = 10$',
     r'Probe: $6 \cdot 10 = 60$.'])

Q.q(r'Ist die Zuordnung im Bild direkt proportional?',
    [r'Nein, der Graph ist zwar eine Gerade, geht aber nicht durch den Ursprung.', r'Ja, der Graph ist eine Gerade.',
     r'Ja, weil der Graph steigt.', r'Nein, sie ist indirekt proportional.'],
    [r'Zu $x = 0$ gehört $y = 3$, nicht 0.',
     r'Zu 1 gehört 5, zu 2 gehört 7 – nicht das Doppelte.',
     r'Die Zuordnung ist nicht proportional (wie beim Taxi mit Grundgebühr).'],
    fig=graph([(0, 3), (1, 5), (2, 7), (3, 9), (4, 11)], (0, 5), (0, 12), 1, 2, 'x', 'y', label='steigende Gerade'),
    figcap=r'Graph einer Zuordnung')


def check():
    rate = F(AKKU[0][1] - AKKU[1][1], AKKU[1][0])
    assert rate == 10 and all(y == 100 - rate * x for x, y in AKKU) and (100 - 50) / rate == 5
    assert {F(y, x) for x, y in ((3, 4), (6, 8), (9, 12))} == {F(4, 3)}
    assert {x * y for x, y in ((2, 10), (4, 5), (5, 4))} == {20}
    assert 3 * D('2.5') == D('7.5')
    assert D('1.5') * 4 == 6 and D('1.5') * 6 == 9
    assert D(36) / 8 * 5 == D('22.50')
    assert 6 * 10 / 4 == 15
    assert D('4.00') / D('2.5') * 4 == D('6.40')
    assert 9 * 40 / 12 == 30
    assert 2 + 3 * 1 == 5
    assert 3 * D('3.33') == D('9.99') and 3 * D('3.34') == D('10.02')
    assert F(3, 12) * 20 == 5
    assert F(12, 60) * 25 == 5
    assert F(10, 4) * 10 == 25
    assert 4 * 15 / 6 == 10
    assert [2 * x + 3 for x in range(5)] == [3, 5, 7, 9, 11]


Q.verify(check)
Q.save()
