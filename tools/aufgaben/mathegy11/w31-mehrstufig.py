#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 31 / KW 17 (LB 4): multi-stage random experiments - urn model
with and without replacement, tree diagram, path rules, complement, simulation.
Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=31, slug='mehrstufig', thema='Mehrstufige Zufallsexperimente', lb='LB 4',
         blurb='Urnenmodell mit und ohne Zurücklegen, Baumdiagramm, Pfadregeln, Simulation',
         comment='Blocks: path rules (1-2), urn with and without replacement (3-9), dice, coins and wheels (10-15), complement and estimates (16-18), simulation (19-20).')

URNE = r'In einer Urne liegen 3 rote und 2 blaue Kugeln.'

# -------------------------------------------------------------- path rules ----
Q.q(r'Wie berechnet man die Wahrscheinlichkeit eines Pfades im Baumdiagramm?',
    [r'Man multipliziert die Wahrscheinlichkeiten längs des Pfades.', r'Man addiert die Wahrscheinlichkeiten längs des Pfades.',
     r'Man nimmt die kleinste Wahrscheinlichkeit des Pfades.', r'Man teilt durch die Zahl der Stufen.'],
    [r'1. Pfadregel (Produktregel).'])

Q.q(r'Wie berechnet man die Wahrscheinlichkeit eines Ereignisses, zu dem mehrere Pfade gehören?',
    [r'Man addiert die Wahrscheinlichkeiten dieser Pfade.', r'Man multipliziert die Pfadwahrscheinlichkeiten.',
     r'Man nimmt den wahrscheinlichsten Pfad.', r'Man zählt nur die Pfade.'],
    [r'2. Pfadregel (Summenregel).'])

# ------------------------------------------------- urn with and without replacement ----
Q.q(URNE + r' Man zieht zweimal MIT Zurücklegen. Wie groß ist die Wahrscheinlichkeit für zwei rote Kugeln?',
    [r'$\dfrac{9}{25}$', r'$\dfrac{3}{10}$', r'$\dfrac{6}{25}$', r'$\dfrac{3}{5}$'],
    [r'Mit Zurücklegen bleibt die Wahrscheinlichkeit gleich: $\dfrac{3}{5}$.',
     r'$\dfrac{3}{5} \cdot \dfrac{3}{5} = \dfrac{9}{25}$'])

Q.q(URNE + r' Man zieht zweimal OHNE Zurücklegen. Wie groß ist die Wahrscheinlichkeit für zwei rote Kugeln?',
    [r'$\dfrac{3}{10}$', r'$\dfrac{9}{25}$', r'$\dfrac{1}{2}$', r'$\dfrac{2}{5}$'],
    [r'Nach der ersten roten Kugel liegen noch 2 rote unter 4 Kugeln.',
     r'$\dfrac{3}{5} \cdot \dfrac{2}{4} = \dfrac{6}{20} = \dfrac{3}{10}$'])

Q.q(URNE + r' Zweimal ohne Zurücklegen: Wie wahrscheinlich ist genau eine rote Kugel?',
    [r'$\dfrac{3}{5}$', r'$\dfrac{3}{10}$', r'$\dfrac{12}{25}$', r'$\dfrac{1}{2}$'],
    [r'Zwei Pfade: rot–blau und blau–rot.',
     r'$\dfrac{3}{5} \cdot \dfrac{2}{4} + \dfrac{2}{5} \cdot \dfrac{3}{4} = \dfrac{6}{20} + \dfrac{6}{20} = \dfrac{3}{5}$'])

Q.q(URNE + r' Zweimal MIT Zurücklegen: Wie wahrscheinlich sind zwei verschiedene Farben?',
    [r'$\dfrac{12}{25}$', r'$\dfrac{6}{25}$', r'$\dfrac{3}{5}$', r'$\dfrac{13}{25}$'],
    [r'$2 \cdot \dfrac{3}{5} \cdot \dfrac{2}{5} = \dfrac{12}{25}$'])

Q.q(URNE + r' Zweimal mit Zurücklegen: Wie wahrscheinlich ist mindestens eine blaue Kugel?',
    [r'$\dfrac{16}{25}$', r'$\dfrac{9}{25}$', r'$\dfrac{4}{25}$', r'$\dfrac{2}{5}$'],
    [r'Gegenereignis: zweimal rot, $\dfrac{9}{25}$.',
     r'$1 - \dfrac{9}{25} = \dfrac{16}{25}$'])

Q.q(URNE + r' Man zieht dreimal ohne Zurücklegen. Wie wahrscheinlich sind drei rote Kugeln?',
    [r'$\dfrac{1}{10}$', r'$\dfrac{27}{125}$', r'$\dfrac{3}{5}$', r'$\dfrac{1}{5}$'],
    [r'$\dfrac{3}{5} \cdot \dfrac{2}{4} \cdot \dfrac{1}{3} = \dfrac{6}{60}$'])

Q.q(r'Was ändert sich beim Ziehen OHNE Zurücklegen von Stufe zu Stufe?',
    [r'Die Wahrscheinlichkeiten, weil sich der Urneninhalt ändert.', r'Nichts.', r'Nur die Zahl der Stufen.', r'Die Summe aller Pfadwahrscheinlichkeiten wird kleiner als 1.'],
    [r'Die Wahrscheinlichkeiten auf der zweiten Stufe hängen vom Ergebnis der ersten ab.',
     r'Die Summe aller Pfade bleibt 1.'])

# --------------------------------------------------- dice, coins and wheels ----
Q.q(r'Eine Münze wird dreimal geworfen. Wie wahrscheinlich ist mindestens einmal Kopf?',
    [r'$\dfrac{7}{8}$', r'$\dfrac{3}{8}$', r'$\dfrac{1}{8}$', r'$\dfrac{1}{2}$'],
    [r'Gegenereignis: dreimal Zahl, $\left(\dfrac{1}{2}\right)^3 = \dfrac{1}{8}$.',
     r'$1 - \dfrac{1}{8} = \dfrac{7}{8}$'])

Q.q(r'Zwei Würfel werden geworfen. Wie wahrscheinlich ist die Augensumme 7?',
    [r'$\dfrac{1}{6}$', r'$\dfrac{7}{36}$', r'$\dfrac{1}{12}$', r'$\dfrac{1}{11}$'],
    [r'Günstig: $(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)$, also 6 von 36.',
     r'Falle: Die 11 möglichen Summen sind nicht gleich wahrscheinlich.'])

Q.q(r'Zwei Würfel werden geworfen. Wie wahrscheinlich ist ein Pasch (zwei gleiche Augenzahlen)?',
    [r'$\dfrac{1}{6}$', r'$\dfrac{1}{36}$', r'$\dfrac{1}{12}$', r'$\dfrac{1}{3}$'],
    [r'6 Pasche unter 36 Ergebnissen.'])

Q.q(r'Ein Würfel wird viermal geworfen. Wie wahrscheinlich ist mindestens eine Sechs?',
    [r'etwa 0,518', r'etwa 0,667', r'etwa 0,482', r'genau 0,25'],
    [r'Gegenereignis: keine Sechs, $\left(\dfrac{5}{6}\right)^4 \approx 0{,}482$.',
     r'$1 - 0{,}482 = 0{,}518$. Das war schon im 17. Jahrhundert eine Wette des Chevalier de Méré.'])

Q.q(r'Ein Glücksrad zeigt mit Wahrscheinlichkeit $\dfrac{1}{4}$ Rot und sonst Grün. Es wird zweimal gedreht. Wie wahrscheinlich ist zweimal Grün?',
    [r'$\dfrac{9}{16}$', r'$\dfrac{3}{4}$', r'$\dfrac{1}{16}$', r'$\dfrac{3}{8}$'],
    [r'$\dfrac{3}{4} \cdot \dfrac{3}{4} = \dfrac{9}{16}$'])

Q.q(r'60 % der Schülerinnen und Schüler einer großen Schule kommen mit dem Bus. Zwei werden zufällig gewählt. Wie wahrscheinlich kommen beide mit dem Bus?',
    [r'0,36', r'0,6', r'1,2', r'0,48'],
    [r'Bei einer großen Schule ändert die erste Auswahl den Anteil kaum: wie mit Zurücklegen.',
     r'$0{,}6 \cdot 0{,}6 = 0{,}36$'])

# ------------------------------------------------- complement and estimates ----
Q.q(r'Wann lohnt sich das Gegenereignis beim Rechnen?',
    [r'Bei „mindestens einmal“: Das Gegenereignis „keinmal“ hat nur einen Pfad.', r'Nie, es ist immer umständlicher.',
     r'Nur bei Würfeln.', r'Nur bei genau zwei Stufen.'],
    [r'$P(\text{mindestens eins}) = 1 - P(\text{keins})$'])

Q.q(r'Ein Würfel wird zehnmal geworfen. Wie wahrscheinlich ist mindestens eine Sechs, gerundet?',
    [r'etwa 0,84', r'etwa 0,16', r'etwa 0,5', r'etwa 1,67'],
    [r'$1 - \left(\dfrac{5}{6}\right)^{10} \approx 1 - 0{,}16 = 0{,}84$'])

Q.q(r'Zwei Lösungswege für dieselbe Wahrscheinlichkeit liefern verschiedene Ergebnisse. Was ist sinnvoll?',
    [r'Beide Wege vergleichen und den Fehler suchen; das richtige Ergebnis ist eindeutig.', r'Den Mittelwert nehmen.',
     r'Das größere Ergebnis nehmen.', r'Beide gelten lassen.'],
    [r'Eine Wahrscheinlichkeit hat genau einen Wert.',
     r'Unterschiedliche Lösungswege sind eine gute Kontrolle.'])

# --------------------------------------------------------------- simulation ----
Q.q(r'Wie simuliert man mit Zufallsziffern 0 bis 9 ein Ereignis mit der Wahrscheinlichkeit 0,3?',
    [r'Die Ziffern 0, 1, 2 gelten als Treffer.', r'Die Ziffer 3 gilt als Treffer.', r'Die Ziffern 0 bis 3 gelten als Treffer.', r'Jede ungerade Ziffer gilt als Treffer.'],
    [r'3 von 10 gleich wahrscheinlichen Ziffern ergeben 0,3.'])

Q.q(r'Warum führt man eine Simulation sehr oft durch?',
    [r'Die relative Häufigkeit stabilisiert sich bei vielen Durchgängen und schätzt die Wahrscheinlichkeit.', r'Damit das Ergebnis exakt wird.',
     r'Weil wenige Durchgänge verboten sind.', r'Damit alle Ergebnisse gleich oft vorkommen.'],
    [r'Empirisches Gesetz der großen Zahlen.',
     r'Ein Simulationsergebnis bleibt eine Schätzung.'])


def check():
    from fractions import Fraction as F
    r, b = F(3, 5), F(2, 5)
    assert r * r == F(9, 25)
    assert F(3, 5) * F(2, 4) == F(3, 10)
    assert F(3, 5) * F(2, 4) + F(2, 5) * F(3, 4) == F(3, 5)
    assert 2 * r * b == F(12, 25) and 1 - r * r == F(16, 25)
    assert F(3, 5) * F(2, 4) * F(1, 3) == F(1, 10)
    assert 1 - F(1, 2) ** 3 == F(7, 8)
    pairs = [(i, j) for i in range(1, 7) for j in range(1, 7)]
    assert F(sum(1 for i, j in pairs if i + j == 7), 36) == F(1, 6)
    assert F(sum(1 for i, j in pairs if i == j), 36) == F(1, 6)
    assert abs(float(1 - F(5, 6) ** 4) - 0.518) < 0.001 and abs(float(F(5, 6) ** 4) - 0.482) < 0.001
    assert F(3, 4) ** 2 == F(9, 16)
    assert F(6, 10) ** 2 == F(36, 100)
    assert abs(float(1 - F(5, 6) ** 10) - 0.84) < 0.005


Q.verify(check)
Q.save()
