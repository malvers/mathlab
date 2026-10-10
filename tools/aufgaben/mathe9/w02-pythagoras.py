#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 2 / KW 35 (LB 1): Satz des Pythagoras -
Hypotenuse und Katheten berechnen. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=2, slug='pythagoras', thema='Der Satz des Pythagoras', lb='LB 1',
        blurb='Hypotenuse und Katheten, Quadrate über den Seiten, Seitenlängen berechnen',
        comment='Blocks: terms and statement (1-2, 11-12, 16-17), hypotenuse (3-5, 8-9, 14, 18, 20), legs (6-7, 10, 13, 19), errors (15).')

# ---------------------------------------------------------- Begriffe, Satz ----
Q.q(r'Welche Seite eines rechtwinkligen Dreiecks heißt Hypotenuse?',
    [r'die Seite gegenüber dem rechten Winkel', r'die kürzeste Seite', r'jede Seite am rechten Winkel', r'die Seite, auf der das Dreieck steht'],
    [r'Die beiden Seiten am rechten Winkel heißen Katheten.',
     r'Die Hypotenuse liegt dem rechten Winkel gegenüber und ist die längste Seite.'])

Q.q(r'Wie lautet der Satz des Pythagoras für ein Dreieck mit rechtem Winkel bei $C$?',
    [r'$a^2 + b^2 = c^2$', r'$a + b = c$', r'$a^2 + c^2 = b^2$', r'$a \cdot b = c^2$'],
    [r'Bei $C$ liegt der rechte Winkel, also ist $c$ die Hypotenuse.',
     r'Die Quadrate über den Katheten ergeben zusammen das Quadrat über der Hypotenuse.'])

Q.q(r'Die Katheten sind 3 cm und 4 cm lang. Wie lang ist die Hypotenuse?',
    [r'5 cm', r'7 cm', r'25 cm', r'12 cm'],
    [r'$c^2 = 3^2 + 4^2 = 9 + 16 = 25$',
     r'$c = \sqrt{25} = 5$ cm'])

Q.q(r'Die Katheten sind 6 cm und 8 cm lang. Wie lang ist die Hypotenuse?',
    [r'10 cm', r'14 cm', r'100 cm', r'48 cm'],
    [r'$c^2 = 36 + 64 = 100$',
     r'$c = 10$ cm'])

Q.q(r'Die Katheten sind 5 cm und 12 cm lang. Wie lang ist die Hypotenuse?',
    [r'13 cm', r'17 cm', r'10,9 cm', r'169 cm'],
    [r'$c^2 = 25 + 144 = 169$',
     r'$c = 13$ cm'])

Q.q(r'Die Hypotenuse ist 10 cm, eine Kathete 6 cm lang. Wie lang ist die andere Kathete?',
    [r'8 cm', r'4 cm', r'11,7 cm', r'64 cm'],
    [r'Für eine Kathete wird subtrahiert: $b^2 = c^2 - a^2$',
     r'$b^2 = 100 - 36 = 64$, $b = 8$ cm',
     r'11,7 cm entsteht, wenn man fälschlich addiert.'])

Q.q(r'Die Hypotenuse ist 13 cm, eine Kathete 5 cm lang. Wie lang ist die andere Kathete?',
    [r'12 cm', r'8 cm', r'13,9 cm', r'144 cm'],
    [r'$a^2 = 169 - 25 = 144$',
     r'$a = 12$ cm'])

Q.q(r'Beide Katheten sind 1 m lang. Wie lang ist die Hypotenuse (gerundet)?',
    [r'1,41 m', r'2 m', r'1 m', r'1,73 m'],
    [r'$c^2 = 1 + 1 = 2$',
     r'$c = \sqrt{2} \approx 1{,}41$ m'])

Q.q(r'Die Katheten sind 4 cm und 7 cm lang. Wie lang ist die Hypotenuse (gerundet)?',
    [r'8,06 cm', r'11 cm', r'5,74 cm', r'65 cm'],
    [r'$c^2 = 16 + 49 = 65$',
     r'$c = \sqrt{65} \approx 8{,}06$ cm'])

Q.q(r'Die Hypotenuse ist 9 cm, eine Kathete 5 cm lang. Wie lang ist die andere Kathete (gerundet)?',
    [r'7,48 cm', r'4 cm', r'10,30 cm', r'56 cm'],
    [r'$b^2 = 81 - 25 = 56$',
     r'$b = \sqrt{56} \approx 7{,}48$ cm'])

Q.q(r'In einem Dreieck liegt der rechte Winkel bei $A$. Wie lautet der Satz des Pythagoras hier?',
    [r'$b^2 + c^2 = a^2$', r'$a^2 + b^2 = c^2$', r'$a^2 + c^2 = b^2$', r'$a + b + c = 180$'],
    [r'Die Hypotenuse liegt dem rechten Winkel gegenüber: hier $a$.',
     r'Die Katheten sind $b$ und $c$.'])

Q.q(r'Die Quadrate über den Katheten haben 9 cm² und 16 cm² Fläche. Welche Fläche hat das Quadrat über der Hypotenuse?',
    [r'25 cm²', r'7 cm²', r'144 cm²', r'5 cm²'],
    [r'Satz des Pythagoras als Flächenaussage: $9 + 16 = 25$ cm².',
     r'Die Hypotenuse selbst ist 5 cm lang.'])

Q.q(r'Eine 5 m lange Leiter steht 1,4 m von der Wand entfernt. Wie hoch reicht sie an der Wand?',
    [r'4,8 m', r'3,6 m', r'5,19 m', r'6,4 m'],
    [r'Die Leiter ist die Hypotenuse.',
     r'$h^2 = 25 - 1{,}96 = 23{,}04$',
     r'$h = 4{,}8$ m'])

Q.q(r'Ein Bildschirm ist 88,6 cm breit und 49,8 cm hoch. Wie lang ist seine Diagonale (gerundet)?',
    [r'101,6 cm', r'138,4 cm', r'73,3 cm', r'10 330 cm'],
    [r'$d^2 = 88{,}6^2 + 49{,}8^2 = 7849{,}96 + 2480{,}04 = 10\,330$',
     r'$d = \sqrt{10\,330} \approx 101{,}6$ cm, das sind etwa 40 Zoll.'])

Q.q(r'Tim rechnet für die Katheten 3 cm und 4 cm: $c = 3 + 4 = 7$ cm. Was ist richtig?',
    [r'$c = 5$ cm, denn man addiert die Quadrate.', r'$c = 7$ cm stimmt.', r'$c = 12$ cm', r'$c = 1$ cm'],
    [r'$c^2 = 9 + 16 = 25$, also $c = 5$ cm.',
     r'Zwei Seiten zusammen sind im Dreieck immer länger als die dritte, deshalb kann $c$ nicht 7 cm sein.'])

Q.q(r'Beim Ergänzungsbeweis legt man vier gleiche rechtwinklige Dreiecke in ein Quadrat mit der Seite $a + b$. In der Mitte bleibt ein Quadrat mit der Seite $c$. Welche Gleichung beschreibt die Figur?',
    [r'$(a + b)^2 = 4 \cdot \dfrac{a \cdot b}{2} + c^2$', r'$(a + b)^2 = a^2 + b^2$',
     r'$a + b = c$', r'$4 \cdot a \cdot b = c^2$'],
    [r'Großes Quadrat = vier Dreiecke + inneres Quadrat.',
     r'$a^2 + 2ab + b^2 = 2ab + c^2$, also $a^2 + b^2 = c^2$.'])

Q.q(r'Gilt $a^2 + b^2 = c^2$ in jedem Dreieck?',
    [r'Nein, nur wenn $c$ dem rechten Winkel gegenüberliegt.', r'Ja, in jedem Dreieck.',
     r'Ja, aber nur in gleichseitigen Dreiecken.', r'Nur in stumpfwinkligen Dreiecken.'],
    [r'Gegenbeispiel: gleichseitiges Dreieck mit Seite 1: $1 + 1 \neq 1$.',
     r'Der Satz gilt nur im rechtwinkligen Dreieck.'])

Q.q(r'Die Katheten sind 2,5 cm und 6 cm lang. Wie lang ist die Hypotenuse?',
    [r'6,5 cm', r'8,5 cm', r'5,45 cm', r'42,25 cm'],
    [r'$c^2 = 6{,}25 + 36 = 42{,}25$',
     r'$c = 6{,}5$ cm'])

Q.q(r'Eine Rampe ist 2,5 m lang und überwindet 1,5 m Höhe. Wie weit reicht sie waagerecht?',
    [r'2 m', r'1 m', r'2,92 m', r'4 m'],
    [r'Die Rampe ist die Hypotenuse.',
     r'$x^2 = 6{,}25 - 2{,}25 = 4$, $x = 2$ m'])

Q.q(r'Für die Hypotenuse gilt $c^2 = 144$ cm². Wie lang ist $c$?',
    [r'12 cm', r'72 cm', r'14,4 cm', r'20 736 cm'],
    [r'$c = \sqrt{144} = 12$ cm',
     r'Nur die positive Wurzel ist eine Länge.'])


def check():
    from math import sqrt, isclose
    hyp = lambda a, b: sqrt(a * a + b * b)
    leg = lambda c, a: sqrt(c * c - a * a)
    assert hyp(3, 4) == 5 and hyp(6, 8) == 10 and hyp(5, 12) == 13
    assert leg(10, 6) == 8 and leg(13, 5) == 12
    assert round(hyp(1, 1), 2) == 1.41 and round(hyp(4, 7), 2) == 8.06 and round(leg(9, 5), 2) == 7.48
    assert 9 + 16 == 25
    assert isclose(leg(5, 1.4), 4.8)
    assert round(hyp(88.6, 49.8), 1) == 101.6
    a, b, c = 3, 4, 5
    assert (a + b) ** 2 == 4 * a * b / 2 + c ** 2
    assert hyp(2.5, 6) == 6.5 and leg(2.5, 1.5) == 2 and sqrt(144) == 12


Q.verify(check)
Q.save()
