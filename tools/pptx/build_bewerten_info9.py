#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 13 / KW 48: Abfrageergebnisse interpretieren und
kritisch bewerten (LB 1, Ustd. 11/13)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("abfragen-bewerten.pptx")

d.title("Informatik — Klasse 9", "Stimmt das überhaupt?",
        "Abfrageergebnisse lesen, prüfen und nicht blind glauben")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Drei Prüffragen", "Vollständig? Aktuell? Plausibel?")

d.table_top("Bevor ihr eine Zahl weitergebt", [
    ["Frage", "was gemeint ist", "Beispiel"],
    ["Vollständig?", "sind alle Zeilen dabei?", "fehlt der Verlag, fehlt die Zeile im Filter"],
    ["Aktuell?", "wann wurden die Daten erfasst?", "Preise von 2019"],
    ["Plausibel?", "kann das überhaupt stimmen?", "Durchschnittsalter 137 Jahre"],
], [180, 280, 356], [
    ("Eine Datenbank antwortet **immer** — auch auf eine falsch gestellte Frage", 0),
    ("Sie sagt nie „das Ergebnis ist Unsinn“. Das müsst **ihr** merken", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Woher falsche Ergebnisse kommen", [
    ("Der **Filter** war anders gemeint als gedacht — UND statt ODER", 0),
    ("**Leere Felder** fallen aus der Auswertung heraus", 0),
    ("**Tippfehler** machen aus einem Verlag zwei", 0),
    ("Die Daten sind **veraltet** — richtig gerechnet, trotzdem falsch", 0),
    ("Und manchmal war schon die **Frage** die falsche", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Wie man mit Zahlen täuscht", "Alles wahr — und trotzdem irreführend")

d.table_top("Drei ehrliche Zahlen, drei falsche Eindrücke", [
    ["Aussage", "warum sie täuscht"],
    ["„Unsere Spiele kosten im Schnitt 33 €“",
     "ein einziges 90-€-Spiel zieht den Schnitt hoch"],
    ["„90 % unserer Nutzer sind zufrieden“",
     "gefragt wurden nur die, die noch da sind"],
    ["„Doppelt so viele Ausleihen wie 2019“",
     "2019 war die Bibliothek halbjährlich geschlossen"],
], [330, 486], [
    ("Keine dieser Zahlen ist **falsch** — jede ist trotzdem **irreführend**", 0),
    ("Die Frage lautet immer: **Welche Zeilen sind eingeflossen, welche nicht?**", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Das Diagramm lügt am leichtesten", [
    ("Eine **abgeschnittene Achse** macht aus 2 % Unterschied einen Berg", 0),
    ("**Nur drei Monate** gezeigt, weil das Jahr anders aussieht", 0),
    ("Balken **unterschiedlich breit** — das Auge vergleicht Flächen", 0),
    ("**Prozente ohne Grundwert**: 50 % von wie vielen?", 0),
    ("Erste Gegenmaßnahme: **immer die Achsen anschauen**", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Der Kurzauftrag", "Entlarvt die Auswertung")

d.table_top("Ausleihen der Schulbibliothek", [
    ["Klasse", "Ausleihen", "Schüler", "je Schüler"],
    ["9a", "60", "30", "2,0"],
    ["9b", "45", "15", "3,0"],
    ["9c", "50", "25", "2,0"],
], [200, 220, 200, 196], [
    ("Überschrift der Auswertung: **„Klasse 9a liest am meisten“** — stimmt das?", 0),
    ("Nach **Gesamtzahl** ja. Je Schüler liegt **9b** vorn — mit halb so vielen Leuten", 0),
    ("Beide Zahlen sind richtig. Die **Überschrift** entscheidet, was man glaubt", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(1, 1): TINT_ORANGE, (2, 3): TINT_GREEN})

d.merksatz("Eine Datenbank antwortet immer. Ob die Antwort etwas taugt, "
           "entscheidet die Frage — und wer die Zahlen liest.")

d.bullets("Fun Facts: Zahlen und Zweifel", [
    ("Der Satz **„Traue keiner Statistik, die du nicht selbst gefälscht hast“** wird oft "
     "Churchill zugeschrieben — nachweisbar ist das nicht", 0),
    ("Das Buch **„How to Lie with Statistics“** von 1954 verkauft sich bis heute", 0),
    ("**Simpsons Paradoxon**: eine Gruppe kann in jedem Teilvergleich vorn liegen und "
     "insgesamt trotzdem hinten", 0),
    ("Genau das ist oben passiert: 9a vorn bei der Summe, 9b vorn je Schüler", 0),
    ("Profis geben zu jeder Zahl den **Stand** und die **Grundgesamtheit** an", 0),
])

d.bullets("Eure Aufgabe", [
    ("Sucht in eurer Datenbank eine Auswertung, die **auf zwei Arten** gelesen werden kann", 0),
    ("Formuliert **zwei Überschriften** dazu: eine harmlose und eine reißerische", 0),
    ("Prüft eine eigene Auswertung mit den **drei Fragen**: vollständig, aktuell, plausibel", 0),
    ("Findet **eine** Zeile, die durch ein leeres Feld aus einem Filter herausfällt", 0),
    ("Schreibt auf: **welche Angabe fehlt**, damit jemand anders eure Zahl beurteilen kann?", 0),
])

d.save()
