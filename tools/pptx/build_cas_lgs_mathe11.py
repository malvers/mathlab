#!/usr/bin/env python3
"""Groessere LGS mit CAS, Matrizenoperationen - Mathe 11 (BGY), KW 14, LB 4."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-cas-lgs.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 14",
        "Rechnen mit Matrizen",
        "Addieren, strecken, transponieren — und große Gleichungssysteme dem CAS überlassen")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 4 — Stunden **16 bis 20 von 20**, damit ist **LB 4 fertig**", 0),
    ("Drei Blöcke: **Matrizenoperationen**, **CAS bei großen Systemen**, **Anwendungen**", 0),
    ("Das Rechnen übernimmt die Maschine, das **Deuten** bleibt bei euch", 0),
    ("Bezug zur informatischen Bildung: so rechnet jeder Grafikchip", 0),
])

d.chapter(1, "Matrizenoperationen", "Drei Rechenarten, alle harmlos")

d.bullets("Addieren", [
    ("Zwei Matrizen lassen sich addieren, wenn sie **dasselbe Format** haben", 0),
    ("Addiert wird **eintragsweise**, Position für Position", 0),
    ("$\\begin{pmatrix} 1 & 0 \\\\ 2 & 3 \\end{pmatrix} + "
     "\\begin{pmatrix} 4 & 1 \\\\ -2 & 0 \\end{pmatrix} = "
     "\\begin{pmatrix} 5 & 1 \\\\ 0 & 3 \\end{pmatrix}$", 0),
    ("Die Reihenfolge ist egal — die Addition ist **kommutativ**", 0),
])

d.bullets("Mit einer Zahl multiplizieren", [
    ("Die **skalare Multiplikation** trifft **jeden** Eintrag", 0),
    ("$2 \\cdot \\begin{pmatrix} 1 & 3 \\\\ 0 & -2 \\end{pmatrix} = "
     "\\begin{pmatrix} 2 & 6 \\\\ 0 & -4 \\end{pmatrix}$", 0),
    ("Mal null ergibt die **Nullmatrix**", 0),
    ("Die Nullmatrix ist zugleich das neutrale Element der Addition", 0),
])

d.bullets("Transponieren", [
    ("$A^\\mathsf{T}$ vertauscht Zeilen und Spalten", 0),
    ("$\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}^\\mathsf{T} = "
     "\\begin{pmatrix} 1 & 3 \\\\ 2 & 4 \\end{pmatrix}$", 0),
    ("Aus dem Format $2 \\times 5$ wird $5 \\times 2$", 0),
    ("Zweimal transponiert ergibt wieder $A$", 0),
])

d.bullets("Symmetrisch", [
    ("Eine Matrix heißt **symmetrisch**, wenn $A^\\mathsf{T} = A$ gilt", 0),
    ("Sie muss dafür quadratisch sein", 0),
    ("Gespiegelt an der Hauptdiagonale ändert sich nichts", 0),
    ("Die Einheitsmatrix ist das einfachste Beispiel", 0),
])

d.merksatz("Skalare Multiplikation streckt jeden Eintrag. Das ist etwas ganz anderes als zwei Matrizen miteinander zu multiplizieren.")

d.chapter(2, "Das CAS bei großen Systemen", "Was die Maschine tut und was nicht")

d.bullets("Was das CAS abnimmt", [
    ("Ein System mit fünf Unbekannten löst es in Sekunden", 0),
    ("Es macht **keine Rechenfehler** und wird nicht müde", 0),
    ("Eingabe meist als **erweiterte Koeffizientenmatrix**", 0),
    ("Deshalb war die Matrixschreibweise der letzten Wochen kein Selbstzweck", 0),
])

d.bullets("Was eure Aufgabe bleibt", [
    ("Das System **aufstellen** — der Rechner kennt den Sachtext nicht", 0),
    ("Die Ausgabe **deuten** und in den Sachzusammenhang zurückübersetzen", 0),
    ("Meldet das CAS „keine Lösung“, zuerst die **Eingabe prüfen**", 0),
    ("Ein Tippfehler sieht genauso aus wie ein widersprüchliches System", 0),
])

d.bullets("Wenn ein Parameter in der Antwort steht", [
    ("Gibt das CAS die Lösung mit einem $t$ aus, gibt es **unendlich viele**", 0),
    ("Eine Unbekannte ist frei wählbar, die anderen hängen davon ab", 0),
    ("Zwei gleiche Zeilen in der Koeffizientenmatrix sind der typische Grund", 0),
    ("Sachlich heißt das: eine Bedingung wurde **doppelt** formuliert", 0),
])

d.bullets("Die Probe geht immer", [
    ("Lösung in **alle** Ausgangsgleichungen einsetzen", 0),
    ("Das ist auch bei fünf Unbekannten in einer Minute erledigt", 0),
    ("Nur so merkt man einen Eingabefehler", 0),
    ("Ein negativer Anteil in einer Mischung ist rechnerisch gültig, sachlich nicht", 0),
])

d.chapter(3, "Anwendungen", "Wofür man das in Betrieb und Technik braucht")

d.bullets("Bedarfsrechnung", [
    ("Drei Produkte, vier Rohstoffe: die Bedarfsmatrix hat das Format $3 \\times 4$", 0),
    ("Multipliziert mit dem Stückzahlvektor ergibt sich der **Gesamtbedarf** je Rohstoff", 0),
    ("Eine Rechnung statt zwölf Einzelrechnungen", 0),
    ("Genau dafür wurde die Schreibweise erfunden", 0),
])

d.two_cols("Warum Rechner Matrizen lieben", [
    ("Technisch", 0),
    ("nur ein gleichförmiges Zahlenfeld", 1),
    ("dieselbe Operation millionenfach", 1),
    ("Grafikkarten sind darauf gebaut", 1),
], [
    ("Praktisch", 0),
    ("Bilddrehungen und Skalierungen", 1),
    ("Simulationen in der Technik", 1),
    ("neuronale Netze rechnen so", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Operationen, CAS-Ausgaben deuten, Anwendungen", 0),
    ("Damit ist **Lernbereich 4 abgeschlossen**", 0),
    ("Bei jeder CAS-Ausgabe fragen: **was heißt das für die Aufgabe?**", 0),
    ("**docalvers.de/mathetest11-cas-lgs.html**", 0),
])

d.save()
