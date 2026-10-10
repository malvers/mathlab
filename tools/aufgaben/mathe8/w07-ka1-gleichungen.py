#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 7 / KW 40: Vorbereitung Klassenarbeit 1
(LB 1 lineare Gleichungen). Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=7, slug='ka1-gleichungen', thema='Vorbereitung Klassenarbeit 1: Lineare Gleichungen', lb='KA 1',
        blurb='gemischte Wiederholung zu Termen, Gleichungen, Formeln und Sachaufgaben',
        comment='Mixed review of LB 1: term values (1-2), term transformations (3-6), equations (7-11, 19), formulas (12-14), setting up and word problems (15-18, 20).')

# ------------------------------------------------------------------ Terme ----
Q.q(r'Berechne den Wert von $4 - 2x$ für $x = -3$.',
    [r'10', r'−2', r'6', r'−10'],
    [r'$4 - 2 \cdot (-3) = 4 - (-6)$',
     r'$4 + 6 = 10$'])

Q.q(r'Berechne den Wert von $\dfrac{3a - b}{2}$ für $a = 2$ und $b = -4$.',
    [r'5', r'1', r'−1', r'10'],
    [r'Zähler: $3 \cdot 2 - (-4) = 6 + 4 = 10$',
     r'$\dfrac{10}{2} = 5$'])

Q.q(r'Fasse zusammen: $2x - 5y - 7x + 2y$',
    [r'$-5x - 3y$', r'$-5x + 3y$', r'$5x - 3y$', r'$-8xy$'],
    [r'$2x - 7x = -5x$',
     r'$-5y + 2y = -3y$',
     r'Ergebnis: $-5x - 3y$'])

Q.q(r'Vereinfache: $8 - (3 - 2x)$',
    [r'$5 + 2x$', r'$5 - 2x$', r'$11 - 2x$', r'$11 + 2x$'],
    [r'Minusklammer: alle Vorzeichen umkehren, $8 - 3 + 2x$.',
     r'Ergebnis: $5 + 2x$'])

Q.q(r'Vereinfache: $4 \cdot (3x - 2) - 5x$',
    [r'$7x - 8$', r'$7x - 2$', r'$17x - 8$', r'$7x + 8$'],
    [r'Ausmultiplizieren: $12x - 8 - 5x$',
     r'Zusammenfassen: $7x - 8$'])

Q.q(r'Klammere aus: $15ab + 10b$',
    [r'$5b \cdot (3a + 2)$', r'$5b \cdot (3a + 10)$', r'$5 \cdot (3a + 2b)$', r'$10b \cdot (5a + 1)$'],
    [r'Gemeinsamer Faktor: 5 und $b$, also $5b$.',
     r'$15ab : 5b = 3a$ und $10b : 5b = 2$',
     r'Ergebnis: $5b \cdot (3a + 2)$'])

# -------------------------------------------------------------- Gleichungen ----
Q.q(r'Löse: $6x - 4 = 2x + 12$',
    [r'$x = 4$', r'$x = 2$', r'$x = -4$', r'$x = 16$'],
    [r'$-2x$: $4x - 4 = 12$',
     r'$+4$: $4x = 16$',
     r'$x = 4$'])

Q.q(r'Löse: $5 \cdot (x + 2) = 3x - 4$',
    [r'$x = -7$', r'$x = 7$', r'$x = -3$', r'$x = 3$'],
    [r'Ausmultiplizieren: $5x + 10 = 3x - 4$',
     r'$-3x$ und $-10$: $2x = -14$',
     r'$x = -7$. Probe: $5 \cdot (-5) = -25$ und $-21 - 4 = -25$.'])

Q.q(r'Löse: $\dfrac{x}{2} - 3 = 4$',
    [r'$x = 14$', r'$x = 2$', r'$x = 8$', r'$x = 3{,}5$'],
    [r'$+3$: $\dfrac{x}{2} = 7$',
     r'$\cdot 2$: $x = 14$'])

Q.q(r'Wie viele Lösungen hat $4x + 7 = 4x - 1$?',
    [r'keine', r'unendlich viele', r'genau eine: $x = 1$', r'genau eine: $x = -2$'],
    [r'Nach $-4x$ bleibt $7 = -1$.',
     r'Das ist nie wahr, die Gleichung hat keine Lösung.'])

Q.q(r'Welche Zahl löst $2 - 3x = x + 14$?',
    [r'$x = -3$', r'$x = 3$', r'$x = -4$', r'$x = 4$'],
    [r'$-x$ und $-2$: $-4x = 12$',
     r'$x = -3$',
     r'Probe: $2 + 9 = 11$ und $-3 + 14 = 11$'])

# ---------------------------------------------------------------- Formeln ----
Q.q(r'Ein Prisma hat das Volumen 360 cm³ und eine Grundfläche von 24 cm². Wie hoch ist es? Nutze $V = G \cdot h$.',
    [r'15 cm', r'8640 cm', r'336 cm', r'1,5 cm'],
    [r'Umstellen: $h = \dfrac{V}{G}$',
     r'$h = \dfrac{360}{24} = 15$, also 15 cm.'])

Q.q(r'Stelle $u = 2a + 2b$ nach $a$ um.',
    [r'$a = \dfrac{u - 2b}{2}$', r'$a = \dfrac{u}{2} - 2b$', r'$a = u - b$', r'$a = \dfrac{u + 2b}{2}$'],
    [r'$-2b$: $u - 2b = 2a$',
     r'$:2$: $a = \dfrac{u - 2b}{2}$, gleichwertig zu $\dfrac{u}{2} - b$.'])

Q.q(r'Ein Guthaben bringt bei 2,5 % Zinsen in einem Jahr 30 € Zinsen. Wie groß ist das Guthaben? Nutze $Z = \dfrac{K \cdot p}{100}$.',
    [r'1200 €', r'75 €', r'0,75 €', r'12 000 €'],
    [r'Umstellen: $K = \dfrac{100 \cdot Z}{p}$',
     r'$K = \dfrac{100 \cdot 30}{2{,}5} = \dfrac{3000}{2{,}5} = 1200$, also 1200 €.'])

# -------------------------------------------------------------- Sachaufgaben ----
Q.q(r'Welche Gleichung passt zu: „Subtrahiert man von einer Zahl 12 und multipliziert das Ergebnis mit 3, erhält man 15.“?',
    [r'$3 \cdot (x - 12) = 15$', r'$3x - 12 = 15$', r'$x - 12 \cdot 3 = 15$', r'$12 - 3x = 15$'],
    [r'Zuerst wird subtrahiert: $x - 12$.',
     r'„Das Ergebnis“ wird mit 3 multipliziert, also braucht man eine Klammer: $3 \cdot (x - 12) = 15$.'])

Q.q(r'Löse die Gleichung aus der vorigen Aufgabe: $3 \cdot (x - 12) = 15$.',
    [r'$x = 17$', r'$x = 9$', r'$x = 1$', r'$x = 15$'],
    [r'$:3$: $x - 12 = 5$',
     r'$+12$: $x = 17$'])

Q.q(r'Eine Klassenfahrt kostet 480 € für den Bus und 65 € pro Person für die Unterkunft, insgesamt 2105 €. Wie viele Personen fahren mit?',
    [r'25', r'32', r'24', r'40'],
    [r'$480 + 65x = 2105$',
     r'$65x = 1625$',
     r'$x = 1625 : 65 = 25$'])

Q.q(r'In einem Dreieck ist $\beta$ doppelt so groß wie $\alpha$, und $\gamma$ ist um $20^\circ$ größer als $\alpha$. Wie groß ist $\alpha$?',
    [r'$40^\circ$', r'$80^\circ$', r'$45^\circ$', r'$50^\circ$'],
    [r'Winkelsumme: $\alpha + 2\alpha + (\alpha + 20^\circ) = 180^\circ$',
     r'$4\alpha + 20^\circ = 180^\circ$, also $4\alpha = 160^\circ$.',
     r'$\alpha = 40^\circ$, $\beta = 80^\circ$, $\gamma = 60^\circ$.'])

Q.q(r'Mia löst $5 - 2x = 11$ so: $-2x = 6$, also $x = 3$. Was stimmt?',
    [r'Beim Teilen durch −2 ging das Minus verloren, richtig ist $x = -3$.',
     r'Sie hätte 5 addieren müssen, richtig ist $x = 8$.',
     r'Richtig ist $x = 8$.', r'Alles ist richtig.'],
    [r'$-2x = 6$ ist richtig.',
     r'Dann aber $x = 6 : (-2) = -3$.',
     r'Probe: $5 - 2 \cdot (-3) = 11$ stimmt, $5 - 2 \cdot 3 = -1$ nicht.'])

Q.q(r'Ein Zaun aus $n$ Feldern braucht $n + 1$ Pfosten und $3n$ Latten. Ein Zaun hat 46 Pfosten. Wie viele Felder und Latten hat er?',
    [r'45 Felder, 135 Latten', r'46 Felder, 138 Latten', r'45 Felder, 138 Latten', r'47 Felder, 141 Latten'],
    [r'$n + 1 = 46$, also $n = 45$ Felder.',
     r'Latten: $3 \cdot 45 = 135$'])


def check():
    import sympy as sp
    from fractions import Fraction as F
    x, y, a, b = sp.symbols('x y a b')
    eq = lambda u, v: sp.expand(u - v) == 0
    s = lambda l, r: sp.solve(sp.Eq(l, r), x)
    assert 4 - 2 * (-3) == 10
    assert F(3 * 2 - (-4), 2) == 5
    assert eq(2*x - 5*y - 7*x + 2*y, -5*x - 3*y)
    assert eq(8 - (3 - 2*x), 5 + 2*x)
    assert eq(4*(3*x - 2) - 5*x, 7*x - 8)
    assert eq(5*b*(3*a + 2), 15*a*b + 10*b)
    assert s(6*x - 4, 2*x + 12) == [4]
    assert s(5*(x + 2), 3*x - 4) == [-7]
    assert s(x / 2 - 3, 4) == [14]
    assert s(4*x + 7, 4*x - 1) == []
    assert s(2 - 3*x, x + 14) == [-3]
    assert F(360, 24) == 15 and 360 * 24 == 8640
    assert eq((sp.Symbol('u') - 2*b) / 2, sp.Symbol('u') / 2 - b)
    assert F(100 * 30, F('2.5')) == 1200 and F(30) * F('2.5') == 75
    assert s(3*(x - 12), 15) == [17]
    assert s(480 + 65*x, 2105) == [25] and int(2105 / 65) == 32
    al = sp.solve(sp.Eq(x + 2*x + x + 20, 180), x)[0]
    assert al == 40 and 2 * al == 80 and al + 20 == 60
    assert s(5 - 2*x, 11) == [-3] and 5 - 2 * 3 == -1
    assert 46 - 1 == 45 and 3 * 45 == 135


Q.verify(check)
Q.save()
