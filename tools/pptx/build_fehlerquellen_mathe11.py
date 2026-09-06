#!/usr/bin/env python3
"""Typische Fehlerquellen - Mathe 11 (BGY), KW 20, Auswertung und Uebung."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-fehlerquellen.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 20",
        "Die üblichen Verdächtigen",
        "Auswertung der Klassenarbeit — und die Fehler, die fast alle einmal machen")

d.bullets("Der Fahrplan dieser Woche", [
    ("**Auswertung der Klassenarbeit 3** und individuelles Nacharbeiten", 0),
    ("Drei Blöcke: **Termfehler**, **Gleichungsfehler**, **Fehler beim Deuten**", 0),
    ("Kein neuer Stoff — sondern eine Sammlung der immer gleichen Stolperstellen", 0),
    ("Wer den Fehler **benennen** kann, macht ihn seltener", 0),
])

d.chapter(1, "Termfehler", "Was man nicht auseinanderziehen darf")

d.bullets("Die verlockende Verteilung", [
    ("$(a + b)^2$ ist **nicht** $a^2 + b^2$ — der Mittelterm $2ab$ fehlt", 0),
    ("$\\sqrt{a^2 + b^2}$ ist **nicht** $a + b$ — die Wurzel zerlegt keine Summe", 0),
    ("$\\log(a + b)$ ist **nicht** $\\log a + \\log b$ — das Gesetz gilt fürs **Produkt**", 0),
    ("Muster: Was für ein Produkt gilt, gilt fast nie für eine Summe", 0),
])

d.bullets("Klammern und Vorzeichen", [
    ("$-3(x - 2)$ ist $-3x + 6$, nicht $-3x - 6$", 0),
    ("Das Minus gilt für **beide** Summanden in der Klammer", 0),
    ("$(2x)^3 = 8x^3$ — die äußere Potenz trifft auch die Zahl", 0),
    ("$2^3 \\cdot 2^4 = 2^7$, denn bei gleicher Basis werden Exponenten **addiert**", 0),
])

d.bullets("Kürzen und Wurzeln", [
    ("$\\dfrac{a + b}{a}$ ist **nicht** $b$ — man darf nur **Faktoren** kürzen", 0),
    ("Aus Summen wird nichts gekürzt, nie", 0),
    ("$\\sqrt{x^2} = |x|$, nicht $x$ — für $x = -3$ käme sonst $-3$ statt $3$", 0),
    ("$\\sin(2x)$ ist **nicht** $2\\sin x$ — der Sinus ist keine lineare Funktion", 0),
])

d.merksatz("Fast jeder Termfehler ist derselbe: eine Regel für Produkte wurde auf eine Summe angewendet.")

d.chapter(2, "Gleichungsfehler", "Lösungen verlieren oder erfinden")

d.bullets("Lösungen verlieren", [
    ("$x^2 = 5x$: teilt man durch $x$, geht $x = 0$ verloren", 0),
    ("Richtig ist $x^2 - 5x = 0$, also $x(x - 5) = 0$", 0),
    ("$x^2 = 16$ hat **zwei** Lösungen: $4$ und $-4$", 0),
    ("Bei geradem Exponenten immer beide Vorzeichen prüfen", 0),
])

d.bullets("Lösungen erfinden", [
    ("$\\sqrt{x} = -2$ quadriert ergibt $x = 4$", 0),
    ("Aber $\\sqrt{4} = 2$, nicht $-2$ — die Gleichung hat **keine** Lösung", 0),
    ("Quadrieren ist keine Äquivalenzumformung: die Probe ist Pflicht", 0),
    ("Bei Ungleichungen dreht sich beim Teilen durch Negatives das Zeichen um", 0),
])

d.bullets("Definitionsbereich vergessen", [
    ("$f(x) = \\dfrac{1}{x - 3}$ ist bei $x = 3$ **nicht** definiert", 0),
    ("Bei jedem Bruch, jeder Wurzel und jedem Logarithmus zuerst den Bereich klären", 0),
    ("Der Anstieg ist $\\dfrac{y_2 - y_1}{x_2 - x_1}$ — Höhe durch Breite", 0),
    ("Die verkehrte Reihenfolge ergibt den Kehrwert", 0),
])

d.chapter(3, "Fehler beim Deuten", "Wenn die Rechnung stimmt und die Antwort nicht")

d.bullets("Prozente und Wahrscheinlichkeiten", [
    ("$20\\,\\%$ Rabatt und dann $20\\,\\%$ Aufschlag ergeben **nicht** den alten Preis", 0),
    ("$0{,}8 \\cdot 1{,}2 = 0{,}96$, also $4\\,\\%$ weniger", 0),
    ("$P = 1{,}2$ ist unmöglich — Wahrscheinlichkeiten liegen zwischen $0$ und $1$", 0),
    ("Solche Werte sind ein sicheres Zeichen für einen Rechenfehler", 0),
])

d.bullets("Genauigkeit und Sinn", [
    ("$3{,}47512$ Personen gibt es nicht — hier wird **gerundet und gedeutet**", 0),
    ("Ein Ergebnis kann nicht genauer sein als die Eingangswerte", 0),
    ("Negative Längen und Zeiten vor dem Start werden **begründet verworfen**", 0),
    ("Zur Lösung gehört immer der Antwortsatz mit Einheit", 0),
])

d.two_cols("Wie man solche Fehler findet", [
    ("Schnellproben", 0),
    ("Zahlenbeispiel einsetzen", 1),
    ("Einheiten prüfen", 1),
    ("Größenordnung abschätzen", 1),
    ("Randfälle testen", 1),
], [
    ("In der Arbeit", 0),
    ("Fehler markieren, nicht radieren", 1),
    ("Zwischenschritte stehen lassen", 1),
    ("dafür gibt es Teilpunkte", 1),
    ("Zeit fürs Prüfen einplanen", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — jeweils den Fehler finden und benennen", 0),
    ("Das ist die wirksamste Übung überhaupt: **fremde Fehler erkennen**", 0),
    ("Wer den Fehler benennen kann, macht ihn selbst seltener", 0),
    ("**docalvers.de/mathetest11-fehlerquellen.html**", 0),
])

d.save()
