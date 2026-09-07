#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 9 / KW 44: Dokumentation eines Prozessmodells
(LB 1, Ustd. 13-14/22)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("prozessmodell-dokumentation.pptx")

d.title("Informatik — Grundkurs 12", "Ein Modell, das andere lesen können",
        "Annahmen, Rollen, Schnittstellen — und der Peer-Review")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Das Diagramm allein genügt nicht", "Was drumherum gehört")

d.table_top("Die Bestandteile einer Prozessdokumentation", [
    ["Teil", "beantwortet"],
    ["Steckbrief", "Name, Ziel, Auslöser, Ergebnis, Verantwortlicher"],
    ["Geltungsbereich", "Was gehört dazu, was nicht?"],
    ["Diagramm", "Wie läuft es ab?"],
    ["Rollen", "Wer tut was — und wer entscheidet?"],
    ["Schnittstellen", "Welche Systeme und welche Daten sind beteiligt?"],
    ["Annahmen", "Was haben wir vorausgesetzt, ohne es zu prüfen?"],
    ["Stand", "Wer hat es wann erhoben, wer hat es bestätigt?"],
], [180, 636], [
    ("Der **Steckbrief** ist eine halbe Seite und beantwortet 80 % aller Rückfragen", 0),
    ("Der Abschnitt **Annahmen** ist der, den alle weglassen — und der später am meisten kostet", 0),
], font_size=11, bold_cols=(0,), marks={(6, 0): TINT_ORANGE})

d.bullets("Warum Annahmen aufgeschrieben werden", [
    ("„Wir gehen davon aus, dass jede Bestellung **einen** Kunden hat“", 0),
    ("„Wir nehmen an, dass die Prüfung **immer** am selben Tag erfolgt“", 0),
    ("Solche Sätze sind beim Modellieren **unvermeidlich** — man kann nicht alles erheben", 0),
    ("Steht die Annahme nicht da, hält sie später jemand für eine **Tatsache**", 0),
    ("Und wenn sie falsch ist, weiß niemand, **welcher Teil** des Modells davon abhängt", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Rollen und Schnittstellen", "Die zwei Tabellen, die immer gebraucht werden")

d.table_top("Rollentabelle nach dem RACI-Muster", [
    ["Tätigkeit", "führt aus", "entscheidet", "wird informiert"],
    ["Bestellung prüfen", "Vertrieb", "Vertriebsleitung", "Kunde"],
    ["Ware versenden", "Lager", "Lagerleitung", "Vertrieb"],
    ["Rechnung stellen", "Buchhaltung", "Buchhaltung", "Kunde"],
], [230, 200, 200, 186], [
    ("**RACI** steht für responsible, accountable, consulted, informed", 0),
    ("Die wichtigste Spalte ist **entscheidet** — dort darf genau **ein** Name stehen", 0),
], font_size=11, bold_cols=(0,), marks={(r, 2): TINT_ORANGE for r in range(1, 4)})

d.table_top("Schnittstellentabelle", [
    ["An dieser Stelle", "System", "Daten", "Richtung"],
    ["Bestellung erfassen", "Shop-System", "Bestelldaten", "hinein"],
    ["Bestand prüfen", "Lagerverwaltung", "Bestandsmenge", "heraus"],
    ["Rechnung stellen", "Buchhaltung", "Rechnungsdaten", "hinein"],
], [230, 220, 200, 166], [
    ("Diese Tabelle ist die Brücke zwischen **Prozessmodell** und **Datenmodell**", 0),
    ("Was hier als Datum auftaucht, muss es später in der Datenbank geben", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Der Peer-Review", "Fremde Augen, feste Kriterien")

d.table_top("Die Prüfliste für den Review", [
    ["Kriterium", "Frage"],
    ["Vollständig", "Sind Auslöser, Ergebnis und alle Rollen benannt?"],
    ["Formal korrekt", "Stimmen Wechsel, Konnektoren, Anfang und Ende?"],
    ["Verständlich", "Versteht es jemand ohne mündliche Erklärung?"],
    ["Relevant", "Steht Überflüssiges drin, das den Blick verstellt?"],
    ["Nachvollziehbar", "Stehen die Annahmen da, auf denen es beruht?"],
], [200, 616], [
    ("Der Review prüft das **Modell**, nicht die Person — Rückmeldungen sachlich formulieren", 0),
    ("Zu jeder Kritik gehört die **Stelle** im Modell, sonst kann niemand etwas damit anfangen", 0),
], font_size=11.5, bold_cols=(0,))

d.bullets("So läuft der Review ab", [
    ("Zwei Paare tauschen ihre Dokumentationen — **ohne** mündliche Einführung", 0),
    ("Zehn Minuten lesen und nach der Prüfliste **schriftlich** notieren", 0),
    ("Danach fünf Minuten Rückfragen: **erst** Verständnisfragen, dann Kritik", 0),
    ("Das prüfende Paar nennt **eine** Stärke und **zwei** konkrete Verbesserungen", 0),
    ("Das geprüfte Paar entscheidet, was es übernimmt — und schreibt es dazu", 0),
])

d.merksatz("Ein Prozessmodell ohne Annahmen und Rollen ist ein hübsches Bild. "
           "Erst die Dokumentation macht daraus ein Arbeitsmittel.")

d.bullets("Fun Facts: Dokumentation", [
    ("Die **RACI-Matrix** stammt aus dem Projektmanagement der 1970er Jahre", 0),
    ("Die Regel „genau ein **A** je Zeile“ ist ihr eigentlicher Nutzen — sonst entscheidet niemand", 0),
    ("Prozessdokumentationen sind in vielen Branchen **vorgeschrieben** — etwa in Medizintechnik und Luftfahrt", 0),
    ("Bei Zertifizierungen nach **ISO 9001** wird genau diese Dokumentation geprüft", 0),
    ("Und der häufigste Prüfbefund lautet: **das Dokumentierte entspricht nicht dem Gelebten**", 0),
])

d.bullets("Eure Aufgabe", [
    ("Ergänzt euer Modell um **Steckbrief**, **Rollentabelle** und **Schnittstellentabelle**", 0),
    ("Schreibt mindestens **drei Annahmen** auf, die ihr getroffen habt", 0),
    ("**Peer-Review** mit dem Nachbarpaar nach der Prüfliste", 0),
    ("Notiert je eine Stärke und zwei konkrete Verbesserungen — mit **Stellenangabe**", 0),
    ("Überarbeitet euer Modell und haltet fest, **was ihr übernommen habt und was nicht**", 0),
])

d.save()
