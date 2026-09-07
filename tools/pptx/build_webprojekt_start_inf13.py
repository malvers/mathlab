#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 13 / KW 48: Projekt Webtechnologie - Projektstart
(LB 4, Ustd. 1-2/18)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("webprojekt-start.pptx")

d.title("Informatik — Grundkurs 13", "Das Webprojekt",
        "Eine Webpräsenz mit Datenbankanbindung — Idee, Planung, Meilensteine")

d.chapter(1, "Das Ziel", "Was am Ende dastehen soll")

d.table_top("Die Mindestanforderungen", [
    ["Teil", "muss können", "Ustd."],
    ["Oberfläche", "mehrere Seiten, Navigation, responsiv", "3–6"],
    ["Inhalte", "semantisches HTML, barrierefrei nutzbar", "5–6"],
    ["Datenbank", "eigenes Datenmodell, mindestens drei Tabellen", "9–12"],
    ["Dynamik", "Daten anzeigen und über ein Formular erfassen", "11–12"],
    ["Sicherheit", "Eingabevalidierung, Datensparsamkeit", "13–14"],
    ["Abschluss", "Tests, Dokumentation, Präsentation", "15–18"],
], [160, 490, 166], [
    ("Achtzehn Unterrichtsstunden — das ist knapp. **Kleine Version zuerst**", 0),
    ("Alles, was über die Mindestanforderungen hinausgeht, kommt auf die Kann-Liste", 0),
], font_size=10.5, bold_cols=(0,))

d.bullets("Was ein gutes Thema ausmacht", [
    ("**Fächerverbindend oder gesellschaftlich relevant** — das ist Vorgabe, nicht Kür", 0),
    ("Es braucht **Daten**, die sich sinnvoll in Tabellen abbilden lassen", 0),
    ("Es braucht **mindestens eine Auswertung**, die man zeigen kann", 0),
    ("Und es sollte euch **wirklich interessieren** — achtzehn Stunden sind lang", 0),
    ("Beispiele: Vereinsverzeichnis, Messwerte einer Wetterstation, Veranstaltungskalender, Tauschbörse", 0),
])

d.chapter(2, "Die Planung", "Mit den Werkzeugen aus Jahrgangsstufe 12")

d.table_top("Was ihr aus 12 wieder anwendet", [
    ["Werkzeug", "wofür jetzt"],
    ["Anforderungsliste", "Muss und Kann trennen"],
    ["Projektstrukturplan", "das Projekt in Arbeitspakete zerlegen"],
    ["Netzplan", "Abhängigkeiten und kritischen Pfad bestimmen"],
    ["Gantt-Diagramm", "die achtzehn Stunden auf die Pakete verteilen"],
    ["ER-Modell", "das Datenmodell der Webpräsenz"],
], [230, 586], [
    ("Nichts davon ist neu — ihr habt es im letzten Jahr gebaut. Jetzt wird es **benutzt**", 0),
    ("Der kritische Pfad zeigt, was **nicht** verschoben werden darf", 0),
], font_size=11.5, bold_cols=(0,))

d.table_top("Die Meilensteine", [
    ["Wann", "Was steht"],
    ["KW 49", "Grundgerüst HTML/CSS läuft, Navigation steht"],
    ["KW 50", "Layout responsiv, Inhalte eingepflegt"],
    ["KW 52", "Datenmodell steht, Datenbank angelegt"],
    ["KW 1", "Daten werden dynamisch angezeigt"],
    ["KW 3", "Sicherheit und Datenschutz umgesetzt"],
    ["KW 4", "fertig und getestet"],
    ["KW 5", "Präsentation"],
], [130, 686], [
    ("Ein Meilenstein ist **erreicht oder nicht** — und wer einen reißt, sagt es sofort", 0),
], font_size=11, bold_cols=(0,), marks={(6, 0): TINT_GREEN})

d.chapter(3, "Nachhaltigkeit", "Mitdenken statt nachrüsten")

d.bullets("Was das konkret heißt", [
    ("**Datensparsamkeit**: jedes Feld braucht einen Zweck — auch auf einer Webseite", 0),
    ("**Ressourcen**: große Bilder kosten Übertragung, Strom und Ladezeit", 0),
    ("**Barrierefreiheit**: Alternativtexte, Kontrast, Tastaturbedienung", 0),
    ("**Wartbarkeit**: eine Seite, die niemand pflegen kann, ist nach einem Jahr tot", 0),
    ("Alle vier kosten am Anfang Minuten und später Stunden, wenn sie fehlen", 0),
])

d.merksatz("Achtzehn Stunden sind knapp. Baut zuerst die kleinste Version, "
           "die läuft — verschönert wird zuletzt.")

d.bullets("Fun Facts: Webprojekte", [
    ("Die erste Webseite ging **1991** am CERN online — sie erklärte, was das WWW ist", 0),
    ("**Tim Berners-Lee** entwickelte HTTP, HTML und den ersten Browser in etwa einem Jahr", 0),
    ("Über **95 %** aller Webseiten liegen hinter einer Datenbank", 0),
    ("Der häufigste Grund für gescheiterte Schulprojekte ist ein **zu großes Thema**", 0),
    ("Der zweithäufigste: das Verschönern kam **vor** dem Funktionieren", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Teams bilden** (drei Personen) und ein Thema festlegen", 0),
    ("**Zweck in einem Satz** und fünf Fragen, die die Seite beantworten soll", 0),
    ("**Anforderungsliste** mit mindestens sechs Muss- und drei Kann-Punkten", 0),
    ("**Arbeitspakete** ableiten und in ein Gantt-Diagramm über 18 Stunden legen", 0),
    ("Erste Skizze des **Datenmodells** — es wird in KW 52 gebraucht", 0),
])

d.save()
