#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 22 / KW 5 (LB 2): Zufallsexperimente - Ergebnis,
Ergebnismenge, Ereignis, Ereignismenge. Beginn des Lernbereichs 2.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=22, slug='zufallsexperimente', thema='Zufallsexperimente und Ereignisse', lb='LB 2',
          blurb='Ergebnis und Ergebnismenge, Ereignis und Ereignismenge, ein- und mehrstufige Versuche',
          comment='Blocks: Grundbegriffe (1-6), Ergebnismengen bestimmen (7-12), Ereignisse beschreiben (13-17), mehrstufige Versuche (18-20).')

# ------------------------------------------------------------ Grundbegriffe ----
Q.q(r'Was kennzeichnet ein Zufallsexperiment?',
    [r'Es ist beliebig oft wiederholbar, und sein Ausgang steht vorher nicht fest, ist aber bekannt.',
     r'Sein Ausgang lässt sich vorher berechnen.',
     r'Es kann nur einmal durchgeführt werden.',
     r'Es hat immer genau zwei mögliche Ausgänge.'],
    [r'Alle möglichen Ausgänge müssen vorher bekannt sein.',
     r'Welcher davon eintritt, entscheidet der Zufall.',
     r'Unter gleichen Bedingungen ist der Versuch beliebig oft wiederholbar.'])

Q.q(r'Was ist ein Ergebnis eines Zufallsexperiments?',
    [r'ein einzelner möglicher Ausgang des Versuchs',
     r'eine Zusammenfassung mehrerer Ausgänge',
     r'die Wahrscheinlichkeit eines Ausgangs',
     r'die Anzahl der Versuche'],
    [r'Das Ergebnis ist der konkrete Ausgang, etwa die gewürfelte $3$.',
     r'Alle Ergebnisse zusammen bilden die Ergebnismenge $\Omega$.',
     r'Eine Zusammenfassung mehrerer Ergebnisse heißt dagegen Ereignis.'])

Q.q(r'Was ist ein Ereignis?',
    [r'eine Teilmenge der Ergebnismenge', r'ein einzelnes Ergebnis',
     r'die Ergebnismenge selbst', r'die Wahrscheinlichkeit eines Ergebnisses'],
    [r'Ein Ereignis fasst Ergebnisse zusammen, die eine gemeinsame Eigenschaft haben.',
     r'Beispiel beim Würfel: „gerade Augenzahl“ ist die Menge $\{2;\,4;\,6\}$.',
     r'Jede Teilmenge von $\Omega$ ist ein Ereignis, auch die leere Menge und $\Omega$ selbst.'])

Q.q(r'Wie viele Elemente hat die Ergebnismenge beim einmaligen Werfen eines Würfels?',
    [r'sechs', r'zwei', r'zwölf', r'eins'],
    [r'$\Omega = \{1;\,2;\,3;\,4;\,5;\,6\}$',
     r'Jede Augenzahl ist ein mögliches Ergebnis.',
     r'Also sechs Elemente.'])

Q.q(r'Was bedeutet das sichere Ereignis?',
    [r'Es tritt bei jedem Versuch ein und entspricht der gesamten Ergebnismenge $\Omega$.',
     r'Es tritt nie ein.', r'Es ist das wahrscheinlichste einzelne Ergebnis.',
     r'Es besteht aus genau einem Ergebnis.'],
    [r'Das sichere Ereignis enthält alle möglichen Ergebnisse.',
     r'Beim Würfel wäre das „eine Augenzahl zwischen $1$ und $6$“.',
     r'Sein Gegenstück ist das unmögliche Ereignis, die leere Menge.'])

Q.q(r'Beim Würfeln sei $A$ das Ereignis „Augenzahl größer als $4$“. Wie lautet $A$ als Menge?',
    [r'$A = \{5;\,6\}$', r'$A = \{4;\,5;\,6\}$', r'$A = \{1;\,2;\,3;\,4\}$', r'$A = \{6\}$'],
    [r'Größer als $4$ bedeutet ab $5$ aufwärts.',
     r'$A = \{5;\,6\}$',
     r'Die $4$ selbst gehört nicht dazu — bei „mindestens $4$“ wäre sie dabei.'])

# ------------------------------------------------- Ergebnismengen bestimmen ----
Q.q(r'Wie lautet die Ergebnismenge beim einmaligen Werfen einer Münze?',
    [r'$\Omega = \{\text{Kopf};\,\text{Zahl}\}$', r'$\Omega = \{\text{Kopf}\}$',
     r'$\Omega = \{1;\,2\}$',
     r'$\Omega = \{0;\,1;\,2\}$'],
    [r'Eine Münze hat zwei unterscheidbare Seiten.',
     r'$\Omega = \{\text{Kopf};\,\text{Zahl}\}$',
     r'Dass beide gleich wahrscheinlich sind, ist eine zusätzliche Annahme und gehört nicht in die Ergebnismenge.'])

Q.q(r'Wie viele Ergebnisse hat der zweimalige Münzwurf, wenn die Reihenfolge beachtet wird?',
    [r'vier', r'zwei', r'drei', r'acht'],
    [r'Für jeden der beiden Würfe gibt es zwei Möglichkeiten.',
     r'$2 \cdot 2 = 4$',
     r'$\Omega = \{\text{KK};\,\text{KZ};\,\text{ZK};\,\text{ZZ}\}$ — KZ und ZK sind verschiedene Ergebnisse.'])

Q.q(r'Wie viele Ergebnisse hat das zweimalige Werfen eines Würfels, wenn die Reihenfolge beachtet wird?',
    [r'$36$', r'$12$', r'$21$', r'$6$'],
    [r'Allgemeines Zählprinzip: $6$ Möglichkeiten im ersten Wurf, $6$ im zweiten.',
     r'$6 \cdot 6 = 36$',
     r'$12$ wäre die Summe statt des Produkts.'])

Q.q(r'Aus einer Urne mit den Kugeln $1$, $2$ und $3$ wird zweimal MIT Zurücklegen gezogen. Wie viele Ergebnisse gibt es bei Beachtung der Reihenfolge?',
    [r'$9$', r'$6$', r'$3$', r'$12$'],
    [r'Nach jedem Zug ist die Urne wieder vollständig.',
     r'$3 \cdot 3 = 9$',
     r'Ohne Zurücklegen wären es nur $3 \cdot 2 = 6$.'])

Q.q(r'Dieselbe Urne, aber zweimal OHNE Zurücklegen. Wie viele Ergebnisse gibt es bei Beachtung der Reihenfolge?',
    [r'$6$', r'$9$', r'$3$', r'$2$'],
    [r'Im ersten Zug drei Möglichkeiten, im zweiten nur noch zwei.',
     r'$3 \cdot 2 = 6$',
     r'Die gezogene Kugel fehlt beim zweiten Zug.'])

Q.q(r'Beim zweimaligen Würfeln werden die Augenzahlen addiert. Wie lautet die Ergebnismenge der Summe?',
    [r'$\Omega = \{2;\,3;\,4;\,\ldots;\,12\}$', r'$\Omega = \{1;\,2;\,\ldots;\,12\}$',
     r'$\Omega = \{0;\,1;\,\ldots;\,12\}$', r'$\Omega = \{2;\,4;\,6;\,8;\,10;\,12\}$'],
    [r'Die kleinste Summe ist $1 + 1 = 2$, die größte $6 + 6 = 12$.',
     r'Jede Zahl dazwischen ist erreichbar.',
     r'Achtung: diese elf Ergebnisse sind nicht gleich wahrscheinlich — die $7$ kommt am häufigsten vor.'])

# ------------------------------------------------- Ereignisse beschreiben ----
Q.q(r'Beim Würfeln sei $B$ das Ereignis „gerade Augenzahl“. Wie lautet das Gegenereignis $\overline{B}$?',
    [r'$\overline{B} = \{1;\,3;\,5\}$', r'$\overline{B} = \{2;\,4;\,6\}$',
     r'$\overline{B} = \{\}$', r'$\overline{B} = \{1;\,2;\,3\}$'],
    [r'$B = \{2;\,4;\,6\}$',
     r'Das Gegenereignis enthält alle Ergebnisse aus $\Omega$, die nicht in $B$ liegen.',
     r'$\overline{B} = \{1;\,3;\,5\}$, also die ungeraden Augenzahlen.'])

Q.q(r'Beim Würfeln sei $A = \{1;\,2;\,3\}$ und $B = \{3;\,4\}$. Wie lautet $A \cup B$?',
    [r'$\{1;\,2;\,3;\,4\}$', r'$\{3\}$', r'$\{1;\,2;\,4\}$', r'$\{1;\,2;\,3;\,3;\,4\}$'],
    [r'Die Vereinigung enthält alle Ergebnisse, die in $A$ oder in $B$ liegen.',
     r'$A \cup B = \{1;\,2;\,3;\,4\}$',
     r'Die $3$ steht in einer Menge nur einmal, auch wenn sie in beiden vorkommt.'])

Q.q(r'Mit $A = \{1;\,2;\,3\}$ und $B = \{3;\,4\}$ — wie lautet $A \cap B$?',
    [r'$\{3\}$', r'$\{1;\,2;\,3;\,4\}$', r'$\{\}$', r'$\{1;\,2;\,4\}$'],
    [r'Der Durchschnitt enthält die Ergebnisse, die in beiden Mengen liegen.',
     r'Nur die $3$ kommt in $A$ und in $B$ vor.',
     r'$A \cap B = \{3\}$'])

Q.q(r'Wann heißen zwei Ereignisse unvereinbar?',
    [r'wenn ihr Durchschnitt leer ist, sie also nie gemeinsam eintreten',
     r'wenn ihre Vereinigung ganz $\Omega$ ist',
     r'wenn sie gleich wahrscheinlich sind',
     r'wenn eines das Gegenereignis des anderen ist'],
    [r'Unvereinbar heißt: kein Ergebnis gehört zu beiden Ereignissen.',
     r'In Mengenschreibweise $A \cap B = \{\}$.',
     r'Beim Würfel sind „Augenzahl kleiner als $3$“ und „Augenzahl größer als $4$“ unvereinbar.'])

Q.q(r'Ein Ereignis $A$ hat $4$ Elemente, $\Omega$ hat $10$. Wie viele Elemente hat $\overline{A}$?',
    [r'$6$', r'$4$', r'$10$', r'$14$'],
    [r'Das Gegenereignis enthält alles, was nicht in $A$ liegt.',
     r'$10 - 4 = 6$',
     r'Zusammen ergeben $A$ und $\overline{A}$ immer die ganze Ergebnismenge.'])

# --------------------------------------------------- mehrstufige Versuche ----
Q.q(r'Ein Versuch besteht aus dem Werfen einer Münze und dem anschließenden Würfeln. Wie viele Ergebnisse hat er?',
    [r'$12$', r'$8$', r'$6$', r'$36$'],
    [r'Zählprinzip: $2$ Möglichkeiten bei der Münze, $6$ beim Würfel.',
     r'$2 \cdot 6 = 12$',
     r'Bei mehrstufigen Versuchen werden die Möglichkeiten der Stufen multipliziert, nicht addiert.'])

Q.q(r'Wie stellt man einen mehrstufigen Zufallsversuch übersichtlich dar?',
    [r'als Baumdiagramm, mit einer Stufe je Verzweigungsebene',
     r'als Säulendiagramm', r'als Wertetabelle einer Funktion', r'als Koordinatensystem'],
    [r'Jede Stufe des Versuchs entspricht einer Ebene des Baumes.',
     r'Ein Pfad von der Wurzel bis zu einem Blatt ist genau ein Ergebnis des Gesamtversuchs.',
     r'Die Zahl der Blätter ist damit die Zahl der Ergebnisse.'])

Q.q(r'Aus einer Urne mit $2$ roten und $3$ blauen Kugeln wird einmal gezogen. Wie viele Elemente hat die Ergebnismenge, wenn nur die Farbe interessiert?',
    [r'zwei', r'fünf', r'sechs', r'drei'],
    [r'Interessiert nur die Farbe, gibt es die Ausgänge rot und blau.',
     r'$\Omega = \{\text{rot};\,\text{blau}\}$, also zwei Elemente.',
     r'Sie sind aber nicht gleich wahrscheinlich: drei der fünf Kugeln sind blau. Die Zahl der Ergebnisse sagt nichts über ihre Wahrscheinlichkeit.'])


def check():
    from fractions import Fraction as F
    W = {1, 2, 3, 4, 5, 6}
    assert len(W) == 6
    assert {z for z in W if z > 4} == {5, 6}
    assert {z for z in W if z % 2 == 0} == {2, 4, 6}
    assert W - {2, 4, 6} == {1, 3, 5}
    A, B = {1, 2, 3}, {3, 4}
    assert A | B == {1, 2, 3, 4} and A & B == {3}
    assert {1, 2} & {5, 6} == set()
    assert 10 - 4 == 6
    # Zaehlprinzip
    assert 2 * 2 == 4 and 6 * 6 == 36 and 6 + 6 == 12
    assert 3 * 3 == 9 and 3 * 2 == 6
    assert 2 * 6 == 12
    summen = {i + j for i in W for j in W}
    assert summen == set(range(2, 13)) and len(summen) == 11
    haeufig = {}
    for i in W:
        for j in W:
            haeufig[i + j] = haeufig.get(i + j, 0) + 1
    assert max(haeufig, key=haeufig.get) == 7 and haeufig[7] == 6 and haeufig[2] == 1
    # Urne
    assert len({'rot', 'blau'}) == 2 and F(3, 5) != F(1, 2)


Q.verify(check)
Q.save()
