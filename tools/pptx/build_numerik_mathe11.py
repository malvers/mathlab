#!/usr/bin/env python3
"""Wahlbereich I: Numerische Verfahren - Mathe 11 (BGY), KW 21."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-numerik.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 21",
        "Numerische Verfahren",
        "Wahlbereich I — sich der Lösung nähern, wenn keine Formel mehr hilft")

d.bullets("Der Fahrplan dieser Woche", [
    ("Wahlbereich — Stunden **1 bis 5 von 10**", 0),
    ("Drei Blöcke: **Bisektion**, **Flächen in Streifen**, **selbst umsetzen**", 0),
    ("Numerisch heißt: **schrittweise annähern** statt exakt auflösen", 0),
    ("Kleine Programme oder Tabellen bauen wir selbst", 0),
])

d.chapter(1, "Die Bisektion", "Halbieren, bis es eng genug wird")

d.bullets("Die Idee", [
    ("Ein numerisches Verfahren nähert sich der Lösung **Schritt für Schritt**", 0),
    ("Die Bisektion braucht ein Intervall, an dessen Enden $f$ **verschiedene "
     "Vorzeichen** hat", 0),
    ("Dann liegt dazwischen mindestens eine Nullstelle", 0),
    ("Man halbiert und behält die Hälfte mit dem Vorzeichenwechsel", 0),
])

d.bullets("Ein Durchgang", [
    ("$f(x) = x^2 - 2$ mit $f(1) = -1$ und $f(2) = 2$", 0),
    ("Zuerst wird die Mitte geprüft: $x = 1{,}5$", 0),
    ("$f(1{,}5) = 0{,}25 > 0$, also liegt die Nullstelle links davon", 0),
    ("Weiter mit $[1; 1{,}5]$ — und wieder halbieren", 0),
])

d.bullets("Wie schnell wird es genau?", [
    ("Jeder Schritt **halbiert** die Intervalllänge", 0),
    ("Von $1$ auf $0{,}001$ braucht es rund **zehn** Schritte, denn $2^{10} = 1024$", 0),
    ("Das Verfahren nähert hier $\\sqrt{2} \\approx 1{,}4142$ an", 0),
    ("Abbruch, wenn das Intervall kürzer als die gewünschte Genauigkeit ist", 0),
])

d.bullets("Wo es nicht funktioniert", [
    ("$f(x) = x^2$ auf $[-1; 1]$: an beiden Enden ist $f$ **positiv**", 0),
    ("Es gibt zwar eine Nullstelle, aber **keinen Vorzeichenwechsel**", 0),
    ("Die Bisektion findet nur Nullstellen, an denen die Kurve die Achse **kreuzt**", 0),
    ("Deshalb vorher immer eine **Wertetabelle** aufstellen", 0),
])

d.merksatz("Die Bisektion ist langsam, aber sie kommt immer an — vorausgesetzt, das Vorzeichen wechselt.")

d.chapter(2, "Flächen numerisch", "In Streifen zerlegen")

d.bullets("Die Streifenmethode", [
    ("Die Fläche unter einer Kurve wird in schmale **Rechtecke** zerlegt", 0),
    ("Jedes Rechteck ist leicht zu berechnen, die Summe ist die Näherung", 0),
    ("Verdoppelt man die Streifenzahl, wird der Fehler etwa **halbiert**", 0),
    ("Beliebig genau, aber nie exakt — außer der Zufall will es", 0),
])

d.bullets("Eine Probe mit bekanntem Ergebnis", [
    ("Fläche unter $f(x) = x$ von $0$ bis $2$", 0),
    ("Das ist ein Dreieck mit Grundseite und Höhe $2$", 0),
    ("Exakt also $\\dfrac{2 \\cdot 2}{2} = 2$", 0),
    ("Genau solche Fälle nimmt man, um das eigene Verfahren zu **prüfen**", 0),
])

d.chapter(3, "Selbst umsetzen", "Warum Rechner das so gut können")

d.bullets("Immer derselbe Schritt", [
    ("Numerische Verfahren bestehen aus **einer** Regel, die man wiederholt", 0),
    ("Genau das kann ein Rechner millionenfach, ohne müde zu werden", 0),
    ("In einer Tabellenkalkulation ist jede Zeile ein Schritt", 0),
    ("**Konvergenz** heißt: die Schritte nähern sich einem festen Wert", 0),
])

d.bullets("Wenn es exakt nicht geht", [
    ("$x = \\cos x$ lässt sich **nicht** nach $x$ auflösen", 0),
    ("Es gibt trotzdem genau eine Lösung — sichtbar am Schnittpunkt", 0),
    ("Numerisch findet man sie in wenigen Schritten", 0),
    ("Ein numerisches Ergebnis ist eine **Näherung mit Genauigkeitsangabe**", 0),
])

d.two_cols("Exakt oder numerisch", [
    ("Exakt", 0),
    ("$\\sqrt{2}$ als Symbol", 1),
    ("beliebig weiterverwendbar", 1),
    ("nur für lösbare Formen", 1),
], [
    ("Numerisch", 0),
    ("$1{,}414$ mit Angabe der Genauigkeit", 1),
    ("Rundungsfehler wachsen mit", 1),
    ("funktioniert praktisch immer", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Bisektion, Streifen, Konvergenz", 0),
    ("Danach ein eigenes kleines Verfahren in der Tabellenkalkulation bauen", 0),
    ("In der Praxis rechnet fast jede Simulation so — Wetter, Statik, Strömung", 0),
    ("**docalvers.de/mathetest11-numerik.html**", 0),
])

d.save()
