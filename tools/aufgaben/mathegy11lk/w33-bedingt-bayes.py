#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 33 / KW 19 (LB 4): conditional probability, reverse tree, total probability and
Bayes' theorem (with source), medical tests. 17 new questions, 3 from the Grundkurs sheet mathegy11/w32.
Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=33, slug='bedingt-bayes', thema='Bedingte Wahrscheinlichkeit und Satz von Bayes', lb='LB 4',
           blurb='bedingte Wahrscheinlichkeit, Baum und umgekehrter Baum, totale Wahrscheinlichkeit, Bayes, medizinische Tests',
           comment='New questions on conditional probability and Bayes (source in the steps); 3 from mathegy11/w32.')

qs, check_gk = harvest('w32-vierfeldertafel.py', [14, 17, 19])
gk = dict(zip([14, 17, 19], qs))


def take(q):
    Q.q(*q[0], **q[1])


take(gk[19])

Q.q(r'Wie ist die bedingte Wahrscheinlichkeit $P_B(A)$, die Wahrscheinlichkeit von $A$ unter der Bedingung $B$, definiert?',
    [r'$P_B(A) = \dfrac{P(A \cap B)}{P(B)}$', r'$P_B(A) = \dfrac{P(A \cap B)}{P(A)}$', r'$P_B(A) = P(A) \cdot P(B)$', r'$P_B(A) = P(A) - P(B)$'],
    [r'Man betrachtet nur noch die Fälle, in denen $B$ eingetreten ist.',
     r'Darunter ist der Anteil von $A$ gesucht.'])

Q.q(r'Es gilt $P(A \cap B) = 0{,}12$ und $P(B) = 0{,}4$. Wie groß ist $P_B(A)$?',
    [r'0,3', r'0,048', r'0,52', r'0,12'],
    [r'$\dfrac{0{,}12}{0{,}4} = 0{,}3$'])

Q.q(r'Was steht im Baumdiagramm auf dem Ast, der von $A$ nach $B$ führt?',
    [r'$P_A(B)$', r'$P(B)$', r'$P(A \cap B)$', r'$P_B(A)$'],
    [r'Auf der zweiten Stufe stehen bedingte Wahrscheinlichkeiten.',
     r'Das Produkt längs des Pfades ist $P(A) \cdot P_A(B) = P(A \cap B)$.'])

Q.q(r'Es gilt $P(A) = 0{,}3$ und $P_A(B) = 0{,}6$. Wie groß ist $P(A \cap B)$?',
    [r'0,18', r'0,9', r'0,5', r'0,3'],
    [r'Multiplikationssatz: $P(A \cap B) = P(A) \cdot P_A(B)$.'])

Q.q(r'In einer Urne liegen 3 rote und 2 blaue Kugeln. Wie groß ist die Wahrscheinlichkeit, dass die zweite Kugel rot ist, wenn die erste rot war (ohne Zurücklegen)?',
    [r'$\dfrac{1}{2}$', r'$\dfrac{3}{5}$', r'$\dfrac{3}{10}$', r'$\dfrac{2}{5}$'],
    [r'Nach dem ersten Zug liegen noch 2 rote und 2 blaue Kugeln in der Urne.',
     r'Ziehen ohne Zurücklegen liefert bedingte Wahrscheinlichkeiten.'])
take(gk[14])

Q.q(r'In derselben Gruppe (200 Personen, 120 Frauen, 80 mit Brille, 50 Frauen mit Brille): Wie groß ist $P_{\text{Frau}}(\text{Brille})$?',
    [r'$\dfrac{50}{120} \approx 0{,}417$', r'$\dfrac{50}{80} = 0{,}625$', r'$\dfrac{50}{200} = 0{,}25$', r'$\dfrac{80}{200} = 0{,}4$'],
    [r'Bezugsgruppe sind nur die 120 Frauen.'])

Q.q(r'Und wie groß ist $P_{\text{Brille}}(\text{Frau})$?',
    [r'$\dfrac{50}{80} = 0{,}625$', r'$\dfrac{50}{120} \approx 0{,}417$', r'$\dfrac{120}{200} = 0{,}6$', r'$\dfrac{50}{200} = 0{,}25$'],
    [r'Jetzt sind die 80 Personen mit Brille die Bezugsgruppe.',
     r'Im Allgemeinen ist $P_A(B) \neq P_B(A)$.'])
take(gk[17])

Q.q(r'In einer Vierfeldertafel gilt $P(A \cap B) = 0{,}2$ und $P(\overline{A} \cap B) = 0{,}3$. Wie groß ist $P_B(A)$?',
    [r'0,4', r'0,2', r'0,5', r'$\dfrac{2}{3}$'],
    [r'Spalte $B$: $P(B) = 0{,}2 + 0{,}3 = 0{,}5$.',
     r'$P_B(A) = \dfrac{0{,}2}{0{,}5} = 0{,}4$'])

Q.q(r'Es gilt $P(A) = 0{,}4$, $P_A(B) = 0{,}5$ und $P_{\overline{A}}(B) = 0{,}25$. Wie groß ist $P(B)$?',
    [r'0,35', r'0,75', r'0,2', r'0,125'],
    [r'Satz von der totalen Wahrscheinlichkeit: Summe der beiden Pfade, die zu $B$ führen.',
     r'$0{,}4 \cdot 0{,}5 + 0{,}6 \cdot 0{,}25 = 0{,}2 + 0{,}15$'])

Q.q(r'Mit denselben Werten: Wie groß ist $P_B(A)$ nach dem Satz von Bayes?',
    [r'$\dfrac{4}{7} \approx 0{,}571$', r'0,5', r'0,4', r'$\dfrac{2}{7} \approx 0{,}286$'],
    [r'$P_B(A) = \dfrac{P(A) \cdot P_A(B)}{P(B)} = \dfrac{0{,}2}{0{,}35}$.',
     r'Quelle: T. Bayes, An Essay towards solving a Problem in the Doctrine of Chances, Philosophical Transactions 53 (1763), S. 370–418; nach seinem Tod von R. Price herausgegeben.'])

Q.q(r'Was steht beim umgekehrten Baum auf der ersten Stufe?',
    [r'$P(B)$ und $P(\overline{B})$', r'$P(A)$ und $P(\overline{A})$', r'$P_A(B)$ und $P_A(\overline{B})$', r'nur $P(A \cap B)$'],
    [r'Der umgekehrte Baum beginnt mit dem zweiten Merkmal, zum Beispiel dem Testergebnis.',
     r'Auf der zweiten Stufe stehen dann $P_B(A)$ und $P_B(\overline{A})$.'])

# --------------------------------------------------------- medical test ----
Q.q(r'Eine Krankheit hat 1 % der Bevölkerung. Ein Test erkennt 99 % der Kranken, schlägt aber auch bei 5 % der Gesunden an. Wie groß ist $P(\text{positiv})$?',
    [r'etwa 5,9 %', r'99 %', r'1 %', r'5 %'],
    [r'$0{,}01 \cdot 0{,}99 + 0{,}99 \cdot 0{,}05 = 0{,}0099 + 0{,}0495 = 0{,}0594$'])

Q.q(r'Welche bedingte Wahrscheinlichkeit beschreibt die Angabe „Der Test erkennt 99 % der Kranken“ ($K$: krank, $T$: Test positiv)?',
    [r'$P_K(T) = 0{,}99$', r'$P_T(K) = 0{,}99$', r'$P(K \cap T) = 0{,}99$', r'$P(T) = 0{,}99$'],
    [r'Bezugsgruppe sind die Kranken; unter ihnen ist der Test zu 99 % positiv (Sensitivität).',
     r'$P_T(K)$ ist die Frage der übernächsten Aufgabe, und die Antwort ist eine ganz andere Zahl.'])

Q.q(r'Derselbe Test fällt positiv aus. Wie wahrscheinlich ist die Person wirklich krank?',
    [r'etwa 17 %', r'99 %', r'95 %', r'50 %'],
    [r'Bayes: $\dfrac{0{,}0099}{0{,}0594} = \dfrac{1}{6} \approx 0{,}167$.'])

Q.q(r'Mit natürlichen Häufigkeiten: Wie viele positive Befunde gibt es unter 10 000 Personen?',
    [r'594, davon 99 Kranke', r'99, alle krank', r'100, alle krank', r'500, davon 100 Kranke'],
    [r'100 Kranke, davon 99 positiv; 9900 Gesunde, davon 495 positiv.',
     r'Von 594 positiven Befunden stammen nur 99 von Kranken.'])

Q.q(r'Warum ist ein positiver Befund bei diesem Test meistens falsch-positiv, obwohl er 99 % der Kranken erkennt?',
    [r'Weil die Krankheit selten ist: Die vielen Gesunden liefern mehr Fehlalarme als die wenigen Kranken echte Treffer.',
     r'Weil der Test schlecht gebaut ist.', r'Weil 99 % zu wenig sind.', r'Das ist falsch, ein positiver Befund bedeutet fast sicher krank.'],
    [r'Entscheidend ist die Grundrate (Prävalenz) von 1 %.'])

Q.q(r'Die Person mit positivem Befund wird ein zweites Mal unabhängig getestet, wieder positiv. Wie wahrscheinlich ist sie jetzt krank?',
    [r'etwa 80 %', r'etwa 17 %', r'etwa 99 %', r'etwa 34 %'],
    [r'Neue Ausgangswahrscheinlichkeit: $\tfrac{1}{6}$.',
     r'$\dfrac{\frac{1}{6} \cdot 0{,}99}{\frac{1}{6} \cdot 0{,}99 + \frac{5}{6} \cdot 0{,}05} \approx 0{,}80$'])


def check():
    from fractions import Fraction as F
    check_gk()
    assert F(12, 100) / F(4, 10) == F(3, 10)
    assert F(3, 10) * F(6, 10) == F(18, 100)
    assert F(2, 4) == F(1, 2) and F(2, 10) / (F(2, 10) + F(3, 10)) == F(4, 10)
    assert abs(50 / 120 - 0.417) < 0.0005 and 50 / 80 == 0.625
    pB = F(4, 10) * F(1, 2) + F(6, 10) * F(1, 4)
    assert pB == F(35, 100) and F(2, 10) / pB == F(4, 7) and abs(4 / 7 - 0.571) < 0.0005
    pos = F(1, 100) * F(99, 100) + F(99, 100) * F(5, 100)
    assert pos == F(594, 10000) and F(99, 10000) / pos == F(1, 6)
    assert 10000 // 100 == 100 and 99 + 495 == 594 and 9900 * 5 // 100 == 495
    q = F(1, 6) * F(99, 100) / (F(1, 6) * F(99, 100) + F(5, 6) * F(5, 100))
    assert abs(float(q) - 0.80) < 0.005


Q.verify(check)
Q.save()
