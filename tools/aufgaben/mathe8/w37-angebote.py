#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 37 / KW 23 (LB 6): Angebote vergleichen -
Rabatt, Skonto, Ratenkauf, Sparanlagen, Preise pro Einheit, Tarife. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=37, slug='angebote', thema='Angebote vergleichen', lb='LB 6',
        blurb='Rabatt, Skonto, Ratenkauf, Zinsen und Zinseszins, Grundpreise, Tarife, Mieten',
        comment='All prices are plausible examples. Blocks: discounts (1-3, 11-12, 16-17), instalments and credit (4-5, 15), savings and interest (6-9, 19), unit prices, tariffs and rents (10, 13-14, 18, 20).')

# ----------------------------------------------------------------- Rabatte ----
Q.q(r'Eine Jacke kostet 80 €. Es gibt 15 % Rabatt. Was kostet sie jetzt?',
    [r'68 €', r'12 €', r'65 €', r'92 €'],
    [r'Man zahlt 85 %: $80 \cdot 0{,}85 = 68$ €'])

Q.q(r'Eine Rechnung über 1250 € darf bei Zahlung innerhalb von 10 Tagen mit 2 % Skonto bezahlt werden. Wie viel zahlt man dann?',
    [r'1225 €', r'1248 €', r'25 €', r'1000 €'],
    [r'Skonto: $1250 \cdot 0{,}02 = 25$ €',
     r'$1250 - 25 = 1225$ €'])

Q.q(r'Laden A bietet ein Rad für 249 € mit 10 % Rabatt an, Laden B dasselbe Rad für 239 € mit 5 % Rabatt. Welcher Laden ist günstiger?',
    [r'A mit 224,10 €', r'B mit 227,05 €', r'A mit 239 €', r'Beide sind gleich teuer.'],
    [r'A: $249 \cdot 0{,}9 = 224{,}10$ €',
     r'B: $239 \cdot 0{,}95 = 227{,}05$ €',
     r'A ist um 2,95 € günstiger.'])

# ---------------------------------------------------------------- Ratenkauf ----
Q.q(r'Ein Fernseher kostet bar 520 €. Beim Ratenkauf zahlt man 50 € an und dann 12 Raten zu 45 €. Wie viel teurer ist der Ratenkauf?',
    [r'70 €', r'540 €', r'20 €', r'590 €'],
    [r'Ratenkauf: $50 + 12 \cdot 45 = 50 + 540 = 590$ €',
     r'Mehrkosten: $590 - 520 = 70$ €'])

Q.q(r'Wie viel Prozent des Barpreises (520 €) machen die Mehrkosten von 70 € aus (gerundet)?',
    [r'13,5 %', r'7 %', r'11,9 %', r'70 %'],
    [r'$\dfrac{70}{520} \approx 0{,}135 = 13{,}5$ %'])

# ---------------------------------------------------------- Sparen, Zinsen ----
Q.q(r'2000 € werden ein Jahr lang zu 2,5 % angelegt. Wie viele Zinsen gibt es?',
    [r'50 €', r'500 €', r'5 €', r'2050 €'],
    [r'$Z = \dfrac{2000 \cdot 2{,}5}{100} = 50$ €'])

Q.q(r'2000 € werden zwei Jahre zu 3 % mit Zinseszins angelegt. Wie hoch ist das Guthaben danach?',
    [r'2121,80 €', r'2120,00 €', r'2060,00 €', r'2180,00 €'],
    [r'Nach 1 Jahr: $2000 \cdot 1{,}03 = 2060$ €',
     r'Nach 2 Jahren: $2060 \cdot 1{,}03 = 2121{,}80$ €',
     r'2120 € wären einfache Zinsen ohne Zinseszins.'])

Q.q(r'1200 € liegen 4 Monate zu 3 % Jahreszins. Wie viele Zinsen gibt es?',
    [r'12 €', r'36 €', r'144 €', r'3 €'],
    [r'Jahreszinsen: $1200 \cdot 0{,}03 = 36$ €',
     r'4 Monate sind ein Drittel des Jahres: $36 : 3 = 12$ €'])

Q.q(r'Für 2000 € und ein Jahr: Bank A zahlt 2,8 %. Bank B zahlt 2,5 % und 20 € Bonus. Welche Bank zahlt mehr?',
    [r'B mit 70 €', r'A mit 56 €', r'A mit 76 €', r'Beide zahlen gleich viel.'],
    [r'A: $2000 \cdot 0{,}028 = 56$ €',
     r'B: $2000 \cdot 0{,}025 + 20 = 50 + 20 = 70$ €'])

# --------------------------------------------------- Grundpreise und Tarife ----
Q.q(r'Packung A: 500 g für 2,49 €, Packung B: 750 g für 3,59 €. Welche ist pro Kilogramm günstiger?',
    [r'B mit 4,79 € pro kg', r'A mit 4,98 € pro kg', r'A, weil sie billiger ist', r'Beide kosten gleich viel pro kg.'],
    [r'A: $2{,}49 \cdot 2 = 4{,}98$ € pro kg',
     r'B: $3{,}59 : 0{,}75 \approx 4{,}79$ € pro kg'])

Q.q(r'Eine Packung kostet weiterhin 1,99 €, enthält aber nur noch 200 g statt 250 g. Um wie viel Prozent ist der Preis pro Gramm gestiegen?',
    [r'25 %', r'20 %', r'50 %', r'0 %'],
    [r'Vorher: 1,99 € für 250 g, jetzt für 200 g.',
     r'Für 250 g bräuchte man jetzt $\dfrac{250}{200} = 1{,}25$ Packungen: 25 % mehr.'])

Q.q(r'Aktion „3 für 2“: Ein Joghurt kostet 1,20 €. Wie viel Prozent spart man pro Stück, wenn man drei nimmt?',
    [r'etwa 33 %', r'50 %', r'20 %', r'66 %'],
    [r'Drei Joghurts kosten $2 \cdot 1{,}20 = 2{,}40$ €, also 0,80 € pro Stück.',
     r'Ersparnis: $\dfrac{0{,}40}{1{,}20} = \dfrac{1}{3} \approx 33$ %'])

Q.q(r'Ein Angebot nennt 840 € zuzüglich 19 % Mehrwertsteuer. Wie hoch ist der Endpreis?',
    [r'999,60 €', r'859 €', r'680,40 €', r'159,60 €'],
    [r'$840 \cdot 1{,}19 = 999{,}60$ €'])

Q.q(r'Tarif A kostet 9,99 € im Monat pauschal. Tarif B kostet 4,99 € plus 0,09 € pro Minute. Welcher ist bei 80 Minuten im Monat günstiger?',
    [r'A, B würde 12,19 € kosten', r'B, er kostet 7,19 €', r'Beide kosten gleich viel.', r'B, er kostet 4,99 €'],
    [r'B: $4{,}99 + 80 \cdot 0{,}09 = 4{,}99 + 7{,}20 = 12{,}19$ €',
     r'A ist mit 9,99 € günstiger.'])

Q.q(r'Ein Kredit über 5000 € wird in 48 Raten zu 115 € zurückgezahlt. Wie viel kostet der Kredit an Zinsen und Gebühren?',
    [r'520 €', r'115 €', r'5520 €', r'480 €'],
    [r'Zurückgezahlt: $48 \cdot 115 = 5520$ €',
     r'Kosten: $5520 - 5000 = 520$ €'])

Q.q(r'Ein Preis steigt von 80 € auf 100 €. Um wie viel Prozent müsste er danach fallen, um wieder 80 € zu kosten?',
    [r'um 20 %', r'um 25 %', r'um 80 %', r'um 15 %'],
    [r'Erhöhung: $\dfrac{20}{80} = 25$ %',
     r'Senkung: $\dfrac{20}{100} = 20$ %, weil der Grundwert jetzt 100 € ist.'])

Q.q(r'Ein Preis wird erst um 20 % und dann noch einmal um 10 % gesenkt. Um wie viel Prozent ist er insgesamt gesunken?',
    [r'um 28 %', r'um 30 %', r'um 32 %', r'um 2 %'],
    [r'$0{,}8 \cdot 0{,}9 = 0{,}72$: Man zahlt 72 %.',
     r'Gesamtsenkung: 28 %, nicht 30 %.'])

Q.q(r'Wohnung A kostet 620 € für 70 m², Wohnung B 560 € für 60 m². Welche ist pro Quadratmeter günstiger?',
    [r'A mit etwa 8,86 € pro m²', r'B mit etwa 9,33 € pro m²', r'B, weil sie billiger ist', r'Beide kosten gleich viel pro m².'],
    [r'A: $620 : 70 \approx 8{,}86$ €',
     r'B: $560 : 60 \approx 9{,}33$ €'])

Q.q(r'3000 € bringen in einem Jahr 72 € Zinsen. Wie hoch ist der Zinssatz?',
    [r'2,4 %', r'7,2 %', r'0,24 %', r'4,2 %'],
    [r'$p = \dfrac{72 \cdot 100}{3000} = 2{,}4$ %'])

Q.q(r'Eine Versicherung kostet 8,50 € im Monat oder 97 € im Jahr. Was spart man im Jahr mit der jährlichen Zahlung?',
    [r'5 €', r'8,50 €', r'11,50 €', r'0 €'],
    [r'Monatlich: $12 \cdot 8{,}50 = 102$ €',
     r'Ersparnis: $102 - 97 = 5$ €'])


def check():
    from fractions import Fraction as F
    assert 80 * F('0.85') == 68 and 1250 * F('0.98') == 1225
    assert 249 * F('0.9') == F('224.1') and 239 * F('0.95') == F('227.05')
    assert 50 + 12 * 45 - 520 == 70 and round(70 / 520 * 100, 1) == 13.5
    assert 2000 * F('0.025') == 50 and 2000 * F('1.03') ** 2 == F('2121.8')
    assert 1200 * F('0.03') / 3 == 12
    assert 2000 * F('0.028') == 56 and 2000 * F('0.025') + 20 == 70
    assert F('2.49') * 2 == F('4.98') and round(3.59 / 0.75, 2) == 4.79
    assert F(250, 200) == F('1.25')
    assert F('0.4') / F('1.2') == F(1, 3)
    assert 840 * F('1.19') == F('999.6')
    assert F('4.99') + 80 * F('0.09') == F('12.19')
    assert 48 * 115 - 5000 == 520
    assert F(20, 80) == F(1, 4) and F(20, 100) == F(1, 5)
    assert 1 - F('0.8') * F('0.9') == F('0.28')
    assert round(620 / 70, 2) == 8.86 and round(560 / 60, 2) == 9.33
    assert F(72 * 100, 3000) == F('2.4') and 12 * F('8.5') - 97 == 5


Q.verify(check)
Q.save()
