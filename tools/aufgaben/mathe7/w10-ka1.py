#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 10 / KW 45: mixed preparation for Klassenarbeit 1
(LB 1 Prozent- und Zinsrechnung). Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os7

Q = os7(nr=10, slug='ka1', thema='Klassenarbeit 1: Prozent- und Zinsrechnung', lb='KA 1',
        blurb='gemischte Aufgaben zu LB 1 zur Vorbereitung auf die Klassenarbeit',
        comment='Blocks: notation (1-2, 18), basic problems (3-6, 19-20), pie chart (7-8), price changes (9-13), interest (14-17).')

Q.q(r'Schreibe 35 % als Dezimalzahl.',
    [r'0,35', r'3,5', r'0,035', r'35,0'],
    [r'35 % sind 35 Hundertstel.',
     r'$\dfrac{35}{100}$',
     r'= 0,35'])

Q.q(r'Wie viel Prozent sind $\dfrac{3}{4}$?',
    [r'75 %', r'34 %', r'43 %', r'25 %'],
    [r'$\dfrac{3}{4} = \dfrac{75}{100}$',
     r'Hundertstel sind Prozent.',
     r'= 75 %'])

Q.q(r'Berechne 20 % von 85 €.',
    [r'17 €', r'4,25 €', r'65 €', r'20 €'],
    [r'20 % ist ein Fünftel.',
     r'$85 : 5$',
     r'= 17 €'])

Q.q(r'Berechne 6 % von 250 kg.',
    [r'15 kg', r'1,5 kg', r'41,7 kg', r'25 kg'],
    [r'1 % von 250 kg sind 2,5 kg.',
     r'$6 \cdot 2{,}5$',
     r'= 15 kg'])

Q.q(r'Wie viel Prozent sind 27 von 90?',
    [r'30 %', r'27 %', r'63 %', r'3 %'],
    [r'$\dfrac{27}{90}$, mit 9 kürzen: $\dfrac{3}{10}$',
     r'$\dfrac{3}{10} = \dfrac{30}{100}$',
     r'= 30 %'])

Q.q(r'40 % sind 28 Personen. Wie viele Personen sind 100 %?',
    [r'70', r'11,2', r'112', r'68'],
    [r'40 % → 28',
     r'10 % → 7',
     r'100 % → 70'])

Q.q(r'Welcher Winkel gehört im Kreisdiagramm zu 45 %?',
    [r'162°', r'45°', r'135°', r'180°'],
    [r'1 % entspricht 3,6°.',
     r'$45 \cdot 3{,}6°$',
     r'$= 162°$'])

Q.q(r'Ein Sektor im Kreisdiagramm hat 108°. Wie viel Prozent sind das?',
    [r'30 %', r'10,8 %', r'108 %', r'36 %'],
    [r'$108 : 3{,}6$',
     r'$= 30$',
     r'Also 30 %.'])

Q.q(r'Eine Tasche für 60 € wird um 15 % reduziert. Was kostet sie jetzt?',
    [r'51 €', r'45 €', r'9 €', r'69 €'],
    [r'Neuer Preis: 85 % des alten.',
     r'$60 \cdot 0{,}85$',
     r'= 51 €'])

Q.q(r'Ein Preis von 75 € steigt um 8 %. Wie hoch ist der neue Preis?',
    [r'81 €', r'83 €', r'6 €', r'69 €'],
    [r'8 % von 75 € sind 6 €.',
     r'$75 + 6$',
     r'= 81 €'])

Q.q(r'Ein Preis von 238 € enthält 19 % Mehrwertsteuer. Wie hoch ist der Nettopreis?',
    [r'200 €', r'192,78 €', r'219 €', r'45,22 €'],
    [r'238 € sind 119 % des Nettopreises.',
     r'$238 : 1{,}19$',
     r'= 200 €'])

Q.q(r'Nach 25 % Rabatt kostet ein Spiel 45 €. Was kostete es vorher?',
    [r'60 €', r'56,25 €', r'33,75 €', r'70 €'],
    [r'45 € sind 75 % des alten Preises.',
     r'25 % → 15 €',
     r'100 % → 60 €'])

Q.q(r'Ein Preis sinkt von 120 € auf 90 €. Um wie viel Prozent?',
    [r'25 %', r'30 %', r'33,3 %', r'75 %'],
    [r'Senkung: 30 €.',
     r'$\dfrac{30}{120} = \dfrac{1}{4}$',
     r'= 25 %'])

Q.q(r'Was bedeutet es, wenn ein Preis mit 0,85 malgenommen wird?',
    [r'Er wird um 15 % gesenkt.', r'Er wird um 85 % gesenkt.', r'Er steigt um 85 %.', r'Er steigt um 15 %.'],
    [r'0,85 = 85 %',
     r'Der neue Preis ist 85 % des alten.',
     r'Es fehlen 15 %: eine Senkung um 15 %.'])

Q.q(r'2400 € werden ein Jahr lang zu 1,5 % angelegt. Wie viele Zinsen gibt es?',
    [r'36 €', r'24 €', r'360 €', r'16 €'],
    [r'1 % von 2400 € sind 24 €.',
     r'$1{,}5 \cdot 24$',
     r'= 36 €'])

Q.q(r'1200 € werden 4 Monate lang zu 3 % angelegt. Wie viele Zinsen gibt es?',
    [r'12 €', r'36 €', r'144 €', r'9 €'],
    [r'Jahreszinsen: 3 % von 1200 € = 36 €.',
     r'4 Monate sind $\dfrac{4}{12} = \dfrac{1}{3}$ Jahr.',
     r'$36 : 3 = 12$ €'])

Q.q(r'750 € bringen in einem Jahr 22,50 € Zinsen. Wie hoch ist der Zinssatz?',
    [r'3 %', r'2,25 %', r'22,5 %', r'7,5 %'],
    [r'Zinssatz = Zinsen : Kapital',
     r'$22{,}50 : 750 = 0{,}03$',
     r'= 3 %'])

Q.q(r'5000 € werden 2 Jahre zu 2 % mit Zinseszins angelegt. Wie viel ist danach auf dem Konto?',
    [r'5202 €', r'5200 €', r'5100 €', r'5204 €'],
    [r'Nach 1 Jahr: $5000 \cdot 1{,}02 = 5100$ €',
     r'Nach 2 Jahren: $5100 \cdot 1{,}02 = 5202$ €',
     r'Ohne Zinseszins wären es 5200 €.'])

Q.q(r'Gegeben sind Prozentsatz und Prozentwert. Was wird gesucht?',
    [r'der Grundwert', r'der Prozentsatz', r'der Prozentwert', r'nichts, alles ist bekannt'],
    [r'Die drei Größen sind $G$, $W$ und $p\,\%$.',
     r'Bekannt: $W$ und $p\,\%$.',
     r'Gesucht: $G = W : p\,\%$.'])

Q.q(r'Rechne im Kopf: 12,5 % von 64 €.',
    [r'8 €', r'12,50 €', r'5,12 €', r'16 €'],
    [r'12,5 % ist ein Achtel.',
     r'$64 : 8$',
     r'= 8 €'])


def check():
    assert F(35, 100) == F('0.35') and F(3, 4) == F(75, 100)
    assert 85 * F(20, 100) == 17 and 250 * F(6, 100) == 15 and F(27, 90) == F(30, 100) and 28 / F(40, 100) == 70
    assert 45 * F('3.6') == 162 and F(108) / F('3.6') == 30
    assert 60 * D('0.85') == 51 and 75 * D('1.08') == 81 and D(238) / D('1.19') == 200
    assert D(45) / D('0.75') == 60 and F(120 - 90, 120) == F(1, 4) and 1 - D('0.85') == D('0.15')
    assert 2400 * D('1.5') / 100 == 36 and D(1200) * 3 / 100 * 4 / 12 == 12 and D('22.50') / 750 == D('0.03')
    assert 5000 * D('1.02') * D('1.02') == 5202
    assert 64 * F('12.5') / 100 == 8


Q.verify(check)
Q.save()
