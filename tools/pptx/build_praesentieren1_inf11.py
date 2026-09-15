#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 30 / KW 16: Projekt Informationsmanagement - Praesentationen I
(LB 4 "Projekt Informationsmanagement", Ustd. 11-12/14): Blickkontakt, Stimme, Pausen,
Technikausfall, Zwischenfragen; Peer-Feedback nach Kriterienbogen, Portfolio-Abgabe.

Facts line up with the worksheet HTML/inf11test-praesentieren1.html (20 Aufgaben). Chapter
pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-praesentieren1.pptx")

d.title("Informatik — Grundkurs 11", "Jetzt seid ihr dran",
        "Blickkontakt, Stimme, Pausen, Technikausfall, Zwischenfragen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Vor dem Publikum", "Blick, Stand, Hände",
          image="img/praesentieren1-hoersaal.jpg",
          credit="Leerer Hörsaal — Foto: Paul The Writer, CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Empty_Lecture_Room_Interior.jpg")

d.bullets("Wo wir stehen", [
    ("Der Foliensatz steht, die Generalprobe ist gelaufen, die Rückmeldungen sind eingearbeitet", 0),
    ("Heute halten die **ersten Gruppen** ihre Vorträge und geben ihr Portfolio ab", 0),
    ("Alle anderen hören zu und geben **Rückmeldung nach Kriterien**", 0),
    ("Leitfrage der Stunde: Was macht einen Vortrag aus, dessen **Kernaussage ankommt**?", 0),
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
          (5, 1): TINT_GREEN, (6, 0): TINT_ORANGE, (6, 1): TINT_ORANGE, (6, 2): TINT_ORANGE})

d.table_top("So läuft jeder Vortrag ab", [
    ["Schritt", "wer", "was"],
    ["1. Aufbau", "Gruppe", "Datei auf dem Vortragsrechner testen, Ton und Auflösung prüfen"],
    ["2. Vortrag", "Gruppe", "in der vereinbarten Zeit"],
    ["3. Fragen", "alle", "Fragen aus dem Publikum, souverän und ehrlich beantwortet"],
    ["4. Rückmeldung", "alle", "erst die Gruppe selbst, dann das Publikum, zuletzt die Lehrkraft"],
    ["5. Abgabe", "Gruppe", "das Portfolio"],
], [180, 120, 516], [
    ("Bewertet wird nach der **Bewertungsmatrix**: docalvers.de/svp/bewertungsmatrix.html", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Blick und Stand", [
    ("Blick **ins Publikum**, wechselnd zu verschiedenen Personen — wer die Folie anschaut, spricht zur Wand", 0),
    ("Der Wechsel verhindert, jemanden anzustarren", 0),
    ("Stehen: **seitlich** neben der Projektionsfläche, dem Publikum zugewandt", 0),
    ("Vor der Fläche steht man im eigenen Bild, hinter dem Rechner verschwindet man", 0),
    ("Haltung: **aufrecht**, beide Füße fest — ständiges Wandern macht unruhig", 0),
])

d.two_cols("Hände und Zeiger", [
    ("**Hände**", 0),
    ("sichtbar lassen — das wirkt offen", 1),
    ("zum Zeigen und Betonen nutzen", 1),
    ("nicht in die Taschen, nicht hinter den Rücken", 1),
    ("ein Zettel in beiden Händen bindet sie fest", 1),
], [
    ("**Zeiger**", 0),
    ("gezielt und kurz, um eine Stelle zu markieren", 1),
    ("gezeigt wird, was gerade besprochen wird", 1),
    ("dauerndes Kreisen macht unruhig", 1),
    ("er ersetzt keine Erklärung", 1),
])

d.bullets("Nervosität", [
    ("Nervosität ist **normal** — und meist unsichtbar", 0),
    ("Akzeptieren, **langsam beginnen**, ruhig atmen", 0),
    ("Üben senkt sie, Entschuldigungen verstärken sie", 0),
    ("Nicht auswendig lernen: Ein Aussetzer blockiert sonst den ganzen Ablauf", 0),
    ("Stichworte erlauben Anpassung — nur Einstieg und Schluss lohnen sich wörtlich", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Stimme, Tempo, Pausen", "Damit das Publikum mitdenken kann",
          image="img/praesentieren1-mikrofon.jpg",
          credit="Mikrofon EMI RM-1B, 1930er — Foto: Josephenus P. Riley, CC BY 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:EMI_RM-1B_microphone_(1930s),_Abbey_Road_Studios.jpg")

d.table_top("Die Stimme", [
    ["Merkmal", "so ist es richtig", "so nicht"],
    ["Tempo", "etwas langsamer als im Gespräch, mit Pausen", "so schnell wie möglich"],
    ["Lautstärke", "die letzte Reihe versteht mühelos", "leise, weil es ruhig wirkt"],
    ["Betonung", "Lautstärke variieren, um Wichtiges zu betonen", "immer gleich laut"],
    ["Füllwörter", "lieber eine Pause", "äh, sozusagen"],
], [150, 390, 276], [
    ("Wer hinten nichts versteht, hört auf zuzuhören — ein kurzer Test im Raum klärt das vorher", 0),
    ("Übertriebene Langsamkeit ermüdet allerdings auch", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 1): TINT_GREEN, (2, 1): TINT_GREEN, (3, 1): TINT_GREEN, (4, 1): TINT_GREEN,
          (1, 2): TINT_RED, (2, 2): TINT_RED, (3, 2): TINT_RED, (4, 2): TINT_RED})

d.bullets("Die Pause", [
    ("Nach einer wichtigen Aussage: **Pause** — das Publikum braucht Zeit, sie aufzunehmen", 0),
    ("Ohne Pause geht die Aussage im Folgenden unter", 0),
    ("Zwei Sekunden wirken lang, sind aber richtig", 0),
    ("Pausen wirken **souverän**, nicht unsicher", 0),
    ("Gehäufte Füllwörter lenken vom Inhalt ab — eine Pause ist immer besser als ein äh", 0),
])

d.bullets("Die Zeit einhalten", [
    ("Eine **Uhr sichtbar** platzieren", 0),
    ("Zwei Zwischenmarken im Kopf: nach einem Drittel und nach zwei Dritteln", 0),
    ("Wer dort im Plan liegt, kommt pünktlich an", 0),
    ("Schneller sprechen oder am Ende Folien überspringen zerstört den Schluss", 0),
    ("Ein kurzer, beiläufiger Blick auf die Uhr ist Zeitkontrolle — nichts Schlimmes", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Wenn etwas schiefgeht", "Faden, Technik, Fragen, Einwände",
          image="img/praesentieren1-gluehbirne.jpg",
          credit="Durchgebrannter Glühfaden — Foto: Devcore, CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Broken_filament.JPG")

d.table_top("Pannen und die richtige Reaktion", [
    ["Panne", "richtige Reaktion"],
    ["Faden verloren", "kurz innehalten, auf die Notizen schauen, weitermachen"],
    ["Fehler auf der eigenen Folie", "beiläufig korrigieren und weitermachen"],
    ["Technik fällt aus", "ruhig zum vorbereiteten Ersatz wechseln: Ausdruck oder Handout"],
    ["Zwischenfrage", "kurz beantworten oder ausdrücklich auf später verweisen"],
    ["kritischer Einwand", "ernst nehmen, den berechtigten Kern anerkennen, sachlich antworten"],
], [230, 586], [
    ("Das Publikum kennt den geplanten Text nicht — und bewertet den **Umgang** mit der Panne", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Was nicht hilft", [
    ("Sich ausführlich **entschuldigen** — das macht die Lücke erst sichtbar", 0),
    ("Von vorn beginnen oder hoffnungsvoll die nächste Folie aufrufen", 0),
    ("Eine Zwischenfrage ignorieren — oder so ausführlich antworten, dass die Zeit platzt", 0),
    ("Einen Einwand zurückweisen oder ihm sofort vollständig zustimmen", 0),
    ("Gut ist: „Darauf komme ich in zwei Minuten.“", 0),
])

d.bullets("Als Gruppe auftreten", [
    ("Die Gruppe tritt als **Einheit** auf", 0),
    ("Wer gerade nicht spricht, hört **aufmerksam** zu und bleibt sichtbar zugewandt", 0),
    ("Nicht in den Notizen blättern, nicht die nächste Folie vorbereiten, nicht hinsetzen", 0),
    ("Das Publikum sieht alle, nicht nur die sprechende Person", 0),
])

d.bullets("Zuhören mit Kriterien", [
    ("Das Publikum füllt den **Bewertungsbogen** aus — mit den Kriterien der Bewertungsmatrix", 0),
    ("Zum Beispiel: Einführung, Gliederung, sachliche Richtigkeit, Vortragsstil, Zeit, Umgang mit Fragen", 0),
    ("Notiert **konkrete Beobachtungen**: an welcher Stelle, was genau", 0),
    ("Zwei konkrete Punkte sind mehr wert als zehn allgemeine", 0),
    ("Der Bogen online: docalvers.de/svp/bewertungsmatrix.html", 0),
])

d.merksatz("Das wichtigste Ziel eines Vortrags: Die Kernaussage kommt an — mit Blick ins Publikum, "
           "ruhigem Tempo, bewussten Pausen und einem Plan für Pannen.")

d.bullets("Fun Facts", [
    ("Die Angst, vor Publikum zu sprechen, hat einen Fachnamen: **Glossophobie**", 0),
    ("Den berühmtesten Teil seiner Rede von 1963, **I have a dream**, sprach Martin Luther King frei — er stand nicht im Manuskript", 0),
    ("Abraham Lincolns **Gettysburg-Rede** von 1863 hatte nur rund 270 Wörter und dauerte etwa zwei Minuten", 0),
    ("Das Mikrofon auf der Kapitelseite ist ein EMI-Modell aus den 1930er-Jahren — ausgestellt in den Abbey Road Studios in London", 0),
])

d.bullets("Checkliste Vortragstag", [
    ("Datei auf dem **Vortragsrechner** getestet, Ton und Auflösung geprüft", 0),
    ("**Ersatz** dabei: PDF auf dem Stick, Ausdruck oder Handout", 0),
    ("**Uhr** sichtbar, Zwischenmarken im Kopf", 0),
    ("**Stichworte** in den Notizen, Einstieg und Schluss sitzen", 0),
    ("**Portfolio** vollständig und abgabebereit", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Vortragende Gruppen**: Technik testen, vortragen, Fragen beantworten, Portfolio abgeben", 0),
    ("**Publikum**: Bewertungsbogen ausfüllen — konkrete Beobachtungen statt allgemeiner Urteile", 0),
    ("**Feedbackrunde** nach jedem Vortrag: erst die Gruppe selbst, dann das Publikum, zuletzt ich", 0),
    ("Wer nächste Woche dran ist: letzter **Probelauf mit Uhr**", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
