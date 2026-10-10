#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 11 / KW 46 (LB 2): random experiments -
outcome, sample space, event, certain and impossible event, complement; Laplace and
non-Laplace experiments. Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from itertools import product
from quiz import os7
from osfig import gluecksrad, RED, BLUE, GREEN

Q = os7(nr=11, slug='zufallsversuche', thema='Zufallsversuche', lb='LB 2',
        blurb='Ergebnis, Ergebnismenge, Ereignis, sicheres und unmögliches Ereignis',
        comment='Blocks: sample spaces (1-2, 8-9, 15, 18), events (3-7, 12-14, 16-17, 20), kinds of experiments (10-11, 19).')

S = set(range(1, 7))
RAD = [('rot', RED), ('rot', RED), ('blau', BLUE), ('grün', GREEN), ('rot', RED), ('blau', BLUE)]

# ---------------------------------------------------------------- sample spaces ----
Q.q(r'Ein Würfel wird einmal geworfen. Wie lautet die Ergebnismenge?',
    [r'$S = \{1;\ 2;\ 3;\ 4;\ 5;\ 6\}$', r'$S = \{6\}$', r'$S = \{0;\ 1;\ 2;\ 3;\ 4;\ 5;\ 6\}$', r'$S = \{1;\ 6\}$'],
    [r'Die Ergebnismenge enthält alle möglichen Ergebnisse.',
     r'Ein Würfel zeigt 1 bis 6 Augen.',
     r'$S = \{1;\ 2;\ 3;\ 4;\ 5;\ 6\}$'])

Q.q(r'Eine Münze wird einmal geworfen. Wie lautet die Ergebnismenge?',
    [r'$S = \{\text{Kopf};\ \text{Zahl}\}$', r'$S = \{\text{Kopf}\}$', r'$S = \{1;\ 2\}$', r'$S = \{\text{Kopf};\ \text{Zahl};\ \text{Rand}\}$'],
    [r'Eine Münze kann Kopf oder Zahl zeigen.',
     r'Das Liegenbleiben auf dem Rand schließt man aus.',
     r'$S = \{\text{Kopf};\ \text{Zahl}\}$'])

Q.q(r'Zwei Münzen werden nacheinander geworfen. Wie viele Elemente hat die Ergebnismenge?',
    [r'4', r'2', r'3', r'8'],
    [r'Erste Münze K oder Z, zweite Münze K oder Z.',
     r'$S = \{KK;\ KZ;\ ZK;\ ZZ\}$',
     r'4 Ergebnisse.'])

Q.q(r'Wie lautet die Ergebnismenge für das Glücksrad?',
    [r'$S = \{\text{rot};\ \text{blau};\ \text{grün}\}$', r'$S = \{1;\ 2;\ 3;\ 4;\ 5;\ 6\}$', r'$S = \{\text{rot}\}$',
     r'$S = \{\text{rot};\ \text{rot};\ \text{rot};\ \text{blau};\ \text{blau};\ \text{grün}\}$'],
    [r'Beobachtet wird die Farbe, auf der der Zeiger stehen bleibt.',
     r'Jedes Ergebnis kommt in der Menge nur einmal vor.',
     r'$S = \{\text{rot};\ \text{blau};\ \text{grün}\}$'],
    fig=gluecksrad(RAD), figcap=r'Glücksrad mit 6 gleich großen Feldern')

Q.q(r'Aus einem Beutel mit 3 roten und 2 blauen Kugeln wird ohne Hinsehen eine Kugel gezogen. Man beobachtet die Farbe. Wie lautet die Ergebnismenge?',
    [r'$S = \{\text{rot};\ \text{blau}\}$', r'$S = \{3;\ 2\}$', r'$S = \{1;\ 2;\ 3;\ 4;\ 5\}$', r'$S = \{\text{rot}\}$'],
    [r'Man beobachtet nur die Farbe.',
     r'Möglich sind rot und blau.',
     r'$S = \{\text{rot};\ \text{blau}\}$ – rot ist aber wahrscheinlicher.'])

Q.q(r'Man beobachtet, an welchem Wochentag die nächste Person Geburtstag hat. Wie viele Elemente hat die Ergebnismenge?',
    [r'7', r'12', r'365', r'31'],
    [r'Beobachtet wird der Wochentag.',
     r'Montag bis Sonntag.',
     r'7 Ergebnisse.'])

# ------------------------------------------------------------------------ events ----
Q.q(r'Würfeln: Welche Menge beschreibt das Ereignis „gerade Augenzahl“?',
    [r'$\{2;\ 4;\ 6\}$', r'$\{1;\ 3;\ 5\}$', r'$\{2;\ 4\}$', r'$\{0;\ 2;\ 4;\ 6\}$'],
    [r'Ein Ereignis fasst Ergebnisse zusammen.',
     r'Gerade Augenzahlen sind 2, 4 und 6.',
     r'Ereignis $E = \{2;\ 4;\ 6\}$'])

Q.q(r'Würfeln: Welche Menge beschreibt das Ereignis „mehr als 4“?',
    [r'$\{5;\ 6\}$', r'$\{4;\ 5;\ 6\}$', r'$\{1;\ 2;\ 3;\ 4\}$', r'$\{6\}$'],
    [r'„Mehr als 4“ heißt: größer als 4.',
     r'Die 4 selbst gehört nicht dazu.',
     r'$E = \{5;\ 6\}$'])

Q.q(r'Würfeln: Welche Menge beschreibt das Ereignis „Primzahl“?',
    [r'$\{2;\ 3;\ 5\}$', r'$\{1;\ 2;\ 3;\ 5\}$', r'$\{3;\ 5\}$', r'$\{2;\ 3;\ 5;\ 6\}$'],
    [r'Primzahlen haben genau zwei Teiler.',
     r'1 ist keine Primzahl, 6 auch nicht.',
     r'$E = \{2;\ 3;\ 5\}$'])

Q.q(r'Was ist ein Ereignis?',
    [r'eine Teilmenge der Ergebnismenge', r'immer genau ein Ergebnis', r'die Anzahl der Würfe', r'ein besonders seltenes Ergebnis'],
    [r'Ein Ereignis kann aus einem, mehreren oder gar keinem Ergebnis bestehen.',
     r'Beispiel: „gerade Zahl“ = $\{2;\ 4;\ 6\}$.',
     r'Es ist also eine Teilmenge der Ergebnismenge.'])

Q.q(r'Beim Würfeln fällt eine 3. Welches Ereignis ist dann eingetreten?',
    [r'„ungerade Augenzahl“', r'„gerade Augenzahl“', r'„mehr als 4“', r'„Augenzahl 6“'],
    [r'Ein Ereignis tritt ein, wenn das Ergebnis darin liegt.',
     r'$3 \in \{1;\ 3;\ 5\}$',
     r'Also ist „ungerade Augenzahl“ eingetreten.'])

Q.q(r'Welches Ereignis ist beim Würfeln sicher?',
    [r'„Augenzahl kleiner als 7“', r'„Augenzahl 6“', r'„gerade Augenzahl“', r'„Augenzahl größer als 1“'],
    [r'Ein sicheres Ereignis tritt bei jedem Wurf ein.',
     r'Jede Augenzahl von 1 bis 6 ist kleiner als 7.',
     r'Das Ereignis ist die ganze Ergebnismenge.'])

Q.q(r'Welches Ereignis ist beim Würfeln unmöglich?',
    [r'„Augenzahl 7“', r'„Augenzahl 1“', r'„ungerade Augenzahl“', r'„Augenzahl kleiner als 3“'],
    [r'Ein unmögliches Ereignis tritt nie ein.',
     r'Kein Würfelergebnis ist 7.',
     r'Es ist die leere Menge.'])

Q.q(r'Was ist beim Würfeln das Gegenereignis von „gerade Augenzahl“?',
    [r'„ungerade Augenzahl“, also $\{1;\ 3;\ 5\}$', r'„Augenzahl 6“', r'„gerade Augenzahl“', r'„Augenzahl 0“'],
    [r'Das Gegenereignis enthält alle Ergebnisse, die nicht im Ereignis liegen.',
     r'$S$ ohne $\{2;\ 4;\ 6\}$',
     r'$= \{1;\ 3;\ 5\}$'])

Q.q(r'Zwei Würfel werden geworfen. Wie viele der 36 Würfelpaare gehören zum Ereignis „Augensumme 10“?',
    [r'3', r'1', r'2', r'10'],
    [r'Mögliche Paare: (4|6), (5|5), (6|4).',
     r'(4|6) und (6|4) sind verschieden, weil die Würfel verschieden sind.',
     r'3 Paare.'])

Q.q(r'Aus den Buchstaben des Wortes MATHE wird zufällig einer gezogen. Welche Menge beschreibt das Ereignis „Vokal“?',
    [r'$\{\text{A};\ \text{E}\}$', r'$\{\text{M};\ \text{T};\ \text{H}\}$', r'$\{\text{A}\}$', r'$\{\text{A};\ \text{E};\ \text{H}\}$'],
    [r'Vokale sind A, E, I, O, U.',
     r'Im Wort MATHE kommen A und E vor.',
     r'$E = \{\text{A};\ \text{E}\}$'])

Q.q(r'Würfeln: Welche Menge beschreibt das Ereignis „höchstens 2“?',
    [r'$\{1;\ 2\}$', r'$\{2\}$', r'$\{2;\ 3;\ 4;\ 5;\ 6\}$', r'$\{1\}$'],
    [r'„Höchstens 2“ heißt: 2 oder weniger.',
     r'Die 2 gehört dazu.',
     r'$E = \{1;\ 2\}$'])

# ----------------------------------------------------------- kinds of experiments ----
Q.q(r'Bei welchem Zufallsversuch sind alle Ergebnisse gleich wahrscheinlich?',
    [r'beim Werfen eines fairen Würfels', r'beim Werfen einer Reißzwecke', r'beim Glücksrad mit 4 roten und 2 blauen Feldern',
     r'beim Ziehen aus einem Beutel mit 3 roten und 1 blauen Kugel'],
    [r'Solche Versuche heißen Laplace-Versuche (nach Pierre-Simon Laplace).',
     r'Beim fairen Würfel hat jede Seite dieselbe Chance.',
     r'Reißzwecke, ungleiches Glücksrad und ungleicher Beutel sind keine Laplace-Versuche.'])

Q.q(r'Eine Reißzwecke wird geworfen. Was gilt für die Ergebnisse „Kopf“ und „Seite“?',
    [r'Sie sind nicht gleich wahrscheinlich; man muss es durch viele Würfe herausfinden.', r'Sie sind gleich wahrscheinlich.',
     r'„Kopf“ ist unmöglich.', r'Es gibt nur ein Ergebnis.'],
    [r'Die Reißzwecke ist ungleichmäßig geformt.',
     r'Es gibt keinen Grund, warum beide Lagen gleich oft vorkommen sollten.',
     r'Kein Laplace-Versuch: Die Chancen bestimmt man durch Versuche.'])

Q.q(r'Was gehört zur genauen Beschreibung eines Zufallsversuchs?',
    [r'was gemacht wird und was beobachtet wird', r'nur das Ergebnis', r'das Datum des Versuchs', r'nur die Anzahl der Würfe'],
    [r'Beispiel: Ein Würfel wird geworfen (was gemacht wird).',
     r'Man notiert die Augenzahl (was beobachtet wird).',
     r'Daraus ergibt sich die Ergebnismenge.'])


def check():
    assert S == {1, 2, 3, 4, 5, 6} and len(list(product('KZ', repeat=2))) == 4
    assert {c for c, _ in RAD} == {'rot', 'blau', 'grün'}
    assert {n for n in S if n % 2 == 0} == {2, 4, 6} and {n for n in S if n > 4} == {5, 6}
    assert {n for n in S if len([d for d in range(1, n + 1) if n % d == 0]) == 2} == {2, 3, 5}
    assert 3 in {n for n in S if n % 2}
    assert {n for n in S if n < 7} == S and {n for n in S if n == 7} == set()
    assert S - {2, 4, 6} == {1, 3, 5}
    assert len([(a, b) for a in S for b in S if a + b == 10]) == 3
    assert {c for c in 'MATHE' if c in 'AEIOU'} == {'A', 'E'}
    assert {n for n in S if n <= 2} == {1, 2}


Q.verify(check)
Q.save()
