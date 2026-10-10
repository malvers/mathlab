#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 34 / KW 20 (LB 4): Maximum, Minimum,
Spannweite, Kennwerte mit der Tabellenkalkulation. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=34, slug='spannweite', thema='Maximum, Minimum, Spannweite', lb='LB 4',
        blurb='Spannweite als Streumaß, Datenreihen vergleichen, Kennwerte mit der Tabellenkalkulation',
        comment='Blocks: range (1-2, 13-15, 19), comparing spread (3-5, 12, 16-17), spreadsheet functions (6-8), long jump and prices (9-11, 18, 20).')

# --------------------------------------------------------------- Spannweite ----
Q.q(r'Wie groß ist die Spannweite von 4, 7, 7, 9, 13?',
    [r'9', r'13', r'4', r'8'],
    [r'Spannweite = Maximum − Minimum',
     r'$13 - 4 = 9$'])

Q.q(r'Die Tiefsttemperaturen einer Woche lagen zwischen −3 °C und 5 °C. Wie groß ist die Spannweite?',
    [r'8 K (8 Grad)', r'2 K (2 Grad)', r'5 K (5 Grad)', r'−8 K (−8 Grad)'],
    [r'$5 - (-3) = 8$',
     r'Temperaturunterschiede gibt man in Kelvin oder Grad an.'])

Q.q(r'Datenreihe A: 5, 5, 5, 5, 5. Datenreihe B: 1, 3, 5, 7, 9. Was gilt?',
    [r'Gleiches Mittel 5, aber Spannweite 0 und 8.', r'Gleiche Spannweite, verschiedene Mittel.',
     r'Beide Reihen sind gleich.', r'B hat das größere Mittel.'],
    [r'Beide Mittelwerte sind 5.',
     r'Die Spannweite zeigt den Unterschied: A streut gar nicht, B stark.'])

Q.q(r'Welcher Kennwert beschreibt, wie weit die Daten streuen?',
    [r'die Spannweite', r'der Modalwert', r'das arithmetische Mittel', r'der Zentralwert'],
    [r'Mittelwerte beschreiben die Lage, die Spannweite die Streuung.'])

Q.q(r'Welche Schwäche hat die Spannweite?',
    [r'Ein einziger Ausreißer kann sie stark vergrößern.', r'Sie ist schwer zu berechnen.', r'Sie ist immer null.', r'Sie hängt von allen Werten gleich stark ab.'],
    [r'Sie benutzt nur den größten und den kleinsten Wert.'])

# --------------------------------------------------------- Tabellenkalkulation ----
Q.q(r'Welche Funktion liefert in einer Tabellenkalkulation den Zentralwert der Zellen A1 bis A10?',
    [r'=MEDIAN(A1:A10)', r'=MITTELWERT(A1:A10)', r'=MAX(A1:A10)', r'=SUMME(A1:A10)'],
    [r'Median ist ein anderes Wort für Zentralwert.'])

Q.q(r'Welche Funktion liefert das arithmetische Mittel der Zellen B2 bis B21?',
    [r'=MITTELWERT(B2:B21)', r'=MEDIAN(B2:B21)', r'=MODALWERT(B2:B21)', r'=ANZAHL(B2:B21)'],
    [r'MITTELWERT addiert und teilt durch die Anzahl.'])

Q.q(r'Wie berechnet man die Spannweite der Zellen C1 bis C30?',
    [r'=MAX(C1:C30)-MIN(C1:C30)', r'=MAX(C1:C30)+MIN(C1:C30)', r'=MITTELWERT(C1:C30)', r'=C30-C1'],
    [r'Größter minus kleinster Wert.',
     r'C30 minus C1 stimmt nur, wenn die Werte sortiert sind.'])

# ------------------------------------------------------------- Weitsprung ----
Q.q(r'Weitsprungergebnisse: 3,85 m, 4,10 m, 4,32 m, 3,96 m, 4,02 m. Wie groß ist die Spannweite?',
    [r'0,47 m', r'4,32 m', r'0,37 m', r'8,17 m'],
    [r'Maximum 4,32 m, Minimum 3,85 m',
     r'$4{,}32 - 3{,}85 = 0{,}47$ m'])

Q.q(r'Wie groß ist das arithmetische Mittel dieser Weiten?',
    [r'4,05 m', r'4,02 m', r'4,10 m', r'20,25 m'],
    [r'Summe: $20{,}25$ m',
     r'$20{,}25 : 5 = 4{,}05$ m'])

Q.q(r'Wie groß ist der Zentralwert dieser Weiten?',
    [r'4,02 m', r'4,05 m', r'4,32 m', r'3,96 m'],
    [r'Geordnet: 3,85; 3,96; 4,02; 4,10; 4,32',
     r'Der mittlere Wert ist 4,02 m.'])

Q.q(r'Läuferin A: 13,1 s, 13,4 s, 13,2 s. Läuferin B: 12,8 s, 13,9 s, 13,0 s. Wer läuft beständiger?',
    [r'A, ihre Spannweite ist 0,3 s statt 1,1 s.', r'B, sie hat die beste Zeit.', r'Beide gleich, die Mittel sind gleich.', r'B, ihre Spannweite ist größer.'],
    [r'Beide Mittel: $39{,}7 : 3 \approx 13{,}23$ s.',
     r'Spannweite A: $13{,}4 - 13{,}1 = 0{,}3$ s, B: $13{,}9 - 12{,}8 = 1{,}1$ s'])

Q.q(r'In einer Klasse ist die kleinste Person 1,52 m groß, die Spannweite beträgt 0,31 m. Wie groß ist die größte Person?',
    [r'1,83 m', r'1,21 m', r'1,67 m', r'1,52 m'],
    [r'Maximum = Minimum + Spannweite = $1{,}52 + 0{,}31 = 1{,}83$ m'])

Q.q(r'Der Niederschlag lag in einem Jahr zwischen 22 mm (Monatsminimum) und 85 mm (Monatsmaximum). Wie groß ist die Spannweite?',
    [r'63 mm', r'107 mm', r'53,5 mm', r'85 mm'],
    [r'$85 - 22 = 63$ mm'])

Q.q(r'Welche Spannweite hat eine Datenreihe, in der alle Werte gleich sind?',
    [r'0', r'1', r'der Wert selbst', r'Sie ist nicht definiert.'],
    [r'Maximum und Minimum sind gleich, ihre Differenz ist 0.'])

Q.q(r'Zu einer Datenreihe mit Minimum 10 und Maximum 30 kommt der Wert 25 hinzu. Was passiert mit der Spannweite?',
    [r'Sie bleibt 20.', r'Sie wird 25.', r'Sie wird 15.', r'Sie wird 45.'],
    [r'25 liegt zwischen Minimum und Maximum.',
     r'Die Spannweite ändert sich nur, wenn ein neuer Wert außerhalb liegt.'])

Q.q(r'Was kann die Spannweite nicht zeigen?',
    [r'wie die Werte zwischen Minimum und Maximum verteilt sind', r'den Abstand zwischen größtem und kleinstem Wert',
     r'ob alle Werte gleich sind', r'die Einheit der Daten'],
    [r'Die Reihen 1, 5, 5, 5, 9 und 1, 1, 5, 9, 9 haben beide die Spannweite 8, sind aber verschieden verteilt.'])

Q.q(r'Ein Liter Milch kostet in fünf Läden 1,29 €, 1,49 €, 1,19 €, 1,39 € und 1,59 €. Wie groß sind Spannweite und Mittel?',
    [r'Spannweite 0,40 €, Mittel 1,39 €', r'Spannweite 0,30 €, Mittel 1,39 €', r'Spannweite 0,40 €, Mittel 1,49 €', r'Spannweite 1,59 €, Mittel 1,19 €'],
    [r'$1{,}59 - 1{,}19 = 0{,}40$ €',
     r'Summe 6,95 €, Mittel $6{,}95 : 5 = 1{,}39$ €'])

Q.q(r'An einem Tag war es höchstens 24 °C warm, die Spannweite der Temperatur betrug 11 K. Wie kalt war es am kältesten?',
    [r'13 °C', r'35 °C', r'11 °C', r'2,2 °C'],
    [r'Minimum = Maximum − Spannweite = $24 - 11 = 13$ °C'])

Q.q(r'Um wie viel Prozent liegt der teuerste Milchpreis (1,59 €) über dem Mittel von 1,39 € (gerundet)?',
    [r'um 14,4 %', r'um 20 %', r'um 12,6 %', r'um 0,2 %'],
    [r'$\dfrac{1{,}59 - 1{,}39}{1{,}39} = \dfrac{0{,}20}{1{,}39} \approx 0{,}144$'])


def check():
    from statistics import mean, median
    from fractions import Fraction as F
    sp = lambda d: max(d) - min(d)
    assert sp([4, 7, 7, 9, 13]) == 9 and 5 - (-3) == 8
    assert mean([5] * 5) == mean([1, 3, 5, 7, 9]) == 5 and sp([5] * 5) == 0 and sp([1, 3, 5, 7, 9]) == 8
    w = [F(x) for x in ('3.85', '4.10', '4.32', '3.96', '4.02')]
    assert sp(w) == F('0.47') and mean(w) == F('4.05') and median(w) == F('4.02')
    a, b = [F('13.1'), F('13.4'), F('13.2')], [F('12.8'), F('13.9'), F('13.0')]
    assert mean(a) == mean(b) and sp(a) == F('0.3') and sp(b) == F('1.1')
    assert F('1.52') + F('0.31') == F('1.83') and 85 - 22 == 63 and 30 - 10 == 20
    assert sp([1, 5, 5, 5, 9]) == sp([1, 1, 5, 9, 9]) == 8
    p = [F(x) for x in ('1.29', '1.49', '1.19', '1.39', '1.59')]
    assert sp(p) == F('0.4') and mean(p) == F('1.39') and 24 - 11 == 13
    assert round(0.20 / 1.39 * 100, 1) == 14.4


Q.verify(check)
Q.save()
