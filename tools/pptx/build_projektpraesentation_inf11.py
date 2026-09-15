#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 29 / KW 15: Projekt Informationsmanagement - Ausarbeitung der
Praesentation (LB 4 "Projekt Informationsmanagement", Ustd. 9-10/14): eine Botschaft,
Dramaturgie, Folien, Probelauf, Fragen; Generalprobe mit Peer-Feedback.

Facts line up with the worksheet HTML/inf11test-projektpraesentation.html (20 Aufgaben).
Chapter pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-projektpraesentation.pptx")

d.title("Informatik — Grundkurs 11", "Aus dem Bericht wird ein Vortrag",
        "Eine Botschaft, Dramaturgie, Folien, Probelauf, Fragen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Eine Botschaft", "Was soll hängen bleiben?",
          image="img/projektpraesentation-zielscheibe.png",
          credit="Zielscheibe — Grafik: Alberto Barbati, CC BY-SA 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:WA_80_cm_archery_target.svg")

d.bullets("Wo wir stehen", [
    ("Der Bericht ist fertig, gegengelesen und doppelt gesichert", 0),
    ("Heute: die **Präsentation** ausarbeiten — zielgruppengerecht, mit den Methoden aus Lernbereich 2", 0),
    ("Am Ende steht eine **Generalprobe** mit Rückmeldung", 0),
    ("Leitfrage der Stunde: Wie wird aus einem Bericht ein Vortrag, der **ankommt**?", 0),
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
   marks={(1, 1): TINT_GREEN, (2, 1): TINT_GREEN, (3, 1): TINT_GREEN, (4, 1): TINT_GREEN,
          (5, 0): TINT_ORANGE, (5, 1): TINT_ORANGE, (5, 2): TINT_ORANGE})

d.bullets("Zuerst die Botschaft", [
    ("Die Ausarbeitung beginnt mit der **einen Botschaft**, die hängen bleiben soll", 0),
    ("Aus ihr folgt, was auf die Folien kommt", 0),
    ("Ohne sie wird der Vortrag eine Zusammenfassung des Berichts", 0),
    ("Vorlage, Farben, Bilder: Gestaltungsfragen kommen **zuletzt**", 0),
])

d.two_cols("Lesen ist nicht Zuhören", [
    ("**Bericht**", 0),
    ("der Leser kann zurückblättern", 1),
    ("er bestimmt sein Tempo selbst", 1),
    ("alle Details, alle Belege", 1),
], [
    ("**Vortrag**", 0),
    ("der Zuhörer kann nicht zurück", 1),
    ("die Zeit ist knapp", 1),
    ("eigene Dramaturgie: weniger Inhalt, klarer geführt", 1),
])

d.table_top("Faustregeln für zehn Minuten", [
    ["Frage", "Faustregel"],
    ["Wie viele Kernaussagen?", "etwa drei — mehr bleibt nicht hängen"],
    ["Wie viele Folien?", "etwa eine pro Minute, mit Spielraum"],
    ["Wie groß die Schrift?", "aus der letzten Reihe lesbar"],
    ["Wie viele Animationen?", "sparsam — nur wo sie einen Ablauf verständlicher machen"],
], [300, 516], [
    ("Wer die Schrift verkleinert, hat zu viel Text — der Text ist das Problem, nicht die Größe", 0),
    ("Alles Weitere gehört in den Bericht", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Folien, die tragen", "Aussage, Zahl, Bild, Quelle",
          image="img/projektpraesentation-projektor.jpg",
          credit="Diaprojektor Super Zett III — Foto: Berthold Werner, CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Super_Zett_III_Slide_projektor_BW_2025-07-24_17-43-26_s.jpg")

d.two_cols("Die Überschrift ist die Aussage", [
    ("**Schwach**", 0),
    ("Überschrift nennt das Thema: Umsatz", 1),
    ("alle Unterpunkte des Kapitels", 1),
    ("der ausformulierte Vortragstext", 1),
    ("möglichst viele Zahlen", 1),
], [
    ("**Stark**", 0),
    ("Überschrift nennt die Aussage: Umsatz gestiegen", 1),
    ("wenige Elemente, die sie stützen", 1),
    ("der Sprechtext steht in den Notizen", 1),
    ("die eine wichtige Zahl hervorgehoben", 1),
])

d.bullets("Zahlen, Notizen, Fachbegriffe", [
    ("Zahlen als **Grafik** mit hervorgehobener Kernaussage — Tabellen sind im Vortrag unlesbar", 0),
    ("Sprechtext und Stichworte in die **Notizen**: In der Referentenansicht seht nur ihr sie", 0),
    ("Einen unbekannten **Fachbegriff** beim ersten Auftreten in einem Satz erklären", 0),
    ("Das kostet zehn Sekunden — Nachfragen kommen im Vortrag meist nicht", 0),
])

d.bullets("Quellen und Bildrechte", [
    ("Auch im Vortrag gilt die **Belegpflicht**", 0),
    ("Die **Quellenfolie** nennt die verwendeten Quellen — vollständig genug zum Wiederfinden", 0),
    ("Bildquellen gehören auf die **jeweilige Folie**", 0),
    ("Bei Bildern **Nutzungsrechte klären** — die Quellenangabe ersetzt keine Erlaubnis", 0),
    ("Sicher sind eigene Bilder und freie Lizenzen — wie die Kapitelbilder in diesem Foliensatz", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Probelauf und Fragen", "Dramaturgie, Uhr, Technik, Antworten",
          image="img/projektpraesentation-stoppuhr.jpg",
          credit="Stoppuhr — Foto: StefanPohl, gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Stoppuhr_hanhart.jpg")

d.table_top("Die Dramaturgie", [
    ["Teil", "was dort hingehört"],
    ["Eröffnung", "ein konkreter Einstieg, der die Leitfrage aufwirft: ein Fall, eine Zahl, eine Frage"],
    ["Hauptteil", "etwa drei Kernaussagen, jede belegt, verbunden durch Überleitungen"],
    ["Schluss", "die Antwort auf die Leitfrage, klar formuliert"],
], [170, 646], [
    ("Der **rote Faden** verbindet jede Folie mit der Leitfrage — eine Gliederungsfolie allein leistet das nicht", 0),
    ("Die ersten dreißig Sekunden entscheiden über die Aufmerksamkeit — Namen und Gliederung danach", 0),
    ("Eine Dankesfolie ist kein Schluss: Das Ende bleibt am stärksten haften", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (3, 0): TINT_GREEN})

d.bullets("Einen Gruppenvortrag aufteilen", [
    ("Nach **inhaltlichen Abschnitten** aufteilen — nicht abwechselnd Folie für Folie", 0),
    ("Ein Wechsel mitten im Gedanken irritiert", 0),
    ("Die **Übergabe** wird ausdrücklich formuliert", 0),
    ("Gleiche Redezeit ist ein Nebenziel, kein Schnittkriterium", 0),
])

d.bullets("Probelauf mit Uhr", [
    ("Die tatsächliche Dauer wird **regelmäßig unterschätzt** — im Kopf läuft der Vortrag schneller", 0),
    ("Erst der Probelauf zeigt, was gestrichen werden muss — kürzen ist vorher leichter als währenddessen", 0),
    ("**Technik**: die Datei auf dem Vortragsrechner testen, Auflösung und Ton prüfen", 0),
    ("Schriften und Videos machen auf fremden Rechnern gern Probleme", 0),
    ("Ersatz mitbringen: ein **PDF auf dem Stick** ist der Rettungsanker", 0),
])

d.bullets("Fragen vorbereiten", [
    ("Die **drei wahrscheinlichsten Fragen** vorher überlegen und beantworten", 0),
    ("Die Schwachstellen eurer Arbeit kennt ihr selbst am besten — Zusatzfolien sind erlaubt", 0),
    ("Keine Antwort? **Offen sagen** und, wenn möglich, den Weg zur Antwort skizzieren", 0),
    ("„Das haben wir nicht untersucht, man müsste ...“ ist eine gute Antwort", 0),
    ("Erfundene Antworten fallen fast immer auf", 0),
])

d.bullets("Generalprobe mit Peer-Feedback", [
    ("Jede Gruppe hält ihren Vortrag einmal **komplett und mit Uhr** vor einer Nachbargruppe", 0),
    ("Die Zuhörenden notieren auf dem **Feedbackbogen**: Botschaft, roter Faden, Folien, Zeit", 0),
    ("Dieselben Kriterien wie später bei der Bewertung: die **Bewertungsmatrix**", 0),
    ("docalvers.de/svp/bewertungsmatrix.html", 1),
    ("Rückmeldung konkret und mit Vorschlag — wie beim Gegenlesen", 0),
])

d.merksatz("Ein Vortrag ist keine Kurzfassung des Berichts: eine Botschaft, etwa drei Kernaussagen, "
           "Überschriften als Aussagen — und ein Probelauf mit Uhr.")

d.bullets("Fun Facts", [
    ("**PowerPoint** kam 1987 auf den Markt — zuerst für den Apple Macintosh", 0),
    ("Folien heißen im Englischen bis heute **slides** — wie die Dias, die man in den Projektor schob", 0),
    ("Die **10-20-30-Regel** von Guy Kawasaki: höchstens 10 Folien, 20 Minuten, Schrift mindestens 30 Punkt", 0),
    ("**Pecha Kucha**: 20 Folien zu je 20 Sekunden — 2003 in Tokio von zwei Architekten erfunden", 0),
])

d.bullets("Checkliste Präsentation", [
    ("Die **eine Botschaft** steht in einem Satz", 0),
    ("Etwa **drei Kernaussagen**, jede Überschrift ist eine Aussage", 0),
    ("**Einstieg und Schluss** sind ausformuliert, die Übergaben abgesprochen", 0),
    ("**Probelauf mit Uhr** gemacht — die Zeit passt", 0),
    ("Quellen auf den Folien, die Datei als **PDF auf dem Stick**", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Botschaft** festlegen und in einem Satz aufschreiben", 0),
    ("**Foliensatz** bauen: Aussage-Überschriften, Grafiken statt Tabellen, Sprechtext in die Notizen", 0),
    ("**Generalprobe** vor einer Nachbargruppe — mit Uhr und Feedbackbogen", 0),
    ("Rückmeldungen einarbeiten, **drei wahrscheinliche Fragen** vorbereiten", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
