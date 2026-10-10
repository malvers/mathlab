#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 2 / KW 35 (LB 1): limits at infinity - 15 questions of the Grundkurs sheet,
5 harder ones (ln x / x, (1 + 1/x)^x, oblique behaviour, x^2 e^x, a parameter). Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=2, slug='grenzwerte-unendlich', thema='Grenzwerte im Unendlichen', lb='LB 1',
           blurb='Verhalten für große x, Asymptoten, Wachstumsvergleich, Langzeitverhalten',
           comment='Questions 1-15 from the Grundkurs sheet (mathegy11/w02), 16-20 Leistungskurs.')

qs, check_gk = harvest('w02-grenzwerte-unendlich.py', [1, 2, 3, 4, 5, 8, 9, 10, 11, 13, 14, 15, 17, 18, 19])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------------------ Leistungskurs ----
Q.q(r'Bestimme $\lim\limits_{x \to \infty} \dfrac{\ln x}{x}$.',
    [r'0', r'1', r'$\infty$', r'Der Grenzwert existiert nicht.'],
    [r'Zähler und Nenner wachsen, aber $\ln x$ wächst langsamer als jede Potenz von $x$.',
     r'Wertetabelle: $\tfrac{\ln 100}{100} \approx 0{,}046$, $\tfrac{\ln 10^6}{10^6} \approx 0{,}000\,014$.',
     r'Also Grenzwert 0.'])

Q.q(r'Die Wertetabelle von $\left(1 + \dfrac{1}{x}\right)^x$ für $x = 10$; 1000; $10^6$ lautet etwa 2,594; 2,717; $2{,}718\,28$. Wogegen strebt der Term?',
    [r'gegen die Eulersche Zahl $e$', r'gegen 1, weil $1 + \tfrac{1}{x} \to 1$', r'gegen $\infty$, weil der Exponent wächst', r'gegen 2'],
    [r'Basis gegen 1 und Exponent gegen $\infty$ ziehen in verschiedene Richtungen.',
     r'Die Werte nähern sich $2{,}718\,28\ldots = e$.',
     r'So kann man $e$ auch definieren (stetige Verzinsung).'])

Q.q(r'Wie verhält sich $f(x) = \dfrac{x^2 + 1}{x - 1}$ für $x \to \infty$?',
    [r'Kein endlicher Grenzwert; der Graph nähert sich der Geraden $y = x + 1$.', r'Grenzwert 1', r'Grenzwert 0', r'Grenzwert −1'],
    [r'Zählergrad größer als Nennergrad: $f(x) \to \infty$.',
     r'Polynomdivision: $\dfrac{x^2 + 1}{x - 1} = x + 1 + \dfrac{2}{x - 1}$.',
     r'Der Rest $\tfrac{2}{x - 1}$ geht gegen 0: schiefe Asymptote $y = x + 1$.'])

Q.q(r'Bestimme $\lim\limits_{x \to -\infty} x^2 e^{x}$.',
    [r'0', r'$\infty$', r'$-\infty$', r'1'],
    [r'$x^2 \to \infty$, aber $e^x \to 0$.',
     r'$x^2 e^x = \dfrac{x^2}{e^{-x}}$, und $e^{-x}$ wächst für $x \to -\infty$ schneller als jede Potenz.',
     r'Also Grenzwert 0.'])

Q.q(r'Für welches $a$ hat $f(x) = \dfrac{a x^2 + 1}{2x^2 - 3}$ die waagerechte Asymptote $y = 3$?',
    [r'$a = 6$', r'$a = 3$', r'$a = \dfrac{3}{2}$', r'$a = 1$'],
    [r'Gleicher Grad: Grenzwert $\dfrac{a}{2}$.',
     r'$\dfrac{a}{2} = 3 \Rightarrow a = 6$.'])


def check():
    import sympy as sp
    x, a = sp.symbols('x a')
    check_gk()
    assert sp.limit(sp.log(x) / x, x, sp.oo) == 0
    assert abs(float(sp.log(100) / 100) - 0.046) < 0.001 and abs(float(sp.log(10 ** 6) / 10 ** 6) - 0.000014) < 0.000001
    for v, approx in ((10, 2.594), (1000, 2.717), (10 ** 6, 2.71828)):
        assert abs((1 + 1 / v) ** v - approx) < 0.001
    assert sp.limit((1 + 1 / x) ** x, x, sp.oo) == sp.E
    q, r = sp.div(x ** 2 + 1, x - 1, x)
    assert q == x + 1 and r == 2 and sp.limit((x ** 2 + 1) / (x - 1) - (x + 1), x, sp.oo) == 0
    assert sp.limit(x ** 2 * sp.exp(x), x, -sp.oo) == 0
    assert sp.solve(sp.Eq(sp.limit((a * x ** 2 + 1) / (2 * x ** 2 - 3), x, sp.oo), 3), a) == [6]


Q.verify(check)
Q.save()
