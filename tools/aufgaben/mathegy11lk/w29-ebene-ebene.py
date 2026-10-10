#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 29 / KW 15 (LB 3): position of two planes and their line of intersection, then
all relative positions in comparison. 13 new questions, 7 from the Grundkurs sheets mathegy11/w27, w29 and w30.
Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=29, slug='ebene-ebene', thema='Lage zweier Ebenen, Schnittgerade', lb='LB 3',
           blurb='parallel, identisch, schneidend, Schnittgerade bestimmen, alle Lagebeziehungen im Vergleich',
           comment='New questions on two planes; 7 from mathegy11/w27, w29 and w30 for the comparison of all positions.')

qs_k, check_k = harvest('w29-ebenen-koordinatenform.py', [12, 13, 14, 17, 18])
qs_l, check_l = harvest('w27-lage-geraden.py', [19])
qs_e, check_e = harvest('w30-gerade-ebene.py', [0])
koord = dict(zip([12, 13, 14, 17, 18], qs_k))


def take(q):
    Q.q(*q[0], **q[1])


Q.q(r'Welche Lagen können zwei Ebenen im Raum zueinander haben?',
    [r'parallel und verschieden, identisch oder schneidend in einer Geraden', r'nur parallel oder identisch',
     r'schneidend in einem Punkt, parallel oder windschief', r'nur schneidend'],
    [r'Windschief gibt es nur bei Geraden.',
     r'Zwei nicht parallele Ebenen schneiden sich immer, und zwar in einer ganzen Geraden.'])

Q.q(r'Woran erkennt man an den Koordinatenformen, dass zwei Ebenen parallel sind?',
    [r'Die Koeffizienten von $x$, $y$, $z$ sind Vielfache voneinander.', r'Die rechten Seiten sind gleich.',
     r'Beide Ebenen gehen durch den Ursprung.', r'Ein Koeffizient ist 0.'],
    [r'Beispiel: $2x - y + z = 3$ und $4x - 2y + 2z = 10$.',
     r'Ist auch die rechte Seite im selben Verhältnis, sind die Ebenen identisch.'])
take(koord[17])
take(koord[18])

Q.q(r'Für welches $a$ sind $x + ay + 2z = 1$ und $2x + 4y + 4z = 5$ parallel?',
    [r'$a = 2$', r'$a = 4$', r'$a = 1$', r'für kein $a$'],
    [r'Die zweite Ebene hat die doppelten Koeffizienten: $2 \cdot a = 4$.',
     r'Mit $a = 2$: rechte Seiten 1 und 5 statt 1 und 2, also parallel und verschieden.'])

Q.q(r'Warum hat das Gleichungssystem zweier schneidender Ebenen in Koordinatenform unendlich viele Lösungen?',
    [r'Zwei Gleichungen, drei Unbekannte: Eine Variable bleibt frei und wird zum Parameter der Schnittgeraden.', r'Weil es keine Lösung hat.',
     r'Weil die Ebenen identisch sind.', r'Weil jede Gleichung schon eine Gerade ist.'],
    [r'Der freie Parameter $t$ durchläuft alle Punkte der Schnittgeraden.'])

Q.q(r'Bestimme die Schnittgerade von $E\colon x + y + z = 6$ und $F\colon x - y = 0$.',
    [r'$\vec{x} = \begin{pmatrix} 0 \\ 0 \\ 6 \end{pmatrix} + t \cdot \begin{pmatrix} 1 \\ 1 \\ -2 \end{pmatrix}$',
     r'$\vec{x} = \begin{pmatrix} 0 \\ 0 \\ 6 \end{pmatrix} + t \cdot \begin{pmatrix} 1 \\ -1 \\ 0 \end{pmatrix}$',
     r'$\vec{x} = \begin{pmatrix} 6 \\ 0 \\ 0 \end{pmatrix} + t \cdot \begin{pmatrix} 1 \\ 1 \\ 1 \end{pmatrix}$',
     r'$\vec{x} = \begin{pmatrix} 3 \\ 3 \\ 0 \end{pmatrix} + t \cdot \begin{pmatrix} 1 \\ 1 \\ 2 \end{pmatrix}$'],
    [r'Aus $F$: $y = x$. Setze $x = t$, dann $y = t$.',
     r'Aus $E$: $z = 6 - 2t$.'])

Q.q(r'Bestimme die Schnittgerade von $E\colon x + 2y - z = 3$ und $F\colon 2x + y + z = 6$.',
    [r'$\vec{x} = \begin{pmatrix} 3 \\ 0 \\ 0 \end{pmatrix} + t \cdot \begin{pmatrix} -1 \\ 1 \\ 1 \end{pmatrix}$',
     r'$\vec{x} = \begin{pmatrix} 3 \\ 0 \\ 0 \end{pmatrix} + t \cdot \begin{pmatrix} 1 \\ 1 \\ 1 \end{pmatrix}$',
     r'$\vec{x} = \begin{pmatrix} 0 \\ 3 \\ 3 \end{pmatrix} + t \cdot \begin{pmatrix} 1 \\ 2 \\ -1 \end{pmatrix}$',
     r'$\vec{x} = \begin{pmatrix} 1 \\ 1 \\ 0 \end{pmatrix} + t \cdot \begin{pmatrix} -1 \\ 1 \\ 1 \end{pmatrix}$'],
    [r'Addieren eliminiert $z$: $3x + 3y = 9$, also $x = 3 - y$.',
     r'Mit $y = t$: $x = 3 - t$ und $z = x + 2y - 3 = t$.',
     r'Probe in $F$: $2(3 - t) + t + t = 6$.'])

Q.q(r'Wo schneiden sich die $xy$-Ebene und die Ebene $x + z = 2$?',
    [r'in der Geraden $\vec{x} = \begin{pmatrix} 2 \\ 0 \\ 0 \end{pmatrix} + t \cdot \begin{pmatrix} 0 \\ 1 \\ 0 \end{pmatrix}$', r'im Punkt $(2 \mid 0 \mid 0)$',
     r'in der Geraden $\vec{x} = t \cdot \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix}$', r'gar nicht, sie sind parallel'],
    [r'$z = 0$ eingesetzt: $x = 2$, $y$ beliebig.',
     r'Das ist die Spurgerade der Ebene in der $xy$-Ebene.'])

Q.q(r'In welcher Geraden schneiden sich die Ebenen $x = 0$ und $y = 0$?',
    [r'in der $z$-Achse', r'in der $x$-Achse', r'im Ursprung', r'gar nicht'],
    [r'$x = 0$ ist die $yz$-Ebene, $y = 0$ die $xz$-Ebene.',
     r'Gemeinsam: alle Punkte $(0 \mid 0 \mid t)$, also $\vec{x} = t \cdot \begin{pmatrix} 0 \\ 0 \\ 1 \end{pmatrix}$.'])

Q.q(r'Wie bestimmt man die Schnittgerade, wenn $E$ in Parameterform und $F$ in Koordinatenform gegeben ist?',
    [r'Die Parameterform in $F$ einsetzen, nach einem Parameter auflösen und in $E$ zurück einsetzen.', r'Beide Ebenen gleichsetzen und die Parameter vergleichen.',
     r'Die Koeffizienten von $F$ als Richtungsvektor nehmen.', r'Das geht nur mit dem CAS.'],
    [r'Man erhält eine Gleichung in $r$ und $s$, zum Beispiel $s = 2 - 2r$.',
     r'Eingesetzt bleibt ein Parameter übrig: die Schnittgerade.'])

Q.q(r'$E\colon \vec{x} = r \cdot \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix} + s \cdot \begin{pmatrix} 0 \\ 1 \\ 0 \end{pmatrix}$ und $F\colon x + y + z = 2$. Wie lautet die Schnittgerade?',
    [r'$\vec{x} = \begin{pmatrix} 0 \\ 2 \\ 0 \end{pmatrix} + r \cdot \begin{pmatrix} 1 \\ -2 \\ 1 \end{pmatrix}$',
     r'$\vec{x} = \begin{pmatrix} 2 \\ 0 \\ 0 \end{pmatrix} + r \cdot \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix}$',
     r'$\vec{x} = \begin{pmatrix} 0 \\ 2 \\ 0 \end{pmatrix} + r \cdot \begin{pmatrix} 1 \\ 2 \\ 1 \end{pmatrix}$',
     r'$\vec{x} = r \cdot \begin{pmatrix} 1 \\ 1 \\ 1 \end{pmatrix}$'],
    [r'Einsetzen in $F$: $r + s + r = 2$, also $s = 2 - 2r$.',
     r'$\vec{x} = r \cdot \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix} + (2 - 2r) \cdot \begin{pmatrix} 0 \\ 1 \\ 0 \end{pmatrix} = \begin{pmatrix} 0 \\ 2 \\ 0 \end{pmatrix} + r \cdot \begin{pmatrix} 1 \\ -2 \\ 1 \end{pmatrix}$'])

Q.q(r'Wie viele gemeinsame Punkte haben die drei Ebenen $x = 1$, $y = 2$ und $z = 3$?',
    [r'genau einen, $(1 \mid 2 \mid 3)$', r'keinen', r'unendlich viele auf einer Geraden', r'drei'],
    [r'Jede Ebene legt eine Koordinate fest.',
     r'Drei Ebenen können sich in genau einem Punkt schneiden: Das Gleichungssystem mit drei Unbekannten ist eindeutig lösbar.'])

Q.q(r'Welche Ebene ist parallel zu $2x + y - z = 4$ und geht durch $P(1 \mid 1 \mid 1)$?',
    [r'$2x + y - z = 2$', r'$2x + y - z = 4$', r'$x + y + z = 3$', r'$2x + y - z = 1$'],
    [r'Gleiche Koeffizienten, nur die rechte Seite ändert sich.',
     r'$P$ einsetzen: $2 + 1 - 1 = 2$.'])

Q.q(r'Eine Dachfläche liegt in der Ebene $x + z = 10$, die Giebelwand in $y = 0$. Entlang welcher Geraden treffen sie sich?',
    [r'$\vec{x} = \begin{pmatrix} 0 \\ 0 \\ 10 \end{pmatrix} + t \cdot \begin{pmatrix} 1 \\ 0 \\ -1 \end{pmatrix}$',
     r'$\vec{x} = \begin{pmatrix} 0 \\ 0 \\ 10 \end{pmatrix} + t \cdot \begin{pmatrix} 0 \\ 1 \\ 0 \end{pmatrix}$',
     r'$\vec{x} = \begin{pmatrix} 10 \\ 0 \\ 0 \end{pmatrix} + t \cdot \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix}$', r'Sie treffen sich nicht.'],
    [r'$y = 0$ und $z = 10 - x$; mit $x = t$ folgt $z = 10 - t$.',
     r'Die Gerade ist die Dachkante an der Giebelwand.'])

# ---------------------------------------------------- all positions compared ----
take(koord[12])
take(koord[13])
take(koord[14])
take(qs_e[0])
take(qs_l[0])


def check():
    import sympy as sp
    check_k()
    check_l()
    check_e()
    x, y, z, t, r, s, a = sp.symbols('x y z t r s a')

    def on(line, *planes):
        return all(sp.simplify(p.subs({x: line[0], y: line[1], z: line[2]})) == 0 for p in planes)
    assert on((t, t, 6 - 2 * t), x + y + z - 6, x - y)
    assert not on((t, -t, 6), x + y + z - 6, x - y) and not on((6 + t, t, t), x + y + z - 6, x - y)
    assert on((3 - t, t, t), x + 2 * y - z - 3, 2 * x + y + z - 6)
    assert not on((3 + t, t, t), x + 2 * y - z - 3, 2 * x + y + z - 6) and not on((1 - t, 1 + t, t), x + 2 * y - z - 3, 2 * x + y + z - 6)
    assert on((2, t, 0), z, x + z - 2)
    E = r * sp.Matrix([1, 0, 1]) + (2 - 2 * r) * sp.Matrix([0, 1, 0])
    assert E == sp.Matrix([0, 2, 0]) + r * sp.Matrix([1, -2, 1]) and on(tuple(E), x + y + z - 2)
    assert sp.solve(2 * a - 4, a) == [2] and sp.Rational(5, 2) != 1
    assert 2 * 1 + 1 - 1 == 2
    assert on((t, 0, 10 - t), x + z - 10, y) and on((0, 0, t), x, y)


Q.verify(check)
Q.save()
