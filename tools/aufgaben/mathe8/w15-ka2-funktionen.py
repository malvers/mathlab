#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 15 / KW 50: Vorbereitung Klassenarbeit 2
(LB 2 lineare Funktionen und Gleichungssysteme). Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=15, slug='ka2-funktionen', thema='Vorbereitung Klassenarbeit 2: Funktionen und Gleichungssysteme', lb='KA 2',
        blurb='gemischte Wiederholung zu Funktionen, linearen Funktionen, Nullstellen und Gleichungssystemen',
        comment='Mixed review of LB 2: function concept (1-3, 20), linear functions (4-10, 18-19), zeros (6, 17), systems (11-16).')

# ------------------------------------------------------------ Funktionsbegriff ----
Q.q(r'Welche Zuordnung ist keine Funktion?',
    [r'Jeder positiven Zahl werden die Zahlen zugeordnet, deren Quadrat sie ist, z. B. 9 → 3 und −3.',
     r'Jeder Zahl wird ihr Quadrat zugeordnet.',
     r'Jeder Person wird ihre Körpergröße zugeordnet.',
     r'Jeder Zahl wird die Zahl 5 zugeordnet.'],
    [r'Bei einer Funktion gehört zu jedem Argument genau ein Wert.',
     r'Der Zahl 9 werden aber zwei Zahlen zugeordnet, 3 und −3.',
     r'Die konstante Zuordnung ist eine Funktion, auch wenn alle Werte gleich sind.'])

Q.q(r'Berechne $f(-3)$ für $f(x) = -x + 4$.',
    [r'7', r'1', r'−7', r'−1'],
    [r'$f(-3) = -(-3) + 4$',
     r'$= 3 + 4 = 7$'])

Q.q(r'Welche Zahl gehört nicht zum Definitionsbereich von $f(x) = \dfrac{1}{x - 2}$?',
    [r'2', r'0', r'−2', r'1'],
    [r'Der Nenner darf nicht 0 werden.',
     r'$x - 2 = 0$ für $x = 2$.'])

# ------------------------------------------------------- lineare Funktionen ----
Q.q(r'Welche Steigung und welchen $y$-Achsenabschnitt hat $y = -0{,}5x + 3$?',
    [r'$m = -0{,}5$, $n = 3$', r'$m = 3$, $n = -0{,}5$', r'$m = 0{,}5$, $n = 3$', r'$m = -0{,}5$, $n = -3$'],
    [r'$y = m \cdot x + n$: $m$ steht vor $x$, $n$ ist das Absolutglied.'])

Q.q(r'Eine Gerade schneidet die $y$-Achse in $(0 \mid -1)$ und hat die Steigung 2. Wie lautet ihre Gleichung?',
    [r'$y = 2x - 1$', r'$y = -x + 2$', r'$y = 2x + 1$', r'$y = -2x - 1$'],
    [r'$m = 2$, $n = -1$',
     r'$y = 2x - 1$'])

Q.q(r'Berechne die Nullstelle von $y = 3x + 9$.',
    [r'$x = -3$', r'$x = 3$', r'$x = 9$', r'$x = -27$'],
    [r'$3x + 9 = 0$',
     r'$3x = -9$, also $x = -3$.'])

Q.q(r'Eine Gerade geht durch $A(2 \mid 1)$ und $B(6 \mid 3)$. Wie lautet ihre Gleichung?',
    [r'$y = 0{,}5x$', r'$y = 2x - 3$', r'$y = 0{,}5x + 1$', r'$y = 0{,}5x - 1$'],
    [r'$m = \dfrac{3 - 1}{6 - 2} = \dfrac{2}{4} = 0{,}5$',
     r'$A$ einsetzen: $1 = 0{,}5 \cdot 2 + n$, also $n = 0$.',
     r'$y = 0{,}5x$, die Gerade geht durch den Ursprung.'])

Q.q(r'Welche Gerade ist parallel zu $y = -x + 2$ und schneidet die $y$-Achse bei 5?',
    [r'$y = -x + 5$', r'$y = x + 5$', r'$y = 5x + 2$', r'$y = -5x + 2$'],
    [r'Parallel: gleiche Steigung $m = -1$.',
     r'$y$-Achsenabschnitt $n = 5$: $y = -x + 5$.'])

Q.q(r'Welcher Punkt liegt auf der Geraden $y = 1{,}5x - 2$?',
    [r'$(4 \mid 4)$', r'$(2 \mid 2)$', r'$(0 \mid 2)$', r'$(-2 \mid 1)$'],
    [r'$x = 4$: $y = 6 - 2 = 4$ passt.',
     r'$x = 2$: $y = 1$; $x = 0$: $y = -2$; $x = -2$: $y = -5$.'])

Q.q(r'Ist die Funktion $y = -\dfrac{2}{3}x + 1$ steigend oder fallend?',
    [r'fallend, weil $m < 0$ ist', r'steigend, weil $n > 0$ ist', r'steigend, weil $\dfrac{2}{3} > 0$ ist', r'weder noch, weil $m$ ein Bruch ist'],
    [r'Ob eine Gerade steigt oder fällt, entscheidet das Vorzeichen von $m$.',
     r'$m = -\dfrac{2}{3}$ ist negativ: fallend.'])

# ------------------------------------------------------- Gleichungssysteme ----
Q.q(r'Löse: $y = 3x - 4$ und $y = x + 2$.',
    [r'$x = 3$, $y = 5$', r'$x = 5$, $y = 3$', r'$x = 1$, $y = 3$', r'$x = -1$, $y = 1$'],
    [r'Gleichsetzen: $3x - 4 = x + 2$',
     r'$2x = 6$, $x = 3$',
     r'$y = 3 + 2 = 5$'])

Q.q(r'Löse: $y = 2x$ und $3x + y = 25$.',
    [r'$x = 5$, $y = 10$', r'$x = 10$, $y = 5$', r'$x = 5$, $y = 2{,}5$', r'$x = 25$, $y = 50$'],
    [r'Einsetzen: $3x + 2x = 25$',
     r'$5x = 25$, $x = 5$, $y = 10$'])

Q.q(r'Löse: $x + 2y = 9$ und $x - 2y = 1$.',
    [r'$x = 5$, $y = 2$', r'$x = 2$, $y = 5$', r'$x = 4$, $y = 2{,}5$', r'$x = 10$, $y = 4$'],
    [r'Addieren: $2x = 10$, also $x = 5$.',
     r'$5 + 2y = 9$, also $y = 2$.'])

Q.q(r'Wie viele Lösungen hat das System $y = -2x + 1$ und $4x + 2y = 2$?',
    [r'unendlich viele', r'keine', r'genau eine', r'genau zwei'],
    [r'Zweite Gleichung: $2y = -4x + 2$, also $y = -2x + 1$.',
     r'Beide Gleichungen beschreiben dieselbe Gerade.'])

Q.q(r'Für einen Ausflug werden 12 Karten gekauft: Erwachsene zahlen 9 €, ermäßigt 6 €, zusammen 87 €. Wie viele Erwachsenenkarten sind es?',
    [r'5', r'7', r'6', r'4'],
    [r'$e + r = 12$ und $9e + 6r = 87$',
     r'$r = 12 - e$ einsetzen: $9e + 72 - 6e = 87$',
     r'$3e = 15$, $e = 5$ und $r = 7$'])

Q.q(r'Tarif A: 5 € im Monat plus 0,10 € pro SMS. Tarif B: 0,30 € pro SMS. Bei wie vielen SMS kosten beide gleich viel?',
    [r'bei 25 SMS', r'bei 50 SMS', r'bei 12,5 SMS', r'bei 17 SMS'],
    [r'$5 + 0{,}10x = 0{,}30x$',
     r'$5 = 0{,}20x$, also $x = 25$.'])

Q.q(r'In einer Badewanne sind 150 Liter, pro Minute fließen 15 Liter ab: $V = 150 - 15t$. Nach wie vielen Minuten ist sie leer?',
    [r'nach 10 Minuten', r'nach 15 Minuten', r'nach 135 Minuten', r'nach 2250 Minuten'],
    [r'Leer: $150 - 15t = 0$',
     r'$t = 10$'])

Q.q(r'Eine lineare Funktion hat die Wertetabelle x: 0, 2, 4 und y: 3, 7, 11. Wie lautet die Gleichung?',
    [r'$y = 2x + 3$', r'$y = 3x + 2$', r'$y = 4x + 3$', r'$y = 2x + 7$'],
    [r'Für $x = 0$ ist $y = 3$, also $n = 3$.',
     r'Pro 2 Schritte in $x$ wächst $y$ um 4: $m = \dfrac{4}{2} = 2$.',
     r'$y = 2x + 3$'])

Q.q(r'Die monatlichen Stromkosten sind $y = 0{,}25x + 12$ (in €, $x$ in kWh). Was bedeutet die Zahl 12?',
    [r'eine feste Grundgebühr von 12 € pro Monat', r'der Preis pro kWh', r'die Anzahl der Monate', r'der Verbrauch in kWh'],
    [r'12 ist der $y$-Achsenabschnitt: Auch bei 0 kWh zahlt man 12 €.',
     r'0,25 € ist der Preis pro kWh.'])

Q.q(r'Die Funktion $y = 2x + 1$ hat den Definitionsbereich {0; 1; 2; 3}. Wie lautet der Wertebereich?',
    [r'{1; 3; 5; 7}', r'{0; 1; 2; 3}', r'{2; 4; 6; 8}', r'{1; 2; 3; 4}'],
    [r'Alle Argumente einsetzen: $f(0) = 1$, $f(1) = 3$, $f(2) = 5$, $f(3) = 7$.',
     r'Wertebereich: {1; 3; 5; 7}'])


def check():
    import sympy as sp
    x, y = sp.symbols('x y')
    one = lambda a, b, sx, sy: sp.solve((a, b), (x, y), dict=True) == [{x: sx, y: sy}]
    assert -(-3) + 4 == 7
    assert sp.solve(x - 2, x) == [2]
    assert sp.solve(3*x + 9, x) == [-3]
    assert sp.Rational(3 - 1, 6 - 2) == sp.Rational(1, 2) and 1 - sp.Rational(1, 2) * 2 == 0
    f = lambda v: sp.Rational(3, 2) * v - 2
    assert f(4) == 4 and f(2) == 1 and f(0) == -2 and f(-2) == -5
    assert one(y - 3*x + 4, y - x - 2, 3, 5)
    assert one(y - 2*x, 3*x + y - 25, 5, 10)
    assert one(x + 2*y - 9, x - 2*y - 1, 5, 2)
    assert sp.solve(y + 2*x - 1, y) == sp.solve(4*x + 2*y - 2, y)
    assert one(x + y - 12, 9*x + 6*y - 87, 5, 7)
    assert sp.solve(5 + x / 10 - 3 * x / 10, x) == [25]
    assert sp.solve(150 - 15*x, x) == [10]
    assert [2 * v + 3 for v in (0, 2, 4)] == [3, 7, 11]
    assert [2 * v + 1 for v in (0, 1, 2, 3)] == [1, 3, 5, 7]


Q.verify(check)
Q.save()
