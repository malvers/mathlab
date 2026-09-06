#!/usr/bin/env python3
"""Werkzeugebenen: exakt oder numerisch - Mathe 11 (BGY), KW 38, LB 2.

Folgt den 20 Aufgaben von HTML/mathetest11-werkzeuge.html.
Kein Wochenindex im Dateinamen - HTML und Live-Plan zaehlen unterschiedlich.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-werkzeuge.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 38",
        "Exakt oder numerisch",
        "Gleichungen mit CAS und GTR lösen — und wissen, was das Ergebnis wert ist")

d.bullets("Der Fahrplan dieser Woche", [
    ("**5 Stunden**, Lernbereich 2 — Stunden **11 bis 15 von 20**", 0),
    ("Ab jetzt **mit Hilfsmitteln**: CAS, GTR, GeoGebra", 0),
    ("Drei Blöcke: **exakt oder numerisch**, **was das Werkzeug nicht weiß**, "
     "**Lösungswege bewerten**", 0),
    ("Die neue Frage ist nicht „wie rechne ich das“, sondern "
     "**„welche Ebene brauche ich“**", 0),
])

# ------------------------------------------------------ Block 1: Ebenen -----
d.chapter(1, "Exakt oder numerisch", "Zwei Antworten auf dieselbe Frage")

d.bullets("Was der exakte Modus liefert", [
    ("$x^2 = 2$ exakt gelöst heißt $x = \\sqrt{2}$ und $x = -\\sqrt{2}$", 0),
    ("Das CAS gibt **$\\sqrt{2}$ selbst** aus, keine Dezimalzahl", 0),
    ("Genauso bleibt $\\dfrac{1}{3}$ ein Bruch — der Rechner zeigt $0{,}3333333$", 0),
    ("Exakt heißt: **ohne jeden Rundungsfehler**, dafür oft unanschaulich", 0),
])

d.bullets("Was eine numerische Lösung ist", [
    ("Eine **Näherung** mit endlich vielen Stellen — fast nie der genaue Wert", 0),
    ("$2^x = 10$ hat die exakte Lösung $x = \\log_2 10$, numerisch $x \\approx 3{,}32$", 0),
    ("Für Sachaufgaben ist die Näherung meist die **brauchbarere** Antwort", 0),
    ("Für Beweise und Weiterrechnen ist sie **wertlos** — Fehler wachsen mit", 0),
])

d.bullets("Warum Rechner manchmal seltsam antworten", [
    ("$0{,}1 + 0{,}2$ ergibt auf vielen Geräten $0{,}30000000000000004$", 0),
    ("Kein Defekt: der Rechner speichert **binär**, und $0{,}1$ ist binär periodisch", 0),
    ("Dieselbe Ursache wie $\\dfrac{1}{3} = 0{,}333\\ldots$ im Zehnersystem", 0),
    ("Folge: **nie auf Gleichheit prüfen**, wenn numerisch gerechnet wurde", 0),
])

d.bullets("Die drei Werkzeugebenen", [
    ("**Kopf und Papier** — kleine Zahlen, Struktur sichtbar, Kontrolle sofort", 0),
    ("**Exaktes CAS** — Terme umformen, Wurzeln und Brüche behalten", 0),
    ("**Numerik** — was sich nicht auflösen lässt, etwa $x = \\cos x$", 0),
    ("Die Kunst ist die **Wahl der Ebene**, nicht die Bedienung des Geräts", 0),
])

d.merksatz("Das Werkzeug rechnet. Welche Ebene die Aufgabe braucht, entscheidest du.")

# --------------------------------------------- Block 2: Grenzen des CAS -----
d.chapter(2, "Was das Werkzeug nicht weiß", "Es kennt die Aufgabe nicht — nur die Gleichung")

d.bullets("Der Definitionsbereich fehlt dem CAS", [
    ("$\\dfrac{1}{x - 2} = 3$ ergibt $x = \\dfrac{7}{3}$ — erlaubt, denn $x \\neq 2$", 0),
    ("$\\dfrac{x + 1}{x^2 - 9}$ ist **nicht definiert** für $x = 3$ und $x = -3$", 0),
    ("Der Nenner darf nie null werden, unter der Wurzel nichts Negatives stehen", 0),
    ("**Immer selbst notieren**, bevor gerechnet wird", 0),
])

d.bullets("Scheinlösungen: erfundene Lösungen", [
    ("$\\sqrt{x + 6} = x$ quadriert ergibt $x = 3$ und $x = -2$", 0),
    ("Probe $x = 3$: $\\sqrt{9} = 3$ — **stimmt**", 0),
    ("Probe $x = -2$: $\\sqrt{4} = 2$, aber rechts steht $-2$ — **stimmt nicht**", 0),
    ("Quadrieren ist **keine** Äquivalenzumformung: es kann Lösungen hinzufügen", 0),
])

d.bullets("Der Sachzusammenhang entscheidet mit", [
    ("Gesucht ist eine Seitenlänge, das CAS liefert $x = 4$ und $x = -7$", 0),
    ("Mathematisch sind **beide** richtig — als Länge taugt nur $x = 4$", 0),
    ("Die zweite Lösung wird **begründet verworfen**, nicht verschwiegen", 0),
    ("Deshalb lohnt die Probe auch dann, wenn das CAS gerechnet hat", 0),
])

d.merksatz("Ein CAS beantwortet die Gleichung, die du eintippst — nicht die Aufgabe, die du meinst.")

# ------------------------------------------------ Block 3: Lesen/bewerten ---
d.chapter(3, "Ergebnisse lesen", "Wie viele Lösungen — und was heißt „oder“?")

d.bullets("Die Antwort des CAS richtig lesen", [
    ("Auf $x^2 - 5x + 6 = 0$ kommt „$x = 2$ oder $x = 3$“", 0),
    ("Das sind **zwei** Lösungen — beide erfüllen die Gleichung, jede für sich", 0),
    ("$(x - 1)(x + 4) = 0$ liest man direkt ab: $x = 1$ oder $x = -4$", 0),
    ("Ein Produkt ist null, sobald **ein** Faktor null ist", 0),
])

d.bullets("Wie viele Lösungen sind es wirklich?", [
    ("$x^3 - 4x = 0$ ausklammern: $x(x^2 - 4) = 0$ — **drei** Lösungen", 0),
    ("Nämlich $x = 0$, $x = 2$ und $x = -2$", 0),
    ("$x^2 - 6x + 9 = 0$ ist $(x - 3)^2 = 0$ — nur **eine** Lösung, doppelt", 0),
    ("Manche CAS zeigen sie zweimal an: das ist **eine** Zahl, nicht zwei", 0),
])

d.bullets("Von Hand geht manchmal schneller", [
    ("$\\dfrac{x}{3} + \\dfrac{x - 1}{4} = 2$: Hauptnenner $12$, fertig in zwei Zeilen", 0),
    ("Kleine ganze Zahlen, klare Struktur — **Papier schlägt Tippen**", 0),
    ("Und man **sieht**, was passiert, statt nur ein Ergebnis abzulesen", 0),
    ("Umgekehrt: $x = \\cos x$ lässt sich **nur numerisch** lösen", 0),
])

d.two_cols("Womit rechne ich was?", [
    ("Von Hand", 0),
    ("kleine ganze Zahlen", 1),
    ("Struktur soll sichtbar bleiben", 1),
    ("Kontrolle des CAS-Ergebnisses", 1),
    ("in der Klausur ohne Hilfsmittel", 1),
], [
    ("Mit Werkzeug", 0),
    ("sperrige Zahlen aus Messungen", 1),
    ("Gleichungen ohne geschlossene Lösung", 1),
    ("viele gleichartige Rechnungen", 1),
    ("Graphen zum Abschätzen", 1),
])

d.bullets("Genauigkeit: nicht mehr behaupten als man weiß", [
    ("Längen auf cm genau gemessen, das CAS zeigt $12{,}3456789$ m", 0),
    ("Das Ergebnis kann **nicht genauer** sein als die Messung", 0),
    ("Also auf **cm runden**: $12{,}35$ m", 0),
    ("Alle weiteren Stellen sind Rechenrauschen, keine Information", 0),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Werkzeugebenen, exakt oder numerisch, bewerten", 0),
    ("Jede Aufgabe hat einen **Lösungsweg** zum Aufklappen", 0),
    ("Bei jeder Aufgabe mitdenken: **welche Ebene** hätte ich gewählt?", 0),
    ("**docalvers.de/mathetest11-werkzeuge.html**", 0),
])

d.save()
