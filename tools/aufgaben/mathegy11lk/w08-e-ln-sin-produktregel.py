#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 8 / KW 41 (LB 1): derivatives of e^x, ln x, sin x, cos x and the product rule
with its proof - 16 questions of the Grundkurs sheet, 4 harder ones. Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=8, slug='e-ln-sin-produktregel', thema='Ableitung von e-, ln- und Sinusfunktion; Produktregel', lb='LB 1',
           blurb='Ableitungen von eˣ, ln x, sin x, cos x, Produktregel und ihr Beweis',
           comment='Questions 1-16 from the Grundkurs sheet (mathegy11/w07), 17-20 Leistungskurs.')

qs, check_gk = harvest('w07-e-ln-sin-produktregel.py', [0, 1, 2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15, 18, 19])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------------------ Leistungskurs ----
Q.q(r'Beim Beweis der Produktregel schreibt man $u(x + h)v(x + h) - u(x)v(x)$ geschickt um. Welcher Trick hilft?',
    [r'$u(x + h)v(x)$ abziehen und wieder addieren', r'durch $u(x)$ teilen', r'beide Faktoren getrennt ableiten', r'$h = 0$ einsetzen'],
    [r'$u(x + h)\bigl[v(x + h) - v(x)\bigr] + v(x)\bigl[u(x + h) - u(x)\bigr]$',
     r'Durch $h$ teilen und $h \to 0$: $u(x)v^{\prime}(x) + v(x)u^{\prime}(x)$; dabei braucht man, dass $u$ stetig ist.'])

Q.q(r'Wie folgt $(\ln x)^{\prime} = \dfrac{1}{x}$ aus $(e^y)^{\prime} = e^y$?',
    [r'$y = \ln x$ heißt $x = e^y$; die Anstiege von Funktion und Umkehrfunktion sind Kehrwerte: $\dfrac{1}{e^y} = \dfrac{1}{x}$.',
     r'Durch Einsetzen von $x = 1$.', r'Weil $\ln x$ und $e^x$ dieselbe Ableitung haben.', r'Aus der Potenzregel mit $n = -1$.'],
    [r'Der Graph von $\ln$ ist der an $y = x$ gespiegelte Graph von $e^x$.',
     r'Beim Spiegeln werden aus Anstiegen $m$ die Anstiege $\tfrac{1}{m}$.'])

Q.q(r'Wie groß ist der Anstieg von $f(x) = 10^x$ an der Stelle 0?',
    [r'$\ln 10 \approx 2{,}303$', r'1', r'10', r'0'],
    [r'$(a^x)^{\prime} = \ln a \cdot a^x$ (Woche 6).',
     r'$f^{\prime}(0) = \ln 10 \cdot 1 \approx 2{,}303$.'])

Q.q(r'Wo hat $f(x) = e^x \sin x$ im Intervall $(0;\,\pi)$ eine waagerechte Tangente?',
    [r'bei $x = \dfrac{3\pi}{4}$', r'bei $x = \dfrac{\pi}{4}$', r'bei $x = \dfrac{\pi}{2}$', r'nirgends'],
    [r'$f^{\prime}(x) = e^x \sin x + e^x \cos x = e^x(\sin x + \cos x)$.',
     r'$\sin x + \cos x = 0 \Leftrightarrow \tan x = -1$, in $(0;\,\pi)$ also $x = \tfrac{3\pi}{4}$.'])


def check():
    import math
    import sympy as sp
    x, h = sp.symbols('x h', real=True)
    check_gk()
    u, v = sp.Function('u'), sp.Function('v')
    lhs = u(x + h) * v(x + h) - u(x) * v(x)
    rhs = u(x + h) * (v(x + h) - v(x)) + v(x) * (u(x + h) - u(x))
    assert sp.expand(lhs - rhs) == 0
    y = sp.symbols('y')
    assert sp.diff(sp.log(x), x) == 1 / x and sp.diff(sp.exp(y), y) == sp.exp(y)
    assert abs(math.log(10) - 2.303) < 1e-3 and sp.diff(10 ** x, x).subs(x, 0) == sp.log(10)
    f = sp.exp(x) * sp.sin(x)
    df = sp.diff(f, x)
    assert sp.simplify(df.subs(x, 3 * sp.pi / 4)) == 0 and sp.tan(3 * sp.pi / 4) == -1
    assert df.subs(x, 2).evalf() > 0 > df.subs(x, 2.5).evalf() and df.subs(x, 0.5).evalf() > 0   # the only zero in (0; pi)


Q.verify(check)
Q.save()
