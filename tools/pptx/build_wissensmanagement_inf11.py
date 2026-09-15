#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 7 / KW 40 (live plan): Informations- und Wissensmanagement -
Informationsflut, Ablauf des Informationsmanagements (LB 2, Ustd. 3-4/16).

The cycle follows the worksheet HTML/inf11test-wissensmanagement.html (Bedarf klaeren,
beschaffen, aufbereiten, nutzen, bewerten) - that is what the pupils are asked. The plan row
names a second cut (Bedarf, Beschaffung, Bewertung, Aufbewahrung, Weitergabe); one slide says
that both describe the same idea. Chapter pictures from Wikimedia Commons, licence on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-wissensmanagement.pptx")

d.title("Informatik — Grundkurs 11", "Informationen managen",
        "Informationsflut, der Kreislauf des Informationsmanagements — und das Wissen in den Köpfen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Informationsflut", "Mehr, als man lesen kann",
          image="img/wissen-zeitungen.jpg",
          credit="Zeitungsstapel — Foto: Babak Farrokhi, CC BY 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Newspaper_Stack_(8582618448).jpg")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: Signal, Nachricht, Information, Daten — und wie aus der Welt Bits werden", 0),
    ("Heute die Frage danach: Wie geht man mit der **Menge** um?", 0),
    ("Leitfrage: Wie hat man die **richtige Information zur richtigen Zeit** — ohne darin zu ertrinken?", 0),
])

d.bullets("Was Informationsflut heißt", [
    ("Das Angebot an Informationen wächst **schneller, als es verarbeitet** werden kann", 0),
    ("**Information Overload**: Nachrichten und Meldungen verhindern konzentriertes Arbeiten", 0),
    ("Die Folge ist paradox: Mehr Information führt oft zu **schlechteren** Entscheidungen", 0),
    ("Am wirksamsten dagegen: **weniger Kanäle** abonnieren und **feste Zeiten** zum Lesen", 0),
])

d.two_cols("Euer eigener Medientag", [
    ("**Was kommt rein?**", 0),
    ("Messenger und Klassenchats", 1),
    ("Social Media und Videos", 1),
    ("Schulportal und Mails", 1),
    ("Push-Meldungen von Apps", 1),
], [
    ("**Was davon braucht ihr?**", 0),
    ("Wie viele Meldungen kamen gestern?", 1),
    ("Welche hättet ihr vermisst?", 1),
    ("Welche haben euch unterbrochen?", 1),
    ("Was lässt sich bündeln oder abbestellen?", 1),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Der Kreislauf", "Bedarf klären, beschaffen, aufbereiten, nutzen, bewerten",
          image="img/wissen-katalog.jpg",
          credit="Schlagwortkatalog einer Bibliothek — Foto: Dr. Marcus Gossler, CC BY-SA 3.0",
          credit_url="https://commons.wikimedia.org/wiki/File:Schlagwortkatalog.jpg")

d.table_top("Fünf Schritte des Informationsmanagements", [
    ["Schritt", "Leitfrage", "am Beispiel Referat"],
    ["Bedarf klären", "Wozu brauche ich es, wie genau?", "Thema eingrenzen, Umfang festlegen"],
    ["beschaffen", "Wo finde ich es?", "Bibliothek, Fachportal, Suchmaschine"],
    ["aufbereiten", "Wie wird es verständlich?", "ordnen, zusammenfassen, verknüpfen"],
    ["nutzen", "Wofür setze ich es ein?", "Vortrag, Handout, Folien"],
    ["bewerten", "Hat es getaugt?", "Rückmeldung: Was fehlte, was war zu viel?"],
], [170, 300, 346], [
    ("Die Bewertung steht am Ende, weil erst **nach der Nutzung** sichtbar wird, ob die Information getaugt hat", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_GREEN, (3, 0): TINT_BLUE, (4, 0): TINT_GREEN,
          (5, 0): TINT_RED})

d.bullets("Warum der Bedarf zuerst kommt", [
    ("Ohne klare Frage liefert jede Suche **zu viel — und zugleich das Falsche**", 0),
    ("Ein **Zeitplan** begrenzt die Suche und zwingt zur Entscheidung mit dem Gefundenen", 0),
    ("**Ziel und Adressat** klären: Dieselbe Information sieht für die Klasse anders aus als für den Chef", 0),
    ("Andere Bücher schneiden den Kreislauf anders: Bedarf, Beschaffung, Bewertung, Aufbewahrung, Weitergabe — **dieselbe Idee**", 0),
])

d.bullets("Wiederfinden ist so wichtig wie Finden", [
    ("Eine **Ablagestruktur**, die man nach Wochen noch versteht", 0),
    ("Sprechende Dateinamen, Datum vorn: **2027-03-12_projekt-recherche_v3.md**", 0),
    ("**Metadaten** — Autor, Datum, Schlagwörter — machen Dokumente durchsuchbar", 0),
    ("**Single Source of Truth**: jede Angabe an genau einer Stelle", 0),
    ("Dieselbe Datei in drei Ordnern: Die Fassungen laufen auseinander, und keiner weiß, **welche gilt**", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Wissen managen", "Was in den Köpfen steckt",
          image="img/wissen-zettelkasten.jpg",
          credit="Zettelkasten — Foto: Kai Schreiber, CC BY-SA 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Zettelkasten_(514941699).jpg")

d.two_cols("Information oder Wissen managen?", [
    ("**Informationsmanagement**", 0),
    ("organisiert Inhalte", 1),
    ("Dokumente, Daten, Ablage", 1),
    ("Frage: Wo steht es?", 1),
], [
    ("**Wissensmanagement**", 0),
    ("organisiert zusätzlich Können und Erfahrung", 1),
    ("von Menschen, nicht nur von Dateien", 1),
    ("Frage: Wer weiß, wie es geht?", 1),
])

d.bullets("Implizites Wissen", [
    ("**Implizites Wissen**: Können, das jemand besitzt, aber nur schwer in Worte fassen kann", 0),
    ("Beispiele: Fahrrad fahren, das Gespür einer Meisterin für ihr Werkstück", 0),
    ("Wissen nur in Köpfen hat einen Haken: Es **geht verloren**, wenn die Person den Betrieb verlässt", 0),
    ("Ein **Wissensmanagementsystem** macht Wissen auffindbar und teilbar — Wiki, FAQ, Einarbeitungsvideo", 0),
])

d.merksatz("Informationsmanagement heißt: Bedarf klären, beschaffen, aufbereiten, nutzen, "
           "bewerten — damit die richtige Information zur richtigen Zeit am richtigen Ort ist.")

d.bullets("Fun Facts", [
    ("Der Soziologe **Niklas Luhmann** arbeitete mit rund 90 000 Zetteln — seinen Zettelkasten nannte er einen Kommunikationspartner", 0),
    ("Schon die Bibliothek von **Alexandria** hatte einen Katalog: die Pinakes des Kallimachos", 0),
    ("Das Wort **Information** kommt vom lateinischen informare: eine Form geben, bilden", 0),
    ("In der **Dewey-Dezimalklassifikation** der Bibliotheken steht ganz vorn, bei 000, die Informatik", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Fallanalyse**: Nina soll bis Freitag ein Referat über E-Autos halten — und hat 47 offene Tabs", 0),
    ("In Partnerarbeit: An welchem Schritt des Kreislaufs reißt es bei Nina — und was hilft?", 0),
    ("**Ablaufschema** gemeinsam entwickeln: die fünf Schritte auf Karten, je mit einem konkreten Tipp", 0),
    ("**Selbstversuch**: einen Tag lang die Push-Meldungen zählen — welche hättet ihr vermisst?", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
