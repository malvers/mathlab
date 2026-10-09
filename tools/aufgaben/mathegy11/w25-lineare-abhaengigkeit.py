#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 25 / KW 10 (LB 3): linear combination, linear dependence and
independence, length, midpoints and division points. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11, vec

Q = gy11(nr=25, slug='lineare-abhaengigkeit', thema='Lineare Abhängigkeit, Betrag, Mittelpunkte', lb='LB 3',
         blurb='Linearkombination, lineare (Un-)Abhängigkeit, Längen, Teilungspunkte',
         comment='Blocks: linear combination (1-3), dependence (4-10), lengths (11-14), midpoints and division points (15-20).')

# ----------------------------------------------------- linear combination ----
Q.q(r'Stelle $' + vec(5, 1) + '$ als Linearkombination von $' + vec(1, 2) + '$ und $' + vec(1, -1) + '$ dar.',
    [r'$2 \cdot ' + vec(1, 2) + r' + 3 \cdot ' + vec(1, -1) + '$', r'$3 \cdot ' + vec(1, 2) + r' + 2 \cdot ' + vec(1, -1) + '$',
     r'$' + vec(1, 2) + r' + 4 \cdot ' + vec(1, -1) + '$', r'$5 \cdot ' + vec(1, 2) + ' + ' + vec(1, -1) + '$'],
    [r'Ansatz: $r + s = 5$ und $2r - s = 1$.',
     r'Addieren: $3r = 6$, also $r = 2$, $s = 3$.'])

Q.q(r'Stelle $' + vec(4, 5, 6) + r'$ als $r \cdot ' + vec(1, 1, 0) + r' + s \cdot ' + vec(0, 1, 1) + r' + t \cdot ' + vec(1, 0, 1) + '$ dar. Wie groß ist $s$?',
    [r'$s = 3{,}5$', r'$s = 1{,}5$', r'$s = 2{,}5$', r'$s = 5$'],
    [r'$r + t = 4$, $r + s = 5$, $s + t = 6$; alles addiert: $2(r + s + t) = 15$.',
     r'$r + s + t = 7{,}5$, also $s = 7{,}5 - 4 = 3{,}5$ (und $r = 1{,}5$, $t = 2{,}5$).'])

Q.q(r'Was ist eine Linearkombination der Vektoren $\vec{a}$ und $\vec{b}$?',
    [r'Ein Vektor der Form $r\vec{a} + s\vec{b}$ mit reellen Zahlen $r$, $s$.', r'Das Produkt $\vec{a} \cdot \vec{b}$.',
     r'Der Betrag $|\vec{a} + \vec{b}|$.', r'Nur die Summe $\vec{a} + \vec{b}$.'],
    [r'Vielfache addieren: Mit zwei nicht parallelen Vektoren erreicht man so jeden Punkt ihrer Ebene.'])

# ------------------------------------------------------------- dependence ----
Q.q(r'Wann sind zwei Vektoren (beide nicht der Nullvektor) linear abhängig?',
    [r'Wenn sie parallel (kollinear) sind.', r'Wenn sie gleich lang sind.', r'Wenn sie senkrecht aufeinander stehen.', r'Nie.'],
    [r'Linear abhängig: Einer ist ein Vielfaches des anderen.',
     r'Geometrisch: Sie liegen auf einer Geraden.'])

Q.q(r'Wann sind drei Vektoren im Raum linear abhängig?',
    [r'Wenn sie in einer Ebene liegen (komplanar sind).', r'Wenn sie alle gleich lang sind.', r'Wenn sie paarweise nicht parallel sind.', r'Immer.'],
    [r'Dann lässt sich einer als Linearkombination der anderen schreiben.',
     r'Drei linear unabhängige Vektoren spannen dagegen den ganzen Raum auf.'])

Q.q(r'Sind $' + vec(1, 2, 3) + '$ und $' + vec(2, 4, 5) + '$ linear abhängig?',
    [r'Nein, die dritte Koordinate passt nicht zum Faktor 2.', r'Ja, der zweite ist das Doppelte des ersten.',
     r'Ja, beide haben positive Koordinaten.', r'Das lässt sich nicht entscheiden.'],
    [r'$x$ und $y$ legen den Faktor 2 fest.',
     r'Aber $2 \cdot 3 = 6 \neq 5$: kein Vielfaches, also linear unabhängig.'])

Q.q(r'Sind $' + vec(1, 0, 0) + '$, $' + vec(0, 1, 0) + '$ und $' + vec(1, 1, 0) + '$ linear abhängig?',
    [r'Ja, der dritte ist die Summe der beiden anderen.', r'Nein, keine zwei sind parallel.',
     r'Nein, sie zeigen in drei verschiedene Richtungen.', r'Nur wenn man noch den Nullvektor hinzunimmt.'],
    [r'$' + vec(1, 1, 0) + ' = ' + vec(1, 0, 0) + ' + ' + vec(0, 1, 0) + '$',
     r'Alle drei liegen in der $xy$-Ebene: komplanar.'])

Q.q(r'Für welches $r$ ist $' + vec(3, 'r', 6) + '$ parallel zu $' + vec(1, 2, 2) + '$?',
    [r'$r = 6$', r'$r = 2$', r'$r = 3$', r'Für kein $r$'],
    [r'Faktor aus der ersten Koordinate: 3.',
     r'Prüfen: $3 \cdot 2 = 6$ passt zur dritten Koordinate; also $r = 3 \cdot 2 = 6$.'])

Q.q(r'Wie prüft man rechnerisch, ob drei Vektoren linear unabhängig sind?',
    [r'$r\vec{a} + s\vec{b} + t\vec{c} = \vec{o}$ darf nur die Lösung $r = s = t = 0$ haben.', r'Man prüft, ob alle gleich lang sind.',
     r'Man addiert sie und prüft, ob der Nullvektor herauskommt.', r'Man vergleicht nur die ersten Koordinaten.'],
    [r'Das liefert ein homogenes Gleichungssystem.',
     r'Hat es nur die triviale Lösung, sind die Vektoren linear unabhängig.'])

Q.q(r'Liegen $A(1 \mid 2 \mid 3)$, $B(2 \mid 4 \mid 5)$ und $C(4 \mid 8 \mid 9)$ auf einer Geraden?',
    [r'Ja, $\overrightarrow{AC} = 3 \cdot \overrightarrow{AB}$.', r'Nein, $\overrightarrow{AC}$ ist kein Vielfaches von $\overrightarrow{AB}$.',
     r'Ja, weil alle Koordinaten positiv sind.', r'Nein, drei Punkte liegen nie auf einer Geraden.'],
    [r'$\overrightarrow{AB} = ' + vec(1, 2, 2) + r'$, $\overrightarrow{AC} = ' + vec(3, 6, 6) + '$',
     r'Kollinear, also liegen die Punkte auf einer Geraden.'])

# ----------------------------------------------------------------- lengths ----
Q.q(r'Wie lang ist die Strecke $AB$ mit $A(1 \mid 2 \mid 2)$ und $B(3 \mid 5 \mid 8)$?',
    [r'7', r'11', r'49', r'$\sqrt{11}$'],
    [r'$\overrightarrow{AB} = ' + vec(2, 3, 6) + '$',
     r'$|\overrightarrow{AB}| = \sqrt{4 + 9 + 36} = 7$'])

Q.q(r'Ist das Dreieck mit $A(1 \mid 1 \mid 1)$, $B(3 \mid 1 \mid 1)$, $C(2 \mid 3 \mid 1)$ gleichschenklig?',
    [r'Ja, $|\overrightarrow{AC}| = |\overrightarrow{BC}| = \sqrt{5}$.', r'Nein, alle Seiten sind verschieden lang.',
     r'Ja, es ist sogar gleichseitig.', r'Nein, es ist rechtwinklig.'],
    [r'$|\overrightarrow{AB}| = 2$, $|\overrightarrow{AC}| = \sqrt{1 + 4} = \sqrt{5}$, $|\overrightarrow{BC}| = \sqrt{1 + 4} = \sqrt{5}$.'])

Q.q(r'Wie lang ist $2\vec{a}$ für $\vec{a} = ' + vec(1, 2, 2) + '$?',
    [r'6', r'3', r'9', r'$2\sqrt{3}$'],
    [r'$|\vec{a}| = 3$',
     r'$|2\vec{a}| = 2 \cdot |\vec{a}| = 6$'])

Q.q(r'Bestimme den Einheitsvektor in Richtung $' + vec(2, -1, 2) + '$.',
    [r'$' + vec(r'\frac{2}{3}', r'-\frac{1}{3}', r'\frac{2}{3}') + '$', r'$' + vec(1, r'-\frac{1}{2}', 1) + '$',
     r'$' + vec(r'\frac{2}{5}', r'-\frac{1}{5}', r'\frac{2}{5}') + '$', r'$' + vec(2, -1, 2) + '$'],
    [r'Betrag: $\sqrt{4 + 1 + 4} = 3$.',
     r'Durch 3 teilen.'])

# ------------------------------------------------ midpoints and division points ----
Q.q(r'Bestimme den Mittelpunkt von $A(-2 \mid 4 \mid 1)$ und $B(6 \mid 0 \mid 3)$.',
    [r'$M(2 \mid 2 \mid 2)$', r'$M(4 \mid 4 \mid 4)$', r'$M(8 \mid -4 \mid 2)$', r'$M(4 \mid 2 \mid 2)$'],
    [r'$\vec{m} = \dfrac{1}{2}(\vec{a} + \vec{b})$',
     r'$\dfrac{1}{2} \cdot ' + vec(4, 4, 4) + '$'])

Q.q(r'$M(1 \mid 1 \mid 1)$ ist Mittelpunkt von $A(3 \mid 0 \mid -1)$ und $B$. Bestimme $B$.',
    [r'$B(-1 \mid 2 \mid 3)$', r'$B(2 \mid 0{,}5 \mid 0)$', r'$B(5 \mid -1 \mid -3)$', r'$B(-2 \mid 1 \mid 2)$'],
    [r'$\vec{b} = 2\vec{m} - \vec{a}$',
     r'$' + vec(2, 2, 2) + ' - ' + vec(3, 0, -1) + ' = ' + vec(-1, 2, 3) + '$'])

Q.q(r'Der Punkt $T$ teilt $AB$ mit $A(0 \mid 0 \mid 0)$ und $B(6 \mid 3 \mid 9)$ im Verhältnis 1 : 2 (von $A$ aus). Bestimme $T$.',
    [r'$T(2 \mid 1 \mid 3)$', r'$T(4 \mid 2 \mid 6)$', r'$T(3 \mid 1{,}5 \mid 4{,}5)$', r'$T(1 \mid 0{,}5 \mid 1{,}5)$'],
    [r'Verhältnis 1 : 2 heißt: $T$ liegt bei einem Drittel der Strecke.',
     r'$\vec{t} = \vec{a} + \dfrac{1}{3}\overrightarrow{AB}$'])

Q.q(r'Bestimme den Schwerpunkt des Dreiecks $A(1 \mid 0 \mid 0)$, $B(0 \mid 3 \mid 0)$, $C(2 \mid 0 \mid 6)$.',
    [r'$S(1 \mid 1 \mid 2)$', r'$S(3 \mid 3 \mid 6)$', r'$S(1{,}5 \mid 1{,}5 \mid 3)$', r'$S(0 \mid 1 \mid 2)$'],
    [r'$\vec{s} = \dfrac{1}{3}(\vec{a} + \vec{b} + \vec{c})$',
     r'$\dfrac{1}{3} \cdot ' + vec(3, 3, 6) + '$'])

Q.q(r'Woran erkennt man rechnerisch, dass $ABCD$ ein Parallelogramm ist?',
    [r'$\overrightarrow{AB} = \overrightarrow{DC}$', r'$\overrightarrow{AB} = \overrightarrow{CD}$', r'$|\overrightarrow{AB}| = |\overrightarrow{BC}|$', r'$\overrightarrow{AC} = \overrightarrow{BD}$'],
    [r'Gegenüberliegende Seiten sind gleich lang und parallel, also gleiche Vektoren.',
     r'Achtung auf die Richtung: $\overrightarrow{AB}$ und $\overrightarrow{DC}$ laufen gleich.'])

Q.q(r'Was bedeutet: Der Nullvektor lässt sich als $r\vec{a} + s\vec{b} = \vec{o}$ mit $r \neq 0$ schreiben?',
    [r'$\vec{a}$ und $\vec{b}$ sind linear abhängig.', r'$\vec{a}$ und $\vec{b}$ sind linear unabhängig.',
     r'$\vec{a}$ ist der Nullvektor.', r'$\vec{a}$ und $\vec{b}$ sind senkrecht.'],
    [r'Dann ist $\vec{a} = -\dfrac{s}{r}\vec{b}$, ein Vielfaches von $\vec{b}$.'])


def check():
    import sympy as sp
    V = lambda *c: sp.Matrix(c)
    r, s, t = sp.symbols('r s t')
    assert 2 * V(1, 2) + 3 * V(1, -1) == V(5, 1)
    sol = sp.solve(list(r * V(1, 1, 0) + s * V(0, 1, 1) + t * V(1, 0, 1) - V(4, 5, 6)), [r, s, t])
    assert sol == {r: sp.Rational(3, 2), s: sp.Rational(7, 2), t: sp.Rational(5, 2)}
    assert V(1, 2, 3).cross(V(2, 4, 5)) != V(0, 0, 0)
    assert V(1, 0, 0) + V(0, 1, 0) == V(1, 1, 0)
    assert V(3, 6, 6) == 3 * V(1, 2, 2)
    A, B, C = V(1, 2, 3), V(2, 4, 5), V(4, 8, 9)
    assert C - A == 3 * (B - A)
    assert (V(3, 5, 8) - V(1, 2, 2)).norm() == 7
    P, Q2, R = V(1, 1, 1), V(3, 1, 1), V(2, 3, 1)
    assert (Q2 - P).norm() == 2 and (R - P).norm() == sp.sqrt(5) and (R - Q2).norm() == sp.sqrt(5)
    assert (2 * V(1, 2, 2)).norm() == 6
    assert V(2, -1, 2) / 3 == V(sp.Rational(2, 3), -sp.Rational(1, 3), sp.Rational(2, 3))
    assert (V(-2, 4, 1) + V(6, 0, 3)) / 2 == V(2, 2, 2)
    assert 2 * V(1, 1, 1) - V(3, 0, -1) == V(-1, 2, 3)
    assert V(6, 3, 9) / 3 == V(2, 1, 3)
    assert (V(1, 0, 0) + V(0, 3, 0) + V(2, 0, 6)) / 3 == V(1, 1, 2)


Q.verify(check)
Q.save()
