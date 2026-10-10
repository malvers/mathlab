#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 6 / KW 39 (LB 1): adding and subtracting fractions, mixed
numbers and decimals, mental arithmetic, word problems. Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os6

Q = os6(nr=6, slug='addieren-subtrahieren', thema='Addieren und Subtrahieren', lb='LB 1',
        blurb='gleichnamige und ungleichnamige Brüche, gemischte Zahlen, Dezimalzahlen, Sachaufgaben',
        comment='Blocks: fractions (1-5), decimals and mixed (6-12), word problems (13-20).')

# --------------------------------------------------------------- fractions ----
Q.q(r'Berechne $\dfrac{1}{5} + \dfrac{2}{5}$.',
    [r'$\dfrac{3}{5}$', r'$\dfrac{3}{10}$', r'$\dfrac{2}{5}$', r'$\dfrac{3}{25}$'],
    [r'Gleichnamige Brüche: Zähler addieren, Nenner behalten.',
     r'$\dfrac{1 + 2}{5} = \dfrac{3}{5}$',
     r'Nenner addieren ist falsch: Fünftel bleiben Fünftel.'])

Q.q(r'Berechne $\dfrac{7}{9} - \dfrac{4}{9}$ und kürze.',
    [r'$\dfrac{1}{3}$', r'$\dfrac{11}{9}$', r'$\dfrac{3}{18}$', r'$\dfrac{1}{9}$'],
    [r'$\dfrac{7 - 4}{9} = \dfrac{3}{9}$',
     r'Mit 3 kürzen.',
     r'$\dfrac{3}{9} = \dfrac{1}{3}$'])

Q.q(r'Berechne $\dfrac{1}{2} + \dfrac{1}{3}$.',
    [r'$\dfrac{5}{6}$', r'$\dfrac{2}{5}$', r'$\dfrac{2}{6}$', r'$\dfrac{1}{6}$'],
    [r'Erst gleichnamig machen: Hauptnenner 6.',
     r'$\dfrac{1}{2} = \dfrac{3}{6}$ und $\dfrac{1}{3} = \dfrac{2}{6}$',
     r'$\dfrac{3}{6} + \dfrac{2}{6} = \dfrac{5}{6}$'])

Q.q(r'Berechne $\dfrac{3}{4} - \dfrac{1}{6}$.',
    [r'$\dfrac{7}{12}$', r'$\dfrac{5}{12}$', r'$\dfrac{1}{2}$', r'$\dfrac{1}{6}$'],
    [r'Hauptnenner von 4 und 6 ist 12.',
     r'$\dfrac{3}{4} = \dfrac{9}{12}$ und $\dfrac{1}{6} = \dfrac{2}{12}$',
     r'$\dfrac{9}{12} - \dfrac{2}{12} = \dfrac{7}{12}$'])

Q.q(r'Rechne im Kopf: $\dfrac{2}{3} + 20$',
    [r'$20\tfrac{2}{3}$', r'$\dfrac{22}{3}$', r'$\dfrac{22}{23}$', r'$\dfrac{2}{60}$'],
    [r'20 Ganze und dazu zwei Drittel.',
     r'Das schreibt man als gemischte Zahl.',
     r'$20 + \dfrac{2}{3} = 20\tfrac{2}{3}$'])

# ------------------------------------------------------- decimals and mixed ----
Q.q(r'Rechne im Kopf: $30{,}4 - 12{,}2$',
    [r'18,2', r'18,6', r'42,6', r'17,2'],
    [r'Ganze: $30 - 12 = 18$',
     r'Zehntel: $0{,}4 - 0{,}2 = 0{,}2$',
     r'Zusammen 18,2.'])

Q.q(r'Rechne im Kopf: $\dfrac{3}{4} + 0{,}5$',
    [r'1,25', r'0,8', r'1,2', r'0,125'],
    [r'Alles in Dezimalzahlen: $\dfrac{3}{4} = 0{,}75$',
     r'$0{,}75 + 0{,}5 = 1{,}25$',
     r'Oder in Brüchen: $\dfrac{3}{4} + \dfrac{2}{4} = \dfrac{5}{4} = 1\tfrac{1}{4}$.'])

Q.q(r'Berechne $2\tfrac{1}{2} + 1\tfrac{3}{4}$.',
    [r'$4\tfrac{1}{4}$', r'$3\tfrac{4}{6}$', r'$3\tfrac{1}{4}$', r'$4\tfrac{3}{4}$'],
    [r'Ganze: $2 + 1 = 3$',
     r'Brüche: $\dfrac{1}{2} + \dfrac{3}{4} = \dfrac{2}{4} + \dfrac{3}{4} = \dfrac{5}{4} = 1\tfrac{1}{4}$',
     r'$3 + 1\tfrac{1}{4} = 4\tfrac{1}{4}$'])

Q.q(r'Berechne $5 - 2\tfrac{3}{8}$.',
    [r'$2\tfrac{5}{8}$', r'$3\tfrac{3}{8}$', r'$3\tfrac{5}{8}$', r'$2\tfrac{3}{8}$'],
    [r'Schreibe 5 als $4\tfrac{8}{8}$.',
     r'$4\tfrac{8}{8} - 2\tfrac{3}{8} = 2\tfrac{5}{8}$',
     r'Probe: $2\tfrac{5}{8} + 2\tfrac{3}{8} = 4\tfrac{8}{8} = 5$.'])

Q.q(r'Berechne $4{,}75 + 2{,}8$.',
    [r'7,55', r'5,03', r'7,63', r'6,55'],
    [r'Komma unter Komma: 4,75 + 2,80',
     r'Hundertstel 5, Zehntel $7 + 8 = 15$ (1 Übertrag), Ganze $4 + 2 + 1 = 7$.',
     r'Ergebnis 7,55. Überschlag: $5 + 3 = 8$, passt ungefähr.'])

Q.q(r'Berechne $10 - 3{,}46$.',
    [r'6,54', r'7,46', r'7,54', r'6,64'],
    [r'Schreibe 10 als 10,00.',
     r'$10{,}00 - 3{,}46 = 6{,}54$',
     r'Probe: $6{,}54 + 3{,}46 = 10$.'])

Q.q(r'Rechne im Kopf: $0{,}9 + 0{,}15$',
    [r'1,05', r'0,24', r'1,5', r'0,105'],
    [r'0,9 sind 90 Hundertstel, 0,15 sind 15 Hundertstel.',
     r'$90 + 15 = 105$ Hundertstel',
     r'105 Hundertstel sind 1,05.'])

# ------------------------------------------------------------ word problems ----
Q.q(r'Mia kauft ein Heft für 1,85 € und einen Stift für 2,40 €. Sie bezahlt mit einem 5-€-Schein. Wie viel Geld bekommt sie zurück?',
    [r'0,75 €', r'1,25 €', r'0,85 €', r'4,25 €'],
    [r'Zusammen: $1{,}85 + 2{,}40 = 4{,}25$ €',
     r'Rückgeld: $5{,}00 - 4{,}25 = 0{,}75$ €',
     r'Mia bekommt 75 Cent zurück.'])

Q.q(r'Von einer Pizza isst Tim $\dfrac{3}{8}$ und Lea $\dfrac{1}{4}$. Wie viel bleibt übrig?',
    [r'$\dfrac{3}{8}$', r'$\dfrac{5}{8}$', r'$\dfrac{4}{12}$', r'$\dfrac{1}{2}$'],
    [r'Gegessen: $\dfrac{3}{8} + \dfrac{2}{8} = \dfrac{5}{8}$',
     r'Die ganze Pizza sind $\dfrac{8}{8}$.',
     r'Übrig: $\dfrac{8}{8} - \dfrac{5}{8} = \dfrac{3}{8}$'])

Q.q(r'Welche Zahl fehlt? $\square + \dfrac{2}{5} = \dfrac{9}{10}$',
    [r'$\dfrac{1}{2}$', r'$\dfrac{7}{5}$', r'$\dfrac{11}{10}$', r'$\dfrac{7}{10}$'],
    [r'Umkehraufgabe: $\dfrac{9}{10} - \dfrac{2}{5}$',
     r'$\dfrac{2}{5} = \dfrac{4}{10}$, also $\dfrac{9}{10} - \dfrac{4}{10} = \dfrac{5}{10}$',
     r'$\dfrac{5}{10} = \dfrac{1}{2}$'])

Q.q(r'Tom rechnet schriftlich $12{,}8 + 7{,}35$ und erhält 8,63. Was hat er falsch gemacht?',
    [r'Er hat nicht Komma unter Komma geschrieben; richtig ist 20,15.',
     r'Er hat den Übertrag vergessen; richtig ist 19,15.',
     r'Er hat subtrahiert statt addiert; richtig ist 5,45.',
     r'Nichts, 8,63 ist richtig.'],
    [r'Überschlag: $13 + 7 = 20$ – das Ergebnis 8,63 kann nicht stimmen.',
     r'Tom hat die Ziffern rechtsbündig untereinander geschrieben: $128 + 735 = 863$.',
     r'Komma unter Komma: $12{,}80 + 7{,}35 = 20{,}15$'])

Q.q(r'Ein Wanderweg ist 12 km lang. Am ersten Tag schafft die Gruppe $5\tfrac{3}{4}$ km, am zweiten $4\tfrac{1}{2}$ km. Wie viel fehlt noch?',
    [r'$1\tfrac{3}{4}$ km', r'$2\tfrac{1}{4}$ km', r'$1\tfrac{1}{4}$ km', r'$10\tfrac{1}{4}$ km'],
    [r'Geschafft: $5\tfrac{3}{4} + 4\tfrac{2}{4} = 9\tfrac{5}{4} = 10\tfrac{1}{4}$ km',
     r'Rest: $12 - 10\tfrac{1}{4} = 1\tfrac{3}{4}$ km',
     r'Mit Dezimalzahlen: $12 - 5{,}75 - 4{,}5 = 1{,}75$ km.'])

Q.q(r'Rechne geschickt: $\dfrac{3}{7} + \dfrac{5}{9} + \dfrac{4}{7}$',
    [r'$1\tfrac{5}{9}$', r'$\dfrac{12}{23}$', r'$1\tfrac{2}{9}$', r'$\dfrac{8}{9}$'],
    [r'Vertauschen: Die Siebtel zusammen nehmen.',
     r'$\dfrac{3}{7} + \dfrac{4}{7} = \dfrac{7}{7} = 1$',
     r'$1 + \dfrac{5}{9} = 1\tfrac{5}{9}$'])

Q.q(r'Am Morgen zeigt das Thermometer 2,5 °C. Bis zum Abend wird es um 4 Grad kälter. Was zeigt es am Abend?',
    [r'−1,5 °C', r'1,5 °C', r'6,5 °C', r'−6,5 °C'],
    [r'Bis 0 °C sind es 2,5 Grad.',
     r'Es fehlen noch $4 - 2{,}5 = 1{,}5$ Grad unter null.',
     r'Am Abend: −1,5 °C (lies: minus 1,5 Grad). Solche Zahlen lernst du in Klasse 7 genauer.'])

Q.q(r'Welche Rechnung ergibt genau 1?',
    [r'$\dfrac{1}{2} + \dfrac{1}{3} + \dfrac{1}{6}$', r'$\dfrac{1}{2} + \dfrac{1}{4} + \dfrac{1}{8}$',
     r'$0{,}5 + 0{,}25 + 0{,}2$', r'$\dfrac{1}{3} + \dfrac{1}{3} + 0{,}3$'],
    [r'Hauptnenner 6: $\dfrac{3}{6} + \dfrac{2}{6} + \dfrac{1}{6} = \dfrac{6}{6} = 1$',
     r'$\dfrac{1}{2} + \dfrac{1}{4} + \dfrac{1}{8} = \dfrac{7}{8}$ und $0{,}5 + 0{,}25 + 0{,}2 = 0{,}95$',
     r'$\dfrac{2}{3} + 0{,}3$ ist etwas weniger als 1.'])


def check():
    assert F(1, 5) + F(2, 5) == F(3, 5)
    assert F(7, 9) - F(4, 9) == F(1, 3)
    assert F(1, 2) + F(1, 3) == F(5, 6)
    assert F(3, 4) - F(1, 6) == F(7, 12) and F(3, 4) == F(9, 12) and F(1, 6) == F(2, 12)
    assert F(2, 3) + 20 == 20 + F(2, 3)
    assert D('30.4') - D('12.2') == D('18.2')
    assert F(3, 4) + F('0.5') == F('1.25') == F(5, 4)
    assert F(5, 2) + F(7, 4) == 4 + F(1, 4)
    assert 5 - (2 + F(3, 8)) == 2 + F(5, 8)
    assert D('4.75') + D('2.8') == D('7.55') and D('4.75') + D('0.28') == D('5.03')
    assert 10 - D('3.46') == D('6.54')
    assert D('0.9') + D('0.15') == D('1.05')
    assert D('1.85') + D('2.40') == D('4.25') and 5 - D('4.25') == D('0.75')
    assert 1 - F(3, 8) - F(1, 4) == F(3, 8)
    assert F(9, 10) - F(2, 5) == F(1, 2)
    assert D('12.8') + D('7.35') == D('20.15') and 128 + 735 == 863
    assert 12 - (5 + F(3, 4)) - (4 + F(1, 2)) == 1 + F(3, 4) and (5 + F(3, 4)) + (4 + F(1, 2)) == 10 + F(1, 4)
    assert F(3, 7) + F(5, 9) + F(4, 7) == 1 + F(5, 9)
    assert D('2.5') - 4 == D('-1.5')
    assert F(1, 2) + F(1, 3) + F(1, 6) == 1 and F(1, 2) + F(1, 4) + F(1, 8) == F(7, 8)
    assert D('0.5') + D('0.25') + D('0.2') == D('0.95') and F(2, 3) + F('0.3') < 1


Q.verify(check)
Q.save()
