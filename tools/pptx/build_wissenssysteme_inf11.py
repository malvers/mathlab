#!/usr/bin/env python3
"""Informatik 11 (BGY), KW 22 (live plan): Exkurs Wissensmanagementsysteme (Schnuppern in
Wahlbereich 1) - explizites und implizites Wissen, Wiki, Groupware, Taxonomie, Thesaurus,
Ontologie, Lessons Learned.

Facts line up with the worksheet HTML/inf11test-wissenssysteme.html (20 Aufgaben). Follows on
from the LB 2 deck inf11-wissensmanagement (implizites Wissen). Chapter pictures from
Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-wissenssysteme.pptx")

d.title("Informatik — Grundkurs 11", "Wissen teilen",
        "Exkurs Wissensmanagementsysteme — Wiki, Ordnungssysteme und warum Menschen Wissen teilen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Wissen im Betrieb", "Explizit, implizit — und wer was weiß",
          image="img/wissenssysteme-werkzeug.jpg",
          credit="Alte Werkzeuge an der Werkstattwand — Foto: Syced, CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Old_tools_on_personal_workshop_wall_3.jpg")

d.bullets("Wo wir stehen", [
    ("Aus Lernbereich 2: Wissensmanagement organisiert zusätzlich zu Inhalten auch **Können und Erfahrung**", 0),
    ("Letzte Woche: Übung quer durch Lernbereich 1 und 2", 0),
    ("Heute ein Exkurs: Schnuppern in den Wahlbereich **Wissensmanagementsysteme**", 0),
    ("Leitfrage: Wie wird aus dem Wissen einzelner Köpfe etwas, das **alle finden**?", 0),
])

d.bullets("Wozu ein Wissensmanagementsystem?", [
    ("Vieles ist im Haus schon einmal gelöst worden — ohne Zugriff wird es **doppelt erarbeitet**", 0),
    ("Aufgabe: vorhandenes Wissen **auffindbar, teilbar und wiederverwendbar** machen", 0),
    ("Das System erleichtert das Finden — **denken** tut es nicht", 0),
    ("Erfolgszeichen: Neue finden Antworten, **ohne jemanden fragen** zu müssen", 0),
    ("Kein Erfolgsmaß: die Menge der gespeicherten Dokumente", 0),
])

d.two_cols("Explizit und implizit", [
    ("**Explizites Wissen**", 0),
    ("lässt sich aufschreiben", 1),
    ("Anleitung, Handbuch, FAQ", 1),
    ("wandert über Dokumente", 1),
], [
    ("**Implizites Wissen**", 0),
    ("steckt im Können", 1),
    ("das Gespür für einen Kunden", 1),
    ("wandert durch Zeigen und Nachmachen", 1),
])

d.bullets("Wenn sich Wissen nicht aufschreiben lässt", [
    ("**Wissenslandkarte**: eine Übersicht, wer im Haus über welches Wissen verfügt — der Verweis auf die Person", 0),
    ("**Community of Practice**: eine Gruppe, die sich freiwillig über ein Fachthema austauscht — um ein Thema, nicht um einen Auftrag", 0),
    ("**Lessons Learned**: ein Vorhaben bewusst auswerten — was soll beim nächsten Mal anders laufen?", 0),
    ("Das kennt ihr schon: die Reflexion am Ende eures Projekts", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Das Wiki", "Gemeinsam schreiben, laufend verbessern",
          image="img/wissenssysteme-wikibus.jpg",
          credit="Wiki-Wiki-Bus am Flughafen Honolulu — Foto: Andrew Laing, CC BY-SA 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:HNL_Wiki_Wiki_Bus.jpg")

d.bullets("Die Idee Wiki", [
    ("Viele schreiben **gemeinsam** und verbessern laufend", 0),
    ("Die **Versionsgeschichte** hält jede Änderung fest — nachvollziehbar und umkehrbar", 0),
    ("Fehler werden **nachträglich korrigiert** statt vorher verhindert", 0),
    ("Ein CMS setzt dagegen auf **Freigabe vor der Veröffentlichung** — kennt ihr aus Lernbereich 2", 0),
])

d.bullets("Regeln für ein lebendiges Wiki", [
    ("**Lieber unvollständig anfangen** als gar nicht schreiben", 0),
    ("Qualität entsteht durch viele kleine Verbesserungen", 0),
    ("Hohe Hürden — Freigabe, nur Chefs dürfen schreiben — führen zu **leeren Seiten**", 0),
    ("**Verknüpfungen** machen Zusammenhänge sichtbar und führen von Thema zu Thema", 0),
    ("Ein Link auf eine fehlende Seite ist zugleich ein Hinweis auf eine **Lücke**", 0),
])

d.table_top("Werkzeuge im Überblick", [
    ["Werkzeug", "wofür", "Beispiel"],
    ["Wiki", "gemeinsam schreiben, laufend verbessern", "Firmenwiki, Wikipedia"],
    ["Ablage mit Suche", "Dokumente wiederfinden", "Cloud-Ordner mit Metadaten"],
    ["Groupware", "Zusammenarbeit im Team", "Schulcloud mit Dateien, Kalender, Chat"],
    ["Wissenslandkarte", "Wer weiß was?", "Expertenverzeichnis"],
], [210, 320, 286], [
    ("**Groupware** unterstützt die Zusammenarbeit einer Gruppe — Wissen im Chat ist aber schwer wiederzufinden", 0),
    ("Deshalb: Ergebnisse aus dem Chat ins Wiki übertragen", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (3, 0): TINT_BLUE})

d.two_cols("Live-Demo: ein Artikel entsteht", [
    ("**Anlegen**", 0),
    ("einen Titel wählen, nach dem gesucht wird", 1),
    ("der erste Satz sagt, worum es geht", 1),
    ("Überschriften gliedern", 1),
], [
    ("**Vernetzen**", 0),
    ("auf verwandte Seiten verlinken", 1),
    ("Schlagworte vergeben", 1),
    ("in die Versionsgeschichte schauen", 1),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Ordnung ins Wissen", "Taxonomie, Thesaurus, Ontologie",
          image="img/wissenssysteme-linne.jpg",
          credit="Titelblatt von Linnés Systema Naturae, 1735 — gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Linn%C3%A9-Systema_Naturae_1735.jpg")

d.bullets("Warum Volltextsuche nicht reicht", [
    ("Die Volltextsuche findet **Wörter** — keine Bedeutungen und keine Synonyme", 0),
    ("Wer nach Auto sucht, findet Kraftfahrzeug nicht", 0),
    ("Umgekehrt findet Bank das Möbel und das Geldinstitut", 0),
    ("Eine gute Suche findet Wissen auch ohne Kenntnis der Ordnerstruktur — über die **Richtigkeit** sagt sie nichts", 0),
    ("**Metadaten** und Vokabulare schließen die Lücke", 0),
])

d.table_top("Vier Ordnungssysteme", [
    ["System", "Kennzeichen", "Beispiel"],
    ["Folksonomy", "Nutzer vergeben Schlagworte frei — flexibel, uneinheitlich", "Hashtags"],
    ["Taxonomie", "Hierarchie: jeder Begriff hat genau einen Oberbegriff", "Fahrzeug, Landfahrzeug, Auto, Kombi"],
    ["Thesaurus", "Synonyme auf einen Vorzugsbegriff, Ober- und Unterbegriffe", "Klient, Auftraggeber: siehe Kunde"],
    ["Ontologie", "zusätzlich Beziehungen — erlaubt Schlüsse", "Auto besteht aus Motor"],
], [160, 380, 276], [
    ("**Kontrollierte Vokabulare** sorgen dafür, dass dieselbe Sache immer gleich heißt", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_RED, (2, 0): TINT_ORANGE, (3, 0): TINT_GREEN, (4, 0): TINT_BLUE})

d.bullets("Von der Taxonomie zur Ontologie", [
    ("Die **Taxonomie** kennt nur Ober- und Unterbegriffe", 0),
    ("Die **Ontologie** kennt auch Beziehungen wie besteht aus oder wird hergestellt von", 0),
    ("Damit kann ein Rechner **Schlüsse ziehen**, nicht nur ordnen", 0),
    ("Ein Kombi ist ein Auto, ein Auto besteht aus einem Motor — also hat auch der Kombi einen Motor", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Menschen machen das System", "Vertrauen, Pflege, Übergabe",
          image="img/wissenssysteme-handschlag.jpg",
          credit="Handschlag — Foto: Tero Vesalainen, CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Handshake-2056021.jpg")

d.bullets("Warum Systeme scheitern", [
    ("Selten an der Technik", 0),
    ("Pflegen macht Aufwand, der **Nutzen** tritt erst später ein", 0),
    ("Wer einträgt, hat die Arbeit — wer sucht, den Nutzen", 0),
    ("Ohne **Anerkennung** für das Pflegen versandet es", 0),
    ("Ohne **Vertrauen** teilen Menschen ihr Wissen nicht — wer Nachteile fürchtet, behält es für sich", 0),
])

d.bullets("Wenn jemand geht", [
    ("Wissen **frühzeitig** übergeben, dokumentieren, die Nachfolge einarbeiten", 0),
    ("Übergabe braucht Zeit und **Überlappung**", 0),
    ("Implizites Wissen fällt erst im **gemeinsamen Arbeiten** auf", 0),
    ("Nach dem letzten Arbeitstag ist es zu spät", 0),
])

d.merksatz("Ein Wissensmanagementsystem macht Wissen auffindbar, teilbar und wiederverwendbar — "
           "Wiki und Thesaurus helfen, aber es lebt davon, dass Menschen einander vertrauen und mitschreiben.")

d.bullets("Fun Facts", [
    ("Das erste Wiki, das **WikiWikiWeb** von Ward Cunningham, ging 1995 online", 0),
    ("**wiki** ist Hawaiisch für schnell — Cunningham dachte an den Wiki-Wiki-Bus am Flughafen Honolulu", 0),
    ("Den Begriff implizites Wissen prägte **Michael Polanyi**: Wir wissen mehr, als wir zu sagen wissen", 0),
    ("**Carl von Linné** ordnete die Lebewesen in eine Hierarchie — der Mensch heißt seitdem Homo sapiens", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Live-Demo**: gemeinsam einen Artikel im Schul-Wiki anlegen und die Versionsgeschichte ansehen", 0),
    ("**Hands-on** zu zweit: einen Artikel zu einem Thema aus diesem Schuljahr schreiben — mit mindestens zwei Verknüpfungen", 0),
    ("**Gegenseitig verbessern**: den Artikel eines anderen Paares ergänzen — was zeigt die Versionsgeschichte?", 0),
    ("**Ordnen**: drei Schlagworte vergeben — haben andere dieselben Wörter benutzt?", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
