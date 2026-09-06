#!/usr/bin/env python3
"""Matrizen: Begriff und Darstellung - Mathe 11 (BGY), KW 10, LB 4."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-matrizen.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 10",
        "Matrizen",
        "Ein Zahlenschema, das ganze Gleichungssysteme in eine Zeile packt")

d.bullets("Der Fahrplan dieser Woche", [
    ("**Neuer Lernbereich 4** — Stunden **1 bis 5 von 20**", 0),
    ("Drei Blöcke: **Begriff und Format**, **besondere Matrizen**, "
     "**Gleichungssysteme in Matrixform**", 0),
    ("Der Nutzen zeigt sich erst später — aber ohne die Schreibweise geht es nicht", 0),
    ("Anwendungen aus Wirtschaft und Technik, und die Brücke zur Informatik", 0),
])

d.chapter(1, "Begriff und Format", "Zeilen zuerst, Spalten danach")

d.bullets("Was eine Matrix ist", [
    ("Ein **rechteckiges Zahlenschema** aus Zeilen und Spalten", 0),
    ("$3$ Zeilen und $4$ Spalten ergeben das Format $3 \\times 4$", 0),
    ("**Zeilen zuerst** — das ist die Reihenfolge, die man sich merken muss", 0),
    ("Eine $4 \\times 5$-Matrix hat also $20$ Einträge", 0),
])

d.bullets("Einträge benennen", [
    ("$a_{23}$ steht in **Zeile $2$**, **Spalte $3$**", 0),
    ("Auch hier: erst der Zeilenindex, dann der Spaltenindex", 0),
    ("Zwei Matrizen sind gleich, wenn sie **dasselbe Format** haben", 0),
    ("und **an jeder Stelle denselben Eintrag** tragen", 0),
])

d.bullets("Ein Beispiel aus dem Betrieb", [
    ("Drei Produkte brauchen je vier Rohstoffe", 0),
    ("Schreibt man die Produkte als Zeilen, ist das Format $3 \\times 4$", 0),
    ("Jede Zeile ist ein Produkt, jede Spalte ein Rohstoff", 0),
    ("Die Zuordnung muss man **festlegen und dabeischreiben**", 0),
])

d.chapter(2, "Besondere Matrizen", "Namen für wiederkehrende Formen")

d.bullets("Nach der Form", [
    ("**Quadratisch**: gleich viele Zeilen wie Spalten", 0),
    ("**Spaltenvektor**: nur eine Spalte, Format $n \\times 1$", 0),
    ("**Zeilenvektor**: nur eine Zeile", 0),
    ("**Nullmatrix**: überall null, das neutrale Element der Addition", 0),
])

d.bullets("Nach der Besetzung", [
    ("**Obere Dreiecksmatrix**: unterhalb der Hauptdiagonale steht nur null", 0),
    ("$A = \\begin{pmatrix} 2 & 5 \\\\ 0 & 3 \\end{pmatrix}$ ist so eine", 0),
    ("**Diagonalmatrix**: nur auf der Hauptdiagonale stehen Werte", 0),
    ("**Einheitsmatrix**: Diagonalmatrix mit lauter Einsen", 0),
])

d.bullets("Die Einheitsmatrix kann alles auf einmal", [
    ("$E = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$", 0),
    ("Sie ist **Diagonalmatrix**, obere **und** untere Dreiecksmatrix", 0),
    ("Und sie ist **symmetrisch**: gespiegelt an der Diagonale bleibt sie gleich", 0),
    ("Sie spielt bei Matrizen die Rolle der Eins", 0),
])

d.bullets("Transponieren", [
    ("$A^\\mathsf{T}$ entsteht, indem man **Zeilen und Spalten vertauscht**", 0),
    ("$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}^\\mathsf{T} = "
     "\\begin{pmatrix} 1 & 3 \\\\ 2 & 4 \\end{pmatrix}$", 0),
    ("Aus dem Format $2 \\times 5$ wird dabei $5 \\times 2$", 0),
    ("Zweimal transponiert ergibt wieder das Original", 0),
])

d.merksatz("Zeilen zuerst, Spalten danach — beim Format wie beim Eintrag.")

d.chapter(3, "Gleichungssysteme als Matrix", "Wozu der ganze Aufwand gut ist")

d.bullets("Die Koeffizientenmatrix", [
    ("Zu $2x + 3y = 7$ und $x - y = 1$ gehört "
     "$\\begin{pmatrix} 2 & 3 \\\\ 1 & -1 \\end{pmatrix}$", 0),
    ("Nur die **Zahlen vor den Unbekannten** stehen darin", 0),
    ("Die **erweiterte** Koeffizientenmatrix nimmt die rechte Seite mit auf", 0),
    ("Also zusätzlich die Spalte mit $7$ und $1$", 0),
])

d.bullets("Die kurze Schreibweise", [
    ("$A \\cdot \\vec{x} = \\vec{b}$ fasst das ganze System zusammen", 0),
    ("$A$ ist die Koeffizientenmatrix, $\\vec{x}$ der Vektor der Unbekannten", 0),
    ("$\\vec{b}$ ist die rechte Seite", 0),
    ("Eine $3 \\times 3$-Koeffizientenmatrix gehört zu **drei** Unbekannten", 0),
])

d.two_cols("Warum überhaupt Matrizen?", [
    ("Für den Menschen", 0),
    ("kein $x$, $y$, $z$ mehr mitschleppen", 1),
    ("Struktur wird sichtbar", 1),
    ("Verfahren lassen sich schematisch üben", 1),
], [
    ("Für den Rechner", 0),
    ("nur noch ein Zahlenfeld", 1),
    ("Grafik, KI und Simulation rechnen so", 1),
    ("Hardware ist darauf optimiert", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Format, Sondertypen, Matrixform", 0),
    ("Bei jeder Aufgabe zuerst: **wie viele Zeilen, wie viele Spalten?**", 0),
    ("Nächste Woche lösen wir Gleichungssysteme damit — nach Gauß", 0),
    ("**docalvers.de/mathetest11-matrizen.html**", 0),
])

d.save()
