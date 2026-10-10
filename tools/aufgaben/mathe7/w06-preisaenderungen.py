#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 6 / KW 39 (LB 1): price increase and decrease -
increased and reduced base value, discount, cash discount, VAT, working backwards.
Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from decimal import Decimal as D, ROUND_HALF_UP
from quiz import os7

Q = os7(nr=6, slug='preisaenderungen', thema='Preiserhöhung und Preissenkung', lb='LB 1',
        blurb='Rabatt, Skonto, Mehrwertsteuer, Faktoren, rückwärts rechnen',
        comment='Blocks: new price (1-3, 9, 14-16, 20), factors (4-5), VAT (6-7), backwards (8, 18), percent of the change (10-11, 19), traps (12-13, 17).')

cent = lambda x: D(x).quantize(D('0.01'), rounding=ROUND_HALF_UP)

# ---------------------------------------------------------------- new price ----
Q.q(r'Eine Hose kostet 80 €. Sie wird um 25 % billiger. Was kostet sie jetzt?',
    [r'60 €', r'55 €', r'20 €', r'100 €'],
    [r'25 % von 80 € sind 20 €.',
     r'$80 - 20 = 60$ €',
     r'Oder: Der neue Preis ist 75 % des alten: $80 \cdot 0{,}75 = 60$ €.'])

Q.q(r'Ein Konzertticket kostet 120 €. Der Preis steigt um 15 %. Was kostet es jetzt?',
    [r'138 €', r'135 €', r'18 €', r'102 €'],
    [r'15 % von 120 € sind 18 €.',
     r'$120 + 18 = 138$ €',
     r'Oder: $120 \cdot 1{,}15 = 138$ €.'])

Q.q(r'Auf ein Spiel für 45 € gibt es 20 % Rabatt. Was muss man bezahlen?',
    [r'36 €', r'25 €', r'9 €', r'40 €'],
    [r'Rabatt: 20 % von 45 € = 9 €',
     r'$45 - 9 = 36$ €',
     r'Oder: $45 \cdot 0{,}8 = 36$ €.'])

Q.q(r'Eine Rechnung über 450 € wird innerhalb von 10 Tagen bezahlt; dafür gibt es 2 % Skonto. Wie viel wird überwiesen?',
    [r'441 €', r'448 €', r'9 €', r'459 €'],
    [r'Skonto ist ein Preisnachlass für schnelles Bezahlen.',
     r'2 % von 450 € sind 9 €.',
     r'$450 - 9 = 441$ €'])

Q.q(r'Das Taschengeld von 25 € steigt um 8 %. Wie hoch ist es jetzt?',
    [r'27 €', r'33 €', r'25,08 €', r'2 €'],
    [r'8 % von 25 € sind 2 €.',
     r'$25 + 2 = 27$ €',
     r'Oder: $25 \cdot 1{,}08 = 27$ €.'])

Q.q(r'Eine Monatskarte für 40 € wird um 5 % teurer. Was kostet sie jetzt?',
    [r'42 €', r'45 €', r'38 €', r'40,05 €'],
    [r'5 % von 40 € sind 2 €.',
     r'$40 + 2 = 42$ €',
     r'Oder: $40 \cdot 1{,}05 = 42$ €.'])

Q.q(r'Im Ausverkauf ist alles 30 % reduziert. Eine Jacke kostete 89,90 €. Was kostet sie jetzt?',
    [r'62,93 €', r'59,90 €', r'26,97 €', r'116,87 €'],
    [r'Der neue Preis ist 70 % des alten.',
     r'$89{,}90 \cdot 0{,}7 = 62{,}93$',
     r'Die Jacke kostet 62,93 €.'])

Q.q(r'Welche Rechnung ergibt den Preis nach einer Erhöhung von 75 € um 12 %?',
    [r'$75 \cdot 1{,}12 = 84$ €', r'$75 \cdot 0{,}12 = 9$ €', r'$75 + 12 = 87$ €', r'$75 \cdot 0{,}88 = 66$ €'],
    [r'Der neue Preis ist 100 % + 12 % = 112 % des alten.',
     r'112 % = 1,12',
     r'$75 \cdot 1{,}12 = 84$ €. (9 € ist nur die Erhöhung.)'])

# -------------------------------------------------------------------- factors ----
Q.q(r'Mit welcher Zahl multipliziert man den alten Preis bei einer Preissenkung um 30 %?',
    [r'0,7', r'0,3', r'1,3', r'30'],
    [r'Nach der Senkung bleiben 100 % − 30 % = 70 %.',
     r'70 % = 0,7',
     r'Neuer Preis = alter Preis · 0,7'])

Q.q(r'Mit welcher Zahl multipliziert man den Nettopreis, um 19 % Mehrwertsteuer aufzuschlagen?',
    [r'1,19', r'0,19', r'0,81', r'19'],
    [r'Bruttopreis = 100 % + 19 % = 119 % vom Nettopreis.',
     r'119 % = 1,19',
     r'Bruttopreis = Nettopreis · 1,19'])

# ------------------------------------------------------------------------ VAT ----
Q.q(r'Ein Gerät kostet ohne Mehrwertsteuer 250 €. Wie viel kostet es mit 19 % Mehrwertsteuer?',
    [r'297,50 €', r'269 €', r'47,50 €', r'202,50 €'],
    [r'19 % von 250 € sind 47,50 €.',
     r'$250 + 47{,}50 = 297{,}50$ €',
     r'Oder: $250 \cdot 1{,}19 = 297{,}50$ €.'])

Q.q(r'Ein Preis von 119 € enthält schon 19 % Mehrwertsteuer. Wie hoch ist der Preis ohne Steuer?',
    [r'100 €', r'96,39 €', r'138,61 €', r'22,61 €'],
    [r'119 € sind 119 % des Nettopreises.',
     r'1 % → 1 €',
     r'100 % → 100 €. Vorsicht: Man darf nicht 19 % von 119 € abziehen!'])

# ------------------------------------------------------------------ backwards ----
Q.q(r'Nach 20 % Rabatt kostet ein Rad 64 €. Was kostete es vorher?',
    [r'80 €', r'76,80 €', r'51,20 €', r'84 €'],
    [r'64 € sind 80 % des alten Preises.',
     r'1 % → 0,80 €',
     r'100 % → 80 €. Probe: 20 % von 80 € sind 16 €, $80 - 16 = 64$.'])

Q.q(r'Nach einer Preiserhöhung um 25 % kostet ein Buch 50 €. Was kostete es vorher?',
    [r'40 €', r'37,50 €', r'62,50 €', r'45 €'],
    [r'50 € sind 125 % des alten Preises.',
     r'$50 : 1{,}25 = 40$',
     r'Probe: $40 \cdot 1{,}25 = 50$.'])

# ---------------------------------------------------------- percent of the change ----
Q.q(r'Ein Eintritt steigt von 50 € auf 60 €. Um wie viel Prozent ist er gestiegen?',
    [r'20 %', r'10 %', r'16,7 %', r'60 %'],
    [r'Die Erhöhung ist 10 €.',
     r'Bezogen auf den alten Preis: $\dfrac{10}{50}$',
     r'= 20 %'])

Q.q(r'Ein Preis sinkt von 80 € auf 68 €. Um wie viel Prozent wurde er gesenkt?',
    [r'15 %', r'12 %', r'85 %', r'17,6 %'],
    [r'Die Senkung ist 12 €.',
     r'$\dfrac{12}{80} = \dfrac{3}{20}$',
     r'= 15 %'])

Q.q(r'„Statt 40 € nur 30 €!“ Um wie viel Prozent wurde der Preis gesenkt?',
    [r'25 %', r'10 %', r'33,3 %', r'75 %'],
    [r'Die Senkung ist 10 €.',
     r'Grundwert ist der alte Preis: $\dfrac{10}{40}$',
     r'= 25 % (bezogen auf 30 € wären es 33,3 % – das wäre der falsche Grundwert).'])

# ------------------------------------------------------------------------ traps ----
Q.q(r'Ein Preis von 100 € steigt erst um 10 % und sinkt dann um 10 %. Wie hoch ist er danach?',
    [r'99 €', r'100 €', r'101 €', r'90 €'],
    [r'Nach der Erhöhung: $100 \cdot 1{,}1 = 110$ €',
     r'Nach der Senkung: $110 \cdot 0{,}9 = 99$ €',
     r'Die zweiten 10 % beziehen sich auf den größeren Grundwert 110 €.'])

Q.q(r'Auf eine Ware gibt es erst 20 % und dann auf den neuen Preis noch einmal 10 % Rabatt. Wie viel Prozent ist sie insgesamt billiger?',
    [r'28 %', r'30 %', r'2 %', r'32 %'],
    [r'Faktoren malnehmen: $0{,}8 \cdot 0{,}9 = 0{,}72$',
     r'Sie kostet noch 72 % des alten Preises.',
     r'Sie ist also 28 % billiger, nicht 30 %.'])

Q.q(r'Eine Hose kostet 60 €. Laden A gibt 15 % Rabatt, Laden B 10 € Rabatt. Wo ist sie billiger?',
    [r'bei B (50 € statt 51 €)', r'bei A (51 € statt 50 €)', r'Beide sind gleich teuer.', r'bei A, weil 15 mehr als 10 ist'],
    [r'A: 15 % von 60 € sind 9 €, die Hose kostet 51 €.',
     r'B: $60 - 10 = 50$ €',
     r'Bei B ist sie 1 € billiger.'])


def check():
    assert 80 * D('0.75') == 60 and 120 * D('1.15') == 138 and 45 * D('0.8') == 36
    assert 450 - 450 * D('0.02') == 441 and 25 * D('1.08') == 27 and 40 * D('1.05') == 42
    assert cent(D('89.90') * D('0.7')) == D('62.93') and 75 * D('1.12') == 84 and 75 * D('0.12') == 9
    assert 1 - D('0.3') == D('0.7') and 1 + D('0.19') == D('1.19')
    assert 250 * D('1.19') == D('297.50') and D(119) / D('1.19') == 100
    assert cent(119 - 119 * D('0.19')) == D('96.39')
    assert D(64) / D('0.8') == 80 and D(50) / D('1.25') == 40
    assert D(60 - 50) / 50 * 100 == 20 and D(80 - 68) / 80 * 100 == 15 and D(40 - 30) / 40 * 100 == 25
    assert 100 * D('1.1') * D('0.9') == 99 and D('0.8') * D('0.9') == D('0.72')
    assert 60 * D('0.85') == 51 and 60 - 10 == 50


Q.verify(check)
Q.save()
