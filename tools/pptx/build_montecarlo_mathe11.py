#!/usr/bin/env python3
"""Wahlbereich II: Monte-Carlo-Methode - Mathe 11 (BGY), KW 22."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-montecarlo.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 22",
        "Monte Carlo",
        "Wahlbereich II — mit dem Zufall rechnen und dabei π werfen")

d.bullets("Der Fahrplan dieser Woche", [
    ("Wahlbereich — Stunden **6 bis 10 von 10**", 0),
    ("Drei Blöcke: **die Idee**, **$\\pi$ schätzen**, **selbst programmieren**", 0),
    ("Der Zufall wird hier nicht untersucht, sondern als **Werkzeug** benutzt", 0),
    ("Brücke zur Informatik: dasselbe Verfahren steckt in Grafik und Finanzmodellen", 0),
])

d.chapter(1, "Die Idee", "Fläche durch Abzählen")

d.bullets("Worauf es beruht", [
    ("Zufällige Punkte gleichmäßig über eine bekannte Fläche streuen", 0),
    ("Der **Anteil** der Treffer entspricht dem Anteil der gesuchten Fläche", 0),
    ("Also gesuchte Fläche $\\approx$ bekannte Fläche mal Trefferanteil", 0),
    ("Der Name stammt vom Spielkasino in Monte Carlo — wegen des Zufalls", 0),
])

d.bullets("Eine Fläche schätzen", [
    ("Ein Rechteck von $20$ cm², $35\\,\\%$ der Punkte liegen in der Figur", 0),
    ("Also ist die Figur etwa $0{,}35 \\cdot 20 = 7$ cm² groß", 0),
    ("Genauso schätzt man die Fläche eines Sees auf einer Karte", 0),
    ("Voraussetzung: die Punkte müssen **gleichmäßig verteilt** und unabhängig sein", 0),
])

d.chapter(2, "Pi werfen", "Der Klassiker")

d.bullets("Der Aufbau", [
    ("Ein Viertelkreis mit $r = 1$ liegt im Einheitsquadrat", 0),
    ("Quadratfläche $1$, Viertelkreisfläche $\\dfrac{\\pi}{4} \\approx 0{,}785$", 0),
    ("Ein Punkt $(x \\mid y)$ liegt im Viertelkreis, wenn $x^2 + y^2 \\leq 1$", 0),
    ("Also wird nur der Abstand zum Ursprung geprüft", 0),
])

d.bullets("Aus dem Trefferanteil wird pi", [
    ("Der Trefferanteil nähert $\\dfrac{\\pi}{4}$ an", 0),
    ("Also $\\pi \\approx 4 \\cdot$ Trefferanteil", 0),
    ("$7830$ Treffer von $10\\,000$ ergeben $4 \\cdot 0{,}783 = 3{,}132$", 0),
    ("Nicht schlecht — aber noch nicht auf zwei Stellen sicher", 0),
])

d.bullets("Wie viele Würfe braucht man?", [
    ("Die Genauigkeit wächst nur mit der **Wurzel** der Wurfzahl", 0),
    ("Hundertmal mehr Würfe bringen nur zehnmal mehr Genauigkeit", 0),
    ("Für zwei sichere Nachkommastellen bei $\\pi$ braucht es grob "
     "**hunderttausend** Würfe", 0),
    ("Deshalb ist Monte Carlo für einfache Flächen ineffizient", 0),
])

d.merksatz("Monte Carlo wird nie exakt. Es wird nur immer wahrscheinlicher nah dran.")

d.chapter(3, "Umsetzen und einordnen", "Wo das Verfahren wirklich glänzt")

d.bullets("In der Tabellenkalkulation", [
    ("Zwei Spalten mit Zufallszahlen für $x$ und $y$", 0),
    ("Eine Spalte prüft $x^2 + y^2 \\leq 1$ und liefert $1$ oder $0$", 0),
    ("Der Mittelwert dieser Spalte ist der Trefferanteil", 0),
    ("Mal $4$ ergibt die Schätzung — jeder Neuberechnung ein anderer Wert", 0),
])

d.bullets("Was das Diagramm zeigt", [
    ("Trägt man die Schätzung über der Wurfzahl auf, **pendelt** sie sich ein", 0),
    ("Am Anfang große Ausschläge, später ein enges Band um $\\pi$", 0),
    ("Genau das Bild des Gesetzes der großen Zahlen", 0),
    ("Zur ehrlichen Angabe gehören **Wurfzahl und Schwankungsbreite**", 0),
])

d.two_cols("Zwei numerische Wege", [
    ("Streifenmethode", 0),
    ("systematisch, deterministisch", 1),
    ("bei einer Variablen sehr gut", 1),
    ("wird in vielen Dimensionen unbezahlbar", 1),
], [
    ("Monte Carlo", 0),
    ("zufällig, jedes Mal anders", 1),
    ("bei einer Variablen ineffizient", 1),
    ("in vielen Dimensionen konkurrenzlos", 1),
])

d.bullets("Wo es in der Praxis steckt", [
    ("**Finanzwirtschaft**: Risiken über tausende Szenarien durchspielen", 0),
    ("**Computergrafik**: Lichtwege in Filmen und Spielen", 0),
    ("**Physik und Technik**: Teilchen, Strahlung, Strömungen", 0),
    ("Überall dort, wo ein Problem **zu viele Einflüsse** hat, um es auszurechnen", 0),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Idee, $\\pi$-Schätzung, Genauigkeit", 0),
    ("Danach die eigene Simulation bauen und das Diagramm anschauen", 0),
    ("Reizvoll ist daran: **Zufall löst ein Problem, das gar nichts mit Zufall zu tun hat**", 0),
    ("**docalvers.de/mathetest11-montecarlo.html**", 0),
])

d.save()
