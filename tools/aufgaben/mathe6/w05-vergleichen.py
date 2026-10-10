#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 5 / KW 38 (LB 1): comparing and ordering fractions and
decimals, rounding, estimating. Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D, ROUND_HALF_UP
from math import lcm
from quiz import os6

Q = os6(nr=5, slug='vergleichen', thema='Vergleichen, Ordnen und Runden', lb='LB 1',
        blurb='Brüche und Dezimalzahlen vergleichen und ordnen, Runden, Überschlagen',
        comment='Blocks: comparing fractions (1-4, 8-9), decimals (5-7), rounding and estimating (10-14), everyday and mixed (15-20).')

# ------------------------------------------------------ comparing fractions ----
Q.q(r'Welcher Bruch ist größer: $\dfrac{3}{5}$ oder $\dfrac{2}{3}$?',
    [r'$\dfrac{2}{3}$ ist größer.', r'$\dfrac{3}{5}$ ist größer.', r'Beide sind gleich groß.', r'Man kann sie nicht vergleichen.'],
    [r'Gleichnamig machen mit dem Nenner 15.',
     r'$\dfrac{3}{5} = \dfrac{9}{15}$ und $\dfrac{2}{3} = \dfrac{10}{15}$',
     r'10 Fünfzehntel sind mehr als 9 Fünfzehntel.'])

Q.q(r'Welches Zeichen gehört in die Lücke? $\dfrac{5}{8} \;\square\; \dfrac{7}{12}$',
    [r'$>$', r'$<$', r'$=$', r'Keines der Zeichen passt.'],
    [r'Gemeinsamer Nenner von 8 und 12 ist 24.',
     r'$\dfrac{5}{8} = \dfrac{15}{24}$ und $\dfrac{7}{12} = \dfrac{14}{24}$',
     r'$\dfrac{15}{24} > \dfrac{14}{24}$'])

Q.q(r'Welcher Bruch ist größer: $\dfrac{4}{7}$ oder $\dfrac{4}{9}$?',
    [r'$\dfrac{4}{7}$ ist größer.', r'$\dfrac{4}{9}$ ist größer.', r'Beide sind gleich groß.', r'Man muss erst gleichnamig machen.'],
    [r'Beide haben 4 Stücke – gleicher Zähler.',
     r'Siebtel sind größere Stücke als Neuntel.',
     r'Also ist $\dfrac{4}{7}$ größer. (Gleichnamig machen geht auch, ist hier aber nicht nötig.)'])

Q.q(r'Ordne von klein nach groß: $\dfrac{1}{2}$, $\dfrac{2}{5}$, $\dfrac{3}{4}$',
    [r'$\dfrac{2}{5} < \dfrac{1}{2} < \dfrac{3}{4}$', r'$\dfrac{1}{2} < \dfrac{2}{5} < \dfrac{3}{4}$',
     r'$\dfrac{1}{2} < \dfrac{3}{4} < \dfrac{2}{5}$', r'$\dfrac{3}{4} < \dfrac{1}{2} < \dfrac{2}{5}$'],
    [r'Als Dezimalzahlen: $\dfrac{1}{2} = 0{,}5$, $\dfrac{2}{5} = 0{,}4$, $\dfrac{3}{4} = 0{,}75$',
     r'$0{,}4 < 0{,}5 < 0{,}75$',
     r'Also $\dfrac{2}{5} < \dfrac{1}{2} < \dfrac{3}{4}$.'])

# ---------------------------------------------------------------- decimals ----
Q.q(r'Welche Zahl ist am größten?',
    [r'0,7', r'0,65', r'0,07', r'0,699'],
    [r'Stelle für Stelle vergleichen, von links nach rechts.',
     r'Zehntel: 7, 6, 0 und 6 – die 7 Zehntel gewinnen.',
     r'Mehr Ziffern heißt nicht größer: $0{,}7 = 0{,}700 > 0{,}699$.'])

Q.q(r'Ordne von klein nach groß: 0,3; 0,25; $\dfrac{1}{3}$',
    [r'$0{,}25 < 0{,}3 < \dfrac{1}{3}$', r'$0{,}3 < 0{,}25 < \dfrac{1}{3}$',
     r'$\dfrac{1}{3} < 0{,}25 < 0{,}3$', r'$0{,}25 < \dfrac{1}{3} < 0{,}3$'],
    [r'$\dfrac{1}{3} = 0{,}333\ldots$',
     r'Vergleiche $0{,}250$; $0{,}300$; $0{,}333\ldots$',
     r'Also $0{,}25 < 0{,}3 < \dfrac{1}{3}$.'])

Q.q(r'Welche Zahl liegt zwischen $\dfrac{1}{4}$ und $\dfrac{1}{2}$?',
    [r'$\dfrac{1}{3}$', r'$\dfrac{1}{5}$', r'$\dfrac{2}{3}$', r'0,6'],
    [r'$\dfrac{1}{4} = 0{,}25$ und $\dfrac{1}{2} = 0{,}5$',
     r'$\dfrac{1}{3} = 0{,}33\ldots$ liegt dazwischen.',
     r'$\dfrac{1}{5} = 0{,}2$ ist zu klein, $\dfrac{2}{3}$ und 0,6 sind zu groß.'])

Q.q(r'Welcher Nenner ist der kleinste gemeinsame Nenner von $\dfrac{2}{3}$ und $\dfrac{3}{4}$?',
    [r'12', r'7', r'24', r'6'],
    [r'Gesucht: die kleinste Zahl, die Vielfaches von 3 und von 4 ist.',
     r'Vielfache von 4: 4, 8, 12 … – die 12 ist auch durch 3 teilbar.',
     r'$\dfrac{2}{3} = \dfrac{8}{12}$ und $\dfrac{3}{4} = \dfrac{9}{12}$'])

Q.q(r'Welcher Bruch ist größer als ein Halb?',
    [r'$\dfrac{5}{9}$', r'$\dfrac{4}{9}$', r'$\dfrac{3}{8}$', r'$\dfrac{6}{13}$'],
    [r'Ein Bruch ist größer als ein Halb, wenn der Zähler mehr als die Hälfte des Nenners ist.',
     r'Die Hälfte von 9 ist 4,5. 5 ist mehr als 4,5.',
     r'Bei $\dfrac{3}{8}$ wäre die Hälfte 4, bei $\dfrac{6}{13}$ wäre sie 6,5.'])

# ------------------------------------------------- rounding and estimating ----
Q.q(r'Runde 3,476 auf Zehntel.',
    [r'3,5', r'3,4', r'3,48', r'3,0'],
    [r'Die Zehntelstelle ist die 4.',
     r'Die Ziffer danach ist 7, also aufrunden.',
     r'3,476 ≈ 3,5'])

Q.q(r'Runde 2,8349 auf Hundertstel.',
    [r'2,83', r'2,84', r'2,8', r'2,835'],
    [r'Die Hundertstelstelle ist die 3.',
     r'Entscheidend ist nur die nächste Ziffer: 4, also abrunden.',
     r'2,8349 ≈ 2,83 (nicht schrittweise runden!)'])

Q.q(r'Runde $\dfrac{2}{3}$ auf zwei Nachkommastellen.',
    [r'0,67', r'0,66', r'0,6', r'0,7'],
    [r'$\dfrac{2}{3} = 0{,}666\ldots$',
     r'Die dritte Nachkommastelle ist 6, also aufrunden.',
     r'$\dfrac{2}{3} \approx 0{,}67$'])

Q.q(r'Überschlage: $19{,}8 + 30{,}4 + 9{,}7$',
    [r'etwa 60', r'etwa 50', r'etwa 70', r'etwa 600'],
    [r'Runde auf ganze Zehner: 20, 30 und 10.',
     r'$20 + 30 + 10 = 60$',
     r'Genau: 59,9.'])

Q.q(r'Ist $\dfrac{7}{8} + \dfrac{5}{6}$ größer als 1?',
    [r'Ja, beide Brüche sind schon fast 1.', r'Nein, Brüche sind immer kleiner als 1.',
     r'Nein, das Ergebnis ist genau 1.', r'Das kann man ohne genaues Rechnen nicht sagen.'],
    [r'$\dfrac{7}{8}$ und $\dfrac{5}{6}$ sind beide größer als ein Halb.',
     r'Zwei Zahlen, die größer als ein Halb sind, ergeben zusammen mehr als 1.',
     r'Genau: $\dfrac{21}{24} + \dfrac{20}{24} = \dfrac{41}{24} = 1\tfrac{17}{24}$.'])

# ------------------------------------------------------- everyday and mixed ----
Q.q(r'In der 6a fahren 12 von 20 Personen mit dem Bus, in der 6b 15 von 25. Wo ist der Anteil größer?',
    [r'Die Anteile sind gleich.', r'in der 6a', r'in der 6b', r'Das kann man nicht sagen.'],
    [r'6a: $\dfrac{12}{20} = \dfrac{6}{10} = 0{,}6$',
     r'6b: $\dfrac{15}{25} = \dfrac{6}{10} = 0{,}6$',
     r'In beiden Klassen fahren 6 von 10 mit dem Bus. (Die 6b hat nur mehr Personen.)'])

Q.q(r'Beim Sportfest laufen Anna 12,45 s, Ben 12,5 s, Cem 12,39 s und Dana 12,4 s. Wer ist am schnellsten?',
    [r'Cem', r'Ben', r'Anna', r'Dana'],
    [r'Am schnellsten ist, wer die kleinste Zeit braucht.',
     r'Alle haben 12 Sekunden; Zehntel vergleichen: 4, 5, 3, 4.',
     r'Cem hat nur 3 Zehntel: 12,39 s ist die kleinste Zeit.'])

Q.q(r'Ordne von groß nach klein: 1,05; 1,5; 1,15; 1,055',
    [r'$1{,}5 > 1{,}15 > 1{,}055 > 1{,}05$', r'$1{,}055 > 1{,}15 > 1{,}05 > 1{,}5$',
     r'$1{,}5 > 1{,}15 > 1{,}05 > 1{,}055$', r'$1{,}15 > 1{,}5 > 1{,}055 > 1{,}05$'],
    [r'Mit gleich vielen Stellen schreiben: 1,050; 1,500; 1,150; 1,055',
     r'Jetzt wie natürliche Zahlen vergleichen: 1500, 1150, 1055, 1050.',
     r'$1{,}5 > 1{,}15 > 1{,}055 > 1{,}05$'])

Q.q(r'Was ist größer: $\dfrac{3}{8}$ oder 0,4?',
    [r'0,4', r'$\dfrac{3}{8}$', r'Beide sind gleich groß.', r'Man kann sie nicht vergleichen.'],
    [r'$\dfrac{3}{8} = 3 : 8 = 0{,}375$',
     r'$0{,}375 < 0{,}400$',
     r'Also ist 0,4 größer.'])

Q.q(r'Welche Zahl liegt am nächsten an 1?',
    [r'$\dfrac{9}{10}$', r'$\dfrac{5}{4}$', r'$\dfrac{4}{5}$', r'1,15'],
    [r'Abstände zu 1: $\dfrac{9}{10}$ fehlt 0,1; $\dfrac{4}{5}$ fehlen 0,2.',
     r'$\dfrac{5}{4} = 1{,}25$ ist 0,25 zu viel, 1,15 ist 0,15 zu viel.',
     r'Der kleinste Abstand ist 0,1: $\dfrac{9}{10}$.'])

Q.q(r'Wie viele Brüche liegen zwischen $\dfrac{1}{3}$ und $\dfrac{1}{2}$?',
    [r'unendlich viele', r'keiner', r'genau einer', r'genau sechs'],
    [r'Gleichnamig machen: $\dfrac{2}{6}$ und $\dfrac{3}{6}$ – scheinbar nichts dazwischen.',
     r'Feiner einteilen: $\dfrac{4}{12} < \dfrac{5}{12} < \dfrac{6}{12}$, noch feiner: $\dfrac{8}{24} < \dfrac{9}{24} < \ldots$',
     r'Man kann immer feiner einteilen: Es gibt unendlich viele Brüche dazwischen.'])


def rnd(x, places):
    return D(x).quantize(D(1).scaleb(-places), rounding=ROUND_HALF_UP)


def check():
    assert F(2, 3) > F(3, 5) and F(3, 5) == F(9, 15) and F(2, 3) == F(10, 15)
    assert lcm(8, 12) == 24 and F(5, 8) == F(15, 24) and F(7, 12) == F(14, 24) and F(5, 8) > F(7, 12)
    assert F(4, 7) > F(4, 9)
    assert F(2, 5) < F(1, 2) < F(3, 4)
    assert max([D('0.7'), D('0.65'), D('0.07'), D('0.699')]) == D('0.7')
    assert D('0.25') < D('0.3') < F(1, 3)
    assert F(1, 4) < F(1, 3) < F(1, 2) and not F(1, 4) < F(1, 5) and F(2, 3) > F(1, 2) and F('0.6') > F(1, 2)
    assert lcm(3, 4) == 12 and F(2, 3) == F(8, 12) and F(3, 4) == F(9, 12)
    assert F(5, 9) > F(1, 2) and F(4, 9) < F(1, 2) and F(3, 8) < F(1, 2) and F(6, 13) < F(1, 2)
    assert rnd('3.476', 1) == D('3.5')
    assert rnd('2.8349', 2) == D('2.83')
    assert round(2 / 3, 2) == 0.67
    assert 20 + 30 + 10 == 60 and D('19.8') + D('30.4') + D('9.7') == D('59.9')
    assert F(7, 8) + F(5, 6) == F(41, 24) == 1 + F(17, 24) and F(41, 24) > 1
    assert F(12, 20) == F(15, 25) == F(6, 10)
    times = {'Anna': D('12.45'), 'Ben': D('12.5'), 'Cem': D('12.39'), 'Dana': D('12.4')}
    assert min(times, key=times.get) == 'Cem'
    assert sorted([D('1.05'), D('1.5'), D('1.15'), D('1.055')], reverse=True) == [D('1.5'), D('1.15'), D('1.055'), D('1.05')]
    assert F(3, 8) == F('0.375') < F('0.4')
    dist = {k: abs(v - 1) for k, v in {'9/10': F(9, 10), '5/4': F(5, 4), '4/5': F(4, 5), '1,15': F('1.15')}.items()}
    assert min(dist, key=dist.get) == '9/10' and dist['9/10'] == F(1, 10)
    assert F(1, 3) < F(5, 12) < F(1, 2) and F(1, 3) == F(8, 24) and F(9, 24) < F(1, 2)


Q.verify(check)
Q.save()
