#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 4 / KW 37 (LB 1): Umkehrung des Satzes des
Pythagoras, pythagoreische Zahlentripel, rechte Winkel prüfen. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=4, slug='umkehrung-pythagoras', thema='Umkehrung des Satzes des Pythagoras', lb='LB 1',
        blurb='Rechtwinklig oder nicht, Zahlentripel, Knotenschnur, rechte Winkel am Bau prüfen',
        comment='Blocks: statement and logic (1, 7, 15, 18), checking triangles (2-5, 11-12, 14, 16), acute and obtuse (9-11), knot rope and building (6, 13, 19), triples and coordinates (8, 17, 20).')

# --------------------------------------------------------- Satz ----
Q.q(r'Wie lautet die Umkehrung des Satzes des Pythagoras?',
    [r'Wenn in einem Dreieck $a^2 + b^2 = c^2$ gilt, dann ist es rechtwinklig mit dem rechten Winkel bei $C$.',
     r'Wenn ein Dreieck rechtwinklig ist, dann gilt $a^2 + b^2 = c^2$.',
     r'Wenn $a + b = c$ ist, dann ist das Dreieck rechtwinklig.',
     r'Wenn ein Dreieck gleichseitig ist, dann gilt $a^2 + b^2 = c^2$.'],
    [r'Beim Satz folgt aus „rechtwinklig“ die Gleichung.',
     r'Bei der Umkehrung folgt aus der Gleichung „rechtwinklig“.'])

Q.q(r'Ist ein Dreieck mit den Seiten 6 cm, 8 cm und 10 cm rechtwinklig?',
    [r'Ja, denn $36 + 64 = 100$.', r'Nein, denn $6 + 8 \neq 10$.', r'Nein, denn 10 ist gerade.', r'Das kann man nur durch Messen feststellen.'],
    [r'Die längste Seite ist 10 cm.',
     r'$6^2 + 8^2 = 100 = 10^2$, also rechtwinklig.'])

Q.q(r'Ist ein Dreieck mit den Seiten 5 cm, 7 cm und 9 cm rechtwinklig?',
    [r'Nein, denn $25 + 49 = 74 \neq 81$.', r'Ja, denn $5 + 7 > 9$.', r'Ja, alle Seiten sind ungerade.', r'Nein, denn $5 \cdot 7 \neq 9$.'],
    [r'$5^2 + 7^2 = 74$, aber $9^2 = 81$.',
     r'Die Gleichung gilt nicht, das Dreieck ist nicht rechtwinklig.'])

Q.q(r'Welches Dreieck ist rechtwinklig?',
    [r'8 cm, 15 cm, 17 cm', r'4 cm, 5 cm, 6 cm', r'6 cm, 7 cm, 9 cm', r'5 cm, 6 cm, 8 cm'],
    [r'$64 + 225 = 289 = 17^2$',
     r'Bei den anderen: $16 + 25 \neq 36$, $36 + 49 \neq 81$, $25 + 36 \neq 64$.'])

Q.q(r'Welches Zahlentripel ist kein pythagoreisches Tripel?',
    [r'4, 5, 6', r'3, 4, 5', r'7, 24, 25', r'9, 12, 15'],
    [r'Prüfen: $16 + 25 = 41 \neq 36$.',
     r'$9 + 16 = 25$, $49 + 576 = 625$, $81 + 144 = 225$: die anderen sind Tripel.'])

Q.q(r'Eine Schnur hat 12 Knoten in gleichen Abständen und wird zu einem Dreieck mit 3, 4 und 5 Abständen gespannt. Welcher Winkel entsteht?',
    [r'ein rechter Winkel zwischen den Seiten mit 3 und 4 Abständen', r'ein rechter Winkel zwischen den Seiten mit 4 und 5 Abständen',
     r'drei gleiche Winkel von $60^\circ$', r'ein stumpfer Winkel'],
    [r'$3^2 + 4^2 = 5^2$, nach der Umkehrung ist das Dreieck rechtwinklig.',
     r'Der rechte Winkel liegt der längsten Seite gegenüber, also zwischen den kürzeren Seiten.'])

Q.q(r'Wo liegt der rechte Winkel, wenn $a^2 + b^2 = c^2$ gilt?',
    [r'gegenüber der längsten Seite $c$', r'gegenüber der kürzesten Seite', r'zwischen $b$ und $c$', r'Es gibt keinen rechten Winkel.'],
    [r'Die längste Seite ist die Hypotenuse.',
     r'Ihr gegenüber liegt der rechte Winkel, hier bei $C$.'])

Q.q(r'Das Tripel 3, 4, 5 wird mit 3 multipliziert. Was entsteht?',
    [r'9, 12, 15, wieder ein pythagoreisches Tripel', r'9, 12, 15, kein Tripel mehr', r'6, 7, 8', r'27, 64, 125'],
    [r'$81 + 144 = 225 = 15^2$',
     r'Ein vergrößertes rechtwinkliges Dreieck ist ähnlich und bleibt rechtwinklig.'])

Q.q(r'Auf einer Baustelle werden von einer Ecke aus 3 m und 4 m abgemessen. Die Diagonale zwischen den Marken ist 5,1 m lang. Was folgt?',
    [r'Der Winkel ist etwas größer als $90^\circ$.', r'Der Winkel ist genau $90^\circ$.',
     r'Der Winkel ist etwas kleiner als $90^\circ$.', r'Man kann nichts sagen.'],
    [r'Bei genau $90^\circ$ wäre die Diagonale 5 m.',
     r'$5{,}1^2 = 26{,}01 > 25$: Die Ecke ist zu weit geöffnet, also stumpf.'])

Q.q(r'In einem Dreieck mit längster Seite $c$ gilt $a^2 + b^2 > c^2$. Was für ein Dreieck ist es?',
    [r'spitzwinklig', r'rechtwinklig', r'stumpfwinklig', r'gleichseitig'],
    [r'Ist $c$ kürzer als bei einem rechten Winkel, so ist der Winkel bei $C$ kleiner als $90^\circ$.',
     r'Da $\gamma$ der größte Winkel ist, sind alle Winkel spitz.'])

Q.q(r'Welche Art Dreieck hat die Seiten 2 cm, 3 cm und 4 cm?',
    [r'stumpfwinklig', r'rechtwinklig', r'spitzwinklig', r'gleichschenklig'],
    [r'$4 + 9 = 13 < 16$',
     r'Die längste Seite ist zu lang für einen rechten Winkel, also ist $\gamma > 90^\circ$.'])

Q.q(r'Ist ein Dreieck mit den Seiten 1, $\sqrt{3}$ und 2 rechtwinklig?',
    [r'Ja, denn $1 + 3 = 4$.', r'Nein, $\sqrt{3}$ ist keine ganze Zahl.', r'Nein, denn $1 + \sqrt{3} \neq 2$.', r'Nur ungefähr.'],
    [r'$1^2 + \left(\sqrt{3}\right)^2 = 1 + 3 = 4 = 2^2$',
     r'Das ist das halbe gleichseitige Dreieck mit den Winkeln $30^\circ$, $60^\circ$, $90^\circ$.'])

Q.q(r'Ein Bilderrahmen ist 60 cm breit und 80 cm hoch. Wie lang muss die Diagonale sein, wenn alle Ecken rechte Winkel haben?',
    [r'100 cm', r'140 cm', r'70 cm', r'120 cm'],
    [r'$\sqrt{3600 + 6400} = \sqrt{10\,000} = 100$ cm',
     r'Weichen die beiden Diagonalen voneinander ab, ist der Rahmen schief.'])

Q.q(r'Welches Tripel ist ein pythagoreisches Tripel?',
    [r'20, 21, 29', r'10, 20, 30', r'5, 10, 12', r'6, 9, 11'],
    [r'$400 + 441 = 841 = 29^2$'])

Q.q(r'Womit prüft man, ob ein gegebenes Dreieck einen rechten Winkel hat?',
    [r'mit der Umkehrung des Satzes des Pythagoras', r'mit dem Satz des Pythagoras selbst',
     r'mit der Winkelsumme allein', r'mit dem Umfang'],
    [r'Der Satz setzt einen rechten Winkel voraus, er kann ihn nicht beweisen.',
     r'Die Umkehrung schließt von $a^2 + b^2 = c^2$ auf den rechten Winkel.'])

Q.q(r'Die Seiten 9 cm und 12 cm sollen einen rechten Winkel einschließen. Wie lang muss die dritte Seite sein?',
    [r'15 cm', r'21 cm', r'7,9 cm', r'225 cm'],
    [r'$c = \sqrt{81 + 144} = \sqrt{225} = 15$ cm'])

Q.q(r'Das Dreieck hat die Ecken $A(1 \mid 1)$, $B(4 \mid 5)$ und $C(8 \mid 2)$. Hat es einen rechten Winkel?',
    [r'Ja, bei $B$, denn $25 + 25 = 50$.', r'Ja, bei $A$.', r'Ja, bei $C$.', r'Nein.'],
    [r'$\overline{AB}^2 = 9 + 16 = 25$, $\overline{BC}^2 = 16 + 9 = 25$, $\overline{AC}^2 = 49 + 1 = 50$',
     r'$\overline{AB}^2 + \overline{BC}^2 = \overline{AC}^2$: rechter Winkel gegenüber von $\overline{AC}$, also bei $B$.'])

Q.q(r'Ist die Umkehrung eines wahren Satzes immer auch wahr?',
    [r'Nein. „Jedes Quadrat ist ein Rechteck“ ist wahr, die Umkehrung nicht.', r'Ja, immer.',
     r'Nein, Umkehrungen sind immer falsch.', r'Ja, aber nur in der Geometrie.'],
    [r'Satz und Umkehrung müssen einzeln bewiesen werden.',
     r'Beim Satz des Pythagoras sind zufällig beide wahr.'])

Q.q(r'Ein Sportplatz soll 30 m breit und 40 m lang werden. Wie lang muss jede Diagonale sein, damit die Ecken rechtwinklig sind?',
    [r'50 m', r'70 m', r'35 m', r'2500 m'],
    [r'$\sqrt{900 + 1600} = \sqrt{2500} = 50$ m'])

Q.q(r'Das Tripel 5, 12, 13 wird verdoppelt. Prüfe 10, 24, 26.',
    [r'Rechtwinklig, denn $100 + 576 = 676$.', r'Nicht rechtwinklig, denn $10 + 24 \neq 26$.',
     r'Rechtwinklig, denn $10 + 24 > 26$.', r'Nicht rechtwinklig, denn 26 ist keine Quadratzahl.'],
    [r'$10^2 + 24^2 = 100 + 576 = 676 = 26^2$'])


def check():
    from math import sqrt, dist, isclose
    py = lambda a, b, c: a * a + b * b == c * c
    assert py(6, 8, 10) and not py(5, 7, 9) and 25 + 49 == 74
    assert py(8, 15, 17) and not py(4, 5, 6) and not py(6, 7, 9) and not py(5, 6, 8)
    assert py(3, 4, 5) and py(7, 24, 25) and py(9, 12, 15)
    assert 5.1 ** 2 > 25
    assert 4 + 9 < 16 and isclose(1 + sqrt(3) ** 2, 4)
    assert sqrt(3600 + 6400) == 100 and py(20, 21, 29)
    assert not py(10, 20, 30) and not py(5, 10, 12) and not py(6, 9, 11)
    assert sqrt(81 + 144) == 15
    A, B, C = (1, 1), (4, 5), (8, 2)
    assert round(dist(A, B) ** 2) == 25 and round(dist(B, C) ** 2) == 25 and round(dist(A, C) ** 2) == 50
    assert sqrt(900 + 1600) == 50 and py(10, 24, 26)


Q.verify(check)
Q.save()
