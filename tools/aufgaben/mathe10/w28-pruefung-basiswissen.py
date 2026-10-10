#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 28 / KW 14: Prüfungsvorbereitung 1 – Basiswissen
ohne Hilfsmittel (Stoff Klasse 7 bis 10). Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=28, slug='pruefung-basiswissen', thema='Prüfungsvorbereitung 1: Basiswissen', lb='Prüfung',
         blurb='Terme, Gleichungen, Brüche, Prozent, Einheiten, Kreis und Körper, Funktionen, Statistik – ohne Taschenrechner',
         comment='Blocks: terms and equations (1-3, 14-15), fractions and percent (4-7), geometry and units (8-11, 16), functions (12-13), statistics and powers (17-20). Without calculator, pi = 3.14.')

Q.q(r'Multipliziere aus: $(x + 3)^2$.',
    [r'$x^2 + 6x + 9$', r'$x^2 + 9$', r'$x^2 + 3x + 9$', r'$2x + 6$'],
    [r'Erste binomische Formel: $(a + b)^2 = a^2 + 2ab + b^2$.', r'$x^2 + 2 \cdot 3 \cdot x + 9$'])

Q.q(r'Löse: $2x + 5 = 3x - 1$.',
    [r'$x = 6$', r'$x = 4$', r'$x = -6$', r'$x = \dfrac{4}{5}$'],
    [r'$-2x$ auf beiden Seiten: $5 = x - 1$.', r'$x = 6$. Probe: $17 = 17$.'])

Q.q(r'Löse: $x^2 = 49$.',
    [r'$x = 7$ oder $x = -7$', r'nur $x = 7$', r'$x = 24{,}5$', r'keine Lösung'],
    [r'$7^2 = 49$ und $(-7)^2 = 49$ – beide Zahlen erfüllen die Gleichung.'])

Q.q(r'Berechne $\dfrac{2}{3} + \dfrac{1}{4}$.',
    [r'$\dfrac{11}{12}$', r'$\dfrac{3}{7}$', r'$\dfrac{3}{12}$', r'$\dfrac{2}{12}$'],
    [r'Hauptnenner 12: $\dfrac{8}{12} + \dfrac{3}{12} = \dfrac{11}{12}$', r'Zähler und Nenner einzeln zu addieren ($\dfrac{3}{7}$) ist falsch.'])

Q.q(r'Berechne $1{,}5 : 0{,}5$.',
    [r'3', r'0,3', r'0,75', r'30'],
    [r'Wie oft passt 0,5 in 1,5? Dreimal.', r'Oder: beide mit 10 erweitern, $15 : 5 = 3$.'])

Q.q(r'Wie viel sind 20 % von 250?',
    [r'50', r'20', r'125', r'5'],
    [r'$20\,\% = \dfrac{1}{5}$', r'$250 : 5 = 50$'])

Q.q(r'Ein Preis von 120 € steigt um 15 %. Wie hoch ist er danach?',
    [r'138 €', r'135 €', r'18 €', r'102 €'],
    [r'15 % von 120: $12 + 6 = 18$ €.', r'$120 + 18 = 138$ €'])

Q.q(r'Ein Kreis hat den Radius 10 cm. Wie groß ist sein Flächeninhalt (mit $\pi \approx 3{,}14$)?',
    [r'314 cm²', r'62,8 cm²', r'31,4 cm²', r'100 cm²'],
    [r'$A = \pi r^2 \approx 3{,}14 \cdot 100 = 314$ cm²'])

Q.q(r'Ein Kreis hat den Durchmesser 10 cm. Wie groß ist sein Umfang (mit $\pi \approx 3{,}14$)?',
    [r'31,4 cm', r'78,5 cm', r'62,8 cm', r'15,7 cm'],
    [r'$u = \pi d \approx 3{,}14 \cdot 10 = 31{,}4$ cm'])

Q.q(r'Ein Würfel hat die Kantenlänge 3 cm. Wie groß ist sein Volumen?',
    [r'27 cm³', r'9 cm³', r'54 cm³', r'18 cm³'],
    [r'$V = 3^3 = 27$ cm³'])

Q.q(r'Wie viele Gramm sind 0,3 kg?',
    [r'300 g', r'30 g', r'3000 g', r'3 g'],
    [r'$1$ kg $= 1000$ g, also $0{,}3 \cdot 1000 = 300$ g.'])

Q.q(r'Wo schneidet der Graph von $y = 2x - 3$ die x-Achse?',
    [r'bei $x = 1{,}5$', r'bei $x = -3$', r'bei $x = 3$', r'bei $x = -1{,}5$'],
    [r'$0 = 2x - 3$', r'$x = 1{,}5$'])

Q.q(r'Eine Gerade geht durch $(0 \mid 1)$ und $(2 \mid 5)$. Wie groß ist ihr Anstieg?',
    [r'2', r'4', r'0,5', r'3'],
    [r'$m = \dfrac{5 - 1}{2 - 0} = \dfrac{4}{2} = 2$'])

Q.q(r'Löse das Gleichungssystem $x + y = 10$ und $x - y = 4$.',
    [r'$x = 7$, $y = 3$', r'$x = 3$, $y = 7$', r'$x = 6$, $y = 4$', r'$x = 14$, $y = -4$'],
    [r'Addieren: $2x = 14$, also $x = 7$.', r'Einsetzen: $7 + y = 10$, also $y = 3$.'])

Q.q(r'Löse: $x^2 - 5x + 6 = 0$.',
    [r'$x = 2$ oder $x = 3$', r'$x = -2$ oder $x = -3$', r'$x = 1$ oder $x = 6$', r'$x = 5$ oder $x = 6$'],
    [r'Zerlegen: $(x - 2)(x - 3) = 0$.', r'Probe mit $x = 2$: $4 - 10 + 6 = 0$.'])

Q.q(r'Ein rechtwinkliges Dreieck hat die Katheten 5 cm und 12 cm. Wie lang ist die Hypotenuse?',
    [r'13 cm', r'17 cm', r'7 cm', r'169 cm'],
    [r'$\sqrt{25 + 144} = \sqrt{169} = 13$ cm'])

Q.q(r'Berechne den Mittelwert von 4, 7, 9 und 12.',
    [r'8', r'9', r'7', r'32'],
    [r'$\dfrac{4 + 7 + 9 + 12}{4} = \dfrac{32}{4} = 8$'])

Q.q(r'Bestimme den Median von 3, 8, 5, 10, 6.',
    [r'6', r'5', r'8', r'6,4'],
    [r'Zuerst ordnen: 3, 5, 6, 8, 10.', r'Der mittlere Wert ist 6. (6,4 ist der Mittelwert.)'])

Q.q(r'Vereinfache: $10^3 \cdot 10^2$.',
    [r'$10^5$', r'$10^6$', r'$100^5$', r'$20^5$'],
    [r'Gleiche Basis: Exponenten addieren, $3 + 2 = 5$.'])

Q.q(r'Wie schreibt man 0,00045 in der Form $a \cdot 10^n$?',
    [r'$4{,}5 \cdot 10^{-4}$', r'$4{,}5 \cdot 10^{4}$', r'$45 \cdot 10^{-3}$', r'$4{,}5 \cdot 10^{-3}$'],
    [r'Das Komma rückt um vier Stellen nach rechts bis 4,5.', r'Dafür steht $10^{-4}$. ($45 \cdot 10^{-5}$ wäre auch richtig, aber nicht in der Normalform – und $45 \cdot 10^{-3}$ ist zu groß.)'])


def check():
    from fractions import Fraction as F
    from math import sqrt
    assert all((x + 3) ** 2 == x * x + 6 * x + 9 for x in range(-5, 6))
    assert 2 * 6 + 5 == 3 * 6 - 1 and 7 ** 2 == 49 == (-7) ** 2
    assert F(2, 3) + F(1, 4) == F(11, 12) and 1.5 / 0.5 == 3 and 0.2 * 250 == 50 and round(120 * 1.15, 2) == 138
    assert round(3.14 * 100, 2) == 314 and round(3.14 * 10, 2) == 31.4 and 3 ** 3 == 27 and round(0.3 * 1000) == 300
    assert 2 * 1.5 - 3 == 0 and (5 - 1) / 2 == 2 and 7 + 3 == 10 and 7 - 3 == 4
    assert all(x * x - 5 * x + 6 == 0 for x in (2, 3)) and sqrt(169) == 13
    assert (4 + 7 + 9 + 12) / 4 == 8 and sorted([3, 8, 5, 10, 6])[2] == 6 and sum([3, 8, 5, 10, 6]) / 5 == 6.4
    assert 10 ** 3 * 10 ** 2 == 10 ** 5 and abs(4.5e-4 - 0.00045) < 1e-15


Q.verify(check)
Q.save()
