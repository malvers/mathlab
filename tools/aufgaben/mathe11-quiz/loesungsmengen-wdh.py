#!/usr/bin/env python3
r"""Aufgaben Mathe 11 (BGY), KW 48: Wiederholung Lösungsmengen - keine, eine, unendlich viele Lösungen.

Doc, 23.11.2026: "Mach bitte 20 Aufgaben zu Lösungsmengen heute für Mathe und bau sie ein." - the revision
noted on 16.11. (how to write a solution set and how to find out which case it is). Same notation as the deck
decks/mathe11-loesungsmengen.html and the Vorrechnen block js/vorrechnen-aufgaben-loesungsmengen-wdh.js:
L = \{\} for none, L = \mathbb{R} for all, pairs (x \mid y), several numbers by ";" in the order of size,
D = \mathbb{R} \setminus \{...\}. New equations only - none of the deck's or the Vorrechnen block's examples.
AFB I 1-10, II 11-16, III 17-20 (50/30/20, reference_afb_schluessel_mathe). No calculator: small numbers.
Plan: HTML/svp/mathe/mathe11.html, week 13 (KW 48), material "Lösungsmengen (20)" (DB, tools/svp-material.py).
Copied from ka1-vertiefung.py (exercise sheet).

    python3 tools/aufgaben/mathe11-quiz/loesungsmengen-wdh.py
"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
from fractions import Fraction as F
import sympy as sp
from quiz import Quiz

Q = Quiz(id='mathe11-w13-loesungsmengen-wdh',
         file='mathetest11-loesungsmengen-wdh.html',
         title='Aufgaben · Lösungsmengen · Wiederholung',
         subtitle='Berufliches Gymnasium · Klasse 11 · Woche 13, KW 48 · 20 Aufgaben zur Lösungsmenge: '
                  'keine, eine, unendlich viele Lösungen — lineare und quadratische Gleichungen, Bruch- und '
                  'Wurzelgleichungen, LGS, Sachaufgaben · genau eine Antwort pro Aufgabe',
         dash_sub='BGY · Klasse 11 · KW 48 · Lösungsmengen · Live-Auswertung: anonyme Einzelscores '
                  '+ Gruppenleistung pro Aufgabe',
         back='svp/mathe/mathe11.html',
         comment='AFB I 1-10 (linear, Schreibweise, quadratisch), AFB II 11-16 (Diskriminante, '
                 'Bruchgleichungen mit D, LGS mit Sachbezug), AFB III 17-20 (Wurzelgleichung mit Probe, '
                 'Rechteck, Parameter c, Parameter a im LGS).')

# ================================================================ AFB I ====
# 1 - linear, one solution
Q.q(r'Gib die Lösungsmenge an: $5x - 4 = 2x + 11$',
    [r'$L = \{5\}$', r'$L = \{\dfrac{7}{3}\}$', r'$L = \{-5\}$', r'$L = \{15\}$'],
    [r'$5x - 4 = 2x + 11 \quad | -2x$',
     r'$3x - 4 = 11 \quad | +4$',
     r'$3x = 15 \quad | :3$',
     r'$x = 5$, also $L = \{5\}$',
     r'Falle: $\dfrac{7}{3}$ entsteht, wenn die $-4$ ohne Vorzeichenwechsel nach rechts wandert ($3x = 11 - 4$).'])

# 2 - linear, none
Q.q(r'Gib die Lösungsmenge an: $4(x - 1) = 4x + 3$',
    [r'$L = \{\}$', r'$L = \mathbb{R}$', r'$L = \{0\}$', r'$L = \{-1\}$'],
    [r'Ausmultiplizieren: $4x - 4 = 4x + 3 \quad | -4x$',
     r'$-4 = 3$ — eine falsche Aussage, ganz egal, welches $x$ man einsetzt.',
     r'Keine Zahl erfüllt die Gleichung: $L = \{\}$',
     r'Falle: $L = \{0\}$ ist die Menge mit der Zahl $0$ — und die ist keine Lösung: $4 \cdot (0 - 1) = -4 \neq 3$.'])

# 3 - linear, identity
Q.q(r'Gib die Lösungsmenge an: $2(x + 3) - x = x + 6$',
    [r'$L = \mathbb{R}$', r'$L = \{\}$', r'$L = \{0\}$', r'$L = \{6\}$'],
    [r'Ausmultiplizieren: $2x + 6 - x = x + 6$',
     r'Zusammenfassen: $x + 6 = x + 6 \quad | -x$',
     r'$6 = 6$ — eine wahre Aussage für jedes $x$: $L = \mathbb{R}$',
     r'Probe mit irgendeiner Zahl, etwa $x = 5$: $2 \cdot 8 - 5 = 11$ und $5 + 6 = 11$.'])

# 4 - notation
Q.q(r'Eine Gleichung hat die Lösungen $x_1 = 2$ und $x_2 = -3$. Welche Schreibweise der Lösungsmenge ist richtig?',
    [r'$L = \{-3;\ 2\}$', r'$L = \{-3{,}2\}$', r'$L = \{(-3 \mid 2)\}$', r'$L = (-3;\ 2)$'],
    [r'Eine Menge steht in geschweiften Klammern, die Elemente der Größe nach, getrennt durch ein Semikolon: $L = \{-3;\ 2\}$',
     r'Das Komma ist das Dezimalzeichen: $\{-3{,}2\}$ enthält nur die eine Zahl $-3{,}2$.',
     r'$(-3 \mid 2)$ ist ein Zahlenpaar — so schreibt man die Lösung eines LGS mit zwei Variablen. Runde Klammern allein sind keine Menge.'])

# 5 - x^2 = c
Q.q(r'Gib die Lösungsmenge an: $2x^2 - 72 = 0$',
    [r'$L = \{-6;\ 6\}$', r'$L = \{6\}$', r'$L = \{-36;\ 36\}$', r'$L = \{\}$'],
    [r'$2x^2 - 72 = 0 \quad | +72$',
     r'$2x^2 = 72 \quad | :2$',
     r'$x^2 = 36$, die Wurzel hat zwei Vorzeichen: $x = -6$ oder $x = 6$',
     r'$L = \{-6;\ 6\}$. Falle: das Minus vergessen oder die Wurzel nicht gezogen.'])

# 6 - x^2 = negative
Q.q(r'Gib die Lösungsmenge an: $3x^2 + 12 = 0$',
    [r'$L = \{\}$', r'$L = \{-2;\ 2\}$', r'$L = \{-2\}$', r'$L = \{0\}$'],
    [r'$3x^2 + 12 = 0 \quad | -12$',
     r'$3x^2 = -12 \quad | :3$',
     r'$x^2 = -4$ — ein Quadrat ist nie negativ, es gibt keine reelle Lösung: $L = \{\}$',
     r'Falle: $\{-2;\ 2\}$. Die Probe zeigt es: $3 \cdot 4 + 12 = 24 \neq 0$.'])

# 7 - factoring out
Q.q(r'Gib die Lösungsmenge an: $x^2 + 6x = 0$',
    [r'$L = \{-6;\ 0\}$', r'$L = \{-6\}$', r'$L = \{0;\ 6\}$', r'$L = \{6\}$'],
    [r'Kein absolutes Glied, also $x$ ausklammern: $x(x + 6) = 0$',
     r'Ein Produkt ist null, wenn ein Faktor null ist: $x = 0$ oder $x + 6 = 0$, also $x = -6$',
     r'Der Größe nach: $L = \{-6;\ 0\}$',
     r'Falle: durch $x$ teilen. Dann geht die Lösung $x = 0$ verloren und es bleibt nur $\{-6\}$.'])

# 8 - product form
Q.q(r'Gib die Lösungsmenge an: $(x + 4)(2x - 6) = 0$',
    [r'$L = \{-4;\ 3\}$', r'$L = \{-3;\ 4\}$', r'$L = \{-4;\ 6\}$', r'$L = \{3\}$'],
    [r'Satz vom Nullprodukt, nicht ausmultiplizieren: $x + 4 = 0$ oder $2x - 6 = 0$',
     r'$x = -4$ oder $2x = 6$, also $x = 3$',
     r'$L = \{-4;\ 3\}$',
     r'Falle: $\{-4;\ 6\}$ — bei $2x - 6 = 0$ nicht durch $2$ geteilt. $\{-3;\ 4\}$ — die Vorzeichen gedreht.'])

# 9 - pq formula, two solutions
Q.q(r'Gib die Lösungsmenge an: $x^2 - 2x - 15 = 0$',
    [r'$L = \{-3;\ 5\}$', r'$L = \{-5;\ 3\}$', r'$L = \{5\}$', r'$L = \{\}$'],
    [r'Normalform mit $p = -2$ und $q = -15$',
     r'$x_{1,2} = 1 \pm \sqrt{1 + 15} = 1 \pm 4$',
     r'$x_1 = 5$ und $x_2 = -3$, also $L = \{-3;\ 5\}$',
     r'Probe mit Vieta: $5 + (-3) = 2 = -p$ und $5 \cdot (-3) = -15 = q$'])

# 10 - double solution
Q.q(r'Gib die Lösungsmenge an: $x^2 + 10x + 25 = 0$',
    [r'$L = \{-5\}$', r'$L = \{-5;\ 5\}$', r'$L = \{5\}$', r'$L = \{\}$'],
    [r'pq-Formel: $x_{1,2} = -5 \pm \sqrt{25 - 25} = -5 \pm 0$',
     r'Unter der Wurzel steht null: es gibt genau eine Lösung, $x = -5$',
     r'Schneller mit der binomischen Formel: $x^2 + 10x + 25 = (x + 5)^2$',
     r'$L = \{-5\}$ — die doppelte Lösung steht nur einmal in der Menge.'])

# =============================================================== AFB II ====
# 11 - normalise first, then the discriminant: none
Q.q(r'Wie viele Lösungen hat $2x^2 - 8x + 14 = 0$, und wie lautet die Lösungsmenge?',
    [r'keine: $L = \{\}$', r'eine: $L = \{2\}$', r'zwei: $L = \{4 - \sqrt{2};\ 4 + \sqrt{2}\}$',
     r'unendlich viele: $L = \mathbb{R}$'],
    [r'Erst durch $2$ teilen: $x^2 - 4x + 7 = 0$',
     r'Diskriminante: $D = \left(\dfrac{p}{2}\right)^2 - q = 4 - 7 = -3$',
     r'$D < 0$: keine reelle Lösung, $L = \{\}$',
     r'Falle: ohne Teilen setzt man $p = -8$ und $q = 14$ ein und erhält $4 \pm \sqrt{2}$. Die pq-Formel gilt nur für die Normalform.'])

# 12 - fraction equation with domain
Q.q(r'Gib den Definitionsbereich und die Lösungsmenge an: $\dfrac{x + 3}{x - 2} = 2$',
    [r'$D = \mathbb{R} \setminus \{2\},\ L = \{7\}$', r'$D = \mathbb{R} \setminus \{-3\},\ L = \{7\}$',
     r'$D = \mathbb{R} \setminus \{2\},\ L = \{5\}$', r'$D = \mathbb{R},\ L = \{7\}$'],
    [r'Der Nenner darf nicht null werden: $x - 2 \neq 0$, also $D = \mathbb{R} \setminus \{2\}$',
     r'$\dfrac{x + 3}{x - 2} = 2 \quad | \cdot (x - 2)$',
     r'$x + 3 = 2x - 4 \quad | -x + 4$',
     r'$7 = x$, und $7 \in D$. Probe: $\dfrac{10}{5} = 2$. Also $L = \{7\}$',
     r'Falle: $2(x - 2) = 2x - 2$ gerechnet, das führt auf $x = 5$.'])

# 13 - fraction equation, the only candidate is excluded
Q.q(r'Gib die Lösungsmenge an: $\dfrac{2x}{x + 1} = \dfrac{x - 1}{x + 1}$',
    [r'$L = \{\}$', r'$L = \{-1\}$', r'$L = \{1\}$', r'$L = \mathbb{R} \setminus \{-1\}$'],
    [r'Zuerst der Definitionsbereich: $x + 1 \neq 0$, also $D = \mathbb{R} \setminus \{-1\}$',
     r'$\dfrac{2x}{x + 1} = \dfrac{x - 1}{x + 1} \quad | \cdot (x + 1)$',
     r'$2x = x - 1 \quad | -x$',
     r'$x = -1$ — aber $-1 \notin D$, dort wäre der Nenner null. Der einzige Kandidat fällt weg: $L = \{\}$',
     r'Falle: $L = \{-1\}$ ohne Blick auf $D$. Die Probe scheitert: $\dfrac{-2}{0}$ ist nicht definiert.'])

# 14 - word problem, LGS with one pair
Q.q(r'Im Kino zahlen 2 Erwachsene und 1 Kind zusammen 31 €, 1 Erwachsener und 1 Kind zusammen 19 €. '
    r'Mit $x$ für den Preis einer Erwachsenenkarte und $y$ für eine Kinderkarte (in €) entsteht ein LGS. '
    r'Welche Lösungsmenge hat es?',
    [r'$L = \{(12 \mid 7)\}$', r'$L = \{(7 \mid 12)\}$', r'$L = \{7;\ 12\}$', r'$L = \{(10 \mid 9)\}$'],
    [r'$\text{I}: 2x + y = 31$ und $\text{II}: x + y = 19$',
     r'$\text{I} - \text{II}$: $x = 12$',
     r'In II einsetzen: $12 + y = 19$, also $y = 7$',
     r'$L = \{(12 \mid 7)\}$: die Erwachsenenkarte kostet 12 €, die Kinderkarte 7 €. Probe: $2 \cdot 12 + 7 = 31$',
     r'Falle: $\{7;\ 12\}$ sind zwei einzelne Zahlen — die Lösung eines LGS ist ein Zahlenpaar $(x \mid y)$.'])

# 15 - word problem, parallel lines: none
Q.q(r'Tarif A kostet 5 € Grundgebühr und 2 € pro Stunde, Tarif B 8 € Grundgebühr und ebenfalls 2 € pro Stunde. '
    r'Für $x$ Stunden gilt also $y = 2x + 5$ (A) und $y = 2x + 8$ (B). Welche Lösungsmenge hat das LGS aus beiden Gleichungen?',
    [r'$L = \{\}$', r'$L = \{(0 \mid 5)\}$', r'$L = \{(1{,}5 \mid 8)\}$',
     r'$L = \{(t \mid 2t + 5)\},\ t \in \mathbb{R}$'],
    [r'Gleichsetzen: $2x + 5 = 2x + 8 \quad | -2x$',
     r'$5 = 8$ — eine falsche Aussage: $L = \{\}$',
     r'Die beiden Geraden haben dieselbe Steigung $2$, aber verschiedene Achsenabschnitte: sie sind parallel und schneiden sich nie.',
     r'Im Sachzusammenhang: die beiden Tarife kosten nie gleich viel, B ist immer genau 3 € teurer.'])

# 16 - LGS, infinitely many
Q.q(r'Gib die Lösungsmenge an: $\begin{cases} x + 3y = 4 \\ 2x + 6y = 8 \end{cases}$',
    [r'$L = \{(4 - 3t \mid t)\},\ t \in \mathbb{R}$', r'$L = \{(1 \mid 1)\}$', r'$L = \{\}$', r'$L = \mathbb{R}$'],
    [r'$\text{II} - 2 \cdot \text{I}$: $0 = 0$ — eine wahre Aussage, II ist nur das Doppelte von I.',
     r'Es bleibt eine Gleichung für zwei Unbekannte: $y = t$ frei wählen, aus I folgt $x = 4 - 3t$',
     r'$L = \{(4 - 3t \mid t)\},\ t \in \mathbb{R}$ — unendlich viele Lösungen.',
     r'Falle: $(1 \mid 1)$ ist zwar eine Lösung (für $t = 1$), aber nicht alle. $L = \mathbb{R}$ passt nicht, die Lösungen sind Zahlenpaare.'])

# ============================================================== AFB III ====
# 17 - root equation, the Probe throws out a candidate
Q.q(r'Gib die Lösungsmenge an: $\sqrt{x + 7} = x + 1$',
    [r'$L = \{2\}$', r'$L = \{-3;\ 2\}$', r'$L = \{-3\}$', r'$L = \{\}$'],
    [r'$\sqrt{x + 7} = x + 1 \quad | (\ )^2$',
     r'$x + 7 = x^2 + 2x + 1 \quad | -x - 7$',
     r'$0 = x^2 + x - 6$, pq-Formel: $x_{1,2} = -\dfrac{1}{2} \pm \sqrt{\dfrac{1}{4} + 6} = -\dfrac{1}{2} \pm \dfrac{5}{2}$, also $x_1 = 2$ und $x_2 = -3$',
     r'Probe: $x = 2$ gibt $\sqrt{9} = 3$ und $2 + 1 = 3$, stimmt. $x = -3$ gibt $\sqrt{4} = 2$, aber $-3 + 1 = -2$, falsch.',
     r'Quadrieren ist keine Äquivalenzumformung — nur die Probe zeigt, was bleibt: $L = \{2\}$'])

# 18 - word problem, rectangle: L in R and the answer in context
Q.q(r'Ein Rechteck ist 3 cm länger als breit und hat den Flächeninhalt 40 cm². Stelle eine Gleichung für die Breite $b$ (in cm) auf. '
    r'Welche Lösungsmenge hat sie in $\mathbb{R}$, und wie breit ist das Rechteck?',
    [r'$L = \{-8;\ 5\}$, Breite 5 cm', r'$L = \{-5;\ 8\}$, Breite 8 cm', r'$L = \{5\}$, Breite 5 cm',
     r'$L = \{-8;\ 5\}$, Breite −8 cm oder 5 cm'],
    [r'Die Länge ist $b + 3$, die Fläche: $b(b + 3) = 40$, also $b^2 + 3b - 40 = 0$',
     r'pq-Formel: $b_{1,2} = -\dfrac{3}{2} \pm \sqrt{\dfrac{9}{4} + 40} = -\dfrac{3}{2} \pm \dfrac{13}{2}$, also $b_1 = 5$ und $b_2 = -8$',
     r'In $\mathbb{R}$ hat die Gleichung beide Lösungen: $L = \{-8;\ 5\}$',
     r'Eine Breite ist aber positiv: das Rechteck ist 5 cm breit und 8 cm lang. Probe: $5 \cdot 8 = 40$'])

# 19 - parameter c: exactly one solution
Q.q(r'Für welchen Wert von $c$ hat $x^2 + 8x + c = 0$ genau eine Lösung, und wie lautet dann die Lösungsmenge?',
    [r'$c = 16,\ L = \{-4\}$', r'$c = 16,\ L = \{4\}$', r'$c = 64,\ L = \{-8\}$', r'$c = 0,\ L = \{-8;\ 0\}$'],
    [r'Genau eine Lösung gibt es, wenn die Diskriminante null ist: $D = \left(\dfrac{8}{2}\right)^2 - c = 16 - c$',
     r'$16 - c = 0$, also $c = 16$',
     r'Dann ist $x^2 + 8x + 16 = (x + 4)^2 = 0$, also $L = \{-4\}$',
     r'Für $c < 16$ gibt es zwei Lösungen (etwa $c = 0$: $L = \{-8;\ 0\}$), für $c > 16$ keine. Falle: $c = 64$ mit $p^2$ statt $\left(\dfrac{p}{2}\right)^2$.'])

# 20 - parameter a in a system: infinitely many
Q.q(r'Für welchen Wert von $a$ hat das LGS $\begin{cases} x - 3y = 2 \\ 2x + ay = 4 \end{cases}$ unendlich viele Lösungen, und wie lautet dann die Lösungsmenge?',
    [r'$a = -6,\ L = \{(2 + 3t \mid t)\},\ t \in \mathbb{R}$', r'$a = 6,\ L = \{(2 + 3t \mid t)\},\ t \in \mathbb{R}$',
     r'$a = -6,\ L = \{\}$', r'$a = -3,\ L = \{(2 \mid 0)\}$'],
    [r'Unendlich viele Lösungen gibt es, wenn II ein Vielfaches von I ist.',
     r'$2 \cdot \text{I}$: $2x - 6y = 4$ — das ist genau II, wenn $a = -6$',
     r'Dann gibt $\text{II} - 2 \cdot \text{I}$: $0 = 0$. Mit $y = t$ folgt $x = 2 + 3t$: $L = \{(2 + 3t \mid t)\},\ t \in \mathbb{R}$',
     r'Für jedes andere $a$ gibt $\text{II} - 2 \cdot \text{I}$: $(a + 6)y = 0$, also $y = 0$ und $x = 2$ — genau eine Lösung, $L = \{(2 \mid 0)\}$.'])


# ---------------------------------------------------------- numbers check ----
def check():
    x, y, t, a, c, b = sp.symbols('x y t a c b')
    R = sp.S.Reals

    def L(lhs, rhs=0):
        return sp.solveset(sp.Eq(lhs, rhs), x, R)

    def fs(*v):
        return sp.FiniteSet(*v)

    # 1
    assert L(5 * x - 4, 2 * x + 11) == fs(5)
    assert 11 - 4 == 7 and 5 * 3 == 15                       # distractors 7/3 and 15
    # 2
    assert L(4 * (x - 1), 4 * x + 3) == sp.S.EmptySet
    assert sp.expand(4 * (x - 1) - 4 * x) == -4 and 4 * (0 - 1) == -4
    # 3
    assert L(2 * (x + 3) - x, x + 6) == R
    assert 2 * 8 - 5 == 11 == 5 + 6
    # 4 - notation only: the two solutions
    assert sorted([2, -3]) == [-3, 2]
    # 5
    assert L(2 * x ** 2 - 72) == fs(-6, 6) and F(72, 2) == 36
    # 6
    assert L(3 * x ** 2 + 12) == sp.S.EmptySet and 3 * 4 + 12 == 24
    # 7
    assert L(x ** 2 + 6 * x) == fs(-6, 0) and sp.expand(x * (x + 6)) == x ** 2 + 6 * x
    # 8
    assert L((x + 4) * (2 * x - 6)) == fs(-4, 3)
    # 9
    assert L(x ** 2 - 2 * x - 15) == fs(-3, 5) and 1 + 15 == 16
    assert 5 + (-3) == 2 and 5 * (-3) == -15
    # 10
    assert L(x ** 2 + 10 * x + 25) == fs(-5) and sp.expand((x + 5) ** 2) == x ** 2 + 10 * x + 25
    # 11
    assert L(2 * x ** 2 - 8 * x + 14) == sp.S.EmptySet
    assert F(-4, 2) ** 2 - 7 == -3
    assert sp.solveset(x ** 2 - 8 * x + 14, x, R) == fs(4 - sp.sqrt(2), 4 + sp.sqrt(2))   # the slip
    # 12
    assert L((x + 3) / (x - 2), 2) == fs(7) and F(10, 5) == 2
    assert sp.solveset(x + 3 - (2 * x - 2), x, R) == fs(5)    # slip 2(x-2) = 2x-2
    # 13
    assert L(2 * x / (x + 1), (x - 1) / (x + 1)) == sp.S.EmptySet
    assert sp.solveset(2 * x - (x - 1), x, R) == fs(-1)       # the candidate, excluded by D
    # 14
    s14 = sp.linsolve([2 * x + y - 31, x + y - 19], x, y)
    assert s14 == sp.FiniteSet((12, 7)) and 2 * 12 + 7 == 31
    assert 2 * 7 + 12 != 31 and 2 * 10 + 9 != 31             # (7|12), (10|9) wrong
    # 15
    assert sp.linsolve([y - 2 * x - 5, y - 2 * x - 8], x, y) == sp.S.EmptySet
    assert (2 * 0 + 8) - (2 * 0 + 5) == 3
    # 16
    s16 = sp.linsolve([x + 3 * y - 4, 2 * x + 6 * y - 8], x, y)
    assert s16 == sp.FiniteSet((4 - 3 * y, y))
    assert 1 + 3 * 1 == 4                                     # (1|1) is one of them (t = 1)
    # 17
    assert sp.solveset(sp.sqrt(x + 7) - (x + 1), x, R) == fs(2)
    assert sp.solveset(x ** 2 + x - 6, x, R) == fs(-3, 2)
    assert F(1, 4) + 6 == F(25, 4) and sp.sqrt(4) == 2 and -3 + 1 == -2 and sp.sqrt(9) == 3
    # 18
    assert sp.solveset(b * (b + 3) - 40, b, R) == fs(-8, 5)
    assert F(9, 4) + 40 == F(169, 4) and sp.sqrt(F(169, 4)) == F(13, 2) and 5 * 8 == 40
    # 19
    disc = sp.discriminant(x ** 2 + 8 * x + c, x)            # = 64 - 4c, zero for c = 16
    assert sp.solve(disc, c) == [16]
    assert L(x ** 2 + 8 * x + 16) == fs(-4)
    assert L(x ** 2 + 8 * x + 64) == sp.S.EmptySet             # c = 64: none, not one
    assert L(x ** 2 + 8 * x) == fs(-8, 0)
    # 20
    M = sp.Matrix([[1, -3], [2, a]])
    assert sp.solve(M.det(), a) == [-6]                        # singular only for a = -6
    assert sp.linsolve([x - 3 * y - 2, 2 * x - 6 * y - 4], x, y) == sp.FiniteSet((3 * y + 2, y))
    assert sp.linsolve([x - 3 * y - 2, 2 * x + 6 * y - 4], x, y) == sp.FiniteSet((2, 0))       # a = 6
    assert sp.linsolve([x - 3 * y - 2, 2 * x - 3 * y - 4], x, y) == sp.FiniteSet((2, 0))       # a = -3
    for av in range(-12, 13):
        if av != -6:
            assert sp.linsolve([x - 3 * y - 2, 2 * x + av * y - 4], x, y) == sp.FiniteSet((2, 0))
    # every question: the correct option differs from all distractors (builder also checks text)
    assert len(Q.questions) == 20


Q.verify(check)
Q.save()
