#!/usr/bin/env python3
"""Uebung Stochastik - Mathe 11 (BGY), KW 18."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-stochastik-uebung.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 18",
        "Übung Stochastik",
        "Alles aus Lernbereich 1 gemischt — Pfade, Tafeln, Erwartungswert")

d.bullets("Der Fahrplan dieser Woche", [
    ("**Übungswoche** — vermischte Aufgaben aus dem ganzen Lernbereich 1", 0),
    ("Drei Blöcke: **Grundwahrscheinlichkeiten**, **mehrstufige Versuche**, "
     "**Erwartungswert und Fairness**", 0),
    ("Kein neuer Stoff — dafür die Frage, **welches Werkzeug** wann passt", 0),
    ("Am Ende **20 gemischte Aufgaben**", 0),
])

d.chapter(1, "Grundwahrscheinlichkeiten", "Zählen, was günstig ist")

d.bullets("Der einfache Fall", [
    ("Bei gleich wahrscheinlichen Ausgängen: **günstige durch mögliche**", 0),
    ("Gerade Augenzahl beim Würfel: $\\dfrac{3}{6} = \\dfrac{1}{2}$", 0),
    ("Glücksrad mit $3$ roten von $8$ Feldern: $\\dfrac{3}{8}$", 0),
    ("Herz aus $32$ Skatkarten: $\\dfrac{8}{32} = \\dfrac{1}{4}$", 0),
])

d.bullets("Gegenereignis und Grenzen", [
    ("$P(\\overline{A}) = 1 - P(A)$, also bei $P(A) = 0{,}35$ genau $0{,}65$", 0),
    ("Jede Wahrscheinlichkeit liegt zwischen **$0$ und $1$**", 0),
    ("Werte über $1$ oder negative Werte sind immer ein Rechenfehler", 0),
    ("Relative Häufigkeit: $\\dfrac{154}{200} = 0{,}77$ — beobachtet, nicht theoretisch", 0),
])

d.bullets("Wie viele Ausgänge gibt es überhaupt?", [
    ("Vier Münzwürfe: $2^4 = 16$ mögliche Folgen", 0),
    ("Ein Baum mit drei Stufen und je zwei Ästen hat $8$ Pfade", 0),
    ("Zwei Würfel: $36$ Paare, davon $6$ mit Augensumme $7$", 0),
    ("Augensumme $12$ gibt es nur einmal: $\\dfrac{1}{36}$", 0),
])

d.chapter(2, "Mehrstufige Versuche", "Pfade, Tafeln, Bedingungen")

d.bullets("Pfadregeln anwenden", [
    ("Genau zweimal Kopf bei vier Würfen: $6$ günstige von $16$, also $\\dfrac{3}{8}$", 0),
    ("Zwei rote aus $5$ roten und $5$ blauen ohne Zurücklegen: "
     "$\\dfrac{5}{10} \\cdot \\dfrac{4}{9} = \\dfrac{2}{9}$", 0),
    ("Zwei Herz aus dem Skatblatt: $\\dfrac{8}{32} \\cdot \\dfrac{7}{31}$", 0),
    ("Ohne Zurücklegen ändert sich **immer** die zweite Stufe", 0),
])

d.bullets("Unabhängigkeit und Bedingung", [
    ("Unabhängig heißt $P(A \\cap B) = P(A) \\cdot P(B)$", 0),
    ("Bei $P(A) = 0{,}4$ und $P(B) = 0{,}5$ also $0{,}2$", 0),
    ("$200$ von $500$ jung, davon $50$ mit Abo: $P = \\dfrac{50}{200} = 0{,}25$", 0),
    ("Bei jeder Bedingung: **Teilmenge durch Bedingung**", 0),
])

d.bullets("Das Gegenereignis bei „mindestens“", [
    ("Mindestens eine Sechs bei vier Würfen", 0),
    ("Gegenteil: **keine** Sechs, also $\\left(\\dfrac{5}{6}\\right)^4$", 0),
    ("$P = 1 - \\dfrac{625}{1296} \\approx 0{,}52$", 0),
    ("Direkt zu rechnen hieße vier Fälle einzeln — der Umweg ist kürzer", 0),
])

d.merksatz("Bei „mindestens“ immer zuerst das Gegenereignis ansehen. Es ist fast immer der kürzere Weg.")

d.chapter(3, "Erwartungswert", "Lohnt sich das Spiel?")

d.bullets("Wie man ihn bildet", [
    ("Jeden möglichen Gewinn mit seiner Wahrscheinlichkeit **multiplizieren**", 0),
    ("Alle Produkte **addieren** — das ist der Erwartungswert", 0),
    ("Er ist der langfristige Durchschnitt, nicht der Wert eines Spiels", 0),
    ("**Fair** heißt: der Erwartungswert des Gewinns ist **null**", 0),
])

d.bullets("Ein Beispiel", [
    ("Einsatz $2$ €, mit $P = 0{,}25$ werden $6$ € ausgezahlt", 0),
    ("Erwarteter Ertrag: $0{,}25 \\cdot 6 = 1{,}50$ €", 0),
    ("Abzüglich Einsatz: $1{,}50 - 2 = -0{,}50$ €", 0),
    ("Also **nicht fair** — im Schnitt verliert man $50$ Cent je Spiel", 0),
])

d.two_cols("Welches Werkzeug wann?", [
    ("Baumdiagramm", 0),
    ("mehrere Stufen nacheinander", 1),
    ("mit oder ohne Zurücklegen", 1),
    ("Pfade zählen und addieren", 1),
], [
    ("Vierfeldertafel", 0),
    ("zwei Merkmale gleichzeitig", 1),
    ("bedingte Wahrscheinlichkeit", 1),
    ("Unabhängigkeit prüfen", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 gemischte Aufgaben** im Mathe-Labor", 0),
    ("Bei jeder zuerst fragen: **Baum, Tafel oder einfaches Abzählen?**", 0),
    ("Und bei starken Abweichungen in kleinen Stichproben: das ist **normal**", 0),
    ("**docalvers.de/mathetest11-stochastik-uebung.html**", 0),
])

d.save()
