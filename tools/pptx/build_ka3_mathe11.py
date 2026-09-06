#!/usr/bin/env python3
"""Wiederholung vor Klassenarbeit 3 - Mathe 11 (BGY), KW 19, LB 4 + LB 1."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-ka3.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 19",
        "Wiederholung vor Klassenarbeit 3",
        "Gleichungssysteme, Matrizen und Stochastik in einem Durchgang")

d.bullets("Was in der Arbeit drankommt", [
    ("**Klassenarbeit 3**, $90$ Minuten, Lernbereiche **4 und 1**", 0),
    ("Also **LGS und Matrizen** sowie **Stochastik**", 0),
    ("Beides sind eigenständige Themen — sie werden **getrennt** geprüft", 0),
    ("Heute beide Hälften einmal durch, dann **20 Aufgaben** zum Selbsttest", 0),
])

d.chapter(1, "Gleichungssysteme", "Rechnen und die drei Fälle")

d.bullets("Systeme lösen", [
    ("$x + 2y = 8$ und $3x - y = 3$: zweite mal $2$ und addieren", 0),
    ("$7x = 14$, also $x = 2$ und $y = 3$", 0),
    ("Mischung: $x + y = 30$ und $4x + 7y = 150$ ergibt $x = 20$, $y = 10$", 0),
    ("Erlaubt sind Tauschen, Vielfaches addieren und Multiplizieren mit **nicht null**", 0),
])

d.bullets("Die drei Ausgänge erkennen", [
    ("Endet die Stufenform mit $0 = 4$: **keine** Lösung", 0),
    ("$2x + 3y = 12$ und $4x + 6y = 24$ sind dieselbe Gleichung: **unendlich viele**", 0),
    ("Drei Ebenen, die sich paarweise schneiden ohne gemeinsamen Punkt: **keine**", 0),
    ("Ein **homogenes** System hat immer mindestens die triviale Lösung", 0),
])

d.bullets("Matrizen", [
    ("$3$ Gleichungen mit $4$ Unbekannten geben das Format $3 \\times 4$", 0),
    ("$\\begin{pmatrix} 2 & -1 \\\\ 0 & 3 \\end{pmatrix}^\\mathsf{T} = "
     "\\begin{pmatrix} 2 & 0 \\\\ -1 & 3 \\end{pmatrix}$", 0),
    ("$3 \\cdot \\begin{pmatrix} 1 & -2 \\end{pmatrix} = "
     "\\begin{pmatrix} 3 & -6 \\end{pmatrix}$", 0),
    ("Neutrales Element der Addition ist die **Nullmatrix**", 0),
])

d.chapter(2, "Stochastik", "Pfade, Bedingungen, Gegenereignis")

d.bullets("Mehrstufige Versuche", [
    ("Zweimal Kopf: $\\dfrac{1}{2} \\cdot \\dfrac{1}{2} = \\dfrac{1}{4}$", 0),
    ("$4$ rote von $10$, zweimal **mit** Zurücklegen: "
     "$0{,}4 \\cdot 0{,}4 = 0{,}16$", 0),
    ("Zwei Stufen mit je drei Ästen ergeben $9$ Pfade", 0),
    ("Fünfmal keine Sechs: $\\left(\\dfrac{5}{6}\\right)^5 \\approx 0{,}40$", 0),
])

d.bullets("Bedingte Wahrscheinlichkeit", [
    ("$P(A \\cap B) = P(A) \\cdot P(B \\mid A)$", 0),
    ("Bei $P(A) = 0{,}3$ und $P(B \\mid A) = 0{,}5$ also $0{,}15$", 0),
    ("$40\\,\\%$ bestellen online, davon $75\\,\\%$ per Rechnung: $0{,}4 \\cdot 0{,}75 = 0{,}3$", 0),
    ("Gilt $P(A \\cap B) = P(A) \\cdot P(B)$, sind die Ereignisse **unabhängig**", 0),
])

d.merksatz("In beiden Hälften gilt dasselbe: erst prüfen, was gegeben ist, dann das Werkzeug wählen.")

d.chapter(3, "Prüfen", "Der letzte Schritt, der Punkte rettet")

d.bullets("Ergebnisse kontrollieren", [
    ("Eine LGS-Lösung wie $(1 \\mid 0 \\mid -2)$ in **alle** Gleichungen einsetzen", 0),
    ("Nicht nur in die, aus der man sie berechnet hat", 0),
    ("Wahrscheinlichkeiten müssen zwischen $0$ und $1$ liegen", 0),
    ("Sachlich prüfen: negative Mengen und gebrochene Personen gibt es nicht", 0),
])

d.two_cols("Wo die Punkte liegen bleiben", [
    ("Bei den Systemen", 0),
    ("Vorzeichen beim Addieren der Zeilen", 1),
    ("Fall $0 = 0$ nicht gedeutet", 1),
    ("Probe nur in einer Gleichung", 1),
], [
    ("In der Stochastik", 0),
    ("mit statt ohne Zurücklegen", 1),
    ("Bedingung und Umkehrung vertauscht", 1),
    ("bei „mindestens“ direkt gerechnet", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — beide Lernbereiche gemischt", 0),
    ("Was hier hakt, ist der Lernplan für die Tage bis zur Arbeit", 0),
    ("Bei jeder Aufgabe zuerst benennen: **LGS oder Stochastik?**", 0),
    ("**docalvers.de/mathetest11-ka3.html**", 0),
])

d.save()
