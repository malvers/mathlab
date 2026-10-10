#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 16 / KW 51 (LB 1): optimisation problems - 15 questions of the Grundkurs sheet,
5 harder ones (can with minimal surface, rectangle under e^-x, shortest distance to a parabola, triangle under a
parabola). Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=16, slug='extremwertprobleme', thema='Extremwertprobleme', lb='LB 1',
           blurb='Zielfunktion, Nebenbedingung, Definitionsbereich, Randwerte, Deutung im Sachzusammenhang',
           comment='Questions 1-15 from the Grundkurs sheet (mathegy11/w16), 16-20 Leistungskurs.')

qs, check_gk = harvest('w16-extremwertprobleme.py', [0, 1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 13, 15, 16, 19])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------------------ Leistungskurs ----
Q.q(r'Eine zylinderförmige Dose soll 1 Liter fassen und möglichst wenig Blech brauchen. Welche Maße ergeben sich?',
    [r'$r \approx 5{,}42$ cm, $h \approx 10{,}8$ cm (Höhe gleich Durchmesser)', r'$r \approx 6{,}83$ cm, $h \approx 6{,}83$ cm',
     r'$r = 10$ cm, $h \approx 3{,}2$ cm', r'$r \approx 3{,}99$ cm, $h \approx 20$ cm'],
    [r'Nebenbedingung $\pi r^2 h = 1000$, also $h = \dfrac{1000}{\pi r^2}$.',
     r'Zielfunktion $O(r) = 2\pi r^2 + \dfrac{2000}{r}$, $O^{\prime}(r) = 4\pi r - \dfrac{2000}{r^2} = 0$.',
     r'$r^3 = \dfrac{500}{\pi}$, $r \approx 5{,}42$ cm und $h = 2r$.'])

Q.q(r'Ein Rechteck hat eine Ecke im Ursprung und die gegenüberliegende Ecke $(u \mid e^{-u})$ auf dem Graphen von $f(x) = e^{-x}$, $u > 0$. Wie groß wird es höchstens?',
    [r'$\dfrac{1}{e} \approx 0{,}37$ für $u = 1$', r'1 für $u = 0$', r'$\dfrac{2}{e^2} \approx 0{,}27$ für $u = 2$', r'Es wird beliebig groß.'],
    [r'$A(u) = u\,e^{-u}$, $A^{\prime}(u) = (1 - u)\,e^{-u} = 0 \Leftrightarrow u = 1$.',
     r'Vorzeichenwechsel von $+$ nach $-$; für $u \to 0$ und $u \to \infty$ geht $A$ gegen 0.'])

Q.q(r'Welche Punkte der Parabel $y = x^2$ liegen dem Punkt $P(0 \mid 2)$ am nächsten?',
    [r'$(\pm\sqrt{1{,}5} \mid 1{,}5)$, Abstand $\tfrac{\sqrt{7}}{2} \approx 1{,}32$', r'der Scheitel $(0 \mid 0)$, Abstand 2',
     r'$(\pm 1 \mid 1)$, Abstand $\sqrt{2}$', r'$(\pm\sqrt{2} \mid 2)$, Abstand $\sqrt{2}$'],
    [r'$d(x)^2 = x^2 + (x^2 - 2)^2 = x^4 - 3x^2 + 4$.',
     r'$(d^2)^{\prime} = 4x^3 - 6x = 0$: $x = 0$ (lokales Maximum, $d = 2$) oder $x^2 = 1{,}5$.',
     r'$d^2 = 2{,}25 - 4{,}5 + 4 = 1{,}75$, also $d = \tfrac{\sqrt{7}}{2}$.'])

Q.q(r'Warum darf man beim Abstand statt $d(x)$ die Funktion $d(x)^2$ minimieren?',
    [r'Die Wurzel ist streng monoton steigend; $d$ und $d^2$ sind an derselben Stelle minimal.', r'Weil $d^2 = d$ ist.',
     r'Weil Abstände immer ganzzahlig sind.', r'Das darf man nicht, es ergibt eine andere Stelle.'],
    [r'Für $d \geq 0$ gilt: $d_1 < d_2 \Leftrightarrow d_1^2 < d_2^2$.',
     r'Ohne Wurzel wird das Ableiten viel einfacher.'])

Q.q(r'Der Punkt $P(u \mid 4 - u^2)$ mit $0 < u < 2$ bildet mit $O(0 \mid 0)$ und $(u \mid 0)$ ein rechtwinkliges Dreieck. Für welches $u$ ist es am größten?',
    [r'$u = \tfrac{2}{\sqrt{3}} \approx 1{,}15$', r'$u = 1$', r'$u = \sqrt{2} \approx 1{,}41$', r'$u = 2$'],
    [r'$A(u) = \tfrac{1}{2}\,u\,(4 - u^2) = 2u - \tfrac{1}{2}u^3$.',
     r'$A^{\prime}(u) = 2 - \tfrac{3}{2}u^2 = 0 \Leftrightarrow u^2 = \tfrac{4}{3}$.',
     r'$A_{\max} = \dfrac{8}{3\sqrt{3}} \approx 1{,}54$; an den Rändern ist $A = 0$.'])


def check():
    import math
    import sympy as sp
    x, r, u = sp.symbols('x r u', positive=True)
    check_gk()
    O = 2 * sp.pi * r ** 2 + 2000 / r
    rs = sp.solve(sp.diff(O, r), r)
    assert len(rs) == 1 and abs(float(rs[0]) - 5.42) < 0.005
    h = 1000 / (sp.pi * rs[0] ** 2)
    assert sp.simplify(h - 2 * rs[0]) == 0 and abs(float(h) - 10.8) < 0.05
    assert abs(math.pi * 6.83 ** 3 - 1000) < 5 and O.subs(r, 6.83) > O.subs(r, rs[0])   # distractor r = h holds 1 l but needs more sheet
    A = u * sp.exp(-u)
    assert sp.solve(sp.diff(A, u), u) == [1] and abs(float(sp.exp(-1)) - 0.37) < 0.005
    y = sp.symbols('y', real=True)
    d2 = y ** 2 + (y ** 2 - 2) ** 2
    assert sp.expand(d2) == y ** 4 - 3 * y ** 2 + 4
    crit = sp.solve(sp.diff(d2, y), y)
    assert set(crit) == {0, sp.sqrt(sp.Rational(3, 2)), -sp.sqrt(sp.Rational(3, 2))}
    assert d2.subs(y, sp.sqrt(sp.Rational(3, 2))) == sp.Rational(7, 4) and abs(math.sqrt(7) / 2 - 1.32) < 0.005
    assert d2.subs(y, 1) == 2 and d2.subs(y, 0) == 4                                  # distractors are farther away
    T = u * (4 - u ** 2) / 2
    us = sp.solve(sp.diff(T, u), u)
    assert us == [2 / sp.sqrt(3)] and abs(float(us[0]) - 1.15) < 0.005
    assert sp.simplify(T.subs(u, us[0]) - 8 / (3 * sp.sqrt(3))) == 0 and abs(float(T.subs(u, us[0])) - 1.54) < 0.005


Q.verify(check)
Q.save()
