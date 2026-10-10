#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 21 / KW 4 (LB 4): Sparen, Kredit, Schuldenfalle.
Plan: HTML/svp/mathe/mathe10.html. Interest for parts of a year with 365 days."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=21, slug='sparen-kredit', thema='Sparen, Kredit, Schuldenfalle', lb='LB 4',
         blurb='Zinsen und Zinseszins, Ratenkauf, Dispokredit, effektiver Jahreszins, Inflation',
         comment='Blocks: saving (1-2, 9-11, 16, 20), credit and instalments (3-8, 14-15, 18), debt trap and inflation (12-13, 17, 19). Day interest with 365 days per year.')

Q.q(r'1500 € liegen ein Jahr lang zu 2 % auf dem Sparbuch. Wie viel Zinsen gibt es?',
    [r'30 €', r'300 €', r'3 €', r'1530 €'],
    [r'$1500 \cdot 0{,}02 = 30$ €'])

Q.q(r'5000 € werden 5 Jahre zu 3 % mit Zinseszins angelegt. Wie hoch ist das Guthaben danach (gerundet)?',
    [r'5796,37 €', r'5750,00 €', r'5150,00 €', r'5463,64 €'],
    [r'$5000 \cdot 1{,}03^5 \approx 5000 \cdot 1{,}15927 \approx 5796{,}37$ €', r'Ohne Zinseszins: $5000 + 5 \cdot 150 = 5750$ €.'])

Q.q(r'Ein Konto ist mit 1200 € im Dispo, der Zinssatz beträgt 12 % pro Jahr. Wie viel Zinsen kostet ein Monat?',
    [r'12 €', r'144 €', r'1,20 €', r'100 €'],
    [r'Jahreszinsen: $1200 \cdot 0{,}12 = 144$ €.', r'Ein Monat: $144 : 12 = 12$ €'])

Q.q(r'Ein Fernseher kostet bar 900 €. Alternativ zahlt man 12 Raten zu je 82 €. Wie viel teurer ist der Ratenkauf?',
    [r'84 €', r'82 €', r'18 €', r'984 €'],
    [r'Ratenkauf insgesamt: $12 \cdot 82 = 984$ €.', r'Mehrkosten: $984 - 900 = 84$ €'])

Q.q(r'Wie viel Prozent des Barpreises (900 €) sind diese 84 € Mehrkosten (gerundet)?',
    [r'9,3 %', r'8,5 %', r'84 %', r'0,9 %'],
    [r'$\dfrac{84}{900} \approx 0{,}0933 = 9{,}3\,\%$'])

Q.q(r'Ein Kredit über 6000 € läuft 2 Jahre, jedes Jahr werden 6 % auf den vollen Betrag berechnet. Wie viel Zinsen sind das insgesamt?',
    [r'720 €', r'360 €', r'741,60 €', r'6720 €'],
    [r'Pro Jahr: $6000 \cdot 0{,}06 = 360$ €.', r'Zwei Jahre: $720$ €.'])

Q.q(r'Ein Kredit von 2400 € wird in 24 Monatsraten zu je 110 € zurückgezahlt. Was kostet der Kredit?',
    [r'240 €', r'110 €', r'2640 €', r'10 €'],
    [r'Zurückgezahlt: $24 \cdot 110 = 2640$ €.', r'Kosten: $2640 - 2400 = 240$ €'])

Q.q(r'Ein Konto ist drei Monate lang mit 500 € überzogen, Dispozins 12 % pro Jahr. Wie viel Zinsen fallen an?',
    [r'15 €', r'60 €', r'5 €', r'180 €'],
    [r'Drei Monate sind ein Viertel Jahr.', r'$500 \cdot 0{,}12 \cdot \dfrac{3}{12} = 15$ €'])

Q.q(r'Tim legt jeden Monat 50 € zur Seite, zwei Jahre lang, ohne Zinsen. Wie viel hat er dann?',
    [r'1200 €', r'100 €', r'600 €', r'2400 €'],
    [r'$24 \cdot 50 = 1200$ €'])

Q.q(r'Nach wie vielen Jahren verdoppelt sich ein Guthaben bei 4 % Zinseszins ungefähr?',
    [r'nach etwa 18 Jahren', r'nach 25 Jahren', r'nach 4 Jahren', r'nach 50 Jahren'],
    [r'$1{,}04^{18} \approx 2{,}03$', r'Faustregel: $72 : 4 = 18$ Jahre. Ohne Zinseszins wären es 25 Jahre.'])

Q.q(r'Aus 2000 € werden in einem Jahr 2060 €. Wie hoch ist der Zinssatz?',
    [r'3 %', r'6 %', r'0,3 %', r'60 %'],
    [r'Zinsen: 60 €.', r'$\dfrac{60}{2000} = 0{,}03 = 3\,\%$'])

Q.q(r'Ein Handyvertrag kostet 35 € im Monat und läuft 24 Monate. Wie viel zahlt man insgesamt?',
    [r'840 €', r'420 €', r'700 €', r'59 €'],
    [r'$24 \cdot 35 = 840$ €', r'Ein „kostenloses“ Handy im Vertrag ist meist in diesem Betrag versteckt.'])

Q.q(r'Welches ist ein Warnzeichen für eine Schuldenfalle?',
    [r'Man nimmt neue Schulden auf, um alte Raten zu bezahlen.', r'Man legt jeden Monat Geld zurück.',
     r'Man vergleicht Kreditangebote.', r'Man zahlt einen Kredit vorzeitig zurück.'],
    [r'Wer Raten nur mit neuen Krediten bezahlen kann, dessen Schulden wachsen immer weiter.', r'Hilfe gibt es bei Schuldnerberatungsstellen.'])

Q.q(r'Was gibt der effektive Jahreszins eines Kredits an?',
    [r'die gesamten jährlichen Kosten des Kredits in Prozent, einschließlich Gebühren', r'nur die Bearbeitungsgebühr',
     r'die Höhe der monatlichen Rate', r'den Zinssatz für Sparguthaben'],
    [r'Mit dem effektiven Jahreszins kann man verschiedene Kreditangebote fair vergleichen.'])

Q.q(r'3650 € werden 73 Tage lang mit 2 % pro Jahr verzinst (Jahr mit 365 Tagen). Wie viel Zinsen gibt es?',
    [r'14,60 €', r'73,00 €', r'1,46 €', r'5,33 €'],
    [r'Jahreszinsen: $3650 \cdot 0{,}02 = 73$ €.', r'73 Tage sind $\dfrac{73}{365} = \dfrac{1}{5}$ Jahr: $73 : 5 = 14{,}60$ €'])

Q.q(r'Nach einem Jahr zu 2,5 % sind auf einem Konto 4100 €. Wie hoch war das Anfangskapital?',
    [r'4000 €', r'3997,50 €', r'4102,50 €', r'3900 €'],
    [r'$K_0 \cdot 1{,}025 = 4100$', r'$K_0 = 4100 : 1{,}025 = 4000$ €', r'Wer 2,5 % von 4100 € abzieht, bekommt 3997,50 € – falsch, denn die Zinsen beziehen sich auf das Anfangskapital.'])

Q.q(r'1000 € liegen zinslos im Schrank, die Preise steigen um 2 % pro Jahr. Wie viel ist das Geld nach einem Jahr in heutiger Kaufkraft wert (gerundet)?',
    [r'980,39 €', r'1020,00 €', r'980,00 €', r'1000,00 €'],
    [r'Dasselbe kostet jetzt das 1,02-Fache.', r'$1000 : 1{,}02 \approx 980{,}39$ €'])

Q.q(r'Für 2000 € auf ein Jahr: Bank A verlangt 5 % Zinsen, Bank B 4,5 % Zinsen plus 100 € Gebühr. Welches Angebot ist günstiger?',
    [r'Bank A mit 100 € Kosten', r'Bank B mit 90 € Kosten', r'beide gleich', r'Bank B mit 190 € Kosten'],
    [r'A: $2000 \cdot 0{,}05 = 100$ €.', r'B: $2000 \cdot 0{,}045 + 100 = 90 + 100 = 190$ €. A ist günstiger.'])

Q.q(r'Jemand hat 1000 € Schulden zu 12 % pro Jahr und zahlt jeden Monat 10 € zurück. Was passiert?',
    [r'Die Schulden werden nie kleiner.', r'Die Schulden sind nach 100 Monaten bezahlt.',
     r'Die Schulden sinken jeden Monat um 10 €.', r'Die Schulden sind nach einem Jahr bezahlt.'],
    [r'Monatszinsen: $1000 \cdot 0{,}12 : 12 = 10$ €.', r'Die Rate deckt nur die Zinsen, von der Schuld selbst wird nichts getilgt.'])

Q.q(r'10 000 € werden 10 Jahre lang zu 1,5 % mit Zinseszins angelegt. Wie hoch ist das Guthaben danach (gerundet)?',
    [r'11 605,41 €', r'11 500,00 €', r'10 150,00 €', r'11 576,25 €'],
    [r'$10\,000 \cdot 1{,}015^{10} \approx 11\,605{,}41$ €'])


def check():
    R = lambda x, n=2: round(x, n)
    assert 1500 * 0.02 == 30 and R(5000 * 1.03 ** 5) == 5796.37 and 5000 + 5 * 150 == 5750
    assert R(1200 * 0.12 / 12) == 12 and 12 * 82 == 984 and R(84 / 900 * 100, 1) == 9.3
    assert R(6000 * 0.06 * 2) == 720 and 24 * 110 - 2400 == 240 and R(500 * 0.12 * 3 / 12) == 15
    assert 24 * 50 == 1200 and R(1.04 ** 18) == 2.03 and 60 / 2000 == 0.03 and 24 * 35 == 840
    assert R(3650 * 0.02 * 73 / 365) == 14.6 and R(4100 / 1.025) == 4000 and R(4100 * 0.975) == 3997.5
    assert R(1000 / 1.02) == 980.39 and 2000 * 0.05 == 100 and R(2000 * 0.045 + 100) == 190
    assert R(1000 * 0.12 / 12) == 10 and R(10000 * 1.015 ** 10) == 11605.41


Q.verify(check)
Q.save()
