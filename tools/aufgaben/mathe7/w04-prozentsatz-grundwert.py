#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 4 / KW 37 (LB 1): the three basic percent
problems - finding the percentage and the base value, choosing the right one.
Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from quiz import os7

Q = os7(nr=4, slug='prozentsatz-grundwert', thema='Prozentsatz und Grundwert berechnen', lb='LB 1',
        blurb='Prozentsatz gesucht, Grundwert gesucht, welche Grundaufgabe liegt vor?',
        comment='Blocks: percentage wanted (1-7), base value wanted (8-14), mixed (15-20).')

p_of = lambda W, G: F(str(W)) / F(str(G)) * 100
G_of = lambda W, p: F(str(W)) * 100 / F(str(p))

# ---------------------------------------------------------- percentage wanted ----
Q.q(r'Wie viel Prozent sind 12 von 48?',
    [r'25 %', r'12 %', r'40 %', r'4 %'],
    [r'$p\,\% = \dfrac{W}{G} = \dfrac{12}{48}$',
     r'$= \dfrac{1}{4}$',
     r'= 25 %'])

Q.q(r'Wie viel Prozent sind 18 von 60?',
    [r'30 %', r'18 %', r'42 %', r'3 %'],
    [r'$\dfrac{18}{60}$, mit 6 kürzen: $\dfrac{3}{10}$',
     r'$\dfrac{3}{10} = \dfrac{30}{100}$',
     r'= 30 %'])

Q.q(r'Ein Pullover kostete 180 €, er ist um 45 € billiger geworden. Um wie viel Prozent?',
    [r'25 %', r'45 %', r'40 %', r'4 %'],
    [r'Grundwert 180 €, Prozentwert 45 €.',
     r'$\dfrac{45}{180} = \dfrac{1}{4}$',
     r'= 25 %'])

Q.q(r'Wie viel Prozent sind 7 von 35?',
    [r'20 %', r'7 %', r'5 %', r'28 %'],
    [r'$\dfrac{7}{35} = \dfrac{1}{5}$',
     r'Ein Fünftel ist 20 %.',
     r'= 20 %'])

Q.q(r'Wie viel Prozent sind 63 von 90?',
    [r'70 %', r'63 %', r'27 %', r'7 %'],
    [r'$\dfrac{63}{90}$, mit 9 kürzen: $\dfrac{7}{10}$',
     r'$\dfrac{7}{10} = \dfrac{70}{100}$',
     r'= 70 %'])

Q.q(r'Wie viel Prozent sind 3 von 8?',
    [r'37,5 %', r'38 %', r'3,8 %', r'26,7 %'],
    [r'$3 : 8 = 0{,}375$',
     r'0,375 = 37,5 Hundertstel',
     r'= 37,5 %'])

Q.q(r'Mit welcher Formel berechnet man den Prozentsatz?',
    [r'$p\,\% = \dfrac{W}{G}$', r'$p\,\% = W \cdot G$', r'$p\,\% = \dfrac{G}{W}$', r'$p\,\% = W - G$'],
    [r'Der Prozentsatz ist der Anteil des Prozentwerts am Grundwert.',
     r'Anteil = Teil : Ganzes',
     r'$p\,\% = \dfrac{W}{G}$, dann als Hundertstel schreiben.'])

# ---------------------------------------------------------- base value wanted ----
Q.q(r'30 % sind 18 €. Wie viel sind 100 %?',
    [r'60 €', r'54 €', r'5,40 €', r'48 €'],
    [r'30 % → 18 €',
     r'10 % → 6 €',
     r'100 % → 60 €'])

Q.q(r'25 % sind 45 kg. Wie groß ist der Grundwert?',
    [r'180 kg', r'11,25 kg', r'70 kg', r'135 kg'],
    [r'25 % ist ein Viertel.',
     r'Das Ganze ist viermal so viel.',
     r'$4 \cdot 45 = 180$ kg'])

Q.q(r'4 % sind 12 Personen. Wie viele Personen sind 100 %?',
    [r'300', r'48', r'120', r'3'],
    [r'4 % → 12',
     r'1 % → 3',
     r'100 % → 300'])

Q.q(r'15 % sind 9 €. Wie groß ist der Grundwert?',
    [r'60 €', r'1,35 €', r'135 €', r'24 €'],
    [r'15 % → 9 €',
     r'5 % → 3 €',
     r'100 % → $20 \cdot 3 = 60$ €'])

Q.q(r'120 % sind 84. Wie groß ist der Grundwert (100 %)?',
    [r'70', r'100,8', r'64', r'96'],
    [r'120 % → 84',
     r'10 % → 7',
     r'100 % → 70'])

Q.q(r'Dreisatz: 35 % entsprechen 70 €. Welche Zeile gehört in die Mitte?',
    [r'1 % → 2 €', r'1 % → 35 €', r'1 % → 0,50 €', r'1 % → 70 €'],
    [r'Schluss auf 1 %: durch 35 teilen.',
     r'$70 : 35 = 2$, also 1 % → 2 €.',
     r'Danach mal 100: 100 % → 200 €.'])

Q.q(r'Mit welcher Formel berechnet man den Grundwert?',
    [r'$G = \dfrac{W}{p\,\%}$', r'$G = W \cdot p\,\%$', r'$G = W + p$', r'$G = \dfrac{p\,\%}{W}$'],
    [r'Aus $W = G \cdot p\,\%$ folgt durch Umstellen:',
     r'$G = W : p\,\%$',
     r'Beispiel: $18 : 0{,}3 = 60$.'])

# ----------------------------------------------------------------------- mixed ----
Q.q(r'In einer Klasse mit 28 Personen haben 7 einen Hund. Wie viel Prozent sind das?',
    [r'25 %', r'7 %', r'4 %', r'21 %'],
    [r'Gegeben: Grundwert 28 und Prozentwert 7. Gesucht: Prozentsatz.',
     r'$\dfrac{7}{28} = \dfrac{1}{4}$',
     r'= 25 %'])

Q.q(r'Lea hat 30 € gespart, das sind 20 % ihres Sparziels. Wie hoch ist ihr Sparziel?',
    [r'150 €', r'6 €', r'600 €', r'50 €'],
    [r'Gegeben: Prozentwert 30 € und Prozentsatz 20 %. Gesucht: Grundwert.',
     r'20 % ist ein Fünftel.',
     r'$5 \cdot 30 = 150$ €'])

Q.q(r'Eine Schule hat 640 Personen. 35 % kommen mit dem Bus. Wie viele sind das?',
    [r'224', r'35', r'416', r'183'],
    [r'Gegeben: Grundwert und Prozentsatz. Gesucht: Prozentwert.',
     r'10 % sind 64, 5 % sind 32.',
     r'$3 \cdot 64 + 32 = 224$'])

Q.q(r'Bei einer Wahl haben von 4500 Wahlberechtigten 3600 gewählt. Wie hoch war die Wahlbeteiligung?',
    [r'80 %', r'90 %', r'75 %', r'36 %'],
    [r'$\dfrac{3600}{4500} = \dfrac{36}{45}$',
     r'Mit 9 kürzen: $\dfrac{4}{5}$',
     r'= 80 %'])

Q.q(r'Tim rechnet: „20 % sind 40 €, also ist der Grundwert $40 \cdot 20 = 800$ €.“ Was ist richtig?',
    [r'Der Grundwert ist 200 €, Tim hätte mit 5 malnehmen müssen.', r'Tim hat recht.',
     r'Der Grundwert ist 8 €.', r'Der Grundwert ist 60 €.'],
    [r'20 % ist ein Fünftel des Grundwerts.',
     r'Das Ganze ist also fünfmal so viel: $5 \cdot 40 = 200$ €.',
     r'Probe: 20 % von 200 € sind 40 €.'])

Q.q(r'Gegeben sind Grundwert und Prozentwert. Was kannst du berechnen?',
    [r'den Prozentsatz', r'nur den Grundwert', r'gar nichts', r'den Rabatt in Euro'],
    [r'Von den drei Größen $G$, $W$ und $p\,\%$ fehlt nur eine.',
     r'Fehlt der Prozentsatz, rechnet man $W : G$.',
     r'Merke: Zwei Größen gegeben, die dritte gesucht.'])


def check():
    assert p_of(12, 48) == 25 and p_of(18, 60) == 30 and p_of(45, 180) == 25 and p_of(7, 35) == 20
    assert p_of(63, 90) == 70 and p_of(3, 8) == F('37.5')
    assert G_of(18, 30) == 60 and G_of(45, 25) == 180 and G_of(12, 4) == 300 and G_of(9, 15) == 60
    assert G_of(84, 120) == 70 and F(70, 35) == 2 and G_of(70, 35) == 200
    assert F(18) / F('0.3') == 60
    assert p_of(7, 28) == 25 and G_of(30, 20) == 150 and F(640 * 35, 100) == 224 and p_of(3600, 4500) == 80
    assert G_of(40, 20) == 200


Q.verify(check)
Q.save()
