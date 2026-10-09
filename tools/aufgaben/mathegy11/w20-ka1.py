#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 20 / KW 3: review for Klausur 11/I (LB 1 differential
calculus, LB 2 matrices). Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11, vec


def mat(*rows):
    """Matrix as LaTeX pmatrix: mat((1, 2), (3, 4))."""
    return r'\begin{pmatrix} ' + r' \\ '.join(' & '.join(str(v) for v in r) for r in rows) + r' \end{pmatrix}'


Q = gy11(nr=20, slug='ka1', thema='Klausur 11/I: Differentialrechnung und Matrizen', lb='KL 11/I',
         blurb='gemischte Aufgaben zu LB 1 und LB 2 zur Klausurvorbereitung',
         comment='Blocks: limits and rates (1-4), derivatives (5-9), investigating functions (10-14), conditions and optimisation (15-17), matrices (18-20).')

# ---------------------------------------------------------- limits and rates ----
Q.q(r'Bestimme $\lim\limits_{x \to \infty} \dfrac{4x^2 - x}{2x^2 + 3}$.',
    [r'2', r'4', r'0', r'$\infty$'],
    [r'Gleicher Grad: Quotient der Leitkoeffizienten.',
     r'$\dfrac{4}{2} = 2$'])

Q.q(r'Bestimme $\lim\limits_{x \to 5} \dfrac{x^2 - 25}{x - 5}$.',
    [r'10', r'0', r'5', r'Der Grenzwert existiert nicht.'],
    [r'$\dfrac{(x - 5)(x + 5)}{x - 5} = x + 5$ für $x \neq 5$',
     r'Grenzwert $5 + 5 = 10$'])

Q.q(r'Bestimme die mittlere Änderungsrate von $f(x) = x^2 + 1$ im Intervall $[1;\,4]$.',
    [r'5', r'15', r'3', r'8'],
    [r'$f(4) = 17$, $f(1) = 2$',
     r'$\dfrac{17 - 2}{4 - 1} = 5$'])

Q.q(r'Was gibt $f^{\prime}(x_0)$ geometrisch an?',
    [r'Den Anstieg der Tangente an den Graphen im Punkt $(x_0 \mid f(x_0))$.', r'Den Funktionswert an der Stelle $x_0$.',
     r'Den Anstieg einer Sekante.', r'Die Krümmung des Graphen.'],
    [r'Der Differentialquotient ist der Grenzwert der Sekantenanstiege.'])

# --------------------------------------------------------------- derivatives ----
Q.q(r'Bestimme die Ableitung von $f(x) = 4x^3 - \dfrac{2}{x} + \sqrt{x}$.',
    [r'$f^{\prime}(x) = 12x^2 + \dfrac{2}{x^2} + \dfrac{1}{2\sqrt{x}}$', r'$f^{\prime}(x) = 12x^2 - \dfrac{2}{x^2} + \dfrac{1}{2\sqrt{x}}$',
     r'$f^{\prime}(x) = 12x^2 + \dfrac{2}{x^2} + 2\sqrt{x}$', r'$f^{\prime}(x) = 12x^2 + 2\ln x + \dfrac{1}{2\sqrt{x}}$'],
    [r'$-\dfrac{2}{x} = -2x^{-1}$, abgeleitet $2x^{-2}$.',
     r'$\sqrt{x} = x^{\frac{1}{2}}$, abgeleitet $\dfrac{1}{2\sqrt{x}}$.'])

Q.q(r'Bestimme die Ableitung von $f(x) = x^2 e^x$.',
    [r'$f^{\prime}(x) = (x^2 + 2x)e^x$', r'$f^{\prime}(x) = 2x e^x$', r'$f^{\prime}(x) = x^2 e^x$', r'$f^{\prime}(x) = 2x e^{x-1}$'],
    [r'Produktregel: $2x \cdot e^x + x^2 \cdot e^x$.'])

Q.q(r'Bestimme die Ableitung von $f(x) = \sin(3x - 1)$.',
    [r'$f^{\prime}(x) = 3\cos(3x - 1)$', r'$f^{\prime}(x) = \cos(3x - 1)$', r'$f^{\prime}(x) = -3\cos(3x - 1)$', r'$f^{\prime}(x) = 3\sin(3x - 1)$'],
    [r'Kettenregel: äußere Ableitung $\cos(3x - 1)$ mal innere Ableitung 3.'])

Q.q(r'Bestimme die Ableitung von $f(x) = \ln(2x + 1)$.',
    [r'$f^{\prime}(x) = \dfrac{2}{2x + 1}$', r'$f^{\prime}(x) = \dfrac{1}{2x + 1}$', r'$f^{\prime}(x) = \dfrac{1}{2x}$', r'$f^{\prime}(x) = 2\ln(2x + 1)$'],
    [r'$\dfrac{1}{2x + 1} \cdot 2$'])

Q.q(r'Wie lautet die Tangente an $f(x) = x^2 - 3x$ an der Stelle $x_0 = 2$?',
    [r'$y = x - 4$', r'$y = x - 2$', r'$y = -2x + 2$', r'$y = 2x - 6$'],
    [r'$f(2) = 4 - 6 = -2$; $f^{\prime}(x) = 2x - 3$, $f^{\prime}(2) = 1$',
     r'$y = 1 \cdot (x - 2) - 2 = x - 4$'])

# ----------------------------------------------------- investigating functions ----
Q.q(r'Bestimme die Extrempunkte von $f(x) = x^3 - 6x^2 + 9x$.',
    [r'$H(1 \mid 4)$ und $T(3 \mid 0)$', r'$H(3 \mid 0)$ und $T(1 \mid 4)$', r'$H(1 \mid 4)$ und $T(3 \mid 4)$', r'$H(0 \mid 0)$ und $T(3 \mid 0)$'],
    [r'$f^{\prime}(x) = 3x^2 - 12x + 9 = 3(x - 1)(x - 3)$',
     r'$f^{\prime\prime}(x) = 6x - 12$: $f^{\prime\prime}(1) = -6$ (Hochpunkt), $f^{\prime\prime}(3) = 6$ (Tiefpunkt).',
     r'$f(1) = 4$, $f(3) = 27 - 54 + 27 = 0$'])

Q.q(r'Bestimme den Wendepunkt von $f(x) = x^3 - 6x^2 + 9x$.',
    [r'$W(2 \mid 2)$', r'$W(2 \mid 0)$', r'$W(1 \mid 4)$', r'$W(0 \mid 0)$'],
    [r'$f^{\prime\prime}(x) = 6x - 12 = 0 \Rightarrow x = 2$',
     r'$f(2) = 8 - 24 + 18 = 2$'])

Q.q(r'Welche Asymptoten hat $f(x) = \dfrac{3x}{x + 2}$?',
    [r'$x = -2$ und $y = 3$', r'$x = 2$ und $y = 3$', r'$x = -2$ und $y = 0$', r'$x = 0$ und $y = 3$'],
    [r'Polstelle: Nenner null bei $x = -2$.',
     r'Gleicher Grad: $y = \dfrac{3}{1} = 3$.'])

Q.q(r'Welche Symmetrie hat der Graph von $f(x) = x^5 - 4x^3 + x$?',
    [r'Punktsymmetrie zum Ursprung', r'Achsensymmetrie zur $y$-Achse', r'Keine', r'Beide'],
    [r'Nur ungerade Exponenten: $f(-x) = -f(x)$.'])

Q.q(r'$f^{\prime}$ hat bei $x = 2$ eine Nullstelle mit Vorzeichenwechsel von plus nach minus. Was gilt für $f$?',
    [r'$f$ hat bei $x = 2$ einen Hochpunkt.', r'$f$ hat bei $x = 2$ einen Tiefpunkt.', r'$f$ hat bei $x = 2$ einen Wendepunkt.', r'$f$ hat bei $x = 2$ eine Nullstelle.'],
    [r'Vorher steigt $f$, danach fällt $f$.'])

# -------------------------------------------- conditions and optimisation ----
Q.q(r'Eine Parabel geht durch $(0 \mid 1)$ und hat den Scheitel bei $(1 \mid -1)$. Wie lautet sie?',
    [r'$f(x) = 2x^2 - 4x + 1$', r'$f(x) = x^2 - 2x + 1$', r'$f(x) = -2x^2 + 4x + 1$', r'$f(x) = 2x^2 + 4x + 1$'],
    [r'$f(x) = a(x - 1)^2 - 1$ mit $f(0) = a - 1 = 1$, also $a = 2$.',
     r'$2(x^2 - 2x + 1) - 1 = 2x^2 - 4x + 1$'])

Q.q(r'$f(x) = ax^3 + bx$ hat den Tiefpunkt $T(1 \mid -2)$. Bestimme $a$ und $b$.',
    [r'$a = 1$, $b = -3$', r'$a = -1$, $b = 3$', r'$a = 1$, $b = 3$', r'$a = 2$, $b = -4$'],
    [r'$f(1) = a + b = -2$, $f^{\prime}(1) = 3a + b = 0$',
     r'$2a = 2 \Rightarrow a = 1$, $b = -3$'])

Q.q(r'Ein Rechteck hat den Umfang 36 cm. Wie groß ist sein Flächeninhalt höchstens?',
    [r'81 cm²', r'36 cm²', r'72 cm²', r'324 cm²'],
    [r'$y = 18 - x$, $A(x) = x(18 - x)$',
     r'$A^{\prime}(x) = 18 - 2x = 0 \Rightarrow x = 9$; $A = 81$ cm²'])

# --------------------------------------------------------------- matrices ----
Q.q(r'Berechne $' + mat((1, -2), (3, 0)) + r' \cdot ' + vec(2, 1) + '$.',
    [r'$' + vec(0, 6) + '$', r'$' + vec(4, 6) + '$', r'$' + vec(2, 3) + '$', r'$' + vec(0, 3) + '$'],
    [r'$1 \cdot 2 + (-2) \cdot 1 = 0$',
     r'$3 \cdot 2 + 0 \cdot 1 = 6$'])

Q.q(r'Löse $x + y + z = 4$, $y - z = 1$, $2z = 2$.',
    [r'$x = 1$, $y = 2$, $z = 1$', r'$x = 2$, $y = 1$, $z = 1$', r'$x = 1$, $y = 1$, $z = 2$', r'$x = 0$, $y = 3$, $z = 1$'],
    [r'$z = 1$, dann $y = 1 + 1 = 2$.',
     r'$x = 4 - 2 - 1 = 1$'])

Q.q(r'Nach den Umformungen steht in einem 3×3-System die Zeile $(0 \;\; 0 \;\; 0 \mid 0)$, die anderen beiden Zeilen sind widerspruchsfrei. Was folgt?',
    [r'Das System hat unendlich viele Lösungen.', r'Das System hat keine Lösung.', r'Das System hat genau eine Lösung.', r'Alle Unbekannten sind null.'],
    [r'Die Zeile $0 = 0$ ist immer wahr und liefert keine Information.',
     r'Es bleiben zwei Gleichungen für drei Unbekannte: eine Unbekannte ist frei.'])


def check():
    import sympy as sp
    x, a, b = sp.symbols('x a b', real=True)
    d = lambda e, n=1: sp.diff(e, x, n)
    eq = lambda u, v: sp.simplify(u - v) == 0
    assert sp.limit((4 * x ** 2 - x) / (2 * x ** 2 + 3), x, sp.oo) == 2
    assert sp.limit((x ** 2 - 25) / (x - 5), x, 5) == 10
    f = x ** 2 + 1
    assert (f.subs(x, 4) - f.subs(x, 1)) / 3 == 5
    p = sp.symbols('p', positive=True)
    assert eq(sp.diff(4 * p ** 3 - 2 / p + sp.sqrt(p), p), 12 * p ** 2 + 2 / p ** 2 + 1 / (2 * sp.sqrt(p)))
    assert eq(d(x ** 2 * sp.exp(x)), (x ** 2 + 2 * x) * sp.exp(x))
    assert eq(d(sp.sin(3 * x - 1)), 3 * sp.cos(3 * x - 1))
    assert eq(d(sp.log(2 * x + 1)), 2 / (2 * x + 1))
    g = x ** 2 - 3 * x
    assert g.subs(x, 2) == -2 and d(g).subs(x, 2) == 1 and sp.expand((x - 2) - 2) == x - 4
    h = x ** 3 - 6 * x ** 2 + 9 * x
    assert sorted(sp.solve(d(h), x)) == [1, 3] and h.subs(x, 1) == 4 and h.subs(x, 3) == 0
    assert d(h, 2).subs(x, 1) == -6 and d(h, 2).subs(x, 3) == 6
    assert sp.solve(d(h, 2), x) == [2] and h.subs(x, 2) == 2
    assert sp.limit(3 * x / (x + 2), x, sp.oo) == 3
    k = x ** 5 - 4 * x ** 3 + x
    assert sp.expand(k.subs(x, -x) + k) == 0
    assert sp.solve(a * (0 - 1) ** 2 - 1 - 1, a) == [2] and sp.expand(2 * (x - 1) ** 2 - 1) == 2 * x ** 2 - 4 * x + 1
    c = a * x ** 3 + b * x
    assert sp.solve([c.subs(x, 1) + 2, d(c).subs(x, 1)], [a, b]) == {a: 1, b: -3}
    A = x * (18 - x)
    assert sp.solve(d(A), x) == [9] and A.subs(x, 9) == 81
    assert sp.Matrix([[1, -2], [3, 0]]) * sp.Matrix([2, 1]) == sp.Matrix([0, 6])
    y, z = sp.symbols('y z')
    assert sp.solve([x + y + z - 4, y - z - 1, 2 * z - 2], [x, y, z]) == {x: 1, y: 2, z: 1}


Q.verify(check)
Q.save()
