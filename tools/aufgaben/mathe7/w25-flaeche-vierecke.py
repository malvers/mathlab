#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 25 / KW 10 (LB 4): area and perimeter of
parallelogram, kite, rhombus and trapezoid; missing lengths; word problems with units.
Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os7

Q = os7(nr=25, slug='flaeche-vierecke', thema='Flächeninhalt und Umfang von Vierecken', lb='LB 4',
        blurb='Parallelogramm, Drachenviereck, Raute, Trapez, fehlende Stücke, Sachaufgaben',
        comment='Blocks: areas (1-4, 18), missing parts (5-8), perimeter (9-11), word problems (12-15, 20), reasoning (16-17, 19).')

para = lambda g, h: D(str(g)) * D(str(h))
trap = lambda a, c, h: (D(str(a)) + D(str(c))) * D(str(h)) / 2
kite = lambda e, f: D(str(e)) * D(str(f)) / 2

# ------------------------------------------------------------------------- areas ----
Q.q(r'Ein Parallelogramm hat die Grundseite 8,5 cm und die Höhe 4 cm. Wie groß ist sein Flächeninhalt?',
    [r'34 cm²', r'17 cm²', r'25 cm²', r'12,5 cm²'],
    [r'$A = g \cdot h$',
     r'$= 8{,}5 \cdot 4$',
     r'$= 34$ cm²'])

Q.q(r'Ein Trapez hat $a = 9$ cm, $c = 5$ cm und $h = 4{,}5$ cm. Wie groß ist sein Flächeninhalt?',
    [r'31,5 cm²', r'63 cm²', r'202,5 cm²', r'18,5 cm²'],
    [r'$A = \dfrac{(a + c) \cdot h}{2}$',
     r'$= \dfrac{14 \cdot 4{,}5}{2} = \dfrac{63}{2}$',
     r'$= 31{,}5$ cm²'])

Q.q(r'Ein Drachenviereck hat die Diagonalen 12 cm und 7 cm. Wie groß ist sein Flächeninhalt?',
    [r'42 cm²', r'84 cm²', r'19 cm²', r'38 cm²'],
    [r'$A = \dfrac{e \cdot f}{2}$',
     r'$= \dfrac{12 \cdot 7}{2}$',
     r'$= 42$ cm²'])

Q.q(r'Eine Raute hat die Diagonalen 10 cm und 6 cm. Wie groß ist ihr Flächeninhalt?',
    [r'30 cm²', r'60 cm²', r'16 cm²', r'32 cm²'],
    [r'Eine Raute ist ein besonderes Drachenviereck.',
     r'$A = \dfrac{10 \cdot 6}{2}$',
     r'$= 30$ cm²'])

Q.q(r'Bei einem Trapez ist die Mittellinie $m = \dfrac{a + c}{2} = 7$ cm und die Höhe 3 cm. Wie groß ist der Flächeninhalt?',
    [r'21 cm²', r'10,5 cm²', r'42 cm²', r'10 cm²'],
    [r'$A = \dfrac{a + c}{2} \cdot h = m \cdot h$',
     r'$= 7 \cdot 3$',
     r'$= 21$ cm²'])

# ------------------------------------------------------------------- missing parts ----
Q.q(r'Ein Parallelogramm hat den Flächeninhalt 42 cm² und die Grundseite 7 cm. Wie groß ist die Höhe?',
    [r'6 cm', r'35 cm', r'294 cm', r'12 cm'],
    [r'$A = g \cdot h$, also $42 = 7 \cdot h$',
     r'$h = 42 : 7$',
     r'$h = 6$ cm'])

Q.q(r'Ein Trapez hat den Flächeninhalt 48 cm², $a = 10$ cm und $c = 6$ cm. Wie groß ist die Höhe?',
    [r'6 cm', r'3 cm', r'4,8 cm', r'8 cm'],
    [r'$48 = \dfrac{(10 + 6) \cdot h}{2} = 8 \cdot h$',
     r'$h = 48 : 8$',
     r'$h = 6$ cm'])

Q.q(r'Ein Trapez hat den Flächeninhalt 40 cm², $a = 12$ cm und $h = 4$ cm. Wie lang ist $c$?',
    [r'8 cm', r'10 cm', r'4 cm', r'20 cm'],
    [r'$40 = \dfrac{(12 + c) \cdot 4}{2} = (12 + c) \cdot 2$',
     r'$12 + c = 20$',
     r'$c = 8$ cm'])

Q.q(r'Ein Drachenviereck hat den Flächeninhalt 36 cm² und die Diagonale $e = 9$ cm. Wie lang ist $f$?',
    [r'8 cm', r'4 cm', r'27 cm', r'16 cm'],
    [r'$36 = \dfrac{9 \cdot f}{2}$',
     r'Das Doppelte: $72 = 9 \cdot f$',
     r'$f = 8$ cm'])

# ----------------------------------------------------------------------- perimeter ----
Q.q(r'Ein Parallelogramm hat die Seiten 6,5 cm und 4 cm. Wie groß ist sein Umfang?',
    [r'21 cm', r'10,5 cm', r'26 cm', r'17 cm'],
    [r'$u = 2a + 2b$',
     r'$= 13 + 8$',
     r'$= 21$ cm'])

Q.q(r'Ein Drachenviereck hat Seiten von 5,5 cm und 3,5 cm (je zweimal). Wie groß ist sein Umfang?',
    [r'18 cm', r'9 cm', r'19,25 cm', r'16 cm'],
    [r'$u = 2 \cdot 5{,}5 + 2 \cdot 3{,}5$',
     r'$= 11 + 7$',
     r'$= 18$ cm'])

Q.q(r'Ein gleichschenkliges Trapez hat $a = 10$ cm, $c = 6$ cm und Schenkel von je 5 cm. Wie groß ist sein Umfang?',
    [r'26 cm', r'21 cm', r'16 cm', r'31 cm'],
    [r'Alle vier Seiten addieren.',
     r'$10 + 5 + 6 + 5$',
     r'$= 26$ cm'])

# ------------------------------------------------------------------- word problems ----
Q.q(r'Ein Grundstück ist ein Trapez mit $a = 40$ m, $c = 30$ m und $h = 25$ m. Ein Quadratmeter kostet 120 €. Was kostet das Grundstück?',
    [r'105 000 €', r'210 000 €', r'875 €', r'84 000 €'],
    [r'Fläche: $\dfrac{(40 + 30) \cdot 25}{2} = 875$ m²',
     r'Preis: $875 \cdot 120$',
     r'$= 105\,000$ €'])

Q.q(r'Eine Dachfläche ist ein Trapez mit 12 m und 6 m langen parallelen Seiten und 5 m Höhe. Pro Quadratmeter braucht man 15 Ziegel. Wie viele Ziegel braucht man?',
    [r'675', r'45', r'1350', r'900'],
    [r'Fläche: $\dfrac{(12 + 6) \cdot 5}{2} = 45$ m²',
     r'Ziegel: $45 \cdot 15$',
     r'$= 675$ Ziegel'])

Q.q(r'Ein Blumenbeet hat die Form einer Raute mit den Diagonalen 3 m und 2 m. Wie groß ist das Beet?',
    [r'3 m²', r'6 m²', r'5 m²', r'2,5 m²'],
    [r'$A = \dfrac{e \cdot f}{2}$',
     r'$= \dfrac{3 \cdot 2}{2}$',
     r'$= 3$ m²'])

Q.q(r'Ein Parallelogramm hat die Grundseite 1,2 m und die Höhe 80 cm. Wie groß ist sein Flächeninhalt?',
    [r'0,96 m²', r'96 m²', r'9,6 m²', r'0,096 m²'],
    [r'Einheiten angleichen: 80 cm = 0,8 m.',
     r'$A = 1{,}2 \cdot 0{,}8$',
     r'$= 0{,}96$ m²'])

Q.q(r'Ein Drachen wird aus Stoff mit den Diagonalen 80 cm und 60 cm genäht. Ein Quadratmeter Stoff kostet 12 €. Was kostet der Stoff mindestens?',
    [r'2,88 €', r'28,80 €', r'5,76 €', r'0,24 €'],
    [r'Fläche: $\dfrac{0{,}8 \cdot 0{,}6}{2} = 0{,}24$ m²',
     r'Preis: $0{,}24 \cdot 12$',
     r'$= 2{,}88$ €'])

# ------------------------------------------------------------------------ reasoning ----
Q.q(r'Ein Parallelogramm mit $g = 6$ cm und $h = 4$ cm und ein Rechteck mit 6 cm × 4 cm: Was gilt für ihre Flächen?',
    [r'Sie sind gleich groß.', r'Das Parallelogramm ist größer.', r'Das Rechteck ist größer.', r'Man kann es nicht vergleichen.'],
    [r'Beide: $6 \cdot 4 = 24$ cm².',
     r'Das Parallelogramm lässt sich durch Zerlegen in das Rechteck umlegen.',
     r'Gleiche Grundseite und Höhe bedeuten gleichen Flächeninhalt.'])

Q.q(r'Bei einem Trapez wird nur die Höhe verdoppelt. Was passiert mit dem Flächeninhalt?',
    [r'Er verdoppelt sich.', r'Er vervierfacht sich.', r'Er bleibt gleich.', r'Er halbiert sich.'],
    [r'$A = \dfrac{(a + c) \cdot h}{2}$',
     r'Mit $2h$ wird der ganze Term doppelt so groß.',
     r'Der Flächeninhalt verdoppelt sich.'])

Q.q(r'Tom rechnet bei einem Parallelogramm mit den Seiten 6 cm und 5 cm: $A = 6 \cdot 5 = 30$ cm². Was stimmt?',
    [r'Falsch: Man braucht die Höhe, nicht die schräge Seite; die Fläche ist kleiner als 30 cm².', r'Richtig.',
     r'Falsch: Man muss noch durch 2 teilen.', r'Falsch: Man muss die Seiten addieren.'],
    [r'$A = g \cdot h$ – die Höhe steht senkrecht auf $g$.',
     r'Die schräge Seite ist länger als die Höhe.',
     r'Nur beim Rechteck ist die Seite zugleich die Höhe.'])


def check():
    assert para('8.5', 4) == 34 and trap(9, 5, '4.5') == D('31.5') and kite(12, 7) == 42 and kite(10, 6) == 30
    assert 7 * 3 == 21 and D(42) / 7 == 6 and D(48) / ((10 + 6) / D(2)) == 6
    assert D(40) * 2 / 4 - 12 == 8 and D(36) * 2 / 9 == 8
    assert 2 * D('6.5') + 2 * 4 == 21 and 2 * D('5.5') + 2 * D('3.5') == 18 and 10 + 5 + 6 + 5 == 26
    assert trap(40, 30, 25) * 120 == 105000 and trap(12, 6, 5) * 15 == 675 and kite(3, 2) == 3
    assert para('1.2', '0.8') == D('0.96') and kite('0.8', '0.6') * 12 == D('2.88')
    assert para(6, 4) == 24 and trap(5, 3, 4) * 2 == trap(5, 3, 8)


Q.verify(check)
Q.save()
