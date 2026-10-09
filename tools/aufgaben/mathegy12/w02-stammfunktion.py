#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 2 (LB 5): Stammfunktion und unbestimmtes
Integral - Umkehrung des Differenzierens, Integrationskonstante, Stammfunktion durch
einen Punkt, Zusammenhang der Graphen von f und F. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12
import sympy as sp

Q = gy12(nr=2, slug='stammfunktion', thema='Stammfunktion und unbestimmtes Integral', lb='LB 5',
         blurb='Stammfunktionen finden und prüfen, Integrationskonstante, Graphen von f und F',
         comment='Blocks: Stammfunktion finden (1-8), Konstante und Punkt (6, 8, 14, 15), Graphen von f und F (9-11), Anwendung und Geschichte (16, 17), Umformen (12, 13, 18-20). Ohne Hilfsmittel.')

Q.q(r'Welche Funktion ist eine Stammfunktion von $f(x) = 3x^2$?',
    [r'$F(x) = x^3$', r'$F(x) = 6x$', r'$F(x) = \tfrac13 x^3$', r'$F(x) = 3x^3$'],
    [r'Gesucht ist $F$ mit $F^{\prime}(x) = 3x^2$.',
     r'$(x^3)^{\prime} = 3x^2$ ✔. $6x$ ist die Ableitung von $f$, nicht die Stammfunktion.'])

Q.q(r'Welche Funktion ist keine Stammfunktion von $f(x) = 2x$?',
    [r'$F(x) = 2x^2$', r'$F(x) = x^2 + 5$', r'$F(x) = x^2 - \pi$', r'$F(x) = x^2$'],
    [r'Jede Stammfunktion hat die Form $x^2 + C$.',
     r'$(2x^2)^{\prime} = 4x \neq 2x$. Die anderen drei unterscheiden sich nur um eine Konstante.'])

Q.q(r'Berechne $\int (4x^3 - 2x)\,\mathrm{d}x$.',
    [r'$x^4 - x^2 + C$', r'$12x^2 - 2 + C$', r'$4x^4 - 2x^2 + C$', r'$x^4 - 2x^2 + C$'],
    [r'Exponent um 1 erhöhen, durch den neuen Exponenten teilen: $4 \cdot \tfrac{x^4}{4} - 2 \cdot \tfrac{x^2}{2}$.',
     r'Ergebnis $x^4 - x^2 + C$. Probe: $(x^4 - x^2)^{\prime} = 4x^3 - 2x$ ✔'])

Q.q(r'Berechne $\int 5\,\mathrm{d}x$.',
    [r'$5x + C$', r'$5 + C$', r'$0$', r'$\tfrac52 x^2 + C$'],
    [r'Die Konstante $5$ ist $5x^0$: Stammfunktion $5x$.',
     r'Probe: $(5x + C)^{\prime} = 5$ ✔. $0$ wäre die Ableitung von $5$.'])

Q.q(r'$F(x) = x^3 - 3x^2 + 1$ ist eine Stammfunktion von …',
    [r'$f(x) = 3x^2 - 6x$', r'$f(x) = \tfrac14 x^4 - x^3 + x$', r'$f(x) = 3x^2 - 6x + 1$', r'$f(x) = 6x - 6$'],
    [r'$F$ ist Stammfunktion von $f$, wenn $F^{\prime} = f$.',
     r'$F^{\prime}(x) = 3x^2 - 6x$. Die $1$ fällt beim Ableiten weg, $6x - 6$ ist schon $F^{\prime\prime}$.'])

Q.q(r'Welche Stammfunktion von $f(x) = 2x$ geht durch den Punkt $P(1 \mid 5)$?',
    [r'$F(x) = x^2 + 4$', r'$F(x) = x^2 + 5$', r'$F(x) = 2x + 3$', r'$F(x) = x^2 - 4$'],
    [r'Ansatz $F(x) = x^2 + C$, Punktprobe: $1 + C = 5$.',
     r'$C = 4$, also $F(x) = x^2 + 4$.'])

Q.q(r'Berechne $\int x^4\,\mathrm{d}x$.',
    [r'$\tfrac15 x^5 + C$', r'$4x^3 + C$', r'$x^5 + C$', r'$\tfrac14 x^5 + C$'],
    [r'Potenzregel rückwärts: $\int x^n\,\mathrm{d}x = \dfrac{x^{n+1}}{n+1} + C$.',
     r'Mit $n = 4$: $\dfrac{x^5}{5} + C$. Geteilt wird durch den **neuen** Exponenten.'])

Q.q(r'Bestimme die Stammfunktion $F$ von $f(x) = x^2 - 1$ mit $F(0) = 2$.',
    [r'$F(x) = \tfrac13 x^3 - x + 2$', r'$F(x) = \tfrac13 x^3 - x$', r'$F(x) = 2x + 2$', r'$F(x) = x^3 - x + 2$'],
    [r'$F(x) = \tfrac13 x^3 - x + C$ und $F(0) = C = 2$.',
     r'Also $F(x) = \tfrac13 x^3 - x + 2$.'])

Q.q(r'Wie gehen die Graphen zweier Stammfunktionen derselben Funktion $f$ auseinander hervor?',
    [r'durch Verschieben in $y$-Richtung', r'durch Verschieben in $x$-Richtung', r'durch Spiegeln an der $x$-Achse', r'durch Strecken in $y$-Richtung'],
    [r'Zwei Stammfunktionen unterscheiden sich nur um eine Konstante: $F_2(x) = F_1(x) + C$.',
     r'Für jedes $x$ ist der Abstand $C$ gleich: eine Verschiebung nach oben oder unten. Die Steigungen bleiben gleich.'])

Q.q(r'Auf einem Intervall ist $f(x) > 0$. Was folgt für jede Stammfunktion $F$ von $f$?',
    [r'$F$ ist dort streng monoton steigend.', r'$F$ ist dort positiv.', r'$F$ hat dort eine Nullstelle.', r'$F$ ist dort konstant.'],
    [r'$F^{\prime} = f > 0$: Die Steigung von $F$ ist überall positiv.',
     r'Also steigt $F$. Ob $F$ selbst positiv ist, hängt von der Konstanten $C$ ab.'])

Q.q(r'$f$ hat bei $x = 2$ eine Nullstelle mit Vorzeichenwechsel von $+$ nach $-$. Was hat jede Stammfunktion $F$ bei $x = 2$?',
    [r'einen Hochpunkt', r'einen Tiefpunkt', r'einen Wendepunkt', r'eine Nullstelle'],
    [r'$F^{\prime} = f$: Die Ableitung von $F$ wechselt bei $2$ von $+$ nach $-$.',
     r'Das ist das Kriterium für einen Hochpunkt von $F$.'])

Q.q(r'Berechne $\int (x + 1)^2\,\mathrm{d}x$.',
    [r'$\tfrac13 (x + 1)^3 + C$', r'$2(x + 1) + C$', r'$(x + 1)^3 + C$', r'$\tfrac13 x^3 + 1 + C$'],
    [r'Probe durch Ableiten: $\left(\tfrac13 (x + 1)^3\right)^{\prime} = (x + 1)^2 \cdot 1$ ✔',
     r'Gleichwertig: ausmultiplizieren, $\int (x^2 + 2x + 1)\,\mathrm{d}x = \tfrac13 x^3 + x^2 + x + C$.'])

Q.q(r'Ist $F(x) = \tfrac12 \sin(2x)$ eine Stammfunktion von $f(x) = \cos(2x)$?',
    [r'Ja, denn $F^{\prime}(x) = \tfrac12 \cos(2x) \cdot 2 = \cos(2x)$.', r'Nein, richtig wäre $\sin(2x)$.', r'Nein, richtig wäre $-\tfrac12 \sin(2x)$.', r'Nein, richtig wäre $2\sin(2x)$.'],
    [r'Prüfen heißt ableiten: Kettenregel mit innerer Ableitung $2$.',
     r'$F^{\prime}(x) = \tfrac12 \cdot \cos(2x) \cdot 2 = \cos(2x)$ ✔'])

Q.q(r'Bestimme die Stammfunktion von $f(x) = 6x - 2$ mit $F(1) = 0$.',
    [r'$F(x) = 3x^2 - 2x - 1$', r'$F(x) = 3x^2 - 2x$', r'$F(x) = 6x^2 - 2x - 4$', r'$F(x) = 3x^2 - 2x + 1$'],
    [r'$F(x) = 3x^2 - 2x + C$, $F(1) = 3 - 2 + C = 0$.',
     r'$C = -1$: $F(x) = 3x^2 - 2x - 1$.'])

Q.q(r'Eine Stammfunktion von $f(x) = 2x - 4$ soll ihren Tiefpunkt auf der $x$-Achse haben. Wie lautet sie?',
    [r'$F(x) = x^2 - 4x + 4$', r'$F(x) = x^2 - 4x$', r'$F(x) = x^2 - 4x - 4$', r'$F(x) = 2x^2 - 4x + 2$'],
    [r'$F(x) = x^2 - 4x + C$, Tiefpunkt bei $F^{\prime}(x) = f(x) = 0$, also $x = 2$.',
     r'$F(2) = 4 - 8 + C = 0$ gibt $C = 4$: $F(x) = (x - 2)^2$.'])

Q.q(r'Ein Körper startet bei $s(0) = 0$ mit der Geschwindigkeit $v(t) = 3t^2$ (in m/s). Wie weit ist er nach $2$ s gekommen?',
    [r'$8$ m', r'$12$ m', r'$24$ m', r'$4$ m'],
    [r'Der Weg ist eine Stammfunktion der Geschwindigkeit: $s(t) = t^3 + C$ mit $s(0) = 0$, also $C = 0$.',
     r'$s(2) = 8$ m. $12$ m/s ist die Geschwindigkeit $v(2)$.'])

Q.q(r'Wer führte das Integralzeichen $\int$ ein, ein langgezogenes S für „Summe“?',
    [r'Gottfried Wilhelm Leibniz', r'Isaac Newton', r'Bernhard Riemann', r'Archimedes'],
    [r'Leibniz und Newton entwickelten die Differential- und Integralrechnung unabhängig voneinander.',
     r'Die heute übliche Schreibweise mit $\int$ und $\mathrm{d}x$ stammt von Leibniz.'])

Q.q(r'Berechne $\int x(x - 2)\,\mathrm{d}x$.',
    [r'$\tfrac13 x^3 - x^2 + C$', r'$\tfrac12 x^2 \cdot \left(\tfrac12 x^2 - 2x\right) + C$', r'$\tfrac13 x^3 - 2x + C$', r'$2x - 2 + C$'],
    [r'Erst ausmultiplizieren: $x(x - 2) = x^2 - 2x$. Ein Produkt integriert man nicht faktorweise.',
     r'$\int (x^2 - 2x)\,\mathrm{d}x = \tfrac13 x^3 - x^2 + C$.'])

Q.q(r'Welche Funktion ist für $x > 0$ eine Stammfunktion von $f(x) = \dfrac{1}{x^2}$?',
    [r'$F(x) = -\dfrac1x$', r'$F(x) = \dfrac1x$', r'$F(x) = -\dfrac{2}{x^3}$', r'$F(x) = \dfrac{1}{3x^3}$'],
    [r'$\dfrac{1}{x^2} = x^{-2}$, Potenzregel: $\dfrac{x^{-1}}{-1} = -\dfrac1x$.',
     r'Probe: $\left(-x^{-1}\right)^{\prime} = x^{-2}$ ✔. $-\tfrac{2}{x^3}$ ist die Ableitung, nicht die Stammfunktion.'])

Q.q(r'$F$ ist eine Stammfunktion von $f$. Welche Funktion ist eine Stammfunktion von $3f$?',
    [r'$3F$', r'$F + 3$', r'$F^3$', r'$\tfrac13 F$'],
    [r'Faktorregel: $(3F)^{\prime} = 3F^{\prime} = 3f$.',
     r'Konstante Faktoren bleiben beim Integrieren stehen, genau wie beim Ableiten.'])


def check():
    x, t, C = sp.symbols('x t C')
    d = lambda e: sp.diff(e, x)
    assert d(x**3) == 3*x**2 and d(2*x**2) == 4*x and d(x**2 + 5) == 2*x
    assert sp.expand(sp.integrate(4*x**3 - 2*x, x) - (x**4 - x**2)) == 0
    assert sp.integrate(5, x) == 5*x
    assert d(x**3 - 3*x**2 + 1) == 3*x**2 - 6*x
    assert sp.solve(sp.Eq(1 + C, 5), C) == [4]
    assert sp.integrate(x**4, x) == x**5/5
    assert sp.integrate(x**2 - 1, x) == x**3/3 - x
    assert sp.expand(d((x + 1)**3/3) - (x + 1)**2) == 0
    assert sp.simplify(d(sp.sin(2*x)/2) - sp.cos(2*x)) == 0
    assert sp.solve(sp.Eq(3 - 2 + C, 0), C) == [-1]
    assert sp.solve(2*x - 4, x) == [2] and sp.solve(sp.Eq(4 - 8 + C, 0), C) == [4]
    assert sp.integrate(3*t**2, (t, 0, 2)) == 8 and 3*2**2 == 12
    assert sp.integrate(x*(x - 2), x) == x**3/3 - x**2
    assert sp.simplify(d(-1/x) - 1/x**2) == 0


Q.verify(check)
Q.save()
