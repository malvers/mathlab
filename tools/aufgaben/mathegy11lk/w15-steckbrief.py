#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 15 / KW 50 (LB 1): polynomial functions from conditions - 15 questions of the
Grundkurs sheet, 5 harder ones (tangent conditions, saddle point, inflection tangent, symmetric quartic, checking the
sufficient condition). Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=15, slug='steckbrief', thema='Ganzrationale Funktionen aus Bedingungen', lb='LB 1',
           blurb='Bedingungen übersetzen, Gleichungssystem aufstellen und lösen, Tangente, Symmetrie, Probe',
           comment='Questions 1-15 from the Grundkurs sheet (mathegy11/w15), 16-20 Leistungskurs.')

qs, check_gk = harvest('w15-steckbrief.py', [0, 1, 2, 3, 4, 5, 8, 9, 12, 13, 14, 15, 16, 18, 19])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------------------ Leistungskurs ----
Q.q(r'Der Graph von $f$ hat bei $x = 1$ die Tangente $y = 2x - 1$. Welche Bedingungen folgen?',
    [r'$f(1) = 1$ und $f^{\prime}(1) = 2$', r'$f(1) = 2$ und $f^{\prime}(1) = -1$', r'$f(1) = 1$ und $f^{\prime}(1) = 0$', r'nur $f^{\prime}(1) = 2$'],
    [r'Berührpunkt: Die Tangente hat bei $x = 1$ den Wert $2 \cdot 1 - 1 = 1$.',
     r'Gleicher Anstieg: $f^{\prime}(1)$ ist der Anstieg der Tangente.'])

Q.q(r'Eine Funktion dritten Grades hat im Ursprung einen Wendepunkt mit waagerechter Tangente (Sattelpunkt). Welcher Ansatz bleibt?',
    [r'$f(x) = ax^3$', r'$f(x) = ax^3 + cx$', r'$f(x) = ax^3 + bx^2$', r'$f(x) = ax^3 + d$'],
    [r'$f(0) = 0 \Rightarrow d = 0$, $f^{\prime}(0) = 0 \Rightarrow c = 0$, $f^{\prime\prime}(0) = 0 \Rightarrow b = 0$.'])

Q.q(r'Gesucht ist eine Funktion dritten Grades durch den Ursprung mit Wendepunkt $W(1 \mid 2)$, deren Wendetangente den Anstieg −3 hat. Wie lautet sie?',
    [r'$f(x) = 5x^3 - 15x^2 + 12x$', r'$f(x) = 2x^3 - 6x^2 + 6x$', r'$f(x) = -x^3 + 3x^2$', r'$f(x) = x^3 - 3x^2 + 4x$'],
    [r'$d = 0$; $f(1) = 2$: $a + b + c = 2$; $f^{\prime\prime}(1) = 0$: $6a + 2b = 0$; $f^{\prime}(1) = -3$: $3a + 2b + c = -3$.',
     r'Mit $b = -3a$: $c = 2 + 2a$ und $-a + 2 = -3$, also $a = 5$, $b = -15$, $c = 12$.',
     r'Die anderen Funktionen erfüllen nur einen Teil der Bedingungen.'])

Q.q(r'Der Graph einer Funktion vierten Grades ist achsensymmetrisch zur $y$-Achse, geht durch $(0 \mid 2)$ und hat den Tiefpunkt $T(1 \mid 1)$. Wie lautet $f$?',
    [r'$f(x) = x^4 - 2x^2 + 2$', r'$f(x) = x^4 - 2x^2 + 1$', r'$f(x) = 2x^4 - 3x^2 + 2$', r'$f(x) = x^4 + 2x^2 + 2$'],
    [r'Ansatz $f(x) = ax^4 + cx^2 + e$ mit $e = 2$.',
     r'$f(1) = 1$: $a + c = -1$; $f^{\prime}(1) = 0$: $4a + 2c = 0$. Also $a = 1$, $c = -2$.',
     r'Probe: $f^{\prime\prime}(1) = 12 - 4 = 8 > 0$, also wirklich ein Tiefpunkt.'])

Q.q(r'Warum prüft man nach dem Lösen des Gleichungssystems, ob der geforderte Hochpunkt wirklich einer ist?',
    [r'$f^{\prime}(x_0) = 0$ ist nur notwendig; die Lösung kann dort auch einen Tiefpunkt oder Sattelpunkt haben.',
     r'Weil das CAS sich oft verrechnet.', r'Weil Gleichungssysteme nie eindeutig lösbar sind.', r'Das ist nicht nötig.'],
    [r'In das Gleichungssystem geht nur die Bedingung $f^{\prime}(x_0) = 0$ ein.',
     r'Erst $f^{\prime\prime}(x_0) < 0$ oder ein Vorzeichenwechsel von $+$ nach $-$ bestätigt den Hochpunkt.'])


def check():
    import sympy as sp
    x, a, b, c, d, e = sp.symbols('x a b c d e', real=True)
    check_gk()
    f = a * x ** 3 + b * x ** 2 + c * x + d
    s = sp.solve([f.subs(x, 0), sp.diff(f, x).subs(x, 0), sp.diff(f, x, 2).subs(x, 0)], [b, c, d])
    assert s == {b: 0, c: 0, d: 0}
    s = sp.solve([f.subs(x, 0), f.subs(x, 1) - 2, sp.diff(f, x, 2).subs(x, 1), sp.diff(f, x).subs(x, 1) + 3], [a, b, c, d])
    assert s == {a: 5, b: -15, c: 12, d: 0}
    for g in (2 * x ** 3 - 6 * x ** 2 + 6 * x, -x ** 3 + 3 * x ** 2, x ** 3 - 3 * x ** 2 + 4 * x):   # distractors miss the slope
        assert g.subs(x, 1) == 2 and sp.diff(g, x).subs(x, 1) != -3
    q = a * x ** 4 + c * x ** 2 + e
    s = sp.solve([q.subs(x, 0) - 2, q.subs(x, 1) - 1, sp.diff(q, x).subs(x, 1)], [a, c, e])
    assert s == {a: 1, c: -2, e: 2}
    assert sp.diff(x ** 4 - 2 * x ** 2 + 2, x, 2).subs(x, 1) == 8


Q.verify(check)
Q.save()
