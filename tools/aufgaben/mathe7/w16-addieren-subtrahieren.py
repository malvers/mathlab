#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 16 / KW 51 (LB 3): adding and subtracting
rational numbers - number line, subtracting means adding the opposite, brackets,
temperatures, account balance, heights. Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os7
from osfig import zahlenstrahl

Q = os7(nr=16, slug='addieren-subtrahieren', thema='Addieren und Subtrahieren rationaler Zahlen', lb='LB 3',
        blurb='am Zahlenstrahl, Subtrahieren als Addieren der Gegenzahl, Klammern, Sachaufgaben',
        comment='Blocks: integers (1-7, 12, 18-20), decimals and fractions (8-11), contexts (13-17).')

# ------------------------------------------------------------------- integers ----
Q.q(r'Berechne $-3 + 5$.',
    [r'2', r'−8', r'−2', r'8'],
    [r'Start bei −3 auf der Zahlengerade.',
     r'Plus 5: 5 Schritte nach rechts.',
     r'Man landet bei 2.'],
    fig=zahlenstrahl(-4, 4, 1, [(-3, 'Start'), (2, 'Ziel')]), figcap=r'5 Schritte nach rechts')

Q.q(r'Berechne $-4 + (-6)$.',
    [r'−10', r'2', r'−2', r'10'],
    [r'Plus eine negative Zahl: nach links gehen.',
     r'Von −4 aus 6 Schritte nach links.',
     r'$-4 + (-6) = -10$'])

Q.q(r'Berechne $7 + (-9)$.',
    [r'−2', r'2', r'−16', r'16'],
    [r'$7 + (-9) = 7 - 9$',
     r'Von 7 aus 9 Schritte nach links: über die Null hinaus.',
     r'$= -2$'])

Q.q(r'Berechne $-2 - 5$.',
    [r'−7', r'3', r'−3', r'7'],
    [r'Von −2 aus 5 Schritte nach links.',
     r'$-2 - 5 = -7$',
     r'Beide Teile „ziehen“ nach links.'])

Q.q(r'Berechne $3 - 8$.',
    [r'−5', r'5', r'−11', r'11'],
    [r'8 ist größer als 3: Das Ergebnis wird negativ.',
     r'$8 - 3 = 5$',
     r'Also $3 - 8 = -5$.'])

Q.q(r'Berechne $-6 - (-4)$.',
    [r'−2', r'−10', r'2', r'10'],
    [r'Subtrahieren heißt die Gegenzahl addieren.',
     r'$-6 - (-4) = -6 + 4$',
     r'$= -2$'])

Q.q(r'Berechne $5 - (-3)$.',
    [r'8', r'2', r'−8', r'−2'],
    [r'Die Gegenzahl von −3 ist 3.',
     r'$5 - (-3) = 5 + 3$',
     r'$= 8$'])

Q.q(r'Welche Regel gilt für das Subtrahieren einer Zahl?',
    [r'Man addiert ihre Gegenzahl.', r'Man addiert die Zahl selbst.', r'Man nimmt das Ergebnis immer negativ.',
     r'Man vertauscht die beiden Zahlen.'],
    [r'Beispiel: $5 - 3 = 5 + (-3) = 2$.',
     r'Ebenso: $5 - (-3) = 5 + 3 = 8$.',
     r'„Minus“ wird zu „plus Gegenzahl“.'])

Q.q(r'Berechne $8 - (3 - 5)$.',
    [r'10', r'6', r'0', r'16'],
    [r'Erst die Klammer: $3 - 5 = -2$',
     r'$8 - (-2) = 8 + 2$',
     r'$= 10$'])

Q.q(r'Was ist $-(-7)$?',
    [r'7', r'−7', r'0', r'−14'],
    [r'$-(-7)$ ist die Gegenzahl von −7.',
     r'Die Gegenzahl von −7 ist 7.',
     r'Zwei Minus hintereinander ergeben plus.'])

Q.q(r'Berechne $-5 + 8 - 6 + 2$.',
    [r'−1', r'1', r'−21', r'11'],
    [r'Von links nach rechts: $-5 + 8 = 3$',
     r'$3 - 6 = -3$',
     r'$-3 + 2 = -1$'])

# ---------------------------------------------------- decimals and fractions ----
Q.q(r'Rechne im Kopf: $-1{,}3 + 3{,}5$',
    [r'2,2', r'−4,8', r'−2,2', r'4,8'],
    [r'Die positive Zahl hat den größeren Betrag.',
     r'$3{,}5 - 1{,}3 = 2{,}2$',
     r'Das Ergebnis ist positiv: 2,2.'])

Q.q(r'Rechne: $-15{,}4 - 12{,}8$',
    [r'−28,2', r'−2,6', r'2,6', r'28,2'],
    [r'Beide Teile gehen nach links.',
     r'$15{,}4 + 12{,}8 = 28{,}2$',
     r'Ergebnis: −28,2'])

Q.q(r'Berechne $-\dfrac{3}{4} + \dfrac{1}{2}$.',
    [r'$-\dfrac{1}{4}$', r'$\dfrac{1}{4}$', r'$-\dfrac{5}{4}$', r'$-\dfrac{2}{6}$'],
    [r'Gleichnamig machen: $-\dfrac{3}{4} + \dfrac{2}{4}$',
     r'$-3 + 2 = -1$',
     r'$= -\dfrac{1}{4}$'])

Q.q(r'Berechne $\dfrac{2}{3} - \dfrac{5}{6}$.',
    [r'$-\dfrac{1}{6}$', r'$\dfrac{1}{6}$', r'$-\dfrac{3}{3}$', r'$\dfrac{3}{6}$'],
    [r'Gleichnamig: $\dfrac{4}{6} - \dfrac{5}{6}$',
     r'$4 - 5 = -1$',
     r'$= -\dfrac{1}{6}$'])

# ----------------------------------------------------------------------- contexts ----
Q.q(r'Ein Konto steht bei −40 €. Es werden 25 € eingezahlt. Wie ist der neue Kontostand?',
    [r'−15 €', r'−65 €', r'15 €', r'65 €'],
    [r'Einzahlen heißt: plus.',
     r'$-40 + 25$',
     r'$= -15$ € – das Konto ist noch im Minus.'])

Q.q(r'Morgens sind es −3 °C. Bis mittags steigt die Temperatur um 8 Grad. Wie warm ist es mittags?',
    [r'5 °C', r'−11 °C', r'11 °C', r'−5 °C'],
    [r'Steigen heißt: plus.',
     r'$-3 + 8$',
     r'$= 5$ °C'])

Q.q(r'Abends sind es 4 °C. In der Nacht fällt die Temperatur um 9 Grad. Wie kalt ist es nachts?',
    [r'−5 °C', r'5 °C', r'−13 °C', r'13 °C'],
    [r'Fallen heißt: minus.',
     r'$4 - 9$',
     r'$= -5$ °C'])

Q.q(r'Tagsüber waren es 6 °C, nachts −7 °C. Wie groß ist der Temperaturunterschied?',
    [r'13 Grad', r'1 Grad', r'−13 Grad', r'7 Grad'],
    [r'Unterschied = höherer Wert minus niedrigerer Wert.',
     r'$6 - (-7) = 6 + 7$',
     r'$= 13$ Grad'])

Q.q(r'Die Zugspitze ist 2962 m hoch, das Ufer des Toten Meeres liegt bei etwa −430 m. Wie groß ist der Höhenunterschied?',
    [r'etwa 3392 m', r'etwa 2532 m', r'etwa −3392 m', r'etwa 3000 m'],
    [r'Unterschied: $2962 - (-430)$',
     r'$= 2962 + 430$',
     r'$= 3392$ m'])


def check():
    assert -3 + 5 == 2 and -4 + (-6) == -10 and 7 + (-9) == -2 and -2 - 5 == -7 and 3 - 8 == -5
    assert -6 - (-4) == -2 and 5 - (-3) == 8 and 8 - (3 - 5) == 10 and -(-7) == 7 and -5 + 8 - 6 + 2 == -1
    assert D('-1.3') + D('3.5') == D('2.2') and D('-15.4') - D('12.8') == D('-28.2')
    assert F(-3, 4) + F(1, 2) == F(-1, 4) and F(2, 3) - F(5, 6) == F(-1, 6)
    assert -40 + 25 == -15 and -3 + 8 == 5 and 4 - 9 == -5 and 6 - (-7) == 13 and 2962 - (-430) == 3392


Q.verify(check)
Q.save()
