#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 14 / KW 49 (LB 2): rule of three for direct and inverse
proportionality, step via the unit, choosing the right method. Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os6

Q = os6(nr=14, slug='dreisatz', thema='Der Dreisatz', lb='LB 2',
        blurb='Dreisatz bei direkter und indirekter Proportionalität, Schluss über die Einheit',
        comment='Blocks: direct rule of three (1-2, 5, 9-11, 16-17, 19), inverse (3-4, 6, 12, 14, 18), method (7-8, 13, 15, 20).')

# ------------------------------------------------------------------- direct ----
Q.q(r'3 Hefte kosten 2,40 €. Was kosten 7 Hefte?',
    [r'5,60 €', r'4,80 €', r'6,40 €', r'16,80 €'],
    [r'3 Hefte → 2,40 €',
     r'1 Heft → $2{,}40 : 3 = 0{,}80$ €',
     r'7 Hefte → $7 \cdot 0{,}80 = 5{,}60$ €'])

Q.q(r'5 kg Kartoffeln kosten 4,50 €. Was kosten 2 kg?',
    [r'1,80 €', r'2,25 €', r'1,50 €', r'9,00 €'],
    [r'5 kg → 4,50 €',
     r'1 kg → $4{,}50 : 5 = 0{,}90$ €',
     r'2 kg → $2 \cdot 0{,}90 = 1{,}80$ €'])

Q.q(r'Ein Auto braucht auf 100 km 7 Liter Benzin. Wie viel braucht es für 350 km?',
    [r'24,5 Liter', r'21 Liter', r'35 Liter', r'2 Liter'],
    [r'100 km → 7 Liter',
     r'50 km → 3,5 Liter (die Hälfte)',
     r'350 km sind 3-mal 100 km plus 50 km: $21 + 3{,}5 = 24{,}5$ Liter'])

Q.q(r'Für 4 Portionen Pfannkuchen braucht man 250 g Mehl. Wie viel Mehl braucht man für 10 Portionen?',
    [r'625 g', r'500 g', r'1000 g', r'260 g'],
    [r'4 Portionen → 250 g',
     r'2 Portionen → 125 g',
     r'10 Portionen → $5 \cdot 125 = 625$ g'])

Q.q(r'12 Pakete Kopierpapier wiegen zusammen 30 kg. Wie viel wiegen 5 Pakete?',
    [r'12,5 kg', r'15 kg', r'10 kg', r'72 kg'],
    [r'12 Pakete → 30 kg',
     r'1 Paket → $30 : 12 = 2{,}5$ kg',
     r'5 Pakete → $5 \cdot 2{,}5 = 12{,}5$ kg'])

Q.q(r'Ein Wasserhahn füllt einen 10-Liter-Eimer in 40 Sekunden. Wie lange braucht er für 25 Liter?',
    [r'100 Sekunden', r'80 Sekunden', r'16 Sekunden', r'65 Sekunden'],
    [r'10 Liter → 40 s',
     r'1 Liter → 4 s',
     r'25 Liter → $25 \cdot 4 = 100$ s, also 1 Minute und 40 Sekunden'])

Q.q(r'6 Kugeln Eis kosten 7,20 €. Was kosten 9 Kugeln?',
    [r'10,80 €', r'10,20 €', r'12,00 €', r'4,80 €'],
    [r'Ohne Einheit geht es auch: 9 ist das 1,5-Fache von 6.',
     r'$1{,}5 \cdot 7{,}20 = 10{,}80$ €',
     r'Mit Einheit: eine Kugel kostet 1,20 €, $9 \cdot 1{,}20 = 10{,}80$ €.'])

Q.q(r'Angenommen, 1 € entspricht 1,10 US-Dollar. Wie viele Dollar bekommt man für 50 €?',
    [r'55 Dollar', r'45,45 Dollar', r'51,10 Dollar', r'5,50 Dollar'],
    [r'1 € → 1,10 Dollar',
     r'50 € → $50 \cdot 1{,}10$ Dollar',
     r'$= 55$ Dollar'])

Q.q(r'Ein Drucker druckt 45 Seiten in 3 Minuten. Wie viele Seiten schafft er in 2 Minuten?',
    [r'30', r'15', r'90', r'44'],
    [r'3 Minuten → 45 Seiten',
     r'1 Minute → 15 Seiten',
     r'2 Minuten → 30 Seiten'])

# ------------------------------------------------------------------ inverse ----
Q.q(r'Ein Vorrat reicht für 6 Personen 8 Tage. Wie lange reicht er für 4 Personen?',
    [r'12 Tage', r'5,3 Tage', r'6 Tage', r'10 Tage'],
    [r'Weniger Personen, längere Zeit: indirekt proportional.',
     r'1 Person → $6 \cdot 8 = 48$ Tage',
     r'4 Personen → $48 : 4 = 12$ Tage'])

Q.q(r'3 Bagger brauchen für eine Baugrube 12 Tage. Wie lange brauchen 4 gleiche Bagger?',
    [r'9 Tage', r'16 Tage', r'11 Tage', r'3 Tage'],
    [r'Mehr Bagger, weniger Zeit: indirekt.',
     r'1 Bagger → $3 \cdot 12 = 36$ Tage',
     r'4 Bagger → $36 : 4 = 9$ Tage'])

Q.q(r'Mit 80 km/h dauert eine Fahrt 3 Stunden. Wie lange dauert sie mit 120 km/h?',
    [r'2 Stunden', r'4,5 Stunden', r'2,5 Stunden', r'1,5 Stunden'],
    [r'Schneller fahren heißt kürzer fahren: indirekt.',
     r'Die Strecke ist $80 \cdot 3 = 240$ km.',
     r'$240 : 120 = 2$ Stunden'])

Q.q(r'Ein Kuchen wird in 12 Stücke zu je 80 g geteilt. Wie schwer ist ein Stück, wenn man ihn in 16 gleich große Stücke teilt?',
    [r'60 g', r'107 g', r'64 g', r'100 g'],
    [r'Der ganze Kuchen wiegt $12 \cdot 80 = 960$ g.',
     r'Mehr Stücke, kleinere Stücke: indirekt.',
     r'$960 : 16 = 60$ g'])

Q.q(r'Eine Wanderung besteht aus 15 Etappen zu je 8 km. Wie lang wäre jede Etappe, wenn man den gleichen Weg in 12 gleich lange Etappen teilt?',
    [r'10 km', r'6,4 km', r'9 km', r'12 km'],
    [r'Gesamter Weg: $15 \cdot 8 = 120$ km',
     r'Weniger Etappen, längere Etappen.',
     r'$120 : 12 = 10$ km'])

Q.q(r'24 Stühle stehen in 4 Reihen zu je 6 Stühlen. Wie viele Stühle stehen in jeder Reihe, wenn man sie in 3 gleich lange Reihen stellt?',
    [r'8', r'4,5', r'7', r'9'],
    [r'Die Anzahl der Stühle bleibt 24.',
     r'$24 : 3 = 8$',
     r'Weniger Reihen, mehr Stühle pro Reihe.'])

Q.q(r'2 Personen mähen einen Rasen in 90 Minuten. Wie lange brauchen 3 Personen, wenn alle gleich schnell arbeiten?',
    [r'60 Minuten', r'135 Minuten', r'45 Minuten', r'30 Minuten'],
    [r'Mehr Personen, weniger Zeit: indirekt.',
     r'1 Person → $2 \cdot 90 = 180$ Minuten',
     r'3 Personen → $180 : 3 = 60$ Minuten, also eine Stunde'])

# ------------------------------------------------------------------- method ----
Q.q(r'4 Brötchen kosten 1,60 €. Was rechnet man beim Dreisatz im zweiten Schritt?',
    [r'den Preis für 1 Brötchen: $1{,}60 : 4 = 0{,}40$ €', r'den Preis für 8 Brötchen: $1{,}60 \cdot 2$',
     r'$1{,}60 + 4$', r'$4 : 1{,}60$'],
    [r'Schritt 1: Was ist gegeben? 4 Brötchen → 1,60 €',
     r'Schritt 2: Schluss auf die Einheit, also auf 1 Brötchen.',
     r'Schritt 3: Schluss auf die gesuchte Anzahl.'])

Q.q(r'8 Personen schaffen eine Arbeit in 3 Stunden. Welcher Zwischenschritt ist beim Dreisatz richtig?',
    [r'1 Person bräuchte $8 \cdot 3 = 24$ Stunden.', r'1 Person bräuchte $3 : 8$ Stunden.',
     r'1 Person bräuchte $8 : 3$ Stunden.', r'1 Person bräuchte 3 Stunden.'],
    [r'Indirekt: Eine Person allein braucht länger, nicht kürzer.',
     r'Deshalb wird malgenommen: $8 \cdot 3 = 24$ Stunden.',
     r'Danach teilt man durch die neue Anzahl der Personen.'])

Q.q(r'Welche Aufgabe löst man mit dem indirekten Dreisatz?',
    [r'Wie lange reicht das Futter, wenn statt 5 Pferden nur 4 Pferde gefüttert werden?',
     r'Was kosten 8 Äpfel, wenn 3 Äpfel 1,20 € kosten?', r'Wie weit fährt ein Zug in 4 Stunden, wenn er 2 Stunden für 300 km braucht?',
     r'Wie viel wiegen 6 Bücher, wenn 2 Bücher 900 g wiegen?'],
    [r'Äpfel, Zug und Bücher: doppelt so viel, doppelt so viel – direkt.',
     r'Beim Futter gilt: weniger Pferde, längere Zeit.',
     r'Das ist indirekt proportional.'])

Q.q(r'Ben rechnet: „3 Pumpen brauchen 8 Stunden, also brauchen 6 Pumpen 16 Stunden.“ Was stimmt?',
    [r'Ben hat direkt statt indirekt gerechnet; richtig sind 4 Stunden.', r'Ben hat recht.',
     r'Richtig wären 11 Stunden.', r'Richtig wären 8 Stunden.'],
    [r'Doppelt so viele Pumpen schaffen die Arbeit in der halben Zeit.',
     r'Ben hat die Zeit verdoppelt – das wäre direkt proportional.',
     r'Richtig: $8 : 2 = 4$ Stunden.'])


def check():
    assert D('2.40') / 3 * 7 == D('5.60')
    assert D('4.50') / 5 * 2 == D('1.80')
    assert F(7, 100) * 350 == F('24.5')
    assert F(250, 4) * 10 == 625
    assert F(30, 12) * 5 == F('12.5')
    assert F(40, 10) * 25 == 100
    assert D('7.20') / 6 * 9 == D('10.80') == D('1.5') * D('7.20')
    assert 50 * D('1.10') == 55
    assert F(45, 3) * 2 == 30
    assert 6 * 8 / 4 == 12
    assert 3 * 12 / 4 == 9
    assert 80 * 3 / 120 == 2
    assert 12 * 80 / 16 == 60
    assert 15 * 8 / 12 == 10
    assert 4 * 6 / 3 == 8
    assert 2 * 90 / 3 == 60
    assert D('1.60') / 4 == D('0.40')
    assert 8 * 3 == 24
    assert 3 * 8 / 6 == 4


Q.verify(check)
Q.save()
