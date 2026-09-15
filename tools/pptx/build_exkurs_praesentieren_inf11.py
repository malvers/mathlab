#!/usr/bin/env python3
"""Informatik 11 (BGY), KW 23 (live plan): Exkurs Praesentieren (Schnuppern in Wahlbereich 2) -
Diagrammtypen, Farbe und Kontrast, Weissraum, Barrierefreiheit, Formate, Videofeedback.

Facts line up with the worksheet HTML/inf11test-exkurs-praesentieren.html (20 Aufgaben).
Chapter pictures from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-exkurs-praesentieren.pptx")

d.title("Informatik — Grundkurs 11", "Folien, die wirken",
        "Exkurs Präsentieren — Diagramme, Farbe, Schrift und Weißraum")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Das richtige Diagramm", "Linie, Balken, Kreis, Punktwolke",
          image="img/exkurs-praesentieren-playfair.png",
          credit="Eines der ersten Liniendiagramme, William Playfair 1786 — gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Playfair_TimeSeries-2.png")

d.bullets("Wo wir stehen", [
    ("Im Projekt habt ihr schon präsentiert — heute geht es um die **Regeln dahinter**", 0),
    ("Letzte Woche: Wissen teilen im Wiki", 0),
    ("Heute der zweite Exkurs: Schnuppern in den Wahlbereich **Präsentieren**", 0),
    ("Leitfrage: **Hilft** diese Folie dem Publikum, die Aussage zu verstehen?", 0),
])

d.table_top("Welches Diagramm wofür?", [
    ["Diagramm", "zeigt", "Vorsicht"],
    ["Liniendiagramm", "Entwicklung über die Zeit", "Achsenausschnitt nur mit Hinweis"],
    ["Balkendiagramm", "Vergleich einzelner Werte", "Werteachse beginnt bei null"],
    ["Kreisdiagramm", "Anteile an einem Ganzen", "wenige Kategorien, Summe 100 Prozent"],
    ["Streudiagramm", "Zusammenhang zweier Größen", "zeigt keine Ursache"],
], [220, 290, 306], [
    ("Beim Streudiagramm trägt jeder Punkt **zwei Werte** — ein Muster zeigt einen Zusammenhang", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_BLUE, (2, 0): TINT_GREEN, (3, 0): TINT_ORANGE, (4, 0): TINT_RED})

d.bullets("Kreis oder Balken?", [
    ("Der Kreis zeigt nur **Anteile an einem Ganzen** — die Summe muss 100 Prozent sein", 0),
    ("Ab etwa **fünf Segmenten** wird er unlesbar", 0),
    ("**Winkel** lassen sich schlechter vergleichen als **Längen**", 0),
    ("Im Zweifel: Balken", 0),
])

d.table_top("Der abgeschnittene Nullpunkt", [
    ["Wert", "Balken, Achse ab 0", "Balken, Achse ab 45"],
    ["50", "50 Einheiten lang", "5 Einheiten lang"],
    ["55", "55 Einheiten lang", "10 Einheiten lang"],
    ["wirkt wie", "10 Prozent mehr", "doppelt so viel"],
], [220, 298, 298], [
    ("Die **Balkenlänge** wird als Größe gelesen — deshalb beginnt die Werteachse bei null", 0),
    ("**3D-Balken** täuschen ähnlich: Die Tiefe trägt keine Information, vordere Balken wirken größer", 0),
], font_size=11, bold_cols=(0,),
   marks={(3, 1): TINT_GREEN, (3, 2): TINT_RED})

d.bullets("Die Kernaussage zeigen", [
    ("Die **Überschrift** nennt die Aussage, nicht das Thema", 0),
    ("Statt Ergebnisse der Umfrage besser: Die meisten kommen mit dem Bus", 0),
    ("**Eine** Farbe für das Wichtige, Grau für den Rest", 0),
    ("Der Blick soll wissen, wohin", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Gestalten fürs Publikum", "Farbe, Kontrast, Schrift, Weißraum",
          image="img/exkurs-praesentieren-ishihara.png",
          credit="Farbtafel nach Ishihara — Shinobu Ishihara, gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Ishihara_9.svg")

d.bullets("Farbe mit Bedeutung", [
    ("Farbe **sparsam** einsetzen — jede Farbe bedeutet etwas", 0),
    ("Nie als **einziges** Unterscheidungsmerkmal", 0),
    ("Etwa jeder zwölfte Mann kann Rot und Grün nicht sicher unterscheiden", 0),
    ("Form, Muster oder Beschriftung müssen die Farbe stützen", 0),
    ("Wenige Farben mit klarer Bedeutung wirken stärker als viele", 0),
])

d.bullets("Kontrast und Schrift", [
    ("Beamer verlieren viel **Kontrast** gegenüber dem Bildschirm — Hellgrau auf Weiß verschwindet", 0),
    ("Dunkel auf Hell oder Hell auf Dunkel, klar getrennt — auch für die letzte Reihe", 0),
    ("Fließtext mindestens etwa **24 Punkt** — wer verkleinern muss, hat zu viel Text", 0),
    ("**Serifenlose** Schriften bleiben bei Projektion besser lesbar", 0),
    ("Wichtiger als die Schriftart ist ausreichende **Größe**", 0),
])

d.two_cols("Weniger ist mehr", [
    ("**Text**", 0),
    ("Stichpunkte statt ganzer Sätze", 1),
    ("wenige Zeilen je Folie", 1),
    ("der Sprechtext gehört in die Notizen", 1),
], [
    ("**Weißraum**", 0),
    ("führt den Blick", 1),
    ("lässt die Aussage wirken", 1),
    ("ist Absicht, kein Mangel", 1),
])

d.bullets("Sieben Punkte sind zu viel", [
    ("Das Publikum **liest voraus** und hört nicht mehr zu", 0),
    ("Was vollständig lesbar ist, wird gelesen", 0),
    ("Schrittweiser Aufbau hilft nur teilweise", 0),
    ("Besser: die Punkte auf **mehrere Folien** verteilen", 0),
])

d.bullets("Bilder und Barrierefreiheit", [
    ("Bilder sollen die Aussage **stützen**, nicht dekorieren", 0),
    ("Ein Bild, das die Sache zeigt, spart viele Worte — ein beliebiges Symbolbild lenkt ab", 0),
    ("Auflösung, Rechte und Quelle gehören dazu", 0),
    ("**Barrierefrei**: Kontrast, große Schrift, Alternativtexte", 0),
    ("Was nur im Bild steht, sollte man auch **sagen**", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Planen, vorführen, weitergeben", "Storyboard, Vorlage, Format, Feedback",
          image="img/exkurs-praesentieren-storyboard.png",
          credit="Storyboard zum Film Charge — Andy Goralczyk, Blender Foundation, CC BY 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Charge-concept_art-storyboard.png")

d.bullets("Erst das Storyboard", [
    ("Ein **Storyboard** ist eine Skizze der Folienfolge — bevor gestaltet wird", 0),
    ("Auf Papier lässt sich die Reihenfolge schnell ändern", 0),
    ("Im Programm bindet man sich zu früh an die Gestaltung", 0),
    ("Das Storyboard klärt zuerst die **Dramaturgie**", 0),
])

d.bullets("Eine Vorlage für alle Folien", [
    ("Wechselnde Layouts wirken unruhig — die Aufmerksamkeit soll beim **Inhalt** bleiben", 0),
    ("Die Vorlage übernimmt Position, Größe und Farbe", 0),
    ("Eine Änderung wirkt an **einer Stelle** für alle Folien — wie beim CMS", 0),
    ("**Foliennummer** dezent unten — damit man sich in der Diskussion auf Folien beziehen kann", 0),
])

d.table_top("Welches Format wofür?", [
    ["Format", "wofür", "warum"],
    ["PDF", "Weitergabe", "Schriften und Umbrüche eingebettet — sieht überall gleich aus"],
    ["Quellformat", "Weiterarbeiten", "bleibt bearbeitbar"],
    ["Video", "Aufzeichnung", "ersetzt die Folien nicht"],
], [180, 200, 436], [
    ("Zur Weitergabe **PDF** — wer weiterarbeiten soll, bekommt zusätzlich das Quellformat", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_GREEN})

d.bullets("Feedback, das hilft", [
    ("Kurzpräsentation von zwei Minuten, mit Kamera oder Tablet aufgenommen", 0),
    ("Aufnahmen nur mit **Einverständnis** — und nach der Stunde löschen", 0),
    ("Zuerst: Was war gut? Dann **ein** konkreter Tipp", 0),
    ("Beschreiben, was man sieht: Du hast oft zur Wand gesprochen — statt: Das war schlecht", 0),
])

d.merksatz("Jede Gestaltungsentscheidung beantwortet eine Frage: Hilft es dem Publikum, die Aussage zu verstehen? "
           "Das richtige Diagramm, Farbe mit Bedeutung, große Schrift und viel Weißraum.")

d.bullets("Fun Facts", [
    ("**William Playfair** erfand 1786 das Linien- und das Balkendiagramm, 1801 das Kreisdiagramm", 0),
    ("**Florence Nightingale** zeigte mit Diagrammen, dass im Krimkrieg mehr Soldaten an Krankheiten starben als an Wunden", 0),
    ("Die Farbtafeln von **Shinobu Ishihara** gibt es seit 1917 — sie werden bis heute benutzt", 0),
    ("Das **PDF** stammt von 1993 und ist seit 2008 eine ISO-Norm", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Diagramm-Check**: drei Diagramme aus Zeitung oder Netz — passt der Typ, beginnt die Achse bei null?", 0),
    ("**Umbauen**: eine überladene Folie in zwei klare Folien verwandeln — mit aussagender Überschrift", 0),
    ("**Präsentationstraining**: zwei Minuten vortragen, mit Videofeedback", 0),
    ("**Feedbackbogen**: ein Lob und ein konkreter Tipp zu Diagramm, Schrift und Weißraum", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
