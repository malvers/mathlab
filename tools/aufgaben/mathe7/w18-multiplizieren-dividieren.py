#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 18 / KW 1 (LB 3): multiplying, dividing and
raising rational numbers to powers - sign rules, powers of negative numbers, contexts.
Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os7

Q = os7(nr=18, slug='multiplizieren-dividieren', thema='Multiplizieren, Dividieren und Potenzieren', lb='LB 3',
        blurb='Vorzeichenregeln, Potenzen negativer Zahlen, Brüche und Dezimalzahlen, Sachaufgaben',
        comment='Blocks: sign rules (1-5, 10, 14-15, 19-20), powers (6-9, 11), fractions (12-13), contexts (16-18).')

# ------------------------------------------------------------------ sign rules ----
Q.q(r'Berechne $(-4) \cdot 3$.',
    [r'−12', r'12', r'−1', r'−7'],
    [r'$(-4) \cdot 3 = (-4) + (-4) + (-4)$',
     r'$= -12$',
     r'Minus mal Plus ergibt Minus.'])

Q.q(r'Berechne $(-5) \cdot (-6)$.',
    [r'30', r'−30', r'−11', r'11'],
    [r'Erst ohne Vorzeichen: $5 \cdot 6 = 30$.',
     r'Minus mal Minus ergibt Plus.',
     r'$(-5) \cdot (-6) = 30$'])

Q.q(r'Rechne im Kopf: $5{,}2 \cdot (-3)$',
    [r'−15,6', r'15,6', r'−2,2', r'−8,2'],
    [r'Ohne Vorzeichen: $5{,}2 \cdot 3 = 15{,}6$.',
     r'Plus mal Minus ergibt Minus.',
     r'$= -15{,}6$'])

Q.q(r'Rechne im Kopf: $3{,}6 : (-3)$',
    [r'−1,2', r'1,2', r'−10,8', r'0,6'],
    [r'Ohne Vorzeichen: $3{,}6 : 3 = 1{,}2$.',
     r'Plus durch Minus ergibt Minus.',
     r'$= -1{,}2$'])

Q.q(r'Berechne $(-24) : (-8)$.',
    [r'3', r'−3', r'−32', r'16'],
    [r'Ohne Vorzeichen: $24 : 8 = 3$.',
     r'Minus durch Minus ergibt Plus.',
     r'$= 3$. Probe: $3 \cdot (-8) = -24$.'])

Q.q(r'Ein Produkt hat drei negative Faktoren und sonst nur positive. Welches Vorzeichen hat es?',
    [r'negativ', r'positiv', r'Es ist 0.', r'Das kann man nicht sagen.'],
    [r'Je zwei negative Faktoren ergeben zusammen etwas Positives.',
     r'Bei drei negativen bleibt ein Minus übrig.',
     r'Ungerade Anzahl negativer Faktoren: negatives Produkt.'])

Q.q(r'Berechne $(-1{,}5) \cdot (-4)$.',
    [r'6', r'−6', r'−5,5', r'2,5'],
    [r'$1{,}5 \cdot 4 = 6$',
     r'Minus mal Minus: Plus.',
     r'$= 6$'])

Q.q(r'Berechne $0 \cdot (-7)$.',
    [r'0', r'−7', r'7', r'−1'],
    [r'Null mal irgendeine Zahl ist null.',
     r'Das gilt auch für negative Zahlen.',
     r'$0 \cdot (-7) = 0$ – null hat kein Vorzeichen.'])

Q.q(r'Welche Zahl gehört in die Lücke? $(-6) \cdot \square = 42$',
    [r'−7', r'7', r'−36', r'48'],
    [r'Ohne Vorzeichen: $6 \cdot 7 = 42$.',
     r'Das Ergebnis ist positiv, ein Faktor ist negativ.',
     r'Dann muss der andere auch negativ sein: −7.'])

Q.q(r'Berechne $(-3) \cdot (-2) \cdot (-1) \cdot (-5)$.',
    [r'30', r'−30', r'−11', r'11'],
    [r'Ohne Vorzeichen: $3 \cdot 2 \cdot 1 \cdot 5 = 30$.',
     r'Vier negative Faktoren: gerade Anzahl.',
     r'Das Produkt ist positiv: 30.'])

# ------------------------------------------------------------------------ powers ----
Q.q(r'Berechne $(-2)^3$.',
    [r'−8', r'8', r'−6', r'6'],
    [r'$(-2)^3 = (-2) \cdot (-2) \cdot (-2)$',
     r'$= 4 \cdot (-2)$',
     r'$= -8$'])

Q.q(r'Berechne $(-2)^4$.',
    [r'16', r'−16', r'−8', r'8'],
    [r'$(-2) \cdot (-2) \cdot (-2) \cdot (-2)$',
     r'Vier Faktoren mit Minus: gerade Anzahl.',
     r'$= 16$'])

Q.q(r'Berechne $-2^4$ (ohne Klammer).',
    [r'−16', r'16', r'−8', r'8'],
    [r'Ohne Klammer gehört die Hochzahl nur zur 2.',
     r'$-2^4 = -(2 \cdot 2 \cdot 2 \cdot 2)$',
     r'$= -16$ – Vorsicht, nicht dasselbe wie $(-2)^4 = 16$!'])

Q.q(r'Berechne $(-1)^7$.',
    [r'−1', r'1', r'−7', r'7'],
    [r'$(-1) \cdot (-1) = 1$, dann wieder $\cdot (-1) = -1$ usw.',
     r'Bei ungerader Hochzahl bleibt −1.',
     r'$(-1)^7 = -1$'])

Q.q(r'Berechne $(-0{,}5)^2$.',
    [r'0,25', r'−0,25', r'−1', r'1'],
    [r'$(-0{,}5) \cdot (-0{,}5)$',
     r'Minus mal Minus: Plus.',
     r'$= 0{,}25$'])

# --------------------------------------------------------------------- fractions ----
Q.q(r'Berechne $\left(-\dfrac{3}{4}\right) \cdot \dfrac{2}{3}$.',
    [r'$-\dfrac{1}{2}$', r'$\dfrac{1}{2}$', r'$-\dfrac{5}{7}$', r'$-\dfrac{9}{8}$'],
    [r'$\dfrac{3 \cdot 2}{4 \cdot 3} = \dfrac{6}{12} = \dfrac{1}{2}$',
     r'Minus mal Plus: Minus.',
     r'$= -\dfrac{1}{2}$'])

Q.q(r'Berechne $\left(-\dfrac{2}{5}\right) : \left(-\dfrac{4}{5}\right)$.',
    [r'$\dfrac{1}{2}$', r'$-\dfrac{1}{2}$', r'2', r'$\dfrac{8}{25}$'],
    [r'Mit dem Kehrwert malnehmen: $\dfrac{2}{5} \cdot \dfrac{5}{4} = \dfrac{10}{20}$',
     r'$= \dfrac{1}{2}$',
     r'Minus durch Minus: Plus. Ergebnis $\dfrac{1}{2}$.'])

# ---------------------------------------------------------------------- contexts ----
Q.q(r'Die Temperatur fällt 5 Stunden lang jede Stunde um 2 Grad. Um wie viel ändert sie sich insgesamt?',
    [r'um −10 Grad', r'um 10 Grad', r'um −7 Grad', r'um −2,5 Grad'],
    [r'Jede Stunde: −2 Grad.',
     r'$5 \cdot (-2)$',
     r'$= -10$, es wird 10 Grad kälter.'])

Q.q(r'Vier Personen haben zusammen 60 € Schulden und teilen sie gerecht auf. Wie hoch ist der Kontostand jeder Person dafür?',
    [r'−15 €', r'15 €', r'−240 €', r'−56 €'],
    [r'Schulden schreibt man negativ: −60 €.',
     r'$(-60) : 4$',
     r'$= -15$ € für jede Person.'])

Q.q(r'An vier Tagen wurden −4 °C, −1 °C, 2 °C und −5 °C gemessen. Wie groß ist der Mittelwert?',
    [r'−2 °C', r'2 °C', r'−3 °C', r'−8 °C'],
    [r'Summe: $-4 + (-1) + 2 + (-5) = -8$',
     r'Durch die Anzahl teilen: $-8 : 4$',
     r'$= -2$ °C'])


def check():
    assert (-4) * 3 == -12 and (-5) * (-6) == 30 and D('5.2') * -3 == D('-15.6') and D('3.6') / -3 == D('-1.2')
    assert (-24) / (-8) == 3 and (-1) ** 3 < 0 and D('-1.5') * -4 == 6 and 0 * (-7) == 0
    assert 42 / (-6) == -7 and (-3) * (-2) * (-1) * (-5) == 30
    assert (-2) ** 3 == -8 and (-2) ** 4 == 16 and -2 ** 4 == -16 and (-1) ** 7 == -1 and D('-0.5') ** 2 == D('0.25')
    assert F(-3, 4) * F(2, 3) == F(-1, 2) and F(-2, 5) / F(-4, 5) == F(1, 2)
    assert 5 * (-2) == -10 and -60 / 4 == -15 and F(-4 - 1 + 2 - 5, 4) == -2


Q.verify(check)
Q.save()
