#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 2 / KW 35 (LB 1): percent as hundredths,
convenient percentages as fractions and decimals, mental percent arithmetic.
Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os7

Q = os7(nr=2, slug='bequeme-prozentsaetze', thema='Prozent: bequeme Prozentsätze', lb='LB 1',
        blurb='Prozent als Hundertstel, 50 %, 25 %, 20 %, 10 %, 1 %, Anteile vergleichen',
        comment='Blocks: percent, fraction, decimal (1-9, 17-19), convenient percentages of amounts (10-14, 20), comparing shares (15-16).')

P = lambda p: F(str(p)) / 100

# ----------------------------------------------- percent, fraction, decimal ----
Q.q(r'Was bedeutet 1 %?',
    [r'$\dfrac{1}{100}$', r'$\dfrac{1}{10}$', r'$\dfrac{1}{1000}$', r'1'],
    [r'„Prozent“ kommt aus dem Lateinischen: „von Hundert“.',
     r'1 % ist ein Hundertstel.',
     r'$1\,\% = \dfrac{1}{100} = 0{,}01$'])

Q.q(r'Welcher Bruch ist 50 %?',
    [r'$\dfrac{1}{2}$', r'$\dfrac{1}{50}$', r'$\dfrac{5}{100}$', r'$\dfrac{2}{5}$'],
    [r'$50\,\% = \dfrac{50}{100}$',
     r'Mit 50 kürzen.',
     r'$= \dfrac{1}{2}$ – die Hälfte.'])

Q.q(r'Welcher Bruch ist 25 %?',
    [r'$\dfrac{1}{4}$', r'$\dfrac{1}{25}$', r'$\dfrac{2}{5}$', r'$\dfrac{1}{5}$'],
    [r'$25\,\% = \dfrac{25}{100}$',
     r'Mit 25 kürzen.',
     r'$= \dfrac{1}{4}$ – ein Viertel.'])

Q.q(r'Welcher Bruch ist 20 %?',
    [r'$\dfrac{1}{5}$', r'$\dfrac{1}{20}$', r'$\dfrac{1}{4}$', r'$\dfrac{2}{100}$'],
    [r'$20\,\% = \dfrac{20}{100}$',
     r'Mit 20 kürzen.',
     r'$= \dfrac{1}{5}$ – ein Fünftel.'])

Q.q(r'Welcher Bruch ist 75 %?',
    [r'$\dfrac{3}{4}$', r'$\dfrac{7}{5}$', r'$\dfrac{3}{5}$', r'$\dfrac{1}{75}$'],
    [r'$75\,\% = \dfrac{75}{100}$',
     r'Mit 25 kürzen.',
     r'$= \dfrac{3}{4}$ – drei Viertel.'])

Q.q(r'Wie viel Prozent sind $\dfrac{3}{5}$?',
    [r'60 %', r'35 %', r'53 %', r'30 %'],
    [r'Auf Hundertstel erweitern: mit 20.',
     r'$\dfrac{3}{5} = \dfrac{60}{100}$',
     r'= 60 %'])

Q.q(r'Wie viel Prozent sind 0,35?',
    [r'35 %', r'3,5 %', r'0,35 %', r'350 %'],
    [r'0,35 sind 35 Hundertstel.',
     r'Hundertstel sind Prozent.',
     r'0,35 = 35 %'])

Q.q(r'Schreibe 7 % als Dezimalzahl.',
    [r'0,07', r'0,7', r'7,0', r'0,007'],
    [r'7 % sind 7 Hundertstel.',
     r'$\dfrac{7}{100}$',
     r'= 0,07'])

Q.q(r'Welcher Bruch ist 12,5 %?',
    [r'$\dfrac{1}{8}$', r'$\dfrac{1}{125}$', r'$\dfrac{1}{12}$', r'$\dfrac{5}{12}$'],
    [r'12,5 % ist die Hälfte von 25 %.',
     r'Die Hälfte von $\dfrac{1}{4}$ ist $\dfrac{1}{8}$.',
     r'Probe: $1 : 8 = 0{,}125 = 12{,}5\,\%$.'])

Q.q(r'Welcher Bruch ist ungefähr $33\tfrac{1}{3}$ %?',
    [r'$\dfrac{1}{3}$', r'$\dfrac{1}{33}$', r'$\dfrac{3}{10}$', r'$\dfrac{1}{4}$'],
    [r'$\dfrac{1}{3} = 0{,}333\ldots$',
     r'Das sind $33{,}3\ldots\,\%$.',
     r'Genau: $33\tfrac{1}{3}\,\% = \dfrac{1}{3}$.'])

Q.q(r'Was bedeutet 150 %?',
    [r'das Eineinhalbfache, also 1,5', r'die Hälfte', r'15 Hundertstel', r'Mehr als 100 % gibt es nicht.'],
    [r'100 % ist das Ganze.',
     r'150 % sind $\dfrac{150}{100} = 1{,}5$.',
     r'Zum Beispiel ist ein Preis von 150 % das Eineinhalbfache des alten Preises.'])

# --------------------------------------------- percentages of amounts ----
Q.q(r'Wie viel sind 50 % von 84 €?',
    [r'42 €', r'34 €', r'50 €', r'168 €'],
    [r'50 % ist die Hälfte.',
     r'$84 : 2$',
     r'= 42 €'])

Q.q(r'Wie viel sind 25 % von 60 kg?',
    [r'15 kg', r'25 kg', r'35 kg', r'240 kg'],
    [r'25 % ist ein Viertel.',
     r'$60 : 4$',
     r'= 15 kg'])

Q.q(r'Wie viel sind 10 % von 230 m?',
    [r'23 m', r'2,3 m', r'220 m', r'10 m'],
    [r'10 % ist ein Zehntel.',
     r'$230 : 10$',
     r'= 23 m'])

Q.q(r'Wie viel sind 1 % von 450 €?',
    [r'4,50 €', r'45 €', r'0,45 €', r'449 €'],
    [r'1 % ist ein Hundertstel.',
     r'$450 : 100$',
     r'= 4,50 €'])

Q.q(r'Wie viel sind 20 % von 35 Personen?',
    [r'7', r'15', r'20', r'5'],
    [r'20 % ist ein Fünftel.',
     r'$35 : 5$',
     r'= 7 Personen'])

Q.q(r'Wie viel sind 30 % von 70 €? (Tipp: über 10 %)',
    [r'21 €', r'30 €', r'40 €', r'2,10 €'],
    [r'10 % von 70 € sind 7 €.',
     r'30 % sind dreimal so viel.',
     r'$3 \cdot 7 = 21$ €'])

# ------------------------------------------------------------ comparing shares ----
Q.q(r'In der 7a kommen 7 von 20 Personen mit dem Bus, in der 7b 8 von 25. Wo ist der Anteil größer?',
    [r'in der 7a (35 % statt 32 %)', r'in der 7b (32 % statt 35 %)', r'Die Anteile sind gleich.', r'in der 7b, weil 8 mehr als 7 ist'],
    [r'7a: $\dfrac{7}{20} = \dfrac{35}{100} = 35\,\%$',
     r'7b: $\dfrac{8}{25} = \dfrac{32}{100} = 32\,\%$',
     r'In Prozent kann man Anteile mit verschiedenen Ganzen gut vergleichen.'])

Q.q(r'Von 400 Personen einer Schule kommen 100 mit dem Fahrrad. Wie viel Prozent sind das?',
    [r'25 %', r'40 %', r'10 %', r'100 %'],
    [r'Anteil: $\dfrac{100}{400}$',
     r'$= \dfrac{1}{4}$',
     r'= 25 %'])


Q.q(r'Jonas hat in einem Test 18 von 20 Aufgaben richtig. Wie viel Prozent sind das?',
    [r'90 %', r'18 %', r'80 %', r'36 %'],
    [r'Anteil: $\dfrac{18}{20}$',
     r'Mit 5 auf Hundertstel erweitern: $\dfrac{90}{100}$',
     r'= 90 %'])

def check():
    assert P(1) == F(1, 100) and P(50) == F(1, 2) and P(25) == F(1, 4) and P(20) == F(1, 5) and P(75) == F(3, 4)
    assert F(3, 5) == P(60) and F('0.35') == P(35) and P(7) == F('0.07') and P('12.5') == F(1, 8)
    assert P(F(100, 3)) == F(1, 3) and P(150) == F(3, 2)
    assert P(50) * 84 == 42 and P(25) * 60 == 15 and P(10) * 230 == 23 and P(1) * 450 == F('4.5')
    assert P(20) * 35 == 7 and P(30) * 70 == 21
    assert F(7, 20) == P(35) > F(8, 25) == P(32)
    assert F(100, 400) == P(25) and F(18, 20) == P(90)


Q.verify(check)
Q.save()
