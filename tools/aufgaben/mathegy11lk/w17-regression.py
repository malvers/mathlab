#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 17 / KW 52 (LB 1): equations of functions by regression - 16 questions of the
Grundkurs sheet, 4 harder ones (least squares, linearising exponential data, residual patterns, computing a
residual). Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=17, slug='regression', thema='Funktionsgleichungen durch Regression', lb='LB 1',
           blurb='Modelltyp begründet wählen, Regression mit CAS, Bestimmtheitsmaß, Residuen, Grenzen des Modells',
           comment='Questions 1-16 from the Grundkurs sheet (mathegy11/w18), 17-20 Leistungskurs.')

qs, check_gk = harvest('w18-regression.py', [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 15, 17, 19])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------------------ Leistungskurs ----
Q.q(r'Was macht die lineare Regression (Methode der kleinsten Quadrate) möglichst klein?',
    [r'die Summe der Quadrate aller Residuen', r'das größte Residuum', r'die Summe aller Residuen', r'die Anzahl der Punkte neben der Geraden'],
    [r'Quadrieren verhindert, dass sich positive und negative Abweichungen aufheben.',
     r'Die Summe der Residuen allein ist bei der Ausgleichsgeraden immer 0.'])

Q.q(r'Exponentielle Messwerte $y = a \cdot e^{kx}$: Was passiert, wenn man $\ln y$ gegen $x$ aufträgt?',
    [r'Die Punkte liegen auf einer Geraden mit Anstieg $k$ und Achsenabschnitt $\ln a$.', r'Die Punkte liegen auf einer Parabel.',
     r'Die Punkte liegen auf einer Geraden durch den Ursprung mit Anstieg $a$.', r'Es entsteht wieder eine Exponentialkurve.'],
    [r'$\ln y = \ln a + kx$ ist linear in $x$.',
     r'So kann man mit einer linearen Regression $k$ und $a$ bestimmen.'])

Q.q(r'Die Residuen einer linearen Regression sind erst positiv, dann negativ, dann wieder positiv (U-förmiges Muster). Was folgt?',
    [r'Der lineare Modelltyp passt nicht; ein gekrümmtes Modell (z. B. quadratisch) ist besser.', r'Das Modell ist perfekt.',
     r'Man muss mehr Nachkommastellen angeben.', r'Die Messwerte sind falsch.'],
    [r'Bei passendem Modell streuen Residuen zufällig um 0.',
     r'Ein systematisches Muster zeigt, dass die Daten gekrümmt verlaufen.'])

Q.q(r'Das Modell lautet $y = 2x + 2$, gemessen wurde der Punkt $(4 \mid 11)$. Wie groß ist das Residuum?',
    [r'1', r'−1', r'10', r'11'],
    [r'Modellwert: $2 \cdot 4 + 2 = 10$.',
     r'Residuum = Messwert minus Modellwert: $11 - 10 = 1$.'])


def check():
    import sympy as sp
    check_gk()
    import random
    random.seed(7)
    xs = list(range(6))
    ys = [2 * v + 1 + random.uniform(-1, 1) for v in xs]
    n = len(xs); mx = sum(xs) / n; my = sum(ys) / n
    m = sum((p - mx) * (q - my) for p, q in zip(xs, ys)) / sum((p - mx) ** 2 for p in xs); b = my - m * mx
    assert abs(sum(q - (m * p + b) for p, q in zip(xs, ys))) < 1e-9                    # residuals of the fit sum to 0
    x, a, k = sp.symbols('x a k', positive=True)
    assert sp.expand_log(sp.log(a * sp.exp(k * x)), force=True) == sp.log(a) + k * x
    xs = [-2, -1, 0, 1, 2]
    ys = [v ** 2 for v in xs]                                                         # parabola, linear fit -> U pattern
    mx = 0; my = sum(ys) / 5
    m = sum(p * (q - my) for p, q in zip(xs, ys)) / sum(p * p for p in xs); b = my
    res = [q - (m * p + b) for p, q in zip(xs, ys)]
    assert res[0] > 0 and res[2] < 0 and res[4] > 0
    assert 11 - (2 * 4 + 2) == 1


Q.verify(check)
Q.save()
