#!/usr/bin/env python3
"""Komplexe Anwendungsaufgaben Funktionen - Mathe 11 (BGY), KW 9, Abschluss LB 3."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-modellieren.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 9",
        "Modellieren",
        "Vom Sachtext zum Term und wieder zurück — Abschluss von Lernbereich 3")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 3 — Stunden **71 bis 75 von 75**, damit ist **LB 3 fertig**", 0),
    ("Drei Blöcke: **der Modellierungskreislauf**, **Typ wählen**, **Ergebnisse beurteilen**", 0),
    ("Aufgaben aus dem Alltag und aus der Mathematik selbst", 0),
    ("Am Ende ein **Selbstcheck** über den ganzen Lernbereich", 0),
])

d.chapter(1, "Der Kreislauf", "Modellieren ist keine Rechnung, sondern ein Weg")

d.bullets("Die vier Schritte", [
    ("**Vereinfachen**: welche Größen zählen, welche lasse ich weg?", 0),
    ("**Übersetzen**: den Term aufstellen", 0),
    ("**Rechnen**: das mathematische Problem lösen", 0),
    ("**Zurückdeuten**: passt das Ergebnis zur Wirklichkeit?", 0),
])

d.bullets("Der erste Schritt entscheidet", [
    ("Zuerst **benennen, was $x$ ist** — und in welcher Einheit", 0),
    ("Erst danach lohnt sich der Blick auf den Funktionstyp", 0),
    ("Fast jeder Fehler in Modellaufgaben passiert **vor** der ersten Rechnung", 0),
    ("Am Ende führt der Weg zurück in den Sachzusammenhang, nicht zur nackten Zahl", 0),
])

d.merksatz("Modellieren endet nicht beim Ergebnis, sondern bei der Antwort auf die gestellte Frage.")

d.chapter(2, "Den Typ wählen", "Welche Funktion passt zu welcher Situation?")

d.bullets("Linear: Sockel plus Rate", [
    ("Taxi mit $3{,}50$ € Grundpreis und $2{,}20$ € je Kilometer", 0),
    ("$K(x) = 3{,}5 + 2{,}2\\,x$", 0),
    ("Für $12$ km also $3{,}5 + 26{,}4 = 29{,}90$ €", 0),
    ("Ein Behälter mit **konstantem Zufluss** und gerader Wand: Füllhöhe linear", 0),
])

d.bullets("Exponentiell: fester Prozentsatz", [
    ("$12\\,000$ Fische, jährlich $6\\,\\%$ mehr: $N(t) = 12000 \\cdot 1{,}06^t$", 0),
    ("Kühlvorgang $T(t) = 20 + 60 \\cdot 0{,}9^t$", 0),
    ("Die $20$ ist die **Raumtemperatur**, der Sockel, dem sich alles nähert", 0),
    ("Bei $t = 0$ sind es $20 + 60 = 80$ Grad — die **Anfangstemperatur**", 0),
])

d.bullets("Quadratisch: wenn es ein Optimum gibt", [
    ("$G(x) = -0{,}5x^2 + 40x - 300$ soll maximal werden", 0),
    ("Scheitel bei $x = \\dfrac{40}{2 \\cdot 0{,}5} = 40$ Stück", 0),
    ("Nach unten geöffnet, also ist der Scheitel das **Maximum**", 0),
    ("Bei Ticketpreisen plausibel: höherer Preis, weniger Käufer — der Erlös hat ein Optimum", 0),
])

d.bullets("Wenn kein Standardtyp passt", [
    ("Handytarif: $10$ € für $5$ GB, danach $2$ € je angefangenem GB", 0),
    ("Das ist **abschnittsweise** definiert und **springt** an den Grenzen", 0),
    ("Ein Trichter, der nach oben breiter wird: der Höhenzuwachs wird **kleiner**", 0),
    ("Nicht jede Situation lässt sich mit einer einzigen Formel beschreiben", 0),
])

d.chapter(3, "Ergebnisse beurteilen", "Der Teil, den man nicht überspringen darf")

d.bullets("Wenn die Zahl nicht zur Sache passt", [
    ("$x = 23{,}7$ Personen — auf **$24$ aufrunden**, denn es müssen alle Platz haben", 0),
    ("$t = -3{,}2$ Stunden liegt **vor dem Start** und wird verworfen", 0),
    ("Beides mit **Begründung**, nicht stillschweigend", 0),
    ("Die Einheit gehört immer dazu: Wasserstand in cm über Zeit in h ergibt cm/h", 0),
])

d.bullets("Wenn Modelle auseinanderlaufen", [
    ("Zwei Modelle sagen für $2050$ sehr verschiedene Werte voraus", 0),
    ("Das heißt nicht, dass eines falsch rechnet", 0),
    ("Es zeigt, wie **unsicher** eine Vorhersage so weit außerhalb der Daten ist", 0),
    ("Ein Modell, das alte Werte exakt trifft und neue verfehlt, ist **überangepasst**", 0),
])

d.two_cols("Was in jede vollständige Lösung gehört", [
    ("Am Anfang", 0),
    ("Größen benennen mit Einheit", 1),
    ("Annahmen offenlegen", 1),
    ("Ansatz begründen", 1),
], [
    ("Am Ende", 0),
    ("Ergebnis prüfen", 1),
    ("Gültigkeitsbereich nennen", 1),
    ("Antwortsatz im Sachkontext", 1),
])

d.bullets("Linear oder exponentiell?", [
    ("Linear, wenn eine **feste Menge** je Schritt dazukommt", 0),
    ("Exponentiell, wenn ein **fester Prozentsatz** dazukommt", 0),
    ("Über kurze Zeiträume sind beide oft kaum zu unterscheiden", 0),
    ("Über lange Zeiträume liegen Welten dazwischen — dort entscheidet die Wahl alles", 0),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — gemischte Modellierungsaufgaben", 0),
    ("Zugleich der **Selbstcheck** für Lernbereich 3", 0),
    ("Bei jeder Aufgabe den ganzen Kreislauf gehen, nicht nur rechnen", 0),
    ("**docalvers.de/mathetest11-modellieren.html**", 0),
])

d.save()
