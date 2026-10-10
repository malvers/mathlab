#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 19 / KW 2 (LB 3): laws of arithmetic and order
of operations with rational numbers - brackets, powers, commutative, associative and
distributive law, clever calculating. Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os7

Q = os7(nr=19, slug='rechengesetze', thema='Rechengesetze und Vorrangregeln', lb='LB 3',
        blurb='Klammer, Potenz, Punkt vor Strich, Vertauschen, Verbinden, Verteilen, geschickt rechnen',
        comment='Blocks: order of operations (1-5, 10-13, 15, 19), laws and clever calculating (6-9, 14, 16-17), context (18, 20).')

# --------------------------------------------------------- order of operations ----
Q.q(r'Berechne $-3 + 4 \cdot (-2)$.',
    [r'−11', r'−2', r'5', r'−5'],
    [r'Punkt vor Strich: $4 \cdot (-2) = -8$',
     r'$-3 + (-8)$',
     r'$= -11$'])

Q.q(r'Berechne $(-3 + 4) \cdot (-2)$.',
    [r'−2', r'−11', r'2', r'14'],
    [r'Klammer zuerst: $-3 + 4 = 1$',
     r'$1 \cdot (-2)$',
     r'$= -2$'])

Q.q(r'Berechne $12 : (-3) - 5$.',
    [r'−9', r'−1', r'9', r'−6'],
    [r'Punkt vor Strich: $12 : (-3) = -4$',
     r'$-4 - 5$',
     r'$= -9$'])

Q.q(r'Berechne $-2 \cdot 3^2$.',
    [r'−18', r'36', r'−36', r'18'],
    [r'Potenz vor Punkt: $3^2 = 9$',
     r'$-2 \cdot 9$',
     r'$= -18$'])

Q.q(r'Berechne $(-2 \cdot 3)^2$.',
    [r'36', r'−36', r'−18', r'12'],
    [r'Klammer zuerst: $-2 \cdot 3 = -6$',
     r'$(-6)^2 = (-6) \cdot (-6)$',
     r'$= 36$'])

Q.q(r'Berechne $5 - (-2)^2$.',
    [r'1', r'9', r'−9', r'7'],
    [r'Potenz zuerst: $(-2)^2 = 4$',
     r'$5 - 4$',
     r'$= 1$'])

Q.q(r'In welcher Reihenfolge rechnet man?',
    [r'Klammer, dann Potenz, dann Punkt, dann Strich', r'Strich vor Punkt', r'immer von links nach rechts, egal was kommt',
     r'Potenz zuletzt'],
    [r'Zuerst wird ausgerechnet, was in Klammern steht.',
     r'Dann Potenzen, dann Mal und Geteilt.',
     r'Zum Schluss Plus und Minus – bei Gleichrangigem von links nach rechts.'])

Q.q(r'Berechne $(-1)^{100}$.',
    [r'1', r'−1', r'−100', r'100'],
    [r'Je zwei Faktoren $(-1) \cdot (-1)$ ergeben 1.',
     r'100 ist gerade: 50 solche Paare.',
     r'$(-1)^{100} = 1$'])

Q.q(r'Berechne $6 - 2 \cdot (-3 + 5)$.',
    [r'2', r'8', r'−4', r'10'],
    [r'Klammer: $-3 + 5 = 2$',
     r'Punkt vor Strich: $2 \cdot 2 = 4$',
     r'$6 - 4 = 2$'])

Q.q(r'Tim schreibt: $-3^2 = 9$. Was stimmt?',
    [r'Falsch, $-3^2 = -9$; nur $(-3)^2 = 9$.', r'Richtig, minus mal minus ist plus.', r'Falsch, $-3^2 = -6$.',
     r'Falsch, $-3^2 = 6$.'],
    [r'Ohne Klammer gehört das Quadrat nur zur 3.',
     r'$-3^2 = -(3 \cdot 3) = -9$',
     r'Mit Klammer: $(-3)^2 = (-3) \cdot (-3) = 9$.'])

Q.q(r'Berechne $(-18) : (2 - 5)$.',
    [r'6', r'−6', r'−14', r'−11'],
    [r'Klammer zuerst: $2 - 5 = -3$',
     r'$(-18) : (-3)$',
     r'$= 6$'])

# ------------------------------------------------------- laws, clever calculating ----
Q.q(r'Rechne geschickt: $(-25) \cdot 7 \cdot 4$',
    [r'−700', r'700', r'−175', r'−28'],
    [r'Vertauschen: $(-25) \cdot 4 \cdot 7$',
     r'$(-25) \cdot 4 = -100$',
     r'$-100 \cdot 7 = -700$'])

Q.q(r'Rechne geschickt: $-8{,}7 + 3{,}4 + 8{,}7$',
    [r'3,4', r'−3,4', r'20,8', r'−14'],
    [r'Vertauschen: $-8{,}7 + 8{,}7 + 3{,}4$',
     r'$-8{,}7 + 8{,}7 = 0$',
     r'$0 + 3{,}4 = 3{,}4$'])

Q.q(r'Berechne mit dem Verteilungsgesetz: $-3 \cdot (4 - 10)$.',
    [r'18', r'−18', r'−42', r'2'],
    [r'$-3 \cdot 4 + (-3) \cdot (-10)$',
     r'$= -12 + 30$',
     r'$= 18$ (oder Klammer zuerst: $-3 \cdot (-6) = 18$).'])

Q.q(r'Rechne geschickt: $7 \cdot (-13) + 7 \cdot 3$',
    [r'−70', r'70', r'−112', r'−91'],
    [r'Die 7 ausklammern: $7 \cdot (-13 + 3)$',
     r'$= 7 \cdot (-10)$',
     r'$= -70$'])

Q.q(r'Rechne geschickt: $0{,}25 \cdot (-17) \cdot (-4)$',
    [r'17', r'−17', r'−68', r'4,25'],
    [r'Vertauschen: $0{,}25 \cdot (-4) \cdot (-17)$',
     r'$0{,}25 \cdot (-4) = -1$',
     r'$(-1) \cdot (-17) = 17$'])

Q.q(r'Rechne geschickt: $-47 + 98 - 53$',
    [r'−2', r'2', r'−198', r'4'],
    [r'Die negativen Zahlen zusammenfassen: $-47 - 53 = -100$',
     r'$-100 + 98$',
     r'$= -2$'])

Q.q(r'Berechne $-\dfrac{1}{2} \cdot (6 - 4)$.',
    [r'−1', r'1', r'−5', r'−2'],
    [r'Klammer: $6 - 4 = 2$',
     r'$-\dfrac{1}{2} \cdot 2$',
     r'$= -1$'])

# ----------------------------------------------------------------------- context ----
Q.q(r'Die Klassenkasse hat vier Ausgaben von je 7,50 € und eine Einnahme von 40 €. Wie ändert sich der Kassenstand insgesamt?',
    [r'um +10 €', r'um −10 €', r'um +70 €', r'um −70 €'],
    [r'Ausgaben negativ: $4 \cdot (-7{,}50) = -30$ €',
     r'Einnahme positiv: $+40$ €',
     r'$-30 + 40 = 10$: Es sind 10 € mehr in der Kasse.'])

Q.q(r'Ein Taucher ist auf −12 m. Er taucht dreimal je 2 m tiefer und dann 5 m nach oben. Wo ist er dann?',
    [r'bei −13 m', r'bei −23 m', r'bei −1 m', r'bei −11 m'],
    [r'Tiefer: $3 \cdot (-2) = -6$',
     r'$-12 + (-6) + 5$',
     r'$= -13$ m'])


def check():
    assert -3 + 4 * (-2) == -11 and (-3 + 4) * (-2) == -2 and 12 / (-3) - 5 == -9
    assert -2 * 3 ** 2 == -18 and (-2 * 3) ** 2 == 36 and 5 - (-2) ** 2 == 1 and (-1) ** 100 == 1
    assert 6 - 2 * (-3 + 5) == 2 and -3 ** 2 == -9 and (-3) ** 2 == 9 and (-18) / (2 - 5) == 6
    assert (-25) * 7 * 4 == -700 and D('-8.7') + D('3.4') + D('8.7') == D('3.4')
    assert -3 * (4 - 10) == 18 == -3 * 4 + (-3) * (-10) and 7 * (-13) + 7 * 3 == -70
    assert D('0.25') * -17 * -4 == 17 and -47 + 98 - 53 == -2 and F(-1, 2) * (6 - 4) == -1
    assert 4 * D('-7.50') + 40 == 10 and -12 + 3 * (-2) + 5 == -13


Q.verify(check)
Q.save()
