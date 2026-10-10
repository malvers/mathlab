#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 20 / KW 3 (LB 4): Lohn und Abgaben – brutto und
netto, Arbeitnehmer- und Arbeitgeberanteil, Haushaltsplan. Plan: HTML/svp/mathe/mathe10.html.
Rates are given as assumptions ("angenommen"), because the legal rates change every year."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=20, slug='lohn-abgaben', thema='Lohn und Abgaben', lb='LB 4',
         blurb='brutto und netto, Sozialabgaben, Arbeitgeberanteil, Haushaltsplan, Lohnerhöhung',
         comment='Blocks: gross and net (1-2, 5-6, 11, 15, 17), contributions (3-4, 12-13), budget and saving (7-8, 18, 20), raises, overtime, part-time (9-10, 14, 16, 19). Rates are assumptions, not the current legal values.')

Q.q(r'Ein Bruttolohn von 2400 € wird um 20 % Abzüge gemindert. Wie hoch ist der Nettolohn?',
    [r'1920 €', r'2380 €', r'480 €', r'2880 €'],
    [r'Abzüge: $2400 \cdot 0{,}2 = 480$ €.', r'Netto: $2400 - 480 = 1920$ €, oder direkt $2400 \cdot 0{,}8$.'])

Q.q(r'Brutto sind es 2400 €, netto 1800 €. Wie viel Prozent des Bruttolohns sind Abzüge?',
    [r'25 %', r'33,3 %', r'75 %', r'6 %'],
    [r'Abzüge: $2400 - 1800 = 600$ €.', r'$\dfrac{600}{2400} = 0{,}25 = 25\,\%$ – bezogen auf das Brutto.'])

Q.q(r'Angenommen, der Beitragssatz zur Rentenversicherung beträgt 18,6 % und wird je zur Hälfte von Arbeitnehmer und Arbeitgeber getragen. Wie viel zahlt der Arbeitnehmer bei 2500 € brutto?',
    [r'232,50 €', r'465,00 €', r'186,00 €', r'93,00 €'],
    [r'Arbeitnehmeranteil: $18{,}6\,\% : 2 = 9{,}3\,\%$.', r'$2500 \cdot 0{,}093 = 232{,}50$ €'])

Q.q(r'Wie viel geht bei diesem Lohn (2500 €, Satz 18,6 %, hälftig geteilt) insgesamt an die Rentenversicherung?',
    [r'465,00 €', r'232,50 €', r'2732,50 €', r'186,00 €'],
    [r'Arbeitnehmer und Arbeitgeber zahlen je 232,50 €.', r'Zusammen $2500 \cdot 0{,}186 = 465$ €.'])

Q.q(r'Eine Aushilfe verdient 14 € pro Stunde und arbeitet im Monat 160 Stunden. Wie hoch ist der Bruttolohn?',
    [r'2240 €', r'2160 €', r'1400 €', r'224 €'],
    [r'$14 \cdot 160 = 2240$ €'])

Q.q(r'Vom Bruttolohn 2400 € gehen 250 € Lohnsteuer und 480 € Sozialabgaben ab. Wie hoch ist der Nettolohn?',
    [r'1670 €', r'2150 €', r'1920 €', r'730 €'],
    [r'Alle Abzüge: $250 + 480 = 730$ €.', r'$2400 - 730 = 1670$ €'])

Q.q(r'Lea hat 1700 € netto. Sie gibt aus: Miete 550 €, Lebensmittel 300 €, Strom und Handy 120 €, Mobilität 90 €, Freizeit 150 €. Wie viel bleibt übrig?',
    [r'490 €', r'1210 €', r'590 €', r'390 €'],
    [r'Ausgaben: $550 + 300 + 120 + 90 + 150 = 1210$ €.', r'Rest: $1700 - 1210 = 490$ €'])

Q.q(r'Welcher Anteil von Leas Nettolohn (1700 €) geht für die Miete (550 €) drauf (gerundet)?',
    [r'32,4 %', r'55 %', r'3,1 %', r'23,6 %'],
    [r'$\dfrac{550}{1700} \approx 0{,}324 = 32{,}4\,\%$', r'Eine Faustregel empfiehlt, höchstens etwa ein Drittel des Nettos für die Warmmiete auszugeben.'])

Q.q(r'Ein Gehalt von 2400 € wird um 3 % erhöht. Wie hoch ist es danach?',
    [r'2472 €', r'2403 €', r'2700 €', r'72 €'],
    [r'$2400 \cdot 1{,}03 = 2472$ €'])

Q.q(r'Der Lohn steigt um 3 %, die Preise steigen im selben Jahr um 2 %. Um wie viel Prozent kann man sich danach real etwa mehr leisten?',
    [r'um etwa 1 %', r'um 5 %', r'um 3 %', r'um 6 %'],
    [r'Real: $\dfrac{1{,}03}{1{,}02} \approx 1{,}0098$', r'Also knapp 1 % mehr Kaufkraft – nicht 3 %, weil die Preise mitsteigen.'])

Q.q(r'Eine Ausbildungsvergütung beträgt 950 € brutto, die Abzüge machen etwa 21 % aus. Wie viel bleibt netto (gerundet)?',
    [r'750,50 €', r'929,00 €', r'199,50 €', r'971,00 €'],
    [r'$950 \cdot 0{,}79 = 750{,}50$ €'])

Q.q(r'Ein Betrieb zahlt 3000 € Bruttolohn und trägt zusätzlich angenommen 20 % Arbeitgeberanteil. Was kostet die Stelle den Betrieb im Monat?',
    [r'3600 €', r'3000 €', r'2400 €', r'3020 €'],
    [r'$3000 + 3000 \cdot 0{,}2 = 3600$ €', r'Der Arbeitgeberanteil steht nicht auf der Lohnabrechnung als Abzug, kostet den Betrieb aber zusätzlich.'])

Q.q(r'Angenommen, der Arbeitnehmeranteil zur Krankenversicherung beträgt 8,1 % des Bruttolohns. Wie viel ist das bei 2200 €?',
    [r'178,20 €', r'17,82 €', r'356,40 €', r'81,00 €'],
    [r'$2200 \cdot 0{,}081 = 178{,}20$ €'])

Q.q(r'Jemand verdient 2400 € im Monat und bekommt einmal im Jahr 1200 € Weihnachtsgeld. Wie hoch ist das Jahresbrutto?',
    [r'30 000 €', r'28 800 €', r'3600 €', r'29 200 €'],
    [r'$12 \cdot 2400 + 1200 = 28\,800 + 1200 = 30\,000$ €'])

Q.q(r'Bei 160 Arbeitsstunden im Monat bleiben 1680 € netto. Wie viel ist das netto pro Stunde?',
    [r'10,50 €', r'16,80 €', r'9,50 €', r'105 €'],
    [r'$1680 : 160 = 10{,}50$ €'])

Q.q(r'Für Überstunden gibt es 25 % Zuschlag. Der normale Stundenlohn ist 16 €. Was bringt eine Überstunde?',
    [r'20 €', r'16,25 €', r'4 €', r'41 €'],
    [r'Zuschlag: $16 \cdot 0{,}25 = 4$ €.', r'$16 + 4 = 20$ €, also $16 \cdot 1{,}25$.'])

Q.q(r'Von 2500 € brutto gehen 300 € Lohnsteuer ab. Wie viel Prozent sind das?',
    [r'12 %', r'8,3 %', r'30 %', r'88 %'],
    [r'$\dfrac{300}{2500} = 0{,}12 = 12\,\%$'])

Q.q(r'Die monatlichen Ausgaben eines Haushalts steigen von 1250 € um 8 %. Wie hoch sind sie danach?',
    [r'1350 €', r'1258 €', r'1150 €', r'1330 €'],
    [r'$1250 \cdot 1{,}08 = 1350$ €'])

Q.q(r'Eine Vollzeitstelle (40 Stunden pro Woche) bringt 3200 € brutto. Was verdient man bei 30 Stunden pro Woche zum selben Stundenlohn?',
    [r'2400 €', r'2800 €', r'3000 €', r'2133 €'],
    [r'30 von 40 Stunden sind $75\,\%$.', r'$3200 \cdot 0{,}75 = 2400$ €'])

Q.q(r'Lea spart jeden Monat 10 % ihres Nettolohns von 1800 €. Wie viel spart sie in einem Jahr?',
    [r'2160 €', r'180 €', r'1800 €', r'21 600 €'],
    [r'Pro Monat: $1800 \cdot 0{,}1 = 180$ €.', r'Im Jahr: $12 \cdot 180 = 2160$ €'])


def check():
    R = lambda x, n=2: round(x, n)
    assert 2400 * 0.8 == 1920 and (2400 - 1800) / 2400 == 0.25
    assert R(2500 * 0.093) == 232.5 and R(2500 * 0.186) == 465
    assert 14 * 160 == 2240 and 2400 - 250 - 480 == 1670
    assert 1700 - (550 + 300 + 120 + 90 + 150) == 490 and R(550 / 1700, 3) == 0.324
    assert R(2400 * 1.03) == 2472 and R(1.03 / 1.02, 4) == 1.0098
    assert R(950 * 0.79) == 750.5 and 3000 * 1.2 == 3600 and R(2200 * 0.081) == 178.2
    assert 12 * 2400 + 1200 == 30000 and 1680 / 160 == 10.5 and 16 * 1.25 == 20
    assert 300 / 2500 == 0.12 and R(1250 * 1.08) == 1350 and 3200 * 30 / 40 == 2400 and 12 * 1800 * 0.1 == 2160


Q.verify(check)
Q.save()
