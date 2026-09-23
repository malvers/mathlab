#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 12 / KW 47 (LB 1): lineare Gleichungssysteme mit zwei
Gleichungen und zwei Unbekannten - Verfahren, Loesungsfaelle, grafische Deutung.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=12, slug='lgs', thema='Lineare Gleichungssysteme', lb='LB 1',
          blurb='Gleichsetzungs-, Einsetzungs- und Additionsverfahren, Lösungsfälle, grafische Deutung',
          comment='Blocks: Verfahren erkennen (1-4), Systeme loesen (5-13), Loesungsfaelle (14-16), grafisch und Anwendungen (17-20).')

# ----------------------------------------------------- Verfahren erkennen ----
Q.q(r'Welches Verfahren bietet sich an, wenn beide Gleichungen nach $y$ aufgelöst sind?',
    [r'das Gleichsetzungsverfahren', r'das Additionsverfahren',
     r'das Einsetzungsverfahren', r'gar keines, man muss erst umformen'],
    [r'Stehen links beide Male $y$, so sind die rechten Seiten einander gleich.',
     r'Man setzt sie gleich und erhält eine Gleichung mit nur einer Variablen.',
     r'Das ist das Gleichsetzungsverfahren.'])

Q.q(r'Welches Verfahren bietet sich bei $2x + y = 7$ und $y = x + 1$ an?',
    [r'das Einsetzungsverfahren', r'das Additionsverfahren',
     r'das Gleichsetzungsverfahren', r'nur die grafische Lösung'],
    [r'Die zweite Gleichung ist bereits nach $y$ aufgelöst.',
     r'Dieser Ausdruck wird in die erste Gleichung eingesetzt.',
     r'Das ist das Einsetzungsverfahren.'])

Q.q(r'Welches Verfahren bietet sich bei $x + 2y = 8$ und $3x - 2y = 4$ an?',
    [r'das Additionsverfahren, denn $+2y$ und $-2y$ heben sich auf',
     r'das Einsetzungsverfahren', r'das Gleichsetzungsverfahren',
     r'es lässt sich nicht lösen'],
    [r'Die $y$-Terme sind bereits entgegengesetzt gleich.',
     r'Addiert man beide Gleichungen, fällt $y$ heraus.',
     r'Das ist das Additionsverfahren, auch Eliminationsverfahren genannt.'])

Q.q(r'Was ist das gemeinsame Ziel aller drei Verfahren?',
    [r'eine Gleichung mit nur noch einer Variablen zu erhalten',
     r'beide Gleichungen nach $y$ aufzulösen',
     r'die Gleichungen zu addieren',
     r'die Lösung zu zeichnen'],
    [r'Ein System mit zwei Unbekannten lässt sich nicht direkt lösen.',
     r'Jedes Verfahren eliminiert eine Variable.',
     r'Die verbleibende Gleichung wird gelöst, dann wird zurückgesetzt.'])

# ------------------------------------------------------- Systeme lösen ----
Q.q(r'Löse: $x + y = 10$ und $x - y = 4$.',
    [r'$x = 7$, $y = 3$', r'$x = 3$, $y = 7$', r'$x = 6$, $y = 4$', r'$x = 14$, $y = 4$'],
    [r'Addieren: $2x = 14$, also $x = 7$.',
     r'Einsetzen in die erste Gleichung: $7 + y = 10$, also $y = 3$.',
     r'Probe: $7 - 3 = 4$ stimmt.'])

Q.q(r'Löse: $2x + y = 7$ und $y = x + 1$.',
    [r'$x = 2$, $y = 3$', r'$x = 3$, $y = 2$', r'$x = 1$, $y = 2$', r'$x = 2$, $y = 5$'],
    [r'Einsetzen: $2x + (x+1) = 7$, also $3x + 1 = 7$.',
     r'$3x = 6$, also $x = 2$.',
     r'$y = 2 + 1 = 3$. Probe: $4 + 3 = 7$.'])

Q.q(r'Löse: $3x + 2y = 12$ und $x = 2y$.',
    [r'$x = 3$, $y = 1{,}5$', r'$x = 1{,}5$, $y = 3$', r'$x = 4$, $y = 2$', r'$x = 6$, $y = 3$'],
    [r'Einsetzen: $3 \cdot 2y + 2y = 12$, also $8y = 12$.',
     r'$y = 1{,}5$ und damit $x = 3$.',
     r'Probe: $9 + 3 = 12$ stimmt.'])

Q.q(r'Löse: $x + 2y = 8$ und $3x - 2y = 4$.',
    [r'$x = 3$, $y = 2{,}5$', r'$x = 2{,}5$, $y = 3$', r'$x = 4$, $y = 2$', r'$x = 3$, $y = 2$'],
    [r'Addieren: $4x = 12$, also $x = 3$.',
     r'Einsetzen: $3 + 2y = 8$, also $y = 2{,}5$.',
     r'Probe: $9 - 5 = 4$ stimmt.'])

Q.q(r'Löse: $2x + 3y = 12$ und $4x - 3y = 6$.',
    [r'$x = 3$, $y = 2$', r'$x = 2$, $y = 3$', r'$x = 3$, $y = -2$', r'$x = 1{,}5$, $y = 3$'],
    [r'Addieren: $6x = 18$, also $x = 3$.',
     r'Einsetzen: $6 + 3y = 12$, also $y = 2$.',
     r'Probe: $12 - 6 = 6$ stimmt.'])

Q.q(r'Löse: $5x - 2y = 4$ und $3x + 2y = 12$.',
    [r'$x = 2$, $y = 3$', r'$x = 3$, $y = 2$', r'$x = 2$, $y = -3$', r'$x = 1$, $y = 4{,}5$'],
    [r'Addieren: $8x = 16$, also $x = 2$.',
     r'Einsetzen: $6 + 2y = 12$, also $y = 3$.',
     r'Probe: $10 - 6 = 4$ stimmt.'])

Q.q(r'Löse: $x + 2y = 7$ und $2x + y = 8$.',
    [r'$x = 3$, $y = 2$', r'$x = 2$, $y = 3$', r'$x = 1$, $y = 3$', r'$x = 4$, $y = 1{,}5$'],
    [r'Hier hebt sich nichts direkt auf: die erste Gleichung mit $2$ multiplizieren.',
     r'$2x + 4y = 14$, davon $2x + y = 8$ abziehen: $3y = 6$, also $y = 2$.',
     r'$x = 7 - 4 = 3$. Probe: $6 + 2 = 8$ stimmt.'])

Q.q(r'Löse: $4x + y = 14$ und $y = 2x + 2$.',
    [r'$x = 2$, $y = 6$', r'$x = 3$, $y = 2$', r'$x = 2$, $y = 4$', r'$x = 1$, $y = 10$'],
    [r'Einsetzen: $4x + 2x + 2 = 14$, also $6x = 12$.',
     r'$x = 2$ und $y = 2 \cdot 2 + 2 = 6$.',
     r'Probe: $8 + 6 = 14$ stimmt.'])

Q.q(r'Warum gehört zu jedem gelösten Gleichungssystem eine Probe?',
    [r'Weil das Wertepaar BEIDE Gleichungen erfüllen muss, nicht nur die, in die zurückgesetzt wurde.',
     r'Weil die Verfahren nicht zuverlässig sind.',
     r'Weil sonst die Lösungsmenge nicht angegeben werden darf.',
     r'Weil die Probe das Verfahren ersetzt.'],
    [r'Beim Zurücksetzen wird meist nur eine der beiden Gleichungen benutzt.',
     r'Ein Rechenfehler in der anderen bliebe dann unbemerkt.',
     r'Deshalb wird das Paar in die bisher nicht verwendete Gleichung eingesetzt.'])

# ----------------------------------------------------------- Lösungsfälle ----
Q.q(r'Wie lautet die Lösungsmenge von $x + y = 3$ und $x + y = 5$?',
    [r'$L = \{\}$', r'$L = \{(3|5)\}$', r'$L = \mathbb{R}$', r'$L = \{(4|1)\}$'],
    [r'Subtrahiert man die Gleichungen, bleibt $0 = -2$.',
     r'Das ist eine falsche Aussage.',
     r'Grafisch: zwei parallele, verschiedene Geraden ohne Schnittpunkt.'])

Q.q(r'Wie viele Lösungen hat das System $x + y = 3$ und $2x + 2y = 6$?',
    [r'unendlich viele', r'genau eine', r'keine', r'genau zwei'],
    [r'Die zweite Gleichung ist das Doppelte der ersten.',
     r'Beide beschreiben dieselbe Gerade.',
     r'Jeder Punkt dieser Geraden ist Lösung, etwa $(1|2)$ und $(0|3)$.'])

Q.q(r'Wann hat ein lineares Gleichungssystem mit zwei Unbekannten genau eine Lösung?',
    [r'wenn die zugehörigen Geraden verschiedene Anstiege haben',
     r'wenn die Geraden denselben Anstieg haben',
     r'wenn beide Gleichungen dasselbe Absolutglied haben',
     r'immer'],
    [r'Verschiedene Anstiege bedeuten, dass die Geraden nicht parallel sind.',
     r'Zwei nicht parallele Geraden schneiden sich in genau einem Punkt.',
     r'Dieser Schnittpunkt ist die eindeutige Lösung.'])

# --------------------------------------------- grafisch und Anwendung ----
Q.q(r'Was bedeutet die Lösung eines Gleichungssystems grafisch?',
    [r'Sie ist der Schnittpunkt der beiden zugehörigen Geraden.',
     r'Sie ist der Schnittpunkt der Geraden mit der $x$-Achse.',
     r'Sie ist der Mittelpunkt zwischen beiden Geraden.',
     r'Sie hat keine grafische Bedeutung.'],
    [r'Jede Gleichung beschreibt eine Gerade.',
     r'Ein Wertepaar, das beide Gleichungen erfüllt, liegt auf beiden Geraden.',
     r'Also ist es genau ihr Schnittpunkt.'])

Q.q(r'Um das System $y = 2x - 1$ und $y = -x + 5$ mit dem GTR grafisch zu lösen, was gibt man ein?',
    [r'beide Terme als Funktionen und lässt den Schnittpunkt bestimmen',
     r'nur die erste Gleichung', r'die Summe beider Gleichungen',
     r'die Differenz beider Gleichungen'],
    [r'Beide Gleichungen sind bereits nach $y$ aufgelöst und lassen sich direkt eingeben.',
     r'Der GTR zeichnet beide Geraden und findet den Schnittpunkt.',
     r'Zur Kontrolle rechnet man nach: $2x - 1 = -x + 5$ ergibt $x = 2$ und $y = 3$.'])

Q.q(r'Für eine Veranstaltung wurden $120$ Karten verkauft, insgesamt für $1090$ €. Eine Erwachsenenkarte kostet $12$ €, eine ermäßigte $5$ €. Wie viele Karten jeder Sorte waren es?',
    [r'$70$ Erwachsenen- und $50$ ermäßigte Karten', r'$50$ Erwachsenen- und $70$ ermäßigte Karten',
     r'$60$ und $60$ Karten', r'$80$ Erwachsenen- und $40$ ermäßigte Karten'],
    [r'Ansatz: $e + m = 120$ und $12e + 5m = 1090$.',
     r'Aus der ersten Gleichung $m = 120 - e$, eingesetzt: $12e + 600 - 5e = 1090$, also $7e = 490$.',
     r'$e = 70$ und $m = 50$. Probe: $840 + 250 = 1090$ €.'])

Q.q(r'In einer Werkstatt stehen Fahrräder und Autos, zusammen $12$ Fahrzeuge mit $34$ Rädern. Wie viele Autos sind es?',
    [r'$5$ Autos', r'$7$ Autos', r'$6$ Autos', r'$4$ Autos'],
    [r'Ansatz: $f + a = 12$ und $2f + 4a = 34$.',
     r'Aus der ersten Gleichung $f = 12 - a$, eingesetzt: $24 - 2a + 4a = 34$, also $2a = 10$.',
     r'$a = 5$ Autos und $f = 7$ Fahrräder. Probe: $14 + 20 = 34$ Räder.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    x, y = sp.symbols('x y')
    L = lambda e1, e2: sp.solve([e1, e2], [x, y], dict=True)
    assert L(x + y - 10, x - y - 4) == [{x: 7, y: 3}]
    assert L(2 * x + y - 7, y - (x + 1)) == [{x: 2, y: 3}]
    assert L(3 * x + 2 * y - 12, x - 2 * y) == [{x: 3, y: F(3, 2)}]
    assert L(x + 2 * y - 8, 3 * x - 2 * y - 4) == [{x: 3, y: F(5, 2)}]
    assert L(2 * x + 3 * y - 12, 4 * x - 3 * y - 6) == [{x: 3, y: 2}]
    assert L(5 * x - 2 * y - 4, 3 * x + 2 * y - 12) == [{x: 2, y: 3}]
    assert L(x + 2 * y - 7, 2 * x + y - 8) == [{x: 3, y: 2}]
    assert L(4 * x + y - 14, y - (2 * x + 2)) == [{x: 2, y: 6}]
    # Loesungsfaelle
    assert sp.solve([x + y - 3, x + y - 5], [x, y], dict=True) == []
    unendlich = sp.solve([x + y - 3, 2 * x + 2 * y - 6], [x, y], dict=True)
    assert unendlich and len(unendlich[0]) == 1        # eine Variable bleibt frei
    assert (1 + 2 == 3) and (0 + 3 == 3)
    # grafisch
    assert sp.solve(sp.Eq(2 * x - 1, -x + 5), x) == [2] and (2 * x - 1).subs(x, 2) == 3
    # Anwendungen
    e, m = sp.symbols('e m')
    assert sp.solve([e + m - 120, 12 * e + 5 * m - 1090], [e, m], dict=True) == [{e: 70, m: 50}]
    assert 12 * 70 == 840 and 5 * 50 == 250 and 840 + 250 == 1090
    f, a = sp.symbols('f a')
    assert sp.solve([f + a - 12, 2 * f + 4 * a - 34], [f, a], dict=True) == [{f: 7, a: 5}]
    assert 2 * 7 + 4 * 5 == 34 and 7 + 5 == 12


Q.verify(check)
Q.save()
