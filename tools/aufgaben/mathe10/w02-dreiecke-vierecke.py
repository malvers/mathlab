#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 2 / KW 35 (LB 1): Dreiecke und Vierecke
systematisieren. Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=2, slug='dreiecke-vierecke', thema='Dreiecke und Vierecke systematisieren', lb='LB 1',
         blurb='Winkelsummen, Dreiecksarten, Haus der Vierecke, Flächeninhalte',
         comment='Blocks: angle sums and triangle types (1-4), quadrilaterals (5-8), areas (9-12), polygons and side conditions (13-20).')

# ------------------------------------------------ Winkel und Dreiecksarten ----
Q.q(r'In einem Dreieck ist $\alpha = 48^\circ$ und $\beta = 67^\circ$. Wie groß ist $\gamma$?',
    [r'$65^\circ$', r'$75^\circ$', r'$245^\circ$', r'$55^\circ$'],
    [r'Die Winkelsumme im Dreieck beträgt $180^\circ$.',
     r'$\gamma = 180^\circ - 48^\circ - 67^\circ = 65^\circ$'])

Q.q(r'Ein Dreieck hat einen Innenwinkel von $110^\circ$. Wie heißt diese Dreiecksart?',
    [r'stumpfwinklig', r'spitzwinklig', r'rechtwinklig', r'gleichseitig'],
    [r'Ein Winkel über $90^\circ$ heißt stumpf.',
     r'Ein Dreieck mit einem stumpfen Winkel ist stumpfwinklig. Mehr als einen stumpfen Winkel kann es nicht geben, sonst wäre die Summe größer als $180^\circ$.'])

Q.q(r'In einem gleichschenkligen Dreieck ist jeder Basiswinkel $52^\circ$ groß. Wie groß ist der Winkel an der Spitze?',
    [r'$76^\circ$', r'$128^\circ$', r'$52^\circ$', r'$104^\circ$'],
    [r'Beide Basiswinkel sind gleich groß: zusammen $104^\circ$.',
     r'Winkel an der Spitze: $180^\circ - 104^\circ = 76^\circ$'])

Q.q(r'In einem Viereck sind drei Winkel bekannt: $95^\circ$, $80^\circ$ und $110^\circ$. Wie groß ist der vierte Winkel?',
    [r'$75^\circ$', r'$85^\circ$', r'$165^\circ$', r'$255^\circ$'],
    [r'Ein Viereck lässt sich durch eine Diagonale in zwei Dreiecke zerlegen, die Winkelsumme ist also $360^\circ$.',
     r'$360^\circ - 95^\circ - 80^\circ - 110^\circ = 75^\circ$'])

# ------------------------------------------------------ Haus der Vierecke ----
Q.q(r'Welche Aussage ist richtig?',
    [r'Jedes Quadrat ist ein Rechteck.', r'Jedes Rechteck ist ein Quadrat.',
     r'Jede Raute ist ein Rechteck.', r'Jedes Trapez ist ein Parallelogramm.'],
    [r'Ein Rechteck hat vier rechte Winkel. Das Quadrat hat sie auch – und zusätzlich vier gleich lange Seiten.',
     r'Das Quadrat ist also ein besonderes Rechteck. Umgekehrt gilt das nicht: ein Rechteck mit 3 cm und 5 cm ist kein Quadrat.'])

Q.q(r'Wie heißt ein Viereck mit genau einem Paar paralleler Seiten?',
    [r'Trapez', r'Drachenviereck', r'Parallelogramm', r'Raute'],
    [r'Parallelogramm und Raute haben zwei Paare paralleler Seiten.',
     r'Ein Viereck mit (mindestens) einem Paar paralleler Seiten heißt Trapez.'])

Q.q(r'In welchem Viereck halbieren sich die Diagonalen und stehen senkrecht aufeinander, ohne dass alle Winkel rechte Winkel sein müssen?',
    [r'Raute', r'Rechteck', r'Trapez', r'Drachenviereck'],
    [r'Im Rechteck halbieren sich die Diagonalen, stehen aber im Allgemeinen nicht senkrecht.',
     r'Im Drachenviereck stehen sie senkrecht, aber nur eine Diagonale wird halbiert.',
     r'Beides zusammen gilt in der Raute (und im Quadrat, das eine besondere Raute ist).'])

Q.q(r'In einem Parallelogramm ist $\alpha = 70^\circ$. Wie groß ist der benachbarte Winkel $\beta$?',
    [r'$110^\circ$', r'$70^\circ$', r'$20^\circ$', r'$290^\circ$'],
    [r'Benachbarte Winkel im Parallelogramm ergänzen sich zu $180^\circ$.',
     r'$\beta = 180^\circ - 70^\circ = 110^\circ$'])

# ------------------------------------------------------------ Flächen ----
Q.q(r'Ein Trapez hat die parallelen Seiten $a = 8$ cm und $c = 4$ cm und die Höhe $h = 5$ cm. Berechne den Flächeninhalt.',
    [r'30 cm²', r'60 cm²', r'160 cm²', r'17 cm²'],
    [r'$A = \dfrac{a + c}{2} \cdot h$',
     r'$A = \dfrac{8 + 4}{2} \cdot 5 = 6 \cdot 5 = 30$, also 30 cm².'])

Q.q(r'Eine Raute hat die Diagonalen $e = 10$ cm und $f = 6$ cm. Berechne den Flächeninhalt.',
    [r'30 cm²', r'60 cm²', r'16 cm²', r'15 cm²'],
    [r'Die Diagonalen teilen die Raute in vier rechtwinklige Dreiecke; zusammen ergeben sie die Hälfte des Rechtecks $e \cdot f$.',
     r'$A = \dfrac{e \cdot f}{2} = \dfrac{10 \cdot 6}{2} = 30$, also 30 cm².'])

Q.q(r'Ein Parallelogramm hat die Grundseite $g = 12$ cm und die Höhe $h = 7$ cm. Berechne den Flächeninhalt.',
    [r'84 cm²', r'42 cm²', r'38 cm²', r'19 cm²'],
    [r'Durch Abschneiden und Ansetzen eines Dreiecks wird aus dem Parallelogramm ein Rechteck.',
     r'$A = g \cdot h = 12 \cdot 7 = 84$, also 84 cm².'])

Q.q(r'Ein Dreieck hat die Grundseite $g = 9$ cm und die zugehörige Höhe $h = 6$ cm. Berechne den Flächeninhalt.',
    [r'27 cm²', r'54 cm²', r'15 cm²', r'30 cm²'],
    [r'$A = \dfrac{g \cdot h}{2}$',
     r'$A = \dfrac{9 \cdot 6}{2} = 27$, also 27 cm².'])

# ------------------------------------------- Vielecke und Seitenbedingungen ----
Q.q(r'Ein Dreieck hat die Innenwinkel $40^\circ$ und $75^\circ$. Wie groß ist der Außenwinkel am dritten Eckpunkt?',
    [r'$115^\circ$', r'$65^\circ$', r'$245^\circ$', r'$25^\circ$'],
    [r'Der dritte Innenwinkel ist $180^\circ - 40^\circ - 75^\circ = 65^\circ$.',
     r'Außenwinkel und Innenwinkel ergänzen sich zu $180^\circ$: $180^\circ - 65^\circ = 115^\circ$.',
     r'Kontrolle: der Außenwinkel ist so groß wie die beiden anderen Innenwinkel zusammen, $40^\circ + 75^\circ = 115^\circ$.'])

Q.q(r'Wie groß ist ein Innenwinkel in einem regelmäßigen Sechseck?',
    [r'$120^\circ$', r'$60^\circ$', r'$108^\circ$', r'$135^\circ$'],
    [r'Ein Sechseck lässt sich in vier Dreiecke zerlegen: Winkelsumme $4 \cdot 180^\circ = 720^\circ$.',
     r'Im regelmäßigen Sechseck sind alle sechs Winkel gleich: $720^\circ : 6 = 120^\circ$.'])

Q.q(r'Wie groß ist die Winkelsumme in einem Fünfeck?',
    [r'$540^\circ$', r'$360^\circ$', r'$720^\circ$', r'$450^\circ$'],
    [r'Von einer Ecke aus zerlegen zwei Diagonalen das Fünfeck in drei Dreiecke.',
     r'$3 \cdot 180^\circ = 540^\circ$'])

Q.q(r'Ist das Dreieck mit den Seiten 6 cm, 8 cm und 10 cm rechtwinklig?',
    [r'Ja, denn $6^2 + 8^2 = 10^2$.', r'Nein, denn $6 + 8 \neq 10$.',
     r'Ja, denn alle Seitenlängen sind gerade Zahlen.', r'Nein, denn es ist kein Winkel angegeben.'],
    [r'Nach der Umkehrung des Satzes des Pythagoras ist ein Dreieck rechtwinklig, wenn die Quadrate der beiden kürzeren Seiten zusammen das Quadrat der längsten Seite ergeben.',
     r'$36 + 64 = 100 = 10^2$ – also rechtwinklig, der rechte Winkel liegt der 10-cm-Seite gegenüber.'])

Q.q(r'Aus welchen drei Strecken lässt sich ein Dreieck bauen?',
    [r'4 cm, 5 cm und 8 cm', r'2 cm, 3 cm und 6 cm', r'3 cm, 4 cm und 7 cm', r'1 cm, 1 cm und 3 cm'],
    [r'Dreiecksungleichung: zwei Seiten zusammen müssen immer länger sein als die dritte.',
     r'$4 + 5 = 9 > 8$ – das passt.',
     r'Bei 3 cm, 4 cm und 7 cm ist $3 + 4 = 7$: die Strecken liegen flach aufeinander, ein Dreieck entsteht nicht.'])

Q.q(r'Welche Angaben legen ein Dreieck eindeutig fest?',
    [r'zwei Seiten und der von ihnen eingeschlossene Winkel', r'die drei Winkel',
     r'eine Seite und ein beliebiger Winkel', r'zwei Winkel'],
    [r'Das ist der Kongruenzsatz SWS.',
     r'Drei Winkel legen nur die Form fest, nicht die Größe: alle ähnlichen Dreiecke haben dieselben Winkel.'])

Q.q(r'Was gilt in jedem Drachenviereck?',
    [r'Die Diagonalen stehen senkrecht aufeinander.', r'Gegenüberliegende Seiten sind parallel.',
     r'Alle vier Seiten sind gleich lang.', r'Die Diagonalen sind gleich lang.'],
    [r'Ein Drachenviereck hat zwei Paare gleich langer benachbarter Seiten und ist achsensymmetrisch.',
     r'Die Symmetrieachse ist eine Diagonale; die andere Diagonale steht senkrecht auf ihr.'])

Q.q(r'Ein Rechteck ist 6 cm breit und 8 cm lang. Wie lang ist seine Diagonale?',
    [r'10 cm', r'14 cm', r'48 cm', r'100 cm'],
    [r'Die Diagonale teilt das Rechteck in zwei rechtwinklige Dreiecke; sie ist die Hypotenuse.',
     r'$d = \sqrt{6^2 + 8^2} = \sqrt{100} = 10$, also 10 cm.'])


def check():
    import math
    assert 180 - 48 - 67 == 65
    assert 110 > 90
    assert 180 - 2 * 52 == 76
    assert 360 - 95 - 80 - 110 == 75
    assert 180 - 70 == 110
    assert (8 + 4) / 2 * 5 == 30
    assert 10 * 6 / 2 == 30
    assert 12 * 7 == 84
    assert 9 * 6 / 2 == 27
    assert 180 - (180 - 40 - 75) == 115 == 40 + 75
    assert (6 - 2) * 180 / 6 == 120
    assert (5 - 2) * 180 == 540
    assert 6 ** 2 + 8 ** 2 == 10 ** 2
    tri = lambda a, b, c: a + b > c and a + c > b and b + c > a
    assert tri(4, 5, 8) and not tri(2, 3, 6) and not tri(3, 4, 7) and not tri(1, 1, 3)
    assert math.isclose(math.hypot(6, 8), 10)


Q.verify(check)
Q.save()
