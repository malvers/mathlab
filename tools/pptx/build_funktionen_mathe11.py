#!/usr/bin/env python3
"""Funktionsbegriff - Mathe 11 (BGY), KW 40, Start LB 3.

Folgt den 20 Aufgaben von HTML/mathetest11-funktionen.html.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-funktionen.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 40",
        "Der Funktionsbegriff",
        "Definitionsbereich, Nullstellen, Monotonie, Symmetrie — der Start in Lernbereich 3")

d.bullets("Der Fahrplan dieser Woche", [
    ("**Neuer Lernbereich 3** — Stunden **1 bis 5 von 75**, er trägt das ganze Jahr", 0),
    ("Drei Blöcke: **was eine Funktion ist**, **Nullstellen und Monotonie**, "
     "**Symmetrie und Periode**", 0),
    ("Vier Darstellungen desselben: **Worte, Tabelle, Term, Graph**", 0),
    ("GeoGebra kommt dazu — zum **Untersuchen**, nicht zum Ausrechnen", 0),
])

# --------------------------------------------------- Block 1: Begriff ------
d.chapter(1, "Was eine Funktion ist", "Eine Regel mit einer einzigen Bedingung")

d.bullets("Die Bedingung, auf die alles hinausläuft", [
    ("Eine Funktion ordnet jedem $x$ **genau einen** Wert $y$ zu", 0),
    ("Nicht mehr als einen — **eindeutig** ist das ganze Geheimnis", 0),
    ("Erlaubt ist dagegen, dass zwei $x$ **denselben** Wert bekommen", 0),
    ("$f(-2) = 5$ liest man: an der Stelle $-2$ hat die Funktion den Wert $5$", 0),
])

d.bullets("Wann es keine Funktion ist", [
    ("„Jeder Zahl ihre Quadratwurzeln“ ordnet $4$ die Werte $2$ **und** $-2$ zu", 0),
    ("Zwei Werte an einer Stelle — also **keine** Funktion", 0),
    ("Am Graphen: die **senkrechte Gerade** $x = 3$ ist keine Funktion", 0),
    ("**Senkrechten-Test**: trifft eine Senkrechte den Graphen zweimal, ist es keine", 0),
])

d.bullets("Definitionsbereich: was eingesetzt werden darf", [
    ("$f(x) = \\dfrac{1}{x - 4}$: der Nenner darf nicht null werden", 0),
    ("Also alle reellen Zahlen **außer** $x = 4$", 0),
    ("$f(x) = \\sqrt{x - 3}$: unter der Wurzel nichts Negatives, also $x \\geq 3$", 0),
    ("Zwei Fragen genügen: **Nenner null?** und **Wurzel negativ?**", 0),
])

d.bullets("Wertebereich: was herauskommen kann", [
    ("$f(x) = x^2$ mit $D = \\mathbb{R}$ liefert nie etwas Negatives", 0),
    ("Der Wertebereich ist also $y \\geq 0$", 0),
    ("Am Graphen abzulesen: **wie hoch und wie tief** reicht die Kurve?", 0),
    ("Definitionsbereich waagerecht denken, Wertebereich senkrecht", 0),
])

d.merksatz("Zu jedem x genau ein y — das ist die ganze Definition. Alles Weitere sind Eigenschaften.")

# ------------------------------------------- Block 2: Nullstellen/Monotonie -
d.chapter(2, "Nullstellen und Monotonie", "Wo die Kurve die Achse trifft und wohin sie läuft")

d.bullets("Nullstellen sind Schnittpunkte mit der x-Achse", [
    ("Nullstelle heißt: $f(x) = 0$ — also die Gleichung lösen", 0),
    ("$f(x) = 2x - 6$ gibt $2x = 6$, also $x = 3$", 0),
    ("$f(x) = x^2 - 4$ gibt **zwei**: $x = 2$ und $x = -2$", 0),
    ("Am Graphen: dort, wo die Kurve die **waagerechte** Achse trifft", 0),
])

d.bullets("Der y-Achsenabschnitt ist geschenkt", [
    ("Die $y$-Achse ist die Stelle $x = 0$ — also einfach einsetzen", 0),
    ("$f(x) = 3x - 5$ gibt $f(0) = -5$, Schnittpunkt $(0 \\mid -5)$", 0),
    ("Bei $f(x) = mx + n$ ist der Achsenabschnitt **immer** $n$", 0),
    ("Punktprobe genauso: liegt $(2 \\mid 3)$ auf $f(x) = x^2 - 1$? Einsetzen, prüfen", 0),
])

d.bullets("Monotonie: steigt sie oder fällt sie?", [
    ("$f(x) = -2x + 1$ hat den Anstieg $-2$, fällt also **überall**", 0),
    ("$f(x) = x^2$ fällt links von null und **steigt ab $x = 0$**", 0),
    ("Monotonie gilt deshalb immer nur **auf einem Bereich**, nicht global", 0),
    ("„Streng“ heißt: nie zwischendurch waagerecht", 0),
])

d.bullets("Schnittpunkte zählen statt rechnen", [
    ("Wie oft schneidet $y = 5$ die Parabel $y = x^2$?", 0),
    ("Die Frage ist dieselbe wie: wie viele Lösungen hat $x^2 = 5$?", 0),
    ("**Zwei** — bei $\\sqrt{5}$ und $-\\sqrt{5}$", 0),
    ("Eine Skizze beantwortet solche Fragen schneller als jede Rechnung", 0),
])

# -------------------------------------------------- Block 3: Symmetrie -----
d.chapter(3, "Symmetrie und Periode", "Was man am Term sieht, bevor man zeichnet")

d.bullets("Zwei Symmetrien, eine Faustregel", [
    ("**Nur gerade** Exponenten: achsensymmetrisch zur $y$-Achse", 0),
    ("$f(x) = x^4 - x^2$ ist deshalb **achsensymmetrisch**", 0),
    ("**Nur ungerade** Exponenten: punktsymmetrisch zum Ursprung", 0),
    ("$f(x) = x^3$ ist **punktsymmetrisch**", 0),
])

d.bullets("Wenn sich die Exponenten mischen", [
    ("$f(x) = x^2 + x$ hat einen geraden **und** einen ungeraden Term", 0),
    ("Dann liegt **keine** der beiden Symmetrien vor", 0),
    ("Nachweis sauber: $f(-x)$ bilden und mit $f(x)$ vergleichen", 0),
    ("$f(-x) = f(x)$ heißt achsensymmetrisch, $f(-x) = -f(x)$ punktsymmetrisch", 0),
])

d.bullets("Periodisch: die Sinusfunktion", [
    ("$f(x) = \\sin x$ wiederholt sich nach $2\\pi$", 0),
    ("Das ist die **Periode** — einmal um den Einheitskreis herum", 0),
    ("Periodisch heißt: $f(x + p) = f(x)$ für alle $x$", 0),
    ("Später beschreiben wir damit alles, was sich regelmäßig wiederholt", 0),
])

d.two_cols("Vom Term zum Graphen — und zurück", [
    ("Am Term erkennt man", 0),
    ("Definitionsbereich (Nenner, Wurzel)", 1),
    ("Symmetrie (gerade/ungerade)", 1),
    ("Achsenabschnitt (einsetzen)", 1),
], [
    ("Am Graphen erkennt man", 0),
    ("Nullstellen (Schnitt mit $x$)", 1),
    ("Monotoniebereiche", 1),
    ("Wertebereich (wie hoch, wie tief)", 1),
])

d.bullets("Wenn nur eine Tabelle gegeben ist", [
    ("$f(1) = 2$, $f(2) = 4$, $f(3) = 8$, $f(4) = 16$", 0),
    ("Die Differenzen wachsen — also **nicht** linear", 0),
    ("Aber der **Quotient** ist immer $2$: jedes Mal verdoppelt", 0),
    ("Das passt zu $f(x) = 2^x$ — nächste Wochen mehr davon", 0),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Definitionsbereich, Nullstellen, Symmetrie", 0),
    ("Bei jeder Aufgabe fragen: sehe ich das am **Term** oder am **Graphen**?", 0),
    ("GeoGebra danach zum Gegenprüfen, nicht zum Lösen", 0),
    ("**docalvers.de/mathetest11-funktionen.html**", 0),
])

d.save()
