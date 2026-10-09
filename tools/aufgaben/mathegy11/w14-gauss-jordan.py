#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 14 / KW 49 (LB 2): solving linear systems with the
Gauss-Jordan method, number of solutions, word problems. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11


def aug(*rows):
    """Augmented matrix as LaTeX: aug((1, 2, 5), (3, 1, 5)) - last entry right of the bar."""
    n = len(rows[0]) - 1
    body = r' \\ '.join(' & '.join(str(v) for v in r) for r in rows)
    return r'\left(\begin{array}{' + 'c' * n + '|c} ' + body + r' \end{array}\right)'


Q = gy11(nr=14, slug='gauss-jordan', thema='Das Gauß-Jordan-Verfahren', lb='LB 2',
         blurb='Zeilenumformungen, Lösen linearer Gleichungssysteme, Lösbarkeit',
         comment='Blocks: row operations (1-4), solving (5-11), number of solutions (12-15), word problems (16-20).')

# ----------------------------------------------------------- row operations ----
Q.q(r'Welche Umformung ist beim Gauß-Jordan-Verfahren NICHT erlaubt?',
    [r'Eine Zeile mit 0 multiplizieren', r'Zwei Zeilen vertauschen', r'Eine Zeile mit einer Zahl ungleich 0 multiplizieren',
     r'Ein Vielfaches einer Zeile zu einer anderen addieren'],
    [r'Erlaubt sind nur Umformungen, die die Lösungsmenge nicht ändern.',
     r'Mal 0 löscht eine Gleichung und damit Information.'])

Q.q(r'Was ist das Ziel des Gauß-Jordan-Verfahrens?',
    [r'Links vom Strich soll die Einheitsmatrix stehen; rechts steht dann die Lösung.', r'Alle Einträge sollen null werden.',
     r'Die Matrix soll symmetrisch werden.', r'Die rechte Seite soll null werden.'],
    [r'Gauß bringt die Matrix auf Stufenform, Jordan räumt auch oberhalb der Diagonalen ab.',
     r'Am Ende lautet jede Zeile $x = \ldots$, $y = \ldots$, $z = \ldots$'])

Q.q(r'Welche Zeile entsteht aus $' + aug((1, 1, 1, 6), (2, -1, 1, 3)) + r'$ durch $Z_2 - 2 \cdot Z_1$?',
    [r'$(0 \;\; -3 \;\; -1 \mid -9)$', r'$(0 \;\; -3 \;\; 1 \mid -9)$', r'$(0 \;\; 1 \;\; -1 \mid 3)$', r'$(0 \;\; -3 \;\; -1 \mid 9)$'],
    [r'$2 - 2 \cdot 1 = 0$, $-1 - 2 \cdot 1 = -3$, $1 - 2 \cdot 1 = -1$',
     r'Rechts: $3 - 2 \cdot 6 = -9$'])

Q.q(r'Die Endform lautet $' + aug((1, 0, 0, 2), (0, 1, 0, -1), (0, 0, 1, 4)) + r'$. Wie heißt die Lösung?',
    [r'$x = 2$, $y = -1$, $z = 4$', r'$x = 1$, $y = 1$, $z = 1$', r'$x = 4$, $y = -1$, $z = 2$', r'Keine Lösung'],
    [r'Jede Zeile ist eine Gleichung: $1x + 0y + 0z = 2$ usw.'])

# --------------------------------------------------------------- solving ----
Q.q(r'Löse $x + y = 5$, $x - y = 1$.',
    [r'$x = 3$, $y = 2$', r'$x = 2$, $y = 3$', r'$x = 4$, $y = 1$', r'$x = 5$, $y = 0$'],
    [r'Addieren: $2x = 6$, also $x = 3$.',
     r'Einsetzen: $y = 5 - 3 = 2$.'])

Q.q(r'Löse $' + aug((1, 2, 5), (3, 1, 5)) + r'$ mit $Z_2 - 3 \cdot Z_1$.',
    [r'$x = 1$, $y = 2$', r'$x = 2$, $y = 1$', r'$x = 5$, $y = 0$', r'$x = -1$, $y = 3$'],
    [r'$Z_2 - 3Z_1$: $(0 \;\; -5 \mid -10)$, also $y = 2$.',
     r'Erste Zeile: $x + 4 = 5$, also $x = 1$.'])

Q.q(r'Löse $2x + 3y = 12$, $4x - y = 10$.',
    [r'$x = 3$, $y = 2$', r'$x = 2$, $y = 3$', r'$x = 6$, $y = 0$', r'$x = 3$, $y = 4$'],
    [r'$Z_2 - 2Z_1$: $-7y = -14$, also $y = 2$.',
     r'$2x + 6 = 12$, also $x = 3$.'])

Q.q(r'Löse das Stufensystem $x + y + z = 6$, $y + z = 5$, $z = 3$.',
    [r'$x = 1$, $y = 2$, $z = 3$', r'$x = 3$, $y = 2$, $z = 1$', r'$x = 1$, $y = 5$, $z = 3$', r'$x = 6$, $y = 5$, $z = 3$'],
    [r'Von unten nach oben: $z = 3$.',
     r'$y = 5 - 3 = 2$, dann $x = 6 - 2 - 3 = 1$.'])

Q.q(r'Löse $x + y + z = 6$, $2x - y + z = 3$, $x + 2y - z = 2$.',
    [r'$x = 1$, $y = 2$, $z = 3$', r'$x = 2$, $y = 1$, $z = 3$', r'$x = 3$, $y = 2$, $z = 1$', r'$x = 0$, $y = 3$, $z = 3$'],
    [r'$Z_2 - 2Z_1$: $-3y - z = -9$; $Z_3 - Z_1$: $y - 2z = -4$.',
     r'Aus der zweiten: $y = 2z - 4$; eingesetzt: $-6z + 12 - z = -9$, also $z = 3$, $y = 2$.',
     r'Dann $x = 6 - 2 - 3 = 1$. Probe in allen drei Gleichungen.'])

Q.q(r'Warum macht man am Ende eine Probe?',
    [r'Um Rechenfehler zu finden: Die Lösung muss alle ursprünglichen Gleichungen erfüllen.',
     r'Weil das Verfahren manchmal falsche Lösungen liefert, auch ohne Rechenfehler.', r'Weil das CAS sonst nicht rechnet.',
     r'Eine Probe ist überflüssig.'],
    [r'Die Umformungen sind äquivalent, das Verfahren selbst ist zuverlässig.',
     r'Rechenfehler unterwegs fallen aber erst bei der Probe auf.'])

Q.q(r'Das CAS zeigt für ein System die reduzierte Form $' + aug((1, 0, 2, 3), (0, 1, -1, 1)) + r'$ (Variablen $x$, $y$, $z$). Was folgt?',
    [r'Unendlich viele Lösungen: $x = 3 - 2z$, $y = 1 + z$, $z$ beliebig.', r'Genau eine Lösung $x = 3$, $y = 1$.',
     r'Keine Lösung.', r'$x = 2$, $y = -1$, $z = 3$.'],
    [r'Zwei Gleichungen für drei Unbekannte: $z$ bleibt frei.',
     r'$x + 2z = 3$ und $y - z = 1$ nach $x$ bzw. $y$ auflösen.'])

# ---------------------------------------------------- number of solutions ----
Q.q(r'Nach den Umformungen steht die Zeile $(0 \;\; 0 \;\; 0 \mid 5)$. Was folgt?',
    [r'Das System hat keine Lösung.', r'Das System hat unendlich viele Lösungen.', r'$z = 5$', r'$x = y = z = 0$'],
    [r'Die Zeile bedeutet $0x + 0y + 0z = 5$, also $0 = 5$.',
     r'Ein Widerspruch: Die Lösungsmenge ist leer.'])

Q.q(r'Wie viele Lösungen hat $x + y = 2$, $2x + 2y = 4$?',
    [r'Unendlich viele', r'Keine', r'Genau eine', r'Genau zwei'],
    [r'Die zweite Gleichung ist das Doppelte der ersten.',
     r'Es bleibt nur eine Bedingung für zwei Unbekannte: Gerade aus Lösungen.'])

Q.q(r'Wie viele Lösungen hat $x + y = 2$, $2x + 2y = 5$?',
    [r'Keine', r'Unendlich viele', r'Genau eine', r'Genau zwei'],
    [r'$Z_2 - 2Z_1$: $0 = 1$, Widerspruch.',
     r'Geometrisch: zwei parallele Geraden.'])

Q.q(r'Was bedeutet geometrisch ein lineares Gleichungssystem mit zwei Gleichungen und zwei Unbekannten und genau einer Lösung?',
    [r'Zwei Geraden schneiden sich in genau einem Punkt.', r'Zwei Geraden sind parallel.', r'Zwei Geraden sind identisch.', r'Zwei Ebenen schneiden sich.'],
    [r'Jede Gleichung $ax + by = c$ beschreibt eine Gerade.',
     r'Die Lösung ist ihr Schnittpunkt.'])

# ----------------------------------------------------------- word problems ----
Q.q(r'2 Erwachsene und 3 Kinder zahlen 31 € Eintritt, 1 Erwachsener und 2 Kinder 18 €. Was kostet ein Kinderticket?',
    [r'5 €', r'8 €', r'6 €', r'4 €'],
    [r'$2E + 3K = 31$, $E + 2K = 18$',
     r'$Z_1 - 2Z_2$: $-K = -5$, also $K = 5$ und $E = 8$.'])

Q.q(r'Drei Zahlen haben die Summe 14. Die erste ist doppelt so groß wie die zweite, die dritte ist um 2 größer als die zweite. Wie heißt die zweite Zahl?',
    [r'3', r'6', r'5', r'4'],
    [r'$x = 2y$, $z = y + 2$, $x + y + z = 14$',
     r'$2y + y + y + 2 = 14 \Rightarrow 4y = 12 \Rightarrow y = 3$; dann $x = 6$, $z = 5$.'])

Q.q(r'Eine Parabel $y = ax^2 + bx + c$ geht durch $(0 \mid 1)$, $(1 \mid 2)$ und $(2 \mid 5)$. Wie lautet sie?',
    [r'$y = x^2 + 1$', r'$y = x^2 + x + 1$', r'$y = 2x^2 - x + 1$', r'$y = x + 1$'],
    [r'$c = 1$; $a + b + 1 = 2$; $4a + 2b + 1 = 5$',
     r'$a + b = 1$ und $2a + b = 2$, also $a = 1$, $b = 0$.',
     r'Vorgeschmack auf die Steckbriefaufgaben in Woche 15.'])

Q.q(r'Eine Firma braucht pro Stück $P_1$ 2 kg $R_1$ und 1 kg $R_2$, pro Stück $P_2$ 1 kg $R_1$ und 3 kg $R_2$. Vorrätig sind 40 kg $R_1$ und 70 kg $R_2$. Wie viele Stück lassen sich herstellen, wenn alles verbraucht wird?',
    [r'10 Stück $P_1$ und 20 Stück $P_2$', r'20 Stück $P_1$ und 10 Stück $P_2$', r'15 Stück $P_1$ und 10 Stück $P_2$', r'10 Stück $P_1$ und 15 Stück $P_2$'],
    [r'$2x + y = 40$, $x + 3y = 70$',
     r'$2 \cdot Z_2 - Z_1$: $5y = 100$, also $y = 20$ und $x = 10$.'])

Q.q(r'Ein Gleichungssystem hat 4 Unbekannte und 4 Gleichungen mit krummen Koeffizienten. Wie geht man im Unterricht sinnvoll vor?',
    [r'Mit dem CAS lösen und das Ergebnis am Sachverhalt prüfen.', r'Es ist grundsätzlich nicht lösbar.',
     r'Raten und einsetzen.', r'Eine Gleichung streichen.'],
    [r'Ohne Hilfsmittel sind laut Lehrplan bis zu drei Unbekannte mit einfachen Koeffizienten verlangt.',
     r'Darüber hinaus übernimmt das CAS das Rechnen; Deuten und Prüfen bleiben Handarbeit.'])


def check():
    import sympy as sp
    x, y, z, a, b, c, E, K = sp.symbols('x y z a b c E K')
    assert sp.solve([x + y - 5, x - y - 1], [x, y]) == {x: 3, y: 2}
    assert sp.solve([x + 2 * y - 5, 3 * x + y - 5], [x, y]) == {x: 1, y: 2}
    assert sp.solve([2 * x + 3 * y - 12, 4 * x - y - 10], [x, y]) == {x: 3, y: 2}
    assert sp.solve([x + y + z - 6, y + z - 5, z - 3], [x, y, z]) == {x: 1, y: 2, z: 3}
    assert sp.solve([x + y + z - 6, 2 * x - y + z - 3, x + 2 * y - z - 2], [x, y, z]) == {x: 1, y: 2, z: 3}
    assert sp.Matrix([[2, -1, 1, 3]]) - 2 * sp.Matrix([[1, 1, 1, 6]]) == sp.Matrix([[0, -3, -1, -9]])
    sol = sp.solve([x + 2 * z - 3, y - z - 1], [x, y])
    assert sol == {x: 3 - 2 * z, y: 1 + z}
    assert sp.solve([x + y - 2, 2 * x + 2 * y - 5], [x, y]) == []
    assert sp.solve([2 * E + 3 * K - 31, E + 2 * K - 18], [E, K]) == {E: 8, K: 5}
    assert sp.solve([x - 2 * y, z - y - 2, x + y + z - 14], [x, y, z]) == {x: 6, y: 3, z: 5}
    assert sp.solve([c - 1, a + b + c - 2, 4 * a + 2 * b + c - 5], [a, b, c]) == {a: 1, b: 0, c: 1}
    assert sp.solve([2 * x + y - 40, x + 3 * y - 70], [x, y]) == {x: 10, y: 20}


Q.verify(check)
Q.save()
