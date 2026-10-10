#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 24 / KW 9 (LB 3): Normalform y = x² + p · x + q,
quadratische Ergänzung, Scheitelpunkt als Extrempunkt. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=24, slug='normalform', thema='Normalform y = x² + p · x + q', lb='LB 3',
        blurb='Binomische Formeln, quadratische Ergänzung, Scheitelpunkt, Minimum und Maximum, Anwendungen',
        comment='Blocks: binomials and products (1-2, 10-11), completing the square (3-5, 7, 9, 13), vertex formula and checks (6, 8, 15-17, 19-20), extremum in context (12, 14, 18).')

# ---------------------------------------------------- Binome, Produkte ----
Q.q(r'Multipliziere aus: $(x + 3)^2$',
    [r'$x^2 + 6x + 9$', r'$x^2 + 9$', r'$x^2 + 3x + 9$', r'$x^2 + 6x + 6$'],
    [r'1. binomische Formel: $(a + b)^2 = a^2 + 2ab + b^2$',
     r'$x^2 + 2 \cdot 3 \cdot x + 9 = x^2 + 6x + 9$'])

Q.q(r'Multipliziere aus: $(x - 4)^2$',
    [r'$x^2 - 8x + 16$', r'$x^2 - 16$', r'$x^2 + 8x + 16$', r'$x^2 - 8x - 16$'],
    [r'2. binomische Formel: $(a - b)^2 = a^2 - 2ab + b^2$'])

# ---------------------------------------------- quadratische Ergänzung ----
Q.q(r'Bringe $y = x^2 + 6x + 5$ in Scheitelpunktform. Welchen Scheitel hat die Parabel?',
    [r'$S(-3 \mid -4)$', r'$S(3 \mid 5)$', r'$S(-3 \mid 5)$', r'$S(-6 \mid 5)$'],
    [r'$x^2 + 6x = (x + 3)^2 - 9$',
     r'$y = (x + 3)^2 - 9 + 5 = (x + 3)^2 - 4$'])

Q.q(r'Welchen Scheitel hat $y = x^2 - 4x + 7$?',
    [r'$S(2 \mid 3)$', r'$S(-2 \mid 3)$', r'$S(2 \mid 7)$', r'$S(4 \mid 7)$'],
    [r'$x^2 - 4x = (x - 2)^2 - 4$',
     r'$y = (x - 2)^2 + 3$'])

Q.q(r'Welchen Scheitel hat $y = x^2 + 2x - 8$?',
    [r'$S(-1 \mid -9)$', r'$S(1 \mid -9)$', r'$S(-1 \mid -8)$', r'$S(-2 \mid -8)$'],
    [r'$x^2 + 2x = (x + 1)^2 - 1$',
     r'$y = (x + 1)^2 - 9$'])

Q.q(r'Für $y = x^2 + px + q$ gilt $S\left(-\dfrac{p}{2} \;\middle|\; q - \dfrac{p^2}{4}\right)$. Welchen Scheitel hat $y = x^2 - 10x + 21$?',
    [r'$S(5 \mid -4)$', r'$S(-5 \mid -4)$', r'$S(5 \mid 21)$', r'$S(10 \mid 21)$'],
    [r'$p = -10$: $-\dfrac{p}{2} = 5$',
     r'$q - \dfrac{p^2}{4} = 21 - 25 = -4$'])

Q.q(r'Welchen Scheitel hat $y = x^2 + 5x + 4$?',
    [r'$S(-2{,}5 \mid -2{,}25)$', r'$S(2{,}5 \mid -2{,}25)$', r'$S(-5 \mid 4)$', r'$S(-2{,}5 \mid 4)$'],
    [r'$-\dfrac{p}{2} = -2{,}5$',
     r'$4 - \dfrac{25}{4} = 4 - 6{,}25 = -2{,}25$'])

Q.q(r'Welchen kleinsten Funktionswert hat $y = x^2 - 6x + 10$?',
    [r'1', r'10', r'−6', r'3'],
    [r'$y = (x - 3)^2 - 9 + 10 = (x - 3)^2 + 1$',
     r'Minimum 1 bei $x = 3$.'])

Q.q(r'Welche Zahl ergänzt $x^2 + 8x + \;\square$ zu einem vollständigen Quadrat?',
    [r'16', r'8', r'64', r'4'],
    [r'$(x + 4)^2 = x^2 + 8x + 16$',
     r'Man ergänzt das Quadrat der halben Zahl vor $x$: $4^2 = 16$.'])

Q.q(r'Multipliziere aus: $(x + 2) \cdot (x - 5)$',
    [r'$x^2 - 3x - 10$', r'$x^2 + 3x - 10$', r'$x^2 - 10$', r'$x^2 - 3x + 10$'],
    [r'Jedes Glied mit jedem: $x^2 - 5x + 2x - 10$',
     r'$= x^2 - 3x - 10$'])

Q.q(r'Welche Nullstellen hat $y = (x + 2) \cdot (x - 5)$?',
    [r'$x = -2$ und $x = 5$', r'$x = 2$ und $x = -5$', r'$x = -10$', r'$x = 3$'],
    [r'Ein Produkt ist null, wenn ein Faktor null ist.',
     r'$x + 2 = 0$ oder $x - 5 = 0$'])

Q.q(r'Hat $y = x^2 + px + q$ im Scheitelpunkt immer ein Minimum?',
    [r'Ja, weil der Faktor vor $x^2$ positiv ist.', r'Nein, bei negativem $q$ ein Maximum.',
     r'Nein, bei negativem $p$ ein Maximum.', r'Es gibt keinen Scheitelpunkt.'],
    [r'Vor $x^2$ steht 1, die Parabel ist nach oben geöffnet.',
     r'$p$ und $q$ verschieben sie nur.'])

Q.q(r'Welchen Scheitel hat $y = -x^2 + 4x - 1$?',
    [r'$S(2 \mid 3)$, Maximum', r'$S(-2 \mid 3)$, Maximum', r'$S(2 \mid -1)$, Minimum', r'$S(2 \mid 3)$, Minimum'],
    [r'$y = -(x^2 - 4x) - 1 = -\big((x - 2)^2 - 4\big) - 1$',
     r'$y = -(x - 2)^2 + 3$, nach unten geöffnet.'])

Q.q(r'Ein Rechteck hat 20 m Umfang. Für welche Seitenlänge $x$ ist sein Flächeninhalt am größten?',
    [r'$x = 5$ m, dann ist $A = 25$ m²', r'$x = 10$ m, dann ist $A = 0$ m²', r'$x = 4$ m, dann ist $A = 24$ m²', r'$x = 2$ m, dann ist $A = 16$ m²'],
    [r'Andere Seite: $10 - x$, also $A(x) = x \cdot (10 - x) = -x^2 + 10x$.',
     r'$A(x) = -(x - 5)^2 + 25$: Maximum bei $x = 5$ – das Quadrat.'])

Q.q(r'Wo schneidet $y = x^2 - 3x + 7$ die $y$-Achse?',
    [r'bei $(0 \mid 7)$', r'bei $(0 \mid -3)$', r'bei $(7 \mid 0)$', r'bei $(1{,}5 \mid 0)$'],
    [r'Für $x = 0$ bleibt $y = q = 7$.'])

Q.q(r'Welche Symmetrieachse hat $y = x^2 - 8x + 3$?',
    [r'$x = 4$', r'$x = -4$', r'$x = 8$', r'$x = 3$'],
    [r'Die Symmetrieachse geht durch den Scheitel: $x = -\dfrac{p}{2} = 4$.'])

Q.q(r'Welcher Funktionswert gehört bei $y = x^2 - 8x + 3$ zum Scheitel?',
    [r'−13', r'3', r'−29', r'19'],
    [r'$f(4) = 16 - 32 + 3 = -13$',
     r'Scheitel $S(4 \mid -13)$'])

Q.q(r'Der Gewinn einer Firma ist $G(x) = -x^2 + 40x - 300$ (in 1000 €, $x$ in 1000 Stück). Wie groß ist der höchste Gewinn?',
    [r'100 000 € bei 20 000 Stück', r'300 000 € bei 40 000 Stück', r'100 000 € bei 40 000 Stück', r'400 000 € bei 20 000 Stück'],
    [r'$G(x) = -(x^2 - 40x) - 300 = -(x - 20)^2 + 400 - 300$',
     r'$G(x) = -(x - 20)^2 + 100$: Maximum 100 bei $x = 20$.'])

Q.q(r'Welche Nullstellen hat $y = x^2 + 4x + 4$?',
    [r'nur $x = -2$', r'$x = 2$ und $x = -2$', r'$x = -4$', r'keine'],
    [r'$x^2 + 4x + 4 = (x + 2)^2$',
     r'Der Scheitel $(-2 \mid 0)$ liegt auf der $x$-Achse: genau eine Nullstelle.'])

Q.q(r'Welche Normalform gehört zur verschobenen Normalparabel mit dem Scheitel $S(1 \mid -2)$?',
    [r'$y = x^2 - 2x - 1$', r'$y = x^2 + 2x - 2$', r'$y = x^2 - 2x - 2$', r'$y = x^2 - x - 2$'],
    [r'$y = (x - 1)^2 - 2 = x^2 - 2x + 1 - 2$',
     r'$= x^2 - 2x - 1$'])


def check():
    import sympy as sp
    x = sp.symbols('x')
    E = sp.expand
    vertex = lambda f: (sp.solve(sp.diff(f, x), x)[0], f.subs(x, sp.solve(sp.diff(f, x), x)[0]))
    assert E((x + 3)**2) == x**2 + 6*x + 9 and E((x - 4)**2) == x**2 - 8*x + 16
    assert vertex(x**2 + 6*x + 5) == (-3, -4) and vertex(x**2 - 4*x + 7) == (2, 3) and vertex(x**2 + 2*x - 8) == (-1, -9)
    assert vertex(x**2 - 10*x + 21) == (5, -4) and vertex(x**2 + 5*x + 4) == (sp.Rational(-5, 2), sp.Rational(-9, 4))
    assert vertex(x**2 - 6*x + 10) == (3, 1) and E((x + 4)**2) == x**2 + 8*x + 16
    assert E((x + 2)*(x - 5)) == x**2 - 3*x - 10
    assert vertex(-x**2 + 4*x - 1) == (2, 3) and vertex(x*(10 - x)) == (5, 25)
    assert vertex(x**2 - 8*x + 3) == (4, -13) and vertex(-x**2 + 40*x - 300) == (20, 100)
    assert sp.solve(x**2 + 4*x + 4, x) == [-2] and E((x - 1)**2 - 2) == x**2 - 2*x - 1


Q.verify(check)
Q.save()
