#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 26 (LB 8): Geradenscharen in Ebene und
Raum - Büschel und Parallelenscharen, Parameter für Lage, Winkel und Abstand bestimmen.
Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12, vec
import sympy as sp
import math

Q = gy12(nr=26, slug='geradenscharen', thema='Geradenscharen', lb='LB 8',
         blurb='Büschel und Parallelenscharen, Parameter für Lage, Winkel und Abstand',
         comment='Blocks: Geradenscharen in der Ebene (3-7, 15-17), im Raum: Punkt und Richtung (1, 2, 14, 18, 20), gemeinsame Ebene (8, 9, 12, 19), Lage, Winkel (10, 11, 13). Ohne Hilfsmittel.')

Q.q(r'Welche Gerade der Schar $g_a\colon \vec x = ' + vec(1, 0, 0) + r' + t' + vec('a', 1, 0) + r'$ geht durch $P(3 \mid 1 \mid 0)$?',
    [r'$a = 2$', r'$a = 3$', r'$a = 1$', r'keine'],
    [r'$y$-Koordinate: $t = 1$.',
     r'$x$-Koordinate: $1 + a = 3$, $a = 2$.'])

Q.q(r'Für welches $a$ steht $g_a$ mit dem Richtungsvektor $' + vec('a', 1, 0) + r'$ senkrecht auf $' + vec(1, 1, 1) + r'$?',
    [r'$a = -1$', r'$a = 1$', r'$a = 0$', r'für kein $a$'],
    [r'$(a;\ 1;\ 0) \cdot (1;\ 1;\ 1) = a + 1$.',
     r'$a + 1 = 0$, $a = -1$.'])

Q.q(r'Welchen Punkt haben alle Geraden $y = ax + 1$ gemeinsam?',
    [r'$(0 \mid 1)$', r'$(1 \mid 0)$', r'$(0 \mid 0)$', r'keinen'],
    [r'Für $x = 0$ ist $y = 1$, unabhängig von $a$.',
     r'Die Schar ist ein Geradenbüschel durch $(0 \mid 1)$.'])

Q.q(r'Was beschreibt die Schar $y = 2x + a$?',
    [r'parallele Geraden mit der Steigung $2$', r'ein Geradenbüschel durch $(0 \mid 2)$', r'Geraden durch den Ursprung', r'Geraden mit der Steigung $a$'],
    [r'Die Steigung ist immer $2$, nur der $y$-Achsenabschnitt $a$ ändert sich.',
     r'Eine Parallelenschar.'])

Q.q(r'Welchen Punkt haben alle Geraden $y = a(x - 2)$ gemeinsam?',
    [r'$(2 \mid 0)$', r'$(0 \mid -2)$', r'$(0 \mid 0)$', r'$(-2 \mid 0)$'],
    [r'Für $x = 2$ ist $y = 0$ für jedes $a$.',
     r'Ein Büschel durch $(2 \mid 0)$ in Punkt-Steigungs-Form.'])

Q.q(r'Welche Gerade der Schar $y = ax + 1$ geht durch $(2 \mid 5)$?',
    [r'$a = 2$', r'$a = 2{,}5$', r'$a = 3$', r'$a = 5$'],
    [r'$5 = 2a + 1$.',
     r'$a = 2$.'])

Q.q(r'Welche Geraden der Schar $y = ax + 1$ berühren die Parabel $y = x^2 + 2$?',
    [r'$a = 2$ und $a = -2$', r'nur $a = 2$', r'$a = 0$', r'keine'],
    [r'$x^2 + 2 = ax + 1$, also $x^2 - ax + 1 = 0$ mit genau einer Lösung.',
     r'Diskriminante $a^2 - 4 = 0$: $a = \pm 2$, zwei Tangenten aus dem Punkt $(0 \mid 1)$.'])

Q.q(r'Wo liegen alle Geraden $g_a\colon \vec x = ' + vec(0, 0, 'a') + r' + t' + vec(1, 0, 0) + r'$?',
    [r'in der Ebene $y = 0$', r'in der Ebene $z = 0$', r'auf der $z$-Achse', r'in der Ebene $x = 0$'],
    [r'Alle Punkte haben die Form $(t \mid 0 \mid a)$.',
     r'Parallelen zur $x$-Achse in der $x$-$z$-Ebene.'])

Q.q(r'Was haben die Geraden $g_a\colon \vec x = ' + vec(1, 2, 3) + r' + t' + vec(1, 'a', 0) + r'$ gemeinsam?',
    [r'Sie gehen durch $(1 \mid 2 \mid 3)$ und liegen in der Ebene $z = 3$.', r'Sie sind parallel.', r'Sie liegen auf der $z$-Achse.', r'Sie gehen durch den Ursprung.'],
    [r'Gemeinsamer Stützpunkt $(1 \mid 2 \mid 3)$.',
     r'Die $z$-Komponente des Richtungsvektors ist $0$: Ein Büschel in der Ebene $z = 3$.'])

Q.q(r'Für welches $a$ liegt $g_a\colon \vec x = t \cdot ' + vec(1, 1, 'a') + r'$ in der Ebene $x - y + z = 0$?',
    [r'$a = 0$', r'$a = 1$', r'$a = -1$', r'für jedes $a$'],
    [r'Der Ursprung liegt in der Ebene.',
     r'Richtungsvektor parallel zur Ebene: $(1;\ 1;\ a) \cdot (1;\ -1;\ 1) = a = 0$.'])

Q.q(r'Für welche $a$ bildet eine Gerade mit dem Richtungsvektor $' + vec(1, 0, 'a') + r'$ mit der $x$-$y$-Ebene einen Winkel von $45^\circ$?',
    [r'$a = 1$ oder $a = -1$', r'nur $a = 1$', r'$a = 0$', r'$a = \sqrt2$'],
    [r'$\sin\varphi = \dfrac{|a|}{\sqrt{1 + a^2}} = \tfrac{1}{\sqrt2}$.',
     r'$2a^2 = 1 + a^2$, $a^2 = 1$.'])

Q.q(r'Wo liegen alle Geraden $g_a\colon \vec x = ' + vec('a', 0, 0) + r' + t' + vec(0, 1, 1) + r'$?',
    [r'in der Ebene $y = z$', r'in der Ebene $x = 0$', r'in der Ebene $y = 0$', r'auf einer gemeinsamen Geraden'],
    [r'Punkte $(a \mid t \mid t)$: Es gilt immer $y = z$.',
     r'Eine Parallelenschar in der Ebene $y - z = 0$.'])

Q.q(r'Wo schneidet $g_a\colon \vec x = t \cdot ' + vec(1, 'a', 0) + r'$ die Gerade $h\colon \vec x = ' + vec(1, 0, 0) + r' + s' + vec(0, 1, 0) + r'$?',
    [r'in $(1 \mid a \mid 0)$', r'in $(1 \mid 0 \mid 0)$', r'in $(a \mid 1 \mid 0)$', r'Sie schneiden sich nicht.'],
    [r'$t = 1$ aus der $x$-Koordinate, dann $s = a$.',
     r'Schnittpunkt $(1 \mid a \mid 0)$: Jede Gerade der Schar trifft $h$.'])

Q.q(r'Für welches $a$ ist der Richtungsvektor $' + vec('a', 2, 1) + r'$ parallel zu $' + vec(4, 4, 2) + r'$?',
    [r'$a = 2$', r'$a = 4$', r'$a = 1$', r'für kein $a$'],
    [r'$(4;\ 4;\ 2) = 2 \cdot (2;\ 2;\ 1)$.',
     r'Also $a = 2$.'])

Q.q(r'Welche Gerade der Schar $y = ax$ geht durch $(3 \mid -6)$?',
    [r'$a = -2$', r'$a = 2$', r'$a = -3$', r'$a = -\tfrac12$'],
    [r'$-6 = 3a$.',
     r'$a = -2$.'])

Q.q(r'Die Geraden durch $P(1 \mid 1)$ haben die Gleichung $y = m(x - 1) + 1$. Welche schneidet die $x$-Achse bei $x = 3$?',
    [r'$m = -\tfrac12$', r'$m = \tfrac12$', r'$m = -2$', r'$m = 3$'],
    [r'$0 = m \cdot 2 + 1$.',
     r'$m = -\tfrac12$.'])

Q.q(r'Welche Gerade der Schar $y = ax + 2$ hat vom Ursprung den größten Abstand?',
    [r'$a = 0$, Abstand $2$', r'$a = 1$, Abstand $\sqrt2$', r'$a = 2$, Abstand $\tfrac{2}{\sqrt5}$', r'Der Abstand wächst mit $a$ ohne Grenze.'],
    [r'Abstand $d(a) = \dfrac{2}{\sqrt{1 + a^2}}$.',
     r'Der Nenner ist für $a = 0$ am kleinsten: $d = 2$.'])

Q.q(r'Für welche $a$ steht der Richtungsvektor $' + vec(1, 'a', 'a^2') + r'$ senkrecht auf $' + vec(1, 1, -2) + r'$?',
    [r'$a = 1$ oder $a = -\tfrac12$', r'nur $a = 1$', r'$a = 0$', r'$a = 2$ oder $a = -1$'],
    [r'$1 + a - 2a^2 = 0$, also $2a^2 - a - 1 = 0$.',
     r'$a = \tfrac{1 \pm 3}{4}$: $1$ oder $-\tfrac12$.'])

Q.q(r'Was beschreibt die Schar $g_a\colon \vec x = ' + vec(1, 1, 1) + r' + t' + vec('a', '1 - a', 0) + r'$?',
    [r'ein Geradenbüschel durch $(1 \mid 1 \mid 1)$ in der Ebene $z = 1$', r'parallele Geraden', r'Geraden auf der $z$-Achse', r'Geraden durch den Ursprung'],
    [r'Alle haben den Stützpunkt $(1 \mid 1 \mid 1)$.',
     r'Die $z$-Komponente der Richtung ist $0$: Alle liegen in $z = 1$.'])

Q.q(r'Für welches $a$ trifft $g_a\colon \vec x = t \cdot ' + vec(1, 1, 'a') + r'$ die Ebene $z = 4$ im Punkt $(2 \mid 2 \mid 4)$?',
    [r'$a = 2$', r'$a = 4$', r'$a = 1$', r'$a = \tfrac12$'],
    [r'$x$- und $y$-Koordinate: $t = 2$.',
     r'$z$: $2a = 4$, $a = 2$.'])


def check():
    a = sp.symbols('a', real=True)
    v = lambda *c: sp.Matrix(c)
    assert sp.solve(1 + a - 3, a) == [2] and sp.solve((v(a, 1, 0).T * v(1, 1, 1))[0], a) == [-1]
    assert sp.solve(2 * a + 1 - 5, a) == [2]
    x = sp.symbols('x')
    assert set(sp.solve(sp.discriminant(x**2 - a * x + 1, x), a)) == {2, -2}
    assert sp.solve((v(1, 1, a).T * v(1, -1, 1))[0], a) == [0]
    assert set(sp.solve(sp.Eq(a**2 / (1 + a**2), sp.Rational(1, 2)), a)) == {1, -1}
    assert sp.solve(3 * a + 6, a) == [-2]
    m = sp.symbols('m')
    assert sp.solve(m * 2 + 1, m) == [-sp.Rational(1, 2)]
    d = 2 / sp.sqrt(1 + a**2)
    assert sp.solve(sp.diff(d, a), a) == [0] and d.subs(a, 0) == 2 and d.subs(a, 1) == sp.sqrt(2)
    assert set(sp.solve((v(1, a, a**2).T * v(1, 1, -2))[0], a)) == {1, -sp.Rational(1, 2)}
    assert sp.solve(2 * a - 4, a) == [2]
    assert math.isclose(float(d.subs(a, 2)), 2 / math.sqrt(5))


Q.verify(check)
Q.save()
