#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 13 / KW 48: Anwendung und Abschluss LB 1 -
Modellierung eines Modellunternehmens (LB 1, Ustd. 21-22/22)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("modellunternehmen-komplexuebung.pptx")

d.title("Informatik — Grundkurs 12", "Alles zusammen",
        "Komplexübung: ein Geschäftsprozess, ein Projekt, ein Objektmodell")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Das Modellunternehmen", "Der Fall, an dem alles hängt")

d.table_top("Die Fahrradwerkstatt „Kette und Co.“", [
    ["Angabe", "Beschreibung"],
    ["Geschäft", "Reparatur und Verkauf gebrauchter Fahrräder"],
    ["Mitarbeitende", "zwei Mechaniker, eine Person im Verkauf, die Inhaberin"],
    ["Problem", "Aufträge stehen auf Zetteln, Termine werden vergessen"],
    ["Wunsch", "eine kleine Software für Auftragsannahme und Terminübersicht"],
    ["Ihr seid", "das Team, das den Ist-Zustand aufnimmt und den Soll-Zustand plant"],
], [180, 636], [
    ("Der Fall ist klein genug für zwei Stunden — und groß genug für alle Werkzeuge aus LB 1", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Der Ablauf heute, wie er in der Werkstatt läuft", [
    ("Kunde kommt mit Rad, beschreibt das Problem", 0),
    ("Mechaniker schaut es an und schätzt Aufwand und Preis", 0),
    ("Kunde stimmt zu oder nicht", 0),
    ("Bei Zustimmung: Zettel an den Lenker, Rad in die Reihe", 0),
    ("Nach der Reparatur ruft jemand an — wenn die Nummer lesbar ist", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die Aufgabe", "Vier Teile, alle aus LB 1")

d.table_top("Was ihr abgebt", [
    ["Teil", "Inhalt", "Werkzeug"],
    ["1. Ist-Prozess", "Auftragsannahme bis Abholung", "eEPK oder BPMN"],
    ["2. Soll-Prozess", "derselbe Ablauf mit Software", "dieselbe Notation"],
    ["3. Projektplan", "Arbeitspakete, Netzplan, kritischer Pfad", "Tabelle und Netzplan"],
    ["4. Objektmodell", "die Klassen der künftigen Software", "Klassendiagramm"],
], [180, 380, 256], [
    ("Dazu ein **Steckbrief** je Prozess und eine Liste eurer **Annahmen**", 0),
    ("Die **Differenz** zwischen Teil 1 und Teil 2 ist der Umfang eures Projekts", 0),
], font_size=11, bold_cols=(0,), marks={(2, 0): TINT_GREEN})

d.bullets("Worauf es beim Soll-Prozess ankommt", [
    ("Nicht **alles** automatisieren — nur, was die genannten Probleme löst", 0),
    ("Zwei Probleme sind genannt: **verlorene Zettel** und **vergessene Termine**", 0),
    ("Alles, was darüber hinausgeht, gehört in eine Liste **„später vielleicht“**", 0),
    ("Sonst wächst der Umfang, und aus zwei Stunden wird ein Jahresprojekt", 0),
    ("Das ist genau der Grundsatz **Relevanz** aus der Modellierung", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Bewertung und Abschluss", "Woran euer Ergebnis gemessen wird")

d.table_top("Die Prüfliste", [
    ["Kriterium", "erfüllt, wenn"],
    ["formal korrekt", "Notation eingehalten, Konnektoren passen zusammen"],
    ["vollständig", "Auslöser, Ergebnis, Rollen und Schnittstellen benannt"],
    ["begründet", "Annahmen aufgeschrieben, Umfang abgegrenzt"],
    ["konsistent", "Objektmodell passt zu den Daten aus dem Prozess"],
    ["rechnerisch richtig", "Netzplan stimmt, kritischer Pfad korrekt bestimmt"],
], [200, 616], [
    ("Die letzte Zeile ist die einzige, bei der es **eine** richtige Antwort gibt", 0),
    ("Bei allen anderen zählt die **Begründung**, nicht die Übereinstimmung mit einer Musterlösung", 0),
], font_size=11.5, bold_cols=(0,), marks={(5, 0): TINT_BLUE})

d.bullets("Das Lernplakat vervollständigen", [
    ("Ein Feld je Werkzeug: **Modellbegriff**, **eEPK**, **BPMN**, **Netzplan**, **Klassendiagramm**", 0),
    ("Je Feld: **wofür**, **Kernregeln**, **ein Mini-Beispiel**", 0),
    ("Dazu die drei **Modelleigenschaften** und die **Grundsätze** in einer Ecke", 0),
    ("Das Plakat ist eure Zusammenfassung für die Klausur", 0),
    ("Fotografiert es am Ende — dann hat jeder es auf dem Handy", 0),
])

d.merksatz("Der Umfang eines Projekts ist die Differenz zwischen Ist-Prozess "
           "und Soll-Prozess. Wer die nicht aufschreibt, streitet später darüber.")

d.bullets("Fun Facts: Modellunternehmen", [
    ("Übungsfirmen sind in der kaufmännischen Ausbildung seit Jahrzehnten Standard", 0),
    ("**SAP** liefert mit „Global Bike“ ein komplettes fiktives Unternehmen für den Unterricht", 0),
    ("Viele Referenzmodelle beschreiben Branchen so genau, dass Firmen sie direkt übernehmen", 0),
    ("Das spart Zeit — und führt dazu, dass sich Unternehmen einer Branche **immer ähnlicher** werden", 0),
    ("Ein Grund, warum Prozessmodelle auch strategische Entscheidungen sind", 0),
])

d.bullets("Eure Aufgabe: die Komplexübung", [
    ("Team zu dritt, zwei Stunden Zeit, vier Teile", 0),
    ("**Ist- und Soll-Prozess** in derselben Notation, damit man sie vergleichen kann", 0),
    ("**Projektplan** mit mindestens sechs Arbeitspaketen und kritischem Pfad", 0),
    ("**Klassendiagramm** mit drei bis fünf Klassen", 0),
    ("Am Ende: **Lernplakat** vervollständigen und fotografieren", 0),
])

d.save()
