#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 5 (LB 1): Lagebeziehungen zweier Geraden - identisch,
parallel, schneidend, windschief; Schnittpunkt per LGS, Schnittwinkel über das
Skalarprodukt, Orthogonalität, Anwendungen (Flugbahnen, Rohrleitungen).
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec

Q = fos12(nr=5, slug='lagebeziehungen', thema='Lagebeziehungen von Geraden', lb='LB 1',
          blurb='identisch, parallel, schneidend, windschief; Schnittpunkt und Schnittwinkel',
          comment='Blocks: Richtungsvektoren vergleichen (1-5), Fallunterscheidung mit LGS (6-11), Schnittwinkel und Orthogonalität (12-17), Anwendungen (18-20). Alles ohne CAS.')

FAELLE = [r'identisch', r'echt parallel', r'schneidend', r'windschief']


def g(p, u, t='t'):
    return r'\vec x = ' + vec(*p) + ' + ' + t + r' \cdot ' + vec(*u)


def cases(correct):
    """The four cases with the right one first."""
    return [correct] + [c for c in FAELLE if c != correct]


# ------------------------------------------------- Richtungsvektoren vergleichen ----
Q.q(r'Sind $\vec u = ' + vec(2, -4, 6) + r'$ und $\vec v = ' + vec(-1, 2, -3) + '$ parallel (kollinear)?',
    [r'ja, $\vec v = -\dfrac{1}{2}\,\vec u$', r'nein, die Vorzeichen passen nicht', r'ja, $\vec v = -2\,\vec u$', r'ja, $\vec v = \dfrac{1}{2}\,\vec u$'],
    [r'Ansatz $\vec v = k \cdot \vec u$: erste Koordinate $-1 = 2k$, also $k = -\frac{1}{2}$.',
     r'Probe: $-\frac{1}{2} \cdot (-4) = 2$ und $-\frac{1}{2} \cdot 6 = -3$ - alle Koordinaten passen.',
     r'Entgegengesetzte Vorzeichen stören nicht: $k$ darf negativ sein.'])

Q.q(r'Sind $\vec u = ' + vec(1, 2, 3) + r'$ und $\vec v = ' + vec(2, 4, 5) + '$ parallel (kollinear)?',
    [r'nein: aus den ersten Koordinaten folgt $k = 2$, aber $2 \cdot 3 = 6 \neq 5$', r'ja, $\vec v = 2\,\vec u$', r'ja, mit $k = \dfrac{5}{3}$', r'nein, weil keiner der Vektoren eine Nullkoordinate hat'],
    [r'$2 = k \cdot 1$ gibt $k = 2$; zweite Koordinate $4 = 2 \cdot 2$ stimmt.',
     r'Dritte Koordinate: $2 \cdot 3 = 6$, aber $v_3 = 5$ - Widerspruch, also nicht parallel.',
     r'Falle: nach zwei passenden Koordinaten aufhören.'])

Q.q(r'Die Richtungsvektoren zweier Geraden $g$ und $h$ sind parallel. Welche Lagen sind dann noch möglich?',
    [r'identisch oder echt parallel - die Punktprobe entscheidet', r'schneidend oder windschief', r'nur identisch', r'nur echt parallel'],
    [r'Parallele Richtungsvektoren heißen: gleiche Richtung. Entweder haben die Geraden alle Punkte gemeinsam oder keinen.',
     r'Punktprobe: liegt der Stützpunkt von $h$ auf $g$, sind sie identisch, sonst echt parallel.',
     r'Schneidend oder windschief geht nur bei nicht parallelen Richtungsvektoren.'])

Q.q(r'Was bedeutet es, dass zwei Geraden windschief sind?',
    [r'Sie sind nicht parallel und haben keinen gemeinsamen Punkt.',
     r'Sie sind parallel und haben keinen gemeinsamen Punkt.',
     r'Sie haben genau einen gemeinsamen Punkt, aber keinen rechten Winkel.',
     r'Sie liegen in einer gemeinsamen Ebene, schneiden sich aber nicht.'],
    [r'Windschiefe Geraden laufen aneinander vorbei: keine gemeinsame Richtung, kein Schnittpunkt.',
     r'Das gibt es nur im Raum - in der Ebene sind zwei Geraden immer parallel oder schneidend.',
     r'Zwei Geraden in einer gemeinsamen Ebene ohne Schnittpunkt wären parallel.'])

Q.q(r'Untersuche die Lage von $g: ' + g((1, 2, 3), (1, -1, 2)) + r'$ und $h: ' + g((3, 0, 7), (-2, 2, -4), 's') + '$.',
    cases(r'identisch'),
    [r'Richtungsvektoren: $' + vec(-2, 2, -4) + r' = -2 \cdot ' + vec(1, -1, 2) + '$ - parallel.',
     r'Punktprobe mit dem Stützpunkt $(3|0|7)$ von $h$ in $g$: $1 + t = 3$ gibt $t = 2$; $2 - 2 = 0$ und $3 + 4 = 7$ passen.',
     r'Der Stützpunkt von $h$ liegt auf $g$ - die Geraden sind identisch.'])

# ------------------------------------------------ Fallunterscheidung mit LGS ----
Q.q(r'Untersuche die Lage von $g: ' + g((1, 0, 2), (1, 1, 0)) + r'$ und $h: ' + g((0, 3, 5), (2, 2, 0), 's') + '$.',
    cases(r'echt parallel'),
    [r'$' + vec(2, 2, 0) + r' = 2 \cdot ' + vec(1, 1, 0) + '$ - die Richtungsvektoren sind parallel.',
     r'Punktprobe $(0|3|5)$ in $g$: die $z$-Koordinate von $g$ ist immer $2$, aber $5 \neq 2$.',
     r'Gleiche Richtung, kein gemeinsamer Punkt: echt parallel.'])

Q.q(r'Untersuche die Lage von $g: ' + g((1, 1, 1), (1, 0, 1)) + r'$ und $h: ' + g((2, 3, 0), (0, 1, -1), 's') + '$.',
    [r'schneidend, Schnittpunkt $S(2|1|2)$', r'windschief', r'echt parallel', r'identisch'],
    [r'Die Richtungsvektoren sind nicht parallel. Gleichsetzen: $1 + t = 2$, $1 = 3 + s$, $1 + t = -s$.',
     r'Aus den ersten beiden Zeilen: $t = 1$, $s = -2$. Dritte Zeile: $1 + 1 = 2$ und $-(-2) = 2$ - stimmt.',
     r'$t = 1$ in $g$: $S(2|1|2)$. Probe mit $s = -2$ in $h$: $(2|1|2)$.'])

Q.q(r'Untersuche die Lage der $x$-Achse $g: \vec x = t \cdot ' + vec(1, 0, 0) + r'$ und der Geraden $h: ' + g((0, 1, 0), (0, 0, 1), 's') + '$.',
    cases(r'windschief'),
    [r'Die Richtungsvektoren $' + vec(1, 0, 0) + r'$ und $' + vec(0, 0, 1) + '$ sind nicht parallel.',
     r'Gleichsetzen: $t = 0$, $0 = 1$, $0 = s$ - die zweite Zeile ist ein Widerspruch.',
     r'Nicht parallel, kein Schnittpunkt: windschief. $h$ verläuft parallel zur $z$-Achse, um $1$ in $y$-Richtung verschoben.'])

Q.q(r'Untersuche die Lage von $g: ' + g((2, 1, 0), (1, 2, 1)) + r'$ und $h: ' + g((1, 4, 1), (2, -1, 0), 's') + '$.',
    [r'schneidend in $S(3|3|1)$', r'windschief', r'schneidend in $S(1|4|1)$', r'echt parallel'],
    [r'Gleichsetzen: $2 + t = 1 + 2s$, $1 + 2t = 4 - s$, $t = 1$.',
     r'$t = 1$ in die erste Zeile: $3 = 1 + 2s$, also $s = 1$. Probe zweite Zeile: $1 + 2 = 3$ und $4 - 1 = 3$ - stimmt.',
     r'Schnittpunkt: $t = 1$ in $g$ gibt $S(3|3|1)$; $(1|4|1)$ ist nur der Stützpunkt von $h$.'])

Q.q(r'Für welchen Wert von $a$ sind $g: ' + g((1, 2, 3), (2, 'a', 4)) + r'$ und $h: ' + g((0, 0, 1), (1, 3, 2), 's') + '$ parallel?',
    [r'$a = 6$', r'$a = 3$', r'$a = 1{,}5$', r'$a = 12$'],
    [r'Parallel heißt $' + vec(2, 'a', 4) + r' = k \cdot ' + vec(1, 3, 2) + r'$. Erste Koordinate: $k = 2$; dritte: $4 = 2 \cdot 2$ stimmt.',
     r'Zweite Koordinate: $a = 2 \cdot 3 = 6$',
     r'Probe: $' + vec(2, 6, 4) + r' = 2 \cdot ' + vec(1, 3, 2) + '$'])

Q.q(r'Untersuche die Lage von $g: ' + g((1, 0, 0), (0, 1, 1)) + r'$ und $h: ' + g((0, 1, 0), (1, 0, 1), 's') + '$.',
    [r'schneidend in $S(1|1|1)$', r'windschief', r'schneidend in $S(1|0|0)$', r'echt parallel'],
    [r'Gleichsetzen: $1 = s$, $t = 1$, $t = s$.',
     r'$s = 1$ und $t = 1$ erfüllen auch die dritte Zeile: $1 = 1$.',
     r'$t = 1$ in $g$: $S(1|1|1)$. Probe in $h$ mit $s = 1$: $(1|1|1)$.'])

# --------------------------------------- Schnittwinkel und Orthogonalität ----
Q.q(r'Zwei Geraden schneiden sich und haben die Richtungsvektoren $\vec u = ' + vec(1, 1, 0) + r'$ und $\vec v = ' + vec(1, 0, 1) + '$. Berechne den Schnittwinkel.',
    [r'$60^\circ$', r'$45^\circ$', r'$30^\circ$', r'$90^\circ$'],
    [r'$\cos\varphi = \dfrac{|\vec u \cdot \vec v|}{|\vec u| \cdot |\vec v|} = \dfrac{1}{\sqrt{2} \cdot \sqrt{2}} = \dfrac{1}{2}$',
     r'$\varphi = \cos^{-1}(0{,}5) = 60^\circ$',
     r'Beide Vektoren sind Flächendiagonalen eines Würfels - sie bilden mit der dritten ein gleichseitiges Dreieck.'])

Q.q(r'Berechne den Schnittwinkel zweier Geraden mit den Richtungsvektoren $\vec u = ' + vec(1, 0, 0) + r'$ und $\vec v = ' + vec(-1, 1, 0) + '$.',
    [r'$45^\circ$', r'$135^\circ$', r'$90^\circ$', r'$60^\circ$'],
    [r'$\vec u \cdot \vec v = -1$, $|\vec u| = 1$, $|\vec v| = \sqrt{2}$',
     r'Schnittwinkel: $\cos\varphi = \dfrac{|-1|}{1 \cdot \sqrt{2}} \approx 0{,}707$, also $\varphi = 45^\circ$',
     r'Falle: ohne den Betrag käme $135^\circ$ heraus - der Schnittwinkel von Geraden ist immer der spitze, höchstens $90^\circ$.'])

Q.q(r'Die Geraden $g$ und $h$ mit $\vec u = ' + vec(2, 1, 2) + r'$ und $\vec v = ' + vec(0, 3, 4) + '$ schneiden sich. Berechne den Schnittwinkel.',
    [r'$\varphi \approx 42{,}8^\circ$', r'$\varphi \approx 47{,}2^\circ$', r'$\varphi \approx 137{,}2^\circ$', r'$\varphi \approx 36{,}9^\circ$'],
    [r'$\vec u \cdot \vec v = 0 + 3 + 8 = 11$, $|\vec u| = \sqrt{4 + 1 + 4} = 3$, $|\vec v| = \sqrt{0 + 9 + 16} = 5$',
     r'$\cos\varphi = \dfrac{11}{15} \approx 0{,}733$, also $\varphi = \cos^{-1}(0{,}733) \approx 42{,}8^\circ$',
     r'Falle: $\sin^{-1}$ statt $\cos^{-1}$ liefert $47{,}2^\circ$.'])

Q.q(r'Welche Aussage über $g: \vec x = t \cdot ' + vec(1, 2, 2) + r'$ und $h: ' + g((-1, 1, 4), (2, 1, -2), 's') + '$ ist richtig?',
    [r'$g$ und $h$ schneiden sich in $S(1|2|2)$ und stehen senkrecht aufeinander.',
     r'$g$ und $h$ sind windschief.',
     r'$g$ und $h$ schneiden sich unter $60^\circ$.',
     r'$g$ und $h$ sind echt parallel.'],
    [r'Gleichsetzen: $t = -1 + 2s$, $2t = 1 + s$, $2t = 4 - 2s$. Aus den letzten beiden: $1 + s = 4 - 2s$, also $s = 1$, $t = 1$.',
     r'Erste Zeile: $1 = -1 + 2$ stimmt - Schnittpunkt $S(1|2|2)$.',
     r'$\vec u \cdot \vec v = 2 + 2 - 4 = 0$ - die Richtungsvektoren sind orthogonal, Schnittwinkel $90^\circ$.'])

Q.q(r'Berechne den Schnittpunkt von $g: ' + g((1, 2, 0), (2, 1, 3)) + r'$ und $h: ' + g((5, 1, 3), (1, -1, 0), 's') + '$.',
    [r'$S(3|3|3)$', r'$S(5|1|3)$', r'$S(1|2|0)$', r'$S(7|-1|3)$'],
    [r'Gleichsetzen: $1 + 2t = 5 + s$, $2 + t = 1 - s$, $3t = 3$.',
     r'$t = 1$; erste Zeile: $3 = 5 + s$, also $s = -2$. Probe zweite Zeile: $2 + 1 = 3$ und $1 + 2 = 3$ - stimmt.',
     r'$t = 1$ in $g$: $S(3|3|3)$; $(5|1|3)$ und $(1|2|0)$ sind nur die Stützpunkte.'])

Q.q(r'Für welchen Wert von $b$ schneiden sich $g: ' + g((1, 0, 'b'), (1, 1, 0)) + r'$ und $h: ' + g((0, 2, 3), (1, -1, 0), 's') + '$?',
    [r'$b = 3$', r'$b = 0$', r'$b = -3$', r'für keinen Wert von $b$'],
    [r'Beide Richtungsvektoren haben $z$-Koordinate $0$: $g$ liegt in der Höhe $z = b$, $h$ in der Höhe $z = 3$.',
     r'Die Richtungsvektoren sind nicht parallel, die Geraden können sich also nur in derselben Höhe treffen: $b = 3$.',
     r'Dann: $1 + t = s$ und $t = 2 - s$ geben $t = \frac{1}{2}$, $s = \frac{3}{2}$ - Schnittpunkt $(1{,}5|0{,}5|3)$.'])

# ------------------------------------------------------------ Anwendungen ----
Q.q(r'Zwei Flugzeuge fliegen geradlinig; die Position von Flugzeug 1 nach $t$ Minuten ist $' + g((0, 0, 5), (2, 1, 0)) + r'$, die von Flugzeug 2 ist $' + g((5, -5, 5), (-1, 2, 0)) + r'$ (Angaben in km). Kommt es zum Zusammenstoß?',
    [r'Nein: die Bahnen schneiden sich in $S(2|1|5)$, aber Flugzeug 1 ist bei $t = 1$ dort, Flugzeug 2 erst bei $t = 3$.',
     r'Ja, die Flugzeuge stoßen in $S(2|1|5)$ zusammen.',
     r'Nein, die Bahnen sind windschief.',
     r'Nein, die Bahnen sind parallel.'],
    [r'Schnittpunkt der Bahnen (verschiedene Parameter $t$ und $s$): $2t = 5 - s$, $t = -5 + 2s$, $5 = 5$. Lösung: $t = 1$, $s = 3$, also $S(2|1|5)$.',
     r'Für einen Zusammenstoß müssten beide zur selben Zeit dort sein - Flugzeug 1 bei $t = 1$, Flugzeug 2 bei $t = 3$.',
     r'Probe: gleiche Zeit $t$ in beiden: $2t = 5 - t$ gibt $t = \frac{5}{3}$, aber $t = -5 + 2t$ gibt $t = 5$ - kein gemeinsames $t$.'])

Q.q(r'Zwei Rohrleitungen verlaufen längs $g: ' + g((1, 0, 2), (2, 1, 0)) + r'$ und $h: ' + g((3, 4, 2), (1, -1, 0), 's') + r'$. Unter welchem Winkel treffen sie aufeinander?',
    [r'$\varphi \approx 71{,}6^\circ$', r'$\varphi \approx 108{,}4^\circ$', r'$\varphi \approx 18{,}4^\circ$', r'$45^\circ$'],
    [r'Beide liegen in der Höhe $z = 2$ und sind nicht parallel - sie treffen sich: $1 + 2t = 3 + s$, $t = 4 - s$ geben $t = 2$, $s = 2$, Treffpunkt $(5|2|2)$.',
     r'$\cos\varphi = \dfrac{|\vec u \cdot \vec v|}{|\vec u| \cdot |\vec v|} = \dfrac{|2 - 1 + 0|}{\sqrt{5} \cdot \sqrt{2}} = \dfrac{1}{\sqrt{10}} \approx 0{,}316$',
     r'$\varphi = \cos^{-1}(0{,}316) \approx 71{,}6^\circ$ - das Verbindungsstück braucht diesen Winkel.'])

Q.q(r'Ein Würfel hat die Ecken $A(0|0|0)$, $B(1|0|0)$, $G(1|1|1)$ und $H(0|1|1)$. Unter welchem Winkel schneiden sich die Raumdiagonalen $\overline{AG}$ und $\overline{BH}$?',
    [r'$\varphi \approx 70{,}5^\circ$', r'$\varphi \approx 109{,}5^\circ$', r'$90^\circ$', r'$\varphi \approx 54{,}7^\circ$'],
    [r'$\overrightarrow{AG} = ' + vec(1, 1, 1) + r'$, $\overrightarrow{BH} = ' + vec(-1, 1, 1) + r'$, beide haben den Betrag $\sqrt{3}$.',
     r'$\cos\varphi = \dfrac{|-1 + 1 + 1|}{\sqrt{3} \cdot \sqrt{3}} = \dfrac{1}{3}$, also $\varphi = \cos^{-1}\!\left(\dfrac{1}{3}\right) \approx 70{,}5^\circ$',
     r'Die Raumdiagonalen eines Würfels stehen also nicht senkrecht aufeinander; $109{,}5^\circ$ ist der Nebenwinkel.'])


def check():
    from fractions import Fraction as F
    from math import sqrt, acos, asin, degrees
    import sympy as sp
    dot = lambda a, b: sum(x * y for x, y in zip(a, b))
    n2 = lambda a: dot(a, a)
    sang = lambda a, b: degrees(acos(abs(dot(a, b)) / sqrt(n2(a) * n2(b))))
    near = lambda x, y, tol=0.05: abs(x - y) < tol
    add = lambda p, q: tuple(x + y for x, y in zip(p, q))
    mul = lambda k, v: tuple(k * x for x in v)
    at = lambda p, u, t: add(p, mul(t, u))

    def collinear(u, v):
        return sp.Matrix([u, v]).rank() == 1

    def lage(p, u, q, v):
        """identisch / echt parallel / schneidend (with point) / windschief - via sympy, independent of the steps."""
        t, s = sp.symbols('t s')
        if collinear(u, v):
            sol = sp.solve([p[i] + t * u[i] - q[i] for i in range(3)], t, dict=True)
            return 'identisch' if sol else 'echt parallel'
        sol = sp.solve([p[i] + t * u[i] - q[i] - s * v[i] for i in range(3)], [t, s], dict=True)
        if not sol:
            return 'windschief'
        return ('schneidend', tuple(p[i] + sol[0][t] * u[i] for i in range(3)), sol[0][t], sol[0][s])

    # 1-5: Richtungsvektoren vergleichen
    assert mul(F(-1, 2), (2, -4, 6)) == (-1, 2, -3) and mul(-2, (2, -4, 6)) != (-1, 2, -3) and mul(F(1, 2), (2, -4, 6)) != (-1, 2, -3)
    assert collinear((2, -4, 6), (-1, 2, -3))
    assert not collinear((1, 2, 3), (2, 4, 5)) and mul(2, (1, 2, 3)) == (2, 4, 6) and 6 != 5
    assert lage((1, 2, 3), (1, -1, 2), (3, 0, 7), (-2, 2, -4)) == 'identisch' and mul(-2, (1, -1, 2)) == (-2, 2, -4) and at((1, 2, 3), (1, -1, 2), 2) == (3, 0, 7)
    # 6-11: Fallunterscheidung
    assert lage((1, 0, 2), (1, 1, 0), (0, 3, 5), (2, 2, 0)) == 'echt parallel' and mul(2, (1, 1, 0)) == (2, 2, 0)
    r = lage((1, 1, 1), (1, 0, 1), (2, 3, 0), (0, 1, -1))
    assert r[0] == 'schneidend' and r[1] == (2, 1, 2) and (r[2], r[3]) == (1, -2) and at((2, 3, 0), (0, 1, -1), -2) == (2, 1, 2)
    assert lage((0, 0, 0), (1, 0, 0), (0, 1, 0), (0, 0, 1)) == 'windschief'
    r = lage((2, 1, 0), (1, 2, 1), (1, 4, 1), (2, -1, 0))
    assert r[0] == 'schneidend' and r[1] == (3, 3, 1) and (r[2], r[3]) == (1, 1) and at((1, 4, 1), (2, -1, 0), 1) == (3, 3, 1)
    assert mul(2, (1, 3, 2)) == (2, 6, 4) and all(not collinear((2, a, 4), (1, 3, 2)) for a in (3, F(3, 2), 12))
    r = lage((1, 0, 0), (0, 1, 1), (0, 1, 0), (1, 0, 1))
    assert r[0] == 'schneidend' and r[1] == (1, 1, 1) and (r[2], r[3]) == (1, 1)
    # 12-17: Schnittwinkel und Orthogonalität
    assert dot((1, 1, 0), (1, 0, 1)) == 1 and n2((1, 1, 0)) == 2 and n2((1, 0, 1)) == 2 and near(sang((1, 1, 0), (1, 0, 1)), 60, 1e-9)
    assert dot((1, 0, 0), (-1, 1, 0)) == -1 and near(sang((1, 0, 0), (-1, 1, 0)), 45, 1e-9) and near(degrees(acos(-1 / sqrt(2))), 135, 1e-9)
    assert dot((2, 1, 2), (0, 3, 4)) == 11 and n2((2, 1, 2)) == 9 and n2((0, 3, 4)) == 25 and near(11 / 15, 0.733, 0.0005)
    assert near(sang((2, 1, 2), (0, 3, 4)), 42.8) and near(degrees(asin(11 / 15)), 47.2) and near(180 - sang((2, 1, 2), (0, 3, 4)), 137.2)
    r = lage((0, 0, 0), (1, 2, 2), (-1, 1, 4), (2, 1, -2))
    assert r[0] == 'schneidend' and r[1] == (1, 2, 2) and (r[2], r[3]) == (1, 1) and dot((1, 2, 2), (2, 1, -2)) == 0
    r = lage((1, 2, 0), (2, 1, 3), (5, 1, 3), (1, -1, 0))
    assert r[0] == 'schneidend' and r[1] == (3, 3, 3) and (r[2], r[3]) == (1, -2) and at((5, 1, 3), (1, -1, 0), 2) == (7, -1, 3)
    assert not collinear((1, 1, 0), (1, -1, 0))
    r = lage((1, 0, 3), (1, 1, 0), (0, 2, 3), (1, -1, 0))
    assert r[0] == 'schneidend' and r[1] == (F(3, 2), F(1, 2), 3) and (r[2], r[3]) == (F(1, 2), F(3, 2))
    for b in (0, -3):
        assert lage((1, 0, b), (1, 1, 0), (0, 2, 3), (1, -1, 0)) == 'windschief'
    # 18-20: Anwendungen
    r = lage((0, 0, 5), (2, 1, 0), (5, -5, 5), (-1, 2, 0))
    assert r[0] == 'schneidend' and r[1] == (2, 1, 5) and (r[2], r[3]) == (1, 3)
    assert at((0, 0, 5), (2, 1, 0), 1) == (2, 1, 5) and at((5, -5, 5), (-1, 2, 0), 3) == (2, 1, 5)
    t = sp.symbols('t')
    assert sp.solve(sp.Eq(2 * t, 5 - t), t) == [sp.Rational(5, 3)] and sp.solve(sp.Eq(t, -5 + 2 * t), t) == [5]
    assert all(at((0, 0, 5), (2, 1, 0), k) != at((5, -5, 5), (-1, 2, 0), k) for k in range(0, 20))
    r = lage((1, 0, 2), (2, 1, 0), (3, 4, 2), (1, -1, 0))
    assert r[0] == 'schneidend' and r[1] == (5, 2, 2) and (r[2], r[3]) == (2, 2)
    assert dot((2, 1, 0), (1, -1, 0)) == 1 and n2((2, 1, 0)) == 5 and n2((1, -1, 0)) == 2 and near(1 / sqrt(10), 0.316, 0.0005)
    assert near(sang((2, 1, 0), (1, -1, 0)), 71.6) and near(180 - sang((2, 1, 0), (1, -1, 0)), 108.4) and near(90 - sang((2, 1, 0), (1, -1, 0)), 18.4)
    AG, BH = (1 - 0, 1 - 0, 1 - 0), (0 - 1, 1 - 0, 1 - 0)
    assert AG == (1, 1, 1) and BH == (-1, 1, 1) and n2(AG) == 3 and n2(BH) == 3 and dot(AG, BH) == 1
    assert near(sang(AG, BH), 70.5) and near(180 - sang(AG, BH), 109.5) and near(degrees(acos(1 / sqrt(3))), 54.7)
    r = lage((0, 0, 0), AG, (1, 0, 0), BH)
    assert r[0] == 'schneidend' and r[1] == (F(1, 2), F(1, 2), F(1, 2))


Q.verify(check)
Q.save()
