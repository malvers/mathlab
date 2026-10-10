#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 12 / KW 47 (LB 1): poles and asymptotes, including oblique asymptotes by polynomial
division - 15 questions of the Grundkurs sheet, 5 on oblique asymptotes. Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=12, slug='polstellen-asymptoten', thema='Polstellen und Asymptoten', lb='LB 1',
           blurb='Polstellen, Lücken, waagerechte, senkrechte und schiefe Asymptoten, Sachzusammenhang',
           comment='Questions 1-15 from the Grundkurs sheet (mathegy11/w11), 16-20 oblique asymptotes.')

qs, check_gk = harvest('w11-polstellen-asymptoten.py', [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 16, 18])
for a, k in qs:
    Q.q(*a, **k)

# --------------------------------------------------------- oblique asymptotes ----
Q.q(r'Welche Asymptote hat $f(x) = \dfrac{x^2 + 1}{x}$ für $x \to \pm\infty$?',
    [r'die schiefe Asymptote $y = x$', r'die waagerechte Asymptote $y = 1$', r'die waagerechte Asymptote $y = 0$', r'keine'],
    [r'$\dfrac{x^2 + 1}{x} = x + \dfrac{1}{x}$.',
     r'$\dfrac{1}{x} \to 0$: Der Graph nähert sich der Geraden $y = x$.'])

Q.q(r'Bestimme die schiefe Asymptote von $f(x) = \dfrac{2x^2 - 3x + 1}{x - 2}$.',
    [r'$y = 2x + 1$', r'$y = 2x - 3$', r'$y = 2x$', r'$y = x - 2$'],
    [r'Polynomdivision (mit CAS): $(2x^2 - 3x + 1) : (x - 2) = 2x + 1$ Rest 3.',
     r'$f(x) = 2x + 1 + \dfrac{3}{x - 2}$, der Rest geht gegen 0.'])

Q.q(r'Wann hat eine gebrochenrationale Funktion eine schiefe Asymptote?',
    [r'wenn der Zählergrad genau um 1 größer ist als der Nennergrad', r'wenn Zähler- und Nennergrad gleich sind',
     r'wenn der Nennergrad größer ist', r'wenn der Zählergrad um 2 größer ist'],
    [r'Die Polynomdivision liefert dann einen linearen Anteil $mx + n$ mit $m \neq 0$.',
     r'Bei gleichem Grad: waagerecht; Zählergrad 2 höher: eine Parabel als Näherungskurve.'])

Q.q(r'Welche Asymptote hat $f(x) = \dfrac{x^3}{x^2 + 1}$?',
    [r'$y = x$', r'$y = 1$', r'$y = 0$', r'$x = -1$'],
    [r'$\dfrac{x^3}{x^2 + 1} = x - \dfrac{x}{x^2 + 1}$.',
     r'Der Bruch geht gegen 0, die schiefe Asymptote ist $y = x$. Polstellen gibt es keine, denn $x^2 + 1 > 0$.'])

Q.q(r'Schneidet der Graph von $f(x) = \dfrac{x^3}{x^2 + 1}$ seine Asymptote $y = x$?',
    [r'Ja, im Ursprung.', r'Nein, nie.', r'Ja, bei $x = 1$.', r'Ja, unendlich oft.'],
    [r'$f(x) - x = -\dfrac{x}{x^2 + 1}$ ist nur für $x = 0$ gleich 0.',
     r'Also ein gemeinsamer Punkt $(0 \mid 0)$; für $x > 0$ liegt der Graph unter, für $x < 0$ über der Asymptote.'])


def check():
    import sympy as sp
    x = sp.symbols('x', real=True)
    check_gk()
    assert sp.simplify((x ** 2 + 1) / x - (x + 1 / x)) == 0
    q, r = sp.div(2 * x ** 2 - 3 * x + 1, x - 2, x)
    assert q == 2 * x + 1 and r == 3
    q, r = sp.div(x ** 3, x ** 2 + 1, x)
    assert q == x and r == -x and sp.limit(x ** 3 / (x ** 2 + 1) - x, x, sp.oo) == 0
    assert sp.solve(sp.Eq(x ** 3 / (x ** 2 + 1), x), x) == [0]


Q.verify(check)
Q.save()
