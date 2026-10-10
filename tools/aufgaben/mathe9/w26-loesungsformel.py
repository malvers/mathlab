#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 26 / KW 11 (LB 3): Lösungsformel für
x² + p · x + q = 0, Diskriminante, Fallunterscheidung. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=26, slug='loesungsformel', thema='Die Lösungsformel', lb='LB 3',
        blurb='x = −p/2 ± √((p/2)² − q), Diskriminante, zwei, eine oder keine Lösung, Normalform herstellen',
        comment='Blocks: applying the formula (1-2, 8-10, 12-13, 20), cases (3-6, 16), normal form first (7, 11, 17), p and q, Vieta (14-15), word problems (18-19).')

# ------------------------------------------------------------- Formel ----
Q.q(r'Löse mit der Lösungsformel: $x^2 - 6x + 8 = 0$',
    [r'$x = 2$ oder $x = 4$', r'$x = -2$ oder $x = -4$', r'$x = 3$', r'keine Lösung'],
    [r'$p = -6$, $q = 8$: $x = 3 \pm \sqrt{9 - 8}$',
     r'$x = 3 \pm 1$, also 4 oder 2.'])

Q.q(r'Löse: $x^2 + 2x - 15 = 0$',
    [r'$x = 3$ oder $x = -5$', r'$x = -3$ oder $x = 5$', r'$x = 15$', r'$x = 1 \pm 4$'],
    [r'$x = -1 \pm \sqrt{1 + 15} = -1 \pm 4$',
     r'$x = 3$ oder $x = -5$'])

Q.q(r'Löse: $x^2 - 4x + 4 = 0$',
    [r'nur $x = 2$', r'$x = 2$ oder $x = -2$', r'$x = 4$', r'keine Lösung'],
    [r'$x = 2 \pm \sqrt{4 - 4} = 2 \pm 0$',
     r'Genau eine Lösung: Der Scheitel berührt die $x$-Achse.'])

Q.q(r'Löse: $x^2 + 2x + 5 = 0$',
    [r'Es gibt keine Lösung.', r'$x = -1 \pm 2$', r'$x = 5$', r'$x = -1$'],
    [r'Unter der Wurzel steht $1 - 5 = -4$.',
     r'Aus einer negativen Zahl zieht man keine Quadratwurzel: keine Lösung.'])

Q.q(r'Wie groß ist die Diskriminante $D = \left(\dfrac{p}{2}\right)^2 - q$ für $x^2 - 6x + 5 = 0$, und wie viele Lösungen gibt es?',
    [r'$D = 4$, zwei Lösungen', r'$D = -4$, keine Lösung', r'$D = 0$, eine Lösung', r'$D = 14$, zwei Lösungen'],
    [r'$\left(\dfrac{-6}{2}\right)^2 - 5 = 9 - 5 = 4 > 0$',
     r'Zwei Lösungen: 5 und 1.'])

Q.q(r'Welche Fallunterscheidung gilt für die Diskriminante $D$?',
    [r'$D > 0$: zwei, $D = 0$: eine, $D < 0$: keine Lösung', r'$D > 0$: keine, $D = 0$: eine, $D < 0$: zwei Lösungen',
     r'immer zwei Lösungen', r'$D > 0$: eine, $D < 0$: zwei Lösungen'],
    [r'Die Wurzel aus $D$ wird addiert und subtrahiert.',
     r'Ist $D = 0$, fallen beide Lösungen zusammen; ist $D < 0$, gibt es keine Wurzel.'])

Q.q(r'Löse: $2x^2 - 8x + 6 = 0$',
    [r'$x = 1$ oder $x = 3$', r'$x = 2$ oder $x = 6$', r'$x = -1$ oder $x = -3$', r'$x = 4 \pm \sqrt{10}$'],
    [r'Erst durch 2 teilen: $x^2 - 4x + 3 = 0$.',
     r'$x = 2 \pm \sqrt{4 - 3} = 2 \pm 1$'])

Q.q(r'Löse: $x^2 - x - 6 = 0$',
    [r'$x = 3$ oder $x = -2$', r'$x = -3$ oder $x = 2$', r'$x = 6$', r'$x = 1 \pm 6$'],
    [r'$x = 0{,}5 \pm \sqrt{0{,}25 + 6} = 0{,}5 \pm 2{,}5$'])

Q.q(r'Löse: $x^2 + 5x + 6 = 0$',
    [r'$x = -2$ oder $x = -3$', r'$x = 2$ oder $x = 3$', r'$x = -6$', r'keine Lösung'],
    [r'$x = -2{,}5 \pm \sqrt{6{,}25 - 6} = -2{,}5 \pm 0{,}5$'])

Q.q(r'Löse: $x^2 - 3x - 4 = 0$',
    [r'$x = 4$ oder $x = -1$', r'$x = -4$ oder $x = 1$', r'$x = 3$', r'$x = 1{,}5 \pm 4$'],
    [r'$x = 1{,}5 \pm \sqrt{2{,}25 + 4} = 1{,}5 \pm 2{,}5$'])

Q.q(r'Löse: $3x^2 + 6x - 9 = 0$',
    [r'$x = 1$ oder $x = -3$', r'$x = -1$ oder $x = 3$', r'$x = 3$ oder $x = -9$', r'keine Lösung'],
    [r'Durch 3 teilen: $x^2 + 2x - 3 = 0$',
     r'$x = -1 \pm \sqrt{1 + 3} = -1 \pm 2$'])

Q.q(r'Löse: $x^2 + 4x + 1 = 0$ (gerundet).',
    [r'$x \approx -0{,}27$ oder $x \approx -3{,}73$', r'$x \approx 0{,}27$ oder $x \approx 3{,}73$', r'$x = -2$', r'keine Lösung'],
    [r'$x = -2 \pm \sqrt{4 - 1} = -2 \pm \sqrt{3}$',
     r'$\sqrt{3} \approx 1{,}73$'])

Q.q(r'Löse: $x^2 - 2x - 1 = 0$ (gerundet).',
    [r'$x \approx 2{,}41$ oder $x \approx -0{,}41$', r'$x \approx -2{,}41$ oder $x \approx 0{,}41$', r'$x = 1$', r'$x = 1 \pm 2$'],
    [r'$x = 1 \pm \sqrt{1 + 1} = 1 \pm \sqrt{2}$'])

Q.q(r'Welche Werte haben $p$ und $q$ in $x^2 - 7x + 10 = 0$?',
    [r'$p = -7$, $q = 10$', r'$p = 7$, $q = 10$', r'$p = -7$, $q = -10$', r'$p = 1$, $q = -7$'],
    [r'Die Vorzeichen gehören dazu: $x^2 + (-7)x + 10$.'])

Q.q(r'Eine quadratische Gleichung $x^2 + px + q = 0$ hat die Lösungen 2 und 5. Wie lautet sie?',
    [r'$x^2 - 7x + 10 = 0$', r'$x^2 + 7x + 10 = 0$', r'$x^2 - 10x + 7 = 0$', r'$x^2 + 3x - 10 = 0$'],
    [r'$(x - 2)(x - 5) = x^2 - 7x + 10$',
     r'Allgemein: $x_1 + x_2 = -p$ und $x_1 \cdot x_2 = q$ (Satz von Vieta).'])

Q.q(r'Für welches $q$ hat $x^2 + 6x + q = 0$ genau eine Lösung?',
    [r'$q = 9$', r'$q = 6$', r'$q = 36$', r'$q = 0$'],
    [r'Genau eine Lösung bei $D = 0$: $9 - q = 0$.',
     r'$q = 9$, dann ist $x^2 + 6x + 9 = (x + 3)^2$.'])

Q.q(r'Löse: $x^2 = 3x + 10$',
    [r'$x = 5$ oder $x = -2$', r'$x = -5$ oder $x = 2$', r'$x = 10$', r'keine Lösung'],
    [r'Erst auf Normalform: $x^2 - 3x - 10 = 0$',
     r'$x = 1{,}5 \pm \sqrt{2{,}25 + 10} = 1{,}5 \pm 3{,}5$'])

Q.q(r'Ein Rechteck hat 20 cm Umfang und 24 cm² Flächeninhalt. Wie lang sind die Seiten?',
    [r'4 cm und 6 cm', r'3 cm und 8 cm', r'2 cm und 12 cm', r'5 cm und 5 cm'],
    [r'Seiten $x$ und $10 - x$: $x \cdot (10 - x) = 24$',
     r'$x^2 - 10x + 24 = 0$, $x = 5 \pm 1$'])

Q.q(r'Zwei aufeinanderfolgende natürliche Zahlen haben das Produkt 132. Welche sind es?',
    [r'11 und 12', r'12 und 13', r'10 und 11', r'6 und 22'],
    [r'$x \cdot (x + 1) = 132$, also $x^2 + x - 132 = 0$',
     r'$x = -0{,}5 \pm \sqrt{0{,}25 + 132} = -0{,}5 \pm 11{,}5$; natürlich ist $x = 11$.'])

Q.q(r'Löse: $x^2 + 0{,}5x - 0{,}5 = 0$',
    [r'$x = 0{,}5$ oder $x = -1$', r'$x = -0{,}5$ oder $x = 1$', r'$x = 0{,}25$', r'keine Lösung'],
    [r'$x = -0{,}25 \pm \sqrt{0{,}0625 + 0{,}5} = -0{,}25 \pm 0{,}75$'])


def check():
    import sympy as sp
    x = sp.symbols('x')
    s = lambda e: sorted(sp.solve(e, x), key=lambda v: complex(v).real)
    assert s(x**2 - 6*x + 8) == [2, 4] and s(x**2 + 2*x - 15) == [-5, 3] and s(x**2 - 4*x + 4) == [2]
    assert all(not v.is_real for v in sp.solve(x**2 + 2*x + 5, x)) and 9 - 5 == 4
    assert s(2*x**2 - 8*x + 6) == [1, 3] and s(x**2 - x - 6) == [-2, 3] and s(x**2 + 5*x + 6) == [-3, -2]
    assert s(x**2 - 3*x - 4) == [-1, 4] and s(3*x**2 + 6*x - 9) == [-3, 1]
    assert [round(float(v), 2) for v in s(x**2 + 4*x + 1)] == [-3.73, -0.27]
    assert [round(float(v), 2) for v in s(x**2 - 2*x - 1)] == [-0.41, 2.41]
    assert sp.expand((x - 2)*(x - 5)) == x**2 - 7*x + 10 and s(x**2 + 6*x + 9) == [-3]
    assert s(x**2 - 3*x - 10) == [-2, 5] and s(x*(10 - x) - 24) == [4, 6] and s(x*(x + 1) - 132) == [-12, 11]
    assert s(x**2 + sp.Rational(1, 2)*x - sp.Rational(1, 2)) == [-1, sp.Rational(1, 2)]


Q.verify(check)
Q.save()
