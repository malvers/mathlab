#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 4 / KW 37 (LB 1): fractions to decimals and back, finite
and repeating decimals. Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from quiz import os6

Q = os6(nr=4, slug='umwandeln', thema='Brüche und Dezimalzahlen umwandeln', lb='LB 1',
        blurb='Bruch in Dezimalzahl, endliche und periodische Dezimalzahlen, Dezimalzahl in Bruch',
        comment='Blocks: finite decimals (1-4), repeating decimals (5-10), decimal to fraction (11-15), everyday (16-20).')

# --------------------------------------------------------- finite decimals ----
Q.q(r'Schreibe $\dfrac{3}{4}$ als Dezimalzahl.',
    [r'0,75', r'0,34', r'3,4', r'0,43'],
    [r'Auf Hundertstel erweitern: $\dfrac{3}{4} = \dfrac{3 \cdot 25}{4 \cdot 25} = \dfrac{75}{100}$',
     r'75 Hundertstel schreibt man 0,75.',
     r'Oder: $3 : 4 = 0{,}75$.'])

Q.q(r'Schreibe $\dfrac{2}{5}$ als Dezimalzahl.',
    [r'0,4', r'0,25', r'2,5', r'0,52'],
    [r'Auf Zehntel erweitern: $\dfrac{2 \cdot 2}{5 \cdot 2} = \dfrac{4}{10}$',
     r'4 Zehntel sind 0,4.',
     r'Probe: $2 : 5 = 0{,}4$.'])

Q.q(r'Schreibe $\dfrac{7}{20}$ als Dezimalzahl.',
    [r'0,35', r'0,72', r'0,7', r'3,5'],
    [r'Von 20 auf 100: mit 5 erweitern.',
     r'$\dfrac{7 \cdot 5}{20 \cdot 5} = \dfrac{35}{100}$',
     r'Also 0,35.'])

Q.q(r'Schreibe $\dfrac{3}{8}$ als Dezimalzahl.',
    [r'0,375', r'0,38', r'0,83', r'0,325'],
    [r'8 lässt sich auf 1000 erweitern: $8 \cdot 125 = 1000$.',
     r'$\dfrac{3 \cdot 125}{8 \cdot 125} = \dfrac{375}{1000}$',
     r'Also 0,375. Schriftlich: $3 : 8 = 0{,}375$.'])

# ------------------------------------------------------ repeating decimals ----
Q.q(r'Schreibe $\dfrac{1}{3}$ als Dezimalzahl.',
    [r'$0{,}\overline{3}$', r'$0{,}3$', r'$0{,}\overline{13}$', r'$3{,}\overline{3}$'],
    [r'Schriftlich: $1 : 3 = 0{,}333\ldots$ – es bleibt immer der Rest 1.',
     r'Die 3 wiederholt sich ohne Ende: Sie ist die Periode.',
     r'Man schreibt $0{,}\overline{3}$ (lies: null Komma Periode drei).'])

Q.q(r'Schreibe $\dfrac{2}{3}$ als Dezimalzahl.',
    [r'$0{,}\overline{6}$', r'$0{,}\overline{3}$', r'$0{,}67$', r'$0{,}\overline{23}$'],
    [r'$2 : 3 = 0{,}666\ldots$ – es bleibt immer der Rest 2.',
     r'Periode 6: $0{,}\overline{6}$.',
     r'0,67 ist nur ein gerundeter Wert, nicht genau $\dfrac{2}{3}$.'])

Q.q(r'Schreibe $\dfrac{5}{6}$ als Dezimalzahl.',
    [r'$0{,}8\overline{3}$', r'$0{,}\overline{83}$', r'$0{,}\overline{5}$', r'$0{,}56$'],
    [r'$5 : 6$: erst 50 : 6 = 8 Rest 2, dann 20 : 6 = 3 Rest 2, dann wieder 20 : 6 …',
     r'$0{,}8333\ldots$ – nur die 3 wiederholt sich.',
     r'Man schreibt $0{,}8\overline{3}$.'])

Q.q(r'Schreibe $\dfrac{4}{11}$ als Dezimalzahl.',
    [r'$0{,}\overline{36}$', r'$0{,}\overline{4}$', r'$0{,}411$', r'$0{,}3\overline{6}$'],
    [r'$40 : 11 = 3$ Rest 7, $70 : 11 = 6$ Rest 4, dann wieder $40 : 11$ …',
     r'Die Ziffern 3 und 6 wiederholen sich: $0{,}363636\ldots$',
     r'Die Periode hat zwei Stellen: $0{,}\overline{36}$.'])

Q.q(r'Welcher Bruch ergibt eine endliche Dezimalzahl?',
    [r'$\dfrac{7}{25}$', r'$\dfrac{1}{3}$', r'$\dfrac{5}{6}$', r'$\dfrac{2}{7}$'],
    [r'Ein Bruch wird endlich, wenn man ihn auf 10, 100, 1000 … erweitern kann.',
     r'$\dfrac{7}{25} = \dfrac{28}{100} = 0{,}28$',
     r'Nenner 3, 6 oder 7 passen in keine Stufenzahl: Diese Brüche werden periodisch.'])

Q.q(r'Welcher Bruch ergibt eine periodische Dezimalzahl?',
    [r'$\dfrac{1}{7}$', r'$\dfrac{3}{8}$', r'$\dfrac{9}{20}$', r'$\dfrac{6}{15}$'],
    [r'Zuerst kürzen: $\dfrac{6}{15} = \dfrac{2}{5} = 0{,}4$ ist endlich.',
     r'$\dfrac{3}{8} = 0{,}375$ und $\dfrac{9}{20} = 0{,}45$ sind endlich.',
     r'$\dfrac{1}{7} = 0{,}\overline{142857}$ ist periodisch.'])

# --------------------------------------------------- decimal to fraction ----
Q.q(r'Schreibe 0,6 als vollständig gekürzten Bruch.',
    [r'$\dfrac{3}{5}$', r'$\dfrac{6}{100}$', r'$\dfrac{1}{6}$', r'$\dfrac{6}{5}$'],
    [r'0,6 sind 6 Zehntel: $\dfrac{6}{10}$',
     r'Mit 2 kürzen: $\dfrac{3}{5}$',
     r'$\dfrac{6}{100}$ wäre 0,06.'])

Q.q(r'Schreibe 0,25 als vollständig gekürzten Bruch.',
    [r'$\dfrac{1}{4}$', r'$\dfrac{25}{10}$', r'$\dfrac{2}{5}$', r'$\dfrac{1}{25}$'],
    [r'0,25 sind 25 Hundertstel: $\dfrac{25}{100}$',
     r'Mit 25 kürzen: $\dfrac{1}{4}$',
     r'Ein Viertel – wie 25 Cent von einem Euro.'])

Q.q(r'Schreibe 0,125 als vollständig gekürzten Bruch.',
    [r'$\dfrac{1}{8}$', r'$\dfrac{1}{125}$', r'$\dfrac{125}{100}$', r'$\dfrac{1}{12}$'],
    [r'Drei Nachkommastellen: Tausendstel. $0{,}125 = \dfrac{125}{1000}$',
     r'Mit 125 kürzen: $1000 : 125 = 8$.',
     r'Also $\dfrac{1}{8}$.'])

Q.q(r'Schreibe 2,4 als gemischte Zahl.',
    [r'$2\tfrac{2}{5}$', r'$2\tfrac{1}{4}$', r'$2\tfrac{4}{5}$', r'$\dfrac{24}{100}$'],
    [r'2 Ganze und 4 Zehntel: $2\tfrac{4}{10}$',
     r'$\dfrac{4}{10}$ mit 2 kürzen: $\dfrac{2}{5}$',
     r'$2{,}4 = 2\tfrac{2}{5}$'])

Q.q(r'$\dfrac{1}{7} = 0{,}142857142857\ldots$ Wie viele Ziffern hat die Periode?',
    [r'6', r'1', r'3', r'7'],
    [r'Suche, ab wo sich die Ziffern wiederholen.',
     r'142857 | 142857 | …',
     r'Die Periode ist 142857, sie hat 6 Ziffern.'])

# ---------------------------------------------------------------- everyday ----
Q.q(r'Ein Rezept braucht $\dfrac{3}{4}$ kg Mehl. Was muss die Küchenwaage anzeigen?',
    [r'0,75 kg', r'0,34 kg', r'0,7 kg', r'1,33 kg'],
    [r'$\dfrac{3}{4} = \dfrac{75}{100} = 0{,}75$',
     r'Die Waage muss 0,75 kg anzeigen.',
     r'Das sind 750 g.'])

Q.q(r'1 € soll auf 3 Personen verteilt werden. Der Taschenrechner zeigt 0,3333333. Was ist sinnvoll?',
    [r'Jede Person bekommt 0,33 €, 1 Cent bleibt übrig.', r'Jede Person bekommt 0,30 €.',
     r'Jede Person bekommt 0,34 €.', r'Jede Person bekommt 0,3333 €.'],
    [r'$1 : 3 = 0{,}\overline{3}$ – das lässt sich in Cent nicht genau auszahlen.',
     r'Auf Cent gerundet: 0,33 €. Drei Personen bekommen $3 \cdot 0{,}33 = 0{,}99$ €.',
     r'1 Cent bleibt übrig. Mit 0,34 € bräuchte man 1,02 €.'])

Q.q(r'Welcher Bruch ist gleich 0,5?',
    [r'$\dfrac{4}{8}$', r'$\dfrac{1}{5}$', r'$\dfrac{5}{100}$', r'$\dfrac{2}{5}$'],
    [r'0,5 ist ein Halb.',
     r'$\dfrac{4}{8}$ mit 4 gekürzt ergibt $\dfrac{1}{2}$.',
     r'$\dfrac{1}{5} = 0{,}2$, $\dfrac{5}{100} = 0{,}05$, $\dfrac{2}{5} = 0{,}4$.'])

Q.q(r'Es gilt $\dfrac{1}{9} = 0{,}\overline{1}$. Welche Dezimalzahl ist dann $\dfrac{4}{9}$?',
    [r'$0{,}\overline{4}$', r'$0{,}4$', r'$0{,}\overline{49}$', r'$0{,}\overline{14}$'],
    [r'$\dfrac{4}{9}$ ist viermal so viel wie $\dfrac{1}{9}$.',
     r'$4 \cdot 0{,}111\ldots = 0{,}444\ldots$',
     r'Also $0{,}\overline{4}$.'])

Q.q(r'Schreibe $1\tfrac{1}{4}$ als Dezimalzahl.',
    [r'1,25', r'1,14', r'1,4', r'0,125'],
    [r'1 Ganzes bleibt vor dem Komma.',
     r'$\dfrac{1}{4} = 0{,}25$',
     r'$1 + 0{,}25 = 1{,}25$'])


def expand(fr):
    """Decimal digits of a fraction in [0, 10): (integer part, pre-period, period)."""
    whole, r = divmod(fr.numerator, fr.denominator)
    seen, digits = {}, []
    while r and r not in seen:
        seen[r] = len(digits)
        d, r = divmod(r * 10, fr.denominator)
        digits.append(str(d))
    if not r:
        return whole, ''.join(digits), ''
    k = seen[r]
    return whole, ''.join(digits[:k]), ''.join(digits[k:])


def check():
    assert expand(F(3, 4)) == (0, '75', '')
    assert expand(F(2, 5)) == (0, '4', '')
    assert expand(F(7, 20)) == (0, '35', '') and 20 * 5 == 100
    assert expand(F(3, 8)) == (0, '375', '') and 8 * 125 == 1000
    assert expand(F(1, 3)) == (0, '', '3')
    assert expand(F(2, 3)) == (0, '', '6')
    assert expand(F(5, 6)) == (0, '8', '3')
    assert expand(F(4, 11)) == (0, '', '36')
    assert expand(F(7, 25)) == (0, '28', '') and all(expand(x)[2] for x in (F(1, 3), F(5, 6), F(2, 7)))
    assert expand(F(1, 7)) == (0, '', '142857')
    assert not any(expand(x)[2] for x in (F(3, 8), F(9, 20), F(6, 15))) and F(6, 15) == F(2, 5)
    assert F('0.6') == F(3, 5) and F('0.25') == F(1, 4) and F('0.125') == F(1, 8)
    assert F('2.4') == 2 + F(2, 5)
    assert len(expand(F(1, 7))[2]) == 6
    assert F(3, 4) == F('0.75')
    assert round(1 / 3, 2) == 0.33 and 3 * 33 == 99 and 3 * 34 == 102
    assert F(4, 8) == F('0.5') and F(1, 5) == F('0.2') and F(5, 100) == F('0.05') and F(2, 5) == F('0.4')
    assert expand(F(4, 9)) == (0, '', '4') and expand(F(1, 9)) == (0, '', '1')
    assert 1 + F(1, 4) == F('1.25')


Q.verify(check)
Q.save()
