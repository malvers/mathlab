#!/usr/bin/env python3
"""Abschluss LB 1: eigene Mini-Datenbank komplett (FOS 12, Woche 9)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from er_diagrams import schema_diagram, ORA, RD, GRN, NAVY

d = Deck("mini-datenbank.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — FOS 12", "Die eigene Mini-Datenbank",
        "Abschluss Lernbereich 1: vom Realweltausschnitt zur Auswertung — in einer Woche")

d.chapter(1, "Der Auftrag", "Alles aus sieben Wochen in einem Projekt")

d.bullets("Was ihr baut", [
    ("Einen **Realweltausschnitt** eurer Wahl: Praktikum, Verein, Nebenjob, Sammlung, Turnier …", 0),
    ("Mindestens **drei Entitätstypen**, eine **n:m-Beziehung**, je Tabelle **fünf Datensätze**", 0),
    ("Die komplette Kette: **Beschreibung → ER-Modell → Tabellen → SQLite → Abfragen**", 0),
    ("Am Ende: **Peer-Review** — ihr prüft das Modell eines anderen Teams", 0),
    ("Teams zu **zweit**, Abgabe als schule-ähnliche **.db-Datei** plus ein Blatt Doku", 0),
])

d.table_top("Die fünf Schritte und ihre Ergebnisse", [
    ["Schritt", "Was ihr tut", "Ergebnis", "Aus Woche"],
    ["1 Beschreiben", "Ausschnitt in fünf bis acht Sätzen", "Auftragstext", "6"],
    ["2 Modellieren", "Entitäten, Attribute, Beziehungen, Kardinalitäten", "ER-Diagramm (Papier/Tool)", "6"],
    ["3 Überführen", "drei Regeln anwenden, Schlüssel markieren", "Tabellenschema mit PK/FK", "7"],
    ["4 Prüfen", "1NF, 2NF, 3NF durchgehen", "Häkchen je Normalform", "8"],
    ["5 Bauen + Fragen", "CREATE TABLE, INSERT, fünf SELECTs", "projekt.db + Abfrageblatt", "4, 5"],
], [130, 300, 250, 136], [
    ("Reihenfolge einhalten: wer bei **Schritt 5** anfängt, baut die Kursliste von Woche 3", 0),
    ("Jeder Schritt hat ein **Artefakt** — das ist eure Doku, nichts extra schreiben", 0),
], font_size=11, bold_cols=(0,))

d.chapter(2, "Anforderungen", "Woran die Datenbank gemessen wird")

d.two_cols("Pflicht und Kür", [
    ("Pflicht", 0),
    ("**ER-Diagramm** mit Kardinalitäten und Schlüsseln", 1),
    ("Tabellen in **3NF**, Fremdschlüssel mit REFERENCES", 1),
    ("**PRAGMA foreign_keys = ON** und ein provozierter Fehler", 1),
    ("**Fünf Abfragen**: WHERE, ORDER BY, COUNT/GROUP BY, ein JOIN, eine freie", 1),
], [
    ("Kür", 0),
    ("**Beziehungsattribut** an einer n:m-Beziehung", 1),
    ("**CHECK**-Regeln für Wertebereiche", 1),
    ("Abfrage über **drei Tabellen**", 1),
    ("Ein **Diagramm** aus einer GROUP-BY-Abfrage", 1),
])

d.code("Beispiel: fünf Abfragen an ein Turnier-Modell", [
    "-- 1 WHERE:     alle Spieler eines Vereins",
    "SELECT Name FROM Spieler WHERE Verein = 'SV Blau-Weiß';",
    "-- 2 ORDER BY:  Spiele nach Datum, neueste zuerst",
    "SELECT * FROM Spiel ORDER BY Datum DESC;",
    "-- 3 GROUP BY:  wie viele Spiele pro Ort?",
    "SELECT Ort, COUNT(*) AS Anzahl FROM Spiel GROUP BY Ort;",
    "-- 4 JOIN:      wer hat in welchem Spiel gespielt?",
    "SELECT s.Name, p.Datum FROM Spieler s",
    "JOIN   Einsatz e ON e.SNr = s.SNr",
    "JOIN   Spiel   p ON p.PNr = e.PNr;",
    "-- 5 frei:      Spieler mit den meisten Einsätzen",
    "SELECT s.Name, COUNT(*) AS Einsaetze FROM Spieler s JOIN Einsatz e ON e.SNr = s.SNr",
    "GROUP BY s.SNr ORDER BY Einsaetze DESC LIMIT 3;",
])

schema = schema_diagram(P("schema-turnier.png"), [
    ("SPIELER", [("SNr", "PK"), ("Name", ""), ("Verein", "")], ORA),
    ("EINSATZ", [("SNr", "FK"), ("PNr", "FK"), ("Tore", "")], RD),
    ("SPIEL", [("PNr", "PK"), ("Datum", ""), ("Ort", "")], GRN),
], Hd=400, caption="Beispielmodell Turnier: n:m mit Beziehungsattribut Tore")
d.picture("So könnte ein fertiges Schema aussehen", schema, [
    ("Drei Tabellen reichen für die **Pflicht** — die Kür steckt in Tore und CHECK (Tore >= 0)", 0),
    ("Euer Thema darf **anders** sein: Hauptsache drei Entitäten und eine echte n:m-Beziehung", 0),
], width=700)

d.chapter(3, "Peer-Review", "Ein fremdes Modell prüfen — mit Checkliste, nicht mit Gefühl")

d.table_top("Checkliste für das Review", [
    ["Nr.", "Prüfpunkt", "ja/nein", "Bemerkung"],
    ["1", "Jeder Entitätstyp hat einen Primärschlüssel", "", ""],
    ["2", "Jede Beziehung hat eine begründete Kardinalität", "", ""],
    ["3", "n:m-Beziehungen sind eigene Tabellen mit zwei Fremdschlüsseln", "", ""],
    ["4", "Keine Liste in einer Zelle (1NF), keine Teil- oder Kettenabhängigkeit (2NF/3NF)", "", ""],
    ["5", "Die fünf Abfragen laufen und liefern das, was die Frage verlangt", "", ""],
    ["6", "Ein Fremdschlüssel-Fehler wird vom DBMS abgewiesen", "", ""],
], [40, 480, 70, 226], [
    ("**Zwei Teams** tauschen .db-Datei und Diagramm — 20 Minuten prüfen, 5 Minuten Rückmeldung", 0),
    ("Rückmeldung nach dem Muster: **Was ist gut? Was fehlt? Ein konkreter Vorschlag.**", 0),
], font_size=11, bold_cols=(0,), align=["c", "l", "c", "l"])

d.bullets("Zeitplan der Woche", [
    ("**Stunde 1**: Thema wählen, Auftragstext schreiben, ER-Diagramm zeichnen (Schritte 1 und 2)", 0),
    ("**Hausaufgabe**: Überführung und Normalform-Check auf Papier (Schritte 3 und 4)", 0),
    ("**Stunde 2**: Tabellen in SQLite anlegen, Daten eintragen, fünf Abfragen (Schritt 5)", 0),
    ("**Letzte 25 Minuten**: Peer-Review und Rückmeldung", 0),
    ("**Abgabe**: projekt.db, ER-Diagramm als Foto, Abfrageblatt — bis Freitag im Teams-Kanal", 0),
])

d.merksatz("Beschreiben, modellieren, überführen, prüfen, bauen — in dieser Reihenfolge, nie andersherum.")

d.bullets("Ausblick: Klausur 1 in zwei Wochen", [
    ("Themen: **DBMS-Bedienung** (SQL), **ER-Modell**, **Normalisierung** — genau die fünf Schritte", 0),
    ("Typische Aufgabe: Text → ER-Diagramm → Tabellen → zwei SQL-Abfragen", 0),
    ("Übungsmaterial: eure eigene Mini-Datenbank und die Pizzeria-Aufgaben", 0),
    ("Fragen sammeln — Wiederholungsstunde vor der Klausur", 0),
])

d.save()
