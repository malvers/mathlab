#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 2 / KW 35 (LB 1): sets, elements, subsets, why the
natural numbers are not enough. Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from quiz import os6

Q = os6(nr=2, slug='mengen', thema='Mengen und Teilmengen', lb='LB 1',
        blurb='Mengen angeben, Elemente, Teilmengen, natürliche und gebrochene Zahlen',
        comment='Blocks: sets and elements (1-6), subsets and common elements (7-12), why fractions are needed (13-20).')

# ------------------------------------------------------ sets and elements ----
Q.q(r'Welche Menge enthält genau alle Teiler von 12?',
    [r'$\{1;\ 2;\ 3;\ 4;\ 6;\ 12\}$', r'$\{2;\ 3;\ 4;\ 6\}$', r'$\{1;\ 2;\ 3;\ 4;\ 6\}$', r'$\{12;\ 24;\ 36;\ 48\}$'],
    [r'Ein Teiler von 12 teilt 12 ohne Rest.',
     r'$12 = 1 \cdot 12 = 2 \cdot 6 = 3 \cdot 4$',
     r'Auch 1 und 12 selbst sind Teiler: $\{1;\ 2;\ 3;\ 4;\ 6;\ 12\}$.'])

Q.q(r'Wie viele Elemente hat die Menge $M = \{2;\ 4;\ 6;\ 8;\ 10\}$?',
    [r'5', r'10', r'4', r'6'],
    [r'Die Elemente sind die Zahlen in der Mengenklammer.',
     r'Abzählen: 2, 4, 6, 8, 10.',
     r'Die Menge hat 5 Elemente; die 10 ist nur das größte Element.'])

Q.q(r'Die Menge $U$ enthält alle ungeraden Zahlen zwischen 10 und 20. Welche Zahl gehört NICHT zu $U$?',
    [r'16', r'13', r'15', r'19'],
    [r'Ungerade Zahlen lassen beim Teilen durch 2 den Rest 1.',
     r'$U = \{11;\ 13;\ 15;\ 17;\ 19\}$',
     r'16 ist gerade, also kein Element von $U$.'])

Q.q(r'Welche Beschreibung passt zur Menge $\{5;\ 10;\ 15;\ 20\}$?',
    [r'die Vielfachen von 5, die größer als 0 und kleiner als 25 sind', r'die Teiler von 20',
     r'die ungeraden Zahlen bis 20', r'die Vielfachen von 10 bis 20'],
    [r'Alle vier Zahlen sind durch 5 teilbar: $5 \cdot 1$, $5 \cdot 2$, $5 \cdot 3$, $5 \cdot 4$.',
     r'Die Teiler von 20 wären $\{1;\ 2;\ 4;\ 5;\ 10;\ 20\}$ – 15 gehört nicht dazu.',
     r'Also: die Vielfachen von 5 zwischen 0 und 25.'])

Q.q(r'Welche Menge enthält alle natürlichen Zahlen, die kleiner als 4 sind?',
    [r'$\{0;\ 1;\ 2;\ 3\}$', r'$\{1;\ 2;\ 3\}$', r'$\{1;\ 2;\ 3;\ 4\}$', r'$\{0;\ 1;\ 2;\ 3;\ 4\}$'],
    [r'Die Null ist die kleinste natürliche Zahl.',
     r'„Kleiner als 4“ heißt: Die 4 selbst gehört nicht dazu.',
     r'Also $\{0;\ 1;\ 2;\ 3\}$.'])

Q.q(r'Welche Menge ist leer, hat also kein einziges Element?',
    [r'die natürlichen Zahlen zwischen 5 und 6', r'die Teiler von 7',
     r'die geraden natürlichen Zahlen kleiner als 3', r'die natürlichen Zahlen zwischen 5 und 7'],
    [r'Teiler von 7: $\{1;\ 7\}$. Gerade Zahlen kleiner als 3: $\{0;\ 2\}$. Zwischen 5 und 7 liegt die 6.',
     r'Zwischen 5 und 6 liegt keine natürliche Zahl.',
     r'Diese Menge ist leer. (Gebrochene Zahlen wie $5\tfrac{1}{2}$ gibt es dort aber schon!)'])

# ------------------------------------------ subsets and common elements ----
Q.q(r'Gegeben sind $A = \{2;\ 4\}$ und $B = \{1;\ 2;\ 3;\ 4\}$. Welche Aussage stimmt?',
    [r'$A$ ist eine Teilmenge von $B$.', r'$B$ ist eine Teilmenge von $A$.',
     r'$A$ und $B$ sind gleich.', r'$A$ und $B$ haben kein gemeinsames Element.'],
    [r'$A$ ist Teilmenge von $B$, wenn jedes Element von $A$ auch in $B$ liegt.',
     r'2 und 4 liegen beide in $B$.',
     r'Umgekehrt nicht: 1 liegt in $B$, aber nicht in $A$.'])

Q.q(r'Die Teiler von 18 sind $\{1;\ 2;\ 3;\ 6;\ 9;\ 18\}$. Welche Menge ist eine Teilmenge davon?',
    [r'$\{2;\ 3;\ 9\}$', r'$\{2;\ 4;\ 6\}$', r'$\{3;\ 6;\ 12\}$', r'$\{1;\ 5;\ 9\}$'],
    [r'Jedes Element muss ein Teiler von 18 sein.',
     r'4, 12 und 5 teilen 18 nicht.',
     r'Nur $\{2;\ 3;\ 9\}$ liegt ganz in der Teilermenge.'])

Q.q(r'Welche Zahlen liegen sowohl in der Menge der Teiler von 12 als auch in der Menge der Teiler von 18?',
    [r'$\{1;\ 2;\ 3;\ 6\}$', r'$\{1;\ 2;\ 3;\ 4;\ 6\}$', r'$\{2;\ 3\}$', r'$\{6;\ 12;\ 18\}$'],
    [r'Teiler von 12: $\{1;\ 2;\ 3;\ 4;\ 6;\ 12\}$',
     r'Teiler von 18: $\{1;\ 2;\ 3;\ 6;\ 9;\ 18\}$',
     r'Gemeinsam: $\{1;\ 2;\ 3;\ 6\}$. Die größte davon, 6, heißt größter gemeinsamer Teiler.'])

Q.q(r'Die Menge aller Quadrate ist eine Teilmenge der Menge aller …',
    [r'Rechtecke', r'Dreiecke', r'Kreise', r'Würfel'],
    [r'Ein Quadrat hat vier rechte Winkel und gegenüberliegende Seiten gleich lang.',
     r'Das sind genau die Eigenschaften eines Rechtecks.',
     r'Jedes Quadrat ist ein Rechteck (mit vier gleich langen Seiten).'])

Q.q(r'Lisa sagt: „Die Menge $\{2;\ 3;\ 5;\ 7\}$ ist eine Teilmenge der Primzahlen.“ Hat sie recht?',
    [r'Ja, alle vier Zahlen sind Primzahlen.', r'Nein, 2 ist gerade und deshalb keine Primzahl.',
     r'Nein, die 1 fehlt.', r'Nein, eine Teilmenge muss unendlich viele Elemente haben.'],
    [r'Eine Primzahl hat genau zwei Teiler: 1 und sich selbst.',
     r'2, 3, 5 und 7 haben jeweils genau zwei Teiler; die 2 ist die einzige gerade Primzahl.',
     r'1 ist keine Primzahl (nur ein Teiler). Lisa hat recht.'])

Q.q(r'In der Klasse 6a sind 26 Personen. 15 spielen Fußball, 9 spielen Handball, 4 davon spielen beides. Wie viele spielen keins von beiden?',
    [r'6', r'2', r'10', r'4'],
    [r'Wer beides spielt, wurde zweimal gezählt: $15 + 9 - 4 = 20$ Personen spielen mindestens eins.',
     r'$26 - 20 = 6$',
     r'Eine Skizze mit zwei sich überschneidenden Kreisen hilft beim Zählen.'])

# ------------------------------------------------ why fractions are needed ----
Q.q(r'Welche Aufgabe hat KEIN Ergebnis in den natürlichen Zahlen?',
    [r'$3 : 4$', r'$12 : 4$', r'$7 + 5$', r'$9 - 4$'],
    [r'$12 : 4 = 3$, $7 + 5 = 12$, $9 - 4 = 5$ sind natürliche Zahlen.',
     r'3 lässt sich nicht ohne Rest durch 4 teilen.',
     r'Das Ergebnis ist der Bruch $\dfrac{3}{4}$ – dafür brauchen wir die gebrochenen Zahlen.'])

Q.q(r'Drei Pizzen werden gerecht auf vier Personen verteilt. Wie viel bekommt jede Person?',
    [r'$\dfrac{3}{4}$ Pizza', r'$\dfrac{4}{3}$ Pizza', r'$\dfrac{1}{4}$ Pizza', r'$\dfrac{1}{3}$ Pizza'],
    [r'Jede Pizza wird geviertelt: Jede Person bekommt aus jeder Pizza ein Viertel.',
     r'Aus drei Pizzen sind das drei Viertel.',
     r'$3 : 4 = \dfrac{3}{4}$'])

Q.q(r'Welche Zahl ist eine gebrochene Zahl, aber keine natürliche Zahl?',
    [r'$\dfrac{2}{5}$', r'$\dfrac{6}{3}$', r'0', r'7'],
    [r'$\dfrac{6}{3} = 6 : 3 = 2$ ist eine natürliche Zahl.',
     r'0 und 7 sind natürliche Zahlen.',
     r'$\dfrac{2}{5}$ liegt zwischen 0 und 1 – keine natürliche Zahl.'])

Q.q(r'Welche Aussage ist richtig?',
    [r'Jede natürliche Zahl ist auch eine gebrochene Zahl.', r'Jede gebrochene Zahl ist auch eine natürliche Zahl.',
     r'0 ist keine gebrochene Zahl.', r'Ein Bruch mit dem Zähler 1 ist immer eine natürliche Zahl.'],
    [r'Jede natürliche Zahl lässt sich als Bruch schreiben, zum Beispiel $5 = \dfrac{5}{1}$ und $0 = \dfrac{0}{1}$.',
     r'$\dfrac{1}{2}$ ist gebrochen, aber nicht natürlich.',
     r'Die natürlichen Zahlen sind eine Teilmenge der gebrochenen Zahlen.'])

Q.q(r'Wie schreibt man die Zahl 5 als Bruch mit dem Nenner 3?',
    [r'$\dfrac{15}{3}$', r'$\dfrac{5}{3}$', r'$\dfrac{8}{3}$', r'$\dfrac{3}{5}$'],
    [r'$5 = \dfrac{5}{1}$',
     r'Mit 3 erweitern: $\dfrac{5 \cdot 3}{1 \cdot 3} = \dfrac{15}{3}$',
     r'Probe: $15 : 3 = 5$.'])

Q.q(r'Welche Zahl liegt zwischen 2 und 3?',
    [r'$\dfrac{5}{2}$', r'$\dfrac{3}{2}$', r'$\dfrac{7}{2}$', r'$\dfrac{4}{2}$'],
    [r'In Halben: $2 = \dfrac{4}{2}$ und $3 = \dfrac{6}{2}$.',
     r'Dazwischen liegt $\dfrac{5}{2}$, also zweieinhalb.',
     r'$\dfrac{4}{2}$ ist genau 2 und liegt nicht dazwischen.'])

Q.q(r'7 Liter Apfelsaft werden gleichmäßig auf 2 Kannen verteilt. Wie viel kommt in jede Kanne?',
    [r'3,5 Liter', r'3 Liter', r'4 Liter', r'2,7 Liter'],
    [r'$7 : 2 = \dfrac{7}{2}$',
     r'$\dfrac{7}{2} = 3\tfrac{1}{2}$',
     r'Jede Kanne bekommt 3,5 Liter.'])

Q.q(r'Wie viele Vielfache von 4 liegen zwischen 1 und 30?',
    [r'7', r'8', r'6', r'26'],
    [r'Vielfache von 4: $\{4;\ 8;\ 12;\ 16;\ 20;\ 24;\ 28\}$',
     r'Das nächste, 32, ist schon größer als 30.',
     r'Abzählen: 7 Elemente.'])


def check():
    T = lambda n: {d for d in range(1, n + 1) if n % d == 0}
    assert T(12) == {1, 2, 3, 4, 6, 12}
    assert len({2, 4, 6, 8, 10}) == 5
    U = {n for n in range(11, 20) if n % 2 == 1}
    assert U == {11, 13, 15, 17, 19} and 16 not in U and {13, 15, 19} <= U
    assert {5 * k for k in range(1, 5)} == {k for k in range(1, 25) if k % 5 == 0} and 15 not in T(20)
    assert {n for n in range(0, 4)} == {0, 1, 2, 3}
    assert not [n for n in range(6, 6)] and T(7) == {1, 7} and {n for n in range(0, 3) if n % 2 == 0} == {0, 2}
    assert {2, 4} <= {1, 2, 3, 4} and not {1, 2, 3, 4} <= {2, 4}
    assert T(18) == {1, 2, 3, 6, 9, 18} and {2, 3, 9} <= T(18)
    assert not {2, 4, 6} <= T(18) and not {3, 6, 12} <= T(18) and not {1, 5, 9} <= T(18)
    assert T(12) & T(18) == {1, 2, 3, 6} and max(T(12) & T(18)) == 6
    assert all(len(T(p)) == 2 for p in (2, 3, 5, 7)) and len(T(1)) == 1
    assert 26 - (15 + 9 - 4) == 6
    assert 12 % 4 == 0 and 3 % 4 != 0
    assert F(3, 4) * 4 == 3
    assert F(6, 3) == 2 and F(2, 5).denominator != 1
    assert F(15, 3) == 5
    assert 2 < F(5, 2) < 3 and not 2 < F(3, 2) and not F(7, 2) < 3 and F(4, 2) == 2
    assert F(7, 2) == 3.5
    assert [k for k in range(1, 31) if k % 4 == 0] == [4, 8, 12, 16, 20, 24, 28]


Q.verify(check)
Q.save()
