#!/usr/bin/env python3
"""Gauss-Verfahren - Mathe 11 (BGY), KW 11, LB 4."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-gauss.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 11",
        "Das Gauß-Verfahren",
        "Drei Gleichungen, drei Unbekannte — planmäßig zur Stufenform")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 4 — Stunden **6 bis 10 von 20**", 0),
    ("Drei Blöcke: **erlaubte Umformungen**, **Stufenform**, **geometrische Deutung**", 0),
    ("Diese Woche **ohne Hilfsmittel** und vorrangig mit eindeutiger Lösung", 0),
    ("Das Verfahren ist stur — genau das macht es so brauchbar", 0),
])

d.chapter(1, "Erlaubte Umformungen", "Was man mit Zeilen tun darf")

d.bullets("Das Ziel", [
    ("Das System soll **Stufenform** bekommen: unten nur noch eine Unbekannte", 0),
    ("Dann von unten nach oben zurückeinsetzen", 0),
    ("Man arbeitet nur noch mit **Zeilen**, nicht mehr mit $x$, $y$, $z$", 0),
    ("Deshalb passt die Matrixschreibweise von letzter Woche so gut", 0),
])

d.bullets("Die drei erlaubten Schritte", [
    ("Zwei Zeilen **vertauschen**", 0),
    ("Eine Zeile mit einer Zahl **ungleich null** multiplizieren", 0),
    ("Zu einer Zeile das Vielfache einer **anderen** Zeile addieren", 0),
    ("**Nicht** erlaubt: eine Zeile mit null multiplizieren — sie geht verloren", 0),
])

d.bullets("Warum man Zeilen tauscht", [
    ("Wenn ganz oben links eine **Null** steht, kann man nicht eliminieren", 0),
    ("Dann bringt man eine Zeile mit passendem Eintrag nach oben", 0),
    ("Tauschen ändert die Lösungsmenge nicht — es ist nur eine andere Reihenfolge", 0),
    ("Am Rechner nennt man das Pivotieren", 0),
])

d.merksatz("Mit null multiplizieren ist die einzige Zeilenumformung, die verboten ist — sie löscht eine Gleichung.")

d.chapter(2, "Rechnen", "Von der Stufenform zurück")

d.bullets("Zwei Gleichungen zum Aufwärmen", [
    ("$x + y = 5$ und $x - y = 1$: die zweite von der ersten abziehen", 0),
    ("$2y = 4$, also $y = 2$ und damit $x = 3$", 0),
    ("$2x + y = 8$ und $x - y = 1$: addieren ergibt $3x = 9$", 0),
    ("Also $x = 3$ und $y = 2$ — hier hebt sich $y$ von selbst weg", 0),
])

d.bullets("Rückwärtseinsetzen bei drei Unbekannten", [
    ("$x + y + z = 6$, $y + z = 5$, $z = 3$ ist bereits Stufenform", 0),
    ("Von unten: $z = 3$, damit $y = 2$", 0),
    ("Und schließlich $x = 6 - 2 - 3 = 1$", 0),
    ("Steht dort $2z = 6$, wird zuerst durch $2$ geteilt", 0),
])

d.bullets("Wenn eine Unbekannte schon bekannt ist", [
    ("$3x + 2y = 12$ und $x = 2$", 0),
    ("Einsetzen: $6 + 2y = 12$, also $y = 3$", 0),
    ("Nicht jedes System braucht das volle Verfahren", 0),
    ("Erst hinsehen, dann rechnen — wie bei den quadratischen Gleichungen", 0),
])

d.bullets("Ein Mischungsproblem", [
    ("$x + y = 100$ und $3x + 5y = 380$", 0),
    ("Erste Zeile mal $3$ und abziehen: $2y = 80$", 0),
    ("Also $y = 40$ und $x = 60$", 0),
    ("**Probe**: in **beide** Ausgangsgleichungen einsetzen, nicht nur in eine", 0),
])

d.chapter(3, "Was am Ende dasteht", "Die letzte Zeile verrät alles")

d.bullets("Drei mögliche Ausgänge", [
    ("Bleibt $0 = 5$, also eine **falsche Aussage**: das System hat **keine** Lösung", 0),
    ("Bleibt $0 = 0$, eine **wahre Aussage**: eine Gleichung war überflüssig", 0),
    ("Dann gibt es **unendlich viele** Lösungen", 0),
    ("Nur wenn jede Unbekannte eine eigene Stufe hat, ist die Lösung eindeutig", 0),
])

d.bullets("Unabhängige Gleichungen", [
    ("Für drei Unbekannte braucht man in der Regel **drei** Gleichungen", 0),
    ("Aber nur, wenn sie **unabhängig** sind — keine folgt aus den anderen", 0),
    ("$x + 2y = 7$ und $2x + 4y = 14$ sind dieselbe Gleichung", 0),
    ("Also unendlich viele Lösungen, obwohl zwei Zeilen dastehen", 0),
])

d.two_cols("Geometrisch gesehen", [
    ("Zwei Unbekannte: Geraden", 0),
    ("Schnittpunkt = eine Lösung", 1),
    ("parallel = keine Lösung", 1),
    ("deckungsgleich = unendlich viele", 1),
], [
    ("Drei Unbekannte: Ebenen", 0),
    ("eine Gleichung ist eine Ebene", 1),
    ("gemeinsamer Punkt = eine Lösung", 1),
    ("Schnittgerade = unendlich viele", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Umformungen, Stufenform, Deutung", 0),
    ("Der Vorteil gegenüber dem Einsetzungsverfahren: es läuft **immer gleich ab**", 0),
    ("Deshalb kann man es programmieren — und deshalb rechnen Computer so", 0),
    ("**docalvers.de/mathetest11-gauss.html**", 0),
])

d.save()
