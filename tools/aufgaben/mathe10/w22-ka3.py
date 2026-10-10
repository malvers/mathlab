#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 22 / KW 5: Vorbereitung Klassenarbeit 3 –
Zufallsgrößen und Geld im Alltag (LB 3 und LB 4 bis Woche 21). Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=22, slug='ka3', thema='Klassenarbeit 3: Zufallsgrößen und Geld im Alltag', lb='KA 3',
         blurb='gemischte Aufgaben zu Wahrscheinlichkeit, Erwartungswert, Simulation, Lohn, Zinsen und Kredit',
         comment='Blocks: probabilities (1, 9, 19), expectation and fairness (2-5, 16-17, 20), simulation and failure (6-8), money (10-15, 18). European roulette: 18 red of 37 numbers, red pays 1 to 1.')

Q.q(r'Zwei Würfel werden geworfen. Wie groß ist die Wahrscheinlichkeit für die Augensumme 8?',
    [r'$\dfrac{5}{36}$', r'$\dfrac{8}{36}$', r'$\dfrac{1}{6}$', r'$\dfrac{4}{36}$'],
    [r'Summe 8: (2,6), (3,5), (4,4), (5,3), (6,2) – fünf von 36 Paaren.'])

Q.q(r'X hat die Werte 1, 2 und 3 mit den Wahrscheinlichkeiten 0,2, 0,5 und 0,3. Berechne $E(X)$.',
    [r'2,1', r'2', r'6', r'1,0'],
    [r'$E(X) = 1 \cdot 0{,}2 + 2 \cdot 0{,}5 + 3 \cdot 0{,}3 = 0{,}2 + 1 + 0{,}9 = 2{,}1$'])

Q.q(r'Ein Spiel kostet 2 € Einsatz, man gewinnt mit Wahrscheinlichkeit $\dfrac{1}{4}$. Wie hoch muss die Auszahlung sein, damit es fair ist?',
    [r'8 €', r'4 €', r'6 €', r'2,50 €'],
    [r'Fair: erwartete Auszahlung = Einsatz.', r'$A \cdot \dfrac{1}{4} = 2$ €, also $A = 8$ €.'])

Q.q(r'Ein Glücksrad-Dreh kostet 1 €. Mit Wahrscheinlichkeit $\dfrac{1}{5}$ werden 3 € ausgezahlt, sonst nichts. Wie groß ist der erwartete Gewinn?',
    [r'$-0{,}40$ €', r'0,60 €', r'2 €', r'$-0{,}80$ €'],
    [r'Erwartete Auszahlung: $3 \cdot \dfrac{1}{5} = 0{,}60$ €.', r'Gewinn: $0{,}60 - 1 = -0{,}40$ €'])

Q.q(r'Welche Aussage ist richtig?',
    [r'Ein Spiel mit hoher Gewinnchance kann trotzdem eine negative Gewinnerwartung haben.', r'Ein Spiel mit 50 % Gewinnchance ist immer fair.',
     r'Ist der Erwartungswert negativ, verliert man jedes Spiel.', r'Der Erwartungswert ist immer eine ganze Zahl.'],
    [r'Beispiel: 90 % Chance auf 1 € Gewinn, 10 % Risiko von 20 € Verlust: $E = 0{,}9 - 2 = -1{,}10$ €.'])

Q.q(r'Wie simuliert man ein Ereignis mit 25 % Wahrscheinlichkeit mit Zufallszahlen von 1 bis 4?',
    [r'Es tritt ein, wenn die 1 kommt.', r'Es tritt ein, wenn die 1 oder 2 kommt.',
     r'Es tritt ein, wenn eine 25 kommt.', r'Das geht mit diesen Zahlen nicht.'],
    [r'Eine von vier gleich wahrscheinlichen Zahlen: $\dfrac{1}{4} = 25\,\%$.'])

Q.q(r'Bei 300 Simulationen trat ein Ereignis 63-mal ein. Wie groß ist die relative Häufigkeit?',
    [r'0,21', r'0,63', r'0,3', r'4,76'],
    [r'$\dfrac{63}{300} = 0{,}21$'])

Q.q(r'Drei Bauteile sind hintereinander geschaltet, jedes funktioniert mit 95 % Wahrscheinlichkeit. Wie wahrscheinlich funktioniert das Ganze (gerundet)?',
    [r'85,7 %', r'95 %', r'85 %', r'99,99 %'],
    [r'Alle drei müssen funktionieren: $0{,}95^3 \approx 0{,}857$.'])

Q.q(r'Eine Münze wird dreimal geworfen. Wie groß ist die Wahrscheinlichkeit, mindestens einmal Kopf zu werfen?',
    [r'$\dfrac{7}{8}$', r'$\dfrac{3}{8}$', r'$\dfrac{1}{2}$', r'$\dfrac{3}{2}$'],
    [r'Gegenereignis „dreimal Zahl“: $\left(\dfrac{1}{2}\right)^3 = \dfrac{1}{8}$.', r'$1 - \dfrac{1}{8} = \dfrac{7}{8}$'])

Q.q(r'Vom Bruttolohn 2800 € gehen 22 % Abzüge ab. Wie hoch ist der Nettolohn?',
    [r'2184 €', r'616 €', r'2778 €', r'2240 €'],
    [r'$2800 \cdot 0{,}78 = 2184$ €'])

Q.q(r'3000 € werden 3 Jahre zu 2 % mit Zinseszins angelegt. Wie hoch ist das Guthaben danach (gerundet)?',
    [r'3183,62 €', r'3180,00 €', r'3060,00 €', r'3120,00 €'],
    [r'$3000 \cdot 1{,}02^3 = 3000 \cdot 1{,}061208 \approx 3183{,}62$ €'])

Q.q(r'Ein Laptop kostet bar 1200 € oder 10 Raten zu 130 €. Wie viel teurer ist der Ratenkauf?',
    [r'100 €', r'130 €', r'1300 €', r'70 €'],
    [r'$10 \cdot 130 = 1300$ €', r'$1300 - 1200 = 100$ €'])

Q.q(r'Ein Konto ist 2 Monate lang mit 800 € überzogen, Dispozins 13,5 % pro Jahr. Wie viel Zinsen fallen an?',
    [r'18 €', r'108 €', r'216 €', r'9 €'],
    [r'$800 \cdot 0{,}135 \cdot \dfrac{2}{12} = 18$ €'])

Q.q(r'Der Lohn steigt um 4 %, die Preise um 3 %. Wie entwickelt sich die Kaufkraft ungefähr?',
    [r'Sie steigt um etwa 1 %.', r'Sie steigt um 4 %.', r'Sie sinkt um 3 %.', r'Sie steigt um 7 %.'],
    [r'$\dfrac{1{,}04}{1{,}03} \approx 1{,}0097$ – knapp 1 % mehr.'])

Q.q(r'Ein Gehalt von 2600 € steigt um 2,5 %. Wie hoch ist es danach?',
    [r'2665 €', r'2602,50 €', r'2625 €', r'2860 €'],
    [r'$2600 \cdot 1{,}025 = 2665$ €'])

Q.q(r'Bei einer Tombola mit 500 Losen gibt es einen Gewinn von 100 € und vier Gewinne von 25 €. Wie groß ist die erwartete Auszahlung pro Los?',
    [r'0,40 €', r'0,20 €', r'2,00 €', r'125 €'],
    [r'Gesamtauszahlung: $100 + 4 \cdot 25 = 200$ €.', r'$200 : 500 = 0{,}40$ €'])

Q.q(r'Ein Schaden von 15 000 € tritt mit 0,2 % Wahrscheinlichkeit pro Jahr ein. Wie hoch ist der erwartete Schaden pro Jahr?',
    [r'30 €', r'300 €', r'3 €', r'3000 €'],
    [r'$15\,000 \cdot 0{,}002 = 30$ €'])

Q.q(r'Nach 2 Jahren zu 2 % Zinseszins sind 5202 € auf dem Konto. Wie hoch war das Anfangskapital?',
    [r'5000 €', r'4994 €', r'5100 €', r'4800 €'],
    [r'$K_0 \cdot 1{,}02^2 = 5202$', r'$K_0 = 5202 : 1{,}0404 = 5000$ €'])

Q.q(r'In einer Urne liegen 4 rote und 6 blaue Kugeln. Man zieht zweimal mit Zurücklegen. Wie groß ist die Wahrscheinlichkeit für genau eine rote Kugel?',
    [r'0,48', r'0,24', r'0,4', r'0,16'],
    [r'Zwei Pfade: rot-blau und blau-rot.', r'$0{,}4 \cdot 0{,}6 + 0{,}6 \cdot 0{,}4 = 0{,}48$'])

Q.q(r'Beim Roulette mit 37 Zahlen sind 18 rot. Wer 1 € auf Rot setzt und gewinnt, bekommt 2 € (Einsatz plus 1 €). Wie groß ist der erwartete Gewinn (gerundet)?',
    [r'$-0{,}03$ €', r'0 €', r'0,50 €', r'$-0{,}50$ €'],
    [r'Erwartete Auszahlung: $2 \cdot \dfrac{18}{37} \approx 0{,}973$ €.', r'Gewinn: $0{,}973 - 1 \approx -0{,}03$ € – die grüne Null macht das Spiel unfair.'])


def check():
    from fractions import Fraction as F
    from itertools import product
    R = lambda x, n=2: round(x, n)
    assert F(sum(1 for a, b in product(range(1, 7), repeat=2) if a + b == 8), 36) == F(5, 36)
    assert R(0.2 + 1 + 0.9) == 2.1 and 2 / F(1, 4) == 8 and R(3 / 5 - 1) == -0.4
    assert R(0.9 - 0.1 * 20) == -1.1 and 63 / 300 == 0.21 and R(0.95 ** 3, 3) == 0.857
    assert 1 - F(1, 2) ** 3 == F(7, 8) and R(2800 * 0.78) == 2184 and R(3000 * 1.02 ** 3) == 3183.62
    assert 10 * 130 - 1200 == 100 and R(800 * 0.135 * 2 / 12) == 18 and R(1.04 / 1.03, 4) == 1.0097
    assert R(2600 * 1.025) == 2665 and (100 + 4 * 25) / 500 == 0.4 and R(15000 * 0.002) == 30
    assert R(5202 / 1.02 ** 2) == 5000 and R(2 * 0.4 * 0.6) == 0.48 and R(2 * 18 / 37 - 1) == -0.03


Q.verify(check)
Q.save()
