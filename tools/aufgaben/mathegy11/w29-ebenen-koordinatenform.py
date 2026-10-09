#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 29 / KW 15 (LB 3): planes in parameter-free form - coordinate
form, intercepts, eliminating parameters, special positions. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11, vec

Q = gy11(nr=29, slug='ebenen-koordinatenform', thema='Ebenen in parameterfreier Form', lb='LB 3',
         blurb='Koordinatenform, Achsenabschnitte, Parameter eliminieren, besondere Lagen',
         comment='Blocks: coordinate form and point test (1-3), intercepts (4-8), eliminating parameters (9-12), special positions (13-17), relations between planes (18-20).')

# ----------------------------------------------- coordinate form and point test ----
Q.q(r'Welche Form hat eine Ebenengleichung in Koordinatenform?',
    [r'$ax + by + cz = d$', r'$y = mx + n$', r'$\vec{x} = \vec{p} + t \cdot \vec{u}$', r'$x^2 + y^2 + z^2 = r^2$'],
    [r'Eine lineare Gleichung in $x$, $y$, $z$ ohne Parameter.'])

Q.q(r'Liegt $P(1 \mid 2 \mid 3)$ in der Ebene $2x - y + z = 3$?',
    [r'Ja, $2 - 2 + 3 = 3$.', r'Nein, $2 - 2 + 3 = 5$.', r'Nein, weil $P$ nicht auf einer Achse liegt.', r'Das lässt sich ohne Parameterform nicht prüfen.'],
    [r'Punktprobe: Koordinaten einsetzen und prüfen, ob die Gleichung stimmt.'])

Q.q(r'Liegt $(3 \mid 2 \mid 0)$ in der Ebene $2x + 3y + 6z = 12$?',
    [r'Ja', r'Nein', r'Nur für $z = 1$', r'Nur, wenn man die Gleichung durch 6 teilt'],
    [r'$6 + 6 + 0 = 12$: passt.'])

# --------------------------------------------------------------- intercepts ----
Q.q(r'Wo schneidet $2x + 3y + 6z = 12$ die Koordinatenachsen?',
    [r'$(6 \mid 0 \mid 0)$, $(0 \mid 4 \mid 0)$, $(0 \mid 0 \mid 2)$', r'$(2 \mid 0 \mid 0)$, $(0 \mid 3 \mid 0)$, $(0 \mid 0 \mid 6)$',
     r'$(12 \mid 0 \mid 0)$, $(0 \mid 12 \mid 0)$, $(0 \mid 0 \mid 12)$', r'$(6 \mid 4 \mid 2)$'],
    [r'Auf der $x$-Achse ist $y = z = 0$: $2x = 12$, also $x = 6$.',
     r'Ebenso $3y = 12$ und $6z = 12$.'])

Q.q(r'Wie lautet die Achsenabschnittsform von $2x + 3y + 6z = 12$?',
    [r'$\dfrac{x}{6} + \dfrac{y}{4} + \dfrac{z}{2} = 1$', r'$\dfrac{x}{2} + \dfrac{y}{3} + \dfrac{z}{6} = 1$',
     r'$x + y + z = 12$', r'$\dfrac{x}{6} + \dfrac{y}{4} + \dfrac{z}{2} = 12$'],
    [r'Durch 12 teilen.',
     r'Die Nenner sind die Achsenabschnitte.'])

Q.q(r'Welche Ebene schneidet die Achsen in $(2 \mid 0 \mid 0)$, $(0 \mid 3 \mid 0)$ und $(0 \mid 0 \mid 6)$?',
    [r'$3x + 2y + z = 6$', r'$2x + 3y + 6z = 6$', r'$x + y + z = 11$', r'$6x + 3y + 2z = 6$'],
    [r'Achsenabschnittsform: $\dfrac{x}{2} + \dfrac{y}{3} + \dfrac{z}{6} = 1$.',
     r'Mal 6: $3x + 2y + z = 6$.'])

Q.q(r'Durch welche Punkte geht die Ebene $x + y + z = 2$ auf den Achsen?',
    [r'$(2 \mid 0 \mid 0)$, $(0 \mid 2 \mid 0)$, $(0 \mid 0 \mid 2)$', r'$(1 \mid 1 \mid 0)$ und $(0 \mid 0 \mid 2)$',
     r'Nur durch den Ursprung', r'$(1 \mid 0 \mid 0)$, $(0 \mid 1 \mid 0)$, $(0 \mid 0 \mid 1)$'],
    [r'Zwei Koordinaten null setzen, die dritte ist 2.'])

Q.q(r'Welchen Punkt der Ebene $3x + 2y + z = 6$ erhält man für $x = 1$, $y = 1$?',
    [r'$(1 \mid 1 \mid 1)$', r'$(1 \mid 1 \mid 6)$', r'$(1 \mid 1 \mid 0)$', r'$(1 \mid 1 \mid 3)$'],
    [r'$3 + 2 + z = 6 \Rightarrow z = 1$'])

# --------------------------------------------------- eliminating parameters ----
Q.q(r'Bestimme die Koordinatenform von $\vec{x} = ' + vec(0, 0, 2) + r' + r \cdot ' + vec(1, 0, -1) + r' + s \cdot ' + vec(0, 1, -1) + '$.',
    [r'$x + y + z = 2$', r'$x - y + z = 2$', r'$x + y - z = 2$', r'$z = 2$'],
    [r'$x = r$, $y = s$, $z = 2 - r - s$',
     r'Einsetzen: $z = 2 - x - y$, also $x + y + z = 2$.'])

Q.q(r'Bestimme die Koordinatenform von $\vec{x} = ' + vec(1, 0, 0) + r' + r \cdot ' + vec(0, 1, 0) + r' + s \cdot ' + vec(0, 0, 1) + '$.',
    [r'$x = 1$', r'$y + z = 1$', r'$x + y + z = 1$', r'$y = 1$'],
    [r'$x = 1$ für alle Parameter; $y$ und $z$ sind frei.',
     r'Eine Ebene parallel zur $yz$-Ebene.'])

Q.q(r'Bestimme die Koordinatenform von $\vec{x} = ' + vec(1, 1, 1) + r' + r \cdot ' + vec(1, 0, 0) + r' + s \cdot ' + vec(0, 1, 1) + '$.',
    [r'$y - z = 0$', r'$x = 1$', r'$y + z = 2$', r'$x + y - z = 1$'],
    [r'$x = 1 + r$ (frei), $y = 1 + s$, $z = 1 + s$',
     r'Also immer $y = z$: $y - z = 0$.'])

Q.q(r'Wie gewinnt man aus $x + 2y + z = 4$ eine Parameterform?',
    [r'Nach $x$ auflösen: $x = 4 - 2y - z$; $y = r$, $z = s$ frei wählen.', r'Die Koeffizienten als Stützvektor nehmen.',
     r'Durch 4 teilen.', r'Das geht nicht.'],
    [r'$\vec{x} = ' + vec(4, 0, 0) + r' + r \cdot ' + vec(-2, 1, 0) + r' + s \cdot ' + vec(-1, 0, 1) + '$'])

# ------------------------------------------------------- special positions ----
Q.q(r'Welche Ebene beschreibt $z = 0$?',
    [r'Die $xy$-Ebene', r'Die $z$-Achse', r'Die $xz$-Ebene', r'Den Ursprung'],
    [r'Alle Punkte mit Höhe null.'])

Q.q(r'Wie liegt die Ebene $3x + 2y = 6$?',
    [r'Parallel zur $z$-Achse', r'Parallel zur $xy$-Ebene', r'Sie enthält den Ursprung.', r'Parallel zur $x$-Achse'],
    [r'$z$ kommt nicht vor, ist also frei.',
     r'Jede Senkrechte über einem Punkt der Geraden $3x + 2y = 6$ liegt in der Ebene.'])

Q.q(r'Wie liegt die Ebene $y = 4$?',
    [r'Parallel zur $xz$-Ebene im Abstand 4', r'Parallel zur $yz$-Ebene', r'Sie ist die $y$-Achse.', r'Parallel zur $xy$-Ebene'],
    [r'$x$ und $z$ sind frei, $y$ ist fest.'])

Q.q(r'Welche Ebene geht durch den Ursprung?',
    [r'$2x - y + 3z = 0$', r'$2x - y + 3z = 1$', r'$x = 1$', r'$x + y + z = 2$'],
    [r'Ursprung einsetzen: $0 = d$.',
     r'Also genau dann, wenn $d = 0$.'])

Q.q(r'Was beschreibt $x - y = 0$ im Raum?',
    [r'Eine Ebene, die die $z$-Achse enthält', r'Eine Gerade', r'Die Winkelhalbierende in der $xy$-Ebene, sonst nichts', r'Den Ursprung'],
    [r'$z$ ist frei, und $(0 \mid 0 \mid z)$ erfüllt die Gleichung.',
     r'Im Raum ist eine lineare Gleichung immer eine Ebene.'])

# -------------------------------------------------- relations between planes ----
Q.q(r'Wie liegen $2x - y + z = 3$ und $4x - 2y + 2z = 10$ zueinander?',
    [r'Parallel und verschieden', r'Identisch', r'Sie schneiden sich in einer Geraden.', r'Sie schneiden sich in einem Punkt.'],
    [r'Die linke Seite der zweiten ist das Doppelte der ersten.',
     r'Rechts aber $10 \neq 2 \cdot 3$: parallel, keine gemeinsamen Punkte.'])

Q.q(r'Welche Gleichung beschreibt dieselbe Ebene wie $2x - y + z = 3$?',
    [r'$4x - 2y + 2z = 6$', r'$4x - 2y + 2z = 3$', r'$2x + y + z = 3$', r'$x - y + z = 3$'],
    [r'Die ganze Gleichung mit 2 multipliziert ändert die Lösungsmenge nicht.'])

Q.q(r'Wie verläuft die Spurgerade von $2x + 3y + 6z = 12$ in der $xy$-Ebene?',
    [r'$2x + 3y = 12$ mit $z = 0$', r'$6z = 12$', r'$x + y = 1$ mit $z = 0$', r'$2x + 3y + 6z = 0$'],
    [r'In der $xy$-Ebene ist $z = 0$.',
     r'Sie verbindet die Spurpunkte $(6 \mid 0 \mid 0)$ und $(0 \mid 4 \mid 0)$.'])


def check():
    import sympy as sp
    x, y, z, r, s = sp.symbols('x y z r s')
    assert 2 * 1 - 2 + 3 == 3 and 2 * 3 + 3 * 2 + 0 == 12
    E = 2 * x + 3 * y + 6 * z - 12
    assert sp.solve(E.subs({y: 0, z: 0}), x) == [6] and sp.solve(E.subs({x: 0, z: 0}), y) == [4] and sp.solve(E.subs({x: 0, y: 0}), z) == [2]
    assert sp.expand(E / 12 + 1 - (x / 6 + y / 4 + z / 2)) == 0
    F = 3 * x + 2 * y + z - 6
    assert F.subs({x: 2, y: 0, z: 0}) == 0 and F.subs({x: 0, y: 3, z: 0}) == 0 and F.subs({x: 0, y: 0, z: 6}) == 0
    assert sp.solve(F.subs({x: 1, y: 1}), z) == [1]
    P = sp.Matrix([0, 0, 2]) + r * sp.Matrix([1, 0, -1]) + s * sp.Matrix([0, 1, -1])
    assert sp.expand(P[0] + P[1] + P[2]) == 2
    P2 = sp.Matrix([1, 1, 1]) + r * sp.Matrix([1, 0, 0]) + s * sp.Matrix([0, 1, 1])
    assert sp.expand(P2[1] - P2[2]) == 0
    P3 = sp.Matrix([4, 0, 0]) + r * sp.Matrix([-2, 1, 0]) + s * sp.Matrix([-1, 0, 1])
    assert sp.expand(P3[0] + 2 * P3[1] + P3[2]) == 4
    assert sp.solve([2 * x - y + z - 3, 4 * x - 2 * y + 2 * z - 10], [x, y, z]) == []
    assert sp.expand(2 * (2 * x - y + z - 3) - (4 * x - 2 * y + 2 * z - 6)) == 0


Q.verify(check)
Q.save()
