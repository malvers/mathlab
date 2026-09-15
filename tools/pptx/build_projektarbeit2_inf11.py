#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 28 / KW 14: Projekt Informationsmanagement - Erarbeitung II
(LB 4 "Projekt Informationsmanagement", Ustd. 7-8/14): gegenlesen, ueberarbeiten, sichern,
Abgabe vorbereiten; Feedbackrunde zwischen den Gruppen.

Facts line up with the worksheet HTML/inf11test-projektarbeit2.html (20 Aufgaben). Chapter
pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-projektarbeit2.pptx")

d.title("Informatik — Grundkurs 11", "Vom Entwurf zur Endfassung",
        "Gegenlesen, überarbeiten, sichern, Abgabe vorbereiten")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Gegenlesen", "Fremde Augen finden die Lücken",
          image="img/projektarbeit2-korrektur.jpg",
          credit="Korrigiertes Manuskript — Foto: Phoebe, CC BY-SA 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Example_of_copyedited_manuscript.jpg")

d.bullets("Wo wir stehen", [
    ("Vor den Ferien: Material ausgewertet, **Gliederung** und erste Abschnitte geschrieben", 0),
    ("Heute: **Erarbeitung II** — die Inhalte fertigstellen", 0),
    ("Dazu: gegenseitige Beratung der Teams und eine **Feedbackrunde** zwischen den Gruppen", 0),
    ("Leitfrage der Stunde: Woran erkennt ihr, dass eure Arbeit **fertig** ist?", 0),
])

# Project timeline - the same table in every deck of the series, with this week marked.
d.table_top("Der Fahrplan des Projekts", [
    ["Ustd.", "Phase", "Ergebnis der Phase"],
    ["1–2", "Themenwahl und Planung", "Leitfrage, Projektskizze, Meilensteine"],
    ["3–4", "Recherche", "geordnetes, belegtes Material"],
    ["5–6", "Erarbeitung I", "Gliederung und Rohfassung"],
    ["7–8", "Erarbeitung II", "geprüfte Endfassung"],
    ["9–10", "Präsentation ausarbeiten", "Foliensatz und Generalprobe"],
    ["11–12", "Präsentationen I", "erste Vorträge, Portfolio-Abgabe"],
    ["13–14", "Präsentationen II und Auswertung", "Bewertung und Reflexion"],
], [90, 330, 396], [
    ("Grün: geschafft — Orange: **heute**", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 1): TINT_GREEN, (2, 1): TINT_GREEN, (3, 1): TINT_GREEN,
          (4, 0): TINT_ORANGE, (4, 1): TINT_ORANGE, (4, 2): TINT_ORANGE})

d.bullets("Warum gegenlesen?", [
    ("Zweck: **Fehler und Lücken finden**, solange noch Zeit zum Beheben ist", 0),
    ("Wer selbst geschrieben hat, überliest die eigenen Lücken — fremde Augen finden sie in Minuten", 0),
    ("Am wichtigsten: Ist die Argumentation **ohne Vorwissen** nachvollziehbar?", 0),
    ("Ein **Testleser** gehört nicht zur Gruppe und liest ohne Vorwissen", 0),
    ("Auch fachfremde Leser sind wertvoll — die Betreuung ist keine Testleserin, sie kennt das Projekt", 0),
])

d.table_top("Rückmeldung, die hilft", [
    ["Rückmeldung", "hilft sie?"],
    ["Das ist unklar.", "nein — wo genau, und was fehlt?"],
    ["freundlich und allgemein, gesammelt am Ende", "kaum — der Bezug zur Stelle fehlt"],
    ["Hier fehlt der Bezug zur Leitfrage. Vorschlag: ein Satz zu Teilfrage 2", "ja — konkret, an der Stelle, mit Vorschlag"],
], [476, 340], [
    ("Rückmeldungen **am Text** kommentieren — so bleibt der Bezug erhalten", 0),
    ("Nicht einverstanden? Prüfen, **warum** die Stelle missverstanden wurde, und die Ursache beheben", 0),
], font_size=11, bold_cols=(),
   marks={(1, 1): TINT_RED, (2, 1): TINT_RED, (3, 1): TINT_GREEN})

d.bullets("Feedbackrunde zwischen den Gruppen", [
    ("Zwei Gruppen tauschen ihre Fassungen und lesen **als Testleser**", 0),
    ("Zuerst prüfen: Ist die Leitfrage beantwortet? Ist die Argumentation nachvollziehbar?", 0),
    ("Jede Gruppe gibt zwei, drei **konkrete** Rückmeldungen — an der Stelle, mit Vorschlag", 0),
    ("Rechtschreibung ist der **letzte** Durchgang, nicht der erste", 0),
    ("Ein Vorschlag muss nicht richtig sein — das Missverständnis zeigt aber fast immer eine unklare Stelle", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Überarbeiten und sichern", "Reihenfolge, Lücken, Datensicherheit",
          image="img/projektarbeit2-festplatte.jpg",
          credit="Geöffnete Festplatte — Foto: Mk2010, CC BY 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Hard_disk_drive_platter,_Samsung_MP0402H.jpg")

d.table_top("Die letzten Durchgänge", [
    ["Durchgang", "Ziel"],
    ["1. Inhalt und Aufbau", "Ist die Leitfrage beantwortet? Trägt die Gliederung?"],
    ["2. Sprache", "einheitliche Begriffe, verständliche Sätze"],
    ["3. Format und Rechtschreibung", "Layout, Verweise, Tippfehler"],
], [280, 536], [
    ("Wer früh formatiert, formatiert oft Absätze, die später gestrichen werden", 0),
    ("Jeder Durchgang mit **einem** Ziel ist schneller als alles auf einmal", 0),
    ("**Überarbeiten** verändert Inhalt und Aufbau, **Korrigieren** behebt Fehler — nacheinander", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_BLUE, (3, 0): TINT_GREEN})

d.bullets("Begriffe und Lücken", [
    ("Beim Zusammenführen häufig: **verschiedene Begriffe für dieselbe Sache**", 0),
    ("Leser halten sie für verschiedene Dinge — eine **Begriffsliste** im Team beugt vor", 0),
    ("Kurz vor Schluss fehlt ein Ergebnis? Die **Lücke benennen und begründen**", 0),
    ("Geschätzte Zahlen als Ergebnis auszugeben ist **Täuschung**", 0),
    ("Einfach weglassen macht die Argumentation löchrig", 0),
])

d.bullets("Datensicherheit im Projekt", [
    ("Ein Verlust kurz vor der Abgabe ist **kaum aufholbar** — der Zeitpunkt macht den Schaden groß", 0),
    ("Eine **zweite Kopie an einem anderen Ort** schützt gegen Gerätedefekt", 0),
    ("Die **Versionsgeschichte** schützt gegen Fehlbedienung", 0),
    ("Interviewaufnahmen und Umfragedaten nur für die Gruppe zugänglich ablegen", 0),
    ("Fünf Minuten Vorsorge sparen den Ernstfall — Lernbereich 3 lässt grüßen", 0),
])

d.bullets("Reproduzierbar arbeiten", [
    ("Das Vorgehen so genau beschreiben, dass **jemand anders es wiederholen** könnte", 0),
    ("Wer befragt wurde, wann und wie, gehört in die Arbeit", 0),
    ("**Anhang**: Fragebögen, Leitfäden, Rohtabellen — zum Nachprüfen, ohne den Lesefluss zu stören", 0),
    ("Alles Wesentliche steht im Haupttext", 0),
    ("Das Quellenverzeichnis ist ein eigener Teil, kein Anhang", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Abgabe vorbereiten", "Checkliste, Format, Eigenständigkeit",
          image="img/projektarbeit2-unterschrift.jpg",
          credit="Vertrag und Füller — Foto: Blogtrepreneur, CC BY 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Legal_Contract_%26_Signature_-_Warm_Tones.jpg")

d.table_top("Die Abgabecheckliste", [
    ["Punkt", "geprüft wird"],
    ["Vollständigkeit", "alle Teile da, die Leitfrage ist beantwortet"],
    ["Quellen", "Abgleich in beide Richtungen: jeder Verweis im Verzeichnis, jeder Eintrag im Text"],
    ["Abbildungen", "Auflösung, Verweis im Text, Unterschrift und Quelle"],
    ["Format", "das geforderte Format erzeugen und die Datei selbst öffnen"],
    ["Dateiname", "nennt Gruppe und Thema"],
], [180, 636], [
    ("Die Liste wird einmal erstellt und abgehakt — am Abgabetag ist keine Zeit zum Nachdenken", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Der letzte Tag vor der Abgabe", [
    ("Am letzten Tag wird **nur noch geprüft und formatiert** — nichts Neues geschrieben", 0),
    ("Neues am letzten Tag ist ungeprüft", 0),
    ("Beim Export gehen Umbrüche und Schriften gern verloren — die erzeugte Datei öffnen", 0),
    ("Eine Abbildung ohne Verweis im Text ist Dekoration", 0),
    ("Wer so plant, gibt ruhiger ab", 0),
])

d.bullets("Die Eigenständigkeitserklärung", [
    ("Die Versicherung, die Arbeit **selbst und mit den angegebenen Hilfsmitteln** erstellt zu haben", 0),
    ("Sie bezieht sich auf die eigene Leistung — nicht auf Einzelarbeit", 0),
    ("Sie wird unterschrieben und ist **verbindlich**", 0),
    ("**KI-Werkzeuge** offenlegen: wofür sie eingesetzt wurden", 0),
    ("Die fachliche Verantwortung bleibt bei euch — erfundene Angaben gehen zu Lasten der Gruppe", 0),
])

d.bullets("Wann ist die Arbeit fertig?", [
    ("Nicht, wenn die Seitenzahl erreicht oder die Zeit abgelaufen ist", 0),
    ("Nicht jede gefundene Quelle muss vorkommen", 0),
    ("Fertig ist sie, wenn die **Leitfrage beantwortet** ist ...", 0),
    ("... und **jede Aussage** belegt oder als Einschätzung gekennzeichnet ist", 0),
])

d.merksatz("Fertig ist eine Arbeit, wenn die Leitfrage beantwortet und jede Aussage belegt oder als "
           "Einschätzung gekennzeichnet ist — erst Inhalt, dann Sprache, zuletzt Format.")

d.bullets("Fun Facts", [
    ("**Toy Story 2** wurde 1998 bei Pixar fast von einem falschen Löschbefehl vernichtet — gerettet hat ihn eine Kopie im Homeoffice einer Mitarbeiterin", 0),
    ("Die **3-2-1-Regel** der Datensicherung: drei Kopien, auf zwei verschiedenen Medien, eine davon außer Haus", 0),
    ("Korrekturzeichen sind in Deutschland genormt: **DIN 16511**", 0),
    ("Bei heutigen Festplatten schwebt der Lesekopf nur **wenige Nanometer** über der Scheibe — ein Staubkorn ist um ein Vielfaches größer", 0),
])

d.bullets("Checkliste Erarbeitung II", [
    ("Die Inhalte stehen, die **Leitfrage ist beantwortet**", 0),
    ("Eine Nachbargruppe hat gelesen, die **Rückmeldungen** sind eingearbeitet", 0),
    ("**Begriffe** sind einheitlich, **Quellen** in beide Richtungen abgeglichen", 0),
    ("Die Endfassung liegt an **zwei Orten**, mit Versionsgeschichte", 0),
    ("**Eigenständigkeitserklärung** unterschrieben, KI-Einsatz offengelegt", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Fertigstellen**: fehlende Abschnitte schreiben, dann überarbeiten — Inhalt vor Sprache vor Format", 0),
    ("**Feedbackrunde**: Fassung mit einer Nachbargruppe tauschen, zwei, drei konkrete Rückmeldungen geben", 0),
    ("**Sichern**: die Endfassung an einem zweiten Ort ablegen", 0),
    ("**Abgabecheckliste** anlegen und ins Portfolio legen", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
