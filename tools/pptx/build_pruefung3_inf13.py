#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 31 / KW 14: Pruefungsvorbereitung III -
Komplexaufgaben und muendliches Pruefen."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("pruefungsvorbereitung-3.pptx")

d.title("Informatik — Grundkurs 13", "Prüfungsvorbereitung III",
        "Eine Komplexaufgabe quer durch den Kurs — und die mündliche Prüfung")

d.chapter(1, "Die Komplexaufgabe", "Alles in einem Szenario")

d.table_top("Das Szenario: die Fahrradwerkstatt geht online", [
    ["Teil", "verlangt", "aus"],
    ["a", "Ist-Prozess der Auftragsannahme als eEPK", "Jgst. 12, LB 1"],
    ["b", "Soll-Prozess mit Online-Terminbuchung", "Jgst. 12, LB 1"],
    ["c", "ER-Modell und Relationenschema", "Jgst. 12, LB 2"],
    ["d", "Normalisierung einer gegebenen Tabelle", "Jgst. 12, LB 2"],
    ["e", "Drei SQL-Abfragen für die Auswertung", "Jgst. 12, LB 2"],
    ["f", "Algorithmus: freie Termine finden", "Jgst. 13, LB 3"],
    ["g", "Sicherheit der Weboberfläche", "Jgst. 13, LB 4"],
], [70, 480, 266], [
    ("Genau so ist die schriftliche Prüfung aufgebaut: **ein Szenario, viele Blickwinkel**", 0),
    ("Wer die Teile getrennt übt, ist auf den Zusammenhang nicht vorbereitet", 0),
], font_size=10, bold_cols=(0,))

d.bullets("Die Reihenfolge beim Bearbeiten", [
    ("**Erst alles lesen** — Teil g verrät oft, was in Teil c gebraucht wird", 0),
    ("Dann die Teile nach **Sicherheit** sortieren: das Sichere zuerst", 0),
    ("Bei jedem Teil die **Zeit** notieren, die er bekommen soll", 0),
    ("**Teilergebnisse aufschreiben**, auch wenn der Rest fehlt", 0),
    ("Und: ein Teil, der auf einem vorigen aufbaut, darf dessen **Annahme** benennen und weiterrechnen", 0),
])

d.chapter(2, "Die mündliche Prüfung", "Wie sie abläuft")

d.table_top("Der Ablauf", [
    ["Phase", "Dauer", "was zählt"],
    ["Vorbereitung", "20 min", "Notizen strukturieren, nicht ausformulieren"],
    ["Vortrag", "10 min", "eigenständig, roter Faden, Fachbegriffe"],
    ["Prüfungsgespräch", "10 min", "auf Fragen eingehen, Zusammenhänge herstellen"],
], [180, 130, 506], [
    ("Im Vortrag zählt die **Struktur** — sagt am Anfang, worüber ihr sprecht", 0),
    ("Im Gespräch zählt, ob ihr **auf die Frage** antwortet, nicht auf eine ähnliche", 0),
], font_size=10.5, bold_cols=(0,), marks={(3, 2): TINT_GREEN})

d.bullets("Was im Gespräch gut ankommt", [
    ("**Nachfragen**, wenn eine Frage unklar ist — das ist kein Punktabzug", 0),
    ("**Beispiele** nennen: „Bei unserem Webprojekt war das so …“", 0),
    ("**Zusammenhänge** herstellen: das ER-Modell hängt am Prozess", 0),
    ("**Zugeben**, was man nicht weiß — und sagen, wie man es herausfinden würde", 0),
    ("**Nicht raten**: eine falsche Behauptung kostet mehr als ein ehrliches „das weiß ich nicht“", 0),
])

d.table_top("Typische Einstiegsfragen", [
    ["Frage", "worauf sie zielt"],
    ["Erklären Sie den Modellbegriff an einem Beispiel.", "Verkürzung und Zweck"],
    ["Warum steht der Fremdschlüssel auf der n-Seite?", "Begründung, nicht Regel"],
    ["Wann würden Sie eine Schleife statt Rekursion nehmen?", "Abwägung"],
    ["Wie schützen Sie eine Webseite gegen SQL-Injection?", "prepare, konkret"],
    ["Was sind die Grenzen der Algorithmierbarkeit?", "drei Arten unterscheiden"],
], [430, 386], [
    ("Alle fünf verlangen **Begründung und Beispiel** — nicht die Definition allein", 0),
], font_size=10.5, bold_cols=(0,))

d.chapter(3, "Die Simulation", "Heute üben wir es")

d.bullets("So läuft die Übung", [
    ("Dreiergruppen: einer prüft, einer wird geprüft, einer beobachtet", 0),
    ("**Zehn Minuten** Vortrag zu einem gezogenen Thema, dann fünf Minuten Fragen", 0),
    ("Der Beobachter notiert: **Struktur**, **Fachbegriffe**, **Beispiele**, **Umgang mit Lücken**", 0),
    ("Danach **Rückmeldung**: erst der Geprüfte selbst, dann der Beobachter", 0),
    ("Rollen tauschen, bis jeder einmal dran war", 0),
])

d.merksatz("In der mündlichen Prüfung zählt nicht, alles zu wissen, sondern "
           "Zusammenhänge herzustellen — und ehrlich zu sagen, wo eine Lücke ist.")

d.bullets("Fun Facts: mündliche Prüfungen", [
    ("Fast alle überschätzen, **wie schnell** zehn Minuten Vortrag vorbei sind", 0),
    ("Wer den **Aufbau** zu Beginn nennt, wirkt sofort strukturierter", 0),
    ("Ein **Blatt mit Stichworten** ist erlaubt und hilft — ein ausformulierter Text nicht", 0),
    ("Pausen wirken **länger für den Sprechenden** als für die Zuhörenden", 0),
    ("Und: ein Beispiel aus dem eigenen Projekt bleibt am besten hängen", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("Die **Komplexaufgabe** in Teilen bearbeiten, mit Zeitvorgabe je Teil", 0),
    ("**Prüfungssimulation** in Dreiergruppen, jeder einmal geprüft", 0),
    ("Rückmeldung nach den **vier Beobachtungspunkten**", 0),
    ("Legt euch ein **Stichwortblatt** je Themenbereich an", 0),
    ("Notiert die Frage, bei der ihr am unsichersten wart", 0),
])

d.save()
