#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 30 / KW 16: Prüfungsvorbereitung 3 – Probeprüfung,
gemischt über den Stoff der Klassen 7 bis 10. Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=30, slug='pruefung-probe', thema='Prüfungsvorbereitung 3: Probeprüfung', lb='Prüfung',
         blurb='gemischte Aufgaben wie in der Abschlussprüfung: Statistik, Wahrscheinlichkeit, Geld, Körper, Trigonometrie, Gleichungen, Funktionen',
         comment='Blocks: statistics (1-2, 20), probability and expectation (3-5), money and percent (6-8, 16, 18), geometry and bodies (9-10, 14-15, 19), equations and functions (11-13, 17).')

Q.q(r'Bestimme die Spannweite der Werte 12, 7, 19, 4.',
    [r'15', r'10,5', r'12', r'19'],
    [r'Spannweite = größter minus kleinster Wert: $19 - 4 = 15$.'])

Q.q(r'Welcher Wert ist der Modalwert von 3, 5, 5, 7, 8?',
    [r'5', r'5,6', r'7', r'3'],
    [r'Der Modalwert ist der häufigste Wert: die 5 kommt zweimal vor.'])

Q.q(r'In einer Tüte sind 3 grüne und 5 rote Bonbons. Wie wahrscheinlich zieht man blind ein grünes?',
    [r'$\dfrac{3}{8}$', r'$\dfrac{3}{5}$', r'$\dfrac{5}{8}$', r'$\dfrac{1}{3}$'],
    [r'3 günstige von 8 möglichen.'])

Q.q(r'Zwei Würfel werden geworfen. Wie wahrscheinlich zeigen beide eine gerade Zahl?',
    [r'$\dfrac{1}{4}$', r'$\dfrac{1}{2}$', r'$\dfrac{1}{6}$', r'$\dfrac{1}{9}$'],
    [r'Je Würfel: $\dfrac{3}{6} = \dfrac{1}{2}$.', r'Beide: $\dfrac{1}{2} \cdot \dfrac{1}{2} = \dfrac{1}{4}$'])

Q.q(r'Ein Spiel kostet 2 € Einsatz. Mit 10 % Wahrscheinlichkeit gibt es 15 € Auszahlung, sonst nichts. Wie groß ist der erwartete Gewinn?',
    [r'$-0{,}50$ €', r'1,50 €', r'13 €', r'$-2$ €'],
    [r'Erwartete Auszahlung: $15 \cdot 0{,}1 = 1{,}50$ €.', r'Gewinn: $1{,}50 - 2 = -0{,}50$ €'])

Q.q(r'Ein Handy kostet 450 €. Man zahlt 20 % an, den Rest in 6 gleichen Raten ohne Zinsen. Wie hoch ist eine Rate?',
    [r'60 €', r'75 €', r'90 €', r'15 €'],
    [r'Anzahlung: $450 \cdot 0{,}2 = 90$ €, Rest: $360$ €.', r'Rate: $360 : 6 = 60$ €'])

Q.q(r'800 € liegen ein Jahr zu 2,5 %. Wie viel Zinsen gibt es?',
    [r'20 €', r'2 €', r'200 €', r'25 €'],
    [r'$800 \cdot 0{,}025 = 20$ €'])

Q.q(r'Vom Bruttolohn 2600 € gehen 21 % Abzüge ab. Wie hoch ist der Nettolohn?',
    [r'2054 €', r'546 €', r'2579 €', r'2100 €'],
    [r'$2600 \cdot 0{,}79 = 2054$ €'])

Q.q(r'Eine quadratische Pyramide hat die Grundkante 9 cm und die Höhe 12 cm. Wie groß ist ihr Volumen?',
    [r'324 cm³', r'972 cm³', r'108 cm³', r'486 cm³'],
    [r'$V = \dfrac{1}{3} \cdot 81 \cdot 12 = 324$ cm³'])

Q.q(r'Aus 30 m Entfernung erscheint die Spitze eines Gebäudes unter $35^\circ$ (vom Boden aus gemessen). Wie hoch ist das Gebäude (gerundet)?',
    [r'21,0 m', r'17,2 m', r'24,6 m', r'42,8 m'],
    [r'$h = 30 \cdot \tan 35^\circ \approx 30 \cdot 0{,}700 \approx 21{,}0$ m'])

Q.q(r'Löse: $0{,}5x + 2 = 7$.',
    [r'$x = 10$', r'$x = 4{,}5$', r'$x = 2{,}5$', r'$x = 18$'],
    [r'$0{,}5x = 5$', r'$x = 10$'])

Q.q(r'Löse: $x^2 + 2x - 8 = 0$.',
    [r'$x = 2$ oder $x = -4$', r'$x = -2$ oder $x = 4$', r'$x = 8$ oder $x = -1$', r'keine Lösung'],
    [r'$x = -1 \pm \sqrt{1 + 8} = -1 \pm 3$', r'Also $x = 2$ oder $x = -4$.'])

Q.q(r'Ein Bestand von 600 wächst jährlich um 10 %. Welche Gleichung beschreibt ihn nach $x$ Jahren?',
    [r'$y = 600 \cdot 1{,}1^x$', r'$y = 600 + 10x$', r'$y = 600 \cdot 0{,}1^x$', r'$y = 660x$'],
    [r'Anfangswert 600, Faktor $1{,}1$ pro Jahr.'])

Q.q(r'In einem Dreieck ist $a = 12$ cm, $\alpha = 55^\circ$ und $\beta = 65^\circ$. Wie lang ist $b$ (gerundet)?',
    [r'13,3 cm', r'10,8 cm', r'12,7 cm', r'14,2 cm'],
    [r'Sinussatz: $b = \dfrac{12 \cdot \sin 65^\circ}{\sin 55^\circ} \approx \dfrac{10{,}88}{0{,}819} \approx 13{,}3$ cm'])

Q.q(r'Ein Kegelstumpf hat $R = 6$ cm, $r = 3$ cm und $h = 5$ cm. Wie groß ist sein Volumen (gerundet)?',
    [r'329,9 cm³', r'565,5 cm³', r'188,5 cm³', r'471,2 cm³'],
    [r'$V = \dfrac{\pi \cdot 5}{3} (36 + 18 + 9) = \dfrac{5\pi}{3} \cdot 63 = 105\pi \approx 329{,}9$ cm³'])

Q.q(r'4000 € werden 5 Jahre zu 2 % mit Zinseszins angelegt. Wie hoch ist das Guthaben danach (gerundet)?',
    [r'4416,32 €', r'4400,00 €', r'4080,00 €', r'4500,00 €'],
    [r'$4000 \cdot 1{,}02^5 \approx 4000 \cdot 1{,}10408 \approx 4416{,}32$ €'])

Q.q(r'Für 8 Brötchen zahlt man 3,60 €. Was kosten 14 Brötchen?',
    [r'6,30 €', r'5,40 €', r'7,20 €', r'4,50 €'],
    [r'Ein Brötchen: $3{,}60 : 8 = 0{,}45$ €.', r'$14 \cdot 0{,}45 = 6{,}30$ €'])

Q.q(r'Der Anteil der Radfahrenden steigt von 20 % auf 25 %. Welche Aussage stimmt?',
    [r'Er steigt um 5 Prozentpunkte, das sind 25 % mehr.', r'Er steigt um 5 %.',
     r'Er steigt um 25 Prozentpunkte.', r'Er steigt um 45 %.'],
    [r'Die Differenz der Prozentsätze: $25 - 20 = 5$ Prozentpunkte.', r'Bezogen auf den alten Anteil: $\dfrac{5}{20} = 25\,\%$ mehr.'])

Q.q(r'Auf einem Plan im Maßstab 1 : 200 ist ein Zimmer 2,5 cm breit. Wie breit ist es in Wirklichkeit?',
    [r'5 m', r'50 cm', r'0,5 m', r'50 m'],
    [r'$2{,}5 \cdot 200 = 500$ cm $= 5$ m'])

Q.q(r'Vier Tests ergaben im Mittel 7 Punkte. Mit dem fünften Test steigt der Mittelwert auf 7,4. Wie viele Punkte hatte der fünfte Test?',
    [r'9', r'7,4', r'8', r'37'],
    [r'Summe vorher: $4 \cdot 7 = 28$, Summe nachher: $5 \cdot 7{,}4 = 37$.', r'Fünfter Test: $37 - 28 = 9$ Punkte'])


def check():
    from fractions import Fraction as F
    from math import sin, tan, pi, radians as r
    R = lambda x, n=2: round(x, n)
    assert 19 - 4 == 15 and F(3, 8) == F(3, 8) and F(1, 2) ** 2 == F(1, 4) and R(15 * 0.1 - 2) == -0.5
    assert (450 - 450 * 0.2) / 6 == 60 and 800 * 0.025 == 20 and R(2600 * 0.79) == 2054 and 81 * 12 / 3 == 324
    assert R(30 * tan(r(35)), 1) == 21.0 and R(30 * sin(r(35)), 1) == 17.2 and (7 - 2) / 0.5 == 10
    assert all(x * x + 2 * x - 8 == 0 for x in (2, -4))
    assert R(12 * sin(r(65)) / sin(r(55)), 1) == 13.3 and R(105 * pi, 1) == 329.9 and R(4000 * 1.02 ** 5) == 4416.32
    assert R(3.6 / 8 * 14) == 6.3 and 5 / 20 == 0.25 and 2.5 * 200 == 500 and R(5 * 7.4 - 4 * 7) == 9


Q.verify(check)
Q.save()
