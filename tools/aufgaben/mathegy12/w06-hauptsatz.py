#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 6 (LB 5): Eigenschaften des bestimmten
Integrals und Hauptsatz der Differential- und Integralrechnung - Linearität,
Intervalladditivität, Vertauschen der Grenzen, Integralfunktion, Mittelwert.
Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12
import sympy as sp

Q = gy12(nr=6, slug='hauptsatz', thema='Eigenschaften des Integrals und Hauptsatz', lb='LB 5',
         blurb='Hauptsatz, Linearität, Intervalladditivität, Integralfunktion',
         comment='Blocks: Hauptsatz rechnen (1-3, 11-13, 15), Eigenschaften (4-7, 18, 20), Integralfunktion (8, 9, 16, 17), Hauptsatz verstehen (10), Grenze und Mittelwert (14, 19). Ohne Hilfsmittel.')

Q.q(r'Berechne $\int_1^3 2x\,\mathrm{d}x$.',
    [r'$8$', r'$9$', r'$4$', r'$6$'],
    [r'Stammfunktion $F(x) = x^2$, Hauptsatz: $F(3) - F(1)$.',
     r'$9 - 1 = 8$. Wer nur $F(3)$ nimmt, erhält $9$.'])

Q.q(r'Berechne $\int_0^2 (3x^2 - 2x)\,\mathrm{d}x$.',
    [r'$4$', r'$8$', r'$12$', r'$0$'],
    [r'$F(x) = x^3 - x^2$.',
     r'$F(2) - F(0) = 8 - 4 - 0 = 4$.'])

Q.q(r'Berechne $\int_{-1}^1 x^3\,\mathrm{d}x$.',
    [r'$0$', r'$\tfrac12$', r'$\tfrac14$', r'$2$'],
    [r'$\left[\tfrac14 x^4\right]_{-1}^1 = \tfrac14 - \tfrac14$.',
     r'$= 0$: $x^3$ ist punktsymmetrisch, die Teile links und rechts heben sich auf.'])

Q.q(r'Welchen Wert hat $\int_2^2 f(x)\,\mathrm{d}x$ für jede stetige Funktion $f$?',
    [r'$0$', r'$f(2)$', r'$2f(2)$', r'Das hängt von $f$ ab.'],
    [r'Hauptsatz: $\int_a^a f(x)\,\mathrm{d}x = F(a) - F(a)$.',
     r'$= 0$: Über ein Intervall der Breite $0$ gibt es keine Fläche.'])

Q.q(r'Berechne $\int_3^1 2x\,\mathrm{d}x$.',
    [r'$-8$', r'$8$', r'$0$', r'$-4$'],
    [r'Grenzen vertauschen kehrt das Vorzeichen um: $\int_3^1 = -\int_1^3$.',
     r'$\left[x^2\right]_3^1 = 1 - 9 = -8$.'])

Q.q(r'Es gilt $\int_0^2 f(x)\,\mathrm{d}x = 3$ und $\int_2^5 f(x)\,\mathrm{d}x = 4$. Wie groß ist $\int_0^5 f(x)\,\mathrm{d}x$?',
    [r'$7$', r'$1$', r'$12$', r'Das kann man nicht sagen.'],
    [r'Intervalladditivität: $\int_a^b + \int_b^c = \int_a^c$.',
     r'$3 + 4 = 7$.'])

Q.q(r'Es gilt $\int_0^1 f(x)\,\mathrm{d}x = 4$. Wie groß ist $\int_0^1 \left(2f(x) + 3\right)\mathrm{d}x$?',
    [r'$11$', r'$8$', r'$14$', r'$7$'],
    [r'Linearität: $2\int_0^1 f(x)\,\mathrm{d}x + \int_0^1 3\,\mathrm{d}x$.',
     r'$2 \cdot 4 + 3 \cdot 1 = 11$. Die $3$ wird über die Länge $1$ integriert.'])

Q.q(r'Bestimme die Integralfunktion $I(x) = \int_0^x 2t\,\mathrm{d}t$.',
    [r'$I(x) = x^2$', r'$I(x) = 2x$', r'$I(x) = x^2 + C$', r'$I(x) = 2$'],
    [r'$I(x) = \left[t^2\right]_0^x = x^2 - 0$.',
     r'Die untere Grenze legt die Konstante fest: $I(0) = 0$. Deshalb steht kein $+ C$.'])

Q.q(r'$I(x) = \int_1^x t^2\,\mathrm{d}t$. Was ist $I^{\prime}(x)$?',
    [r'$x^2$', r'$\tfrac13 x^3$', r'$\tfrac13 x^3 - \tfrac13$', r'$2x$'],
    [r'$I(x) = \tfrac13 x^3 - \tfrac13$.',
     r'Ableiten: $I^{\prime}(x) = x^2$. Die Ableitung einer Integralfunktion ist der Integrand an der oberen Grenze.'])

Q.q(r'Was sagt der Hauptsatz der Differential- und Integralrechnung?',
    [r'Ist $F$ eine Stammfunktion von $f$, so gilt $\int_a^b f(x)\,\mathrm{d}x = F(b) - F(a)$.', r'Jede Funktion hat genau eine Stammfunktion.', r'Das Integral von $f$ ist gleich $f(b) - f(a)$.', r'Ableiten und Integrieren ergeben immer dieselbe Funktion.'],
    [r'Er verbindet die Flächenberechnung über Summen mit dem Rückwärtsableiten.',
     r'Statt Rechtecksummen genügt eine Stammfunktion: $F(b) - F(a)$, nicht $f(b) - f(a)$.'])

Q.q(r'Berechne $\int_0^{\pi} \cos x\,\mathrm{d}x$.',
    [r'$0$', r'$2$', r'$-2$', r'$1$'],
    [r'$\left[\sin x\right]_0^{\pi} = \sin\pi - \sin 0$.',
     r'$= 0$: Die Fläche über der Achse auf $[0;\ \tfrac\pi2]$ hebt sich mit der darunter auf.'])

Q.q(r'Berechne $\int_1^4 \dfrac{1}{\sqrt{x}}\,\mathrm{d}x$.',
    [r'$2$', r'$4$', r'$1$', r'$\tfrac32$'],
    [r'Stammfunktion $2\sqrt{x}$.',
     r'$2\sqrt4 - 2\sqrt1 = 4 - 2 = 2$.'])

Q.q(r'Berechne $\int_0^1 (\mathrm{e}^x + 1)\,\mathrm{d}x$.',
    [r'$\mathrm{e}$', r'$\mathrm{e} + 1$', r'$\mathrm{e} - 1$', r'$2$'],
    [r'$\left[\mathrm{e}^x + x\right]_0^1 = (\mathrm{e} + 1) - (1 + 0)$.',
     r'$= \mathrm{e}$.'])

Q.q(r'Für welches $b > 0$ gilt $\int_0^b 2x\,\mathrm{d}x = 16$?',
    [r'$b = 4$', r'$b = 8$', r'$b = 16$', r'$b = 2$'],
    [r'$\left[x^2\right]_0^b = b^2 = 16$.',
     r'$b = 4$ (die Lösung $-4$ ist ausgeschlossen).'])

Q.q(r'Berechne $\int_{-2}^2 (x^2 - 1)\,\mathrm{d}x$.',
    [r'$\tfrac43$', r'$\tfrac{16}{3}$', r'$0$', r'$-\tfrac43$'],
    [r'$\left[\tfrac13 x^3 - x\right]_{-2}^2 = \left(\tfrac83 - 2\right) - \left(-\tfrac83 + 2\right)$.',
     r'$= \tfrac23 + \tfrac23 = \tfrac43$.'])

Q.q(r'Wo hat die Integralfunktion $I(x) = \int_0^x (t - 1)\,\mathrm{d}t$ einen Tiefpunkt?',
    [r'bei $x = 1$', r'bei $x = 0$', r'bei $x = 2$', r'Sie hat keinen.'],
    [r'$I^{\prime}(x) = x - 1$ wechselt bei $x = 1$ von $-$ nach $+$.',
     r'Tiefpunkt bei $x = 1$ mit $I(1) = -\tfrac12$. Bei $x = 0$ und $x = 2$ liegen die Nullstellen von $I$.'])

Q.q(r'Welche Nullstellen hat $I(x) = \int_0^x (t - 2)\,\mathrm{d}t$?',
    [r'$x = 0$ und $x = 4$', r'nur $x = 2$', r'$x = 0$ und $x = 2$', r'nur $x = 0$'],
    [r'$I(x) = \tfrac12 x^2 - 2x = x\left(\tfrac12 x - 2\right)$.',
     r'Nullstellen $0$ und $4$. Bei $x = 2$ hat $I$ seinen Tiefpunkt, dort ist der Integrand null.'])

Q.q(r'Berechne $\int_0^2 |x - 1|\,\mathrm{d}x$.',
    [r'$1$', r'$0$', r'$2$', r'$\tfrac12$'],
    [r'Der Graph bildet zwei Dreiecke mit Grundseite $1$ und Höhe $1$.',
     r'$2 \cdot \tfrac12 = 1$. Ohne Betrag wäre das Integral $0$.'])

Q.q(r'Wie groß ist der Mittelwert von $f(x) = x^2$ auf $[0;\ 3]$, also $\dfrac{1}{3 - 0}\int_0^3 x^2\,\mathrm{d}x$?',
    [r'$3$', r'$9$', r'$4{,}5$', r'$1$'],
    [r'$\int_0^3 x^2\,\mathrm{d}x = 9$.',
     r'Mittelwert $\tfrac93 = 3$. Ein Rechteck der Höhe $3$ über $[0;\ 3]$ hat dieselbe Fläche.'])

Q.q(r'Warum gilt $\int_{-a}^{a} f(x)\,\mathrm{d}x = 0$ für jede punktsymmetrische Funktion $f$?',
    [r'Die Flächen links und rechts der $y$-Achse sind gleich groß, liegen aber auf verschiedenen Seiten der $x$-Achse.', r'Weil punktsymmetrische Funktionen immer null sind.', r'Weil $F(a) = F(-a)$ für jede Stammfunktion gilt.', r'Weil man über negative $x$ nicht integrieren darf.'],
    [r'Punktsymmetrie: $f(-x) = -f(x)$, das Stück links ist das gespiegelte Stück rechts unter der Achse.',
     r'Die orientierten Flächen heben sich auf, siehe $\int_{-1}^1 x^3\,\mathrm{d}x = 0$.'])


def check():
    x, t, b = sp.symbols('x t b')
    I = lambda f, a, c, v=x: sp.integrate(f, (v, a, c))
    assert I(2*x, 1, 3) == 8 and I(3*x**2 - 2*x, 0, 2) == 4 and I(x**3, -1, 1) == 0
    assert I(2*x, 3, 1) == -8 and 3 + 4 == 7 and 2*4 + 3 == 11
    assert I(2*t, 0, x, t) == x**2
    J = I(t**2, 1, x, t)
    assert sp.simplify(J - (x**3/3 - sp.Rational(1, 3))) == 0 and sp.diff(J, x) == x**2
    assert I(sp.cos(x), 0, sp.pi) == 0 and I(1/sp.sqrt(x), 1, 4) == 2 and I(sp.exp(x) + 1, 0, 1) == sp.E
    assert sp.solve(sp.Eq(b**2, 16), b) == [-4, 4]
    assert I(x**2 - 1, -2, 2) == sp.Rational(4, 3)
    K = I(t - 1, 0, x, t)
    assert sp.solve(sp.diff(K, x), x) == [1] and K.subs(x, 1) == -sp.Rational(1, 2) and sp.solve(K, x) == [0, 2]
    assert sp.solve(I(t - 2, 0, x, t), x) == [0, 4]
    assert I(sp.Abs(x - 1), 0, 2) == 1 and I(x**2, 0, 3) == 9


Q.verify(check)
Q.save()
