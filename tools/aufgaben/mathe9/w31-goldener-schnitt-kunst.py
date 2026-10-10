#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 31 / KW 17 (Wahlpflichtbereich 1 Goldener Schnitt):
Goldenes Rechteck, Fünfeck, Fibonacci, Beispiele aus Kunst, Architektur und Natur. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=31, slug='goldener-schnitt-kunst', thema='Goldener Schnitt in Kunst, Architektur und Natur', lb='WB 1',
        blurb='Goldenes Rechteck, Pentagramm, Fibonacci-Zahlen, Sonnenblume, Bauwerke und Bilder kritisch prüfen',
        comment='Phi = 1.618..., values rounded. Blocks: golden rectangle (1-2, 9-10), pentagon (3-4), Fibonacci and nature (5-8, 19-20), buildings and pictures (11-16), history (17-18). Sources named in the steps.')

# ---------------------------------------------------- Goldenes Rechteck ----
Q.q(r'Ein Bild soll 50 cm breit sein und die Seiten im Goldenen Schnitt haben (Breite ist die lange Seite). Wie hoch wird es (gerundet)?',
    [r'30,9 cm', r'80,9 cm', r'25 cm', r'33,3 cm'],
    [r'Höhe $= 50 : \Phi \approx 50 : 1{,}618 \approx 30{,}9$ cm'])

Q.q(r'Von einem Goldenen Rechteck schneidet man ein Quadrat über der kurzen Seite ab. Was bleibt übrig?',
    [r'wieder ein Goldenes Rechteck', r'ein Quadrat', r'ein Rechteck mit dem Verhältnis 2 : 1', r'ein Dreieck'],
    [r'Seiten $\Phi$ und 1: Nach dem Abschneiden bleiben 1 und $\Phi - 1 = \dfrac{1}{\Phi}$.',
     r'Verhältnis $1 : \dfrac{1}{\Phi} = \Phi$. So entsteht die Goldene Spirale.'])

# --------------------------------------------------------------- Fünfeck ----
Q.q(r'Im regelmäßigen Fünfeck verhält sich die Diagonale zur Seite wie $\Phi$. Die Seite ist 5 cm lang. Wie lang ist eine Diagonale (gerundet)?',
    [r'8,09 cm', r'3,09 cm', r'7,07 cm', r'10 cm'],
    [r'$5 \cdot 1{,}618 \approx 8{,}09$ cm'])

Q.q(r'Was gilt für die Diagonalen im Pentagramm (Fünfstern)?',
    [r'Sie schneiden sich gegenseitig im Goldenen Schnitt.', r'Sie halbieren sich.', r'Sie stehen senkrecht aufeinander.', r'Sie sind alle verschieden lang.'],
    [r'Jeder Schnittpunkt teilt eine Diagonale in größeren und kleineren Teil im Verhältnis $\Phi$.',
     r'Das Pentagramm war deshalb schon bei den Pythagoreern ein Symbol.'])

# ------------------------------------------------------ Fibonacci, Natur ----
Q.q(r'Auf einer Sonnenblume zählt man häufig 34 Spiralen in die eine und 55 in die andere Richtung. Was fällt an diesen Zahlen auf?',
    [r'Es sind aufeinanderfolgende Fibonacci-Zahlen.', r'Es sind Primzahlen.', r'Es sind Quadratzahlen.', r'Ihre Summe ist 100.'],
    [r'1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, …',
     r'$55 : 34 \approx 1{,}618$'])

Q.q(r'Welche Zahlenreihe besteht nur aus Fibonacci-Zahlen?',
    [r'2, 3, 5, 8, 13, 21', r'2, 4, 8, 16, 32', r'1, 3, 5, 7, 9, 11', r'1, 4, 9, 16, 25'],
    [r'Jede Zahl ist die Summe der beiden vorigen: $2 + 3 = 5$, $3 + 5 = 8$, …'])

Q.q(r'Nach welcher Regel entsteht die Fibonacci-Folge?',
    [r'Jedes Glied ist die Summe der beiden vorhergehenden.', r'Jedes Glied ist das Doppelte des vorigen.',
     r'Man addiert immer 2.', r'Man multipliziert die beiden vorigen.'],
    [r'Start mit 1 und 1, dann $1 + 1 = 2$, $1 + 2 = 3$, $2 + 3 = 5$, …'])

Q.q(r'Leonardo von Pisa (Fibonacci) stellte 1202 in seinem Rechenbuch „Liber abaci“ eine berühmte Aufgabe. Worum ging es?',
    [r'um die Vermehrung von Kaninchenpaaren', r'um die Höhe einer Pyramide', r'um das Pflastern eines Platzes', r'um die Teilung einer Erbschaft unter Kamelen'],
    [r'Jedes Paar bekommt ab dem zweiten Monat jeden Monat ein neues Paar.',
     r'Die Anzahlen der Paare sind 1, 1, 2, 3, 5, 8, … Quelle: Leonardo von Pisa, Liber abaci (1202).'])

Q.q(r'Eine Bankkarte ist 85,6 mm breit und 53,98 mm hoch. Wie groß ist das Seitenverhältnis (gerundet)?',
    [r'1,59, nahe beim Goldenen Schnitt', r'1,41, das DIN-Verhältnis', r'2,00', r'1,33, das Format 4 : 3'],
    [r'$85{,}6 : 53{,}98 \approx 1{,}59$',
     r'Das liegt nahe bei $\Phi \approx 1{,}618$, ist aber nicht genau gleich.'])

Q.q(r'Ist ein DIN-A4-Blatt ein Goldenes Rechteck?',
    [r'Nein, sein Seitenverhältnis ist etwa 1,414.', r'Ja, genau.', r'Ja, ungefähr 1,618.', r'Nein, es ist ein Quadrat.'],
    [r'$297 : 210 \approx 1{,}414 = \sqrt{2}$',
     r'Das DIN-Format ist so gewählt, dass beim Halbieren dieselbe Form entsteht.'])

# ------------------------------------------------- Bauwerke und Bilder ----
Q.q(r'Welches Bauwerk in Sachsen wird oft als Beispiel für den Goldenen Schnitt genannt?',
    [r'das Alte Rathaus in Leipzig', r'die Semperoper in Dresden', r'der Fernsehturm in Dresden', r'die Augustusbrücke'],
    [r'Beim Alten Rathaus in Leipzig teilt der Turm die lange Marktfront ungefähr im Goldenen Schnitt.',
     r'Der Lehrplan nennt dieses Beispiel ausdrücklich.'])

Q.q(r'Was sollte man bei Behauptungen wie „Der Parthenon ist nach dem Goldenen Schnitt gebaut“ bedenken?',
    [r'Man sollte nachmessen; viele Beispiele passen nur ungefähr, ob Baumeister ihn bewusst nutzten, ist oft umstritten.',
     r'Solche Aussagen sind immer exakt bewiesen.',
     r'Der Goldene Schnitt kommt in Bauwerken nie vor.',
     r'Man muss nur das Foto ansehen.'],
    [r'Je nachdem, wo man die Messpunkte setzt, findet man fast überall ein Verhältnis um 1,6.',
     r'Kritisch prüfen heißt: Messpunkte begründen, genau messen, mit 1,618 vergleichen.'])

Q.q(r'Eine Person ist 1,70 m groß. In welcher Höhe läge ihr Bauchnabel, wenn er die Körpergröße genau im Goldenen Schnitt teilt (gerundet)?',
    [r'bei 1,05 m', r'bei 0,85 m', r'bei 1,10 m', r'bei 0,65 m'],
    [r'Größerer Teil von unten: $1{,}70 : 1{,}618 \approx 1{,}05$ m',
     r'Bei echten Menschen streut das Verhältnis deutlich.'])

Q.q(r'Eine Fassade ist 40 m breit. Wo müsste ein Turm stehen, um sie im Goldenen Schnitt zu teilen (vom einen Ende gemessen, gerundet)?',
    [r'bei 24,7 m', r'bei 20 m', r'bei 15,3 m', r'bei 26,7 m'],
    [r'$40 : 1{,}618 \approx 24{,}7$ m',
     r'Vom anderen Ende aus sind es 15,3 m.'])

Q.q(r'Ein Foto ist 10 cm hoch. Der Horizont soll die Höhe im Goldenen Schnitt teilen, mit dem Himmel als größerem Teil. In welcher Höhe von unten liegt er (gerundet)?',
    [r'bei 3,82 cm', r'bei 6,18 cm', r'bei 5 cm', r'bei 3,33 cm'],
    [r'Himmel: $10 \cdot 0{,}618 \approx 6{,}18$ cm oben',
     r'Horizont von unten: $10 - 6{,}18 = 3{,}82$ cm'])

Q.q(r'Fotografen nutzen oft die Drittelregel. Wie weit liegt sie vom Goldenen Schnitt entfernt?',
    [r'Sie teilt bei 0,333 statt 0,382 der Länge, also ähnlich, aber nicht gleich.', r'Sie ist genau der Goldene Schnitt.',
     r'Sie teilt in der Mitte.', r'Sie hat mit Teilungen nichts zu tun.'],
    [r'$\dfrac{1}{3} \approx 0{,}333$, der kleinere Teil im Goldenen Schnitt ist $\approx 0{,}382$.'])

# ---------------------------------------------------------------- Geschichte ----
Q.q(r'Welches Buch über den Goldenen Schnitt illustrierte Leonardo da Vinci?',
    [r'„De divina proportione“ von Luca Pacioli (1509)', r'„Liber abaci“ von Fibonacci', r'die „Elemente“ von Euklid', r'„Gullivers Reisen“'],
    [r'Luca Pacioli nannte das Verhältnis „göttliche Proportion“.',
     r'Leonardo zeichnete für das Buch die Körper-Darstellungen.'])

Q.q(r'Seit wann ist der Name „Goldener Schnitt“ verbreitet?',
    [r'seit dem 19. Jahrhundert', r'seit Euklid, um 300 v. Chr.', r'seit dem Jahr 1202', r'seit 1990'],
    [r'Euklid sprach von „Teilung im äußeren und mittleren Verhältnis“.',
     r'Die Bezeichnung „goldener Schnitt“ findet sich zuerst bei Martin Ohm (1835).'])

Q.q(r'Der Goldene Winkel teilt den Vollwinkel im Goldenen Schnitt (kleinerer Teil). Wie groß ist er (gerundet)?',
    [r'$137{,}5^\circ$', r'$222{,}5^\circ$', r'$120^\circ$', r'$161{,}8^\circ$'],
    [r'Kleinerer Teil: $360^\circ - \dfrac{360^\circ}{\Phi} \approx 360^\circ - 222{,}5^\circ$',
     r'$\approx 137{,}5^\circ$; unter diesem Winkel folgen oft Blätter am Stängel aufeinander.'])

Q.q(r'Welche Quotienten benachbarter Fibonacci-Zahlen liegen am nächsten bei $\Phi$?',
    [r'die von großen Zahlen, z. B. 55 : 34', r'die von kleinen Zahlen, z. B. 2 : 1', r'alle gleich nahe', r'keiner'],
    [r'$2 : 1 = 2$, $8 : 5 = 1{,}6$, $13 : 8 = 1{,}625$, $55 : 34 \approx 1{,}6176$',
     r'Die Quotienten pendeln um $\Phi$ und kommen ihm immer näher.'])


def check():
    from math import sqrt
    phi = (1 + sqrt(5)) / 2
    R = lambda v, n=2: round(v, n)
    assert R(50 / phi, 1) == 30.9 and abs(1 / (phi - 1) - phi) < 1e-12 and R(5 * phi) == 8.09
    fib = [1, 1]
    while fib[-1] < 89:
        fib.append(fib[-1] + fib[-2])
    assert {34, 55} <= set(fib) and {2, 3, 5, 8, 13, 21} <= set(fib)
    assert R(85.6 / 53.98) == 1.59 and R(297 / 210, 3) == 1.414
    assert R(1.70 / phi) == 1.05 and R(40 / phi, 1) == 24.7 and R(40 - 40 / phi, 1) == 15.3
    assert R(10 - 10 / phi) == 3.82 and R(1 / 3, 3) == 0.333 and R(1 - 1 / phi, 3) == 0.382
    assert R(360 - 360 / phi, 1) == 137.5 and R(360 / phi, 1) == 222.5
    assert 8 / 5 == 1.6 and 13 / 8 == 1.625 and R(55 / 34, 4) == 1.6176


Q.verify(check)
Q.save()
