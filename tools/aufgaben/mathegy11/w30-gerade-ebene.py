#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 30 / KW 16 (LB 3): relative position of a line and a plane -
intersecting, parallel, lying in; points of intersection, shadows and flight paths.
Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11, vec


def line(p, u):
    return r'g\colon \vec{x} = ' + vec(*p) + r' + t \cdot ' + vec(*u)


Q = gy11(nr=30, slug='gerade-ebene', thema='Lagebeziehung Gerade – Ebene', lb='LB 3',
         blurb='schneidet, parallel, liegt in; Durchstoßpunkte, Anwendungen',
         comment='Blocks: cases and method (1-4), with coordinate form (5-12), with parametric form (13-14), applications (15-20).')

# ---------------------------------------------------------- cases and method ----
Q.q(r'Welche Lagen kann eine Gerade zu einer Ebene haben?',
    [r'Sie schneidet sie, ist parallel zu ihr oder liegt in ihr.', r'Nur schneiden oder parallel.', r'Sie kann auch windschief zu ihr sein.', r'Sie liegt immer in ihr.'],
    [r'„Windschief“ gibt es nur zwischen zwei Geraden.'])

Q.q(r'Wie viele gemeinsame Punkte haben Gerade und Ebene, wenn sich beide schneiden?',
    [r'Genau einen, den Durchstoßpunkt', r'Zwei', r'Unendlich viele', r'Keinen'],
    [r'Im Schnittfall durchstößt die Gerade die Ebene an genau einer Stelle.'])

Q.q(r'Wie bestimmt man mit der Koordinatenform den Durchstoßpunkt?',
    [r'Die Koordinaten der Geraden in die Ebenengleichung einsetzen und nach $t$ auflösen.', r'Stützvektoren gleichsetzen.',
     r'Die Richtungsvektoren addieren.', r'Die Ebenengleichung nach $z$ auflösen und $t = 0$ setzen.'],
    [r'Es entsteht eine Gleichung mit der einen Unbekannten $t$.',
     r'$t$ in die Geradengleichung einsetzen liefert den Punkt.'])

Q.q(r'Beim Einsetzen fällt $t$ weg und es bleibt eine falsche Aussage wie $0 = 5$. Was folgt?',
    [r'Die Gerade ist parallel zur Ebene und liegt nicht in ihr.', r'Die Gerade liegt in der Ebene.', r'Es gibt genau einen Schnittpunkt.', r'Man hat sich verrechnet.'],
    [r'Für kein $t$ liegt ein Geradenpunkt in der Ebene.'])

# ----------------------------------------------------- with coordinate form ----
Q.q(r'Bestimme den Durchstoßpunkt von $' + line((1, 0, 0), (1, 1, 1)) + r'$ mit $E\colon x + y + z = 7$.',
    [r'$S(3 \mid 2 \mid 2)$', r'$S(7 \mid 0 \mid 0)$', r'$S(2 \mid 2 \mid 3)$', r'Kein Schnittpunkt'],
    [r'$(1 + t) + t + t = 7 \Rightarrow 3t = 6 \Rightarrow t = 2$',
     r'$' + vec(1, 0, 0) + r' + 2 \cdot ' + vec(1, 1, 1) + ' = ' + vec(3, 2, 2) + '$'])

Q.q(r'Wie liegt $' + line((0, 0, 0), (1, -1, 0)) + r'$ zu $E\colon x + y + z = 5$?',
    [r'Parallel', r'Sie liegt in $E$.', r'Sie schneidet $E$ in $(5 \mid 0 \mid 0)$.', r'Sie schneidet $E$ im Ursprung.'],
    [r'$t - t + 0 = 5$ ergibt $0 = 5$.',
     r'Kein gemeinsamer Punkt: parallel.'])

Q.q(r'Wie liegt $' + line((1, 1, 0), (1, -1, 0)) + r'$ zu $E\colon x + y + z = 2$?',
    [r'Sie liegt in $E$.', r'Parallel', r'Sie schneidet $E$ in genau einem Punkt.', r'Windschief'],
    [r'$(1 + t) + (1 - t) + 0 = 2$ ergibt $2 = 2$.',
     r'Für jedes $t$ wahr: Alle Geradenpunkte liegen in $E$.'])

Q.q(r'Bestimme den Durchstoßpunkt von $' + line((2, 0, 1), (1, 2, -1)) + r'$ mit $E\colon 2x - y + z = 5$.',
    [r'$S(2 \mid 0 \mid 1)$', r'$S(3 \mid 2 \mid 0)$', r'$S(1 \mid -2 \mid 2)$', r'Kein Schnittpunkt'],
    [r'$2(2 + t) - 2t + (1 - t) = 5 \Rightarrow 5 - t = 5 \Rightarrow t = 0$',
     r'Der Stützpunkt selbst liegt schon in $E$.'])

Q.q(r'Wie liegt $' + line((0, 1, 2), (1, 0, -1)) + r'$ zu $E\colon x + z = 2$?',
    [r'Sie liegt in $E$.', r'Parallel', r'Sie schneidet $E$ in $(0 \mid 1 \mid 2)$, sonst nirgends.', r'Sie schneidet $E$ in $(2 \mid 1 \mid 0)$, sonst nirgends.'],
    [r'$t + (2 - t) = 2$ ergibt $2 = 2$: immer wahr.'])

Q.q(r'Und wie liegt dieselbe Gerade $' + line((0, 1, 2), (1, 0, -1)) + r'$ zu $F\colon x + z = 5$?',
    [r'Parallel', r'Sie liegt in $F$.', r'Sie schneidet $F$ in genau einem Punkt.', r'Sie schneidet $F$ in zwei Punkten.'],
    [r'$t + 2 - t = 5$ ergibt $2 = 5$: falsch für jedes $t$.'])

Q.q(r'Wo durchstößt die $z$-Achse die Ebene $2x + 3y + 6z = 12$?',
    [r'In $(0 \mid 0 \mid 2)$', r'In $(0 \mid 0 \mid 12)$', r'In $(0 \mid 0 \mid 6)$', r'Gar nicht'],
    [r'$z$-Achse: $\vec{x} = t \cdot ' + vec(0, 0, 1) + '$, also $6t = 12$.',
     r'$t = 2$'])

Q.q(r'Wo durchstößt $' + line((0, 1, 1), (2, 1, 0)) + '$ die Ebene $x = 4$?',
    [r'In $(4 \mid 3 \mid 1)$', r'In $(4 \mid 1 \mid 1)$', r'In $(4 \mid 2 \mid 0)$', r'Gar nicht'],
    [r'$2t = 4 \Rightarrow t = 2$',
     r'$y = 1 + 2 = 3$, $z = 1$'])

# --------------------------------------------------- with parametric form ----
Q.q(r'Wo schneidet $' + line((1, 2, 3), (0, 0, 1)) + r'$ die Ebene $\vec{x} = r \cdot ' + vec(1, 0, 0) + r' + s \cdot ' + vec(0, 1, 0) + '$?',
    [r'In $(1 \mid 2 \mid 0)$', r'In $(1 \mid 2 \mid 3)$', r'In $(0 \mid 0 \mid 0)$', r'Gar nicht'],
    [r'Die Ebene ist die $xy$-Ebene, die Gerade verläuft senkrecht dazu.',
     r'$3 + t = 0 \Rightarrow t = -3$'])

Q.q(r'Welches Gleichungssystem entsteht beim Schnitt einer Geraden mit einer Ebene in Parameterform?',
    [r'Drei Gleichungen mit den drei Unbekannten $t$, $r$, $s$', r'Eine Gleichung mit einer Unbekannten',
     r'Zwei Gleichungen mit zwei Unbekannten', r'Drei Gleichungen mit zwei Unbekannten'],
    [r'Gleichsetzen liefert eine Vektorgleichung, also drei Koordinatengleichungen.',
     r'Lösen mit dem Gauß-Verfahren aus LB 2.'])

# ---------------------------------------------------------------- applications ----
Q.q(r'Eine Fahnenmastspitze ist in $(0 \mid 0 \mid 6)$. Sonnenstrahlen haben die Richtung $' + vec(2, 1, -3) + '$. Wo liegt der Schattenpunkt auf dem Boden $z = 0$?',
    [r'$(4 \mid 2 \mid 0)$', r'$(2 \mid 1 \mid 0)$', r'$(6 \mid 3 \mid 0)$', r'$(0 \mid 0 \mid 0)$'],
    [r'$6 - 3t = 0 \Rightarrow t = 2$',
     r'$' + vec(0, 0, 6) + r' + 2 \cdot ' + vec(2, 1, -3) + ' = ' + vec(4, 2, 0) + '$'])

Q.q(r'Ein Laserstrahl startet in $(0 \mid 0 \mid 10)$ mit Richtung $' + vec(1, 2, -5) + '$. Wo trifft er den Boden $z = 0$?',
    [r'$(2 \mid 4 \mid 0)$', r'$(1 \mid 2 \mid 0)$', r'$(10 \mid 20 \mid 0)$', r'$(5 \mid 10 \mid 0)$'],
    [r'$10 - 5t = 0 \Rightarrow t = 2$'])

Q.q(r'Ein Flugzeug startet im Ursprung und steigt je Minute um $' + vec(4, 3, 1) + r'$ (in km). Wann erreicht es die Wolkenschicht $z = 2$, und wo?',
    [r'Nach 2 Minuten in $(8 \mid 6 \mid 2)$', r'Nach 1 Minute in $(4 \mid 3 \mid 1)$', r'Nach 2 Minuten in $(4 \mid 3 \mid 2)$', r'Nie'],
    [r'$t = 2$ aus der $z$-Koordinate.'])

Q.q(r'Ein Sonnenstrahl verläuft parallel zu einer Hauswand. Was bedeutet das rechnerisch?',
    [r'Das Einsetzen in die Ebenengleichung der Wand ergibt einen Widerspruch oder eine immer wahre Aussage.',
     r'Es gibt genau einen Durchstoßpunkt.', r'Der Richtungsvektor ist der Nullvektor.', r'Die Wand ist die $xy$-Ebene.'],
    [r'Parallel heißt: $t$ fällt beim Einsetzen heraus.',
     r'Widerspruch: Strahl außerhalb der Wand; wahre Aussage: Strahl streift genau in der Wand.'])

Q.q(r'Wie liegt die Gerade $' + line((1, 2, 3), (2, 1, 0)) + '$ zur Ebene $z = 3$?',
    [r'Sie liegt in der Ebene.', r'Sie ist parallel und verschieden.', r'Sie schneidet sie in $(1 \mid 2 \mid 3)$, sonst nirgends.', r'Sie steht senkrecht auf ihr.'],
    [r'Die $z$-Koordinate ist für alle $t$ gleich 3.'])

Q.q(r'Und wie liegt dieselbe Gerade zur Ebene $z = 0$?',
    [r'Parallel', r'Sie liegt in der Ebene.', r'Sie schneidet sie in $(1 \mid 2 \mid 0)$.', r'Sie schneidet sie in $(2 \mid 1 \mid 0)$.'],
    [r'$z = 3 \neq 0$ für jedes $t$: kein gemeinsamer Punkt.'])


def check():
    import sympy as sp
    V = lambda *c: sp.Matrix(c)
    t = sp.symbols('t')
    def hit(p, u, coeffs, d):
        g = V(*p) + t * V(*u)
        eq = sp.expand(sum(c * g[i] for i, c in enumerate(coeffs)) - d)
        return eq, g
    eq, g = hit((1, 0, 0), (1, 1, 1), (1, 1, 1), 7)
    assert sp.solve(eq, t) == [2] and g.subs(t, 2) == V(3, 2, 2)
    eq, _ = hit((0, 0, 0), (1, -1, 0), (1, 1, 1), 5)
    assert eq == -5
    eq, _ = hit((1, 1, 0), (1, -1, 0), (1, 1, 1), 2)
    assert eq == 0
    eq, g = hit((2, 0, 1), (1, 2, -1), (2, -1, 1), 5)
    assert sp.solve(eq, t) == [0] and g.subs(t, 0) == V(2, 0, 1)
    eq, _ = hit((0, 1, 2), (1, 0, -1), (1, 0, 1), 2)
    assert eq == 0
    eq, _ = hit((0, 1, 2), (1, 0, -1), (1, 0, 1), 5)
    assert eq == -3
    eq, g = hit((0, 0, 0), (0, 0, 1), (2, 3, 6), 12)
    assert sp.solve(eq, t) == [2] and g.subs(t, 2) == V(0, 0, 2)
    eq, g = hit((0, 1, 1), (2, 1, 0), (1, 0, 0), 4)
    assert sp.solve(eq, t) == [2] and g.subs(t, 2) == V(4, 3, 1)
    eq, g = hit((1, 2, 3), (0, 0, 1), (0, 0, 1), 0)
    assert sp.solve(eq, t) == [-3] and g.subs(t, -3) == V(1, 2, 0)
    eq, g = hit((0, 0, 6), (2, 1, -3), (0, 0, 1), 0)
    assert sp.solve(eq, t) == [2] and g.subs(t, 2) == V(4, 2, 0)
    eq, g = hit((0, 0, 10), (1, 2, -5), (0, 0, 1), 0)
    assert sp.solve(eq, t) == [2] and g.subs(t, 2) == V(2, 4, 0)
    eq, g = hit((0, 0, 0), (4, 3, 1), (0, 0, 1), 2)
    assert sp.solve(eq, t) == [2] and g.subs(t, 2) == V(8, 6, 2)
    eq, _ = hit((1, 2, 3), (2, 1, 0), (0, 0, 1), 3)
    assert eq == 0
    eq, _ = hit((1, 2, 3), (2, 1, 0), (0, 0, 1), 0)
    assert eq == 3


Q.verify(check)
Q.save()
