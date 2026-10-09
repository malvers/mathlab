#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 17 (Puffer vor Weihnachten): Vektoren im
Raum zum Knobeln - Würfel, Diagonalen, Tetraeder im Würfel, Sechseck-Schnitt, kürzeste
Wege, Vierecke. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12, vec
import numpy as np
import math

Q = gy12(nr=17, slug='jahresausklang', thema='Knobeleien im Raum', lb='Puffer',
         blurb='Würfel, Diagonalen, Tetraeder, Schnitte und kürzeste Wege',
         comment='Blocks: Winkel am Würfel (1-3, 20), Längen und Wege (4, 9), Körper im Würfel (5-8, 18), Vierecke und Punkte (11-16, 19). Ohne Hilfsmittel, Taschenrechner für Winkel.')

Q.q(r'Welchen Winkel bildet die Raumdiagonale eines Würfels mit einer Kante, die von derselben Ecke ausgeht?',
    [r'$\approx 54{,}7^\circ$', r'$45^\circ$', r'$\approx 35{,}3^\circ$', r'$60^\circ$'],
    [r'Würfel mit Kante $1$: Diagonale $(1;\ 1;\ 1)$, Kante $(1;\ 0;\ 0)$.',
     r'$\cos\varphi = \tfrac{1}{\sqrt3}$, $\varphi \approx 54{,}7^\circ$.'])

Q.q(r'Welchen Winkel bilden zwei Raumdiagonalen eines Würfels miteinander (spitzer Winkel)?',
    [r'$\approx 70{,}5^\circ$', r'$90^\circ$', r'$60^\circ$', r'$\approx 54{,}7^\circ$'],
    [r'Diagonalen $(1;\ 1;\ 1)$ und $(-1;\ 1;\ 1)$, Skalarprodukt $1$, Beträge $\sqrt3$.',
     r'$\cos\varphi = \tfrac13$, $\varphi \approx 70{,}5^\circ$.'])

Q.q(r'Welchen Winkel bildet die Raumdiagonale mit der Diagonale der Grundfläche, die von derselben Ecke ausgeht?',
    [r'$\approx 35{,}3^\circ$', r'$45^\circ$', r'$\approx 54{,}7^\circ$', r'$30^\circ$'],
    [r'$(1;\ 1;\ 1)$ und $(1;\ 1;\ 0)$: Skalarprodukt $2$, Beträge $\sqrt3$ und $\sqrt2$.',
     r'$\cos\varphi = \tfrac{2}{\sqrt6} \approx 0{,}816$, $\varphi \approx 35{,}3^\circ$. Das ist auch der Steigungswinkel der Diagonale.'])

Q.q(r'Wie lang ist die Raumdiagonale eines Würfels mit der Kante $2$?',
    [r'$2\sqrt3 \approx 3{,}46$', r'$2\sqrt2 \approx 2{,}83$', r'$6$', r'$\sqrt{12} \cdot 2$'],
    [r'$|(2;\ 2;\ 2)| = \sqrt{4 + 4 + 4} = \sqrt{12}$.',
     r'$= 2\sqrt3$. $2\sqrt2$ ist die Flächendiagonale.'])

Q.q(r'Die Ecken $(0 \mid 0 \mid 0)$, $(1 \mid 1 \mid 0)$, $(1 \mid 0 \mid 1)$, $(0 \mid 1 \mid 1)$ des Einheitswürfels bilden einen Körper. Welchen?',
    [r'ein regelmäßiges Tetraeder mit der Kante $\sqrt2$', r'ein Quadrat', r'eine Pyramide mit quadratischer Grundfläche', r'ein Tetraeder mit der Kante $1$'],
    [r'Jeder Abstand zwischen zwei der vier Punkte ist eine Flächendiagonale, $\sqrt2$.',
     r'Sechs gleich lange Kanten, vier gleichseitige Dreiecke: ein regelmäßiges Tetraeder.'])

Q.q(r'Welches Volumen hat das Tetraeder aus Aufgabe 5?',
    [r'$\tfrac13$', r'$\tfrac16$', r'$\tfrac12$', r'$\tfrac23$'],
    [r'Vom Würfel (Volumen $1$) werden an den vier anderen Ecken Pyramiden mit dem Volumen $\tfrac13 \cdot \tfrac12 \cdot 1 = \tfrac16$ abgeschnitten.',
     r'$1 - 4 \cdot \tfrac16 = \tfrac13$.'])

Q.q(r'Die Ebene $x + y + z = 1{,}5$ schneidet den Einheitswürfel $[0;\ 1]^3$ in einem regelmäßigen Sechseck mit der Seitenlänge $\tfrac{\sqrt2}{2}$. Wie groß ist es?',
    [r'$\tfrac{3\sqrt3}{4} \approx 1{,}30$', r'$\tfrac{\sqrt3}{2} \approx 0{,}87$', r'$1{,}5$', r'$\tfrac{3\sqrt3}{2} \approx 2{,}60$'],
    [r'Ein regelmäßiges Sechseck besteht aus sechs gleichseitigen Dreiecken: $A = 6 \cdot \tfrac{\sqrt3}{4} s^2 = \tfrac{3\sqrt3}{2} s^2$.',
     r'Mit $s^2 = \tfrac12$: $A = \tfrac{3\sqrt3}{4} \approx 1{,}30$.'])

Q.q(r'Für jeden Würfel gilt der Eulersche Polyedersatz: Ecken minus Kanten plus Flächen ergibt …',
    [r'$2$', r'$0$', r'$6$', r'$8$'],
    [r'Würfel: $8$ Ecken, $12$ Kanten, $6$ Flächen.',
     r'$8 - 12 + 6 = 2$. Das gilt für jeden konvexen Polyeder.'])

Q.q(r'Eine Ameise läuft auf der Oberfläche eines Würfels mit der Kante $1$ von einer Ecke zur gegenüberliegenden Ecke. Wie lang ist der kürzeste Weg?',
    [r'$\sqrt5 \approx 2{,}24$', r'$\sqrt3 \approx 1{,}73$', r'$2$', r'$1 + \sqrt2 \approx 2{,}41$'],
    [r'Zwei benachbarte Flächen aufklappen: Sie bilden ein Rechteck $2 \times 1$.',
     r'Die Diagonale hat die Länge $\sqrt{4 + 1} = \sqrt5$. Durch den Würfel hindurch wären es $\sqrt3$.'])

Q.q(r'Die Seiten eines Dreiecks werden als Vektoren $\vec a = \vec{AB}$, $\vec b = \vec{BC}$, $\vec c = \vec{CA}$ aufgefasst. Was gilt?',
    [r'$\vec a + \vec b + \vec c = \vec 0$', r'$\vec a + \vec b = \vec c$', r'$|\vec a| + |\vec b| = |\vec c|$', r'$\vec a \cdot \vec b \cdot \vec c = 0$'],
    [r'Einmal ganz herum führt zurück zum Anfangspunkt.',
     r'Die Längen addieren sich dagegen nicht: Dreiecksungleichung.'])

Q.q(r'Wo liegt der Mittelpunkt der Raumdiagonale von $(0 \mid 0 \mid 0)$ nach $(4 \mid 4 \mid 4)$?',
    [r'$(2 \mid 2 \mid 2)$', r'$(4 \mid 4 \mid 0)$', r'$(2 \mid 2 \mid 0)$', r'$(1 \mid 1 \mid 1)$'],
    [r'$\vec{OM} = \tfrac12 (\vec{OA} + \vec{OB})$.',
     r'$(2 \mid 2 \mid 2)$, der Mittelpunkt des Würfels: Alle vier Raumdiagonalen schneiden sich dort.'])

Q.q(r'Welcher Punkt der $x$-Achse ist von $A(0 \mid 0 \mid 0)$ und $B(4 \mid 0 \mid 0)$ gleich weit entfernt?',
    [r'$(2 \mid 0 \mid 0)$', r'$(4 \mid 0 \mid 0)$', r'$(0 \mid 2 \mid 0)$', r'$(1 \mid 0 \mid 0)$'],
    [r'$|x - 0| = |x - 4|$ gibt $x = 2$.',
     r'Der Mittelpunkt der Strecke.'])

Q.q(r'Ist das Viereck $A(1 \mid 1 \mid 1)$, $B(3 \mid 2 \mid 1)$, $C(4 \mid 4 \mid 2)$, $D(2 \mid 3 \mid 2)$ ein Parallelogramm?',
    [r'Ja, $\vec{AB} = \vec{DC} = ' + vec(2, 1, 0) + r'$.', r'Nein, $\vec{AB} \neq \vec{DC}$.', r'Ja, weil alle Seiten gleich lang sind.', r'Nein, die Punkte liegen nicht in einer Ebene.'],
    [r'$\vec{AB} = (2;\ 1;\ 0)$, $\vec{DC} = (4 - 2;\ 4 - 3;\ 2 - 2) = (2;\ 1;\ 0)$.',
     r'Gleiche Vektoren: gegenüberliegende Seiten parallel und gleich lang.'])

Q.q(r'Ist das Parallelogramm aus Aufgabe 13 ein Rechteck?',
    [r'Nein, $\vec{AB} \cdot \vec{AD} = 4 \neq 0$.', r'Ja, $\vec{AB} \cdot \vec{AD} = 0$.', r'Ja, weil es ein Parallelogramm ist.', r'Nein, weil $\vec{AB} = \vec{DC}$.'],
    [r'$\vec{AD} = (1;\ 2;\ 1)$, $\vec{AB} \cdot \vec{AD} = 2 + 2 + 0 = 4$.',
     r'Kein rechter Winkel bei $A$.'])

Q.q(r'Wo liegt der Schwerpunkt des Dreiecks $(0 \mid 0 \mid 0)$, $(3 \mid 0 \mid 0)$, $(0 \mid 3 \mid 3)$?',
    [r'$(1 \mid 1 \mid 1)$', r'$(1{,}5 \mid 1{,}5 \mid 1{,}5)$', r'$(3 \mid 3 \mid 3)$', r'$(1 \mid 1 \mid 0)$'],
    [r'$\vec{OS} = \tfrac13 (\vec{OA} + \vec{OB} + \vec{OC}) = \tfrac13 (3;\ 3;\ 3)$.',
     r'$S(1 \mid 1 \mid 1)$.'])

Q.q(r'Wie viele Raumdiagonalen hat ein Würfel?',
    [r'$4$', r'$8$', r'$12$', r'$6$'],
    [r'Jede der $8$ Ecken ist mit genau einer gegenüberliegenden Ecke durch eine Raumdiagonale verbunden.',
     r'Jede Diagonale wird so zweimal gezählt: $\tfrac82 = 4$.'])

Q.q(r'Für zwei Vektoren gilt $|\vec a + \vec b| = |\vec a - \vec b|$. Was folgt?',
    [r'$\vec a \perp \vec b$', r'$\vec a = \vec b$', r'$\vec a \parallel \vec b$', r'$\vec b = \vec 0$'],
    [r'Quadrieren: $|\vec a|^2 + 2\,\vec a \cdot \vec b + |\vec b|^2 = |\vec a|^2 - 2\,\vec a \cdot \vec b + |\vec b|^2$.',
     r'Also $\vec a \cdot \vec b = 0$: Die Diagonalen eines Parallelogramms sind genau beim Rechteck gleich lang.'])

Q.q(r'Ein Quader hat die Kanten $3$, $4$ und $12$. Wie lang ist seine Raumdiagonale?',
    [r'$13$', r'$19$', r'$5$', r'$\sqrt{19}$'],
    [r'$\sqrt{3^2 + 4^2 + 12^2} = \sqrt{169}$.',
     r'$= 13$.'])

Q.q(r'Liegen $A(1 \mid 0 \mid 0)$, $B(0 \mid 1 \mid 0)$, $C(0 \mid 0 \mid 1)$ und $D(1 \mid 1 \mid -1)$ in einer Ebene?',
    [r'Ja, alle erfüllen $x + y + z = 1$.', r'Nein, $D$ liegt nicht in der Ebene durch $A$, $B$, $C$.', r'Nein, vier Punkte liegen nie in einer Ebene.', r'Das lässt sich nicht prüfen.'],
    [r'Ebene durch $A$, $B$, $C$: $x + y + z = 1$.',
     r'$D$: $1 + 1 - 1 = 1$ ✔'])

Q.q(r'Welchen Winkel bilden die Diagonalen zweier benachbarter Würfelflächen, die von derselben Ecke ausgehen?',
    [r'$60^\circ$', r'$90^\circ$', r'$45^\circ$', r'$\approx 70{,}5^\circ$'],
    [r'$(1;\ 1;\ 0)$ und $(0;\ 1;\ 1)$: Skalarprodukt $1$, Beträge $\sqrt2$.',
     r'$\cos\varphi = \tfrac12$, also $60^\circ$: Die drei Flächendiagonalen bilden ein gleichseitiges Dreieck.'])


def check():
    a = lambda *c: np.array(c, dtype=float)
    ang = lambda u, v: math.degrees(math.acos(abs(u @ v) / np.linalg.norm(u) / np.linalg.norm(v)))
    assert abs(ang(a(1, 1, 1), a(1, 0, 0)) - 54.7) < 0.05 and abs(ang(a(1, 1, 1), a(-1, 1, 1)) - 70.5) < 0.05
    assert abs(ang(a(1, 1, 1), a(1, 1, 0)) - 35.3) < 0.05 and abs(np.linalg.norm(a(2, 2, 2)) - 2 * math.sqrt(3)) < 1e-12
    P = [a(0, 0, 0), a(1, 1, 0), a(1, 0, 1), a(0, 1, 1)]
    assert all(abs(np.linalg.norm(P[i] - P[j]) - math.sqrt(2)) < 1e-12 for i in range(4) for j in range(i + 1, 4))
    assert abs(1 - 4 / 6 - 1 / 3) < 1e-12
    assert abs(3 * math.sqrt(3) / 2 * 0.5 - 3 * math.sqrt(3) / 4) < 1e-12 and abs(3 * math.sqrt(3) / 4 - 1.30) < 0.005
    assert 8 - 12 + 6 == 2 and abs(math.sqrt(5) - 2.24) < 0.005
    assert (a(3, 2, 1) - a(1, 1, 1) == a(4, 4, 2) - a(2, 3, 2)).all() and (a(3, 2, 1) - a(1, 1, 1)) @ (a(2, 3, 2) - a(1, 1, 1)) == 4
    assert ((a(0, 0, 0) + a(3, 0, 0) + a(0, 3, 3)) / 3 == a(1, 1, 1)).all()
    assert math.sqrt(9 + 16 + 144) == 13 and 1 + 1 - 1 == 1
    assert abs(ang(a(1, 1, 0), a(0, 1, 1)) - 60) < 1e-9


Q.verify(check)
Q.save()
