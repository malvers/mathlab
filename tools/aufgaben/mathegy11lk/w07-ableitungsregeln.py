#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 7 / KW 40 (LB 1): power, factor and sum rule with the steps of their proofs,
rational exponents, reversing differentiation - 16 questions of the Grundkurs sheet, 4 on proofs.
Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=7, slug='ableitungsregeln', thema='Ableitungsregeln und ihre Beweise', lb='LB 1',
           blurb='Potenz-, Faktor- und Summenregel, Beweisschritte, rationale Exponenten, Umkehrung',
           comment='Questions 1-16 from the Grundkurs sheet (mathegy11/w06), 17-20 proofs of the rules.')

qs, check_gk = harvest('w06-ableitungsregeln.py', [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 19])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------------------------ proofs ----
Q.q(r'Beweis der Summenregel: Der Differenzenquotient von $u + v$ zerfällt in $\dfrac{u(x + h) - u(x)}{h} + \dfrac{v(x + h) - v(x)}{h}$. Was braucht man für den letzten Schritt $h \to 0$?',
    [r'den Grenzwertsatz für Summen', r'die Kettenregel', r'den Grenzwertsatz für Quotienten', r'die Stetigkeit von $u \cdot v$'],
    [r'Beide Differenzenquotienten haben Grenzwerte $u^{\prime}(x)$ und $v^{\prime}(x)$.',
     r'Der Grenzwert der Summe ist die Summe der Grenzwerte.'])

Q.q(r'Beweis der Potenzregel für $n = 3$: Welcher Differenzenquotient entsteht aus $(x + h)^3 = x^3 + 3x^2 h + 3x h^2 + h^3$?',
    [r'$3x^2 + 3xh + h^2$', r'$3x^2$', r'$x^3 + 3x^2 + 3x + 1$', r'$3x^2 h + 3x h^2 + h^3$'],
    [r'$\dfrac{(x + h)^3 - x^3}{h} = \dfrac{3x^2 h + 3xh^2 + h^3}{h}$',
     r'Durch $h$ geteilt: $3x^2 + 3xh + h^2$, für $h \to 0$ bleibt $3x^2$.'])

Q.q(r'Allgemein ist $(x + h)^n = x^n + n x^{n-1} h + \ldots$, wobei jeder weitere Summand mindestens den Faktor $h^2$ enthält. Warum folgt daraus $(x^n)^{\prime} = n x^{n-1}$?',
    [r'Nach Teilen durch $h$ enthalten alle anderen Summanden noch $h$ und verschwinden für $h \to 0$.', r'Weil $x^n$ immer positiv ist.',
     r'Weil $h^2 = 0$ ist.', r'Weil $n$ eine natürliche Zahl ist und sonst nichts gilt.'],
    [r'Differenzenquotient: $n x^{n-1} + h \cdot (\ldots)$.',
     r'Der Klammerausdruck bleibt beschränkt, $h \cdot (\ldots) \to 0$.'])

Q.q(r'Beweis der Faktorregel: Der Differenzenquotient von $c \cdot f$ ist $c \cdot \dfrac{f(x + h) - f(x)}{h}$. Was ist der Grenzwert für $h \to 0$?',
    [r'$c \cdot f^{\prime}(x)$', r'$c^{\prime} \cdot f^{\prime}(x)$', r'$c + f^{\prime}(x)$', r'0, weil $c$ konstant ist'],
    [r'Ein konstanter Faktor darf vor den Grenzwert gezogen werden.',
     r'Also $(c \cdot f)^{\prime} = c \cdot f^{\prime}$.'])


def check():
    import sympy as sp
    x, h = sp.symbols('x h')
    check_gk()
    assert sp.expand(((x + h) ** 3 - x ** 3) / h) == 3 * x ** 2 + 3 * x * h + h ** 2
    n = 7
    poly = sp.expand((x + h) ** n)
    assert sp.expand(poly - x ** n - n * x ** (n - 1) * h).as_poly(h).degree() == n and sp.limit((poly - x ** n) / h, h, 0) == n * x ** (n - 1)
    c = sp.symbols('c')
    f = sp.Function('f')
    assert sp.limit(c * (x ** 2 + 2 * x * h + h ** 2 - x ** 2) / h, h, 0) == c * 2 * x


Q.verify(check)
Q.save()
