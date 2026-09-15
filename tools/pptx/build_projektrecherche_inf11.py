#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 26 / KW 11: Projekt Informationsmanagement - Recherche und
Informationsbeschaffung (LB 4 "Projekt Informationsmanagement", Ustd. 3-4/14).

Facts line up with the worksheet HTML/inf11test-projektrecherche.html (20 Aufgaben). Chapter
pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-projektrecherche.pptx")

d.title("Informatik — Grundkurs 11", "Recherche im Projekt",
        "Teilfragen, Interview und Umfrage, Exzerpieren, Quellen verwalten")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Von der Leitfrage zur Suche", "Teilfragen, Suchbegriffe, Protokoll",
          image="img/projektrecherche-lupe.jpg",
          credit="Lupe auf einem Buch — Foto: João Silas, gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Magnfying_glass_book_globe.jpg")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: Thema gewählt, **Leitfrage** formuliert, Meilensteine und Zuständigkeiten festgelegt", 0),
    ("Heute beginnt die **Recherche** — mit den Methoden aus Lernbereich 2", 0),
    ("Suchen, Quellen bewerten, zitieren: Das kennt ihr schon — jetzt im Team und für eure Frage", 0),
    ("Leitfrage der Stunde: Wie wird aus einer Leitfrage **geordnetes, belegtes Material**?", 0),
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
   marks={(1, 1): TINT_GREEN, (2, 0): TINT_ORANGE, (2, 1): TINT_ORANGE, (2, 2): TINT_ORANGE})

d.bullets("Erst zerlegen, dann suchen", [
    ("Die Recherche beginnt nicht mit der Suchmaschine, sondern mit **Teilfragen**", 0),
    ("Teilfragen liefern die Suchbegriffe — sonst sucht man nach dem Thema statt nach der Antwort", 0),
    ("Beispiel: Wie verändert die automatische Notenerfassung die Arbeit im Sekretariat?", 0),
    ("Teilfragen: Wie lief es vorher? Was macht das System? Was sagen die Beteiligten?", 1),
    ("Die Quellenliste entsteht **während** der Recherche, nicht davor", 0),
])

d.two_cols("Zwei Suchstrategien", [
    ("**Suchbegriffe variieren**", 0),
    ("Fachbereiche nutzen verschiedene Wörter für dasselbe", 1),
    ("Datenpanne, Datenschutzverletzung, Data Breach", 1),
    ("jeder Begriff öffnet ein anderes Fenster", 1),
    ("die englische Form lohnt fast immer", 1),
], [
    ("**Schneeballsystem**", 0),
    ("im Literaturverzeichnis einer guten Quelle weitere Quellen finden", 1),
    ("rückwärts: ältere Arbeiten", 1),
    ("vorwärts: neuere Arbeiten", 1),
    ("oft schneller als jede Suchmaschine", 1),
])

d.table_top("Das Rechercheprotokoll", [
    ["Wo gesucht", "mit welchen Begriffen", "was dabei herauskam"],
    ["Suchmaschine", "Notenerfassung Schule Sekretariat", "viel Werbung, zwei brauchbare Berichte"],
    ["Bibliothekskatalog", "Schulverwaltung Digitalisierung", "ein Buch, Kapitel 3 passt"],
    ["Verzeichnis von Quelle 2", "Schneeball rückwärts", "drei ältere Studien"],
    ["Suchmaschine", "school administration software", "ein englischer Überblick"],
], [190, 290, 336], [
    ("Das Protokoll verhindert doppelte Suchen und zeigt, welche Wege noch offen sind", 0),
    ("Der Browserverlauf ist kein Protokoll: Er zeigt Klicks, nicht die **Strategie**", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Selbst erheben", "Interview und Umfrage",
          image="img/projektrecherche-diktiergeraet.jpg",
          credit="Diktiergerät Minifon, um 1960 — Foto: Mkratz, CC BY 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Protona_Minifon_Attach%C3%A9_Front.jpg")

d.bullets("Wann ein Interview lohnt", [
    ("Fakten stehen meist schon irgendwo — **Erfahrung und Einschätzung** oft nicht", 0),
    ("Ein Experteninterview lohnt, wenn die Frage genau danach verlangt", 0),
    ("Es ersetzt **keine** Literaturrecherche", 0),
    ("Vorbereitung: ein **Leitfaden** mit offenen Fragen", 0),
    ("Aufzeichnen nur mit **ausdrücklicher Zustimmung** — das vorher klären", 0),
])

d.table_top("Offene gegen geschlossene Fragen", [
    ["Frage im Interview", "Art", "was sie bringt"],
    ["Finden Sie das neue System gut?", "Ja-Nein", "beendet das Gespräch"],
    ["Ist das neue System besser als das alte?", "Ja-Nein", "lädt nur zum Bestätigen ein"],
    ["Nutzen Sie das neue System täglich?", "Ja-Nein", "eine Zahl — die geht auch anders"],
    ["Wie hat sich Ihre Arbeit durch das System verändert?", "offen", "lädt zum Erzählen ein"],
], [406, 110, 300], [
    ("Offene Fragen bringen mehr als geschlossene", 0),
    ("Wer nur Bestätigung sucht, forscht nicht", 0),
], font_size=11, bold_cols=(),
   marks={(1, 1): TINT_RED, (2, 1): TINT_RED, (3, 1): TINT_RED, (4, 1): TINT_GREEN})

d.two_cols("Umfrage in der Schule", [
    ("**Datenschutz**", 0),
    ("Teilnahme ist **freiwillig**", 1),
    ("den **Zweck** vorher angeben", 1),
    ("möglichst **anonym** erheben", 1),
    ("ohne Namen entsteht gar kein Personenbezug", 1),
], [
    ("**Kleine Stichprobe**", 0),
    ("bei zehn Befragten ist eine Person zehn Prozent", 1),
    ("einzelne Antworten verschieben das Ergebnis stark", 1),
    ("Prozente täuschen Genauigkeit vor", 1),
    ("besser absolute Zahlen: 7 von 10", 1),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Material sichern", "Exzerpieren, belegen, Quellen verwalten",
          image="img/projektrecherche-textmarker.jpg",
          credit="Textmarker auf einer Kopie — Foto: Guido Alvarez, CC BY 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Highlighter_pen_-photocopied_text-9Mar2009.jpg")

d.bullets("Exzerpieren ohne Plagiat", [
    ("Beim Lesen **sofort** festhalten: Was ist Zitat, was ist eigene Zusammenfassung?", 0),
    ("Später lässt sich die Grenze nicht mehr rekonstruieren", 0),
    ("Genau so entstehen **unbeabsichtigte Plagiate**", 0),
    ("Die Quellenangabe gehört gleich dazu — nicht erst am Ende nachtragen", 0),
])

d.two_cols("Eine Quellenliste für alle", [
    ("**So nicht**", 0),
    ("Lesezeichen im eigenen Browser — auf einem Gerät gefangen", 1),
    ("in den Verläufen der Gruppenmitglieder", 1),
    ("am Ende aus dem Gedächtnis", 1),
], [
    ("**So schon**", 0),
    ("eine **gemeinsame** Liste", 1),
    ("mit vollständigen Angaben", 1),
    ("von Anfang an", 1),
    ("alle sehen dieselbe Fassung", 1),
])

d.table_top("Besondere Quellen", [
    ["Quelle", "was dazugehört"],
    ["Video", "Titel, Kanal, Datum und die Zeitmarke der zitierten Stelle"],
    ["graue Quelle", "nicht über den Buchhandel veröffentlicht, etwa ein Behördenbericht"],
    ["", "zitierfähig, aber schwer wiederzufinden: Archivlink oder Kopie dazu"],
    ["Interview", "wer, wann und wie befragt wurde; der Leitfaden kommt in den Anhang"],
], [170, 646], [
    ("Videos sind zitierfähig wie andere Quellen — nur der Link genügt nicht", 0),
], font_size=11, bold_cols=(0,))

d.bullets("KI-Werkzeuge in der Recherche", [
    ("Sprachmodelle erzeugen **plausibel klingende, aber erfundene** Angaben", 0),
    ("Auch ihre Quellenangaben können erfunden sein", 0),
    ("Deshalb: das Ergebnis nur als **Ausgangspunkt** nehmen", 0),
    ("Jede Angabe an einer echten Quelle prüfen", 0),
    ("Der Einsatz gehört **offen** in die Arbeit", 0),
])

d.two_cols("Belegen und wann genug ist", [
    ("**Belegen**", 0),
    ("ein Beleg stützt eine Aussage, ein Beweis schließt das Gegenteil aus", 1),
    ("in empirischen Fragen selten Beweise: vorsichtig formulieren", 1),
    ("widersprechende Quellen aufnehmen und offen behandeln", 1),
    ("Weglassen ist ein wissenschaftlicher Fehler", 1),
], [
    ("**Genug ist es ...**", 0),
    ("wenn neue Suchen überwiegend Bekanntes liefern: **Sättigung**", 1),
    ("feste Zahlen sind willkürlich, die Zeit ist kein Kriterium", 1),
    ("Leitfrage nicht beantwortbar? Begründet anpassen und festhalten", 1),
    ("eine Quelle zu erfinden ist **Täuschung**", 1),
])

d.merksatz("Recherche heißt: die Leitfrage in Teilfragen zerlegen, gezielt suchen und protokollieren, "
           "sofort sauber exzerpieren — am Ende steht geordnetes, belegtes Material.")

d.bullets("Fun Facts", [
    ("„Plagiat“ kommt vom lateinischen **plagiarius**, Menschenräuber — so beschimpfte der Dichter Martial einen, der seine Verse als eigene vortrug", 0),
    ("In der englischen Wikipedia steht hinter unbelegten Sätzen **[citation needed]** — der Hinweis ist längst ein Internet-Witz", 0),
    ("Den Begriff **Sättigung** prägten die Soziologen Barney Glaser und Anselm Strauss 1967 für die qualitative Forschung", 0),
    ("Das Minifon auf der Kapitelseite war ein Diktiergerät für die Manteltasche — heute nimmt jedes Smartphone besser auf", 0),
])

d.bullets("Checkliste Recherche", [
    ("Die **Teilfragen** stehen, jede hat eine zuständige Person", 0),
    ("Jede Person führt ein **Rechercheprotokoll**", 0),
    ("Die **gemeinsame Quellenliste** hat vollständige Angaben", 0),
    ("Zitat und eigene Zusammenfassung sind sauber **getrennt**", 0),
    ("Interview oder Umfrage? **Leitfaden** und **Zustimmung** sind geklärt", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Teilfragen** aus eurer Leitfrage ableiten und im Team verteilen", 0),
    ("**Arbeitsteilig recherchieren**: Quellen sammeln, bewerten wie in Lernbereich 2, ins Protokoll", 0),
    ("**Beratung**: Ich komme zu jeder Gruppe — zeigt mir Teilfragen, Protokoll und Quellenliste", 0),
    ("**Zwischenstand** ins Portfolio: Teilfragen, Protokoll, Quellenliste", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
