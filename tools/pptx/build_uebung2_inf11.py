#!/usr/bin/env python3
"""Informatik 11 (BGY), KW 21 (live plan): Uebung / Puffer - Anwendungsfaelle quer durch LB 1 und
LB 2 (ORGA, short deck).

Facts line up with the worksheet HTML/inf11test-uebung2.html (20 Aufgaben). Numbers recomputed
(800 x 600 x 3 Byte = 1 440 000 Byte). Chapter pictures from Wikimedia Commons, licence on the
slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-uebung2.pptx")

d.title("Informatik — Grundkurs 11", "Querbeet durch LB 1 und LB 2",
        "Übung mit Anwendungsfällen — vom Von-Neumann-Rechner bis zur Quellenangabe")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Rechner und Digitalisierung", "Generationen, Bits, Bildgrößen",
          image="img/uebung2-chip.png",
          credit="Integrierter Schaltkreis unter dem Mikroskop — Foto: Cole L, CC BY-SA 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:TI_AHC08_Die_Shot_(4x2-Input_AND_Gate).png")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: Klassenarbeiten ausgewertet, Fehlertypen bestimmt", 0),
    ("Heute: Übung an **Anwendungsfällen** quer durch Lernbereich 1 und 2", 0),
    ("Leitfrage: Welches Wissen brauche ich, um einen **echten Fall** zu lösen?", 0),
    ("Arbeitsweise: erst allein lösen, dann mit der Partnerin vergleichen", 0),
])

d.table_top("Kurz wiederholt: Rechnergenerationen", [
    ["Generation", "Schaltelement"],
    ["1.", "Elektronenröhren"],
    ["2.", "Transistoren"],
    ["3.", "integrierte Schaltkreise"],
    ["4.", "Mikroprozessoren"],
], [200, 616], [
    ("Davor rechnete die Z3 mit Relais — schon **binär**", 0),
    ("**Von-Neumann-Prinzip**: Programm und Daten liegen im **selben Speicher**", 0),
    ("Röntgenbilder automatisch auswerten: **angewandte** Informatik (Medizininformatik)", 0),
], font_size=11, bold_cols=(0,),
   marks={(3, 1): TINT_ORANGE})

d.table_top("Fall: Wie groß ist das Foto?", [
    ["Schritt", "Rechnung", "Ergebnis"],
    ["Bildpunkte", "800 × 600", "480 000"],
    ["Byte je Punkt", "24 Bit : 8", "3 Byte"],
    ["Größe", "480 000 × 3 Byte", "1 440 000 Byte, rund 1,4 MB"],
], [220, 290, 306], [
    ("Typische Falle: 1 440 000 **Bit** — die Einheit gehört zur Antwort", 0),
    ("Beim Scannen: Punkte pro Zoll sind die Abtastung, Graustufen je Punkt die **Quantisierung**", 0),
], font_size=11, bold_cols=(0,),
   marks={(3, 2): TINT_GREEN})

d.bullets("Digitalisieren und deuten", [
    ("Reihenfolge immer: **abtasten, quantisieren, codieren**", 0),
    ("Mit 1 Bit je Bildpunkt gibt es nur Schwarz und Weiß", 0),
    ("**Daten** werden gedeutet zu **Information**, verknüpfte Information wird zu **Wissen**", 0),
    ("37,5 ist ein Datum — als Körpertemperatur wird es Information", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Informationen finden und prüfen", "Quellen, Statistiken, Suchmaschinen",
          image="img/uebung2-lupe.jpg",
          credit="Lupe auf einer Buchseite — Foto: Karbyn, CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Magnifying_glass_on_the_page_of_a_book.jpg")

d.table_top("Fälle zur Recherche", [
    ["Fall", "beste Antwort", "warum"],
    ["aktuelle Schülerzahl der Schule", "die Schulverwaltung", "Primärquelle, führt die Zahlen selbst"],
    ["75 Prozent Zustimmung", "Wie viele, wer befragt?", "bei 4 Befragten sind es 3 Personen"],
    ["erster Treffer der Suchmaschine", "kein Qualitätsbeweis", "Beliebtheit, Vorgeschichte, Bezahlung"],
    ["Wann höre ich auf zu suchen?", "bei Sättigung", "neue Suchen bringen vor allem Bekanntes"],
], [270, 250, 296], [
    ("Die Schulwebsite kann veraltet sein, eine Klassenumfrage misst etwas anderes", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 1): TINT_GREEN, (2, 1): TINT_GREEN, (3, 1): TINT_GREEN, (4, 1): TINT_GREEN})

d.bullets("Quellen richtig angeben", [
    ("Vollständig heißt: **Autor oder Herausgeber, Titel, URL und Abrufdatum**", 0),
    ("Muster: Herausgeber: Titel. URL, abgerufen am TT.MM.JJJJ", 0),
    ("Das **Abrufdatum**, weil sich Netzinhalte ändern", 0),
    ("Autor und Titel machen die Angabe auch ohne Klick verständlich", 0),
    ("So bleibt eure Arbeit **überprüfbar**", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Ordnen und veröffentlichen", "Ablage, Metadaten, CMS, Recht am Bild",
          image="img/uebung2-ordner.jpg",
          credit="Aktenordner im Regal — Foto: Mattes, gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Aktenordner,_stehend.jpg")

d.table_top("Fälle zu Ablage und Veröffentlichung", [
    ["Fall", "Problem oder Lösung"],
    ["Team legt dieselbe Datei in drei Ordnern ab", "Fassungen laufen auseinander, keine gilt — ein Ort, Verweise darauf"],
    ["Dokument ohne Titel, Autor, Datum", "kaum auffindbar — Metadaten machen es durchsuchbar"],
    ["Aussehen der ganzen Schulwebsite ändern", "CMS: Inhalt in der Datenbank, Gestaltung in Vorlagen"],
    ["Klassenfoto auf die Schulwebsite", "Einwilligung der Abgebildeten, bei Minderjährigen der Eltern"],
    ["ständige Push-Meldungen", "weniger Kanäle abonnieren, feste Lesezeiten"],
], [330, 486], [
    ("Beim Foto zählt das **Recht am eigenen Bild** — die Fotografin entscheidet nur über das Foto als Werk", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Der rote Faden: Informationsmanagement", [
    ("Zuerst den **Bedarf** klären — erst Kriterien festlegen, dann zählen oder suchen", 0),
    ("Beispiel: Welche Schulrechner sind zu ersetzen? Kriterien wie Alter, Leistung, Update-Versorgung", 0),
    ("**Aufbereiten** heißt: ordnen, zusammenfassen, verknüpfen, verständlich darstellen", 0),
    ("Ertrag: die **richtige Information zur richtigen Zeit am richtigen Ort**", 0),
])

d.merksatz("Einen Fall löst man, indem man zuerst die Frage klärt, sie dem passenden Fachbegriff zuordnet "
           "und die Antwort begründet — mit Einheit beim Rechnen und Abrufdatum bei der Quelle.")

d.bullets("Fun Facts", [
    ("Den ersten integrierten Schaltkreis baute **Jack Kilby** 1958 — dafür bekam er im Jahr 2000 den Physik-Nobelpreis", 0),
    ("Das Von-Neumann-Prinzip steht in einem Bericht von 1945 über den Rechner **EDVAC**", 0),
    ("**Gordon Moore** sagte 1965 voraus, dass sich die Zahl der Bauteile auf einem Chip regelmäßig verdoppelt", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Stationen**: an jeder Station ein Fall — allein lösen, dann mit der Partnerin vergleichen", 0),
    ("**Rechnen**: Wie groß ist ein Graustufenbild mit 1024 × 768 Bildpunkten und 8 Bit je Punkt?", 0),
    ("**Individuelle Förderung**: eure Fehlertypen aus der Klassenarbeit gezielt üben", 0),
    ("**PC-Kabinett**: für eine Webseite eurer Wahl eine vollständige Quellenangabe schreiben", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
