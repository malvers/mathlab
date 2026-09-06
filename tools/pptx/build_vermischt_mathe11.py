#!/usr/bin/env python3
"""Vermischte Uebungen - Mathe 11 (BGY), KW 23."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-vermischt.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 23",
        "Vermischte Übungen",
        "Alles aus dem Jahr im Wechsel — die Grundlagen für Jahrgang 12 sichern")

d.bullets("Der Fahrplan dieser Woche", [
    ("**Übungswoche** quer durch alle vier Lernbereiche", 0),
    ("Drei Blöcke: **Gleichungen und Terme**, **Funktionen**, "
     "**Stochastik und Systeme**", 0),
    ("Der Reiz liegt im Wechsel: man muss das **Werkzeug erst wählen**", 0),
    ("Dazu die typischen Fehlerquellen — noch einmal benannt", 0),
])

d.chapter(1, "Gleichungen und Terme", "Das Handwerk")

d.bullets("Gemischtes Lösen", [
    ("$5x - 7 = 2x + 8$ gibt $3x = 15$, also $x = 5$", 0),
    ("$x^2 - 6x + 5 = 0$ über Vieta: $x = 1$ und $x = 5$", 0),
    ("$2^x = 64$ gibt $x = 6$", 0),
    ("$x^2 + 1 = 0$ hat in den reellen Zahlen **keine** Lösung", 0),
])

d.bullets("Umstellen und vereinfachen", [
    ("$A = \\pi r^2$ nach $r$: $r = \\sqrt{\\dfrac{A}{\\pi}}$", 0),
    ("$(2x + 5)(2x - 5) = 4x^2 - 25$ — dritte binomische Formel", 0),
    ("$\\dfrac{x^6}{x^2} = x^4$ — Exponenten subtrahieren", 0),
    ("$\\log_3 81 = 4$, denn $3^4 = 81$", 0),
])

d.chapter(2, "Funktionen", "Erkennen, umformen, deuten")

d.bullets("Scheitel, Periode, Definitionsbereich", [
    ("$f(x) = x^2 + 4x + 1$: quadratisch ergänzen zu $(x + 2)^2 - 3$", 0),
    ("Scheitel also $S(-2 \\mid -3)$", 0),
    ("$f(x) = \\sin\\left(\\dfrac{x}{3}\\right)$ hat die Periode $6\\pi$", 0),
    ("$f(x) = \\sqrt{2x - 6}$ verlangt $2x - 6 \\geq 0$, also $x \\geq 3$", 0),
])

d.bullets("Umkehren, Wachstum, Symmetrie", [
    ("$f(x) = \\dfrac{x}{2} + 4$ umgekehrt: $f^{-1}(x) = 2x - 8$", 0),
    ("$2\\,\\%$ jährlich über $3$ Jahre: Faktor $1{,}02^3 \\approx 1{,}061$", 0),
    ("$f(x) = x^3 + 2x$ hat nur **ungerade** Exponenten: punktsymmetrisch", 0),
    ("$R^2 = 0{,}45$ heißt: das Modell passt **eher schlecht**", 0),
])

d.merksatz("Wer den Typ erkennt, hat die halbe Aufgabe gelöst. Rechnen ist dann Handwerk.")

d.chapter(3, "Stochastik und Systeme", "Die beiden Lernbereiche des zweiten Halbjahres")

d.bullets("Zufall", [
    ("Zwei Sechsen bei zwei Würfen: $\\dfrac{1}{36}$", 0),
    ("Faires Münzspiel, Kopf bringt $2$ €, Zahl kostet $2$ €", 0),
    ("Erwartungswert $0{,}5 \\cdot 2 - 0{,}5 \\cdot 2 = 0$ — also **fair**", 0),
    ("Bei „mindestens“ immer zuerst ans Gegenereignis denken", 0),
])

d.bullets("Gleichungssysteme und Körper", [
    ("$x + y = 10$ und $x - y = 4$: addieren gibt $2x = 14$", 0),
    ("Also $x = 7$ und $y = 3$", 0),
    ("Zylinder mit $r = 4$ cm, $h = 5$ cm: Mantelfläche $2\\pi r h = 40\\pi$ cm²", 0),
    ("Der Mantel ist ein aufgerolltes Rechteck — Umfang mal Höhe", 0),
])

d.two_cols("Was ihr nach Klasse 12 mitnehmt", [
    ("Sicheres Handwerk", 0),
    ("Gleichungen ohne Hilfsmittel", 1),
    ("Terme umformen", 1),
    ("Formeln umstellen", 1),
], [
    ("Sichere Begriffe", 0),
    ("Funktionstypen erkennen", 1),
    ("Modelle aufstellen und prüfen", 1),
    ("Ergebnisse deuten statt nur rechnen", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 gemischte Aufgaben** im Mathe-Labor", 0),
    ("Bei jeder zuerst benennen: **welches Thema, welches Werkzeug?**", 0),
    ("Was hier hakt, ist genau das, was in Klasse 12 gebraucht wird", 0),
    ("**docalvers.de/mathetest11-vermischt.html**", 0),
])

d.save()
