#!/usr/bin/env python3
"""Informatik 11 (BGY), LB 4 "Projekt Informationsmanagement", Ustd. 1-2/14: Themenwahl und
Planung - Leitfrage, Projektskizze, SMART-Ziele, Meilensteine, Zeitplan, Zustaendigkeiten,
Portfolio-Struktur.

Facts line up with the worksheet HTML/inf11test-projektplanung.html (20 Aufgaben). Chapter
pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-projektplanung.pptx")

d.title("Informatik — Grundkurs 11", "Ein Projekt planen",
        "Von der Leitfrage zum Zeitplan — Start in Lernbereich 4")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Thema und Leitfrage", "Eingrenzen, bevor es losgeht",
          image="img/projektplanung-leitfrage.jpg",
          credit="Fragezeichen in Esbjerg — Foto: Alexander Henning Drachmann, CC BY-SA 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Question_mark_in_Esbjerg_(327122302).jpg")

d.bullets("Wo wir stehen", [
    ("Lernbereich 3 ist geschafft — die Klassenarbeit 2 liegt hinter euch", 0),
    ("Heute beginnt **Lernbereich 4**: das Projekt Informationsmanagement, 14 Stunden in Gruppen", 0),
    ("Ihr wendet an, was ihr könnt: recherchieren, Quellen bewerten, präsentieren — und Daten sicher halten", 0),
    ("Leitfrage: Wie wird aus einem Thema ein Projekt, das in der Zeit fertig wird?", 0),
])

d.bullets("Themen zur Auswahl", [
    ("Vorschläge aus dem Lehrplan: **Architektur von Informatiksystemen**", 0),
    ("**Webseiten mit HTML und CSS** gestalten", 0),
    ("**Geschäftsprozesse** untersuchen und darstellen", 0),
    ("Oder eine **eigene Idee** — nach Absprache mit der Lehrkraft", 0),
    ("Am Ende stehen Präsentation und **Portfolio**, mit Feedback der anderen Gruppen", 0),
])

d.bullets("Bearbeitbar statt riesig", [
    ("Ein Thema ist **bearbeitbar**, wenn sich eine Frage mit euren Mitteln und in der Zeit beantworten lässt", 0),
    ("Ein weites Thema lässt sich nicht abschließen — viele Suchtreffer machen es nicht leichter", 0),
    ("Zu groß? **Einen Teilaspekt wählen** und die Wahl begründet festhalten", 0),
    ("Eingrenzen ist eine fachliche Leistung, kein Rückzug — ein Themenwechsel kostet die bisherige Arbeit", 0),
])

d.table_top("Die Leitfrage", [
    ["Leitfrage", "bearbeitbar?"],
    ["Was ist Digitalisierung?", "nein — füllt ganze Bücher"],
    ["Ist künstliche Intelligenz gefährlich?", "nein — viel zu weit"],
    ["Wie funktioniert das Internet?", "nein — kein Ende in Sicht"],
    ["Wie verändert die automatische Notenerfassung das Sekretariat unserer Schule?", "ja — klar eingegrenzt"],
], [586, 230], [
    ("Die Leitfrage ist **die eine Frage**, die das Projekt am Ende beantwortet", 0),
    ("Alles, was nichts zu ihr beiträgt, fliegt raus — sonst wird es eine Materialsammlung", 0),
], font_size=11,
   marks={(1, 1): TINT_RED, (2, 1): TINT_RED, (3, 1): TINT_RED, (4, 1): TINT_GREEN})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Ziele und Meilensteine", "Was an welchem Tag vorliegt",
          image="img/projektplanung-meilenstein.jpg",
          credit="Römischer Meilenstein bei Nitzing — Foto: Clemens Pfeiffer, CC BY 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:R%C3%B6mischer_Meilenstein_(Nitzing)_01.jpg")

d.bullets("SMART-Ziele", [
    ("Ein gutes Ziel ist **SMART**: konkret, messbar, erreichbar, relevant, terminiert", 0),
    ("Kein SMART-Ziel: „Wir machen was mit Daten“", 0),
    ("SMART: „Bis zum 14. März liegen fünf ausgewertete Interviews vor“", 0),
    ("Das **Ziel** beschreibt das Ergebnis, ein **Arbeitspaket** einen abgegrenzten Schritt dorthin", 0),
    ("Jedes Arbeitspaket hat Zuständigkeit, Termin und Ergebnis", 1),
])

d.bullets("Die Projektskizze", [
    ("Leitfrage, Ziel, geplantes Vorgehen, Zeitplan, Zuständigkeiten — **eine Seite** genügt", 0),
    ("Die Skizze ist eure Vereinbarung mit euch selbst und mit der Lehrkraft", 0),
    ("Die **Ergebnisform** gehört dazu: Präsentation, Bericht oder Prototyp brauchen unterschiedliche Arbeit", 0),
    ("Früh mit der Lehrkraft abstimmen: Leitfrage, Umfang, Termine", 0),
    ("Die Betreuung ist Beratung, keine Kontrolle", 1),
])

d.bullets("Meilensteine", [
    ("Ein **Meilenstein** ist ein überprüfbares Zwischenergebnis zu einem festen Termin", 0),
    ("Er beantwortet die Frage: Was liegt an diesem Tag vor?", 0),
    ("Ohne prüfbares Ergebnis ist es nur ein Datum", 0),
    ("Meilensteine zeigen **Verzug** rechtzeitig an — solange noch Zeit zum Gegensteuern bleibt", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Der Zeitplan", "Rückwärts planen, Puffer einbauen",
          image="img/projektplanung-gantt.png",
          credit="Gantt-Diagramm — gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:GanttChartAnatomy.svg")

d.bullets("Rückwärtsplanung", [
    ("Vom **Abgabetermin** aus rückwärts planen: Der Endtermin steht fest, die Zwischenschritte ergeben sich", 0),
    ("So wird sichtbar, wann etwas **spätestens** fertig sein muss", 0),
    ("**Puffer**: rund ein Fünftel der Gesamtzeit — Krankheit, Technik und Wartezeiten sind der Normalfall", 0),
    ("Zu viel Puffer lädt zum Aufschieben ein", 0),
])

d.table_top("Unser Projekt in sieben Doppelstunden", [
    ["Doppelstunde", "Schritt", "Meilenstein: Was liegt vor?"],
    ["1", "Themenwahl und Planung", "Projektskizze mit Leitfrage und Zeitplan"],
    ["2", "Recherche", "Quellen gesammelt, bewertet, im Portfolio"],
    ["3 und 4", "Erarbeitung", "Inhalte fertig, Zwischenstand berichtet"],
    ["5", "Präsentation ausarbeiten", "Generalprobe mit Feedback"],
    ["6 und 7", "Präsentationen, Auswertung", "Vortrag gehalten, Portfolio abgegeben"],
], [150, 270, 396], [
    ("Häufigster Fehler: Die Zeit für **Auswertung und Ausarbeitung** wird unterschätzt", 0),
    ("Material zu sammeln geht schnell — es auszuwerten nicht", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Den Plan sichtbar führen", [
    ("Im Kopf hat jeder einen anderen Plan — ein **gemeinsames Dokument** schafft eine Fassung", 0),
    ("Alle sehen denselben Stand, Verzug fällt früh auf", 0),
    ("Der Plan ersetzt keine Absprachen — er hält sie fest", 0),
    ("Ein guter Plan: Man kann jederzeit sagen, **was fertig ist** und was als Nächstes ansteht", 0),
    ("Er darf und soll angepasst werden", 1),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Team und Portfolio", "Zuständigkeiten, Risiken, Dokumentation",
          image="img/projektplanung-kanban.jpg",
          credit="Kanban-Tafel — Foto: Jeff.lasovski, CC BY-SA 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Simple-kanban-board-.jpg")

d.bullets("Das erste Treffen", [
    ("Zuerst klären: **Leitfrage, Zuständigkeiten** und wie ihr kommuniziert", 0),
    ("Jede Aufgabe hat **genau eine** verantwortliche Person — Mitarbeit bleibt erwünscht", 0),
    ("Geteilte Verantwortung ist oft keine Verantwortung", 1),
    ("Wer zuständig ist, muss ansprechbar sein", 0),
    ("Layout und Folienfarben kommen ganz zum Schluss", 0),
])

d.bullets("Risiken und Konflikte", [
    ("**Risiko**: ein Ereignis, das eintreten kann und dann den Plan gefährdet", 0),
    ("Risiken vorher benennen — zu jedem gehört eine Gegenmaßnahme", 0),
    ("Beispiel: Die Interviewpartnerin sagt ab — Ersatz vorher anfragen", 1),
    ("Liefert jemand dauerhaft nicht: **früh ansprechen** — bleibt das Problem, die Betreuung einbeziehen", 0),
    ("Stilles Übernehmen belastet die anderen und löst nichts", 1),
])

d.bullets("Projekttagebuch und Portfolio", [
    ("Das **Projekttagebuch** hält fest, was wann getan und entschieden wurde", 0),
    ("Auch verworfene Ideen gehören hinein — sie sind Teil des Ergebnisses", 1),
    ("Das **Portfolio** sammelt Skizze, Zeitplan, Quellen, Zwischenstände und Ergebnis", 0),
    ("Heute legt ihr die Struktur an: ein gemeinsamer Ordner mit festen Unterordnern", 0),
    ("Lernbereich 3 gilt weiter: Backup, passende Rechte, keine unnötigen personenbezogenen Daten", 0),
])

d.merksatz("Ein Projekt beginnt mit einer eingegrenzten Leitfrage und SMART-Zielen. Der Zeitplan "
           "wird rückwärts geplant, mit Meilensteinen und Puffer — und jede Aufgabe hat genau "
           "eine zuständige Person.")

d.bullets("Fun Facts", [
    ("**Meilensteine** standen schon an römischen Straßen und zeigten die Entfernung — eine römische Meile war rund 1,5 km", 0),
    ("Das Balkendiagramm für Zeitpläne heißt nach **Henry Gantt**, der es in den 1910er-Jahren bekannt machte", 0),
    ("**Kanban** kommt aus der Autoproduktion bei Toyota — das japanische Wort bedeutet etwa „Schild“ oder „Karte“", 0),
    ("Menschen unterschätzen regelmäßig, wie lange ihre eigenen Aufgaben dauern — Kahneman und Tversky nannten das 1979 den **Planungsfehlschluss**", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Brainstorming** in der Gruppe: Themenideen sammeln, eine auswählen, zur Leitfrage eingrenzen", 0),
    ("**Projektskizze** mit der Vorlage: Leitfrage, SMART-Ziel, Ergebnisform, Zuständigkeiten", 0),
    ("**Meilensteine** rückwärts vom Präsentationstermin festlegen — mit Puffer", 0),
    ("**Portfolio-Struktur** im gemeinsamen Ordner anlegen", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
