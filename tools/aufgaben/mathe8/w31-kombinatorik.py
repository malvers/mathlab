#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 31 / KW 17 (LB 5): kombinatorisches Zählen,
Fakultät n!, Wahrscheinlichkeiten über Anzahlen. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=31, slug='kombinatorik', thema='Kombinatorisches Zählen', lb='LB 5',
        blurb='Zählprinzip, Anordnungen und n!, Codes und Schlösser, Wahrscheinlichkeiten über Anzahlen',
        comment='Blocks: counting principle (1, 9-10, 12-13, 19), arrangements and factorial (2-3, 8, 15-16, 20), codes (4-6), places and pairs (7, 14, 18), probabilities (5, 11, 17).')

# --------------------------------------------------------- Zählprinzip ----
Q.q(r'Zu 3 T-Shirts gibt es 4 Hosen. Wie viele verschiedene Kombinationen aus einem T-Shirt und einer Hose gibt es?',
    [r'12', r'7', r'24', r'81'],
    [r'Zu jedem T-Shirt passt jede der 4 Hosen.',
     r'Zählprinzip: $3 \cdot 4 = 12$'])

Q.q(r'Wie groß ist $4!$ (gesprochen: 4 Fakultät)?',
    [r'24', r'16', r'10', r'4'],
    [r'$4! = 4 \cdot 3 \cdot 2 \cdot 1$',
     r'$= 24$'])

Q.q(r'Auf wie viele Arten können sich 5 Personen nebeneinander auf 5 Stühle setzen?',
    [r'120', r'25', r'15', r'3125'],
    [r'Für den ersten Stuhl gibt es 5 Möglichkeiten, für den zweiten noch 4 usw.',
     r'$5! = 5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 = 120$'])

Q.q(r'Ein Zahlenschloss hat 3 Ringe mit den Ziffern 0 bis 9. Wie viele Codes gibt es?',
    [r'1000', r'30', r'720', r'999'],
    [r'Jeder Ring hat 10 Möglichkeiten, Ziffern dürfen sich wiederholen.',
     r'$10 \cdot 10 \cdot 10 = 1000$ (000 bis 999)'])

Q.q(r'Wie groß ist die Wahrscheinlichkeit, den Code dieses Zahlenschlosses beim ersten Versuch zu erraten?',
    [r'$\dfrac{1}{1000}$', r'$\dfrac{1}{30}$', r'$\dfrac{3}{10}$', r'$\dfrac{1}{999}$'],
    [r'Genau einer von 1000 gleich wahrscheinlichen Codes ist richtig.'])

Q.q(r'Wie viele vierstellige PINs aus den Ziffern 0 bis 9 gibt es?',
    [r'10 000', r'9999', r'5040', r'40'],
    [r'$10 \cdot 10 \cdot 10 \cdot 10 = 10\,000$ (0000 bis 9999)'])

Q.q(r'Bei einem Lauf mit 8 Personen werden Gold, Silber und Bronze vergeben. Wie viele Möglichkeiten gibt es für die ersten drei Plätze?',
    [r'336', r'24', r'512', r'56'],
    [r'Gold: 8 Möglichkeiten, Silber: noch 7, Bronze: noch 6.',
     r'$8 \cdot 7 \cdot 6 = 336$'])

Q.q(r'Auf wie viele Arten kann man die Buchstaben des Wortes MATHE anordnen?',
    [r'120', r'25', r'60', r'5'],
    [r'Fünf verschiedene Buchstaben: $5! = 120$.'])

Q.q(r'Ein Menü besteht aus Vorspeise, Hauptgericht und Nachtisch. Zur Wahl stehen 3 Vorspeisen, 4 Hauptgerichte und 2 Nachtische. Wie viele Menüs gibt es?',
    [r'24', r'9', r'12', r'36'],
    [r'$3 \cdot 4 \cdot 2 = 24$'])

Q.q(r'Ein Würfel wird dreimal geworfen. Wie viele verschiedene Ergebnisfolgen gibt es?',
    [r'216', r'18', r'36', r'120'],
    [r'$6 \cdot 6 \cdot 6 = 216$'])

Q.q(r'Fünf Personen setzen sich zufällig nebeneinander. Wie groß ist die Wahrscheinlichkeit, dass sie genau in alphabetischer Reihenfolge sitzen?',
    [r'$\dfrac{1}{120}$', r'$\dfrac{1}{5}$', r'$\dfrac{1}{25}$', r'$\dfrac{5}{120}$'],
    [r'Es gibt $5! = 120$ gleich wahrscheinliche Sitzordnungen.',
     r'Genau eine davon ist alphabetisch.'])

Q.q(r'Wie viele dreistellige Zahlen kann man aus den Ziffern 1, 2, 3, 4, 5 bilden, wenn jede Ziffer höchstens einmal vorkommt?',
    [r'60', r'125', r'15', r'10'],
    [r'Hunderter: 5, Zehner: noch 4, Einer: noch 3 Möglichkeiten.',
     r'$5 \cdot 4 \cdot 3 = 60$'])

Q.q(r'Wie viele dreistellige Zahlen aus den Ziffern 1 bis 5 gibt es, wenn Ziffern mehrfach vorkommen dürfen?',
    [r'125', r'60', r'15', r'243'],
    [r'Jede Stelle hat 5 Möglichkeiten.',
     r'$5 \cdot 5 \cdot 5 = 125$'])

Q.q(r'Sechs Personen begrüßen sich jeweils mit Handschlag, jede mit jeder genau einmal. Wie viele Handschläge gibt es?',
    [r'15', r'30', r'36', r'12'],
    [r'Jede Person gibt 5 anderen die Hand: $6 \cdot 5 = 30$.',
     r'Dabei ist jeder Handschlag doppelt gezählt: $30 : 2 = 15$.'])

Q.q(r'Wie groß ist $6!$?',
    [r'720', r'36', r'120', r'21'],
    [r'$6! = 6 \cdot 5! = 6 \cdot 120 = 720$'])

Q.q(r'Auf wie viele Arten lassen sich 4 verschiedene Bücher nebeneinander ins Regal stellen?',
    [r'24', r'16', r'4', r'256'],
    [r'$4! = 4 \cdot 3 \cdot 2 \cdot 1 = 24$'])

Q.q(r'Die 4 Bücher werden zufällig ins Regal gestellt. Wie groß ist die Wahrscheinlichkeit, dass sie in der richtigen Bandreihenfolge stehen?',
    [r'$\dfrac{1}{24}$', r'$\dfrac{1}{4}$', r'$\dfrac{1}{16}$', r'$\dfrac{4}{24}$'],
    [r'Eine günstige von 24 gleich wahrscheinlichen Anordnungen.'])

Q.q(r'In einem Turnier mit 5 Mannschaften spielt jede gegen jede genau einmal. Wie viele Spiele gibt es?',
    [r'10', r'20', r'25', r'5'],
    [r'Jede Mannschaft hat 4 Gegner: $5 \cdot 4 = 20$.',
     r'Jedes Spiel ist doppelt gezählt: $20 : 2 = 10$.'])

Q.q(r'Ein Code besteht aus 2 Buchstaben (A bis Z, 26 Möglichkeiten) und danach 2 Ziffern. Wie viele Codes gibt es?',
    [r'67 600', r'2 600', r'1 296', r'4 760'],
    [r'$26 \cdot 26 \cdot 10 \cdot 10$',
     r'$676 \cdot 100 = 67\,600$'])

Q.q(r'Wie groß ist $10!$?',
    [r'3 628 800', r'100', r'55', r'362 880'],
    [r'$10! = 10 \cdot 9! = 10 \cdot 362\,880 = 3\,628\,800$',
     r'Fakultäten wachsen sehr schnell.'])


def check():
    from math import factorial as f, comb
    from itertools import permutations, product
    assert 3 * 4 == 12 and f(4) == 24 and f(5) == 120
    assert 10 ** 3 == 1000 and 10 ** 4 == 10000
    assert len(list(permutations(range(8), 3))) == 336
    assert len(set(permutations('MATHE'))) == 120
    assert 3 * 4 * 2 == 24 and 6 ** 3 == 216
    assert len(list(permutations('12345', 3))) == 60 and len(list(product('12345', repeat=3))) == 125
    assert comb(6, 2) == 15 and comb(5, 2) == 10
    assert f(6) == 720 and f(4) == 24
    assert 26 ** 2 * 10 ** 2 == 67600
    assert f(10) == 3628800 and f(9) == 362880


Q.verify(check)
Q.save()
