#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 25 / KW 8: Wiederholung und Klausur 2
(LB 4: Webtechnologie und Vernetzung)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, html_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("wiederholung-klausur2-inf13.pptx")
html = lambda t, ls, **kw: d.code(t, [html_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 13", "LB 4 im Überblick",
        "HTML/CSS, TCP/IP und Datenbankanbindung — Wiederholung und Klausur 2")

d.chapter(1, "HTML und CSS", "Struktur und Gestaltung")

d.table_top("Was sitzen muss", [
    ["Thema", "Kern"],
    ["Semantik", "header, nav, main, section, article, footer statt div"],
    ["Trennung", "HTML sagt was, CSS sagt wie"],
    ["Selektoren", "Element, .klasse, #id, verschachtelt"],
    ["Box-Modell", "content, padding, border, margin"],
    ["Responsiv", "Flexbox, Grid, Media Queries, viewport-Meta"],
    ["Barrierefrei", "alt, label, Kontrast, Tastaturbedienung"],
], [160, 656], [
    ("Häufige Aufgabe: **fehlerhaftes HTML korrigieren** und die Fehler benennen", 0),
    ("Zweithäufigste: **ein Layout beschreiben** und die passenden CSS-Regeln nennen", 0),
], font_size=11, bold_cols=(0,))

html("Findet die vier Fehler", [
    "<div class=\"kopf\"><h3>Vereinsliste</h3></div>",
    "<img src=\"halle.jpg\">",
    "<input type=\"text\" name=\"ort\">",
    "<a href=\"liste.html\">hier klicken</a>",
], size=13)

d.bullets("Die Auflösung", [
    ("**div class=\"kopf\"** statt **header** — nicht semantisch", 0),
    ("**h3** als erste Überschrift — die Ebenen beginnen bei h1", 0),
    ("Das Bild hat **kein alt** — nicht barrierefrei", 0),
    ("Das Eingabefeld hat **kein label** — und der Linktext sagt nichts", 0),
    ("Vier Fehler, alle in vier Zeilen — genau so kommt es in der Klausur", 0),
])

d.chapter(2, "TCP/IP und HTTP", "Der Weg zur Seite")

d.table_top("Die Fakten", [
    ["Thema", "Kern"],
    ["Schichten", "Anwendung, Transport, Internet, Netzzugang"],
    ["Adressen", "URL, Port, IP-Adresse, MAC-Adresse — je Schicht eine"],
    ["DNS", "übersetzt Namen in IP-Adressen"],
    ["HTTP", "zustandslos, Request und Response, Statuscodes"],
    ["Statuscodes", "200 ok, 301/302 Weiterleitung, 403, 404, 500"],
    ["GET und POST", "GET liest, POST verändert"],
], [160, 656], [
    ("Merksatz für die Fehlersuche: **4xx ist die Anfrage, 5xx der Server**", 0),
], font_size=11, bold_cols=(0,), marks={(6, 0): TINT_GREEN})

d.chapter(3, "Datenbankanbindung", "Der sicherheitsrelevante Teil")

d.table_top("Die zwei Regeln und ihre Angriffe", [
    ["Regel", "verhindert", "Stichwort"],
    ["prepare mit Platzhaltern", "SQL-Injection", "beim Hineinschreiben"],
    ["beim Ausgeben maskieren", "Cross-Site-Scripting", "beim Herausgeben"],
    ["Passwörter hashen mit Salt", "Klartextverlust bei Datenleck", "password_hash"],
    ["Serverseitig prüfen", "umgangene Browserprüfung", "immer"],
], [230, 300, 286], [
    ("Diese vier Zeilen sind der Kern des Klausurteils zur Sicherheit", 0),
    ("Zu jeder Regel gehört die Frage: **was passiert ohne sie?**", 0),
], font_size=10.5, bold_cols=(0,), marks={(r, 0): TINT_GREEN for r in range(1, 5)})

d.bullets("So läuft die Klausur", [
    ("Teil A: **Begriffe** — Schichten, Statuscodes, GET und POST", 0),
    ("Teil B: **HTML/CSS korrigieren** oder ergänzen", 0),
    ("Teil C: **Ablauf beschreiben** — von der URL bis zur Anzeige", 0),
    ("Teil D: **Sicherheit** — Lücke erkennen und den richtigen Code angeben", 0),
    ("Code wird auf Papier geschrieben: Syntaxfehler kosten **keine** Punkte", 0),
])

d.merksatz("Beim Hineinschreiben vorbereiten, beim Herausgeben maskieren. "
           "Und geprüft wird immer auf dem Server.")

d.bullets("Vorbereitung heute", [
    ("Korrigiert **zwei** fehlerhafte HTML-Ausschnitte und benennt die Fehler", 0),
    ("Beschreibt den **Weg einer Anfrage** in sieben Schritten", 0),
    ("Ordnet **fünf Statuscodes** typischen Situationen zu", 0),
    ("Schreibt eine **unsichere** Zeile und ihre sichere Fassung nebeneinander", 0),
    ("Stellt eure letzten Fragen", 0),
])

d.save()
