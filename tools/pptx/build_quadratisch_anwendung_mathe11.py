#!/usr/bin/env python3
"""Anwendungen quadratischer Modelle - Mathe 11 (BGY), KW 48, LB 3."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-quadratisch-anwendung.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 48",
        "Quadratische Modelle",
        "Wurfparabel, Brückenbogen, größter Gewinn — Extremwerte ohne Ableitung")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 3 — Stunden **26 bis 30 von 75**", 0),
    ("Drei Blöcke: **Modell aufstellen**, **Extremwerte über den Scheitel**, "
     "**Ergebnisse prüfen**", 0),
    ("Der Scheitelpunkt beantwortet jede Frage nach dem **Größten oder Kleinsten**", 0),
    ("Am Ende **20 Aufgaben** — Wurf, Zaun, Gewinn, Brücke", 0),
])

d.chapter(1, "Vom Sachtext zum Modell", "Was ist x, was ist y?")

d.bullets("Der Wurf", [
    ("$h(x) = -0{,}05x^2 + x$ beschreibt die Höhe in Abhängigkeit von der Weite", 0),
    ("Am Boden ist $h = 0$: $x(-0{,}05x + 1) = 0$", 0),
    ("Also $x = 0$ (Abwurf) und $x = 20$ m (Landung)", 0),
    ("Der Scheitel liegt **mittig** zwischen den Nullstellen, bei $x = 10$ m", 0),
])

d.bullets("Was die Zahlen im Term bedeuten", [
    ("Bei $h(x) = -0{,}1x^2 + 2x + 1{,}5$ ist $1{,}5$ die **Abwurfhöhe**", 0),
    ("Denn bei $x = 0$ ist der Ball noch in der Hand", 0),
    ("Bei $K(x) = 0{,}5x^2 + 20$ sind $20$ die **Fixkosten** — auch ohne Produktion", 0),
    ("Das absolute Glied ist immer der **Wert am Start**", 0),
])

d.bullets("Wenn die Fläche gesucht ist", [
    ("Rechteck mit Umfang $24$ cm, Breite $b$: die Länge ist dann $12 - b$", 0),
    ("Also $A(b) = b(12 - b) = -b^2 + 12b$", 0),
    ("Nullstellen $b = 0$ und $b = 12$, Scheitel mittig bei $b = 6$", 0),
    ("Größte Fläche also beim **Quadrat** — das ist kein Zufall", 0),
])

d.bullets("Der Zaun am Haus", [
    ("$40$ m Zaun auf **drei** Seiten, die Hauswand ist die vierte", 0),
    ("Mit Breite $b$ ist die Länge $40 - 2b$", 0),
    ("$A(b) = b(40 - 2b) = -2b^2 + 40b$, Nullstellen $0$ und $20$", 0),
    ("Scheitel bei $b = 10$: $A = 10 \\cdot 20 = 200$ m²", 0),
])

d.merksatz("Erst benennen, was x ist. Fast jeder Fehler in Modellaufgaben passiert vor der ersten Rechnung.")

d.chapter(2, "Extremwerte", "Der Scheitel ist die Antwort")

d.bullets("Den Scheitel ohne Ableitung finden", [
    ("Zwei Nullstellen bekannt: der Scheitel liegt **genau in der Mitte**", 0),
    ("Sonst quadratisch ergänzen oder $x_S = -\\dfrac{p}{2}$ bei Normalform", 0),
    ("$G(x) = -x^2 + 60x - 500$: Scheitel bei $x = 30$ Stück", 0),
    ("Maximaler Gewinn $G(30) = -900 + 1800 - 500 = 400$ €", 0),
])

d.bullets("Ab wann lohnt es sich?", [
    ("Gewinnzone heißt $G(x) > 0$, also zuerst die Nullstellen", 0),
    ("$-x^2 + 60x - 500 = 0$ gibt $x^2 - 60x + 500 = 0$", 0),
    ("$x = 30 \\pm \\sqrt{900 - 500} = 30 \\pm 20$, also $10$ und $50$", 0),
    ("Zwischen $10$ und $50$ Stück wird Gewinn gemacht", 0),
])

d.bullets("Zwei Zahlen, ein Produkt", [
    ("Summe $20$, Produkt möglichst groß", 0),
    ("Mit $x$ und $20 - x$: $P(x) = 20x - x^2$", 0),
    ("Scheitel bei $x = 10$ — also **beide gleich**", 0),
    ("Bei fester Summe ist das Produkt maximal, wenn die Zahlen gleich sind", 0),
])

d.bullets("Symmetrie spart Rechnung", [
    ("Ein Ball erreicht die größte Höhe nach $2$ s und landet nach $4$ s", 0),
    ("Das passt zusammen: der Scheitel liegt **mittig** zwischen Start und Landung", 0),
    ("Parabel durch $(0 \\mid 0)$ und $(6 \\mid 0)$ mit Hochpunkt $y = 9$", 0),
    ("Scheitel also bei $(3 \\mid 9)$", 0),
])

d.chapter(3, "Ergebnisse prüfen", "Das Modell rechnet weiter, auch wo es unsinnig wird")

d.bullets("Nicht jede Lösung ist eine Antwort", [
    ("Stein vom $45$ m hohen Turm: $h(t) = 45 - 5t^2$", 0),
    ("$5t^2 = 45$ gibt $t = 3$ und $t = -3$", 0),
    ("$t = -3$ liegt **vor dem Loslassen** — als Zeit sinnlos", 0),
    ("Ein Längenwert $x = -2{,}5$ m wird genauso **begründet verworfen**", 0),
])

d.bullets("Reicht die Höhe?", [
    ("$h(x) = -0{,}02x^2 + 0{,}8x$ soll über eine $6$ m hohe Mauer", 0),
    ("Nullstellen $0$ und $40$, Scheitel bei $x = 20$", 0),
    ("$h(20) = -8 + 16 = 8$ m — die Scheitelhöhe **reicht**", 0),
    ("Aber nur, wenn die Mauer auch **beim Scheitel** steht: Ort mitprüfen", 0),
])

d.two_cols("Modellieren heißt hin und zurück", [
    ("Hinweg", 0),
    ("Größen benennen", 1),
    ("Term aufstellen", 1),
    ("rechnen: Nullstellen, Scheitel", 1),
], [
    ("Rückweg", 0),
    ("Einheiten prüfen", 1),
    ("unsinnige Lösungen verwerfen", 1),
    ("Antwortsatz im Sachkontext", 1),
])

d.bullets("Einheiten verraten Fehler", [
    ("In $h(t) = a\\,t^2$ steht $h$ in Metern und $t$ in Sekunden", 0),
    ("Damit muss $a$ die Einheit m/s² haben", 0),
    ("Ein quadratisches Modell passt zum Wurf, weil die **Beschleunigung konstant** ist", 0),
    ("Ein Brückenbogen $h(x) = -0{,}01x^2 + 4$ ist am Boden $40$ m breit", 0),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Wurf, Fläche, Gewinn, Brücke", 0),
    ("Bei jeder Aufgabe zuerst: **was ist x, was ist y, was ist gesucht?**", 0),
    ("Und am Ende: **passt das Ergebnis zur Wirklichkeit?**", 0),
    ("**docalvers.de/mathetest11-quadratisch-anwendung.html**", 0),
])

d.save()
