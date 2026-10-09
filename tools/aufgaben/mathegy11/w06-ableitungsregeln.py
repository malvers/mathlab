#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 6 / KW 39 (LB 1): power, factor and sum rule, power
functions with rational exponents, first look at reversing differentiation.
Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=6, slug='ableitungsregeln', thema='Ableitungsregeln für Potenzfunktionen', lb='LB 1',
         blurb='Potenz-, Faktor- und Summenregel, rationale Exponenten, Umkehrung',
         comment='Blocks: power, factor and sum rule (1-5), rational and negative exponents (6-11), tangents and applications (12-17), reversing (18-20). No CAS.')

# -------------------------------------------- power, factor and sum rule ----
Q.q(r'Bestimme die Ableitung von $f(x) = x^7$.',
    [r'$f^{\prime}(x) = 7x^6$', r'$f^{\prime}(x) = 7x^7$', r'$f^{\prime}(x) = 6x^7$', r'$f^{\prime}(x) = x^6$'],
    [r'Potenzregel: $(x^n)^{\prime} = n \cdot x^{n-1}$.',
     r'Der Exponent 7 wird Faktor, der neue Exponent ist 6.'])

Q.q(r'Bestimme die Ableitung von $f(x) = 5x^4$.',
    [r'$f^{\prime}(x) = 20x^3$', r'$f^{\prime}(x) = 5x^3$', r'$f^{\prime}(x) = 20x^4$', r'$f^{\prime}(x) = 9x^3$'],
    [r'Faktorregel: Der Faktor 5 bleibt stehen.',
     r'$5 \cdot 4x^3 = 20x^3$'])

Q.q(r'Bestimme die Ableitung von $f(x) = 2x^3 - 4x^2 + x - 9$.',
    [r'$f^{\prime}(x) = 6x^2 - 8x + 1$', r'$f^{\prime}(x) = 6x^2 - 8x + 1 - 9$', r'$f^{\prime}(x) = 6x^2 - 4x + 1$', r'$f^{\prime}(x) = 6x^3 - 8x^2 + x$'],
    [r'Summenregel: jeden Summanden einzeln ableiten.',
     r'$6x^2 - 8x + 1$; die Konstante −9 fällt weg.'])

Q.q(r'Welche Regel wird bei $(x^3 + x^2)^{\prime} = 3x^2 + 2x$ benutzt?',
    [r'Summenregel und Potenzregel', r'Produktregel', r'Kettenregel', r'Quotientenregel'],
    [r'Die Funktion ist eine Summe zweier Potenzen.',
     r'Summenregel: $(u + v)^{\prime} = u^{\prime} + v^{\prime}$; jede Potenz nach der Potenzregel.'])

Q.q(r'Bestimme die Ableitung von $f(x) = x^2 \cdot (x + 1)$.',
    [r'$f^{\prime}(x) = 3x^2 + 2x$', r'$f^{\prime}(x) = 2x \cdot 1$', r'$f^{\prime}(x) = 2x$', r'$f^{\prime}(x) = 3x^2 + 1$'],
    [r'Erst ausmultiplizieren: $f(x) = x^3 + x^2$.',
     r'Dann summandenweise: $3x^2 + 2x$.',
     r'Falle: Ein Produkt darf man nicht faktorweise ableiten.'])

# --------------------------------------- rational and negative exponents ----
Q.q(r'Bestimme die Ableitung von $f(x) = \sqrt{x}$.',
    [r'$f^{\prime}(x) = \dfrac{1}{2\sqrt{x}}$', r'$f^{\prime}(x) = \dfrac{1}{\sqrt{x}}$', r'$f^{\prime}(x) = 2\sqrt{x}$', r'$f^{\prime}(x) = \dfrac{\sqrt{x}}{2}$'],
    [r'$\sqrt{x} = x^{\frac{1}{2}}$',
     r'$\left(x^{\frac{1}{2}}\right)^{\prime} = \dfrac{1}{2} x^{-\frac{1}{2}} = \dfrac{1}{2\sqrt{x}}$'])

Q.q(r'Bestimme die Ableitung von $f(x) = \dfrac{1}{x^2}$.',
    [r'$f^{\prime}(x) = -\dfrac{2}{x^3}$', r'$f^{\prime}(x) = \dfrac{2}{x^3}$', r'$f^{\prime}(x) = -\dfrac{1}{2x}$', r'$f^{\prime}(x) = \dfrac{1}{2x}$'],
    [r'$\dfrac{1}{x^2} = x^{-2}$',
     r'$(x^{-2})^{\prime} = -2x^{-3} = -\dfrac{2}{x^3}$'])

Q.q(r'Bestimme die Ableitung von $f(x) = \dfrac{3}{x}$.',
    [r'$f^{\prime}(x) = -\dfrac{3}{x^2}$', r'$f^{\prime}(x) = \dfrac{3}{x^2}$', r'$f^{\prime}(x) = 3$', r'$f^{\prime}(x) = -\dfrac{1}{3x^2}$'],
    [r'$\dfrac{3}{x} = 3x^{-1}$',
     r'$3 \cdot (-1) x^{-2} = -\dfrac{3}{x^2}$'])

Q.q(r'Bestimme die Ableitung von $f(x) = x^{\frac{2}{3}}$.',
    [r'$f^{\prime}(x) = \dfrac{2}{3} x^{-\frac{1}{3}}$', r'$f^{\prime}(x) = \dfrac{2}{3} x^{\frac{1}{3}}$', r'$f^{\prime}(x) = \dfrac{2}{3} x^{-\frac{2}{3}}$', r'$f^{\prime}(x) = x^{-\frac{1}{3}}$'],
    [r'Die Potenzregel gilt auch für rationale Exponenten.',
     r'Neuer Exponent: $\dfrac{2}{3} - 1 = -\dfrac{1}{3}$.'])

Q.q(r'Bestimme die Ableitung von $f(x) = \dfrac{x^2 + 4}{x}$ ohne Quotientenregel.',
    [r'$f^{\prime}(x) = 1 - \dfrac{4}{x^2}$', r'$f^{\prime}(x) = 2x$', r'$f^{\prime}(x) = 1 + \dfrac{4}{x^2}$', r'$f^{\prime}(x) = \dfrac{2x}{1}$'],
    [r'Erst aufteilen: $f(x) = x + \dfrac{4}{x} = x + 4x^{-1}$.',
     r'$f^{\prime}(x) = 1 - 4x^{-2} = 1 - \dfrac{4}{x^2}$'])

Q.q(r'Wie groß ist der Anstieg von $f(x) = \sqrt{x}$ an der Stelle $x = 4$?',
    [r'$\dfrac{1}{4}$', r'$\dfrac{1}{2}$', r'2', r'4'],
    [r'$f^{\prime}(x) = \dfrac{1}{2\sqrt{x}}$',
     r'$f^{\prime}(4) = \dfrac{1}{2 \cdot 2} = \dfrac{1}{4}$'])

# ------------------------------------------- tangents and applications ----
Q.q(r'Bestimme die zweite Ableitung von $f(x) = x^4$.',
    [r'$f^{\prime\prime}(x) = 12x^2$', r'$f^{\prime\prime}(x) = 4x^3$', r'$f^{\prime\prime}(x) = 16x^2$', r'$f^{\prime\prime}(x) = 12x^3$'],
    [r'$f^{\prime}(x) = 4x^3$',
     r'$f^{\prime\prime}(x) = 3 \cdot 4x^2 = 12x^2$'])

Q.q(r'Wie lautet die Tangente an $f(x) = x^3$ an der Stelle $x_0 = 2$?',
    [r'$y = 12x - 16$', r'$y = 12x + 8$', r'$y = 3x + 2$', r'$y = 12x - 24$'],
    [r'$f(2) = 8$, $f^{\prime}(x) = 3x^2$, $f^{\prime}(2) = 12$',
     r'$y = 12(x - 2) + 8 = 12x - 16$'])

Q.q(r'An welchen Stellen hat $f(x) = x^3 - 3x$ eine waagerechte Tangente?',
    [r'$x = -1$ und $x = 1$', r'$x = 0$', r'$x = \sqrt{3}$ und $x = -\sqrt{3}$', r'$x = 3$'],
    [r'Waagerecht heißt $f^{\prime}(x) = 0$.',
     r'$3x^2 - 3 = 0 \Rightarrow x^2 = 1$',
     r'$\pm\sqrt{3}$ sind die Nullstellen von $f$, nicht von $f^{\prime}$.'])

Q.q(r'Ein Stein fällt nach $s(t) = 4{,}9t^2$ ($s$ in m, $t$ in s). Wie schnell ist er nach 2 Sekunden?',
    [r'19,6 m/s', r'9,8 m/s', r'19,6 m', r'4,9 m/s'],
    [r'Geschwindigkeit ist die Ableitung des Weges: $v(t) = s^{\prime}(t) = 9{,}8t$.',
     r'$v(2) = 19{,}6$ m/s'])

Q.q(r'Welche Aussage beschreibt die Faktorregel?',
    [r'$(c \cdot f)^{\prime} = c \cdot f^{\prime}$', r'$(c \cdot f)^{\prime} = 0$', r'$(c \cdot f)^{\prime} = c^{\prime} \cdot f^{\prime}$', r'$(c + f)^{\prime} = c + f^{\prime}$'],
    [r'Ein konstanter Faktor streckt den Graphen in $y$-Richtung.',
     r'Dabei werden alle Anstiege mit demselben Faktor gestreckt.'])

Q.q(r'Bestimme die Ableitung von $f(x) = \dfrac{1}{\sqrt{x}}$.',
    [r'$f^{\prime}(x) = -\dfrac{1}{2} x^{-\frac{3}{2}}$', r'$f^{\prime}(x) = \dfrac{1}{2} x^{-\frac{1}{2}}$', r'$f^{\prime}(x) = -\dfrac{1}{2} x^{-\frac{1}{2}}$', r'$f^{\prime}(x) = -2x^{\frac{1}{2}}$'],
    [r'$\dfrac{1}{\sqrt{x}} = x^{-\frac{1}{2}}$',
     r'$-\dfrac{1}{2} x^{-\frac{1}{2} - 1} = -\dfrac{1}{2} x^{-\frac{3}{2}}$'])

# ----------------------------------------------------------- reversing ----
Q.q(r'Welche Funktion hat die Ableitung $3x^2$?',
    [r'$F(x) = x^3 + 5$', r'$F(x) = 6x$', r'$F(x) = 3x^3$', r'$F(x) = x^2$'],
    [r'Rückwärts denken: Welche Potenz liefert abgeleitet $3x^2$?',
     r'$(x^3)^{\prime} = 3x^2$, und eine Konstante wie 5 stört nicht.'])

Q.q(r'Welche Funktion hat die Ableitung $x$?',
    [r'$F(x) = \dfrac{1}{2} x^2$', r'$F(x) = x^2$', r'$F(x) = 1$', r'$F(x) = 2x^2$'],
    [r'$(x^2)^{\prime} = 2x$ ist doppelt so groß wie gewünscht.',
     r'Also halbieren: $\left(\dfrac{1}{2} x^2\right)^{\prime} = x$.'])

Q.q(r'Die Geschwindigkeit eines Fahrzeugs ist $v(t) = 2t$ (in m/s). Welche Wegfunktion passt dazu, wenn es bei $t = 0$ startet?',
    [r'$s(t) = t^2$', r'$s(t) = 2$', r'$s(t) = 2t^2$', r'$s(t) = 4t$'],
    [r'Gesucht ist $s$ mit $s^{\prime}(t) = 2t$.',
     r'$(t^2)^{\prime} = 2t$ und $s(0) = 0$. In der Physik heißt das: gleichmäßig beschleunigt.'])


def check():
    import sympy as sp
    x, t = sp.symbols('x t', positive=True)
    d = lambda e, n=1: sp.diff(e, x, n)
    eq = lambda a, b: sp.simplify(a - b) == 0
    assert eq(d(x ** 7), 7 * x ** 6) and eq(d(5 * x ** 4), 20 * x ** 3)
    assert eq(d(2 * x ** 3 - 4 * x ** 2 + x - 9), 6 * x ** 2 - 8 * x + 1)
    assert eq(d(x ** 3 + x ** 2), 3 * x ** 2 + 2 * x) and eq(d(x ** 2 * (x + 1)), 3 * x ** 2 + 2 * x)
    assert eq(d(sp.sqrt(x)), 1 / (2 * sp.sqrt(x))) and d(sp.sqrt(x)).subs(x, 4) == sp.Rational(1, 4)
    assert eq(d(1 / x ** 2), -2 / x ** 3) and eq(d(3 / x), -3 / x ** 2)
    assert eq(d(x ** sp.Rational(2, 3)), sp.Rational(2, 3) * x ** sp.Rational(-1, 3))
    assert eq(d((x ** 2 + 4) / x), 1 - 4 / x ** 2)
    assert eq(d(x ** 4, 2), 12 * x ** 2)
    assert (x ** 3).subs(x, 2) == 8 and d(x ** 3).subs(x, 2) == 12 and sp.expand(12 * (x - 2) + 8) == 12 * x - 16
    y = sp.symbols('y')
    assert sorted(sp.solve(sp.diff(y ** 3 - 3 * y, y), y)) == [-1, 1]
    assert sp.diff(sp.Rational(49, 10) * t ** 2, t).subs(t, 2) == sp.Rational(196, 10)
    assert eq(d(1 / sp.sqrt(x)), -sp.Rational(1, 2) * x ** sp.Rational(-3, 2))
    assert d(x ** 3 + 5) == 3 * x ** 2 and d(x ** 2 / 2) == x
    assert sp.diff(t ** 2, t) == 2 * t


Q.verify(check)
Q.save()
