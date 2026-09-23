#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 9 / KW 44 (LB 1): Bruchgleichungen, die auf lineare
Gleichungen fuehren - Definitionsbereich, Hauptnenner, Scheinloesungen.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=9, slug='bruchgleichungen', thema='Bruchgleichungen', lb='LB 1',
          blurb='Definitionsbereich, Lösen über den Hauptnenner, Scheinlösungen, Anwendungen',
          comment='Blocks: Definitionsbereich (1-5), Loesen (6-13), Scheinloesungen (14-17), Anwendungen (18-20).')

# ----------------------------------------------------- Definitionsbereich ----
Q.q(r'Wie lautet der Definitionsbereich von $\dfrac{1}{x - 4} = 2$?',
    [r'$D = \mathbb{R} \setminus \{4\}$', r'$D = \mathbb{R} \setminus \{-4\}$',
     r'$D = \mathbb{R}$', r'$D = \mathbb{R} \setminus \{0\}$'],
    [r'Der Nenner darf nicht null werden: $x - 4 \neq 0$.',
     r'Also ist $x = 4$ ausgeschlossen.',
     r'Der Definitionsbereich wird vor dem Rechnen bestimmt, nicht danach.'])

Q.q(r'Wie lautet der Definitionsbereich von $\dfrac{x}{x + 3} = 1$?',
    [r'$D = \mathbb{R} \setminus \{-3\}$', r'$D = \mathbb{R} \setminus \{3\}$',
     r'$D = \mathbb{R} \setminus \{0\}$', r'$D = \mathbb{R}$'],
    [r'$x + 3 \neq 0$ bedeutet $x \neq -3$.',
     r'Das Vorzeichen dreht sich beim Umstellen um.',
     r'Dass auch $x$ im Zähler steht, spielt für den Definitionsbereich keine Rolle.'])

Q.q(r'Wie lautet der Definitionsbereich von $\dfrac{1}{x - 1} + \dfrac{1}{x + 2} = 0$?',
    [r'$D = \mathbb{R} \setminus \{1;\,-2\}$', r'$D = \mathbb{R} \setminus \{-1;\,2\}$',
     r'$D = \mathbb{R} \setminus \{1\}$', r'$D = \mathbb{R} \setminus \{0\}$'],
    [r'Jeder Nenner liefert eine Bedingung.',
     r'$x - 1 \neq 0$ und $x + 2 \neq 0$.',
     r'Also sind $1$ und $-2$ ausgeschlossen.'])

Q.q(r'Wie lautet der Definitionsbereich von $\dfrac{5}{2x - 6} = 1$?',
    [r'$D = \mathbb{R} \setminus \{3\}$', r'$D = \mathbb{R} \setminus \{6\}$',
     r'$D = \mathbb{R} \setminus \{-3\}$', r'$D = \mathbb{R} \setminus \{2\}$'],
    [r'$2x - 6 \neq 0$',
     r'$2x \neq 6$, also $x \neq 3$.',
     r'Der Nenner muss erst nach $x$ aufgelöst werden — die $6$ allein ist nicht die verbotene Stelle.'])

Q.q(r'Warum bestimmt man bei einer Bruchgleichung zuerst den Definitionsbereich?',
    [r'Weil eine Zahl, die einen Nenner null macht, niemals Lösung sein kann, auch wenn die Rechnung sie liefert.',
     r'Weil die Gleichung sonst nicht umgeformt werden darf.',
     r'Weil der Definitionsbereich die Lösung bereits angibt.',
     r'Weil sonst der Hauptnenner nicht gefunden werden kann.'],
    [r'Beim Multiplizieren mit dem Hauptnenner können Zahlen als Lösungen auftauchen, die in der ursprünglichen Gleichung gar nicht eingesetzt werden dürfen.',
     r'Solche Werte heißen Scheinlösungen.',
     r'Nur mit dem vorher notierten Definitionsbereich lassen sie sich sicher ausschließen.'])

# ---------------------------------------------------------------- Lösen ----
Q.q(r'Löse: $\dfrac{6}{x} = 3$.',
    [r'$x = 2$', r'$x = 18$', r'$x = \dfrac{1}{2}$', r'$x = 3$'],
    [r'Definitionsbereich: $x \neq 0$.',
     r'Mit $x$ multiplizieren: $6 = 3x$, also $x = 2$.',
     r'Probe: $\dfrac{6}{2} = 3$.'])

Q.q(r'Löse: $\dfrac{12}{x + 1} = 4$.',
    [r'$x = 2$', r'$x = 3$', r'$x = 47$', r'$x = -2$'],
    [r'Definitionsbereich: $x \neq -1$.',
     r'Mit $x+1$ multiplizieren: $12 = 4\,(x+1)$, also $x + 1 = 3$.',
     r'$x = 2$. Probe: $\dfrac{12}{3} = 4$.'])

Q.q(r'Löse: $\dfrac{1}{x} + \dfrac{1}{2} = 1$.',
    [r'$x = 2$', r'$x = \dfrac{1}{2}$', r'$x = 1$', r'$x = 4$'],
    [r'Definitionsbereich: $x \neq 0$.',
     r'$\dfrac{1}{x} = 1 - \dfrac{1}{2} = \dfrac{1}{2}$',
     r'Kehrwert bilden: $x = 2$.'])

Q.q(r'Löse: $\dfrac{3}{x - 2} = 1$.',
    [r'$x = 5$', r'$x = 3$', r'$x = 1$', r'$x = -1$'],
    [r'Definitionsbereich: $x \neq 2$.',
     r'Mit $x-2$ multiplizieren: $3 = x - 2$.',
     r'$x = 5$. Probe: $\dfrac{3}{3} = 1$.'])

Q.q(r'Löse: $\dfrac{2}{x + 1} = \dfrac{3}{x + 4}$.',
    [r'$x = 5$', r'$x = -5$', r'$x = 1$', r'$x = 11$'],
    [r'Definitionsbereich: $x \neq -1$ und $x \neq -4$.',
     r'Über Kreuz multiplizieren: $2\,(x+4) = 3\,(x+1)$, also $2x + 8 = 3x + 3$.',
     r'$x = 5$. Probe: $\dfrac{2}{6} = \dfrac{1}{3}$ und $\dfrac{3}{9} = \dfrac{1}{3}$.'])

Q.q(r'Löse: $\dfrac{x + 2}{3} = \dfrac{x - 1}{2}$.',
    [r'$x = 7$', r'$x = 5$', r'$x = 1$', r'$x = -7$'],
    [r'Hier stehen nur Zahlen in den Nennern, der Definitionsbereich ist ganz $\mathbb{R}$.',
     r'Über Kreuz: $2\,(x+2) = 3\,(x-1)$, also $2x + 4 = 3x - 3$.',
     r'$x = 7$. Probe: $\dfrac{9}{3} = 3$ und $\dfrac{6}{2} = 3$.'])

Q.q(r'Löse: $\dfrac{1}{x - 1} = \dfrac{2}{x + 1}$.',
    [r'$x = 3$', r'$x = -3$', r'$x = 1$', r'$x = \dfrac{1}{3}$'],
    [r'Definitionsbereich: $x \neq 1$ und $x \neq -1$.',
     r'Über Kreuz: $x + 1 = 2\,(x - 1) = 2x - 2$.',
     r'$x = 3$. Probe: $\dfrac{1}{2}$ auf beiden Seiten.'])

Q.q(r'Womit multipliziert man $\dfrac{1}{x} + \dfrac{1}{x + 3} = \dfrac{5}{4}$ am besten?',
    [r'mit dem Hauptnenner $4x\,(x+3)$', r'mit $x$', r'mit $x + 3$', r'mit $4$'],
    [r'Der Hauptnenner enthält jeden vorkommenden Nenner als Faktor.',
     r'Hier sind das $x$, $x+3$ und $4$, zusammen also $4x\,(x+3)$.',
     r'Damit verschwinden alle Brüche in einem Schritt.'])

# --------------------------------------- Scheinlösungen und Sonderfälle ----
Q.q(r'Löse: $\dfrac{x}{x - 3} = \dfrac{3}{x - 3}$.',
    [r'$L = \{\}$, denn $x = 3$ ist ausgeschlossen.', r'$L = \{3\}$',
     r'$L = \mathbb{R}$', r'$L = \{0\}$'],
    [r'Definitionsbereich: $x \neq 3$.',
     r'Mit $x-3$ multiplizieren ergibt $x = 3$.',
     r'Dieser Wert liegt nicht im Definitionsbereich, es ist eine Scheinlösung. Die Gleichung hat keine Lösung.'])

Q.q(r'Was ist eine Scheinlösung?',
    [r'Eine Zahl, die die umgeformte Gleichung erfüllt, aber nicht im Definitionsbereich der ursprünglichen liegt.',
     r'Eine Lösung, die man nur näherungsweise bestimmen kann.',
     r'Eine Lösung, die negativ ist.',
     r'Eine Lösung, die doppelt vorkommt.'],
    [r'Beim Multiplizieren mit einem Term, der null werden kann, ist die Umformung keine Äquivalenzumformung.',
     r'Dabei können Werte hinzukommen, die vorher verboten waren.',
     r'Deshalb gehört am Ende jeder Bruchgleichung der Abgleich mit dem Definitionsbereich.'])

Q.q(r'Wie lautet die Lösungsmenge von $\dfrac{2x}{x + 1} = 2$?',
    [r'$L = \{\}$', r'$L = \mathbb{R}$', r'$L = \{-1\}$', r'$L = \{1\}$'],
    [r'Definitionsbereich: $x \neq -1$.',
     r'Mit $x+1$ multiplizieren: $2x = 2x + 2$, also $0 = 2$.',
     r'Das ist eine falsche Aussage, es gibt keine Lösung.'])

Q.q(r'Welche Probe ist bei einer Bruchgleichung unverzichtbar?',
    [r'der Abgleich der gefundenen Werte mit dem Definitionsbereich',
     r'das Nachrechnen des Hauptnenners',
     r'das Kürzen aller Brüche vor dem Rechnen',
     r'die Umwandlung in Dezimalzahlen'],
    [r'Die Rechnung selbst kann korrekt sein und trotzdem einen verbotenen Wert liefern.',
     r'Nur der Vergleich mit dem Definitionsbereich deckt eine Scheinlösung auf.',
     r'Zusätzlich lohnt das Einsetzen in die ursprüngliche Gleichung als Rechenkontrolle.'])

# ------------------------------------------------------------ Anwendungen ----
Q.q(r'Ein Bagger allein braucht $6$ Stunden für eine Grube, ein zweiter allein $3$ Stunden. Wie lange brauchen beide zusammen?',
    [r'$2$ Stunden', r'$4{,}5$ Stunden', r'$9$ Stunden', r'$1{,}5$ Stunden'],
    [r'In einer Stunde schafft der erste $\dfrac{1}{6}$, der zweite $\dfrac{1}{3}$ der Arbeit.',
     r'Zusammen: $\dfrac{1}{6} + \dfrac{1}{3} = \dfrac{1}{2}$ der Arbeit je Stunde.',
     r'Für die ganze Arbeit brauchen sie also $2$ Stunden — weniger als der schnellere allein.'])

Q.q(r'Zwei Pumpen füllen ein Becken zusammen in $4$ Stunden. Die erste allein braucht $12$ Stunden. Wie lange braucht die zweite allein?',
    [r'$6$ Stunden', r'$8$ Stunden', r'$16$ Stunden', r'$3$ Stunden'],
    [r'Gleichung: $\dfrac{1}{12} + \dfrac{1}{x} = \dfrac{1}{4}$.',
     r'$\dfrac{1}{x} = \dfrac{1}{4} - \dfrac{1}{12} = \dfrac{2}{12} = \dfrac{1}{6}$',
     r'Also $x = 6$ Stunden. $8$ Stunden käme heraus, wenn man fälschlich $12 - 4$ rechnet.'])

Q.q(r'Die Stückkosten betragen $k(x) = \dfrac{3000}{x} + 5$ €. Bei welcher Stückzahl liegen sie bei $20$ € je Stück?',
    [r'bei $200$ Stück', r'bei $150$ Stück', r'bei $600$ Stück', r'bei $120$ Stück'],
    [r'Gleichung: $\dfrac{3000}{x} + 5 = 20$, also $\dfrac{3000}{x} = 15$.',
     r'Mit $x$ multiplizieren: $3000 = 15x$, also $x = 200$.',
     r'Probe: $\dfrac{3000}{200} + 5 = 15 + 5 = 20$ €.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    x = sp.Symbol('x')
    # Definitionsbereiche
    assert sp.solve(x - 4, x) == [4] and sp.solve(x + 3, x) == [-3]
    assert sp.solve(x - 1, x) == [1] and sp.solve(x + 2, x) == [-2]
    assert sp.solve(2 * x - 6, x) == [3]
    # Loesen
    assert sp.solve(sp.Eq(6 / x, 3), x) == [2] and F(6, 2) == 3
    assert sp.solve(sp.Eq(12 / (x + 1), 4), x) == [2] and F(12, 3) == 4
    assert sp.solve(sp.Eq(1 / x + F(1, 2), 1), x) == [2]
    assert sp.solve(sp.Eq(3 / (x - 2), 1), x) == [5] and F(3, 3) == 1
    assert sp.solve(sp.Eq(2 / (x + 1), 3 / (x + 4)), x) == [5]
    assert F(2, 6) == F(1, 3) == F(3, 9)
    assert sp.solve(sp.Eq((x + 2) / 3, (x - 1) / 2), x) == [7] and F(9, 3) == 3 == F(6, 2)
    assert sp.solve(sp.Eq(1 / (x - 1), 2 / (x + 1)), x) == [3] and F(1, 2) == F(2, 4)
    # Scheinloesungen
    assert sp.solve(sp.Eq(x, 3), x) == [3]          # aus x/(x-3) = 3/(x-3), aber 3 ist verboten
    assert sp.solve(sp.Eq(2 * x, 2 * x + 2), x) == []
    # Anwendungen
    assert F(1, 6) + F(1, 3) == F(1, 2) and 1 / F(1, 2) == 2
    assert F(1, 4) - F(1, 12) == F(1, 6) and 1 / F(1, 6) == 6 and 12 - 4 == 8
    assert sp.solve(sp.Eq(3000 / x + 5, 20), x) == [200] and F(3000, 200) + 5 == 20
    assert F(3000, 15) == 200


Q.verify(check)
Q.save()
