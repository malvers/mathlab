#!/usr/bin/env python3
"""Informatik 11 (BGY), live plan KW 27: Jahresrueckblick and outlook on Jgst. 12 (Grundkurs
Informatik: Modellierung, Datenbanken, Algorithmen und Programme). ORGA week.

Facts line up with the worksheet HTML/inf11test-jahresrueckblick.html (20 Aufgaben); learning
areas from HTML/svp/informatik/inf11.html and inf12.html. Chapter pictures come from Wikimedia
Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-jahresrueckblick.pptx")

d.title("Informatik — Grundkurs 11", "Jahresrückblick",
        "Was vom Schuljahr bleibt — und was in Klasse 12 darauf aufbaut")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Ein Jahr im Überblick", "Vier Lernbereiche und ein Wahlbereich",
          image="img/jahresrueckblick-webstuhl.jpg",
          credit="Jacquard-Webstuhl mit Lochkarten — Foto: Stephencdickson, CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:A_Jacquard_loom_showing_information_punchcards,_National_Museum_of_Scotland.jpg")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: Puffer — Wiederholung quer durchs Jahr", 0),
    ("Das Schuljahr ist fast geschafft — Zeit für den **großen Überblick**", 0),
    ("Heute: die Kernthemen in 10 Fragen, eure Rückmeldung, der Blick auf **Klasse 12**", 0),
    ("Leitfrage: Was habe ich gelernt, das **über das Schuljahr hinaus** trägt?", 0),
])

d.table_top("Das Schuljahr auf einen Blick", [
    ["Bereich", "Thema", "Kern"],
    ["LB 1", "Informatik als Wissenschaft", "vier Bereiche: theoretisch, technisch, praktisch, angewandt"],
    ["LB 2", "Persönliches Informationsmanagement", "vom Signal zum Wissen, Quellen prüfen, präsentieren"],
    ["LB 3", "IT-Sicherheit und Ökologie", "Schutzziele, Datensicherheit, Kryptologie, Datenschutz"],
    ["LB 4", "Projekt Informationsmanagement", "eine offene Frage im Team bearbeiten"],
    ["Wahlbereich", "Datenkomprimierung und Fehlererkennung", "Lauflängencodierung, Prüfbits, Prüfziffern"],
], [150, 330, 336], [
    ("Dazu die Exkurse: Wissensmanagementsysteme, Präsentieren, Digitalisierung", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_BLUE, (3, 0): TINT_RED, (5, 0): TINT_GREEN})

d.table_top("Die Kernbegriffe", [
    ["Frage", "Antwort"],
    ["Welche vier Wissenschaftsbereiche?", "theoretische, technische, praktische, angewandte Informatik"],
    ["Der Weg vom Signal zum Wissen?", "Signal, Nachricht, Information, Wissen"],
    ["Die Schritte des Informationsmanagements?", "Bedarf klären, beschaffen, aufbereiten, nutzen, bewerten"],
    ["Der Kern der IT-Sicherheit?", "Vertraulichkeit, Integrität, Verfügbarkeit"],
    ["Was ist eine Aussage wert?", "so viel wie ihr Beleg"],
], [330, 486], [
    ("Bei den Schutzzielen kommen Authentizität und Verbindlichkeit häufig hinzu", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Rote Fäden", "Was über alle Lernbereiche trägt",
          image="img/jahresrueckblick-faden.jpg",
          credit="Roter Faden — Foto: 多多123, CC BY 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Red_thread_(yarn).jpg")

d.bullets("Das Modell", [
    ("Der Begriff aus Klasse 11, der in Klasse 12 **am weitesten trägt**", 0),
    ("**Abbildung**: Ein Modell steht für ein Original", 1),
    ("**Verkürzung**: Es lässt Merkmale weg", 1),
    ("**Pragmatik**: Es gilt für einen bestimmten Zweck", 1),
    ("Verkürzung ist ein Merkmal, kein Mangel — beim Zweckwechsel muss man **neu prüfen**", 0),
])

d.bullets("Sicherheit und Daten", [
    ("Sicherheit ist ein **Zustand auf Zeit** — morgen kann eine neue Lücke bekannt werden", 0),
    ("Und immer eine **Abwägung**: Mehr Schutz kostet Aufwand und Bequemlichkeit", 0),
    ("Deshalb steht die Bewertung des Schutzbedarfs am Anfang", 0),
    ("Wichtigste Regel für personenbezogene Daten: **nur erheben, was für den Zweck nötig ist**", 0),
    ("Verschlüsselung ist erst die zweite Verteidigungslinie", 0),
])

d.table_top("Arbeiten, präsentieren, urteilen", [
    ["Thema", "Was bleibt"],
    ["Projekt", "eine offene Frage in bearbeitbare Schritte zerlegen"],
    ["Zusammenarbeit", "klare Zuständigkeiten und eine gemeinsame Fassung"],
    ["Präsentation", "eine klare Botschaft, die beim Publikum ankommt"],
    ["digitale Werkzeuge", "Nutzen, Kosten und Nebenwirkungen abwägen"],
    ["Automatisierung", "Tätigkeiten verschieben sich — neue entstehen, andere fallen weg"],
    ["Fachsprache", "macht Aussagen eindeutig und damit überprüfbar"],
], [230, 586], [
    ("Im Beruf gefragt: Informationen **beschaffen, bewerten und verständlich weitergeben**", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Ausblick auf Klasse 12", "Modellierung, Datenbanken, Algorithmen",
          image="img/jahresrueckblick-modell.jpg",
          credit="Modelleisenbahn Miniature Kingdom, Stockholm — Foto: Dependability, CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Miniature_Kingdom_2019_Stockholm_1.jpg")

d.table_top("Grundkurs Informatik in Klasse 12", [
    ["Bereich", "Thema", "Worum es geht"],
    ["LB 1", "Informatische Modellierung", "Modellbegriff, Prozesse modellieren, Projekte planen"],
    ["LB 2", "Modellierung von Datenbanken", "ER-Modell, Tabellen, Abfragen mit SQL"],
    ["LB 3", "Algorithmen und Programme", "Sprachen, Struktogramme — weiter in Klasse 13"],
    ["Wahlbereich", "Künstliche Intelligenz", "Teilgebiete der KI, ein kleines Experiment"],
], [150, 300, 366], [
    ("Der große neue Schwerpunkt: **informatische Modellierung von Prozessen und Datenbanken**", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_BLUE, (3, 0): TINT_RED, (4, 0): TINT_GREEN})

d.bullets("Gut vorbereitet in Klasse 12", [
    ("Neuer Stoff baut auf Begriffen auf: **Grundbegriffe und Modellvorstellung** sicher beherrschen", 0),
    ("Wer dort unsicher ist, trägt die Lücke mit", 0),
    ("Keine Software vorab installieren — die Werkzeuge lernt ihr im Kurs kennen", 0),
    ("Guter Vorsatz: **die eigenen Lücken benennen und gezielt schließen**", 0),
])

d.bullets("Die wichtigste Frage der Informatik", [
    ("Nicht: Welche Programmiersprache ist die beste? Welcher Rechner der schnellste?", 0),
    ("Sondern: **Wie stelle ich ein Problem so dar, dass es lösbar wird?**", 0),
    ("Die Darstellung entscheidet über die Lösbarkeit — genau das ist **Modellbildung**", 0),
    ("Werkzeuge und Geräte sind austauschbar — dieses Denken bleibt", 0),
])

d.merksatz("Werkzeuge wechseln, das Denken bleibt: Probleme zerlegen, Informationen prüfen, Daten "
           "schützen — und jede Lösung beginnt mit einem Modell.")

d.bullets("Fun Facts", [
    ("Das Wort **Informatik** prägte Karl Steinbuch 1957", 0),
    ("Die drei Modellmerkmale Abbildung, Verkürzung, Pragmatik stammen von **Herbert Stachowiak** (1973)", 0),
    ("Das **relationale Datenmodell**, auf dem Datenbanken mit Tabellen beruhen, beschrieb Edgar F. Codd 1970", 0),
    ("Die Abfragesprache **SQL** entstand in den 1970er-Jahren bei IBM — und ist bis heute Standard", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Quiz-Rückblick**: die Kernthemen des Jahres in 10 Fragen — nach jeder Frage: Warum stimmt die Antwort?", 0),
    ("**Feedbackrunde**: Was hat euch geholfen, was sollte im nächsten Jahr anders laufen?", 0),
    ("**Lückenliste**: Jede und jeder notiert zwei Begriffe, die noch wackeln — euer Plan für Klasse 12", 0),
    ("**Ausblick**: Welches Thema aus Klasse 12 reizt euch am meisten — und warum?", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
