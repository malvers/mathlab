#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 22 (LB 3): Stammfunktion und unbestimmtes Integral -
Umkehrung des Ableitens, Integrationskonstante, Grundintegral, Faktor- und Summenregel,
Stammfunktion mit Bedingung, Probe durch Ableiten. Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12

Q = fos12(nr=22, slug='stammfunktion', thema='Stammfunktion und unbestimmtes Integral', lb='LB 3',
          blurb='Stammfunktion, Grundintegral, Faktor- und Summenregel',
          comment='Blocks: Begriff und Grundintegral (1-6), Faktor- und Summenregel (7-13), Bedingung, Probe und Anwendung (14-20). Alles ohne CAS.')

# ------------------------------------------------ Begriff und Grundintegral ----
Q.q(r'Wann heißt eine Funktion $F$ Stammfunktion von $f$?',
    [r'Wenn $F^{\prime}(x) = f(x)$ für alle $x$ gilt.',
     r'Wenn $f^{\prime}(x) = F(x)$ für alle $x$ gilt.',
     r'Wenn $F(x) = f(x) + C$ mit einer Konstanten $C$ gilt.',
     r'Wenn $F(x) \cdot f(x) = 1$ für alle $x$ gilt.'],
    [r'Integrieren ist die Umkehrung des Ableitens: Die Ableitung der Stammfunktion ist wieder $f$.',
     r'Beispiel: $F(x) = x^2$ ist Stammfunktion von $f(x) = 2x$, denn $F^{\prime}(x) = 2x$.',
     r'Die Richtung ist entscheidend - $f^{\prime} = F$ wäre die falsche Reihenfolge.'])

Q.q(r'Bestimme eine Stammfunktion von $f(x) = x^3$.',
    [r'$F(x) = \dfrac{x^4}{4} + C$', r'$F(x) = 3x^2 + C$', r'$F(x) = x^4 + C$', r'$F(x) = \dfrac{x^3}{3} + C$'],
    [r'Grundintegral: $\int x^n\,dx = \dfrac{x^{n+1}}{n+1} + C$',
     r'Mit $n = 3$: $F(x) = \dfrac{x^4}{4} + C$',
     r'Probe: $F^{\prime}(x) = \dfrac{4x^3}{4} = x^3$. Fallen: abgeleitet ($3x^2$), nicht geteilt ($x^4$), durch den alten Exponenten geteilt.'])

Q.q(r'Bestimme eine Stammfunktion von $f(x) = 5$.',
    [r'$F(x) = 5x + C$', r'$F(x) = 5 + C$', r'$F(x) = \dfrac{5x^2}{2} + C$', r'$F(x) = 0$'],
    [r'$5 = 5 \cdot x^0$, also $\int 5\,dx = 5 \cdot \dfrac{x^1}{1} + C = 5x + C$',
     r'Probe: $(5x + C)^{\prime} = 5$.',
     r'$0$ wäre die Ableitung von $5$, nicht die Stammfunktion.'])

Q.q(r'Bestimme eine Stammfunktion von $f(x) = \dfrac{1}{x^2} = x^{-2}$ für $x > 0$.',
    [r'$F(x) = -\dfrac{1}{x} + C$', r'$F(x) = \dfrac{1}{x} + C$', r'$F(x) = -\dfrac{2}{x^3} + C$', r'$F(x) = -\dfrac{1}{3x^3} + C$'],
    [r'Grundintegral mit $n = -2$: $\dfrac{x^{-2+1}}{-2+1} = \dfrac{x^{-1}}{-1} = -\dfrac{1}{x}$',
     r'Probe: $\left(-x^{-1}\right)^{\prime} = -(-1) \cdot x^{-2} = \dfrac{1}{x^2}$.',
     r'Falle: Der Exponent wird um $1$ erhöht, also von $-2$ auf $-1$ - nicht auf $-3$. $-\dfrac{2}{x^3}$ ist die Ableitung.'])

Q.q(r'Bestimme eine Stammfunktion von $f(x) = \sqrt{x} = x^{\frac{1}{2}}$ für $x > 0$.',
    [r'$F(x) = \dfrac{2}{3}\,x^{\frac{3}{2}} + C$', r'$F(x) = \dfrac{3}{2}\,x^{\frac{3}{2}} + C$', r'$F(x) = \dfrac{1}{2\sqrt{x}} + C$', r'$F(x) = \dfrac{2}{3}\,x^{\frac{1}{2}} + C$'],
    [r'$n = \dfrac{1}{2}$, neuer Exponent $\dfrac{1}{2} + 1 = \dfrac{3}{2}$',
     r'$\int x^{\frac{1}{2}}\,dx = \dfrac{x^{\frac{3}{2}}}{\frac{3}{2}} + C = \dfrac{2}{3}\,x^{\frac{3}{2}} + C$',
     r'Durch $\dfrac{3}{2}$ teilen heißt mit $\dfrac{2}{3}$ multiplizieren. $\dfrac{1}{2\sqrt{x}}$ ist die Ableitung von $\sqrt{x}$.'])

Q.q(r'Wie viele Stammfunktionen hat $f(x) = x^2$?',
    [r'Unendlich viele - sie unterscheiden sich nur um eine Konstante $C$.',
     r'Genau eine, nämlich $F(x) = \dfrac{x^3}{3}$.',
     r'Genau zwei: $\dfrac{x^3}{3}$ und $-\dfrac{x^3}{3}$.',
     r'Keine, weil $x^2$ keine Ableitung einer Funktion ist.'],
    [r'$\dfrac{x^3}{3}$, $\dfrac{x^3}{3} + 1$ und $\dfrac{x^3}{3} - 100$ haben alle die Ableitung $x^2$.',
     r'Die Konstante fällt beim Ableiten weg, deshalb steht sie im unbestimmten Integral: $\int x^2\,dx = \dfrac{x^3}{3} + C$.',
     r'Die Menge aller Stammfunktionen heißt unbestimmtes Integral.'])

# -------------------------------------------------- Faktor- und Summenregel ----
Q.q(r'Berechne $\int 6x^2\,dx$.',
    [r'$2x^3 + C$', r'$6x^3 + C$', r'$12x + C$', r'$3x^3 + C$'],
    [r'Faktorregel: Der konstante Faktor bleibt stehen, $\int 6x^2\,dx = 6 \cdot \int x^2\,dx$',
     r'$= 6 \cdot \dfrac{x^3}{3} + C = 2x^3 + C$',
     r'Probe: $(2x^3)^{\prime} = 6x^2$. Falle: $12x$ ist die Ableitung, $6x^3$ vergisst das Teilen durch $3$.'])

Q.q(r'Berechne $\int (3x^2 + 4x - 5)\,dx$.',
    [r'$x^3 + 2x^2 - 5x + C$', r'$x^3 + 4x^2 - 5x + C$', r'$6x + 4 + C$', r'$x^3 + 2x^2 + C$'],
    [r'Summenregel: jeden Summanden einzeln integrieren.',
     r'$3 \cdot \dfrac{x^3}{3} + 4 \cdot \dfrac{x^2}{2} - 5x = x^3 + 2x^2 - 5x$',
     r'Auch die Konstante $-5$ bekommt ein $x$: $\int (-5)\,dx = -5x$.'])

Q.q(r'Bestimme eine Stammfunktion von $f(x) = x^4 - 2x$.',
    [r'$F(x) = \dfrac{x^5}{5} - x^2 + C$', r'$F(x) = \dfrac{x^5}{5} - 2x^2 + C$', r'$F(x) = 4x^3 - 2 + C$', r'$F(x) = \dfrac{x^5}{4} - x^2 + C$'],
    [r'$\int x^4\,dx = \dfrac{x^5}{5}$ und $\int 2x\,dx = 2 \cdot \dfrac{x^2}{2} = x^2$',
     r'$F(x) = \dfrac{x^5}{5} - x^2 + C$',
     r'Probe: $F^{\prime}(x) = x^4 - 2x$. Falle: bei $2x$ das Teilen durch $2$ vergessen.'])

Q.q(r'Bestimme eine Stammfunktion von $f(x) = \dfrac{1}{2}x^2 + 3$.',
    [r'$F(x) = \dfrac{1}{6}x^3 + 3x + C$', r'$F(x) = \dfrac{1}{2}x^3 + 3x + C$', r'$F(x) = \dfrac{1}{6}x^3 + C$', r'$F(x) = x + C$'],
    [r'$\int \dfrac{1}{2}x^2\,dx = \dfrac{1}{2} \cdot \dfrac{x^3}{3} = \dfrac{1}{6}x^3$',
     r'$\int 3\,dx = 3x$, zusammen $F(x) = \dfrac{1}{6}x^3 + 3x + C$',
     r'Probe: $F^{\prime}(x) = \dfrac{3}{6}x^2 + 3 = \dfrac{1}{2}x^2 + 3$.'])

Q.q(r'Bestimme eine Stammfunktion von $f(x) = x \cdot (x + 2)$.',
    [r'$F(x) = \dfrac{x^3}{3} + x^2 + C$', r'$F(x) = \dfrac{x^2}{2} \cdot \left(\dfrac{x^2}{2} + 2x\right) + C$', r'$F(x) = \dfrac{x^3}{3} + 2x + C$', r'$F(x) = 2x + 2 + C$'],
    [r'Es gibt keine Produktregel fürs Integrieren - erst ausmultiplizieren: $f(x) = x^2 + 2x$',
     r'$F(x) = \dfrac{x^3}{3} + 2 \cdot \dfrac{x^2}{2} = \dfrac{x^3}{3} + x^2 + C$',
     r'Probe: $F^{\prime}(x) = x^2 + 2x = x(x + 2)$. Faktorweise integrieren ist falsch.'])

Q.q(r'Bestimme eine Stammfunktion von $f(x) = (2x - 1)^2$.',
    [r'$F(x) = \dfrac{4}{3}x^3 - 2x^2 + x + C$', r'$F(x) = \dfrac{(2x - 1)^3}{3} + C$', r'$F(x) = \dfrac{4}{3}x^3 - 4x^2 + x + C$', r'$F(x) = 2 \cdot (2x - 1) + C$'],
    [r'Binomische Formel: $(2x - 1)^2 = 4x^2 - 4x + 1$',
     r'$F(x) = 4 \cdot \dfrac{x^3}{3} - 4 \cdot \dfrac{x^2}{2} + x = \dfrac{4}{3}x^3 - 2x^2 + x + C$',
     r'Probe: $F^{\prime}(x) = 4x^2 - 4x + 1$. Bei $\dfrac{(2x - 1)^3}{3}$ liefert die Kettenregel beim Ableiten den Faktor $2$ zu viel.'])

Q.q(r'Welche Funktion ist KEINE Stammfunktion von $f(x) = 2x$?',
    [r'$F(x) = x^2 + 2x$', r'$F(x) = x^2 + 5$', r'$F(x) = x^2 - 3$', r'$F(x) = x^2$'],
    [r'Ableiten: $x^2 + 5$, $x^2 - 3$ und $x^2$ ergeben alle $2x$ - die Konstante verschwindet.',
     r'$(x^2 + 2x)^{\prime} = 2x + 2 \neq 2x$',
     r'Stammfunktionen dürfen sich nur um eine additive Konstante unterscheiden, nicht um einen Summanden mit $x$.'])

# ------------------------------------------- Bedingung, Probe und Anwendung ----
Q.q(r'Für welchen Wert von $a$ ist $F(x) = a\,x^3 + 2x$ eine Stammfunktion von $f(x) = 6x^2 + 2$?',
    [r'$a = 2$', r'$a = 6$', r'$a = 18$', r'$a = \dfrac{1}{2}$'],
    [r'Ableiten: $F^{\prime}(x) = 3a\,x^2 + 2$',
     r'Vergleich mit $f(x) = 6x^2 + 2$: $3a = 6$, also $a = 2$.',
     r'Probe: $(2x^3 + 2x)^{\prime} = 6x^2 + 2$.'])

Q.q(r'Bestimme die Stammfunktion $F$ von $f(x) = 2x$ mit $F(1) = 5$.',
    [r'$F(x) = x^2 + 4$', r'$F(x) = x^2 + 5$', r'$F(x) = x^2 + C$', r'$F(x) = x^2 - 4$'],
    [r'Alle Stammfunktionen: $F(x) = x^2 + C$',
     r'Bedingung: $F(1) = 1 + C = 5$, also $C = 4$.',
     r'$F(x) = x^2 + 4$; Probe: $F(1) = 5$. Die Bedingung legt $C$ fest - $x^2 + C$ ist noch nicht die Antwort.'])

Q.q(r'Bestimme die Stammfunktion $F$ von $f(x) = 3x^2 - 2$ mit $F(2) = 1$.',
    [r'$F(x) = x^3 - 2x - 3$', r'$F(x) = x^3 - 2x + 1$', r'$F(x) = x^3 - 2x + 3$', r'$F(x) = x^3 - 2x - 5$'],
    [r'$F(x) = x^3 - 2x + C$',
     r'$F(2) = 8 - 4 + C = 4 + C = 1$, also $C = -3$.',
     r'$F(x) = x^3 - 2x - 3$; Probe: $F(2) = 8 - 4 - 3 = 1$.'])

Q.q(r'Prüfe durch Ableiten: Welche Funktion ist eine Stammfunktion von $f(x) = 4x^3 - 6x$?',
    [r'$F(x) = x^4 - 3x^2 + 1$', r'$F(x) = x^4 - 6x^2$', r'$F(x) = 12x^2 - 6$', r'$F(x) = \dfrac{x^4}{4} - 3x^2$'],
    [r'$(x^4 - 3x^2 + 1)^{\prime} = 4x^3 - 6x$ - passt.',
     r'$(x^4 - 6x^2)^{\prime} = 4x^3 - 12x$ und $\left(\dfrac{x^4}{4} - 3x^2\right)^{\prime} = x^3 - 6x$ - passen nicht.',
     r'$12x^2 - 6$ ist die Ableitung von $f$, nicht eine Stammfunktion.'])

Q.q(r'Die Grenzkosten eines Betriebs sind $K^{\prime}(x) = 0{,}6x + 4$ (in € pro Stück), die Fixkosten betragen $K(0) = 200$ €. Wie lautet die Kostenfunktion $K$?',
    [r'$K(x) = 0{,}3x^2 + 4x + 200$', r'$K(x) = 0{,}6x^2 + 4x + 200$', r'$K(x) = 0{,}3x^2 + 4x$', r'$K(x) = 0{,}3x^2 + 200$'],
    [r'Die Kostenfunktion ist eine Stammfunktion der Grenzkosten: $K(x) = 0{,}6 \cdot \dfrac{x^2}{2} + 4x + C = 0{,}3x^2 + 4x + C$',
     r'Fixkosten: $K(0) = C = 200$',
     r'$K(x) = 0{,}3x^2 + 4x + 200$; Probe: $K^{\prime}(x) = 0{,}6x + 4$.'])

Q.q(r'Ein Wagen fährt mit der Geschwindigkeit $v(t) = 6t$ (in $\mathrm{m/s}$) an und steht zur Zeit $t = 0$ bei $s(0) = 2$ (in $\mathrm{m}$). Wie lautet die Weg-Zeit-Funktion $s$?',
    [r'$s(t) = 3t^2 + 2$', r'$s(t) = 6t^2 + 2$', r'$s(t) = 3t^2$', r'$s(t) = 6$'],
    [r'Die Geschwindigkeit ist die Ableitung des Weges: $s^{\prime}(t) = v(t)$, also ist $s$ eine Stammfunktion von $v$.',
     r'$s(t) = 6 \cdot \dfrac{t^2}{2} + C = 3t^2 + C$, mit $s(0) = 2$ folgt $C = 2$.',
     r'$s(t) = 3t^2 + 2$; nach $2\,\mathrm{s}$ ist der Wagen bei $s(2) = 14\,\mathrm{m}$.'])

Q.q(r'Der Graph einer Funktion $F$ hat an jeder Stelle $x$ die Steigung $3x^2 + 1$ und geht durch den Punkt $P(1|3)$. Wie lautet $F$?',
    [r'$F(x) = x^3 + x + 1$', r'$F(x) = x^3 + x + 3$', r'$F(x) = x^3 + x$', r'$F(x) = 6x + 3$'],
    [r'Die Steigung ist die Ableitung: $F^{\prime}(x) = 3x^2 + 1$, also $F(x) = x^3 + x + C$',
     r'$F(1) = 1 + 1 + C = 3$, also $C = 1$.',
     r'$F(x) = x^3 + x + 1$; Probe: $F(1) = 3$ und $F^{\prime}(1) = 4$.'])


def check():
    import sympy as sp
    from fractions import Fraction as F
    x, a, t = sp.symbols('x a t')
    I = lambda e: sp.integrate(e, x)
    D = lambda e: sp.diff(e, x)
    eq = lambda p, q: sp.simplify(p - q) == 0
    # 1 conceptual: F = x^2 is a Stammfunktion of 2x
    assert eq(D(x**2), 2*x)
    # 2
    assert eq(I(x**3), x**4/4) and eq(D(x**3), 3*x**2) and not eq(D(x**4), x**3) and not eq(D(x**3/3), x**3)
    # 3
    assert eq(I(5), 5*x) and eq(D(5*x), 5) and not eq(D(5*x**2/2), 5) and D(sp.Integer(5)) == 0
    # 4
    assert eq(I(x**-2), -1/x) and eq(D(-1/x), x**-2) and not eq(D(1/x), x**-2)
    assert eq(D(x**-2), -2*x**-3) and not eq(D(-1/(3*x**3)), x**-2)
    # 5
    assert eq(I(sp.sqrt(x)), sp.Rational(2, 3)*x**sp.Rational(3, 2)) and eq(D(sp.sqrt(x)), 1/(2*sp.sqrt(x)))
    assert F(1, 2) + 1 == F(3, 2) and 1 / F(3, 2) == F(2, 3)
    # 6
    assert all(eq(D(x**3/3 + c), x**2) for c in (0, 1, -100))
    # 7
    assert eq(I(6*x**2), 2*x**3) and eq(D(6*x**2), 12*x) and not eq(D(6*x**3), 6*x**2) and not eq(D(3*x**3), 6*x**2)
    # 8
    assert eq(I(3*x**2 + 4*x - 5), x**3 + 2*x**2 - 5*x) and eq(D(3*x**2 + 4*x - 5), 6*x + 4)
    assert not eq(D(x**3 + 4*x**2 - 5*x), 3*x**2 + 4*x - 5)
    # 9
    assert eq(I(x**4 - 2*x), x**5/5 - x**2) and eq(D(x**4 - 2*x), 4*x**3 - 2)
    # 10
    assert eq(I(x**2/2 + 3), x**3/6 + 3*x) and eq(D(x**3/6 + 3*x), x**2/2 + 3) and F(1, 2) * F(1, 3) == F(1, 6)
    # 11
    assert eq(sp.expand(x*(x + 2)), x**2 + 2*x) and eq(I(x*(x + 2)), x**3/3 + x**2)
    assert not eq(D(x**2/2*(x**2/2 + 2*x)), x*(x + 2))
    # 12
    assert eq(sp.expand((2*x - 1)**2), 4*x**2 - 4*x + 1)
    assert eq(I((2*x - 1)**2), sp.Rational(4, 3)*x**3 - 2*x**2 + x)
    assert eq(D((2*x - 1)**3/3), 2*(2*x - 1)**2) and not eq(D((2*x - 1)**3/3), (2*x - 1)**2)
    # 13
    assert eq(D(x**2 + 2*x), 2*x + 2) and all(eq(D(x**2 + c), 2*x) for c in (5, -3, 0))
    # 14
    assert sp.solve(sp.Eq(D(a*x**3 + 2*x), 6*x**2 + 2), a) == [2] and eq(D(2*x**3 + 2*x), 6*x**2 + 2)
    # 15
    assert eq(I(2*x), x**2) and 1 + 4 == 5
    # 16
    assert eq(I(3*x**2 - 2), x**3 - 2*x) and 8 - 4 - 3 == 1
    # 17
    assert eq(D(x**4 - 3*x**2 + 1), 4*x**3 - 6*x) and eq(D(x**4 - 6*x**2), 4*x**3 - 12*x)
    assert eq(D(x**4/4 - 3*x**2), x**3 - 6*x) and eq(D(4*x**3 - 6*x), 12*x**2 - 6)
    # 18
    assert eq(I(sp.Rational(3, 5)*x + 4), sp.Rational(3, 10)*x**2 + 4*x) and F(6, 10) / 2 == F(3, 10)
    # 19
    assert eq(sp.integrate(6*t, t), 3*t**2) and 3*2**2 + 2 == 14
    # 20
    assert eq(I(3*x**2 + 1), x**3 + x) and 1 + 1 + 1 == 3 and 3*1 + 1 == 4


Q.verify(check)
Q.save()
