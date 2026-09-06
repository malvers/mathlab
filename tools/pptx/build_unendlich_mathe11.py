#!/usr/bin/env python3
"""Exkurs: Das unendlich Grosse - Mathe 11 (BGY), KW 24."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-unendlich.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 24",
        "Das unendlich Große",
        "Hilberts Hotel, Cantors Diagonale — und warum es verschieden große Unendlichkeiten gibt")

d.bullets("Der Fahrplan dieser Woche", [
    ("**Exkurs** — keine Prüfungsinhalte, dafür die schönste Mathematik des Jahres", 0),
    ("Drei Blöcke: **Hilberts Hotel**, **abzählbar**, **Cantors Diagonalverfahren**", 0),
    ("Die Leitfrage: **Wie vergleicht man unendlich große Mengen?**", 0),
    ("Antwort: durch **Zuordnen**, nicht durch Zählen", 0),
])

d.chapter(1, "Hilberts Hotel", "Immer noch ein Zimmer frei")

d.bullets("Das Gedankenexperiment", [
    ("Ein Hotel mit **unendlich vielen** Zimmern, alle belegt", 0),
    ("Ein neuer Gast kommt — und bekommt trotzdem ein Zimmer", 0),
    ("Jeder zieht um: von Zimmer $n$ in Zimmer $n + 1$", 0),
    ("Zimmer $1$ wird frei, obwohl niemand auszieht", 0),
])

d.bullets("Und für unendlich viele Neue?", [
    ("Jeder Gast zieht von Zimmer $n$ in Zimmer $2n$", 0),
    ("Dann sind alle **geraden** Zimmer belegt", 0),
    ("Alle **ungeraden** Zimmer sind frei — unendlich viele", 0),
    ("Bei endlichen Mengen wäre all das unmöglich", 0),
])

d.merksatz("Bei unendlichen Mengen kann ein echter Teil genauso groß sein wie das Ganze.")

d.chapter(2, "Abzählbar", "Vergleichen durch Zuordnen")

d.bullets("Was gleichmächtig heißt", [
    ("Zwei Mengen sind **gleichmächtig**, wenn man sie **paarweise zuordnen** kann", 0),
    ("Jedem Element der einen genau eines der anderen, ohne Rest", 0),
    ("**Abzählbar unendlich** heißt: gleichmächtig zu den natürlichen Zahlen", 0),
    ("Man kann die Elemente also durchnummerieren", 0),
])

d.bullets("Überraschend viele Mengen sind abzählbar", [
    ("Die **geraden** Zahlen: $n \\mapsto 2n$ ordnet jede zu — gleich viele", 0),
    ("Die **ganzen** Zahlen: abwechselnd $0, 1, -1, 2, -2, \\ldots$", 0),
    ("Sogar die **rationalen** Zahlen — über Cantors Schema in Zeilen und Spalten", 0),
    ("Obwohl zwischen je zwei Brüchen unendlich viele weitere liegen", 0),
])

d.bullets("Grenzwerte am Rande", [
    ("$\\dfrac{1}{n}$ strebt gegen **null**, ohne sie je zu erreichen", 0),
    ("$\\dfrac{1}{2} + \\dfrac{1}{4} + \\dfrac{1}{8} + \\ldots$ ergibt genau **$1$**", 0),
    ("Deshalb ist $0{,}\\overline{9} = 1$ — kein Rundungstrick, sondern dieselbe Zahl", 0),
    ("Und deshalb holt Achilles die Schildkröte ein: unendlich viele Schritte, "
     "endliche Zeit", 0),
])

d.chapter(3, "Cantors Diagonalverfahren", "Die zweite Unendlichkeit")

d.bullets("Der Beweis in vier Sätzen", [
    ("Angenommen, man könnte **alle** reellen Zahlen zwischen $0$ und $1$ auflisten", 0),
    ("Man baut eine neue Zahl: die $n$-te Nachkommastelle wird **geändert**", 0),
    ("Diese Zahl unterscheidet sich von **jeder** Zahl der Liste an mindestens einer Stelle", 0),
    ("Also fehlte sie — die Liste war nie vollständig", 0),
])

d.bullets("Was daraus folgt", [
    ("Die **reellen** Zahlen sind **überabzählbar**", 0),
    ("Es gibt also **verschieden große** Unendlichkeiten", 0),
    ("Und es gibt **mehr** irrationale als rationale Zahlen — unvergleichlich mehr", 0),
    ("Die vertrauten Brüche sind die seltene Ausnahme, nicht die Regel", 0),
])

d.two_cols("Zwei Sorten Unendlichkeit", [
    ("Abzählbar", 0),
    ("natürliche Zahlen", 1),
    ("ganze Zahlen", 1),
    ("rationale Zahlen", 1),
    ("Primzahlen (unendlich viele)", 1),
], [
    ("Überabzählbar", 0),
    ("reelle Zahlen", 1),
    ("irrationale Zahlen", 1),
    ("Punkte einer Strecke", 1),
    ("echt größer als abzählbar", 1),
])

d.bullets("Warum das mehr als Spielerei ist", [
    ("$\\infty$ ist **keine Zahl**, sondern eine Aussage über ein Verhalten", 0),
    ("Man rechnet nicht mit ihr — man beschreibt Grenzwerte", 0),
    ("Genau dieser Begriff trägt die ganze **Differenzialrechnung** in Klasse 12", 0),
    ("Und die Frage, was ein Computer überhaupt berechnen kann, hängt daran", 0),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Hotel, Abzählbarkeit, Diagonalverfahren", 0),
    ("Keine Rechenaufgaben, sondern **Denkaufgaben**", 0),
    ("Wer eine davon jemandem erklären kann, hat sie verstanden", 0),
    ("**docalvers.de/mathetest11-unendlich.html**", 0),
])

d.save()
