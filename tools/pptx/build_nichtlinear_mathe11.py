#!/usr/bin/env python3
"""Nichtlineare Gleichungen, Prozente, Binome - Mathe 11 (BGY), KW 37, LB 2.

Deckt genau die Woche ab, die im Live-Plan (svp_plan_edits) als Woche 4 / KW 37
steht, und folgt den 20 Aufgaben von HTML/mathetest11-nichtlinear.html.
Kein Wochenindex im Dateinamen - die Zaehlung in HTML und Datenbank weicht ab.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-nichtlinear.pptx")

# 1 - Titel
d.title("Mathematik · Berufliches Gymnasium 11 · KW 37",
        "Nichtlineare Gleichungen und Prozente",
        "Inhaltlich lösen statt umformen — und binomische Formeln in beide Richtungen")

# 2 - Fahrplan
d.bullets("Der Fahrplan dieser Woche", [
    ("**5 Stunden**, Lernbereich 2 — Stunden **6 bis 10 von 20**", 0),
    ("Drei Blöcke: **inhaltlich lösen**, **Proportionalität und Prozent**, "
     "**binomische Formeln**", 0),
    ("Neu ist die Denkweise: die Gleichung **vorlesen** statt sofort umformen", 0),
    ("Am Ende **20 Aufgaben** zur Selbstkontrolle im Mathe-Labor", 0),
])

# --------------------------------------------------- Block 1: inhaltlich ----
d.chapter(1, "Inhaltlich lösen", "Was fragt die Gleichung eigentlich?")

d.bullets("Vorlesen statt umformen", [
    ("$a^3 = 8$ heißt: **welche Zahl** ergibt dreimal mit sich selbst $8$?", 0),
    ("Antwort im Kopf: $a = 2$ — kein Umformen nötig", 0),
    ("$2^k = 16$ heißt: **wie oft** muss ich $2$ verdoppeln? Also $k = 4$", 0),
    ("**Immer die Probe**: einsetzen und nachrechnen — das ersetzt den Rechenweg", 0),
])

d.bullets("Gerader Exponent: zwei Lösungen oder keine", [
    ("$x^2 = 49$ hat **zwei** Lösungen: $x = 7$ und $x = -7$", 0),
    ("Das Wurzelzeichen liefert nur die **positive** — die zweite muss man mitdenken", 0),
    ("$x^2 = -9$ hat in den reellen Zahlen **keine** Lösung: kein Quadrat wird negativ", 0),
    ("Merke: **gerader** Exponent, also zwei Lösungen, eine oder gar keine", 0),
])

d.bullets("Ungerader Exponent und Wurzeln", [
    ("$x^3 = -27$ hat **genau eine** Lösung: $x = -3$", 0),
    ("Ungerade Potenzen **behalten das Vorzeichen** — deshalb geht Negatives hier", 0),
    ("$\\sqrt{x} = 6$: beide Seiten **quadrieren**, also $x = 36$", 0),
    ("Unter der Wurzel darf nichts Negatives stehen — Definitionsbereich mitprüfen", 0),
])

d.bullets("Zehnerpotenzen und die Null im Exponenten", [
    ("$10^x = 1000$: die $1000$ hat **drei Nullen**, also $x = 3$", 0),
    ("$5^x = 1$: **jede** Zahl hoch null ergibt eins, also $x = 0$", 0),
    ("Das ist keine Ausnahme, sondern folgt aus $5^x : 5^x = 5^{x-x}$", 0),
    ("Aus dieser Frage wird später der **Logarithmus**", 0),
])

d.merksatz("Die meisten dieser Gleichungen beantwortet man, indem man sie laut vorliest.")

# ------------------------------------------------------ Block 2: Prozent ----
d.chapter(2, "Proportionalität und Prozent", "Die Mathematik, die im Alltag am häufigsten vorkommt")

d.bullets("Die drei Größen", [
    ("**Grundwert** $G$ — das Ganze, wovon die Rede ist", 0),
    ("**Prozentsatz** $p$ — wie viele Hundertstel davon", 0),
    ("**Prozentwert** $W$ — der Anteil selbst: $W = G \\cdot \\dfrac{p}{100}$", 0),
    ("Der häufigste Fehler ist nicht die Formel, sondern der **falsche Grundwert**", 0),
])

d.bullets("Um wie viel Prozent hat sich etwas geändert?", [
    ("Ein Preis steigt von $80$ € auf $92$ €", 0),
    ("**Änderung zuerst**: $92 - 80 = 12$ €", 0),
    ("**Immer auf den alten Wert** beziehen: $\\dfrac{12}{80} = 0{,}15$", 0),
    ("Also $15\\,\\%$ Steigerung — auf $92$ bezogen käme falsch $13\\,\\%$ heraus", 0),
])

d.bullets("Rückwärts: vom neuen Preis zum alten", [
    ("Nach $20\\,\\%$ Rabatt kostet eine Jacke $68$ €. Was kostete sie vorher?", 0),
    ("$68$ € sind **nicht** der Grundwert, sondern $80\\,\\%$ davon", 0),
    ("Also $G \\cdot 0{,}8 = 68$, damit $G = \\dfrac{68}{0{,}8} = 85$ €", 0),
    ("Falle: $20\\,\\%$ von $68$ dazuzählen ergibt $81{,}60$ € — **falscher Grundwert**", 0),
])

d.bullets("Der Wachstumsfaktor spart alle Zwischenschritte", [
    ("$+15\\,\\%$ heißt **mal $1{,}15$**, $-20\\,\\%$ heißt **mal $0{,}8$**", 0),
    ("Mehrere Änderungen werden **multipliziert**, nicht addiert", 0),
    ("$+10\\,\\%$ und danach $-10\\,\\%$: $1{,}1 \\cdot 0{,}9 = 0{,}99$", 0),
    ("Man landet also $1\\,\\%$ **unter** dem Anfang — nicht wieder beim Ausgangswert", 0),
])

d.two_cols("Zwei Sorten von Zusammenhang", [
    ("Proportional", 0),
    ("$4$ kg Äpfel kosten $6$ €", 1),
    ("doppelt so viel, doppelt so teuer", 1),
    ("$10$ kg kosten $15$ €", 1),
    ("**Quotient** bleibt gleich", 1),
], [
    ("Antiproportional", 0),
    ("$3$ Maschinen brauchen $12$ h", 1),
    ("mehr Maschinen, weniger Zeit", 1),
    ("$5$ Maschinen brauchen $7{,}2$ h", 1),
    ("**Produkt** bleibt gleich", 1),
])

d.merksatz("Prozent heißt Hundertstel — und der Grundwert ist immer das, wovon die Rede war.")

# ------------------------------------------------------- Block 3: Binome ----
d.chapter(3, "Binomische Formeln", "Einmal vorwärts, einmal rückwärts")

d.bullets("Die drei Formeln", [
    ("$(a + b)^2 = a^2 + 2ab + b^2$", 0),
    ("$(a - b)^2 = a^2 - 2ab + b^2$", 0),
    ("$(a + b)(a - b) = a^2 - b^2$", 0),
    ("Wer sie **rückwärts** liest, kann faktorisieren — darum geht es am Ende", 0),
])

d.bullets("Vorwärts: ausmultiplizieren", [
    ("$(x + 7)^2 = x^2 + 14x + 49$ — mit $a = x$ und $b = 7$", 0),
    ("$(2a - 3b)^2$: **beide** Teile quadrieren, auch die Zahlen", 0),
    ("$a^2 = 4a^2$, $b^2 = 9b^2$, Mittelterm $2 \\cdot 2a \\cdot 3b = 12ab$", 0),
    ("Ergebnis $4a^2 - 12ab + 9b^2$ — der Mittelterm fehlt nie", 0),
])

d.bullets("Das dritte Binom erkennt man am Minus", [
    ("$(5 + y)(5 - y) = 25 - y^2$ — die gemischten Glieder heben sich auf", 0),
    ("Nachrechnen: $+5y$ und $-5y$ ergeben zusammen null", 0),
    ("Deshalb bleibt nur die **Differenz der Quadrate** übrig", 0),
    ("Genau diese Form braucht man gleich zum Faktorisieren", 0),
])

d.bullets("Rückwärts: eine Differenz von Quadraten zerlegen", [
    ("$x^2 - 81$: beides sind Quadrate, $x^2$ und $9^2$", 0),
    ("Also $x^2 - 81 = (x + 9)(x - 9)$", 0),
    ("$49x^2 - 16$: auch $49x^2$ ist ein Quadrat, nämlich $(7x)^2$", 0),
    ("Also $49x^2 - 16 = (7x + 4)(7x - 4)$", 0),
])

d.bullets("Rückwärts: ein vollständiges Quadrat erkennen", [
    ("$x^2 + 10x + 25$ — passt das auf $a^2 + 2ab + b^2$?", 0),
    ("**Probe am Mittelterm**: $b = 5$, denn $2 \\cdot x \\cdot 5 = 10x$", 0),
    ("Und der letzte Term stimmt: $5^2 = 25$", 0),
    ("Also $x^2 + 10x + 25 = (x + 5)^2$", 0),
])

d.two_cols("Die sechs Fallen dieser Woche", [
    ("Beim Lösen und Rechnen", 0),
    ("bei $x^2 = 49$ die Lösung $-7$ vergessen", 1),
    ("$\\sqrt{x} = 6$ gewurzelt statt quadriert", 1),
    ("prozentuale Änderung auf den **neuen** Wert bezogen", 1),
], [
    ("Bei Prozenten und Binomen", 0),
    ("$+10\\,\\%$ und $-10\\,\\%$ für ein Nullsummenspiel gehalten", 1),
    ("bei $(2a - 3b)^2$ die Zahlen nicht mitquadriert", 1),
    ("$x^2 + 81$ zerlegen wollen — nur die **Differenz** geht", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — genau diese drei Blöcke", 0),
    ("Jede Aufgabe hat einen **Lösungsweg** zum Aufklappen: erst rechnen, dann nachsehen", 0),
    ("Diese Woche außerdem: **Eingangstest IBB** — ob die Note zählt, "
     "entscheidet ihr **unmittelbar danach**", 0),
    ("**docalvers.de/mathetest11-nichtlinear.html**", 0),
])

d.save()
