#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 25 (LB 9): Inhalte begrenzter und unbegrenzter Flächen -
elementargeometrisch, mit Vektorprodukt, mit Integralrechnung; Volumina; Dichtefunktion, Wahrscheinlichkeit und
Flächeninhalt. 11 Fragen aus den Grundkurs-Blättern tools/aufgaben/mathegy12/w24-flaecheninhalte.py und
w07-flaechen-achse.py (eine Quelle), 9 neue. Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, new, put, gk_checks
from statistics import NormalDist
import sympy as sp

Q = gy12lk(nr=25, slug='flaecheninhalte', thema='Flächen, Volumina und unbegrenzte Flächen', lb='LB 9',
           blurb='Dreiecke und Pyramiden mit Vektoren, unbegrenzte Flächen als Grenzwert, Wahrscheinlichkeit als Fläche',
           comment='Blocks: Flächen elementargeometrisch und mit Vektorprodukt (1-9), Volumina von Pyramiden (10, 11), unbegrenzte Flächen (12-17), Dichtefunktion, Wahrscheinlichkeit und Flächeninhalt (18-20). Mit Hilfsmitteln erlaubt.')

N = new()

N.q(r'Das Tetraeder hat die Ecken $O$, $A(1 \mid 0 \mid 0)$, $B(0 \mid 1 \mid 0)$ und $C(0 \mid 0 \mid 1)$. Berechne sein Volumen über die schräge Grundfläche $ABC$ (Inhalt $\tfrac{\sqrt3}{2}$) und den Abstand von $O$ zur Ebene $x + y + z = 1$.',
    [r'$\tfrac16$', r'$\tfrac13$', r'$\tfrac{\sqrt3}{6}$', r'$\tfrac12$'],
    [r'Höhe = Abstand von $O$ zur Ebene: $\dfrac{|0 + 0 + 0 - 1|}{\sqrt3} = \dfrac{1}{\sqrt3}$.',
     r'$V = \tfrac13 \cdot \tfrac{\sqrt3}{2} \cdot \tfrac{1}{\sqrt3} = \tfrac16$. Probe über die Grundfläche $OAB$ mit Inhalt $\tfrac12$ und Höhe $1$: $\tfrac13 \cdot \tfrac12 \cdot 1 = \tfrac16$ ✔'])

N.q(r'Welchen Inhalt hat die Fläche unter $f(x) = \dfrac{1}{x^3}$ über $[1;\ \infty)$?',
    [r'$\tfrac12$', r'Sie ist unendlich groß.', r'$1$', r'$\tfrac13$'],
    [r'$\int_1^b x^{-3}\,\mathrm{d}x = \left[-\tfrac{1}{2x^2}\right]_1^b = \tfrac12 - \tfrac{1}{2b^2}$.',
     r'Für $b \to \infty$ strebt das gegen $\tfrac12$: Die unbegrenzte Fläche hat einen endlichen Inhalt.'])

N.q(r'Hat die Fläche unter $f(x) = \dfrac{1}{\sqrt{x}}$ über $[1;\ \infty)$ einen endlichen Inhalt?',
    [r'Nein, $\int_1^b \tfrac{1}{\sqrt{x}}\,\mathrm{d}x = 2\sqrt{b} - 2$ wächst über alle Grenzen.', r'Ja, den Inhalt $2$.', r'Ja, den Inhalt $1$.', r'Ja, den Inhalt $\tfrac12$.'],
    [r'Stammfunktion $2\sqrt{x}$.',
     r'$2\sqrt{b} - 2 \to \infty$ für $b \to \infty$: Der Graph fällt zu langsam. Erst ab $\tfrac{1}{x^r}$ mit $r > 1$ wird die Fläche endlich.'])

N.q(r'Welchen Inhalt hat die Fläche unter $f(x) = \mathrm{e}^{-x}$ über $[0;\ \infty)$?',
    [r'$1$', r'Sie ist unendlich groß.', r'$\mathrm{e}$', r'$0$'],
    [r'$\int_0^b \mathrm{e}^{-x}\,\mathrm{d}x = 1 - \mathrm{e}^{-b}$.',
     r'Für $b \to \infty$ geht $\mathrm{e}^{-b} \to 0$, der Inhalt ist $1$.'])

N.q(r'Die Fläche unter $f(x) = \dfrac{1}{\sqrt{x}}$ über $(0;\ 1]$ ist nach oben unbegrenzt. Welchen Inhalt hat sie?',
    [r'$2$', r'Sie ist unendlich groß.', r'$1$', r'$\tfrac12$'],
    [r'$\int_a^1 \tfrac{1}{\sqrt{x}}\,\mathrm{d}x = 2 - 2\sqrt{a}$ für $0 < a < 1$.',
     r'Für $a \to 0$ strebt das gegen $2$: Auch an einer Polstelle kann die Fläche endlich sein.'])

N.q(r'Wie groß ist die Fläche zwischen $f(x) = \dfrac{1}{x^2}$ und $g(x) = \dfrac{1}{x^3}$ über $[1;\ \infty)$?',
    [r'$\tfrac12$', r'$1$', r'Sie ist unendlich groß.', r'$\tfrac32$'],
    [r'Für $x \ge 1$ ist $\tfrac{1}{x^2} \ge \tfrac{1}{x^3}$; $\int_1^b \left(x^{-2} - x^{-3}\right)\mathrm{d}x = \left(1 - \tfrac1b\right) - \left(\tfrac12 - \tfrac{1}{2b^2}\right)$.',
     r'Für $b \to \infty$: $1 - \tfrac12 = \tfrac12$.'])

N.q(r'$Z$ ist standardnormalverteilt. Was bedeutet der Inhalt der Fläche unter der Glockenkurve $\varphi$ zwischen $-1$ und $1$?',
    [r'die Wahrscheinlichkeit $P(-1 \le Z \le 1) \approx 0{,}683$', r'den Erwartungswert von $Z$', r'die Varianz von $Z$', r'die Wahrscheinlichkeit $P(Z = 1)$'],
    [r'Bei einer stetigen Zufallsgröße ist jede Wahrscheinlichkeit $P(a \le Z \le b)$ eine Fläche unter der Dichte.',
     r'$\int_{-1}^{1} \varphi(z)\,\mathrm{d}z \approx 0{,}683$. Die ganze Fläche bis ins Unendliche ist $1$.'])

N.q(r'Für welches $k$ ist $f(x) = kx$ auf $[0;\ 2]$ (und $0$ sonst) eine Dichtefunktion?',
    [r'$k = \tfrac12$', r'$k = 2$', r'$k = 1$', r'$k = \tfrac14$'],
    [r'Eine Dichte ist nicht negativ, und die Fläche unter ihr ist $1$.',
     r'$\int_0^2 kx\,\mathrm{d}x = 2k = 1$ gibt $k = \tfrac12$.'])

N.q(r'$X$ hat die Dichte $f(x) = \tfrac12 x$ auf $[0;\ 2]$. Wie groß ist $P(X \le 1)$?',
    [r'$\tfrac14$', r'$\tfrac12$', r'$1$', r'$\tfrac34$'],
    [r'$P(X \le 1) = \int_0^1 \tfrac12 x\,\mathrm{d}x = \left[\tfrac14 x^2\right]_0^1$.',
     r'$= \tfrac14$. Obwohl $1$ die Mitte von $[0;\ 2]$ ist, liegt links nur ein Viertel der Fläche; $\tfrac34$ ist $P(X > 1)$.'])

put(Q, [gk('w24-flaecheninhalte.py', [0, 1, 2, 8, 10, 13, 14, 17, 19]), N.take(0, 1), gk('w24-flaecheninhalte.py', [7]),
        gk('w07-flaechen-achse.py', [18]), N.take(1)])


def check():
    gk_checks()
    x, b, a = sp.symbols('x b a', positive=True)
    A, B, C = sp.Matrix([1, 0, 0]), sp.Matrix([0, 1, 0]), sp.Matrix([0, 0, 1])
    G = (B - A).cross(C - A).norm() / 2
    assert G == sp.sqrt(3)/2
    h = sp.Rational(1, 1) / sp.sqrt(3)
    assert sp.simplify(G*h/3) == sp.Rational(1, 6) == sp.Rational(1, 3)*sp.Rational(1, 2)*1
    assert sp.limit(sp.integrate(x**-3, (x, 1, b)), b, sp.oo) == sp.Rational(1, 2)
    assert sp.simplify(sp.integrate(1/sp.sqrt(x), (x, 1, b)) - (2*sp.sqrt(b) - 2)) == 0 and sp.limit(2*sp.sqrt(b) - 2, b, sp.oo) == sp.oo
    assert sp.limit(sp.integrate(sp.exp(-x), (x, 0, b)), b, sp.oo) == 1
    assert sp.limit(sp.integrate(1/sp.sqrt(x), (x, a, 1)), a, 0) == 2
    assert sp.limit(sp.integrate(x**-2 - x**-3, (x, 1, b)), b, sp.oo) == sp.Rational(1, 2)
    Z = NormalDist()
    assert round(Z.cdf(1) - Z.cdf(-1), 3) == 0.683
    k = sp.symbols('k')
    assert sp.solve(sp.integrate(k*x, (x, 0, 2)) - 1, k) == [sp.Rational(1, 2)]
    assert sp.integrate(x/2, (x, 0, 1)) == sp.Rational(1, 4) and sp.integrate(x/2, (x, 1, 2)) == sp.Rational(3, 4)


Q.verify(check)
Q.save()
