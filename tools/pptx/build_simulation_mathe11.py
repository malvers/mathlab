#!/usr/bin/env python3
"""Simulation von Zufallsversuchen - Mathe 11 (BGY), KW 17, LB 1."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-simulation.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 17",
        "Simulieren statt rechnen",
        "Das Gesetz der großen Zahlen — am Rechner erlebt, nicht nur behauptet")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 1 — Stunden **11 bis 15 von 15**, damit ist **LB 1 fertig**", 0),
    ("Drei Blöcke: **Gesetz der großen Zahlen**, **wie man simuliert**, "
     "**Ergebnisse deuten**", 0),
    ("Werkzeug: Tabellenkalkulation oder GeoGebra", 0),
    ("Am Ende der Vergleich: **Simulation gegen theoretische Wahrscheinlichkeit**", 0),
])

d.chapter(1, "Das Gesetz der großen Zahlen", "Was es sagt und was nicht")

d.bullets("Was es besagt", [
    ("Bei **vielen** Versuchen nähert sich die relative Häufigkeit der "
     "Wahrscheinlichkeit an", 0),
    ("Ein Diagramm der relativen Häufigkeit **pendelt sich ein**", 0),
    ("Am Anfang schwankt es stark, später kaum noch", 0),
    ("Bei $20$ Versuchen ist eine große Abweichung völlig normal", 0),
])

d.bullets("Was es nicht besagt", [
    ("Ein Würfel zeigt in $600$ Würfen $95$-mal die Sechs statt $100$", 0),
    ("Das ist **normale Schwankung**, kein Hinweis auf einen unfairen Würfel", 0),
    ("Beim Roulette „muss“ nach viel Schwarz **nichts** kommen", 0),
    ("Die Kugel hat kein Gedächtnis — jeder Wurf ist unabhängig", 0),
])

d.merksatz("Der Zufall gleicht nicht aus. Er wird nur von immer mehr Versuchen überstimmt.")

d.chapter(2, "Wie man simuliert", "Zufallszahlen richtig einteilen")

d.bullets("Einen Würfel nachbauen", [
    ("Eine ganze Zufallszahl von $1$ bis $6$ ziehen", 0),
    ("In der Tabellenkalkulation etwa mit einer Ganzzahl-Zufallsfunktion", 0),
    ("Wichtig ist, dass **alle sechs** Werte gleich wahrscheinlich sind", 0),
    ("Der Aufbau muss zum Versuch passen, sonst simuliert man etwas anderes", 0),
])

d.bullets("Ein Ereignis mit vorgegebener Wahrscheinlichkeit", [
    ("Für $P = 0{,}3$: eine Zufallszahl aus $[0;1)$ ziehen", 0),
    ("Ist sie kleiner als $0{,}3$, gilt das Ereignis als eingetreten", 0),
    ("Ein Glücksrad mit $50$, $30$, $20$ Prozent: das Intervall dreiteilen", 0),
    ("Also $[0;0{,}5)$, $[0{,}5;0{,}8)$ und $[0{,}8;1)$", 0),
])

d.bullets("Pseudozufallszahlen", [
    ("Ein Rechner würfelt nicht — er **berechnet** die Zahlen", 0),
    ("Sie sehen zufällig aus, folgen aber einer festen Vorschrift", 0),
    ("Mit demselben Startwert kommt **dieselbe** Folge heraus", 0),
    ("Deshalb liefert ein neuer Lauf sonst andere Ergebnisse: neuer Startwert", 0),
])

d.bullets("Aus der Simulation eine Schätzung machen", [
    ("Treffer zählen und durch die Zahl der Läufe teilen", 0),
    ("$50$ Läufe ergeben $0{,}62$, $50\\,000$ Läufe ergeben $0{,}504$", 0),
    ("Der zweite Wert ist **verlässlicher** — mehr Läufe, weniger Schwankung", 0),
    ("Für zwei Nachkommastellen braucht man grob **zehntausend** Läufe", 0),
])

d.chapter(3, "Deuten und einordnen", "Wozu das Ganze gut ist")

d.bullets("Wann sich Simulieren lohnt", [
    ("Wenn die Rechnung mühsam, der Versuch aber leicht nachzubauen ist", 0),
    ("Klassiker: das **Geburtstagsproblem**", 0),
    ("Bei $23$ Personen liegt die Wahrscheinlichkeit für einen gemeinsamen "
     "Geburtstag schon bei rund $50\\,\\%$", 0),
    ("In der Praxis simuliert man Wetter, Verkehr, Lager und Risiken", 0),
])

d.bullets("Simulation prüfen und deuten", [
    ("Erst mit einem Fall testen, dessen Ergebnis man **kennt**", 0),
    ("Etwa den fairen Münzwurf — kommt ungefähr $0{,}5$ heraus?", 0),
    ("Ein Simulationsergebnis ist immer eine **Schätzung**, nie ein Beweis", 0),
    ("Zur Deutung gehört die Zahl der Läufe dazu", 0),
])

d.bullets("Der Erwartungswert", [
    ("Beim fairen Würfel ist er $\\dfrac{1 + 2 + 3 + 4 + 5 + 6}{6} = 3{,}5$", 0),
    ("Ein Wert, der nie fällt — trotzdem der langfristige **Durchschnitt**", 0),
    ("Spiel: mit $P = 0{,}2$ zehn Euro Gewinn, sonst drei Euro Verlust", 0),
    ("$0{,}2 \\cdot 10 - 0{,}8 \\cdot 3 = -0{,}4$ — also **nicht fair**", 0),
])

d.two_cols("Zwei Wege zum selben Ziel", [
    ("Theoretisch rechnen", 0),
    ("exakt", 1),
    ("erfordert ein Modell", 1),
    ("bei vielen Stufen mühsam", 1),
], [
    ("Simulieren", 0),
    ("nur eine Schätzung", 1),
    ("braucht kein geschlossenes Modell", 1),
    ("beliebig komplex möglich", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Gesetz der großen Zahlen, Aufbau, Deutung", 0),
    ("Damit ist **Lernbereich 1 abgeschlossen**", 0),
    ("Die Brücke zur Informatik: genau so arbeiten Monte-Carlo-Verfahren", 0),
    ("**docalvers.de/mathetest11-simulation.html**", 0),
])

d.save()
