#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 8 / KW 41 (LB 1): Zerlegen in Teilprobleme -
gleichschenklige Dreiecke, Trapeze, Fachwerk, Raumdiagonale. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=8, slug='teilprobleme', thema='Zerlegen in Teilprobleme', lb='LB 1',
        blurb='Gleichschenklige Dreiecke, Trapez, Parallelogramm, Fachwerk, Raumdiagonale, Gelände',
        comment='Calculator in DEG, values rounded. Blocks: isosceles triangle and trapezoid (1-4), space diagonal (5-6, 17-19), truss and roof (7-8, 15), polygons and parallelograms (9-11), terrain (12, 16), strategy (13-14, 20).')

# --------------------------------------------- gleichschenklig, Trapez ----
Q.q(r'Ein gleichschenkliges Dreieck hat die Basis 8 cm und Basiswinkel von $65^\circ$. Wie hoch ist es (gerundet)?',
    [r'8,58 cm', r'3,63 cm', r'9,46 cm', r'17,16 cm'],
    [r'Die Höhe halbiert die Basis: Ankathete 4 cm.',
     r'$h = 4 \cdot \tan 65^\circ \approx 8{,}58$ cm'])

Q.q(r'Wie lang sind die Schenkel dieses Dreiecks (halbe Basis 4 cm, Basiswinkel $65^\circ$, gerundet)?',
    [r'9,46 cm', r'4,41 cm', r'8,58 cm', r'3,63 cm'],
    [r'$\cos 65^\circ = \dfrac{4}{s}$',
     r'$s = \dfrac{4}{\cos 65^\circ} \approx 9{,}46$ cm'])

Q.q(r'Ein gleichschenkliges Trapez hat die Grundseiten $a = 12$ cm und $c = 6$ cm und die Höhe 4 cm. Wie lang sind die Schenkel?',
    [r'5 cm', r'7,2 cm', r'4,47 cm', r'6 cm'],
    [r'Überstand auf jeder Seite: $(12 - 6) : 2 = 3$ cm.',
     r'Schenkel: $\sqrt{3^2 + 4^2} = 5$ cm'])

Q.q(r'Wie groß sind die Winkel an der langen Grundseite dieses Trapezes (Überstand 3 cm, Höhe 4 cm, gerundet)?',
    [r'$53{,}13^\circ$', r'$36{,}87^\circ$', r'$45^\circ$', r'$71{,}57^\circ$'],
    [r'$\tan \alpha = \dfrac{4}{3}$',
     r'$\alpha \approx 53{,}13^\circ$'])

# -------------------------------------------------------- Raumdiagonale ----
Q.q(r'Ein Quader ist 3 cm, 4 cm und 12 cm lang. Wie lang ist seine Raumdiagonale?',
    [r'13 cm', r'19 cm', r'12,6 cm', r'5 cm'],
    [r'Erst die Diagonale der Grundfläche: $\sqrt{9 + 16} = 5$ cm.',
     r'Dann mit der Höhe: $\sqrt{25 + 144} = 13$ cm.'])

Q.q(r'Ein Würfel hat die Kantenlänge 5 cm. Wie lang ist seine Raumdiagonale (gerundet)?',
    [r'8,66 cm', r'7,07 cm', r'15 cm', r'10 cm'],
    [r'$d = \sqrt{25 + 25 + 25} = \sqrt{75}$',
     r'$d = 5\sqrt{3} \approx 8{,}66$ cm'])

# ----------------------------------------------------------------- Fachwerk ----
Q.q(r'Ein Dachbinder hat 8 m Spannweite und $30^\circ$ Dachneigung (symmetrisch). Wie lang ist ein Sparren (gerundet)?',
    [r'4,62 m', r'4,00 m', r'2,31 m', r'9,24 m'],
    [r'Halbe Spannweite: 4 m, sie ist die Ankathete.',
     r'$s = \dfrac{4}{\cos 30^\circ} \approx 4{,}62$ m'])

Q.q(r'Wie hoch ist dieser Dachbinder in der Mitte (gerundet)?',
    [r'2,31 m', r'4,62 m', r'2,00 m', r'6,93 m'],
    [r'$h = 4 \cdot \tan 30^\circ \approx 2{,}31$ m'])

# ------------------------------------------------------- Vielecke ----
Q.q(r'Ein regelmäßiges Sechseck hat die Seitenlänge 4 cm. Wie weit sind zwei gegenüberliegende Seiten voneinander entfernt (gerundet)?',
    [r'6,93 cm', r'8 cm', r'3,46 cm', r'12 cm'],
    [r'Das Sechseck besteht aus 6 gleichseitigen Dreiecken mit Seite 4 cm.',
     r'Abstand = zwei Dreieckshöhen: $2 \cdot 4 \cdot \sin 60^\circ \approx 6{,}93$ cm'])

Q.q(r'Ein Parallelogramm hat die Seiten 8 cm und 5 cm, der Winkel zwischen ihnen ist $60^\circ$. Wie groß ist sein Flächeninhalt (gerundet)?',
    [r'34,64 cm²', r'40 cm²', r'20 cm²', r'4,33 cm²'],
    [r'Höhe auf die 8-cm-Seite: $h = 5 \cdot \sin 60^\circ \approx 4{,}33$ cm',
     r'$A = 8 \cdot 4{,}33 \approx 34{,}64$ cm²'])

Q.q(r'Ein Dreieck hat $c = 10$ cm, $b = 7$ cm und $\alpha = 40^\circ$ (zwischen $b$ und $c$). Wie groß ist sein Flächeninhalt (gerundet)?',
    [r'22,50 cm²', r'35 cm²', r'26,81 cm²', r'45,00 cm²'],
    [r'Die Höhe $h_c$ zerlegt das Dreieck: $h_c = 7 \cdot \sin 40^\circ \approx 4{,}50$ cm.',
     r'$A = \dfrac{10 \cdot 4{,}50}{2} \approx 22{,}50$ cm²'])

# ----------------------------------------------------------------- Gelände ----
Q.q(r'Von einem 40 m hohen Leuchtturm sieht man ein Schiff unter einem Tiefenwinkel von $8^\circ$. Wie weit ist das Schiff entfernt (gerundet)?',
    [r'284,6 m', r'5,6 m', r'287,4 m', r'40,4 m'],
    [r'Der Tiefenwinkel ist gleich dem Winkel am Schiff (Wechselwinkel).',
     r'$\tan 8^\circ = \dfrac{40}{x}$, $x = \dfrac{40}{\tan 8^\circ} \approx 284{,}6$ m'])

Q.q(r'Was hilft, wenn eine Figur kein rechtwinkliges Dreieck enthält?',
    [r'eine Höhe einzeichnen, die rechtwinklige Teildreiecke erzeugt', r'den Satz des Pythagoras trotzdem anwenden',
     r'alle Winkel addieren', r'die Figur verdoppeln'],
    [r'Höhen stehen senkrecht: So entstehen rechtwinklige Teildreiecke.',
     r'Darin gelten Pythagoras, Sinus, Kosinus und Tangens.'])

Q.q(r'Welche Reihenfolge ist für die Raumdiagonale eines Quaders sinnvoll?',
    [r'erst die Flächendiagonale der Grundfläche, dann mit der Höhe die Raumdiagonale', r'erst die Höhe halbieren, dann verdoppeln',
     r'alle drei Kanten addieren', r'Länge mal Breite mal Höhe, dann die Wurzel'],
    [r'Flächendiagonale und Höhe stehen senkrecht aufeinander.',
     r'Zweimal Pythagoras: $d = \sqrt{a^2 + b^2 + c^2}$'])

Q.q(r'Ein Satteldach hat zwei Dachflächen, jede 12 m lang mit Sparren von 6,10 m. Wie groß ist die gesamte Dachfläche (gerundet)?',
    [r'146,4 m²', r'73,2 m²', r'36,6 m²', r'292,8 m²'],
    [r'Eine Dachfläche: $12 \cdot 6{,}10 = 73{,}2$ m²',
     r'Zwei Flächen: $146{,}4$ m²'])

Q.q(r'Auf einer Wanderkarte sind zwei Orte 2,4 km waagerecht entfernt, der Höhenunterschied ist 600 m. Wie lang ist der gerade Weg dazwischen (gerundet)?',
    [r'2,47 km', r'3,00 km', r'2,40 km', r'2,33 km'],
    [r'Alles in Metern: $\sqrt{2400^2 + 600^2} = \sqrt{6\,120\,000} \approx 2474$ m',
     r'Also etwa 2,47 km; die mittlere Steigung beträgt $600 : 2400 = 25$ %.'])

Q.q(r'Ein Zimmer ist 5 m lang, 4 m breit und 2,5 m hoch. Wie lang ist die Raumdiagonale (gerundet)?',
    [r'6,87 m', r'6,40 m', r'11,5 m', r'7,50 m'],
    [r'$d = \sqrt{25 + 16 + 6{,}25} = \sqrt{47{,}25}$',
     r'$d \approx 6{,}87$ m'])

Q.q(r'Passt ein 1,30 m langer Stab in einen Koffer mit den Innenmaßen 1 m × 0,6 m × 0,5 m?',
    [r'Nein, die Raumdiagonale ist nur etwa 1,27 m lang.', r'Ja, die Raumdiagonale ist etwa 2,1 m lang.',
     r'Ja, die Flächendiagonale ist etwa 1,17 m lang.', r'Nein, der Koffer ist nur 1 m lang.'],
    [r'Die längste Strecke im Koffer ist die Raumdiagonale.',
     r'$\sqrt{1 + 0{,}36 + 0{,}25} = \sqrt{1{,}61} \approx 1{,}27$ m, das ist zu kurz.'])

Q.q(r'Unter welchem Winkel ist die Raumdiagonale eines Würfels gegen die Grundfläche geneigt (gerundet)?',
    [r'$35{,}26^\circ$', r'$45^\circ$', r'$54{,}74^\circ$', r'$30^\circ$'],
    [r'Gegenkathete: Kante $a$, Ankathete: Flächendiagonale $a\sqrt{2}$.',
     r'$\tan \alpha = \dfrac{1}{\sqrt{2}}$, $\alpha \approx 35{,}26^\circ$'])

Q.q(r'Ein Grundstück hat die Form eines rechtwinkligen Trapezes: parallele Seiten 30 m und 18 m, die senkrechte Seite 16 m. Wie lang ist die vierte Seite?',
    [r'20 m', r'12 m', r'24 m', r'34 m'],
    [r'Zerlegen: Rechteck 18 m × 16 m und rechtwinkliges Dreieck mit den Katheten $30 - 18 = 12$ m und 16 m.',
     r'$\sqrt{144 + 256} = \sqrt{400} = 20$ m'])


def check():
    from math import sin, cos, tan, atan, degrees as d, radians as r, sqrt
    R = lambda v, n=2: round(v, n)
    assert R(4 * tan(r(65))) == 8.58 and R(4 / cos(r(65))) == 9.46
    assert sqrt(9 + 16) == 5 and R(d(atan(4 / 3))) == 53.13
    assert sqrt(25 + 144) == 13 and R(sqrt(75)) == 8.66
    assert R(4 / cos(r(30))) == 4.62 and R(4 * tan(r(30))) == 2.31
    assert R(2 * 4 * sin(r(60))) == 6.93 and R(8 * 5 * sin(r(60))) == 34.64
    assert R(10 * 7 * sin(r(40)) / 2) == 22.50
    assert R(40 / tan(r(8)), 1) == 284.6
    assert R(2 * 12 * 6.10, 1) == 146.4
    assert R(sqrt(2400 ** 2 + 600 ** 2) / 1000) == 2.47 and 600 / 2400 == 0.25
    assert R(sqrt(47.25)) == 6.87 and R(sqrt(1.61)) == 1.27 and sqrt(1.61) < 1.3
    assert R(d(atan(1 / sqrt(2)))) == 35.26
    assert sqrt(12 ** 2 + 16 ** 2) == 20


Q.verify(check)
Q.save()
