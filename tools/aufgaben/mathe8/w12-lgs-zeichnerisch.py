#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 12 / KW 47 (LB 2): lineare Gleichungssysteme
zeichnerisch lösen, Schnittpunkt zweier Geraden. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=12, slug='lgs-zeichnerisch', thema='Gleichungssysteme zeichnerisch lösen', lb='LB 2',
        blurb='Schnittpunkt zweier Geraden, Umstellen nach y, Probe, Sachaufgaben',
        comment='Blocks: meaning of the solution (1, 11), intersections (2-3, 6, 12, 16-17, 19), solving for y (4-5), special cases (7-8, 18), context (9-10, 13-15, 20). Problem 9/10 after Sunzi Suanjing.')

# ------------------------------------------------- Schnittpunkt ----
Q.q(r'Was ist beim zeichnerischen Lösen die Lösung eines linearen Gleichungssystems?',
    [r'die Koordinaten des Schnittpunkts der beiden Geraden', r'die beiden Nullstellen',
     r'die beiden Steigungen', r'die Schnittpunkte mit der $y$-Achse'],
    [r'Jede Gleichung gehört zu einer Geraden.',
     r'Ein Punkt erfüllt beide Gleichungen genau dann, wenn er auf beiden Geraden liegt: im Schnittpunkt.'])

Q.q(r'In welchem Punkt schneiden sich $y = x + 1$ und $y = -x + 5$?',
    [r'$(2 \mid 3)$', r'$(3 \mid 2)$', r'$(1 \mid 5)$', r'$(0 \mid 1)$'],
    [r'Gleichsetzen oder zeichnen: $x + 1 = -x + 5$, also $2x = 4$ und $x = 2$.',
     r'$y = 2 + 1 = 3$',
     r'Probe in der zweiten Gleichung: $-2 + 5 = 3$'])

Q.q(r'Welches Zahlenpaar löst beide Gleichungen $y = 2x + 1$ und $y = x + 2$?',
    [r'$x = 1$, $y = 3$', r'$x = 3$, $y = 1$', r'$x = 0$, $y = 2$', r'$x = 2$, $y = 5$'],
    [r'Probe mit $(1 \mid 3)$: $2 \cdot 1 + 1 = 3$ und $1 + 2 = 3$, beide stimmen.',
     r'$(0 \mid 2)$ erfüllt nur die zweite, $(2 \mid 5)$ nur die erste Gleichung.'])

Q.q(r'Stelle $2x + y = 6$ nach $y$ um.',
    [r'$y = -2x + 6$', r'$y = 2x + 6$', r'$y = 6 - x$', r'$y = 3 - x$'],
    [r'Auf beiden Seiten $2x$ subtrahieren.',
     r'$y = 6 - 2x = -2x + 6$'])

Q.q(r'Stelle $3x - y = 2$ nach $y$ um.',
    [r'$y = 3x - 2$', r'$y = -3x + 2$', r'$y = 3x + 2$', r'$y = 2 - 3x$'],
    [r'$-3x$ auf beiden Seiten: $-y = -3x + 2$',
     r'Mit $-1$ multiplizieren: $y = 3x - 2$'])

Q.q(r'In welchem Punkt schneiden sich $y = 2x - 1$ und $y = 3$?',
    [r'$(2 \mid 3)$', r'$(3 \mid 2)$', r'$(3 \mid 5)$', r'$(0 \mid 3)$'],
    [r'$y = 3$ ist eine waagerechte Gerade.',
     r'$2x - 1 = 3$, also $x = 2$.',
     r'Schnittpunkt $(2 \mid 3)$'])

# ------------------------------------------------------------- Sonderfälle ----
Q.q(r'Wie viele Lösungen hat das System $y = 2x + 1$ und $y = 2x - 3$?',
    [r'keine', r'genau eine', r'genau zwei', r'unendlich viele'],
    [r'Beide Geraden haben die Steigung 2, aber verschiedene $y$-Achsenabschnitte.',
     r'Sie sind parallel und schneiden sich nie.'])

Q.q(r'Wie viele Lösungen hat das System $y = x + 2$ und $2y = 2x + 4$?',
    [r'unendlich viele', r'keine', r'genau eine', r'genau zwei'],
    [r'Die zweite Gleichung durch 2 geteilt: $y = x + 2$.',
     r'Beide Gleichungen beschreiben dieselbe Gerade; jeder Punkt der Geraden ist Lösung.'])

# -------------------------------------------------------------- Sachaufgaben ----
Q.q(r'In einem Käfig sitzen Fasane und Kaninchen, zusammen 35 Köpfe und 94 Beine (nach dem chinesischen Rechenbuch Sunzi Suanjing). Welches System passt? ($f$: Fasane, $k$: Kaninchen)',
    [r'$f + k = 35$ und $2f + 4k = 94$', r'$f + k = 94$ und $2f + 4k = 35$',
     r'$f + k = 35$ und $4f + 2k = 94$', r'$2f + 4k = 35$ und $f + k = 94$'],
    [r'Jedes Tier hat einen Kopf: $f + k = 35$.',
     r'Fasane haben 2 Beine, Kaninchen 4: $2f + 4k = 94$.'])

Q.q(r'Löse das Fasanen-Kaninchen-Rätsel: $f + k = 35$ und $2f + 4k = 94$.',
    [r'23 Fasane und 12 Kaninchen', r'12 Fasane und 23 Kaninchen', r'20 Fasane und 15 Kaninchen', r'17 Fasane und 18 Kaninchen'],
    [r'Nach $f$ umstellen: $f = 35 - k$, einsetzen: $2 \cdot (35 - k) + 4k = 94$.',
     r'$70 + 2k = 94$, also $k = 12$ und $f = 23$.',
     r'Probe: $2 \cdot 23 + 4 \cdot 12 = 46 + 48 = 94$'])

Q.q(r'Warum macht man nach dem Ablesen des Schnittpunkts eine Probe durch Einsetzen?',
    [r'Weil das Ablesen aus der Zeichnung ungenau sein kann.', r'Weil der Schnittpunkt immer falsch ist.',
     r'Weil man sonst die Steigung nicht kennt.', r'Eine Probe ist nicht nötig.'],
    [r'Liegt der Schnittpunkt nicht genau auf Gitterpunkten, kann man sich leicht verschätzen.',
     r'Einsetzen in beide Gleichungen zeigt, ob das Paar wirklich passt.'])

Q.q(r'In welchem Punkt schneiden sich $y = -0{,}5x + 4$ und $y = x - 2$?',
    [r'$(4 \mid 2)$', r'$(2 \mid 4)$', r'$(4 \mid 6)$', r'$(6 \mid 4)$'],
    [r'$-0{,}5x + 4 = x - 2$, also $6 = 1{,}5x$.',
     r'$x = 4$, $y = 4 - 2 = 2$'])

Q.q(r'Zwei Erwachsene und drei Jugendliche zahlen im Kino 41 €, ein Erwachsener und zwei Jugendliche 24 €. Was kostet eine Karte für Erwachsene?',
    [r'10 €', r'7 €', r'8,20 €', r'12 €'],
    [r'$2e + 3j = 41$ und $e + 2j = 24$',
     r'Aus der zweiten: $e = 24 - 2j$; eingesetzt: $48 - 4j + 3j = 41$, also $j = 7$.',
     r'$e = 24 - 14 = 10$'])

Q.q(r'Zwei Zahlen haben die Summe 12 und die Differenz 4. Welches System passt?',
    [r'$x + y = 12$ und $x - y = 4$', r'$x + y = 4$ und $x - y = 12$',
     r'$x \cdot y = 12$ und $x - y = 4$', r'$x + y = 12$ und $x + 4 = y + 12$'],
    [r'Summe: $x + y = 12$',
     r'Differenz: $x - y = 4$'])

Q.q(r'Löse: $x + y = 12$ und $x - y = 4$.',
    [r'$x = 8$, $y = 4$', r'$x = 4$, $y = 8$', r'$x = 6$, $y = 6$', r'$x = 16$, $y = -4$'],
    [r'Addieren: $2x = 16$, also $x = 8$.',
     r'$y = 12 - 8 = 4$'])

Q.q(r'Wie viele Lösungen hat das System $y = 3x + 1$ und $y = -x + 1$?',
    [r'genau eine', r'keine', r'unendlich viele', r'genau zwei'],
    [r'Die Steigungen 3 und −1 sind verschieden, die Geraden schneiden sich also genau einmal.',
     r'Hier liegt der Schnittpunkt auf der $y$-Achse.'])

Q.q(r'Wo schneiden sich die Geraden $y = 3x + 1$ und $y = -x + 1$?',
    [r'$(0 \mid 1)$', r'$(1 \mid 0)$', r'$(1 \mid 4)$', r'$(-1 \mid 2)$'],
    [r'Beide haben den $y$-Achsenabschnitt 1.',
     r'$3x + 1 = -x + 1$ ergibt $x = 0$, also $(0 \mid 1)$.'])

Q.q(r'Welche Gerade hat mit $y = 2x + 1$ keinen gemeinsamen Punkt?',
    [r'$y = 2x - 5$', r'$y = -2x + 1$', r'$y = x + 1$', r'$y = 0{,}5x - 5$'],
    [r'Keinen gemeinsamen Punkt haben nur parallele, verschiedene Geraden.',
     r'Gleiche Steigung 2, anderes $n$: $y = 2x - 5$.'])

Q.q(r'In welchem Punkt schneiden sich $y = x$ und $y = -2x + 6$?',
    [r'$(2 \mid 2)$', r'$(3 \mid 3)$', r'$(6 \mid 6)$', r'$(2 \mid 4)$'],
    [r'$x = -2x + 6$, also $3x = 6$ und $x = 2$.',
     r'$y = x = 2$'])

Q.q(r'Kerze A ist 20 cm hoch und brennt 2 cm pro Stunde ab, Kerze B ist 15 cm hoch und brennt 1 cm pro Stunde ab. Wann sind beide gleich hoch?',
    [r'nach 5 Stunden, beide 10 cm', r'nach 5 Stunden, beide 5 cm', r'nach 35 Stunden', r'nie'],
    [r'A: $h = 20 - 2t$, B: $h = 15 - t$',
     r'$20 - 2t = 15 - t$, also $t = 5$.',
     r'Höhe: $15 - 5 = 10$ cm'])


def check():
    import sympy as sp
    x, y, f, k, e, j = sp.symbols('x y f k e j')
    S = lambda *eqs: sp.solve(eqs, (x, y), dict=True)
    assert S(sp.Eq(y, x + 1), sp.Eq(y, -x + 5)) == [{x: 2, y: 3}]
    assert S(sp.Eq(y, 2*x + 1), sp.Eq(y, x + 2)) == [{x: 1, y: 3}]
    assert sp.solve(2*x + y - 6, y) == [6 - 2*x] and sp.solve(3*x - y - 2, y) == [3*x - 2]
    assert S(sp.Eq(y, 2*x - 1), sp.Eq(y, 3)) == [{x: 2, y: 3}]
    assert S(sp.Eq(y, 2*x + 1), sp.Eq(y, 2*x - 3)) == []
    assert sp.expand(2*(x + 2) - (2*x + 4)) == 0
    assert sp.solve((f + k - 35, 2*f + 4*k - 94), (f, k)) == {f: 23, k: 12}
    assert S(sp.Eq(y, -x / 2 + 4), sp.Eq(y, x - 2)) == [{x: 4, y: 2}]
    assert sp.solve((2*e + 3*j - 41, e + 2*j - 24), (e, j)) == {e: 10, j: 7}
    assert S(sp.Eq(x + y, 12), sp.Eq(x - y, 4)) == [{x: 8, y: 4}]
    assert S(sp.Eq(y, 3*x + 1), sp.Eq(y, -x + 1)) == [{x: 0, y: 1}]
    assert S(sp.Eq(y, x), sp.Eq(y, -2*x + 6)) == [{x: 2, y: 2}]
    assert S(sp.Eq(y, 20 - 2*x), sp.Eq(y, 15 - x)) == [{x: 5, y: 10}]


Q.verify(check)
Q.save()
