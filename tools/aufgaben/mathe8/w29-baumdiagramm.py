#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 29 / KW 15 (LB 5): mehrstufige Zufallsversuche,
Baumdiagramm, Pfadregeln, Galtonbrett. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=29, slug='baumdiagramm', thema='Baumdiagramm und Pfadregeln', lb='LB 5',
        blurb='Mehrstufige Zufallsversuche, Produktregel, Summenregel, Galtonbrett',
        comment='Blocks: rules (2, 9, 20), coins and dice (1, 3-5, 10-11, 18-19), urns and wheels (6-8, 16-17), Galton board (12-13), free throws (14-15).')

# ------------------------------------------------------------- Pfadregeln ----
Q.q(r'Eine Münze wird zweimal geworfen. Wie groß ist die Wahrscheinlichkeit für zweimal Kopf?',
    [r'$\dfrac{1}{4}$', r'$\dfrac{1}{2}$', r'$\dfrac{1}{3}$', r'1'],
    [r'Pfad Kopf, Kopf: $\dfrac{1}{2} \cdot \dfrac{1}{2}$',
     r'$P = \dfrac{1}{4}$'])

Q.q(r'Wie lautet die Pfadmultiplikationsregel?',
    [r'Die Wahrscheinlichkeit eines Pfades ist das Produkt der Wahrscheinlichkeiten entlang des Pfades.',
     r'Die Wahrscheinlichkeit eines Pfades ist die Summe der Wahrscheinlichkeiten entlang des Pfades.',
     r'Alle Pfade haben dieselbe Wahrscheinlichkeit.',
     r'Man multipliziert die Wahrscheinlichkeiten aller Pfade.'],
    [r'Entlang eines Pfades wird multipliziert.',
     r'Gehören mehrere Pfade zu einem Ereignis, werden ihre Wahrscheinlichkeiten addiert (Pfadadditionsregel).'])

Q.q(r'Eine Münze wird zweimal geworfen. Wie groß ist die Wahrscheinlichkeit für genau einmal Kopf?',
    [r'$\dfrac{1}{2}$', r'$\dfrac{1}{4}$', r'$\dfrac{3}{4}$', r'$\dfrac{1}{3}$'],
    [r'Zwei Pfade: Kopf, Zahl und Zahl, Kopf; jeder hat $\dfrac{1}{4}$.',
     r'Pfadaddition: $\dfrac{1}{4} + \dfrac{1}{4} = \dfrac{1}{2}$'])

Q.q(r'Ein Würfel wird zweimal geworfen. Wie groß ist die Wahrscheinlichkeit für zwei Sechsen?',
    [r'$\dfrac{1}{36}$', r'$\dfrac{1}{12}$', r'$\dfrac{1}{6}$', r'$\dfrac{2}{6}$'],
    [r'$\dfrac{1}{6} \cdot \dfrac{1}{6} = \dfrac{1}{36}$'])

Q.q(r'Ein Würfel wird zweimal geworfen. Wie groß ist die Wahrscheinlichkeit für mindestens eine Sechs?',
    [r'$\dfrac{11}{36}$', r'$\dfrac{1}{3}$', r'$\dfrac{25}{36}$', r'$\dfrac{1}{36}$'],
    [r'Gegenereignis: keine Sechs, $\dfrac{5}{6} \cdot \dfrac{5}{6} = \dfrac{25}{36}$.',
     r'$P = 1 - \dfrac{25}{36} = \dfrac{11}{36}$',
     r'$\dfrac{1}{3} = \dfrac{12}{36}$ zählt das Paar (6|6) doppelt.'])

# ------------------------------------------------------------- Urnen, Räder ----
Q.q(r'Eine Urne enthält 2 rote und 3 blaue Kugeln. Es wird zweimal mit Zurücklegen gezogen. Wie groß ist P(rot, rot)?',
    [r'$\dfrac{4}{25}$', r'$\dfrac{2}{5}$', r'$\dfrac{1}{10}$', r'$\dfrac{4}{5}$'],
    [r'Mit Zurücklegen bleibt P(rot) in jedem Zug $\dfrac{2}{5}$.',
     r'$\dfrac{2}{5} \cdot \dfrac{2}{5} = \dfrac{4}{25}$'])

Q.q(r'Wie groß ist in der vorigen Aufgabe die Wahrscheinlichkeit, zweimal dieselbe Farbe zu ziehen?',
    [r'$\dfrac{13}{25}$', r'$\dfrac{12}{25}$', r'$\dfrac{9}{25}$', r'$\dfrac{1}{2}$'],
    [r'P(rot, rot) $= \dfrac{4}{25}$, P(blau, blau) $= \dfrac{3}{5} \cdot \dfrac{3}{5} = \dfrac{9}{25}$',
     r'Pfadaddition: $\dfrac{4}{25} + \dfrac{9}{25} = \dfrac{13}{25}$'])

Q.q(r'Bei einem Glücksrad gewinnt man mit Wahrscheinlichkeit $\dfrac{1}{4}$. Es wird zweimal gedreht. Wie groß ist die Wahrscheinlichkeit für zwei Gewinne?',
    [r'$\dfrac{1}{16}$', r'$\dfrac{1}{8}$', r'$\dfrac{1}{2}$', r'$\dfrac{1}{4}$'],
    [r'$\dfrac{1}{4} \cdot \dfrac{1}{4} = \dfrac{1}{16}$'])

Q.q(r'Was gilt für die Wahrscheinlichkeiten an den Ästen, die von einem Verzweigungspunkt ausgehen?',
    [r'Ihre Summe ist 1.', r'Ihr Produkt ist 1.', r'Sie sind immer gleich groß.', r'Ihre Summe ist 0,5.'],
    [r'Von jedem Punkt aus muss genau eines der möglichen Ergebnisse eintreten.',
     r'Deshalb ergeben die Äste zusammen 1. Das ist eine gute Kontrolle beim Zeichnen.'])

Q.q(r'Eine Münze wird dreimal geworfen. Wie viele Pfade hat das Baumdiagramm?',
    [r'8', r'6', r'3', r'9'],
    [r'Jede Stufe verdoppelt die Zahl der Pfade.',
     r'$2 \cdot 2 \cdot 2 = 8$'])

Q.q(r'Eine Münze wird dreimal geworfen. Wie groß ist die Wahrscheinlichkeit für dreimal Zahl?',
    [r'$\dfrac{1}{8}$', r'$\dfrac{1}{6}$', r'$\dfrac{3}{8}$', r'$\dfrac{1}{2}$'],
    [r'$\left(\dfrac{1}{2}\right)^3 = \dfrac{1}{8}$'])

# ------------------------------------------------------------- Galtonbrett ----
Q.q(r'Auf einem Galtonbrett mit 3 Nagelreihen fällt eine Kugel an jedem Nagel mit Wahrscheinlichkeit $\dfrac{1}{2}$ nach links oder rechts. Es gibt 4 Fächer. Wie groß ist die Wahrscheinlichkeit für das zweite Fach von links?',
    [r'$\dfrac{3}{8}$', r'$\dfrac{1}{4}$', r'$\dfrac{1}{8}$', r'$\dfrac{1}{3}$'],
    [r'Ins zweite Fach führen alle Wege mit genau einmal rechts: RLL, LRL, LLR, also 3 Pfade.',
     r'Jeder Pfad hat $\dfrac{1}{8}$, zusammen $\dfrac{3}{8}$.'])

Q.q(r'Bei einem Galtonbrett mit 4 Nagelreihen führen zum mittleren von 5 Fächern 6 der 16 gleich wahrscheinlichen Wege. Wie groß ist die Wahrscheinlichkeit für das mittlere Fach?',
    [r'$\dfrac{3}{8}$', r'$\dfrac{1}{5}$', r'$\dfrac{6}{10}$', r'$\dfrac{1}{16}$'],
    [r'$P = \dfrac{6}{16} = \dfrac{3}{8}$',
     r'Die Anzahlen der Wege 1, 4, 6, 4, 1 stehen im Pascalschen Dreieck.'])

# ---------------------------------------------------------- Freiwürfe ----
Q.q(r'Eine Basketballerin trifft einen Freiwurf mit Wahrscheinlichkeit 0,8. Wie groß ist die Wahrscheinlichkeit, zwei Freiwürfe nacheinander zu treffen?',
    [r'0,64', r'0,8', r'1,6', r'0,16'],
    [r'Die Würfe werden als unabhängig angenommen.',
     r'$0{,}8 \cdot 0{,}8 = 0{,}64$'])

Q.q(r'Wie groß ist für dieselbe Spielerin die Wahrscheinlichkeit, von zwei Freiwürfen genau einen zu treffen?',
    [r'0,32', r'0,16', r'0,64', r'0,04'],
    [r'Pfade Treffer, Fehlwurf und Fehlwurf, Treffer: je $0{,}8 \cdot 0{,}2 = 0{,}16$.',
     r'Summe: $0{,}16 + 0{,}16 = 0{,}32$'])

Q.q(r'Auf dem Schulweg liegen zwei Ampeln, jede zeigt mit Wahrscheinlichkeit 0,4 Grün (unabhängig). Wie groß ist die Wahrscheinlichkeit, zweimal Grün zu haben?',
    [r'0,16', r'0,8', r'0,4', r'0,36'],
    [r'$0{,}4 \cdot 0{,}4 = 0{,}16$'])

Q.q(r'Bei zwei Fragen mit je 4 Antworten, von denen genau eine richtig ist, wird geraten. Wie groß ist die Wahrscheinlichkeit, beide richtig zu raten?',
    [r'$\dfrac{1}{16}$', r'$\dfrac{1}{8}$', r'$\dfrac{1}{4}$', r'$\dfrac{1}{2}$'],
    [r'$\dfrac{1}{4} \cdot \dfrac{1}{4} = \dfrac{1}{16}$'])

Q.q(r'Ein Würfel wird geworfen und eine Münze geworfen. Wie groß ist die Wahrscheinlichkeit für eine Sechs und Kopf?',
    [r'$\dfrac{1}{12}$', r'$\dfrac{2}{3}$', r'$\dfrac{1}{8}$', r'$\dfrac{7}{12}$'],
    [r'$\dfrac{1}{6} \cdot \dfrac{1}{2} = \dfrac{1}{12}$'])

Q.q(r'Eine Münze wird dreimal geworfen. Wie groß ist die Wahrscheinlichkeit für mindestens einmal Kopf?',
    [r'$\dfrac{7}{8}$', r'$\dfrac{1}{8}$', r'$\dfrac{3}{8}$', r'$\dfrac{1}{2}$'],
    [r'Gegenereignis: dreimal Zahl, $\dfrac{1}{8}$.',
     r'$P = 1 - \dfrac{1}{8} = \dfrac{7}{8}$'])

Q.q(r'An einem Pfad stehen die Wahrscheinlichkeiten 0,3 und 0,5. Wie groß ist die Wahrscheinlichkeit dieses Pfades?',
    [r'0,15', r'0,8', r'0,2', r'1,5'],
    [r'Pfadmultiplikation: $0{,}3 \cdot 0{,}5 = 0{,}15$'])


def check():
    from fractions import Fraction as F
    from itertools import product
    h = F(1, 2)
    assert h * h == F(1, 4) and h * h + h * h == F(1, 2)
    assert F(1, 36) == F(1, 6) ** 2 and 1 - F(5, 6) ** 2 == F(11, 36)
    assert F(2, 5) ** 2 == F(4, 25) and F(2, 5) ** 2 + F(3, 5) ** 2 == F(13, 25)
    assert F(1, 4) ** 2 == F(1, 16)
    assert len(list(product('KZ', repeat=3))) == 8 and h ** 3 == F(1, 8)
    assert sum(1 for p in product('LR', repeat=3) if p.count('R') == 1) * h ** 3 == F(3, 8)
    assert sum(1 for p in product('LR', repeat=4) if p.count('R') == 2) == 6 and F(6, 16) == F(3, 8)
    assert F('0.8') ** 2 == F('0.64') and 2 * F('0.8') * F('0.2') == F('0.32')
    assert F('0.4') ** 2 == F('0.16')
    assert F(1, 6) * h == F(1, 12)
    assert 1 - h ** 3 == F(7, 8)
    assert F('0.3') * F('0.5') == F('0.15')


Q.verify(check)
Q.save()
