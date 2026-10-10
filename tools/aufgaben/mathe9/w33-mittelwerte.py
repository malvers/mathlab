#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 33 / KW 19 (LB 4): arithmetisches Mittel,
Zentralwert, Modalwert, Häufigkeitstabellen. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=33, slug='mittelwerte', thema='Mittelwerte', lb='LB 4',
        blurb='Arithmetisches Mittel, Zentralwert, Modalwert, Häufigkeitstabellen, Ausreißer, gewichtetes Mittel',
        comment='Blocks: the three averages (1-6, 16-17), outliers and choice of average (7-8, 15, 18), frequency table (9-12), sums and weights (13-14, 19-20).')

# ------------------------------------------------------------- Mittelwerte ----
Q.q(r'Berechne das arithmetische Mittel von 4, 7, 7, 9 und 13.',
    [r'8', r'7', r'9', r'40'],
    [r'Summe: $4 + 7 + 7 + 9 + 13 = 40$',
     r'$40 : 5 = 8$'])

Q.q(r'Wie groß ist der Zentralwert (Median) von 4, 7, 7, 9, 13?',
    [r'7', r'8', r'9', r'6,5'],
    [r'Die Werte sind schon geordnet.',
     r'Bei 5 Werten steht in der Mitte der 3. Wert: 7.'])

Q.q(r'Wie groß ist der Modalwert von 4, 7, 7, 9, 13?',
    [r'7', r'4', r'8', r'Es gibt keinen.'],
    [r'Der Modalwert ist der häufigste Wert: 7 kommt zweimal vor.'])

Q.q(r'Wie groß ist der Zentralwert von 3, 5, 8, 10?',
    [r'6,5', r'5', r'8', r'6'],
    [r'Bei einer geraden Anzahl nimmt man den Mittelwert der beiden mittleren Werte.',
     r'$(5 + 8) : 2 = 6{,}5$'])

Q.q(r'Die Noten einer Gruppe sind 2, 3, 3, 1, 4, 2, 3. Wie groß ist der Notendurchschnitt (gerundet)?',
    [r'2,57', r'3', r'2,5', r'2,33'],
    [r'Summe: $2 + 3 + 3 + 1 + 4 + 2 + 3 = 18$',
     r'$18 : 7 \approx 2{,}57$'])

Q.q(r'Wie groß ist der Zentralwert dieser Noten (2, 3, 3, 1, 4, 2, 3)?',
    [r'3', r'2', r'2,57', r'2,5'],
    [r'Erst ordnen: 1, 2, 2, 3, 3, 3, 4.',
     r'Der 4. von 7 Werten steht in der Mitte: 3.'])

# --------------------------------------------------------------- Ausreißer ----
Q.q(r'Monatsgehälter: 2000 €, 2200 €, 2300 €, 2500 €, 15 000 €. Welcher Mittelwert beschreibt die typischen Gehälter besser?',
    [r'der Zentralwert 2300 €', r'das arithmetische Mittel 4800 €', r'der Modalwert 15 000 €', r'das Maximum'],
    [r'Mittel: $24\,000 : 5 = 4800$ €, durch den Ausreißer stark erhöht.',
     r'Der Zentralwert 2300 € liegt bei den meisten Werten.'])

Q.q(r'Welcher Mittelwert verändert sich stark, wenn ein extrem großer Wert hinzukommt?',
    [r'das arithmetische Mittel', r'der Zentralwert', r'der Modalwert', r'keiner'],
    [r'Im arithmetischen Mittel geht jeder Wert mit seiner Größe ein.',
     r'Der Zentralwert verschiebt sich höchstens um eine Position.'])

# ------------------------------------------------------- Häufigkeitstabelle ----
Q.q(r'Eine Klassenarbeit: Note 1 dreimal, Note 2 fünfmal, Note 3 achtmal, Note 4 dreimal, Note 5 einmal. Wie groß ist der Durchschnitt?',
    [r'2,7', r'3', r'2,5', r'4'],
    [r'Summe: $1 \cdot 3 + 2 \cdot 5 + 3 \cdot 8 + 4 \cdot 3 + 5 \cdot 1 = 54$',
     r'Anzahl: 20, Durchschnitt $54 : 20 = 2{,}7$'])

Q.q(r'Wie groß ist der Zentralwert dieser Klassenarbeit (20 Noten)?',
    [r'3', r'2', r'2,5', r'2,7'],
    [r'Gesucht sind der 10. und 11. Wert der geordneten Liste.',
     r'Platz 1 bis 3: Note 1, Platz 4 bis 8: Note 2, Platz 9 bis 16: Note 3. Beide mittleren Werte sind 3.'])

Q.q(r'Wie groß ist der Modalwert dieser Klassenarbeit?',
    [r'3', r'2', r'1', r'8'],
    [r'Die Note 3 kommt am häufigsten vor (8-mal).',
     r'8 ist die Häufigkeit, nicht der Wert.'])

Q.q(r'Welche relative Häufigkeit hat die Note 2 in dieser Klassenarbeit?',
    [r'25 %', r'5 %', r'20 %', r'40 %'],
    [r'$\dfrac{5}{20} = 0{,}25 = 25$ %'])

# ---------------------------------------------------------- Summen, Gewichte ----
Q.q(r'Fünf Werte haben das arithmetische Mittel 12. Wie groß ist ihre Summe?',
    [r'60', r'12', r'17', r'2,4'],
    [r'Mittel $= \dfrac{\text{Summe}}{\text{Anzahl}}$, also Summe $= 12 \cdot 5 = 60$.'])

Q.q(r'Vier Tests ergaben den Durchschnitt 2,5. Welche Note braucht man im fünften Test für den Durchschnitt 2,4?',
    [r'2', r'1', r'2,4', r'3'],
    [r'Bisherige Summe: $4 \cdot 2{,}5 = 10$',
     r'Nötige Summe: $5 \cdot 2{,}4 = 12$, also fehlt eine 2.'])

Q.q(r'Bei einer Umfrage nach der Lieblingsfarbe: Welcher Mittelwert ist sinnvoll?',
    [r'nur der Modalwert', r'das arithmetische Mittel', r'der Zentralwert', r'alle drei'],
    [r'Farben kann man weder addieren noch der Größe nach ordnen.',
     r'Man kann nur sagen, welche Farbe am häufigsten genannt wurde.'])

Q.q(r'Die Tiefsttemperaturen einer Woche waren −3 °C, 1 °C, 4 °C, −2 °C und 5 °C. Wie groß ist das Mittel?',
    [r'1 °C', r'3 °C', r'1,8 °C', r'−1 °C'],
    [r'Summe: $-3 + 1 + 4 - 2 + 5 = 5$',
     r'$5 : 5 = 1$ °C'])

Q.q(r'Wie groß ist der Zentralwert von 12, 15, 9, 20, 11?',
    [r'12', r'9', r'13,4', r'15'],
    [r'Ordnen: 9, 11, 12, 15, 20.',
     r'Der mittlere Wert ist 12.'])

Q.q(r'Wann stimmen arithmetisches Mittel und Zentralwert überein?',
    [r'z. B. wenn die Werte symmetrisch um die Mitte verteilt sind', r'nie', r'immer', r'nur bei genau zwei Werten'],
    [r'Beispiel: 2, 4, 6, 8, 10 hat Mittel 6 und Zentralwert 6.',
     r'Ausreißer auf einer Seite ziehen das Mittel vom Zentralwert weg.'])

Q.q(r'Klasse A (20 Personen) hat den Notendurchschnitt 2,4, Klasse B (30 Personen) 2,9. Wie groß ist der Durchschnitt aller 50?',
    [r'2,7', r'2,65', r'2,9', r'2,4'],
    [r'Summen: $20 \cdot 2{,}4 = 48$ und $30 \cdot 2{,}9 = 87$',
     r'$(48 + 87) : 50 = 135 : 50 = 2{,}7$; 2,65 wäre falsch, weil die Klassen verschieden groß sind.'])

Q.q(r'Klassenarbeiten zählen doppelt, Tests einfach. Klassenarbeiten: 2 und 3, Tests: 1 und 2. Wie groß ist die Gesamtnote (gerundet)?',
    [r'2,17', r'2,0', r'2,5', r'2,33'],
    [r'Summe: $2 \cdot 2 + 2 \cdot 3 + 1 + 2 = 13$',
     r'Gewichte: $2 + 2 + 1 + 1 = 6$, also $13 : 6 \approx 2{,}17$'])


def check():
    from statistics import mean, median, mode
    from fractions import Fraction as F
    d = [4, 7, 7, 9, 13]
    assert mean(d) == 8 and median(d) == 7 and mode(d) == 7 and median([3, 5, 8, 10]) == 6.5
    n = [2, 3, 3, 1, 4, 2, 3]
    assert round(mean(n), 2) == 2.57 and median(n) == 3
    g = [2000, 2200, 2300, 2500, 15000]
    assert mean(g) == 4800 and median(g) == 2300
    t = [1] * 3 + [2] * 5 + [3] * 8 + [4] * 3 + [5]
    assert len(t) == 20 and mean(t) == 2.7 and median(t) == 3 and mode(t) == 3 and F(5, 20) == F(1, 4)
    assert 12 * 5 == 60 and 5 * F('2.4') - 4 * F('2.5') == 2
    assert mean([-3, 1, 4, -2, 5]) == 1 and median([12, 15, 9, 20, 11]) == 12
    assert mean([2, 4, 6, 8, 10]) == median([2, 4, 6, 8, 10]) == 6
    assert (20 * F('2.4') + 30 * F('2.9')) / 50 == F('2.7')
    assert round((2 * 2 + 2 * 3 + 1 + 2) / 6, 2) == 2.17


Q.verify(check)
Q.save()
