#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 4 / KW 37: Aufbau von Datenbanksystemen -
DBMS und Datenbasis als Einheit (LB 1, Ustd. 3/13, eine Einzelstunde)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("datenbanksystem-aufbau.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — Klasse 9", "Was ist ein Datenbanksystem?",
        "Zwei Teile, die zusammen arbeiten: die Daten und das Programm dazu")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Überall Datenbanken", "Ihr benutzt jeden Tag ein paar Dutzend")

d.table_top("Wo Daten liegen, die euch betreffen", [
    ["Wo?", "Was steht darin?"],
    ["Schulverwaltung", "Namen, Klassen, Noten, Fehlzeiten"],
    ["Bibliothek", "Bücher, Signaturen, wer was ausgeliehen hat"],
    ["Online-Shop", "Artikel, Preise, Bestellungen, Adressen"],
    ["Musik-App", "Titel, Alben, eure Playlists"],
    ["Fahrplan-App", "Haltestellen, Linien, Abfahrtszeiten"],
], [230, 586], [
    ("Alle fünf haben dasselbe Problem: **viele** Daten, die **schnell** gefunden werden müssen", 0),
    ("Und alle fünf lösen es auf dieselbe Art — mit einem **Datenbanksystem**", 0),
], font_size=12, bold_cols=(0,))

d.bullets("Warum nicht einfach eine Liste schreiben?", [
    ("Eine Liste mit **50 000 Büchern** durchsuchen: der Rechner müsste alles durchlesen", 0),
    ("Zwei Leute wollen gleichzeitig etwas ändern — wer gewinnt?", 0),
    ("Jemand tippt in ein Datumsfeld **„morgen“** — die Liste merkt es nicht", 0),
    ("Die Datei geht kaputt, und alles ist weg", 0),
    ("Für genau diese vier Probleme gibt es das **Datenbanksystem**", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die zwei Teile", "Datenbasis und DBMS")

dia = pap(P("pap-dbsystem-info9.png"), 1560, 420, {
    "u": dict(pos=(210, 130), w=330, h=130, kind="io",
              text="Nutzer oder Programm"),
    "m": dict(pos=(760, 130), w=380, h=130, kind="proc",
              text="DBMS: das Verwaltungsprogramm"),
    "b": dict(pos=(1330, 130), w=330, h=130, kind="proc",
              text="Datenbasis: die Daten selbst"),
}, [
    ("u", "m", "Frage"),
    ("m", "b", "sucht"),
    ("b", "m", "findet", [(1330, 290), (760, 290)]),
    ("m", "u", "Antwort", [(560, 350), (210, 350)]),
], notes=[("DBMS + Datenbasis = Datenbanksystem", (900, 380))], size=30)
d.picture("Wer redet hier mit wem?", dia, [
    ("Ihr redet **nie** direkt mit den Daten — immer über das **DBMS**", 0),
    ("Das ist der ganze Trick: ein Programm passt auf die Daten auf", 0),
], width=816)

d.table_top("Wer macht was?", [
    ["Teil", "ist", "Beispiel"],
    ["Datenbasis", "die gespeicherten Daten selbst", "alle Bücher der Bibliothek"],
    ["DBMS", "das Programm, das sie verwaltet", "LibreOffice Base, MySQL"],
    ["Datenbanksystem", "beides zusammen", "die Bibliotheks-Software"],
], [220, 320, 276], [
    ("**DBMS** ist die Abkürzung für **D**aten**b**ank**m**anagement**s**ystem", 0),
    ("Merkt euch die Rechnung: **Datenbasis + DBMS = Datenbanksystem**", 0),
], font_size=12, bold_cols=(0,),
   marks={(3, 0): TINT_GREEN, (3, 1): TINT_GREEN, (3, 2): TINT_GREEN})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Was das DBMS erledigt", "Sechs Aufgaben, die euch Arbeit abnehmen")

d.table_top("Die Aufgaben eines DBMS", [
    ["Aufgabe", "heißt konkret"],
    ["Speichern", "Daten ordentlich ablegen, damit man sie wiederfindet"],
    ["Suchen", "in Sekundenbruchteilen den richtigen Datensatz holen"],
    ["Ändern", "eintragen, überschreiben, löschen"],
    ["Aufpassen", "in ein Datumsfeld darf kein Wort - das DBMS lehnt es ab"],
    ["Rechte vergeben", "wer darf lesen, wer darf ändern?"],
    ["Sichern", "regelmäßige Kopie, damit nichts verloren geht"],
], [230, 586], [
    ("Ohne DBMS müsste **jedes** Programm all das selbst können — jedes Mal neu", 0),
], font_size=11.5, bold_cols=(0,))

d.bullets("Das Wichtigste an der Trennung", [
    ("Die Daten liegen an **einer** Stelle, nicht in zehn Dateien verstreut", 0),
    ("Viele dürfen **gleichzeitig** arbeiten, das DBMS regelt die Reihenfolge", 0),
    ("Wer keine Rechte hat, kommt **nicht** an die Daten", 0),
    ("Ein neues Programm braucht die Daten nicht zu kopieren — es fragt einfach", 0),
    ("Und wenn ein Rechner ausfällt, ist die **Sicherung** da", 0),
])

d.merksatz("Ein Datenbanksystem besteht aus zwei Teilen: der Datenbasis mit den Daten "
           "und dem DBMS, das sie verwaltet. Zusammen ergibt das ein Datenbanksystem.")

d.bullets("Fun Facts: Datenbanken", [
    ("**Edgar F. Codd** erfand 1970 bei IBM die Idee, Daten in **Tabellen** zu ordnen — "
     "so arbeiten fast alle Datenbanken bis heute", 0),
    ("Die Bibliothek von **Alexandria** hatte vor über 2000 Jahren schon einen Katalog — "
     "eine Datenbank auf Schriftrollen", 0),
    ("Wenn ihr euch irgendwo anmeldet, sucht eine Datenbank euren Namen in **Millisekunden** "
     "unter Millionen anderer", 0),
    ("**LibreOffice Base** ist ein DBMS, das ihr kostenlos benutzen dürft — genau wie die Profis", 0),
    ("Das Wort **Datenbank** gibt es erst seit den **1960er Jahren** — vorher hieß es Kartei", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("Öffnet die **Beispiel-Datenbank** in LibreOffice Base", 0),
    ("Findet heraus: **Wie viele Tabellen** gibt es, und wie heißen sie?", 0),
    ("Sucht euch **eine** Tabelle aus und zählt die Datensätze darin", 0),
    ("Schreibt auf: **Was gehört zur Datenbasis, was macht das DBMS?**", 0),
    ("Zum Schluss: nennt **ein** Beispiel aus eurem Alltag und sagt, welche Daten dort liegen", 0),
])

d.save()
