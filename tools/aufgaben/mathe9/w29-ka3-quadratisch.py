#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 29 / KW 15: Vorbereitung Klassenarbeit 3
(LB 3 quadratische Funktionen und Gleichungen). Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=29, slug='ka3-quadratisch', thema='Vorbereitung Klassenarbeit 3: Quadratische Funktionen und Gleichungen', lb='KA 3',
        blurb='gemischte Wiederholung zu Parabeln, Scheitelpunkt, quadratischen Gleichungen und Anwendungen',
        comment='Mixed review of LB 3. Blocks: graphs and vertex (1-8), equations (9-15), intersections and context (16-20).')

# ----------------------------------------------------------- Parabeln ----
Q.q(r'Welchen Wertebereich hat $y = 2x^2 - 3$?',
    [r'alle $y \geq -3$', r'alle $y \geq 2$', r'alle $y \leq -3$', r'alle Zahlen'],
    [r'Nach oben geöffnet, Scheitel $(0 \mid -3)$.'])

Q.q(r'Welche Parabel ist nach unten geöffnet und gestaucht?',
    [r'$y = -0{,}5x^2$', r'$y = -2x^2$', r'$y = 0{,}5x^2$', r'$y = 2x^2$'],
    [r'Nach unten: $a < 0$. Gestaucht: $|a| < 1$.'])

Q.q(r'Welchen Scheitelpunkt hat $y = (x + 2)^2 - 5$?',
    [r'$S(-2 \mid -5)$', r'$S(2 \mid -5)$', r'$S(-2 \mid 5)$', r'$S(5 \mid -2)$'],
    [r'Die Klammer wird bei $x = -2$ null, dann bleibt $-5$.'])

Q.q(r'Welche Gleichung hat die verschobene Normalparabel mit dem Scheitel $S(3 \mid 1)$?',
    [r'$y = (x - 3)^2 + 1$', r'$y = (x + 3)^2 + 1$', r'$y = (x - 1)^2 + 3$', r'$y = x^2 + 3x + 1$'],
    [r'3 nach rechts, 1 nach oben.'])

Q.q(r'Welchen Scheitelpunkt hat $y = x^2 - 8x + 12$?',
    [r'$S(4 \mid -4)$', r'$S(-4 \mid -4)$', r'$S(4 \mid 12)$', r'$S(8 \mid 12)$'],
    [r'$y = (x - 4)^2 - 16 + 12 = (x - 4)^2 - 4$'])

Q.q(r'Wo ist $y = (x - 1)^2 + 2$ steigend?',
    [r'für $x > 1$', r'für $x < 1$', r'für $x > 2$', r'überall'],
    [r'Rechts vom Scheitel $(1 \mid 2)$ steigt eine nach oben geöffnete Parabel.'])

Q.q(r'Multipliziere aus: $(x - 5)^2$',
    [r'$x^2 - 10x + 25$', r'$x^2 - 25$', r'$x^2 + 10x + 25$', r'$x^2 - 5x + 25$'],
    [r'$(a - b)^2 = a^2 - 2ab + b^2$'])

Q.q(r'Hat $y = -x^2 + 6x - 5$ ein Maximum oder ein Minimum, und welchen Wert?',
    [r'Maximum 4 bei $x = 3$', r'Minimum 4 bei $x = 3$', r'Maximum −5 bei $x = 0$', r'Minimum −4 bei $x = 3$'],
    [r'$y = -(x^2 - 6x) - 5 = -(x - 3)^2 + 9 - 5$',
     r'$y = -(x - 3)^2 + 4$, nach unten geöffnet: Maximum 4.'])

# ------------------------------------------------------------- Gleichungen ----
Q.q(r'Löse: $x^2 - 81 = 0$',
    [r'$x = 9$ oder $x = -9$', r'nur $x = 9$', r'$x = 40{,}5$', r'keine Lösung'],
    [r'$x^2 = 81$, $x = \pm 9$'])

Q.q(r'Löse: $(x + 4) \cdot (x - 1) = 0$',
    [r'$x = -4$ oder $x = 1$', r'$x = 4$ oder $x = -1$', r'$x = -4$', r'$x = 3$'],
    [r'Satz vom Nullprodukt.'])

Q.q(r'Löse: $x^2 + 6x = 0$',
    [r'$x = 0$ oder $x = -6$', r'$x = 0$ oder $x = 6$', r'nur $x = -6$', r'$x = \pm\sqrt{6}$'],
    [r'$x \cdot (x + 6) = 0$'])

Q.q(r'Löse: $x^2 - 5x + 6 = 0$',
    [r'$x = 2$ oder $x = 3$', r'$x = -2$ oder $x = -3$', r'$x = 1$ oder $x = 6$', r'keine Lösung'],
    [r'$x = 2{,}5 \pm \sqrt{6{,}25 - 6} = 2{,}5 \pm 0{,}5$'])

Q.q(r'Löse: $x^2 + 4x - 12 = 0$',
    [r'$x = 2$ oder $x = -6$', r'$x = -2$ oder $x = 6$', r'$x = 12$', r'$x = -2 \pm 4$'],
    [r'$x = -2 \pm \sqrt{4 + 12} = -2 \pm 4$'])

Q.q(r'Wie viele Lösungen hat $x^2 - 2x + 3 = 0$?',
    [r'keine', r'eine', r'zwei', r'unendlich viele'],
    [r'$D = 1 - 3 = -2 < 0$'])

Q.q(r'Löse: $2x^2 + 4x - 6 = 0$',
    [r'$x = 1$ oder $x = -3$', r'$x = -1$ oder $x = 3$', r'$x = 2$ oder $x = -6$', r'keine Lösung'],
    [r'Durch 2: $x^2 + 2x - 3 = 0$',
     r'$x = -1 \pm 2$'])

# --------------------------------------------- Schnittpunkte und Sachbezug ----
Q.q(r'In welchen Punkten schneiden sich $y = x^2 - 2$ und $y = x$?',
    [r'$(2 \mid 2)$ und $(-1 \mid -1)$', r'$(-2 \mid -2)$ und $(1 \mid 1)$', r'$(2 \mid 2)$', r'keine'],
    [r'$x^2 - x - 2 = 0$, $x = 2$ oder $x = -1$.'])

Q.q(r'Ein Ball fliegt nach $h(x) = -0{,}1x^2 + x + 2$ (in m). Wie hoch ist er an der höchsten Stelle?',
    [r'4,5 m', r'2 m', r'5 m', r'7 m'],
    [r'$h(x) = -0{,}1(x^2 - 10x) + 2 = -0{,}1(x - 5)^2 + 2{,}5 + 2$',
     r'Scheitel $(5 \mid 4{,}5)$'])

Q.q(r'Ein Rechteck hat 30 cm² Flächeninhalt, eine Seite ist 1 cm länger als die andere. Wie lang ist die kürzere Seite?',
    [r'5 cm', r'5,5 cm', r'6 cm', r'4,5 cm'],
    [r'$x(x + 1) = 30$, $x^2 + x - 30 = 0$',
     r'$x = -0{,}5 \pm \sqrt{0{,}25 + 30} = -0{,}5 \pm 5{,}5$, also $x = 5$ cm.'])

Q.q(r'Für welches $q$ berührt die Parabel $y = x^2 + 4x + q$ die $x$-Achse?',
    [r'$q = 4$', r'$q = 2$', r'$q = 16$', r'$q = 0$'],
    [r'Berühren heißt genau eine Nullstelle: $D = 4 - q = 0$.'])

Q.q(r'Ein Brückenbogen hat die Form $y = -0{,}05x^2 + 5$ (in m). Wie breit ist er am Boden?',
    [r'20 m', r'10 m', r'100 m', r'5 m'],
    [r'$0{,}05x^2 = 5$, $x^2 = 100$, $x = \pm 10$',
     r'Breite 20 m'])


def check():
    import sympy as sp
    x = sp.symbols('x')
    s = lambda e: sorted(sp.solve(e, x), key=lambda v: complex(v).real)
    E = sp.expand
    assert E((x - 4)**2 - 4) == x**2 - 8*x + 12 and E((x - 5)**2) == x**2 - 10*x + 25
    assert E(-(x - 3)**2 + 4) == -x**2 + 6*x - 5
    assert s(x**2 - 81) == [-9, 9] and s((x + 4)*(x - 1)) == [-4, 1] and s(x**2 + 6*x) == [-6, 0]
    assert s(x**2 - 5*x + 6) == [2, 3] and s(x**2 + 4*x - 12) == [-6, 2] and all(not v.is_real for v in sp.solve(x**2 - 2*x + 3, x))
    assert s(2*x**2 + 4*x - 6) == [-3, 1] and s(x**2 - 2 - x) == [-1, 2]
    hb = -sp.Rational(1, 10)*x**2 + x + 2
    assert sp.solve(sp.diff(hb, x), x) == [5] and hb.subs(x, 5) == sp.Rational(9, 2)
    assert s(x*(x + 1) - 30) == [-6, 5] and s(x**2 + 4*x + 4) == [-2] and s(-sp.Rational(1, 20)*x**2 + 5) == [-10, 10]


Q.verify(check)
Q.save()
