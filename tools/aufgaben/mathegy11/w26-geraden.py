#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 26 / KW 11 (LB 3): lines in parametric form - setting up,
point test, segments, trace points, motion. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11, vec

Q = gy11(nr=26, slug='geraden', thema='Geraden in Parameterform', lb='LB 3',
         blurb='Geradengleichung aufstellen, Punktprobe, Strecken, Spurpunkte, Bewegungen',
         comment='Blocks: setting up (1-6), point test and parameters (7-12), segments and trace points (13-16), motion (17-20).')

G = r'g\colon \vec{x} = ' + vec(1, 2, 3) + r' + t \cdot ' + vec(2, 0, -1)

# ---------------------------------------------------------------- setting up ----
Q.q(r'Wie lautet die Gerade durch $A(1 \mid 2 \mid 3)$ mit dem Richtungsvektor $' + vec(2, 0, -1) + '$?',
    [r'$\vec{x} = ' + vec(1, 2, 3) + r' + t \cdot ' + vec(2, 0, -1) + '$', r'$\vec{x} = ' + vec(2, 0, -1) + r' + t \cdot ' + vec(1, 2, 3) + '$',
     r'$\vec{x} = t \cdot ' + vec(3, 2, 2) + '$', r'$\vec{x} = ' + vec(1, 2, 3) + r' \cdot ' + vec(2, 0, -1) + '$'],
    [r'Stützvektor: Ortsvektor eines Punktes der Geraden.',
     r'Dazu ein beliebiges Vielfaches des Richtungsvektors.'])

Q.q(r'Welcher Richtungsvektor passt zur Geraden durch $A(1 \mid 0 \mid 2)$ und $B(3 \mid 4 \mid 2)$?',
    [r'$' + vec(2, 4, 0) + '$', r'$' + vec(4, 4, 4) + '$', r'$' + vec(3, 4, 2) + '$', r'$' + vec(1, 0, 2) + '$'],
    [r'$\overrightarrow{AB} = \vec{b} - \vec{a}$.'])

Q.q(r'Welcher Vektor ist ebenfalls ein Richtungsvektor der Geraden durch $(2 \mid 1 \mid 0)$ und $(4 \mid 5 \mid 2)$?',
    [r'$' + vec(1, 2, 1) + '$', r'$' + vec(2, 1, 0) + '$', r'$' + vec(6, 6, 2) + '$', r'$' + vec(1, 1, 1) + '$'],
    [r'$\overrightarrow{AB} = ' + vec(2, 4, 2) + '$',
     r'Jedes Vielfaches ungleich null ist auch Richtungsvektor, z. B. die Hälfte.'])

Q.q(r'Wie lautet eine Gleichung der $z$-Achse?',
    [r'$\vec{x} = t \cdot ' + vec(0, 0, 1) + '$', r'$\vec{x} = t \cdot ' + vec(1, 1, 0) + '$', r'$\vec{x} = ' + vec(0, 0, 1) + '$', r'$z = 0$'],
    [r'Sie geht durch den Ursprung und verläuft in $z$-Richtung.'])

Q.q(r'Wie lautet die Gerade durch $(0 \mid 2 \mid 3)$ parallel zur $x$-Achse?',
    [r'$\vec{x} = ' + vec(0, 2, 3) + r' + t \cdot ' + vec(1, 0, 0) + '$', r'$\vec{x} = ' + vec(1, 0, 0) + r' + t \cdot ' + vec(0, 2, 3) + '$',
     r'$\vec{x} = ' + vec(0, 2, 3) + r' + t \cdot ' + vec(0, 1, 1) + '$', r'$\vec{x} = t \cdot ' + vec(0, 2, 3) + '$'],
    [r'Parallel zur $x$-Achse: Richtungsvektor $' + vec(1, 0, 0) + '$.'])

Q.q(r'Kann der Nullvektor Richtungsvektor einer Geraden sein?',
    [r'Nein, dann bliebe man im Stützpunkt stehen.', r'Ja, immer.', r'Nur für die Koordinatenachsen.', r'Nur wenn der Stützvektor auch null ist.'],
    [r'$\vec{p} + t \cdot \vec{o} = \vec{p}$ für jedes $t$: Das ist nur ein Punkt.'])

# ------------------------------------------------- point test and parameters ----
Q.q(r'Liegt $P(5 \mid 2 \mid 1)$ auf $' + G + '$?',
    [r'Ja, für $t = 2$.', r'Nein.', r'Ja, für $t = 1$.', r'Ja, für $t = 5$.'],
    [r'$x$: $1 + 2t = 5 \Rightarrow t = 2$',
     r'$y$: $2 = 2$ passt; $z$: $3 - 2 = 1$ passt.'])

Q.q(r'Liegt $Q(3 \mid 1 \mid 2)$ auf $' + G + '$?',
    [r'Nein, die $y$-Koordinate passt nicht.', r'Ja, für $t = 1$.', r'Ja, für $t = -1$.', r'Nein, die $x$-Koordinate passt nicht.'],
    [r'$x$: $t = 1$; damit $z = 2$ passt.',
     r'Aber $y$ ist auf $g$ immer 2, nicht 1.'])

Q.q(r'Welcher Punkt von $' + G + '$ gehört zu $t = -1$?',
    [r'$(-1 \mid 2 \mid 4)$', r'$(3 \mid 2 \mid 2)$', r'$(-1 \mid 2 \mid 2)$', r'$(1 \mid 2 \mid 3)$'],
    [r'$' + vec(1, 2, 3) + ' - ' + vec(2, 0, -1) + ' = ' + vec(-1, 2, 4) + '$'])

Q.q(r'Für welchen Parameter liegt $(4 \mid 4 \mid 1)$ auf $\vec{x} = ' + vec(2, 2, 3) + r' + t \cdot ' + vec(1, 1, -1) + '$?',
    [r'$t = 2$', r'$t = 4$', r'$t = 1$', r'$t = -2$'],
    [r'$2 + t = 4$, $2 + t = 4$, $3 - t = 1$: Alle drei liefern $t = 2$.'])

Q.q(r'Wie lautet die Gerade durch den Ursprung und $P(1 \mid 1 \mid 1)$?',
    [r'$\vec{x} = t \cdot ' + vec(1, 1, 1) + '$', r'$\vec{x} = ' + vec(1, 1, 1) + '$', r'$\vec{x} = ' + vec(1, 1, 1) + r' + t \cdot ' + vec(0, 0, 0) + '$', r'$x + y + z = 1$'],
    [r'Stützvektor $\vec{o}$, Richtung $\overrightarrow{OP}$.',
     r'Das ist die Raumdiagonale durch den Einheitswürfel.'])

Q.q(r'Welcher Punkt von $' + G + '$ hat die $x$-Koordinate 0?',
    [r'$(0 \mid 2 \mid 3{,}5)$', r'$(0 \mid 2 \mid 2{,}5)$', r'$(0 \mid 0 \mid 3)$', r'Keiner'],
    [r'$1 + 2t = 0 \Rightarrow t = -\dfrac{1}{2}$',
     r'$z = 3 + \dfrac{1}{2} = 3{,}5$'])

# -------------------------------------------- segments and trace points ----
Q.q(r'Die Strecke $AB$ wird durch $\vec{x} = \vec{a} + t \cdot \overrightarrow{AB}$ beschrieben. Welche Parameter gehören dazu?',
    [r'$0 \leq t \leq 1$', r'$t \geq 0$', r'$-1 \leq t \leq 1$', r'Alle reellen $t$'],
    [r'$t = 0$ liefert $A$, $t = 1$ liefert $B$.',
     r'Werte dazwischen liefern die Punkte der Strecke; $t = \dfrac{1}{2}$ den Mittelpunkt.'])

Q.q(r'Wo durchstößt $' + G + '$ die $xy$-Ebene?',
    [r'In $(7 \mid 2 \mid 0)$', r'In $(1 \mid 2 \mid 0)$', r'In $(-5 \mid 2 \mid 0)$', r'Gar nicht'],
    [r'In der $xy$-Ebene ist $z = 0$: $3 - t = 0 \Rightarrow t = 3$.',
     r'$x = 1 + 6 = 7$, $y = 2$.'])

Q.q(r'Wie viele Geraden gibt es durch zwei verschiedene Punkte?',
    [r'Genau eine', r'Keine', r'Zwei', r'Unendlich viele'],
    [r'Zwei verschiedene Punkte legen eine Gerade eindeutig fest.',
     r'Ihre Gleichung kann man aber auf viele Arten aufschreiben.'])

Q.q(r'Was haben $\vec{x} = ' + vec(1, 0, 0) + r' + t \cdot ' + vec(1, 1, 0) + r'$ und $\vec{x} = ' + vec(3, 2, 0) + r' + s \cdot ' + vec(-2, -2, 0) + '$ gemeinsam?',
    [r'Es ist dieselbe Gerade.', r'Sie sind parallel und verschieden.', r'Sie schneiden sich in genau einem Punkt.', r'Nichts.'],
    [r'Die Richtungsvektoren sind Vielfache: $' + vec(-2, -2, 0) + r' = -2 \cdot ' + vec(1, 1, 0) + '$.',
     r'$(3 \mid 2 \mid 0)$ liegt auf der ersten für $t = 2$: identisch.'])

# --------------------------------------------------------------------- motion ----
Q.q(r'Ein Flugzeug ist zur Zeit $t = 0$ in $(0 \mid 0 \mid 1)$ und bewegt sich pro Minute um $' + vec(6, 8, 0) + r'$ (in km). Wo ist es nach 5 Minuten?',
    [r'$(30 \mid 40 \mid 1)$', r'$(30 \mid 40 \mid 5)$', r'$(6 \mid 8 \mid 1)$', r'$(11 \mid 13 \mid 6)$'],
    [r'$' + vec(0, 0, 1) + r' + 5 \cdot ' + vec(6, 8, 0) + '$'])

Q.q(r'Wie schnell fliegt dieses Flugzeug?',
    [r'10 km pro Minute, also 600 km/h', r'14 km pro Minute', r'48 km pro Minute', r'100 km pro Minute'],
    [r'Betrag des Richtungsvektors: $\sqrt{36 + 64} = 10$.',
     r'10 km/min mal 60 = 600 km/h.'])

Q.q(r'Was gibt bei $\vec{x} = \vec{p} + t \cdot \vec{v}$ der Abstand der Punkte für $t = 0$ und $t = 1$ an?',
    [r'Die Länge $|\vec{v}|$ des Richtungsvektors', r'Den Abstand vom Ursprung', r'Immer 1', r'Die Länge $|\vec{p}|$'],
    [r'Der Unterschied der beiden Punkte ist genau $\vec{v}$.'])

Q.q(r'Ein Ballon steigt von $(2 \mid 3 \mid 0)$ aus nach $\vec{x} = ' + vec(2, 3, 0) + r' + t \cdot ' + vec(1, 0, 2) + r'$ ($t$ in Minuten, Angaben in 100 m). Wann erreicht er 1000 m Höhe?',
    [r'Nach 5 Minuten', r'Nach 10 Minuten', r'Nach 2 Minuten', r'Nach 500 Minuten'],
    [r'1000 m sind 10 Einheiten: $2t = 10$.',
     r'$t = 5$'])


def check():
    import sympy as sp
    V = lambda *c: sp.Matrix(c)
    t = sp.symbols('t')
    g = V(1, 2, 3) + t * V(2, 0, -1)
    assert g.subs(t, 2) == V(5, 2, 1) and g.subs(t, -1) == V(-1, 2, 4)
    assert sp.solve(list(g - V(3, 1, 2)), t) == []
    assert V(3, 4, 2) - V(1, 0, 2) == V(2, 4, 0)
    assert (V(4, 5, 2) - V(2, 1, 0)) / 2 == V(1, 2, 1)
    assert (V(2, 2, 3) + t * V(1, 1, -1)).subs(t, 2) == V(4, 4, 1)
    assert g.subs(t, -sp.Rational(1, 2)) == V(0, 2, sp.Rational(7, 2))
    assert sp.solve(g[2], t) == [3] and g.subs(t, 3) == V(7, 2, 0)
    assert V(-2, -2, 0) == -2 * V(1, 1, 0) and V(1, 0, 0) + 2 * V(1, 1, 0) == V(3, 2, 0)
    assert V(0, 0, 1) + 5 * V(6, 8, 0) == V(30, 40, 1) and V(6, 8, 0).norm() == 10
    assert sp.solve(2 * t - 10, t) == [5]


Q.verify(check)
Q.save()
