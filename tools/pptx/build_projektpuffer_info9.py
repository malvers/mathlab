#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 35 / KW 18: Projektarbeit und Puffer -
Restarbeiten an Produkt und Dokumentation."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("projekt-restarbeiten.pptx")

d.title("Informatik — Klasse 9", "Die letzte Runde",
        "Restarbeiten, Abgabe vorbereiten — und die Präsentation planen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Der Kassensturz", "Was ist da, was fehlt?")

d.table_top("Die Abgabeliste", [
    ["Stück", "fertig, wenn", "da?"],
    ["Produkt", "läuft, alle Muss-Punkte abgehakt", ""],
    ["Dokumentation", "zwei bis drei Seiten, alle Abschnitte", ""],
    ["Testplan", "jede Anforderung geprüft", ""],
    ["Fehlerprotokoll", "behoben oder in „Offen“ dokumentiert", ""],
    ["Präsentation", "Ablauf steht, jeder weiß seinen Teil", ""],
], [230, 430, 156], [
    ("Geht die Liste **zu dritt** durch und hakt gemeinsam ab — nicht jeder für sich", 0),
    ("Was heute fehlt, fehlt auch bei der Bewertung", 0),
], font_size=11.5, bold_cols=(0,))

d.bullets("Die Reihenfolge heute", [
    ("**Zuerst**: was zur Abgabe fehlt und ohne das nichts geht", 0),
    ("**Dann**: die hohen Fehler aus dem Protokoll", 0),
    ("**Dann**: die Dokumentation vervollständigen", 0),
    ("**Zuletzt**: Kann-Punkte, aber nur wenn wirklich Zeit bleibt", 0),
    ("**Nicht** heute: neue Ideen anfangen. Dafür ist der Zug abgefahren", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die Präsentation planen", "Zehn Minuten, drei Personen")

d.table_top("Ein Ablauf, der funktioniert", [
    ["Minute", "Wer", "Was"],
    ["0–1", "Person 1", "Thema und Ziel: Was sollte es können?"],
    ["1–4", "Person 2", "Vorführung am lebenden Objekt"],
    ["4–6", "Person 3", "Wie sind wir vorgegangen? Storyboard zeigen"],
    ["6–8", "Person 1", "Ein Problem und seine Lösung"],
    ["8–10", "alle", "Was ist offen, was haben wir gelernt, Fragen"],
], [110, 160, 546], [
    ("Jeder redet — auch wer wenig programmiert hat, kann über den Verlauf sprechen", 0),
    ("Die **Vorführung** ist der wichtigste Teil. Plant dafür die meiste Zeit ein", 0),
], font_size=11, bold_cols=(0,), marks={(2, 2): TINT_GREEN})

d.bullets("Was bei Vorführungen schiefgeht", [
    ("Die Datei liegt **nicht** auf dem Vorführrechner — heute schon hinkopieren", 0),
    ("Die Fassung auf dem Stick ist **älter** als die letzte — Nummer prüfen", 0),
    ("Ton fehlt, Fenster zu klein, Bildschirm gespiegelt — **einmal vorher aufbauen**", 0),
    ("Niemand weiß, wer anfängt — **Reihenfolge aufschreiben**", 0),
    ("Und der Klassiker: es wird noch fünf Minuten vorher etwas geändert. **Nicht tun**", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Übergeben", "So dass ein anderer damit arbeiten kann")

d.bullets("Der Übergabe-Test", [
    ("Gebt eure Abgabe dem **Nachbarteam** und sagt nichts dazu", 0),
    ("Kann es das Produkt **starten**? Ohne Rückfrage?", 0),
    ("Versteht es aus der Dokumentation, **was das Produkt können soll**?", 0),
    ("Findet es die **offenen Punkte**?", 0),
    ("Wenn dreimal ja: ihr seid fertig. Wenn nicht, wisst ihr, was noch fehlt", 0),
])

d.merksatz("Fertig ist, was ein anderer starten, verstehen und beurteilen kann — "
           "ohne dass jemand aus dem Team danebensteht.")

d.bullets("Fun Facts: Endspurt", [
    ("Das **Parkinsonsche Gesetz**: Arbeit dehnt sich genau so weit aus, wie Zeit da ist", 0),
    ("Deshalb helfen feste Termine mehr als gute Vorsätze", 0),
    ("**Featuritis** kurz vor Schluss ist der häufigste Grund für Fehler in der Vorführung", 0),
    ("Profis machen vor jeder Demo einen **Trockenlauf** — auf genau dem Rechner", 0),
    ("Und sie haben immer einen **Screenshot** als Notfallplan, falls nichts startet", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Abgabeliste** zu dritt durchgehen und abhaken", 0),
    ("Restarbeiten in der Reihenfolge aus Kapitel 1", 0),
    ("**Präsentationsablauf** aufschreiben: wer redet wann worüber", 0),
    ("Die Abgabefassung auf den **Vorführrechner** kopieren und dort starten", 0),
    ("**Übergabe-Test** mit dem Nachbarteam machen", 0),
])

d.save()
