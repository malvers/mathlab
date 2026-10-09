#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 8 (LB 5): Flächeninhalte zwischen zwei
Funktionsgraphen - Schnittstellen, Differenzfunktion, mehrere Schnittstellen, Parameter,
Anwendungen. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12
import svgfig as S
import sympy as sp

Q = gy12(nr=8, slug='flaechen-graphen', thema='Flächen zwischen zwei Graphen', lb='LB 5',
         blurb='Schnittstellen als Grenzen, Differenzfunktion, mehrere Schnittstellen',
         comment='Blocks: zwei Schnittstellen (1-3, 5, 8, 9, 14, 18), mehrere Schnittstellen (4, 11, 19), e-, sin- und 1/x-Graphen (6, 7, 12, 17), Parameter und Teilung (13, 20), Anwendung (15, 16), Begründung (10). Mit Hilfsmitteln erlaubt.')


def fig_pg():
    p = S.Plot((-3.2, 2.2), (-1.4, 4.6), w=440, h=300)
    p.grid(1, 1)
    p.axes(1, 1, xlabel="x", ylabel="y")
    f = lambda u: -u * u + 4
    g = lambda u: u + 2
    p.area_between(f, g, -2, 1, fill=S.ORANGE, opacity=0.4)
    p.curve(f, -2.6, 2.1, S.RED, 2.2)
    p.curve(g, -3.1, 2.1, S.GREEN, 2.2)
    p.point(-2, 0)
    p.point(1, 3)
    return p.svg("Parabel f(x) = 4 minus x hoch 2 und Gerade g(x) = x plus 2 mit der eingeschlossenen Fläche")


Q.q(r'Berechne den Inhalt der Fläche, die die Graphen von $f(x) = x^2$ und $g(x) = x$ einschließen.',
    [r'$\tfrac16$', r'$\tfrac13$', r'$\tfrac12$', r'$\tfrac56$'],
    [r'Schnittstellen: $x^2 = x$ gibt $x = 0$ und $x = 1$; dazwischen liegt $g$ oben.',
     r'$\int_0^1 (x - x^2)\,\mathrm{d}x = \tfrac12 - \tfrac13 = \tfrac16$.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen $f(x) = x^2$ und $g(x) = 2x$.',
    [r'$\tfrac43$', r'$\tfrac83$', r'$4$', r'$\tfrac23$'],
    [r'Schnittstellen $0$ und $2$.',
     r'$\int_0^2 (2x - x^2)\,\mathrm{d}x = 4 - \tfrac83 = \tfrac43$.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen $f(x) = -x^2 + 4$ und $g(x) = x + 2$.',
    [r'$4{,}5$', r'$\tfrac{32}{3}$', r'$6$', r'$3$'],
    [r'$-x^2 + 4 = x + 2$ gibt $x^2 + x - 2 = 0$, also $x = -2$ und $x = 1$.',
     r'$\int_{-2}^1 (-x^2 - x + 2)\,\mathrm{d}x = \tfrac76 + \tfrac{10}{3} = \tfrac{27}{6} = 4{,}5$.'],
    fig=fig_pg(), figcap='Parabel und Gerade mit zwei Schnittpunkten')

Q.q(r'Berechne den Gesamtinhalt der Flächen zwischen $f(x) = x^3$ und $g(x) = x$.',
    [r'$\tfrac12$', r'$0$', r'$\tfrac14$', r'$1$'],
    [r'Schnittstellen $-1$, $0$, $1$: zwei Teilflächen, je $\left|\int_0^1 (x^3 - x)\,\mathrm{d}x\right| = \tfrac14$.',
     r'Zusammen $\tfrac12$. In einem Zug von $-1$ bis $1$ integriert ergäbe sich $0$.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen $f(x) = \sqrt{x}$ und $g(x) = x^2$.',
    [r'$\tfrac13$', r'$\tfrac23$', r'$1$', r'$\tfrac16$'],
    [r'Schnittstellen $0$ und $1$; dazwischen liegt $\sqrt{x}$ oben.',
     r'$\int_0^1 \left(\sqrt{x} - x^2\right)\mathrm{d}x = \tfrac23 - \tfrac13 = \tfrac13$.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen $f(x) = \mathrm{e}^x$ und $g(x) = x + 1$ über $[0;\ 1]$ auf drei Nachkommastellen.',
    [r'$\approx 0{,}218$', r'$\approx 1{,}718$', r'$\approx 0{,}500$', r'$\approx 0{,}282$'],
    [r'$\mathrm{e}^x \ge x + 1$; die Gerade ist die Tangente bei $0$.',
     r'$\int_0^1 (\mathrm{e}^x - x - 1)\,\mathrm{d}x = \mathrm{e} - 1 - \tfrac12 - 1 = \mathrm{e} - 2{,}5 \approx 0{,}218$.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen $\sin x$ und $\cos x$ über $\left[\tfrac{\pi}{4};\ \tfrac{5\pi}{4}\right]$.',
    [r'$2\sqrt2 \approx 2{,}83$', r'$\sqrt2 \approx 1{,}41$', r'$2$', r'$0$'],
    [r'Die Grenzen sind benachbarte Schnittstellen; dazwischen liegt $\sin x$ oben.',
     r'$\left[-\cos x - \sin x\right]_{\pi/4}^{5\pi/4} = \sqrt2 - (-\sqrt2) = 2\sqrt2$.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen $f(x) = x^2 - 2x$ und $g(x) = x$.',
    [r'$4{,}5$', r'$9$', r'$\tfrac43$', r'$13{,}5$'],
    [r'$x^2 - 2x = x$ gibt $x(x - 3) = 0$.',
     r'$\int_0^3 (3x - x^2)\,\mathrm{d}x = 13{,}5 - 9 = 4{,}5$.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen $f(x) = x^2 - 1$ und $g(x) = 1 - x^2$.',
    [r'$\tfrac83$', r'$\tfrac43$', r'$4$', r'$0$'],
    [r'Schnittstellen $\pm 1$, Differenz $g - f = 2 - 2x^2$.',
     r'$\left[2x - \tfrac23 x^3\right]_{-1}^1 = \tfrac43 + \tfrac43 = \tfrac83$.'])

Q.q(r'Warum steht bei der Fläche zwischen zwei Graphen ein Betrag, $A = \left|\int_{x_1}^{x_2} (f(x) - g(x))\,\mathrm{d}x\right|$?',
    [r'Damit es egal ist, welcher Graph oben liegt.', r'Weil Integrale immer negativ sind.', r'Weil man sonst durch null teilt.', r'Weil die Schnittstellen vertauscht werden müssen.'],
    [r'Liegt $g$ oben, ist $f - g$ negativ und das Integral auch.',
     r'Der Betrag macht daraus den positiven Flächeninhalt, solange zwischen $x_1$ und $x_2$ keine weitere Schnittstelle liegt.'])

Q.q(r'Berechne den Gesamtinhalt der Flächen zwischen $f(x) = x^3 - 3x$ und $g(x) = x$.',
    [r'$8$', r'$4$', r'$0$', r'$16$'],
    [r'$x^3 - 4x = 0$: Schnittstellen $-2$, $0$, $2$.',
     r'Je $\left|\int_0^2 (x^3 - 4x)\,\mathrm{d}x\right| = |4 - 8| = 4$, zusammen $8$.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen $f(x) = \dfrac1x$ und $g(x) = 2{,}5 - x$ auf drei Nachkommastellen.',
    [r'$\approx 0{,}489$', r'$\approx 1{,}875$', r'$\approx 1{,}386$', r'$\approx 0{,}614$'],
    [r'$\tfrac1x = 2{,}5 - x$ gibt $x^2 - 2{,}5x + 1 = 0$, also $x = 0{,}5$ und $x = 2$.',
     r'$\int_{0{,}5}^2 \left(2{,}5 - x - \tfrac1x\right)\mathrm{d}x = 1{,}875 - 2\ln 2 \approx 0{,}489$.'])

Q.q(r'Für welches $a > 0$ schließen $f(x) = x^2$ und $g(x) = ax$ eine Fläche vom Inhalt $36$ ein?',
    [r'$a = 6$', r'$a = 36$', r'$a = 3$', r'$a = \sqrt[3]{36}$'],
    [r'Schnittstellen $0$ und $a$: $\int_0^a (ax - x^2)\,\mathrm{d}x = \tfrac{a^3}{2} - \tfrac{a^3}{3} = \tfrac{a^3}{6}$.',
     r'$\tfrac{a^3}{6} = 36$ gibt $a^3 = 216$, also $a = 6$.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen $f(x) = 4 - x^2$ und der Geraden $y = 3$.',
    [r'$\tfrac43$', r'$\tfrac{32}{3}$', r'$\tfrac23$', r'$2$'],
    [r'$4 - x^2 = 3$ bei $x = \pm 1$; Differenz $1 - x^2$.',
     r'$\left[x - \tfrac13 x^3\right]_{-1}^1 = \tfrac23 + \tfrac23 = \tfrac43$.'])

Q.q(r'Ein Bogen hat die äußere Kante $f(x) = -0{,}5x^2 + 4{,}5$ und die innere Kante $g(x) = -0{,}5x^2 + 2$ (jeweils über der $x$-Achse, in m). Wie groß ist die Fläche des Bogens?',
    [r'$\tfrac{38}{3} \approx 12{,}7$ m²', r'$18$ m²', r'$\tfrac{16}{3} \approx 5{,}3$ m²', r'$15$ m²'],
    [r'Fläche unter $f$ über $[-3;\ 3]$: $2\left[4{,}5x - \tfrac16 x^3\right]_0^3 = 18$; unter $g$ über $[-2;\ 2]$: $2\left[2x - \tfrac16 x^3\right]_0^2 = \tfrac{16}{3}$.',
     r'Bogen $= 18 - \tfrac{16}{3} = \tfrac{38}{3} \approx 12{,}7$ m². Die Kanten haben verschiedene Nullstellen.'])

Q.q(r'Die Tangente an $f(x) = x^2$ im Punkt $(1 \mid 1)$, der Graph und die $y$-Achse begrenzen eine Fläche. Wie groß ist sie?',
    [r'$\tfrac13$', r'$\tfrac23$', r'$1$', r'$\tfrac16$'],
    [r'Tangente $y = 2x - 1$; sie liegt unter der Parabel.',
     r'$\int_0^1 (x^2 - 2x + 1)\,\mathrm{d}x = \int_0^1 (x - 1)^2\,\mathrm{d}x = \tfrac13$.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen $\mathrm{e}^x$ und $\mathrm{e}^{-x}$ über $[0;\ 1]$ auf drei Nachkommastellen.',
    [r'$\approx 1{,}086$', r'$\approx 2{,}350$', r'$\approx 0{,}632$', r'$\approx 1{,}718$'],
    [r'Auf $[0;\ 1]$ liegt $\mathrm{e}^x$ oben.',
     r'$\left[\mathrm{e}^x + \mathrm{e}^{-x}\right]_0^1 = \mathrm{e} + \tfrac1{\mathrm{e}} - 2 \approx 1{,}086$.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen $f(x) = x^2$ und $g(x) = 8 - x^2$.',
    [r'$\tfrac{64}{3}$', r'$\tfrac{32}{3}$', r'$16$', r'$32$'],
    [r'$x^2 = 8 - x^2$ gibt $x = \pm 2$; Differenz $8 - 2x^2$.',
     r'$\left[8x - \tfrac23 x^3\right]_{-2}^2 = 2\left(16 - \tfrac{16}{3}\right) = \tfrac{64}{3}$.'])

Q.q(r'Jemand berechnet die Fläche zwischen $x^3$ und $x$ als $\left|\int_{-1}^1 (x^3 - x)\,\mathrm{d}x\right| = 0$. Was ist der Fehler?',
    [r'Die Schnittstelle $0$ liegt im Intervall; man muss dort teilen.', r'Die Grenzen müssen $0$ und $1$ sein.', r'Man muss $g - f$ statt $f - g$ nehmen.', r'Es gibt keinen Fehler, die Fläche ist $0$.'],
    [r'Zwischen $-1$ und $0$ liegt $x^3$ oben, zwischen $0$ und $1$ liegt $x$ oben.',
     r'Erst einzeln integrieren, dann Beträge addieren: $\tfrac14 + \tfrac14 = \tfrac12$.'])

Q.q(r'Die waagerechte Gerade $y = c$ halbiert die Fläche zwischen $y = x^2$ und $y = 4$. Bestimme $c$ auf zwei Nachkommastellen.',
    [r'$c \approx 2{,}52$', r'$c = 2$', r'$c \approx 2{,}83$', r'$c \approx 1{,}59$'],
    [r'Gesamtfläche $\tfrac{32}{3}$; die Fläche unter $y = c$ ist $\int_{-\sqrt c}^{\sqrt c} (c - x^2)\,\mathrm{d}x = \tfrac43 c^{3/2}$.',
     r'$\tfrac43 c^{3/2} = \tfrac{16}{3}$ gibt $c^{3/2} = 4$, also $c = 4^{2/3} \approx 2{,}52$, nicht die halbe Höhe $2$.'])


def check():
    x, a, c = sp.symbols('x a c', positive=True)
    I = lambda f, p, q: sp.integrate(f, (x, p, q))
    assert I(x - x**2, 0, 1) == sp.Rational(1, 6) and I(2*x - x**2, 0, 2) == sp.Rational(4, 3)
    assert sp.solve(-x**2 + 4 - (x + 2), x) == [1] and I(-x**2 - x + 2, -2, 1) == sp.Rational(9, 2)
    assert 2*abs(I(x**3 - x, 0, 1)) == sp.Rational(1, 2) and I(sp.sqrt(x) - x**2, 0, 1) == sp.Rational(1, 3)
    v = I(sp.exp(x) - x - 1, 0, 1)
    assert sp.simplify(v - (sp.E - sp.Rational(5, 2))) == 0 and abs(float(v) - 0.218) < 0.0005
    w = I(sp.sin(x) - sp.cos(x), sp.pi/4, 5*sp.pi/4)
    assert sp.simplify(w - 2*sp.sqrt(2)) == 0
    assert I(3*x - x**2, 0, 3) == sp.Rational(9, 2) and I(2 - 2*x**2, -1, 1) == sp.Rational(8, 3)
    assert 2*abs(I(x**3 - 4*x, 0, 2)) == 8
    u = I(sp.Rational(5, 2) - x - 1/x, sp.Rational(1, 2), 2)
    assert abs(float(u) - 0.489) < 0.0005 and abs(float(sp.Rational(15, 8) - 2*sp.log(2)) - float(u)) < 1e-12
    assert sp.solve(sp.Eq(I(a*x - x**2, 0, a), 36), a) == [6]
    assert I(1 - x**2, -1, 1) == sp.Rational(4, 3)
    assert 2*I(sp.Rational(9, 2) - x**2/2, 0, 3) - 2*I(2 - x**2/2, 0, 2) == sp.Rational(38, 3)
    assert I((x - 1)**2, 0, 1) == sp.Rational(1, 3)
    assert abs(float(I(sp.exp(x) - sp.exp(-x), 0, 1)) - 1.086) < 0.0005
    assert I(8 - 2*x**2, -2, 2) == sp.Rational(64, 3)
    assert sp.solve(sp.Eq(sp.Rational(4, 3)*c**sp.Rational(3, 2), sp.Rational(16, 3)), c) == [4**sp.Rational(2, 3)]
    assert abs(4**(2/3) - 2.52) < 0.005 and sp.simplify(I(c - x**2, -sp.sqrt(c), sp.sqrt(c)) - sp.Rational(4, 3)*c**sp.Rational(3, 2)) == 0


Q.verify(check)
Q.save()
