#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 4 / KW 37 (LB 1): lineare Gleichungen
kalkülmäßig lösen, Probe, Sonderfälle. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=4, slug='lineare-gleichungen', thema='Lineare Gleichungen lösen', lb='LB 1',
        blurb='Äquivalenzumformungen, Klammern, Probe, keine oder unendlich viele Lösungen',
        comment='Blocks: one and two steps (1-4, 13-14), variable on both sides and brackets (5-7, 15, 19), special cases (8-9), method and errors (10-12), word problems (16-18, 20).')

# ------------------------------------------------------------- Grundtypen ----
Q.q(r'Löse: $x + 7 = 3$',
    [r'$x = -4$', r'$x = 10$', r'$x = 4$', r'$x = -10$'],
    [r'Auf beiden Seiten 7 subtrahieren: $x = 3 - 7$',
     r'$x = -4$',
     r'Probe: $-4 + 7 = 3$'])

Q.q(r'Löse: $4x = -20$',
    [r'$x = -5$', r'$x = 5$', r'$x = -16$', r'$x = -80$'],
    [r'Beide Seiten durch 4 teilen.',
     r'$x = -20 : 4 = -5$'])

Q.q(r'Löse: $3x - 5 = 16$',
    [r'$x = 7$', r'$x = \dfrac{11}{3}$', r'$x = 63$', r'$x = -7$'],
    [r'$+5$ auf beiden Seiten: $3x = 21$',
     r'$:3$ auf beiden Seiten: $x = 7$',
     r'Probe: $3 \cdot 7 - 5 = 16$'])

Q.q(r'Löse: $\dfrac{x}{4} = 2{,}5$',
    [r'$x = 10$', r'$x = 0{,}625$', r'$x = 6{,}5$', r'$x = -1{,}5$'],
    [r'Die Umkehrung von „durch 4“ ist „mal 4“.',
     r'$x = 2{,}5 \cdot 4 = 10$'])

# --------------------------------------------- Variable auf beiden Seiten ----
Q.q(r'Löse: $5x + 12 = 2x + 27$',
    [r'$x = 5$', r'$x = 13$', r'$x = -5$', r'$x = 3$'],
    [r'$-2x$: $3x + 12 = 27$',
     r'$-12$: $3x = 15$',
     r'$:3$: $x = 5$. Probe: $25 + 12 = 37$ und $10 + 27 = 37$.'])

Q.q(r'Löse: $7 - 2x = 3x - 8$',
    [r'$x = 3$', r'$x = -3$', r'$x = 1$', r'$x = 15$'],
    [r'$+2x$: $7 = 5x - 8$',
     r'$+8$: $15 = 5x$',
     r'$:5$: $x = 3$. Probe: $7 - 6 = 1$ und $9 - 8 = 1$.'])

Q.q(r'Löse: $3 \cdot (x - 4) = 2x + 1$',
    [r'$x = 13$', r'$x = 5$', r'$x = -11$', r'$x = 11$'],
    [r'Klammer ausmultiplizieren: $3x - 12 = 2x + 1$',
     r'$-2x$: $x - 12 = 1$',
     r'$+12$: $x = 13$'])

# ---------------------------------------------------------- Sonderfälle ----
Q.q(r'Löse: $3x + 45 = 1{,}5 \cdot (2x + 16)$',
    [r'Es gibt keine Lösung.', r'$x = 0$', r'$x = 7$', r'Jede Zahl ist Lösung.'],
    [r'Rechte Seite ausmultiplizieren: $1{,}5 \cdot 2x + 1{,}5 \cdot 16 = 3x + 24$.',
     r'$3x + 45 = 3x + 24$, nach $-3x$ bleibt $45 = 24$.',
     r'Das ist falsch, egal welches $x$ man einsetzt. Die Gleichung hat keine Lösung.'])

Q.q(r'Löse: $2 \cdot (x + 3) = 2x + 6$',
    [r'Jede Zahl ist Lösung.', r'Es gibt keine Lösung.', r'Nur $x = 0$', r'Nur $x = 3$'],
    [r'Links ausmultiplizieren: $2x + 6 = 2x + 6$.',
     r'Nach $-2x$ bleibt $6 = 6$, das ist immer wahr.',
     r'Die Gleichung hat unendlich viele Lösungen.'])

# -------------------------------------------------- Verfahren und Fehler ----
Q.q(r'Welche Umformung führt von $5x - 3 = 2x + 9$ zu $3x - 3 = 9$?',
    [r'auf beiden Seiten $2x$ subtrahieren', r'auf beiden Seiten 3 addieren',
     r'beide Seiten durch 5 teilen', r'auf beiden Seiten $5x$ subtrahieren'],
    [r'Links wurde aus $5x$ jetzt $3x$, rechts ist $2x$ verschwunden.',
     r'Also wurde auf beiden Seiten $2x$ subtrahiert.'])

Q.q(r'Tom rechnet: $4x + 6 = 18 \;\;|\; :4$ ergibt $x + 6 = 4{,}5$. Was ist falsch?',
    [r'Er hat nur $4x$ durch 4 geteilt, nicht auch die 6.', r'Man darf nie durch 4 teilen.',
     r'18 : 4 ist nicht 4,5.', r'Nichts, die Umformung ist richtig.'],
    [r'Beim Teilen muss die ganze linke Seite geteilt werden: $(4x + 6) : 4 = x + 1{,}5$.',
     r'Besser zuerst 6 subtrahieren: $4x = 12$, dann $x = 3$.'])

Q.q(r'Welche Zahl löst die Gleichung $5 - 3x = 11$?',
    [r'$x = -2$', r'$x = 2$', r'$x = -6$', r'$x = 6$'],
    [r'$-5$: $-3x = 6$',
     r'$:(-3)$: $x = -2$',
     r'Probe: $5 - 3 \cdot (-2) = 5 + 6 = 11$'])

Q.q(r'Löse: $0{,}4x + 1{,}2 = 3$',
    [r'$x = 4{,}5$', r'$x = 10{,}5$', r'$x = 0{,}72$', r'$x = 7{,}5$'],
    [r'$-1{,}2$: $0{,}4x = 1{,}8$',
     r'$:0{,}4$: $x = 4{,}5$'])

Q.q(r'Löse: $\dfrac{x}{3} + 2 = 5$',
    [r'$x = 9$', r'$x = 1$', r'$x = 21$', r'$x = 3$'],
    [r'$-2$: $\dfrac{x}{3} = 3$',
     r'$\cdot 3$: $x = 9$'])

Q.q(r'Löse: $-(x - 5) = 2x - 4$',
    [r'$x = 3$', r'$x = -3$', r'$x = 1$', r'$x = 9$'],
    [r'Minusklammer auflösen: $-x + 5 = 2x - 4$',
     r'$+x$ und $+4$: $9 = 3x$',
     r'$x = 3$'])

# ------------------------------------------------------- Sachaufgaben ----
Q.q(r'Ein Seil von 14 m Länge wird so geteilt, dass ein Stück 4 m länger ist als das andere. Wie lang ist das kürzere Stück?',
    [r'5 m', r'9 m', r'7 m', r'10 m'],
    [r'Kürzeres Stück $x$, längeres Stück $x + 4$.',
     r'$x + x + 4 = 14$, also $2x = 10$ und $x = 5$.',
     r'Die Stücke sind 5 m und 9 m lang.'])

Q.q(r'Welche Gleichung passt zu: „Das Dreifache einer Zahl, vermindert um 7, ist 20.“?',
    [r'$3x - 7 = 20$', r'$3 \cdot (x - 7) = 20$', r'$7 - 3x = 20$', r'$3x = 20 - 7$'],
    [r'Das Dreifache einer Zahl: $3x$',
     r'vermindert um 7: $3x - 7$',
     r'ist 20: $3x - 7 = 20$, also $x = 9$.'])

Q.q(r'Das Doppelte einer Zahl, vermehrt um 9, ergibt 1. Wie heißt die Zahl?',
    [r'−4', r'5', r'−5', r'4'],
    [r'$2x + 9 = 1$',
     r'$2x = -8$, also $x = -4$.',
     r'Probe: $2 \cdot (-4) + 9 = 1$'])

Q.q(r'Löse: $2 \cdot (3x - 1) - (x + 4) = 9$',
    [r'$x = 3$', r'$x = 1$', r'$x = -3$', r'$x = 2{,}2$'],
    [r'Ausmultiplizieren und Minusklammer auflösen: $6x - 2 - x - 4 = 9$',
     r'Zusammenfassen: $5x - 6 = 9$',
     r'$5x = 15$, also $x = 3$.'])

Q.q(r'Eine Mutter ist heute dreimal so alt wie ihre Tochter. In 12 Jahren wird sie doppelt so alt sein. Wie alt ist die Tochter heute?',
    [r'12 Jahre', r'24 Jahre', r'6 Jahre', r'36 Jahre'],
    [r'Tochter heute $x$, Mutter heute $3x$.',
     r'In 12 Jahren: $3x + 12 = 2 \cdot (x + 12)$',
     r'$3x + 12 = 2x + 24$, also $x = 12$. Probe: 36 und 12 heute, 48 und 24 in 12 Jahren.'])


def check():
    import sympy as sp
    x = sp.symbols('x')
    s = lambda l, r: sp.solve(sp.Eq(l, r), x)
    assert s(x + 7, 3) == [-4]
    assert s(4*x, -20) == [-5]
    assert s(3*x - 5, 16) == [7]
    assert s(x / 4, sp.Rational(5, 2)) == [10]
    assert s(5*x + 12, 2*x + 27) == [5]
    assert s(7 - 2*x, 3*x - 8) == [3]
    assert s(3*(x - 4), 2*x + 1) == [13]
    assert s(3*x + 45, sp.Rational(3, 2)*(2*x + 16)) == []
    assert sp.expand(2*(x + 3) - (2*x + 6)) == 0
    assert s(4*x + 6, 18) == [3] and sp.Rational(18, 4) == sp.Rational(9, 2)
    assert s(5 - 3*x, 11) == [-2]
    assert s(sp.Rational(2, 5)*x + sp.Rational(6, 5), 3) == [sp.Rational(9, 2)]
    assert s(x / 3 + 2, 5) == [9]
    assert s(-(x - 5), 2*x - 4) == [3]
    assert s(x + x + 4, 14) == [5]
    assert s(3*x - 7, 20) == [9]
    assert s(2*x + 9, 1) == [-4]
    assert s(2*(3*x - 1) - (x + 4), 9) == [3]
    assert s(3*x + 12, 2*(x + 12)) == [12] and 3*12 + 12 == 2*(12 + 12)


Q.verify(check)
Q.save()
