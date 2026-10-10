#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 3 / KW 36 (LB 1): Termumformungen -
zusammenfassen, Klammern auflösen, ausmultiplizieren, ausklammern. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=3, slug='termumformungen', thema='Termumformungen', lb='LB 1',
        blurb='Zusammenfassen, Klammern auflösen, Ausmultiplizieren, Ausklammern',
        comment='Blocks: like terms (1-2), brackets with plus and minus (3-5, 16), multiplying out (6-8, 11-12, 19), factoring (9-10, 18), context and checks (13-15, 17, 20).')

# ---------------------------------------------------------- Zusammenfassen ----
Q.q(r'Fasse zusammen: $5x + 3y - 2x + y$',
    [r'$3x + 4y$', r'$7xy$', r'$3x + 3y$', r'$7x + 4y$'],
    [r'Nur gleichartige Glieder dürfen zusammengefasst werden: die $x$-Glieder und die $y$-Glieder.',
     r'$5x - 2x = 3x$ und $3y + y = 4y$',
     r'Ergebnis: $3x + 4y$'])

Q.q(r'Fasse zusammen: $4a - 7 - 6a + 2$',
    [r'$-2a - 5$', r'$2a - 5$', r'$-2a + 9$', r'$-7a$'],
    [r'$a$-Glieder: $4a - 6a = -2a$',
     r'Zahlen: $-7 + 2 = -5$',
     r'Ergebnis: $-2a - 5$'])

# ------------------------------------------------------- Klammern auflösen ----
Q.q(r'Vereinfache: $(3x + 4) + (2x - 5)$',
    [r'$5x - 1$', r'$5x + 9$', r'$5x + 1$', r'$6x - 1$'],
    [r'Eine Plusklammer kann man einfach weglassen: $3x + 4 + 2x - 5$.',
     r'$3x + 2x = 5x$ und $4 - 5 = -1$',
     r'Ergebnis: $5x - 1$'])

Q.q(r'Vereinfache: $7x - (2x - 3)$',
    [r'$5x + 3$', r'$5x - 3$', r'$9x - 3$', r'$5x$'],
    [r'Vor der Klammer steht ein Minus: Beim Weglassen der Klammer kehren sich alle Vorzeichen in der Klammer um.',
     r'$7x - 2x + 3$',
     r'Ergebnis: $5x + 3$'])

Q.q(r'Vereinfache: $(4a - b) - (a - 2b)$',
    [r'$3a + b$', r'$3a - 3b$', r'$3a - b$', r'$5a - 3b$'],
    [r'Minusklammer auflösen: $4a - b - a + 2b$',
     r'$4a - a = 3a$ und $-b + 2b = b$',
     r'Ergebnis: $3a + b$'])

# ---------------------------------------------------------- Ausmultiplizieren ----
Q.q(r'Multipliziere aus: $3 \cdot (2x + 5)$',
    [r'$6x + 15$', r'$6x + 5$', r'$5x + 8$', r'$6x + 8$'],
    [r'Der Faktor 3 wird mit jedem Summanden in der Klammer multipliziert.',
     r'$3 \cdot 2x = 6x$ und $3 \cdot 5 = 15$',
     r'Ergebnis: $6x + 15$'])

Q.q(r'Multipliziere aus: $-2 \cdot (x - 4)$',
    [r'$-2x + 8$', r'$-2x - 8$', r'$-2x - 4$', r'$2x + 8$'],
    [r'$-2 \cdot x = -2x$',
     r'$-2 \cdot (-4) = +8$, denn minus mal minus ergibt plus.',
     r'Ergebnis: $-2x + 8$'])

Q.q(r'Multipliziere aus: $x \cdot (x + 3)$',
    [r'$x^2 + 3x$', r'$x^2 + 3$', r'$2x + 3$', r'$x + 3x$'],
    [r'$x \cdot x = x^2$',
     r'$x \cdot 3 = 3x$',
     r'Ergebnis: $x^2 + 3x$'])

# ------------------------------------------------------------- Ausklammern ----
Q.q(r'Klammere den größten gemeinsamen Faktor aus: $6x + 9$',
    [r'$3 \cdot (2x + 3)$', r'$3 \cdot (2x + 9)$', r'$6 \cdot (x + 9)$', r'$9 \cdot (6x + 1)$'],
    [r'Der größte gemeinsame Teiler von 6 und 9 ist 3.',
     r'$6x : 3 = 2x$ und $9 : 3 = 3$',
     r'Ergebnis: $3 \cdot (2x + 3)$. Probe durch Ausmultiplizieren: $6x + 9$.'])

Q.q(r'Klammere aus: $12a - 8ab$',
    [r'$4a \cdot (3 - 2b)$', r'$4a \cdot (3 - 8b)$', r'$4 \cdot (3a - 2b)$', r'$4a \cdot (8 - 2b)$'],
    [r'Gemeinsam sind der Faktor 4 und die Variable $a$, also $4a$.',
     r'$12a : 4a = 3$ und $8ab : 4a = 2b$',
     r'Ergebnis: $4a \cdot (3 - 2b)$'])

Q.q(r'Vereinfache: $2 \cdot (x + 3) + 4 \cdot (x - 1)$',
    [r'$6x + 2$', r'$6x + 10$', r'$6x - 2$', r'$8x + 2$'],
    [r'Ausmultiplizieren: $2x + 6 + 4x - 4$',
     r'Zusammenfassen: $6x + 2$'])

Q.q(r'Vereinfache: $5 \cdot (2a - 1) - 3 \cdot (a + 2)$',
    [r'$7a - 11$', r'$7a + 1$', r'$7a - 1$', r'$13a - 11$'],
    [r'Ausmultiplizieren: $10a - 5 - 3a - 6$',
     r'Achtung: Das Minus vor der 3 gilt für beide Summanden der zweiten Klammer.',
     r'Zusammenfassen: $7a - 11$'])

# ------------------------------------------------------ Sachbezug und Probe ----
Q.q(r'Ein Rechteck hat die Seitenlängen $x + 3$ und $2x$ (in cm). Welcher Term beschreibt den Umfang?',
    [r'$6x + 6$', r'$3x + 3$', r'$6x + 3$', r'$4x + 6$'],
    [r'$u = 2 \cdot (x + 3) + 2 \cdot 2x$',
     r'$u = 2x + 6 + 4x$',
     r'$u = 6x + 6$'])

Q.q(r'Welcher Term ist gleichwertig zu $3 \cdot (a + b)$?',
    [r'$3a + 3b$', r'$3a + b$', r'$3 + a + b$', r'$3ab$'],
    [r'Verteilungsgesetz: Der Faktor wird mit jedem Summanden multipliziert.',
     r'$3 \cdot (a + b) = 3a + 3b$',
     r'Probe mit $a = 1$, $b = 2$: $3 \cdot 3 = 9$ und $3 + 6 = 9$.'])

Q.q(r'Lea vereinfacht $4 - (x - 2)$ zu $2 - x$. Prüfe mit $x = 1$. Welcher Term ist richtig?',
    [r'$6 - x$', r'$2 - x$', r'$2 + x$', r'$6 + x$'],
    [r'Probe: $4 - (1 - 2) = 4 - (-1) = 5$, aber $2 - 1 = 1$. Leas Term ist falsch.',
     r'Richtig: $4 - x + 2 = 6 - x$',
     r'Probe: $6 - 1 = 5$ stimmt.'])

Q.q(r'Löse die Klammer auf: $-(3x - 7)$',
    [r'$-3x + 7$', r'$-3x - 7$', r'$3x + 7$', r'$3x - 7$'],
    [r'Ein Minus vor der Klammer bedeutet $(-1) \cdot (3x - 7)$.',
     r'Alle Vorzeichen in der Klammer kehren sich um: $-3x + 7$.'])

Q.q(r'Für $n$ Personen beim Schulfest werden je 3 Brötchen zu 0,40 € gekauft. Die Kosten sind $n \cdot 3 \cdot 0{,}40$ Euro. Wie lautet der Term vereinfacht?',
    [r'$1{,}20n$', r'$3{,}40n$', r'$0{,}12n$', r'$12n$'],
    [r'Die Zahlen darf man zuerst multiplizieren: $3 \cdot 0{,}40 = 1{,}20$.',
     r'Kosten: $1{,}20n$ Euro, also 1,20 € pro Person.'])

Q.q(r'Klammere $-2$ aus: $-4x - 10$',
    [r'$-2 \cdot (2x + 5)$', r'$-2 \cdot (2x - 5)$', r'$2 \cdot (-2x + 5)$', r'$-2 \cdot (4x + 10)$'],
    [r'$-4x : (-2) = 2x$ und $-10 : (-2) = 5$',
     r'Ergebnis: $-2 \cdot (2x + 5)$',
     r'Probe: $-2 \cdot 2x = -4x$ und $-2 \cdot 5 = -10$.'])

Q.q(r'Multipliziere aus: $0{,}5 \cdot (8x - 6)$',
    [r'$4x - 3$', r'$4x - 6$', r'$8{,}5x - 6$', r'$4x + 3$'],
    [r'Mal 0,5 heißt halbieren.',
     r'$0{,}5 \cdot 8x = 4x$ und $0{,}5 \cdot (-6) = -3$',
     r'Ergebnis: $4x - 3$'])

Q.q(r'Zaubertrick: Denke dir eine Zahl $x$, addiere 5, verdopple das Ergebnis, subtrahiere 10 und halbiere. Was kommt heraus?',
    [r'immer die gedachte Zahl $x$', r'$x + 5$', r'$2x$', r'immer 5'],
    [r'Als Term: $\big(2 \cdot (x + 5) - 10\big) : 2$',
     r'$2 \cdot (x + 5) - 10 = 2x + 10 - 10 = 2x$',
     r'$2x : 2 = x$, man erhält also immer die gedachte Zahl.'])


def check():
    import sympy as sp
    x, y, a, b, n = sp.symbols('x y a b n')
    eq = lambda u, v: sp.expand(u - v) == 0
    assert eq(5*x + 3*y - 2*x + y, 3*x + 4*y)
    assert eq(4*a - 7 - 6*a + 2, -2*a - 5)
    assert eq((3*x + 4) + (2*x - 5), 5*x - 1)
    assert eq(7*x - (2*x - 3), 5*x + 3)
    assert eq((4*a - b) - (a - 2*b), 3*a + b)
    assert eq(3*(2*x + 5), 6*x + 15)
    assert eq(-2*(x - 4), -2*x + 8)
    assert eq(x*(x + 3), x**2 + 3*x)
    assert eq(3*(2*x + 3), 6*x + 9) and not eq(3*(2*x + 9), 6*x + 9)
    assert eq(4*a*(3 - 2*b), 12*a - 8*a*b)
    assert eq(2*(x + 3) + 4*(x - 1), 6*x + 2)
    assert eq(5*(2*a - 1) - 3*(a + 2), 7*a - 11)
    assert eq(2*(x + 3) + 2*2*x, 6*x + 6)
    assert eq(3*(a + b), 3*a + 3*b)
    assert 4 - (1 - 2) == 5 and 2 - 1 == 1 and eq(4 - (x - 2), 6 - x)
    assert eq(-(3*x - 7), -3*x + 7)
    assert eq(n*3*sp.Rational(2, 5), sp.Rational(6, 5)*n)
    assert eq(-2*(2*x + 5), -4*x - 10)
    assert eq(sp.Rational(1, 2)*(8*x - 6), 4*x - 3)
    assert eq((2*(x + 5) - 10) / 2, x)


Q.verify(check)
Q.save()
