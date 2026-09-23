#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 2 (LB 1): Vektoren im Raum - Darstellung, Betrag,
Addition und Subtraktion, Vielfache. Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec

Q = fos12(nr=2, slug='vektoren', thema='Vektoren im Raum', lb='LB 1',
          blurb='Darstellungsformen, Betrag, Addition und Subtraktion, Vielfache',
          comment='Blocks: Betrag (1-5), Rechnen mit Vektoren (6-12), Begriffe und Anwendungen (13-20). Alles ohne CAS.')

# ------------------------------------------------------------ Betrag ----
Q.q(r'Berechne den Betrag von $\vec a = ' + vec(2, 3, 6) + '$.',
    [r'$|\vec a| = 7$', r'$|\vec a| = 11$', r'$|\vec a| = 49$', r'$|\vec a| = \sqrt{11}$'],
    [r'Betrag: $|\vec a| = \sqrt{a_1^2 + a_2^2 + a_3^2}$',
     r'$|\vec a| = \sqrt{4 + 9 + 36} = \sqrt{49} = 7$',
     r'Falle: die Koordinaten nur addieren ($11$) oder die Wurzel vergessen ($49$).'])

Q.q(r'Berechne den Betrag von $\vec b = ' + vec(1, -2, 2) + '$.',
    [r'$3$', r'$1$', r'$9$', r'$\sqrt{5}$'],
    [r'$|\vec b| = \sqrt{1^2 + (-2)^2 + 2^2} = \sqrt{1 + 4 + 4}$',
     r'$= \sqrt{9} = 3$',
     r'Beim Quadrieren verschwindet das Minus: $(-2)^2 = 4$.'])

Q.q(r'Wie lang ist die Strecke $\overline{AB}$ mit $A(1|1|1)$ und $B(3|3|2)$?',
    [r'$3$', r'$\sqrt{5}$', r'$9$', r'$5$'],
    [r'Verbindungsvektor: $\overrightarrow{AB} = \vec b - \vec a = ' + vec(2, 2, 1) + '$',
     r'Länge: $|\overrightarrow{AB}| = \sqrt{4 + 4 + 1} = \sqrt{9} = 3$'])

Q.q(r'Welcher Vektor hat den Betrag $1$?',
    [r'$' + vec(r'\tfrac{1}{2}', r'\tfrac{1}{2}', r'\tfrac{1}{\sqrt{2}}') + '$',
     r'$' + vec(1, 1, 1) + '$',
     r'$' + vec(r'0{,}5', r'0{,}5', r'0{,}5') + '$',
     r'$' + vec(1, 0, 1) + '$'],
    [r'$\left(\tfrac{1}{2}\right)^2 + \left(\tfrac{1}{2}\right)^2 + \left(\tfrac{1}{\sqrt{2}}\right)^2 = \tfrac{1}{4} + \tfrac{1}{4} + \tfrac{1}{2} = 1$, Wurzel daraus ist $1$.',
     r'Die anderen: $\sqrt{3}$, $\sqrt{0{,}75}$ und $\sqrt{2}$.',
     r'Ein Vektor vom Betrag $1$ heißt Einheitsvektor.'])

Q.q(r'Der Punkt $P(3|-1|2)$ hat welchen Abstand vom Ursprung?',
    [r'$\sqrt{14} \approx 3{,}74$', r'$4$', r'$\sqrt{6} \approx 2{,}45$', r'$14$'],
    [r'Der Abstand vom Ursprung ist der Betrag des Ortsvektors $\overrightarrow{OP} = ' + vec(3, -1, 2) + '$.',
     r'$|\overrightarrow{OP}| = \sqrt{9 + 1 + 4} = \sqrt{14} \approx 3{,}74$'])

# ------------------------------------------------- Rechnen mit Vektoren ----
Q.q(r'Berechne $' + vec(1, 2, 3) + ' + ' + vec(4, -1, 0) + '$.',
    [r'$' + vec(5, 1, 3) + '$', r'$' + vec(5, 3, 3) + '$', r'$' + vec(-3, 3, 3) + '$', r'$' + vec(4, -2, 0) + '$'],
    [r'Vektoren werden koordinatenweise addiert: $1 + 4$, $2 + (-1)$, $3 + 0$.',
     r'Ergebnis: $' + vec(5, 1, 3) + '$'])

Q.q(r'Berechne $' + vec(2, 5, -1) + ' - ' + vec(3, -2, 4) + '$.',
    [r'$' + vec(-1, 7, -5) + '$', r'$' + vec(-1, 3, 3) + '$', r'$' + vec(1, -7, 5) + '$', r'$' + vec(5, 3, 3) + '$'],
    [r'Koordinatenweise subtrahieren: $2 - 3 = -1$, $5 - (-2) = 7$, $-1 - 4 = -5$.',
     r'Ergebnis: $' + vec(-1, 7, -5) + '$',
     r'Falle: $5 - (-2)$ ist $7$, nicht $3$.'])

Q.q(r'Berechne $3 \cdot ' + vec(2, -1, 4) + '$.',
    [r'$' + vec(6, -3, 12) + '$', r'$' + vec(5, 2, 7) + '$', r'$' + vec(6, -1, 4) + '$', r'$' + vec(6, 3, 12) + '$'],
    [r'Jede Koordinate wird mit $3$ multipliziert.',
     r'$' + vec(6, -3, 12) + '$ - das Minus bleibt erhalten.'])

Q.q(r'Berechne $2 \cdot ' + vec(1, 0, 2) + ' - ' + vec(3, 1, 4) + '$.',
    [r'$' + vec(-1, -1, 0) + '$', r'$' + vec(-1, 1, 0) + '$', r'$' + vec(5, 1, 8) + '$', r'$' + vec(1, -1, 0) + '$'],
    [r'Erst das Vielfache: $2 \cdot ' + vec(1, 0, 2) + ' = ' + vec(2, 0, 4) + '$',
     r'Dann subtrahieren: $' + vec(2, 0, 4) + ' - ' + vec(3, 1, 4) + ' = ' + vec(-1, -1, 0) + '$'])

Q.q(r'Bestimme den Verbindungsvektor $\overrightarrow{AB}$ für $A(1|2|3)$ und $B(4|0|7)$.',
    [r'$' + vec(3, -2, 4) + '$', r'$' + vec(-3, 2, -4) + '$', r'$' + vec(5, 2, 10) + '$', r'$' + vec(4, 0, 7) + '$'],
    [r'Merkregel: „Spitze minus Fuß“, also $\overrightarrow{AB} = \vec b - \vec a$.',
     r'$' + vec(4, 0, 7) + ' - ' + vec(1, 2, 3) + ' = ' + vec(3, -2, 4) + '$',
     r'$' + vec(-3, 2, -4) + r'$ wäre $\overrightarrow{BA}$, der Gegenvektor.'])

Q.q(r'Welchen Ortsvektor hat der Mittelpunkt $M$ der Strecke $\overline{AB}$ mit $A(2|4|6)$ und $B(4|0|2)$?',
    [r'$' + vec(3, 2, 4) + '$', r'$' + vec(6, 4, 8) + '$', r'$' + vec(1, -2, -2) + '$', r'$' + vec(2, 4, 4) + '$'],
    [r'Mittelpunkt: $\vec m = \tfrac{1}{2}\,(\vec a + \vec b)$',
     r'$\vec a + \vec b = ' + vec(6, 4, 8) + '$, halbiert: $' + vec(3, 2, 4) + '$'])

Q.q(r'Für welche Zahl $k$ gilt $' + vec(2, 4, -6) + r' = k \cdot ' + vec(-1, -2, 3) + '$?',
    [r'$k = -2$', r'$k = 2$', r'$k = -\tfrac{1}{2}$', r'es gibt kein solches $k$'],
    [r'Erste Koordinate: $2 = k \cdot (-1)$, also $k = -2$.',
     r'Probe in den anderen Koordinaten: $-2 \cdot (-2) = 4$ und $-2 \cdot 3 = -6$. Passt.',
     r'Die beiden Vektoren sind also parallel (kollinear), aber entgegengesetzt gerichtet.'])

# ------------------------------------------------ Begriffe und Anwendungen ----
Q.q(r'Welche Aussage über Vektoren ist richtig?',
    [r'Zwei Pfeile mit gleicher Länge, gleicher Richtung und gleicher Orientierung stellen denselben Vektor dar.',
     r'Ein Vektor ist an einen festen Anfangspunkt gebunden.',
     r'Zwei Pfeile mit gleicher Länge stellen immer denselben Vektor dar.',
     r'Ein Vektor hat keine Richtung, nur eine Länge.'],
    [r'Ein Vektor ist die Klasse aller Pfeile, die in Länge, Richtung und Orientierung übereinstimmen.',
     r'Deshalb darf man einen Pfeil verschieben, ohne dass sich der Vektor ändert.',
     r'Gleiche Länge allein reicht nicht - die Richtung muss auch stimmen.'])

Q.q(r'Der Vektor $\vec a$ hat den Betrag $5$. Welchen Betrag hat $-3\,\vec a$?',
    [r'$15$', r'$-15$', r'$2$', r'$5$'],
    [r'Beim Vervielfachen gilt $|k \cdot \vec a| = |k| \cdot |\vec a|$.',
     r'$|-3| \cdot 5 = 15$ - ein Betrag ist nie negativ, das Minus dreht nur die Richtung um.'])

Q.q(r'Wie lautet der Gegenvektor zu $' + vec(-1, 5, 2) + '$?',
    [r'$' + vec(1, -5, -2) + '$', r'$' + vec(1, 5, 2) + '$', r'$' + vec(-1, -5, -2) + '$', r'$' + vec(0, 0, 0) + '$'],
    [r'Der Gegenvektor $-\vec a$ kehrt jedes Vorzeichen um.',
     r'$' + vec(1, -5, -2) + r'$; Probe: $\vec a + (-\vec a) = \vec 0$.'])

Q.q(r'Welcher Vektor hat die Richtung von $\vec a = ' + vec(1, 2, 2) + '$ und den Betrag $6$?',
    [r'$' + vec(2, 4, 4) + '$', r'$' + vec(6, 12, 12) + '$', r'$' + vec(3, 6, 6) + '$', r'$' + vec(1, 2, 2) + '$'],
    [r'$|\vec a| = \sqrt{1 + 4 + 4} = 3$, gesucht ist also $2 \cdot \vec a$.',
     r'$2 \cdot ' + vec(1, 2, 2) + ' = ' + vec(2, 4, 4) + r'$, Probe: $\sqrt{4 + 16 + 16} = \sqrt{36} = 6$.'])

Q.q(r'Bestimme den Einheitsvektor zu $\vec a = ' + vec(0, 3, 4) + '$.',
    [r'$' + vec(0, r'0{,}6', r'0{,}8') + '$', r'$' + vec(0, 3, 4) + '$', r'$' + vec(0, r'0{,}3', r'0{,}4') + '$', r'$' + vec(0, r'\tfrac{1}{3}', r'\tfrac{1}{4}') + '$'],
    [r'$|\vec a| = \sqrt{0 + 9 + 16} = 5$',
     r'Einheitsvektor: $\vec a^{\,0} = \tfrac{1}{5}\,\vec a = ' + vec(0, r'0{,}6', r'0{,}8') + '$',
     r'Probe: $0{,}36 + 0{,}64 = 1$.'])

Q.q(r'Auf einen Körper wirken die Kräfte $\vec F_1 = ' + vec(3, 0, 0) + r'\,\mathrm{N}$ und $\vec F_2 = ' + vec(0, 4, 0) + r'\,\mathrm{N}$. Wie groß ist die resultierende Kraft?',
    [r'$5\,\mathrm{N}$', r'$7\,\mathrm{N}$', r'$1\,\mathrm{N}$', r'$12\,\mathrm{N}$'],
    [r'Resultierende: $\vec F = \vec F_1 + \vec F_2 = ' + vec(3, 4, 0) + r'\,\mathrm{N}$',
     r'Betrag: $|\vec F| = \sqrt{9 + 16} = 5\,\mathrm{N}$ - das 3-4-5-Dreieck.',
     r'Beträge darf man nur addieren, wenn die Kräfte in dieselbe Richtung zeigen.'])

Q.q(r'Ein Quader hat die Ecken $A(0|0|0)$, $B(4|0|0)$, $D(0|3|0)$ und $E(0|0|2)$. Wie lang ist die Raumdiagonale $\overline{AG}$?',
    [r'$\sqrt{29} \approx 5{,}39$', r'$9$', r'$5$', r'$\sqrt{20} \approx 4{,}47$'],
    [r'Die gegenüberliegende Ecke ist $G(4|3|2)$, also $\overrightarrow{AG} = ' + vec(4, 3, 2) + '$.',
     r'$|\overrightarrow{AG}| = \sqrt{16 + 9 + 4} = \sqrt{29} \approx 5{,}39$',
     r'$5$ wäre nur die Flächendiagonale $\overline{AC}$ in der Grundfläche.'])

Q.q(r'Bestimme $x$, $y$ und $z$ so, dass $' + vec('x', 2, 'z') + ' + ' + vec(1, 'y', 3) + ' = ' + vec(4, 5, 0) + '$ gilt.',
    [r'$x = 3$, $y = 3$, $z = -3$', r'$x = 5$, $y = 7$, $z = 3$', r'$x = 3$, $y = 3$, $z = 3$', r'$x = -3$, $y = -3$, $z = 3$'],
    [r'Koordinatenweise: $x + 1 = 4$, $2 + y = 5$, $z + 3 = 0$',
     r'Also $x = 3$, $y = 3$ und $z = -3$.'])


def check():
    from fractions import Fraction as F
    from math import isqrt
    n2 = lambda *c: sum(x * x for x in c)
    assert isqrt(n2(2, 3, 6)) == 7 and n2(2, 3, 6) == 49 and 2 + 3 + 6 == 11
    assert isqrt(n2(1, -2, 2)) == 3
    assert (3 - 1, 3 - 1, 2 - 1) == (2, 2, 1) and isqrt(n2(2, 2, 1)) == 3
    assert F(1, 4) + F(1, 4) + F(1, 2) == 1 and n2(1, 1, 1) == 3 and n2(1, 0, 1) == 2
    assert 3 * F(1, 4) == F(3, 4)
    assert n2(3, -1, 2) == 14 and abs(14 ** 0.5 - 3.74) < 0.005 and n2(2, 2, 1) + 1 == 10  # sqrt6 distractor ~2.45
    assert abs(6 ** 0.5 - 2.45) < 0.005
    assert (1 + 4, 2 - 1, 3 + 0) == (5, 1, 3)
    assert (2 - 3, 5 + 2, -1 - 4) == (-1, 7, -5)
    assert (3 * 2, 3 * -1, 3 * 4) == (6, -3, 12)
    assert (2 * 1 - 3, 2 * 0 - 1, 2 * 2 - 4) == (-1, -1, 0)
    assert (4 - 1, 0 - 2, 7 - 3) == (3, -2, 4)
    assert ((2 + 4) / 2, (4 + 0) / 2, (6 + 2) / 2) == (3, 2, 4)
    assert (-2 * -1, -2 * -2, -2 * 3) == (2, 4, -6)
    assert abs(-3) * 5 == 15
    assert (-(-1), -5, -2) == (1, -5, -2)
    assert isqrt(n2(1, 2, 2)) == 3 and isqrt(n2(2, 4, 4)) == 6
    assert isqrt(n2(0, 3, 4)) == 5 and F(3, 5) == F(6, 10) and F(4, 5) == F(8, 10) and F(9, 25) + F(16, 25) == 1
    assert isqrt(n2(3, 4, 0)) == 5
    assert n2(4, 3, 2) == 29 and abs(29 ** 0.5 - 5.39) < 0.005 and isqrt(n2(4, 3, 0)) == 5 and abs(20 ** 0.5 - 4.47) < 0.005
    assert (4 - 1, 5 - 2, 0 - 3) == (3, 3, -3)


Q.verify(check)
Q.save()
