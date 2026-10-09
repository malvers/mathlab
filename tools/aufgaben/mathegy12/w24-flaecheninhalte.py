#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 24 (LB 8): Inhalte begrenzter Flächen -
elementargeometrisch, mit dem Vektorprodukt und mit der Integralrechnung.
Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12, vec
import numpy as np
import sympy as sp
import math

Q = gy12(nr=24, slug='flaecheninhalte', thema='Flächeninhalte auf drei Wegen', lb='LB 8',
         blurb='Elementargeometrisch, mit dem Vektorprodukt und mit Integralen',
         comment='Blocks: Vektorprodukt (1-3, 9-11, 14-16, 18, 20), Integral (5-7, 12, 13, 17, 19), elementargeometrisch und Körper (4, 8). Ohne Hilfsmittel.')

Q.q(r'Wie groß ist das Dreieck $A(1 \mid 0 \mid 0)$, $B(0 \mid 1 \mid 0)$, $C(0 \mid 0 \mid 1)$?',
    [r'$\tfrac{\sqrt3}{2} \approx 0{,}87$', r'$\sqrt3 \approx 1{,}73$', r'$\tfrac12$', r'$1$'],
    [r'$\vec{AB} \times \vec{AC} = (-1;\ 1;\ 0) \times (-1;\ 0;\ 1) = (1;\ 1;\ 1)$.',
     r'$A = \tfrac12 \sqrt3$. $\sqrt3$ wäre das Parallelogramm.'])

Q.q(r'Wie groß ist das Parallelogramm, das $' + vec(2, 0, 0) + r'$ und $' + vec(1, 3, 0) + r'$ aufspannen?',
    [r'$6$', r'$3$', r'$2$', r'$\sqrt{10} \cdot 2$'],
    [r'$\vec a \times \vec b = (0;\ 0;\ 6)$.',
     r'Kontrolle: Grundseite $2$, Höhe $3$.'])

Q.q(r'Welche Formel liefert den Flächeninhalt eines Dreiecks $ABC$ mit dem Winkel $\alpha$ bei $A$?',
    [r'$\tfrac12 \cdot |\vec{AB}| \cdot |\vec{AC}| \cdot \sin\alpha$', r'$|\vec{AB}| \cdot |\vec{AC}| \cdot \cos\alpha$', r'$\tfrac12 \cdot \vec{AB} \cdot \vec{AC}$', r'$|\vec{AB}| + |\vec{AC}|$'],
    [r'Grundseite $|\vec{AB}|$, Höhe $|\vec{AC}| \sin\alpha$.',
     r'Das ist genau $\tfrac12 |\vec{AB} \times \vec{AC}|$.'])

Q.q(r'Wie groß ist die Fläche zwischen dem Graphen von $f(x) = x + 1$ und der $x$-Achse über $[0;\ 2]$?',
    [r'$4$', r'$2$', r'$3$', r'$6$'],
    [r'Elementargeometrisch: ein Trapez mit den parallelen Seiten $f(0) = 1$ und $f(2) = 3$, Höhe $2$.',
     r'$A = \tfrac{1 + 3}{2} \cdot 2 = 4$. Mit dem Integral: $\left[\tfrac{x^2}{2} + x\right]_0^2 = 4$.'])

Q.q(r'Wie groß ist die Fläche unter $f(x) = x^2$ über $[0;\ 3]$?',
    [r'$9$', r'$27$', r'$3$', r'$6$'],
    [r'$\int_0^3 x^2\,dx = \left[\tfrac{x^3}{3}\right]_0^3$.',
     r'$= \tfrac{27}{3} = 9$.'])

Q.q(r'Wie groß ist die Fläche zwischen $f(x) = x$ und $g(x) = x^2$ über $[0;\ 1]$?',
    [r'$\tfrac16$', r'$\tfrac12$', r'$\tfrac13$', r'$\tfrac56$'],
    [r'Auf $[0;\ 1]$ liegt $x$ über $x^2$: $\int_0^1 (x - x^2)\,dx$.',
     r'$= \tfrac12 - \tfrac13 = \tfrac16$.'])

Q.q(r'Wie groß ist die Fläche unter einem Bogen der Sinuskurve, über $[0;\ \pi]$?',
    [r'$2$', r'$0$', r'$1$', r'$\pi$'],
    [r'$\int_0^\pi \sin x\,dx = [-\cos x]_0^\pi$.',
     r'$= 1 - (-1) = 2$.'])

Q.q(r'Eine Pyramide hat die Grundfläche $O$, $(4 \mid 0 \mid 0)$, $(0 \mid 4 \mid 0)$ und die Spitze $(0 \mid 0 \mid 6)$. Welches Volumen hat sie?',
    [r'$16$', r'$48$', r'$32$', r'$8$'],
    [r'Grundfläche: rechtwinkliges Dreieck, $\tfrac12 \cdot 4 \cdot 4 = 8$; Höhe $6$.',
     r'$V = \tfrac13 \cdot 8 \cdot 6 = 16$.'])

Q.q(r'Wie groß ist das Dreieck $A(1 \mid 1 \mid 1)$, $B(3 \mid 1 \mid 1)$, $C(1 \mid 4 \mid 1)$?',
    [r'$3$', r'$6$', r'$\sqrt{13}$', r'$5$'],
    [r'$\vec{AB} = (2;\ 0;\ 0)$, $\vec{AC} = (0;\ 3;\ 0)$, Kreuzprodukt $(0;\ 0;\ 6)$.',
     r'$A = 3$: ein rechtwinkliges Dreieck mit den Katheten $2$ und $3$.'])

Q.q(r'Das Rechteck $ABCD$ hat $A(0 \mid 0 \mid 0)$, $B(3 \mid 0 \mid 0)$ und $D(0 \mid 4 \mid 5)$. Wie groß ist es?',
    [r'$3\sqrt{41} \approx 19{,}21$', r'$60$', r'$12$', r'$\sqrt{50} \approx 7{,}07$'],
    [r'$\vec{AB} \cdot \vec{AD} = 0$: rechter Winkel, Seiten $3$ und $\sqrt{16 + 25} = \sqrt{41}$.',
     r'$A = 3\sqrt{41}$.'])

Q.q(r'Die Ebene $2x + 3y + 6z = 12$ hat die Spurpunkte $(6 \mid 0 \mid 0)$, $(0 \mid 4 \mid 0)$, $(0 \mid 0 \mid 2)$. Wie groß ist das Spurdreieck?',
    [r'$14$', r'$28$', r'$12$', r'$24$'],
    [r'$(-6;\ 4;\ 0) \times (-6;\ 0;\ 2) = (8;\ 12;\ 24)$ mit Betrag $\sqrt{784} = 28$.',
     r'$A = 14$.'])

Q.q(r'Wie groß ist die Fläche zwischen der Parabel $f(x) = 4 - x^2$ und der $x$-Achse?',
    [r'$\tfrac{32}{3} \approx 10{,}67$', r'$\tfrac{16}{3} \approx 5{,}33$', r'$8$', r'$16$'],
    [r'Nullstellen $\pm 2$: $\int_{-2}^{2} (4 - x^2)\,dx = \left[4x - \tfrac{x^3}{3}\right]_{-2}^{2}$.',
     r'$= \left(8 - \tfrac83\right) - \left(-8 + \tfrac83\right) = \tfrac{32}{3}$.'])

Q.q(r'Wie groß ist die Fläche zwischen dem Graphen von $f(x) = x^3$ und der $x$-Achse über $[-1;\ 1]$?',
    [r'$\tfrac12$', r'$0$', r'$\tfrac14$', r'$1$'],
    [r'$\int_{-1}^{1} x^3\,dx = 0$, weil sich die Teilflächen aufheben.',
     r'Fläche: $2 \cdot \int_0^1 x^3\,dx = 2 \cdot \tfrac14 = \tfrac12$.'])

Q.q(r'Wie groß ist das Dreieck mit den Ecken $(0 \mid 0)$, $(4 \mid 1)$, $(1 \mid 3)$ in der Ebene?',
    [r'$5{,}5$', r'$11$', r'$6$', r'$6{,}5$'],
    [r'Als Raumvektoren mit $z = 0$: $(4;\ 1;\ 0) \times (1;\ 3;\ 0) = (0;\ 0;\ 11)$.',
     r'$A = \tfrac{11}{2} = 5{,}5$.'])

Q.q(r'Wie groß ist die gesamte Oberfläche des Tetraeders mit den Ecken $O$, $(1 \mid 0 \mid 0)$, $(0 \mid 1 \mid 0)$, $(0 \mid 0 \mid 1)$?',
    [r'$\tfrac32 + \tfrac{\sqrt3}{2} \approx 2{,}37$', r'$2$', r'$\tfrac{\sqrt3}{2} \approx 0{,}87$', r'$2\sqrt3 \approx 3{,}46$'],
    [r'Drei rechtwinklige Dreiecke mit je $\tfrac12$ in den Koordinatenebenen.',
     r'Dazu das schräge Dreieck aus Aufgabe 1: $\tfrac{\sqrt3}{2}$.'])

Q.q(r'Das Dreieck $A(1 \mid 0 \mid 0)$, $B(0 \mid 1 \mid 0)$, $C(0 \mid 0 \mid 1)$ hat den Inhalt $\tfrac{\sqrt3}{2}$. Wie lang ist seine Höhe auf $AB$?',
    [r'$\tfrac{\sqrt6}{2} \approx 1{,}22$', r'$\tfrac{\sqrt3}{2} \approx 0{,}87$', r'$\sqrt2 \approx 1{,}41$', r'$1$'],
    [r'$|\vec{AB}| = \sqrt2$, $A = \tfrac12 \cdot \sqrt2 \cdot h$.',
     r'$h = \tfrac{\sqrt3}{\sqrt2} = \tfrac{\sqrt6}{2}$.'])

Q.q(r'Wie groß ist die Fläche zwischen $f(x) = x^2$ und $g(x) = 2x$?',
    [r'$\tfrac43$', r'$\tfrac83$', r'$4$', r'$\tfrac23$'],
    [r'Schnittstellen $0$ und $2$; dazwischen liegt $2x$ oben.',
     r'$\int_0^2 (2x - x^2)\,dx = 4 - \tfrac83 = \tfrac43$.'])

Q.q(r'Das Parallelogramm $ABCD$ hat $A(1 \mid 0 \mid 2)$, $B(3 \mid 1 \mid 2)$, $D(1 \mid 2 \mid 4)$. Wie groß ist es?',
    [r'$6$', r'$3$', r'$36$', r'$\sqrt{20}$'],
    [r'$\vec{AB} \times \vec{AD} = (2;\ 1;\ 0) \times (0;\ 2;\ 2) = (2;\ -4;\ 4)$.',
     r'Betrag $\sqrt{4 + 16 + 16} = 6$.'])

Q.q(r'Wie groß ist die Fläche unter $f(x) = e^x$ über $[0;\ 1]$?',
    [r'$e - 1 \approx 1{,}72$', r'$e \approx 2{,}72$', r'$1$', r'$\tfrac{e}{2} \approx 1{,}36$'],
    [r'$\int_0^1 e^x\,dx = [e^x]_0^1$.',
     r'$= e - 1$.'])

Q.q(r'Ein Dreieck hat zwei Seiten der Längen $4$ und $5$, die $30^\circ$ einschließen. Wie groß ist es?',
    [r'$5$', r'$10$', r'$5\sqrt3 \approx 8{,}66$', r'$20$'],
    [r'$A = \tfrac12 \cdot 4 \cdot 5 \cdot \sin 30^\circ$.',
     r'$= 10 \cdot \tfrac12 = 5$. Mit dem Kosinus käme fälschlich $5\sqrt3$ heraus.'])


def check():
    a = lambda *c: np.array(c, dtype=float)
    tri = lambda A, B, C: np.linalg.norm(np.cross(a(*B) - a(*A), a(*C) - a(*A))) / 2
    x = sp.symbols('x')
    assert abs(tri((1, 0, 0), (0, 1, 0), (0, 0, 1)) - math.sqrt(3) / 2) < 1e-12
    assert np.linalg.norm(np.cross(a(2, 0, 0), a(1, 3, 0))) == 6
    assert sp.integrate(x + 1, (x, 0, 2)) == 4 and sp.integrate(x**2, (x, 0, 3)) == 9
    assert sp.integrate(x - x**2, (x, 0, 1)) == sp.Rational(1, 6) and sp.integrate(sp.sin(x), (x, 0, sp.pi)) == 2
    assert sp.Rational(1, 3) * 8 * 6 == 16 and tri((1, 1, 1), (3, 1, 1), (1, 4, 1)) == 3
    assert a(3, 0, 0) @ a(0, 4, 5) == 0 and abs(np.linalg.norm(np.cross(a(3, 0, 0), a(0, 4, 5))) - 19.21) < 0.005
    assert (np.cross(a(-6, 4, 0), a(-6, 0, 2)) == a(8, 12, 24)).all() and tri((6, 0, 0), (0, 4, 0), (0, 0, 2)) == 14
    assert sp.integrate(4 - x**2, (x, -2, 2)) == sp.Rational(32, 3) and sp.integrate(sp.Abs(x**3), (x, -1, 1)) == sp.Rational(1, 2)
    assert tri((0, 0, 0), (4, 1, 0), (1, 3, 0)) == 5.5
    S = 1.5 + tri((1, 0, 0), (0, 1, 0), (0, 0, 1))
    assert abs(S - 2.37) < 0.005 and abs(2 * (math.sqrt(3) / 2) / math.sqrt(2) - math.sqrt(6) / 2) < 1e-12
    assert sp.integrate(2 * x - x**2, (x, 0, 2)) == sp.Rational(4, 3)
    assert np.linalg.norm(np.cross(a(2, 1, 0), a(0, 2, 2))) == 6 and abs(math.e - 1 - 1.72) < 0.005
    assert abs(0.5 * 4 * 5 * math.sin(math.radians(30)) - 5) < 1e-12


Q.verify(check)
Q.save()
