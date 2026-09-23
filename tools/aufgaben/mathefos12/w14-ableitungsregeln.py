#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 14 (LB 2): Ableitungsregeln - Konstanten-, Potenz-,
Faktor- und Summenregel, Potenzregel auch für negative und gebrochene Exponenten
(1/x, Wurzel x), ganzrationale Funktionen ableiten, höhere Ableitungen.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec

Q = fos12(nr=14, slug='ableitungsregeln', thema='Ableitungsregeln', lb='LB 2',
          blurb='Konstanten-, Potenz-, Faktor- und Summenregel, höhere Ableitungen',
          comment='Blocks: Konstanten-, Potenz-, Faktor- und Summenregel (1-6), negative und gebrochene Exponenten (7-12), höhere Ableitungen (13-17), Anwendungen (18-20). Alles ohne CAS.')

# ------------------------------- Potenz-, Faktor- und Summenregel ----
Q.q(r'Bestimme die Ableitung von $f(x) = x^5$.',
    [r'$f^{\prime}(x) = 5x^4$', r'$f^{\prime}(x) = 5x^5$', r'$f^{\prime}(x) = x^4$', r'$f^{\prime}(x) = 4x^4$'],
    [r'Potenzregel: $(x^n)^{\prime} = n \cdot x^{n-1}$.',
     r'Der Exponent $5$ kommt als Faktor nach vorn und wird um $1$ kleiner: $5x^4$.',
     r'Falle: Der Exponent wird gesenkt, nicht der Faktor.'])

Q.q(r'Bestimme die Ableitung von $f(x) = 8$.',
    [r'$f^{\prime}(x) = 0$', r'$f^{\prime}(x) = 8$', r'$f^{\prime}(x) = 8x$', r'$f^{\prime}(x) = 1$'],
    [r'Konstantenregel: Der Graph von $f(x) = 8$ ist eine waagerechte Gerade.',
     r'Eine waagerechte Gerade hat überall den Anstieg $0$, also $f^{\prime}(x) = 0$.',
     r'Deshalb fallen konstante Summanden beim Ableiten immer weg.'])

Q.q(r'Bestimme die Ableitung von $f(x) = 4x^3$.',
    [r'$f^{\prime}(x) = 12x^2$', r'$f^{\prime}(x) = 4x^2$', r'$f^{\prime}(x) = 12x^3$', r'$f^{\prime}(x) = 3x^2$'],
    [r'Faktorregel: Der Faktor $4$ bleibt stehen, abgeleitet wird nur $x^3$.',
     r'$f^{\prime}(x) = 4 \cdot 3x^2 = 12x^2$',
     r'Falle: $4x^2$ entsteht, wenn man den Exponenten senkt, aber nicht als Faktor mitnimmt.'])

Q.q(r'Warum darf man beim Ableiten von $f(x) = 7x^4$ den Faktor $7$ einfach stehen lassen und nur $x^4$ ableiten?',
    [r'wegen der Faktorregel: $(c \cdot g(x))^{\prime} = c \cdot g^{\prime}(x)$',
     r'wegen der Summenregel: Summanden werden einzeln abgeleitet',
     r'wegen der Konstantenregel: Konstanten haben die Ableitung $0$',
     r'wegen der Potenzregel: der Exponent wird zum Faktor'],
    [r'Ein konstanter Faktor streckt den Graphen nur in $y$-Richtung, damit streckt er auch jeden Anstieg um denselben Faktor.',
     r'$f^{\prime}(x) = 7 \cdot 4x^3 = 28x^3$',
     r'Falle: Die Konstantenregel gilt für den Summanden $7$, nicht für den Faktor $7$ vor $x^4$.'])

Q.q(r'Bestimme die Ableitung von $f(x) = 2x^3 + 5x^2 - 4x + 9$.',
    [r'$f^{\prime}(x) = 6x^2 + 10x - 4$', r'$f^{\prime}(x) = 6x^2 + 10x - 4 + 9$',
     r'$f^{\prime}(x) = 6x^2 + 10x + 4$', r'$f^{\prime}(x) = 6x^3 + 10x^2 - 4$'],
    [r'Summenregel: gliedweise ableiten.',
     r'$2 \cdot 3x^2 + 5 \cdot 2x - 4 + 0 = 6x^2 + 10x - 4$',
     r'Falle: $-4x$ wird zu $-4$ (das $x$ verschwindet), die Konstante $9$ fällt ganz weg.'])

Q.q(r'Bestimme die Ableitung von $f(x) = \dfrac{1}{2}x^4 - 3x$.',
    [r'$f^{\prime}(x) = 2x^3 - 3$', r'$f^{\prime}(x) = 2x^3 - 3x$', r'$f^{\prime}(x) = \dfrac{1}{2}x^3 - 3$', r'$f^{\prime}(x) = 4x^3 - 3$'],
    [r'$\dfrac{1}{2} \cdot 4x^3 = 2x^3$',
     r'$(3x)^{\prime} = 3$, also $f^{\prime}(x) = 2x^3 - 3$.',
     r'Probe im Kopf: Bei $x = 1$ ist der Anstieg $2 - 3 = -1$, der Graph fällt dort.'])

# ----------------------------- negative und gebrochene Exponenten ----
Q.q(r'Bestimme die Ableitung von $f(x) = \dfrac{1}{x}$.',
    [r'$f^{\prime}(x) = -\dfrac{1}{x^2}$', r'$f^{\prime}(x) = \dfrac{1}{x^2}$',
     r'$f^{\prime}(x) = -\dfrac{1}{2x^2}$', r'$f^{\prime}(x) = -\dfrac{2}{x^3}$'],
    [r'Erst als Potenz schreiben: $\dfrac{1}{x} = x^{-1}$.',
     r'Potenzregel: $f^{\prime}(x) = -1 \cdot x^{-2} = -\dfrac{1}{x^2}$',
     r'Das Minus passt zum Bild: Die Hyperbel fällt auf beiden Ästen.'])

Q.q(r'Bestimme die Ableitung von $f(x) = \sqrt{x}$.',
    [r'$f^{\prime}(x) = \dfrac{1}{2\sqrt{x}}$', r'$f^{\prime}(x) = \dfrac{1}{\sqrt{x}}$',
     r'$f^{\prime}(x) = \dfrac{1}{2}\sqrt{x}$', r'$f^{\prime}(x) = 2\sqrt{x}$'],
    [r'Als Potenz: $\sqrt{x} = x^{\frac{1}{2}}$.',
     r'$f^{\prime}(x) = \dfrac{1}{2}x^{-\frac{1}{2}} = \dfrac{1}{2\sqrt{x}}$',
     r'Probe: Bei $x = 4$ ist der Anstieg $\dfrac{1}{4}$ - die Wurzelkurve wird nach rechts immer flacher.'])

Q.q(r'Bestimme die Ableitung von $f(x) = \dfrac{1}{x^2}$.',
    [r'$f^{\prime}(x) = -\dfrac{2}{x^3}$', r'$f^{\prime}(x) = \dfrac{2}{x^3}$',
     r'$f^{\prime}(x) = -\dfrac{1}{2x^3}$', r'$f^{\prime}(x) = -\dfrac{2}{x}$'],
    [r'$\dfrac{1}{x^2} = x^{-2}$',
     r'$f^{\prime}(x) = -2 \cdot x^{-3} = -\dfrac{2}{x^3}$',
     r'Falle: Der Exponent $-2$ wird um $1$ kleiner, also $-3$ - nicht größer.'])

Q.q(r'Bestimme die Ableitung von $f(x) = \dfrac{1}{\sqrt{x}}$.',
    [r'$f^{\prime}(x) = -\dfrac{1}{2}x^{-\frac{3}{2}}$', r'$f^{\prime}(x) = \dfrac{1}{2}x^{-\frac{3}{2}}$',
     r'$f^{\prime}(x) = -\dfrac{1}{2}x^{-\frac{1}{2}}$', r'$f^{\prime}(x) = -2x^{-\frac{3}{2}}$'],
    [r'Als Potenz: $\dfrac{1}{\sqrt{x}} = x^{-\frac{1}{2}}$.',
     r'$f^{\prime}(x) = -\dfrac{1}{2}x^{-\frac{3}{2}}$, denn $-\dfrac{1}{2} - 1 = -\dfrac{3}{2}$.',
     r'In Wurzelschreibweise: $f^{\prime}(x) = -\dfrac{1}{2x\sqrt{x}}$.'])

Q.q(r'Bestimme die Ableitung von $f(x) = (2x + 1)(x - 3)$.',
    [r'$f^{\prime}(x) = 4x - 5$', r'$f^{\prime}(x) = 2$', r'$f^{\prime}(x) = 4x - 6$', r'$f^{\prime}(x) = 2x - 5$'],
    [r'Ohne Produktregel: erst ausmultiplizieren.',
     r'$f(x) = 2x^2 - 6x + x - 3 = 2x^2 - 5x - 3$',
     r'$f^{\prime}(x) = 4x - 5$. Falle: Die Ableitungen der Faktoren zu multiplizieren ($2 \cdot 1 = 2$) ist falsch.'])

Q.q(r'Bestimme die Ableitung von $f(x) = \dfrac{x^2 + 3}{x}$.',
    [r'$f^{\prime}(x) = 1 - \dfrac{3}{x^2}$', r'$f^{\prime}(x) = 1 + \dfrac{3}{x^2}$',
     r'$f^{\prime}(x) = 2x$', r'$f^{\prime}(x) = 1 - \dfrac{3}{x}$'],
    [r'Ohne Quotientenregel: den Bruch aufteilen.',
     r'$f(x) = \dfrac{x^2}{x} + \dfrac{3}{x} = x + 3x^{-1}$',
     r'$f^{\prime}(x) = 1 - 3x^{-2} = 1 - \dfrac{3}{x^2}$. Falle: Zähler und Nenner einzeln abzuleiten ergibt Unsinn.'])

# --------------------------------------------------- höhere Ableitungen ----
Q.q(r'Berechne $f^{\prime}(2)$ für $f(x) = x^3 - 6x^2 + 9x$.',
    [r'$f^{\prime}(2) = -3$', r'$f^{\prime}(2) = 3$', r'$f^{\prime}(2) = 2$', r'$f^{\prime}(2) = -9$'],
    [r'$f^{\prime}(x) = 3x^2 - 12x + 9$',
     r'$f^{\prime}(2) = 3 \cdot 4 - 12 \cdot 2 + 9 = 12 - 24 + 9 = -3$',
     r'Falle: $f(2) = 8 - 24 + 18 = 2$ ist der Funktionswert, nicht der Anstieg.'])

Q.q(r'Wie lautet die zweite Ableitung von $f(x) = x^5$?',
    [r'$f^{\prime\prime}(x) = 20x^3$', r'$f^{\prime\prime}(x) = 5x^4$', r'$f^{\prime\prime}(x) = 20x^4$', r'$f^{\prime\prime}(x) = 60x^2$'],
    [r'$f^{\prime}(x) = 5x^4$',
     r'Noch einmal ableiten: $f^{\prime\prime}(x) = 5 \cdot 4x^3 = 20x^3$',
     r'Falle: $60x^2$ wäre bereits $f^{\prime\prime\prime}(x)$.'])

Q.q(r'Bestimme $f^{\prime\prime}(x)$ für $f(x) = 2x^3 - 4x^2 + x$.',
    [r'$f^{\prime\prime}(x) = 12x - 8$', r'$f^{\prime\prime}(x) = 6x^2 - 8x + 1$',
     r'$f^{\prime\prime}(x) = 12x - 8x$', r'$f^{\prime\prime}(x) = 12x - 4$'],
    [r'$f^{\prime}(x) = 6x^2 - 8x + 1$',
     r'$f^{\prime\prime}(x) = 12x - 8$ - der konstante Summand $1$ fällt weg.',
     r'Falle: $6x^2 - 8x + 1$ ist erst die erste Ableitung.'])

Q.q(r'Wie lautet die dritte Ableitung von $f(x) = x^4$?',
    [r'$f^{\prime\prime\prime}(x) = 24x$', r'$f^{\prime\prime\prime}(x) = 12x^2$',
     r'$f^{\prime\prime\prime}(x) = 24$', r'$f^{\prime\prime\prime}(x) = 24x^2$'],
    [r'$f^{\prime}(x) = 4x^3$, $f^{\prime\prime}(x) = 12x^2$',
     r'$f^{\prime\prime\prime}(x) = 24x$',
     r'Erst die vierte Ableitung ist die Konstante $24$.'])

Q.q(r'Berechne $f^{\prime\prime}(1)$ für $f(x) = 2x^4 - x^2$.',
    [r'$f^{\prime\prime}(1) = 22$', r'$f^{\prime\prime}(1) = 6$', r'$f^{\prime\prime}(1) = 23$', r'$f^{\prime\prime}(1) = 26$'],
    [r'$f^{\prime}(x) = 8x^3 - 2x$',
     r'$f^{\prime\prime}(x) = 24x^2 - 2$, also $f^{\prime\prime}(1) = 24 - 2 = 22$.',
     r'Falle: $f^{\prime}(1) = 8 - 2 = 6$ ist die erste Ableitung an dieser Stelle.'])

# --------------------------------------------------------------- Anwendungen ----
Q.q(r'Ein Fahrzeug legt den Weg $s(t) = t^3 - 9t^2 + 24t$ zurück ($s$ in m, $t$ in s). Wie groß ist seine Beschleunigung $a(t) = s^{\prime\prime}(t)$ zum Zeitpunkt $t = 1$?',
    [r'$-12\,\dfrac{\mathrm{m}}{\mathrm{s}^2}$', r'$12\,\dfrac{\mathrm{m}}{\mathrm{s}^2}$',
     r'$-18\,\dfrac{\mathrm{m}}{\mathrm{s}^2}$', r'$9\,\dfrac{\mathrm{m}}{\mathrm{s}^2}$'],
    [r'$v(t) = s^{\prime}(t) = 3t^2 - 18t + 24$',
     r'$a(t) = s^{\prime\prime}(t) = 6t - 18$, also $a(1) = 6 - 18 = -12\,\dfrac{\mathrm{m}}{\mathrm{s}^2}$.',
     r'Das Minus heißt: Das Fahrzeug bremst gerade. Falle: $v(1) = 9\,\dfrac{\mathrm{m}}{\mathrm{s}}$ ist die Geschwindigkeit.'])

Q.q(r'Die Gesamtkosten eines Betriebs betragen $K(x) = 0{,}1x^3 - 2x^2 + 30x + 100$ (in €, $x$ in ME). Wie groß sind die Grenzkosten $K^{\prime}(x)$ bei $x = 10$?',
    [r'$20$ € je ME', r'$30$ € je ME', r'$300$ € je ME', r'$10$ € je ME'],
    [r'$K^{\prime}(x) = 0{,}3x^2 - 4x + 30$',
     r'$K^{\prime}(10) = 0{,}3 \cdot 100 - 40 + 30 = 30 - 40 + 30 = 20$',
     r'Falle: $K(10) = 100 - 200 + 300 + 100 = 300$ € sind die Gesamtkosten, nicht die Grenzkosten.'])

Q.q(r'Für welchen Wert von $a$ hat der Graph von $f(x) = x^3 + a\,x$ an der Stelle $x = 1$ den Anstieg $0$?',
    [r'$a = -3$', r'$a = 3$', r'$a = -1$', r'$a = 0$'],
    [r'$f^{\prime}(x) = 3x^2 + a$',
     r'Bedingung: $f^{\prime}(1) = 3 + a = 0$, also $a = -3$.',
     r'Probe: $f(x) = x^3 - 3x$ hat $f^{\prime}(x) = 3x^2 - 3$ und damit $f^{\prime}(1) = 0$.'])


def check():
    import sympy as sp
    x = sp.symbols('x')
    d = lambda e, n=1: sp.diff(e, x, n)
    eq = lambda a, b: sp.simplify(a - b) == 0
    # power, factor, sum rule
    assert eq(d(x ** 5), 5 * x ** 4)
    assert d(sp.Integer(8) + 0 * x) == 0
    assert eq(d(4 * x ** 3), 12 * x ** 2)
    assert eq(d(7 * x ** 4), 28 * x ** 3)
    assert eq(d(2 * x ** 3 + 5 * x ** 2 - 4 * x + 9), 6 * x ** 2 + 10 * x - 4)
    assert eq(d(sp.Rational(1, 2) * x ** 4 - 3 * x), 2 * x ** 3 - 3)
    assert (2 * 1 ** 3 - 3) == -1
    # negative and fractional exponents
    assert eq(d(1 / x), -1 / x ** 2)
    assert eq(d(sp.sqrt(x)), 1 / (2 * sp.sqrt(x)))
    assert d(sp.sqrt(x)).subs(x, 4) == sp.Rational(1, 4)
    assert eq(d(1 / x ** 2), -2 / x ** 3)
    assert eq(d(x ** sp.Rational(-1, 2)), -sp.Rational(1, 2) * x ** sp.Rational(-3, 2))
    assert eq(-sp.Rational(1, 2) * x ** sp.Rational(-3, 2), -1 / (2 * x * sp.sqrt(x)))
    assert eq(sp.expand((2 * x + 1) * (x - 3)), 2 * x ** 2 - 5 * x - 3)
    assert eq(d((2 * x + 1) * (x - 3)), 4 * x - 5)
    assert eq((x ** 2 + 3) / x, x + 3 / x) and eq(d((x ** 2 + 3) / x), 1 - 3 / x ** 2)
    # higher derivatives
    f = x ** 3 - 6 * x ** 2 + 9 * x
    assert eq(d(f), 3 * x ** 2 - 12 * x + 9) and d(f).subs(x, 2) == -3 and f.subs(x, 2) == 2
    assert eq(d(x ** 5, 2), 20 * x ** 3) and eq(d(x ** 5, 3), 60 * x ** 2)
    g = 2 * x ** 3 - 4 * x ** 2 + x
    assert eq(d(g), 6 * x ** 2 - 8 * x + 1) and eq(d(g, 2), 12 * x - 8)
    assert eq(d(x ** 4, 2), 12 * x ** 2) and eq(d(x ** 4, 3), 24 * x) and d(x ** 4, 4) == 24
    p = 2 * x ** 4 - x ** 2
    assert eq(d(p), 8 * x ** 3 - 2 * x) and eq(d(p, 2), 24 * x ** 2 - 2)
    assert d(p, 2).subs(x, 1) == 22 and d(p).subs(x, 1) == 6
    # applications
    t = sp.symbols('t')
    s = t ** 3 - 9 * t ** 2 + 24 * t
    assert sp.simplify(sp.diff(s, t) - (3 * t ** 2 - 18 * t + 24)) == 0
    assert sp.simplify(sp.diff(s, t, 2) - (6 * t - 18)) == 0
    assert sp.diff(s, t, 2).subs(t, 1) == -12 and sp.diff(s, t).subs(t, 1) == 9
    K = sp.Rational(1, 10) * x ** 3 - 2 * x ** 2 + 30 * x + 100
    assert eq(d(K), sp.Rational(3, 10) * x ** 2 - 4 * x + 30)
    assert d(K).subs(x, 10) == 20 and K.subs(x, 10) == 300
    a = sp.symbols('a')
    assert sp.solve(sp.Eq(sp.diff(x ** 3 + a * x, x).subs(x, 1), 0), a) == [-3]
    assert sp.diff(x ** 3 - 3 * x, x).subs(x, 1) == 0


Q.verify(check)
Q.save()
