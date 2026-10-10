#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 11 / KW 46 (LB 2): Nullstellen zeichnerisch
und rechnerisch, Funktionsgleichungen aufstellen. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=11, slug='nullstellen', thema='Nullstellen und Funktionsgleichungen', lb='LB 2',
        blurb='Nullstellen berechnen und deuten, Gleichung aus Punkt und Steigung oder aus zwei Punkten',
        comment='Blocks: zeros (1-6, 17, 20), zeros in context (7, 14-15, 19), equations from points (8-13, 16, 18).')

# ---------------------------------------------------------- Nullstellen ----
Q.q(r'Berechne die Nullstelle von $y = 2x - 6$.',
    [r'$x = 3$', r'$x = -3$', r'$x = -6$', r'$x = 12$'],
    [r'Nullstelle: $y = 0$ setzen, also $2x - 6 = 0$.',
     r'$2x = 6$, $x = 3$'])

Q.q(r'Berechne die Nullstelle von $y = -3x + 12$.',
    [r'$x = 4$', r'$x = -4$', r'$x = 12$', r'$x = 36$'],
    [r'$-3x + 12 = 0$',
     r'$-3x = -12$, also $x = 4$.'])

Q.q(r'Berechne die Nullstelle von $y = 0{,}5x + 2$.',
    [r'$x = -4$', r'$x = 4$', r'$x = -1$', r'$x = 2$'],
    [r'$0{,}5x + 2 = 0$',
     r'$0{,}5x = -2$, also $x = -4$.'])

Q.q(r'Welche Nullstelle hat $y = 4x$?',
    [r'$x = 0$', r'$x = 4$', r'$x = -4$', r'Sie hat keine Nullstelle.'],
    [r'$4x = 0$ gilt nur für $x = 0$.',
     r'Jede proportionale Funktion mit $m \neq 0$ hat ihre Nullstelle im Ursprung.'])

Q.q(r'Wie viele Nullstellen hat $y = 5$?',
    [r'keine', r'eine, bei $x = 5$', r'eine, bei $x = 0$', r'unendlich viele'],
    [r'Der Graph ist eine waagerechte Gerade in Höhe 5.',
     r'Er schneidet die $x$-Achse nie, also gibt es keine Nullstelle.'])

Q.q(r'Was ist die Nullstelle einer Funktion am Graphen?',
    [r'die $x$-Koordinate des Schnittpunkts mit der $x$-Achse', r'der Schnittpunkt mit der $y$-Achse',
     r'der tiefste Punkt des Graphen', r'die Stelle, an der $x = 0$ ist'],
    [r'An einer Nullstelle ist der Funktionswert 0.',
     r'Dort liegt der Graph auf der $x$-Achse.'])

Q.q(r'Eine 18 cm hohe Kerze brennt gleichmäßig ab: $h = 18 - 1{,}2t$ ($t$ in Stunden). Nach wie vielen Stunden ist sie abgebrannt?',
    [r'nach 15 Stunden', r'nach 21,6 Stunden', r'nach 16,8 Stunden', r'nach 18 Stunden'],
    [r'Abgebrannt heißt $h = 0$: $18 - 1{,}2t = 0$.',
     r'$1{,}2t = 18$, also $t = 15$.'])

# ------------------------------------------------- Gleichung aufstellen ----
Q.q(r'Eine Gerade hat die Steigung $-2$ und geht durch $(0 \mid 3)$. Wie lautet ihre Gleichung?',
    [r'$y = -2x + 3$', r'$y = 3x - 2$', r'$y = -2x - 3$', r'$y = 2x + 3$'],
    [r'$(0 \mid 3)$ liegt auf der $y$-Achse, also $n = 3$.',
     r'$y = -2x + 3$'])

Q.q(r'Eine Gerade hat die Steigung 3 und geht durch $P(2 \mid 5)$. Wie lautet ihre Gleichung?',
    [r'$y = 3x - 1$', r'$y = 3x + 5$', r'$y = 3x + 2$', r'$y = 5x + 3$'],
    [r'$P$ einsetzen: $5 = 3 \cdot 2 + n$',
     r'$n = 5 - 6 = -1$',
     r'$y = 3x - 1$'])

Q.q(r'Eine Gerade geht durch $A(1 \mid 4)$ und $B(3 \mid 10)$. Wie lautet ihre Gleichung?',
    [r'$y = 3x + 1$', r'$y = 2x + 2$', r'$y = 3x + 4$', r'$y = 6x - 2$'],
    [r'$m = \dfrac{10 - 4}{3 - 1} = \dfrac{6}{2} = 3$',
     r'$A$ einsetzen: $4 = 3 + n$, also $n = 1$.',
     r'$y = 3x + 1$'])

Q.q(r'Eine Gerade geht durch $A(-2 \mid 7)$ und $B(2 \mid -1)$. Wie lautet ihre Gleichung?',
    [r'$y = -2x + 3$', r'$y = 2x + 3$', r'$y = -2x + 7$', r'$y = -0{,}5x + 6$'],
    [r'$m = \dfrac{-1 - 7}{2 - (-2)} = \dfrac{-8}{4} = -2$',
     r'$B$ einsetzen: $-1 = -4 + n$, also $n = 3$.',
     r'$y = -2x + 3$'])

Q.q(r'Eine Gerade geht durch $A(0 \mid -2)$ und $B(4 \mid 0)$. Wie lautet ihre Gleichung?',
    [r'$y = 0{,}5x - 2$', r'$y = 2x - 2$', r'$y = -0{,}5x - 2$', r'$y = 0{,}5x + 4$'],
    [r'$n = -2$ (Schnittpunkt mit der $y$-Achse)',
     r'$m = \dfrac{0 - (-2)}{4 - 0} = \dfrac{2}{4} = 0{,}5$',
     r'$y = 0{,}5x - 2$; $B$ ist gleichzeitig die Nullstelle.'])

Q.q(r'Liegt $P(3 \mid 4)$ auf der Geraden $y = 2x - 1$?',
    [r'Nein, denn für $x = 3$ ist $y = 5$.', r'Ja, denn $2 \cdot 3 - 1 = 4$.',
     r'Ja, weil 3 und 4 positiv sind.', r'Nein, denn die Gerade ist fallend.'],
    [r'$x = 3$ einsetzen: $y = 2 \cdot 3 - 1 = 5$.',
     r'$5 \neq 4$, also liegt $P$ nicht auf der Geraden.'])

# ---------------------------------------------------------------- Sachbezug ----
Q.q(r'Ein Tank enthält 48 Liter. Das Auto verbraucht 6 Liter auf 100 km: $V = 48 - 0{,}06s$. Nach wie vielen Kilometern ist der Tank leer?',
    [r'800 km', r'288 km', r'480 km', r'8 km'],
    [r'Leer heißt $V = 0$: $48 - 0{,}06s = 0$.',
     r'$0{,}06s = 48$, also $s = 800$.'])

Q.q(r'Ein Akku ist voll (100 %) und verliert pro Stunde 8 Prozentpunkte. Nach wie vielen Stunden ist er leer?',
    [r'nach 12,5 Stunden', r'nach 8 Stunden', r'nach 92 Stunden', r'nach 10 Stunden'],
    [r'Ladestand: $L = 100 - 8t$',
     r'Nullstelle: $100 - 8t = 0$, also $t = 12{,}5$.'])

Q.q(r'Welche Gerade ist parallel zu $y = 3x - 2$ und geht durch $P(1 \mid 5)$?',
    [r'$y = 3x + 2$', r'$y = 3x + 5$', r'$y = 5x - 2$', r'$y = -3x + 8$'],
    [r'Parallel heißt: gleiche Steigung $m = 3$.',
     r'$P$ einsetzen: $5 = 3 + n$, also $n = 2$.',
     r'$y = 3x + 2$'])

Q.q(r'Berechne die Nullstelle von $y = -0{,}25x + 3$.',
    [r'$x = 12$', r'$x = -12$', r'$x = 0{,}75$', r'$x = 3{,}25$'],
    [r'$-0{,}25x + 3 = 0$',
     r'$0{,}25x = 3$, also $x = 12$.'])

Q.q(r'Ein Graph schneidet die $y$-Achse bei $(0 \mid 6)$ und die $x$-Achse bei $(3 \mid 0)$. Wie lautet die Gleichung?',
    [r'$y = -2x + 6$', r'$y = 2x + 6$', r'$y = -0{,}5x + 6$', r'$y = 6x + 3$'],
    [r'$n = 6$',
     r'$m = \dfrac{0 - 6}{3 - 0} = -2$',
     r'$y = -2x + 6$'])

Q.q(r'Aus einem Becken mit 1200 Litern fließen pro Minute 40 Liter ab. Wann ist es leer?',
    [r'nach 30 Minuten', r'nach 40 Minuten', r'nach 48 000 Minuten', r'nach 3 Minuten'],
    [r'Restmenge: $V = 1200 - 40t$',
     r'$1200 - 40t = 0$, also $t = 30$.'])

Q.q(r'Welche Funktion hat die Nullstelle $x = -2$?',
    [r'$y = 3x + 6$', r'$y = 3x - 6$', r'$y = -2x$', r'$y = x - 2$'],
    [r'Prüfen: $f(-2) = 0$?',
     r'$3 \cdot (-2) + 6 = 0$ stimmt.',
     r'Die anderen haben die Nullstellen 2, 0 und 2.'])


def check():
    import sympy as sp
    from fractions import Fraction as F
    x = sp.symbols('x')
    z = lambda e: sp.solve(sp.Eq(e, 0), x)
    assert z(2*x - 6) == [3] and z(-3*x + 12) == [4] and z(x / 2 + 2) == [-4] and z(4*x) == [0]
    assert z(18 - sp.Rational(6, 5)*x) == [15]
    assert 5 - 3 * 2 == -1
    assert F(10 - 4, 3 - 1) == 3 and 4 - 3 == 1
    assert F(-1 - 7, 2 + 2) == -2 and -1 + 4 == 3
    assert F(0 + 2, 4) == F(1, 2)
    assert 2 * 3 - 1 == 5
    assert z(48 - sp.Rational(6, 100)*x) == [800]
    assert z(100 - 8*x) == [sp.Rational(25, 2)]
    assert 5 - 3 == 2
    assert z(-x / 4 + 3) == [12]
    assert F(0 - 6, 3) == -2
    assert z(1200 - 40*x) == [30]
    assert z(3*x + 6) == [-2] and z(3*x - 6) == [2] and z(-2*x) == [0] and z(x - 2) == [2]


Q.verify(check)
Q.save()
