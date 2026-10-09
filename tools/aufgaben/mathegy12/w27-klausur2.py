#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 27: Probe zur Klausur 12/II unter
Abiturbedingungen - Schwerpunkt LB 7 und LB 8, dazu Integral, Stochastik und WB 5.
Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12, vec
import numpy as np
import sympy as sp
import math

Q = gy12(nr=27, slug='klausur2', thema='Probeklausur 12/II', lb='Klausur',
         blurb='Abstände, Winkel, Spiegelung, Scharen, dazu Integral und Stochastik',
         comment='Blocks: Ebene ABC und Punkt P (3-10), Vektoren und Winkel (1, 2), Abstand und Scharen (11-13, 20), Integral und WB 5 (14, 15, 18, 19), Stochastik (16, 17). Teil A ohne Hilfsmittel.')

ABC = r'Gegeben sind $A(1 \mid 0 \mid 0)$, $B(0 \mid 1 \mid 0)$, $C(1 \mid 1 \mid 1)$ und $P(3 \mid 2 \mid 1)$. '

Q.q(r'Berechne $' + vec(2, -1, 3) + r' \cdot ' + vec(1, 4, 2) + r'$.',
    [r'$4$', r'$12$', r'$' + vec(2, -4, 6) + r'$', r'$-4$'],
    [r'$2 - 4 + 6$.',
     r'$= 4$.'])

Q.q(r'Welchen Winkel schließen $' + vec(1, 1, 0) + r'$ und $' + vec(0, 1, 1) + r'$ ein?',
    [r'$60^\circ$', r'$45^\circ$', r'$90^\circ$', r'$30^\circ$'],
    [r'Skalarprodukt $1$, Beträge je $\sqrt2$.',
     r'$\cos\varphi = \tfrac12$, $\varphi = 60^\circ$.'])

Q.q(ABC + r'Welche Koordinatengleichung hat die Ebene $E$ durch $A$, $B$ und $C$?',
    [r'$x + y - z = 1$', r'$x + y + z = 1$', r'$x - y + z = 1$', r'$x + y - z = 0$'],
    [r'$\vec{AB} \times \vec{AC} = (-1;\ 1;\ 0) \times (0;\ 1;\ 1) = (1;\ 1;\ -1)$.',
     r'Mit $A$: $d = 1$. Probe: $B$: $1$ ✔, $C$: $1 + 1 - 1 = 1$ ✔'])

Q.q(ABC + r'Wie weit ist $P$ von $E\colon x + y - z = 1$ entfernt?',
    [r'$\sqrt3 \approx 1{,}73$', r'$3$', r'$1$', r'$\sqrt{14}$'],
    [r'$\dfrac{|3 + 2 - 1 - 1|}{\sqrt3} = \dfrac{3}{\sqrt3}$.',
     r'$= \sqrt3$.'])

Q.q(ABC + r'Welchen Winkel bildet die $z$-Achse mit $E\colon x + y - z = 1$?',
    [r'$\approx 35{,}3^\circ$', r'$\approx 54{,}7^\circ$', r'$45^\circ$', r'$90^\circ$'],
    [r'$\sin\varphi = \dfrac{|(0;\ 0;\ 1) \cdot (1;\ 1;\ -1)|}{1 \cdot \sqrt3} = \tfrac{1}{\sqrt3}$.',
     r'$\varphi \approx 35{,}3^\circ$. $54{,}7^\circ$ ist der Winkel zur Normalen.'])

Q.q(ABC + r'Welchen Winkel schließt $E\colon x + y - z = 1$ mit der $x$-$y$-Ebene ein?',
    [r'$\approx 54{,}7^\circ$', r'$\approx 35{,}3^\circ$', r'$45^\circ$', r'$60^\circ$'],
    [r'$\cos\varphi = \dfrac{|(1;\ 1;\ -1) \cdot (0;\ 0;\ 1)|}{\sqrt3}$.',
     r'$= \tfrac{1}{\sqrt3}$, $\varphi \approx 54{,}7^\circ$.'])

Q.q(ABC + r'Welcher ist der Lotfußpunkt $F$ von $P$ auf $E\colon x + y - z = 1$?',
    [r'$(2 \mid 1 \mid 2)$', r'$(1 \mid 0 \mid 3)$', r'$(4 \mid 3 \mid 0)$', r'$(1 \mid 1 \mid 1)$'],
    [r'Lotgerade $(3 + t \mid 2 + t \mid 1 - t)$: $4 + 3t = 1$, $t = -1$.',
     r'$F(2 \mid 1 \mid 2)$. Probe: $2 + 1 - 2 = 1$ ✔'])

Q.q(ABC + r'Wohin wird $P$ an $E$ gespiegelt? Der Lotfußpunkt ist $F(2 \mid 1 \mid 2)$.',
    [r'$(1 \mid 0 \mid 3)$', r'$(2 \mid 1 \mid 2)$', r'$(-3 \mid -2 \mid -1)$', r'$(5 \mid 4 \mid -1)$'],
    [r'$\vec{OP^\prime} = 2\vec{OF} - \vec{OP}$.',
     r'$(4 - 3 \mid 2 - 2 \mid 4 - 1) = (1 \mid 0 \mid 3)$.'])

Q.q(ABC + r'Wie groß ist das Dreieck $ABC$?',
    [r'$\tfrac{\sqrt3}{2} \approx 0{,}87$', r'$\sqrt3 \approx 1{,}73$', r'$\tfrac12$', r'$1$'],
    [r'$|\vec{AB} \times \vec{AC}| = |(1;\ 1;\ -1)| = \sqrt3$.',
     r'Dreieck: die Hälfte.'])

Q.q(ABC + r'Welches Volumen hat die Pyramide $ABCP$? Ihre Höhe ist der Abstand $\sqrt3$ von $P$ zu $E$.',
    [r'$\tfrac12$', r'$\tfrac32$', r'$1$', r'$\tfrac{\sqrt3}{2}$'],
    [r'$V = \tfrac13 \cdot \tfrac{\sqrt3}{2} \cdot \sqrt3$.',
     r'$= \tfrac13 \cdot \tfrac32 = \tfrac12$.'])

Q.q(r'Wie weit ist der Ursprung von der Geraden $g\colon \vec x = ' + vec(1, 1, 0) + r' + t' + vec(1, -1, 0) + r'$ entfernt?',
    [r'$\sqrt2$', r'$1$', r'$2$', r'$0$'],
    [r'$(1 + t;\ 1 - t;\ 0) \cdot (1;\ -1;\ 0) = 2t = 0$, also $t = 0$.',
     r'Lotfußpunkt $(1 \mid 1 \mid 0)$, Abstand $\sqrt2$.'])

Q.q(r'Welchen Punkt haben alle Graphen von $f_a(x) = x^2 - ax + a$ gemeinsam?',
    [r'$(1 \mid 1)$', r'$(0 \mid 0)$', r'$(0 \mid a)$', r'keinen'],
    [r'$f_a(x) = x^2 + a(1 - x)$: Für $x = 1$ fällt $a$ heraus.',
     r'$f_a(1) = 1$ für jedes $a$.'])

Q.q(r'Für welches $a$ steht $g_a\colon \vec x = t \cdot ' + vec(1, 'a', 1) + r'$ senkrecht auf der Ebene $x + 2y + z = 0$?',
    [r'$a = 2$', r'$a = -2$', r'$a = 1$', r'$a = 0$'],
    [r'Der Richtungsvektor muss ein Vielfaches des Normalenvektors $(1;\ 2;\ 1)$ sein.',
     r'Also $a = 2$. Mit $\vec u \cdot \vec n = 0$ ($a = -1$) läge $g_a$ parallel zur Ebene.'])

Q.q(r'Berechne $\int_0^2 (3x^2 - 2x)\,dx$.',
    [r'$4$', r'$8$', r'$12$', r'$0$'],
    [r'$\left[x^3 - x^2\right]_0^2$.',
     r'$= 8 - 4 = 4$.'])

Q.q(r'Wie groß ist die Fläche zwischen $f(x) = x^2$ und der Geraden $y = 4$?',
    [r'$\tfrac{32}{3}$', r'$\tfrac{16}{3}$', r'$16$', r'$\tfrac83$'],
    [r'Schnittstellen $\pm 2$: $\int_{-2}^{2} (4 - x^2)\,dx$.',
     r'$= 16 - \tfrac{16}{3} = \tfrac{32}{3}$.'])

Q.q(r'Eine Münze wird $100$-mal geworfen. Wie groß ist die Standardabweichung der Anzahl der Wappen?',
    [r'$5$', r'$25$', r'$50$', r'$10$'],
    [r'$\sigma = \sqrt{n \cdot p \cdot (1 - p)} = \sqrt{100 \cdot 0{,}5 \cdot 0{,}5}$.',
     r'$= \sqrt{25} = 5$. $25$ ist die Varianz.'])

Q.q(r'Was ist ein Fehler 1. Art?',
    [r'$H_0$ wird abgelehnt, obwohl $H_0$ wahr ist.', r'$H_0$ wird angenommen, obwohl $H_0$ falsch ist.', r'Man rechnet mit dem falschen $n$.', r'Das Ergebnis liegt im Annahmebereich.'],
    [r'Der Test verwirft eine richtige Nullhypothese.',
     r'Seine Wahrscheinlichkeit ist höchstens das Signifikanzniveau.'])

Q.q(r'Für $F(x) = \int_0^x t^2\,dt$ gilt …',
    [r'$F^{\prime}(x) = x^2$', r'$F^{\prime}(x) = 2x$', r'$F^{\prime}(x) = \tfrac{x^3}{3}$', r'$F^{\prime}(x) = 0$'],
    [r'Hauptsatz: Die Integralfunktion ist eine Stammfunktion des Integranden.',
     r'$F(x) = \tfrac{x^3}{3}$, abgeleitet $x^2$.'])

Q.q(r'Was liefert das Trapezverfahren mit einem einzigen Trapez für $\int_0^2 x^2\,dx$?',
    [r'$4$', r'$\tfrac83$', r'$2$', r'$8$'],
    [r'$\tfrac{f(0) + f(2)}{2} \cdot 2 = \tfrac{0 + 4}{2} \cdot 2$.',
     r'$= 4$. Der exakte Wert ist $\tfrac83$: Bei einer nach oben gekrümmten Kurve liegt das Trapez zu hoch.'])

Q.q(r'Welcher Punkt der Geraden $y = x$ liegt dem Punkt $(4 \mid 0)$ am nächsten?',
    [r'$(2 \mid 2)$, Abstand $2\sqrt2$', r'$(4 \mid 4)$, Abstand $4$', r'$(0 \mid 0)$, Abstand $4$', r'$(1 \mid 1)$, Abstand $\sqrt{10}$'],
    [r'$d(x)^2 = (x - 4)^2 + x^2 = 2x^2 - 8x + 16$, Scheitel bei $x = 2$.',
     r'$d^2 = 8$, $d = 2\sqrt2$.'])


def check():
    a = lambda *c: np.array(c, dtype=float)
    x = sp.symbols('x')
    assert a(2, -1, 3) @ a(1, 4, 2) == 4 and abs(math.degrees(math.acos(0.5)) - 60) < 1e-9
    A, B, C, P = a(1, 0, 0), a(0, 1, 0), a(1, 1, 1), a(3, 2, 1)
    n = np.cross(B - A, C - A)
    assert (n == a(1, 1, -1)).all() and n @ A == n @ B == n @ C == 1
    d = abs(n @ P - 1) / np.linalg.norm(n)
    assert abs(d - math.sqrt(3)) < 1e-12
    assert abs(math.degrees(math.asin(1 / math.sqrt(3))) - 35.3) < 0.05 and abs(math.degrees(math.acos(1 / math.sqrt(3))) - 54.7) < 0.05
    F = P - (n @ P - 1) / (n @ n) * n
    assert np.allclose(F, a(2, 1, 2)) and np.allclose(2 * F - P, a(1, 0, 3))
    G = np.linalg.norm(n) / 2
    assert abs(G - math.sqrt(3) / 2) < 1e-12 and abs(G * d / 3 - 0.5) < 1e-12
    assert np.linalg.norm(a(1, 1, 0)) == math.sqrt(2) and a(1, 1, 0) @ a(1, -1, 0) == 0
    aa = sp.symbols('a')
    assert sp.expand((x**2 - aa * x + aa).subs(x, 1)) == 1
    assert sp.integrate(3 * x**2 - 2 * x, (x, 0, 2)) == 4 and sp.integrate(4 - x**2, (x, -2, 2)) == sp.Rational(32, 3)
    assert math.sqrt(100 * 0.25) == 5
    t = sp.symbols('t')
    assert sp.diff(sp.integrate(t**2, (t, 0, x)), x) == x**2
    assert (0 + 4) / 2 * 2 == 4 and sp.integrate(x**2, (x, 0, 2)) == sp.Rational(8, 3)
    assert sp.solve(sp.diff(2 * x**2 - 8 * x + 16, x), x) == [2] and 2 * 4 - 16 + 16 == 8


Q.verify(check)
Q.save()
