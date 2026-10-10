#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 16 / KW 51 (LB 3): Zufallsgrößen anschaulich –
Wiederholung Baumdiagramm und Pfadregeln, Wahrscheinlichkeitsverteilung. Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=16, slug='zufallsgroessen', thema='Zufallsgrößen', lb='LB 3',
         blurb='Pfadregeln, Augensummen, Gewinn als Zufallsgröße, Wahrscheinlichkeitsverteilung',
         comment='Blocks: basics and path rules (1-2, 8-11, 17, 19), dice sums (3-4, 13-14), random variables and distributions (5-7, 12, 15-16, 18, 20).')

Q.q(r'Wie groß ist die Wahrscheinlichkeit, mit einem fairen Würfel eine 6 zu werfen?',
    [r'$\dfrac{1}{6}$', r'$\dfrac{1}{5}$', r'$\dfrac{6}{6}$', r'$\dfrac{1}{2}$'],
    [r'Sechs gleich wahrscheinliche Ergebnisse, eines davon ist günstig.'])

Q.q(r'Eine Münze wird zweimal geworfen. Wie groß ist die Wahrscheinlichkeit für zweimal Kopf?',
    [r'$\dfrac{1}{4}$', r'$\dfrac{1}{2}$', r'$\dfrac{1}{3}$', r'1'],
    [r'Pfadregel: entlang eines Pfades multiplizieren.', r'$\dfrac{1}{2} \cdot \dfrac{1}{2} = \dfrac{1}{4}$'])

Q.q(r'Zwei Würfel werden geworfen. Wie groß ist die Wahrscheinlichkeit für die Augensumme 7?',
    [r'$\dfrac{1}{6}$', r'$\dfrac{7}{36}$', r'$\dfrac{1}{12}$', r'$\dfrac{1}{11}$'],
    [r'Es gibt $6 \cdot 6 = 36$ gleich wahrscheinliche Paare.', r'Summe 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) – sechs Paare, also $\dfrac{6}{36} = \dfrac{1}{6}$.'])

Q.q(r'Welche Werte kann die Augensumme zweier Würfel annehmen?',
    [r'alle ganzen Zahlen von 2 bis 12', r'alle ganzen Zahlen von 1 bis 12', r'alle ganzen Zahlen von 0 bis 12', r'nur gerade Zahlen'],
    [r'Kleinste Summe $1 + 1 = 2$, größte $6 + 6 = 12$, dazwischen kommt jede Zahl vor.'])

Q.q(r'Die Zufallsgröße X zählt, wie oft bei zwei Münzwürfen Kopf fällt. Wie groß ist $P(X = 1)$?',
    [r'$\dfrac{1}{2}$', r'$\dfrac{1}{4}$', r'$\dfrac{1}{3}$', r'$\dfrac{3}{4}$'],
    [r'Genau einmal Kopf: KZ oder ZK – zwei Pfade.', r'$\dfrac{1}{4} + \dfrac{1}{4} = \dfrac{1}{2}$ (Summenregel)'])

Q.q(r'Was ergibt die Summe aller Wahrscheinlichkeiten einer Wahrscheinlichkeitsverteilung?',
    [r'1', r'0', r'100', r'Das hängt vom Versuch ab.'],
    [r'Irgendein Wert tritt sicher ein.', r'Alle Wahrscheinlichkeiten zusammen ergeben 1 (also $100\,\%$).'])

Q.q(r'Bei einem Spiel zahlt man 1 € Einsatz und würfelt einmal. Bei einer 6 bekommt man 4 € ausgezahlt, sonst nichts. Welche Werte kann der Gewinn X annehmen?',
    [r'3 € und $-1$ €', r'4 € und 0 €', r'4 € und $-1$ €', r'3 € und 0 €'],
    [r'Gewinn = Auszahlung minus Einsatz.', r'Bei einer 6: $4 - 1 = 3$ €, sonst: $0 - 1 = -1$ €.'])

Q.q(r'Ein Glücksrad ist zur Hälfte rot, zu einem Viertel blau und zu einem Viertel grün. Wie groß ist die Wahrscheinlichkeit für Blau?',
    [r'0,25', r'0,5', r'0,33', r'0,75'],
    [r'Der Anteil der Fläche ist die Wahrscheinlichkeit: ein Viertel $= 0{,}25$.'])

Q.q(r'In einer Urne liegen 3 rote und 2 blaue Kugeln. Man zieht zweimal ohne Zurücklegen. Wie groß ist die Wahrscheinlichkeit für zwei rote Kugeln?',
    [r'$\dfrac{3}{10}$', r'$\dfrac{9}{25}$', r'$\dfrac{6}{5}$', r'$\dfrac{1}{2}$'],
    [r'Erste Ziehung: $\dfrac{3}{5}$. Danach sind noch 2 rote unter 4 Kugeln: $\dfrac{2}{4}$.', r'$\dfrac{3}{5} \cdot \dfrac{2}{4} = \dfrac{6}{20} = \dfrac{3}{10}$'])

Q.q(r'Dieselbe Urne (3 rot, 2 blau), aber mit Zurücklegen. Wie groß ist die Wahrscheinlichkeit für zwei rote Kugeln?',
    [r'$\dfrac{9}{25}$', r'$\dfrac{3}{10}$', r'$\dfrac{6}{25}$', r'$\dfrac{3}{5}$'],
    [r'Mit Zurücklegen bleibt die Wahrscheinlichkeit gleich: zweimal $\dfrac{3}{5}$.', r'$\dfrac{3}{5} \cdot \dfrac{3}{5} = \dfrac{9}{25}$'])

Q.q(r'Ein Würfel wird zweimal geworfen. Wie groß ist die Wahrscheinlichkeit, mindestens eine 6 zu werfen?',
    [r'$\dfrac{11}{36}$', r'$\dfrac{12}{36}$', r'$\dfrac{1}{36}$', r'$\dfrac{25}{36}$'],
    [r'Gegenereignis: keine 6, also $\dfrac{5}{6} \cdot \dfrac{5}{6} = \dfrac{25}{36}$.', r'$1 - \dfrac{25}{36} = \dfrac{11}{36}$ – nicht $\dfrac{1}{6} + \dfrac{1}{6}$, sonst zählt die Doppelsechs doppelt.'])

Q.q(r'Eine Zufallsgröße hat die Werte 0, 1 und 2 mit $P(X = 0) = 0{,}2$ und $P(X = 1) = 0{,}5$. Wie groß ist $P(X = 2)$?',
    [r'0,3', r'0,7', r'0,5', r'0,2'],
    [r'Alle Wahrscheinlichkeiten zusammen ergeben 1.', r'$1 - 0{,}2 - 0{,}5 = 0{,}3$'])

Q.q(r'Welche Augensumme ist beim Wurf mit zwei Würfeln am wahrscheinlichsten?',
    [r'7', r'12', r'6', r'Alle sind gleich wahrscheinlich.'],
    [r'Die Summe 7 entsteht aus sechs Paaren – so viele wie bei keiner anderen Summe.', r'Das Säulendiagramm der Augensummen hat bei 7 seine höchste Säule.'])

Q.q(r'Wie groß ist die Wahrscheinlichkeit für die Augensumme 2 bei zwei Würfeln?',
    [r'$\dfrac{1}{36}$', r'$\dfrac{2}{36}$', r'$\dfrac{1}{6}$', r'$\dfrac{1}{11}$'],
    [r'Nur das Paar (1,1) ergibt 2: $\dfrac{1}{36}$.'])

Q.q(r'X zählt die Sechsen bei zwei Würfen eines Würfels. Wie groß ist $P(X = 0)$?',
    [r'$\dfrac{25}{36}$', r'$\dfrac{1}{36}$', r'$\dfrac{10}{36}$', r'$\dfrac{5}{6}$'],
    [r'Zweimal keine 6: $\dfrac{5}{6} \cdot \dfrac{5}{6} = \dfrac{25}{36}$'])

Q.q(r'X zählt die Sechsen bei zwei Würfen eines Würfels. Wie groß ist $P(X = 1)$?',
    [r'$\dfrac{10}{36}$', r'$\dfrac{5}{36}$', r'$\dfrac{1}{6}$', r'$\dfrac{11}{36}$'],
    [r'Zwei Pfade: erst 6, dann nicht 6 – oder umgekehrt.', r'$\dfrac{1}{6} \cdot \dfrac{5}{6} + \dfrac{5}{6} \cdot \dfrac{1}{6} = \dfrac{10}{36}$', r'Kontrolle: $\dfrac{25}{36} + \dfrac{10}{36} + \dfrac{1}{36} = 1$'])

Q.q(r'Wie viel Prozent sind $\dfrac{1}{8}$?',
    [r'12,5 %', r'8 %', r'18 %', r'0,125 %'],
    [r'$1 : 8 = 0{,}125 = 12{,}5\,\%$'])

Q.q(r'An einer Losbude gibt es 100 Lose zu je 1 €, darunter 5 Gewinne von 10 €. Wie groß ist die Wahrscheinlichkeit, mit einem Los 9 € Gewinn zu machen?',
    [r'0,05', r'0,1', r'0,09', r'0,5'],
    [r'9 € Gewinn heißt: einen 10-€-Gewinn ziehen (10 € minus 1 € Einsatz).', r'$\dfrac{5}{100} = 0{,}05$'])

Q.q(r'Bei einer Tombola gibt es 200 Lose, davon sind 20 Gewinnlose. Wie groß ist die Gewinnchance für ein Los?',
    [r'10 %', r'20 %', r'2 %', r'5 %'],
    [r'$\dfrac{20}{200} = \dfrac{1}{10} = 10\,\%$'])

Q.q(r'Was beschreibt eine Zufallsgröße?',
    [r'Sie ordnet jedem Ergebnis eines Zufallsversuchs eine Zahl zu.', r'Sie gibt an, wie oft man einen Versuch wiederholt.',
     r'Sie ist immer die Wahrscheinlichkeit eines Ergebnisses.', r'Sie ist eine Zahl, die vom Zufall nicht abhängt.'],
    [r'Beispiele: die Augensumme, die Anzahl der Treffer, der Gewinn in Euro.', r'Ihr Wert hängt vom Ausgang des Zufallsversuchs ab.'])


def check():
    from fractions import Fraction as F
    from itertools import product
    pairs = list(product(range(1, 7), repeat=2))
    assert F(sum(1 for a, b in pairs if a + b == 7), 36) == F(1, 6)
    assert sorted({a + b for a, b in pairs}) == list(range(2, 13))
    assert F(1, 2) * F(1, 2) == F(1, 4) and 2 * F(1, 4) == F(1, 2)
    assert 4 - 1 == 3 and 0 - 1 == -1
    assert F(3, 5) * F(2, 4) == F(3, 10) and F(3, 5) ** 2 == F(9, 25)
    assert 1 - F(5, 6) ** 2 == F(11, 36)
    assert round(1 - 0.2 - 0.5, 9) == 0.3
    counts = {s: sum(1 for a, b in pairs if a + b == s) for s in range(2, 13)}
    assert max(counts, key=counts.get) == 7 and counts[2] == 1
    p0, p1, p2 = F(5, 6) ** 2, 2 * F(1, 6) * F(5, 6), F(1, 36)
    assert p0 == F(25, 36) and p1 == F(10, 36) and p0 + p1 + p2 == 1
    assert F(1, 8) == F(125, 1000)
    assert F(5, 100) == F(1, 20) and F(20, 200) == F(1, 10)


Q.verify(check)
Q.save()
