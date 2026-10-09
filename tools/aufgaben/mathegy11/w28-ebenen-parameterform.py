#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 28 / KW 14 (LB 3): planes in parametric form - from three
points, point test, trace points, special planes. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11, vec

Q = gy11(nr=28, slug='ebenen-parameterform', thema='Ebenen in Parameterform', lb='LB 3',
         blurb='Ebene aus Punkten, Punktprobe, Spurpunkte, besondere Ebenen',
         comment='Blocks: setting up (1-7), point test (8-11), trace points (12-14), special planes and context (15-20).')

E1 = r'E\colon \vec{x} = ' + vec(1, 0, 0) + r' + r \cdot ' + vec(-1, 1, 0) + r' + s \cdot ' + vec(-1, 0, 1)
E2 = r'E\colon \vec{x} = ' + vec(0, 0, 2) + r' + r \cdot ' + vec(1, 0, -1) + r' + s \cdot ' + vec(0, 1, -1)

# ---------------------------------------------------------------- setting up ----
Q.q(r'Wie stellt man die Ebene durch drei Punkte $A$, $B$, $C$ in Parameterform auf?',
    [r'$\vec{x} = \vec{a} + r \cdot \overrightarrow{AB} + s \cdot \overrightarrow{AC}$', r'$\vec{x} = \vec{a} + r \cdot \vec{b} + s \cdot \vec{c}$',
     r'$\vec{x} = r \cdot \overrightarrow{AB} + s \cdot \overrightarrow{AC}$', r'$\vec{x} = \vec{a} + \vec{b} + \vec{c}$'],
    [r'Stützvektor: Ortsvektor eines Punktes.',
     r'Spannvektoren: zwei Verbindungsvektoren in der Ebene.'])

Q.q(r'Welche Spannvektoren liefern $A(1 \mid 0 \mid 0)$, $B(0 \mid 1 \mid 0)$, $C(0 \mid 0 \mid 1)$?',
    [r'$' + vec(-1, 1, 0) + '$ und $' + vec(-1, 0, 1) + '$', r'$' + vec(0, 1, 0) + '$ und $' + vec(0, 0, 1) + '$',
     r'$' + vec(1, 0, 0) + '$ und $' + vec(1, 1, 1) + '$', r'$' + vec(1, 1, 0) + '$ und $' + vec(1, 0, 1) + '$'],
    [r'$\overrightarrow{AB} = \vec{b} - \vec{a}$, $\overrightarrow{AC} = \vec{c} - \vec{a}$'])

Q.q(r'Welche Bedingung müssen die beiden Spannvektoren erfüllen?',
    [r'Sie müssen linear unabhängig sein (nicht parallel).', r'Sie müssen gleich lang sein.',
     r'Sie müssen senkrecht aufeinander stehen.', r'Einer muss der Nullvektor sein.'],
    [r'Parallele Spannvektoren erzeugen nur eine Gerade.'])

Q.q(r'Warum legen drei Punkte auf einer Geraden keine Ebene fest?',
    [r'Durch eine Gerade gehen unendlich viele Ebenen.', r'Weil drei Punkte zu wenig sind.',
     r'Doch, sie legen genau eine Ebene fest.', r'Weil die Ebene dann durch den Ursprung gehen müsste.'],
    [r'$\overrightarrow{AB}$ und $\overrightarrow{AC}$ wären dann parallel.',
     r'Man kann die Ebene um die Gerade „drehen“.'])

Q.q(r'Womit lässt sich eine Ebene ebenfalls eindeutig festlegen?',
    [r'Mit einer Geraden und einem Punkt, der nicht auf ihr liegt.', r'Mit zwei windschiefen Geraden.',
     r'Mit einem einzigen Punkt.', r'Mit zwei Punkten.'],
    [r'Auch zwei sich schneidende oder zwei parallele verschiedene Geraden legen eine Ebene fest.',
     r'Windschiefe Geraden liegen nie in einer gemeinsamen Ebene.'])

Q.q(r'Wie viele Parameter hat die Parameterform einer Ebene?',
    [r'Zwei', r'Einen', r'Drei', r'Keinen'],
    [r'Eine Ebene ist zweidimensional: zwei unabhängige Richtungen.'])

Q.q(r'Eine Dachfläche hat die Ecken $A(0 \mid 0 \mid 3)$, $B(4 \mid 0 \mid 3)$ und $C(4 \mid 2 \mid 5)$. Welche Parameterform passt?',
    [r'$\vec{x} = ' + vec(0, 0, 3) + r' + r \cdot ' + vec(4, 0, 0) + r' + s \cdot ' + vec(4, 2, 2) + '$',
     r'$\vec{x} = ' + vec(0, 0, 3) + r' + r \cdot ' + vec(4, 0, 3) + r' + s \cdot ' + vec(4, 2, 5) + '$',
     r'$\vec{x} = ' + vec(4, 0, 3) + r' + r \cdot ' + vec(0, 0, 3) + r' + s \cdot ' + vec(4, 2, 5) + '$',
     r'$\vec{x} = r \cdot ' + vec(4, 0, 0) + r' + s \cdot ' + vec(4, 2, 2) + '$'],
    [r'$\overrightarrow{AB} = ' + vec(4, 0, 0) + r'$, $\overrightarrow{AC} = ' + vec(4, 2, 2) + '$',
     r'Stützvektor $\vec{a}$.'])

# ---------------------------------------------------------------- point test ----
Q.q(r'Liegt $P(0 \mid 0 \mid 1)$ in $' + E1 + '$?',
    [r'Ja, für $r = 0$, $s = 1$.', r'Nein.', r'Ja, für $r = 1$, $s = 0$.', r'Ja, für $r = s = 1$.'],
    [r'$1 - r - s = 0$, $r = 0$, $s = 1$: Alle drei Gleichungen passen.'])

Q.q(r'Liegt $Q(1 \mid 1 \mid 1)$ in derselben Ebene $' + E1 + '$?',
    [r'Nein, die Gleichungen widersprechen sich.', r'Ja, für $r = s = 1$.', r'Ja, für $r = 1$, $s = 0$.', r'Ja, jeder Punkt liegt darin.'],
    [r'Aus $y$ und $z$: $r = 1$, $s = 1$.',
     r'Dann $x = 1 - 1 - 1 = -1 \neq 1$: Widerspruch.'])

Q.q(r'Welcher Punkt von $' + E1 + '$ gehört zu $r = 1$, $s = 2$?',
    [r'$(-2 \mid 1 \mid 2)$', r'$(2 \mid 1 \mid 2)$', r'$(-2 \mid 2 \mid 1)$', r'$(0 \mid 1 \mid 2)$'],
    [r'$' + vec(1, 0, 0) + ' + ' + vec(-1, 1, 0) + r' + 2 \cdot ' + vec(-1, 0, 1) + '$'])

Q.q(r'Liegt $D(0 \mid 2 \mid 5)$ in der Ebene durch $A(0 \mid 0 \mid 3)$, $B(4 \mid 0 \mid 3)$, $C(4 \mid 2 \mid 5)$?',
    [r'Ja, für $r = -1$, $s = 1$.', r'Nein.', r'Ja, für $r = 1$, $s = 1$.', r'Ja, für $r = 0$, $s = 1$.'],
    [r'$4r + 4s = 0$, $2s = 2$, $3 + 2s = 5$.',
     r'$s = 1$, dann $r = -1$; alle Gleichungen passen. $ABCD$ ist also ein ebenes Viereck.'])

Q.q(r'Welcher Punkt liegt in $' + E1 + '$?',
    [r'$\left(\dfrac{1}{3} \mid \dfrac{1}{3} \mid \dfrac{1}{3}\right)$', r'$(1 \mid 1 \mid 1)$', r'$(0 \mid 0 \mid 0)$', r'$(1 \mid 1 \mid -2)$'],
    [r'Aus $y = r$ und $z = s$: $r = s = \dfrac{1}{3}$.',
     r'Dann $x = 1 - \dfrac{1}{3} - \dfrac{1}{3} = \dfrac{1}{3}$: passt. Bei den anderen Punkten widerspricht die $x$-Gleichung.'])


# -------------------------------------------------------------- trace points ----
Q.q(r'Wo schneidet $' + E2 + '$ die $x$-Achse?',
    [r'In $(2 \mid 0 \mid 0)$', r'In $(1 \mid 0 \mid 0)$', r'In $(0 \mid 0 \mid 2)$', r'Gar nicht'],
    [r'Auf der $x$-Achse: $y = s = 0$ und $z = 2 - r - s = 0$, also $r = 2$.',
     r'$x = r = 2$'])

Q.q(r'Wo schneidet dieselbe Ebene die $y$-Achse?',
    [r'In $(0 \mid 2 \mid 0)$', r'In $(0 \mid 1 \mid 0)$', r'In $(0 \mid -2 \mid 0)$', r'Gar nicht'],
    [r'$x = r = 0$, $z = 2 - s = 0$, also $s = 2$, $y = 2$.'])

Q.q(r'Liegt $(1 \mid 1 \mid 0)$ in dieser Ebene?',
    [r'Ja, für $r = s = 1$.', r'Nein.', r'Ja, für $r = 1$, $s = 0$.', r'Ja, für $r = 0$, $s = 1$.'],
    [r'$x = r = 1$, $y = s = 1$, $z = 2 - 1 - 1 = 0$: passt.'])

# --------------------------------------------------- special planes and context ----
Q.q(r'Wie lautet eine Parameterform der $xy$-Ebene?',
    [r'$\vec{x} = r \cdot ' + vec(1, 0, 0) + r' + s \cdot ' + vec(0, 1, 0) + '$', r'$\vec{x} = r \cdot ' + vec(1, 0, 0) + r' + s \cdot ' + vec(0, 0, 1) + '$',
     r'$\vec{x} = ' + vec(0, 0, 1) + r' + r \cdot ' + vec(1, 1, 0) + '$', r'$\vec{x} = r \cdot ' + vec(1, 1, 1) + '$'],
    [r'Durch den Ursprung, aufgespannt von $x$- und $y$-Richtung.'])

Q.q(r'Welche Ebene ist parallel zur $xz$-Ebene und geht durch $(0 \mid 3 \mid 0)$?',
    [r'$\vec{x} = ' + vec(0, 3, 0) + r' + r \cdot ' + vec(1, 0, 0) + r' + s \cdot ' + vec(0, 0, 1) + '$',
     r'$\vec{x} = ' + vec(0, 3, 0) + r' + r \cdot ' + vec(1, 0, 0) + r' + s \cdot ' + vec(0, 1, 0) + '$',
     r'$\vec{x} = ' + vec(3, 0, 0) + r' + r \cdot ' + vec(0, 1, 0) + r' + s \cdot ' + vec(0, 0, 1) + '$',
     r'$\vec{x} = r \cdot ' + vec(0, 3, 0) + '$'],
    [r'Spannvektoren der $xz$-Ebene, verschoben um 3 in $y$-Richtung.'])

Q.q(r'Welches Paar kann NICHT die Spannvektoren einer Ebene bilden?',
    [r'$' + vec(1, 2, 3) + '$ und $' + vec(2, 4, 6) + '$', r'$' + vec(1, 0, 0) + '$ und $' + vec(0, 1, 0) + '$',
     r'$' + vec(1, 1, 0) + '$ und $' + vec(0, 1, 1) + '$', r'$' + vec(1, 2, 3) + '$ und $' + vec(3, 2, 1) + '$'],
    [r'$' + vec(2, 4, 6) + r' = 2 \cdot ' + vec(1, 2, 3) + '$: parallel.'])

Q.q(r'Welche Ebene enthält die $x$-Achse und den Punkt $(0 \mid 1 \mid 1)$?',
    [r'$\vec{x} = r \cdot ' + vec(1, 0, 0) + r' + s \cdot ' + vec(0, 1, 1) + '$', r'$\vec{x} = r \cdot ' + vec(0, 1, 0) + r' + s \cdot ' + vec(0, 0, 1) + '$',
     r'$\vec{x} = ' + vec(0, 1, 1) + r' + r \cdot ' + vec(0, 1, 1) + '$', r'$\vec{x} = r \cdot ' + vec(1, 1, 1) + '$'],
    [r'Stützpunkt Ursprung, ein Spannvektor ist die $x$-Richtung.',
     r'Der zweite zeigt zum Punkt $(0 \mid 1 \mid 1)$.'])

Q.q(r'Ein Architekt prüft, ob vier Eckpunkte eines Glasdachs in einer Ebene liegen. Wie geht er vor?',
    [r'Ebene durch drei Punkte aufstellen und die Punktprobe mit dem vierten machen.', r'Prüfen, ob alle vier Punkte dieselbe Höhe haben.',
     r'Die Abstände der Punkte vom Ursprung vergleichen.', r'Prüfen, ob die vier Punkte auf einer Geraden liegen.'],
    [r'Liegt der vierte Punkt in der Ebene, ist das Viereck eben.'])


def check():
    import sympy as sp
    V = lambda *c: sp.Matrix(c)
    r, s = sp.symbols('r s')
    A, B, C = V(1, 0, 0), V(0, 1, 0), V(0, 0, 1)
    assert B - A == V(-1, 1, 0) and C - A == V(-1, 0, 1)
    e1 = A + r * V(-1, 1, 0) + s * V(-1, 0, 1)
    assert sp.solve(list(e1 - V(0, 0, 1)), [r, s]) == {r: 0, s: 1}
    assert sp.solve(list(e1 - V(1, 1, 1)), [r, s]) == []
    assert e1.subs({r: 1, s: 2}) == V(-2, 1, 2)
    third = sp.Rational(1, 3)
    assert e1.subs({r: third, s: third}) == V(third, third, third)
    assert sp.solve(list(e1 - V(1, 1, -2)), [r, s]) == [] and sp.solve(list(e1), [r, s]) == []
    a, b, c = V(0, 0, 3), V(4, 0, 3), V(4, 2, 5)
    assert b - a == V(4, 0, 0) and c - a == V(4, 2, 2)
    assert sp.solve(list(a + r * (b - a) + s * (c - a) - V(0, 2, 5)), [r, s]) == {r: -1, s: 1}
    e2 = V(0, 0, 2) + r * V(1, 0, -1) + s * V(0, 1, -1)
    assert sp.solve([e2[1], e2[2]], [r, s]) == {r: 2, s: 0} and e2.subs({r: 2, s: 0}) == V(2, 0, 0)
    assert sp.solve([e2[0], e2[2]], [r, s]) == {r: 0, s: 2} and e2.subs({r: 0, s: 2}) == V(0, 2, 0)
    assert e2.subs({r: 1, s: 1}) == V(1, 1, 0)
    assert V(2, 4, 6) == 2 * V(1, 2, 3)


Q.verify(check)
Q.save()
