#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 38 / KW 24: Vertiefung - vermischte Uebungen ueber
das ganze Jahr, andere Aufgaben als in allen bisherigen Saetzen.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=38, slug='vertiefung', thema='Vertiefung: das ganze Jahr', lb='Übung',
          blurb='Terme, Gleichungen, Funktionen und Stochastik gemischt',
          comment='Blocks: Terme und Gleichungen (1-5), Funktionen (6-11), Stochastik (12-17), Abzaehlen und Anwendung (18-20).')

# ---------------------------------------------------- Terme und Gleichungen ----
Q.q(r'Multipliziere aus: $(x - 6)^2$.',
    [r'$x^2 - 12x + 36$', r'$x^2 - 36$', r'$x^2 - 6x + 36$', r'$x^2 - 12x - 36$'],
    [r'Zweite binomische Formel.',
     r'$x^2 - 2 \cdot 6x + 36 = x^2 - 12x + 36$',
     r'Probe mit $x = 1$: $25$ und $1 - 12 + 36 = 25$.'])

Q.q(r'Zerlege in Faktoren: $x^2 + 7x + 10$.',
    [r'$(x + 2)(x + 5)$', r'$(x - 2)(x - 5)$', r'$(x + 1)(x + 10)$', r'$(x + 2)(x - 5)$'],
    [r'Vieta: zwei Zahlen mit der Summe $7$ und dem Produkt $10$.',
     r'Das sind $2$ und $5$.',
     r'$x^2 + 7x + 10 = (x+2)(x+5)$'])

Q.q(r'Löse: $8x - 3 = 5x + 9$.',
    [r'$x = 4$', r'$x = 3$', r'$x = 2$', r'$x = 12$'],
    [r'$5x$ abziehen: $3x - 3 = 9$.',
     r'$3x = 12$, also $x = 4$.',
     r'Probe: $32 - 3 = 29$ und $20 + 9 = 29$.'])

Q.q(r'Löse: $\dfrac{2}{x - 4} = 1$.',
    [r'$x = 6$', r'$x = 2$', r'$x = 4$', r'$x = -2$'],
    [r'Definitionsbereich: $x \neq 4$.',
     r'Mit $x-4$ multiplizieren: $2 = x - 4$.',
     r'$x = 6$. Probe: $\dfrac{2}{2} = 1$.'])

Q.q(r'Löse: $3 - 2x > 7$.',
    [r'$x < -2$', r'$x > -2$', r'$x < 2$', r'$x > 2$'],
    [r'$-3$: $-2x > 4$.',
     r'Durch $-2$ teilen, das Zeichen kippt: $x < -2$.',
     r'Probe mit $x = -3$: $3 + 6 = 9 > 7$ stimmt.'])

# --------------------------------------------------------------- Funktionen ----
Q.q(r'Wie lautet die Gerade durch $A(1|5)$ und $B(3|11)$?',
    [r'$y = 3x + 2$', r'$y = 3x - 2$', r'$y = 2x + 3$', r'$y = 6x - 1$'],
    [r'$m = \dfrac{11 - 5}{3 - 1} = 3$',
     r'$A$ einsetzen: $5 = 3 + n$, also $n = 2$.',
     r'$y = 3x + 2$. Probe mit $B$: $9 + 2 = 11$.'])

Q.q(r'Berechne die Nullstelle von $y = 6 - 2x$.',
    [r'$x = 3$', r'$x = -3$', r'$x = 6$', r'$x = 2$'],
    [r'$6 - 2x = 0$',
     r'$2x = 6$, also $x = 3$.',
     r'Probe: $6 - 6 = 0$.'])

Q.q(r'Wo liegt der Scheitelpunkt von $y = x^2 + 6x + 5$?',
    [r'in $(-3|-4)$', r'in $(3|-4)$', r'in $(-3|4)$', r'in $(-6|5)$'],
    [r'Quadratische Ergänzung: $x^2 + 6x + 9 - 9 + 5 = (x+3)^2 - 4$.',
     r'Also $x_S = -3$ und $y_S = -4$.',
     r'Probe: $y(-3) = 9 - 18 + 5 = -4$.'])

Q.q(r'Wie lauten die Nullstellen von $y = x^2 + 6x + 5$?',
    [r'$x_1 = -1$ und $x_2 = -5$', r'$x_1 = 1$ und $x_2 = 5$',
     r'$x_1 = -1$ und $x_2 = 5$', r'$x_1 = -6$ und $x_2 = 5$'],
    [r'Vieta: Summe $-6$, Produkt $5$.',
     r'Das sind $-1$ und $-5$.',
     r'Probe: $1 - 6 + 5 = 0$ und $25 - 30 + 5 = 0$.'])

Q.q(r'Wie lauten die Nullstellen von $f(x) = x^3 - 16x$?',
    [r'$x = 0$, $x = 4$ und $x = -4$', r'$x = 0$ und $x = 16$',
     r'$x = 4$ und $x = -4$', r'$x = 0$ und $x = 4$'],
    [r'$x$ ausklammern: $x\,(x^2 - 16) = 0$.',
     r'Dritte binomische Formel: $x\,(x-4)(x+4)$.',
     r'Nullstellen $0$, $4$ und $-4$.'])

Q.q(r'Welche Symmetrie hat der Graph von $f(x) = x^5 - x^3$?',
    [r'punktsymmetrisch zum Ursprung', r'achsensymmetrisch zur $y$-Achse',
     r'achsensymmetrisch zur $x$-Achse', r'keine Symmetrie'],
    [r'Es kommen nur ungerade Exponenten vor.',
     r'$f(-x) = -x^5 + x^3 = -f(x)$',
     r'Also Punktsymmetrie zum Ursprung.'])

# ---------------------------------------------------------------- Stochastik ----
Q.q(r'Wie groß ist beim Würfel die Wahrscheinlichkeit für eine Augenzahl höchstens $2$?',
    [r'$\dfrac{1}{3}$', r'$\dfrac{1}{6}$', r'$\dfrac{1}{2}$', r'$\dfrac{2}{3}$'],
    [r'Günstig sind $1$ und $2$.',
     r'$P = \dfrac{2}{6} = \dfrac{1}{3}$',
     r'„Höchstens $2$“ schließt die $2$ ein.'])

Q.q(r'Zwei unabhängige Ereignisse haben $P(A) = 0{,}4$ und $P(B) = 0{,}3$. Wie groß ist $P(A \cap B)$?',
    [r'$0{,}12$', r'$0{,}7$', r'$0{,}1$', r'$0{,}58$'],
    [r'Bei Unabhängigkeit gilt die Multiplikationsregel.',
     r'$0{,}4 \cdot 0{,}3 = 0{,}12$',
     r'$0{,}7$ wäre die Summe, also $P(A \cup B)$ bei Unvereinbarkeit.'])

Q.q(r'Eine Urne enthält $2$ rote und $3$ grüne Kugeln. Zweimal wird mit Zurücklegen gezogen. Wie groß ist die Wahrscheinlichkeit für zweimal Rot?',
    [r'$\dfrac{4}{25}$', r'$\dfrac{1}{10}$', r'$\dfrac{2}{5}$', r'$\dfrac{9}{25}$'],
    [r'$P(\text{rot}) = \dfrac{2}{5}$ in beiden Zügen.',
     r'$P = \dfrac{2}{5} \cdot \dfrac{2}{5} = \dfrac{4}{25}$',
     r'Erste Pfadregel: längs des Pfades multiplizieren.'])

Q.q(r'Dieselbe Urne: wie groß ist die Wahrscheinlichkeit für mindestens einmal Rot?',
    [r'$\dfrac{16}{25}$', r'$\dfrac{4}{25}$', r'$\dfrac{12}{25}$', r'$\dfrac{9}{25}$'],
    [r'Gegenereignis: zweimal Grün mit $\dfrac{3}{5} \cdot \dfrac{3}{5} = \dfrac{9}{25}$.',
     r'$1 - \dfrac{9}{25} = \dfrac{16}{25}$',
     r'Der Weg über das Gegenereignis spart hier zwei Pfade.'])

Q.q(r'Ein Versuch mit $p = \dfrac{1}{4}$ wird viermal wiederholt. Wie groß ist die Wahrscheinlichkeit für keinen Treffer?',
    [r'$\dfrac{81}{256}$', r'$\dfrac{1}{256}$', r'$\dfrac{3}{4}$', r'$\dfrac{175}{256}$'],
    [r'$P(X = 0) = \left(\dfrac{3}{4}\right)^4$',
     r'$= \dfrac{81}{256} \approx 0{,}316$',
     r'Für $k = 0$ vereinfacht sich die Formel von Bernoulli zu $(1-p)^n$.'])

Q.q(r'Wie groß ist in der vorigen Aufgabe die Wahrscheinlichkeit für mindestens einen Treffer?',
    [r'$\dfrac{175}{256}$', r'$\dfrac{81}{256}$', r'$\dfrac{1}{4}$', r'$1$'],
    [r'Gegenereignis zu „kein Treffer“.',
     r'$1 - \dfrac{81}{256} = \dfrac{175}{256}$',
     r'Das sind rund $68\,\%$.'])

# ------------------------------------------------- Abzählen und Anwendung ----
Q.q(r'Aus $9$ Personen werden $2$ für ein Team gewählt. Wie viele Möglichkeiten gibt es?',
    [r'$36$', r'$72$', r'$81$', r'$18$'],
    [r'Die Reihenfolge spielt keine Rolle.',
     r'$\binom{9}{2} = \dfrac{9 \cdot 8}{2} = 36$',
     r'$72$ wäre die Zählung mit Reihenfolge.'])

Q.q(r'Auf wie viele Arten lassen sich $5$ verschiedene Bilder nebeneinander hängen?',
    [r'$120$', r'$25$', r'$10$', r'$20$'],
    [r'$5! = 5 \cdot 4 \cdot 3 \cdot 2 \cdot 1$',
     r'$= 120$',
     r'Eine Permutation ohne Wiederholung.'])

Q.q(r'Zwei Sorten kosten $6$ € und $10$ € je Kilogramm. Wie viel der teuren Sorte steckt in $8\,\mathrm{kg}$ Mischung zu $7{,}50$ € je Kilogramm?',
    [r'$3\,\mathrm{kg}$', r'$5\,\mathrm{kg}$', r'$4\,\mathrm{kg}$', r'$2\,\mathrm{kg}$'],
    [r'Ansatz: $a + b = 8$ und $6a + 10b = 8 \cdot 7{,}50 = 60$.',
     r'$6\,(8 - b) + 10b = 60$ ergibt $48 + 4b = 60$, also $b = 3$.',
     r'$3\,\mathrm{kg}$ der teuren und $5\,\mathrm{kg}$ der billigen Sorte. Probe: $30 + 30 = 60$ €.'])


def check():
    from math import comb, factorial as fa
    from fractions import Fraction as F
    import sympy as sp
    x, a, b = sp.symbols('x a b')
    xr = sp.Symbol('xr', real=True)
    assert sp.expand((x - 6) ** 2) == x ** 2 - 12 * x + 36 and 25 == 1 - 12 + 36
    assert sp.factor(x ** 2 + 7 * x + 10) == (x + 2) * (x + 5)
    assert sp.solve(sp.Eq(8 * x - 3, 5 * x + 9), x) == [4] and 8 * 4 - 3 == 29 == 5 * 4 + 9
    assert sp.solve(sp.Eq(2 / (x - 4), 1), x) == [6]
    assert sp.solveset(3 - 2 * xr > 7, xr, sp.S.Reals) == sp.Interval.open(-sp.oo, -2)
    assert 3 + 6 == 9 > 7
    # Funktionen
    assert F(11 - 5, 3 - 1) == 3 and 3 * 1 + 2 == 5 and 3 * 3 + 2 == 11
    assert sp.solve(6 - 2 * x, x) == [3]
    p = x ** 2 + 6 * x + 5
    assert sp.expand((x + 3) ** 2 - 4) == p and p.subs(x, -3) == -4
    assert sp.solve(p, x) == [-5, -1]
    assert sp.solve(x ** 3 - 16 * x, x) == [-4, 0, 4]
    s = x ** 5 - x ** 3
    assert sp.simplify(s.subs(x, -x) + s) == 0
    # Stochastik
    assert F(2, 6) == F(1, 3)
    assert F(4, 10) * F(3, 10) == F(12, 100)
    r, g = F(2, 5), F(3, 5)
    assert r * r == F(4, 25) and g * g == F(9, 25) and 1 - g * g == F(16, 25)
    assert F(3, 4) ** 4 == F(81, 256) and abs(float(F(81, 256)) - 0.316) < 0.0005
    assert 1 - F(81, 256) == F(175, 256) and abs(float(F(175, 256)) - 0.68) < 0.005
    # Abzaehlen und Mischung
    assert comb(9, 2) == 36 and 9 * 8 == 72 and fa(5) == 120
    assert sp.solve([a + b - 8, 6 * a + 10 * b - 60], [a, b], dict=True) == [{a: 5, b: 3}]
    assert 8 * F(750, 100) == 60 and 6 * 5 + 10 * 3 == 60


Q.verify(check)
Q.save()
