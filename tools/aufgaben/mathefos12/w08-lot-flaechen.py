#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 8 (LB 1): Lotgerade, Lotfußpunkt, Abstand Punkt-Ebene,
Flächeninhalt von Parallelogramm und Dreieck mit dem Vektorprodukt, Anwendungen.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec

Q = fos12(nr=8, slug='lot-flaechen', thema='Lot und Flächeninhalt', lb='LB 1',
          blurb='Lotgerade, Lotfußpunkt, Abstand Punkt–Ebene, Flächeninhalt mit dem Vektorprodukt',
          comment='Blocks: Lotgerade und Lotfußpunkt (1-6), Abstand Punkt-Ebene (7-11), Flächeninhalt mit dem Vektorprodukt (12-17), Anwendungen (18-20). Alles ohne CAS.')

# ------------------------------------------------ Lotgerade und Lotfußpunkt ----
Q.q(r'Stelle die Gleichung der Lotgeraden $l$ durch $P(1|2|3)$ auf die Ebene $E\colon 2x - y + 2z = 5$ auf.',
    [r'$l\colon \vec x = ' + vec(1, 2, 3) + r' + t \cdot ' + vec(2, -1, 2) + r'$',
     r'$l\colon \vec x = ' + vec(1, 2, 3) + r' + t \cdot ' + vec(1, 2, 0) + r'$',
     r'$l\colon \vec x = ' + vec(1, 2, 3) + r' + t \cdot ' + vec(1, 2, 3) + r'$',
     r'$l\colon \vec x = ' + vec(2, -1, 2) + r' + t \cdot ' + vec(1, 2, 3) + r'$'],
    [r'Die Lotgerade steht senkrecht auf $E$, ihr Richtungsvektor ist also der Normalenvektor $\vec n = ' + vec(2, -1, 2) + r'$.',
     r'Stützpunkt ist $P$: $l\colon \vec x = ' + vec(1, 2, 3) + r' + t \cdot ' + vec(2, -1, 2) + r'$',
     r'Falle: $' + vec(1, 2, 0) + r'$ liegt in $E$ ($2 - 2 + 0 = 0$), das wäre kein Lot.'])

Q.q(r'Die Ebene $E\colon \vec x = ' + vec(1, 0, 0) + r' + r \cdot ' + vec(1, 1, 0) + r' + s \cdot ' + vec(0, 1, 1) + r'$ ist in Parameterform gegeben. Welcher Vektor ist ein Richtungsvektor der Lotgeraden auf $E$?',
    [r'$' + vec(1, -1, 1) + r'$', r'$' + vec(1, 1, 0) + r'$', r'$' + vec(0, 1, 1) + r'$', r'$' + vec(1, 1, 1) + r'$'],
    [r'Das Lot ist parallel zum Normalenvektor $\vec n = \vec u \times \vec v$.',
     r'$' + vec(1, 1, 0) + r' \times ' + vec(0, 1, 1) + r' = ' + vec(r'1 \cdot 1 - 0 \cdot 1', r'0 \cdot 0 - 1 \cdot 1', r'1 \cdot 1 - 1 \cdot 0') + r' = ' + vec(1, -1, 1) + r'$',
     r'Probe: $\vec n \cdot \vec u = 1 - 1 + 0 = 0$ und $\vec n \cdot \vec v = 0 - 1 + 1 = 0$.'])

Q.q(r'Die Gerade $l\colon \vec x = ' + vec(2, -1, 7) + r' + t \cdot ' + vec(1, 2, -2) + r'$ ist die Lotgerade durch $P(2|-1|7)$ auf $E\colon x + 2y - 2z = -5$. Bestimme den Lotfußpunkt $F$.',
    [r'$F(3|1|5)$', r'$F(1|-3|9)$', r'$F(2|-1|7)$', r'$F(4|3|3)$'],
    [r'$l$ in $E$ einsetzen: $(2 + t) + 2(-1 + 2t) - 2(7 - 2t) = -5$',
     r'$9t - 14 = -5$, also $t = 1$',
     r'$F = ' + vec(2, -1, 7) + r' + 1 \cdot ' + vec(1, 2, -2) + r' = ' + vec(3, 1, 5) + r'$; Probe: $3 + 2 - 10 = -5$.'])

Q.q(r'Bestimme den Lotfußpunkt $F$ von $P(2|3|1)$ auf die Ebene $E\colon x + 2y + 2z = 1$.',
    [r'$F(1|1|-1)$', r'$F(3|5|3)$', r'$F(1|1|1)$', r'$F(0|-1|-3)$'],
    [r'Lotgerade: $\vec x = ' + vec(2, 3, 1) + r' + t \cdot ' + vec(1, 2, 2) + r'$',
     r'Einsetzen: $(2 + t) + 2(3 + 2t) + 2(1 + 2t) = 10 + 9t = 1$, also $t = -1$',
     r'$F(1|1|-1)$; Probe: $1 + 2 - 2 = 1$. Passt.',
     r'Falle: mit $t = +1$ landet man auf der falschen Seite bei $(3|5|3)$.'])

Q.q(r'Bestimme den Lotfußpunkt $F$ von $P(4|0|5)$ auf die Ebene $E\colon 2x - 2y + z = 4$.',
    [r'$F(2|2|4)$', r'$F(6|-2|6)$', r'$F(2|2|5)$', r'$F(0|4|3)$'],
    [r'Lotgerade: $\vec x = ' + vec(4, 0, 5) + r' + t \cdot ' + vec(2, -2, 1) + r'$',
     r'Einsetzen: $2(4 + 2t) - 2(-2t) + (5 + t) = 13 + 9t = 4$, also $t = -1$',
     r'$F = ' + vec(4, 0, 5) + r' - ' + vec(2, -2, 1) + r' = ' + vec(2, 2, 4) + r'$; Probe: $4 - 4 + 4 = 4$.'])

Q.q(r'Welche Aussage über die Lotgerade $l$ von einem Punkt $P$ auf eine Ebene $E$ ist richtig?',
    [r'Ihr Richtungsvektor ist ein Normalenvektor von $E$, und der Lotfußpunkt ist der Schnittpunkt von $l$ und $E$.',
     r'Ihr Richtungsvektor ist ein Spannvektor von $E$.',
     r'Ihr Richtungsvektor ist der Ortsvektor von $P$.',
     r'Sie verläuft parallel zu $E$ durch den Punkt $P$.'],
    [r'Ein Lot steht senkrecht auf der Ebene - genau das leistet der Normalenvektor $\vec n$.',
     r'Der Lotfußpunkt $F$ ist der Durchstoßpunkt der Lotgeraden mit $E$; $|\overrightarrow{PF}|$ ist der Abstand von $P$ zu $E$.'])

# ------------------------------------------------------ Abstand Punkt-Ebene ----
Q.q(r'Berechne den Abstand des Punktes $P(1|2|3)$ von der Ebene $E\colon 2x + 3y + 6z = 5$.',
    [r'$d = 3$', r'$d = 21$', r'$d \approx 3{,}71$', r'$d = \dfrac{3}{7}$'],
    [r'Abstandsformel: $d = \dfrac{|2 \cdot 1 + 3 \cdot 2 + 6 \cdot 3 - 5|}{\sqrt{2^2 + 3^2 + 6^2}} = \dfrac{|26 - 5|}{7}$',
     r'$d = \dfrac{21}{7} = 3$',
     r'Falle: das Teilen durch $|\vec n| = 7$ vergessen ($21$) oder durch $|\vec n|^2 = 49$ teilen ($\tfrac{3}{7}$).'])

Q.q(r'Berechne den Abstand des Punktes $P(4|-1|2)$ von der Ebene $E\colon 3y + 4z = 10$.',
    [r'$d = 1$', r'$d = -1$', r'$d = 5$', r'$d = 0{,}2$'],
    [r'Normalenvektor $\vec n = ' + vec(0, 3, 4) + r'$, $|\vec n| = \sqrt{0 + 9 + 16} = 5$',
     r'$d = \dfrac{|0 \cdot 4 + 3 \cdot (-1) + 4 \cdot 2 - 10|}{5} = \dfrac{|-5|}{5} = 1$',
     r'Ein Abstand ist nie negativ - der Betrag gehört dazu.'])

Q.q(r'Welchen Abstand hat der Koordinatenursprung von der Ebene $E\colon 2x - y + 2z = 12$?',
    [r'$d = 4$', r'$d = 12$', r'$d = \dfrac{4}{3}$', r'$d = 6$'],
    [r'$|\vec n| = \sqrt{4 + 1 + 4} = 3$',
     r'$d = \dfrac{|2 \cdot 0 - 0 + 2 \cdot 0 - 12|}{3} = \dfrac{12}{3} = 4$',
     r'Falle: durch $|\vec n|^2 = 9$ statt durch $|\vec n| = 3$ teilen liefert $\tfrac{4}{3}$.'])

Q.q(r'Die Ebene $E\colon \vec x = ' + vec(1, 0, 0) + r' + r \cdot ' + vec(1, 0, 1) + r' + s \cdot ' + vec(0, 1, 0) + r'$ und der Punkt $P(4|5|1)$ sind gegeben. Berechne den Abstand von $P$ zu $E$.',
    [r'$d = \sqrt{2} \approx 1{,}41$', r'$d = 2$', r'$d = 3$', r'$d = 2\sqrt{2} \approx 2{,}83$'],
    [r'Normalenvektor: $' + vec(1, 0, 1) + r' \times ' + vec(0, 1, 0) + r' = ' + vec(-1, 0, 1) + r'$, kürzer $\vec n = ' + vec(1, 0, -1) + r'$',
     r'Koordinatengleichung mit Stützpunkt $(1|0|0)$: $x - z = 1$',
     r'$d = \dfrac{|4 - 1 - 1|}{\sqrt{1 + 1}} = \dfrac{2}{\sqrt{2}} = \sqrt{2} \approx 1{,}41$'])

Q.q(r'Ein Sensor hängt im Punkt $P(2|1|10)$ über einer geneigten Rampe, die in der Ebene $E\colon 2x + 2y + z = 4$ liegt (Angaben in Metern). Wie weit ist der Sensor von der Rampe entfernt?',
    [r'$4\,\mathrm{m}$', r'$12\,\mathrm{m}$', r'$\approx 5{,}33\,\mathrm{m}$', r'$10\,\mathrm{m}$'],
    [r'Gesucht ist der Abstand Punkt-Ebene: $d = \dfrac{|2 \cdot 2 + 2 \cdot 1 + 10 - 4|}{\sqrt{4 + 4 + 1}} = \dfrac{12}{3}$',
     r'$d = 4\,\mathrm{m}$',
     r'Falle: die Höhe $z = 10$ ist nicht der Abstand zur geneigten Rampe; ohne die $-4$ käme $\tfrac{16}{3} \approx 5{,}33$ heraus.'])

# --------------------------------------- Flächeninhalt mit dem Vektorprodukt ----
Q.q(r'Berechne das Vektorprodukt $' + vec(1, 2, 0) + r' \times ' + vec(0, 1, 3) + r'$.',
    [r'$' + vec(6, -3, 1) + r'$', r'$' + vec(6, 3, 1) + r'$', r'$' + vec(-6, 3, -1) + r'$', r'$' + vec(0, 2, 0) + r'$'],
    [r'$\vec a \times \vec b = ' + vec(r'a_2 b_3 - a_3 b_2', r'a_3 b_1 - a_1 b_3', r'a_1 b_2 - a_2 b_1') + r'$',
     r'$= ' + vec(r'2 \cdot 3 - 0 \cdot 1', r'0 \cdot 0 - 1 \cdot 3', r'1 \cdot 1 - 2 \cdot 0') + r' = ' + vec(6, -3, 1) + r'$',
     r'Probe: $' + vec(6, -3, 1) + r' \cdot ' + vec(1, 2, 0) + r' = 6 - 6 + 0 = 0$. Der Vektor steht senkrecht auf beiden.',
     r'Falle: koordinatenweise multiplizieren ($' + vec(0, 2, 0) + r'$) ist kein Vektorprodukt.'])

Q.q(r'Berechne den Flächeninhalt des Parallelogramms, das von $\vec u = ' + vec(1, 2, 2) + r'$ und $\vec v = ' + vec(2, 1, -2) + r'$ aufgespannt wird.',
    [r'$A = 9$', r'$A = 81$', r'$A = 3$', r'$A = 4{,}5$'],
    [r'$\vec u \times \vec v = ' + vec(r'2 \cdot (-2) - 2 \cdot 1', r'2 \cdot 2 - 1 \cdot (-2)', r'1 \cdot 1 - 2 \cdot 2') + r' = ' + vec(-6, 6, -3) + r'$',
     r'$A = |\vec u \times \vec v| = \sqrt{36 + 36 + 9} = \sqrt{81} = 9$',
     r'Falle: die Wurzel vergessen ($81$) oder das Parallelogramm halbieren ($4{,}5$ wäre das Dreieck).'])

Q.q(r'Berechne den Flächeninhalt des Dreiecks $ABC$ mit $A(1|1|0)$, $B(2|3|2)$ und $C(3|-1|1)$.',
    [r'$A = 4{,}5$', r'$A = 9$', r'$A = 3$', r'$A = 18$'],
    [r'$\overrightarrow{AB} = ' + vec(1, 2, 2) + r'$, $\overrightarrow{AC} = ' + vec(2, -2, 1) + r'$',
     r'$\overrightarrow{AB} \times \overrightarrow{AC} = ' + vec(r'2 \cdot 1 - 2 \cdot (-2)', r'2 \cdot 2 - 1 \cdot 1', r'1 \cdot (-2) - 2 \cdot 2') + r' = ' + vec(6, 3, -6) + r'$',
     r'$A = \tfrac{1}{2}\,|' + vec(6, 3, -6) + r'| = \tfrac{1}{2} \cdot \sqrt{36 + 9 + 36} = \tfrac{1}{2} \cdot 9 = 4{,}5$'])

Q.q(r'Ein Parallelogramm $ABCD$ hat die Ecken $A(1|1|1)$, $B(3|1|2)$ und $D(1|4|1)$. Berechne seinen Flächeninhalt.',
    [r'$A = 3\sqrt{5} \approx 6{,}71$', r'$A = 6$', r'$A = 45$', r'$A \approx 3{,}35$'],
    [r'$\overrightarrow{AB} = ' + vec(2, 0, 1) + r'$, $\overrightarrow{AD} = ' + vec(0, 3, 0) + r'$',
     r'$\overrightarrow{AB} \times \overrightarrow{AD} = ' + vec(r'0 \cdot 0 - 1 \cdot 3', r'1 \cdot 0 - 2 \cdot 0', r'2 \cdot 3 - 0 \cdot 0') + r' = ' + vec(-3, 0, 6) + r'$',
     r'$A = \sqrt{9 + 0 + 36} = \sqrt{45} = 3\sqrt{5} \approx 6{,}71$',
     r'Falle: $2 \cdot 3 = 6$ ignoriert die $z$-Koordinate von $\overrightarrow{AB}$.'])

Q.q(r'Was gibt der Betrag des Vektorprodukts $|\vec u \times \vec v|$ an?',
    [r'den Flächeninhalt des von $\vec u$ und $\vec v$ aufgespannten Parallelogramms',
     r'den Flächeninhalt des von $\vec u$ und $\vec v$ aufgespannten Dreiecks',
     r'das Produkt der Beträge $|\vec u| \cdot |\vec v|$',
     r'den Winkel zwischen $\vec u$ und $\vec v$'],
    [r'$|\vec u \times \vec v| = |\vec u| \cdot |\vec v| \cdot \sin\varphi$ - das ist Grundseite mal Höhe, also die Parallelogrammfläche.',
     r'Das Dreieck ist die Hälfte davon: $A_\triangle = \tfrac{1}{2}\,|\vec u \times \vec v|$.',
     r'$|\vec u| \cdot |\vec v|$ stimmt nur, wenn die Vektoren senkrecht stehen ($\sin 90^\circ = 1$).'])

Q.q(r'Zwei Vektoren haben die Beträge $|\vec u| = 4$ und $|\vec v| = 5$ und schließen den Winkel $30^\circ$ ein. Welchen Flächeninhalt hat das von ihnen aufgespannte Parallelogramm?',
    [r'$A = 10$', r'$A = 20$', r'$A = 10\sqrt{3} \approx 17{,}32$', r'$A = 5$'],
    [r'$A = |\vec u \times \vec v| = |\vec u| \cdot |\vec v| \cdot \sin\varphi = 4 \cdot 5 \cdot \sin 30^\circ$',
     r'$A = 20 \cdot 0{,}5 = 10$',
     r'Falle: mit $\cos 30^\circ$ rechnet man das Skalarprodukt ($10\sqrt{3}$), nicht die Fläche.'])

# ------------------------------------------------------------ Anwendungen ----
Q.q(r'Ein Pultdach hat die Form eines Parallelogramms, das von $\vec u = ' + vec(8, 0, 0) + r'$ und $\vec v = ' + vec(0, 4, 3) + r'$ aufgespannt wird (in Metern). Wie viel Quadratmeter Dachfläche sind zu decken?',
    [r'$40\,\mathrm{m}^2$', r'$32\,\mathrm{m}^2$', r'$56\,\mathrm{m}^2$', r'$20\,\mathrm{m}^2$'],
    [r'$\vec u \times \vec v = ' + vec(r'0 \cdot 3 - 0 \cdot 4', r'0 \cdot 0 - 8 \cdot 3', r'8 \cdot 4 - 0 \cdot 0') + r' = ' + vec(0, -24, 32) + r'$',
     r'$A = \sqrt{0 + 576 + 1024} = \sqrt{1600} = 40\,\mathrm{m}^2$',
     r'Probe: $|\vec v| = 5$ ist die Sparrenlänge, $8 \cdot 5 = 40$. Der Grundriss ($8 \cdot 4 = 32$) ist kleiner als das schräge Dach.'])

Q.q(r'Der Giebel eines Hauses ist das Dreieck mit den Ecken $A(0|0|4)$, $B(6|0|4)$ und $C(3|0|7)$ (in Metern). Wie groß ist die Giebelfläche?',
    [r'$9\,\mathrm{m}^2$', r'$18\,\mathrm{m}^2$', r'$4{,}5\,\mathrm{m}^2$', r'$12\,\mathrm{m}^2$'],
    [r'$\overrightarrow{AB} = ' + vec(6, 0, 0) + r'$, $\overrightarrow{AC} = ' + vec(3, 0, 3) + r'$',
     r'$\overrightarrow{AB} \times \overrightarrow{AC} = ' + vec(r'0 \cdot 3 - 0 \cdot 0', r'0 \cdot 3 - 6 \cdot 3', r'6 \cdot 0 - 0 \cdot 3') + r' = ' + vec(0, -18, 0) + r'$',
     r'$A = \tfrac{1}{2} \cdot 18 = 9\,\mathrm{m}^2$; Probe: Grundseite $6$, Höhe $3$, also $\tfrac{1}{2} \cdot 6 \cdot 3 = 9$.'])

Q.q(r'Eine Pyramide hat die Grundfläche $ABC$ mit $A(1|0|0)$, $B(3|1|-2)$, $C(1|2|-2)$ und die Spitze $S(2|3|1)$. Die Grundfläche liegt in der Ebene $E\colon x + 2y + 2z = 1$. Berechne das Volumen der Pyramide.',
    [r'$V = 3$', r'$V = 9$', r'$V = 6$', r'$V = 1$'],
    [r'Grundfläche: $\overrightarrow{AB} \times \overrightarrow{AC} = ' + vec(2, 1, -2) + r' \times ' + vec(0, 2, -2) + r' = ' + vec(2, 4, 4) + r'$, also $G = \tfrac{1}{2} \cdot \sqrt{4 + 16 + 16} = 3$',
     r'Höhe = Abstand von $S$ zu $E$: $h = \dfrac{|2 + 6 + 2 - 1|}{\sqrt{1 + 4 + 4}} = \dfrac{9}{3} = 3$',
     r'$V = \tfrac{1}{3} \cdot G \cdot h = \tfrac{1}{3} \cdot 3 \cdot 3 = 3$',
     r'Falle: $\tfrac{1}{3}$ vergessen ($9$) oder die Parallelogrammfläche statt des Dreiecks nehmen ($6$).'])


def check():
    from fractions import Fraction as F
    from math import sqrt, isqrt, sin, cos, radians, isclose
    dot = lambda a, b: sum(x * y for x, y in zip(a, b))
    cross = lambda a, b: (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])
    norm2 = lambda a: dot(a, a)
    sub = lambda a, b: tuple(x - y for x, y in zip(a, b))
    add = lambda a, b: tuple(x + y for x, y in zip(a, b))
    mul = lambda k, a: tuple(k * x for x in a)
    plane = lambda n, d, p: dot(n, p) - d
    # 1: (1,2,0) lies in the direction space of E (n.(1,2,0) = 0)
    assert dot((2, -1, 2), (1, 2, 0)) == 0
    # 2
    n = cross((1, 1, 0), (0, 1, 1))
    assert n == (1, -1, 1) and dot(n, (1, 1, 0)) == 0 and dot(n, (0, 1, 1)) == 0
    # 3: foot of the perpendicular, t = 1
    n, d, P, u = (1, 2, -2), -5, (2, -1, 7), (1, 2, -2)
    t = F(-plane(n, d, P), dot(n, u))
    assert t == 1 and add(P, mul(t, u)) == (3, 1, 5) and plane(n, d, (3, 1, 5)) == 0
    assert add(P, mul(-1, u)) == (1, -3, 9) and add(P, mul(2, u)) == (4, 3, 3)
    assert 9 * 1 - 14 == -5
    # 4
    n, d, P = (1, 2, 2), 1, (2, 3, 1)
    t = F(-plane(n, d, P), norm2(n))
    assert t == -1 and add(P, mul(t, n)) == (1, 1, -1) and plane(n, d, (1, 1, -1)) == 0
    assert add(P, mul(1, n)) == (3, 5, 3) and add(P, mul(-2, n)) == (0, -1, -3) and 10 + 9 * -1 == 1
    # 5
    n, d, P = (2, -2, 1), 4, (4, 0, 5)
    t = F(-plane(n, d, P), norm2(n))
    assert t == -1 and add(P, mul(t, n)) == (2, 2, 4) and plane(n, d, (2, 2, 4)) == 0
    assert add(P, mul(1, n)) == (6, -2, 6) and add(P, mul(-2, n)) == (0, 4, 3) and 13 + 9 * -1 == 4
    # 7
    n, d, P = (2, 3, 6), 5, (1, 2, 3)
    assert isqrt(norm2(n)) == 7 and plane(n, d, P) == 21 and F(21, 7) == 3 and F(21, 49) == F(3, 7)
    assert abs(26 / 7 - 3.71) < 0.005
    # 8
    n, d, P = (0, 3, 4), 10, (4, -1, 2)
    assert isqrt(norm2(n)) == 5 and plane(n, d, P) == -5 and F(5, 5) == 1 and F(5, 25) == F(1, 5)
    # 9
    n, d = (2, -1, 2), 12
    assert isqrt(norm2(n)) == 3 and F(12, 3) == 4 and F(12, 9) == F(4, 3)
    # 10
    n = cross((1, 0, 1), (0, 1, 0))
    assert n == (-1, 0, 1) and dot((1, 0, -1), (1, 0, 0)) == 1
    assert dot((1, 0, -1), (1, 0, 1)) == 0 and dot((1, 0, -1), (0, 1, 0)) == 0
    dd = abs(plane((1, 0, -1), 1, (4, 5, 1))) / sqrt(2)
    assert isclose(dd, sqrt(2)) and abs(dd - 1.41) < 0.005 and abs(2 * sqrt(2) - 2.83) < 0.005
    # 11
    n, d, P = (2, 2, 1), 4, (2, 1, 10)
    assert isqrt(norm2(n)) == 3 and plane(n, d, P) == 12 and F(12, 3) == 4 and abs(16 / 3 - 5.33) < 0.005
    # 12
    c = cross((1, 2, 0), (0, 1, 3))
    assert c == (6, -3, 1) and dot(c, (1, 2, 0)) == 0 and dot(c, (0, 1, 3)) == 0
    assert cross((0, 1, 3), (1, 2, 0)) == (-6, 3, -1)
    # 13
    c = cross((1, 2, 2), (2, 1, -2))
    assert c == (-6, 6, -3) and norm2(c) == 81 and isqrt(81) == 9
    # 14
    A, B, C = (1, 1, 0), (2, 3, 2), (3, -1, 1)
    c = cross(sub(B, A), sub(C, A))
    assert sub(B, A) == (1, 2, 2) and sub(C, A) == (2, -2, 1) and c == (6, 3, -6) and isqrt(norm2(c)) == 9
    assert F(9, 2) == F(9, 2) and 9 / 2 == 4.5
    # 15
    A, B, D = (1, 1, 1), (3, 1, 2), (1, 4, 1)
    c = cross(sub(B, A), sub(D, A))
    assert sub(B, A) == (2, 0, 1) and sub(D, A) == (0, 3, 0) and c == (-3, 0, 6) and norm2(c) == 45
    assert isclose(sqrt(45), 3 * sqrt(5)) and abs(sqrt(45) - 6.71) < 0.005 and abs(sqrt(45) / 2 - 3.35) < 0.005
    # 17
    assert isclose(4 * 5 * sin(radians(30)), 10) and isclose(4 * 5 * cos(radians(30)), 10 * sqrt(3))
    assert abs(10 * sqrt(3) - 17.32) < 0.005
    # 18
    c = cross((8, 0, 0), (0, 4, 3))
    assert c == (0, -24, 32) and isqrt(norm2(c)) == 40 and isqrt(norm2((0, 4, 3))) == 5 and 8 * 5 == 40 and 8 * 4 == 32
    assert 8 * (4 + 3) == 56
    # 19
    A, B, C = (0, 0, 4), (6, 0, 4), (3, 0, 7)
    c = cross(sub(B, A), sub(C, A))
    assert sub(B, A) == (6, 0, 0) and sub(C, A) == (3, 0, 3) and c == (0, -18, 0) and isqrt(norm2(c)) == 18
    assert F(18, 2) == 9 and F(6 * 3, 2) == 9
    # 20
    A, B, C, S = (1, 0, 0), (3, 1, -2), (1, 2, -2), (2, 3, 1)
    n, d = (1, 2, 2), 1
    assert all(plane(n, d, p) == 0 for p in (A, B, C))
    c = cross(sub(B, A), sub(C, A))
    assert sub(B, A) == (2, 1, -2) and sub(C, A) == (0, 2, -2) and c == (2, 4, 4) and isqrt(norm2(c)) == 6
    G = F(6, 2)
    h = F(abs(plane(n, d, S)), isqrt(norm2(n)))
    assert G == 3 and h == 3 and F(1, 3) * G * h == 3 and G * h == 9 and 2 * G * h / 3 == 6


Q.verify(check)
Q.save()
