#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 29 (LB 4): Exponentialfunktionen zur Basis e II - Ableitung mit
Ketten- und Produktregel, Produkte mit ganzrationalen Funktionen, Tangenten, Änderungsraten.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12

Q = fos12(nr=29, slug='e-funktion2', thema='e-Funktionen II', lb='LB 4',
          blurb='Ableitung mit Ketten- und Produktregel, Produkte mit ganzrationalen Funktionen',
          comment='Blocks: Kettenregel (1-6), Produktregel (7-12), Tangenten und zweite Ableitung (13-16), Änderungsraten in Anwendungen (17-20). GTR ohne CAS.')

# -------------------------------------------------------------- Kettenregel ----
Q.q(r'Leite $f(x) = e^{3x}$ ab.',
    [r'$f^{\prime}(x) = 3 \cdot e^{3x}$', r'$f^{\prime}(x) = e^{3x}$', r'$f^{\prime}(x) = 3x \cdot e^{3x-1}$', r'$f^{\prime}(x) = \dfrac{1}{3} \cdot e^{3x}$'],
    [r'Kettenregel: äußere Ableitung $e^{3x}$ mal innere Ableitung $(3x)^{\prime} = 3$.',
     r'$f^{\prime}(x) = 3 \cdot e^{3x}$',
     r'Falle: die Potenzregel gilt für $x^{n}$, nicht für $e^{x}$ - der Exponent wandert nicht nach vorn.'])

Q.q(r'Leite $f(x) = e^{-0{,}5x+2}$ ab.',
    [r'$f^{\prime}(x) = -0{,}5 \cdot e^{-0{,}5x+2}$', r'$f^{\prime}(x) = 0{,}5 \cdot e^{-0{,}5x+2}$', r'$f^{\prime}(x) = e^{-0{,}5x+2}$', r'$f^{\prime}(x) = (-0{,}5x+2) \cdot e^{-0{,}5x+2}$'],
    [r'Innere Funktion $-0{,}5x + 2$, innere Ableitung $-0{,}5$ (die $+2$ fällt weg).',
     r'$f^{\prime}(x) = -0{,}5 \cdot e^{-0{,}5x+2}$',
     r'Nur die Ableitung des Exponenten kommt als Faktor davor, nicht der Exponent selbst.'])

Q.q(r'Leite $f(x) = 4 \cdot e^{2x} - 3x$ ab.',
    [r'$f^{\prime}(x) = 8 \cdot e^{2x} - 3$', r'$f^{\prime}(x) = 4 \cdot e^{2x} - 3$', r'$f^{\prime}(x) = 8 \cdot e^{2x} - 3x$', r'$f^{\prime}(x) = 8 \cdot e^{x} - 3$'],
    [r'Faktor- und Summenregel: $(4 \cdot e^{2x})^{\prime} = 4 \cdot 2 \cdot e^{2x} = 8 \cdot e^{2x}$ und $(-3x)^{\prime} = -3$.',
     r'$f^{\prime}(x) = 8 \cdot e^{2x} - 3$',
     r'Der Exponent $2x$ bleibt beim Ableiten unverändert stehen.'])

Q.q(r'Leite $f(x) = e^{x} + e^{-x}$ ab.',
    [r'$f^{\prime}(x) = e^{x} - e^{-x}$', r'$f^{\prime}(x) = e^{x} + e^{-x}$', r'$f^{\prime}(x) = -e^{x} + e^{-x}$', r'$f^{\prime}(x) = e^{x}$'],
    [r'$(e^{x})^{\prime} = e^{x}$ und $(e^{-x})^{\prime} = -1 \cdot e^{-x}$ (innere Ableitung $-1$).',
     r'$f^{\prime}(x) = e^{x} - e^{-x}$',
     r'Falle: $e^{-x}$ ist keine Konstante, sie fällt beim Ableiten nicht weg.'])

Q.q(r'Leite $f(x) = 5 - 2 \cdot e^{1-x}$ ab.',
    [r'$f^{\prime}(x) = 2 \cdot e^{1-x}$', r'$f^{\prime}(x) = -2 \cdot e^{1-x}$', r'$f^{\prime}(x) = 5 + 2 \cdot e^{1-x}$', r'$f^{\prime}(x) = -2 \cdot e^{-x}$'],
    [r'Die Konstante $5$ fällt weg; innere Ableitung von $1 - x$ ist $-1$.',
     r'$f^{\prime}(x) = -2 \cdot (-1) \cdot e^{1-x} = 2 \cdot e^{1-x}$',
     r'Minus mal Minus gibt Plus - $f$ ist also streng monoton wachsend.'])

Q.q(r'Gegeben ist $f(x) = e^{2x-1}$. Berechne $f^{\prime}(0{,}5)$.',
    [r'$f^{\prime}(0{,}5) = 2$', r'$f^{\prime}(0{,}5) = 1$', r'$f^{\prime}(0{,}5) = 2e \approx 5{,}44$', r'$f^{\prime}(0{,}5) = e \approx 2{,}72$'],
    [r'$f^{\prime}(x) = 2 \cdot e^{2x-1}$',
     r'$f^{\prime}(0{,}5) = 2 \cdot e^{2 \cdot 0{,}5 - 1} = 2 \cdot e^{0} = 2 \cdot 1 = 2$',
     r'Falle: $e^{0} = 1$, nicht $e$.'])

# ------------------------------------------------------------- Produktregel ----
Q.q(r'Leite $f(x) = x \cdot e^{x}$ ab.',
    [r'$f^{\prime}(x) = (x+1) \cdot e^{x}$', r'$f^{\prime}(x) = e^{x}$', r'$f^{\prime}(x) = x \cdot e^{x}$', r'$f^{\prime}(x) = (x-1) \cdot e^{x}$'],
    [r'Produktregel: $(u \cdot v)^{\prime} = u^{\prime} \cdot v + u \cdot v^{\prime}$ mit $u = x$, $v = e^{x}$.',
     r'$f^{\prime}(x) = 1 \cdot e^{x} + x \cdot e^{x} = (x+1) \cdot e^{x}$',
     r'Falle: nur $u^{\prime} \cdot v = e^{x}$ - das ist die halbe Produktregel.'])

Q.q(r'Leite $f(x) = x \cdot e^{-x}$ ab.',
    [r'$f^{\prime}(x) = (1-x) \cdot e^{-x}$', r'$f^{\prime}(x) = (1+x) \cdot e^{-x}$', r'$f^{\prime}(x) = -e^{-x}$', r'$f^{\prime}(x) = (x-1) \cdot e^{-x}$'],
    [r'$u = x$, $u^{\prime} = 1$, $v = e^{-x}$, $v^{\prime} = -e^{-x}$ (Kettenregel).',
     r'$f^{\prime}(x) = 1 \cdot e^{-x} + x \cdot (-e^{-x}) = e^{-x} - x \cdot e^{-x} = (1-x) \cdot e^{-x}$',
     r'Ausklammern von $e^{-x}$ macht die Nullstelle von $f^{\prime}$ sichtbar: $x = 1$.'])

Q.q(r'Leite $f(x) = (x^2 - 1) \cdot e^{x}$ ab.',
    [r'$f^{\prime}(x) = (x^2 + 2x - 1) \cdot e^{x}$', r'$f^{\prime}(x) = 2x \cdot e^{x}$', r'$f^{\prime}(x) = 2x + (x^2 - 1) \cdot e^{x}$', r'$f^{\prime}(x) = (x^2 - 2x - 1) \cdot e^{x}$'],
    [r'$u = x^2 - 1$, $u^{\prime} = 2x$, $v = e^{x}$, $v^{\prime} = e^{x}$.',
     r'$f^{\prime}(x) = 2x \cdot e^{x} + (x^2 - 1) \cdot e^{x} = (x^2 + 2x - 1) \cdot e^{x}$',
     r'Beide Summanden enthalten $e^{x}$ - ausklammern. Falle: $u^{\prime} + u \cdot v^{\prime}$ (Summe statt Produkt).'])

Q.q(r'Leite $f(x) = (2x + 1) \cdot e^{3x}$ ab.',
    [r'$f^{\prime}(x) = (6x + 5) \cdot e^{3x}$', r'$f^{\prime}(x) = (2x + 3) \cdot e^{3x}$', r'$f^{\prime}(x) = 6 \cdot e^{3x}$', r'$f^{\prime}(x) = (6x + 3) \cdot e^{3x}$'],
    [r'$u^{\prime} = 2$, $v^{\prime} = 3 \cdot e^{3x}$ (Kettenregel).',
     r'$f^{\prime}(x) = 2 \cdot e^{3x} + (2x+1) \cdot 3 \cdot e^{3x} = (2 + 6x + 3) \cdot e^{3x} = (6x + 5) \cdot e^{3x}$',
     r'Falle: die innere Ableitung $3$ vergessen ergibt $(2x + 3) \cdot e^{3x}$.'])

Q.q(r'Leite $f(x) = x^2 \cdot e^{-2x}$ ab.',
    [r'$f^{\prime}(x) = (2x - 2x^2) \cdot e^{-2x}$', r'$f^{\prime}(x) = (2x + 2x^2) \cdot e^{-2x}$', r'$f^{\prime}(x) = 2x \cdot e^{-2x}$', r'$f^{\prime}(x) = -4x \cdot e^{-2x}$'],
    [r'$u = x^2$, $u^{\prime} = 2x$, $v = e^{-2x}$, $v^{\prime} = -2 \cdot e^{-2x}$.',
     r'$f^{\prime}(x) = 2x \cdot e^{-2x} + x^2 \cdot (-2) \cdot e^{-2x} = (2x - 2x^2) \cdot e^{-2x}$',
     r'Falle: $u^{\prime} \cdot v^{\prime} = 2x \cdot (-2e^{-2x}) = -4x \cdot e^{-2x}$ ist keine Produktregel.'])

Q.q(r'Gegeben ist $f(x) = x \cdot e^{-x}$. Berechne $f^{\prime}(1)$.',
    [r'$f^{\prime}(1) = 0$', r'$f^{\prime}(1) = e^{-1} \approx 0{,}368$', r'$f^{\prime}(1) = -e^{-1} \approx -0{,}368$', r'$f^{\prime}(1) = 2e^{-1} \approx 0{,}736$'],
    [r'$f^{\prime}(x) = (1 - x) \cdot e^{-x}$',
     r'$f^{\prime}(1) = (1 - 1) \cdot e^{-1} = 0$ - waagerechte Tangente.',
     r'Die Distraktoren entstehen, wenn ein Teil der Produktregel fehlt oder das Vorzeichen der inneren Ableitung.'])

# ------------------------------------------ Tangenten und zweite Ableitung ----
Q.q(r'Bestimme die Gleichung der Tangente an den Graphen von $f(x) = e^{2x}$ im Punkt $P(0 \mid f(0))$.',
    [r'$y = 2x + 1$', r'$y = x + 1$', r'$y = 2x$', r'$y = 2x + e$'],
    [r'$f(0) = e^{0} = 1$, Berührpunkt $P(0 \mid 1)$.',
     r'$f^{\prime}(x) = 2 \cdot e^{2x}$, Anstieg $m = f^{\prime}(0) = 2$.',
     r'Tangente: $y = m \cdot x + n$ mit $n = 1$ (Schnitt mit der $y$-Achse bei $x = 0$): $y = 2x + 1$.'])

Q.q(r'Bestimme die Gleichung der Tangente an den Graphen von $f(x) = x \cdot e^{x}$ an der Stelle $x = 1$.',
    [r'$y = 2e \cdot x - e$', r'$y = 2e \cdot x + e$', r'$y = e \cdot x$', r'$y = 2e \cdot x$'],
    [r'$f(1) = e$ und $f^{\prime}(x) = (x + 1) \cdot e^{x}$, also $m = f^{\prime}(1) = 2e$.',
     r'$n = f(1) - m \cdot 1 = e - 2e = -e$, Tangente: $y = 2e \cdot x - e \approx 5{,}44x - 2{,}72$.',
     r'Falle: ohne Produktregel wäre $m = e$ und die Tangente $y = e \cdot x$.'])

Q.q(r'Bestimme $f^{\prime\prime}(x)$ für $f(x) = e^{-2x}$.',
    [r'$f^{\prime\prime}(x) = 4 \cdot e^{-2x}$', r'$f^{\prime\prime}(x) = -4 \cdot e^{-2x}$', r'$f^{\prime\prime}(x) = -2 \cdot e^{-2x}$', r'$f^{\prime\prime}(x) = 4 \cdot e^{-4x}$'],
    [r'$f^{\prime}(x) = -2 \cdot e^{-2x}$',
     r'$f^{\prime\prime}(x) = -2 \cdot (-2) \cdot e^{-2x} = 4 \cdot e^{-2x}$',
     r'Jede Ableitung bringt den Faktor $-2$; der Exponent bleibt $-2x$.'])

Q.q(r'Bestimme $f^{\prime\prime}(x)$ für $f(x) = x \cdot e^{x}$.',
    [r'$f^{\prime\prime}(x) = (x + 2) \cdot e^{x}$', r'$f^{\prime\prime}(x) = (x + 1) \cdot e^{x}$', r'$f^{\prime\prime}(x) = e^{x}$', r'$f^{\prime\prime}(x) = (2x + 1) \cdot e^{x}$'],
    [r'$f^{\prime}(x) = (x + 1) \cdot e^{x}$ - wieder ein Produkt, also noch einmal Produktregel.',
     r'$f^{\prime\prime}(x) = 1 \cdot e^{x} + (x + 1) \cdot e^{x} = (x + 2) \cdot e^{x}$',
     r'Merkregel: Bei $(x + a) \cdot e^{x}$ erhöht jede Ableitung $a$ um $1$.'])

# ------------------------------------------ Änderungsraten in Anwendungen ----
Q.q(r'Die Nutzerzahl einer App wächst nach $N(t) = 200 \cdot e^{0{,}4t}$ ($t$ in Monaten). Mit welcher Rate wächst sie zu Beginn ($t = 0$)?',
    [r'$N^{\prime}(0) = 80$ Nutzer pro Monat', r'$N^{\prime}(0) = 200$ Nutzer pro Monat', r'$N^{\prime}(0) = 0{,}4$ Nutzer pro Monat', r'$N^{\prime}(0) \approx 119$ Nutzer pro Monat'],
    [r'Momentane Änderungsrate = Ableitung: $N^{\prime}(t) = 200 \cdot 0{,}4 \cdot e^{0{,}4t} = 80 \cdot e^{0{,}4t}$.',
     r'$N^{\prime}(0) = 80 \cdot e^{0} = 80$',
     r'$200$ ist der Anfangsbestand $N(0)$, $119 \approx N^{\prime}(1)$ die Rate nach einem Monat.'])

Q.q(r'Ein Kondensator entlädt sich; die Spannung beträgt $U(t) = 12 \cdot e^{-0{,}5t}$ ($U$ in Volt, $t$ in Sekunden). Wie schnell ändert sich die Spannung zum Zeitpunkt $t = 2$?',
    [r'$U^{\prime}(2) = -6 \cdot e^{-1} \approx -2{,}21$ V/s', r'$U^{\prime}(2) \approx +2{,}21$ V/s', r'$U^{\prime}(2) \approx 4{,}41$ V/s', r'$U^{\prime}(2) = -6$ V/s'],
    [r'$U^{\prime}(t) = 12 \cdot (-0{,}5) \cdot e^{-0{,}5t} = -6 \cdot e^{-0{,}5t}$',
     r'$U^{\prime}(2) = -6 \cdot e^{-1} \approx -2{,}21$: Die Spannung sinkt um etwa $2{,}21$ Volt pro Sekunde.',
     r'$4{,}41 \approx U(2)$ ist die Spannung selbst, $-6 = U^{\prime}(0)$ die Rate am Anfang.'])

Q.q(r'Der Anteil der Bevölkerung, der eine Nachricht kennt, wird durch $A(t) = 1 - e^{-0{,}2t}$ beschrieben ($t$ in Tagen). Welche Aussage über die Ausbreitungsgeschwindigkeit $A^{\prime}(t)$ stimmt?',
    [r'$A^{\prime}(t) = 0{,}2 \cdot e^{-0{,}2t} > 0$; die Ausbreitung wird mit der Zeit langsamer.',
     r'$A^{\prime}(t) = -0{,}2 \cdot e^{-0{,}2t} < 0$; der Anteil nimmt ab.',
     r'$A^{\prime}(t) = e^{-0{,}2t}$; die Ausbreitung startet mit Rate $1$.',
     r'$A^{\prime}(t) = 0{,}2 \cdot e^{-0{,}2t}$; die Ausbreitung wird mit der Zeit schneller.'],
    [r'$(1)^{\prime} = 0$ und $(-e^{-0{,}2t})^{\prime} = -(-0{,}2) \cdot e^{-0{,}2t} = 0{,}2 \cdot e^{-0{,}2t}$.',
     r'$A^{\prime}(t) > 0$: der Anteil wächst. $e^{-0{,}2t}$ wird kleiner, also sinkt die Rate - Sättigung bei $A = 1$.',
     r'$A^{\prime}(0) = 0{,}2$, $A^{\prime}(10) = 0{,}2 \cdot e^{-2} \approx 0{,}027$.'])

Q.q(r'An welcher Stelle hat der Graph von $f(x) = (x - 2) \cdot e^{x}$ eine waagerechte Tangente?',
    [r'$x = 1$', r'$x = 2$', r'$x = -1$', r'$x = 0$'],
    [r'Waagerechte Tangente: $f^{\prime}(x) = 0$. Produktregel: $f^{\prime}(x) = 1 \cdot e^{x} + (x - 2) \cdot e^{x} = (x - 1) \cdot e^{x}$.',
     r'$e^{x}$ ist nie null, also $x - 1 = 0$ und $x = 1$.',
     r'$x = 2$ ist die Nullstelle von $f$, nicht von $f^{\prime}$.'])


def check():
    import math
    import sympy as sp
    x, t = sp.symbols('x t', real=True)
    E = sp.exp
    z = lambda a, b: sp.simplify(a - b) == 0
    # Kettenregel
    assert z(sp.diff(E(3 * x), x), 3 * E(3 * x))
    assert z(sp.diff(E(-sp.Rational(1, 2) * x + 2), x), -sp.Rational(1, 2) * E(-sp.Rational(1, 2) * x + 2))
    assert z(sp.diff(4 * E(2 * x) - 3 * x, x), 8 * E(2 * x) - 3)
    assert z(sp.diff(E(x) + E(-x), x), E(x) - E(-x))
    assert z(sp.diff(5 - 2 * E(1 - x), x), 2 * E(1 - x)) and sp.diff(5 - 2 * E(1 - x), x).subs(x, 0) > 0
    d6 = sp.diff(E(2 * x - 1), x)
    assert d6.subs(x, sp.Rational(1, 2)) == 2 and abs(2 * math.e - 5.44) < 0.005 and abs(math.e - 2.72) < 0.005
    # Produktregel
    assert z(sp.diff(x * E(x), x), (x + 1) * E(x))
    assert z(sp.diff(x * E(-x), x), (1 - x) * E(-x)) and sp.solve(sp.diff(x * E(-x), x), x) == [1]
    assert z(sp.diff((x**2 - 1) * E(x), x), (x**2 + 2 * x - 1) * E(x))
    assert z(sp.diff((2 * x + 1) * E(3 * x), x), (6 * x + 5) * E(3 * x))
    assert z(2 * E(3 * x) + (2 * x + 1) * E(3 * x), (2 * x + 3) * E(3 * x))
    assert z(sp.diff(x**2 * E(-2 * x), x), (2 * x - 2 * x**2) * E(-2 * x))
    assert z(2 * x * (-2 * E(-2 * x)), -4 * x * E(-2 * x))
    d12 = sp.diff(x * E(-x), x)
    assert d12.subs(x, 1) == 0 and abs(math.exp(-1) - 0.368) < 0.0005 and abs(2 * math.exp(-1) - 0.736) < 0.0005
    assert E(-x).subs(x, 1) == E(-1) and (x * (-E(-x))).subs(x, 1) == -E(-1) and ((1 + x) * E(-x)).subs(x, 1) == 2 * E(-1)
    # Tangenten
    f13 = E(2 * x)
    assert f13.subs(x, 0) == 1 and sp.diff(f13, x).subs(x, 0) == 2
    f14 = x * E(x)
    m14 = sp.diff(f14, x).subs(x, 1)
    assert f14.subs(x, 1) == sp.E and m14 == 2 * sp.E and f14.subs(x, 1) - m14 * 1 == -sp.E
    assert abs(2 * math.e - 5.44) < 0.005 and abs(-math.e + 2.72) < 0.005
    assert z(sp.E * (x - 1) + sp.E, sp.E * x)  # tangent with the half product rule
    # zweite Ableitung
    assert z(sp.diff(E(-2 * x), x, 2), 4 * E(-2 * x)) and z(sp.diff(E(-2 * x), x), -2 * E(-2 * x))
    assert z(sp.diff(x * E(x), x, 2), (x + 2) * E(x))
    # Anwendungen
    N = 200 * E(sp.Rational(2, 5) * t)
    assert sp.diff(N, t).subs(t, 0) == 80 and N.subs(t, 0) == 200 and abs(float(sp.diff(N, t).subs(t, 1)) - 119) < 0.5
    U = 12 * E(-sp.Rational(1, 2) * t)
    dU = sp.diff(U, t)
    assert z(dU, -6 * E(-t / 2)) and abs(float(dU.subs(t, 2)) + 2.21) < 0.005 and abs(float(U.subs(t, 2)) - 4.41) < 0.005 and dU.subs(t, 0) == -6
    A = 1 - E(-sp.Rational(1, 5) * t)
    dA = sp.diff(A, t)
    assert z(dA, sp.Rational(1, 5) * E(-t / 5)) and dA.subs(t, 0) == sp.Rational(1, 5) and abs(float(dA.subs(t, 10)) - 0.027) < 0.0005
    assert dA.subs(t, 5) > 0 and sp.diff(dA, t).subs(t, 5) < 0 and sp.limit(A, t, sp.oo) == 1
    f20 = (x - 2) * E(x)
    assert z(sp.diff(f20, x), (x - 1) * E(x)) and sp.solve(sp.diff(f20, x), x) == [1] and sp.solve(f20, x) == [2]


Q.verify(check)
Q.save()
