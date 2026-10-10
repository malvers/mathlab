#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 11 / KW 46 (LB 1): curvature, inflection points, zeros, symmetry - 16 questions of
the Grundkurs sheet, 4 harder ones (symmetry to any axis or point, the bell curve). Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=11, slug='wendepunkte-symmetrie', thema='Wendepunkte, Nullstellen und Symmetrie', lb='LB 1',
           blurb='Krümmung, Wendepunkte, Nullstellen, Symmetrie zu Achsen und Punkten',
           comment='Questions 1-16 from the Grundkurs sheet (mathegy11/w10), 17-20 Leistungskurs.')

qs, check_gk = harvest('w10-wendepunkte-symmetrie.py', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 16, 17])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------------------ Leistungskurs ----
Q.q(r'Woran erkennt man rechnerisch, dass der Graph von $f(x) = (x - 2)^2 + 1$ symmetrisch zur Geraden $x = 2$ ist?',
    [r'$f(2 + h) = f(2 - h)$ für alle $h$', r'$f(-x) = f(x)$', r'$f(2) = 1$', r'$f(x + 2) = f(x) + 2$'],
    [r'Achsensymmetrie zu $x = a$: gleiche Werte im gleichen Abstand links und rechts von $a$.',
     r'$f(2 \pm h) = h^2 + 1$.'])

Q.q(r'Zu welchem Punkt ist der Graph von $f(x) = x^3 - 3x^2$ punktsymmetrisch?',
    [r'zu seinem Wendepunkt $W(1 \mid -2)$', r'zum Ursprung', r'zum Tiefpunkt $(2 \mid -4)$', r'zu keinem Punkt'],
    [r'Jede Funktion dritten Grades ist punktsymmetrisch zu ihrem Wendepunkt.',
     r'Probe: $f(1 + h) + f(1 - h) = -4 = 2 \cdot f(1)$ für alle $h$.'])

Q.q(r'$f^{\prime\prime}(x_0) = 0$ und $f^{\prime\prime\prime}(x_0) \neq 0$. Was folgt?',
    [r'Bei $x_0$ liegt ein Wendepunkt.', r'Bei $x_0$ liegt ein Hochpunkt.', r'Bei $x_0$ liegt eine Nullstelle.', r'Es folgt nichts.'],
    [r'$f^{\prime\prime\prime}(x_0) \neq 0$ heißt: $f^{\prime\prime}$ wechselt bei $x_0$ das Vorzeichen.',
     r'Das ist eine hinreichende Bedingung für einen Wendepunkt.'])

Q.q(r'Wo hat die Glockenkurve $f(x) = e^{-x^2}$ ihre Wendestellen?',
    [r'bei $x = \pm\dfrac{1}{\sqrt{2}} \approx \pm 0{,}71$', r'bei $x = 0$', r'bei $x = \pm 1$', r'Sie hat keine.'],
    [r'$f^{\prime}(x) = -2x\,e^{-x^2}$, $f^{\prime\prime}(x) = (4x^2 - 2)\,e^{-x^2}$.',
     r'$4x^2 - 2 = 0 \Leftrightarrow x = \pm\tfrac{1}{\sqrt{2}}$, jeweils mit Vorzeichenwechsel. Diese Kurve kommt in Jahrgangsstufe 12 bei der Normalverteilung wieder.'])


def check():
    import sympy as sp
    x, h = sp.symbols('x h', real=True)
    check_gk()
    f = (x - 2) ** 2 + 1
    assert sp.expand(f.subs(x, 2 + h) - f.subs(x, 2 - h)) == 0
    g = x ** 3 - 3 * x ** 2
    assert sp.expand(g.subs(x, 1 + h) + g.subs(x, 1 - h)) == -4 and g.subs(x, 1) == -2 and g.subs(x, 2) == -4
    e = sp.exp(-x ** 2)
    assert sp.simplify(sp.diff(e, x, 2) - (4 * x ** 2 - 2) * e) == 0
    assert sorted(sp.solve(4 * x ** 2 - 2, x)) == [-1 / sp.sqrt(2), 1 / sp.sqrt(2)] and abs(float(1 / sp.sqrt(2)) - 0.71) < 0.01


Q.verify(check)
Q.save()
