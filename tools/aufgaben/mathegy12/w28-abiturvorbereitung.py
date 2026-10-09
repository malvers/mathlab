#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 28: Generalprobe zum Abitur - ein
Querschnitt durch die Lernbereiche der Jahrgangsstufen 11 und 12 im Stil des
hilfsmittelfreien Teils. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12, vec
import numpy as np
import sympy as sp
import math
from math import comb

Q = gy12(nr=28, slug='abiturvorbereitung', thema='Generalprobe Abitur', lb='Abitur',
         blurb='Querschnitt durch Analysis, Integral, Stochastik und Geometrie',
         comment='Blocks: Ableiten und Kurven (1-8, 20), Integral (9-11), Stochastik (12-14), Vektoren, Geraden, Ebenen (15, 16, 18, 19), Gleichungssysteme (17). Ohne Hilfsmittel.')

Q.q(r'Gegeben ist $f(x) = x^3 - 2x$. Berechne $f^{\prime}(2)$.',
    [r'$10$', r'$4$', r'$12$', r'$8$'],
    [r'$f^{\prime}(x) = 3x^2 - 2$.',
     r'$f^{\prime}(2) = 12 - 2 = 10$.'])

Q.q(r'Leite $f(x) = e^{2x}$ ab.',
    [r'$f^{\prime}(x) = 2e^{2x}$', r'$f^{\prime}(x) = e^{2x}$', r'$f^{\prime}(x) = 2x\,e^{2x - 1}$', r'$f^{\prime}(x) = e^{2}$'],
    [r'Kettenregel: äußere Ableitung $e^{2x}$, innere Ableitung $2$.',
     r'$f^{\prime}(x) = 2e^{2x}$.'])

Q.q(r'Leite $f(x) = x \cdot e^x$ ab.',
    [r'$f^{\prime}(x) = (1 + x)\,e^x$', r'$f^{\prime}(x) = e^x$', r'$f^{\prime}(x) = x\,e^x$', r'$f^{\prime}(x) = 1 \cdot e^x$'],
    [r'Produktregel: $1 \cdot e^x + x \cdot e^x$.',
     r'$= (1 + x)\,e^x$.'])

Q.q(r'Wo hat $f(x) = x^3 - 3x$ seinen Hochpunkt?',
    [r'$(-1 \mid 2)$', r'$(1 \mid -2)$', r'$(0 \mid 0)$', r'$(\sqrt3 \mid 0)$'],
    [r'$f^{\prime}(x) = 3x^2 - 3 = 0$ gibt $x = \pm 1$; $f^{\prime\prime}(x) = 6x$.',
     r'$f^{\prime\prime}(-1) = -6 < 0$: Hochpunkt $(-1 \mid 2)$.'])

Q.q(r'Wo hat $f(x) = x^3 - 6x^2$ seine Wendestelle?',
    [r'$x = 2$', r'$x = 0$', r'$x = 4$', r'$x = 6$'],
    [r'$f^{\prime\prime}(x) = 6x - 12 = 0$.',
     r'$x = 2$; $f^{\prime\prime\prime} = 6 \neq 0$.'])

Q.q(r'Wie lautet die Tangente an $f(x) = x^2$ im Punkt $(1 \mid 1)$?',
    [r'$y = 2x - 1$', r'$y = 2x + 1$', r'$y = x$', r'$y = 2x$'],
    [r'Steigung $f^{\prime}(1) = 2$.',
     r'$y = 2(x - 1) + 1 = 2x - 1$.'])

Q.q(r'Berechne $\lim\limits_{x \to \infty} \dfrac{2x^2 + 1}{x^2 - 3}$.',
    [r'$2$', r'$\infty$', r'$0$', r'$-\tfrac13$'],
    [r'Zähler und Nenner durch $x^2$ teilen: $\dfrac{2 + \frac{1}{x^2}}{1 - \frac{3}{x^2}}$.',
     r'Für $x \to \infty$: $\tfrac21 = 2$. Gleicher Grad: Quotient der Leitkoeffizienten.'])

Q.q(r'Eine Parabel geht durch den Ursprung und hat den Scheitel $(2 \mid 4)$. Wie lautet ihre Gleichung?',
    [r'$f(x) = -x^2 + 4x$', r'$f(x) = x^2 - 4x$', r'$f(x) = -(x + 2)^2 + 4$', r'$f(x) = x^2 + 4$'],
    [r'Scheitelform $f(x) = a(x - 2)^2 + 4$ mit $f(0) = 4a + 4 = 0$.',
     r'$a = -1$: $f(x) = -(x - 2)^2 + 4 = -x^2 + 4x$.'])

Q.q(r'Berechne $\int_1^e \dfrac1x\,dx$.',
    [r'$1$', r'$e - 1$', r'$0$', r'$e$'],
    [r'$\left[\ln x\right]_1^e = \ln e - \ln 1$.',
     r'$= 1 - 0 = 1$.'])

Q.q(r'Wie groß ist die Fläche zwischen dem Graphen von $f(x) = x - x^3$ und der $x$-Achse über $[0;\ 1]$?',
    [r'$\tfrac14$', r'$\tfrac12$', r'$\tfrac34$', r'$0$'],
    [r'$f \geq 0$ auf $[0;\ 1]$: $\int_0^1 (x - x^3)\,dx$.',
     r'$= \tfrac12 - \tfrac14 = \tfrac14$.'])

Q.q(r'In einen Tank fließt Wasser mit der Rate $r(t) = 2t$ (Liter pro Minute). Wie viel fließt in den ersten $3$ Minuten zu?',
    [r'$9$ l', r'$6$ l', r'$18$ l', r'$3$ l'],
    [r'Zufluss $= \int_0^3 2t\,dt = [t^2]_0^3$.',
     r'$= 9$ l. $6$ wäre nur die Rate am Ende.'])

Q.q(r'Eine faire Münze wird dreimal geworfen. Wie groß ist die Wahrscheinlichkeit, nie Wappen zu werfen?',
    [r'$\tfrac18$', r'$\tfrac38$', r'$\tfrac12$', r'$0$'],
    [r'$P(X = 0) = 0{,}5^3$.',
     r'$= \tfrac18$.'])

Q.q(r'$X$ ist binomialverteilt mit $n = 50$ und $p = 0{,}2$. Wie groß ist der Erwartungswert?',
    [r'$10$', r'$8$', r'$2$', r'$25$'],
    [r'$E(X) = n \cdot p$.',
     r'$= 50 \cdot 0{,}2 = 10$.'])

Q.q(r'Was ist ein Fehler 2. Art?',
    [r'$H_0$ wird angenommen, obwohl $H_0$ falsch ist.', r'$H_0$ wird abgelehnt, obwohl $H_0$ wahr ist.', r'Man wählt das Signifikanzniveau zu groß.', r'Man testet zweiseitig statt einseitig.'],
    [r'Der Test erkennt eine falsche Nullhypothese nicht.',
     r'Seine Wahrscheinlichkeit hängt vom wahren Wert von $p$ ab.'])

Q.q(r'Wie lang ist der Vektor $' + vec(2, -1, 2) + r'$?',
    [r'$3$', r'$9$', r'$5$', r'$\sqrt5$'],
    [r'$\sqrt{4 + 1 + 4} = \sqrt9$.',
     r'$= 3$.'])

Q.q(r'Die Richtungsvektoren zweier Geraden sind nicht parallel, und die Geraden haben keinen Schnittpunkt. Wie liegen sie zueinander?',
    [r'windschief', r'parallel', r'identisch', r'Sie schneiden sich senkrecht.'],
    [r'Parallel oder identisch scheidet aus, weil die Richtungen verschieden sind.',
     r'Ohne Schnittpunkt bleibt nur windschief.'])

Q.q(r'Löse das Gleichungssystem $x + y = 3$, $x - y = 1$.',
    [r'$x = 2$, $y = 1$', r'$x = 1$, $y = 2$', r'$x = 3$, $y = 0$', r'keine Lösung'],
    [r'Addieren: $2x = 4$, $x = 2$.',
     r'Einsetzen: $y = 1$.'])

Q.q(r'Wie weit ist der Ursprung von der Ebene $2x + y + 2z = 6$ entfernt?',
    [r'$2$', r'$6$', r'$3$', r'$1$'],
    [r'$\dfrac{|0 - 6|}{\sqrt{4 + 1 + 4}}$.',
     r'$= \tfrac63 = 2$.'])

Q.q(r'Welchen Winkel schließen $' + vec(1, 0, 1) + r'$ und $' + vec(0, 1, 1) + r'$ ein?',
    [r'$60^\circ$', r'$90^\circ$', r'$45^\circ$', r'$30^\circ$'],
    [r'Skalarprodukt $1$, Beträge je $\sqrt2$.',
     r'$\cos\varphi = \tfrac12$, also $60^\circ$.'])

Q.q(r'Das Newton-Verfahren für $f(x) = x^2 - 2$ startet bei $x_0 = 1$. Welchen Wert liefert der erste Schritt?',
    [r'$x_1 = 1{,}5$', r'$x_1 = 2$', r'$x_1 = 1{,}41$', r'$x_1 = 0{,}5$'],
    [r'$x_1 = x_0 - \dfrac{f(x_0)}{f^{\prime}(x_0)} = 1 - \dfrac{-1}{2}$.',
     r'$= 1{,}5$, schon nah an $\sqrt2 \approx 1{,}414$.'])


def check():
    x, t = sp.symbols('x t')
    f = x**3 - 2 * x
    assert sp.diff(f, x).subs(x, 2) == 10
    assert sp.diff(sp.exp(2 * x), x) == 2 * sp.exp(2 * x) and sp.simplify(sp.diff(x * sp.exp(x), x) - (1 + x) * sp.exp(x)) == 0
    g = x**3 - 3 * x
    assert sp.diff(g, x, 2).subs(x, -1) < 0 and g.subs(x, -1) == 2
    assert sp.solve(sp.diff(x**3 - 6 * x**2, x, 2), x) == [2]
    assert sp.limit((2 * x**2 + 1) / (x**2 - 3), x, sp.oo) == 2
    p = -x**2 + 4 * x
    assert p.subs(x, 0) == 0 and p.subs(x, 2) == 4 and sp.diff(p, x).subs(x, 2) == 0
    assert sp.integrate(1 / x, (x, 1, sp.E)) == 1 and sp.integrate(x - x**3, (x, 0, 1)) == sp.Rational(1, 4)
    assert sp.integrate(2 * t, (t, 0, 3)) == 9
    assert comb(3, 0) * 0.5**3 == 0.125 and 50 * 0.2 == 10
    a = lambda *c: np.array(c, dtype=float)
    assert np.linalg.norm(a(2, -1, 2)) == 3
    assert np.allclose(np.linalg.solve([[1, 1], [1, -1]], [3, 1]), [2, 1])
    assert abs(0 - 6) / 3 == 2 and abs(math.degrees(math.acos((a(1, 0, 1) @ a(0, 1, 1)) / 2)) - 60) < 1e-9
    assert 1 - (1 - 2) / 2 == 1.5


Q.verify(check)
Q.save()
