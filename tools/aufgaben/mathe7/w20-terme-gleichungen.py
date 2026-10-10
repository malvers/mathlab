#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 20 / KW 3 (LB 3): variable, domain, term,
statement, solution and solution set; evaluating terms with rational numbers; setting up
equations from number puzzles and geometry. Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from quiz import os7

Q = os7(nr=20, slug='terme-gleichungen', thema='Terme und Gleichungen', lb='LB 3',
        blurb='Termwerte, Aussage und Gleichung, Lösung und Lösungsmenge, Gleichungen aufstellen',
        comment='Blocks: evaluating terms (1-4, 18-19), terms, statements, equations (5-8), solution sets (9-10, 20), setting up equations (11-17).')

# --------------------------------------------------------------- evaluating terms ----
Q.q(r'Berechne den Wert des Terms $3x - 2$ für $x = -4$.',
    [r'−14', r'−10', r'10', r'14'],
    [r'Einsetzen: $3 \cdot (-4) - 2$',
     r'$= -12 - 2$',
     r'$= -14$'])

Q.q(r'Berechne den Wert des Terms $x^2 + 1$ für $x = -3$.',
    [r'10', r'−8', r'−5', r'7'],
    [r'Einsetzen mit Klammer: $(-3)^2 + 1$',
     r'$= 9 + 1$',
     r'$= 10$'])

Q.q(r'Berechne den Wert des Terms $2 \cdot (a + 5)$ für $a = -2$.',
    [r'6', r'14', r'−6', r'8'],
    [r'Klammer: $-2 + 5 = 3$',
     r'$2 \cdot 3$',
     r'$= 6$'])

Q.q(r'Welche Werte nimmt der Term $4 - x$ für $x = -1$, $x = 0$ und $x = 1$ an?',
    [r'5; 4; 3', r'3; 4; 5', r'−5; −4; −3', r'4; 4; 4'],
    [r'$x = -1$: $4 - (-1) = 5$',
     r'$x = 0$: $4 - 0 = 4$',
     r'$x = 1$: $4 - 1 = 3$'])

Q.q(r'Fasse zusammen: $3x + 5x$',
    [r'$8x$', r'$8x^2$', r'$15x$', r'$8$'],
    [r'Gleiche Variablen kann man zusammenfassen.',
     r'3 $x$ und 5 $x$ sind zusammen 8 $x$.',
     r'$3x + 5x = 8x$'])

Q.q(r'Fasse zusammen: $4a - 7a + 2$',
    [r'$-3a + 2$', r'$3a + 2$', r'$-a$', r'$-11a + 2$'],
    [r'Die Glieder mit $a$ zusammenfassen: $4a - 7a = -3a$',
     r'Die 2 hat kein $a$, sie bleibt stehen.',
     r'$-3a + 2$'])

# ------------------------------------------------- terms, statements, equations ----
Q.q(r'Welcher Ausdruck ist eine Aussage?',
    [r'$3 + 4 = 7$', r'$3 + x$', r'$2x - 1$', r'$x$'],
    [r'Eine Aussage ist entweder wahr oder falsch.',
     r'$3 + 4 = 7$ ist eine wahre Aussage.',
     r'Die anderen sind Terme: Sie sind weder wahr noch falsch.'])

Q.q(r'Welcher Ausdruck ist eine Gleichung mit einer Variablen?',
    [r'$2x + 1 = 7$', r'$2x + 1$', r'$2 + 1 = 3$', r'$7$'],
    [r'Eine Gleichung hat ein Gleichheitszeichen.',
     r'Mit einer Variablen ist sie erst nach dem Einsetzen wahr oder falsch.',
     r'$2x + 1 = 7$'])

Q.q(r'Welcher Ausdruck ist ein Term?',
    [r'$2x + 1$', r'$2x + 1 = 7$', r'$x < 3$', r'$5 = 5$'],
    [r'Ein Term ist ein Rechenausdruck ohne Gleichheits- oder Ungleichheitszeichen.',
     r'Er kann Zahlen und Variablen enthalten.',
     r'$2x + 1$ ist ein Term.'])

Q.q(r'Ist $x = 3$ eine Lösung der Gleichung $2x + 1 = 7$?',
    [r'Ja, $2 \cdot 3 + 1 = 7$ ist wahr.', r'Nein, die Lösung ist 4.', r'Nein, Gleichungen haben keine Lösung.',
     r'Ja, weil 3 kleiner als 7 ist.'],
    [r'Einsetzen: $2 \cdot 3 + 1$',
     r'$= 7$',
     r'Die Aussage $7 = 7$ ist wahr, also ist 3 eine Lösung.'])

# ---------------------------------------------------------------- solution sets ----
Q.q(r'Welche Lösungsmenge hat $x + 5 = 2$, wenn nur natürliche Zahlen erlaubt sind?',
    [r'$L = \{\ \}$', r'$L = \{-3\}$', r'$L = \{3\}$', r'$L = \{7\}$'],
    [r'$x + 5 = 2$ gilt nur für $x = -3$.',
     r'−3 ist keine natürliche Zahl.',
     r'Im Grundbereich $\mathbb{N}$ gibt es keine Lösung: leere Menge.'])

Q.q(r'Welche Lösungsmenge hat $x + 5 = 2$, wenn alle ganzen Zahlen erlaubt sind?',
    [r'$L = \{-3\}$', r'$L = \{\ \}$', r'$L = \{3\}$', r'$L = \{-7\}$'],
    [r'Gesucht: Welche Zahl plus 5 ergibt 2?',
     r'$2 - 5 = -3$',
     r'$L = \{-3\}$'])

Q.q(r'Welche Lösungsmenge hat $x < 3$, wenn nur natürliche Zahlen erlaubt sind?',
    [r'$L = \{0;\ 1;\ 2\}$', r'$L = \{1;\ 2\}$', r'$L = \{0;\ 1;\ 2;\ 3\}$', r'$L = \{3\}$'],
    [r'Natürliche Zahlen kleiner als 3.',
     r'Die 0 gehört zu den natürlichen Zahlen.',
     r'$L = \{0;\ 1;\ 2\}$'])

# ------------------------------------------------------- setting up equations ----
Q.q(r'„Das Dreifache einer Zahl, vermindert um 4, ergibt 11.“ Welche Gleichung passt?',
    [r'$3x - 4 = 11$', r'$3 \cdot (x - 4) = 11$', r'$3 + x - 4 = 11$', r'$4 - 3x = 11$'],
    [r'Das Dreifache einer Zahl: $3x$',
     r'vermindert um 4: $3x - 4$',
     r'ergibt 11: $3x - 4 = 11$'])

Q.q(r'Löse das Zahlenrätsel: „Das Dreifache einer Zahl, vermindert um 4, ergibt 11.“',
    [r'5', r'7', r'2,3', r'15'],
    [r'$3x - 4 = 11$',
     r'Rückwärts: $11 + 4 = 15$, $15 : 3 = 5$',
     r'Probe: $3 \cdot 5 - 4 = 11$ ✓'])

Q.q(r'„Ich denke mir eine Zahl, addiere 7 und erhalte −2.“ Welche Zahl ist es?',
    [r'−9', r'5', r'9', r'−5'],
    [r'$x + 7 = -2$',
     r'$x = -2 - 7$',
     r'$x = -9$'])

Q.q(r'Ein Rechteck ist doppelt so lang wie breit, sein Umfang ist 30 cm. Mit der Breite $b$: Welche Gleichung passt?',
    [r'$6b = 30$', r'$3b = 30$', r'$2b = 30$', r'$b + 2 = 30$'],
    [r'Länge: $2b$',
     r'Umfang: $b + 2b + b + 2b$',
     r'$= 6b$, also $6b = 30$ und $b = 5$ cm.'])

Q.q(r'In einem Dreieck ist $\beta$ doppelt so groß wie $\alpha$ und $\gamma$ dreimal so groß wie $\alpha$. Wie groß ist $\alpha$?',
    [r'30°', r'60°', r'20°', r'36°'],
    [r'Mit $\alpha = x$: $\beta = 2x$, $\gamma = 3x$.',
     r'Winkelsumme: $x + 2x + 3x = 6x = 180°$',
     r'$x = 30°$'])

Q.q(r'Eine Kinokarte kostet 8 €, dazu kauft die Gruppe einmal Popcorn für 5 €. Welcher Term gibt die Kosten für $n$ Personen an?',
    [r'$8n + 5$', r'$5n + 8$', r'$13n$', r'$8 + 5 + n$'],
    [r'Jede Person zahlt 8 €: $8 \cdot n$',
     r'Popcorn wird nur einmal gekauft: $+ 5$',
     r'$8n + 5$, für 6 Personen also 53 €.'])

Q.q(r'Was ist der Grundbereich einer Variablen?',
    [r'die Menge der Zahlen, die man für sie einsetzen darf', r'die kleinste Lösung', r'der Wert des Terms',
     r'die Anzahl der Lösungen'],
    [r'Zum Beispiel: nur natürliche Zahlen oder alle rationalen Zahlen.',
     r'Der Grundbereich kann die Lösungsmenge verändern.',
     r'Siehe $x + 5 = 2$: in $\mathbb{N}$ keine, in $\mathbb{Z}$ eine Lösung.'])


def check():
    t1 = lambda x: 3 * x - 2
    assert t1(-4) == -14 and (-3) ** 2 + 1 == 10 and 2 * (-2 + 5) == 6 and [4 - x for x in (-1, 0, 1)] == [5, 4, 3]
    assert 3 + 5 == 8 and 4 - 7 == -3
    assert 2 * 3 + 1 == 7
    assert [x for x in range(0, 50) if x + 5 == 2] == [] and [x for x in range(-50, 50) if x + 5 == 2] == [-3]
    assert [x for x in range(0, 50) if x < 3] == [0, 1, 2]
    assert [x for x in range(-50, 50) if 3 * x - 4 == 11] == [5] and [x for x in range(-50, 50) if x + 7 == -2] == [-9]
    assert F(30, 6) == 5 and F(180, 6) == 30 and 8 * 6 + 5 == 53


Q.verify(check)
Q.save()
