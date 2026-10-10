#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 28 / KW 14 (LB 5): Zufallsversuche, relative
Häufigkeit, Simulation mit Zufallszahlen, Monte-Carlo-Methode. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=28, slug='simulation', thema='Zufallsversuche simulieren', lb='LB 5',
        blurb='Ergebnis und Ereignis, relative Häufigkeit, Zufallszahlen, Monte-Carlo-Methode',
        comment='Blocks: events and Laplace probabilities (1-3, 11-14, 18-20), relative frequency and the law of large numbers (4-5, 10, 15, 17), simulation (6-9, 16).')

# ------------------------------------------------- Ereignisse, Laplace ----
Q.q(r'Ein Würfel wird geworfen. Welche Ergebnisse gehören zum Ereignis „gerade Augenzahl“?',
    [r'2, 4 und 6', r'1, 3 und 5', r'nur 6', r'2 und 4'],
    [r'Ein Ereignis fasst Ergebnisse zusammen.',
     r'Gerade Augenzahlen sind 2, 4 und 6.'])

Q.q(r'Wie groß ist die Wahrscheinlichkeit für eine gerade Augenzahl beim Würfeln?',
    [r'$\dfrac{1}{2}$', r'$\dfrac{1}{6}$', r'$\dfrac{1}{3}$', r'$\dfrac{2}{3}$'],
    [r'Laplace: $P = \dfrac{\text{günstige Ergebnisse}}{\text{mögliche Ergebnisse}}$',
     r'$P = \dfrac{3}{6} = \dfrac{1}{2}$'])

Q.q(r'Wie groß ist die Wahrscheinlichkeit, eine Augenzahl größer als 4 zu würfeln?',
    [r'$\dfrac{1}{3}$', r'$\dfrac{1}{2}$', r'$\dfrac{1}{6}$', r'$\dfrac{2}{3}$'],
    [r'Günstig sind 5 und 6, also 2 von 6 Ergebnissen.',
     r'$P = \dfrac{2}{6} = \dfrac{1}{3}$'])

# ------------------------------------------------------ relative Häufigkeit ----
Q.q(r'Bei 50 Würfen fiel 9-mal eine Sechs. Wie groß ist die relative Häufigkeit der Sechs?',
    [r'0,18', r'0,09', r'9', r'0,5'],
    [r'Relative Häufigkeit $= \dfrac{\text{absolute Häufigkeit}}{\text{Anzahl der Versuche}}$',
     r'$\dfrac{9}{50} = 0{,}18$'])

Q.q(r'Was besagt das Gesetz der großen Zahlen?',
    [r'Bei sehr vielen Versuchen liegt die relative Häufigkeit meist nahe bei der Wahrscheinlichkeit.',
     r'Nach vielen Würfen ohne Sechs kommt die Sechs bald.',
     r'Bei vielen Versuchen tritt jedes Ergebnis gleich oft auf.',
     r'Große Zahlen werden öfter gewürfelt.'],
    [r'Die relative Häufigkeit schwankt bei wenigen Versuchen stark.',
     r'Bei vielen Versuchen stabilisiert sie sich in der Nähe der Wahrscheinlichkeit; genau gleich oft muss nichts auftreten.'])

# --------------------------------------------------------------- Simulation ----
Q.q(r'Wie kann man einen Münzwurf mit Zufallszahlen simulieren?',
    [r'Zufallszahlen 0 oder 1 erzeugen: 0 steht für Kopf, 1 für Zahl.',
     r'Zufallszahlen von 1 bis 6 erzeugen: 1 steht für Kopf, sonst Zahl.',
     r'Immer abwechselnd Kopf und Zahl aufschreiben.',
     r'Nur gerade Zufallszahlen verwenden.'],
    [r'Beide Ergebnisse müssen dieselbe Wahrscheinlichkeit $\dfrac{1}{2}$ haben.',
     r'Bei 1 bis 6 hätte Kopf nur $\dfrac{1}{6}$.'])

Q.q(r'Ein Taschenrechner liefert mit RanInt(1, 6) ganze Zufallszahlen. Was wird damit simuliert?',
    [r'ein Würfelwurf', r'ein Münzwurf', r'eine Ziehung aus 1 bis 49', r'ein Glücksrad mit zwei Feldern'],
    [r'Die Zahlen 1 bis 6 erscheinen mit gleicher Wahrscheinlichkeit.',
     r'Das entspricht einem fairen Würfel.'])

Q.q(r'Monte-Carlo-Methode: In ein Quadrat mit Seitenlänge 1 werden 1000 Zufallspunkte gesetzt, 784 liegen im Viertelkreis mit Radius 1. Welcher Näherungswert für $\pi$ ergibt sich?',
    [r'3,136', r'0,784', r'7,84', r'3,142'],
    [r'Anteil im Viertelkreis $\approx \dfrac{\pi}{4}$, denn Viertelkreis $\dfrac{\pi}{4}$, Quadrat 1.',
     r'$\dfrac{\pi}{4} \approx 0{,}784$, also $\pi \approx 4 \cdot 0{,}784 = 3{,}136$.'])

Q.q(r'Warum simuliert man Zufallsversuche, zum Beispiel beim Sammeln von Sammelbildern?',
    [r'Weil die Rechnung schwierig sein kann und man viele Versuche schnell durchführen kann.',
     r'Weil die Simulation immer das genaue Ergebnis liefert.',
     r'Weil echte Zufallsversuche verboten sind.',
     r'Weil man dabei keine Zufallszahlen braucht.'],
    [r'Eine Simulation ersetzt den echten Versuch durch Zufallszahlen.',
     r'Mit vielen Durchläufen erhält man gute Schätzwerte, aber keine exakten Werte.'])

Q.q(r'Ein Würfel wird 600-mal geworfen. Wie oft erwartet man ungefähr eine Sechs?',
    [r'etwa 100-mal', r'genau 100-mal', r'etwa 60-mal', r'etwa 300-mal'],
    [r'$600 \cdot \dfrac{1}{6} = 100$',
     r'Das ist ein Erwartungswert; genau 100-mal muss es nicht sein.'])

Q.q(r'Ein Glücksrad hat ein Gewinnfeld mit $90^\circ$. Wie groß ist die Gewinnwahrscheinlichkeit?',
    [r'$\dfrac{1}{4}$', r'$\dfrac{1}{9}$', r'$\dfrac{1}{2}$', r'$\dfrac{1}{90}$'],
    [r'Der Anteil am Vollkreis bestimmt die Wahrscheinlichkeit.',
     r'$\dfrac{90^\circ}{360^\circ} = \dfrac{1}{4}$'])

Q.q(r'In einer Urne liegen 3 rote und 5 blaue Kugeln. Wie groß ist die Wahrscheinlichkeit, eine rote zu ziehen?',
    [r'$\dfrac{3}{8}$', r'$\dfrac{3}{5}$', r'$\dfrac{5}{8}$', r'$\dfrac{1}{3}$'],
    [r'Insgesamt 8 Kugeln, davon 3 rot.',
     r'$P = \dfrac{3}{8}$'])

Q.q(r'Wie groß ist die Wahrscheinlichkeit, beim Würfeln keine Sechs zu werfen?',
    [r'$\dfrac{5}{6}$', r'$\dfrac{1}{6}$', r'0', r'$\dfrac{1}{5}$'],
    [r'Gegenereignis zu „Sechs“: $P = 1 - \dfrac{1}{6}$',
     r'$P = \dfrac{5}{6}$'])

Q.q(r'Zwei Würfel werden geworfen. Wie groß ist die Wahrscheinlichkeit für die Augensumme 7?',
    [r'$\dfrac{1}{6}$', r'$\dfrac{1}{12}$', r'$\dfrac{7}{36}$', r'$\dfrac{1}{11}$'],
    [r'Es gibt $6 \cdot 6 = 36$ gleich wahrscheinliche Paare.',
     r'Summe 7: (1|6), (2|5), (3|4), (4|3), (5|2), (6|1), also 6 Paare.',
     r'$P = \dfrac{6}{36} = \dfrac{1}{6}$; $\dfrac{1}{11}$ wäre falsch, weil die 11 Summen nicht gleich wahrscheinlich sind.'])

Q.q(r'Eine Reißzwecke wurde 1000-mal geworfen und landete 620-mal mit der Spitze nach oben. Wie schätzt man die Wahrscheinlichkeit dafür?',
    [r'etwa 0,62', r'genau 0,5', r'etwa 0,38', r'Das lässt sich nicht schätzen.'],
    [r'Eine Reißzwecke ist kein Laplace-Versuch: Die Lagen sind nicht gleich wahrscheinlich.',
     r'Schätzwert ist die relative Häufigkeit nach vielen Würfen: $\dfrac{620}{1000} = 0{,}62$.'])

Q.q(r'Ein Ereignis hat die Wahrscheinlichkeit 0,3. Wie simulierst du es mit Zufallszahlen von 1 bis 10?',
    [r'Die Zahlen 1, 2 und 3 zählen als Treffer, 4 bis 10 nicht.', r'Nur die Zahl 3 zählt als Treffer.',
     r'Die Zahlen 1 bis 7 zählen als Treffer.', r'Jede gerade Zahl zählt als Treffer.'],
    [r'Drei von zehn gleich wahrscheinlichen Zahlen ergeben $\dfrac{3}{10} = 0{,}3$.'])

Q.q(r'Zwei Gruppen simulieren je 20 Würfelwürfe. Gruppe A erhält 4 Sechsen, Gruppe B 7 Sechsen. Was stimmt?',
    [r'Beides ist möglich, bei wenigen Versuchen schwanken die Ergebnisse.', r'Gruppe B hat falsch gerechnet.',
     r'Gruppe A hat falsch gerechnet.', r'Der Würfel ist sicher gezinkt.'],
    [r'Erwartet sind etwa $20 : 6 \approx 3{,}3$ Sechsen.',
     r'Bei nur 20 Würfen sind 4 oder 7 Sechsen durchaus möglich.'])

Q.q(r'Wann heißt ein Zufallsversuch Laplace-Versuch?',
    [r'wenn alle Ergebnisse gleich wahrscheinlich sind', r'wenn er genau zwei Ergebnisse hat',
     r'wenn er mit einem Würfel durchgeführt wird', r'wenn er sehr oft wiederholt wird'],
    [r'Nur dann gilt $P = \dfrac{\text{günstig}}{\text{möglich}}$.'])

Q.q(r'Wie groß ist die Wahrscheinlichkeit, beim Würfeln eine Primzahl zu werfen?',
    [r'$\dfrac{1}{2}$', r'$\dfrac{2}{3}$', r'$\dfrac{1}{3}$', r'$\dfrac{1}{6}$'],
    [r'Primzahlen bis 6: 2, 3 und 5. Die 1 ist keine Primzahl.',
     r'$P = \dfrac{3}{6} = \dfrac{1}{2}$'])

Q.q(r'Wie groß ist die Wahrscheinlichkeit, mit einem normalen Würfel eine 7 zu werfen?',
    [r'0', r'$\dfrac{1}{7}$', r'$\dfrac{1}{6}$', r'1'],
    [r'Die 7 ist kein mögliches Ergebnis.',
     r'Ein unmögliches Ereignis hat die Wahrscheinlichkeit 0.'])


def check():
    from fractions import Fraction as F
    D = range(1, 7)
    assert [d for d in D if d % 2 == 0] == [2, 4, 6] and F(3, 6) == F(1, 2)
    assert F(len([d for d in D if d > 4]), 6) == F(1, 3)
    assert F(9, 50) == F('0.18')
    assert 4 * F(784, 1000) == F('3.136')
    assert 600 * F(1, 6) == 100
    assert F(90, 360) == F(1, 4) and F(3, 8) == F(3, 3 + 5)
    assert 1 - F(1, 6) == F(5, 6)
    assert F(len([(a, b) for a in D for b in D if a + b == 7]), 36) == F(1, 6)
    assert F(620, 1000) == F('0.62') and F(3, 10) == F('0.3')
    assert round(20 / 6, 1) == 3.3
    primes = [d for d in D if d > 1 and all(d % q for q in range(2, d))]
    assert primes == [2, 3, 5] and F(len(primes), 6) == F(1, 2)


Q.verify(check)
Q.save()
