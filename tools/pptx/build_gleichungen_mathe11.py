#!/usr/bin/env python3
"""Gleichungen ohne Hilfsmittel - Mathe 11 (BGY), Woche 4 / KW 37, LB 2.

Erklaert genau den Stoff, den die 20 Aufgaben von HTML/mathetest11-gleichungen.html
abfragen - Block fuer Block, Schritt fuer Schritt. Stil nach dem Webstuhl-Deck:
Stichpunkte, fette Begriffe; Formeln als echte PowerPoint-Formeln (omml.py).
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-w4-gleichungen.pptx")

# 1 - Titel
d.title("Mathematik · Berufliches Gymnasium 11 · Woche 4",
        "Gleichungen ohne Hilfsmittel",
        "Lineare Gleichungen, Formeln umstellen, Klammern und Potenzen — Kopf, Papier, Stift")

# 2 - Fahrplan
d.bullets("Der Fahrplan dieser Woche", [
    ("**5 Stunden**, Lernbereich 2 — Stunden **1 bis 5 von 20**", 0),
    ("**Ohne Hilfsmittel**: kein CAS, kein GTR, kein Taschenrechner", 0),
    ("Drei Blöcke: **lineare Gleichungen**, **Formeln umstellen**, **Klammern und Potenzen**", 0),
    ("Zum Schluss **20 Aufgaben** zur Selbstkontrolle im Mathe-Labor", 0),
])

# ------------------------------------------------------- Block 1: linear ----
d.chapter(1, "Lineare Gleichungen", "Das Waage-Prinzip und was daraus folgt")

d.bullets("Was heißt hier eigentlich lösen?", [
    ("Gleichung = **zwei Terme**, verbunden durch ein Gleichheitszeichen", 0),
    ("Lösen = alle $x$ finden, für die die Aussage **wahr** wird", 0),
    ("Werkzeug: **Äquivalenzumformung** — sie ändert die Lösungsmenge nicht", 0),
    ("Bild dazu: eine **Waage** — was links passiert, muss rechts passieren", 0),
])

d.bullets("Erlaubt — und wo es kippt", [
    ("$+a$ und $-a$ auf **beiden** Seiten: immer erlaubt", 0),
    ("Mal $c$ und geteilt durch $c$ nur, wenn $c \\neq 0$ ist", 0),
    ("Die beiden **Seiten vertauschen**: immer erlaubt", 0),
    ("Falle: durch einen **Term** teilen, der null sein kann — aus $x^2 = x$ wird sonst "
     "nur $x = 1$, die Lösung $x = 0$ ist weg", 0),
])

d.merksatz("Geteilt wird nur durch etwas, das sicher nicht null ist.")

d.bullets("Schritt für Schritt: die Grundform", [
    ("Aufgabe: $7x - 4 = 3x + 12$", 0),
    ("**1. Sortieren** — $x$ nach links, Zahlen nach rechts: $-3x$ ergibt $4x - 4 = 12$", 0),
    ("**2. Isolieren** — $+4$ auf beiden Seiten: $4x = 16$", 0),
    ("**3. Normieren** — durch $4$ teilen: $x = 4$", 0),
    ("**4. Probe** — $7 \\cdot 4 - 4 = 24$ und $3 \\cdot 4 + 12 = 24$", 0),
])

d.bullets("Klammern kommen zuerst weg", [
    ("$5(x - 3) = 2x + 9$ ausmultiplizieren: $5x - 15 = 2x + 9$", 0),
    ("$-2x$, dann $+15$: $3x = 24$, also $x = 8$", 0),
    ("Das Minus gilt für **beide** Summanden: $-4(x - 2) = -4x + 8$", 0),
    ("Damit wird $3(2x + 1) - 4(x - 2) = 15$ zu $2x + 11 = 15$, also $x = 2$", 0),
])

d.bullets("Brüche wegräumen", [
    ("$\\dfrac{x}{3} + 2 = 7$: **erst** $-2$, **dann** mal $3$ — also $x = 15$", 0),
    ("Falle: sofort mal $3$ und die $2$ vergessen — dann käme $21$ heraus", 0),
    ("Der Bruchstrich **klammert**: aus $\\dfrac{2x - 1}{4} = 3$ wird $2x - 1 = 12$, "
     "also $x = 6{,}5$", 0),
    ("Zwei Brüche, Hauptnenner $10$: $\\dfrac{x}{2} - \\dfrac{x}{5} = \\dfrac{3x}{10} = 3$, "
     "also $x = 10$", 0),
])

d.two_cols("Wenn das x sich wegkürzt", [
    ("Unendlich viele Lösungen", 0),
    ("$2(x + 3) = 2x + 6$", 1),
    ("wird zu $2x + 6 = 2x + 6$", 1),
    ("**wahre** Aussage, ohne $x$", 1),
    ("Lösung: **jede** reelle Zahl", 1),
], [
    ("Keine Lösung", 0),
    ("$4x + 5 = 4x - 3$", 1),
    ("wird zu $5 = -3$", 1),
    ("**falsche** Aussage, ohne $x$", 1),
    ("Die Lösungsmenge ist **leer**", 1),
])

d.bullets("Vom Text zur Gleichung", [
    ("Aufgabe: verdreifacht man eine Zahl und addiert $7$, so erhält man $25$", 0),
    ("**Unbekannte benennen**: $x$ ist die gesuchte Zahl", 0),
    ("**Übersetzen**: verdreifachen wird $3x$, addieren wird $+7$, ergibt wird $= 25$", 0),
    ("**Lösen und antworten**: $3x = 18$, also $x = 6$ — die Zahl ist $6$", 0),
])

# ------------------------------------------------------- Block 2: Formeln ---
d.chapter(2, "Formeln umstellen", "Dieselben Regeln — nur mit Buchstaben statt Zahlen")

d.bullets("Das Rezept in vier Schritten", [
    ("**Ziel markieren**: welcher Buchstabe soll allein stehen?", 0),
    ("**Von außen nach innen** abbauen: erst Summanden, dann Faktoren, dann Potenzen", 0),
    ("Jeder Schritt gilt auf **beiden** Seiten — genau wie bei Zahlen", 0),
    ("**Kontrolle**: Einheiten prüfen und ein Zahlenbeispiel einsetzen", 0),
])

d.bullets("Weg-Zeit-Gesetz nach der Zeit", [
    ("Gegeben $s = \\dfrac{a}{2}\\,t^2$, gesucht $t$, dabei $a > 0$ und $t > 0$", 0),
    ("Mal $2$ — der Bruch verschwindet: $2s = a\\,t^2$", 0),
    ("Durch $a$ — der Faktor verschwindet: $t^2 = \\dfrac{2s}{a}$", 0),
    ("Wurzel ziehen: $t = \\sqrt{\\dfrac{2s}{a}}$ — nur die **positive** Wurzel ist eine Zeit", 0),
])

d.bullets("Zwei Klassiker in einem Schritt", [
    ("Kreisumfang $U = 2\\pi r$: $r$ steht im **Produkt**, also durch $2\\pi$ teilen — "
     "$r = \\dfrac{U}{2\\pi}$", 0),
    ("Pyramide $V = \\dfrac{1}{3}\\,G\\,h$: mal $3$, dann durch $G$ — $h = \\dfrac{3V}{G}$", 0),
    ("Merkregel: **Faktor** weg heißt teilen, **Summand** weg heißt subtrahieren", 0),
    ("Plausibilität: doppelte Höhe bei gleicher Grundfläche, doppeltes Volumen", 0),
])

d.bullets("Trapez: erst der Bruch, dann die Summe", [
    ("Gegeben $A = \\dfrac{a + c}{2} \\cdot h$, gesucht $c$", 0),
    ("Mal $2$: $2A = (a + c)\\,h$", 0),
    ("Durch $h$: $\\dfrac{2A}{h} = a + c$", 0),
    ("Minus $a$: $c = \\dfrac{2A}{h} - a$ — und **nicht** $\\dfrac{2A - a}{h}$", 0),
])

d.bullets("Linsengleichung: stürzen kommt zuletzt", [
    ("Gegeben $\\dfrac{1}{f} = \\dfrac{1}{g} + \\dfrac{1}{b}$, gesucht $b$", 0),
    ("Erst $\\dfrac{1}{b}$ freistellen: $\\dfrac{1}{b} = \\dfrac{1}{f} - \\dfrac{1}{g}$", 0),
    ("Rechts auf den Hauptnenner $fg$: $\\dfrac{1}{b} = \\dfrac{g - f}{fg}$", 0),
    ("Jetzt **stürzen**: $b = \\dfrac{fg}{g - f}$", 0),
])

d.merksatz("Der Kehrwert einer Summe ist nicht die Summe der Kehrwerte — "
           "erst zusammenfassen, dann stürzen.")

# ------------------------------------------- Block 3: Klammern & Potenzen ---
d.chapter(3, "Klammern und Potenzen", "Termumformungen, die sitzen müssen")

d.bullets("Die drei binomischen Formeln", [
    ("$(a + b)^2 = a^2 + 2ab + b^2$", 0),
    ("$(a - b)^2 = a^2 - 2ab + b^2$", 0),
    ("$(a + b)(a - b) = a^2 - b^2$", 0),
    ("Mit $a = 3x$ und $b = 4$: $(3x - 4)^2 = 9x^2 - 24x + 16$ — der **Mittelterm** fehlt nie", 0),
])

d.bullets("Ausmultiplizieren und zusammenfassen", [
    ("Aufgabe: $2a(3a - 5) - 3(a^2 - 2a)$", 0),
    ("Erste Klammer: $2a \\cdot 3a - 2a \\cdot 5 = 6a^2 - 10a$", 0),
    ("Zweite Klammer **mit dem Minus davor**: $-3a^2 + 6a$", 0),
    ("Gleichartiges sammeln: $3a^2 - 4a$", 0),
])

d.bullets("Potenzgesetze — vier Zeilen, die alles tragen", [
    ("Gleiche Basis mal: Exponenten **addieren** — $x^5 \\cdot x^3 = x^8$", 0),
    ("Gleiche Basis geteilt: Exponenten **subtrahieren** — $\\dfrac{x^8}{x^4} = x^4$", 0),
    ("Potenz einer Potenz: Exponenten **multiplizieren** — $(2x^3)^4 = 2^4 x^{12} = 16x^{12}$", 0),
    ("Negativer Exponent heißt **Kehrwert**, nicht Minus — $3x^{-2} = \\dfrac{3}{x^2}$", 0),
])

d.two_cols("Die sechs Fallen dieser Woche", [
    ("Beim Rechnen", 0),
    ("mal $3$ genommen, den Summanden vergessen", 1),
    ("$-4(x - 2)$ zu $-4x - 8$ gemacht", 1),
    ("durch einen Term geteilt, der null sein kann", 1),
], [
    ("Beim Umstellen", 0),
    ("$\\dfrac{2A}{h} - a$ mit $\\dfrac{2A - a}{h}$ verwechselt", 1),
    ("Kehrwerte einzeln gebildet statt erst zusammengefasst", 1),
    ("bei $(2x^3)^4$ die $2$ nicht mitpotenziert", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — genau diese drei Blöcke", 0),
    ("Jede Aufgabe hat einen **Lösungsweg** zum Aufklappen: erst rechnen, dann nachsehen", 0),
    ("Regel bleibt: **kein Rechner**, Papier und Stift", 0),
    ("**docalvers.de/mathetest11-gleichungen.html**", 0),
])

d.save()
