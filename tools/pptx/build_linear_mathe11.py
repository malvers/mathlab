#!/usr/bin/env python3
"""Wachstum und Zerfall I: lineare Funktionen - Mathe 11 (BGY), KW 41, LB 3.

Folgt den 20 Aufgaben von HTML/mathetest11-linear.html.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-linear.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 41",
        "Lineare Funktionen",
        "Anstieg, Achsenabschnitt und Modelle, die gleichmäßig wachsen oder fallen")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 3 — Stunden **6 bis 10 von 75**", 0),
    ("Erstes Wachstumsmodell: **gleichmäßig**, also linear", 0),
    ("Drei Blöcke: **Anstieg und Achsenabschnitt**, **Modelle im Alltag**, "
     "**erkennen und abgrenzen**", 0),
    ("Alles steckt in zwei Zahlen: $m$ und $n$ in $f(x) = mx + n$", 0),
])

# --------------------------------------------------- Block 1: m und n ------
d.chapter(1, "Anstieg und Achsenabschnitt", "Zwei Zahlen beschreiben die ganze Gerade")

d.bullets("Den Anstieg aus zwei Punkten", [
    ("$m = \\dfrac{y_2 - y_1}{x_2 - x_1}$ — Höhenunterschied durch Schritt nach rechts", 0),
    ("Durch $P(1 \\mid 5)$ und $Q(4 \\mid 14)$: $m = \\dfrac{14 - 5}{4 - 1} = 3$", 0),
    ("Reihenfolge egal, solange **oben und unten dieselbe** ist", 0),
    ("$m = 3$ heißt: einen Schritt nach rechts, drei nach oben", 0),
])

d.bullets("Negativer und gebrochener Anstieg", [
    ("$m = -\\dfrac{1}{2}$: zwei nach rechts, **einen nach unten**", 0),
    ("Negativ heißt fallend, positiv steigend, $m = 0$ waagerecht", 0),
    ("Je größer der Betrag, desto **steiler** die Gerade", 0),
    ("Gleiches $m$ bei verschiedenem $n$: die Geraden sind **parallel**", 0),
])

d.bullets("Der Achsenabschnitt ist der Startwert", [
    ("In $f(x) = mx + n$ ist $n$ der Wert bei $x = 0$", 0),
    ("Im Sachzusammenhang: die **Grundgebühr**, der Anfangsbestand, der Sockelbetrag", 0),
    ("Bei $K(x) = 45x + 80$ sind die $80$ € die **Kosten ohne jede Arbeitsstunde**", 0),
    ("Und $45$ € ist der Stundensatz — der Anstieg", 0),
])

d.bullets("Die Gleichung aus Anstieg und einem Punkt", [
    ("Gegeben $m = -2$ und $P(3 \\mid 1)$", 0),
    ("Ansatz $y = -2x + n$, den Punkt einsetzen: $1 = -6 + n$", 0),
    ("Also $n = 7$ und damit $y = -2x + 7$", 0),
    ("Sonderfall $(1 \\mid 4)$ und $(5 \\mid 4)$: $m = 0$, also $y = 4$ — waagerecht", 0),
])

d.merksatz("Der Anstieg sagt, wie schnell. Der Achsenabschnitt sagt, wo es losging.")

# ------------------------------------------------- Block 2: Anwendungen ----
d.chapter(2, "Lineare Modelle", "Grundgebühr plus Verbrauch — überall dasselbe Muster")

d.bullets("Vom Text zur Funktionsgleichung", [
    ("$5$ € Grundgebühr, $0{,}10$ € je Minute", 0),
    ("Also $K(t) = 5 + 0{,}1\\,t$ — Sockel plus Anstieg mal Menge", 0),
    ("Für $200$ Minuten: $5 + 20 = 25$ €", 0),
    ("Falle: die Grundgebühr **mitzuvergessen** oder sie mit zu multiplizieren", 0),
])

d.bullets("Fallende Modelle und die Nullstelle", [
    ("Wasserstand $80$ cm, täglich $3$ cm weniger: $h(t) = 80 - 3t$", 0),
    ("Nach $10$ Tagen: $80 - 30 = 50$ cm", 0),
    ("Leer heißt $h(t) = 0$, also $3t = 80$ und $t \\approx 26{,}7$ Tage", 0),
    ("Die **Nullstelle** ist hier der Zeitpunkt, an dem das Modell endet", 0),
])

d.bullets("Zwei Tarife vergleichen", [
    ("Tarif A: $5 + 0{,}1\\,t$, Tarif B: $10 + 0{,}05\\,t$", 0),
    ("Gleichsetzen: $5 + 0{,}1t = 10 + 0{,}05t$", 0),
    ("$0{,}05t = 5$, also $t = 100$ Minuten", 0),
    ("**Ab** $100$ Minuten ist B günstiger — der Schnittpunkt ist die Entscheidungsgrenze", 0),
])

d.bullets("Umrechnen ist auch nur eine Gerade", [
    ("Fahrenheit: $F = 1{,}8\\,C + 32$", 0),
    ("$20$ °C ergeben $36 + 32 = 68$ °F", 0),
    ("Umgestellt nach $C$: erst $-32$, dann durch $1{,}8$", 0),
    ("Also $C = \\dfrac{F - 32}{1{,}8}$ — **nicht** $\\dfrac{F}{1{,}8} - 32$", 0),
])

d.bullets("Zwischenwerte schätzen", [
    ("Zwischen $(0 \\mid 10)$ und $(10 \\mid 30)$ linear interpolieren", 0),
    ("Anstieg $m = \\dfrac{30 - 10}{10} = 2$, Startwert $10$", 0),
    ("Bei $x = 4$ also $10 + 8 = 18$", 0),
    ("Linear interpolieren heißt: **unterstellen**, dass es gleichmäßig läuft", 0),
])

d.merksatz("Jede Grundgebühr plus Verbrauch ist eine Gerade — und jeder Tarifvergleich ein Schnittpunkt.")

# --------------------------------------------------- Block 3: erkennen -----
d.chapter(3, "Erkennen und abgrenzen", "Ist das überhaupt linear?")

d.bullets("Lineares Wachstum in der Tabelle", [
    ("Bei **gleichen Schritten** in $x$ kommt immer **dieselbe Differenz** dazu", 0),
    ("$2, 5, 8, 11$ — jedes Mal $+3$, also linear mit $m = 3$", 0),
    ("$2, 4, 8, 16$ — jedes Mal **mal $2$**, das ist exponentiell", 0),
    ("Prüfgriff: erst Differenzen bilden, dann Quotienten", 0),
])

d.two_cols("Linear oder exponentiell?", [
    ("Linear", 0),
    ("immer **derselbe Betrag** dazu", 1),
    ("$f(x) = mx + n$", 1),
    ("Gerade", 1),
    ("$3$ € Trinkgeld pro Tisch", 1),
], [
    ("Exponentiell", 0),
    ("immer **derselbe Faktor** mal", 1),
    ("$f(x) = a \\cdot b^x$", 1),
    ("Kurve, die immer steiler wird", 1),
    ("$3\\,\\%$ Zinsen pro Jahr", 1),
])

d.bullets("Punktprobe und der Sonderfall Senkrechte", [
    ("Liegt $(5 \\mid 20)$ auf $f(x) = 4x$? Einsetzen: $4 \\cdot 5 = 20$ — **ja**", 0),
    ("Die Punktprobe ist immer nur **einsetzen und vergleichen**", 0),
    ("$x = 3$ ist eine senkrechte Gerade und **keine Funktion**", 0),
    ("An der Stelle $3$ lägen unendlich viele $y$-Werte — die Eindeutigkeit fehlt", 0),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Anstieg, Achsenabschnitt, lineare Modelle", 0),
    ("Bei Sachaufgaben zuerst fragen: **was ist der Sockel, was der Anstieg?**", 0),
    ("Nächste Stufe ist das exponentielle Wachstum — die Abgrenzung braucht ihr dort wieder", 0),
    ("**docalvers.de/mathetest11-linear.html**", 0),
])

d.save()
