#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 38 / KW 24: review for Klausur 11/II (LB 3 vectors, lines and
planes, LB 4 binomially distributed random variables). Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11, vec

Q = gy11(nr=38, slug='ka2', thema='Klausur 11/II: Vektoren, Geraden, Ebenen und Binomialverteilung', lb='KL 11/II',
         blurb='gemischte Aufgaben zu LB 3 und LB 4 zur Klausurvorbereitung',
         comment='Blocks: vectors (1-4), lines (5-7), planes (8-11), multi-stage experiments (12-14), binomial distribution (15-20).')

# ------------------------------------------------------------------- vectors ----
Q.q(r'Bestimme $\overrightarrow{AB}$ und $|\overrightarrow{AB}|$ für $A(2 \mid -1 \mid 0)$ und $B(4 \mid 1 \mid 1)$.',
    [r'$' + vec(2, 2, 1) + '$, Länge 3', r'$' + vec(2, 2, 1) + '$, Länge 5', r'$' + vec(-2, -2, -1) + '$, Länge 3', r'$' + vec(6, 0, 1) + r'$, Länge $\sqrt{37}$'],
    [r'$\vec{b} - \vec{a} = ' + vec(2, 2, 1) + '$',
     r'$\sqrt{4 + 4 + 1} = 3$'])

Q.q(r'Berechne $3\vec{a} - 2\vec{b}$ für $\vec{a} = ' + vec(1, 2, 0) + r'$ und $\vec{b} = ' + vec(2, -1, 3) + '$.',
    [r'$' + vec(-1, 8, -6) + '$', r'$' + vec(-1, 4, -6) + '$', r'$' + vec(7, 4, 6) + '$', r'$' + vec(1, 8, -6) + '$'],
    [r'$' + vec(3, 6, 0) + ' - ' + vec(4, -2, 6) + '$'])

Q.q(r'Bestimme den Mittelpunkt von $A(1 \mid 5 \mid -2)$ und $B(3 \mid -1 \mid 4)$.',
    [r'$M(2 \mid 2 \mid 1)$', r'$M(4 \mid 4 \mid 2)$', r'$M(1 \mid -3 \mid 3)$', r'$M(2 \mid 3 \mid 1)$'],
    [r'Koordinatenweise Mittelwert.'])

Q.q(r'Für welches $a$ sind $' + vec(2, 'a', -4) + '$ und $' + vec(-1, 3, 2) + '$ parallel?',
    [r'$a = -6$', r'$a = 6$', r'$a = 3$', r'Für kein $a$'],
    [r'Faktor aus der ersten und dritten Koordinate: −2.',
     r'$a = -2 \cdot 3 = -6$'])

# --------------------------------------------------------------------- lines ----
Q.q(r'Liegt $P(5 \mid 3 \mid -1)$ auf $g\colon \vec{x} = ' + vec(1, 1, 3) + r' + t \cdot ' + vec(2, 1, -2) + '$?',
    [r'Ja, für $t = 2$.', r'Nein.', r'Ja, für $t = 4$.', r'Ja, für $t = 1$.'],
    [r'$1 + 2t = 5$, $1 + t = 3$, $3 - 2t = -1$: immer $t = 2$.'])

Q.q(r'Wie liegen $g\colon \vec{x} = ' + vec(1, 0, 1) + r' + t \cdot ' + vec(1, 1, 0) + r'$ und $h\colon \vec{x} = ' + vec(2, 3, 1) + r' + s \cdot ' + vec(0, 1, 0) + '$?',
    [r'Sie schneiden sich in $(2 \mid 1 \mid 1)$.', r'Windschief', r'Parallel', r'Identisch'],
    [r'Nicht parallel. $1 + t = 2$, $t = 3 + s$, $1 = 1$.',
     r'$t = 1$, $s = -2$: Schnittpunkt $(2 \mid 1 \mid 1)$.'])

Q.q(r'Wie liegen $g\colon \vec{x} = ' + vec(0, 0, 0) + r' + t \cdot ' + vec(1, 0, 1) + r'$ und $h\colon \vec{x} = ' + vec(0, 1, 0) + r' + s \cdot ' + vec(0, 1, 1) + '$?',
    [r'Windschief', r'Sie schneiden sich im Ursprung.', r'Parallel', r'Identisch'],
    [r'Nicht parallel. $t = 0$, $0 = 1 + s$, $t = s$.',
     r'Aus den ersten beiden: $t = 0$, $s = -1$; dritte: $0 = -1$, Widerspruch.'])

# -------------------------------------------------------------------- planes ----
Q.q(r'Bestimme die Achsenabschnitte von $E\colon 4x + 2y + z = 8$.',
    [r'$(2 \mid 0 \mid 0)$, $(0 \mid 4 \mid 0)$, $(0 \mid 0 \mid 8)$', r'$(4 \mid 0 \mid 0)$, $(0 \mid 2 \mid 0)$, $(0 \mid 0 \mid 1)$',
     r'$(8 \mid 0 \mid 0)$, $(0 \mid 8 \mid 0)$, $(0 \mid 0 \mid 8)$', r'$(2 \mid 4 \mid 8)$'],
    [r'$4x = 8$, $2y = 8$, $z = 8$.'])

Q.q(r'Bestimme die Koordinatenform der Ebene $\vec{x} = ' + vec(0, 0, 3) + r' + r \cdot ' + vec(1, 0, -1) + r' + s \cdot ' + vec(0, 1, -1) + '$.',
    [r'$x + y + z = 3$', r'$x - y + z = 3$', r'$z = 3$', r'$x + y - z = 3$'],
    [r'$x = r$, $y = s$, $z = 3 - r - s = 3 - x - y$.'])

Q.q(r'Bestimme den Durchstoßpunkt von $g\colon \vec{x} = ' + vec(1, 2, 0) + r' + t \cdot ' + vec(1, 0, 2) + r'$ mit $E\colon x + y + z = 9$.',
    [r'$S(3 \mid 2 \mid 4)$', r'$S(2 \mid 2 \mid 2)$', r'$S(9 \mid 0 \mid 0)$', r'Kein Schnittpunkt'],
    [r'$(1 + t) + 2 + 2t = 9 \Rightarrow 3t = 6 \Rightarrow t = 2$',
     r'$(1 + 2 \mid 2 \mid 4)$'])

Q.q(r'Wie liegt $g\colon \vec{x} = ' + vec(1, 1, 1) + r' + t \cdot ' + vec(1, -1, 0) + r'$ zu $E\colon x + y + z = 5$?',
    [r'Parallel', r'Sie liegt in $E$.', r'Sie schneidet $E$ in einem Punkt.', r'Windschief'],
    [r'$(1 + t) + (1 - t) + 1 = 5$ ergibt $3 = 5$: Widerspruch.'])

# --------------------------------------------------------- multi-stage experiments ----
Q.q(r'Aus einer Urne mit 4 roten und 1 blauen Kugel werden zwei ohne Zurücklegen gezogen. Wie wahrscheinlich ist die blaue dabei?',
    [r'$\dfrac{2}{5}$', r'$\dfrac{1}{5}$', r'$\dfrac{9}{25}$', r'$\dfrac{1}{2}$'],
    [r'Gegenereignis: zwei rote, $\dfrac{4}{5} \cdot \dfrac{3}{4} = \dfrac{3}{5}$.',
     r'$1 - \dfrac{3}{5} = \dfrac{2}{5}$'])

Q.q(r'$A$ und $B$ sind unabhängig mit $P(A) = 0{,}6$ und $P(B) = 0{,}5$. Wie groß ist $P(A \cap \overline{B})$?',
    [r'0,3', r'0,1', r'0,2', r'0,5'],
    [r'$0{,}6 \cdot 0{,}5 = 0{,}3$'])

Q.q(r'In einer Vierfeldertafel gilt $P(A) = 0{,}5$, $P(B) = 0{,}4$, $P(A \cap B) = 0{,}3$. Sind $A$ und $B$ unabhängig?',
    [r'Nein, $0{,}5 \cdot 0{,}4 = 0{,}2 \neq 0{,}3$.', r'Ja, $0{,}5 \cdot 0{,}4 = 0{,}2$.', r'Ja, weil $0{,}3 < 0{,}4$.', r'Das lässt sich nicht entscheiden.'],
    [r'Vergleich von $P(A \cap B)$ mit $P(A) \cdot P(B)$.'])

# ------------------------------------------------------- binomial distribution ----
Q.q(r'Berechne $\dbinom{8}{3}$.',
    [r'56', r'24', r'336', r'11'],
    [r'$\dfrac{8 \cdot 7 \cdot 6}{3 \cdot 2 \cdot 1} = 56$'])

Q.q(r'$X$ ist binomialverteilt mit $n = 5$, $p = 0{,}4$. Berechne $P(X = 2)$.',
    [r'0,3456', r'0,16', r'0,4', r'0,2304'],
    [r'$\dbinom{5}{2} \cdot 0{,}4^2 \cdot 0{,}6^3 = 10 \cdot 0{,}16 \cdot 0{,}216$'])

Q.q(r'$n = 5$, $p = 0{,}4$. Berechne $P(X \geq 1)$.',
    [r'0,92224', r'0,07776', r'0,4', r'0,2592'],
    [r'$1 - 0{,}6^5 = 1 - 0{,}077\,76$'])

Q.q(r'$n = 5$, $p = 0{,}4$. Bestimme $E(X)$ und $\sigma$.',
    [r'$E(X) = 2$, $\sigma \approx 1{,}10$', r'$E(X) = 2$, $\sigma = 1{,}2$', r'$E(X) = 2{,}5$, $\sigma \approx 1{,}12$', r'$E(X) = 0{,}4$, $\sigma \approx 0{,}49$'],
    [r'$E(X) = 5 \cdot 0{,}4 = 2$',
     r'$V(X) = 5 \cdot 0{,}4 \cdot 0{,}6 = 1{,}2$, $\sigma = \sqrt{1{,}2} \approx 1{,}10$'])

Q.q(r'Was bedeutet „höchstens 2 von 10“ als Wahrscheinlichkeit?',
    [r'$P(X \leq 2)$', r'$P(X < 2)$', r'$P(X \geq 2)$', r'$1 - P(X \leq 2)$'],
    [r'0, 1 oder 2 Treffer.'])

Q.q(r'Welches Experiment ist eine Bernoulli-Kette?',
    [r'Zehnmal würfeln und jeweils notieren, ob eine Sechs fällt', r'Aus 5 Kugeln dreimal ohne Zurücklegen ziehen',
     r'Würfeln, bis die erste Sechs fällt, und die Würfe zählen', r'Die Augensumme zweier Würfel bestimmen'],
    [r'Feste Länge $n = 10$, zwei Ausgänge, gleiches $p = \dfrac{1}{6}$, unabhängige Würfe.'])


def check():
    import sympy as sp
    from fractions import Fraction as F
    from math import comb, sqrt
    V = lambda *c: sp.Matrix(c)
    t, s, r = sp.symbols('t s r')
    assert V(4, 1, 1) - V(2, -1, 0) == V(2, 2, 1) and V(2, 2, 1).norm() == 3
    assert 3 * V(1, 2, 0) - 2 * V(2, -1, 3) == V(-1, 8, -6)
    assert (V(1, 5, -2) + V(3, -1, 4)) / 2 == V(2, 2, 1)
    assert V(2, -6, -4) == -2 * V(-1, 3, 2)
    assert sp.solve(list(V(1, 1, 3) + t * V(2, 1, -2) - V(5, 3, -1)), t) == {t: 2}
    assert sp.solve(list(V(1, 0, 1) + t * V(1, 1, 0) - V(2, 3, 1) - s * V(0, 1, 0)), [t, s]) == {t: 1, s: -2}
    assert sp.solve(list(t * V(1, 0, 1) - V(0, 1, 0) - s * V(0, 1, 1)), [t, s]) == []
    x, y, z = sp.symbols('x y z')
    E = 4 * x + 2 * y + z - 8
    assert sp.solve(E.subs({y: 0, z: 0}), x) == [2] and sp.solve(E.subs({x: 0, z: 0}), y) == [4] and sp.solve(E.subs({x: 0, y: 0}), z) == [8]
    P = V(0, 0, 3) + r * V(1, 0, -1) + s * V(0, 1, -1)
    assert sp.expand(P[0] + P[1] + P[2]) == 3
    g = V(1, 2, 0) + t * V(1, 0, 2)
    assert sp.solve(g[0] + g[1] + g[2] - 9, t) == [2] and g.subs(t, 2) == V(3, 2, 4)
    h = V(1, 1, 1) + t * V(1, -1, 0)
    assert sp.expand(h[0] + h[1] + h[2] - 5) == -2
    assert 1 - F(4, 5) * F(3, 4) == F(2, 5)
    assert F(6, 10) * F(5, 10) == F(3, 10) and F(5, 10) * F(4, 10) == F(2, 10)
    assert comb(8, 3) == 56
    p = F(2, 5)
    assert comb(5, 2) * p ** 2 * (1 - p) ** 3 == F(3456, 10000)
    assert 1 - (1 - p) ** 5 == F(92224, 100000)
    assert 5 * p == 2 and 5 * p * (1 - p) == F(6, 5) and abs(sqrt(1.2) - 1.10) < 0.005


Q.verify(check)
Q.save()
