#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 10 / KW 45 (LB 1): monotonicity and extrema - 16 questions of the Grundkurs sheet,
4 harder ones (families with a parameter, open intervals, x^2 e^-x, strict monotonicity). Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=10, slug='monotonie-extrema', thema='Monotonie und Extrema', lb='LB 1',
           blurb='Monotonie über f′, notwendige und hinreichende Bedingung, globale Extrema, Parameter',
           comment='Questions 1-16 from the Grundkurs sheet (mathegy11/w09), 17-20 Leistungskurs.')

qs, check_gk = harvest('w09-monotonie-extrema.py', [0, 1, 2, 4, 5, 6, 8, 9, 10, 11, 13, 14, 15, 17, 18, 19])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------------------ Leistungskurs ----
Q.q(r'Für welche $a$ hat $f_a(x) = x^3 - a x$ zwei Extrempunkte?',
    [r'für $a > 0$', r'für $a < 0$', r'für $a = 0$', r'für alle $a$'],
    [r'$f_a^{\prime}(x) = 3x^2 - a = 0 \Leftrightarrow x^2 = \tfrac{a}{3}$.',
     r'Zwei Lösungen mit Vorzeichenwechsel nur für $a > 0$: $x = \pm\sqrt{\tfrac{a}{3}}$.'])

Q.q(r'Hat $f(x) = x^2$ auf dem offenen Intervall $(-1;\,2)$ ein globales Maximum?',
    [r'Nein, die Werte kommen 4 beliebig nahe, erreichen 4 aber nicht.', r'Ja, 4 bei $x = 2$.', r'Ja, 1 bei $x = -1$.', r'Ja, 0 bei $x = 0$.'],
    [r'Die Randstellen gehören nicht zum Intervall.',
     r'Das globale Minimum 0 bei $x = 0$ existiert, ein Maximum nicht.'])

Q.q(r'Welche Extrempunkte hat $f(x) = x^2 e^{-x}$?',
    [r'$T(0 \mid 0)$ und $H\!\left(2 \mid \tfrac{4}{e^2}\right)$', r'nur $T(0 \mid 0)$', r'$H(0 \mid 0)$ und $T\!\left(2 \mid \tfrac{4}{e^2}\right)$', r'$H(1 \mid e^{-1})$'],
    [r'$f^{\prime}(x) = 2x e^{-x} - x^2 e^{-x} = x(2 - x)e^{-x}$.',
     r'Vorzeichen: minus vor 0, plus zwischen 0 und 2, minus danach.',
     r'$f(2) = 4e^{-2} \approx 0{,}54$.'])

Q.q(r'$f(x) = x^3$ hat $f^{\prime}(0) = 0$. Ist $f$ trotzdem auf ganz $\mathbb{R}$ streng monoton steigend?',
    [r'Ja, $f^{\prime}(x) > 0$ bis auf die einzelne Stelle 0 reicht.', r'Nein, weil $f^{\prime}(0) = 0$ ist.', r'Nein, $f$ fällt für $x < 0$.', r'Nur für $x > 0$.'],
    [r'Für $x_1 < x_2$ ist immer $x_1^3 < x_2^3$.',
     r'Eine isolierte Nullstelle von $f^{\prime}$ ohne Vorzeichenwechsel stört die strenge Monotonie nicht.'])


def check():
    import sympy as sp
    x = sp.symbols('x', real=True)
    a = sp.symbols('a', positive=True)
    check_gk()
    assert sorted(sp.solve(sp.diff(x ** 3 - a * x, x), x), key=lambda s: s.subs(a, 3)) == [-sp.sqrt(3 * a) / 3, sp.sqrt(3 * a) / 3]
    assert sp.solve(sp.diff(x ** 3 + 1 * x, x), x) == [] and sp.solve(sp.diff(x ** 3, x), x) == [0]
    f = x ** 2 * sp.exp(-x)
    assert sorted(sp.solve(sp.diff(f, x), x)) == [0, 2] and sp.simplify(f.subs(x, 2) - 4 * sp.exp(-2)) == 0
    assert abs(float(4 * sp.exp(-2)) - 0.54) < 0.01
    assert sp.diff(f, x, 2).subs(x, 0) > 0 and sp.diff(f, x, 2).subs(x, 2) < 0


Q.verify(check)
Q.save()
