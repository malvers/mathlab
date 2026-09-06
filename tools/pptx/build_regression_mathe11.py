#!/usr/bin/env python3
"""Regression mit digitalen Hilfsmitteln - Mathe 11 (BGY), KW 52, LB 3."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-regression.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 52",
        "Regression",
        "Aus Messwerten ein Modell machen — und wissen, wie weit man ihm trauen darf")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 3 — Stunden **41 bis 45 von 75**", 0),
    ("Drei Blöcke: **Modell wählen**, **wie der Rechner rechnet**, **Modellkritik**", 0),
    ("Bezug zum zweiten Leistungskursfach: dort fallen die Messreihen an", 0),
    ("Der wichtigste Teil ist der letzte — **Kritik gehört zur Auswertung**", 0),
])

d.chapter(1, "Das passende Modell", "Erst zeichnen, dann rechnen")

d.bullets("Was eine Regression überhaupt tut", [
    ("Sie legt die **bestpassende Funktion** durch eine Punktwolke", 0),
    ("Nicht durch **alle** Punkte — das wäre Interpolation", 0),
    ("Messwerte streuen immer; das Modell soll den **Trend** treffen", 0),
    ("Erste Handlung deshalb immer: **Daten zeichnen** und hinsehen", 0),
])

d.bullets("Woran man den Typ erkennt", [
    ("Annähernd konstante **Differenz** je Schritt: lineares Modell", 0),
    ("$(1 \\mid 2)$, $(2 \\mid 4)$, $(3 \\mid 6)$, $(4 \\mid 8)$ passt exakt zu $y = 2x$", 0),
    ("Annähernd konstanter **Quotient**: exponentielles Modell", 0),
    ("$(0 \\mid 5)$, $(1 \\mid 10)$, $(2 \\mid 20)$, $(3 \\mid 40)$ passt zu $y = 5 \\cdot 2^x$", 0),
])

d.bullets("Wenn keiner der Standardtypen passt", [
    ("Eine Abkühlung nähert sich der **Raumtemperatur** an, nicht der Null", 0),
    ("Reines exponentielles Modell trifft das nicht — es braucht einen Sockel", 0),
    ("Ansatz $T(t) = T_{\\text{Raum}} + a \\cdot q^t$", 0),
    ("Modellwahl heißt: **die Physik der Sache** mitdenken", 0),
])

d.merksatz("Ein Modell, das man nicht vorher gezeichnet hat, ist geraten — auch wenn der Rechner es ausgibt.")

d.chapter(2, "Wie der Rechner rechnet", "Die Methode der kleinsten Quadrate")

d.bullets("Was minimiert wird", [
    ("Für jeden Messpunkt der **senkrechte Abstand** zur Kurve", 0),
    ("Diese Abweichungen werden **quadriert** und aufsummiert", 0),
    ("Die Kurve mit der kleinsten Summe gewinnt", 0),
    ("Deshalb der Name: Methode der kleinsten Quadrate", 0),
])

d.bullets("Warum quadriert wird", [
    ("Ohne Quadrieren würden sich **plus und minus aufheben**", 0),
    ("Eine völlig falsche Gerade käme dann rechnerisch gut weg", 0),
    ("Quadrieren macht alle Abweichungen positiv", 0),
    ("Nebeneffekt: **große** Abweichungen wiegen besonders schwer", 0),
])

d.bullets("Das Bestimmtheitsmaß", [
    ("$R^2$ liegt zwischen $0$ und $1$ und misst, wie gut die Kurve passt", 0),
    ("$R^2 = 0{,}99$ heißt: das Modell erklärt die Streuung **fast vollständig**", 0),
    ("Es sagt **nichts** über Ursache und Wirkung", 0),
    ("Zwei Größen können perfekt zusammenpassen und trotzdem nichts miteinander zu tun haben", 0),
])

d.bullets("Wenn die Punkte genau aufgehen", [
    ("Eine quadratische Regression mit **drei** Messpunkten legt die Parabel exakt hindurch", 0),
    ("$R^2 = 1$ ist dann kein Gütesiegel, sondern eine Selbstverständlichkeit", 0),
    ("Drei Punkte bestimmen eine Parabel eindeutig — es bleibt kein Spielraum", 0),
    ("Aussagekraft entsteht erst, wenn es **mehr Punkte als Parameter** gibt", 0),
])

d.chapter(3, "Modellkritik", "Der Teil, der die Note macht")

d.bullets("Extrapolation ist die gefährlichste Rechnung", [
    ("**Interpolation**: ein Wert zwischen den Messpunkten — meist unkritisch", 0),
    ("**Extrapolation**: über den Messbereich hinaus — immer mit Vorsicht", 0),
    ("Ein exponentielles Bevölkerungsmodell liefert für das Jahr $3000$ eine Billion Menschen", 0),
    ("Das zeigt nicht die Zukunft, sondern die **Grenze des Modells**", 0),
])

d.bullets("Ausreißer und Größenordnungen", [
    ("Ein **Ausreißer** weicht deutlich vom Trend ab — Messfehler oder echte Besonderheit?", 0),
    ("Nicht kommentarlos löschen, sondern **prüfen und begründen**", 0),
    ("$y = 0{,}0000031x + 2$: der Anstieg ist praktisch null", 0),
    ("Hier lohnt die Frage, ob es überhaupt einen Zusammenhang gibt", 0),
])

d.two_cols("Wenn zwei Modelle ähnlich gut passen", [
    ("Dafür spricht das einfachere", 0),
    ("weniger Parameter", 1),
    ("leichter zu deuten", 1),
    ("robuster außerhalb der Daten", 1),
], [
    ("Dagegen spricht", 0),
    ("Fachlich unpassende Form", 1),
    ("Parameter ohne Bedeutung", 1),
    ("Anpassung an das Rauschen", 1),
])

d.bullets("Was zu einer ehrlichen Auswertung gehört", [
    ("Das Modell **benennen** und die Wahl begründen", 0),
    ("Parameter mit **Einheit** angeben — $2{,}1$ ist die Änderung je Einheit von $x$", 0),
    ("Den **Gültigkeitsbereich** nennen", 0),
    ("Schwächen offenlegen statt verschweigen", 0),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Modellwahl, $R^2$, Extrapolation, Kritik", 0),
    ("Bei jeder Aufgabe fragen: **würde ich diesem Modell trauen?**", 0),
    ("Die Regressionsfunktionen eures Rechners einmal in Ruhe durchprobieren", 0),
    ("**docalvers.de/mathetest11-regression.html**", 0),
])

d.save()
