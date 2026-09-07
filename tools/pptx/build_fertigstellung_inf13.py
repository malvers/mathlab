#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 22 / KW 4: Fertigstellung der Webpraesenz
(LB 4, Ustd. 15-16/18)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("webprojekt-fertigstellung.pptx")

d.title("Informatik — Grundkurs 13", "Fertig machen",
        "Feinschliff, Tests auf verschiedenen Geräten, Dokumentation abschließen")

d.chapter(1, "Der Testplan", "Systematisch statt herumklicken")

d.table_top("Was getestet wird", [
    ["Bereich", "Test", "bestanden, wenn"],
    ["Funktion", "jede Muss-Anforderung einzeln", "sie tut, was da steht"],
    ["Eingaben", "leer, zu lang, falsches Format", "verständliche Meldung, kein Absturz"],
    ["Geräte", "Telefon, Tablet, großer Bildschirm", "lesbar und bedienbar"],
    ["Browser", "zwei verschiedene", "sieht überall passend aus"],
    ["Tastatur", "nur mit Tab bedienen", "alles erreichbar"],
    ["Fremdtest", "anderes Team ohne Erklärung", "kommt allein zurecht"],
], [150, 350, 316], [
    ("Der **Fremdtest** findet die Fehler, die ihr nicht mehr sehen könnt", 0),
    ("Zu jedem Fund gehört: **was passiert, wann, wie schwer**", 0),
], font_size=10.5, bold_cols=(0,), marks={(6, 0): TINT_GREEN})

d.bullets("Feinschliff, der sich lohnt", [
    ("**Fehlerseite**: was sieht jemand, der eine falsche Adresse eintippt?", 0),
    ("**Leerer Zustand**: wie sieht die Liste aus, wenn noch nichts drinsteht?", 0),
    ("**Rückmeldung**: nach dem Speichern eine sichtbare Bestätigung", 0),
    ("**Titel und Favicon**: jede Seite hat einen eigenen, sprechenden Titel", 0),
    ("**Ladezeit**: große Bilder verkleinern — das merkt man auf dem Telefon sofort", 0),
])

d.chapter(2, "Die Dokumentation", "Was hineingehört")

d.table_top("Die Gliederung", [
    ["Teil", "Inhalt", "Umfang"],
    ["Ziel", "Was sollte die Seite können, für wen?", "3 Sätze"],
    ["Anforderungen", "Muss- und Kann-Liste mit Haken", "die Tabelle"],
    ["Datenmodell", "ER-Diagramm und Relationenschema", "1 Seite"],
    ["Aufbau", "welche Datei tut was", "1 Seite"],
    ["Sicherheit", "prepare, Maskierung, Passwörter, Datensparsamkeit", "halbe Seite"],
    ["Probleme", "drei Probleme mit Lösung", "je 4 Sätze"],
    ["Offen", "was fehlt oder wackelt", "ehrlich"],
], [150, 430, 236], [
    ("Der Abschnitt **Sicherheit** ist neu gegenüber Jahrgangsstufe 12 — er wird bewertet", 0),
    ("Und **Offen** kostet keine Punkte, Verschweigen schon", 0),
], font_size=10.5, bold_cols=(0,), marks={(5, 0): TINT_BLUE})

d.bullets("Der Abschnitt Aufbau", [
    ("Eine Tabelle: **Datei — Aufgabe — spricht mit**", 0),
    ("index.php zeigt die Startseite, liste.php die Übersicht, speichern.php nimmt das Formular entgegen", 0),
    ("Dazu: wo liegen **Zugangsdaten**, wo das **CSS**, wo die **Bilder**?", 0),
    ("Damit findet sich jemand in zehn Minuten zurecht — auch ihr selbst in einem Jahr", 0),
    ("Ein **Screenshot des Datenmodells** gehört dazu, nicht nur die Beschreibung", 0),
])

d.chapter(3, "Die Übergabe", "Fertig heißt übergebbar")

d.table_top("Die Abgabeliste", [
    ["Stück", "fertig, wenn"],
    ["Quellcode", "vollständig, an einem Ort, nummerierte Fassung"],
    ["Datenbank", "Anlege-Skript plus Beispieldaten"],
    ["Dokumentation", "alle sieben Abschnitte"],
    ["Testprotokoll", "jede Anforderung geprüft, Funde vermerkt"],
    ["Präsentation", "Ablauf steht, jeder kennt seinen Teil"],
], [230, 586], [
    ("**Probe**: kann das Nachbarteam eure Seite aus dem Abgabepaket zum Laufen bringen?", 0),
    ("Wenn nicht, fehlt meistens das Anlege-Skript oder die Konfigurationsdatei", 0),
], font_size=11, bold_cols=(0,), marks={(2, 0): TINT_ORANGE})

d.merksatz("Fertig ist, was ein anderes Team aus dem Abgabepaket zum Laufen "
           "bringt — ohne dass jemand von euch danebensteht.")

d.bullets("Fun Facts: Fertigstellen", [
    ("Der **leere Zustand** einer Anwendung ist der am häufigsten vergessene Bildschirm", 0),
    ("**Definition of Done** ist in Profiteams ein aufgeschriebener Satz, kein Gefühl", 0),
    ("Eine gute **404-Seite** hält Besucher auf der Seite statt sie zu verlieren", 0),
    ("Bilder machen meist den **größten Teil** der Übertragungsmenge aus", 0),
    ("Und: jede Änderung nach dem letzten Test ist **ungetestet**", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Testplan** vollständig abarbeiten, inklusive Fremdtest", 0),
    ("Gefundene Fehler nach **Schwere** sortieren und die hohen beheben", 0),
    ("**Feinschliff**: Fehlerseite, leerer Zustand, Rückmeldung, Titel", 0),
    ("**Dokumentation** in allen sieben Abschnitten abschließen", 0),
    ("**Übergabeprobe** mit dem Nachbarteam — läuft es aus dem Paket?", 0),
])

d.save()
