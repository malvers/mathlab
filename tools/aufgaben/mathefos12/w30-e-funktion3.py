#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 30 (LB 4): Exponentialfunktionen zur Basis e III - Extrem- und
Wendepunkte, Wertebereich, Stammfunktion von e hoch (ax+b), Flächenberechnungen (GTR ohne CAS).
Plan: HTML/svp/mathe/mathefos12.html."""
import math
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12
import svgfig as S

Q = fos12(nr=30, slug='e-funktion3', thema='e-Funktionen III', lb='LB 4',
          blurb='Extrem- und Wendepunkte, Wertebereich, Stammfunktion und Flächen',
          comment='Blocks: Extrempunkte (1-6), Wendepunkte (7-10), Wertebereich (11-13), Stammfunktion von e hoch (ax+b) (14-16), Flächen und Anwendungen (17-20). GTR ohne CAS.')


# ------------------------------------------------------------- figures ----
def fig_xexp():
    f = lambda x: x * math.exp(-x)
    p = S.Plot((-1.3, 6.3), (-1.6, 1.3), w=520, h=320)
    p.axes(1, 1, xlabel="x", ylabel="y")
    p.curve(f, -0.55, 6.2, S.RED, 2.2)
    p.point(1, math.exp(-1), "H", "above-right")
    p.point(2, 2 * math.exp(-2), "W", "above-right")
    return p.svg("Graph von f mit Hochpunkt H bei x gleich 1 und Wendepunkt W bei x gleich 2")


def fig_flaeche():
    f = lambda x: math.exp(-x)
    p = S.Plot((-0.8, 4.4), (-0.5, 2.4), w=520, h=310)
    p.axes(1, 1, xlabel="x", ylabel="y")
    p.area(f, 0, 2, S.ORANGE, 0.35)
    p.curve(f, -0.75, 4.3, S.RED, 2.2)
    return p.svg("Fläche unter dem Graphen von e hoch minus x zwischen x gleich 0 und x gleich 2")


# ---------------------------------------------------------- Extrempunkte ----
Q.q(r'Wie löst man die Gleichung $(2-x) \cdot e^{x} = 0$?',
    [r'$e^{x}$ ist nie null, also muss $2 - x = 0$ sein: $x = 2$.',
     r'Beide Faktoren null setzen: $x = 2$ und $x = 0$.',
     r'$e^{x} = 0$ für $x = 0$, also $x = 0$.',
     r'Die Gleichung hat keine Lösung, weil $e^{x} > 0$ ist.'],
    [r'Ein Produkt ist null, wenn ein Faktor null ist.',
     r'$e^{x} > 0$ für jedes $x$ - dieser Faktor liefert nie eine Lösung.',
     r'Es bleibt $2 - x = 0$, also $x = 2$. Diese Überlegung braucht man bei jeder Extremstelle von $p(x) \cdot e^{ax+b}$.'])

Q.q(r'Gegeben ist $f(x) = (x-2) \cdot e^{x}$ mit $f^{\prime}(x) = (x-1) \cdot e^{x}$ und $f^{\prime\prime}(x) = x \cdot e^{x}$. Bestimme den Extrempunkt und seine Art.',
    [r'Tiefpunkt $T(1 \mid -e) \approx T(1 \mid -2{,}72)$', r'Hochpunkt $H(1 \mid -e)$', r'Tiefpunkt $T(1 \mid 0)$', r'Tiefpunkt $T(2 \mid 0)$'],
    [r'$f^{\prime}(x) = 0$: $e^{x} \neq 0$, also $x - 1 = 0$ und $x = 1$.',
     r'$f(1) = (1-2) \cdot e^{1} = -e \approx -2{,}72$',
     r'$f^{\prime\prime}(1) = 1 \cdot e = e > 0$, also ein Tiefpunkt.',
     r'Falle: $x = 2$ ist die Nullstelle von $f$, nicht die Extremstelle.'])

Q.q(r'Bestimme die Extrempunkte von $f(x) = x^2 \cdot e^{-x}$. Es gilt $f^{\prime}(x) = (2x - x^2) \cdot e^{-x}$.',
    [r'$T(0 \mid 0)$ und $H(2 \mid 4e^{-2}) \approx H(2 \mid 0{,}541)$',
     r'$H(0 \mid 0)$ und $T(2 \mid 4e^{-2})$',
     r'nur $T(0 \mid 0)$',
     r'$T(0 \mid 0)$ und $H(2 \mid 4)$'],
    [r'$f^{\prime}(x) = x(2-x) \cdot e^{-x} = 0$ ergibt $x = 0$ und $x = 2$.',
     r'$f(0) = 0$ und $f(2) = 4 \cdot e^{-2} \approx 0{,}541$.',
     r'Vorzeichen von $f^{\prime}$: für $x < 0$ negativ, zwischen $0$ und $2$ positiv, für $x > 2$ negativ - also erst Tiefpunkt, dann Hochpunkt.',
     r'Falle: den Faktor $e^{-2}$ weglassen; der $y$-Wert ist $0{,}541$, nicht $4$.'])

Q.q(r'Bestimme den Extrempunkt von $f(x) = e^{x} - x$.',
    [r'Tiefpunkt $T(0 \mid 1)$', r'Hochpunkt $H(0 \mid 1)$', r'Tiefpunkt $T(1 \mid e-1)$', r'Tiefpunkt $T(0 \mid 0)$'],
    [r'$f^{\prime}(x) = e^{x} - 1 = 0$ ergibt $e^{x} = 1$, also $x = 0$ (Exponentenvergleich mit $e^{0}$).',
     r'$f(0) = e^{0} - 0 = 1$',
     r'$f^{\prime\prime}(x) = e^{x}$, also $f^{\prime\prime}(0) = 1 > 0$: Tiefpunkt $T(0 \mid 1)$.',
     r'Nebenbei: Damit ist $e^{x} \geq x + 1$ für alle $x$ gezeigt.'])

Q.q(r'Bestimme den Extrempunkt von $f(x) = x \cdot e^{2x}$.',
    [r'Tiefpunkt $T(-0{,}5 \mid -0{,}184)$', r'Hochpunkt $H(-0{,}5 \mid -0{,}184)$', r'Tiefpunkt $T(0 \mid 0)$', r'Tiefpunkt $T(-2 \mid -0{,}037)$'],
    [r'Produktregel: $f^{\prime}(x) = 1 \cdot e^{2x} + x \cdot 2e^{2x} = (1 + 2x) \cdot e^{2x}$.',
     r'$1 + 2x = 0$ ergibt $x = -0{,}5$; $f(-0{,}5) = -0{,}5 \cdot e^{-1} \approx -0{,}184$.',
     r'$f^{\prime\prime}(x) = (4 + 4x) \cdot e^{2x}$ und $f^{\prime\prime}(-0{,}5) = 2 \cdot e^{-1} > 0$: Tiefpunkt.'])

Q.q(r'Bestimme die Extrempunkte von $f(x) = (x^2-3) \cdot e^{x}$.',
    [r'$H(-3 \mid 6e^{-3}) \approx H(-3 \mid 0{,}299)$ und $T(1 \mid -2e) \approx T(1 \mid -5{,}44)$',
     r'$T(-3 \mid 6e^{-3})$ und $H(1 \mid -2e)$',
     r'$H(-\sqrt{3} \mid 0)$ und $T(\sqrt{3} \mid 0)$',
     r'nur $T(1 \mid -2e)$'],
    [r'Produktregel: $f^{\prime}(x) = 2x \cdot e^{x} + (x^2-3) \cdot e^{x} = (x^2 + 2x - 3) \cdot e^{x}$.',
     r'$x^2 + 2x - 3 = (x+3)(x-1) = 0$ ergibt $x = -3$ und $x = 1$.',
     r'$f(-3) = 6 \cdot e^{-3} \approx 0{,}299$ und $f(1) = -2 \cdot e \approx -5{,}44$.',
     r'$f^{\prime\prime}(x) = (x^2 + 4x - 1) \cdot e^{x}$: $f^{\prime\prime}(-3) = -4e^{-3} < 0$ (Hochpunkt), $f^{\prime\prime}(1) = 4e > 0$ (Tiefpunkt). $\pm\sqrt{3}$ sind die Nullstellen von $f$.'])

# ------------------------------------------------------------ Wendepunkte ----
Q.q(r'Für $f(x) = x \cdot e^{-x}$ gilt $f^{\prime\prime}(x) = (x-2) \cdot e^{-x}$. Bestimme den Wendepunkt.',
    [r'$W(2 \mid 2e^{-2}) \approx W(2 \mid 0{,}271)$', r'$W(1 \mid e^{-1})$', r'$W(2 \mid 0)$', r'$W(0 \mid 0)$'],
    [r'$f^{\prime\prime}(x) = 0$: Weil $e^{-x} \neq 0$ ist, bleibt $x - 2 = 0$, also $x = 2$.',
     r'Vorzeichenwechsel: $f^{\prime\prime}(1) = -e^{-1} < 0$, $f^{\prime\prime}(3) = e^{-3} > 0$ - die Krümmung wechselt von rechts nach links.',
     r'$y$-Wert aus $f$: $f(2) = 2 \cdot e^{-2} \approx 0{,}271$. Falle: $x = 1$ ist die Extremstelle, nicht die Wendestelle.'],
    fig=fig_xexp(), figcap=r'Graph von $f(x) = x \cdot e^{-x}$ mit Hochpunkt und Wendepunkt')

Q.q(r'Für $f(x) = (x-2) \cdot e^{x}$ gilt $f^{\prime\prime}(x) = x \cdot e^{x}$. Bestimme den Wendepunkt.',
    [r'$W(0 \mid -2)$', r'$W(0 \mid 0)$', r'$W(1 \mid -e)$', r'$W(2 \mid 0)$'],
    [r'$x \cdot e^{x} = 0$ ergibt $x = 0$, denn $e^{x}$ ist nie null.',
     r'Vorzeichenwechsel: $f^{\prime\prime}(-1) = -e^{-1} < 0$ und $f^{\prime\prime}(1) = e > 0$ - also wirklich ein Wendepunkt.',
     r'$f(0) = (0-2) \cdot e^{0} = -2$, also $W(0 \mid -2)$. Falle: $y = 0$ einsetzen statt $f(0)$ zu rechnen.'])

Q.q(r'Der GTR liefert für $f(x) = x^2 \cdot e^{-x}$ die zweite Ableitung $f^{\prime\prime}(x) = (x^2-4x+2) \cdot e^{-x}$. Wie viele Wendestellen hat der Graph?',
    [r'zwei: $x = 2 - \sqrt{2} \approx 0{,}586$ und $x = 2 + \sqrt{2} \approx 3{,}414$',
     r'eine: $x = 2$',
     r'keine, weil $e^{-x}$ nie null wird',
     r'drei: $x = 0$, $x = 2 - \sqrt{2}$ und $x = 2 + \sqrt{2}$'],
    [r'$e^{-x} \neq 0$, also $x^2 - 4x + 2 = 0$.',
     r'$p$-$q$-Formel: $x = 2 \pm \sqrt{4-2} = 2 \pm \sqrt{2}$, also $x \approx 0{,}586$ und $x \approx 3{,}414$.',
     r'Beide sind einfache Nullstellen einer Parabel - dort wechselt $f^{\prime\prime}$ das Vorzeichen.',
     r'Falle: $x = 0$ und $x = 2$ sind die Extremstellen von $f$, nicht die Wendestellen.'])

Q.q(r'Was folgt aus $f^{\prime\prime}(x) = 4 \cdot e^{2x}$ für den Graphen von $f(x) = e^{2x}$?',
    [r'Der Graph ist überall linksgekrümmt und hat keinen Wendepunkt.',
     r'Der Graph hat bei $x = 0$ einen Wendepunkt.',
     r'Der Graph ist überall rechtsgekrümmt.',
     r'Der Graph wechselt bei $x = 0$ die Krümmung.'],
    [r'$e^{2x} > 0$ für jedes $x$, also ist $f^{\prime\prime}(x) = 4 \cdot e^{2x} > 0$ überall.',
     r'$f^{\prime\prime} > 0$ bedeutet Linkskrümmung.',
     r'$f^{\prime\prime}$ hat keine Nullstelle und damit keinen Vorzeichenwechsel - kein Wendepunkt.'])

# ----------------------------------------------------------- Wertebereich ----
Q.q(r'Bestimme den Wertebereich von $f(x) = 5 - 2 \cdot e^{x}$.',
    [r'$W = \{y \mid y < 5\}$', r'$W = \{y \mid y \leq 5\}$', r'$W = \{y \mid y > 5\}$', r'$W = \mathbb{R}$'],
    [r'$e^{x} > 0$ für alle $x$, also ist $2 \cdot e^{x} > 0$ und $5 - 2 \cdot e^{x} < 5$.',
     r'Für $x \to -\infty$ geht $e^{x} \to 0$, also $f(x) \to 5$ - die Asymptote $y = 5$ wird nur angenähert.',
     r'Für $x \to +\infty$ fällt $f$ unbegrenzt. Falle: $y \leq 5$ - der Wert $5$ wird nie erreicht.'])

Q.q(r'Der Graph von $f(x) = x \cdot e^{-x}$ hat den Hochpunkt $H(1 \mid e^{-1})$; außerdem gilt $f(x) \to -\infty$ für $x \to -\infty$ und $f(x) \to 0$ für $x \to +\infty$. Bestimme den Wertebereich.',
    [r'$W = \{y \mid y \leq e^{-1}\} \approx \{y \mid y \leq 0{,}368\}$', r'$W = \{y \mid 0 < y \leq e^{-1}\}$', r'$W = \{y \mid y \geq 0\}$', r'$W = \mathbb{R}$'],
    [r'Der größte Funktionswert ist der Hochpunktwert $e^{-1} \approx 0{,}368$, und er wird angenommen.',
     r'Nach unten gibt es keine Schranke: Für $x \to -\infty$ ist $x$ negativ und $e^{-x}$ riesig, also $f(x) \to -\infty$.',
     r'Also $W = \{y \mid y \leq e^{-1}\}$. Falle: nur den rechten Ast ansehen und die negativen Werte vergessen.'])

Q.q(r'Bestimme den Wertebereich von $f(x) = x^2 \cdot e^{-x}$ mit $D = \mathbb{R}$.',
    [r'$W = \{y \mid y \geq 0\}$', r'$W = \{y \mid 0 \leq y \leq 4e^{-2}\}$', r'$W = \{y \mid y > 0\}$', r'$W = \mathbb{R}$'],
    [r'$x^2 \geq 0$ und $e^{-x} > 0$, also ist $f(x) \geq 0$ für jedes $x$; der Wert $0$ wird bei $x = 0$ angenommen.',
     r'Nach oben gibt es keine Schranke: Für $x \to -\infty$ wachsen beide Faktoren, etwa $f(-5) = 25 \cdot e^{5} \approx 3710$.',
     r'Falle: nur den Hochpunkt $H(2 \mid 4e^{-2})$ betrachten - der begrenzt bloß den rechten Ast.'])

# ----------------------------------------------------------- Stammfunktion ----
Q.q(r'Welche Funktion ist eine Stammfunktion von $f(x) = e^{2x}$?',
    [r'$F(x) = \dfrac{1}{2} \cdot e^{2x}$', r'$F(x) = 2 \cdot e^{2x}$', r'$F(x) = e^{2x}$', r'$F(x) = \dfrac{1}{2} \cdot e^{2x^2}$'],
    [r'Regel: $\displaystyle\int e^{ax+b}\,dx = \dfrac{1}{a} \cdot e^{ax+b} + C$; hier ist $a = 2$.',
     r'$F(x) = \dfrac{1}{2} \cdot e^{2x}$',
     r'Probe durch Ableiten: $F^{\prime}(x) = \dfrac{1}{2} \cdot 2 \cdot e^{2x} = e^{2x}$. Beim Integrieren wird durch $a$ geteilt, beim Ableiten mit $a$ multipliziert.'])

Q.q(r'Welche Funktion ist eine Stammfunktion von $f(x) = e^{3x-2}$?',
    [r'$F(x) = \dfrac{1}{3} \cdot e^{3x-2}$', r'$F(x) = 3 \cdot e^{3x-2}$', r'$F(x) = \dfrac{1}{3} \cdot e^{3x-2} - 2x$', r'$F(x) = \dfrac{1}{3x-2} \cdot e^{3x-2}$'],
    [r'Nur der Faktor $a = 3$ vor dem $x$ zählt; die Konstante $-2$ bleibt im Exponenten stehen.',
     r'$F(x) = \dfrac{1}{3} \cdot e^{3x-2} + C$',
     r'Probe: $F^{\prime}(x) = \dfrac{1}{3} \cdot 3 \cdot e^{3x-2} = e^{3x-2}$. Der Exponent wird beim Integrieren nicht verändert.'])

Q.q(r'Welche Funktion ist eine Stammfunktion von $f(x) = 4 \cdot e^{-0{,}5x}$?',
    [r'$F(x) = -8 \cdot e^{-0{,}5x}$', r'$F(x) = -2 \cdot e^{-0{,}5x}$', r'$F(x) = 8 \cdot e^{-0{,}5x}$', r'$F(x) = -0{,}5 \cdot e^{-0{,}5x}$'],
    [r'Der Vorfaktor $4$ bleibt erhalten, dazu kommt $\dfrac{1}{a} = \dfrac{1}{-0{,}5} = -2$.',
     r'$F(x) = 4 \cdot (-2) \cdot e^{-0{,}5x} = -8 \cdot e^{-0{,}5x} + C$',
     r'Probe: $F^{\prime}(x) = -8 \cdot (-0{,}5) \cdot e^{-0{,}5x} = 4 \cdot e^{-0{,}5x}$. Falle: das Minus vergessen, weil $a$ negativ ist.'])

# --------------------------------------------------- Flächen und Anwendungen ----
Q.q(r'Berechne $\displaystyle\int_0^1 e^{x}\,dx$.',
    [r'$e - 1 \approx 1{,}718$', r'$e \approx 2{,}718$', r'$1 - e \approx -1{,}718$', r'$\dfrac{e^2}{2} \approx 3{,}69$'],
    [r'Stammfunktion: $F(x) = e^{x}$.',
     r'$\left[e^{x}\right]_0^1 = e^{1} - e^{0} = e - 1 \approx 1{,}718$',
     r'Falle: $e^{0} = 1$, nicht $0$ - deshalb muss man wirklich $1$ abziehen.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen dem Graphen von $f(x) = e^{-x}$, der $x$-Achse und den Geraden $x = 0$ und $x = 2$.',
    [r'$A = 1 - e^{-2} \approx 0{,}865$', r'$A = e^{-2} - 1 \approx -0{,}865$', r'$A = e^{2} - 1 \approx 6{,}39$', r'$A = e^{-2} \approx 0{,}135$'],
    [r'$f(x) = e^{-x} > 0$ auf $[0;\,2]$, also ist die Fläche gleich dem Integral.',
     r'Stammfunktion: $F(x) = -e^{-x}$ (Faktor $\dfrac{1}{-1} = -1$).',
     r'$\left[-e^{-x}\right]_0^2 = -e^{-2} - (-e^{0}) = 1 - e^{-2} \approx 0{,}865$',
     r'Falle: die Grenzen vertauschen - dann kommt ein negativer Wert heraus, und ein Flächeninhalt ist nie negativ.'],
    fig=fig_flaeche(), figcap=r'Fläche unter $f(x) = e^{-x}$ über dem Intervall $[0;\,2]$')

Q.q(r'In ein Becken fließt Wasser mit der Rate $z(t) = 5 \cdot e^{-0{,}5t}$ (in $\mathrm{m^3}$ pro Stunde, $t$ in Stunden). Wie viel Wasser fließt in den ersten $4$ Stunden zu?',
    [r'$10 \cdot (1 - e^{-2}) \approx 8{,}65\,\mathrm{m^3}$', r'$5 \cdot e^{-2} \approx 0{,}68\,\mathrm{m^3}$', r'$20\,\mathrm{m^3}$', r'$2{,}5 \cdot (1 - e^{-2}) \approx 2{,}16\,\mathrm{m^3}$'],
    [r'Die Menge ist das Integral über die Rate: $\displaystyle\int_0^4 5 \cdot e^{-0{,}5t}\,dt$.',
     r'Stammfunktion: $Z(t) = 5 \cdot (-2) \cdot e^{-0{,}5t} = -10 \cdot e^{-0{,}5t}$.',
     r'$\left[-10 \cdot e^{-0{,}5t}\right]_0^4 = -10 \cdot e^{-2} + 10 = 10 \cdot (1 - e^{-2}) \approx 8{,}65\,\mathrm{m^3}$',
     r'Falle: $z(4) \approx 0{,}68$ ist die Rate nach $4$ Stunden, nicht die Menge.'])

Q.q(r'Die Fläche unter dem Graphen von $f(x) = e^{-x}$ über dem Intervall $[0;\,b]$ beträgt $A(b) = 1 - e^{-b}$. Welchem Wert nähert sich $A(b)$, wenn $b$ immer größer wird?',
    [r'$A(b) \to 1$', r'$A(b) \to \infty$', r'$A(b) \to 0$', r'$A(b) \to e$'],
    [r'Für $b \to \infty$ gilt $e^{-b} \to 0$, also $A(b) \to 1 - 0 = 1$.',
     r'Zahlenprobe: $A(5) \approx 0{,}993$, $A(10) \approx 0{,}99995$.',
     r'Bemerkenswert: Der Streifen wird unendlich lang, sein Flächeninhalt bleibt aber unter $1$.'])


def check():
    import math
    import sympy as sp
    x, t, b = sp.symbols('x t b', real=True)
    E = sp.exp
    z = lambda a, c: sp.simplify(a - c) == 0
    # Q1: (2-x)e^x = 0 hat nur x = 2
    assert sp.solve((2 - x) * E(x), x) == [2] and sp.solve(E(x), x) == []
    # Q2: f = (x-2)e^x
    f2 = (x - 2) * E(x)
    assert z(sp.diff(f2, x), (x - 1) * E(x)) and z(sp.diff(f2, x, 2), x * E(x))
    assert sp.solve(sp.diff(f2, x), x) == [1] and f2.subs(x, 1) == -sp.E
    assert sp.diff(f2, x, 2).subs(x, 1) == sp.E and sp.E > 0 and abs(-math.e + 2.72) < 0.005
    assert sp.solve(f2, x) == [2]
    # Q3: f = x^2 e^-x
    f3 = x**2 * E(-x)
    assert z(sp.diff(f3, x), (2 * x - x**2) * E(-x)) and z((2 * x - x**2), x * (2 - x))
    assert sorted(sp.solve(sp.diff(f3, x), x)) == [0, 2]
    assert f3.subs(x, 0) == 0 and z(f3.subs(x, 2), 4 * E(-2)) and abs(4 * math.exp(-2) - 0.541) < 0.0005
    d3 = sp.diff(f3, x)
    assert d3.subs(x, -1) < 0 and d3.subs(x, 1) > 0 and d3.subs(x, 3) < 0
    # Q4: f = e^x - x
    f4 = E(x) - x
    assert sp.solve(sp.diff(f4, x), x) == [0] and f4.subs(x, 0) == 1
    assert sp.diff(f4, x, 2).subs(x, 0) == 1
    # Q5: f = x e^(2x)
    f5 = x * E(2 * x)
    assert z(sp.diff(f5, x), (1 + 2 * x) * E(2 * x)) and sp.solve(sp.diff(f5, x), x) == [sp.Rational(-1, 2)]
    assert abs(float(f5.subs(x, sp.Rational(-1, 2))) + 0.184) < 0.0005
    assert z(sp.diff(f5, x, 2), (4 + 4 * x) * E(2 * x)) and sp.diff(f5, x, 2).subs(x, sp.Rational(-1, 2)) > 0
    assert abs(float(f5.subs(x, -2)) + 0.037) < 0.0005
    # Q6: f = (x^2-3) e^x
    f6 = (x**2 - 3) * E(x)
    assert z(sp.diff(f6, x), (x**2 + 2 * x - 3) * E(x)) and z(x**2 + 2 * x - 3, (x + 3) * (x - 1))
    assert sorted(sp.solve(sp.diff(f6, x), x)) == [-3, 1]
    assert z(f6.subs(x, -3), 6 * E(-3)) and z(f6.subs(x, 1), -2 * sp.E)
    assert abs(6 * math.exp(-3) - 0.299) < 0.0005 and abs(-2 * math.e + 5.44) < 0.005
    assert z(sp.diff(f6, x, 2), (x**2 + 4 * x - 1) * E(x))
    assert sp.diff(f6, x, 2).subs(x, -3) < 0 and sp.diff(f6, x, 2).subs(x, 1) > 0
    assert set(sp.solve(f6, x)) == {sp.sqrt(3), -sp.sqrt(3)}
    # Q7: f = x e^-x, Wendepunkt
    f7 = x * E(-x)
    assert z(sp.diff(f7, x, 2), (x - 2) * E(-x)) and sp.solve(sp.diff(f7, x, 2), x) == [2]
    assert z(f7.subs(x, 2), 2 * E(-2)) and abs(2 * math.exp(-2) - 0.271) < 0.0005
    assert sp.diff(f7, x, 2).subs(x, 1) < 0 and sp.diff(f7, x, 2).subs(x, 3) > 0
    assert sp.solve(sp.diff(f7, x), x) == [1] and z(f7.subs(x, 1), E(-1))
    # Q8: (x-2)e^x, Wendepunkt W(0|-2)
    assert sp.solve(sp.diff(f2, x, 2), x) == [0] and f2.subs(x, 0) == -2
    assert sp.diff(f2, x, 2).subs(x, -1) < 0 and sp.diff(f2, x, 2).subs(x, 1) > 0
    # Q9: f'' von x^2 e^-x
    assert z(sp.diff(f3, x, 2), (x**2 - 4 * x + 2) * E(-x))
    ws = sorted(sp.solve(x**2 - 4 * x + 2, x))
    assert ws == [2 - sp.sqrt(2), 2 + sp.sqrt(2)]
    assert abs(float(ws[0]) - 0.586) < 0.0005 and abs(float(ws[1]) - 3.414) < 0.0005
    # Q10: f'' von e^(2x)
    assert z(sp.diff(E(2 * x), x, 2), 4 * E(2 * x)) and sp.solve(sp.diff(E(2 * x), x, 2), x) == []
    assert all(sp.diff(E(2 * x), x, 2).subs(x, w) > 0 for w in (-3, 0, 3))
    # Q11: Wertebereich von 5 - 2e^x
    f11 = 5 - 2 * E(x)
    assert sp.limit(f11, x, -sp.oo) == 5 and sp.limit(f11, x, sp.oo) == -sp.oo
    assert all(f11.subs(x, w) < 5 for w in (-10, 0, 10)) and sp.solve(sp.Eq(f11, 5), x) == []
    # Q12: Wertebereich von x e^-x
    assert sp.limit(f7, x, -sp.oo) == -sp.oo and sp.limit(f7, x, sp.oo) == 0
    assert abs(math.exp(-1) - 0.368) < 0.0005 and f7.subs(x, -1) == -sp.E
    # Q13: Wertebereich von x^2 e^-x
    assert sp.limit(f3, x, -sp.oo) == sp.oo and sp.limit(f3, x, sp.oo) == 0
    assert f3.subs(x, 0) == 0 and all(f3.subs(x, w) > 0 for w in (-3, 1, 5))
    assert abs(float(f3.subs(x, -5)) - 3710) < 10
    # Q14-16: Stammfunktionen
    assert z(sp.diff(E(2 * x) / 2, x), E(2 * x))
    assert z(sp.diff(E(3 * x - 2) / 3, x), E(3 * x - 2))
    assert z(sp.diff(-8 * E(-x / 2), x), 4 * E(-x / 2))
    assert z(sp.diff(-2 * E(-x / 2), x), E(-x / 2)) and z(sp.diff(8 * E(-x / 2), x), -4 * E(-x / 2))
    # Q17: int_0^1 e^x
    assert z(sp.integrate(E(x), (x, 0, 1)), sp.E - 1) and abs(math.e - 1 - 1.718) < 0.0005
    assert abs(math.e - 2.718) < 0.0005 and abs(math.e**2 / 2 - 3.69) < 0.005
    # Q18: int_0^2 e^-x
    assert z(sp.integrate(E(-x), (x, 0, 2)), 1 - E(-2))
    assert abs(1 - math.exp(-2) - 0.865) < 0.0005 and abs(math.exp(-2) - 0.135) < 0.0005
    assert abs(math.exp(2) - 1 - 6.39) < 0.005
    # Q19: Zuflussmenge
    zt = 5 * E(-t / 2)
    assert z(sp.integrate(zt, (t, 0, 4)), 10 * (1 - E(-2)))
    assert abs(float(10 * (1 - math.exp(-2))) - 8.65) < 0.005
    assert abs(float(zt.subs(t, 4)) - 0.68) < 0.005
    assert abs(float(sp.Rational(5, 2) * (1 - math.exp(-2))) - 2.16) < 0.005
    # Q20: A(b) = 1 - e^-b -> 1
    A = 1 - E(-b)
    assert sp.limit(A, b, sp.oo) == 1
    assert abs(float(A.subs(b, 5)) - 0.993) < 0.0005 and abs(float(A.subs(b, 10)) - 0.99995) < 0.000005


Q.verify(check)
Q.save()
