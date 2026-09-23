#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 30 / KW 16 (LB 2): Urnenmodell - die vier Grundfaelle
und Wahrscheinlichkeiten beim Ziehen. Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=30, slug='urnenmodell', thema='Das Urnenmodell', lb='LB 2',
          blurb='die vier Grundfälle, Anzahlen bestimmen, Wahrscheinlichkeiten beim Ziehen',
          comment='Blocks: die vier Grundfaelle (1-6), Anzahlen bestimmen (7-12), Wahrscheinlichkeiten (13-17), reale Aufgaben uebertragen (18-20). Urne in Block 3: 4 rote und 6 blaue Kugeln.')

# ------------------------------------------------------- die vier Grundfälle ----
Q.q(r'Wodurch unterscheiden sich die vier Grundfälle des Urnenmodells?',
    [r'durch Ziehen mit oder ohne Zurücklegen und mit oder ohne Beachtung der Reihenfolge',
     r'durch die Anzahl der Kugeln und ihre Farbe',
     r'durch die Größe der Urne und die Zahl der Züge',
     r'durch die Wahrscheinlichkeit der einzelnen Kugeln'],
    [r'Zwei Fragen sind zu klären: kommt die Kugel zurück, und zählt die Reihenfolge?',
     r'Jede Frage hat zwei Antworten, das ergibt vier Fälle.',
     r'Die Antwort auf beide Fragen entscheidet über die Formel.'])

Q.q(r'Wie viele Möglichkeiten gibt es beim Ziehen von $k$ aus $n$ Kugeln MIT Zurücklegen und MIT Beachtung der Reihenfolge?',
    [r'$n^k$', r'$\dfrac{n!}{(n-k)!}$', r'$\binom{n}{k}$', r'$k^n$'],
    [r'Vor jedem Zug ist die Urne wieder vollständig.',
     r'Für jeden der $k$ Züge gibt es also $n$ Möglichkeiten.',
     r'$n \cdot n \cdot \ldots \cdot n = n^k$'])

Q.q(r'Wie viele Möglichkeiten gibt es beim Ziehen von $k$ aus $n$ Kugeln OHNE Zurücklegen und MIT Beachtung der Reihenfolge?',
    [r'$\dfrac{n!}{(n-k)!}$', r'$n^k$', r'$\binom{n}{k}$', r'$n!$'],
    [r'Im ersten Zug $n$ Möglichkeiten, dann $n-1$, dann $n-2$ und so weiter.',
     r'Das Produkt der ersten $k$ absteigenden Faktoren ist $\dfrac{n!}{(n-k)!}$.',
     r'Dieser Fall heißt Variation ohne Wiederholung.'])

Q.q(r'Wie viele Möglichkeiten gibt es beim Ziehen von $k$ aus $n$ Kugeln OHNE Zurücklegen und OHNE Beachtung der Reihenfolge?',
    [r'$\binom{n}{k}$', r'$n^k$', r'$\dfrac{n!}{(n-k)!}$', r'$k!$'],
    [r'Man nimmt die Zahl mit Reihenfolge und teilt durch $k!$.',
     r'$\dfrac{n!}{(n-k)!\,k!} = \binom{n}{k}$',
     r'Dieser Fall heißt Kombination ohne Wiederholung und ist der häufigste in Aufgaben.'])

Q.q(r'Welchem Grundfall entspricht die Ziehung der Lottozahlen?',
    [r'ohne Zurücklegen, ohne Beachtung der Reihenfolge',
     r'mit Zurücklegen, mit Beachtung der Reihenfolge',
     r'ohne Zurücklegen, mit Beachtung der Reihenfolge',
     r'mit Zurücklegen, ohne Beachtung der Reihenfolge'],
    [r'Eine gezogene Kugel bleibt draußen.',
     r'Für den Gewinn ist gleichgültig, in welcher Reihenfolge die Zahlen kamen.',
     r'Also $\binom{49}{6}$ Möglichkeiten.'])

Q.q(r'Welchem Grundfall entspricht die Eingabe einer vierstelligen Geheimzahl?',
    [r'mit Zurücklegen, mit Beachtung der Reihenfolge',
     r'ohne Zurücklegen, ohne Beachtung der Reihenfolge',
     r'ohne Zurücklegen, mit Beachtung der Reihenfolge',
     r'mit Zurücklegen, ohne Beachtung der Reihenfolge'],
    [r'Ziffern dürfen sich wiederholen, also mit Zurücklegen.',
     r'$1234$ und $4321$ sind verschiedene Geheimzahlen, die Reihenfolge zählt.',
     r'$10^4 = 10\,000$ Möglichkeiten.'])

# ---------------------------------------------------------- Anzahlen bestimmen ----
Q.q(r'Aus einer Urne mit $10$ Kugeln werden $3$ ohne Zurücklegen und ohne Beachtung der Reihenfolge gezogen. Wie viele Möglichkeiten gibt es?',
    [r'$120$', r'$720$', r'$1000$', r'$30$'],
    [r'$\binom{10}{3} = \dfrac{10 \cdot 9 \cdot 8}{3 \cdot 2 \cdot 1}$',
     r'$= 120$',
     r'Das ist der kleinste der drei Werte — ohne Reihenfolge fallen die meisten Fälle zusammen.'])

Q.q(r'Dieselbe Urne, $3$ Kugeln ohne Zurücklegen, aber MIT Beachtung der Reihenfolge. Wie viele Möglichkeiten gibt es?',
    [r'$720$', r'$120$', r'$1000$', r'$30$'],
    [r'$10 \cdot 9 \cdot 8$',
     r'$= 720$',
     r'Jede der $120$ Auswahlen lässt sich auf $3! = 6$ Arten anordnen: $120 \cdot 6 = 720$.'])

Q.q(r'Dieselbe Urne, $3$ Kugeln MIT Zurücklegen und mit Beachtung der Reihenfolge. Wie viele Möglichkeiten gibt es?',
    [r'$1000$', r'$720$', r'$120$', r'$30$'],
    [r'Für jeden Zug stehen wieder alle $10$ Kugeln bereit.',
     r'$10^3 = 1000$',
     r'Das ist der größte der drei Werte.'])

Q.q(r'Aus $5$ Kugeln werden $2$ ohne Zurücklegen mit Beachtung der Reihenfolge gezogen. Wie viele Möglichkeiten gibt es?',
    [r'$20$', r'$10$', r'$25$', r'$120$'],
    [r'$5 \cdot 4 = 20$',
     r'Ohne Reihenfolge wären es $\binom{5}{2} = 10$.',
     r'Mit Zurücklegen und Reihenfolge wären es $5^2 = 25$.'])

Q.q(r'Warum gibt es ohne Beachtung der Reihenfolge immer weniger Möglichkeiten?',
    [r'Weil mehrere Reihenfolgen derselben Auswahl zu einem einzigen Fall zusammenfallen.',
     r'Weil weniger Kugeln gezogen werden.',
     r'Weil die Urne kleiner wird.',
     r'Weil nur die erste Kugel zählt.'],
    [r'Die Auswahlen $\{1;\,2;\,3\}$ und $\{3;\,1;\,2\}$ sind dieselbe Menge.',
     r'Mit Reihenfolge werden sie getrennt gezählt, ohne Reihenfolge nur einmal.',
     r'Deshalb wird durch $k!$ geteilt.'])

Q.q(r'Um welchen Faktor unterscheiden sich die Anzahlen mit und ohne Beachtung der Reihenfolge beim Ziehen von $4$ Kugeln?',
    [r'um den Faktor $24$', r'um den Faktor $4$', r'um den Faktor $16$', r'um den Faktor $12$'],
    [r'Jede Auswahl von $4$ Elementen lässt sich auf $4!$ Arten anordnen.',
     r'$4! = 24$',
     r'Also ist die Zahl mit Reihenfolge $24$-mal so groß.'])

# ------------------------------------------------------- Wahrscheinlichkeiten ----
Q.q(r'Eine Urne enthält $4$ rote und $6$ blaue Kugeln. Zwei werden ohne Zurücklegen gezogen. Wie groß ist die Wahrscheinlichkeit für zwei rote?',
    [r'$\dfrac{2}{15}$', r'$\dfrac{4}{25}$', r'$\dfrac{1}{3}$', r'$\dfrac{8}{15}$'],
    [r'Günstig: $\binom{4}{2} = 6$. Möglich: $\binom{10}{2} = 45$.',
     r'$P = \dfrac{6}{45} = \dfrac{2}{15}$',
     r'Über das Baumdiagramm: $\dfrac{4}{10} \cdot \dfrac{3}{9} = \dfrac{12}{90} = \dfrac{2}{15}$ — dasselbe Ergebnis.'])

Q.q(r'Dieselbe Urne: wie groß ist die Wahrscheinlichkeit für zwei blaue Kugeln?',
    [r'$\dfrac{1}{3}$', r'$\dfrac{2}{15}$', r'$\dfrac{8}{15}$', r'$\dfrac{9}{25}$'],
    [r'Günstig: $\binom{6}{2} = 15$. Möglich: $45$.',
     r'$P = \dfrac{15}{45} = \dfrac{1}{3}$',
     r'Probe über den Baum: $\dfrac{6}{10} \cdot \dfrac{5}{9} = \dfrac{30}{90} = \dfrac{1}{3}$.'])

Q.q(r'Dieselbe Urne: wie groß ist die Wahrscheinlichkeit für genau eine rote Kugel?',
    [r'$\dfrac{8}{15}$', r'$\dfrac{2}{15}$', r'$\dfrac{1}{3}$', r'$\dfrac{4}{15}$'],
    [r'Günstig: eine rote aus $4$ und eine blaue aus $6$, also $\binom{4}{1} \cdot \binom{6}{1} = 24$.',
     r'$P = \dfrac{24}{45} = \dfrac{8}{15}$',
     r'Kontrolle: $\dfrac{2}{15} + \dfrac{1}{3} + \dfrac{8}{15} = \dfrac{2 + 5 + 8}{15} = 1$.'])

Q.q(r'Dieselbe Urne, aber zwei Züge MIT Zurücklegen. Wie groß ist die Wahrscheinlichkeit für zwei rote?',
    [r'$\dfrac{4}{25}$', r'$\dfrac{2}{15}$', r'$\dfrac{1}{3}$', r'$\dfrac{12}{90}$ und damit $\dfrac{2}{15}$'],
    [r'Mit Zurücklegen bleibt $P(\text{rot}) = \dfrac{4}{10} = \dfrac{2}{5}$.',
     r'$P = \dfrac{2}{5} \cdot \dfrac{2}{5} = \dfrac{4}{25}$',
     r'Etwas mehr als ohne Zurücklegen — dort fehlt beim zweiten Zug eine rote Kugel.'])

Q.q(r'Wie hängen die beiden Rechenwege — Baumdiagramm und Binomialkoeffizienten — zusammen?',
    [r'Sie führen zum selben Ergebnis; der Baum rechnet mit Reihenfolge, die Koeffizienten ohne.',
     r'Der Baum ist immer ungenauer.',
     r'Die Koeffizienten gelten nur mit Zurücklegen.',
     r'Sie liefern grundsätzlich verschiedene Werte.'],
    [r'Im Baum zählt man Pfade, also Reihenfolgen, und addiert sie.',
     r'Mit Binomialkoeffizienten zählt man Auswahlen ohne Reihenfolge.',
     r'Weil in Zähler und Nenner dieselbe Reihenfolge-Zählung steckt, kürzt sie sich heraus.'])

# ------------------------------------------------- reale Aufgaben übertragen ----
Q.q(r'Eine Lieferung von $20$ Teilen enthält $3$ fehlerhafte. Zwei Teile werden zufällig geprüft. Wie groß ist die Wahrscheinlichkeit, dass beide in Ordnung sind?',
    [r'$\dfrac{68}{95}$', r'$\dfrac{17}{20}$', r'$\dfrac{3}{190}$', r'$\dfrac{289}{400}$'],
    [r'Günstig: $\binom{17}{2} = 136$. Möglich: $\binom{20}{2} = 190$.',
     r'$P = \dfrac{136}{190} = \dfrac{68}{95}$',
     r'Das sind rund $71{,}6\,\%$.'])

Q.q(r'Aus einem Skatblatt mit $32$ Karten, darunter $4$ Asse, werden zwei Karten gezogen. Wie groß ist die Wahrscheinlichkeit für zwei Asse?',
    [r'$\dfrac{3}{248}$', r'$\dfrac{1}{64}$', r'$\dfrac{1}{8}$', r'$\dfrac{6}{32}$'],
    [r'Günstig: $\binom{4}{2} = 6$. Möglich: $\binom{32}{2} = 496$.',
     r'$P = \dfrac{6}{496} = \dfrac{3}{248}$',
     r'Das sind rund $1{,}2\,\%$.'])

Q.q(r'Welche Größen muss man einer Textaufgabe entnehmen, um sie als Urnenmodell zu behandeln?',
    [r'die Gesamtzahl, die Zahl der Züge und ob mit Zurücklegen und mit Reihenfolge gezogen wird',
     r'nur die Gesamtzahl der Elemente',
     r'nur die Zahl der günstigen Fälle',
     r'die Wahrscheinlichkeit jedes einzelnen Elements'],
    [r'Die Gesamtzahl $n$ und die Zahl der Züge $k$ legen die Größenordnung fest.',
     r'Die beiden Ja-oder-Nein-Fragen entscheiden über die Formel.',
     r'Erst danach wird gerechnet — das Übersetzen ist der eigentliche Schritt.'])


def check():
    from math import comb, factorial as fa
    from fractions import Fraction as F
    assert 10 ** 4 == 10000 and comb(49, 6) == 13983816
    # Anzahlen
    assert comb(10, 3) == 120 and 10 * 9 * 8 == 720 and 10 ** 3 == 1000
    assert 120 * fa(3) == 720
    assert 5 * 4 == 20 and comb(5, 2) == 10 and 5 ** 2 == 25
    assert fa(4) == 24
    # Wahrscheinlichkeiten, Urne 4 rot + 6 blau
    assert comb(10, 2) == 45 and comb(4, 2) == 6 and comb(6, 2) == 15 and comb(4, 1) * comb(6, 1) == 24
    assert 6 + 15 + 24 == 45
    assert F(6, 45) == F(2, 15) and F(4, 10) * F(3, 9) == F(2, 15)
    assert F(15, 45) == F(1, 3) and F(6, 10) * F(5, 9) == F(1, 3)
    assert F(24, 45) == F(8, 15)
    assert F(2, 15) + F(1, 3) + F(8, 15) == 1
    assert F(4, 10) * F(4, 10) == F(4, 25) and F(4, 25) > F(2, 15)
    # reale Aufgaben
    assert comb(17, 2) == 136 and comb(20, 2) == 190 and F(136, 190) == F(68, 95)
    assert abs(float(F(68, 95)) - 0.716) < 0.0005
    assert comb(32, 2) == 496 and F(6, 496) == F(3, 248)
    assert abs(float(F(3, 248)) - 0.012) < 0.0005


Q.verify(check)
Q.save()
