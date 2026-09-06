#!/usr/bin/env python3
"""Vertiefung Funktionen - Mathe 11 (BGY), KW 51, Uebungszirkel."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-funktionen-vertiefung.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 51",
        "Welcher Funktionstyp passt?",
        "Übungszirkel zum Jahresausklang — alle Typen gemischt")

d.bullets("Der Fahrplan dieser Woche", [
    ("**Übungszirkel**: alle Funktionstypen des Halbjahres durcheinander", 0),
    ("Die eigentliche Frage ist nicht mehr **wie rechne ich**, sondern **welcher Typ ist das**", 0),
    ("Drei Blöcke: **Typ erkennen**, **Eigenschaften vergleichen**, **Modelle beurteilen**", 0),
    ("Dazu ein paar Mathe-Rätsel zum Jahresausklang", 0),
])

d.chapter(1, "Den Typ erkennen", "Am Sachtext, an der Tabelle, am Graphen")

d.bullets("Die Signalwörter im Sachtext", [
    ("**Jeden Monat $50$ € mehr** — immer derselbe Betrag, also **linear**", 0),
    ("**Jedes Jahr $8\\,\\%$ mehr** — immer derselbe Faktor, also **exponentiell**", 0),
    ("**Bremsweg zur Geschwindigkeit** — er wächst überproportional, also **quadratisch**", 0),
    ("**Tageslänge im Jahresverlauf** — sie kehrt wieder, also **periodisch**", 0),
])

d.bullets("Die Tabelle entlarvt den Typ", [
    ("$f(0)=1$, $f(1)=3$, $f(2)=9$, $f(3)=27$ — immer mal $3$", 0),
    ("Also $f(x) = 3^x$, exponentiell", 0),
    ("Prüfgriff: erst **Differenzen** bilden, dann **Quotienten**", 0),
    ("Gleiche Differenz heißt linear, gleicher Quotient exponentiell", 0),
])

d.bullets("Modelle aus Beschreibungen bauen", [
    ("Startwert $200$, Zunahme $15\\,\\%$ pro Jahr: $f(t) = 200 \\cdot 1{,}15^t$", 0),
    ("Halbierung alle $10$ Jahre: $f(t) = a \\cdot 0{,}5^{t/10}$", 0),
    ("Graph durch $(0 \\mid 4)$, halbiert sich je Schritt: $f(x) = 4 \\cdot 0{,}5^x$", 0),
    ("Achsenabschnitt $-2$, Anstieg $3$: $f(x) = 3x - 2$", 0),
])

d.merksatz("Der Startwert steht an der y-Achse. Wie es weitergeht, entscheidet der Typ.")

d.chapter(2, "Eigenschaften vergleichen", "Dieselben Fragen an jeden Typ")

d.bullets("Nullstellen: wer hat keine?", [
    ("$f(x) = 2^x$ hat **keine** — eine Potenz wird nie null", 0),
    ("$f(x) = \\dfrac{1}{x}$ hat auch keine, und ist bei $x = 0$ nicht definiert", 0),
    ("$f(x) = x^2 + 3$ hat keine, weil sie ganz oberhalb der Achse liegt", 0),
    ("Jede lineare Funktion mit $m \\neq 0$ hat **genau eine**", 0),
])

d.bullets("Monotonie und Wertebereich", [
    ("Auf ganz $\\mathbb{R}$ streng monoton steigend: $f(x) = 2^x$ und jede Gerade mit $m > 0$", 0),
    ("$f(x) = x^2$ ist es **nicht** — sie fällt links von null", 0),
    ("$f(x) = -x^2 + 4$ ist nach unten geöffnet, Scheitel $(0 \\mid 4)$", 0),
    ("Wertebereich $y \\geq -4$ passt zu $f(x) = x^2 - 4$", 0),
])

d.bullets("Symmetrie und Verschiebung", [
    ("$f(-x) = f(x)$ gilt für **gerade** Exponenten, etwa $x^2$ oder $x^4$", 0),
    ("Von $f(x) = x^2$ zu $g(x) = (x + 3)^2 - 1$: drei nach **links**, eins nach unten", 0),
    ("Im Term steht $+3$, verschoben wird nach links — die Dauerfalle", 0),
    ("Bei allen Typen gilt dieselbe Regel für Verschiebungen", 0),
])

d.bullets("Wenn zwei Graphen sich treffen", [
    ("$f(x) = 2x + 1$ und $g(x) = x^2$ gleichsetzen", 0),
    ("$x^2 - 2x - 1 = 0$ gibt $x = 1 \\pm \\sqrt{2}$", 0),
    ("Tarif A $12$ € fest, Tarif B $0{,}20$ € je Minute: $0{,}2t = 12$", 0),
    ("Also bei $60$ Minuten gleich teuer", 0),
])

d.chapter(3, "Modelle beurteilen", "Rechnen ist nur die halbe Arbeit")

d.two_cols("Wer überholt wen?", [
    ("Anfangs schneller", 0),
    ("$f(x) = x^2$ bei kleinen $x$", 1),
    ("lineare Funktionen mit großem $m$", 1),
    ("wirkt lange überlegen", 1),
], [
    ("Am Ende schneller", 0),
    ("$f(x) = 2^x$", 1),
    ("überholt jede Potenz", 1),
    ("nur eine Frage der Reichweite", 1),
])

d.bullets("Warum Rechnen allein nicht reicht", [
    ("Ein Modell gilt immer nur in einem **Gültigkeitsbereich**", 0),
    ("Exponentielles Wachstum endet spätestens, wenn der Platz ausgeht", 0),
    ("Negative Längen, Zeiten vor dem Start: **verwerfen und begründen**", 0),
    ("Zum Modellieren gehört immer die Frage: **passt das zur Wirklichkeit?**", 0),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — alle Typen gemischt", 0),
    ("Bei jeder Aufgabe zuerst den **Typ** benennen, dann rechnen", 0),
    ("Was hier hakt, kommt im zweiten Halbjahr wieder", 0),
    ("**docalvers.de/mathetest11-funktionen-vertiefung.html**", 0),
])

d.save()
