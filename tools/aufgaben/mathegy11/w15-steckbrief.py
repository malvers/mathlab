#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 15 / KW 50 (LB 1): determining polynomial functions from
conditions by solving linear systems. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=15, slug='steckbrief', thema='Ganzrationale Funktionen aus Bedingungen', lb='LB 1',
         blurb='Bedingungen übersetzen, Gleichungssystem aufstellen und lösen',
         comment='Blocks: translating conditions (1-8), symmetry (9-10), solving (11-17), context (18-20).')

# -------------------------------------------------- translating conditions ----
Q.q(r'Wie viele Bedingungen braucht man, um eine ganzrationale Funktion dritten Grades eindeutig zu bestimmen?',
    [r'4', r'3', r'2', r'6'],
    [r'$f(x) = ax^3 + bx^2 + cx + d$ hat vier Unbekannte.',
     r'Also braucht man vier voneinander unabhängige Bedingungen.'])

Q.q(r'Welche Gleichung gehört zu „Der Graph geht durch $P(2 \mid 5)$“?',
    [r'$f(2) = 5$', r'$f(5) = 2$', r'$f^{\prime}(2) = 5$', r'$f(2) = 0$'],
    [r'Ein Punkt liegt auf dem Graphen, wenn sein $y$-Wert der Funktionswert an seiner $x$-Stelle ist.'])

Q.q(r'Welche Gleichung gehört zu „Der Graph hat bei $x = 1$ einen Hochpunkt“?',
    [r'$f^{\prime}(1) = 0$', r'$f(1) = 0$', r'$f^{\prime\prime}(1) = 0$', r'$f^{\prime}(0) = 1$'],
    [r'An einer Extremstelle ist die Tangente waagerecht.',
     r'Liefert nur eine Gleichung; den $y$-Wert kennt man hier nicht.'])

Q.q(r'Welche Gleichung gehört zu „Der Graph hat im Ursprung einen Wendepunkt“? (Nur die Wendebedingung)',
    [r'$f^{\prime\prime}(0) = 0$', r'$f^{\prime}(0) = 0$', r'$f(0) = 1$', r'$f^{\prime\prime}(1) = 0$'],
    [r'Notwendige Bedingung für einen Wendepunkt: $f^{\prime\prime} = 0$.',
     r'„Im Ursprung“ liefert zusätzlich $f(0) = 0$.'])

Q.q(r'Welche Gleichungen gehören zu „Der Graph berührt die $x$-Achse im Ursprung“?',
    [r'$f(0) = 0$ und $f^{\prime}(0) = 0$', r'$f(0) = 0$', r'$f^{\prime}(0) = 0$ und $f^{\prime\prime}(0) = 0$', r'$f(0) = 0$ und $f^{\prime\prime}(0) = 0$'],
    [r'Er geht durch $(0 \mid 0)$: $f(0) = 0$.',
     r'Berühren heißt: Die $x$-Achse ist dort Tangente, also $f^{\prime}(0) = 0$.'])

Q.q(r'Zwei Straßenstücke sollen bei $x_0$ ohne Knick ineinander übergehen. Was muss gelten?',
    [r'Gleicher Funktionswert und gleicher Anstieg bei $x_0$.', r'Nur gleicher Funktionswert.', r'Gleiche Nullstellen.', r'Gleiche zweite Ableitung überall.'],
    [r'Ohne Sprung: gleiche Funktionswerte.',
     r'Ohne Knick: gleiche erste Ableitung.'])

Q.q(r'Für $f(x) = ax^3 + bx^2 + cx + d$ gilt $f(0) = 1$. Was folgt?',
    [r'$d = 1$', r'$a = 1$', r'$a + b + c + d = 1$', r'$c = 1$'],
    [r'Bei $x = 0$ fallen alle Summanden mit $x$ weg.',
     r'$f(0) = d = 1$'])

Q.q(r'Für $f(x) = ax^2 + bx + c$ gilt $f^{\prime}(0) = 3$. Was folgt?',
    [r'$b = 3$', r'$c = 3$', r'$a = 3$', r'$2a = 3$'],
    [r'$f^{\prime}(x) = 2ax + b$',
     r'$f^{\prime}(0) = b = 3$'])

# --------------------------------------------------------------- symmetry ----
Q.q(r'Der Graph einer Funktion dritten Grades ist punktsymmetrisch zum Ursprung. Welcher Ansatz passt?',
    [r'$f(x) = ax^3 + cx$', r'$f(x) = ax^3 + bx^2$', r'$f(x) = ax^3 + d$', r'$f(x) = ax^3 + bx^2 + cx + d$ mit $a = 0$'],
    [r'Punktsymmetrie zum Ursprung: nur ungerade Exponenten.',
     r'Damit bleiben zwei Unbekannte statt vier.'])

Q.q(r'Der Graph einer Funktion vierten Grades ist achsensymmetrisch zur $y$-Achse. Welcher Ansatz passt?',
    [r'$f(x) = ax^4 + cx^2 + e$', r'$f(x) = ax^4 + bx^3$', r'$f(x) = ax^4 + dx$', r'$f(x) = ax^4 + bx^3 + cx^2$'],
    [r'Achsensymmetrie: nur gerade Exponenten, die Konstante zählt dazu.'])

# --------------------------------------------------------------- solving ----
Q.q(r'Eine Parabel geht durch $(0 \mid 3)$, $(1 \mid 0)$ und $(3 \mid 0)$. Wie lautet ihre Gleichung?',
    [r'$f(x) = x^2 - 4x + 3$', r'$f(x) = -x^2 + 4x + 3$', r'$f(x) = x^2 + 4x + 3$', r'$f(x) = 3x^2 - 4x + 3$'],
    [r'$c = 3$; $a + b + 3 = 0$; $9a + 3b + 3 = 0$',
     r'Aus der zweiten: $b = -3 - a$; eingesetzt: $6a - 6 = 0$, also $a = 1$, $b = -4$.',
     r'Probe: $f(x) = (x - 1)(x - 3)$.'])

Q.q(r'Eine Parabel hat den Scheitel $S(2 \mid 1)$ und geht durch $(0 \mid 5)$. Wie lautet sie?',
    [r'$f(x) = x^2 - 4x + 5$', r'$f(x) = x^2 + 4x + 5$', r'$f(x) = 2x^2 - 4x + 5$', r'$f(x) = -x^2 + 4x + 1$'],
    [r'Scheitelpunktform: $f(x) = a(x - 2)^2 + 1$.',
     r'$f(0) = 4a + 1 = 5 \Rightarrow a = 1$',
     r'Ausmultipliziert: $x^2 - 4x + 5$.'])

Q.q(r'$f(x) = ax^3 + cx$ ist punktsymmetrisch und hat den Hochpunkt $H(1 \mid 2)$. Wie lautet $f$?',
    [r'$f(x) = -x^3 + 3x$', r'$f(x) = x^3 - 3x$', r'$f(x) = -x^3 + 2x$', r'$f(x) = 2x^3$'],
    [r'$f(1) = a + c = 2$, $f^{\prime}(1) = 3a + c = 0$',
     r'Subtrahieren: $2a = -2$, also $a = -1$, $c = 3$.'])

Q.q(r'$f(x) = ax^2 + bx + c$ erfüllt $f(0) = 2$, $f^{\prime}(0) = 3$ und $f(1) = 4$. Bestimme $a$.',
    [r'$a = -1$', r'$a = 1$', r'$a = 4$', r'$a = 2$'],
    [r'$c = 2$ und $b = 3$ (siehe oben).',
     r'$a + 3 + 2 = 4 \Rightarrow a = -1$'])

Q.q(r'Eine Funktion dritten Grades hat die Nullstellen 0, 1 und 2 und geht durch $(3 \mid 6)$. Wie lautet sie?',
    [r'$f(x) = x(x - 1)(x - 2)$', r'$f(x) = 2x(x - 1)(x - 2)$', r'$f(x) = x(x + 1)(x + 2)$', r'$f(x) = 6x(x - 1)(x - 2)$'],
    [r'Ansatz über die Linearfaktoren: $f(x) = a \cdot x(x - 1)(x - 2)$.',
     r'$f(3) = a \cdot 3 \cdot 2 \cdot 1 = 6a = 6 \Rightarrow a = 1$'])

Q.q(r'Welches Gleichungssystem gehört zu einer Parabel durch $(1 \mid 2)$, $(-1 \mid 6)$ und $(2 \mid 3)$?',
    [r'$a + b + c = 2$, $a - b + c = 6$, $4a + 2b + c = 3$', r'$a + b + c = 2$, $-a - b + c = 6$, $4a + 2b + c = 3$',
     r'$a + b + c = 1$, $a - b + c = -1$, $4a + 2b + c = 2$', r'$2a + b + c = 1$, $6a - b + c = -1$, $3a + 2b + c = 2$'],
    [r'Jeweils $x$ in $ax^2 + bx + c$ einsetzen und gleich $y$ setzen.',
     r'Für $x = -1$: $a \cdot 1 + b \cdot (-1) + c$.'])

Q.q(r'Löse dieses System: $a + b + c = 2$, $a - b + c = 6$, $4a + 2b + c = 3$. Wie lautet die Parabel?',
    [r'$f(x) = x^2 - 2x + 3$', r'$f(x) = x^2 + 2x - 1$', r'$f(x) = -x^2 - 2x + 5$', r'$f(x) = 2x^2 - 2x + 2$'],
    [r'Erste minus zweite: $2b = -4$, also $b = -2$ und $a + c = 4$.',
     r'Dritte: $4a - 4 + c = 3$, also $4a + c = 7$; mit $a + c = 4$: $a = 1$, $c = 3$.',
     r'Probe: $f(2) = 4 - 4 + 3 = 3$.'])

# --------------------------------------------------------------- context ----
Q.q(r'Ein Brückenbogen hat 40 m Spannweite und ist in der Mitte 10 m hoch. Die Mitte liegt bei $x = 0$. Welche Parabel beschreibt ihn?',
    [r'$f(x) = -\dfrac{1}{40}x^2 + 10$', r'$f(x) = -\dfrac{1}{4}x^2 + 10$', r'$f(x) = -\dfrac{1}{400}x^2 + 10$', r'$f(x) = \dfrac{1}{40}x^2 + 10$'],
    [r'Symmetrisch zur $y$-Achse: $f(x) = ax^2 + 10$.',
     r'Fußpunkt $(20 \mid 0)$: $400a + 10 = 0 \Rightarrow a = -\dfrac{1}{40}$.'])

Q.q(r'Eine Rutsche beginnt in $(0 \mid 4)$ und endet in $(4 \mid 0)$, an beiden Enden waagerecht. Welche Funktion dritten Grades passt?',
    [r'$f(x) = \dfrac{1}{8}x^3 - \dfrac{3}{4}x^2 + 4$', r'$f(x) = -\dfrac{1}{8}x^3 + \dfrac{3}{4}x^2 + 4$', r'$f(x) = \dfrac{1}{4}x^3 - x^2 + 4$', r'$f(x) = -x + 4$'],
    [r'$f(0) = 4$ und $f^{\prime}(0) = 0$ ergeben $d = 4$, $c = 0$.',
     r'$f(4) = 64a + 16b + 4 = 0$ und $f^{\prime}(4) = 48a + 8b = 0$, also $b = -6a$.',
     r'$64a - 96a + 4 = 0 \Rightarrow a = \dfrac{1}{8}$, $b = -\dfrac{3}{4}$.'])

Q.q(r'Für eine Funktion vierten Grades sind nur vier Bedingungen bekannt. Was folgt?',
    [r'Es gibt unendlich viele passende Funktionen (eine Schar).', r'Es gibt genau eine passende Funktion.',
     r'Es gibt keine passende Funktion.', r'Die Funktion ist dann automatisch symmetrisch.'],
    [r'Fünf Unbekannte, vier Gleichungen: Eine Unbekannte bleibt frei.',
     r'Erst eine weitere Bedingung legt die Funktion fest.'])


def check():
    import sympy as sp
    x, a, b, c, d = sp.symbols('x a b c d')
    f2 = a * x ** 2 + b * x + c
    assert sp.solve([f2.subs(x, 0) - 3, f2.subs(x, 1), f2.subs(x, 3)], [a, b, c]) == {a: 1, b: -4, c: 3}
    assert sp.expand((x - 2) ** 2 + 1) == x ** 2 - 4 * x + 5 and sp.solve(4 * a + 1 - 5, a) == [1]
    g = a * x ** 3 + c * x
    assert sp.solve([g.subs(x, 1) - 2, sp.diff(g, x).subs(x, 1)], [a, c]) == {a: -1, c: 3}
    assert sp.solve([f2.subs(x, 0) - 2, sp.diff(f2, x).subs(x, 0) - 3, f2.subs(x, 1) - 4], [a, b, c]) == {a: -1, b: 3, c: 2}
    h = a * x * (x - 1) * (x - 2)
    assert sp.solve(h.subs(x, 3) - 6, a) == [1]
    s = sp.solve([f2.subs(x, 1) - 2, f2.subs(x, -1) - 6, f2.subs(x, 2) - 3], [a, b, c])
    assert s == {a: 1, b: -2, c: 3}
    assert sp.solve((a * x ** 2 + 10).subs(x, 20), a) == [-sp.Rational(1, 40)]
    f3 = a * x ** 3 + b * x ** 2 + c * x + d
    df3 = sp.diff(f3, x)
    s3 = sp.solve([f3.subs(x, 0) - 4, df3.subs(x, 0), f3.subs(x, 4), df3.subs(x, 4)], [a, b, c, d])
    assert s3 == {a: sp.Rational(1, 8), b: -sp.Rational(3, 4), c: 0, d: 4}


Q.verify(check)
Q.save()
