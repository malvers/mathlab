#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 32 / KW 18 (LB 4): two-way tables and stochastic independence
of events. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=32, slug='vierfeldertafel', thema='Vierfeldertafel und stochastische Unabhängigkeit', lb='LB 4',
         blurb='Vierfeldertafeln aufstellen und lesen, Unabhängigkeit prüfen und nutzen',
         comment='Blocks: filling a table (1-5), independence (6-12), surveys (13-17), tree and table (18-20).')

# --------------------------------------------------------------- filling a table ----
Q.q(r'In einer Vierfeldertafel gilt $P(A) = 0{,}4$ und $P(A \cap B) = 0{,}2$. Wie groß ist $P(A \cap \overline{B})$?',
    [r'0,2', r'0,6', r'0,08', r'0,4'],
    [r'Die Zeile $A$ summiert sich zu $P(A)$.',
     r'$0{,}4 - 0{,}2 = 0{,}2$'])

Q.q(r'Es gilt $P(A) = 0{,}3$ und $P(A \cap \overline{B}) = 0{,}1$. Wie groß ist $P(A \cap B)$?',
    [r'0,2', r'0,4', r'0,03', r'0,7'],
    [r'$P(A \cap B) + P(A \cap \overline{B}) = P(A)$',
     r'$0{,}3 - 0{,}1 = 0{,}2$'])

Q.q(r'Was steht in der Vierfeldertafel unten rechts?',
    [r'Die Summe aller Felder, also 1 bzw. die Gesamtzahl', r'$P(A \cap B)$', r'$P(\overline{A} \cap \overline{B})$', r'0'],
    [r'Die Randsummen addieren sich zur Gesamtheit.'])

Q.q(r'Es gilt $P(B) = 0{,}5$ und $P(A \cap B) = 0{,}2$. Wie groß ist $P(\overline{A} \cap B)$?',
    [r'0,3', r'0,7', r'0,1', r'0,5'],
    [r'Die Spalte $B$ summiert sich zu $P(B)$.',
     r'$0{,}5 - 0{,}2 = 0{,}3$'])

Q.q(r'Von 500 Befragten gehören 12 % zu $A \cap B$. Wie viele Personen sind das?',
    [r'60', r'12', r'120', r'6'],
    [r'$0{,}12 \cdot 500 = 60$'])

# ------------------------------------------------------------- independence ----
Q.q(r'Wann heißen zwei Ereignisse $A$ und $B$ stochastisch unabhängig?',
    [r'Wenn $P(A \cap B) = P(A) \cdot P(B)$ gilt.', r'Wenn $A \cap B$ leer ist.', r'Wenn $P(A) = P(B)$ gilt.', r'Wenn $P(A) + P(B) = 1$ gilt.'],
    [r'Anschaulich: Das Eintreten von $B$ ändert nichts an der Wahrscheinlichkeit von $A$.'])

Q.q(r'Es gilt $P(A) = 0{,}4$, $P(B) = 0{,}5$ und $P(A \cap B) = 0{,}2$. Sind $A$ und $B$ unabhängig?',
    [r'Ja, $0{,}4 \cdot 0{,}5 = 0{,}2$.', r'Nein, $0{,}4 + 0{,}5 \neq 0{,}2$.', r'Nein, weil $A \cap B$ nicht leer ist.', r'Das lässt sich nicht entscheiden.'],
    [r'Produkt der Einzelwahrscheinlichkeiten mit $P(A \cap B)$ vergleichen.'])

Q.q(r'$A$ und $B$ sind unabhängig mit $P(A) = 0{,}3$ und $P(B) = 0{,}5$. Wie groß ist $P(A \cap B)$?',
    [r'0,15', r'0,8', r'0,2', r'0,65'],
    [r'Bei Unabhängigkeit: $P(A \cap B) = 0{,}3 \cdot 0{,}5$.'])

Q.q(r'Mit denselben Werten ($P(A) = 0{,}3$, $P(B) = 0{,}5$, unabhängig): Wie groß ist $P(A \cup B)$?',
    [r'0,65', r'0,8', r'0,15', r'0,5'],
    [r'$P(A \cup B) = P(A) + P(B) - P(A \cap B)$',
     r'$0{,}3 + 0{,}5 - 0{,}15 = 0{,}65$'])

Q.q(r'Mit denselben Werten: Wie groß ist $P(\overline{A} \cap \overline{B})$?',
    [r'0,35', r'0,15', r'0,65', r'0,2'],
    [r'Mit $A$ und $B$ sind auch die Gegenereignisse unabhängig.',
     r'$0{,}7 \cdot 0{,}5 = 0{,}35$; Kontrolle: $1 - 0{,}65 = 0{,}35$.'])

Q.q(r'$A$ und $B$ sind unvereinbar ($A \cap B = \emptyset$), beide mit positiver Wahrscheinlichkeit. Sind sie unabhängig?',
    [r'Nein, denn $P(A \cap B) = 0$, aber $P(A) \cdot P(B) > 0$.', r'Ja, unvereinbar heißt unabhängig.', r'Ja, immer.', r'Das hängt von $P(A)$ ab.'],
    [r'Tritt $A$ ein, kann $B$ nicht mehr eintreten: Das ist starke Abhängigkeit.',
     r'Unvereinbar und unabhängig sind verschiedene Begriffe.'])

Q.q(r'Zwei Würfel werden geworfen. $A$: Der erste zeigt 6. $B$: Der zweite zeigt 6. Wie groß ist $P(A \cap B)$?',
    [r'$\dfrac{1}{36}$', r'$\dfrac{1}{6}$', r'$\dfrac{1}{3}$', r'$\dfrac{1}{12}$'],
    [r'Die Würfel beeinflussen sich nicht: unabhängig.',
     r'$\dfrac{1}{6} \cdot \dfrac{1}{6} = \dfrac{1}{36}$'])

# -------------------------------------------------------------------- surveys ----
Q.q(r'Von 100 Befragten treiben 60 Sport, 40 machen Musik, 30 tun beides. Sind „Sport“ und „Musik“ unabhängig?',
    [r'Nein, $0{,}6 \cdot 0{,}4 = 0{,}24 \neq 0{,}3$.', r'Ja, $0{,}6 \cdot 0{,}4 = 0{,}24$.', r'Ja, weil $60 + 40 = 100$.', r'Nein, weil 30 kleiner als 40 ist.'],
    [r'$P(S) = 0{,}6$, $P(M) = 0{,}4$, $P(S \cap M) = 0{,}3$.',
     r'Das Produkt ist 0,24, nicht 0,3: abhängig.'])

Q.q(r'In derselben Befragung: Wie viele treiben weder Sport noch machen Musik?',
    [r'30', r'0', r'10', r'40'],
    [r'Mindestens eins: $60 + 40 - 30 = 70$.',
     r'Keins: $100 - 70 = 30$.'])

Q.q(r'Von 200 Personen tragen 80 eine Brille, 120 sind Frauen, 50 Frauen tragen eine Brille. Wie groß ist $P(\text{Frau} \cap \text{Brille})$?',
    [r'0,25', r'0,4', r'0,6', r'0,24'],
    [r'$\dfrac{50}{200} = 0{,}25$'])

Q.q(r'Sind in dieser Gruppe „Frau“ und „Brille“ unabhängig?',
    [r'Nein, $0{,}6 \cdot 0{,}4 = 0{,}24 \neq 0{,}25$, aber die Abweichung ist klein.', r'Ja, genau.', r'Nein, stark abhängig.', r'Das lässt sich ohne Baum nicht sagen.'],
    [r'$P(\text{Frau}) = 0{,}6$, $P(\text{Brille}) = 0{,}4$.',
     r'Streng genommen abhängig; bei Umfragedaten zeigen sich fast nie exakt gleiche Werte.'])

Q.q(r'Woran erkennt man Unabhängigkeit auch ohne Formel in einer Tabelle mit absoluten Zahlen?',
    [r'Der Anteil von $B$ ist in der Gruppe $A$ genauso groß wie in der Gruppe $\overline{A}$.', r'Alle vier Felder sind gleich groß.',
     r'Die Randsummen sind gleich.', r'Ein Feld ist null.'],
    [r'Beispiel: Brillenträger sind unter Frauen und Männern gleich häufig.'])

# ------------------------------------------------------------ tree and table ----
Q.q(r'Im Baumdiagramm gilt $P(A) = 0{,}4$, und auf dem Ast $A$ folgt $B$ mit 0,5. Welcher Eintrag gehört in das Feld $A \cap B$ der Vierfeldertafel?',
    [r'0,2', r'0,9', r'0,5', r'0,4'],
    [r'Pfadregel: $0{,}4 \cdot 0{,}5 = 0{,}2$.'])

Q.q(r'Welche Vierfeldertafel zeigt unabhängige Ereignisse? (Zeilen $A$, $\overline{A}$; Spalten $B$, $\overline{B}$)',
    [r'0,12 | 0,28 und 0,18 | 0,42', r'0,2 | 0,2 und 0,1 | 0,5', r'0,3 | 0,1 und 0,1 | 0,5', r'0,25 | 0,25 und 0,4 | 0,1'],
    [r'Randsummen der ersten Tafel: $P(A) = 0{,}4$, $P(B) = 0{,}3$.',
     r'$0{,}4 \cdot 0{,}3 = 0{,}12$, $0{,}4 \cdot 0{,}7 = 0{,}28$, $0{,}6 \cdot 0{,}3 = 0{,}18$, $0{,}6 \cdot 0{,}7 = 0{,}42$: Alle Felder passen.'])

Q.q(r'Wozu ist die Vierfeldertafel besonders nützlich?',
    [r'Sie zeigt alle Kombinationen zweier Merkmale mit ihren Randsummen auf einen Blick.', r'Sie ersetzt jede Rechnung.',
     r'Sie funktioniert nur bei unabhängigen Ereignissen.', r'Sie ist nur für Würfelspiele gedacht.'],
    [r'Fehlende Felder lassen sich über Zeilen- und Spaltensummen ergänzen.'])


def check():
    from fractions import Fraction as F
    d = lambda s: F(s)
    assert d('0.4') - d('0.2') == d('0.2') and d('0.3') - d('0.1') == d('0.2') and d('0.5') - d('0.2') == d('0.3')
    assert d('0.12') * 500 == 60
    assert d('0.4') * d('0.5') == d('0.2')
    pa, pb = d('0.3'), d('0.5')
    assert pa * pb == d('0.15') and pa + pb - pa * pb == d('0.65') and (1 - pa) * (1 - pb) == d('0.35')
    assert F(1, 6) ** 2 == F(1, 36)
    assert d('0.6') * d('0.4') == d('0.24') != d('0.3')
    assert 100 - (60 + 40 - 30) == 30
    assert F(50, 200) == d('0.25') and F(120, 200) * F(80, 200) == d('0.24')
    t = [[d('0.12'), d('0.28')], [d('0.18'), d('0.42')]]
    pA, pB = t[0][0] + t[0][1], t[0][0] + t[1][0]
    assert pA == d('0.4') and pB == d('0.3') and sum(map(sum, t)) == 1
    assert all(t[i][j] == (pA if i == 0 else 1 - pA) * (pB if j == 0 else 1 - pB) for i in range(2) for j in range(2))
    for bad in ([[d('0.2'), d('0.2')], [d('0.1'), d('0.5')]], [[d('0.3'), d('0.1')], [d('0.1'), d('0.5')]], [[d('0.25'), d('0.25')], [d('0.4'), d('0.1')]]):
        a, b = bad[0][0] + bad[0][1], bad[0][0] + bad[1][0]
        assert sum(map(sum, bad)) == 1 and bad[0][0] != a * b


Q.verify(check)
Q.save()
