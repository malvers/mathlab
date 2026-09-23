#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 29 / KW 15 (LB 2): Abzaehlprobleme II -
Kombination und Variation, Binomialkoeffizient.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=29, slug='kombination-variation', thema='Kombination und Variation', lb='LB 2',
          blurb='Reihenfolge oder nicht, Binomialkoeffizient, Auswahlprobleme',
          comment='Blocks: Unterscheidung Kombination und Variation (1-5), Binomialkoeffizient (6-11), Kombinationen anwenden (12-16), Variationen und Anwendungen (17-20).')

# ------------------------------------- Unterscheidung Kombination und Variation ----
Q.q(r'Worin unterscheiden sich Kombination und Variation?',
    [r'Bei der Variation kommt es auf die Reihenfolge an, bei der Kombination nicht.',
     r'Bei der Kombination kommt es auf die Reihenfolge an, bei der Variation nicht.',
     r'Die Variation erlaubt Wiederholungen, die Kombination nie.',
     r'Sie bedeuten dasselbe.'],
    [r'Beide beschreiben die Auswahl von $k$ aus $n$ Elementen.',
     r'Entscheidend ist die Frage: ändert eine andere Reihenfolge das Ergebnis?',
     r'Wenn ja, ist es eine Variation; wenn nein, eine Kombination.'])

Q.q(r'Beim Lotto werden $6$ aus $49$ Kugeln gezogen. Welcher Fall liegt vor?',
    [r'Kombination ohne Wiederholung', r'Variation ohne Wiederholung',
     r'Variation mit Wiederholung', r'Permutation'],
    [r'Eine gezogene Kugel kommt nicht zurück, also ohne Wiederholung.',
     r'Die Reihenfolge der Ziehung ist für den Gewinn ohne Bedeutung.',
     r'Also eine Kombination ohne Wiederholung.'])

Q.q(r'Ein Zahlenschloss verlangt drei Ziffern in der richtigen Reihenfolge, Ziffern dürfen sich wiederholen. Welcher Fall liegt vor?',
    [r'Variation mit Wiederholung', r'Kombination ohne Wiederholung',
     r'Kombination mit Wiederholung', r'Permutation'],
    [r'$1$-$2$-$3$ öffnet das Schloss, $3$-$2$-$1$ nicht — die Reihenfolge zählt.',
     r'Ziffern dürfen mehrfach vorkommen.',
     r'Also Variation mit Wiederholung; die Zahl der Möglichkeiten ist $10^3 = 1000$.'])

Q.q(r'Bei einem Wettkampf werden aus $8$ Teilnehmenden die drei Podestplätze vergeben. Welcher Fall liegt vor?',
    [r'Variation ohne Wiederholung', r'Kombination ohne Wiederholung',
     r'Variation mit Wiederholung', r'Permutation aller Teilnehmenden'],
    [r'Gold, Silber und Bronze sind unterscheidbar, die Reihenfolge zählt also.',
     r'Niemand kann zwei Plätze belegen, daher ohne Wiederholung.',
     r'Variation ohne Wiederholung: $8 \cdot 7 \cdot 6 = 336$ Möglichkeiten.'])

Q.q(r'Aus $10$ Personen wird eine dreiköpfige Arbeitsgruppe gebildet. Welcher Fall liegt vor?',
    [r'Kombination ohne Wiederholung', r'Variation ohne Wiederholung',
     r'Variation mit Wiederholung', r'Permutation'],
    [r'In der Gruppe gibt es keine unterscheidbaren Rollen.',
     r'Ob jemand zuerst oder zuletzt ausgewählt wurde, ändert die Gruppe nicht.',
     r'Also eine Kombination ohne Wiederholung.'])

# --------------------------------------------------------- Binomialkoeffizient ----
Q.q(r'Wie ist der Binomialkoeffizient $\binom{n}{k}$ definiert?',
    [r'$\binom{n}{k} = \dfrac{n!}{k!\,(n-k)!}$', r'$\binom{n}{k} = \dfrac{n!}{k!}$',
     r'$\binom{n}{k} = n! \cdot k!$', r'$\binom{n}{k} = \dfrac{k!}{n!}$'],
    [r'Er gibt die Zahl der Kombinationen von $k$ aus $n$ Elementen ohne Wiederholung an.',
     r'$\binom{n}{k} = \dfrac{n!}{k!\,(n-k)!}$',
     r'Gelesen wird er „$n$ über $k$“.'])

Q.q(r'Berechne $\binom{5}{2}$.',
    [r'$10$', r'$20$', r'$25$', r'$120$'],
    [r'$\binom{5}{2} = \dfrac{5!}{2!\,3!} = \dfrac{5 \cdot 4}{2 \cdot 1}$',
     r'$= 10$',
     r'$20$ wäre $5 \cdot 4$, also die Variante mit Reihenfolge.'])

Q.q(r'Berechne $\binom{6}{3}$.',
    [r'$20$', r'$18$', r'$120$', r'$216$'],
    [r'$\binom{6}{3} = \dfrac{6 \cdot 5 \cdot 4}{3 \cdot 2 \cdot 1}$',
     r'$= \dfrac{120}{6} = 20$',
     r'Praktisch: im Zähler $k$ absteigende Faktoren, im Nenner $k!$.'])

Q.q(r'Welchen Wert hat $\binom{n}{0}$?',
    [r'$1$', r'$0$', r'$n$', r'nicht definiert'],
    [r'$\binom{n}{0} = \dfrac{n!}{0!\,n!} = \dfrac{1}{0!}$, und $0! = 1$.',
     r'Also $\binom{n}{0} = 1$.',
     r'Anschaulich: es gibt genau eine Möglichkeit, nichts auszuwählen.'])

Q.q(r'Welchen Wert hat $\binom{n}{1}$?',
    [r'$n$', r'$1$', r'$n!$', r'$n - 1$'],
    [r'$\binom{n}{1} = \dfrac{n!}{1!\,(n-1)!} = n$',
     r'Anschaulich: ein einzelnes Element lässt sich auf genau $n$ Arten auswählen.',
     r'Ebenso gilt $\binom{n}{n} = 1$.'])

Q.q(r'Warum gilt $\binom{n}{k} = \binom{n}{n-k}$?',
    [r'Weil das Auswählen von $k$ Elementen dasselbe ist wie das Weglassen der übrigen $n-k$.',
     r'Weil die Fakultät symmetrisch ist.',
     r'Weil $k$ und $n-k$ immer gleich groß sind.',
     r'Das gilt gar nicht.'],
    [r'Jede Auswahl von $k$ Elementen legt zugleich fest, welche $n-k$ übrig bleiben.',
     r'Die beiden Zählungen entsprechen einander eins zu eins.',
     r'Probe: $\binom{6}{2} = 15$ und $\binom{6}{4} = 15$.'])

# ------------------------------------------------------ Kombinationen anwenden ----
Q.q(r'Aus $10$ Personen wird eine dreiköpfige Gruppe gebildet. Wie viele Gruppen sind möglich?',
    [r'$120$', r'$720$', r'$1000$', r'$30$'],
    [r'$\binom{10}{3} = \dfrac{10 \cdot 9 \cdot 8}{3 \cdot 2 \cdot 1}$',
     r'$= \dfrac{720}{6} = 120$',
     r'$720$ wäre die Zahl mit Reihenfolge, also bei unterscheidbaren Rollen.'])

Q.q(r'Sechs Personen begrüßen sich, jede mit jeder genau einmal. Wie viele Handschläge sind das?',
    [r'$15$', r'$30$', r'$36$', r'$12$'],
    [r'Ein Handschlag ist die Auswahl von zwei Personen ohne Reihenfolge.',
     r'$\binom{6}{2} = \dfrac{6 \cdot 5}{2} = 15$',
     r'$30$ wäre die Zählung mit Reihenfolge, bei der jeder Handschlag doppelt vorkäme.'])

Q.q(r'Wie viele Diagonalen hat ein Achteck?',
    [r'$20$', r'$28$', r'$16$', r'$24$'],
    [r'Jede Verbindung zweier Ecken ist eine Kombination: $\binom{8}{2} = 28$.',
     r'Davon sind $8$ Verbindungen Seiten, keine Diagonalen.',
     r'$28 - 8 = 20$'])

Q.q(r'Aus $5$ Eissorten werden $2$ verschiedene gewählt. Wie viele Möglichkeiten gibt es?',
    [r'$10$', r'$20$', r'$25$', r'$5$'],
    [r'Die Reihenfolge der Kugeln spielt keine Rolle.',
     r'$\binom{5}{2} = 10$',
     r'Dürften beide Kugeln dieselbe Sorte sein, wären es $15$.'])

Q.q(r'Wie viele Möglichkeiten gibt es beim Lotto „$6$ aus $49$“?',
    [r'$13\,983\,816$', r'$10\,068\,347\,520$', r'$294$', r'$49^6$'],
    [r'$\binom{49}{6} = \dfrac{49 \cdot 48 \cdot 47 \cdot 46 \cdot 45 \cdot 44}{6!}$',
     r'$= 13\,983\,816$',
     r'Die Gewinnwahrscheinlichkeit für sechs Richtige ist also rund $1$ zu $14$ Millionen.'])

# -------------------------------------------- Variationen und Anwendungen ----
Q.q(r'Aus $8$ Personen werden $3$ auf unterscheidbare Plätze gesetzt. Wie viele Möglichkeiten gibt es?',
    [r'$336$', r'$56$', r'$512$', r'$24$'],
    [r'Variation ohne Wiederholung: $8 \cdot 7 \cdot 6$.',
     r'$= 336$',
     r'$56$ wäre $\binom{8}{3}$, also ohne Beachtung der Reihenfolge.'])

Q.q(r'Ein Code besteht aus $3$ Zeichen aus einem Vorrat von $8$, Wiederholungen erlaubt. Wie viele Codes gibt es?',
    [r'$512$', r'$336$', r'$56$', r'$24$'],
    [r'Variation mit Wiederholung: für jede Stelle stehen alle $8$ Zeichen zur Verfügung.',
     r'$8^3 = 512$',
     r'Ohne Wiederholung wären es nur $336$.'])

Q.q(r'Ein Passwort besteht aus $4$ Kleinbuchstaben (aus $26$), Wiederholungen erlaubt. Wie viele gibt es?',
    [r'$456\,976$', r'$358\,800$', r'$14\,950$', r'$104$'],
    [r'$26^4$',
     r'$= 456\,976$',
     r'Ohne Wiederholung wären es $26 \cdot 25 \cdot 24 \cdot 23 = 358\,800$ — also spürbar weniger.'])

Q.q(r'Eine Prüfung besteht aus $10$ Aufgaben, von denen $7$ bearbeitet werden müssen. Wie viele Auswahlmöglichkeiten gibt es?',
    [r'$120$', r'$604\,800$', r'$210$', r'$70$'],
    [r'Die Reihenfolge der Bearbeitung ist gleichgültig, es zählt nur, welche Aufgaben gewählt werden.',
     r'$\binom{10}{7} = \binom{10}{3} = 120$',
     r'Der Symmetrie wegen ist das dieselbe Zahl wie beim Weglassen von drei Aufgaben.'])


def check():
    from math import factorial as fa, comb
    assert 10 ** 3 == 1000
    assert 8 * 7 * 6 == 336 and comb(8, 3) == 56 and 8 ** 3 == 512
    # Binomialkoeffizient
    assert comb(5, 2) == 10 and 5 * 4 == 20
    assert comb(6, 3) == 20 and fa(6) // (fa(3) * fa(3)) == 20
    assert comb(9, 0) == 1 and fa(0) == 1
    assert comb(9, 1) == 9 and comb(9, 9) == 1
    assert comb(6, 2) == comb(6, 4) == 15
    # Kombinationen
    assert comb(10, 3) == 120 and 10 * 9 * 8 == 720
    assert comb(6, 2) == 15 and 6 * 5 == 30
    assert comb(8, 2) == 28 and 28 - 8 == 20
    assert comb(5, 2) == 10 and comb(5 + 2 - 1, 2) == 15
    assert comb(49, 6) == 13983816
    # Variationen
    assert 26 ** 4 == 456976 and 26 * 25 * 24 * 23 == 358800
    assert comb(10, 7) == comb(10, 3) == 120


Q.verify(check)
Q.save()
