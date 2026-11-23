#!/usr/bin/env python3
r"""Aufgaben Mathe 11 (BGY), KW 48: lineare Gleichungssysteme - die Lösungsverfahren.

Doc via Marie, 23.11.2026 ("LGS-Aufgabensatz: ja"): the new deck decks/mathe11-lgs-verfahren.html had no set of its
own on its slide "Üben & Nachlesen" and fell back to every set of KW 48. Same notation as that deck and as
decks/mathe11-loesungsmengen.html: systems with I and II, pairs (x \mid y), L = \{\} for none (the empty set),
L = \{(3 + 2t \mid t)\},\ t \in \mathbb{R} for infinitely many. New systems only - none of the deck's examples and none
of the set mathetest11-loesungsmengen-wdh.html. The file name carries the deck's topic ("lgs-verfahren"), so
decks/deck-verweise.js shows this set first on the deck's last slide.
AFB I 1-10, II 11-16, III 17-20 (50/30/20, reference_afb_schluessel_mathe). No calculator: small numbers.
Plan: HTML/svp/mathe/mathe11.html, week 13 (KW 48), material "Aufgaben Lösungsverfahren (20)" (DB, tools/svp-material.py).
An exercise set (solutions: 'always', the button says "Auswertung"). Copied from loesungsmengen-wdh.py.

    python3 tools/aufgaben/mathe11-quiz/lgs-verfahren.py
"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
from fractions import Fraction as F
import sympy as sp
from quiz import Quiz

Q = Quiz(id='mathe11-w13-lgs-verfahren',
         file='mathetest11-lgs-verfahren.html',
         title='Aufgaben · LGS · Lösungsverfahren',
         subtitle='Berufliches Gymnasium · Klasse 11 · Woche 13, KW 48 · 20 Aufgaben zu linearen Gleichungssystemen: '
                  'Gleichsetzungs-, Einsetzungs- und Additionsverfahren, keine, eine oder unendlich viele Lösungen, '
                  'Sachaufgaben · genau eine Antwort pro Aufgabe',
         dash_sub='BGY · Klasse 11 · KW 48 · LGS-Lösungsverfahren · Live-Auswertung: anonyme Einzelscores '
                  '+ Gruppenleistung pro Aufgabe',
         back='svp/mathe/mathe11.html',
         comment='AFB I 1-10 (Probe, je ein Verfahren, Verfahren wählen, keine und unendlich viele Lösungen, '
                 'Schreibweise), AFB II 11-16 (nach x gleichsetzen, beide Gleichungen multiplizieren, Klammer mit '
                 'Minus, leere Menge und Parameterform per Addition, Sachaufgabe), AFB III 17-20 (Brüche, Rechteck, '
                 'Preise nicht eindeutig, Parameter b).')


def lgs(i, ii):
    """Two equations with the labels I and II on the right, as in the decks."""
    return r'\begin{cases} ' + i + r' & \text{I} \\ ' + ii + r' & \text{II} \end{cases}'


# ================================================================ AFB I ====
# 1 - which pair solves both (Probe)
Q.q(r'Welches Zahlenpaar ist die Lösung des LGS $' + lgs('x + y = 7', 'x - y = 1') + '$?',
    [r'$(4 \mid 3)$', r'$(3 \mid 4)$', r'$(5 \mid 2)$', r'$(6 \mid 5)$'],
    [r'Die Lösung muss beide Gleichungen erfüllen, also jedes Paar in I und in II einsetzen.',
     r'$(4 \mid 3)$: $4 + 3 = 7$ ✓ und $4 - 3 = 1$ ✓, also $L = \{(4 \mid 3)\}$',
     r'$(3 \mid 4)$: $3 + 4 = 7$ ✓, aber $3 - 4 = -1 \neq 1$ ✗ — die Reihenfolge im Paar zählt: erst $x$, dann $y$.',
     r'$(5 \mid 2)$ passt nur in I, $(6 \mid 5)$ nur in II ($6 + 5 = 11 \neq 7$).'])

# 2 - Gleichsetzungsverfahren
Q.q(r'Löse mit dem Gleichsetzungsverfahren: $' + lgs('y = 3x - 5', 'y = x + 3') + '$',
    [r'$L = \{(4 \mid 7)\}$', r'$L = \{(7 \mid 4)\}$', r'$L = \{(-1 \mid 2)\}$', r'$L = \{(2 \mid 5)\}$'],
    [r'Beide Gleichungen beginnen mit $y = \ldots$, also gleichsetzen: $3x - 5 = x + 3 \quad | -x + 5$',
     r'$2x = 8 \quad | :2$, also $x = 4$',
     r'$x = 4$ in II: $y = 4 + 3 = 7$',
     r'Probe: $3 \cdot 4 - 5 = 7$ ✓ und $4 + 3 = 7$ ✓, also $L = \{(4 \mid 7)\}$',
     r'Falle: $(-1 \mid 2)$ entsteht, wenn die $-5$ ohne Vorzeichenwechsel nach rechts wandert ($2x = 3 - 5$).'])

# 3 - Einsetzungsverfahren
Q.q(r'Löse mit dem Einsetzungsverfahren: $' + lgs('y = 2x', '3x + y = 20') + '$',
    [r'$L = \{(4 \mid 8)\}$', r'$L = \{(8 \mid 4)\}$', r'$L = \{(2 \mid 14)\}$', r'$L = \{(5 \mid 10)\}$'],
    [r'In I steht $y$ schon allein: $2x$ für $y$ in II einsetzen',
     r'$3x + 2x = 20$, also $5x = 20 \quad | :5$, also $x = 4$',
     r'$x = 4$ in I: $y = 2 \cdot 4 = 8$',
     r'Probe: $8 = 2 \cdot 4$ ✓ und $12 + 8 = 20$ ✓, also $L = \{(4 \mid 8)\}$',
     r'$(2 \mid 14)$ erfüllt nur II, $(5 \mid 10)$ nur I ($15 + 10 = 25 \neq 20$).'])

# 4 - Additionsverfahren
Q.q(r'Löse mit dem Additionsverfahren: $' + lgs('x + y = 12', 'x - y = 2') + '$',
    [r'$L = \{(7 \mid 5)\}$', r'$L = \{(5 \mid 7)\}$', r'$L = \{(14 \mid -2)\}$', r'$L = \{(6 \mid 6)\}$'],
    [r'Vor $y$ stehen $+1$ und $-1$: $\text{I} + \text{II}$ ergibt $2x = 14$, das $y$ fällt weg',
     r'$2x = 14 \quad | :2$, also $x = 7$',
     r'$x = 7$ in I: $7 + y = 12 \quad | -7$, also $y = 5$',
     r'Probe: $7 + 5 = 12$ ✓ und $7 - 5 = 2$ ✓, also $L = \{(7 \mid 5)\}$',
     r'Falle: $(14 \mid -2)$ — das Teilen durch $2$ vergessen.'])

# 5 - which method saves work
Q.q(r'Welches Verfahren spart bei $' + lgs('3x + 4y = 20', '5x - 4y = 12') + '$ am meisten Rechnung, und warum?',
    [r'Additionsverfahren: vor $y$ stehen $+4$ und $-4$',
     r'Gleichsetzungsverfahren: beide Gleichungen beginnen mit $y = \ldots$',
     r'Einsetzungsverfahren: $x$ steht schon allein',
     r'zeichnerisch: der Schnittpunkt lässt sich immer genau ablesen'],
    [r'Weder $x$ noch $y$ steht allein, keine Gleichung beginnt mit $y = \ldots$ — aber vor $y$ stehen Gegenzahlen.',
     r'$\text{I} + \text{II}$: $8x = 32 \quad | :8$, also $x = 4$',
     r'$x = 4$ in I: $12 + 4y = 20 \quad | -12$, also $4y = 8$ und $y = 2$',
     r'Probe in II: $20 - 8 = 12$ ✓, also $L = \{(4 \mid 2)\}$',
     r'Ablesen ist nur genau, wenn der Schnittpunkt auf dem Gitter liegt — das weiß man vorher nicht.'])

# 6 - Einsetzungsverfahren, x stands alone
Q.q(r'Löse mit dem Einsetzungsverfahren: $' + lgs('x = 3y - 2', '2x + y = 17') + '$',
    [r'$L = \{(7 \mid 3)\}$', r'$L = \{(3 \mid 7)\}$', r'$L = \{(4 \mid 2)\}$', r'$L = \{(5 \mid 7)\}$'],
    [r'I in II einsetzen, mit Klammer: $2(3y - 2) + y = 17$',
     r'$6y - 4 + y = 17$, also $7y - 4 = 17 \quad | +4$',
     r'$7y = 21 \quad | :7$, also $y = 3$',
     r'$y = 3$ in I: $x = 3 \cdot 3 - 2 = 7$. Probe: $7 = 9 - 2$ ✓ und $14 + 3 = 17$ ✓, also $L = \{(7 \mid 3)\}$',
     r'Falle: $(3 \mid 7)$ — erst $y$ ausgerechnet, aber im Paar steht trotzdem $x$ vorn.'])

# 7 - none: parallel lines
Q.q(r'Gib die Lösungsmenge an: $' + lgs('y = -x + 4', 'y = -x + 1') + '$',
    [r'$L = \{\}$', r'$L = \{(0 \mid 4)\}$', r'$L = \mathbb{R}$', r'$L = \{(t \mid -t + 4)\},\ t \in \mathbb{R}$'],
    [r'Gleichsetzen: $-x + 4 = -x + 1 \quad | +x$',
     r'$4 = 1$ — eine falsche Aussage, ganz egal, welches $x$ man nimmt.',
     r'Kein Paar erfüllt beide Gleichungen: $L = \{\}$, die leere Menge (auch $\emptyset$ geschrieben).',
     r'Im Bild: beide Geraden haben die Steigung $-1$, aber verschiedene Achsenabschnitte $4$ und $1$ — sie sind parallel.',
     r'Falle: $(0 \mid 4)$ liegt nur auf Gerade I, denn $-0 + 1 = 1 \neq 4$.'])

# 8 - infinitely many: the same line twice
Q.q(r'Gib die Lösungsmenge an: $' + lgs('y = 3x - 2', '2y = 6x - 4') + '$',
    [r'$L = \{(t \mid 3t - 2)\},\ t \in \mathbb{R}$', r'$L = \{\}$', r'$L = \{(0 \mid -2)\}$', r'$L = \mathbb{R}$'],
    [r'I in II einsetzen: $2(3x - 2) = 6x - 4$, also $6x - 4 = 6x - 4 \quad | -6x + 4$',
     r'$0 = 0$ — eine wahre Aussage für jedes $x$: II ist nur das Doppelte von I, dieselbe Gerade.',
     r'$x = t$ frei wählen, aus I folgt $y = 3t - 2$: $L = \{(t \mid 3t - 2)\},\ t \in \mathbb{R}$',
     r'Falle: $(0 \mid -2)$ ist eine Lösung (für $t = 0$), aber nicht alle. $L = \mathbb{R}$ passt nicht, die Lösungen sind Zahlenpaare.'])

# 9 - notation: the point of intersection
Q.q(r'Die beiden Geraden eines LGS schneiden sich im Punkt $S(-2 \mid 5)$. Wie lautet die Lösungsmenge?',
    [r'$L = \{(-2 \mid 5)\}$', r'$L = \{-2;\ 5\}$', r'$L = \{(5 \mid -2)\}$', r'$L = (-2 \mid 5)$'],
    [r'Der Schnittpunkt liegt auf beiden Geraden: sein Zahlenpaar erfüllt beide Gleichungen.',
     r'Die Lösung ist ein einziges Zahlenpaar, erst $x$, dann $y$, in der Mengenklammer: $L = \{(-2 \mid 5)\}$',
     r'Falle: $\{-2;\ 5\}$ wären zwei einzelne Zahlen, $(-2 \mid 5)$ ohne geschweifte Klammern ist keine Menge.'])

# 10 - what 0 = 0 means
Q.q(r'Beim Additionsverfahren bleibt am Ende die Zeile $0 = 0$ stehen. Was bedeutet das?',
    [r'unendlich viele Lösungen: beide Gleichungen beschreiben dieselbe Gerade',
     r'keine Lösung: die beiden Geraden sind parallel',
     r'genau eine Lösung: $L = \{(0 \mid 0)\}$',
     r'ein Rechenfehler: so eine Zeile darf nicht entstehen'],
    [r'$0 = 0$ ist immer wahr — die zweite Gleichung stellt keine neue Bedingung, es bleibt nur die erste.',
     r'Die beiden Gleichungen sagen dasselbe: die Geraden liegen aufeinander, es gibt unendlich viele Lösungen.',
     r'Zum Vergleich: eine falsche Aussage wie $0 = 7$ heißt keine Lösung, $L = \{\}$ — dann sind die Geraden parallel.'])

# =============================================================== AFB II ====
# 11 - Gleichsetzungsverfahren, both solved for x
Q.q(r'Löse mit dem Gleichsetzungsverfahren: $' + lgs('x = 2y + 7', 'x = -3y + 2') + '$',
    [r'$L = \{(5 \mid -1)\}$', r'$L = \{(-1 \mid 5)\}$', r'$L = \{(17 \mid 5)\}$', r'$L = \{(9 \mid 1)\}$'],
    [r'Diesmal beginnen beide mit $x = \ldots$, also gleichsetzen: $2y + 7 = -3y + 2 \quad | +3y - 7$',
     r'$5y = -5 \quad | :5$, also $y = -1$',
     r'$y = -1$ in I: $x = 2 \cdot (-1) + 7 = 5$',
     r'Probe: $5 = -2 + 7$ ✓ und $5 = 3 + 2$ ✓. Im Paar steht $x$ vorn: $L = \{(5 \mid -1)\}$',
     r'Falle: $(17 \mid 5)$ — die $-3y$ ohne Vorzeichenwechsel nach links gebracht ($2y - 3y = 2 - 7$).'])

# 12 - Additionsverfahren, both equations multiplied
Q.q(r'Löse mit dem Additionsverfahren: $' + lgs('3x + 2y = 4', '2x - 3y = 7') + '$',
    [r'$L = \{(2 \mid -1)\}$', r'$L = \{(-1 \mid 2)\}$', r'$L = \{(2 \mid 1)\}$', r'$L = \{(4 \mid -4)\}$'],
    [r'Vor $y$ stehen $2$ und $-3$: beide auf $6$ bringen, $3 \cdot \text{I}$ und $2 \cdot \text{II}$',
     r'$9x + 6y = 12$ und $4x - 6y = 14$',
     r'Addieren: $13x = 26 \quad | :13$, also $x = 2$',
     r'$x = 2$ in I: $6 + 2y = 4 \quad | -6$, also $2y = -2$ und $y = -1$',
     r'Probe in II: $4 - 3 \cdot (-1) = 4 + 3 = 7$ ✓, also $L = \{(2 \mid -1)\}$',
     r'Falle: $(4 \mid -4)$ erfüllt nur I: $8 + 12 = 20 \neq 7$.'])

# 13 - Einsetzungsverfahren, minus before the bracket
Q.q(r'Löse mit dem Einsetzungsverfahren: $' + lgs('y = 5 - 2x', '3x - 2y = 18') + '$',
    [r'$L = \{(4 \mid -3)\}$', r'$L = \{(-3 \mid 4)\}$', r'$L = \{(4 \mid 3)\}$', r'$L = \{(-28 \mid 61)\}$'],
    [r'I in II einsetzen, mit Klammer: $3x - 2(5 - 2x) = 18$',
     r'Minus vor der Klammer dreht beide Vorzeichen: $3x - 10 + 4x = 18$',
     r'$7x - 10 = 18 \quad | +10$, also $7x = 28$ und $x = 4$',
     r'$x = 4$ in I: $y = 5 - 8 = -3$. Probe: $12 - 2 \cdot (-3) = 12 + 6 = 18$ ✓, also $L = \{(4 \mid -3)\}$',
     r'Falle: $(-28 \mid 61)$ — nur das erste Vorzeichen gedreht ($3x - 10 - 4x = 18$).'])

# 14 - none, found by the Additionsverfahren
Q.q(r'Gib die Lösungsmenge an: $' + lgs('x - 2y = 4', '-3x + 6y = 5') + '$',
    [r'$L = \{\}$', r'$L = \{(4 + 2t \mid t)\},\ t \in \mathbb{R}$', r'$L = \{(4 \mid 0)\}$', r'$L = \mathbb{R}$'],
    [r'Vor $x$ stehen $1$ und $-3$: $3 \cdot \text{I}$ ergibt $3x - 6y = 12$',
     r'$3 \cdot \text{I} + \text{II}$: links heben sich $x$ und $y$ auf, rechts steht $12 + 5$, also $0 = 17$ — falsch.',
     r'Kein Paar erfüllt beide Gleichungen: $L = \{\}$',
     r'Im Bild: zwei parallele Geraden. Falle: $(4 \mid 0)$ liegt nur auf I, denn $-12 + 0 \neq 5$.'])

# 15 - infinitely many, found by the Additionsverfahren
Q.q(r'Gib die Lösungsmenge an: $' + lgs('3x - 6y = 9', '-x + 2y = -3') + '$',
    [r'$L = \{(3 + 2t \mid t)\},\ t \in \mathbb{R}$', r'$L = \{(3 \mid 0)\}$', r'$L = \{\}$',
     r'$L = \{(t \mid 3 + 2t)\},\ t \in \mathbb{R}$'],
    [r'$3 \cdot \text{II}$ ergibt $-3x + 6y = -9$',
     r'$\text{I} + 3 \cdot \text{II}$: $0 = 0$ — wahr, I ist das $(-3)$-Fache von II: unendlich viele Lösungen.',
     r'$y = t$ frei wählen, aus II: $-x + 2t = -3$, also $x = 3 + 2t$',
     r'$L = \{(3 + 2t \mid t)\},\ t \in \mathbb{R}$. Probe in I: $3(3 + 2t) - 6t = 9$ ✓',
     r'Falle: $(3 \mid 0)$ ist nur eine der Lösungen ($t = 0$). Bei $(t \mid 3 + 2t)$ sind $x$ und $y$ vertauscht: $(0 \mid 3)$ passt nicht in I.'])

# 16 - word problem: egg boxes
Q.q(r'Ein Hofladen verkauft Eier in Sechser- und in Zehnerkartons. Frau Kühn kauft 5 Kartons mit zusammen 38 Eiern. '
    r'Mit $x$ für die Zahl der Sechser- und $y$ für die Zahl der Zehnerkartons entsteht ein LGS. Was gilt?',
    [r'$L = \{(3 \mid 2)\}$: 3 Sechser- und 2 Zehnerkartons', r'$L = \{(3 \mid 2)\}$: 2 Sechser- und 3 Zehnerkartons',
     r'$L = \{(2 \mid 3)\}$: 2 Sechser- und 3 Zehnerkartons', r'$L = \{(1 \mid 4)\}$: 1 Sechser- und 4 Zehnerkartons'],
    [r'$\text{I}: x + y = 5$ (Kartons) und $\text{II}: 6x + 10y = 38$ (Eier)',
     r'Aus I: $x = 5 - y$, in II einsetzen: $6(5 - y) + 10y = 38$',
     r'$30 - 6y + 10y = 38$, also $4y = 8$ und $y = 2$; dann $x = 5 - 2 = 3$',
     r'Probe: $3 + 2 = 5$ ✓ und $18 + 20 = 38$ ✓, also $L = \{(3 \mid 2)\}$: 3 Sechser- und 2 Zehnerkartons.',
     r'Falle: $(2 \mid 3)$ ergibt $12 + 30 = 42$ Eier, $(1 \mid 4)$ sogar $46$.'])

# ============================================================== AFB III ====
# 17 - fractions first, then the Additionsverfahren
Q.q(r'Löse das LGS: $' + lgs(r'\dfrac{x}{2} + \dfrac{y}{3} = 3', r'\dfrac{x}{4} - \dfrac{y}{6} = \dfrac{1}{2}') + '$',
    [r'$L = \{(4 \mid 3)\}$', r'$L = \{(3 \mid 4)\}$', r'$L = \{(2 \mid 6)\}$', r'$L = \{(4 \mid -3)\}$'],
    [r'Erst die Brüche loswerden: $6 \cdot \text{I}$ ergibt $3x + 2y = 18$, $12 \cdot \text{II}$ ergibt $3x - 2y = 6$',
     r'Jetzt stehen vor $y$ die Gegenzahlen $+2$ und $-2$: addieren, $6x = 24$, also $x = 4$',
     r'$x = 4$ in $3x + 2y = 18$: $12 + 2y = 18$, also $y = 3$',
     r'Probe im Original: $2 + 1 = 3$ ✓ und $1 - \dfrac{1}{2} = \dfrac{1}{2}$ ✓, also $L = \{(4 \mid 3)\}$',
     r'Falle: $(2 \mid 6)$ erfüllt nur I: $\dfrac{2}{4} - 1 = -\dfrac{1}{2} \neq \dfrac{1}{2}$.'])

# 18 - word problem: rectangle
Q.q(r'Ein Rechteck hat den Umfang 30 cm. Seine Länge ist um 3 cm größer als das Doppelte seiner Breite. '
    r'Mit $x$ für die Länge und $y$ für die Breite (in cm): Welche Lösungsmenge hat das LGS?',
    [r'$L = \{(11 \mid 4)\}$', r'$L = \{(4 \mid 11)\}$', r'$L = \{(21 \mid 9)\}$', r'$L = \{(12 \mid 3)\}$'],
    [r'$\text{I}: 2x + 2y = 30$ (Umfang) und $\text{II}: x = 2y + 3$ (Länge)',
     r'II in I einsetzen: $2(2y + 3) + 2y = 30$, also $6y + 6 = 30$ und $y = 4$',
     r'$y = 4$ in II: $x = 2 \cdot 4 + 3 = 11$. Probe: $22 + 8 = 30$ ✓, also $L = \{(11 \mid 4)\}$: 11 cm lang, 4 cm breit.',
     r'Falle: $(21 \mid 9)$ mit $x + y = 30$ als Umfang, $(12 \mid 3)$ mit $x = 2(y + 3)$ — „um 3 größer als das Doppelte“ heißt $2y + 3$.'])

# 19 - word problem: the prices are not determined
Q.q(r'Am Kiosk kosten 2 Brezeln und 1 Saft zusammen 4 €, 4 Brezeln und 2 Säfte zusammen 8 €. '
    r'Lassen sich daraus der Preis einer Brezel und der eines Safts berechnen?',
    [r'Nein: die zweite Angabe ist das Doppelte der ersten, es gibt unendlich viele Preispaare',
     r'Ja: eine Brezel kostet 1,50 €, ein Saft 1 €',
     r'Ja: eine Brezel kostet 1 €, ein Saft 2 €',
     r'Nein: das LGS hat keine Lösung'],
    [r'$x$: Preis einer Brezel, $y$: Preis eines Safts (in €). $\text{I}: 2x + y = 4$ und $\text{II}: 4x + 2y = 8$',
     r'$\text{II} - 2 \cdot \text{I}$: $0 = 0$ — die zweite Angabe sagt nichts Neues.',
     r'$x = t$, aus I: $y = 4 - 2t$, also $L = \{(t \mid 4 - 2t)\},\ t \in \mathbb{R}$, mit $0 < t < 2$ für echte Preise.',
     r'Beide „Ja“-Paare erfüllen I und II — aber $(1{,}2 \mid 1{,}6)$ genauso. Eindeutig berechnen lässt sich nichts.'])

# 20 - parameter b: none or infinitely many
Q.q(r'Für welche Werte von $b$ hat das LGS $' + lgs('2x - y = 1', '-6x + 3y = b') + '$ keine Lösung?',
    [r'für jedes $b \neq -3$', r'nur für $b = -3$', r'nur für $b = 3$',
     r'für kein $b$: es gibt immer genau eine Lösung'],
    [r'$3 \cdot \text{I}$ ergibt $6x - 3y = 3$',
     r'$3 \cdot \text{I} + \text{II}$: $0 = 3 + b$ — beide Variablen fallen weg, egal welches $b$.',
     r'Für $b = -3$ steht $0 = 0$ da: unendlich viele Lösungen, $L = \{(t \mid 2t - 1)\},\ t \in \mathbb{R}$',
     r'Für jedes andere $b$ ist $0 = 3 + b$ falsch: keine Lösung, $L = \{\}$. Genau eine Lösung gibt es hier nie — die Geraden haben beide die Steigung $2$.'])


# ---------------------------------------------------------- numbers check ----
def check():
    x, y, t, b = sp.symbols('x y t b')

    def ls(*eqs):
        return sp.linsolve([sp.sympify(e) for e in eqs], x, y)

    def pair(p, q):
        return sp.FiniteSet((sp.nsimplify(p), sp.nsimplify(q)))

    def fits(e, p, q):
        return sp.simplify(e.subs({x: p, y: q})) == 0

    E = sp.S.EmptySet
    # 1
    I1, II1 = x + y - 7, x - y - 1
    assert ls(I1, II1) == pair(4, 3)
    assert fits(I1, 3, 4) and not fits(II1, 3, 4)
    assert fits(I1, 5, 2) and not fits(II1, 5, 2)
    assert not fits(I1, 6, 5) and fits(II1, 6, 5)
    # 2
    I2, II2 = y - (3 * x - 5), y - (x + 3)
    assert ls(I2, II2) == pair(4, 7)
    assert sp.solve(2 * x - (3 - 5), x) == [-1] and (-1) + 3 == 2          # slip -> (-1|2)
    assert fits(II2, 2, 5) and not fits(I2, 2, 5)
    assert not fits(I2, 7, 4)
    # 3
    I3, II3 = y - 2 * x, 3 * x + y - 20
    assert ls(I3, II3) == pair(4, 8)
    assert fits(II3, 2, 14) and not fits(I3, 2, 14)
    assert fits(I3, 5, 10) and not fits(II3, 5, 10)
    assert not fits(II3, 8, 4)
    # 4
    I4, II4 = x + y - 12, x - y - 2
    assert ls(I4, II4) == pair(7, 5)
    assert 12 - 14 == -2                                                  # slip x = 14
    assert fits(I4, 6, 6) and not fits(II4, 6, 6) and not fits(II4, 5, 7)
    # 5
    I5, II5 = 3 * x + 4 * y - 20, 5 * x - 4 * y - 12
    assert ls(I5, II5) == pair(4, 2) and sp.expand(I5 + II5) == 8 * x - 32
    # 6
    I6, II6 = x - (3 * y - 2), 2 * x + y - 17
    assert ls(I6, II6) == pair(7, 3)
    assert fits(I6, 4, 2) and not fits(II6, 4, 2)
    assert fits(II6, 5, 7) and not fits(I6, 5, 7)
    assert not fits(I6, 3, 7)
    # 7
    I7, II7 = y - (-x + 4), y - (-x + 1)
    assert ls(I7, II7) == E
    assert fits(I7, 0, 4) and not fits(II7, 0, 4)
    # 8
    I8, II8 = y - (3 * x - 2), 2 * y - (6 * x - 4)
    assert ls(I8, II8) == sp.FiniteSet(((y + 2) / 3, y))                  # linsolve frees y
    assert fits(I8, t, 3 * t - 2) and fits(II8, t, 3 * t - 2)            # the deck's way: x = t
    assert sp.expand(II8 - 2 * I8) == 0 and fits(I8, 0, -2)
    # 9 - notation only
    # 10 - meaning only; 0 = 0 for a multiple, 0 = c != 0 for parallels: see 8, 14, 15
    # 11
    I11, II11 = x - (2 * y + 7), x - (-3 * y + 2)
    assert ls(I11, II11) == pair(5, -1)
    assert sp.solve(2 * y - 3 * y - (2 - 7), y) == [5] and 2 * 5 + 7 == 17   # slip -> (17|5)
    assert fits(I11, 9, 1) and not fits(II11, 9, 1)
    assert not fits(I11, -1, 5)
    # 12
    I12, II12 = 3 * x + 2 * y - 4, 2 * x - 3 * y - 7
    assert ls(I12, II12) == pair(2, -1)
    assert sp.expand(3 * I12 + 2 * II12) == 13 * x - 26
    assert fits(I12, 4, -4) and not fits(II12, 4, -4)
    assert not fits(I12, 2, 1) and not fits(I12, -1, 2)
    # 13
    I13, II13 = y - (5 - 2 * x), 3 * x - 2 * y - 18
    assert ls(I13, II13) == pair(4, -3)
    xs = sp.solve(3 * x - 10 - 4 * x - 18, x)                             # slip: only the first sign turned
    assert xs == [-28] and 5 - 2 * (-28) == 61
    assert not fits(I13, 4, 3) and not fits(I13, -3, 4)
    # 14
    I14, II14 = x - 2 * y - 4, -3 * x + 6 * y - 5
    assert ls(I14, II14) == E and sp.expand(3 * I14 + II14) == -17
    assert fits(I14, 4, 0) and not fits(II14, 4, 0)
    # 15
    I15, II15 = 3 * x - 6 * y - 9, -x + 2 * y + 3
    assert ls(I15, II15) == sp.FiniteSet((2 * y + 3, y))
    assert sp.expand(I15 + 3 * II15) == 0
    assert sp.expand(I15.subs({x: 3 + 2 * t, y: t})) == 0
    assert not fits(I15, 0, 3) and fits(I15, 3, 0)
    # 16
    I16, II16 = x + y - 5, 6 * x + 10 * y - 38
    assert ls(I16, II16) == pair(3, 2)
    assert 6 * 2 + 10 * 3 == 42 and 6 * 1 + 10 * 4 == 46
    # 17
    I17 = x / sp.Integer(2) + y / sp.Integer(3) - 3
    II17 = x / sp.Integer(4) - y / sp.Integer(6) - sp.Rational(1, 2)
    assert ls(I17, II17) == pair(4, 3)
    assert sp.expand(6 * I17) == 3 * x + 2 * y - 18 and sp.expand(12 * II17) == 3 * x - 2 * y - 6
    assert fits(I17, 2, 6) and not fits(II17, 2, 6) and F(2, 4) - 1 == F(-1, 2)
    assert not fits(I17, 3, 4) and not fits(I17, 4, -3)
    # 18
    I18, II18 = 2 * x + 2 * y - 30, x - (2 * y + 3)
    assert ls(I18, II18) == pair(11, 4)
    assert ls(x + y - 30, II18) == pair(21, 9)                            # slip: perimeter x + y
    assert ls(I18, x - 2 * (y + 3)) == pair(12, 3)                        # slip: 2(y + 3)
    assert not fits(I18, 4, 11) or not fits(II18, 4, 11)
    # 19
    I19, II19 = 2 * x + y - 4, 4 * x + 2 * y - 8
    assert ls(I19, II19) == sp.FiniteSet((2 - y / 2, y))
    for p, q in ((F(3, 2), 1), (1, 2), (F(6, 5), F(8, 5))):
        assert fits(I19, p, q) and fits(II19, p, q)
    # 20
    I20 = 2 * x - y - 1
    assert sp.expand(3 * I20 + (-6 * x + 3 * y - b)) == -3 - b              # 0 = 3 + b
    assert ls(I20, -6 * x + 3 * y + 3) == sp.FiniteSet(((y + 1) / 2, y))    # b = -3: infinitely many
    for bv in range(-10, 11):
        if bv != -3:
            assert ls(I20, -6 * x + 3 * y - bv) == E
    assert len(Q.questions) == 20


Q.verify(check)
Q.save()
