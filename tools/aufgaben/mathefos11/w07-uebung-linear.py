#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 7 / KW 40: Uebung - Terme, Formeln, binomische
Formeln, Potenzen und lineare Funktionen gemischt (andere Aufgaben als in den
Wochen 2 bis 6). Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=7, slug='uebung-linear', thema='Übung: Terme, Formeln, lineare Funktionen', lb='Übung',
          blurb='gemischte Wiederholung der bisherigen Inhalte',
          comment='Blocks: Terme und Klammern (1-5), Formeln umstellen (6-9), binomische Formeln und Potenzen (10-13), lineare Funktionen (14-20).')

# -------------------------------------------------- Terme und Klammern ----
Q.q(r'Vereinfache: $4x - (2x - 7)$.',
    [r'$2x + 7$', r'$2x - 7$', r'$6x - 7$', r'$2x + 3$'],
    [r'Das Minus vor der Klammer dreht beide Vorzeichen um.',
     r'$4x - 2x + 7 = 2x + 7$',
     r'Probe mit $x = 1$: $4 - (2-7) = 9$ und $2 + 7 = 9$.'])

Q.q(r'Vereinfache: $2(3x - 1) - 3(x + 2)$.',
    [r'$3x - 8$', r'$3x - 4$', r'$9x - 8$', r'$3x + 4$'],
    [r'Beide Klammern ausmultiplizieren: $6x - 2 - 3x - 6$.',
     r'Zusammenfassen: $3x - 8$.',
     r'Probe mit $x = 2$: $2 \cdot 5 - 3 \cdot 4 = -2$ und $6 - 8 = -2$.'])

Q.q(r'Multipliziere aus: $(2x + 1)(x - 3)$.',
    [r'$2x^2 - 5x - 3$', r'$2x^2 + 5x - 3$', r'$2x^2 - 6x - 3$', r'$2x^2 - 5x + 3$'],
    [r'Jeder Summand trifft jeden: $2x^2 - 6x + x - 3$.',
     r'Zusammenfassen: $2x^2 - 5x - 3$.',
     r'Probe mit $x = 1$: $3 \cdot (-2) = -6$ und $2 - 5 - 3 = -6$.'])

Q.q(r'Zerlege in Faktoren: $4x^2 - 25$.',
    [r'$(2x + 5)(2x - 5)$', r'$(2x - 5)^2$', r'$(4x + 5)(x - 5)$', r'$(2x + 25)(2x - 1)$'],
    [r'Dritte binomische Formel mit $a = 2x$ und $b = 5$.',
     r'$4x^2 - 25 = (2x+5)(2x-5)$',
     r'Probe mit $x = 3$: $36 - 25 = 11$ und $11 \cdot 1 = 11$.'])

Q.q(r'Multipliziere aus: $(3x - 2)^2$.',
    [r'$9x^2 - 12x + 4$', r'$9x^2 - 4$', r'$9x^2 - 6x + 4$', r'$3x^2 - 12x + 4$'],
    [r'Zweite binomische Formel mit $a = 3x$ und $b = 2$.',
     r'$(3x)^2 - 2 \cdot 3x \cdot 2 + 2^2 = 9x^2 - 12x + 4$',
     r'Probe mit $x = 1$: $1^2 = 1$ und $9 - 12 + 4 = 1$.'])

# ---------------------------------------------------- Formeln umstellen ----
Q.q(r'Stelle die Dreiecksfläche $A = \dfrac{g \cdot h}{2}$ nach $h$ um.',
    [r'$h = \dfrac{2A}{g}$', r'$h = \dfrac{A}{2g}$', r'$h = 2A \cdot g$', r'$h = \dfrac{g}{2A}$'],
    [r'Mit $2$ multiplizieren: $2A = g \cdot h$.',
     r'Durch $g$ teilen: $h = \dfrac{2A}{g}$.',
     r'Probe mit $g = 4$ und $h = 3$: $A = 6$, und $\dfrac{12}{4} = 3$.'])

Q.q(r'Die Umrechnung von Grad Celsius in Grad Fahrenheit lautet $F = 1{,}8\,C + 32$. Stelle sie nach $C$ um.',
    [r'$C = \dfrac{F - 32}{1{,}8}$', r'$C = \dfrac{F}{1{,}8} - 32$',
     r'$C = 1{,}8\,(F - 32)$', r'$C = \dfrac{F + 32}{1{,}8}$'],
    [r'Zuerst $32$ abziehen: $F - 32 = 1{,}8\,C$.',
     r'Dann durch $1{,}8$ teilen: $C = \dfrac{F - 32}{1{,}8}$.',
     r'Probe: $C = 100$ ergibt $F = 212$, und $\dfrac{212 - 32}{1{,}8} = 100$.'])

Q.q(r'Aus der Prozentformel $W = \dfrac{G \cdot p}{100}$ soll $G$ berechnet werden. Wie lautet die umgestellte Formel?',
    [r'$G = \dfrac{100\,W}{p}$', r'$G = \dfrac{W \cdot p}{100}$',
     r'$G = \dfrac{100\,p}{W}$', r'$G = 100\,W \cdot p$'],
    [r'Mit $100$ multiplizieren: $100\,W = G \cdot p$.',
     r'Durch $p$ teilen: $G = \dfrac{100\,W}{p}$.',
     r'Probe: $20\,\%$ von $250$ sind $50$, und $\dfrac{100 \cdot 50}{20} = 250$.'])

Q.q(r'Stelle die Formel für den Mittelwert $\bar{x} = \dfrac{a + b}{2}$ nach $b$ um.',
    [r'$b = 2\bar{x} - a$', r'$b = \dfrac{2\bar{x}}{a}$', r'$b = \bar{x} - 2a$', r'$b = \dfrac{\bar{x} - a}{2}$'],
    [r'Mit $2$ multiplizieren: $2\bar{x} = a + b$.',
     r'$a$ abziehen: $b = 2\bar{x} - a$.',
     r'Probe: $a = 4$ und $b = 10$ ergeben $\bar{x} = 7$, und $14 - 4 = 10$.'])

# ------------------------------------- binomische Formeln und Potenzen ----
Q.q(r'Vereinfache: $x^5 \cdot x^{-2}$ für $x \neq 0$.',
    [r'$x^3$', r'$x^7$', r'$x^{-10}$', r'$\dfrac{1}{x^3}$'],
    [r'Exponenten addieren: $5 + (-2) = 3$.',
     r'$x^5 \cdot x^{-2} = x^3$',
     r'Probe mit $x = 2$: $32 \cdot \dfrac{1}{4} = 8 = 2^3$.'])

Q.q(r'Vereinfache: $\left(3x^2\right)^2$.',
    [r'$9x^4$', r'$3x^4$', r'$9x^2$', r'$6x^4$'],
    [r'Beide Faktoren werden potenziert: $3^2 \cdot \left(x^2\right)^2$.',
     r'$= 9 \cdot x^4 = 9x^4$',
     r'Probe mit $x = 1$: $3^2 = 9$.'])

Q.q(r'Berechne $16^{\frac{1}{2}}$.',
    [r'$4$', r'$8$', r'$256$', r'$32$'],
    [r'Der Exponent $\dfrac{1}{2}$ steht für die Quadratwurzel.',
     r'$16^{\frac{1}{2}} = \sqrt{16} = 4$',
     r'$8$ wäre die Hälfte von $16$ — der Exponent halbiert aber nicht die Zahl.'])

Q.q(r'Vereinfache: $\left(\dfrac{a}{b}\right)^3$ für $b \neq 0$.',
    [r'$\dfrac{a^3}{b^3}$', r'$\dfrac{a^3}{b}$', r'$\dfrac{3a}{3b}$', r'$\dfrac{a}{b^3}$'],
    [r'Beim Potenzieren eines Bruchs werden Zähler und Nenner potenziert.',
     r'$\left(\dfrac{a}{b}\right)^3 = \dfrac{a^3}{b^3}$',
     r'Probe mit $a = 2$, $b = 3$: $\left(\dfrac{2}{3}\right)^3 = \dfrac{8}{27}$.'])

# ---------------------------------------------------- lineare Funktionen ----
Q.q(r'Wie lautet die Gerade durch $P(0|-1)$ mit dem Anstieg $m = 4$?',
    [r'$y = 4x - 1$', r'$y = 4x + 1$', r'$y = -x + 4$', r'$y = 4x$'],
    [r'Der Punkt liegt auf der $y$-Achse, also ist $n = -1$.',
     r'$y = 4x - 1$',
     r'Probe: $f(0) = -1$.'])

Q.q(r'Welchen Anstieg hat die Gerade durch $A(-1|2)$ und $B(3|10)$?',
    [r'$m = 2$', r'$m = 4$', r'$m = \dfrac{1}{2}$', r'$m = -2$'],
    [r'$m = \dfrac{10 - 2}{3 - (-1)} = \dfrac{8}{4}$',
     r'$m = 2$',
     r'Im Nenner steht $3 + 1 = 4$ — das doppelte Minus wird leicht übersehen.'])

Q.q(r'Berechne die Nullstelle von $f(x) = -2x + 8$.',
    [r'$x = 4$', r'$x = -4$', r'$x = 8$', r'$x = 2$'],
    [r'$-2x + 8 = 0$',
     r'$-2x = -8$, also $x = 4$.',
     r'Probe: $f(4) = -8 + 8 = 0$.'])

Q.q(r'Wo schneiden sich $y = x + 2$ und $y = 3x - 2$?',
    [r'in $S(2|4)$', r'in $S(4|2)$', r'in $S(2|6)$', r'in $S(1|3)$'],
    [r'Gleichsetzen: $x + 2 = 3x - 2$.',
     r'$4 = 2x$, also $x = 2$.',
     r'Einsetzen: $y = 4$, also $S(2|4)$.'])

Q.q(r'Welche der folgenden Geraden ist zu $y = -\dfrac{1}{2}x + 3$ parallel?',
    [r'$y = -\dfrac{1}{2}x - 1$', r'$y = \dfrac{1}{2}x + 3$', r'$y = 2x + 3$', r'$y = -2x - 1$'],
    [r'Parallele Geraden stimmen im Anstieg überein.',
     r'Gesucht ist also wieder $m = -\dfrac{1}{2}$.',
     r'Der Achsenabschnitt darf verschieden sein, sonst wäre es dieselbe Gerade.'])

Q.q(r'Ein Stromanbieter verlangt $9$ € Grundpreis im Monat und $0{,}32$ € je Kilowattstunde. Was kosten $250\,\mathrm{kWh}$?',
    [r'$89$ €', r'$80$ €', r'$2259$ €', r'$71$ €'],
    [r'$K(x) = 0{,}32x + 9$',
     r'$K(250) = 80 + 9 = 89$ €',
     r'$80$ € wäre der Verbrauch ohne den Grundpreis.'])

Q.q(r'Bei der Geraden $y = -3x + 12$ — was bedeutet der Anstieg $-3$ in einem Sachzusammenhang, in dem $x$ Tage und $y$ einen Vorrat in Kilogramm angibt?',
    [r'Der Vorrat nimmt täglich um $3\,\mathrm{kg}$ ab.', r'Der Vorrat nimmt täglich um $3\,\mathrm{kg}$ zu.',
     r'Der Vorrat beträgt anfangs $3\,\mathrm{kg}$.', r'Der Vorrat reicht $3$ Tage.'],
    [r'Der Anstieg gibt die Änderung pro Einheit auf der $x$-Achse an.',
     r'Das negative Vorzeichen bedeutet Abnahme: $3\,\mathrm{kg}$ je Tag.',
     r'Der Anfangsvorrat ist $12\,\mathrm{kg}$, und nach $4$ Tagen ist er aufgebraucht.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    x, a, b = sp.symbols('x a b')
    # Terme
    assert sp.simplify(4 * x - (2 * x - 7) - (2 * x + 7)) == 0 and 4 - (2 - 7) == 9 == 2 + 7
    assert sp.expand(2 * (3 * x - 1) - 3 * (x + 2)) == 3 * x - 8
    assert 2 * 5 - 3 * 4 == -2 == 3 * 2 - 8
    assert sp.expand((2 * x + 1) * (x - 3)) == 2 * x ** 2 - 5 * x - 3
    assert (2 + 1) * (1 - 3) == -6 == 2 - 5 - 3
    assert sp.factor(4 * x ** 2 - 25) == (2 * x + 5) * (2 * x - 5)
    assert 4 * 9 - 25 == 11 == (2 * 3 + 5) * (2 * 3 - 5)
    assert sp.expand((3 * x - 2) ** 2) == 9 * x ** 2 - 12 * x + 4 and (3 - 2) ** 2 == 1 == 9 - 12 + 4
    # Formeln
    A, g, h, C, Fh, W, G, p, xb = sp.symbols('A g h C Fh W G p xb')
    assert sp.solve(sp.Eq(A, g * h / 2), h) == [2 * A / g] and F(4 * 3, 2) == 6 and F(12, 4) == 3
    assert sp.solve(sp.Eq(Fh, sp.Rational(18, 10) * C + 32), C) == [sp.Rational(5, 9) * (Fh - 32)]
    assert sp.Rational(18, 10) * 100 + 32 == 212 and F(212 - 32, 1) / F(18, 10) == 100
    assert sp.solve(sp.Eq(W, G * p / 100), G) == [100 * W / p]
    assert F(250 * 20, 100) == 50 and F(100 * 50, 20) == 250
    assert sp.solve(sp.Eq(xb, (a + b) / 2), b) == [2 * xb - a] and F(4 + 10, 2) == 7 and 14 - 4 == 10
    # Potenzen
    assert sp.simplify(x ** 5 * x ** -2 - x ** 3) == 0 and 32 * F(1, 4) == 8 == 2 ** 3
    assert sp.expand((3 * x ** 2) ** 2) == 9 * x ** 4
    assert sp.Integer(16) ** sp.Rational(1, 2) == 4
    assert sp.simplify((a / b) ** 3 - a ** 3 / b ** 3) == 0 and F(2, 3) ** 3 == F(8, 27)
    # lineare Funktionen
    assert (4 * x - 1).subs(x, 0) == -1
    assert F(10 - 2, 3 + 1) == 2
    assert sp.solve(-2 * x + 8, x) == [4]
    assert sp.solve(sp.Eq(x + 2, 3 * x - 2), x) == [2] and (x + 2).subs(x, 2) == 4
    assert (-sp.Rational(1, 2) * x + 3).coeff(x) == sp.Rational(-1, 2)
    assert F(32, 100) * 250 + 9 == 89 and F(32, 100) * 250 == 80
    assert (-3 * x + 12).subs(x, 0) == 12 and sp.solve(-3 * x + 12, x) == [4]


Q.verify(check)
Q.save()
