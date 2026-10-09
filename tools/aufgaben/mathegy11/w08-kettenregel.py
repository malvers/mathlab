#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 8 / KW 41 (LB 1): chain rule - simple compositions and
combinations, Lehrplan examples, applications. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=8, slug='kettenregel', thema='Die Kettenregel', lb='LB 1',
         blurb='Innere und äußere Funktion, einfache Verkettungen und Verknüpfungen',
         comment='Blocks: inner and outer function (1-3), chain rule (4-12), chain and product rule (13-15), slopes and context (16-20).')

# ----------------------------------------------- inner and outer function ----
Q.q(r'Was ist bei $f(x) = (x^2 - 3)^5$ die innere Funktion?',
    [r'$v(x) = x^2 - 3$', r'$u(z) = z^5$', r'$v(x) = x^2$', r'$v(x) = 5$'],
    [r'Man rechnet zuerst $x^2 - 3$ aus und potenziert das Ergebnis.',
     r'Innen: $v(x) = x^2 - 3$, außen: $u(z) = z^5$.'])

Q.q(r'Wie lautet die Kettenregel für $f(x) = u\bigl(v(x)\bigr)$?',
    [r'$f^{\prime}(x) = u^{\prime}\bigl(v(x)\bigr) \cdot v^{\prime}(x)$', r'$f^{\prime}(x) = u^{\prime}(x) \cdot v^{\prime}(x)$',
     r'$f^{\prime}(x) = u^{\prime}\bigl(v^{\prime}(x)\bigr)$', r'$f^{\prime}(x) = u\bigl(v^{\prime}(x)\bigr)$'],
    [r'Äußere Ableitung, an der inneren Funktion ausgewertet,',
     r'mal innere Ableitung („Nachdifferenzieren“).'])

Q.q(r'Ein Mitschüler rechnet $\bigl(\sin(3x)\bigr)^{\prime} = \cos(3x)$. Was fehlt?',
    [r'Der Faktor 3 aus der inneren Ableitung.', r'Nichts, das ist richtig.', r'Ein Minuszeichen.', r'Der Faktor $x$.'],
    [r'Die innere Funktion ist $3x$ mit Ableitung 3.',
     r'Richtig: $\bigl(\sin(3x)\bigr)^{\prime} = 3\cos(3x)$.'])

# ------------------------------------------------------------ chain rule ----
Q.q(r'Bestimme die Ableitung von $f(x) = e^{2x}$.',
    [r'$f^{\prime}(x) = 2e^{2x}$', r'$f^{\prime}(x) = e^{2x}$', r'$f^{\prime}(x) = 2x e^{2x-1}$', r'$f^{\prime}(x) = e^2$'],
    [r'Außen $e^z$ mit Ableitung $e^z$, innen $2x$ mit Ableitung 2.',
     r'$f^{\prime}(x) = e^{2x} \cdot 2$'])

Q.q(r'Bestimme die Ableitung von $f(x) = (3x + 1)^4$.',
    [r'$f^{\prime}(x) = 12(3x + 1)^3$', r'$f^{\prime}(x) = 4(3x + 1)^3$', r'$f^{\prime}(x) = 12(3x + 1)^4$', r'$f^{\prime}(x) = (3x + 1)^3$'],
    [r'Außen: $4z^3$, innen: Ableitung 3.',
     r'$4(3x + 1)^3 \cdot 3 = 12(3x + 1)^3$'])

Q.q(r'Bestimme die Ableitung von $f(x) = \sin(2x + 1)$.',
    [r'$f^{\prime}(x) = 2\cos(2x + 1)$', r'$f^{\prime}(x) = \cos(2x + 1)$', r'$f^{\prime}(x) = \cos 2$', r'$f^{\prime}(x) = -2\cos(2x + 1)$'],
    [r'Außen $\sin z \mapsto \cos z$, innen $2x + 1 \mapsto 2$.',
     r'$\cos(2x + 1) \cdot 2$'])

Q.q(r'Bestimme die Ableitung von $f(x) = \ln(3x - 5)$.',
    [r'$f^{\prime}(x) = \dfrac{3}{3x - 5}$', r'$f^{\prime}(x) = \dfrac{1}{3x - 5}$', r'$f^{\prime}(x) = \dfrac{3}{x}$', r'$f^{\prime}(x) = 3\ln(3x - 5)$'],
    [r'Außen $\ln z \mapsto \dfrac{1}{z}$, innen $3x - 5 \mapsto 3$.',
     r'$\dfrac{1}{3x - 5} \cdot 3$'])

Q.q(r'Bestimme die Ableitung von $f(x) = e^{x^2}$.',
    [r'$f^{\prime}(x) = 2x e^{x^2}$', r'$f^{\prime}(x) = e^{x^2}$', r'$f^{\prime}(x) = x^2 e^{x^2 - 1}$', r'$f^{\prime}(x) = e^{2x}$'],
    [r'Innen $x^2$ mit Ableitung $2x$.',
     r'$e^{x^2} \cdot 2x$'])

Q.q(r'Bestimme die Ableitung von $f(x) = \dfrac{1}{2x + 1}$.',
    [r'$f^{\prime}(x) = -\dfrac{2}{(2x + 1)^2}$', r'$f^{\prime}(x) = -\dfrac{1}{(2x + 1)^2}$', r'$f^{\prime}(x) = \dfrac{2}{(2x + 1)^2}$', r'$f^{\prime}(x) = \dfrac{1}{2}$'],
    [r'$f(x) = (2x + 1)^{-1}$',
     r'$-1 \cdot (2x + 1)^{-2} \cdot 2 = -\dfrac{2}{(2x + 1)^2}$'])

Q.q(r'Bestimme die Ableitung von $f(x) = e^{-0{,}5x}$.',
    [r'$f^{\prime}(x) = -0{,}5\,e^{-0{,}5x}$', r'$f^{\prime}(x) = e^{-0{,}5x}$', r'$f^{\prime}(x) = 0{,}5\,e^{-0{,}5x}$', r'$f^{\prime}(x) = -0{,}5x\,e^{-0{,}5x}$'],
    [r'Innere Ableitung: −0,5.',
     r'$f^{\prime}(x) = -0{,}5\,e^{-0{,}5x}$; negativ, die Funktion fällt.'])

Q.q(r'Bestimme die Ableitung von $f(x) = \cos(x^2)$.',
    [r'$f^{\prime}(x) = -2x\sin(x^2)$', r'$f^{\prime}(x) = -\sin(x^2)$', r'$f^{\prime}(x) = 2x\sin(x^2)$', r'$f^{\prime}(x) = -\sin(2x)$'],
    [r'Außen $\cos z \mapsto -\sin z$, innen $x^2 \mapsto 2x$.',
     r'$-\sin(x^2) \cdot 2x$'])

Q.q(r'Bestimme die Ableitung von $f(x) = \sqrt{4x + 1}$.',
    [r'$f^{\prime}(x) = \dfrac{2}{\sqrt{4x + 1}}$', r'$f^{\prime}(x) = \dfrac{1}{2\sqrt{4x + 1}}$', r'$f^{\prime}(x) = \dfrac{4}{\sqrt{4x + 1}}$', r'$f^{\prime}(x) = 2\sqrt{4x + 1}$'],
    [r'Außen $\sqrt{z} \mapsto \dfrac{1}{2\sqrt{z}}$, innen $4x + 1 \mapsto 4$.',
     r'$\dfrac{4}{2\sqrt{4x + 1}} = \dfrac{2}{\sqrt{4x + 1}}$'])

# --------------------------------------------------- chain and product rule ----
Q.q(r'Bestimme die Ableitung von $f(x) = 3x^2 \cdot e^{2x - 1}$ (Beispiel aus dem Lehrplan).',
    [r'$f^{\prime}(x) = (6x + 6x^2)\,e^{2x - 1}$', r'$f^{\prime}(x) = 6x\,e^{2x - 1}$', r'$f^{\prime}(x) = 12x\,e^{2x - 1}$', r'$f^{\prime}(x) = (6x + 3x^2)\,e^{2x - 1}$'],
    [r'Produktregel mit $u = 3x^2$, $u^{\prime} = 6x$ und $v = e^{2x - 1}$, $v^{\prime} = 2e^{2x - 1}$ (Kettenregel).',
     r'$6x\,e^{2x - 1} + 3x^2 \cdot 2e^{2x - 1} = (6x + 6x^2)\,e^{2x - 1}$'])

Q.q(r'Bestimme die Ableitung von $f(x) = x^2 \sin(2x)$.',
    [r'$f^{\prime}(x) = 2x\sin(2x) + 2x^2\cos(2x)$', r'$f^{\prime}(x) = 2x\sin(2x) + x^2\cos(2x)$', r'$f^{\prime}(x) = 4x\cos(2x)$', r'$f^{\prime}(x) = 2x\cos(2x)$'],
    [r'$u = x^2$, $u^{\prime} = 2x$; $v = \sin(2x)$, $v^{\prime} = 2\cos(2x)$.',
     r'$2x\sin(2x) + x^2 \cdot 2\cos(2x)$'])

Q.q(r'Bestimme die Ableitung von $f(x) = (x^2 + 1)^2$ und prüfe durch Ausmultiplizieren.',
    [r'$f^{\prime}(x) = 4x(x^2 + 1)$', r'$f^{\prime}(x) = 2(x^2 + 1)$', r'$f^{\prime}(x) = 4x^3$', r'$f^{\prime}(x) = 2x(x^2 + 1)$'],
    [r'Kettenregel: $2(x^2 + 1) \cdot 2x = 4x(x^2 + 1)$.',
     r'Probe: $f(x) = x^4 + 2x^2 + 1$, also $f^{\prime}(x) = 4x^3 + 4x = 4x(x^2 + 1)$.'])

# ------------------------------------------------------ slopes and context ----
Q.q(r'Wie groß ist der Anstieg von $f(x) = (2x - 1)^3$ an der Stelle $x = 1$?',
    [r'6', r'3', r'2', r'1'],
    [r'$f^{\prime}(x) = 3(2x - 1)^2 \cdot 2 = 6(2x - 1)^2$',
     r'$f^{\prime}(1) = 6 \cdot 1^2 = 6$'])

Q.q(r'Wie lautet die Tangente an $f(x) = e^{2x}$ an der Stelle 0?',
    [r'$y = 2x + 1$', r'$y = x + 1$', r'$y = 2x$', r'$y = 2x + 2$'],
    [r'$f(0) = 1$, $f^{\prime}(x) = 2e^{2x}$, $f^{\prime}(0) = 2$',
     r'$y = 2x + 1$'])

Q.q(r'Bestimme die Ableitung von $f(x) = \ln(x^2 + 1)$.',
    [r'$f^{\prime}(x) = \dfrac{2x}{x^2 + 1}$', r'$f^{\prime}(x) = \dfrac{1}{x^2 + 1}$', r'$f^{\prime}(x) = \dfrac{1}{2x}$', r'$f^{\prime}(x) = 2x\ln(x^2 + 1)$'],
    [r'Außen $\ln z \mapsto \dfrac{1}{z}$, innen $x^2 + 1 \mapsto 2x$.',
     r'$\dfrac{2x}{x^2 + 1}$'])

Q.q(r'Ein Wirkstoff wird nach $A(t) = 100\,e^{-0{,}2t}$ abgebaut ($A$ in mg, $t$ in h). Wie schnell ändert sich die Menge zu Beginn?',
    [r'Sie nimmt um 20 mg pro Stunde ab.', r'Sie nimmt um 100 mg pro Stunde ab.', r'Sie nimmt um 0,2 mg pro Stunde ab.', r'Sie nimmt um 20 mg pro Stunde zu.'],
    [r'$A^{\prime}(t) = 100 \cdot (-0{,}2)\,e^{-0{,}2t} = -20\,e^{-0{,}2t}$',
     r'$A^{\prime}(0) = -20$: Abnahme um 20 mg pro Stunde.'])

Q.q(r'An welcher Stelle hat $f(x) = e^{3x}$ den Anstieg 3?',
    [r'$x = 0$', r'$x = 1$', r'$x = \ln 3$', r'$x = 3$'],
    [r'$f^{\prime}(x) = 3e^{3x} = 3$',
     r'$e^{3x} = 1$, also $3x = 0$.'])


def check():
    import sympy as sp
    x = sp.symbols('x', real=True)
    d = lambda e: sp.diff(e, x)
    eq = lambda a, b: sp.simplify(a - b) == 0
    assert eq(d(sp.sin(3 * x)), 3 * sp.cos(3 * x))
    assert eq(d(sp.exp(2 * x)), 2 * sp.exp(2 * x))
    assert eq(d((3 * x + 1) ** 4), 12 * (3 * x + 1) ** 3)
    assert eq(d(sp.sin(2 * x + 1)), 2 * sp.cos(2 * x + 1))
    assert eq(d(sp.log(3 * x - 5)), 3 / (3 * x - 5))
    assert eq(d(sp.exp(x ** 2)), 2 * x * sp.exp(x ** 2))
    assert eq(d(1 / (2 * x + 1)), -2 / (2 * x + 1) ** 2)
    assert eq(d(sp.exp(-x / 2)), -sp.exp(-x / 2) / 2)
    assert eq(d(sp.cos(x ** 2)), -2 * x * sp.sin(x ** 2))
    assert eq(d(sp.sqrt(4 * x + 1)), 2 / sp.sqrt(4 * x + 1))
    assert eq(d(3 * x ** 2 * sp.exp(2 * x - 1)), (6 * x + 6 * x ** 2) * sp.exp(2 * x - 1))
    assert eq(d(x ** 2 * sp.sin(2 * x)), 2 * x * sp.sin(2 * x) + 2 * x ** 2 * sp.cos(2 * x))
    assert eq(d((x ** 2 + 1) ** 2), 4 * x * (x ** 2 + 1)) and eq(d(sp.expand((x ** 2 + 1) ** 2)), 4 * x ** 3 + 4 * x)
    assert d((2 * x - 1) ** 3).subs(x, 1) == 6
    assert d(sp.exp(2 * x)).subs(x, 0) == 2 and sp.exp(0) == 1
    assert eq(d(sp.log(x ** 2 + 1)), 2 * x / (x ** 2 + 1))
    assert eq(d(100 * sp.exp(-x / 5)), -20 * sp.exp(-x / 5)) and d(100 * sp.exp(-x / 5)).subs(x, 0) == -20
    assert sp.solve(sp.Eq(d(sp.exp(3 * x)), 3), x) == [0]


Q.verify(check)
Q.save()
