#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 2 / KW 35 (LB 1): Zahlenbereiche, Termstrukturen,
Formeln umstellen, Rechnen mit Klammern, Betrag einer Zahl.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=2, slug='zahlenbereiche', thema='Zahlenbereiche und Terme', lb='LB 1',
          blurb='Zahlenbereiche, Termstrukturen, Klammern, Formeln umstellen, Betrag',
          comment='Blocks: Zahlenbereiche (1-5), Termstrukturen und Klammern (6-11), Formeln umstellen (12-16), Betrag (17-20). Alles ohne Hilfsmittel.')

# ------------------------------------------------------- Zahlenbereiche ----
Q.q(r'Welche der folgenden Zahlen ist irrational?',
    [r'$\sqrt{2}$', r'$0{,}75$', r'$\dfrac{1}{3}$', r'$-5$'],
    [r'Irrational heißt: nicht als Bruch zweier ganzer Zahlen darstellbar.',
     r'$0{,}75 = \dfrac{3}{4}$ und $-5 = \dfrac{-5}{1}$ sind rational, $\dfrac{1}{3}$ ohnehin.',
     r'$\sqrt{2}$ lässt sich nicht als Bruch schreiben — das ist seit der Antike bewiesen.'])

Q.q(r'Welche Aussage über die Zahlenbereiche ist richtig?',
    [r'Jede natürliche Zahl ist auch eine rationale Zahl.', r'Jede rationale Zahl ist auch eine natürliche Zahl.',
     r'Jede reelle Zahl ist auch rational.', r'Die ganzen Zahlen enthalten alle Bruchzahlen.'],
    [r'Es gilt die Kette $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$.',
     r'Zum Beispiel ist $7 = \dfrac{7}{1}$ eine rationale Zahl.',
     r'Umgekehrt gilt das nicht: $\dfrac{1}{2}$ ist rational, aber nicht natürlich.'])

Q.q(r'Zu welchem Zahlenbereich gehört $0{,}\overline{3} = 0{,}333\ldots$?',
    [r'Sie ist rational, denn $0{,}\overline{3} = \dfrac{1}{3}$.',
     r'Sie ist irrational, weil die Dezimaldarstellung nicht abbricht.',
     r'Sie ist eine ganze Zahl.', r'Sie ist keine reelle Zahl.'],
    [r'Entscheidend ist nicht, ob die Dezimaldarstellung abbricht, sondern ob sie periodisch ist.',
     r'Jede periodische Dezimalzahl lässt sich als Bruch schreiben: $0{,}\overline{3} = \dfrac{1}{3}$.',
     r'Probe: $\dfrac{1}{3} \cdot 3 = 1$ und $0{,}\overline{3} \cdot 3 = 0{,}\overline{9} = 1$.'])

Q.q(r'Welche Zahl gehört zu $\mathbb{Z}$, aber nicht zu $\mathbb{N}$?',
    [r'$-3$', r'$3$', r'$\dfrac{3}{2}$', r'$\sqrt{3}$'],
    [r'$\mathbb{Z}$ enthält zusätzlich zu den natürlichen Zahlen deren Gegenzahlen.',
     r'$-3$ ist ganz, aber nicht natürlich.',
     r'$\dfrac{3}{2}$ ist rational und $\sqrt{3}$ irrational — beide liegen nicht in $\mathbb{Z}$.'])

Q.q(r'Welche der folgenden Wurzeln ist eine rationale Zahl?',
    [r'$\sqrt{9}$', r'$\sqrt{8}$', r'$\sqrt{5}$', r'$\sqrt{10}$'],
    [r'$\sqrt{9} = 3$, denn $9$ ist eine Quadratzahl.',
     r'Die Wurzel aus einer natürlichen Zahl ist genau dann rational, wenn die Zahl eine Quadratzahl ist.',
     r'$8$, $5$ und $10$ sind keine Quadratzahlen, ihre Wurzeln sind irrational.'])

# ------------------------------------------- Termstrukturen und Klammern ----
Q.q(r'Welche Struktur hat der Term $3\,(x + 2)$?',
    [r'Es ist ein Produkt aus $3$ und der Summe $x + 2$.', r'Es ist eine Summe aus $3$ und $x + 2$.',
     r'Es ist eine Differenz.', r'Es ist ein Quotient.'],
    [r'Man fragt: welche Rechenoperation wird zuletzt ausgeführt?',
     r'Hier wird zuletzt multipliziert, also ist der Term ein Produkt.',
     r'Die Termstruktur zu erkennen entscheidet darüber, welche Umformung erlaubt ist.'])

Q.q(r'Welche Struktur hat der Term $(2 + x)^2$?',
    [r'Es ist eine Potenz, genauer das Quadrat der Summe $2 + x$.',
     r'Es ist eine Summe aus $2^2$ und $x^2$.',
     r'Es ist ein Produkt aus $2$ und $x^2$.',
     r'Es ist eine Differenz.'],
    [r'Zuletzt wird potenziert, also ist der Term eine Potenz.',
     r'Achtung: $(2+x)^2$ ist nicht $4 + x^2$ — ausmultipliziert ergibt sich $4 + 4x + x^2$.',
     r'Probe mit $x = 1$: $(2+1)^2 = 9$, aber $4 + 1 = 5$.'])

Q.q(r'Vereinfache: $5 - (3 - x)$.',
    [r'$2 + x$', r'$2 - x$', r'$8 - x$', r'$-2 + x$'],
    [r'Das Minus vor der Klammer dreht jedes Vorzeichen darin um.',
     r'$5 - 3 + x = 2 + x$',
     r'Probe mit $x = 1$: $5 - (3-1) = 3$ und $2 + 1 = 3$.'])

Q.q(r'Vereinfache: $-2\,(x - 4)$.',
    [r'$-2x + 8$', r'$-2x - 8$', r'$-2x - 4$', r'$2x - 8$'],
    [r'Der Faktor $-2$ trifft beide Summanden in der Klammer.',
     r'$-2 \cdot x = -2x$ und $-2 \cdot (-4) = +8$.',
     r'Minus mal Minus ergibt Plus — das ist hier die häufigste Falle.'])

Q.q(r'Vereinfache: $3a - \left(2a - (a - 1)\right)$.',
    [r'$2a - 1$', r'$2a + 1$', r'$4a - 1$', r'$-1$'],
    [r'Von innen nach außen: $2a - (a-1) = 2a - a + 1 = a + 1$.',
     r'Dann $3a - (a+1) = 3a - a - 1 = 2a - 1$.',
     r'Probe mit $a = 2$: innen $4 - 1 = 3$, außen $6 - 3 = 3$, und $2 \cdot 2 - 1 = 3$.'])

Q.q(r'Multipliziere aus: $(x + 3)(x - 2)$.',
    [r'$x^2 + x - 6$', r'$x^2 - x - 6$', r'$x^2 + 5x - 6$', r'$x^2 - 6$'],
    [r'Jeder Summand der ersten Klammer trifft jeden der zweiten.',
     r'$x^2 - 2x + 3x - 6$',
     r'Zusammenfassen: $x^2 + x - 6$. Probe mit $x = 1$: $4 \cdot (-1) = -4$ und $1 + 1 - 6 = -4$.'])

# ---------------------------------------------------- Formeln umstellen ----
Q.q(r'Stelle die Flächenformel $A = a \cdot b$ nach $b$ um.',
    [r'$b = \dfrac{A}{a}$', r'$b = A \cdot a$', r'$b = A - a$', r'$b = \dfrac{a}{A}$'],
    [r'$b$ steht im Produkt mit $a$, also durch $a$ teilen.',
     r'$b = \dfrac{A}{a}$',
     r'Kontrolle mit Einheiten: $\mathrm{m^2}$ geteilt durch $\mathrm{m}$ ergibt $\mathrm{m}$ — das passt zu einer Länge.'])

Q.q(r'Stelle den Rechteckumfang $U = 2\,(a + b)$ nach $b$ um.',
    [r'$b = \dfrac{U}{2} - a$', r'$b = \dfrac{U - a}{2}$', r'$b = U - 2a$', r'$b = \dfrac{U}{2a}$'],
    [r'Zuerst durch $2$ teilen: $\dfrac{U}{2} = a + b$.',
     r'Dann $a$ abziehen: $b = \dfrac{U}{2} - a$.',
     r'Probe mit $a = 3$ und $b = 5$: $U = 16$, und $\dfrac{16}{2} - 3 = 5$.'])

Q.q(r'Stelle das Zylindervolumen $V = \pi r^2 h$ nach $h$ um.',
    [r'$h = \dfrac{V}{\pi r^2}$', r'$h = \dfrac{V}{\pi r}$', r'$h = V - \pi r^2$', r'$h = \dfrac{\pi r^2}{V}$'],
    [r'$h$ steht im Produkt mit $\pi r^2$.',
     r'Also durch $\pi r^2$ teilen: $h = \dfrac{V}{\pi r^2}$.',
     r'Probe: doppelte Höhe bei gleichem Radius bedeutet doppeltes Volumen — die Formel gibt das her.'])

Q.q(r'Stelle $s = v \cdot t$ nach $t$ um.',
    [r'$t = \dfrac{s}{v}$', r'$t = \dfrac{v}{s}$', r'$t = s \cdot v$', r'$t = s - v$'],
    [r'Durch $v$ teilen: $t = \dfrac{s}{v}$.',
     r'Probe mit $s = 120\,\mathrm{km}$ und $v = 60\,\mathrm{km/h}$: $t = 2\,\mathrm{h}$.',
     r'Auch hier hilft die Einheitenkontrolle: km geteilt durch km/h ergibt h.'])

Q.q(r'Stelle das ohmsche Gesetz $R = \dfrac{U}{I}$ nach $I$ um.',
    [r'$I = \dfrac{U}{R}$', r'$I = U \cdot R$', r'$I = \dfrac{R}{U}$', r'$I = U - R$'],
    [r'Mit $I$ multiplizieren: $R \cdot I = U$.',
     r'Dann durch $R$ teilen: $I = \dfrac{U}{R}$.',
     r'Probe mit $U = 12\,\mathrm{V}$ und $R = 4\,\Omega$: $I = 3\,\mathrm{A}$, und $\dfrac{12}{3} = 4$ stimmt.'])

# ---------------------------------------------------------------- Betrag ----
Q.q(r'Berechne $\left|-7\right|$.',
    [r'$7$', r'$-7$', r'$0$', r'$\dfrac{1}{7}$'],
    [r'Der Betrag ist der Abstand der Zahl von der Null auf dem Zahlenstrahl.',
     r'Ein Abstand ist nie negativ: $\left|-7\right| = 7$.',
     r'Auch $\left|7\right| = 7$ — beide Zahlen haben denselben Abstand zur Null.'])

Q.q(r'Berechne $\left|3 - 8\right|$.',
    [r'$5$', r'$-5$', r'$11$', r'$-11$'],
    [r'Zuerst die Klammer ausrechnen: $3 - 8 = -5$.',
     r'Dann den Betrag bilden: $\left|-5\right| = 5$.',
     r'Der Betrag wirkt auf das Ergebnis, nicht auf die einzelnen Zahlen — sonst käme $11$ heraus.'])

Q.q(r'Welche Zahlen erfüllen $\left|x\right| = 4$?',
    [r'$x = 4$ und $x = -4$', r'nur $x = 4$', r'nur $x = -4$', r'$x = 16$'],
    [r'Gesucht sind alle Zahlen mit dem Abstand $4$ von der Null.',
     r'Das sind zwei: $4$ und $-4$.',
     r'Eine Betragsgleichung hat deshalb in der Regel zwei Lösungen.'])

Q.q(r'Was beschreibt der Term $\left|x - 3\right|$?',
    [r'den Abstand der Zahl $x$ von der Zahl $3$', r'den Abstand der Zahl $x$ von der Null',
     r'die Differenz $x - 3$, immer positiv gerechnet ohne geometrische Bedeutung',
     r'die Summe von $x$ und $3$'],
    [r'$\left|a - b\right|$ ist der Abstand der beiden Zahlen auf dem Zahlenstrahl.',
     r'Hier also der Abstand von $x$ zu $3$.',
     r'Probe: für $x = 7$ ergibt sich $4$, für $x = -1$ ebenfalls $4$ — beide liegen $4$ von der $3$ entfernt.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    x, a, b = sp.symbols('x a b')
    # Zahlenbereiche
    assert sp.sqrt(2).is_rational is False and F(3, 4) == F(75, 100) and F(-5, 1) == -5
    # 0,333... = 1/3: die periodische Dezimalzahl ist der Bruch, Probe ueber 3 * 1/3 = 1
    assert F(1, 3) * 3 == 1 and sp.Rational(1, 3) == F(1, 3)
    assert sum(F(3, 10 ** k) for k in range(1, 400)) < F(1, 3)          # Naeherung bleibt darunter
    assert sp.sqrt(9) == 3 and sp.sqrt(9).is_rational
    assert sp.sqrt(8).is_rational is False and sp.sqrt(5).is_rational is False and sp.sqrt(10).is_rational is False
    assert (-3) not in range(0, 100) and F(3, 2).denominator != 1
    # Termstrukturen und Klammern
    assert sp.expand((2 + x) ** 2) == x ** 2 + 4 * x + 4
    assert (2 + 1) ** 2 == 9 and 2 ** 2 + 1 ** 2 == 5
    assert sp.simplify(5 - (3 - x) - (2 + x)) == 0 and 5 - (3 - 1) == 3 and 2 + 1 == 3
    assert sp.expand(-2 * (x - 4)) == -2 * x + 8
    assert sp.simplify(3 * a - (2 * a - (a - 1)) - (2 * a - 1)) == 0
    aa = 2; assert 2 * aa - (aa - 1) == 3 and 3 * aa - 3 == 3 and 2 * aa - 1 == 3
    assert sp.expand((x + 3) * (x - 2)) == x ** 2 + x - 6
    assert (1 + 3) * (1 - 2) == -4 and 1 + 1 - 6 == -4
    # Formeln umstellen
    A, U, V, r, h, s, v, t, R, I = sp.symbols('A U V r h s v t R I')
    assert sp.solve(sp.Eq(A, a * b), b) == [A / a]
    assert sp.solve(sp.Eq(U, 2 * (a + b)), b) == [U / 2 - a]
    assert 2 * (3 + 5) == 16 and F(16, 2) - 3 == 5
    assert sp.solve(sp.Eq(V, sp.pi * r ** 2 * h), h) == [V / (sp.pi * r ** 2)]
    assert sp.solve(sp.Eq(s, v * t), t) == [s / v] and F(120, 60) == 2
    assert sp.solve(sp.Eq(R, U / I), I) == [U / R] and F(12, 4) == 3 and F(12, 3) == 4
    # Betrag
    assert abs(-7) == 7 and abs(7) == 7
    assert abs(3 - 8) == 5 and abs(3) + abs(-8) == 11
    xr = sp.Symbol('xr', real=True)                                     # Abs braucht ein reelles Symbol
    assert sp.solveset(sp.Eq(sp.Abs(xr), 4), xr, sp.S.Reals) == sp.FiniteSet(-4, 4) and 4 ** 2 == 16
    assert abs(7 - 3) == 4 and abs(-1 - 3) == 4


Q.verify(check)
Q.save()
