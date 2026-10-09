#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 7 (LB 5): Flächeninhalte zwischen
Funktionsgraph und x-Achse - Nullstellen als Grenzen, Teilflächen mit Betrag, unbekannte
Grenze, unbegrenzte Flächen, Anwendungen. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12
import svgfig as S
import sympy as sp

Q = gy12(nr=7, slug='flaechen-achse', thema='Flächen zwischen Graph und x-Achse', lb='LB 5',
         blurb='Nullstellen als Grenzen, Teilflächen, unbekannte Grenze',
         comment='Blocks: eine Fläche über oder unter der Achse (1-3, 6, 7, 13, 15), Teilflächen mit Vorzeichenwechsel (4, 5, 8, 11, 12, 17), Grenze oder Parameter gesucht (9, 10, 16), unbegrenzte Flächen (18, 19), Anwendung (20), Begründung (14). Ohne Hilfsmittel, Aufgabe 20 mit.')


def fig_x2m1():
    p = S.Plot((-0.5, 2.5), (-1.6, 3.6), w=420, h=300)
    p.grid(1, 1)
    p.axes(1, 1, xlabel="x", ylabel="y")
    f = lambda u: u * u - 1
    p.area(f, 0, 1, fill=S.RED, opacity=0.25)
    p.area(f, 1, 2, fill=S.GREEN, opacity=0.35)
    p.curve(f, -0.4, 2.2, S.INK, 2.2)
    return p.svg("Graph von f(x) = x hoch 2 minus 1 auf 0 bis 2, eine Teilfläche unter und eine über der x-Achse")


def fig_kubik():
    p = S.Plot((-0.5, 4.5), (-3.6, 3.6), w=440, h=300)
    p.grid(1, 1)
    p.axes(1, 1, xlabel="x", ylabel="y")
    f = lambda u: u ** 3 - 6 * u ** 2 + 8 * u
    p.area(f, 0, 2, fill=S.GREEN, opacity=0.35)
    p.area(f, 2, 4, fill=S.RED, opacity=0.25)
    p.curve(f, -0.3, 4.3, S.INK, 2.2)
    return p.svg("Graph von f(x) = x hoch 3 minus 6x hoch 2 plus 8x mit Nullstellen 0, 2 und 4")


Q.q(r'Berechne den Flächeninhalt zwischen dem Graphen von $f(x) = x^2 + 1$ und der $x$-Achse über $[0;\ 3]$.',
    [r'$12$', r'$9$', r'$10$', r'$13$'],
    [r'$f > 0$ auf dem ganzen Intervall, also Fläche = Integral.',
     r'$\left[\tfrac13 x^3 + x\right]_0^3 = 9 + 3 = 12$.'])

Q.q(r'Berechne den Flächeninhalt, den der Graph von $f(x) = 4 - x^2$ mit der $x$-Achse einschließt.',
    [r'$\tfrac{32}{3}$', r'$\tfrac{16}{3}$', r'$8$', r'$16$'],
    [r'Nullstellen $\pm 2$ als Grenzen: $\int_{-2}^2 (4 - x^2)\,\mathrm{d}x = \left[4x - \tfrac13 x^3\right]_{-2}^2$.',
     r'$= \left(8 - \tfrac83\right) - \left(-8 + \tfrac83\right) = \tfrac{32}{3} \approx 10{,}67$.'])

Q.q(r'Berechne den Flächeninhalt, den der Graph von $f(x) = x^2 - 4x$ mit der $x$-Achse einschließt.',
    [r'$\tfrac{32}{3}$', r'$-\tfrac{32}{3}$', r'$\tfrac{64}{3}$', r'$32$'],
    [r'Nullstellen $0$ und $4$; dazwischen liegt der Graph unter der Achse.',
     r'$\int_0^4 (x^2 - 4x)\,\mathrm{d}x = \tfrac{64}{3} - 32 = -\tfrac{32}{3}$. Ein Flächeninhalt ist positiv: $\tfrac{32}{3}$.'])

Q.q(r'Wie groß ist die Fläche zwischen dem Graphen von $f(x) = x^3 - x$ und der $x$-Achse über $[-1;\ 1]$?',
    [r'$\tfrac12$', r'$0$', r'$\tfrac14$', r'$1$'],
    [r'Nullstelle $0$ im Intervall: zwei Teilflächen, je $\left|\int_0^1 (x^3 - x)\,\mathrm{d}x\right| = \left|\tfrac14 - \tfrac12\right| = \tfrac14$.',
     r'Zusammen $\tfrac12$. Das Integral über $[-1;\ 1]$ ist $0$, weil sich die Teile aufheben.'])

Q.q(r'Wie groß ist die Fläche zwischen dem Graphen von $\sin x$ und der $x$-Achse über $[0;\ 2\pi]$?',
    [r'$4$', r'$0$', r'$2$', r'$2\pi$'],
    [r'Auf $[0;\ \pi]$ liegt eine Halbwelle mit Inhalt $2$ über, auf $[\pi;\ 2\pi]$ eine mit $2$ unter der Achse.',
     r'Fläche $2 + 2 = 4$, Integral $2 - 2 = 0$.'])

Q.q(r'Berechne die Fläche unter $f(x) = \mathrm{e}^x$ über $[0;\ \ln 2]$.',
    [r'$1$', r'$2$', r'$\ln 2$', r'$\mathrm{e}^2 - 1$'],
    [r'$\left[\mathrm{e}^x\right]_0^{\ln 2} = \mathrm{e}^{\ln 2} - \mathrm{e}^0$.',
     r'$= 2 - 1 = 1$.'])

Q.q(r'Berechne die Fläche unter $f(x) = \dfrac1x$ über $[1;\ \mathrm{e}^2]$.',
    [r'$2$', r'$\mathrm{e}^2 - 1$', r'$1$', r'$\ln 2$'],
    [r'$\left[\ln x\right]_1^{\mathrm{e}^2} = \ln\mathrm{e}^2 - \ln 1$.',
     r'$= 2 - 0 = 2$.'])

Q.q(r'Wie groß ist die Fläche zwischen dem Graphen von $f(x) = x^2 - 1$ und der $x$-Achse über $[0;\ 2]$?',
    [r'$2$', r'$\tfrac23$', r'$\tfrac43$', r'$\tfrac83$'],
    [r'Nullstelle $1$ im Intervall: $\int_0^1 = -\tfrac23$, $\int_1^2 = \tfrac43$.',
     r'Fläche $\tfrac23 + \tfrac43 = 2$. Das Integral über $[0;\ 2]$ wäre nur $\tfrac23$.'],
    fig=fig_x2m1(), figcap='f(x) = x² − 1 auf [0; 2]: rot unter, grün über der Achse')

Q.q(r'Für welches $b > 0$ ist die Fläche unter $f(x) = x^2$ über $[0;\ b]$ gleich $9$?',
    [r'$b = 3$', r'$b = 9$', r'$b = \sqrt{27}$', r'$b = 27$'],
    [r'$\int_0^b x^2\,\mathrm{d}x = \tfrac13 b^3 = 9$.',
     r'$b^3 = 27$, also $b = 3$.'])

Q.q(r'Die Fläche unter $f(x) = 3x^2$ über $[0;\ b]$ ist $64$. Bestimme $b$.',
    [r'$b = 4$', r'$b = 8$', r'$b = \tfrac{64}{3}$', r'$b = 16$'],
    [r'$\left[x^3\right]_0^b = b^3 = 64$.',
     r'$b = 4$.'])

Q.q(r'Wie groß ist die Fläche zwischen dem Graphen von $f(x) = x^3 - 6x^2 + 8x$ und der $x$-Achse über $[0;\ 4]$?',
    [r'$8$', r'$0$', r'$4$', r'$16$'],
    [r'$f(x) = x(x - 2)(x - 4)$, Nullstellen $0$, $2$, $4$. $\int_0^2 f = 4$, $\int_2^4 f = -4$.',
     r'Fläche $4 + 4 = 8$, Integral $0$.'],
    fig=fig_kubik(), figcap='f(x) = x³ − 6x² + 8x mit zwei gleich großen Teilflächen')

Q.q(r'Berechne die Fläche, die $f(x) = -x^2 + 2x + 3$ mit der $x$-Achse einschließt.',
    [r'$\tfrac{32}{3}$', r'$9$', r'$\tfrac{16}{3}$', r'$12$'],
    [r'Nullstellen: $x^2 - 2x - 3 = 0$, also $x = -1$ und $x = 3$.',
     r'$\left[-\tfrac13 x^3 + x^2 + 3x\right]_{-1}^3 = 9 - \left(-\tfrac53\right) = \tfrac{32}{3}$.'])

Q.q(r'Wie groß ist die Fläche zwischen dem Graphen von $f(x) = \sqrt{x}$, der $x$-Achse und der Geraden $x = 4$?',
    [r'$\tfrac{16}{3}$', r'$\tfrac{14}{3}$', r'$8$', r'$2$'],
    [r'Grenzen $0$ (Nullstelle) und $4$.',
     r'$\left[\tfrac23 x^{3/2}\right]_0^4 = \tfrac23 \cdot 8 = \tfrac{16}{3}$.'])

Q.q(r'Warum muss man bei der Flächenberechnung das Integrationsintervall an den Nullstellen teilen?',
    [r'Weil Flächen unter der Achse im Integral negativ zählen und sich sonst mit positiven aufheben.', r'Weil man über Nullstellen nicht integrieren darf.', r'Weil die Stammfunktion an Nullstellen nicht definiert ist.', r'Weil sonst das Integral zu groß wird.'],
    [r'Das Integral ist ein orientierter Flächeninhalt.',
     r'Erst die Beträge der Teilintegrale ergeben zusammen den Flächeninhalt.'])

Q.q(r'Wie groß ist die Fläche zwischen $\cos x$ und der $x$-Achse über $[0;\ \pi]$?',
    [r'$2$', r'$0$', r'$1$', r'$\pi$'],
    [r'Nullstelle $\tfrac\pi2$: $\int_0^{\pi/2} \cos x\,\mathrm{d}x = 1$ und $\int_{\pi/2}^{\pi} \cos x\,\mathrm{d}x = -1$.',
     r'Fläche $1 + 1 = 2$.'])

Q.q(r'Für welches $k > 0$ ist die Fläche unter $f(x) = kx^2$ über $[0;\ 3]$ gleich $18$?',
    [r'$k = 2$', r'$k = 6$', r'$k = \tfrac23$', r'$k = 9$'],
    [r'$\int_0^3 kx^2\,\mathrm{d}x = k \cdot 9 = 18$.',
     r'$k = 2$.'])

Q.q(r'Wie groß ist die Fläche zwischen dem Graphen von $f(x) = x^3$ und der $x$-Achse über $[-2;\ 1]$?',
    [r'$\tfrac{17}{4}$', r'$-\tfrac{15}{4}$', r'$\tfrac{15}{4}$', r'$\tfrac{9}{2}$'],
    [r'Nullstelle $0$: $\int_{-2}^0 x^3\,\mathrm{d}x = -4$, $\int_0^1 x^3\,\mathrm{d}x = \tfrac14$.',
     r'Fläche $4 + \tfrac14 = \tfrac{17}{4}$. Das Integral über $[-2;\ 1]$ ist $-\tfrac{15}{4}$.'])

Q.q(r'Die Fläche unter $f(x) = \mathrm{e}^{-x}$ über $[0;\ b]$ ist $1 - \mathrm{e}^{-b}$. Welchen Wert nimmt sie für $b \to \infty$ an?',
    [r'$1$', r'unendlich', r'$0$', r'$\mathrm{e}$'],
    [r'Für $b \to \infty$ geht $\mathrm{e}^{-b} \to 0$.',
     r'Die unbegrenzte Fläche hat den endlichen Inhalt $1$.'])

Q.q(r'Welchen Inhalt hat die Fläche unter $f(x) = \dfrac{1}{x^2}$ über $[1;\ b]$ für $b \to \infty$?',
    [r'$1$', r'unendlich', r'$\tfrac12$', r'$0$'],
    [r'$\int_1^b \tfrac{1}{x^2}\,\mathrm{d}x = \left[-\tfrac1x\right]_1^b = 1 - \tfrac1b$.',
     r'Für $b \to \infty$: $1$. Bei $\tfrac1x$ dagegen wächst $\ln b$ über alle Grenzen.'])

Q.q(r'Ein Kanal hat den Querschnitt zwischen der $x$-Achse und dem Graphen von $f(x) = 0{,}25x^2 - 4$ (in m). Wie groß ist die Querschnittsfläche?',
    [r'$\tfrac{64}{3} \approx 21{,}3$ m²', r'$\tfrac{32}{3} \approx 10{,}7$ m²', r'$32$ m²', r'$16$ m²'],
    [r'Nullstellen: $0{,}25x^2 = 4$, also $x = \pm 4$.',
     r'$\left|\int_{-4}^4 (0{,}25x^2 - 4)\,\mathrm{d}x\right| = \left|\tfrac{128}{12} - 32\right| = \tfrac{64}{3}$ m².'])


def check():
    x, b, k = sp.symbols('x b k', positive=True)
    I = lambda f, a, c: sp.integrate(f, (x, a, c))
    A = lambda f, pts: sum(abs(I(f, pts[i], pts[i + 1])) for i in range(len(pts) - 1))
    assert I(x**2 + 1, 0, 3) == 12 and I(4 - x**2, -2, 2) == sp.Rational(32, 3)
    assert I(x**2 - 4*x, 0, 4) == -sp.Rational(32, 3)
    assert A(x**3 - x, [-1, 0, 1]) == sp.Rational(1, 2) and I(x**3 - x, 0, 1) == -sp.Rational(1, 4)
    assert A(sp.sin(x), [0, sp.pi, 2*sp.pi]) == 4
    assert I(sp.exp(x), 0, sp.log(2)) == 1 and I(1/x, 1, sp.exp(2)) == 2
    assert A(x**2 - 1, [0, 1, 2]) == 2 and I(x**2 - 1, 0, 2) == sp.Rational(2, 3)
    assert sp.solve(sp.Eq(I(x**2, 0, b), 9), b) == [3] and sp.solve(sp.Eq(I(3*x**2, 0, b), 64), b) == [4]
    f = x**3 - 6*x**2 + 8*x
    assert I(f, 0, 2) == 4 and I(f, 2, 4) == -4
    assert sp.solve(-x**2 + 2*x + 3, x) == [3] and I(-x**2 + 2*x + 3, -1, 3) == sp.Rational(32, 3)
    assert I(sp.sqrt(x), 0, 4) == sp.Rational(16, 3) and A(sp.cos(x), [0, sp.pi/2, sp.pi]) == 2
    assert sp.solve(sp.Eq(I(k*x**2, 0, 3), 18), k) == [2]
    assert A(x**3, [-2, 0, 1]) == sp.Rational(17, 4) and I(x**3, -2, 1) == -sp.Rational(15, 4)
    assert sp.limit(1 - sp.exp(-b), b, sp.oo) == 1 and sp.limit(I(x**-2, 1, b), b, sp.oo) == 1
    assert abs(I(x**2/4 - 4, -4, 4)) == sp.Rational(64, 3)


Q.verify(check)
Q.save()
