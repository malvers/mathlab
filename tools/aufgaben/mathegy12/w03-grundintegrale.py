#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 3 (LB 5): Integrieren ohne Hilfsmittel -
Potenzfunktionen mit rationalen Exponenten, Grundintegrale von e^x, 1/x und sin x,
Faktor- und Summenregel, einfache bestimmte Integrale. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12
import sympy as sp

Q = gy12(nr=3, slug='grundintegrale', thema='Integrieren ohne Hilfsmittel', lb='LB 5',
         blurb='Potenzfunktionen mit rationalen Exponenten, e hoch x, 1 durch x, sin x',
         comment='Blocks: Potenzregel mit Wurzeln und Brüchen (1, 2, 8, 9, 19), Grundintegrale e^x, 1/x, sin, cos (3-7, 20), bestimmte Integrale (10-13, 15), Umformen und Probe (14, 16-18). Ohne Hilfsmittel.')

Q.q(r'Berechne $\int \sqrt{x}\,\mathrm{d}x$.',
    [r'$\tfrac23 x^{3/2} + C$', r'$\tfrac32 x^{3/2} + C$', r'$\dfrac{1}{2\sqrt{x}} + C$', r'$x^{3/2} + C$'],
    [r'$\sqrt{x} = x^{1/2}$, neuer Exponent $\tfrac32$: $\dfrac{x^{3/2}}{3/2} = \tfrac23 x^{3/2}$.',
     r'Probe: $\left(\tfrac23 x^{3/2}\right)^{\prime} = \tfrac23 \cdot \tfrac32 x^{1/2} = \sqrt{x}$ ✔. $\tfrac{1}{2\sqrt x}$ ist die Ableitung.'])

Q.q(r'Berechne $\int \dfrac{1}{x^3}\,\mathrm{d}x$ für $x \neq 0$.',
    [r'$-\dfrac{1}{2x^2} + C$', r'$\dfrac{1}{4x^4} + C$', r'$-\dfrac{3}{x^4} + C$', r'$\ln|x^3| + C$'],
    [r'$\dfrac{1}{x^3} = x^{-3}$, neuer Exponent $-2$: $\dfrac{x^{-2}}{-2}$.',
     r'Also $-\dfrac{1}{2x^2} + C$. Der Logarithmus gehört nur zu $x^{-1}$.'])

Q.q(r'Berechne $\int \mathrm{e}^x\,\mathrm{d}x$.',
    [r'$\mathrm{e}^x + C$', r'$\dfrac{\mathrm{e}^{x+1}}{x + 1} + C$', r'$x\,\mathrm{e}^{x-1} + C$', r'$\ln x + C$'],
    [r'$(\mathrm{e}^x)^{\prime} = \mathrm{e}^x$, also ist $\mathrm{e}^x$ seine eigene Stammfunktion.',
     r'Die Potenzregel gilt nicht: Bei $\mathrm{e}^x$ steht die Variable im Exponenten.'])

Q.q(r'Welche Funktion ist für $x > 0$ eine Stammfunktion von $f(x) = \dfrac1x$?',
    [r'$F(x) = \ln x$', r'$F(x) = -\dfrac{1}{x^2}$', r'$F(x) = \dfrac{x^0}{0}$', r'$F(x) = \mathrm{e}^x$'],
    [r'$(\ln x)^{\prime} = \dfrac1x$.',
     r'Die Potenzregel versagt bei $x^{-1}$: Man müsste durch $0$ teilen. Allgemein gilt $\int \tfrac1x\,\mathrm{d}x = \ln|x| + C$.'])

Q.q(r'Berechne $\int \sin x\,\mathrm{d}x$.',
    [r'$-\cos x + C$', r'$\cos x + C$', r'$-\sin x + C$', r'$\tfrac12 \sin^2 x + C$'],
    [r'$(\cos x)^{\prime} = -\sin x$, also $(-\cos x)^{\prime} = \sin x$.',
     r'Darum $\int \sin x\,\mathrm{d}x = -\cos x + C$. Das Vorzeichen ist die häufigste Falle.'])

Q.q(r'Berechne $\int \cos x\,\mathrm{d}x$.',
    [r'$\sin x + C$', r'$-\sin x + C$', r'$-\cos x + C$', r'$\tfrac12 \cos^2 x + C$'],
    [r'$(\sin x)^{\prime} = \cos x$.',
     r'Also $\int \cos x\,\mathrm{d}x = \sin x + C$.'])

Q.q(r'Berechne $\int \left(3\,\mathrm{e}^x - \dfrac2x\right)\mathrm{d}x$ für $x > 0$.',
    [r'$3\,\mathrm{e}^x - 2\ln x + C$', r'$3\,\mathrm{e}^x + \dfrac{2}{x^2} + C$', r'$3\,\mathrm{e}^x - 2x + C$', r'$3x\,\mathrm{e}^x - 2\ln x + C$'],
    [r'Summen- und Faktorregel: Summandenweise integrieren, Faktoren bleiben stehen.',
     r'$3 \int \mathrm{e}^x\,\mathrm{d}x - 2 \int \tfrac1x\,\mathrm{d}x = 3\,\mathrm{e}^x - 2\ln x + C$.'])

Q.q(r'Berechne $\int x^{2/3}\,\mathrm{d}x$.',
    [r'$\tfrac35 x^{5/3} + C$', r'$\tfrac53 x^{5/3} + C$', r'$\tfrac23 x^{-1/3} + C$', r'$\tfrac32 x^{5/3} + C$'],
    [r'Neuer Exponent $\tfrac23 + 1 = \tfrac53$, durch ihn teilen heißt mit $\tfrac35$ malnehmen.',
     r'$\int x^{2/3}\,\mathrm{d}x = \tfrac35 x^{5/3} + C$.'])

Q.q(r'Berechne $\int \dfrac{4}{\sqrt{x}}\,\mathrm{d}x$ für $x > 0$.',
    [r'$8\sqrt{x} + C$', r'$2\sqrt{x} + C$', r'$-\dfrac{2}{x\sqrt{x}} + C$', r'$4\ln\sqrt{x} + C$'],
    [r'$\dfrac{4}{\sqrt x} = 4x^{-1/2}$, Stammfunktion $4 \cdot \dfrac{x^{1/2}}{1/2} = 8x^{1/2}$.',
     r'Probe: $(8\sqrt x)^{\prime} = 8 \cdot \dfrac{1}{2\sqrt x} = \dfrac{4}{\sqrt x}$ ✔'])

Q.q(r'Berechne $\int_0^{\pi} \sin x\,\mathrm{d}x$.',
    [r'$2$', r'$0$', r'$-2$', r'$1$'],
    [r'$\left[-\cos x\right]_0^{\pi} = -\cos\pi - (-\cos 0) = 1 + 1$.',
     r'$= 2$. Wer $\cos$ statt $-\cos$ nimmt, erhält $-2$.'])

Q.q(r'Berechne $\int_1^{\mathrm{e}} \dfrac1x\,\mathrm{d}x$.',
    [r'$1$', r'$\mathrm{e} - 1$', r'$0$', r'$\dfrac{1}{\mathrm{e}} - 1$'],
    [r'$\left[\ln x\right]_1^{\mathrm{e}} = \ln\mathrm{e} - \ln 1$.',
     r'$= 1 - 0 = 1$.'])

Q.q(r'Berechne $\int_0^1 \mathrm{e}^x\,\mathrm{d}x$.',
    [r'$\mathrm{e} - 1$', r'$\mathrm{e}$', r'$1$', r'$\mathrm{e} + 1$'],
    [r'$\left[\mathrm{e}^x\right]_0^1 = \mathrm{e}^1 - \mathrm{e}^0$.',
     r'$= \mathrm{e} - 1 \approx 1{,}72$. Die untere Grenze liefert $\mathrm{e}^0 = 1$, nicht $0$.'])

Q.q(r'Berechne $\int_1^4 \sqrt{x}\,\mathrm{d}x$.',
    [r'$\dfrac{14}{3}$', r'$\dfrac{16}{3}$', r'$3$', r'$\dfrac{7}{3}$'],
    [r'$\left[\tfrac23 x^{3/2}\right]_1^4 = \tfrac23 \cdot 8 - \tfrac23 \cdot 1$, denn $4^{3/2} = 8$.',
     r'$= \tfrac{16}{3} - \tfrac23 = \tfrac{14}{3}$.'])

Q.q(r'Berechne $\int \dfrac{x^2 + 1}{x}\,\mathrm{d}x$ für $x > 0$.',
    [r'$\tfrac12 x^2 + \ln x + C$', r'$\dfrac{\frac13 x^3 + x}{\frac12 x^2} + C$', r'$\tfrac12 x^2 - \dfrac{1}{x^2} + C$', r'$x + \ln x + C$'],
    [r'Erst teilen: $\dfrac{x^2 + 1}{x} = x + \dfrac1x$. Zähler und Nenner getrennt integrieren ist falsch.',
     r'$\int \left(x + \tfrac1x\right)\mathrm{d}x = \tfrac12 x^2 + \ln x + C$.'])

Q.q(r'Berechne $\int_0^{\pi/2} \cos x\,\mathrm{d}x$.',
    [r'$1$', r'$0$', r'$-1$', r'$\dfrac{\pi}{2}$'],
    [r'$\left[\sin x\right]_0^{\pi/2} = \sin\tfrac{\pi}{2} - \sin 0$.',
     r'$= 1 - 0 = 1$.'])

Q.q(r'Welche Funktion ist eine Stammfunktion von $f(x) = 2\sin x$?',
    [r'$F(x) = -2\cos x$', r'$F(x) = 2\cos x$', r'$F(x) = -2\sin x$', r'$F(x) = \cos(2x)$'],
    [r'Faktorregel: $\int 2\sin x\,\mathrm{d}x = 2 \cdot (-\cos x) + C$.',
     r'Probe: $(-2\cos x)^{\prime} = 2\sin x$ ✔'])

Q.q(r'Berechne $\int \left(x^3 - 2x + \dfrac{1}{x^2}\right)\mathrm{d}x$ für $x \neq 0$.',
    [r'$\tfrac14 x^4 - x^2 - \dfrac1x + C$', r'$\tfrac14 x^4 - x^2 + \dfrac1x + C$', r'$3x^2 - 2 - \dfrac{2}{x^3} + C$', r'$\tfrac14 x^4 - x^2 + \ln x^2 + C$'],
    [r'$\int x^{-2}\,\mathrm{d}x = \dfrac{x^{-1}}{-1} = -\dfrac1x$, der Rest mit der Potenzregel.',
     r'Ergebnis $\tfrac14 x^4 - x^2 - \tfrac1x + C$. $3x^2 - 2 - \tfrac{2}{x^3}$ ist die Ableitung.'])

Q.q(r'Warum kann man $\int x^{-1}\,\mathrm{d}x$ nicht mit der Potenzregel berechnen?',
    [r'Der neue Exponent wäre $0$, und man müsste durch $0$ teilen.', r'Weil $x^{-1}$ keine Stammfunktion hat.', r'Weil negative Exponenten beim Integrieren nie erlaubt sind.', r'Weil $x^{-1}$ an jeder Stelle unstetig ist.'],
    [r'Potenzregel: $\dfrac{x^{n+1}}{n+1}$ mit $n = -1$ ergibt $\dfrac{x^0}{0}$.',
     r'Stammfunktion ist stattdessen $\ln|x|$. Für andere negative Exponenten wie $x^{-2}$ gilt die Regel weiter.'])

Q.q(r'Berechne $\int_1^2 \dfrac{1}{x^2}\,\mathrm{d}x$.',
    [r'$\dfrac12$', r'$-\dfrac12$', r'$\dfrac34$', r'$\ln 2$'],
    [r'$\left[-\dfrac1x\right]_1^2 = -\dfrac12 - (-1)$.',
     r'$= \dfrac12$. $\ln 2$ wäre das Integral von $\tfrac1x$.'])

Q.q(r'Berechne $\int (\sin x + \cos x)\,\mathrm{d}x$.',
    [r'$\sin x - \cos x + C$', r'$\cos x - \sin x + C$', r'$-\sin x - \cos x + C$', r'$\sin x + \cos x + C$'],
    [r'$\int \sin x\,\mathrm{d}x = -\cos x$ und $\int \cos x\,\mathrm{d}x = \sin x$.',
     r'Summe: $\sin x - \cos x + C$. Probe: $(\sin x - \cos x)^{\prime} = \cos x + \sin x$ ✔'])


def check():
    x = sp.symbols('x', positive=True)
    I = lambda f: sp.integrate(f, x)
    eq = lambda a, b: sp.simplify(a - b) == 0
    assert eq(I(sp.sqrt(x)), sp.Rational(2, 3)*x**sp.Rational(3, 2))
    assert eq(I(x**-3), -1/(2*x**2))
    assert eq(I(sp.exp(x)), sp.exp(x)) and eq(I(1/x), sp.log(x))
    assert eq(I(sp.sin(x)), -sp.cos(x)) and eq(I(sp.cos(x)), sp.sin(x))
    assert eq(I(3*sp.exp(x) - 2/x), 3*sp.exp(x) - 2*sp.log(x))
    assert eq(I(x**sp.Rational(2, 3)), sp.Rational(3, 5)*x**sp.Rational(5, 3))
    assert eq(I(4/sp.sqrt(x)), 8*sp.sqrt(x))
    assert sp.integrate(sp.sin(x), (x, 0, sp.pi)) == 2
    assert sp.integrate(1/x, (x, 1, sp.E)) == 1
    assert sp.integrate(sp.exp(x), (x, 0, 1)) == sp.E - 1
    assert sp.integrate(sp.sqrt(x), (x, 1, 4)) == sp.Rational(14, 3)
    assert eq(I((x**2 + 1)/x), x**2/2 + sp.log(x))
    assert sp.integrate(sp.cos(x), (x, 0, sp.pi/2)) == 1
    assert eq(sp.diff(-2*sp.cos(x), x), 2*sp.sin(x))
    assert eq(I(x**3 - 2*x + x**-2), x**4/4 - x**2 - 1/x)
    assert sp.integrate(x**-2, (x, 1, 2)) == sp.Rational(1, 2)
    assert eq(I(sp.sin(x) + sp.cos(x)), sp.sin(x) - sp.cos(x))


Q.verify(check)
Q.save()
