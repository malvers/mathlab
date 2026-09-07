#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 26 / KW 9: Strategien zur Problemloesung -
Loesungsentwurf I (LB 2, Ustd. 4/12)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("loesungsentwurf-1.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — Klasse 9", "Ein großes Problem gibt es nicht",
        "Zerlegen, skizzieren, und erst dann an den Rechner")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Zerlegen", "Die wichtigste Strategie der Informatik")

d.bullets("Warum man zerlegt", [
    ("„Ein Spiel programmieren“ ist zu groß — daran fängt niemand an", 0),
    ("„Die Figur soll sich mit den Pfeiltasten bewegen“ ist ein **Teilproblem**", 0),
    ("Ein Teilproblem ist klein genug, dass **eine Person es in einer Stunde** löst", 0),
    ("Und man merkt sofort, ob es funktioniert", 0),
    ("Der Fachbegriff heißt **Dekomposition** — Zerlegen in Teilprobleme", 0),
])

dia = pap(P("pap-zerlegen-info9.png"), 1560, 470, {
    "g": dict(pos=(780, 90), w=460, h=110, text="Fangspiel programmieren"),
    "a": dict(pos=(250, 300), w=340, h=140, text="Figur steuern (Pfeiltasten)"),
    "b": dict(pos=(780, 300), w=340, h=140, text="Gegenstände fallen lassen"),
    "c": dict(pos=(1310, 300), w=340, h=140, text="Punkte zählen und anzeigen"),
}, [
    ("g", "a", ""), ("g", "b", ""), ("g", "c", ""),
], size=29)
d.picture("Aus einem großen Problem werden drei kleine", dia, [
    ("Jedes Teilproblem bekommt **einen Namen** und **eine zuständige Person**", 0),
    ("Ist ein Teil immer noch zu groß, wird er **noch einmal** zerlegt", 0),
], width=700)

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Das Storyboard", "Der Ablauf als Bilderfolge")

d.table_top("Ein Storyboard für das Fangspiel", [
    ["Bild", "Was man sieht", "Was passiert"],
    ["1", "Startbildschirm mit Titel", "Klick auf die Flagge startet"],
    ["2", "Figur unten, Himmel oben", "Gegenstände fallen"],
    ["3", "Figur fängt einen Gegenstand", "Punktzahl steigt um 1"],
    ["4", "Gegenstand fällt daneben", "Leben um 1 weniger"],
    ["5", "Bildschirm „Game over“", "Punktzahl wird angezeigt"],
], [90, 350, 376], [
    ("Ein Storyboard zeigt den **Ablauf aus Sicht des Nutzers** — nicht den Programmcode", 0),
    ("Wer es zeichnen kann, hat das Produkt verstanden. Wer nicht, muss noch nachdenken", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Für Robotik und Simulation geht das genauso", [
    ("**Robotik**: welcher Sensorwert löst welche Bewegung aus? Eine Skizze je Situation", 0),
    ("**Simulation**: welcher Zustand folgt auf welchen? Eine Skizze je Schritt", 0),
    ("**Grafik**: wie sieht das Bild nach jedem Schritt aus?", 0),
    ("In allen Fällen gilt: **erst zeichnen, dann bauen**", 0),
    ("Das Blatt kostet fünf Minuten und spart zwei Stunden", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Die Reihenfolge", "Was zuerst gebaut wird")

d.table_top("Womit anfangen?", [
    ["Reihenfolge", "warum"],
    ["1. Das Herzstück", "ohne das gibt es kein Produkt — Steuerung, Bewegung"],
    ["2. Die Rückmeldung", "damit man sieht, ob es funktioniert — Punkte, Anzeige"],
    ["3. Der Abschluss", "Ende, Gewinnen, Verlieren"],
    ["4. Die Verschönerung", "Musik, Farben, Startbildschirm"],
], [200, 616], [
    ("Verschönern kommt **zuletzt** — es fühlt sich gut an und bringt am wenigsten", 0),
    ("Nach Schritt 3 habt ihr ein **fertiges** Produkt. Alles danach ist Zugabe", 0),
], font_size=11.5, bold_cols=(0,), marks={(4, 0): TINT_ORANGE})

d.merksatz("Zerlegen, bis jedes Stück in eine Stunde passt. "
           "Was man nicht zeichnen kann, kann man auch nicht programmieren.")

d.bullets("Fun Facts: Zerlegen", [
    ("**Teile und herrsche** ist über 2000 Jahre alt — als Strategie, nicht als Programmiertipp", 0),
    ("In der Informatik heißt sie **divide and conquer** und steckt in vielen Algorithmen", 0),
    ("Ein Storyboard kommt aus dem **Film** — Disney nutzte es schon in den 1930er Jahren", 0),
    ("Profis zeichnen es heute noch auf Papier, weil es dort **schneller** geht als am Rechner", 0),
    ("Die Frage „**Was ist das kleinste Stück, das ich testen kann?**“ ist die halbe Miete", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("Zerlegt euer Projekt in **drei bis fünf** Teilprobleme", 0),
    ("Prüft jedes: passt es in **eine Stunde** Arbeit? Wenn nicht: weiter zerlegen", 0),
    ("Zeichnet ein **Storyboard** mit mindestens fünf Bildern", 0),
    ("Legt die **Reihenfolge** fest: was baut ihr zuerst, was zuletzt?", 0),
    ("Bringt Skizze und Liste nächste Woche mit — dann werden Aufgaben verteilt", 0),
])

d.save()
