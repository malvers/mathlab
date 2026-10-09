#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 24 / KW 9 (LB 3): vectors - position and connecting vectors,
addition, subtraction, multiples, laws, vector quantities. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11, vec

Q = gy11(nr=24, slug='vektoren', thema='Vektoren: Addition, Subtraktion, Vielfache', lb='LB 3',
         blurb='Orts- und Verbindungsvektoren, Rechnen mit Vektoren, Rechengesetze',
         comment='Blocks: position and connecting vectors (1-4), computing (5-11), laws and chains (12-15), geometry and physics (16-20).')

# ------------------------------------------ position and connecting vectors ----
Q.q(r'Bestimme $\overrightarrow{AB}$ für $A(1 \mid 2 \mid 3)$ und $B(4 \mid 0 \mid 5)$.',
    [r'$' + vec(3, -2, 2) + '$', r'$' + vec(-3, 2, -2) + '$', r'$' + vec(5, 2, 8) + '$', r'$' + vec(4, 0, 5) + '$'],
    [r'„Spitze minus Fuß“: $\overrightarrow{AB} = \vec{b} - \vec{a}$.',
     r'$4 - 1 = 3$, $0 - 2 = -2$, $5 - 3 = 2$'])

Q.q(r'Wie lautet der Ortsvektor von $P(2 \mid -1 \mid 4)$?',
    [r'$' + vec(2, -1, 4) + '$', r'$' + vec(-2, 1, -4) + '$', r'$' + vec(4, -1, 2) + '$', r'$' + vec(0, 0, 0) + '$'],
    [r'Der Ortsvektor zeigt vom Ursprung zum Punkt.',
     r'Seine Koordinaten sind die Koordinaten des Punktes.'])

Q.q(r'Was ist ein Vektor?',
    [r'Die Menge aller gleich langen, parallelen und gleich gerichteten Pfeile.', r'Ein einzelner Punkt im Raum.',
     r'Eine Strecke ohne Richtung.', r'Eine Zahl mit Einheit.'],
    [r'Alle Pfeile einer solchen Klasse beschreiben dieselbe Verschiebung.',
     r'Jeder einzelne Pfeil ist ein Repräsentant des Vektors.'])

Q.q(r'Wie lautet der Gegenvektor von $\vec{a} = ' + vec(1, -2, 3) + '$?',
    [r'$' + vec(-1, 2, -3) + '$', r'$' + vec(1, 2, 3) + '$', r'$' + vec(3, -2, 1) + '$', r'$' + vec(-1, -2, -3) + '$'],
    [r'Der Gegenvektor hat dieselbe Länge und die entgegengesetzte Richtung.',
     r'Alle Koordinaten wechseln das Vorzeichen: $-\vec{a}$.'])

# --------------------------------------------------------------- computing ----
Q.q(r'Berechne $' + vec(1, 2, 3) + ' + ' + vec(2, -1, 0) + '$.',
    [r'$' + vec(3, 1, 3) + '$', r'$' + vec(-1, 3, 3) + '$', r'$' + vec(2, -2, 0) + '$', r'$' + vec(3, 3, 3) + '$'],
    [r'Koordinatenweise addieren.'])

Q.q(r'Berechne $' + vec(1, 2, 3) + ' - ' + vec(2, -1, 0) + '$.',
    [r'$' + vec(-1, 3, 3) + '$', r'$' + vec(1, -3, -3) + '$', r'$' + vec(-1, 1, 3) + '$', r'$' + vec(3, 1, 3) + '$'],
    [r'Koordinatenweise subtrahieren: $1 - 2$, $2 - (-1)$, $3 - 0$.'])

Q.q(r'Berechne $3 \cdot ' + vec(1, 2, 3) + '$.',
    [r'$' + vec(3, 6, 9) + '$', r'$' + vec(3, 2, 3) + '$', r'$' + vec(4, 5, 6) + '$', r'$' + vec(1, 2, 9) + '$'],
    [r'Jede Koordinate wird mit 3 multipliziert.',
     r'Der Pfeil wird dreimal so lang, die Richtung bleibt.'])

Q.q(r'Berechne $2\vec{a} - \vec{b}$ für $\vec{a} = ' + vec(1, 0, 2) + r'$ und $\vec{b} = ' + vec(3, 1, -1) + '$.',
    [r'$' + vec(-1, -1, 5) + '$', r'$' + vec(-1, -1, 3) + '$', r'$' + vec(5, 1, 3) + '$', r'$' + vec(-2, -1, 3) + '$'],
    [r'$2\vec{a} = ' + vec(2, 0, 4) + '$',
     r'$' + vec(2, 0, 4) + ' - ' + vec(3, 1, -1) + ' = ' + vec(-1, -1, 5) + '$'])

Q.q(r'Berechne den Betrag von $\vec{a} = ' + vec(2, 1, 2) + '$.',
    [r'3', r'5', r'9', r'$\sqrt{5}$'],
    [r'$|\vec{a}| = \sqrt{2^2 + 1^2 + 2^2} = \sqrt{9} = 3$'])

Q.q(r'Löse $\vec{x} + ' + vec(1, 2, 3) + ' = ' + vec(4, 0, 1) + r'$ nach $\vec{x}$ auf.',
    [r'$' + vec(3, -2, -2) + '$', r'$' + vec(5, 2, 4) + '$', r'$' + vec(-3, 2, 2) + '$', r'$' + vec(4, 0, 3) + '$'],
    [r'$\vec{x} = ' + vec(4, 0, 1) + ' - ' + vec(1, 2, 3) + '$'])

Q.q(r'Für welchen Vektor $\vec{a}$ gilt $3\vec{a} = ' + vec(6, -3, 9) + '$?',
    [r'$' + vec(2, -1, 3) + '$', r'$' + vec(18, -9, 27) + '$', r'$' + vec(3, 0, 6) + '$', r'$' + vec(2, 1, 3) + '$'],
    [r'Durch 3 teilen, koordinatenweise.'])

# ---------------------------------------------------------- laws and chains ----
Q.q(r'Welches Gesetz drückt $\vec{a} + \vec{b} = \vec{b} + \vec{a}$ aus?',
    [r'Kommutativgesetz', r'Assoziativgesetz', r'Distributivgesetz', r'Gesetz vom Nullvektor'],
    [r'Die Reihenfolge der Summanden darf vertauscht werden.',
     r'Geometrisch: Beide Wege um das Parallelogramm führen zum selben Punkt.'])

Q.q(r'Was ergibt $\overrightarrow{AB} + \overrightarrow{BC}$?',
    [r'$\overrightarrow{AC}$', r'$\overrightarrow{CA}$', r'$\overrightarrow{BB}$', r'$\overrightarrow{AB} \cdot \overrightarrow{BC}$'],
    [r'Vektorkette: Erst von $A$ nach $B$, dann von $B$ nach $C$.',
     r'Zusammen also von $A$ nach $C$.'])

Q.q(r'Was ergibt $\vec{a} + (-\vec{a})$?',
    [r'Den Nullvektor $\vec{o}$', r'$2\vec{a}$', r'Die Zahl 0', r'$\vec{a}$'],
    [r'Erst hin, dann gleich weit zurück.',
     r'Das Ergebnis ist ein Vektor, der Nullvektor, nicht die Zahl 0.'])

Q.q(r'Sind $\vec{a} = ' + vec(2, 4, -6) + r'$ und $\vec{b} = ' + vec(1, 2, -3) + '$ parallel?',
    [r'Ja, $\vec{a} = 2\vec{b}$.', r'Nein.', r'Nur in der $xy$-Ebene.', r'Ja, aber entgegengesetzt gerichtet.'],
    [r'Parallel (kollinear), wenn ein Vektor ein Vielfaches des anderen ist.',
     r'Jede Koordinate von $\vec{a}$ ist doppelt so groß: gleiche Richtung.'])

# ------------------------------------------------------ geometry and physics ----
Q.q(r'Das Parallelogramm $ABCD$ hat $A(1 \mid 1 \mid 0)$, $B(4 \mid 2 \mid 1)$ und $C(5 \mid 5 \mid 3)$. Bestimme $D$.',
    [r'$D(2 \mid 4 \mid 2)$', r'$D(8 \mid 6 \mid 4)$', r'$D(0 \mid -2 \mid -2)$', r'$D(4 \mid 4 \mid 2)$'],
    [r'Im Parallelogramm gilt $\overrightarrow{AD} = \overrightarrow{BC} = ' + vec(1, 3, 2) + '$.',
     r'$\vec{d} = \vec{a} + \overrightarrow{BC} = ' + vec(2, 4, 2) + '$'])

Q.q(r'Welche Größe ist KEINE vektorielle Größe?',
    [r'Masse', r'Kraft', r'Geschwindigkeit', r'Verschiebung'],
    [r'Vektorielle Größen haben Betrag und Richtung.',
     r'Die Masse hat nur einen Betrag, sie ist eine skalare Größe.'])

Q.q(r'Auf einen Körper wirken $\vec{F}_1 = ' + vec(3, 0, 0) + r'$ N und $\vec{F}_2 = ' + vec(0, 4, 0) + r'$ N. Wie groß ist die resultierende Kraft?',
    [r'5 N', r'7 N', r'1 N', r'12 N'],
    [r'$\vec{F} = \vec{F}_1 + \vec{F}_2 = ' + vec(3, 4, 0) + '$ N',
     r'$|\vec{F}| = \sqrt{9 + 16} = 5$ N'])

Q.q(r'Ein Flugzeug fliegt mit $' + vec(200, 0, 0) + r'$ km/h, der Wind weht mit $' + vec(0, -30, 0) + r'$ km/h. Welche Geschwindigkeit hat es über Grund?',
    [r'$' + vec(200, -30, 0) + r'$ km/h', r'$' + vec(170, 0, 0) + r'$ km/h', r'$' + vec(230, 0, 0) + r'$ km/h', r'$' + vec(200, 30, 0) + r'$ km/h'],
    [r'Geschwindigkeiten addieren sich vektoriell.',
     r'Der Wind versetzt das Flugzeug seitlich.'])

Q.q(r'Bestimme den Einheitsvektor in Richtung von $\vec{a} = ' + vec(0, 3, 4) + '$.',
    [r'$' + vec(0, r'\frac{3}{5}', r'\frac{4}{5}') + '$', r'$' + vec(0, 1, 1) + '$', r'$' + vec(0, r'\frac{3}{7}', r'\frac{4}{7}') + '$', r'$' + vec(0, 3, 4) + '$'],
    [r'$|\vec{a}| = \sqrt{0 + 9 + 16} = 5$',
     r'Durch den Betrag teilen: Der neue Vektor hat die Länge 1.'])


def check():
    import sympy as sp
    V = lambda *c: sp.Matrix(c)
    assert V(4, 0, 5) - V(1, 2, 3) == V(3, -2, 2)
    assert V(1, 2, 3) + V(2, -1, 0) == V(3, 1, 3) and V(1, 2, 3) - V(2, -1, 0) == V(-1, 3, 3)
    assert 3 * V(1, 2, 3) == V(3, 6, 9)
    assert 2 * V(1, 0, 2) - V(3, 1, -1) == V(-1, -1, 5)
    assert V(2, 1, 2).norm() == 3
    assert V(4, 0, 1) - V(1, 2, 3) == V(3, -2, -2)
    assert V(6, -3, 9) / 3 == V(2, -1, 3)
    assert V(2, 4, -6) == 2 * V(1, 2, -3)
    A, B, C = V(1, 1, 0), V(4, 2, 1), V(5, 5, 3)
    assert C - B == V(1, 3, 2) and A + (C - B) == V(2, 4, 2)
    assert (V(3, 0, 0) + V(0, 4, 0)).norm() == 5
    assert V(200, 0, 0) + V(0, -30, 0) == V(200, -30, 0)
    assert V(0, 3, 4) / V(0, 3, 4).norm() == V(0, sp.Rational(3, 5), sp.Rational(4, 5))


Q.verify(check)
Q.save()
