#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 3 / KW 36 (LB 1): Trigonometrie im rechtwinkligen
Dreieck, auch als Teildreieck in Figuren. Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=3, slug='trigonometrie-figuren', thema='Trigonometrie in Figuren', lb='LB 1',
         blurb='Sinus, Kosinus und Tangens im rechtwinkligen Dreieck, Höhen in Figuren, Steigungswinkel',
         comment='Blocks: definitions (1-3), sides and angles (4-7), figures split by a height (8-15), standard values and context (16-20). Results rounded to one decimal.')

# ----------------------------------------------------------- Definitionen ----
Q.q(r'In einem rechtwinkligen Dreieck gilt für den Winkel $\alpha$:',
    [r'$\sin \alpha = \dfrac{\text{Gegenkathete}}{\text{Hypotenuse}}$', r'$\sin \alpha = \dfrac{\text{Ankathete}}{\text{Hypotenuse}}$',
     r'$\sin \alpha = \dfrac{\text{Gegenkathete}}{\text{Ankathete}}$', r'$\sin \alpha = \dfrac{\text{Hypotenuse}}{\text{Gegenkathete}}$'],
    [r'Die Gegenkathete liegt dem Winkel gegenüber, die Hypotenuse dem rechten Winkel.',
     r'Merksatz: Sinus = Gegenkathete durch Hypotenuse.'])

Q.q(r'Welches Seitenverhältnis gehört zu $\cos \alpha$?',
    [r'Ankathete durch Hypotenuse', r'Gegenkathete durch Hypotenuse', r'Gegenkathete durch Ankathete', r'Ankathete durch Gegenkathete'],
    [r'Die Ankathete liegt am Winkel an (und ist nicht die Hypotenuse).',
     r'$\cos \alpha = \dfrac{\text{Ankathete}}{\text{Hypotenuse}}$'])

Q.q(r'Welches Seitenverhältnis gehört zu $\tan \alpha$?',
    [r'Gegenkathete durch Ankathete', r'Ankathete durch Gegenkathete', r'Gegenkathete durch Hypotenuse', r'Hypotenuse durch Ankathete'],
    [r'Der Tangens vergleicht die beiden Katheten.',
     r'$\tan \alpha = \dfrac{\text{Gegenkathete}}{\text{Ankathete}}$'])

# ------------------------------------------------------ Seiten und Winkel ----
Q.q(r'Im rechtwinkligen Dreieck ist die Hypotenuse $c = 10$ cm und $\alpha = 30^\circ$. Wie lang ist die Gegenkathete $a$ von $\alpha$?',
    [r'5 cm', r'8,7 cm', r'10 cm', r'20 cm'],
    [r'$\sin \alpha = \dfrac{a}{c}$, also $a = c \cdot \sin \alpha$.',
     r'$a = 10 \cdot \sin 30^\circ = 10 \cdot 0{,}5 = 5$, also 5 cm.'])

Q.q(r'Im rechtwinkligen Dreieck ist die Hypotenuse $c = 10$ cm und $\alpha = 60^\circ$. Wie lang ist die Ankathete $b$ von $\alpha$?',
    [r'5 cm', r'8,7 cm', r'17,3 cm', r'20 cm'],
    [r'$\cos \alpha = \dfrac{b}{c}$, also $b = c \cdot \cos \alpha$.',
     r'$b = 10 \cdot \cos 60^\circ = 10 \cdot 0{,}5 = 5$, also 5 cm.'])

Q.q(r'Im rechtwinkligen Dreieck ist die Ankathete von $\alpha = 35^\circ$ genau 12 m lang. Wie lang ist die Gegenkathete (gerundet)?',
    [r'8,4 m', r'6,9 m', r'9,8 m', r'17,1 m'],
    [r'Beide Katheten: also der Tangens.',
     r'$\tan 35^\circ = \dfrac{a}{12}$, also $a = 12 \cdot \tan 35^\circ \approx 12 \cdot 0{,}700 \approx 8{,}4$ m.'])

Q.q(r'Im rechtwinkligen Dreieck ist die Gegenkathete von $\alpha$ 3 cm und die Hypotenuse 6 cm lang. Wie groß ist $\alpha$?',
    [r'$30^\circ$', r'$60^\circ$', r'$45^\circ$', r'$26{,}6^\circ$'],
    [r'$\sin \alpha = \dfrac{3}{6} = 0{,}5$',
     r'Mit der Taste $\sin^{-1}$: $\alpha = 30^\circ$.'])

# ----------------------------------------------- Figuren mit Hilfslinien ----
Q.q(r'Ein gleichschenkliges Dreieck hat die Basis 10 cm und zwei Schenkel von je 13 cm. Wie hoch ist es?',
    [r'12 cm', r'8 cm', r'13 cm', r'14,1 cm'],
    [r'Die Höhe auf die Basis halbiert die Basis: rechtwinkliges Teildreieck mit 5 cm und 13 cm.',
     r'$h = \sqrt{13^2 - 5^2} = \sqrt{144} = 12$, also 12 cm.'])

Q.q(r'Wie groß ist ein Basiswinkel des gleichschenkligen Dreiecks mit Basis 10 cm und Schenkeln von 13 cm (gerundet)?',
    [r'$67{,}4^\circ$', r'$22{,}6^\circ$', r'$50{,}3^\circ$', r'$112{,}6^\circ$'],
    [r'Im Teildreieck liegt die halbe Basis (5 cm) am Basiswinkel an, der Schenkel ist die Hypotenuse.',
     r'$\cos \beta = \dfrac{5}{13}$, also $\beta \approx 67{,}4^\circ$.'])

Q.q(r'Eine Rampe hat eine Steigung von 6 %. Wie groß ist ihr Steigungswinkel (gerundet)?',
    [r'$3{,}4^\circ$', r'$6^\circ$', r'$0{,}06^\circ$', r'$31^\circ$'],
    [r'6 % Steigung heißt: 6 m Höhe auf 100 m waagerechte Strecke, also $\tan \alpha = 0{,}06$.',
     r'$\alpha = \tan^{-1}(0{,}06) \approx 3{,}4^\circ$'])

Q.q(r'Ein symmetrisches Satteldach ist 8 m breit, die Dachneigung beträgt $40^\circ$. Wie hoch ist der Giebel über dem Dachboden (gerundet)?',
    [r'3,4 m', r'2,6 m', r'3,1 m', r'4,8 m'],
    [r'Die Giebelhöhe teilt das Dach in zwei rechtwinklige Dreiecke mit der halben Breite 4 m als Ankathete.',
     r'$h = 4 \cdot \tan 40^\circ \approx 4 \cdot 0{,}839 \approx 3{,}4$ m'])

Q.q(r'Eine 5 m lange Leiter lehnt an einer Wand und bildet mit dem Boden einen Winkel von $70^\circ$. In welcher Höhe berührt sie die Wand (gerundet)?',
    [r'4,7 m', r'1,7 m', r'13,7 m', r'5,3 m'],
    [r'Die Leiter ist die Hypotenuse, die Höhe an der Wand ist die Gegenkathete des Winkels am Boden.',
     r'$h = 5 \cdot \sin 70^\circ \approx 5 \cdot 0{,}940 \approx 4{,}7$ m'])

Q.q(r'Ein gleichschenkliges Trapez hat die parallelen Seiten 14 cm und 8 cm, die Schenkel sind je 5 cm lang. Wie hoch ist das Trapez?',
    [r'4 cm', r'3 cm', r'5 cm', r'6 cm'],
    [r'Auf jeder Seite steht die lange Grundseite um $\dfrac{14 - 8}{2} = 3$ cm über.',
     r'Rechtwinkliges Teildreieck mit 3 cm und dem Schenkel 5 cm als Hypotenuse: $h = \sqrt{5^2 - 3^2} = 4$ cm.'])

Q.q(r'Wie groß sind die Winkel an der langen Grundseite dieses Trapezes (14 cm, 8 cm, Schenkel 5 cm), gerundet?',
    [r'$53{,}1^\circ$', r'$36{,}9^\circ$', r'$59{,}0^\circ$', r'$126{,}9^\circ$'],
    [r'Im Teildreieck liegt der Überstand 3 cm am Winkel an, der Schenkel 5 cm ist die Hypotenuse.',
     r'$\cos \alpha = \dfrac{3}{5} = 0{,}6$, also $\alpha \approx 53{,}1^\circ$.'])

Q.q(r'Eine Raute hat die Seitenlänge 6 cm und einen Innenwinkel von $60^\circ$. Wie lang ist die kürzere Diagonale?',
    [r'6 cm', r'3 cm', r'10,4 cm', r'12 cm'],
    [r'Die kürzere Diagonale zerlegt die Raute in zwei gleichschenklige Dreiecke mit $60^\circ$ an der Spitze.',
     r'Deren Basiswinkel sind dann auch $60^\circ$: die Dreiecke sind gleichseitig, die Diagonale ist 6 cm lang.'])

# ---------------------------------------------- besondere Werte, Sachbezug ----
Q.q(r'Ein Weg ist am Hang entlang gemessen 120 m lang und überwindet dabei 9 m Höhe. Wie groß ist der Neigungswinkel (gerundet)?',
    [r'$4{,}3^\circ$', r'$85{,}7^\circ$', r'$7{,}5^\circ$', r'$0{,}1^\circ$'],
    [r'Der Weg ist die Hypotenuse, die Höhe die Gegenkathete.',
     r'$\sin \alpha = \dfrac{9}{120} = 0{,}075$, also $\alpha \approx 4{,}3^\circ$.'])

Q.q(r'Für welchen Winkel sind in einem rechtwinkligen Dreieck Gegenkathete und Ankathete gleich lang?',
    [r'$45^\circ$', r'$30^\circ$', r'$60^\circ$', r'$90^\circ$'],
    [r'Gleich lange Katheten bedeuten $\tan \alpha = 1$.',
     r'Das Dreieck ist dann gleichschenklig-rechtwinklig, beide spitzen Winkel sind $45^\circ$.'])

Q.q(r'Welchen Wert hat $\sin 30^\circ$?',
    [r'0,5', r'0,866', r'0,577', r'30'],
    [r'Ein gleichseitiges Dreieck mit Seite 2 wird durch eine Höhe in zwei Hälften geteilt.',
     r'In jeder Hälfte liegt dem $30^\circ$-Winkel die Strecke 1 gegenüber, die Hypotenuse ist 2: $\sin 30^\circ = \dfrac{1}{2}$.'])

Q.q(r'Ein Rechteck ist 8 cm lang und 6 cm breit. Welchen Winkel bildet die Diagonale mit der langen Seite (gerundet)?',
    [r'$36{,}9^\circ$', r'$53{,}1^\circ$', r'$48{,}6^\circ$', r'$41{,}4^\circ$'],
    [r'Im rechtwinkligen Teildreieck liegt die lange Seite am Winkel an, die kurze gegenüber.',
     r'$\tan \alpha = \dfrac{6}{8} = 0{,}75$, also $\alpha \approx 36{,}9^\circ$.'])

Q.q(r'Aus 50 m Entfernung sieht man die Turmspitze unter einem Höhenwinkel von $32^\circ$. Die Augen sind 1,6 m über dem Boden. Wie hoch ist der Turm (gerundet)?',
    [r'32,8 m', r'31,2 m', r'28,1 m', r'44,0 m'],
    [r'Vom Auge aus: Ankathete 50 m, gesucht ist die Gegenkathete.',
     r'$50 \cdot \tan 32^\circ \approx 31{,}2$ m über Augenhöhe.',
     r'Turmhöhe: $31{,}2 + 1{,}6 = 32{,}8$ m.'])


def check():
    from math import sin, cos, tan, asin, acos, atan, radians as r, degrees as d, sqrt
    R = lambda x, n=1: round(x, n)
    assert R(10 * sin(r(30))) == 5 and R(10 * cos(r(30))) == 8.7
    assert R(10 * cos(r(60))) == 5 and R(10 * tan(r(60))) == 17.3
    assert R(12 * tan(r(35))) == 8.4 and R(12 * sin(r(35))) == 6.9 and R(12 * cos(r(35))) == 9.8 and R(12 / tan(r(35))) == 17.1
    assert R(d(asin(3 / 6))) == 30 and R(d(atan(3 / 6))) == 26.6
    assert sqrt(13 ** 2 - 5 ** 2) == 12 and R(sqrt(10 ** 2 + 10 ** 2), 1) == 14.1
    assert R(d(acos(5 / 13))) == 67.4 and R(d(asin(5 / 13))) == 22.6 and R(180 - d(acos(5 / 13))) == 112.6
    assert R(d(atan(0.06))) == 3.4
    assert R(4 * tan(r(40))) == 3.4 and R(4 * sin(r(40))) == 2.6 and R(4 * cos(r(40))) == 3.1 and R(4 / tan(r(40))) == 4.8
    assert R(5 * sin(r(70))) == 4.7 and R(5 * cos(r(70))) == 1.7 and R(5 * tan(r(70))) == 13.7 and R(5 / sin(r(70))) == 5.3
    assert (14 - 8) / 2 == 3 and sqrt(5 ** 2 - 3 ** 2) == 4
    assert R(d(acos(3 / 5))) == 53.1 and R(d(asin(3 / 5))) == 36.9 and R(d(atan(5 / 3))) == 59.0 and R(180 - d(acos(3 / 5))) == 126.9
    assert R(2 * 6 * cos(r(30))) == 10.4   # the longer diagonal (distractor)
    assert R(d(asin(9 / 120))) == 4.3 and R(d(acos(9 / 120))) == 85.7
    assert R(d(atan(1))) == 45
    assert R(sin(r(30)), 3) == 0.5 and R(cos(r(30)), 3) == 0.866 and R(tan(r(30)), 3) == 0.577
    assert R(d(atan(6 / 8))) == 36.9 and R(d(atan(8 / 6))) == 53.1 and R(d(asin(6 / 8))) == 48.6 and R(d(acos(6 / 8))) == 41.4
    assert R(50 * tan(r(32)) + 1.6) == 32.8 and R(50 * tan(r(32))) == 31.2
    assert R(50 * sin(r(32)) + 1.6) == 28.1 and R(50 * cos(r(32)) + 1.6) == 44.0


Q.verify(check)
Q.save()
