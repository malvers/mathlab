#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 25 (LB 8): einfache Funktionenscharen -
gemeinsame Punkte, Extrem- und Wendepunkte in Abhängigkeit vom Parameter, Ortskurven,
Parameter bestimmen. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12
import sympy as sp

Q = gy12(nr=25, slug='funktionenscharen', thema='Funktionenscharen', lb='LB 8',
         blurb='Gemeinsame Punkte, Extrema mit Parameter, Ortskurven, Parameter bestimmen',
         comment='Blocks: Scheitel und Ortskurven (1, 2, 13-15, 19), gemeinsame Punkte (3, 4, 16), Nullstellen und Extrema (5-8, 18, 20), Parameter bestimmen (9-12, 17). Ohne Hilfsmittel.')

Q.q(r'Wo liegt der Scheitelpunkt von $f_a(x) = x^2 - 2ax$?',
    [r'$(a \mid -a^2)$', r'$(-a \mid a^2)$', r'$(2a \mid 0)$', r'$(a \mid a^2)$'],
    [r'$f_a^{\prime}(x) = 2x - 2a = 0$ gibt $x = a$.',
     r'$f_a(a) = a^2 - 2a^2 = -a^2$.'])

Q.q(r'Auf welcher Kurve liegen die Scheitelpunkte $(a \mid -a^2)$ aus Aufgabe 1 für alle $a$?',
    [r'$y = -x^2$', r'$y = x^2$', r'$y = -2x$', r'$y = -x$'],
    [r'$x = a$ setzen, dann $y = -a^2 = -x^2$.',
     r'Diese Kurve heißt Ortskurve der Scheitelpunkte.'])

Q.q(r'Welchen Punkt haben alle Graphen von $f_a(x) = ax^2$ mit $a \neq 0$ gemeinsam?',
    [r'$(0 \mid 0)$', r'$(1 \mid 1)$', r'$(0 \mid 1)$', r'keinen'],
    [r'$f_a(0) = 0$ für jedes $a$.',
     r'Für $x \neq 0$ hängt $ax^2$ von $a$ ab; dort schneiden sich zwei Graphen nicht.'])

Q.q(r'Welche Punkte haben alle Graphen von $f_a(x) = a \cdot x \cdot (x - 2)$ mit $a \neq 0$ gemeinsam?',
    [r'$(0 \mid 0)$ und $(2 \mid 0)$', r'nur $(0 \mid 0)$', r'$(1 \mid -1)$', r'$(2 \mid 2)$'],
    [r'$f_a(x) = f_b(x)$ mit $a \neq b$ heißt $(a - b)\,x\,(x - 2) = 0$.',
     r'Also $x = 0$ oder $x = 2$: die gemeinsamen Nullstellen.'])

Q.q(r'Für welche $a$ hat $f_a(x) = x^3 - ax$ drei verschiedene Nullstellen?',
    [r'$a > 0$', r'$a < 0$', r'$a = 0$', r'für alle $a$'],
    [r'$x(x^2 - a) = 0$: $x = 0$ oder $x^2 = a$.',
     r'Zwei weitere Nullstellen $\pm\sqrt a$ gibt es nur für $a > 0$.'])

Q.q(r'Wo hat $f_a(x) = x^3 - 3ax$ mit $a > 0$ seine Extremstellen?',
    [r'$x = \pm\sqrt a$', r'$x = \pm a$', r'$x = \pm 3a$', r'$x = 0$'],
    [r'$f_a^{\prime}(x) = 3x^2 - 3a = 0$.',
     r'$x^2 = a$, also $x = \pm\sqrt a$.'])

Q.q(r'Wo hat $f_a(x) = e^x - ax$ mit $a > 0$ seinen Tiefpunkt?',
    [r'bei $x = \ln a$', r'bei $x = a$', r'bei $x = e^a$', r'bei $x = 0$'],
    [r'$f_a^{\prime}(x) = e^x - a = 0$ gibt $x = \ln a$.',
     r'$f_a^{\prime\prime}(x) = e^x > 0$: Tiefpunkt.'])

Q.q(r'Für welches $a$ hat $f_a(x) = x^2 - 4x + a$ genau eine Nullstelle?',
    [r'$a = 4$', r'$a = 0$', r'$a = 2$', r'$a = -4$'],
    [r'Diskriminante der $pq$-Formel: $4 - a = 0$.',
     r'$a = 4$: $f_4(x) = (x - 2)^2$ berührt die $x$-Achse.'])

Q.q(r'Welcher Graph der Schar $f_a(x) = ax^2 - 1$ geht durch $(2 \mid 3)$?',
    [r'$a = 1$', r'$a = 2$', r'$a = \tfrac12$', r'$a = 4$'],
    [r'$4a - 1 = 3$.',
     r'$a = 1$.'])

Q.q(r'Der Graph von $f_t(x) = tx - x^2$ mit $t > 0$ schließt mit der $x$-Achse die Fläche $\tfrac{t^3}{6}$ ein. Wie groß ist sie für $t = 3$?',
    [r'$4{,}5$', r'$9$', r'$27$', r'$1{,}5$'],
    [r'$\tfrac{27}{6}$.',
     r'$= 4{,}5$. Kontrolle: $\int_0^3 (3x - x^2)\,dx = 13{,}5 - 9$.'])

Q.q(r'Für welches $t$ ist die Fläche aus Aufgabe 10 genau $36$?',
    [r'$t = 6$', r'$t = 3$', r'$t = 216$', r'$t = 12$'],
    [r'$\tfrac{t^3}{6} = 36$, also $t^3 = 216$.',
     r'$t = 6$.'])

Q.q(r'Für welches $a$ hat $f_a(x) = x^2 - 2ax + 1$ an der Stelle $0$ die Steigung $4$?',
    [r'$a = -2$', r'$a = 2$', r'$a = 4$', r'$a = -4$'],
    [r'$f_a^{\prime}(x) = 2x - 2a$, also $f_a^{\prime}(0) = -2a$.',
     r'$-2a = 4$, $a = -2$.'])

Q.q(r'Wo liegt der Wendepunkt von $f_a(x) = x^3 - 3ax^2$?',
    [r'$(a \mid -2a^3)$', r'$(a \mid -a^3)$', r'$(3a \mid 0)$', r'$(0 \mid 0)$'],
    [r'$f_a^{\prime\prime}(x) = 6x - 6a = 0$ gibt $x = a$; $f_a^{\prime\prime\prime} = 6 \neq 0$.',
     r'$f_a(a) = a^3 - 3a^3 = -2a^3$.'])

Q.q(r'Auf welcher Kurve liegen die Wendepunkte aus Aufgabe 13?',
    [r'$y = -2x^3$', r'$y = -x^3$', r'$y = 2x^3$', r'$y = -2x^2$'],
    [r'$x = a$ einsetzen in $y = -2a^3$.',
     r'Ortskurve $y = -2x^3$.'])

Q.q(r'Was haben die Graphen von $f_a(x) = (x - a)^2$ gemeinsam?',
    [r'Es sind verschobene Normalparabeln mit dem Scheitel auf der $x$-Achse.', r'Sie gehen alle durch den Ursprung.', r'Sie sind alle gleich.', r'Sie haben alle den Scheitel $(0 \mid a)$.'],
    [r'Scheitelform mit dem Scheitel $(a \mid 0)$.',
     r'Der Parameter verschiebt die Normalparabel entlang der $x$-Achse.'])

Q.q(r'Welche Punkte haben zwei verschiedene Graphen von $f_a(x) = a \cdot e^{-x}$ gemeinsam?',
    [r'keinen', r'$(0 \mid 1)$', r'$(0 \mid 0)$', r'unendlich viele'],
    [r'$a e^{-x} = b e^{-x}$ mit $a \neq b$ hieße $(a - b)\,e^{-x} = 0$.',
     r'Das ist unmöglich, weil $e^{-x} > 0$ ist.'])

Q.q(r'Für welches $a$ berührt die Parabel $y = x^2 + a$ die Gerade $y = 2x$?',
    [r'$a = 1$', r'$a = 0$', r'$a = 2$', r'$a = -1$'],
    [r'$x^2 - 2x + a = 0$ muss genau eine Lösung haben.',
     r'Diskriminante $1 - a = 0$, $a = 1$; Berührpunkt $(1 \mid 2)$.'])

Q.q(r'Welche Nullstellen hat $f_k(x) = kx^3 - x$ für $k = 4$?',
    [r'$0$ und $\pm\tfrac12$', r'$0$ und $\pm 2$', r'$0$ und $\pm\tfrac14$', r'nur $0$'],
    [r'$x(kx^2 - 1) = 0$: $x = 0$ oder $x = \pm\tfrac{1}{\sqrt k}$.',
     r'Für $k = 4$: $\pm\tfrac12$.'])

Q.q(r'Wo liegt der Hochpunkt von $f_a(x) = -x^2 + 2ax$?',
    [r'$(a \mid a^2)$', r'$(a \mid -a^2)$', r'$(2a \mid 0)$', r'$(-a \mid a^2)$'],
    [r'$f_a^{\prime}(x) = -2x + 2a = 0$, $x = a$.',
     r'$f_a(a) = -a^2 + 2a^2 = a^2$. Ortskurve: $y = x^2$.'])

Q.q(r'Für welches $a$ liegt der Tiefpunkt von $f_a(x) = x^2 - ax$ bei $x = 3$?',
    [r'$a = 6$', r'$a = 3$', r'$a = 9$', r'$a = 1{,}5$'],
    [r'$f_a^{\prime}(x) = 2x - a = 0$ gibt $x = \tfrac a2$.',
     r'$\tfrac a2 = 3$, $a = 6$.'])


def check():
    x, a, b, t, k = sp.symbols('x a b t k', real=True)
    f = x**2 - 2 * a * x
    assert sp.solve(sp.diff(f, x), x) == [a] and sp.expand(f.subs(x, a)) == -a**2
    assert sp.factor(a * x * (x - 2) - b * x * (x - 2)) == sp.factor((a - b) * x * (x - 2))
    ap = sp.symbols('ap', positive=True)
    assert set(sp.solve(sp.diff(x**3 - 3 * ap * x, x), x)) == {sp.sqrt(ap), -sp.sqrt(ap)}
    assert sp.solve(sp.diff(sp.exp(x) - ap * x, x), x) == [sp.log(ap)]
    assert sp.discriminant(x**2 - 4 * x + 4, x) == 0 and sp.solve(4 * a - 1 - 3, a) == [1]
    tp = sp.symbols('tp', positive=True)
    assert sp.simplify(sp.integrate(tp * x - x**2, (x, 0, tp)) - tp**3 / 6) == 0
    assert sp.Rational(27, 6) == sp.Rational(9, 2) and sp.solve(tp**3 / 6 - 36, tp) == [6]
    assert sp.solve(sp.diff(x**2 - 2 * a * x + 1, x).subs(x, 0) - 4, a) == [-2]
    g = x**3 - 3 * a * x**2
    assert sp.solve(sp.diff(g, x, 2), x) == [a] and sp.expand(g.subs(x, a)) == -2 * a**3
    assert sp.discriminant(x**2 - 2 * x + 1, x) == 0
    assert set(sp.solve(4 * x**3 - x, x)) == {0, sp.Rational(1, 2), -sp.Rational(1, 2)}
    h = -x**2 + 2 * a * x
    assert sp.solve(sp.diff(h, x), x) == [a] and sp.expand(h.subs(x, a)) == a**2
    assert sp.solve(sp.diff(x**2 - a * x, x).subs(x, 3), a) == [6]


Q.verify(check)
Q.save()
