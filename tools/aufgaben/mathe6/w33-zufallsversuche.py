#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 33 / KW 19 (LB 5): random experiments - outcomes, tally
charts, absolute and relative frequency, the experiment as an assignment.
Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from itertools import product
from quiz import os6
from osfig import gluecksrad, RED, GREEN, BLUE

Q = os6(nr=33, slug='zufallsversuche', thema='Zufallsversuche', lb='LB 5',
        blurb='Ergebnisse, Strichliste, absolute und relative Häufigkeit',
        comment='Blocks: experiments and outcomes (1-5, 18-20), tally and absolute frequency (6-7, 12), relative frequency (8-11, 13-17).')

RAD = [('R', RED), ('B', BLUE), ('R', RED), ('G', GREEN), ('R', RED), ('B', BLUE), ('R', RED), ('B', BLUE)]
TAB = {1: 8, 2: 11, 3: 9, 4: 12, 5: 10}

# ------------------------------------------------------ experiments, outcomes ----
Q.q(r'Welche Ergebnisse sind beim Werfen eines normalen Spielwürfels möglich?',
    [r'1, 2, 3, 4, 5 und 6', r'nur 6', r'1 bis 12', r'0 bis 6'],
    [r'Ein Spielwürfel hat sechs Seiten.',
     r'Sie tragen die Augenzahlen 1 bis 6.',
     r'Jede davon kann oben liegen.'])

Q.q(r'Was ist ein Zufallsversuch?',
    [r'ein Versuch, dessen Ergebnis man vorher nicht sicher sagen kann', r'ein Versuch, der immer gleich ausgeht',
     r'eine Rechenaufgabe mit großen Zahlen', r'ein Versuch, den man nur einmal machen darf'],
    [r'Man kennt die möglichen Ergebnisse, aber nicht, welches eintritt.',
     r'Beispiele: Würfeln, Münzwurf, Glücksrad.',
     r'Man kann ihn beliebig oft wiederholen.'])

Q.q(r'Welcher Vorgang ist KEIN Zufallsversuch?',
    [r'Eine Zahl wird mit 2 multipliziert.', r'Eine Münze wird geworfen.', r'Ein Glücksrad wird gedreht.',
     r'Aus einem Beutel wird ohne Hinsehen eine Kugel gezogen.'],
    [r'Bei $7 \cdot 2$ kommt immer 14 heraus.',
     r'Das Ergebnis steht vorher fest.',
     r'Also ist das kein Zufallsversuch.'])

Q.q(r'Wie viele verschiedene Ergebnisse hat das Glücksrad?',
    [r'3', r'8', r'4', r'2'],
    [r'Das Rad hat 8 Felder.',
     r'Es gibt aber nur drei Farben: rot, blau und grün.',
     r'Die Ergebnisse sind die Farben: 3 Ergebnisse.'],
    fig=gluecksrad(RAD), figcap=r'Glücksrad mit 8 gleich großen Feldern: R rot, B blau, G grün')

Q.q(r'Welche Farbe wird bei vielen Drehungen vermutlich am häufigsten angezeigt?',
    [r'rot', r'blau', r'grün', r'Alle gleich oft.'],
    [r'Rot hat 4 Felder, blau 3, grün 1.',
     r'Je mehr Felder eine Farbe hat, desto häufiger bleibt der Zeiger dort stehen.',
     r'Vermutlich ist rot am häufigsten – sicher ist das aber nicht.'],
    fig=gluecksrad(RAD), figcap=r'Glücksrad mit 8 gleich großen Feldern: R rot, B blau, G grün')

Q.q(r'Zwei Münzen werden gleichzeitig geworfen (K = Kopf, Z = Zahl). Wie viele verschiedene Ergebnisse gibt es, wenn man die Münzen unterscheidet?',
    [r'4', r'2', r'3', r'6'],
    [r'Erste Münze K oder Z, zweite Münze K oder Z.',
     r'KK, KZ, ZK, ZZ',
     r'Das sind 4 Ergebnisse.'])

Q.q(r'Zwei Würfel werden geworfen und die Augenzahlen addiert. Wie viele verschiedene Augensummen sind möglich?',
    [r'11', r'12', r'36', r'6'],
    [r'Die kleinste Summe ist $1 + 1 = 2$.',
     r'Die größte Summe ist $6 + 6 = 12$.',
     r'Von 2 bis 12 sind es 11 verschiedene Summen.'])

Q.q(r'Bei einer Reißzwecke kann man nicht ausrechnen, wie oft sie auf den Kopf fällt. Warum?',
    [r'Die beiden Ergebnisse sind nicht gleich wahrscheinlich; man muss es ausprobieren.',
     r'Weil eine Reißzwecke nur ein Ergebnis hat.', r'Weil man Reißzwecken nicht werfen darf.',
     r'Weil sie immer auf den Kopf fällt.'],
    [r'Kopf oder Seite – die Form ist nicht gleichmäßig.',
     r'Anders als beim Würfel gibt es keinen Grund, dass beide Ergebnisse gleich oft vorkommen.',
     r'Deshalb wirft man oft und bestimmt die relative Häufigkeit.'])

# --------------------------------------------- tally and absolute frequency ----
Q.q(r'Eine Strichliste zeigt zwei volle Fünferbündel und 3 einzelne Striche. Wie oft ist das Ergebnis eingetreten?',
    [r'13', r'5', r'8', r'23'],
    [r'Ein Fünferbündel sind 4 Striche und ein Querstrich: 5.',
     r'Zwei Bündel: 10.',
     r'$10 + 3 = 13$'])

Q.q(r'Bei 50 Würfen fiel 9-mal die Sechs. Wie groß ist die absolute Häufigkeit der Sechs?',
    [r'9', r'50', r'0,18', r'41'],
    [r'Die absolute Häufigkeit ist die Anzahl, wie oft ein Ergebnis eintritt.',
     r'Die Sechs fiel 9-mal.',
     r'Also 9.'])

Q.q(r'Ein Würfel wird 60-mal geworfen: 1 fiel 8-mal, 2 fiel 11-mal, 3 fiel 9-mal, 4 fiel 12-mal und 5 fiel 10-mal. Wie oft fiel die 6?',
    [r'10', r'12', r'8', r'50'],
    [r'Alle absoluten Häufigkeiten zusammen sind 60.',
     r'$8 + 11 + 9 + 12 + 10 = 50$',
     r'$60 - 50 = 10$-mal die 6.'])

# ------------------------------------------------------- relative frequency ----
Q.q(r'Bei 50 Würfen fiel 9-mal die Sechs. Wie groß ist die relative Häufigkeit der Sechs?',
    [r'0,18', r'9', r'0,9', r'0,5'],
    [r'Relative Häufigkeit = absolute Häufigkeit : Anzahl der Versuche.',
     r'$\dfrac{9}{50} = \dfrac{18}{100}$',
     r'$= 0{,}18$, also 18 %.'])

Q.q(r'Eine Reißzwecke fällt bei 40 Würfen 24-mal auf den Kopf. Wie groß ist die relative Häufigkeit als vollständig gekürzter Bruch?',
    [r'$\dfrac{3}{5}$', r'$\dfrac{24}{40}$', r'$\dfrac{2}{5}$', r'$\dfrac{5}{3}$'],
    [r'$\dfrac{24}{40}$',
     r'Mit 8 kürzen.',
     r'$= \dfrac{3}{5}$'])

Q.q(r'Die relative Häufigkeit ist $\dfrac{3}{5}$. Wie viel Prozent sind das?',
    [r'60 %', r'35 %', r'3,5 %', r'53 %'],
    [r'Auf Hundertstel erweitern: $\dfrac{3}{5} = \dfrac{60}{100}$',
     r'Hundertstel sind Prozent.',
     r'60 %'])

Q.q(r'Wie groß ist die Summe aller relativen Häufigkeiten eines Zufallsversuchs?',
    [r'1', r'100', r'Das hängt von der Anzahl der Versuche ab.', r'0'],
    [r'Alle absoluten Häufigkeiten zusammen ergeben die Anzahl der Versuche $n$.',
     r'Teilt man alles durch $n$, ergibt sich $\dfrac{n}{n}$.',
     r'Die Summe ist immer 1, also 100 %.'])

Q.q(r'Ein Würfel wird 60-mal geworfen, die 4 fiel 12-mal. Wie groß ist die relative Häufigkeit der 4?',
    [r'0,2', r'0,12', r'12', r'0,4'],
    [r'$\dfrac{12}{60}$',
     r'Mit 12 kürzen: $\dfrac{1}{5}$',
     r'$= 0{,}2$'])

Q.q(r'Lena wirft 30-mal und hat 6 Sechsen, Tim wirft 50-mal und hat 9 Sechsen. Wer hatte im Verhältnis mehr Sechsen?',
    [r'Lena', r'Tim', r'Beide gleich.', r'Das kann man nicht vergleichen.'],
    [r'Absolute Häufigkeiten kann man bei verschieden vielen Würfen nicht direkt vergleichen.',
     r'Lena: $\dfrac{6}{30} = 0{,}2$, Tim: $\dfrac{9}{50} = 0{,}18$',
     r'Lenas relative Häufigkeit ist größer.'])

Q.q(r'Bei 12 Würfen ist keine einzige Sechs gefallen. Ist der Würfel deshalb sicher unfair?',
    [r'Nein, bei so wenigen Würfen kann das gut passieren.', r'Ja, die Sechs muss alle 6 Würfe kommen.',
     r'Ja, er hat bestimmt keine Sechs.', r'Nein, weil eine Sechs nie fällt.'],
    [r'Zufall heißt: Es gibt keine Regel, wann die Sechs kommt.',
     r'Auch bei einem fairen Würfel sind 12 Würfe ohne Sechs möglich.',
     r'Erst bei sehr vielen Würfen kann man die Fairness beurteilen.'])

Q.q(r'Eine Münze wird sehr oft geworfen. Was passiert mit der relativen Häufigkeit für Kopf?',
    [r'Sie pendelt sich in der Nähe von 0,5 ein.', r'Sie wird immer größer.', r'Sie wird genau 0,5 nach 10 Würfen.',
     r'Sie springt immer zwischen 0 und 1.'],
    [r'Nach wenigen Würfen schwankt sie noch stark.',
     r'Je mehr Würfe, desto weniger ändert sie sich.',
     r'Sie stabilisiert sich bei etwa 0,5 – mehr dazu in Klasse 7.'])

Q.q(r'Die Zuordnung „Augenzahl → absolute Häufigkeit“ aus einem Würfelversuch ist …',
    [r'eindeutig: Zu jeder Augenzahl gehört genau eine Häufigkeit.', r'mehrdeutig: Eine Augenzahl hat mehrere Häufigkeiten.',
     r'direkt proportional.', r'gar keine Zuordnung.'],
    [r'Für jede Augenzahl zählt man, wie oft sie fiel.',
     r'Daraus ergibt sich genau eine Zahl.',
     r'Zwei Augenzahlen können aber gleich oft gefallen sein: eindeutig, nicht eineindeutig.'])


def check():
    assert len({c for _, c in RAD}) == 3
    count = {}
    for t, _ in RAD:
        count[t] = count.get(t, 0) + 1
    assert count == {'R': 4, 'B': 3, 'G': 1} and max(count, key=count.get) == 'R'
    assert len(list(product('KZ', repeat=2))) == 4
    assert len({a + b for a in range(1, 7) for b in range(1, 7)}) == 11
    assert 2 * 5 + 3 == 13
    assert 60 - sum(TAB.values()) == 10
    assert F(9, 50) == F('0.18')
    assert F(24, 40) == F(3, 5) == F(60, 100)
    assert F(12, 60) == F('0.2')
    assert F(6, 30) > F(9, 50)
    tab = dict(TAB)
    tab[6] = 10
    assert sum(F(v, 60) for v in tab.values()) == 1


Q.verify(check)
Q.save()
