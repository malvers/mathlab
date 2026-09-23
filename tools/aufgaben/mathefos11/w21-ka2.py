#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 21 / KW 4 (LB 1): Wiederholung fuer Klausur 2 -
quer durch den ganzen Lernbereich 1, andere Aufgaben als in den Wochen 2 bis 20.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=21, slug='ka2', thema='Wiederholung für Klausur 2', lb='LB 1',
          blurb='Terme, Gleichungen, lineare und quadratische Zusammenhänge, ganzrationale Funktionen',
          comment='Blocks: Terme und Gleichungen (1-5), lineare Zusammenhaenge (6-10), quadratische Zusammenhaenge (11-16), ganzrationale Funktionen (17-20).')

# ---------------------------------------------------- Terme und Gleichungen ----
Q.q(r'Multipliziere aus: $(x + 4)^2$.',
    [r'$x^2 + 8x + 16$', r'$x^2 + 16$', r'$x^2 + 4x + 16$', r'$x^2 + 8x + 8$'],
    [r'Erste binomische Formel mit $a = x$ und $b = 4$.',
     r'$x^2 + 2 \cdot 4x + 16 = x^2 + 8x + 16$',
     r'Probe mit $x = 1$: $25$ und $1 + 8 + 16 = 25$.'])

Q.q(r'Zerlege in Faktoren: $x^2 - 49$.',
    [r'$(x + 7)(x - 7)$', r'$(x - 7)^2$', r'$(x + 49)(x - 1)$', r'$(x + 7)^2$'],
    [r'Dritte binomische Formel: $a^2 - b^2$ mit $b = 7$.',
     r'$x^2 - 49 = (x+7)(x-7)$',
     r'Probe mit $x = 8$: $64 - 49 = 15$ und $15 \cdot 1 = 15$.'])

Q.q(r'Löse: $6x - 5 = 2x + 11$.',
    [r'$x = 4$', r'$x = 2$', r'$x = 6$', r'$x = 16$'],
    [r'$2x$ abziehen: $4x - 5 = 11$.',
     r'$4x = 16$, also $x = 4$.',
     r'Probe: $24 - 5 = 19$ und $8 + 11 = 19$.'])

Q.q(r'Löse: $\dfrac{9}{x + 2} = 3$.',
    [r'$x = 1$', r'$x = 3$', r'$x = -1$', r'$x = 25$'],
    [r'Definitionsbereich: $x \neq -2$.',
     r'Mit $x+2$ multiplizieren: $9 = 3\,(x+2)$, also $x + 2 = 3$.',
     r'$x = 1$. Probe: $\dfrac{9}{3} = 3$.'])

Q.q(r'Löse: $2x - 3 < 5$.',
    [r'$x < 4$', r'$x > 4$', r'$x < 1$', r'$x < 8$'],
    [r'$+3$: $2x < 8$.',
     r'Durch $2$ teilen, positive Zahl, das Zeichen bleibt: $x < 4$.',
     r'Probe mit $x = 3$: $3 < 5$ stimmt.'])

# ---------------------------------------------------- lineare Zusammenhänge ----
Q.q(r'Wie lautet die Gerade durch $P(2|7)$ mit dem Anstieg $m = 2$?',
    [r'$y = 2x + 3$', r'$y = 2x + 7$', r'$y = 2x - 3$', r'$y = 7x + 2$'],
    [r'Ansatz $y = 2x + n$, Punkt einsetzen.',
     r'$7 = 4 + n$, also $n = 3$.',
     r'$y = 2x + 3$. Probe: $y(2) = 7$.'])

Q.q(r'Berechne die Nullstelle von $y = -5x + 15$.',
    [r'$x = 3$', r'$x = -3$', r'$x = 15$', r'$x = 5$'],
    [r'$-5x + 15 = 0$',
     r'$-5x = -15$, also $x = 3$.',
     r'Probe: $-15 + 15 = 0$.'])

Q.q(r'Wo schneiden sich $y = x - 2$ und $y = -2x + 7$?',
    [r'in $S(3|1)$', r'in $S(1|3)$', r'in $S(3|5)$', r'in $S(2|0)$'],
    [r'Gleichsetzen: $x - 2 = -2x + 7$.',
     r'$3x = 9$, also $x = 3$.',
     r'Einsetzen: $y = 1$, also $S(3|1)$.'])

Q.q(r'Löse: $2x + y = 8$ und $x - y = 1$.',
    [r'$x = 3$, $y = 2$', r'$x = 2$, $y = 3$', r'$x = 4$, $y = 0$', r'$x = 3$, $y = -2$'],
    [r'Addieren: $3x = 9$, also $x = 3$.',
     r'Einsetzen: $3 - y = 1$, also $y = 2$.',
     r'Probe: $6 + 2 = 8$ stimmt.'])

Q.q(r'Unter welchem Winkel schneidet $y = \sqrt{3}\,x - 2$ die $x$-Achse?',
    [r'$60^\circ$', r'$30^\circ$', r'$45^\circ$', r'$\approx 1{,}7^\circ$'],
    [r'$\tan\alpha = m = \sqrt{3}$',
     r'Aus der Formelsammlung: $\tan 60^\circ = \sqrt{3}$.',
     r'$30^\circ$ gehört zu $\dfrac{1}{\sqrt{3}}$.'])

# ------------------------------------------------ quadratische Zusammenhänge ----
Q.q(r'Wo liegt der Scheitelpunkt von $y = x^2 - 4x + 7$?',
    [r'in $(2|3)$', r'in $(-2|3)$', r'in $(2|-3)$', r'in $(4|7)$'],
    [r'Quadratische Ergänzung: $x^2 - 4x + 4 - 4 + 7 = (x-2)^2 + 3$.',
     r'Also $x_S = 2$ und $y_S = 3$.',
     r'Probe: $y(2) = 4 - 8 + 7 = 3$. Die Parabel hat keine Nullstelle, denn ihr tiefster Punkt liegt über der Achse.'])

Q.q(r'Löse: $x^2 - 2x - 15 = 0$.',
    [r'$x = 5$ und $x = -3$', r'$x = -5$ und $x = 3$', r'$x = 5$ und $x = 3$', r'$x = 15$ und $x = -1$'],
    [r'Vieta: Summe $2$, Produkt $-15$.',
     r'Das sind $5$ und $-3$.',
     r'Probe: $25 - 10 - 15 = 0$.'])

Q.q(r'Zerlege $y = x^2 - 2x - 15$ in Linearfaktoren.',
    [r'$y = (x - 5)(x + 3)$', r'$y = (x + 5)(x - 3)$', r'$y = (x - 5)(x - 3)$', r'$y = (x - 15)(x + 1)$'],
    [r'Die Nullstellen sind $5$ und $-3$.',
     r'Zu jeder gehört der Linearfaktor $(x - x_0)$.',
     r'$y = (x-5)(x+3)$. Probe durch Ausmultiplizieren: $x^2 + 3x - 5x - 15$.'])

Q.q(r'Wie lautet die Parabel mit den Nullstellen $-1$ und $4$, die durch $P(0|-8)$ verläuft?',
    [r'$y = 2\,(x + 1)(x - 4)$', r'$y = (x + 1)(x - 4)$',
     r'$y = -2\,(x + 1)(x - 4)$', r'$y = 8\,(x + 1)(x - 4)$'],
    [r'Ansatz: $y = a\,(x+1)(x-4)$.',
     r'Punkt einsetzen: $-8 = a \cdot 1 \cdot (-4) = -4a$, also $a = 2$.',
     r'$y = 2\,(x+1)(x-4)$, ausmultipliziert $y = 2x^2 - 6x - 8$.'])

Q.q(r'Wie viele Lösungen hat $x^2 - 6x + 9 = 0$?',
    [r'genau eine, nämlich $x = 3$', r'zwei, nämlich $3$ und $-3$',
     r'keine', r'zwei, nämlich $9$ und $0$'],
    [r'Diskriminante: $36 - 36 = 0$.',
     r'Der Term ist ein vollständiges Quadrat: $(x-3)^2 = 0$.',
     r'Also nur $x = 3$, eine doppelte Nullstelle — der Graph berührt die Achse.'])

Q.q(r'Für welche $a$ hat $x^2 + 4x + a = 0$ keine reelle Lösung?',
    [r'für $a > 4$', r'für $a < 4$', r'für $a > 0$', r'für $a = 4$'],
    [r'Diskriminante: $D = 16 - 4a$.',
     r'Keine reelle Lösung bedeutet $D < 0$, also $16 < 4a$.',
     r'$a > 4$. Probe mit $a = 5$: $D = -4$, tatsächlich keine Lösung.'])

# ----------------------------------------------- ganzrationale Funktionen ----
Q.q(r'Wie lauten die Nullstellen von $f(x) = x^3 - 9x$?',
    [r'$x = 0$, $x = 3$ und $x = -3$', r'$x = 0$ und $x = 9$',
     r'$x = 3$ und $x = -3$', r'$x = 0$ und $x = 3$'],
    [r'$x$ ausklammern: $x\,(x^2 - 9) = 0$.',
     r'Dritte binomische Formel: $x\,(x-3)(x+3)$.',
     r'Nullstellen $0$, $3$ und $-3$.'])

Q.q(r'Wie verhält sich $f(x) = -2x^3 + 5$ für $x \to +\infty$?',
    [r'$f(x) \to -\infty$', r'$f(x) \to +\infty$', r'$f(x) \to 5$', r'$f(x) \to 0$'],
    [r'Der führende Term ist $-2x^3$: ungerader Grad, negativer Leitkoeffizient.',
     r'Für große positive $x$ wird er stark negativ.',
     r'Probe: $f(10) = -2000 + 5 = -1995$.'])

Q.q(r'Welche Symmetrie hat der Graph von $f(x) = x^4 - 2x^2$?',
    [r'achsensymmetrisch zur $y$-Achse', r'punktsymmetrisch zum Ursprung',
     r'achsensymmetrisch zur $x$-Achse', r'keine Symmetrie'],
    [r'Es kommen nur gerade Exponenten vor.',
     r'$f(-x) = x^4 - 2x^2 = f(x)$',
     r'Also Achsensymmetrie zur $y$-Achse.'])

Q.q(r'Löse mit Substitution: $x^4 - 10x^2 + 9 = 0$.',
    [r'$x = \pm 1$ und $x = \pm 3$', r'$x = \pm 1$ und $x = \pm 9$',
     r'$x = 1$ und $x = 9$', r'$x = \pm 3$'],
    [r'$u = x^2$: $u^2 - 10u + 9 = 0$ mit den Lösungen $u = 1$ und $u = 9$.',
     r'Rücksubstitution: $x^2 = 1$ ergibt $\pm 1$, $x^2 = 9$ ergibt $\pm 3$.',
     r'Vier Nullstellen — und die Rücksubstitution darf nicht vergessen werden.'])


def check():
    from fractions import Fraction as F
    from math import sqrt, atan, degrees
    import sympy as sp
    x, y, a, u = sp.symbols('x y a u')
    xr = sp.Symbol('xr', real=True)
    # Terme und Gleichungen
    assert sp.expand((x + 4) ** 2) == x ** 2 + 8 * x + 16 and 5 ** 2 == 25 == 1 + 8 + 16
    assert sp.factor(x ** 2 - 49) == (x - 7) * (x + 7) and 64 - 49 == 15
    assert sp.solve(sp.Eq(6 * x - 5, 2 * x + 11), x) == [4] and 6 * 4 - 5 == 19 == 2 * 4 + 11
    assert sp.solve(sp.Eq(9 / (x + 2), 3), x) == [1] and F(9, 3) == 3
    assert sp.solveset(2 * xr - 3 < 5, xr, sp.S.Reals) == sp.Interval.open(-sp.oo, 4)
    # lineare Zusammenhaenge
    assert (2 * x + 3).subs(x, 2) == 7
    assert sp.solve(-5 * x + 15, x) == [3]
    assert sp.solve(sp.Eq(x - 2, -2 * x + 7), x) == [3] and (x - 2).subs(x, 3) == 1
    assert sp.solve([2 * x + y - 8, x - y - 1], [x, y], dict=True) == [{x: 3, y: 2}]
    assert abs(degrees(atan(sqrt(3))) - 60) < 1e-9
    # quadratische Zusammenhaenge
    p = x ** 2 - 4 * x + 7
    assert sp.expand((x - 2) ** 2 + 3) == p and p.subs(x, 2) == 3
    assert sp.solveset(p, x, sp.S.Reals) == sp.S.EmptySet
    q = x ** 2 - 2 * x - 15
    assert sp.solve(q, x) == [-3, 5] and sp.factor(q) == (x - 5) * (x + 3)
    assert sp.solve(sp.Eq(a * (0 + 1) * (0 - 4), -8), a) == [2]
    assert sp.expand(2 * (x + 1) * (x - 4)) == 2 * x ** 2 - 6 * x - 8
    assert 36 - 36 == 0 and sp.solve(x ** 2 - 6 * x + 9, x) == [3]
    assert sp.solve(sp.Eq(16 - 4 * a, 0), a) == [4] and 16 - 4 * 5 == -4
    assert sp.solveset(x ** 2 + 4 * x + 5, x, sp.S.Reals) == sp.S.EmptySet
    # ganzrationale Funktionen
    assert sp.solve(x ** 3 - 9 * x, x) == [-3, 0, 3]
    assert sp.limit(-2 * x ** 3 + 5, x, sp.oo) is -sp.oo and -2 * 1000 + 5 == -1995
    g = x ** 4 - 2 * x ** 2
    assert sp.simplify(g.subs(x, -x) - g) == 0
    assert sp.solve(u ** 2 - 10 * u + 9, u) == [1, 9]
    assert sp.solveset(x ** 4 - 10 * x ** 2 + 9, x, sp.S.Reals) == sp.FiniteSet(-3, -1, 1, 3)


Q.verify(check)
Q.save()
