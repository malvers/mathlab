#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 45 / KW 27: Jahresrueckblick und Ausblick auf
Jahrgangsstufe 13."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("jahresrueckblick-inf12.pptx")

d.title("Informatik — Grundkurs 12", "Ein Jahr in zehn Fragen",
        "Rückblick auf Modellierung und Datenbanken — und was in 13 kommt")

d.chapter(1, "Der Rückblick", "Zehn Fragen quer durch das Jahr")

d.table_top("Fragen 1 bis 5", [
    ["Nr", "Frage", "aus"],
    ["1", "Was sind die drei Eigenschaften eines Modells?", "LB 1"],
    ["2", "Wogegen wird ein Modell geprüft?", "LB 1"],
    ["3", "Welche Regel gilt für Ereignis und Funktion in der eEPK?", "LB 1"],
    ["4", "Wie bestimmt man den kritischen Pfad?", "LB 1"],
    ["5", "Was unterscheidet Prozess- und Objektsicht?", "LB 1"],
], [70, 620, 126], [
    ("Beantwortet sie zu zweit, **ohne** Unterlagen — dann mit", 0),
], font_size=11, bold_cols=(0,))

d.table_top("Fragen 6 bis 10", [
    ["Nr", "Frage", "aus"],
    ["6", "Woraus besteht ein Datenbanksystem?", "LB 2"],
    ["7", "Wo steht bei 1:n der Fremdschlüssel — und warum?", "LB 2"],
    ["8", "Wie erkennt man eine Verletzung der 3NF?", "LB 2"],
    ["9", "Was ist der Unterschied zwischen WHERE und HAVING?", "LB 2"],
    ["10", "Was unterscheidet Datensicherheit von Datenschutz?", "LB 2"],
], [70, 620, 126], [
    ("Wer alle zehn in ganzen Sätzen beantworten kann, hat das Jahr verstanden", 0),
    ("Die Fragen sind absichtlich so gestellt, wie sie in der Klausur stünden", 0),
], font_size=11, bold_cols=(0,))

d.chapter(2, "Was hängen bleiben soll", "Fünf Sätze für die Oberstufe")

d.bullets("Die Sätze des Jahres", [
    ("**Ein Modell ist eine Verkürzung für einen Zweck — geprüft wird gegen den Zweck**", 0),
    ("**Der Projektumfang ist die Differenz zwischen Ist- und Soll-Prozess**", 0),
    ("**Der kritische Pfad hat keinen Puffer und bestimmt die Projektdauer**", 0),
    ("**Fremdschlüssel auf der n-Seite, n:m als eigene Tabelle**", 0),
    ("**Redundanz ist die Ursache, Inkonsistenz die Folge**", 0),
])

d.table_top("Wo ihr das wieder braucht", [
    ["Satz", "kommt wieder bei"],
    ["Modellbegriff", "jedem Entwurf, auch in der Programmierung"],
    ["Prozessmodellierung", "dem Webprojekt in Jahrgangsstufe 13"],
    ["Projektplanung", "dem Projekt in 13 und in jeder Ausbildung"],
    ["Datenmodell", "der Datenbankanbindung des Webprojekts"],
    ["SQL", "dem Abitur und praktisch jedem IT-Beruf"],
], [230, 586], [
    ("Nichts aus diesem Jahr ist abgeschlossen — alles wird in 13 gebraucht", 0),
], font_size=11, bold_cols=(0,))

d.chapter(3, "Ausblick", "Jahrgangsstufe 13")

d.table_top("Was in 13 ansteht", [
    ["Lernbereich", "Inhalt", "Umfang"],
    ["LB 3 (Fortsetzung)", "Algorithmen und Programme in Python", "24 Ustd."],
    ["LB 4", "Projekt Webtechnologie mit Datenbankanbindung", "18 Ustd."],
    ["Wahlbereich", "Quanteninformatik", "4 Ustd."],
    ["Abschluss", "Prüfungsvorbereitung", "mehrere Wochen"],
], [200, 400, 216], [
    ("In **LB 3** setzt ihr die Struktogramme aus diesem Jahr in echten Code um", 0),
    ("In **LB 4** kommen Prozessmodell, Datenmodell und Programmierung zusammen", 0),
], font_size=11, bold_cols=(0,), marks={(2, 0): TINT_GREEN})

d.merksatz("Modellieren, planen, Daten strukturieren — das war der Werkzeugkasten. "
           "In 13 wird damit gebaut.")

d.bullets("Fun Facts: das Jahr in Zahlen", [
    ("Ihr habt in LB 1 **fünf Modellarten** kennengelernt: Schrittfolge, eEPK, BPMN, Netzplan, Klassendiagramm", 0),
    ("In LB 2 **sechs SQL-Klauseln** und **drei Normalformen**", 0),
    ("Die drei Namen des Jahres: **Stachowiak**, **Chen** und **Codd**", 0),
    ("Der häufigste Fehler des Jahres: der Fremdschlüssel auf der falschen Seite", 0),
    ("Und der häufigste Satz: **erst denken, dann tippen**", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("Die **zehn Fragen** zu zweit beantworten, erst ohne Unterlagen", 0),
    ("Markiert die Fragen, bei denen ihr **unsicher** wart", 0),
    ("Legt euch dazu eine **Lückenliste** an — die braucht ihr im Herbst", 0),
    ("Schaut euch den **Ausblick** an und notiert, worauf ihr euch freut", 0),
    ("Nächste Woche: Ausklang", 0),
])

d.save()
