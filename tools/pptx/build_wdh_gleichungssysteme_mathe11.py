#!/usr/bin/env python3
"""Wiederholung Gleichungssysteme - Mathe 11 (BGY), KW 41, LB 4.

Doc, 06.10.2026: "Die PowerPoint, die wir heute eingehangen haben, bau die mal bitte in unserem Stil. Als HTML
nach." - Docs Klasse-8-Deck (OneDrive UNTERRICHT/MATH BGY 11/Wiederholung Gleichungssysteme.pptx, 50 Folien) in
unserem Deck-Stil: dieselben Beispiele und Zahlen, die Abbildungen gezeichnet (mathe11_wdh_lgs_svg.py), die
Lehrbuchseiten nicht abfotografiert, sondern als eigene Loesungswege. Nur HTML:

    python3 tools/pptx/html_deck.py build_wdh_gleichungssysteme_mathe11.py

Initial only - after the first build HTML/decks/mathe11-wdh-gleichungssysteme.html is the source.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck
from mathe11_wdh_lgs_svg import svg

d = MathDeck("mathe11-wdh-gleichungssysteme.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 41",
        "Wiederholung Gleichungssysteme",
        "Zeichnen, Gleichsetzen, Einsetzen, Addieren — und Sachaufgaben")

d.bullets("Der Fahrplan dieser Stunde", [
    ("Was ein **lineares Gleichungssystem** ist — und warum die Lösung ein **Zahlenpaar** ist", 0),
    ("Vier Verfahren: **zeichnen**, **gleichsetzen**, **einsetzen**, **addieren**", 0),
    ("Ein System, drei Wege — welches Verfahren spart Rechnung?", 0),
    ("Das Dreieck mit festem Umfang und **Sachaufgaben** mit Strategie", 0),
])

# ---------------------------------------------------------------- 1 LGS ---
d.chapter(1, "Lineare Gleichungssysteme", "Zwei Gleichungen, ein Zahlenpaar")

d.bullets("Was ist ein lineares Gleichungssystem?", [
    ("Zwei lineare Gleichungen mit **denselben zwei Unbekannten**, zum Beispiel", 0),
    ("I: $y = -x + 5$ und II: $y = 2x - 1$", 0),
    ("Zusammen bilden sie ein **lineares Gleichungssystem** (LGS)", 0),
    ("Gesucht sind $x$ und $y$, die **beide** Gleichungen zugleich erfüllen", 0),
])

d.figure("Zahlenpaare als Lösung", svg("lgs"), lines=[
    ("Die Lösung ist keine einzelne Zahl, sondern ein **Zahlenpaar** $(x \\mid y)$", 0),
    ("Jede Gleichung ist eine **Gerade** — die Lösung ist ihr **Schnittpunkt**", 0),
    ("Probe mit $P(2 \\mid 3)$: $3 = -2 + 5$ ✓ und $3 = 2 \\cdot 2 - 1$ ✓", 0),
])

d.bullets("Vier Lösungsverfahren", [
    ("**Zeichnerisch** — beide Geraden zeichnen, den Schnittpunkt ablesen", 0),
    ("**Gleichsetzungsverfahren** — beide Gleichungen nach derselben Variablen auflösen", 0),
    ("**Einsetzungsverfahren** — eine Gleichung in die andere einsetzen", 0),
    ("**Additionsverfahren** — die Gleichungen so addieren, dass eine Variable wegfällt", 0),
])

# --------------------------------------------------------- 2 zeichnerisch ---
d.chapter(2, "Zeichnerisch lösen", "Zwei Geraden, ein Schnittpunkt")

d.bullets("In drei Schritten", [
    ("Beide Gleichungen (falls nötig) nach $y$ umformen", 0),
    ("Beide Geraden in **ein** Koordinatensystem zeichnen", 0),
    ("Den Schnittpunkt ablesen — und mit der **Probe** prüfen", 0),
    ("Grenze des Verfahrens: liegt der Schnittpunkt nicht auf dem Gitter, wird Ablesen **ungenau**", 0),
])

d.figure("Ein Beispiel", svg("zeichnen1"), lines=[
    ("I: $x + y = 3$, also $y = -x + 3$", 0),
    ("II: $2x + y = 4$, also $y = -2x + 4$", 0),
    ("Die Geraden schneiden sich in $P(1 \\mid 2)$ — Probe: $1 + 2 = 3$ ✓, $2 + 2 = 4$ ✓", 0),
])

d.figure("Jetzt ihr: zeichnerisch", svg("zeichnen2"), lines=[
    ("I: $-x + 1 = y$, II: $y = 2x - 8$", 0),
    ("Lest den Schnittpunkt ab und macht die Probe", 0),
    ("Lösung: $P(3 \\mid -2)$ — denn $-3 + 1 = -2$ ✓ und $2 \\cdot 3 - 8 = -2$ ✓", 0),
])

# -------------------------------------------------------- 3 gleichsetzen ---
d.chapter(3, "Gleichsetzungsverfahren", "Wenn beide Gleichungen schon nach y aufgelöst sind")

d.bullets("Beispiel 1", [
    ("I: $y = 4x - 1$, II: $y = -x + 1$", 0),
    ("Gleichsetzen: $4x - 1 = -x + 1 \\quad | +x + 1$", 0),
    ("$5x = 2 \\quad | :5$, also $x = 0{,}4$", 0),
    ("In II: $y = -0{,}4 + 1 = 0{,}6$ — also $L = \\{(0{,}4 \\mid 0{,}6)\\}$", 0),
])

d.bullets("Beispiel 2", [
    ("I: $y = -3x + 16$, II: $y = 2x - 4$", 0),
    ("Gleichsetzen: $-3x + 16 = 2x - 4 \\quad | +3x + 4$", 0),
    ("$20 = 5x \\quad | :5$, also $x = 4$", 0),
    ("In II: $y = 2 \\cdot 4 - 4 = 4$ — also $L = \\{(4 \\mid 4)\\}$", 0),
])

d.bullets("So geht das Gleichsetzungsverfahren", [
    ("Beide Gleichungen nach **derselben** Variablen auflösen", 0),
    ("Die anderen Seiten gleichsetzen — es bleibt **eine** Gleichung mit **einer** Unbekannten", 0),
    ("Diese Variable berechnen, dann in eine Ausgangsgleichung einsetzen", 0),
    ("**Probe** in beiden Gleichungen, dann die Lösungsmenge notieren", 0),
])

# ----------------------------------------------------------- 4 einsetzen ---
d.chapter(4, "Einsetzungsverfahren", "Wenn eine Variable schon allein steht")

d.bullets("Beispiel", [
    ("I: $4x + 3y = 18$, II: $y = 2x - 4$", 0),
    ("II in I einsetzen: $4x + 3(2x - 4) = 18$", 0),
    ("$4x + 6x - 12 = 18$, also $10x - 12 = 18 \\quad | +12$, dann $10x = 30 \\quad | :10$", 0),
    ("$x = 3$, in II: $y = 2 \\cdot 3 - 4 = 2$ — also $L = \\{(3 \\mid 2)\\}$", 0),
])

d.bullets("So geht das Einsetzungsverfahren", [
    ("Eine Gleichung nach einer Variablen auflösen (oft steht sie schon so da)", 0),
    ("Diesen Term in die **andere** Gleichung einsetzen — **mit Klammern**", 0),
    ("Die Gleichung mit einer Unbekannten lösen", 0),
    ("Den Wert einsetzen, die zweite Variable berechnen — und die **Probe**", 0),
])

# ------------------------------------------------------------ 5 addieren ---
d.chapter(5, "Additionsverfahren", "Wenn beim Addieren eine Variable wegfällt")

d.bullets("Beispiel", [
    ("I: $7x + 2y = 40$, II: $4x - 2y = 4$", 0),
    ("$+2y$ und $-2y$ ergeben zusammen $0$ — also I + II: $11x = 44 \\quad | :11$", 0),
    ("$x = 4$, in I: $28 + 2y = 40 \\quad | -28$, dann $2y = 12 \\quad | :2$", 0),
    ("$y = 6$ — also $L = \\{(4 \\mid 6)\\}$", 0),
])

d.bullets("Wenn nichts von selbst wegfällt", [
    ("I: $8s + 10t = 20$, II: $4s - 5t = 10$", 0),
    ("II mal 2: $8s - 10t = 20$ — jetzt stehen $+10t$ und $-10t$ da", 0),
    ("I + II': $16s = 40 \\quad | :16$, also $s = 2{,}5$", 0),
    ("In II: $10 - 5t = 10$, also $t = 0$ — $L = \\{(2{,}5 \\mid 0)\\}$", 0),
])

d.bullets("So geht das Additionsverfahren", [
    ("Gleichungen so mit Zahlen **multiplizieren**, dass beim Addieren eine Variable wegfällt", 0),
    ("Addieren und die erste Variable berechnen", 0),
    ("In eine Ausgangsgleichung einsetzen und die zweite Variable berechnen", 0),
    ("**Probe**: $P(x \\mid y)$ in **beide** Gleichungen einsetzen", 0),
])

# ------------------------------------------------------------- 6 Analyse ---
d.chapter(6, "Analyse", "Ein System, drei Wege")

d.bullets("Additionsverfahren — der schnellste Weg", [
    ("I: $7x + 2y = 40$, II: $4x - 2y = 4$", 0),
    ("$+2y$ und $-2y$ stehen schon da: I + II ergibt $11x = 44$, also $x = 4$", 0),
    ("In I: $7 \\cdot 4 + 2y = 40$, also $2y = 12$ und $y = 6$", 0),
    ("**Zwei Zeilen** bis zur Lösung $(4 \\mid 6)$", 0),
])

d.bullets("Einsetzungsverfahren — geht auch", [
    ("II nach $x$: $4x = 4 + 2y \\quad | :4$, also $x = 1 + 0{,}5y$", 0),
    ("In I: $7(1 + 0{,}5y) + 2y = 40$", 0),
    ("$7 + 5{,}5y = 40 \\quad | -7$, dann $5{,}5y = 33 \\quad | :5{,}5$, also $y = 6$", 0),
    ("$x = 1 + 0{,}5 \\cdot 6 = 4$ — dieselbe Lösung, mehr Kommazahlen", 0),
])

d.bullets("Gleichsetzen ist manchmal aufwendig", [
    ("Beide nach $2y$ auflösen — I: $2y = 40 - 7x$, II: $2y = 4x - 4$", 0),
    ("Gleichsetzen: $40 - 7x = 4x - 4 \\quad | +7x + 4$", 0),
    ("$44 = 11x \\quad | :11$, also $x = 4$", 0),
    ("$2y = 4 \\cdot 4 - 4 = 12$, also $y = 6$ — wieder $(4 \\mid 6)$, aber mit Umweg", 0),
])

d.merksatz("Alle Verfahren führen zur selben Lösung. Wähle das, das am wenigsten Rechnung kostet: "
           "Steht eine Variable allein, setze ein. Sind beide nach y aufgelöst, setze gleich. "
           "Heben sich Terme auf, addiere.")

d.bullets("Lehrbuch S. 143, Nr. 5 — mit dem Additionsverfahren", [
    ("a) $5x - 2y = 25$, $4x - 2y = 10$ — I − II: $x = 15$, dann $y = 25$", 0),
    ("b) $8s + 10t = 20$, $4s - 5t = 10$ — II mal 2, addieren: $s = 2{,}5$, $t = 0$", 0),
    ("c) erst ordnen: $4a - 2b = 5$ und $5a - 3b = 9$", 0),
    ("I mal 3, II mal 2, subtrahieren: $2a = -3$, also $a = -1{,}5$ und $b = -5{,}5$", 0),
])

# ------------------------------------------------- 7 Dreiecksungleichung ---
d.chapter(7, "Die Dreiecksungleichung", "Wann aus drei Strecken ein Dreieck wird")

d.figure("Die Dreiecksungleichungen", svg("dreieck"), lines=[
    ("In jedem Dreieck sind zwei Seiten zusammen **länger** als die dritte", 0),
    ("$a + b > c$,   $b + c > a$,   $c + a > b$", 0),
    ("Sind zwei Seiten zu kurz, erreichen sie sich nicht — **kein** Dreieck", 0),
])

d.figure("Gleichschenkliges Dreieck mit festem Umfang", svg("umfang"), lines=[
    ("Basis $x$, Schenkel $y$: $u = 2y + x$ — eine Gleichung mit **zwei** Unbekannten", 0),
    ("Mit $u = 8$: $8 = 2y + x \\quad | -x$, dann $8 - x = 2y \\quad | :2$, also $y = -\\tfrac{1}{2}x + 4$", 0),
    ("Ein Dreieck nur für $x < 4$ — sonst ist $2y \\le x$ und die Schenkel treffen sich nicht", 0),
])

d.lab("Ausprobieren: der Umfang bleibt fest", "gleichschenkligesDreieck.html",
      note="Schiebt den Regler für die Basis — was passiert mit den Schenkeln, und ab wann gibt es kein Dreieck mehr?")

# --------------------------------------------------------- 8 Sachaufgaben ---
d.chapter(8, "Sachaufgaben", "Vom Text zum Gleichungssystem")

d.bullets("Die Strategie in vier Schritten", [
    ("**Variablen einführen** — was genau ist gesucht?", 0),
    ("**Gleichungen aufstellen** — jede Information im Text wird eine Gleichung", 0),
    ("**Gleichungssystem lösen** — mit dem Verfahren, das am wenigsten Rechnung kostet", 0),
    ("**Ergebnis prüfen** und einen **Antwortsatz** schreiben", 0),
])

d.bullets("Kirsch und Banane (Lehrbuch S. 145)", [
    ("Kirschnektar hat 50 % Fruchtanteil, Bananennektar 30 % — gesucht: 1 Liter mit 45 %", 0),
    ("$x$: Liter Kirschnektar, $y$: Liter Bananennektar — I: $x + y = 1$, II: $0{,}5x + 0{,}3y = 0{,}45$", 0),
    ("Aus I: $x = 1 - y$, in II: $0{,}5 - 0{,}2y = 0{,}45$, also $y = 0{,}25$ und $x = 0{,}75$", 0),
    ("Probe: $0{,}375 + 0{,}075 = 0{,}45$ ✓ — **750 ml** Kirsch- und **250 ml** Bananennektar", 0),
])

d.bullets("Löwen und Strauße", [
    ("Ein Ranger zählt im Gehege **6 Köpfe** und **20 Beine** — wie viele Löwen, wie viele Strauße?", 0),
    ("$x$: Löwen, $y$: Strauße — I: $x + y = 6$ (Köpfe), II: $4x + 2y = 20$ (Beine)", 0),
    ("I mal $(-2)$, zu II addieren: $2x = 8$, also $x = 4$ und $y = 2$", 0),
    ("Probe: $4 + 2 = 6$ ✓, $16 + 4 = 20$ ✓ — **4 Löwen und 2 Strauße**", 0),
])

d.bullets("Lehrbuch S. 147, Nr. 2 und 3", [
    ("Nr. 2: I: $x + y = 20$, II: $2x + 4y = 50$ — $x$ Hühner, $y$ Schafe", 0),
    ("I mal $(-2)$ plus II: $2y = 10$, also $y = 5$, $x = 15$ — **15 Hühner, 5 Schafe**", 0),
    ("Nr. 3: I: $4x + 6y = 5{,}20$, II: $3x + 2y = 2{,}90$ — II mal $(-3)$ plus I: $-5x = -3{,}50$", 0),
    ("$x = 0{,}70$, $y = 0{,}40$ — Croissant **0,70 €**, Brötchen **0,40 €**", 0),
])

d.bullets("Lehrbuch S. 147, Nr. 4 und 6", [
    ("Nr. 4: I: $8n + 2p = 12$, II: $6n + 4p = 15$ — I mal $(-2)$ plus II: $-10n = -9$", 0),
    ("$n = 0{,}90$, $p = 2{,}40$ — 5 Panzerwelse und 15 Neonfische kosten **25,50 €**", 0),
    ("Nr. 6: I: $y = 7{,}1 \\cdot 12 + 0{,}256x$, II: $y = 8{,}1 \\cdot 12 + 0{,}251x$ — gleichsetzen", 0),
    ("$0{,}005x = 12$, also $x = 2400$ kWh, $y = 699{,}60$ € — darüber ist Tarif II günstiger", 0),
])

d.bullets("Lehrbuch S. 147, Nr. 17 — zwei Pumpen", [
    ("$x$, $y$: Anteil des Beckens, den Pumpe I bzw. II in **einer Minute** füllt", 0),
    ("I: $2x + y = \\tfrac{1}{98}$, II: $x + y = \\tfrac{1}{126}$ — I − II: $x = \\tfrac{1}{441}$", 0),
    ("$y = \\tfrac{1}{126} - \\tfrac{1}{441} = \\tfrac{5}{882}$", 0),
    ("Pumpe I allein: **441 min** — Pumpe II allein: $\\tfrac{882}{5} = 176{,}4$ min, also **176 min 24 s**", 0),
])

d.merksatz("Bei Sachaufgaben zählt der Ansatz: Variablen klar benennen, jede Information wird eine Gleichung — "
           "und am Ende prüfen, ob die Lösung zur Wirklichkeit passt.")

d.bullets("Jetzt ihr", [
    ("Löwen und Strauße: **LGS aufstellen**, **lösen**, **Probe** — je 2 Punkte", 0),
    ("Lehrbuch S. 143 Nr. 5 und S. 147 Nr. 2, 3, 4, 6 und 17", 0),
    ("Vor jeder Aufgabe fragen: **welches Verfahren spart Rechnung?**", 0),
    ("Jede Lösung endet mit der **Probe** — und bei Sachaufgaben mit einem **Antwortsatz**", 0),
])

d.save()
