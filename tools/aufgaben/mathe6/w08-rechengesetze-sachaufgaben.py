#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 8 / KW 41 (LB 1): order of operations and laws with
fractions and decimals, arithmetic mean, proportions, simple equations, word problems.
Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os6

Q = os6(nr=8, slug='rechengesetze-sachaufgaben', thema='Rechengesetze, Mittelwert und Sachaufgaben', lb='LB 1',
        blurb='Vorrangregeln, Rechenvorteile, arithmetisches Mittel, Verhältnisgleichungen, Sachaufgaben',
        comment='Blocks: order and laws (1-6), mean (7-9), proportions and equations (10-15), word problems (16-20).')

# ------------------------------------------------------------ order and laws ----
Q.q(r'Berechne $2{,}5 + 1{,}5 \cdot 4$.',
    [r'8,5', r'16', r'10', r'7'],
    [r'Punktrechnung vor Strichrechnung.',
     r'$1{,}5 \cdot 4 = 6$',
     r'$2{,}5 + 6 = 8{,}5$'])

Q.q(r'Berechne $\left(\dfrac{3}{4} - \dfrac{1}{4}\right) \cdot 6$.',
    [r'3', r'$6\tfrac{1}{2}$', r'1,5', r'12'],
    [r'Die Klammer zuerst: $\dfrac{3}{4} - \dfrac{1}{4} = \dfrac{2}{4} = \dfrac{1}{2}$',
     r'$\dfrac{1}{2} \cdot 6 = 3$',
     r'Ohne Klammer wäre es eine ganz andere Aufgabe.'])

Q.q(r'Rechne geschickt: $0{,}25 \cdot 7{,}3 \cdot 4$',
    [r'7,3', r'29,2', r'1,825', r'73'],
    [r'Vertauschen: $0{,}25 \cdot 4 \cdot 7{,}3$',
     r'$0{,}25 \cdot 4 = 1$',
     r'$1 \cdot 7{,}3 = 7{,}3$'])

Q.q(r'Rechne geschickt: $8 \cdot 1{,}25 + 8 \cdot 0{,}75$',
    [r'16', r'10', r'8,2', r'20'],
    [r'Verteilungsgesetz rückwärts: Die 8 ausklammern.',
     r'$8 \cdot (1{,}25 + 0{,}75) = 8 \cdot 2$',
     r'$= 16$'])

Q.q(r'Berechne $\dfrac{1}{2} \cdot \left(6 + \dfrac{4}{5}\right)$.',
    [r'3,4', r'6,4', r'3,8', r'2,4'],
    [r'Verteilungsgesetz: $\dfrac{1}{2} \cdot 6 + \dfrac{1}{2} \cdot \dfrac{4}{5}$',
     r'$= 3 + \dfrac{2}{5}$',
     r'$= 3{,}4$'])

Q.q(r'Berechne $12 - (2{,}4 + 3{,}6) : 2$.',
    [r'9', r'3', r'7,8', r'12,6'],
    [r'Klammer zuerst: $2{,}4 + 3{,}6 = 6$',
     r'Punkt vor Strich: $6 : 2 = 3$',
     r'$12 - 3 = 9$'])

# --------------------------------------------------------------------- mean ----
Q.q(r'Jonas hat die Noten 2, 3, 1, 2, 4 und 3. Wie groß ist der Durchschnitt (das arithmetische Mittel)?',
    [r'2,5', r'2,0', r'3,0', r'15'],
    [r'Alle Werte addieren: $2 + 3 + 1 + 2 + 4 + 3 = 15$',
     r'Durch die Anzahl der Werte teilen: $15 : 6$',
     r'$= 2{,}5$'])

Q.q(r'In einer Woche wurden mittags 18,5 °C, 21 °C, 19,5 °C, 22 °C und 24 °C gemessen. Wie groß ist das arithmetische Mittel?',
    [r'21 °C', r'20,5 °C', r'22 °C', r'105 °C'],
    [r'Summe: $18{,}5 + 21 + 19{,}5 + 22 + 24 = 105$',
     r'Fünf Werte: $105 : 5 = 21$',
     r'Das Mittel ist 21 °C.'])

Q.q(r'Der Mittelwert von fünf Zahlen ist 8. Vier der Zahlen sind 6, 9, 7 und 10. Wie heißt die fünfte Zahl?',
    [r'8', r'7', r'9', r'40'],
    [r'Mittelwert 8 bei fünf Zahlen heißt: Die Summe ist $5 \cdot 8 = 40$.',
     r'Die vier bekannten Zahlen ergeben $6 + 9 + 7 + 10 = 32$.',
     r'Die fünfte Zahl ist $40 - 32 = 8$.'])

# ----------------------------------------------- proportions and equations ----
Q.q(r'Welche Zahl gehört in die Lücke? $2 : 5 = \square : 20$',
    [r'8', r'17', r'50', r'4'],
    [r'Von 5 auf 20 wurde mit 4 malgenommen.',
     r'Dann auch auf der anderen Seite: $2 \cdot 4 = 8$',
     r'$2 : 5 = 8 : 20$, beide Verhältnisse sind 0,4.'])

Q.q(r'Löse inhaltlich: $\dfrac{3}{4} = \dfrac{12}{x}$',
    [r'$x = 16$', r'$x = 9$', r'$x = 13$', r'$x = 48$'],
    [r'Vom Zähler 3 zum Zähler 12: mal 4.',
     r'Also auch beim Nenner: $4 \cdot 4 = 16$',
     r'$\dfrac{3}{4} = \dfrac{12}{16}$'])

Q.q(r'Für 4 Personen braucht man 300 g Nudeln. Wie viel braucht man für 6 Personen?',
    [r'450 g', r'200 g', r'302 g', r'500 g'],
    [r'Für 1 Person: $300 : 4 = 75$ g',
     r'Für 6 Personen: $6 \cdot 75 = 450$ g',
     r'Probe: 6 Personen sind anderthalbmal so viele wie 4, $1{,}5 \cdot 300 = 450$.'])

Q.q(r'Löse: $x + 2{,}7 = 5$',
    [r'$x = 2{,}3$', r'$x = 7{,}7$', r'$x = 3{,}3$', r'$x = 2{,}7$'],
    [r'Welche Zahl muss man zu 2,7 addieren, um 5 zu erhalten?',
     r'Umkehraufgabe: $5 - 2{,}7 = 2{,}3$',
     r'Probe: $2{,}3 + 2{,}7 = 5$.'])

Q.q(r'Löse: $3 \cdot x = 4{,}5$',
    [r'$x = 1{,}5$', r'$x = 13{,}5$', r'$x = 1{,}2$', r'$x = 7{,}5$'],
    [r'Welche Zahl ergibt mal 3 genau 4,5?',
     r'Umkehraufgabe: $4{,}5 : 3 = 1{,}5$',
     r'Probe: $3 \cdot 1{,}5 = 4{,}5$.'])

Q.q(r'Welche natürliche Zahl ist die größte Lösung von $x \cdot 0{,}5 < 3$?',
    [r'5', r'6', r'3', r'2'],
    [r'$x \cdot 0{,}5$ ist die Hälfte von $x$.',
     r'Die Hälfte muss kleiner als 3 sein, also $x < 6$.',
     r'Die größte natürliche Zahl kleiner als 6 ist 5. (Bei 6 wäre es genau 3.)'])

# ------------------------------------------------------------ word problems ----
Q.q(r'Ein Paket wiegt 2,4 kg. Darin sind 6 gleich schwere Bücher, die Verpackung wiegt 0,3 kg. Wie schwer ist ein Buch?',
    [r'0,35 kg', r'0,4 kg', r'0,45 kg', r'2,1 kg'],
    [r'Erst die Verpackung abziehen: $2{,}4 - 0{,}3 = 2{,}1$ kg',
     r'Dann auf 6 Bücher verteilen: $2{,}1 : 6 = 0{,}35$ kg',
     r'Ein Buch wiegt 350 g.'])

Q.q(r'Max hat 50 €. Er gibt zuerst ein Fünftel davon aus und danach noch 12,50 €. Wie viel Geld bleibt ihm?',
    [r'27,50 €', r'37,50 €', r'30 €', r'10 €'],
    [r'Ein Fünftel von 50 € sind $50 : 5 = 10$ €.',
     r'Ausgegeben: $10 + 12{,}50 = 22{,}50$ €',
     r'Übrig: $50 - 22{,}50 = 27{,}50$ €'])

Q.q(r'Zu welcher Frage passt die Rechnung $3 \cdot 1{,}20 + 2 \cdot 0{,}80$?',
    [r'Was kosten 3 Brötchen zu je 1,20 € und 2 Brezeln zu je 0,80 €?',
     r'Was kosten 3 Brötchen und 2 Brezeln zu je 1,20 €?',
     r'Wie viel Rückgeld gibt es auf 5 €, wenn man 3 Brötchen kauft?',
     r'Was kosten 5 Brötchen zu je 2 €?'],
    [r'$3 \cdot 1{,}20$: drei Dinge zu je 1,20 €.',
     r'$2 \cdot 0{,}80$: zwei Dinge zu je 0,80 €.',
     r'Das Pluszeichen fasst beide Einkäufe zusammen: $3{,}60 + 1{,}60 = 5{,}20$ €.'])

Q.q(r'Eine Zeitung schreibt: „Ein Drittel der 600 Personen unserer Schule kommt mit dem Bus.“ Wie viele Personen sind das?',
    [r'200', r'300', r'180', r'33'],
    [r'Ein Drittel heißt: durch 3 teilen.',
     r'$600 : 3 = 200$',
     r'200 Personen kommen mit dem Bus.'])

Q.q(r'Rechne geschickt: $4{,}7 + 3{,}8 + 5{,}3 + 6{,}2$',
    [r'20', r'19', r'20,2', r'21'],
    [r'Passende Partner suchen: $4{,}7 + 5{,}3 = 10$',
     r'und $3{,}8 + 6{,}2 = 10$',
     r'$10 + 10 = 20$'])


def check():
    assert D('2.5') + D('1.5') * 4 == D('8.5')
    assert (F(3, 4) - F(1, 4)) * 6 == 3
    assert D('0.25') * D('7.3') * 4 == D('7.3')
    assert 8 * D('1.25') + 8 * D('0.75') == 16
    assert F(1, 2) * (6 + F(4, 5)) == F('3.4')
    assert 12 - (D('2.4') + D('3.6')) / 2 == 9
    assert F(2 + 3 + 1 + 2 + 4 + 3, 6) == F('2.5')
    assert (D('18.5') + 21 + D('19.5') + 22 + 24) / 5 == 21
    assert 5 * 8 - (6 + 9 + 7 + 10) == 8
    assert F(2, 5) == F(8, 20)
    assert F(3, 4) == F(12, 16)
    assert 300 * F(6, 4) == 450
    assert 5 - D('2.7') == D('2.3')
    assert D('4.5') / 3 == D('1.5')
    assert max(x for x in range(0, 20) if x * F(1, 2) < 3) == 5
    assert (D('2.4') - D('0.3')) / 6 == D('0.35')
    assert 50 - F(1, 5) * 50 - F('12.5') == F('27.5')
    assert 3 * D('1.20') + 2 * D('0.80') == D('5.2')
    assert 600 / 3 == 200
    assert D('4.7') + D('3.8') + D('5.3') + D('6.2') == 20


Q.verify(check)
Q.save()
