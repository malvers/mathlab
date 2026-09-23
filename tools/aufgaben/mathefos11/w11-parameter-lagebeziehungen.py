#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 11 / KW 46 (LB 1): Einfluss von Parametern auf
Geraden, Lagebeziehungen zweier Geraden, Schnittpunkte.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=11, slug='parameter-lagebeziehungen', thema='Parameter und Lagebeziehungen', lb='LB 1',
          blurb='Wirkung von Anstieg und Achsenabschnitt, parallel, identisch, schneidend, orthogonal',
          comment='Blocks: Einfluss der Parameter (1-7), Lagebeziehungen (8-14), Schnittpunkte und Bedingungen (15-20).')

# ---------------------------------------------------- Einfluss der Parameter ----
Q.q(r'Was bewirkt ein größerer Wert von $m$ in $y = mx + n$?',
    [r'Die Gerade wird steiler.', r'Die Gerade wird flacher.',
     r'Die Gerade wandert nach oben.', r'Die Gerade wandert nach rechts.'],
    [r'$m$ ist der Anstieg: er gibt an, um wie viel $y$ wächst, wenn $x$ um $1$ zunimmt.',
     r'Ein größeres $m$ bedeutet mehr Höhengewinn pro Schritt, also eine steilere Gerade.',
     r'Die Lage auf der $y$-Achse ändert sich dabei nicht.'])

Q.q(r'Was bewirkt eine Vergrößerung von $n$ in $y = mx + n$?',
    [r'Die Gerade wird parallel nach oben verschoben.', r'Die Gerade wird steiler.',
     r'Die Gerade wird flacher.', r'Die Gerade wird an der $x$-Achse gespiegelt.'],
    [r'$n$ ist der $y$-Achsenabschnitt.',
     r'Jeder Punkt wandert um denselben Betrag nach oben, der Anstieg bleibt gleich.',
     r'Die alte und die neue Gerade sind deshalb parallel.'])

Q.q(r'Wie entsteht der Graph von $y = 2x + 4$ aus dem von $y = 2x + 1$?',
    [r'durch Verschiebung um $3$ nach oben', r'durch Verschiebung um $3$ nach rechts',
     r'durch Verdreifachung des Anstiegs', r'durch Spiegelung an der $y$-Achse'],
    [r'Beide haben denselben Anstieg $m = 2$, sie sind also parallel.',
     r'Der Achsenabschnitt wächst von $1$ auf $4$, das sind $3$ Einheiten.',
     r'Also Verschiebung um $3$ nach oben.'])

Q.q(r'Wie entsteht der Graph von $y = 3x$ aus dem von $y = x$?',
    [r'Er wird steiler, der Anstieg verdreifacht sich.', r'Er wird um $3$ nach oben verschoben.',
     r'Er wird flacher.', r'Er wird an der $x$-Achse gespiegelt.'],
    [r'Beide gehen durch den Ursprung, der Achsenabschnitt ist unverändert $0$.',
     r'Der Anstieg wächst von $1$ auf $3$.',
     r'Probe: bei $x = 2$ liegt der eine Punkt bei $y = 2$, der andere bei $y = 6$.'])

Q.q(r'Welche Gerade entsteht, wenn man $y = 2x + 3$ an der $x$-Achse spiegelt?',
    [r'$y = -2x - 3$', r'$y = -2x + 3$', r'$y = 2x - 3$', r'$y = -\dfrac{1}{2}x - 3$'],
    [r'Beim Spiegeln an der $x$-Achse wechselt jeder Funktionswert das Vorzeichen.',
     r'Aus $y$ wird $-y$, also $y = -(2x + 3)$.',
     r'$y = -2x - 3$. Beide Parameter kehren ihr Vorzeichen um.'])

Q.q(r'Was gilt für $y = mx + n$ mit $m = 0$?',
    [r'Der Graph ist eine waagerechte Gerade auf der Höhe $n$.',
     r'Der Graph ist eine senkrechte Gerade.',
     r'Der Graph geht durch den Ursprung.',
     r'Es gibt keinen Graphen.'],
    [r'Mit $m = 0$ bleibt $y = n$ für jedes $x$.',
     r'Der Funktionswert ändert sich also nie.',
     r'Der Graph ist eine Parallele zur $x$-Achse in der Höhe $n$.'])

Q.q(r'Die Gerade $y = mx + n$ geht genau dann durch den Ursprung, wenn …',
    [r'$n = 0$ ist.', r'$m = 0$ ist.', r'$m = n$ ist.', r'$m = 1$ ist.'],
    [r'Der Ursprung ist der Punkt $(0|0)$.',
     r'Einsetzen: $0 = m \cdot 0 + n$, also $n = 0$.',
     r'Dann liegt direkte Proportionalität vor.'])

# --------------------------------------------------------- Lagebeziehungen ----
Q.q(r'Wann sind zwei Geraden $y = m_1x + n_1$ und $y = m_2x + n_2$ parallel, aber nicht identisch?',
    [r'wenn $m_1 = m_2$ und $n_1 \neq n_2$', r'wenn $m_1 \neq m_2$ und $n_1 = n_2$',
     r'wenn $m_1 = m_2$ und $n_1 = n_2$', r'wenn $m_1 \cdot m_2 = -1$'],
    [r'Gleicher Anstieg bedeutet gleiche Richtung.',
     r'Unterschiedliche Achsenabschnitte bedeuten, dass sie nicht aufeinanderliegen.',
     r'Solche Geraden haben keinen gemeinsamen Punkt.'])

Q.q(r'Wann sind zwei Geraden orthogonal, schneiden sich also rechtwinklig?',
    [r'wenn $m_1 \cdot m_2 = -1$', r'wenn $m_1 + m_2 = 0$',
     r'wenn $m_1 = m_2$', r'wenn $n_1 \cdot n_2 = -1$'],
    [r'Die Bedingung betrifft nur die Anstiege.',
     r'$m_1 \cdot m_2 = -1$, die Anstiege sind also negativ zueinander kehrwertig.',
     r'Beispiel: $m_1 = 3$ und $m_2 = -\dfrac{1}{3}$.'])

Q.q(r'Wie liegen $y = 2x + 3$ und $y = -\dfrac{1}{2}x + 1$ zueinander?',
    [r'Sie schneiden sich rechtwinklig.', r'Sie sind parallel.',
     r'Sie sind identisch.', r'Sie schneiden sich unter $45^\circ$.'],
    [r'Anstiege: $m_1 = 2$ und $m_2 = -\dfrac{1}{2}$.',
     r'$2 \cdot \left(-\dfrac{1}{2}\right) = -1$',
     r'Die Bedingung für Orthogonalität ist erfüllt.'])

Q.q(r'Wie liegen $y = 3x - 1$ und $6x - 2y = 2$ zueinander?',
    [r'Sie sind identisch.', r'Sie sind parallel und verschieden.',
     r'Sie schneiden sich rechtwinklig.', r'Sie schneiden sich in genau einem Punkt.'],
    [r'Die zweite Gleichung nach $y$ auflösen: $-2y = -6x + 2$, also $y = 3x - 1$.',
     r'Beide Geraden haben denselben Anstieg und denselben Achsenabschnitt.',
     r'Es ist dieselbe Gerade, nur anders geschrieben.'])

Q.q(r'Wie liegen $y = 4x + 2$ und $y = 4x - 5$ zueinander?',
    [r'Sie sind parallel und haben keinen gemeinsamen Punkt.', r'Sie sind identisch.',
     r'Sie schneiden sich in $(0|2)$.', r'Sie schneiden sich rechtwinklig.'],
    [r'Gleicher Anstieg $m = 4$, verschiedene Achsenabschnitte.',
     r'Gleichsetzen führt auf $2 = -5$, eine falsche Aussage.',
     r'Also gibt es keinen Schnittpunkt.'])

Q.q(r'Wie viele gemeinsame Punkte haben zwei identische Geraden?',
    [r'unendlich viele', r'genau einen', r'keinen', r'genau zwei'],
    [r'Identische Geraden bestehen aus denselben Punkten.',
     r'Jeder Punkt der einen liegt auch auf der anderen.',
     r'Beim Gleichsetzen entsteht eine immer wahre Aussage wie $0 = 0$.'])

Q.q(r'Beim Gleichsetzen zweier Geradengleichungen entsteht die Aussage $7 = 3$. Was bedeutet das?',
    [r'Die Geraden sind parallel und verschieden, es gibt keinen Schnittpunkt.',
     r'Die Geraden sind identisch.',
     r'Der Schnittpunkt liegt bei $x = 7$.',
     r'Es wurde falsch gerechnet.'],
    [r'Die Variable ist beim Umformen herausgefallen, übrig blieb eine falsche Zahlengleichung.',
     r'Es gibt also kein $x$, für das beide Geraden denselben Wert liefern.',
     r'Genau das kennzeichnet parallele, aber verschiedene Geraden.'])

# ------------------------------------------ Schnittpunkte und Bedingungen ----
Q.q(r'Wo schneiden sich $y = x + 1$ und $y = -2x + 7$?',
    [r'in $S(2|3)$', r'in $S(3|2)$', r'in $S(2|5)$', r'in $S(1|2)$'],
    [r'Gleichsetzen: $x + 1 = -2x + 7$.',
     r'$3x = 6$, also $x = 2$.',
     r'Einsetzen: $y = 3$, also $S(2|3)$.'])

Q.q(r'Wo schneiden sich $y = 3x - 4$ und $y = x + 2$?',
    [r'in $S(3|5)$', r'in $S(5|3)$', r'in $S(3|7)$', r'in $S(2|4)$'],
    [r'Gleichsetzen: $3x - 4 = x + 2$.',
     r'$2x = 6$, also $x = 3$.',
     r'Einsetzen in die zweite Gleichung: $y = 5$.'])

Q.q(r'Für welches $a$ sind $y = a\,x + 1$ und $y = 4x - 2$ parallel?',
    [r'$a = 4$', r'$a = -4$', r'$a = -2$', r'$a = \dfrac{1}{4}$'],
    [r'Parallel bedeutet gleicher Anstieg.',
     r'$a = 4$',
     r'Die Achsenabschnitte $1$ und $-2$ sind verschieden, die Geraden also parallel und nicht identisch.'])

Q.q(r'Für welches $a$ steht $y = a\,x + 3$ senkrecht auf $y = 2x - 1$?',
    [r'$a = -\dfrac{1}{2}$', r'$a = \dfrac{1}{2}$', r'$a = -2$', r'$a = 2$'],
    [r'Bedingung: $a \cdot 2 = -1$.',
     r'$a = -\dfrac{1}{2}$',
     r'Probe: $-\dfrac{1}{2} \cdot 2 = -1$ stimmt.'])

Q.q(r'Für welches $b$ geht die Gerade $y = 2x + b$ durch den Punkt $P(3|1)$?',
    [r'$b = -5$', r'$b = 5$', r'$b = 7$', r'$b = -7$'],
    [r'Punktprobe: $1 = 2 \cdot 3 + b$.',
     r'$1 = 6 + b$, also $b = -5$.',
     r'Probe: $y = 2 \cdot 3 - 5 = 1$.'])

Q.q(r'Zwei Tarife werden durch $y = 0{,}25x + 15$ und $y = 0{,}40x$ beschrieben. Was bedeutet ihr Schnittpunkt im Sachzusammenhang?',
    [r'die Menge, bei der beide Tarife gleich viel kosten', r'den günstigsten Tarif',
     r'die Grundgebühr des ersten Tarifs', r'die maximale Menge'],
    [r'Im Schnittpunkt haben beide Funktionen denselben Wert.',
     r'Gleichsetzen: $0{,}25x + 15 = 0{,}40x$ ergibt $x = 100$ und $y = 40$ €.',
     r'Unterhalb von $100$ Einheiten ist der zweite Tarif günstiger, darüber der erste.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    x, a, b = sp.symbols('x a b')
    line = lambda m, n: m * x + n
    # Parameter
    assert line(1, 0).subs(x, 2) == 2 and line(3, 0).subs(x, 2) == 6
    assert line(2, 4).coeff(x) == line(2, 1).coeff(x) == 2 and 4 - 1 == 3
    assert sp.expand(-(2 * x + 3)) == -2 * x - 3
    assert line(0, 5).subs(x, 7) == 5
    assert sp.solve(sp.Eq(line(2, b).subs(x, 0), 0), b) == [0]
    # Lagebeziehungen
    assert 2 * F(-1, 2) == -1 and 3 * F(-1, 3) == -1
    y = sp.Symbol('y')
    assert sp.solve(sp.Eq(6 * x - 2 * y, 2), y) == [3 * x - 1]
    assert sp.solve(sp.Eq(line(4, 2), line(4, -5)), x) == []
    # Schnittpunkte
    assert sp.solve(sp.Eq(line(1, 1), line(-2, 7)), x) == [2] and line(1, 1).subs(x, 2) == 3
    assert sp.solve(sp.Eq(line(3, -4), line(1, 2)), x) == [3] and line(1, 2).subs(x, 3) == 5
    assert sp.solve(sp.Eq(a * 2, -1), a) == [F(-1, 2)]
    assert sp.solve(sp.Eq(2 * 3 + b, 1), b) == [-5] and 2 * 3 - 5 == 1
    t1 = F(25, 100) * x + 15; t2 = F(40, 100) * x
    assert sp.solve(sp.Eq(t1, t2), x) == [100] and t1.subs(x, 100) == 40 == t2.subs(x, 100)
    assert t1.subs(x, 50) > t2.subs(x, 50) and t1.subs(x, 200) < t2.subs(x, 200)


Q.verify(check)
Q.save()
