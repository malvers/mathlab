#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 13 / KW 48 (LB 2): matrices - linear systems as A x = b,
multiplying chained matrices, non-commutativity, rotations and interdependence.
Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11, vec


def mat(*rows):
    """Matrix as LaTeX pmatrix: mat((1, 2), (3, 4))."""
    return r'\begin{pmatrix} ' + r' \\ '.join(' & '.join(str(v) for v in r) for r in rows) + r' \end{pmatrix}'


Q = gy11(nr=13, slug='matrizen', thema='Matrizen und Gleichungssysteme', lb='LB 2',
         blurb='Matrizenschreibweise, Typ, Multiplikation verketteter Matrizen',
         comment='Blocks: notation and type (1-5), matrix times vector (6-9), matrix times matrix (10-15), applications (16-20).')

# ------------------------------------------------------ notation and type ----
Q.q(r'Wie schreibt man das Gleichungssystem $x + 2y = 5$, $3x - y = 1$ in der Form $A \cdot \vec{x} = \vec{b}$?',
    [r'$' + mat((1, 2), (3, -1)) + r' \cdot ' + vec('x', 'y') + ' = ' + vec(5, 1) + '$',
     r'$' + mat((1, 3), (2, -1)) + r' \cdot ' + vec('x', 'y') + ' = ' + vec(5, 1) + '$',
     r'$' + mat((1, 2), (3, 1)) + r' \cdot ' + vec('x', 'y') + ' = ' + vec(5, 1) + '$',
     r'$' + mat((5, 1), (1, 3)) + r' \cdot ' + vec('x', 'y') + ' = ' + vec(2, -1) + '$'],
    [r'Jede Gleichung liefert eine Zeile der Koeffizientenmatrix.',
     r'Erste Zeile $(1 \;\; 2)$, zweite Zeile $(3 \;\; -1)$; rechts der Vektor der Absolutglieder.'])

Q.q(r'Welchen Typ hat eine Matrix mit 2 Zeilen und 3 Spalten?',
    [r'$(2,3)$', r'$(3,2)$', r'$(2,2)$', r'$(6,1)$'],
    [r'Der Typ $(m,n)$ nennt zuerst die Zeilen, dann die Spalten.'])

Q.q(r'Wie lautet die Koeffizientenmatrix von $x + y + z = 6$, $2x - z = 1$, $y + 3z = 4$?',
    [r'$' + mat((1, 1, 1), (2, 0, -1), (0, 1, 3)) + '$', r'$' + mat((1, 1, 1), (2, -1, 0), (1, 3, 0)) + '$',
     r'$' + mat((1, 2, 0), (1, 0, 1), (1, -1, 3)) + '$', r'$' + mat((1, 1, 1), (2, 1, -1), (1, 1, 3)) + '$'],
    [r'Fehlende Variablen bekommen den Koeffizienten 0.',
     r'Die Spalten stehen für $x$, $y$, $z$ in fester Reihenfolge.'])

Q.q(r'Wie sieht die erweiterte Koeffizientenmatrix von $2x + y = 7$, $x - 3y = 0$ aus?',
    [r'$\left(\begin{array}{cc|c} 2 & 1 & 7 \\ 1 & -3 & 0 \end{array}\right)$',
     r'$\left(\begin{array}{cc|c} 2 & 1 & 0 \\ 1 & -3 & 7 \end{array}\right)$',
     r'$\left(\begin{array}{cc|c} 2 & 7 & 1 \\ 1 & 0 & -3 \end{array}\right)$',
     r'$\left(\begin{array}{cc|c} 1 & 2 & 7 \\ -3 & 1 & 0 \end{array}\right)$'],
    [r'Links die Koeffizienten, rechts vom Strich die Absolutglieder.'])

Q.q(r'Ist $(x;\,y;\,z) = (1;\,2;\,-1)$ eine Lösung von $' + mat((1, 1, 1), (2, -1, 3)) + r' \cdot \vec{x} = ' + vec(2, -3) + '$?',
    [r'Ja, beide Zeilen stimmen.', r'Nein, die erste Zeile stimmt nicht.', r'Nein, die zweite Zeile stimmt nicht.', r'Das lässt sich ohne Gauß-Verfahren nicht prüfen.'],
    [r'Erste Zeile: $1 + 2 - 1 = 2$',
     r'Zweite Zeile: $2 - 2 - 3 = -3$'])

# ------------------------------------------------------ matrix times vector ----
Q.q(r'Berechne $' + mat((1, 2), (3, 4)) + r' \cdot ' + vec(1, 1) + '$.',
    [r'$' + vec(3, 7) + '$', r'$' + vec(4, 6) + '$', r'$' + vec(1, 4) + '$', r'$' + vec(3, 4) + '$'],
    [r'Zeile mal Spalte: $1 \cdot 1 + 2 \cdot 1 = 3$',
     r'$3 \cdot 1 + 4 \cdot 1 = 7$'])

Q.q(r'Berechne $' + mat((2, 0, 1), (1, 3, -1)) + r' \cdot ' + vec(1, 2, 3) + '$.',
    [r'$' + vec(5, 4) + '$', r'$' + vec(5, 10) + '$', r'$' + vec(2, 6, 3) + '$', r'$' + vec(3, 4) + '$'],
    [r'$2 \cdot 1 + 0 \cdot 2 + 1 \cdot 3 = 5$',
     r'$1 \cdot 1 + 3 \cdot 2 + (-1) \cdot 3 = 4$',
     r'Typ $(2,3)$ mal $(3,1)$ ergibt Typ $(2,1)$.'])

Q.q(r'Welchen Typ hat das Produkt einer $(2,3)$-Matrix mit einer $(3,1)$-Matrix?',
    [r'$(2,1)$', r'$(3,3)$', r'$(2,3)$', r'Das Produkt ist nicht definiert.'],
    [r'Die inneren Zahlen müssen übereinstimmen (3 und 3).',
     r'Die äußeren ergeben den Typ des Produkts: $(2,1)$.'])

Q.q(r'Kann man eine $(3,2)$-Matrix mit einer $(3,2)$-Matrix multiplizieren?',
    [r'Nein, die Spaltenzahl der ersten (2) passt nicht zur Zeilenzahl der zweiten (3).', r'Ja, das Ergebnis hat den Typ $(3,2)$.',
     r'Ja, das Ergebnis hat den Typ $(3,3)$.', r'Ja, man multipliziert elementweise.'],
    [r'Für $A \cdot B$ braucht $A$ so viele Spalten, wie $B$ Zeilen hat.',
     r'Die Matrizen müssen „verkettet“ sein.'])

# ------------------------------------------------------ matrix times matrix ----
Q.q(r'Berechne $A \cdot B$ für $A = ' + mat((1, 2), (0, 1)) + '$ und $B = ' + mat((1, 0), (3, 1)) + '$.',
    [r'$' + mat((7, 2), (3, 1)) + '$', r'$' + mat((1, 2), (3, 7)) + '$', r'$' + mat((1, 0), (0, 1)) + '$', r'$' + mat((2, 2), (3, 2)) + '$'],
    [r'Element in Zeile $i$, Spalte $k$: Zeile $i$ von $A$ mal Spalte $k$ von $B$.',
     r'Erste Zeile: $1 \cdot 1 + 2 \cdot 3 = 7$ und $1 \cdot 0 + 2 \cdot 1 = 2$.',
     r'Zweite Zeile: $0 \cdot 1 + 1 \cdot 3 = 3$ und $0 \cdot 0 + 1 \cdot 1 = 1$.'])

Q.q(r'Mit denselben Matrizen: Berechne $B \cdot A$.',
    [r'$' + mat((1, 2), (3, 7)) + '$', r'$' + mat((7, 2), (3, 1)) + '$', r'$' + mat((1, 2), (3, 1)) + '$', r'$' + mat((1, 0), (3, 7)) + '$'],
    [r'Erste Zeile von $B$: $(1 \;\; 0)$, mal die Spalten von $A$: 1 und 2.',
     r'Zweite Zeile $(3 \;\; 1)$: $3 \cdot 1 + 1 \cdot 0 = 3$ und $3 \cdot 2 + 1 \cdot 1 = 7$.'])

Q.q(r'Was zeigen die beiden letzten Aufgaben?',
    [r'Die Matrizenmultiplikation ist nicht kommutativ: $A \cdot B \neq B \cdot A$.',
     r'Die Matrizenmultiplikation ist kommutativ.', r'Man darf Matrizen nicht multiplizieren.', r'$A \cdot B$ ist immer die Einheitsmatrix.'],
    [r'$A \cdot B$ und $B \cdot A$ haben verschiedene Ergebnisse.',
     r'Ein Gegenbeispiel genügt, um das Kommutativgesetz zu widerlegen.'])

Q.q(r'Welchen Typ hat das Produkt einer $(2,3)$-Matrix mit einer $(3,4)$-Matrix?',
    [r'$(2,4)$', r'$(3,3)$', r'$(4,2)$', r'Das Produkt ist nicht definiert.'],
    [r'Innen $3 = 3$: definiert.',
     r'Außen $(2,4)$.'])

Q.q(r'Berechne $A^2 = A \cdot A$ für $A = ' + mat((1, 1), (0, 1)) + '$.',
    [r'$' + mat((1, 2), (0, 1)) + '$', r'$' + mat((1, 1), (0, 1)) + '$', r'$' + mat((2, 2), (0, 2)) + '$', r'$' + mat((1, 1), (0, 0)) + '$'],
    [r'Erste Zeile: $1 \cdot 1 + 1 \cdot 0 = 1$, $1 \cdot 1 + 1 \cdot 1 = 2$.',
     r'Zweite Zeile: 0 und 1.',
     r'Falle: Man darf nicht elementweise quadrieren.'])

Q.q(r'Was ergibt $E \cdot \vec{x}$ mit der Einheitsmatrix $E = ' + mat((1, 0, 0), (0, 1, 0), (0, 0, 1)) + '$?',
    [r'$\vec{x}$', r'Den Nullvektor', r'$3\vec{x}$', r'Die Summe der Koordinaten'],
    [r'Jede Zeile von $E$ greift genau eine Koordinate heraus.',
     r'Die Einheitsmatrix spielt die Rolle der Zahl 1.'])

# ----------------------------------------------------------- applications ----
Q.q(r'Eine Firma braucht pro Produkt $P_1$ 2 kg Rohstoff $R_1$ und 1 kg $R_2$, pro $P_2$ 1 kg $R_1$ und 3 kg $R_2$. Wie viel Rohstoff braucht sie für 10 Stück $P_1$ und 20 Stück $P_2$?',
    [r'40 kg $R_1$ und 70 kg $R_2$', r'30 kg $R_1$ und 40 kg $R_2$', r'50 kg $R_1$ und 50 kg $R_2$', r'40 kg $R_1$ und 60 kg $R_2$'],
    [r'Bedarfsmatrix mal Produktionsvektor: $' + mat((2, 1), (1, 3)) + r' \cdot ' + vec(10, 20) + '$',
     r'$2 \cdot 10 + 1 \cdot 20 = 40$; $1 \cdot 10 + 3 \cdot 20 = 70$'])

Q.q(r'Die Matrix $D = ' + mat((0, -1), (1, 0)) + r'$ dreht Punkte um den Ursprung. Wohin wird $P(1 \mid 0)$ abgebildet?',
    [r'$P^{\prime}(0 \mid 1)$', r'$P^{\prime}(0 \mid -1)$', r'$P^{\prime}(-1 \mid 0)$', r'$P^{\prime}(1 \mid 0)$'],
    [r'$D \cdot ' + vec(1, 0) + ' = ' + vec(0, 1) + '$',
     r'Das ist eine Drehung um 90° gegen den Uhrzeigersinn.'])

Q.q(r'Wohin dreht dieselbe Matrix $D$ den Punkt $Q(2 \mid 1)$?',
    [r'$Q^{\prime}(-1 \mid 2)$', r'$Q^{\prime}(1 \mid -2)$', r'$Q^{\prime}(1 \mid 2)$', r'$Q^{\prime}(-2 \mid -1)$'],
    [r'$0 \cdot 2 + (-1) \cdot 1 = -1$',
     r'$1 \cdot 2 + 0 \cdot 1 = 2$'])

Q.q(r'Berechne $' + mat((1, 2), (3, 4)) + ' + ' + mat((0, 1), (-1, 2)) + '$.',
    [r'$' + mat((1, 3), (2, 6)) + '$', r'$' + mat((0, 2), (-3, 8)) + '$', r'$' + mat((1, 3), (4, 6)) + '$', r'$' + mat((1, 1), (2, 2)) + '$'],
    [r'Matrizen gleichen Typs werden elementweise addiert.',
     r'$1 + 0$, $2 + 1$, $3 + (-1)$, $4 + 2$'])

Q.q(r'Berechne $2 \cdot ' + mat((1, -1), (0, 3)) + '$.',
    [r'$' + mat((2, -2), (0, 6)) + '$', r'$' + mat((2, -1), (0, 3)) + '$', r'$' + mat((3, 1), (2, 5)) + '$', r'$' + mat((2, -2), (2, 6)) + '$'],
    [r'Eine Zahl mal Matrix: Jedes Element wird mit der Zahl multipliziert.',
     r'Die Null bleibt null.'])



def check():
    import sympy as sp
    M = sp.Matrix
    assert M([[1, 2], [3, -1]]) * M([1, 2]) == M([5, 1])          # x = 1, y = 2 solves it
    assert M([[1, 1, 1], [2, -1, 3]]) * M([1, 2, -1]) == M([2, -3])
    assert M([[1, 2], [3, 4]]) * M([1, 1]) == M([3, 7])
    assert M([[2, 0, 1], [1, 3, -1]]) * M([1, 2, 3]) == M([5, 4])
    A, B = M([[1, 2], [0, 1]]), M([[1, 0], [3, 1]])
    assert A * B == M([[7, 2], [3, 1]]) and B * A == M([[1, 2], [3, 7]]) and A * B != B * A
    assert (sp.zeros(2, 3) * sp.zeros(3, 4)).shape == (2, 4)
    assert M([[1, 1], [0, 1]]) ** 2 == M([[1, 2], [0, 1]])
    assert M([[2, 1], [1, 3]]) * M([10, 20]) == M([40, 70])
    D = M([[0, -1], [1, 0]])
    assert D * M([1, 0]) == M([0, 1]) and D * M([2, 1]) == M([-1, 2])
    assert M([[1, 2], [3, 4]]) + M([[0, 1], [-1, 2]]) == M([[1, 3], [2, 6]])
    assert 2 * M([[1, -1], [0, 3]]) == M([[2, -2], [0, 6]])


Q.verify(check)
Q.save()
