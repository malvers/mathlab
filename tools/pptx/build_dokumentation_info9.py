#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 34 / KW 17: Dokumentation des Projektverlaufs
(LB 2, Ustd. 11/12)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("projekt-dokumentation.pptx")

d.title("Informatik — Klasse 9", "Aufschreiben, was passiert ist",
        "Die Dokumentation: Verlauf, Probleme, Lösungen — und das Produkt")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Wozu das gut ist", "Nicht für die Lehrkraft, für euch")

d.bullets("Warum Profis dokumentieren", [
    ("Wer in einem halben Jahr weitermacht, weiß sonst nicht, **warum** etwas so gebaut ist", 0),
    ("Ein neues Teammitglied kommt in **Stunden** statt in Wochen hinein", 0),
    ("Bei einem Fehler weiß man, **was schon versucht wurde**", 0),
    ("Und bei der Bewertung zählt sichtbar, was ihr **gedacht** habt, nicht nur das Ergebnis", 0),
    ("Kurz: Dokumentation ist das **Gedächtnis** des Projekts", 0),
])

d.table_top("Was hineingehört", [
    ["Teil", "Inhalt", "Umfang"],
    ["Ziel", "Was sollte das Produkt können?", "3 Sätze"],
    ["Anforderungen", "die Muss- und Kann-Liste mit Haken", "die Tabelle"],
    ["Verlauf", "die Phasen, wer was gemacht hat", "1 Seite"],
    ["Probleme", "was hakte, wie habt ihr es gelöst?", "3 Beispiele"],
    ["Produkt", "Screenshots mit Bildunterschrift", "3 bis 5 Bilder"],
    ["Offen", "was fehlt oder wackelt noch", "ehrlich, stichpunktartig"],
], [150, 430, 236], [
    ("Zwei bis drei Seiten reichen völlig — **kurz und wahr** schlägt lang und schön", 0),
], font_size=11, bold_cols=(0,), marks={(6, 0): TINT_ORANGE})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Der Abschnitt Probleme", "Der wertvollste Teil")

d.table_top("So schreibt man ein Problem auf", [
    ["Frage", "Beispiel"],
    ["Was war das Problem?", "Die Punkte wurden nach einem Neustart nicht zurückgesetzt"],
    ["Wie fiel es auf?", "Beim Fremdtest durch Team 3, zweite Runde"],
    ["Was haben wir versucht?", "Erst die Anzeige geprüft, dann die Variable"],
    ["Wie ist es gelöst?", "Die Variable wird jetzt beim Start auf 0 gesetzt"],
], [230, 586], [
    ("Vier Sätze je Problem genügen — aber sie müssen **konkret** sein", 0),
    ("„Es gab Probleme mit der Technik“ ist keine Dokumentation, sondern eine Ausrede", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Screenshots richtig einbauen", [
    ("Jedes Bild bekommt eine **Bildunterschrift**: was sieht man da?", 0),
    ("Zeigt den **Normalfall** und einen **Sonderfall**, nicht fünfmal dasselbe", 0),
    ("Schneidet zu — der halbe Desktop drumherum lenkt ab", 0),
    ("Ein Bild vom **Storyboard** und eins vom fertigen Produkt nebeneinander wirkt stark", 0),
    ("Und: keine **Namen** oder privaten Daten auf den Bildern", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Wer schreibt was?", "Alle, nicht einer")

d.table_top("Aufteilung, die funktioniert", [
    ["Teil", "schreibt"],
    ["Ziel und Anforderungen", "wer die Liste geführt hat"],
    ["Verlauf", "die Teamleitung"],
    ["Probleme", "jeder ein Problem aus dem eigenen Bereich"],
    ["Screenshots", "wer das Produkt am besten kennt"],
    ["Offene Punkte", "wer getestet hat"],
], [330, 486], [
    ("So schreibt jeder über das, was er **selbst** gemacht hat — das merkt man am Text", 0),
    ("Am Ende liest **eine** Person alles durch, damit es zusammenpasst", 0),
], font_size=11.5, bold_cols=(0,))

d.merksatz("Die Dokumentation ist das Gedächtnis des Projekts. Der wertvollste "
           "Abschnitt ist der über die Probleme — nicht der über die Erfolge.")

d.bullets("Fun Facts: Dokumentation", [
    ("Die **Apollo-Programme** der NASA sind bis heute dokumentiert einsehbar — Zeile für Zeile", 0),
    ("Der Satz „**Der Code ist die Dokumentation**“ gilt in der Fachwelt als Ausrede", 0),
    ("Ein **Postmortem** ist der Bericht nach einem Projekt: was lief gut, was nicht", 0),
    ("Große Firmen schreiben Postmortems **schuldfrei** — es geht um Ursachen, nicht um Namen", 0),
    ("Die beste Dokumentation ist die, die jemand **liest** — deshalb kurz", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Dokumentation schreiben** — zwei bis drei Seiten, nach der Gliederung oben", 0),
    ("Je Person **ein Problem** aus dem eigenen Bereich, in vier Sätzen", 0),
    ("**Drei bis fünf Screenshots** mit Bildunterschrift", 0),
    ("Den Abschnitt **Offene Punkte** ehrlich ausfüllen", 0),
    ("Eine Person liest zum Schluss alles **am Stück** durch", 0),
])

d.save()
