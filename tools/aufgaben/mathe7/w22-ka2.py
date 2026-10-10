#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 22 / KW 5: mixed preparation for Klassenarbeit 2
(LB 2 Elemente der Stochastik, LB 3 Rationale Zahlen und Gleichungen). Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os7

Q = os7(nr=22, slug='ka2', thema='Klassenarbeit 2: Stochastik und rationale Zahlen', lb='KA 2',
        blurb='gemischte Aufgaben zu LB 2 und LB 3 zur Vorbereitung auf die Klassenarbeit',
        comment='Blocks: stochastics (1-6), rational numbers (7-12, 20), coordinates (13-14), terms and equations (15-19).')

Q.q(r'Ein Glücksrad hat 8 gleich große Felder mit den Zahlen 1 bis 8. Welche Menge beschreibt das Ereignis „Zahl ist durch 3 teilbar“?',
    [r'$\{3;\ 6\}$', r'$\{3;\ 6;\ 9\}$', r'$\{1;\ 3;\ 6\}$', r'$\{3\}$'],
    [r'Mögliche Ergebnisse: 1 bis 8.',
     r'Durch 3 teilbar sind 3 und 6.',
     r'$E = \{3;\ 6\}$'])

Q.q(r'Dasselbe Glücksrad: Wie groß ist die Wahrscheinlichkeit, dass die Zahl durch 3 teilbar ist?',
    [r'$\dfrac{1}{4}$', r'$\dfrac{1}{3}$', r'$\dfrac{3}{8}$', r'$\dfrac{2}{3}$'],
    [r'Günstig: 2 Felder, möglich: 8 Felder.',
     r'$\dfrac{2}{8}$',
     r'$= \dfrac{1}{4}$'])

Q.q(r'Bei 120 Würfen fiel 18-mal die Sechs. Wie groß ist die relative Häufigkeit?',
    [r'0,15', r'18', r'0,18', r'0,6'],
    [r'$\dfrac{18}{120}$',
     r'Mit 6 kürzen: $\dfrac{3}{20}$',
     r'$= 0{,}15$'])

Q.q(r'Bei 75 Versuchen ist die relative Häufigkeit eines Ergebnisses 0,4. Wie oft ist es eingetreten?',
    [r'30', r'40', r'4', r'45'],
    [r'Absolute Häufigkeit = relative Häufigkeit · Anzahl',
     r'$0{,}4 \cdot 75$',
     r'$= 30$'])

Q.q(r'Ein Ereignis hat die Wahrscheinlichkeit 0,3. Wie groß ist die Wahrscheinlichkeit des Gegenereignisses?',
    [r'0,7', r'0,3', r'−0,3', r'1,3'],
    [r'Ereignis und Gegenereignis ergeben zusammen 1.',
     r'$1 - 0{,}3$',
     r'$= 0{,}7$'])

Q.q(r'Um herauszufinden, wie viele Menschen in einer Stadt gern Fahrrad fahren, wird nur vor einem Fahrradladen gefragt. Was ist das Problem?',
    [r'Die Befragten sind nicht typisch für alle, das Ergebnis wird zu hoch.', r'Es gibt kein Problem.',
     r'Fahrradfahrer antworten nie.', r'Man darf vor Läden nicht fragen.'],
    [r'Vor einem Fahrradladen trifft man besonders viele Radfahrende.',
     r'Die Stichprobe ist nicht repräsentativ.',
     r'Besser: zufällig ausgewählte Personen an verschiedenen Orten.'])

Q.q(r'Ordne von klein nach groß: −2,4; −2,04; 0; −3',
    [r'$-3 < -2{,}4 < -2{,}04 < 0$', r'$-2{,}04 < -2{,}4 < -3 < 0$', r'$0 < -2{,}04 < -2{,}4 < -3$', r'$-3 < -2{,}04 < -2{,}4 < 0$'],
    [r'Größerer Betrag heißt bei negativen Zahlen: kleiner.',
     r'Beträge: 3 > 2,4 > 2,04.',
     r'$-3 < -2{,}4 < -2{,}04 < 0$'])

Q.q(r'Wie groß ist $|-7{,}5|$?',
    [r'7,5', r'−7,5', r'0', r'75'],
    [r'Der Betrag ist der Abstand zur Null.',
     r'−7,5 ist 7,5 von 0 entfernt.',
     r'$|-7{,}5| = 7{,}5$'])

Q.q(r'Berechne $-8 + 3 - (-6)$.',
    [r'1', r'−11', r'−5', r'17'],
    [r'$-8 + 3 = -5$',
     r'$-5 - (-6) = -5 + 6$',
     r'$= 1$'])

Q.q(r'Berechne $(-6) \cdot (-0{,}5)$.',
    [r'3', r'−3', r'−6,5', r'12'],
    [r'$6 \cdot 0{,}5 = 3$',
     r'Minus mal Minus: Plus.',
     r'$= 3$'])

Q.q(r'Berechne $(-45) : 9$.',
    [r'−5', r'5', r'−36', r'−405'],
    [r'$45 : 9 = 5$',
     r'Minus durch Plus: Minus.',
     r'$= -5$'])

Q.q(r'Berechne $(-3)^2 - 4$.',
    [r'5', r'−13', r'13', r'−5'],
    [r'Potenz zuerst: $(-3)^2 = 9$',
     r'$9 - 4$',
     r'$= 5$'])

Q.q(r'Der Punkt $(-3 \mid 5)$ wird an der $x$-Achse gespiegelt. Welchen Bildpunkt erhält man?',
    [r'$(-3 \mid -5)$', r'$(3 \mid 5)$', r'$(3 \mid -5)$', r'$(5 \mid -3)$'],
    [r'An der $x$-Achse bleibt $x$ gleich.',
     r'$y$ wird zur Gegenzahl.',
     r'$(-3 \mid -5)$'])

Q.q(r'In welchem Quadranten liegt $(5 \mid -2)$?',
    [r'im IV. Quadranten', r'im II. Quadranten', r'im III. Quadranten', r'im I. Quadranten'],
    [r'$x$ positiv: rechts.',
     r'$y$ negativ: unten.',
     r'Rechts unten: IV. Quadrant.'])

Q.q(r'Berechne den Wert von $2x^2 - 3$ für $x = -2$.',
    [r'5', r'−11', r'13', r'−5'],
    [r'$(-2)^2 = 4$',
     r'$2 \cdot 4 - 3$',
     r'$= 5$'])

Q.q(r'Löse: $6x - 4 = 2x + 8$',
    [r'$x = 3$', r'$x = 1$', r'$x = 1{,}5$', r'$x = 12$'],
    [r'$-2x$: $4x - 4 = 8$',
     r'$+4$: $4x = 12$',
     r'$x = 3$'])

Q.q(r'Löse: $3 \cdot (x + 2) = 15$',
    [r'$x = 3$', r'$x = 5$', r'$x = 4{,}3$', r'$x = 13$'],
    [r'Durch 3 teilen: $x + 2 = 5$',
     r'$-2$',
     r'$x = 3$'])

Q.q(r'„Die Hälfte einer Zahl, vermehrt um 5, ergibt 1.“ Welche Zahl ist es?',
    [r'−8', r'8', r'−2', r'12'],
    [r'$\dfrac{x}{2} + 5 = 1$',
     r'$\dfrac{x}{2} = -4$',
     r'$x = -8$'])

Q.q(r'Stelle $s = v \cdot t$ nach $v$ um.',
    [r'$v = \dfrac{s}{t}$', r'$v = s \cdot t$', r'$v = \dfrac{t}{s}$', r'$v = s - t$'],
    [r'$v$ wird mit $t$ malgenommen.',
     r'Umkehrung: durch $t$ teilen.',
     r'$v = s : t$'])

Q.q(r'Nachts waren es −8 °C, mittags 5 °C. Um wie viel Grad ist es wärmer geworden?',
    [r'13 Grad', r'3 Grad', r'−13 Grad', r'−3 Grad'],
    [r'$5 - (-8)$',
     r'$= 5 + 8$',
     r'$= 13$ Grad'])


def check():
    assert {n for n in range(1, 9) if n % 3 == 0} == {3, 6} and F(2, 8) == F(1, 4)
    assert F(18, 120) == F('0.15') and D('0.4') * 75 == 30 and 1 - D('0.3') == D('0.7')
    assert sorted([D('-2.4'), D('-2.04'), D(0), D(-3)]) == [D(-3), D('-2.4'), D('-2.04'), D(0)] and abs(D('-7.5')) == D('7.5')
    assert -8 + 3 - (-6) == 1 and -6 * D('-0.5') == 3 and -45 / 9 == -5 and (-3) ** 2 - 4 == 5
    assert 2 * (-2) ** 2 - 3 == 5 and F(8 + 4, 6 - 2) == 3 and F(15, 3) - 2 == 3 and (1 - 5) * 2 == -8
    assert 5 - (-8) == 13


Q.verify(check)
Q.save()
