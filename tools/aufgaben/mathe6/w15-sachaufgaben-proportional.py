#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 15 / KW 50 (LB 2): word problems with direct and inverse
proportionality - shopping, recipes, work, travel time, sensible accuracy. Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os6

Q = os6(nr=15, slug='sachaufgaben-proportional', thema='Sachaufgaben mit Proportionalitäten', lb='LB 2',
        blurb='Einkauf, Rezepte, Arbeitszeit, Fahrzeit, erst prüfen, dann rechnen',
        comment='Blocks: shopping and money (1, 5-6, 10, 15-16, 19), recipes and mixtures (2, 17), time and work (3-4, 8, 12-13, 20), everyday measures (7, 9, 11, 14, 18).')

Q.q(r'Packung A: 500 g Nudeln für 2,40 €. Packung B: 750 g für 3,30 €. Welche Packung ist günstiger?',
    [r'B, sie kostet 4,40 € pro kg.', r'A, sie kostet 4,80 € pro kg.', r'Beide kosten gleich viel pro kg.', r'A, weil sie insgesamt billiger ist.'],
    [r'Auf 1 kg umrechnen. A: 500 g → 2,40 €, also 1 kg → 4,80 €.',
     r'B: 750 g → 3,30 €, 250 g → 1,10 €, also 1 kg → 4,40 €.',
     r'B ist pro Kilogramm günstiger.'])

Q.q(r'Ein Rezept für 6 Personen braucht 450 ml Milch. Wie viel Milch braucht man für 4 Personen?',
    [r'300 ml', r'675 ml', r'350 ml', r'250 ml'],
    [r'6 Personen → 450 ml',
     r'1 Person → $450 : 6 = 75$ ml',
     r'4 Personen → $4 \cdot 75 = 300$ ml'])

Q.q(r'5 Maler streichen eine Schule in 6 Tagen. Wie lange brauchen 3 Maler bei gleichem Tempo?',
    [r'10 Tage', r'3,6 Tage', r'8 Tage', r'4 Tage'],
    [r'Weniger Maler, mehr Tage: indirekt proportional.',
     r'1 Maler → $5 \cdot 6 = 30$ Tage',
     r'3 Maler → $30 : 3 = 10$ Tage'])

Q.q(r'Ein Zug fährt 90 km in 45 Minuten. Wie lange braucht er bei gleichem Tempo für 150 km?',
    [r'75 Minuten', r'60 Minuten', r'105 Minuten', r'90 Minuten'],
    [r'90 km → 45 min, also 2 km in jeder Minute.',
     r'150 km → $150 : 2 = 75$ min',
     r'Das ist 1 Stunde und 15 Minuten.'])

Q.q(r'250 g Butter kosten 2,29 €, eine 1-kg-Packung kostet 7,99 €. Kann man den Preis der großen Packung mit dem Dreisatz aus dem kleinen Preis ausrechnen?',
    [r'Nein, Preis und Menge sind hier nicht proportional.', r'Ja, 1 kg muss genau 9,16 € kosten.',
     r'Ja, Preise sind immer proportional.', r'Nein, weil Butter keine Einheit hat.'],
    [r'Mit Dreisatz käme heraus: $4 \cdot 2{,}29 = 9{,}16$ €.',
     r'Tatsächlich kostet die große Packung nur 7,99 €.',
     r'Großpackungen sind oft billiger: Vor dem Dreisatz immer prüfen, ob die Zuordnung proportional ist.'])

Q.q(r'7 Personen teilen 100 € gerecht. Was ist ein sinnvolles Ergebnis?',
    [r'Jede bekommt 14,28 €, 4 Cent bleiben übrig.', r'Jede bekommt 14,285714 €.',
     r'Jede bekommt 14,29 €.', r'Jede bekommt 15 €.'],
    [r'$100 : 7 = 14{,}2857\ldots$ – kleiner als ein Cent kann man nicht auszahlen.',
     r'Mit 14,29 € bräuchte man $7 \cdot 14{,}29 = 100{,}03$ € – zu viel.',
     r'Also 14,28 € für jede Person: $7 \cdot 14{,}28 = 99{,}96$ €, 4 Cent bleiben übrig.'])

Q.q(r'Lisa macht auf 3 m genau 4 Schritte. Wie viele Schritte braucht sie für 60 m?',
    [r'80', r'45', r'64', r'240'],
    [r'3 m → 4 Schritte',
     r'60 m sind 20-mal 3 m.',
     r'$20 \cdot 4 = 80$ Schritte'])

Q.q(r'Das Futter reicht für 12 Hühner 15 Tage. Wie lange reicht es für 20 Hühner?',
    [r'9 Tage', r'25 Tage', r'12 Tage', r'7 Tage'],
    [r'Mehr Hühner, weniger Tage: indirekt.',
     r'1 Huhn → $12 \cdot 15 = 180$ Tage',
     r'20 Hühner → $180 : 20 = 9$ Tage'])

Q.q(r'Ein tropfender Wasserhahn verliert 0,5 Liter pro Stunde. Wie viel Wasser ist das in einer Woche?',
    [r'84 Liter', r'3,5 Liter', r'12 Liter', r'168 Liter'],
    [r'Eine Woche hat $7 \cdot 24 = 168$ Stunden.',
     r'$168 \cdot 0{,}5 = 84$',
     r'Das sind 84 Liter – fast eine volle Badewanne.'])

Q.q(r'Ein Auto braucht 6 Liter auf 100 km, ein Liter kostet 1,80 €. Was kostet das Benzin für 250 km?',
    [r'27,00 €', r'15,00 €', r'45,00 €', r'10,80 €'],
    [r'Benzin für 250 km: $2{,}5 \cdot 6 = 15$ Liter',
     r'Kosten: $15 \cdot 1{,}80$',
     r'$= 27{,}00$ €'])

Q.q(r'Für 1 m² Wand braucht man 25 Fliesen. Wie viele Fliesen braucht man für 12 m²?',
    [r'300', r'37', r'250', r'2,08'],
    [r'1 m² → 25 Fliesen',
     r'12 m² → $12 \cdot 25$',
     r'$= 300$ Fliesen'])

Q.q(r'Tom liest jeden Tag 30 Seiten und ist nach 8 Tagen mit dem Buch fertig. Wie viele Tage braucht er bei 40 Seiten am Tag?',
    [r'6 Tage', r'10,7 Tage', r'7 Tage', r'5 Tage'],
    [r'Das Buch hat $8 \cdot 30 = 240$ Seiten.',
     r'Mehr Seiten am Tag, weniger Tage.',
     r'$240 : 40 = 6$ Tage'])

Q.q(r'Ein Bus für die Klassenfahrt kostet 600 €. Bei 24 Personen zahlt jede 25 €. Wie viel zahlt jede, wenn 30 Personen mitfahren?',
    [r'20 €', r'31,25 €', r'25 €', r'18 €'],
    [r'Der Gesamtpreis bleibt 600 €.',
     r'Mehr Personen, kleinerer Anteil: $600 : 30$',
     r'$= 20$ € pro Person'])

Q.q(r'Paula zählt ihren Puls: 18 Schläge in 15 Sekunden. Wie viele Schläge sind das in einer Minute?',
    [r'72', r'60', r'33', r'90'],
    [r'Eine Minute sind 60 Sekunden, also 4-mal 15 Sekunden.',
     r'$4 \cdot 18 = 72$',
     r'Der Puls ist 72 Schläge pro Minute.'])

Q.q(r'Eine Kopie kostet 0,05 €. Für 25 Personen werden je 4 Seiten kopiert. Was kostet das?',
    [r'5,00 €', r'1,25 €', r'0,20 €', r'50,00 €'],
    [r'Anzahl Seiten: $25 \cdot 4 = 100$',
     r'$100 \cdot 0{,}05$',
     r'$= 5{,}00$ €'])

Q.q(r'Beim Rasenmähen verdient Jonas 12,50 € pro Stunde. Wie viel verdient er in 6,5 Stunden?',
    [r'81,25 €', r'75,00 €', r'78,50 €', r'19,00 €'],
    [r'$6 \cdot 12{,}50 = 75{,}00$ €',
     r'Eine halbe Stunde: 6,25 €',
     r'$75{,}00 + 6{,}25 = 81{,}25$ €'])

Q.q(r'Für einen Smoothie mischt man Saft und Joghurt im Verhältnis 2 : 3. Wie viel Saft ist in 600 ml Smoothie?',
    [r'240 ml', r'200 ml', r'360 ml', r'300 ml'],
    [r'2 Teile Saft und 3 Teile Joghurt sind zusammen 5 Teile.',
     r'Ein Teil: $600 : 5 = 120$ ml',
     r'Saft: $2 \cdot 120 = 240$ ml'])

Q.q(r'Eine Wanderkarte hat den Maßstab 1 : 25 000. Wie weit ist es in Wirklichkeit, wenn auf der Karte 4 cm gemessen werden?',
    [r'1 km', r'100 m', r'10 km', r'25 km'],
    [r'1 cm auf der Karte sind 25 000 cm in Wirklichkeit.',
     r'4 cm → $4 \cdot 25\,000 = 100\,000$ cm',
     r'100 000 cm = 1000 m = 1 km'])

Q.q(r'Ein Handwerker berechnet 40 € für die Anfahrt und 30 € pro Arbeitsstunde. Was kostet ein Einsatz von 3 Stunden?',
    [r'130 €', r'210 €', r'90 €', r'120 €'],
    [r'Arbeit: $3 \cdot 30 = 90$ €',
     r'Dazu die Anfahrt: $90 + 40 = 130$ €',
     r'Vorsicht: Wegen der Anfahrt ist das nicht proportional, ein Dreisatz über eine andere Stundenzahl ginge schief.'])

Q.q(r'3 gleiche Maschinen stellen in 5 Stunden 450 Teile her. Wie viele Teile stellen 2 Maschinen in derselben Zeit her?',
    [r'300', r'675', r'225', r'150'],
    [r'Bei gleicher Zeit gilt: weniger Maschinen, weniger Teile – direkt.',
     r'1 Maschine → $450 : 3 = 150$ Teile',
     r'2 Maschinen → $2 \cdot 150 = 300$ Teile'])


def check():
    assert D('2.40') * 2 == D('4.80') and D('3.30') / 3 * 4 == D('4.40')
    assert F(450, 6) * 4 == 300
    assert 5 * 6 / 3 == 10
    assert F(150, F(90, 45)) == 75
    assert 4 * D('2.29') == D('9.16')
    assert 7 * D('14.29') == D('100.03') and 100 - 7 * D('14.28') == D('0.04')
    assert F(60, 3) * 4 == 80
    assert 12 * 15 / 20 == 9
    assert 7 * 24 * D('0.5') == 84
    assert D('2.5') * 6 == 15 and 15 * D('1.80') == 27
    assert 12 * 25 == 300
    assert 8 * 30 / 40 == 6
    assert 600 / 30 == 20 and 600 / 24 == 25
    assert 60 // 15 * 18 == 72
    assert 25 * 4 * D('0.05') == 5
    assert D('6.5') * D('12.50') == D('81.25')
    assert F(600, 5) * 2 == 240
    assert 4 * 25000 == 100000 and 100000 / 100 == 1000
    assert 3 * 30 + 40 == 130
    assert F(450, 3) * 2 == 300


Q.verify(check)
Q.save()
