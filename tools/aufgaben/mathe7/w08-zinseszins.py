#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 8 / KW 41 (LB 1): compound interest year by
year, growth factor, savings plan in a spreadsheet, comparing solution paths and tools,
rule of 72 (Pacioli 1494). Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from decimal import Decimal as D, ROUND_HALF_UP
from quiz import os7

Q = os7(nr=8, slug='zinseszins', thema='Zinseszins und Tabellenkalkulation', lb='LB 1',
        blurb='Zinseszins Jahr für Jahr, Zinsfaktor, Sparplan, Lösungswege bewerten',
        comment='Blocks: compound interest (1-5, 10, 15-16, 19-20), spreadsheet (6-7, 17), doubling and comparing (8-9, 11-14, 18).')

cent = lambda x: D(x).quantize(D('0.01'), rounding=ROUND_HALF_UP)


def grow(K, p, n):
    K = D(str(K))
    for _ in range(n):
        K = K * (1 + D(str(p)) / 100)
    return K


# ------------------------------------------------------------ compound interest ----
Q.q(r'Was bedeutet Zinseszins?',
    [r'Die Zinsen bleiben auf dem Konto und werden im nächsten Jahr mitverzinst.', r'Man bekommt doppelte Zinsen.',
     r'Die Bank zieht Zinsen von den Zinsen ab.', r'Zinsen gibt es nur im ersten Jahr.'],
    [r'Nach einem Jahr kommen die Zinsen zum Kapital dazu.',
     r'Im nächsten Jahr wird das größere Kapital verzinst.',
     r'So bekommt man auch Zinsen auf die Zinsen.'])

Q.q(r'1000 € werden 2 Jahre zu 5 % mit Zinseszins angelegt. Wie viel ist nach 2 Jahren auf dem Konto?',
    [r'1102,50 €', r'1100 €', r'1050 €', r'1105 €'],
    [r'Nach 1 Jahr: $1000 \cdot 1{,}05 = 1050$ €',
     r'Nach 2 Jahren: $1050 \cdot 1{,}05 = 1102{,}50$ €',
     r'Ohne Zinseszins wären es nur 1100 €.'])

Q.q(r'Mit welchem Zinsfaktor multipliziert man das Kapital jedes Jahr bei 3 % Zinsen?',
    [r'1,03', r'0,03', r'1,3', r'3'],
    [r'Aus 100 % werden nach einem Jahr 103 %.',
     r'103 % = 1,03',
     r'Kapital neu = Kapital alt · 1,03'])

Q.q(r'500 € werden zu 4 % angelegt. Wie viele Zinsen gibt es im zweiten Jahr?',
    [r'20,80 €', r'20 €', r'40 €', r'40,80 €'],
    [r'1. Jahr: 4 % von 500 € = 20 €, Kapital danach 520 €.',
     r'2. Jahr: 4 % von 520 €',
     r'$= 20{,}80$ € – mehr als im ersten Jahr.'])

Q.q(r'Warum sind beim Zinseszins die Zinsen jedes Jahr etwas größer als im Jahr davor?',
    [r'weil das Kapital durch die Zinsen gewachsen ist', r'weil der Zinssatz steigt',
     r'weil die Bank großzügiger wird', r'Sie sind jedes Jahr gleich.'],
    [r'Der Zinssatz bleibt gleich.',
     r'Er bezieht sich aber auf ein immer größeres Kapital.',
     r'Darum wachsen die Zinsen von Jahr zu Jahr.'])

Q.q(r'2000 € werden 3 Jahre zu 2 % mit Zinseszins angelegt. Wie viel ist danach auf dem Konto (auf Cent gerundet)?',
    [r'2122,42 €', r'2120 €', r'2040 €', r'2122,40 €'],
    [r'$2000 \cdot 1{,}02 = 2040$, $2040 \cdot 1{,}02 = 2080{,}80$',
     r'$2080{,}80 \cdot 1{,}02 = 2122{,}416$',
     r'Gerundet 2122,42 €; kürzer: $2000 \cdot 1{,}02^3$.'])

Q.q(r'Jemand hat 2000 € Schulden zu 10 % Zinsen und zahlt 2 Jahre lang nichts zurück. Wie hoch sind die Schulden dann?',
    [r'2420 €', r'2400 €', r'2200 €', r'4000 €'],
    [r'Nach 1 Jahr: $2000 \cdot 1{,}1 = 2200$ €',
     r'Nach 2 Jahren: $2200 \cdot 1{,}1 = 2420$ €',
     r'Auch Schulden wachsen mit Zinseszins.'])

Q.q(r'Ein Kapital wächst 2 Jahre lang um je 10 %. Um wie viel Prozent ist es insgesamt gewachsen?',
    [r'21 %', r'20 %', r'10 %', r'11 %'],
    [r'Faktor insgesamt: $1{,}1 \cdot 1{,}1 = 1{,}21$',
     r'Aus 100 % werden 121 %.',
     r'Zuwachs 21 %, nicht 20 %.'])

Q.q(r'Nach 2 Jahren mit 10 % Zinseszins sind 1210 € auf dem Konto. Wie viel wurde am Anfang angelegt?',
    [r'1000 €', r'1100 €', r'968 €', r'1089 €'],
    [r'Rückwärts: durch den Zinsfaktor teilen.',
     r'$1210 : 1{,}1 = 1100$, $1100 : 1{,}1 = 1000$',
     r'Am Anfang waren es 1000 €.'])

Q.q(r'Anna zahlt am Anfang jedes Jahres 100 € auf ein Konto mit 5 % Zinsen. Wie viel ist am Ende des zweiten Jahres darauf?',
    [r'215,25 €', r'210 €', r'205 €', r'220,50 €'],
    [r'Ende Jahr 1: $100 \cdot 1{,}05 = 105$ €',
     r'Anfang Jahr 2: $105 + 100 = 205$ €',
     r'Ende Jahr 2: $205 \cdot 1{,}05 = 215{,}25$ €'])

Q.q(r'Welcher Term gibt das Kapital nach 5 Jahren an, wenn 1000 € zu 4 % mit Zinseszins angelegt werden?',
    [r'$1000 \cdot 1{,}04^5$', r'$1000 \cdot 1{,}04 \cdot 5$', r'$1000 + 5 \cdot 4$', r'$1000 \cdot 0{,}04^5$'],
    [r'Jedes Jahr wird mit dem Zinsfaktor 1,04 malgenommen.',
     r'Fünf Jahre: $1000 \cdot 1{,}04 \cdot 1{,}04 \cdot 1{,}04 \cdot 1{,}04 \cdot 1{,}04$',
     r'Kurz: $1000 \cdot 1{,}04^5 \approx 1216{,}65$ €'])

# ------------------------------------------------------------------ spreadsheet ----
Q.q(r'In einer Tabellenkalkulation steht in Zelle B2 das Kapital. Welche Formel in B3 berechnet das Kapital nach einem weiteren Jahr bei 3 %?',
    [r'=B2*1,03', r'=B2+3', r'=B2*3', r'=B2*0,03'],
    [r'Neues Kapital = altes Kapital · Zinsfaktor.',
     r'Der Zinsfaktor bei 3 % ist 1,03.',
     r'=B2*0,03 wären nur die Zinsen.'])

Q.q(r'Die Formel =B2*1,03 aus B3 wird nach unten in B4, B5, … kopiert. Was passiert?',
    [r'Jede Zeile rechnet mit dem Kapital aus der Zeile darüber.', r'Alle Zeilen zeigen dasselbe Kapital.',
     r'Die Tabelle rechnet rückwärts.', r'Es entsteht eine Fehlermeldung.'],
    [r'Beim Kopieren passt sich der Bezug an: In B4 steht dann =B3*1,03.',
     r'So rechnet jedes Jahr mit dem Ergebnis des Vorjahres.',
     r'Ein Zinseszinsplan für viele Jahre entsteht in Sekunden.'])

Q.q(r'In Spalte B steht das Kapital zu Jahresbeginn, der Zinssatz ist 3 %. Welche Formel berechnet in C2 die Zinsen für dieses Jahr?',
    [r'=B2*0,03', r'=B2*1,03', r'=B2+0,03', r'=B2/3'],
    [r'Zinsen = Kapital · Zinssatz',
     r'3 % = 0,03',
     r'=B2*1,03 wäre das neue Kapital mit Zinsen.'])

# ------------------------------------------------------- doubling and comparing ----
Q.q(r'1000 € liegen zu 10 % mit Zinseszins. Nach wie vielen Jahren ist das Kapital zum ersten Mal mehr als doppelt so groß?',
    [r'nach 8 Jahren', r'nach 10 Jahren', r'nach 5 Jahren', r'nach 20 Jahren'],
    [r'Jahr für Jahr mit 1,1 malnehmen: 1100, 1210, 1331, 1464,10, 1610,51 …',
     r'Nach 7 Jahren: etwa 1948,72 €, nach 8 Jahren: etwa 2143,59 €.',
     r'Ohne Zinseszins bräuchte man 10 Jahre.'])

Q.q(r'Eine alte Faustregel (sie steht schon bei Luca Pacioli, 1494): „72 durch den Zinssatz ergibt etwa die Jahre bis zur Verdopplung.“ Wie lange dauert es bei 6 %?',
    [r'etwa 12 Jahre', r'etwa 6 Jahre', r'etwa 72 Jahre', r'etwa 17 Jahre'],
    [r'$72 : 6 = 12$',
     r'Probe: $1{,}06^{12} \approx 2{,}01$',
     r'Nach etwa 12 Jahren hat sich das Kapital verdoppelt.'])

Q.q(r'Angebot A: 3 Jahre 3 % mit Zinseszins. Angebot B: 3 Jahre 3,1 % ohne Zinseszins (Zinsen werden ausgezahlt). Was bringt bei 1000 € insgesamt mehr?',
    [r'B, 93 € statt etwa 92,73 €', r'A, weil Zinseszins immer mehr bringt', r'Beide bringen genau gleich viel.', r'A, 97 € statt 93 €'],
    [r'A: $1000 \cdot 1{,}03^3 \approx 1092{,}73$ €, also etwa 92,73 € Zinsen.',
     r'B: $3 \cdot 31 = 93$ € Zinsen.',
     r'B bringt knapp mehr – genau rechnen lohnt sich.'])

Q.q(r'Wie berechnet man das Kapital nach 10 Jahren Zinseszins am geschicktesten?',
    [r'mit dem Taschenrechner als $K \cdot 1{,}03^{10}$ oder mit einer Tabellenkalkulation', r'zehnmal schriftlich die Zinsen ausrechnen',
     r'mit $K + 10 \cdot 3$', r'im Kopf schätzen reicht immer'],
    [r'Schriftlich zehn Jahre einzeln ist lang und fehleranfällig.',
     r'Die Potenz $1{,}03^{10}$ fasst zehn Schritte zusammen.',
     r'Eine Tabellenkalkulation zeigt zusätzlich jedes einzelne Jahr.'])

Q.q(r'Bei welcher Aufgabe ist Kopfrechnen das beste Rechenhilfsmittel?',
    [r'1 % Zinsen von 600 € für ein Jahr', r'Kapital nach 25 Jahren mit 2,7 % Zinseszins',
     r'Zinsplan für 40 Konten', r'Tageszinsen für 1873,45 € in 47 Tagen'],
    [r'1 % von 600 € sind 6 € – das geht sofort im Kopf.',
     r'Lange Rechnungen macht man mit Taschenrechner oder Tabellenkalkulation.',
     r'Für jede Aufgabe das passende Hilfsmittel wählen.'])

Q.q(r'1000 € liegen 2 Jahre zu 5 %. Wie viel mehr bringt der Zinseszins als Zinsen ohne Zinseszins?',
    [r'2,50 €', r'0 €', r'5 €', r'50 €'],
    [r'Mit Zinseszins: 1102,50 €.',
     r'Ohne Zinseszins: $1000 + 2 \cdot 50 = 1100$ €.',
     r'Unterschied 2,50 € – die 5 % Zinsen auf die ersten 50 € Zinsen.'])


def check():
    assert grow(1000, 5, 2) == D('1102.5') and 1000 + 2 * 50 == 1100
    assert grow(500, 4, 1) == 520 and grow(500, 4, 2) - 520 == D('20.8')
    assert cent(grow(2000, 2, 3)) == D('2122.42') and grow(2000, 2, 3) == D('2122.416')
    assert grow(2000, 10, 2) == 2420 and grow(1, 10, 2) == D('1.21')
    assert D(1210) / D('1.1') / D('1.1') == 1000
    assert (100 * D('1.05') + 100) * D('1.05') == D('215.25')
    assert grow(1000, 10, 7) < 2000 < grow(1000, 10, 8) and cent(grow(1000, 10, 8)) == D('2143.59')
    assert cent(grow(1000, 10, 7)) == D('1948.72')
    assert 72 / 6 == 12 and abs(1.06 ** 12 - 2.01) < 0.01
    assert cent(grow(1000, 3, 3)) == D('1092.73') and 3 * 31 == 93
    assert 600 * D('0.01') == 6 and cent(grow(1000, 4, 5)) == D('1216.65')


Q.verify(check)
Q.save()
