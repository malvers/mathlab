#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 9 / KW 44 (LB 1): chain rule with the Leistungskurs examples of the Lehrplan -
16 questions of the Grundkurs sheet, 4 harder ones. Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=9, slug='kettenregel', thema='Die Kettenregel', lb='LB 1',
           blurb='innere und äußere Funktion, Verkettungen und Verknüpfungen, Beispiele aus dem Lehrplan',
           comment='Questions 1-16 from the Grundkurs sheet (mathegy11/w08), 17-20 Leistungskurs (Lehrplan examples, double chains).')

qs, check_gk = harvest('w08-kettenregel.py', [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 13, 14, 16, 17, 18])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------------------ Leistungskurs ----
Q.q(r'Leite ab (Beispiel aus dem Lehrplan): $f(x) = 3x^2 \cdot e^{2x - 5}$.',
    [r'$f^{\prime}(x) = 6x(1 + x)\,e^{2x - 5}$', r'$f^{\prime}(x) = 6x\,e^{2x - 5}$', r'$f^{\prime}(x) = 12x\,e^{2x - 5}$', r'$f^{\prime}(x) = 6x\,e^{2}$'],
    [r'Produktregel mit $u = 3x^2$ und $v = e^{2x - 5}$, $v^{\prime} = 2e^{2x - 5}$ (Kettenregel).',
     r'$6x\,e^{2x - 5} + 6x^2 e^{2x - 5} = 6x(1 + x)\,e^{2x - 5}$'])

Q.q(r'Leite ab (Beispiel aus dem Lehrplan): $f(x) = \tfrac{1}{2}x^2 \sin(2x - 1)$.',
    [r'$f^{\prime}(x) = x \sin(2x - 1) + x^2 \cos(2x - 1)$', r'$f^{\prime}(x) = x \cos(2x - 1)$', r'$f^{\prime}(x) = x \sin(2x - 1) + \tfrac{1}{2}x^2 \cos(2x - 1)$', r'$f^{\prime}(x) = 2x \cos(2x - 1)$'],
    [r'$u = \tfrac{1}{2}x^2$, $u^{\prime} = x$; $v = \sin(2x - 1)$, $v^{\prime} = 2\cos(2x - 1)$.',
     r'$x \sin(2x - 1) + \tfrac{1}{2}x^2 \cdot 2\cos(2x - 1)$'])

Q.q(r'Leite ab: $f(x) = e^{\sin(2x)}$.',
    [r'$f^{\prime}(x) = 2\cos(2x)\,e^{\sin(2x)}$', r'$f^{\prime}(x) = \cos(2x)\,e^{\sin(2x)}$', r'$f^{\prime}(x) = e^{\cos(2x)}$', r'$f^{\prime}(x) = 2\,e^{\sin(2x)}$'],
    [r'Dreifache Verkettung: außen $e^z$, Mitte $\sin w$, innen $2x$.',
     r'Kettenregel zweimal: $e^{\sin(2x)} \cdot \cos(2x) \cdot 2$.'])

Q.q(r'Begründe mit der Kettenregel: $(a^x)^{\prime} = \ln a \cdot a^x$. Welche Umformung ist der Schlüssel?',
    [r'$a^x = e^{x \ln a}$, dann ist die innere Ableitung $\ln a$.', r'$a^x = x^a$', r'$a^x = \ln(x^a)$', r'$a^x = e^a \cdot x$'],
    [r'$a = e^{\ln a}$, also $a^x = e^{x \ln a}$.',
     r'Kettenregel: $e^{x \ln a} \cdot \ln a = \ln a \cdot a^x$. Das bestätigt das Ergebnis aus Woche 6.'])


def check():
    import sympy as sp
    x = sp.symbols('x', real=True)
    a = sp.symbols('a', positive=True)
    d = lambda e: sp.diff(e, x)
    eq = lambda u, v: sp.simplify(u - v) == 0
    check_gk()
    assert eq(d(3 * x ** 2 * sp.exp(2 * x - 5)), 6 * x * (1 + x) * sp.exp(2 * x - 5))
    assert eq(d(x ** 2 / 2 * sp.sin(2 * x - 1)), x * sp.sin(2 * x - 1) + x ** 2 * sp.cos(2 * x - 1))
    assert eq(d(sp.exp(sp.sin(2 * x))), 2 * sp.cos(2 * x) * sp.exp(sp.sin(2 * x)))
    assert eq(sp.diff(sp.exp(x * sp.log(a)), x), sp.log(a) * a ** x)


Q.verify(check)
Q.save()
