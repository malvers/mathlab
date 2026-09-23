#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 28 / KW 14 (LB 2): Abzaehlprobleme I -
allgemeines Zaehlprinzip, Fakultaet, Permutationen.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=28, slug='zaehlprinzip', thema='Zählprinzip und Permutationen', lb='LB 2',
          blurb='allgemeines Zählprinzip, Fakultät, Permutationen mit und ohne Wiederholung',
          comment='Blocks: Zaehlprinzip (1-6), Fakultaet (7-11), Permutationen ohne Wiederholung (12-16), mit Wiederholung (17-20).')

# ----------------------------------------------------------------- Zählprinzip ----
Q.q(r'Jemand hat $3$ Hemden und $4$ Hosen. Wie viele Kombinationen sind möglich?',
    [r'$12$', r'$7$', r'$34$', r'$24$'],
    [r'Zu jedem Hemd passt jede Hose.',
     r'$3 \cdot 4 = 12$',
     r'$7$ wäre die Summe — beim Zählprinzip wird multipliziert.'])

Q.q(r'Ein Menü besteht aus $2$ Vorspeisen, $3$ Hauptgerichten und $2$ Nachspeisen zur Wahl. Wie viele Menüs gibt es?',
    [r'$12$', r'$7$', r'$6$', r'$8$'],
    [r'Jede Stufe wird unabhängig gewählt.',
     r'$2 \cdot 3 \cdot 2 = 12$',
     r'Bei mehreren Stufen werden alle Möglichkeiten miteinander multipliziert.'])

Q.q(r'Wie viele vierstellige Geheimzahlen aus den Ziffern $0$ bis $9$ gibt es, wenn Ziffern mehrfach vorkommen dürfen?',
    [r'$10\,000$', r'$5040$', r'$40$', r'$10^3$ und damit $1000$'],
    [r'Für jede der vier Stellen gibt es $10$ Möglichkeiten.',
     r'$10^4 = 10\,000$',
     r'Auch $0000$ zählt mit.'])

Q.q(r'Ein Kennzeichen besteht aus $2$ Buchstaben (aus $26$) und danach $3$ Ziffern (aus $10$). Wie viele gibt es?',
    [r'$676\,000$', r'$67\,600$', r'$78$', r'$260\,000$'],
    [r'$26 \cdot 26$ für die Buchstaben, $10 \cdot 10 \cdot 10$ für die Ziffern.',
     r'$676 \cdot 1000 = 676\,000$',
     r'Auch hier gilt: jede Stufe multipliziert die Möglichkeiten.'])

Q.q(r'Warum werden beim Zählprinzip die Möglichkeiten multipliziert und nicht addiert?',
    [r'Weil zu jeder Wahl der ersten Stufe alle Möglichkeiten der zweiten Stufe gehören.',
     r'Weil Multiplikation immer größere Zahlen liefert.',
     r'Weil die Stufen unabhängig sind und Addition nur bei abhängigen Stufen gilt.',
     r'Weil die Reihenfolge keine Rolle spielt.'],
    [r'Im Baumdiagramm verzweigt sich jeder Ast der ersten Stufe erneut.',
     r'Bei $3$ Ästen mit je $4$ Verzweigungen entstehen $3 \cdot 4 = 12$ Pfade.',
     r'Addiert würde nur, wenn man zwischen getrennten Möglichkeiten wählt, statt sie zu kombinieren.'])

Q.q(r'Ein Zufallsversuch hat drei Stufen mit $2$, $5$ und $3$ Möglichkeiten. Wie viele Ergebnisse gibt es?',
    [r'$30$', r'$10$', r'$15$', r'$8$'],
    [r'$2 \cdot 5 \cdot 3$',
     r'$= 30$',
     r'Das Baumdiagramm hätte $30$ Blätter.'])

# -------------------------------------------------------------------- Fakultät ----
Q.q(r'Was bedeutet $5!$?',
    [r'$5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 = 120$', r'$5 \cdot 5 = 25$',
     r'$5 + 4 + 3 + 2 + 1 = 15$', r'$5 \cdot 2 = 10$'],
    [r'Die Fakultät ist das Produkt aller natürlichen Zahlen von $1$ bis $n$.',
     r'$5! = 5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 = 120$',
     r'Sie wächst sehr schnell: $10! = 3\,628\,800$.'])

Q.q(r'Welchen Wert hat $0!$?',
    [r'$1$', r'$0$', r'nicht definiert', r'unendlich'],
    [r'Die Festlegung $0! = 1$ macht die Rechenregeln lückenlos.',
     r'Zum Beispiel gilt $n! = n \cdot (n-1)!$ auch für $n = 1$: $1! = 1 \cdot 0! = 1$.',
     r'Anschaulich: es gibt genau eine Möglichkeit, nichts anzuordnen.'])

Q.q(r'Berechne $\dfrac{6!}{4!}$.',
    [r'$30$', r'$2$', r'$720$', r'$1{,}5$'],
    [r'$\dfrac{6 \cdot 5 \cdot 4!}{4!}$ — die $4!$ kürzt sich weg.',
     r'$= 6 \cdot 5 = 30$',
     r'Fakultäten werden gekürzt, nicht ausgerechnet: $\dfrac{720}{24}$ führt zwar zum selben Wert, ist aber umständlicher.'])

Q.q(r'Berechne $4!$.',
    [r'$24$', r'$12$', r'$16$', r'$10$'],
    [r'$4 \cdot 3 \cdot 2 \cdot 1$',
     r'$= 24$',
     r'Das ist zugleich die Zahl der Anordnungen von vier verschiedenen Dingen.'])

Q.q(r'Wie hängen $7!$ und $6!$ zusammen?',
    [r'$7! = 7 \cdot 6!$', r'$7! = 6! + 7$', r'$7! = 6! \cdot 6$', r'$7! = 6!^7$'],
    [r'Die Fakultät ist rekursiv aufgebaut.',
     r'$n! = n \cdot (n-1)!$',
     r'Probe: $6! = 720$ und $7! = 5040 = 7 \cdot 720$.'])

# ------------------------------------------- Permutationen ohne Wiederholung ----
Q.q(r'Auf wie viele Arten können sich $5$ Personen in einer Reihe aufstellen?',
    [r'$120$', r'$25$', r'$20$', r'$5$'],
    [r'Für den ersten Platz gibt es $5$ Personen zur Wahl, dann noch $4$, dann $3$ und so weiter.',
     r'$5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 = 5! = 120$',
     r'Eine solche Anordnung heißt Permutation.'])

Q.q(r'Auf wie viele Arten lassen sich $4$ verschiedene Bücher nebeneinander ins Regal stellen?',
    [r'$24$', r'$16$', r'$12$', r'$4$'],
    [r'$4! = 4 \cdot 3 \cdot 2 \cdot 1$',
     r'$= 24$',
     r'$16$ wäre $4^2$, das gehört zu einer anderen Fragestellung.'])

Q.q(r'Aus $5$ Personen werden $3$ ausgewählt und auf drei unterschiedliche Plätze gesetzt. Wie viele Möglichkeiten gibt es?',
    [r'$60$', r'$10$', r'$15$', r'$125$'],
    [r'Erster Platz: $5$ Möglichkeiten, zweiter: $4$, dritter: $3$.',
     r'$5 \cdot 4 \cdot 3 = 60$',
     r'Weil die Plätze unterscheidbar sind, zählt die Reihenfolge mit. Ohne Reihenfolge wären es nur $10$.'])

Q.q(r'Wie viele verschiedene Reihenfolgen gibt es für die Startläufer einer Staffel mit $4$ Personen?',
    [r'$24$', r'$4$', r'$16$', r'$6$'],
    [r'Jede Person läuft genau einmal, die Reihenfolge ist entscheidend.',
     r'$4! = 24$',
     r'Das ist dieselbe Struktur wie beim Aufstellen in einer Reihe.'])

Q.q(r'Wie viele Möglichkeiten gibt es, $6$ verschiedene Karten in eine Reihenfolge zu bringen?',
    [r'$720$', r'$36$', r'$120$', r'$64$'],
    [r'$6! = 6 \cdot 5 \cdot 4 \cdot 3 \cdot 2 \cdot 1$',
     r'$= 720$',
     r'$120$ wäre $5!$, also eine Karte zu wenig.'])

# ---------------------------------------------- Permutationen mit Wiederholung ----
Q.q(r'Wie viele verschiedene Buchstabenfolgen lassen sich aus den Buchstaben des Wortes OTTO bilden?',
    [r'$6$', r'$24$', r'$12$', r'$4$'],
    [r'Vier Buchstaben ergäben $4! = 24$ Anordnungen.',
     r'Die beiden O sind untereinander nicht unterscheidbar, die beiden T ebenfalls.',
     r'$\dfrac{4!}{2! \cdot 2!} = \dfrac{24}{4} = 6$'])

Q.q(r'Wie viele verschiedene Anordnungen gibt es für die Buchstaben des Wortes BANANE?',
    [r'$180$', r'$720$', r'$360$', r'$60$'],
    [r'Sechs Buchstaben: $6! = 720$.',
     r'A kommt zweimal vor, N ebenfalls zweimal.',
     r'$\dfrac{720}{2! \cdot 2!} = \dfrac{720}{4} = 180$'])

Q.q(r'Wie viele vierstellige Zahlen lassen sich aus den Ziffern $1$, $1$, $2$ und $3$ bilden?',
    [r'$12$', r'$24$', r'$6$', r'$4$'],
    [r'Vier Ziffern ergäben $4! = 24$ Anordnungen.',
     r'Die beiden Einsen sind nicht unterscheidbar.',
     r'$\dfrac{24}{2!} = 12$'])

Q.q(r'Warum wird bei Permutationen mit Wiederholung durch die Fakultäten der Häufigkeiten geteilt?',
    [r'Weil das Vertauschen gleicher Elemente keine neue Anordnung liefert.',
     r'Weil sonst Anordnungen fehlen würden.',
     r'Weil die Fakultät sonst zu klein wäre.',
     r'Weil gleiche Elemente doppelt gezählt werden müssen.'],
    [r'In $n!$ werden alle Elemente als unterscheidbar behandelt.',
     r'Kommen $k$ gleiche Elemente vor, so sind je $k!$ dieser Anordnungen in Wirklichkeit dieselbe.',
     r'Durch das Teilen wird diese Mehrfachzählung wieder herausgerechnet.'])


def check():
    from math import factorial as fa
    from fractions import Fraction as F
    assert 3 * 4 == 12 and 3 + 4 == 7
    assert 2 * 3 * 2 == 12
    assert 10 ** 4 == 10000 and 10 ** 3 == 1000
    assert 26 * 26 * 10 ** 3 == 676000 and 26 * 26 == 676
    assert 2 * 5 * 3 == 30
    # Fakultaet
    assert fa(5) == 120 and fa(10) == 3628800
    assert fa(0) == 1 and fa(1) == 1 * fa(0)
    assert F(fa(6), fa(4)) == 30 and 6 * 5 == 30 and fa(6) == 720 and fa(4) == 24
    assert fa(7) == 7 * fa(6) == 5040
    # Permutationen
    assert fa(5) == 120 and fa(4) == 24 and 4 ** 2 == 16
    assert 5 * 4 * 3 == 60 and F(5 * 4 * 3, fa(3)) == 10
    assert fa(6) == 720 and fa(5) == 120
    # mit Wiederholung
    assert F(fa(4), fa(2) * fa(2)) == 6
    assert len('BANANE') == 6 and 'BANANE'.count('A') == 2 and 'BANANE'.count('N') == 2
    assert F(fa(6), fa(2) * fa(2)) == 180
    assert F(fa(4), fa(2)) == 12


Q.verify(check)
Q.save()
