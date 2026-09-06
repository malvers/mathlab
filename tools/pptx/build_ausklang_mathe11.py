#!/usr/bin/env python3
"""Ausklang: Mathe-Spiele und Knobeleien - Mathe 11 (BGY), KW 26."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-ausklang.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 26",
        "Ausklang",
        "Knobeleien zum Schluss — Aufgaben, bei denen die erste Antwort meistens falsch ist")

d.bullets("Der Fahrplan dieser Woche", [
    ("**Letzte Woche** — Mathe-Spiele und Knobeleien", 0),
    ("Drei Blöcke: **Denkfallen**, **das Unerwartete**, **Zählen und Kombinieren**", 0),
    ("Regel für heute: **erst schätzen, dann rechnen**", 0),
    ("Der Reiz liegt darin, wie oft das Bauchgefühl danebenliegt", 0),
])

d.chapter(1, "Denkfallen", "Wenn die schnelle Antwort falsch ist")

d.bullets("Der Klassiker mit Schläger und Ball", [
    ("Zusammen $1{,}10$ €, der Schläger kostet $1$ € **mehr** als der Ball", 0),
    ("Die schnelle Antwort $10$ Cent ist falsch", 0),
    ("Ansatz: $x + (x + 1) = 1{,}10$, also $2x = 0{,}10$", 0),
    ("Der Ball kostet **$5$ Cent**, der Schläger $1{,}05$ €", 0),
])

d.bullets("Die Seerosen und die Maschinen", [
    ("Die Fläche verdoppelt sich täglich, nach $48$ Tagen ist der See voll", 0),
    ("Halb voll war er einen Tag vorher — an **Tag $47$**", 0),
    ("Fünf Maschinen brauchen für fünf Teile fünf Minuten", 0),
    ("$100$ Maschinen brauchen für $100$ Teile ebenfalls **fünf** Minuten", 0),
])

d.bullets("Die Durchschnittsgeschwindigkeit", [
    ("$60$ km hin mit $30$ km/h, zurück mit $60$ km/h", 0),
    ("Nicht $45$ km/h — die Zeiten sind verschieden lang", 0),
    ("$2$ h hin, $1$ h zurück, also $120$ km in $3$ h", 0),
    ("Das sind **$40$ km/h**", 0),
])

d.merksatz("Bei Knobelaufgaben ist die erste Antwort meistens die, die man prüfen sollte.")

d.chapter(2, "Das Unerwartete", "Wenn das Ergebnis nicht ins Gefühl passt")

d.bullets("Das Seil um den Äquator", [
    ("Ein Seil liegt straff um die Erde und wird um **$1$ m** verlängert", 0),
    ("Der Umfang wächst um $1$, also der Radius um $\\dfrac{1}{2\\pi}$", 0),
    ("Das sind rund **$16$ cm** — überall, rund um den Globus", 0),
    ("Und es hängt **nicht** vom Erdradius ab: bei einem Ball wäre es dasselbe", 0),
])

d.bullets("Papier falten und große Zahlen", [
    ("Ein Blatt von $0{,}1$ mm, $42$-mal gefaltet: $0{,}1 \\cdot 2^{42}$ mm", 0),
    ("Das sind über **$400\\,000$ km** — weiter als bis zum Mond", 0),
    ("$2^{100}$ ist gewaltig größer als $100^{10}$", 0),
    ("Exponentielles Wachstum schlägt jede Potenz — das kennen wir vom Schachbrett", 0),
])

d.bullets("Der Geburtstag und der verschwundene Euro", [
    ("Bei $23$ Personen liegt die Wahrscheinlichkeit für einen gemeinsamen "
     "Geburtstag bei rund **$50\\,\\%$**", 0),
    ("Weil es nicht auf Paare mit **einem** ankommt, sondern auf **alle** Paare", 0),
    ("Beim Hotelrätsel wird falsch addiert: die $2$ € sind in den $27$ € **enthalten**", 0),
    ("Richtig: $25$ € Zimmer plus $2$ € Bote plus $3$ € zurück $= 30$ €", 0),
])

d.chapter(3, "Zählen und Kombinieren", "Aufgaben mit sauberem Ergebnis")

d.bullets("Systematisch zählen", [
    ("Handschläge bei $10$ Personen: $\\dfrac{10 \\cdot 9}{2} = 45$", 0),
    ("Diagonalen im Zwölfeck: $\\dfrac{12 \\cdot 9}{2} = 54$", 0),
    ("Vier Personen in einer Reihe: $4! = 24$ Möglichkeiten", 0),
    ("Und $0! = 1$ — es gibt genau eine Art, nichts anzuordnen", 0),
])

d.bullets("Der kleine Gauß und die Ziffern", [
    ("$1 + 2 + \\ldots + 100 = \\dfrac{100 \\cdot 101}{2} = 5050$", 0),
    ("Paare bilden: $1 + 100$, $2 + 99$ — jeweils $101$, fünfzigmal", 0),
    ("Die Ziffer $9$ kommt auf den Seiten $1$ bis $100$ **zwanzigmal** vor", 0),
    ("$10!$ endet auf **zwei** Nullen — durch die Faktoren $5$ und $10$", 0),
])

d.two_cols("Zwei Klassiker zum Selbstprobieren", [
    ("Hühner und Kaninchen", 0),
    ("$20$ Köpfe, $56$ Beine", 1),
    ("$x + y = 20$, $2x + 4y = 56$", 1),
    ("also $8$ Kaninchen", 1),
], [
    ("Die Wasserkrüge", 0),
    ("Krüge mit $8$, $5$ und $3$ Litern", 1),
    ("gesucht sind genau $4$ Liter", 1),
    ("nur umschütten, nicht schätzen", 1),
])

d.bullets("Zum Schluss", [
    ("**20 Knobeleien** im Mathe-Labor", 0),
    ("Erst schätzen, dann rechnen — und den Unterschied bemerken", 0),
    ("Die Folge $1,\\ 11,\\ 21,\\ 1211,\\ 111221$ liest sich selbst vor", 0),
    ("**docalvers.de/mathetest11-ausklang.html**", 0),
])

d.save()
