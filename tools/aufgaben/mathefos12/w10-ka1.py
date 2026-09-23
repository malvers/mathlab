#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 10 (LB 1): Wiederholung für Klausur 1 - Betrag und
Skalarprodukt, Geraden und ihre Lagebeziehungen, Ebenen in Parameter- und
Koordinatenform, Vektorprodukt, Gerade-Ebene, Lot und Flächen; GPS als Anwendung.
Andere Aufgaben als in den Sätzen der Wochen 2 bis 9.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec

Q = fos12(nr=10, slug='ka1', thema='Wiederholung Vektorrechnung', lb='LB 1',
          blurb='Wiederholung für Klausur 1: Vektoren, Geraden, Ebenen',
          comment='Blocks: Vektoren und Skalarprodukt (1-5), Geraden und Lagebeziehungen (6-9), Ebenen (10-14), Gerade-Ebene, Lot und Flaechen (15-18), Anwendungen (19-20). Alles ohne CAS; die Distraktoren sind typische Klausurfehler.')


def g(p, u, t='t'):
    return r'\vec x = ' + vec(*p) + ' + ' + t + r' \cdot ' + vec(*u)


# --------------------------------------------- Vektoren und Skalarprodukt ----
Q.q(r'Berechne den Betrag von $\vec a = ' + vec(6, -6, 3) + '$.',
    [r'$9$', r'$81$', r'$3$', r'$15$'],
    [r'$|\vec a| = \sqrt{6^2 + (-6)^2 + 3^2} = \sqrt{36 + 36 + 9}$',
     r'$= \sqrt{81} = 9$',
     r'Typische Fehler: Wurzel vergessen ($81$), Koordinaten addiert ($6 - 6 + 3 = 3$) oder Beträge addiert ($15$).'])

Q.q(r'Welcher Vektor ist parallel zu $\vec a = ' + vec(2, -1, 2) + '$ und hat den Betrag $12$?',
    [r'$' + vec(8, -4, 8) + '$', r'$' + vec(24, -12, 24) + '$', r'$' + vec(12, -6, 12) + '$', r'$' + vec(4, -2, 4) + '$'],
    [r'$|\vec a| = \sqrt{4 + 1 + 4} = 3$, gesucht ist also $\dfrac{12}{3} \cdot \vec a = 4\,\vec a$.',
     r'$4 \cdot ' + vec(2, -1, 2) + ' = ' + vec(8, -4, 8) + r'$; Probe: $\sqrt{64 + 16 + 64} = \sqrt{144} = 12$.',
     r'Falle: mit $12$ multiplizieren gibt den Betrag $36$, nicht $12$.'])

Q.q(r'Berechne den Winkel zwischen $\vec a = ' + vec(1, 0, 2) + r'$ und $\vec b = ' + vec(2, 1, 0) + '$.',
    [r'$\varphi \approx 66{,}4^\circ$', r'$\varphi \approx 23{,}6^\circ$', r'$\varphi \approx 113{,}6^\circ$', r'$45^\circ$'],
    [r'$\vec a \cdot \vec b = 2 + 0 + 0 = 2$, $|\vec a| = |\vec b| = \sqrt{5}$',
     r'$\cos\varphi = \dfrac{2}{\sqrt{5} \cdot \sqrt{5}} = \dfrac{2}{5} = 0{,}4$',
     r'$\varphi = \cos^{-1}(0{,}4) \approx 66{,}4^\circ$ - mit $\sin^{-1}$ käme fälschlich $23{,}6^\circ$ heraus.'])

Q.q(r'$M(3|2|5)$ ist der Mittelpunkt der Strecke $\overline{AB}$ mit $A(1|4|2)$. Bestimme $B$.',
    [r'$B(5|0|8)$', r'$B(2|-2|3)$', r'$B(4|6|7)$', r'$B(6|4|10)$'],
    [r'Aus $\vec m = \tfrac{1}{2}\,(\vec a + \vec b)$ folgt $\vec b = 2\,\vec m - \vec a$.',
     r'$2 \cdot ' + vec(3, 2, 5) + ' - ' + vec(1, 4, 2) + ' = ' + vec(6, 4, 10) + ' - ' + vec(1, 4, 2) + ' = ' + vec(5, 0, 8) + '$',
     r'Probe: der Mittelpunkt von $A(1|4|2)$ und $B(5|0|8)$ ist $(3|2|5)$.'])

Q.q(r'Liegen $A(1|2|3)$, $B(3|5|7)$ und $C(7|11|15)$ auf einer gemeinsamen Geraden?',
    [r'ja, denn $\overrightarrow{AC} = 3 \cdot \overrightarrow{AB}$',
     r'nein, $\overrightarrow{AB}$ und $\overrightarrow{AC}$ sind nicht parallel',
     r'ja, weil alle drei Koordinaten von $A$ nach $C$ wachsen',
     r'das lässt sich nur mit einer Ebenengleichung entscheiden'],
    [r'$\overrightarrow{AB} = ' + vec(2, 3, 4) + r'$ und $\overrightarrow{AC} = ' + vec(6, 9, 12) + '$',
     r'$' + vec(6, 9, 12) + r' = 3 \cdot ' + vec(2, 3, 4) + '$ - die beiden Vektoren sind kollinear.',
     r'Drei Punkte liegen genau dann auf einer Geraden, wenn zwei ihrer Verbindungsvektoren parallel sind.'])

# --------------------------------------------- Geraden und Lagebeziehungen ----
Q.q(r'Stelle eine Gleichung der Geraden durch $A(2|3|-1)$ und $B(5|3|5)$ auf.',
    [r'$g: ' + g((2, 3, -1), (1, 0, 2)) + '$',
     r'$g: ' + g((2, 3, -1), (5, 3, 5)) + '$',
     r'$g: ' + g((2, 3, -1), (7, 6, 4)) + '$',
     r'$g: ' + g((3, 0, 6), (2, 3, -1)) + '$'],
    [r'$\overrightarrow{AB} = ' + vec(5, 3, 5) + ' - ' + vec(2, 3, -1) + ' = ' + vec(3, 0, 6) + '$',
     r'Der Richtungsvektor darf gekürzt werden: $' + vec(3, 0, 6) + r' = 3 \cdot ' + vec(1, 0, 2) + '$.',
     r'Typische Fehler: Ortsvektor von $B$ als Richtung, Addition statt Subtraktion, Stütz- und Richtungsvektor vertauscht.'])

Q.q(r'Liegt $P(5|-3|8)$ auf $g: ' + g((1, 1, 2), (2, -2, 3)) + '$?',
    [r'ja, für $t = 2$', r'ja, für $t = 3$', r'nein, nur die ersten beiden Gleichungen passen', r'nein, das Gleichungssystem ist unlösbar'],
    [r'Erste Zeile: $1 + 2t = 5$, also $t = 2$.',
     r'Probe in den anderen Zeilen: $1 - 2 \cdot 2 = -3$ und $2 + 3 \cdot 2 = 8$ - beide stimmen.',
     r'Ein Punkt liegt nur dann auf der Geraden, wenn dasselbe $t$ alle drei Zeilen erfüllt.'])

Q.q(r'Untersuche die Lage von $g: ' + g((2, 2, 2), (1, -1, 2)) + r'$ und $h: ' + g((1, 0, 4), (2, 1, 0), 's') + '$.',
    [r'schneidend, $S(3|1|4)$', r'windschief', r'echt parallel', r'schneidend, $S(2|2|2)$'],
    [r'Die Richtungsvektoren sind nicht parallel. Gleichsetzen: $2 + t = 1 + 2s$, $2 - t = s$, $2 + 2t = 4$.',
     r'Dritte Zeile: $t = 1$; zweite Zeile: $s = 1$. Probe erste Zeile: $3 = 1 + 2$ - stimmt.',
     r'$t = 1$ in $g$: $S(3|1|4)$; $(2|2|2)$ ist nur der Stützpunkt von $g$.'])

Q.q(r'Untersuche die Lage von $g: ' + g((2, 1, 0), (1, 2, 1)) + r'$ und $h: ' + g((0, 0, 3), (1, 1, 0), 's') + '$.',
    [r'windschief', r'schneidend, $S(5|7|3)$', r'echt parallel', r'identisch'],
    [r'$' + vec(1, 2, 1) + r'$ und $' + vec(1, 1, 0) + '$ sind nicht parallel - identisch oder parallel scheidet aus.',
     r'Gleichsetzen: $2 + t = s$, $1 + 2t = s$, $t = 3$. Aus der dritten Zeile $t = 3$, aus der ersten $s = 5$.',
     r'Zweite Zeile: $1 + 6 = 7 \ne 5$ - Widerspruch. Nicht parallel und kein Schnittpunkt heißt windschief.'])

# ----------------------------------------------------------------- Ebenen ----
Q.q(r'Bestimme eine Koordinatengleichung der Ebene durch $A(1|0|1)$, $B(3|1|1)$ und $C(1|2|3)$.',
    [r'$x - 2y + 2z = 3$', r'$x - 2y + 2z = 0$', r'$x + 2y + 2z = 3$', r'$2x - 4y + 4z = 3$'],
    [r'$\overrightarrow{AB} = ' + vec(2, 1, 0) + r'$, $\overrightarrow{AC} = ' + vec(0, 2, 2) + r'$, Vektorprodukt $' + vec(2, -4, 4) + r'$, gekürzt $' + vec(1, -2, 2) + '$.',
     r'$x - 2y + 2z = d$ mit $A(1|0|1)$: $d = 1 - 0 + 2 = 3$.',
     r'Probe: $B$ gibt $3 - 2 + 2 = 3$, $C$ gibt $1 - 4 + 6 = 3$. Kürzt man den Normalenvektor, muss auch $d$ mitgekürzt werden.'])

Q.q(r'Berechne $' + vec(3, 1, 2) + r' \times ' + vec(1, 2, 0) + '$.',
    [r'$' + vec(-4, 2, 5) + '$', r'$' + vec(4, 2, 5) + '$', r'$' + vec(-4, -2, 5) + '$', r'$' + vec(3, 2, 0) + '$'],
    [r'$' + vec(r'1 \cdot 0 - 2 \cdot 2', r'2 \cdot 1 - 3 \cdot 0', r'3 \cdot 2 - 1 \cdot 1') + ' = ' + vec(-4, 2, 5) + '$',
     r'Probe: $' + vec(3, 1, 2) + r' \cdot ' + vec(-4, 2, 5) + ' = -12 + 2 + 10 = 0$',
     r'In der mittleren Zeile sind die Indizes vertauscht ($u_3 v_1 - u_1 v_3$) - dort passieren die meisten Vorzeichenfehler.'])

Q.q(r'Welche Lage haben die Ebenen $E: 2x - y + 2z = 6$ und $F: -4x + 2y - 4z = 12$ zueinander?',
    [r'Sie sind echt parallel.', r'Sie sind identisch.', r'Sie schneiden sich in einer Geraden.', r'Sie stehen senkrecht aufeinander.'],
    [r'$' + vec(-4, 2, -4) + r' = -2 \cdot ' + vec(2, -1, 2) + '$ - die Normalenvektoren sind parallel.',
     r'$E$ mit $-2$ multipliziert: $-4x + 2y - 4z = -12$. Die rechte Seite von $F$ ist aber $12$.',
     r'Gleiche Richtung, verschiedene rechte Seite: kein gemeinsamer Punkt, also echt parallel.'])

Q.q(r'Die Ebene $E$ enthält $P(2|1|3)$ und steht senkrecht auf $g: ' + g((1, 0, 0), (2, -1, 2)) + '$. Wie lautet ihre Koordinatengleichung?',
    [r'$2x - y + 2z = 9$', r'$2x - y + 2z = 6$', r'$2x - y + 2z = -9$', r'$2x + y + 2z = 11$'],
    [r'Steht die Ebene senkrecht auf $g$, ist der Richtungsvektor ihr Normalenvektor: $\vec n = ' + vec(2, -1, 2) + '$.',
     r'$2x - y + 2z = d$ mit $P(2|1|3)$: $d = 4 - 1 + 6 = 9$.',
     r'Falle: $d$ ist nicht die Summe der Punktkoordinaten ($2 + 1 + 3 = 6$).'])

Q.q(r'In welchem Punkt schneidet $E: 4x + 3y + 6z = 24$ die $z$-Achse?',
    [r'$(0|0|4)$', r'$(0|0|6)$', r'$(0|0|24)$', r'$(0|0|8)$'],
    [r'Auf der $z$-Achse ist $x = y = 0$.',
     r'Es bleibt $6z = 24$, also $z = 4$.',
     r'Der Koeffizient $6$ ist nicht der Spurpunkt - durch ihn wird geteilt.'])

# ------------------------------------- Gerade-Ebene, Lot und Flächeninhalte ----
Q.q(r'Berechne den Durchstoßpunkt von $g: ' + g((1, 1, 0), (0, 1, 2)) + r'$ mit $E: x + y + z = 8$.',
    [r'$D(1|3|4)$', r'$D(1|1|0)$', r'$D(1|2|2)$', r'$D(1|4|6)$'],
    [r'Geradenpunkt einsetzen: $1 + (1 + t) + 2t = 8$',
     r'$2 + 3t = 8$, also $t = 2$.',
     r'$t = 2$ in $g$: $D(1|3|4)$. Probe: $1 + 3 + 4 = 8$.'])

Q.q(r'Bestimme den Lotfußpunkt $F$ von $P(4|4|4)$ auf $E: 2x + y + 2z = 2$.',
    [r'$F(0|2|0)$', r'$F(2|3|2)$', r'$F(8|6|8)$', r'$F(4|4|4)$'],
    [r'Lotgerade: $' + g((4, 4, 4), (2, 1, 2)) + '$ mit dem Normalenvektor als Richtung.',
     r'Einsetzen: $2\,(4 + 2t) + (4 + t) + 2\,(4 + 2t) = 20 + 9t = 2$, also $t = -2$.',
     r'$t = -2$: $F(0|2|0)$. Probe: $0 + 2 + 0 = 2$.'])

Q.q(r'Wie weit ist $P(4|4|4)$ von der Ebene $E: 2x + y + 2z = 2$ entfernt?',
    [r'$6$', r'$18$', r'$2$', r'$12$'],
    [r'Abstandsformel: $d = \dfrac{|2 \cdot 4 + 4 + 2 \cdot 4 - 2|}{|\vec n|}$ mit $|\vec n| = \sqrt{4 + 1 + 4} = 3$.',
     r'$d = \dfrac{|20 - 2|}{3} = \dfrac{18}{3} = 6$',
     r'Probe über den Lotfußpunkt $F(0|2|0)$: $|\overrightarrow{FP}| = |' + vec(4, 2, 4) + r'| = 6$. Falle: durch $|\vec n|^2 = 9$ teilen gibt $2$.'])

Q.q(r'Berechne den Flächeninhalt des Dreiecks $ABC$ mit $A(1|1|1)$, $B(5|1|1)$ und $C(1|4|5)$.',
    [r'$A = 10$', r'$A = 20$', r'$A = 6$', r'$A = 12$'],
    [r'$\overrightarrow{AB} = ' + vec(4, 0, 0) + r'$, $\overrightarrow{AC} = ' + vec(0, 3, 4) + '$',
     r'$\overrightarrow{AB} \times \overrightarrow{AC} = ' + vec(0, -16, 12) + r'$ mit dem Betrag $\sqrt{256 + 144} = 20$.',
     r'Dreieck: $A = \tfrac{1}{2} \cdot 20 = 10$. $20$ wäre das Parallelogramm, $6 = \tfrac{1}{2} \cdot 4 \cdot 3$ vergisst die Höhe im Raum.'])

# ------------------------------------------------------------ Anwendungen ----
Q.q(r'Ein GPS-Empfänger kennt seinen Abstand zu mehreren Satelliten; jeder Abstand legt ihn auf eine Kugelfläche. Warum reichen im Alltag drei Satelliten nicht aus?',
    [r'Die Uhr des Empfängers ist ungenau; der Zeitfehler ist eine vierte Unbekannte, deshalb braucht man einen vierten Satelliten.',
     r'Drei Kugelflächen haben grundsätzlich keinen gemeinsamen Punkt.',
     r'Die Satelliten bewegen sich, deshalb sind ihre Positionen unbekannt.',
     r'Die Erde ist keine Kugel, deshalb versagt die Vektorrechnung.'],
    [r'Gesucht sind drei Koordinaten $x$, $y$, $z$ - dafür würden drei Kugelgleichungen genügen.',
     r'Die Laufzeit wird aber mit der billigen Uhr im Gerät gemessen; ihr Gangfehler geht in jeden Abstand ein.',
     r'Mit vier Gleichungen lassen sich Position und Zeitfehler zugleich bestimmen - deshalb braucht GPS mindestens vier Satelliten.'])

Q.q(r'Eine Überwachungskamera hängt in $K(3|6|3)$ und blickt senkrecht auf eine Wand, die in $E: x + 2y + 2z = 12$ liegt (Angaben in Metern). Wo trifft die optische Achse die Wand, und wie weit ist die Kamera entfernt?',
    [r'$F(2|4|1)$, Abstand $3\,\mathrm{m}$', r'$F(2|4|1)$, Abstand $9\,\mathrm{m}$',
     r'$F(4|8|5)$, Abstand $3\,\mathrm{m}$', r'$F(1|2|-1)$, Abstand $6\,\mathrm{m}$'],
    [r'Die optische Achse ist die Lotgerade $' + g((3, 6, 3), (1, 2, 2)) + '$.',
     r'Einsetzen: $(3 + t) + 2\,(6 + 2t) + 2\,(3 + 2t) = 21 + 9t = 12$, also $t = -1$ und $F(2|4|1)$.',
     r'Abstand: $\dfrac{|21 - 12|}{|\vec n|} = \dfrac{9}{3} = 3\,\mathrm{m}$ - dasselbe wie $|\overrightarrow{FK}| = |' + vec(1, 2, 2) + '| = 3$.'])


def check():
    from math import sqrt, acos, asin, degrees
    from fractions import Fraction as F
    import sympy as sp
    dot = lambda a, b: sum(x * y for x, y in zip(a, b))
    n2 = lambda a: dot(a, a)
    sub = lambda p, q: tuple(x - y for x, y in zip(p, q))
    add = lambda p, q: tuple(x + y for x, y in zip(p, q))
    mul = lambda k, v: tuple(k * x for x in v)
    at = lambda p, u, t: tuple(p[i] + t * u[i] for i in range(3))
    cross = lambda u, v: tuple(sp.Matrix(list(u)).cross(sp.Matrix(list(v))))
    coplanar = lambda u, v: sp.Matrix([list(u), list(v)]).rank() == 1
    near = lambda x, y, tol=0.05: abs(x - y) < tol
    ang = lambda a, b: degrees(acos(abs(dot(a, b)) / sqrt(n2(a) * n2(b))))

    def lage_gg(p, u, q, v):
        """identisch / echt parallel / schneidend (with point) / windschief."""
        t, s = sp.symbols('t s')
        if coplanar(u, v):
            return 'identisch' if sp.solve([p[i] + t * u[i] - q[i] for i in range(3)], t, dict=True) else 'echt parallel'
        sol = sp.solve([p[i] + t * u[i] - q[i] - s * v[i] for i in range(3)], [t, s], dict=True)
        if not sol:
            return 'windschief'
        return ('schneidend', at(p, u, sol[0][t]), sol[0][t], sol[0][s])

    # 1: Betrag
    assert n2((6, -6, 3)) == 81 and sqrt(81) == 9 and 6 - 6 + 3 == 3 and 6 + 6 + 3 == 15
    # 2: paralleler Vektor der Länge 12
    assert n2((2, -1, 2)) == 9 and mul(4, (2, -1, 2)) == (8, -4, 8) and n2((8, -4, 8)) == 144
    for bad in ((24, -12, 24), (12, -6, 12), (4, -2, 4)):
        assert n2(bad) != 144 and coplanar(bad, (2, -1, 2))
    # 3: Winkel
    assert dot((1, 0, 2), (2, 1, 0)) == 2 and n2((1, 0, 2)) == 5 and n2((2, 1, 0)) == 5
    assert near(ang((1, 0, 2), (2, 1, 0)), 66.4) and near(degrees(asin(0.4)), 23.6)
    assert near(180 - ang((1, 0, 2), (2, 1, 0)), 113.6) and F(2, 5) == F(4, 10)
    # 4: Mittelpunkt
    assert sub(mul(2, (3, 2, 5)), (1, 4, 2)) == (5, 0, 8)
    assert tuple(F(x + y, 2) for x, y in zip((1, 4, 2), (5, 0, 8))) == (3, 2, 5)
    assert sub((3, 2, 5), (1, 4, 2)) == (2, -2, 3) and add((3, 2, 5), (1, 4, 2)) == (4, 6, 7) and mul(2, (3, 2, 5)) == (6, 4, 10)
    # 5: kollinear
    AB, AC = sub((3, 5, 7), (1, 2, 3)), sub((7, 11, 15), (1, 2, 3))
    assert AB == (2, 3, 4) and AC == (6, 9, 12) and mul(3, AB) == AC and coplanar(AB, AC)
    # 6: Geradengleichung
    assert sub((5, 3, 5), (2, 3, -1)) == (3, 0, 6) and mul(3, (1, 0, 2)) == (3, 0, 6)
    assert add((5, 3, 5), (2, 3, -1)) == (7, 6, 4)
    assert not coplanar((5, 3, 5), (1, 0, 2)) and not coplanar((7, 6, 4), (1, 0, 2)) and not coplanar((2, 3, -1), (1, 0, 2))
    # 7: Punktprobe
    assert at((1, 1, 2), (2, -2, 3), 2) == (5, -3, 8) and at((1, 1, 2), (2, -2, 3), 3) != (5, -3, 8)
    # 8: schneidend
    r = lage_gg((2, 2, 2), (1, -1, 2), (1, 0, 4), (2, 1, 0))
    assert r[0] == 'schneidend' and r[1] == (3, 1, 4) and (r[2], r[3]) == (1, 1)
    assert at((1, 0, 4), (2, 1, 0), 1) == (3, 1, 4)
    # 9: windschief
    assert lage_gg((2, 1, 0), (1, 2, 1), (0, 0, 3), (1, 1, 0)) == 'windschief'
    assert at((2, 1, 0), (1, 2, 1), 3) == (5, 7, 3) and not coplanar((1, 2, 1), (1, 1, 0))
    # 10: Ebene aus drei Punkten
    A, B, C = (1, 0, 1), (3, 1, 1), (1, 2, 3)
    assert sub(B, A) == (2, 1, 0) and sub(C, A) == (0, 2, 2) and cross((2, 1, 0), (0, 2, 2)) == (2, -4, 4)
    for p in (A, B, C):
        assert dot((1, -2, 2), p) == 3
    for n, d in (((1, -2, 2), 0), ((1, 2, 2), 3), ((2, -4, 4), 3)):
        assert not all(dot(n, p) == d for p in (A, B, C))
    # 11: Vektorprodukt
    assert cross((3, 1, 2), (1, 2, 0)) == (-4, 2, 5)
    assert dot((3, 1, 2), (-4, 2, 5)) == 0 and dot((1, 2, 0), (-4, 2, 5)) == 0
    assert (3 * 1, 1 * 2, 2 * 0) == (3, 2, 0)
    # 12: zwei Ebenen
    assert mul(-2, (2, -1, 2)) == (-4, 2, -4) and -2 * 6 == -12 and -12 != 12
    assert coplanar((2, -1, 2), (-4, 2, -4))
    # 13: Ebene senkrecht zu g
    assert dot((2, -1, 2), (2, 1, 3)) == 9 and 2 + 1 + 3 == 6 and dot((2, 1, 2), (2, 1, 3)) == 11
    # 14: Spurpunkt auf der z-Achse
    assert F(24, 6) == 4 and dot((4, 3, 6), (0, 0, 4)) == 24
    for p in ((0, 0, 6), (0, 0, 24), (0, 0, 8)):
        assert dot((4, 3, 6), p) != 24
    # 15: Durchstoßpunkt
    t = sp.symbols('t')
    assert sp.solve(sp.Eq(dot((1, 1, 1), at((1, 1, 0), (0, 1, 2), t)), 8), t) == [2]
    assert at((1, 1, 0), (0, 1, 2), 2) == (1, 3, 4) and dot((1, 1, 1), (1, 3, 4)) == 8
    for p in ((1, 1, 0), (1, 2, 2), (1, 4, 6)):
        assert dot((1, 1, 1), p) != 8
    # 16-17: Lotfußpunkt und Abstand
    P0, n, d = (4, 4, 4), (2, 1, 2), 2
    assert sp.solve(sp.Eq(dot(n, at(P0, n, t)), d), t) == [-2] and dot(n, P0) == 20
    Fp = at(P0, n, -2)
    assert Fp == (0, 2, 0) and dot(n, Fp) == d
    assert sub(P0, Fp) == (4, 2, 4) and sqrt(n2((4, 2, 4))) == 6 and abs(20 - d) / sqrt(n2(n)) == 6
    assert F(18, 9) == 2 and dot(n, (2, 3, 2)) != d and dot(n, (8, 6, 8)) != d
    # 18: Dreiecksfläche
    AB2, AC2 = sub((5, 1, 1), (1, 1, 1)), sub((1, 4, 5), (1, 1, 1))
    assert AB2 == (4, 0, 0) and AC2 == (0, 3, 4) and cross(AB2, AC2) == (0, -16, 12)
    assert n2((0, -16, 12)) == 400 and sqrt(400) / 2 == 10 and F(1, 2) * 4 * 3 == 6
    # 20: Kamera
    K, nk, dk = (3, 6, 3), (1, 2, 2), 12
    assert dot(nk, K) == 21 and sp.solve(sp.Eq(dot(nk, at(K, nk, t)), dk), t) == [-1]
    assert at(K, nk, -1) == (2, 4, 1) and dot(nk, (2, 4, 1)) == 12
    assert abs(21 - dk) / sqrt(n2(nk)) == 3 and sqrt(n2(nk)) == 3
    assert dot(nk, (4, 8, 5)) != 12 and dot(nk, (1, 2, -1)) != 12


Q.verify(check)
Q.save()
