#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 4 / KW 37: Schrittfolge bei der Modellbildung und
die drei Eigenschaften von Modellen (LB 1, Ustd. 3-4/22)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("modellbildung-schrittfolge.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — Grundkurs 12", "Wie ein Modell entsteht",
        "Vier Schritte, drei Eigenschaften — und warum jedes Modell etwas weglässt")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Warum überhaupt modellieren?", "Die Wirklichkeit passt in keinen Rechner")

d.bullets("Zu groß, zu bunt, zu unordentlich", [
    ("Kein System der Welt lässt sich **vollständig** beschreiben — es gibt immer ein Detail mehr", 0),
    ("Ein **Modell** ist der handliche Ersatz: klein genug zum Denken, genau genug zum Arbeiten", 0),
    ("Modellieren heißt deshalb vor allem: **entscheiden, was wegfällt**", 0),
    ("Und jede dieser Entscheidungen hat einen Grund — nämlich den **Zweck** des Modells", 0),
    ("Wer den Zweck nicht kennt, kann ein Modell weder bauen noch **beurteilen**", 0),
])

d.table_top("Modelle, die ihr längst benutzt", [
    ["Modell", "lässt weg", "behält", "Zweck"],
    ["Stadtplan", "Häuserhöhe, Farbe, Menschen", "Straßen, Namen, Lage", "sich zurechtfinden"],
    ["Klassenliste", "Aussehen, Charakter, Hobbys", "Name, Klasse, Geburtsdatum", "verwalten"],
    ["Wettermodell", "jede einzelne Wolke", "Druck, Temperatur im Raster", "vorhersagen"],
    ["Flugsimulator", "Absturzgefahr", "Steuerverhalten, Instrumente", "gefahrlos üben"],
], [150, 250, 230, 186], [
    ("Alle vier lassen **mehr** weg, als sie behalten — und sind genau deshalb brauchbar", 0),
    ("Dasselbe Original trägt viele Modelle: eine Stadt als Plan, als Netz, als Datenbank", 0),
], font_size=11.5, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die Schrittfolge", "Abgrenzen, abstrahieren, modellieren, prüfen")

# The cycle reads better lying down: four boxes in a row and one arrow back,
# so the slide keeps room for the bullets underneath.
BOX = dict(kind="proc", w=330, h=120)
gc = pap(P("pap-modellbildung.png"), 1560, 370, {
    "a": dict(pos=(200, 130), text="1. Abgrenzen: Was gehört zum System?", **BOX),
    "b": dict(pos=(590, 130), text="2. Abstrahieren: Was ist wesentlich?", **BOX),
    "c": dict(pos=(980, 130), text="3. Modellieren: Wie schreibe ich es auf?", **BOX),
    "d": dict(pos=(1370, 130), text="4. Prüfen: Trägt es den Zweck?", **BOX),
}, [
    ("a", "b", ""), ("b", "c", ""), ("c", "d", ""),
    ("d", "a", "trägt nicht — noch einmal von vorn", [(1370, 330), (200, 330)]),
], size=30)
d.picture("Vier Schritte — und ein Rücksprung", gc, [
    ("Der letzte Schritt führt zurück: Modellbildung ist ein **Kreislauf**, keine Einbahnstraße", 0),
    ("Geprüft wird **gegen den Zweck**, nicht gegen die Wirklichkeit — die verliert immer", 0),
], width=816)

d.table_top("Die vier Schritte im Einzelnen", [
    ["Schritt", "Leitfrage", "Ergebnis", "typischer Fehler"],
    ["Abgrenzen", "Was gehört dazu?", "Systemgrenze, Zweck", "alles hineinnehmen"],
    ["Abstrahieren", "Was ist wesentlich?", "Liste der Merkmale", "Details retten wollen"],
    ["Modellieren", "Wie schreibe ich es auf?", "Diagramm, Schema, Code", "gleich programmieren"],
    ["Prüfen", "Trägt es den Zweck?", "Freigabe oder Rücksprung", "gar nicht prüfen"],
], [150, 216, 230, 220], [
    ("Die Reihenfolge ist kein Ritual: wer **abstrahiert, bevor er abgegrenzt hat**, lässt das Falsche weg", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(1, 3): TINT_RED, (2, 3): TINT_RED, (3, 3): TINT_RED, (4, 3): TINT_RED})

d.bullets("Schritt 1: Abgrenzen — die Systemgrenze", [
    ("Zwei Fragen, schriftlich beantwortet: **Wozu** brauche ich das Modell, und **für wen**?", 0),
    ("Dann eine Linie ziehen: was ist **drinnen**, was ist **draußen**, was ist die **Schnittstelle**?", 0),
    ("Beispiel Mensa: die Bestellung ist drinnen, die Buchhaltung der Stadt ist draußen", 0),
    ("Draußen heißt nicht unwichtig — es heißt **nicht Gegenstand dieses Modells**", 0),
    ("Ohne Grenze wächst jedes Modell, bis es so unhandlich ist wie die Wirklichkeit", 0),
])

d.bullets("Schritt 2: Abstrahieren — weglassen mit Absicht", [
    ("**Abstrahieren** heißt: vom Einzelnen wegsehen und das Gemeinsame benennen", 0),
    ("Aus „Anna, Ben, Chiara“ wird die **Klasse Schüler** mit den Merkmalen Name und Nummer", 0),
    ("Die Probe: **Fehlt dem Zweck etwas?** Nur dann darf ein Merkmal zurück ins Modell", 0),
    ("Ein Merkmal, das niemand je auswertet, ist Ballast — es kostet Pflege und Vertrauen", 0),
    ("Weglassen ist eine **fachliche Entscheidung** und gehört deshalb dokumentiert", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Drei Eigenschaften", "Woran man ein Modell überhaupt erkennt")

d.table_top("Verkürzung, Abbildung, Pragmatik", [
    ["Eigenschaft", "besagt", "am Stadtplan"],
    ["Abbildung", "Es gibt ein Original, das abgebildet wird", "die echte Stadt"],
    ["Verkürzung", "Nicht alle Merkmale des Originals kommen mit", "keine Häuserfarben"],
    ["Pragmatik", "Für wen, wozu und wann es gilt", "für Fußgänger, heute"],
], [190, 336, 290], [
    ("Die drei Merkmale stammen aus Herbert Stachowiaks **Allgemeiner Modelltheorie** (1973)", 0),
    ("Sie sind ein **Prüfraster**: fehlt eines, redet man nicht über ein Modell", 0),
    ("**Pragmatik** ist das am häufigsten vergessene — und das, an dem Modelle scheitern", 0),
], font_size=12, bold_cols=(0,),
   marks={(3, 0): TINT_ORANGE, (3, 1): TINT_ORANGE, (3, 2): TINT_ORANGE})

d.bullets("Pragmatik ausbuchstabiert", [
    ("**Für wen?** Ein Netzplan für Fahrgäste ist kein Netzplan für Gleisbauer", 0),
    ("**Wozu?** Ein Modell zum Vorhersagen darf anderes weglassen als eines zum Erklären", 0),
    ("**Wann?** Modelle veralten: Straßen ändern sich, Lehrpläne auch", 0),
    ("Deshalb gehört zu jedem Modell ein Satz, der **Zweck, Adressat und Stand** nennt", 0),
    ("Fehlt dieser Satz, streiten später zwei Leute über ein Modell, das jeder anders liest", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Fallbeispiel", "Die Ausleihe in der Schulbibliothek")

d.table_top("Dieselben vier Schritte, an einem Fall", [
    ["Schritt", "so haben wir entschieden"],
    ["Abgrenzen", "Zweck: wissen, wer welches Buch hat. Drinnen: Buch, Schüler, Ausleihe. "
                  "Draußen: Einkauf, Mahngebühren, Regalordnung"],
    ["Abstrahieren", "Buch: Signatur, Titel, Autor. Schüler: Nummer, Name, Klasse. "
                     "Ausleihe: wer, was, ab wann, bis wann"],
    ["Modellieren", "drei Kästen mit ihren Merkmalen, dazwischen die Beziehung „leiht aus“ "
                    "als Tabelle mit Datum"],
    ["Prüfen", "Testfrage: Wer hat gerade Signatur B-114? Wer hat überzogen? "
               "Beides beantwortbar — das Modell trägt"],
], [150, 666], [
    ("Nichts davon ist Programmieren — hier fällt noch keine Zeile Code", 0),
    ("Erst wenn diese vier Zeilen stehen, lohnt sich der Rechner. Vorher rät man nur", 0),
    ("**Draußen** heißt: kommt vielleicht später, aber nicht in dieses Modell", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Was wir bewusst weggelassen haben", [
    ("**Zustand des Buchs** — für die Frage „wer hat es?“ ohne Belang", 0),
    ("**Telefonnummern** — hätte Folgen für den Datenschutz und keinen Nutzen für den Zweck", 0),
    ("**Wie oft ein Buch schon gelesen wurde** — interessant, aber ein anderer Zweck, ein anderes Modell", 0),
    ("Jede Streichung mit einem Satz begründet: das ist die **Dokumentation der Abstraktion**", 0),
    ("Ändert sich der Zweck, ändert sich das Modell — nicht umgekehrt", 0),
])

d.merksatz("Ein Modell ist nie die Wirklichkeit, sondern eine Verkürzung für einen Zweck. "
           "Wer den Zweck nicht kennt, kann das Modell nicht beurteilen.")

d.bullets("Fun Facts: Modelle", [
    ("**Herbert Stachowiak** schrieb 1973 die drei Merkmale auf, die bis heute jede Definition trägt", 0),
    ("**Harry Beck** zeichnete 1933 den Londoner U-Bahn-Plan geografisch **falsch** — und dafür lesbar", 0),
    ("**George Box**, Statistiker: „Alle Modelle sind falsch, aber manche sind nützlich“ (1976)", 0),
    ("Das Wettermodell **ICON-D2** des Deutschen Wetterdienstes rechnet in Kacheln von rund **2 km** — "
     "eine einzelne Gewitterzelle ist kleiner als ein Kästchen", 0),
    ("Die **Mercator-Karte** macht Grönland so groß wie Afrika. Sie ist trotzdem richtig — für ihren "
     "Zweck: Kurse als gerade Linien", 0),
])

d.bullets("Eure Aufgabe: eine Miniwelt in vier Schritten", [
    ("Zu zweit **eine** Miniwelt wählen: Mensa, Vertretungsplan oder Sporttag-Anmeldung", 0),
    ("**Abgrenzen**: Zweck und Adressat in einem Satz, dann drinnen, draußen und Schnittstelle", 0),
    ("**Abstrahieren**: je Gegenstand höchstens fünf Merkmale — zu jedem gestrichenen ein Grund", 0),
    ("**Modellieren**: Kästen mit Merkmalen, Beziehungen beschriften. Papier reicht", 0),
    ("**Prüfen**: zwei Testfragen beantworten und die drei Eigenschaften am eigenen Modell nachweisen", 0),
])

d.save()
