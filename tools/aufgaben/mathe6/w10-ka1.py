#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 10 / KW 45: mixed preparation for Klassenarbeit 1
(LB 1 Gebrochene Zahlen). Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D, ROUND_HALF_UP
from math import gcd
from quiz import os6
from osfig import zahlenstrahl

Q = os6(nr=10, slug='ka1', thema='Klassenarbeit 1: Gebrochene Zahlen', lb='KA 1',
        blurb='gemischte Aufgaben zu LB 1 zur Vorbereitung auf die Klassenarbeit',
        comment='Blocks: sets and number line (1-2), expanding and reducing (3-4), converting (5-7), ordering and rounding (8-9), four operations (10-17), mean and word problems (18-20).')

Q.q(r'Welche Menge enthält genau alle Teiler von 20?',
    [r'$\{1;\ 2;\ 4;\ 5;\ 10;\ 20\}$', r'$\{2;\ 4;\ 5;\ 10\}$', r'$\{1;\ 2;\ 4;\ 10;\ 20\}$', r'$\{20;\ 40;\ 60\}$'],
    [r'$20 = 1 \cdot 20 = 2 \cdot 10 = 4 \cdot 5$',
     r'1 und 20 gehören immer dazu.',
     r'$\{1;\ 2;\ 4;\ 5;\ 10;\ 20\}$'])

Q.q(r'Welcher Bruch gehört zum markierten Punkt?',
    [r'$\dfrac{5}{8}$', r'$\dfrac{5}{6}$', r'$\dfrac{3}{8}$', r'$\dfrac{8}{5}$'],
    [r'Von 0 bis 1 sind es 8 gleich große Teile: Achtel.',
     r'Der Punkt liegt beim fünften Strich.',
     r'Also $\dfrac{5}{8}$.'],
    fig=zahlenstrahl(0, 1, 8, [(F(5, 8), '?')]), figcap=r'Zahlenstrahl von 0 bis 1 in Achteln')

Q.q(r'Kürze $\dfrac{45}{60}$ vollständig.',
    [r'$\dfrac{3}{4}$', r'$\dfrac{9}{12}$', r'$\dfrac{15}{20}$', r'$\dfrac{4}{5}$'],
    [r'Größter gemeinsamer Teiler von 45 und 60 ist 15.',
     r'$\dfrac{45 : 15}{60 : 15} = \dfrac{3}{4}$',
     r'$\dfrac{9}{12}$ und $\dfrac{15}{20}$ haben den gleichen Wert, sind aber noch nicht fertig gekürzt.'])

Q.q(r'Erweitere $\dfrac{7}{8}$ auf den Nenner 40.',
    [r'$\dfrac{35}{40}$', r'$\dfrac{39}{40}$', r'$\dfrac{7}{40}$', r'$\dfrac{28}{40}$'],
    [r'$40 : 8 = 5$, also mit 5 erweitern.',
     r'$7 \cdot 5 = 35$',
     r'$\dfrac{7}{8} = \dfrac{35}{40}$'])

Q.q(r'Schreibe $\dfrac{3}{20}$ als Dezimalzahl.',
    [r'0,15', r'0,32', r'0,3', r'1,5'],
    [r'Mit 5 auf Hundertstel erweitern.',
     r'$\dfrac{3 \cdot 5}{20 \cdot 5} = \dfrac{15}{100}$',
     r'Also 0,15.'])

Q.q(r'Schreibe $\dfrac{5}{9}$ als Dezimalzahl.',
    [r'$0{,}\overline{5}$', r'$0{,}59$', r'$0{,}\overline{59}$', r'$1{,}8$'],
    [r'$5 : 9$: $50 : 9 = 5$ Rest 5, dann wieder $50 : 9$ …',
     r'$0{,}555\ldots$',
     r'Periodisch: $0{,}\overline{5}$.'])

Q.q(r'Schreibe 0,45 als vollständig gekürzten Bruch.',
    [r'$\dfrac{9}{20}$', r'$\dfrac{45}{10}$', r'$\dfrac{4}{5}$', r'$\dfrac{9}{2}$'],
    [r'$0{,}45 = \dfrac{45}{100}$',
     r'Mit 5 kürzen.',
     r'$\dfrac{9}{20}$'])

Q.q(r'Ordne von klein nach groß: 0,6; $\dfrac{5}{8}$; 0,58',
    [r'$0{,}58 < 0{,}6 < \dfrac{5}{8}$', r'$0{,}6 < 0{,}58 < \dfrac{5}{8}$',
     r'$\dfrac{5}{8} < 0{,}58 < 0{,}6$', r'$0{,}58 < \dfrac{5}{8} < 0{,}6$'],
    [r'$\dfrac{5}{8} = 0{,}625$',
     r'Vergleiche 0,580; 0,600; 0,625.',
     r'$0{,}58 < 0{,}6 < \dfrac{5}{8}$'])

Q.q(r'Runde 7,0549 auf Hundertstel.',
    [r'7,05', r'7,06', r'7,1', r'7,055'],
    [r'Hundertstelstelle: 5.',
     r'Die nächste Ziffer ist 4: abrunden.',
     r'7,0549 ≈ 7,05'])

Q.q(r'Berechne $\dfrac{5}{6} - \dfrac{1}{4}$.',
    [r'$\dfrac{7}{12}$', r'$\dfrac{4}{2}$', r'$\dfrac{1}{3}$', r'$\dfrac{13}{12}$'],
    [r'Hauptnenner 12.',
     r'$\dfrac{10}{12} - \dfrac{3}{12}$',
     r'$= \dfrac{7}{12}$'])

Q.q(r'Berechne $1\tfrac{2}{3} + 2\tfrac{1}{2}$.',
    [r'$4\tfrac{1}{6}$', r'$3\tfrac{3}{5}$', r'$3\tfrac{1}{6}$', r'$4\tfrac{5}{6}$'],
    [r'Ganze: $1 + 2 = 3$',
     r'Brüche: $\dfrac{4}{6} + \dfrac{3}{6} = \dfrac{7}{6} = 1\tfrac{1}{6}$',
     r'$3 + 1\tfrac{1}{6} = 4\tfrac{1}{6}$'])

Q.q(r'Berechne $15{,}3 - 8{,}75$.',
    [r'6,55', r'7,45', r'6,65', r'7,55'],
    [r'Komma unter Komma: $15{,}30 - 8{,}75$',
     r'Ergänzen: Von 8,75 bis 9 fehlen 0,25, von 9 bis 15,3 fehlen 6,3. Zusammen $0{,}25 + 6{,}3 = 6{,}55$.',
     r'Probe: $6{,}55 + 8{,}75 = 15{,}30$.'])

Q.q(r'Berechne $\dfrac{3}{5} \cdot \dfrac{5}{6}$.',
    [r'$\dfrac{1}{2}$', r'$\dfrac{8}{11}$', r'$\dfrac{18}{25}$', r'$\dfrac{15}{11}$'],
    [r'$\dfrac{3 \cdot 5}{5 \cdot 6} = \dfrac{15}{30}$',
     r'Mit 15 kürzen.',
     r'$= \dfrac{1}{2}$'])

Q.q(r'Berechne $\dfrac{2}{3} : \dfrac{4}{9}$.',
    [r'$1\tfrac{1}{2}$', r'$\dfrac{8}{27}$', r'$\dfrac{2}{3}$', r'$\dfrac{6}{12}$'],
    [r'Mit dem Kehrwert malnehmen: $\dfrac{2}{3} \cdot \dfrac{9}{4}$',
     r'$= \dfrac{18}{12} = \dfrac{3}{2}$',
     r'$= 1\tfrac{1}{2}$'])

Q.q(r'Berechne $1{,}2 \cdot 0{,}3$.',
    [r'0,36', r'3,6', r'0,036', r'1,5'],
    [r'Ohne Komma: $12 \cdot 3 = 36$',
     r'Zusammen 2 Nachkommastellen.',
     r'$= 0{,}36$'])

Q.q(r'Berechne $7{,}5 : 0{,}5$.',
    [r'15', r'1,5', r'3,75', r'150'],
    [r'Beide Kommas um eine Stelle verschieben: $75 : 5$',
     r'$= 15$',
     r'Durch ein Halb teilen heißt verdoppeln.'])

Q.q(r'Berechne $6 - 1{,}5 \cdot 2 + 0{,}5$.',
    [r'3,5', r'9,5', r'2,5', r'4'],
    [r'Punkt vor Strich: $1{,}5 \cdot 2 = 3$',
     r'Dann von links nach rechts: $6 - 3 + 0{,}5$',
     r'$= 3{,}5$'])

Q.q(r'Vier Personen sind 1,52 m, 1,48 m, 1,61 m und 1,55 m groß. Wie groß sind sie im Durchschnitt?',
    [r'1,54 m', r'1,55 m', r'1,53 m', r'6,16 m'],
    [r'Summe: $1{,}52 + 1{,}48 + 1{,}61 + 1{,}55 = 6{,}16$ m',
     r'$6{,}16 : 4 = 1{,}54$',
     r'Im Mittel 1,54 m.'])

Q.q(r'Ein Kuchen hat 12 Stücke. Paul isst $\dfrac{1}{4}$ des Kuchens, Ida $\dfrac{1}{3}$. Wie viele Stücke bleiben übrig?',
    [r'5', r'7', r'2', r'10'],
    [r'Paul: $\dfrac{1}{4}$ von 12 = 3 Stücke',
     r'Ida: $\dfrac{1}{3}$ von 12 = 4 Stücke',
     r'Übrig: $12 - 3 - 4 = 5$ Stücke'])

Q.q(r'Löse inhaltlich: $3 : 8 = 15 : x$',
    [r'$x = 40$', r'$x = 20$', r'$x = 24$', r'$x = 45$'],
    [r'Von 3 auf 15: mal 5.',
     r'Also auch $8 \cdot 5 = 40$.',
     r'$3 : 8 = 15 : 40$, beide Verhältnisse sind 0,375.'])


def check():
    T = lambda n: {d for d in range(1, n + 1) if n % d == 0}
    assert T(20) == {1, 2, 4, 5, 10, 20}
    assert gcd(45, 60) == 15 and F(45, 60) == F(3, 4) == F(9, 12) == F(15, 20)
    assert F(7, 8) == F(35, 40)
    assert F(3, 20) == F('0.15')
    assert F(5, 9) * 9 == 5 and (50 // 9, 50 % 9) == (5, 5)
    assert F('0.45') == F(9, 20)
    assert F('0.58') < F('0.6') < F(5, 8) == F('0.625')
    assert D('7.0549').quantize(D('0.01'), rounding=ROUND_HALF_UP) == D('7.05')
    assert F(5, 6) - F(1, 4) == F(7, 12)
    assert 1 + F(2, 3) + 2 + F(1, 2) == 4 + F(1, 6)
    assert D('15.3') - D('8.75') == D('6.55')
    assert F(3, 5) * F(5, 6) == F(1, 2)
    assert F(2, 3) / F(4, 9) == F(3, 2)
    assert D('1.2') * D('0.3') == D('0.36')
    assert D('7.5') / D('0.5') == 15
    assert 6 - D('1.5') * 2 + D('0.5') == D('3.5')
    assert (D('1.52') + D('1.48') + D('1.61') + D('1.55')) / 4 == D('1.54')
    assert 12 - 12 // 4 - 12 // 3 == 5
    assert F(3, 8) == F(15, 40) == F('0.375')


Q.verify(check)
Q.save()
