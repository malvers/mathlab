#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 24 / KW 9 (LB 2): Verknuepfung von Ereignissen -
Vereinigung, Durchschnitt, Komplement, Additionssatz, Regeln von de Morgan.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=24, slug='ereignisse-verknuepfen', thema='Ereignisse verknüpfen', lb='LB 2',
          blurb='Vereinigung, Durchschnitt, Komplement, Additionssatz, Regeln von de Morgan',
          comment='Blocks: Mengenoperationen (1-6), Additionssatz (7-12), Regeln von de Morgan (13-16), Anwendungen (17-20).')

# --------------------------------------------------------- Mengenoperationen ----
Q.q(r'Was bedeutet das Ereignis $A \cup B$ in Worten?',
    [r'Mindestens eines der beiden Ereignisse tritt ein.',
     r'Beide Ereignisse treten gleichzeitig ein.',
     r'Genau eines der beiden Ereignisse tritt ein.',
     r'Keines der beiden Ereignisse tritt ein.'],
    [r'Die Vereinigung enthält alle Ergebnisse, die in $A$ oder in $B$ liegen.',
     r'Das „oder“ ist nicht ausschließend: Ergebnisse in beiden Mengen gehören dazu.',
     r'Also: $A$ tritt ein oder $B$ tritt ein oder beide.'])

Q.q(r'Was bedeutet das Ereignis $A \cap B$ in Worten?',
    [r'Beide Ereignisse treten gleichzeitig ein.',
     r'Mindestens eines tritt ein.',
     r'Genau eines tritt ein.',
     r'Keines tritt ein.'],
    [r'Der Durchschnitt enthält nur Ergebnisse, die in beiden Mengen liegen.',
     r'Ein solches Ergebnis erfüllt beide Bedingungen zugleich.',
     r'Beim Würfel: „gerade“ und „größer als $4$“ trifft nur auf die $6$ zu.'])

Q.q(r'Was beschreibt das Gegenereignis $\overline{A}$?',
    [r'alle Ergebnisse aus $\Omega$, die nicht zu $A$ gehören',
     r'alle Ergebnisse, die zu $A$ gehören',
     r'die leere Menge',
     r'die Ergebnisse mit der kleinsten Wahrscheinlichkeit'],
    [r'Das Gegenereignis heißt auch Komplement.',
     r'$\overline{A} = \Omega \setminus A$',
     r'$A$ und $\overline{A}$ ergänzen sich lückenlos zur gesamten Ergebnismenge.'])

Q.q(r'Beim Würfel sei $A = \{1;\,2;\,3\}$ und $B = \{2;\,4;\,6\}$. Wie lautet $A \cup B$?',
    [r'$\{1;\,2;\,3;\,4;\,6\}$', r'$\{2\}$', r'$\{1;\,3;\,4;\,6\}$', r'$\{1;\,2;\,3;\,4;\,5;\,6\}$'],
    [r'Alle Ergebnisse aus beiden Mengen zusammentragen.',
     r'$\{1;\,2;\,3\} \cup \{2;\,4;\,6\} = \{1;\,2;\,3;\,4;\,6\}$',
     r'Die $5$ fehlt, sie liegt in keiner der beiden Mengen. Die $2$ wird nur einmal aufgeführt.'])

Q.q(r'Mit $A = \{1;\,2;\,3\}$ und $B = \{2;\,4;\,6\}$ — wie lautet $A \cap B$?',
    [r'$\{2\}$', r'$\{1;\,3\}$', r'$\{4;\,6\}$', r'$\{\}$'],
    [r'Gesucht sind die Ergebnisse, die in beiden Mengen vorkommen.',
     r'Nur die $2$ erfüllt das.',
     r'$A \cap B = \{2\}$'])

Q.q(r'Mit $A = \{1;\,2;\,3\}$ beim Würfel — wie lautet $\overline{A}$?',
    [r'$\{4;\,5;\,6\}$', r'$\{1;\,2;\,3\}$', r'$\{\}$', r'$\{4;\,5\}$'],
    [r'$\Omega = \{1;\,2;\,3;\,4;\,5;\,6\}$',
     r'$\overline{A}$ enthält alles außer $1$, $2$ und $3$.',
     r'$\overline{A} = \{4;\,5;\,6\}$'])

# --------------------------------------------------------------- Additionssatz ----
Q.q(r'Wie lautet der Additionssatz für beliebige Ereignisse?',
    [r'$P(A \cup B) = P(A) + P(B) - P(A \cap B)$',
     r'$P(A \cup B) = P(A) + P(B)$',
     r'$P(A \cup B) = P(A) \cdot P(B)$',
     r'$P(A \cup B) = P(A) + P(B) + P(A \cap B)$'],
    [r'Addiert man einfach $P(A)$ und $P(B)$, zählt man den Überschneidungsbereich doppelt.',
     r'Deshalb wird $P(A \cap B)$ einmal abgezogen.',
     r'Bei einem Mengenbild sieht man das sofort.'])

Q.q(r'Warum muss im Additionssatz $P(A \cap B)$ abgezogen werden?',
    [r'weil die gemeinsamen Ergebnisse sonst doppelt gezählt würden',
     r'weil der Durchschnitt nie eintreten kann',
     r'weil Wahrscheinlichkeiten nicht addiert werden dürfen',
     r'weil sonst das Ergebnis negativ würde'],
    [r'Jedes Ergebnis im Durchschnitt steckt sowohl in $A$ als auch in $B$.',
     r'In der Summe $P(A) + P(B)$ ist es daher zweimal enthalten.',
     r'Das Abziehen stellt die einfache Zählung wieder her.'])

Q.q(r'Wie vereinfacht sich der Additionssatz bei unvereinbaren Ereignissen?',
    [r'$P(A \cup B) = P(A) + P(B)$', r'$P(A \cup B) = P(A) \cdot P(B)$',
     r'$P(A \cup B) = 1$', r'$P(A \cup B) = 0$'],
    [r'Unvereinbar heißt $A \cap B = \{\}$.',
     r'Dann ist $P(A \cap B) = 0$, der Korrekturterm fällt weg.',
     r'Es gibt keine Überschneidung, die doppelt gezählt werden könnte.'])

Q.q(r'Gegeben sind $P(A) = 0{,}4$, $P(B) = 0{,}3$ und $P(A \cap B) = 0{,}1$. Wie groß ist $P(A \cup B)$?',
    [r'$0{,}6$', r'$0{,}7$', r'$0{,}8$', r'$0{,}12$'],
    [r'$P(A \cup B) = 0{,}4 + 0{,}3 - 0{,}1$',
     r'$= 0{,}6$',
     r'$0{,}7$ entstünde ohne den Abzug der Überschneidung.'])

Q.q(r'Beim Würfel: wie groß ist die Wahrscheinlichkeit für „gerade Augenzahl oder Augenzahl größer als $4$“?',
    [r'$\dfrac{2}{3}$', r'$\dfrac{5}{6}$', r'$\dfrac{1}{2}$', r'$\dfrac{1}{6}$'],
    [r'$A = \{2;\,4;\,6\}$ und $B = \{5;\,6\}$, also $A \cap B = \{6\}$.',
     r'$P = \dfrac{3}{6} + \dfrac{2}{6} - \dfrac{1}{6} = \dfrac{4}{6}$',
     r'$= \dfrac{2}{3}$. Probe durch Abzählen: $A \cup B = \{2;\,4;\,5;\,6\}$, also vier von sechs.'])

Q.q(r'Aus einem Skatblatt mit $32$ Karten wird eine gezogen. Wie groß ist die Wahrscheinlichkeit für „Herz oder As“?',
    [r'$\dfrac{11}{32}$', r'$\dfrac{12}{32}$', r'$\dfrac{8}{32}$', r'$\dfrac{4}{32}$'],
    [r'Herz: $8$ Karten. Asse: $4$ Karten. Beides zugleich: das Herz-As, also $1$ Karte.',
     r'$P = \dfrac{8}{32} + \dfrac{4}{32} - \dfrac{1}{32} = \dfrac{11}{32}$',
     r'$\dfrac{12}{32}$ wäre die Antwort ohne Abzug — das Herz-As wäre doppelt gezählt.'])

# ----------------------------------------------------- Regeln von de Morgan ----
Q.q(r'Wie lautet die erste Regel von de Morgan?',
    [r'$\overline{A \cup B} = \overline{A} \cap \overline{B}$',
     r'$\overline{A \cup B} = \overline{A} \cup \overline{B}$',
     r'$\overline{A \cup B} = A \cap B$',
     r'$\overline{A \cup B} = \overline{A} + \overline{B}$'],
    [r'„Nicht (A oder B)“ bedeutet: weder $A$ noch $B$ tritt ein.',
     r'Also muss $A$ ausbleiben UND $B$ ausbleiben.',
     r'Beim Negieren wird aus „oder“ ein „und“.'])

Q.q(r'Wie lautet die zweite Regel von de Morgan?',
    [r'$\overline{A \cap B} = \overline{A} \cup \overline{B}$',
     r'$\overline{A \cap B} = \overline{A} \cap \overline{B}$',
     r'$\overline{A \cap B} = A \cup B$',
     r'$\overline{A \cap B} = \overline{A} \cdot \overline{B}$'],
    [r'„Nicht (A und B)“ bedeutet: die beiden treten nicht gemeinsam ein.',
     r'Dann fehlt mindestens eines von beiden.',
     r'Beim Negieren wird aus „und“ ein „oder“.'])

Q.q(r'Beim Würfel sei $A = \{1;\,2\}$ und $B = \{2;\,3\}$. Wie lautet $\overline{A \cup B}$?',
    [r'$\{4;\,5;\,6\}$', r'$\{1;\,3\}$', r'$\{2\}$', r'$\{1;\,2;\,3\}$'],
    [r'$A \cup B = \{1;\,2;\,3\}$',
     r'Das Komplement davon ist $\{4;\,5;\,6\}$.',
     r'Kontrolle über de Morgan: $\overline{A} = \{3;\,4;\,5;\,6\}$ und $\overline{B} = \{1;\,4;\,5;\,6\}$, ihr Durchschnitt ist $\{4;\,5;\,6\}$.'])

Q.q(r'Wie formuliert man „es trifft nicht zu, dass beide Bauteile funktionieren“ ohne Verneinung des Ganzen?',
    [r'Mindestens eines der Bauteile ist defekt.', r'Beide Bauteile sind defekt.',
     r'Genau ein Bauteil ist defekt.', r'Keines der Bauteile ist defekt.'],
    [r'Das ist die zweite Regel von de Morgan in Worten.',
     r'Die Verneinung von „beide funktionieren“ ist nicht „beide sind defekt“.',
     r'Es genügt, dass eines ausfällt.'])

# ------------------------------------------------------------- Anwendungen ----
Q.q(r'In einem Betrieb trinken $60\,\%$ Kaffee, $50\,\%$ Tee und $30\,\%$ beides. Wie viel Prozent trinken mindestens eines von beiden?',
    [r'$80\,\%$', r'$110\,\%$', r'$70\,\%$', r'$90\,\%$'],
    [r'Additionssatz: $0{,}60 + 0{,}50 - 0{,}30$',
     r'$= 0{,}80$, also $80\,\%$.',
     r'Ohne den Abzug käme $110\,\%$ heraus — unmöglich, denn Wahrscheinlichkeiten übersteigen $1$ nie.'])

Q.q(r'Wie viel Prozent trinken in der vorigen Aufgabe weder Kaffee noch Tee?',
    [r'$20\,\%$', r'$30\,\%$', r'$10\,\%$', r'$50\,\%$'],
    [r'„Weder noch“ ist das Gegenereignis zu „mindestens eines“.',
     r'$1 - 0{,}80 = 0{,}20$',
     r'Genau hier hilft de Morgan: $\overline{K \cup T} = \overline{K} \cap \overline{T}$.'])

Q.q(r'Eine Maschine hat zwei unabhängige Sicherungen. $A$ sei „Sicherung 1 löst aus“, $B$ sei „Sicherung 2 löst aus“. Welches Ereignis beschreibt „die Anlage wird geschützt, weil mindestens eine Sicherung auslöst“?',
    [r'$A \cup B$', r'$A \cap B$', r'$\overline{A} \cap \overline{B}$', r'$\overline{A \cup B}$'],
    [r'Mindestens eine bedeutet: die erste oder die zweite oder beide.',
     r'Das ist die Vereinigung $A \cup B$.',
     r'$\overline{A} \cap \overline{B}$ wäre der Fall, dass keine auslöst — der gefährliche.'])

Q.q(r'In einer Lerngruppe lernen $18$ von $25$ Personen Englisch, $10$ lernen Spanisch, $5$ lernen beides. Wie viele lernen keine der beiden Sprachen?',
    [r'$2$', r'$3$', r'$7$', r'$0$'],
    [r'Mindestens eine Sprache: $18 + 10 - 5 = 23$.',
     r'Keine der beiden: $25 - 23 = 2$.',
     r'Ohne den Abzug der $5$ Doppelten käme man auf $28$ — mehr Personen, als die Gruppe hat.'])


def check():
    from fractions import Fraction as F
    W = {1, 2, 3, 4, 5, 6}
    A, B = {1, 2, 3}, {2, 4, 6}
    assert A | B == {1, 2, 3, 4, 6} and A & B == {2} and W - A == {4, 5, 6}
    assert {2, 4, 6} & {5, 6} == {6}
    # Additionssatz
    assert F(4, 10) + F(3, 10) - F(1, 10) == F(6, 10)
    assert F(3, 6) + F(2, 6) - F(1, 6) == F(4, 6) == F(2, 3)
    assert len(({2, 4, 6} | {5, 6})) == 4
    assert F(8, 32) + F(4, 32) - F(1, 32) == F(11, 32)
    # de Morgan
    C, D = {1, 2}, {2, 3}
    assert W - (C | D) == {4, 5, 6}
    assert (W - C) & (W - D) == {4, 5, 6}
    assert W - (C & D) == (W - C) | (W - D)
    # Anwendungen
    assert F(60, 100) + F(50, 100) - F(30, 100) == F(80, 100)
    assert 1 - F(80, 100) == F(20, 100)
    assert F(60, 100) + F(50, 100) == F(110, 100) and F(110, 100) > 1
    assert 18 + 10 - 5 == 23 and 25 - 23 == 2 and 18 + 10 == 28 > 25


Q.verify(check)
Q.save()
