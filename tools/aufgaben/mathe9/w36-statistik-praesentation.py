#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 36 / KW 22 (LB 4): Projekt präsentieren und
bewerten, Übung zur beschreibenden Statistik. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=36, slug='statistik-praesentation', thema='Projekt präsentieren und Statistik üben', lb='LB 4',
        blurb='Ergebnisse darstellen und bewerten, Kennwerte, Diagramme, Prozent und Prozentpunkte',
        comment='Blocks: presenting and judging (1-4, 12-14), key figures (5-8, 18-20), diagrams and shares (9-11, 15-17).')

# ------------------------------------------------------- Präsentieren ----
Q.q(r'Ihr wollt zeigen, wie sich alle Befragten auf die Verkehrsmittel verteilen. Welches Diagramm passt?',
    [r'ein Kreisdiagramm', r'ein Liniendiagramm', r'ein Koordinatensystem mit Parabel', r'eine Zahlengerade'],
    [r'Anteile eines Ganzen zeigt das Kreisdiagramm.'])

Q.q(r'Was gehört zu jedem Säulendiagramm in einer Präsentation?',
    [r'beschriftete Achsen mit Einheit und eine Überschrift', r'möglichst viele Farben', r'ein 3D-Effekt', r'nur die Zahlen ohne Achsen'],
    [r'Ohne Beschriftung weiß niemand, was die Säulen bedeuten.'])

Q.q(r'Welche Angaben sollte eine ehrliche Präsentation von Umfrageergebnissen enthalten?',
    [r'Anzahl der Befragten, wie und wann befragt wurde', r'nur das schönste Ergebnis', r'nur Prozentwerte ohne Grundzahl', r'keine Angaben zur Methode'],
    [r'Nur so kann man die Aussagekraft einschätzen.'])

Q.q(r'Eine Gruppe hat 15 Personen befragt und schreibt: „Die Jugend in Sachsen fährt am liebsten Rad.“ Wie ist das zu bewerten?',
    [r'Die Stichprobe ist viel zu klein und nicht repräsentativ für Sachsen.', r'Völlig korrekt.', r'Korrekt, wenn alle 15 Rad fahren.', r'Man darf gar keine Schlüsse ziehen.'],
    [r'Aus 15 Personen einer Schule kann man nur vorsichtig über diese Gruppe sprechen.'])

# --------------------------------------------------------------- Kennwerte ----
Q.q(r'Datenreihe: 3, 5, 5, 6, 8, 9. Wie groß ist das arithmetische Mittel?',
    [r'6', r'5,5', r'5', r'36'],
    [r'Summe 36, Anzahl 6: $36 : 6 = 6$'])

Q.q(r'Wie groß ist der Zentralwert von 3, 5, 5, 6, 8, 9?',
    [r'5,5', r'6', r'5', r'7'],
    [r'Die mittleren Werte sind 5 und 6.',
     r'$(5 + 6) : 2 = 5{,}5$'])

Q.q(r'Wie groß ist der Modalwert von 3, 5, 5, 6, 8, 9?',
    [r'5', r'6', r'5,5', r'2'],
    [r'5 kommt zweimal vor, alle anderen einmal.'])

Q.q(r'Wie groß ist die Spannweite von 3, 5, 5, 6, 8, 9?',
    [r'6', r'9', r'3', r'12'],
    [r'$9 - 3 = 6$'])

# -------------------------------------------------- Diagramme, Anteile ----
Q.q(r'Im Säulendiagramm gilt: 1 cm entspricht 10 Personen. Wie hoch wird die Säule für 45 Personen?',
    [r'4,5 cm', r'45 cm', r'0,45 cm', r'5 cm'],
    [r'$45 : 10 = 4{,}5$ cm'])

Q.q(r'Ein Kreisausschnitt hat den Mittelpunktswinkel $72^\circ$. Welcher Anteil ist das?',
    [r'20 %', r'72 %', r'7,2 %', r'25 %'],
    [r'$\dfrac{72^\circ}{360^\circ} = 0{,}2 = 20$ %'])

Q.q(r'Der Anteil der Radfahrenden steigt von 30 % auf 36 %. Was ist richtig?',
    [r'plus 6 Prozentpunkte, das sind 20 % mehr', r'plus 6 %', r'plus 36 %', r'plus 20 Prozentpunkte'],
    [r'Differenz: $36 - 30 = 6$ Prozentpunkte',
     r'Relativ: $\dfrac{6}{30} = 20$ %'])

Q.q(r'Welche Aussage passt zu Mittel 5 km und Zentralwert 2 km beim Schulweg?',
    [r'Die meisten haben kurze Wege, einige sehr lange Wege ziehen das Mittel hoch.', r'Alle haben 5 km Schulweg.',
     r'Die Hälfte hat mehr als 5 km.', r'Das ist unmöglich.'],
    [r'Die Hälfte hat höchstens 2 km.',
     r'Wenige weite Wege erhöhen das arithmetische Mittel.'])

Q.q(r'Eine Gruppe aus einer Klasse folgert: „Alle Jugendlichen essen gern Pizza.“ Was ist das Problem?',
    [r'Die Aussage verallgemeinert unzulässig über die befragte Gruppe hinaus.', r'Pizza darf man nicht erheben.',
     r'Es fehlt ein Kreisdiagramm.', r'Kein Problem.'],
    [r'Schlüsse gelten nur für die Gruppe, die die Stichprobe gut abbildet.'])

Q.q(r'Die Umfrage ergab: 30 % kaufen oft regionale Produkte. Was ist eine sinnvolle Bewertung im Sinne der Nachhaltigkeit?',
    [r'Ein Vorschlag, wie man regionale Produkte bekannter machen kann, mit Hinweis auf die Stichprobe', r'„Niemand kauft regional.“',
     r'„Alle kaufen regional.“', r'gar keine Bewertung'],
    [r'Bewerten heißt: Ergebnis einordnen, Grenzen nennen, Folgerungen ziehen.'])

Q.q(r'Ein Kreisdiagramm zeigt 25 % für „Bus“. Es wurden 240 Personen befragt. Wie viele fahren Bus?',
    [r'60', r'25', r'96', r'215'],
    [r'$0{,}25 \cdot 240 = 60$'])

Q.q(r'Häufigkeiten: 12, 18, 30 und 20 Personen. Welche relativen Häufigkeiten ergeben sich?',
    [r'15 %, 22,5 %, 37,5 %, 25 %', r'12 %, 18 %, 30 %, 20 %', r'15 %, 20 %, 35 %, 30 %', r'10 %, 20 %, 40 %, 30 %'],
    [r'Gesamt: $12 + 18 + 30 + 20 = 80$',
     r'$12 : 80 = 15$ %, $18 : 80 = 22{,}5$ %, $30 : 80 = 37{,}5$ %, $20 : 80 = 25$ %'])

Q.q(r'Eine Gruppe nennt die relativen Häufigkeiten 20 %, 35 %, 30 % und 25 %. Was stimmt nicht?',
    [r'Die Summe ist 110 %, also ist mindestens ein Wert falsch.', r'Alles stimmt.', r'Es dürfen nur drei Werte sein.', r'25 % ist zu klein.'],
    [r'Ohne Mehrfachantworten müssen die Anteile zusammen 100 % ergeben.'])

Q.q(r'Zu jedem Wert einer Datenreihe wird 2 addiert. Was passiert mit dem arithmetischen Mittel?',
    [r'Es wächst um 2.', r'Es bleibt gleich.', r'Es verdoppelt sich.', r'Es wächst um 2 mal Anzahl.'],
    [r'Die Summe wächst um $2 \cdot n$, geteilt durch $n$ ergibt plus 2.'])

Q.q(r'Was passiert dabei (jeder Wert plus 2) mit der Spannweite?',
    [r'Sie bleibt gleich.', r'Sie wächst um 2.', r'Sie wächst um 4.', r'Sie halbiert sich.'],
    [r'Maximum und Minimum wachsen beide um 2, ihre Differenz bleibt.'])

Q.q(r'Welcher Mittelwert ist gegenüber einzelnen Ausreißern am unempfindlichsten?',
    [r'der Zentralwert', r'das arithmetische Mittel', r'die Spannweite', r'das Maximum'],
    [r'Der Zentralwert hängt nur von der Mitte der geordneten Liste ab.'])


def check():
    from statistics import mean, median, mode
    from fractions import Fraction as F
    d = [3, 5, 5, 6, 8, 9]
    assert mean(d) == 6 and median(d) == 5.5 and mode(d) == 5 and max(d) - min(d) == 6
    assert 45 / 10 == 4.5 and F(72, 360) == F(1, 5) and F(36 - 30, 30) == F(1, 5)
    assert F(25, 100) * 240 == 60
    h = [12, 18, 30, 20]
    assert [F(x, sum(h)) * 100 for x in h] == [15, F('22.5'), F('37.5'), 25]
    assert 20 + 35 + 30 + 25 == 110
    assert mean([x + 2 for x in d]) == mean(d) + 2 and max(d) - min(d) == max(x + 2 for x in d) - min(x + 2 for x in d)


Q.verify(check)
Q.save()
