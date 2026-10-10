#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 29 / KW 15: Prüfungsvorbereitung 2 – Geometrie und
Funktionen (Stoff Klasse 8 bis 10). Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=29, slug='pruefung-geometrie-funktionen', thema='Prüfungsvorbereitung 2: Geometrie und Funktionen', lb='Prüfung',
         blurb='Ähnlichkeit, Trigonometrie, Kreis und Körper, lineare, quadratische, Exponential- und Sinusfunktionen',
         comment='Blocks: similarity (1-2, 18), trigonometry and Pythagoras (3-4, 16-17), circles and bodies (5-7, 19-20), functions (8-15). Results rounded to one decimal.')

Q.q(r'Ein 1,5 m langer Stab wirft einen 2 m langen Schatten. Zur selben Zeit wirft ein Baum einen 12 m langen Schatten. Wie hoch ist der Baum?',
    [r'9 m', r'16 m', r'8 m', r'10,5 m'],
    [r'Die Sonnenstrahlen bilden ähnliche Dreiecke: Höhe und Schatten stehen im selben Verhältnis.', r'$\dfrac{h}{12} = \dfrac{1{,}5}{2}$, also $h = 12 \cdot 0{,}75 = 9$ m.'])

Q.q(r'Eine Figur wird mit dem Faktor 3 vergrößert. Wie ändert sich ihr Flächeninhalt?',
    [r'Er wird 9-mal so groß.', r'Er wird 3-mal so groß.', r'Er wird 27-mal so groß.', r'Er wird 6-mal so groß.'],
    [r'Länge und Breite wachsen je mit dem Faktor 3: $3 \cdot 3 = 9$.'])

Q.q(r'Im rechtwinkligen Dreieck liegt die 7 cm lange Kathete dem Winkel $40^\circ$ gegenüber. Wie lang ist die Hypotenuse (gerundet)?',
    [r'10,9 cm', r'4,5 cm', r'9,1 cm', r'8,3 cm'],
    [r'$\sin 40^\circ = \dfrac{7}{c}$', r'$c = \dfrac{7}{\sin 40^\circ} \approx \dfrac{7}{0{,}643} \approx 10{,}9$ cm'])

Q.q(r'In einem Dreieck ist $a = 8$ cm, $b = 6$ cm und $\gamma = 60^\circ$. Wie lang ist $c$ (gerundet)?',
    [r'7,2 cm', r'10 cm', r'14 cm', r'5,3 cm'],
    [r'Kosinussatz: $c^2 = 64 + 36 - 2 \cdot 8 \cdot 6 \cdot 0{,}5 = 52$', r'$c = \sqrt{52} \approx 7{,}2$ cm'])

Q.q(r'Ein Kegel hat den Radius 6 cm und die Höhe 10 cm. Wie groß ist sein Volumen (gerundet)?',
    [r'377,0 cm³', r'1131,0 cm³', r'188,5 cm³', r'125,7 cm³'],
    [r'$V = \dfrac{1}{3} \pi \cdot 36 \cdot 10 = 120\pi \approx 377{,}0$ cm³'])

Q.q(r'Ein Zylinder hat den Durchmesser 8 cm und die Höhe 15 cm. Wie groß ist sein Volumen (gerundet)?',
    [r'754,0 cm³', r'3015,9 cm³', r'376,8 cm³', r'188,5 cm³'],
    [r'Radius 4 cm: $V = \pi \cdot 16 \cdot 15 = 240\pi \approx 754{,}0$ cm³', r'Mit dem Durchmesser statt dem Radius käme das Vierfache heraus.'])

Q.q(r'Eine Kugel hat den Durchmesser 10 cm. Wie groß ist ihre Oberfläche (gerundet)?',
    [r'314,2 cm²', r'1256,6 cm²', r'523,6 cm²', r'78,5 cm²'],
    [r'$O = 4\pi r^2 = 4\pi \cdot 25 = 100\pi \approx 314{,}2$ cm²'])

Q.q(r'Wo liegt der Scheitelpunkt der Parabel $y = (x - 2)^2 + 1$?',
    [r'$(2 \mid 1)$', r'$(-2 \mid 1)$', r'$(2 \mid -1)$', r'$(1 \mid 2)$'],
    [r'Scheitelpunktform $y = (x - d)^2 + e$ mit Scheitel $(d \mid e)$.', r'Hier $d = 2$, $e = 1$.'])

Q.q(r'Welche Nullstellen hat $y = x^2 - 4x + 3$?',
    [r'$x = 1$ und $x = 3$', r'$x = -1$ und $x = -3$', r'$x = 4$ und $x = 3$', r'keine'],
    [r'$x^2 - 4x + 3 = (x - 1)(x - 3)$', r'Oder mit der Lösungsformel: $x = 2 \pm \sqrt{4 - 3} = 2 \pm 1$.'])

Q.q(r'Wo liegt der Scheitelpunkt von $y = x^2 - 4x + 3$?',
    [r'$(2 \mid -1)$', r'$(2 \mid 3)$', r'$(-2 \mid -1)$', r'$(4 \mid 3)$'],
    [r'Quadratisch ergänzen: $x^2 - 4x + 4 - 4 + 3 = (x - 2)^2 - 1$.', r'Kontrolle: der Scheitel liegt mittig zwischen den Nullstellen 1 und 3.'])

Q.q(r'1500 € werden 3 Jahre lang zu 4 % mit Zinseszins angelegt. Wie hoch ist das Guthaben danach (gerundet)?',
    [r'1687,30 €', r'1680,00 €', r'1560,00 €', r'1754,79 €'],
    [r'$1500 \cdot 1{,}04^3 = 1500 \cdot 1{,}124864 \approx 1687{,}30$ €'])

Q.q(r'Welche Periode hat $y = 2 \sin(3x)$?',
    [r'$\dfrac{2\pi}{3}$', r'$\pi$', r'$6\pi$', r'$\dfrac{3\pi}{2}$'],
    [r'Periode $= \dfrac{2\pi}{b} = \dfrac{2\pi}{3}$'])

Q.q(r'Eine Gerade hat den Anstieg 3 und geht durch $(1 \mid 2)$. Wie lautet ihre Gleichung?',
    [r'$y = 3x - 1$', r'$y = 3x + 2$', r'$y = 3x + 1$', r'$y = 2x + 3$'],
    [r'$y = 3x + n$ mit $2 = 3 \cdot 1 + n$', r'$n = -1$'])

Q.q(r'Welche Gerade ist parallel zu $y = 2x + 1$?',
    [r'$y = 2x - 5$', r'$y = -2x + 1$', r'$y = 0{,}5x + 1$', r'$y = x + 2$'],
    [r'Parallele Geraden haben denselben Anstieg: $m = 2$.'])

Q.q(r'In welchem Punkt schneiden sich $y = 2x + 1$ und $y = -x + 7$?',
    [r'$(2 \mid 5)$', r'$(5 \mid 2)$', r'$(3 \mid 4)$', r'$(-2 \mid -3)$'],
    [r'$2x + 1 = -x + 7$, also $3x = 6$ und $x = 2$.', r'$y = 2 \cdot 2 + 1 = 5$'])

Q.q(r'Eine Gerade hat den Anstieg 1. Welchen Winkel bildet sie mit der x-Achse?',
    [r'$45^\circ$', r'$1^\circ$', r'$90^\circ$', r'$60^\circ$'],
    [r'$\tan \alpha = m = 1$', r'$\alpha = 45^\circ$'])

Q.q(r'Ein Quader ist 3 cm, 4 cm und 12 cm lang. Wie lang ist seine Raumdiagonale?',
    [r'13 cm', r'19 cm', r'5 cm', r'12,4 cm'],
    [r'Zuerst die Diagonale der Grundfläche: $\sqrt{9 + 16} = 5$ cm.', r'Dann $\sqrt{5^2 + 12^2} = \sqrt{169} = 13$ cm.'])

Q.q(r'Ein Modellauto ist im Maßstab 1 : 18 gebaut. Das echte Auto ist 4,5 m lang. Wie lang ist das Modell?',
    [r'25 cm', r'2,5 cm', r'81 cm', r'45 cm'],
    [r'$450$ cm $: 18 = 25$ cm'])

Q.q(r'Ein Kreisausschnitt hat den Radius 6 cm und den Mittelpunktswinkel $60^\circ$. Wie groß ist sein Flächeninhalt (gerundet)?',
    [r'18,8 cm²', r'113,1 cm²', r'6,3 cm²', r'37,7 cm²'],
    [r'Ein Sechstel des Kreises: $\dfrac{60}{360} \cdot \pi \cdot 36 = 6\pi \approx 18{,}8$ cm²'])

Q.q(r'Wie lang ist der Bogen dieses Kreisausschnitts ($r = 6$ cm, $60^\circ$, gerundet)?',
    [r'6,3 cm', r'37,7 cm', r'18,8 cm', r'3,1 cm'],
    [r'$\dfrac{60}{360} \cdot 2\pi \cdot 6 = 2\pi \approx 6{,}3$ cm'])


def check():
    from math import sin, pi, sqrt, atan, radians as r, degrees as d
    R = lambda x, n=1: round(x, n)
    assert 12 * 1.5 / 2 == 9 and R(7 / sin(r(40))) == 10.9 and R(sqrt(64 + 36 - 48)) == 7.2
    assert R(120 * pi) == 377.0 and R(240 * pi) == 754.0 and R(960 * pi) == 3015.9 and R(100 * pi) == 314.2
    assert all(x * x - 4 * x + 3 == 0 for x in (1, 3)) and all(x * x - 4 * x + 3 == (x - 2) ** 2 - 1 for x in range(-3, 4))
    assert R(1500 * 1.04 ** 3, 2) == 1687.30 and 2 - 3 * 1 == -1 and 2 * 2 + 1 == 5 == -2 + 7
    assert R(d(atan(1))) == 45 and sqrt(sqrt(9 + 16) ** 2 + 144) == 13 and 450 / 18 == 25
    assert R(6 * pi) == 18.8 and R(2 * pi) == 6.3


Q.verify(check)
Q.save()
