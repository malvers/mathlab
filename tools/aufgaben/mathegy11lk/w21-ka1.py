#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 21 / KW 4: Klausur 11/I - mixed questions on LB 1 (calculus), LB 2 (matrices)
and WB 2 (numerical methods). 16 from the Grundkurs Klausur sheet mathegy11/w20, 4 new (Newton step, bisection
steps, fixed-point iteration, chain rule). Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=21, slug='ka1', thema='Klausur 11/I: Differentialrechnung, Matrizen, numerische Verfahren', lb='KL 11/I',
           blurb='gemischte Aufgaben zu LB 1, LB 2 und WB 2 zur Klausurvorbereitung',
           comment='Questions 1-16 from the Grundkurs Klausur sheet (mathegy11/w20), 17-20 Leistungskurs and numerical methods.')

qs, check_gk = harvest('w20-ka1.py', [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 16, 17, 19])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------- Leistungskurs and WB 2 ----
Q.q(r'Bestimme die Ableitung von $f(x) = x\,e^{-x^2}$.',
    [r'$f^{\prime}(x) = (1 - 2x^2)\,e^{-x^2}$', r'$f^{\prime}(x) = -2x^2 e^{-x^2}$', r'$f^{\prime}(x) = (1 + 2x^2)\,e^{-x^2}$', r'$f^{\prime}(x) = e^{-2x}$'],
    [r'Produktregel und Kettenregel: $(e^{-x^2})^{\prime} = -2x\,e^{-x^2}$.',
     r'$1 \cdot e^{-x^2} + x \cdot (-2x)\,e^{-x^2}$'])

Q.q(r'Newton-Verfahren für $f(x) = x^2 - 5$ mit $x_0 = 2$. Wie groß ist $x_1$?',
    [r'2,25', r'2,5', r'2,236', r'1,75'],
    [r'$x_1 = x_0 - \dfrac{f(x_0)}{f^{\prime}(x_0)} = 2 - \dfrac{-1}{4}$.',
     r'$x_1 = 2{,}25$; der Grenzwert ist $\sqrt{5} \approx 2{,}236$.'])

Q.q(r'Wie viele Bisektionsschritte braucht man mindestens, damit das Startintervall $[1;\,2]$ kürzer als 0,001 wird?',
    [r'10', r'9', r'100', r'1000'],
    [r'Nach $n$ Schritten ist die Länge $\tfrac{1}{2^n}$.',
     r'$\tfrac{1}{2^9} \approx 0{,}00195$, $\tfrac{1}{2^{10}} \approx 0{,}00098$.'])

Q.q(r'Die Iteration $x_{n+1} = 0{,}5\,x_n + 1$ startet bei $x_0 = 0$. Was passiert?',
    [r'Sie konvergiert gegen den Fixpunkt 2, weil $|\varphi^{\prime}| = 0{,}5 < 1$.', r'Sie konvergiert gegen 1.',
     r'Sie divergiert.', r'Sie springt zwischen 0 und 1 hin und her.'],
    [r'Fixpunkt: $x = 0{,}5x + 1 \Leftrightarrow x = 2$.',
     r'Folge: 0; 1; 1,5; 1,75; … Der Abstand zu 2 halbiert sich in jedem Schritt.'])


def check():
    import sympy as sp
    x = sp.symbols('x', real=True)
    check_gk()
    assert sp.simplify(sp.diff(x * sp.exp(-x ** 2), x) - (1 - 2 * x ** 2) * sp.exp(-x ** 2)) == 0
    assert 2 - (2 ** 2 - 5) / (2 * 2) == 2.25 and abs(5 ** 0.5 - 2.236) < 1e-3
    assert 2 ** -9 > 0.001 > 2 ** -10 and abs(2 ** -9 - 0.00195) < 1e-5 and abs(2 ** -10 - 0.00098) < 1e-5
    v, seq = 0.0, []
    for _ in range(3):
        v = 0.5 * v + 1; seq.append(v)
    assert seq == [1, 1.5, 1.75] and sp.solve(x - (x / 2 + 1), x) == [2]


Q.verify(check)
Q.save()
