#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 23 / KW 5: Projektpraesentationen und Auswertung
(LB 4, Ustd. 17-18/18)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("webprojekt-praesentation.pptx")

d.title("Informatik — Grundkurs 13", "Zeigt eure Webpräsenz",
        "Live-Demo, Peer-Feedback und die Bewertung")

d.chapter(1, "Der Ablauf", "Zwölf Minuten je Team")

d.table_top("Der Vortragsablauf", [
    ["Minute", "wer", "was"],
    ["0–1", "Person 1", "Thema, Zielgruppe, die fünf Fragen der Seite"],
    ["1–5", "Person 2", "Live-Demo: anlegen, anzeigen, filtern"],
    ["5–8", "Person 3", "Datenmodell und Aufbau der Dateien"],
    ["8–10", "Person 1", "Sicherheit und Datenschutz: was habt ihr getan?"],
    ["10–12", "alle", "ein Problem, seine Lösung, was offen bleibt"],
], [110, 160, 546], [
    ("Die **Live-Demo** ist der Kern — plant dafür die meiste Zeit ein", 0),
    ("Der Abschnitt **Sicherheit** ist neu und wird ausdrücklich bewertet", 0),
], font_size=10.5, bold_cols=(0,), marks={(2, 2): TINT_GREEN})

d.bullets("Vor dem Start", [
    ("Seite auf dem **Vorführrechner** öffnen und einmal ganz durchklicken", 0),
    ("**Testdaten** vorbereiten — eine leere Datenbank sieht in der Demo schlecht aus", 0),
    ("Aber auch den **leeren Zustand** zeigen können, wenn danach gefragt wird", 0),
    ("**Fenstergröße** so wählen, dass man es von hinten lesen kann", 0),
    ("Und: **nichts mehr ändern**", 0),
])

d.chapter(2, "Peer-Feedback", "Was die Zuhörenden tun")

d.table_top("Der Feedbackbogen", [
    ["Kriterium", "Frage", "Skala"],
    ["Funktion", "Läuft alles, was gezeigt wird?", "1–5"],
    ["Gestaltung", "Ist die Seite auf Anhieb bedienbar?", "1–5"],
    ["Datenmodell", "Passt es zum Zweck der Seite?", "1–5"],
    ["Sicherheit", "Wurden prepare und Maskierung erklärt?", "1–5"],
    ["Vortrag", "Verständlich, alle beteiligt, Zeit gehalten?", "1–5"],
], [160, 430, 226], [
    ("Dazu je **eine Stärke** und **eine Frage** in eigenen Worten", 0),
    ("Vergleiche zwischen Teams gehören **nicht** auf den Bogen", 0),
], font_size=10.5, bold_cols=(0,))

d.bullets("Gute Fragen an ein fremdes Projekt", [
    ("„Was passiert, wenn ich das Feld **leer** lasse?“", 0),
    ("„Wie habt ihr die **Eingaben geprüft** — im Browser oder auf dem Server?“", 0),
    ("„Warum habt ihr **diese** Tabellenaufteilung gewählt?“", 0),
    ("„Welche Daten speichert ihr, die ihr **nicht** braucht?“", 0),
    ("„Was würdet ihr mit **zwei** weiteren Stunden zuerst machen?“", 0),
])

d.chapter(3, "Bewertung und Auswertung", "Wie die Note entsteht")

d.table_top("Die Punkte", [
    ["Bereich", "Punkte", "entscheidend"],
    ["Produkt: Funktion", "12", "Muss-Anforderungen laufen"],
    ["Produkt: Datenmodell und Sicherheit", "10", "3NF, prepare, Maskierung"],
    ["Dokumentation", "8", "vollständig, Probleme konkret"],
    ["Präsentation", "6", "verständlich, alle beteiligt"],
    ["Zusammenhang", "4", "Modell, Code und Doku passen zusammen"],
], [280, 130, 406], [
    ("Insgesamt **40 Punkte**. Die Umrechnung steht an der Tafel", 0),
    ("Offen dokumentierte Lücken kosten nichts — verschwiegene schon", 0),
], font_size=10.5, bold_cols=(0,), marks={(3, 0): TINT_ORANGE})

d.bullets("Die Auswertung zum Schluss", [
    ("**Was lief gut** — und woran lag es genau?", 0),
    ("**Was würdet ihr anders machen** — und was wäre der erste Schritt?", 0),
    ("Welches **Werkzeug aus Jahrgangsstufe 12** hat am meisten geholfen?", 0),
    ("Wo hat euch die **Planung** vor Ärger bewahrt, wo hat sie gefehlt?", 0),
    ("Ein Satz je Person, an die Tafel", 0),
])

d.merksatz("Die Live-Demo ist der Kern der Präsentation. Alles andere "
           "erklärt, wie sie zustande kam.")

d.bullets("Fun Facts: Vorführen", [
    ("Der **Demo-Effekt**: was nie kaputtging, geht genau jetzt kaputt", 0),
    ("Deshalb hat jeder Profi **Screenshots** als Notfallplan", 0),
    ("Eine Demo mit **echten Daten** wirkt sofort glaubwürdiger als eine mit „Test1, Test2“", 0),
    ("Zuhörer erinnern sich an **Anfang, Ende** und an das, was schiefging", 0),
    ("Und: langsamer klicken, als sich richtig anfühlt", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Präsentieren** nach dem geplanten Ablauf", 0),
    ("Als Zuhörende: **Feedbackbogen** ausfüllen, je eine Stärke und eine Frage", 0),
    ("Nach jeder Demo: **zwei Fragen** aus der Klasse", 0),
    ("Zum Schluss die **Auswertung** — ein Satz je Person an die Tafel", 0),
    ("Abgaben, die noch fehlen: heute nachreichen", 0),
])

d.save()
