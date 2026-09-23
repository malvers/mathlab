#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 19 (LB 2): Schnitt- und Berührungspunkte zweier Graphen
(gleicher Funktionswert, gleicher Anstieg), Funktionenscharen f_a(x) mit einem Parameter
(Nullstellen, Extrema, Fallunterscheidung), Steckbriefaufgaben (Funktionsgleichung aus
Bedingungen über ein LGS). Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec
from svgfig import Plot

Q = fos12(nr=19, slug='funktionenscharen', thema='Schnittpunkte, Funktionenscharen, Steckbriefaufgaben', lb='LB 2',
          blurb='Schnitt- und Berührungspunkte, Scharen mit Parameter, Funktionsgleichungen bestimmen',
          comment='Blocks: Schnittpunkte (1-5), Berührung (6-8), Funktionenscharen (9-14), Steckbriefaufgaben (15-20). Alles ohne CAS.')


def fig_beruehrung():
    """f(x) = x^3 - 3x and the line g(x) = -2: touch at (1|-2), cut at (-2|-2)."""
    f = lambda u: u**3 - 3*u
    p = Plot((-3, 3), (-4, 4), w=520, h=340)
    p.grid(1, 1)
    p.axes(xstep=1, ystep=1, xlabel="x", ylabel="y", defer_labels=True)
    p.curve(f, -2.4, 2.4)
    p.seg((-3, -2), (3, -2), color="#799E31", width=1.7)
    p.point(1, -2, "B", "below")
    p.point(-2, -2, "S", "above-left")
    p.draw_labels()
    return p.svg("Graph von f und Gerade g mit Berührpunkt B und Schnittpunkt S")


# ------------------------------------------------------------ Schnittpunkte ----
Q.q(r'Bestimme die Schnittpunkte der Graphen von $f(x) = x^2$ und $g(x) = 2x + 3$.',
    [r'$S_1(-1|1)$ und $S_2(3|9)$', r'$S_1(1|5)$ und $S_2(-3|-3)$', r'nur $S(3|9)$', r'$S_1(-1|-1)$ und $S_2(3|9)$'],
    [r'Gleichsetzen: $x^2 = 2x + 3 \Leftrightarrow x^2 - 2x - 3 = 0$',
     r'$x_{1,2} = 1 \pm \sqrt{1 + 3} = 1 \pm 2$, also $x_1 = -1$, $x_2 = 3$',
     r'$y$-Werte: $f(-1) = 1$, $f(3) = 9$; Probe mit $g$: $g(-1) = 1$, $g(3) = 9$. Passt.',
     r'Falle: $(-1|-1)$ - der $y$-Wert von $x^2$ ist bei $x = -1$ positiv.'])

Q.q(r'Wo schneiden sich die Graphen von $f(x) = x^3 - x$ und $g(x) = 3x$?',
    [r'in $(0|0)$, $(2|6)$ und $(-2|-6)$', r'nur in $(0|0)$ und $(2|6)$', r'nur in $(2|6)$ und $(-2|-6)$', r'in $(0|0)$, $(4|12)$ und $(-4|-12)$'],
    [r'$x^3 - x = 3x \Leftrightarrow x^3 - 4x = 0 \Leftrightarrow x\,(x - 2)(x + 2) = 0$',
     r'$x = 0$, $x = 2$, $x = -2$; $y$-Werte über $g$: $0$, $6$, $-6$',
     r'Falle: Division durch $x$ verschluckt den Schnittpunkt im Ursprung.'])

Q.q(r'Bestimme die gemeinsamen Punkte von $f(x) = x^2 - 4$ und $g(x) = -x^2 + 4$.',
    [r'$(2|0)$ und $(-2|0)$', r'$(0|4)$ und $(0|-4)$', r'$(2|4)$ und $(-2|4)$', r'keine gemeinsamen Punkte'],
    [r'$x^2 - 4 = -x^2 + 4 \Leftrightarrow 2x^2 = 8 \Leftrightarrow x^2 = 4$',
     r'$x = \pm 2$, $f(\pm 2) = 4 - 4 = 0$',
     r'Beide Parabeln schneiden sich genau in ihren Nullstellen auf der $x$-Achse.'])

Q.q(r'Für welche $x$ liegt der Graph von $f(x) = x^2$ oberhalb des Graphen von $g(x) = 2x + 3$?',
    [r'für $x < -1$ und für $x > 3$', r'für $-1 < x < 3$', r'nur für $x > 3$', r'für alle $x$'],
    [r'Schnittstellen aus $x^2 - 2x - 3 = 0$: $x = -1$ und $x = 3$.',
     r'Die Differenz $d(x) = x^2 - 2x - 3$ ist eine nach oben geöffnete Parabel: positiv außerhalb der Nullstellen.',
     r'Probe: $d(0) = -3 < 0$ (dazwischen liegt $f$ unter $g$), $d(4) = 5 > 0$. Passt.'])

Q.q(r'Wie viele gemeinsame Punkte haben die Graphen von $f(x) = x^2 + 1$ und $g(x) = x - 1$?',
    [r'keinen', r'genau einen (Berührung)', r'zwei', r'genau einen, nämlich $(2|5)$'],
    [r'$x^2 + 1 = x - 1 \Leftrightarrow x^2 - x + 2 = 0$',
     r'Diskriminante: $D = 1 - 8 = -7 < 0$: keine reelle Lösung.',
     r'Anschaulich: die Parabel liegt oberhalb von $y = 1$, die Gerade $x - 1$ bleibt darunter, solange $x < 2$ - und für $x \geq 2$ wächst $x^2 + 1$ schneller.'])

# ------------------------------------------------------------- Berührung ----
Q.q(r'Wann berühren sich die Graphen zweier Funktionen $f$ und $g$ an der Stelle $x_0$?',
    [r'wenn $f(x_0) = g(x_0)$ und $f^{\prime}(x_0) = g^{\prime}(x_0)$ gilt',
     r'wenn $f(x_0) = g(x_0)$ gilt',
     r'wenn $f^{\prime}(x_0) = g^{\prime}(x_0)$ gilt',
     r'wenn $f(x_0) = g(x_0)$ und $f^{\prime\prime}(x_0) = g^{\prime\prime}(x_0)$ gilt'],
    [r'Berühren heißt: gemeinsamer Punkt und gemeinsame Tangente.',
     r'Gemeinsamer Punkt: $f(x_0) = g(x_0)$; gemeinsame Tangente: gleicher Anstieg $f^{\prime}(x_0) = g^{\prime}(x_0)$.',
     r'Nur gleicher Funktionswert wäre ein Schnittpunkt; nur gleicher Anstieg bedeutet parallele Tangenten, vielleicht weit voneinander entfernt.'])

Q.q(r'Für welches $c$ berührt die Gerade $g(x) = 2x + c$ die Parabel $f(x) = x^2$?',
    [r'$c = -1$', r'$c = 1$', r'$c = 0$', r'$c = -2$'],
    [r'Gleicher Anstieg: $f^{\prime}(x) = 2x = 2 \Rightarrow x_0 = 1$',
     r'Gleicher Funktionswert: $f(1) = 1 = 2 \cdot 1 + c \Rightarrow c = -1$',
     r'Probe: $x^2 = 2x - 1 \Leftrightarrow (x - 1)^2 = 0$, doppelte Lösung - Berührung in $B(1|1)$.'])

Q.q(r'Untersuche die gemeinsamen Punkte von $f(x) = x^3 - 3x$ und der Geraden $g(x) = -2$.',
    [r'Berührung in $B(1|-2)$, zusätzlich ein Schnittpunkt $S(-2|-2)$', r'nur eine Berührung in $B(1|-2)$', r'Schnittpunkt in $(1|-2)$, keine Berührung', r'keine gemeinsamen Punkte'],
    [r'$x^3 - 3x = -2 \Leftrightarrow x^3 - 3x + 2 = 0$; $x = 1$ ist Lösung, Polynomdivision: $(x - 1)(x^2 + x - 2) = (x - 1)^2 (x + 2)$',
     r'Doppelte Lösung $x = 1$: Berührung. Probe über den Anstieg: $f^{\prime}(1) = 3 - 3 = 0 = g^{\prime}(1)$. Passt.',
     r'Einfache Lösung $x = -2$: dort schneidet die Gerade den Graphen, $f^{\prime}(-2) = 9 \neq 0$.',
     r'$B(1|-2)$ ist zugleich der Tiefpunkt von $f$ - die waagerechte Gerade durch einen Tiefpunkt berührt immer.'],
    fig=fig_beruehrung(), figcap=r'$f(x) = x^3 - 3x$ und $g(x) = -2$: Berührpunkt $B$ und Schnittpunkt $S$')

# ------------------------------------------------------ Funktionenscharen ----
Q.q(r'Gegeben ist die Schar $f_a(x) = x^2 - a$. Wie viele Nullstellen hat $f_a$ in Abhängigkeit von $a$?',
    [r'$a > 0$: zwei ($x = \pm\sqrt{a}$), $a = 0$: eine ($x = 0$), $a < 0$: keine',
     r'für jedes $a$ zwei Nullstellen $x = \pm\sqrt{a}$',
     r'$a < 0$: zwei, $a = 0$: eine, $a > 0$: keine',
     r'$a > 0$: eine ($x = \sqrt{a}$), sonst keine'],
    [r'$x^2 - a = 0 \Leftrightarrow x^2 = a$',
     r'Fallunterscheidung: $a > 0$: $x = \pm\sqrt{a}$; $a = 0$: nur $x = 0$ (doppelt); $a < 0$: $x^2$ kann nicht negativ sein.',
     r'Beispiel $a = 4$: $x = \pm 2$; Beispiel $a = -1$: $x^2 = -1$ hat keine Lösung.'])

Q.q(r'Für welche Werte von $a$ hat die Schar $f_a(x) = x^3 - a\,x$ Extrempunkte?',
    [r'nur für $a > 0$', r'für alle $a \neq 0$', r'für alle $a$', r'nur für $a < 0$'],
    [r'$f_a^{\prime}(x) = 3x^2 - a = 0 \Leftrightarrow x^2 = \dfrac{a}{3}$',
     r'Lösbar nur für $a > 0$: $x = \pm\sqrt{\dfrac{a}{3}}$; dann $f_a^{\prime\prime}(x) = 6x \neq 0$ - ein Hoch- und ein Tiefpunkt.',
     r'$a = 0$: $f_0(x) = x^3$ hat nur einen Sattelpunkt; $a < 0$: $f_a^{\prime}(x) > 0$ überall, der Graph steigt nur.'])

Q.q(r'Bestimme den Extrempunkt von $f_a(x) = a\,x^2 - 4x$ ($a \neq 0$) und seine Art.',
    [r'$E\left(\dfrac{2}{a}\,\middle|\,-\dfrac{4}{a}\right)$, Tiefpunkt für $a > 0$, Hochpunkt für $a < 0$',
     r'$E\left(\dfrac{2}{a}\,\middle|\,\dfrac{4}{a}\right)$, Tiefpunkt für $a > 0$',
     r'$E\left(\dfrac{a}{2}\,\middle|\,-\dfrac{4}{a}\right)$, Tiefpunkt für alle $a$',
     r'$E\left(\dfrac{2}{a}\,\middle|\,-\dfrac{4}{a}\right)$, Hochpunkt für $a > 0$, Tiefpunkt für $a < 0$'],
    [r'$f_a^{\prime}(x) = 2ax - 4 = 0 \Rightarrow x_E = \dfrac{2}{a}$',
     r'$f_a\!\left(\dfrac{2}{a}\right) = a \cdot \dfrac{4}{a^2} - \dfrac{8}{a} = \dfrac{4}{a} - \dfrac{8}{a} = -\dfrac{4}{a}$',
     r'$f_a^{\prime\prime}(x) = 2a$: für $a > 0$ positiv (Tiefpunkt, Parabel nach oben offen), für $a < 0$ negativ (Hochpunkt).',
     r'Probe mit $a = 2$: $f_2(x) = 2x^2 - 4x$ hat den Tiefpunkt $(1|-2)$. Passt.'])

Q.q(r'Für welches $a$ verläuft der Graph von $f_a(x) = x^2 + a\,x + 4$ durch den Punkt $P(1|2)$?',
    [r'$a = -3$', r'$a = 3$', r'$a = -5$', r'$a = -7$'],
    [r'Punktprobe: $f_a(1) = 1 + a + 4 = 2$',
     r'$a + 5 = 2 \Rightarrow a = -3$',
     r'Probe: $f_{-3}(1) = 1 - 3 + 4 = 2$. Passt. Falle: $a = -5$ ergibt $f_a(1) = 0$, also eine Nullstelle statt $P$.'])

Q.q(r'Für welche $a$ hat $f_a(x) = x^2 + a\,x + 4$ genau eine Nullstelle (der Graph berührt die $x$-Achse)?',
    [r'$a = 4$ oder $a = -4$', r'nur $a = 4$', r'$a = 2$ oder $a = -2$', r'$a = 16$'],
    [r'Genau eine Nullstelle, wenn die Diskriminante null ist: $D = a^2 - 4 \cdot 1 \cdot 4 = a^2 - 16$',
     r'$a^2 - 16 = 0 \Rightarrow a = \pm 4$',
     r'Probe: $a = 4$: $(x + 2)^2$; $a = -4$: $(x - 2)^2$ - beide berühren die $x$-Achse.',
     r'Falle: das negative $a$ nicht vergessen.'])

Q.q(r'Bestimme den Wendepunkt der Schar $f_a(x) = x^3 - 3a\,x^2$ in Abhängigkeit von $a$.',
    [r'$W(a\,|\,-2a^3)$', r'$W(a\,|\,a^3)$', r'$W(2a\,|\,-4a^3)$', r'$W(0\,|\,0)$'],
    [r'$f_a^{\prime}(x) = 3x^2 - 6ax$, $f_a^{\prime\prime}(x) = 6x - 6a = 0 \Rightarrow x = a$; $f_a^{\prime\prime\prime}(x) = 6 \neq 0$',
     r'$f_a(a) = a^3 - 3a \cdot a^2 = a^3 - 3a^3 = -2a^3$',
     r'Falle: $(2a|-4a^3)$ ist der zweite Extrempunkt ($f_a^{\prime}(2a) = 0$), nicht der Wendepunkt.',
     r'Probe mit $a = 1$: $f_1(x) = x^3 - 3x^2$ hat den Wendepunkt $(1|-2)$. Passt.'])

# ------------------------------------------------------ Steckbriefaufgaben ----
Q.q(r'Eine Parabel $f(x) = ax^2 + bx + c$ schneidet die $y$-Achse bei $1$ und hat den Tiefpunkt $T(2|-3)$. Wie lautet $f$?',
    [r'$f(x) = x^2 - 4x + 1$', r'$f(x) = x^2 + 4x + 1$', r'$f(x) = -x^2 + 4x + 1$', r'$f(x) = x^2 - 4x - 3$'],
    [r'Bedingungen: $f(0) = 1$, $f(2) = -3$, $f^{\prime}(2) = 0$ (waagerechte Tangente im Tiefpunkt).',
     r'$f(0) = 1 \Rightarrow c = 1$; $f^{\prime}(x) = 2ax + b$: $4a + b = 0 \Rightarrow b = -4a$',
     r'$f(2) = 4a + 2b + 1 = 4a - 8a + 1 = -3 \Rightarrow a = 1$, $b = -4$',
     r'Probe: $f(2) = 4 - 8 + 1 = -3$, $f^{\prime\prime}(2) = 2 > 0$ (Tiefpunkt). Passt.'])

Q.q(r'Der Graph einer ganzrationalen Funktion dritten Grades ist punktsymmetrisch zum Ursprung und hat den Tiefpunkt $T(1|-2)$. Wie lautet die Funktionsgleichung?',
    [r'$f(x) = x^3 - 3x$', r'$f(x) = -x^3 + x$', r'$f(x) = x^3 + 3x$', r'$f(x) = -x^3 + 3x$'],
    [r'Punktsymmetrie zum Ursprung: nur ungerade Exponenten, Ansatz $f(x) = ax^3 + bx$ (zwei Unbekannte, zwei Bedingungen).',
     r'$f(1) = a + b = -2$ und $f^{\prime}(1) = 3a + b = 0$',
     r'Subtrahieren: $2a = 2 \Rightarrow a = 1$, $b = -3$',
     r'Probe: $f^{\prime\prime}(1) = 6 > 0$, also wirklich ein Tiefpunkt. Passt.'])

Q.q(r'Der Graph einer ganzrationalen Funktion dritten Grades hat den Wendepunkt im Ursprung und den Hochpunkt $H(1|2)$. Wie lautet $f$?',
    [r'$f(x) = -x^3 + 3x$', r'$f(x) = x^3 - 3x$', r'$f(x) = -x^3 + 2x$', r'$f(x) = -x^3 + 3x^2$'],
    [r'Ansatz $f(x) = ax^3 + bx^2 + cx + d$; Wendepunkt im Ursprung: $f(0) = 0 \Rightarrow d = 0$ und $f^{\prime\prime}(0) = 2b = 0 \Rightarrow b = 0$',
     r'Hochpunkt $H(1|2)$: $f(1) = a + c = 2$ und $f^{\prime}(1) = 3a + c = 0$',
     r'Subtrahieren: $2a = -2 \Rightarrow a = -1$, $c = 3$',
     r'Probe: $f^{\prime\prime}(1) = -6 < 0$ (Hochpunkt), $f^{\prime\prime\prime}(0) = -6 \neq 0$ (Wendepunkt). Passt.'])

Q.q(r'Der Graph einer ganzrationalen Funktion vierten Grades ist achsensymmetrisch zur $y$-Achse. Wie viele Bedingungen braucht man, um die Funktionsgleichung zu bestimmen?',
    [r'$3$, denn der Ansatz $f(x) = ax^4 + bx^2 + c$ hat drei Unbekannte', r'$5$, wie bei jeder Funktion vierten Grades', r'$4$', r'$2$'],
    [r'Achsensymmetrie zur $y$-Achse: nur gerade Exponenten, also $f(x) = ax^4 + bx^2 + c$.',
     r'Drei Koeffizienten $a$, $b$, $c$ - drei unabhängige Bedingungen genügen.',
     r'Ohne Symmetrie wären es fünf Unbekannte ($x^4$ bis $x^0$) und damit fünf Bedingungen.'])

Q.q(r'Eine ganzrationale Funktion dritten Grades hat den Tiefpunkt $T(0|0)$ und den Hochpunkt $H(2|4)$. Wie lautet $f$?',
    [r'$f(x) = -x^3 + 3x^2$', r'$f(x) = x^3 - 3x^2$', r'$f(x) = -x^3 + 2x^2$', r'$f(x) = -x^3 + 3x^2 - 4$'],
    [r'Ansatz $f(x) = ax^3 + bx^2 + cx + d$; $T(0|0)$: $f(0) = 0 \Rightarrow d = 0$, $f^{\prime}(0) = 0 \Rightarrow c = 0$',
     r'$H(2|4)$: $f(2) = 8a + 4b = 4$ und $f^{\prime}(2) = 12a + 4b = 0$',
     r'Subtrahieren: $4a = -4 \Rightarrow a = -1$, dann $4b = 12 \Rightarrow b = 3$',
     r'Probe: $f^{\prime\prime}(x) = -6x + 6$: $f^{\prime\prime}(0) = 6 > 0$ (Tiefpunkt), $f^{\prime\prime}(2) = -6 < 0$ (Hochpunkt). Passt.'])

Q.q(r'Eine Rampe soll durch eine ganzrationale Funktion dritten Grades beschrieben werden: Sie beginnt in $(0|0)$ waagerecht und geht in $(4|2)$ waagerecht in die obere Ebene über (Maße in m). Wie lautet $f$?',
    [r'$f(x) = -\dfrac{1}{16}x^3 + \dfrac{3}{8}x^2$', r'$f(x) = \dfrac{1}{16}x^3 - \dfrac{3}{8}x^2$', r'$f(x) = -\dfrac{1}{8}x^3 + \dfrac{3}{4}x^2$', r'$f(x) = -\dfrac{1}{16}x^3 + \dfrac{3}{8}x^2 + 2$'],
    [r'Bedingungen: $f(0) = 0$, $f^{\prime}(0) = 0$, $f(4) = 2$, $f^{\prime}(4) = 0$; damit $d = 0$ und $c = 0$.',
     r'$f(4) = 64a + 16b = 2$ und $f^{\prime}(4) = 48a + 8b = 0 \Rightarrow b = -6a$',
     r'$64a - 96a = 2 \Rightarrow a = -\dfrac{1}{16}$, $b = \dfrac{3}{8}$',
     r'Probe: $f(4) = -4 + 6 = 2$, $f^{\prime}(4) = -3 + 3 = 0$. Passt. Falle: $-\dfrac{1}{8}x^3 + \dfrac{3}{4}x^2$ endet bei $f(4) = 4$, doppelt so hoch.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    x, a = sp.symbols('x a')
    d = sp.diff
    eq = lambda u, v: sp.simplify(u - v) == 0
    # 1
    assert sorted(sp.solve(x**2 - (2*x + 3), x)) == [-1, 3]
    assert (x**2).subs(x, -1) == 1 and (2*x + 3).subs(x, -1) == 1 and (x**2).subs(x, 3) == 9 and (2*x + 3).subs(x, 3) == 9
    # 2
    assert sorted(sp.solve(x**3 - x - 3*x, x)) == [-2, 0, 2]
    assert (x**3 - x).subs(x, 2) == 6 and (x**3 - x).subs(x, -2) == -6
    # 3
    assert sorted(sp.solve(x**2 - 4 - (-x**2 + 4), x)) == [-2, 2] and (x**2 - 4).subs(x, 2) == 0
    # 4
    dd = x**2 - 2*x - 3
    assert dd.subs(x, 0) == -3 and dd.subs(x, 4) == 5 and dd.subs(x, -2) == 5
    # 5
    assert sp.discriminant(x**2 - x + 2, x) == -7 and sp.solveset(x**2 + 1 - (x - 1), x, domain=sp.S.Reals) == sp.S.EmptySet
    # 6: Begriff
    # 7
    assert sp.solve(sp.Eq(d(x**2, x), 2), x) == [1]
    c = sp.symbols('c')
    assert sp.solve(sp.Eq(1, 2*1 + c), c) == [-1]
    assert sp.roots(x**2 - (2*x - 1)) == {1: 2}
    # 8
    f8 = x**3 - 3*x
    assert eq(sp.expand((x - 1)**2 * (x + 2)), x**3 - 3*x + 2)
    assert sp.roots(f8 + 2) == {1: 2, -2: 1}
    assert d(f8, x).subs(x, 1) == 0 and d(f8, x).subs(x, -2) == 9 and f8.subs(x, 1) == -2 and f8.subs(x, -2) == -2
    # 9
    assert sorted(sp.solve(x**2 - 4, x)) == [-2, 2] and sp.solveset(x**2 + 1, x, domain=sp.S.Reals) == sp.S.EmptySet and sp.roots(x**2) == {0: 2}
    # 10
    f10 = x**3 - a*x
    assert eq(d(f10, x), 3*x**2 - a)
    assert sorted(sp.solve(d(f10, x).subs(a, 3), x)) == [-1, 1] and sp.solveset(d(f10, x).subs(a, -3), x, domain=sp.S.Reals) == sp.S.EmptySet
    assert sp.roots(d(f10, x).subs(a, 0)) == {0: 2}
    # 11
    f11 = a*x**2 - 4*x
    xe = sp.solve(d(f11, x), x)[0]
    assert eq(xe, 2/a) and eq(f11.subs(x, xe), -4/a) and eq(d(f11, x, 2), 2*a)
    assert (2*x**2 - 4*x).subs(x, 1) == -2 and sp.solve(d(2*x**2 - 4*x, x), x) == [1]
    # 12
    assert sp.solve(sp.Eq(1 + a + 4, 2), a) == [-3] and sp.solve(sp.Eq(1 + a + 4, 0), a) == [-5]
    # 13
    assert sorted(sp.solve(a**2 - 16, a)) == [-4, 4]
    assert eq(sp.expand((x + 2)**2), x**2 + 4*x + 4) and eq(sp.expand((x - 2)**2), x**2 - 4*x + 4)
    # 14
    f14 = x**3 - 3*a*x**2
    assert sp.solve(d(f14, x, 2), x) == [a] and d(f14, x, 3) == 6
    assert eq(f14.subs(x, a), -2*a**3)
    assert sorted(sp.solve(d(f14, x).subs(a, 1), x)) == [0, 2] and eq(f14.subs(x, 2*a), -4*a**3)
    assert f14.subs({a: 1, x: 1}) == -2
    # 15
    A, B, C = sp.symbols('A B C')
    f = A*x**2 + B*x + C
    sol = sp.solve([sp.Eq(f.subs(x, 0), 1), sp.Eq(f.subs(x, 2), -3), sp.Eq(d(f, x).subs(x, 2), 0)], [A, B, C])
    assert sol == {A: 1, B: -4, C: 1}
    f15 = x**2 - 4*x + 1
    assert f15.subs(x, 2) == -3 and d(f15, x, 2) == 2
    # 16
    g = A*x**3 + B*x
    sol = sp.solve([sp.Eq(g.subs(x, 1), -2), sp.Eq(d(g, x).subs(x, 1), 0)], [A, B])
    assert sol == {A: 1, B: -3} and d(x**3 - 3*x, x, 2).subs(x, 1) == 6
    # 17
    D = sp.symbols('D')
    h = A*x**3 + B*x**2 + C*x + D
    sol = sp.solve([sp.Eq(h.subs(x, 0), 0), sp.Eq(d(h, x, 2).subs(x, 0), 0), sp.Eq(h.subs(x, 1), 2), sp.Eq(d(h, x).subs(x, 1), 0)], [A, B, C, D])
    assert sol == {A: -1, B: 0, C: 3, D: 0}
    assert d(-x**3 + 3*x, x, 2).subs(x, 1) == -6 and d(-x**3 + 3*x, x, 3) == -6
    # 18: Begriff (Anzahl Koeffizienten)
    assert len(sp.Poly(A*x**4 + B*x**2 + C, x).coeffs()) == 3
    # 19
    sol = sp.solve([sp.Eq(h.subs(x, 0), 0), sp.Eq(d(h, x).subs(x, 0), 0), sp.Eq(h.subs(x, 2), 4), sp.Eq(d(h, x).subs(x, 2), 0)], [A, B, C, D])
    assert sol == {A: -1, B: 3, C: 0, D: 0}
    f19 = -x**3 + 3*x**2
    assert d(f19, x, 2).subs(x, 0) == 6 and d(f19, x, 2).subs(x, 2) == -6
    # 20
    sol = sp.solve([sp.Eq(h.subs(x, 0), 0), sp.Eq(d(h, x).subs(x, 0), 0), sp.Eq(h.subs(x, 4), 2), sp.Eq(d(h, x).subs(x, 4), 0)], [A, B, C, D])
    assert sol == {A: sp.Rational(-1, 16), B: sp.Rational(3, 8), C: 0, D: 0}
    f20 = sp.Rational(-1, 16)*x**3 + sp.Rational(3, 8)*x**2
    assert f20.subs(x, 4) == 2 and d(f20, x).subs(x, 4) == 0
    assert (sp.Rational(-1, 8)*x**3 + sp.Rational(3, 4)*x**2).subs(x, 4) == 4
    assert F(-1, 16) * 64 + F(3, 8) * 16 == 2 and F(-1, 16) * 48 + F(3, 8) * 8 == 0


Q.verify(check)
Q.save()
