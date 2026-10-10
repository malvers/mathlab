#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 2 / KW 35 (LB 1): Terme und Termwerte,
Einsetzen in Formeln. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=2, slug='termwerte', thema='Terme und Termwerte', lb='LB 1',
        blurb='Termwerte mit rationalen Zahlen, Terme aufstellen, Einsetzen in Formeln',
        comment='Blocks: term values with negative numbers (1-4, 10, 16-17), setting up terms (7-8, 11, 20), formulas (5, 13-15, 18-19), mixed (6, 9, 12).')

# ------------------------------------------------------------- Termwerte ----
Q.q(r'Berechne den Wert des Terms $3x - 5$ für $x = 4$.',
    [r'7', r'29', r'2', r'−7'],
    [r'$3x$ bedeutet $3 \cdot x$.',
     r'$3 \cdot 4 - 5 = 12 - 5 = 7$'])

Q.q(r'Berechne den Wert des Terms $3x - 5$ für $x = -2$.',
    [r'−11', r'1', r'−1', r'11'],
    [r'Negative Zahlen beim Einsetzen in Klammern setzen: $3 \cdot (-2) - 5$.',
     r'$3 \cdot (-2) = -6$, dann $-6 - 5 = -11$.'])

Q.q(r'Berechne den Wert von $x^2 + 2x$ für $x = -3$.',
    [r'3', r'−15', r'15', r'−3'],
    [r'$(-3)^2 = 9$, denn minus mal minus ergibt plus.',
     r'$2 \cdot (-3) = -6$',
     r'$9 + (-6) = 3$'])

Q.q(r'Berechne den Wert von $2 \cdot (a - b)$ für $a = 5$ und $b = -3$.',
    [r'16', r'4', r'7', r'−16'],
    [r'Zuerst die Klammer: $5 - (-3) = 5 + 3 = 8$.',
     r'Dann $2 \cdot 8 = 16$.'])

# --------------------------------------------------------------- Formeln ----
Q.q(r'Ein Rechteck hat die Seiten $a = 4{,}5$ cm und $b = 2{,}5$ cm. Berechne den Umfang mit $u = 2 \cdot (a + b)$.',
    [r'14 cm', r'7 cm', r'11,5 cm', r'11,25 cm'],
    [r'Einsetzen: $u = 2 \cdot (4{,}5 + 2{,}5)$',
     r'$u = 2 \cdot 7 = 14$, also 14 cm.',
     r'11,25 wäre $a \cdot b$, der Flächeninhalt in cm².'])

Q.q(r'Für welche Zahl $x$ hat der Term $2x + 1$ den Wert 9?',
    [r'4', r'5', r'19', r'4,5'],
    [r'Gesucht ist $x$ mit $2x + 1 = 9$.',
     r'$2x = 8$, also $x = 4$.',
     r'Probe: $2 \cdot 4 + 1 = 9$'])

# --------------------------------------------------------- Terme aufstellen ----
Q.q(r'Ein Kinoticket kostet 9 €, eine Tüte Popcorn 4 €. Jede Person kauft beides. Welcher Term gibt die Kosten für $x$ Personen an?',
    [r'$13x$', r'$9 + 4x$', r'$9x + 4$', r'$36x$'],
    [r'Eine Person zahlt $9 + 4 = 13$ Euro.',
     r'$x$ Personen zahlen $9x + 4x = 13x$ Euro.'])

Q.q(r'Eine Taxifahrt kostet 3,50 € Grundgebühr und 2,10 € pro Kilometer. Welcher Term gibt den Preis in Euro für $x$ Kilometer an?',
    [r'$3{,}50 + 2{,}10x$', r'$2{,}10 + 3{,}50x$', r'$5{,}60x$', r'$3{,}50x + 2{,}10x$'],
    [r'Die Grundgebühr fällt einmal an, unabhängig von der Strecke.',
     r'Der Kilometerpreis wird mit der Anzahl $x$ der Kilometer multipliziert.',
     r'Preis: $3{,}50 + 2{,}10x$'])

Q.q(r'Was kostet die Taxifahrt aus der vorigen Aufgabe (3,50 € Grundgebühr, 2,10 € pro Kilometer) für 12 km?',
    [r'28,70 €', r'67,20 €', r'44,10 €', r'25,20 €'],
    [r'$3{,}50 + 2{,}10 \cdot 12$',
     r'$2{,}10 \cdot 12 = 25{,}20$',
     r'$3{,}50 + 25{,}20 = 28{,}70$, also 28,70 €.'])

Q.q(r'Berechne den Wert von $\dfrac{a + b}{2}$ für $a = -7$ und $b = 3$.',
    [r'−2', r'5', r'−5', r'2'],
    [r'Zähler: $-7 + 3 = -4$',
     r'$\dfrac{-4}{2} = -2$',
     r'Der Term ist der Mittelwert von $a$ und $b$: −2 liegt genau in der Mitte zwischen −7 und 3.'])

Q.q(r'Welcher Term hat für jede Zahl $x$ denselben Wert wie $x + x + x$?',
    [r'$3x$', r'$x^3$', r'$x + 3$', r'$3x^2$'],
    [r'Dreimal dieselbe Zahl addieren heißt mit 3 multiplizieren.',
     r'$x + x + x = 3 \cdot x = 3x$',
     r'$x^3 = x \cdot x \cdot x$ ist etwas anderes: für $x = 2$ ist $x^3 = 8$, aber $3x = 6$.'])

Q.q(r'Für welches $x$ haben die Terme $2x + 3$ und $x + 5$ denselben Wert?',
    [r'2', r'8', r'3', r'−2'],
    [r'Wertetabelle: Für $x = 2$ ist $2 \cdot 2 + 3 = 7$ und $2 + 5 = 7$.',
     r'Rechnerisch: $2x + 3 = x + 5$, also $x = 2$.'])

Q.q(r'Ein Aquarium ist 2,5 m lang, 4 m breit und 1,2 m hoch. Berechne das Volumen mit $V = a \cdot b \cdot c$.',
    [r'12 m³', r'7,7 m³', r'1,2 m³', r'120 m³'],
    [r'$V = 2{,}5 \cdot 4 \cdot 1{,}2$',
     r'$2{,}5 \cdot 4 = 10$, dann $10 \cdot 1{,}2 = 12$, also 12 m³.'])

Q.q(r'Ein Zug fährt 2,5 Stunden lang mit 80 km pro Stunde. Berechne den Weg mit $s = v \cdot t$.',
    [r'200 km', r'32 km', r'82,5 km', r'160 km'],
    [r'$s = 80 \cdot 2{,}5$',
     r'$80 \cdot 2 = 160$ und $80 \cdot 0{,}5 = 40$, zusammen 200 km.'])

Q.q(r'Die Temperatur in Grad Fahrenheit ist $F = 1{,}8 \cdot C + 32$. Wie viel Grad Fahrenheit sind −10 °C?',
    [r'14', r'50', r'−14', r'−18'],
    [r'$F = 1{,}8 \cdot (-10) + 32$',
     r'$1{,}8 \cdot (-10) = -18$',
     r'$-18 + 32 = 14$, also 14 °F.'])

Q.q(r'Berechne den Wert von $(x - 2)^2$ für $x = -1$.',
    [r'9', r'−9', r'1', r'−3'],
    [r'Zuerst die Klammer: $-1 - 2 = -3$.',
     r'$(-3)^2 = (-3) \cdot (-3) = 9$'])

Q.q(r'Welchen Wert hat $-x^2$ für $x = 3$?',
    [r'−9', r'9', r'−6', r'6'],
    [r'Potenzen werden vor dem Vorzeichen berechnet: $-x^2 = -(x^2)$.',
     r'$x^2 = 9$, also $-x^2 = -9$.',
     r'Anders bei $(-x)^2$: Das wäre $(-3)^2 = 9$.'])

Q.q(r'In einer Tabellenkalkulation steht in Zelle A2 die Zahl 5. Welchen Wert zeigt eine Zelle mit der Formel =3*A2-4?',
    [r'11', r'3', r'31', r'19'],
    [r'Das Zeichen * bedeutet mal, die Formel rechnet also $3 \cdot 5 - 4$.',
     r'Punktrechnung vor Strichrechnung: $15 - 4 = 11$.'])

Q.q(r'Ein Dreieck hat die Grundseite $g = 7$ cm und die Höhe $h = 4$ cm. Berechne den Flächeninhalt mit $A = \dfrac{g \cdot h}{2}$.',
    [r'14 cm²', r'28 cm²', r'11 cm²', r'5,5 cm²'],
    [r'$A = \dfrac{7 \cdot 4}{2} = \dfrac{28}{2}$',
     r'$A = 14$, also 14 cm².'])

Q.q(r'Legt man $n$ Quadrate aus Streichhölzern in einer Reihe aneinander, braucht man $3n + 1$ Hölzer. Wie viele Hölzer braucht man für 25 Quadrate?',
    [r'76', r'100', r'78', r'75'],
    [r'Das erste Quadrat braucht 4 Hölzer, jedes weitere nur 3, weil eine Seite schon liegt.',
     r'$3 \cdot 25 + 1 = 75 + 1 = 76$',
     r'100 wäre richtig, wenn jedes Quadrat einzeln läge.'])


def check():
    from fractions import Fraction as F
    t = lambda x: 3 * x - 5
    assert t(4) == 7 and t(-2) == -11
    assert (-3) ** 2 + 2 * (-3) == 3
    assert 2 * (5 - (-3)) == 16
    assert 2 * (F('4.5') + F('2.5')) == 14 and F('4.5') * F('2.5') == F('11.25') and 2 * F('4.5') + F('2.5') == F('11.5')
    assert 2 * 4 + 1 == 9 and F(9, 2) == F('4.5')
    assert 9 + 4 == 13
    assert F('3.5') + F('2.1') * 12 == F('28.7') and F('5.6') * 12 == F('67.2') and F('2.1') + F('3.5') * 12 == F('44.1')
    assert F(-7 + 3, 2) == -2
    assert 2 ** 3 == 8 and 3 * 2 == 6
    assert 2 * 2 + 3 == 2 + 5 == 7
    assert F('2.5') * 4 * F('1.2') == 12 and F('2.5') + 4 + F('1.2') == F('7.7')
    assert 80 * F('2.5') == 200 and F(80) / F('2.5') == 32
    assert F('1.8') * (-10) + 32 == 14 and F('1.8') * 10 + 32 == 50
    assert (-1 - 2) ** 2 == 9
    assert -(3 ** 2) == -9 and (-3) ** 2 == 9
    assert 3 * 5 - 4 == 11 and 3 * (5 - 4) == 3 and 3 * 5 + 4 == 19
    assert F(7 * 4, 2) == 14
    assert 3 * 25 + 1 == 76 and 4 * 25 == 100


Q.verify(check)
Q.save()
