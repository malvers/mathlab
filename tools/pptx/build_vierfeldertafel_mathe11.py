#!/usr/bin/env python3
"""Vierfeldertafeln und bedingte Wahrscheinlichkeit - Mathe 11 (BGY), KW 16, LB 1."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-vierfeldertafel.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 16",
        "Vierfeldertafeln",
        "Zwei Merkmale, vier Felder — und die Frage, was von was abhängt")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 1 — Stunden **6 bis 10 von 15**", 0),
    ("Drei Blöcke: **Tafel ausfüllen**, **bedingte Wahrscheinlichkeit**, "
     "**Unabhängigkeit prüfen**", 0),
    ("Die Tafel ist nur eine andere Sicht auf denselben Zufallsversuch", 0),
    ("Am Ende die berühmteste Falle der Stochastik: der medizinische Test", 0),
])

d.chapter(1, "Die Tafel ausfüllen", "Vier Felder innen, die Ränder außen")

d.bullets("Der Aufbau", [
    ("Zwei Merkmale, jedes mit **ja** und **nein** — daraus **vier** innere Felder", 0),
    ("Die **Randfelder** enthalten die Summen der Zeilen und Spalten", 0),
    ("Rechts unten steht die Gesamtzahl, bei Anteilen also $1$", 0),
    ("Die vier inneren Felder summieren sich immer zu **$1$** bzw. zur Gesamtzahl", 0),
])

d.bullets("Am sichersten füllt man von außen", [
    ("Zuerst alles eintragen, was direkt im Text steht", 0),
    ("Dann die **Randsummen** ergänzen", 0),
    ("Erst danach die fehlenden inneren Felder durch Subtraktion", 0),
    ("Wer innen anfängt, verrechnet sich fast immer", 0),
])

d.bullets("Ein Beispiel", [
    ("$30$ Personen, $18$ mit Brille, davon $8$ Mädchen; insgesamt $14$ Mädchen", 0),
    ("Jungen mit Brille: $18 - 8 = 10$", 0),
    ("Mädchen ohne Brille: $14 - 8 = 6$", 0),
    ("Probe: $8 + 10 + 6 + 6 = 30$ — stimmt", 0),
])

d.bullets("Wahrscheinlichkeiten aus der Tafel ablesen", [
    ("$P(A)$ steht am **Rand**, $P(A \\cap B)$ **innen**", 0),
    ("Aus $P(A \\cap B) = 0{,}2$ und $P(A \\cap \\overline{B}) = 0{,}3$ folgt $P(A) = 0{,}5$", 0),
    ("Denn die Zeile ergibt zusammen den Randwert", 0),
    ("Und immer gilt $P(A) + P(\\overline{A}) = 1$", 0),
])

d.merksatz("Immer von außen nach innen füllen. Die Randsummen sind die Kontrolle, die man geschenkt bekommt.")

d.chapter(2, "Bedingte Wahrscheinlichkeit", "Wenn man schon etwas weiß")

d.bullets("Was der Strich bedeutet", [
    ("$P(B \\mid A)$ heißt: Wahrscheinlichkeit für $B$, **wenn $A$ schon eingetreten ist**", 0),
    ("Man schaut dann nur noch auf die **Zeile von $A$**", 0),
    ("Formel: $P(B \\mid A) = \\dfrac{P(A \\cap B)}{P(A)}$", 0),
    ("Also: gemeinsames Feld geteilt durch den Randwert der Bedingung", 0),
])

d.bullets("Drei Beispiele zum Mitrechnen", [
    ("$40$ von $100$ sportlich, davon $30$ Nichtraucher: "
     "$P = \\dfrac{30}{40} = 0{,}75$", 0),
    ("$120$ Diesel, davon $30$ alt: $P(\\text{alt} \\mid \\text{Diesel}) = "
     "\\dfrac{30}{120} = 0{,}25$", 0),
    ("$60\\,\\%$ Spanisch, $30\\,\\%$ beides: $P = \\dfrac{0{,}3}{0{,}6} = 0{,}5$", 0),
    ("Immer: **Teilmenge durch Bedingung**, nicht durch die Gesamtzahl", 0),
])

d.bullets("Die Richtung darf man nicht vertauschen", [
    ("$P(A \\mid B)$ und $P(B \\mid A)$ haben **verschiedene Nenner**", 0),
    ("Der Zähler ist derselbe, die Bedingung nicht", 0),
    ("Fast alle Fehlschlüsse im Alltag beruhen auf dieser Verwechslung", 0),
    ("Der Satz von der totalen Wahrscheinlichkeit fasst zusammen: "
     "alle Wege in ein Feld addieren sich zum Randwert", 0),
])

d.chapter(3, "Unabhängigkeit und der Testfehler", "Wann hängt etwas wirklich zusammen?")

d.bullets("Der Test auf Unabhängigkeit", [
    ("$A$ und $B$ sind unabhängig, wenn $P(A \\cap B) = P(A) \\cdot P(B)$", 0),
    ("$P(A) = 0{,}5$, $P(B) = 0{,}4$, $P(A \\cap B) = 0{,}2$: "
     "$0{,}5 \\cdot 0{,}4 = 0{,}2$ — **unabhängig**", 0),
    ("Bei $P(A \\cap B) = 0{,}3$ stimmt es nicht — die beiden hängen zusammen", 0),
    ("Sich **ausschließende** Ereignisse sind übrigens **nicht** unabhängig", 0),
])

d.bullets("Der medizinische Test", [
    ("$1\\,\\%$ krank, Test erkennt Kranke zu $99\\,\\%$, $5\\,\\%$ falsch positiv", 0),
    ("Von $10\\,000$ Personen: $100$ krank, davon $99$ positiv", 0),
    ("Von den $9900$ Gesunden sind $495$ **fälschlich** positiv", 0),
    ("$P(\\text{krank} \\mid \\text{positiv}) = \\dfrac{99}{594} \\approx 17\\,\\%$", 0),
])

d.two_cols("Warum das so überrascht", [
    ("Was man hört", 0),
    ("„Der Test ist zu $99\\,\\%$ sicher“", 1),
    ("das ist $P(\\text{positiv} \\mid \\text{krank})$", 1),
], [
    ("Was man wissen will", 0),
    ("„Bin ich krank, wenn positiv?“", 1),
    ("das ist $P(\\text{krank} \\mid \\text{positiv})$", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Tafel füllen, bedingte Wahrscheinlichkeit, "
     "Unabhängigkeit", 0),
    ("Bei jeder Bedingung fragen: **worauf beziehe ich mich?**", 0),
    ("Bei seltenen Krankheiten mit absoluten Zahlen rechnen statt mit Prozenten", 0),
    ("**docalvers.de/mathetest11-vierfeldertafel.html**", 0),
])

d.save()
