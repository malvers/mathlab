#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 7 / KW 40 (LB 1): derivatives of e^x, ln x, sin x, cos x
and the product rule. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=7, slug='e-ln-sin-produktregel', thema='Ableitung von e-, ln- und Sinusfunktion; Produktregel', lb='LB 1',
         blurb='Ableitungen von e^x, ln x, sin x, cos x und die Produktregel',
         comment='Blocks: basic derivatives (1-5), product rule (6-11), slopes and tangents (12-17), traps and CAS (18-20).')

# ------------------------------------------------------- basic derivatives ----
Q.q(r'Bestimme die Ableitung von $f(x) = e^x$.',
    [r'$f^{\prime}(x) = e^x$', r'$f^{\prime}(x) = x \cdot e^{x-1}$', r'$f^{\prime}(x) = e$', r'$f^{\prime}(x) = \ln x$'],
    [r'Die natürliche Exponentialfunktion stimmt mit ihrer Ableitung überein.',
     r'Die Potenzregel gilt hier nicht: $x$ steht im Exponenten, nicht in der Basis.'])

Q.q(r'Bestimme die Ableitung von $f(x) = \ln x$ für $x > 0$.',
    [r'$f^{\prime}(x) = \dfrac{1}{x}$', r'$f^{\prime}(x) = e^x$', r'$f^{\prime}(x) = \ln x$', r'$f^{\prime}(x) = -\dfrac{1}{x^2}$'],
    [r'$(\ln x)^{\prime} = \dfrac{1}{x}$',
     r'Die Ableitung ist positiv: $\ln x$ steigt, aber immer langsamer.'])

Q.q(r'Bestimme die Ableitung von $f(x) = \sin x$.',
    [r'$f^{\prime}(x) = \cos x$', r'$f^{\prime}(x) = -\cos x$', r'$f^{\prime}(x) = -\sin x$', r'$f^{\prime}(x) = \sin x$'],
    [r'Im Bogenmaß gilt $(\sin x)^{\prime} = \cos x$.',
     r'Probe: Bei $x = 0$ steigt die Sinuskurve mit Anstieg 1, und $\cos 0 = 1$.'])

Q.q(r'Bestimme die Ableitung von $f(x) = \cos x$.',
    [r'$f^{\prime}(x) = -\sin x$', r'$f^{\prime}(x) = \sin x$', r'$f^{\prime}(x) = -\cos x$', r'$f^{\prime}(x) = \cos x$'],
    [r'$(\cos x)^{\prime} = -\sin x$',
     r'Probe: Kurz nach $x = 0$ fällt die Kosinuskurve, und $-\sin x$ ist dort negativ.'])

Q.q(r'Bestimme die Ableitung von $f(x) = 3e^x - 2\ln x$.',
    [r'$f^{\prime}(x) = 3e^x - \dfrac{2}{x}$', r'$f^{\prime}(x) = 3e^x - 2x$', r'$f^{\prime}(x) = 3xe^{x-1} - \dfrac{2}{x}$', r'$f^{\prime}(x) = e^x - \dfrac{1}{x}$'],
    [r'Faktor- und Summenregel.',
     r'$3 \cdot e^x - 2 \cdot \dfrac{1}{x}$'])

# ------------------------------------------------------------ product rule ----
Q.q(r'Wie lautet die Produktregel für $f(x) = u(x) \cdot v(x)$?',
    [r'$f^{\prime} = u^{\prime} v + u v^{\prime}$', r'$f^{\prime} = u^{\prime} \cdot v^{\prime}$', r'$f^{\prime} = u^{\prime} v - u v^{\prime}$', r'$f^{\prime} = u v^{\prime}$'],
    [r'Jeder Faktor wird einmal abgeleitet, der andere bleibt stehen.',
     r'Die beiden Produkte werden addiert.'])

Q.q(r'Bestimme die Ableitung von $f(x) = x \cdot e^x$.',
    [r'$f^{\prime}(x) = (1 + x)e^x$', r'$f^{\prime}(x) = e^x$', r'$f^{\prime}(x) = x e^x$', r'$f^{\prime}(x) = 1 \cdot e^x \cdot x$'],
    [r'$u = x$, $u^{\prime} = 1$; $v = e^x$, $v^{\prime} = e^x$.',
     r'$f^{\prime}(x) = 1 \cdot e^x + x \cdot e^x = (1 + x)e^x$'])

Q.q(r'Bestimme die Ableitung von $f(x) = x^2 \sin x$.',
    [r'$f^{\prime}(x) = 2x\sin x + x^2\cos x$', r'$f^{\prime}(x) = 2x\cos x$', r'$f^{\prime}(x) = 2x\sin x - x^2\cos x$', r'$f^{\prime}(x) = x^2\cos x$'],
    [r'$u = x^2$, $u^{\prime} = 2x$; $v = \sin x$, $v^{\prime} = \cos x$.',
     r'$u^{\prime} v + u v^{\prime} = 2x\sin x + x^2 \cos x$'])

Q.q(r'Bestimme die Ableitung von $f(x) = x \ln x$.',
    [r'$f^{\prime}(x) = \ln x + 1$', r'$f^{\prime}(x) = \dfrac{1}{x}$', r'$f^{\prime}(x) = \ln x$', r'$f^{\prime}(x) = x + \ln x$'],
    [r'$u = x$, $u^{\prime} = 1$; $v = \ln x$, $v^{\prime} = \dfrac{1}{x}$.',
     r'$1 \cdot \ln x + x \cdot \dfrac{1}{x} = \ln x + 1$'])

Q.q(r'Bestimme die Ableitung von $f(x) = 3x^2 e^x$.',
    [r'$f^{\prime}(x) = (3x^2 + 6x)e^x$', r'$f^{\prime}(x) = 6x e^x$', r'$f^{\prime}(x) = 3x^2 e^x$', r'$f^{\prime}(x) = (6x + 3)e^x$'],
    [r'$u = 3x^2$, $u^{\prime} = 6x$; $v = e^x$, $v^{\prime} = e^x$.',
     r'$6x e^x + 3x^2 e^x = (3x^2 + 6x)e^x$'])

Q.q(r'Bestimme die Ableitung von $f(x) = x^3 \ln x$.',
    [r'$f^{\prime}(x) = 3x^2 \ln x + x^2$', r'$f^{\prime}(x) = 3x^2 \cdot \dfrac{1}{x}$', r'$f^{\prime}(x) = 3x^2 \ln x + x^3$', r'$f^{\prime}(x) = 3x \ln x$'],
    [r'$u^{\prime} v + u v^{\prime} = 3x^2 \ln x + x^3 \cdot \dfrac{1}{x}$',
     r'$x^3 \cdot \dfrac{1}{x} = x^2$'])

# --------------------------------------------------- slopes and tangents ----
Q.q(r'Wie groß ist der Anstieg von $f(x) = e^x$ an der Stelle 0?',
    [r'1', r'0', r'$e$', r'−1'],
    [r'$f^{\prime}(0) = e^0 = 1$',
     r'Deshalb schneidet der Graph die $y$-Achse unter 45°.'])

Q.q(r'Wie lautet die Tangente an $f(x) = \ln x$ im Punkt $(1 \mid 0)$?',
    [r'$y = x - 1$', r'$y = x$', r'$y = -x + 1$', r'$y = \dfrac{1}{x}$'],
    [r'$f^{\prime}(1) = \dfrac{1}{1} = 1$',
     r'$y = 1 \cdot (x - 1) + 0 = x - 1$'])

Q.q(r'Wie groß ist der Anstieg der Sinuskurve an der Stelle $x = \pi$?',
    [r'−1', r'0', r'1', r'$\pi$'],
    [r'$(\sin x)^{\prime} = \cos x$',
     r'$\cos \pi = -1$: Dort fällt die Sinuskurve am steilsten.'])

Q.q(r'An welcher Stelle hat $f(x) = x e^x$ eine waagerechte Tangente?',
    [r'$x = -1$', r'$x = 0$', r'$x = 1$', r'An keiner Stelle.'],
    [r'$f^{\prime}(x) = (1 + x)e^x$',
     r'$e^x$ ist nie null, also $1 + x = 0$.',
     r'$x = -1$'])

Q.q(r'An welcher Stelle hat $f(x) = (x - 2)e^x$ eine waagerechte Tangente?',
    [r'$x = 1$', r'$x = 2$', r'$x = 0$', r'$x = -2$'],
    [r'$f^{\prime}(x) = 1 \cdot e^x + (x - 2)e^x = (x - 1)e^x$',
     r'$x - 1 = 0$, also $x = 1$.'])

Q.q(r'Wie groß ist der Anstieg von $f(x) = 5 + 2\sin x$ an der Stelle 0?',
    [r'2', r'5', r'7', r'0'],
    [r'$f^{\prime}(x) = 2\cos x$',
     r'$f^{\prime}(0) = 2 \cdot 1 = 2$'])

# ----------------------------------------------------------- traps and CAS ----
Q.q(r'Ein Mitschüler rechnet $(x \cdot e^x)^{\prime} = 1 \cdot e^x = e^x$. Was ist falsch?',
    [r'Er hat die Faktoren einzeln abgeleitet und multipliziert, statt die Produktregel zu nutzen.',
     r'Nichts, das Ergebnis stimmt.', r'Die Ableitung von $e^x$ ist $x e^{x-1}$.', r'Die Ableitung von $x$ ist 0.'],
    [r'Die Ableitung eines Produkts ist nicht das Produkt der Ableitungen.',
     r'Richtig: $(x e^x)^{\prime} = e^x + x e^x$.'])

Q.q(r'Ohne Quotientenregel: Schreibe $f(x) = \dfrac{e^x}{x}$ als $e^x \cdot x^{-1}$. Welche Ableitung ergibt die Produktregel?',
    [r'$f^{\prime}(x) = \dfrac{e^x (x - 1)}{x^2}$', r'$f^{\prime}(x) = \dfrac{e^x}{1}$', r'$f^{\prime}(x) = \dfrac{e^x (x + 1)}{x^2}$', r'$f^{\prime}(x) = -\dfrac{e^x}{x^2}$'],
    [r'$e^x \cdot x^{-1} + e^x \cdot (-x^{-2})$',
     r'$= \dfrac{e^x}{x} - \dfrac{e^x}{x^2} = \dfrac{e^x (x - 1)}{x^2}$',
     r'Im Unterricht macht man solche Ableitungen mit dem CAS.'])

Q.q(r'Bestimme die Ableitung von $f(x) = \sin x \cdot \cos x$.',
    [r'$f^{\prime}(x) = \cos^2 x - \sin^2 x$', r'$f^{\prime}(x) = -\sin x \cos x$', r'$f^{\prime}(x) = \cos^2 x + \sin^2 x$', r'$f^{\prime}(x) = 1$'],
    [r'$u = \sin x$, $u^{\prime} = \cos x$; $v = \cos x$, $v^{\prime} = -\sin x$.',
     r'$\cos x \cdot \cos x + \sin x \cdot (-\sin x) = \cos^2 x - \sin^2 x$'])


def check():
    import sympy as sp
    x = sp.symbols('x', positive=True)
    d = lambda e: sp.diff(e, x)
    eq = lambda a, b: sp.simplify(a - b) == 0
    assert d(sp.exp(x)) == sp.exp(x) and eq(d(sp.log(x)), 1 / x)
    assert d(sp.sin(x)) == sp.cos(x) and d(sp.cos(x)) == -sp.sin(x)
    assert eq(d(3 * sp.exp(x) - 2 * sp.log(x)), 3 * sp.exp(x) - 2 / x)
    assert eq(d(x * sp.exp(x)), (1 + x) * sp.exp(x))
    assert eq(d(x ** 2 * sp.sin(x)), 2 * x * sp.sin(x) + x ** 2 * sp.cos(x))
    assert eq(d(x * sp.log(x)), sp.log(x) + 1)
    assert eq(d(3 * x ** 2 * sp.exp(x)), (3 * x ** 2 + 6 * x) * sp.exp(x))
    assert eq(d(x ** 3 * sp.log(x)), 3 * x ** 2 * sp.log(x) + x ** 2)
    assert d(sp.exp(x)).subs(x, 0) == 1 and d(sp.log(x)).subs(x, 1) == 1
    assert sp.cos(sp.pi) == -1
    z = sp.symbols('z')
    assert sp.solve(sp.diff(z * sp.exp(z), z), z) == [-1]
    assert sp.solve(sp.diff((z - 2) * sp.exp(z), z), z) == [1]
    assert sp.diff(5 + 2 * sp.sin(z), z).subs(z, 0) == 2
    assert eq(d(sp.exp(x) / x), sp.exp(x) * (x - 1) / x ** 2)
    assert eq(d(sp.sin(x) * sp.cos(x)), sp.cos(x) ** 2 - sp.sin(x) ** 2)


Q.verify(check)
Q.save()
