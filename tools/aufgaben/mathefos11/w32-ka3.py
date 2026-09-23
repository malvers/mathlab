#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 32 / KW 18 (LB 2): Wiederholung fuer Klausur 3 -
quer durch den ganzen Lernbereich 2. Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=32, slug='ka3', thema='Wiederholung für Klausur 3', lb='LB 2',
          blurb='Ereignisse, Laplace, Verknüpfungen, Pfadregeln, Abzählprobleme, Bernoulli',
          comment='Blocks: Grundbegriffe und Laplace (1-5), Verknuepfungen (6-9), Baum und Pfade (10-14), Abzaehlen und Bernoulli (15-20). Urne in Block 3: 3 rote und 2 weisse Kugeln.')

# ------------------------------------------------- Grundbegriffe und Laplace ----
Q.q(r'Wie viele Elemente hat die Ergebnismenge beim zweimaligen Werfen einer Münze, wenn die Reihenfolge zählt?',
    [r'vier', r'zwei', r'drei', r'acht'],
    [r'$\Omega = \{\text{KK};\,\text{KZ};\,\text{ZK};\,\text{ZZ}\}$',
     r'Zählprinzip: $2 \cdot 2 = 4$.',
     r'KZ und ZK sind verschiedene Ergebnisse.'])

Q.q(r'Beim Würfeln sei $A$ = „ungerade Augenzahl“. Wie groß ist $P(A)$?',
    [r'$\dfrac{1}{2}$', r'$\dfrac{1}{3}$', r'$\dfrac{1}{6}$', r'$\dfrac{2}{3}$'],
    [r'$A = \{1;\,3;\,5\}$, also drei günstige von sechs möglichen Ergebnissen.',
     r'$P(A) = \dfrac{3}{6} = \dfrac{1}{2}$',
     r'Gerade und ungerade sind beim fairen Würfel gleich wahrscheinlich.'])

Q.q(r'Für ein Ereignis gilt $P(A) = 0{,}25$. Wie groß ist $P\left(\overline{A}\right)$?',
    [r'$0{,}75$', r'$0{,}25$', r'$0{,}5$', r'$1{,}25$'],
    [r'$P\left(\overline{A}\right) = 1 - P(A)$',
     r'$= 1 - 0{,}25 = 0{,}75$',
     r'Ereignis und Gegenereignis ergänzen sich zu $1$.'])

Q.q(r'Unter welcher Voraussetzung darf man Wahrscheinlichkeiten durch Abzählen bestimmen?',
    [r'wenn alle Ergebnisse gleich wahrscheinlich sind', r'wenn es höchstens sechs Ergebnisse gibt',
     r'wenn der Versuch mehrstufig ist', r'immer'],
    [r'Das Abzählen günstiger durch mögliche Fälle ist die Laplace-Formel.',
     r'Sie setzt Gleichwahrscheinlichkeit aller Ergebnisse voraus.',
     r'Bei einer Urne mit unterschiedlich vielen Kugeln je Farbe gilt sie nur, wenn man die Kugeln einzeln zählt.'])

Q.q(r'In $80$ Würfen fällt $28$-mal eine gerade Augenzahl. Wie groß ist die relative Häufigkeit?',
    [r'$0{,}35$', r'$0{,}5$', r'$28$', r'$2{,}86$'],
    [r'$h = \dfrac{28}{80}$',
     r'$= 0{,}35$',
     r'Der theoretische Wert wäre $0{,}5$ — bei $80$ Würfen ist eine solche Abweichung möglich, aber auffällig.'])

# -------------------------------------------------------------- Verknüpfungen ----
Q.q(r'$A$ und $B$ sind unvereinbar mit $P(A) = 0{,}5$ und $P(B) = 0{,}2$. Wie groß ist $P(A \cup B)$?',
    [r'$0{,}7$', r'$0{,}1$', r'$0{,}3$', r'$0{,}6$'],
    [r'Unvereinbar bedeutet $P(A \cap B) = 0$.',
     r'$P(A \cup B) = 0{,}5 + 0{,}2 - 0 = 0{,}7$',
     r'Nur bei unvereinbaren Ereignissen darf einfach addiert werden.'])

Q.q(r'Was bedeutet $A \cap B = \{\}$?',
    [r'Die Ereignisse sind unvereinbar, sie können nicht gemeinsam eintreten.',
     r'Die Ereignisse sind unabhängig.',
     r'Beide Ereignisse sind unmöglich.',
     r'Die Ereignisse ergänzen sich zu $\Omega$.'],
    [r'Der Durchschnitt ist leer: kein Ergebnis gehört zu beiden.',
     r'Tritt das eine ein, ist das andere ausgeschlossen.',
     r'Unabhängigkeit ist etwas anderes, sie betrifft die Wahrscheinlichkeiten.'])

Q.q(r'Für $P(A \cup B) = 0{,}7$ — wie groß ist die Wahrscheinlichkeit, dass weder $A$ noch $B$ eintritt?',
    [r'$0{,}3$', r'$0{,}7$', r'$0$', r'$1{,}7$'],
    [r'„Weder noch“ ist das Gegenereignis zu $A \cup B$.',
     r'Nach de Morgan: $\overline{A \cup B} = \overline{A} \cap \overline{B}$.',
     r'$P = 1 - 0{,}7 = 0{,}3$'])

Q.q(r'Gegeben sind $P(A) = 0{,}6$, $P(B) = 0{,}5$ und $P(A \cap B) = 0{,}3$. Sind $A$ und $B$ unabhängig?',
    [r'Ja, denn $0{,}6 \cdot 0{,}5 = 0{,}3$.', r'Nein, denn $0{,}6 + 0{,}5 > 1$.',
     r'Nein, denn sie überschneiden sich.', r'Das lässt sich nicht entscheiden.'],
    [r'Die Bedingung lautet $P(A \cap B) = P(A) \cdot P(B)$.',
     r'$0{,}6 \cdot 0{,}5 = 0{,}3$, und genau das ist gegeben.',
     r'Also unabhängig — eine Überschneidung spricht nicht dagegen.'])

# ------------------------------------------------------------ Baum und Pfade ----
Q.q(r'Eine Urne enthält $3$ rote und $2$ weiße Kugeln. Zweimal wird MIT Zurücklegen gezogen. Wie groß ist die Wahrscheinlichkeit für zweimal Rot?',
    [r'$\dfrac{9}{25}$', r'$\dfrac{3}{10}$', r'$\dfrac{6}{25}$', r'$\dfrac{3}{5}$'],
    [r'Mit Zurücklegen bleibt $P(\text{rot}) = \dfrac{3}{5}$.',
     r'$P = \dfrac{3}{5} \cdot \dfrac{3}{5} = \dfrac{9}{25}$',
     r'Erste Pfadregel: längs eines Pfades wird multipliziert.'])

Q.q(r'Dieselbe Urne, zweimal OHNE Zurücklegen. Wie groß ist die Wahrscheinlichkeit für zweimal Rot?',
    [r'$\dfrac{3}{10}$', r'$\dfrac{9}{25}$', r'$\dfrac{6}{20}$ und damit $\dfrac{1}{4}$', r'$\dfrac{2}{5}$'],
    [r'Erster Zug $\dfrac{3}{5}$, danach sind noch $2$ rote unter $4$ Kugeln.',
     r'$P = \dfrac{3}{5} \cdot \dfrac{2}{4} = \dfrac{6}{20} = \dfrac{3}{10}$',
     r'Etwas weniger als mit Zurücklegen.'])

Q.q(r'Dieselbe Urne, zweimal mit Zurücklegen: wie groß ist die Wahrscheinlichkeit für genau einmal Rot?',
    [r'$\dfrac{12}{25}$', r'$\dfrac{6}{25}$', r'$\dfrac{9}{25}$', r'$\dfrac{4}{25}$'],
    [r'Zwei Pfade: rot-weiß und weiß-rot.',
     r'Jeder hat $\dfrac{3}{5} \cdot \dfrac{2}{5} = \dfrac{6}{25}$.',
     r'Zweite Pfadregel: addieren, also $\dfrac{12}{25}$.'])

Q.q(r'Dieselbe Urne, zweimal mit Zurücklegen: wie groß ist die Wahrscheinlichkeit für mindestens einmal Rot?',
    [r'$\dfrac{21}{25}$', r'$\dfrac{12}{25}$', r'$\dfrac{9}{25}$', r'$\dfrac{4}{25}$'],
    [r'Gegenereignis: zweimal Weiß mit $\dfrac{2}{5} \cdot \dfrac{2}{5} = \dfrac{4}{25}$.',
     r'$1 - \dfrac{4}{25} = \dfrac{21}{25}$',
     r'Probe: $\dfrac{9}{25} + \dfrac{12}{25} = \dfrac{21}{25}$.'])

Q.q(r'Welche Pfadregel gilt, wenn mehrere Pfade zu einem Ereignis gehören?',
    [r'Ihre Wahrscheinlichkeiten werden addiert.', r'Ihre Wahrscheinlichkeiten werden multipliziert.',
     r'Man nimmt den größten Wert.', r'Man teilt durch die Zahl der Pfade.'],
    [r'Längs eines Pfades wird multipliziert — das ist die erste Regel.',
     r'Über mehrere Pfade hinweg wird addiert — das ist die zweite.',
     r'Erlaubt ist das, weil verschiedene Pfade einander ausschließen.'])

# -------------------------------------------------- Abzählen und Bernoulli ----
Q.q(r'Auf wie viele Arten lassen sich $4$ verschiedene Karten anordnen?',
    [r'$24$', r'$16$', r'$12$', r'$4$'],
    [r'$4! = 4 \cdot 3 \cdot 2 \cdot 1$',
     r'$= 24$',
     r'Das ist eine Permutation ohne Wiederholung.'])

Q.q(r'Aus $7$ Personen werden $2$ für ein Team ausgewählt. Wie viele Möglichkeiten gibt es?',
    [r'$21$', r'$42$', r'$49$', r'$14$'],
    [r'Die Reihenfolge spielt keine Rolle.',
     r'$\binom{7}{2} = \dfrac{7 \cdot 6}{2} = 21$',
     r'$42$ wäre die Zählung mit Reihenfolge.'])

Q.q(r'Wie viele dreistellige Zahlen lassen sich aus den Ziffern $1$ bis $9$ bilden, wenn Ziffern mehrfach vorkommen dürfen?',
    [r'$729$', r'$504$', r'$84$', r'$27$'],
    [r'Für jede der drei Stellen stehen $9$ Ziffern zur Verfügung.',
     r'$9^3 = 729$',
     r'Ohne Wiederholung wären es $9 \cdot 8 \cdot 7 = 504$.'])

Q.q(r'Ein Versuch mit $p = \dfrac{1}{3}$ wird dreimal wiederholt. Wie groß ist die Wahrscheinlichkeit für drei Treffer?',
    [r'$\dfrac{1}{27}$', r'$\dfrac{1}{9}$', r'$\dfrac{1}{3}$', r'$\dfrac{3}{27}$'],
    [r'$P = \binom{3}{3} \cdot \left(\dfrac{1}{3}\right)^3$',
     r'$= 1 \cdot \dfrac{1}{27} = \dfrac{1}{27}$',
     r'Für $k = n$ ist der Binomialkoeffizient $1$.'])

Q.q(r'Eine Münze wird viermal geworfen. Wie groß ist die Wahrscheinlichkeit für genau dreimal Kopf?',
    [r'$\dfrac{1}{4}$', r'$\dfrac{3}{8}$', r'$\dfrac{1}{16}$', r'$\dfrac{3}{4}$'],
    [r'$P = \binom{4}{3} \cdot \left(\dfrac{1}{2}\right)^4 = 4 \cdot \dfrac{1}{16}$',
     r'$= \dfrac{4}{16} = \dfrac{1}{4}$',
     r'Der Faktor $4$ steht für die vier möglichen Positionen der Zahl.'])

Q.q(r'Ein Würfel wird viermal geworfen. Wie groß ist die Wahrscheinlichkeit für mindestens eine Sechs?',
    [r'$\dfrac{671}{1296} \approx 0{,}518$', r'$\dfrac{625}{1296} \approx 0{,}482$',
     r'$\dfrac{4}{6} \approx 0{,}667$', r'$\dfrac{1}{1296}$'],
    [r'Gegenereignis: keine Sechs mit $\left(\dfrac{5}{6}\right)^4 = \dfrac{625}{1296}$.',
     r'$1 - \dfrac{625}{1296} = \dfrac{671}{1296} \approx 0{,}518$',
     r'Knapp über der Hälfte — die naive Rechnung $4 \cdot \dfrac{1}{6} = \dfrac{2}{3}$ ist deutlich zu groß.'])


def check():
    from math import comb, factorial as fa
    from fractions import Fraction as F
    assert 2 * 2 == 4 and F(3, 6) == F(1, 2)
    assert 1 - F(25, 100) == F(75, 100)
    assert F(28, 80) == F(35, 100)
    # Verknuepfungen
    assert F(5, 10) + F(2, 10) == F(7, 10)
    assert 1 - F(7, 10) == F(3, 10)
    assert F(6, 10) * F(5, 10) == F(3, 10)
    # Baum, Urne 3 rot 2 weiss
    r, w = F(3, 5), F(2, 5)
    assert r * r == F(9, 25) and w * w == F(4, 25) and r * w == F(6, 25)
    assert r * F(2, 4) == F(6, 20) == F(3, 10) and F(3, 10) < F(9, 25)
    assert 2 * (r * w) == F(12, 25)
    assert 1 - w * w == F(21, 25) and r * r + 2 * r * w == F(21, 25)
    # Abzaehlen und Bernoulli
    assert fa(4) == 24 and comb(7, 2) == 21 and 7 * 6 == 42
    assert 9 ** 3 == 729 and 9 * 8 * 7 == 504
    assert comb(3, 3) * F(1, 3) ** 3 == F(1, 27)
    assert comb(4, 3) * F(1, 2) ** 4 == F(4, 16) == F(1, 4)
    assert F(5, 6) ** 4 == F(625, 1296) and 1 - F(625, 1296) == F(671, 1296)
    assert abs(float(F(671, 1296)) - 0.518) < 0.0005 and abs(float(F(625, 1296)) - 0.482) < 0.0005
    assert 4 * F(1, 6) == F(2, 3)


Q.verify(check)
Q.save()
